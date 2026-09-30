# Administrator Sequence Diagrams

Tài liệu này mô tả các sequence diagram cho luồng **Administrator** dựa trên SRS cập nhật và source implementation cuối cùng.

Nguồn đã đối chiếu:

- `docs/srs/OnlineHealthConsultationPlatform_SRS_v1.0.md`
- `OnlineHealthConsultation-Web/src/features/admin/apis/admin.api.ts`
- `OnlineHealthConsultation-Web/src/features/admin/redux/admin.saga.ts`
- `OnlineHealthConsultation-Web/src/features/reports/apis/reports.api.ts`
- `src/modules/identity/*`
- `src/modules/doctor/*`
- `src/modules/specialty/*`
- `src/modules/appointment/*`
- `src/modules/moderation/*`
- `src/modules/reporting/*`

Backend NestJS dùng global prefix `/api`. Các endpoint admin/reporting được bảo vệ bằng `JwtAuthGuard` và `RolesGuard` với `Role.ADMIN`; diagram chỉ ghi guard ở mức boundary để tránh nhiễu implementation.

## 1. Login

Administrator đăng nhập qua cùng `AuthController`/`AuthService` với các role khác. Sau khi thành công, frontend điều hướng về dashboard admin.

```mermaid
sequenceDiagram
  autonumber
  actor Admin as Administrator
  participant UI as React UI - LoginPage
  participant API as API Client - auth.api
  participant Controller as NestJS Controller - AuthController
  participant Auth as Service - AuthService
  participant Users as Service - UsersService
  participant DB as Prisma/PostgreSQL

  Admin->>UI: Submit admin credentials
  UI->>API: login(credentials)
  API->>Controller: POST /api/auth/login
  Controller->>Auth: login(dto, userAgent, ip)
  Auth->>Users: findByEmail(email)
  Users->>DB: user.findUnique(email)
  DB-->>Users: admin user with passwordHash
  Users-->>Auth: user
  Auth->>Auth: bcrypt.compare(password)
  alt Credentials valid and account active
    Auth->>DB: userSession.create(refreshTokenHash)
    Auth->>DB: auditLog.create(LOGIN_SUCCESS)
    Auth-->>Controller: accessToken, refreshToken, user
    Controller-->>API: 200 OK + Set-Cookie refresh token
    API-->>UI: normalized user + accessToken
    UI-->>Admin: Navigate to admin dashboard
  else Invalid credentials or disabled account
    Auth-->>Controller: UnauthorizedException
    Controller-->>API: 401 Unauthorized
    API-->>UI: error message
    UI-->>Admin: Show login error
  end
```

## 2. Manage Patient Account

Admin patient management is implemented through `AdminUserController` using role-filtered `/api/admin/users` endpoints. Delete/deactivate is a status update in the frontend patient flow.

```mermaid
sequenceDiagram
  autonumber
  actor Admin as Administrator
  participant UI as React UI - PatientsManagePage
  participant API as API Client - admin.api
  participant Controller as NestJS Controller - AdminUserController
  participant Service as Service - UsersService
  participant DB as Prisma/PostgreSQL

  Admin->>UI: Open patient management
  UI->>API: getPatients(filters)
  API->>Controller: GET /api/admin/users?role=PATIENT
  Controller->>Controller: JwtAuthGuard + RolesGuard(ADMIN)
  Controller->>Service: listUsers(query)
  Service->>DB: user.findMany(role=PATIENT, filters)
  Service->>DB: user.count(same filters)
  DB-->>Service: patient users + total
  Service-->>Controller: paged users
  Controller-->>API: 200 OK
  API-->>UI: normalized patients
  UI-->>Admin: Render patient table

  alt Create patient
    Admin->>UI: Submit new patient
    UI->>API: createPatient(data)
    API->>Controller: POST /api/admin/users
    Controller->>Service: createUserByAdmin(adminId, role=PATIENT)
    Service->>DB: user.findUnique(email)
    Service->>DB: transaction(user.create, patientProfile.create)
    Service->>DB: auditLog.create(USER_CREATED_BY_ADMIN)
    DB-->>Service: created patient user
    Service-->>Controller: user
    Controller-->>API: 201 Created
    API-->>UI: patient
  else Update patient
    Admin->>UI: Edit patient fields
    UI->>API: updatePatient(userId, data)
    API->>Controller: PATCH /api/admin/users/{userId}
    Controller->>Service: updateUserByAdmin(adminId, userId, dto)
    Service->>DB: user.findUnique(userId)
    Service->>DB: user.update(email/name/isActive)
    opt isActive=false
      Service->>DB: userSession.updateMany(revokedAt)
    end
    Service->>DB: auditLog.create(USER_UPDATED_BY_ADMIN)
    Service-->>Controller: updated user
    Controller-->>API: 200 OK
    API-->>UI: patient
  else Deactivate patient
    Admin->>UI: Deactivate patient
    UI->>API: deletePatient(userId)
    API->>Controller: PATCH /api/admin/users/{userId}/status
    Controller->>Service: updateUserStatus(adminId, userId, isActive=false)
    Service->>DB: user.update(isActive=false, deletedAt)
    Service->>DB: userSession.updateMany(revokedAt)
    Service->>DB: auditLog.create(USER_DEACTIVATED)
    Service-->>Controller: updated user
    Controller-->>API: 200 OK
    API-->>UI: success
  end

  UI-->>Admin: Show management result toast
```

