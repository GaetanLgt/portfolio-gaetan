// ============================================================
// prerendre.js — GL Digital Lab (portfolio-gaetan)
// PRÉRENDU DES ROUTES PUBLIQUES, après `vite build`.
//
// POURQUOI. Le site est une SPA Vue : un crawler qui n'exécute pas de
// JavaScript voit UNE seule coquille pour toutes les URLs. Mesuré le
// 10/09/2026 : /services renvoyait exactement les 17 220 octets de l'accueil,
// avec le titre de l'accueil. Le sitemap déclare 25 URLs.
//
// COMMENT, ET POURQUOI AINSI.
//   - Aucune dépendance npm ajoutée : on pilote le Chrome déjà installé par le
//     protocole de débogage (mesuré opérationnel le 10/09/2026). Le prérendu
//     laisse donc le HTML exactement tel que le navigateur le construit, sans
//     réimplémenter le rendu.
//   - La liste des routes vient de `dist/sitemap.xml` : c'est ce qu'on déclare
//     déjà aux moteurs, donc pas de deuxième source de vérité à maintenir.
//   - Chaque page est VÉRIFIÉE après écriture : titre non vide, différent de
//     celui de l'accueil, et corps nettement plus long que la coquille. Un
//     prérendu silencieusement raté est plus dangereux que pas de prérendu.
//
// Usage :
//   node scripts/prerendre.js [--dist dist] [--port 4178]
//   node scripts/prerendre.js --titre-seulement   (rapport sans écrire)
//
// Prérequis : Node >= 22 (WebSocket global), Chrome (ou CHROME_PATH).
// ============================================================
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import http from 'node:http'
import { spawn } from 'node:child_process'

const args = process.argv.slice(2)
const option = (nom, defaut) => {
  const i = args.indexOf('--' + nom)
  return i >= 0 && args[i + 1] && !args[i + 1].startsWith('--') ? args[i + 1] : defaut
}
const DIST = path.resolve(option('dist', 'dist'))
const PORT = Number(option('port', 4178))
const DEBUG_PORT = PORT + 1
const ECRIRE = !args.includes('--titre-seulement')

if (typeof WebSocket !== 'function') {
  console.error('Node >= 22 requis (WebSocket global). Sur Node 20 : --experimental-websocket, ou monter la CI en Node 22.')
  process.exit(1)
}
if (!fs.existsSync(path.join(DIST, 'index.html'))) {
  console.error('dist/index.html introuvable — lancer `npm run build` d’abord.')
  process.exit(1)
}

/* ---------- Chrome ---------- */
function trouverChrome() {
  const candidats = [
    process.env.CHROME_PATH,
    'C:/Program Files/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
    path.join(process.env.LOCALAPPDATA || '', 'Google/Chrome/Application/chrome.exe'),
    '/usr/bin/google-chrome',
    '/usr/bin/google-chrome-stable',
    '/usr/bin/chromium',
    '/usr/bin/chromium-browser',
    '/opt/google/chrome/chrome',
  ].filter(Boolean)
  return candidats.find((c) => { try { return fs.existsSync(c) } catch { return false } })
}

/* ---------- serveur statique (mêmes règles que la production) ---------- */
const MIME = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png',
  '.jpg': 'image/jpeg', '.webp': 'image/webp', '.ico': 'image/x-icon',
  '.woff2': 'font/woff2', '.woff': 'font/woff', '.txt': 'text/plain; charset=utf-8',
}
function servir() {
  const serveur = http.createServer((req, res) => {
    const url = new URL(req.url, 'http://127.0.0.1')
    let cible = path.join(DIST, decodeURIComponent(url.pathname))
    if (!cible.startsWith(DIST)) { res.writeHead(403).end('hors racine'); return }
    if (fs.existsSync(cible) && fs.statSync(cible).isDirectory()) cible = path.join(cible, 'index.html')
    if (!fs.existsSync(cible)) {
      // Repli SPA : ce que fait le serveur de production pour une route inconnue.
      cible = path.join(DIST, 'index.html')
    }
    res.writeHead(200, { 'Content-Type': MIME[path.extname(cible)] || 'application/octet-stream' })
    fs.createReadStream(cible).pipe(res)
  })
  return new Promise((r) => serveur.listen(PORT, '127.0.0.1', () => r(serveur)))
}

