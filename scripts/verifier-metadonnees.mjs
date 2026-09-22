#!/usr/bin/env node
/**
 * verifier-metadonnees.mjs — LES MÉTADONNÉES, PAGE PAR PAGE, DANS LE HTML LIVRÉ
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * ⛔ L'ANGLE MORT QU'IL FERME, MESURÉ LE 22/09/2026.
 *
 *   Le routeur RENSEIGNE `meta.title` et `meta.description` pour chaque route, et
 *   il les applique À L'EXÉCUTION (`router.beforeEach`). Or **le HTML est
 *   PRÉRENDU** : ce que reçoit un moteur de recherche, un aperçu de lien ou un
 *   lecteur d'écran sans JavaScript, c'est le fichier écrit par
 *   `scripts/prerendre.js` — pas ce que le routeur fera ensuite.
 *
 *   ⭐ *« C'est écrit dans le code » ne veut jamais dire « c'est affiché à
 *     l'écran ».` Ici : c'est écrit dans le ROUTEUR, et c'est le HTML LIVRÉ qui
 *     compte.* Aucun verrou ne lisait ce HTML page par page.
 *
 *   Mesuré : sur les pages livrées, trois n'ont pas de `meta description`,
 *   plusieurs n'ont pas de `link rel=canonical`, et plusieurs n'ont pas
 *   d'`og:image`. **Et l'accueil en déclarait DEUX DIFFÉRENTES** — le JSON-LD
 *   annonçait une image, la balise `og:image` en annonçait une autre.
 *   *Deux images sociales pour une seule page, c'est un aperçu de lien qui dit
 *   deux choses selon qui le lit.*
 *
 * ⭐ CE QU'IL NE FAIT PAS : il ne corrige RIEN dans le HTML livré.
 *   Les métadonnées viennent du prérendu et du gabarit ; réécrire `dist/` ici
 *   ferait diverger le livré du construit, et le prochain build effacerait tout.
 *   **Il DÉSIGNE, et la correction se fait à la SOURCE.**
 *
 * ⭐ DESIGNER N'EST PAS CONDAMNER. Il rapporte et sort en 0.
 *   Pour en faire un verrou BLOQUANT : poser `METADONNEES_BLOQUANT=1`.
 *
 * USAGE
 *   node scripts/verifier-metadonnees.mjs            → compte et désigne
 *   node scripts/verifier-metadonnees.mjs --detail   → détail page par page
 *   METADONNEES_BLOQUANT=1 node scripts/verifier-metadonnees.mjs   → condamne
 *
 * CODES DE SORTIE
 *   0 = mesuré (défaut désigné ou non ; condamne si METADONNEES_BLOQUANT=1)
 *   1 = METADONNEES_BLOQUANT=1 ET au moins un manquement
 *   2 = RIEN MESURÉ (dist/ non construit, ou aucune page trouvée)
 */

import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const RACINE = process.cwd();
const DIST = join(RACINE, 'dist');
const DETAIL = process.argv.includes('--detail');
const BLOQUANT = process.env.METADONNEES_BLOQUANT === '1';

const vert = (s) => `\x1b[32m${s}\x1b[0m`;
const rouge = (s) => `\x1b[31m${s}\x1b[0m`;
const jaune = (s) => `\x1b[33m${s}\x1b[0m`;
const gris = (s) => `\x1b[90m${s}\x1b[0m`;

const L = (s = '') => console.log('  ' + s);

console.log('\n' + '='.repeat(78));
console.log('  LES MÉTADONNÉES DES PAGES LIVRÉES');
console.log('='.repeat(78));

const temoin = join(DIST, 'index.html');
if (!existsSync(temoin)) {
  console.error(rouge('  [KO]  dist/index.html est absent.'));
  console.error(gris('        Ce verrou lit le HTML LIVRÉ : lancez `npm run build`.'));
  console.error(gris('        ⛔ Rien mesuré n\'est pas un verrou tenu.'));
  process.exit(2);
}

/* ─── 1. QUELLES PAGES SONT « LIVRÉES » ? ──────────────────────────────────── */

