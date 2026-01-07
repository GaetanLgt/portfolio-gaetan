// GL Digital Lab - Service Worker v1.0
const CACHE_NAME = 'gl-digital-lab-v1';
const OFFLINE_URL = '/offline.html';

// Assets à mettre en cache immédiatement
const PRECACHE_ASSETS = [
  '/',
  '/offline.html',
  '/favicon.svg',
  '/favicon-192x192.png',
  '/favicon-512x512.png',
  '/fonts/Inter-Regular.woff2',
  '/fonts/JetBrainsMono-Regular.woff2'
];

// Installation : mise en cache des assets critiques
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Precaching assets');
        return cache.addAll(PRECACHE_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activation : nettoyage des anciens caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((name) => name !== CACHE_NAME)
            .map((name) => {
              console.log('[SW] Deleting old cache:', name);
              return caches.delete(name);
            })
        );
      })
      .then(() => self.clients.claim())
  );
});

// Stratégie de fetch : Network First avec fallback cache
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Ignorer les requêtes non-GET
  if (request.method !== 'GET') return;

  // Ignorer les requêtes externes (analytics, APIs, etc.)
  if (!url.origin.includes(self.location.origin)) return;

  // Ignorer les requêtes API
  if (url.pathname.startsWith('/api/')) return;

  event.respondWith(
    // Stratégie : Network First
    fetch(request)
      .then((response) => {
        // Clone la réponse pour la mettre en cache
        if (response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(request, responseClone);
            });
        }
        return response;
      })
      .catch(async () => {
        // Fallback sur le cache
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
          return cachedResponse;
        }

        // Si c'est une navigation, afficher la page offline
        if (request.mode === 'navigate') {
          const offlineResponse = await caches.match(OFFLINE_URL);
          if (offlineResponse) {
            return offlineResponse;
          }
        }

        // Sinon, retourner une erreur
        return new Response('Offline', {
          status: 503,
          statusText: 'Service Unavailable'
        });
      })
  );
});

// Gestion des messages (pour forcer la mise à jour)
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
