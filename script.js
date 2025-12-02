// =======================
// KONFIG
// =======================
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "sansa123";
const ADMIN_LOGIN_KEY = "posloviDE_admin_logged";

const STORAGE_KEY_JOBS = "posloviDE_jobs_v1";

// =======================
// GLOBALNO STANJE
// =======================
let jobs = [];

// =======================
// POMOĆNE FUNKCIJE – POSLOVI
// =======================
function loadJobsFromStorage() {
  const stored = localStorage.getItem(STORAGE_KEY_JOBS);
  if (!stored) return null;

  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

function saveJobsToStorage() {
  localStorage.setItem(STORAGE_KEY_JOBS, JSON.stringify(jobs));
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
    contact: "WhatsApp: +38269200250",
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
    contact: "Email: horozaje@hotmail.com",
  },
  {
    id: "3",
    title: "Konobar / konobarica",
    company: "AlpenHotel",
    country: "Austrija",
    location: "Tirol",
    salary: "1550–1700€ + bakšiš",
    description:
      "Sezonski posao u hotelu, hrana i smještaj obezbijeđeni.",
    contact: "WhatsApp: +38269200250",
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

function renderJobs() {
  const list = document.getElementById("jobs-list");
  const noResults = document.getElementById("no-results");
  if (!list || !noResults) return;

  const searchValue = document
    .getElementById("search-input")
    .value.toLowerCase()
    .trim();
  const countryValue = document.getElementById("country-filter").value;

  list.innerHTML = "";

  const filtered = jobs.filter((job) => {
    const matchesCountry =
      countryValue === "all" || job.country === countryValue;

    const text = (
      job.title +
      job.company +
      job.location +
      job.country +
      (job.description || "")
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
    btn.addEventListener("click", () => {
      document.getElementById("contact").scrollIntoView({ behavior: "smooth" });
    });

    list.appendChild(card);
  });
}

// Admin kartice sa oglasima koje dodaješ iz admin forme
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

    item.querySelector(".delete-job").addEventListener("click", () => {
      jobs = jobs.filter((j) => j.id !== job.id);
      saveJobsToStorage();
      renderJobs();
      renderAdminJobs();
    });

    container.appendChild(item);
  });
}

// =======================
// FILTERI POSLOVA
// =======================
function initJobFilters() {
  const searchInput = document.getElementById("search-input");
  const countryFilter = document.getElementById("country-filter");
  const resetBtn = document.getElementById("filter-reset");

  if (!searchInput || !countryFilter || !resetBtn) return;

  searchInput.addEventListener("input", renderJobs);
  countryFilter.addEventListener("change", renderJobs);
  resetBtn.addEventListener("click", () => {
    searchInput.value = "";
    countryFilter.value = "all";
    renderJobs();
  });
}

// =======================
// FORME – RADNIK / FIRMA
// =======================
function initContactForms() {
  // Radnik
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

  // Firma
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

// =======================
// MOBILE NAV – HAMBURGER
// =======================
function initMobileNav() {
  const navToggle = document.querySelector(".nav-toggle");
  const navLinks = document.querySelector(".nav-links");

  if (!navToggle || !navLinks) return;

  navToggle.addEventListener("click", () => {
    document.body.classList.toggle("nav-open");
    navLinks.classList.toggle("open");
  });

  document.querySelectorAll(".nav-links a").forEach((link) => {
    link.addEventListener("click", () => {
      document.body.classList.remove("nav-open");
      navLinks.classList.remove("open");
    });
  });
}

// ===========================
// ADMIN DASHBOARD LOGIKA
// ===========================
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

  if (totalEl) totalEl.textContent = total;
  if (workersEl) workersEl.textContent = workers;
  if (companiesEl) companiesEl.textContent = companies;
}

