@echo off
setlocal enabledelayedexpansion

echo.
echo ========================================
echo Starting TinyLearn Development Environment
echo ========================================
echo.

REM Check if PHP is installed
php -v >nul 2>&1
if errorlevel 1 (
    echo ERROR: PHP is not installed or not in PATH
    pause
    exit /b 1
)

REM Check if Node.js is installed
node -v >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed or not in PATH
    pause
    exit /b 1
)

echo Starting services...
echo.

REM Start Laravel server
echo [1/4] Starting Laravel server on http://localhost:8000
start "Laravel Server" cmd /k "php artisan serve"
timeout /t 2 /nobreak

REM Start Reverb WebSocket server
echo [2/4] Starting Reverb WebSocket server on ws://localhost:8080
start "Reverb WebSocket" cmd /k "php artisan reverb:start"
timeout /t 2 /nobreak

REM Start Queue worker
echo [3/4] Starting Queue worker
start "Queue Worker" cmd /k "php artisan queue:work"
timeout /t 2 /nobreak

REM Start React dev server
echo [4/4] Starting React dev server on http://localhost:3000
start "React Dev Server" cmd /k "cd react && npm run dev"

echo.
echo ========================================
echo All services started!
echo ========================================
echo.
echo Services running:
echo   * Laravel API: http://localhost:8000
echo   * React App: http://localhost:3000
echo   * WebSocket: ws://localhost:8080
echo.
echo Test Credentials:
echo   * Admin: admin@example.com / password
echo   * Teacher: teacher@example.com / password
echo   * Student: student@example.com / password
echo.
echo Close any window to stop that service
echo.
pause
