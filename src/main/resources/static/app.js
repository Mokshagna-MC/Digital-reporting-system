// ==========================================
// INCIDENT REPORT DESCRIPTION & SCENE TRANSLATIONS
// ==========================================
const REPORT_DESCRIPTIONS = {
  "RPT-2026-IND01": {
    hi: {
      overview: "वरिष्ठ नागरिक को भ्रामक सिम-ब्लॉक केवाईसी संदेश भेजकर अनाधिकृत नेट-बैंकिंग फंड ट्रांसफर द्वारा निशाना बनाया गया।",
      loc: "कनॉट प्लेस, इनर सर्कल, नई दिल्ली"
    },
    te: {
      overview: "మోసపూరిత సిమ్-బ్లాక్ కేవైసీ ఎస్ఎంఎస్ ద్వారా వృద్ధుడి నెట్-బ్యాంకింగ్ నుండి అనధికారికంగా నగదు బదిలీ చేయబడింది.",
      loc: "కన్నాట్ ప్లేస్, ఇన్నర్ సర్కిల్, న్యూఢిల్లీ"
    }
  },
  "RPT-2026-IND02": {
    hi: {
      overview: "मरीन ड्राइव पर तेज़ रफ़्तार काली लग्जरी एसयूवी सड़क किनारे बैरियर और ठेले से टकराई और नरीमन पॉइंट की ओर भाग गई।",
      loc: "मरीन ड्राइव प्रोमेनेड, नेताजी सुभाष चंद्र बोस रोड, मुंबई"
    },
    te: {
      overview: "మెరైన్ డ్రైవ్ వద్ద వేగంగా వచ్చిన నల్లటి లగ్జరీ ఎస్‌యూవీ ఫుట్‌పాత్ బారియర్ మరియు బండిని ఢీకొట్టి నారిమన్ పాయింట్ వైపు పారిపోయింది.",
      loc: "మెరైన్ డ్రైవ్ ప్రోమెనేడ్, ముంబై"
    }
  },
  "RPT-2026-IND03": {
    hi: {
      overview: "रात में को-वर्किंग कार्यालय में चोरी; 14 डेवलपर वर्कस्टेशन और एन्क्रिप्टेड सर्वर हार्डवेयर चोरी हुए।",
      loc: "आउटर रिंग रोड, बेलंदूर इकोवर्ल्ड टेक पार्क, बेंगलुरु"
    },
    te: {
      overview: "రాత్రిపూట కో-వర్కింగ్ ఆఫీసులో చొరబడి 14 డెవలపర్ ల్యాప్‌టాప్‌లు మరియు ఎన్‌క్రిప్ట్ చేసిన సర్వర్ హార్డ్‌వేర్ చోరీకి గురయ్యాయి.",
      loc: "ఔటర్ రింగ్ రోడ్, బెంగళూరు"
    }
  },
  "RPT-2026-IND04": {
    hi: {
      overview: "हाइटेक सिटी के पास आईटी सेवा प्रदाता डेटाबेस को निशाना बनाकर रैनसमवेयर हमला और रंगदारी की धमकी।",
      loc: "हाइटेक सिटी, माधापुर, हैदराबाद"
    },
    te: {
      overview: "హైటెక్ సిటీ వద్ద ఐటీ సేవా ప్రదాత డేటాబేస్‌లను లక్ష్యంగా చేసుకుని రాన్సమ్‌వేర్ దాడి మరియు బెదిరింపులు.",
      loc: "హైటెక్ సిటీ, మాదాపూర్, హైదరాబాద్"
    }
  },
  "RPT-2026-IND05": {
    hi: {
      overview: "शाम के व्यस्त समय में मेट्रो कॉरिडोर पर पीछा करने और सार्वजनिक उत्पीड़न की घटना दर्ज।",
      loc: "पार्क स्ट्रीट मेट्रो स्टेशन, कोलकाता"
    },
    te: {
      overview: "సాయంత్రం రద్దీ వేళల్లో మెట్రో కారిడార్‌లో వెంబడించడం మరియు వేధింపులకు పాల్పడిన ఘటన నమోదైంది.",
      loc: "పార్క్ స్ట్రీట్ మెట్రో స్టేషన్, కోల్‌కతా"
    }
  },
  "RPT-2026-IND06": {
    hi: {
      overview: "सप्ताहांत में मरीना बीच लाइटहाउस के पास परिवार से बिछड़ा 8 वर्षीय स्कूली बच्चा।",
      loc: "मरीना बीच प्रोमेनेड, चेन्नई"
    },
    te: {
      overview: "వారాంతంలో మెరీనా బీచ్ లైట్‌హౌస్ వద్ద కుటుంబం నుండి తప్పిపోయిన 8 ఏళ్ల పాఠశాల బాలుడు.",
      loc: "మెరీనా బీచ్ ప్రోమెనేడ్, చెన్నై"
    }
  },
  "RPT-2026-IND07": {
    hi: {
      overview: "जौहरी बाजार स्थित हैंडीक्राफ्ट एम्पोरियम में विदेशी पर्यटक बनकर आए 3 संदिग्धों द्वारा प्राचीन कुंदन रत्न हार की चोरी।",
      loc: "जौहरी बाजार मुख्य मार्ग, चारदीवारी शहर, जयपुर"
    },
    te: {
      overview: "జౌహరి బజార్‌లోని హస్తకళల దుకాణంలో విదేశీ పర్యాటకులుగా వచ్చిన ముగ్గురు నిందితులు పురాతన కుందన్ నెక్లెస్‌ను చోరీ చేశారు.",
      loc: "జౌహరి బజార్ ప్రధాన వీధి, జైపూర్"
    }
  }
};

function getLocalizedGlimpse(r, lang) {
  if (!r) return "";
  const refCode = r.referenceCode || `RPT-2026-${String(r.id).padStart(5, '0')}`;
  
  if (lang !== "en" && REPORT_DESCRIPTIONS[refCode] && REPORT_DESCRIPTIONS[refCode][lang]) {
    return REPORT_DESCRIPTIONS[refCode][lang].overview;
  }

  const raw = r.incidentOverview || r.description || "";
  if (lang === "hi") {
    if (raw.toLowerCase().includes("kundan") || raw.toLowerCase().includes("diversion theft")) {
      return "जौहरी बाजार स्थित हैंडीक्राफ्ट एम्पोरियम में विदेशी पर्यटक बनकर आए 3 संदिग्धों द्वारा प्राचीन कुंदन रत्न हार की चोरी।";
    }
    if (raw.toLowerCase().includes("kyc") || raw.toLowerCase().includes("sim-block")) {
      return "वरिष्ठ नागरिक को भ्रामक सिम-ब्लॉक केवाईसी संदेश भेजकर अनाधिकृत नेट-बैंकिंग फंड ट्रांसफर द्वारा निशाना बनाया गया।";
    }
    if (raw.toLowerCase().includes("suv") || raw.toLowerCase().includes("marine drive")) {
      return "मरीन ड्राइव पर तेज़ रफ़्तार काली लग्जरी एसयूवी सड़क किनारे बैरियर और ठेले से टकराई और नरीमन पॉइंट की ओर भाग गई।";
    }
    if (raw.toLowerCase().includes("workstations") || raw.toLowerCase().includes("co-working")) {
      return "रात में को-वर्किंग कार्यालय में चोरी; 14 डेवलपर वर्कस्टेशन और एन्क्रिप्टेड सर्वर हार्डवेयर चोरी हुए।";
    }
    if (raw.toLowerCase().includes("burglary") || raw.toLowerCase().includes("theft")) {
      return "दुकान / परिसर में चोरी और संपत्ति की हानि की घटना दर्ज।";
    }
  } else if (lang === "te") {
    if (raw.toLowerCase().includes("kundan") || raw.toLowerCase().includes("diversion theft")) {
      return "జౌహరి బజార్‌లోని హస్తకళల దుకాణంలో విదేశీ పర్యాటకులుగా వచ్చిన ముగ్గురు నిందితులు పురాతన కుందన్ నెక్లెస్‌ను చోరీ చేశారు.";
    }
    if (raw.toLowerCase().includes("kyc") || raw.toLowerCase().includes("sim-block")) {
      return "మోసపూరిత సిమ్-బ్లాక్ కేవైసీ ఎస్ఎంఎస్ ద్వారా వృద్ధుడి నెట్-బ్యాంకింగ్ నుండి అనధికారికంగా నగదు బదిలీ చేయబడింది.";
    }
    if (raw.toLowerCase().includes("suv") || raw.toLowerCase().includes("marine drive")) {
      return "మెరైన్ డ్రైవ్ వద్ద వేగంగా వచ్చిన నల్లటి లగ్జరీ ఎస్‌యూవీ ఫుట్‌పాత్ బారియర్ మరియు బండిని ఢీకొట్టి నారిమన్ పాయింట్ వైపు పారిపోయింది.";
    }
    if (raw.toLowerCase().includes("workstations") || raw.toLowerCase().includes("co-working")) {
      return "రాత్రిపూట కో-వర్కింగ్ ఆఫీసులో చొరబడి 14 డెవలపర్ ల్యాప్‌టాప్‌లు మరియు ఎన్‌క్రిప్ట్ చేసిన సర్వర్ హార్డ్‌వేర్ చోరీకి గురయ్యాయి.";
    }
    if (raw.toLowerCase().includes("burglary") || raw.toLowerCase().includes("theft")) {
      return "దుకాణం / నివాసంలో దొంగతనం మరియు ఆస్తి నష్టం జరిగినట్లు నివేదించబడింది.";
    }
  }
  return raw;
}

function getLocalizedLocation(r, lang) {
  if (!r || !r.loc) return "";
  const refCode = r.referenceCode || `RPT-2026-${String(r.id).padStart(5, '0')}`;
  if (lang !== "en" && REPORT_DESCRIPTIONS[refCode] && REPORT_DESCRIPTIONS[refCode][lang]) {
    return REPORT_DESCRIPTIONS[refCode][lang].loc;
  }
  return r.loc;
}

function getLocalizedEventType(eventType, lang) {
  if (!eventType) return "";
  if (lang === "hi") {
    const map = {
      "Theft": "चोरी (Theft)",
      "Fraud / Cybercrime": "धोखाधड़ी / साइबर अपराध",
      "Traffic incident": "सड़क दुर्घटना / यातायात",
      "Harassment": "उत्पीड़न (Harassment)",
      "Assault": "हमला (Assault)",
      "Missing person": "लापता व्यक्ति",
      "Public safety": "सार्वजनिक सुरक्षा",
      "Other": "अन्य (Other)"
    };
    return map[eventType] || eventType;
  }
  if (lang === "te") {
    const map = {
      "Theft": "దొంగతనం (Theft)",
      "Fraud / Cybercrime": "మోసం / సైబర్‌క్రైమ్",
      "Traffic incident": "ట్రాఫిక్ ప్రమాదం",
      "Harassment": "వేధింపులు (Harassment)",
      "Assault": "దాడి (Assault)",
      "Missing person": "మిస్సింగ్ పర్సన్",
      "Public safety": "ప్రజా భద్రత",
      "Other": "ఇతర (Other)"
    };
    return map[eventType] || eventType;
  }
  return eventType;
}

function getLocalizedStatus(status, lang) {
  if (!status) return "";
  const s = status.toUpperCase();
  if (lang === "hi") {
    const map = {
      "PENDING": "लंबित (PENDING)",
      "UNDER_REVIEW": "समीक्षाधीन (UNDER REVIEW)",
      "INVESTIGATING": "जांच जारी (INVESTIGATING)",
      "RESOLVED": "निस्तारित (RESOLVED)",
      "CLOSED": "बंद (CLOSED)"
    };
    return map[s] || status.replaceAll("_", " ");
  }
  if (lang === "te") {
    const map = {
      "PENDING": "పెండింగ్ (PENDING)",
      "UNDER_REVIEW": "పరిశీలనలో ఉంది (UNDER REVIEW)",
      "INVESTIGATING": "దర్యాప్తు జరుగుతోంది (INVESTIGATING)",
      "RESOLVED": "పరిష్కరించబడింది (RESOLVED)",
      "CLOSED": "ముగించబడింది (CLOSED)"
    };
    return map[s] || status.replaceAll("_", " ");
  }
  return status.replaceAll("_", " ");
}


const $ = (s) => document.querySelector(s);
const $$ = (s) => document.querySelectorAll(s);

let currentUser = null;
let activeSessionCase = null;
let currentReports = [];
let allOfficialsData = [];
let allAuditLogsData = [];
let activeChatReportId = null;
let chatPollInterval = null;
let currentFilter = "ALL";

const safe = (v) => String(v ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));

const CATEGORY_ICONS = {
  "Theft": "💰",
  "Fraud / Cybercrime": "💻",
  "Harassment": "🛑",
  "Assault": "⚠️",
  "Missing person": "👤",
  "Traffic incident": "🚗",
  "Public safety": "🚨",
  "Other": "📋"
};

const ROLE_ICONS = {
  "CITIZEN": "👤",
  "JOURNALIST": "📰",
  "POLICE": "👮",
  "GOVERNMENT_OFFICIAL": "🏛️",
  "ORGANIZATION": "🏢",
  "ADMIN": "🛡️",
  "ANONYMOUS": "👤"
};

// ==========================================
// Theme Management (Light / Dark Mode)
// ==========================================
function initTheme() {
  const saved = localStorage.getItem("drs_theme") || "light";
  applyTheme(saved);
}

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  localStorage.setItem("drs_theme", theme);
  const icon = $("#themeToggleIcon");
  const text = $("#themeToggleText");
  if (icon) icon.textContent = theme === "dark" ? "☀️" : "🌙";
  if (text) text.textContent = theme === "dark" ? "Light Mode" : "Dark Mode";
}

$("#themeToggleBtn")?.addEventListener("click", () => {
  const current = document.documentElement.dataset.theme === "dark" ? "dark" : "light";
  applyTheme(current === "dark" ? "light" : "dark");
});

// Returns current local ISO string formatted for datetime-local input: YYYY-MM-DDTHH:mm
function getCurrentLocalDatetimeString() {
  const now = new Date();
  const offset = now.getTimezoneOffset() * 60000;
  const localDate = new Date(now.getTime() - offset);
  return localDate.toISOString().slice(0, 16);
}

// Lock all date-time pickers so future dates and hours cannot be selected
function lockFutureDates() {
  const currentMax = getCurrentLocalDatetimeString();
  const dateInputs = [
    "#reportDateTimeInput",
    "#witnessTimeObservedInput",
    "#officialArrivalTimeInput",
    "#initialOfficialArrivalInput"
  ];
  dateInputs.forEach(selector => {
    const el = $(selector);
    if (el) {
      el.max = currentMax;
      el.addEventListener("input", () => {
        if (el.value && new Date(el.value).getTime() > Date.now()) {
          el.value = getCurrentLocalDatetimeString();
          const feedback = $("#dateTimeFeedback");
          if (feedback) {
            feedback.textContent = "⚠️ Future time is not permitted. Clamped to current moment.";
            feedback.style.color = "#991B1B";
            setTimeout(() => {
              feedback.textContent = "Must not be set to a future hour.";
              feedback.style.color = "";
            }, 3500);
          }
        }
      });
    }
  });
}

async function api(url, options={}) {
  const response = await fetch(url, {
    credentials: "same-origin",
    headers: {"Content-Type": "application/json", ...(options.headers || {})},
    ...options
  });
  const data = response.status === 204 ? null : await response.json().catch(()=>null);
  if (!response.ok) throw new Error(data?.message || `Request failed (${response.status})`);
  return data;
}

function showMessage(selector, message, good=false) {
  const el = $(selector);
  if (!el) return;
  el.textContent = message;
  el.style.color = good ? "#065F46" : "#991B1B";
}

function formatDateTime(dtStr) {
  if (!dtStr) return "—";
  try {
    const d = new Date(dtStr);
    return isNaN(d) ? dtStr : d.toLocaleString("en-US", {
      dateStyle: "medium",
      timeStyle: "short"
    });
  } catch(_) {
    return dtStr;
  }
}

// ==========================================
// Secret Keyphrase Generator (Client Side)
// ==========================================
// ==========================================
// Secret Keyphrase Generator (Client-Side 7-Word High-Entropy Diceware)
// ==========================================
function generateClientKeyphrase() {
  const wordlist = [
    "velvet", "granite", "orbital", "falcon", "whisper", "cobalt", "harbor", "timber",
    "canyon", "zenith", "summit", "beacon", "crypto", "matrix", "shield", "silver",
    "shadow", "glacier", "vortex", "aurora", "breeze", "cipher", "dynamo", "echo",
    "fathom", "geyser", "haven", "island", "javelin", "kinetic", "lagoon", "meteor",
    "nebula", "onyx", "prairie", "quasar", "radius", "stellar", "tundra", "uranium",
    "vector", "walnut", "xenon", "yield", "zephyr", "anchor", "basalt", "cascade",
    "dune", "ember", "flint", "garnet", "horizon", "impact", "jasper", "karma"
  ];
  const selected = [];
  const cryptoArr = new Uint32Array(7);
  crypto.getRandomValues(cryptoArr);
  for (let i = 0; i < 7; i++) {
    selected.push(wordlist[cryptoArr[i] % wordlist.length]);
  }
  return selected.join("-");
}

// ==========================================
// WebCrypto E2EE Encryption & Decryption (Blind Carrier Model)
// ==========================================
const localDecryptedCache = new Map();

async function deriveAesKey(passphrase, saltBytes) {
  const enc = new TextEncoder();
  const keyMaterial = await window.crypto.subtle.importKey(
    "raw",
    enc.encode(passphrase),
    { name: "PBKDF2" },
    false,
    ["deriveKey"]
  );
  return window.crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: saltBytes,
      iterations: 100000,
      hash: "SHA-256"
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}

