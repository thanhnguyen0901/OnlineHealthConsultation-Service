# Patient Sequence Diagrams

Tài liệu này mô tả các sequence diagram cho luồng **Patient** dựa trên SRS cập nhật và source implementation cuối cùng.

Nguồn đã đối chiếu:

- `docs/srs/OnlineHealthConsultationPlatform_SRS_v1.0.md`
- `OnlineHealthConsultation-Web/src/features/auth/apis/auth.api.ts`
- `OnlineHealthConsultation-Web/src/features/auth/redux/auth.saga.ts`
- `OnlineHealthConsultation-Web/src/features/patient/apis/patient.api.ts`
- `OnlineHealthConsultation-Web/src/features/patient/redux/patient.saga.ts`
- `OnlineHealthConsultation-Web/src/features/patient/pages/PatientConsultationSessionPage.tsx`
- `OnlineHealthConsultation-Web/src/features/consultation/realtime/*`
- `src/modules/identity/*`
- `src/modules/patient/*`
- `src/modules/discovery/*`
- `src/modules/question/*`
- `src/modules/appointment/*`
- `src/modules/consultation/*`

Backend NestJS dùng global prefix `/api`. Các diagram chỉ đưa vào participant có ý nghĩa ở boundary/controller/service/persistence, không liệt kê guard, decorator, DTO hoặc helper private khi chúng không phải điểm tương tác chính.

## 1. Register

Luồng đăng ký patient gọi `POST /api/auth/register`. Controller dùng `UsersService.createUser()`, service tạo `User` và profile tương ứng theo role.

```mermaid
sequenceDiagram
  autonumber
  actor Patient
  participant UI as React UI - RegisterPage
  participant API as API Client - auth.api
  participant Controller as NestJS Controller - AuthController
  participant Service as Service - UsersService
  participant DB as Prisma/PostgreSQL

  Patient->>UI: Submit registration form
  UI->>API: register(email, password, names, role=PATIENT)
  API->>Controller: POST /api/auth/register
  Controller->>Service: createUser(dto)
  Service->>DB: user.findUnique(email)
  alt Email is available
    Service->>DB: user.create + patientProfile.create
    DB-->>Service: created user
    Service-->>Controller: user
    Controller-->>API: 201 Registration successful
    API-->>UI: normalized user, empty accessToken
    UI-->>Patient: Show success and navigate to login
  else Email already exists or invalid data
    DB-->>Service: existing user/error
    Service-->>Controller: validation error
    Controller-->>API: 400 error
    API-->>UI: error message
    UI-->>Patient: Show registration error
  end
```

## 2. Login

Luồng đăng nhập gọi `POST /api/auth/login`. Backend xác thực mật khẩu, tạo `UserSession`, trả access token và set HttpOnly refresh cookie.

```mermaid
sequenceDiagram
  autonumber
  actor Patient
  participant UI as React UI - LoginPage
  participant API as API Client - auth.api
  participant Controller as NestJS Controller - AuthController
  participant Auth as Service - AuthService
  participant Users as Service - UsersService
  participant DB as Prisma/PostgreSQL

  Patient->>UI: Submit email and password
  UI->>API: login(credentials)
  API->>Controller: POST /api/auth/login
  Controller->>Auth: login(dto, userAgent, ip)
  Auth->>Users: findByEmail(email)
  Users->>DB: user.findUnique(email)
  DB-->>Users: user with passwordHash
  Users-->>Auth: user
  Auth->>Auth: bcrypt.compare(password)
  alt Credentials valid and account active
    Auth->>DB: userSession.create(refreshTokenHash)
    Auth->>DB: auditLog.create(LOGIN_SUCCESS)
    Auth-->>Controller: accessToken, refreshToken, user
    Controller-->>API: 200 OK + Set-Cookie refresh token
    API-->>UI: normalized user + accessToken
    UI-->>Patient: Navigate to returnUrl or patient dashboard
  else Invalid credentials or disabled account
    Auth-->>Controller: UnauthorizedException
    Controller-->>API: 401 Unauthorized
    API-->>UI: error message
    UI-->>Patient: Show login error
  end
```

## 3. Update Health Profile

Patient profile update gọi `PATCH /api/patients/me/profile`. Service tạo `PatientProfile` nếu chưa có, sau đó update thông tin sức khỏe.

