# Final E2E Run Summary

## 1. Backend run status

- Repository: `OnlineHealthConsultation-Service`.
- Backend build: pass with `source ~/.nvm/nvm.sh && npm run build`.
- Backend Jest: pass with `source ~/.nvm/nvm.sh && npm test`; current config uses `jest --passWithNoTests` and reports `No tests found`.
- Migration deploy: pass with `source ~/.nvm/nvm.sh && npm run prisma:migrate:deploy`.
- E2E seed: pass and idempotent with `source ~/.nvm/nvm.sh && npm run db:seed:e2e`.
- Backend dev server: started successfully at `http://localhost:4000/api`.
- Health check: `GET http://localhost:4000/api/health` returned `status: ok` and database `status: ok`.

Note: an initial sandboxed backend/seed command could not reach PostgreSQL. The command was rerun with local DB access and passed after applying pending migrations.

## 2. Frontend run status

- Repository: `OnlineHealthConsultation-Web`.
- Frontend build: pass with `source ~/.nvm/nvm.sh && npm run build`.
- Frontend lint: pass with `source ~/.nvm/nvm.sh && npm run lint`.
- Frontend dev server: available at `http://localhost:5173`.
- Playwright target: real frontend + real backend + seeded PostgreSQL data.

## 3. Seed status

Seed source: `OnlineHealthConsultation-Service/prisma/seed-e2e.ts`.

Seed includes:

- Admin, patient, other patient, approved doctor, pending doctor and other doctor accounts.
- Active specialties and doctor-specialty links.
- Public doctor rating summary data.
- Pending, confirmed, completed, cancellable and consultation workflow appointments.
- Pending and answered questions.
- Consultation sessions, messages, summaries.
- Prescription and prescription items.
- Visible rating.
- Disposable data for patient cancel, doctor confirm/complete, doctor answer, admin approval and admin specialty mutation tests.

Validated env values:

```bash
E2E_RUN_SEEDED=true
E2E_PATIENT_EMAIL=patient.e2e@healthcare.local
E2E_PATIENT_PASSWORD=Patient@123
E2E_DOCTOR_EMAIL=doctor.e2e@healthcare.local
E2E_DOCTOR_PASSWORD=Doctor@123
E2E_ADMIN_EMAIL=admin@healthcare.local
E2E_ADMIN_PASSWORD=Admin@123
E2E_APPROVED_DOCTOR_ID=019ed085-9bb9-7a83-bdee-b3b266b827b8
E2E_PENDING_DOCTOR_ID=019ed085-9bb9-7a83-bdee-b3b35ffc1f61
E2E_APPOINTMENT_ID=019ed085-9bc5-7ee1-aeb6-93edb9a2e3ce
E2E_CONFIRMED_APPOINTMENT_ID=019ed085-9bc7-7925-9834-cedf831db8df
E2E_COMPLETED_APPOINTMENT_ID=019ed085-9bca-78ba-b82b-f11d937b337c
E2E_CONSULTATION_APPOINTMENT_ID=019ed085-9bcc-76ff-91ae-fa05ce14721d
E2E_CANCELLABLE_APPOINTMENT_ID=019ed085-9bc9-76a1-b3d0-7f6a3899cc0b
E2E_DOCTOR_SEARCH_KEYWORD=cardiology
E2E_SPECIALTY_NAME=E2E Cardiology
VITE_API_BASE_URL=http://localhost:4000
E2E_API_BASE_URL=http://localhost:4000
PLAYWRIGHT_BASE_URL=http://localhost:5173
```

## 4. Playwright command

Final full-suite command:

