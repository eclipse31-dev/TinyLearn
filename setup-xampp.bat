@echo off
setlocal enabledelayedexpansion

echo.
echo ========================================
echo TinyLearn - XAMPP Database Setup
echo ========================================
echo.

REM Check if MySQL is running
echo Checking MySQL connection...
mysql -u root -e "SELECT 1" >nul 2>&1
if errorlevel 1 (
    echo.
    echo ERROR: MySQL is not running!
    echo.
    echo Please start MySQL in XAMPP Control Panel first.
    echo.
    pause
    exit /b 1
)

echo ✓ MySQL is running
echo.

REM Create database
echo Creating database 'tinylearn'...
mysql -u root -e "CREATE DATABASE IF NOT EXISTS tinylearn CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
if errorlevel 1 (
    echo ERROR: Failed to create database
    pause
    exit /b 1
)
echo ✓ Database created

echo.
echo Running migrations...
php artisan migrate:fresh --seed
if errorlevel 1 (
    echo ERROR: Migration failed
    pause
    exit /b 1
)
echo ✓ Migrations completed

echo.
echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo Database: tinylearn
echo Host: 127.0.0.1
echo Port: 3306
echo Username: root
echo Password: (empty)
echo.
echo Test Credentials:
echo   Admin: admin@example.com / password
echo   Teacher: teacher@example.com / password
echo   Student: student@example.com / password
echo.
echo Next: Run start-dev.bat to start the application
echo.
pause