```mermaid
sequenceDiagram
  autonumber
  actor Patient
  participant UI as React UI - PatientProfilePage
  participant API as API Client - patient.api
  participant Controller as NestJS Controller - PatientController
  participant Service as Service - PatientService
  participant DB as Prisma/PostgreSQL

  Patient->>UI: Edit health profile and save
  UI->>API: updateProfile(profile)
  API->>Controller: PATCH /api/patients/me/profile
  Controller->>Service: updateMyProfile(currentUser.sub, dto)
  Service->>DB: patientProfile.findUnique(userId)
  opt Profile does not exist
    Service->>DB: patientProfile.create(userId)
  end
  Service->>DB: patientProfile.update(dateOfBirth, gender, phone, address, medicalHistory)
  DB-->>Service: updated profile with user
  Service-->>Controller: profile
  Controller-->>API: 200 OK
  API-->>UI: normalized profile
  UI-->>Patient: Show success toast and updated profile
```

## 4. Search Doctor

Patient search reuses public discovery APIs through `patient.api`, so the backend path is the same as guest discovery.

```mermaid
sequenceDiagram
  autonumber
  actor Patient
  participant UI as React UI - BookAppointment/AskQuestion
  participant API as API Client - patient.api
  participant Controller as NestJS Controller - DiscoveryController
  participant Service as Service - DiscoveryService
  participant DB as Prisma/PostgreSQL

  Patient->>UI: Select specialty or search doctor
  UI->>API: getDoctorsBySpecialty(specialtyId)
  API->>Controller: GET /api/public/doctors?specialtyId=...&limit=100
  Controller->>Service: listPublicDoctors(query)
  Service->>DB: doctorProfile.findMany(approved, active, specialty filter)
  Service->>DB: doctorProfile.count(same filters)
  DB-->>Service: matching doctors
  loop For each returned doctor
    Service->>DB: rating.aggregate(doctorId, status=VISIBLE)
    DB-->>Service: rating summary
  end
  Service-->>Controller: { data, meta }
  Controller-->>API: 200 OK
  API-->>UI: normalized doctors
  UI-->>Patient: Render selectable doctor list
```

## 5. Submit Health Question

Patient gửi câu hỏi qua `POST /api/questions`. Service yêu cầu patient profile tồn tại và kiểm tra doctor nếu có `doctorId`.

```mermaid
sequenceDiagram
  autonumber
  actor Patient
  participant UI as React UI - AskQuestionPage
  participant API as API Client - patient.api
  participant Controller as NestJS Controller - QuestionController
  participant Service as Service - QuestionService
  participant DB as Prisma/PostgreSQL

  Patient->>UI: Submit title, content, optional doctor
  UI->>API: askQuestion(data)
  API->>Controller: POST /api/questions
  Controller->>Service: createQuestion(currentUser.sub, dto)
  Service->>DB: patientProfile.findUnique(userId)
  alt Patient profile exists
    opt doctorId provided
      Service->>DB: doctorProfile.findUnique(doctorId)
    end
    alt Doctor valid or not assigned
      Service->>DB: question.create(status=PENDING)
      DB-->>Service: question
      Service-->>Controller: question
      Controller-->>API: 201 Created
      API-->>UI: normalized question
      UI-->>Patient: Show submitted toast
    else Doctor unavailable
      Service-->>Controller: BadRequestException
      Controller-->>API: 400 error
      API-->>UI: error message
      UI-->>Patient: Show error
    end
  else Missing patient profile
    Service-->>Controller: NotFoundException
    Controller-->>API: 404 error
    API-->>UI: error message
    UI-->>Patient: Show error
  end
```

## 6. Book Appointment

Patient đặt lịch qua `POST /api/appointments`. Service kiểm tra patient, doctor, thời gian tương lai, lịch làm việc, conflict của doctor/patient rồi tạo appointment, outbox event và audit log trong transaction serializable.

