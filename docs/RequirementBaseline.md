# Requirement Baseline (Chuẩn hóa từ SRS v1.0)

Nguồn chuẩn: `docs/srs/OnlineHealthConsultationPlatform_SRS_v1.0.md`.
Mục tiêu tài liệu này là chuẩn hóa yêu cầu để làm baseline triển khai cho kiến trúc mới.

## 1) Scope chuẩn MVP

- In-scope:
  - Public discovery cho Guest User (trang chủ, chuyên khoa, tra cứu bác sĩ).
  - Identity & Access: đăng ký/đăng nhập/đăng xuất, RBAC cho Guest/Patient/Doctor/Admin.
  - Quản lý hồ sơ Patient và Doctor.
  - Quản lý chuyên khoa.
  - Gửi/đáp câu hỏi sức khỏe.
  - Đặt lịch, quản lý lịch hẹn, chống trùng lịch.
  - Phiên tư vấn online (chat bắt buộc, video ở mức mô phỏng/tích hợp cơ bản).
  - Kết luận tư vấn, đơn thuốc điện tử cơ bản.
  - Lịch sử tư vấn, đánh giá sau tư vấn.
  - Notification (email bắt buộc, SMS tùy chọn).
  - Dashboard và báo cáo cơ bản cho Admin.

- Out-of-scope MVP:
  - AI diagnosis production, EHR/hospital integration, IoT/wearable.
  - Bảo hiểm, logistics giao thuốc.
  - Video enterprise (ghi hình/lưu trữ/phát lại).
  - Native mobile app.

## 2) Actors & quyền nghiệp vụ

- Guest User: chỉ truy cập dữ liệu public, không thao tác protected.
- Patient: quản lý hồ sơ, hỏi đáp, đặt lịch, tham gia tư vấn, xem kết quả/đơn thuốc, đánh giá.
- Doctor: quản lý hồ sơ chuyên môn, xử lý câu hỏi, lịch hẹn, phiên tư vấn, kết luận/đơn thuốc.
- Admin: quản trị user/chuyên khoa/lịch hẹn, kiểm duyệt nội dung, xem báo cáo.

## 3) Functional Requirement chuẩn hóa (FR)

- FR-01 Public Access
  - Hệ thống cho phép Guest xem nội dung public, tìm bác sĩ theo chuyên khoa/từ khóa.
  - Chỉ hiển thị bác sĩ active + approved ở public area.
  - Các action protected phải redirect sang đăng nhập/đăng ký.

- FR-02 Authentication & Authorization
  - Đăng ký, đăng nhập, đăng xuất.
  - RBAC theo vai trò Guest/Patient/Doctor/Admin.
  - Chỉ truy cập dữ liệu/chức năng hợp vai trò.
  - Có quy trình quên mật khẩu/reset mật khẩu.

- FR-03 User Profile Management
  - Patient profile: thông tin cá nhân + sức khỏe cơ bản.
  - Doctor profile: chuyên khoa, bằng cấp, kinh nghiệm, mô tả, lịch làm việc.
  - Admin có thể tạo/cập nhật/kích hoạt/vô hiệu hóa user.

- FR-04 Specialty Management
  - Admin CRUD chuyên khoa và vô hiệu hóa chuyên khoa.
  - Doctor có thể gắn nhiều chuyên khoa (N-N).

- FR-05 Doctor Discovery
  - Guest/Patient có thể tìm/lọc bác sĩ.
  - Hiển thị thông tin chuyên môn + lịch khả dụng.

- FR-06 Health Q&A
  - Patient gửi câu hỏi.
  - Trạng thái tối thiểu: `PENDING`, `ANSWERED`, `CLOSED`.
  - Doctor xử lý và trả lời; Admin có thể kiểm duyệt.

- FR-07 Appointment Management
  - Patient đặt lịch với slot còn trống.
  - Chống trùng lịch doctor và patient.
  - Trạng thái tối thiểu: `PENDING_CONFIRMATION`, `CONFIRMED`, `COMPLETED`, `CANCELLED`.

- FR-08 Consultation Session
  - Khởi tạo session cho appointment hợp lệ.
  - Chat realtime bắt buộc; video có thể tích hợp cơ bản.
  - Fallback video -> chat khi lỗi.

- FR-09 Consultation Outcome & Prescription
  - Doctor ghi nhận kết luận.
  - Doctor tạo đơn thuốc cơ bản theo session.
  - Patient chỉ xem dữ liệu thuộc phiên của chính mình.

- FR-10 Ratings & Feedback
  - Chỉ đánh giá khi appointment đã hoàn tất.
  - Có điểm + nhận xét text.

- FR-11 Notifications
  - Gửi xác nhận tạo lịch/xác nhận lịch.
  - Nhắc lịch trước giờ hẹn.
  - Thông báo khi câu hỏi được trả lời.

- FR-12 Administration
  - Quản lý user, chuyên khoa, lịch hẹn, nội dung kiểm duyệt.

- FR-13 Reporting
  - Dashboard tối thiểu: tổng lượt tư vấn, active user, xu hướng theo thời gian.

## 4) Non-functional baseline (NFR)

- NFR-01 Security: HTTPS, hash password mạnh (bcrypt/Argon2), validate input server-side, chống OWASP Top Risks, audit log hành động quan trọng.
- NFR-02 Privacy: bảo vệ dữ liệu sức khỏe, hạn chế lộ dữ liệu trên UI/log.
- NFR-03 Performance: mục tiêu P95 < 3s cho API thường (không tính realtime/media/upload).
- NFR-04 Scalability: kiến trúc module hóa, service stateless, dễ thay provider ngoài.
- NFR-05 Reliability: xử lý lỗi nhất quán, không mất nhất quán dữ liệu lịch hẹn.
- NFR-06 Maintainability: code theo module/domain, tài liệu API nhất quán, cấu hình đa môi trường.

## 5) Acceptance baseline (Definition of Done cấp hệ thống)

- Tất cả luồng UC chính (Guest discovery -> Patient booking -> Doctor consultation -> Outcome/Prescription -> Rating/Notification -> Admin reporting) chạy end-to-end.
- 100% endpoint protected có auth + role check + ownership check.
- Có migration + seed + rollback strategy nhất quán với 1 hệ CSDL duy nhất.
- Có automated test tối thiểu cho luồng quan trọng (auth, booking conflict, ownership/security).
- Có observability cơ bản: structured logs, error tracking hooks, audit trail cho thao tác nhạy cảm.
