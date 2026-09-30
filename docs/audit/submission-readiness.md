# Submission Readiness Audit

Official topic: **Thiết kế và xây dựng hệ thống hỗ trợ tư vấn sức khỏe và quản lý lịch hẹn trực tuyến**

Audit date: 2026-08-22

## 1. Scope And Evidence

This audit reviews the final submission readiness of the complete graduation project across backend, frontend, functional coverage, architecture documentation, report documentation, diagram consistency, and code quality.

Reviewed repositories:

- `OnlineHealthConsultation-Service`
- `OnlineHealthConsultation-Web`

Primary evidence:

- Final source code in backend and frontend repositories.
- Graphify output for codebase navigation and dependency inspection: `graphify-out/GRAPH_REPORT.md`, `graphify-out/graph.json`, `graphify-out/manifest.json`.
- Final SRS: `docs/srs/OnlineHealthConsultationPlatform_SRS_v1.0.md`.
- Final traceability: `docs/audit/final-srs-traceability.md`.
- Test evidence: `docs/testing/final-e2e-results.md`, `docs/testing/e2e-test-matrix.md`, current backend test output, current build/type-check output.
- Architecture documents under `docs/architecture`.
- Report documents under `docs/report`.

Graphify was used as an assistive inspection tool for dependency hubs, module coverage, and stale-code candidates. Findings below are based on source, documentation, and command output, not Graphify node names alone.

## 2. Executive Summary

The project is technically close to submission. Backend and frontend production builds pass, backend tests pass, frontend TypeScript checking passes, Prisma schema validation passes, and the final SRS traceability shows that the main user journeys are implemented.

The project should still be submitted with fixes, not as fully ready, because the final report still contains figure placeholders that need exported diagrams/screenshots, the graduation E2E suite is documented as not yet reliable enough to claim full pass, and a small amount of submission-facing terminology/stub cleanup remains.

Submission status:

```text
READY_WITH_FIXES
```

## 3. Findings Classification

### BLOCKER

No blocker was found in this audit.

The core application can build, the backend automated unit/integration-style test suite passes, Prisma schema is valid, and the final traceability matrix does not show an unresolved mandatory core journey that prevents demonstration.

### SHOULD_FIX

| ID | Finding | Evidence | Impact | Required action |
| -- | ------- | -------- | ------ | --------------- |
| SF-01 | Final report figures are still placeholders and exported images are not present under `docs/report`. | `docs/report/BAO_CAO_TOT_NGHIEP.md` contains 18 `[INSERT FIGURE: ...]` placeholders; `docs/report/FIGURE_MANIFEST.md` marks all figures as `Needs export`, `Needs creation/export`, or `Needs screenshot`; only PlantUML source files are present under `docs/report/diagram-selection/plantuml/use-case`. | The Markdown report is structurally complete, but the Word/PDF submission package is not visually complete until diagrams and screenshots are inserted. | Export all approved diagrams and capture the four UI screenshots listed in `FIGURE_MANIFEST.md`, then insert them into the final Word/PDF. |
| SF-02 | Graduation E2E suite is not ready to claim full automated PASS. | `docs/testing/final-e2e-results.md` reports core suites: 42 passed, 0 failed, 1 skipped; graduation suite has GRAD-A, GRAD-B, GRAD-C issues classified as test-data/test-interaction/assertion defects. | The application can still be demonstrated, but the report or defense should not claim the graduation suite fully passes until corrected and rerun. | Fix the graduation Playwright spec data/interaction/assertions and rerun it, or explicitly state that only the core suites are verified. |
| SF-03 | Submission-facing `MVP` wording remains outside the report, including Swagger description and one Playwright note. | `src/main.ts` Swagger description says `The MVP backend for health consultation platform`; `OnlineHealthConsultation-Web/e2e/specs/patient-questions.spec.ts` has a `test.fixme` note mentioning `MVP`. | The report already avoids this term, but evaluators opening Swagger or source may see outdated project terminology. | Replace `MVP` wording with final project wording such as `backend service for the online health consultation platform`; update the old E2E note. |
| SF-04 | Some frontend component files are labeled as stubs. | `QuestionForm.tsx`, `AppointmentForm.tsx`, `DoctorTable.tsx`, `SpecialtyTable.tsx`, `AnswerEditor.tsx`, and `UserTable.tsx` contain `component stub` comments. | If unused, these look like unfinished code during source review; if used later, the naming can mislead evaluators. | Remove unused stub files or replace the comments with accurate descriptions after verifying imports. |
| SF-05 | Production external-provider readiness is intentionally limited and must be presented as such. | Traceability marks email provider as `PARTIAL`; SMS and advanced video are optional/provider-dependent; `NOTIFICATION_PROVIDER=development` is rejected in production by env validation; `VIDEO_PROVIDER_ENABLED=false` default gives chat/mock/fallback behavior. | The implemented system supports the workflow, but not production Email/SMS/video vendor delivery out of the box. | Keep the report/demo wording consistent: development notifications and provider boundaries exist; production provider configuration/integration is future or deployment work. |
| SF-06 | Responsive/cross-browser evidence is incomplete. | Traceability marks responsive UI and modern browser support as `PARTIAL`; no final cross-viewport screenshot matrix is present. | The frontend uses responsive implementation patterns, but the submission lacks explicit evidence for mobile/tablet/desktop verification. | Capture a small responsive screenshot/evidence set for public discovery, booking, consultation, and admin dashboard, or list it as an acknowledged limitation. |
| SF-07 | Backend CI uses a MySQL-shaped dummy `DATABASE_URL` although the final database is PostgreSQL. | `OnlineHealthConsultation-Service/.github/workflows/be-ci.yml` sets `DATABASE_URL=mysql://ci:ci@localhost:3306/ci_db`; Prisma schema provider is PostgreSQL. | Tests are mock-based, but the dummy value is inconsistent with architecture and may confuse reviewers or future CI changes. | Change the dummy CI URL to a PostgreSQL-shaped placeholder. |

