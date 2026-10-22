-- =============================================================================
-- DIGITAL CRIME & INCIDENT REPORTING SYSTEM - DATABASE SCHEMA (PostgreSQL)
-- =============================================================================

-- 1. App Users (Citizens, Journalists, Government Officials, Organizations, Administrators)
CREATE TABLE IF NOT EXISTS app_users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(120) NOT NULL UNIQUE,
    email VARCHAR(180) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'CITIZEN' CHECK (role IN ('CITIZEN', 'JOURNALIST', 'GOVERNMENT_OFFICIAL', 'POLICE', 'ORGANIZATION', 'ADMIN')),
    badge_number VARCHAR(100),
    department_or_org VARCHAR(150),
    designation VARCHAR(100),
    contact_number VARCHAR(50),
    verification_status VARCHAR(50) DEFAULT 'VERIFIED_ACTIVE',
    credentials_notes VARCHAR(1000),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 2. Incident Reports (Human-readable reference code, public glimpse/overview, confidential narrative, coordinates, status, FIR)
CREATE TABLE IF NOT EXISTS reports (
    id BIGSERIAL PRIMARY KEY,
    reference_code VARCHAR(50) UNIQUE,
    event_type VARCHAR(80) NOT NULL,
    incident_overview VARCHAR(1000),
    description VARCHAR(5000) NOT NULL,
    loc VARCHAR(500) NOT NULL,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    date_time TIMESTAMP NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'UNDER_REVIEW', 'INVESTIGATING', 'RESOLVED', 'CLOSED')),
    fir_number VARCHAR(100),
    reporter_id BIGINT NOT NULL REFERENCES app_users(id) ON DELETE RESTRICT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 3. Officials Present & First Responders / First Report Taker Table
CREATE TABLE IF NOT EXISTS incident_officials (
    id BIGSERIAL PRIMARY KEY,
    report_id BIGINT NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
    official_name VARCHAR(150) NOT NULL,
    badge_number VARCHAR(100) NOT NULL,
    department VARCHAR(150) NOT NULL,
    designation VARCHAR(100) NOT NULL,
    contact_info VARCHAR(150),
    first_report_taker BOOLEAN NOT NULL DEFAULT FALSE,
    arrival_time TIMESTAMP,
    duties_summary VARCHAR(1000),
    recorded_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    recorded_by VARCHAR(120)
);

