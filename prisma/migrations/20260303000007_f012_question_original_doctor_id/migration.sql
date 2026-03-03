-- Migration: f012_question_original_doctor_id
-- RISK-03 fix: preserve assignment history when doctorId is SET NULL.
--
-- Root cause
-- ----------
-- questions.doctorId is nullable with ON DELETE SET NULL.  A hard-delete of a
-- DoctorProfile (triggered, e.g., via the User ON DELETE CASCADE chain) silently
-- nulls doctorId, permanently erasing which doctor a question was assigned to.
--
-- Why we did NOT change to RESTRICT
-- -----------------------------------
-- users → doctor_profiles already carries ON DELETE CASCADE.  Adding RESTRICT on
-- questions.doctorId → doctor_profiles would create an unresolvable deadlock:
-- hard-deleting a User would cascade-delete DoctorProfile, but RESTRICT would
-- block that deletion whenever assigned questions exist.  prisma migrate reset
-- would also fail.
--
-- Chosen fix: immutable originalDoctorId audit column
-- -----------------------------------------------------
-- originalDoctorId is written once at question creation (= doctorId at that
-- moment) and is never updated afterwards.  It has no FK constraint — it is
-- plain audit data that outlives any doctor lifecycle event.
--
-- Backfill: copy the current doctorId value for all existing rows so the audit
-- trail is populated from day 1.

-- Step 1: add the column
ALTER TABLE `questions`
  ADD COLUMN `originalDoctorId` CHAR(36) NULL DEFAULT NULL;

-- Step 2: back-fill from the live doctorId
--   Only rows where doctorId is still set can be back-filled; rows that were
--   already NULL'd by a past hard-delete cannot be recovered (that is the very
--   bug this migration prevents going forward).
UPDATE `questions`
  SET `originalDoctorId` = `doctorId`
  WHERE `doctorId` IS NOT NULL;

-- Step 3: index for audit queries ("show all questions ever assigned to doctor X")
CREATE INDEX `questions_originalDoctorId_idx`
  ON `questions`(`originalDoctorId`);
