# Backend & Database Audit Report

**Project:** Online Health Consultation System  
**Backend:** Node.js + Express + TypeScript + Prisma ORM + MySQL  
**Audit Date:** 2026-03-02  
**Auditor:** GitHub Copilot (automated static analysis)  
**Scope:** `/OnlineHealthConsultation-Service/`

---

## 0. Repository Scan Summary

### 0.1 Data Access Style

**ORM:** Prisma ORM v5.7.0 (single data-access layer — no raw SQL queries detected in application code)

**Evidence:**

| Evidence Type | Location |
|---|---|
| `"@prisma/client": "^5.7.0"` dependency | `package.json` |
| `"prisma": "^5.7.0"` dev dependency | `package.json` |
| Schema definition | `prisma/schema.prisma` |
| `import prisma from '../config/db'` | All `src/services/*.ts` files |
| `PrismaClient` singleton | `src/config/db.ts` |
| Seed file using Prisma fluent API | `prisma/seed.ts` |

**No Sequelize, TypeORM, Knex, or raw SQL** (`db.query`/`db.execute`) found anywhere in `src/`.

### 0.2 Schema Management Strategy

- Uses **`prisma db push`** (schema-push, no migration history)
- No `prisma/migrations/` directory exists
- `init.sql` only sets DB charset and grants — **does NOT define tables**
- Tables are fully controlled by Prisma schema and re-created on `db:reset`

### 0.3 Files Reviewed

| File | Purpose |
|---|---|
| `prisma/schema.prisma` | Authoritative DB schema (models + relations + indexes) |
| `prisma/init.sql` | MySQL container init — charset + grants only |
| `prisma/seed.ts` | Seed data (583 lines) |
| `prisma/tsconfig.json` | TypeScript config for seed |
| `src/config/db.ts` | PrismaClient singleton |
| `src/config/env.ts` | Env validation via Zod |
| `src/services/auth.service.ts` | Auth flows (register, login, refresh, logout) |
| `src/services/admin.service.ts` | Admin CRUD (971 lines) |
| `src/services/doctor.service.ts` | Doctor operations (392 lines) |
| `src/services/patient.service.ts` | Patient operations (504 lines) |
| `src/services/report.service.ts` | Statistics & charts (340 lines) |
| `src/utils/jwt.ts` | JWT sign/verify helpers |
| `src/middlewares/auth.middleware.ts` | Bearer token validation |
| `src/middlewares/role.middleware.ts` | Role-based access control |
| `src/routes/admin.routes.ts` | Admin route definitions |
| `package.json` | Dependencies & scripts |

---

## 1. Models Found

All models are defined in `prisma/schema.prisma`.

### 1.1 Model: `User` → table `users`

**File:** `prisma/schema.prisma` (line ~43)

| Field | Prisma Type | DB Type | Notes |
|---|---|---|---|
| `id` | `String` | `VARCHAR(25)` CUID | **Primary Key** |
| `email` | `String` | `VARCHAR(191)` | UNIQUE |
| `passwordHash` | `String` | `VARCHAR(191)` | bcrypt hash |
| `firstName` | `String` | `VARCHAR(191)` | |
| `lastName` | `String` | `VARCHAR(191)` | |
| `role` | `Role` enum | `ENUM('PATIENT','DOCTOR','ADMIN')` | |
| `isActive` | `Boolean` | `TINYINT(1)` | default `true` |
| `createdAt` | `DateTime` | `DATETIME(3)` | auto |
| `updatedAt` | `DateTime` | `DATETIME(3)` | auto |

**Indexes:** `email`, `role`  
**Relations:** `patientProfile` (1:1), `doctorProfile` (1:1), `refreshTokens` (1:N), `sessions` (1:N)  
**Used in:** all services, `auth.middleware.ts`

> ⚠️ **NOTE:** Application code in `doctor.service.ts` and `patient.service.ts` references `user.fullName`
> (e.g., `select: { fullName: true }`). `fullName` is **NOT** a field in this model — only `firstName`
> and `lastName` exist. No Prisma extension/middleware was found that computes `fullName`.
> This will return `undefined` at runtime and could cause TypeScript compile errors if strict mode is
> enforced properly. **See Finding F-001.**

---

### 1.2 Model: `PatientProfile` → table `patient_profiles`

**File:** `prisma/schema.prisma`

