#!/usr/bin/env node
// ============================================================
// verifier-console.mjs — GL Digital Lab (portfolio-gaetan)
// LA PAGE TOURNE-T-ELLE, OU LÈVE-T-ELLE UNE ERREUR À CHAQUE IMAGE ?
//
// ⛔ POURQUOI CE FICHIER EXISTE — défaut mesuré le 24/09/2026, NON CORRIGÉ.
//
//   `Uncaught ReferenceError: colonnesDeCode is not defined`
//   frame https://gldigitallab.fr/:1015   ← le throw
//   frame https://gldigitallab.fr/:962    ← dans la boucle d'animation
//
//   ⭐ L'erreur se répète à CHAQUE `requestAnimationFrame`, et elle tombe
//      AVANT `renderer.render(scene,camera)`. **La scène 3D n'est jamais
//      dessinée** — et le visiteur, lui, voit une page qui a l'air normale.
//
// ⛔⛔ ET LE STUDIO AVAIT TOUS LES AUTRES VERROUS : poids, contrastes,
//     topographie, i18n, accessibilité, CSS sans balisage, requêtes, miroirs…
//     **Aucun ne regardait la console.** Vérifier une page sans l'exécuter, c'est
//     vérifier une image de la page.
//
// ⭐ LA LEÇON, ET C'EST ELLE QUI A ÉCRIT CE SCRIPT :
//     *un contrôle qui regarde la page ne contrôle rien s'il ne la FAIT PAS TOURNER.*
//
// ─────────────────────────────────────────────────────────────────────────────
// DEUX MODES, ET LE SECOND EST CELUI QUI A MESURÉ LE DÉFAUT
//
//   node scripts/verifier-console.mjs                      → sert `dist/` en local
//   node scripts/verifier-console.mjs --urls <u1,u2,…>     → visite des URLs réelles
//
// ⚠️ ET UN PIÈGE QUI AURAIT FAIT UN FAUX NÉGATIF : le défaut ne se déclenche que
//    si la boucle d'animation TOURNE. Un Chrome sans WebGL ne la fait pas tourner…
//    et rendrait « aucune erreur ». ⇒ `--enable-unsafe-swiftshader` est OBLIGATOIRE :
//    il rend le WebGL en logiciel. **Un contrôle incapable de faire tourner ce qu'il
//    mesure est un contrôle qui dira toujours oui.**
//
// Usage :
//   node scripts/verifier-console.mjs [--dist dist] [--port 4179] [--attente 5000]
//   node scripts/verifier-console.mjs --urls https://gldigitallab.fr/,https://arkadia.gldigitallab.fr/
//   node scripts/verifier-console.mjs --liste <fichier.txt>      (une URL par ligne)
//
// Sortie : 0 si toutes les pages sont propres, 1 sinon. Aucun navigateur visible.
// ============================================================
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import http from 'node:http'
import { spawn, spawnSync } from 'node:child_process'

const args = process.argv.slice(2)
const option = (nom, defaut) => {
  const i = args.indexOf('--' + nom)
  return i >= 0 && args[i + 1] && !args[i + 1].startsWith('--') ? args[i + 1] : defaut
}

const DIST = path.resolve(option('dist', 'dist'))
const PORT = Number(option('port', 4179))
const DEBUG_PORT = PORT + 1
const ATTENTE = Number(option('attente', 5000))
const URLS_ARG = option('urls', '')
const LISTE = option('liste', '')
const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.mjs': 'text/javascript',
  '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png',
  '.jpg': 'image/jpeg', '.webp': 'image/webp', '.woff2': 'font/woff2', '.xml': 'application/xml',
  '.txt': 'text/plain; charset=utf-8', '.glb': 'model/gltf-binary', '.mp4': 'video/mp4' }

const attendre = (ms) => new Promise((r) => setTimeout(r, ms))
const dire = (l = '') => console.log(l)

