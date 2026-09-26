#!/usr/bin/env node
/**
 * PROTEGER LES PAGES DU STUDIO CONTRE `deploy-cinematique`
 *
 * Écrit le 26/09/2026, sur une panne MESURÉE : les 48 pages du studio sont passées
 * en 404 sur `gldigitallab.fr`.
 *
 * ── CE QUI S'EST PASSÉ, LU DANS LE LOG DU RUN ────────────────────────────────────
 *
 *     removing "site.webmanifest"
 *     removing "vendor/three.min.js"
 *     removing folder "//public_html/api"
 *     FTPError: 550 Can't change directory to //public_html/api: No such file or directory
 *
 * ⛔ `deploy-cinematique.yml` déploie `./cinematique/` vers `/public_html/` — **la racine
 *    du domaine** — et **l'action FTP supprime en distant tout ce qui n'est pas dans
 *    `local-dir`.**
 *
 * ⚠️ **ET `dangerous-clean-slate: false` NE L'EN EMPÊCHE PAS.** Ce réglage ne concerne que
 *    le **nettoyage complet** ; c'est la **synchronisation incrémentale** qui supprime, et
 *    elle le fait dans tous les cas. *Le studio avait cru se protéger avec une option qui
 *    ne protège pas de ça.*
 *
 * ⇒ Il a effacé `/dossier`, `/demos/`, `/univers/`, `/plan/`, `/components`, `/le-pont/`,
 *   `/monde/`, `/vendor/three.min.js`, `/api`… puis il a **échoué** sur un dossier qu'il
 *   venait lui-même de supprimer. **Un déploiement qui se détruit son propre chemin.**
 *
 * ── LA CORRECTION, ET ELLE NE S'ÉCRIT PAS À LA MAIN ─────────────────────────────
 *
 * ⛔ On ne recopie pas une liste de dossiers : **un chiffre écrit à la main devient faux
 *    sans le dire**, et c'est la loi 3 de l'atelier.
 *
 * ⇒ Ce script **lit `dist/`** — ce que `deploy.yml` a réellement construit — et il en
 *   déduit **tout ce que `deploy-cinematique` n'a PAS le droit de supprimer.**
 *   ⭐ *La liste de protection est dérivée de la liste réelle, pas d'un souvenir.*
 *
 * ⚠️ **Et `cinematique` est exclu de SA PROPRE protection** : le dossier doit rester
 *   disponible pour la seconde étape du workflow, celle qui pose la redirection.
 *
 * Usage :
 *   node proteger-pages-studio.mjs            # applique
 *   node proteger-pages-studio.mjs --essai    # montre le bloc, n'écrit rien
 */

import { readdirSync, readFileSync, writeFileSync, existsSync, statSync } from 'node:fs';
import { join } from 'node:path';

const RACINE = 'C:\\IA\\_a-trier\\2026-09-24\\code-portfolio-gaetan';
const DIST = join(RACINE, 'dist');
const CINEMATIQUE = join(RACINE, 'cinematique');
const WORKFLOW = join(RACINE, '.github', 'workflows', 'deploy-cinematique.yml');
const WORKFLOW_DEPLOY = join(RACINE, '.github', 'workflows', 'deploy.yml');

const ESSAI = process.argv.includes('--essai');
const dire = (l = '') => console.log(l);
let echecs = 0;

dire('='.repeat(78));
dire('PROTEGER LES PAGES DU STUDIO CONTRE deploy-cinematique');
dire('='.repeat(78));

if (!existsSync(DIST)) {
  dire(`ARRET : ${DIST} est introuvable. Le build n'a pas tourne — on ne devine pas la liste.`);
  process.exit(2);
}
if (!existsSync(CINEMATIQUE)) {
  dire(`ARRET : ${CINEMATIQUE} est introuvable.`);
  process.exit(2);
}