### NICE_TO_HAVE

| ID | Finding | Evidence | Suggested action |
| -- | ------- | -------- | ---------------- |
| NH-01 | Frontend build emits chunk-size warnings. | `npm run build` in `OnlineHealthConsultation-Web` succeeds, but Vite reports chunks larger than 500 kB. | Consider route-level chunk tuning or manual chunks after submission-critical work. |
| NH-02 | Browserslist/caniuse-lite data is stale. | Frontend build warning says data is about 10 months old. | Run the recommended Browserslist update when convenient. |
| NH-03 | No current coverage percentage is available. | Backend tests pass, but no coverage command/result was produced in this audit. | Add a coverage run if a quantitative testing section is required by the evaluator. |
| NH-04 | Performance/load/concurrency benchmarks are not present. | Traceability marks performance/concurrency requirements as `PARTIAL`. | Add small k6/JMeter/Postman performance evidence if performance claims are needed. |
| NH-05 | Dormant `FileAttachment` schema remains although upload/storage is out of submitted scope. | Traceability marks file upload/storage as `NOT_IMPLEMENTED`; schema includes dormant model. | Leave documented as future work or remove after confirming no migration/report expectation depends on it. |

## 4. Backend Readiness

| Check | Result | Evidence / Notes |
| ----- | ------ | ---------------- |
| Production build | PASS | `npm run build` completed successfully in `OnlineHealthConsultation-Service` using Nest build. |
| TypeScript/type-check | PASS | `npm run type-check` completed successfully with `tsc --noEmit`. |
| Tests | PASS | `npm test -- --runInBand` passed: 9 test suites, 47 tests. Covered auth, appointment, notification, moderation, reporting, env validation, and exception filter areas. |
| Prisma schema | PASS | `npx prisma validate` reported the schema is valid. |
| Prisma migrations | PRESENT / PREVIOUSLY VERIFIED | Migration files exist under `prisma/migrations`; `docs/testing/final-e2e-results.md` records `npm run e2e:prepare`, `prisma migrate deploy`, and E2E seed success on 2026-08-20. Migration deploy was not rerun in this pass because it requires a live database target. |
| Seed scripts | PRESENT / PREVIOUSLY VERIFIED | `prisma/seed.ts` and `prisma/seed-e2e.ts` exist; E2E seed success is recorded in `docs/testing/final-e2e-results.md`. |
| `.env.example` | PASS WITH LIMITATION | Backend `.env.example` includes database, JWT, CORS, cookie, appointment, password reset, video, and notification variables. It correctly marks development notification provider as non-production. |
| API documentation | PASS WITH WORDING FIX | Swagger is configured at `/api/docs` in `src/main.ts`; controllers use Swagger decorators. The Swagger description still contains outdated `MVP` wording and should be updated. |
| No committed real secret | PASS | Search found placeholder/sample local credentials in env examples, Docker Compose, tests, and E2E scripts; no real secret/private key pattern was identified. |
| Debug/dead code | SHOULD_FIX | Several frontend stub comments exist; backend does not show obvious debug-only runtime code. |
| TODO/FIXME | SHOULD_FIX | No high-risk backend TODO was found in source, but `docs/architecture/database-erd.md` still has a TODO to insert the exported ERD; one frontend Playwright `test.fixme` note remains. |
| Runtime config | PASS | `validateEnv()` enforces required database/JWT config and stronger production checks for JWT secrets, CORS, refresh cookie, reset URL, and notification provider. |

