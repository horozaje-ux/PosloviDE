// ===== KONFIG =====
const ADMIN_PASSWORD = "1234"; // promijeni po želji
const STORAGE_KEY = "posloviDE_jobs_v1";

// ===== GLOBALNO STANJE =====
let jobs = [];
let isAdmin = false;

// ===== POMOĆNE FUNKCIJE =====
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

// Default poslovi – možeš mijenjati
const defaultJobs = [
  {
    id: "1",
    title: "Pomoćni radnik",
    company: "Firma SD",
    country: "Njemačka",
    location: "Köln, Bonn",
    salary: "14–17€ / h",
    description: "Građevina, rad na fasadama, dugoročni ugovor. Smještaj organizovan.",
    contact: "WhatsApp: +49 152 23000800"
  },
  {
    id: "2",
    title: "Radnik u magacinu",
    company: "Logistic DE",
    country: "Njemačka",
    location: "Duisburg",
    salary: "13.50€ / h + bonus",
    description: "Sortiranje paketa, rad u smjenama, njemački jezik nije uslov.",
    contact: "Email: job@logistic.de"
  },
  {
    id: "3",
    title: "Konobar / konobarica",
    company: "AlpenHotel",
    country: "Austrija",
    location: "Tirol",
    salary: "1550–1700€ + bakšiš",
    description: "Sezonski posao u hotelu, hrana i smještaj obezbijeđeni.",
    contact: "WhatsApp: +43 600 000000"
  }
];

function initJobs() {
  const stored = loadJobsFromStorage();
  if (stored && Array.isArray(stored) && stored.length > 0) {
    jobs = stored;
  } else {
    jobs = defaultJobs;
    saveJobsToStorage();
  }
}

// ===== RENDER POSLOVA =====
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
  const searchValue = document
    .getElementById("search-input")
    .value.toLowerCase()
    .trim();
  const countryValue = document.getElementById("country-filter").value;

  list.innerHTML = "";

  const filtered = jobs.filter((job) => {
    const matchesCountry =
      countryValue === "all" || job.country === countryValue;

    const text =
      (job.title + job.company + job.location + job.country + job.description)
        .toLowerCase();

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

    // Klik na dugme → skrol na kontakt
    const btn = card.querySelector("button");
    btn.addEventListener("click", () => {
      document.getElementById("contact").scrollIntoView({ behavior: "smooth" });
    });

    list.appendChild(card);
  });
}

// ===== ADMIN RENDER =====
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

// ===== ADMIN LOGIN / LOGOUT =====
function updateAdminUI() {
  const loginBox = document.getElementById("admin-login");
  const panel = document.getElementById("admin-panel");

  if (isAdmin) {
    loginBox.classList.add("hidden");
    panel.classList.remove("hidden");
  } else {
    loginBox.classList.remove("hidden");
    panel.classList.add("hidden");
  }
}

// ===== INIT =====
document.addEventListener("DOMContentLoaded", () => {
  initJobs();
  renderJobs();
  renderAdminJobs();

  // --- FILTERI ---
  const searchInput = document.getElementById("search-input");
  const countryFilter = document.getElementById("country-filter");
  const resetBtn = document.getElementById("filter-reset");

  searchInput.addEventListener("input", renderJobs);
  countryFilter.addEventListener("change", renderJobs);
  resetBtn.addEventListener("click", () => {
    searchInput.value = "";
    countryFilter.value = "all";
    renderJobs();
  });

  // --- FORM: RADNIK ---
  const workerForm = document.getElementById("worker-form");
  const workerMessage = document.getElementById("worker-message");

  workerForm.addEventListener("submit", (e) => {
    e.preventDefault();
    workerMessage.textContent =
      "Hvala! Tvoja prijava je zabilježena – kontaktiraćemo te / prosleđujemo firmama.";
    workerMessage.classList.add("success");
    workerForm.reset();
  });

  // --- FORM: FIRMA ---
  const companyForm = document.getElementById("company-form");
  const companyMessage = document.getElementById("company-message");

  companyForm.addEventListener("submit", (e) => {
    e.preventDefault();
    companyMessage.textContent =
      "Hvala! Javićemo se u najkraćem roku da dogovorimo detalje o radnicima.";
    companyMessage.classList.add("success");
    companyForm.reset();
  });

  // --- ADMIN LOGIN ---
  const adminLoginBtn = document.getElementById("admin-login-btn");
  const adminPwdInput = document.getElementById("admin-password");
  const adminLoginMsg = document.getElementById("admin-login-message");

  adminLoginBtn.addEventListener("click", () => {
    const value = adminPwdInput.value.trim();
    if (value === ADMIN_PASSWORD) {
      isAdmin = true;
      localStorage.setItem("posloviDE_isAdmin", "1");
      adminLoginMsg.textContent = "";
      adminPwdInput.value = "";
      updateAdminUI();
      renderAdminJobs();
      document
        .getElementById("admin-panel")
        .scrollIntoView({ behavior: "smooth" });
    } else {
      adminLoginMsg.textContent = "Pogrešna šifra.";
      adminLoginMsg.classList.add("error");
    }
  });

  // auto login ako ima flag u storage
  if (localStorage.getItem("posloviDE_isAdmin") === "1") {
    isAdmin = true;
    updateAdminUI();
  } else {
    updateAdminUI();
  }

  // --- ADMIN LOGOUT ---
  const adminLogoutBtn = document.getElementById("admin-logout");
  adminLogoutBtn.addEventListener("click", () => {
    isAdmin = false;
    localStorage.removeItem("posloviDE_isAdmin");
    updateAdminUI();
  });

  // --- ADMIN DODAVANJE POSLA ---
  const adminForm = document.getElementById("admin-form");

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
      description
    };

    jobs.unshift(newJob); // novi na vrh
    saveJobsToStorage();
    renderJobs();
    renderAdminJobs();
    adminForm.reset();
    alert("Posao je dodan.");
  });
});
// MOBILE NAV – hamburger meni
document.addEventListener("DOMContentLoaded", () => {
  const navToggle = document.querySelector(".nav-toggle");
  if (navToggle) {
    navToggle.addEventListener("click", () => {
      document.body.classList.toggle("nav-open");
    });

    // Zatvori meni kad klikneš na link
    document.querySelectorAll(".nav-links a").forEach((link) => {
      link.addEventListener("click", () => {
        document.body.classList.remove("nav-open");
      });
    });
  }
});
// Hamburger meni
const toggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");

if (toggle) {
    toggle.addEventListener("click", () => {
        navLinks.classList.toggle("open");
    });
}