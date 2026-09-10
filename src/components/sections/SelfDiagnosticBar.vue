<template>
  <!--
    BARRE D'AUTODIAGNOSTIC — D5

    REFONTE MAKOTO (10/09/2026). Cette barre affichait des valeurs FAUSSES :
      · `A11Y: PASS` était une constante codée en dur — elle ne mesurait rien ;
      · `FPS: 60` était la valeur initiale, et restait figée à 60 pour tout
        visiteur ayant demandé moins de mouvement (la boucle n'était jamais
        lancée) ;
      · `CLUSTER_STATUS: STABLE` désignait un cluster qui n'existe pas.
    Le site affirme pourtant en page d'accueil : « sources citées, tests, zéro
    métrique inventée ». Une barre de diagnostic qui invente ses diagnostics
    détruit exactement l'argument qu'elle prétend servir.

    Ne restent que des mesures réelles, et un « — » quand la mesure n'existe
    pas encore. Rien n'est arrondi vers le haut, rien n'est décoré.
  -->
  <!--
    ÉLÉMENT CORRIGÉ (13/09/2026). C'était <footer class="sdb" role="status">.
    Deux défauts : un `role="status"` est INTERDIT sur un élément `footer`
    (Lighthouse : « N'utilise des rôles ARIA que sur des éléments
    compatibles »), et le site se retrouvait avec deux repères `contentinfo`.
    C'est désormais un `aside` : le rôle `complementary` est celui de l'élément,
    donc aucun rôle explicite à écrire, et une zone de diagnostic est bien du
    contenu complémentaire. Pas de `role="status"` non plus : la barre affiche
    des valeurs qui bougent en continu, un lecteur d'écran les annoncerait sans
    arrêt.
  -->
  <aside class="sdb" aria-label="Diagnostic technique mesuré en direct">
    <div class="sdb__metrics">
      <div class="sdb__item sdb__item--status">
        <span class="sdb__dot"></span>
        <span class="sdb__label">SYSTÈME</span>
        <span class="sdb__value sdb__value--brand">{{ enLigne ? 'EN LIGNE' : 'HORS LIGNE' }}</span>
      </div>

      <div class="sdb__item" :title="fps === null ? 'Mesure en cours…' : 'Images par seconde réellement rendues par votre navigateur'">
        <span class="sdb__label">FPS</span>
        <span class="sdb__value">{{ fps === null ? '—' : fps }}</span>
      </div>

      <div class="sdb__item" title="Temps entre le début de la navigation et le DOM analysé (performance API)">
        <span class="sdb__label">DOM PRÊT</span>
        <span class="sdb__value">{{ domPret === null ? '—' : domPret + ' ms' }}</span>
      </div>

      <div class="sdb__item" title="Poids réellement transféré, mesuré sur les entrées de performance de cette page">
        <span class="sdb__label">TRANSFERT</span>
        <span class="sdb__value">{{ transfert }}</span>
      </div>

      <div class="sdb__item" :title="motifPoste ? `Palier appliqué à la 3D — raison : ${motifPoste}` : 'Palier de post-traitement réellement appliqué à la scène 3D de votre machine'">
        <span class="sdb__label">PALIER</span>
        <span class="sdb__value" :class="classePalier">{{ palierPoste }}</span>
      </div>

      <div class="sdb__item" title="Votre navigateur applique-t-il la préférence de mouvement réduit ?">
        <span class="sdb__label">MOUVEMENT</span>
        <span class="sdb__value" :class="{ 'sdb__value--pass': mouvementReduit }">{{ mouvementReduit ? 'RÉDUIT' : 'STANDARD' }}</span>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { palierPoste, motifPoste } from '@/composables/etat-poste.js';

const enLigne = ref(typeof navigator !== 'undefined' ? navigator.onLine : true);
const fps = ref(null);              // null = pas encore mesuré. Jamais une valeur flattée.
const domPret = ref(null);
const octets = ref(null);
const octetsPartiels = ref(false);
const mouvementReduit = ref(false);
const palier = palierPoste;

const transfert = computed(() => {
  if (octets.value === null) return '—';
  const ko = Math.round(octets.value / 1024);
  // « ≈ » quand certaines ressources ne divulguent pas leur taille (cross-origin
  // sans Timing-Allow-Origin) : on préfère un signe honnête à un chiffre faux.
  return `${octetsPartiels.value ? '≈ ' : ''}${ko} Ko`;
});

