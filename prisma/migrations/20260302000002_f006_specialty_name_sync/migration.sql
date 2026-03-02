-- F-006: Enforce Specialty.name as a derived alias of nameEn.
--
-- Background:
--   The `specialties` table has three name columns:
--     name    – legacy column; historically the English name; has UNIQUE index.
--     nameEn  – authoritative English name (added during i18n work).
--     nameVi  – authoritative Vietnamese name.
--
--   Going forward, `name` is kept exclusively as a computed alias of `nameEn`
--   so that existing callers using ORDER BY name / UNIQUE(name) keep working
--   without a destructive DROP COLUMN migration.  Application code (admin.service.ts)
--   now auto-syncs name = nameEn on every INSERT and UPDATE.
--
-- This migration fixes any rows where name has drifted from nameEn.
UPDATE `specialties`
SET    `name` = `nameEn`
WHERE  `name` != `nameEn`;