/* ---------- le client CDP minimal — repris de prerendre.js ---------- */
class Cdp {
  constructor(ws) { this.ws = ws; this.seq = 0; this.attentes = new Map(); this.evenements = []; this.fige = false }
  static async connecter(wsUrl) {
    const ws = new WebSocket(wsUrl)
    await new Promise((res, rej) => { ws.addEventListener('open', res); ws.addEventListener('error', rej) })
    const c = new Cdp(ws)
    ws.addEventListener('message', (e) => {
      let m; try { m = JSON.parse(e.data) } catch { return }
      if (m.id && c.attentes.has(m.id)) { c.attentes.get(m.id)(m); c.attentes.delete(m.id); return }
      if (m.method) c.evenements.push(m)     // ⭐ CE QUE prerendre.js JETAIT : les ÉVÉNEMENTS
    })
    return c
  }
  envoyer(method, params, delaiMax = 15000) {
    if (this.fige) return Promise.reject(new Error(`CDP ${method} : moteur figé`))
    return new Promise((res, rej) => {
      const i = ++this.seq
      const minuteur = setTimeout(() => {
        this.attentes.delete(i); this.fige = true
        rej(new Error(`CDP ${method} sans réponse après ${delaiMax} ms`))
      }, delaiMax)
      this.attentes.set(i, (m) => { clearTimeout(minuteur); res(m) })
      try { this.ws.send(JSON.stringify({ id: i, method, params })) }
      catch (e) { clearTimeout(minuteur); this.attentes.delete(i); rej(e) }
    })
  }
  fermer() { try { this.ws.close() } catch {} }
}

/* ---------- le serveur local, quand on n'a pas d'URLs réelles ---------- */
function servir(dist) {
  return http.createServer((req, res) => {
    const chemin = decodeURIComponent(req.url.split('?')[0])
    let f = path.join(dist, chemin)
    try {
      if (fs.existsSync(f) && fs.statSync(f).isDirectory()) f = path.join(f, 'index.html')
      if (!fs.existsSync(f)) { f = path.join(dist, '404.html') }
      const corps = fs.readFileSync(f)
      res.writeHead(200, { 'Content-Type': MIME[path.extname(f)] || 'application/octet-stream' })
      res.end(corps)
    } catch { res.writeHead(404); res.end('') }
  })
}

function trouverChrome() {
  if (process.env.CHROME_PATH && fs.existsSync(process.env.CHROME_PATH)) return process.env.CHROME_PATH
  const candidats = [
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    '/usr/bin/google-chrome', '/usr/bin/google-chrome-stable', '/opt/google/chrome/chrome',
    '/usr/bin/chromium', '/usr/bin/chromium-browser',
  ]
  return candidats.find((c) => { try { return fs.existsSync(c) } catch { return false } }) || null
}

/* ---------- les URLs à visiter ---------- */
let urls = []
if (URLS_ARG) urls = URLS_ARG.split(',').map((u) => u.trim()).filter(Boolean)
else if (LISTE) urls = fs.readFileSync(LISTE, 'utf8').split(/\r?\n/).map((l) => l.trim()).filter((l) => l && !l.startsWith('#'))
const EN_RESEAU = urls.length > 0
if (!EN_RESEAU) {
  if (!fs.existsSync(DIST)) { console.error(`⛔ ${DIST} introuvable — et aucune --urls fournie.`); process.exit(2) }
  const racines = ['/', '/dossier/', '/vitrine/', '/services/']
  urls = racines.map((r) => `http://127.0.0.1:${PORT}${r}`)
}

dire('='.repeat(78))
dire('LA PAGE TOURNE-T-ELLE ? — on ouvre, on écoute, on rapporte')
dire('='.repeat(78))
dire(`  cibles : ${urls.length} URL(s) ${EN_RESEAU ? 'RÉELLES (réseau)' : `sur ${DIST} (local)`}`)
dire(`  attente après chargement : ${ATTENTE} ms — le temps que la boucle d'animation tourne`)
dire('')

const chrome = trouverChrome()
if (!chrome) { console.error('⛔ Chrome introuvable. CHROME_PATH ou installation requise.'); process.exit(2) }

let serveur = null
if (!EN_RESEAU) {
  serveur = servir(DIST)
  await new Promise((r) => serveur.listen(PORT, '127.0.0.1', r))
}

const profil = fs.mkdtempSync(path.join(os.tmpdir(), 'verif-console-'))
const proc = spawn(chrome, [
  '--headless=new',
  '--enable-unsafe-swiftshader',        // ⭐ SANS ÇA, PAS DE WEBGL, DONC PAS DE BOUCLE
  '--no-first-run', '--no-default-browser-check', '--disable-dev-shm-usage',
  '--disable-extensions',
  '--window-size=1280,800',
  `--remote-debugging-port=${DEBUG_PORT}`, `--user-data-dir=${profil}`,
  'about:blank',
], { stdio: 'ignore' })

