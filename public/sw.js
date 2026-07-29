const CACHE_NAME = 'energyx-v2';
const SCOPE = new URL('./', self.location).href;
// Derive basePath from the SW location (e.g. /EnergyX/sw.js → /EnergyX/)
const basePath = new URL('./', self.location).pathname.replace(/sw\.js$/, '');

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Only cache same-origin requests
  if (url.origin !== self.location.origin) return;

  // Normalize path: strip basePath prefix for cache key consistency
  const relativePath = basePath ? url.pathname.slice(basePath.length) || url.pathname : url.pathname;

  // Static assets: cache-first
  if (
    relativePath.startsWith('/_next/') ||
    relativePath.startsWith('/icon-') ||
    relativePath.endsWith('.js') ||
    relativePath.endsWith('.css') ||
    relativePath.endsWith('.woff2') ||
    relativePath.endsWith('.png') ||
    relativePath.endsWith('.ico') ||
    relativePath.endsWith('.svg')
  ) {
    event.respondWith(
      caches.match(event.request).then(
        (cached) =>
          cached ||
          fetch(event.request).then((response) => {
            if (!response.ok) return response;
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
            return response;
          })
      )
    );
    return;
  }

  // HTML: network-first
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (!response.ok) return response;
        const clone = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
