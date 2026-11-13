# BORCELLE Digital Incident Reporting System Launcher
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host " Starting BORCELLE Digital Incident Reporting System..." -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Cyan

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptDir

# Check PostgreSQL port 5432
$portActive = (netstat -ano | Select-String ":5432\b")
if (-not $portActive) {
    Write-Host "[WARNING] PostgreSQL is not running on port 5432." -ForegroundColor Yellow
    Write-Host "Attempting to start postgresql-x64-18 service..." -ForegroundColor Gray
    try {
        Start-Service -Name "postgresql-x64-18" -ErrorAction SilentlyContinue
    } catch {}
    
    $portActiveNow = (netstat -ano | Select-String ":5432\b")
    if (-not $portActiveNow) {
        Write-Host ""
        Write-Host "[ATTENTION] Could not automatically start PostgreSQL service." -ForegroundColor Red
        Write-Host "If the app fails to connect to the database, please:" -ForegroundColor Yellow
        Write-Host "  1. Press Win + R, type 'services.msc', and press Enter."
        Write-Host "  2. Locate 'postgresql-x64-18' and click 'Start'."
        Write-Host "  3. Re-run this script."
        Write-Host ""
    } else {
        Write-Host "[SUCCESS] PostgreSQL service started successfully!" -ForegroundColor Green
    }
} else {
    Write-Host "[OK] PostgreSQL is active on port 5432." -ForegroundColor Green
}

Write-Host ""
Write-Host "Launching Spring Boot backend on http://localhost:8081 ..." -ForegroundColor Cyan
Write-Host "Press Ctrl+C to terminate." -ForegroundColor Gray
Write-Host ""

mvn spring-boot:run
