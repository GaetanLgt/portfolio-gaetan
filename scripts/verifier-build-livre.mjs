#!/usr/bin/env node
/**
 * verifier-build-livre.mjs — LE BUILD EST-IL CELUI QUE LE ROUTEUR DÉCLARE ?
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * ⛔ L'ANGLE MORT QU'IL FERME, MESURÉ LE 22/09/2026.
 *
 *   Onze verrous existaient. AUCUN ne confrontait `src/router/index.js` au
 *   contenu RÉEL de `dist/`. Chacun mesurait le build de son côté :
 *     · `verifier-requetes.mjs` comptait des requêtes dans `dist/index.html` ;
 *     · `verifier-poids.mjs` pesait des pages de `dist/` ;
 *     · `verifier-topographie.mjs` comparait le PLAN DE SITE au routeur ;
 *     · `generer-sitemap.mjs` avertissait même « DÉCLARÉES MAIS SANS PAGE DANS
 *       dist/ (build précédent ?) » — ⚠️ **un avertissement n'est pas un
 *       verrou** : il s'affichait, et personne ne pouvait échouer dessus.
 *
 *   ⭐ LE DÉFAUT MESURÉ, ET C'EST CELUI QUI A MOTIVÉ CE FICHIER : `src/router/
 *     index.js` déclarait CINQ adresses `/modeles/boutique-boreal{,…}`, et
 *     `dist/` n'en contenait QU'UNE. Le routeur avait été étendu après la
 *     dernière construction. **Le build était en retard sur la source, et rien
 *     ne le disait.**
 *     *Un site dont le routeur promet plus que le disque ne livre ne renvoie pas
 *     une erreur : il renvoie un 404, page par page, en production.*
 *
 * POURQUOI PAR ANALYSE, ET PAS PAR EXPRESSION RÉGULIÈRE
 *   ⛔ Une expression régulière sur du JavaScript est un piège déjà payé : le
 *     même jour, un remplacement par motif a cassé un fichier du dépôt. Un
 *     `path:` peut vivre dans un commentaire, dans une chaîne, ou dans un objet
 *     imbriqué. **On lit l'arbre, pas le texte.** Le paquet `acorn` est présent
 *     dans `node_modules` (dépendance de Vite) : on l'utilise.
 *
 * ⚠️ CE QU'IL N'EST PAS : un juge du CONTENU des pages. Il vérifie qu'une page
 *   EXISTE à l'adresse déclarée. Qu'elle soit juste est l'affaire des autres.
 *
 * ⭐ DESIGNER N'EST PAS CONDAMNER.
 *   Ce verrou rapporte et sort en 0. Pour en faire un verrou BLOQUANT le jour
 *   où le dépôt sera propre : poser `BUILD_BLOQUANT=1`.
 *   *Un verrou qui échoue toujours apprend à être ignoré — et le jour où il
 *   signalera un vrai défaut, personne ne le lira.*
 *
 * USAGE
 *   node scripts/verifier-build-livre.mjs            → mesure et juge (désigne)
 *   node scripts/verifier-build-livre.mjs --detail   → détail route par route
 *   BUILD_BLOQUANT=1 node scripts/verifier-build-livre.mjs   → condamne
 *
 * CODES DE SORTIE
 *   0 = mesuré (défaut désigné ou non ; condamne seulement si BUILD_BLOQUANT=1)
 *   1 = BUILD_BLOQUANT=1 ET au moins une route déclarée sans page livrée
 *   2 = RIEN MESURÉ (routeur illisible, analyse vide, ou `dist/` non construit)
 */

