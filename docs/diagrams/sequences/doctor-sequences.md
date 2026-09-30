# Doctor Sequence Diagrams

Tài liệu này mô tả các sequence diagram cho luồng **Doctor** dựa trên SRS cập nhật và source implementation cuối cùng.

Nguồn đã đối chiếu:

- `docs/srs/OnlineHealthConsultationPlatform_SRS_v1.0.md`
- `OnlineHealthConsultation-Web/src/features/auth/apis/auth.api.ts`
- `OnlineHealthConsultation-Web/src/features/doctor/apis/doctor.api.ts`
- `OnlineHealthConsultation-Web/src/features/doctor/redux/doctor.saga.ts`
- `OnlineHealthConsultation-Web/src/features/consultation/realtime/*`
- `src/modules/identity/*`
- `src/modules/doctor/*`
- `src/modules/question/*`
- `src/modules/appointment/*`
- `src/modules/consultation/*`

Backend NestJS dùng global prefix `/api`. Các endpoint doctor/patient/consultation được bảo vệ bằng `JwtAuthGuard` và `RolesGuard`; diagram chỉ ghi guard ở mức boundary, không liệt kê decorator/DTO/helper private khi không ảnh hưởng đến luồng chính.

## 1. Login

Doctor đăng nhập qua cùng auth flow với các role khác. Backend tạo `UserSession`, trả access token và set HttpOnly refresh cookie.

```mermaid
sequenceDiagram
  autonumber
  actor Doctor
  participant UI as React UI - LoginPage
  participant API as API Client - auth.api
  participant Controller as NestJS Controller - AuthController
  participant Auth as Service - AuthService
  participant Users as Service - UsersService
  participant DB as Prisma/PostgreSQL

  Doctor->>UI: Submit email and password
  UI->>API: login(credentials)
  API->>Controller: POST /api/auth/login
  Controller->>Auth: login(dto, userAgent, ip)
  Auth->>Users: findByEmail(email)
  Users->>DB: user.findUnique(email)
  DB-->>Users: doctor user with passwordHash
  Users-->>Auth: user
  Auth->>Auth: bcrypt.compare(password)
  alt Credentials valid and account active
    Auth->>DB: userSession.create(refreshTokenHash)
    Auth->>DB: auditLog.create(LOGIN_SUCCESS)
    Auth-->>Controller: accessToken, refreshToken, user
    Controller-->>API: 200 OK + Set-Cookie refresh token
    API-->>UI: normalized user + accessToken
    UI-->>Doctor: Navigate to doctor dashboard
  else Invalid credentials or disabled account
    Auth-->>Controller: UnauthorizedException
    Controller-->>API: 401 Unauthorized
    API-->>UI: error message
    UI-->>Doctor: Show login error
  end
```

## 2. Update Professional Profile

Doctor profile update gọi `PATCH /api/doctors/me/profile`. Frontend `updateProfile()` sau đó gọi lại `GET /api/doctors/me/profile` để lấy profile mới; nếu có `specialtyId`, frontend gọi thêm endpoint specialties.

```mermaid
sequenceDiagram
  autonumber
  actor Doctor
  participant UI as React UI - DoctorProfilePage
  participant API as API Client - doctor.api
  participant Controller as NestJS Controller - DoctorController
  participant Service as Service - DoctorService
  participant DB as Prisma/PostgreSQL

  Doctor->>UI: Edit professional profile and save
  UI->>API: updateProfile(profile fields)
  API->>Controller: PATCH /api/doctors/me/profile
  Controller->>Controller: JwtAuthGuard + RolesGuard(DOCTOR)
  Controller->>Service: updateMyProfile(currentUser.sub, dto)
  Service->>DB: doctorProfile.findUnique(userId)
  alt Doctor profile exists
    Service->>DB: doctorProfile.update(bio, qualificationSummary, consultationDescription, yearsOfExperience, isActive)
    DB-->>Service: updated profile with user and specialties
    Service-->>Controller: profile
    Controller-->>API: 200 OK
    opt Specialty changed from UI
      API->>Controller: PATCH /api/doctors/me/specialties
      Controller->>Service: updateMySpecialties(currentUser.sub, specialtyIds)
      Service->>DB: specialty.findMany(active ids)
      Service->>DB: transaction(deleteMany doctorSpecialty, createMany)
      Service->>DB: getMyProfile(userId)
      DB-->>Service: refreshed profile
      Service-->>Controller: profile
      Controller-->>API: 200 OK
    end
    API->>Controller: GET /api/doctors/me/profile
    Controller->>Service: getMyProfile(currentUser.sub)
    Service->>DB: doctorProfile.findUnique + stats transaction
    DB-->>Service: fresh profile and stats
    Service-->>Controller: profile
    Controller-->>API: 200 OK
    API-->>UI: fresh DoctorProfile
    UI-->>Doctor: Show saved toast
  else Profile missing
    Service-->>Controller: NotFoundException
    Controller-->>API: 404 error
    API-->>UI: error message
    UI-->>Doctor: Show save error
  end
```