function initAdminDashboard() {
  const tabs = document.querySelectorAll(".admin-tab");
  const panels = document.querySelectorAll(".admin-table-wrapper");
  const searchInput = document.getElementById("admin-search");
  const statusFilter = document.getElementById("admin-status-filter");
  const chatForm = document.getElementById("chat-form");
  const chatInput = document.getElementById("chat-input");
  const chatMessages = document.getElementById("chat-messages");
  const chatTarget = document.getElementById("chat-target");
  const exportWorkersBtn = document.getElementById("export-workers");
  const exportCompaniesBtn = document.getElementById("export-companies");

  if (!tabs.length || !panels.length) return;

  let selectedRowId = null;

  // Tab switching
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const target = tab.dataset.tab;

      tabs.forEach((t) => t.classList.toggle("active", t === tab));
      panels.forEach((panel) => {
        panel.classList.toggle("hidden", panel.dataset.panel !== target);
      });

      searchInput.value = "";
      statusFilter.value = "all";
      applyAdminFilters();
    });
  });

  function applyAdminFilters() {
    const query = searchInput.value.toLowerCase().trim();
    const status = statusFilter.value;
    const activePanel = document.querySelector(
      '.admin-table-wrapper:not(.hidden)'
    );

    if (!activePanel) return;

    const rows = activePanel.querySelectorAll("tbody tr");

    rows.forEach((row) => {
      const rowStatus = row.getAttribute("data-status");
      const text = row.textContent.toLowerCase();

      const matchesText = !query || text.includes(query);
      const matchesStatus = status === "all" || status === rowStatus;

      row.style.display = matchesText && matchesStatus ? "" : "none";
    });
  }

  if (searchInput) searchInput.addEventListener("input", applyAdminFilters);
  if (statusFilter) statusFilter.addEventListener("change", applyAdminFilters);

  // Klik na red – selekcija za chat
  document.querySelectorAll(".admin-table tbody tr").forEach((row) => {
    row.addEventListener("click", (e) => {
      // da ne reaguje na klik dugmeta
      if (e.target.closest(".action-btn")) return;

      document
        .querySelectorAll(".admin-table tbody tr")
        .forEach((r) => r.classList.remove("selected"));

      row.classList.add("selected");
      selectedRowId = row.getAttribute("data-id");
      const nameCell = row.querySelector("td");
      const name = nameCell ? nameCell.textContent.trim() : "prijavu";

      if (chatTarget) {
        chatTarget.textContent = `Bilješke za: ${name}`;
      }

      if (chatMessages) {
        chatMessages.innerHTML = "";
      }
    });
  });

  // Akcije status dugmadi
  document.querySelectorAll(".admin-table").forEach((table) => {
    table.addEventListener("click", (e) => {
      const btn = e.target.closest(".action-btn");
      if (!btn) return;

      const row = btn.closest("tr");
      const badge = row.querySelector(".status-badge");

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
    });
  });

  // Chat / bilješke – samo lokalno u sesiji
  if (chatForm && chatInput && chatMessages) {
    chatForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const text = chatInput.value.trim();
      if (!text) return;

      const msg = document.createElement("div");
      msg.className = "chat-message";
      const time = new Date().toLocaleTimeString("sr-RS", {
        hour: "2-digit",
        minute: "2-digit",
      });
      msg.textContent = `[${time}] ${text}`;
      chatMessages.appendChild(msg);
      chatMessages.scrollTop = chatMessages.scrollHeight;

      chatInput.value = "";
    });
  }

  // Export CSV helper
  function tableToCSV(panelName) {
    const panel = document.querySelector(
      `.admin-table-wrapper[data-panel="${panelName}"]`
    );
    if (!panel) return "";

    const rows = panel.querySelectorAll("table tr");
    const data = [];

    rows.forEach((row) => {
      const cells = row.querySelectorAll("th, td");
      const rowData = [];
      cells.forEach((cell) => {
        let text = cell.textContent.replace(/\s+/g, " ").trim();
        // escape ;
        text = `"${text.replace(/"/g, '""')}"`;
        rowData.push(text);
      });
      data.push(rowData.join(";"));
    });

    return data.join("\n");
  }

  function downloadCSV(filename, csvText) {
    const blob = new Blob([csvText], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  if (exportWorkersBtn) {
    exportWorkersBtn.addEventListener("click", () => {
      const csv = tableToCSV("workers");
      if (csv) downloadCSV("radnici.csv", csv);
    });
  }

  if (exportCompaniesBtn) {
    exportCompaniesBtn.addEventListener("click", () => {
      const csv = tableToCSV("companies");
      if (csv) downloadCSV("kompanije.csv", csv);
    });
  }

  updateAdminMetrics();
}

// =======================
// ADMIN OGLASI – FORMA
// =======================
function initAdminJobsForm() {
  const adminForm = document.getElementById("admin-form");
  if (!adminForm) return;

  adminForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const title = document.getElementById("job-title").value.trim();
    const company = document.getElementById("job-company").value.trim();
    const location = document.getElementById("job-location").value.trim();
    const country = document.getElementById("job-country").value;
    const salary = document.getElementById("job-salary").value.trim();
    const contact = document.getElementById("job-contact").value.trim();
    const description = document
      .getElementById("job-description")
      .value.trim();

    if (!title || !company || !location || !country) {
      alert("Popuni obavezna polja (naziv, firma, lokacija, država).");
      return;
    }

    const newJob = {
      id: Date.now().toString(),
      title,
      company,
      location,
      country,
      salary,
      contact,
      description,
    };

    jobs.unshift(newJob);
    saveJobsToStorage();
    renderJobs();
    renderAdminJobs();
    adminForm.reset();
    alert("Posao je dodat.");
  });
}

