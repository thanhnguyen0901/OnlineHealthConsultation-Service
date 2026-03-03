-- RISK-09: Remodel Appointment → Rating from 1:many to 1:0..1.
--
-- Background: a rating is always tied to a specific completed appointment
-- and a specific patient.  Since each appointment belongs to exactly one
-- patient, the composite UNIQUE(appointmentId, patientId) is equivalent to
-- UNIQUE(appointmentId).  Making appointmentId itself UNIQUE:
--   • Enforces the business rule at the DB level (one rating per appointment).
--   • Lets Prisma model the relation as Appointment.rating Rating? (0..1)
--     instead of Appointment.ratings Rating[] (1:many).
--   • Removes one redundant index.
--
-- Zero-downtime: both steps use ALGORITHM=INPLACE, LOCK=NONE on MySQL 8 InnoDB.

-- Step 1: Add a unique index on appointmentId alone FIRST
--         (Prisma maps this to the @unique constraint that drives the 0..1 relation)
--         Must be created before dropping the composite key so any FK on
--         appointmentId remains satisfied throughout the migration.
ALTER TABLE `ratings`
  ADD UNIQUE INDEX `ratings_appointmentId_key` (`appointmentId`);

-- Step 2: Drop the old composite unique index
--         (safe now because the new index above covers the FK on appointmentId)
ALTER TABLE `ratings`
  DROP INDEX `ratings_appointmentId_patientId_key`;