import { readFileSync, existsSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { parse } from 'acorn';

const RACINE = process.cwd();
const DIST = join(RACINE, 'dist');
const ROUTEUR = join(RACINE, 'src', 'router', 'index.js');
const DETAIL = process.argv.includes('--detail');
const BLOQUANT = process.env.BUILD_BLOQUANT === '1';

const vert = (s) => `\x1b[32m${s}\x1b[0m`;
const rouge = (s) => `\x1b[31m${s}\x1b[0m`;
const jaune = (s) => `\x1b[33m${s}\x1b[0m`;
const gris = (s) => `\x1b[90m${s}\x1b[0m`;

const L = (s = '') => console.log('  ' + s);

console.log('\n' + '='.repeat(78));
console.log('  LE BUILD LIVRÉ CORRESPOND-IL AU ROUTEUR DÉCLARÉ ?');
console.log('='.repeat(78));

/* ─── 1. LE ROUTEUR, LU PAR SON ARBRE ──────────────────────────────────────── */

if (!existsSync(ROUTEUR)) {
  console.error(rouge(`  [KO]  ${ROUTEUR} est introuvable.`));
  console.error(gris('        Sans le routeur, il n\'y a rien à confronter. On s\'arrête.'));
  process.exit(2);
}

const sourceRouteur = readFileSync(ROUTEUR, 'utf8');

let arbre;
try {
  /*
   * ⚠️ `locations: true` N'EST PAS COSMÉTIQUE : sans lui, acorn ne pose pas de
   * `loc` sur les nœuds, et le rapport annonce « déclarée ligne 0 » pour toutes
   * les routes — *un numéro de ligne faux est pire que pas de numéro : il
   * envoie chercher au mauvais endroit.* Corrigé le 22/09/2026 après l'avoir vu.
   */
  arbre = parse(sourceRouteur, { ecmaVersion: 'latest', sourceType: 'module', locations: true });
} catch (e) {
  console.error(rouge('  [KO]  le routeur ne se laisse pas analyser.'));
  console.error(gris(`        acorn dit : ${e.message}`));
  console.error(gris('        ⛔ On ne retombe PAS sur une expression régulière : un résultat'));
  console.error(gris('           approximatif présenté comme exact serait pire que rien.'));
  process.exit(2);
}

/** Parcourt l'arbre à la recherche du tableau affecté à `routes`. */
function trouverTableauRoutes(noeud, attendu) {
  if (!noeud || typeof noeud !== 'object') return null;
  if (Array.isArray(noeud)) {
    for (const enfant of noeud) {
      const t = trouverTableauRoutes(enfant, attendu);
      if (t) return t;
    }
    return null;
  }
  if (
    noeud.type === 'VariableDeclarator' &&
    noeud.id && noeud.id.type === 'Identifier' && noeud.id.name === attendu &&
    noeud.init && noeud.init.type === 'ArrayExpression'
  ) {
    return noeud.init;
  }
  for (const cle of Object.keys(noeud)) {
    if (cle === 'type' || cle === 'start' || cle === 'end') continue;
    const t = trouverTableauRoutes(noeud[cle], attendu);
    if (t) return t;
  }
  return null;
}

const tableau = trouverTableauRoutes(arbre, 'routes');

/*
 * ⭐⭐⭐ L'ASSERTION SUR LA STRUCTURE — ET ELLE EST LE CŒUR DU FICHIER.
 *
 *   Un analyseur qui ne trouve RIEN rend un « tout va bien » MENSONGER : zéro
 *   route déclarée, zéro route manquante, sortie verte. **C'est la porte par
 *   laquelle ce verrou pourrait être faux en ayant l'air juste.**
 *
 *   ⛔ On la ferme ici, et on prouve qu'elle mord : si l'analyse ne trouve pas
 *     le tableau `routes`, on sort en 2 — « rien mesuré » — jamais en 0.
 *   *Un vert qui vient d'un silence n'est pas un vert : c'est un blanc.*
 */
if (!tableau || tableau.elements.length === 0) {
  console.error(rouge('  [KO]  l\'analyse n\'a TROUVÉ AUCUNE route dans le routeur.'));
  console.error(gris('        ⛔ Ce n\'est PAS un succès : c\'est un analyseur qui ne voit rien.'));
  console.error(gris('        Causes possibles : le tableau ne s\'appelle plus `routes`, il n\'est'));
  console.error(gris('        plus un littéral, ou il est construit autrement. On refuse de'));
  console.error(gris('        conclure — et surtout on refuse de sortir en 0.'));
  process.exit(2);
}

const declarations = [];
const nonAnalysables = [];

for (const element of tableau.elements) {
  if (!element || element.type !== 'ObjectExpression') {
    nonAnalysables.push('(entrée qui n\'est pas un objet littéral)');
    continue;
  }
  let propPath = null;
  for (const p of element.properties) {
    if (
      p.type === 'Property' && !p.computed &&
      p.key && p.key.type === 'Identifier' && p.key.name === 'path'
    ) {
      propPath = p.value;
    }
  }
  if (!propPath || propPath.type !== 'Literal' || typeof propPath.value !== 'string') {
    nonAnalysables.push('(objet sans `path` littéral — souvent une route construite ailleurs)');
    continue;
  }
  declarations.push({ chemin: propPath.value, ligne: (element.loc && element.loc.start.line) || 0 });
}

/*
 * ⚠️ DEUXIÈME ASSERTION : une entrée qu'on n'a pas su lire est une entrée qu'on
 *   ne contrôle PAS. On refuse de la compter comme « contrôlée ».
 */
if (nonAnalysables.length > 0) {
  console.error(rouge(`  [KO]  ${nonAnalysables.length} entrée(s) de route NON ANALYSABLE(S).`));
  for (const n of nonAnalysables) console.error(gris('        ' + n));
  console.error(gris('        ⛔ Une route qu\'on ne sait pas lire est une route qu\'on ne'));
  console.error(gris('           vérifie pas. Sortie en 2 : rien de conclu.'));
  process.exit(2);
}

/* ─── 2. LE CLASSEMENT : statique, paramétrée, attrape-tout ────────────────── */

const estParametree = (c) => c.includes(':') || c.includes('*') || c.includes('(');
const estAttrapeTout = (c) => c.includes('pathMatch') || c === '/:pathMatch(.*)*';

const statiques = [];
const parametrees = [];
let attrapeTout = 0;

for (const d of declarations) {
  if (estAttrapeTout(d.chemin)) attrapeTout++;
  else if (estParametree(d.chemin)) parametrees.push(d);
  else statiques.push(d);
}

/* ─── 3. LE BUILD : chaque route statique a-t-elle SA page ? ───────────────── */

const temoin = join(DIST, 'index.html');
if (!existsSync(temoin)) {
  console.error(rouge('  [KO]  dist/index.html est absent.'));
  console.error(gris('        Ce verrou mesure le BUILD, pas les sources : lancez `npm run build`.'));
  console.error(gris('        ⛔ Un verrou qui n\'a rien mesuré n\'est PAS un verrou tenu.'));
  process.exit(2);
}

/** `/` → dist/index.html · `/services` → dist/services/index.html */
function pageAttendue(chemin) {
  const propre = chemin.replace(/^\/+/, '').replace(/\/+$/, '');
  return propre === '' ? temoin : join(DIST, propre, 'index.html');
}

const pages = [];
for (const d of statiques) {
  const f = pageAttendue(d.chemin);
  const existe = existsSync(f);
  let octets = 0;
  let vide = false;
  if (existe) {
    octets = statSync(f).size;
    // Une page de 0 octet, ou réduite à sa coquille, n'est pas une page livrée.
    vide = octets < 512;
  }
  pages.push({ ...d, fichier: f, existe, octets, vide });
}

const livrees = pages.filter((p) => p.existe && !p.vide);
const absentes = pages.filter((p) => !p.existe);
const vides = pages.filter((p) => p.existe && p.vide);

/* ─── 4. LE .htaccess LIVRÉ : y a-t-il un repli SPA ? ──────────────────────── */

/*
 * ⭐⭐⭐ C'EST L'INFORMATION QUI MANQUAIT, ET ELLE CHANGE TOUT.
 *
 *   Une route déclarée sans page n'a pas la même conséquence selon le serveur :
 *     · AVEC repli SPA  → le serveur renvoie `index.html` en 200. Le visiteur
 *       voit l'accueil (ou une page blanche hydratée), le moteur y voit un
 *       DOUBLON de l'accueil. Défaut de SEO, pas de disponibilité.
 *     · SANS repli SPA  → **404 RÉEL**. Le lien est mort pour tout le monde.
 *
 *   ⚠️ Le `.htaccess` de ce dépôt déclare explicitement, depuis le 10/09/2026,
 *     qu'il n'y a PLUS de repli vers `/index.html`. Il faut donc le MESURER,
 *     pas le supposer : on lit le fichier LIVRÉ.
 *
 *   ⚠️ ET ON NE CONFOND PAS LE SERVICE DE FICHIER AVEC UN REPLI. Le fichier
 *     porte `RewriteRule ^(.*)$ $1/index.html [L]`, mais il est gardé par
 *     `RewriteCond %{REQUEST_FILENAME}/index.html -f` : il ne sert QUE ce qui
 *     existe. Un contrôle naïf crirait « repli SPA présent ». On regarde donc
 *     les conditions qui précèdent la règle.
 */
function analyserHtaccess(texte) {
  const res = { present: false, repli: false, forme: null, fichier: null };

  // Forme 1 — `FallbackResource /index.html` : repli explicite d'Apache.
  if (/^\s*FallbackResource\s+\S*index\.html/mi.test(texte)) {
    res.repli = true;
    res.forme = 'FallbackResource';
    return res;
  }

  // Forme 2 — `RewriteRule … /index.html` NON gardé par un test d'existence.
  const lignes = texte.split(/\r?\n/);
  let conditions = [];
  for (const brute of lignes) {
    const ligne = brute.trim();
    if (ligne === '' || ligne.startsWith('#')) continue;
    if (/^RewriteCond\b/i.test(ligne)) {
      conditions.push(ligne);
      continue;
    }
    if (/^RewriteRule\b/i.test(ligne)) {
      const cibleIndex = /index\.html/i.test(ligne);
      const testExistence = conditions.some((c) => /-[fdsl]\b/.test(c) || /REQUEST_FILENAME/.test(c));
      if (cibleIndex && !testExistence) {
        res.repli = true;
        res.forme = 'RewriteRule vers index.html sans test d\'existence';
      }
      conditions = [];
      continue;
    }
    conditions = [];
  }
  return res;
}

const cheminHtaccess = join(DIST, '.htaccess');
const racineHtaccess = join(RACINE, '.htaccess');
const sourceHtaccess = existsSync(cheminHtaccess) ? cheminHtaccess
  : existsSync(racineHtaccess) ? racineHtaccess : null;

let htaccess = { present: false, repli: false, forme: null, fichier: null };
if (sourceHtaccess) {
  htaccess = analyserHtaccess(readFileSync(sourceHtaccess, 'utf8'));
  htaccess.present = true;
  htaccess.fichier = sourceHtaccess.replace(RACINE + '\\', '').replace(RACINE + '/', '');
}

/* ─── 5. LA SORTIE ─────────────────────────────────────────────────────────── */

const mtime = statSync(temoin).mtime.toLocaleString('fr-FR');

L(`routeur analysé  : src/router/index.js (par arbre acorn, jamais par motif)`);
L(`build mesuré     : dist/ (${mtime})`);
L(`routes déclarées : ${declarations.length}`);
L(`  · statiques ............ ${statiques.length}   (vérifiables : une page par adresse)`);
L(`  · paramétrées ignorées . ${parametrees.length}   (adresse inconnue jusqu'à l'exécution)`);
L(`  · attrape-tout ignoré .. ${attrapeTout}`);
L('');

if (parametrees.length > 0) {
  for (const p of parametrees) L(gris(`  ignorée (paramétrée)  ${p.chemin}`));
  L(gris('    ⚠️ Une route paramétrée n\'a pas UNE page : elle en a autant que de'));
  L(gris('       valeurs. Le prérendu en sert une d\'exemple, ou aucune. On l\'ignore'));
  L(gris('       ICI, et on le DIT — une route ignorée en silence serait un angle mort'));
  L(gris('       de plus, exactement le défaut que ce fichier existe pour fermer.'));
  L('');
}
if (attrapeTout > 0) {
  L(gris('  ignoré (attrape-tout) la route 404 : elle N\'EST PAS une adresse, c\'est'));
  L(gris('    le filet. Elle n\'a pas à posséder un dossier à son nom.'));
  L('');
}

if (DETAIL) {
  L('Détail route par route :');
  for (const p of pages) {
    const marque = !p.existe ? '[--]' : p.vide ? '[!!]' : '[ok]';
    const taille = p.existe ? String(p.octets).padStart(7) + ' o' : '   absent';
    L(`  ${marque} ${String(p.chemin).padEnd(42)} ${taille}`);
  }
  L('');
}

L('─'.repeat(74));
L(`  pages attendues (routes statiques) : ${pages.length}`);
L(`  pages livrées et non vides ........ ${livrees.length}`);
if (absentes.length) L(jaune(`  pages ABSENTES .................... ${absentes.length}`));
if (vides.length) L(jaune(`  pages VIDES (< 512 o) ............. ${vides.length}`));
L('─'.repeat(74));
L('');

if (absentes.length || vides.length) {
  L(jaune('  ROUTES DÉCLARÉES SANS PAGE LIVRÉE — désignées, pas condamnées :'));
  L('');
  for (const p of absentes) {
    L(`  · ${p.chemin}`);
    L(gris(`      fichier attendu : dist${p.chemin === '/' ? '/index.html' : p.chemin + '/index.html'}`));
    L(gris(`      déclarée ligne ${p.ligne} du routeur · AUCUN fichier`));
  }
  for (const p of vides) {
    L(`  · ${p.chemin}`);
    L(gris(`      fichier présent mais ${p.octets} o : ce n\'est pas une page servie`));
  }
  L('');
} else {
  L(vert('  Chaque route statique du routeur a sa page dans dist/.'));
  L('');
}

/* ─── LE VERDICT SUR LE REPLI ──────────────────────────────────────────────── */

L('─'.repeat(74));
L('  CE QUE COÛTE UNE ROUTE SANS PAGE, SELON LE SERVEUR QUI LA SERT');
L('─'.repeat(74));

if (!htaccess.present) {
  L(jaune('  ⚠️  AUCUN .htaccess livré n\'a été trouvé (ni dist/, ni racine).'));
  L(gris('      On ne peut donc PAS dire ce que le serveur fera d\'une adresse sans'));
  L(gris('      fichier. Sur o2switch, c\'est le serveur qui décide — et ce n\'est pas'));
  L(gris('      mesuré ici. ⛔ On le dit au lieu de le supposer.'));
} else if (htaccess.repli) {
  L(jaune(`  ⚠️  REPLI SPA PRÉSENT (${htaccess.forme}) — lu dans ${htaccess.fichier}`));
  L(gris('      Conséquence : une adresse sans fichier renvoie l\'accueil en HTTP 200.'));
  L(gris('      Le visiteur ne voit pas d\'erreur, mais un moteur y voit un DOUBLON de'));
  L(gris('      l\'accueil. Défaut d\'indexation, pas de disponibilité.'));
} else {
  L(vert(`  AUCUN REPLI SPA — lu dans ${htaccess.fichier}`));
  L('');
  L(rouge('  ⛔ CONSÉQUENCE, ET C\'EST L\'INFORMATION QUI MANQUAIT JUSQU\'ICI :'));
  L('     Le `.htaccess` livre les pages prérendues une à une et ne retombe PAS');
  L('     sur /index.html. Donc TOUTE route déclarée sans page donne un');
  L(rouge('     404 RÉEL en production') + ' — pas une page blanche, pas l\'accueil :');
  L('     un lien mort, pour le visiteur comme pour le moteur.');
  L('');
  L(gris('     (Le fichier porte bien un `RewriteRule … index.html`, mais il est gardé'));
  L(gris('      par `RewriteCond … -f` : il ne sert QUE ce qui existe. Un contrôle naïf'));
  L(gris('      l\'aurait pris pour un repli SPA. On a regardé les conditions.'));
}

L('');
L('  ⭐ CE QUE CE VERROU NE VOIT PAS, ET IL LE DIT :');
L(gris('     · il ne juge pas le CONTENU d\'une page — une page peut exister, être'));
L(gris('       prérendue, et afficher n\'importe quoi ;'));
L(gris('     · il ne mesure pas le `dist/` DÉPLOYÉ, seulement le `dist/` local. Un'));
L(gris('       build plus vieux que le dernier commit n\'est pas vu ici.'));
L('='.repeat(78));
L('');

/* ─── L'INTERRUPTEUR, QUI APPARTIENT À GAËTAN ──────────────────────────────── */

const defauts = absentes.length + vides.length;

if (defauts === 0) {
  L(vert('  Aucun défaut à désigner : le build livre ce que le routeur déclare.'));
  L('='.repeat(78) + '\n');
  process.exit(0);
}

if (!BLOQUANT) {
  L(jaune(`  ${defauts} route(s) déclarée(s) sans page livrée — DÉSIGNÉES, non bloquantes.`));
  L(gris('  ⛔ Ce verrou DÉSIGNE ; il ne condamne pas encore. Poser BUILD_BLOQUANT=1'));
  L(gris('     le jour où ces routes seront livrées ou retirées du routeur.'));
  L('='.repeat(78) + '\n');
  process.exit(0);
}

L(rouge(`  BUILD_BLOQUANT=1 — ${defauts} route(s) déclarée(s) sans page livrée.`));
L('='.repeat(78) + '\n');
process.exit(1);