let cdp = null
for (let i = 0; i < 40 && !cdp; i++) {
  await attendre(300)
  try {
    const cibles = await (await fetch(`http://127.0.0.1:${DEBUG_PORT}/json/list`)).json()
    const page = cibles.find((c) => c.type === 'page' && c.webSocketDebuggerUrl)
    if (page) cdp = await Cdp.connecter(page.webSocketDebuggerUrl)
  } catch { /* Chrome démarre encore */ }
}
if (!cdp) {
  console.error('⛔ Chrome ne répond pas sur le port de débogage.')
  try { proc.kill() } catch {}
  if (serveur) serveur.close()
  process.exit(1)
}

await cdp.envoyer('Runtime.enable')
await cdp.envoyer('Page.enable')
await cdp.envoyer('Log.enable')

const resultats = []
for (const url of urls) {
  cdp.evenements.length = 0
  try { await cdp.envoyer('Page.navigate', { url }) } catch (e) { dire(`  ⛔ ${url} — ${e.message}`) }
  await attendre(ATTENTE)

  const exceptions = []
  for (const e of cdp.evenements) {
    if (e.method === 'Runtime.exceptionThrown') {
      const d = e.params.exceptionDetails || {}
      exceptions.push({
        texte: (d.exception && (d.exception.description || d.exception.value)) || d.text || '?',
        ligne: d.lineNumber != null ? d.lineNumber + 1 : null,
        url: (d.url || '').split('/').pop() || '',
      })
    }
    if (e.method === 'Log.entryAdded' && e.params.entry.level === 'error') {
      // ⭐ L'URL DE LA RESSOURCE EST DANS LE MESSAGE, ET PAS AILLEURS.
      //    ⛔ Sans elle, « Failed to load resource: 429 » ne dit RIEN : *est-ce le
      //    moteur 3D qui manque, une police, ou un service tiers ?* **Un message
      //    d'erreur sans son sujet est un message qui ne se corrige pas.**
      exceptions.push({
        texte: `${e.params.entry.text || '?'} — ${e.params.entry.url || '(sans url)'}`,
        ligne: null, url: '',
      })
    }
  }

  // ⭐ ON REGROUPE PAR MESSAGE : une erreur dans une boucle d'animation arrive
  //    des centaines de fois par seconde. *Le nombre brut ne dit rien — c'est le
  //    NOMBRE DE MESSAGES DIFFÉRENTS qui dit l'état de la page.*
  const parMessage = new Map()
  for (const x of exceptions) {
    const cle = x.texte.split('\n')[0].slice(0, 120)
    if (!parMessage.has(cle)) parMessage.set(cle, { n: 0, lignes: new Set(), x })
    const v = parMessage.get(cle)
    v.n++
    if (x.ligne) v.lignes.add(x.ligne)
  }

  resultats.push({ url, total: exceptions.length, groupes: [...parMessage.entries()] })
  if (parMessage.size === 0) {
    dire(`  ✅ ${url} — aucune erreur de console`)
  } else {
    dire(`  ⛔ ${url} — ${parMessage.size} message(s) d'erreur distinct(s), ${exceptions.length} occurrence(s)`)
    for (const [msg, v] of parMessage) {
      const lignes = [...v.lignes].sort((a, b) => a - b).join(', ')
      dire(`       ×${v.n}  ${msg}`)
      if (lignes) dire(`              ligne(s) : ${lignes}`)
    }
  }
}

dire('')
dire('──────────────────────────────────────────────────────────────')
const enDefaut = resultats.filter((r) => r.groupes.length > 0)
dire(`  ${resultats.length - enDefaut.length}/${resultats.length} page(s) SANS erreur de console`)
if (enDefaut.length > 0) {
  dire('')
  dire('  ⛔ CE QUE ÇA VEUT DIRE, ET CE QUE ÇA NE DIT PAS :')
  dire('     · une erreur dans une boucle d\'animation tombe À CHAQUE IMAGE —')
  dire('       tout ce que la fonction fait APRÈS le throw n\'est JAMAIS exécuté ;')
  dire('     · ⚠️ et une page qui lève une erreur peut s\'afficher normalement :')
  dire('       *c\'est pour ça qu\'aucun verrou de forme ne l\'avait vue.*')
}
dire('──────────────────────────────────────────────────────────────')

cdp.fermer()
try { proc.kill() } catch {}
if (serveur) serveur.close()
try { fs.rmSync(profil, { recursive: true, force: true }) } catch {}

process.exit(enDefaut.length > 0 ? 1 : 0)
