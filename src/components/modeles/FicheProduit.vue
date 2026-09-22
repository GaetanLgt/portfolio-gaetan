<script setup>
/**
 * FicheProduit.vue — LA FICHE : DÉTAIL, VARIANTES, QUANTITÉ, AJOUT AU PANIER.
 *
 * Trois points qui ne sont pas des détails :
 *
 * 1. LE PRIX AFFICHÉ EST CELUI DE LA VARIANTE CHOISIE. Il est recalculé à chaque
 *    changement par `prixUnitaire()` — la règle vit dans `reglesCatalogue.js`, elle
 *    n'est pas recopiée ici. Un supplément codé en dur dans un template est un prix
 *    qui se désynchronise du catalogue au premier changement.
 *
 * 2. LA QUANTITÉ N'EST PAS UN `<input type="number">`. Un champ numérique se remplit
 *    au clavier, et un pouce de manette n'écrit pas de chiffres. Ici : deux boutons et
 *    une valeur affichée, bornée par le stock réel du catalogue.
 *
 * 3. LA RUPTURE SE VOIT. Le bouton est désactivé ET l'état est écrit en toutes lettres :
 *    un bouton grisé sans explication est un bouton qu'on croit cassé.
 */

import { computed, ref } from 'vue';
import {
  formaterPrix,
  prixUnitaire,
  trouverCategorie,
  trouverProduit,
  trouverVariante,
} from './donneesProduits.js';
import { QUANTITE_MAX, usePanier } from './usePanier.js';
import { useActionsManette } from './useManette.js';
import PictogrammeProduit from './PictogrammeProduit.vue';

const props = defineProps({
  idProduit: { type: String, required: true },
});

const emit = defineEmits(['retour', 'aller-au-panier']);

const { ajouter } = usePanier();

const produit = computed(() => trouverProduit(props.idProduit));
const categorie = computed(() => (produit.value ? trouverCategorie(produit.value.categorie) : null));

/** La variante choisie, initialisée sur la première du catalogue. */
const idVariante = ref(produit.value ? produit.value.variantes[0].id : '');

const variante = computed(() =>
  produit.value ? trouverVariante(produit.value, idVariante.value) : null,
);

const rupture = computed(() => !!produit.value && produit.value.stock <= 0);

/** La borne haute de quantité : le stock réel, jamais un plafond inventé. */
const quantiteMaximale = computed(() =>
  produit.value ? Math.min(QUANTITE_MAX, produit.value.stock) : 1,
);

const quantite = ref(1);

const prixUnitaireActuel = computed(() =>
  produit.value ? prixUnitaire(produit.value, idVariante.value) : 0,
);

const totalFiche = computed(() => prixUnitaireActuel.value * quantite.value);

const ajoutPossible = computed(() => !!produit.value && !rupture.value && !!variante.value);

/** Message local annoncé à voix haute après un ajout depuis la fiche. */
const messageAjout = ref('');

function changerQuantite(delta) {
  const suivante = quantite.value + delta;
  quantite.value = Math.max(1, Math.min(suivante, quantiteMaximale.value));
}

function ajouterAuPanier() {
  if (!ajoutPossible.value) {
    messageAjout.value = rupture.value
      ? `${produit.value.nom} est en rupture : rien n'a été ajouté.`
      : 'Choisissez d\'abord une variante.';
    return;
  }
  const fait = ajouter(produit.value, idVariante.value, quantite.value);
  messageAjout.value = fait
    ? `${quantite.value} × ${produit.value.nom} (${variante.value.libelle}) ajouté au panier.`
    : `${produit.value.nom} : le panier est déjà au maximum disponible pour ce produit.`;
}

/** La manette sur la fiche : ajouter, régler la quantité, revenir. */
useActionsManette({
  ajouter: ajouterAuPanier,
  quantitePlus: () => changerQuantite(1),
  quantiteMoins: () => changerQuantite(-1),
  retour: () => emit('retour'),
  panier: () => emit('aller-au-panier'),
});
</script>

