#!/usr/bin/env node
/**
 * epreuve-degradation.mjs — LA PAGE, DANS UN VRAI NAVIGATEUR, AVEC ET SANS LE RELEVÉ.
 * GL Digital Lab · 19/09/2026
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * POURQUOI CE FICHIER EXISTE
 * La page `/etat-du-studio` a deux moitiés : le relevé du build, PRÉRENDU (donc dans
 * le HTML livré, sans JavaScript), et le relevé vivant des moteurs d'IA, obtenu par
 * `fetch()` sur `api/etat.php`. Cette seconde moitié a une règle, écrite dans le
 * composant : **si le relevé n'arrive pas, l'affichage reste sur « relevé
 * indisponible », et il ne montre jamais des zéros.**
 *
 * Cette règle était AFFIRMÉE, pas mesurée. Ce script la mesure, en pilotant le Chrome
 * déjà installé (aucune dépendance npm ajoutée) sur le SITE CONSTRUIT, servi par un
 * serveur statique local qui applique les mêmes règles que la production.
 *
 * LES DEUX SCÉNARIOS, ET CE QU'ILS PROUVENT
 *   1. `api/etat.php` répond 503 (journal illisible) → la page doit afficher
 *      « Relevé indisponible », nommer la raison, et n'avoir AUCUN tableau de moteurs.
 *   2. `api/etat.php` répond un relevé valide (jeu d'essai de deux moteurs) → la page
 *      doit REMPLACER ce texte par le tableau, avec les compteurs reçus.
 *   Le second scénario compte autant que le premier : sans lui, on ne saurait pas
 *   distinguer « la page se dégrade proprement » de « la page n'affiche jamais rien ».
 *
 * ⚠️ COMMENT LE SERVEUR D'ESSAI EST CONSTRUIT — ET POURQUOI IL N'UTILISE PAS PHP
 *   PHP n'est pas disponible sur toutes les machines de construction, et cette épreuve
 *   doit tourner partout. On ne teste donc pas PHP ici : on teste LA PAGE, en
 *   remplaçant `api/etat.php` par un fichier qui rend exactement ce que l'endpoint
 *   rendrait — sa forme est celle de `public/api/etat.php`, vérifiée séparément par
 *   `scripts/epreuve-etat-php.php` (34 épreuves, dont la forme pauvre et l'absence
 *   totale d'adresse IP et de chemin).
 *   La substitution porte sur une COPIE de `dist/`, jamais sur `dist/` lui-même.
 *
 * USAGE
 *   node scripts/epreuve-degradation.mjs
 *   node scripts/epreuve-degradation.mjs --detail     → imprime les extraits lus
 *
 * Sortie 0 = les deux scénarios se comportent comme la page le promet.
 *        1 = au moins un scénario ne tient pas.  2 = rien à éprouver (dist/ absent).
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { readFileSync, writeFileSync, existsSync, mkdtempSync, cpSync, rmSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import http from 'node:http';
import { spawn } from 'node:child_process';

const RACINE = process.cwd();
const DETAIL = process.argv.includes('--detail');
const DIST = join(RACINE, 'dist');
const PAGE = join(DIST, 'etat-du-studio', 'index.html');

if (!existsSync(PAGE)) {
  console.error('  [2]  dist/etat-du-studio/index.html introuvable — lancez `npm run build`.');
  process.exit(2);
}

/* ── Chrome ────────────────────────────────────────────────────────────────── */
function trouverChrome() {
  const candidats = [
    process.env.CHROME_PATH,
    'C:/Program Files/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
    join(process.env.LOCALAPPDATA || '', 'Google/Chrome/Application/chrome.exe'),
    '/usr/bin/google-chrome', '/usr/bin/google-chrome-stable', '/usr/bin/chromium',
    '/usr/bin/chromium-browser', '/opt/google/chrome/chrome',
  ].filter(Boolean);
  return candidats.find((c) => { try { return existsSync(c); } catch { return false; } });
}

const chrome = trouverChrome();
if (!chrome) {
  console.error('  [2]  Chrome introuvable (définir CHROME_PATH) — la page ne peut pas être éprouvée.');
  process.exit(2);
}

/* ── Les deux relevés d'essai ──────────────────────────────────────────────── */
// La forme EXACTE de `public/api/etat.php` : `releve`, `mesure_a`, `cache`, `moteurs`
// et rien d'autre. Aucune adresse, aucun chemin, aucun agent brut — comme l'endpoint.
const RELEVE_VALIDE = {
  releve: 'lu',
  mesure_a: '2026-09-19T07:00:00+00:00',
  cache: 'frais',
  moteurs: [
    { moteur: 'Moteur d\'essai — premier', passages: 42 },
    { moteur: 'Moteur d\'essai — second', passages: 7 },
  ],
};
const RELEVE_KO = {
  releve: 'indisponible',
  moteurs: [],
  erreur: 'Le journal d\'accès n\'est pas lisible depuis le serveur.',
  mesure_a: '2026-09-19T07:00:00+00:00',
};

