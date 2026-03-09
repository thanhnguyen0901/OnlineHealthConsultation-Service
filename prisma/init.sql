-- =============================================================================
-- prisma/init.sql — Docker MySQL bootstrap
-- =============================================================================
-- Executed ONCE by the MySQL Docker entrypoint on first container creation,
-- via: volumes: ./prisma/init.sql:/docker-entrypoint-initdb.d/init.sql
--
-- Responsibility: infrastructure bootstrap ONLY.
--   • Charset / collation for the database and this session.
--   • User accounts and privilege grants.
--   • Global server variables.
--
-- NOT responsible for:
--   • CREATE TABLE / ALTER TABLE / DROP TABLE  → prisma/migrations/
--   • CREATE INDEX / DROP INDEX                → prisma/migrations/
--   • Seed data                                → prisma/seed.ts
--
-- The CI check (scripts/check-init-sql.sh) enforces this boundary by failing
-- the build if any forbidden DDL keyword appears outside a comment line.
--
-- Idempotency:
--   init.sql runs only when the named volume is empty (fresh container).
--   Re-creating the container without wiping the volume does NOT re-run this
--   file.  Statements that could fail on a re-run use IF NOT EXISTS / IF EXISTS
--   guards as a safety net.
-- =============================================================================

-- Ensure this init session itself uses the project charset so that any
-- string literals here are transmitted correctly.
SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------------
-- Database charset / collation
-- ---------------------------------------------------------------------------
-- The database is already created by the Docker entrypoint via MYSQL_DATABASE.
-- We override the charset/collation here because the entrypoint uses the
-- server default (utf8mb4_0900_ai_ci on MySQL 8.0), whereas every table in
-- this project is created with utf8mb4_unicode_ci by Prisma migrations.
-- Setting it at the database level ensures new tables inherit the right
-- collation automatically.
ALTER DATABASE health_consultation_db
  CHARACTER SET  = utf8mb4
  COLLATE        = utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------------
-- User grants
-- ---------------------------------------------------------------------------
-- healthuser@% is already created by the Docker entrypoint (MYSQL_USER /
-- MYSQL_PASSWORD / MYSQL_DATABASE env vars).  Re-granting is idempotent and
-- makes this file self-documenting about what access the app user has.
GRANT ALL PRIVILEGES ON health_consultation_db.* TO 'healthuser'@'%';

-- root@% is NOT created by the Docker entrypoint (it only creates root@localhost).
-- The application DATABASE_URL connects as root, and connections from the host
-- (or from docker exec) originate from '%', so we need this account explicitly.
CREATE USER IF NOT EXISTS 'root'@'%' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON *.* TO 'root'@'%' WITH GRANT OPTION;

FLUSH PRIVILEGES;
