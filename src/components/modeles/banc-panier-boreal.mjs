#!/usr/bin/env node
/**
 * banc-panier-boreal.mjs — L'ÉPREUVE DE L'ARITHMÉTIQUE DU PANIER.
 *
 * LA RÈGLE DU STUDIO QUI COMMANDE CE FICHIER, LA MÊME QUE POUR LE CATALOGUE :
 * *on prouve qu'un garde-fou mord en rouvrant le défaut exprès.*
 *
 * Ce panier est le cœur de la tranche : c'est la seule boucle du modèle — on prend, on
 * ajoute, on retire, on paie (simulé). Si la relecture d'un panier mémorisé fait planter
 * la page, ou si une quantité dépasse le stock, la démonstration est fausse au moment
 * précis où elle doit convaincre.
 *
 * CE QUI EST ÉPROUVÉ ICI, ET CE QUI NE L'EST PAS :
 *   ✔ les règles pures de `reglesPanier.js` — bornes, relecture défensive, totaux, franco ;
 *   ✘ la RÉACTIVITÉ Vue, le rendu à l'écran et `localStorage` : cela demande un navigateur,
 *     et ce n'est pas mesuré par ce banc. Il ne faut donc PAS lire « banc vert » comme
 *     « interface juste ».
 *
 * Usage :  node src/components/modeles/banc-panier-boreal.mjs
 * Sortie : 0 = tout est conforme · 1 = au moins un essai a menti.
 */

import {
  QUANTITE_MAX,
  bornerQuantite,
  calculerTotaux,
  fraisDePort,
  plafondPour,
  relirePanier,
  restePourFranco,
} from './reglesPanier.js';
import { trouverVariante } from './reglesCatalogue.js';

let echecs = 0;
const dire = (ok, message) => {
  console.log(`  ${ok ? '[ok]' : '[KO]'}  ${message}`);
  if (!ok) echecs += 1;
};

/** Un catalogue de contrôle, minuscule et écrit à la main : deux produits suffisent. */
const CATALOGUE = [
  {
    id: 'objet-bleu',
    nom: 'Objet bleu',
    prix: 2000,
    stock: 3,
    variantes: [
      { id: 'petit', libelle: 'Petit', supplement: 0 },
      { id: 'grand', libelle: 'Grand', supplement: 1000 },
    ],
  },
  {
    id: 'objet-rouge',
    nom: 'Objet rouge',
    prix: 5000,
    stock: 0,
    variantes: [{ id: 'unique', libelle: 'Unique', supplement: 0 }],
  },
];

const trouverProduit = (id) => CATALOGUE.find((p) => p.id === id) || null;
const sources = { trouverProduit, trouverVariante };

/* ── ① LES BORNES DE QUANTITÉ ───────────────────────────────────────────────── */
console.log('\n① BORNES DE QUANTITÉ');

dire(bornerQuantite(2, 10) === 2, 'une quantité normale passe (2 → 2)');
dire(bornerQuantite(50, 3) === 3, 'une quantité au-delà du stock est ramenée au stock (50 → 3)');
dire(bornerQuantite(500, 400) === QUANTITE_MAX, `une quantité déraisonnable est plafonnée (500 → ${QUANTITE_MAX})`);
dire(bornerQuantite(0, 10) === null, 'zéro rend null — c\'est le signal de SUPPRESSION, pas une quantité de 1');
dire(bornerQuantite(-4, 10) === null, 'une quantité négative rend null (suppression)');
dire(bornerQuantite('deux', 10) === null, 'une quantité qui n\'est pas un nombre rend null');
dire(bornerQuantite(1.9, 10) === 1, 'une quantité décimale est tronquée (1,9 → 1)');

dire(plafondPour({ stock: 7 }) === 7, 'plafond = stock du produit');
dire(plafondPour({ stock: 0 }) === 0, 'plafond = 0 pour un produit en rupture');
dire(plafondPour({ stock: 400 }) === QUANTITE_MAX, `plafond borné à ${QUANTITE_MAX} quel que soit le stock`);

/* ── ② LA RELECTURE D'UN PANIER MÉMORISÉ ────────────────────────────────────── */
console.log('\n② RELECTURE D\'UN PANIER MÉMORISÉ — ce qui doit être jeté, et ce qui doit rester');

const bon = relirePanier(
  [{ idProduit: 'objet-bleu', idVariante: 'petit', quantite: 2 }],
  sources,
);
dire(bon.lignes.length === 1 && bon.ecartees === 0, 'une ligne valide est conservée');
dire(bon.lignes[0].quantite === 2, 'sa quantité est conservée telle quelle');

const produitDisparu = relirePanier(
  [{ idProduit: 'objet-vert', idVariante: 'petit', quantite: 1 }],
  sources,
);
dire(produitDisparu.lignes.length === 0 && produitDisparu.ecartees === 1,
  'un produit qui n\'est plus au catalogue est écarté, et COMPTÉ');