```mermaid
sequenceDiagram
  autonumber
  actor Patient
  participant UI as React UI - BookAppointmentPage
  participant API as API Client - patient.api
  participant Controller as NestJS Controller - AppointmentController
  participant Service as Service - AppointmentService
  participant DB as Prisma/PostgreSQL

  Patient->>UI: Pick doctor, slot, reason and submit
  UI->>API: bookAppointment(data)
  API->>Controller: POST /api/appointments
  Controller->>Service: createAppointment(currentUser.sub, dto)
  Service->>DB: patientProfile.findUnique(userId)
  Service->>DB: doctorProfile.findUnique(doctorId, include user)
  Service->>Service: validate future time and duration
  Service->>DB: transaction(serializable)
  Service->>DB: doctorProfile.findUnique(latest)
  Service->>Service: assert bookable doctor and working schedule
  Service->>DB: appointment.findMany(conflict window)
  alt No conflict
    Service->>DB: appointment.create(PENDING_CONFIRMATION)
    Service->>DB: outboxEvent.create(APPOINTMENT_CREATED)
    Service->>DB: auditLog.create(APPOINTMENT_CREATED)
    DB-->>Service: appointment
    Service-->>Controller: appointment
    Controller-->>API: 201 Created
    API-->>UI: normalized appointment
    UI->>API: getHistory()
    API-->>UI: refreshed appointments/questions/ratings
    UI-->>Patient: Show appointment booked toast
  else Invalid doctor, time, schedule, or conflict
    Service-->>Controller: 400/404 error
    Controller-->>API: error response
    API-->>UI: error message
    UI-->>Patient: Show booking error
  end
```

## 7. View Appointments

Patient appointment/history screens call `getHistory()`, which loads questions, appointments and ratings in parallel. Appointments come from `GET /api/appointments/mine`.

```mermaid
sequenceDiagram
  autonumber
  actor Patient
  participant UI as React UI - Patient Dashboard/History
  participant API as API Client - patient.api
  participant ApptController as NestJS Controller - AppointmentController
  participant ApptService as Service - AppointmentService
  participant RatingController as NestJS Controller - RatingController
  participant ConsultationService as Service - ConsultationService
  participant DB as Prisma/PostgreSQL

  Patient->>UI: Open appointments/history view
  UI->>API: getHistory()
  par Appointments
    API->>ApptController: GET /api/appointments/mine
    ApptController->>ApptService: listMyAppointments(currentUser.sub, query)
    ApptService->>DB: patientProfile.findUnique(userId)
    ApptService->>DB: appointment.findMany(patientId, include doctor)
    DB-->>ApptService: appointments
    ApptService-->>ApptController: appointments
    ApptController-->>API: 200 OK
  and Ratings for hasRating flag
    API->>RatingController: GET /api/ratings/mine
    RatingController->>ConsultationService: listMyRatings(currentUser.sub)
    ConsultationService->>DB: patientProfile.findUnique(userId)
    ConsultationService->>DB: rating.findMany(patientId)
    DB-->>ConsultationService: ratings
    ConsultationService-->>RatingController: ratings
    RatingController-->>API: 200 OK
  end
  API-->>UI: normalized appointments with hasRating
  UI-->>Patient: Render appointment list
```

## 8. Cancel Appointment

Patient hủy lịch qua `PATCH /api/appointments/{id}/cancel`. Service chỉ cho hủy appointment thuộc patient hiện tại và chưa `CANCELLED`/`COMPLETED`.

```mermaid
sequenceDiagram
  autonumber
  actor Patient
  participant UI as React UI - Appointment List
  participant API as API Client - patient.api
  participant Controller as NestJS Controller - AppointmentController
  participant Service as Service - AppointmentService
  participant DB as Prisma/PostgreSQL

  Patient->>UI: Click cancel appointment
  UI->>API: cancelAppointment(id)
  API->>Controller: PATCH /api/appointments/{id}/cancel
  Controller->>Service: cancelAppointment(currentUser.sub, appointmentId)
  Service->>DB: patientProfile.findUnique(userId)
  Service->>DB: appointment.findUnique(id)
  alt Appointment belongs to patient and is cancellable
    Service->>DB: transaction
    Service->>DB: appointment.update(status=CANCELLED)
    Service->>DB: auditLog.create(APPOINTMENT_CANCELLED_BY_PATIENT)
    DB-->>Service: updated appointment
    Service-->>Controller: updated appointment
    Controller-->>API: 200 OK
    API-->>UI: success
    UI-->>Patient: Remove/update appointment and show toast
  else Not found, forbidden, or invalid status
    Service-->>Controller: 400/403/404 error
    Controller-->>API: error response
    API-->>UI: error message
    UI-->>Patient: Show cancellation error
  end
```