## 3. Update Working Schedule

Doctor schedule page loads schedule from profile, saves via `PATCH /api/doctors/me/schedule`, then reloads profile schedule.

```mermaid
sequenceDiagram
  autonumber
  actor Doctor
  participant UI as React UI - SchedulePage
  participant API as API Client - doctor.api
  participant Controller as NestJS Controller - DoctorController
  participant Service as Service - DoctorService
  participant DB as Prisma/PostgreSQL

  Doctor->>UI: Open or edit schedule
  UI->>API: getSchedule()
  API->>Controller: GET /api/doctors/me/profile
  Controller->>Controller: JwtAuthGuard + RolesGuard(DOCTOR)
  Controller->>Service: getMyProfile(currentUser.sub)
  Service->>DB: doctorProfile.findUnique(include specialties)
  Service->>DB: transaction(question count, appointment count, rating aggregate)
  DB-->>Service: profile with schedule
  Service-->>Controller: profile
  Controller-->>API: 200 OK
  API-->>UI: normalized schedule

  Doctor->>UI: Save schedule slots
  UI->>API: updateSchedule(schedule)
  API->>Controller: PATCH /api/doctors/me/schedule
  Controller->>Service: updateMySchedule(currentUser.sub, dto)
  Service->>DB: doctorProfile.findUnique(userId)
  alt Profile exists
    Service->>DB: doctorProfile.update(schedule, scheduleUpdatedAt)
    DB-->>Service: updated profile
    Service-->>Controller: updated profile
    Controller-->>API: 200 OK
    API->>Controller: GET /api/doctors/me/profile
    Controller->>Service: getMyProfile(currentUser.sub)
    Service->>DB: doctorProfile.findUnique + stats transaction
    DB-->>Service: fresh profile
    Service-->>Controller: fresh profile
    Controller-->>API: 200 OK
    API-->>UI: refreshed schedule
    UI-->>Doctor: Show schedule saved toast
  else Profile missing
    Service-->>Controller: NotFoundException
    Controller-->>API: 404 error
    API-->>UI: error message
    UI-->>Doctor: Show schedule error
  end
```

## 4. View Health Questions

Doctor xem câu hỏi qua `GET /api/questions/assigned`. Service trả câu hỏi được gán cho doctor hoặc câu hỏi mở chưa gán, loại câu hỏi đã moderated.

```mermaid
sequenceDiagram
  autonumber
  actor Doctor
  participant UI as React UI - InboxQuestionsPage
  participant API as API Client - doctor.api
  participant Controller as NestJS Controller - QuestionController
  participant Service as Service - QuestionService
  participant DB as Prisma/PostgreSQL

  Doctor->>UI: Open question inbox
  UI->>API: getQuestions()
  API->>Controller: GET /api/questions/assigned
  Controller->>Controller: JwtAuthGuard + RolesGuard(DOCTOR)
  Controller->>Service: listDoctorQuestions(currentUser.sub)
  Service->>DB: doctorProfile.findUnique(userId)
  alt Doctor profile exists
    Service->>DB: question.findMany(assigned to doctor OR open pending, not MODERATED)
    DB-->>Service: questions with patient and approved answers
    Service-->>Controller: questions
    Controller-->>API: 200 OK
    API-->>UI: normalized questions
    UI-->>Doctor: Render inbox
  else Profile missing
    Service-->>Controller: NotFoundException
    Controller-->>API: 404 error
    API-->>UI: error message
    UI-->>Doctor: Show load error
  end
```

## 5. Respond To Health Question

Doctor trả lời câu hỏi qua `POST /api/questions/{id}/answers`. Service cập nhật question, tạo answer, audit log và outbox event trong transaction.

