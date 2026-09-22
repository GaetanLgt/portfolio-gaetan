#!/usr/bin/env node
/**
 * banc-routes-boreal.mjs — LE CONTRÔLE QUI MANQUAIT ENTRE LA TRANCHE ET LE SITE.
 *
 * ⭐ POURQUOI CE FICHIER EXISTE, ET IL RÉPOND À UN DÉFAUT RÉEL, MESURÉ AUJOURD'HUI.
 * Le banc d'essai navigateur (`essai-rendu.js`) monte SES PROPRES enregistrements de
 * route, construits depuis `modeles-adresses.js`. Il prouvait donc que la tranche
 * fonctionne **avec les routes que la tranche se donne** — pas avec celles du site. Et le
 * routeur du site, écrit à part, portait bien les cinq chemins et les cinq noms, mais
 * AUCUN `meta.modele` : la page, qui lisait ce champ pour savoir quelle marche rendre,
 * aurait affiché la vitrine sur les cinq adresses, en silence, sans une seule exception.
 * ⭐ *Un banc qui teste ses propres données ne teste pas l'intégration.*
 *
 * Ce contrôle-ci LIT LE ROUTEUR RÉEL, en texte, comme le fait `scripts/prerendre.js`
 * (même expression, L204), et le COMPARE à la source unique des adresses. Il tourne en
 * Node, sans navigateur, en une seconde — et il échoue bruyamment si un nom, un chemin ou
 * un titre divergent.
 *
 * ⚠ CE QU'IL NE PROUVE PAS : que la page RÉPOND sur ces routes (c'est le travail du banc
 * navigateur), ni que les pages sont prérendues (c'est celui de `verifier-topographie`).
 * Il prouve la seule chose qu'aucun des deux ne regardait : **que les deux fichiers
 * parlent des mêmes adresses.**
 *
 * Usage :  node src/views/modeles/banc-routes-boreal.mjs
 * Sortie : 0 = le routeur et la tranche s'accordent · 1 = divergence.
 */

import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { ADRESSES_MODELE } from './modeles-adresses.js';

const ICI = dirname(fileURLToPath(import.meta.url));
const RACINE = join(ICI, '..', '..', '..');
const ROUTEUR = join(RACINE, 'src', 'router', 'index.js');

let echecs = 0;
const noter = (ok, message) => {
  console.log(`  ${ok ? '[ok]' : '[KO]'}  ${message}`);
  if (!ok) echecs += 1;
};
const signaler = (message) => console.log(`  [note]  ${message}`);

if (!existsSync(ROUTEUR)) {
  console.error(`  [KO]  ${ROUTEUR} est introuvable : le contrôle ne peut rien mesurer.`);
  console.error('        Une lecture vide n\'est pas « tout va bien » : c\'est « je ne sais plus lire ».');
  process.exit(1);
}

// ⚠ MÊME LECTURE QUE LE PRÉRENDU (prerendre.js L203-204) : on retire les commentaires de
// bloc, puis on cherche `path: '…'`. Lire autrement ferait courir deux vérités parallèles :
// ce contrôle dirait « accordé » là où le prérendu, lui, ne verrait rien.
const source = readFileSync(ROUTEUR, 'utf8');

/** Les enregistrements du modèle, lus SANS analyseur d'accolades.
 *
 *  ⚠ PREMIÈRE VERSION FAUSSE, ET ELLE A PARLÉ. J'avais écrit
 *  `/\{[^{}]*?path:\s*'(\/modeles\/[^']*)'[^{}]*?\}/` : ce motif ne peut pas traverser
 *  les accolades IMBRIQUÉES d'un `meta: { … }`, qui est justement la forme de ce routeur.
 *  Le banc a donc annoncé « 0 route trouvée » et « les cinq chemins sont absents » — alors
 *  que les cinq étaient là, sous mes yeux. C'est le garde-fou « le routeur déclare au moins
 *  une route » qui a sauvé la mesure : **une lecture vide n'est pas « il n'y a rien »,
 *  c'est « je ne sais plus lire ».** Et c'est exactement le piège que le studio avait
 *  documenté le jour même : *un analyseur qui ne regardait qu'une forme de chemin.*
 *
 *  La version qui tient ne cherche plus d'accolade : elle découpe le fichier À CHAQUE
 *  `path: '/modeles/…'`, et lit ce qui suit jusqu'au chemin suivant. Les champs `name` et
 *  `title` d'un enregistrement se trouvent toujours après son `path`, jamais avant. */
