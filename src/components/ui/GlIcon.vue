<template>
  <!--
    Jeu d'icônes Génie IT Tek FR — cohérent, sobre, sans dépendance réseau.

    POURQUOI CE COMPOSANT PLUTÔT QU'UN FICHIER PAR ICÔNE, ou qu'un sprite SVG :

      1. ZÉRO REQUÊTE. Un sprite est un fichier de plus à charger, donc une
         requête de plus et un aller-retour avant que la première icône apparaisse.
         Ici tout est dans le bundle déjà chargé. Vérifié : la marge sous le verrou
         de 1 Mo par page était de 438 Ko avant ce composant — dix icônes en lignes
         SVG coûtent quelques Ko, pas quelques centaines.
      2. PAS D'ÉMOJI. Le verrou de la charte interdit l'émoji en icône (il dépend
         de la police du système, il change de dessin d'une machine à l'autre, et
         il pèse plus lourd qu'un chemin SVG). Ces icônes sont des tracés.
      3. `currentColor`, JAMAIS UNE COULEUR EN DUR. C'est la règle qui protège la
         charte : une icône prend la couleur de son contexte — `--ink` par défaut,
         `--accent` seulement là où une décision humaine est marquée. L'émeraude
         reste rare, comme la doctrine l'exige. Si une icône portait `#00FF41` en
         dur, elle diluerait le seul signal sacré du site.

    RÈGLES DE DESSIN, et elles sont volontairement mécaniques :
      · grille de 24 × 24, trait de 1,5, bouts et jonctions arrondis ;
      · contour seul, aucun aplat — un aplat sur fond sombre devient une tache ;
      · primitives simples (cercles, rectangles, segments) plutôt que des courbes
        composées : une icône mal dessinée ne se voit qu'à l'écran, et on n'y
        revient jamais.

    POUR AJOUTER UNE ICÔNE : une entrée dans `TRACES`. Rien d'autre.
  -->
  <svg
    class="gl-icone"
    :width="taille"
    :height="taille"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    :stroke-width="epaisseur"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
    focusable="false"
    v-html="trace"
  />
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  // `nom` doit exister dans TRACES. Un nom inconnu ne casse rien : il rend un
  // carré vide, et l'avertissement en console dit lequel manque.
  nom: { type: String, required: true },
  taille: { type: [Number, String], default: 24 },
  epaisseur: { type: [Number, String], default: 1.5 },
});

const TRACES = {
  // ── L'offre, telle qu'elle est vendue ────────────────────────────────────
  // « La sonde » — on mesure avant de s'engager
  audit: '<circle cx="11" cy="11" r="7"/><path d="M16.5 16.5 21 21"/><path d="M8.5 11h5"/>',
  // « Votre première voile » — la fenêtre du navigateur
  site: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18"/><path d="M6.5 6.5h.01"/><path d="M9.5 6.5h.01"/>',
  // « La coque, ajustée à votre métier » — une structure qui se tient
  application: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M9 4v16"/><path d="M3 12h18"/>',
  // « La propulsion » — la puce qui calcule sur place
  ia: '<rect x="6.5" y="6.5" width="11" height="11" rx="2"/><rect x="10" y="10" width="4" height="4" rx="1"/><path d="M9 3v3.5M15 3v3.5M9 17.5V21M15 17.5V21M3 9h3.5M3 15h3.5M17.5 9H21M17.5 15H21"/>',
  // « La cale » — les documents qui ne quittent pas le navire
  memoire: '<ellipse cx="12" cy="6" rx="7" ry="3"/><path d="M5 6v12a7 3 0 0 0 14 0V6"/><path d="M5 12a7 3 0 0 0 14 0"/>',
  // ── Les qualités qu'on revendique ────────────────────────────────────────
  securite: '<path d="M12 3 19 6v6c0 4-3 7.5-7 9-4-1.5-7-5-7-9V6z"/><path d="M9.5 12.5 11.5 14.5 15 11"/>',
  performance: '<path d="M4 18a9 9 0 1 1 16 0"/><path d="M12 18 16.5 10"/><path d="M4 18h16"/>',
  // Le port d'attache : la machine est ici, et elle est identifiée
  souverainete: '<rect x="4" y="3.5" width="16" height="7" rx="1.5"/><rect x="4" y="13.5" width="16" height="7" rx="1.5"/><path d="M7.5 7h.01"/><path d="M7.5 17h.01"/><path d="M15.5 7h4"/><path d="M15.5 17h4"/>',
  contact: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7.5 9 6 9-6"/>',
  // ── Le calendrier : pour les bandeaux datés et les thèmes saisonniers ────
  calendrier: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18"/><path d="M8 3v4"/><path d="M16 3v4"/>',
};

const trace = computed(() => {
  const t = TRACES[props.nom];
  if (!t) {
    // On ne rend pas une icône « à peu près » : on rend vide et on le dit. Une
    // icône de remplacement trompe celui qui l'a demandée.
    console.warn(`[GlIcon] icône inconnue : « ${props.nom} ». Disponibles : ${Object.keys(TRACES).join(', ')}`);
    return '';
  }
  return t;
});

defineExpose({ noms: Object.keys(TRACES) });
</script>

<style scoped>
.gl-icone {
  display: inline-block;
  vertical-align: -0.15em;
  flex-shrink: 0;
}
</style>
