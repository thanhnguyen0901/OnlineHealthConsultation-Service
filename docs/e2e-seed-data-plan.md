# E2E Seed Data Plan

## 1. Mục tiêu

Mục tiêu của kế hoạch này là xác định đầy đủ dữ liệu seed cần có để chạy toàn bộ Playwright E2E suite của `OnlineHealthConsultation-Web` với backend thật `OnlineHealthConsultation-Service`, giảm tối đa tình trạng skip/fixme do thiếu dữ liệu nghiệp vụ.

Kế hoạch bám theo:

- Backend Prisma schema hiện tại.
- Backend services/controllers liên quan auth, user, doctor, patient, appointment, question, consultation, prescription, rating, admin và specialty.
- Playwright specs, page objects, test-data/env helpers và docs E2E hiện tại.

Lưu ý quan trọng: một số test hiện đang dùng `test.fixme(...)`, ví dụ cancel appointment, unauthorized question direct route và admin specialty mutation. Seed data là điều kiện cần, nhưng các test fixme vẫn cần được mở lại hoặc điều chỉnh ở phase sau thì mới thật sự chạy.

## 2. Danh sách test đang cần seed

| Test ID | Spec file | Test title | Current status | Seed data cần có | Backend entity liên quan | Có cần disposable data không | Ghi chú |
|---|---|---|---|---|---|---|---|
| smoke-login | `auth.spec.ts` | Login page loads | Pass | Không cần | N/A | No | Smoke public route, không cần seed. |
| smoke-register | `auth.spec.ts` | Register page loads | Pass | Active specialty giúp doctor register dropdown có data | `Specialty` | No | Test hiện chỉ assert form loads. |
| E2E-001 | `public.spec.ts` | Guest can view home page | Pass | Không bắt buộc | Public home endpoint | No | Không cần data nghiệp vụ. |
| E2E-002 | `public.spec.ts` | Guest can view doctor list | Pass | Không bắt buộc, nhưng nên có approved doctor public | `DoctorProfile`, `User`, `DoctorSpecialty`, `Specialty` | No | Nếu có doctor seed thì list/detail có giá trị demo tốt hơn. |
| E2E-003 | `public.spec.ts` | Guest can search/filter doctors by keyword | Pass | Approved doctor có keyword `cardiology` hoặc specialty `E2E Cardiology` | `DoctorProfile`, `Specialty`, `DoctorSpecialty` | No | Env mặc định search keyword là `cardiology`. Bio hoặc tên bác sĩ nên chứa keyword dễ match. |
| E2E-004 | `public.spec.ts` | Guest can view doctor detail with rating summary | Skipped: no public doctor seed | Approved active doctor có user active, specialty active, rating visible | `DoctorProfile`, `User`, `Specialty`, `Rating`, `Appointment` | No | Public doctor phải có `approvalStatus=APPROVED`, `isActive=true`, user `isActive=true`, `deletedAt=null`. |
| E2E-005 | `public.spec.ts` | Guest book appointment redirects login | Skipped: no public doctor seed | Approved active doctor xuất hiện ở public card | `DoctorProfile`, `User`, `DoctorSpecialty` | No | CTA cần `book-appointment-guest` trên doctor card/detail. |
| E2E-006 | `auth.spec.ts` | Patient can login and is redirected to Patient dashboard | Skipped: missing seeded patient env | Patient account active + patient profile | `User`, `PatientProfile`, `UserSession` khi login | No | Cần `E2E_RUN_SEEDED=true`, email/password env. |
| E2E-007 | `auth.spec.ts` | Doctor can login and is redirected to Doctor dashboard | Skipped: missing seeded doctor env | Doctor account active + approved active doctor profile | `User`, `DoctorProfile`, `DoctorSpecialty` | No | Doctor dashboard cần profile tồn tại. |
| E2E-008 | `auth.spec.ts` | Admin can login and is redirected to Admin dashboard | Skipped by `E2E_RUN_SEEDED` gate | Admin account active | `User` | No | Dev seed hiện đã có `admin@healthcare.local` / `Admin@123`. |
| E2E-009 | `auth.spec.ts` | Guest opening protected Patient route is redirected to login | Pass | Không cần | Auth guard/frontend route guard | No | Negative guest route. |
| E2E-010 | `auth.spec.ts` | Patient cannot access Doctor/Admin routes | Skipped: missing seeded patient env | Patient account active | `User`, `PatientProfile` | No | Role guard negative test. |
| E2E-011 | `auth.spec.ts` | Doctor cannot access Patient/Admin routes | Skipped: missing seeded doctor env | Doctor account active + profile | `User`, `DoctorProfile` | No | Role guard negative test. |
| E2E-012 | `auth.spec.ts` | Logout clears session and redirects login | Skipped: no seeded login account enabled | Patient hoặc admin account active | `User`, `UserSession` | No | Patient preferred, admin fallback theo helper. |
| E2E-013 | `patient-appointments.spec.ts` | Patient can create appointment with valid doctor/time/reason | Skipped: missing patient/approved doctor seed | Patient account/profile, approved doctor, active specialty, non-overlapping future slot | `User`, `PatientProfile`, `DoctorProfile`, `Specialty`, `Appointment` | Prefer Yes | Test hiện mới assert form fields; nếu mở full submit cần slot không conflict. |
| E2E-014 | `patient-appointments.spec.ts` | Patient can view appointment list | Skipped: missing patient env | Patient account/profile; ít nhất một appointment thuộc patient | `Appointment`, `PatientProfile`, `DoctorProfile` | No | List table visible có thể pass kể cả empty, nhưng nên seed row để phục vụ detail/result. |
| E2E-015 | `patient-appointments.spec.ts` | Patient can view appointment detail when a row exists | Skipped: missing patient/appointment seed | Appointment thuộc patient.e2e và doctor.e2e | `Appointment` | No | Row cần có action `appointment-detail`. |
| E2E-016 | `patient-appointments.spec.ts` | Patient can cancel appointment if status allows | Fixme: needs disposable appointment seed | Cancellable appointment thuộc patient.e2e, status `PENDING_CONFIRMATION` hoặc `CONFIRMED` | `Appointment` | Yes | Backend không có enum `PENDING`; dùng `PENDING_CONFIRMATION`. Test đang fixme nên phase sau cần mở test. |
| E2E-017 | `patient-appointments.spec.ts` | Patient sees validation error when appointment data is missing | Skipped: missing patient env | Patient account/profile | `User`, `PatientProfile` | No | Không cần appointment seed. |
| E2E-018 | `patient-questions.spec.ts` | Patient can create health question | Skipped: missing patient env | Patient account/profile | `Question` khi submit | Prefer Yes | Test tạo question mới bằng timestamp; seed chỉ cần patient. |
| E2E-019 | `patient-questions.spec.ts` | Patient can view own question list | Skipped: missing patient env | Patient account/profile; nên có pending/answered question thuộc patient | `Question`, `Answer` | No | Table visible có thể pass empty, nhưng answered question cần cho E2E-022. |
| E2E-020 | `patient-questions.spec.ts` | Doctor can view assigned/open question | Skipped: missing doctor env | Doctor account/profile; pending question assigned to doctor hoặc unassigned pending | `Question`, `DoctorProfile` | No | Backend doctor inbox trả question có `doctorId=doctor.id` hoặc `doctorId=null,status=PENDING`. |
| E2E-021 | `patient-questions.spec.ts` | Doctor can answer question when a pending row exists | Skipped: missing doctor/pending question seed | Pending question assigned/open, status `PENDING` | `Question`, `Answer`, `AuditLog`, `OutboxEvent` | Yes | Answer mutation đổi question sang `ANSWERED`; seed rerun nên reset E2E pending question về `PENDING`. |
| E2E-022 | `patient-questions.spec.ts` | Patient can view doctor answer when answered question exists | Skipped: missing answered question seed | Answered question thuộc patient.e2e có answer approved | `Question`, `Answer` | No | Dùng question riêng với status `ANSWERED`; không dùng chung record E2E-021. |
| E2E-023 | `patient-questions.spec.ts` | Doctor cannot access unauthorized question direct route | Fixme: no direct FE detail route/API | Optional other patient/doctor question để future negative test | `Question`, `DoctorProfile`, `PatientProfile` | No | Seed có thể chuẩn bị nhưng test hiện chưa chạy vì FE không có direct detail route/API. |
| E2E-024 | `doctor-workflow.spec.ts` | Doctor can confirm appointment when pending action exists | Skipped: missing doctor/pending appointment seed | Appointment thuộc doctor.e2e, status `PENDING_CONFIRMATION`, future | `Appointment` | Yes | Confirm mutation đổi status sang `CONFIRMED`; seed rerun phải reset hoặc dùng disposable record. |
| E2E-025 | `doctor-workflow.spec.ts` | Doctor can complete appointment when complete action exists | Skipped: missing doctor/confirmed appointment seed | Appointment thuộc doctor.e2e, status `CONFIRMED` | `Appointment` | Yes | Complete mutation đổi status sang `COMPLETED`; seed rerun phải reset hoặc dùng disposable record. |
| E2E-026 | `doctor-workflow.spec.ts` | Doctor can start/join consultation session route | Skipped: missing consultation appointment seed | Appointment id trong `E2E_CONSULTATION_APPOINTMENT_ID`, status `CONFIRMED` hoặc `PENDING_CONFIRMATION`, scheduledAt trong consultation time window | `Appointment`, `ConsultationSession` | Yes | Backend `startSession/joinSession` kiểm tra time window. Seed nên đặt scheduledAt gần thời điểm chạy hoặc cấu hình `CONSULTATION_EARLY_JOIN_MINUTES/LATE_JOIN_MINUTES` rộng. |
| E2E-027 | `doctor-workflow.spec.ts` | Doctor can save consultation summary | Skipped: missing consultation appointment seed | Consultation appointment có session tồn tại hoặc UI start trước; doctor có quyền | `ConsultationSession` | Yes | Nếu test đi thẳng route và nhập summary, backend cần session đã tồn tại; nếu không sẽ lỗi `Consultation session not found`. |
| E2E-028 | `doctor-workflow.spec.ts` | Doctor can create prescription | Skipped: missing consultation appointment seed | Consultation appointment có session; backend yêu cầu appointment `COMPLETED` trước khi create prescription | `Appointment`, `ConsultationSession`, `Prescription`, `PrescriptionItem` | Yes | Hiện test chỉ bấm save prescription; muốn pass thật cần appointment completed hoặc chỉnh test flow complete trước. |
| E2E-029 | `doctor-workflow.spec.ts` | Patient can view consultation result and prescription when row exists | Skipped: missing patient/completed consultation seed | Completed appointment thuộc patient.e2e có session summary, prescription items | `Appointment`, `ConsultationSession`, `Prescription`, `PrescriptionItem` | No | Có thể dùng completed appointment riêng với status `COMPLETED`. |
| E2E-030 | `admin.spec.ts` | Admin can view dashboard | Skipped by `E2E_RUN_SEEDED` gate | Admin account; nên có users/appointments/questions/ratings để dashboard có số liệu | `User`, `Appointment`, `Question`, `Rating` | No | Dashboard có thể pass với admin account, nhưng data giúp demo/report tốt hơn. |
| E2E-031 | `admin.spec.ts` | Admin can view doctor list | Skipped by `E2E_RUN_SEEDED` gate | Admin account; approved/pending doctors | `DoctorProfile`, `User`, `DoctorSpecialty` | No | Doctor table cần visible; nên có cả approved và pending. |
| E2E-032 | `admin.spec.ts` | Admin can approve/reject doctor profile when pending doctor seed exists | Skipped: missing pending doctor seed | Pending doctor profile id trong `E2E_PENDING_DOCTOR_ID` | `DoctorProfile`, `User`, `DoctorSpecialty` | Yes | Approval mutation thay đổi trạng thái; seed rerun phải đưa doctor.pending.e2e về `PENDING`. |
| E2E-033 | `admin.spec.ts` | Admin can view specialties | Skipped by `E2E_RUN_SEEDED` gate | Admin account; active specialties | `Specialty` | No | Seed dev có General/Cardiology; E2E nên thêm specialty prefix E2E. |
| E2E-034 | `admin.spec.ts` | Admin can create/update/deactivate specialty | Fixme: needs disposable specialty seed | Disposable specialty unique, active lúc bắt đầu test | `Specialty` | Yes | Test đang fixme; seed nên chuẩn bị `E2E Disposable Specialty` và reset active=true. |
| E2E-035 | `admin.spec.ts` | Non-admin cannot access admin dashboard | Skipped: missing patient/doctor env | Patient hoặc doctor account active | `User`, `PatientProfile`, `DoctorProfile` | No | Role guard negative test. |

