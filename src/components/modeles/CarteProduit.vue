<script setup>
/**
 * CarteProduit.vue — UN PRODUIT DANS LA GRILLE.
 *
 * Deux gestes seulement : OUVRIR la fiche, et AJOUTER au panier.
 * L'ajout direct prend la PREMIÈRE variante du produit, et il le DIT dans l'annonce
 * vocale : *un choix fait à la place du visiteur doit au moins être annoncé.*
 *
 * Les deux boutons portent `data-manette` : c'est le repère que la navigation spatiale
 * de la manette utilise, et il n'a aucun effet sur le rendu ni sur le clavier.
 */

import { computed } from 'vue';
import { formaterPrix, trouverCategorie } from './donneesProduits.js';
import PictogrammeProduit from './PictogrammeProduit.vue';

const props = defineProps({
  produit: { type: Object, required: true },
});

const emit = defineEmits(['ouvrir-fiche', 'ajouter-direct']);

const categorie = computed(() => trouverCategorie(props.produit.categorie));
const enRupture = computed(() => props.produit.stock <= 0);
const varianteParDefaut = computed(() => props.produit.variantes[0]);
const prixAffiche = computed(() =>
  formaterPrix(props.produit.prix + varianteParDefaut.value.supplement),
);
/** Le nombre de variantes est COMPTÉ, jamais écrit à la main dans le libellé. */
const nombreVariantes = computed(() => props.produit.variantes.length);
</script>

<template>
  <article class="boreal-carte" :data-produit="produit.id">
    <div class="boreal-carte__visuel">
      <PictogrammeProduit :forme="produit.forme" :titre="`Dessin : ${produit.nom}`" />
    </div>

    <p class="boreal-carte__categorie">
      {{ categorie ? categorie.libelle : produit.categorie }}
    </p>

    <h3 class="boreal-carte__nom">{{ produit.nom }}</h3>
    <p class="boreal-carte__resume">{{ produit.resume }}</p>

    <p class="boreal-carte__prix">
      <span class="boreal-carte__montant">{{ prixAffiche }}</span>
      <span class="boreal-carte__mention">à partir de</span>
    </p>

    <p class="boreal-carte__variantes">
      {{ nombreVariantes }} variante<template v-if="nombreVariantes > 1">s</template>
    </p>

    <p v-if="enRupture" class="boreal-etiquette boreal-etiquette--rupture">
      Rupture de démonstration — réapprovisionnement annoncé
    </p>

    <div class="boreal-carte__actions">
      <button
        type="button"
        class="boreal-bouton boreal-bouton--principal"
        data-manette
        :aria-label="`Voir la fiche de ${produit.nom}`"
        @click="emit('ouvrir-fiche', produit.id)"
      >
        Voir la fiche
      </button>

      <button
        type="button"
        class="boreal-bouton boreal-bouton--discret"
        data-manette
        :disabled="enRupture"
        :aria-label="enRupture
          ? `${produit.nom} est en rupture, ajout impossible`
          : `Ajouter ${produit.nom} au panier, variante ${varianteParDefaut.libelle}`"
        @click="emit('ajouter-direct', { idProduit: produit.id, idVariante: varianteParDefaut.id })"
      >
        {{ enRupture ? 'Indisponible' : 'Ajouter' }}
      </button>
    </div>
  </article>
</template>