// =======================
// ADMIN LOGIN OVERLAY
// =======================
function initAdminAuth() {
  const overlay = document.getElementById("admin-login-overlay");
  const openLink = document.getElementById("admin-open-link");
  const loginForm = document.getElementById("admin-login-form");
  const usernameInput = document.getElementById("admin-username");
  const passwordInput = document.getElementById("admin-password");
  const adminSection = document.getElementById("admin");
  const adminJobsSection = document.getElementById("admin-jobs");
  const logoutBtn = document.getElementById("admin-logout");

  if (!overlay || !openLink || !loginForm) return;

  // Overlay je po defaultu sakriven
  overlay.classList.add("hidden");

  function isLoggedIn() {
    return localStorage.getItem(ADMIN_LOGIN_KEY) === "1";
  }

  function setLoggedIn(value) {
    if (value) {
      localStorage.setItem(ADMIN_LOGIN_KEY, "1");
    } else {
      localStorage.removeItem(ADMIN_LOGIN_KEY);
    }
    updateAdminVisibility();
  }

  function updateAdminVisibility() {
    const logged = isLoggedIn();

    if (adminSection) {
      adminSection.classList.toggle("hidden", !logged);
    }
    if (adminJobsSection) {
      adminJobsSection.classList.toggle("hidden", !logged);
    }

    // overlay ne diramo ovdje – on se otvara samo kad klikneš Admin
  }

  // Klik na "Admin" u meniju
  openLink.addEventListener("click", (e) => {
    e.preventDefault();

    if (isLoggedIn()) {
      // već si ulogovan -> skrol na admin
      if (adminSection) {
        adminSection.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      overlay.classList.remove("hidden");
    }
  });

  // Submit login forme
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const user = usernameInput.value.trim();
    const pass = passwordInput.value.trim();

    if (user === ADMIN_USERNAME && pass === ADMIN_PASSWORD) {
      setLoggedIn(true);
      overlay.classList.add("hidden");
      usernameInput.value = "";
      passwordInput.value = "";

      if (adminSection) {
        adminSection.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      alert("Pogrešno korisničko ime ili lozinka.");
    }
  });

  // Logout dugme u admin panelu
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      setLoggedIn(false);
      overlay.classList.add("hidden");
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // Klik van kutije zatvara overlay (ako želiš)
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay && !isLoggedIn()) {
      overlay.classList.add("hidden");
    }
  });

  // Inicijalno stanje po localStorage
  updateAdminVisibility();
}

// =======================
// INIT SVEGA
// =======================
document.addEventListener("DOMContentLoaded", () => {
  initJobs();
  renderJobs();
  renderAdminJobs();

  initJobFilters();
  initContactForms();
  initMobileNav();
  initAdminDashboard();
  initAdminJobsForm();
  initAdminAuth();
});
/* ===========================
   1) SLANJE RADNIKA NA EMAIL
   =========================== */
document.getElementById("worker-form").addEventListener("submit", async function(e) {
    e.preventDefault();

    const data = {
        name: document.getElementById("worker-name").value,
        phone: document.getElementById("worker-phone").value,
        email: document.getElementById("worker-email").value,
        city: document.getElementById("worker-city").value,
        position: document.getElementById("worker-position").value,
        experience: document.getElementById("worker-experience").value
    };

    const messageBox = document.getElementById("worker-message");

    try {
        const response = await fetch("https://formspree.io/f/xkgdbqnj", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            messageBox.textContent = "✅ Prijava uspješno poslata!";
            messageBox.classList.add("success");

            this.reset();
        } else {
            messageBox.textContent = "❌ Greška, pokušaj ponovo.";
            messageBox.classList.add("error");
        }
    } catch (err) {
        messageBox.textContent = "❌ Greška u mreži.";
        messageBox.classList.add("error");
    }
});

/* ===========================
   2) SLANJE FIRME NA EMAIL
   =========================== */
document.getElementById("company-form").addEventListener("submit", async function(e) {
    e.preventDefault();

    const data = {
        company: document.getElementById("company-name").value,
        person: document.getElementById("company-person").value,
        phone: document.getElementById("company-phone").value,
        email: document.getElementById("company-email").value,
        city: document.getElementById("company-city").value,
        profile: document.getElementById("company-profile").value
    };

    const messageBox = document.getElementById("company-message");

    try {
        const response = await fetch("https://formspree.io/f/xkgdbqnj", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            messageBox.textContent = "✅ Upit uspješno poslat!";
            messageBox.classList.add("success");

            this.reset();
        } else {
            messageBox.textContent = "❌ Greška, pokušaj ponovo.";
            messageBox.classList.add("error");
        }
    } catch (err) {
        messageBox.textContent = "❌ Greška u mreži.";
        messageBox.classList.add("error");
    }
});