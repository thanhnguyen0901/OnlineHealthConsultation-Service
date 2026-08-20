# Production Readiness Review

Ngày review: 2026-08-20

## 1. Phạm vi

Review này kiểm tra deployment configuration readiness mà không redesign hệ thống. Trọng tâm là auth secrets, refresh cookie, CORS, env validation, database/frontend/API/WebSocket configuration, HTTPS assumptions và notification provider.

## 2. Kết luận tổng quan

Hệ thống đã có nền tảng production-ready ở mức cấu hình:

- JWT secrets không còn hard-coded unsafe fallback ở runtime.
- Refresh token dùng HttpOnly cookie, có Secure mặc định theo production.
- CORS cho HTTP và Socket.IO đọc từ `CORS_ORIGIN`.
- Production env validation đã chặn JWT secret yếu, thiếu CORS, notification provider `development`, refresh cookie không secure và reset-password URL localhost.
- `.env.example` đã có các key cấu hình chính cho backend và frontend.

Các phần vẫn phụ thuộc môi trường triển khai:

- HTTPS/TLS do hosting/reverse proxy cung cấp.
- Production email delivery phụ thuộc provider/secrets thật.
- Frontend cần set `VITE_API_BASE_URL` trỏ về backend HTTPS production URL.

## 3. Backend Configuration Review

### JWT secrets

Evidence:

- `src/modules/identity/identity.module.ts`
- `src/modules/identity/strategies/jwt.strategy.ts`
- `src/modules/identity/auth.service.ts`
- `src/modules/consultation/consultation.gateway.ts`
- `src/common/config/env.util.ts`
- `src/common/config/validate-env.ts`

Runtime dùng `getRequiredEnv('JWT_SECRET')` và `getRequiredEnv('JWT_REFRESH_SECRET')`, không fallback sang dev secret.

Production validation:

- `JWT_SECRET` tối thiểu 32 ký tự trong production.
- `JWT_REFRESH_SECRET` tối thiểu 32 ký tự trong production.
- Reject các secret mẫu như `super-secret-key-for-dev`, `refresh-secret-dev`, `change-me`, `changeme`.

Decision: `READY`, với điều kiện production env set secret thật qua secret manager/hosting env.

### Refresh cookie

Evidence:

- `AuthController.setRefreshCookie()`
- `AuthController.refreshCookieOptions()`
- `AuthController.clearRefreshCookie()`

Cookie properties:

- `HttpOnly`: enabled.
- `Secure`: mặc định `true` khi `NODE_ENV=production`.
- `SameSite`: configurable qua `AUTH_REFRESH_COOKIE_SAME_SITE` với `lax`, `strict`, `none`.
- Nếu `SameSite=None`, cookie luôn forced `secure: true`.
- Production validation reject `AUTH_REFRESH_COOKIE_SECURE=false`.
- Cookie path configurable qua `AUTH_REFRESH_COOKIE_PATH`, default `/api/auth`.

Decision: `READY`, với điều kiện production chạy qua HTTPS.

### CORS allowed origins

Evidence:

- `main.ts`
- `consultation.gateway.ts`
- `parseCsvEnv()`

HTTP CORS:

- `CORS_ORIGIN` là comma-separated env.
- `credentials: true`.
- Production validation yêu cầu `CORS_ORIGIN`.
- Nếu production thiếu `CORS_ORIGIN`, app fail fast.

Socket.IO CORS:

- Gateway namespace `/consultations` dùng cùng `CORS_ORIGIN`.
- Credentials enabled.

Decision: `READY`.

### Database URL

Evidence:

- `validate-env.ts`
- Prisma schema/env loading.

`DATABASE_URL` là required env. `.env.example` cung cấp format PostgreSQL mẫu.

Decision: `READY`, với điều kiện production dùng managed PostgreSQL URL qua environment secret/config.

### Production environment validation

Evidence:

- `validateEnv(process.env)` được gọi ở `main.ts` trước app startup.
- `validate-env.ts` dùng `zod` và `superRefine()` cho production-only checks.

Production checks hiện có:

- Strong JWT secrets.
- Required `CORS_ORIGIN`.
- Secure refresh cookie constraints.
- `PASSWORD_RESET_FRONTEND_URL` không được trỏ `localhost`.
- `NOTIFICATION_PROVIDER` không được là `development`.

Decision: `READY`.

## 4. Frontend Configuration Review

### API base URL

Evidence:

- `OnlineHealthConsultation-Web/src/config/api.config.ts`
- `OnlineHealthConsultation-Web/.env.example`

Frontend đọc:

- `VITE_API_BASE_URL`

Fallback development:

- `http://localhost:4000`

Production requirement:

- Set `VITE_API_BASE_URL` to the deployed backend HTTPS origin, for example `https://api.example.com`.

Decision: `READY`, with env configuration.

### WebSocket base URL / origin

Evidence:

