<script setup>
/**
 * PictogrammeProduit.vue — LE VISUEL D'UN PRODUIT, DESSINÉ EN SVG À LA MAIN.
 *
 * ⚠ AUCUNE IMAGE BITMAP, AUCUNE POLICE TÉLÉCHARGÉE, AUCUN CDN — règle de la tranche.
 * Chaque produit porte une « forme » (voir `reglesCatalogue.js`), et cette forme est
 * DESSINÉE ici en traits. Le catalogue est vérifié au chargement : une forme qui n'est
 * pas dans la liste ci-dessous fait échouer le chargement plutôt que d'afficher un trou.
 *
 * Le dessin hérite de `currentColor` : il prend donc la couleur de son contexte, et
 * aucune valeur de couleur n'est écrite ici.
 */

const props = defineProps({
  /** Une des formes déclarées dans FORMES_DESSINABLES. */
  forme: { type: String, required: true },
  /** Décrit le dessin. Vide = dessin décoratif, et il est alors caché aux lecteurs d'écran. */
  titre: { type: String, default: '' },
});
</script>

<template>
  <svg
    class="boreal-pictogramme"
    viewBox="0 0 64 64"
    fill="none"
    stroke="currentColor"
    stroke-width="1.6"
    stroke-linecap="round"
    stroke-linejoin="round"
    focusable="false"
    v-bind="props.titre
      ? { role: 'img', 'aria-label': props.titre }
      : { 'aria-hidden': 'true' }"
  >
    <!-- PLUME : la plume taillée et son conduit -->
    <g v-if="props.forme === 'plume'">
      <path d="M32 7 C 42 19, 43 34, 32 45 C 21 34, 22 19, 32 7 Z" />
      <path d="M32 7 L 32 57" />
      <path d="M27 30 L 37 30" />
      <circle cx="32" cy="36" r="2.2" />
    </g>

    <!-- FLACON : le corps pansu, le col, le bouchon -->
    <g v-else-if="props.forme === 'flacon'">
      <path d="M24 20 L 24 52 A 4 4 0 0 0 28 56 L 36 56 A 4 4 0 0 0 40 52 L 40 20 Z" />
      <path d="M27 20 L 27 13 L 37 13 L 37 20" />
      <path d="M25 8 L 39 8 L 39 13 L 25 13 Z" />
      <path d="M28 34 L 36 34" />
    </g>

    <!-- CARNET : les plats, la couture, les lignes -->
    <g v-else-if="props.forme === 'carnet'">
      <rect x="16" y="10" width="32" height="44" rx="2.5" />
      <path d="M22 10 L 22 54" />
      <path d="M28 20 L 42 20" />
      <path d="M28 27 L 42 27" />
      <path d="M28 34 L 36 34" />
    </g>

    <!-- LAMPE : l'abat-jour, le pied, la lumière -->
    <g v-else-if="props.forme === 'lampe'">
      <path d="M22 26 L 32 10 L 42 26 Z" />
      <path d="M32 26 L 32 50" />
      <path d="M20 54 L 44 54" />
      <path d="M32 46 L 32 50" />
      <path d="M14 30 L 10 33" />
      <path d="M50 30 L 54 33" />
    </g>

    <!-- CYLINDRE : le tube, l'ouverture, la base -->
    <g v-else-if="props.forme === 'cylindre'">
      <ellipse cx="32" cy="16" rx="11" ry="4.5" />
      <path d="M21 16 L 21 48 A 11 4.5 0 0 0 43 48 L 43 16" />
      <path d="M21 40 A 11 4.5 0 0 0 43 40" />
    </g>

    <!-- PLAQUE : la pièce plate et ses graduations -->
    <g v-else-if="props.forme === 'plaque'">
      <rect x="10" y="24" width="44" height="16" rx="2" />
      <path d="M18 24 L 18 30" />
      <path d="M26 24 L 26 31" />
      <path d="M34 24 L 34 30" />
      <path d="M42 24 L 42 31" />
      <path d="M10 34 L 54 34" />
    </g>

    <!-- ⚠ DERNIER RECOURS, ET IL EST VOLONTAIREMENT LAID. Une forme inconnue ne doit
         pas se déguiser en plaque : elle doit se VOIR. Le catalogue vérifié l'interdit
         déjà à l'import, donc ce cas ne devrait jamais s'afficher — mais s'il
         s'affiche, c'est que la vérification a été contournée, et ça doit se remarquer. -->
    <g v-else>
      <rect x="12" y="12" width="40" height="40" rx="3" stroke-dasharray="4 3" />
      <path d="M26 24 A 6 6 0 0 1 38 26 C 38 31 32 31 32 36" />
      <circle cx="32" cy="44" r="1.6" />
    </g>
  </svg>
</template>
