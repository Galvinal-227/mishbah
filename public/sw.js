/* eslint-disable no-restricted-globals */

const VERSION = 'mishbah-v1';
const SHELL_CACHE = `${VERSION}-shell`;
const FONT_CACHE = `${VERSION}-fonts`;

const SHELL_URLS = ['/', '/index.html', '/manifest.webmanifest', '/logo.png'];

/* ---------- Install ---------- */
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(SHELL_CACHE).then((cache) => cache.addAll(SHELL_URLS))
  );
  self.skipWaiting();
});

/* ---------- Activate ---------- */
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((k) => {
          if (!k.startsWith(VERSION)) return caches.delete(k);
          return null;
        })
      )
    )
  );
  self.clients.claim();
});

/* ---------- Fetch ---------- */
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Hanya GET
  if (request.method !== 'GET') return;

  // Skip cross-origin API & audio
  if (
    url.hostname.includes('equran.id') ||
    url.hostname.includes('cdn.equran.id') ||
    url.hostname.includes('bigdatacloud.net')
  ) {
    return; // biarkan browser handle langsung
  }

  // Font Google → cache-first
  if (
    url.hostname === 'fonts.googleapis.com' ||
    url.hostname === 'fonts.gstatic.com'
  ) {
    event.respondWith(
      caches.open(FONT_CACHE).then(async (cache) => {
        const cached = await cache.match(request);
        if (cached) return cached;
        try {
          const res = await fetch(request);
          if (res.ok) cache.put(request, res.clone());
          return res;
        } catch {
          return cached ?? Response.error();
        }
      })
    );
    return;
  }

  // Same-origin assets → cache-first + network update
  if (url.origin === self.location.origin) {
    event.respondWith(
      caches.open(SHELL_CACHE).then(async (cache) => {
        const cached = await cache.match(request);
        const fetchPromise = fetch(request)
          .then((res) => {
            if (res.ok && res.type === 'basic') {
              cache.put(request, res.clone());
            }
            return res;
          })
          .catch(() => cached);
        return cached || fetchPromise;
      })
    );
  }
});