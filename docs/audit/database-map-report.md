# Database Map Report — OnlineHealthConsultation-Service

> **Generated:** 2026-03-03  
> **Source of truth:** `prisma/schema.prisma` + `prisma/migrations/**`  
> **Database engine:** MySQL 8.0 (InnoDB, utf8mb4\_unicode\_ci)  
> **ORM:** Prisma  
> **ID strategy:** `CHAR(36)` filled by application layer with **UUIDv7** via [`src/utils/id.ts`](../../src/utils/id.ts)

---

## Table of Contents

1. [Prisma Schema Summary](#1-prisma-schema-summary)
   - [Enums](#11-enums)
   - [Model Catalogue](#12-model-catalogue)
   - [Relationship Map](#13-relationship-map)
   - [Constraints & Indexes](#14-constraints--indexes)
   - [Data Classification](#15-data-classification)
2. [ERD Text Diagram](#2-erd-text-diagram)
3. [DB Risks & Recommendations](#3-db-risks--recommendations)
4. [Migration Notes](#4-migration-notes)

---

## 1. Prisma Schema Summary

### 1.1 Enums

| Enum | Values |
|---|---|
| `Role` | `PATIENT`, `DOCTOR`, `ADMIN` |
| `Gender` | `MALE`, `FEMALE`, `OTHER` |
| `QuestionStatus` | `PENDING`, `ANSWERED`, `MODERATED` |
| `AppointmentStatus` | `PENDING`, `CONFIRMED`, `CANCELLED`, `COMPLETED` |
| `RatingStatus` | `VISIBLE`, `HIDDEN` |

---

### 1.2 Model Catalogue

#### `users` → `User`

| Field | Type | Constraints | Notes |
|---|---|---|---|
| `id` | `CHAR(36)` | PK | UUIDv7, app-generated via `src/utils/id.ts` |
| `email` | `VARCHAR(191)` | `UNIQUE` | |
| `passwordHash` | `VARCHAR(191)` | NOT NULL | Bcrypt hash |
| `firstName` | `VARCHAR(191)` | NOT NULL | |
| `lastName` | `VARCHAR(191)` | NOT NULL | |
| `role` | `ENUM(Role)` | NOT NULL | `PATIENT \| DOCTOR \| ADMIN` |
| `isActive` | `BOOLEAN` | DEFAULT `true` | |
| `deletedAt` | `DATETIME(3)?` | nullable | Soft-delete timestamp; `NULL` = active (migration 4) |
| `createdAt` | `DATETIME(3)` | DEFAULT `now()` | |
| `updatedAt` | `DATETIME(3)` | `@updatedAt` | |

**Indexes on `users`:** `email` (UNIQUE + redundant plain INDEX), `role`, `deletedAt`

---

#### `patient_profiles` → `PatientProfile`

| Field | Type | Constraints | Notes |
|---|---|---|---|
| `id` | `CHAR(36)` | PK | |
| `userId` | `CHAR(36)` | UNIQUE FK → `users.id` CASCADE | |
| `dateOfBirth` | `DATETIME(3)?` | nullable | |
| `gender` | `ENUM(Gender)?` | nullable | |
| `phone` | `VARCHAR(191)?` | nullable | |
| `address` | `VARCHAR(191)?` | nullable | |
| `medicalHistory` | `TEXT?` | nullable | Health-sensitive |
| `createdAt` | `DATETIME(3)` | DEFAULT `now()` | |
| `updatedAt` | `DATETIME(3)` | `@updatedAt` | |

**Indexes:** `userId` (UNIQUE + redundant plain INDEX)

---

#### `doctor_profiles` → `DoctorProfile`

| Field | Type | Constraints | Notes |
|---|---|---|---|
| `id` | `CHAR(36)` | PK | |
| `userId` | `CHAR(36)` | UNIQUE FK → `users.id` CASCADE | |
| `specialtyId` | `CHAR(36)` | FK → `specialties.id` RESTRICT | NOT NULL |
| `bio` | `TEXT?` | nullable | |
| `yearsOfExperience` | `INT` | DEFAULT `0` | |
| `ratingAverage` | `DOUBLE` | DEFAULT `0` | Denormalized aggregate — drift risk |
| `ratingCount` | `INT` | DEFAULT `0` | Denormalized aggregate — drift risk |
| `schedule` | `TEXT?` | nullable | JSON blob: `ScheduleSlot[]`; validated in `src/utils/schedule.ts` |
| `scheduleUpdatedAt` | `DATETIME(3)?` | nullable | Audit timestamp for schedule writes (migration 3) |
| `createdAt` | `DATETIME(3)` | DEFAULT `now()` | |
| `updatedAt` | `DATETIME(3)` | `@updatedAt` | |

**Indexes:** `userId` (UNIQUE + redundant plain INDEX), `specialtyId`

---

#### `specialties` → `Specialty`

| Field | Type | Constraints | Notes |
|---|---|---|---|
| `id` | `CHAR(36)` | PK | |
| `name` | `VARCHAR(191)` | UNIQUE | Legacy alias of `nameEn`; kept for backward compat (migration 2) |
| `nameEn` | `VARCHAR(191)` | NOT NULL | Authoritative English name |
| `nameVi` | `VARCHAR(191)` | NOT NULL | Authoritative Vietnamese name |
| `description` | `TEXT?` | nullable | |
| `isActive` | `BOOLEAN` | DEFAULT `true` | |
| `createdAt` | `DATETIME(3)` | DEFAULT `now()` | |
| `updatedAt` | `DATETIME(3)` | `@updatedAt` | |

---

#### `questions` → `Question`

| Field | Type | Constraints | Notes |
|---|---|---|---|
| `id` | `CHAR(36)` | PK | |
| `patientId` | `CHAR(36)` | FK → `patient_profiles.id` CASCADE | NOT NULL |
| `doctorId` | `CHAR(36)?` | FK → `doctor_profiles.id` SET NULL | nullable — unassigned questions are allowed |
| `title` | `VARCHAR(191)` | NOT NULL | |
| `content` | `TEXT` | NOT NULL | Health-sensitive |
| `status` | `ENUM(QuestionStatus)` | DEFAULT `PENDING` | |
| `createdAt` | `DATETIME(3)` | DEFAULT `now()` | |
| `updatedAt` | `DATETIME(3)` | `@updatedAt` | |

**Indexes:** `patientId`, `doctorId`, `status`

---

#### `answers` → `Answer`

| Field | Type | Constraints | Notes |
|---|---|---|---|
| `id` | `CHAR(36)` | PK | |
| `questionId` | `CHAR(36)` | FK → `questions.id` CASCADE | NOT NULL |
| `doctorId` | `CHAR(36)` | FK → `doctor_profiles.id` **RESTRICT** | NOT NULL |
| `content` | `TEXT` | NOT NULL | Health-sensitive |
| `isApproved` | `BOOLEAN` | DEFAULT `false` | |
| `createdAt` | `DATETIME(3)` | DEFAULT `now()` | |
| `updatedAt` | `DATETIME(3)` | `@updatedAt` | |

**Indexes:** `questionId`, `doctorId`

---

#### `appointments` → `Appointment`

| Field | Type | Constraints | Notes |
|---|---|---|---|
| `id` | `CHAR(36)` | PK | |
| `patientId` | `CHAR(36)` | FK → `patient_profiles.id` CASCADE | NOT NULL |
| `doctorId` | `CHAR(36)` | FK → `doctor_profiles.id` **RESTRICT** | NOT NULL |
| `scheduledAt` | `DATETIME(3)` | NOT NULL | No duration field — hardcoded interval in service layer |
| `status` | `ENUM(AppointmentStatus)` | DEFAULT `PENDING` | |
| `reason` | `TEXT` | NOT NULL | Health-sensitive |
| `notes` | `TEXT?` | nullable | Health-sensitive |
| `createdAt` | `DATETIME(3)` | DEFAULT `now()` | |
| `updatedAt` | `DATETIME(3)` | `@updatedAt` | |

**Indexes:** `patientId`, `doctorId`, `status`, `scheduledAt`  
**Composite indexes (migration 5):** `(doctorId, status, scheduledAt)`, `(patientId, status, scheduledAt)`

---

#### `ratings` → `Rating`

| Field | Type | Constraints | Notes |
|---|---|---|---|
| `id` | `CHAR(36)` | PK | |
| `patientId` | `CHAR(36)` | FK → `patient_profiles.id` CASCADE | NOT NULL |
| `doctorId` | `CHAR(36)` | FK → `doctor_profiles.id` **RESTRICT** | NOT NULL |
| `appointmentId` | `CHAR(36)` | FK → `appointments.id` CASCADE | NOT NULL |
| `score` | `INT` | CHECK `BETWEEN 1 AND 5` | DB-level constraint added migration 1 |
| `comment` | `TEXT?` | nullable | |
| `status` | `ENUM(RatingStatus)` | DEFAULT `VISIBLE` | |
| `createdAt` | `DATETIME(3)` | DEFAULT `now()` | |
| `updatedAt` | `DATETIME(3)` | `@updatedAt` | |

**Unique constraint:** `(appointmentId, patientId)` — one rating per appointment per patient  
**Indexes:** `patientId`, `doctorId`, `status`

---

#### `user_sessions` → `UserSession`

| Field | Type | Constraints | Notes |
|---|---|---|---|
| `id` | `CHAR(36)` | PK | |
| `userId` | `CHAR(36)` | FK → `users.id` CASCADE | NOT NULL |
| `refreshTokenHash` | `VARCHAR(191)` | UNIQUE | SHA-256 hash of raw refresh token |
| `expiresAt` | `DATETIME(3)` | NOT NULL | |
| `revokedAt` | `DATETIME(3)?` | nullable | `NULL` = session still valid |
| `lastUsedAt` | `DATETIME(3)` | DEFAULT `now()` | |
| `createdAt` | `DATETIME(3)` | DEFAULT `now()` | |
| `userAgent` | `TEXT?` | nullable | |
| `ipAddress` | `VARCHAR(191)?` | nullable | |

**Indexes:** `userId`, `refreshTokenHash` (UNIQUE + redundant plain INDEX), `expiresAt`

---

### 1.3 Relationship Map

| From | Cardinality | To | FK Field | onDelete |
|---|---|---|---|---|
| `User` | 1 : 0..1 | `PatientProfile` | `userId` | CASCADE |
| `User` | 1 : 0..1 | `DoctorProfile` | `userId` | CASCADE |
| `User` | 1 : N | `UserSession` | `userId` | CASCADE |
| `Specialty` | 1 : N | `DoctorProfile` | `specialtyId` | RESTRICT |
| `PatientProfile` | 1 : N | `Question` | `patientId` | CASCADE |
| `PatientProfile` | 1 : N | `Appointment` | `patientId` | CASCADE |
| `PatientProfile` | 1 : N | `Rating` | `patientId` | CASCADE |
| `DoctorProfile` | 1 : N | `Question` | `doctorId` (nullable) | SET NULL |
| `DoctorProfile` | 1 : N | `Answer` | `doctorId` | RESTRICT |
| `DoctorProfile` | 1 : N | `Appointment` | `doctorId` | RESTRICT |
| `DoctorProfile` | 1 : N | `Rating` | `doctorId` | RESTRICT |
| `Question` | 1 : N | `Answer` | `questionId` | CASCADE |
| `Appointment` | 1 : N* | `Rating` | `appointmentId` | CASCADE |

> \* The `UNIQUE(appointmentId, patientId)` constraint makes this effectively **1 : 0..1** in practice.

---

### 1.4 Constraints & Indexes

| Table | Type | Definition |
|---|---|---|
| `users` | UNIQUE | `email` |
| `users` | INDEX | `email` *(redundant — duplicate of UNIQUE)* |
| `users` | INDEX | `role` |
| `users` | INDEX | `deletedAt` |
| `patient_profiles` | UNIQUE | `userId` |
| `patient_profiles` | INDEX | `userId` *(redundant)* |
| `doctor_profiles` | UNIQUE | `userId` |
| `doctor_profiles` | INDEX | `userId` *(redundant)* |
| `doctor_profiles` | INDEX | `specialtyId` |
| `specialties` | UNIQUE | `name` |
| `questions` | INDEX | `patientId`, `doctorId`, `status` |
| `answers` | INDEX | `questionId`, `doctorId` |
| `appointments` | INDEX | `patientId`, `doctorId`, `status`, `scheduledAt` |
| `appointments` | COMPOSITE INDEX | `(doctorId, status, scheduledAt)` |
| `appointments` | COMPOSITE INDEX | `(patientId, status, scheduledAt)` |
| `ratings` | UNIQUE | `(appointmentId, patientId)` |
| `ratings` | INDEX | `patientId`, `doctorId`, `status` |
| `ratings` | CHECK | `score BETWEEN 1 AND 5` |
| `user_sessions` | UNIQUE | `refreshTokenHash` |
| `user_sessions` | INDEX | `userId`, `refreshTokenHash` *(redundant)*, `expiresAt` |

---

### 1.5 Data Classification

| Classification | Tables / Fields |
|---|---|
| **PII** | `users` (`email`, `firstName`, `lastName`), `patient_profiles` (`dateOfBirth`, `gender`, `phone`, `address`), `user_sessions` (`ipAddress`, `userAgent`) |
| **Health-sensitive** | `patient_profiles` (`medicalHistory`), `questions` (`content`), `answers` (`content`), `appointments` (`reason`, `notes`) |
| **Auth / Security-critical** | `users` (`passwordHash`, `role`, `isActive`, `deletedAt`), `user_sessions` (`refreshTokenHash`, `expiresAt`, `revokedAt`) |
| **Business aggregate (drift risk)** | `doctor_profiles` (`ratingAverage`, `ratingCount`) |

---

## 2. ERD Text Diagram

```
┌──────────┐         ┌──────────────────┐         ┌─────────────────┐
│  users   │ 1 ─── 1 │ patient_profiles │ 1 ─── N │   questions     │
│          │         │                  │         │  (patientId FK) │
│          │ 1 ─── 1 │  doctor_profiles │◄── 0..N ┘
│          │         └──────────────────┘  (doctorId nullable, SET NULL)
│          │                 │ N
│          │                 │ │ 1 ─── N  answers
│          │                 │ │          (doctorId FK, RESTRICT)
│          │                 │ │ 1 ─── N  appointments
│          │                 │ │          (doctorId FK, RESTRICT)
│          │                 │ └ 1 ─── N  ratings
│          │                 │            (doctorId FK, RESTRICT)
│          │         ┌───────┘
│          │         │ specialties  1 ─── N  doctor_profiles
│          │         │              (specialtyId FK, RESTRICT)
│          │
│          │ 1 ─── N │ user_sessions
└──────────┘           (userId FK, CASCADE)


patient_profiles (1) ─── (N) questions       [CASCADE]
patient_profiles (1) ─── (N) appointments    [CASCADE]
patient_profiles (1) ─── (N) ratings         [CASCADE]

questions        (1) ─── (N) answers          [CASCADE on questionId]
appointments     (1) ─── (0..1) ratings       [CASCADE; UNIQUE(appointmentId,patientId)]

doctor_profiles  (1) ─── (N) questions        [SET NULL on doctorId]
doctor_profiles  (1) ─── (N) answers          [RESTRICT]
doctor_profiles  (1) ─── (N) appointments     [RESTRICT]
doctor_profiles  (1) ─── (N) ratings          [RESTRICT]

specialties      (1) ─── (N) doctor_profiles  [RESTRICT]
users            (1) ─── (1) patient_profiles [CASCADE]
users            (1) ─── (1) doctor_profiles  [CASCADE]
users            (1) ─── (N) user_sessions    [CASCADE]
```

---

## 3. DB Risks & Recommendations

### 🔴 HIGH — Fix Before Production

---

#### RISK-01 · Denormalized `ratingAverage` / `ratingCount` with no transactional guard

**Tables:** `doctor_profiles.ratingAverage`, `doctor_profiles.ratingCount`  
**Location:** Values written by application-layer code (see `src/services/` rating update logic) outside the `Rating` insert transaction.  
**Risk:** A crash or exception between the `Rating` write and the `DoctorProfile` aggregate update leaves the averages permanently wrong. Silent drift accumulates over time and cannot easily be detected.

**Recommendation:**
```typescript
// Wrap both writes in a single Prisma transaction
await prisma.$transaction([
  prisma.rating.create({ data: ratingData }),
  prisma.doctorProfile.update({
    where: { id: doctorId },
    data: { ratingAverage: newAvg, ratingCount: newCount },
  }),
]);
```
Or change strategy: compute `ratingAverage` and `ratingCount` lazily via a query (`AVG(score)` + `COUNT(*) FROM ratings WHERE doctorId = ?`) and cache it, removing the denormalized columns entirely.

---

#### RISK-02 · `DoctorProfile` has no soft-delete but `User` does — creates silent data exposure

**Tables:** `users` (`deletedAt`, `isActive`), `doctor_profiles` (no equivalent)  
**Risk:** When a user account is deactivated (`User.deletedAt` set, `User.isActive = false`), the `DoctorProfile` row remains with no flag of its own. Any query that reaches `doctor_profiles` without joining through `users` will expose the deactivated doctor's data. This is particularly risky for appointment booking and public doctor listings.

**Recommendation:** Add `isActive BOOLEAN DEFAULT TRUE` (and optionally `deletedAt DATETIME(3)`) to `doctor_profiles`, kept in sync with the parent `User` during deactivation. Alternatively, define and enforce a mandatory join contract in all service-layer queries.

Migration template:
```sql
ALTER TABLE `doctor_profiles` ADD COLUMN `isActive` BOOLEAN NOT NULL DEFAULT TRUE;
```

---

#### RISK-03 · `Question.doctorId` SET NULL destroys assignment audit trail

**Location:** `prisma/schema.prisma` — `Question.doctor` relation with no explicit `onDelete`; resolved to `SET NULL` by Prisma default for nullable FKs.  
**Migration evidence:** `prisma/migrations/20260302000000_init/migration.sql` — `questions_doctorId_fkey … ON DELETE SET NULL`.  
**Risk:** If a `DoctorProfile` is ever hard-deleted (currently blocked by RESTRICT from `answers`/`appointments`/`ratings`, but could happen if those records are purged first), `doctorId` on existing Questions becomes `NULL`, silently erasing which doctor was assigned to a medical consultation record.

**Recommendation:** Change to `RESTRICT` to match the pattern used for `answers`, `appointments`, and `ratings`. If SET NULL semantics are genuinely needed, add a separate `originalDoctorId CHAR(36)?` audit column that is never nulled.

---

### 🟠 MEDIUM — Address in Next Sprint

---

#### RISK-04 · Redundant duplicate indexes waste write I/O

**Tables affected:** `users`, `patient_profiles`, `doctor_profiles`, `user_sessions`  
**Detail:** In MySQL, a `UNIQUE` constraint already creates a B-tree index that serves all lookup purposes of a plain `INDEX`. Adding a separate `@@index` on the same column creates a second identical index that MySQL maintains on every INSERT/UPDATE/DELETE — wasted overhead with no query benefit.

| Table | Redundant index |
|---|---|
| `users` | `@@index([email])` (UNIQUE already exists) |
| `patient_profiles` | `@@index([userId])` (UNIQUE already exists) |
| `doctor_profiles` | `@@index([userId])` (UNIQUE already exists) |
| `user_sessions` | `@@index([refreshTokenHash])` (UNIQUE already exists) |

**Recommendation:** Remove the four redundant `@@index` entries from `prisma/schema.prisma` and generate a migration to drop them.

---

#### RISK-05 · `DoctorProfile.schedule` stored as unvalidated JSON text blob

**Location:** `prisma/schema.prisma` — `schedule String? @db.Text`; runtime validation in `src/utils/schedule.ts`.  
**Risk:** Storing structured schedule data as serialized JSON in a `TEXT` column means:
- No DB-level type validation — invalid JSON is silently stored.
- No query-ability — filtering/sorting doctors by availability requires full table scan + application-side deserialization (N+1 problem at scale).
- Partial updates require read-modify-write the entire JSON blob.

**Recommendation — Option A (minimal change):** Change column type to MySQL native `JSON`:
```prisma
schedule Json? // @db.Json
```
This enables `JSON_CONTAINS`, `JSON_EXTRACT` queries and DB-level JSON syntax validation.

**Recommendation — Option B (proper normalization):** Extract to a `DoctorScheduleSlot` table:
```prisma
model DoctorScheduleSlot {
  id        String   @id @db.Char(36)
  doctorId  String   @db.Char(36)
  date      DateTime @db.Date
  startTime String   @db.VarChar(5)  // "HH:MM"
  endTime   String   @db.VarChar(5)
  available Boolean  @default(true)
  // ...
}
```

---

#### RISK-06 · `Specialty.name` drift — app-level sync with no DB enforcement

**Location:** `prisma/migrations/20260302000002_f006_specialty_name_sync/migration.sql` documents that `name` is now a derived alias of `nameEn`, synced by `admin.service.ts`.  
**Risk:** Any direct SQL `INSERT`/`UPDATE` on `specialties` (from a DBA, migration script, or another service) that bypasses the application will cause `name != nameEn` drift. The UNIQUE constraint on `name` also potentially conflicts with `nameEn` UNIQUE semantics if two specialties share the same English name.

**Recommendation:** Add a `BEFORE INSERT / BEFORE UPDATE` trigger to auto-sync `name = nameEn` at the DB level, or drop `name` entirely in a breaking migration and update all callers.

---

#### RISK-07 · `user_sessions` missing composite index for active-session lookup

**Current indexes:** single-column `userId`, `refreshTokenHash`, `expiresAt`  
**Typical query pattern:** `WHERE userId = ? AND revokedAt IS NULL AND expiresAt > NOW()`  
**Risk:** MySQL must scan all sessions for a user and filter by `expiresAt` and `revokedAt` separately — inefficient for users with many historical sessions.

**Recommendation:** Add composite index:
```prisma
@@index([userId, expiresAt])
```

---

### 🟡 LOW — Backlog / Tech Debt

---

#### RISK-08 · ID strategy undocumented in schema — `CHAR(36)` filled with UUIDv7 by application

**Location:** `src/utils/id.ts` uses `uuidv7()`; `prisma/schema.prisma` uses `@id @db.Char(36)` with no `@default(...)` directive.  
**Risk:** Prisma's `@default(uuid())` or `@default(cuid())` is NOT used. All IDs must be generated by the application before Prisma `create()` calls. Any code path that omits `id` in the `data` object will throw a DB constraint error (no default). Prisma Studio and introspection tools will not understand ID generation.

**Recommendation:** Document with a comment in `schema.prisma`, or switch to `@default(dbgenerated("(uuid())"))` to allow DB-level generation as a fallback.

---

#### RISK-09 · `Rating` modeled as 1:N on `Appointment` but is functionally 1:0..1

**Location:** `prisma/schema.prisma` — `Appointment.ratings Rating[]` with `UNIQUE(appointmentId, patientId)` constraint.  
**Risk:** Any code that does `include: { ratings: true }` on an `Appointment` will always get an array with at most 1 element, but must handle it as an array. This causes unnecessary array unwrapping in application code and is semantically misleading.

**Recommendation:** If the business rule is strictly "one rating per appointment", model as an optional one-to-one relation to get type-safe Prisma access (`appointment.rating?.score` vs `appointment.ratings[0]?.score`).

---

#### RISK-10 · `Appointment.scheduledAt` has no duration — hardcoded conflict window

**Location:** Conflict detection in service layer references `scheduledAt` with an assumed fixed duration interval.  
**Risk:** If appointment duration varies by specialty, doctor, or appointment type in the future, the conflict detection logic will silently produce incorrect results without a corresponding schema change.

**Recommendation:** Add:
```prisma
durationMinutes Int @default(60)
```

---

#### RISK-11 · No index on `specialties.isActive`

**Impact:** Low cardinality, small table — but as specialty count grows, `WHERE isActive = true` scans all rows.  
**Recommendation:** Add `@@index([isActive])` to `Specialty`.

---

#### RISK-12 · `init.sql` is a separate DDL file not managed by Prisma migrations

**Location:** `prisma/init.sql`  
**Content:** DB character set, user grants — no table DDL (confirmed safe).  
**Risk:** The file is passed to the MySQL Docker container as an init script. If it is ever modified to include table DDL (e.g. for a quick fix), it will create drift between the Docker init state and the Prisma migration history, causing `prisma migrate status` to show a false clean baseline.

**Recommendation:** Enforce a policy that `init.sql` contains only database-level setup (charset, grants). All table DDL must go through Prisma migrations.

---

## 4. Migration Notes

| # | Migration | Key Change | Status | Risk |
|---|---|---|---|---|
| 0 | `20260302000000_init` | Full schema creation — all 9 tables + FKs | ✅ Applied | Single-shot dump; no zero-downtime DDL analysis documented |
| 1 | `20260302000001_f005_rating_score_check` | `ALTER TABLE ratings ADD CONSTRAINT chk_ratings_score CHECK (score BETWEEN 1 AND 5)` | ✅ Applied | `triggers.sql` companion **not executed by `prisma migrate`** — must be applied manually on MySQL < 8.0.16. No CI enforcement. |
| 2 | `20260302000002_f006_specialty_name_sync` | `UPDATE specialties SET name = nameEn WHERE name != nameEn` (data migration) | ✅ Applied | Idempotent data fix; `name` drift can re-occur without a DB trigger |
| 3 | `20260302000003_f007_schedule_updated_at` | `ALTER TABLE doctor_profiles ADD COLUMN scheduleUpdatedAt DATETIME(3) NULL` | ✅ Applied | Safe additive; nullable so existing rows unaffected |
| 4 | `20260302000004_f009_user_deleted_at` | `ALTER TABLE users ADD COLUMN deletedAt DATETIME(3) NULL` + index | ✅ Applied | Safe additive; existing active rows correctly have `NULL` |
| 5 | `20260302000005_f010_appointment_conflict_indexes` | Two `CREATE INDEX` composite indexes on `appointments` | ✅ Applied | Safe additive; InnoDB creates non-unique indexes online without table lock in MySQL 8.0 |

### Migration Anomalies & Drift Risks

**1. All migrations share the same calendar date (`20260302`).**  
All six migration timestamps are `20260302xxxxxx`, indicating a single-day roll-out rather than incremental evolution. This is not a bug, but means there is no migration history predating March 2, 2026. Any schema change before this date is not captured.

**2. `triggers.sql` is invisible to Prisma.**  
The file `prisma/migrations/20260302000001_f005_rating_score_check/triggers.sql` must be applied manually. Prisma's migration runner splits SQL on `;` which breaks `DELIMITER $$` syntax required for trigger bodies. **There is no automated check or CI step to verify this file was applied.** On a fresh environment targeting MySQL < 8.0.16, `score` validation will silently pass without this trigger.

**3. F-006 `name` sync has no DB-level enforcement.**  
Migration 2 is a one-time data fix. Future writes via raw SQL or any non-application path will re-introduce drift. See RISK-06 above.

**4. `prisma/init.sql` is outside Prisma migration control.**  
The file is executed by the MySQL Docker container entrypoint (`docker-compose.yml`). It currently contains only DB-level setup (charset, grants — no tables). This is safe, but must be kept free of table DDL. See RISK-12 above.

**5. No migration for dropping redundant indexes.**  
The four redundant indexes identified in RISK-04 were created in the `init` migration and have never been cleaned up. A follow-up migration is needed.

---

## Appendix — Recommended Follow-up Migrations

```sql
-- 1. Drop redundant indexes (RISK-04)
DROP INDEX `users_email_idx` ON `users`;
DROP INDEX `patient_profiles_userId_idx` ON `patient_profiles`;
DROP INDEX `doctor_profiles_userId_idx` ON `doctor_profiles`;
DROP INDEX `user_sessions_refreshTokenHash_idx` ON `user_sessions`;

-- 2. Add composite session lookup index (RISK-07)
CREATE INDEX `user_sessions_userId_expiresAt_idx` ON `user_sessions` (`userId`, `expiresAt`);

-- 3. Add isActive flag to DoctorProfile (RISK-02)
ALTER TABLE `doctor_profiles` ADD COLUMN `isActive` BOOLEAN NOT NULL DEFAULT TRUE;

-- 4. Add appointment duration (RISK-10)
ALTER TABLE `appointments` ADD COLUMN `durationMinutes` INTEGER NOT NULL DEFAULT 60;

-- 5. Add index on specialties.isActive (RISK-11)
CREATE INDEX `specialties_isActive_idx` ON `specialties` (`isActive`);
```

> All DDL above is additive / non-destructive. Test on a staging environment before applying to production.