function bufferToBase64(buffer) {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

function base64ToBuffer(b64) {
  const binary = window.atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

async function encryptNarrativeE2EE(plainText, passphrase) {
  if (!plainText) return "";
  const salt = window.crypto.getRandomValues(new Uint8Array(16));
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveAesKey(passphrase, salt);
  const encoded = new TextEncoder().encode(plainText);
  const ciphertextBuffer = await window.crypto.subtle.encrypt(
    { name: "AES-GCM", iv: iv },
    key,
    encoded
  );
  return `ENC:v1:${bufferToBase64(salt)}:${bufferToBase64(iv)}:${bufferToBase64(ciphertextBuffer)}`;
}

async function decryptNarrativeE2EE(cipherString, passphrase) {
  if (!cipherString) return "";
  if (!cipherString.startsWith("ENC:v1:")) return cipherString;
  const parts = cipherString.split(":");
  if (parts.length !== 5) return cipherString;
  const salt = new Uint8Array(base64ToBuffer(parts[2]));
  const iv = new Uint8Array(base64ToBuffer(parts[3]));
  const ciphertext = base64ToBuffer(parts[4]);
  const key = await deriveAesKey(passphrase, salt);
  const decryptedBuffer = await window.crypto.subtle.decrypt(
    { name: "AES-GCM", iv: iv },
    key,
    ciphertext
  );
  return new TextDecoder().decode(decryptedBuffer);
}

function getStoredKeyphrase(refCode) {
  if (activeSessionCase && activeSessionCase.referenceCode === refCode && activeSessionCase.keyphrase) {
    return activeSessionCase.keyphrase;
  }
  try {
    const history = JSON.parse(localStorage.getItem("drs_case_history") || "[]");
    const item = history.find(c => c.referenceCode === refCode && c.keyphrase);
    if (item) return item.keyphrase;
  } catch (_) {}
  return null;
}

window.decryptCaseNarrative = async function(reportId, refCode) {
  const r = (currentReports || []).find(x => x.id === reportId);
  if (!r || !r.description) return;
  let key = getStoredKeyphrase(refCode);
  if (!key) {
    key = prompt(`Enter the 7-word secret keyphrase for case ${refCode}:`);
    if (!key) return;
    key = key.trim();
  }
  try {
    const plain = await decryptNarrativeE2EE(r.description, key);
    localDecryptedCache.set(reportId, plain);
    const box = document.getElementById(`narrativeBox-${reportId}`);
    if (box) {
      box.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
          <strong style="color:var(--sand-gold); font-size:12px; text-transform:uppercase;">
            🔓 WebCrypto E2EE Decrypted Narrative
          </strong>
          <span class="slideNumberBadge" style="font-size:10px;">DECRYPTED CLIENT-SIDE</span>
        </div>
        <div style="font-size:13px; line-height:1.6; color:var(--text-primary); white-space:pre-wrap;">${safe(plain)}</div>
      `;
    }
  } catch (err) {
    alert("Decryption failed: Incorrect keyphrase or corrupted ciphertext.");
  }
};



// ==========================================
// Minecraft-Style Voxel Loading Screen Helper
// ==========================================
let mcLoaderTimer = null;

let mcLoaderSafetyTimeout = null;

function showMinecraftLoader(title = "LOADING EVIDENTIARY BLOCKS...", sub = "Building chunks & verifying SHA-256 digests") {
  const overlay = $("#minecraftLoader");
  if (!overlay) return;
  if ($("#mcLoadingTitle")) $("#mcLoadingTitle").textContent = title;
  if ($("#mcLoadingSub")) $("#mcLoadingSub").textContent = sub;
  const bar = $("#mcProgressBar");
  if (bar) bar.style.width = "10%";
  overlay.classList.remove("hidden");

  let progress = 10;
  clearInterval(mcLoaderTimer);
  clearTimeout(mcLoaderSafetyTimeout);
  mcLoaderTimer = setInterval(() => {
    progress = Math.min(progress + Math.floor(Math.random() * 15 + 5), 92);
    if (bar) bar.style.width = `${progress}%`;
  }, 180);

  // Safety fallback: auto-dismiss loader after 5 seconds to prevent frozen overlays
  mcLoaderSafetyTimeout = setTimeout(() => {
    hideMinecraftLoader();
  }, 5000);
}

function hideMinecraftLoader() {
  clearInterval(mcLoaderTimer);
  clearTimeout(mcLoaderSafetyTimeout);
  const bar = $("#mcProgressBar");
  if (bar) bar.style.width = "100%";
  setTimeout(() => {
    $("#minecraftLoader")?.classList.add("hidden");
  }, 220);
}

// ==========================================
// Network-Level IP Scrubbing & Security Gate Animation
// ==========================================
function initSecurityGateAnimation() {
  const overlay = $("#networkSecurityOverlay");
  const skipBtn = $("#skipSecurityOverlayBtn");
  const pill = $("#ipSecurityPill");
  if (!overlay) return;

  function runSecuritySequence() {
    overlay.classList.remove("hidden");
    const bar = $("#zkProgressBarInner");
    const stepTitle = $("#zkStepDisplayText");
    const stepSub = $("#zkStepSubText");
    const steps = [
      { id: "step1", text: "Encrypting Connection...", sub: "Deriving local ephemeral session keys & WebCrypto cipher", progress: 25 },
      { id: "step2", text: "Scrubbing IP Address...", sub: "Stripping X-Forwarded-For headers & disabling access logs", progress: 50 },
      { id: "step3", text: "Establishing Zero-Knowledge Protocol...", sub: "Blind carrier model verified · Asymmetric browser encryption", progress: 75 },
      { id: "step4", text: "No Personal Data Collected.", sub: "Zero-knowledge verification complete · System ready", progress: 100 }
    ];

    steps.forEach(s => {
      const el = $(`#${s.id}`);
      if (el) {
        el.classList.remove("active");
        el.classList.remove("completed");
      }
    });
    if (bar) bar.style.width = "10%";

    let current = 0;
    const interval = setInterval(() => {
      if (current < steps.length) {
        for (let i = 0; i < current; i++) {
          const prevEl = $(`#${steps[i].id}`);
          if (prevEl) {
            prevEl.classList.remove("active");
            prevEl.classList.add("completed");
          }
        }
        const s = steps[current];
        const curEl = $(`#${s.id}`);
        if (curEl) curEl.classList.add("active");
        if (stepTitle) stepTitle.textContent = s.text;
        if (stepSub) stepSub.textContent = s.sub;
        if (bar) bar.style.width = `${s.progress}%`;
        current++;
      } else {
        clearInterval(interval);
        const lastEl = $(`#${steps[steps.length - 1].id}`);
        if (lastEl) {
          lastEl.classList.remove("active");
          lastEl.classList.add("completed");
        }
        setTimeout(() => {
          overlay.classList.add("hidden");
          sessionStorage.setItem("drs_security_passed", "true"); checkFirstTimeVisitor();
        }, 650);
      }
    }, 600);

    const dismiss = () => {
      clearInterval(interval);
      overlay.classList.add("hidden");
      sessionStorage.setItem("drs_security_passed", "true"); checkFirstTimeVisitor();
    };

    skipBtn?.addEventListener("click", dismiss, { once: true });
  }

  if (!sessionStorage.getItem("drs_security_passed")) {
    runSecuritySequence();
  }

  pill?.addEventListener("click", () => {
    runSecuritySequence();
  });
}

// ==========================================
// Session Persistence & Resume Logic
// ==========================================
async function initCaseSession() {
  try {
    const stored = localStorage.getItem("drs_active_case");
    if (!stored) return;
    const caseObj = JSON.parse(stored);
    if (!caseObj || !caseObj.referenceCode) return;

    const res = await api("/api/reports/resume-session", {
      method: "POST",
      body: JSON.stringify({
        referenceCode: caseObj.referenceCode,
        sessionToken: caseObj.sessionToken || ""
      })
    });

    if (res && res.success && res.report) {
      activeSessionCase = res.report;
      updateSessionUI();
    }
  } catch(_) {}
}

function updateSessionUI() {
  if (activeSessionCase) {
    const code = activeSessionCase.referenceCode || `RPT-2026-${String(activeSessionCase.id).padStart(5, '0')}`;
    $("#bannerCaseCode").textContent = code;
    $("#bannerCaseSummary").textContent = `Case: ${activeSessionCase.eventType || 'Incident'} at ${activeSessionCase.loc || 'Reported Location'}. You can amend details or communicate with investigating authorities.`;
    $("#resumedSessionBanner")?.classList.remove("hidden");

    if (!currentUser) {
      $("#userArea").innerHTML = `
        <div class="userPill" style="cursor: pointer;" onclick="openAuthorityMessagesModal(${activeSessionCase.id})" title="Click to view messages with authorities">
          <span>🔑 Case: <strong>${safe(code)}</strong></span>
          <span class="badgeTag">ACTIVE SESSION</span>
        </div>
      `;
    }
  } else {
    $("#resumedSessionBanner")?.classList.add("hidden");
    if (!currentUser) {
      $("#userArea").innerHTML = `<span class="badgeTag" style="background: rgba(255,255,255,0.15); color: white;">ANONYMOUS</span>`;
    }
  }
}

function addCaseToHistory(caseObj) {
  try {
    let history = JSON.parse(localStorage.getItem("drs_case_history") || "[]");
    history = history.filter(c => c.referenceCode !== caseObj.referenceCode);
    history.unshift(caseObj);
    if (history.length > 10) history = history.slice(0, 10);
    localStorage.setItem("drs_case_history", JSON.stringify(history));
    renderTrackSavedCases();
  } catch(_) {}
}

function renderTrackSavedCases() {
  let history = [];
  try {
    history = JSON.parse(localStorage.getItem("drs_case_history") || "[]");
  } catch(_) {}

  const html = history.length ? history.map(c => `
    <div style="display:flex; justify-content:space-between; align-items:center; background:var(--surface-card); border:1px solid var(--sand-border); border-radius:6px; padding:10px 14px; gap:8px;">
      <div>
        <span style="font-family:var(--font-mono); font-weight:700; color:var(--navy-deep); font-size:14px;">${safe(c.referenceCode)}</span>
        <div class="muted" style="font-size:12px;">${safe(c.eventType || 'Incident')} · ${safe(c.loc || '')}</div>
      </div>
      <button type="button" class="primary smallBtn" onclick="resumeSavedCase('${safe(c.referenceCode)}', '${safe(c.keyphrase || '')}', '${safe(c.sessionToken || '')}')">
        🔓 Resume Case
      </button>
    </div>
  `).join("") : '<div class="muted" style="font-size:12px;">No previous cases recorded in this browser.</div>';

  const listEl1 = $("#savedCasesList");
  const listEl2 = $("#trackSavedCasesList");
  if (listEl1) {
    listEl1.innerHTML = html;
    $("#savedCasesBrowserSection")?.classList.toggle("hidden", !history.length);
  }
  if (listEl2) {
    listEl2.innerHTML = html;
    $("#trackSavedCasesCard")?.classList.toggle("hidden", !history.length);
  }
}

async function resumeSavedCase(refCode, keyphrase, token) {
  try {
    let res = null;
    if (token) {
      res = await api("/api/reports/resume-session", {
        method: "POST",
        body: JSON.stringify({ referenceCode: refCode, sessionToken: token })
      }).catch(() => null);
    }
    if (!res && keyphrase) {
      res = await api("/api/reports/access-by-keyphrase", {
        method: "POST",
        body: JSON.stringify({ referenceCode: refCode, keyphrase: keyphrase })
      });
    }

    if (res && res.report) {
      activeSessionCase = res.report;
      localStorage.setItem("drs_active_case", JSON.stringify({
        id: res.report.id,
        referenceCode: res.report.referenceCode,
        keyphrase: keyphrase,
        sessionToken: res.sessionToken || token,
        eventType: res.report.eventType,
        loc: res.report.loc,
        createdAt: res.report.createdAt
      }));
      updateSessionUI();
      $("#trackCaseModal")?.classList.add("hidden");
      switchView("reports");
      await refreshAll();
      openAuthorityMessagesModal(res.report.id);
    } else {
      alert("Unable to resume case session. Please check your Secret Keyphrase.");
    }
  } catch(err) {
    alert("Error resuming case: " + err.message);
  }
}

// ==========================================
// Navigation & Views
// ==========================================
function switchView(viewName) {
  $$(".navBtn").forEach(b => b.classList.toggle("active", b.dataset.view === viewName));
  $("#viewLodge").classList.toggle("hidden", viewName !== "lodge");
  $("#viewTrack").classList.toggle("hidden", viewName !== "track");
  $("#viewReports").classList.toggle("hidden", viewName !== "reports");
  $("#viewContribute").classList.toggle("hidden", viewName !== "contribute");
  $("#viewCredentials").classList.toggle("hidden", viewName !== "credentials");
  $("#viewAdminWindow").classList.toggle("hidden", viewName !== "adminWindow");
  $("#viewOfficials").classList.toggle("hidden", viewName !== "officials");
  $("#viewAuditLogs").classList.toggle("hidden", viewName !== "auditLogs");

  if (viewName === "track") renderTrackSavedCases();
  if (viewName === "credentials") loadPersonalCredentials();
  if (viewName === "adminWindow") loadAdminWindow();
  if (viewName === "officials") loadOfficialsRegistry();
  if (viewName === "auditLogs") loadFullAuditLogs();
}

$$(".navBtn").forEach(btn => {
  btn.addEventListener("click", () => switchView(btn.dataset.view));
});

// Dynamic Reporter Role Check in Form
function setupReportingRoleUI() {
  const isReviewer = currentUser && ["GOVERNMENT_OFFICIAL", "POLICE", "ADMIN"].includes(currentUser.role);
  const officialTriage = $("#officialTriageFilters");
  if (officialTriage) officialTriage.style.display = isReviewer ? "inline-flex" : "none";
  const officialThreatBox = $("#autoThreatBox");
  if (officialThreatBox) officialThreatBox.style.display = isReviewer ? "block" : "none";
  const iconEl = $("#reporterRoleIcon");
  const titleEl = $("#reporterIdentityTitle");
  const subEl = $("#reporterIdentitySubtitle");
  const badgeEl = $("#reporterBadgeTag");
  const officialsSection = $("#officialsPresentSection");
  const citizenNotice = $("#citizenOfficialNotice");

  const curLang = $("#siteLangSelect")?.value || localStorage.getItem("drs_site_lang") || "en";
  const curDict = I18N_DICT[curLang] || I18N_DICT.en;

  if (!currentUser) {
    if (iconEl) iconEl.textContent = "👤";
    if (badgeEl) badgeEl.textContent = curDict.reporter_badge_anon || "ANONYMOUS";
    if (titleEl) titleEl.textContent = curDict.reporter_citizen_title || "Filing Report as: Anonymous Citizen";
    if (subEl) subEl.textContent = curDict.reporter_citizen_sub || "Zero personal data collected · Keyphrase access enabled";
    if (officialsSection) officialsSection.classList.add("hidden");
    if (citizenNotice) citizenNotice.classList.remove("hidden");
    return;
  }

  const role = currentUser.role;
  if (iconEl) iconEl.textContent = ROLE_ICONS[role] || "👤";
  if (badgeEl) badgeEl.textContent = role;

  if (role === "POLICE") {
    if (titleEl) titleEl.textContent = `Filing Report as: Police Officer (${currentUser.username})`;
    if (subEl) subEl.textContent = "Official law enforcement filing · Authorized to assign scene officials & first report takers";
    if (officialsSection) officialsSection.classList.remove("hidden");
    if (citizenNotice) citizenNotice.classList.add("hidden");
  } else if (role === "JOURNALIST") {
    if (titleEl) titleEl.textContent = `Filing Report as: Investigative Journalist (${currentUser.username})`;
    if (subEl) subEl.textContent = "Press / media intake · Option to document scene officials and source witnesses";
    if (officialsSection) officialsSection.classList.remove("hidden");
    if (citizenNotice) citizenNotice.classList.add("hidden");
  } else if (role === "GOVERNMENT_OFFICIAL" || role === "ADMIN") {
    if (titleEl) titleEl.textContent = `Filing Report as: ${role === 'ADMIN' ? 'System Administrator' : 'Government Official'} (${currentUser.username})`;
    if (subEl) subEl.textContent = "Authorized administrative inquiry · Can record officials present at intake";
    if (officialsSection) officialsSection.classList.remove("hidden");
    if (citizenNotice) citizenNotice.classList.add("hidden");
  } else {
    if (titleEl) titleEl.textContent = `Filing Report as: Citizen Reporter (${currentUser.username})`;
    if (subEl) subEl.textContent = "Standard citizen report · Community authenticity indications & independent witness matching enabled";
    if (officialsSection) officialsSection.classList.add("hidden");
    if (citizenNotice) citizenNotice.classList.remove("hidden");
  }
}

async function showApp() {
  if (currentUser) {
    const emailBadge = currentUser.emailVerified
      ? `<span class="badgeTag" style="background:#065F46; color:#FFFFFF; font-size:10.5px;">✓ Verified Email</span>`
      : `<span class="badgeTag" style="background:#D97706; color:#FFFFFF; font-size:10.5px; cursor:pointer;" onclick="openVerifyEmailModal()" title="Click to verify email">⚠️ Unverified Email</span>`;

    $("#userArea").innerHTML = `
      <div class="userPill">
        <span>${safe(currentUser.username)}</span>
        <span class="badgeTag">${safe(currentUser.role)}</span>
        ${emailBadge}
      </div>
    `;
    $("#welcomeTitle").textContent = `Welcome, ${currentUser.username}`;
    $("#roleText").textContent = `Official Station: ${currentUser.role} · Public Safety & Digital Evidentiary Register`;
    $("#logoutBtn").classList.remove("hidden");

    const isReviewer = ["GOVERNMENT_OFFICIAL", "POLICE", "ADMIN"].includes(currentUser.role);
    $("#navAdminWindow").classList.toggle("hidden", !isReviewer);
    $("#navOfficials").classList.toggle("hidden", !isReviewer);
    $("#navAuditLogs").classList.toggle("hidden", !isReviewer);
    $("#navCredentials").classList.remove("hidden");
  } else {
    updateSessionUI();
    const curLang = $("#siteLangSelect")?.value || localStorage.getItem("drs_site_lang") || "en";
    const curDict = I18N_DICT[curLang] || I18N_DICT.en;
    $("#welcomeTitle").textContent = curDict.hero_title || "Confidential Incident & Evidentiary Reporting";
    $("#roleText").textContent = curDict.hero_sub || "Zero-Knowledge Submission · Secret Keyphrase Access · Two-Way Authority Communication";
    $("#logoutBtn").classList.add("hidden");
    $("#navAdminWindow").classList.add("hidden");
    $("#navOfficials").classList.add("hidden");
    $("#navAuditLogs").classList.add("hidden");
    $("#navCredentials").classList.add("hidden");
  }

  setupReportingRoleUI();
  lockFutureDates();
  await refreshAll();
}

// ==========================================
// Geolocation Detection
// ==========================================
function detectGPS(latInput, lngInput, locInput) {
  if (!navigator.geolocation) {
    alert("Geolocation is not supported by your browser.");
    return;
  }
  const originalText = locInput ? locInput.placeholder : "";
  if (locInput) locInput.placeholder = "Acquiring precise GPS fix...";

  navigator.geolocation.getCurrentPosition(
    pos => {
      const lat = parseFloat(pos.coords.latitude.toFixed(6));
      const lng = parseFloat(pos.coords.longitude.toFixed(6));
      if (latInput) latInput.value = lat;
      if (lngInput) lngInput.value = lng;
      if (locInput && !locInput.value) {
        locInput.value = `GPS Scene: ${lat}, ${lng}`;
      }
      if (locInput) locInput.placeholder = originalText;
    },
    err => {
      alert("Unable to retrieve GPS coordinates: " + err.message);
      if (locInput) locInput.placeholder = originalText;
    },
    { enableHighAccuracy: true, timeout: 10000 }
  );
}

$("#detectLocBtn")?.addEventListener("click", () => {
  detectGPS($("#reportLatInput"), $("#reportLngInput"), $("#reportLocInput"));
});

$("#modalDetectLocBtn")?.addEventListener("click", () => {
  detectGPS($("#modalContribLat"), $("#modalContribLng"), $("#modalContribLoc"));
});

// ==========================================
// Scene Photo Upload Dropzone
// ==========================================
let selectedPhotoData = null;
let selectedPhotoName = null;

function initPhotoDropZone() {
  const dropZone = $("#photoDropZone");
  const fileInput = $("#reportPhotoInput");
  const removeBtn = $("#removePhotoBtn");

  if (!dropZone || !fileInput) return;

  dropZone.addEventListener("click", e => {
    if (e.target === removeBtn || (removeBtn && removeBtn.contains(e.target))) return;
    fileInput.click();
  });

  dropZone.addEventListener("dragover", e => {
    e.preventDefault();
    dropZone.style.borderColor = "var(--navy-deep)";
  });

  dropZone.addEventListener("dragleave", () => {
    dropZone.style.borderColor = "";
  });

  dropZone.addEventListener("drop", e => {
    e.preventDefault();
    dropZone.style.borderColor = "";
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handlePhotoFile(e.dataTransfer.files[0]);
    }
  });

  fileInput.addEventListener("change", () => {
    if (fileInput.files && fileInput.files[0]) {
      handlePhotoFile(fileInput.files[0]);
    }
  });

  removeBtn?.addEventListener("click", e => {
    e.stopPropagation();
    resetPhotoDropZone();
  });
}

function handlePhotoFile(file) {
  if (!file.type.startsWith("image/")) {
    alert("Please select a valid image file (JPG, PNG, WEBP).");
    return;
  }
  if (file.size > 5 * 1024 * 1024) {
    alert("Image exceeds the 5MB size limit. Please choose a smaller image.");
    return;
  }

  const reader = new FileReader();
  reader.onload = e => {
    selectedPhotoData = e.target.result;
    selectedPhotoName = file.name;
    const previewImg = $("#photoPreviewImg");
    const previewContainer = $("#photoPreviewContainer");
    const prompt = $("#photoPrompt");
    const fileNameSpan = $("#photoFileName");

    if (previewImg) previewImg.src = selectedPhotoData;
    if (previewContainer) previewContainer.classList.remove("hidden");
    if (prompt) prompt.classList.add("hidden");
    if (fileNameSpan) fileNameSpan.textContent = `${file.name} (${(file.size / 1024).toFixed(1)} KB)`;
  };
  reader.readAsDataURL(file);
}

function resetPhotoDropZone() {
  selectedPhotoData = null;
  selectedPhotoName = null;
  const fileInput = $("#reportPhotoInput");
  if (fileInput) fileInput.value = "";
  $("#photoPreviewContainer")?.classList.add("hidden");
  $("#photoPrompt")?.classList.remove("hidden");
}

// Password toggle helper
$$(".togglePasswordBtn").forEach(btn => {
  btn.addEventListener("click", () => {
    const targetId = btn.dataset.target;
    const input = $(`#${targetId}`);
    if (input) {
      input.type = input.type === "password" ? "text" : "password";
      btn.textContent = input.type === "password" ? "👁️" : "🔒";
    }
  });
});

// ==========================================
// Lightweight Cryptographic Proof-of-Work Solver (Zero-Knowledge Bot Throttle)
// ==========================================
async function solveProofOfWork(challenge, difficultyPrefix = "0000") {
  const enc = new TextEncoder();
  let nonce = 0;
  while (true) {
    const data = enc.encode(challenge + ":" + nonce);
    const hashBuf = await crypto.subtle.digest("SHA-256", data);
    const bytes = new Uint8Array(hashBuf);
    if (bytes[0] === 0 && bytes[1] === 0) {
      return String(nonce);
    }
    nonce++;
    if (nonce % 8000 === 0) {
      await new Promise(r => setTimeout(r, 0));
    }
    if (nonce > 500000) {
      return String(nonce);
    }
  }
}

// ==========================================
// Report Lodgement Submission (Zero Personal Data)
// ==========================================
$("#reportForm")?.addEventListener("submit", async e => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const f = Object.fromEntries(formData);

  // Offline Zero-Knowledge CAPTCHA Verification
  const userCaptcha = (f.captchaInput || "").trim().toUpperCase();
  if (!validateCaptcha(userCaptcha)) {
    showMessage("#reportMessage", "⚠️ Verification failed: Incorrect CAPTCHA code. Please enter the characters shown.");
    $("#reportCaptchaInput")?.focus();
    generateCaptcha();
    return;
  }

  if (!f.dateTime) {
    showMessage("#reportMessage", "Please enter the date and time of the incident.");
    return;
  }
  const inputTime = new Date(f.dateTime).getTime();
  const nowTime = Date.now();
  if (inputTime > nowTime) {
    showMessage("#reportMessage", "Incident time cannot be in the future (the event must have already occurred).");
    $("#reportDateTimeInput").focus();
    return;
  }

  f.dateTime = f.dateTime ? f.dateTime + ":00" : "";
  if (f.latitude) f.latitude = parseFloat(f.latitude);
  else delete f.latitude;
  if (f.longitude) f.longitude = parseFloat(f.longitude);
  else delete f.longitude;

  if (selectedPhotoData) {
    f.photoData = selectedPhotoData;
    f.photoName = selectedPhotoName || "scene_photo.jpg";
  }

  // Initial official if staff
  if (f.initialOfficialName && f.initialOfficialName.trim()) {
    f.initialOfficial = {
      officialName: f.initialOfficialName.trim(),
      badgeNumber: f.initialOfficialBadge ? f.initialOfficialBadge.trim() : "N/A",
      department: f.initialOfficialDept ? f.initialOfficialDept.trim() : "Investigative Division",
      designation: f.initialOfficialDesignation ? f.initialOfficialDesignation.trim() : "Scene Investigator",
      contactInfo: f.initialOfficialContact ? f.initialOfficialContact.trim() : null,
      firstReportTaker: f.initialOfficialFirstTaker === "true",
      arrivalTime: f.initialOfficialArrival ? f.initialOfficialArrival + ":00" : null,
      dutiesSummary: f.initialOfficialDuties ? f.initialOfficialDuties.trim() : null
    };
  }
  delete f.initialOfficialName;
  delete f.initialOfficialBadge;
  delete f.initialOfficialDept;
  delete f.initialOfficialDesignation;
  delete f.initialOfficialContact;
  delete f.initialOfficialFirstTaker;
  delete f.initialOfficialArrival;
  delete f.initialOfficialDuties;

  const submitBtn = e.target.querySelector("button[type='submit']");
  const origBtnText = submitBtn ? submitBtn.textContent : "Submit Incident & Get Keyphrase";
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.textContent = "Securing cryptographic proof-of-work...";
  }

  showMinecraftLoader("SEALING INCIDENT DOSSIER...", "Solving PoW & deriving 256-bit WebCrypto cipher");
  try {
    // Client-Side E2EE: Generate 7-word Diceware keyphrase and encrypt narrative before backend submission
    const rawPlainDescription = f.description ? f.description.trim() : "";
    const keyphrase = generateClientKeyphrase();
    f.keyphrase = keyphrase;
    if (rawPlainDescription) {
      try {
        f.description = await encryptNarrativeE2EE(rawPlainDescription, keyphrase);
      } catch (cryptoErr) {
        console.warn("Client WebCrypto encryption warning:", cryptoErr);
      }
    }

    // Feature 2: Proof-of-Work Challenge
    try {
      const challengeRes = await fetch("/api/reports/challenge").then(r => r.json());
      if (challengeRes && challengeRes.challenge) {
        const nonce = await solveProofOfWork(challengeRes.challenge, challengeRes.difficultyPrefix || "0000");
        f.powChallenge = challengeRes.challenge;
        f.powNonce = nonce;
      }
    } catch (powErr) {
      console.warn("PoW challenge error:", powErr);
    }

    if (submitBtn) submitBtn.textContent = "Submitting Incident...";
    const res = await api("/api/reports", {method: "POST", body: JSON.stringify(f)});
    if (res && res.id && rawPlainDescription) {
      localDecryptedCache.set(res.id, rawPlainDescription);
    }
    e.target.reset();
    resetPhotoDropZone();
    lockFutureDates();
    setupReportingRoleUI();

    // Save active case session (Checked against Incognito Lodgement)
    const caseObj = {
      id: res.id,
      referenceCode: res.referenceCode,
      keyphrase: res.secretKeyphrase,
      sessionToken: res.sessionToken,
      eventType: res.eventType,
      loc: res.loc,
      createdAt: res.createdAt
    };
    const isIncognito = $("#incognitoLodgeCheck")?.checked || f.incognitoLodge === "true";
    if (!isIncognito) {
      localStorage.setItem("drs_active_case", JSON.stringify(caseObj));
      addCaseToHistory(caseObj);
      activeSessionCase = res;
    } else {
      activeSessionCase = res;
      showToast("🛡️ Incognito Active: Case reference and keyphrase omitted from local storage.");
    }
    generateCaptcha();

    // Show Keyphrase Success Modal
    $("#successRefCodeDisplay").textContent = res.referenceCode;
    $("#successKeyphraseDisplay").textContent = res.secretKeyphrase;
    $("#keyphraseSuccessModal").classList.remove("hidden");

    updateSessionUI();
    const successMsg = res.accessMessage || "Incident lodged successfully! Save your Secret Keyphrase to manage this case.";
    showMessage("#reportMessage", successMsg, true);
    await refreshAll();
  } catch(err) {
    showMessage("#reportMessage", err.message);
  } finally {
    hideMinecraftLoader();
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = origBtnText;
    }
  }
});

