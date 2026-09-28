#!/usr/bin/env node
// ============================================================================
// generer-sitemap.mjs — GL Digital Lab — 29/09/2026
//
// Écrit `cinematique/sitemap.xml` À PARTIR DES FICHIERS QUI EXISTENT.
//
// ═══════════════════════════════════════════════════════════════════════════
// POURQUOI CE FICHIER EXISTE — LE DÉFAUT MESURÉ, ET IL ÉTAIT DOUBLE
// ═══════════════════════════════════════════════════════════════════════════
//
// ① LE PLAN DE SITE DÉCLARAIT 5 URLS, LE SITE EN SERT 9.
//
//    Mesure du 29/09/2026, sur le fichier publié :
//        /  ·  /veille/  ·  /veille/2026-09-25.html
//        ·  /mentions-legales.html  ·  /confidentialite.html
//
//    Vérifié en 200 sur le serveur et ABSENT du plan :
//        /analyses/   ·  /formation/   ·  et le dossier pédagogique
//    ⇒ **Quatre pages publiées n'étaient déclarées nulle part.** Une page que le
//      plan ignore est une page que les moteurs trouvent par hasard.
//
// ② ET SON EN-TÊTE ATTRIBUAIT LA GÉNÉRATION À UN SCRIPT QUI NE L'A JAMAIS FAITE.
//
//    Le fichier disait : « ENGENDRÉ par outils-pilotage/veille-generer-articles.mjs ».
//    Ce script porte `const SITE = 'C:\\IA\\ArkAdiA\\cinematique-neo'` — **un chemin
//    absolu en dur vers un AUTRE projet.** Il n'a jamais écrit ce fichier.
//
//    ⛔ *Un en-tête qui décrit une intention non tenue est pire qu'aucun en-tête :
//       il fait croire que le contrôle a eu lieu.* C'est la même leçon que le
//       commentaire du gabarit qui se disait « reconstruit à partir de ce qui
//       EXISTE » en recopiant une liste figée.
//
// ═══════════════════════════════════════════════════════════════════════════
// ⚠️ DEUX PIÈGES ÉVITÉS EN ÉCRIVANT CE FICHIER — ils sont notés pour la suite
// ═══════════════════════════════════════════════════════════════════════════
//
//   · `scripts/generer-sitemap.mjs` EXISTE DÉJÀ dans ce dépôt — et il n'écrit PAS
//     le même fichier : il écrit `public/sitemap.xml` à partir de
//     `src/config/topographie.js`, pour **l'application Vue** du site.
//     Deux projets cohabitent dans `portfolio-gaetan`. *Ne pas confondre les deux :
//     j'ai modifié le mauvais générateur avant de m'en apercevoir.*
//
//   · `outils-pilotage/veille-generer-articles.mjs` (dépôt du studio) écrit lui
//     aussi un `sitemap.xml` — dans `ArkAdiA/cinematique-neo/public/`. **Troisième
//     fichier du même nom, troisième projet.** *Trois « sitemap.xml » sur la même
//     machine : on ne peut pas les traiter par analogie, il faut lire où chacun écrit.*
//
// ═══════════════════════════════════════════════════════════════════════════
// LA RÈGLE
// ═══════════════════════════════════════════════════════════════════════════
//
//   « une URL n'entre dans le plan que si le fichier EXISTE sur le disque. »
//
//   Le générateur DÉCOUVRE, il ne recopie pas de liste. Une page ajoutée demain
//   entre dans le plan sans que personne ait à y penser — c'est précisément ce
//   qui manquait : les listes écrites à la main deviennent fausses en silence.
//
//   ⛔ CE QU'ON N'Y MET PAS, ET POURQUOI (ce n'est pas un oubli) :
//     · `/llms.txt`, `/.well-known/security.txt`, `sitemap.xml` — ce ne sont pas
//       des pages. Un plan de site déclare des documents destinés à un lecteur,
//       pas des fichiers de service.
//     · `sources/` — c'est un dossier de travail, il n'est pas publié.
//     · tout ce qui commence par `.` ou `_`.
//
// Usage :
//   node outils/generer-sitemap.mjs            (écrit cinematique/sitemap.xml)
//   node outils/generer-sitemap.mjs --verifier (n'écrit RIEN, compare et sort 1 si périmé)
//
// Codes : 0 = à jour (ou écrit)  ·  1 = périmé (mode --verifier)  ·  2 = site introuvable
// ============================================================================

