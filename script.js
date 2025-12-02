// =============================
// KONFIGURACIJA
// =============================
const STORAGE_KEY = "posloviDE_jobs_v1";      // oglasi
const LS_ADMIN_KEY = "posloviDE_isAdmin";     // login flag

let jobs = [];

// =============================
// POMOĆNE FUNKCIJE ZA POSLOVE
// =============================
function loadJobsFromStorage() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return null;

  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

function saveJobsToStorage() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(jobs));
}

// Default poslovi
const defaultJobs = [
  {
    id: "1",
    title: "Pomoćni radnik",
    company: "Firma SD",
    country: "Njemačka",
    location: "Köln, Bonn",
    salary: "14–17€ / h",
    description:
      "Građevina, rad na fasadama, dugoročni ugovor. Smještaj organizovan.",
    contact: "WhatsApp: +49 152 23000800",
  },
  {
    id: "2",
    title: "Radnik u magacinu",
    company: "Logistic DE",
    country: "Njemačka",
    location: "Duisburg",
    salary: "13.50€ / h + bonus",
    description:
      "Sortiranje paketa, rad u smjenama, njemački jezik nije uslov.",
    contact: "Email: job@logistic.de",
  },
  {
    id: "3",
    title: "Konobar / konobarica",
    company: "AlpenHotel",
    country: "Austrija",
    location: "Tirol",
    salary: "1550–1700€ + bakšiš",
    description: "Sezonski posao u hotelu, hrana i smještaj obezbijeđeni.",
    contact: "WhatsApp: +43 600 000000",
  },
];

function initJobs() {
  const stored = loadJobsFromStorage();
  if (stored && Array.isArray(stored) && stored.length > 0) {
    jobs = stored;
  } else {
    jobs = defaultJobs.slice();
    saveJobsToStorage();
  }
}

function jobCountryFlag(country) {
  switch (country) {
    case "Njemačka":
      return "🇩🇪";
    case "Austrija":
      return "🇦🇹";
    case "Švajcarska":
      return "🇨🇭";
    case "Belgija":
      return "🇧🇪";
    case "Luksemburg":
      return "🇱🇺";
    default:
      return "🌍";
  }
}

// =============================
// RENDER POSLOVA NA POCETNOJ
// =============================
function renderJobs() {
  const list = document.getElementById("jobs-list");
  const noResults = document.getElementById("no-results");
  const searchEl = document.getElementById("search-input");
  const countryEl = document.getElementById("country-filter");

  if (!list || !searchEl || !countryEl || !noResults) return;

  const searchValue = searchEl.value.toLowerCase().trim();
  const countryValue = countryEl.value;

  list.innerHTML = "";

  const filtered = jobs.filter((job) => {
    const matchesCountry =
      countryValue === "all" || job.country === countryValue;

    const text = (
      job.title +
      job.company +
      job.location +
      job.country +
      job.description
    ).toLowerCase();

    const matchesSearch = !searchValue || text.includes(searchValue);

    return matchesCountry && matchesSearch;
  });

  if (filtered.length === 0) {
    noResults.classList.remove("hidden");
    return;
  } else {
    noResults.classList.add("hidden");
  }

  filtered.forEach((job) => {
    const card = document.createElement("article");
    card.className = "job-card";

    card.innerHTML = `
      <div class="job-header">
        <div>
          <div class="job-title">${job.title}</div>
          <div class="job-meta">${job.company} • ${job.location}</div>
        </div>
        <div class="job-country-pill">
          ${jobCountryFlag(job.country)} ${job.country}
        </div>
      </div>
      <div class="job-salary">${job.salary || ""}</div>
      <div class="job-description">
        ${job.description || ""}
      </div>
      <div class="job-actions">
        <button>Zahtjev / prijava</button>
        <div class="job-contact">${job.contact || ""}</div>
      </div>
    `;

    const btn = card.querySelector("button");
    if (btn) {
      btn.addEventListener("click", () => {
        const contactSection = document.getElementById("contact");
        if (contactSection) {
          contactSection.scrollIntoView({ behavior: "smooth" });
        }
      });
    }

    list.appendChild(card);
  });
}

