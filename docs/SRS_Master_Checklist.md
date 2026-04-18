# SRS Master Checklist

Mục tiêu: theo dõi liên tục trạng thái hiện tại, kế hoạch tiếp theo và tiến độ thực thi đến khi hoàn thành toàn bộ yêu cầu trong `docs/srs/OnlineHealthConsultationPlatform_SRS_v1.0.md`.

Ngày tạo: 2026-04-18
Nguồn chuẩn: `docs/srs/OnlineHealthConsultationPlatform_SRS_v1.0.md`

## 1) Quy ước cập nhật

- Trạng thái dùng 4 mức:
  - `NOT_STARTED`
  - `IN_PROGRESS`
  - `BLOCKED`
  - `DONE`
- Mỗi lần hoàn thành một mục, cập nhật:
  - `Status`
  - `Last Updated`
  - `Evidence` (PR/file/test)

## 2) Snapshot hiện tại (codebase)

- Tổng quan: hệ thống mới ở mức nền tảng + một phần `Identity`.
- Phần lớn module nghiệp vụ theo SRS chưa triển khai.
- Có blocker lớn về hạ tầng dữ liệu: PostgreSQL vs MySQL đang không đồng nhất giữa schema/env/migration/docker.

## 3) Audit tài liệu hiện có trong docs/

### 3.1 Tài liệu đang có

- `docs/srs/OnlineHealthConsultationPlatform_SRS_v1.0.md`
- `docs/RequirementBaseline.md`
- `docs/CurrentStateReview.md`
- `docs/ImplementationPlan.md`
- `docs/ArchitectureOveriew.md`
- `docs/DatabaseDesign.md`

### 3.2 Đánh giá mức đầy đủ và chính xác theo SRS

1. `docs/srs/OnlineHealthConsultationPlatform_SRS_v1.0.md`
- Status: `DONE`
- Nhận xét: là nguồn requirement chuẩn.
- Action: không chỉnh sửa nội dung requirement gốc.

2. `docs/RequirementBaseline.md`
- Status: `IN_PROGRESS`
- Nhận xét: đã chuẩn hóa FR/NFR tốt, nhưng chưa có traceability theo từng UC-ID và chưa có acceptance criteria chi tiết theo module.
- Action:
  - [ ] Bổ sung mapping UC-G/UC-P/UC-D/UC-A -> endpoint/module cụ thể.
  - [ ] Bổ sung acceptance criteria dạng testable checklist cho từng FR.

3. `docs/CurrentStateReview.md`
- Status: `IN_PROGRESS`
- Nhận xét: phản ánh đúng trạng thái tổng quát, nhưng cần bổ sung phần bằng chứng kiểm thử và chỉ số coverage để theo dõi theo thời gian.
- Action:
  - [ ] Bổ sung bảng "Current vs Target" theo từng module với cột % completion.
  - [ ] Bổ sung mục "Verification Constraints" (môi trường thiếu npm, test chưa chạy được).

4. `docs/ImplementationPlan.md`
- Status: `IN_PROGRESS`
- Nhận xét: roadmap đúng hướng, nhưng chưa ở dạng checklist thực thi hàng ngày/tuần.
- Action:
  - [ ] Chuyển phase roadmap thành backlog có checkbox + dependency.
  - [ ] Gắn Definition of Done cho từng phase.

5. `docs/ArchitectureOveriew.md`
- Status: `IN_PROGRESS`
- Nhận xét:
  - Nội dung kiến trúc phù hợp định hướng SRS.
  - Tên file đang sai chính tả (`Overiew` thay vì `Overview`).
  - Chưa có mapping chi tiết giữa use-case chính và boundary module/API.
- Action:
  - [ ] Tạo file chuẩn `docs/ArchitectureOverview.md` và đồng bộ nội dung.
  - [ ] Bổ sung section "Use-case to Module/API Mapping".
  - [ ] Bổ sung section "Security & Access Control Architecture" ở mức policy cụ thể.

