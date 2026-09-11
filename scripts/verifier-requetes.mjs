#!/usr/bin/env node
/**
 * verifier-requetes.mjs — le nombre de requêtes du premier chargement
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * POURQUOI CE FICHIER EXISTE
 * ───────────────────────────────────────────────────────────────────────────
 * `verifier-verrous.mjs` couvre AA, reduced-motion, curseur natif, jetons de
 * couleur, ancienne DA, typographie. Son VERROU 5 (poids) renvoie volontairement
 * à `deploy.yml`. **Aucun contrôle ne portait sur le NOMBRE de requêtes.**
 *
 * Or la contrainte de l'hébergement n'est pas la taille, c'est la RAFALE :
 * o2switch coupe vers ~20 requêtes rapprochées par IP (HTTP 429).
 *
 * CONSÉQUENCE MESURÉE, 11/09/2026 : pendant une campagne de mesures, une rafale
 * de requêtes rapprochées a renvoyé des 429, l'application ne s'est pas montée,
 * et le DOM observé ne contenait ni navigation, ni pied de page, ni bandeau de
 * consentement. Le site respectait TOUS ses verrous et échouait quand même.
 * (Diagnostic rectifié depuis : ces 429 venaient de l'outil de mesure lui-même,
 * pas d'un visiteur. Le verrou reste justifié — c'est le seul scénario connu où
 * le site ne s'affiche pas.)
 *
 * MESURÉ LE 11/09/2026, sur le premier chargement : 12 requêtes.
 *   scripts 1 · vendor 1 · feuille de style 1 · icônes 2 · manifest 1 · image 1
 *   · polices 5
 *
 * CE QUE CE CHIFFRE COÛTE RÉELLEMENT (relevé sur les en-têtes servis) :
 *   · assets et polices → Cache-Control: public, max-age=31536000, immutable
 *   · HTML              → Cache-Control: no-store, no-cache, must-revalidate
 * Donc un visiteur paie ces requêtes UNE fois, puis une par visite. Un
 * rechargement ne les repaie pas : elles sont en cache pour un an.
 * Risque résiduel assumé : deux visiteurs DERRIÈRE LA MÊME IP (box familiale,
 * réseau d'entreprise, robot d'indexation simultané) peuvent atteindre la limite.
 *
 * POURQUOI LE SEUIL EST 14 ET NON 10
 *   La première version refusait tout au-dessus de 10. C'était un goût
 *   d'ingénieur, pas une mesure : le contrôle échouait sur un site conforme, et
 *   « un contrôle qui échoue à tort finit par être ignoré, ce qui est pire que
 *   pas de contrôle ». Le seuil est désormais une RÈGLE DE CONDUITE assumée :
 *   12 mesurées + 2 de marge. Il faut le déplacer parce que le site change, pas
 *   parce qu'un test l'a décidé.
 *
 * POURQUOI IL COMPTE SUR `dist/` ET PAS SUR `src/`
 *   Compter depuis les sources SOUS-ESTIME : au stade du lint, `index.html`
 *   référence un seul module `/src/main.js` et Vite n'a encore ni haché les
 *   noms, ni produit le vendor, ni ajouté le modulepreload. Un verrou qui
 *   reçoit l'information et la jette est un rituel. Donc : après le build, sur
 *   le build. `deploy.yml` l'appelle dans le job `build`.
 *
 * USAGE
 *   node scripts/verifier-requetes.mjs              → compte dist/ et juge
 *   node scripts/verifier-requetes.mjs --detail     → détail par poste
 *   node scripts/verifier-requetes.mjs --seuil 16   → change le seuil
 * Sortie 0 = sous le seuil · 1 = seuil franchi · 2 = rien mesuré.
 */

import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join } from 'node:path';

const RACINE = process.cwd();
const argv = process.argv.slice(2);
const lire = (n, d) => {
  const i = argv.indexOf('--' + n);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : d;
};

const SEUIL = Number(lire('seuil', 14));
const DIST = join(RACINE, 'dist');
const DETAIL = argv.includes('--detail');

// ─── Échec bruyant : un verrou qui n'a rien mesuré n'est pas un verrou tenu ───
const html = join(DIST, 'index.html');
if (!existsSync(html)) {
  console.error('  [KO]  dist/index.html introuvable.');
  console.error('        Ce verrou mesure le BUILD, pas les sources : lancez-le après `npm run build`.');
  console.error('        Un verrou qui n\'a rien mesuré n\'est PAS un verrou tenu.');
  process.exit(2);
}
const actifs = join(DIST, 'assets');
if (!existsSync(actifs)) {
  console.error('  [KO]  dist/assets introuvable. Le comptage serait faux, on s\'arrête.');
  process.exit(2);
}

