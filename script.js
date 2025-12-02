// ===================== ADMIN LOGIN SISTEM (FINAL VERSION) =====================
document.addEventListener("DOMContentLoaded", () => {
  const loginOverlay = document.getElementById("admin-login-overlay");
  const loginForm = document.getElementById("admin-login-form");
  const usernameField = document.getElementById("admin-username");
  const passwordField = document.getElementById("admin-password");
  const adminSection = document.querySelector(".admin-section");
  const adminJobsSection = document.getElementById("admin-jobs");
  const adminOpenLink = document.getElementById("admin-open-link");
  const logoutBtn = document.getElementById("admin-logout");

  if (!loginOverlay || !loginForm) return;

  // --- FUNKCIJE ---
  function showAdmin() {
    adminSection?.classList.remove("hidden");
    adminJobsSection?.classList.remove("hidden");
    loginOverlay.style.display = "none";
  }

  function hideAdmin() {
    adminSection?.classList.add("hidden");
    adminJobsSection?.classList.add("hidden");
    loginOverlay.style.display = "none";
  }

  function showOverlay() {
    loginOverlay.style.display = "flex";
  }

  function hideOverlay() {
    loginOverlay.style.display = "none";
  }

  // --- 1) PRIKAŽI ADMIN SAMO AKO JE ULOGOVAN ---
  if (localStorage.getItem("posloviDE_isAdmin") === "1") {
    showAdmin();
  } else {
    hideAdmin();
  }

  // --- 2) KLIK NA ADMIN OTVARA LOGIN PROZOR ---
  if (adminOpenLink) {
    adminOpenLink.addEventListener("click", (e) => {
      e.preventDefault();
      showOverlay();
    });
  }

  // --- 3) SUBMIT FORME (LOGIN) ---
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const u = usernameField.value.trim();
    const p = passwordField.value.trim();

    if (u === "admin" && p === "1234") {
      localStorage.setItem("posloviDE_isAdmin", "1");
      hideOverlay();
      showAdmin();

      document.getElementById("admin")?.scrollIntoView({ behavior: "smooth" });
    } else {
      alert("Pogrešni podaci.");
    }
  });

  // --- 4) LOGOUT ---
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("posloviDE_isAdmin");
      hideAdmin();
      window.scrollTo({ top: 0 });
    });
  }

  // --- 5) ZATVARANJE LOGIN OVERLAYA KLIKOM VAN KUTIJE ---
  loginOverlay.addEventListener("click", (e) => {
    if (e.target === loginOverlay) hideOverlay();
  });
});
