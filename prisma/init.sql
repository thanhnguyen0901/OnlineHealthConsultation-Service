-- Initial database setup
-- This file is executed ONCE when the MySQL Docker container is first created
-- (via the docker-compose volumes: ./prisma/init.sql:/docker-entrypoint-initdb.d/init.sql).
--
-- ╔══════════════════════════════════════════════════════════════════════════╗
-- ║  POLICY — what belongs here (RISK-12)                                  ║
-- ║                                                                          ║
-- ║  ALLOWED                                                                 ║
-- ║    • ALTER DATABASE  (charset/collation)                                 ║
-- ║    • CREATE USER / GRANT / FLUSH PRIVILEGES  (DB account bootstrap)     ║
-- ║    • SET global variables                                                ║
-- ║                                                                          ║
-- ║  FORBIDDEN — use Prisma migrations instead                               ║
-- ║    • CREATE TABLE  →  prisma/migrations/<version>/migration.sql         ║
-- ║    • ALTER TABLE   →  ibid                                               ║
-- ║    • DROP TABLE    →  ibid                                               ║
-- ║    • CREATE INDEX  →  ibid                                               ║
-- ║                                                                          ║
-- ║  A CI check (scripts/check-init-sql.sh) enforces this policy by         ║
-- ║  grepping for forbidden DDL keywords and failing the pipeline if found.  ║
-- ╚══════════════════════════════════════════════════════════════════════════╝

-- Set character set and collation
ALTER DATABASE health_consultation_db CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- Grant privileges to healthuser
GRANT ALL PRIVILEGES ON health_consultation_db.* TO 'healthuser'@'%';

-- Grant privileges to root from any host
CREATE USER IF NOT EXISTS 'root'@'%' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON *.* TO 'root'@'%' WITH GRANT OPTION;

FLUSH PRIVILEGES;