```bash
source ~/.nvm/nvm.sh && E2E_RUN_SEEDED=true E2E_PATIENT_EMAIL=patient.e2e@healthcare.local E2E_PATIENT_PASSWORD=Patient@123 E2E_DOCTOR_EMAIL=doctor.e2e@healthcare.local E2E_DOCTOR_PASSWORD=Doctor@123 E2E_ADMIN_EMAIL=admin@healthcare.local E2E_ADMIN_PASSWORD=Admin@123 E2E_APPROVED_DOCTOR_EMAIL=doctor.e2e@healthcare.local E2E_PENDING_DOCTOR_EMAIL=doctor.pending.e2e@healthcare.local E2E_APPROVED_DOCTOR_ID=019ed085-9bb9-7a83-bdee-b3b266b827b8 E2E_PENDING_DOCTOR_ID=019ed085-9bb9-7a83-bdee-b3b35ffc1f61 E2E_APPOINTMENT_ID=019ed085-9bc5-7ee1-aeb6-93edb9a2e3ce E2E_CONFIRMED_APPOINTMENT_ID=019ed085-9bc7-7925-9834-cedf831db8df E2E_COMPLETED_APPOINTMENT_ID=019ed085-9bca-78ba-b82b-f11d937b337c E2E_CONSULTATION_APPOINTMENT_ID=019ed085-9bcc-76ff-91ae-fa05ce14721d E2E_CANCELLABLE_APPOINTMENT_ID=019ed085-9bc9-76a1-b3d0-7f6a3899cc0b E2E_DOCTOR_SEARCH_KEYWORD=cardiology E2E_SPECIALTY_NAME="E2E Cardiology" VITE_API_BASE_URL=http://localhost:4000 E2E_API_BASE_URL=http://localhost:4000 PLAYWRIGHT_BASE_URL=http://localhost:5173 npm run test:e2e
```

## 5. Result summary

- Total discovered: 37.
- Passed: 36.
- Failed: 0.
- Skipped/fixme: 1.
- Final failure artifacts: none, because the final run had no failed tests.
- HTML report path: `OnlineHealthConsultation-Web/playwright-report/index.html`.
- Failure artifact path if future failures occur: `OnlineHealthConsultation-Web/test-results/`.

## 6. Test status by UC01-UC06

| Use case | Scope | Status |
|---|---|---|
| UC01 | Guest home, doctor list/search/detail, guest booking redirect | 5 passed |
| UC02 | Login, role guard, logout, login/register smoke | 8 passed |
| UC03 | Patient appointment create/list/detail/cancel/validation | 5 passed |
| UC04 | Patient question create/list, doctor inbox/answer, patient answer view, negative direct question access | 5 passed, 1 skipped/fixme |
| UC05 | Doctor appointment confirm/complete, consultation start/join, summary, prescription, patient result | 6 passed |
| UC06 | Admin dashboard, doctor list/approval, specialties, non-admin guard | 6 passed |

## 7. Remaining skipped/fixme/failures

- E2E-023 remains skipped/fixme.
- Reason: current frontend MVP has no direct question detail route/API for doctor unauthorized direct access testing.
- This is not a seed-data issue.
- Failures remaining: none in the final full-suite run.

## 8. Report sections updated

Updated in `docs/reports/OnlineHealthConsultationPlatform_Report.md`:

- Executive summary test result.
- Section 2.3 testing environment.
- UC01-UC06 test case result tables.
- Section 2.10 Playwright configuration and seeded env notes.
- Section 2.11 test result and bug notes.
- Chapter IV limitations and future improvements.

Updated supporting docs:

- `OnlineHealthConsultation-Web/docs/playwright-e2e-test-summary.md`.
- `OnlineHealthConsultation-Web/docs/test-seed-requirements.md`.
- `OnlineHealthConsultation-Service/docs/e2e-seed-data-summary.md`.

## 9. Screenshots still TODO

The report still needs manual screenshots inserted before Word/PDF export:

- Hình 35: Playwright E2E folder structure.
- Hình 36: Playwright terminal result.
- Hình 37: Playwright HTML report.

## 10. Recommended next actions before Word/PDF export

- Rerun `npm run db:seed:e2e` immediately before the final screenshot run.
- Rerun `npm run test:e2e` with the same seeded env values.
- Capture terminal output showing `36 passed, 1 skipped`.
- Open `OnlineHealthConsultation-Web/playwright-report/index.html` and capture the HTML report.
- Keep E2E-023 documented as a limitation unless a direct question detail route/API is implemented.
