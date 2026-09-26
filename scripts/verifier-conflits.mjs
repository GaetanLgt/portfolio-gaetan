#!/usr/bin/env node
/**
 * verifier-conflits.mjs — LE GARDE-FOU DES CONFLITS DE FUSION
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * POURQUOI CE SCRIPT EXISTE — le défaut qui l'a produit, mesuré le 26/09/2026
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * `src/views/resources/components-library/ComponentsLibrary.vue` portait, aux
 * lignes 51, 53 et 59, un conflit de fusion NON RÉSOLU :
 *
 *     <<<<<<< Updated upstream
 *             <h2 class="lib-sous-titre">Composants disponibles</h2>
 *     =======
 *             <!-- Titre de niveau 2 : sans lui la hiérarchie saute de h1 … -->
 *             <h2 class="sr-only">Composants disponibles</h2>
 *     >>>>>>> Stashed changes
 *
 * Ce qui a été mesuré, et non déduit :
 *   1. les marqueurs étaient COMMITÉS (git status ne montrait pas le fichier
 *      modifié) — le dernier commit le touchant s'appelait pourtant
 *      « RÉPARATION : trois fichiers aplatis par un remplacement trop large » ;
 *   2. ils étaient ACHEMINÉS JUSQU'EN PRODUCTION : `dist/ComponentsLibrary-CO1xiwpG.js`
 *      les contenait. En Vue, ce texte est du TEXTE : la page les AFFICHAIT ;
 *   3. le dépôt comptait alors 37 scripts de vérification — `verifier-encodage`,
 *      `verifier-injection`, `verifier-metadonnees`, `verifier-poids`… — et
 *      AUCUN ne regardait les marqueurs de fusion.
 *
 * ⭐ C'est la loi n° 4 de l'atelier : *« un garde-fou qui ne couvre qu'un chemin
 *    est une porte — le contrôle vit au POINT DE PASSAGE OBLIGÉ. »* Ici le point
 *    de passage est double : le build (`npm run build`) **et** la CI (`deploy.yml`).
 *    Un contrôle qui ne serait que dans l'un des deux serait une porte.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * USAGE
 * ═══════════════════════════════════════════════════════════════════════════
 *
 *   node scripts/verifier-conflits.mjs            # les sources et dist/
 *   node scripts/verifier-conflits.mjs --porte    # code 1 si conflit (défaut)
 *   node scripts/verifier-conflits.mjs --detail   # nomme chaque fichier touché
 *
 * Codes de retour :  0 = propre   ·   1 = au moins un conflit   ·   2 = rien à scanner
 */
import fs from 'node:fs';
import path from 'node:path';

const RACINE = process.cwd();

// ── Ce qu'on ignore : dépendances, historique, caches ──────────────────────
const IGNORES = new Set([
  'node_modules', '.git', '.cache', '.vite', 'coverage',
  '.essai-pont-2026-09-24T19-01-50-199Z', '.essai-pont-2026-09-24T19-03-29-369Z',
]);

// ── Les extensions LIVRABLES. Un conflit dans un .md est un document ; dans
//    un de ces formats, c'est une page cassée. On scanne les deux, on ne les
//    traite pas pareil (voir le rapport ci-dessous). ────────────────────────
const EXT_LIVREES = new Set(['.vue', '.js', '.mjs', '.cjs', '.ts', '.jsx', '.tsx',
  '.css', '.scss', '.html', '.htm', '.json', '.php', '.yml', '.yaml', '.svg']);
const EXT_DOCUMENT = new Set(['.md', '.txt']);

/**
 * Cherche les marqueurs de conflit dans un texte.
 *
 * `<<<<<<< ` et `>>>>>>> ` sont SANS AMBIGUÏTÉ : sept chevrons suivis d'un
 * espace n'apparaissent dans aucun langage de ce dépôt.
 *
 * `=======` nu, lui, EST ambigu : c'est un séparateur Markdown légitime, et il
 * apparaît dans des commentaires en pointillés. On ne le compte donc QUE dans
 * un fichier qui porte déjà un `<<<<<<<` non apparié — c'est-à-dire un vrai
 * conflit. Sans cette précaution, le contrôle crierait au loup et on
 * l'apprendrait à l'ignorer — ce qui revient à ne pas l'avoir.
 */
function chercherMarqueurs(texte) {
  const trouves = [];
  const lignes = texte.split(/\r?\n/);
  let conflitOuvert = false;

  for (let i = 0; i < lignes.length; i++) {
    const l = lignes[i];
    if (/^<{7}( |$)/.test(l)) {
      trouves.push({ ligne: i + 1, marqueur: '<<<<<<<', texte: l.slice(0, 100) });
      conflitOuvert = true;
    } else if (/^\|{7}( |$)/.test(l)) {
      trouves.push({ ligne: i + 1, marqueur: '|||||||', texte: l.slice(0, 100) });
    } else if (/^>{7}( |$)/.test(l)) {
      trouves.push({ ligne: i + 1, marqueur: '>>>>>>>', texte: l.slice(0, 100) });
      conflitOuvert = false;
    } else if (/^={7}$/.test(l) && conflitOuvert) {
      trouves.push({ ligne: i + 1, marqueur: '=======', texte: l.slice(0, 100) });
    }
  }
  return trouves;
}