/* ── Le serveur statique d'essai ───────────────────────────────────────────── */
const MIME = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp',
  '.ico': 'image/x-icon', '.woff2': 'font/woff2', '.woff': 'font/woff',
};
const attendre = (ms) => new Promise((r) => setTimeout(r, ms));

/** Fait tourner un serveur statique sur une copie de dist/, avec un faux endpoint. */
async function avecServeur(releve, port, travail) {
  const racine = mkdtempSync(join(tmpdir(), 'epreuve-page-'));
  cpSync(DIST, racine, { recursive: true });
  // ⚠️ On ne teste PAS PHP ici (il n'est pas partout) : on remplace l'endpoint par un
  // fichier qui rend exactement ce que PHP rendrait. La substitution porte sur la copie.
  writeFileSync(join(racine, 'api', 'etat.php.json'), JSON.stringify(releve), 'utf8');
  // ⚠️ CHAQUE FICHIER LIVRÉ EST RÉÉCRIT, PAS SEULEMENT LE HTML. Le `fetch` vit dans le
  // PAQUET JavaScript de la page, pas dans le HTML : la première version de ce script
  // ne réécrivait que `etat-du-studio/index.html`, donc le scénario 2 ne substituait
  // RIEN et la page appelait le vrai chemin — 404 sur un serveur statique, page en
  // « relevé indisponible », et cinq épreuves en échec pour un harnais faux.
  // *Mesurer la page qu'on croit servir commence par servir la page qu'on croit.*
  const CHERCHE = '/api/etat.php';
  let remplacements = 0;
  (function reecrire(dossier) {
    for (const e of readdirSync(dossier, { withFileTypes: true })) {
      const p = join(dossier, e.name);
      if (e.isDirectory()) { reecrire(p); continue; }
      if (!/\.(html|js|css|json)$/.test(e.name)) continue;
      const avant = readFileSync(p, 'utf8');
      if (!avant.includes(CHERCHE)) continue;
      writeFileSync(p, avant.split(CHERCHE).join(CHERCHE + '.json'), 'utf8');
      remplacements++;
    }
  })(racine);
  if (remplacements === 0) {
    throw new Error('aucun fichier livré ne cite le chemin de l\'endpoint : l\'épreuve ne peut rien substituer');
  }

  const requetes = [];
  const serveur = http.createServer((req, res) => {
    const url = new URL(req.url, 'http://127.0.0.1');
    requetes.push(url.pathname);
    let cible = join(racine, decodeURIComponent(url.pathname).replace(/\/$/, '/index.html'));
    if (existsSync(cible) && !cible.includes('.')) cible = join(cible, 'index.html');
    if (!existsSync(cible)) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }).end('introuvable');
      return;
    }
    const ext = cible.slice(cible.lastIndexOf('.'));
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
    res.end(readFileSync(cible));
  });
  await new Promise((r) => serveur.listen(port, '127.0.0.1', r));

  try {
    return await travail(`http://127.0.0.1:${port}/etat-du-studio/`, racine, requetes);
  } finally {
    serveur.close();
    rmSync(racine, { recursive: true, force: true });
  }
}

/** Le DOM APRÈS exécution du JavaScript : c'est ce que voit un visiteur. */
function domRendu(url) {
  return new Promise((resolve) => {
    const profil = mkdtempSync(join(tmpdir(), 'epreuve-chrome-'));
    const proc = spawn(chrome, [
      '--headless=new', '--disable-gpu', '--no-sandbox', '--no-first-run',
      '--no-default-browser-check', '--virtual-time-budget=6000',
      `--user-data-dir=${profil}`, '--dump-dom', url,
    ], { stdio: ['ignore', 'pipe', 'ignore'] });
    let sortie = '';
    proc.stdout.on('data', (d) => { sortie += d.toString('utf8'); });
    const minuteur = setTimeout(() => { try { proc.kill(); } catch { /* déjà mort */ } }, 60000);
    proc.on('close', () => { clearTimeout(minuteur); rmSync(profil, { recursive: true, force: true }); resolve(sortie); });
  });
}

