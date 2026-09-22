<script setup>
/**
 * ChampTexteManette.vue — UN CHAMP DE SAISIE QUI S'OUVRE AUSSI À LA MANETTE.
 *
 * Il rend : une étiquette liée, le champ, une aide, un message d'erreur, et le clavier
 * à l'écran (`ClavierManette.vue`).
 *
 * ⚠ QUAND LE CLAVIER S'OUVRE, ET QUAND IL NE S'OUVRE PAS. Il s'ouvre quand le focus a
 * été donné par la MANETTE (voir `origineFocus` dans `useManette.js`), et pas quand
 * quelqu'un clique dans le champ pour taper au clavier. Un clavier virtuel qui s'invite
 * à chaque clic souris est une gêne ; un clavier virtuel qui ne vient jamais rend fausse
 * la promesse « tout à la manette ». Le bouton « Clavier à l'écran » reste là pour
 * l'ouvrir à la demande, dans tous les cas.
 *
 * ⚠ LES MESSAGES D'ERREUR SONT LUS PAR LE LOGICIEL DE LECTURE D'ÉCRAN, pas seulement vus :
 * `aria-invalid` sur le champ, et `aria-describedby` qui pointe vers le texte d'aide et
 * vers le message d'erreur. Une erreur signalée par la seule couleur rouge n'existe pas
 * pour qui ne voit pas le rouge.
 */

import { computed, ref } from 'vue';
import ClavierManette from './ClavierManette.vue';
import { identifiantChamp } from './identifiants.js';
import { origineFocus } from './useManette.js';

const props = defineProps({
  etiquette: { type: String, required: true },
  modele: { type: String, default: '' },
  type: { type: String, default: 'text' },
  obligatoire: { type: Boolean, default: false },
  aide: { type: String, default: '' },
  erreur: { type: String, default: '' },
  autocomplete: { type: String, default: 'off' },
  exemple: { type: String, default: '' },
  /** Nom technique du champ, posé en `data-champ`. C'est ce qui permet au tunnel de
   *  remettre le focus sur LE PREMIER champ fautif après un envoi refusé — sans lui, on
   *  annoncerait « trois champs à corriger » en laissant le visiteur les chercher. */
  nom: { type: String, default: '' },
});

const emit = defineEmits(['maj']);

/** Identifiant unique, compté au niveau du module : voir `identifiants.js` pour
 *  pourquoi il n'est ni local au composant, ni aléatoire. */
const idChamp = identifiantChamp('champ');
const idAide = `${idChamp}-aide`;
const idErreur = `${idChamp}-erreur`;

const clavierOuvert = ref(false);
const champActif = ref(false);

/** Les identifiants réellement présents — on ne décrit pas un texte qui n'existe pas. */
const decritPar = computed(() => {
  const ids = [];
  if (props.aide) ids.push(idAide);
  if (props.erreur) ids.push(idErreur);
  return ids.length > 0 ? ids.join(' ') : undefined;
});

function surFocus() {
  champActif.value = true;
  if (origineFocus.value === 'manette') clavierOuvert.value = true;
}

function surPerteFocus(evenement) {
  champActif.value = false;
  // Le focus part ailleurs : on ferme le clavier, SAUF si le focus part vers une touche
  // du clavier lui-même (sinon le clavier se fermerait à la première touche touchée).
  const cible = evenement.relatedTarget;
  if (cible && cible.closest && cible.closest('.boreal-clavier')) return;
  clavierOuvert.value = false;
}
</script>

<template>
  <div class="boreal-champ" :class="{ 'boreal-champ--actif': champActif, 'boreal-champ--erreur': !!props.erreur }">
    <label class="boreal-champ__etiquette" :for="idChamp">
      {{ props.etiquette }}
      <span v-if="props.obligatoire" class="boreal-champ__requis">obligatoire</span>
    </label>

    <input
      :id="idChamp"
      class="boreal-champ__saisie"
      :type="props.type"
      :value="props.modele"
      :placeholder="props.exemple || undefined"
      :autocomplete="props.autocomplete"
      :data-champ="props.nom || undefined"
      :aria-required="props.obligatoire ? 'true' : undefined"
      :aria-invalid="props.erreur ? 'true' : undefined"
      :aria-describedby="decritPar"
      data-manette
      @input="emit('maj', $event.target.value)"
      @focus="surFocus"
      @blur="surPerteFocus"
    />

    <p v-if="props.aide" :id="idAide" class="boreal-mention">{{ props.aide }}</p>

    <p v-if="props.erreur" :id="idErreur" class="boreal-erreur">
      <span aria-hidden="true">⚠ </span>{{ props.erreur }}
    </p>

    <button
      type="button"
      class="boreal-bouton boreal-bouton--discret boreal-champ__clavier"
      data-manette
      :aria-expanded="clavierOuvert ? 'true' : 'false'"
      @click="clavierOuvert = !clavierOuvert"
    >
      {{ clavierOuvert ? 'Masquer le clavier à l\'écran' : 'Clavier à l\'écran' }}
    </button>

    <ClavierManette
      :ouvert="clavierOuvert"
      :valeur="props.modele"
      :etiquette="props.etiquette"
      @maj="(valeur) => emit('maj', valeur)"
      @fermer="clavierOuvert = false"
    />
  </div>
</template>
