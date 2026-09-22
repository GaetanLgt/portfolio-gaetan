<template>
  <svg
    class="rune-trace"
    :width="largeurPx"
    :height="taille"
    :viewBox="`0 0 ${RATIO_LARGEUR} 1`"
    :aria-hidden="porteSens ? undefined : 'true'"
    :role="porteSens ? 'img' : undefined"
    :aria-label="porteSens ? libelle : undefined"
    focusable="false"
  >
    <title v-if="porteSens">{{ libelle }}</title>
    <line
      v-for="(seg, i) in traits"
      :key="i"
      :x1="seg[0]"
      :y1="seg[1]"
      :x2="seg[2]"
      :y2="seg[3]"
      :stroke="couleur"
      :stroke-width="epaisseur"
      stroke-linecap="round"
      stroke-linejoin="round"
      :vector-effect="traitFixe ? 'non-scaling-stroke' : undefined"
    />
  </svg>
</template>

<script setup>
/**
 * RuneTrace — UNE rune, en SVG en ligne.
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * ZÉRO REQUÊTE : du SVG en ligne, c'est du HTML. Ni image, ni police, ni fichier.
 *
 * ⭐ LISIBILITÉ — c'est la raison d'être de ce composant.
 * Le dirigeant a jugé les runes du sceau (`ZOOM-runes.png`, regardé le
 * 22/09/2026) : barres épaisses et trapues, gris sur gris. *Des runes qu'on ne
 * reconnaît pas sont des motifs, pas des runes.* Trois réglages répondent à ça,
 * et chacun est mesurable :
 *   · PROPORTION — la largeur vaut 0.72 × la hauteur (porté du `.py`) : plus
 *     haute que large, comme une rune gravée. Un carré trapu devient un motif.
 *   · ÉPAISSEUR — `trait` vaut 0.09 × la hauteur par défaut, soit un trait FIN.
 *     Une barre épaisse mange le vide intérieur de la rune, et c'est le vide qui
 *     la fait reconnaître.
 *   · CONTRASTE — la couleur vient de `currentColor` et jamais d'un code écrit
 *     ici : le contexte décide, avec les jetons de `variables.css`.
 *
 * ⚠️ `vector-effect="non-scaling-stroke"` n'est PAS mis par principe. Il n'est
 * activé que par `traitFixe`, et seulement quand un parent met le SVG à
 * l'échelle (`max-width` sur un conteneur étroit) — sans ça, l'épaisseur
 * s'affine avec la taille, et c'est ce qu'on veut : une rune de 14 px a besoin
 * d'un trait relativement plus épais qu'une rune de 48 px.
 */
import { computed } from 'vue';
import { RATIO_LARGEUR, runeDe } from '../../data/runes.js';

const props = defineProps({
  /** La lettre de la rune ('F'), ou son nom ('Fehu'). */
  rune: { type: String, required: true },
  /** La hauteur, en pixels. La largeur en découle (0.72 × hauteur). */
  taille: { type: Number, default: 48 },
  /** L'épaisseur du trait : fraction de la hauteur, ou pixels si `traitFixe`. */
  trait: { type: Number, default: 0.09 },
  /** La couleur. `currentColor` par défaut — la rune prend la teinte du contexte. */
  couleur: { type: String, default: 'currentColor' },
  /** Fixe l'épaisseur en pixels (l'active `non-scaling-stroke`). Voir l'en-tête. */
  traitFixe: { type: Boolean, default: false },
  /**
   * Le mot ou le nom en clair, quand la rune PORTE du sens.
   * Vide (défaut) = décoration → `aria-hidden="true"`.
   */
  libelle: { type: String, default: '' },
});

const porteSens = computed(() => props.libelle.trim().length > 0);
const largeurPx = computed(() => Math.round(props.taille * RATIO_LARGEUR * 100) / 100);
const epaisseur = computed(() =>
  props.traitFixe ? props.trait * props.taille : props.trait
);

const traits = computed(() => {
  const rune = runeDe(props.rune);
  if (rune === null) {
    // Le refus est ici, au point de passage obligé : une référence inconnue ne
    // dessine pas « quelque chose », elle échoue en disant pourquoi.
    throw new Error(
      `RuneTrace : « ${props.rune} » ne correspond à aucune rune tracée. ` +
        "Attendu : une lettre du Futhark ancien ('F', 'A', 'R'…) ou un nom ('Fehu', 'Ansuz'…)."
    );
  }
  // x est remis dans la boîte 0.72 × 1 : on COMPOSE le tracé, on ne déforme pas
  // le rendu. `preserveAspectRatio="none"` aurait donné des traits plus épais en
  // y qu'en x sur les segments horizontaux — un trait irrégulier, jamais net.
  return rune.segments.map(([x1, y1, x2, y2]) => [
    x1 * RATIO_LARGEUR,
    y1,
    x2 * RATIO_LARGEUR,
    y2,
  ]);
});
</script>

<style scoped>
.rune-trace {
  display: block;
  /* Un trait arrondi déborde d'un demi-trait de la boîte : sans ceci, les
     extrémités seraient rognées sur les runes qui touchent le bord (Isa, Fehu). */
  overflow: visible;
  flex: none;
}
</style>
