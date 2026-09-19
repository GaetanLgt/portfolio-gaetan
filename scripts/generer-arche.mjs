// ============================================================
// generer-arche.mjs — GL Digital Lab — 14/09/2026
//   « Arche » — les scènes du vault Metroid, en HTML SANS SCRIPT.
//
// ⛔ POURQUOI IL N'Y A PAS DE 3D ICI, ET C'EST UNE MESURE, PAS UN AVIS
//   La demande portait des scènes 3D (Three.js) pour quatre fiches. La mesure a
//   tranché contre, et elle est chiffrée :
//     · trois.module.min.js ...................... 678 491 o
//     · + OrbitControls.js ....................... 710 741 o   → SOUS le verrou de 1 Mo
//   Donc LE POIDS PASSE. Ce qui ne passe pas, c'est la DÉPENDANCE :
//     · `three` est déclarée dans package.json (`^0.162.0`) — le critère du gabarit
//       dit « 0 script (ou sans dépendance) », et il est faux dès la première ligne.
//     · Et la page la plus lourde du kit pèse 37 136 o : la pile la multiplierait
//       par 19.
//   Décision : **la version HTML sans script**, qui coûte 0 o de script et 0
//   dépendance. C'est la doctrine du studio (« on n'ajoute pas une couche ») et
//   c'est aussi ce que la recommandation d'origine conseillait pour commencer.
//   ⚠️ Ce n'est PAS un renoncement : une frise HTML, un diagramme SVG inline et un
//   tableau disent la même relation qu'une scène — sans rien télécharger.
//
// ⛔ CE QUE CES PAGES NE FONT PAS
//   · Aucun modèle importé (`galion.glb` = 10 290 432 o, ×9,81 le verrou d'une page).
//   · Aucune ressource chargée : 0 `script`, 0 `link`, 0 `img`, 0 police distante.
//     Le CSS est en ligne, l'SVG est en ligne, les liens externes sont du texte.
//   · Aucun renvoi vers le kit `/TARDIS/JoF/` : citer une note se fait **par son nom**,
//     pas par un lien. Le kit est non répertorié, et on ne modifie pas sa joignabilité
//     depuis un autre espace.
//   · Aucune œuvre protégée : on décrit des jeux, on ne fournit ni image, ni logo,
//     ni extrait.
//
// USAGE : node scripts/generer-arche.mjs     (ou `npm run arche`)
// ============================================================
import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const RACINE = process.cwd();
const VAULT = 'C:\\Users\\neosp\\OneDrive\\Documents\\Metroid\\Vault-Metroid';
const DEST = join(RACINE, 'public/Arche');

if (!existsSync(VAULT)) {
  console.log('  (vault Metroid non accessible — génération de /Arche/ sautée)');
  process.exit(0);
}
mkdirSync(DEST, { recursive: true });

/* ── Lecture du vault : les 22 notes et leurs renvois ─────────────────────────── */
function listeMd(d, rel = '') {
  const out = [];
  for (const e of readdirSync(join(d, rel), { withFileTypes: true })) {
    if (e.name.startsWith('.')) continue;
    const r = rel ? rel + '/' + e.name : e.name;
    if (e.isDirectory()) out.push(...listeMd(d, r));
    else if (e.name.endsWith('.md')) out.push(r);
  }
  return out.sort((a, b) => a.localeCompare(b, 'fr'));
}

