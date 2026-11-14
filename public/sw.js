const CACHE_NAME = 'civicduty-v5-20261114-clean';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE).catch(() => {});
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
          return Promise.resolve(true);
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  if (!event.request.url.startsWith('http')) return;

  const url = new URL(event.request.url);

  // Never intercept or cache hashed Vite asset bundles to avoid stale or HTML-fallback script poisoning
  if (url.pathname.startsWith('/assets/')) {
    return;
  }

  // Never serve or cache /sw.js from CacheStorage
  if (url.pathname === '/sw.js') {
    return;
  }

  // Network-first for navigation requests (SPA routes)
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const contentType = response.headers.get('content-type') || '';
          if (response && response.status === 200 && response.type === 'basic' && contentType.includes('text/html')) {
            const responseToCache = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put('/index.html', responseToCache);
            });
          }
          return response;
        })
        .catch(() => {
          return caches.match('/index.html').then((cached) => {
            return cached || caches.match('/');
          });
        })
    );
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const contentType = response.headers.get('content-type') || '';
        const isHtmlFallback = contentType.includes('text/html');
        if (response && response.status === 200 && response.type === 'basic' && !isHtmlFallback) {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return response;
      })
      .catch(() => {
        return caches.match(event.request).then((cached) => {
          if (cached) return cached;
          return new Response('Not found', { status: 404, statusText: 'Not Found' });
        });
      })
  );
});
