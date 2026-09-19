#!/usr/bin/env node
// ============================================================================
// verifier-contact.mjs — les liens de contact LIVRÉS sont-ils conformes ?
// GL Digital Lab · 19/09/2026
// ============================================================================
//
// POURQUOI CE FICHIER EXISTE
//   `src/config/contact.js` écrit noir sur blanc que « son résultat est mesuré
//   par `npm run audit:contact` ». Au moment de l'écrire, cette phrase était
//   FAUSSE : le script n'existait pas. C'est le défaut que ce studio combat —
//   une affirmation qui a la forme d'un fait sans en être un.
//
//   On pouvait retirer la phrase. On a préféré écrire le contrôle : le studio
//   a demandé deux boutons de contact, et rien ne vérifiait qu'ils arrivent
//   jusqu'au visiteur.
//
// CE QU'IL VÉRIFIE — sur le HTML LIVRÉ (dist/), pas sur les sources
//   1. présence des deux liens sur les pages qui doivent les porter ;
//   2. UNE SEULE forme distincte pour chacun — une deuxième forme veut dire
//      qu'une valeur en dur a survécu à la centralisation ;
//   3. le `mailto:` porte un objet pré-rempli, et il se décode exactement ;
//   4. le `tel:` est bien formé (`tel:+` puis 6 à 15 chiffres, RFC 3966) ;
//   5. aucune adresse ni numéro EN DUR hors de la source unique.
//
// USAGE
//   node scripts/verifier-contact.mjs            # verdict, code 0 ou 1
//   node scripts/verifier-contact.mjs --detail   # liste les formes trouvées
//
// ⚠️ IL MESURE LA FORME, PAS LE PROTOCCOLE. Un `mailto:` conforme à la RFC 6068
//    n'est pas un client de messagerie qui s'ouvre. Aucun script ne peut
//    l'éprouver : c'est un geste humain, et le dire fait partie du contrôle.
// ============================================================================

import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';

const RACINE = process.cwd();
const DIST = join(RACINE, 'dist');
const CONFIG = join(RACINE, 'src', 'config', 'contact.js');
const detail = process.argv.includes('--detail');

if (!existsSync(DIST)) {
  console.error('  ⛔ dist/ est absent : lancez « npm run build » d\'abord.');
  console.error('     (mesurer les sources ne dirait rien — c\'est le LIVRÉ qui compte)');
  process.exit(2);
}

// ── Les valeurs attendues, lues DANS la source unique ────────────────────────
const src = readFileSync(CONFIG, 'utf8');
const lire = (nom) => {
  const m = src.match(new RegExp(`export const ${nom}\\s*=\\s*'([^']*)'`));
  if (!m) { console.error(`  ⛔ ${nom} introuvable dans src/config/contact.js`); process.exit(2); }
  return m[1];
};
const COURRIEL = lire('COURRIEL');
const TELEPHONE_TEL = lire('TELEPHONE_TEL');
const TELEPHONE_AFFICHE = lire('TELEPHONE_AFFICHE');

// ── Parcours du HTML livré ───────────────────────────────────────────────────
const pages = [];
(function marcher(d) {
  for (const e of readdirSync(d)) {
    const p = join(d, e);
    if (statSync(p).isDirectory()) marcher(p);
    else if (e.endsWith('.html')) pages.push(p);
  }
})(DIST);

const mails = new Set(), tels = new Set(), parPage = new Map();
let pagesAvecMail = 0, pagesAvecTel = 0, mailsSansObjet = 0;

for (const p of pages) {
  const h = readFileSync(p, 'utf8');
  const rel = relative(DIST, p).replace(/\\/g, '/');
  const m = [...h.matchAll(/href="(mailto:[^"]*)"/g)].map((x) => x[1]);
  const t = [...h.matchAll(/href="(tel:[^"]*)"/g)].map((x) => x[1]);
  if (m.length) pagesAvecMail++;
  if (t.length) pagesAvecTel++;
  m.forEach((x) => mails.add(x));
  t.forEach((x) => tels.add(x));
  m.filter((x) => !x.includes('?subject=')).forEach(() => mailsSansObjet++);
  if (m.length || t.length) parPage.set(rel, { m: m.length, t: t.length });
}

// ── Contrôles ────────────────────────────────────────────────────────────────
const verdicts = [];
const ok = (t) => verdicts.push(['ok', t]);
const ko = (t) => verdicts.push(['KO', t]);

ok(`${pages.length} page(s) de HTML livré analysée(s)`);

