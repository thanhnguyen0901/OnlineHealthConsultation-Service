# SRS Master Checklist

Updated: 2026-04-18
Master objective: hoàn thành toàn bộ backend requirements theo `docs/srs/OnlineHealthConsultationPlatform_SRS_v1.0.md`.

## 1. Status Legend

- `NOT_STARTED`
- `IN_PROGRESS`
- `BLOCKED`
- `DONE`

Mỗi item cần cập nhật: `Status`, `Last Updated`, `Evidence`.

## 2. Latest Codebase Snapshot

- Current architecture: NestJS modular skeleton.
- Business implementation: chỉ có một phần nhỏ Identity.
- `prisma/` đã xóa để redesign hoàn toàn theo kiến trúc mới.
- Next critical move: hoàn thiện doc-first artifacts rồi dựng lại persistence + contracts.

## 3. Document Audit Checklist

## 3.1 Existing documents

- [x] `docs/srs/OnlineHealthConsultationPlatform_SRS_v1.0.md` (`DONE`)
- [x] `docs/RequirementBaseline.md` (`IN_PROGRESS`)
- [x] `docs/CurrentStateReview.md` (`IN_PROGRESS`)
- [x] `docs/ImplementationPlan.md` (`IN_PROGRESS`)
- [x] `docs/ArchitectureOverview.md` (`IN_PROGRESS`)
- [x] `docs/DatabaseDesign.md` (`IN_PROGRESS`)

## 3.2 Missing documents to create

- [ ] `docs/API_Contract_v1.md` (`NOT_STARTED`)
- [ ] `docs/Auth_Authorization_Matrix.md` (`NOT_STARTED`)
- [ ] `docs/Test_Strategy_and_Traceability.md` (`NOT_STARTED`)
- [ ] `docs/Deployment_and_Operations.md` (`NOT_STARTED`)
- [ ] `docs/ADR/ADR-001-db-decision.md` (`NOT_STARTED`)
- [ ] `docs/ADR/ADR-002-module-boundaries.md` (`NOT_STARTED`)
- [ ] `docs/ADR/ADR-003-auth-policy.md` (`NOT_STARTED`)
- [ ] `docs/ADR/ADR-004-outbox-notification.md` (`NOT_STARTED`)

## 4. Backend Completion Checklist (SRS-driven)

## 4.1 Foundation

- [ ] Recreate `prisma/` structure and schema (`NOT_STARTED`)
- [ ] Baseline migration + seed for PostgreSQL (`NOT_STARTED`)
- [ ] Package scripts aligned with actual files (`NOT_STARTED`)
- [ ] Config validation + exception filter + logging (`NOT_STARTED`)

## 4.2 FR Completion

- [ ] FR-01 Public access (`NOT_STARTED`)
- [ ] FR-02 Authentication and authorization (`IN_PROGRESS`)
- [ ] FR-03 Profile management (`NOT_STARTED`)
- [ ] FR-04 Specialty management (`NOT_STARTED`)
- [ ] FR-05 Doctor discovery (`NOT_STARTED`)
- [ ] FR-06 Health Q&A (`NOT_STARTED`)
- [ ] FR-07 Appointment management (`NOT_STARTED`)
- [ ] FR-08 Consultation session (`NOT_STARTED`)
- [ ] FR-09 Consultation outcome and prescription (`NOT_STARTED`)
- [ ] FR-10 Rating and feedback (`NOT_STARTED`)
- [ ] FR-11 Notifications (`NOT_STARTED`)
- [ ] FR-12 Administration (`NOT_STARTED`)
- [ ] FR-13 Reporting and statistics (`NOT_STARTED`)

## 4.3 NFR Completion

- [ ] NFR-01 Security (`IN_PROGRESS`)
- [ ] NFR-02 Privacy (`NOT_STARTED`)
- [ ] NFR-03 Performance (`NOT_STARTED`)
- [ ] NFR-04 Scalability (`NOT_STARTED`)
- [ ] NFR-05 Reliability (`NOT_STARTED`)
- [ ] NFR-06 Usability (`NOT_STARTED`)
- [ ] NFR-07 Maintainability (`IN_PROGRESS`)
- [ ] NFR-08 Compatibility (`NOT_STARTED`)

## 5. Phase Checklist (Execution)

## Phase 0 - Foundation Reset

- [ ] Complete all phase-0 tasks from `docs/ImplementationPlan.md`
- [ ] Gate A evidence collected

## Phase 1 - Identity Hardening

- [ ] Complete all phase-1 tasks
- [ ] Auth test suite evidence collected

## Phase 2 - Profile/Specialty/Discovery

- [ ] Complete all phase-2 tasks
- [ ] Access control tests evidence collected

## Phase 3 - Q&A/Appointment

- [ ] Complete all phase-3 tasks
- [ ] Conflict + lifecycle tests evidence collected

## Phase 4 - Consultation/Prescription/Rating

- [ ] Complete all phase-4 tasks
- [ ] End-to-end consultation flow evidence collected

## Phase 5 - Admin/Reporting/Ops

- [ ] Complete all phase-5 tasks
- [ ] Final SRS coverage evidence collected

## 6. Immediate Next Actions

- [ ] Create missing documents in section 3.2 (`NOT_STARTED`)
- [ ] Recreate `prisma/` and new schema from `DatabaseDesign.md` (`NOT_STARTED`)
- [ ] Draft API contract for phase 0-2 modules (`NOT_STARTED`)
- [ ] Start implementation Phase 0 (`NOT_STARTED`)

## 7. Progress Log

- 2026-04-18:
  - Re-ran analysis after prisma reset.
  - Renamed architecture doc to correct filename.
  - Expanded baseline/review/plan/database docs with traceability, acceptance criteria, and mapping details.
  - Refreshed master checklist to reflect latest codebase and required next work.
