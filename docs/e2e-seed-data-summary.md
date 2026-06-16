# E2E Seed Data Summary

## 1. Tổng quan

Đã thêm seed E2E riêng tại `prisma/seed-e2e.ts` để chuẩn bị dữ liệu nghiệp vụ thật cho Playwright E2E của `OnlineHealthConsultation-Web`.

Seed này độc lập với seed dev mặc định `prisma/seed.ts`. Script không xóa dữ liệu thật/dev không thuộc E2E; dữ liệu E2E được nhận diện bằng email cố định và prefix `E2E` trong tên/chuyên khoa/reason/notes/title.

## 2. Seed accounts

| Role | Email | Password | Trạng thái |
|---|---|---|---|
| ADMIN | `admin@healthcare.local` | `Admin@123` | Active |
| PATIENT | `patient.e2e@healthcare.local` | `Patient@123` | Active, có patient profile |
| PATIENT | `patient.other.e2e@healthcare.local` | `Patient@123` | Active, dùng cho ownership negative |
| DOCTOR | `doctor.e2e@healthcare.local` | `Doctor@123` | Active, approved, public, có specialty/schedule |
| DOCTOR | `doctor.pending.e2e@healthcare.local` | `Doctor@123` | Active user, doctor profile `PENDING`, dùng cho admin approval |
| DOCTOR | `doctor.other.e2e@healthcare.local` | `Doctor@123` | Active, approved, dùng cho ownership negative |

## 3. Seed specialties

- `E2E General Medicine`
- `E2E Cardiology`
- `E2E Pediatrics`
- `E2E Dermatology`
- `E2E Disposable Specialty`

Doctor-specialty links:

- `doctor.e2e@healthcare.local`: `E2E General Medicine`, `E2E Cardiology`
- `doctor.pending.e2e@healthcare.local`: `E2E Pediatrics`
- `doctor.other.e2e@healthcare.local`: `E2E Dermatology`

## 4. Seed domain data

Appointments:

- `E2E Pending Appointment`: `PENDING_CONFIRMATION`, future, used for detail/confirm.
- `E2E Confirmed Appointment`: `CONFIRMED`, future, used for complete.
- `E2E Completed Appointment`: `COMPLETED`, past, used for result/prescription/rating/history.
- `E2E Cancellable Appointment`: `PENDING_CONFIRMATION`, future, disposable for cancel test.
- `E2E Consultation Workflow Appointment`: `COMPLETED`, near current time, used for consultation route/summary/prescription tests.
- `E2E Other Patient Appointment`: optional ownership negative record.

Questions:

- `E2E Pending Question`: `PENDING`, assigned to approved E2E doctor, resettable for doctor answer.
- `E2E Answered Question`: `ANSWERED`, includes approved answer.
- `E2E Other Patient Question`: optional ownership negative record.

Consultations/prescriptions/ratings:

- Completed consultation session with summary and chat messages.
- Workflow consultation session with summary and chat messages.
- Prescription with `E2E Medicine A`.
- Visible rating score `5` with comment `E2E excellent consultation`.

## 5. Scripts added

Backend package scripts:

```bash
npm run db:seed:e2e
npm run e2e:prepare
```

`db:seed:e2e` runs only the E2E seed script.

`e2e:prepare` runs Prisma generate, migration deploy, then E2E seed.

## 6. Cách chạy

Backend:

```bash
cd OnlineHealthConsultation-Service
source ~/.nvm/nvm.sh
npm run build
npm run db:seed:e2e
```

Nếu database chưa migrate:

```bash
cd OnlineHealthConsultation-Service
source ~/.nvm/nvm.sh
npm run e2e:prepare
```

Frontend Playwright:

```bash
cd OnlineHealthConsultation-Web
E2E_RUN_SEEDED=true \
E2E_PATIENT_EMAIL=patient.e2e@healthcare.local \
E2E_PATIENT_PASSWORD=Patient@123 \
E2E_DOCTOR_EMAIL=doctor.e2e@healthcare.local \
E2E_DOCTOR_PASSWORD=Doctor@123 \
E2E_ADMIN_EMAIL=admin@healthcare.local \
E2E_ADMIN_PASSWORD=Admin@123 \
E2E_APPROVED_DOCTOR_ID=<printed by seed> \
E2E_PENDING_DOCTOR_ID=<printed by seed> \
E2E_APPOINTMENT_ID=<printed by seed> \
E2E_CONFIRMED_APPOINTMENT_ID=<printed by seed> \
E2E_COMPLETED_APPOINTMENT_ID=<printed by seed> \
E2E_CONSULTATION_APPOINTMENT_ID=<printed by seed> \
E2E_CANCELLABLE_APPOINTMENT_ID=<printed by seed> \
npm run test:e2e
```

