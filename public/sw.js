const CACHE_NAME = 'miapp-cache-v1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  // Aquí debes listar tus assets principales, por ejemplo:
  // './src/main.js'  → cuidado: en producción Vite renombra los archivos con hashes
];

// Instalar el SW y cachear recursos
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS_TO_CACHE))
  );
});

// Interceptar peticiones y responder desde cache si existe
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});