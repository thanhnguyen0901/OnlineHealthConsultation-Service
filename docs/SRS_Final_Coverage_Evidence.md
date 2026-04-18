# SRS Final Coverage Evidence

Updated: 2026-04-18
Source SRS: `docs/srs/OnlineHealthConsultationPlatform_SRS_v1.0.md`

## 1. Verification Summary

- Code implementation has broad FR coverage, but re-review found reopened compliance gaps for FR-03, FR-11, FR-12.
- Build gates executed and passed:
  - `npm run type-check`
  - `npm run build`
- Test execution note:
  - Automated test suites are not present yet in this codebase; verification is based on static checks + code-path review + API/role/ownership coverage.

## 2. FR Traceability to Implemented APIs

| FR | Implementation evidence |
|---|---|
| FR-01 Public access | `/public/home`, `/public/specialties`, `/public/doctors`, `/public/doctors/:doctorId` |
| FR-02 AuthN/AuthZ | `/auth/register`, `/auth/login`, `/auth/refresh`, `/auth/logout`, `/auth/forgot-password`, `/auth/reset-password`, guards/decorators |
| FR-03 Profile management | `/patients/me/profile`, `/doctors/me/profile`, `/doctors/me/schedule`, `/admin/users/:userId/status` |
| FR-04 Specialty management | `/admin/specialties` CRUD + doctor-specialty mapping |
| FR-05 Discovery | public doctor search/filter/detail APIs |
| FR-06 Q&A | `/questions`, `/questions/mine`, `/questions/assigned`, `/questions/:id/answers`, `/admin/questions/:id/moderation` |
| FR-07 Appointment | `/appointments` booking/lifecycle + `/admin/appointments` + status update |
| FR-08 Consultation session | `/consultations/:appointmentId/start|join|end`, channel fallback VIDEO->CHAT |
| FR-09 Outcome/Prescription | `/consultations/:appointmentId/summary`, `/consultations/:appointmentId/prescriptions`, consultation history APIs |
| FR-10 Rating | `/ratings`, `/ratings/mine`, `/admin/ratings/:id/moderation` |
| FR-11 Notifications | `/notifications/mine`, `/admin/notifications/logs`, `/admin/notifications/outbox/process`, `/admin/notifications/reminders/appointments` |
| FR-12 Administration | admin user/specialty/question/appointment/rating management endpoints |
| FR-13 Reporting | `/reports/dashboard`, `/reports/consultations/trend` |

## 3. NFR Coverage Snapshot

- Security:
  - JWT auth + role guard + ownership checks on protected resources.
  - Audit logs for sensitive admin/moderation/auth actions.
- Reliability:
  - Transactional flows for registration, booking conflict checks, question-answer side-effects, consultation completion/prescription.
  - Outbox persistence + retry metadata for notification processing.
- Maintainability:
  - Modular NestJS structure aligned to architecture docs.
  - Updated architecture/database/API/checklist documents.

## 4. Remaining Hardening Items (Post-SRS Closure)

- Add automated unit/integration/e2e suites per `docs/Test_Strategy_and_Traceability.md`.
- Add scheduled background worker for outbox/reminder automation (currently admin-triggered API).
- Add performance/load benchmark evidence for p95 targets.

## 5. Reopened SRS Gaps (2026-04-18 Re-Review)

- FR-03/FR-12:
  - Admin user lifecycle chưa đầy đủ theo yêu cầu quản trị tài khoản (thiếu create/update/detail/delete admin endpoints chuẩn hóa).
- FR-08:
  - Closed on 2026-04-18: added realtime chat gateway + persisted consultation messages + time-window validation for start/join.
- FR-11:
  - Retry policy outbox chưa hoàn chỉnh cho `FAILED` + `nextRetryAt`.
  - Chưa có scheduler tự động xử lý outbox/reminder.
  - Có nguy cơ duplicate notification do xử lý song song direct domain write và outbox consumption.
- NFR-01 (audit coverage):
  - Chưa phủ audit đầy đủ cho doctor answer và toàn bộ appointment lifecycle updates quan trọng.
