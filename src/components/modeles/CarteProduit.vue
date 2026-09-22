<script setup>
/**
 * CarteProduit.vue — UN PRODUIT DANS LA GRILLE.
 *
 * Deux gestes seulement : OUVRIR la fiche, et AJOUTER au panier.
 * L'ajout direct prend la PREMIÈRE variante du produit, et il le DIT dans l'annonce
 * vocale : *un choix fait à la place du visiteur doit au moins être annoncé.*
 *
 * ⚠ « VOIR LA FICHE » EST UN LIEN, PAS UN BOUTON — et ce n'est pas cosmétique.
 * Un `<RouterLink>` produit une VRAIE adresse (`/modeles/boutique-boreal/produit/<id>`)
 * que l'on peut copier dans un message, ouvrir dans un nouvel onglet, ou suivre par un
 * moteur de recherche. Un bouton qui appelle `router.push` ne donne rien de tout ça : le
 * clic droit n'a pas de « copier l'adresse », et un robot ne le suit pas.
 * L'AJOUT AU PANIER, lui, reste un bouton : ce n'est pas une navigation, ça n'a pas
 * d'adresse, et ça ne doit pas en avoir.
 *
 * Les deux repères `data-manette` servent à la navigation spatiale de la manette ; ils
 * n'ont aucun effet sur le rendu ni sur le clavier.
 */

import { computed } from 'vue';
import { formaterPrix, trouverCategorie } from './donneesProduits.js';
import { nomDe } from '@/views/modeles/modeles-adresses.js';
import PictogrammeProduit from './PictogrammeProduit.vue';

const props = defineProps({
  produit: { type: Object, required: true },
});

const emit = defineEmits(['ajouter-direct']);

/** Le nom de la route de la fiche, LU dans la source unique des adresses : ce nom est
 *  aussi celui que le routeur enregistre, et il ne peut donc pas diverger. */
const routeFiche = nomDe('fiche');

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
      <RouterLink
        class="boreal-bouton boreal-bouton--principal"
        data-manette
        :to="{ name: routeFiche, params: { id: produit.id } }"
        :aria-label="`Voir la fiche de ${produit.nom}`"
      >
        Voir la fiche
      </RouterLink>

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
