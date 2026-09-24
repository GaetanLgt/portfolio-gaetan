// generer-404.mjs — la page 404, produite SANS navigateur.
//
// ⛔ POURQUOI CE SCRIPT EXISTE, APRÈS QUATRE TENTATIVES DANS L'AUTRE SENS.
//
// La 404 était le dernier échec du pré-rendu, et j'ai éliminé les causes une par une :
//
//   · ce n'est pas le CHEMIN — le serveur local sert bien le repli SPA ;
//   · ce n'est pas le SERVEUR — je l'ai relancé trois fois, le titre n'a pas bougé ;
//   · ce n'est pas le CACHE — `Network.setCacheDisabled` + `clearBrowserCache` :
//     le titre est resté « 127.0.0.1 » ;
//   · ce n'est pas la 404 elle-même — le routeur porte bien `/:pathMatch(.*)*`.
//
// ⭐ CE QUE LE TITRE DIT, ET QU'IL DIT DEPUIS LE DÉBUT : **« 127.0.0.1 » est une page
//   d'erreur de Chrome**, pas un titre du site. Le moteur ne peut plus charger
//   d'adresse — il est figé depuis la trentième navigation environ, et relancer le
//   serveur ne ranime pas un moteur. *Trente-trois pages ont été rendues ; à la
//   trente-quatrième, il n'y a plus personne.*
//
// ⇒ **On arrête de demander à un moteur fatigué quelque chose qu'on peut lire sur le
//   disque.** Le HTML de la 404 est une dérivée de celui de l'accueil — même coquille,
//   même navigation, même pied de page — dont on remplace le contenu et le titre.
//
// ⛔ ET LA PRUDENCE DU 11/09/2026 EST TENUE : la page porte un VRAI titre de 404. *Le
//    repli SPA servait la coquille de l'accueil en HTTP 200 pour /arcade — un doublon
//    de l'accueil aux yeux d'un moteur, pas un 404.* Ici, un moteur lit « 404 ».
//
// USAGE : node scripts/generer-404.mjs

import fs from 'node:fs';
import path from 'node:path';

const DIST = path.resolve('dist');
const ACCUEIL = path.join(DIST, 'index.html');
const SORTIE = path.join(DIST, '404.html');

// ⛔ ON REFUSE D'INVENTER : sans accueil pré-rendu, il n'y a pas de coquille à dériver.
if (!fs.existsSync(ACCUEIL)) {
  console.error('⛔ dist/index.html introuvable — lancez `npm run build` avant.');
  console.error('   (Une 404 sans coquille serait une page nue : on préfère échouer.)');
  process.exit(1);
}
const html = fs.readFileSync(ACCUEIL, 'utf8');

/** Remplace, ou échoue. Deux occurrences attendues, jamais une de plus. */
function remplacer(nom, motif, remplacement, attendu = 1) {
  const global = motif.flags.includes('g') ? motif : new RegExp(motif.source, motif.flags + 'g');
  const n = [...html.matchAll(global)].length;
  if (n !== attendu) {
    console.error(`⛔ ÉCHEC D'ASSERTION — « ${nom} » : ${n} occurrence(s), ${attendu} attendue(s).`);
    process.exit(1);
  }
  return html.replace(motif, remplacement);
}

const CONTENU_404 = `<main id="app-404" style="max-width:44rem;margin:0 auto;padding:140px 24px 80px;font-family:var(--f-body,Arial),sans-serif">
      <p style="font:500 11px/1 var(--f-mono,monospace);letter-spacing:.22em;text-transform:uppercase;color:var(--accent,#2abfff);margin:0 0 14px">Erreur 404</p>
      <h1 style="font-family:var(--f-disp,Arial Black),sans-serif;font-size:clamp(1.8rem,5vw,3rem);line-height:1.1;margin:0 0 20px;color:var(--ink,#e2e9f0)">Cette adresse n'existe pas.</h1>
      <p style="color:var(--ink-soft,#93a3b3);line-height:1.7;margin:0 0 32px">
        Le navire n'est pas passé par là. La page a peut-être été renommée, ou l'adresse
        recopiée de travers — <em>cela arrive plus souvent qu'on ne croit.</em>
      </p>
      <p style="color:var(--ink-soft,#93a3b3);line-height:1.7;margin:0 0 8px"><strong style="color:var(--ink,#e2e9f0)">Par où repartir :</strong></p>
      <ul style="list-style:none;padding:0;margin:0 0 36px;display:grid;gap:8px">
        <li><a style="color:var(--accent,#2abfff)" href="/">La page d'accueil</a></li>
        <li><a style="color:var(--accent,#2abfff)" href="/services">Les prestations et les prix</a></li>
        <li><a style="color:var(--accent,#2abfff)" href="/guides">Les dix réponses courtes</a></li>
        <li><a style="color:var(--accent,#2abfff)" href="/dossier">Le dossier professionnel</a></li>
        <li><a style="color:var(--accent,#2abfff)" href="/contact">Écrire au studio</a></li>
      </ul>
      <p style="color:var(--ink-soft,#93a3b3);line-height:1.7">
        Rien de tout cela ne répond à votre question ?
        <a style="color:var(--accent,#2abfff)" href="/contact">Dites-le</a> —
        <em>réponse sous 24 heures.</em>
      </p>
    </main>`;

let out = html;
out = remplacer('le titre', /<title>[^<]*<\/title>/i, '<title>Page introuvable (404) | Génie IT Tek FR</title>');
// ⛔ Le canonical du repli SPA désignait une adresse de test : sur une page servie à
//    TOUTES les adresses inconnues, il ne désigne rien. On le retire.
out = remplacer('le canonical', /\s*<link rel="canonical"[^>]*>/i, '');
out = remplacer('le contenu principal', /<main[\s\S]*?<\/main>/i, CONTENU_404);

// ⛔ VÉRIFICATION APRÈS ÉCRITURE — on relit ce qui est sur le disque.
fs.writeFileSync(SORTIE, out, 'utf8');
const relu = fs.readFileSync(SORTIE, 'utf8');

const controles = [
  ['titre de 404', /<title>[^<]*404[^<]*<\/title>/i.test(relu)],
  ['aucun canonical', !/<link rel="canonical"/i.test(relu)],
  ['contenu de 404 posé', relu.includes("Cette adresse n'existe pas")],
  ['liens de secours', (relu.match(/href="\/(services|guides|dossier|contact)"/g) || []).length >= 4],
  ['navigation conservée', /<nav/i.test(relu) || /header/i.test(relu)],
];
const rates = controles.filter(([, ok]) => !ok).map(([n]) => n);
if (rates.length) {
  console.error(`⛔ APRÈS ÉCRITURE, il manque : ${rates.join(', ')}`);
  process.exit(1);
}

console.log('══ 404 GÉNÉRÉE — sans navigateur ══\n');
controles.forEach(([n]) => console.log(`  ✅ ${n}`));
console.log(`\n  taille  : ${Math.round(relu.length / 1024)} Ko (dérivée de l'accueil pré-rendu)`);
console.log(`  sortie  : ${SORTIE}`);
console.log('\n  ⭐ Elle ne dépend ni du moteur de Chrome, ni du serveur local, ni de leur fatigue.');
