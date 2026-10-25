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
  mcLoaderTimer = setInterval(() => {
    progress = Math.min(progress + Math.floor(Math.random() * 15 + 5), 92);
    if (bar) bar.style.width = `${progress}%`;
  }, 180);
}

function hideMinecraftLoader() {
  clearInterval(mcLoaderTimer);
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
  const iconEl = $("#reporterRoleIcon");
  const titleEl = $("#reporterIdentityTitle");
  const subEl = $("#reporterIdentitySubtitle");
  const badgeEl = $("#reporterBadgeTag");
  const officialsSection = $("#officialsPresentSection");
  const citizenNotice = $("#citizenOfficialNotice");

  if (!currentUser) {
    if (iconEl) iconEl.textContent = "👤";
    if (badgeEl) badgeEl.textContent = "ANONYMOUS";
    if (titleEl) titleEl.textContent = "Filing Report as: Anonymous Citizen";
    if (subEl) subEl.textContent = "Zero personal data collected · Keyphrase access enabled";
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
    $("#welcomeTitle").textContent = "Confidential Incident & Evidentiary Reporting";
    $("#roleText").textContent = "Zero-Knowledge Submission · Secret Keyphrase Access · Two-Way Authority Communication";
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

    // Save active case session to localStorage
    const caseObj = {
      id: res.id,
      referenceCode: res.referenceCode,
      keyphrase: res.secretKeyphrase,
      sessionToken: res.sessionToken,
      eventType: res.eventType,
      loc: res.loc,
      createdAt: res.createdAt
    };
    localStorage.setItem("drs_active_case", JSON.stringify(caseObj));
    addCaseToHistory(caseObj);
    activeSessionCase = res;

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

function renderReportsList(reports, containerEl) {
  if (!containerEl) return;
  if (!reports || !reports.length) {
    containerEl.innerHTML = '<div class="empty">No incident reports found matching your criteria.</div>';
    return;
  }

  const isReviewer = currentUser && ["GOVERNMENT_OFFICIAL", "POLICE", "ADMIN"].includes(currentUser.role);
  const isAdminOrPolice = currentUser && ["POLICE", "ADMIN"].includes(currentUser.role);

  containerEl.innerHTML = reports.map(r => {
    const hasFirstTaker = r.firstReportTakerOfficial != null;
    const ft = r.firstReportTakerOfficial;
    const icon = CATEGORY_ICONS[r.eventType] || "📋";
    const refCode = r.referenceCode || `RPT-2026-${String(r.id).padStart(5, '0')}`;
    const unreadMessages = (r.unreadAuthorityMessages || 0) + (r.unreadReporterMessages || 0);

    return `
      <article class="reportCard" id="report-card-${r.id}">
        <div class="reportTop">
          <div>
            <div class="reportTitle" style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
              <span>${icon}</span>
              <span style="font-family:var(--font-mono); color:var(--navy-deep); font-weight:700;">${safe(refCode)}</span> · 
              <span>${safe(r.eventType)}</span>
              <span class="threatBadge ${safe(r.threatLevel || 'MEDIUM')}">⚠️ ${safe(r.threatLevel || 'MEDIUM')}</span>
              <span class="importanceBadge ${safe(r.importance || 'ROUTINE')}">⚡ ${safe(r.importance || 'ROUTINE')}</span>
            </div>
            <div class="reportMeta">
              Filed by <strong>${safe(r.reporterUsername)}</strong> (${safe(r.reporterRole || 'CITIZEN')}) · 
              Incident: <strong>${safe(formatDateTime(r.dateTime))}</strong> · 
              Logged: ${safe(formatDateTime(r.createdAt))}
            </div>
          </div>
          <div style="display:flex; align-items:center; gap:8px;">
            ${r.parentReferenceCode ? `
              <span class="slideNumberBadge" style="background: rgba(194, 162, 104, 0.15); color: var(--sand-gold); border: 1px solid var(--sand-gold); font-size: 11px;" title="Clustered as a corroborating addendum to case ${safe(r.parentReferenceCode)}">
                🔗 Addendum to ${safe(r.parentReferenceCode)}
              </span>
            ` : ''}
            <button type="button" class="viewLogsBadge" onclick="openViewLogsModal(${r.id}, '${safe(refCode)}')" title="View sensitive access inspection log">
              👁️ <strong>${r.viewsCount || 0}</strong> Views
            </button>
            <span class="pill ${safe(r.status)}">${safe(r.status.replaceAll("_", " "))}</span>
          </div>
        </div>

        <div class="reportMeta">
          📍 <strong>Scene:</strong> ${safe(r.loc)} 
          ${r.latitude && r.longitude ? `<span class="muted">(GPS: ${r.latitude.toFixed(4)}, ${r.longitude.toFixed(4)})</span>` : ''}
        </div>

        ${r.photoUrl ? `
          <div class="photoThumbnailCard" onclick="openPhotoModal('${safe(r.photoUrl)}', '${safe(refCode)}')">
            <img src="${safe(r.photoUrl)}" alt="Scene Evidence" class="photoThumbnail">
            <div class="photoMetaInfo">
              <div style="display: flex; align-items: center; justify-content: space-between;">
                <strong style="color: var(--navy-deep); font-size: 12.5px;">📸 Scene Visual Evidence Attached</strong>
                <span class="slideNumberBadge" style="font-size: 10px; padding: 2px 8px;">SHA-256 SEALED</span>
              </div>
              <div class="muted" style="font-size: 11.5px; margin-top: 2px;">Click photo thumbnail to examine high-resolution evidence &amp; custody checksum.</div>
            </div>
          </div>
        ` : ''}

        <!-- Public Incident Glimpse -->
        <div class="glimpseBox">
          <div class="glimpseHeader">
            <span>🌐 Public Incident Glimpse</span>
          </div>
          <div>${safe(r.incidentOverview || r.description)}</div>
        </div>

        <!-- Confidential Narrative (Blind Carrier Model: WebCrypto E2EE Client-Side Decrypted) -->
        ${(() => {
          const isCiphertext = r.description && r.description.startsWith("ENC:v1:");
          const cachedPlain = localDecryptedCache.get(r.id);
          const hasKey = getStoredKeyphrase(refCode);

          if (cachedPlain) {
            return `
              <div class="descriptionBox" id="narrativeBox-${r.id}">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
                  <strong style="color:var(--sand-gold); font-size:12px; text-transform:uppercase;">
                    🔓 WebCrypto E2EE Decrypted Narrative
                  </strong>
                  <span class="slideNumberBadge" style="font-size:10px;">DECRYPTED CLIENT-SIDE</span>
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
                <strong>Confidential Narrative Protected:</strong> Blind Carrier model active. Detailed forensic description is encrypted client-side with 7-word Diceware keyphrase before storage.
              </div>
            </div>
          `;
        })()}

        ${r.firNumber ? `
          <div class="reportMeta" style="margin-top: 8px;">
            <strong>Official FIR Number:</strong> 
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

// Initialization
(async () => {
  initTheme();
  initSecurityGateAnimation();
  initStatFilterTabs();
  initPhotoDropZone();
  lockFutureDates();
  initKeyphraseFeatures();
  await initCaseSession();

  try {
    currentUser = await api("/api/auth/me");
  } catch(_) {
    currentUser = null;
  }

  await showApp();
  switchView("reports");
})();

// Toggle hover drawer on click (for mobile or pinned view)
$("#hoverSidebarHandle")?.addEventListener("click", () => {
  $("#hoverMetricsDrawer")?.classList.toggle("open");
});


// ==========================================
// Detailed 8-Step Interactive Incident Directory Walkthrough
// ==========================================
const TOUR_STEPS = [
  {
    target: "button[data-view='lodge']",
    view: "reports",
    title: "1. Anonymous Incident Lodgement",
    desc: "Submit confidential reports with total anonymity. No registration, real name, email, or telephone number is ever collected. Every case generates a private 7-word Diceware keyphrase for ownership and amendments."
  },
  {
    target: ".filterToolbar",
    fallback: "#threatFilter",
    view: "reports",
    title: "2. Multi-Parametric Directory Filters",
    desc: "Triage and filter incoming dossiers dynamically by Case Status (Pending, Investigating, Resolved), Threat Level (Low to Critical), and Priority Importance (Routine to Expedited) without page reloads."
  },
  {
    target: ".reportTop",
    fallback: ".reportCard",
    view: "reports",
    title: "3. Incident Reference & Risk Ratings",
    desc: "Each incident card displays an immutable Reference Code (e.g. RPT-2026-00007), Event Category, Threat & Importance risk badges, and an '👁️ Views' inspection badge showing sensitive access audit logs."
  },
  {
    target: ".glimpseBox",
    fallback: ".reportCard",
    view: "reports",
    title: "4. Public Glimpse vs. WebCrypto Narrative",
    desc: "The Public Glimpse lets community witnesses recognize the incident without leaking clues. The detailed forensic narrative is encrypted in your browser with 256-bit WebCrypto AES-GCM; the server is a blind carrier."
  },
  {
    target: ".photoThumbnailCard",
    fallback: ".reportMeta",
    view: "reports",
    title: "5. Visual Evidence & Digital Custody Hashes",
    desc: "Uploaded crime scene photographs are sealed with SHA-256 cryptographic hashes to guarantee tamper resistance. Click any thumbnail to inspect high-resolution evidence and verified checksums."
  },
  {
    target: ".endorsementBanner",
    fallback: ".reportCard",
    view: "reports",
    title: "6. Authenticity Indications & Verification Vouches",
    desc: "Citizens, verified journalists, and police officers can vouch for a report's authenticity. The endorsement ledger tracks corroboration across roles to distinguish genuine reports from false claims."
  },
  {
    target: ".cardFooterButtons",
    fallback: ".reportCard",
    view: "reports",
    title: "7. Two-Way Anonymous Inquiries & Official Actions",
    desc: "Engage in secure two-way messaging with assigned detectives without revealing your identity. Police can attach official FIR numbers, request evidence amendments, or update case progress."
  },
  {
    target: "#hoverSidebarHandle",
    view: "reports",
    title: "8. Slide-Out Ledger Metrics Sidebar",
    desc: "Hover over this gold handle on the screen edge to expand live counts and dynamic distribution bars across Total Cases, Pending Review, Active Investigations, and Resolved cases."
  }
];

let currentTourStep = 0;

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
  document.body.classList.add("tourActive");
  currentTourStep = 0;
  $("#walkthroughOverlay")?.classList.remove("hidden");
  renderTourStep();
}

function closeWalkthrough() {
  $("#walkthroughOverlay")?.classList.add("hidden");
  $("#firstTimePromptModal")?.classList.add("hidden");
  document.body.classList.remove("tourActive");
  localStorage.setItem("drs_tour_completed", "true");
}

function walkthroughNext() {
  if (currentTourStep < TOUR_STEPS.length - 1) {
    currentTourStep++;
    renderTourStep();
  } else {
    closeWalkthrough();
  }
}

function walkthroughPrev() {
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
  if (step.view && step.view !== currentFilter) {
    switchView(step.view);
  }

  // Locate target element
  let el = document.querySelector(step.target);
  if (!el && step.fallback) {
    el = document.querySelector(step.fallback);
  }

  // Scroll to element while briefly unlocking overflow
  document.body.classList.remove("tourActive");
  if (el) {
    el.scrollIntoView({ behavior: "instant", block: "center" });
  }
  document.body.classList.add("tourActive");

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
      spotlight.style.width = `${rect.width + 12}px`;
      spotlight.style.height = `${rect.height + 12}px`;
    }

    if (tooltip) {
      const tooltipWidth = 380;
      let top = rect.bottom + 14;
      let left = Math.max(16, Math.min(window.innerWidth - tooltipWidth - 20, rect.left));

      if (top + 240 > window.innerHeight) {
        top = Math.max(16, rect.top - 240);
      }
      tooltip.style.top = `${top}px`;
      tooltip.style.left = `${left}px`;
      tooltip.style.transform = "none";
    }
  } else {
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
}

// Expose globals for bulletproof HTML button clicks
window.startWalkthrough = startWalkthrough;
window.closeWalkthrough = closeWalkthrough;
window.walkthroughNext = walkthroughNext;
window.walkthroughPrev = walkthroughPrev;

// Attach event listeners as secondary safety
document.addEventListener("DOMContentLoaded", () => {
  $("#startTourBtn")?.addEventListener("click", startWalkthrough);
  $("#declineTourBtn")?.addEventListener("click", closeWalkthrough);
  $("#wtSkipBtn")?.addEventListener("click", closeWalkthrough);
  $("#wtPrevBtn")?.addEventListener("click", walkthroughPrev);
  $("#wtNextBtn")?.addEventListener("click", walkthroughNext);
  $("#btnGuidedTourNav")?.addEventListener("click", startWalkthrough);
});

window.addEventListener("resize", () => {
  if (!$("#walkthroughOverlay")?.classList.contains("hidden")) {
    renderTourStep();
  }
});
