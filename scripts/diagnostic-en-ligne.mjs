#!/usr/bin/env node
/* ═══════════════════════════════════════════════════════════════════════════════
   diagnostic-en-ligne.mjs — POURQUOI LA PAGE NE S'APPLIQUE PAS
   ═══════════════════════════════════════════════════════════════════════════════

   23/09/2026 — GL Digital Lab, par Samus (harnais).

   D'OÙ CE FICHIER VIENT, ET CE QU'IL A COÛTÉ
   -----------------------------------------------------------------------------
   Gaëtan : « nul le site ! » — le site en ligne s'affiche **sans aucun style**.

   ⛔ J'AI ACCUSÉ DEUX FOIS AVANT DE MESURER, ET LES DEUX ÉTAIENT FAUX :
     · « le CSS n'est pas servi »     → HTTP 200, 92,5 Ko, text/css.
     · « c'est l'attribut `crossorigin` » → test A/B : les deux rendus sont stylés.

   ⭐ CE QUI RESTE MESURÉ : *le distant est sans style, le local est stylé, même Chrome,
   même feuille.* ⇒ Il manquait **la seule mesure qui nomme une cause** : **ce que le
   navigateur dit**. `--dump-dom` et `--enable-logging` n'ont rien rendu — *ce n'est pas
   par là qu'on lit une erreur de page.*

   ⭐ CE QUE CE SCRIPT FAIT, ET RIEN D'AUTRE : il ouvre la page dans un Chrome sans tête,
   s'abonne aux **journaux du navigateur** (console, réseau, sécurité), et imprime
   **ce qui a échoué**. *Il ne corrige rien, il ne modifie rien, il ne pousse rien.*

   USAGE
     node scripts/diagnostic-en-ligne.mjs [url]      (défaut : le site public)
   Sortie : le rapport d'erreurs. Code 0 quel que soit le verdict — *c'est un relevé.*
   ═══════════════════════════════════════════════════════════════════════════════ */

import { spawn, spawnSync } from 'node:child_process';
import { mkdtempSync, existsSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const URL_CIBLE = process.argv[2] || 'https://gldigitallab.fr/';
const PORT_DEBUG = 9223;

function trouverChrome() {
  const pistes = [
    process.env.CHROME_PATH,
    'C:/Program Files/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
    join(process.env.LOCALAPPDATA || '', 'Google/Chrome/Application/chrome.exe'),
  ].filter(Boolean);
  return pistes.find((p) => existsSync(p));
}

const chrome = trouverChrome();
if (!chrome) { console.error('⛔ Chrome introuvable (définir CHROME_PATH)'); process.exit(1) }

const profil = mkdtempSync(join(tmpdir(), 'diag-'));
const proc = spawn(chrome, [
  '--headless=new', '--disable-gpu', '--no-sandbox', '--no-first-run',
  `--remote-debugging-port=${PORT_DEBUG}`, `--user-data-dir=${profil}`,
  '--window-size=1440,1200',
  URL_CIBLE,
], { stdio: 'ignore' });

/* ⛔ LE NETTOYAGE PASSE PAR L'ARBRE, PAS PAR LE PARENT — *leçon du 23/09 : `kill()` sur le
   parent a laissé dix Chrome orphelins qui ont rendu le poste inutilisable.* */
function toutNettoyer() {
  try { spawnSync('taskkill', ['/T', '/F', '/PID', String(proc.pid)], { stdio: 'ignore' }) } catch {}
  try { rmSync(profil, { recursive: true, force: true }) } catch {}
}
process.on('exit', toutNettoyer);
process.on('SIGINT', () => { toutNettoyer(); process.exit(130) });

const attendre = (ms) => new Promise((r) => setTimeout(r, ms));

/* ── LE CLIENT CDP, MINIMAL ──────────────────────────────────────────────────── */
let ws = null, id = 0;
const enAttente = new Map();
const journal = { console: [], reseau: [], securite: [], echecs: [], css: [], js: [] };

function envoyer(method, params) {
  return new Promise((resolve, reject) => {
    const n = ++id;
    enAttente.set(n, { resolve, reject });
    ws.send(JSON.stringify({ id: n, method, params: params || {} }));
    setTimeout(() => {
      if (enAttente.has(n)) { enAttente.delete(n); reject(new Error('CDP sans réponse : ' + method)) }
    }, 8000);
  });
}

/* ── ON CHERCHE LA CIBLE ─────────────────────────────────────────────────────── */
let cible = null;
for (let i = 0; i < 40 && !cible; i++) {
  await attendre(300);
  try {
    const l = await (await fetch(`http://127.0.0.1:${PORT_DEBUG}/json/list`)).json();
    cible = l.find((c) => c.type === 'page' && c.webSocketDebuggerUrl);
  } catch {}
}
if (!cible) { console.error('⛔ Chrome ne répond pas sur le port de débogage'); process.exit(1) }

ws = new WebSocket(cible.webSocketDebuggerUrl);
await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej });

ws.onmessage = (ev) => {
  let m; try { m = JSON.parse(ev.data) } catch { return }
  if (m.id && enAttente.has(m.id)) {
    const { resolve } = enAttente.get(m.id);
    enAttente.delete(m.id);
    resolve(m.result);
    return;
  }
  const p = m.params || {};
  switch (m.method) {
    case 'Runtime.consoleAPICalled':
      journal.console.push((p.args || []).map((a) => a.value ?? a.description ?? a.type).join(' '));
      break;
    case 'Log.entryAdded':
      journal.securite.push(`[${p.entry.level}/${p.entry.source}] ${p.entry.text}`);
      break;
    case 'Network.loadingFailed':
      journal.echecs.push(`${p.type || '?'} — ${p.errorText}${p.blockedReason ? ' (bloqué : ' + p.blockedReason + ')' : ''}`);
      break;
    case 'Network.responseReceived': {
      const r = p.response || {};
      const ct = (r.headers && (r.headers['content-type'] || r.headers['Content-Type'])) || '';
      const ligne = `${p.type} ${r.status} ${ct}  ${r.url.slice(0, 110)}`;
      if (/css/i.test(ct) || /\.css(\?|$)/i.test(r.url)) journal.css.push(ligne);
      else if (/javascript/i.test(ct) || /\.js(\?|$)/i.test(r.url)) journal.js.push(ligne);
      if (r.status >= 400) journal.reseau.push(ligne);
      break;
    }
  }
};

await envoyer('Runtime.enable');
await envoyer('Log.enable');
await envoyer('Network.enable');
await envoyer('Page.enable');

/* On recharge POUR être sûr de tout voir depuis le début — *les abonnements posés après
   la première navigation rateraient les erreurs du chargement initial.* */
await envoyer('Page.navigate', { url: URL_CIBLE });
await attendre(9000);

/* ⭐ LA QUESTION DÉCISIVE, ET ELLE SE POSE AU NAVIGATEUR : *la feuille est-elle
   APPLIQUÉE ?* `document.styleSheets` dit ce qui est chargé, et `cssRules` dit ce qui est
   lisible — *une feuille refusée apparaît dans la liste, avec zéro règle.* */
let etat = null;
try {
  const brut = await envoyer('Runtime.evaluate', {
    expression: `JSON.stringify({
      feuilles: [...document.styleSheets].map(f => {
        let regles = null, err = null;
        try { regles = f.cssRules ? f.cssRules.length : null } catch (e) { err = e.name }
        return { href: f.href, regles, err };
      }),
      fond: getComputedStyle(document.body).backgroundColor,
      taille: document.body ? document.body.innerText.length : 0,
      titre: document.title
    })`,
    returnByValue: true,
  });
  etat = JSON.parse(brut.result.value);
} catch (e) {
  etat = { erreur: e.message };
}

/* ── LE RAPPORT ──────────────────────────────────────────────────────────────── */
const L = (t) => console.log(t);
L('════════════════════════════════════════════════════════════════════');
L(' Diagnostic du site — ce que le NAVIGATEUR dit, pas ce que je suppose');
L('════════════════════════════════════════════════════════════════════');
L('  cible : ' + URL_CIBLE);
L('');

/* ⛔ ON COMMENCE PAR LA SEULE RÉPONSE QUI TRANCHE. Le reste est du contexte. */
L(' ① LA FEUILLE DE STYLE EST-ELLE APPLIQUÉE ?');
if (etat && etat.feuilles) {
  if (!etat.feuilles.length) L('    ⛔ AUCUNE feuille chargée.');
  for (const f of etat.feuilles) {
    const verdict = f.err ? '⛔ REFUSÉE — ' + f.err
      : (f.regles === 0 ? '⛔ CHARGÉE MAIS VIDE (0 règle)' : '✅ ' + f.regles + ' règles');
    L('    ' + verdict);
    L('       ' + (f.href || '(inline)'));
  }
  L('    fond calculé du <body> : ' + etat.fond);
  L('    → un fond sombre = la feuille s\'applique ; du blanc = elle ne s\'applique pas.');
} else {
  L('    ⛔ impossible de lire les feuilles : ' + JSON.stringify(etat));
}
L('');

if (etat) {
  L(' ② LA PAGE');
  L('    titre : ' + etat.titre);
  L('    texte visible dans le <body> : ' + etat.taille + ' caractères');
  L('');
}

L(' ③ LES FEUILLES RÉPONDUES');
if (journal.css.length) journal.css.forEach((l) => L('    ' + l));
else L('    (aucune)');
L('');

L(' ④ LES SCRIPTS RÉPONDUS');
if (journal.js.length) journal.js.forEach((l) => L('    ' + l));
else L('    (aucun)');
L('');

L(' ⑤ LES ÉCHECS RÉSEAU — *les plus parlants*');
if (journal.echecs.length) journal.echecs.forEach((l) => L('    ⛔ ' + l));
else L('    (aucun)');
L('');

L(' ⑥ LE JOURNAL DU NAVIGATEUR — console et sécurité');
const tous = [...journal.securite, ...journal.console.map((c) => '[console] ' + c)];
if (tous.length) tous.slice(0, 40).forEach((l) => L('    ' + l));
else L('    (vide)');
L('');

L(' ⑦ LES RÉPONSES EN ERREUR (>= 400)');
if (journal.reseau.length) journal.reseau.forEach((l) => L('    ' + l));
else L('    (aucune)');
L('');

L(' ⛔ CE QUE CE SCRIPT NE DIT PAS');
L('    · **Pourquoi** une feuille est refusée, quand c\'est le cas — *il nomme le refus,');
L('      pas son auteur. La cause est dans l\'en-tête ou dans le contenu, pas ici.*');
L('    · **Rien du côté serveur** : il ne voit que ce que le navigateur a reçu.');
L('    · Il **ne corrige rien, ne modifie rien, ne pousse rien**.');
L('════════════════════════════════════════════════════════════════════');

ws.close();
toutNettoyer();
process.exitCode = 0;