```mermaid
sequenceDiagram
  autonumber
  actor Doctor
  participant UI as React UI - AnswerEditor
  participant API as API Client - doctor.api
  participant Controller as NestJS Controller - QuestionController
  participant Service as Service - QuestionService
  participant DB as Prisma/PostgreSQL

  Doctor->>UI: Submit answer
  UI->>API: answerQuestion(questionId, answer)
  API->>Controller: POST /api/questions/{id}/answers
  Controller->>Controller: JwtAuthGuard + RolesGuard(DOCTOR)
  Controller->>Service: answerQuestion(currentUser.sub, questionId, dto)
  Service->>DB: doctorProfile.findUnique(userId)
  Service->>DB: question.findUnique(questionId)
  alt Question is pending and assignable
    Service->>DB: transaction
    Service->>DB: question.update(doctorId, status=ANSWERED)
    Service->>DB: answer.create(isApproved=true)
    Service->>DB: auditLog.create(QUESTION_ANSWERED_BY_DOCTOR)
    Service->>DB: outboxEvent.create(QUESTION_ANSWERED)
    Service->>DB: question.findUnique(include answers)
    DB-->>Service: answered question
    Service-->>Controller: answered question
    Controller-->>API: 201 Created
    API-->>UI: success
    UI->>API: getQuestions()
    API-->>UI: refreshed inbox
    UI-->>Doctor: Show answer submitted toast
  else Not found, not pending, or assigned to another doctor
    Service-->>Controller: 400/403/404 error
    Controller-->>API: error response
    API-->>UI: error message
    UI-->>Doctor: Show answer error
  end
```

## 6. View Appointments

Doctor appointment list gọi `GET /api/appointments/doctor/me`, có thể truyền status filter.

```mermaid
sequenceDiagram
  autonumber
  actor Doctor
  participant UI as React UI - DoctorAppointmentsPage
  participant API as API Client - doctor.api
  participant Controller as NestJS Controller - AppointmentController
  participant Service as Service - AppointmentService
  participant DB as Prisma/PostgreSQL

  Doctor->>UI: Open appointments
  UI->>API: getAppointments(status?)
  API->>Controller: GET /api/appointments/doctor/me
  Controller->>Controller: JwtAuthGuard + RolesGuard(DOCTOR)
  Controller->>Service: listDoctorAppointments(currentUser.sub, query)
  Service->>DB: doctorProfile.findUnique(userId)
  alt Doctor profile exists
    Service->>DB: appointment.findMany(doctorId, filters, include patient and specialties)
    DB-->>Service: appointments
    Service-->>Controller: appointments
    Controller-->>API: 200 OK
    API-->>UI: normalized appointments
    UI-->>Doctor: Render appointment table
  else Profile missing
    Service-->>Controller: NotFoundException
    Controller-->>API: 404 error
    API-->>UI: error message
    UI-->>Doctor: Show load error
  end
```

## 7. Confirm Appointment

Doctor confirm gọi `PATCH /api/appointments/{id}/confirm`. Service chỉ cho confirm appointment của chính doctor và đang `PENDING_CONFIRMATION`.

```mermaid
sequenceDiagram
  autonumber
  actor Doctor
  participant UI as React UI - DoctorAppointmentsPage
  participant API as API Client - doctor.api
  participant Controller as NestJS Controller - AppointmentController
  participant Service as Service - AppointmentService
  participant DB as Prisma/PostgreSQL

  Doctor->>UI: Confirm pending appointment
  UI->>API: updateAppointment(id, status=confirmed)
  API->>Controller: PATCH /api/appointments/{id}/confirm
  Controller->>Controller: JwtAuthGuard + RolesGuard(DOCTOR)
  Controller->>Service: confirmAppointment(currentUser.sub, appointmentId)
  Service->>DB: doctorProfile.findUnique(userId)
  Service->>DB: appointment.findUnique(id, include patient)
  alt Appointment belongs to doctor and is pending
    Service->>DB: transaction
    Service->>DB: appointment.update(status=CONFIRMED)
    Service->>DB: outboxEvent.create(APPOINTMENT_CONFIRMED)
    Service->>DB: auditLog.create(APPOINTMENT_CONFIRMED_BY_DOCTOR)
    DB-->>Service: updated appointment
    Service-->>Controller: updated appointment
    Controller-->>API: 200 OK
    API-->>UI: confirmed appointment
    UI->>API: getAppointments()
    API-->>UI: refreshed appointments
    UI-->>Doctor: Show appointment updated toast
  else Not found, forbidden, or wrong status
    Service-->>Controller: 400/403/404 error
    Controller-->>API: error response
    API-->>UI: error message
    UI-->>Doctor: Show confirm error
  end
```

