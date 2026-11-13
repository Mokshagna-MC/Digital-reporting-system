# BORCELLE Digital Incident Reporting System Launcher
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host " Starting BORCELLE Digital Incident Reporting System..." -ForegroundColor Green
Write-Host " Database: Neon Serverless PostgreSQL (AWS Singapore)" -ForegroundColor Yellow
Write-Host "==========================================================" -ForegroundColor Cyan

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$projectDir = Join-Path $scriptDir "digital-reporting-system-v2"
Set-Location $projectDir

Write-Host ""
Write-Host "Launching Spring Boot backend on http://localhost:8081 ..." -ForegroundColor Cyan
Write-Host "Press Ctrl+C to terminate." -ForegroundColor Gray
Write-Host ""

mvn spring-boot:run
