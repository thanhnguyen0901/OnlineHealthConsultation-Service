# Privacy and Data Handling Guide

Updated: 2026-04-18
Scope: backend service privacy controls for MVP.

## 1. Privacy Principles

- Data minimization: chỉ thu thập/trả về dữ liệu cần thiết cho use-case.
- Least privilege: dữ liệu sức khỏe chỉ hiển thị cho chủ thể, bác sĩ phụ trách, admin theo policy.
- Need-to-log: không log raw dữ liệu nhạy cảm nếu không cần thiết cho vận hành.

## 2. Sensitive Data Categories

- PII: email, phone, address, IP, user-agent.
- Health data: medical history, consultation summary, prescription content.
- Credentials/secrets: password hash, reset token, refresh token.

## 3. Implemented Controls

- Audit metadata sanitization at persistence layer:
  - Prisma middleware masks/redacts sensitive keys before writing `audit_logs`.
- Logging minimization:
  - request logs use route path only (`req.path`), avoiding query leakage.
- Error response hardening:
  - production/server errors return generic message; no internal detail spill.
- Password reset privacy:
  - forgot-password response is generic and does not expose reset token in API response.
- JWT context minimization:
  - request user context excludes unnecessary email claim.

## 4. API Data Visibility Policy

- Patient profile data: only patient owner and admin policy endpoints.
- Doctor profile private fields: doctor owner and admin policy endpoints.
- Consultation outcomes/prescriptions: patient owner, assigned doctor, admin authorized role.
- Ratings: patient owner + admin moderation endpoints.

## 5. Retention and Deletion Policy (MVP Baseline)

- Audit logs:
  - retained for operational/security traceability; redacted fields remain redacted.
- Consultation and prescription records:
  - retained for medical traceability within project policy.
- User soft-delete:
  - deactivation sets inactive/deletedAt and revokes active sessions.

## 6. Operational Privacy Checklist

- [x] No password/token in API responses.
- [x] Sensitive audit metadata masked or redacted.
- [x] Request logs avoid query-string PII leakage.
- [x] Role/ownership checks enforced on protected resources.
- [ ] Add automated privacy regression tests (future hardening).