The seed script prints the required ID-based env values after successful execution.

## 7. Disposable/destructive data

These records are reset on each seed run and can be used by mutation tests:

- Pending doctor profile for admin approval.
- Pending appointment for doctor confirm.
- Confirmed appointment for doctor complete.
- Cancellable appointment for patient cancel.
- Pending question for doctor answer.
- Disposable specialty for admin specialty mutation.

After the full seeded run, only one Playwright test remains `test.fixme`: E2E-023 for doctor unauthorized direct question access. This is not a seed gap; the current frontend MVP has no direct question detail route/API for that negative test.

## 8. Validation results

Commands actually run:

```bash
source ~/.nvm/nvm.sh && npm run build
source ~/.nvm/nvm.sh && npm run db:seed:e2e
source ~/.nvm/nvm.sh && npm run prisma:migrate:deploy
source ~/.nvm/nvm.sh && npm run db:seed:e2e
source ~/.nvm/nvm.sh && npm run db:seed:e2e
source ~/.nvm/nvm.sh && npm run build
curl -s http://localhost:4000/api/health
source ~/.nvm/nvm.sh && npm test
```

Results:

- `npm run build`: pass.
- First `npm run db:seed:e2e`: script compiled, but local database was not reachable from the initial sandboxed command.
- Retried with local DB access: seed reached PostgreSQL, then failed because local database was missing migration `20260418150000_add_consultation_messages`; table `consultation_messages` did not exist.
- `npm run prisma:migrate:deploy`: pass. Applied missing migrations:
  - `20260418150000_add_consultation_messages`
  - `20260418162000_add_notification_external_ref`
- `npm run db:seed:e2e` after migrations: pass.
- Second `npm run db:seed:e2e`: pass with the same IDs, confirming idempotency for the current seed data.
- Final `npm run build`: pass.
- Backend dev server started successfully at `http://localhost:4000/api`.
- Health check returned `status: ok` with database status `ok`.
- `npm test`: pass with current Jest config `--passWithNoTests`; Jest reported `No tests found`.

Seed output env values from the validated run:

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
E2E_APPROVED_DOCTOR_ID=019ed085-9bb9-7a83-bdee-b3b266b827b8
E2E_PENDING_DOCTOR_ID=019ed085-9bb9-7a83-bdee-b3b35ffc1f61
E2E_APPOINTMENT_ID=019ed085-9bc5-7ee1-aeb6-93edb9a2e3ce
E2E_CONFIRMED_APPOINTMENT_ID=019ed085-9bc7-7925-9834-cedf831db8df
E2E_COMPLETED_APPOINTMENT_ID=019ed085-9bca-78ba-b82b-f11d937b337c
E2E_CONSULTATION_APPOINTMENT_ID=019ed085-9bcc-76ff-91ae-fa05ce14721d
E2E_CANCELLABLE_APPOINTMENT_ID=019ed085-9bc9-76a1-b3d0-7f6a3899cc0b
E2E_DOCTOR_SEARCH_KEYWORD=cardiology
E2E_SPECIALTY_NAME=E2E Cardiology
```

## 9. Full Playwright validation

Frontend commands actually run after backend and frontend servers were available:

```bash
source ~/.nvm/nvm.sh && npm run build
source ~/.nvm/nvm.sh && npm run lint
source ~/.nvm/nvm.sh && npm run test:e2e
```

Final Playwright result:

- 37 tests discovered.
- 36 passed.
- 1 skipped/fixme.
- 0 failed.

Remaining skipped/fixme:

- E2E-023: Doctor unauthorized question direct route. Reason: frontend MVP has no direct question detail route/API; this is a route/API coverage limitation, not missing seed data.

Fixes made while validating the full suite:

- Reopened public doctor detail and guest booking redirect tests by waiting for seeded doctor controls instead of skipping on early empty state.
- Reopened patient cancel appointment using `E2E_CANCELLABLE_APPOINTMENT_ID`.
- Reopened doctor confirm/complete tests and targeted deterministic appointment IDs.
- Reopened admin specialty create/update/deactivate with disposable test data.
- Reopened question answer/result checks by waiting for seeded controls.

## 10. Rủi ro còn lại

- `E2E_CONSULTATION_APPOINTMENT_ID` is scheduled near current time because backend validates consultation join window.
- Full Playwright currently has one intentional fixme for a missing direct question detail route/API.
- If frontend keeps requiring ID env variables, copy the values printed by `db:seed:e2e` into the Playwright run command or an uncommitted local env file.
