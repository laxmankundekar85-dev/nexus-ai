const CACHE_NAME = 'nexus-ai-pwa-v2';
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/favicon.svg',
  '/icon-192.png',
  '/icon-512.png',
  '/maskable-icon-512.png',
  '/manifest.webmanifest'
];

// Install: Cache critical core assets for instant mobile startup
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// Activate: Clean up outdated caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch: Stale-while-revalidate for assets, Network-first for APIs, Navigation fallback for offline
self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // Skip non-GET requests and cross-origin tracking/analytics
  if (request.method !== 'GET') return;

  // Network-first for dynamic backend API endpoints
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request).catch(() => caches.match(request))
    );
    return;
  }

  // Navigation requests (HTML pages): Network-first with cache fallback
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(async () => {
        const cached = await caches.match('/index.html') || await caches.match('/');
        return cached || new Response('Offline - Nexus AI Operating System', {
          headers: { 'Content-Type': 'text/html' }
        });
      })
    );
    return;
  }

  // Static assets: Cache-first with background network revalidation
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      const fetchPromise = fetch(request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseToCache);
          });
        }
        return networkResponse;
      }).catch(() => cachedResponse);

      return cachedResponse || fetchPromise;
    })
  );
});

// Notification Click: Focus existing window or open target task/report URL on Android
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = event.notification.data?.url || '/reports';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      for (const client of windowClients) {
        if (client.url.includes(targetUrl) && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});

// Push notification listener (for server-sent background pushes)
self.addEventListener('push', (event) => {
  if (!event.data) return;
  try {
    const data = event.data.json();
    const title = data.title || 'Nexus AI Task Notification';
    const options = {
      body: data.body || 'Autonomous pipeline update',
      icon: data.icon || '/icon-192.png',
      badge: '/favicon.svg',
      vibrate: [200, 100, 200],
      data: { url: data.url || '/reports' }
    };
    event.waitUntil(self.registration.showNotification(title, options));
  } catch {
    event.waitUntil(
      self.registration.showNotification('Nexus AI Task Alert', {
        body: event.data.text(),
        icon: '/icon-192.png',
        badge: '/favicon.svg',
        vibrate: [200, 100, 200],
        data: { url: '/reports' }
      })
    );
  }
});
