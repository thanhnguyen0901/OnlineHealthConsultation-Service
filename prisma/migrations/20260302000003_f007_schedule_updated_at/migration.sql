-- F-007: Add scheduleUpdatedAt column to doctor_profiles.
--
-- The schedule column already exists as TEXT.  This migration adds a nullable
-- timestamp that is set by application code (doctor.service.ts) on every
-- schedule write, providing an audit trail of when the schedule was last changed.

ALTER TABLE `doctor_profiles`
    ADD COLUMN `scheduleUpdatedAt` DATETIME(3) NULL;
