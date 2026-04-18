# Requirement Baseline (SRS v1.0)

Updated: 2026-04-18
Source of truth: `docs/srs/OnlineHealthConsultationPlatform_SRS_v1.0.md`

## 1. Scope Baseline

## 1.1 In-scope MVP

- Public access cho Guest: homepage, specialty list, doctor discovery.
- Identity: register, login, logout, role-based access control.
- Profile: patient profile, doctor profile.
- Specialty management.
- Health Q&A.
- Appointment booking and management.
- Consultation session (chat required, video basic/mock optional).
- Consultation outcome and basic e-prescription.
- Rating and feedback after completed consultation.
- Notification (email required, SMS optional).
- Admin management + reporting dashboard.

## 1.2 Out-of-scope MVP

- AI diagnosis production.
- Hospital/EHR integration.
- IoT/wearable integration.
- Insurance and medicine delivery.
- Enterprise-grade video recording/playback.

## 2. Role Baseline

- Guest User: chỉ đọc dữ liệu public, không thao tác protected.
- Patient: tạo/sửa profile, hỏi đáp, đặt lịch, tham gia tư vấn, xem kết quả, đánh giá.
- Doctor: quản lý profile chuyên môn, trả lời câu hỏi, quản lý lịch, thực hiện tư vấn, kê đơn cơ bản.
- Administrator: quản lý người dùng, chuyên khoa, lịch hẹn, kiểm duyệt nội dung, xem báo cáo.

## 3. UC -> FR Traceability

| Use-case group | Use-cases | Linked FR |
|---|---|---|
| Guest | UC-G-01..UC-G-06 | FR-01, FR-05 |
| Patient | UC-P-01..UC-P-15 | FR-02..FR-11 |
| Doctor | UC-D-01..UC-D-11 | FR-02..FR-11 |
| Admin | UC-A-01..UC-A-08 | FR-02, FR-04, FR-06, FR-07, FR-10, FR-12, FR-13 |
| External | UC-E-01..UC-E-04 | FR-08, FR-11 |

## 4. FR Baseline with Testable Acceptance

## 4.1 FR-01 Public Access

- Requirement:
  - Guest truy cập trang public không cần auth.
  - Chỉ doctor active + approved được hiển thị public.
  - Action protected phải chuyển sang auth flow.
- Acceptance:
  - `GET /public/home`, `GET /public/specialties`, `GET /public/doctors` trả về `200` không cần token.
  - Doctor `inactive/unapproved` không xuất hiện trong response public.
  - Gọi endpoint protected không token trả `401/403` đúng chuẩn.

## 4.2 FR-02 Authentication & Authorization

- Requirement:
  - Register, login, logout.
  - RBAC cho Guest/Patient/Doctor/Admin.
  - Có reset password flow.
- Acceptance:
  - Register/login thành công trả token/session hợp lệ.
  - Logout revoke session/token theo policy.
  - Endpoint role-restricted trả `403` khi role không phù hợp.
  - Reset password flow có token xác thực và invalidate token sau khi dùng.

## 4.3 FR-03 User Profiles

- Requirement:
  - CRUD profile cho patient và doctor.
  - Admin có thể activate/deactivate user.
- Acceptance:
  - Patient chỉ sửa profile của chính mình.
  - Doctor chỉ sửa profile chuyên môn của chính mình.
  - Admin đổi trạng thái user có audit log.

## 4.4 FR-04 Specialty Management

- Requirement:
  - Admin CRUD specialty.
  - Doctor có thể gắn nhiều specialty.
- Acceptance:
  - Tạo/sửa/vô hiệu hóa specialty hoạt động đúng role.
  - N-N doctor-specialty lưu đúng và truy vấn được từ discovery.

## 4.5 FR-05 Doctor Discovery

- Requirement:
  - Guest/Patient tìm kiếm doctor theo keyword/specialty.
- Acceptance:
  - Filter theo specialty hoạt động đúng.
  - Response có summary profile + availability.

## 4.6 FR-06 Health Q&A

- Requirement:
  - Patient tạo câu hỏi.
  - Doctor trả lời.
  - Admin có thể kiểm duyệt.
- Acceptance:
  - State transition hợp lệ: `PENDING -> ANSWERED -> CLOSED`.
  - Patient chỉ xem câu hỏi của chính mình.

## 4.7 FR-07 Appointment Management

- Requirement:
  - Booking theo slot trống.
  - Chống trùng lịch doctor và patient.
  - Hỗ trợ trạng thái lịch hẹn chuẩn SRS.
- Acceptance:
  - Booking trùng trả lỗi conflict.
  - Chỉ transition trạng thái hợp lệ.
  - Doctor/patient/admin chỉ xem được phạm vi dữ liệu hợp role.

## 4.8 FR-08 Consultation Session

- Requirement:
  - Session gắn appointment hợp lệ.
  - Chat realtime.
  - Video fallback sang chat khi lỗi.
- Acceptance:
  - Không tạo/join session cho appointment không hợp lệ.
  - Fallback path ghi log và người dùng vẫn tư vấn được.

## 4.9 FR-09 Outcome & Prescription

- Requirement:
  - Doctor ghi summary và kê đơn cơ bản.
  - Patient chỉ xem kết quả của chính mình.
- Acceptance:
  - Prescription bắt buộc các trường thuốc/liều/tần suất/thời lượng.
  - Ownership check chặn đọc chéo dữ liệu.

## 4.10 FR-10 Ratings & Feedback

- Requirement:
  - Chỉ rating khi appointment completed.
- Acceptance:
  - Appointment chưa completed không thể rating.
  - Mỗi appointment tối đa 1 rating.

## 4.11 FR-11 Notifications

- Requirement:
  - Gửi xác nhận đặt lịch/nhắc lịch/thông báo có trả lời.
- Acceptance:
  - Notification log có trạng thái `PENDING/SENT/FAILED`.
  - Retry policy chạy được cho message lỗi tạm thời.

## 4.12 FR-12 Administration

- Requirement:
  - Admin quản lý user, specialty, appointment, moderation.
- Acceptance:
  - Tất cả endpoint quản trị yêu cầu role admin.
  - Hành động quản trị có audit trail.

## 4.13 FR-13 Reporting

- Requirement:
  - Dashboard số lượt tư vấn, active user, xu hướng theo thời gian.
- Acceptance:
  - API reporting trả đủ KPI tối thiểu.
  - Có filter theo khoảng thời gian.

## 5. NFR Baseline with Acceptance

| NFR | Baseline acceptance criteria |
|---|---|
| Security | 100% protected endpoint có auth + RBAC + ownership; password hash; audit log hành động nhạy cảm |
| Privacy | Mask PII trong log; dữ liệu y tế chỉ truy cập đúng quyền |
| Performance | P95 API thường < 3s ở môi trường MVP load profile |
| Scalability | Module boundary rõ ràng; service stateless-ready |
| Reliability | Flow booking không gây inconsistency; lỗi trả về format nhất quán |
| Usability | API error message rõ; contract ổn định |
| Maintainability | Code module hóa; API docs cập nhật; config đa môi trường |
| Compatibility | API client web hiện đại hoạt động ổn định |

## 6. Release Gate (DoD cấp hệ thống)

- FR-01..FR-13 đều có trạng thái `DONE` trong checklist + evidence test.
- NFR critical (`Security`, `Reliability`, `Maintainability`) đạt gate.
- End-to-end chạy đủ 4 luồng chính trong SRS mục 4.
- Tài liệu kiến trúc, DB, API contract, test traceability, vận hành đều hoàn chỉnh.
