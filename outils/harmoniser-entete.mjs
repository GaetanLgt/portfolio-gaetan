#!/usr/bin/env node
// harmoniser-entete.mjs — gldigitallab.fr · pose le MÊME en-tête et le MÊME pied de page sur toutes
// les pages statiques de cinematique/. Idempotent : relancé, il réécrit les mêmes blocs.
//
// Pourquoi (29/09/2026) : après la refonte de l'accueil, 12 pages gardaient l'ancien menu, dont les
// liens ../#prix, ../#realisations, ../#contact pointaient vers des ancres qui n'existent plus.
// Un menu défini à un seul endroit ne peut plus diverger.
//   node outils/harmoniser-entete.mjs            écrit
//   node outils/harmoniser-entete.mjs --simuler  montre ce qui changerait
import fs from 'node:fs';
import path from 'node:path';

const C = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..', 'cinematique');
const SIMULER = process.argv.includes('--simuler');

// Le menu : 5 entrées (audit 360°), une seule définition.
const MENU = [['/', 'Accueil'], ['/offres/', 'Solutions'], ['/#preuves', 'Réalisations'], ['/#ressources', 'Ressources'], ['/contact.php', 'Contact']];
const actif = (rel, href) =>
  (href === '/' && rel === 'index.html') || (href === '/offres/' && rel.startsWith('offres/')) ||
  (href === '/contact.php' && rel === 'contact.php') || (href === '/#ressources' && /^(analyses|veille|formation)\//.test(rel));

const entete = (rel) => `<header class="gl-barre">
  <div class="gl-cadre">
    <a class="gl-logo" href="/" aria-label="GL Digital Lab — accueil"><b>G<span>L</span></b><small>DIGITAL LAB</small></a>
    <nav aria-label="Navigation principale">
      <ul class="gl-menu">
${MENU.map(([h, t]) => `        <li><a href="${h}"${actif(rel, h) ? ' aria-current="page"' : ''}>${t}</a></li>`).join('\n')}
      </ul>
    </nav>
    <a class="gl-bouton" href="/contact.php">Réserver un diagnostic →</a>
  </div>
</header>`;

const PIED = `<footer class="gl-pied">
  <div class="gl-cadre">
    <div class="gl-pied-grille">
      <div>
        <a class="gl-logo" href="/"><b>G<span>L</span></b><small>DIGITAL LAB</small></a>
        <p>Studio web &amp; IA locale pour TPE/PME.<br>Une activité de Génie IT Tek FR — immatriculation en cours.</p>
      </div>
      <nav aria-label="Pied de page"><h2>Solutions</h2><ul><li><a href="/offres/#cadrage">Cadrage &amp; diagnostic IA locale</a></li><li><a href="/offres/#site">Site web &amp; IA intégrée</a></li><li><a href="/offres/#deploiement">Déploiement IA souveraine</a></li><li><a href="/services/">Tous les services</a></li></ul></nav>
      <div><h2>Ressources</h2><ul><li><a href="/analyses/">Analyses</a></li><li><a href="/veille/">Veille</a></li><li><a href="/formation/">Formation</a></li><li><a href="/recherche-souveraine.html">Recherche souveraine</a></li><li><a href="/urgence-cyber/">Urgence cyber</a></li></ul></div>
      <div><h2>Contact</h2><ul><li>Harponville (80560)</li><li><a href="/contact.php">Formulaire de contact</a></li><li><a href="/ce-que-nous-nous-imposons/">Ce que nous nous imposons</a></li></ul></div>
    </div>
    <div class="gl-legal">
      <span>© 2026 GL Digital Lab · Créé avec l'aide de l'IA</span>
      <span><a href="/mentions-legales.html">Mentions légales</a> · <a href="/confidentialite.html">Confidentialité</a> · <a href="/cgv/">CGV</a></span>
    </div>
  </div>
</footer>`;

const fichiers = [];
const marcher = (d) => {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) { if (!['vendor', 'src', 'sources', 'cles', 'img', 'css', 'ouverture', 'modeles'].includes(e.name)) marcher(p); }
    else if (e.name.endsWith('.html') || e.name === 'contact.php') fichiers.push(p);
  }
};
marcher(C);

let changes = 0;
for (const f of fichiers) {
  const rel = path.relative(C, f).replace(/\\/g, '/');
  // 404.html est servie à N'IMPORTE QUELLE profondeur : ses ressources sont en chemin absolu.
  const prefixe = rel === '404.html' ? '/' : '../'.repeat(rel.split('/').length - 1);
  let t = fs.readFileSync(f, 'utf8');
  const avant = t;
  if (!/<header[\s\S]*?<\/header>/.test(t) || !/<footer[\s\S]*?<\/footer>/.test(t)) {
    console.log(`  ⚠️  ${rel} : pas d'en-tête ou de pied — laissé tel quel`); continue;
  }
  t = t.replace(/<header[\s\S]*?<\/header>/, entete(rel)).replace(/<footer[\s\S]*?<\/footer>/, PIED);
  if (!t.includes('css/entete.css')) {
    const lien = `<link rel="stylesheet" href="${prefixe}css/entete.css">`;
    t = /<\/head>/.test(t) ? t.replace('</head>', `${lien}\n</head>`) : t;
  }
  if (t !== avant) {
    changes++;
    if (!SIMULER) fs.writeFileSync(f, t, 'utf8');
    console.log(`  ${SIMULER ? '[simulé] ' : 'OK '} ${rel}`);
  }
}
console.log(`${fichiers.length} fichier(s) examiné(s), ${changes} harmonisé(s)${SIMULER ? ' (simulation : rien écrit)' : ''}.`);
