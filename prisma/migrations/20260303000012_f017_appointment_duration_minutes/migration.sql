-- RISK-10: Add durationMinutes to appointments.
--
-- Background: conflict detection previously used a global env var
-- (APPOINTMENT_DURATION_MINUTES) as the assumed slot size for ALL
-- appointments.  This meant the window was shared even if different
-- appointments had different intended durations.
--
-- Storing durationMinutes per-row lets the overlap check in
-- createAppointment() use the real duration of each existing slot, giving
-- accurate conflict detection even when slot lengths vary.
--
-- Default 60 min backfills all existing rows.  New appointments carry the
-- value supplied by the API caller (or the same default when omitted).
--
-- Online DDL: ADD COLUMN with DEFAULT is instantaneous on MySQL 8 InnoDB
-- (metadata-only change when the column is NOT NULL with a constant default).

ALTER TABLE `appointments`
  ADD COLUMN `durationMinutes` INT NOT NULL DEFAULT 60
  AFTER `scheduledAt`;
