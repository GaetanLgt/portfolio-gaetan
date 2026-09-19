#!/usr/bin/env node
/**
 * generer-etat.mjs — LE RELEVÉ DU BUILD, mesuré et baké dans la page.
 * GL Digital Lab · 19/09/2026
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * POURQUOI CE FICHIER EXISTE
 * Demande de Gaëtan : « un site vivant qui réagit en temps réel, pas un site
 * statique ou mort ». La page `/etat-du-studio` répond par un principe qui
 * commande tout le reste :
 *
 *   RIEN DE SIMULÉ. AUCUN INDICATEUR « LIVE » QUI NE LE SOIT PAS.
 *   *Une pastille verte qui clignote sans rien mesurer est PIRE qu'une page
 *   statique : elle ajoute le mensonge à l'immobilité.*
 *
 * Ce script produit la moitié HONNÊTE de cette promesse : le réel, figé au
 * moment du build. Il ne décore rien, il ne résume rien, il ne devine rien. Il
 * lit `dist/`, il interroge git, il exécute les verrous du dépôt, et il écrit ce
 * qu'il a trouvé — y compris quand il n'a rien trouvé.
 *
 * ⚠️ LA RÈGLE DES MESURES MANQUANTES, ET ELLE N'A PAS D'EXCEPTION
 *   Une mesure indisponible s'écrit **`null`**. La page la rend « non mesuré ».
 *   Jamais zéro, jamais une valeur par défaut, jamais une estimation, jamais une
 *   valeur de la veille recopiée. *Un zéro à la place d'une panne est un
 *   mensonge par omission — c'est exactement le défaut que ce studio traque.*
 *
 * ⚠️ POURQUOI IL TOURNE DEUX FOIS DANS LE BUILD, ET CE N'EST PAS UN DOUBLON
 *   `npm run build` l'appelle AVANT puis APRÈS `vite build && prerendre`.
 *     · AVANT : il n'y a pas encore de `dist/` à lire. Le fichier écrit porte des
 *       `null` — l'état exact et honnête du relevé à cet instant — et il permet à
 *       la page de SE CONSTRUIRE, puisqu'elle importe ce JSON. Un premier passage
 *       qui écrirait des zéros « en attendant » ferait exactement ce que ce
 *       fichier interdit.
 *     · APRÈS : `dist/` existe et est prérendu. Le fichier est réécrit avec les
 *       nombres réels, et c'est cette version-là que la page livre.
 *   **Un seul passage en fin de build ne marcherait pas** : la page importe le
 *   JSON, donc Vite doit le trouver avant de compiler. **Un seul passage au début
 *   ne marcherait pas non plus** : le build n'existe pas encore. Les deux sont
 *   donc nécessaires, et l'ordre est la seule chose qui les distingue.
 *
 * ⚠️ CE QU'IL NE MESURE PAS, ET QU'IL NE DOIT PAS FAIRE SEMBLANT DE MESURER
 *   · le nombre de visiteurs humains : il n'est pas mesuré ici, et la page ne
 *     l'affiche pas. Matomo le sait côté navigateur ; ce relevé-ci n'en parle pas ;
 *   · les passages des moteurs d'IA : ils vivent dans le JOURNAL D'ACCÈS du
 *     serveur, que seul `public/api/etat.php` peut lire. Cette moitié-là est
 *     servie en direct à la page, et elle a ses propres règles (aucune IP,
 *     aucun chemin, aucun agent brut ne sortent de l'endpoint) ;
 *   · le temps de réponse, la disponibilité, la charge : rien de tout cela n'est
 *     mesuré au build. Ce qui n'est pas mesuré n'est pas affiché.
 *
 * USAGE
 *   node scripts/generer-etat.mjs                  → mesure et écrit
 *   node scripts/generer-etat.mjs --sans-verrous   → saute l'exécution des cinq
 *                                                    verrous (mise au point) ;
 *                                                    leurs verdicts passent à
 *                                                    `null` = « non mesuré »
 *   node scripts/generer-etat.mjs --detail         → affiche le relevé complet
 *
 * Sortie 0 = le fichier est écrit, quel que soit son contenu. Ce script n'est pas
 * un verrou : il RAPPORTE. Les juges, ce sont les cinq scripts qu'il exécute — et
 * leurs codes de sortie sont recopiés tels quels, sans interprétation.
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { readFileSync, writeFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join, dirname, extname, relative } from 'node:path';
import { gzipSync } from 'node:zlib';
import { execFileSync } from 'node:child_process';

const RACINE = process.cwd();
const ARGV = process.argv.slice(2);
const SANS_VERROUS = ARGV.includes('--sans-verrous');
const DETAIL = ARGV.includes('--detail');

const DIST = join(RACINE, 'dist');
/**
 * OÙ LE RELEVÉ EST ÉCRIT, ET POURQUOI LÀ
 * `src/data/etat-studio.json` — c'est le motif déjà en place dans ce dépôt pour une
 * mesure datée : `src/data/etat-services.json` porte le relevé de supervision, avec
 * les mêmes clés `_note` et `_source`, et `src/views/apps/DouMonitor.vue` l'importe.
 *
 * ⚠️ LA PAGE L'IMPORTE, ELLE NE LE TÉLÉCHARGE PAS. C'est le point qui décide de
 * tout : un `fetch()` ne serait lisible que par un navigateur, donc **un robot qui
 * n'exécute pas de JavaScript ne verrait aucun des chiffres** — sur une page dont
 * l'objet est précisément de dire ce qui est vrai. Importé, le relevé traverse la
 * compilation et se retrouve écrit dans le HTML livré, prérendu.
 */
