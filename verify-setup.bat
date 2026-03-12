@echo off
REM TinyLearn Setup Verification Script for Windows

echo.
echo ========================================
echo TinyLearn LMS - Setup Verification
echo ========================================
echo.

REM Check PHP
echo [1/6] Checking PHP installation...
php -v >nul 2>&1
if %errorlevel% equ 0 (
    echo ✓ PHP is installed
    php -v | findstr /R "^PHP"
) else (
    echo ✗ PHP is NOT installed
    goto error
)

echo.

REM Check Composer
echo [2/6] Checking Composer installation...
composer --version >nul 2>&1
if %errorlevel% equ 0 (
    echo ✓ Composer is installed
    composer --version
) else (
    echo ✗ Composer is NOT installed
    goto error
)

echo.

REM Check Node.js
echo [3/6] Checking Node.js installation...
node --version >nul 2>&1
if %errorlevel% equ 0 (
    echo ✓ Node.js is installed
    node --version
) else (
    echo ✗ Node.js is NOT installed
    goto error
)

echo.

REM Check npm
echo [4/6] Checking npm installation...
npm --version >nul 2>&1
if %errorlevel% equ 0 (
    echo ✓ npm is installed
    npm --version
) else (
    echo ✗ npm is NOT installed
    goto error
)

echo.

REM Check .env file
echo [5/6] Checking environment files...
if exist ".env" (
    echo ✓ Backend .env exists
) else (
    echo ✗ Backend .env NOT found
    goto error
)

if exist "react\.env" (
    echo ✓ Frontend .env exists
) else (
    echo ✗ Frontend .env NOT found
    goto error
)

echo.

REM Check database connection
echo [6/6] Checking database configuration...
if exist "database\database.sqlite" (
    echo ✓ SQLite database file exists
) else (
    echo ℹ SQLite database not found (will be created on migration)
)

echo.
echo ========================================
echo ✓ All checks passed!
echo ========================================
echo.
echo Next steps:
echo 1. Run: composer install
echo 2. Run: cd react ^&^& npm install
echo 3. Run: php artisan migrate:fresh --seed
echo 4. Start services using start-dev.bat
echo.
pause
exit /b 0

:error
echo.
echo ========================================
echo ✗ Setup verification failed!
echo ========================================
echo.
echo Please install missing dependencies and try again.
echo.
pause
exit /b 1