## 3. Manage Doctor Account

Doctor management combines user account endpoints and doctor profile endpoints. Frontend may call multiple backend endpoints in one "update doctor" action.

```mermaid
sequenceDiagram
  autonumber
  actor Admin as Administrator
  participant UI as React UI - DoctorsManagePage
  participant API as API Client - admin.api
  participant UserController as NestJS Controller - AdminUserController
  participant DoctorController as NestJS Controller - DoctorController
  participant Users as Service - UsersService
  participant Doctors as Service - DoctorService
  participant DB as Prisma/PostgreSQL

  Admin->>UI: Open doctor management
  UI->>API: getDoctors(filters)
  API->>DoctorController: GET /api/admin/doctors
  DoctorController->>DoctorController: JwtAuthGuard + RolesGuard(ADMIN)
  DoctorController->>Doctors: listDoctorsForAdmin(query)
  Doctors->>DB: doctorProfile.findMany(filters, include user/specialties)
  Doctors->>DB: doctorProfile.count(same filters)
  DB-->>Doctors: doctors + total
  Doctors-->>DoctorController: paged doctors
  DoctorController-->>API: 200 OK
  API-->>UI: normalized doctors
  UI-->>Admin: Render doctor table

  alt Create doctor
    Admin->>UI: Submit doctor account
    UI->>API: createDoctor(data)
    API->>UserController: POST /api/admin/users
    UserController->>Users: createUserByAdmin(adminId, role=DOCTOR)
    Users->>DB: transaction(user.create, doctorProfile.create, doctorSpecialty.create)
    Users->>DB: auditLog.create(USER_CREATED_BY_ADMIN)
    Users-->>UserController: created user
    UserController-->>API: 201 Created
    API-->>UI: created doctor user
  else Update doctor profile/specialty/approval
    Admin->>UI: Save doctor changes
    opt Basic user fields changed
      UI->>API: PATCH /api/admin/users/{userId}
      API->>UserController: PATCH /api/admin/users/{userId}
      UserController->>Users: updateUserByAdmin(adminId, userId, dto)
      Users->>DB: user.update + auditLog.create
      UserController-->>API: 200 OK
    end
    opt Professional fields changed
      API->>DoctorController: PATCH /api/admin/doctors/{doctorId}/profile
      DoctorController->>Doctors: updateDoctorProfileForAdmin(doctorId, dto, adminId)
      Doctors->>DB: doctorProfile.update
      Doctors->>DB: auditLog.create(DOCTOR_PROFILE_UPDATED_BY_ADMIN)
      DoctorController-->>API: 200 OK
    end
    opt Specialty changed
      API->>DoctorController: PATCH /api/admin/doctors/{doctorId}/specialties
      DoctorController->>Doctors: updateDoctorSpecialtiesForAdmin(doctorId, specialtyIds, adminId)
      Doctors->>DB: specialty.findMany(active ids)
      Doctors->>DB: transaction(deleteMany doctorSpecialty, createMany)
      Doctors->>DB: auditLog.create(DOCTOR_SPECIALTIES_UPDATED_BY_ADMIN)
      DoctorController-->>API: 200 OK
    end
    opt Approval or active status changed
      API->>DoctorController: PATCH /api/admin/doctors/{doctorId}/approval
      DoctorController->>Doctors: updateDoctorApproval(doctorId, dto, adminId)
      Doctors->>DB: doctorProfile.update(approvalStatus, isActive)
      Doctors->>DB: auditLog.create(DOCTOR_APPROVAL_UPDATED)
      DoctorController-->>API: 200 OK
    end
    API-->>UI: latest doctor profile
  else Disable doctor
    Admin->>UI: Disable doctor
    UI->>API: deleteDoctor(doctorId)
    API->>DoctorController: PATCH /api/admin/doctors/{doctorId}/approval
    DoctorController->>Doctors: updateDoctorApproval(REJECTED, isActive=false)
    Doctors->>DB: doctorProfile.update
    Doctors->>DB: auditLog.create(DOCTOR_APPROVAL_UPDATED)
    DoctorController-->>API: 200 OK
    API-->>UI: success
  end

  UI-->>Admin: Show doctor management result
```

