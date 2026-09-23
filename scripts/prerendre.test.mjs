import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'

const execFileAsync = promisify(execFile)
const REPO = '/home/runner/work/portfolio-gaetan/portfolio-gaetan'
const SCRIPT = path.join(REPO, 'scripts', 'prerendre.js')

const trouverChrome = () =>
  [
    process.env.CHROME_PATH,
    '/usr/bin/google-chrome',
    '/usr/bin/google-chrome-stable',
    '/usr/bin/chromium',
    '/usr/bin/chromium-browser',
    '/opt/google/chrome/chrome',
  ].find((c) => c && fs.existsSync(c))

test('un échec de route laisse les suivantes et la 404 se générer', { timeout: 120000 }, async (t) => {
  if (!trouverChrome()) {
    t.skip('Chrome absent : ce témoin éprouve le prérendu réel')
    return
  }

  const racine = fs.mkdtempSync(path.join(os.tmpdir(), 'prerendre-test-'))
  const dist = path.join(racine, 'dist')
  const routeur = path.join(racine, 'src', 'router')
  fs.mkdirSync(dist, { recursive: true })
  fs.mkdirSync(routeur, { recursive: true })

  const coquille = `<!DOCTYPE html>
<html lang="fr" class="no-js">
<head>
  <meta charset="utf-8">
  <title>Coquille</title>
</head>
<body>
  <div id="app"></div>
  <script>
    document.documentElement.className = 'no-js';
    const app = document.getElementById('app');
    const path = location.pathname === '/' ? '/' : location.pathname.replace(/\\/$/, '');
    const titre =
      path === '/__page-introuvable__' ? 'Page 404'
      : path === '/' ? 'Accueil témoin'
      : path === '/route-en-echec' ? 'Page 404'
      : 'Page ' + path;
    const texte =
      path === '/route-en-echec'
        ? 'court'
        : ('Contenu témoin '.repeat(180)) + path;
    document.title = titre;
    app.className = 'app--loaded';
    app.innerHTML = \`
      <header class="navigation">Nav</header>
      <main>\${texte}</main>
      <footer class="footer">Footer</footer>
    \`;
    const tracker = document.createElement('script');
    tracker.async = true;
    tracker.src = 'https://analytics.gldigitallab.fr/matomo.js';
    document.head.appendChild(tracker);
  </script>
</body>
</html>`

  fs.writeFileSync(path.join(racine, 'index.html'), coquille)
  fs.writeFileSync(path.join(dist, 'index.html'), coquille)
  fs.writeFileSync(path.join(dist, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://example.test/</loc></url>
  <url><loc>https://example.test/route-en-echec</loc></url>
  <url><loc>https://example.test/route-apres-echec</loc></url>
</urlset>`)
  fs.writeFileSync(path.join(routeur, 'index.js'), `const routes = [
  { path: '/' },
  { path: '/route-en-echec' },
  { path: '/route-apres-echec' },
]
export default routes
`)

  let sortie = null
  try {
    await execFileAsync(process.execPath, [SCRIPT, '--dist', dist], { cwd: REPO, env: process.env })
  } catch (erreur) {
    sortie = erreur
  }

  assert.ok(sortie, 'le témoin doit garder un code non nul quand une route échoue')
  assert.equal(sortie.code, 1)

  const routeApres = path.join(dist, 'route-apres-echec', 'index.html')
  const page404 = path.join(dist, '404.html')
  assert.ok(fs.existsSync(routeApres), 'la route APRES l’échec doit quand même être écrite')
  assert.ok(fs.existsSync(page404), 'la page 404 doit quand même être écrite')

  const htmlRouteApres = fs.readFileSync(routeApres, 'utf8')
  const html404 = fs.readFileSync(page404, 'utf8')
  assert.match(htmlRouteApres, /Page \/route-apres-echec/)
  assert.match(html404, /Page 404/)
  assert.doesNotMatch(htmlRouteApres, /<script[^>]+matomo\.js/i)
  assert.doesNotMatch(html404, /<script[^>]+matomo\.js/i)

  fs.rmSync(racine, { recursive: true, force: true })
})
