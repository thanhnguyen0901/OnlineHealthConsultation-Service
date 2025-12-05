-- Initial database setup
-- This file is executed when the MySQL container is first created

-- Set character set and collation
ALTER DATABASE health_consultation_db CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

-- Grant privileges to healthuser
GRANT ALL PRIVILEGES ON health_consultation_db.* TO 'healthuser'@'%';

-- Grant privileges to root from any host
CREATE USER IF NOT EXISTS 'root'@'%' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON *.* TO 'root'@'%' WITH GRANT OPTION;

FLUSH PRIVILEGES;