const SORTIE = join(RACINE, 'src', 'data', 'etat-studio.json');

/* ═══════════════════════════════════════════════════════════════════════════
   LES CINQ VERROUS DU BUILD, ET À QUOI ON LES RECONNAÎT
   ⚠️ Ce sont les cinq que le brief nomme, avec le script qui les porte. On ne
   les invente pas et on ne les compte pas : n'apparaît ici que ce qui EXISTE sur
   le disque. Un sixième verrou ajouté au dépôt s'ajoute à cette liste, sinon la
   page annoncerait un compte qui ne correspond plus à rien.

   ⚠️ LE CODE DE SORTIE EST RAPPORTÉ TEL QUEL, il n'est pas traduit. Ce dépôt a
   déjà payé cette leçon : « un code de sortie ne dit pas ce qui s'est passé — il
   faut lire la sortie ». La page écrit donc « code de sortie 0 » et non « tout va
   bien », parce que le second serait une interprétation de plus.
   ═══════════════════════════════════════════════════════════════════════════ */
const VERROUS = [
  { cle: 'verrous',    nom: 'Verrous de la signature qualité', script: 'scripts/verifier-verrous.mjs' },
  { cle: 'poids',      nom: 'Poids du premier chargement',     script: 'scripts/verifier-poids.mjs' },
  { cle: 'requetes',   nom: 'Requêtes du premier chargement',  script: 'scripts/verifier-requetes.mjs' },
  { cle: 'topographie', nom: 'Topographie du site',            script: 'scripts/verifier-topographie.mjs' },
  { cle: 'contact',    nom: 'Contact livré au visiteur',       script: 'scripts/verifier-contact.mjs' },
];

/* ─── Outils ──────────────────────────────────────────────────────────────── */

/** L'horodatage local, à la seconde, au format ISO — et son décalage horaire. */
function maintenant() {
  const t = new Date();
  const decale = new Date(t.getTime() - t.getTimezoneOffset() * 60000);
  return {
    iso: t.toISOString(),
    local: decale.toISOString().slice(0, 19).replace('T', ' '),   // « 2026-09-19 14:32:07 »
    minute: decale.toISOString().slice(0, 16).replace('T', ' '),  // « 2026-09-19 14:32 »
    fuseau: Intl.DateTimeFormat().resolvedOptions().timeZone || null,
  };
}