## 3. Seed accounts cần tạo

| Role | Email | Password | Purpose | Required status |
|---|---|---|---|---|
| ADMIN | `admin@healthcare.local` | `Admin@123` | Admin login, dashboard, doctor approval, specialty/user/appointment admin flows | `User.isActive=true`, `deletedAt=null`, role `ADMIN` |
| PATIENT | `patient.e2e@healthcare.local` | `Patient@123` | Patient login, appointment, question, result/prescription, rating/history flows | `User.isActive=true`, `deletedAt=null`, role `PATIENT`, có `PatientProfile` đầy đủ |
| PATIENT | `patient.other.e2e@healthcare.local` | `Patient@123` | Optional ownership negative data | `User.isActive=true`, `deletedAt=null`, role `PATIENT`, có `PatientProfile` |
| DOCTOR | `doctor.e2e@healthcare.local` | `Doctor@123` | Approved public doctor, doctor login, appointment/question/consultation workflows | `User.isActive=true`, `deletedAt=null`, role `DOCTOR`, `DoctorProfile.approvalStatus=APPROVED`, `DoctorProfile.isActive=true`, có specialty/schedule |
| DOCTOR | `doctor.pending.e2e@healthcare.local` | `Doctor@123` | Admin doctor approval test | `User.isActive=true`, `deletedAt=null`, role `DOCTOR`, `DoctorProfile.approvalStatus=PENDING`, `DoctorProfile.isActive=false` hoặc theo UI cần duyệt |
| DOCTOR | `doctor.other.e2e@healthcare.local` | `Doctor@123` | Optional ownership negative data | `User.isActive=true`, `deletedAt=null`, role `DOCTOR`, `DoctorProfile.approvalStatus=APPROVED`, `DoctorProfile.isActive=true` |

