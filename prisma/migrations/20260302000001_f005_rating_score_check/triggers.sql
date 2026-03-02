-- ============================================================
-- Trigger-based score enforcement for MySQL < 8.0.16
-- ============================================================
-- Purpose : fallback for environments where the CHECK constraint
--           in migration.sql is silently ignored (MySQL 5.7 or
--           MySQL 8.0 < 8.0.16).
--
-- Usage   : apply manually via a MySQL client that supports
--           DELIMITER changes (mysql CLI, DBeaver, MySQL Workbench):
--
--   mysql -u <user> -p <database> < triggers.sql
--
-- This file is NOT executed by `prisma migrate`.  The Prisma
-- migration runner splits on ";" before sending each SQL statement,
-- which breaks compound trigger bodies that also contain ";".
-- Prisma's own documentation recommends applying such DDL manually.
-- ============================================================

DELIMITER $$

-- BEFORE INSERT: reject score outside [1, 5]
CREATE TRIGGER `trg_ratings_score_bi`
BEFORE INSERT ON `ratings`
FOR EACH ROW
BEGIN
  IF NEW.score < 1 OR NEW.score > 5 THEN
    SIGNAL SQLSTATE '45000'
      SET MESSAGE_TEXT = 'ratings.score must be between 1 and 5';
  END IF;
END$$

-- BEFORE UPDATE: reject score outside [1, 5]
CREATE TRIGGER `trg_ratings_score_bu`
BEFORE UPDATE ON `ratings`
FOR EACH ROW
BEGIN
  IF NEW.score < 1 OR NEW.score > 5 THEN
    SIGNAL SQLSTATE '45000'
      SET MESSAGE_TEXT = 'ratings.score must be between 1 and 5';
  END IF;
END$$

DELIMITER ;
