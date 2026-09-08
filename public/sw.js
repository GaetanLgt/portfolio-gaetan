// ============================================================
// GL Digital Lab — Service Worker KILL-SWITCH (2026-10)
// ============================================================
// Le Service Worker a causé des pages blanches répétées : il servait
// un ancien index.html en cache dont les assets hashés (index-*.js/css)
// n'existent plus sur le serveur après chaque déploiement CI/CD →
// « Un service worker a intercepté la requête et a rencontré une erreur ».
//
// Une vitrine en assets hashés + CI/CD n'a pas besoin d'un SW offline.
// Ce fichier est un KILL-SWITCH : à l'installation il purge TOUS les
// caches puis se désenregistre, et n'intercepte plus AUCUNE requête.
// Après ce déploiement, plus aucun Service Worker ne contrôle le site.

self.addEventListener('install', () => {
  // Ne prend jamais le contrôle : on passe direct à activate.
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    // 1. Purge de tous les caches créés par les anciennes versions.
    const keys = await caches.keys()
    await Promise.all(keys.map((key) => caches.delete(key)))
    // 2. Désenregistrement complet de ce service worker.
    await self.registration.unregister()
    // 3. On libère les clients contrôlés.
    const clients = await self.clients.matchAll({ type: 'window' })
    clients.forEach((client) => client.navigate(client.url))
  })())
})

// N'intercepte plus rien : le réseau fait son travail normalement.
self.addEventListener('fetch', () => {})