## 9. Join Consultation

Patient page first fetches consultation result, then calls `POST /api/consultations/{appointmentId}/join`, then loads persisted messages.

```mermaid
sequenceDiagram
  autonumber
  actor Patient
  participant UI as Patient UI
  participant REST as REST API
  participant Service as Consultation Service
  participant DB as Database

  Patient->>UI: Open consultation session page
  UI->>REST: GET /api/consultations/{appointmentId}/result
  REST->>Service: getConsultationResult(userId, PATIENT, appointmentId)
  Service->>DB: appointment.findUnique(include session, prescription)
  Service->>DB: patientProfile.findUnique(userId)
  DB-->>Service: appointment/result data
  Service-->>REST: result
  REST-->>UI: result

  alt Consultation already completed
    UI-->>Patient: Render completed result view
  else Session can be joined
    UI->>REST: POST /api/consultations/{appointmentId}/join
    REST->>Service: joinSession(userId, PATIENT, appointmentId)
    Service->>DB: appointment.findUnique(include session)
    Service->>DB: patientProfile.findUnique(userId)
    DB-->>Service: session access confirmed
    Service-->>REST: sessionId, status, channel
    REST-->>UI: join result
    UI->>REST: GET /api/consultations/{appointmentId}/messages
    REST->>Service: listSessionMessages(userId, PATIENT, appointmentId)
    Service->>DB: consultationMessage.findMany(sessionId)
    DB-->>Service: persisted messages
    Service-->>REST: messages
    REST-->>UI: messages
    UI-->>Patient: Render ongoing consultation room
  end
```

## 10. Realtime Chat

Realtime consultation dùng REST để join/load fallback, và Socket.IO namespace `/consultations` để join room và broadcast message. Nếu socket chưa sẵn sàng, UI fallback sang REST `POST /messages`.

```mermaid
sequenceDiagram
  autonumber
  actor Patient
  participant PatientUI as Patient UI
  participant REST as REST API
  participant Service as Consultation Service
  participant Gateway as Socket.IO Gateway
  participant DoctorClient as Doctor Client
  participant DB as Database

  Patient->>PatientUI: Enter consultation page
  PatientUI->>REST: POST /api/consultations/{appointmentId}/join
  REST->>Service: joinSession(userId, PATIENT, appointmentId)
  Service->>DB: appointment/session + patient access checks
  DB-->>Service: joinable session
  Service-->>REST: join result
  REST-->>PatientUI: sessionId/status/channel

  PatientUI->>Gateway: Connect /consultations with accessToken
  Gateway->>Gateway: verify JWT from handshake auth/header
  PatientUI->>Gateway: consultation:join { appointmentId }
  Gateway->>Service: joinSession(userId, PATIENT, appointmentId)
  Service->>DB: appointment/session + access checks
  DB-->>Service: join confirmed
  Service-->>Gateway: room and session metadata
  Gateway-->>PatientUI: consultation:joined

  Patient->>PatientUI: Send chat message
  alt Socket connected and joined
    PatientUI->>Gateway: consultation:message { appointmentId, content }
    Gateway->>Service: sendSessionMessage(userId, PATIENT, appointmentId, content)
    Service->>DB: consultationMessage.create(senderUserId, content)
    DB-->>Service: persisted message
    Service-->>Gateway: message
    Gateway-->>PatientUI: consultation:message
    Gateway-->>DoctorClient: consultation:message
  else Socket unavailable
    PatientUI->>REST: POST /api/consultations/{appointmentId}/messages
    REST->>Service: sendSessionMessage(userId, PATIENT, appointmentId, content)
    Service->>DB: consultationMessage.create(senderUserId, content)
    DB-->>Service: persisted message
    Service-->>REST: message
    REST-->>PatientUI: saved message
  end
```

## 11. View Consultation Result

Patient xem kết quả tư vấn qua `GET /api/consultations/{appointmentId}/result`. Response gồm appointment, consultation summary/channel và prescription nếu có.