| Field | Prisma Type | DB Type | Notes |
|---|---|---|---|
| `id` | `String` | `VARCHAR(25)` CUID | **Primary Key** |
| `userId` | `String` | `VARCHAR(25)` | UNIQUE FK → `users.id` |
| `dateOfBirth` | `DateTime?` | `DATETIME(3)` | nullable |
| `gender` | `Gender?` enum | `ENUM('MALE','FEMALE','OTHER')` | nullable |
| `phone` | `String?` | `VARCHAR(191)` | nullable |
| `address` | `String?` | `VARCHAR(191)` | nullable |
| `medicalHistory` | `String?` | `TEXT` | nullable |
| `createdAt` | `DateTime` | `DATETIME(3)` | auto |
| `updatedAt` | `DateTime` | `DATETIME(3)` | auto |

**Indexes:** `userId`  
**Foreign Keys:** `userId` → `users.id` ON DELETE CASCADE  
**Relations:** `questions` (1:N), `appointments` (1:N), `ratings` (1:N)  
**Used in:** `patient.service.ts`, `admin.service.ts`

---

### 1.3 Model: `DoctorProfile` → table `doctor_profiles`

**File:** `prisma/schema.prisma`

| Field | Prisma Type | DB Type | Notes |
|---|---|---|---|
| `id` | `String` | `VARCHAR(25)` CUID | **Primary Key** |
| `userId` | `String` | `VARCHAR(25)` | UNIQUE FK → `users.id` |
| `specialtyId` | `String` | `VARCHAR(25)` | FK → `specialties.id` |
| `bio` | `String?` | `TEXT` | nullable |
| `yearsOfExperience` | `Int` | `INT` | default 0 |
| `ratingAverage` | `Float` | `DOUBLE` | default 0, **denormalized** |
| `ratingCount` | `Int` | `INT` | default 0, **denormalized** |
| `schedule` | `String?` | `TEXT` | JSON string, nullable |
| `createdAt` | `DateTime` | `DATETIME(3)` | auto |
| `updatedAt` | `DateTime` | `DATETIME(3)` | auto |

**Indexes:** `userId`, `specialtyId`  
**Foreign Keys:** `userId` → `users.id` ON DELETE CASCADE; `specialtyId` → `specialties.id`  
**Relations:** `questions` (1:N), `answers` (1:N), `appointments` (1:N), `ratings` (1:N)  
**Used in:** `doctor.service.ts`, `admin.service.ts`, `patient.service.ts`

> ⚠️ `ratingAverage` and `ratingCount` are **manually maintained** — updated in seed and after rating
> creation/moderation. No DB trigger or automatic recalculation. Risk of data drift. **See Finding F-004.**

---

### 1.4 Model: `Specialty` → table `specialties`

**File:** `prisma/schema.prisma`

| Field | Prisma Type | DB Type | Notes |
|---|---|---|---|
| `id` | `String` | `VARCHAR(25)` CUID | **Primary Key** |
| `name` | `String` | `VARCHAR(191)` | UNIQUE, "kept for backward compatibility" |
| `nameEn` | `String` | `VARCHAR(191)` | English name |
| `nameVi` | `String` | `VARCHAR(191)` | Vietnamese name |
| `description` | `String?` | `TEXT` | nullable |
| `isActive` | `Boolean` | `TINYINT(1)` | default `true` |
| `createdAt` | `DateTime` | `DATETIME(3)` | auto |
| `updatedAt` | `DateTime` | `DATETIME(3)` | auto |

**Relations:** `doctors` (1:N → `DoctorProfile`)  
**Used in:** `admin.service.ts`, `doctor.service.ts`, `patient.service.ts`, `report.service.ts`

> ℹ️ `name` field comment says "Kept for backward compatibility". With both `name`, `nameEn`, `nameVi`,
> there is data duplication. **See Finding F-006.**

---

### 1.5 Model: `Question` → table `questions`

**File:** `prisma/schema.prisma`

| Field | Prisma Type | DB Type | Notes |
|---|---|---|---|
| `id` | `String` | `VARCHAR(25)` CUID | **Primary Key** |
| `patientId` | `String` | `VARCHAR(25)` | FK → `patient_profiles.id` |
| `doctorId` | `String?` | `VARCHAR(25)` | nullable FK → `doctor_profiles.id` |
| `title` | `String` | `VARCHAR(191)` | |
| `content` | `String` | `TEXT` | |
| `status` | `QuestionStatus` enum | `ENUM('PENDING','ANSWERED','MODERATED')` | default `PENDING` |
| `createdAt` | `DateTime` | `DATETIME(3)` | auto |
| `updatedAt` | `DateTime` | `DATETIME(3)` | auto |

