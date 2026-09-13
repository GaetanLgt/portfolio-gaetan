// ============================================================
// generer-sitemap.mjs — GL Digital Lab — 13/09/2026
//
// Écrit `public/sitemap.xml` À PARTIR DU MANIFESTE `src/config/topographie.js`.
//
// POURQUOI CE FICHIER EXISTE
// `/soute` a été construite, liée depuis le pied de page, éprouvée — et **oubliée du
// sitemap**. C'est Gaëtan qui l'a vu. On ne peut pas demander à un humain de tenir quatre
// listes synchronisées à la main : on supprime les listes.
//
// ⚠️ CE QUE CE GÉNÉRATEUR NE FAIT PAS, ET QU'UN GÉNÉRATEUR NAÏF FERAIT
//   · il ne fabrique PAS de `priority` ni de `changefreq`. Ce sont des décisions
//     éditoriales, elles vivent dans le manifeste et il les recopie ;
//   · il n'inclut PAS les routes marquées `declaration: null` (`/sitemap`, les deux
//     démonstrations). Une route attrape-tout ou une page de démonstration n'a rien à
//     faire dans un plan de site ;
//   · il n'écrit PAS l'en-tête du fichier. **Il le PRÉSERVE.** Cet en-tête raconte
//     quatorze URLs déclarées qui rendaient un 404, et la règle qui en est sortie. C'est
//     une trace : un générateur qui réécrit le fichier entier l'effacerait.
//
// LA RÈGLE, REPRISE DE CET EN-TÊTE
//   « une URL n'entre ici que si elle REND une page réelle. »
//   Le générateur VÉRIFIE donc, quand `dist/` existe, que chaque adresse déclarée
//   correspond à un HTML prérendu — et il AVERTIT si ce n'est pas le cas. Il n'échoue pas :
//   `dist/` peut dater du build précédent. Le juge, c'est `npm run audit:topographie`,
//   qui tourne APRÈS le build, sur l'artefact réel.
//
// Usage : node scripts/generer-sitemap.mjs
// ============================================================
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { TOPOGRAPHIE, DECLAREES, DOMAINE } from '../src/config/topographie.js';

const RACINE = process.cwd();
const SITEMAP = join(RACINE, 'public/sitemap.xml');
const DIST = join(RACINE, 'dist');

if (!existsSync(SITEMAP)) {
  console.error('  public/sitemap.xml introuvable — ce script le régénère, il ne le crée pas.');
  console.error('  (l\'en-tête historique doit exister pour être préservé)');
  process.exit(2);
}

const existant = readFileSync(SITEMAP, 'utf8');

/* ── 1. PRÉSERVER l'en-tête : tout jusqu'à la balise <urlset …> incluse ─────────── */
const marqueur = existant.match(/^[\s\S]*?<urlset[^>]*>\s*/);
if (!marqueur) {
  console.error('  la balise <urlset> est introuvable : le fichier n\'est pas dans la forme attendue.');
  process.exit(2);
}
const entete = marqueur[0];

/* ── 2. Vérifier, si dist/ existe, que chaque déclaration rend une page ─────────── */
const manquantes = [];
if (existsSync(DIST)) {
  for (const e of DECLAREES) {
    const p = e.chemin === '/'
      ? join(DIST, 'index.html')
      : join(DIST, e.chemin.replace(/^\//, ''), 'index.html');
    if (!existsSync(p)) manquantes.push(e.chemin);
  }
}

/* ── 3. Écrire les entrées ──────────────────────────────────────────────────────── */
const echapper = (t) => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const entree = (e) => {
  const d = e.declaration;
  const lignes = [];
  lignes.push('  <url>');
  if (d.note) {
    // La note du manifeste est recopiée en commentaire : elle explique POURQUOI cette page
    // est là, en priorité haute ou basse. Sans elle, le fichier redevient une liste muette.
    lignes.push('    <!-- ' + echapper(d.note) + ' -->');
  }
  lignes.push(`    <loc>${DOMAINE}${e.chemin === '/' ? '/' : e.chemin}</loc>`);
  lignes.push(`    <lastmod>${d.lastmod}</lastmod>`);
  lignes.push(`    <changefreq>${d.changefreq}</changefreq>`);
  lignes.push(`    <priority>${d.priority}</priority>`);
  lignes.push('  </url>');
  return lignes.join('\n');
};

const corps = DECLAREES.map(entree).join('\n');
const sortie = `${entete}${corps}\n</urlset>\n`;

writeFileSync(SITEMAP, sortie, 'utf8');

/* ── 4. Rapport ─────────────────────────────────────────────────────────────────── */
const avant = (existant.match(/<loc>/g) || []).length;
const apres = DECLAREES.length;
const nonDeclarees = TOPOGRAPHIE.filter((e) => !e.declaration);

console.log('');
console.log('=== SITEMAP GÉNÉRÉ DEPUIS LE MANIFESTE ===');
console.log(`  source        : src/config/topographie.js (${TOPOGRAPHIE.length} entrées)`);
console.log(`  déclarées     : ${apres}`);
console.log(`  en-tête       : préservé (${entete.split('\n').length} lignes, non réécrites)`);
console.log(`  avant / après : ${avant} → ${apres}`);
console.log('');
if (nonDeclarees.length) {
  console.log('  VOLONTAIREMENT NON DÉCLARÉES :');
  for (const e of nonDeclarees) console.log(`    · ${e.chemin}`);
  console.log('');
}
if (manquantes.length) {
  console.log('  ⚠️  DÉCLARÉES MAIS SANS PAGE DANS dist/ (build précédent ?) :');
  for (const m of manquantes) console.log(`    · ${m}`);
  console.log('    Le juge est `npm run audit:topographie`, après le build.');
  console.log('');
} else if (existsSync(DIST)) {
  console.log('  Chaque adresse déclarée correspond à une page prérendue dans dist/.');
  console.log('');
}
