/**
 * usePanier.js — L'ÉTAT DU PANIER, ET RIEN D'AUTRE.
 *
 * Trois responsabilités, pas une de plus :
 *   1. tenir les LIGNES du panier (produit + variante + quantité) dans un état partagé,
 *   2. les PERSISTER dans `localStorage` et les relire au chargement,
 *   3. exposer des totaux CALCULÉS — jamais écrits à la main dans un composant.
 *
 * ⚠ L'ARITHMÉTIQUE N'EST PAS ICI : elle est dans `reglesPanier.js`, en fonctions pures,
 * pour qu'un banc d'essai Node puisse l'éprouver sans navigateur ni Vue. Ce fichier-ci ne
 * contient que de l'état, de la persistance et des messages.
 *
 * ⚠ L'ÉTAT EST PARTAGÉ AU NIVEAU DU MODULE, ET C'EST DÉLIBÉRÉ. La grille, la fiche
 * produit, le panier et le tunnel sont quatre composants distincts : s'ils avaient chacun
 * leur `ref`, le bouton « ajouter » de la fiche ne remplirait pas le panier de la page.
 * Un état de panier est PAR NATURE unique dans une boutique.
 *
 * ⚠ AUCUN PAIEMENT, AUCUN ENVOI. Rien dans ce fichier ne touche au réseau, et rien ne
 * quitte la machine : le panier vit dans le navigateur du visiteur, sous une clé
 * explicite. C'est une démonstration, et l'interface le dit à l'écran.
 */

import { computed, ref } from 'vue';
import {
  boutique,
  livraisons,
  prixUnitaire,
  trouverProduit,
  trouverVariante,
} from './donneesProduits.js';
import {
  QUANTITE_MAX,
  QUANTITE_MIN,
  bornerQuantite,
  calculerTotaux,
  fraisDePort,
  plafondPour,
  relirePanier,
  restePourFranco as restePourFrancoRegle,
} from './reglesPanier.js';

/** Clé de stockage, versionnée : un changement de format se fait sous une clé neuve
 *  plutôt qu'en devinant ce que contenait l'ancienne. */
export const CLE_PANIER = 'modele-boreal.panier.v1';

export { QUANTITE_MAX, QUANTITE_MIN };

/* ────────────────────────────────────────────────────────────────────────────────
   L'ÉTAT PARTAGÉ
   ──────────────────────────────────────────────────────────────────────────────── */

const lignes = ref([]);
const avertissement = ref('');
const dernierMessage = ref('');

/** Lecture défensive du stockage : tout ce qui ne peut pas être relu devient une liste vide. */
function lireStockage() {
  let brut = null;
  try {
    brut = window.localStorage.getItem(CLE_PANIER);
  } catch (erreur) {
    // Navigation privée, stockage désactivé par le visiteur : la boutique reste utilisable,
    // le panier est simplement oublié entre deux visites.
    avertissement.value =
      'Le panier ne peut pas être mémorisé dans ce navigateur (stockage local refusé). ' +
      'La démonstration fonctionne quand même, mais le panier sera oublié au rechargement.';
    return [];
  }
  if (!brut) return [];

  let relu;
  try {
    relu = JSON.parse(brut);
  } catch (erreur) {
    avertissement.value =
      'Panier mémorisé illisible (JSON abîmé) : il a été écarté au lieu de faire planter la page.';
    return [];
  }

  const resultat = relirePanier(relu, { trouverProduit, trouverVariante });
  if (resultat.motif) avertissement.value = resultat.motif;
  return resultat.lignes;
}

/** Écriture : un échec d'écriture ne doit jamais interrompre un ajout au panier. */
function ecrireStockage() {
  try {
    window.localStorage.setItem(
      CLE_PANIER,
      JSON.stringify(lignes.value.map((l) => ({
        idProduit: l.idProduit,
        idVariante: l.idVariante,
        quantite: l.quantite,
      }))),
    );
  } catch (erreur) {
    avertissement.value =
      'Le panier n\'a pas pu être mémorisé (stockage local indisponible ou plein).';
  }
}

/** Lignes enrichies : le panier affiche des noms et des prix, la mémoire ne garde que des clés. */
const lignesDetaillees = computed(() =>
  lignes.value.map((ligne) => {
    const produit = trouverProduit(ligne.idProduit);
    const variante = trouverVariante(produit, ligne.idVariante);
    const unite = prixUnitaire(produit, ligne.idVariante);
    return {
      ...ligne,
      produit,
      variante,
      prixUnitaire: unite,
      totalLigne: unite * ligne.quantite,
    };
  }),
);