**Indexes:** `patientId`, `doctorId`, `status`  
**Foreign Keys:** `patientId` → `patient_profiles.id` ON DELETE CASCADE; `doctorId` → `doctor_profiles.id`  
**Relations:** `answers` (1:N)  
**Used in:** `patient.service.ts`, `doctor.service.ts`, `admin.service.ts`, `report.service.ts`

---

### 1.6 Model: `Answer` → table `answers`

**File:** `prisma/schema.prisma`

| Field | Prisma Type | DB Type | Notes |
|---|---|---|---|
| `id` | `String` | `VARCHAR(25)` CUID | **Primary Key** |
| `questionId` | `String` | `VARCHAR(25)` | FK → `questions.id` |
| `doctorId` | `String` | `VARCHAR(25)` | FK → `doctor_profiles.id` |
| `content` | `String` | `TEXT` | |
| `isApproved` | `Boolean` | `TINYINT(1)` | default `false` |
| `createdAt` | `DateTime` | `DATETIME(3)` | auto |
| `updatedAt` | `DateTime` | `DATETIME(3)` | auto |

**Indexes:** `questionId`, `doctorId`  
**Foreign Keys:** `questionId` → `questions.id` ON DELETE CASCADE; `doctorId` → `doctor_profiles.id`  
**Used in:** `doctor.service.ts`, `admin.service.ts`

---

### 1.7 Model: `Appointment` → table `appointments`

**File:** `prisma/schema.prisma`

| Field | Prisma Type | DB Type | Notes |
|---|---|---|---|
| `id` | `String` | `VARCHAR(25)` CUID | **Primary Key** |
| `patientId` | `String` | `VARCHAR(25)` | FK → `patient_profiles.id` |
| `doctorId` | `String` | `VARCHAR(25)` | FK → `doctor_profiles.id` |
| `scheduledAt` | `DateTime` | `DATETIME(3)` | |
| `status` | `AppointmentStatus` enum | `ENUM('PENDING','CONFIRMED','CANCELLED','COMPLETED')` | default `PENDING` |
| `reason` | `String` | `TEXT` | |
| `notes` | `String?` | `TEXT` | nullable |
| `createdAt` | `DateTime` | `DATETIME(3)` | auto |
| `updatedAt` | `DateTime` | `DATETIME(3)` | auto |

**Indexes:** `patientId`, `doctorId`, `status`, `scheduledAt`  
**Foreign Keys:** `patientId` → `patient_profiles.id` ON DELETE CASCADE; `doctorId` → `doctor_profiles.id`  
**Relations:** `ratings` (1:N)  
**Used in:** `patient.service.ts`, `doctor.service.ts`, `admin.service.ts`, `report.service.ts`

> ✅ Appointment conflict detection is implemented in `patient.service.ts` (same doctor, same datetime).

---

### 1.8 Model: `Rating` → table `ratings`

**File:** `prisma/schema.prisma`

| Field | Prisma Type | DB Type | Notes |
|---|---|---|---|
| `id` | `String` | `VARCHAR(25)` CUID | **Primary Key** |
| `patientId` | `String` | `VARCHAR(25)` | FK → `patient_profiles.id` |
| `doctorId` | `String` | `VARCHAR(25)` | FK → `doctor_profiles.id` |
| `appointmentId` | `String` | `VARCHAR(25)` | FK → `appointments.id` |
| `score` | `Int` | `INT` | 1–5 (comment only, no DB CHECK constraint) |
| `comment` | `String?` | `TEXT` | nullable |
| `status` | `RatingStatus` enum | `ENUM('VISIBLE','HIDDEN')` | default `VISIBLE` |
| `createdAt` | `DateTime` | `DATETIME(3)` | auto |
| `updatedAt` | `DateTime` | `DATETIME(3)` | auto |

**Unique Constraint:** `(appointmentId, patientId)` — prevents duplicate ratings per appointment  
**Indexes:** `patientId`, `doctorId`, `status`  
**Foreign Keys:** `patientId` → `patient_profiles.id` ON DELETE CASCADE; `doctorId` → `doctor_profiles.id`; `appointmentId` → `appointments.id` ON DELETE CASCADE  
**Used in:** `patient.service.ts`, `admin.service.ts`

