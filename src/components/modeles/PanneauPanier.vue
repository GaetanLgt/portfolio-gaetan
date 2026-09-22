<script setup>
/**
 * PanneauPanier.vue — LE PANIER : MODIFIER, RETIRER, VIDER, PASSER COMMANDE.
 *
 * Il lit et écrit l'état par `usePanier()` — jamais `localStorage` directement, jamais un
 * total recalculé à la main. *Un total écrit dans un composant est un total qui finira
 * par contredire celui du tunnel, et il n'y a alors plus de vérité.*
 *
 * DEUX PRÉCAUTIONS QUI SE VOIENT À L'ÉCRAN :
 *   · le VIDAGE demande confirmation (deux appuis). Un bouton qui détruit d'un seul
 *     appui, à côté du bouton de commande, finit par être touché par erreur ;
 *   · la persistance est ANNONCÉE quand elle échoue. Un panier qu'on croit gardé et
 *     qui n'est pas gardé est pire qu'un panier qu'on sait provisoire.
 */

import { computed, ref } from 'vue';
import { formaterPrix } from './donneesProduits.js';
import { QUANTITE_MAX, usePanier } from './usePanier.js';
import { useActionsManette } from './useManette.js';
import PictogrammeProduit from './PictogrammeProduit.vue';

const emit = defineEmits(['retour', 'commander']);

const {
  lignesDetaillees,
  nombreArticles,
  sousTotal,
  panierVide,
  francoAtteint,
  restePourFranco,
  seuilFranco,
  avertissement,
  dernierMessage,
  definirQuantite,
  retirer,
  vider,
} = usePanier();

/** Confirmation en deux temps pour le vidage — un état local, rien de plus. */
const vidageDemande = ref(false);

/** Le plafond de quantité d'une ligne = le stock réel du produit. */
function plafond(ligne) {
  return Math.min(QUANTITE_MAX, ligne.produit ? ligne.produit.stock : QUANTITE_MAX);
}

const montantRestant = computed(() => formaterPrix(restePourFranco.value));

/**
 * La manette dans le panier : les détentes règlent la quantité de la LIGNE SOUS LE FOCUS.
 * S'il n'y a pas de ligne au focus, on ne devine pas — on le dit.
 */
function ligneSousLeFocus() {
  const actif = document.activeElement;
  if (!actif || typeof actif.closest !== 'function') return null;
  const item = actif.closest('[data-ligne-produit]');
  if (!item) return null;
  return {
    idProduit: item.getAttribute('data-ligne-produit'),
    idVariante: item.getAttribute('data-ligne-variante'),
  };
}

function reglerQuantiteSousLeFocus(delta) {
  const cible = ligneSousLeFocus() || (lignesDetaillees.value[0]
    ? { idProduit: lignesDetaillees.value[0].idProduit, idVariante: lignesDetaillees.value[0].idVariante }
    : null);
  if (!cible) {
    dernierMessage.value = 'Le panier est vide : il n\'y a pas de quantité à régler.';
    return;
  }
  const ligne = lignesDetaillees.value.find(
    (l) => l.idProduit === cible.idProduit && l.idVariante === cible.idVariante,
  );
  if (!ligne) return;
  definirQuantite(ligne.idProduit, ligne.idVariante, ligne.quantite + delta);
}

useActionsManette({
  retour: () => emit('retour'),
  quantitePlus: () => reglerQuantiteSousLeFocus(1),
  quantiteMoins: () => reglerQuantiteSousLeFocus(-1),
  // ⚠ « A » N'EST PAS DÉCLARÉ ICI. Le déclarer pour « passer commande » ferait que
  // l'appui A n'activerait plus JAMAIS le bouton qui a le focus dans le panier : on ne
  // pourrait plus vider le panier, retirer une ligne, ni continuer ses achats à la
  // manette. Le bouton « Passer commande » reste activable à la manette — en le visant
  // au stick puis en appuyant sur A, comme tous les autres boutons de la page.
});
</script>

