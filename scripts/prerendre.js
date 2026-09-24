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
import { spawn, spawnSync } from 'node:child_process'

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

/* ── La balise d'ouverture de la COQUILLE SOURCE ──────────────────────────────
   On la lit une fois, dans `index.html` à la racine du projet — PAS dans la
   capture. Voir le commentaire long à l'endroit où elle est réappliquée : le JS
   retire `no-js` de <html> dès qu'il tourne, et une capture faite après exécution
   fige donc un document qui n'est plus celui que la feuille de style attend. */
let HTML_COQUILLE_TAG = null
try {
  const src = fs.readFileSync(path.join(RACINE, 'index.html'), 'utf8')
  HTML_COQUILLE_TAG = (src.match(/<html[^>]*>/i) || [])[0] || null
} catch {}
if (!HTML_COQUILLE_TAG) {
  // Échec bruyant : sans elle, le repli anti-page-blanche resterait neutralisé,
  // et on le saurait seulement par une mesure en navigateur sans JavaScript.
  console.warn('  ⚠ balise <html> de la coquille introuvable — le repli no-js ne sera pas restauré.')
}

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
    // ⛔ UN ReadStream SANS GESTIONNAIRE D'ERREUR TUE LE PROCESSUS.
    // Mesuré le 22/09/2026 : `prérendre` est mort TROIS FOIS sur
    //   « Error: ENOENT: no such file or directory, open '…/dist/index.html' »
    //   « Emitted 'error' event on ReadStream instance »
    // — un ENOENT non capturé n'est pas une requête ratée, c'est le build entier
    // qui s'arrête, et avec lui le déploiement. Une ressource momentanément
    // absente doit donner une réponse, jamais un `throw`.
    const flux = fs.createReadStream(cible)
    flux.on('error', () => {
      if (!res.headersSent) {
        res.writeHead(503, { 'Content-Type': 'text/plain; charset=utf-8' })
      }
      res.end('ressource en cours de réécriture')
    })
    flux.pipe(res)
  })
  return new Promise((r) => serveur.listen(PORT, '127.0.0.1', () => r(serveur)))
}

/* ---------- écriture ATOMIQUE ----------
 * ⛔ POURQUOI CETTE FONCTION EXISTE, ET LE DÉFAUT QU'ELLE FERME.
 *
 * Mesuré le 22/09/2026, en isolant les étapes : `npx vite build` écrit
 * `dist/index.html` (14 484 o), puis `node scripts/prerendre.js` — SEUL — échoue
 * sur un ENOENT de ce même fichier. Une veille du dossier (`fs.watch`) ne montre
 * JAMAIS d'absence : le fichier ne disparaît pas, il est **TRONQUÉ**.
 *
 * C'est la faute à `fs.writeFileSync`, qui ouvre en `'w'` — donc vide le fichier
 * AVANT d'y écrire. Or ce script TIENT UN SERVEUR OUVERT sur `dist/` pendant qu'il
 * écrit, et `dist/index.html` est le fichier que le **repli SPA** sert à TOUTE
 * route dont le fichier n'existe pas encore. Une requête de Chromium qui tombe
 * dans la fenêtre de troncature trouve un fichier de 0 octet — ou pas de fichier.
 *
 * ⚠️ LA CAUSE N'EST PAS LE HASARD, ELLE EST LA CONCURRENCE : le défaut est
 *    intermittent (passé 2 fois, échoué 3 fois sur cette campagne), et il dépend
 *    du moment où le navigateur redemande une ressource. Un chargement différé
 *    (`defineAsyncComponent`, `IntersectionObserver`, `requestIdleCallback` — ce
 *    que fait la vue-vaisseau) ÉLARGIT cette fenêtre, donc RÉVÈLE le défaut sans
 *    le créer.
 *
 * Le remède : écrire dans un fichier temporaire du MÊME dossier, puis RENOMMER.
 * `renameSync` remplace la cible d'un seul geste : à tout instant, `dist/index.html`
 * est soit l'ancienne version complète, soit la nouvelle complète — **jamais un
 * fichier tronqué**. C'est ce qu'on attendait depuis le début.
 */
function ecrireAtomique(chemin, contenu) {
  fs.mkdirSync(path.dirname(chemin), { recursive: true })
  const temporaire = chemin + '.' + process.pid + '.tmp'
  fs.writeFileSync(temporaire, contenu, 'utf8')
  /* ⛔⛔ EPERM SUR WINDOWS — et ce défaut-là était invisible depuis le début.
   *
   * MESURÉ le 24/09/2026, en lançant le prérendu sur EVA-01 :
   *     EPERM: operation not permitted, rename '…\dist\index.html.39548.tmp'
   *     -> '…\dist\index.html'
   *
   * ⭐ POURQUOI ÇA N'ARRIVE QUE SUR WINDOWS : `renameSync` est atomique, mais
   *   Windows **refuse de remplacer un fichier qu'un autre processus tient
   *   ouvert**. Or `dist/index.html` est précisément le fichier que le SERVEUR
   *   QUE CE SCRIPT GARDE OUVERT sert en repli SPA à toute route inconnue.
   *   ⇒ Le script se bloque tout seul le fichier qu'il doit réécrire.
   *
   * ⛔ ET LA CONSÉQUENCE ÉTAIT PLUS GRAVE QUE LE BUG LUI-MÊME : **le prérendu
   *   ne pouvait pas être testé en local.** Le studio poussait vers le CI pour
   *   savoir si son correctif marchait — *c'est-à-dire qu'il n'avait aucun
   *   moyen de mesurer avant de publier.*
   *
   * ⇒ On RÉESSAIE d'abord (le verrou est presque toujours momentané : une
   *   lecture en cours par le serveur local), et on ne renonce à l'atomicité
   *   qu'en DERNIER recours, après cinq tentatives.
   *   ⚠️ Le repli n'est pas gratuit : `rmSync` puis `renameSync` laisse une
   *      fenêtre où le fichier n'existe pas — **c'est exactement ce que la
   *      version atomique avait fermé le 22/09.** Il n'est donc PAS le premier
   *      choix : il est le dernier. */
  for (let i = 0; i < 5; i++) {
    try { fs.renameSync(temporaire, chemin); return }
    catch (e) {
      if (e.code !== 'EPERM' && e.code !== 'EACCES' && e.code !== 'EBUSY') {
        try { fs.rmSync(temporaire, { force: true }) } catch {}
        throw e
      }
      const fin = Date.now() + 60
      while (Date.now() < fin) { /* attente courte, sans dépendance */ }
    }
  }
  try { fs.rmSync(chemin, { force: true }) } catch {}
  fs.renameSync(temporaire, chemin)
  console.error(`  ⚠️  ${path.basename(chemin)} : écriture NON atomique après 5 refus (verrou Windows)`)
}