> ⚠️ No DB-level CHECK constraint enforcing `score BETWEEN 1 AND 5`. **See Finding F-005.**

---

### 1.9 Model: `RefreshToken` → table `refresh_tokens`

**File:** `prisma/schema.prisma`

| Field | Prisma Type | DB Type | Notes |
|---|---|---|---|
| `id` | `String` | `VARCHAR(25)` CUID | **Primary Key** |
| `userId` | `String` | `VARCHAR(25)` | FK → `users.id` |
| `token` | `String` | `TEXT` | **Raw JWT token stored** ⚠️ |
| `expiresAt` | `DateTime` | `DATETIME(3)` | |
| `revoked` | `Boolean` | `TINYINT(1)` | default `false` |
| `createdAt` | `DateTime` | `DATETIME(3)` | auto |
| `updatedAt` | `DateTime` | `DATETIME(3)` | auto |

**Unique Constraint:** `token(length: 255)`  
**Indexes:** `userId`  
**Foreign Keys:** `userId` → `users.id` ON DELETE CASCADE  

> 🔴 **CRITICAL SECURITY:** This model stores the **raw JWT refresh token** in the database as TEXT.
> If the database is compromised, all refresh tokens are immediately usable by attackers.
> The `UserSession` model was added as a more secure alternative (stores SHA-256 hash), but the
> `RefreshToken` model still exists in the schema and the table exists in the DB.
> Crucially: **the `refresh_tokens` table appears to be unused in application code** — the auth
> service exclusively uses `UserSession`. **See Finding F-002.**

---

### 1.10 Model: `UserSession` → table `user_sessions`

**File:** `prisma/schema.prisma`

| Field | Prisma Type | DB Type | Notes |
|---|---|---|---|
| `id` | `String` | `VARCHAR(25)` CUID | **Primary Key** |
| `userId` | `String` | `VARCHAR(25)` | FK → `users.id` |
| `refreshTokenHash` | `String` | `VARCHAR(191)` | UNIQUE, SHA-256 hash |
| `expiresAt` | `DateTime` | `DATETIME(3)` | |
| `revokedAt` | `DateTime?` | `DATETIME(3)` | nullable |
| `lastUsedAt` | `DateTime` | `DATETIME(3)` | default now |
| `createdAt` | `DateTime` | `DATETIME(3)` | auto |
| `userAgent` | `String?` | `TEXT` | nullable |
| `ipAddress` | `String?` | `VARCHAR(191)` | nullable |

**Indexes:** `userId`, `refreshTokenHash`, `expiresAt`  
**Foreign Keys:** `userId` → `users.id` ON DELETE CASCADE  
**Used in:** `auth.service.ts`

✅ This is the active, secure session management model.

---

### 1.11 DTOs / Input Types

No separate DTO files exist. Input types are defined as TypeScript interfaces within service files and Zod validation schemas within controller files.

| Interface | Defined In |
|---|---|
| `RegisterInput`, `LoginInput` | `auth.service.ts` |
| `CreateUserInput`, `UpdateUserInput`, `CreateSpecialtyInput`, `UpdateSpecialtyInput` | `admin.service.ts` |
| `CreateAnswerInput`, `UpdateAppointmentInput`, `UpdateScheduleInput` | `doctor.service.ts` |
| `UpdatePatientProfileInput`, `CreateQuestionInput`, `CreateAppointmentInput`, `CreateRatingInput` | `patient.service.ts` |

---

## 2. Tables Found

**Source:** `prisma/schema.prisma` (authoritative — `prisma db push` syncs to MySQL)

The `init.sql` file does **not** contain any `CREATE TABLE` statements; it only configures character sets and grants.

| Table Name | Prisma Model | Rows in Seed |
|---|---|---|
| `users` | `User` | 8 (1 admin, 4 doctors, 3 patients) |
| `patient_profiles` | `PatientProfile` | 3 |
| `doctor_profiles` | `DoctorProfile` | 4 |
| `specialties` | `Specialty` | 5 |
| `questions` | `Question` | 6 |
| `answers` | `Answer` | 5 |
| `appointments` | `Appointment` | 7 |
| `ratings` | `Rating` | 3 |
| `refresh_tokens` | `RefreshToken` | 0 (unused) |
| `user_sessions` | `UserSession` | created at login |

**Total tables defined:** 10

### 2.1 Enums (MySQL ENUM columns)

