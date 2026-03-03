-- Migration: f013_index_cleanup
--
-- RISK-04 — Drop indexes that are strict duplicates of existing UNIQUE indexes.
--   MySQL automatically creates a B-tree index to enforce each UNIQUE constraint,
--   so a separate @@index on the same single column is pure write overhead with no
--   read benefit.  Removing these reduces per-write cost and InnoDB buffer-pool
--   pressure on every INSERT / UPDATE / DELETE.
--
-- RISK-07 — Replace the plain user_sessions(userId) index with a composite index
--   (userId, revokedAt, expiresAt) that covers the most common active-session
--   query pattern:
--     SELECT * FROM user_sessions
--     WHERE userId = ? AND revokedAt IS NULL AND expiresAt > NOW();
--   With MySQL 8 InnoDB the "revokedAt IS NULL" predicate benefits from the
--   index because NULL values are indexed and can be range-filtered.
--   The leading userId column also satisfies bare userId-only lookups, so the
--   old plain index can be dropped without regressing any existing query.
--   The standalone expiresAt index is kept for the session-cleanup job which
--   does a range scan on expiry without filtering by userId.
--
-- RISK-11 — Add index on specialties(isActive) to speed up the isActive=true
--   filter used in public specialty listings and in specialty assignment
--   validation (admin + doctor profile updates).
--
-- Zero-downtime notes (MySQL 8 InnoDB, Online DDL):
--   * All CREATE INDEX / DROP INDEX statements below execute with the default
--     ALGORITHM=INPLACE + LOCK=NONE on InnoDB in MySQL 8, meaning the table
--     remains fully readable and writable throughout.
--   * No table rebuild is triggered.
--   * Safe to run against a live production instance.

-- ─── RISK-07: composite index for active-session lookup ─────────────────────
-- Create FIRST so MySQL's FK on user_sessions.userId remains satisfied
-- before we drop the plain userId index below.
--
-- Covers: WHERE userId = ? AND revokedAt IS NULL AND expiresAt > NOW()
-- Also covers: bare WHERE userId = ? (leading-column prefix rule)
SET @exists = (SELECT COUNT(*) FROM information_schema.STATISTICS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'user_sessions' AND INDEX_NAME = 'user_sessions_active_session_idx');
SET @sql = IF(@exists = 0, 'CREATE INDEX `user_sessions_active_session_idx` ON `user_sessions`(`userId`, `revokedAt`, `expiresAt`)', 'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- ─── RISK-04: drop redundant single-column indexes (conditionally) ──────────
-- MySQL has no DROP INDEX IF EXISTS; use prepared statements to skip safely.

-- users.email: duplicate of UNIQUE INDEX users_email_key
SET @exists = (SELECT COUNT(*) FROM information_schema.STATISTICS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'users' AND INDEX_NAME = 'users_email_idx');
SET @sql = IF(@exists > 0, 'DROP INDEX `users_email_idx` ON `users`', 'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- patient_profiles.userId: duplicate of UNIQUE INDEX patient_profiles_userId_key
SET @exists = (SELECT COUNT(*) FROM information_schema.STATISTICS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'patient_profiles' AND INDEX_NAME = 'patient_profiles_userId_idx');
SET @sql = IF(@exists > 0, 'DROP INDEX `patient_profiles_userId_idx` ON `patient_profiles`', 'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- doctor_profiles.userId: duplicate of UNIQUE INDEX doctor_profiles_userId_key
SET @exists = (SELECT COUNT(*) FROM information_schema.STATISTICS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'doctor_profiles' AND INDEX_NAME = 'doctor_profiles_userId_idx');
SET @sql = IF(@exists > 0, 'DROP INDEX `doctor_profiles_userId_idx` ON `doctor_profiles`', 'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- user_sessions.refreshTokenHash: duplicate of UNIQUE INDEX user_sessions_refreshTokenHash_key
SET @exists = (SELECT COUNT(*) FROM information_schema.STATISTICS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'user_sessions' AND INDEX_NAME = 'user_sessions_refreshTokenHash_idx');
SET @sql = IF(@exists > 0, 'DROP INDEX `user_sessions_refreshTokenHash_idx` ON `user_sessions`', 'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- user_sessions.userId (plain): superseded by the composite index created above
-- The FK on userId is now covered by user_sessions_active_session_idx (leading column = userId)
SET @exists = (SELECT COUNT(*) FROM information_schema.STATISTICS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'user_sessions' AND INDEX_NAME = 'user_sessions_userId_idx');
SET @sql = IF(@exists > 0, 'DROP INDEX `user_sessions_userId_idx` ON `user_sessions`', 'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- ─── RISK-11: specialties.isActive index ────────────────────────────────────

SET @exists = (SELECT COUNT(*) FROM information_schema.STATISTICS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'specialties' AND INDEX_NAME = 'specialties_isActive_idx');
SET @sql = IF(@exists = 0, 'CREATE INDEX `specialties_isActive_idx` ON `specialties`(`isActive`)', 'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;