## 8. Reschedule Appointment

Doctor reschedule gọi `PATCH /api/appointments/{id}/reschedule`. Service kiểm tra quyền doctor, trạng thái, thời gian tương lai, working schedule và overlap rồi cập nhật appointment.

```mermaid
sequenceDiagram
  autonumber
  actor Doctor
  participant UI as React UI - DoctorAppointmentsPage
  participant API as API Client - doctor.api
  participant Controller as NestJS Controller - AppointmentController
  participant Service as Service - AppointmentService
  participant DB as Prisma/PostgreSQL

  Doctor->>UI: Submit new appointment time
  UI->>API: rescheduleAppointment(id, scheduledAt)
  API->>Controller: PATCH /api/appointments/{id}/reschedule
  Controller->>Controller: JwtAuthGuard + RolesGuard(DOCTOR)
  Controller->>Service: rescheduleAppointment(currentUser.sub, appointmentId, scheduledAt)
  Service->>DB: doctorProfile.findUnique(userId, include user)
  Service->>DB: appointment.findUnique(id)
  Service->>Service: validate owner, status and future time
  Service->>DB: transaction
  Service->>DB: doctorProfile.findUnique(latest)
  Service->>Service: assert bookable doctor and working schedule
  Service->>DB: appointment.findMany(conflict window, exclude current)
  alt No conflict
    Service->>DB: appointment.update(scheduledAt, include detail)
    Service->>DB: auditLog.create(APPOINTMENT_RESCHEDULED_BY_DOCTOR)
    DB-->>Service: updated appointment
    Service-->>Controller: updated appointment
    Controller-->>API: 200 OK
    API-->>UI: rescheduled appointment
    UI->>API: getAppointments()
    API-->>UI: refreshed appointments
    UI-->>Doctor: Show reschedule success
  else Invalid state, time, schedule, or conflict
    Service-->>Controller: 400/403/404 error
    Controller-->>API: error response
    API-->>UI: error message
    UI-->>Doctor: Show reschedule error
  end
```

## 9. Start Consultation

Doctor starts consultation with `POST /api/consultations/{appointmentId}/start`. Service may confirm a pending appointment, then creates or updates `ConsultationSession`.

```mermaid
sequenceDiagram
  autonumber
  actor Doctor
  participant UI as React UI - ConsultationSessionPage
  participant API as API Client - doctor.api
  participant Controller as NestJS Controller - ConsultationController
  participant Service as Service - ConsultationService
  participant DB as Prisma/PostgreSQL

  Doctor->>UI: Start consultation
  UI->>API: startConsultation(appointmentId)
  API->>Controller: POST /api/consultations/{appointmentId}/start
  Controller->>Controller: JwtAuthGuard + RolesGuard(DOCTOR)
  Controller->>Service: startSession(currentUser.sub, appointmentId, channel=CHAT)
  Service->>DB: doctorProfile.findUnique(userId)
  Service->>DB: appointment.findUnique(include patient, doctor, session)
  Service->>Service: validate owner, startable status and consultation time window
  alt Appointment can start
    Service->>DB: transaction
    opt Appointment was pending confirmation
      Service->>DB: appointment.update(status=CONFIRMED)
    end
    alt Session does not exist
      Service->>DB: consultationSession.create(status=ONGOING, channel)
    else Session exists
      Service->>DB: consultationSession.update(status=ONGOING, startedAt, channel)
    end
    DB-->>Service: session
    Service-->>Controller: session + requestedChannel/fallbackToChat
    Controller-->>API: 201 Created
    API-->>UI: session metadata
    UI-->>Doctor: Render active consultation room
  else Not found, forbidden, wrong status, or outside time window
    Service-->>Controller: 400/403/404 error
    Controller-->>API: error response
    API-->>UI: error message
    UI-->>Doctor: Show start error
  end
```

## 10. Realtime Consultation Chat

Doctor realtime chat dùng Socket.IO namespace `/consultations`. Gateway xác thực JWT trong handshake, gọi `ConsultationService` để join room và persist message. REST send message vẫn tồn tại như fallback.

