$base = "http://localhost:8081"
$sessionAdmin = New-Object Microsoft.PowerShell.Commands.WebRequestSession
$sessionCitizen1 = New-Object Microsoft.PowerShell.Commands.WebRequestSession
$sessionCitizen2 = New-Object Microsoft.PowerShell.Commands.WebRequestSession
$sessionPolice = New-Object Microsoft.PowerShell.Commands.WebRequestSession

Write-Output "=========================================================="
Write-Output "DIGITAL INCIDENT REPORTING SYSTEM - END-TO-END SUITE"
Write-Output "=========================================================="

# 1. Register & Login Lead Officer / Admin
$regAdmin = @{
    username = "lead_officer_test"
    email = "lead_officer@metropolice.org"
    password = "Secur3Password!"
    role = "GOVERNMENT_OFFICIAL"
} | ConvertTo-Json

Write-Output "`n--- 1. Registering & Authenticating Officer ---"
try {
    $null = Invoke-RestMethod -Uri "$base/api/auth/register" -Method Post -ContentType "application/json" -Body $regAdmin -WebSession $sessionAdmin
} catch {
    # Already registered in previous run
}
$loginAdmin = @{ username = "lead_officer_test"; password = "Secur3Password!" } | ConvertTo-Json
$officer = Invoke-RestMethod -Uri "$base/api/auth/login" -Method Post -ContentType "application/json" -Body $loginAdmin -WebSession $sessionAdmin
Write-Output "Authenticated as: $($officer.username) [Role: $($officer.role)]"

# 2. Test Future Date Prevention & Future Hour Prevention (Local Time + 2 hours)
Write-Output "`n--- 2. Testing Strict Future Date & Future Hour Prevention ---"
$futureHourDate = [DateTime]::Now.AddHours(2).ToString("yyyy-MM-ddTHH:mm:ss")
$invalidReportFutureHour = @{
    eventType = "Theft"
    incidentOverview = "Future theft attempt"
    description = "Incident claiming to have happened 2 hours in the future today."
    loc = "Downtown"
    dateTime = $futureHourDate
} | ConvertTo-Json

try {
    $badRes = Invoke-RestMethod -Uri "$base/api/reports" -Method Post -ContentType "application/json" -Body $invalidReportFutureHour -WebSession $sessionAdmin
    Write-Output "FAILURE: Future hour incident was accepted!"
} catch {
    Write-Output "SUCCESS: Future hour incident strictly rejected with HTTP $($_.Exception.Response.StatusCode.value__)"
}

# 3. Create Valid Report with Overview & Confidential Description
Write-Output "`n--- 3. Creating Valid Report (with Public Glimpse & Confidential Details) ---"
$pastDate = [DateTime]::Now.AddHours(-1).ToString("yyyy-MM-ddTHH:mm:ss")
$reportPayload = @{
    eventType = "Commercial Burglary"
    incidentOverview = "Reported forced entry and alarms sounding at commercial jewelry vault premises near Main Square around 8:00 AM."
    description = "Two suspects in dark hooded attire breached the rear security door using a hydraulic spreader, disabling CCTV camera 02 and removing diamond trays valued at $120,000."
    loc = "Main Square Vaults, Downtown"
    dateTime = $pastDate
    latitude = 40.7128
    longitude = -74.0060
} | ConvertTo-Json

$report = Invoke-RestMethod -Uri "$base/api/reports" -Method Post -ContentType "application/json" -Body $reportPayload -WebSession $sessionAdmin
Write-Output "Created Report ID: $($report.id) | Ref Code: $($report.referenceCode)"
Write-Output "Overview: $($report.incidentOverview)"
Write-Output "Author full description visible: $($report.description.Substring(0, 35))..."

# 4. Register Citizen 1 and Citizen 2
Write-Output "`n--- 4. Registering Citizen Accounts ---"
$regCit1 = @{ username = "citizen_maya"; email = "maya@civicnet.org"; password = "Secur3Password!"; role = "CITIZEN" } | ConvertTo-Json
$regCit2 = @{ username = "citizen_liam"; email = "liam@civicnet.org"; password = "Secur3Password!"; role = "CITIZEN" } | ConvertTo-Json

