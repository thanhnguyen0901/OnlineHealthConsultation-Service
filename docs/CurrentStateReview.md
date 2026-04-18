# Current State Review (Latest Codebase)

Updated: 2026-04-18
Scope reviewed: `src/`, `docs/`, runtime config files.

## 1. Executive Summary

- Mức hoàn thiện hiện tại: khoảng 10-15% theo SRS.
- Trạng thái tổng quát:
  - Có framework NestJS modular monolith skeleton.
  - Chỉ module Identity có logic nghiệp vụ tối thiểu (register/login/me).
  - Các module cốt lõi khác mới là khung rỗng.
  - Thư mục `prisma/` đã được xóa để chuẩn bị thiết kế lại từ đầu.

## 2. Current vs Target by Module

| Module | Current status | Target status | Completion |
|---|---|---|---|
| App bootstrap | Có global prefix, swagger, validation pipe | Bổ sung config validation, exception filter, logging chuẩn | 35% |
| Identity | Register/Login/Me mức cơ bản | Full auth platform (logout/refresh/reset/RBAC/policy) | 30% |
| Doctor | Module rỗng | CRUD profile + schedule + approval visibility | 0% |
| Patient | Module rỗng | CRUD health profile + history projection | 0% |
| Specialty | Chưa có module riêng | Admin CRUD + doctor-specialty mapping | 0% |
| Discovery | Chưa có | Public browse/search/filter doctors | 0% |
| Question | Module rỗng | Full Q&A lifecycle + moderation | 0% |
| Appointment | Module rỗng | Booking + conflict prevention + transitions | 0% |
| Consultation | Module rỗng | Session, summary, prescription, fallback | 0% |
| Rating | Chưa có module | Rating workflow + moderation | 0% |
| Notification | Module rỗng | Outbox + delivery + log/retry | 0% |
| Reporting | Module rỗng | Admin KPI/report APIs | 0% |
| Persistence | Prisma service còn tham chiếu `@prisma/client`, nhưng schema/migrations đã xóa | Rebuild DB schema + migrations + repositories | 5% |

## 3. FR/NFR Traceability Status

| Requirement | Status | Evidence | Gap |
|---|---|---|---|
| FR-01 Public Access | MISSING | Chưa có public controllers | Chưa có discovery/public projection |
| FR-02 Auth/RBAC | PARTIAL | `auth/register`, `auth/login`, `auth/me` | Thiếu logout/refresh/reset/role+ownership guards |
| FR-03 Profiles | PARTIAL | Register có tạo profile logic giả định | Chưa có CRUD profile endpoints |
| FR-04 Specialty | MISSING | Không có module/controller | Chưa có data model + APIs |
| FR-05 Discovery | MISSING | Không có endpoint public doctor | Chưa có search/filter |
| FR-06 Q&A | MISSING | Module rỗng | Chưa có lifecycle |
| FR-07 Appointment | MISSING | Module rỗng | Chưa có booking/conflict |
| FR-08 Consultation | MISSING | Module rỗng | Chưa có session/chat/video fallback |
| FR-09 Outcome/Prescription | MISSING | Module rỗng | Chưa có summary/prescription |
| FR-10 Rating | MISSING | Chưa có module | Chưa có rule completed-only |
| FR-11 Notification | MISSING | Module rỗng | Chưa có provider/log/retry |
| FR-12 Administration | MISSING | Chưa có admin endpoints | Chưa có moderation/audit |
| FR-13 Reporting | MISSING | Module rỗng | Chưa có KPI API |
| NFR Security | PARTIAL | JWT + bcrypt + validation pipe | Thiếu policy/audit/rate-limit/config validation |
| NFR Reliability | MISSING | Chưa có transactional flows | Chưa có idempotency/consistency guards |
| NFR Maintainability | PARTIAL | Có module skeleton | Thiếu API contracts, tests, CI gates |

## 4. Technical Findings

## 4.1 Code-level findings

- `package.json` chứa nhiều script không còn hợp lệ với trạng thái mới:
  - `dev` trỏ `src/server.ts` không tồn tại.
  - Nhóm script `prisma:*` và `db:*` đang tham chiếu thư mục/file đã xóa.
- `src/prisma/prisma.service.ts` vẫn phụ thuộc `@prisma/client` trong khi schema/migration chưa tái tạo.
- `register.dto.ts` dùng enum `Role` từ Prisma client cũ, sẽ fail khi chưa regenerate schema mới.

## 4.2 Architecture findings

- Hiện tại chưa có layer phân tách `presentation/application/domain/infrastructure` ở từng module.
- Chưa có policy-based authorization.
- Chưa có audit logging cho hành động nhạy cảm.

## 4.3 Verification constraints

- Môi trường terminal hiện tại không có `npm` command, chưa thể chạy build/test runtime trong phiên này.
- Vì `prisma/` đã xóa, build backend hiện chắc chắn chưa ổn định cho tới khi thiết kế DB mới và regenerate client.

## 5. Immediate Blockers

- B1: Chưa có schema/migration DB mới theo SRS.
- B2: Scripts package chưa đồng bộ với trạng thái code mới.
- B3: Thiếu API contract và auth policy matrix để triển khai nhất quán.

## 6. Conclusion

Codebase hiện là baseline phù hợp để rebuild đúng kiến trúc mới, nhưng chưa sẵn sàng vận hành MVP. Cần hoàn thành doc-first design (architecture + DB + API + auth matrix + test traceability), sau đó mới vào triển khai phase nền tảng và domain theo checklist.
