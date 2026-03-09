-- ============================================================
-- Session Diagnostics — OnlineHealthConsultation-Service
-- Run these inside the MariaDB container or any client connected
-- to the dev database.
-- ============================================================

-- ── 1. Active sessions for a specific user ──────────────────
-- Replace '<userId>' with the userId shown in the dev logs.
SELECT
  id                          AS sessionId,
  LEFT(refreshTokenHash, 16)  AS hash_prefix,
  expiresAt,
  lastUsedAt,
  createdAt
FROM user_sessions
WHERE
  userId    = '<userId>'
  AND revokedAt IS NULL
  AND expiresAt > NOW()
ORDER BY createdAt DESC;

-- ── 2. Full session history for a user (all states) ─────────
SELECT
  id                          AS sessionId,
  userId,
  LEFT(refreshTokenHash, 16)  AS hash_prefix,
  expiresAt,
  revokedAt,
  rotatedAt,
  lastUsedAt,
  createdAt
FROM user_sessions
WHERE userId = '<userId>'
ORDER BY createdAt DESC
LIMIT 50;

-- ── 3. Active vs total count per user ───────────────────────
SELECT
  userId,
  COUNT(*)                                               AS total,
  SUM(revokedAt IS NULL AND expiresAt > NOW())           AS active,
  SUM(revokedAt IS NOT NULL)                             AS revoked,
  SUM(revokedAt IS NULL AND expiresAt <= NOW())          AS expired
FROM user_sessions
GROUP BY userId
ORDER BY active DESC;

-- ── 4. Latest 20 rows across all users ──────────────────────
-- Spot-check DB growth after a series of reloads.
SELECT
  id                          AS sessionId,
  userId,
  LEFT(refreshTokenHash, 16)  AS hash_prefix,
  expiresAt,
  revokedAt,
  rotatedAt,
  createdAt
FROM user_sessions
ORDER BY createdAt DESC
LIMIT 20;

-- ── 5. Confirm a specific rotation pair ─────────────────────
-- Given an old sessionId from the [auth:session] rotation-done log:
--   old_sessionId → should have revokedAt IS NOT NULL, rotatedAt IS NOT NULL
--   new_sessionId → should have revokedAt IS NULL
SELECT
  id                          AS sessionId,
  LEFT(refreshTokenHash, 16)  AS hash_prefix,
  revokedAt,
  rotatedAt,
  expiresAt,
  createdAt
FROM user_sessions
WHERE id IN ('<old_sessionId>', '<new_sessionId>');

-- ── 6. Detect orphaned / never-rotated long-lived sessions ──
-- Sessions older than 7 days that were never revoked — should be empty
-- if cleanupUserSessions() is running correctly.
SELECT
  id                          AS sessionId,
  userId,
  LEFT(refreshTokenHash, 16)  AS hash_prefix,
  expiresAt,
  createdAt
FROM user_sessions
WHERE
  revokedAt IS NULL
  AND expiresAt < NOW()
ORDER BY expiresAt ASC
LIMIT 20;

-- ── 7. Quick health check ────────────────────────────────────
SELECT
  COUNT(*)                                               AS total_rows,
  SUM(revokedAt IS NULL AND expiresAt > NOW())           AS currently_active,
  SUM(revokedAt IS NOT NULL)                             AS rotated_or_revoked,
  SUM(revokedAt IS NULL AND expiresAt <= NOW())          AS expired_not_cleaned
FROM user_sessions;