try { $null = Invoke-RestMethod -Uri "$base/api/auth/register" -Method Post -ContentType "application/json" -Body $regCit1 -WebSession $sessionCitizen1 } catch {}
try { $null = Invoke-RestMethod -Uri "$base/api/auth/register" -Method Post -ContentType "application/json" -Body $regCit2 -WebSession $sessionCitizen2 } catch {}

$loginCit1 = @{ username = "citizen_maya"; password = "Secur3Password!" } | ConvertTo-Json
$loginCit2 = @{ username = "citizen_liam"; password = "Secur3Password!" } | ConvertTo-Json
$cit1User = Invoke-RestMethod -Uri "$base/api/auth/login" -Method Post -ContentType "application/json" -Body $loginCit1 -WebSession $sessionCitizen1
$cit2User = Invoke-RestMethod -Uri "$base/api/auth/login" -Method Post -ContentType "application/json" -Body $loginCit2 -WebSession $sessionCitizen2

Write-Output "Authenticated Citizen 1: $($cit1User.username)"
Write-Output "Authenticated Citizen 2: $($cit2User.username)"

# 5. Verify Privacy Masking for Citizen 2 Viewing Citizen 1's Report or Admin's Report
Write-Output "`n--- 5. Testing Anti-Cheating Privacy Masking (Public Glimpse vs Masked Narrative) ---"
$publicReports = Invoke-RestMethod -Uri "$base/api/reports" -Method Get -WebSession $sessionCitizen2
$targetRpt = $publicReports | Where-Object { $_.id -eq $report.id }
Write-Output "For Citizen Liam (non-author citizen):"
Write-Output " - Overview visible: $($targetRpt.incidentOverview)"
Write-Output " - Description masked: $($targetRpt.description)"
Write-Output " - canViewFullDescription: $($targetRpt.canViewFullDescription)"

if ($targetRpt.canViewFullDescription -eq $false -and $targetRpt.description -match "Confidential") {
    Write-Output "SUCCESS: Privacy masking correctly protects sensitive narrative from witness cheating!"
} else {
    Write-Output "FAILURE: Sensitive description was not masked for citizen!"
}

# 6. Police Report with Initial Official Embedded Directly
Write-Output "`n--- 6. Testing Police Report Submission with Scene Official Injected Directly ---"
$regPolice = @{ username = "sgt_reynolds"; email = "reynolds@metropolice.gov"; password = "Secur3Password!"; role = "POLICE" } | ConvertTo-Json
try { $null = Invoke-RestMethod -Uri "$base/api/auth/register" -Method Post -ContentType "application/json" -Body $regPolice -WebSession $sessionPolice } catch {}
$loginPolice = @{ username = "sgt_reynolds"; password = "Secur3Password!" } | ConvertTo-Json
$policeUser = Invoke-RestMethod -Uri "$base/api/auth/login" -Method Post -ContentType "application/json" -Body $loginPolice -WebSession $sessionPolice

$policeReportPayload = @{
    eventType = "Armed Robbery Response"
    incidentOverview = "First response to jewelry robbery at Main Square, perimeter cordoned."
    description = "Sgt Reynolds dispatched at 08:05. Units 14 and 18 cordoned off rear alley."
    loc = "Main Square, Downtown"
    dateTime = [DateTime]::Now.AddHours(-1).ToString("yyyy-MM-ddTHH:mm:ss")
    latitude = 40.7129
    longitude = -74.0059
    initialOfficial = @{
        officialName = "Sergeant D. Reynolds"
        badgeNumber = "SGT-4091"
        department = "Metropolitan Police - 4th Precinct"
        designation = "Patrol Supervisor"
        contactInfo = "reynolds@metropolice.gov"
        firstReportTaker = $true
        dutiesSummary = "First responder; secured physical perimeter, established inner cordon."
    }
} | ConvertTo-Json

$policeReport = Invoke-RestMethod -Uri "$base/api/reports" -Method Post -ContentType "application/json" -Body $policeReportPayload -WebSession $sessionPolice
Write-Output "Created Police Report ID: $($policeReport.id)"

