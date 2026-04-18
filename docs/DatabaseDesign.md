# Database Design (Theo kiến trúc mới)

## 1) Nguyên tắc thiết kế

- Sử dụng duy nhất PostgreSQL cho toàn bộ hệ thống.
- Khóa chính UUIDv7 (app-generated) cho tất cả aggregate chính.
- Có đầy đủ `created_at`, `updated_at`; các bảng quan trọng có `deleted_at` (soft delete khi phù hợp).
- Tối ưu truy vấn bằng composite index theo access pattern thực tế.
- Dùng transaction cho nghiệp vụ quan trọng: register, booking, consultation completion.

## 2) Domain model tổng quan

- Identity & Access
  - `users`
  - `user_sessions`
  - `audit_logs`

- Profiles & Catalog
  - `patient_profiles`
  - `doctor_profiles`
  - `specialties`
  - `doctor_specialties` (join table N-N)

- Q&A
  - `questions`
  - `answers`
  - `moderation_records`

- Appointment & Consultation
  - `appointments`
  - `consultation_sessions`
  - `prescriptions`
  - `prescription_items`

- Feedback & Notification
  - `ratings`
  - `notification_logs`
  - `outbox_events`

## 3) Enum chuẩn (đồng bộ SRS)

- `role_enum`: `GUEST`, `PATIENT`, `DOCTOR`, `ADMIN`
- `question_status_enum`: `PENDING`, `ANSWERED`, `CLOSED`, `MODERATED`
- `appointment_status_enum`: `PENDING_CONFIRMATION`, `CONFIRMED`, `COMPLETED`, `CANCELLED`, `NO_SHOW`
- `consultation_status_enum`: `SCHEDULED`, `ONGOING`, `COMPLETED`, `CANCELLED`
- `notification_type_enum`: `EMAIL`, `SMS`, `IN_APP`
- `notification_status_enum`: `PENDING`, `SENT`, `FAILED`
- `rating_status_enum`: `VISIBLE`, `HIDDEN`

## 4) Thiết kế bảng cốt lõi

### 4.1 `users`

- Cột chính: `id`, `email` (unique), `password_hash`, `role`, `is_active`, `deleted_at`.
- Index:
  - unique(`email`)
  - index(`role`, `is_active`)

### 4.2 `user_sessions`

- Lưu refresh token hash, expiry, revoke info.
- Index:
  - unique(`refresh_token_hash`)
  - index(`user_id`, `revoked_at`, `expires_at`)

### 4.3 `patient_profiles`

- 1-1 với `users` (patient).
- Thuộc tính y tế cơ bản: dob, gender, contact, medical_history.

### 4.4 `doctor_profiles`

- 1-1 với `users` (doctor).
- Thuộc tính chuyên môn: bio, years_of_experience, approval_status, is_active, schedule_json.
- Không gắn cứng 1 chuyên khoa; dùng bảng join `doctor_specialties`.

### 4.5 `specialties` + `doctor_specialties`

- `specialties`: danh mục chuyên khoa.
- `doctor_specialties`: N-N doctor <-> specialty.
- Unique composite(`doctor_id`, `specialty_id`).

### 4.6 `questions`

- Quan hệ patient -> question, optional assigned doctor.
- Trạng thái theo `question_status_enum`.
- Index:
  - (`patient_id`, `created_at desc`)
  - (`doctor_id`, `status`, `created_at desc`)

### 4.7 `answers`

- Mỗi answer gắn 1 question + 1 doctor.
- Có `is_approved` cho moderation.

### 4.8 `appointments`

- Quan hệ patient + doctor + slot thời gian.
- Cột chính: `scheduled_at`, `duration_minutes`, `status`, `reason`, `notes`.
- Index:
  - (`doctor_id`, `scheduled_at`)
  - (`patient_id`, `scheduled_at`)
  - (`doctor_id`, `status`, `scheduled_at`)
- Ràng buộc nghiệp vụ:
  - Chống overlap booking cùng doctor và cùng patient tại service level + transaction/locking.

### 4.9 `consultation_sessions`

- 1-1 với `appointments` (mỗi lịch hẹn có tối đa 1 session).
- Cột: start/end, summary, status, channel (`CHAT`/`VIDEO`).

### 4.10 `prescriptions` + `prescription_items`

- `prescriptions`: metadata đơn thuốc theo session.
- `prescription_items`: danh sách thuốc (name, dosage, frequency, duration, notes).
- Tách item table để hỗ trợ nhiều thuốc/đơn.

### 4.11 `ratings`

- 1 appointment tối đa 1 rating (unique appointment_id).
- Score 1-5 (check constraint).
- Comment text + moderation status.

### 4.12 `notification_logs`

- Lưu lịch sử gửi thông báo.
- Có provider response/error để debug delivery.

### 4.13 `outbox_events`

- Mẫu outbox cho event cần phát bất đồng bộ an toàn.
- Cột: `aggregate_type`, `aggregate_id`, `event_type`, `payload`, `status`, `next_retry_at`, `retry_count`.

### 4.14 `audit_logs`

- Bảng bắt buộc cho compliance nội bộ.
- Cột: actor, action, resource, resource_id, ip, user_agent, metadata, timestamp.

## 5) Quy tắc toàn vẹn dữ liệu

- FK rõ ràng giữa toàn bộ bảng quan hệ.
- Check constraint:
  - `ratings.score between 1 and 5`.
  - `duration_minutes > 0`.
  - `ended_at >= started_at` khi cả hai tồn tại.
- Soft delete chủ yếu ở `users`; dữ liệu nghiệp vụ y tế ưu tiên immutable/audit-friendly.

## 6) Access pattern quan trọng cần tối ưu

- Doctor dashboard: lịch hẹn sắp tới theo doctor + trạng thái.
- Patient history: consultation + prescription theo patient, sort giảm dần theo thời gian.
- Discovery: filter doctor theo specialty + active/approved + search keyword.
- Reporting: aggregate theo ngày/tuần/tháng cho appointments, sessions, active users.

## 7) Chiến lược migration

- Bước 1: chốt PostgreSQL và làm sạch tất cả artefact MySQL.
- Bước 2: tạo migration baseline mới từ schema đã chuẩn hóa.
- Bước 3: seed dữ liệu mẫu tương thích schema mới.
- Bước 4: thêm migration incremental theo từng phase nghiệp vụ.
- Bước 5: CI bắt buộc chạy `prisma validate`, `prisma migrate diff`, smoke test DB.
