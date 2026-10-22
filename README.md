# Digital Incident & Crime Reporting System

A full-stack, enterprise-grade incident management, witness statement consistency verification, and tamper-evident evidentiary audit platform built with **Java 17/21**, **Spring Boot 3.5.5**, **Spring Data JPA**, **PostgreSQL**, and modern responsive **HTML5/CSS3/Vanilla ES6+ JavaScript**.

Designed for multi-stakeholder collaboration across **Citizens**, **Journalists**, **Government Officials**, **Police/Investigators**, **Organizations**, and **System Administrators**.

---

## Key Features & Core Innovations

### 1. Multi-Stakeholder Role-Based Access Control
- **Citizens**: Submit incident reports, provide initial witness testimonies, and contribute crowdsourced local intelligence.
- **Journalists**: File reports and preserve verified public interest and source testimonies.
- **Government Officials**: Conduct authorized administrative reviews, assign case statuses, and manage official inquiries.
- **Police / Investigators**: Assign official FIR numbers, document first responders on scene, attach cryptographic forensic evidence, and record witness statements.
- **Organizations**: Manage institution-specific reports and public safety alerts.
- **Administrators**: Complete system-level audit oversight, role management, and records supervision.

### 2. Witness Consistency Verification Engine
- Allows subsequent witnesses to independently describe observations without exposure to prior statements.
- Evaluates independent witness accounts against the baseline incident report and existing testimonies across three dimensions:
  1. **Location Consistency**: Scene landmarks, streets, and spatial indicators.
  2. **Temporal Proximity**: Incident time alignment ($< 60\text{ mins}$, $60\text{--}180\text{ mins}$, or discrepancy).
  3. **Event Narrative & Details**: Key terminology, action descriptions, suspect descriptions, and direction of flight.
- Computes an explainable consistency rating ($0\text{--}100\%$) and categorizes into:
  - `CONSISTENT` (Score $\ge 70\%$)
  - `NEEDS_REVIEW` (Score $40\text{--}69\%$)
  - `INCONSISTENT` (Score $< 40\%$)
- *Core Principle*: Distinguishes **who witnessed the event** from **who entered the statement**, and generates explainable notes to assist authorized human reviewers (matching statements identify consistency, not absolute authentic proof).

### 3. Tamper-Evident Evidence & Chain of Custody
- Preserves photos, video recordings, surveillance footage, and official forensic documents.
- Generates a **SHA-256 cryptographic checksum** for every item to guarantee digital immutability and verify non-repudiation.
- Maintains an append-only chain of custody detailing handler identity, transfer times, storage lockers, and forensic notes.

### 4. Scene Officials & First Report Takers
- Dedicated `incident_officials` relation tracking personnel present at incident scenes.
- Stores full verified credentials: official name, badge/ID number, department/agency, designation/rank, arrival timestamp, and contact information.
- Designates and visually highlights the official who conducted the initial intake with a **FIRST REPORT TAKER** banner on report cards.

### 5. Geolocation & Description Confidence Scoring
- Evaluates community and witness contributions based on two mathematical pillars:
  - **Haversine Distance**: Computes exact geodesic distance between incident coordinates and witness location.
  - **Keyword Correlation**: Analyzes token overlap between the incident description and witness testimony.
- Generates an explainable confidence tier:
  - `HIGH` ($70\text{--}100\%$)
  - `MEDIUM` ($40\text{--}69\%$)
  - `LOW` ($0\text{--}39\%$)

### 6. Strict Data Integrity & Future Date Prevention
- Incident dates and times are strictly constrained via `@PastOrPresent` validation and service-level checks — reports cannot be filed for events that have not yet occurred.
- Automatic generation of human-readable case reference numbers (e.g. `RPT-2026-00001`).
- Secure registration policy requiring valid email structure and a 5-point password complexity rule (8+ characters, uppercase, lowercase, numeric, and special character).

### 7. Real-Time Admin Command Window & Audit Trail
- High-level command dashboard tracking all lifecycle events: `REPORT_CREATED`, `STATUS_UPDATED`, `FIR_UPDATED`, `OFFICIAL_RECORDED`, `OFFICIAL_REMOVED`, `COMMUNITY_INFO_ADDED`, `WITNESS_RECORDED`, and `EVIDENCE_ATTACHED`.
- Live updates stream with action-type filtering and before-and-after change diffs.

---

## Database Architecture (`database/schema.sql`)

- `app_users`: User credentials, BCrypt hashes, and role designations.
- `reports`: Primary incident reports, GPS coordinates, human-readable reference codes, and status.
- `witnesses`: Independent witness statements, time/location observed, and consistency verification scores.
- `evidence_items`: Cryptographic file references, SHA-256 hashes, and chain of custody logs.
- `incident_officials`: Records of personnel on scene, credentials, and first report taker designations.
- `report_contributions`: Crowdsourced updates, distance calculations, and explainable confidence scores.
- `audit_logs`: Tamper-evident append-only change logs capturing user, role, timestamp, previous value, and new value.

---

## Running the Application

1. Verify PostgreSQL is running on port `5432` with database `reporting_system`:
   ```properties
   spring.datasource.url=jdbc:postgresql://localhost:5432/reporting_system
   spring.datasource.username=postgres
   spring.datasource.password=YOUR_POSTGRES_PASSWORD
   server.port=8081
   ```
2. Build and run the project:
   ```powershell
   mvn spring-boot:run
   ```
3. Open your browser and navigate to:
   ```
   http://localhost:8081
   ```

4. Run the automated end-to-end verification script:
   ```powershell
   powershell -ExecutionPolicy Bypass -File .\test_flow.ps1
   ```
