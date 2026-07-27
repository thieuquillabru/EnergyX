/**
 * EnergyX service worker.
 *
 * The scope is derived from the worker's own location, so the same file works
 * whether the app is served from the domain root (`/`) or from a GitHub Pages
 * project sub-path (`/EnergyX/`).
 */
const SCOPE = new URL('./', self.location).pathname; // e.g. "/" or "/EnergyX/"
const CACHE_NAME = 'energyx-v2';

const STATIC_ASSETS = [
  SCOPE,
  `${SCOPE}manifest.webmanifest`,
  `${SCOPE}favicon.svg`,
  `${SCOPE}icons/icon-192x192.svg`,
  `${SCOPE}icons/icon-512x512.svg`,
];

// Install - pre-cache the shell. Individual failures must not abort install.
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      Promise.allSettled(STATIC_ASSETS.map((asset) => cache.add(asset)))
    )
  );
  self.skipWaiting();
});

// Activate - drop caches from previous versions
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((names) =>
        Promise.all(names.filter((n) => n !== CACHE_NAME).map((n) => caches.delete(n)))
      )
      .then(() => self.clients.claim())
  );
});

// Fetch - network-first for navigations (so users get fresh HTML),
// stale-while-revalidate for everything else.
self.addEventListener('fetch', (event) => {
  const { request } = event;

  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // Navigations: try the network, fall back to the cached app shell offline.
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          return response;
        })
        .catch(async () => {
          const cached = await caches.match(request);
          return cached || (await caches.match(SCOPE)) || Response.error();
        })
    );
    return;
  }

  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      const networkFetch = fetch(request)
        .then((response) => {
          if (response && response.status === 200 && response.type === 'basic') {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(() => cachedResponse);

      return cachedResponse || networkFetch;
    })
  );
});

// Push notifications (reserved for a future release)
self.addEventListener('push', (event) => {
  if (!event.data) return;

  let data = {};
  try {
    data = event.data.json();
  } catch {
    data = { body: event.data.text() };
  }

  event.waitUntil(
    self.registration.showNotification(data.title || 'EnergyX', {
      body: data.body || 'Vous avez une nouvelle notification',
      icon: `${SCOPE}icons/icon-192x192.svg`,
      badge: `${SCOPE}icons/icon-192x192.svg`,
      vibrate: [100, 50, 100],
      data: { url: data.url || SCOPE },
    })
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const target = event.notification.data?.url || SCOPE;

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if ('focus' in client) return client.focus();
      }
      return self.clients.openWindow(target);
    })
  );
});
