# Architecture Overview (Target - SRS v1.0)

Updated: 2026-04-18

## 1. Architectural Goals

- Đáp ứng đầy đủ SRS MVP end-to-end.
- Thiết kế modular để mở rộng, nhưng ưu tiên tốc độ delivery và kiểm soát chất lượng.
- Bảo mật và tính toàn vẹn dữ liệu là yêu cầu bắt buộc ngay từ phase đầu.

## 2. Architecture Style

- `Modular Monolith` trên NestJS.
- Bên trong từng module áp dụng phân lớp:
  - `presentation` (controller/dto/api contract)
  - `application` (use-cases/orchestration)
  - `domain` (entities/rules/policies)
  - `infrastructure` (repositories/integrations)

## 3. Bounded Contexts and Modules

- `Identity`
- `UserProfile` (Patient + Doctor)
- `Specialty`
- `Discovery`
- `Question`
- `Appointment`
- `Consultation`
- `Prescription`
- `Rating`
- `Notification`
- `Admin`
- `Reporting`
- Shared: `Audit`, `Common Security`, `Observability`

## 4. Use-case to Module/API Mapping

| SRS flow/use-case | Main module(s) | API boundary |
|---|---|---|
| Guest tra cứu bác sĩ (UC-G-01..06) | Discovery, Specialty | `/api/v1/public/*` |
| Patient auth/profile (UC-P-01..06) | Identity, UserProfile | `/api/v1/auth/*`, `/api/v1/patients/*`, `/api/v1/doctors/*` |
| Patient hỏi đáp (UC-P-07, UC-P-11) | Question, Notification | `/api/v1/questions/*` |
| Booking & lịch hẹn (UC-P-08..09, UC-D-05..06) | Appointment, Notification | `/api/v1/appointments/*` |
| Consultation online (UC-P-10, UC-D-07..10) | Consultation, Prescription | `/api/v1/consultations/*` |
| Rating (UC-P-14) | Rating | `/api/v1/ratings/*` |
| Admin operations (UC-A-01..08) | Admin, Reporting | `/api/v1/admin/*`, `/api/v1/reports/*` |
| External notify/video/file (UC-E-01..04) | Notification, Consultation | Adapter interfaces |

## 5. Security and Access Control Architecture

## 5.1 Identity and session

- JWT access token + refresh token rotation.
- Refresh session lưu DB để revoke, detect reuse.
- Password hashing bằng bcrypt (cost theo env config).

## 5.2 Authorization policy

- `RolesGuard`: giới hạn theo vai trò.
- `OwnershipGuard`: bệnh nhân/bác sĩ chỉ truy cập dữ liệu thuộc quyền.
- `AdminPolicy`: quyền quản trị riêng, có audit bắt buộc.

## 5.3 API protection baseline

- 100% endpoint protected phải có auth + role + ownership check.
- Public API chỉ nằm trong namespace `/public`.
- Error format nhất quán, không lộ chi tiết nhạy cảm.

## 6. Data and Integration Architecture

- Database: PostgreSQL (single source).
- ORM: Prisma (regenerate từ schema mới).
- Internal async: domain events + outbox pattern.
- External adapters:
  - Notification adapter (SMTP/provider).
  - Video adapter (mock/WebRTC).
  - File storage adapter (S3/local abstraction).

## 7. Cross-cutting Components

- Config module + schema validation (fail-fast).
- Global exception filter.
- Structured logging + request id correlation.
- Audit log service.
- Health check endpoint.

## 8. Deployment Architecture (MVP)

- 1 backend service stateless.
- 1 PostgreSQL instance + backup policy.
- Optional Redis cho caching/rate-limit.

## 9. Architecture Decisions (must-have ADR)

- ADR-001: Chốt PostgreSQL làm RDBMS duy nhất.
- ADR-002: Modular monolith + clean-layer module boundaries.
- ADR-003: Auth policy model (RBAC + ownership).
- ADR-004: Outbox-based notification reliability.

## 10. Architecture Acceptance Checklist

- [ ] Tất cả module SRS có boundary rõ ràng.
- [ ] Mapping use-case -> API/module đầy đủ.
- [ ] Security architecture có role + ownership + audit.
- [ ] Data/integration architecture có fallback cho video và delivery retry cho notify.
