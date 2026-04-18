# Deployment and Operations Guide

Updated: 2026-04-18

## 1. Environment Targets

- `development`
- `staging`
- `production`

## 2. Required Environment Variables

- `NODE_ENV`
- `PORT`
- `DATABASE_URL` (PostgreSQL)
- `JWT_SECRET`
- `JWT_REFRESH_SECRET`
- `JWT_ACCESS_EXPIRE`
- `JWT_REFRESH_EXPIRE`
- `CORS_ORIGIN`
- `BCRYPT_ROUNDS`

## 3. Deployment Baseline

- Backend service: NestJS stateless app.
- Database: PostgreSQL managed/self-hosted.
- Migrations run before app rollout.

## 4. Operational Runbook

- Start services.
- Apply migrations.
- Seed (only in non-production or controlled scenarios).
- Smoke test key endpoints.

## 5. Monitoring and Logging

- Structured logs (JSON preferred in production).
- Error alerts for 5xx spikes.
- DB connection and latency monitoring.

## 6. Backup and Recovery

- Daily DB backups.
- Point-in-time recovery strategy.
- Restore drill checklist quarterly.

## 7. Rollback Strategy

- App rollback: deploy previous stable image.
- DB rollback: controlled backward migration if safe, else restore snapshot.

## 8. Release Checklist

- [ ] Migration validated on staging
- [ ] Core e2e flows pass
- [ ] Security checks pass
- [ ] Rollback plan confirmed