```mermaid
sequenceDiagram
  autonumber
  actor Doctor
  participant DoctorUI as Doctor UI
  participant REST as REST API
  participant Service as Consultation Service
  participant Gateway as Socket.IO Gateway
  participant PatientClient as Patient Client
  participant DB as Database

  Doctor->>DoctorUI: Open active consultation
  DoctorUI->>REST: POST /api/consultations/{appointmentId}/join
  REST->>Service: joinSession(userId, DOCTOR, appointmentId)
  Service->>DB: appointment/session + doctor access checks
  DB-->>Service: joinable session
  Service-->>REST: join result
  REST-->>DoctorUI: sessionId/status/channel

  DoctorUI->>Gateway: Connect /consultations with accessToken
  Gateway->>Gateway: verify JWT from handshake auth/header
  DoctorUI->>Gateway: consultation:join { appointmentId }
  Gateway->>Service: joinSession(userId, DOCTOR, appointmentId)
  Service->>DB: appointment/session + access checks
  DB-->>Service: join confirmed
  Service-->>Gateway: room and session metadata
  Gateway-->>DoctorUI: consultation:joined

  Doctor->>DoctorUI: Send chat message
  alt Socket connected and joined
    DoctorUI->>Gateway: consultation:message { appointmentId, content }
    Gateway->>Service: sendSessionMessage(userId, DOCTOR, appointmentId, content)
    Service->>DB: consultationMessage.create(senderUserId, content)
    DB-->>Service: persisted message
    Service-->>Gateway: message
    Gateway-->>DoctorUI: consultation:message
    Gateway-->>PatientClient: consultation:message
  else Socket unavailable
    DoctorUI->>REST: POST /api/consultations/{appointmentId}/messages
    REST->>Service: sendSessionMessage(userId, DOCTOR, appointmentId, content)
    Service->>DB: consultationMessage.create(senderUserId, content)
    DB-->>Service: persisted message
    Service-->>REST: message
    REST-->>DoctorUI: saved message
  end
```

## 11. Save Consultation Summary

Doctor saves the clinical summary through `PATCH /api/consultations/{appointmentId}/summary`. Service requires a session and doctor ownership.

```mermaid
sequenceDiagram
  autonumber
  actor Doctor
  participant UI as React UI - ConsultationSessionPage
  participant API as API Client - doctor.api
  participant Controller as NestJS Controller - ConsultationController
  participant Service as Service - ConsultationService
  participant DB as Prisma/PostgreSQL

  Doctor->>UI: Save consultation summary
  UI->>API: saveSummary(appointmentId, summary)
  API->>Controller: PATCH /api/consultations/{appointmentId}/summary
  Controller->>Controller: JwtAuthGuard + RolesGuard(DOCTOR)
  Controller->>Service: updateSummary(currentUser.sub, appointmentId, dto)
  Service->>DB: doctorProfile.findUnique(userId)
  Service->>DB: appointment.findUnique(include session)
  alt Session exists and belongs to doctor
    Service->>DB: consultationSession.update(summary)
    DB-->>Service: updated session
    Service-->>Controller: updated session
    Controller-->>API: 200 OK
    API-->>UI: updated summary
    UI-->>Doctor: Show saved state
  else Missing profile/session or forbidden
    Service-->>Controller: 403/404/400 error
    Controller-->>API: error response
    API-->>UI: error message
    UI-->>Doctor: Show summary error
  end
```

## 12. End Consultation

Doctor ends a session through `PATCH /api/consultations/{appointmentId}/end`. Service marks both session and appointment completed in one transaction.

