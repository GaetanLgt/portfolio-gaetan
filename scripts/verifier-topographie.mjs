// ============================================================
// verifier-topographie.mjs — GL Digital Lab — 13/09/2026
//
// LE VERROU QUI EMPÊCHE D'OUBLIER UNE PAGE.
//
// POURQUOI IL EXISTE
// Le 13/09/2026, `/soute` a été construite, liée depuis le pied de page, éprouvée — et
// **oubliée du `sitemap.xml`**. C'est Gaëtan qui a posé la question, pas un contrôle.
// Le défaut n'est pas l'oubli : c'est qu'**aucun outil ne pouvait le voir**. La
// topographie du site vit à quatre endroits, et rien ne les comparait :
//
//   1. le ROUTEUR          — ce que le site sait servir ;
//   2. le `sitemap.xml`    — ce qu'on déclare aux moteurs ;
//   3. `useDecouvertes.js` — la carte du navire (l'exploration) ;
//   4. `SitemapPage.vue`   — le plan du site montré au visiteur.
//
// Quatre listes tenues à la main, donc quatre occasions de diverger. Ce fichier les lit et
// DIT les écarts. Il ne corrige rien tout seul : une page absente du sitemap peut être un
// oubli (un défaut) ou une décision (une page qu'on ne veut pas voir indexée), et **l'outil
// ne peut pas trancher entre les deux**. Il nomme, l'humain décide.
//
// ⚠️ CE QU'ON LIT, ET POURQUOI CE N'EST PAS LA MÊME CHOSE PARTOUT
//   · Les ROUTES sont lues dans `dist/` — donc dans l'ARTEFACT CONSTRUIT, pas dans le source.
//     C'est la leçon du jour appliquée : *ce qui est écrit dans le code n'est pas ce qui est
//     servi.* Si une route ne produit pas de HTML prérendu, elle n'existe pas pour un robot.
//   · Le SITEMAP est lu dans `dist/sitemap.xml` — ce qui part réellement en ligne.
//   · La CARTE et le PLAN DU SITE sont lus dans le source : ce sont des listes déclaratives,
//     et les lire au runtime demanderait un serveur. **Limite assumée et écrite ici.**
//
// Usage : node scripts/verifier-topographie.mjs [--detail]
// ============================================================
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

const DETAIL = process.argv.includes('--detail');
const RACINE = process.cwd();
const DIST = join(RACINE, 'dist');

if (!existsSync(DIST)) {
  console.error('  dist/ absent — lancer le build avant ce contrôle.');
  process.exit(2);
}

/* ── 1. Les routes RÉELLES, lues dans l'artefact construit ───────────────────── */
function routesServies() {
  const trouvees = new Set();
  for (const dossier of ['', ...readdirSync(DIST).filter((d) => !d.includes('.'))]) {
    const base = join(DIST, dossier);
    if (!existsSync(base) || !statSync(base).isDirectory()) continue;
    if (dossier === 'assets' || dossier === 'models' || dossier === 'fonts' || dossier === 'logos') continue;
    // Une route existe si son HTML prérendu existe.
    const p = join(base, dossier ? 'index.html' : 'index.html');
    if (existsSync(p)) trouvees.add('/' + (dossier ? dossier + '/' : ''));
  }
  // Les routes imbriquées (`/apps/agent/wa`) : un niveau de plus.
  const exploré = new Set();
  const parcourir = (dir, prefixe) => {
    if (exploré.has(dir)) return;
    exploré.add(dir);
    for (const e of readdirSync(dir, { withFileTypes: true })) {
      if (!e.isDirectory()) continue;
      if (['assets', 'models', 'fonts', 'logos', 'api'].includes(e.name)) continue;
      const sous = join(dir, e.name);
      const chemin = prefixe + '/' + e.name;
      if (existsSync(join(sous, 'index.html'))) trouvees.add(chemin + '/');
      parcourir(sous, chemin);
    }
  };
  parcourir(DIST, '');
  return [...trouvees].map((r) => (r === '//' ? '/' : r)).sort();
}

/* ── 2. Le sitemap déclaré ───────────────────────────────────────────────────── */
function sitemapDeclare() {
  const p = join(DIST, 'sitemap.xml');
  if (!existsSync(p)) return [];
  const xml = readFileSync(p, 'utf8');
  return [...xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)]
    .map((m) => m[1].replace(/^https?:\/\/[^/]+/, ''))
    .map((r) => (r.endsWith('/') || r === '' ? r : r + '/'))
    .sort();
}

/* ── 3. La carte du navire (liste déclarative) ───────────────────────────────── */
function zonesDeLaCarte() {
  const p = join(RACINE, 'src/composables/useDecouvertes.js');
  if (!existsSync(p)) return [];
  const src = readFileSync(p, 'utf8');
  return [...src.matchAll(/chemin:\s*'([^']+)'/g)].map((m) => m[1])
    .map((r) => (r.endsWith('/') || r === '' ? r : r + '/'))
    .sort();
}