6. `docs/DatabaseDesign.md`
- Status: `IN_PROGRESS`
- Nhận xét: định hướng dữ liệu tốt, nhưng còn thiếu một số chi tiết để khớp đầy đủ SRS.
- Action:
  - [ ] Bổ sung thiết kế lưu file đính kèm (File Storage use cases UC-E-04).
  - [ ] Bổ sung ma trận mapping đầy đủ FR -> bảng/cột/ràng buộc.
  - [ ] Bổ sung chiến lược migration chuyển từ hiện trạng schema sang target schema (step-by-step).

### 3.3 Tài liệu còn thiếu (phải bổ sung)

- [ ] `docs/API_Contract_v1.md` (endpoint matrix theo actor/role + request/response/error).
- [ ] `docs/Auth_Authorization_Matrix.md` (role + ownership + policy theo resource).
- [ ] `docs/Test_Strategy_and_Traceability.md` (test plan bám UC/FR/NFR).
- [ ] `docs/Deployment_and_Operations.md` (env, migration, rollback, monitoring, backup).
- [ ] `docs/ADR/` (các quyết định kiến trúc chính, bắt buộc ít nhất DB decision và module boundary decision).

## 4) Checklist triển khai để hoàn thành toàn bộ SRS

## 4.1 Foundation & Platform

- [ ] Chuẩn hóa DB duy nhất PostgreSQL (`NOT_STARTED`)
- [ ] Đồng bộ `schema.prisma` + migration + `.env` + `docker-compose` (`NOT_STARTED`)
- [ ] Sửa script `package.json` trỏ file tồn tại thực tế (`NOT_STARTED`)
- [ ] Thiết lập CI tối thiểu: lint/build/test (`NOT_STARTED`)

## 4.2 FR Checklist (theo SRS mục 5)

- [ ] FR-01 Public Access (`NOT_STARTED`)
- [ ] FR-02 Auth & RBAC (`IN_PROGRESS`)
- [ ] FR-03 User Profiles (`NOT_STARTED`)
- [ ] FR-04 Specialty Management (`NOT_STARTED`)
- [ ] FR-05 Doctor Discovery (`NOT_STARTED`)
- [ ] FR-06 Health Q&A (`NOT_STARTED`)
- [ ] FR-07 Appointment Management (`NOT_STARTED`)
- [ ] FR-08 Consultation Session (`NOT_STARTED`)
- [ ] FR-09 Consultation Outcome & Prescription (`NOT_STARTED`)
- [ ] FR-10 Rating & Feedback (`NOT_STARTED`)
- [ ] FR-11 Notifications (`NOT_STARTED`)
- [ ] FR-12 Administration (`NOT_STARTED`)
- [ ] FR-13 Reporting & Statistics (`NOT_STARTED`)

## 4.3 NFR Checklist (theo SRS mục 6)

- [ ] NFR-01 Security (`IN_PROGRESS`)
- [ ] NFR-02 Privacy (`NOT_STARTED`)
- [ ] NFR-03 Performance (`NOT_STARTED`)
- [ ] NFR-04 Scalability (`NOT_STARTED`)
- [ ] NFR-05 Reliability (`NOT_STARTED`)
- [ ] NFR-06 Usability (`NOT_STARTED`)
- [ ] NFR-07 Maintainability (`IN_PROGRESS`)
- [ ] NFR-08 Compatibility (`NOT_STARTED`)

## 5) Immediate Next Actions (thực hiện ngay)

- [ ] A1: Chuẩn hóa và khóa quyết định kiến trúc DB PostgreSQL (blocker số 1).
- [ ] A2: Sửa bộ tài liệu kiến trúc/DB cho đầy đủ mapping theo SRS.
- [ ] A3: Tạo API contract + auth matrix để code theo contract-first.
- [ ] A4: Khởi động Phase 0 implementation theo checklist.

## 6) Progress Log

- 2026-04-18:
  - Tạo checklist master và audit toàn bộ tài liệu hiện có.
  - Xác định các file thiếu/sai/chưa đủ để đưa vào backlog xử lý.