- `useConsultationSocket.ts`
- `consultationSocketClient.ts`
- Backend `ConsultationGateway`

Frontend realtime consultation socket:

- Uses `API_CONFIG.BASE_URL`.
- Appends namespace `/consultations`.
- Sends access token via `auth.token`.

Backend origin control:

- Uses `CORS_ORIGIN` for Socket.IO gateway.

Production requirement:

- `VITE_API_BASE_URL` and backend `CORS_ORIGIN` must use HTTPS deployment origins.
- Hosting/reverse proxy must support WebSocket upgrade for `/consultations`.

Decision: `READY`, with hosting WebSocket support.

## 5. HTTPS Deployment Assumptions

The application does not terminate TLS itself. Production HTTPS is expected from the deployment platform, load balancer, reverse proxy, or CDN.

Required assumptions:

- Frontend served over HTTPS.
- Backend API served over HTTPS.
- Socket.IO WebSocket upgrade allowed over HTTPS/WSS.
- Refresh cookie Secure behavior depends on HTTPS.
- If frontend and backend are cross-site, set:
  - `AUTH_REFRESH_COOKIE_SAME_SITE=none`
  - leave `AUTH_REFRESH_COOKIE_SECURE` unset or set `true`
  - exact frontend origin in `CORS_ORIGIN`

Decision: `CONDITIONALLY_READY`, dependent on hosting setup.

## 6. Notification / Email Provider Review

Evidence:

- `NotificationProvider` interface.
- `DevelopmentNotificationProvider`.
- `EmailNotificationProvider`.
- `SmsNotificationProvider`.
- `NotificationService.resolveProvider()`.
- `NotificationLog` / `OutboxEvent` flow.

Classification:

- Provider abstraction: `IMPLEMENTED`
- Development/dry-run verification: `IMPLEMENTED`
- Production delivery: `ENVIRONMENT_PROVIDER_DEPENDENT`

The project includes an email provider abstraction but not a real external SDK integration such as SMTP, SendGrid, Mailgun, SES, or similar. `EmailNotificationProvider` currently behaves as a provider abstraction/dry-run acceptance layer when `NOTIFICATION_EMAIL_PROVIDER_ENABLED=true`.

Submission decision:

- Do not invent or commit a fake production email provider.
- Production deployment must configure/replace `EmailNotificationProvider` behind the existing `NotificationProvider` interface if real email delivery evidence is required.
- No production email/SMS secrets are committed.

Decision: `PARTIAL_FOR_PRODUCTION_DELIVERY`, acceptable for development verification.

## 7. No Committed Production Secrets

Checked tracked env files:

- Backend tracks `.env.example` only.
- Frontend tracks `.env` and `.env.example`.

Findings:

- No production secret values were found in tracked example/config files.
- Backend `.env` is ignored and not tracked.
- Frontend `.env` contains only `VITE_API_BASE_URL`, which is a public client-side configuration value, not a secret.

Recommendation:

- Continue keeping all JWT, database, email and SMS provider secrets outside git.
- Prefer deployment platform env vars or secret manager for production.

Decision: `READY`.

## 8. `.env.example` Coverage

Backend `.env.example` includes:

- `NODE_ENV`
- `PORT`
- `DATABASE_URL`
- `JWT_SECRET`
- `JWT_REFRESH_SECRET`
- `JWT_ACCESS_EXPIRE`
- `JWT_REFRESH_EXPIRE`
- `CORS_ORIGIN`
- refresh cookie settings
- `BCRYPT_ROUNDS`
- timezone and appointment slot settings
- password reset settings
- consultation join window settings
- video provider flag
- notification cron/batch/window settings
- notification provider settings
- email/SMS provider toggles

Frontend `.env.example` includes:

- `VITE_API_BASE_URL`
- note that realtime Socket.IO uses the same base URL and `/consultations` namespace.

Decision: `READY`.

## 9. Changes Made In This Review

- Added production validation rejecting `AUTH_REFRESH_COOKIE_SECURE=false`.
- Added production validation rejecting `PASSWORD_RESET_FRONTEND_URL` pointing to localhost.
- Expanded backend `.env.example` with consultation/video/notification scheduler keys.
- Cleaned frontend `.env.example` so only one active `VITE_API_BASE_URL` is present.
- Documented production readiness in this file.

## 10. Final Readiness Conclusion

Deployment configuration is ready for a controlled production deployment if the hosting environment supplies:

- Strong JWT secrets.
- Production PostgreSQL `DATABASE_URL`.
- Exact HTTPS frontend origin in `CORS_ORIGIN`.
- HTTPS backend URL in frontend `VITE_API_BASE_URL`.
- HTTPS/WSS-capable hosting or reverse proxy.
- Non-development notification provider configuration, or explicit acceptance that production email delivery is provider-dependent.

The system should not claim real production email delivery unless a concrete external email provider is configured and verified.