```mermaid
sequenceDiagram
  autonumber
  actor Patient
  participant UI as React UI - Consultation Result
  participant API as API Client - patient.api
  participant Controller as NestJS Controller - ConsultationController
  participant Service as Service - ConsultationService
  participant DB as Prisma/PostgreSQL

  Patient->>UI: Open consultation result
  UI->>API: getConsultationResult(appointmentId)
  API->>Controller: GET /api/consultations/{appointmentId}/result
  Controller->>Service: getConsultationResult(currentUser.sub, PATIENT, appointmentId)
  Service->>DB: appointment.findUnique(include patient, doctor, session, prescription.items)
  Service->>DB: patientProfile.findUnique(userId)
  alt Appointment belongs to patient
    DB-->>Service: appointment + consultation + prescription
    Service-->>Controller: result payload
    Controller-->>API: 200 OK
    API-->>UI: normalized result
    UI-->>Patient: Render summary/status/result
  else Appointment missing or belongs to another patient
    Service-->>Controller: 403/404 error
    Controller-->>API: error response
    API-->>UI: error message
    UI-->>Patient: Show error state
  end
```

## 12. View Prescription

Không có endpoint prescription riêng cho patient. Prescription được trả kèm trong `GET /api/consultations/{appointmentId}/result`.

```mermaid
sequenceDiagram
  autonumber
  actor Patient
  participant UI as React UI - Consultation Result
  participant API as API Client - patient.api
  participant Controller as NestJS Controller - ConsultationController
  participant Service as Service - ConsultationService
  participant DB as Prisma/PostgreSQL

  Patient->>UI: Open prescription section
  UI->>API: getConsultationResult(appointmentId)
  API->>Controller: GET /api/consultations/{appointmentId}/result
  Controller->>Service: getConsultationResult(currentUser.sub, PATIENT, appointmentId)
  Service->>DB: appointment.findUnique(include session.prescription.items)
  Service->>DB: patientProfile.findUnique(userId)
  DB-->>Service: prescription or null
  Service-->>Controller: result with prescription
  Controller-->>API: 200 OK
  API-->>UI: prescription data
  alt Prescription exists
    UI-->>Patient: Render prescription notes and items
  else No prescription
    UI-->>Patient: Render no-prescription state
  end
```

## 13. Consultation History

Frontend `getHistory()` hiện tải questions, appointments và ratings song song. Backend cũng có `GET /api/consultations/mine`, nhưng patient UI đang dùng history aggregate từ patient API để dựng màn hình lịch sử.

```mermaid
sequenceDiagram
  autonumber
  actor Patient
  participant UI as React UI - ConsultationHistoryPage
  participant API as API Client - patient.api
  participant QuestionController as NestJS Controller - QuestionController
  participant AppointmentController as NestJS Controller - AppointmentController
  participant RatingController as NestJS Controller - RatingController
  participant QuestionService as Service - QuestionService
  participant AppointmentService as Service - AppointmentService
  participant ConsultationService as Service - ConsultationService
  participant DB as Prisma/PostgreSQL

  Patient->>UI: Open consultation history
  UI->>API: getHistory()
  par Questions
    API->>QuestionController: GET /api/questions/mine
    QuestionController->>QuestionService: listMyQuestions(userId)
    QuestionService->>DB: patientProfile.findUnique(userId)
    QuestionService->>DB: question.findMany(patientId, not MODERATED, approved answers)
    DB-->>QuestionService: questions
    QuestionService-->>QuestionController: questions
    QuestionController-->>API: 200 OK
  and Appointments
    API->>AppointmentController: GET /api/appointments/mine
    AppointmentController->>AppointmentService: listMyAppointments(userId, query)
    AppointmentService->>DB: patientProfile.findUnique(userId)
    AppointmentService->>DB: appointment.findMany(patientId, include doctor)
    DB-->>AppointmentService: appointments
    AppointmentService-->>AppointmentController: appointments
    AppointmentController-->>API: 200 OK
  and Ratings
    API->>RatingController: GET /api/ratings/mine
    RatingController->>ConsultationService: listMyRatings(userId)
    ConsultationService->>DB: patientProfile.findUnique(userId)
    ConsultationService->>DB: rating.findMany(patientId, include doctor)
    DB-->>ConsultationService: ratings
    ConsultationService-->>RatingController: ratings
    RatingController-->>API: 200 OK
  end
  API-->>UI: questions + appointments with rating flags
  UI-->>Patient: Render history, answers, appointment outcomes
```

## 14. Submit Rating

Patient gửi đánh giá qua `POST /api/ratings`. Service chỉ nhận appointment đã `COMPLETED`, thuộc patient hiện tại và chưa có rating.