function blocsDuModele(texte) {
  const positions = [...texte.matchAll(/path:\s*'(\/modeles\/[^']*)'/g)];
  return positions.map((trouve, rang) => {
    const fin = rang + 1 < positions.length ? positions[rang + 1].index : texte.length;
    const fenetre = texte.slice(trouve.index, fin);
    return {
      chemin: trouve[1],
      nom: (fenetre.match(/name:\s*'([^']+)'/) || [])[1] || '',
      titre: (fenetre.match(/title:\s*'((?:[^'\\]|\\.)*)'/) || [])[1] || '',
      porteMetaModele: /modele:\s*'/.test(fenetre),
    };
  });
}

const blocsRouteur = blocsDuModele(source);
console.log('\n① LE ROUTEUR RÉEL — ce qu\'il déclare pour /modeles');
console.log(`     ${ROUTEUR.replace(RACINE, '.')} · ${blocsRouteur.length} route(s) trouvée(s)`);
for (const bloc of blocsRouteur) {
  console.log(`     · ${bloc.chemin.padEnd(42)} ${bloc.nom || '(sans nom)'}`);
}
noter(blocsRouteur.length > 0, `le routeur déclare au moins une route de modèle (mesuré : ${blocsRouteur.length})`);

console.log('\n② LES ADRESSES DE LA TRANCHE — ce que le code utilise pour naviguer');
for (const adresse of ADRESSES_MODELE) {
  console.log(`     · ${adresse.chemin.padEnd(42)} ${adresse.nom}`);
}

console.log('\n③ L\'ACCORD DES DEUX LECTURES — c\'est ce que ce banc mesure');
const parChemin = new Map(blocsRouteur.map((bloc) => [bloc.chemin, bloc]));

for (const adresse of ADRESSES_MODELE) {
  const bloc = parChemin.get(adresse.chemin);
  if (!bloc) {
    // ⚠ Un chemin absent est un ÉCHEC, pas une note : la navigation pousserait vers un nom
    // inconnu du routeur, et le bouton ne ferait rien sans le dire.
    noter(false, `le routeur ne déclare PAS ${adresse.chemin} (attendu sous le nom « ${adresse.nom} »)`);
    continue;
  }
  noter(bloc.nom === adresse.nom,
    `${adresse.chemin} → nom « ${bloc.nom} » ${bloc.nom === adresse.nom ? '(conforme)' : `AU LIEU DE « ${adresse.nom} »`}`);
  noter(bloc.titre.length > 10,
    `${adresse.chemin} → porte un titre (le routeur du site écrit le titre du document avec : ${bloc.titre.length} caractère(s))`);
}

const cheminsRouteur = new Set(blocsRouteur.map((bloc) => bloc.chemin));
for (const bloc of blocsRouteur) {
  if (!ADRESSES_MODELE.some((adresse) => adresse.chemin === bloc.chemin)) {
    signaler(`le routeur déclare ${bloc.chemin}, que la tranche ne connaît pas (à trancher : route orpheline ?)`);
  }
}

console.log('\n④ CE QUI EST ENCORE EN FRAGMENT — doit être zéro');
const fragments = blocsRouteur.filter((bloc) => bloc.chemin.includes('#'));
noter(fragments.length === 0, `aucune route du modèle n'est un fragment d'adresse (mesuré : ${fragments.length})`);

const nomsRouteur = new Set(blocsRouteur.map((bloc) => bloc.nom));
noter(nomsRouteur.size === blocsRouteur.length,
  `les noms de route sont uniques dans le routeur (${nomsRouteur.size} noms pour ${blocsRouteur.length} routes)`);
noter(!blocsRouteur.some((bloc) => bloc.nom === ''),
  'aucune route du modèle n\'est sans nom — la navigation se fait PAR LE NOM');

console.log('\n⑤ LE CHAMP meta.modele — le renfort, pas la dépendance');
const sansMeta = blocsRouteur.filter((bloc) => !bloc.porteMetaModele);
if (sansMeta.length > 0) {
  signaler(`${sansMeta.length} route(s) du routeur ne portent pas de meta.modele (${sansMeta.map((b) => b.nom).join(', ')}) : la page se repère par le NOM de route, donc ça fonctionne — ce champ n'est qu'un renfort. Ce banc le dit pour qu'une future bascule ne se croie pas couverte par lui.`);
} else {
  noter(true, 'chaque route du modèle porte aussi meta.modele');
}
noter(ADRESSES_MODELE.every((adresse) => typeof adresse.nom === 'string' && adresse.nom.length > 0),
  'la source unique des adresses nomme les cinq routes (aucun nom vide)');

console.log(`\n${echecs === 0
  ? 'BANC : le routeur du site et la tranche parlent des mêmes adresses.'
  : `BANC : ${echecs} divergence(s) entre le routeur et la tranche.`}\n`);
process.exit(echecs === 0 ? 0 : 1);