## 5. Frontend Readiness

| Check | Result | Evidence / Notes |
| ----- | ------ | ---------------- |
| Production build | PASS WITH WARNINGS | `npm run build` completed successfully in `OnlineHealthConsultation-Web`; Vite reported chunk-size warnings and stale Browserslist data. |
| TypeScript/type-check | PASS | `npm run type-check` completed successfully with `tsc --noEmit`. |
| Tests | PARTIAL | Playwright E2E infrastructure exists. Final evidence records core suites with 42 passed, 0 failed, 1 skipped; graduation suite requires test fixes before claiming full pass. |
| Core routes | PASS | `src/app/routes.tsx` defines public, auth, patient, doctor, and admin routes with `AuthGuard` and `RoleGuard` where appropriate. |
| Responsive core screens | PARTIAL | Responsive Tailwind patterns exist across pages, but no final responsive screenshot matrix is attached. |
| Broken imports/routes | PASS | Frontend production build and type-check passed, which gives good evidence against broken imports and route component errors. |
| TODO placeholders | SHOULD_FIX | Several component files contain `component stub` comments; verify and clean before final source review. |
| Env template | PASS | `.env.example` defines `VITE_API_BASE_URL` and documents Socket.IO reuse of the same backend URL. |

## 6. Functional SRS Journey Readiness

| Journey | Traceability status | Readiness assessment |
| ------- | ------------------- | -------------------- |
| Guest public discovery | `COMPLETED` | Ready. Public pages and discovery APIs are implemented and documented. |
| Patient registration/login/profile | `COMPLETED` / `IMPLEMENTED_DIFFERENTLY` for full name storage | Ready. Difference is documented: full name is stored in `User`, health details in `PatientProfile`. |
| Doctor profile and schedule | `COMPLETED` | Ready. Doctor profile, specialties, approval, schedule, and public availability are implemented. |
| Administrator management | `COMPLETED` | Ready. User, doctor, patient, specialty, appointment, moderation, dashboard, and reporting areas exist. |
| Appointment booking/conflict lifecycle | `COMPLETED` | Ready. Serializable transactions and overlap validation are implemented; tests cover appointment service behavior. |
| Consultation and realtime chat | `COMPLETED` | Ready with demo caveat. Socket.IO chat and consultation lifecycle are implemented; video is fallback/mock/provider-dependent, not production video. |
| Result, prescription, rating | `COMPLETED` | Ready. Source and traceability confirm summary, prescription, rating, and moderation behavior. |
| Notification/reminder | `PARTIAL` for production email provider | Ready for local/system workflow demonstration; production email/SMS provider delivery must be stated as provider-dependent. |
| File upload/storage | `NOT_IMPLEMENTED` | Not a blocker if kept out of submitted scope. Do not claim it in report/demo. |

## 7. Architecture And Diagram Consistency

| Artifact | Status | Assessment |
| -------- | ------ | ---------- |
| Source vs Graphify | CONSISTENT | Graphify highlights expected hubs: `PrismaService`, auth, appointment, consultation, notification, reporting, frontend routes/pages. Source verification confirms these are real runtime areas. |
| System architecture documentation | CONSISTENT | `docs/architecture/system-architecture.md` matches the final modular monolith: React SPA, NestJS, PostgreSQL, REST, Socket.IO, Prisma, node-cron scheduler, provider boundaries. |
| Architecture Overview diagram | NEEDS EXPORT / MANUAL CHECK | Report expects `architecture-overview.png`. The documented architecture matches source, but the approved image itself must be exported and visually checked before final PDF submission. |
| ERD | SHOULD_FIX | `docs/architecture/database-erd.md` still contains a TODO asking to insert the ERD exported from database/Prisma. `database-erd.png` is listed in the manifest but not present. |
| Class Diagram | SHOULD_FIX | Decision is `KEEP_SIMPLIFIED`; report expects `backend-class-diagram.png`. The simplified diagram still needs creation/export from the approved scope. |
| System Flow | CONSISTENT / NEEDS EXPORT | `docs/architecture/system-flow-diagram.md` supports public discovery -> auth -> appointment -> consultation -> result/prescription -> rating, with supporting doctor/admin/notification roles. Export is still required. |
| Use Case diagrams | CONSISTENT / NEEDS EXPORT | Use-case selection keeps only Guest, Patient, Doctor, Administrator diagrams and preserves SRS IDs. PlantUML sources exist; PNG export is pending. |
| Sequence diagrams | CONSISTENT / NEEDS EXPORT | Selection keeps 6 representative sequences only: login, book appointment, consultation chat, prescription, notification outbox, admin moderation. Markdown exports exist; PNG export is pending. |
| Report-approved diagram policy | PASS | Master report uses only the approved diagram set and does not include every available diagram. |

