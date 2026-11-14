package com.example.backend.config;

import com.example.backend.model.*;
import com.example.backend.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final ReportRepository reportRepository;
    private final IncidentOfficialRepository officialRepository;
    private final WitnessRepository witnessRepository;
    private final AuditLogRepository auditLogRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(
            UserRepository userRepository,
            ReportRepository reportRepository,
            IncidentOfficialRepository officialRepository,
            WitnessRepository witnessRepository,
            AuditLogRepository auditLogRepository,
            PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.reportRepository = reportRepository;
        this.officialRepository = officialRepository;
        this.witnessRepository = witnessRepository;
        this.auditLogRepository = auditLogRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        // 1. Seed Users if empty
        User admin = userRepository.findByUsername("admin").orElse(null);
        if (admin == null) {
            admin = new User();
            admin.setUsername("admin");
            admin.setEmail("admin@drs.internal");
            admin.setPasswordHash(passwordEncoder.encode("Admin@123456"));
            admin.setRole("ADMIN");
            admin.setEmailVerified(true);
            admin.setBadgeNumber("DRS-ADMIN-01");
            admin.setDepartmentOrOrg("Central Operations");
            admin.setDesignation("System Administrator");
            admin = userRepository.save(admin);
        }

        User police = userRepository.findByUsername("sgt_reynolds").orElse(null);
        if (police == null) {
            police = new User();
            police.setUsername("sgt_reynolds");
            police.setEmail("sgt.reynolds@police.gov.in");
            police.setPasswordHash(passwordEncoder.encode("Police@123456"));
            police.setRole("POLICE");
            police.setEmailVerified(true);
            police.setBadgeNumber("DL-IPS-7704");
            police.setDepartmentOrOrg("Cyber Crime Cell IFSO Dwarka");
            police.setDesignation("Assistant Commissioner");
            police = userRepository.save(police);
        }

        User citizen = userRepository.findByUsername("ananya_citizen").orElse(null);
        if (citizen == null) {
            citizen = new User();
            citizen.setUsername("ananya_citizen");
            citizen.setEmail("ananya.sharma@example.com");
            citizen.setPasswordHash(passwordEncoder.encode("Citizen@123456"));
            citizen.setRole("CITIZEN");
            citizen.setEmailVerified(true);
            citizen = userRepository.save(citizen);
        }

        User journalist = userRepository.findByUsername("ravi_journalist").orElse(null);
        if (journalist == null) {
            journalist = new User();
            journalist.setUsername("ravi_journalist");
            journalist.setEmail("ravi@dailychronicle.in");
            journalist.setPasswordHash(passwordEncoder.encode("Journalist@123456"));
            journalist.setRole("JOURNALIST");
            journalist.setEmailVerified(true);
            journalist.setDepartmentOrOrg("Daily Chronicle");
            journalist.setDesignation("Senior Investigative Reporter");
            journalist = userRepository.save(journalist);
        }

        // 2. Seed Reports if empty
        if (reportRepository.count() == 0) {
            System.out.println("🌱 Database is empty. Seeding 7 Indian incident dossiers into Neon PostgreSQL...");

            String sampleKeyHash = "$2a$10$vG9P0hR5J7o7kY7X3M4.E.cOa3tO1Vl1h8LwVqY7k3x6m5o9p1u2y";

            // 1. New Delhi
            Report r1 = new Report();
            r1.setReferenceCode("RPT-2026-IND01");
            r1.setEventType("Fraud / Cybercrime");
            r1.setIncidentOverview("Senior citizen targeted by deceptive SIM-block KYC SMS leading to unauthorized net-banking fund transfers.");
            r1.setDescription("Victim received an urgent SMS claiming electric meter disconnection and SIM deactivation within 24 hours. The caller impersonated a telecom officer, instructing installation of remote desktop software (AnyDesk) and initiating 3 unauthorized transactions totaling Rs. 4,85,000 to suspect accounts in Jamtara & Mewat clusters.");
            r1.setLoc("Connaught Place, Inner Circle, New Delhi");
            r1.setLatitude(28.6315);
            r1.setLongitude(77.2167);
            r1.setDateTime(LocalDateTime.now().minusDays(3));
            r1.setStatus("INVESTIGATING");
            r1.setFirNumber("FIR-DEL-2026-CY091");
            r1.setReporter(citizen);
            r1.setAnonymous(false);
            r1.setThreatLevel("MEDIUM");
            r1.setImportance("ROUTINE");
            r1.setKeyphraseHash(sampleKeyHash);
            r1.setKeyphraseHint("delhi-cyber-safe");
            r1.setCreatedAt(LocalDateTime.now().minusDays(3));
            r1.setUpdatedAt(LocalDateTime.now().minusDays(1));
            r1 = reportRepository.save(r1);

            IncidentOfficial o1 = new IncidentOfficial();
            o1.setReport(r1);
            o1.setOfficialName("ACP Vikram Rathore");
            o1.setBadgeNumber("DL-IPS-7704");
            o1.setDepartment("Delhi Police - Cyber Crime Cell IFSO Dwarka");
            o1.setDesignation("Assistant Commissioner of Police");
            o1.setContactInfo("acp-cyber.delhi@gov.in");
            o1.setFirstReportTaker(true);
            o1.setArrivalTime(LocalDateTime.now().minusDays(3).plusHours(1));
            o1.setDutiesSummary("Issued Section 91 notices to nodal banks and freeze requests to payment gateway accounts.");
            o1.setRecordedBy("sgt_reynolds");
            officialRepository.save(o1);

            Witness w1 = new Witness();
            w1.setReport(r1);
            w1.setWitnessName("Ananya Sharma");
            w1.setContactDetails("+91 98101 23456");
            w1.setStatement("Assisted the elderly neighbor in calling National Cyber Crime helpline 1930 immediately after noticing suspicious OTP requests.");
            w1.setWitnessType("INITIAL_SOURCE");
            w1.setLocationObserved("Block B Connaught Place, New Delhi");
            w1.setTimeObserved(LocalDateTime.now().minusDays(3));
            w1.setRecordedBy("ACP Vikram Rathore");
            w1.setRecordedByRole("POLICE");
            w1.setVerificationStatus("OFFICIALLY_VERIFIED");
            w1.setVerificationScore(98);
            w1.setVerificationNotes("Bank transaction timestamps precisely matched telecom call logs.");
            witnessRepository.save(w1);

            // 2. Mumbai
            Report r2 = new Report();
            r2.setReferenceCode("RPT-2026-IND02");
            r2.setEventType("Traffic incident");
            r2.setIncidentOverview("Speeding black luxury SUV collided with roadside barrier and food cart near Marine Drive promenade before fleeing towards Nariman Point.");
            r2.setDescription("Around 11:30 PM, a black imported sedan/SUV speeding past the promenade lost control near the flyover curve, severely damaging a vendor cart and grazing a pedestrian. Driver fled southbound towards Nariman Point without stopping. Partial registration plate observed: MH-01-XX-9009.");
            r2.setLoc("Marine Drive Promenade, Netaji Subhash Chandra Bose Road, Mumbai");
            r2.setLatitude(18.9438);
            r2.setLongitude(72.8233);
            r2.setDateTime(LocalDateTime.now().minusDays(1).minusHours(6));
            r2.setStatus("UNDER_REVIEW");
            r2.setFirNumber("FIR-MUM-2026-TR882");
            r2.setReporter(police);
            r2.setAnonymous(false);
            r2.setThreatLevel("HIGH");
            r2.setImportance("PRIORITY");
            r2.setKeyphraseHash(sampleKeyHash);
            r2.setKeyphraseHint("mumbai-coastal-cctv");
            r2.setCreatedAt(LocalDateTime.now().minusDays(1).minusHours(5));
            r2.setUpdatedAt(LocalDateTime.now().minusDays(1).minusHours(2));
            r2 = reportRepository.save(r2);

            IncidentOfficial o2 = new IncidentOfficial();
            o2.setReport(r2);
            o2.setOfficialName("Senior PI Rajesh Mane");
            o2.setBadgeNumber("MH-POL-1089");
            o2.setDepartment("Marine Drive Police Station - Traffic Division");
            o2.setDesignation("Senior Police Inspector");
            o2.setContactInfo("pi.marinedrive@mahapolice.gov.in");
            o2.setFirstReportTaker(true);
            o2.setDutiesSummary("Secured intersection CCTV footage and impounded debris from vehicle front bumper.");
            o2.setRecordedBy("sgt_reynolds");
            officialRepository.save(o2);

            // 3. Bengaluru
            Report r3 = new Report();
            r3.setReferenceCode("RPT-2026-IND03");
            r3.setEventType("Theft");
            r3.setIncidentOverview("Break-in into co-working office overnight; 14 developer workstations and encrypted server hardware taken.");
            r3.setDescription("Unidentified perpetrators bypassed magnetic swipe lock system on the 3rd floor between 02:30 AM and 04:15 AM. 14 Apple M-series laptops, external RAID backup storage disks, and testing handhelds were systematically stolen from workstation desks. Server rack enclosure was forcibly pried open.");
            r3.setLoc("Outer Ring Road, Bellandur EcoWorld Tech Park, Bengaluru");
            r3.setLatitude(12.9260);
            r3.setLongitude(77.6836);
            r3.setDateTime(LocalDateTime.now().minusDays(4));
            r3.setStatus("INVESTIGATING");
            r3.setFirNumber("FIR-BLR-2026-CC104");
            r3.setReporter(citizen);
            r3.setAnonymous(true);
            r3.setThreatLevel("MEDIUM");
            r3.setImportance("ROUTINE");
            r3.setKeyphraseHash(sampleKeyHash);
            r3.setKeyphraseHint("ecoworld-bengaluru-tech");
            r3.setCreatedAt(LocalDateTime.now().minusDays(4));
            r3.setUpdatedAt(LocalDateTime.now().minusDays(2));
            r3 = reportRepository.save(r3);

            IncidentOfficial o3 = new IncidentOfficial();
            o3.setReport(r3);
            o3.setOfficialName("Inspector Ramesh Rao");
            o3.setBadgeNumber("KA-POL-4921");
            o3.setDepartment("Bellandur Police Station - Crime Branch");
            o3.setDesignation("Police Inspector");
            o3.setContactInfo("ramesh.rao@ksp.gov.in");
            o3.setFirstReportTaker(true);
            o3.setDutiesSummary("Fingerprint forensic squad deployed; smart-card badge access logs extracted.");
            o3.setRecordedBy("admin");
            officialRepository.save(o3);

            // 4. Hyderabad
            Report r4 = new Report();
            r4.setReferenceCode("RPT-2026-IND04");
            r4.setEventType("Public safety");
            r4.setIncidentOverview("Pungent sulfur gas odor and illegal discharge of untreated chemical effluent into stormwater drainage channel.");
            r4.setDescription("Residents of nearby colonies alerted municipal teams regarding burning eye sensation and noxious yellowish fumes emanating from an unauthorized private warehouse back-gate during pre-dawn hours. Tanker truck observed discharging industrial chemical sludge into the storm sewer canal connecting to water bodies.");
            r4.setLoc("IDA Jeedimetla Phase III, Medchal-Malkajgiri, Hyderabad");
            r4.setLatitude(17.5186);
            r4.setLongitude(78.4482);
            r4.setDateTime(LocalDateTime.now().minusDays(2));
            r4.setStatus("RESOLVED");
            r4.setFirNumber("FIR-HYD-2026-ENV402");
            r4.setReporter(journalist);
            r4.setAnonymous(false);
            r4.setThreatLevel("HIGH");
            r4.setImportance("PRIORITY");
            r4.setKeyphraseHash(sampleKeyHash);
            r4.setKeyphraseHint("hyderabad-env-watch");
            r4.setCreatedAt(LocalDateTime.now().minusDays(2));
            r4.setUpdatedAt(LocalDateTime.now().minusHours(6));
            r4 = reportRepository.save(r4);

            IncidentOfficial o4 = new IncidentOfficial();
            o4.setReport(r4);
            o4.setOfficialName("K. Venkat Reddy");
            o4.setBadgeNumber("TS-PCB-619");
            o4.setDepartment("Telangana Pollution Control Board - Task Force");
            o4.setDesignation("Senior Environmental Engineer");
            o4.setContactInfo("ee-taskforce@pcb.telangana.gov.in");
            o4.setFirstReportTaker(true);
            o4.setDutiesSummary("Water sample bottles collected; premises sealed under Water Act Section 33A.");
            o4.setRecordedBy("admin");
            officialRepository.save(o4);

            // 5. Kolkata
            Report r5 = new Report();
            r5.setReferenceCode("RPT-2026-IND05");
            r5.setEventType("Assault");
            r5.setIncidentOverview("Two motorcycle-borne youth assaulted commuter and snatched gold chain and handbag outside Metro Gate 3.");
            r5.setDescription("At approximately 8:45 PM near Park Street Metro Gate 3 exit, victim was attacked from behind while answering phone call. Attackers on a black Bajaj Pulsar without registration plate grabbed victim gold necklace and leather shoulder bag containing original academic credentials and Rs 15,000 cash before speeding off towards Russell Street.");
            r5.setLoc("Park Street Metro Exit 3, Chowringhee Road, Kolkata");
            r5.setLatitude(22.5516);
            r5.setLongitude(88.3519);
            r5.setDateTime(LocalDateTime.now().minusDays(5));
            r5.setStatus("CLOSED");
            r5.setFirNumber("FIR-KOL-2026-CR551");
            r5.setReporter(citizen);
            r5.setAnonymous(true);
            r5.setThreatLevel("HIGH");
            r5.setImportance("PRIORITY");
            r5.setKeyphraseHash(sampleKeyHash);
            r5.setKeyphraseHint("kolkata-parkst-metro");
            r5.setCreatedAt(LocalDateTime.now().minusDays(5));
            r5.setUpdatedAt(LocalDateTime.now().minusDays(1));
            r5 = reportRepository.save(r5);

            IncidentOfficial o5 = new IncidentOfficial();
            o5.setReport(r5);
            o5.setOfficialName("Sub-Inspector Soumen Banerjee");
            o5.setBadgeNumber("WB-KP-3321");
            o5.setDepartment("Kolkata Police - Shakespeare Sarani PS");
            o5.setDesignation("Sub-Inspector of Police");
            o5.setContactInfo("si.banerjee@kolkatapolice.gov.in");
            o5.setFirstReportTaker(true);
            o5.setDutiesSummary("Victim escorted to hospital for first-aid; CCTV grid tracking enabled across Park St.");
            o5.setRecordedBy("admin");
            officialRepository.save(o5);

            // 6. Chennai
            Report r6 = new Report();
            r6.setReferenceCode("RPT-2026-IND06");
            r6.setEventType("Missing person");
            r6.setIncidentOverview("7-year-old child separated from family during crowded Sunday evening festivities near Gandhi Statue.");
            r6.setDescription("Child named Aarav wearing yellow t-shirt and blue denim shorts lost sight of parents around 6:15 PM near the ice-cream carts near Gandhi Statue. Lifeguard towers and beach police patrol were alerted on loudspeaker. Child was traced safe by coastal police near Light House within 50 minutes.");
            r6.setLoc("Marina Beach promenade near Gandhi Statue, Kamarajar Salai, Chennai");
            r6.setLatitude(13.0475);
            r6.setLongitude(80.2824);
            r6.setDateTime(LocalDateTime.now().minusDays(6));
            r6.setStatus("RESOLVED");
            r6.setFirNumber("FIR-CHN-2026-MP128");
            r6.setReporter(police);
            r6.setAnonymous(false);
            r6.setThreatLevel("CRITICAL");
            r6.setImportance("URGENT");
            r6.setKeyphraseHash(sampleKeyHash);
            r6.setKeyphraseHint("chennai-marina-safety");
            r6.setCreatedAt(LocalDateTime.now().minusDays(6));
            r6.setUpdatedAt(LocalDateTime.now().minusDays(5));
            r6 = reportRepository.save(r6);

            IncidentOfficial o6 = new IncidentOfficial();
            o6.setReport(r6);
            o6.setOfficialName("Inspector Priya Natarajan");
            o6.setBadgeNumber("TN-POL-5482");
            o6.setDepartment("Greater Chennai Police - Coastal Security Wing");
            o6.setDesignation("Inspector of Police");
            o6.setContactInfo("priya.natarajan@tnpolice.gov.in");
            o6.setFirstReportTaker(true);
            o6.setDutiesSummary("Coordinated beach ATV search squad and public address announcement.");
            o6.setRecordedBy("sgt_reynolds");
            officialRepository.save(o6);

            // 7. Jaipur
            Report r7 = new Report();
            r7.setReferenceCode("RPT-2026-IND07");
            r7.setEventType("Theft");
            r7.setIncidentOverview("Diversion theft of antique Kundan gemstone necklace from handicraft emporium by gang of 3 suspects posing as international tourists.");
            r7.setDescription("At 3:15 PM inside Johari Bazaar emporium, three individuals arrived speaking foreign accents. Two distracted the master craftsman with inquiries about silver carvings while the third slipped an authentic 18k gold Kundan-jadau gemstone necklace worth Rs. 6.2 Lakh from an unlatched glass display counter into an overcoat pocket.");
            r7.setLoc("Johari Bazaar Main Street, Walled City, Jaipur");
            r7.setLatitude(26.9239);
            r7.setLongitude(75.8267);
            r7.setDateTime(LocalDateTime.now().minusHours(12));
            r7.setStatus("PENDING");
            r7.setFirNumber(null);
            r7.setReporter(citizen);
            r7.setAnonymous(true);
            r7.setThreatLevel("MEDIUM");
            r7.setImportance("ROUTINE");
            r7.setKeyphraseHash(sampleKeyHash);
            r7.setKeyphraseHint("jaipur-johari-bazaar");
            r7.setCreatedAt(LocalDateTime.now().minusHours(12));
            r7.setUpdatedAt(LocalDateTime.now().minusHours(12));
            r7 = reportRepository.save(r7);

            System.out.println("✅ DataInitializer: Successfully seeded 7 Indian incident dossiers into database!");
        }
    }
}