const code = readFileSync(html, 'utf8');
const feuilles = readdirSync(actifs).filter((f) => f.endsWith('.css'));
if (feuilles.length === 0) {
  console.error('  [KO]  aucune feuille de style dans dist/assets. Comptage impossible.');
  process.exit(2);
}
const css = feuilles.map((f) => readFileSync(join(actifs, f), 'utf8')).join('\n');

const compter = (texte, motif) => (texte.match(motif) || []).length;

// Les polices sont dédupliquées PAR FICHIER : le même @font-face peut être
// déclaré deux fois (bloc inline du <head> + fonts.css importé par main.js).
// Compter les déclarations doublerait le poste le plus lourd du site.
const polices = new Set();
for (const m of css.matchAll(/url\(([^)]*\.woff2?[^)]*)\)/g)) {
  polices.add(m[1].replace(/["']/g, '').trim().split('/').pop());
}

const postes = [
  ['scripts du bundle d\'entrée', compter(code, /<script[^>]+src=/g)],
  ['modules préchargés (vendor)', compter(code, /rel="modulepreload"/g)],
  ['feuilles de style', compter(code, /rel="stylesheet"/g)],
  ['icônes et favicons', compter(code, /rel="(icon|shortcut icon|apple-touch-icon)"/g)],
  ['manifest', compter(code, /rel="manifest"/g)],
  ['images du HTML', compter(code, /<img[^>]+src=/g)],
  ['polices (fichiers distincts)', polices.size],
];
const total = postes.reduce((s, [, n]) => s + n, 0);

console.log('='.repeat(72));
console.log('  Requêtes du PREMIER chargement');
console.log('='.repeat(72));
console.log(`  build mesuré : dist/ (${statSync(html).mtime.toLocaleString('fr-FR')})`);
console.log(`  seuil        : ${SEUIL} requêtes (règle de conduite, pas une mesure)`);
console.log('');
if (DETAIL) {
  for (const [nom, n] of postes) console.log(`  ${String(n).padStart(3)}  ${nom}`);
  if (polices.size) console.log(`       -> ${[...polices].join(', ')}`);
  console.log('');
}

let echecs = 0;
const dire = (ok, quoi, note = '') => {
  console.log(`  ${ok ? '[ok]' : '[KO]'}  ${quoi}${note ? '  — ' + note : ''}`);
  if (!ok) echecs++;
};

dire(total <= SEUIL, `${total} requête(s) au premier chargement`,
  `seuil ${SEUIL} · contrainte hébergeur ~20 par IP`);
console.log('');
console.log('  Ce que ce chiffre coûte : assets et polices en cache `immutable` un an,');
console.log('  HTML en `no-store`. Un visiteur paie ces requêtes UNE fois, puis 1 par visite.');
console.log('  Risque résiduel assumé : deux visiteurs derrière la même IP peuvent');
console.log('  atteindre la limite de l\'hébergeur.');

if (echecs > 0) {
  console.log('');
  console.log(`  ❌ SEUIL FRANCHI : ${total} > ${SEUIL}`);
  console.log('     Pistes, dans l\'ordre du gain le plus sûr — mais aucune n\'est gratuite :');
  console.log('     · manifest (1 req) : aucun service worker n\'est déclaré, il ne sert donc');
  console.log('       qu\'à l\'ajout à l\'écran d\'accueil. Décision PRODUIT, pas technique.');
  console.log('     · apple-touch-icon (1 req) : icône iOS. Décision VISUELLE.');
  console.log('     · polices : vérifier que chaque graisse déclarée est réellement RENDUE.');
  console.log('       (Mesuré le 11/09/2026 : les 5 fichiers sont légitimes. Fraunces est');
  console.log('       variable 300-700, un seul fichier pour toutes ses graisses — mais le');
  console.log('       CSS demande 600, 800 et 900 qu\'aucun fichier ne fournit : le navigateur');
  console.log('       les arrondit. Ces graisses ne coûtent aucune requête, elles coûtent un');
  console.log('       ÉCART entre le CSS et le rendu réel.)');
  console.log('='.repeat(72));
  process.exit(1);
}

console.log('');
console.log('  Tous les verrous de requêtes sont tenus.');
console.log('='.repeat(72));
process.exit(0);