function* parcourir(dossier) {
  let entrees;
  try {
    entrees = fs.readdirSync(dossier, { withFileTypes: true });
  } catch {
    return;
  }
  for (const e of entrees) {
    if (IGNORES.has(e.name)) continue;
    const complet = path.join(dossier, e.name);
    if (e.isDirectory()) {
      yield* parcourir(complet);
    } else if (e.isFile()) {
      yield complet;
    }
  }
}

// ── Le balayage ────────────────────────────────────────────────────────────
const conflitsLivre = [];
const conflitsDoc = [];
let nbFichiersLus = 0;

for (const fichier of parcourir(RACINE)) {
  const ext = path.extname(fichier).toLowerCase();
  const estLivre = EXT_LIVREES.has(ext);
  const estDoc = EXT_DOCUMENT.has(ext);
  if (!estLivre && !estDoc) continue;

  let texte;
  try {
    texte = fs.readFileSync(fichier, 'utf8');
  } catch {
    continue;
  }
  nbFichiersLus++;

  // Optimisation : ne détailler que si un marqueur sans ambiguïté est présent.
  if (!/^<{7}( |$)/m.test(texte) && !/^>{7}( |$)/m.test(texte)) continue;

  const marqueurs = chercherMarqueurs(texte);
  if (marqueurs.length === 0) continue;

  const rel = path.relative(RACINE, fichier);
  (estLivre ? conflitsLivre : conflitsDoc).push({ fichier: rel, marqueurs });
}

// ── Rapport ────────────────────────────────────────────────────────────────
const detail = process.argv.includes('--detail');
const total = conflitsLivre.length + conflitsDoc.length;

// ── LE GARDE-FOU CONTRE L'AVEUGLEMENT DU CONTRÔLE LUI-MÊME ─────────────────
// ⛔ Ce dépôt a DÉJÀ payé ce défaut, et il est écrit noir sur blanc dans
//    `scripts/verifier-topographie.mjs` :
//
//      « CE CONTRÔLE S'EST AVEUGLÉ TOUT SEUL. […] il ne voyait plus rien et il
//        disait que tout allait bien. Un compteur à zéro prouve que le motif n'a
//        rien trouvé, jamais que la chose est absente. »
//
// ⭐ Un scan qui lit trois fichiers et n'y trouve rien est un scan QUI A ÉCHOUÉ,
//    pas un dépôt propre. Le plancher transforme ce silence en ÉCHEC.
//
//    Mesure du 26/09/2026 sur ce dépôt : 852 fichiers lus. 200 est un plancher
//    volontairement bas — il ne prétend pas dire « tout va bien », il dit
//    seulement « j'ai bien vu le dépôt ». Le baisser reviendrait à rouvrir la porte.
const PLANCHER_FICHIERS = 200;

if (nbFichiersLus < PLANCHER_FICHIERS) {
  console.error(`[KO] ${nbFichiersLus} fichier(s) lu(s) — plancher attendu : ${PLANCHER_FICHIERS}.`);
  console.error('');
  console.error('  Ce n\'est PAS un dépôt propre : c\'est un contrôle qui n\'a pas vu le');
  console.error('  dépôt. Causes possibles : lancé depuis un autre dossier, ou une');
  console.error('  exclusion trop large dans IGNORES.');
  console.error('');
  console.error('  Le studio a déjà payé ce défaut une fois — verifier-topographie.mjs');
  console.error('  « ne voyait plus rien et disait que tout allait bien ».');
  process.exit(2);
}

console.log(`[conflits] ${nbFichiersLus} fichier(s) parcouru(s)`);

if (total === 0) {
  console.log('  [ok] aucun marqueur de conflit de fusion');
  console.log('');
  console.log('  Ce contrôle couvre les SOURCES et dist/ — les deux ont porté le');
  console.log('  défaut du 26/09/2026. Il ne couvre pas node_modules ni .git.');
  process.exit(0);
}

for (const c of conflitsLivre) {
  console.error(`  [KO] ${c.fichier} — ${c.marqueurs.length} marqueur(s)`);
  if (detail) {
    for (const m of c.marqueurs) {
      console.error(`         L${m.ligne}  ${m.marqueur}  ${m.texte.trim()}`);
    }
  }
}

for (const c of conflitsDoc) {
  console.error(`  [KO] ${c.fichier} — ${c.marqueurs.length} marqueur(s)  (document)`);
  if (detail) {
    for (const m of c.marqueurs) {
      console.error(`         L${m.ligne}  ${m.marqueur}  ${m.texte.trim()}`);
    }
  }
}

console.error('');
console.error(`[KO] ${total} fichier(s) portent un conflit de fusion non résolu.`);
console.error('');
console.error('  Un marqueur dans un .vue, un .js ou un .html n\'est pas une erreur');
console.error('  de syntaxe : c\'est du TEXTE, et il part EN PRODUCTION. Il s\'affiche');
console.error('  à l\'écran du visiteur.');
console.error('');
console.error('  Pour réparer, voir forge-ia/reparer-conflit-components-library.mjs :');
console.error('  aucun remplacement ne s\'écrit sans assertion.');
process.exit(1);
