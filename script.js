// ============ POMOĆNE FUNKCIJE ============

function $(id) {
  return document.getElementById(id);
}

// ============ PODACI O POSLOVIMA ============

const DEFAULT_JOBS = [
  {
    id: 1,
    title: "Pomoćni radnik na građevini",
    company: "DE Bau GmbH",
    city: "Köln",
    country: "Njemačka",
    salary: "14–16€/h",
    description: "Rad na gradilištu, smještaj obezbijeđen, prijava i ugovor."
  },
  {
    id: 2,
    title: "Radnik u magacinu",
    company: "Logistik Zentrum",
    city: "Bonn",
    country: "Njemačka",
    salary: "13.5–15€/h",
    description: "Sortiranje robe, pakovanje, mogući noćni smjenovi."
  },
  {
    id: 3,
    title: "Radnik u hotelu (sobar/ica)",
    company: "Alpen Hotel",
    city: "Innsbruck",
    country: "Austrija",
    salary: "1500–1800€ neto",
    description: "Čišćenje soba, rad u turističkom centru, smještaj obezbijeđen."
  }
];

let jobs = [];

// učitaj iz localStorage ili postavi default
function loadJobs() {
  try {
    const saved = localStorage.getItem("poslovide-jobs");
    if (saved) {
      jobs = JSON.parse(saved);
    } else {
      jobs = DEFAULT_JOBS.slice();
      saveJobs();
    }
  } catch (e) {
    console.error("Greška pri čitanju poslova:", e);
    jobs = DEFAULT_JOBS.slice();
  }
}

function saveJobs() {
  try {
    localStorage.setItem("poslovide-jobs", JSON.stringify(jobs));
  } catch (e) {
    console.error("Greška pri snimanju poslova:", e);
  }
}

// ============ RENDER POSLOVA (JAVNI DIO) ============

function getFilteredJobs() {
  const kw = ($("filter-keyword")?.value || "").toLowerCase();
  const city = ($("filter-city")?.value || "").toLowerCase();
  const country = $("filter-country")?.value || "";

  return jobs.filter((job) => {
    const matchesKw =
      !kw ||
      job.title.toLowerCase().includes(kw) ||
      job.company.toLowerCase().includes(kw) ||
      job.description.toLowerCase().includes(kw);

    const matchesCity =
      !city || job.city.toLowerCase().includes(city);

    const matchesCountry =
      !country || job.country === country;

    return matchesKw && matchesCity && matchesCountry;
  });
}

function renderPublicJobs() {
  const list = $("public-jobs");
  const noRes = $("no-results");
  if (!list) return;

  const filtered = getFilteredJobs();
  list.innerHTML = "";

  if (!filtered.length) {
    if (noRes) noRes.classList.remove("hidden");
    return;
  } else {
    if (noRes) noRes.classList.add("hidden");
  }

  filtered.forEach((job) => {
    const card = document.createElement("article");
    card.className = "job-card";

    card.innerHTML = `
      <h3>${job.title}</h3>
      <p class="job-meta"><strong>Firma:</strong> ${job.company}</p>
      <p class="job-meta"><strong>Lokacija:</strong> ${job.city} • ${job.country}</p>
      <p class="job-salary"><strong>Satnica / plata:</strong> ${job.salary}</p>
      <p>${job.description}</p>
      <div class="job-actions">
        <small>Javi se preko kontakt forme.</small>
        <button type="button" data-title="${job.title}">
          Zainteresovan sam
        </button>
      </div>
    `;

    const btn = card.querySelector("button");
    btn.addEventListener("click", () => {
      const workerName = $("worker-name")?.value || "";
      const baseText = `Zdravo, interesuje me pozicija: "${job.title}" u firmi ${job.company}.`;
      let text = baseText;
      if (workerName) {
        text = `${workerName} – ${baseText}`;
      }
      const url =
        "https://wa.me/4915223000800?text=" +
        encodeURIComponent(text);
      window.open(url, "_blank");
    });

    list.appendChild(card);
  });
}

// ============ ADMIN – LISTA POSLOVA ============

function renderAdminJobs() {
  const container = $("job-list");
  if (!container) return;

  container.innerHTML = "";
  jobs.forEach((job) => {
    const item = document.createElement("div");
    item.className = "job-item";

    item.innerHTML = `
      <div class="job-item-title">${job.title}</div>
      <div><strong>Firma:</strong> ${job.company}</div>
      <div><strong>Lokacija:</strong> ${job.city} • ${job.country}</div>
      <div><strong>Satnica:</strong> ${job.salary}</div>
      <div>${job.description}</div>
      <button class="btn-danger delete-job" data-id="${job.id}">Obriši</button>
    `;

    const delBtn = item.querySelector(".delete-job");
    delBtn.addEventListener("click", () => {
      const id = Number(delBtn.getAttribute("data-id"));
      jobs = jobs.filter((j) => j.id !== id);
      saveJobs();
      renderPublicJobs();
      renderAdminJobs();
    });

    container.appendChild(item);
  });
}