const notes = listeMd(VAULT).map((rel) => {
  const brut = readFileSync(join(VAULT, rel), 'utf8');
  const md = brut.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, '');
  const titre = (md.match(/^#\s+(.*)$/m) || [, rel])[1].replace(/^#+\s*/, '').trim();
  // Les `code` sont retirés : l'exemple de syntaxe du README n'est pas un renvoi.
  const liens = [...md.replace(/`[^`]*`/g, ' ').matchAll(/\[\[([^\[\]|#]+)/g)]
    .map((m) => m[1].trim().split('/').pop().toLowerCase());
  return { rel, cle: rel.replace(/\.md$/i, '').split('/').pop().toLowerCase(), titre, liens };
});

const parCle = new Map(notes.map((n) => [n.cle, n]));
const degre = new Map(notes.map((n) => [n.cle, { sortants: 0, entrants: 0, depuis: new Set() }]));

let renvoisTotal = 0;
let renvoisResolus = 0;
for (const n of notes) {
  for (const c of n.liens) {
    renvoisTotal++;
    const cible = parCle.get(c);
    if (!cible) continue;
    renvoisResolus++;
    degre.get(n.cle).sortants++;
    if (cible.cle !== n.cle) {
      degre.get(cible.cle).entrants++;
      degre.get(cible.cle).depuis.add(n.cle);
    }
  }
}
const notesTriees = [...notes].sort((a, b) => b.titre.localeCompare(a.titre, 'fr'));
const parEntrants = [...notes].sort((a, b) => degre.get(b.cle).entrants - degre.get(a.cle).entrants);

/* ── Le catalogue des scènes : 4, et le tri est écrit dans l'évaluation § 3.9 ──── */
const SCENES = [
  { fichier: 'carte.html', titre: 'La carte des renvois', relation: 'Qui cite qui — et ce que la densité révèle' },
  { fichier: 'chronologie.html', titre: 'Deux chronologies', relation: "L'ordre de sortie contre l'ordre du récit" },
  { fichier: 'licence.html', titre: 'La frise de la licence', relation: '1986 → 2027 : ce qui est sorti, et ce qui est annoncé' },
  { fichier: 'contradictions.html', titre: 'Les contradictions à deux branches', relation: 'Deux sources qui se contredisent ne sont pas deux erreurs' },
];

/* ── La charte, en ligne : 0 police distante, 0 feuille de style externe ───────── */
const CSS = `
  :root { color-scheme: dark; }
  * { box-sizing: border-box; }
  body { margin:0; background:#080b14; color:#eaf0f7;
    font-family: system-ui, -apple-system, 'Segoe UI', sans-serif;
    line-height:1.7; padding:3rem 1.25rem 6rem; }
  main { max-width:56rem; margin:0 auto; }
  .bandeau { font-family: ui-monospace, Consolas, monospace; font-size:.7rem;
    letter-spacing:.16em; text-transform:uppercase; color:#2abfff;
    border:1px dashed rgba(16,185,129,.4); border-radius:3px;
    padding:.5rem .75rem; margin-bottom:2.5rem; }
  .bandeau strong { color:#eaf0f7; }
  h1 { font-size:clamp(1.8rem,4.5vw,2.6rem); line-height:1.12; margin:0 0 1rem; font-weight:500; }
  h2 { font-size:1.1rem; font-weight:500; margin:3rem 0 1rem; padding-bottom:.6rem;
    border-bottom:1px solid rgba(16,185,129,.22); }
  h3 { font-size:.98rem; font-weight:600; margin:2rem 0 .6rem; color:#2abfff; }
  p, li { color:#a9b8cc; }
  strong { color:#eaf0f7; }
  em { color:#cfe0ec; }
  a { color:#2abfff; }
  a:focus-visible { outline:2px solid #2abfff; outline-offset:2px; }
  code { font-family: ui-monospace, Consolas, monospace; font-size:.86em;
    background:rgba(255,255,255,.06); padding:.1rem .3rem; border-radius:2px; color:#eaf0f7; }
  .lede { font-size:1.05rem; color:#cfe0ec; }
  table { border-collapse:collapse; width:100%; margin:1.25rem 0; font-size:.87rem; }
  th, td { text-align:left; padding:.55rem .65rem; border-bottom:1px solid rgba(255,255,255,.08); color:#a9b8cc; vertical-align:top; }
  th { color:#eaf0f7; font-weight:600; }
  td.num, th.num { text-align:right; font-family: ui-monospace, Consolas, monospace; }
  hr { border:none; border-top:1px solid rgba(255,255,255,.08); margin:3rem 0; }
  .sommaire { list-style:none; padding:0; margin:2rem 0 0; }
  .sommaire li { border-bottom:1px solid rgba(255,255,255,.06); }
  .sommaire a { display:block; padding:.7rem .2rem; text-decoration:none; }
  .sommaire small { display:block; color:#8496ad; font-size:.8rem; }
  .retour { display:inline-block; margin-top:3rem; font-family: ui-monospace, Consolas, monospace; font-size:.78rem; }
  .duo { display:grid; grid-template-columns:1fr 1fr; gap:1rem; margin:1.25rem 0; }
  .branche { border-left:2px solid rgba(16,185,129,.45); padding:.4rem 0 .4rem 1rem; }
  .branche p { margin:.2rem 0; }
  .verdict { border-left:2px solid #2abfff; padding:.4rem 0 .4rem 1rem; margin:.6rem 0 0; }
  .verdict p { color:#cfe0ec; }
  .frise { list-style:none; padding:0; margin:2rem 0; }
  .frise li { display:grid; grid-template-columns:5.5rem 1fr; gap:1rem; padding:.45rem 0;
    border-bottom:1px solid rgba(255,255,255,.06); }
  .frise .an { font-family: ui-monospace, Consolas, monospace; color:#2abfff; }
  .avenir { color:#8496ad; font-style:italic; }
  .mesure { border:1px solid rgba(16,185,129,.3); border-radius:4px; padding:1rem 1.25rem; margin:1.5rem 0; }
  .mesure p { margin:.35rem 0; }
  figure { margin:2rem 0; }
  figcaption { color:#8496ad; font-size:.8rem; margin-top:.6rem; }
  svg { max-width:100%; height:auto; }
  @media (max-width:640px) { .duo { grid-template-columns:1fr; } }
`;

const enveloppe = (titre, corps, retour) => `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<!-- ⚠️ NON RÉPERTORIÉ — même décision que le kit et les démonstrations du site :
     hors sitemap, hors navigation, hors pied de page, et « noindex » ici. Rien n'est
     interdit dans robots.txt : une exclusion empêcherait le robot de lire ce noindex.
     ⛔ 0 script, 0 ressource chargée — c'est le résultat de la mesure (voir index.html). -->
<meta name="robots" content="noindex, nofollow">
<title>${titre} · Arche · Génie IT Tek FR</title>
<style>${CSS}</style>
</head>
<body>
<main>
<div class="bandeau">Arche — <strong>non répertorié</strong> · 0 script · 0 ressource chargée</div>
${corps}
${retour ? `<a class="retour" href="${retour}">← Sommaire d'Arche</a>` : ''}
</main>
</body>
</html>
`;

/* ── L'accueil : ce que c'est, les 4 scènes, et POURQUOI il n'y a pas de 3D ───── */
const accueil = `<h1>Arche — les scènes du vault Metroid</h1>
<p class="lede">Quatre vues que les notes ne donnent pas à voir : un graphe, deux
chronologies, une frise, et des contradictions à deux branches. Tout est en HTML et en
SVG en ligne.</p>

<div class="mesure">
  <p><strong>Pourquoi il n'y a pas de scène 3D ici — et c'est une mesure, pas un goût.</strong></p>
  <p>La pile Three.js a été pesée sur le paquet installé : <code>three.module.min.js</code> =
  <strong>678 491 o</strong>, <code>+ OrbitControls.js</code> = <strong>710 741 o</strong>.
  <em>Le poids passe</em> : 710 741 o tient sous le verrou de 1 Mo (1 048 576 o), avec
  337 835 o de marge.</p>
  <p><strong>Ce qui ne passe pas, c'est la dépendance.</strong> Le critère du gabarit dit
  « 0 script (ou sans dépendance) » — or <code>three</code> est déclarée dans
  <code>package.json</code> (<code>^0.162.0</code>). Le critère est donc faux dès la
  première ligne, quel que soit le poids. Et la page la plus lourde du kit pèse
  <strong>37 136 o</strong> : la pile la multiplierait par <strong>19</strong>.</p>
  <p>⛔ Un modèle importé était exclu d'avance : <code>galion.glb</code> =
  <strong>10 290 432 o</strong>, soit <strong>×9,81</strong> le verrou d'une page.</p>
  <p><strong>Décision : la version HTML sans script</strong>, qui coûte <strong>0 o de
  script</strong> et <strong>0 dépendance</strong>. <em>Ce n'est pas un renoncement : une
  frise, un diagramme et un tableau disent la même relation, sans rien télécharger.</em></p>
</div>

<h2>Les quatre scènes</h2>
<ul class="sommaire">
${SCENES.map((s) => `  <li><a href="${s.fichier}">${s.titre}<small>${s.relation}</small></a></li>`).join('\n')}
</ul>

<h2>Le vault en chiffres — mesuré le 14/09/2026</h2>
<table>
<thead><tr><th>Mesure</th><th class="num">Valeur</th></tr></thead>
<tbody>
<tr><td>Notes du vault</td><td class="num">${notes.length}</td></tr>
<tr><td>Renvois <code>[[…]]</code> entre notes</td><td class="num">${renvoisTotal}</td></tr>
<tr><td>Renvois résolus vers une note existante</td><td class="num">${renvoisResolus}</td></tr>
<tr><td>Note la plus citée</td><td class="num">${parEntrants[0].titre} — ${degre.get(parEntrants[0].cle).entrants} renvois entrants</td></tr>
<tr><td>Note la plus citante</td><td class="num">${[...notes].sort((a, b) => degre.get(b.cle).sortants - degre.get(a.cle).sortants)[0].titre}</td></tr>
</tbody>
</table>

<h2>Ce qu'Arche n'est pas</h2>
<ul>
<li><strong>Ce n'est pas un cinquième kit.</strong> Le kit reste <code>/TARDIS/JoF/metroid/</code> :
c'est lui qui porte le savoir, les contrôles et le barème. Arche ne fait que <em>montrer</em>
quatre relations que le texte ne montre pas.</li>
<li><strong>Ce n'est pas une scène par fiche.</strong> Le tri a été fait et il est écrit :
<strong>4 scènes justifiées au maximum</strong>, et aucune avec modèle importé. Les autres notes
n'ont <em>aucune relation</em> à montrer — leur donner une scène serait du décor.</li>
<li><strong>Ce n'est pas en ligne.</strong> Le studio construit et mesure ; <em>publier est une
décision de Gaëtan</em>, et ce dépôt ne pousse pas.</li>
</ul>
`;

/* ── Scène 1 — le graphe des renvois, en SVG inline ───────────────────────────── */
{
  const R = 430, CX = 470, CY = 470;
  const N = notes.length;
  const pos = new Map(
    notes.map((n, i) => {
      const a = (i / N) * Math.PI * 2 - Math.PI / 2;
      return [n.cle, { x: CX + R * Math.cos(a), y: CY + R * Math.sin(a), a }];
    })
  );
  const maxEnt = Math.max(...notes.map((n) => degre.get(n.cle).entrants));
  const aretes = [];
  for (const n of notes) {
    for (const c of new Set(n.liens)) {
      const cible = parCle.get(c);
      if (!cible || cible.cle === n.cle) continue;
      const A = pos.get(n.cle), B = pos.get(cible.cle);
      aretes.push(`<line x1="${A.x.toFixed(0)}" y1="${A.y.toFixed(0)}" x2="${B.x.toFixed(0)}" y2="${B.y.toFixed(0)}" stroke="#2abfff" stroke-width="1" opacity="0.12"/>`);
    }
  }
  const noeuds = notes.map((n) => {
    const p = pos.get(n.cle);
    const e = degre.get(n.cle).entrants;
    const r = 5 + 11 * (e / maxEnt);
    const anc = Math.cos(p.a) >= 0 ? 'start' : 'end';
    const dx = Math.cos(p.a) >= 0 ? r + 8 : -(r + 8);
    return `<circle cx="${p.x.toFixed(0)}" cy="${p.y.toFixed(0)}" r="${r.toFixed(1)}" fill="#2abfff" fill-opacity="0.65" stroke="#080b14" stroke-width="2"/>` +
      `<text x="${(p.x + dx).toFixed(0)}" y="${(p.y + 4).toFixed(0)}" text-anchor="${anc}" font-size="15" fill="#cfe0ec">${n.titre.length > 34 ? n.titre.slice(0, 33) + '…' : n.titre} <tspan fill="#8496ad">${e}</tspan></text>`;
  });
  const svg = `<svg viewBox="0 0 940 940" role="img" aria-label="Graphe des renvois entre les ${N} notes du vault : chaque trait est un renvoi, la taille du point est le nombre de renvois entrants.">
${aretes.join('\n')}
${noeuds.join('\n')}
</svg>`;

  const corps = `<h1>La carte des renvois</h1>
<p class="lede">${renvoisTotal} renvois relient ${N} notes. <strong>Le point est gros quand la note
est citée</strong>, petit quand elle ne l'est pas — <em>et une note que personne ne cite est une
note qu'on ne relit pas.</em></p>
<figure>${svg}<figcaption>Chaque trait est un renvoi <code>[[…]]</code> ; le chiffre à côté du nom
est le nombre de renvois <strong>entrants</strong>. Disposition circulaire, sans physique : les
positions ne veulent rien dire, la densité si.</figcaption></figure>
<h2>Le classement, mesuré</h2>
<table>
<thead><tr><th>Note</th><th class="num">Citée par</th><th class="num">Cite</th><th>Qui la cite</th></tr></thead>
<tbody>
${parEntrants.map((n) => {
  const d = degre.get(n.cle);
  const q = [...d.depuis].map((c) => parCle.get(c).titre).join(' · ') || '—';
  return `<tr><td>${n.titre}</td><td class="num">${d.entrants}</td><td class="num">${d.sortants}</td><td>${q}</td></tr>`;
}).join('\n')}
</tbody>
</table>
<p><em>Ce que la carte dit et qu'aucune note ne dit : le vault a des notes très citées et des
notes terminales. Repérer les secondes est le seul moyen de savoir quoi relier ensuite.</em></p>`;

  writeFileSync(join(DEST, 'carte.html'), enveloppe('La carte des renvois', corps, './index.html'), 'utf8');
}

/* ── Scène 2 — les deux chronologies, en SVG inline ───────────────────────────── */
{
  const J = [
    ['Metroid', 1, 1], ['Metroid Prime', 2, 4], ['Prime Hunters', 3, 7], ['Prime 2: Echoes', 4, 6],
    ['Prime 3: Corruption', 5, 8], ['Federation Force', 6, 10], ['Metroid II', 7, 2],
    ['Super Metroid', 8, 3], ['Other M', 9, 9], ['Prime 4: Beyond', 10, 12],
    ['Fusion', 11, 5], ['Dread', 12, 11], ['Ravenous', 13, 13],
  ];
  const W = 940, H = 470, M = 70;
  const x = (p) => M + ((p - 1) / 12) * (W - 2 * M);
  const yRecit = 120, ySortie = 350;
  const lignes = J.map(([nom, r, s]) =>
    `<line x1="${x(r).toFixed(1)}" y1="${yRecit}" x2="${x(s).toFixed(1)}" y2="${ySortie}" stroke="#2abfff" stroke-width="1" opacity="0.28"/>` +
    `<circle cx="${x(r).toFixed(1)}" cy="${yRecit}" r="5" fill="#2abfff"/>` +
    `<circle cx="${x(s).toFixed(1)}" cy="${ySortie}" r="5" fill="#2abfff" fill-opacity="0.55"/>`
  ).join('\n');
  const etiquettes = J.map(([nom, r, s]) =>
    `<text x="${x(r).toFixed(1)}" y="${yRecit - 16}" text-anchor="middle" font-size="13" fill="#cfe0ec" transform="rotate(-38 ${x(r).toFixed(1)} ${yRecit - 16})">${nom}</text>` +
    `<text x="${x(s).toFixed(1)}" y="${ySortie + 30}" text-anchor="middle" font-size="13" fill="#8496ad" transform="rotate(-38 ${x(s).toFixed(1)} ${ySortie + 30})">${nom}</text>`
  ).join('\n');
  const svg = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Deux axes : en haut les treize positions du récit, en bas les mêmes jeux rangés par année de sortie, reliés par un trait.">
<text x="${M - 60}" y="${yRecit - 40}" font-size="14" fill="#eaf0f7">récit</text>
<text x="${M - 60}" y="${ySortie + 60}" font-size="14" fill="#eaf0f7">sortie</text>
${lignes}
${etiquettes}
</svg>`;

  const corps = `<h1>Deux chronologies, et elles ne se ressemblent pas</h1>
<p class="lede">En haut, les treize positions du <strong>récit</strong>. En bas, les mêmes jeux
rangés par <strong>année de sortie</strong>. <em>Les traits qui se croisent sont exactement le
sujet : ce n'est pas parce qu'un jeu sort après un autre qu'il se passe après lui.</em></p>
<figure>${svg}<figcaption>Relevé de la note <code>02-la-chronologie-interne</code> § 1 (vault
Metroid, 14/09/2026).</figcaption></figure>
<h2>Ce que la figure montre</h2>
<ul>
<li><strong>Le bloc <em>Prime</em> est le grand écart.</strong> Cinq jeux sortis entre 2002 et 2016
se placent, dans le récit, <strong>entre <em>Metroid</em> (1986) et <em>Metroid II</em> (1991)</strong>.
À sa sortie en 2002, <em>Metroid Prime</em> est reçu comme une <strong>préquelle</strong>, pas comme
une suite.</li>
<li><strong><em>Other M</em> (2010) saute en fin de récit</strong> : sorti après <em>Prime 3</em>
(2007), il se déroule après <em>Super Metroid</em> (1994).</li>
<li><strong><em>Prime 4: Beyond</em> (2025)</strong> porte un titre de la branche <em>Prime</em> et
se place pourtant <strong>après <em>Super Metroid</em>, avant <em>Fusion</em></strong>.</li>
</ul>
<h2>Et ce qui est officiel, ou pas</h2>
<table>
<thead><tr><th>Affirmation</th><th>Statut</th></tr></thead>
<tbody>
<tr><td>Ligne 2D : <em>Metroid</em> → <em>II</em> → <em>Super</em> → <em>Fusion</em> → <em>Dread</em></td><td><strong>Officiel Nintendo</strong> — rapports <em>Dread</em> vol. 4, 6 août 2021</td></tr>
<tr><td><em>Prime 4: Beyond</em> après <em>Super Metroid</em>, avant <em>Fusion</em></td><td><strong>Officiel Nintendo</strong> — déclaration de l'équipe à <em>Famitsu</em>, décembre 2025</td></tr>
<tr><td>Le bloc <em>Prime</em> entre <em>Metroid</em> et <em>Metroid II</em></td><td><strong>Reconstitué</strong> — répété partout, jamais lu dans un document Nintendo</td></tr>
<tr><td>L'ordre <em>Other M</em> ↔ <em>Prime 4</em></td><td><strong>Non tranché</strong></td></tr>
<tr><td>La place de <em>Ravenous</em> dans le récit</td><td><strong>Non vérifié</strong> au 14/09/2026</td></tr>
</tbody>
</table>
<p><em>Savoir dire « cette partie est reconstituée » est la réponse exacte — pas une faiblesse.</em></p>`;

  writeFileSync(join(DEST, 'chronologie.html'), enveloppe('Deux chronologies', corps, './index.html'), 'utf8');
}

/* ── Scène 3 — la frise 1986 → 2027, en HTML pur (0 Ko) ───────────────────────── */
{
  const J = [
    [1986, 'Metroid', 'Famicom Disk System (Japon) — la NES en 1987 pour le reste du monde'],
    [1991, 'Metroid II: Return of Samus', 'Game Boy'],
    [1994, 'Super Metroid', 'Super Nintendo — la carte apparaît enfin'],
    [2002, 'Metroid Prime', 'GameCube — la 3D sort du Japon pour la première fois'],
    [2002, 'Metroid Fusion', 'Game Boy Advance — sorti le même jour que <em>Prime</em>'],
    [2004, 'Metroid: Zero Mission', 'Game Boy Advance — remake du 1'],
    [2004, 'Metroid Prime 2: Echoes', 'GameCube'],
    [2005, 'Metroid Prime Pinball', 'Nintendo DS — dérivé (flipper)'],
    [2006, 'Metroid Prime Hunters', 'Nintendo DS'],
    [2007, 'Metroid Prime 3: Corruption', 'Wii'],
    [2009, 'Metroid Prime: Trilogy', 'Wii — compilation, pas un épisode'],
    [2010, 'Metroid: Other M', 'Wii'],
    [2016, 'Metroid Prime: Federation Force', 'Nintendo 3DS'],
    [2017, 'Metroid: Samus Returns', 'Nintendo 3DS — remake du 2'],
    [2021, 'Metroid Dread', 'Nintendo Switch — meilleure vente de la licence (2,9 M)'],
    [2023, 'Metroid Prime Remastered', 'Nintendo Switch — remaster, pas un remake'],
    [2025, 'Metroid Prime 4: Beyond', 'Switch et Switch 2 — même jour'],
  ];
  const corps = `<h1>La frise de la licence — 1986 → 2027</h1>
<p class="lede">Dix-sept jeux sortis, un annoncé. <em>Et un chiffre qui ne se stabilise pas :
« combien de jeux ? » dépend d'une règle de comptage que personne n'écrit.</em></p>
<ul class="frise">
${J.map(([a, t, n]) => `  <li><span class="an">${a}</span><span><strong>${t}</strong><br><small>${n}</small></span></li>`).join('\n')}
  <li><span class="an avenir">2027</span><span class="avenir"><strong>Metroid Ravenous</strong> — annoncé, Nintendo Switch 2 exclusivement, <strong>28 janvier 2027</strong></span></li>
</ul>
<h2>Les cinq chiffres, et ils sont tous défendables</h2>
<table>
<thead><tr><th class="num">Chiffre</th><th>La règle qui le produit</th></tr></thead>
<tbody>
<tr><td class="num">16</td><td>titres parus, hors compilation — ce que dit Wikipédia FR</td></tr>
<tr><td class="num">17</td><td>en comptant la compilation <em>Prime: Trilogy</em></td></tr>
<tr><td class="num">18</td><td>en ajoutant le titre à venir — <em>la valeur du vault</em></td></tr>
<tr><td class="num">13</td><td>hors dérivés et hors remakes</td></tr>
<tr><td class="num">11</td><td>Wikipédia EN, règle implicite et <strong>périmée</strong> (n'intègre ni <em>Beyond</em> ni <em>Ravenous</em>)</td></tr>
</tbody>
</table>
<p><strong>La leçon tient en une phrase</strong> : <em>demander la règle avant le chiffre, c'est déjà
de la méthode.</em> Et l'écart est systématique : depuis 2018, Wikipédia FR annonce un jeu de moins
qu'elle n'en liste — le titre exclu est la compilation.</p>
<p>⛔ <strong>Aucune œuvre n'est reproduite ici</strong> : ni boîte, ni logo, ni capture, ni extrait.
On décrit, on ne fournit pas.</p>`;

  writeFileSync(join(DEST, 'licence.html'), enveloppe('La frise de la licence', corps, './index.html'), 'utf8');
}

/* ── Scène 4 — les contradictions à deux branches ─────────────────────────────── */
{
  const CAS = [
    ['C1', 'Le premier <em>Metroid</em> date de <strong>1986</strong>.', 'Il date de <strong>1987-88</strong>.',
      'Les deux sont vraies : elles ne parlent pas du même pays. <strong>1986</strong> = la sortie japonaise (6 août 1986, Famicom Disk System) ; <strong>1987</strong> = la NES pour le reste du monde.'],
    ['C2', '<em>Prime 3: Corruption</em> a été <strong>bien accueilli</strong>.', 'C\'est <strong>la rupture</strong> — un bon jeu, mais un mauvais Metroid.',
      'Les deux tiennent : elles parlent de deux étages. La <strong>critique</strong> : Metacritic <strong>90</strong>. Le <strong>marché</strong> : <strong>32 388</strong> exemplaires la première semaine au Japon.'],
    ['C3', 'Ridley est tué dans <em>Super Metroid</em> (Wikipédia <strong>EN</strong>).', 'Le Ridley d\'origine meurt dans <em>Prime 3</em> (Wikipédia <strong>FR</strong>).',
      '<strong>EN a raison, FR a tort</strong> — tranché le 14/09/2026. La mort véritable est celle de <em>Super Metroid</em> (1994) ; les jeux <em>Prime</em> se déroulent <strong>avant</strong>. La source unique de la section FR est un <strong>site personnel mort (HTTP 404)</strong>.'],
    ['C4', '<em>Federation Force</em> s\'intercale <strong>entre les deux premiers <em>Prime</em></strong>.', 'Il se place <strong>après <em>Prime 3</em></strong>.',
      '<strong>Tranché par une source PRIMAIRE</strong> : la page produit officielle de Nintendo écrit « An 20X6 du calendrier cosmique : de nombreuses années ont passé depuis les hauts faits de Samus Aran sur la planète <strong>Phaaze</strong> » — et Phaaze est détruit à la fin de <em>Prime 3</em>. Les <strong>deux sources citées</strong> par Wikipédia FR disent l\'inverse de ce que l\'article leur fait dire.'],
    ['C5', 'Metroid est <strong>inconnu du grand public</strong>.', 'Metroid a des <strong>chiffres de ventes</strong> et une audience mesurée.',
      '<strong>La question était mal posée.</strong> La notoriété <strong>se mesure</strong> — Mario <strong>82 %</strong>, Zelda <strong>64 %</strong>, Pikachu <strong>85 %</strong> — et <em>Metroid</em> et Samus sont <strong>absents de tous les baromètres publics consultés</strong>. La seule mesure existante est <strong>payante</strong> (E-Poll, 995 $). <em>L\'absence est une mesure.</em>'],
  ];
  const corps = `<h1>Les contradictions à deux branches</h1>
<p class="lede">Cinq cas où deux sources se contredisent. <strong>Aucun n'a résisté à une
vérification à la source</strong> — et la leçon n'est pas « qui a raison » mais <em>« laquelle est la
mieux sourcée, et pourquoi »</em>.</p>
${CAS.map(([id, a, b, v]) => `<h2>${id}</h2>
<div class="duo">
  <div class="branche"><p><strong>Branche A</strong></p><p>${a}</p></div>
  <div class="branche"><p><strong>Branche B</strong></p><p>${b}</p></div>
</div>
<div class="verdict"><p><strong>Verdict du 14/09/2026</strong> — ${v}</p></div>`).join('\n')}
<h2>Trois issues différentes, et c'est cela qui s'enseigne</h2>
<table>
<thead><tr><th>Issue</th><th>Cas</th></tr></thead>
<tbody>
<tr><td><strong>Deux sources qui ne parlaient pas du même pays</strong></td><td>C1</td></tr>
<tr><td><strong>Deux étages différents</strong> — le jeu, puis le marché</td><td>C2</td></tr>
<tr><td><strong>Tranchés par la source</strong></td><td>C3, C4</td></tr>
<tr><td><strong>Une question mal posée</strong></td><td>C5</td></tr>
</tbody>
</table>
<p><strong>C3 était annoncé comme non tranchable — et il l'était</strong>, jusqu'à ce qu'on ouvre la
source de la partie adverse et qu'on la trouve <strong>morte</strong>. <em>Une contradiction n'est
presque jamais deux erreurs : c'est le plus souvent une source qu'on n'a pas ouverte.</em></p>`;

  writeFileSync(join(DEST, 'contradictions.html'), enveloppe('Les contradictions à deux branches', corps, './index.html'), 'utf8');
}

/* ── L'accueil ────────────────────────────────────────────────────────────────── */
mkdirSync(DEST, { recursive: true });
writeFileSync(join(DEST, 'index.html'), enveloppe('Arche — les scènes du vault Metroid', accueil, null), 'utf8');

/* ── La mesure de sortie : ce qui a été écrit, et ce qu'on y charge ───────────── */
const ecrites = SCENES.map((s) => s.fichier).concat('index.html');
console.log('  Arche — écrit dans public/Arche/ :');
let total = 0, scripts = 0, ressources = 0;
for (const f of ecrites) {
  const t = readFileSync(join(DEST, f), 'utf8');
  const o = Buffer.byteLength(t, 'utf8');
  total += o;
  if (/<script/i.test(t)) scripts++;
  if (/<link\b|<img\b/i.test(t)) ressources++;
  console.log(`    ${f.padEnd(22)} ${String(o).padStart(7)} o`);
}
console.log(`    ${'TOTAL'.padEnd(22)} ${String(total).padStart(7)} o`);
console.log(`  pages avec <script> : ${scripts} / ${ecrites.length}`);
console.log(`  pages chargeant une ressource (<link>|<img>) : ${ressources} / ${ecrites.length}`);
console.log(`  ${notes.length} notes · ${renvoisTotal} renvois · ${renvoisResolus} résolus — source : le vault Metroid`);
console.log('  ⛔ Aucune 3D, aucun modèle importé : la dépendance `three` ne passe pas le critère du gabarit.');
