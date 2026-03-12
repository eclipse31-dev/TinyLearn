@echo off
REM TinyLearn Database Import Script for Windows XAMPP

echo.
echo ========================================
echo TinyLearn Database Import
echo ========================================
echo.

REM Check if MySQL is available
where mysql >nul 2>&1
if %errorlevel% neq 0 (
    echo ✗ MySQL not found in PATH
    echo.
    echo Please ensure:
    echo 1. XAMPP is installed
    echo 2. MySQL is running
    echo 3. MySQL bin folder is in PATH
    echo.
    pause
    exit /b 1
)

echo ✓ MySQL found
echo.

REM Check if SQL file exists
if not exist "create_database.sql" (
    echo ✗ create_database.sql not found
    echo.
    echo Please ensure create_database.sql is in the current directory
    echo.
    pause
    exit /b 1
)

echo ✓ SQL file found
echo.

REM Ask user for confirmation
echo This will import the TinyLearn database.
echo.
echo Database: tinylearn
echo Tables: 25
echo Test Users: 2 (admin@example.com, kusa_230000002006@uic.edu.ph)
echo.
set /p confirm="Continue? (y/n): "
if /i not "%confirm%"=="y" (
    echo Import cancelled.
    pause
    exit /b 0
)

echo.
echo Importing database...
echo.

REM Import the database
mysql -u root -p tinylearn < create_database.sql

if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo ✓ Database imported successfully!
    echo ========================================
    echo.
    echo Next steps:
    echo 1. Verify import: php artisan tinker
    echo 2. Start backend: php artisan serve
    echo 3. Start frontend: cd react ^&^& npm run dev
    echo 4. Login: http://localhost:5173
    echo.
    echo Test credentials:
    echo Email: admin@example.com
    echo Password: password
    echo.
) else (
    echo.
    echo ========================================
    echo ✗ Import failed!
    echo ========================================
    echo.
    echo Troubleshooting:
    echo 1. Ensure MySQL is running
    echo 2. Check database credentials
    echo 3. Try importing via phpMyAdmin instead
    echo.
)

pause
