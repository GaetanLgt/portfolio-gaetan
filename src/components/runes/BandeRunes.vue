<template>
  <span
    class="bande-runes"
    :class="{ 'bande-runes--encadree': encadre }"
    :style="styleConteneur"
    aria-hidden="true"
  >
    <template v-for="(bloc, i) in blocs" :key="i">
      <!-- Le séparateur : un point plein, discret. C'est la seule ponctuation
           ajoutée, et elle ne raconte rien de plus que « le motif continue ». -->
      <span
        v-if="i > 0 && separateur"
        class="bande-runes__point"
        :style="stylePoint"
      ></span>
      <MotEnRunes :mot="bloc" :taille="taille" :trait="trait" :ecart="ecart" />
    </template>
  </span>
</template>

<script setup>
/**
 * BandeRunes — la frise décorative : un bordé, un séparateur de section, un fond.
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * ⚠️ ELLE DOIT ÊTRE SOBRE, ET LA SOBRIÉTÉ EST ICI UNE CONTRAINTE MESURÉE.
 * La direction artistique du studio est écrite : « un site d'artisan qui vend des
 * sites web n'a pas à faire une démonstration graphique. » Une frise de runes qui
 * crie est une frise ratée. Trois conséquences, appliquées :
 *   · elle est DÉCORATIVE par construction — `aria-hidden="true"` est posé sur
 *     la frise entière, et rien n'y est annoncé ;
 *   · elle ne porte AUCUNE animation, aucun halo, aucun dégradé ;
 *   · l'opacité par défaut (0.6) et l'épaisseur par défaut (0.08) la mettent
 *     SOUS le texte en hiérarchie visuelle. Un bordé se remarque quand on le
 *     cherche, pas quand on lit.
 *
 * ⛔ AUCUNE IMAGE, AUCUNE POLICE, AUCUN FICHIER CHARGÉ : du SVG en ligne. La
 * frise ne coûte pas une seule requête, et c'est vérifiable dans le source.
 *
 * ⚠️ ELLE N'EST JAMAIS ÉTIRÉE. La largeur est intrinsèque (calculée sur le
 * nombre de runes), avec `max-width: 100%` pour ne pas déborder. Étirer un SVG
 * en largeur (`preserveAspectRatio="none"`, ou `width: 100%` sur un ratio
 * différent) épaissirait les traits verticaux et affinerait les horizontaux :
 * une frise aux traits inégaux. Le motif se répète, il ne s'étire pas.
 */
import { computed } from 'vue';
import MotEnRunes from './MotEnRunes.vue';
import { ECART_DEFAUT } from '../../data/runes.js';

const props = defineProps({
  /** Le motif répété. Défaut : MND, un des deux seuls mots du studio en runes. */
  mot: { type: String, default: 'MND' },
  /** Combien de fois le motif se répète. */
  repetitions: { type: Number, default: 6 },
  /** La hauteur des runes, en pixels. Sobre = petit. */
  taille: { type: Number, default: 16 },
  /** L'épaisseur du trait, en fraction de la hauteur. */
  trait: { type: Number, default: 0.08 },
  /** La couleur. `currentColor` par défaut. */
  couleur: { type: String, default: 'currentColor' },
  /** L'écart entre deux runes, en fraction de la hauteur. */
  ecart: { type: Number, default: ECART_DEFAUT },
  /** L'opacité de la frise. Au-dessus de 0.8, elle passe DEVANT le texte. */
  opacite: { type: Number, default: 0.6 },
  /** Deux filets fins au-dessus et au-dessous — pour un séparateur de section. */
  encadre: { type: Boolean, default: false },
  /** Le point entre deux motifs. */
  separateur: { type: Boolean, default: true },
});

const blocs = computed(() => Array.from({ length: Math.max(1, Math.round(props.repetitions)) }, () => props.mot));
const styleConteneur = computed(() => ({
  color: props.couleur,
  opacity: String(props.opacite),
  gap: `${props.taille * 0.9}px`,
}));
const stylePoint = computed(() => ({
  width: `${props.taille * 0.14}px`,
  height: `${props.taille * 0.14}px`,
}));
</script>

<style scoped>
.bande-runes {
  display: inline-flex;
  align-items: center;
  max-width: 100%;
  line-height: 0;
  gap: 0.9em;
  /* Le filet d'encadrement prend le jeton de trait du site : --rule habille, il
     ne délimite pas un contrôle. Aucun code couleur écrit ici. */
  --filet: var(--rule);
}

.bande-runes__point {
  display: inline-block;
  flex: none;
  border-radius: 50%;
  background: currentColor;
}

.bande-runes--encadree {
  padding: 0.9em 0;
  border-top: 1px solid var(--filet);
  border-bottom: 1px solid var(--filet);
}
</style>
