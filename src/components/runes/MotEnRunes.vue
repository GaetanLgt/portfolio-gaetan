<template>
  <span
    class="mot-en-runes"
    :style="styleConteneur"
    :role="porteSens ? 'img' : undefined"
    :aria-label="porteSens ? `${libelle || mot} en runes du Futhark ancien` : undefined"
    :aria-hidden="porteSens ? undefined : 'true'"
  >
    <template v-for="(rune, i) in runes" :key="i">
      <!-- La césure n'est pas une lettre : c'est un blanc dans la gravure.
           Comportement porté du `.py`, qui rend `None` pour un espace. -->
      <span
        v-if="rune === null"
        class="mot-en-runes__cesure"
        :style="{ width: cesurePx }"
        aria-hidden="true"
      ></span>
      <RuneTrace
        v-else
        :rune="rune.lettre"
        :taille="taille"
        :trait="trait"
        :trait-fixe="traitFixe"
      />
    </template>
  </span>
</template>

<script setup>
/**
 * MotEnRunes — un mot gravé, rune après rune.
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * ⛔ IL LÈVE UNE ERREUR CLAIRE SI UNE LETTRE N'A PAS DE RUNE.
 * C'est porté de `runes_pour()` du `.py`, qui fait un `raise ValueError` — même
 * règle, même raison : **un mot à moitié gravé qui passe en silence est un
 * défaut.** « ARKADIA » sans son D serait un mot faux présenté comme juste.
 * L'erreur vient de `runesPour()` (`src/data/runes.js`), qui nomme la lettre
 * fautive ET rappelle les runes disponibles.
 *
 * ZÉRO REQUÊTE : les runes sont des `<line>` en SVG. Aucune police, aucun
 * fichier, aucune image — vérifiable : il n'y a ni `@font-face`, ni `url()`,
 * ni `<img>` dans ce dossier.
 *
 * ACCESSIBILITÉ — `libelle` décide, et c'est un choix, pas un défaut :
 *   · vide (défaut) → décoration : `aria-hidden="true"`, rien n'est annoncé ;
 *   · renseigné → le mot PORTE du sens : `role="img"` + `aria-label` qui le
 *     donne EN CLAIR, parce qu'un lecteur d'écran ne lit pas des runes.
 */
import { computed } from 'vue';
import RuneTrace from './RuneTrace.vue';
import { LARGEUR_CESURE, ECART_DEFAUT, runesPour } from '../../data/runes.js';

const props = defineProps({
  /** Le mot à graver. Les espaces sont des césures. */
  mot: { type: String, required: true },
  /** La hauteur des runes, en pixels. */
  taille: { type: Number, default: 48 },
  /** L'épaisseur du trait : fraction de la hauteur. */
  trait: { type: Number, default: 0.09 },
  /** La couleur. `currentColor` par défaut. */
  couleur: { type: String, default: 'currentColor' },
  /** L'écart entre deux runes, en fraction de la hauteur (porté du `.py`). */
  ecart: { type: Number, default: ECART_DEFAUT },
  /** Voir RuneTrace : fige l'épaisseur en pixels. */
  traitFixe: { type: Boolean, default: false },
  /** Le mot en clair, si le mot porté doit être ANNONCÉ. Vide = décoration. */
  libelle: { type: String, default: '' },
});

const porteSens = computed(() => props.libelle.trim().length > 0);
const runes = computed(() => runesPour(props.mot));
const ecartPx = computed(() => `${props.ecart * props.taille}px`);
const cesurePx = computed(() => `${LARGEUR_CESURE * props.taille}px`);
const styleConteneur = computed(() => ({
  gap: ecartPx.value,
  color: props.couleur,
}));
</script>

<style scoped>
.mot-en-runes {
  display: inline-flex;
  /* Les runes ont toutes la même hauteur : l'alignement haut les met d'aplomb
     les unes par rapport aux autres, quels que soient leurs débords (un trait
     arrondi dépasse d'un demi-trait en haut et en bas). */
  align-items: flex-start;
  line-height: 0;
  vertical-align: middle;
}

.mot-en-runes__cesure {
  display: inline-block;
  height: 1em;
  flex: none;
}
</style>
