# Backend & Database Audit — Executive Summary

**Project:** Online Health Consultation System  
**Audit Date:** 2026-03-02  
**Full Report:** `docs/audit/backend-model-db-audit-report.md`

---

## Stack
Node.js + Express + TypeScript · **Prisma ORM v5.7** · MySQL 8 · `prisma db push` (no migrations)

## Schema Overview
10 Prisma models → 10 MySQL tables:
`users`, `patient_profiles`, `doctor_profiles`, `specialties`, `questions`, `answers`, `appointments`, `ratings`, `refresh_tokens` (legacy), `user_sessions`

---

## Top Findings

| ID | Severity | Summary |
|---|---|---|
| F-001 | 🔴 CRITICAL | `user.fullName` accessed in doctor & patient services but field does not exist in Prisma schema — runtime error / undefined returned |
| F-002 | 🔴 CRITICAL | `refresh_tokens` table stores raw JWT tokens; model is fully unused in app code — dangling security risk |
| F-003 | 🟠 HIGH | No migration history (`db push` only) — no rollback, no audit trail, destructive in production |
| F-004 | 🟠 HIGH | `DoctorProfile.ratingAverage` / `ratingCount` are manually updated with no transactional guarantee — data drift risk |
| F-005 | 🟠 HIGH | No DB-level `CHECK (score BETWEEN 1 AND 5)` on `ratings.score` |
| F-006 | 🟡 MEDIUM | Legacy `Specialty.name` column maintained alongside `nameEn` / `nameVi` |
| F-007 | 🟡 MEDIUM | Doctor schedule stored as untyped raw JSON in TEXT column |
| F-008 | 🟡 MEDIUM | Expired `user_sessions` never cleaned up — unbounded table growth |
| F-009 | 🟡 MEDIUM | Soft-delete (`isActive=false`) has no `deletedAt` timestamp |

## Immediate Actions Required
1. Fix `fullName` references — either add Prisma `$extends` computed field or replace with `firstName + lastName`
2. Remove `RefreshToken` model from schema and drop `refresh_tokens` table
3. Switch to `prisma migrate` workflow before any production deployment

## Security Posture
✅ Passwords hashed (bcrypt), JWT dual-secret, refresh tokens stored hashed (SHA-256), Helmet + rate limiter applied  
⚠️ `COOKIE_SECURE` defaults to `false` — must set `true` in production environment