## 4. Manage Specialty

Specialty CRUD is implemented by `SpecialtyController` under `/api/admin/specialties`; delete in frontend is a deactivate operation.

```mermaid
sequenceDiagram
  autonumber
  actor Admin as Administrator
  participant UI as React UI - SpecialtiesManagePage
  participant API as API Client - admin.api
  participant Controller as NestJS Controller - SpecialtyController
  participant Service as Service - SpecialtyService
  participant DB as Prisma/PostgreSQL

  Admin->>UI: Open specialty management
  UI->>API: getSpecialties()
  API->>Controller: GET /api/admin/specialties
  Controller->>Controller: JwtAuthGuard + RolesGuard(ADMIN)
  Controller->>Service: listAll()
  Service->>DB: specialty.findMany(orderBy nameEn)
  DB-->>Service: specialties
  Service-->>Controller: specialties
  Controller-->>API: 200 OK
  API-->>UI: specialties
  UI-->>Admin: Render specialty table

  alt Create specialty
    Admin->>UI: Submit new specialty
    UI->>API: createSpecialty(data)
    API->>Controller: POST /api/admin/specialties
    Controller->>Service: create(dto)
    Service->>DB: specialty.create(isActive=true)
    DB-->>Service: specialty
    Service-->>Controller: specialty
    Controller-->>API: 201 Created
    API-->>UI: specialty
  else Update specialty
    Admin->>UI: Edit specialty
    UI->>API: updateSpecialty(id, data)
    API->>Controller: PATCH /api/admin/specialties/{id}
    Controller->>Service: update(id, dto)
    Service->>DB: specialty.findUnique(id)
    Service->>DB: specialty.update(nameEn, nameVi, description, isActive)
    Service-->>Controller: specialty
    Controller-->>API: 200 OK
    API-->>UI: specialty
  else Deactivate specialty
    Admin->>UI: Deactivate specialty
    UI->>API: deleteSpecialty(id)
    API->>Controller: PATCH /api/admin/specialties/{id}/deactivate
    Controller->>Service: deactivate(id)
    Service->>DB: specialty.findUnique(id)
    Service->>DB: specialty.update(isActive=false)
    Service-->>Controller: specialty
    Controller-->>API: 200 OK
    API-->>UI: success
  end

  UI-->>Admin: Show specialty management result
```

## 5. Manage Appointment

Admin lists appointments through `/api/admin/appointments` and updates status through `/api/admin/appointments/{id}/status`.

```mermaid
sequenceDiagram
  autonumber
  actor Admin as Administrator
  participant UI as React UI - AppointmentsManagePage
  participant API as API Client - admin.api
  participant Controller as NestJS Controller - AdminAppointmentController
  participant Service as Service - AppointmentService
  participant DB as Prisma/PostgreSQL

  Admin->>UI: Open appointments with filters
  UI->>API: getAppointments(filters)
  API->>Controller: GET /api/admin/appointments
  Controller->>Controller: JwtAuthGuard + RolesGuard(ADMIN)
  Controller->>Service: listAllAppointments(query)
  Service->>DB: transaction(appointment.findMany, appointment.count)
  DB-->>Service: appointments + total
  Service-->>Controller: paged appointments
  Controller-->>API: 200 OK
  API-->>UI: normalized appointments
  UI-->>Admin: Render appointment list

  opt Update appointment status
    Admin->>UI: Change appointment status
    UI->>API: updateAppointmentStatus(id, status)
    API->>Controller: PATCH /api/admin/appointments/{id}/status
    Controller->>Service: adminUpdateAppointmentStatus(adminId, appointmentId, status)
    Service->>DB: appointment.findUnique(include patient, doctor)
    Service->>DB: transaction
    Service->>DB: appointment.update(status)
    Service->>DB: auditLog.create(APPOINTMENT_STATUS_UPDATED_BY_ADMIN)
    Service->>DB: notificationLog.createMany(patient and doctor)
    DB-->>Service: updated appointment
    Service-->>Controller: appointment
    Controller-->>API: 200 OK
    API-->>UI: updated appointment
    UI-->>Admin: Show status update toast
  end
```