## 4. Domain seed data cần tạo

- [ ] Specialty active: `E2E General Medicine`, `E2E Cardiology`, `E2E Pediatrics`, `E2E Dermatology`.
- [ ] Disposable specialty active: `E2E Disposable Specialty`.
- [ ] Approved doctor profile for `doctor.e2e@healthcare.local` with `E2E General Medicine` and `E2E Cardiology`.
- [ ] Doctor schedule JSON for approved doctor, covering bookable working days/hours.
- [ ] Pending doctor profile for `doctor.pending.e2e@healthcare.local` linked to `E2E Pediatrics`.
- [ ] Other approved doctor profile for `doctor.other.e2e@healthcare.local` linked to `E2E Dermatology`.
- [ ] Patient profile for `patient.e2e@healthcare.local`.
- [ ] Other patient profile for `patient.other.e2e@healthcare.local`.
- [ ] Public doctor rating summary data: visible rating for doctor.e2e so `avgRating` and `ratingCount` are non-null/non-zero.
- [ ] Future appointment for patient.e2e + doctor.e2e, status `PENDING_CONFIRMATION`, reason/notes prefixed `E2E`, used for confirm/detail/list.
- [ ] Confirmed appointment for patient.e2e + doctor.e2e, status `CONFIRMED`, used for complete/start consultation.
- [ ] Completed appointment for patient.e2e + doctor.e2e, status `COMPLETED`, scheduledAt in the past, used for consultation result/prescription/rating/history.
- [ ] Cancellable appointment for patient.e2e + doctor.e2e, status `PENDING_CONFIRMATION` or `CONFIRMED`, future, used only for cancel mutation.
- [ ] Optional other patient appointment or other doctor appointment for ownership negative tests.
- [ ] Pending question assigned to doctor.e2e or unassigned, status `PENDING`, used for doctor answer.
- [ ] Answered question for patient.e2e + doctor.e2e, status `ANSWERED`, with at least one approved answer.
- [ ] Optional other patient question for future ownership negative tests.
- [ ] Consultation session linked to completed appointment, status `COMPLETED`, `summary="E2E consultation summary..."`, `channel="CHAT"`.
- [ ] Consultation session linked to consultation workflow appointment if summary/prescription tests require existing session.
- [ ] Consultation messages for completed/session appointment if chat list becomes asserted later.
- [ ] Prescription linked to completed appointment consultation.
- [ ] Prescription items: at least one item such as `E2E Medicine A`, dosage `1 tablet`, frequency `Twice daily`, duration `5 days`, notes `After meals`.
- [ ] Rating linked to completed appointment, score `5`, comment `E2E excellent consultation`, status `VISIBLE`.
- [ ] Disposable specialty for admin CRUD test reset to active before each seeded run.
- [ ] Disposable appointment/question records for destructive mutation tests so running tests does not break demo data.

