# Online Health Consultation Service

Backend service cho hệ thống tư vấn sức khỏe trực tuyến. Repo này cung cấp REST API, Socket.IO realtime gateway, Prisma data model, seed demo data, notification/outbox processing, reporting và backend authorization cho các luồng nghiệp vụ trong SRS.

## Business Overview

Hệ thống hỗ trợ tư vấn sức khỏe trực tuyến cho bốn nhóm người dùng theo nghiệp vụ:

- Guest: xem trang công khai, chuyên khoa, danh sách bác sĩ và hồ sơ bác sĩ đã được duyệt.
- Patient: đăng ký/đăng nhập, cập nhật hồ sơ sức khỏe, gửi câu hỏi, đặt lịch theo slot khả dụng, tham gia phiên tư vấn, xem kết quả/đơn thuốc và đánh giá bác sĩ.
- Doctor: quản lý hồ sơ chuyên môn/lịch làm việc, trả lời câu hỏi, xác nhận lịch hẹn, bắt đầu phiên tư vấn, chat realtime, ghi summary và prescription.
- Administrator: quản lý users, doctors, specialties, appointments, moderation, reporting và cấu hình vận hành.

Nền tảng chỉ hỗ trợ tư vấn online tham khảo/hỗ trợ, không thay thế cấp cứu hoặc khám trực tiếp khi cần.

## Architecture

Backend được tổ chức theo modular monolith trên NestJS. Mỗi module sở hữu một phần nghiệp vụ rõ ràng, dùng Prisma làm data access layer và service/domain layer để chứa business rules.

```text
src/
├── common/                 # config, decorators, guards, filters, privacy helpers
├── modules/
│   ├── appointment/         # booking, availability, conflict prevention, appointment lifecycle
│   ├── consultation/        # session lifecycle, chat, summary, prescription, rating, Socket.IO gateway
│   ├── discovery/           # public specialties/doctors/home APIs
│   ├── doctor/              # doctor profile, schedule, specialties, admin approval
│   ├── identity/            # auth, users, sessions, password recovery, admin user management
│   ├── moderation/          # admin moderation workflow
│   ├── notification/        # outbox, notification log, provider abstraction, reminders
│   ├── operations/          # operational endpoints
│   ├── patient/             # patient health profile
│   ├── question/            # health questions and doctor answers
│   ├── reporting/           # admin reporting/dashboard data
│   └── specialty/           # specialty CRUD
└── prisma/                  # Prisma module/service integration
```

## Tech Stack

- Runtime: Node.js + TypeScript
- Framework: NestJS
- Database: PostgreSQL
- ORM: Prisma
- Auth: JWT access token, refresh token in HttpOnly cookie, `bcryptjs`
- Validation: `class-validator`, `class-transformer`, global `ValidationPipe`
- API docs: Swagger/OpenAPI at `/api/docs`
- Realtime: Socket.IO namespace `/consultations`
- Scheduling: `node-cron`
- Testing: Jest
- Local database: Docker Compose PostgreSQL

## Core Backend Capabilities

- Public doctor discovery with active/approved doctor filtering.
- Doctor professional profile with specialties, qualification summary, consultation description, experience and working schedule.
- Doctor availability API based on schedule, duration and active appointments.
- Booking/reschedule validation with doctor conflict and patient conflict prevention.
- Serializable appointment transaction protection for critical appointment writes.
- Patient and doctor consultation lifecycle with realtime chat.
- Consultation result and prescription persistence.
- Health question and answer workflow.
- Admin moderation for supported content.
- Notification outbox and provider abstraction with development provider.
- Refresh-token rotation backed by `UserSession`.
- Password recovery with hashed one-time reset token.
- Consistent error response through global exception filter.
- Audit logging for important actions.

## Prerequisites

- Node.js compatible with the project `.nvmrc`
- npm
- Docker and Docker Compose
- PostgreSQL container from `docker-compose.yml`

## Environment

Create `.env` from `.env.example`:

```bash
cp .env.example .env
```

Important local defaults:

```env
NODE_ENV=development
PORT=4000
DATABASE_URL=postgresql://healthuser:password@localhost:5432/health_consultation_db
CORS_ORIGIN=http://localhost:5173,http://localhost:3000
```

Production requirements are stricter. JWT secrets, CORS origins, refresh cookie settings and notification provider configuration are validated at startup.

## Setup And Run

```bash
cd /Users/ThanhNguyen/Projects/SV/WebProgramming/OnlineHealthConsultation/OnlineHealthConsultation-Service
source ~/.nvm/nvm.sh
npm install
docker compose up -d
npm run prisma:generate
npm run prisma:migrate:deploy
npm run prisma:seed
npm run dev
```

Local URLs:

- API base: `http://localhost:4000/api`
- Swagger/OpenAPI: `http://localhost:4000/api/docs`
- Socket.IO namespace: `http://localhost:4000/consultations`

## Demo Seed Data

Run:

```bash
npm run prisma:seed
```

The seed script clears existing data and recreates a domain-consistent demo dataset:

- Specialties: General Medicine, Cardiology, Pediatrics, Dermatology, Endocrinology, Obstetrics and Gynecology, Psychiatry, Nutrition.
- Users: admin, patients, approved doctors and one pending doctor.
- Patient health profiles.
- Doctor professional profiles with qualification summary, consultation description, experience, schedule and specialties.
- Appointments across pending, confirmed, completed, cancelled and no-show states.
- Completed consultation sessions with chat messages, summaries and prescriptions.
- Questions, answers, ratings and notification logs.

Demo accounts:

```text
Admin:   admin@healthcare.local / Admin@123
Patient: lan.nguyen@healthcare.local / Patient@123
Doctor:  bs.an.nguyen@healthcare.local / Doctor@123
```

## Scripts

```bash
npm run dev                    # NestJS watch mode
npm run start                  # Start NestJS once
npm run build                  # Build backend
npm run type-check             # TypeScript type check
npm run test                   # Jest tests
npm run prisma:generate        # Generate Prisma client
npm run prisma:migrate:deploy  # Apply migrations
npm run prisma:migrate         # Development migration
npm run prisma:seed            # Seed demo data
npm run db:seed:e2e            # Seed Playwright E2E data
npm run e2e:prepare            # Generate, migrate and seed E2E data
```

Use `prisma:seed` for demo/manual review data. Use `db:seed:e2e` only for automated E2E tests.

## API And Security Notes

- Global prefix: `/api`
- Swagger: `/api/docs`
- Access token is sent as `Authorization: Bearer <token>`.
- Refresh token is stored in an HttpOnly cookie.
- Backend enforces role and ownership checks; frontend guards are UX only.
- CORS is credentials-enabled and configured by `CORS_ORIGIN`.
- Global validation rejects unknown fields outside DTO contracts.

## Documentation

Current submission documentation lives under `docs/`:

- `docs/srs/OnlineHealthConsultationPlatform_SRS_v1.0.md`
- `docs/audit/final-srs-traceability.md`
- `docs/audit/security-hardening-report.md`
- `docs/deployment/production-readiness.md`
- `docs/testing/final-e2e-results.md`
- `docs/scope/file-attachment-scope-decision.md`

## Related Repo

Frontend application: `../OnlineHealthConsultation-Web`
