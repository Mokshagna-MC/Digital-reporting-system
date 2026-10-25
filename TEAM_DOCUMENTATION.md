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

### 3.1. Cryptographic Key Derivation & The 7-Word High-Entropy Passphrase
* **Problem Solved**: Legacy 3-part phrases (e.g., `amber-falcon-842`) lack the computational entropy required to withstand modern GPU-accelerated hash cracking clusters and rainbow table attacks.
* **Mathematical Entropy Analysis**:
  - The DRS implements a **7-Word Diceware Passphrase Standard** (e.g., `velvet-granite-orbital-falcon-whisper-cobalt-harbor`).
  - Drawing 7 independent words from a cryptographically seeded dictionary ($N = 512$ words) yields:
    $$\text{Entropy} = 7 \times \log_2(512) = 7 \times 9 = 63\text{ bits of pure dictionary entropy}$$
  - When expanded across the standard EFF 7,776-wordlist, this scales to:
    $$\text{Entropy} = 7 \times \log_2(7776) \approx 7 \times 12.925 = 90.47\text{ bits}$$
  - **Key Stretching (KDF)**: The client browser uses the **Web Crypto API (`window.crypto.subtle`)** to stretch the 7-word passphrase through **PBKDF2** using **HMAC-SHA-256 with 600,000 iterations** (exceeding OWASP 2024+ recommendations) and a unique case salt. This derives a 256-bit symmetric cipher key (`AES-GCM-256`) entirely inside client memory.
  - **Server Storage**: The backend server receives only a one-way **BCrypt** digest (`passwordEncoder.encode(passphrase, cost=12)`) in `reports.keyphrase_hash` strictly for session authentication, ensuring the raw encryption key never leaves the client browser.

### 3.2. End-to-End Encryption (E2EE) vs. UI Masking — The "Blind Carrier" Model
* **Beyond Surface Masking**: Relying on backend filtering or UI masking means the database administrator, server hosting provider, or an attacker with SQL injection could inspect confidential narratives. To achieve true whistleblower protection, DRS enforces the **Blind Carrier Model**:
* **Client-Side Cryptographic Workflow (WebCrypto / SubtleCrypto)**:
  1. **Dual Narrative Separation**:
     - **Public Glimpse / Overview**: High-level public summary (e.g., *"Reported burglary near Connaught Place"*) stored in plaintext to allow community recognition and independent witness matching.
     - **Confidential Detailed Narrative**: Forensic specifics (vehicle plates, suspect attire, hidden clues) are **asymmetrically sealed in the browser before network transmission**.
  2. **Asymmetric Envelope Encryption**:
     - The browser generates an ephemeral 256-bit `AES-GCM` session key to encrypt the narrative text.
     - The AES key is wrapped twice:
       - **Reporter Docket**: Encrypted with the key derived from the reporter's **7-Word Passphrase** (PBKDF2 + AES-KW).
       - **Authority Docket**: Asymmetrically encrypted with the investigating agency's **RSA-OAEP 4096-bit Public Key** (or ECDH P-384 public key) fetched from `/api/auth/authority-public-key`.
     - The Java Spring Boot backend receives and stores strictly the ciphertext blob, IV (Initialization Vector), and GCM authentication tag in `reports.description`.
  3. **Zero-Knowledge Guarantee**:
     - The Spring Boot server operates as a completely "blind carrier." It cannot read, decrypt, or leak the confidential narrative even under subpoena, database dump, or cloud host intrusion.
     - Only the citizen (possessing the 7-word passphrase) or the authorized detective (possessing the agency's offline private key) can decrypt the narrative locally in their browser.

### 3.3. Network-Level Anonymity: Tor Onion Services & Reverse-Proxy IP Scrubbing
* **Application vs. Network Layer**: Guaranteeing zero personal data (no names, emails, or phone numbers) at the application layer is insufficient if TCP/IP network packets expose the whistleblower's residential or cellular IP address.
* **Network Defense Architecture**:
  1. **Tor Onion Service (`.onion` Hidden Service)**:
     - The DRS container is configured to bind directly to a local Tor daemon via an ephemeral Onion v3 address (`http://[56-character-hash].onion`).
     - Traffic routed through Tor undergoes multi-layer onion routing across 3 worldwide relay nodes (Entry/Guard, Middle, Exit), rendering the reporter's physical IP address mathematically untraceable to both the server and any intermediate ISP.
  2. **Strict Reverse-Proxy Zero-Log Protocol (Caddy / NGINX)**:
     - For clearnet visitors accessing HTTPS, the front-facing reverse proxy enforces an explicit **No-Log IP Scrubbing Policy**:
       ```nginx
       # Strict Zero-Log Clearnet Ingress Configuration
       access_log off;
       error_log /dev/null crit;
       proxy_set_header X-Real-IP "";
       proxy_set_header X-Forwarded-For "";
       proxy_set_header Remote-Addr "";
       proxy_set_header User-Agent "DRS-Anonymous-Client/1.0";
       proxy_hide_header Via;
       ```
     - All incoming TCP socket IP addresses and client headers are stripped in memory before packets are forwarded to Spring Boot (port 8081).
     - Tomcat access logs are permanently disabled in `application-prod.properties` (`server.tomcat.accesslog.enabled=false`).
     - Volatile RAM storage ensures no connection tables or network artifacts survive container termination.

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

## 5. Summary of UI, Ergonomics & Retro-Tech Updates

1. **Network-Level Security & IP Scrubbing Entrance Gate**:
   - Features a high-tech terminal handshake overlay on initial visit simulating real-time Tor routing, TCP header scrubbing, and WebCrypto session establishment. Includes a bypass skip control and re-triggers on clicking the topbar `IP_MASKED // NO_LOG` pill.
2. **Asymmetric Dashboard Layout (Side Metrics Column)**:
   - Caseload metrics (Total Cases, Pending Review, Active Investigations, Resolved) and the **Retro Computer System Monitor** are positioned in an asymmetric sticky side column on desktop, delivering balanced editorial ergonomics and maximum vertical viewing area for the case directory.
3. **Retro Basic Computer (Terminal / Monospace) Typography**:
   - Technical identifiers, case reference codes (`RPT-2026-XXXXX`), cryptographic hashes, percentages, badges, and system monitor logs use authentic monospace and retro computer fonts (**Space Mono**, **JetBrains Mono**, and **VT323** with CRT phosphor-green and amber accents).
4. **Minecraft-Style 3D Voxel Block & Pixel Wheel Loading Screen**:
   - When synchronizing reports or submitting cases, an authentic 3D rotating isometric pixel block (textured grass/obsidian block) and an 8-blade pixel loading wheel appear with retro arcade styling (*"LOADING EVIDENTIARY BLOCKS... Building chunks & verifying SHA-256 digests"*).
5. **Editorial Design Tokens**:
   - Palette inspired by premium publications: **Warm Ivory** (`#FAF7F2`), **Deep Midnight Spruce** (`#162B32`), **Muted Brass** (`#C2A268`), and **Restrained Sage** (`#5A7E73`), paired with **Cormorant Garamond** headings and **Plus Jakarta Sans** body copy.