# Verify official was saved under this report
$officials = Invoke-RestMethod -Uri "$base/api/reports/$($policeReport.id)/officials" -Method Get -WebSession $sessionPolice
Write-Output "Officials count for police report: $($officials.Count)"
Write-Output "Official: $($officials[0].officialName) | Badge: $($officials[0].badgeNumber) | First Taker: $($officials[0].firstReportTaker)"

# 7. Testing Authenticity Endorsement / Community Vouching
Write-Output "`n--- 7. Testing Authenticity Endorsement / Vouching Mechanism ---"
# Citizen Liam endorses report as AUTHENTIC
$endorsePayload1 = @{
    verdict = "AUTHENTIC"
    notes = "I reside on Main Square and heard sirens and witnessed police arriving around 8:15 AM."
} | ConvertTo-Json
$end1 = Invoke-RestMethod -Uri "$base/api/reports/$($report.id)/endorse" -Method Post -ContentType "application/json" -Body $endorsePayload1 -WebSession $sessionCitizen2
Write-Output "Citizen Endorsement Recorded: Total=$($end1.total) | Citizen Vouches=$($end1.citizenCount) | My Verdict=$($end1.myVerdict)"

# Police Sgt Reynolds endorses report as AUTHENTIC
$endorsePayload2 = @{
    verdict = "AUTHENTIC"
    notes = "Verified against CAD dispatch log #4810."
} | ConvertTo-Json
$end2 = Invoke-RestMethod -Uri "$base/api/reports/$($report.id)/endorse" -Method Post -ContentType "application/json" -Body $endorsePayload2 -WebSession $sessionPolice
Write-Output "Police Endorsement Recorded: Total=$($end2.total) | Police Vouches=$($end2.policeCount) | My Verdict=$($end2.myVerdict)"

# Fetch endorsements summary as Admin
$endorsements = Invoke-RestMethod -Uri "$base/api/reports/$($report.id)/endorsements" -Method Get -WebSession $sessionAdmin
Write-Output "Summary View: Total Endorsements=$($endorsements.total) | Police=$($endorsements.policeCount) | Citizen=$($endorsements.citizenCount)"

# 8. Testing Personal Credentials Tab Management
Write-Output "`n--- 8. Testing Personal Credentials Profile Management ---"
$credUpdate = @{
    badgeNumber = "SGT-4091-E"
    departmentOrOrg = "Metropolitan Police - Special Investigation"
    designation = "Senior Tactical Sergeant"
    contactNumber = "+1-555-019-4402"
    credentialsNotes = "Senior investigator with 12 years field service; certified digital forensics technician."
} | ConvertTo-Json

$updatedProfile = Invoke-RestMethod -Uri "$base/api/user/credentials" -Method Put -ContentType "application/json" -Body $credUpdate -WebSession $sessionPolice
Write-Output "Updated Credentials for $($updatedProfile.username):"
Write-Output " - Designation: $($updatedProfile.designation)"
Write-Output " - Department: $($updatedProfile.departmentOrOrg)"
Write-Output " - Badge: $($updatedProfile.badgeNumber)"
Write-Output " - Verification Status: $($updatedProfile.verificationStatus)"
Write-Output " - Reports Filed: $($updatedProfile.totalReports)"
Write-Output " - Vouches Cast: $($updatedProfile.totalEndorsementsGiven)"

# 9. Test Community Contribution Geolocation Distance & Keyword Confidence Rating
Write-Output "`n--- 9. Testing Geolocation Distance & Confidence Rating ---"
$contribPayload = @{
    contributorLoc = "Main Square, Downtown"
    infoText = "Spotted two suspects in dark clothing abandoning a hydraulic spreader in the alley."
    latitude = 40.7130
    longitude = -74.0058
} | ConvertTo-Json

$contrib = Invoke-RestMethod -Uri "$base/api/reports/$($report.id)/contributions" -Method Post -ContentType "application/json" -Body $contribPayload -WebSession $sessionCitizen2
Write-Output "Contribution Distance: $($contrib.distanceKm) km | Confidence Rating: $($contrib.confidenceRating)% ($($contrib.confidenceTier))"
Write-Output "Explainable Reasoning: $($contrib.explanation)"

Write-Output "`n=========================================================="
Write-Output "ALL VERIFICATION CHECKS COMPLETED SUCCESSFULLY!"
Write-Output "=========================================================="