| Enum Name | Values |
|---|---|
| `Role` | `PATIENT`, `DOCTOR`, `ADMIN` |
| `Gender` | `MALE`, `FEMALE`, `OTHER` |
| `QuestionStatus` | `PENDING`, `ANSWERED`, `MODERATED` |
| `AppointmentStatus` | `PENDING`, `CONFIRMED`, `CANCELLED`, `COMPLETED` |
| `RatingStatus` | `VISIBLE`, `HIDDEN` |

### 2.2 Indexes Summary

| Table | Indexed Columns |
|---|---|
| `users` | `email`, `role` |
| `patient_profiles` | `userId` |
| `doctor_profiles` | `userId`, `specialtyId` |
| `questions` | `patientId`, `doctorId`, `status` |
| `answers` | `questionId`, `doctorId` |
| `appointments` | `patientId`, `doctorId`, `status`, `scheduledAt` |
| `ratings` | `patientId`, `doctorId`, `status` |
| `refresh_tokens` | `userId` |
| `user_sessions` | `userId`, `refreshTokenHash`, `expiresAt` |

---

## 3. Model-DB Mismatch Report

Since the project uses **`prisma db push`** as the sole schema management mechanism, the Prisma schema and the database are always in sync after a push. There are **no independent SQL migrations to compare against**.

The comparison is therefore between:
- The **Prisma schema** (intended model)
- The **application code** (actual runtime usage)

### 3.1 Findings Table

| ID | Severity | Model / Table | Issue |
|---|---|---|---|
| F-001 | 🔴 CRITICAL | `User` / `users` | `user.fullName` referenced in code but field does not exist in schema |
| F-002 | 🔴 CRITICAL | `RefreshToken` / `refresh_tokens` | Table stores raw JWT; model is unused in app code but still exists |
| F-003 | 🟠 HIGH | All / All | No migration history (using `db push`); no rollback capability |
| F-004 | 🟠 HIGH | `DoctorProfile` / `doctor_profiles` | `ratingAverage` & `ratingCount` are denormalized with no DB trigger |
| F-005 | 🟠 HIGH | `Rating` / `ratings` | `score` column has no CHECK constraint (`1 <= score <= 5`) |
| F-006 | 🟡 MEDIUM | `Specialty` / `specialties` | `name` field acknowledged as legacy but not removed |
| F-007 | 🟡 MEDIUM | `DoctorProfile` / `doctor_profiles` | `schedule` stored as raw JSON TEXT; no schema validation or JSON type |
| F-008 | 🟡 MEDIUM | `UserSession` / `user_sessions` | No expiry cleanup mechanism; expired sessions accumulate indefinitely |
| F-009 | 🟡 MEDIUM | `User` / `users` | `isActive` soft-delete pattern but no `deletedAt` timestamp |
| F-010 | 🟡 MEDIUM | `appointments` | Conflict check only on exact datetime match; no time-window conflict detection |
| F-011 | 🔵 LOW | `Specialty` / `specialties` | `nameEn` / `nameVi` not indexed; string search across them will be slow |
| F-012 | 🔵 LOW | `users` | `firstName` + `lastName` not indexed; full-name searches use `contains` |
| F-013 | 🔵 LOW | Auth | `COOKIE_SECURE` defaults to `false` in `env.ts` — must be `true` in production |
| F-014 | 🔵 LOW | `Answer` / `answers` | No unique constraint on `(questionId, doctorId)`; duplicate answers possible |

---

### 3.2 Detailed Findings

#### F-001 — `user.fullName` Does Not Exist (CRITICAL)

- **Location:** `src/services/doctor.service.ts` (multiple `select: { fullName: true }`), `src/services/patient.service.ts`
- **Problem:** The Prisma `User` model has `firstName` and `lastName` but no `fullName` field. These `select` statements will cause **Prisma query failures** (unknown field error) and/or return `undefined` for `fullName` at runtime.
- **Recommended Fix:** Either add a computed field `fullName` via Prisma extension (`$extends`) or replace all `fullName` references with `firstName` + `lastName` concatenation in application code.

#### F-002 — `refresh_tokens` Table Is a Dangling Legacy Table (CRITICAL)

- **Location:** `prisma/schema.prisma` (model `RefreshToken`)
- **Problem:** The `auth.service.ts` exclusively uses `prisma.userSession` for session management. No code calls `prisma.refreshToken` anywhere in `src/`. The `refresh_tokens` table still exists in the DB with the raw token stored as TEXT. This creates an **orphaned table with sensitive column design** that is:
  1. Wasting storage
  2. Presenting a security attack surface (if populated via legacy code paths)
