# Final E2E Verification Results

Date: 2026-08-20  
Workspace: `/Users/ThanhNguyen/Projects/SV/WebProgramming/OnlineHealthConsultation`

## Environment Used

- Backend: `OnlineHealthConsultation-Service`
- Frontend: `OnlineHealthConsultation-Web`
- Database: Docker PostgreSQL container `health_consultation_db`
- Backend URL: `http://localhost:4000/api`
- Frontend URL: `http://localhost:5173`
- Browser runner: Playwright Chromium
- Seed mode: `E2E_RUN_SEEDED=true`

## PostgreSQL, Migrations, And Seed Status

- PostgreSQL availability:
  - Docker Desktop was started.
  - `health_consultation_db` reached `healthy` status.
  - Direct in-container checks passed:
    - `pg_isready -U healthuser -d health_consultation_db`
    - `select 1 as ok;`
- Initial Prisma commands failed inside the Codex sandbox because localhost networking to `localhost:5432` was blocked.
  - Classification: environment/sandbox problem.
  - Resolution: reran Prisma commands outside the sandbox with approval.
- Prisma schema validation passed.
- `npm run e2e:prepare` passed:
  - `prisma generate` passed.
  - `prisma migrate deploy` passed.
  - Migration `20260820043000_add_doctor_professional_profile_fields` was applied on the first successful run.
  - Subsequent runs reported no pending migrations.
  - `db:seed:e2e` completed and printed seeded Playwright credentials/IDs.

## Application Startup Status

- Backend started with:
  - `npm run start:dev`
- Backend health check passed:
  - `GET http://localhost:4000/api/health`
  - Response included `status: "ok"` and database check `status: "ok"`.
- Frontend:
  - Started automatically by Playwright `webServer` from the frontend Playwright configuration.

## Test Suites Executed

### Graduation Suite Dry Run Without Seed Env

Command:

```bash
npx playwright test e2e/specs/graduation-flows.spec.ts --reporter=line
```

Result:

- Total: 4
- Passed: 0
- Failed: 0
- Skipped: 4

Notes:

- This run did not pass seed environment variables, so all graduation tests skipped.
- These skipped tests are not counted as verified PASS.

### Graduation Suite With Seed Env

Command:

```bash
npx playwright test e2e/specs/graduation-flows.spec.ts --reporter=line
```

Result:

- Total declared tests: 4
- Failed: 1
- Flaky: 1
- Did not run: 2

Observed details:

- `GRAD-A guest searches doctor, logs in, and books an appointment`
  - Initial full-suite result: reported flaky.
  - Isolated rerun with clean seed and `--retries=0`: failed.
  - Failure: `POST /api/appointments` returned `400 Doctor already has an appointment at this time`.
  - Classification: seed/test-data defect in the graduation spec.
  - Reason: the test picks a fixed relative slot with `futureDate(72 * 60)` instead of selecting an actually available slot from the availability API. The backend correctly rejects the conflict according to SRS duplicate/conflict prevention rules.

- `GRAD-B patient and doctor complete a live consultation with realtime chat`
  - Result: failed.
  - Failure: expected appointment status `COMPLETED`, received `CONFIRMED`.
  - Backend log showed no `PATCH /api/consultations/:appointmentId/end` request after the test clicked `end-consultation`.
  - Backend `ConsultationService.endSession` does update both `ConsultationSession.status` and `Appointment.status` to `COMPLETED` in a transaction.
  - Classification: test interaction defect.
  - Reason: the test clicks `save-summary` and immediately clicks `end-consultation` while the page can still be in `loading` state, so the end button is disabled and the click does not call the API.

- `GRAD-C patient asks a health question and sees the doctor response`
  - Did not run in the serial full-suite run because GRAD-B failed.
  - Isolated rerun: failed.
  - Failure: test expected the generated question `title` in `patient-question-table`.
  - Observed UI contained the question `content` and doctor answer, including the newly generated answer.
  - Classification: test assertion/data mismatch.
  - Reason: the current patient history UI displays question content and answer, while the graduation test asserts title text.

- `GRAD-D admin manages specialty, user, appointment, and moderation`
  - Did not run in the serial full-suite run because GRAD-B failed.
  - Isolated rerun with clean seed: passed.

### Core Smoke/Auth/Appointment/Consultation/Admin Suites

Command:

```bash
npx playwright test \
  e2e/specs/public.spec.ts \
  e2e/specs/auth.spec.ts \
  e2e/specs/patient-appointments.spec.ts \
  e2e/specs/patient-questions.spec.ts \
  e2e/specs/doctor-workflow.spec.ts \
  e2e/specs/admin.spec.ts \
  e2e/specs/consultation-socket-client.spec.ts \
  --reporter=line
```

Result:

- Total: 43
- Passed: 42
- Failed: 0
- Skipped: 1

Covered areas:

- Guest public discovery and protected-action redirect.
- Auth pages, login by role, role guard behavior, logout.
- Patient appointment create/list/detail/cancel/validation.
- Patient health question and doctor answer flow.
- Doctor appointment confirm/complete, consultation route, summary, prescription.
- Patient consultation result/prescription access.
- Admin dashboard, doctors, specialties, non-admin access denial.
- Reusable consultation Socket.IO client behavior.

The single skipped test was not reported as a failure by Playwright. It remains unverified and should not be counted as PASS.

## Defects Fixed During Verification

No application code was modified during this verification pass.

Reason:

- The blocking graduation failures were classified as test-data or test-interaction defects.
- No failing result clearly demonstrated an SRS-covered application defect requiring a code fix.

## Failure Classification Summary

| Item | Classification | Action Taken |
| --- | --- | --- |
| Initial Prisma migration failure inside sandbox | Environment/sandbox problem | Reran migrations outside sandbox with approval |
| GRAD-A appointment conflict | Seed/test-data defect | Documented; backend conflict prevention worked as expected |
| GRAD-B appointment not completed | Test interaction defect | Documented; backend end-session endpoint was not called |
| GRAD-C missing question title in table | Test assertion/data mismatch | Documented; UI showed question content and doctor response |

## Final Core-Flow Readiness Conclusion

The local environment can start successfully, migrations and seed complete, backend health passes, and the established core E2E suites are largely green:

- 42/43 existing core smoke/auth/appointment/question/doctor/admin/socket tests passed.
- 1 core test skipped and remains unverified.
- GRAD-D passed in isolation.
- Graduation suite is not ready to claim PASS because GRAD-A, GRAD-B, and GRAD-C contain test-data or interaction issues that prevent reliable verification.

Before final submission, the graduation E2E spec should be corrected to:

- Select an available appointment slot from the availability API instead of hard-coding a relative time.
- Wait for summary save/loading to finish before clicking `end-consultation`.
- Assert the patient question UI content that the page actually displays, or update the UI/test contract deliberately.

After those test fixes, rerun `e2e/specs/graduation-flows.spec.ts` and record a fresh result.