Stale or risky diagram notes:

- The overall Use Case diagram is intentionally excluded because it is too dense and includes optional/external boundaries that could imply unimplemented scope.
- The full backend class diagram should not be inserted directly; the report correctly expects a simplified class diagram.
- ERD must be exported from the final Prisma/database schema, not recreated from memory.

## 8. Report Documentation Readiness

| Document | Status | Notes |
| -------- | ------ | ----- |
| `docs/report/REPORT_OUTLINE.md` | PASS | Approved structure and source-of-truth ownership are clear. |
| Chapters 1-7 | PASS WITH FIGURE PLACEHOLDERS | Chapters are present and aligned with the official topic. Implementation details are generally kept out of analysis/introduction chapters. |
| `docs/report/BAO_CAO_TOT_NGHIEP.md` | PASS WITH FIGURE PLACEHOLDERS | Combined report preserves structure, avoids outdated `MVP` terminology, distinguishes current implementation from future development, and includes end matter placeholders. |
| `docs/report/FIGURE_MANIFEST.md` | PASS | Lists every figure placeholder in the master report with source, export filename, section, and readiness. |
| Figure placeholders | SHOULD_FIX | All master report placeholders are accounted for in the manifest, but the actual exported files/screenshots are not present. |
| Tables | PASS | Tables are logically placed and mostly support requirements, design, testing, and traceability rather than duplicating narrative. |
| References | PASS WITH LIMITATION | Reference section exists as a placeholder; no fabricated references were added. Final bibliography still needs real references before Word/PDF submission if required by school template. |

## 9. Code Quality Review

Graphify-assisted inspection indicates expected dependency hubs rather than suspicious architecture drift:

- `PrismaService` is the persistence hub, as intended.
- `AppointmentService`, `ConsultationService`, `NotificationService`, `AuthService`, and `ReportingService` are expected business hubs.
- `ConsultationGateway` depends on consultation service for realtime entry; this matches architecture documentation.
- `NotificationScheduler` delegates to `NotificationService`, matching the outbox/background design.
- Frontend route, store, saga, API, and Socket.IO client files appear as expected hubs.

No high-risk circular architecture issue was found in this audit. The main code-quality cleanup candidates are submission-facing wording/stubs and consistency around CI environment placeholders.

## 10. Commands Run In This Audit

Backend:

```bash
npm run build
npm test -- --runInBand
npm run type-check
npx prisma validate
```

Frontend:

```bash
npm run build
npm run type-check
```

Inspection:

```bash
graphify query "Submission readiness audit: dependency hubs, suspicious cycles, stale or unreferenced modules, final architecture consistency, tests, report diagrams, implementation coverage for OnlineHealthConsultation" --budget 5000
rg -n "TODO|FIXME|XXX|HACK|MVP|stub|placeholder" ...
rg -n "(SECRET|PASSWORD|TOKEN|API_KEY|DATABASE_URL|JWT_SECRET|JWT_REFRESH_SECRET|PRIVATE_KEY|...)" ...
rg -n "\[INSERT FIGURE:" docs/report/...
```

## 11. Submission Status

```text
Submission status:
READY_WITH_FIXES

Blockers:
None.

Required actions:
1. Export and insert all report-approved diagrams and screenshots listed in docs/report/FIGURE_MANIFEST.md.
2. Fix or clearly qualify the graduation E2E suite before claiming full automated PASS.
3. Remove outdated MVP wording from Swagger/test notes.
4. Clean or remove frontend files/comments labeled as stubs after verifying whether they are referenced.
5. Keep production Email/SMS/video/file-storage limitations explicit in the report and demo.
6. Add a small responsive/cross-browser evidence set or retain it as a documented limitation.
7. Replace the backend CI dummy DATABASE_URL with a PostgreSQL-shaped placeholder.
```