```mermaid
sequenceDiagram
  autonumber
  actor Patient
  participant UI as React UI - ConsultationHistoryPage
  participant API as API Client - patient.api
  participant Controller as NestJS Controller - RatingController
  participant Service as Service - ConsultationService
  participant DB as Prisma/PostgreSQL

  Patient->>UI: Submit rating score and optional comment
  UI->>API: rateConsultation(appointmentId, score, comment)
  API->>Controller: POST /api/ratings
  Controller->>Service: createRating(currentUser.sub, dto)
  Service->>DB: patientProfile.findUnique(userId)
  Service->>DB: appointment.findUnique(appointmentId)
  Service->>DB: rating.findUnique(appointmentId)
  alt Completed appointment owned by patient and not rated
    Service->>DB: rating.create(status=VISIBLE)
    DB-->>Service: rating
    Service-->>Controller: rating
    Controller-->>API: 201 Created
    API-->>UI: rating
    UI-->>Patient: Close dialog and mark appointment as rated
  else Not completed, not owner, or duplicate rating
    Service-->>Controller: 400/403/404 error
    Controller-->>API: error response
    API-->>UI: error message
    UI-->>Patient: Show rating error
  end
```

## 15. Forgot/Reset Password

Forgot password always returns a generic message. If the user exists and is active, backend stores a hashed reset token, writes audit log and asks `NotificationService` to create password reset notification. Reset password validates token hash, updates password, marks token used and revokes active sessions in a transaction.

```mermaid
sequenceDiagram
  autonumber
  actor Patient
  participant UI as React UI - Forgot/Reset Password
  participant API as API Client - auth.api
  participant Controller as NestJS Controller - AuthController
  participant Auth as Service - AuthService
  participant Users as Service - UsersService
  participant Notify as Service - NotificationService
  participant DB as Prisma/PostgreSQL

  Patient->>UI: Submit forgot password email
  UI->>API: forgotPassword(email)
  API->>Controller: POST /api/auth/forgot-password
  Controller->>Auth: forgotPassword(dto)
  Auth->>Users: findByEmail(email)
  Users->>DB: user.findUnique(email)
  alt Active user exists
    Auth->>DB: passwordResetToken.create(tokenHash, expiresAt)
    Auth->>DB: auditLog.create(PASSWORD_RESET_REQUESTED)
    Auth->>Notify: createPasswordResetNotification(resetUrl, tokenId)
    Notify->>DB: notificationLog.upsert(PENDING)
    Notify->>Notify: send via resolved provider
    Notify->>DB: notificationLog.update(SENT or FAILED)
  else Missing or inactive user
    Auth->>Auth: keep response generic
  end
  Auth-->>Controller: generic message
  Controller-->>API: 200 OK
  API-->>UI: generic message
  UI-->>Patient: Show reset instructions message

  Patient->>UI: Submit reset token and new password
  UI->>API: resetPassword(token, newPassword)
  API->>Controller: POST /api/auth/reset-password
  Controller->>Auth: resetPassword(dto)
  Auth->>DB: passwordResetToken.findFirst(valid tokenHash)
  alt Token valid
    Auth->>DB: transaction
    Auth->>DB: user.update(passwordHash)
    Auth->>DB: passwordResetToken.update(usedAt)
    Auth->>DB: userSession.updateMany(revokedAt)
    Auth->>DB: auditLog.create(PASSWORD_RESET_COMPLETED)
    Auth-->>Controller: Password reset successful
    Controller-->>API: 200 OK
    API-->>UI: success message
    UI-->>Patient: Navigate to login
  else Token invalid or expired
    Auth-->>Controller: BadRequestException
    Controller-->>API: 400 error
    API-->>UI: error message
    UI-->>Patient: Show reset error
  end
```

## Notes

- Protected patient endpoints require JWT authentication and patient role through NestJS guards, but the diagrams omit guard internals unless they materially change the flow.
- Patient search doctor uses public discovery endpoints, not a separate patient-only search endpoint.
- `getHistory()` in frontend is an aggregate client function, not a backend endpoint.
- Patient prescription view uses consultation result response; there is no separate patient prescription endpoint in the final implementation.
- Realtime chat emits persisted messages through `ConsultationGateway`; REST message send remains a fallback when socket is not connected/joined.