- **Recommended Fix:** Remove the `RefreshToken` model from `schema.prisma` and drop the `refresh_tokens` table via migration.

#### F-003 — No Migration History (HIGH)

- **Location:** `package.json` scripts; absence of `prisma/migrations/`
- **Problem:** The project uses `prisma db push` exclusively. This provides no audit trail, no rollback capability, and no safe path for incremental production schema changes. In production, any `db push` can be destructive.
- **Recommended Fix:** Migrate to `prisma migrate dev` / `prisma migrate deploy` workflow. Create an initial baseline migration.

#### F-004 — Denormalized Rating Stats Without Sync Guarantee (HIGH)

- **Location:** `prisma/schema.prisma` `DoctorProfile.ratingAverage` / `ratingCount`; `prisma/seed.ts` (manual updates)
- **Problem:** `ratingAverage` and `ratingCount` are stored and manually updated. The seed script sets them explicitly. The admin service's `moderateRating` likely updates them, but if any code path creates/deletes a `Rating` row without running the update logic, the stats will drift silently.
- **Recommended Fix:** Either (a) compute these values on-the-fly via aggregation query, or (b) add a transactional update whenever a `Rating` is created/updated/deleted.

#### F-005 — No CHECK Constraint on `rating.score` (HIGH)

- **Location:** `prisma/schema.prisma` `Rating.score`
- **Problem:** The schema comment says `1-5` but this is **not enforced at the DB level**. MySQL 8.0 supports CHECK constraints. Prisma does not generate them automatically for `Int`. A bug or direct DB insert could store `score = 0` or `score = 100`.
- **Recommended Fix:** Add validation in Zod schema (already partially done in controllers) AND add a DB-level constraint via raw migration SQL: `ALTER TABLE ratings ADD CONSTRAINT chk_score CHECK (score BETWEEN 1 AND 5)`.

#### F-006 — Legacy `name` Field in `specialties` (MEDIUM)

- **Location:** `prisma/schema.prisma`, comment: `// Kept for backward compatibility`
- **Problem:** Three specialty name fields exist: `name` (legacy), `nameEn`, `nameVi`. The `name` field has a UNIQUE constraint. This is data duplication and will require keeping three values in sync.
- **Recommended Fix:** Plan deprecation of `name`. Remove from API responses and eventually drop from schema.

#### F-007 — Untyped JSON in `doctor_profiles.schedule` (MEDIUM)

- **Location:** `prisma/schema.prisma` `DoctorProfile.schedule`; typed as `any` in `UpdateScheduleInput`
- **Problem:** Schedule data is stored as a `TEXT` JSON string with no schema validation. Prisma supports `Json` type for MySQL which provides better semantics (though stored similarly). The TS type is `any`.
- **Recommended Fix:** Change to `Json?` Prisma type and define a TypeScript interface for the schedule shape.

#### F-008 — Stale Session Accumulation (MEDIUM)

- **Location:** `src/services/auth.service.ts`, `user_sessions` table
- **Problem:** `auth.service.ts` creates a new `UserSession` on every login. There is a `revokeAllUserSessions` method called on token reuse detection, but no scheduled cleanup of naturally expired sessions (`expiresAt < NOW()`). Over time this table will grow unboundedly.
- **Recommended Fix:** Add a periodic cleanup job (cron or DB event) to delete sessions where `expiresAt < NOW()`.

#### F-009 — Soft Delete Has No Timestamp (MEDIUM)

- **Location:** `admin.service.ts` `deleteUser()`: sets `isActive: false`
- **Problem:** Soft-deleted users have no `deletedAt` timestamp, making audit trails and GDPR-compliant data retention policies impossible to implement.
- **Recommended Fix:** Add `deletedAt DateTime?` field to `User` and set it on soft-delete.

#### F-010 — Appointment Conflict Only Checks Exact Datetime (MEDIUM)

- **Location:** `src/services/patient.service.ts` `createAppointment()`
- **Problem:** Conflict detection only matches `scheduledAt == exact datetime`. A doctor could have overlapping appointments if one is scheduled 15 minutes after another (no duration column exists).
- **Recommended Fix:** Add an `durationMinutes Int @default(30)` field and implement range-overlap conflict detection.

---

## 4. Relationship Diagram (Text ERD)

