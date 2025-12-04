-- Initial database setup
-- This file is executed when the MySQL container is first created

-- Set character set and collation
ALTER DATABASE health_consultation_db CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- Grant privileges
GRANT ALL PRIVILEGES ON health_consultation_db.* TO 'healthuser'@'%';
FLUSH PRIVILEGES;