/* ── Lecture du DOM : ce que la page affiche vraiment ──────────────────────── */
const texte = (html) => html
  .replace(/<script[\s\S]*?<\/script>/gi, ' ')
  .replace(/<style[\s\S]*?<\/style>/gi, ' ')
  .replace(/<[^>]+>/g, ' ')
  .replace(/&nbsp;/g, ' ')
  .replace(/&amp;/g, '&')
  .replace(/&lt;/g, '<')
  .replace(/&gt;/g, '>')
  .replace(/&#39;|&apos;/g, "'")
  .replace(/&quot;/g, '"')
  .replace(/\s+/g, ' ');

const verdicts = [];
const dire = (condition, quoi, detail = '') => verdicts.push([condition, quoi, detail]);

/* ── Scénario 1 : l'endpoint ne répond pas ─────────────────────────────────── */
const domKo = await avecServeur(RELEVE_KO, 4318, (url, _racine, requetes) => domRendu(url).then((d) => ({ d, requetes })));
const tKo = texte(domKo.d);
dire(/Relevé indisponible/.test(tKo), 'endpoint indisponible : la page le DIT', '« Relevé indisponible » présent');
dire(/n'a pas pu être obtenu/.test(tKo), 'endpoint indisponible : la raison est écrite');
dire(!/<tbody/.test(domKo.d), 'endpoint indisponible : AUCUN tableau de moteurs n\'est rendu');
dire(!/passages/i.test(domKo.d.match(/<table[\s\S]*?<\/table>/)?.[0] || ''), 'endpoint indisponible : aucun compteur affiché');
dire(/Moteur d'essai/.test(tKo) === false, 'endpoint indisponible : aucun nom de moteur inventé');
// Le relevé du BUILD doit rester visible : la page ne devient pas vide non plus.
dire(/8dbb2e4|Commit livré/.test(tKo), 'endpoint indisponible : le relevé du build reste affiché');
dire(/code de sortie 0/.test(tKo), 'endpoint indisponible : les verdicts des verrous restent affichés');

/* ── Scénario 2 : l'endpoint répond ────────────────────────────────────────── */
const domOk = await avecServeur(RELEVE_VALIDE, 4319, (url, _racine, requetes) => domRendu(url).then((d) => ({ d, requetes })));
const tOk = texte(domOk.d);
const table = domOk.d.match(/<table[\s\S]*?<\/table>/)?.[0] || '';
dire(/Moteur d'essai — premier/.test(table), 'endpoint vivant : les moteurs reçus sont affichés');
dire(/42/.test(table), 'endpoint vivant : les passages reçus sont affichés');
dire(/Relevé vivant/.test(tOk), 'endpoint vivant : la page dit d\'où vient le relevé');
dire(!/Relevé indisponible/.test(tOk), 'endpoint vivant : le texte « indisponible » a bien été REMPLACÉ');
// ⚠️ CE QUI A ÉTÉ RÉELLEMENT DEMANDÉ AU SERVEUR. Sans cette ligne, on ne saurait pas
// distinguer « la page n'a pas appelé l'endpoint » de « l'endpoint a répondu autre chose ».
const appels = domOk.requetes.filter((r) => r.includes('etat.php'));
dire(appels.length > 0, 'endpoint vivant : la page a bien APPELÉ l\'endpoint', appels.join(', ') || 'aucun appel');
const reponsesVides = domKo.requetes.filter((r) => r.includes('etat.php'));
dire(reponsesVides.length > 0, 'endpoint indisponible : la page a bien appelé l\'endpoint aussi', reponsesVides.join(', ') || 'aucun appel');

/* ── Rapport ───────────────────────────────────────────────────────────────── */
console.log('');
console.log('='.repeat(74));
console.log('  ÉPREUVE DE DÉGRADATION — la page dans un vrai navigateur');
console.log('='.repeat(74));
console.log('  scénario 1 : api/etat.php répond 503 (relevé indisponible)');
console.log('  scénario 2 : api/etat.php répond un relevé valide (2 moteurs d\'essai)');
console.log('  Chrome     : ' + chrome);
console.log('');
let echecs = 0;
for (const [condition, quoi, detail] of verdicts) {
  if (!condition) echecs++;
  console.log(`  [${condition ? 'ok' : '!!'}]  ${quoi}${detail ? '  — ' + detail : ''}`);
}
if (DETAIL) {
  console.log('');
  console.log('  ── texte rendu, scénario 1 (extrait autour du relevé) ──');
  const i = tKo.indexOf('Relevé indisponible');
  console.log('  ' + tKo.slice(Math.max(0, i - 80), i + 420));
  console.log('');
  console.log('  ── texte rendu, scénario 2 (extrait) ──');
  const j = tOk.indexOf('Relevé vivant');
  console.log('  ' + tOk.slice(Math.max(0, j - 80), j + 320));
}
console.log('');
console.log(echecs === 0
  ? '  Les deux scénarios se comportent comme la page le promet.'
  : `  ${echecs} épreuve(s) en échec.`);
console.log('='.repeat(74));
console.log('');
process.exit(echecs === 0 ? 0 : 1);