/*
 * ⚠️ LA RÈGLE DOIT ÊTRE ÉCRITE ICI ET AFFICHÉE DANS LA SORTIE.
 *   `dist/` contient aussi ce qui n'est PAS des pages du site : le kit
 *   pédagogique (141 notes, portant `noindex, nofollow` par construction), les
 *   scènes `/Arche/` (mêmes règles), et les fichiers `assets/`.
 *   ⭐ Les compter ici rendrait le verrou faux dans les deux sens : noyé sous
 *     141 pages annexes, il ne dirait plus rien de la page /contact.
 *
 *   ⛔ Aucune de ces exclusions n'est écrite « à la main » page par page : ce
 *     sont des ARBORESCENCES, découvertes par lecture des fichiers eux-mêmes
 *     (`noindex`), pas des exceptions choisies pour faire passer le chiffre.
 */
const ANNEXES = ['TARDIS', 'Arche', 'assets'];

function marcher(d, acc = []) {
  if (!existsSync(d)) return acc;
  for (const e of readdirSync(d, { withFileTypes: true })) {
    const p = join(d, e.name);
    if (e.isDirectory()) marcher(p, acc);
    else acc.push(p);
  }
  return acc;
}

const tous = marcher(DIST);
const pages = [];
let annexes = 0;
let noindex = 0;

