/* ============================================================================
   Ce service worker REMPLACE celui de l'ancien site de gldigitallab.fr.
   Il ne met rien en cache : il se désinscrit et vide les caches.

   ⭐ POURQUOI CE FICHIER EXISTE.
   L'ancien site est une application qui s'installait comme service worker à la
   racine du domaine, donc avec un périmètre sur TOUT gldigitallab.fr — y compris
   l'accueil. Un service worker de ce genre sert ses pages depuis son cache avant
   même d'aller voir le réseau : si on se contentait de déposer un index.html
   neuf, les visiteurs déjà venus continueraient de voir l'ANCIENNE page, et le
   nouveau site serait invisible sans qu'aucune erreur n'apparaisse nulle part.

   ⇒ On ne supprime pas l'ancien : on le remplace par celui-ci, qui défait ce que
     l'autre avait posé, une fois, chez chaque visiteur.

   ⚠️ CE FICHIER NE DOIT PAS DEVENIR UN CACHE. S'il en mettait un en place, il
   faudrait recommencer la même opération au prochain changement de site.
   ============================================================================ */

self.addEventListener('install', () => {
  // On ne prend pas la main sur les onglets ouverts : on se prépare à nettoyer.
  self.skipWaiting();
});

self.addEventListener('activate', (evenement) => {
  evenement.waitUntil((async () => {
    // 1. Vider TOUS les caches posés par l'ancien service worker.
    const noms = await caches.keys();
    await Promise.all(noms.map((nom) => caches.delete(nom)));

    // 2. Se désinscrire : à partir de maintenant, ce domaine n'a plus de
    //    service worker, et chaque requête repart au réseau.
    await self.registration.unregister();

    // 3. Recharger les onglets ouverts, pour qu'ils aillent chercher la vraie
    //    page au lieu de garder celle qu'ils avaient en mémoire.
    const onglets = await self.clients.matchAll({ type: 'window' });
    for (const onglet of onglets) {
      onglet.navigate(onglet.url);
    }
  })());
});
