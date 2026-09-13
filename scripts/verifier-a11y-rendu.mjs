#!/usr/bin/env node
/**
 * verifier-a11y-rendu.mjs — l'audit axe, mais qui ATTEND que la page soit lisible
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * POURQUOI CE FICHIER EXISTE
 * ───────────────────────────────────────────────────────────────────────────
 * Le dépôt avait déjà `npm run audit:a11y` (`axe <url> --exit`). Il ne pouvait pas
 * tourner — `axe` n'était pas installé — et il n'était branché dans aucune étape
 * de `deploy.yml`. Installé le 13/09/2026, il a immédiatement trouvé un vrai
 * défaut (`scrollable-region-focusable` sur le carrousel de `/arkadia`).
 *
 * MAIS IL EST INTERMITTENT, ET C'EST MESURÉ :
 *
 *   Sur `/contact`, il signale 4 fois `color-contrast` sur `.loader__log-ms`
 *   (les millisecondes du journal de démarrage). Mesure du 13/09/2026, sur le
 *   même build :
 *
 *     à l'arrêt (opacité 1,00)  → contraste PEINT 7,27:1  — seuil 4,5:1 — PASSE
 *     à +150 ms (opacité 0,02)  → contraste PEINT 1,02:1  — sous le seuil
 *
 *   L'élément porte `animation: logAppear 0.25s` qui part d'`opacity: 0`. Un
 *   outil qui échantillonne pendant ces 250 ms calcule une couleur MÉLANGÉE au
 *   fond, donc un contraste qui n'existe pas — sur un texte qui, à cet instant,
 *   n'est de toute façon **pas lisible puisqu'il n'est pas peint**.
 *
 *   Conséquence, et c'est la formule du studio : *un contrôle qui échoue à tort
 *   finit par être ignoré, ce qui est pire que pas de contrôle.* Brancher
 *   `audit:a11y` tel quel en CI fabriquerait un verrou rouge au hasard.
 *
 * CE QUE FAIT CE SCRIPT, ET QUI CHANGE TOUT
 *   Il attend le signal RÉEL de fin de démarrage — la disparition du `.loader`,
 *   exactement celui que `scripts/prerendre.js` attend déjà pour capturer les
 *   pages — PUIS il lance axe. On n'audite plus une page en train de s'allumer :
 *   on audite **ce que le visiteur lit**.
 *
 *   `axe` n'est pas réimplémenté : c'est le paquet `axe-core` du dépôt, injecté
 *   dans la page. Et comme `prerendre.js`, ce script pilote le Chrome déjà
 *   installé par le protocole de débogage : **aucune dépendance de navigateur
 *   ajoutée** (pas de chromedriver, pas de Playwright).
 *
 * USAGE
 *   node scripts/verifier-a11y-rendu.mjs                 → toutes les routes
 *   node scripts/verifier-a11y-rendu.mjs --plafond 6     → les 6 premières
 *   node scripts/verifier-a11y-rendu.mjs --routes /,/contact
 * Sortie 0 = aucune violation · 1 = violations · 2 = rien mesuré.
 */

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import http from 'node:http';
import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const args = process.argv.slice(2);
const option = (n, d) => { const i = args.indexOf('--' + n); return i >= 0 && args[i + 1] && !args[i + 1].startsWith('--') ? args[i + 1] : d; };

const DIST = path.resolve(option('dist', 'dist'));
const PORT = Number(option('port', 4180));
const DEBUG_PORT = PORT + 1;
const PLAFOND = Number(option('plafond', 0));
const ROUTES_FORCEES = option('routes', null);

if (typeof WebSocket !== 'function') {
  console.error('Node >= 22 requis (WebSocket global).');
  process.exit(1);
}
if (!fs.existsSync(path.join(DIST, 'index.html'))) {
  console.error('dist/index.html introuvable — lancer `npm run build` d’abord.');
  console.error('Ce verrou mesure le BUILD. Un verrou qui n\'a rien mesuré n\'est PAS un verrou tenu.');
  process.exit(2);
}