## 5. Idempotency strategy

- Upsert users by deterministic email.
- Upsert specialties by deterministic `nameEn`.
- Use stable E2E prefixes in visible fields: `E2E`, `E2E Pending Appointment`, `E2E Completed Consultation`, `E2E Disposable Specialty`.
- Avoid deleting non-E2E data. If cleanup is needed, filter by deterministic E2E users, specialty names, reason/notes/title prefixes, or known IDs collected from E2E-owned records.
- Use deterministic emails/names instead of random values for base seed records.
- For relations without natural unique constraints, find existing records by E2E-owned parent and stable marker fields, then update or recreate only those records.
- For appointment records, use non-overlapping `scheduledAt` values to avoid backend conflict logic. Current conflict statuses are `PENDING_CONFIRMATION` and `CONFIRMED`.
- Use future timestamps for active/pending/confirmed/cancellable appointments. Use past timestamps for completed history/result appointments.
- Consultation start/join tests must respect backend time-window checks. Either:
  - set `E2E_CONSULTATION_APPOINTMENT_ID` to an appointment scheduled near current time, or
  - run E2E with wider `CONSULTATION_EARLY_JOIN_MINUTES` / `CONSULTATION_LATE_JOIN_MINUTES`.
- Use separate disposable records for destructive tests:
  - cancel appointment,
  - doctor confirm appointment,
  - doctor complete appointment,
  - doctor answer pending question,
  - admin approve/reject pending doctor,
  - admin specialty create/update/deactivate.
