#!/usr/bin/env node
/**
 * banc-donnees-boreal.mjs — L'ÉPREUVE DE LA VÉRIFICATION DU CATALOGUE.
 *
 * LA RÈGLE DU STUDIO QUI COMMANDE CE FICHIER : *on prouve qu'un garde-fou mord en
 * rouvrant le défaut exprès.* Une vérification qu'on n'a jamais vue refuser quoi que ce
 * soit n'est pas un contrôle : c'est une décoration — et elle donne même une fausse
 * assurance, puisqu'elle annonce « catalogue vérifié » sans avoir jamais eu à dire non.
 *
 * D'où DEUX contrôles, et le second compte plus que le premier :
 *   ① le VRAI catalogue passe, et il rend un compte NON NUL — un compte à zéro
 *      prouverait seulement que la lecture n'a rien trouvé ;
 *   ② HUIT catalogues abîmés sont REFUSÉS, un défaut par essai, et le message d'erreur
 *      doit nommer le produit fautif. Un garde-fou muet serait à moitié inutile.
 *
 * Usage :  node src/components/modeles/banc-donnees-boreal.mjs
 * Sortie : 0 = tout est conforme · 1 = au moins un essai a menti.
 */

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { verifierCatalogue } from './reglesCatalogue.js';

const ICI = dirname(fileURLToPath(import.meta.url));
const CHEMIN_DONNEES = join(ICI, '..', '..', 'views', 'modeles', 'donnees-produits.json');

let echecs = 0;
const dire = (ok, message) => {
  console.log(`  ${ok ? '[ok]' : '[KO]'}  ${message}`);
  if (!ok) echecs += 1;
};

const brut = JSON.parse(readFileSync(CHEMIN_DONNEES, 'utf8'));

/** Copie profonde : chaque essai part du catalogue intact, jamais d'un essai précédent. */
const copie = () => JSON.parse(JSON.stringify(brut));

/* ── ① le vrai catalogue ─────────────────────────────────────────────────────── */
console.log('\n① LE CATALOGUE LIVRÉ');
let controle = 0;
try {
  controle = verifierCatalogue(brut);
  dire(true, `catalogue accepté — ${controle} produit(s) contrôlé(s)`);
} catch (erreur) {
  dire(false, `le catalogue LIVRÉ est refusé : ${erreur.message}`);
}
dire(controle > 0, `le compte n'est pas zéro (${controle} > 0) — un zéro ne prouverait rien`);

/* ── ② les catalogues abîmés, exprès ────────────────────────────────────────── */
console.log('\n② LES DÉFAUTS ROUVERTS EXPRÈS — chacun doit être REFUSÉ');

const essais = [
  {
    nom: 'catégorie inexistante sur un produit',
    abimer: (d) => { d.produits[0].categorie = 'alchimie'; },
    attendu: /catégorie/i,
  },
  {
    nom: 'forme de pictogramme non dessinable',
    abimer: (d) => { d.produits[1].forme = 'griffon'; },
    attendu: /forme/i,
  },
  {
    nom: 'prix en euros flottants au lieu de centimes entiers',
    abimer: (d) => { d.produits[2].prix = 14.5; },
    attendu: /prix/i,
  },
  {
    nom: 'variante déclarée deux fois dans le même produit',
    abimer: (d) => { d.produits[3].variantes[1].id = d.produits[3].variantes[0].id; },
    attendu: /deux fois/i,
  },
  {
    nom: 'identifiant de produit en double',
    abimer: (d) => { d.produits[4].id = d.produits[0].id; },
    attendu: /double/i,
  },
  {
    nom: 'produit sans aucune variante',
    abimer: (d) => { d.produits[5].variantes = []; },
    attendu: /variante/i,
  },
  {
    nom: 'catalogue vide',
    abimer: (d) => { d.produits = []; },
    attendu: /vide/i,
  },
  {
    nom: 'mode de livraison au prix négatif',
    abimer: (d) => { d.livraisons[1].prix = -790; },
    attendu: /livraison/i,
  },
];

for (const essai of essais) {
  const abime = copie();
  essai.abimer(abime);
  let refus = null;
  try {
    verifierCatalogue(abime);
  } catch (erreur) {
    refus = erreur;
  }
  if (!refus) {
    dire(false, `${essai.nom} → ACCEPTÉ. Le garde-fou ne mord pas.`);
    continue;
  }
  const nomme = essai.attendu.test(refus.message);
  dire(nomme, `${essai.nom} → refusé : « ${refus.message} »`);
}

/* ── ③ un garde-fou trop large est aussi un défaut ──────────────────────────── */
console.log('\n③ LE GARDE-FOU NE DOIT PAS REFUSER UN CATALOGUE VALIDE MODIFIÉ LÉGITIMEMENT');
const legitime = copie();
legitime.produits.push({
  id: 'objet-de-controle',
  nom: 'Objet de contrôle',
  categorie: legitime.categories[0].id,
  prix: 100,
  forme: 'cylindre',
  stock: 1,
  resume: 'Produit ajouté par le banc pour vérifier qu\'un ajout valide passe.',
  description: 'Ajout de contrôle.',
  matiere: 'Contrôle',
  variantes: [{ id: 'unique', libelle: 'Unique', supplement: -50 }],
});
try {
  const n = verifierCatalogue(legitime);
  dire(n === controle + 1, `un produit valide ajouté passe — ${n} contrôlé(s), attendu ${controle + 1}`);
} catch (erreur) {
  dire(false, `un produit VALIDE est refusé : ${erreur.message}`);
}

console.log(`\n${echecs === 0 ? 'BANC : tout est conforme.' : `BANC : ${echecs} échec(s).`}\n`);
process.exit(echecs === 0 ? 0 : 1);