import { readdirSync, existsSync, statSync, writeFileSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ICI = path.dirname(fileURLToPath(import.meta.url));
const RACINE_SITE = path.resolve(ICI, '..');
const CINEMA = path.join(RACINE_SITE, 'cinematique');
const SITEMAP = path.join(CINEMA, 'sitemap.xml');
const DOMAINE = 'https://gldigitallab.fr';

const VERIFIER = process.argv.includes('--verifier');

if (!existsSync(CINEMA)) {
  console.error(`⛔ ${CINEMA} est introuvable — ce script doit vivre dans le dépôt du site.`);
  process.exit(2);
}

/* ------------------------------------------------------------------ *
 * ① LA DÉCOUVERTE — jamais une liste écrite à la main
 * ------------------------------------------------------------------ */

/** Les dossiers qui ne sont PAS des pages même s'ils contiennent un index.html. */
const DOSSIERS_EXCLUS = new Set(['sources', 'node_modules', 'outils', '.git']);

/** ⛔ LES FICHIERS QUI NE SE DÉCLARENT JAMAIS DANS UN PLAN DE SITE — et ce n'est pas un oubli.
 *
 *  · `index.html` — il EST la racine. Le déclarer en plus de `/` produit **la même page
 *    deux fois** : un plan qui se répète fait douter de tout le reste.
 *  · `404.html` et consorts — une page d'ERREUR n'est pas un document destiné à un
 *    lecteur : elle ne s'atteint pas, elle arrive quand on s'est trompé. La déclarer,
 *    c'est inviter un moteur à indexer une page qui n'existe pas pour être lue.
 *
 *  ⚠️ MESURÉ LE 29/09/2026 : la première version de ce générateur a produit ces deux
 *     lignes-là. *Un générateur juste sur la découverte peut rester faux sur la
 *     sélection — découvrir n'est pas décider.*
 */
const FICHIERS_EXCLUS = new Set(['index.html', '404.html', '500.html', '403.html']);

function decouvrir() {
  const pages = [];
  const entrees = readdirSync(CINEMA, { withFileTypes: true })
    .sort((a, b) => a.name.localeCompare(b.name)); // tri déterministe : rejouable

  for (const e of entrees) {
    if (e.name.startsWith('.') || e.name.startsWith('_')) continue;
    if (DOSSIERS_EXCLUS.has(e.name)) continue;

    if (e.isDirectory()) {
      // un dossier n'est une page que s'il porte un index.html
      const idx = path.join(CINEMA, e.name, 'index.html');
      if (existsSync(idx)) {
        pages.push({ url: `/${e.name}/`, fichier: idx, freq: 'monthly', prio: '0.8' });
      }
      // ⚠️ ON N'ENTRE PAS DANS LES SOUS-DOSSIERS EN PROFONDEUR ICI : les relevés de
      //    veille sont datés et gérés par leur propre générateur. Les découvrir deux
      //    fois produirait des doublons dans le plan.
    } else if (e.name.endsWith('.html') && !FICHIERS_EXCLUS.has(e.name)) {
      pages.push({ url: `/${e.name}`, fichier: path.join(CINEMA, e.name), freq: 'yearly', prio: '0.3' });
    }
  }
  return pages;
}

/* ------------------------------------------------------------------ *
 * ② LES RELEVÉS DE VEILLE — datés, donc triés du plus récent au plus ancien
 * ------------------------------------------------------------------ */

function decouvrirReleves() {
  const dossier = path.join(CINEMA, 'veille');
  if (!existsSync(dossier)) return [];
  return readdirSync(dossier)
    .filter((f) => /^\d{4}-\d{2}-\d{2}\.html$/.test(f))
    .sort()
    .reverse()
    .slice(0, 30);
}

/* ------------------------------------------------------------------ *
 * ③ LE PLAN — engendré
 * ------------------------------------------------------------------ */

const pages = decouvrir();
const releves = decouvrirReleves();

// ⛔ LA RACINE EST DÉCLARÉE EN PREMIER, ET ELLE N'EST PAS UN DOSSIER :
//    `cinematique/index.html` est la page d'accueil du domaine.
const lignes = [];
lignes.push(ligne('/', path.join(CINEMA, 'index.html'), 'weekly', '1.0'));

// ⚠️ `veille/` EST DÉJÀ DÉCOUVERT PAR `decouvrir()` — il porte un index.html.
//    La première version de ce générateur le redéclarait ici « en plus », ce qui
//    produisait **la même URL deux fois** dans le plan. *Troisième défaut du même
//    genre en une heure : je découvrais juste et je sélectionnais mal.* On le retire
//    donc de la liste découverte pour ne le réémettre qu'une fois, avec ses vraies
//    valeurs (quotidien, priorité 0.7 — c'est un relevé, pas une page ordinaire).
const estVeille = (p) => p.url === '/veille/';
for (const p of pages) if (!estVeille(p)) lignes.push(ligne(p.url, p.fichier, p.freq, p.prio));

// le dossier de veille lui-même, puis ses relevés — une seule fois chacun
if (existsSync(path.join(CINEMA, 'veille', 'index.html'))) {
  lignes.push(ligne('/veille/', path.join(CINEMA, 'veille', 'index.html'), 'daily', '0.7'));
}
for (const f of releves) {
  lignes.push(ligne(`/veille/${f}`, path.join(CINEMA, 'veille', f), 'monthly', '0.5'));
}

/* ------------------------------------------------------------------ *
 * ③ bis — LE GARDE-FOU CONTRE LE DOUBLON, PARCE QU'IL EST ARRIVÉ
 * ------------------------------------------------------------------ */

/** ⛔ UNE ASSERTION, PAS UNE INTENTION.
 *  Trois défauts successifs de ce générateur venaient tous de la même chose :
 *  une URL émise deux fois, ou une URL émise pour un fichier qui n'est pas une page.
 *  On le vérifie donc à la sortie, et on refuse d'écrire un plan malformé.
 *  *Un contrôle qui vit à la fin du script est le seul qui voit ce que le script a fait.* */
const doublons = lignes
  .map((l) => (l.match(/<loc>([^<]+)<\/loc>/) || [])[1])
  .filter((u, i, t) => u && t.indexOf(u) !== i);
if (doublons.length) {
  console.error('⛔ PLAN MALFORMÉ — URL(s) déclarée(s) deux fois : ' + [...new Set(doublons)].join(', '));
  console.error('   Le fichier n\'a PAS été écrit. Corrige la sélection avant de recommencer.');
  process.exit(1);
}

function ligne(url, fichier, freq, prio) {
  // ⚠️ `lastmod` = la date de modification RÉELLE du fichier, pas la date du jour.
  //    Écrire la date du jour partout est un mensonge de fraîcheur : un moteur qui
  //    le croit revient pour rien, et finit par ne plus croire le plan du tout.
  let modif = '';
  try {
    modif = statSync(fichier).mtime.toISOString().slice(0, 10);
  } catch {
    modif = new Date().toISOString().slice(0, 10);
  }
  return `  <url><loc>${DOMAINE}${url}</loc><lastmod>${modif}</lastmod><changefreq>${freq}</changefreq><priority>${prio}</priority></url>`;
}

const EN_TETE = `<?xml version="1.0" encoding="UTF-8"?>
<!-- Plan de site — ENGENDRÉ par outils/generer-sitemap.mjs le ${new Date().toISOString().slice(0, 10)}.
     ⛔ Ne pas modifier à la main : la liste est DÉCOUVERTE sur le disque à chaque exécution.
        *Un plan qu'on complète à la main finit par déclarer des pages mortes — l'ancien
        en avait 37 sur 38, et celui-ci en oubliait 4 sur 9.*

     ⚠️ CE FICHIER A DÉJÀ MENTI DEUX FOIS, ET C'EST POUR ÇA QU'IL EST ENGENDRÉ :
        · le 25/09/2026 il déclarait « ENGENDRÉ par veille-generer-articles.mjs », un script
          qui écrit dans un AUTRE projet (chemin absolu en dur vers ArkAdiA/cinematique-neo)
          et qui n'a jamais touché ce fichier ;
        · il déclarait 5 URLs quand le site en servait 9 — /analyses/ et /formation/
          étaient publiées, vérifiées en 200, et absentes du plan.

     ⛔ CE QUI N'EST PAS DÉCLARÉ ICI, ET CE N'EST PAS UN OUBLI : llms.txt,
        .well-known/security.txt et sitemap.xml ne sont pas des pages — un plan de site
        déclare des documents destinés à un lecteur, pas des fichiers de service. -->
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;

const sitemap = EN_TETE + lignes.join('\n') + '\n</urlset>\n';

/* ------------------------------------------------------------------ *
 * ④ LA SORTIE — et le mode qui ne ment pas
 * ------------------------------------------------------------------ */

const resume = [
  `  ${pages.length} page(s) découverte(s) dans cinematique/`,
  `  ${releves.length} relevé(s) de veille`,
  `  ⇒ ${lignes.length} URL(s) déclarée(s) au total`,
  '',
];

if (VERIFIER) {
  // ⛔ MODE CONTRÔLE : il n'écrit RIEN. C'est ce qui permet de le brancher dans un
  //    pipeline sans qu'il modifie l'artefact qu'il vérifie.
  if (!existsSync(SITEMAP)) {
    console.error('⛔ le plan de site est ABSENT.');
    process.exit(1);
  }
  const actuel = readFileSync(SITEMAP, 'utf8');
  // on compare les URLS, pas l'en-tête : sa date du jour changerait à chaque exécution
  const urlsDe = (t) => (t.match(/<loc>([^<]+)<\/loc>/g) || []).sort().join('\n');
  const attendu = urlsDe(sitemap);
  const present = urlsDe(actuel);
  if (attendu !== present) {
    const a = new Set(attendu.split('\n'));
    const p = new Set(present.split('\n'));
    console.error('⛔ LE PLAN DE SITE EST PÉRIMÉ — il ne correspond plus aux fichiers sur le disque.');
    for (const u of a) if (!p.has(u)) console.error('   MANQUE  : ' + u.replace(/<\/?loc>/g, ''));
    for (const u of p) if (!a.has(u)) console.error('   EN TROP : ' + u.replace(/<\/?loc>/g, ''));
    console.error('   → node outils/generer-sitemap.mjs');
    process.exit(1);
  }
  console.log('✅ plan de site à jour — ' + lignes.length + ' URL(s).');
  process.exit(0);
}

writeFileSync(SITEMAP, sitemap, 'utf8');
console.log('');
console.log('  PLAN DE SITE — ENGENDRÉ');
console.log('  ' + '─'.repeat(66));
for (const r of resume) console.log(r);
console.log(`  écrit : ${path.relative(RACINE_SITE, SITEMAP)}`);
console.log('');