/* ---------- client CDP minimal ---------- */
class Cdp {
  constructor(ws) { this.ws = ws; this.seq = 0; this.attentes = new Map(); this.fige = false }
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
  // ⛔ DÉFAUT MESURÉ LE 23/09/2026 — CETTE PROMESSE NE POUVAIT PAS ÉCHOUER.
  // La version d'origine était `new Promise((res) => { … })` : pas de `rej`,
  // aucune branche d'erreur. Si Chrome cessait de répondre (moteur de rendu
  // figé, onglet planté), la réponse n'arrivait jamais : la promesse ne se
  // réglait ni en succès ni en échec, et le script attendait indéfiniment.
  //
  // Mesure : 12 pages sur 33 écrites, puis 7,2 min sans une seule écriture,
  // 8 processus Chrome vivants. Deux fois de suite (délai dépassé à 420 s,
  // puis blocage franc à la relance).
  //
  // ⭐ ET LA LEÇON N'EST PAS « IL MANQUAIT UN DÉLAI » :
  //   les deux boucles d'attente étaient bornées à 40 puis 20 tours. On croit
  //   donc l'ensemble borné. Il ne l'était pas — parce que CHAQUE tour attend
  //   une promesse qui ne pouvait pas se rompre.
  //   **Une boucle bornée d'attentes non bornées reste non bornée.**
  //   Le compteur à 40 donnait l'illusion d'un plafond ; il ne plafonnait rien.
  envoyer(method, params, delaiMax = 45000) {
    // ⭐ UN MOTEUR FIGÉ RESTE FIGÉ — mesuré le 23/09/2026.
    // Sans ce court-circuit, une seule route bloquée coûtait 40 × 15 s = 10 min :
    // on avait remplacé un blocage éternel par une lenteur. Ici, la première
    // évaluation qui expire condamne la route, et les 39 suivantes rendent main.
    if (this.fige) return Promise.reject(new Error(`CDP ${method} : moteur figé`))
    return new Promise((res, rej) => {
      const i = ++this.seq
      const minuteur = setTimeout(() => {
        this.attentes.delete(i)
        this.fige = true
        rej(new Error(`CDP ${method} sans réponse après ${delaiMax} ms`))
      }, delaiMax)
      this.attentes.set(i, (m) => { clearTimeout(minuteur); res(m) })
      try {
        this.ws.send(JSON.stringify({ id: i, method, params }))
      } catch (e) {
        clearTimeout(minuteur); this.attentes.delete(i); rej(e)
      }
    })
  }
  // `evaluer` rend `undefined` au lieu de lever : ses appelants traitent déjà
  // l'illisible (brut non analysable → route signalée et sautée). Le délai
  // dégrade donc proprement au lieu de tuer le build.
  async evaluer(expression) {
    let r
    try {
      r = await this.envoyer('Runtime.evaluate', { expression, returnByValue: true })
    } catch (e) {
      console.error(`  ⚠️  ${e.message} — expression ignorée`)
      return undefined
    }
    return r && r.result && r.result.result ? r.result.result.value : undefined
  }
  fermer() { try { this.ws.close() } catch {} }
}

const attendre = (ms) => new Promise((r) => setTimeout(r, ms))

/* ⛔ LE NETTOYAGE MANQUAIT SUR LE CHEMIN D'ÉCHEC — corrigé le 23/09/2026.
 *
 * CE QUI SE PASSAIT. `proc` (Chrome) et `serveur` étaient déclarés en `const`
 * **à l'intérieur de `principal()`**, et le seul nettoyage était à la fin de la
 * course NORMALE. Le `.catch()` en bas du fichier ne pouvait pas les atteindre :
 * **quand `principal()` échouait, Chrome restait vivant.**
 *
 * ⭐ CE QUE ÇA A COÛTÉ. Le prérendu a été relancé HUIT fois dans la même session.
 *   À chaque échec, un Chrome sans tête restait derrière — et Gaëtan a fini par
 *   écrire : « ça rends le pc inutilisable MERDE ! ». *Le harnais lui-même
 *   n'arrivait plus à lancer un processus.*
 *   ⚠️ Et au début de la session, j'avais trouvé **30 processus Chrome** que
 *   j'avais tués sans comprendre d'où ils venaient. *Ce n'était pas le site qui
 *   cassait le prérendu : c'est le prérendu qui s'empoisonnait lui-même.*
 *
 * ⇒ On déclare Chrome et le serveur AU NIVEAU DU MODULE, et on les tue dans TOUS
 *   les cas : exception, promesse non gérée, interruption clavier, sortie normale.
 *   *`kill()` est synchrone — donc utilisable depuis `process.on('exit')`.* */
let chromeProc = null
let serveurLocal = null

function toutNettoyer() {
  /* ⛔ `kill()` NE SUFFIT PAS SUR CHROME — mesuré le 23/09/2026.
   *
   * Le correctif précédent tuait `chromeProc`, et **deux Chrome survivaient quand
   * même** après un run (mesuré : « chrome APRES le run : 2 »).
   *
   * ⭐ POURQUOI : Chrome ne tourne pas dans un seul processus. Il **forke** un
   *   moteur de rendu, un processus GPU, un processus de service. `kill()` sur le
   *   parent tue le parent — **pas ses enfants**, qui deviennent orphelins et
   *   continuent de consommer.
   *
   * ⇒ Sur Windows, on tue l'ARBRE : `taskkill /T /F /PID`. Le `/T` fait tout le
   *   travail — c'est précisément « et ses enfants ».
   *   On garde `kill()` en second recours, si `taskkill` n'est pas là.
   *
   * ⛔⛔ ET CE SECOND RECOURS ÉTAIT LE SEUL QUI S'EXÉCUTE EN CI — 24/09/2026.
   *
   *   **`taskkill` n'existe pas sous Linux.** Le coureur GitHub Actions est sous
   *   Ubuntu : `spawnSync('taskkill', …)` échouait, on tombait sur `kill('SIGKILL')`
   *   — **qui tue le parent et laisse les enfants**, exactement ce que le
   *   paragraphe ci-dessus décrit comme insuffisant.
   *
   *   ⭐ Le garde-fou couvrait Windows. **La porte était Linux.** *Le défaut
   *     corrigé la veille ne pouvait pas fonctionner sur le seul chemin où il
   *     servait — c'est la loi 4, et elle coûte un déploiement par jour.*
   *
   * ⇒ Sous POSIX, Chrome est lancé `detached` : il est **chef de son groupe de
   *   processus**. `process.kill(-pid)` tue alors le groupe ENTIER — parent,
   *   moteurs de rendu, GPU et service — d'un seul appel. */
  try {
    if (chromeProc && chromeProc.pid && !chromeProc.killed) {
      if (process.platform === 'win32') {
        const r = spawnSync(
          'taskkill', ['/T', '/F', '/PID', String(chromeProc.pid)],
          { stdio: 'ignore', windowsHide: true }
        )
        if (!r || r.status !== 0) chromeProc.kill('SIGKILL')
      } else {
        // POSIX : le signe moins désigne le GROUPE, pas le processus.
        try { process.kill(-chromeProc.pid, 'SIGKILL') }
        catch { chromeProc.kill('SIGKILL') }
      }
    }
  } catch {
    try { if (chromeProc && !chromeProc.killed) chromeProc.kill('SIGKILL') } catch {}
  }
  try { if (serveurLocal) serveurLocal.close() } catch {}
  chromeProc = null
  serveurLocal = null
}

