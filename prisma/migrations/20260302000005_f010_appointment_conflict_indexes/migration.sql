-- F-010: Add composite indexes to appointments for efficient overlap conflict detection.
--
-- The overlap query in patient.service.ts filters on:
--   (doctorId,  status, scheduledAt)  -- doctor conflict check
--   (patientId, status, scheduledAt)  -- patient conflict check
--
-- Single-column indexes on doctorId, status, and scheduledAt exist from the
-- initial migration but MySQL can only use one per query unless they are
-- combined into a compound index.  These compound indexes allow MySQL to
-- satisfy both the equality predicates (doctorId/patientId + status IN (...))
-- and the range predicate (scheduledAt BETWEEN ...) using a single index
-- range scan instead of three separate index merges.

CREATE INDEX `appointments_doctorId_status_scheduledAt_idx`
    ON `appointments` (`doctorId`, `status`, `scheduledAt`);

CREATE INDEX `appointments_patientId_status_scheduledAt_idx`
    ON `appointments` (`patientId`, `status`, `scheduledAt`);
