<script setup>
/**
 * ClavierManette.vue — LE CLAVIER À L'ÉCRAN, ENTIÈREMENT FAIT DE BOUTONS.
 *
 * ⚠ POURQUOI IL EXISTE. La consigne est « zéro touche clavier nécessaire pour tout
 * faire ». Un tunnel de commande contient des champs de TEXTE LIBRE (nom, adresse,
 * courriel) : une manette n'écrit pas de lettres. Sans ce panneau, la promesse serait
 * fausse exactement là où elle compte le plus — au moment de commander.
 *
 * Disposition AZERTY : c'est une boutique française, écrite en français ; un clavier
 * QWERTY à l'écran serait un contresens.
 *
 * TROIS CHOIX QUI SE VOIENT :
 *   · ce n'est pas une `role="dialog"` modale. Rien n'est piégé : les touches restent des
 *     boutons ordinaires, donc utilisables au clavier comme à la souris. On ne réclame
 *     pas une modalité qu'on n'applique pas ;
 *   · la PORTÉE DU FOCUS est déclarée au stick pendant que le panneau est ouvert : le
 *     focus ne peut pas sortir du clavier par accident ;
 *   · la saisie se fait EN FIN DE CHAÎNE. Déplacer le curseur au milieu d'un texte
 *     demanderait un curseur navigable — ce n'est pas livré ici, et le taire serait
 *     mentir sur ce que la tranche sait faire.
 */

import { nextTick, onUnmounted, ref, watch } from 'vue';
import { definirPorteeFocus, enregistrerActionsManette } from './useManette.js';

const props = defineProps({
  ouvert: { type: Boolean, default: false },
  valeur: { type: String, default: '' },
  etiquette: { type: String, default: 'champ' },
});

const emit = defineEmits(['maj', 'fermer']);

const racine = ref(null);

/** Les rangées du clavier. L'ordre est celui d'un clavier AZERTY français. */
const RANGEES = [
  ['a', 'z', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['q', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'm'],
  ['w', 'x', 'c', 'v', 'b', 'n', "'", '-', '.'],
  ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
  ['é', 'è', 'ê', 'à', 'ç', 'ù', 'ô', 'î', 'û', '@'],
  ['_', '/', ',', ';', ':', '!', '?', '(', ')', ' '],
];

let retirerActions = null;

function fermer() {
  emit('fermer');
}

function ajouter(caractere) {
  emit('maj', props.valeur + caractere);
}

function effacerDernier() {
  emit('maj', props.valeur.slice(0, -1));
}

function viderLeChamp() {
  emit('maj', '');
}

function libelleTouche(caractere) {
  if (caractere === ' ') return 'espace';
  return caractere;
}

watch(
  () => props.ouvert,
  async (ouvert) => {
    if (ouvert) {
      // La portée : le stick reste dans le clavier tant qu'il est ouvert.
      await nextTick();
      definirPorteeFocus(racine.value);
      const premiere = racine.value ? racine.value.querySelector('[data-touche]') : null;
      if (premiere) premiere.focus();
      retirerActions = enregistrerActionsManette({
        // « A » n'est PAS déclaré ici, et c'est délibéré : sans gestionnaire, la manette
        // retombe sur son geste par défaut — activer l'élément qui a le focus — donc sur
        // la touche visée. Déclarer un « valider » vide ici avalerait l'appui et le
        // clavier ne saisirait plus rien. *Un gestionnaire qui ne fait rien est pire que
        // pas de gestionnaire : il intercepte.*
        retour: fermer,
      });
    } else {
      definirPorteeFocus(null);
      if (retirerActions) {
        retirerActions();
        retirerActions = null;
      }
    }
  },
);

onUnmounted(() => {
  definirPorteeFocus(null);
  if (retirerActions) {
    retirerActions();
    retirerActions = null;
  }
});
</script>

<template>
  <div
    v-if="props.ouvert"
    ref="racine"
    class="boreal-clavier"
    role="group"
    :aria-label="`Clavier à l'écran pour le champ : ${props.etiquette}`"
  >
    <p class="boreal-clavier__entete">
      <span>Clavier à l'écran — {{ props.etiquette }}</span>
      <span class="boreal-clavier__valeur" aria-live="polite">{{ props.valeur || 'vide' }}</span>
    </p>

    <div class="boreal-clavier__rangee" v-for="(rangee, index) in RANGEES" :key="`rangee-${index}`">
      <button
        v-for="caractere in rangee"
        :key="`${index}-${caractere}`"
        type="button"
        class="boreal-touche"
        data-manette
        data-touche
        :aria-label="`Insérer ${libelleTouche(caractere)}`"
        @click="ajouter(caractere)"
      >
        {{ caractere === ' ' ? 'espace' : caractere }}
      </button>
    </div>

    <div class="boreal-clavier__commandes">
      <button type="button" class="boreal-touche boreal-touche--large" data-manette @click="effacerDernier">
        Effacer
      </button>
      <button type="button" class="boreal-touche boreal-touche--large" data-manette @click="viderLeChamp">
        Vider
      </button>
      <button type="button" class="boreal-touche boreal-touche--large boreal-touche--valider" data-manette @click="fermer">
        Terminer
      </button>
    </div>

    <p class="boreal-mention">
      Manette : stick ou croix pour choisir, A pour insérer, B pour fermer. Les lettres
      s'ajoutent à la fin du texte.
    </p>
  </div>
</template>
