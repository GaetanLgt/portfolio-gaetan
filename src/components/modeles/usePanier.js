/**
 * usePanier.js — L'ÉTAT DU PANIER, ET RIEN D'AUTRE.
 *
 * Trois responsabilités, pas une de plus :
 *   1. tenir les LIGNES du panier (produit + variante + quantité) dans un état partagé,
 *   2. les PERSISTER dans `localStorage` et les relire au chargement,
 *   3. CALCULER les totaux — jamais les écrire à la main quelque part dans un composant.
 *
 * ⚠ L'ÉTAT EST PARTAGÉ AU NIVEAU DU MODULE, ET C'EST DÉLIBÉRÉ. La grille, la fiche
 * produit, le panier et le tunnel sont quatre composants distincts : s'ils avaient chacun
 * leur `ref`, le bouton « ajouter » de la fiche ne remplirait pas le panier de la page.
 * Un état de panier est PAR NATURE unique dans une boutique.
 *
 * ⚠ UNE LIGNE RELUE DU STOCKAGE EST RE-VÉRIFIÉE, PAS FAITE CONFIANCE. Le catalogue peut
 * changer entre deux visites : un produit retiré ou une variante renommée laisserait une
 * ligne pointant dans le vide, et la page planterait à l'affichage du total. On ÉCARTE la
 * ligne, on le DIT, et la boutique continue de fonctionner. *Une donnée relue d'un
 * support qu'on ne contrôle pas n'est pas une donnée : c'est une hypothèse.*
 *
 * ⚠ AUCUN PAIEMENT, AUCUN ENVOI. Rien dans ce fichier ne touche au réseau, et rien ne
 * quitte la machine : le panier vit dans le navigateur du visiteur, sous une clé
 * explicite. C'est une démonstration, et l'interface le dit à l'écran.
 */

import { computed, ref } from 'vue';
import {
  boutique,
  francoDePort,
  livraisons,
  prixUnitaire,
  trouverProduit,
  trouverVariante,
} from './donneesProduits.js';

/** Clé de stockage, versionnée : un changement de format se fait sous une clé neuve
 *  plutôt qu'en devinant ce que contenait l'ancienne. */
export const CLE_PANIER = 'modele-boreal.panier.v1';

/** Bornes de quantité. 99 n'est pas une règle commerciale : c'est la borne au-delà de
 *  laquelle l'affichage de la quantité casse dans la colonne du panier. */
export const QUANTITE_MIN = 1;
export const QUANTITE_MAX = 99;

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

  // ASSERTION DE FORME : ce qu'on relit doit être une liste, sinon on ne devine pas.
  if (!Array.isArray(relu)) {
    avertissement.value = 'Panier mémorisé de forme inattendue (liste attendue) : écarté.';
    return [];
  }

  const retenues = [];
  let ecartees = 0;

  for (const ligne of relu) {
    const produit = ligne && typeof ligne.idProduit === 'string' ? trouverProduit(ligne.idProduit) : null;
    const variante = produit ? trouverVariante(produit, ligne.idVariante) : null;
    const quantite = Number(ligne && ligne.quantite);

    if (!produit || !variante || !Number.isInteger(quantite) || quantite < QUANTITE_MIN) {
      ecartees += 1;
      continue;
    }
    if (produit.stock <= 0) {
      ecartees += 1;
      continue;
    }

    const dejaLa = retenues.findIndex(
      (l) => l.idProduit === produit.id && l.idVariante === variante.id,
    );
    const quantiteBornee = Math.min(quantite, Math.min(QUANTITE_MAX, produit.stock));

    if (dejaLa >= 0) {
      retenues[dejaLa].quantite = Math.min(
        retenues[dejaLa].quantite + quantiteBornee,
        Math.min(QUANTITE_MAX, produit.stock),
      );
    } else {
      retenues.push({ idProduit: produit.id, idVariante: variante.id, quantite: quantiteBornee });
    }
  }

  if (ecartees > 0) {
    avertissement.value =
      `${ecartees} ligne(s) du panier mémorisé ne correspondent plus au catalogue ` +
      `(produit retiré, variante renommée ou rupture) et ont été écartées.`;
  }

  return retenues;
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

const nombreArticles = computed(() =>
  lignes.value.reduce((somme, ligne) => somme + ligne.quantite, 0),
);

const sousTotal = computed(() =>
  lignesDetaillees.value.reduce((somme, ligne) => somme + ligne.totalLigne, 0),
);

const panierVide = computed(() => lignes.value.length === 0);

const francoAtteint = computed(() => sousTotal.value >= francoDePort);

/** Ce qu'il reste à ajouter pour que le port soit offert — un chiffre CALCULÉ, jamais écrit. */
const restePourFranco = computed(() => Math.max(0, francoDePort - sousTotal.value));

/**
 * Frais de port d'un mode donné, pour un sous-total donné.
 * La règle du franco vient du CATALOGUE (le mode dit lui-même s'il y est soumis).
 */
export function fraisLivraison(idLivraison, sousTotalCentimes) {
  const mode = livraisons.find((l) => l.id === idLivraison);
  if (!mode) throw new Error(`Mode de livraison inconnu : « ${idLivraison} ».`);
  if (mode.francDePort && sousTotalCentimes >= francoDePort) return 0;
  return mode.prix;
}

/** Le seuil de franco, tel que le catalogue le déclare (pour l'afficher sans le réécrire). */
export const seuilFranco = boutique.francoDePort;

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

  const demande = Math.max(QUANTITE_MIN, Math.floor(Number(quantite) || 1));
  const plafond = Math.min(QUANTITE_MAX, produit.stock);
  const existante = lignes.value.find(
    (l) => l.idProduit === produit.id && l.idVariante === idVariante,
  );
  const avant = existante ? existante.quantite : 0;
  const apres = Math.min(avant + demande, plafond);

  if (existante) {
    existante.quantite = apres;
  } else {
    lignes.value.push({ idProduit: produit.id, idVariante: idVariante, quantite: apres });
  }

  ecrireStockage();
  const ajoutes = apres - avant;
  dernierMessage.value = ajoutes > 0
    ? `${ajoutes} × ${produit.nom} ajouté au panier. ${nombreArticles.value} article(s) au total.`
    : `${produit.nom} : quantité déjà au maximum disponible (${plafond}).`;
  return ajoutes > 0;
}

function definirQuantite(idProduit, idVariante, quantite) {
  const ligne = lignes.value.find(
    (l) => l.idProduit === idProduit && l.idVariante === idVariante,
  );
  if (!ligne) return;

  const produit = trouverProduit(idProduit);
  const plafond = Math.min(QUANTITE_MAX, produit ? produit.stock : QUANTITE_MAX);
  const demandee = Math.floor(Number(quantite));

  if (!Number.isFinite(demandee) || demandee < QUANTITE_MIN) {
    // Une quantité vidée au clavier vaut une suppression : c'est le geste attendu,
    // et le laisser à 1 serait plus surprenant qu'utile.
    retirer(idProduit, idVariante);
    return;
  }

  ligne.quantite = Math.min(demandee, plafond);
  ecrireStockage();
  dernierMessage.value = `${produit ? produit.nom : idProduit} : quantité portée à ${ligne.quantite}.`;
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
