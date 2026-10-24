# Digital Reporting System (DRS) — Comprehensive Architecture & Codebase Guide

This document provides a complete technical explanation of the **Digital Reporting System** codebase, design decisions, database schemas, security flows, and functionalities for your team members and project reviewers.

---

## 1. Executive Project Summary

* **Project Name**: Digital Reporting System (Online Incident & Evidentiary Reporting System)
* **Technology Stack**:
  - **Backend**: Java 21, Spring Boot 3.5.5, Spring Data JPA / Hibernate, Spring Security (BCrypt)
  - **Database**: PostgreSQL 14 / 18
  - **Frontend**: Vanilla JavaScript (ES6+), HTML5, Custom Editorial CSS3 Architecture (Zero heavy dependencies)
* **Primary Objective**:
  To create a trustworthy, verifiable digital record of incidents and preserve independent witness statements. It allows citizens to lodge reports **with zero personal data collected**, access and amend cases via **private cryptographic keyphrases**, verify witness consistency independently, seal photographs/evidence with **SHA-256 digests**, and communicate directly with investigating authorities through an encrypted two-way channel.

---

## 2. System Architecture & High-Level Flow

```
                      +------------------------------------------+
                      |         CITIZEN / VISITOR                |
                      |   Zero personal data, Name, or Phone     |
                      +------------------------------------------+
                                    |              ^
                     Lodge Incident |              | Track Case &
                    (Generates Ref  |              | Two-Way Inquiry
                     & Keyphrase)   |              | (Uses Keyphrase)
                                    v              |
+---------------------------------------------------------------------------------+
|                       DIGITAL REPORTING SYSTEM (SPRING BOOT)                    |
|                                                                                 |
|  [REST Controllers]                                                             |
|   - ReportController          : Anonymous lodgement, keyphrase auth, chat       |
|   - DashboardController       : Live public & administrative metrics            |
|   - WitnessController         : Independent witness collection & NLP scores     |
|   - EvidenceController        : Tamper-evident SHA-256 custody records          |
|   - ContributionController    : Proximity distance & keyword confidence         |
|   - AuthController            : Official role logins & email checks             |
|                                                                                 |
|  [Service & Verification Layer]                                                 |
|   - WitnessVerificationService: Compares witness accounts vs initial reference  |
|   - ConfidenceEvaluationService: Haversine geo-distance + token match rating    |
|   - AuditLogService           : Immutable transaction & sensitive access logger |
+---------------------------------------------------------------------------------+
                                    |
                                    v
+---------------------------------------------------------------------------------+
|                         POSTGRESQL DATABASE (9 TABLES)                          |
|   app_users, reports, witnesses, evidence_items, incident_officials,            |
|   report_contributions, report_endorsements, report_messages, audit_logs        |
+---------------------------------------------------------------------------------+
```

---

## 3. Core Functionalities & How They Work in the Code

### 3.1. Zero-Knowledge Anonymous Lodgement & Secret Keyphrases
* **Problem Solved**: Ordinary citizens often fear reprisal or surveillance when reporting crimes or corruption.
* **Implementation (`ReportController.java` & `app.js`)**:
  - The citizen files an incident without submitting their name, email, or telephone number (`r.isAnonymous() == true`).
  - The client generates a random, human-memorable keyphrase (e.g. `amber-falcon-842`).
  - The server hashes this secret phrase using **BCrypt** (`passwordEncoder.encode(keyphrase)`) and stores only the one-way hash in `reports.keyphrase_hash`.
  - The citizen receives their unique Reference Code (`RPT-2026-IND01`) and the secret phrase.
  - To resume their session, amend information, or read messages from police, they enter their Reference Code + Keyphrase. The server validates via `passwordEncoder.matches()` and issues an ephemeral `anonymousSessionToken`.

### 3.2. Public Glimpse vs. Masked Confidential Narrative
* **Anti-Cheating / Anti-Collusion Protection**:
  - When submitting, the reporter provides two descriptions:
    1. **Public Glimpse / Overview**: High-level context visible to everyone in the directory (e.g. *"Store safe burglary near Connaught Place during early morning"*).
    2. **Confidential Detailed Narrative**: Forensic details (clothing colors, vehicle numbers, getaway direction, items taken).
  - Ordinary citizens and later witnesses only see the public glimpse.
  - The full confidential narrative is masked with `[Confidential Detailed Narrative — Protected to preserve independent witness verification]`.
  - Unlocked **only** when authenticated via the Case Secret Keyphrase or by an authorized official (`POLICE`, `GOVERNMENT_OFFICIAL`, `ADMIN`).

### 3.3. Independent Witness Consistency Verification
* **How It Works (`WitnessVerificationService.java`)**:
  - New witnesses submit statements independently without seeing earlier witness accounts.
  - The service parses token overlap, location markers, and time windows.
  - Calculates a **Verification Score ($0\text{--}100\%$)** and flags status:
    - `CONSISTENT` (Score $\ge 70\%$)
    - `NEEDS_REVIEW` (Score $35\text{--}69\%$)
    - `INCONSISTENT` (Discrepancies in time/location/facts)
    - `OFFICIALLY_VERIFIED` (Confirmed by investigating detective)

### 3.4. Crowdsourced Corroboration & Proximity Distance Confidence
* **Formula (`ConfidenceEvaluationService.java`)**:
  $$\text{Distance} = 2R \cdot \arcsin\left(\sqrt{\sin^2\left(\frac{\Delta \phi}{2}\right) + \cos(\phi_1)\cos(\phi_2)\sin^2\left(\frac{\Delta \lambda}{2}\right)}\right)$$
  - Combines the **Haversine Geolocation Distance** between the witness's coordinates and the incident scene with Jaccard keyword similarity.
  - Returns an explainable confidence rating ($0\text{--}100\%$) so investigators can prioritize credible accounts nearby.

