-- Seed realistic Indian Incident Reports across various regions
-- New Delhi, Mumbai, Bengaluru, Hyderabad, Kolkata, Chennai, Pune, Jaipur, Ahmedabad, Kochi

DO $$
DECLARE
    v_admin_id BIGINT;
    v_police_id BIGINT;
    v_journalist_id BIGINT;
    v_citizen_id BIGINT;
    v_rpt_id BIGINT;
BEGIN
    SELECT id INTO v_admin_id FROM app_users WHERE role = 'ADMIN' LIMIT 1;
    SELECT id INTO v_police_id FROM app_users WHERE role = 'POLICE' LIMIT 1;
    SELECT id INTO v_journalist_id FROM app_users WHERE role = 'JOURNALIST' LIMIT 1;
    SELECT id INTO v_citizen_id FROM app_users WHERE role = 'CITIZEN' LIMIT 1;

    -- 1. New Delhi: Cyber Fraud / Fake Bank KYC
    INSERT INTO reports (
        reference_code, event_type, incident_overview, description, loc,
        latitude, longitude, date_time, status, fir_number, reporter_id,
        is_anonymous, keyphrase_hash, keyphrase_hint, created_at, updated_at
    ) VALUES (
        'RPT-2026-IND01',
        'Fraud / Cybercrime',
        'Senior citizen targeted by deceptive SIM-block KYC SMS leading to unauthorized net-banking fund transfers.',
        'Victim received an urgent SMS claiming electric meter disconnection and SIM deactivation within 24 hours. The caller impersonated a telecom officer, instructing installation of remote desktop software (AnyDesk) and initiating 3 unauthorized transactions totaling Rs. 4,85,000 to suspect accounts in Jamtara & Mewat clusters.',
        'Connaught Place, Inner Circle, New Delhi',
        28.6315, 77.2167,
        NOW() - INTERVAL '3 days',
        'INVESTIGATING',
        'FIR-DEL-2026-CY091',
        v_citizen_id,
        false,
        '$2a$10$vG9P0hR5J7o7kY7X3M4.E.cOa3tO1Vl1h8LwVqY7k3x6m5o9p1u2y',
        'delhi-cyber-safe',
        NOW() - INTERVAL '3 days',
        NOW() - INTERVAL '1 day'
    ) RETURNING id INTO v_rpt_id;

    INSERT INTO incident_officials (
        report_id, official_name, badge_number, department, designation,
        contact_info, first_report_taker, arrival_time, duties_summary, recorded_at, recorded_by
    ) VALUES (
        v_rpt_id,
        'ACP Vikram Rathore',
        'DL-IPS-7704',
        'Delhi Police - Cyber Crime Cell IFSO Dwarka',
        'Assistant Commissioner of Police',
        'acp-cyber.delhi@gov.in',
        true,
        NOW() - INTERVAL '3 days' + INTERVAL '1 hour',
        'Issued Section 91 notices to nodal banks and freeze requests to payment gateway accounts.',
        NOW() - INTERVAL '3 days' + INTERVAL '1 hour',
        'sgt_reynolds'
    );

    INSERT INTO witnesses (
        report_id, witness_name, contact_details, statement, witness_type,
        location_observed, time_observed, recorded_by, recorded_by_role,
        verification_status, verification_score, verification_notes, created_at
    ) VALUES (
        v_rpt_id,
        'Ananya Sharma',
        '+91 98101 23456',
        'Assisted the elderly neighbor in calling National Cyber Crime helpline 1930 immediately after noticing suspicious OTP requests.',
        'INITIAL_SOURCE',
        'Block B Connaught Place, New Delhi',
        NOW() - INTERVAL '3 days',
        'ACP Vikram Rathore',
        'POLICE',
        'OFFICIALLY_VERIFIED',
        98,
        'Bank transaction timestamps precisely matched telecom call logs and helpline intake receipt.',
        NOW() - INTERVAL '3 days' + INTERVAL '2 hours'
    );

    INSERT INTO audit_logs (
        report_id, action, performed_by, user_role, details, previous_value, new_value, timestamp
    ) VALUES (
        v_rpt_id, 'REPORT_CREATED', 'Ananya Sharma', 'CITIZEN',
        'Initial incident report filed [RPT-2026-IND01]: Fraud / Cybercrime at Connaught Place, New Delhi',
        NULL, 'PENDING', NOW() - INTERVAL '3 days'
    ), (
        v_rpt_id, 'STATUS_UPDATED', 'ACP Vikram Rathore', 'POLICE',
        'Status transitioned from [PENDING] to [INVESTIGATING] following nodal bank freeze',
        'PENDING', 'INVESTIGATING', NOW() - INTERVAL '2 days'
    );


    -- 2. Mumbai: Marine Drive Hit-and-Run Traffic Incident
    INSERT INTO reports (
        reference_code, event_type, incident_overview, description, loc,
        latitude, longitude, date_time, status, fir_number, reporter_id,
        is_anonymous, keyphrase_hash, keyphrase_hint, created_at, updated_at
    ) VALUES (
        'RPT-2026-IND02',
        'Traffic incident',
        'Speeding black luxury SUV collided with roadside barrier and food cart near Marine Drive promenade before fleeing towards Nariman Point.',
        'Around 11:30 PM, a black imported sedan/SUV speeding past the promenade lost control near the flyover curve, severely damaging a vendor cart and grazing a pedestrian. Driver fled southbound towards Nariman Point without stopping. Partial registration plate observed: MH-01-XX-9009.',
        'Marine Drive Promenade, Netaji Subhash Chandra Bose Road, Mumbai',
        18.9438, 72.8233,
        NOW() - INTERVAL '1 day' - INTERVAL '6 hours',
        'UNDER_REVIEW',
        'FIR-MUM-2026-TR882',
        v_police_id,
        false,
        '$2a$10$vG9P0hR5J7o7kY7X3M4.E.cOa3tO1Vl1h8LwVqY7k3x6m5o9p1u2y',
        'mumbai-coastal-cctv',
        NOW() - INTERVAL '1 day' - INTERVAL '5 hours',
        NOW() - INTERVAL '1 day' - INTERVAL '2 hours'
    ) RETURNING id INTO v_rpt_id;

    INSERT INTO incident_officials (
        report_id, official_name, badge_number, department, designation,
        contact_info, first_report_taker, arrival_time, duties_summary, recorded_at, recorded_by
    ) VALUES (
        v_rpt_id,
        'Senior PI Rajesh Mane',
        'MH-POL-1089',
        'Marine Drive Police Station - Traffic Division',
        'Senior Police Inspector',
        'pi.marinedrive@mahapolice.gov.in',
        true,
        NOW() - INTERVAL '1 day' - INTERVAL '5 hours',
        'Secured intersection CCTV footage and impounded debris from vehicle front bumper.',
        NOW() - INTERVAL '1 day' - INTERVAL '5 hours',
        'sgt_reynolds'
    );

    INSERT INTO witnesses (
        report_id, witness_name, contact_details, statement, witness_type,
        location_observed, time_observed, recorded_by, recorded_by_role,
        verification_status, verification_score, verification_notes, created_at
    ) VALUES (
        v_rpt_id,
        'Farhan Merchant',
        '+91 98200 45678',
        'I was walking near the seaside railing. Heard loud tire screeching followed by impact sound. Vehicle had dark tinted glasses and accelerated south towards hotel lane.',
        'LATER_WITNESS',
        'Promenade Bench 14, Marine Drive',
        NOW() - INTERVAL '1 day' - INTERVAL '6 hours',
        'Senior PI Rajesh Mane',
        'POLICE',
        'CONSISTENT',
        92,
        'Statement correlates with camera timestamps from traffic junction sensor 4.',
        NOW() - INTERVAL '1 day' - INTERVAL '3 hours'
    );

    INSERT INTO audit_logs (
        report_id, action, performed_by, user_role, details, previous_value, new_value, timestamp
    ) VALUES (
        v_rpt_id, 'REPORT_CREATED', 'Senior PI Rajesh Mane', 'POLICE',
        'Initial incident report filed [RPT-2026-IND02]: Traffic incident at Marine Drive, Mumbai',
        NULL, 'PENDING', NOW() - INTERVAL '1 day' - INTERVAL '5 hours'
    );


    -- 3. Bengaluru: Tech Park Laptop & Asset Burglary
    INSERT INTO reports (
        reference_code, event_type, incident_overview, description, loc,
        latitude, longitude, date_time, status, fir_number, reporter_id,
        is_anonymous, keyphrase_hash, keyphrase_hint, created_at, updated_at
    ) VALUES (
        'RPT-2026-IND03',
        'Theft',
        'Break-in into co-working office overnight; 14 developer workstations and encrypted server hardware taken.',
        'Unidentified perpetrators bypassed magnetic swipe lock system on the 3rd floor between 02:30 AM and 04:15 AM. 14 Apple M-series laptops, external RAID backup storage disks, and testing handhelds were systematically stolen from workstation desks. Server rack enclosure was forcibly pried open.',
        'Outer Ring Road, Bellandur EcoWorld Tech Park, Bengaluru',
        12.9260, 77.6836,
        NOW() - INTERVAL '4 days',
        'INVESTIGATING',
        'FIR-BLR-2026-CC104',
        v_citizen_id,
        true,
        '$2a$10$vG9P0hR5J7o7kY7X3M4.E.cOa3tO1Vl1h8LwVqY7k3x6m5o9p1u2y',
        'ecoworld-bengaluru-tech',
        NOW() - INTERVAL '4 days',
        NOW() - INTERVAL '2 days'
    ) RETURNING id INTO v_rpt_id;

    INSERT INTO incident_officials (
        report_id, official_name, badge_number, department, designation,
        contact_info, first_report_taker, arrival_time, duties_summary, recorded_at, recorded_by
    ) VALUES (
        v_rpt_id,
        'Inspector Ramesh Rao',
        'KA-POL-4921',
        'Bellandur Police Station - Crime Branch',
        'Police Inspector',
        'ramesh.rao@ksp.gov.in',
        true,
        NOW() - INTERVAL '4 days' + INTERVAL '45 minutes',
        'Fingerprint forensic squad deployed; smart-card badge access logs extracted.',
        NOW() - INTERVAL '4 days' + INTERVAL '45 minutes',
        'admin'
    );

    INSERT INTO audit_logs (
        report_id, action, performed_by, user_role, details, previous_value, new_value, timestamp
    ) VALUES (
        v_rpt_id, 'REPORT_CREATED', 'Anonymous Reporter', 'CITIZEN',
        'Initial incident report filed [RPT-2026-IND03]: Theft at Bellandur Tech Park, Bengaluru',
        NULL, 'PENDING', NOW() - INTERVAL '4 days'
    );


    -- 4. Hyderabad: Public Safety & Chemical Storage Breach near Industrial Area
    INSERT INTO reports (
        reference_code, event_type, incident_overview, description, loc,
        latitude, longitude, date_time, status, fir_number, reporter_id,
        is_anonymous, keyphrase_hash, keyphrase_hint, created_at, updated_at
    ) VALUES (
        'RPT-2026-IND04',
        'Public safety',
        'Pungent sulfur gas odor and illegal discharge of untreated chemical effluent into stormwater drainage channel.',
        'Residents of nearby colonies alerted municipal teams regarding burning eye sensation and noxious yellowish fumes emanating from an unauthorized private warehouse back-gate during pre-dawn hours. Tanker truck observed discharging industrial chemical sludge into the storm sewer canal connecting to water bodies.',
        'IDA Jeedimetla Phase III, Medchal-Malkajgiri, Hyderabad',
        17.5186, 78.4482,
        NOW() - INTERVAL '2 days',
        'RESOLVED',
        'FIR-HYD-2026-ENV402',
        v_journalist_id,
        false,
        '$2a$10$vG9P0hR5J7o7kY7X3M4.E.cOa3tO1Vl1h8LwVqY7k3x6m5o9p1u2y',
        'hyderabad-env-watch',
        NOW() - INTERVAL '2 days',
        NOW() - INTERVAL '6 hours'
    ) RETURNING id INTO v_rpt_id;

    INSERT INTO incident_officials (
        report_id, official_name, badge_number, department, designation,
        contact_info, first_report_taker, arrival_time, duties_summary, recorded_at, recorded_by
    ) VALUES (
        v_rpt_id,
        'K. Venkat Reddy',
        'TS-PCB-619',
        'Telangana Pollution Control Board - Task Force',
        'Senior Environmental Engineer',
        'ee-taskforce@pcb.telangana.gov.in',
        true,
        NOW() - INTERVAL '2 days' + INTERVAL '1 hour',
        'Water sample bottles collected; premises sealed under Water Act Section 33A.',
        NOW() - INTERVAL '2 days' + INTERVAL '1 hour',
        'lead_officer_test'
    );

    INSERT INTO audit_logs (
        report_id, action, performed_by, user_role, details, previous_value, new_value, timestamp
    ) VALUES (
        v_rpt_id, 'REPORT_CREATED', 'reporter_test_6128', 'JOURNALIST',
        'Initial incident report filed [RPT-2026-IND04]: Public safety at Jeedimetla, Hyderabad',
        NULL, 'PENDING', NOW() - INTERVAL '2 days'
    ), (
        v_rpt_id, 'STATUS_UPDATED', 'lead_officer_test', 'GOVERNMENT_OFFICIAL',
        'Status transitioned from [INVESTIGATING] to [RESOLVED] after sealing illegal discharge unit',
        'INVESTIGATING', 'RESOLVED', NOW() - INTERVAL '6 hours'
    );


    -- 5. Kolkata: Snatching & Assault near Metro Station
    INSERT INTO reports (
        reference_code, event_type, incident_overview, description, loc,
        latitude, longitude, date_time, status, fir_number, reporter_id,
        is_anonymous, keyphrase_hash, keyphrase_hint, created_at, updated_at
    ) VALUES (
        'RPT-2026-IND05',
        'Assault',
        'Two motorcycle-borne youth assaulted commuter and snatched gold chain and handbag outside Metro Gate 3.',
        'At approximately 8:45 PM near Park Street Metro Gate 3 exit, victim was attacked from behind while answering phone call. Attackers on a black Bajaj Pulsar without registration plate grabbed victim gold necklace and leather shoulder bag containing original academic credentials and Rs 15,000 cash before speeding off towards Russell Street.',
        'Park Street Metro Exit 3, Chowringhee Road, Kolkata',
        22.5516, 88.3519,
        NOW() - INTERVAL '5 days',
        'CLOSED',
        'FIR-KOL-2026-CR551',
        v_citizen_id,
        true,
        '$2a$10$vG9P0hR5J7o7kY7X3M4.E.cOa3tO1Vl1h8LwVqY7k3x6m5o9p1u2y',
        'kolkata-parkst-metro',
        NOW() - INTERVAL '5 days',
        NOW() - INTERVAL '1 day'
    ) RETURNING id INTO v_rpt_id;

    INSERT INTO incident_officials (
        report_id, official_name, badge_number, department, designation,
        contact_info, first_report_taker, arrival_time, duties_summary, recorded_at, recorded_by
    ) VALUES (
        v_rpt_id,
        'Sub-Inspector Soumen Banerjee',
        'WB-KP-3321',
        'Kolkata Police - Shakespeare Sarani PS',
        'Sub-Inspector of Police',
        'si.banerjee@kolkatapolice.gov.in',
        true,
        NOW() - INTERVAL '5 days' + INTERVAL '30 minutes',
        'Victim escorted to hospital for first-aid; CCTV grid tracking enabled across Park St.',
        NOW() - INTERVAL '5 days' + INTERVAL '30 minutes',
        'admin'
    );

    INSERT INTO audit_logs (
        report_id, action, performed_by, user_role, details, previous_value, new_value, timestamp
    ) VALUES (
        v_rpt_id, 'REPORT_CREATED', 'Anonymous Reporter', 'CITIZEN',
        'Initial incident report filed [RPT-2026-IND05]: Assault at Park Street, Kolkata',
        NULL, 'PENDING', NOW() - INTERVAL '5 days'
    ), (
        v_rpt_id, 'STATUS_UPDATED', 'admin', 'ADMIN',
        'Status transitioned from [INVESTIGATING] to [CLOSED] following recovery of stolen articles and suspect arrest',
        'INVESTIGATING', 'CLOSED', NOW() - INTERVAL '1 day'
    );


    -- 6. Chennai: Marina Beach Missing Child Promptly Recovered
    INSERT INTO reports (
        reference_code, event_type, incident_overview, description, loc,
        latitude, longitude, date_time, status, fir_number, reporter_id,
        is_anonymous, keyphrase_hash, keyphrase_hint, created_at, updated_at
    ) VALUES (
        'RPT-2026-IND06',
        'Missing person',
        '7-year-old child separated from family during crowded Sunday evening festivities near Gandhi Statue.',
        'Child named Aarav wearing yellow t-shirt and blue denim shorts lost sight of parents around 6:15 PM near the ice-cream carts near Gandhi Statue. Lifeguard towers and beach police patrol were alerted on loudspeaker. Child was traced safe by coastal police near Light House within 50 minutes.',
        'Marina Beach promenade near Gandhi Statue, Kamarajar Salai, Chennai',
        13.0475, 80.2824,
        NOW() - INTERVAL '6 days',
        'RESOLVED',
        'FIR-CHN-2026-MP128',
        v_police_id,
        false,
        '$2a$10$vG9P0hR5J7o7kY7X3M4.E.cOa3tO1Vl1h8LwVqY7k3x6m5o9p1u2y',
        'chennai-marina-safety',
        NOW() - INTERVAL '6 days',
        NOW() - INTERVAL '5 days'
    ) RETURNING id INTO v_rpt_id;

    INSERT INTO incident_officials (
        report_id, official_name, badge_number, department, designation,
        contact_info, first_report_taker, arrival_time, duties_summary, recorded_at, recorded_by
    ) VALUES (
        v_rpt_id,
        'Inspector Priya Natarajan',
        'TN-POL-5482',
        'Greater Chennai Police - Coastal Security Wing',
        'Inspector of Police',
        'priya.natarajan@tnpolice.gov.in',
        true,
        NOW() - INTERVAL '6 days' + INTERVAL '10 minutes',
        'Coordinated beach ATV search squad and public address announcement.',
        NOW() - INTERVAL '6 days' + INTERVAL '10 minutes',
        'sgt_reynolds'
    );

    INSERT INTO audit_logs (
        report_id, action, performed_by, user_role, details, previous_value, new_value, timestamp
    ) VALUES (
        v_rpt_id, 'REPORT_CREATED', 'Inspector Priya Natarajan', 'POLICE',
        'Initial incident report filed [RPT-2026-IND06]: Missing person at Marina Beach, Chennai',
        NULL, 'PENDING', NOW() - INTERVAL '6 days'
    ), (
        v_rpt_id, 'STATUS_UPDATED', 'Inspector Priya Natarajan', 'POLICE',
        'Status transitioned from [INVESTIGATING] to [RESOLVED] upon successful child reunification with parents',
        'INVESTIGATING', 'RESOLVED', NOW() - INTERVAL '5 days'
    );


    -- 7. Jaipur: Heritage Market Antique & Jewelry Shoplifting
    INSERT INTO reports (
        reference_code, event_type, incident_overview, description, loc,
        latitude, longitude, date_time, status, fir_number, reporter_id,
        is_anonymous, keyphrase_hash, keyphrase_hint, created_at, updated_at
    ) VALUES (
        'RPT-2026-IND07',
        'Theft',
        'Diversion theft of antique Kundan gemstone necklace from handicraft emporium by gang of 3 suspects posing as international tourists.',
        'At 3:15 PM inside Johari Bazaar emporium, three individuals arrived speaking foreign accents. Two distracted the master craftsman with inquiries about silver carvings while the third slipped an authentic 18k gold Kundan-jadau gemstone necklace worth Rs. 6.2 Lakh from an unlatched glass display counter into an overcoat pocket.',
        'Johari Bazaar Main Street, Walled City, Jaipur',
        26.9239, 75.8267,
        NOW() - INTERVAL '12 hours',
        'PENDING',
        NULL,
        v_citizen_id,
        true,
        '$2a$10$vG9P0hR5J7o7kY7X3M4.E.cOa3tO1Vl1h8LwVqY7k3x6m5o9p1u2y',
        'jaipur-johari-bazaar',
        NOW() - INTERVAL '12 hours',
        NOW() - INTERVAL '12 hours'
    ) RETURNING id INTO v_rpt_id;

    INSERT INTO audit_logs (
        report_id, action, performed_by, user_role, details, previous_value, new_value, timestamp
    ) VALUES (
        v_rpt_id, 'REPORT_CREATED', 'Anonymous Reporter', 'CITIZEN',
        'Initial incident report filed [RPT-2026-IND07]: Theft at Johari Bazaar, Jaipur',
        NULL, 'PENDING', NOW() - INTERVAL '12 hours'
    );

END $$;