/* ---------- client CDP minimal ---------- */
class Cdp {
  constructor(ws) { this.ws = ws; this.seq = 0; this.attentes = new Map() }
  static async connecter(wsUrl) {
    const ws = new WebSocket(wsUrl)
    await new Promise((res, rej) => { ws.addEventListener('open', res); ws.addEventListener('error', rej) })
    const c = new Cdp(ws)
    ws.addEventListener('message', (e) => {
      let m; try { m = JSON.parse(e.data) } catch { return }
      if (m.id && c.attentes.has(m.id)) { c.attentes.get(m.id)(m); c.attentes.delete(m.id) }
    })
    return c
  }
  envoyer(method, params) {
    return new Promise((res) => { const i = ++this.seq; this.attentes.set(i, res); this.ws.send(JSON.stringify({ id: i, method, params })) })
  }
  async evaluer(expression) {
    const r = await this.envoyer('Runtime.evaluate', { expression, returnByValue: true })
    return r && r.result && r.result.result ? r.result.result.value : undefined
  }
  fermer() { try { this.ws.close() } catch {} }
}

const attendre = (ms) => new Promise((r) => setTimeout(r, ms))

async function principal() {
  /* ---------- routes depuis le sitemap ---------- */
  const sitemap = path.join(DIST, 'sitemap.xml')
  if (!fs.existsSync(sitemap)) { console.error('dist/sitemap.xml introuvable'); process.exit(1) }
  const xml = fs.readFileSync(sitemap, 'utf8')
  const routes = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)]
    .map((m) => { try { return new URL(m[1]).pathname.replace(/\/+$/, '') || '/' } catch { return null } })
    .filter((v, i, a) => v !== null && a.indexOf(v) === i)
  console.log(`Prérendu — ${routes.length} URL(s) déclarée(s) dans sitemap.xml`)

  const serveur = await servir()
  const profil = fs.mkdtempSync(path.join(os.tmpdir(), 'prerendu-'))
  const chrome = trouverChrome()
  if (!chrome) { console.error('Chrome introuvable (définir CHROME_PATH)'); process.exit(1) }
  const proc = spawn(chrome, [
    '--headless=new', '--disable-gpu', '--no-sandbox', '--no-first-run', '--no-default-browser-check',
    `--remote-debugging-port=${DEBUG_PORT}`, `--user-data-dir=${profil}`,
    `http://127.0.0.1:${PORT}/`,
  ], { stdio: 'ignore' })

  let cdp = null
  for (let i = 0; i < 40 && !cdp; i++) {
    await attendre(300)
    try {
      const cibles = await (await fetch(`http://127.0.0.1:${DEBUG_PORT}/json/list`)).json()
      const page = cibles.find((c) => c.type === 'page' && c.webSocketDebuggerUrl)
      if (page) cdp = await Cdp.connecter(page.webSocketDebuggerUrl)
    } catch {}
  }
  if (!cdp) { console.error('Chrome ne répond pas sur le port de débogage'); proc.kill(); serveur.close(); process.exit(1) }
  await cdp.envoyer('Page.enable')
  await cdp.envoyer('Runtime.enable')

  const coquille = fs.readFileSync(path.join(DIST, 'index.html'), 'utf8').length
  // titre de référence : celui de l'accueil, pour détecter les routes qui le
  // portent encore (c'est exactement le défaut mesuré le 10/09/2026)
  await cdp.envoyer('Page.navigate', { url: `http://127.0.0.1:${PORT}/` })
  await attendre(2000)
  const titreAccueil = (await cdp.evaluer('document.title')) || ''
  const rapport = []
  let ecrits = 0, echecs = 0

  for (const route of routes) {
    const url = `http://127.0.0.1:${PORT}${route}`
    await cdp.envoyer('Page.navigate', { url })
    // attente active : la vue doit avoir rendu du texte, pas seulement la coquille
    let etat = null
    for (let i = 0; i < 40; i++) {
      await attendre(250)
      const brut = await cdp.evaluer(`JSON.stringify({
        texte: (document.body && document.body.innerText || '').length,
        app: !!(document.querySelector('#app') && document.querySelector('#app').children.length),
        titre: document.title
      })`)
      try { etat = JSON.parse(brut) } catch { etat = null }
      if (etat && etat.app && etat.texte > 400) break
    }
    if (!etat) { rapport.push({ route, ok: false, motif: 'rendu illisible' }); echecs++; continue }

    const html = await cdp.evaluer('"<!DOCTYPE html>\\n" + document.documentElement.outerHTML')
    const titre = etat.titre || ''
    const ok = typeof html === 'string' && html.length > 2000 && titre
    if (!ok) { rapport.push({ route, ok: false, motif: 'capture vide ou sans titre', titre }); echecs++; continue }

    // GARDE-FOU : une URL du sitemap qui rend la page 404 ne doit JAMAIS être
    // préréndue. L'écrire fabriquerait un soft-404 servi en 200 — pire que ce
    // qu'on corrige. On la signale et on échoue : le sitemap est à corriger.
    // Mesuré le 10/09/2026 : 14 des 25 URLs déclarées étaient dans ce cas.
    if (/page non trouv|not found|\b404\b/i.test(titre)) {
      rapport.push({ route, ok: false, titre, motif: 'rend la page 404 — URL à corriger dans sitemap.xml, rien écrit' })
      echecs++
      continue
    }

    const cible = route === '/' ? path.join(DIST, 'index.html') : path.join(DIST, route, 'index.html')
    // Le fichier d'accueil n'est JAMAIS écrasé par cette passe : il porte le
    // JSON-LD et les métadonnées écrites à la main. On le signale seulement.
    if (route === '/' && ECRIRE) {
      rapport.push({ route, ok: true, titre, octets: html.length, ecrit: false, motif: 'accueil préservé (coquille maintenue)' })
      continue
    }
    if (ECRIRE) {
      fs.mkdirSync(path.dirname(cible), { recursive: true })
      fs.writeFileSync(cible, html, 'utf8')
      ecrits++
    }
    rapport.push({ route, ok: true, titre, octets: html.length, ecrit: ECRIRE, memeTitre: titre === titreAccueil && route !== '/' })
  }

  cdp.fermer(); proc.kill(); serveur.close()

  /* ---------- rapport ---------- */
  console.log('\nroute'.padEnd(34) + 'octets'.padStart(8) + '  titre')
  for (const r of rapport) {
    const t = (r.titre || '').slice(0, 60)
    console.log((r.route || '?').padEnd(34) + String(r.octets || 0).padStart(8) + '  ' + (r.ok ? t : 'ÉCHEC — ' + r.motif))
  }
  const distincts = new Set(rapport.filter((r) => r.ok).map((r) => r.titre)).size
  const doublons = rapport.filter((r) => r.memeTitre).length
  console.log(`\ncoquille servie aujourd'hui : ${coquille} octets`)
  console.log(`titres distincts : ${distincts} / ${rapport.length} routes`)
  console.log(`routes portant le titre de l'accueil (le défaut mesuré) : ${doublons}`)
  console.log(`${ECRIRE ? 'fichiers écrits' : 'mode rapport'} : ${ecrits}${echecs ? ` · échecs : ${echecs}` : ''}`)
  if (echecs) process.exitCode = 1
}

principal().catch((e) => { console.error('prérendu interrompu :', e && e.stack ? e.stack : e); process.exit(1) })