-- 4. Witness Statements & Automated Consistency Verification Table
CREATE TABLE IF NOT EXISTS witnesses (
    id BIGSERIAL PRIMARY KEY,
    report_id BIGINT NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
    witness_name VARCHAR(150) NOT NULL,
    contact_details VARCHAR(180),
    statement VARCHAR(5000) NOT NULL,
    witness_type VARCHAR(30) NOT NULL DEFAULT 'LATER_WITNESS' CHECK (witness_type IN ('INITIAL_SOURCE', 'LATER_WITNESS')),
    location_observed VARCHAR(500),
    time_observed TIMESTAMP,
    recorded_by VARCHAR(120) NOT NULL,
    recorded_by_role VARCHAR(50) NOT NULL,
    verification_status VARCHAR(30) NOT NULL DEFAULT 'NEEDS_REVIEW' CHECK (verification_status IN ('CONSISTENT', 'NEEDS_REVIEW', 'INCONSISTENT', 'INITIAL_RECORD', 'OFFICIALLY_VERIFIED')),
    verification_score INT CHECK (verification_score BETWEEN 0 AND 100),
    verification_notes VARCHAR(2000),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 5. Evidence Management & Tamper-Evident Chain of Custody Table
CREATE TABLE IF NOT EXISTS evidence_items (
    id BIGSERIAL PRIMARY KEY,
    report_id BIGINT NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    evidence_type VARCHAR(50) NOT NULL CHECK (evidence_type IN ('PHOTO', 'VIDEO', 'DOCUMENT', 'AUDIO', 'FORENSIC_REPORT', 'PHYSICAL_ITEM')),
    file_reference VARCHAR(500) NOT NULL,
    file_hash VARCHAR(64),
    uploader VARCHAR(120) NOT NULL,
    uploader_role VARCHAR(50) NOT NULL,
    chain_of_custody VARCHAR(2000),
    uploaded_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 6. Audit Log Table (Immutable audit trail tracking all modifications)
CREATE TABLE IF NOT EXISTS audit_logs (
    id BIGSERIAL PRIMARY KEY,
    report_id BIGINT REFERENCES reports(id) ON DELETE CASCADE,
    action VARCHAR(100) NOT NULL,
    performed_by VARCHAR(120) NOT NULL,
    user_role VARCHAR(50) NOT NULL,
    details VARCHAR(2000) NOT NULL,
    previous_value VARCHAR(500),
    new_value VARCHAR(500),
    timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 7. Crowdsourced / Community Contributions Table (With Geolocation & Description Confidence)
CREATE TABLE IF NOT EXISTS report_contributions (
    id BIGSERIAL PRIMARY KEY,
    report_id BIGINT NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
    contributor_id BIGINT REFERENCES app_users(id) ON DELETE SET NULL,
    contributor_username VARCHAR(120) NOT NULL,
    info_text VARCHAR(4000) NOT NULL,
    contributor_loc VARCHAR(500),
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    distance_km DOUBLE PRECISION,
    confidence_score INT NOT NULL CHECK (confidence_score BETWEEN 0 AND 100),
    confidence_level VARCHAR(30) NOT NULL CHECK (confidence_level IN ('HIGH', 'MEDIUM', 'LOW')),
    match_notes VARCHAR(1000),
    status VARCHAR(30) NOT NULL DEFAULT 'PENDING_REVIEW' CHECK (status IN ('PENDING_REVIEW', 'ACCEPTED', 'VERIFIED', 'FLAGGED', 'REJECTED')),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance & query optimization
CREATE INDEX IF NOT EXISTS idx_reports_status ON reports(status);
CREATE INDEX IF NOT EXISTS idx_reports_created_at ON reports(created_at);
CREATE INDEX IF NOT EXISTS idx_reports_ref_code ON reports(reference_code);
CREATE INDEX IF NOT EXISTS idx_reports_geo ON reports(latitude, longitude);

CREATE INDEX IF NOT EXISTS idx_witnesses_report_id ON witnesses(report_id);
CREATE INDEX IF NOT EXISTS idx_witnesses_verification ON witnesses(verification_status);

CREATE INDEX IF NOT EXISTS idx_evidence_report_id ON evidence_items(report_id);
CREATE INDEX IF NOT EXISTS idx_evidence_hash ON evidence_items(file_hash);

CREATE INDEX IF NOT EXISTS idx_officials_report_id ON incident_officials(report_id);
CREATE INDEX IF NOT EXISTS idx_officials_badge ON incident_officials(badge_number);
CREATE INDEX IF NOT EXISTS idx_officials_first_taker ON incident_officials(first_report_taker);

-- 8. Community Authenticity Endorsements (Vouching & Verification Indicators)
CREATE TABLE IF NOT EXISTS report_endorsements (
    id BIGSERIAL PRIMARY KEY,
    report_id BIGINT NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
    user_id BIGINT NOT NULL REFERENCES app_users(id) ON DELETE CASCADE,
    endorser_username VARCHAR(120) NOT NULL,
    endorser_role VARCHAR(50) NOT NULL,
    verdict VARCHAR(30) NOT NULL DEFAULT 'AUTHENTIC' CHECK (verdict IN ('AUTHENTIC', 'PLAUSIBLE', 'DISPUTED')),
    endorsement_note VARCHAR(1000),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uk_report_user_endorsement UNIQUE (report_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_endorsements_report_id ON report_endorsements(report_id);
CREATE INDEX IF NOT EXISTS idx_endorsements_user_id ON report_endorsements(user_id);