const totaux = computed(() => calculerTotaux(lignesDetaillees.value));
const nombreArticles = computed(() => totaux.value.nombreArticles);
const sousTotal = computed(() => totaux.value.sousTotal);

const panierVide = computed(() => lignes.value.length === 0);
const seuilFranco = boutique.francoDePort;
const francoAtteint = computed(() => sousTotal.value >= seuilFranco);
const restePourFranco = computed(() => restePourFrancoRegle(seuilFranco, sousTotal.value));

/**
 * Frais de port d'un mode donné, pour un sous-total donné.
 * La règle vit dans `reglesPanier.js` ; ici on ne fait que lui fournir le catalogue.
 */
export function fraisLivraison(idLivraison, sousTotalCentimes) {
  const mode = livraisons.find((l) => l.id === idLivraison);
  if (!mode) throw new Error(`Mode de livraison inconnu : « ${idLivraison} ».`);
  return fraisDePort(mode, seuilFranco, sousTotalCentimes);
}

/* ────────────────────────────────────────────────────────────────────────────────
   LES GESTES
   ──────────────────────────────────────────────────────────────────────────────── */

function ajouter(produit, idVariante, quantite = 1) {
  if (!produit) throw new Error('ajouter : produit absent.');
  if (!trouverVariante(produit, idVariante)) {
    throw new Error(`ajouter : la variante « ${idVariante} » n'existe pas pour « ${produit.id} ».`);
  }
  if (produit.stock <= 0) {
    dernierMessage.value = `${produit.nom} est en rupture : rien n'a été ajouté au panier.`;
    return false;
  }

  const plafond = plafondPour(produit);
  const existante = lignes.value.find(
    (l) => l.idProduit === produit.id && l.idVariante === idVariante,
  );
  const avant = existante ? existante.quantite : 0;
  const demande = bornerQuantite(avant + Math.max(QUANTITE_MIN, Math.floor(Number(quantite) || 1)), plafond);
  const apres = demande === null ? avant : demande;

  if (existante) {
    existante.quantite = apres;
  } else if (apres > 0) {
    lignes.value.push({ idProduit: produit.id, idVariante: idVariante, quantite: apres });
  }

  ecrireStockage();
  const ajoutes = apres - avant;
  dernierMessage.value = ajoutes > 0
    ? `${ajoutes} × ${produit.nom} ajouté au panier. ${nombreArticles.value} article(s) au total.`
    : `${produit.nom} : quantité déjà au maximum disponible (${plafond}).`;
  return ajoutes > 0;
}

function retirer(idProduit, idVariante) {
  const avant = lignes.value.length;
  const produit = trouverProduit(idProduit);
  lignes.value = lignes.value.filter(
    (l) => !(l.idProduit === idProduit && l.idVariante === idVariante),
  );
  if (lignes.value.length !== avant) {
    ecrireStockage();
    dernierMessage.value = `${produit ? produit.nom : idProduit} retiré du panier.`;
  }
}

function definirQuantite(idProduit, idVariante, quantite) {
  const ligne = lignes.value.find(
    (l) => l.idProduit === idProduit && l.idVariante === idVariante,
  );
  if (!ligne) return;

  const produit = trouverProduit(idProduit);
  const bornee = bornerQuantite(quantite, plafondPour(produit));

  if (bornee === null) {
    // Une quantité vidée au clavier vaut une suppression : c'est le geste attendu,
    // et la laisser à 1 serait plus surprenant qu'utile.
    retirer(idProduit, idVariante);
    return;
  }

  ligne.quantite = bornee;
  ecrireStockage();
  dernierMessage.value = `${produit ? produit.nom : idProduit} : quantité portée à ${ligne.quantite}.`;
}

function vider() {
  lignes.value = [];
  ecrireStockage();
  dernierMessage.value = 'Panier vidé.';
}

/* ────────────────────────────────────────────────────────────────────────────────
   INITIALISATION — une seule fois pour tout le module
   ──────────────────────────────────────────────────────────────────────────────── */

lignes.value = lireStockage();

/**
 * Le guichet unique du panier pour tous les composants de la tranche.
 * Aucun composant ne touche `localStorage` directement : le point de passage est ici,
 * et c'est ce qui rend la persistance vérifiable à un seul endroit.
 */
export function usePanier() {
  return {
    lignes,
    lignesDetaillees,
    nombreArticles,
    sousTotal,
    panierVide,
    francoAtteint,
    restePourFranco,
    seuilFranco,
    avertissement,
    dernierMessage,
    ajouter,
    definirQuantite,
    retirer,
    vider,
  };
}