<template>
  <section class="boreal-section" aria-labelledby="titre-panier">
    <header class="boreal-section__entete">
      <h2 id="titre-panier" class="boreal-titre-2" tabindex="-1">Votre panier</h2>
      <p class="boreal-chapeau">
        Le panier est conservé par votre navigateur (stockage local) et n'est envoyé nulle
        part. C'est une démonstration : aucun paiement n'aura lieu.
      </p>
    </header>

    <p v-if="avertissement" class="boreal-avertissement" role="alert">{{ avertissement }}</p>

    <div v-if="panierVide" class="boreal-vide">
      <p>Le panier est vide.</p>
      <button type="button" class="boreal-bouton boreal-bouton--principal" data-manette @click="emit('retour')">
        Parcourir le catalogue
      </button>
    </div>

    <template v-else>
      <ul class="boreal-panier" aria-label="Articles du panier">
        <li
          v-for="ligne in lignesDetaillees"
          :key="`${ligne.idProduit}-${ligne.idVariante}`"
          class="boreal-panier__ligne"
          :data-ligne-produit="ligne.idProduit"
          :data-ligne-variante="ligne.idVariante"
        >
          <div class="boreal-panier__visuel">
            <PictogrammeProduit :forme="ligne.produit.forme" :titre="`Dessin : ${ligne.produit.nom}`" />
          </div>

          <div class="boreal-panier__identite">
            <p class="boreal-panier__nom">{{ ligne.produit.nom }}</p>
            <p class="boreal-panier__variante">{{ ligne.variante.libelle }}</p>
            <p class="boreal-panier__unite">{{ formaterPrix(ligne.prixUnitaire) }} l'unité</p>
          </div>

          <div class="boreal-panier__quantite">
            <p :id="`etiquette-qte-${ligne.idProduit}-${ligne.idVariante}`" class="sr-only">
              Quantité de {{ ligne.produit.nom }} — {{ ligne.variante.libelle }}
            </p>
            <div
              class="boreal-quantite__commande"
              role="group"
              :aria-labelledby="`etiquette-qte-${ligne.idProduit}-${ligne.idVariante}`"
            >
              <button
                type="button"
                class="boreal-bouton boreal-bouton--rond"
                data-manette
                :aria-label="`Diminuer la quantité de ${ligne.produit.nom} (${ligne.variante.libelle})`"
                :disabled="ligne.quantite <= 1"
                @click="definirQuantite(ligne.idProduit, ligne.idVariante, ligne.quantite - 1)"
              >
                −
              </button>
              <output class="boreal-quantite__valeur">{{ ligne.quantite }}</output>
              <button
                type="button"
                class="boreal-bouton boreal-bouton--rond"
                data-manette
                :aria-label="`Augmenter la quantité de ${ligne.produit.nom} (${ligne.variante.libelle})`"
                :disabled="ligne.quantite >= plafond(ligne)"
                @click="definirQuantite(ligne.idProduit, ligne.idVariante, ligne.quantite + 1)"
              >
                +
              </button>
            </div>
          </div>

          <p class="boreal-panier__total">{{ formaterPrix(ligne.totalLigne) }}</p>

          <button
            type="button"
            class="boreal-bouton boreal-bouton--retrait"
            data-manette
            :aria-label="`Retirer ${ligne.produit.nom} (${ligne.variante.libelle}) du panier`"
            @click="retirer(ligne.idProduit, ligne.idVariante)"
          >
            Retirer
          </button>
        </li>
      </ul>

      <div class="boreal-recap">
        <dl class="boreal-recap__lignes">
          <dt>Articles</dt>
          <dd>{{ nombreArticles }}</dd>
          <dt>Sous-total</dt>
          <dd>{{ formaterPrix(sousTotal) }}</dd>
          <dt>Frais de port</dt>
          <dd>{{ francoAtteint ? 'Offerts' : 'Calculés à l\'étape suivante' }}</dd>
        </dl>

        <p class="boreal-recap__total">
          <span>Total des articles</span>
          <strong>{{ formaterPrix(sousTotal) }}</strong>
        </p>

        <p class="boreal-mention">
          <template v-if="francoAtteint">
            Franco de port atteint (seuil {{ formaterPrix(seuilFranco) }}) : la livraison
            standard ne sera pas facturée.
          </template>
          <template v-else>
            Encore {{ montantRestant }} pour atteindre le franco de port
            ({{ formaterPrix(seuilFranco) }}).
          </template>
        </p>

        <div class="boreal-recap__actions">
          <button type="button" class="boreal-bouton boreal-bouton--action" data-manette @click="emit('commander')">
            Passer commande
          </button>
          <button type="button" class="boreal-bouton boreal-bouton--discret" data-manette @click="emit('retour')">
            Continuer mes achats
          </button>

          <template v-if="!vidageDemande">
            <button
              type="button"
              class="boreal-bouton boreal-bouton--retrait"
              data-manette
              @click="vidageDemande = true"
            >
              Vider le panier
            </button>
          </template>
          <template v-else>
            <button
              type="button"
              class="boreal-bouton boreal-bouton--retrait boreal-bouton--insistant"
              data-manette
              @click="vider(); vidageDemande = false"
            >
              Confirmer : vider définitivement
            </button>
            <button
              type="button"
              class="boreal-bouton boreal-bouton--discret"
              data-manette
              @click="vidageDemande = false"
            >
              Annuler
            </button>
          </template>
        </div>
      </div>
    </template>

    <p class="boreal-mention" role="status">{{ dernierMessage }}</p>
  </section>
</template>
