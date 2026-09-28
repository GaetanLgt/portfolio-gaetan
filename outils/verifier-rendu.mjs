// verifier-rendu.mjs — GL Digital Lab, 28/09/2026
// ⛔ CE SCRIPT EXISTE PARCE QUE MES MESURES HTTP NE VOIENT PAS CE QUE LE NAVIGATEUR VOIT.
//    Gaëtan : « mon site est tout pété ». Six contrôles HTTP disaient 200, le CSS
//    complet, le <main> correct — et l'écran, lui, était sans style.
//    ⭐ *Un fichier servi n'est pas un fichier appliqué.* Il faut un MOTEUR pour le dire.
//
// Il ouvre la page dans Edge headless, ATTEND le chargement, puis demande au navigateur :
//   · combien de feuilles de style il a réellement chargées ;
//   · si les règles visées par `.manifeste` sont bien dans un document appliqué ;
//   · quelle est la couleur de fond CALCULÉE du body ;
//   · ce que la console a signalé.
import { spawn } from 'node:child_process';
import fs from 'node:fs';

const EDGE = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const URL_CIBLE = process.argv[2] || 'https://www.gldigitallab.fr/';
const PORT = 9333;
const PROFIL = 'C:/IA/portfolio-gaetan/_sas-retour/edge-cdp';

const edge = spawn(EDGE, [
  '--headless=new', '--disable-gpu', '--no-first-run', '--incognito',
  `--remote-debugging-port=${PORT}`, `--user-data-dir=${PROFIL}`,
  '--window-size=1600,1200', URL_CIBLE
], { stdio: 'ignore', detached: false });

const attendre = (ms) => new Promise(r => setTimeout(r, ms));

async function cibles() {
  for (let i = 0; i < 30; i++) {
    try {
      const r = await fetch(`http://127.0.0.1:${PORT}/json/list`);
      const j = await r.json();
      const page = j.find(t => t.type === 'page' && t.webSocketDebuggerUrl);
      if (page) return page;
    } catch { /* pas encore prêt */ }
    await attendre(500);
  }
  throw new Error('Edge ne répond pas sur le port de débogage');
}

let ws;
// ⛔ `ws.on(...)` est l'API de la librairie `ws` (Node). Le WebSocket GLOBAL de Node 22+
//    suit l'API du NAVIGATEUR : `addEventListener`. Les deux ne se mélangent pas —
//    et l'erreur « ws.on is not a function » ne dit pas laquelle on a.
function cdp(ws, id, method, params = {}) {
  return new Promise((res, rej) => {
    const timer = setTimeout(() => rej(new Error('timeout ' + method)), 20000);
    const onMsg = (ev) => {
      const m = JSON.parse(ev.data);
      if (m.id === id) { clearTimeout(timer); ws.removeEventListener('message', onMsg); res(m); }
    };
    ws.addEventListener('message', onMsg);
    ws.send(JSON.stringify({ id, method, params }));
  });
}

const page = await cibles();
// ⛔ `WebSocket` global n'existe qu'à partir de Node 22. Sur cette machine, node 24 l'a —
//    mais le module `worker_threads` ne l'exporte PAS. On prend le global, sinon on échoue
//    franchement plutôt que d'inventer.
const WS = globalThis.WebSocket;
if (!WS) throw new Error('WebSocket global absent : node trop ancien (' + process.version + ')');
ws = new WS(page.webSocketDebuggerUrl);
await new Promise((r) => ws.addEventListener('open', r, { once: true }));

await cdp(ws, 1, 'Runtime.enable');
await cdp(ws, 2, 'Page.enable');
await attendre(3500); // laisser le réseau finir

const JS = `(() => {
  const feuilles = [...document.styleSheets].map(s => {
    let regles = null, err = null;
    try { regles = s.cssRules ? s.cssRules.length : null; } catch (e) { err = String(e).slice(0, 60); }
    return { href: s.href ? s.href.split('/').pop() : '(inline)', regles, err };
  });
  const main = document.querySelector('main');
  const body = document.body;
  const hero = document.querySelector('.mf-hero');
  const cs = (el) => el ? getComputedStyle(el) : null;
  return {
    titre: document.title,
    bodyClass: body.className,
    mainClass: main ? main.className : null,
    mainId: main ? main.id : null,
    nbMain: document.querySelectorAll('main').length,
    feuilles,
    fondBody: cs(body).backgroundColor,
    fondMain: cs(main).backgroundColor,
    mainDisplay: cs(main).display,
    heroExiste: !!hero,
    heroDisplay: hero ? cs(hero).display : null,
    heroColonnes: hero ? cs(hero).gridTemplateColumns : null,
    largeurBarre: (() => { const b = document.querySelector('.site-barre, header'); return b ? Math.round(b.getBoundingClientRect().width) : null; })(),
    nbSections: document.querySelectorAll('main section').length,
    nbCartes: document.querySelectorAll('.mf-carte').length,
    hauteurDoc: Math.round(document.documentElement.scrollHeight)
  };
})()`;

const rep = await cdp(ws, 10, 'Runtime.evaluate', { expression: JS, returnByValue: true });
const v = rep.result?.result?.value;

console.log('  URL testée : ' + URL_CIBLE);
console.log('');
console.log('=== CE QUE LE NAVIGATEUR A RÉELLEMENT CHARGÉ ===');
console.log('  titre        : ' + v.titre);
console.log('  body class   : ' + JSON.stringify(v.bodyClass));
console.log('  <main>       : ' + v.nbMain + ' trouvé(s) · class=' + JSON.stringify(v.mainClass) + ' · id=' + JSON.stringify(v.mainId));
console.log('');
console.log('  feuilles de style :');
for (const f of v.feuilles) console.log('    ' + String(f.href).padEnd(24) + ' règles=' + f.regles + (f.err ? '  ⛔ ' + f.err : ''));
console.log('');
console.log('=== CE QUE LE NAVIGATEUR CALCULE ===');
console.log('  fond du body      : ' + v.fondBody);
console.log('  fond du main      : ' + v.fondMain);
console.log('  display du main   : ' + v.mainDisplay);
console.log('  .mf-hero existe   : ' + v.heroExiste + '   display=' + v.heroDisplay + '   colonnes=' + v.heroColonnes);
console.log('  sections          : ' + v.nbSections);
console.log('  cartes .mf-carte  : ' + v.nbCartes);
console.log('  largeur de barre  : ' + v.largeurBarre + ' px');
console.log('  hauteur du doc    : ' + v.hauteurDoc + ' px');
console.log('');
const cssApplique = v.fondBody !== 'rgba(0, 0, 0, 0)' && v.heroColonnes && v.heroColonnes !== 'none';
console.log(cssApplique ? '  ✅ LE CSS EST APPLIQUÉ' : '  ⛔ LE CSS N\'EST PAS APPLIQUÉ');

try { ws.close(); } catch {}
try { edge.kill(); } catch {}
process.exit(cssApplique ? 0 : 1);
