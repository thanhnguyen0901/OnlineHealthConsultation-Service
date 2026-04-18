# Current State Review (Codebase Audit)

Phạm vi review: toàn bộ mã nguồn hiện có trong `src/`, `prisma/`, cấu hình môi trường và script vận hành.
Baseline đối chiếu: `docs/srs/OnlineHealthConsultationPlatform_SRS_v1.0.md` + `docs/RequirementBaseline.md`.

## 1) Executive Summary

- Mức độ hoàn thiện tổng thể: khoảng 15-20% so với MVP target.
- Trạng thái hiện tại là "skeleton + partial identity":
  - Có khung NestJS modular monolith và Prisma schema tương đối nhiều thực thể.
  - Thực thi nghiệp vụ thực tế mới có module `Identity` (register/login/me ở mức cơ bản).
  - Các domain module còn lại (`Doctor`, `Patient`, `Appointment`, `Question`, `Consultation`, `Notification`, `Reporting`) gần như rỗng.

## 2) Findings theo nhóm

### 2.1 Kiến trúc & module

- Đã có cấu trúc module trong [`src/app.module.ts`](/Users/ThanhNguyen/Projects/SV/WebProgramming/OnlineHealthConsultation/OnlineHealthConsultation-Service/src/app.module.ts).
- Chỉ module identity có controller/service thực thi.
- Các module domain còn lại chỉ có file module rỗng:
  - [`src/modules/doctor/doctor.module.ts`](/Users/ThanhNguyen/Projects/SV/WebProgramming/OnlineHealthConsultation/OnlineHealthConsultation-Service/src/modules/doctor/doctor.module.ts)
  - [`src/modules/patient/patient.module.ts`](/Users/ThanhNguyen/Projects/SV/WebProgramming/OnlineHealthConsultation/OnlineHealthConsultation-Service/src/modules/patient/patient.module.ts)
  - [`src/modules/appointment/appointment.module.ts`](/Users/ThanhNguyen/Projects/SV/WebProgramming/OnlineHealthConsultation/OnlineHealthConsultation-Service/src/modules/appointment/appointment.module.ts)
  - [`src/modules/question/question.module.ts`](/Users/ThanhNguyen/Projects/SV/WebProgramming/OnlineHealthConsultation/OnlineHealthConsultation-Service/src/modules/question/question.module.ts)
  - [`src/modules/consultation/consultation.module.ts`](/Users/ThanhNguyen/Projects/SV/WebProgramming/OnlineHealthConsultation/OnlineHealthConsultation-Service/src/modules/consultation/consultation.module.ts)
  - [`src/modules/notification/notification.module.ts`](/Users/ThanhNguyen/Projects/SV/WebProgramming/OnlineHealthConsultation/OnlineHealthConsultation-Service/src/modules/notification/notification.module.ts)
  - [`src/modules/reporting/reporting.module.ts`](/Users/ThanhNguyen/Projects/SV/WebProgramming/OnlineHealthConsultation/OnlineHealthConsultation-Service/src/modules/reporting/reporting.module.ts)

### 2.2 Authentication & Authorization

- Đã có register/login/me:
  - [`src/modules/identity/auth.controller.ts`](/Users/ThanhNguyen/Projects/SV/WebProgramming/OnlineHealthConsultation/OnlineHealthConsultation-Service/src/modules/identity/auth.controller.ts)
  - [`src/modules/identity/auth.service.ts`](/Users/ThanhNguyen/Projects/SV/WebProgramming/OnlineHealthConsultation/OnlineHealthConsultation-Service/src/modules/identity/auth.service.ts)
  - [`src/modules/identity/users.service.ts`](/Users/ThanhNguyen/Projects/SV/WebProgramming/OnlineHealthConsultation/OnlineHealthConsultation-Service/src/modules/identity/users.service.ts)