```
users
  ├──(1:1)───> patient_profiles
  │               ├──(1:N)──> questions
  │               │               └──(1:N)──> answers
  │               ├──(1:N)──> appointments
  │               │               └──(1:N)──> ratings
  │               └──(1:N)──> ratings
  ├──(1:1)───> doctor_profiles
  │               ├──(N:1)──> specialties
  │               ├──(1:N)──> questions (assigned doctor)
  │               ├──(1:N)──> answers
  │               ├──(1:N)──> appointments
  │               └──(1:N)──> ratings
  ├──(1:N)───> refresh_tokens  [UNUSED — legacy]
  └──(1:N)───> user_sessions
```

### 4.1 Table-Level ERD

```
specialties ──────(1:N)────── doctor_profiles ──(1:1)── users ──(1:1)── patient_profiles
                                     |                    |                      |
                                     |                    |                      |
                                     └──(1:N)──┐          └──(1:N)── user_sessions
                                               │          └──(1:N)── refresh_tokens [legacy]
                         questions ─────(N:1)──┘
                              |         │
                         (1:N)│         └──(N:1)── patient_profiles
                              │
                         answers ──(N:1)── doctor_profiles
                              
                         appointments ──(N:1)── patient_profiles
                              |         └──(N:1)── doctor_profiles
                              │
                         ratings ──(N:1)── patient_profiles
                                   └──(N:1)── doctor_profiles
```

### 4.2 Cardinality Summary

| Relationship | Type | FK Column |
|---|---|---|
| `users` → `patient_profiles` | 1:0..1 | `patient_profiles.userId` |
| `users` → `doctor_profiles` | 1:0..1 | `doctor_profiles.userId` |
| `users` → `user_sessions` | 1:N | `user_sessions.userId` |
| `users` → `refresh_tokens` | 1:N | `refresh_tokens.userId` |
| `doctor_profiles` → `specialties` | N:1 | `doctor_profiles.specialtyId` |
| `patient_profiles` → `questions` | 1:N | `questions.patientId` |
| `doctor_profiles` → `questions` | 1:N (optional) | `questions.doctorId` (nullable) |
| `questions` → `answers` | 1:N | `answers.questionId` |
| `doctor_profiles` → `answers` | 1:N | `answers.doctorId` |
| `patient_profiles` → `appointments` | 1:N | `appointments.patientId` |
| `doctor_profiles` → `appointments` | 1:N | `appointments.doctorId` |
| `appointments` → `ratings` | 1:N (unique per patient) | `ratings.appointmentId` |
| `patient_profiles` → `ratings` | 1:N | `ratings.patientId` |
| `doctor_profiles` → `ratings` | 1:N | `ratings.doctorId` |

---

## 5. Recommendations

### 5.1 Unused Tables

| Table | Status | Recommendation |
|---|---|---|
| `refresh_tokens` | Schema defined, no app code uses it | **DROP** — remove model from schema.prisma and drop table |

### 5.2 Potentially Unused / Problematic Columns

| Table | Column | Issue |
|---|---|---|
| `specialties` | `name` | Legacy, acknowledged in comment. Plan to deprecate. |
| `doctor_profiles` | `schedule` | Untyped TEXT/JSON. Refactor to structured `Json` type or separate table. |
| `doctor_profiles` | `ratingAverage`, `ratingCount` | Denormalized — risk of drift. Consider views or on-the-fly aggregation. |
| `users` | — | Missing `deletedAt` for proper soft-delete audit trail. |

### 5.3 Missing Indexes

| Table | Suggested Index | Reason |
|---|---|---|
| `users` | `(firstName, lastName)` | Admin search uses `contains` on both fields |
| `appointments` | `(doctorId, scheduledAt, status)` | Composite for conflict check query |
| `specialties` | `nameEn`, `nameVi` | If searching by localized name |
| `user_sessions` | Already indexed on `expiresAt` | ✅ Good for cleanup queries |

### 5.4 Normalization Issues

1. **`DoctorProfile.ratingAverage` / `ratingCount`**: Denormalized aggregate — should be computed or maintained transactionally.
2. **`Specialty.name` + `nameEn` + `nameVi`**: Three name columns for one entity. Consider a `specialty_translations` table if more locales are planned.
3. **`DoctorProfile.schedule`**: Storing structured data as a JSON string in a TEXT column avoids schema enforcement. Consider either a `Json` Prisma type or a separate `doctor_schedules` table.

### 5.5 Security Risks

