# Test Strategy and Traceability

Updated: 2026-04-18

## 1. Test Objectives

- Bảo đảm backend đáp ứng FR/NFR theo SRS.
- Phát hiện sớm lỗi security, ownership, conflict booking, và data consistency.

## 2. Test Pyramid

- Unit tests: domain rules and use-cases.
- Integration tests: service + repository + database.
- API/E2E tests: flow theo use-case SRS.

## 3. FR Traceability to Test Suites

| FR | Test suite |
|---|---|
| FR-01 | `public.discovery.e2e-spec.ts` |
| FR-02 | `auth.integration-spec.ts`, `auth.e2e-spec.ts` |
| FR-03 | `profile.e2e-spec.ts` |
| FR-04 | `specialty.admin.e2e-spec.ts` |
| FR-05 | `doctor.discovery.e2e-spec.ts` |
| FR-06 | `questions.e2e-spec.ts` |
| FR-07 | `appointments.e2e-spec.ts`, `appointments.conflict.integration-spec.ts` |
| FR-08 | `consultations.e2e-spec.ts` |
| FR-09 | `prescriptions.e2e-spec.ts` |
| FR-10 | `ratings.e2e-spec.ts` |
| FR-11 | `notifications.integration-spec.ts` |
| FR-12 | `admin.operations.e2e-spec.ts` |
| FR-13 | `reporting.e2e-spec.ts` |

## 4. NFR Verification

- Security:
  - auth required checks,
  - role/ownership denial tests,
  - audit event tests.
- Reliability:
  - transaction rollback tests,
  - appointment conflict race-condition tests.
- Performance:
  - smoke benchmark for top endpoints.

## 5. Execution Stages

- PR stage:
  - unit + core integration tests.
- Pre-release stage:
  - full integration + e2e critical flows.

## 6. Exit Criteria

- All critical FR suites pass.
- Security and conflict tests pass with no blocker.
- Test report attached as release evidence.
