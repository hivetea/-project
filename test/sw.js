/* ============================================================
   A3 Maritime Intelligence — Service Worker
   Strategy: stale-while-revalidate for local assets,
             cache-first-with-network-fallback for CDN.
   ============================================================ */

const CACHE_NAME = 'a3-maritime-v3';

const LOCAL_ASSETS = [
  './index.html',
  './manifest.json',
  './icon-192.svg',
  './icon-512.svg',
  './Header.jsx',
  './GeospatialCanvas.jsx',
  './TelemetryRail.jsx',
  './RagFeed.jsx',
  './styles.css',
  './_ds_bundle.js',
  './tokens/base.css',
  './tokens/colors.css',
  './tokens/effects.css',
  './tokens/fonts.css',
  './tokens/spacing.css',
  './tokens/typography.css',
];

/* ---------- Install: precache local assets ---------- */
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[A3 SW] Precaching local assets…');
      return Promise.allSettled(
        LOCAL_ASSETS.map((url) =>
          cache.add(url).catch((e) => console.warn('[A3 SW] Skip:', url, e.message))
        )
      );
    }).then(() => self.skipWaiting())
  );
});

/* ---------- Activate: clear old caches ---------- */
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((k) => k !== CACHE_NAME).map((k) => {
          console.log('[A3 SW] Removing old cache:', k);
          return caches.delete(k);
        })
      )
    ).then(() => self.clients.claim())
  );
});

/* ---------- Fetch: stale-while-revalidate ---------- */
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  /* Skip non-GET, devtools, chrome-extension */
  if (request.method !== 'GET') return;
  if (url.protocol === 'chrome-extension:') return;
  if (url.hostname === 'localhost' && url.pathname.startsWith('/__')) return;

  event.respondWith(
    caches.open(CACHE_NAME).then((cache) =>
      cache.match(request).then((cached) => {
        /* Always fire a network fetch to keep cache fresh */
        const networkFetch = fetch(request)
          .then((response) => {
            /* Cache valid responses (including opaque CDN) */
            if (response.status === 200 || response.type === 'opaque') {
              cache.put(request, response.clone());
            }
            return response;
          })
          .catch(() => {
            /* Network failed — fall back to cache or offline stub */
            if (cached) return cached;
            if (request.headers.get('accept')?.includes('text/html')) {
              return cache.match('./index.html');
            }
            return new Response(
              JSON.stringify({ error: 'offline', message: '目前離線，請稍後再試' }),
              { status: 503, headers: { 'Content-Type': 'application/json' } }
            );
          });

        /* Return stale cache immediately; update in background */
        return cached ?? networkFetch;
      })
    )
  );
});

/* ---------- Push notifications (placeholder) ---------- */
self.addEventListener('push', (event) => {
  if (!event.data) return;
  const data = event.data.json();
  event.waitUntil(
    self.registration.showNotification(data.title || 'A3 海象警報', {
      body: data.body || '',
      icon: './icon-192.svg',
      badge: './icon-192.svg',
      tag: data.tag || 'a3-alert',
      data: { url: data.url || './index.html' },
    })
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data?.url || './index.html')
  );
});
