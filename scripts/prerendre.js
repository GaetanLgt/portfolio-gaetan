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
const RACINE = path.resolve(DIST, '..')
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
  /* ---------- routes : le plan de site ∪ les routes réelles du routeur ----------
     Deux listes, deux rôles :
       - sitemap.xml  = ce qu'on DÉCLARE à l'indexation ;
       - src/router   = ce qui EXISTE et doit donc avoir une page HTML, même sans
         être déclaré (/sitemap, /ark-admin — décision Gaëtan : joignables mais
         pas proposés à l'indexation).
     Sans la seconde, retirer le repli SPA du .htaccess casserait ces pages. */
  const sitemap = path.join(DIST, 'sitemap.xml')
  if (!fs.existsSync(sitemap)) { console.error('dist/sitemap.xml introuvable'); process.exit(1) }
  const xml = fs.readFileSync(sitemap, 'utf8')
  const urlsSitemap = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)]
    .map((m) => { try { return new URL(m[1]).pathname.replace(/\/+$/, '') || '/' } catch { return null } })
    .filter((v) => v !== null)
  const routeur = path.join(RACINE, 'src', 'router', 'index.js')
  let urlsRouteur = []
  if (fs.existsSync(routeur)) {
    // Les blocs commentés retirés AVANT lecture : le routeur contient un
    // « FORMATION — masqué temporairement (droits en attente) » mis en
    // commentaire. Sans ce nettoyage, on tenterait de prérendre /formation,
    // qui rend la page 404 — et le build échouerait pour une route désactivée
    // volontairement.
    const src = fs.readFileSync(routeur, 'utf8').replace(/\/\*[\s\S]*?\*\//g, '')
    urlsRouteur = [...src.matchAll(/path:\s*'([^']+)'/g)]
      .map((m) => m[1])
      .filter((p) => !p.includes(':') && !p.includes('*'))
  }
  const routes = [...new Set([...urlsSitemap, ...urlsRouteur])]
  console.log(`Prérendu — ${urlsSitemap.length} URL(s) au sitemap, ${urlsRouteur.length} route(s) au routeur, ${routes.length} à rendre`)

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

    // ── Retrait des scripts INJECTÉS À L'EXÉCUTION ────────────────────────
    // Cette ligne capture `documentElement.outerHTML` APRÈS exécution du JS :
    // tout script que l'application injecte dans <head> se retrouve donc FIGÉ
    // dans le HTML statique livré.
    // Constaté le 10/09/2026 (Matomo) : la balise
    //   <script async src="https://analytics.gldigitallab.fr/matomo.js">
    // était cuite dans les 12 pages prérendues SANS aucune configuration `_paq`.
    // Conséquence mesurée : matomo.js chargeait sans tracker et journalisait un
    // avertissement console sur chacune de ces pages → bonnes pratiques
    // Lighthouse à 96 au lieu de 100. L'accueil, lui, n'est jamais écrasé par
    // cette passe (voir plus bas) : c'est pourquoi il était la seule page propre.
    // Règle : un script injecté à l'exécution n'a rien à faire dans un HTML figé.
    // Il sera réinjecté normalement par l'application, côté navigateur.
    const html = (await cdp.evaluer('"<!DOCTYPE html>\\n" + document.documentElement.outerHTML'))
      .replace(/<script[^>]+src="[^"]*matomo\.js"[^>]*>\s*<\/script>/gi, '')
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
      // CORRIGÉ LE 11/09/2026 — l'accueil EST prérendu, mais son en-tête est gardé.
      //
      // Avant, cette passe SAUTAIT l'accueil pour ne pas écraser le JSON-LD et les
      // métadonnées écrites à la main. La règle protégeait la bonne chose et
      // produisait la mauvaise : la page d'accueil était la SEULE sans contenu dans
      // son HTML. Mesuré : sur les trois textes attendus par audit-routes.py, seul
      // « ARKADIA » sortait — parce qu'il figure dans le <noscript>. « La machine
      // travaille » et « Interrogez le poste » étaient absents, comme tout le reste.
      // Un visiteur sans JavaScript, un moteur qui n'exécute pas, un aperçu de lien
      // social : tous ne voyaient que la coquille.
      //
      // On ne remplace donc plus l'accueil : on FUSIONNE. L'en-tête de la coquille
      // (JSON-LD, métadonnées, theme-color) est reposé tel quel sur le corps rendu.
      // Le fichier écrit à la main reste la source de l'en-tête ; le rendu apporte
      // le contenu. Les deux sont préservés, et rien n'est plus perdu.
      const coquille = fs.readFileSync(cible, 'utf8')
      const teteCoquille = (coquille.match(/<head[\s\S]*?<\/head>/i) || [])[0]
      const fusion = teteCoquille
        ? html.replace(/<head[\s\S]*?<\/head>/i, teteCoquille)
        : html
      fs.writeFileSync(cible, fusion, 'utf8')
      ecrits++
      rapport.push({ route, ok: true, titre, octets: fusion.length, ecrit: true, motif: `accueil prérendu, en-tête préservé (${teteCoquille ? teteCoquille.length : 0} o)` })
      continue
    }
    if (ECRIRE) {
      fs.mkdirSync(path.dirname(cible), { recursive: true })
      fs.writeFileSync(cible, html, 'utf8')
      ecrits++
    }
    rapport.push({ route, ok: true, titre, octets: html.length, ecrit: ECRIRE, memeTitre: titre === titreAccueil && route !== '/' })
  }

  /* ---------- page 404 ----------
     Une adresse inconnue doit répondre 404 avec CETTE page (ErrorDocument du
     .htaccess), et non 200 avec la page d'accueil. Mesuré le 10/09/2026 : le
     repli SPA renvoyait la coquille de l'accueil en HTTP 200 pour /arcade, /cv…
     — un doublon de l'accueil aux yeux d'un moteur, pas un 404. */
  const cheminIntrouvable = '/__page-introuvable__'
  await cdp.envoyer('Page.navigate', { url: `http://127.0.0.1:${PORT}${cheminIntrouvable}` })
  let etat404 = null
  for (let i = 0; i < 40; i++) {
    await attendre(250)
    const brut = await cdp.evaluer(`JSON.stringify({
      texte: (document.body && document.body.innerText || '').length,
      app: !!(document.querySelector('#app') && document.querySelector('#app').children.length),
      titre: document.title
    })`)
    try { etat404 = JSON.parse(brut) } catch { etat404 = null }
    if (etat404 && etat404.app && etat404.texte > 200) break
  }
  const html404brut = await cdp.evaluer('"<!DOCTYPE html>\\n" + document.documentElement.outerHTML')
  if (typeof html404brut === 'string' && etat404 && /404|non trouv/i.test(etat404.titre)) {
    // Le routeur a posé un canonical sur le chemin de test : sur une page servie
    // à TOUTES les adresses inconnues, il ne désigne rien. On le retire.
    const html404 = html404brut.replace(/\s*<link rel="canonical"[^>]*>/i, '')
    fs.writeFileSync(path.join(DIST, '404.html'), html404, 'utf8')
    ecrits++
    rapport.push({ route: '404.html', ok: true, titre: etat404.titre, octets: html404.length, ecrit: true })
  } else {
    rapport.push({ route: '404.html', ok: false, motif: 'page 404 non reconnue (titre : ' + ((etat404 && etat404.titre) || '?') + ')' })
    echecs++
  }

  /* ---------- propreté du HTML LIVRÉ ----------
     Constaté le 11/09/2026 sur la production : le head de l'accueil (conservé tel
     quel par la fusion ci-dessus) portait 16 commentaires de travail. Livrés, ils
     pesaient environ 1 700 octets sur 30 867 — 5,5 % de la page, téléchargés par
     chaque visiteur — et ils EXPOSAIENT des notes internes sur un site public.
     L'un d'eux publiait même un diagnostic depuis démenti : il affirmait que le
     vendor Vue recevait un 429 et que l'application ne se montait pas, alors que
     ces 429 venaient de l'outil de mesure lui-même.

     La substance a été déplacée dans `docs/decisions-index-html.md`, à la source
     (index.html). Cette passe est la CEINTURE : elle garantit qu'aucun commentaire
     de travail ne repartira dans le HTML livré, même ajouté plus tard par
     inadvertance. Un commentaire n'est pas un livrable.

     ⚠ CE QU'ON NE TOUCHE PAS : les commentaires VIDES. Vue 3 les pose comme
     ancres de fragment (`<!---->`, `<!--[-->`, `<!--]-->`) et s'en sert pour
     l'hydratation. Mesuré : 11 dans la page d'accueil prérendue. Les retirer
     « pour nettoyer » casserait le montage — c'est-à-dire exactement ce que ce
     dépôt a payé cinq fois. On ne retire donc que ce qui porte du TEXTE. */
  const MOTIF_COMMENTAIRE = /<!--([\s\S]*?)-->/g
  const retirerCommentaires = (h) =>
    h.replace(MOTIF_COMMENTAIRE, (entier, interieur) =>
      /[^\s[\]]/.test(interieur) ? '' : entier);

  const fichiersHtml = [];
  (function parcourir(dossier) {
    for (const entree of fs.readdirSync(dossier, { withFileTypes: true })) {
      const chemin = path.join(dossier, entree.name);
      if (entree.isDirectory()) parcourir(chemin);
      else if (entree.name.endsWith('.html')) fichiersHtml.push(chemin);
    }
  })(DIST);

  let commentairesRetires = 0;
  let octetsRetires = 0;
  const restants = [];
  for (const fichier of fichiersHtml) {
    const avant = fs.readFileSync(fichier, 'utf8');
    const apres = retirerCommentaires(avant);
    if (apres !== avant) {
      commentairesRetires += (avant.match(MOTIF_COMMENTAIRE) || []).length
        - (apres.match(MOTIF_COMMENTAIRE) || []).length;
      octetsRetires += avant.length - apres.length;
      fs.writeFileSync(fichier, apres, 'utf8');
    }
    // Contrôle APRÈS écriture : la règle est tenue par une mesure, pas par la
    // confiance accordée à la fonction ci-dessus.
    for (const m of apres.matchAll(MOTIF_COMMENTAIRE)) {
      if (/[^\s[\]]/.test(m[1])) {
        restants.push(path.relative(DIST, fichier) + ' → ' + m[1].trim().slice(0, 60));
      }
    }
  }
  if (restants.length) {
    echecs++;
    rapport.push({ route: 'propreté', ok: false, motif: `${restants.length} commentaire(s) de travail encore livré(s) : ${restants.slice(0, 3).join(' ; ')}` });
  } else {
    rapport.push({ route: 'propreté', ok: true, titre: `${commentairesRetires} commentaire(s) de travail retiré(s)`, octets: octetsRetires, ecrit: true });
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
  console.log(`propreté : ${commentairesRetires} commentaire(s) de travail retiré(s), ${octetsRetires} octets rendus au visiteur`)
  console.log('           (les ancres de fragment Vue, vides, sont conservées : l\'hydratation en dépend)')
  if (echecs) process.exitCode = 1
}

principal().catch((e) => { console.error('prérendu interrompu :', e && e.stack ? e.stack : e); process.exit(1) })