// =============================
// ADMIN – OGLASI (job board)
// =============================
function renderAdminJobs() {
  const container = document.getElementById("admin-jobs-container");
  if (!container) return;

  container.innerHTML = "";

  if (jobs.length === 0) {
    container.innerHTML = "<p>Još nema oglasa.</p>";
    return;
  }

  jobs.forEach((job) => {
    const item = document.createElement("div");
    item.className = "admin-job-item";

    item.innerHTML = `
      <h4>${job.title}</h4>
      <p><strong>Firma:</strong> ${job.company}</p>
      <p><strong>Država:</strong> ${job.country}</p>
      <p><strong>Lokacija:</strong> ${job.location}</p>
      <p><strong>Satnica:</strong> ${job.salary || ""}</p>
      <button class="delete-job">Obriši</button>
    `;

    const delBtn = item.querySelector(".delete-job");
    if (delBtn) {
      delBtn.addEventListener("click", () => {
        jobs = jobs.filter((j) => j.id !== job.id);
        saveJobsToStorage();
        renderJobs();
        renderAdminJobs();
      });
    }

    container.appendChild(item);
  });
}

// =============================
// FILTERI NA POCETNOJ
// =============================
function initFilters() {
  const searchInput = document.getElementById("search-input");
  const countryFilter = document.getElementById("country-filter");
  const resetBtn = document.getElementById("filter-reset");

  if (searchInput) searchInput.addEventListener("input", renderJobs);
  if (countryFilter) countryFilter.addEventListener("change", renderJobs);
  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      if (searchInput) searchInput.value = "";
      if (countryFilter) countryFilter.value = "all";
      renderJobs();
    });
  }
}

// =============================
// FORME – RADNIK / FIRMA
// =============================
function initForms() {
  const workerForm = document.getElementById("worker-form");
  const workerMessage = document.getElementById("worker-message");

  if (workerForm && workerMessage) {
    workerForm.addEventListener("submit", (e) => {
      e.preventDefault();
      workerMessage.textContent =
        "Hvala! Tvoja prijava je zabilježena – kontaktiraćemo te / prosleđujemo firmama.";
      workerMessage.classList.add("success");
      workerForm.reset();
    });
  }

  const companyForm = document.getElementById("company-form");
  const companyMessage = document.getElementById("company-message");

  if (companyForm && companyMessage) {
    companyForm.addEventListener("submit", (e) => {
      e.preventDefault();
      companyMessage.textContent =
        "Hvala! Javićemo se u najkraćem roku da dogovorimo detalje o radnicima.";
      companyMessage.classList.add("success");
      companyForm.reset();
    });
  }
}

// =============================
// MOBILNI NAVBAR (hamburger)
// =============================
function initMobileNav() {
  const navToggle = document.querySelector(".nav-toggle");
  const navLinks = document.querySelector(".nav-links");

  if (!navToggle || !navLinks) return;

  navToggle.addEventListener("click", () => {
    document.body.classList.toggle("nav-open");
    navLinks.classList.toggle("open");
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      document.body.classList.remove("nav-open");
      navLinks.classList.remove("open");
    });
  });
}