const classePalier = computed(() => {
  if (palier.value === 'statique') return 'sdb__value--warn';
  if (palier.value === 'haut') return 'sdb__value--pass';
  return '';
});

let rafId = null;
let frames = 0;
let debut = null;

/** Mesure le FPS réel sur 3 s, puis S'ARRÊTE : un compteur permanent pour un
 *  chiffre d'ambiance serait du gaspillage de batterie, et un « 60 » figé
 *  serait un mensonge. */
const mesurerFPS = () => {
  if (debut === null) debut = performance.now();
  frames++;
  const ecoule = performance.now() - debut;
  if (ecoule >= 3000) {
    fps.value = Math.round((frames / ecoule) * 1000);
    rafId = null;
    return;
  }
  rafId = requestAnimationFrame(mesurerFPS);
};

const mesurerChargement = () => {
  // DOM prêt : mesure normalisée par la Performance Timeline (l'ancienne API
  // `performance.timing` est dépréciée et donnait « 0.0s »).
  const nav = performance.getEntriesByType?.('navigation')?.[0];
  if (nav) domPret.value = Math.round(nav.domInteractive);

  // Poids : on additionne ce que le navigateur déclare avoir réellement reçu.
  const ressources = performance.getEntriesByType?.('resource') ?? [];
  let total = nav ? (nav.transferSize || nav.encodedBodySize || 0) : 0;
  let partiel = false;
  for (const r of ressources) {
    const t = r.transferSize || r.encodedBodySize || 0;
    if (!t) partiel = true;      // ressource en cache ou taille non divulguée
    total += t;
  }
  octets.value = total;
  octetsPartiels.value = partiel;
};

const majReseau = () => { enLigne.value = navigator.onLine; };

onMounted(() => {
  mouvementReduit.value = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;

  rafId = requestAnimationFrame(mesurerFPS);
  mesurerChargement();
  // Deuxième passe : les ressources différées (three.js, les unités 3D) arrivent
  // après le montage. Sans cette re-mesure, le poids affiché serait incomplet.
  setTimeout(mesurerChargement, 2500);

  window.addEventListener('online', majReseau);
  window.addEventListener('offline', majReseau);
});

onUnmounted(() => {
  if (rafId) cancelAnimationFrame(rafId);
  window.removeEventListener('online', majReseau);
  window.removeEventListener('offline', majReseau);
});
</script>

<style scoped>
.sdb {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  padding: 0.45rem 1rem;
  /* VESTIGE DE LA DA SOMBRE CORRIGÉ (10/09/2026) : ce fond était un
     rgba(3, 6, 10, 0.94) codé en dur — un noir de l'ancien thème — alors que
     le texte au-dessus suivait la palette papier. Résultat mesuré par
     Lighthouse : 2,84:1 sur les libellés et 2,95:1 sur les valeurs, très en
     dessous du seuil de 4,5:1. La barre reprend donc les fonds de la charte. */
  background: var(--paper-alt);
  border-top: 1px solid var(--rule);
  font-family: var(--font-mono);
  font-size: 0.6rem;
  color: var(--ink-soft);
}

.sdb__metrics {
  display: flex;
  gap: 1.35rem;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
}

.sdb__metrics::-webkit-scrollbar { display: none; }

.sdb__item {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  white-space: nowrap;
}

.sdb__item--status { color: var(--accent); }

.sdb__dot {
  width: 6px;
  height: 6px;
  background: var(--accent);
  border-radius: 50%;
  box-shadow: var(--glow-accent);
}

.sdb__label {
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--ink-soft);
}

.sdb__value {
  color: var(--ink);
  font-weight: 600;
  font-variant-numeric: tabular-nums;
}

.sdb__value--brand { color: var(--accent); }
.sdb__value--pass { color: var(--accent); }
.sdb__value--warn { color: var(--alert); }

/* ── Mobile : on garde l'essentiel (système, FPS, palier), le reste défile. ── */
@media (max-width: 480px) {
  .sdb { padding: 0.4rem 0.75rem; font-size: 0.55rem; }
  .sdb__metrics { gap: 0.9rem; }
}
</style>
