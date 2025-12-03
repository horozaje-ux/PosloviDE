// POSLOVIDE – glavna logika
document.addEventListener('DOMContentLoaded', () => {
  // =========================
  // 1. DEMO POSLOVI (kartice)
  // =========================

  const jobs = [
    {
      id: 'job-1',
      title: 'Pomoćni radnik',
      company: 'Firma SD',
      location: 'Bonn',
      country: 'Njemačka',
      salary: '13.50€ / h + bonus',
      description:
        'Građevina, rad na fasadama, dugoročni ugovor. Smještaj organizovan.',
      contact: 'WhatsApp: +38269200250'
    },
    {
      id: 'job-2',
      title: 'Monter suve gradnje',
      company: 'AlpenHotel',
      location: 'Tirol',
      country: 'Austrija',
      salary: '15–17€ + bakšiš',
      description:
        'Sezonski posao u hotelu, hrana i smještaj obezbijeđeni.',
      contact: 'WhatsApp: +38269200250'
    },
    {
      id: 'job-3',
      title: 'Magacioner',
      company: 'Logistic DE',
      location: 'Köln',
      country: 'Njemačka',
      salary: '14–16€ / h',
      description: 'Rad u magacinu, 2 smjene, organizovan prevoz do posla.',
      contact: 'Email: horozaje@hotmail.com'
    }
  ];

  const jobsListEl = document.getElementById('jobs-list');
  const searchInputEl = document.getElementById('search-input');
  const countryFilterEl = document.getElementById('country-filter');
  const filterResetBtn = document.getElementById('filter-reset');
  const noResultsEl = document.getElementById('no-results');

  function renderJobs(list) {
    if (!jobsListEl) return;

    if (!list || list.length === 0) {
      jobsListEl.innerHTML = '';
      if (noResultsEl) noResultsEl.classList.remove('hidden');
      return;
    }

    if (noResultsEl) noResultsEl.classList.add('hidden');

    jobsListEl.innerHTML = list
      .map(
        (job) => `
      <article class="job-card">
        <header class="job-card-header">
          <div>
            <h3 class="job-title">${job.title}</h3>
            <p class="job-meta">
              <span class="job-company">${job.company}</span> ·
              <span class="job-location">${job.location}</span>
            </p>
          </div>
          <span class="job-country-badge">${job.country}</span>
        </header>

        <p class="job-salary">${job.salary || ''}</p>
        <p class="job-description">${job.description || ''}</p>

        <footer class="job-card-footer">
          <button class="job-apply-btn" data-job-id="${job.id}">
            Zahtjev / prijava
          </button>
          <span class="job-contact">${job.contact || ''}</span>
        </footer>
      </article>
    `
      )
      .join('');
  }

  function filterJobs() {
    const term = (searchInputEl?.value || '').toLowerCase();
    const country = countryFilterEl?.value || 'all';

    const filtered = jobs.filter((job) => {
      const matchesCountry =
        country === 'all' ||
        job.country.toLowerCase() === country.toLowerCase();

      const text =
        (job.title + job.company + job.location + job.description).toLowerCase();

      const matchesTerm = !term || text.includes(term);

      return matchesCountry && matchesTerm;
    });

    renderJobs(filtered);
  }

  // Inicijalni prikaz poslova
  renderJobs(jobs);

  if (searchInputEl) {
    searchInputEl.addEventListener('input', filterJobs);
  }

  if (countryFilterEl) {
    countryFilterEl.addEventListener('change', filterJobs);
  }

  if (filterResetBtn) {
    filterResetBtn.addEventListener('click', () => {
      if (searchInputEl) searchInputEl.value = '';
      if (countryFilterEl) countryFilterEl.value = 'all';
      renderJobs(jobs);
    });
  }

  // Klik na "Zahtjev / prijava" – skrol na kontakt formu
  document.addEventListener('click', (e) => {
    const target = e.target;
    if (!(target instanceof Element)) return;

    const btn = target.closest('.job-apply-btn');
    if (!btn) return;

    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  });

  // =========================
  // 2. ADMIN PANEL – METRIKE
  // =========================

  const metricTotalEl = document.getElementById('metric-total');
  const metricWorkersEl = document.getElementById('metric-workers');
  const metricCompaniesEl = document.getElementById('metric-companies');
  const metricLastEl = document.getElementById('metric-last');

  const workersTableBody = document.querySelector(
    '.admin-table-wrapper[data-panel="workers"] tbody'
  );
  const companiesTableBody = document.querySelector(
    '.admin-table-wrapper[data-panel="companies"] tbody'
  );

  function recalcMetrics() {
    if (!workersTableBody || !companiesTableBody) return;

    const workerRows = Array.from(workersTableBody.querySelectorAll('tr'));
    const companyRows = Array.from(companiesTableBody.querySelectorAll('tr'));

    const workersCount = workerRows.length;
    const companiesCount = companyRows.length;
    const total = workersCount + companiesCount;

    if (metricWorkersEl) metricWorkersEl.textContent = String(workersCount);
    if (metricCompaniesEl) metricCompaniesEl.textContent = String(companiesCount);
    if (metricTotalEl) metricTotalEl.textContent = String(total);

    if (metricLastEl) {
      const now = new Date();
      const hh = String(now.getHours()).padStart(2, '0');
      const mm = String(now.getMinutes()).padStart(2, '0');
      metricLastEl.textContent = `${hh}:${mm}`;
    }
  }

  recalcMetrics();

  // =========================
  // 3. ADMIN PANEL – TABOVI
  // =========================

  const adminTabs = document.querySelectorAll('.admin-tab');
  const adminPanels = document.querySelectorAll('.admin-table-wrapper');

  adminTabs.forEach((btn) => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-tab');
      if (!target) return;

      adminTabs.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      adminPanels.forEach((panel) => {
        if (panel.getAttribute('data-panel') === target) {
          panel.classList.remove('hidden');
        } else {
          panel.classList.add('hidden');
        }
      });
    });
  });

  // =========================
  // 4. ADMIN – STATUS / CHAT
  // =========================

  const chatTargetEl = document.getElementById('chat-target');
  const chatMessagesEl = document.getElementById('chat-messages');
  const chatFormEl = document.getElementById('chat-form');
  const chatInputEl = document.getElementById('chat-input');

  let selectedRowId = null;

  function setSelectedRow(row) {
    const allRows = document.querySelectorAll('.admin-table tbody tr');
    allRows.forEach((r) => r.classList.remove('selected'));

    if (!row) {
      selectedRowId = null;
      if (chatTargetEl) chatTargetEl.textContent = 'Nijedna prijava nije izabrana.';
      if (chatMessagesEl) chatMessagesEl.innerHTML = '';
      return;
    }

    row.classList.add('selected');
    selectedRowId = row.getAttribute('data-id');

    const name = row.querySelector('td')?.textContent || '';
    if (chatTargetEl) chatTargetEl.textContent = `Bilješke za: ${name}`;

    loadNotesForSelected();
  }

  function loadNotesForSelected() {
    if (!chatMessagesEl || !selectedRowId) {
      if (chatMessagesEl) chatMessagesEl.innerHTML = '';
      return;
    }

    const key = `posloviDE_notes_${selectedRowId}`;
    const stored = localStorage.getItem(key);
    const notes = stored ? JSON.parse(stored) : [];

    chatMessagesEl.innerHTML = notes
      .map(
        (n) => `
        <div class="chat-message">
          <span class="chat-message-text">${n.text}</span>
          <span class="chat-message-time">${n.time}</span>
        </div>
      `
      )
      .join('');
    chatMessagesEl.scrollTop = chatMessagesEl.scrollHeight;
  }

  function saveNoteForSelected(text) {
    if (!selectedRowId) return;

    const key = `posloviDE_notes_${selectedRowId}`;
    const stored = localStorage.getItem(key);
    const notes = stored ? JSON.parse(stored) : [];

    const now = new Date();
    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');

    notes.push({ text, time: `${hh}:${mm}` });
    localStorage.setItem(key, JSON.stringify(notes));
  }

  // DELEGACIJA KLIKOVA U ADMIN TABELAMA
  document.addEventListener('click', (e) => {
    const target = e.target;
    if (!(target instanceof Element)) return;

    // 1) Klik na red – selekcija
    const row = target.closest('.admin-table tbody tr');
    if (row) {
      setSelectedRow(row);
    }

    // 2) Klik na dugmad za status
    const actionBtn = target.closest('.action-btn');
    if (!actionBtn) return;

    const tr = actionBtn.closest('tr');
    if (!tr) return;

    const badge = tr.querySelector('.status-badge');
    if (!badge) return;

    if (actionBtn.classList.contains('action-progress')) {
      tr.dataset.status = 'in-progress';
      badge.textContent = 'Kontaktiran';
      badge.className = 'status-badge status-progress';
    } else if (actionBtn.classList.contains('action-done')) {
      tr.dataset.status = 'done';
      badge.textContent = 'Završeno';
      badge.className = 'status-badge status-done';
    } else if (actionBtn.classList.contains('action-restore')) {
      tr.dataset.status = 'new';
      badge.textContent = 'Novo';
      badge.className = 'status-badge status-new';
    }

    recalcMetrics();
  });

  // CHAT – SLANJE BILJEŠKI
  if (chatFormEl && chatInputEl) {
    chatFormEl.addEventListener('submit', (e) => {
      e.preventDefault();
      const text = chatInputEl.value.trim();
      if (!text) return;

      if (!selectedRowId) {
        alert('Prvo odaberi prijavu iz tabele.');
        return;
      }

      saveNoteForSelected(text);
      chatInputEl.value = '';
      loadNotesForSelected();
    });
  }

  // Opciono: automatski izaberi prvi red na početku
  const firstRow = document.querySelector('.admin-table tbody tr');
  if (firstRow) {
    setSelectedRow(firstRow);
  }
});
