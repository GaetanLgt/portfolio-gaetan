// reparer-main.mjs — GL Digital Lab, 28/09/2026
//
// ⛔⛔ CE QUE J'AI CASSÉ, ET COMMENT. Gaëtan : « mon site est tout pété ».
//    Il a raison, et la cause est entièrement de mon fait.
//
//    MESURE : l'accueil porte DEUX `<main>` —
//        index 19680 : `<main>`                                    ← inséré par mon script d'habillage
//        index 19732 : `<main id="main-content" class="manifeste">` ← le vrai, celui de la trame
//
//    ⭐ Un document HTML n'a QU'UN `<main>`. Le navigateur ferme le premier en rencontrant
//      le second, et **tout le contenu se retrouve HORS de `.manifeste`**.
//      Or `manifeste.css` est écrit sous cette portée — 15 règles préfixées `.manifeste`,
//      123 classes `.mf-*`. Sans elle, **la feuille de style ne s'applique à rien** :
//      pas de fond, pas de colonnes, pas de cadres. C'est exactement ce que montre la
//      capture de production.
//    ⇒ *Un conteneur dupliqué ne casse pas un fichier : il déplace silencieusement tout
//      ce qu'il contenait.* Le HTML reste valide, le serveur répond 200, et rien ne le dit.
//
//    ⚠️ ET 12 AUTRES PAGES ont `<main class="acte">` — une classe de l'ANCIEN site, qui
//      n'existe plus dans `manifeste.css`. Leur nouveau corps est donc sans style lui aussi.
//
// ⭐ CE QUE FAIT CE SCRIPT : il garantit qu'il n'y a QU'UN `<main>`, et qu'il porte
//   `manifeste` ET `main-content` (la cible du lien d'évitement « Aller au contenu »).
//   Les autres classes utiles sont CONSERVÉES — on ne jette pas ce qu'on n'a pas écrit.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ICI = path.dirname(fileURLToPath(import.meta.url));
const C = path.resolve(ICI, '..', 'cinematique');
const SIMULER = process.argv.includes('--simuler');
if (!fs.existsSync(C)) { console.error('⛔ cinematique/ introuvable depuis ' + C); process.exit(2); }

const pages = [];
const marcher = (d) => {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) { if (!['node_modules', '.git', 'vendor'].includes(e.name)) marcher(p); }
    else if (e.name.endsWith('.html')) pages.push(p);
  }
};
marcher(C);
console.log('  pages : ' + pages.length);

let reparees = 0, doublesSupprimes = 0;
const rapport = [];

for (const page of pages) {
  const rel = path.relative(C, page).replace(/\\/g, '/');
  let t = fs.readFileSync(page, 'utf8');
  const avant = t;

  // ── ① SUPPRIMER LES `<main>` EN TROP (vides, sans fermeture) ─────────────
  //    On repère un `<main>` suivi IMMÉDIATEMENT d'un autre `<main>` — c'est le doublon.
  let garde = 0;
  while (garde++ < 5) {
    const m = t.match(/<main\b[^>]*>\s*(?=<main\b)/);
    if (!m) break;
    t = t.replace(m[0], '');
    doublesSupprimes++;
    console.log('  ' + rel + ' : <main> vide en double SUPPRIME');
  }

  // ── ② LE `<main>` RESTANT PORTE-T-IL LA BONNE PORTÉE ? ───────────────────
  const mm = t.match(/<main\b([^>]*)>/);
  if (!mm) { rapport.push('  !! ' + rel + ' : AUCUN <main>'); continue; }
  const attrs = mm[1];
  if (!/\bclass="[^"]*\bmanifeste\b/.test(attrs) || !/id="main-content"/.test(attrs)) {
    // on garde les classes existantes qui ne sont pas la vieille portée morte
    let classes = ((attrs.match(/class="([^"]*)"/) || [, ''])[1]).split(/\s+/).filter(Boolean);
    classes = classes.filter(c => c !== 'acte');           // classe de l'ancien site, disparue
    if (!classes.includes('manifeste')) classes.unshift('manifeste');
    let nouvelAttrs = attrs
      .replace(/class="[^"]*"/, 'class="' + classes.join(' ') + '"')
      .replace(/\s+style="[^"]*"/g, '');                    // le style inline de l'ancien site
    if (!/id="main-content"/.test(nouvelAttrs)) {
      // l'ancien attribut `id="contenu"` ne sert plus : le lien d'évitement vise main-content
      nouvelAttrs = nouvelAttrs.replace(/\s+id="(?!main-content)[^"]*"/, '');
      nouvelAttrs = ' id="main-content"' + nouvelAttrs;
    }
    t = t.replace(mm[0], '<main' + nouvelAttrs + '>');
    console.log('  ' + rel + ' : <main> réparé ->' + nouvelAttrs);
  }

  // ── ③ VÉRIFIER QU'IL N'EN RESTE QU'UN ────────────────────────────────────
  const compte = (t.match(/<main\b/g) || []).length;
  if (compte !== 1) throw new Error('ASSERTION ' + rel + ' : ' + compte + ' <main> après réparation');
  const fin = (t.match(/<\/main>/g) || []).length;
  if (fin !== 1) throw new Error('ASSERTION ' + rel + ' : ' + fin + ' </main>');

  if (t !== avant) {
    if (!SIMULER) fs.writeFileSync(page, t, 'utf8');
    reparees++;
  }
}

console.log('');
console.log('  pages réparées       : ' + reparees);
console.log('  <main> vides retirés : ' + doublesSupprimes);
if (rapport.length) rapport.forEach(r => console.log(r));

// ── LA PREUVE : on relit tout, et on compte ────────────────────────────────
console.log('');
console.log('=== VÉRIFICATION (relu du disque) ===');
let mauvaises = 0;
for (const page of pages) {
  const rel = path.relative(C, page).replace(/\\/g, '/');
  const t = fs.readFileSync(page, 'utf8');
  const n = (t.match(/<main\b/g) || []).length;
  const m = t.match(/<main\b[^>]*>/);
  const porte = m && /\bclass="[^"]*\bmanifeste\b/.test(m[0]);
  if (n !== 1 || !porte) { mauvaises++; console.log('  !! ' + rel + ' : ' + n + ' <main>, portée manifeste=' + porte); }
}
console.log('  ' + (mauvaises === 0 ? '✅ TOUTES LES PAGES : 1 seul <main>, portée .manifeste' : '⛔ ' + mauvaises + ' page(s) encore fautive(s)'));
if (SIMULER) console.log('  MODE SIMULÉ : rien n\'a été écrit.');