## 6. Moderate Health Question/Response

Questions and answers are loaded through the unified moderation list. Question moderation updates question status and creates `QuestionModeration`; answer moderation toggles `Answer.isApproved`.

```mermaid
sequenceDiagram
  autonumber
  actor Admin as Administrator
  participant UI as React UI - ModerationPage
  participant API as API Client - admin.api
  participant Controller as NestJS Controller - ModerationController
  participant Service as Service - ModerationService
  participant DB as Prisma/PostgreSQL

  Admin->>UI: Open moderation queue
  UI->>API: getModerationItems()
  API->>Controller: GET /api/admin/moderation/items
  Controller->>Controller: JwtAuthGuard + RolesGuard(ADMIN)
  Controller->>Service: listItems(query)
  par Questions
    Service->>DB: question.findMany(include patient, doctor, answers)
  and Answers
    Service->>DB: answer.findMany(include doctor and question.patient)
  end
  DB-->>Service: reviewable question/answer items
  Service-->>Controller: moderation items
  Controller-->>API: 200 OK
  API-->>UI: items
  UI-->>Admin: Render queue

  alt Moderate question
    Admin->>UI: Approve/restore/hide/close question
    UI->>API: PATCH /api/admin/moderation/items/QUESTION/{questionId}
    API->>Controller: moderateItem(type=QUESTION, action)
    Controller->>Service: moderateItem(adminId, QUESTION, questionId, dto)
    Service->>DB: user.findUnique(adminId)
    Service->>DB: question.findUnique(include answers)
    Service->>DB: transaction
    Service->>DB: question.update(status)
    Service->>DB: questionModeration.create(action, reason)
    Service->>DB: auditLog.create(QUESTION_MODERATED)
    Service-->>Controller: updated question
    Controller-->>API: 200 OK
  else Moderate answer
    Admin->>UI: Approve/restore/hide answer
    UI->>API: PATCH /api/admin/moderation/items/ANSWER/{answerId}
    API->>Controller: moderateItem(type=ANSWER, action)
    Controller->>Service: moderateItem(adminId, ANSWER, answerId, dto)
    Service->>DB: user.findUnique(adminId)
    Service->>DB: answer.findUnique(answerId)
    Service->>DB: answer.update(isApproved)
    Service->>DB: auditLog.create(ANSWER_MODERATED)
    Service-->>Controller: updated answer
    Controller-->>API: 200 OK
  end

  API-->>UI: moderation result
  UI->>API: getModerationItems()
  API-->>UI: refreshed queue
  UI-->>Admin: Show moderation toast
```

## 7. Moderate Rating/Comment

Rating/comment moderation uses the same moderation endpoint with type `RATING`. Implementation maps `HIDE` to `RatingStatus.HIDDEN`; approve/restore maps to `VISIBLE`.

