-- Migration: f014_doctor_schedule_json_column
-- RISK-05: Change doctor_profiles.schedule from TEXT to MySQL JSON type.
--
-- Why JSON over TEXT
-- ------------------
-- 1. MySQL 8 JSON type validates that the stored value is well-formed JSON on
--    every INSERT / UPDATE.  Previously, any non-JSON string could be silently
--    stored in the TEXT column.
-- 2. Native JSON storage uses an optimised binary representation internally,
--    which is faster to parse than deserialising a raw text string.
-- 3. The column participates in Prisma's Json? mapping, removing the need for
--    manual JSON.parse / JSON.stringify in application code.
-- 4. Future JSON path queries (e.g. schedule->'$.date' indexes) become possible
--    without a column type change.
--
-- Backward-compatibility / data migration
-- ----------------------------------------
-- Existing rows may contain:
--   a) NULL           — no schedule set yet; remains NULL.
--   b) Valid JSON     — CAST succeeds; value preserved verbatim.
--   c) Invalid JSON   — SET NULL to avoid a hard error on ALTER.
--       This case should not exist in practice (app code always wrote via
--       JSON.stringify), but the guard is included for safety.
--
-- Step 1: NULL out any rows whose TEXT value is not valid JSON.
--         JSON_VALID() returns 1 for well-formed JSON, 0 / NULL otherwise.
UPDATE `doctor_profiles`
  SET `schedule` = NULL
  WHERE `schedule` IS NOT NULL
    AND JSON_VALID(`schedule`) = 0;

-- Step 2: Change the column type TEXT → JSON.
--         MySQL 8 InnoDB performs this ALTER with ALGORITHM=INPLACE, LOCK=NONE
--         when converting TEXT → JSON as long as the column values are already
--         valid JSON (guaranteed by Step 1 above).
--         The table remains fully readable and writable throughout.
ALTER TABLE `doctor_profiles`
  MODIFY COLUMN `schedule` JSON NULL;
