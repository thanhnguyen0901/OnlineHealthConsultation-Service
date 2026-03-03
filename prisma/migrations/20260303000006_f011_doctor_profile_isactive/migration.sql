-- Migration: f011_doctor_profile_isactive
-- Adds doctor_profiles.isActive (RISK-02 fix).
--
-- Rationale:
--   Previously the only gate for "is this doctor visible?" was joining
--   users.isActive + users.deletedAt.  Any query that touched doctor_profiles
--   directly (without the join) could leak deactivated doctors.
--   Adding an isActive column to doctor_profiles lets every query filter
--   on a single table without being forced to join users.
--
-- Backfill strategy:
--   Set isActive = users.isActive so existing rows are consistent from day 1.
--   After this migration the application code keeps the two columns in sync
--   via AdminService.updateUser() and AdminService.deleteUser().

-- Step 1: add column (nullable first so the ALTER is instant on large tables)
ALTER TABLE `doctor_profiles`
  ADD COLUMN `isActive` BOOLEAN NOT NULL DEFAULT true;

-- Step 2: back-fill from the authoritative users table
UPDATE `doctor_profiles` dp
  INNER JOIN `users` u ON dp.userId = u.id
  SET dp.isActive = u.isActive;

-- Step 3: index for fast public-listing queries
CREATE INDEX `doctor_profiles_isActive_idx`
  ON `doctor_profiles`(`isActive`);