- On every seed run, reset disposable E2E-owned records back to the expected starting status, for example pending doctor back to `PENDING`, cancellable appointment back to `PENDING_CONFIRMATION`, pending question back to `PENDING`, disposable specialty back to `isActive=true`.

## 6. Environment variables

Recommended Playwright env:

```bash
E2E_RUN_SEEDED=true
E2E_PATIENT_EMAIL=patient.e2e@healthcare.local
E2E_PATIENT_PASSWORD=Patient@123
E2E_DOCTOR_EMAIL=doctor.e2e@healthcare.local
E2E_DOCTOR_PASSWORD=Doctor@123
E2E_ADMIN_EMAIL=admin@healthcare.local
E2E_ADMIN_PASSWORD=Admin@123
E2E_APPROVED_DOCTOR_EMAIL=doctor.e2e@healthcare.local
E2E_PENDING_DOCTOR_EMAIL=doctor.pending.e2e@healthcare.local
E2E_DOCTOR_SEARCH_KEYWORD=cardiology
E2E_SPECIALTY_NAME=E2E Cardiology
```

Current frontend helpers still read these ID-based variables, so seed implementation should either print/write them after seeding or frontend test-data should be updated in a later phase to resolve by email:

```bash
E2E_APPROVED_DOCTOR_ID=<doctor.e2e DoctorProfile.id>
E2E_PENDING_DOCTOR_ID=<doctor.pending.e2e DoctorProfile.id>
E2E_APPOINTMENT_ID=<stable patient appointment id>
E2E_CONFIRMED_APPOINTMENT_ID=<confirmed appointment id>
E2E_COMPLETED_APPOINTMENT_ID=<completed appointment id>
E2E_CONSULTATION_APPOINTMENT_ID=<consultation workflow appointment id>
E2E_API_BASE_URL=http://localhost:4000
PLAYWRIGHT_BASE_URL=http://localhost:5173
```