| Severity | Risk | Location | Recommendation |
|---|---|---|---|
| 🔴 CRITICAL | Raw JWT refresh tokens stored in `refresh_tokens` table | `prisma/schema.prisma`, `refresh_tokens` model | Remove the model and drop the table — already superseded by `user_sessions` |
| 🟠 HIGH | No `score` CHECK constraint | `ratings.score` | Add DB-level CHECK or migration SQL |
| 🟠 HIGH | `COOKIE_SECURE` defaults to `false` | `src/config/env.ts` | Ensure `COOKIE_SECURE=true` in production `.env` |
| 🟡 MEDIUM | No session limit per user | `user_sessions` creation | Add max-session-per-user logic or TTL-based session limit |
| 🟡 MEDIUM | No rate limiting on token refresh endpoint | Routes | Confirm rate limiter covers `/auth/refresh` |
| 🟡 MEDIUM | `JWT_ACCESS_EXPIRE` defaults to `15m`, `JWT_REFRESH_EXPIRE` to `7d` | `env.ts` | Document and enforce these as appropriate per security policy |
| 🔵 LOW | `refreshToken` stored in a cookie — `sameSite` defaults to `lax` | `env.ts` | Verify `COOKIE_SAMESITE=strict` in production |

✅ **Confirmed Good Practices:**
- Passwords hashed with `bcryptjs` (10 rounds)
- Access/Refresh token separation with distinct secrets (`JWT_SECRET`, `JWT_REFRESH_SECRET`)
- Refresh tokens stored as **SHA-256 hashes** in `user_sessions` (active mechanism)
- Token reuse detection triggers session revocation (`revokeAllUserSessions`)
- CORS origin validated via env variable
- `helmet` middleware applied
- `express-rate-limit` applied
- Zod validation on all request inputs

### 5.6 Migration Strategy

1. **Immediately:** Switch from `prisma db push` to `prisma migrate` workflow:
   ```bash
   npx prisma migrate dev --name init_baseline
   ```
2. **Short-term migrations to create:**
   - `remove_refresh_tokens_table`
   - `add_deleted_at_to_users`
   - `add_score_check_constraint_to_ratings`
   - `add_answer_unique_per_question_doctor`
3. **Medium-term:** Add `fullName` as computed field or refactor all references.
4. **Long-term:** Consider `specialty_translations` table and structured schedule model.

### 5.7 Naming Consistency

- All table names use `snake_case` ✅
- Prisma model names use `PascalCase` ✅
- Field names use `camelCase` ✅
- CUID used as primary key type (not UUID or auto-increment) — consistent throughout ✅
- Mix of `isApproved` (Answer), `isActive` (User/Specialty), `revoked` (RefreshToken), `revokedAt` (UserSession) — inconsistent boolean/timestamp null pattern for state flags ⚠️

---

## Appendix A — Evidence Links (File Paths & Snippet References)

| Evidence | File Path | Notes |
|---|---|---|
| Prisma dependency | `package.json` lines 8–12 | `@prisma/client ^5.7.0`, `prisma ^5.7.0` |
| DB schema | `prisma/schema.prisma` | Full 10-model definition |
| DB init SQL | `prisma/init.sql` | Charset + grants only; no CREATE TABLE |
| Seed data | `prisma/seed.ts` | 583-line seed; references all models |
| PrismaClient singleton | `src/config/db.ts` | No extensions / middleware defined |
| Env validation | `src/config/env.ts` | Zod schema; `COOKIE_SECURE` default `false` |
| JWT utilities | `src/utils/jwt.ts` | `signAccessToken`, `signRefreshToken`, `verifyAccessToken` |
| Auth middleware | `src/middlewares/auth.middleware.ts` | Bearer token extraction |
| Auth service | `src/services/auth.service.ts` | `UserSession` creation; `RefreshToken` NOT used |
| `fullName` bug | `src/services/doctor.service.ts` | `select: { fullName: true }` — field undefined in schema |
| Patient service | `src/services/patient.service.ts` | `fullName` access; future-date validation |
| Admin service | `src/services/admin.service.ts` | 971 lines; CRUD for all entities |
| Report service | `src/services/report.service.ts` | Aggregations; no raw SQL |
| Admin routes | `src/routes/admin.routes.ts` | Moderation endpoints |
| Rating denorm | `prisma/seed.ts` lines 530–555 | Manual `ratingAverage` + `ratingCount` update |
| Appointment conflict | `src/services/patient.service.ts` | `findFirst` on exact `scheduledAt` match |
