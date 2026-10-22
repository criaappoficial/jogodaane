/* Meu Look Fashion - service worker
   Atualize CACHE_VERSION sempre que alterar index.html, manifest ou ícones. */
const CACHE_VERSION = 'meu-look-fashion-v2';
const SCOPE = self.registration.scope;
const INDEX_URL = new URL('./index.html', SCOPE).href;
const APP_SHELL = [
  new URL('./', SCOPE).href,
  INDEX_URL,
  new URL('./manifest.webmanifest', SCOPE).href,
  new URL('./icons/icon-192.png', SCOPE).href,
  new URL('./icons/icon-512.png', SCOPE).href,
  new URL('./icons/icon-maskable-512.png', SCOPE).href,
  new URL('./icons/apple-touch-icon.png', SCOPE).href,
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys.filter((key) => key !== CACHE_VERSION).map((key) => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response && response.ok) {
            const copy = response.clone();
            caches.open(CACHE_VERSION).then((cache) => cache.put(INDEX_URL, copy));
          }
          return response;
        })
        .catch(() => caches.match(INDEX_URL).then((cached) => cached || caches.match(new URL('./', SCOPE).href)))
    );
    return;
  }

  event.respondWith(
    caches.match(request, { ignoreSearch: true }).then((cached) => {
      if (cached) return cached;
      return fetch(request)
        .then((response) => {
          if (response && response.ok && response.type === 'basic') {
            const copy = response.clone();
            caches.open(CACHE_VERSION).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(() => {
          if (request.destination === 'image') {
            return caches.match(new URL('./icons/icon-192.png', SCOPE).href);
          }
          return caches.match(INDEX_URL);
        });
    })
  );
});
