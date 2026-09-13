#!/usr/bin/env node
/**
 * verifier-poids.mjs — le poids du premier chargement, par page
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * POURQUOI CE FICHIER EXISTE
 * ───────────────────────────────────────────────────────────────────────────
 * La signature qualité du studio porte un verrou chiffré : « < 1 MB par page ».
 * Il n'était vérifié NULLE PART.
 *
 *   · `verifier-verrous.mjs` écrit noir sur blanc, à son VERROU 5 : « non mesuré
 *     ici : voir l'étape « Check file sizes » de deploy.yml ».
 *   · Or cette étape-là fait `find src -name "*.vue" -size +100k -exec ls -lh {} \;`
 *     — elle AFFICHE, elle n'échoue jamais. Un `find` sans `exit 1` n'est pas un
 *     verrou, c'est une impression à l'écran. Et elle regarde `src/`, alors que
 *     le nombre qui compte est celui du build.
 *
 * Résultat mesuré le 13/09/2026 : le seul verrou chiffré de la charte qui porte
 * sur le poids n'avait aucun juge. C'est la même famille que le verrou Lighthouse
 * resté en `warn` : *un verrou qui ne peut pas échouer n'est pas un verrou.*
 *
 * CE QU'IL MESURE, ET COMMENT
 *   Pour CHAQUE page HTML livrée (`dist/**\/*.html`), le poids des ressources
 *   qu'elle demande au premier chargement :
 *     scripts du bundle · modules préchargés · feuilles de style · polices
 *     citées par ces feuilles · icônes et favicons · manifest · images du HTML.
 *
 *   Textes (HTML, JS, CSS, JSON, SVG) → **compressés en gzip niveau 6**, parce que
 *   c'est ce que le visiteur paie réellement : le serveur sert ces types compressés.
 *   Binaires (woff2, jpg, png, webp, ico, avif) → taille sur disque, car ils sont
 *   déjà compressés — les recompresser donnerait un chiffre flatteur et faux.
 *   La méthode est donc explicite et reproductible, pas estimée au doigt mouillé.
 *
 *   Ce n'est PAS un score Lighthouse : c'est un compte d'octets, déterministe.
 *   Il ne dépend ni de la machine, ni de la carte graphique, ni de l'heure.
 *
 * POURQUOI PAR PAGE ET NON UN TOTAL
 *   `du -sh dist` additionne des ressources que personne ne télécharge ensemble :
 *   ce total ne décrit aucune visite. La charte dit « par page » — donc on juge
 *   page par page, et le verdict porte sur la plus lourde.
 *
 * USAGE
 *   node scripts/verifier-poids.mjs              → mesure et juge
 *   node scripts/verifier-poids.mjs --detail     → détail page par page
 *   node scripts/verifier-poids.mjs --seuil 1.5  → seuil en Mo (défaut 1, la charte)
 * Sortie 0 = sous le seuil · 1 = seuil franchi · 2 = rien mesuré.
 */

import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join, dirname, extname, relative } from 'node:path';
import { gzipSync } from 'node:zlib';

const RACINE = process.cwd();
const argv = process.argv.slice(2);
const lire = (n, d) => {
  const i = argv.indexOf('--' + n);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : d;
};

const SEUIL_MO = Number(lire('seuil', 1));        // la charte : « < 1 MB par page »
const SEUIL = SEUIL_MO * 1024 * 1024;
const DIST = join(RACINE, 'dist');
const DETAIL = argv.includes('--detail');

// ─── Échec bruyant : un verrou qui n'a rien mesuré n'est pas un verrou tenu ───
const accueil = join(DIST, 'index.html');
if (!existsSync(accueil)) {
  console.error('  [KO]  dist/index.html introuvable.');
  console.error('        Ce verrou mesure le BUILD, pas les sources : lancez-le après `npm run build`.');
  console.error('        Un verrou qui n\'a rien mesuré n\'est PAS un verrou tenu.');
  process.exit(2);
}

/* ─── les pages livrées ─────────────────────────────────────────────────── */
const pages = [];
(function parcourir(dossier) {
  for (const e of readdirSync(dossier, { withFileTypes: true })) {
    const p = join(dossier, e.name);
    if (e.isDirectory()) parcourir(p);
    else if (e.name.endsWith('.html')) pages.push(p);
  }
})(DIST);
if (pages.length === 0) {
  console.error('  [KO]  aucune page HTML dans dist/. Rien à mesurer.');
  process.exit(2);
}