/** Toutes les pages HTML réellement livrées dans dist/. */
function pagesLivrees(dossier = DIST, trouvees = []) {
  if (!existsSync(dossier)) return trouvees;
  for (const e of readdirSync(dossier, { withFileTypes: true })) {
    const p = join(dossier, e.name);
    if (e.isDirectory()) pagesLivrees(p, trouvees);
    else if (e.name.endsWith('.html')) trouvees.push(p);
  }
  return trouvees;
}

/* ═══════════════════════════════════════════════════════════════════════════
   1. LE COMMIT
   ═══════════════════════════════════════════════════════════════════════════ */
function mesurerCommit() {
  try {
    const court = execFileSync('git', ['rev-parse', '--short', 'HEAD'], { cwd: RACINE, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
    const sujet = execFileSync('git', ['log', '-1', '--pretty=%s'], { cwd: RACINE, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
    const dateIso = execFileSync('git', ['log', '-1', '--pretty=%cI'], { cwd: RACINE, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
    const sale = execFileSync('git', ['status', '--porcelain'], { cwd: RACINE, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
    return {
      court: court || null,
      sujet: sujet || null,
      date: dateIso || null,
      // ⚠️ MESURÉ, ET AFFICHÉ TEL QUEL. Un relevé fait sur un arbre de travail
      // modifié ne décrit pas ce qui est en ligne : le dire vaut mieux que de
      // laisser croire que le commit affiché est exactement le site déployé.
      arbre_modifie: sale.length > 0,
    };
  } catch {
    // Dépôt absent (déploiement depuis une archive, CI sans `.git`) : on le dit.
    return { court: null, sujet: null, date: null, arbre_modifie: null };
  }
}

/* ═══════════════════════════════════════════════════════════════════════════
   2. LE NOMBRE DE PAGES PRÉRENDUES — compté dans dist/, après le build
   ═══════════════════════════════════════════════════════════════════════════ */
function mesurerPages() {
  if (!existsSync(DIST)) return null;
  const pages = pagesLivrees();
  return pages.length > 0 ? pages.length : null;
}

/* ═══════════════════════════════════════════════════════════════════════════
   3. LE POIDS DE LA PAGE LA PLUS LOURDE, EN Ko SERVIS
   ───────────────────────────────────────────────────────────────────────────
   ⚠️ LA MÉTHODE EST CELLE DE `scripts/verifier-poids.mjs`, recopiée ici parce que
   ce script-ci n'a pas le droit de modifier le verrou pour lui demander ses
   chiffres. Ce qui est recopié, c'est la MÉTHODE, pas un résultat :
     · textes (html, js, css, json, svg) → compressés en gzip niveau 6, parce que
       c'est ce que le serveur sert réellement au visiteur ;
     · binaires (woff2, images) → taille sur disque, car ils sont déjà compressés ;
       les recompresser donnerait un chiffre flatteur et faux ;
     · le HTML de la page COMPTE dans son propre poids : c'est ce que le visiteur
       télécharge avant tout le reste.
   Le nombre de REQUÊTES, lui, n'est pas recalculé ici : il est lu dans la sortie
   de `verifier-requetes.mjs` (voir mesure 5), pour qu'il n'existe pas deux
   comptages concurrents du même chiffre.
   ═══════════════════════════════════════════════════════════════════════════ */
const DEJA_COMPRIME = new Set(['.woff2', '.woff', '.jpg', '.jpeg', '.png', '.webp', '.avif', '.ico', '.gif', '.mp4', '.webm']);
const CACHE_POIDS = new Map();

function poidsDe(cheminAbsolu) {
  if (CACHE_POIDS.has(cheminAbsolu)) return CACHE_POIDS.get(cheminAbsolu);
  let r = null;
  if (existsSync(cheminAbsolu) && !statSync(cheminAbsolu).isDirectory()) {
    const brut = readFileSync(cheminAbsolu);
    const disque = brut.length;
    const servi = DEJA_COMPRIME.has(extname(cheminAbsolu).toLowerCase()) ? disque : gzipSync(brut, { level: 6 }).length;
    r = { disque, servi };
  }
  CACHE_POIDS.set(cheminAbsolu, r);
  return r;
}

const resoudre = (ref, depuis) => {
  const propre = String(ref).split('?')[0].split('#')[0];
  if (/^(https?:)?\/\//i.test(propre) || propre.startsWith('data:')) return null;
  const base = depuis ? dirname(depuis) : DIST;
  return propre.startsWith('/') ? join(DIST, propre) : join(base, propre);
};

/** Les ressources du premier chargement d'une page, selon le HTML livré. */
function ressourcesDe(page) {
  const code = readFileSync(page, 'utf8');
  const trouvees = new Set();
  const ajouter = (ref) => { const abs = resoudre(ref, page); if (abs) trouvees.add(abs); };

  for (const m of code.matchAll(/<script[^>]+src=["']([^"']+)["']/g)) ajouter(m[1]);
  for (const m of code.matchAll(/rel=["']modulepreload["'][^>]*href=["']([^"']+)["']/g)) ajouter(m[1]);
  for (const m of code.matchAll(/href=["']([^"']+)["'][^>]*rel=["']modulepreload["']/g)) ajouter(m[1]);
  for (const m of code.matchAll(/<link[^>]+rel=["']stylesheet["'][^>]*href=["']([^"']+)["']/g)) ajouter(m[1]);
  for (const m of code.matchAll(/<link[^>]+href=["']([^"']+)["'][^>]*rel=["']stylesheet["']/g)) ajouter(m[1]);
  for (const m of code.matchAll(/rel=["'](?:icon|shortcut icon|apple-touch-icon)["'][^>]*href=["']([^"']+)["']/g)) ajouter(m[1]);
  for (const m of code.matchAll(/rel=["']manifest["'][^>]*href=["']([^"']+)["']/g)) ajouter(m[1]);
  for (const m of code.matchAll(/<img\b[^>]*\bsrc=["']([^"']+)["']/g)) ajouter(m[1]);

  // Les polices ne sont pas dans le HTML : elles sont citées par les feuilles de
  // style. On lit donc les CSS trouvées, et celles qu'elles importent.
  const aParcourir = [...trouvees].filter((f) => f.endsWith('.css'));
  const vues = new Set();
  while (aParcourir.length) {
    const abs = aParcourir.shift();
    if (vues.has(abs) || !existsSync(abs)) continue;
    vues.add(abs);
    for (const m of readFileSync(abs, 'utf8').matchAll(/url\(\s*["']?([^"')]+)["']?\s*\)/g)) {
      const cible = resoudre(m[1], abs);
      if (!cible) continue;
      if (/\.woff2?$/i.test(cible)) trouvees.add(cible);
      else if (/\.css$/i.test(cible)) aParcourir.push(cible);
    }
  }
  return trouvees;
}

function mesurerPoids() {
  if (!existsSync(join(DIST, 'index.html'))) return { page: null, ko_servis: null, seuil_ko: null };
  const pages = pagesLivrees();
  if (pages.length === 0) return { page: null, ko_servis: null, seuil_ko: null };

  let lourde = null;
  for (const page of pages) {
    const soi = poidsDe(page);
    let servi = soi ? soi.servi : 0;
    for (const res of ressourcesDe(page)) {
      const p = poidsDe(res);
      if (p) servi += p.servi;
    }
    if (!lourde || servi > lourde.servi) lourde = { page, servi };
  }
  if (!lourde) return { page: null, ko_servis: null, seuil_ko: null };

  // Le chemin LIVRÉ, tel qu'un visiteur le voit — jamais un chemin local.
  const chemin = relative(DIST, lourde.page).replace(/\\/g, '/');
  const url = chemin === 'index.html' ? '/' : '/' + chemin.replace(/index\.html$/, '');
  return { page: url, ko_servis: Number((lourde.servi / 1024).toFixed(1)), seuil_ko: 1024 };
}

/* ═══════════════════════════════════════════════════════════════════════════
   4. LE NOMBRE DE REQUÊTES DU PREMIER CHARGEMENT
   ═══════════════════════════════════════════════════════════════════════════ */
/**
 * ⚠️ CE CHIFFRE EST LU DANS LA SORTIE DU VERROU, PAS RECALCULÉ ICI.
 * Deux comptages du même nombre finiraient par diverger, et c'est celui du verrou
 * qui juge. Si la ligne est absente ou illisible, la mesure vaut `null` —
 * « non mesuré » — et non le nombre de la veille.
 */
function lireRequetes(sortie) {
  const m = sortie.match(/(\d+)\s+requête\(s\) au premier chargement/);
  if (!m) return { total: null, seuil: null };
  const seuil = sortie.match(/seuil\s+(\d+)\s+·/);
  return { total: Number(m[1]), seuil: seuil ? Number(seuil[1]) : null };
}

/* ═══════════════════════════════════════════════════════════════════════════
   5. LES VERROUS — on exécute, on rapporte le code de sortie, et rien de plus
   ═══════════════════════════════════════════════════════════════════════════ */
function executerVerrou(script) {
  const chemin = join(RACINE, script);
  if (!existsSync(chemin)) {
    // Le script n'existe pas : ce n'est PAS un verdict, c'est une absence de mesure.
    return { code: null, motif: 'script introuvable au moment du relevé' };
  }
  try {
    execFileSync(process.execPath, [chemin], { cwd: RACINE, stdio: ['ignore', 'pipe', 'pipe'], timeout: 300000 });
    return { code: 0, motif: null };
  } catch (e) {
    if (typeof e.status === 'number') return { code: e.status, motif: null };
    // Processus tué (délai dépassé) ou non démarrable : on ne fabrique pas un code.
    return { code: null, motif: e.killed ? 'délai dépassé' : 'exécution impossible' };
  }
}

function mesurerVerrous() {
  if (!SANS_VERROUS && !existsSync(join(DIST, 'index.html'))) {
    // Les verrous de poids et de topographie mesurent `dist/` : les exécuter
    // maintenant donnerait « rien mesuré », ce qui n'est pas un verdict sur le site.
    return VERROUS.map((v) => ({ cle: v.cle, nom: v.nom, script: v.script, code: null, motif: 'dist/ absent à cet instant du build' }));
  }

  const resultats = [];
  for (const v of VERROUS) {
    if (SANS_VERROUS) {
      resultats.push({ cle: v.cle, nom: v.nom, script: v.script, code: null, motif: 'exécution sautée (--sans-verrous)' });
      continue;
    }
    const r = executerVerrou(v.script);
    resultats.push({ cle: v.cle, nom: v.nom, script: v.script, code: r.code, motif: r.motif });
  }
  return resultats;
}

/** La sortie de `verifier-requetes.mjs`, capturée à part : elle porte le comptage. */
function sortieRequetes() {
  const chemin = join(RACINE, 'scripts', 'verifier-requetes.mjs');
  if (!existsSync(chemin) || !existsSync(join(DIST, 'index.html'))) return null;
  try {
    return execFileSync(process.execPath, [chemin], { cwd: RACINE, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
  } catch (e) {
    // Le verrou peut sortir en 1 : sa SORTIE reste valable, c'est elle qu'on lit.
    return typeof e.stdout === 'string' ? e.stdout : null;
  }
}

/* ═══════════════════════════════════════════════════════════════════════════
   MESURE ET ÉCRITURE
   ═══════════════════════════════════════════════════════════════════════════ */
const horodatage = maintenant();
const pages = mesurerPages();
const poids = mesurerPoids();
const sortie = sortieRequetes();
const requetes = sortie ? lireRequetes(sortie) : { total: null, seuil: null };

const etat = {
  // ⚠️ La version du format. Si la forme change, elle change ICI : la page lit ce
  // champ et peut refuser un relevé qu'elle ne sait pas lire, plutôt que d'afficher
  // un champ vide en croyant que la mesure est nulle.
  version: 1,
  // Même convention que `src/data/etat-services.json` : ce fichier dit de lui-même
  // ce qu'il est et d'où il vient, pour qu'on ne le prenne jamais pour une saisie
  // manuelle. Il est ÉCRIT par ce script — le modifier à la main est sans effet,
  // la construction suivante l'écrasera.
  _note: 'Relevé réel du build, écrit par scripts/generer-etat.mjs. Ce n\'est pas du temps réel : c\'est une mesure datée. Une mesure indisponible vaut null, jamais zéro.',
  _source: 'scripts/generer-etat.mjs',
  commit: mesurerCommit(),
  build: {
    horodatage_local: horodatage.local,
    horodatage_minute: horodatage.minute,
    horodatage_iso: horodatage.iso,
    fuseau: horodatage.fuseau,
  },
  pages_prerendues: pages,
  page_la_plus_lourde: {
    chemin: poids.page,
    ko_servis: poids.ko_servis,
    seuil_ko: poids.seuil_ko,
  },
  requetes_premier_chargement: { total: requetes.total, seuil: requetes.seuil },
  // Le relevé vivant (moteurs d'IA) n'est pas ici : il vient de `api/etat.php`.
  // Écrit dans le fichier pour que la page n'ait pas à le supposer.
  moteurs_ia: { source: 'api/etat.php', releve: null, mesure_a: null, moteurs: [] },
  verrous: mesurerVerrous(),
};

writeFileSync(SORTIE, JSON.stringify(etat, null, 2) + '\n', 'utf8');

/* ─── Rapport ─────────────────────────────────────────────────────────────── */
const ou = (v) => (v === null || v === undefined ? 'non mesuré' : String(v));
console.log('');
console.log('='.repeat(72));
console.log('  RELEVÉ DU BUILD — écrit dans src/data/etat-studio.json');
console.log('='.repeat(72));
console.log(`  horodatage   : ${horodatage.local} (${horodatage.fuseau})`);
console.log(`  commit       : ${ou(etat.commit.court)} — ${ou(etat.commit.sujet)}`);
console.log(`  arbre modifié: ${etat.commit.arbre_modifie === null ? 'non mesuré' : (etat.commit.arbre_modifie ? 'oui' : 'non')}`);
console.log(`  pages        : ${ou(pages)} HTML livré(s) dans dist/`);
console.log(`  plus lourde  : ${ou(poids.page)} — ${ou(poids.ko_servis)} Ko servis ${poids.seuil_ko ? `(seuil ${poids.seuil_ko} Ko)` : ''}`);
console.log(`  requêtes     : ${ou(requetes.total)} au premier chargement ${requetes.seuil ? `(seuil ${requetes.seuil})` : ''}`);
console.log('');
console.log('  Verrous — code de sortie réel :');
for (const v of etat.verrous) {
  const marque = v.code === null ? 'non mesuré' : `code ${v.code}`;
  console.log(`    ${v.nom.padEnd(36)} ${marque}${v.motif ? '  — ' + v.motif : ''}`);
}
if (DETAIL) {
  console.log('');
  console.log('  ── le fichier écrit ──');
  console.log(JSON.stringify(etat, null, 2));
}
console.log('');
console.log('  Rappel : une mesure indisponible est écrite « null » et s\'affiche');
console.log('  « non mesuré ». Jamais zéro, jamais une valeur par défaut.');
console.log('='.repeat(72));
console.log('');
process.exit(0);