// ─── ⭐ CORRIGÉ LE 26/09/2026 : ON PROTÈGE PAR DÉFAUT, ON EXCEPTE PAR ÉCRITURE ───
//
// ⛔ CE QUI ÉTAIT FAUX, ET QUI N'A JAMAIS PU S'ÉCRIRE. La version précédente retirait
//    de la protection TOUT ce que la cinématique possédait — **par NOM**. Or les deux
//    sites ont chacun un `vendor/` (three.js). Le script excluait donc `vendor` de la
//    protection… c'est-à-dire qu'il laissait `deploy-cinematique` **supprimer le
//    `/vendor/` du studio** — *la panne même qu'il était écrit pour empêcher.*
//    ⭐ Et son assertion l'a arrêté net : **le garde-fou a refusé d'écrire un garde-fou
//    qui ne mord pas.** C'est exactement ce qu'on lui demande. Il a donc refusé deux
//    fois, et personne ne l'a écouté — *un contrôle qu'on n'exécute pas ne dit rien.*
//
// ⇒ LA RÈGLE, DÉSORMAIS : **une collision de nom ne fait pas céder la protection.**
//   On ne supprime pas. Et si un fichier doit vraiment céder, il est **nommé ici**,
//   un par un, avec sa raison — jamais déduit d'une ressemblance.
const CEDENT_A_LA_CINEMATIQUE = new Set([
  // ⭐ LA RACINE APPARTIENT AU SITE CINÉMATIQUE — décision de Gaëtan, 26/09/2026.
  //    Son `index.html` doit donc pouvoir s'écrire à la racine. **Le seul.**
  'index.html',
]);

// ─── ⭐ LA PROTECTION DESCEND AU FICHIER QUAND LE DOSSIER EST PARTAGÉ ──────────
//
// ⛔⛔ MESURÉ LE 26/09/2026, APRÈS LE DÉPLOIEMENT : protéger `vendor/**` a SAUVÉ le
//    `three.min.js` du studio (608 Ko, servi en 200 à `/vendor/three.min.js`) **et a
//    CASSÉ la cinématique** — `/vendor/three.module.min.js` et `/vendor/jsm/*/…`
//    répondent **404**, parce qu'exclus, ils ne sont jamais montés.
//
//    ⭐ Les deux sites ont un `vendor/` **et ils n'y mettent PAS les mêmes fichiers** :
//         studio      : three.min.js          (608 087 o, build classique)
//         cinématique : three.module.min.js   (678 491 o, ESM) + jsm/{loaders,utils,environments}
//    ⇒ *Ce n'était pas une collision de noms : c'était un DOSSIER partagé par deux
//      propriétaires. Protéger le dossier entier protégeait au-delà de ce qui risquait
//      d'être supprimé — et bloquait ce qui devait passer.*
//
//    ⇒ LA RÈGLE : **quand un dossier de `dist/` porte le même nom qu'un dossier de la
//      cinématique, on ne protège plus le dossier : on énumère SES FICHIERS.** Le fichier
//      du studio est préservé, et les autres passent.
const nomsCoteCinematique = new Set(readdirSync(CINEMATIQUE));

function listerFichiersRelatifs(dir, prefixe = '') {
  const out = [];
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    if (e.name.startsWith('.')) continue;
    const rel = prefixe ? `${prefixe}/${e.name}` : e.name;
    if (e.isDirectory()) out.push(...listerFichiersRelatifs(join(dir, e.name), rel));
    else out.push(rel);
  }
  return out;
}

// ─── Tout le reste de dist/ appartient au studio ──────────────────────────────
const entrees = readdirSync(DIST);
const aProteger = [];
for (const e of entrees) {
  if (CEDENT_A_LA_CINEMATIQUE.has(e)) continue;   // nommé, pas deviné
  if (e === '.ftp-deploy-sync-state.json') continue;
  if (e.startsWith('.')) continue;      // les fichiers cachés : l'action les ignore déjà
  const complet = join(DIST, e);
  const estDossier = statSync(complet).isDirectory();

  // ⭐ Le cas `vendor` : même nom des deux côtés, contenus différents. On descend.
  if (estDossier && nomsCoteCinematique.has(e)) {
    for (const rel of listerFichiersRelatifs(complet, e)) {
      aProteger.push({ nom: rel, dossier: false });
    }
    continue;
  }

  aProteger.push({ nom: e, dossier: estDossier });
}

dire('');
dire(`  ce qui cede a la cinematique (${CEDENT_A_LA_CINEMATIQUE.size}) : ${[...CEDENT_A_LA_CINEMATIQUE].join(', ')}`);
dire(`  dist/ porte ${entrees.length} entrees`);
dire(`  A PROTEGER : ${aProteger.length} entrees`);
dire('');
dire('  --- la liste, derivee du disque, pas d\'un souvenir ---');
for (const x of aProteger) dire(`      ${x.dossier ? '[D]' : '[F]'} ${x.nom}`);

