# Security Hardening Report

## Phạm vi

Đợt hardening này tập trung vào các yêu cầu phi chức năng trong SRS liên quan đến bảo mật, độ tin cậy và bảo vệ dữ liệu sức khỏe:

- Global validation
- Exception handling
- Security headers
- CORS
- Auth guards, role guards và ownership checks
- Prisma error handling
- Logging và audit logging
- Environment validation
- JWT configuration
- Sensitive logging
- Health data exposure
- Appointment transaction safety

## Kết quả audit

### Global validation

Backend dùng `ValidationPipe` toàn cục với `whitelist` và `transform`. Cấu hình hiện tại gồm:

- `forbidNonWhitelisted: true`: reject field ngoài DTO thay vì âm thầm bỏ qua.
- `forbidUnknownValues: true`: reject payload không hợp lệ ở cấp object.

Điều này giúp API không nhận các field ngoài hợp đồng, đặc biệt với dữ liệu hồ sơ sức khỏe và lịch hẹn.

### Exception handling

Backend có `HttpExceptionFilter` toàn cục với behavior hiện tại:

- Giữ response envelope thống nhất dạng `error.code`, `error.message`, `error.details`, `error.requestId`.
- Map Prisma known errors sang lỗi ứng dụng an toàn:
  - `P2002` -> `409 RESOURCE_CONFLICT`
  - `P2025` -> `404 RESOURCE_NOT_FOUND`
  - `P2003` -> `400 INVALID_REFERENCE`
- Không trả chi tiết database internals trong production.

### Security headers

Middleware security header cơ bản:

- `x-content-type-options: nosniff`
- `x-frame-options: DENY`
- `referrer-policy: no-referrer`
- `permissions-policy: camera=(), microphone=(), geolocation=()`
- Tắt `x-powered-by`

Không thêm `helmet` để tránh đưa thêm infrastructure/package ngoài phạm vi hiện tại.

### CORS

Production bắt buộc cấu hình `CORS_ORIGIN`. Runtime chỉ mở CORS tự do trong non-production. Socket.IO consultation gateway dùng cùng nguyên tắc origin.

### JWT configuration

Runtime đọc JWT secret qua `getRequiredEnv()` trong:

- `IdentityModule`
- `JwtStrategy`
- `AuthService`
- `ConsultationGateway`

Production env validation reject secret yếu hoặc secret dev mẫu như `super-secret-key-for-dev`, `refresh-secret-dev`, `change-me`, `changeme`.

### Refresh token cookie

Refresh token flow dùng HttpOnly cookie với production validation:

- `AUTH_REFRESH_COOKIE_SAME_SITE=none` bắt buộc `AUTH_REFRESH_COOKIE_SECURE=true`.
- Production vẫn mặc định secure cookie nếu biến secure không override.

### Authorization

Các controller chính enforce backend authorization bằng `JwtAuthGuard`, `RolesGuard`, và service-level ownership checks:

- Appointment APIs phân quyền `PATIENT`, `DOCTOR`, `ADMIN`.
- Consultation APIs phân biệt hành động của doctor/patient/admin.
- Admin moderation/reporting/user management dùng `ADMIN`.
- Public discovery/availability là các endpoint công khai có dữ liệu giới hạn.

Không phát hiện placeholder frontend-only authorization cho các action nhạy cảm trong backend scope audit này.

### Ownership checks

Backend đang dùng:

- `OwnershipGuard` cho endpoint user detail theo `userId`.
- Service-level ownership checks cho appointment, consultation, question, rating.

Một số ownership rule nằm trong service thay vì guard. Đây là chấp nhận được vì rule phụ thuộc dữ liệu quan hệ trong database.

### Sensitive logging và PHI exposure

Request logging hiện chỉ ghi method/path/status/duration/requestId, không log body hay token.

Audit metadata dùng `sanitizeAuditMetadata()` để redact:

- password/token/refreshToken
- email/phone/address/ipAddress/userAgent
- medicalHistory

Password reset flow không log plain reset token. Password reset notification failure chỉ log `tokenId`, không log token thật.

### Audit logging

Các hành động quan trọng có audit log:

- Login success
- Token refresh
- Logout
- Password reset requested/completed
- User/admin operations
- Doctor approval/profile/specialty updates
- Appointment create/confirm/cancel/complete/reschedule/admin status
- Question/answer moderation flow
- Consultation summary/prescription/session actions
- Moderation actions

Schema hiện tại có `AuditLog` và đang được dùng nhất quán; không cần audit subsystem riêng trong phạm vi hiện tại.

### Appointment transaction safety

Appointment booking và doctor reschedule đang dùng `Prisma.TransactionIsolationLevel.Serializable` và re-validate availability bên trong transaction:

- Doctor còn active/approved.
- Slot nằm trong working schedule.
- Không overlap với appointment active của doctor.
- Không overlap với appointment active của patient.

Đây là đúng với yêu cầu SRS về duplicate/conflict prevention.

### Notification provider

Development provider vẫn được giữ cho local/test. Production validation hiện reject `NOTIFICATION_PROVIDER=development` để tránh hệ thống production chạy mà không có email provider thật.

## Trạng thái bảo mật hiện tại

- `src/common/config/env.util.ts` cung cấp `getRequiredEnv()` và `parseCsvEnv()`.
- `validateEnv()` kiểm tra production JWT/CORS/cookie/notification config.
- JWT secrets được đọc từ required environment variables trong auth và Socket.IO gateway.
- `main.ts` cấu hình security headers cơ bản.
- Global `ValidationPipe` reject field ngoài DTO và unknown object values.
- `HttpExceptionFilter` map Prisma known errors sang application errors nhất quán.
- `.env.example` liệt kê các configuration keys cần thiết.
- Test coverage có env validation và exception filter specs.

## Giới hạn còn lại

- Chưa thêm `helmet`; header hiện được set thủ công để tránh thêm dependency ngoài phạm vi.
- `Socket.IO` CORS origin được tính tại module load time. Với deployment hiện tại dùng env trước khi process start, điều này ổn.
- Một số ownership policy vẫn nằm trong service layer thay vì guard vì cần truy vấn database theo quan hệ nghiệp vụ.
- Email provider thật vẫn phụ thuộc cấu hình deployment; development provider chỉ dùng để verify flow local/test.

## Verification

Verification command:

- `npm run type-check`

Các bước tiếp theo cần chạy sau khi hoàn tất patch:

- `npm test`
- `npm run build`