// dodavanje posla iz admin forme
function setupAdminForm() {
  const btn = $("add-job");
  if (!btn) return;

  btn.addEventListener("click", () => {
    const title = $("job-title").value.trim();
    const company = $("job-company").value.trim();
    const city = $("job-location").value.trim();
    const country = $("job-country").value;
    const salary = $("job-salary").value.trim();
    const description = $("job-description").value.trim();

    if (!title || !company || !city || !salary) {
      alert("Unesi najmanje naziv posla, firmu, lokaciju i satnicu.");
      return;
    }

    const job = {
      id: Date.now(),
      title,
      company,
      city,
      country,
      salary,
      description: description || "Detalji po dogovoru."
    };

    jobs.push(job);
    saveJobs();

    $("job-title").value = "";
    $("job-company").value = "";
    $("job-location").value = "";
    $("job-salary").value = "";
    $("job-description").value = "";

    renderPublicJobs();
    renderAdminJobs();
  });

  const clearBtn = $("clear-jobs");
  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      if (
        confirm(
          "Sigurno želiš da obrišeš sve poslove i vratiš na početni spisak?"
        )
      ) {
        jobs = DEFAULT_JOBS.slice();
        saveJobs();
        renderPublicJobs();
        renderAdminJobs();
      }
    });
  }
}

// ============ FILTERI (HERO) ============

function setupFilters() {
  const kw = $("filter-keyword");
  const city = $("filter-city");
  const country = $("filter-country");
  const resetBtn = $("filter-reset");

  [kw, city, country].forEach((el) => {
    if (el) {
      el.addEventListener("input", () => {
        renderPublicJobs();
      });
    }
  });

  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      if (kw) kw.value = "";
      if (city) city.value = "";
      if (country) country.value = "";
      renderPublicJobs();
    });
  }
}

// ============ FORME – RADNIK I FIRMA ============

function setupForms() {
  const workerForm = $("worker-form");
  const companyForm = $("company-form");

  if (workerForm) {
    workerForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const name = $("worker-name").value.trim();
      const phone = $("worker-phone").value.trim();
      const email = $("worker-email").value.trim();
      const position = $("worker-position").value.trim();
      const city = $("worker-city").value.trim();
      const exp = $("worker-experience").value.trim();
      const papers = $("worker-papers").checked ? "DA" : "NE";

      if (!name || !phone) {
        showMessage(
          "worker-message",
          "Molimo unesi ime i telefon.",
          "error"
        );
        return;
      }

      const body = `
Ime i prezime: ${name}
Telefon: ${phone}
E-mail: ${email || "nema"}
Pozicija: ${position || "n/a"}
Grad: ${city || "n/a"}
Iskustvo / napomena: ${exp || "n/a"}
EU papiri / viza: ${papers}
      `;

      const mailto =
        "mailto:horozaje@hotmail.com" +
        "?subject=" +
        encodeURIComponent("Nova prijava – PosloviDE") +
        "&body=" +
        encodeURIComponent(body);

      window.location.href = mailto;
      showMessage(
        "worker-message",
        "Prijava je poslata. Javićemo ti se u najkraćem roku.",
        "success"
      );
      workerForm.reset();
    });
  }

  if (companyForm) {
    companyForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const name = $("company-name").value.trim();
      const person = $("company-person").value.trim();
      const phone = $("company-phone").value.trim();
      const email = $("company-email").value.trim();
      const city = $("company-city").value.trim();
      const count = $("company-count").value.trim();
      const notes = $("company-notes").value.trim();

      if (!name || !person || !phone || !email) {
        showMessage(
          "company-message",
          "Molimo unesi naziv firme, kontakt osobu, telefon i e-mail.",
          "error"
        );
        return;
      }

      const body = `
Firma: ${name}
Kontakt osoba: ${person}
Telefon: ${phone}
E-mail: ${email}
Grad: ${city || "n/a"}
Broj radnika: ${count || "n/a"}
Opis posla / uslovi: ${notes || "n/a"}
      `;

      const mailto =
        "mailto:horozaje@hotmail.com" +
        "?subject=" +
        encodeURIComponent("Nova firma – PosloviDE") +
        "&body=" +
        encodeURIComponent(body);

      window.location.href = mailto;
      showMessage(
        "company-message",
        "Upit je poslat. Javićemo ti se vrlo brzo.",
        "success"
      );
      companyForm.reset();
    });
  }
}

function showMessage(id, text, type) {
  const el = $(id);
  if (!el) return;
  el.textContent = text;
  el.classList.remove("success", "error");
  el.classList.add(type);
}

// ============ ADMIN LOGIN ============

let isAdmin = false;

function setupAdminLogin() {
  const navAdmin = $("nav-admin");
  const adminSection = $("admin");

  if (!navAdmin || !adminSection) return;

  // sakrij admin sekciju dok se ne uloguje
  adminSection.style.display = "none";

  navAdmin.addEventListener("click", (e) => {
    e.preventDefault();
    if (!isAdmin) {
      const pwd = prompt("Unesi admin šifru:");
      if (pwd === "1234") {
        isAdmin = true;
        adminSection.style.display = "block";
        adminSection.scrollIntoView({ behavior: "smooth" });
      } else if (pwd !== null) {
        alert("Pogrešna šifra.");
      }
    } else {
      adminSection.scrollIntoView({ behavior: "smooth" });
    }
  });
}

// ============ SERVICE WORKER ============

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("./service-worker.js")
      .catch((err) => console.log("SW error:", err));
  });
}

// ============ INIT ============

document.addEventListener("DOMContentLoaded", () => {
  loadJobs();
  renderPublicJobs();
  renderAdminJobs();
  setupAdminForm();
  setupFilters();
  setupForms();
  setupAdminLogin();
});