// =============================
// ADMIN DASHBOARD (tabovi, filteri, statusi, chat, export)
// =============================
function initAdminDashboard() {
  const dashboardSection = document.getElementById("admin");
  if (!dashboardSection) return;

  const tabs = dashboardSection.querySelectorAll(".admin-tab");
  const panels = dashboardSection.querySelectorAll(".admin-table-wrapper");
  const searchInput = document.getElementById("admin-search");
  const statusFilter = document.getElementById("admin-status-filter");

  // --- Tabovi ---
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const target = tab.dataset.tab;

      tabs.forEach((t) => t.classList.toggle("active", t === tab));
      panels.forEach((panel) => {
        panel.classList.toggle("hidden", panel.dataset.panel !== target);
      });

      if (searchInput) searchInput.value = "";
      if (statusFilter) statusFilter.value = "all";
      applyAdminFilters();
    });
  });

  // --- Filteri ---
  function applyAdminFilters() {
    const query = (searchInput?.value || "").toLowerCase().trim();
    const status = statusFilter ? statusFilter.value : "all";

    const activePanel = dashboardSection.querySelector(
      '.admin-table-wrapper:not(.hidden)'
    );
    if (!activePanel) return;

    const rows = activePanel.querySelectorAll("tbody tr");
    rows.forEach((row) => {
      const rowStatus = row.getAttribute("data-status") || "";
      const text = row.textContent.toLowerCase();

      const matchesText = !query || text.includes(query);
      const matchesStatus = status === "all" || status === rowStatus;

      row.style.display = matchesText && matchesStatus ? "" : "none";
    });
  }

  if (searchInput) searchInput.addEventListener("input", applyAdminFilters);
  if (statusFilter) statusFilter.addEventListener("change", applyAdminFilters);

  // --- Promjena statusa (NOVO / KONTAKTIRAN / ZAVRŠENO) ---
  dashboardSection.querySelectorAll(".admin-table").forEach((table) => {
    table.addEventListener("click", (e) => {
      const btn = e.target.closest(".action-btn");
      if (!btn) return;

      const row = btn.closest("tr");
      const badge = row.querySelector(".status-badge");
      if (!badge) return;

      if (btn.classList.contains("action-progress")) {
        row.dataset.status = "in-progress";
        badge.textContent = "Kontaktiran";
        badge.className = "status-badge status-progress";
      } else if (btn.classList.contains("action-done")) {
        row.dataset.status = "done";
        badge.textContent = "Završeno";
        badge.className = "status-badge status-done";
      } else if (btn.classList.contains("action-restore")) {
        row.dataset.status = "new";
        badge.textContent = "Novo";
        badge.className = "status-badge status-new";
      }

      applyAdminFilters();
      updateAdminMetrics();
    });
  });

  // --- Chat / bilješke ---
  initAdminChat();

  // --- Export ---
  initAdminExport();

  // --- Metrike ---
  updateAdminMetrics();
}

function updateAdminMetrics() {
  const workersRows = document.querySelectorAll(
    '[data-panel="workers"] tbody tr'
  );
  const companiesRows = document.querySelectorAll(
    '[data-panel="companies"] tbody tr'
  );

  const total = workersRows.length + companiesRows.length;
  const workers = workersRows.length;
  const companies = companiesRows.length;

  const totalEl = document.getElementById("metric-total");
  const workersEl = document.getElementById("metric-workers");
  const companiesEl = document.getElementById("metric-companies");

  if (totalEl) totalEl.textContent = total.toString();
  if (workersEl) workersEl.textContent = workers.toString();
  if (companiesEl) companiesEl.textContent = companies.toString();
}

// =============================
// ADMIN CHAT / BILJEŠKE
// =============================
let currentChatTargetId = null;
const chatStore = {}; // samo u memoriji za sada

function initAdminChat() {
  const chatForm = document.getElementById("chat-form");
  const chatInput = document.getElementById("chat-input");
  const chatMessages = document.getElementById("chat-messages");
  const chatTargetText = document.getElementById("chat-target");

  const tables = document.querySelectorAll(".admin-table tbody");
  tables.forEach((tbody) => {
    tbody.addEventListener("click", (e) => {
      const row = e.target.closest("tr");
      if (!row) return;

      const id =
        row.getAttribute("data-id") ||
        row.querySelector("td")?.textContent ||
        null;

      currentChatTargetId = id;

      if (chatTargetText) {
        const name = row.querySelector("td")?.textContent || "Prijava";
        chatTargetText.textContent = `Bilješke za: ${name}`;
      }

      renderChatMessages(chatMessages, id);
    });
  });

  if (chatForm && chatInput && chatMessages) {
    chatForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const text = chatInput.value.trim();
      if (!text || !currentChatTargetId) return;

      if (!chatStore[currentChatTargetId]) {
        chatStore[currentChatTargetId] = [];
      }
      chatStore[currentChatTargetId].push({
        text,
        time: new Date().toLocaleTimeString("de-DE", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      });

      chatInput.value = "";
      renderChatMessages(chatMessages, currentChatTargetId);
    });
  }
}