/* ── axe-core : présent dans l'arbre via @axe-core/cli ───────────────────── */
let AXE_SOURCE = null;
try {
  AXE_SOURCE = fs.readFileSync(require.resolve('axe-core'), 'utf8');
} catch {
  try { AXE_SOURCE = fs.readFileSync(path.join(process.cwd(), 'node_modules', 'axe-core', 'axe.js'), 'utf8'); } catch {}
}
if (!AXE_SOURCE) {
  console.error('  [KO]  axe-core introuvable. Installer : npm i -D @axe-core/cli');
  console.error('        Un verrou qui ne peut pas mesurer n\'est pas un verrou.');
  process.exit(2);
}

const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8', '.xml': 'application/xml; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.ico': 'image/x-icon', '.woff2': 'font/woff2', '.txt': 'text/plain; charset=utf-8' };

function servir() {
  const s = http.createServer((req, res) => {
    const u = new URL(req.url, 'http://127.0.0.1');
    let cible = path.join(DIST, decodeURIComponent(u.pathname));
    if (!cible.startsWith(DIST)) { res.writeHead(403).end('hors racine'); return }
    if (fs.existsSync(cible) && fs.statSync(cible).isDirectory()) cible = path.join(cible, 'index.html');
    if (!fs.existsSync(cible)) cible = path.join(DIST, 'index.html');
    res.writeHead(200, { 'Content-Type': MIME[path.extname(cible)] || 'application/octet-stream' });
    fs.createReadStream(cible).pipe(res);
  });
  return new Promise((r) => s.listen(PORT, '127.0.0.1', () => r(s)));
}

function trouverChrome() {
  const c = [process.env.CHROME_PATH, 'C:/Program Files/Google/Chrome/Application/chrome.exe', 'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe', path.join(process.env.LOCALAPPDATA || '', 'Google/Chrome/Application/chrome.exe'), '/usr/bin/google-chrome', '/usr/bin/chromium'];
  const direct = c.find((x) => { try { return x && fs.existsSync(x) } catch { return false } });
  if (direct) return direct;
  // Les navigateurs posés par Playwright, à défaut d'un Chrome système.
  const base = path.join(process.env.LOCALAPPDATA || '', 'ms-playwright');
  try {
    for (const d of fs.readdirSync(base)) {
      if (!/^chromium-\d+$/.test(d)) continue;
      for (const s of ['chrome-win64/chrome.exe', 'chrome-win/chrome.exe']) {
        const p = path.join(base, d, s);
        if (fs.existsSync(p)) return p;
      }
    }
  } catch {}
  return null;
}

