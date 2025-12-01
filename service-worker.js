self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open("poslovide-cache").then((cache) => {
      return cache.addAll([
        "./",
        "./index.html",
        "./style.css",
        "./script.js",
        "./manifest.json"
      ]);
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
<script>
  // Simulacija slanja forme – prikaz poruke, bez pravog slanja (to ćemo kasnije)
  function handleFakeSubmit(formId, messageId) {
    const form = document.getElementById(formId);
    const message = document.getElementById(messageId);

    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      message.textContent = "✅ Prijava je poslata. Javićemo ti se u najkraćem roku.";
      message.classList.remove('error');
      message.classList.add('success');

      // opcionalno očisti formu
      form.reset();

      // skini poruku posle par sekundi
      setTimeout(() => {
        message.textContent = "";
        message.classList.remove('success');
      }, 6000);
    });
  }

  handleFakeSubmit('worker-form', 'worker-message');
  handleFakeSubmit('company-form', 'company-message');
</script>