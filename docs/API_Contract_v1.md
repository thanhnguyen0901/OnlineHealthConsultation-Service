# API Contract v1

Updated: 2026-04-18
Base URL: `/api/v1`

## 1. Conventions

- Auth header: `Authorization: Bearer <token>`.
- Response envelope:
  - success: `{ data, meta }`
  - error: `{ error: { code, message, details } }`
- Common error codes: `VALIDATION_ERROR`, `UNAUTHORIZED`, `FORBIDDEN`, `NOT_FOUND`, `CONFLICT`, `INTERNAL_ERROR`.

## 2. Public APIs (Guest)

- `GET /public/home`
- `GET /public/specialties`
- `GET /public/doctors?keyword=&specialtyId=&page=&limit=`
- `GET /public/doctors/:doctorId`

## 3. Identity APIs

- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/logout`
- `POST /auth/refresh`
- `POST /auth/forgot-password`
- `POST /auth/reset-password`
- `GET /auth/me`

## 4. Profile APIs

- Patient:
  - `GET /patients/me/profile`
  - `PATCH /patients/me/profile`
- Doctor:
  - `GET /doctors/me/profile`
  - `PATCH /doctors/me/profile`
  - `PATCH /doctors/me/schedule`

## 5. Specialty APIs

- Admin:
  - `POST /admin/specialties`
  - `GET /admin/specialties`
  - `PATCH /admin/specialties/:id`
  - `PATCH /admin/specialties/:id/deactivate`

## 6. Question APIs

- Patient:
  - `POST /questions`
  - `GET /questions/mine`
- Doctor:
  - `GET /questions/assigned`
  - `POST /questions/:id/answers`
- Admin:
  - `PATCH /admin/questions/:id/moderation`

## 7. Appointment APIs

- Patient:
  - `POST /appointments`
  - `GET /appointments/mine`
  - `PATCH /appointments/:id/cancel`
- Doctor:
  - `GET /appointments/doctor/me`
  - `PATCH /appointments/:id/confirm`
  - `PATCH /appointments/:id/complete`
- Admin:
  - `GET /admin/appointments`
  - `PATCH /admin/appointments/:id/status`

## 8. Consultation APIs

- `POST /consultations/:appointmentId/start`
- `POST /consultations/:appointmentId/join`
- `GET /consultations/:appointmentId/messages`
- `POST /consultations/:appointmentId/messages`
- `PATCH /consultations/:appointmentId/end`
- `PATCH /consultations/:appointmentId/summary`
- `POST /consultations/:appointmentId/prescriptions`
- `GET /consultations/mine`
- `GET /consultations/doctor/me`

Realtime channel:
- WebSocket namespace: `/consultations`
- Events:
  - client -> server: `consultation:join`, `consultation:message`
  - server -> client: `consultation:joined`, `consultation:message`

## 9. Rating APIs

- `POST /ratings`
- `GET /ratings/mine`
- `PATCH /admin/ratings/:id/moderation`

## 10. Notification APIs

- `GET /notifications/mine`
- `GET /admin/notifications/logs`
- `POST /admin/notifications/outbox/process?limit=`
- `POST /admin/notifications/reminders/appointments?withinMinutes=`

## 11. Reporting APIs

- `GET /reports/dashboard?from=&to=`
- `GET /reports/consultations/trend?from=&to=&groupBy=`

## 12. Operations APIs

- `GET /health`
- `GET /admin/ops/metrics`

## 13. Endpoint Status Board

- `Identity`: IN_PROGRESS
- `Public/Discovery`: DONE
- `Profiles/Specialties`: DONE
- `Questions/Appointments`: DONE
- `Consultation/Prescription/Rating`: DONE
- `Admin/Reporting`: DONE