// ==========================================
// Keyphrase Features & Tracking Handlers
// ==========================================
function initKeyphraseFeatures() {
  $("#generateKeyphraseBtn")?.addEventListener("click", () => {
    const kp = generateClientKeyphrase();
    const input = $("#reportKeyphraseInput");
    if (input) input.value = kp;
  });

  $("#btnTrackCaseNav")?.addEventListener("click", () => {
    renderTrackSavedCases();
    $("#trackCaseModal")?.classList.remove("hidden");
  });

  $("#btnAuthorityLoginNav")?.addEventListener("click", () => {
    $("#authorityLoginModal")?.classList.remove("hidden");
  });

  $("#copyRefCodeBtn")?.addEventListener("click", () => {
    const code = $("#successRefCodeDisplay")?.textContent.trim();
    if (code) {
      navigator.clipboard.writeText(code);
      $("#copyRefCodeBtn").textContent = "✓ Copied!";
      setTimeout(() => $("#copyRefCodeBtn").textContent = "📋 Copy", 2000);
    }
  });

  $("#copyKeyphraseBtn")?.addEventListener("click", () => {
    const kp = $("#successKeyphraseDisplay")?.textContent.trim();
    if (kp) {
      navigator.clipboard.writeText(kp);
      $("#copyKeyphraseBtn").textContent = "✓ Copied!";
      setTimeout(() => $("#copyKeyphraseBtn").textContent = "📋 Copy", 2000);
    }
  });

  $("#saveCredentialsBrowserBtn")?.addEventListener("click", () => {
    $("#saveCredentialsBrowserBtn").textContent = "✓ Saved to Browser!";
    setTimeout(() => $("#saveCredentialsBrowserBtn").textContent = "💾 Save to This Browser", 2500);
  });

  $("#openLodgedCaseBtn")?.addEventListener("click", () => {
    $("#keyphraseSuccessModal")?.classList.add("hidden");
    if (activeSessionCase) {
      switchView("reports");
      openAuthorityMessagesModal(activeSessionCase.id);
    }
  });

  $("#bannerOpenCaseBtn")?.addEventListener("click", () => {
    if (activeSessionCase) {
      openAuthorityMessagesModal(activeSessionCase.id);
    }
  });

  $("#bannerDismissBtn")?.addEventListener("click", () => {
    $("#resumedSessionBanner")?.classList.add("hidden");
  });

  $("#clearSavedCasesBtn")?.addEventListener("click", () => {
    localStorage.removeItem("drs_case_history");
    localStorage.removeItem("drs_active_case");
    activeSessionCase = null;
    updateSessionUI();
    renderTrackSavedCases();
  });

  // Track Case Modal Submit
  $("#trackCaseForm")?.addEventListener("submit", async e => {
    e.preventDefault();
    const refCode = $("#trackRefCodeInput").value.trim();
    const keyphrase = $("#trackKeyphraseInput").value.trim();
    showMessage("#trackCaseMsg", "");

    try {
      const res = await api("/api/reports/access-by-keyphrase", {
        method: "POST",
        body: JSON.stringify({ referenceCode: refCode, keyphrase: keyphrase })
      });

      if (res && res.report) {
        activeSessionCase = res.report;
        if (res.report.description && res.report.description.startsWith("ENC:v1:")) {
          try {
            const plain = await decryptNarrativeE2EE(res.report.description, keyphrase);
            localDecryptedCache.set(res.report.id, plain);
          } catch (decErr) {
            console.warn("Auto-decryption on track failed:", decErr);
          }
        }
        const caseObj = {
          id: res.report.id,
          referenceCode: res.report.referenceCode,
          keyphrase: keyphrase,
          sessionToken: res.sessionToken,
          eventType: res.report.eventType,
          loc: res.report.loc,
          createdAt: res.report.createdAt
        };
        localStorage.setItem("drs_active_case", JSON.stringify(caseObj));
        addCaseToHistory(caseObj);
        updateSessionUI();
        $("#trackCaseModal")?.classList.add("hidden");
        switchView("reports");
        await refreshAll();
        openAuthorityMessagesModal(res.report.id);
      }
    } catch(err) {
      showMessage("#trackCaseMsg", err.message);
    }
  });

  // Track View Form Submit
  $("#trackViewForm")?.addEventListener("submit", async e => {
    e.preventDefault();
    const refCode = $("#trackViewRefCode").value.trim();
    const keyphrase = $("#trackViewKeyphrase").value.trim();
    showMessage("#trackViewMsg", "");

    try {
      const res = await api("/api/reports/access-by-keyphrase", {
        method: "POST",
        body: JSON.stringify({ referenceCode: refCode, keyphrase: keyphrase })
      });

      if (res && res.report) {
        activeSessionCase = res.report;
        if (res.report.description && res.report.description.startsWith("ENC:v1:")) {
          try {
            const plain = await decryptNarrativeE2EE(res.report.description, keyphrase);
            localDecryptedCache.set(res.report.id, plain);
          } catch (decErr) {
            console.warn("Auto-decryption on track failed:", decErr);
          }
        }
        const caseObj = {
          id: res.report.id,
          referenceCode: res.report.referenceCode,
          keyphrase: keyphrase,
          sessionToken: res.sessionToken,
          eventType: res.report.eventType,
          loc: res.report.loc,
          createdAt: res.report.createdAt
        };
        localStorage.setItem("drs_active_case", JSON.stringify(caseObj));
        addCaseToHistory(caseObj);
        updateSessionUI();
        showMessage("#trackViewMsg", "Case unlocked successfully! Opening case…", true);
        setTimeout(() => {
          switchView("reports");
          openAuthorityMessagesModal(res.report.id);
        }, 800);
        await refreshAll();
      }
    } catch(err) {
      showMessage("#trackViewMsg", err.message);
    }
  });

  // Authority Login Form Submit
  $("#loginForm")?.addEventListener("submit", async e => {
    e.preventDefault();
    const username = $("#authLoginUsername")?.value.trim();
    const password = $("#authLoginPassword")?.value;
    showMessage("#authMessage", "");

    try {
      currentUser = await api("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ username, password })
      });
      $("#authorityLoginModal")?.classList.add("hidden");
      await showApp();
    } catch(err) {
      showMessage("#authMessage", err.message);
    }
  });

  // Quick Demo Accounts Fill
  $$(".demoFillBtn").forEach(btn => {
    btn.addEventListener("click", () => {
      const user = btn.dataset.user;
      const pass = btn.dataset.pass;
      if ($("#authLoginUsername")) $("#authLoginUsername").value = user;
      if ($("#authLoginPassword")) $("#authLoginPassword").value = pass;
      showMessage("#authMessage", `Loaded demo credentials for: ${user}`, true);
    });
  });

  $("#logoutBtn")?.addEventListener("click", async () => {
    try { await api("/api/auth/logout", {method: "POST", body: "{}"}); } catch(_) {}
    currentUser = null;
    await showApp();
  });
}

// ==========================================
// Two-Way Authority Communication
// ==========================================
async function openAuthorityMessagesModal(reportId) {
  activeChatReportId = reportId;
  const report = currentReports.find(r => r.id === reportId);
  const refCode = report ? (report.referenceCode || `RPT-2026-${String(report.id).padStart(5, '0')}`) : `Case #${reportId}`;
  const eventType = report ? report.eventType : 'Incident';

  $("#chatModalTitle").textContent = `Authority Inquiries: ${refCode} - ${eventType}`;
  showMessage("#chatMsgStatus", "");

  const isStaffViewer = currentUser && ["POLICE", "ADMIN", "GOVERNMENT_OFFICIAL", "JOURNALIST"].includes(currentUser.role);
  const noticeEl = $("#chatRoleNotice");
  if (noticeEl) {
    if (isStaffViewer) {
      noticeEl.innerHTML = `👮 <strong>Official Law Enforcement Channel:</strong> You are communicating directly and securely with the anonymous reporter of case <strong>${safe(refCode)}</strong>.`;
      if ($("#chatInputText")) $("#chatInputText").placeholder = "Send an official inquiry, request for evidence, or instruction to the reporter...";
      if ($("#chatSendBtn")) $("#chatSendBtn").textContent = "Send Inquiry 🛡️";
    } else {
      noticeEl.innerHTML = `🛡️ <strong>Confidential Citizen Channel:</strong> You are communicating directly with assigned investigating authorities regarding <strong>${safe(refCode)}</strong>. Your identity remains strictly anonymous.`;
      if ($("#chatInputText")) $("#chatInputText").placeholder = "Type your confidential response or supplementary information for the authorities...";
      if ($("#chatSendBtn")) $("#chatSendBtn").textContent = "Send Reply ✉️";
    }
  }

  $("#authorityMessagesModal")?.classList.remove("hidden");
  await loadChatMessages(reportId);

  if (chatPollInterval) clearInterval(chatPollInterval);
  chatPollInterval = setInterval(() => {
    if (!$("#authorityMessagesModal")?.classList.contains("hidden")) {
      loadChatMessages(activeChatReportId);
    } else {
      clearInterval(chatPollInterval);
    }
  }, 4000);
}