<template>
  <section class="boreal-section" aria-labelledby="titre-fiche">
    <div v-if="!produit" class="boreal-vide">
      <h2 id="titre-fiche" class="boreal-titre-2">Ce produit n'existe pas</h2>
      <p>
        L'identifiant « {{ props.idProduit }} » ne figure pas au catalogue. C'est le cas
        normal d'un lien profond périmé : la page le dit au lieu de rester blanche.
      </p>
      <button type="button" class="boreal-bouton boreal-bouton--principal" data-manette @click="emit('retour')">
        Revenir au catalogue
      </button>
    </div>

    <template v-else>
      <button type="button" class="boreal-retour" data-manette @click="emit('retour')">
        ← Retour au catalogue
      </button>

      <div class="boreal-fiche">
        <div class="boreal-fiche__visuel">
          <PictogrammeProduit :forme="produit.forme" :titre="`Dessin : ${produit.nom}`" />
        </div>

        <div class="boreal-fiche__corps">
          <p class="boreal-etiquette">{{ categorie ? categorie.libelle : produit.categorie }}</p>
          <h2 id="titre-fiche" class="boreal-titre-2" tabindex="-1">{{ produit.nom }}</h2>

          <p class="boreal-fiche__prix">
            <span class="boreal-fiche__montant">{{ formaterPrix(prixUnitaireActuel) }}</span>
            <span class="boreal-fiche__unite">l'unité</span>
          </p>

          <p class="boreal-fiche__resume">{{ produit.resume }}</p>

          <p class="boreal-fiche__description">{{ produit.description }}</p>

          <dl class="boreal-fiche__details">
            <dt>Matière</dt>
            <dd>{{ produit.matiere }}</dd>
            <dt>Disponibilité</dt>
            <dd>
              <template v-if="rupture">En rupture — réapprovisionnement annoncé</template>
              <template v-else>{{ produit.stock }} pièce(s) en stock</template>
            </dd>
            <dt>Référence</dt>
            <dd><code>{{ produit.id }}</code></dd>
          </dl>

          <fieldset class="boreal-choice">
            <legend>Variante</legend>
            <div class="boreal-choice__options">
              <label
                v-for="option in produit.variantes"
                :key="option.id"
                class="boreal-choice__option"
                :class="{ 'boreal-choice__option--active': option.id === idVariante }"
              >
                <input
                  type="radio"
                  :name="`variante-${produit.id}`"
                  :value="option.id"
                  :checked="option.id === idVariante"
                  @change="idVariante = option.id"
                />
                <span class="boreal-choice__libelle">{{ option.libelle }}</span>
                <span class="boreal-choice__prix">
                  {{ option.supplement === 0
                    ? 'sans supplément'
                    : `${option.supplement > 0 ? '+' : '−'}${formaterPrix(Math.abs(option.supplement))}` }}
                </span>
              </label>
            </div>
          </fieldset>

          <div class="boreal-quantite">
            <p id="etiquette-quantite" class="boreal-surtitre">Quantité</p>
            <div class="boreal-quantite__commande" role="group" aria-labelledby="etiquette-quantite">
              <button
                type="button"
                class="boreal-bouton boreal-bouton--rond"
                data-manette
                aria-label="Diminuer la quantité d'une unité"
                :disabled="quantite <= 1 || rupture"
                @click="changerQuantite(-1)"
              >
                −
              </button>
              <output class="boreal-quantite__valeur" for="etiquette-quantite">{{ quantite }}</output>
              <button
                type="button"
                class="boreal-bouton boreal-bouton--rond"
                data-manette
                aria-label="Augmenter la quantité d'une unité"
                :disabled="quantite >= quantiteMaximale || rupture"
                @click="changerQuantite(1)"
              >
                +
              </button>
            </div>
            <p class="boreal-mention">
              Plafond : {{ quantiteMaximale }} — c'est le stock de démonstration de ce produit.
            </p>
          </div>

          <div class="boreal-fiche__actions">
            <button
              type="button"
              class="boreal-bouton boreal-bouton--action"
              data-manette
              :disabled="!ajoutPossible"
              @click="ajouterAuPanier"
            >
              {{ rupture ? 'Produit indisponible' : `Ajouter au panier — ${formaterPrix(totalFiche)}` }}
            </button>

            <button
              type="button"
              class="boreal-bouton boreal-bouton--discret"
              data-manette
              @click="emit('aller-au-panier')"
            >
              Voir le panier
            </button>
          </div>

          <p class="boreal-mention" role="status">{{ messageAjout }}</p>
        </div>
      </div>
    </template>
  </section>
</template>
