@echo off
REM Database Reset Script for Windows
REM This script will completely reset the database and seed with sample data

echo.
echo ====================================================================
echo    Database Reset Script
echo ====================================================================
echo.
echo WARNING: This will DELETE ALL data in the database!
echo.
set /p CONFIRM="Are you sure you want to continue? (yes/no): "

if /i not "%CONFIRM%"=="yes" (
    echo.
    echo Cancelled
    exit /b 1
)

echo.
echo [1/5] Stopping containers...
docker-compose down -v

echo.
echo [2/5] Starting MySQL container...
docker-compose up -d

echo.
echo [3/5] Waiting for MySQL to be ready...
timeout /t 15 /nobreak > nul

echo.
echo [4/5] Generating Prisma Client and running migrations...
call npx prisma generate
call npx prisma migrate deploy

echo.
echo [5/5] Seeding database with sample data...
call npx ts-node prisma/seed.ts

echo.
echo ====================================================================
echo    Database reset completed successfully!
echo ====================================================================
echo.
echo Next steps:
echo   1. Run: npm run dev
echo   2. Test login with sample accounts (see DATABASE_SETUP.md)
echo.
pause