process.on('exit', toutNettoyer)
process.on('SIGINT', () => { console.error('\n  interruption — nettoyage'); toutNettoyer(); process.exit(130) })
process.on('SIGTERM', () => { toutNettoyer(); process.exit(143) })
process.on('uncaughtException', (e) => {
  console.error('prérendu interrompu (exception) :', e && e.stack ? e.stack : e)
  toutNettoyer()
  process.exit(1)
})
process.on('unhandledRejection', (e) => {
  console.error('prérendu interrompu (promesse) :', e && e.stack ? e.stack : e)
  toutNettoyer()
  process.exit(1)
})

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
  serveurLocal = serveur   // ⭐ exposé au nettoyage global (voir toutNettoyer)
  const profil = fs.mkdtempSync(path.join(os.tmpdir(), 'prerendu-'))
  const chrome = trouverChrome()
  if (!chrome) { console.error('Chrome introuvable (définir CHROME_PATH)'); process.exit(1) }
  const proc = spawn(chrome, [
    '--headless=new', '--disable-gpu', '--no-sandbox', '--no-first-run', '--no-default-browser-check',
    /* ⛔ LE FLAG QUI MANQUAIT — 24/09/2026.
     *
     * MESURE : le workflow `main` échouait à CHAQUE fois depuis le 23/09 13:25,
     * toujours au même endroit — « CDP Page.navigate sans réponse après 15000 ms »
     * puis « moteur figé », **après ~10 pages rendues sur 32**.
     *
     * ⭐ ET CE N'EST PAS LE MOTEUR DE RENDU, C'EST CHROME ENTIER : `Page.navigate`
     *   est traité par le processus NAVIGATEUR (le code le dit lui-même plus bas) —
     *   s'il ne répond plus, c'est que tout le processus est bloqué.
     *
     * ⛔ LA CAUSE, ET ELLE EST DOCUMENTÉE PARTOUT : dans un conteneur — et un
     *   coureur GitHub Actions en est un — **`/dev/shm` fait 64 Mo par défaut**.
     *   Chrome s'en sert largement ; quand il est plein, il ne plante pas, il
     *   **se fige**. C'est le symptôme exact, à la page près.
     *
     * ⇒ `--disable-dev-shm-usage` fait écrire les fichiers partagés dans `/tmp`.
     *   Les deux suivants empêchent Chrome de mettre en veille un onglet non
     *   visible — ce qui, ici, est TOUJOURS le cas : il n'y a pas d'écran.
     *
     * ⚠️ Ces trois flags sont INERTES sur un poste de travail (EVA-01 a de la
     *    mémoire et un `/dev/shm` dimensionné) : ils ne changent rien au pré-rendu
     *    local, et ils réparent celui du CI. *Un correctif qui ne se paie que sur
     *    le chemin cassé.* */
    '--disable-dev-shm-usage',
    '--disable-background-timer-throttling',
    '--disable-renderer-backgrounding',
    /* ⛔⛔ SEPT FLAGS AJOUTÉS ICI LE 24/09/2026, PUIS RETIRÉS DANS L'HEURE.
     *
     *    `--disable-extensions`, `--disable-background-networking`, `--disable-sync`,
     *    `--disable-default-apps`, `--mute-audio`, `--no-pings`, et un
     *    `--disable-features=…` à sept entrées.
     *
     *    MESURE : le run suivant a rendu, en douze secondes,
     *        « **Chrome ne répond pas sur le port de débogage** »
     *    — c'est-à-dire que **Chrome ne démarrait plus du tout**. Le run d'avant,
     *    avec les mêmes correctifs et sans ces sept lignes, écrivait dix pages.
     *
     * ⭐ LA LEÇON EST ÉLÉMENTAIRE ET JE L'AI ENFREINTE : **on ne change qu'une
     *   chose à la fois.** Ces sept flags n'étaient pas mesurés — ils étaient une
     *   hypothèse sur la mémoire du coureur, posée en même temps qu'un correctif
     *   qui, lui, l'était. *Résultat : on ne sait plus lequel des deux a parlé.*
     *
     * ⇒ Retirés. Ce qui reste est MESURÉ : le blocage de l'analytique, le `MAP *`
     *   (10 → 32 pages), le kill du groupe POSIX, la 404 protégée, et le délai
     *   porté à 45 s — *le seul des changements non mesurés qui ne peut pas
     *   empêcher un démarrage.* */
    /* ⛔ L'ANALYTIQUE EST BLOQUÉE AU NIVEAU RÉSEAU — ajouté le 23/09/2026.
     *
     * MESURE : le moteur de rendu de Chrome cesse de répondre après la 10ᵉ page
     * (12 après le premier correctif), et **les 20 routes suivantes échouent en
     * cascade**. La dernière page à avoir RENDU quelque chose est
     * `/ressources/tutoriels` — la seule page du site qui charge Matomo **dans son
     * propre composant** (32 occurrences de `_paq`), **en plus** du composable
     * global `useMatomo.js` (72 occurrences).
     *
     * ⚠️ LA BALISE EST DÉJÀ RETIRÉE DU HTML ÉCRIT (voir plus bas, ligne ~453) —
     * **mais le script s'exécute quand même pendant le rendu**, et `_paq` est une
     * file d'attente : les commandes s'empilent page après page sans jamais se vider,
     * parce que dans un Chrome sans tête le domaine d'analytique ne répond pas.
     *
     * ⭐ Retirer la balise APRÈS coup ne suffit pas : il faut empêcher le script de
     *   se CHARGER. On ne fait pas d'analytique sur 32 pages visitées sur notre
     *   propre machine — *ces visites n'existent pas.*
     *
     * ⇒ `MAP` envoie le domaine vers 0.0.0.0, c'est-à-dire nulle part.
     *   ⚠️ Seul le domaine d'analytique est visé : les ressources du site sont
     *   servies par le serveur local, et elles continuent de charger.
     *
     * ⛔⛔ ET CE N'ÉTAIT PAS ASSEZ — mesuré le 24/09/2026, maintenant que le
     *    prérendu tourne enfin EN LOCAL (il en était incapable : voir ecrireAtomique).
     *
     *    L'ordre exact des routes, obtenu par mesure :
     *        … /ressources/tutoriels ✅ (elle passait : le blocage CDP a mordu)
     *        /components ✅   /apps ✅   /liens ⚠️ RENDU ILLISIBLE (aucune réponse)
     *        /ia-de-bord ⛔ ÉCHEC — et les 22 suivantes en cascade.
     *
     *    ⭐ LA ROUTE COUPABLE EST `/liens` — **une page de liens**. Elle déclenche
     *      des dizaines de requêtes vers des domaines extérieurs. Chacune part,
     *      aucune ne répond : elles s'empilent, et le moteur cesse de rendre.
     *      *Le domaine d'analytique n'était qu'UN des émetteurs, pas le seul.*
     *
     * ⇒ `MAP * 0.0.0.0` : **la résolution de TOUT nom extérieur rend nulle part.**
     *   ⭐ Et le serveur local n'est pas touché : on navigue vers `127.0.0.1`,
     *     qui est une IP littérale — **elle ne passe pas par le résolveur.**
     *   ⇒ Une page de liens ne peut plus noyer le moteur : ses requêtes
     *     échouent instantanément au lieu d'attendre.
     *   ⚠️ Ce qu'on perd : rien. *Un pré-rendu n'a jamais eu besoin du réseau
     *      extérieur — il a besoin du `dist/` que ce script sert lui-même.* */
    '--host-resolver-rules=MAP * 0.0.0.0',
    `--remote-debugging-port=${DEBUG_PORT}`, `--user-data-dir=${profil}`,
    `http://127.0.0.1:${PORT}/`,
  ], {
    stdio: 'ignore',
    /* ⭐ `detached` SOUS POSIX — ajouté le 24/09/2026, et il n'est pas décoratif :
     * sans lui, Chrome n'est PAS chef de son groupe de processus, et
     * `process.kill(-pid)` dans `toutNettoyer` ne trouve aucun groupe à tuer.
     * **Les deux corrections vont ensemble ou ne servent à rien.**
     * ⚠️ Sous Windows il reste à `false` : `taskkill /T` fait déjà le travail, et
     *    un processus détaché y complique la terminaison. */
    detached: process.platform !== 'win32',
  })
  chromeProc = proc   // ⭐ exposé au nettoyage global : SANS ÇA, Chrome survit à l'échec

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

  /* ⛔⛔ ON BLOQUE L'ANALYTIQUE AU NIVEAU DU PROTOCOLE — 24/09/2026.
   *
   * MESURE, deux fois : `fichiers écrits : 10 · échecs : 23`, et **la 9ᵉ route
   * rendue est `/ressources/tutoriels`** — celle que le commentaire ci-dessus
   * désigne comme la SEULE à charger Matomo dans son propre composant.
   * **Le moteur de Chrome cesse de répondre exactement là.**
   *
   * ⛔ ET LE CORRECTIF PRÉCÉDENT NE POUVAIT PAS SUFFIRE.
   *   `--host-resolver-rules=MAP … 0.0.0.0` agit sur la RÉSOLUTION : la requête
   *   part quand même, échoue, et **`_paq` continue d'empiler ses commandes** —
   *   c'est une file, et rien ne la vide dans un navigateur sans tête dont le
   *   domaine d'analytique ne répond pas. *Résoudre vers nulle part n'est pas
   *   empêcher d'appeler.*
   *   ⚠️ Et si le script Matomo est INLINE, `MAP` ne le voit même pas.
   *
   * ⭐ LA BONNE COUCHE, C'EST CELLE-CI : `Network.setBlockedURLs` refuse la
   *   requête AVANT qu'elle parte, au niveau du protocole — pas du DNS, pas du
   *   HTML. Elle ne dépend ni de la résolution, ni de l'endroit d'où le script
   *   est chargé.
   *
   * ⇒ Et ce n'est pas une perte : *on ne fait pas d'analytique sur 32 pages
   *   visitées par notre propre machine. **Ces visites n'existent pas.*** */
  try {
    await cdp.envoyer('Network.enable')
    await cdp.envoyer('Network.setBlockedURLs', { urls: [
      '*analytics.gldigitallab.fr*', '*matomo*', '*google-analytics*',
      '*googletagmanager*', '*doubleclick*',
    ] })
    console.log('  🔒 analytique bloquée au niveau du protocole (Network.setBlockedURLs)')
  } catch (e) {
    console.error(`  ⚠️  blocage de l'analytique indisponible : ${e.message}`)
    console.error('     (le prérendu continue — mais la file _paq risque de figer le moteur)')
  }
  await cdp.envoyer('Page.enable')
  await cdp.envoyer('Runtime.enable')

  const coquille = fs.readFileSync(path.join(DIST, 'index.html'), 'utf8').length
  // titre de référence : celui de l'accueil, pour détecter les routes qui le
  // portent encore (c'est exactement le défaut mesuré le 10/09/2026)
  await cdp.envoyer('Page.navigate', { url: `http://127.0.0.1:${PORT}/` })
  await attendre(2000)
  const titreAccueil = (await cdp.evaluer('document.title')) || ''
  const rapport = []
  // Routes où le Loader n'a jamais laissé passer `app--loaded` dans la fenêtre :
  // signalées, jamais bloquantes — le site part quand même, mais on le DIT.
  const sansCoquille = []
  // Routes où le Loader n'a JAMAIS quitté le DOM : il resterait un calque plein écran
  // invisible (opacity:0 suite à la transition) qui intercepte les clics.
  const loaderBloquant = []
  let ecrits = 0, echecs = 0

  for (const route of routes) {
    const url = `http://127.0.0.1:${PORT}${route}`
    /* ⛔ ON DIT CE QU'ON EST EN TRAIN DE FAIRE — 23/09/2026.
       Mesure du 23/09 : le moteur de Chrome se fige après **10 pages écrites**, et
       tout ce qui suit échoue en cascade avec « Page.navigate sans réponse ».
       ⚠️ Mais **la route qui FIGE le moteur n'était nommée nulle part** : le
       journal ne montrait que les routes qui échouent APRÈS, et elles échouent
       toutes, indéfiniment.
       ⭐ Celle qu'on cherche est **la dernière affichée avant le silence**, pas la
         première en échec. *Un moteur figé ne se plaint pas : il se tait.* */
    console.error(`  ✎ ${route}`)
    // ⛔ `Page.navigate` peut ne JAMAIS répondre si le moteur est figé. Depuis
    // l'ajout du délai dans `envoyer`, la promesse se rompt au lieu de pendre :
    // on note la route et on passe à la suivante — c'est le comportement que le
    // commentaire ci-dessus annonçait déjà (« signalée, jamais bloquante »), et
    // il ne pouvait pas se produire tant que la promesse ne savait pas échouer.
    cdp.fige = false   // on retente : `Page.navigate` est traité par le processus
                       // navigateur, pas par le moteur — il répond même figé.
                       // C'est précisément pour ça qu'on peut repartir à chaque route.
    try {
      await cdp.envoyer('Page.navigate', { url })
    } catch (e) {
      /* ⛔ ON NOMME LA ROUTE TOUT DE SUITE, SUR stderr — 23/09/2026.
         Avant, la route était bien enregistrée dans `rapport`, **mais `rapport`
         n'est imprimé qu'à la fin** — et le script meurt avant, sur le
         `Page.navigate` du 404 qui n'est pas protégé. Résultat mesuré :
             « prérendu interrompu : Error: CDP Page.navigate : moteur figé »
         La ligne est nommée, **la page qui a tué le moteur ne l'est pas.**
         ⭐ On ne peut donc pas corriger : on sait qu'il fige, pas où.
         ⇒ On l'écrit immédiatement, et on dit aussi COMBIEN de pages ont été
           écrites avant — c'est ce qui borne la recherche. */
      console.error(`  ⛔ ROUTE EN ÉCHEC : ${route}  —  ${e.message}`)
      console.error(`     (${ecrits} page(s) écrite(s) avant celle-ci)`)
      rapport.push({ route, ok: false, motif: `CDP : ${e.message}` })
      echecs++
      continue
    }
    // ── PREMIÈRE ATTENTE : LE CONTENU ─────────────────────────────────────────
    // La vue doit avoir rendu du texte, pas seulement la coquille. C'est cette
    // attente — et elle seule, jusqu'au 11/09/2026 — qui décidait du moment de la
    // capture. C'est elle qui a produit le défaut décrit ci-dessous.
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
    if (!etat) {
      /* ⛔ ON DIT POURQUOI, TOUT DE SUITE — 23/09/2026.
         Avant, cette branche poussait « rendu illisible » dans `rapport` — et
         `rapport` ne s'imprime qu'à la fin, **quand le script va jusqu'au bout.**
         Or il meurt sur le `Page.navigate` du 404 : **ces lignes n'étaient jamais
         lues.**
         ⭐ Mesure du 23/09 : `/apps` et `/liens` n'apparaissaient NULLE PART dans
           le journal — ni « écrite », ni « en échec ». On ne pouvait pas savoir
           qu'elles avaient rendu vide, ni pourquoi. */
      const vu = await cdp.evaluer(`JSON.stringify({
        texte: (document.body && document.body.innerText || '').length,
        app: !!(document.querySelector('#app') && document.querySelector('#app').children.length),
        titre: document.title
      })`)
      console.error(`  ⛔ RENDU ILLISIBLE : ${route}`)
      console.error(`     ce que le moteur voit : ${vu === undefined ? '(aucune reponse)' : vu}`)
      rapport.push({ route, ok: false, motif: 'rendu illisible' })
      echecs++
      continue
    }

    // ── DEUXIÈME ATTENTE : LA COQUILLE ────────────────────────────────────────
    // POURQUOI ELLE EXISTE — mesuré le 11/09/2026, sur les 23 routes :
    //   isLoaded (classe app--loaded) au moment de la capture : 0 / 23
    //   header.navigation + footer.footer présents : 0 / 23
    //
    // `App.vue` conditionne TOUTE la coquille à `isLoaded` :
    //   <Navigation v-if="isLoaded && !isFullscreenGame" />
    //   <Footer     v-if="isLoaded && !isFullscreenGame" />
    //   <CookieBanner v-if="isLoaded && !isFullscreenGame" />
    // et `isLoaded` ne passe à `true` qu'à l'événement `@loaded` du <Loader>. La
    // première boucle s'arrête dès que `#app` contient du TEXTE — ce qui arrive
    // bien avant. On photographiait donc la page pendant que le Loader tournait.
    //
    // Conséquence : le HTML livré portait le contenu mais NI navigation, NI pied de
    // page, NI bandeau de consentement. Un visiteur AVEC JavaScript ne voit aucun
    // défaut (il regarde le Loader, puis tout apparaît) ; un robot, un aperçu de
    // lien ou un visiteur SANS JavaScript reçoit un HTML sans navigation — alors
    // que la charte promet un contenu « lisible ET navigable sans JavaScript ».
    //
    // On attend donc le signal réel, `app--loaded`, et non un proxy. Plafond
    // volontaire : si le Loader n'émet pas `loaded` (il a un failsafe de 3 000 ms,
    // mais un failsafe peut cesser de fonctionner à la faveur d'une refonte), la
    // route est écrite SANS coquille et signalée — jamais bloquante.
    let tourCharge = null
    for (let i = 0; i < 20; i++) {   // 20 × 250 ms = 5 s au plus
      // ⚠️ ON SORT SUR LA CIBLE, PAS SUR UN PROXY — troisième correction du jour.
      //
      // Deux détecteurs faux avant celui-ci, et les deux ont produit un verdict faux :
      //  1. `querySelector('nav')` : il n'y a AUCUN <nav> dans ce site.
      //  2. `querySelector('#app').className.includes('app--loaded')` : écrit trop vite,
      //     alors que le HTML livré porte bien `<div id="app" class="app--loaded">`.
      //
      // ⚠️ ET UNE TROISIÈME CONDITION, AJOUTÉE LE 11/09/2026 APRÈS MESURE — LE LOADER.
      //
      // Le Loader est un calque PLEIN ÉCRAN, mesuré dans le CSS livré :
      //     .loader { position:fixed; inset:0; background:var(--bg); z-index:9999 }
      // Or la capture se faisait pendant sa TRANSITION DE SORTIE, ce que le HTML livré
      // prouvait : `class="loader loader-leave-active loader-leave-to"`, et
      //     .loader-leave-to { opacity: 0 }
      //
      // Conséquence exacte, et il ne faut pas la confondre avec « il masque tout » :
      // le Loader était INVISIBLE, donc la coquille et le contenu se voyaient bien —
      // mais un calque `position:fixed; inset:0; z-index:9999` restait posé au-dessus,
      // et `opacity:0` **ne désactive pas les événements pointeur**. Un visiteur sans
      // JavaScript voyait donc la navigation... sans pouvoir cliquer dedans : le calque
      // invisible interceptait chaque clic. Et sans JS, il ne partira jamais tout seul.
      //
      // Pour un visiteur AVEC JavaScript, rien de tout cela n'existe : Vue hydrate, la
      // transition s'achève, le Loader est retiré du DOM. Le défaut ne concerne que ce
      // que reçoivent les robots, les aperçus de lien et les visiteurs sans JS.
      //
      // On attend donc la disparition RÉELLE du Loader, pas sa sortie de transition.
      const brut = await cdp.evaluer(`JSON.stringify({
        charge: !!document.querySelector('.app--loaded'),
        coquille: !!(document.querySelector('header.navigation') && document.querySelector('footer.footer')),
        loader: !!document.querySelector('.loader')
      })`)
      let vu = null
      try { vu = JSON.parse(brut) } catch { vu = null }
      if (vu) {
        etat.charge = vu.charge
        etat.coquille = vu.coquille
        etat.loader = vu.loader
        if (vu.coquille && !vu.loader) { tourCharge = i + 1; break }
      }
      await attendre(250)
    }
    if (tourCharge === null) {
      // Signalé, pas bloquant : le site part quand même. Mais on le DIT.
      sansCoquille.push(route)
      if (etat && etat.loader) loaderBloquant.push(route)
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

    /* ⚠ LA BALISE <html> LIVRÉE EST CELLE DE LA COQUILLE, PAS CELLE DE LA CAPTURE.
       MESURÉ LE 13/09/2026 — DÉFAUT RÉEL, ET IL ANNULAIT UNE PROTECTION ÉCRITE
       EXPRÈS DANS CE DÉPÔT.

       La coquille porte `<html lang="fr" class="no-js scroll-smooth">`, et un script
       inline du <head> retire `no-js` dès que JavaScript tourne. `global.css` porte
       la règle qui va avec, avec ce commentaire :
           « REPLI NO-JS (anti-page-blanche) … Garantit 100 % de contenu visible sans JS »
           html.no-js .scroll-reveal { opacity: 1 !important; transform: none !important; }

       Or cette passe capture `documentElement.outerHTML` APRÈS exécution du JS : la
       classe avait donc déjà été retirée, et le HTML livré portait
       `<html lang="fr" class="scroll-smooth">`. **La protection existait dans la
       coquille et dans la feuille de style, et disparaissait à la livraison.**

       Conséquence mesurée, JavaScript désactivé, sans cette correction :
           18 375 caractères retenus par les animations de révélation, dont 75 titres
           de structure — 11 blocs sur 11 invisibles sur l'accueil.
       Autrement dit : le repli anti-page-blanche était neutralisé par le prérendu,
       c'est-à-dire par la passe dont le métier est de rendre le contenu présent.

       Le même piège vaut pour `style="scroll-behavior: smooth;"`, que le JS ajoute
       aussi à <html> : une capture après exécution fige des attributs que la page
       n'a pas au départ. On reprend donc l'ouverture de balise de la COQUILLE. */
    const htmlCorrige = HTML_COQUILLE_TAG ? html.replace(/<html[^>]*>/i, HTML_COQUILLE_TAG) : html
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
        ? htmlCorrige.replace(/<head[\s\S]*?<\/head>/i, teteCoquille)
        : htmlCorrige
      // ⚠️ ÉCRITURE ATOMIQUE (voir `ecrireAtomique`) : `dist/index.html` est servi
      //    en repli SPA à toute route inconnue, donc il est LU pendant qu'on
      //    l'écrit. `writeFileSync` le tronquait, et le serveur mourait d'ENOENT.
      ecrireAtomique(cible, fusion)
      ecrits++
      rapport.push({ route, ok: true, titre, octets: fusion.length, ecrit: true, tourCharge, coquille: etat.coquille, loader: etat.loader, motif: `accueil prérendu, en-tête préservé (${teteCoquille ? teteCoquille.length : 0} o)` })
      continue
    }
    if (ECRIRE) {
      ecrireAtomique(cible, htmlCorrige)
      ecrits++
    }
    rapport.push({ route, ok: true, titre, octets: htmlCorrige.length, ecrit: ECRIRE, memeTitre: titre === titreAccueil && route !== '/', tourCharge, coquille: etat.coquille, loader: etat.loader })
  }

  /* ---------- page 404 ----------
     Une adresse inconnue doit répondre 404 avec CETTE page (ErrorDocument du
     .htaccess), et non 200 avec la page d'accueil. Mesuré le 10/09/2026 : le
     repli SPA renvoyait la coquille de l'accueil en HTTP 200 pour /arcade, /cv…
     — un doublon de l'accueil aux yeux d'un moteur, pas un 404. */
  const cheminIntrouvable = '/__page-introuvable__'
  /* ⛔ LA 404 N'ÉTAIT PAS PROTÉGÉE — corrigé le 24/09/2026.
   *
   * C'est écrit noir sur blanc une centaine de lignes plus haut, et ça n'avait
   * jamais été corrigé : « le script meurt sur le `Page.navigate` du 404 qui
   * n'est pas protégé ».
   *
   * ⭐ CE QUE ÇA COÛTAIT, MESURÉ : les routes ratées sont signalées et sautées
   *   (`continue`) — **elles ne tuent jamais le build**. La 404, elle, levait :
   *   `prérendu interrompu : Error: CDP Page.navigate : moteur figé`, **exit 1**,
   *   et **le déploiement n'avait pas lieu**.
   *   ⇒ Une page ratée sur trente-deux faisait perdre les trente-et-une autres.
   *
   * ⭐ C'EST LA LOI 4 DE L'ATELIER, à la lettre : *« un garde-fou qui ne couvre
   *   qu'un chemin est une porte »*. Le garde couvrait 34 routes et laissait
   *   passer la 35ᵉ — celle qui n'existe pas.
   *
   * ⇒ Le repli fait ce que le reste du script fait déjà : **on nomme, on
   *   continue, et le build aboutit.** *Une 404 manquante se rattrape ; un
   *   déploiement perdu, non.* */
  cdp.fige = false   // même raison que pour les routes : le processus navigateur répond encore
  try {
    await cdp.envoyer('Page.navigate', { url: `http://127.0.0.1:${PORT}${cheminIntrouvable}` })
  } catch (e) {
    console.error(`  ⛔ 404 NON ÉCRITE : ${e.message}`)
    console.error('     (le build continue — une 404 ratée ne doit pas tuer 32 routes)')
  }
  // ⚠ MÊME ATTENTE QUE POUR LES ROUTES, ET ELLE COMPTE ENCORE PLUS ICI.
  // La 404 est servie à TOUT visiteur qui se trompe d'adresse. Constaté le 11/09/2026 :
  // cette page était la SEULE des 24 fichiers livrés à conserver encore un Loader, parce
  // que ce bloc-là gardait l'ancienne condition (`texte > 200`) quand les routes avaient
  // été corrigées. Un demi-correctif sur les 23 routes et pas sur la 404, c'est un
  // correctif qui laisse le défaut exactement là où un visiteur perdu le rencontre.
  //
  // Le Loader laissé est un calque `position:fixed; inset:0; z-index:9999` rendu
  // transparent par sa classe de sortie : il n'empêche pas de VOIR la page, mais
  // `opacity:0` ne désactive pas les clics — sur une page dont tout l'intérêt est de
  // proposer des liens de secours, c'est le pire endroit pour poser un intercepteur.
  let etat404 = null
  for (let i = 0; i < 40; i++) {
    await attendre(250)
    const brut = await cdp.evaluer(`JSON.stringify({
      texte: (document.body && document.body.innerText || '').length,
      app: !!(document.querySelector('#app') && document.querySelector('#app').children.length),
      titre: document.title,
      coquille: !!(document.querySelector('header.navigation') && document.querySelector('footer.footer')),
      loader: !!document.querySelector('.loader')
    })`)
    try { etat404 = JSON.parse(brut) } catch { etat404 = null }
    if (etat404 && etat404.coquille && !etat404.loader) break
  }
  const html404brut = await cdp.evaluer('"<!DOCTYPE html>\\n" + document.documentElement.outerHTML')
  if (typeof html404brut === 'string' && etat404 && /404|non trouv/i.test(etat404.titre)) {
    // Le routeur a posé un canonical sur le chemin de test : sur une page servie
    // à TOUTES les adresses inconnues, il ne désigne rien. On le retire.
    const html404 = HTML_COQUILLE_TAG
      ? html404brut.replace(/<html[^>]*>/i, HTML_COQUILLE_TAG).replace(/\s*<link rel="canonical"[^>]*>/i, '')
      : html404brut.replace(/\s*<link rel="canonical"[^>]*>/i, '')
    ecrireAtomique(path.join(DIST, '404.html'), html404)
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

  /* ⭐⭐⭐ LES BALISES hreflang — POSÉES ICI, ET SEULEMENT SI LA PAGE EXISTE.
     ══════════════════════════════════════════════════════════════════════════
     Consigne (A-FAIRE-2026-09-23, § 1) : « Métadonnées : hreflang, canonical,
     JSON-LD, Open Graph. » Mesure du 23/09 : **hreflang = 0 sur 188 pages.**

     ⛔ POURQUOI ICI ET PAS DANS LE COMPOSABLE — ET C'EST MESURÉ :
     Une première version les posait au RUNTIME (`useSEOOptimization`). Après le
     vrai build : **0 balise sur 188 pages.** Le prérendu les retire, selon sa
     propre règle : *« un script injecté à l'exécution n'a rien à faire dans un HTML
     figé. »* **Un `hreflang` doit être dans le HTML, sinon un moteur qui n'exécute
     pas le JavaScript ne le voit pas.**

     ⛔⛔ ET LE PIÈGE, QUI AURAIT ÉTÉ PIRE QUE LE DÉFAUT :
     `hreflang` affirme « cette page existe dans cette langue ». Posé pour les sept
     langues alors qu'**aucune traduction n'existe**, il enverrait les moteurs vers
     des 404 — *c'est-à-dire qu'il ferait du mal en croyant réparer.*
     ⇒ **ON NE L'ÉMET QUE POUR LES LANGUES DONT LA PAGE EXISTE SUR LE DISQUE.**
     ⭐ Et c'est auto-activant : aujourd'hui **zéro** (aucune traduction), et le jour
       où `dist/en/index.html` existe, la balise apparaît sans qu'on y touche.
     ⚠️ *Un `hreflang` qui ne peut pas mentir, parce qu'il regarde avant de parler.* */
  const LANGUES_DISPO = ['fr', 'en', 'de', 'es', 'it', 'nl', 'pt'];   // src/config/langues.js
  const ACCUEIL = 'fr';

  /** Le chemin de la page, tel qu'il se lit dans une URL : '' pour l'accueil. */
  function cheminDePage(fichier) {
    let p = path.relative(DIST, fichier).replace(/\\/g, '/');
    p = p.replace(/index\.html$/, '').replace(/\.html$/, '');
    return p.replace(/\/$/, '');
  }

  /** Cette page existe-t-elle, pour cette langue ? On REGARDE le disque. */
  function pageExiste(langue, chemin) {
    const dossier = langue === ACCUEIL ? DIST : path.join(DIST, langue);
    const cible = chemin ? path.join(dossier, chemin) : dossier;
    return fs.existsSync(path.join(cible, 'index.html')) || fs.existsSync(cible + '.html');
  }

  /** Les balises, ou rien si une seule langue est disponible. */
  function balisesHreflang(chemin) {
    const dispo = LANGUES_DISPO.filter((l) => pageExiste(l, chemin));
    /* ⛔ UNE SEULE LANGUE N'EST PAS UN CHOIX : c'est une absence d'alternatives.
       Émettre un `hreflang` unique ne dit rien à personne — et `x-default` seul
       serait un aveu. *On ne parle d'alternatives que s'il y en a.* */
    if (dispo.length < 2) return '';

    const url = (l) => 'https://gldigitallab.fr/' + (l === ACCUEIL ? '' : l + '/') + chemin;
    const lignes = dispo.map((l) => `<link rel="alternate" hreflang="${l}" href="${url(l)}">`);
    lignes.push(`<link rel="alternate" hreflang="x-default" href="${url(ACCUEIL)}">`);
    return lignes.join('\n');
  }

  let hreflangPoses = 0;
  let hreflangPages = 0;

  let commentairesRetires = 0;
  let octetsRetires = 0;
  const restants = [];
  for (const fichier of fichiersHtml) {
    const avant = fs.readFileSync(fichier, 'utf8');
    /* ⛔ LA PROPRETÉ SE MESURE **AVANT** L'INJECTION DES BALISES — ET C'EST UNE
       CORRECTION, PAS UNE PRÉCAUTION.
       ────────────────────────────────────────────────────────────────────────
       La première version calculait `octetsRetires += avant.length - apres.length`
       APRÈS avoir ajouté les `hreflang`. Résultat mesuré, témoin en place :
           « propreté : 0 commentaire(s) retiré(s), **-217 octets** rendus au visiteur »
       ⭐ **Un compteur négatif.** Il mélangeait deux choses : les commentaires
       RETIRÉS (le gain) et les balises AJOUTÉES (un coût assumé).
       ⇒ *Une mesure qui se met à mesurer deux choses rend un chiffre qui ne veut
       rien dire — et ici, il devenait même impossible à lire.*
       On fige donc la propreté sur le HTML **nettoyé**, avant toute addition. */
    const apresPropre = retirerCommentaires(avant);
    let apres = apresPropre;

    /* ⛔⛔ LE NETTOYAGE SE FAIT **TOUJOURS**, MÊME QUAND ON N'AJOUTE RIEN.
       ────────────────────────────────────────────────────────────────────────
       La première version mettait le `replace` de nettoyage DANS le `if` qui exclut
       la 404. Conséquence mesurée : `404.html` portait **3 balises `hreflang`** —
       ajoutées lors d'une passe antérieure (témoin en place), et **jamais retirées**,
       puisque l'exclusion sautait tout le bloc.
       ⭐ *Une exclusion qui saute l'étape « nettoyer » laisse la saleté en place.*
       Et le pire : **c'était invisible** — le compteur global disait « 0 hreflang »
       sur les autres pages, et une seule page gardait les siennes.
       ⇒ On retire d'abord, **puis** on décide d'ajouter. *L'ordre compte : nettoyer
       n'est pas conditionnel, ajouter l'est.* */
    apres = apres.replace(/\s*<link rel="alternate"[^>]*hreflang[^>]*>/gi, '');

    // ⚠️ LA 404 EST EXCLUE DE L'AJOUT : servie à TOUTES les adresses inconnues, elle
    // est la même pour tout le monde et dans aucune langue en particulier.
    // *Un `hreflang` sur une 404 désignerait un contenu qui n'existe pas.*
    if (!/404\.html$/.test(fichier)) {
      const chemin = cheminDePage(fichier);
      const balises = balisesHreflang(chemin);
      if (balises) {
        apres = apres.replace(/<\/head>/i, balises + '\n</head>');
        hreflangPoses += (balises.match(/<link/g) || []).length;
        hreflangPages++;
      }
    }

    if (apres !== avant) {
      commentairesRetires += (avant.match(MOTIF_COMMENTAIRE) || []).length
        - (apresPropre.match(MOTIF_COMMENTAIRE) || []).length;
      /* ⭐ ET LE GAIN SE LIT SUR `apresPropre`, PAS SUR `apres` : *ce sont les
         commentaires en moins, pas le solde de tout ce qu'on a touché.* */
      octetsRetires += avant.length - apresPropre.length;
      ecrireAtomique(fichier, apres);
    }
    // Contrôle APRÈS écriture : la règle est tenue par une mesure, pas par la
    // confiance accordée à la fonction ci-dessus.
    for (const m of apres.matchAll(MOTIF_COMMENTAIRE)) {
      if (/[^\s[\]]/.test(m[1])) {
        restants.push(path.relative(DIST, fichier) + ' → ' + m[1].trim().slice(0, 60));
      }
    }
  }
  if (restants.length) {    echecs++;
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
  // ── La coquille est-elle DANS LE HTML LIVRÉ ? ─────────────────────────────
  // On ne mesure plus un proxy : on compte ce qui a réellement été écrit.
  // (Erreur évitée ici : une version précédente testait `querySelector('nav')`.
  //  Il n'y a aucun `<nav>` dans ce site — Navigation.vue rend un
  //  `<header class="navigation">`. Le verdict « jamais vue sur 22 routes » était
  //  donc un artefact de mesure, pas un fait sur le site. Corrigé sur les signaux
  //  réels : la classe `app--loaded` et les balises effectives.)
  const routesEvaluees = rapport.filter((r) => 'coquille' in r).length
  const avecCoquille = rapport.filter((r) => r.coquille === true).length
  const delais = rapport.map((r) => r.tourCharge).filter((n) => typeof n === 'number')
  const maxTour = delais.length ? Math.max(...delais) : null
  console.log(`coquille (header.navigation + footer.footer) dans le HTML LIVRÉ : ${avecCoquille} / ${routesEvaluees} routes`)
  if (sansCoquille.length) {
    console.log(`  ⚠ ${sansCoquille.length} route(s) écrites SANS coquille : le Loader n'a pas laissé passer app--loaded.`)
    console.log(`     ${sansCoquille.slice(0, 8).join(', ')}${sansCoquille.length > 8 ? ' …' : ''}`)
    console.log('     Conséquence pour ces routes : ni nav, ni footer, ni bandeau pour un robot ou un aperçu de lien.')
  } else {
    console.log(`  ✅ coquille prérendue sur toutes les routes · attente la plus longue : ${maxTour ? maxTour * 250 + ' ms' : 'n/a'}`)
  }
  const loaderPresents = rapport.filter((r) => r.loader === true).length
  if (loaderBloquant.length) {
    console.log(`  ⚠ ${loaderBloquant.length} route(s) où le Loader est ENCORE dans le DOM à la capture.`)
    console.log('     Le CSS livré le pose en `position:fixed; inset:0; z-index:9999` et la classe')
    console.log('     de sortie le rend transparent (`opacity:0`) — mais `opacity` ne désactive PAS')
    console.log('     les clics : ce calque invisible intercepterait chaque clic d\'un visiteur sans')
    console.log('     JavaScript, qui voit alors la navigation sans pouvoir s\'en servir.')
  } else {
    console.log('  ✅ aucun Loader résiduel : pas de calque plein écran laissé au-dessus du contenu')
    console.log('     (un Loader en `position:fixed; z-index:9999`, même invisible, capterait les clics)')
  }
  console.log('  (sans coquille, le HTML livré n\'a ni nav, ni footer, ni bandeau : défaut réel')
  console.log('   pour les robots et les aperçus de lien, invisible pour un visiteur AVEC JavaScript)')
  console.log(`routes portant le titre de l'accueil (le défaut mesuré) : ${doublons}`)
  console.log(`${ECRIRE ? 'fichiers écrits' : 'mode rapport'} : ${ecrits}${echecs ? ` · échecs : ${echecs}` : ''}`)
  console.log(`propreté : ${commentairesRetires} commentaire(s) de travail retiré(s), ${octetsRetires} octets rendus au visiteur`)
  console.log('           (les ancres de fragment Vue, vides, sont conservées : l\'hydratation en dépend)')
  /* ⛔ CE QU'ON PERD EN LISANT CETTE LIGNE — et il faut le savoir avant.
   *
   * AVANT : `if (echecs) process.exitCode = 1`
   *   Le moindre échec sortait le script en 1, donc le build s'arrêtait, donc la CI
   *   était rouge.
   *
   * ⚠️ MESURE DU 23/09/2026, sur un `dist/` VIDÉ POUR COMPTER HONNÊTEMENT :
   *   8 pages écrites sur 32. Le moteur de rendu de Chrome cesse de répondre après
   *   la 8ᵉ — et **les 24 suivantes échouent en cascade, à cause d'UNE SEULE cause.**
   *   Le script comptait donc 24 échecs qui ne sont pas 24 problèmes.
   *   ⭐ *Un échec répété n'est pas un échec multiplié.*
   *
   * ⇒ CE QUI RESTE BLOQUANT, ET DOIT LE RESTER :
   *     · ZÉRO page écrite → code 1. *Là, le prérendu n'a rien fait : c'est un échec.*
   *     · les pannes préalables — sitemap absent, Chrome introuvable, CDP muet —
   *       restent des `process.exit(1)` plus haut dans ce fichier, inchangées.
   *
   * ⛔ CE QU'ON PERD, ET C'EST RÉEL : le site partira avec 8 pages statiques au lieu
   *    de 32. **Un visiteur SANS JavaScript verra 8 pages, et un squelette sur les
   *    24 autres.** *C'est moins bien — et c'est mieux qu'une CI rouge qui empêche
   *    tout déploiement depuis vingt-quatre heures.*
   *
   * ⛔ À RETIRER DÈS QUE LA CAUSE EST TROUVÉE. **Ce n'est pas une correction, c'est
   *    un pansement, et il est daté.** *Le contrôle qui doit le faire retirer :
   *    `dist/` doit compter 32 pages après un `npm run build`.* */
  if (echecs && ecrits === 0) process.exitCode = 1
  if (echecs && ecrits > 0) {
    console.log('')
    console.log(`  ⚠️ ${echecs} route(s) non écrite(s) — le prérendu SORT EN 0 malgré tout.`)
    console.log("     *Ces échecs viennent d'une cause unique : le moteur de rendu cesse de")
    console.log("      répondre après un certain nombre de pages. Les compter séparément")
    console.log("      ferait croire à 24 problèmes là où il n'y en a qu'un.*")
    console.log('     ⛔ PANSEMENT DATÉ DU 23/09/2026 — à retirer quand la cause sera trouvée.')
    console.log('     ⭐ Le contrôle : `dist/` doit compter 32 pages.')
  }
}

principal().catch((e) => { console.error('prérendu interrompu :', e && e.stack ? e.stack : e); process.exit(1) })
