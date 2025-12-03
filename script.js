// POSLOVIDE – glavna logika
document.addEventListener("DOMContentLoaded", () => {

  /* ============================================
       1. DEMO POSLOVI
  ============================================= */

  const jobs = [
    {
      id: "job-1",
      title: "Pomoćni radnik",
      company: "Firma SD",
      location: "Bonn",
      country: "Njemačka",
      salary: "13.50€ / h + bonus",
      description:
        "Građevina, rad na fasadama, dugoročni ugovor. Smještaj organizovan.",
      contact: "WhatsApp: +38269200250",
    },
    {
      id: "job-2",
      title: "Monter suve gradnje",
      company: "AlpenHotel",
      location: "Tirol",
      country: "Austrija",
      salary: "15–17€ + bakšiš",
      description:
        "Sezonski posao u hotelu, hrana i smještaj obezbijeđeni.",
      contact: "WhatsApp: +38269200250",
    },
    {
      id: "job-3",
      title: "Magacioner",
      company: "Logistic DE",
      location: "Köln",
      country: "Njemačka",
      salary: "14–16€ / h",
      description: "Rad u magacinu, 2 smjene, organizovan prevoz do posla.",
      contact: "Email: horozaje@hotmail.com",
    },
  ];

  const jobsListEl = document.getElementById("jobs-list");
  const searchInputEl = document.getElementById("search-input");
  const countryFilterEl = document.getElementById("country-filter");
  const resetBtn = document.getElementById("filter-reset");
  const noResultsEl = document.getElementById("no-results");

  function renderJobs(list) {
    if (!jobsListEl) return;

    if (!list || list.length === 0) {
      jobsListEl.innerHTML = "";
      noResultsEl.classList.remove("hidden");
      return;
    }

    noResultsEl.classList.add("hidden");

    jobsListEl.innerHTML = list
      .map(
        (job) => `
      <article class="job-card">
        <header class="job-card-header">
          <div>
            <h3 class="job-title">${job.title}</h3>
            <p class="job-meta">
              <span>${job.company}</span> ·
              <span>${job.location}</span>
            </p>
          </div>
          <span class="job-country-badge">${job.country}</span>
        </header>

        <p class="job-salary">${job.salary}</p>
        <p class="job-description">${job.description}</p>

        <footer class="job-card-footer">
          <button class="job-apply-btn" data-job-id="${job.id}">
            Zahtjev / prijava
          </button>
          <span class="job-contact">${job.contact}</span>
        </footer>
      </article>
    `
      )
      .join("");
  }

  function filterJobs() {
    const term = searchInputEl.value.toLowerCase();
    const country = countryFilterEl.value;

    const filtered = jobs.filter((job) => {
      const t = (
        job.title +
        job.company +
        job.location +
        job.description
      ).toLowerCase();

      const matchesTerm = t.includes(term);
      const matchesCountry =
        country === "all" ||
        job.country.toLowerCase() === country.toLowerCase();

      return matchesTerm && matchesCountry;
    });

    renderJobs(filtered);
  }

  renderJobs(jobs);

  searchInputEl.addEventListener("input", filterJobs);
  countryFilterEl.addEventListener("change", filterJobs);
  resetBtn.addEventListener("click", () => {
    searchInputEl.value = "";
    countryFilterEl.value = "all";
    renderJobs(jobs);
  });

  document.addEventListener("click", (e) => {
    const btn = e.target.closest(".job-apply-btn");
    if (!btn) return;

    document.getElementById("contact").scrollIntoView({
      behavior: "smooth",
    });
  });

  /* ============================================
       2. HAMBURGER NAVIGACIJA
  ============================================= */

  const navToggle = document.querySelector(".nav-toggle");
  const navMenu = document.querySelector(".nav-links");

  if (navToggle) {
    navToggle.addEventListener("click", () => {
      navMenu.classList.toggle("open");
    });

    navMenu.addEventListener("click", (e) => {
      if (e.target.matches("a")) {
        navMenu.classList.remove("open");
      }
    });
  }

  /* ============================================
       3. ADMIN LOGIN
  ============================================= */

  const adminOpenLink = document.getElementById("admin-open-link");
  const adminLoginOverlay = document.getElementById("admin-login-overlay");
  const adminLoginForm = document.getElementById("admin-login-form");
  const adminSection = document.getElementById("admin");
  const adminJobsSection = document.getElementById("admin-jobs");

  adminLoginOverlay.classList.add("hidden");

  function showLogin() {
    adminLoginOverlay.classList.remove("hidden");
  }
  function hideLogin() {
    adminLoginOverlay.classList.add("hidden");
  }
  function showAdmin() {
    adminSection.classList.remove("hidden");
    adminJobsSection.classList.remove("hidden");
  }
  function hideAdmin() {
    adminSection.classList.add("hidden");
    adminJobsSection.classList.add("hidden");
  }

  adminOpenLink.addEventListener("click", (e) => {
    e.preventDefault();
    showLogin();
  });

  adminLoginForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const user = document.getElementById("admin-username").value.trim();
    const pass = document.getElementById("admin-password").value.trim();

    if (user === "admin" && pass === "1234") {
      hideLogin();
      showAdmin();
    } else {
      alert("Pogrešni podaci — probaj admin / 1234");
    }
  });

  adminLoginOverlay.addEventListener("click", (e) => {
    if (e.target === adminLoginOverlay) hideLogin();
  });

  const logoutBtn = document.getElementById("admin-logout");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => hideAdmin());
  }

  /* ============================================
       4. ADMIN TABELA + STATUS + CHAT
  ============================================= */

  const chatTargetEl = document.getElementById("chat-target");
  const chatMessagesEl = document.getElementById("chat-messages");
  const chatFormEl = document.getElementById("chat-form");
  const chatInputEl = document.getElementById("chat-input");

  let selectedRowId = null;

  function setSelectedRow(row) {
    document
      .querySelectorAll(".admin-table tbody tr")
      .forEach((r) => r.classList.remove("selected"));

    if (!row) {
      selectedRowId = null;
      chatTargetEl.textContent = "Nijedna prijava nije izabrana.";
      chatMessagesEl.innerHTML = "";
      return;
    }

    row.classList.add("selected");
    selectedRowId = row.dataset.id;

    chatTargetEl.textContent = `Bilješke za: ${row.querySelector("td").textContent}`;
    loadNotes();
  }

  function loadNotes() {
    const key = "poslovi_notes_" + selectedRowId;
    const notes = JSON.parse(localStorage.getItem(key) || "[]");

    chatMessagesEl.innerHTML = notes
      .map(
        (n) => `
      <div class="chat-message">
        <div>${n.text}</div>
        <small>${n.time}</small>
      </div>
    `
      )
      .join("");

    chatMessagesEl.scrollTop = chatMessagesEl.scrollHeight;
  }

  function saveNote(text) {
    const key = "poslovi_notes_" + selectedRowId;
    const notes = JSON.parse(localStorage.getItem(key) || "[]");

    const now = new Date();
    const hh = String(now.getHours()).padStart(2, "0");
    const mm = String(now.getMinutes()).padStart(2, "0");

    notes.push({ text, time: `${hh}:${mm}` });
    localStorage.setItem(key, JSON.stringify(notes));
  }

  document.addEventListener("click", (e) => {
    const row = e.target.closest(".admin-table tbody tr");
    if (row) setSelectedRow(row);

    const btn = e.target.closest(".action-btn");
    if (!btn) return;

    const tr = btn.closest("tr");
    const badge = tr.querySelector(".status-badge");

    if (btn.classList.contains("action-progress")) {
      tr.dataset.status = "in-progress";
      badge.textContent = "Kontaktiran";
      badge.className = "status-badge status-progress";
    } else if (btn.classList.contains("action-done")) {
      tr.dataset.status = "done";
      badge.textContent = "Završeno";
      badge.className = "status-badge status-done";
    } else if (btn.classList.contains("action-restore")) {
      tr.dataset.status = "new";
      badge.textContent = "Novo";
      badge.className = "status-badge status-new";
    }
  });

  if (chatFormEl) {
    chatFormEl.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!selectedRowId) {
        alert("Prvo izaberi prijavu!");
        return;
      }

      const text = chatInputEl.value.trim();
      if (!text) return;

      saveNote(text);
      chatInputEl.value = "";
      loadNotes();
    });
  }

});