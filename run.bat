@echo off
title BORCELLE Digital Reporting System
echo ==========================================================
echo Starting BORCELLE Digital Incident Reporting System...
echo ==========================================================

cd /d "%~dp0"

:: Check if port 5432 is listening
netstat -ano | findstr /r ":5432\>" >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [WARNING] PostgreSQL is not running on port 5432.
    echo Attempting to start postgresql-x64-18 service...
    net start postgresql-x64-18 >nul 2>&1
    netstat -ano | findstr /r ":5432\>" >nul 2>&1
    if %ERRORLEVEL% NEQ 0 (
        echo.
        echo [ATTENTION] PostgreSQL service could not be auto-started without Admin rights.
        echo If the app fails with a database connection error, please:
        echo   1. Press Win + R, type services.msc, and press Enter.
        echo   2. Find 'postgresql-x64-18' and click 'Start'.
        echo.
    ) else (
        echo [SUCCESS] PostgreSQL service started successfully!
    )
) else (
    echo [OK] PostgreSQL is active on port 5432.
)

echo.
echo Launching Spring Boot server on http://localhost:8081 ...
echo Press Ctrl+C at any time to stop the server.
echo.
mvn spring-boot:run
pause