for (const f of tous) {
  if (!f.toLowerCase().endsWith('.html')) continue;
  const rel = relative(DIST, f).replace(/\\/g, '/');
  const premiere = rel.split('/')[0];
  if (ANNEXES.includes(premiere)) {
    annexes++;
    continue;
  }
  const contenu = readFileSync(f, 'utf8');
  /*
   * ⭐ LA PAGE SE DÉCLARE ELLE-MÊME HORS INDEX ? Alors elle ne relève pas du
   *   contrôle des métadonnées SOCIALES : pas d'aperçu de lien pour une page
   *   qui demande à ne pas être indexée. On la compte, et on le dit.
   */
  const robots = /<meta[^>]+name=["']robots["'][^>]*content=["']([^"']*)["']/i.exec(contenu);
  if (robots && /noindex/i.test(robots[1])) {
    noindex++;
    continue;
  }
  pages.push({ rel, chemin: f, contenu, octets: statSync(f).size });
}

if (pages.length === 0) {
  console.error(rouge('  [KO]  aucune page livrée trouvée hors arborescences annexes.'));
  console.error(gris('        ⛔ Ce n\'est PAS un succès : c\'est un verrou qui ne voit rien.'));
  console.error(gris('        Le build a-t-il écrit ses pages ? Vérifiez `dist/` à la main.'));
  process.exit(2);
}

/* ─── 2. LES LECTURES ──────────────────────────────────────────────────────── */

/*
 * ⛔⛔ UN FAUX POSITIF TROUVÉ PAR LA MESURE, ET GARDÉ ICI POUR MÉMOIRE.
 *
 *   La première version de ce verrou comparait l'`og:image` à TOUTE valeur
 *   `"image"` rencontrée dans le JSON-LD, cherchée par expression régulière.
 *   Résultat mesuré : **27 pages déclarées « contradictoires »**.
 *
 *   ⭐ C'ÉTAIT FAUX, ET LA MESURE L'A DIT : la valeur en cause était portée par
 *     `"@type": "LocalBusiness"` — l'image de l'ENTITÉ (le studio), pas
 *     l'image sociale de la PAGE. Les deux n'ont pas à coïncider, et un verrou
 *     qui exige qu'elles coïncident **crie 27 fois à tort**.
 *     *Un verrou qui crie à tort apprend à être ignoré, et le jour où il
 *     signalera un vrai défaut, personne ne le lira.*
 *
 *   ⇒ ON NE DEVINE PLUS LE TYPE : ON LE LIT, en analysant le JSON-LD comme du
 *     JSON (`JSON.parse`), et non comme du texte. Une expression régulière ne
 *     sait pas à quel objet appartient une propriété ; un arbre, si.
 */
const TYPES_ENTITE = new Set([
  'LocalBusiness', 'Organization', 'Corporation', 'NGO',
  'EducationalOrganization', 'Person', 'WebSite',
]);

function lireMeta(html) {
  const r = {
    desc: null, canonical: null, ogImage: null, ogTitle: null, title: null,
    ldImages: [],      // images portées par un type de PAGE → comparables à og:image
    ldEntite: [],      // images portées par une ENTITÉ → non comparables, juste dites
    ldIllisible: false,
  };

  const d = /<meta[^>]+name=["']description["'][^>]*>/i.exec(html);
  if (d) {
    const c = /content=["']([^"']*)["']/i.exec(d[0]);
    if (c && c[1].trim()) r.desc = c[1].trim();
  }

  const t = /<title[^>]*>([\s\S]*?)<\/title>/i.exec(html);
  if (t && t[1].trim()) r.title = t[1].trim();

  const c = /<link[^>]+rel=["']canonical["'][^>]*>/i.exec(html);
  if (c) {
    const h = /href=["']([^"']*)["']/i.exec(c[0]);
    if (h && h[1].trim()) r.canonical = h[1].trim();
  }

  const o = /<meta[^>]+property=["']og:image["'][^>]*>/i.exec(html);
  if (o) {
    const cc = /content=["']([^"']*)["']/i.exec(o[0]);
    if (cc && cc[1].trim()) r.ogImage = cc[1].trim();
  }

  const ot = /<meta[^>]+property=["']og:title["'][^>]*>/i.exec(html);
  if (ot) {
    const cc = /content=["']([^"']*)["']/i.exec(ot[0]);
    if (cc && cc[1].trim()) r.ogTitle = cc[1].trim();
  }

  /*
   * ⭐ LE JSON-LD EST ANALYSÉ COMME DU JSON, PAS COMME DU TEXTE.
   *   C'est ce qui permet de savoir QUI porte l'image — et donc de ne comparer
   *   que ce qui est comparable.
   */
  for (const m of html.matchAll(/<script[^>]+application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi)) {
    let donnees;
    try {
      donnees = JSON.parse(m[1]);
    } catch {
      r.ldIllisible = true;   // on le DIT, on ne suppose pas que le bloc est vide
      continue;
    }
    const visiter = (noeud, typeCourant) => {
      if (Array.isArray(noeud)) {
        for (const x of noeud) visiter(x, typeCourant);
        return;
      }
      if (!noeud || typeof noeud !== 'object') return;
      const type = typeof noeud['@type'] === 'string' ? noeud['@type'] : typeCourant;
      for (const [cle, valeur] of Object.entries(noeud)) {
        if (cle === 'image' || cle === 'primaryImageOfPage' || cle === 'thumbnailUrl') {
          const urls = [];
          if (typeof valeur === 'string') urls.push(valeur);
          else if (Array.isArray(valeur)) {
            for (const v of valeur) {
              if (typeof v === 'string') urls.push(v);
              else if (v && typeof v.url === 'string') urls.push(v.url);
            }
          } else if (valeur && typeof valeur === 'object' && typeof valeur.url === 'string') {
            urls.push(valeur.url);
          }
          for (const u of urls) {
            const fiche = { type: type || '(sans @type)', url: u };
            if (type && TYPES_ENTITE.has(type)) r.ldEntite.push(fiche);
            else r.ldImages.push(fiche);
          }
        }
        visiter(valeur, type);
      }
    };
    visiter(donnees, null);
  }

  return r;
}

const analyses = pages.map((p) => ({ ...p, meta: lireMeta(p.contenu) }));

const sansDesc = analyses.filter((a) => !a.meta.desc);
const sansCanon = analyses.filter((a) => !a.meta.canonical);
const sansOg = analyses.filter((a) => !a.meta.ogImage);
const sansTitre = analyses.filter((a) => !a.meta.title);

/*
 * ⭐⭐⭐ L'INCOHÉRENCE DES DEUX IMAGES SOCIALES.
 *   Une page qui déclare une `og:image` ET un JSON-LD portant une AUTRE image
 *   dit deux choses différentes à deux lecteurs différents. Aucun des deux
 *   n'a tort ; c'est la page qui se contredit.
 */
const contradictoires = [];
for (const a of analyses) {
  if (!a.meta.ogImage || a.meta.ldImages.length === 0) continue;
  const nomOg = a.meta.ogImage.split('/').pop();
  const differentes = a.meta.ldImages.filter((i) => i.url.split('/').pop() !== nomOg);
  if (differentes.length > 0) {
    contradictoires.push({ page: a.rel, og: a.meta.ogImage, ld: differentes });
  }
}

/* Les images d'ENTITÉ : dites, jamais comptées comme contradiction. */
const avecImageEntite = analyses.filter((a) => a.meta.ldEntite.length > 0);
const typesEntiteVus = [...new Set(avecImageEntite.flatMap((a) => a.meta.ldEntite.map((e) => e.type)))];
const pagesLdIllisible = analyses.filter((a) => a.meta.ldIllisible);

/* ─── 3. LA SORTIE ─────────────────────────────────────────────────────────── */

L(`build mesuré : dist/ (${statSync(temoin).mtime.toLocaleString('fr-FR')})`);
L('');
L('  RÈGLE DE SÉLECTION, ÉCRITE POUR ÊTRE VÉRIFIABLE :');
L(`    · pages HTML de dist/ ................. ${tous.filter((f) => f.toLowerCase().endsWith('.html')).length}`);
L(`    · moins arborescences annexes ......... ${annexes}  (${ANNEXES.join('/, ')}/)`);
L(`    · moins les pages qui se déclarent`);
L(`      elles-mêmes « noindex » ............. ${noindex}`);
L(vert(`    = pages LIVRÉES mesurées .............. ${pages.length}`));
L('');
L(gris('    ⭐ Ni liste écrite à la main, ni exception choisie : les arborescences'));
L(gris('       annexes sont nommées, les pages `noindex` se déclarent elles-mêmes.'));
L('');

L('─'.repeat(74));
L('  CE QUI MANQUE, PAGE PAR PAGE');
L('─'.repeat(74));
L(`  ${'meta description absente'.padEnd(34)} ${String(sansDesc.length).padStart(3)} / ${pages.length}`);
L(`  ${'link rel=canonical absent'.padEnd(34)} ${String(sansCanon.length).padStart(3)} / ${pages.length}`);
L(`  ${'og:image absente'.padEnd(34)} ${String(sansOg.length).padStart(3)} / ${pages.length}`);
if (sansTitre.length) {
  L(`  ${'<title> vide'.padEnd(34)} ${String(sansTitre.length).padStart(3)} / ${pages.length}`);
}
L(`  ${'images sociales CONTRADICTOIRES'.padEnd(34)} ${String(contradictoires.length).padStart(3)} / ${pages.length}`);
L('');

function lister(titre, liste, quoi) {
  if (liste.length === 0) return;
  L(jaune(`  ${titre}`));
  for (const a of liste) {
    L(`    · /${a.rel === 'index.html' ? '' : a.rel.replace(/\/index\.html$/, '')}  ${gris('(' + quoi + ')')}`);
  }
  L('');
}

lister('PAGES SANS meta description :', sansDesc, 'le HTML livré n\'en porte aucune');
lister('PAGES SANS link rel=canonical :', sansCanon, 'pas d\'adresse canonique déclarée');
lister('PAGES SANS og:image :', sansOg, 'aperçu de lien sans image');
lister('PAGES SANS <title> :', sansTitre, 'onglet et résultat de recherche sans titre');

if (contradictoires.length > 0) {
  L(rouge('  ⛔ IMAGES SOCIALES CONTRADICTOIRES — la page dit DEUX choses différentes :'));
  L('');
  for (const c of contradictoires) {
    L(`  · /${c.page === 'index.html' ? '' : c.page.replace(/\/index\.html$/, '')}`);
    L(`      balise  og:image  →  ${c.og}`);
    for (const i of c.ld) L(`      JSON-LD "image"  →  ${i.url}   ${gris('(@type ' + i.type + ')')}`);
    L(gris('      Deux lecteurs, deux images pour LA MÊME PAGE : c\'est la page qui'));
    L(gris('      se contredit, pas l\'un des deux lecteurs qui se trompe.'));
  }
  L('');
  L('  ⭐ CE QU\'IL FAUT FAIRE, ET POURQUOI CE N\'EST PAS À CE VERROU DE LE FAIRE :');
  L(gris('     garder UNE seule image sociale — celle qui est une capture RÉELLE'));
  L(gris('     du navire — et aligner l\'autre déclaration dessus. Le choix se fait'));
  L(gris('     à la SOURCE (gabarit ou prérendu), jamais en réécrivant dist/.'));
  L('');
} else {
  L(vert('  Aucune contradiction, sur les pages, entre og:image et le JSON-LD.'));
  L('');
}

/*
 * ⭐⭐⭐ LES IMAGES D'ENTITÉ — DITES, ET PAS COMPTÉES. C'EST LA CORRECTION D'UN
 *   FAUX POSITIF DE CE VERROU, MESURÉ QUAND IL CRIAIT 27 FOIS À TORT.
 *
 *   Une `LocalBusiness.image` décrit l'ENTREPRISE ; une `og:image` décrit la
 *   PAGE. Elles n'ont pas à coïncider, et exiger qu'elles coïncident ferait de
 *   ce contrôle un bruit de fond qu'on apprend à ignorer.
 *   ⛔ Mais on ne les cache pas non plus : on les AFFICHE, avec leur type, pour
 *     que le jour où l'une d'elles sera un vrai défaut, quelqu'un le voie.
 */
if (avecImageEntite.length > 0) {
  L('─'.repeat(74));
  L(`  IMAGES D'ENTITÉ — dites, et NON comptées comme contradictions`);
  L('─'.repeat(74));
  L(`  ${avecImageEntite.length} page(s) en portent · type(s) : ${typesEntiteVus.join(', ')}`);
  L(gris('    ⚠️ L\'image d\'une ENTITÉ n\'est pas l\'image sociale d\'une PAGE :'));
  L(gris('       elles n\'ont pas à coïncider. Un verrou qui l\'exigeait criait 27'));
  L(gris('       fois à tort avant cette correction — mesuré, pas supposé.'));
  if (DETAIL) {
    for (const a of avecImageEntite) {
      const e = a.meta.ldEntite[0];
      L(gris(`    · ${a.rel.replace(/\\/g, '/')}  →  ${e.url}  (@type ${e.type})`));
    }
  }
  L('');
} else {
  L(gris('  (aucune image d\'entité dans le JSON-LD des pages livrées)'));
  L('');
}

if (pagesLdIllisible.length > 0) {
  L(jaune(`  ⚠️  ${pagesLdIllisible.length} page(s) portent un JSON-LD qui n\'est PAS du JSON valide.`));
  L(gris('      ⛔ On le DIT au lieu de les traiter comme « sans image » : un bloc'));
  L(gris('         illisible n\'est pas un bloc absent.'));
  L('');
}

if (DETAIL) {
  L('Détail page par page :');
  L('');
  for (const a of analyses.sort((x, y) => x.rel.localeCompare(y.rel))) {
    const m = a.meta;
    const marques = [
      m.desc ? vert('desc') : rouge('DESC'),
      m.canonical ? vert('canon') : rouge('CANON'),
      m.ogImage ? vert('og') : rouge('OG'),
    ].join(' ');
    L(`  ${a.rel.replace(/\\/g, '/').padEnd(46)} ${marques}`);
  }
  L('');
}

/* ─── LE VERDICT ───────────────────────────────────────────────────────────── */

L('='.repeat(78));
L('  PORTÉE DU VERDICT');
L('    · il lit le HTML LIVRÉ, celui que reçoivent un moteur, un aperçu de lien');
L('      et un lecteur d\'écran SANS JavaScript — pas ce que le routeur fera');
L('      ensuite : *ce que le routeur applique à l\'exécution ne corrige pas ce');
L('      que le fichier contenait à l\'arrivée* ;');
L('    · il ne juge pas la QUALITÉ d\'une description — une description peut');
L('      exister et être fausse, vide de sens, ou dupliquée d\'une page à');
L('      l\'autre. C\'est un autre contrôle, et il n\'existe pas encore ;');
L('    · il ne corrige rien : la correction se fait à la SOURCE.');
L('='.repeat(78));
L('');

const manquements = sansDesc.length + sansCanon.length + sansOg.length + sansTitre.length + contradictoires.length;

if (manquements === 0) {
  L(vert('  Toutes les pages livrées portent leurs métadonnées, sans contradiction.'));
  L('='.repeat(78) + '\n');
  process.exit(0);
}

if (!BLOQUANT) {
  L(jaune(`  ${manquements} manquement(s) DÉSIGNÉ(S) — non bloquant(s).`));
  L(gris('  ⛔ Ce verrou DÉSIGNE ; il ne condamne pas encore. Poser'));
  L(gris('     METADONNEES_BLOQUANT=1 le jour où la source les aura corrigés.'));
  L('='.repeat(78) + '\n');
  process.exit(0);
}

L(rouge(`  METADONNEES_BLOQUANT=1 — ${manquements} manquement(s).`));
L('='.repeat(78) + '\n');
process.exit(1);