/* ── 4. Le plan du site montré au visiteur ───────────────────────────────────── */
/*
 * ⚠️ CORRIGÉ LE 13/09/2026 — MON PROPRE OUTIL MENTAIT, ET IL MENTAIT BAS.
 *
 * La première version ne lisait que les liens ÉCRITS DANS LE GABARIT (`to="/x"`). Elle a
 * donc annoncé « 3 liens » pour le plan du site. Or `SitemapPage.vue` déclare ses pages
 * dans un TABLEAU `sections` (`{ name, path }`), rendu par `:to="page.path"` : le gabarit
 * ne contient presque aucune adresse littérale. **Vraie valeur : 18 pages.**
 *
 * C'est très exactement le défaut que ce studio traque : *un outil qui rapporte un fait
 * faux sur la cible*. Un contrôle qui sous-compte est pire qu'aucun contrôle, parce qu'il
 * donne l'assurance que la liste est courte alors qu'elle ne l'est pas.
 *
 * On lit donc LES DEUX formes : l'adresse littérale du gabarit, et l'adresse déclarative
 * du tableau. Et puisque le tableau est la forme dominante, c'est lui qu'il faut surveiller.
 */
function liensDuPlan() {
  const p = join(RACINE, 'src/views/core/SitemapPage.vue');
  if (!existsSync(p)) return [];
  const src = readFileSync(p, 'utf8');
  const litteraux = [...src.matchAll(/to="(\/[^"]*)"/g)].map((m) => m[1]);
  const declaratifs = [...src.matchAll(/\bpath:\s*'(\/[^']*)'/g)].map((m) => m[1]);
  return [...new Set([...litteraux, ...declaratifs])]
    .map((r) => (r.endsWith('/') || r === '' ? r : r + '/'))
    .sort();
}

const routes = routesServies();
const sitemap = sitemapDeclare();
const carte = zonesDeLaCarte();
const plan = liensDuPlan();

const norm = (r) => (r === '/' ? '/' : r.replace(/\/$/, ''));
const enSet = (l) => new Set(l.map(norm));

const R = enSet(routes), S = enSet(sitemap), C = enSet(carte), P = enSet(plan);

const diff = (a, b) => [...a].filter((x) => !b.has(x)).sort();

console.log('');
console.log('='.repeat(72));
console.log('  TOPOGRAPHIE DU SITE — quatre listes, comparées');
console.log('='.repeat(72));
console.log(`  routes servies (dist/)       : ${R.size}`);
console.log(`  adresses déclarées (sitemap) : ${S.size}`);
console.log(`  compartiments (carte)        : ${C.size}`);
console.log(`  liens du plan du site        : ${P.size}`);
console.log('');

let alertes = 0;
const dire = (liste, quoi, gravite) => {
  if (!liste.length) return;
  console.log(`  ${gravite}  ${quoi} (${liste.length}) :`);
  for (const x of liste) console.log(`        ${x}`);
  console.log('');
  if (gravite === '[KO]') alertes += liste.length;
};

// ⚠️ LE DÉFAUT LE PLUS GRAVE, ET C'EST CELUI QUE LE SITEMAP DOCUMENTE DÉJÀ :
// une adresse déclarée qui ne rend AUCUNE page. Le fichier raconte quatorze URLs
// déclarées qui renvoyaient un 404 — « un plan de site qui envoie les moteurs sur des
// 404 leur apprend à s'en méfier : c'est pire que pas de plan de site ».
dire(diff(S, R), 'adresses DÉCLARÉES qui ne rendent AUCUNE page (404 pour un moteur)', '[KO]');

// Une page servie mais non déclarée : invisible pour les moteurs. Peut être un oubli
// (c'est le cas de /soute) ou une décision (page de test, 404.html).
const nonDeclarees = diff(R, S).filter((r) => r !== '/404' && r !== '/offline');
dire(nonDeclarees, 'pages SERVIES mais non déclarées au sitemap', '[note]');

// La carte du navire doit couvrir les mêmes compartiments que le site sert.
// Sinon elle ment au visiteur : elle annonce une topographie qui n'existe plus.
dire(diff(C, R), 'compartiments de la CARTE qui ne correspondent à aucune page', '[KO]');
dire(diff(nonDeclarees.filter((r) => !C.has(r) && !P.has(r)), new Set()),
  'pages ni sur la carte, ni dans le plan du site — atteignables par aucun chemin balisé', '[note]');

// ⚠️ LE PLAN DU VISITEUR CONTRE LE PLAN DES ROBOTS.
// Constaté en lisant les listes complètes, pas en le cherchant : cinq pages réelles et
// déclarées aux moteurs sont ABSENTES de la page « Plan du Site » montrée au visiteur —
// dont `/dossier`, qui est la porte commerciale du site (« offres, prix, délais et
// limites », mis en avant dans le premier écran et dans le pied de page).
// Rien ne casse techniquement : ces pages restent atteignables par la navigation et le
// pied de page. Mais **un visiteur qui cherche la carte complète reçoit une carte plus
// pauvre que celle d'un robot d'indexation.** C'est le genre d'écart qui ne se voit pas
// et qui grandit tout seul.
dire(diff(S, P), 'pages déclarées aux moteurs mais ABSENTES du plan montré au visiteur', '[note]');

if (DETAIL) {
  console.log('  --- listes complètes ---');
  console.log('  routes servies :', routes.join(' · '));
  console.log('  sitemap        :', sitemap.join(' · '));
  console.log('  carte          :', carte.join(' · '));
  console.log('  plan du site   :', plan.join(' · '));
  console.log('');
}

console.log('='.repeat(72));
if (alertes === 0) {
  console.log('  Aucune incohérence bloquante entre les quatre listes.');
} else {
  console.log(`  ${alertes} incohérence(s) bloquante(s).`);
  console.log('  Rappel : l\'outil NOMME, il ne corrige pas — une page absente du');
  console.log('  sitemap peut être un oubli ou une décision. À trancher par Gaëtan.');
}
console.log('='.repeat(72));
console.log('');
process.exit(alertes === 0 ? 0 : 1);
