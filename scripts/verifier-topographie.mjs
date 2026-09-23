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

/* ── 3. La carte du navire ───────────────────────────────────────────────────── */
/*
 * ⚠️ CORRIGÉ LE 13/09/2026 — CE CONTRÔLE S'EST AVEUGLÉ TOUT SEUL.
 *
 * Il lisait les compartiments dans `src/composables/useDecouvertes.js`, où ils étaient
 * écrits à la main. Après le passage au manifeste, cette liste a été SUPPRIMÉE du fichier :
 * le contrôle a donc lu **0 compartiment** — et il a annoncé « aucune incohérence
 * bloquante », parce qu'une liste vide ne produit aucun écart.
 *
 * **C'est le pire état possible pour un contrôle : il ne voyait plus rien et il disait que
 * tout allait bien.** Un compteur à zéro prouve que le motif n'a rien trouvé, jamais que la
 * chose est absente. D'où le garde-fou `exigerNonVide` plus bas, qui transforme une lecture
 * vide en ÉCHEC au lieu d'un silence.
 *
 * La source est désormais `src/config/topographie.js` — l'unique dépositaire de la
 * topographie.
 */
function zonesDeLaCarte() {
  const p = join(RACINE, 'src/config/topographie.js');
  if (!existsSync(p)) return [];
  /* ⛔ ON RETIRE LES COMMENTAIRES AVANT DE LIRE — corrigé le 23/09/2026.
   *
   * CE QUI SE PASSAIT. Le fichier était lu brut, et deux motifs ramassaient
   * `compartiment: { … }` puis `chemin: '…'` — **commentaires compris**.
   * Or `topographie.js` documente le retrait de `/carte-holistique` en citant
   * littéralement son chemin :
   *     * « Elle portait : `chemin: '/carte-holistique'`, le compartiment … »
   * ⇒ **L'audit comptait le commentaire qui documente le retrait**, et
   *   annonçait « compartiment sans page correspondante ».
   *
   * ⭐ ET LE PIRE EST LIGNE 114 : l'appariement entre `compartiment` et `chemin`
   *   se fait PAR INDEX. **Une mention en trop dans un commentaire ne fait pas
   *   qu'ajouter une fausse entrée : elle décale TOUTES les suivantes.**
   *
   * ⚠️ C'est la même faute que trois autres outils de ce dépôt — un contrôle qui
   *   compte son propre texte. *Le correctif est le même, et il est en tête de
   *   fonction pour qu'on ne l'oublie pas.* */
  const brut = readFileSync(p, 'utf8');
  // On garde les nouvelles lignes : le fichier n'a pas de numéros à rapporter,
  // mais un retrait qui décale les lignes est un piège pour la prochaine lecture.
  const garderLignes = (m) => m.replace(/[^\n]/g, ' ');
  const src = brut
    .replace(/\/\*[\s\S]*?\*\//g, garderLignes)
    .replace(/(^|[^:'"\\])\/\/[^\n]*/g, '$1 ');
  // Un compartiment est déclaré par un bloc `compartiment: { id: '…', nom: '…', pont: '…' }`
  // suivi, dans la même entrée, de son `chemin`. On lit les deux et on apparie par ordre
  // d'apparition : plus robuste qu'une expression régulière qui traverserait tout le fichier.
  const ids = [...src.matchAll(/compartiment:\s*\{[^}]*?id:\s*'([^']+)'[^}]*?pont:\s*'([^']+)'/g)];
  const chemins = [...src.matchAll(/chemin:\s*'(\/[^']*)'/g)].map((m) => m[1]);
  return ids
    .map((m, i) => {
      // Le `chemin` d'une entrée suit son `compartiment` dans le manifeste. On ne devine
      // pas : si l'appariement échoue, le compte sera faux et le garde-fou le dira.
      return chemins[i];
    })
    .filter(Boolean)
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

/*
 * ⚠️ LE GARDE-FOU LE PLUS IMPORTANT DE CE FICHIER : UNE LISTE VIDE EST UN ÉCHEC.
 *
 * Le 13/09/2026, ce contrôle a lu « 0 compartiment » après un refactor, et il a conclu
 * « aucune incohérence bloquante » — parce qu'une liste vide ne produit aucun écart.
 * **Un contrôle qui ne voit plus rien et qui dit que tout va bien est plus dangereux
 * qu'aucun contrôle.**
 *
 * Chaque liste doit donc rendre au moins une entrée. Si ce n'est pas le cas, la source a
 * bougé, ou le motif ne correspond plus : on ÉCHOUE, au lieu de se taire.
 */
const listes = [
  { nom: 'routes servies (dist/)', valeurs: routes, min: 5 },
  { nom: 'adresses déclarées (sitemap)', valeurs: sitemap, min: 5 },
  { nom: 'compartiments (carte)', valeurs: carte, min: 3 },
  { nom: 'liens du plan du site', valeurs: plan, min: 3 },
];
const lecturesVides = listes.filter((l) => l.valeurs.length < l.min);

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

// ⚠️ LE GARDE-FOU PASSE EN PREMIER. Une lecture vide est un ÉCHEC, jamais un silence :
// c'est exactement ainsi que ce contrôle s'est aveuglé le 13/09/2026, en annonçant
// « aucune incohérence » avec zéro compartiment lu.
if (lecturesVides.length) {
  console.log('  [KO]  LECTURES VIDES — une source a bougé, ou le motif ne correspond plus :');
  for (const l of lecturesVides) {
    console.log(`        ${l.nom} : ${l.valeurs.length} entrée(s) lue(s), minimum attendu ${l.min}`);
  }
  console.log('');
  console.log('        Ce n\'est PAS « il n\'y a rien » : c\'est « je ne sais plus lire ».');
  console.log('');
  alertes += lecturesVides.length;
}

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