### 3.5. Tamper-Evident Evidence Vault & SHA-256 Checksums
* Photographs and digital items attached compute a **SHA-256 cryptographic digest**.
* Stored in `evidence_items.file_hash` alongside uploader name, role, and custody timeline (`chain_of_custody`), guaranteeing digital integrity for courtroom presentation.

### 3.6. Two-Way Confidential Authority Inquiries
* Investigating police officers can post inquiries to the case docket (`ReportMessageRepository.java`).
* The anonymous reporter visits the site, unlocks the case with their secret phrase, reads the investigator's message, and posts replies or supplementary photos without exposing their true identity.

### 3.7. Immutable Audit Trail & Sensitive Case Inspection Logging
* Every status update, FIR assignment, witness submission, and sensitive narrative access is logged in `audit_logs`.
* Whenever an official reads a masked narrative, `logView()` automatically increments the inspection counter (`viewsCount`), ensuring internal accountability against unauthorized data snooping.

### 3.8. Zero-Knowledge Anti-Spam Architecture (No User Ratings Required)
* **Design Philosophy**: Because citizens submit anonymously, the platform explicitly **rejects persistent user ratings or IP bans**—a panicked reporter or someone whose phone was misused could submit a genuine emergency report that must never be discarded.
* **Feature 2 — Client-Side Proof-of-Work (PoW / Hashcash)**:
  - Endpoint `/api/reports/challenge` issues a signed, time-limited cryptographic puzzle.
  - The citizen's browser solves `SHA-256(challenge + ":" + nonce)` with a `"0000"` prefix (~300ms on client CPU).
  - For a human filing an incident, the delay is imperceptible. For automated spam bots firing rapid loops, computing thousands of hashes exhausts CPU and grinds spam attacks to a complete halt without collecting personal tracking data.
* **Feature 3 — Spatio-Temporal Near-Duplicate Clustering**:
  - When an incident is filed, the system scans the database for reports in the same category within the last 45 minutes that share either geographic coordinates ($\le 0.6\text{ km}$ via Haversine distance), matching location strings, or $\ge 50\%$ narrative token overlap.
  - **Preserves Evidence Without Clutter**: Instead of discarding or rejecting the report, the system marks it as `parentReferenceCode = primaryCase.referenceCode` and `duplicateMerged = true`. It generates a valid keyphrase for the reporter, preserving 100% of their photos and text, while displaying an `🔗 Addendum to Case [REF]` badge on the public directory so the feed remains consolidated.
* **Feature 4 — Semantic Entropy & Minimum Quality Validation**:
  - Protects against keyboard mashing (e.g. `aaaaaa`, `asdfasdfasdf`, `11111`) and gibberish.
  - Enforces minimum distinct descriptive words ($\ge 3$ unique words) and character diversity ratios ($\ge 22\%$ unique alphabetic characters over length 15), returning polite, constructive feedback if text appears repetitive.

---

## 4. Database Schema Structure (PostgreSQL)

| Table Name | Primary Purpose | Key Fields |
| :--- | :--- | :--- |
| **`reports`** | Stores all incident cases | `id`, `reference_code`, `event_type`, `incident_overview`, `description`, `loc`, `latitude`, `longitude`, `date_time`, `status`, `fir_number`, `keyphrase_hash`, `is_anonymous` |
| **`app_users`** | Official accounts & reporters | `id`, `username`, `email`, `password_hash`, `role`, `badge_number`, `department_or_org`, `designation`, `email_verified` |
| **`witnesses`** | Independent statements & scores | `id`, `report_id`, `witness_name`, `statement`, `witness_type`, `verification_status`, `verification_score`, `verification_notes` |
| **`evidence_items`**| Digital custody records | `id`, `report_id`, `title`, `evidence_type`, `file_reference`, `file_hash`, `uploader`, `chain_of_custody` |
| **`incident_officials`**| Scene personnel & intake officers | `id`, `report_id`, `official_name`, `badge_number`, `department`, `designation`, `first_report_taker`, `arrival_time` |
| **`report_messages`**| Two-way authority inquiries | `id`, `report_id`, `sender_type`, `sender_name`, `message_text`, `read_by_reporter`, `read_by_authority` |
| **`report_contributions`**| Proximity crowd submissions | `id`, `report_id`, `contribution_text`, `latitude`, `longitude`, `confidence_score`, `geo_distance_km` |
| **`report_endorsements`**| Community authenticity indications| `id`, `report_id`, `user_id`, `verdict` (`AUTHENTIC`, `PLAUSIBLE`, `DISPUTED`), `endorsement_notes` |
| **`audit_logs`** | Permanent ledger of actions | `id`, `report_id`, `action`, `performed_by`, `user_role`, `details`, `timestamp` |

---

## 5. Summary of UI & Aesthetic Updates

1. **Editorial Design Tokens**:
   - Palette inspired by editorial publications: **Warm Ivory** (`#FAF7F2`), **Deep Midnight Spruce** (`#162B32`), **Muted Brass** (`#C2A268`), and **Restrained Sage** (`#5A7E73`).
   - Clean serif headings (**Cormorant Garamond**) paired with modern sans-serif body typography (**Plus Jakarta Sans**).
2. **Top-Bar Buttons Visibility**:
   - High-contrast frosted glass styling with warm brass borders (`#btnTrackCaseNav`, `#btnAuthorityLoginNav`) ensures crisp legibility in both light and dark modes.
3. **Dynamic Metrics & Functional Percentage Bars**:
   - Metric cards (`#barTotal`, `#barPending`, `#barInvestigating`, `#barResolved`) dynamically compute and render animated percentage distributions of the total caseload.
   - Clicking on any metric card automatically filters the directory list to that status.
