/**
 * reglesPanier.js — L'ARITHMÉTIQUE DU PANIER, EN FONCTIONS PURES.
 *
 * ⚠ POURQUOI ELLE EST SORTIE DE `usePanier.js`, ET C'EST LA MÊME RAISON QUE POUR LE
 * CATALOGUE : **une règle qu'on ne peut pas appeler seule ne peut pas être éprouvée.**
 * `usePanier.js` importe le catalogue (donc un JSON, que Node refuse de charger tel quel)
 * et touche `localStorage` : un banc d'essai Node ne peut pas l'importer. Ces fonctions-ci
 * ne dépendent de rien — ni de Vue, ni du navigateur, ni du catalogue — et le banc
 * `banc-panier-boreal.mjs` les éprouve pour de vrai.
 *
 * Ce qu'on y trouve : les bornes de quantité, la relecture défensive d'un panier
 * mémorisé, les totaux, et la règle du franco de port. Ce qu'on n'y trouve PAS : l'état
 * réactif, la persistance et les messages — c'est le travail de `usePanier.js`.
 */

/** Bornes de quantité. 99 n'est pas une règle commerciale : c'est la borne au-delà de
 *  laquelle l'affichage de la quantité casse dans la colonne du panier. */
export const QUANTITE_MIN = 1;
export const QUANTITE_MAX = 99;

/**
 * Borne une quantité demandée entre 1 (ou la suppression) et le plafond réel du produit.
 * Rend `null` quand la demande vaut zéro ou moins : c'est le signal de SUPPRESSION,
 * et il est rendu explicite plutôt que confondu avec une quantité de 1.
 */
export function bornerQuantite(demandee, plafond) {
  const valeur = Math.floor(Number(demandee));
  if (!Number.isFinite(valeur) || valeur < QUANTITE_MIN) return null;
  const limite = Math.max(QUANTITE_MIN, Math.min(QUANTITE_MAX, Math.floor(Number(plafond))));
  return Math.min(valeur, limite);
}

/** Le plafond de quantité d'un produit : son stock, jamais au-delà de QUANTITE_MAX. */
export function plafondPour(produit) {
  if (!produit) return QUANTITE_MAX;
  return Math.max(0, Math.min(QUANTITE_MAX, Math.floor(Number(produit.stock) || 0)));
}

/**
 * RELIT un panier mémorisé, et rend ce qu'elle a gardé ET ce qu'elle a écarté.
 *
 * ⚠ POURQUOI ELLE ÉCARTE AU LIEU DE FAIRE CONFIANCE : le catalogue peut avoir changé entre
 * deux visites. Une ligne qui pointe vers un produit disparu ou une variante renommée
 * ferait planter l'affichage du total. On jette la ligne, on COMPTE les lignes jetées, et
 * la boutique continue de fonctionner. *Une donnée relue d'un support qu'on ne contrôle
 * pas n'est pas une donnée : c'est une hypothèse.*
 *
 * @param {unknown} brut ce qui a été relu du stockage (déjà désérialisé)
 * @param {{ trouverProduit: Function, trouverVariante: Function }} sources
 * @returns {{ lignes: Array, ecartees: number, motif: string }}
 */
export function relirePanier(brut, sources) {
  if (!Array.isArray(brut)) {
    return {
      lignes: [],
      ecartees: 0,
      motif: brut === undefined || brut === null
        ? ''
        : 'Panier mémorisé de forme inattendue (liste attendue) : écarté.',
    };
  }

  const lignes = [];
  let ecartees = 0;

  for (const entree of brut) {
    const idProduit = entree && typeof entree.idProduit === 'string' ? entree.idProduit : '';
    const produit = idProduit ? sources.trouverProduit(idProduit) : null;
    const variante = produit ? sources.trouverVariante(produit, entree.idVariante) : null;
    const quantite = Number(entree && entree.quantite);

    if (!produit || !variante || !Number.isInteger(quantite) || quantite < QUANTITE_MIN) {
      ecartees += 1;
      continue;
    }
    if (produit.stock <= 0) {
      ecartees += 1;
      continue;
    }

    const plafond = plafondPour(produit);
    const dejaLa = lignes.findIndex(
      (l) => l.idProduit === produit.id && l.idVariante === variante.id,
    );
    const quantiteBornee = Math.min(quantite, plafond);

    if (dejaLa >= 0) {
      // Deux lignes identiques fusionnent : une seule ligne par (produit, variante),
      // sinon le total compterait deux fois le même objet à l'affichage du récapitulatif.
      lignes[dejaLa].quantite = Math.min(lignes[dejaLa].quantite + quantiteBornee, plafond);
    } else {
      lignes.push({ idProduit: produit.id, idVariante: variante.id, quantite: quantiteBornee });
    }
  }

  return {
    lignes,
    ecartees,
    motif: ecartees > 0
      ? `${ecartees} ligne(s) du panier mémorisé ne correspondent plus au catalogue ` +
        '(produit retiré, variante renommée ou rupture) et ont été écartées.'
      : '',
  };
}

/** Totaux d'un panier détaillé : le nombre d'articles et le sous-total, en centimes. */
export function calculerTotaux(lignesDetaillees) {
  let nombreArticles = 0;
  let sousTotal = 0;
  for (const ligne of lignesDetaillees) {
    nombreArticles += ligne.quantite;
    sousTotal += ligne.totalLigne;
  }
  return { nombreArticles, sousTotal };
}

/**
 * Frais de port d'un mode, pour un sous-total donné.
 * La règle du franco appartient au MODE (il dit lui-même s'il y est soumis) : on ne
 * décide pas ici que « la livraison standard est offerte » — c'est une donnée du catalogue.
 */
export function fraisDePort(mode, seuilFranco, sousTotal) {
  if (!mode) throw new Error('fraisDePort : mode de livraison absent.');
  if (mode.francDePort && sousTotal >= seuilFranco) return 0;
  return mode.prix;
}

/** Ce qu'il reste à ajouter pour que le port soit offert. Zéro si c'est déjà atteint. */
export function restePourFranco(seuilFranco, sousTotal) {
  return Math.max(0, seuilFranco - sousTotal);
}
