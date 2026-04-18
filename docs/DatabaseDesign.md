# Database Design (Target Schema - SRS Aligned)

Updated: 2026-04-18
Database target: PostgreSQL

## 1. Design Principles

- Một hệ CSDL duy nhất: PostgreSQL.
- UUIDv7 cho primary key.
- Mọi bảng nghiệp vụ có `created_at`, `updated_at`.
- Dùng transaction cho use-case quan trọng (register, booking, complete consultation).
- Ràng buộc dữ liệu tại DB + rule tại service layer.

## 2. Core Entities

## 2.1 Identity and Security

- `users`
- `user_sessions`
- `password_reset_tokens`
- `audit_logs`

## 2.2 Profile and Catalog

- `patient_profiles`
- `doctor_profiles`
- `specialties`
- `doctor_specialties`

## 2.3 Clinical Workflows

- `questions`
- `answers`
- `question_moderations`
- `appointments`
- `consultation_sessions`
- `prescriptions`
- `prescription_items`
- `ratings`

## 2.4 Integration and Ops

- `notification_logs`
- `outbox_events`
- `file_attachments`

## 3. Enum Model (SRS-aligned)

- `role_enum`: `PATIENT`, `DOCTOR`, `ADMIN`
- `question_status_enum`: `PENDING`, `ANSWERED`, `CLOSED`, `MODERATED`
- `appointment_status_enum`: `PENDING_CONFIRMATION`, `CONFIRMED`, `COMPLETED`, `CANCELLED`, `NO_SHOW`
- `consultation_status_enum`: `SCHEDULED`, `ONGOING`, `COMPLETED`, `CANCELLED`
- `notification_type_enum`: `EMAIL`, `SMS`
- `notification_status_enum`: `PENDING`, `SENT`, `FAILED`
- `rating_status_enum`: `VISIBLE`, `HIDDEN`

Note: Guest là actor ở tầng truy cập public, không nhất thiết là role được lưu trong bảng `users`.

## 4. FR -> Data Mapping Matrix

| FR | Main tables | Key constraints |
|---|---|---|
| FR-01 Public access | `doctor_profiles`, `specialties`, `doctor_specialties` | Chỉ hiển thị doctor active + approved |
| FR-02 Auth/RBAC | `users`, `user_sessions`, `password_reset_tokens` | Unique email, session revoke, reset token expiry |
| FR-03 Profiles | `patient_profiles`, `doctor_profiles` | 1-1 với users |
| FR-04 Specialty | `specialties`, `doctor_specialties` | Unique (doctor_id, specialty_id) |
| FR-05 Discovery | `doctor_profiles`, `doctor_specialties` | Index theo specialty + active/approved |
| FR-06 Q&A | `questions`, `answers`, `question_moderations` | Status transition; ownership access |
| FR-07 Appointment | `appointments` | Conflict prevention doctor/patient |
| FR-08 Consultation | `consultation_sessions` | 1-1 appointment; access control |
| FR-09 Outcome/Prescription | `prescriptions`, `prescription_items` | Prescription gắn consultation completed |
| FR-10 Rating | `ratings` | Unique appointment_id; score 1..5 |
| FR-11 Notification | `notification_logs`, `outbox_events` | Retry + delivery status |
| FR-12 Administration | `users`, `specialties`, `appointments`, moderation tables | Admin-only operations + audit |
| FR-13 Reporting | Aggregation từ `appointments`, `consultation_sessions`, `users` | KPI theo thời gian |

## 5. Table-level Highlights

## 5.1 `users`

- Columns: `id`, `email`, `password_hash`, `role`, `is_active`, `deleted_at`.
- Index: unique(`email`), index(`role`, `is_active`).

## 5.2 `user_sessions`

- Columns: `user_id`, `refresh_token_hash`, `expires_at`, `revoked_at`, `rotated_at`, `last_used_at`.
- Index: unique(`refresh_token_hash`), index(`user_id`, `revoked_at`, `expires_at`).

## 5.3 `doctor_profiles`

- Columns: `user_id`, `bio`, `years_of_experience`, `approval_status`, `is_active`, `schedule_json`.
- Index: (`approval_status`, `is_active`).

## 5.4 `appointments`

- Columns: `patient_id`, `doctor_id`, `scheduled_at`, `duration_minutes`, `status`, `reason`, `notes`.
- Index: (`doctor_id`, `scheduled_at`), (`patient_id`, `scheduled_at`), (`status`, `scheduled_at`).

## 5.5 `consultation_sessions`

- Columns: `appointment_id` (unique), `status`, `started_at`, `ended_at`, `summary`, `channel`.

## 5.6 `prescriptions` and `prescription_items`

- `prescriptions`: metadata per session.
- `prescription_items`: many items per prescription (`medication_name`, `dosage`, `frequency`, `duration`, `notes`).

## 5.7 `file_attachments`

- Purpose: đáp ứng UC-E-04 và luồng upload tài liệu trong booking/Q&A/consultation.
- Columns: `owner_type`, `owner_id`, `storage_key`, `mime_type`, `size_bytes`, `uploaded_by`.

## 6. Data Integrity Rules

- FK đầy đủ giữa các bảng quan hệ.
- Check constraints:
  - `ratings.score BETWEEN 1 AND 5`
  - `appointments.duration_minutes > 0`
  - `consultation_sessions.ended_at >= started_at` khi cả hai khác null
- Transition rules enforce ở service layer + integration tests.

## 7. Migration Strategy (from current state)

- Step 1: Tạo mới `prisma/` với schema sạch theo tài liệu này.
- Step 2: Generate initial baseline migration cho PostgreSQL.
- Step 3: Tạo seed data tối thiểu cho local dev/test.
- Step 4: Regenerate Prisma client và sửa repository/services tương ứng.
- Step 5: Bổ sung migration incremental theo từng phase feature.

## 8. Database Acceptance Checklist

- [ ] Có schema Prisma mới đầy đủ bảng/enum theo tài liệu.
- [ ] Migrate up/down chạy ổn định trên local CI.
- [ ] Seed chạy thành công và idempotent.
- [ ] Conflict booking + ownership query có index phù hợp.
- [ ] File attachment model hỗ trợ đủ use-case của SRS.