function renderChatMessages(container, id) {
  if (!container) return;
  container.innerHTML = "";

  const messages = chatStore[id] || [];
  if (messages.length === 0) {
    container.innerHTML =
      '<p class="chat-empty">Još nema bilješki za ovu prijavu.</p>';
    return;
  }

  messages.forEach((m) => {
    const div = document.createElement("div");
    div.className = "chat-message";
    div.innerHTML = `<span class="chat-time">${m.time}</span><span class="chat-text">${m.text}</span>`;
    container.appendChild(div);
  });

  container.scrollTop = container.scrollHeight;
}

// =============================
// ADMIN EXPORT CSV
// =============================
function initAdminExport() {
  const btnWorkers = document.getElementById("export-workers");
  const btnCompanies = document.getElementById("export-companies");

  if (btnWorkers) {
    btnWorkers.addEventListener("click", () => {
      exportTableToCSV('[data-panel="workers"] .admin-table', "radnici.csv");
    });
  }

  if (btnCompanies) {
    btnCompanies.addEventListener("click", () => {
      exportTableToCSV(
        '[data-panel="companies"] .admin-table',
        "kompanije.csv"
      );
    });
  }
}

function exportTableToCSV(selector, filename) {
  const table = document.querySelector(selector);
  if (!table) return;

  const rows = Array.from(table.querySelectorAll("tr"));
  const data = rows.map((row) =>
    Array.from(row.querySelectorAll("th, td"))
      .map((cell) => `"${cell.textContent.replace(/"/g, '""')}"`)
      .join(";")
  );

  const csvContent = data.join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();

  URL.revokeObjectURL(url);
}

// =============================
// ADMIN LOGIN OVERLAY
// =============================
function setAdminMode(isOn) {
  const overlay = document.getElementById("admin-login-overlay");
  const adminSection = document.getElementById("admin");
  const adminJobsSection = document.getElementById("admin-jobs");

  if (overlay) {
    overlay.style.display = isOn ? "none" : "flex";
  }
  if (adminSection) {
    adminSection.classList.toggle("hidden", !isOn);
  }
  if (adminJobsSection) {
    adminJobsSection.classList.toggle("hidden", !isOn);
  }
}

function initAdminLoginOverlay() {
  const form = document.getElementById("admin-login-form");
  const userInput = document.getElementById("admin-username");
  const passInput = document.getElementById("admin-password");

  // Auto login
  if (localStorage.getItem(LS_ADMIN_KEY) === "1") {
    setAdminMode(true);
  } else {
    setAdminMode(false);
  }

  if (form && userInput && passInput) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const user = userInput.value.trim();
      const pass = passInput.value.trim();

      if (user === "admin" && pass === "1234") {
        localStorage.setItem(LS_ADMIN_KEY, "1");
        setAdminMode(true);
      } else {
        alert("Pogrešan username ili lozinka.");
      }
    });
  }

  const logoutBtn = document.getElementById("admin-logout");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem(LS_ADMIN_KEY);
      setAdminMode(false);
    });
  }
}

// =============================
// INIT – kad se stranica učita
// =============================
document.addEventListener("DOMContentLoaded", () => {
  initJobs();
  renderJobs();
  renderAdminJobs();
  initFilters();
  initForms();
  initMobileNav();
  initAdminDashboard();
  initAdminLoginOverlay();
});