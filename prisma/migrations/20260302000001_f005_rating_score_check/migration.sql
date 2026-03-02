-- F-005: Enforce ratings.score BETWEEN 1 AND 5 at the database level.
--
-- MySQL compatibility notes:
--   MySQL >= 8.0.16  – CHECK constraints are parsed AND enforced by InnoDB.
--                      The ALTER TABLE below is the primary enforcement mechanism.
--   MySQL 5.7 / 8.0 < 8.0.16 – CHECK constraints are parsed but silently ignored.
--                      For those versions apply the companion trigger file manually:
--                      prisma/migrations/20260302000001_f005_rating_score_check/triggers.sql
--
-- This project targets mysql:8.0 (docker-compose.yml), so the CHECK constraint
-- is sufficient.  The trigger file exists as a defensive fallback.

-- Add CHECK constraint on scores column
ALTER TABLE `ratings`
    ADD CONSTRAINT `chk_ratings_score` CHECK (`score` BETWEEN 1 AND 5);
