<script setup>
/**
 * GrilleProduits.vue — LA GRILLE, SON FILTRE ET SON TRI.
 *
 * ⚠ DEUX CHOIX D'INTERFACE QUI SONT DES CHOIX D'ACCESSIBILITÉ, PAS DE STYLE :
 *
 * 1. LE TRI N'EST PAS UN `<select>`. Un select natif ne s'ouvre pas à la manette : il
 *    faudrait des flèches de clavier, et la consigne « zéro touche clavier nécessaire »
 *    tomberait. Le tri est donc un GROUPE DE BOUTONS à état (`aria-pressed`), qui se
 *    parcourt au stick comme le reste de la page.
 * 2. LE FILTRE EST ANNONCÉ. Un filtre qui change la liste sans rien dire laisse un
 *    lecteur d'écran devant une page qui a bougé toute seule : le compte de résultats
 *    vit dans une zone `role="status"`, donc il est dit à voix haute.
 *
 * Le tri et le filtre passent par les RÈGLES de `reglesCatalogue.js` : aucun composant
 * ne réécrit un comparateur, et `trierProduits` travaille sur une copie — trier le
 * tableau du catalogue en place changerait l'ordre partout ailleurs.
 */

import { computed, ref } from 'vue';
import {
  CRITERES_TRI,
  categories,
  filtrerParCategorie,
  produits,
  trierProduits,
  trouverProduit,
} from './donneesProduits.js';
import { useActionsManette } from './useManette.js';
import CarteProduit from './CarteProduit.vue';

const emit = defineEmits(['ajouter-direct']);

const categorieActive = ref('toutes');
const critereActif = ref(CRITERES_TRI[0].id);

const listeAffichee = computed(() =>
  trierProduits(filtrerParCategorie(produits, categorieActive.value, categories), critereActif.value),
);

const libelleCategorie = computed(() => {
  if (categorieActive.value === 'toutes') return 'toutes catégories';
  const trouvee = categories.find((c) => c.id === categorieActive.value);
  return trouvee ? trouvee.libelle : categorieActive.value;
});

const libelleTri = computed(
  () => (CRITERES_TRI.find((c) => c.id === critereActif.value) || CRITERES_TRI[0]).libelle,
);

/** Le compte de résultats, en toutes lettres — c'est ce que la zone `role="status"` dit. */
const annonce = computed(() => {
  const n = listeAffichee.value.length;
  return `${n} produit${n > 1 ? 's' : ''} affiché${n > 1 ? 's' : ''} — ${libelleCategorie.value}, tri : ${libelleTri.value}.`;
});

function choisirCategorie(id) {
  categorieActive.value = id;
}

function choisirTri(id) {
  critereActif.value = id;
}

function reinitialiser() {
  categorieActive.value = 'toutes';
  critereActif.value = CRITERES_TRI[0].id;
}

/**
 * LA MANETTE, DANS LA GRILLE. « X » fait exactement ce que fait le bouton « Ajouter »
 * de la carte qui a le focus — pas autre chose. *Une manette qui invente un geste que
 * l'écran ne montre pas est une manette qu'on n'apprend pas.*
 *
 * S'il n'y a pas de carte sous le focus (première pression, curseur sur un filtre), on
 * ne devine pas : on ajoute le premier produit affiché, et l'annonce dit lequel.
 */
useActionsManette({
  ajouter() {
    const actif = document.activeElement;
    const carte = actif && typeof actif.closest === 'function' ? actif.closest('[data-produit]') : null;
    const id = carte ? carte.getAttribute('data-produit') : (listeAffichee.value[0] || {}).id;
    const produit = id ? trouverProduit(id) : null;
    if (!produit) return;
    if (produit.stock <= 0) {
      emit('ajouter-direct', { idProduit: produit.id, idVariante: null });
      return;
    }
    emit('ajouter-direct', {
      idProduit: produit.id,
      idVariante: produit.variantes[0].id,
      origine: 'manette-carte',
    });
  },
});
</script>

<template>
  <section class="boreal-section" aria-labelledby="titre-catalogue">
    <header class="boreal-section__entete">
      <h2 id="titre-catalogue" class="boreal-titre-2">Le catalogue</h2>
      <p class="boreal-chapeau">
        {{ produits.length }} objets de démonstration,
        {{ categories.length }} catégories. Le filtre et le tri sont des boutons : ils se
        parcourent au clavier comme à la manette.
      </p>
    </header>

    <div class="boreal-filtres">
      <div class="boreal-filtres__groupe">
        <h3 id="etiquette-categories" class="boreal-surtitre">Catégorie</h3>
        <div class="boreal-filtres__boutons" role="group" aria-labelledby="etiquette-categories">
          <button
            type="button"
            class="boreal-jeton"
            data-manette
            :aria-pressed="categorieActive === 'toutes'"
            @click="choisirCategorie('toutes')"
          >
            Toutes
          </button>
          <button
            v-for="categorie in categories"
            :key="categorie.id"
            type="button"
            class="boreal-jeton"
            data-manette
            :aria-pressed="categorieActive === categorie.id"
            @click="choisirCategorie(categorie.id)"
          >
            {{ categorie.libelle }}
          </button>
        </div>
      </div>

      <div class="boreal-filtres__groupe">
        <h3 id="etiquette-tris" class="boreal-surtitre">Trier par</h3>
        <div class="boreal-filtres__boutons" role="group" aria-labelledby="etiquette-tris">
          <button
            v-for="critere in CRITERES_TRI"
            :key="critere.id"
            type="button"
            class="boreal-jeton"
            data-manette
            :aria-pressed="critereActif === critere.id"
            @click="choisirTri(critere.id)"
          >
            {{ critere.libelle }}
          </button>
        </div>
      </div>
    </div>

    <p class="boreal-compte" role="status">{{ annonce }}</p>

    <ul v-if="listeAffichee.length > 0" class="boreal-grille-produits">
      <li v-for="produit in listeAffichee" :key="produit.id" class="boreal-grille-produits__item">
        <CarteProduit
          :produit="produit"
          @ajouter-direct="(charge) => emit('ajouter-direct', charge)"
        />
      </li>
    </ul>

    <div v-else class="boreal-vide">
      <p>Aucun produit dans cette catégorie.</p>
      <button type="button" class="boreal-bouton boreal-bouton--principal" data-manette @click="reinitialiser">
        Revenir à toutes les catégories
      </button>
    </div>
  </section>
</template>