// ⛔ L'ASSERTION : les pages qu'on a vues en 404 doivent être dans la liste.
//    ⚠️ Et depuis le 26/09, une entrée peut être couverte **par fichier** (`vendor/three.min.js`)
//    et non plus par dossier (`vendor/**`) : le test accepte donc les deux formes.
const obligatoires = ['dossier', 'demos', 'univers', 'plan', 'components', 'le-pont', 'monde', 'vendor', 'api'];
const manquantes = obligatoires.filter((o) => !aProteger.some((x) => x.nom === o || x.nom.startsWith(o + '/')));
if (manquantes.length > 0) {
  dire('');
  dire(`  ⛔ ECHEC D'ASSERTION : ${manquantes.length} entree(s) que l'on SAIT en 404 ne sont pas`);
  dire(`     dans la liste de protection : ${manquantes.join(', ')}`);
  dire('     => on n\'ecrit pas un garde-fou qui laisse passer ce qu\'il doit arreter.');
  process.exit(1);
}
dire('');
dire(`  ✅ ASSERTION 1 : les ${obligatoires.length} entrees vues en 404 sont bien protegees.`);

// ⛔ ASSERTION 2, ET ELLE VAUT DANS L'AUTRE SENS. Si `index.html` se retrouvait dans la
//    liste de protection, le site cinématique ne pourrait PLUS prendre la racine — le
//    garde-fou bloquerait exactement ce qu'il doit laisser passer.
//    *Un garde-fou qui mord dans les deux sens n'est pas prudent : il est cassé.*
if (aProteger.some((x) => x.nom === 'index.html')) {
  dire('');
  dire("  ⛔ ECHEC D'ASSERTION 2 : `index.html` est dans la liste de protection.");
  dire('     Or la racine appartient au site cinematique : protege, il ne pourrait plus y ecrire.');
  process.exit(1);
}
dire("  ✅ ASSERTION 2 : index.html n'est PAS protege — la cinematique garde la racine.");

// ─── Le bloc YAML ─────────────────────────────────────────────────────────────
//
// ⛔ 12 ESPACES, PAS 10 — et ce n'est pas une coquetterie d'indentation.
//    Le contenu d'un bloc littéral `|` doit être indenté PLUS que sa clé. Écrit à
//    10 espaces, il se retrouvait au même niveau que `exclude:` — et YAML lisait
//    `404.html` comme une NOUVELLE CLÉ.
//    ⭐ Mesure : `ScannerError: while scanning a simple key … line 103, column 11`,
//      et le run **36223085030 est mort en 0 seconde**, avant toute étape. GitHub
//      affichait seulement « This run likely failed because of a workflow file issue. »
//    ⭐ Et le script, lui, avait annoncé « ecrit et relu a l'identique ». *C'était
//      vrai — et le fichier était faux.* Relire ne prouve pas : ça rassure.
//    ⇒ Le contrôle qui manquait est ajouté plus bas, et il porte sur l'INDENTATION.
const lignesExclude = aProteger
  .map((x) => `            ${x.nom}${x.dossier ? '/**' : ''}`)
  .join('\n');

const bloc = `          # ⛔⛔ PROTECTION DES PAGES DU STUDIO — AJOUTEE LE 26/09/2026 APRES UNE PANNE.
          #
          # ⚠️ CE QUI S'EST PASSE, LU DANS LE LOG DU RUN :
          #      removing "vendor/three.min.js"
          #      removing folder "//public_html/api"
          #      FTPError: 550 Can't change directory to //public_html/api
          #    Les 48 pages du studio sont passees en 404 — /dossier, /demos/, /univers/,
          #    /plan/, /components, /le-pont/, /monde/.
          #
          # ⛔ LA CAUSE : cette etape deploie ./cinematique/ vers /public_html/ — la RACINE —
          #    et l'action FTP **supprime en distant tout ce qui n'est pas dans local-dir**.
          #    ⚠️ Et \`dangerous-clean-slate: false\` n'empeche RIEN de cela : ce reglage ne
          #       concerne que le nettoyage complet, pas la synchronisation incrementale.
          #
          # ⭐ LA LISTE CI-DESSOUS N'EST PAS ECRITE A LA MAIN : elle est DERIVEE de dist/,
          #    par \`scripts/proteger-pages-studio.mjs\`, qui refuse d'ecrire si une page
          #    connue comme cassee n'y figure pas. *Un chiffre ecrit a la main devient faux
          #    sans le dire.*
          #
          # ⚠️ Regenerer apres toute page nouvelle : node scripts/proteger-pages-studio.mjs
          exclude: |
${lignesExclude}
`;

// ─── On l'insère dans deploy-cinematique.yml ──────────────────────────────────
if (!existsSync(WORKFLOW)) {
  dire(`  ⛔ ARRET : ${WORKFLOW} est introuvable.`);
  process.exit(2);
}
let yml = readFileSync(WORKFLOW, 'utf8');

