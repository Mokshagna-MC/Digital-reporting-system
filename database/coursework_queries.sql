-- =============================================================================
-- COURSEWORK & ANALYTICS SQL QUERIES
-- Demonstrating SELECT, WHERE, ORDER BY, GROUP BY, HAVING, JOIN, Subqueries,
-- and Aggregations on reports, witnesses, evidence_items, officials, and audit_logs.
-- =============================================================================

-- 1. Identify the Official Who Took the First Report for Each Incident (JOIN + WHERE)
SELECT 
    r.id AS report_id,
    r.reference_code,
    r.event_type,
    r.loc AS incident_location,
    r.status,
    io.official_name,
    io.badge_number,
    io.department,
    io.designation,
    io.contact_info,
    io.arrival_time
FROM reports r
JOIN incident_officials io ON r.id = io.report_id
WHERE io.first_report_taker = TRUE
ORDER BY r.created_at DESC;

-- 2. Witness Consistency Verification: Compare Initial Source Statement with Later Witnesses (SELF JOIN)
SELECT 
    r.reference_code,
    r.event_type,
    w_initial.witness_name AS initial_witness,
    w_initial.statement AS initial_statement,
    w_later.witness_name AS subsequent_witness,
    w_later.statement AS subsequent_statement,
    w_later.verification_status,
    w_later.verification_score,
    w_later.verification_notes,
    w_later.recorded_by AS recorded_by_user,
    w_later.recorded_by_role
FROM reports r
JOIN witnesses w_initial ON r.id = w_initial.report_id AND w_initial.witness_type = 'INITIAL_SOURCE'
LEFT JOIN witnesses w_later ON r.id = w_later.report_id AND w_later.witness_type = 'LATER_WITNESS'
ORDER BY r.id, w_later.verification_score DESC;

-- 3. Tamper-Evident Chain of Custody for Evidence Items (JOIN + ORDER BY)
SELECT 
    r.reference_code,
    e.title AS evidence_title,
    e.evidence_type,
    e.file_reference,
    e.file_hash,
    e.uploader,
    e.uploader_role,
    e.chain_of_custody,
    e.uploaded_at
FROM evidence_items e
JOIN reports r ON e.report_id = r.id
ORDER BY e.uploaded_at ASC;

-- 4. Complete Audit History of Changes for a Specific Incident (SELECT + WHERE + ORDER BY)
SELECT 
    a.id,
    a.report_id,
    a.action,
    a.performed_by,
    a.user_role,
    a.details,
    a.previous_value,
    a.new_value,
    a.timestamp
FROM audit_logs a
WHERE a.report_id = 1
ORDER BY a.timestamp ASC;

-- 5. Incidents Overview: Count of Witnesses, Evidence Items, and Officials (MULTI-JOIN + GROUP BY)
SELECT 
    r.id AS report_id,
    r.reference_code,
    r.event_type,
    r.status,
    COUNT(DISTINCT w.id) AS total_witnesses,
    COUNT(DISTINCT e.id) AS total_evidence_items,
    COUNT(DISTINCT io.id) AS total_officials_present
FROM reports r
LEFT JOIN witnesses w ON r.id = w.report_id
LEFT JOIN evidence_items e ON r.id = e.report_id
LEFT JOIN incident_officials io ON r.id = io.report_id
GROUP BY r.id, r.reference_code, r.event_type, r.status
ORDER BY total_evidence_items DESC, total_witnesses DESC;

-- 6. Subquery: Reports with Inconsistent Witness Statements Flagged for Review
SELECT 
    r.id,
    r.reference_code,
    r.event_type,
    r.loc,
    r.status
FROM reports r
WHERE r.id IN (
    SELECT w.report_id 
    FROM witnesses w 
    WHERE w.verification_status IN ('INCONSISTENT', 'NEEDS_REVIEW')
);

-- 7. Audit Activity by Role (GROUP BY + COUNT + HAVING)
SELECT 
    a.user_role,
    a.action,
    COUNT(*) AS action_count
FROM audit_logs a
GROUP BY a.user_role, a.action
HAVING COUNT(*) >= 1
ORDER BY action_count DESC;

-- 8. Authenticity Endorsements Breakdown for Citizen Reports (JOIN + COUNT + CASE WHEN)
SELECT 
    r.id AS report_id,
    r.reference_code,
    r.event_type,
    r.incident_overview,
    u.username AS citizen_reporter,
    COUNT(re.id) AS total_vouches,
    SUM(CASE WHEN re.endorser_role IN ('POLICE', 'GOVERNMENT_OFFICIAL') THEN 1 ELSE 0 END) AS police_vouches,
    SUM(CASE WHEN re.endorser_role = 'JOURNALIST' THEN 1 ELSE 0 END) AS journalist_vouches,
    SUM(CASE WHEN re.endorser_role = 'CITIZEN' THEN 1 ELSE 0 END) AS citizen_vouches
FROM reports r
JOIN app_users u ON r.reporter_id = u.id
LEFT JOIN report_endorsements re ON r.id = re.report_id
WHERE u.role = 'CITIZEN'
GROUP BY r.id, r.reference_code, r.event_type, r.incident_overview, u.username
ORDER BY total_vouches DESC;

-- 9. Reporter Credentials and Verification Standing Summary (JOIN + GROUP BY)
SELECT 
    u.id AS user_id,
    u.username,
    u.role,
    u.badge_number,
    u.department_or_org,
    u.designation,
    u.verification_status,
    COUNT(DISTINCT r.id) AS total_reports_filed,
    COUNT(DISTINCT re.id) AS total_authenticity_endorsements_cast
FROM app_users u
LEFT JOIN reports r ON u.id = r.reporter_id
LEFT JOIN report_endorsements re ON u.id = re.user_id
GROUP BY u.id, u.username, u.role, u.badge_number, u.department_or_org, u.designation, u.verification_status
ORDER BY total_reports_filed DESC;

