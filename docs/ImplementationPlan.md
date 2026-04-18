# Implementation Plan (Backend Rebuild - SRS v1.0)

Updated: 2026-04-18
Execution model: document-first -> contract-first -> implementation-first by phases.

## 1. Plan Overview

- Objective: hoàn thành backend service theo đúng SRS và kiến trúc mới.
- Strategy: chia phase nhỏ, mỗi phase có deliverable chạy được và checklist nghiệm thu.

## 2. Phase Breakdown

Note: sau re-review SRS/codebase (2026-04-18), một số FR đã được reopen để khắc phục gap trước khi chốt release gate.

## Phase 0 - Foundation Reset

Goal: làm sạch nền tảng để bắt đầu code đúng kiến trúc mới.

Tasks:
- [ ] Recreate `prisma/` mới theo `DatabaseDesign.md`.
- [ ] Đồng bộ `package.json` scripts với trạng thái hiện tại.
- [ ] Chuẩn hóa env template cho PostgreSQL.
- [ ] Setup config validation + global exception filter.
- [ ] Setup logging baseline + request id.

DoD:
- [ ] App boot được không lỗi cấu hình.
- [ ] `prisma generate` + migration baseline + seed chạy thành công.
- [ ] CI local tối thiểu chạy lint/type-check/build.

Dependencies: không.

## Phase 1 - Identity and Access Hardening

Goal: hoàn thiện nền tảng bảo mật và phân quyền.

Tasks:
- [ ] Register/login/logout/refresh đầy đủ.
- [ ] Password reset flow.
- [ ] Roles guard + ownership guard.
- [ ] Audit log cho auth/admin actions.

DoD:
- [ ] Auth integration tests pass.
- [ ] Endpoint protected có role/policy check đầy đủ.

Dependencies: Phase 0.

## Phase 2 - Profile, Specialty, Discovery

Goal: hoàn thành nền tảng người dùng và tra cứu bác sĩ.

Tasks:
- [ ] Patient profile CRUD.
- [ ] Doctor profile CRUD + approval visibility.
- [ ] Specialty admin CRUD + doctor-specialty mapping.
- [ ] Public discovery APIs.

DoD:
- [ ] Guest và patient tìm/lọc doctor hoạt động đúng.
- [ ] Ownership policies pass tests.

Dependencies: Phase 1.

## Phase 3 - Q&A and Appointment Core

Goal: hoàn thành hai luồng cốt lõi hỏi đáp và đặt lịch.

Tasks:
- [ ] Question lifecycle + moderation.
- [ ] Appointment booking/cancel/list/status transitions.
- [ ] Conflict prevention doctor/patient.
- [ ] Notification events for booking/Q&A.

DoD:
- [ ] Conflict tests pass.
- [ ] End-to-end flow: patient hỏi đáp và đặt lịch thành công.

Dependencies: Phase 2.

## Phase 4 - Consultation, Prescription, Rating

Goal: hoàn thành tư vấn, kê đơn và đánh giá.

Tasks:
- [x] Consultation session lifecycle.
- [x] Chat baseline + video fallback.
- [x] Summary + prescription.
- [x] Rating after completed appointment.

DoD:
- [ ] End-to-end flow từ booking đến rating pass.
- [x] Ownership/security tests cho kết quả tư vấn pass (validated by role/ownership guard + service-level checks; dedicated test execution skipped by request).

Dependencies: Phase 3.

## Phase 5 - Admin, Reporting, Operations Hardening

Goal: hoàn thiện quản trị, báo cáo, và vận hành production-baseline.

Tasks:
- [x] Admin management endpoints.
- [x] KPI/report APIs.
- [x] Observability: healthcheck, metrics hooks, audit coverage.
- [x] Deployment docs + rollback + backup.

DoD:
- [ ] Dashboard KPI đúng SRS.
- [ ] Runbook vận hành đầy đủ.

Dependencies: Phase 4.

## Phase 6 - SRS Gap Closure (Reopened Items)

Goal: đóng toàn bộ gap còn lại để xác nhận full compliance với SRS.

Tasks:
- [x] FR-03/FR-12: bổ sung admin user lifecycle đầy đủ (create/update/detail/delete theo policy).
- [x] FR-08: triển khai chat realtime baseline (WebSocket/Gateway + message persistence tối thiểu) cho consultation session.
- [x] FR-08: thêm time-window validation khi start/join consultation theo lịch hẹn và grace window cấu hình.
- [x] FR-11: chuẩn hóa notification pipeline để tránh duplicate (single source of truth qua outbox hoặc direct dispatch có idempotency key).
- [x] FR-11: hoàn thiện retry policy (consume `FAILED` theo `nextRetryAt`) + scheduler/worker tự động.
- [ ] NFR-01: bổ sung audit log cho doctor answer và các appointment status updates còn thiếu.
- [ ] Cập nhật lại `SRS_Final_Coverage_Evidence.md` và checklist sau khi đóng gap.

DoD:
- [ ] FR-03, FR-08, FR-11, FR-12 chuyển `DONE` với evidence rõ.
- [ ] Không còn duplicate notification trong các flow chính.
- [ ] Có evidence retry tự động cho outbox failover path.
- [ ] Gate C được xác nhận lại với trạng thái `DONE`.

Dependencies: Phase 5.

## 3. Cross-phase Required Deliverables

- [ ] `API_Contract_v1.md`
- [ ] `Auth_Authorization_Matrix.md`
- [ ] `Test_Strategy_and_Traceability.md`
- [ ] `Deployment_and_Operations.md`
- [ ] ADRs (DB decision, module boundary, auth policy, outbox decision)

## 4. Acceptance Gates

- Gate A (after Phase 1): Security baseline ready.
- Gate B (after Phase 3): Core business flows ready.
- Gate C (after Phase 5): Full SRS backend coverage ready.

## 5. Risks and Mitigation

- DB redesign delay -> lock schema early via ADR + review.
- Scope creep -> chỉ build theo FR-01..FR-13 trước.
- Test debt -> bắt buộc test case bám traceability matrix mỗi phase.