class Cdp {
  constructor(ws) { this.ws = ws; this.seq = 0; this.attentes = new Map() }
  static async connecter(wsUrl) {
    const ws = new WebSocket(wsUrl);
    await new Promise((res, rej) => { ws.addEventListener('open', res); ws.addEventListener('error', rej) });
    const c = new Cdp(ws);
    ws.addEventListener('message', (e) => {
      let m; try { m = JSON.parse(e.data) } catch { return }
      if (m.id && c.attentes.has(m.id)) { c.attentes.get(m.id)(m); c.attentes.delete(m.id) }
    });
    return c;
  }
  envoyer(method, params) { return new Promise((res) => { const i = ++this.seq; this.attentes.set(i, res); this.ws.send(JSON.stringify({ id: i, method, params })) }) }
  async evaluer(expression, attendrePromesse = false) {
    const r = await this.envoyer('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: attendrePromesse });
    if (r && r.result && r.result.exceptionDetails) return { __erreur: r.result.exceptionDetails.text };
    return r && r.result && r.result.result ? r.result.result.value : undefined;
  }
  fermer() { try { this.ws.close() } catch {} }
}
const attendre = (ms) => new Promise((r) => setTimeout(r, ms));

async function principal() {
  /* ── les routes : le sitemap, comme prerendre.js ── */
  let routes;
  if (ROUTES_FORCEES) {
    routes = ROUTES_FORCEES.split(',').map((r) => r.trim()).filter(Boolean);
  } else {
    const sm = path.join(DIST, 'sitemap.xml');
    if (!fs.existsSync(sm)) { console.error('dist/sitemap.xml introuvable'); process.exit(2) }
    routes = [...fs.readFileSync(sm, 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)]
      .map((m) => { try { return new URL(m[1]).pathname.replace(/\/+$/, '') || '/' } catch { return null } })
      .filter((v) => v !== null);
    routes = [...new Set(routes)];
  }
  if (PLAFOND > 0) routes = routes.slice(0, PLAFOND);

  const serveur = await servir();
  const profil = fs.mkdtempSync(path.join(os.tmpdir(), 'a11y-'));
  const chrome = trouverChrome();
  if (!chrome) { console.error('Chrome introuvable (définir CHROME_PATH)'); serveur.close(); process.exit(2) }
  const proc = spawn(chrome, ['--headless=new', '--disable-gpu', '--no-sandbox', '--no-first-run', '--no-default-browser-check', `--remote-debugging-port=${DEBUG_PORT}`, `--user-data-dir=${profil}`, `http://127.0.0.1:${PORT}/`], { stdio: 'ignore' });

  let cdp = null;
  for (let i = 0; i < 40 && !cdp; i++) {
    await attendre(300);
    try {
      const cibles = await (await fetch(`http://127.0.0.1:${DEBUG_PORT}/json/list`)).json();
      const page = cibles.find((c) => c.type === 'page' && c.webSocketDebuggerUrl);
      if (page) cdp = await Cdp.connecter(page.webSocketDebuggerUrl);
    } catch {}
  }
  if (!cdp) { console.error('Chrome ne répond pas sur le port de débogage'); proc.kill(); serveur.close(); process.exit(2) }
  await cdp.envoyer('Page.enable');
  await cdp.envoyer('Runtime.enable');
  /* ⚠ ON AUDITE AVEC `prefers-reduced-motion: reduce` — ET CE N'EST PAS UN DÉTAIL.
     Deuxième correction du 13/09/2026, après une divergence inexplicable :

       première version du script, 22 routes dans la MÊME session
         /confidentialite : 68 violations de contraste · /cgv : 35 · /watashi : 16
       exécution contrôlée, une route à la fois, session neuve
         /confidentialite :  0 violations · /cgv :  0 · /watashi :  1

     L'écart ne vient pas de `resultTypes` (vérifié : résultats identiques avec et
     sans). Il vient des ANIMATIONS DE RÉVÉLATION : `.reveal` et `.scroll-reveal`
     partent d'`opacity: 0`. Selon l'instant où axe échantillonne, il calcule un
     contraste sur une couleur MÉLANGÉE au fond — d'où des dizaines de « défauts »
     qui n'existent pas à l'arrêt, et qui changent d'une exécution à l'autre.

     Neutraliser le mouvement n'est pas contourner la mesure, c'est la rendre
     juste : on mesure ce que le visiteur LIT, pas une image intermédiaire d'une
     transition. `prefers-reduced-motion: reduce` force tout le contenu à
     `opacity: 1` immédiatement — et c'est déjà ce que le site fait pour ses
     visiteurs qui le demandent (vérifié : 0 élément révélé laissé à `opacity < 1`).

     Restent ensuite mesurées pour de vrai : structure (landmarks, titres),
     formulaires (`label`, `select-name`) — les violations que la vérification
     contrôlée a CONFIRMÉES. */
  await cdp.envoyer('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
  await cdp.envoyer('Page.addScriptToEvaluateOnNewDocument', { source: AXE_SOURCE });

  const bilan = [];
  for (const route of routes) {
    await cdp.envoyer('Page.navigate', { url: `http://127.0.0.1:${PORT}${route}` });
    /* ⚠ L'ATTENTE QUI FAIT LA DIFFÉRENCE.
       On ne mesure pas dès que le DOM existe : on attend la disparition du
       `.loader` — le signal réel de fin de démarrage, déjà utilisé par
       prerendre.js. C'est ce qui supprime le faux positif `color-contrast`
       sur les millisecondes du journal, mesuré à opacité 0,02 à +150 ms. */
    let pret = false;
    for (let i = 0; i < 40; i++) {
      await attendre(250);
      const etat = await cdp.evaluer(`JSON.stringify({ loader: !!document.querySelector('.loader'), charge: !!document.querySelector('.app--loaded') })`);
      try { const v = JSON.parse(etat); if (v.charge && !v.loader) { pret = true; break } } catch {}
    }
    /* ⚠️ ON DEMANDE AUSSI `incomplete`, ET CE N'EST PAS DU ZÈLE.
       Ce verrou demandait `resultTypes: ['violations']` — il excluait donc
       explicitement la seconde liste qu'axe rend. Or axe range sous « incomplete »
       les cas qu'il ne sait pas trancher, et il faut les VOIR : un champ dont le
       seul texte est un `placeholder` n'est pas une violation pour lui, c'est un
       cas à juger.
       Mesuré le 13/09/2026 : sur `/apps/invoice-generator`, axe signalait **3
       violations** là où **19 champs** n'avaient aucun nom accessible — et ce
       verrou affichait « aucune violation » sur les pages concernées. *Il rapportait
       la moitié de la réponse comme si c'était la totalité.*
       `incomplete` NE FAIT PAS ÉCHOUER le verrou — c'est du « à examiner », pas du
       « cassé ». Mais il doit être VISIBLE, sinon on croit la page propre. */
    const brut = await cdp.evaluer(`axe.run(document, { resultTypes: ['violations', 'incomplete'] }).then(r => JSON.stringify({
      pret: ${pret},
      violations: r.violations.map(v => ({ id: v.id, impact: v.impact, aide: v.help, nb: v.nodes.length, cibles: v.nodes.slice(0,4).map(n => n.target.join(' ')) })),
      incomplets: (r.incomplete || []).map(v => ({ id: v.id, impact: v.impact, aide: v.help, nb: v.nodes.length, cibles: v.nodes.slice(0,4).map(n => n.target.join(' ')) })),
      inapplicable: r.inapplicable.length, passes: r.passes.length }))`, true);
    let res;
    try { res = JSON.parse(brut) } catch { res = { erreur: String(brut).slice(0, 160) } }
    bilan.push({ route, ...res });
    const n = res.violations ? res.violations.length : -1;
    console.log(`  ${String(route).padEnd(30)} ${n > 0 ? n + ' violation(s)' : (n === 0 ? 'aucune violation' : 'ÉCHEC DE MESURE')}${pret ? '' : '  (loader jamais parti — mesuré quand même)'}`);
  }

  cdp.fermer(); proc.kill(); serveur.close();

  const total = bilan.reduce((s, r) => s + (r.violations ? r.violations.length : 1), 0);
  const totalIncomplets = bilan.reduce((s, r) => s + (r.incomplets ? r.incomplets.length : 0), 0);
  console.log('');
  console.log('='.repeat(74));
  console.log('  Accessibilité RENDUE — axe-core, mesuré APRÈS la fin du démarrage');
  console.log('='.repeat(74));
  for (const r of bilan) {
    if (!r.violations || !r.violations.length) continue;
    console.log(`\n  ${r.route}`);
    for (const v of r.violations) {
      console.log(`    [${v.impact}] ${v.id} — ${v.nb} occurrence(s) : ${v.aide}`);
      for (const c of v.cibles) console.log(`        · ${c}`);
    }
  }
  /* Les cas qu'axe n'a pas su trancher — affichés À PART, et qui ne font pas échouer. */
  const avecIncomplets = bilan.filter((r) => r.incomplets && r.incomplets.length);
  if (avecIncomplets.length) {
    console.log('');
    console.log('  ── À EXAMINER (axe n\'a pas tranché — ne fait pas échouer ce verrou) ──');
    for (const r of avecIncomplets) {
      console.log(`\n  ${r.route}`);
      for (const v of r.incomplets) {
        console.log(`    [${v.id}] ${v.nb} occurrence(s) : ${v.aide}`);
        for (const c of v.cibles) console.log(`        · ${c}`);
      }
    }
    console.log('');
    console.log('  ⚠ Ces cas ne sont PAS des violations — mais ils ne sont pas propres non plus.');
    console.log('    Les ignorer, c\'est lire la moitié de la réponse d\'axe et l\'appeler un tout.');
  }
  console.log('');
  console.log(`  routes mesurées : ${bilan.length} · violations : ${total} · à examiner : ${totalIncomplets}`);
  console.log('  ⚠ axe-core ne détecte que 20 à 50 % des problèmes d\'accessibilité.');
  console.log('    Ce verrou ne remplace pas une revue manuelle — il l\'allège.');
  if (total) { console.log('='.repeat(74)); process.exit(1) }
  console.log('  Aucune violation détectée sur le rendu.');
  console.log('='.repeat(74));
  process.exit(0);
}

principal().catch((e) => { console.error('audit interrompu :', e && e.stack ? e.stack : e); process.exit(2) });