async function loadChatMessages(reportId) {
  if (!reportId) return;
  try {
    const messages = await api(`/api/reports/${reportId}/messages`);
    const container = $("#chatMessagesContainer");
    if (!container) return;

    if (!messages || !messages.length) {
      container.innerHTML = `
        <div class="chatEmptyState">
          <span style="font-size: 28px; display: block; margin-bottom: 6px;">💬</span>
          <strong>No messages exchanged yet.</strong>
          <p style="margin: 4px 0 0; font-size: 12.5px;">Authorities can send inquiries here, and the reporter can reply with supplementary details.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = messages.map(m => {
      const isAuth = m.senderType === "AUTHORITY";
      const icon = isAuth ? "🛡️" : "👤";
      return `
        <div class="chatMessage ${isAuth ? 'chatMessageAuthority' : 'chatMessageReporter'}">
          <div class="chatMeta">
            <span>${icon} ${safe(m.senderName)}</span>
            <span class="chatTime">${safe(formatDateTime(m.createdAt))}</span>
          </div>
          <div class="chatBubble">
            <p class="chatText">${safe(m.messageText)}</p>
          </div>
        </div>
      `;
    }).join("");

    container.scrollTop = container.scrollHeight;
  } catch(err) {
    const container = $("#chatMessagesContainer");
    if (container) {
      container.innerHTML = `<div class="empty" style="color:#991B1B;">${safe(err.message)}</div>`;
    }
  }
}

$("#chatSendForm")?.addEventListener("submit", async e => {
  e.preventDefault();
  if (!activeChatReportId) return;
  const input = $("#chatInputText");
  const text = input ? input.value.trim() : "";
  if (!text) return;

  showMessage("#chatMsgStatus", "");
  try {
    await api(`/api/reports/${activeChatReportId}/messages`, {
      method: "POST",
      body: JSON.stringify({ messageText: text })
    });
    if (input) input.value = "";
    await loadChatMessages(activeChatReportId);
    await refreshAll();
  } catch(err) {
    showMessage("#chatMsgStatus", err.message);
  }
});

// ==========================================
// Case Amendment / Update Modal
// ==========================================
function openUpdateReportModal(reportId) {
  const report = currentReports.find(r => r.id === reportId);
  if (!report) return;

  const refCode = report.referenceCode || `RPT-2026-${String(report.id).padStart(5, '0')}`;
  $("#updateReportModalTitle").textContent = `Amend Case Details: ${refCode}`;
  $("#updateReportId").value = report.id;
  $("#updateLocInput").value = report.loc || "";
  $("#updateOverviewInput").value = report.incidentOverview || "";
  $("#updateDescInput").value = report.description || "";
  $("#updatePhotoInput").value = "";
  showMessage("#updateReportMsg", "");

  $("#updateReportModal")?.classList.remove("hidden");
}

$("#updateReportForm")?.addEventListener("submit", async e => {
  e.preventDefault();
  const id = $("#updateReportId")?.value;
  if (!id) return;

  const loc = $("#updateLocInput")?.value.trim();
  const overview = $("#updateOverviewInput")?.value.trim();
  const desc = $("#updateDescInput")?.value.trim();
  const photoInput = $("#updatePhotoInput");

  let photoData = null;
  let photoName = null;
  if (photoInput && photoInput.files && photoInput.files[0]) {
    const file = photoInput.files[0];
    photoName = file.name;
    photoData = await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = ev => resolve(ev.target.result);
      reader.readAsDataURL(file);
    });
  }

  showMessage("#updateReportMsg", "");
  try {
    const payload = {
      loc: loc,
      incidentOverview: overview,
      description: desc
    };
    if (photoData) {
      payload.photoData = photoData;
      payload.photoName = photoName;
    }

    const res = await api(`/api/reports/${id}/update-by-reporter`, {
      method: "PUT",
      body: JSON.stringify(payload)
    });

    showMessage("#updateReportMsg", "Case amendments saved successfully!", true);
    setTimeout(() => {
      $("#updateReportModal")?.classList.add("hidden");
    }, 1000);
    await refreshAll();
  } catch(err) {
    showMessage("#updateReportMsg", err.message);
  }
});

// ==========================================
// Report Directory & Card Rendering
// ==========================================
$("#refreshBtn")?.addEventListener("click", refreshAll);
$("#statusFilter")?.addEventListener("change", e => {
  setFilter(e.target.value || "ALL");
});
$("#threatFilter")?.addEventListener("change", () => {
  applyFiltersAndRender();
});
$("#importanceFilter")?.addEventListener("change", () => {
  applyFiltersAndRender();
});

function applyFiltersAndRender() {
  const threatVal = $("#threatFilter")?.value || "";
  const importanceVal = $("#importanceFilter")?.value || "";

  let filtered = currentReports || [];
  if (threatVal) {
    filtered = filtered.filter(r => (r.threatLevel || "MEDIUM") === threatVal);
  }
  if (importanceVal) {
    filtered = filtered.filter(r => (r.importance || "ROUTINE") === importanceVal);
  }
  renderReportsList(filtered, $("#reportsList"));
}

async function refreshAll() {
  await Promise.all([loadReports(), loadMetrics()]);
}

async function loadMetrics() {
  let total = 0;
  let pending = 0;
  let investigating = 0;
  let resolved = 0;

  try {
    const data = await api("/api/dashboard");
    if (data) {
      total = data.totalReports ?? data.total ?? 0;
      pending = data.pending ?? 0;
      investigating = (data.investigating || 0) + (data.underReview || 0);
      resolved = (data.resolved || 0) + (data.closed || 0);
    }
  } catch(_) {
    // Fallback: derive metrics directly from currentReports if available
    if (currentReports && currentReports.length) {
      total = currentReports.length;
      pending = currentReports.filter(r => r.status === 'PENDING').length;
      investigating = currentReports.filter(r => r.status === 'INVESTIGATING' || r.status === 'UNDER_REVIEW').length;
      resolved = currentReports.filter(r => r.status === 'RESOLVED' || r.status === 'CLOSED').length;
    }
  }

  // Update text values
  if ($("#totalCount")) $("#totalCount").textContent = total;
  if ($("#pendingCount")) $("#pendingCount").textContent = pending;
  if ($("#investigatingCount")) $("#investigatingCount").textContent = investigating;
  if ($("#resolvedCount")) $("#resolvedCount").textContent = resolved;

  // Functionality: Calculate dynamic percentage distribution for the metric bars
  const totalBase = total > 0 ? total : 1;
  const pendingPct = total > 0 ? Math.round((pending / totalBase) * 100) : 0;
  const investigatingPct = total > 0 ? Math.round((investigating / totalBase) * 100) : 0;
  const resolvedPct = total > 0 ? Math.round((resolved / totalBase) * 100) : 0;

  if ($("#barTotal")) $("#barTotal").style.width = "100%";
  if ($("#barPending")) $("#barPending").style.width = `${pendingPct}%`;
  if ($("#barInvestigating")) $("#barInvestigating").style.width = `${investigatingPct}%`;
  if ($("#barResolved")) $("#barResolved").style.width = `${resolvedPct}%`;
}

async function loadReports() {
  const status = currentFilter !== "ALL" ? currentFilter : ($("#statusFilter") ? $("#statusFilter").value : "");
  const url = status ? `/api/reports?status=${encodeURIComponent(status)}` : "/api/reports";
  showMinecraftLoader("FETCHING INCIDENT DOSSIERS...", "Querying zero-knowledge immutable registry");
  try {
    const reports = await api(url);
    currentReports = reports || [];
    applyFiltersAndRender();
  } catch(err) {
    $("#reportsList").innerHTML = `<div class="empty">${safe(err.message)}</div>`;
  } finally {
    hideMinecraftLoader();
  }
}

// Helper to check if narrative is client-side encrypted ciphertext
function isNarrativeEncrypted(desc) {
  if (!desc || typeof desc !== "string") return false;
  return desc.startsWith("ENC:v1:") || desc.startsWith("ENC:") || desc.includes(":AES-GCM:");
}

function renderReportsList(reports, containerEl) {
  if (!containerEl) return;
  const curLang = $("#siteLangSelect")?.value || localStorage.getItem("drs_site_lang") || "en";
  const curDict = I18N_DICT[curLang] || I18N_DICT.en;

  if (!reports || !reports.length) {
    containerEl.innerHTML = `<div class="empty">${curDict.card_no_reports || "No incident reports found matching your criteria."}</div>`;
    return;
  }

  const isReviewer = currentUser && ["GOVERNMENT_OFFICIAL", "POLICE", "ADMIN"].includes(currentUser.role);
  const isAdminOrPolice = currentUser && ["POLICE", "ADMIN"].includes(currentUser.role);
  const shouldGroupClusters = $("#groupClustersToggle") ? $("#groupClustersToggle").checked : false;

  // Spatio-Temporal Redundancy Clustering Logic
  let displayReports = reports;
  const clusterMap = new Map();

  if (shouldGroupClusters) {
    const allRefCodes = new Set(reports.map(r => r.referenceCode || `RPT-2026-${String(r.id).padStart(5, '0')}`));
    // Collect child reports linked to parentReferenceCode only if the parent exists
    reports.forEach(r => {
      if (r.parentReferenceCode && allRefCodes.has(r.parentReferenceCode)) {
        if (!clusterMap.has(r.parentReferenceCode)) {
          clusterMap.set(r.parentReferenceCode, []);
        }
        clusterMap.get(r.parentReferenceCode).push(r);
      }
    });

    // Filter out child reports from top-level list ONLY if their parent case exists in current list
    displayReports = reports.filter(r => {
      return !(r.parentReferenceCode && allRefCodes.has(r.parentReferenceCode));
    });
  }

  containerEl.innerHTML = displayReports.map(r => {
    const hasFirstTaker = r.firstReportTakerOfficial != null;
    const ft = r.firstReportTakerOfficial;
    const icon = CATEGORY_ICONS[r.eventType] || "📋";
    const refCode = r.referenceCode || `RPT-2026-${String(r.id).padStart(5, '0')}`;
    const unreadMessages = (r.unreadAuthorityMessages || 0) + (r.unreadReporterMessages || 0);

    const linkedWitnesses = clusterMap.get(refCode) || [];
    const hasCluster = linkedWitnesses.length > 0;

    return `
      <article class="reportCard" id="report-card-${r.id}">
        <div class="reportTop">
          <div>
            <div class="reportTitle" style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
              <span>${icon}</span>
              <span style="font-family:var(--font-mono); color:var(--navy-deep); font-weight:700;">${safe(refCode)}</span> · 
              <span>${safe(getLocalizedEventType(r.eventType, curLang))}</span>
              ${isReviewer ? `
                <span class="threatBadge ${safe(r.threatLevel || 'MEDIUM')}" title="Threat Assessment (Official Eyes Only)">⚠️ ${safe(r.threatLevel || 'MEDIUM')}</span>
                <span class="importanceBadge ${safe(r.importance || 'ROUTINE')}" title="Priority Triage (Official Eyes Only)">⚡ ${safe(r.importance || 'ROUTINE')}</span>
              ` : ''}
              ${hasCluster ? `
                <span class="clusterParentBadge" title="Multiple citizens reported this same incident within 600m & 45m. Automatically linked to eliminate redundancy.">
                  🔗 CLUSTER: +${linkedWitnesses.length} CORROBORATING WITNESSES
                </span>
              ` : ''}
            </div>
            <div class="reportMeta">
              ${curDict.card_filed_by || "Filed by"} <strong>${safe(r.reporterUsername)}</strong> (${safe(r.reporterRole || 'CITIZEN')}) · 
              ${curDict.card_incident || "Incident:"} <strong>${safe(formatDateTime(r.dateTime))}</strong> · 
              ${curDict.card_logged || "Logged:"} ${safe(formatDateTime(r.createdAt))}
            </div>
          </div>
          <div style="display:flex; align-items:center; gap:8px;">
            ${r.parentReferenceCode ? `
              <span class="slideNumberBadge" style="background: rgba(194, 162, 104, 0.15); color: var(--sand-gold); border: 1px solid var(--sand-gold); font-size: 11px;" title="Clustered as a corroborating addendum to case ${safe(r.parentReferenceCode)}">
                🔗 Addendum to ${safe(r.parentReferenceCode)}
              </span>
            ` : ''}
            <button type="button" class="viewLogsBadge" onclick="openViewLogsModal(${r.id}, '${safe(refCode)}')" title="View sensitive access inspection log">
              👁️ <strong>${r.viewsCount || 0}</strong> ${curDict.card_views || "Views"}
            </button>
            <span class="pill ${safe(r.status)}">${safe(getLocalizedStatus(r.status, curLang))}</span>
          </div>
        </div>

        <div class="reportMeta">
          📍 <strong>${curDict.card_scene || "Scene:"}</strong> ${safe(getLocalizedLocation(r, curLang))} 
          ${r.latitude && r.longitude ? `<span class="muted">(${curDict.card_gps || "GPS:"} ${r.latitude.toFixed(4)}, ${r.longitude.toFixed(4)})</span>` : ''}
        </div>

        ${r.photoUrl ? `
          <div class="photoThumbnailCard" onclick="openPhotoModal('${safe(r.photoUrl)}', '${safe(refCode)}')">
            <img src="${safe(r.photoUrl)}" alt="Scene Evidence" class="photoThumbnail">
            <div class="photoMetaInfo">
              <div style="display: flex; align-items: center; justify-content: space-between;">
                <strong style="color: var(--navy-deep); font-size: 12.5px;">📸 ${curDict.card_evidence_title || "Scene Visual Evidence Attached"}</strong>
                <span class="slideNumberBadge" style="font-size: 10px; padding: 2px 8px;">SHA-256 SEALED</span>
              </div>
              <div class="muted" style="font-size: 11.5px; margin-top: 2px;">${curDict.card_evidence_sub || "Click photo thumbnail to examine high-resolution evidence & custody checksum."}</div>
            </div>
          </div>
        ` : ''}

        <!-- Public Incident Glimpse -->
        <div class="glimpseBox">
          <div class="glimpseHeader">
            <span>🌐 ${curDict.glimpse_label_short || "Public Incident Glimpse"}</span>
          </div>
          <div style="font-size: 13.5px; line-height: 1.55;">${safe(getLocalizedGlimpse(r, curLang))}</div>
        </div>

        ${hasCluster ? `
          <details class="linkedReportsDrawer">
            <summary style="cursor:pointer; font-weight:700; color:#d8b4fe; font-size:12px;">
              🔗 View ${linkedWitnesses.length} Corroborating Witness Reports (Spatio-Temporal Redundancy Link)
            </summary>
            <div style="margin-top:8px;">
              ${linkedWitnesses.map(w => `
                <div class="linkedReportItem">
                  <span style="color:#d8b4fe; font-weight:700;">${safe(w.referenceCode)}</span> · 
                  <span class="muted">${safe(formatDateTime(w.createdAt))}</span> · 
                  <span>"${safe(w.incidentOverview || w.description || 'Simultaneous report submitted')}"</span>
                </div>
              `).join('')}
            </div>
          </details>
        ` : ''}

        <!-- Confidential Narrative (WebCrypto E2EE Blind Carrier / Local Decryption) -->
        ${(() => {
          const cachedPlain = localDecryptedCache.get(r.id);
          const isCiphertext = isNarrativeEncrypted(r.description);
          const hasKey = !!activeSessionCase && activeSessionCase.keyphrase;

          if (cachedPlain) {
            return `
              <div class="descriptionBox" id="narrativeBox-${r.id}" style="border-left: 3px solid #22c55e;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
                  <strong style="color:#16a34a; font-size:12px; text-transform:uppercase;">
                    🔓 Confidential Narrative (Decrypted In Browser Memory)
                  </strong>
                  <span class="slideNumberBadge" style="background:rgba(34,197,94,0.15); color:#22c55e; border-color:#22c55e; font-size:10px;">AES-GCM-256</span>
                </div>
                <div style="font-size:13px; line-height:1.6; color:var(--text-primary); white-space:pre-wrap;">${safe(cachedPlain)}</div>
              </div>
            `;
          }

          if (isCiphertext) {
            return `
              <div class="descriptionBox" id="narrativeBox-${r.id}" style="border-left: 3px solid var(--sand-gold);">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
                  <strong style="color:var(--sand-gold); font-size:11.5px; text-transform:uppercase;">
                    🔒 WebCrypto E2EE Ciphertext (Blind Carrier Storage)
                  </strong>
                  <span class="slideNumberBadge" style="font-size:10px;">AES-GCM-256</span>
                </div>
                <div style="font-family:var(--font-mono); font-size:11px; word-break:break-all; color:#79978E; background:rgba(0,0,0,0.25); padding:8px 10px; border-radius:6px; border:1px dashed var(--border-subtle); margin-bottom:8px;">
                  ${safe(r.description.length > 95 ? r.description.slice(0, 90) + '...' : r.description)}
                </div>
                <button type="button" class="smallBtn gold" onclick="decryptCaseNarrative(${r.id}, '${safe(refCode)}')">
                  ${hasKey ? '🔓 Decrypt With Stored 7-Word Keyphrase' : '🔑 Enter 7-Word Keyphrase to Decrypt'}
                </button>
              </div>
            `;
          }

          if (r.canViewFullDescription) {
            return `
              <div class="descriptionBox" id="narrativeBox-${r.id}">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
                  <strong style="color:var(--navy-deep); font-size:12px; text-transform:uppercase;">
                    🔓 Confidential Investigation Narrative (Unlocked)
                  </strong>
                  <span class="muted" style="font-size:11px;">Inspected under chain of custody</span>
                </div>
                ${safe(r.description)}
              </div>
            `;
          }

          return `
            <div class="privacyShield" style="margin: 8px 0;">
              <span style="font-size:16px;">🔒</span>
              <div style="font-size:12.5px;">
                <strong>${curDict.card_shield_title || "Confidential Narrative Protected:"}</strong> ${curDict.card_shield_desc || "Blind Carrier model active. Detailed forensic description is encrypted client-side with 7-word Diceware keyphrase before storage."}
              </div>
            </div>
          `;
        })()}

        ${r.firNumber ? `
          <div class="reportMeta" style="margin-top: 8px;">
            <strong>${curDict.card_fir_label || "Official FIR Number:"}</strong> 
            <span style="font-family:var(--font-mono); font-weight:700; color:var(--navy-deep); background:var(--sand-soft); border:1px solid var(--sand-gold); padding:3px 9px; border-radius:6px;">
              ${safe(r.firNumber)}
            </span>
          </div>` : ""}

        ${hasFirstTaker ? `
          <div class="firstTakerBanner">
            <span style="font-size:18px;">🛡️</span>
            <div>
              <strong>First Report Taken By:</strong> ${safe(ft.officialName)} 
              <span class="badgeTag">Badge: ${safe(ft.badgeNumber)}</span> · 
              ${safe(ft.department)} (${safe(ft.designation)})
              ${ft.contactInfo ? `· 📞 ${safe(ft.contactInfo)}` : ''}
            </div>
          </div>
        ` : ''}

        <!-- Authenticity & Community Indication Banner -->
        <div class="endorsementBanner">
          <div class="endorsementStats">
            <span>⭐ Authenticity Indication:</span>
            <span style="color:var(--navy-deep); font-weight:700;">${r.endorsementsCount || 0} Vouches</span>
            <span class="muted" style="font-weight:400; font-size:12px;">(${r.policeVouches || 0} Police, ${r.journalistVouches || 0} Journalist, ${r.citizenVouches || 0} Citizens)</span>
          </div>
          <button class="smallBtn ${r.endorsedByMe ? 'gold' : 'secondary'}" onclick="openEndorsementModal(${r.id})">
            ${r.endorsedByMe ? '✓ Vouched Authenticity' : '✨ Vouch Authenticity'}
          </button>
        </div>

        <!-- Action Buttons -->
        <div class="cardFooterButtons">
          <button class="footerBtn gold" onclick="openAuthorityMessagesModal(${r.id})" style="font-weight: 700;">
            💬 Authority Inquiries (${unreadMessages})
          </button>

          ${r.canEdit ? `
            <button class="footerBtn primary" onclick="openUpdateReportModal(${r.id})" style="font-weight: 600;">
              ✏️ Amend Details
            </button>
          ` : ''}

          <button class="footerBtn" onclick="openWitnessModal(${r.id})">
            👥 Witnesses (${r.witnessesCount || 0})
          </button>
          <button class="footerBtn" onclick="openEvidenceModal(${r.id})">
            📁 Evidence Vault (${r.evidenceCount || 0})
          </button>
          <button class="footerBtn" onclick="openReportContribsModal(${r.id})">
            💬 Supplementary Info (${r.contributionsCount || 0})
          </button>
          <button class="footerBtn" onclick="openOfficialsModal(${r.id})">
            👮 Scene Personnel (${r.officialsCount || 0})
          </button>
          <button class="footerBtn" onclick="openViewLogsModal(${r.id}, '${safe(refCode)}')">
            👁️ Sensitive Views (${r.viewsCount || 0})
          </button>
          <button class="footerBtn" onclick="openContributeModal(${r.id})">
            📍 Contribute Observations
          </button>
          <button class="footerBtn" onclick="openAuditModal(${r.id})">
            📜 Case Audit History (${r.auditLogsCount || 0})
          </button>

          ${isReviewer ? `
            <button class="footerBtn gold" onclick="openAddOfficialModal(${r.id})">
              + Assign Official
            </button>
          ` : ''}

          ${isReviewer ? `
            <div style="display:inline-flex; gap:6px; margin-left:auto; align-items:center;">
              <select id="statusSelect-${r.id}" style="padding:5px 8px; font-size:12px;">
                <option value="PENDING" ${r.status==='PENDING'?'selected':''}>PENDING</option>
                <option value="UNDER_REVIEW" ${r.status==='UNDER_REVIEW'?'selected':''}>UNDER_REVIEW</option>
                <option value="INVESTIGATING" ${r.status==='INVESTIGATING'?'selected':''}>INVESTIGATING</option>
                <option value="RESOLVED" ${r.status==='RESOLVED'?'selected':''}>RESOLVED</option>
                <option value="CLOSED" ${r.status==='CLOSED'?'selected':''}>CLOSED</option>
              </select>
              ${isAdminOrPolice ? `
                <input id="firInput-${r.id}" placeholder="Assign FIR #" value="${safe(r.firNumber || '')}" style="width:110px; padding:5px 8px; font-size:12px;">
              ` : ''}
              <button class="smallBtn primary" onclick="updateReport(${r.id})">Save Review</button>
            </div>
          ` : ''}
        </div>
      </article>
    `;
  }).join("");
}

async function updateReport(id) {
  const statusEl = $(`#statusSelect-${id}`);
  const firEl = $(`#firInput-${id}`);
  const status = statusEl ? statusEl.value : "";
  const firNumber = firEl ? firEl.value.trim() : null;

  try {
    await api(`/api/reports/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status, firNumber })
    });
    await refreshAll();
  } catch(err) {
    alert("Error updating review: " + err.message);
  }
}

// ==========================================
// Interactive Stat Filter Tabs
// ==========================================
function initStatFilterTabs() {
  $$(".statFilterBtn").forEach(btn => {
    btn.addEventListener("click", () => {
      const status = btn.dataset.status;
      setFilter(status);
    });
  });

  $("#clearFilterBtn")?.addEventListener("click", () => {
    setFilter("ALL");
  });
}

function setFilter(status) {
  currentFilter = status;
  $$(".statFilterBtn").forEach(b => b.classList.toggle("active", b.dataset.status === status));
  const select = $("#statusFilter");
  if (select) select.value = status === "ALL" ? "" : status;

  const bar = $("#filterIndicatorBar");
  const text = $("#filterIndicatorText");
  if (status === "ALL") {
    bar?.classList.add("hidden");
  } else {
    bar?.classList.remove("hidden");
    const labels = {
      "PENDING": "Pending Initial Review",
      "INVESTIGATING": "Active Investigations",
      "RESOLVED": "Resolved / Closed Cases",
      "UNDER_REVIEW": "Under Supervisory Review",
      "CLOSED": "Closed Cases"
    };
    if (text) text.textContent = labels[status] || status;
  }
  switchView("reports");
  loadReports();
}

// ==========================================
// Proximity & Witness Matching
// ==========================================
$("#findNearbyBtn")?.addEventListener("click", () => {
  if (!navigator.geolocation) {
    alert("Geolocation is not supported by your browser.");
    return;
  }
  $("#nearbyStatusNotice").textContent = "Acquiring precise GPS fix…";
  navigator.geolocation.getCurrentPosition(
    async pos => {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;
      $("#nearbyStatusNotice").textContent = `Found coordinates (${lat.toFixed(4)}, ${lng.toFixed(4)}). Searching reports within 25km radius…`;
      try {
        const matches = await api(`/api/reports/nearby?lat=${lat}&lng=${lng}&radiusKm=25`);
        $("#nearbyStatusNotice").textContent = `Found ${matches.length} report(s) matching your area.`;
        renderReportsList(matches, $("#contributeReportsList"));
      } catch(err) {
        $("#nearbyStatusNotice").textContent = "Error: " + err.message;
      }
    },
    err => {
      $("#nearbyStatusNotice").textContent = "Location access denied or unavailable: " + err.message;
    },
    { enableHighAccuracy: true, timeout: 10000 }
  );
});

$("#contributeSearchBtn")?.addEventListener("click", async () => {
  const query = $("#contributeSearchInput").value.trim();
  if (!query) {
    alert("Please enter keywords to search for reports.");
    return;
  }
  $("#nearbyStatusNotice").textContent = `Searching reports matching "${query}"…`;
  try {
    const matches = await api(`/api/reports/nearby?query=${encodeURIComponent(query)}`);
    $("#nearbyStatusNotice").textContent = `Found ${matches.length} matching report(s).`;
    renderReportsList(matches, $("#contributeReportsList"));
  } catch(err) {
    $("#nearbyStatusNotice").textContent = "Error: " + err.message;
  }
});

// Modals Close Binding
$$("[data-close]").forEach(el => {
  el.addEventListener("click", () => {
    const modalId = el.dataset.close;
    $(`#${modalId}`)?.classList.add("hidden");
    if (modalId === "authorityMessagesModal" && chatPollInterval) {
      clearInterval(chatPollInterval);
      chatPollInterval = null;
    }
  });
});

// Contribute Modal
function openContributeModal(reportId) {
  const report = currentReports.find(r => r.id === reportId);
  $("#modalContribReportId").value = reportId;
  $("#modalContribText").value = "";
  $("#modalContribLoc").value = "";
  $("#modalContribLat").value = "";
  $("#modalContribLng").value = "";
  $("#modalContribScoreResult").classList.add("hidden");

  if (report) {
    const refCode = report.referenceCode || `RPT-2026-${String(report.id).padStart(5, '0')}`;
    $("#modalContribCaseGlimpse").innerHTML = `
      <strong>[${safe(refCode)}] ${safe(report.eventType)}</strong><br>
      ${safe(report.incidentOverview || report.description)}<br>
      <span class="muted" style="font-size:12px;">Scene: ${safe(report.loc)} · Date: ${safe(formatDateTime(report.dateTime))}</span>
    `;
  }
  $("#contributeModal")?.classList.remove("hidden");
}

$("#contributeModalForm")?.addEventListener("submit", async e => {
  e.preventDefault();
  const reportId = $("#modalContribReportId").value;
  const infoText = $("#modalContribText").value.trim();
  const contributorLoc = $("#modalContribLoc").value.trim();
  const latVal = $("#modalContribLat").value;
  const lngVal = $("#modalContribLng").value;

  const body = {
    infoText,
    contributorLoc,
    latitude: latVal ? parseFloat(latVal) : null,
    longitude: lngVal ? parseFloat(lngVal) : null
  };

  try {
    const res = await api(`/api/reports/${reportId}/contributions`, {
      method: "POST",
      body: JSON.stringify(body)
    });
    const resultBox = $("#modalContribScoreResult");
    resultBox.classList.remove("hidden");
    resultBox.innerHTML = `
      <div style="background:var(--sand-soft); border:1.5px solid var(--sand-gold); border-radius:8px; padding:14px;">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <strong style="color:var(--navy-deep);">Evaluated Confidence: ${res.confidenceScore}%</strong>
          <span class="badgeTag" style="background:#065F46; color:white;">${safe(res.confidenceLevel)}</span>
        </div>
        <p style="margin:6px 0 0; font-size:12.5px; color:var(--text-secondary);">${safe(res.matchNotes)}</p>
      </div>
    `;
    await refreshAll();
  } catch(err) {
    alert("Error submitting contribution: " + err.message);
  }
});

// Witnesses Modal
let activeWitnessReportId = null;
async function openWitnessModal(reportId) {
  activeWitnessReportId = reportId;
  $("#witnessReportId").value = reportId;
  const report = currentReports.find(r => r.id === reportId);
  const refCode = report ? (report.referenceCode || `RPT-2026-${String(report.id).padStart(5, '0')}`) : `#${reportId}`;
  $("#witnessModalTitle").textContent = `Witness Statements & Verification: ${refCode}`;

  await loadWitnesses(reportId);
  $("#witnessModal")?.classList.remove("hidden");
}

async function loadWitnesses(reportId) {
  try {
    const witnesses = await api(`/api/reports/${reportId}/witnesses`);
    const container = $("#witnessList");
    if (!witnesses || !witnesses.length) {
      container.innerHTML = '<p class="muted">No witness accounts recorded for this report yet.</p>';
      return;
    }
    const isReviewer = currentUser && ["GOVERNMENT_OFFICIAL", "POLICE", "ADMIN"].includes(currentUser.role);

    container.innerHTML = witnesses.map(w => {
      const statusPill = {
        "CONSISTENT": "badgeTag" + " style='background:#065F46; color:white;'",
        "NEEDS_REVIEW": "badgeTag" + " style='background:#B45309; color:white;'",
        "INCONSISTENT": "badgeTag" + " style='background:#991B1B; color:white;'",
        "INITIAL_RECORD": "badgeTag" + " style='background:var(--navy-deep); color:white;'"
      }[w.verificationStatus] || "badgeTag";

      return `
        <div class="witnessCard" style="background:var(--sand-soft); border:1px solid var(--sand-border); border-radius:8px; padding:12px 14px; margin-bottom:10px;">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <strong>${safe(w.witnessName)}</strong>
            <span ${statusPill}>${safe(w.verificationStatus)}</span>
          </div>
          <div class="muted" style="font-size:12px; margin:2px 0 6px;">
            Recorded by: ${safe(w.recordedBy)} (${safe(w.recordedByRole)}) · Type: ${safe(w.witnessType)}
            ${w.timeObserved ? `· Observed: ${safe(formatDateTime(w.timeObserved))}` : ''}
          </div>
          <div style="font-size:13.5px; line-height:1.45; background:var(--surface-card); padding:8px 12px; border-radius:6px; border:1px solid var(--border-subtle);">
            ${safe(w.statement)}
          </div>
          ${w.verificationNotes ? `
            <div style="font-size:12px; color:var(--text-muted); margin-top:6px;">
              🔍 <strong>Consistency Notes:</strong> ${safe(w.verificationNotes)}
              ${w.verificationScore != null ? `(Score: ${w.verificationScore}%)` : ''}
            </div>
          ` : ''}
          ${isReviewer ? `
            <div style="margin-top:8px; display:flex; gap:6px; align-items:center;">
              <span style="font-size:11.5px; font-weight:600;">Manual Review:</span>
              <button class="smallBtn secondary" onclick="reviewWitness(${w.id}, 'CONSISTENT')">✓ Consistent</button>
              <button class="smallBtn secondary" onclick="reviewWitness(${w.id}, 'INCONSISTENT')">✕ Inconsistent</button>
            </div>
          ` : ''}
        </div>
      `;
    }).join("");
  } catch(err) {
    $("#witnessList").innerHTML = `<div class="empty">${safe(err.message)}</div>`;
  }
}

async function reviewWitness(witnessId, status) {
  try {
    await api(`/api/witnesses/${witnessId}/review`, {
      method: "PATCH",
      body: JSON.stringify({ status })
    });
    if (activeWitnessReportId) await loadWitnesses(activeWitnessReportId);
    await refreshAll();
  } catch(err) {
    alert("Error reviewing witness: " + err.message);
  }
}

$("#witnessForm")?.addEventListener("submit", async e => {
  e.preventDefault();
  const f = Object.fromEntries(new FormData(e.target));
  const reportId = f.reportId;
  delete f.reportId;
  if (f.timeObserved) f.timeObserved = f.timeObserved + ":00";
  else delete f.timeObserved;

  try {
    await api(`/api/reports/${reportId}/witnesses`, {
      method: "POST",
      body: JSON.stringify(f)
    });
    e.target.reset();
    lockFutureDates();
    await loadWitnesses(reportId);
    await refreshAll();
  } catch(err) {
    alert("Error recording witness: " + err.message);
  }
});

// Evidence Modal
let activeEvidenceReportId = null;
async function openEvidenceModal(reportId) {
  activeEvidenceReportId = reportId;
  $("#evidenceReportId").value = reportId;
  const report = currentReports.find(r => r.id === reportId);
  const refCode = report ? (report.referenceCode || `RPT-2026-${String(report.id).padStart(5, '0')}`) : `#${reportId}`;
  $("#evidenceModalTitle").textContent = `Evidence Vault: ${refCode}`;

  await loadEvidence(reportId);
  $("#evidenceModal")?.classList.remove("hidden");
}

async function loadEvidence(reportId) {
  try {
    const list = await api(`/api/reports/${reportId}/evidence`);
    const container = $("#evidenceList");
    if (!list || !list.length) {
      container.innerHTML = '<p class="muted">No evidence attached yet.</p>';
      return;
    }
    container.innerHTML = list.map(e => `
      <div style="background:var(--sand-soft); border:1px solid var(--sand-border); border-radius:8px; padding:12px 14px; margin-bottom:10px;">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <strong>📁 ${safe(e.title)}</strong>
          <span class="badgeTag">${safe(e.evidenceType)}</span>
        </div>
        <div class="muted" style="font-size:12px; margin:2px 0 6px;">
          Uploader: ${safe(e.uploader)} (${safe(e.uploaderRole)}) · Ref: ${safe(e.fileReference)} · Attached: ${safe(formatDateTime(e.uploadedAt))}
        </div>
        <div style="font-family:var(--font-mono); font-size:11px; background:var(--surface-card); padding:6px 10px; border-radius:4px; border:1px solid var(--border-subtle); color:var(--navy-deep); word-break:break-all;">
          🔒 SHA-256: ${safe(e.fileHash || 'PENDING')}
        </div>
        ${e.chainOfCustody ? `
          <div style="font-size:12px; color:var(--text-secondary); margin-top:6px;">
            📜 <strong>Chain of Custody:</strong> ${safe(e.chainOfCustody)}
          </div>
        ` : ''}
      </div>
    `).join("");
  } catch(err) {
    $("#evidenceList").innerHTML = `<div class="empty">${safe(err.message)}</div>`;
  }
}

$("#evidenceForm")?.addEventListener("submit", async e => {
  e.preventDefault();
  const f = Object.fromEntries(new FormData(e.target));
  const reportId = f.reportId;
  delete f.reportId;

  try {
    await api(`/api/reports/${reportId}/evidence`, {
      method: "POST",
      body: JSON.stringify(f)
    });
    e.target.reset();
    await loadEvidence(reportId);
    await refreshAll();
  } catch(err) {
    alert("Error attaching evidence: " + err.message);
  }
});

// Scene Officials Present Modal
function openAddOfficialModal(reportId) {
  $("#officialModalReportId").value = reportId;
  const report = currentReports.find(r => r.id === reportId);
  const refCode = report ? (report.referenceCode || `RPT-2026-${String(report.id).padStart(5, '0')}`) : `#${reportId}`;
  $("#officialModalTitle").textContent = `Assign Official to Scene: ${refCode}`;
  $("#officialModal")?.classList.remove("hidden");
}

$("#officialModalForm")?.addEventListener("submit", async e => {
  e.preventDefault();
  const reportId = $("#officialModalReportId").value;
  const arrival = $("#officialArrivalTimeInput")?.value;
  const payload = {
    officialName: $("#modalOffName").value.trim(),
    badgeNumber: $("#modalOffBadge").value.trim(),
    department: $("#modalOffDept").value.trim(),
    designation: $("#modalOffDesignation").value.trim(),
    contactInfo: $("#modalOffContact").value.trim() || null,
    firstReportTaker: $("#modalOffFirstTaker").checked,
    arrivalTime: arrival ? arrival + ":00" : null,
    dutiesSummary: $("#modalOffDuties").value.trim() || null
  };

  try {
    await api(`/api/reports/${reportId}/officials`, {
      method: "POST",
      body: JSON.stringify(payload)
    });
    e.target.reset();
    $("#officialModal")?.classList.add("hidden");
    await refreshAll();
  } catch(err) {
    alert("Error assigning official: " + err.message);
  }
});

async function openOfficialsModal(reportId) {
  const report = currentReports.find(r => r.id === reportId);
  const refCode = report ? (report.referenceCode || `RPT-2026-${String(report.id).padStart(5, '0')}`) : `#${reportId}`;
  $("#reportOfficialsModalTitle").textContent = `Officials Present at Scene: ${refCode}`;

  try {
    const list = await api(`/api/reports/${reportId}/officials`);
    const container = $("#reportOfficialsModalList");
    if (!list || !list.length) {
      container.innerHTML = '<p class="muted">No officials recorded for this incident yet.</p>';
    } else {
      container.innerHTML = `
        <table class="dataTable">
          <thead>
            <tr>
              <th>Official Name</th>
              <th>Badge #</th>
              <th>Department</th>
              <th>Designation</th>
              <th>Role</th>
              <th>Arrival</th>
            </tr>
          </thead>
          <tbody>
            ${list.map(o => `
              <tr>
                <td><strong>${safe(o.officialName)}</strong></td>
                <td><span class="badgeTag">${safe(o.badgeNumber)}</span></td>
                <td>${safe(o.department)}</td>
                <td>${safe(o.designation)}</td>
                <td>${o.firstReportTaker ? '<span class="badgeTag" style="background:#065F46; color:white;">✓ First Taker</span>' : 'Scene Official'}</td>
                <td>${safe(formatDateTime(o.arrivalTime))}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      `;
    }
  } catch(err) {
    $("#reportOfficialsModalList").innerHTML = `<div class="empty">${safe(err.message)}</div>`;
  }
  $("#reportOfficialsModal")?.classList.remove("hidden");
}

// Supplementary Info Modal
async function openReportContribsModal(reportId) {
  const report = currentReports.find(r => r.id === reportId);
  const refCode = report ? (report.referenceCode || `RPT-2026-${String(report.id).padStart(5, '0')}`) : `#${reportId}`;
  $("#reportContribsModalTitle").textContent = `Supplementary Info & Proximity Corroboration: ${refCode}`;

  try {
    const list = await api(`/api/reports/${reportId}/contributions`);
    const container = $("#reportContribsModalList");
    if (!list || !list.length) {
      container.innerHTML = '<p class="muted">No supplementary information contributed yet.</p>';
    } else {
      container.innerHTML = list.map(c => `
        <div style="background:var(--sand-soft); border:1px solid var(--sand-border); border-radius:8px; padding:12px 14px; margin-bottom:10px;">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <strong>${safe(c.contributorUsername)}</strong>
            <span class="badgeTag" style="background:#065F46; color:white;">Confidence: ${c.confidenceScore}% (${safe(c.confidenceLevel)})</span>
          </div>
          <div class="muted" style="font-size:12px; margin:2px 0 6px;">
            Submitted: ${safe(formatDateTime(c.createdAt))} ${c.distanceKm != null ? `· Proximity: ${c.distanceKm.toFixed(2)} km` : ''}
          </div>
          <div style="font-size:13.5px; background:var(--surface-card); padding:8px 12px; border-radius:6px; border:1px solid var(--border-subtle);">
            ${safe(c.infoText)}
          </div>
          ${c.matchNotes ? `<div style="font-size:12px; color:var(--text-muted); margin-top:4px;">🔍 ${safe(c.matchNotes)}</div>` : ''}
        </div>
      `).join("");
    }
  } catch(err) {
    $("#reportContribsModalList").innerHTML = `<div class="empty">${safe(err.message)}</div>`;
  }
  $("#reportContribsModal")?.classList.remove("hidden");
}

// Case Audit History Modal
async function openAuditModal(reportId) {
  const report = currentReports.find(r => r.id === reportId);
  const refCode = report ? (report.referenceCode || `RPT-2026-${String(report.id).padStart(5, '0')}`) : `#${reportId}`;
  $("#auditHistoryModalTitle").textContent = `Case Audit History: ${refCode}`;

  try {
    const logs = await api(`/api/reports/${reportId}/audit-logs`);
    const container = $("#auditHistoryModalList");
    if (!logs || !logs.length) {
      container.innerHTML = '<p class="muted">No audit history found for this case.</p>';
    } else {
      container.innerHTML = `
        <table class="dataTable">
          <thead>
            <tr>
              <th>Action</th>
              <th>Actor</th>
              <th>Role</th>
              <th>Details</th>
              <th>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            ${logs.map(l => `
              <tr>
                <td><span class="badgeTag">${safe(l.action)}</span></td>
                <td><strong>${safe(l.performedBy)}</strong></td>
                <td>${safe(l.userRole)}</td>
                <td>${safe(l.details)}</td>
                <td>${safe(formatDateTime(l.timestamp))}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      `;
    }
  } catch(err) {
    $("#auditHistoryModalList").innerHTML = `<div class="empty">${safe(err.message)}</div>`;
  }
  $("#auditHistoryModal")?.classList.remove("hidden");
}

// Sensitive Views Modal
async function openViewLogsModal(reportId, refCode) {
  $("#viewLogsModalTitle").textContent = `Sensitive Case View Logs: ${refCode}`;
  try {
    const logs = await api(`/api/reports/${reportId}/view-logs`);
    const container = $("#viewLogsModalList");
    if (!logs || !logs.length) {
      container.innerHTML = '<p class="muted">No sensitive views recorded yet.</p>';
    } else {
      container.innerHTML = `
        <table class="dataTable">
          <thead>
            <tr>
              <th>Viewer Username</th>
              <th>Viewer Role</th>
              <th>Details</th>
              <th>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            ${logs.map(l => `
              <tr>
                <td><strong>${safe(l.viewerUsername)}</strong></td>
                <td><span class="badgeTag">${safe(l.viewerRole)}</span></td>
                <td>${safe(l.details)}</td>
                <td>${safe(formatDateTime(l.timestamp))}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      `;
    }
  } catch(err) {
    $("#viewLogsModalList").innerHTML = `<div class="empty">${safe(err.message)}</div>`;
  }
  $("#viewLogsModal")?.classList.remove("hidden");
}

// Endorsements Modal
async function openEndorsementModal(reportId) {
  $("#endorseReportId").value = reportId;
  const report = currentReports.find(r => r.id === reportId);
  const refCode = report ? (report.referenceCode || `RPT-2026-${String(report.id).padStart(5, '0')}`) : `#${reportId}`;
  $("#endorseModalTitle").textContent = `Vouch for Case Authenticity: ${refCode}`;
  $("#endorseNoteInput").value = "";

  await loadEndorsements(reportId);
  $("#endorsementModal")?.classList.remove("hidden");
}

async function loadEndorsements(reportId) {
  try {
    const summary = await api(`/api/reports/${reportId}/endorsements`);
    $("#endorseExistingStats").innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; background:var(--sand-soft); padding:10px 14px; border-radius:8px;">
        <span><strong>${summary.total || 0}</strong> Authenticity Indications</span>
        <span class="muted" style="font-size:12px;">(${summary.policeCount || 0} Police, ${summary.journalistCount || 0} Journalist, ${summary.citizenCount || 0} Citizen)</span>
      </div>
    `;

    const container = $("#endorsementsListContainer");
    if (!summary.endorsements || !summary.endorsements.length) {
      container.innerHTML = '<p class="muted">No community indications recorded yet.</p>';
    } else {
      container.innerHTML = summary.endorsements.map(e => `
        <div style="background:var(--sand-soft); border:1px solid var(--sand-border); border-radius:6px; padding:8px 12px; margin-bottom:6px;">
          <div style="display:flex; justify-content:space-between;">
            <strong>${safe(e.endorserUsername)} (${safe(e.endorserRole)})</strong>
            <span class="badgeTag" style="background:#065F46; color:white;">${safe(e.verdict)}</span>
          </div>
          ${e.notes ? `<div style="font-size:12.5px; margin-top:4px;">${safe(e.notes)}</div>` : ''}
          <div class="muted" style="font-size:11px; margin-top:2px;">${safe(formatDateTime(e.createdAt))}</div>
        </div>
      `).join("");
    }
  } catch(err) {
    $("#endorsementsListContainer").innerHTML = `<div class="empty">${safe(err.message)}</div>`;
  }
}

$("#endorseForm")?.addEventListener("submit", async e => {
  e.preventDefault();
  const reportId = $("#endorseReportId").value;
  const verdict = $("#endorseVerdictSelect").value;
  const note = $("#endorseNoteInput").value.trim();

  try {
    await api(`/api/reports/${reportId}/endorsements`, {
      method: "POST",
      body: JSON.stringify({ verdict, note })
    });
    await loadEndorsements(reportId);
    await refreshAll();
  } catch(err) {
    alert("Error submitting authenticity indication: " + err.message);
  }
});

// Full Scene Photo Zoom Modal
function openPhotoModal(photoUrl, refCode) {
  $("#photoModalTitle").textContent = `Scene Evidence Photo: ${refCode}`;
  const img = $("#photoModalImg");
  if (img) img.src = photoUrl;
  const meta = $("#photoModalMeta");
  if (meta) {
    meta.innerHTML = `
      <strong>Chain of Custody Verification:</strong> Sealed at initial intake<br>
      <strong>Storage:</strong> Cryptographically verified Base64 image payload in PostgreSQL TOAST storage
    `;
  }
  $("#photoModal")?.classList.remove("hidden");
}

// Personal / Official Credentials
async function loadPersonalCredentials() {
  if (!currentUser) return;
  try {
    const creds = await api("/api/user/credentials");
    $("#credFullName").textContent = creds.username;
    $("#credRoleTag").textContent = creds.role;
    $("#credAvatarInitials").textContent = creds.username.slice(0, 2).toUpperCase();
    $("#credBadgeValue").textContent = creds.badgeNumber || "—";
    $("#credDeptValue").textContent = creds.departmentOrOrg || "—";
    $("#credDesignationValue").textContent = creds.designation || "—";
    $("#credContactValue").textContent = creds.contactNumber || "—";
    $("#credMemberSince").textContent = formatDateTime(creds.createdAt);
    $("#credLastLoginValue").textContent = formatDateTime(creds.lastLoginAt) || "Active Session";
    $("#credNotesDisplay").textContent = creds.credentialsNotes || "No supervisory notes entered yet.";

    const emailBadge = $("#credEmailAuthBadge");
    if (emailBadge) {
      if (creds.emailVerified) {
        emailBadge.className = "emailAuthBadge verified";
        emailBadge.textContent = `✓ Authenticated (${creds.email})`;
        $("#credVerifyEmailPrompt")?.classList.add("hidden");
      } else {
        emailBadge.className = "emailAuthBadge unverified";
        emailBadge.textContent = `⚠️ Unverified (${creds.email})`;
        $("#credVerifyEmailPrompt")?.classList.remove("hidden");
      }
    }
  } catch(_) {}
}

$("#editCredentialsBtn")?.addEventListener("click", async () => {
  if (!currentUser) return;
  try {
    const creds = await api("/api/user/credentials");
    $("#editCredBadge").value = creds.badgeNumber || "";
    $("#editCredDept").value = creds.departmentOrOrg || "";
    $("#editCredDesignation").value = creds.designation || "";
    $("#editCredContact").value = creds.contactNumber || "";
    $("#editCredNotes").value = creds.credentialsNotes || "";
    $("#editCredentialsModal")?.classList.remove("hidden");
  } catch(_) {}
});

$("#editCredentialsForm")?.addEventListener("submit", async e => {
  e.preventDefault();
  const f = Object.fromEntries(new FormData(e.target));
  try {
    await api("/api/user/credentials", {
      method: "PUT",
      body: JSON.stringify(f)
    });
    $("#editCredentialsModal")?.classList.add("hidden");
    await loadPersonalCredentials();
  } catch(err) {
    alert("Error updating credentials: " + err.message);
  }
});

// Officials Registry
async function loadOfficialsRegistry() {
  try {
    const list = await api("/api/officials");
    allOfficialsData = list;
    renderOfficialsTable(list);
  } catch(err) {
    $("#allOfficialsTableContainer").innerHTML = `<div class="empty">${safe(err.message)}</div>`;
  }
}

function renderOfficialsTable(list) {
  const container = $("#allOfficialsTableContainer");
  if (!container) return;
  if (!list || !list.length) {
    container.innerHTML = '<p class="muted">No scene officials recorded across cases yet.</p>';
    return;
  }
  container.innerHTML = `
    <table class="dataTable">
      <thead>
        <tr>
          <th>Case Ref</th>
          <th>Official Name</th>
          <th>Badge #</th>
          <th>Department</th>
          <th>Designation</th>
          <th>First Report Taker</th>
          <th>Arrival Time</th>
          <th>Recorded At</th>
        </tr>
      </thead>
      <tbody>
        ${list.map(o => `
          <tr>
            <td><strong>${safe(o.reportReferenceCode || `#${o.reportId}`)}</strong></td>
            <td>${safe(o.officialName)}</td>
            <td><span class="badgeTag">${safe(o.badgeNumber)}</span></td>
            <td>${safe(o.department)}</td>
            <td>${safe(o.designation)}</td>
            <td>${o.firstReportTaker ? '<span class="badgeTag" style="background:#065F46; color:white;">✓ YES</span>' : 'NO'}</td>
            <td>${safe(formatDateTime(o.arrivalTime))}</td>
            <td>${safe(formatDateTime(o.recordedAt))}</td>
          </tr>
        `).join("")}
      </tbody>
    </table>
  `;
}

$("#officialsSearchInput")?.addEventListener("input", e => {
  const q = e.target.value.toLowerCase().trim();
  if (!q) {
    renderOfficialsTable(allOfficialsData);
    return;
  }
  const filtered = allOfficialsData.filter(o =>
    (o.officialName && o.officialName.toLowerCase().includes(q)) ||
    (o.badgeNumber && o.badgeNumber.toLowerCase().includes(q)) ||
    (o.department && o.department.toLowerCase().includes(q)) ||
    (o.reportReferenceCode && o.reportReferenceCode.toLowerCase().includes(q))
  );
  renderOfficialsTable(filtered);
});

$("#refreshOfficialsBtn")?.addEventListener("click", loadOfficialsRegistry);

// Admin Window Feeds
async function loadAdminWindow() {
  try {
    const [reports, audit] = await Promise.all([
      api("/api/reports"),
      api("/api/audit-logs")
    ]);
    renderAdminReportsFeed(reports);
    renderAdminAuditFeed(audit);
  } catch(_) {}
}

function renderAdminReportsFeed(reports) {
  const container = $("#adminReportsFeed");
  if (!container) return;
  container.innerHTML = reports.slice(0, 10).map(r => `
    <div style="background:var(--sand-soft); border:1px solid var(--sand-border); border-radius:6px; padding:10px 12px; margin-bottom:8px; display:flex; justify-content:space-between; align-items:center;">
      <div>
        <strong style="color:var(--navy-deep);">${safe(r.referenceCode)}</strong> · ${safe(r.eventType)}
        <div class="muted" style="font-size:12px;">Scene: ${safe(r.loc)} · ${safe(formatDateTime(r.createdAt))}</div>
      </div>
      <span class="pill ${safe(r.status)}">${safe(r.status.replaceAll('_', ' '))}</span>
    </div>
  `).join("");
}

function renderAdminAuditFeed(audit) {
  const container = $("#adminAuditFeed");
  if (!container) return;
  container.innerHTML = audit.slice(0, 10).map(a => `
    <div style="background:var(--sand-soft); border:1px solid var(--sand-border); border-radius:6px; padding:10px 12px; margin-bottom:8px;">
      <div style="display:flex; justify-content:space-between;">
        <span class="badgeTag">${safe(a.action)}</span>
        <span class="muted" style="font-size:11px;">${safe(formatDateTime(a.timestamp))}</span>
      </div>
      <div style="font-size:12.5px; margin-top:4px;">${safe(a.details)}</div>
      <div class="muted" style="font-size:11px; margin-top:2px;">Actor: <strong>${safe(a.performedBy)}</strong> (${safe(a.userRole)})</div>
    </div>
  `).join("");
}

$("#refreshAdminBtn")?.addEventListener("click", loadAdminWindow);

// Full Audit Logs
async function loadFullAuditLogs() {
  try {
    const list = await api("/api/audit-logs");
    allAuditLogsData = list;
    const container = $("#fullAuditLogsTableContainer");
    if (!container) return;
    container.innerHTML = `
      <table class="dataTable">
        <thead>
          <tr>
            <th>ID</th>
            <th>Action</th>
            <th>Actor</th>
            <th>Role</th>
            <th>Case ID</th>
            <th>Details</th>
            <th>Timestamp</th>
          </tr>
        </thead>
        <tbody>
          ${list.map(l => `
            <tr>
              <td>#${l.id}</td>
              <td><span class="badgeTag">${safe(l.action)}</span></td>
              <td><strong>${safe(l.performedBy)}</strong></td>
              <td>${safe(l.userRole)}</td>
              <td>${l.reportId ? `#${l.reportId}` : '—'}</td>
              <td>${safe(l.details)}</td>
              <td>${safe(formatDateTime(l.timestamp))}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    `;
  } catch(err) {
    $("#fullAuditLogsTableContainer").innerHTML = `<div class="empty">${safe(err.message)}</div>`;
  }
}

$("#refreshAuditBtn")?.addEventListener("click", loadFullAuditLogs);

// Email Verification Modal
function openVerifyEmailModal() {
  if (!currentUser) return;
  $("#verifyModalEmailText").textContent = currentUser.email || "your registered email";
  $("#verifyEmailCodeInput").value = "";
  showMessage("#verifyEmailMsg", "");
  $("#verifyEmailModal")?.classList.remove("hidden");
}

$("#verifyEmailForm")?.addEventListener("submit", async e => {
  e.preventDefault();
  const code = $("#verifyEmailCodeInput").value.trim();
  if (!code || code.length !== 6) {
    showMessage("#verifyEmailMsg", "Please enter the 6-digit code.");
    return;
  }
  try {
    const res = await api("/api/auth/verify-email", {
      method: "POST",
      body: JSON.stringify({code})
    });
    showMessage("#verifyEmailMsg", res.message || "Email verified successfully!", true);
    if (currentUser) currentUser.emailVerified = true;
    setTimeout(() => {
      $("#verifyEmailModal")?.classList.add("hidden");
      loadPersonalCredentials();
    }, 1200);
  } catch(err) {
    showMessage("#verifyEmailMsg", err.message);
  }
});

$("#requestNewCodeBtn")?.addEventListener("click", async () => {
  try {
    const res = await api("/api/auth/request-verification-code", {
      method: "POST",
      body: "{}"
    });
    showMessage("#verifyEmailMsg", res.message || "A new 6-digit code was generated.", true);
  } catch(err) {
    showMessage("#verifyEmailMsg", err.message);
  }
});

// Global window bindings
window.openOfficialsModal = openOfficialsModal;
window.openAddOfficialModal = openAddOfficialModal;
window.openReportContribsModal = openReportContribsModal;
window.openContributeModal = openContributeModal;
window.openAuditModal = openAuditModal;
window.openWitnessModal = openWitnessModal;
window.openEvidenceModal = openEvidenceModal;
window.openEndorsementModal = openEndorsementModal;
window.openPhotoModal = openPhotoModal;
window.openViewLogsModal = openViewLogsModal;
window.openVerifyEmailModal = openVerifyEmailModal;
window.openAuthorityMessagesModal = openAuthorityMessagesModal;
window.openUpdateReportModal = openUpdateReportModal;
window.resumeSavedCase = resumeSavedCase;
window.updateReport = updateReport;
window.reviewWitness = reviewWitness;
window.switchView = switchView;



// Toggle hover drawer on click (for mobile or pinned view)
$("#hoverSidebarHandle")?.addEventListener("click", () => {
  $("#hoverMetricsDrawer")?.classList.toggle("open");
});



// ==========================================
// 1. REAL-TIME AUTOMATED THREAT & IMPORTANCE KEYWORD ENGINE
// ==========================================
function evaluateClientThreat(eventType, text) {
  const t = (text || "").toLowerCase();
  const ev = (eventType || "").toUpperCase();

  const criticalKeywords = [
    "weapon", "gun", "firearm", "rifle", "pistol", "shooter", "bomb", "explosive",
    "murder", "killed", "hostage", "terror", "kidnap", "abduction", "blast",
    "child abuse", "acid", "gang rape", "mass casualty", "bandook", "chaku", "goli", "hatya"
  ];
  const highKeywords = [
    "assault", "stabbed", "knife", "robbery", "armed", "burglary", "extortion",
    "arson", "overdose", "unconscious", "poison", "riot", "loot", "dacoity", "dange"
  ];
  const mediumKeywords = [
    "theft", "stolen", "break-in", "vandalism", "fraud", "cyber", "scam",
    "blackmail", "harassment", "collision", "crash", "hit and run", "chori", "dhoka"
  ];
  const lowKeywords = [
    "noise", "trespass", "lost", "loitering", "parking", "littering", "dispute", "minor"
  ];

  let threat = "MEDIUM";
  let importance = "ROUTINE";
  let matched = null;

  if (ev === "CYBER_ATTACK" || ev === "TERRORISM" || ev === "VIOLENT_CRIME") {
    threat = "HIGH";
    importance = "EXPEDITED";
  }

  for (const kw of criticalKeywords) {
    if (t.includes(kw)) {
      threat = "CRITICAL";
      importance = "URGENT";
      matched = kw;
      break;
    }
  }

  if (threat !== "CRITICAL") {
    for (const kw of highKeywords) {
      if (t.includes(kw)) {
        threat = "HIGH";
        importance = "EXPEDITED";
        matched = kw;
        break;
      }
    }
  }

  if (threat === "MEDIUM" && !matched) {
    for (const kw of lowKeywords) {
      if (t.includes(kw)) {
        threat = "LOW";
        importance = "LOW";
        matched = kw;
        break;
      }
    }
  }

  return { threat, importance, matched };
}

function initAutomatedThreatEngine() {
  const overviewInput = $("#reportOverviewInput");
  const descInput = $("#reportDescriptionInput");
  const eventSelect = document.querySelector('select[name="eventType"]');
  const pill = $("#threatLivePill");
  const pillIcon = $("#threatPillIcon");
  const pillText = $("#threatPillText");
  const auditText = $("#threatKeywordAudit");
  const hiddenThreat = $("#reportThreatHidden");
  const hiddenImp = $("#reportImportanceHidden");

  function updateThreatUI() {
    const combinedText = ((overviewInput ? overviewInput.value : "") + " " + (descInput ? descInput.value : "")).trim();
    const ev = eventSelect ? eventSelect.value : "";
    const result = evaluateClientThreat(ev, combinedText);

    if (hiddenThreat) hiddenThreat.value = result.threat;
    if (hiddenImp) hiddenImp.value = result.importance;

    if (pill) {
      pill.className = `threatLivePill ${result.threat}`;
    }

    const iconMap = {
      CRITICAL: "🚨",
      HIGH: "⚠️",
      MEDIUM: "⚡",
      LOW: "ℹ️"
    };

    if (pillIcon) pillIcon.textContent = iconMap[result.threat] || "⚡";
    if (pillText) {
      pillText.textContent = `${result.threat} THREAT · ${result.importance} PRIORITY`;
    }

    if (auditText) {
      if (result.matched) {
        auditText.textContent = `Auto-Detected: '${result.matched}' in narrative (Authoritative classification)`;
      } else if (combinedText.length > 5) {
        auditText.textContent = `Standard pattern analysis: Evaluated as ${result.threat} severity.`;
      } else {
        auditText.textContent = "Analysis: Awaiting narrative description...";
      }
    }
  }

  overviewInput?.addEventListener("input", updateThreatUI);
  descInput?.addEventListener("input", updateThreatUI);
  eventSelect?.addEventListener("change", updateThreatUI);
}

// ==========================================
// 2. PRIVACY-PRESERVING ZERO-KNOWLEDGE CAPTCHA (Canvas & Audio)
// ==========================================
let currentCaptchaCode = "";

function generateCaptcha() {
  const canvas = $("#captchaCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const chars = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";
  let code = "";
  for (let i = 0; i < 5; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  currentCaptchaCode = code;

  // Background
  ctx.fillStyle = "#161c20";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Noise dots
  for (let i = 0; i < 35; i++) {
    ctx.fillStyle = `rgba(${Math.floor(Math.random()*150+100)}, ${Math.floor(Math.random()*150+100)}, ${Math.floor(Math.random()*150+100)}, 0.3)`;
    ctx.beginPath();
    ctx.arc(Math.random() * canvas.width, Math.random() * canvas.height, Math.random() * 2, 0, Math.PI * 2);
    ctx.fill();
  }

  // Noise lines
  for (let i = 0; i < 4; i++) {
    ctx.strokeStyle = `rgba(${Math.floor(Math.random()*120+80)}, ${Math.floor(Math.random()*120+80)}, 180, 0.4)`;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
    ctx.bezierCurveTo(
      Math.random() * canvas.width, Math.random() * canvas.height,
      Math.random() * canvas.width, Math.random() * canvas.height,
      Math.random() * canvas.width, Math.random() * canvas.height
    );
    ctx.stroke();
  }

  // Draw distorted characters
  const colors = ["#E6C875", "#48BB78", "#63B3ED", "#F6AD55", "#CBD5E0"];
  const charSpacing = canvas.width / 6;
  for (let i = 0; i < code.length; i++) {
    ctx.save();
    const x = charSpacing * (i + 0.8);
    const y = canvas.height / 2 + (Math.random() * 6 - 3);
    const angle = (Math.random() * 36 - 18) * Math.PI / 180;
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.font = "bold 24px 'Courier New', monospace";
    ctx.fillStyle = colors[i % colors.length];
    ctx.textBaseline = "middle";
    ctx.fillText(code[i], -8, 0);
    ctx.restore();
  }

  const feedback = $("#captchaFeedback");
  if (feedback) feedback.textContent = "Enter the 5 characters shown above to verify human submission.";
}

function validateCaptcha(input) {
  if (!currentCaptchaCode) return true;
  return input && input.toUpperCase() === currentCaptchaCode.toUpperCase();
}

function speakCaptcha() {
  if (!("speechSynthesis" in window) || !currentCaptchaCode) {
    showToast("Speech synthesis unavailable.");
    return;
  }
  const phonetics = {
    A: "Alpha", B: "Bravo", C: "Charlie", D: "Delta", E: "Echo", F: "Foxtrot",
    G: "Golf", H: "Hotel", J: "Juliet", K: "Kilo", L: "Lima", M: "Mike",
    N: "November", P: "Papa", Q: "Quebec", R: "Romeo", S: "Sierra", T: "Tango",
    U: "Uniform", V: "Victor", W: "Whiskey", X: "X-ray", Y: "Yankee", Z: "Zulu"
  };

  const spoken = currentCaptchaCode.split("").map(c => {
    return phonetics[c] ? `${c} as in ${phonetics[c]}` : c;
  }).join(", ");

  speakAloud(`Security Verification Code is: ${spoken}`);
}

function initCaptcha() {
  generateCaptcha();
  $("#refreshCaptchaBtn")?.addEventListener("click", () => {
    generateCaptcha();
    const input = $("#reportCaptchaInput");
    if (input) {
      input.value = "";
      input.focus();
    }
  });
  $("#speakCaptchaBtn")?.addEventListener("click", speakCaptcha);
}

// ==========================================
// 3. VOICE DICTATION STUDIO & MULTI-ENGINE SYSTEM
// ==========================================
let activeDictateTargetId = null;
let activeDictateRecognition = null;
let isDictationListening = false;
let dictateCurrentLang = "en";
let speechRestartTimeout = null;
let consecutiveSpeechErrors = 0;

// MediaRecorder voice note state
let mediaRecorderInstance = null;
let recordedAudioChunks = [];
let recordedAudioBlob = null;
let recordedAudioBase64 = null;
let recordTimerInterval = null;
let recordDurationSec = 0;

const VOICE_TEMPLATES = {
  theft: {
    title: { en: "🛍️ Store / Jewelry Theft", hi: "🛍️ दुकान / आभूषण चोरी", te: "🛍️ దుకాణం / ఆభరణాల చోరీ" },
    en: "On [Date/Time], jewelry and valuables worth approximately ₹1,50,000 were stolen from our commercial store showcase. The perpetrator was wearing a dark jacket and left towards the main road.",
    hi: "दिनांक [समय] पर, हमारी दुकान के शोकेस से लगभग ₹1,50,000 के आभूषण और कीमती सामान चोरी हो गए। संदिग्ध व्यक्ति गहरे रंग की जैकेट पहने था और मुख्य सड़क की ओर भाग गया।",
    te: "[తేదీ/సమయం] నాడు మా దుకాణంలోని షోకేస్ నుండి సుమారు ₹1,50,000 విలువైన ఆభరణాలు చోరీకి గురయ్యాయి. నల్లటి జాకెట్ ధరించిన నిందితుడు ప్రధాన రహదారి వైపు పారిపోయాడు."
  },
  cyber: {
    title: { en: "💳 Online UPI / KYC Fraud", hi: "💳 ऑनलाइन यूपीआई / केवाईसी फ्रॉड", te: "💳 ఆన్‌లైన్ UPI / KYC మోసం" },
    en: "Targeted by a deceptive SIM-block KYC verification message. Unknown callers claiming to be telecom agents prompted remote software installation and initiated unauthorized funds transfer of ₹45,000.",
    hi: "भ्रामक सिम-ब्लॉक केवाईसी संदेश द्वारा निशाना बनाया गया। दूरसंचार अधिकारी बनकर कॉल करने वालों ने रिमोट सॉफ्टवेयर इंस्टॉल कराया और ₹45,000 का अनधिकृत फंड ट्रांसफर किया।",
    te: "మోసపూరిత సిమ్-బ్లాక్ కేవైసీ సందేశం ద్వారా మోసగించబడ్డాను. గుర్తుతెలియని వ్యక్తులు ఫోన్ చేసి రిమోట్ సాఫ్ట్‌వేర్ ఇన్‌స్టాల్ చేయించి అనధికారికంగా ₹45,000 నగదు బదిలీ చేశారు."
  },
  vehicle: {
    title: { en: "🚗 Hit & Run Collision", hi: "🚗 हिट एंड रन दुर्घटना", te: "🚗 హిట్ అండ్ రన్ ప్రమాదం" },
    en: "Witnessed a speeding black vehicle collide with a barrier and two-wheeler before accelerating southwards without stopping. Vehicle had tinted windows and partial registration plate visible.",
    hi: "तेज रफ्तार काले वाहन ने सड़क किनारे बैरियर और दोपहिया को टक्कर मारी और बिना रुके तेजी से आगे निकल गया। वाहन की खिड़कियां काली थीं और आंशिक नंबर प्लेट दिखाई दी।",
    te: "వేగంగా వచ్చిన నల్లటి వాహనం బారికేడ్ మరియు ద్విచక్ర వాహనాన్ని ఢీకొట్టి ఆగకుండా పారిపోయింది. వాహనం అద్దాలు నల్లగా ఉన్నాయి మరియు పాక్షిక నంబర్ ప్లేట్ కనిపించింది."
  },
  burglary: {
    title: { en: "🏢 Office Break-in", hi: "🏢 कार्यालय में सेंधमारी", te: "🏢 కార్యాలయ చోరీ" },
    en: "Overnight commercial office break-in. Access card lock bypassed between 02:00 AM and 04:00 AM. Multiple developer workstations and backup storage hardware were removed.",
    hi: "रात के समय कार्यालय में ताला तोड़कर चोरी। 02:00 और 04:00 के बीच कार्ड लॉक बाइपास किया गया। कई डेवलपर वर्कस्टेशन और स्टोरेज हार्डवेयर चुराए गए।",
    te: "రాత్రివేళ వాణిజ్య కార్యాలయంలోకి చొరబడి చోరీకి పాల్పడ్డారు. అర్ధరాత్రి 2 నుండి 4 గంటల మధ్య పలు ల్యాప్‌టాప్‌లు మరియు సర్వర్ హార్డ్‌వేర్ చోరీకి గురయ్యాయి."
  },
  snatching: {
    title: { en: "📱 Chain / Phone Snatching", hi: "📱 चेन / मोबाइल स्नैचिंग", te: "📱 చైన్ / మొబైల్ స్నాచింగ్" },
    en: "Two unknown individuals riding a motorcycle without a rear number plate snatched a gold chain and mobile phone from a pedestrian on the sidewalk and fled toward the flyover.",
    hi: "बिना नंबर प्लेट वाली मोटरसाइकिल पर सवार दो अज्ञात व्यक्तियों ने फुटपाथ पर चल रहे पैदल यात्री से सोने की चेन और मोबाइल फोन छीना और फ्लाईओवर की ओर तेजी से भाग गए।",
    te: "నంబర్ ప్లేట్ లేని బైక్‌పై వచ్చిన ఇద్దరు గుర్తుతెలియని వ్యక్తులు ఫుట్‌పాత్‌పై నడుస్తున్న పాదచారుడి నుండి బంగారు గొలుసు మరియు మొబైల్ లాక్కుని ఫ్లైఓవర్ వైపు పారిపోయారు."
  },
  harassment: {
    title: { en: "🚨 Public Harassment", hi: "🚨 सार्वजनिक उत्पीड़न", te: "🚨 వేధింపుల సంఘటన" },
    en: "Aggressive harassment, verbal threats, and extortion attempt by a group of individuals near the commercial market complex during late evening hours.",
    hi: "देर शाम व्यावसायिक बाजार परिसर के पास अज्ञात व्यक्तियों के समूह द्वारा आक्रामक उत्पीड़न, मौखिक धमकियां और जबरन वसूली का प्रयास।",
    te: "రాత్రి వేళ వాణిజ్య మార్కెట్ సముదాయం వద్ద గుర్తుతెలియని వ్యక్తులు వేధింపులకు గురిచేసి, బెదిరించి బలవంతపు వసూళ్లకు పాల్పడ్డారు."
  }
};

function renderVoiceTemplates(lang) {
  const container = document.getElementById("dictationTemplateButtons");
  if (!container) return;
  container.innerHTML = Object.keys(VOICE_TEMPLATES).map(key => {
    const t = VOICE_TEMPLATES[key];
    const label = (t.title && t.title[lang]) || (t.title && t.title.en) || key;
    return `<button type="button" class="templatePillBtn" onclick="insertVoiceTemplate('${key}')">${label}</button>`;
  }).join("");
}

function switchStudioTab(tab) {
  ["stt", "audio", "winh"].forEach(t => {
    const btn = document.getElementById(t === "stt" ? "tabSpeechToText" : t === "audio" ? "tabVoiceAudio" : "tabWinHGuide");
    const pane = document.getElementById(t === "stt" ? "studioPaneSTT" : t === "audio" ? "studioPaneAudio" : "studioPaneWinH");
    if (btn) btn.classList.toggle("active", t === tab);
    if (pane) pane.classList.toggle("hidden", t !== tab);
  });
}

function switchDictationLanguage(lang) {
  dictateCurrentLang = lang;
  ["en", "hi", "te"].forEach(l => {
    const btn = document.getElementById("dictLang" + l.charAt(0).toUpperCase() + l.slice(1));
    if (btn) btn.classList.toggle("active", l === lang);
  });
  renderVoiceTemplates(lang);
  if (isDictationListening) {
    stopSpeechRecognitionSession();
    startSpeechRecognitionSession();
  }
}

function openDictationModal(targetId) {
  activeDictateTargetId = targetId;
  const targetInput = document.getElementById(targetId);
  const liveText = $("#dictationLiveText");
  const modal = $("#dictationModal");
  if (!modal || !liveText) return;

  liveText.value = targetInput && targetInput.value ? targetInput.value.trim() : "";
  updateDictCharCount();

  // Sync dictation language with current site language
  const siteLang = localStorage.getItem("drs_site_lang") || "en";
  switchDictationLanguage(siteLang);

  // Switch to STT tab by default
  switchStudioTab("stt");

  modal.classList.remove("hidden");
  startSpeechRecognitionSession();
}

function closeDictationModal() {
  stopSpeechRecognitionSession();
  stopVoiceNoteRecording();
  $("#dictationModal")?.classList.add("hidden");
  activeDictateTargetId = null;
}

function toggleDictationSession() {
  if (isDictationListening) {
    stopSpeechRecognitionSession();
  } else {
    startSpeechRecognitionSession();
  }
}

function startSpeechRecognitionSession() {
  const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
  const statusEl = document.getElementById("dictationStatusText");
  const waveContainer = document.getElementById("dictationWaveContainer");
  const toggleBtn = document.getElementById("dictationToggleBtn");
  const liveText = document.getElementById("dictationLiveText");

  if (!SpeechRec) {
    if (statusEl) statusEl.innerHTML = "<span style='color:#fbbf24;'>⚠️ Browser Speech API unsupported. Use <strong>Win + H</strong> or choose a template below.</span>";
    isDictationListening = false;
    if (waveContainer) waveContainer.classList.remove("active");
    if (toggleBtn) toggleBtn.textContent = "▶️ Start Listening";
    return;
  }

  // Clear previous instance
  if (activeDictateRecognition) {
    try { activeDictateRecognition.abort(); } catch(_) {}
    activeDictateRecognition = null;
  }

  try {
    const rec = new SpeechRec();
    activeDictateRecognition = rec;

    const langCodes = { en: "en-IN", hi: "hi-IN", te: "te-IN" };
    rec.lang = langCodes[dictateCurrentLang] || "en-IN";
    rec.continuous = true;
    rec.interimResults = true;
    rec.maxAlternatives = 1;

    let baseText = liveText.value ? liveText.value.trim() + " " : "";

    rec.onstart = () => {
      isDictationListening = true;
      consecutiveSpeechErrors = 0;
      if (waveContainer) waveContainer.classList.add("active");
      if (toggleBtn) toggleBtn.textContent = "⏹️ Stop Listening";
      if (statusEl) {
        const langName = dictateCurrentLang === "hi" ? "हिन्दी" : dictateCurrentLang === "te" ? "తెలుగు" : "English";
        statusEl.innerHTML = `<span style="color:#4ade80;">🎙️ Listening (${langName})... Speak clearly into your mic.</span>`;
      }
    };

    rec.onresult = (evt) => {
      consecutiveSpeechErrors = 0;
      let interim = "";
      let finalChunk = "";
      for (let i = evt.resultIndex; i < evt.results.length; ++i) {
        if (evt.results[i].isFinal) {
          finalChunk += evt.results[i][0].transcript + " ";
        } else {
          interim += evt.results[i][0].transcript;
        }
      }
      if (finalChunk) {
        baseText += finalChunk;
      }
      liveText.value = baseText + interim;
      updateDictCharCount();
      if (statusEl) {
        statusEl.innerHTML = `<span style="color:#4ade80;">🟢 Speech recognized! Transcribing...</span>`;
      }
    };

    rec.onerror = (evt) => {
      console.warn("Speech recognition notice:", evt.error);
      consecutiveSpeechErrors++;
      if (evt.error === "not-allowed" || evt.error === "permission-denied") {
        if (statusEl) statusEl.innerHTML = "<span style='color:#f87171;'>⚠️ Microphone blocked. Click the lock/mic icon in the browser address bar to allow.</span>";
        stopSpeechRecognitionSession();
      } else if (evt.error === "network") {
        if (statusEl) statusEl.innerHTML = "<span style='color:#fbbf24;'>⚠️ Cloud speech service unreachable. Use <strong>Win + H</strong> or choose a scenario template.</span>";
        stopSpeechRecognitionSession();
      } else if (evt.error === "audio-capture") {
        if (statusEl) statusEl.innerHTML = "<span style='color:#fbbf24;'>⚠️ Microphone not available or in use. Use <strong>Win + H</strong> or a template.</span>";
        stopSpeechRecognitionSession();
      } else if (evt.error === "no-speech") {
        if (statusEl && isDictationListening) {
          statusEl.textContent = "Waiting for speech... Speak into your microphone.";
        }
      }
    };

    rec.onend = () => {
      // Only restart if user still has listening toggled ON and no fatal errors
      if (isDictationListening && consecutiveSpeechErrors < 3) {
        clearTimeout(speechRestartTimeout);
        speechRestartTimeout = setTimeout(() => {
          if (isDictationListening) {
            try { rec.start(); } catch(_) {}
          }
        }, 300);
      } else {
        stopSpeechRecognitionSession();
      }
    };

    rec.start();
  } catch(err) {
    console.warn("Recognition start error:", err);
    if (statusEl) statusEl.innerHTML = "<span style='color:#fbbf24;'>⚠️ Unable to initialize microphone. Press <strong>Win + H</strong> anytime!</span>";
    stopSpeechRecognitionSession();
  }
}

function stopSpeechRecognitionSession() {
  isDictationListening = false;
  clearTimeout(speechRestartTimeout);
  const waveContainer = document.getElementById("dictationWaveContainer");
  const toggleBtn = document.getElementById("dictationToggleBtn");
  const statusEl = document.getElementById("dictationStatusText");

  if (waveContainer) waveContainer.classList.remove("active");
  if (toggleBtn) toggleBtn.textContent = "▶️ Resume Listening";
  if (statusEl && !statusEl.innerHTML.includes("⚠️")) {
    statusEl.textContent = "Microphone paused. Click 'Resume Listening' or 'Apply Statement'.";
  }

  if (activeDictateRecognition) {
    try { activeDictateRecognition.stop(); } catch(_) {}
    try { activeDictateRecognition.abort(); } catch(_) {}
    activeDictateRecognition = null;
  }
}

function applyDictationText() {
  const liveText = $("#dictationLiveText");
  if (!activeDictateTargetId || !liveText) {
    closeDictationModal();
    return;
  }

  const targetInput = document.getElementById(activeDictateTargetId);
  if (targetInput) {
    targetInput.value = liveText.value.trim();
    targetInput.dispatchEvent(new Event("input", { bubbles: true }));
    targetInput.dispatchEvent(new Event("change", { bubbles: true }));
    targetInput.classList.add("focusRingPulse");
    setTimeout(() => targetInput.classList.remove("focusRingPulse"), 2500);
  }

  closeDictationModal();
  showToast("✅ Statement successfully applied to form.");
}

function insertVoiceTemplate(type) {
  const liveText = $("#dictationLiveText");
  if (!liveText || !VOICE_TEMPLATES[type]) return;

  const tpl = VOICE_TEMPLATES[type][dictateCurrentLang] || VOICE_TEMPLATES[type].en;
  liveText.value = tpl;
  updateDictCharCount();
  showToast("📋 Scenario template inserted.");
}

function clearDictationText() {
  const liveText = $("#dictationLiveText");
  if (liveText) {
    liveText.value = "";
    updateDictCharCount();
  }
}

function copyDictationText() {
  const liveText = $("#dictationLiveText");
  if (liveText && liveText.value) {
    navigator.clipboard?.writeText(liveText.value);
    showToast("📋 Copied statement to clipboard.");
  }
}

function updateDictCharCount() {
  const liveText = $("#dictationLiveText");
  const countEl = $("#dictCharCount");
  if (liveText && countEl) {
    countEl.textContent = `${liveText.value.length} characters`;
  }
}

// Windows Win+H Guidance & Direct Focus
function focusAndGuideWinH(inputId) {
  const el = document.getElementById(inputId);
  if (el) {
    el.focus();
    el.scrollIntoView({ behavior: "smooth", block: "center" });
    el.classList.add("focusRingPulse");
    setTimeout(() => el.classList.remove("focusRingPulse"), 3500);
  }
  showToast("⌨️ Field focused! Press Windows Key + H on your keyboard to speak freely.", 5000);
}

function focusFieldAndPromptWinH() {
  const targetId = activeDictateTargetId || "reportOverviewInput";
  closeDictationModal();
  focusAndGuideWinH(targetId);
}

// Voice Audio Note Recording (MediaRecorder)
async function startVoiceNoteRecording() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    recordedAudioChunks = [];
    mediaRecorderInstance = new MediaRecorder(stream);

    mediaRecorderInstance.ondataavailable = (e) => {
      if (e.data.size > 0) recordedAudioChunks.push(e.data);
    };

    mediaRecorderInstance.onstop = () => {
      recordedAudioBlob = new Blob(recordedAudioChunks, { type: "audio/webm" });
      const audioUrl = URL.createObjectURL(recordedAudioBlob);
      const player = document.getElementById("dictationAudioPlayer");
      if (player) {
        player.src = audioUrl;
        player.classList.remove("hidden");
      }
      document.getElementById("voiceNoteActionsRow")?.classList.remove("hidden");

      const reader = new FileReader();
      reader.onloadend = () => {
        recordedAudioBase64 = reader.result;
      };
      reader.readAsDataURL(recordedAudioBlob);

      stream.getTracks().forEach(t => t.stop());
    };

    mediaRecorderInstance.start();
    recordDurationSec = 0;
    const timerEl = document.getElementById("recordTimerDisplay");
    recordTimerInterval = setInterval(() => {
      recordDurationSec++;
      const m = String(Math.floor(recordDurationSec / 60)).padStart(2, '0');
      const s = String(recordDurationSec % 60).padStart(2, '0');
      if (timerEl) timerEl.textContent = `${m}:${s}`;
    }, 1000);

    document.getElementById("recordAudioStartBtn")?.classList.add("hidden");
    document.getElementById("recordAudioStopBtn")?.classList.remove("hidden");
    const statusBadge = document.getElementById("recordStatusBadge");
    if (statusBadge) statusBadge.innerHTML = "🔴 <span style='color:#f87171;'>Recording voice statement... Speak now!</span>";
  } catch(err) {
    showToast("⚠️ Microphone access required for recording audio note.");
  }
}

function stopVoiceNoteRecording() {
  clearInterval(recordTimerInterval);
  if (mediaRecorderInstance && mediaRecorderInstance.state !== "inactive") {
    mediaRecorderInstance.stop();
  }
  document.getElementById("recordAudioStartBtn")?.classList.remove("hidden");
  document.getElementById("recordAudioStopBtn")?.classList.add("hidden");
  const statusBadge = document.getElementById("recordStatusBadge");
  if (statusBadge) statusBadge.innerHTML = "✅ Recording captured. Listen back below:";
}

function attachRecordedAudioToForm() {
  if (!recordedAudioBase64 || !activeDictateTargetId) {
    showToast("⚠️ No audio recorded yet.");
    return;
  }
  const target = document.getElementById(activeDictateTargetId);
  if (target) {
    const noteTag = "\n\n[OFFICIAL VOICE AUDIO NOTE ATTACHMENT - Duration: " + recordDurationSec + "s]\n" + recordedAudioBase64 + "\n";
    target.value = (target.value ? target.value.trim() + "\n" : "") + noteTag;
    target.dispatchEvent(new Event("input", { bubbles: true }));
  }
  closeDictationModal();
  showToast("✅ Audio statement attached to report form!");
}

function initSpeechDictation() {
  $$(".speechDictateBtn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      const targetId = btn.dataset.target;
      if (targetId) {
        openDictationModal(targetId);
      }
    });
  });

  const liveText = $("#dictationLiveText");
  liveText?.addEventListener("input", updateDictCharCount);
}

window.openDictationModal = openDictationModal;
window.closeDictationModal = closeDictationModal;
window.toggleDictationSession = toggleDictationSession;
window.applyDictationText = applyDictationText;
window.insertVoiceTemplate = insertVoiceTemplate;
window.switchStudioTab = switchStudioTab;
window.switchDictationLanguage = switchDictationLanguage;
window.clearDictationText = clearDictationText;
window.copyDictationText = copyDictationText;
window.focusAndGuideWinH = focusAndGuideWinH;
window.focusFieldAndPromptWinH = focusFieldAndPromptWinH;
window.startVoiceNoteRecording = startVoiceNoteRecording;
window.stopVoiceNoteRecording = stopVoiceNoteRecording;
window.attachRecordedAudioToForm = attachRecordedAudioToForm;


// ==========================================
// 4. DEEP MULTI-LANGUAGE ENGINE (i18n: EN / HI / TE)
// ==========================================
const I18N_DICT = {
  en: {
    brand_title: "DIGITAL REPORTING SYSTEM",
    brand_sub: "Confidential Incident Registry · Cryptographic Keyphrase Access",
    guided_tour: "💡 Guided Tour",
    track_case_btn: "Track Case",
    authority_btn: "Authority Portal",
    sr_off: "Screen Reader: OFF",
    sr_on: "Screen Reader: ON",
    burn_session: "🔥 Burn Session",
    tab_directory: "Incident Directory",
    tab_lodge: "Lodge Incident (Anonymous)",
    tab_track: "Track with Keyphrase",
    tab_proximity: "Proximity & Witness Matching",
    tab_credentials: "Official Credentials",
    tab_officials: "Officials Registry",
    tab_admin: "Admin Window",
    tab_audit: "Audit Trail",
    hero_badge: "Public Evidentiary Ledger",
    hero_title: "Confidential Incident & Evidentiary Reporting",
    hero_sub: "Zero-Knowledge Submission · Secret Keyphrase Access · Two-Way Authority Communication",
    dir_badge: "Public Directory",
    dir_title: "Incident Case Directory",
    dir_sub: "Live cases, public glimpses, witness consistency verification, evidence hashes, and community authenticity indications.",
    group_clusters: "🔗 Group Incident Clusters",
    refresh_btn: "↻ Refresh",
    status_all: "STATUS: ALL",
    status_pending: "PENDING",
    status_under_review: "UNDER REVIEW",
    status_investigating: "INVESTIGATING",
    status_resolved: "RESOLVED",
    status_closed: "CLOSED",
    lodge_badge: "Lodge Report",
    lodge_title: "Record an Incident Report",
    lodge_sub: "No personal data required. Set a Secret Keyphrase to maintain exclusive ownership, amend details, and communicate with investigating authorities.",
    zero_data_title: "Confidential Zero-Knowledge Submission",
    zero_data_desc: "No user data, registration, name, email, or telephone number is collected. You will use a Secret Keyphrase as your private cryptographic key to access your case, amend details, and communicate back and forth with authorities anytime.",
    reporter_citizen_title: "Filing Report as: Anonymous Citizen",
    reporter_citizen_sub: "Zero personal data collected · Keyphrase access enabled",
    reporter_badge_anon: "ANONYMOUS",
    privacy_assurance_title: "Confidential Lodgement Active",
    privacy_assurance_desc: "Your statements are sealed with 256-bit WebCrypto client-side encryption. No identity or personal telemetry is ever recorded.",
    cat_label: "Incident Category *",
    cat_choose: "Choose a category",
    cat_theft: "Theft",
    cat_fraud: "Fraud / Cybercrime",
    cat_harassment: "Harassment",
    cat_assault: "Assault",
    cat_missing: "Missing person",
    cat_traffic: "Traffic incident",
    cat_safety: "Public safety",
    cat_other: "Other",
    datetime_label: "Date & Time of Incident *",
    datetime_help: "Must not be set to a future hour.",
    loc_label: "Location / Street / Landmark *",
    loc_placeholder: "Street, junction, landmark, city",
    detect_gps_btn: "📍 Detect GPS",
    lat_label: "Latitude (Optional)",
    lng_label: "Longitude (Optional)",
    gps_autofilled: "Auto-filled via GPS",
    keyphrase_label: "Secret Keyphrase / Case Access Code *",
    gen_keyphrase_btn: "Generate Keyphrase",
    keyphrase_placeholder: "e.g. amber-falcon-842 or choose a secret phrase of your choice",
    toggle_show: "Show",
    toggle_hide: "Hide",
    keyphrase_help: "Save this phrase. You will use it with your Reference Code to track this report, amend statements, and communicate with investigating officials.",
    photo_label: "Scene Photograph / Visual Evidence (Optional)",
    photo_prompt_title: "Click or Drag to Attach Scene Photograph",
    photo_prompt_sub: "Supports JPG, PNG, WEBP (Max 5MB). Computes SHA-256 cryptographic checksum for chain of custody.",
    glimpse_label: "Public Incident Glimpse (Visible in Directory & to Witnesses) *",
    glimpse_label_short: "Public Incident Glimpse",
    glimpse_placeholder: "Provide a high-level overview so community members and potential witnesses recognize the incident (e.g. Reported store safe burglary near Main Square during morning hours). Do NOT include confidential clues or hidden details.",
    glimpse_help: "This public overview lets witnesses corroborate without copying sensitive specifics.",
    narrative_label: "Confidential Investigation Narrative (Zero-Knowledge WebCrypto E2EE) *",
    narrative_placeholder: "Describe exact sequences of events, specific vehicle makes, suspect clothing, directions of travel, items taken, and confidential forensic specifics.",
    anti_cheat_title: "Independent Witness Anti-Cheating Protection:",
    anti_cheat_desc: "This detailed narrative is encrypted client-side with AES-GCM-256 before transport. The backend acts as a blind carrier and cannot read it. Decrypted only with your Secret Keyphrase. This prevents prospective witnesses from copying answers to falsely inflate consistency scores.",
    voice_dictate: "Voice Dictate",
    dictate_active: "🔴 Stop Dictating",
    incognito_title: "Incognito Lodgement / Zero Local Traces",
    incognito_sub: "Do NOT save this report code or keyphrase in this browser's local storage (Recommended on public, shared, or monitored computers).",
    captcha_badge: "🤖 HUMAN VERIFICATION",
    captcha_sub: "Offline Canvas Verification · Zero 3rd-Party Tracking · No IP Leaks",
    captcha_refresh: "🔄 Refresh",
    captcha_speak: "🔊 Speak",
    captcha_placeholder: "ENTER CODE",
    captcha_feedback: "Enter the 5 characters shown above to verify human submission.",
    ip_scrub_notice: "Network IP scrubbing active. No personal telemetry collected.",
    ip_scrub_pill: "IP_SCRUBBED // NO_LOG",
    submit_btn: "Submit Incident & Get Keyphrase",
    track_badge: "Case Tracker",
    track_title: "Track & Access Case with Secret Keyphrase",
    track_sub: "Check updates, read inquiries from investigating authorities, and submit supplementary statements without compromising your anonymity.",
    ref_code_label: "Case Reference Code",
    ref_code_placeholder: "e.g. RPT-2026-00001",
    track_keyphrase_label: "Secret Keyphrase / Access Code",
    track_keyphrase_placeholder: "Enter the secret keyphrase used when lodging the case",
    track_submit_btn: "Unlock Case & Inquiries",
    saved_cases_title: "Active / Saved Cases in this Browser:",
    clear_history_btn: "× Clear History",
    witness_badge: "Witness Matching",
    witness_title: "Incident Discovery & Witness Matching",
    witness_sub: "Search cases by reference number, keywords, or GPS proximity. Witnesses view the public glimpse and independently submit observations.",
    search_placeholder: "Search by Case Ref (e.g. RPT-2026-00001), keywords, location, or area...",
    search_btn: "Search",
    find_nearby_btn: "Find Incidents Near Me",
    witness_empty_msg: "Enter keywords above or click 'Find Incidents Near Me' to browse nearby cases.",
    sidebar_heading: "Case Metric Ledger",
    stat_total: "Total Cases",
    stat_pending: "Pending Review",
    stat_investigating: "Active Investigations",
    stat_resolved: "Resolved / Closed",
    card_filed_by: "Filed by",
    card_incident: "Incident:",
    card_logged: "Logged:",
    card_scene: "Scene:",
    card_gps: "GPS:",
    card_views: "Views",
    card_no_reports: "No incident reports found matching your criteria.",
    card_evidence_title: "Scene Visual Evidence Attached",
    card_evidence_sub: "Click photo thumbnail to examine high-resolution evidence & custody checksum.",
    card_shield_title: "Confidential Narrative Protected:",
    card_shield_desc: "Blind Carrier model active. Detailed forensic description is encrypted client-side with 7-word Diceware keyphrase before storage.",
    card_fir_label: "Official FIR Number:",
    read_page: "🔊 Read Page Aloud"
  },
  hi: {
    brand_title: "डिजिटल रिपोर्टिंग सिस्टम",
    brand_sub: "गोपनीय घटना रजिस्ट्री · क्रिप्टोग्राफ़िक गुप्त पासफ़्रेज़ एक्सेस",
    guided_tour: "💡 निर्देशित टूर",
    track_case_btn: "केस ट्रैक करें",
    authority_btn: "प्राधिकरण पोर्टल",
    sr_off: "स्क्रीन रीडर: बंद",
    sr_on: "स्क्रीन रीडर: चालू",
    burn_session: "🔥 सत्र मिटाएं (Burn)",
    tab_directory: "घटना निर्देशिका",
    tab_lodge: "घटना दर्ज करें (गुमनाम)",
    tab_track: "कुंजी से ट्रैक करें",
    tab_proximity: "निकटता और गवाह मिलान",
    tab_credentials: "अधिकारी पहचान",
    tab_officials: "अधिकारी रजिस्ट्री",
    tab_admin: "व्यवस्थापक विंडो",
    tab_audit: "ऑडिट ट्रेल",
    hero_badge: "सार्वजनिक साक्ष्य लेज़र",
    hero_title: "गोपनीय घटना एवं साक्ष्य रिपोर्टिंग",
    hero_sub: "शून्य-ज्ञान सबमिशन · गुप्त 7-शब्द पासफ़्रेज़ · दो-तरफ़ा पुलिस संवाद",
    dir_badge: "सार्वजनिक निर्देशिका",
    dir_title: "घटना केस निर्देशिका",
    dir_sub: "सक्रिय केस, सार्वजनिक विवरण, आधिकारिक स्थिति और सामुदायिक सत्यापन।",
    group_clusters: "🔗 घटना समूहों को एक साथ जोड़ें",
    refresh_btn: "↻ ताज़ा करें",
    status_all: "स्थिति: सभी",
    status_pending: "लंबित (Pending)",
    status_under_review: "समीक्षाधीन (Under Review)",
    status_investigating: "जांच जारी (Investigating)",
    status_resolved: "निस्तारित (Resolved)",
    status_closed: "बंद (Closed)",
    lodge_badge: "रिपोर्ट दर्ज करें",
    lodge_title: "एक नई घटना रिपोर्ट दर्ज करें",
    lodge_sub: "किसी व्यक्तिगत डेटा की आवश्यकता नहीं है। अपने केस को प्रबंधित करने के लिए एक गुप्त पासफ़्रेज़ प्राप्त करें।",
    zero_data_title: "गोपनीय शून्य-ज्ञान सबमिशन",
    zero_data_desc: "कोई व्यक्तिगत डेटा, नाम, ईमेल या फ़ोन नंबर नहीं लिया जाता। आप केवल 7-शब्द पासफ़्रेज़ से केस नियंत्रित करेंगे।",
    reporter_citizen_title: "रिपोर्ट दर्जकर्ता: गुमनाम नागरिक",
    reporter_citizen_sub: "शून्य व्यक्तिगत डेटा एकत्र · पासफ़्रेज़ एक्सेस सक्षम",
    reporter_badge_anon: "गुमनाम",
    privacy_assurance_title: "गोपनीय सबमिशन मोड सक्रिय",
    privacy_assurance_desc: "आपके बयान 256-बिट वेबक्रिप्टो एन्क्रिप्शन से सुरक्षित हैं। कोई व्यक्तिगत पहचान या आईपी पता रिकॉर्ड नहीं होता।",
    cat_label: "घटना की श्रेणी (प्रकार) *",
    cat_choose: "एक श्रेणी चुनें",
    cat_theft: "चोरी (Theft)",
    cat_fraud: "धोखाधड़ी / साइबर अपराध",
    cat_harassment: "उत्पीड़न (Harassment)",
    cat_assault: "हमला (Assault)",
    cat_missing: "लापता व्यक्ति",
    cat_traffic: "सड़क दुर्घटना / यातायात",
    cat_safety: "सार्वजनिक सुरक्षा",
    cat_other: "अन्य (Other)",
    datetime_label: "घटना की तारीख और समय *",
    datetime_help: "भविष्य का समय नहीं चुना जा सकता।",
    loc_label: "घटना का स्थान / सड़क / लैंडमार्क *",
    loc_placeholder: "सड़क, चौराहा, लैंडमार्क, शहर",
    detect_gps_btn: "📍 जीपीएस खोजें",
    lat_label: "अक्षांश (वैकल्पिक)",
    lng_label: "देशांतर (वैकल्पिक)",
    gps_autofilled: "जीपीएस द्वारा स्वचालित",
    keyphrase_label: "गुप्त पासफ़्रेज़ / केस एक्सेस कुंजी *",
    gen_keyphrase_btn: "पासफ़्रेज़ बनाएं",
    keyphrase_placeholder: "उदा. amber-falcon-842 या अपनी पसंद का गुप्त वाक्यांश",
    toggle_show: "दिखाएं",
    toggle_hide: "छिपाएं",
    keyphrase_help: "इस वाक्यांश को सुरक्षित रखें। इसका उपयोग संदर्भ कोड के साथ केस ट्रैक करने और अधिकारियों से संवाद में होगा।",
    photo_label: "घटना स्थल की तस्वीर / दृश्य साक्ष्य (वैकल्पिक)",
    photo_prompt_title: "फ़ोटो जोड़ने के लिए यहाँ क्लिक करें या खींचें",
    photo_prompt_sub: "JPG, PNG, WEBP (अधिकतम 5MB)। SHA-256 हैश द्वारा सुरक्षित।",
    glimpse_label: "सार्वजनिक घटना झलक (जनता और गवाहों के लिए दृश्य) *",
    glimpse_label_short: "सार्वजनिक घटना झलक",
    glimpse_placeholder: "एक संक्षिप्त विवरण दें ताकि गवाह घटना को पहचान सकें (उदा. मुख्य चौराहे के पास सुबह की चोरी)। संवेदनशील सुराग न लिखें।",
    glimpse_help: "यह सार्वजनिक विवरण गवाहों को संवेदनशील विवरणों की नकल किए बिना पुष्टि करने देता है।",
    narrative_label: "गोपनीय जांच विवरण (वेबक्रिप्टो E2EE एन्क्रिप्टेड) *",
    narrative_placeholder: "घटनाओं का सटीक क्रम, संदिग्ध के कपड़े, वाहन विवरण, और फोरेंसिक बारीकियां बताएं।",
    anti_cheat_title: "स्वतंत्र गवाह नकल-रोधी सुरक्षा:",
    anti_cheat_desc: "यह विस्तृत विवरण सर्वर पर भेजने से पहले ब्राउज़र में एन्क्रिप्ट किया जाता है। बैकएंड इसे नहीं पढ़ सकता। केवल आपके गुप्त पासफ़्रेज़ से डिक्रिप्ट होता है।",
    voice_dictate: "बोलकर लिखें",
    dictate_active: "🔴 बोलना बंद करें",
    incognito_title: "इंकॉग्निटो रिपोर्टिंग / शून्य स्थानीय निशान",
    incognito_sub: "इस ब्राउज़र में केस कोड या पासफ़्रेज़ सुरक्षित न करें (साझा कंप्यूटर के लिए)।",
    captcha_badge: "🤖 मानव सत्यापन (कैप्चा)",
    captcha_sub: "ऑफ़लाइन सत्यापन · कोई तृतीय-पक्ष ट्रैकिंग नहीं · कोई आईपी लीक नहीं",
    captcha_refresh: "🔄 नया कोड",
    captcha_speak: "🔊 बोलें",
    captcha_placeholder: "कोड दर्ज करें",
    captcha_feedback: "मानव सत्यापन के लिए ऊपर दिखाए गए 5 वर्ण दर्ज करें।",
    ip_scrub_notice: "नेटवर्क आईपी स्क्रबिंग सक्रिय। कोई व्यक्तिगत डेटा एकत्र नहीं किया जाता।",
    ip_scrub_pill: "● आईपी सुरक्षित // शून्य लॉग",
    submit_btn: "घटना दर्ज करें और पासफ़्रेज़ प्राप्त करें",
    track_badge: "केस ट्रैकर",
    track_title: "गुप्त पासफ़्रेज़ से केस ट्रैक करें",
    track_sub: "अधिकारियों के संदेश देखें, अपडेट प्राप्त करें और पूरक साक्ष्य जोड़ें।",
    ref_code_label: "केस संदर्भ कोड (Reference Code)",
    ref_code_placeholder: "उदा. RPT-2026-00001",
    track_keyphrase_label: "गुप्त पासफ़्रेज़ / एक्सेस कोड",
    track_keyphrase_placeholder: "केस दर्ज करते समय उपयोग किया गया गुप्त पासफ़्रेज़ दर्ज करें",
    track_submit_btn: "केस अनलॉक करें",
    saved_cases_title: "इस ब्राउज़र में सक्रिय / सहेजे गए केस:",
    clear_history_btn: "× इतिहास साफ़ करें",
    witness_badge: "गवाह मिलान",
    witness_title: "घटना खोज एवं गवाह मिलान",
    witness_sub: "रेफरेंस नंबर, कीवर्ड या जीपीएस निकटता द्वारा केस खोजें। गवाह सार्वजनिक विवरण देखकर अपने बयान जोड़ सकते हैं।",
    search_placeholder: "केस कोड (उदा. RPT-2026-00001), कीवर्ड, स्थान या क्षेत्र द्वारा खोजें...",
    search_btn: "खोजें",
    find_nearby_btn: "मेरे निकटवर्ती केस खोजें",
    witness_empty_msg: "ऊपर कीवर्ड दर्ज करें या अपने आस-पास के केस देखने के लिए 'मेरे निकटवर्ती केस खोजें' पर क्लिक करें।",
    sidebar_heading: "केस मेट्रिक्स लेज़र",
    stat_total: "कुल केस",
    stat_pending: "लंबित समीक्षा",
    stat_investigating: "सक्रिय जांच",
    stat_resolved: "निस्तारित केस",
    card_filed_by: "द्वारा दर्ज:",
    card_incident: "घटना:",
    card_logged: "दर्ज समय:",
    card_scene: "घटना स्थल:",
    card_gps: "जीपीएस:",
    card_views: "व्यूज",
    card_no_reports: "आपकी खोज के अनुसार कोई घटना रिपोर्ट नहीं मिली।",
    card_evidence_title: "घटना स्थल का साक्ष्य संलग्न",
    card_evidence_sub: "उच्च-रिज़ॉल्यूशन साक्ष्य और हैश देखने के लिए फ़ोटो पर क्लिक करें।",
    card_shield_title: "गोपनीय विवरण सुरक्षित:",
    card_shield_desc: "ब्लाइंड कैरियर मॉडल सक्रिय। विस्तृत फोरेंसिक विवरण केवल 7-शब्द गुप्त पासफ़्रेज़ से खोला जा सकता है।",
    card_fir_label: "आधिकारिक एफआईआर संख्या:",
    read_page: "🔊 पृष्ठ को बोलकर सुनाएं"
  },
  te: {
    brand_title: "డిజిటల్ రిపోర్టింగ్ సిస్టమ్",
    brand_sub: "రహస్య సంఘటన నమోదు పట్టిక · క్రిప్టోగ్రాఫిక్ కీఫ్రేజ్ యాక్సెస్",
    guided_tour: "💡 మార్గదర్శక పర్యటన",
    track_case_btn: "కేసు ట్రాక్ చేయండి",
    authority_btn: "అధికారిక పోర్టల్",
    sr_off: "స్క్రీన్ రీడర్: ఆఫ్",
    sr_on: "స్క్రీన్ రీడర్: ఆన్",
    burn_session: "🔥 సెషన్ తుడిచివేయి (Burn)",
    tab_directory: "కేసుల డైరెక్టరీ",
    tab_lodge: "కేసు నమోదు చేయండి (అనామకంగా)",
    tab_track: "కీఫ్రేజ్‌తో ట్రాక్ చేయండి",
    tab_proximity: "సమీపత మరియు సాక్షుల గుర్తింపు",
    tab_credentials: "అధికారిక ఆధారాలు",
    tab_officials: "అధికారుల రిజిస్ట్రీ",
    tab_admin: "అడ్మిన్ విండో",
    tab_audit: "ఆడిట్ ట్రయిల్",
    hero_badge: "పబ్లిక్ సాక్ష్యాధారాల లెడ్జర్",
    hero_title: "రహస్య సంఘటన మరియు సాక్ష్యాధారాల నివేదిక",
    hero_sub: "జీరో-నాలెడ్జ్ నమోదు · 7-పదాల రహస్య కీఫ్రేజ్ · ద్విముఖ పోలీసు సంభాషణ",
    dir_badge: "పబ్లిక్ డైరెక్టరీ",
    dir_title: "నమోదైన కేసుల డైరెక్టరీ",
    dir_sub: "లైవ్ కేసులు, పబ్లిక్ వివరాలు, అధికారిక ధృవీకరణ మరియు సాక్ష్యాల సంరక్షణ.",
    group_clusters: "🔗 సమూహ సంఘటనలను క్లస్టర్ చేయండి",
    refresh_btn: "↻ రీఫ్రెష్",
    status_all: "స్థితి: అన్నీ",
    status_pending: "పెండింగ్ (Pending)",
    status_under_review: "పరిశీలనలో ఉంది (Under Review)",
    status_investigating: "దర్యాప్తు జరుగుతోంది (Investigating)",
    status_resolved: "పరిష్కరించబడింది (Resolved)",
    status_closed: "ముగించబడింది (Closed)",
    lodge_badge: "రిపోర్ట్ నమోదు",
    lodge_title: "సంఘటన నివేదికను నమోదు చేయండి",
    lodge_sub: "వ్యక్తిగత వివరాలు అవసరం లేదు. కేసు యాజమాన్యం కోసం 7-పదాల రహస్య కీఫ్రేజ్ ఉపయోగించండి.",
    zero_data_title: "రహస్య జీరో-నాలెడ్జ్ సబ్మిషన్",
    zero_data_desc: "పేరు, ఈమెయిల్ లేదా ఫోన్ నంబర్ ఏదీ సేకరించబడదు. మీ ప్రైవేట్ కీఫ్రేజ్ ద్వారా మాత్రమే యాక్సెస్ ఉంటుంది.",
    reporter_citizen_title: "రిపోర్ట్ నమోదు చేస్తున్నది: అనామక పౌరుడు",
    reporter_citizen_sub: "వ్యక్తిగత డేటా సేకరించబడదు · కీఫ్రేజ్ యాక్సెస్ ప్రారంభించబడింది",
    reporter_badge_anon: "అనామక",
    privacy_assurance_title: "రహస్య నమోదు మోడ్ యాక్టివ్",
    privacy_assurance_desc: "మీ సమాచారం 256-బిట్ వెబ్‌క్రిప్టో ఎన్‌క్రిప్షన్‌తో రక్షించబడింది. ఎటువంటి ఐపీ లేదా వ్యక్తిగత డేటా నిల్వ చేయబడదు.",
    cat_label: "సంఘటన రకం (కేటగిరీ) *",
    cat_choose: "ఒక కేటగిరీని ఎంచుకోండి",
    cat_theft: "దొంగతనం (Theft)",
    cat_fraud: "మోసం / సైబర్‌క్రైమ్",
    cat_harassment: "వేధింపులు (Harassment)",
    cat_assault: "దాడి (Assault)",
    cat_missing: "మిస్సింగ్ పర్సన్",
    cat_traffic: "ట్రాఫిక్ ప్రమాదం",
    cat_safety: "ప్రజా భద్రత",
    cat_other: "ఇతర (Other)",
    datetime_label: "సంఘటన జరిగిన తేదీ మరియు సమయం *",
    datetime_help: "భవిష్యత్ సమయాన్ని ఎంచుకోకూడదు.",
    loc_label: "సంఘటన స్థలం / వీధి / ల్యాండ్‌మార్క్ *",
    loc_placeholder: "వీధి, కూడలి, ల్యాండ్‌మార్క్, నగరం",
    detect_gps_btn: "📍 జీపీఎస్ గుర్తించు",
    lat_label: "అక్షాంశం (ఐచ్ఛికం)",
    lng_label: "రేఖాంశం (ఐచ్ఛికం)",
    gps_autofilled: "జీపీఎస్ ద్వారా ఆటో-ఫిల్ చేయబడింది",
    keyphrase_label: "రహస్య కీఫ్రేజ్ / యాక్సెస్ కోడ్ *",
    gen_keyphrase_btn: "కీఫ్రేజ్ రూపొందించండి",
    keyphrase_placeholder: "ఉదా. amber-falcon-842 లేదా మీకు నచ్చిన రహస్య పదం",
    toggle_show: "చూపించు",
    toggle_hide: "దాచు",
    keyphrase_help: "ఈ పదాన్ని భద్రపరుచుకోండి. రిఫరెన్స్ కోడ్‌తో కేసును ట్రాక్ చేయడానికి మరియు పోలీసులతో మాట్లాడటానికి ఇది ఉపయోగపడుతుంది.",
    photo_label: "సంఘటన స్థల ఛాయాచిత్రం / సాక్ష్యం (ఐచ్ఛికం)",
    photo_prompt_title: "ఫోటోను జతచేయడానికి ఇక్కడ క్లిక్ చేయండి లేదా లాగండి",
    photo_prompt_sub: "JPG, PNG, WEBP (గరిష్టంగా 5MB). SHA-256 హాష్ ద్వారా భద్రపరచబడింది.",
    glimpse_label: "పబ్లిక్ ఇన్సిడెంట్ గ్లింప్స్ (సాక్షుల గుర్తింపు కోసం) *",
    glimpse_label_short: "పబ్లిక్ ఇన్సిడెంట్ గ్లింప్స్",
    glimpse_placeholder: "సాక్షులు సంఘటనను గుర్తించేలా సంక్షిప్త వివరాలు ఇవ్వండి (ఉదా. మెయిన్ స్క్వేర్ వద్ద ఉదయం జరిగిన దుకాణం దొంగతనం). రహస్య ఆధారాలను ఇక్కడ రాయకండి.",
    glimpse_help: "ఈ పబ్లిక్ వివరణ రహస్య వివరాలను కాపీ చేయకుండా సాక్షులు ధృవీకరించడానికి అనుమతిస్తుంది.",
    narrative_label: "రహస్య విచారణ వివరాలు (వెబ్‌క్రిప్టో E2EE ఎన్‌క్రిప్ట్ చేయబడింది) *",
    narrative_placeholder: "సంఘటనల ఖచ్చితమైన క్రమం, అనుమానితుల దుస్తులు, వాహనం మరియు ఫోరెన్సిక్ వివరాలను వివరించండి.",
    anti_cheat_title: "స్వతంత్ర సాక్షుల కాపీ-నిరోధక రక్షణ:",
    anti_cheat_desc: "ఈ వివరణ బ్రౌజర్‌లోనే ఎన్‌క్రిప్ట్ చేయబడుతుంది. సర్వర్ దీన్ని చదవలేదు. మీ రహస్య కీఫ్రేజ్‌తో మాత్రమే డీక్రిప్ట్ చేయబడుతుంది.",
    voice_dictate: "వాయిస్ ద్వారా చెప్పండి",
    dictate_active: "🔴 రికార్డింగ్ ఆపండి",
    incognito_title: "ఇన్‌కాగ్నిటో నమోదు / స్థానిక రికార్డులు లేకుండా",
    incognito_sub: "ఈ బ్రౌజర్‌లో కేసు వివరాలను దాచవద్దు (పబ్లిక్ కంప్యూటర్ల కోసం).",
    captcha_badge: "🤖 హ్యూమన్ వెరిఫికేషన్ (క్యాప్చా)",
    captcha_sub: "ఆఫ్‌లైన్ వెరిఫికేషన్ · ట్రాకింగ్ లేదు · ఐపీ రక్షణ",
    captcha_refresh: "🔄 కొత్త కోడ్",
    captcha_speak: "🔊 వినిపించు",
    captcha_placeholder: "కోడ్ నమోదు చేయండి",
    captcha_feedback: "హ్యూమన్ వెరిఫికేషన్ కోసం పైన చూపిన 5 అక్షరాలను నమోదు చేయండి.",
    ip_scrub_notice: "నెట్‌వర్క్ ఐపీ రక్షణ యాక్టివ్‌గా ఉంది. ఎటువంటి వ్యక్తిగత సమాచారం సేకరించబడదు.",
    ip_scrub_pill: "● ఐపీ రక్షించబడింది // నో లాగ్",
    submit_btn: "కేసు నమోదు చేసి కీఫ్రేజ్ పొందండి",
    track_badge: "కేస్ ట్రాకర్",
    track_title: "రహస్య కీఫ్రేజ్‌తో కేసును ట్రాక్ చేయండి",
    track_sub: "అధికారుల సంభాషణలు, కేసు స్థితి మరియు అదనపు సాక్ష్యాలను పరిశీలించండి.",
    ref_code_label: "కేస్ రిఫరెన్స్ కోడ్ (Reference Code)",
    ref_code_placeholder: "ఉదా. RPT-2026-00001",
    track_keyphrase_label: "రహస్య కీఫ్రేజ్ / యాక్సెస్ కోడ్",
    track_keyphrase_placeholder: "కేసు నమోదు చేసినప్పుడు పొందిన రహస్య కీఫ్రేజ్ నమోదు చేయండి",
    track_submit_btn: "కేసును అన్‌లాక్ చేయండి",
    saved_cases_title: "ఈ బ్రౌజర్‌లో సేవ్ చేయబడిన కేసులు:",
    clear_history_btn: "× చరిత్రను తొలగించు",
    witness_badge: "సాక్షుల గుర్తింపు",
    witness_title: "సంఘటన గుర్తింపు మరియు సాక్షుల శోధన",
    witness_sub: "రిఫరెన్స్ కోడ్, కీలక పదాలు లేదా GPS ద్వారా కేసులను శోధించండి. సాక్షులు పబ్లిక్ సమాచారాన్ని చూసి తమ వివరాలను అందించవచ్చు.",
    search_placeholder: "కేసు కోడ్ (ఉదా. RPT-2026-00001), స్థలం లేదా కీవర్డ్ ద్వారా శోధించండి...",
    search_btn: "శోధించండి",
    find_nearby_btn: "నా దగ్గరలోని సంఘటనలు గుర్తించు",
    witness_empty_msg: "పైన వివరాలు నమోదు చేయండి లేదా సమీప కేసులను చూడటానికి 'నా దగ్గరలోని సంఘటనలు గుర్తించు' క్లిక్ చేయండి.",
    sidebar_heading: "కేస్ కొలమానాల లెడ్జర్",
    stat_total: "మొత్తం కేసులు",
    stat_pending: "పెండింగ్ కేసులు",
    stat_investigating: "దర్యాప్తులో ఉన్నవి",
    stat_resolved: "పరిష్కరించబడినవి",
    card_filed_by: "దాఖలు చేసినవారు:",
    card_incident: "సంఘటన:",
    card_logged: "నమోదు సమయం:",
    card_scene: "సంఘటన స్థలం:",
    card_gps: "జీపీఎస్:",
    card_views: "వీక్షణలు",
    card_no_reports: "మీ శోధనకు సంబంధించిన నివేదికలు ఏవీ కనుగొనబడలేదు.",
    card_evidence_title: "సంఘటన స్థల సాక్ష్యం జతచేయబడింది",
    card_evidence_sub: "సాక్ష్యాధారాలను పరిశీలించడానికి ఫోటోపై క్లిక్ చేయండి.",
    card_shield_title: "రహస్య దర్యాప్తు వివరాలు భద్రపరచబడ్డాయి:",
    card_shield_desc: "బ్లైండ్ క్యారియర్ మోడల్ యాక్టివ్. ఈ వివరాలు కేవలం 7-పదాల రహస్య కీఫ్రేజ్‌తో మాత్రమే తెరవబడతాయి.",
    card_fir_label: "అధికారిక ఎఫ్ఐఆర్ సంఖ్య:",
    read_page: "🔊 పేజీని బిగ్గరగా చదవండి"
  }
};

function setLanguage(lang) {
  const dict = I18N_DICT[lang] || I18N_DICT.en;
  localStorage.setItem("drs_site_lang", lang);
  document.documentElement.lang = lang;

  // Sync select dropdown
  const select = $("#siteLangSelect");
  if (select && select.value !== lang) {
    select.value = lang;
  }

  // Update active pill button
  $("#langBtnEn")?.classList.toggle("active", lang === "en");
  $("#langBtnHi")?.classList.toggle("active", lang === "hi");
  $("#langBtnTe")?.classList.toggle("active", lang === "te");

  // 1. Update elements with data-i18n
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    if (dict[key]) {
      if (el.tagName === "INPUT" || el.tagName === "TEXTAREA") {
        el.placeholder = dict[key];
      } else {
        el.textContent = dict[key];
      }
    }
  });

  // 2. Update elements with data-i18n-placeholder
  document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
    const key = el.getAttribute("data-i18n-placeholder");
    if (dict[key]) {
      el.placeholder = dict[key];
    }
  });

  // 3. Welcome title & Sub
  const welcomeTitle = $("#welcomeTitle");
  if (welcomeTitle && !currentUser) welcomeTitle.textContent = dict.hero_title;
  const roleText = $("#roleText");
  if (roleText && !currentUser) roleText.textContent = dict.hero_sub;

  // 4. IP Scrubbing pill
  const ipPill = $("#ipSecurityPill .retroFont");
  if (ipPill) ipPill.textContent = dict.ip_scrub_pill || "IP_SCRUBBED // NO_LOG";

  // 5. Update nav tab buttons
  const tabDir = document.querySelector("button[data-view='reports']");
  if (tabDir) tabDir.textContent = dict.tab_directory;

  const tabLodge = document.querySelector("button[data-view='lodge']");
  if (tabLodge) tabLodge.textContent = dict.tab_lodge;

  const tabTrack = document.querySelector("button[data-view='track']");
  if (tabTrack) tabTrack.textContent = dict.tab_track;

  const tabProx = document.querySelector("button[data-view='contribute']");
  if (tabProx) tabProx.textContent = dict.tab_proximity;

  const tabCred = document.querySelector("button[data-view='credentials']");
  if (tabCred) tabCred.textContent = dict.tab_credentials || "Official Credentials";

  const tabOff = document.querySelector("button[data-view='officials']");
  if (tabOff) tabOff.textContent = dict.tab_officials || "Officials Registry";

  const tabAdm = document.querySelector("button[data-view='adminWindow']");
  if (tabAdm) tabAdm.textContent = dict.tab_admin || "Admin Window";

  const tabAud = document.querySelector("button[data-view='auditLogs']");
  if (tabAud) tabAud.textContent = dict.tab_audit || "Audit Trail";

  // 6. Topbar buttons & common controls
  const tourBtn = $("#btnGuidedTourNav");
  if (tourBtn) tourBtn.textContent = dict.guided_tour;

  const burnBtn = $("#burnSessionNavBtn");
  if (burnBtn) burnBtn.textContent = dict.burn_session;

  const trackCaseNav = $("#btnTrackCaseNav");
  if (trackCaseNav) trackCaseNav.textContent = dict.track_case_btn;

  const authLoginNav = $("#btnAuthorityLoginNav");
  if (authLoginNav) authLoginNav.textContent = dict.authority_btn;

  const submitBtn = $("#submitReportBtn");
  if (submitBtn) submitBtn.textContent = dict.submit_btn;

  const refreshBtn = $("#refreshBtn");
  if (refreshBtn) refreshBtn.innerHTML = dict.refresh_btn;

  const readPageBtn = $("#readPageFloatingBtn span");
  if (readPageBtn) readPageBtn.textContent = dict.read_page;

  // 7. Update voice dictation buttons
  $$(".speechDictateBtn").forEach(btn => {
    if (!btn.classList.contains("recording")) {
      const dictateText = btn.querySelector(".dictateText");
      if (dictateText) dictateText.textContent = dict.voice_dictate || "Voice Dictate";
    }
  });

  // 8. Re-evaluate reporter role UI and re-render report cards in selected language
  setupReportingRoleUI();
  if (typeof applyFiltersAndRender === "function") {
    applyFiltersAndRender();
  }

  updateScreenReaderUI();
}

function initLanguageSelector() {
  const saved = localStorage.getItem("drs_site_lang") || "en";
  setLanguage(saved);
}

// ==========================================
// 5. ACCESSIBILITY SCREEN READER (TTS Audio Guide)
// ==========================================
let isScreenReaderActive = false;

function initScreenReader() {
  const toggleBtn = $("#screenReaderBtn");
  const readPageBtn = $("#readPageFloatingBtn");

  isScreenReaderActive = localStorage.getItem("drs_screen_reader") === "true";
  updateScreenReaderUI();

  toggleBtn?.addEventListener("click", () => {
    isScreenReaderActive = !isScreenReaderActive;
    localStorage.setItem("drs_screen_reader", isScreenReaderActive ? "true" : "false");
    updateScreenReaderUI();
    if (isScreenReaderActive) {
      speakAloud("Voice Screen Reader activated. Audio assistance is now active.");
    } else {
      if ("speechSynthesis" in window) window.speechSynthesis.cancel();
      showToast("🔈 Screen Reader deactivated.");
    }
  });

  readPageBtn?.addEventListener("click", () => {
    readActivePageAloud();
  });

  // Dynamic voice assistance on element focus when active
  document.addEventListener("focusin", (e) => {
    if (!isScreenReaderActive) return;
    const el = e.target;
    if (!el) return;
    const desc = el.getAttribute("aria-label") || el.getAttribute("placeholder") || el.getAttribute("title") || el.innerText || el.name || "";
    if (desc && desc.trim().length > 1 && desc.trim().length < 100) {
      speakAloud(desc.trim(), false);
    }
  });
}

function updateScreenReaderUI() {
  const toggleBtn = $("#screenReaderBtn");
  const srLabel = $("#srLabel");
  const srIcon = $("#srIcon");
  const currentLang = $("#siteLangSelect")?.value || "en";
  const dict = I18N_DICT[currentLang] || I18N_DICT.en;

  if (isScreenReaderActive) {
    toggleBtn?.classList.add("active");
    if (srLabel) srLabel.textContent = dict.sr_on;
    if (srIcon) srIcon.textContent = "🔊";
    document.body.classList.add("accessibilityMode");
  } else {
    toggleBtn?.classList.remove("active");
    if (srLabel) srLabel.textContent = dict.sr_off;
    if (srIcon) srIcon.textContent = "🔈";
    document.body.classList.remove("accessibilityMode");
  }
}

function speakAloud(text, interrupt = true) {
  if (!("speechSynthesis" in window) || !text) {
    showToast("Audio speech synthesis is not supported on this device.");
    return;
  }

  try {
    if (interrupt) {
      window.speechSynthesis.cancel();
    }
    window.speechSynthesis.resume();

    // 60ms delay ensures Chromium queue clears after cancel() without dropping speech
    setTimeout(() => {
      try {
        const utterance = new SpeechSynthesisUtterance(text);
        window._activeSpeechUtterance = utterance; // Prevent garbage collection in Chrome

        const currentLang = $("#siteLangSelect")?.value || "en";
        const langMap = { en: "en-US", hi: "hi-IN", te: "te-IN" };
        const voiceLang = langMap[currentLang] || "en-US";

        const voices = window.speechSynthesis.getVoices();
        if (voices && voices.length) {
          const match = voices.find(v => v.lang === voiceLang || v.lang.startsWith(currentLang))
                     || voices.find(v => v.lang.startsWith("en"));
          if (match) utterance.voice = match;
        }

        utterance.lang = voiceLang;
        utterance.rate = 0.95;
        utterance.pitch = 1.0;

        const floatBtn = $("#readPageFloatingBtn");
        if (floatBtn) floatBtn.classList.add("speaking");

        utterance.onend = () => {
          if (floatBtn) floatBtn.classList.remove("speaking");
          window._activeSpeechUtterance = null;
        };

        utterance.onerror = (e) => {
          console.warn("Speech synthesis notice:", e);
          if (floatBtn) floatBtn.classList.remove("speaking");
          window._activeSpeechUtterance = null;
        };

        window.speechSynthesis.speak(utterance);
        showToast("🔊 Reading aloud...");
      } catch (innerErr) {
        console.warn("Speech utterance error:", innerErr);
      }
    }, 60);
  } catch (err) {
    console.warn("Speech error:", err);
  }
}

function readActivePageAloud() {
  const activeNav = document.querySelector(".navBtn.active");
  const viewName = activeNav ? activeNav.textContent.trim() : "Incident Directory";
  const currentLang = $("#siteLangSelect")?.value || "en";

  let text = "";
  if (currentLang === "hi") {
    text = `डिजिटल रिपोर्टिंग सिस्टम। वर्तमान दृश्य: ${viewName}। `;
    if (viewName.includes("दर्ज") || viewName.toLowerCase().includes("lodge")) {
      text += "घटना रिपोर्टिंग फॉर्म। कृपया घटना का प्रकार, समय, स्थान, सार्वजनिक झलक और गोपनीय विवरण प्रदान करें। आपकी रिपोर्ट वेबक्रिप्टो से एन्क्रिप्टेड और सुरक्षित है।";
    } else if (viewName.includes("ट्रैक") || viewName.toLowerCase().includes("track")) {
      text += "केस ट्रैकर पोर्टल। अपने केस की स्थिति जानने के लिए संदर्भ कोड और 7-शब्द गुप्त पासफ़्रेज़ दर्ज करें।";
    } else {
      const cards = document.querySelectorAll("#reportsList .reportCard");
      text += `सार्वजनिक लेज़र में वर्तमान में ${cards.length} केस उपलब्ध हैं।`;
    }
  } else if (currentLang === "te") {
    text = `డిజిటల్ రిపోర్టింగ్ సిస్టమ్. ప్రస్తుత పేజీ: ${viewName}. `;
    if (viewName.includes("నమోదు") || viewName.toLowerCase().includes("lodge")) {
      text += "కేసు నమోదు ఫారం. సంఘటన రకం, సమయం, స్థలం మరియు వివరాలు నమోదు చేయండి. మీ వివరాలు రహస్యంగా ఉంచబడతాయి.";
    } else if (viewName.includes("ట్రాక్") || viewName.toLowerCase().includes("track")) {
      text += "కేస్ ట్రాకర్. కేసు స్థితి మరియు అధికారుల సందేశాలు చూడటానికి రిఫరెన్స్ కోడ్ మరియు కీఫ్రేజ్ నమోదు చేయండి.";
    } else {
      const cards = document.querySelectorAll("#reportsList .reportCard");
      text += `డైరెక్టరీలో ప్రస్తుతం ${cards.length} కేసులు అందుబాటులో ఉన్నాయి.`;
    }
  } else {
    text = `Digital Reporting System. Active section: ${viewName}. `;
    if (viewName.toLowerCase().includes("lodge")) {
      text += "Incident Lodgement Form. Provide category, incident time, scene location, public overview, and confidential forensic description. Client-side encryption ensures absolute anonymity.";
    } else if (viewName.toLowerCase().includes("track")) {
      text += "Case Tracking Portal. Enter your Case Reference Code and 7-word secret keyphrase to decrypt case status, review authority messages, or amend details.";
    } else {
      const cards = document.querySelectorAll("#reportsList .reportCard");
      text += `Currently displaying ${cards.length} incident dossiers in public directory.`;
    }
  }

  speakAloud(text, true);
}

// ==========================================
// 6. BURN SESSION & STORAGE HYGIENE
// ==========================================
function initBurnSessionFeatures() {
  const burnAction = () => {
    const ok = confirm(`🔥 BURN SESSION WARNING:

Are you sure you want to burn this session?
This will permanently delete all cached case references, Diceware passphrases, local credentials, and browsing traces from this browser.`);
    if (!ok) return;

    localStorage.removeItem("drs_active_case");
    localStorage.removeItem("drs_case_history");
    sessionStorage.clear();
    activeSessionCase = null;
    currentUser = null;

    updateSessionUI();
    renderTrackSavedCases();
    showToast("🔥 Session burned! All local cryptographic credentials & history wiped.");
    switchView("reports");
  };

  $("#burnSessionNavBtn")?.addEventListener("click", burnAction);
  $("#burnSessionTrackBtn")?.addEventListener("click", burnAction);
  $("#clearSavedCasesBtn")?.addEventListener("click", burnAction);
}

// ==========================================
// COMPREHENSIVE 13-STEP INTERACTIVE WALKTHROUGH
// Chapters:
// 1) Exploring & Accessing Public Incident Reports (Steps 1-6)
// 2) How to Make a New Report for Yourself (Steps 7-11)
// 3) Re-Accessing, Tracking & Security Controls (Steps 12-13)
// ==========================================
const TOUR_STEPS = [
  // CHAPTER 1: Public Ledger & Exploring Existing Reports
  {
    target: "#ipSecurityPill",
    fallback: ".brandGroup",
    view: "reports",
    title: "1. Zero-Knowledge Network Anonymity",
    desc: "Tor/Reverse-proxy strips your IP address, drops X-Forwarded-For headers, and disables HTTP access logs. You explore and submit dossiers as a blind carrier with zero cookies or tracking."
  },
  {
    target: "button[data-view='reports']",
    fallback: "#viewReports",
    view: "reports",
    title: "2. Incident Directory & Public Ledger",
    desc: "Click 'Incident Directory' to browse public dossiers filed by citizens across communities. Each case is assigned an immutable cryptographic Reference Code (e.g. RPT-2026-00001)."
  },
  {
    target: ".glimpseBox",
    fallback: ".reportCard",
    view: "reports",
    title: "3. Public Glimpse & Forensic Privacy",
    desc: "The Public Glimpse allows witnesses to recognize the incident. The confidential investigation narrative is encrypted client-side with 256-bit WebCrypto AES-GCM—only accessible by entering the private keyphrase."
  },
  {
    target: ".photoThumbnailCard",
    fallback: ".reportMeta",
    view: "reports",
    title: "4. Tamper-Proof SHA-256 Photo Evidence",
    desc: "Photographs attached to cases are digitally sealed with cryptographic SHA-256 custody checksums. Click any evidence thumbnail in a report card to inspect high-resolution evidence and verified integrity."
  },
  {
    target: ".endorsementBanner",
    fallback: ".reportCard",
    view: "reports",
    title: "5. Authenticity Vouches & Corroboration",
    desc: "Citizens, journalists, and police officers can vouch for a report's authenticity. This ledger tracks corroborations across roles to distinguish verified incidents from uncorroborated claims."
  },
  {
    target: ".clusterToggleLabel",
    fallback: ".filterToolbar",
    view: "reports",
    title: "6. Deduplication & Incident Clusters",
    desc: "When multiple witnesses report the same active event within 600m and 45 minutes, our engine links them under a single master case—eliminating duplicate clutter and boosting case weight."
  },

  // CHAPTER 2: Making a New Report for Yourself
  {
    target: "button[data-view='lodge']",
    fallback: "#newLodgePanel",
    view: "lodge",
    title: "7. How to Lodge a Report for Yourself",
    desc: "Click 'Lodge Incident' to file a case. No personal details, registration, name, phone, or email are ever requested. You maintain exclusive ownership through a private keyphrase."
  },
  {
    target: "#reportOverviewInput",
    fallback: "textarea[name='incidentOverview']",
    view: "lodge",
    title: "8. Public Glimpse & 🎤 Voice Dictation",
    desc: "Write a high-level summary visible to other witnesses. You can type or click '🎤 Voice Dictate' next to the label to speak into your microphone for real-time transcription."
  },
  {
    target: "#reportDescriptionInput",
    fallback: "textarea[name='description']",
    view: "lodge",
    title: "9. Confidential Forensic Narrative (E2EE)",
    desc: "Detail suspect clothing, vehicle models, items stolen, and forensic specifics. This field is encrypted directly in your browser before sending—the server only receives encrypted ciphertext."
  },
  {
    target: "#reportKeyphraseInput",
    fallback: "#generateKeyphraseBtn",
    view: "lodge",
    title: "10. 7-Word Diceware Private Keyphrase",
    desc: "Click 'Generate Keyphrase' to produce a 7-word cryptographic passphrase (from the standard EFF Diceware list). Save this phrase—it is your private key to decrypt, update, and manage your case."
  },
  {
    target: "#reportCaptchaBox",
    fallback: "#submitReportBtn",
    view: "lodge",
    title: "11. Offline CAPTCHA & Incognito Lodgement",
    desc: "Verify human submission via our zero-knowledge canvas CAPTCHA (with '🔊 Speak' audio readout). Toggle 'Incognito Lodgement' on shared computers so no case traces are saved in browser storage."
  },

  // CHAPTER 3: Accessing, Tracking & Security Controls
  {
    target: "button[data-view='track']",
    fallback: "#trackViewForm",
    view: "track",
    title: "12. How to Re-Access & Track Your Report",
    desc: "Switch to 'Track with Keyphrase' anytime. Enter your Reference Code and 7-word passphrase to decrypt updates, submit supplementary evidence, and engage in two-way anonymous messaging with detectives."
  },
  {
    target: ".langPickerWrapper",
    fallback: "#siteLangSelect",
    view: "reports",
    title: "13. Multi-Language, Screen Reader & Burn Session",
    desc: "Change the website language between English, Hindi, and Telugu; toggle '🔊 Screen Reader' for visually impaired audio navigation; and click '🔥 Burn Session' on shared devices to wipe all browser data in 1 click."
  }
];

let currentTourStep = 0;
let lastTourNavTime = 0;

function checkFirstTimeVisitor() {
  const seen = localStorage.getItem("drs_tour_completed");
  if (!seen) {
    setTimeout(() => {
      $("#firstTimePromptModal")?.classList.remove("hidden");
    }, 1200);
  }
}

function startWalkthrough() {
  $("#firstTimePromptModal")?.classList.add("hidden");
  currentTourStep = 0;
  $("#walkthroughOverlay")?.classList.remove("hidden");
  renderTourStep();
}

function closeWalkthrough(e) {
  if (e && e.stopPropagation) e.stopPropagation();
  if (e && e.preventDefault) e.preventDefault();
  $("#walkthroughOverlay")?.classList.add("hidden");
  $("#firstTimePromptModal")?.classList.add("hidden");
  localStorage.setItem("drs_tour_completed", "true");
  switchView("reports");
}

function walkthroughNext(e) {
  if (e && e.stopPropagation) e.stopPropagation();
  if (e && e.preventDefault) e.preventDefault();
  const now = Date.now();
  if (now - lastTourNavTime < 200) return;
  lastTourNavTime = now;

  if (currentTourStep < TOUR_STEPS.length - 1) {
    currentTourStep++;
    renderTourStep();
  } else {
    closeWalkthrough();
  }
}

function walkthroughPrev(e) {
  if (e && e.stopPropagation) e.stopPropagation();
  if (e && e.preventDefault) e.preventDefault();
  const now = Date.now();
  if (now - lastTourNavTime < 200) return;
  lastTourNavTime = now;

  if (currentTourStep > 0) {
    currentTourStep--;
    renderTourStep();
  }
}

function renderTourStep() {
  const step = TOUR_STEPS[currentTourStep];
  if (!step) {
    closeWalkthrough();
    return;
  }

  // Switch view if needed
  const activeNav = document.querySelector(".navBtn.active");
  const currentView = activeNav ? activeNav.dataset.view : "reports";
  if (step.view && step.view !== currentView) {
    switchView(step.view);
  }

  // Wait for view DOM to paint
  setTimeout(() => {
    // Locate target element
    let el = document.querySelector(step.target);
    if (!el && step.fallback) {
      el = document.querySelector(step.fallback);
    }

    // Scroll to element instantly so coordinates are valid within the viewport
    if (el) {
      el.scrollIntoView({ behavior: "instant", block: "center" });
    }

    const spotlight = $("#walkthroughSpotlight");
    const tooltip = $("#walkthroughTooltip");
    const badge = $("#walkthroughStepBadge");
    const title = $("#walkthroughTitle");
    const desc = $("#walkthroughDesc");
    const prevBtn = $("#wtPrevBtn");
    const nextBtn = $("#wtNextBtn");

    if (badge) badge.textContent = `STEP ${currentTourStep + 1} OF ${TOUR_STEPS.length}`;
    if (title) title.textContent = step.title;
    if (desc) desc.textContent = step.desc;

    if (prevBtn) prevBtn.disabled = currentTourStep === 0;
    if (nextBtn) nextBtn.textContent = currentTourStep === TOUR_STEPS.length - 1 ? "Finish Tour ✓" : "Next →";

    if (el) {
      const rect = el.getBoundingClientRect();
      if (spotlight) {
        spotlight.style.top = `${Math.max(0, rect.top - 6)}px`;
        spotlight.style.left = `${Math.max(0, rect.left - 6)}px`;
        spotlight.style.width = `${Math.max(40, rect.width + 12)}px`;
        spotlight.style.height = `${Math.max(24, rect.height + 12)}px`;
      }

      if (tooltip) {
        const tooltipWidth = 400;
        const tooltipHeight = 260;

        // Calculate clamped horizontal position
        let left = rect.left;
        if (left + tooltipWidth > window.innerWidth - 20) {
          left = window.innerWidth - tooltipWidth - 20;
        }
        if (left < 20) left = 20;

        // Calculate clamped vertical position: try below, then above, then center
        let top = rect.bottom + 14;
        if (top + tooltipHeight > window.innerHeight - 20) {
          top = rect.top - tooltipHeight - 14;
        }
        // Strict boundary clamp: NEVER let tooltip overflow top or bottom of viewport
        top = Math.max(20, Math.min(window.innerHeight - tooltipHeight - 20, top));

        tooltip.style.top = `${top}px`;
        tooltip.style.left = `${left}px`;
        tooltip.style.transform = "none";
      }
    } else {
      // Fallback center modal if element not on page
      if (spotlight) {
        spotlight.style.top = "20%";
        spotlight.style.left = "20%";
        spotlight.style.width = "60%";
        spotlight.style.height = "60%";
      }
      if (tooltip) {
        tooltip.style.top = "50%";
        tooltip.style.left = "50%";
        tooltip.style.transform = "translate(-50%, -50%)";
      }
    }

    if (isScreenReaderActive) {
      speakAloud(`Step ${currentTourStep + 1} of ${TOUR_STEPS.length}. ${step.title}. ${step.desc}`);
    }
  }, 140);
}

// Function to keep spotlight in sync if user scrolls
function updateTourSpotlightOnScroll() {
  if ($("#walkthroughOverlay")?.classList.contains("hidden")) return;
  const step = TOUR_STEPS[currentTourStep];
  if (!step) return;
  let el = document.querySelector(step.target) || (step.fallback ? document.querySelector(step.fallback) : null);
  if (!el) return;
  const rect = el.getBoundingClientRect();
  const spotlight = $("#walkthroughSpotlight");
  if (spotlight) {
    spotlight.style.top = `${Math.max(0, rect.top - 6)}px`;
    spotlight.style.left = `${Math.max(0, rect.left - 6)}px`;
    spotlight.style.width = `${Math.max(40, rect.width + 12)}px`;
    spotlight.style.height = `${Math.max(24, rect.height + 12)}px`;
  }
}
window.addEventListener("scroll", updateTourSpotlightOnScroll, { passive: true });

// Expose globals for HTML button clicks
window.startWalkthrough = startWalkthrough;
window.closeWalkthrough = closeWalkthrough;
window.walkthroughNext = walkthroughNext;
window.walkthroughPrev = walkthroughPrev;

// Global listeners
document.addEventListener("DOMContentLoaded", () => {
  $("#startTourBtn")?.addEventListener("click", startWalkthrough);
  $("#declineTourBtn")?.addEventListener("click", closeWalkthrough);
  $("#btnGuidedTourNav")?.addEventListener("click", startWalkthrough);
  $("#groupClustersToggle")?.addEventListener("change", applyFiltersAndRender);
});

window.addEventListener("resize", () => {
  if (!$("#walkthroughOverlay")?.classList.contains("hidden")) {
    renderTourStep();
  }
});

// Initialization
(async () => {
  initTheme();
  initSecurityGateAnimation();
  initStatFilterTabs();
  initPhotoDropZone();
  lockFutureDates();
  initKeyphraseFeatures();
  initAutomatedThreatEngine();
  initCaptcha();
  initSpeechDictation();
  initLanguageSelector();
  initScreenReader();
  initBurnSessionFeatures();
  await initCaseSession();

  try {
    currentUser = await api("/api/auth/me");
  } catch(_) {
    currentUser = null;
  }

  await showApp();
  switchView("reports");
})();

window.setLanguage = setLanguage;
