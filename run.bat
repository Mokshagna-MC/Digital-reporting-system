@echo off
title BORCELLE Digital Reporting System
echo ==========================================================
echo Starting BORCELLE Digital Incident Reporting System...
echo Database: Neon Serverless PostgreSQL (AWS Singapore)
echo ==========================================================

:: Change directory to digital-reporting-system-v2
cd /d "%~dp0\digital-reporting-system-v2"

echo.
echo Launching Spring Boot server on http://localhost:8081 ...
echo Press Ctrl+C at any time to stop the server.
echo.
mvn spring-boot:run
pause
