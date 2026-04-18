# Implementation Plan (Rebuild theo kiến trúc mới)

Baseline: `docs/RequirementBaseline.md` + `docs/CurrentStateReview.md`.
Mục tiêu: xây lại OnlineHealthConsultation-Service end-to-end đúng SRS v1.0.

## 1) Nguyên tắc thực thi

- Làm theo phase nhỏ, mỗi phase có deliverable chạy được.
- Ưu tiên luồng cốt lõi trước tính năng mở rộng.
- Mỗi phase phải có test và tiêu chí nghiệm thu rõ ràng.

## 2) Roadmap đề xuất

### Phase 0: Foundation Reset (1-2 tuần)

- Chuẩn hóa stack runtime:
  - Thống nhất PostgreSQL trên toàn bộ repo.
  - Dọn artefact MySQL (`.env.example`, migration/init cũ, script sai lệch).
- Chuẩn hóa project tooling:
  - Sửa script `package.json` về các lệnh tồn tại thực tế.
  - Bổ sung lint/test/build CI baseline.
- Thiết lập cross-cutting:
  - Config validation.
  - Global exception filter.
  - Structured logging + request id.

Deliverable:
- App khởi động ổn định.
- Migration + seed chạy được 1 lệnh.
- CI pipeline xanh ở mức cơ bản.

### Phase 1: Identity & Access Hardening (1-2 tuần)

- Hoàn thiện auth:
  - Login/register chuẩn hóa.
  - Logout + refresh token rotation + revoke session.
  - Forgot/reset password.
- Hoàn thiện authorization:
  - RolesGuard + OwnershipGuard.
  - Policy matrix theo actor.
- Bổ sung audit log cho hành động nhạy cảm.

Deliverable:
- Bộ endpoint auth đầy đủ.
- Test integration cho auth flows.

### Phase 2: Profile/Catalog/Discovery (1-2 tuần)

- User profile APIs cho patient/doctor.
- Specialty management cho admin.
- Discovery APIs public (guest/patient search doctor).
- Approval/active visibility rule cho doctor profile.

Deliverable:
- Guest có thể browse/tìm bác sĩ.
- Doctor/Patient cập nhật profile.

### Phase 3: Q&A + Appointment Core (2-3 tuần)

- Question lifecycle: create -> answer -> moderation.
- Appointment lifecycle:
  - booking, list, cancel, status transition.
  - conflict detection doctor/patient.
- Notification event cho create/answer/appointment.

Deliverable:
- Luồng Patient gửi câu hỏi và đặt lịch hoàn chỉnh.
- Test conflict booking + ownership.

### Phase 4: Consultation + Prescription + Rating (2-3 tuần)

- Consultation session lifecycle.
- Chat session cơ bản (MVP).
- Video mock adapter + fallback sang chat.
- Doctor summary + prescription.
- Patient rating sau completion.

Deliverable:
- Luồng tư vấn end-to-end chạy được.

### Phase 5: Admin, Reporting, Observability (1-2 tuần)

- Admin APIs: user moderation, content moderation, appointment oversight.
- Reporting dashboard APIs (kpi cơ bản).
- Hoàn thiện observability:
  - audit coverage,
  - health checks,
  - metrics/log dashboard hooks.

Deliverable:
- MVP hoàn chỉnh theo SRS core scope.

## 3) Backlog ưu tiên cao ngay sau review

- P0-01: Chốt quyết định DB duy nhất (PostgreSQL).
- P0-02: Refactor schema enum lệch SRS (`GUEST`, `PENDING_CONFIRMATION`, `CLOSED`, ...).
- P0-03: Tạo role/policy guards dùng chung.
- P0-04: Dựng bộ contract API v1 + error model thống nhất.
- P0-05: Tạo test harness integration với test DB.

## 4) Risk register

- R1: DB inconsistency làm sai migration chain.
  - Mitigation: reset baseline migration ngay Phase 0.

- R2: Scope creep do thêm feature optional quá sớm.
  - Mitigation: khóa scope theo Requirement Baseline.

- R3: Thiếu coverage test ở luồng bảo mật và booking conflict.
  - Mitigation: bắt buộc integration test cho auth + appointment trước phase tiếp theo.

- R4: Realtime consultation complexity.
  - Mitigation: MVP dùng chat trước, video adapter mock ở mức cơ bản.

## 5) Tiêu chí hoàn thành MVP

- Hoàn thành FR-01..FR-13 mức “Implemented”.
- NFR bảo mật và quyền truy cập đạt mức production baseline.
- End-to-end demo được 4 luồng chính trong SRS.
- Có tài liệu vận hành: env, migration, seed, rollback, release checklist.