if (pagesAvecMail === 0) ko('AUCUN lien mailto: dans le HTML livré — les boutons n\'arrivent pas au visiteur');
else ok(`mailto: présent sur ${pagesAvecMail} page(s)`);

if (pagesAvecTel === 0) ko('AUCUN lien tel: dans le HTML livré');
else ok(`tel: présent sur ${pagesAvecTel} page(s)`);

// 2. une seule forme distincte
if (mails.size > 1) ko(`${mails.size} formes de mailto: DIFFÉRENTES — une valeur en dur a survécu`);
else if (mails.size === 1) ok('une seule forme de mailto: — la centralisation tient');
if (tels.size > 1) ko(`${tels.size} formes de tel: DIFFÉRENTES`);
else if (tels.size === 1) ok('une seule forme de tel:');

// 3. l'objet pré-rempli, et son décodage
if (mailsSansObjet > 0) ko(`${mailsSansObjet} lien(s) mailto: SANS objet pré-rempli`);
else ok('tous les mailto: portent un objet pré-rempli');

for (const lien of mails) {
  const q = lien.indexOf('?subject=');
  if (q < 0) continue;
  const brut = lien.slice(q + 9);
  let decode = '';
  try { decode = decodeURIComponent(brut); } catch { ko(`objet non décodable : ${brut.slice(0, 40)}`); continue; }
  if (brut.includes(' ') || brut.includes('+')) ko(`objet mal encodé (espace brut ou « + ») : ${brut.slice(0, 40)}`);
  else ok(`objet décodé exactement : « ${decode} »`);
}

// 4. la forme du tel:
for (const lien of tels) {
  if (!/^tel:\+\d{6,15}$/.test(lien)) ko(`tel: mal formé : ${lien}`);
  else ok(`tel: conforme (RFC 3966) : ${lien}`);
}

// 5. aucune valeur en dur hors de la source unique
const durs = [];
(function marcher(d) {
  for (const e of readdirSync(d)) {
    if (e === 'node_modules' || e === 'dist' || e === '.git') continue;
    const p = join(d, e);
    if (statSync(p).isDirectory()) marcher(p);
    else if (/\.(vue|js|mjs)$/.test(e)) {
      if (p === CONFIG) continue;
      const h = readFileSync(p, 'utf8');
      if (h.includes(COURRIEL)) durs.push(`${relative(RACINE, p)} → courriel`);
      if (h.includes('33686474610')) durs.push(`${relative(RACINE, p)} → tel:`);
      if (h.includes(TELEPHONE_AFFICHE)) durs.push(`${relative(RACINE, p)} → numéro affiché`);
    }
  }
})(join(RACINE, 'src'));
if (durs.length) durs.forEach((d) => ko(`valeur EN DUR hors de contact.js : ${d}`));
else ok('aucune coordonnée en dur hors de src/config/contact.js');

// ── Sortie ───────────────────────────────────────────────────────────────────
console.log('');
console.log('='.repeat(78));
console.log('  CONTACT — ce qui est RÉELLEMENT LIVRÉ');
console.log('='.repeat(78));
console.log(`  source unique : src/config/contact.js`);
console.log(`  courriel      : ${COURRIEL}`);
console.log(`  téléphone     : ${TELEPHONE_AFFICHE}  (tel:${TELEPHONE_TEL})`);
console.log('');
if (detail) {
  console.log('  ── formes distinctes trouvées dans le livré ──');
  for (const m of mails) console.log('    mailto: ' + m);
  for (const t of tels) console.log('    tel:    ' + t);
  console.log('');
  console.log(`  ── pages portant un contact : ${parPage.size} ──`);
  for (const [p, n] of [...parPage.entries()].slice(0, 12)) console.log(`    ${p.padEnd(52)} ${n.m} mailto, ${n.t} tel`);
  if (parPage.size > 12) console.log(`    … et ${parPage.size - 12} autre(s)`);
  console.log('');
}
for (const [etat, t] of verdicts) console.log(`  [${etat === 'ok' ? 'ok' : '!!'}]  ${t}`);
const echecs = verdicts.filter((v) => v[0] === 'KO').length;
console.log('');
if (echecs === 0) { console.log('  Verrou de contact tenu.'); console.log('='.repeat(78)); console.log(''); process.exit(0); }
console.log(`  ⛔ ${echecs} échec(s) — le contact n'arrive pas correctement au visiteur.`);
console.log('='.repeat(78)); console.log('');
process.exit(1);
