# Architecture Overiew (Target Architecture theo SRS v1.0)

## 1) Mục tiêu kiến trúc

- Triển khai theo hướng Modular Monolith trên NestJS cho MVP, nhưng thiết kế boundary đủ rõ để có thể tách microservice về sau.
- Bảo đảm 3 mục tiêu chính:
  - Delivery nhanh cho luồng nghiệp vụ cốt lõi.
  - Dễ bảo trì, dễ test, dễ mở rộng.
  - An toàn dữ liệu và kiểm soát quyền truy cập chặt chẽ.

## 2) Kiểu kiến trúc đề xuất

- Pattern: `Modular Monolith + Clean Architecture trong từng module`.
- Mỗi domain module gồm 4 lớp:
  - `presentation`: controller, dto, swagger contract.
  - `application`: use-case/service orchestration.
  - `domain`: entities, business rules, domain services.
  - `infrastructure`: prisma repository, integration adapter (email/video/storage).

## 3) Module boundaries (target)

- `IdentityModule`
  - AuthN (register/login/logout/refresh), password reset, session management.
  - RBAC guard + ownership policy.

- `UserProfileModule`
  - `PatientProfile` và `DoctorProfile` management.
  - Public doctor profile projection.

- `SpecialtyModule`
  - CRUD specialty cho admin.
  - Mapping doctor-specialty (many-to-many).

- `DiscoveryModule`
  - Public API cho Guest/Patient: search/filter/list doctor.

- `QuestionModule`
  - Tạo câu hỏi, phân công bác sĩ, trả lời, moderation.

- `AppointmentModule`
  - Booking, reschedule/cancel, conflict detection, trạng thái lịch hẹn.

- `ConsultationModule`
  - Tạo session theo appointment, chat/video session orchestration.
  - Kết luận tư vấn, đơn thuốc, lịch sử phiên.

- `RatingModule`
  - Đánh giá sau tư vấn, moderation điểm/comment.

- `NotificationModule`
  - Outbox + delivery adapter (email bắt buộc, SMS tùy chọn).

- `ReportingModule`
  - Dashboard KPI và truy vấn thống kê cho admin.

- `AdminModule`
  - Quản trị user/status/content moderation tổng hợp.

## 4) Cross-cutting components

- `AuthGuard + RolesGuard + OwnershipGuard` cho mọi endpoint protected.
- `GlobalExceptionFilter` chuẩn hóa format lỗi.
- `RequestId + Structured Logging` để trace end-to-end.
- `AuditLogService` cho hành động nhạy cảm.
- `ValidationPipe` + DTO validation bắt buộc server-side.
- `ConfigModule` + schema validation để fail-fast khi thiếu config.

## 5) Data & integration architecture

- Database: PostgreSQL (thống nhất toàn hệ thống).
- ORM: Prisma.
- Async pattern:
  - Domain Event nội bộ qua EventEmitter cho MVP.
  - Outbox table cho sự kiện cần đảm bảo phát thông báo.
- External adapters:
  - Notification provider (SMTP/transactional email).
  - Video provider (mock/WebRTC adapter).
  - File storage provider (S3-compatible hoặc local abstraction).

## 6) API design conventions

- RESTful endpoint theo resource + hành vi nghiệp vụ.
- Versioning: `/api/v1/...`.
- Response envelope nhất quán: `data`, `meta`, `error`.
- Pagination/filter/sort chuẩn hóa cho danh sách.
- Idempotency key cho hành động nhạy cảm (booking/notification trigger) khi cần.

## 7) Security architecture

- JWT access token + refresh token rotation.
- Session table để revoke và theo dõi token reuse.
- Password hashing bcrypt (cost theo config môi trường).
- PII masking trong log.
- Input validation + output serialization.
- Authorization theo role + ownership (ví dụ patient chỉ đọc dữ liệu của chính mình).

## 8) Luồng nghiệp vụ cốt lõi (target)

- Luồng 1: Guest discovery
  - Guest -> Discovery API -> Doctor public projection.

- Luồng 2: Booking
  - Patient -> Appointment API -> conflict check (doctor + patient) -> create appointment -> emit event -> Notification.

- Luồng 3: Q&A
  - Patient create question -> Doctor answer -> status transition -> notify patient.

- Luồng 4: Consultation
  - Doctor/Patient join session -> update session status -> doctor submit summary + prescription -> appointment complete -> enable rating.

## 9) Deployment kiến trúc (MVP)

- 1 backend service NestJS (stateless) sau load balancer.
- 1 PostgreSQL instance (primary) + backup policy.
- Optional:
  - Redis cho cache/rate-limit.
  - Message broker tách rời ở giai đoạn scale-out (phase sau).

## 10) Nguyên tắc tách microservice trong tương lai

- Ưu tiên tách theo bounded context khi có tải lớn/đội lớn:
  - Notification
  - Reporting
  - Realtime Consultation
- Chỉ tách khi có metric cho thấy bottleneck thật sự (latency, team coupling, release bottleneck).