```mermaid
sequenceDiagram
  autonumber
  actor Admin as Administrator
  participant UI as React UI - ModerationPage
  participant API as API Client - admin.api
  participant Controller as NestJS Controller - ModerationController
  participant Service as Service - ModerationService
  participant DB as Prisma/PostgreSQL

  Admin->>UI: Open moderation queue
  UI->>API: getModerationItems()
  API->>Controller: GET /api/admin/moderation/items
  Controller->>Controller: JwtAuthGuard + RolesGuard(ADMIN)
  Controller->>Service: listItems(query)
  Service->>DB: rating.findMany(include patient, doctor, appointment)
  DB-->>Service: rating moderation items
  Service-->>Controller: items
  Controller-->>API: 200 OK
  API-->>UI: rating/comment items
  UI-->>Admin: Render rating items

  Admin->>UI: Approve/restore/hide rating
  UI->>API: PATCH /api/admin/moderation/items/RATING/{ratingId}
  API->>Controller: moderateItem(type=RATING, action)
  Controller->>Service: moderateItem(adminId, RATING, ratingId, dto)
  Service->>DB: user.findUnique(adminId)
  Service->>DB: rating.findUnique(ratingId)
  alt Rating exists and action is supported
    Service->>DB: rating.update(status=VISIBLE or HIDDEN)
    Service->>DB: auditLog.create(RATING_MODERATED)
    Service-->>Controller: updated rating
    Controller-->>API: 200 OK
    API-->>UI: moderation result
    UI->>API: getModerationItems()
    API-->>UI: refreshed queue
    UI-->>Admin: Show moderation toast
  else Rating missing or unsupported CLOSE action
    Service-->>Controller: 400/404 error
    Controller-->>API: error response
    API-->>UI: error message
    UI-->>Admin: Show moderation error
  end
```

## 8. View Dashboard

Admin dashboard stats call `/api/reports/dashboard`. `ReportingService` runs aggregate/count queries in parallel.

```mermaid
sequenceDiagram
  autonumber
  actor Admin as Administrator
  participant UI as React UI - AdminDashboardPage
  participant API as API Client - admin.api
  participant Controller as NestJS Controller - ReportingController
  participant Service as Service - ReportingService
  participant DB as Prisma/PostgreSQL

  Admin->>UI: Open admin dashboard
  UI->>API: getStats()
  API->>Controller: GET /api/reports/dashboard
  Controller->>Controller: JwtAuthGuard + RolesGuard(ADMIN)
  Controller->>Service: getDashboard(query)
  Service->>Service: parseTimeRange(query)
  par Counts and grouped metrics
    Service->>DB: consultationSession.count/groupBy
    Service->>DB: appointment.count/groupBy
    Service->>DB: user.count(total/active/roles)
    Service->>DB: doctorProfile.count(active)
    Service->>DB: specialty.count()
    Service->>DB: question.count(total/pending/answered)
    Service->>DB: rating.count()
  end
  DB-->>Service: aggregate metrics
  Service-->>Controller: dashboard metrics
  Controller-->>API: 200 OK
  API-->>UI: normalized stats
  UI-->>Admin: Render dashboard cards/charts
```

## 9. Filter/View Consultation Reporting

Reports page calls dashboard metrics and consultation trend endpoints with `from`, `to` and `groupBy` filters.

```mermaid
sequenceDiagram
  autonumber
  actor Admin as Administrator
  participant UI as React UI - ReportsPage
  participant API as API Client - reports.api
  participant Controller as NestJS Controller - ReportingController
  participant Service as Service - ReportingService
  participant DB as Prisma/PostgreSQL

  Admin->>UI: Select report filters
  UI->>API: getStatistics(from, to, groupBy)
  API->>Controller: GET /api/reports/dashboard
  Controller->>Controller: JwtAuthGuard + RolesGuard(ADMIN)
  Controller->>Service: getDashboard(query)
  Service->>Service: parseTimeRange(query)
  Service->>DB: counts/groupBy using date filters
  DB-->>Service: filtered metrics
  Service-->>Controller: dashboard metrics
  Controller-->>API: 200 OK
  API-->>UI: normalized statistics

  UI->>API: getAppointmentsChart(from, to, groupBy)
  API->>Controller: GET /api/reports/consultations/trend
  Controller->>Service: getConsultationTrend(query)
  Service->>Service: parseTimeRange(query)
  Service->>DB: consultationSession.findMany(date filter)
  DB-->>Service: consultation timestamps
  Service->>Service: bucket by day/week/month
  Service-->>Controller: trend points
  Controller-->>API: 200 OK
  API-->>UI: chart data
  UI-->>Admin: Render filtered reporting view
```

## Notes

- Admin account management uses `AdminUserController`; patient-specific management is currently user-account based rather than a separate admin patient profile endpoint.
- Doctor management can fan out to several endpoints because frontend update combines user fields, profile fields, specialties and approval/active status.
- Specialty delete is implemented as deactivate, not physical deletion.
- Appointment status updates write `AuditLog` and create notification logs for patient and doctor.
- Moderation has one unified controller/service for questions, answers and ratings.
- Reporting is read-only and implemented in the modular monolith through `ReportingModule`, not an external analytics service.