- Thiếu:
  - Logout, refresh token flow, session revocation.
  - Forgot/reset password.
  - Role guard và policy/ownership guard cho endpoint nghiệp vụ.
- Lệch requirement:
  - SRS có vai trò Guest, nhưng enum `Role` trong schema chỉ có `PATIENT/DOCTOR/ADMIN`.

### 2.3 Database & persistence

- Prisma schema có nhiều entity cốt lõi trong [`prisma/schema.prisma`](/Users/ThanhNguyen/Projects/SV/WebProgramming/OnlineHealthConsultation/OnlineHealthConsultation-Service/prisma/schema.prisma).
- Tuy nhiên có mâu thuẫn nghiêm trọng về hạ tầng DB:
  - `schema.prisma` dùng `provider = "postgresql"`.
  - `.env` / `.env.example` dùng connection string MySQL.
  - `prisma/init.sql` và migration SQL hiện là cú pháp MySQL.
  - `docker-compose.yml` lại chạy PostgreSQL.
- Kết luận: pipeline migration/seed hiện chưa nhất quán với 1 RDBMS chuẩn, cần quyết định lại ngay từ đầu.

### 2.4 Build/Test/Tooling

- Không có test nghiệp vụ thực tế (script `test` đang để `--passWithNoTests`).
- Nhiều script tham chiếu file không tồn tại:
  - `dev` trỏ `src/server.ts` (file không có).
  - `db:triggers`, `db:check`, `verify:*` trỏ vào thư mục `scripts/` (không tồn tại).
- Trong môi trường review hiện tại không có `npm`, nên chưa thể xác nhận compile/runtime bằng lệnh.

### 2.5 Bảo mật & vận hành

- Điểm tốt:
  - Password hash bằng `bcryptjs`.
  - Có global validation pipe trong [`src/main.ts`](/Users/ThanhNguyen/Projects/SV/WebProgramming/OnlineHealthConsultation/OnlineHealthConsultation-Service/src/main.ts).
- Thiếu:
  - Audit log nghiệp vụ quan trọng.
  - Structured logging, exception mapping nhất quán.
  - Rate limiting, brute-force protection cho auth.
  - Secret/config validation tập trung.

## 3) Traceability Matrix (SRS -> Status)

- FR-01 Public Access: Missing
- FR-02 AuthN/AuthZ: Partial
- FR-03 Profile Management: Partial (tạo profile rỗng lúc register)
- FR-04 Specialty Management: Missing
- FR-05 Doctor Discovery: Missing
- FR-06 Health Q&A: Missing
- FR-07 Appointment Management: Missing
- FR-08 Consultation Session: Missing
- FR-09 Outcome & Prescription: Missing
- FR-10 Ratings & Feedback: Missing
- FR-11 Notifications: Missing
- FR-12 Administration: Missing
- FR-13 Reporting: Missing
- NFR Security/Privacy/Performance/Observability: Partial -> Missing

## 4) Gap quan trọng cần xử lý trước

- Gap-01 (Blocker): Chuẩn hóa 1 loại database duy nhất và align `schema`, migration, env, docker.
- Gap-02 (Blocker): Thiết kế lại kiến trúc ứng dụng ở mức module + contract + quyền truy cập trước khi code domain.
- Gap-03: Hoàn thiện auth platform-level (refresh/logout/session/audit/rbac guard).
- Gap-04: Triển khai domain luồng cốt lõi theo thứ tự booking -> consultation -> prescription -> rating -> reporting.
- Gap-05: Thiết lập kiểm thử tự động + CI quality gates.

## 5) Kết luận trạng thái hiện tại

Codebase hiện phù hợp để coi là điểm khởi đầu (foundation) cho việc xây dựng lại theo kiến trúc mới, nhưng chưa đạt mức có thể vận hành MVP theo SRS. Cần thực hiện refactor cấu hình nền và phát triển lại phần lớn nghiệp vụ theo roadmap chuẩn.