```mermaid
sequenceDiagram
  autonumber
  actor Doctor
  participant UI as React UI - ConsultationSessionPage
  participant API as API Client - doctor.api
  participant Controller as NestJS Controller - ConsultationController
  participant Service as Service - ConsultationService
  participant DB as Prisma/PostgreSQL

  Doctor->>UI: End consultation
  UI->>API: endConsultation(appointmentId)
  API->>Controller: PATCH /api/consultations/{appointmentId}/end
  Controller->>Controller: JwtAuthGuard + RolesGuard(DOCTOR)
  Controller->>Service: endSession(currentUser.sub, appointmentId)
  Service->>DB: doctorProfile.findUnique(userId)
  Service->>DB: appointment.findUnique(include session)
  alt Session exists and belongs to doctor
    Service->>DB: transaction
    Service->>DB: consultationSession.update(status=COMPLETED, endedAt)
    Service->>DB: appointment.update(status=COMPLETED)
    Service->>DB: consultationSession.findUnique(appointmentId)
    DB-->>Service: completed session
    Service-->>Controller: completed session
    Controller-->>API: 200 OK
    API-->>UI: completed session
    UI-->>Doctor: Show completed consultation state
  else Missing profile/session or forbidden
    Service-->>Controller: 403/404/400 error
    Controller-->>API: error response
    API-->>UI: error message
    UI-->>Doctor: Show end-session error
  end
```

## 13. Create Prescription

Doctor creates or replaces prescription through `POST /api/consultations/{appointmentId}/prescriptions`. Implementation requires appointment status `COMPLETED`.

```mermaid
sequenceDiagram
  autonumber
  actor Doctor
  participant UI as React UI - ConsultationSessionPage
  participant API as API Client - doctor.api
  participant Controller as NestJS Controller - ConsultationController
  participant Service as Service - ConsultationService
  participant DB as Prisma/PostgreSQL

  Doctor->>UI: Submit prescription notes and items
  UI->>API: createPrescription(appointmentId, notes, items)
  API->>Controller: POST /api/consultations/{appointmentId}/prescriptions
  Controller->>Controller: JwtAuthGuard + RolesGuard(DOCTOR)
  Controller->>Service: createPrescription(currentUser.sub, appointmentId, dto)
  Service->>DB: doctorProfile.findUnique(userId)
  Service->>DB: appointment.findUnique(include session)
  alt Appointment completed, session exists, and belongs to doctor
    Service->>DB: transaction
    Service->>DB: prescription.upsert(sessionId, notes)
    Service->>DB: prescriptionItem.deleteMany(prescriptionId)
    Service->>DB: prescriptionItem.createMany(items)
    Service->>DB: prescription.findUnique(include items)
    DB-->>Service: prescription with items
    Service-->>Controller: prescription
    Controller-->>API: 201 Created
    API-->>UI: prescription
    UI-->>Doctor: Show prescription saved state
  else Not completed, missing session, or forbidden
    Service-->>Controller: 400/403/404 error
    Controller-->>API: error response
    API-->>UI: error message
    UI-->>Doctor: Show prescription error
  end
```

## 14. View Consultation History

Backend có endpoint doctor history `GET /api/consultations/doctor/me`. Service trả các `ConsultationSession` của doctor kèm appointment/patient và prescription items.

```mermaid
sequenceDiagram
  autonumber
  actor Doctor
  participant UI as React UI - Doctor History/Patients
  participant API as API Client - doctor.api
  participant Controller as NestJS Controller - ConsultationController
  participant Service as Service - ConsultationService
  participant DB as Prisma/PostgreSQL

  Doctor->>UI: Open consultation history
  UI->>API: request doctor consultation history
  API->>Controller: GET /api/consultations/doctor/me
  Controller->>Controller: JwtAuthGuard + RolesGuard(DOCTOR)
  Controller->>Service: listDoctorConsultations(currentUser.sub)
  Service->>DB: doctorProfile.findUnique(userId)
  alt Doctor profile exists
    Service->>DB: consultationSession.findMany(where appointment.doctorId, include appointment.patient and prescription.items)
    DB-->>Service: consultation sessions
    Service-->>Controller: consultation history
    Controller-->>API: 200 OK
    API-->>UI: history rows
    UI-->>Doctor: Render consultation outcomes/history
  else Profile missing
    Service-->>Controller: NotFoundException
    Controller-->>API: 404 error
    API-->>UI: error message
    UI-->>Doctor: Show history error
  end
```

## Notes

- Doctor endpoints are guarded by JWT authentication and `Role.DOCTOR` authorization in controllers.
- Updating doctor specialties is a separate endpoint from profile field updates; frontend may call it from the same profile save action when specialty changes.
- Appointment confirmation creates `OutboxEvent` and `AuditLog`; reschedule creates `AuditLog` only in the current implementation.
- Starting consultation creates or updates `ConsultationSession`; ending consultation marks both session and appointment completed.
- Realtime chat persists every message through `ConsultationService.sendSessionMessage()` before broadcasting it through Socket.IO.