Nếu muốn tránh truyền ID thủ công, nên tạo `docs/e2e-seed-env.example` hoặc xuất `.env.e2e.local` sau khi seed. Tuy nhiên cần cẩn thận không commit file chứa secret thật; với đồ án hiện tại các account E2E dùng mật khẩu demo cố định.

## 7. Implementation plan

1. Tạo backend `prisma/seed-e2e.ts`.
2. Dùng bcrypt giống backend hiện tại, mặc định `BCRYPT_ROUNDS` hoặc 10 rounds.
3. Tạo helper upsert user theo email:
   - update `passwordHash`, `firstName`, `lastName`, `role`, `isActive=true`, `deletedAt=null`;
   - create profile tương ứng nếu chưa có.
4. Upsert specialties theo `nameEn`, giữ `isActive=true`.
5. Upsert/link doctor specialties:
   - doctor.e2e -> `E2E General Medicine`, `E2E Cardiology`;
   - doctor.pending.e2e -> `E2E Pediatrics`;
   - doctor.other.e2e -> `E2E Dermatology`.
6. Upsert doctor profile fields:
   - approved doctor: `approvalStatus=APPROVED`, `isActive=true`, bio có keyword `cardiology`, schedule JSON bookable;
   - pending doctor: `approvalStatus=PENDING`, reset mỗi lần seed;
   - other doctor: approved/active.
7. Upsert patient profiles with useful demographic fields.
8. Recreate or reset E2E-owned appointments with stable notes/reason:
   - pending/detail/confirm appointment,
   - confirmed/complete appointment,
   - completed/result appointment,
   - cancellable disposable appointment,
   - consultation workflow appointment scheduled within allowed consultation window.
9. Create completed consultation session, messages, prescription, prescription items and visible rating for completed appointment.
10. Create pending question for doctor answer test and answered question for patient view-answer test. Reset pending question every seed run.
11. Create or reset disposable specialty for admin CRUD.
12. Add backend package scripts:
   - `db:seed:e2e`: `ts-node prisma/seed-e2e.ts`;
   - optional `e2e:prepare`: `npm run prisma:generate && npm run prisma:migrate:deploy && npm run db:seed:e2e`.
13. Do not change existing `prisma:seed` / `db:setup` dev seed behavior unless explicitly desired.
14. Update frontend test-data/env helper in a later phase if resolving IDs by email is preferred over env IDs.
15. Add docs for how to run seed and E2E.

## 8. Acceptance Criteria

- Backend `npm run build` pass after adding seed script.
- `npm run db:seed:e2e` pass.
- `npm run db:seed:e2e` can run multiple times without unique constraint errors.
- Seed script does not delete or mutate non-E2E dev/demo data.
- Seeded users can login with the documented credentials.
- Approved doctor appears in `/api/public/doctors` and `/api/public/doctors/:doctorId`.
- Public doctor rating summary has `avgRating` and `ratingCount` based on `VISIBLE` rating.
- Patient appointment list/detail has at least one E2E row.
- Patient cancel, doctor confirm, doctor complete, doctor answer question, admin doctor approval and admin specialty mutation use disposable data or resettable E2E-owned records.
- Completed consultation result returns summary, prescription and prescription items.
- Required Playwright env variables are documented and available.
- FE Playwright no longer skips because of missing seeded account/doctor/appointment/question/consultation data.
- Tests currently marked `test.fixme` are either intentionally documented as still fixme or reopened only after disposable seed/cleanup is ready.
- Existing dev seed remains available and unaffected if `db:seed:e2e` is not called.
