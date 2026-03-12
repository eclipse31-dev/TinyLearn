@echo off
REM TinyLearn - Start All Services

echo.
echo ========================================
echo TinyLearn LMS - Starting All Services
echo ========================================
echo.

REM Check if services are already running
tasklist | find /i "php.exe" >nul
if %errorlevel% equ 0 (
    echo ℹ PHP server already running
) else (
    echo Starting Laravel backend...
    start "Laravel Backend" cmd /k "php artisan serve"
    timeout /t 2 /nobreak
)

tasklist | find /i "node.exe" >nul
if %errorlevel% equ 0 (
    echo ℹ Node.js already running
) else (
    echo Starting React frontend...
    start "React Frontend" cmd /k "cd react && npm run dev"
    timeout /t 2 /nobreak
)

echo.
echo ========================================
echo Services starting...
echo ========================================
echo.
echo Backend:  http://localhost:8000
echo Frontend: http://localhost:5173
echo.
echo Press Ctrl+C in any terminal to stop services
echo.
pause