if (yml.includes('PROTECTION DES PAGES DU STUDIO')) {
  dire('');
  dire('  ⚠️  le bloc de protection est DEJA present — on le remplace (regeneration).');
  // On retire l'ancien bloc, de son commentaire a la fin de sa liste d'exclusion.
  const debut = yml.indexOf('          # ⛔⛔ PROTECTION DES PAGES DU STUDIO');
  if (debut !== -1) {
    // ⚠️ ET LE MÊME PIÈGE SE REFAISAIT ICI : le fichier est en **CRLF**, donc
    //    `indexOf('          exclude: |\n')` ne matche PAS — l'ancien bloc n'était pas
    //    retiré, et on en insérait un SECOND. *On cherche par MOTIF, jamais par chaîne
    //    exacte dans un fichier dont on ne maîtrise pas les fins de ligne.*
    const dEx = yml.slice(debut).search(/^ {10}exclude: \|\r?$/m);
    if (dEx !== -1) {
      const dExAbs = debut + dEx;
      const apres = yml.slice(dExAbs).search(/^ {10}dangerous-clean-slate/m);
      const fin = apres !== -1 ? dExAbs + apres : dExAbs + 1;
      yml = yml.slice(0, debut) + yml.slice(fin);
    }
  }
}

// L'ancre : la première occurrence de `dangerous-clean-slate` (l'envoi vers la racine).
const ancre = '          dangerous-clean-slate: false';
const iAncre = yml.indexOf(ancre);
if (iAncre === -1) {
  dire(`  ⛔ ARRET : l'ancre "dangerous-clean-slate" est introuvable dans le workflow.`);
  dire('     On ne devine pas ou inserer le bloc.');
  process.exit(2);
}

const nouveau = yml.slice(0, iAncre) + bloc + yml.slice(iAncre);

if (ESSAI) {
  dire('');
  dire('  (essai — rien n\'a ete ecrit)');
  dire('');
  dire(bloc);
  process.exit(0);
}

// ⛔ ASSERTION avant écriture : le bloc est là, et les pages protégées y sont.
//    ⚠️ TROIS FORMES ACCEPTÉES DEPUIS LE 26/09, et c'est l'assertion elle-même qui l'a exigé :
//       `dossier/**`  ·  `dossier`  ·  `dossier/fichier` (le cas `vendor`).
//    ⭐ Elle a REFUSÉ d'écrire quand `vendor/**` est devenu `vendor/three.min.js` — *un
//       garde-fou qui n'accepte qu'une écriture connue refuse aussi les corrections.*
//    ⇒ On élargit la forme, **jamais l'exigence** : l'entrée doit être protégée, d'une
//      manière ou d'une autre.
if (!nouveau.includes('PROTECTION DES PAGES DU STUDIO')) { dire('  ⛔ le bloc n\'a pas ete insere'); echecs++; }
for (const o of obligatoires) {
  const protege =
    nouveau.includes(`            ${o}/**`) ||
    nouveau.includes(`            ${o}\n`) ||
    nouveau.includes(`            ${o}/`);
  if (!protege) {
    dire(`  ⛔ ${o} absent du bloc ecrit`);
    echecs++;
  }
}
if (echecs > 0) { dire(`  ⛔ ${echecs} echec(s) — RIEN N'A ETE ECRIT`); process.exit(1); }

writeFileSync(WORKFLOW, nouveau, 'utf8');
const relu = readFileSync(WORKFLOW, 'utf8');
if (relu !== nouveau) { dire('  ⛔ le fichier relu differe de ce qui a ete ecrit'); process.exit(1); }