const varianteRenommee = relirePanier(
  [{ idProduit: 'objet-bleu', idVariante: 'moyen', quantite: 1 }],
  sources,
);
dire(varianteRenommee.lignes.length === 0 && varianteRenommee.ecartees === 1,
  'une variante renommée est écartée, et COMPTÉE');

const enRupture = relirePanier(
  [{ idProduit: 'objet-rouge', idVariante: 'unique', quantite: 1 }],
  sources,
);
dire(enRupture.lignes.length === 0 && enRupture.ecartees === 1,
  'un produit passé en rupture est écarté : on ne relit pas une rupture dans un panier');

const quantiteNulle = relirePanier(
  [{ idProduit: 'objet-bleu', idVariante: 'petit', quantite: 0 }],
  sources,
);
dire(quantiteNulle.lignes.length === 0 && quantiteNulle.ecartees === 1,
  'une quantité nulle en mémoire est écartée');

const auDelaDuStock = relirePanier(
  [{ idProduit: 'objet-bleu', idVariante: 'petit', quantite: 90 }],
  sources,
);
dire(auDelaDuStock.lignes[0].quantite === 3,
  'une quantité mémorisée au-delà du stock est ramenée au stock (90 → 3)');

const doublons = relirePanier(
  [
    { idProduit: 'objet-bleu', idVariante: 'petit', quantite: 1 },
    { idProduit: 'objet-bleu', idVariante: 'petit', quantite: 1 },
  ],
  sources,
);
dire(doublons.lignes.length === 1, 'deux lignes identiques FUSIONNENT en une seule');
dire(doublons.lignes[0].quantite === 2, 'la fusion additionne les quantités (1 + 1 = 2), sans dépasser le stock');

const fusionPlafonnee = relirePanier(
  [
    { idProduit: 'objet-bleu', idVariante: 'petit', quantite: 2 },
    { idProduit: 'objet-bleu', idVariante: 'petit', quantite: 2 },
  ],
  sources,
);
dire(fusionPlafonnee.lignes[0].quantite === 3, 'la fusion elle-même respecte le stock (2 + 2 → 3)');

const pasUneListe = relirePanier({ idProduit: 'objet-bleu' }, sources);
dire(pasUneListe.lignes.length === 0 && pasUneListe.motif !== '',
  'une forme inattendue rend une liste vide ET un motif — on ne devine pas');

const melange = relirePanier(
  [
    { idProduit: 'objet-bleu', idVariante: 'grand', quantite: 1 },
    { idProduit: 'objet-vert', idVariante: 'petit', quantite: 1 },
    { idProduit: 'objet-rouge', idVariante: 'unique', quantite: 1 },
  ],
  sources,
);
dire(melange.lignes.length === 1 && melange.ecartees === 2,
  'dans un panier mêlé : 1 gardée, 2 écartées, et le compte le dit');

/* ── ③ LES TOTAUX ───────────────────────────────────────────────────────────── */
console.log('\n③ TOTAUX');

const totaux = calculerTotaux([
  { quantite: 2, totalLigne: 4000 },
  { quantite: 3, totalLigne: 3000 },
]);
dire(totaux.nombreArticles === 5, `le nombre d'articles est la somme des quantités (5)`);
dire(totaux.sousTotal === 7000, 'le sous-total est la somme des lignes (7000 centimes)');
dire(calculerTotaux([]).sousTotal === 0, 'un panier vide totalise zéro, sans erreur');

/* ── ④ LE FRANCO DE PORT ────────────────────────────────────────────────────── */
console.log('\n④ FRANCO DE PORT — la règle appartient au mode, pas au calcul');

const modeSoumisAuFranco = { id: 'standard', prix: 490, francDePort: true };
const modeNonSoumis = { id: 'suivie', prix: 790, francDePort: false };

dire(fraisDePort(modeSoumisAuFranco, 6000, 5999) === 490,
  'sous le seuil, un mode soumis au franco est facturé (490)');
dire(fraisDePort(modeSoumisAuFranco, 6000, 6000) === 0,
  'au seuil EXACT, le port est offert — la comparaison est inclusive, et c\'est dit');
dire(fraisDePort(modeNonSoumis, 6000, 90000) === 790,
  'un mode non soumis au franco reste facturé, même très au-dessus du seuil');

let leve = false;
try {
  fraisDePort(null, 6000, 1000);
} catch (erreur) {
  leve = true;
}
dire(leve, 'un mode de livraison absent LÈVE une erreur au lieu de rendre un port de zéro');

dire(restePourFranco(6000, 2500) === 3500, 'ce qu\'il reste à ajouter est calculé (3500)');
dire(restePourFranco(6000, 7000) === 0, 'au-delà du seuil, il ne reste rien à ajouter — jamais un négatif');

console.log(`\n${echecs === 0 ? 'BANC : tout est conforme.' : `BANC : ${echecs} échec(s).`}\n`);
process.exit(echecs === 0 ? 0 : 1);