/* ─── poids d'un fichier du build, selon sa nature ──────────────────────── */
const DEJA_COMPRIME = new Set(['.woff2', '.woff', '.jpg', '.jpeg', '.png', '.webp', '.avif', '.ico', '.gif', '.mp4', '.webm']);
const manquants = [];
const dejaVus = new Map();

function poids(cheminAbsolu) {
  if (dejaVus.has(cheminAbsolu)) return dejaVus.get(cheminAbsolu);
  if (!existsSync(cheminAbsolu) || statSync(cheminAbsolu).isDirectory()) {
    manquants.push(cheminAbsolu);
    dejaVus.set(cheminAbsolu, { disque: 0, servi: 0 });
    return dejaVus.get(cheminAbsolu);
  }
  const brut = readFileSync(cheminAbsolu);
  const disque = brut.length;
  const servi = DEJA_COMPRIME.has(extname(cheminAbsolu).toLowerCase()) ? disque : gzipSync(brut, { level: 6 }).length;
  const r = { disque, servi };
  dejaVus.set(cheminAbsolu, r);
  return r;
}

/* ─── résolution d'une référence du HTML vers dist/ ─────────────────────── */
const resoudre = (ref, depuis) => {
  const propre = ref.split('?')[0].split('#')[0];
  if (/^(https?:)?\/\//i.test(propre) || propre.startsWith('data:')) return null;  // hors du site
  const base = depuis ? dirname(depuis) : DIST;
  return propre.startsWith('/') ? join(DIST, propre) : join(base, propre);
};

/* ─── ressources du premier chargement d'une page ───────────────────────── */
function ressourcesDe(page) {
  const code = readFileSync(page, 'utf8');
  const trouvees = new Map(); // chemin absolu -> poste

  const ajouter = (ref, poste, depuis) => {
    const abs = resoudre(ref, depuis);
    if (!abs) return;
    if (!trouvees.has(abs)) trouvees.set(abs, poste);
  };

  for (const m of code.matchAll(/<script[^>]+src=["']([^"']+)["']/g)) ajouter(m[1], 'script', page);
  for (const m of code.matchAll(/rel=["']modulepreload["'][^>]*href=["']([^"']+)["']/g)) ajouter(m[1], 'preload', page);
  for (const m of code.matchAll(/href=["']([^"']+)["'][^>]*rel=["']modulepreload["']/g)) ajouter(m[1], 'preload', page);
  for (const m of code.matchAll(/<link[^>]+rel=["']stylesheet["'][^>]*href=["']([^"']+)["']/g)) ajouter(m[1], 'style', page);
  for (const m of code.matchAll(/<link[^>]+href=["']([^"']+)["'][^>]*rel=["']stylesheet["']/g)) ajouter(m[1], 'style', page);
  for (const m of code.matchAll(/rel=["'](?:icon|shortcut icon|apple-touch-icon)["'][^>]*href=["']([^"']+)["']/g)) ajouter(m[1], 'icone', page);
  for (const m of code.matchAll(/rel=["']manifest["'][^>]*href=["']([^"']+)["']/g)) ajouter(m[1], 'manifest', page);

  /* ── LES IMAGES, ET LEUR `srcset` ──────────────────────────────────────────
     ⚠ CORRIGÉ LE 13/09/2026 — CE VERROU MENTAIT SUR LE MOBILE PAR OMISSION.
     Il ne lisait que l'attribut `src`. Or l'image du hero porte depuis le 13/09
     un `srcset` : le navigateur sert **540 px / 18,4 Ko** à un téléphone au lieu
     du fichier de 1400 px / 69,6 Ko que `src` désigne seul. Le verrou comptait
     donc 69,6 Ko là où un téléphone en télécharge 18,7 — **il surestimait le
     mobile de plus de 50 Ko sur la page la plus lourde du site.**
     Un verrou qui ne voit pas la variante réellement servie ne mesure pas ce que
     le visiteur paie : il mesure le pire cas et le présente comme le cas.

     Il rapporte donc DEUX chiffres, et les nomme :
       · `src`     → borne HAUTE (ce que reçoit un grand écran, ou un navigateur
                     sans `srcset`) — c'est le chiffre conservateur, celui qui juge
                     le seuil de 1 Mo ;
       · variante la plus légère déclarée → borne BASSE (ce qu'un mobile peut
                     recevoir). On ne prétend pas prédire le choix du navigateur
                     — il dépend de `sizes` et de la densité d'écran — on donne
                     l'encadrement, et on dit lequel des deux juge. */
  const legers = new Map();   // chemin du src -> variante la plus légère déclarée
  for (const m of code.matchAll(/<img\b[^>]*>/g)) {
    const balise = m[0];
    const src = (balise.match(/\bsrc=["']([^"']+)["']/) || [])[1];
    if (!src) continue;
    ajouter(src, 'image', page);
    const srcset = (balise.match(/\bsrcset=["']([^"']+)["']/) || [])[1];
    if (!srcset) continue;
    const candidats = srcset.split(',').map((c) => c.trim().split(/\s+/)[0]).filter(Boolean);
    if (!candidats.length) continue;
    // La plus légère : on la déduit du poids réel sur le disque, pas de sa largeur
    // annoncée — une variante plus étroite n'est pas forcément plus légère.
    let meilleur = null, meilleurPoids = Infinity;
    for (const c of candidats) {
      const abs = resoudre(c, page);
      if (!abs) continue;
      const p = poids(abs);
      if (p.disque > 0 && p.disque < meilleurPoids) { meilleurPoids = p.disque; meilleur = c }
    }
    if (meilleur) legers.set(resoudre(src, page), resoudre(meilleur, page));
  }

  // Les polices ne sont pas dans le HTML : elles sont citées par les feuilles de
  // style. On lit donc les CSS trouvées (et celles qu'elles importent).
  const cssAParcourir = [...trouvees.entries()].filter(([, p]) => p === 'style');
  const vues = new Set();
  while (cssAParcourir.length) {
    const [abs] = cssAParcourir.shift();
    if (vues.has(abs) || !existsSync(abs)) continue;
    vues.add(abs);
    const css = readFileSync(abs, 'utf8');
    for (const m of css.matchAll(/url\(\s*["']?([^"')]+)["']?\s*\)/g)) {
      const cible = resoudre(m[1], abs);
      if (cible && /\.woff2?$/i.test(cible)) ajouter(m[1], 'police', abs);
      else if (cible && /\.css$/i.test(cible)) ajouter(m[1], 'style', abs);
    }
  }
  return { trouvees, legers };
}

/* ─── mesure de toutes les pages ────────────────────────────────────────── */
const resultats = [];
for (const page of pages) {
  const { trouvees: ressources, legers } = ressourcesDe(page);
  // ⚠ LA PAGE ELLE-MÊME COMPTE DANS LE POIDS. Constaté le 13/09/2026 : trois
  // pages autonomes (`demo-conformite`, `demo-festival-metz`, `offline.html`)
  // ressortaient à « 0 requête, 0 Ko ». Le zéro était VRAI sur les requêtes —
  // elles n'ont aucune dépendance externe, tout leur style est inline — mais
  // FAUX sur le poids : leur HTML de 9 946 / 7 551 / 2 874 octets EST ce que le
  // visiteur télécharge. Un compteur à zéro prouve que le motif n'a rien trouvé,
  // pas que la page ne pèse rien.
  //
  // Le nombre de REQUÊTES reste celui de `verifier-requetes.mjs` (qui ne compte
  // pas le document, puisqu'il compte les sous-ressources) : on ajoute donc les
  // OCTETS du document, pas une requête — sinon les deux verrous se contrediraient.
  const soi = poids(page);
  let servi = soi.servi, disque = soi.disque, serviLege = soi.servi, disqueLege = soi.disque;
  for (const abs of ressources.keys()) {
    const p = poids(abs);
    servi += p.servi;
    disque += p.disque;
    // Borne basse : la variante la plus légère déclarée par le `srcset`, quand il
    // y en a un. Sinon on retombe sur le `src` — donc « lege === servi ».
    const alt = legers.get(abs);
    if (alt) {
      const pa = poids(alt);
      serviLege += pa.servi;
      disqueLege += pa.disque;
    } else {
      serviLege += p.servi;
      disqueLege += p.disque;
    }
  }
  resultats.push({ page: relative(DIST, page), n: ressources.size, servi, disque, serviLege, disqueLege, avecSrcset: legers.size });
}
resultats.sort((a, b) => b.servi - a.servi);

const totalDisque = resultats.reduce((s, r) => s + r.disque, 0);
const plusLourde = resultats[0];
const Mo = (o) => (o / 1024 / 1024).toFixed(3);
const Ko = (o) => (o / 1024).toFixed(1);

/* ─── rapport ───────────────────────────────────────────────────────────── */
console.log('='.repeat(72));
console.log('  Poids du PREMIER chargement, par page');
console.log('='.repeat(72));
console.log(`  build mesuré : dist/ (${statSync(accueil).mtime.toLocaleString('fr-FR')})`);
console.log(`  seuil        : ${SEUIL_MO} Mo par page  (signature qualité du studio)`);
console.log(`  pages        : ${pages.length}`);
console.log('');
console.log('  Textes compressés en gzip niveau 6 · binaires pris sur disque.');
console.log('  Compte d\'octets déterministe : ne dépend ni de la machine ni du GPU.');
console.log('');

if (DETAIL) {
  console.log('  page'.padEnd(46) + 'req'.padStart(5) + 'servi'.padStart(11) + 'mobile'.padStart(11) + 'disque'.padStart(11));
  for (const r of resultats) {
    const mob = r.avecSrcset ? (Ko(r.serviLege) + ' Ko') : '—';
    console.log('  ' + r.page.padEnd(44) + String(r.n).padStart(5) + (Ko(r.servi) + ' Ko').padStart(11) + mob.padStart(11) + (Ko(r.disque) + ' Ko').padStart(11));
  }
  console.log('');
  console.log('  « servi »  = borne HAUTE, celle qui JUGE le seuil : attribut `src` seul.');
  console.log('  « mobile » = borne BASSE, la variante la plus légère du `srcset` quand il y');
  console.log('               en a un. Le choix réel du navigateur dépend de `sizes` et de la');
  console.log('               densité d\'écran : on donne l\'encadrement, pas une prédiction.');
  console.log('');
}

let echecs = 0;
const dire = (ok, quoi, note = '') => {
  console.log(`  ${ok ? '[ok]' : '[KO]'}  ${quoi}${note ? '  — ' + note : ''}`);
  if (!ok) echecs++;
};

console.log(`  page la plus lourde : ${plusLourde.page}`);
console.log(`    ${plusLourde.n} requête(s) · ${Ko(plusLourde.servi)} Ko servis · ${Ko(plusLourde.disque)} Ko sur disque`);
console.log('');
dire(plusLourde.servi <= SEUIL, `${plusLourde.page} : ${Ko(plusLourde.servi)} Ko servis`,
  `seuil ${SEUIL_MO} Mo · marge ${Ko(SEUIL - plusLourde.servi)} Ko`);

const auDessus = resultats.filter((r) => r.servi > SEUIL);
if (auDessus.length) {
  console.log('');
  console.log(`  ${auDessus.length} page(s) au-dessus du seuil :`);
  for (const r of auDessus) console.log(`    · ${r.page} — ${Ko(r.servi)} Ko`);
}

// Une ressource citée par une page et ABSENTE du build est un défaut, pas un
// détail : la page demande un fichier que le serveur ne trouvera pas.
if (manquants.length) {
  console.log('');
  manquants.forEach((m) => dire(false, `ressource citée mais absente du build : ${relative(DIST, m)}`));
}

console.log('');
console.log(`  Rappel de lecture : ${Ko(totalDisque)} Ko sur disque pour les ${pages.length} pages réunies.`);
console.log('  Ce total n\'est PAS un poids de visite — plusieurs pages partagent les mêmes');
console.log('  chunks. Le chiffre qui juge est celui de la page la plus lourde, ci-dessus.');

if (echecs > 0) {
  console.log('');
  console.log(`  ❌ SEUIL FRANCHI : ${Ko(plusLourde.servi)} Ko > ${SEUIL_MO} Mo`);
  console.log('     On ne DESCEND PAS ce seuil : il vient de la signature qualité. Soit on');
  console.log('     allège la page, soit Gaëtan décide de changer la charte — et il le dit.');
  console.log('='.repeat(72));
  process.exit(1);
}

console.log('');
console.log('  Verrou de poids tenu.');
console.log('='.repeat(72));
process.exit(0);