// ⛔⛔ L'ASSERTION QUI MANQUAIT : CE QUI EST ÉCRIT DOIT ÊTRE UN YAML VALIDE.
//
// ⭐ *« relu à l'identique » ne veut pas dire « correct ».* On a su écrire un fichier
//    invalide, et le relire ne l'a pas démenti — c'est la CI qui l'a démenti, en
//    **0 seconde**, avec pour tout message « a workflow file issue ».
// ⇒ Ce contrôle-ci est structurel : il vérifie l'indentation du bloc littéral, qui est
//   exactement ce qui avait cassé. *Deux écritures successives ont échoué ici pour la
//   même raison — un contrôle qui regarde ce qu'on a fait au lieu de regarder ce que
//   ça donne.*
const lignesFichier = relu.split(/\r?\n/);
const iEx = lignesFichier.findIndex((l) => l.trim() === 'exclude: |');
if (iEx === -1) {
  dire("  ⛔ le bloc `exclude: |` est introuvable dans le fichier ecrit"); process.exit(1);
}
const indCle = lignesFichier[iEx].length - lignesFichier[iEx].trimStart().length;
const suivante = lignesFichier[iEx + 1] || '';
const indSuiv = suivante.length - suivante.trimStart().length;
if (!(indSuiv > indCle)) {
  dire('');
  dire(`  ⛔ YAML INVALIDE : la 1re entree d'exclusion est a ${indSuiv} espaces,`);
  dire(`     et la cle \`exclude:\` a ${indCle}. Le contenu d'un bloc litteral doit etre`);
  dire('     indente PLUS que sa cle — sinon YAML lit la 1re entree comme une cle.');
  dire('     Le workflow serait refuse par GitHub, comme le run 36223085030.');
  process.exit(1);
}
dire(`  ✅ YAML verifie : le bloc est a ${indSuiv} espaces, la cle \`exclude:\` a ${indCle}.`);
dire('');
dire(`  ✅ deploy-cinematique.yml protege ${aProteger.length} entrees, ecrit et relu a l'identique.`);

// ─── Et la correction de deploy.yml : la syntaxe de l'action ──────────────────
//
// ⛔ MESURE : `exclude: /index.html` N'A PAS MATCHE. L'action attend des chemins
//    RELATIFS A local-dir, sans slash initial. La preuve : apres le run 36218713139,
//    la racine servait de nouveau la vitrine ArkAdiA — donc `dist/index.html` a bien
//    ete envoye malgre l'exclusion.
if (existsSync(WORKFLOW_DEPLOY)) {
  let d = readFileSync(WORKFLOW_DEPLOY, 'utf8');

  // ⛔⛔ DEUXIÈME ÉCHEC, PAYÉ DANS LA MINUTE QUI A SUIVI LE PREMIER.
  //
  // La version précédente écrivait :
  //     d = d.replace('            /index.html\n', '            index.html\n')
  // **Le fichier est en CRLF.** Donc `\n` ne matche jamais, le `replace` ne fait rien,
  // et la branche `else` annonçait **« rien a corriger (deja en chemins relatifs) »**.
  // ⭐ *Un remplacement qui échoue en silence, et qui se présente comme un succès.*
  //    C'est le défaut du script qui affichait « 0 échec », dans un autre fichier.
  // ⇒ On matche donc `\r?\n`, ET ON VÉRIFIE LE RÉSULTAT au lieu de le supposer.
  const avant = d;
  d = d.replace(/^ {12}\/index\.html\r?\n/m, '            index.html\n');
  d = d.replace(/^ {12}\/cinematique\/\*\*\r?\n/m, '            cinematique/**\n');

  // ⭐ L'ASSERTION, ET C'EST ELLE QUI MANQUAIT : après correction, AUCUNE ligne
  //    d'exclusion ne doit plus commencer par « / ». On relit le texte, on ne se
  //    contente pas de constater qu'on a appelé `replace`.
  const restes = (d.match(/^ {12}\/[^\r\n]*/gm) || []);
  if (restes.length > 0) {
    dire('');
    dire(`  ⛔ ECHEC : deploy.yml porte encore ${restes.length} exclusion(s) a slash initial :`);
    for (const r of restes) dire(`       ${r.trim()}`);
    dire("     L'action attend des chemins RELATIFS a local-dir. Une exclusion qui ne");
    dire('     mord pas est une exclusion qui n\'existe pas.');
    process.exit(1);
  }

  if (d !== avant) {
    const avecNote = d.replace(
      '          exclude: |',
      `          # ⚠️ CHEMINS RELATIFS A local-dir, SANS SLASH INITIAL — corrige le 26/09/2026.\n          #    La premiere version ecrivait \`/index.html\`. Elle n'a PAS matche : la preuve\n          #    est que la racine a resservi la vitrine ArkAdiA apres le run 36218713139.\n          #    *Une exclusion qui ne mord pas est une exclusion qui n'existe pas.*\n          exclude: |`
    );
    writeFileSync(WORKFLOW_DEPLOY, avecNote, 'utf8');
    const r2 = readFileSync(WORKFLOW_DEPLOY, 'utf8');
    if (r2 !== avecNote) { dire('  ⛔ deploy.yml : le fichier relu differe'); process.exit(1); }
    dire('  ✅ deploy.yml : les deux exclusions sont passees en chemins relatifs.');
  } else {
    dire('  ⚠️  deploy.yml : rien a corriger (deja en chemins relatifs).');
  }
}
dire('='.repeat(78));
