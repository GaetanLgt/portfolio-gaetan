<script setup>
/**
 * VitrineModele.vue — LA PAGE QUI VEND LE MODÈLE, PAS LA BOUTIQUE.
 *
 * C'est la première marche de la tranche : dire ce qu'est ce modèle, ce qu'il contient,
 * et à quelles conditions il est vendable. Elle utilise donc le CATALOGUE RÉEL comme
 * argument — les nombres affichés ici sont COMPTÉS à partir des données, jamais écrits
 * à la main. *Un chiffre écrit à la main devient faux sans le dire : le jour où un
 * quatorzième produit entre au catalogue, « treize » continue de s'afficher, et il ment.*
 *
 * ⚠ ET ELLE NE PROMET RIEN DE PLUS QUE CE QUI EST LIVRÉ. Chaque ligne de « ce que le
 * modèle contient » décrit un comportement qui existe dans les fichiers de la tranche.
 * La liste des manques est dans le rapport de livraison, pas ici : une vitrine qui
 * annonce ce qu'elle ne fait pas encore est une vitrine qui vend une promesse.
 */

import { computed } from 'vue';
import { CRITERES_TRI, categories, livraisons, produits } from './donneesProduits.js';

const emit = defineEmits(['entrer', 'voir-catalogue']);

/** Les nombres de la vitrine : comptés depuis les données, au rendu. */
const compteProduits = computed(() => produits.length);
const compteCategories = computed(() => categories.length);
const compteLivraisons = computed(() => livraisons.length);
const compteTris = computed(() => CRITERES_TRI.length);

const contenu = computed(() => [
  {
    titre: 'Les données sont dehors, les règles sont dedans',
    detail:
      `${compteProduits.value} objets, ${compteCategories.value} catégories, ` +
      `${compteLivraisons.value} modes de livraison, ${compteTris.value} critères de tri : ` +
      'tout vit dans un fichier JSON à part. L\'application REFUSE un catalogue incohérent ' +
      'au lieu de l\'afficher, et un banc d\'essai le prouve en rouvrant les défauts exprès.',
  },
  {
    titre: 'Grille filtrable et triable',
    detail:
      'Filtre par catégorie, tri par nom ou par prix, compte de résultats annoncé à voix ' +
      'haute. Le tri est un groupe de boutons et non une liste déroulante : il se parcourt ' +
      'à la manette comme au clavier.',
  },
  {
    titre: 'Fiche produit complète',
    detail:
      'Variantes avec supplément de prix recalculé, quantité bornée par le stock réel, ' +
      'état de rupture écrit en toutes lettres, ajout au panier.',
  },
  {
    titre: 'Panier persistant',
    detail:
      'Conservé par le navigateur, modifiable ligne à ligne, seuil de franco de port ' +
      'calculé, vidage en deux temps avec confirmation.',
  },
  {
    titre: 'Tunnel de commande simulé',
    detail:
      'Coordonnées, livraison, récapitulatif figé au moment de la validation, confirmation. ' +
      'Aucun paiement, aucun envoi réseau — et c\'est écrit à l\'écran, pas seulement ici.',
  },
  {
    titre: 'Manette et clavier, de bout en bout',
    detail:
      'Navigation spatiale au stick et à la croix directionnelle, boutons A et B, gâchettes ' +
      'pour les étapes et les quantités, et un clavier à l\'écran pour les champs de texte : ' +
      'aucune touche de clavier n\'est nécessaire pour aller au bout.',
  },
  {
    titre: 'Aucune ressource externe',
    detail:
      'Pas d\'image bitmap, pas de police téléchargée, pas de CDN, aucune bibliothèque en ' +
      'plus : les visuels sont des tracés SVG écrits à la main, et les couleurs viennent ' +
      'des jetons déjà présents dans la feuille de styles du studio.',
  },
]);

const etapesParcours = [
  'Vitrine — ce que le modèle est',
  'Catalogue — filtrer, trier',
  'Fiche — choisir une variante et la quantité',
  'Panier — modifier, retirer, commander',
  'Commande — coordonnées, livraison, récapitulatif',
];
</script>

<template>
  <!-- ⚠ CETTE SECTION N'A PLUS DE `h1`, ET C'EST VOULU : le titre de la page vit dans
       l'en-tête de `ModeleBorealBoutique.vue`, où il reste affiché à toutes les étapes.
       L'audit axe a montré ce qui se passait sinon — « page-has-heading-one » sur les
       quatre autres marches. La vitrine commence donc à `h2`, comme toute section. -->
  <section class="boreal-vitrine" aria-labelledby="titre-contenu">
    <div class="boreal-vitrine__actions">
      <button type="button" class="boreal-bouton boreal-bouton--action" data-manette @click="emit('entrer')">
        Entrer dans la boutique
      </button>
      <button type="button" class="boreal-bouton boreal-bouton--discret" data-manette @click="emit('voir-catalogue')">
        Aller droit au catalogue
      </button>
    </div>

    <h2 id="titre-contenu" class="boreal-titre-2">Ce que le modèle contient</h2>
    <ul class="boreal-contenu" aria-labelledby="titre-contenu">
      <li v-for="element in contenu" :key="element.titre" class="boreal-contenu__item">
        <h3 class="boreal-contenu__titre">{{ element.titre }}</h3>
        <p class="boreal-contenu__detail">{{ element.detail }}</p>
      </li>
    </ul>

    <h2 id="titre-parcours" class="boreal-titre-2">Le parcours, dans l'ordre</h2>
    <ol class="boreal-parcours" aria-labelledby="titre-parcours">
      <li v-for="(etape, index) in etapesParcours" :key="etape" class="boreal-parcours__item">
        <span class="boreal-parcours__rang" aria-hidden="true">{{ index + 1 }}</span>
        <span>{{ etape }}</span>
      </li>
    </ol>

    <p class="boreal-avertissement">
      <strong>Données fictives.</strong> Les objets, les prix, les stocks et l'adresse de
      l'atelier sont inventés pour la démonstration. La boutique, ses produits et ses
      contenus sont originaux : aucun élément graphique, textuel ou sonore n'est repris
      d'un tiers.
    </p>
  </section>
</template>
