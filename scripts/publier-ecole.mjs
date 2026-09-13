// ============================================================
// publier-ecole.mjs — GL Digital Lab — 13/09/2026
//
// Publie les dossiers pédagogiques sur le site, EN PAGE NON RÉPERTORIÉE.
//
// POURQUOI CE FICHIER EXISTE
// Demande de Gaëtan : « à mettre en place, non répertorié, à www.gldigitallab.fr/ ».
// Les documents vivent dans `ecole/dossiers-pedagogiques/*.md` (dépôt du studio). Les
// recopier à la main dans des pages HTML garantirait qu'ils divergent au premier
// correctif. **On les GÉNÈRE** : le Markdown reste la seule source, les pages web en
// découlent — même principe que `generer-sitemap.mjs`.
//
// ⚠️ « NON RÉPERTORIÉ » : CE QUE ÇA VEUT DIRE ICI, ET COMMENT C'EST FAIT
//   1. `noindex, nofollow` dans CHAQUE page générée. **Et surtout PAS de `Disallow`
//      dans robots.txt** : le `robots.txt` du site explique déjà pourquoi (correction du
//      10/09) — une exclusion de chemin empêche le robot de LIRE la page, donc de voir le
//      `noindex`. Interdire et demander de ne pas indexer, c'est se contredire.
//   2. Aucune entrée au `sitemap.xml` : le manifeste `src/config/topographie.js` porte
//      l'entrée avec `declaration: null`, ce qui est une DÉCISION écrite, pas un oubli.
//   3. Aucun lien depuis la navigation, le pied de page ou le plan du site. On y arrive
//      par l'adresse directe — comme les deux pages de démonstration du site.
//   Le patron existe déjà dans ce dépôt : `/demo-conformite` et `/demo-festival-metz`
//   sont des HTML statiques dans `public/`, hors routeur et hors sitemap. On le reprend.
//
// ⚠️ UN CONVERTISSEUR MAISON, ET IL DIT SES LIMITES
// Il n'y a AUCUN moteur Markdown dans les dépendances (coût, doctrine local-first : on
// n'ajoute pas une bibliothèque pour quatre documents). Ce convertisseur gère **le
// sous-ensemble réellement utilisé** par ces documents : titres, paragraphes, citations,
// listes, tableaux, règles, code inline, gras, italique, blocs de code. **Il n'est pas un
// convertisseur Markdown général** et ne prétend pas l'être — un document qui utiliserait
// des liens, des images ou des listes imbriquées sortirait faux.
//
// Usage : node scripts/publier-ecole.mjs
// ============================================================
import { readFileSync, writeFileSync, mkdirSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { createHash } from 'node:crypto';

const RACINE = process.cwd();

/*
 * OÙ SONT LES DOCUMENTS — ET POURQUOI IL Y EN A DEUX EMPLACEMENTS
 *
 * Les dossiers sont ÉCRITS dans le dépôt du studio (`C:\IA\gl-digital-lab\ecole\…`) et
 * PUBLIÉS par le dépôt du site. Ce sont deux dépôts distincts, sur deux arbres distincts :
 * un chemin relatif entre eux n'existe pas, et un chemin absolu rendrait le build
 * dépendant de cette machine-là.
 *
 * On publie donc depuis une COPIE locale (`ecole-dossiers/`), et on CONTRÔLE la copie :
 * si l'arbre du studio est présent à côté, on compare les empreintes et on AVERTIT quand
 * un document a changé d'un côté sans l'autre. *Une copie qui dérive en silence est
 * exactement le défaut qu'on vient de corriger quatre fois aujourd'hui.*
 */
const LOCAL = join(RACINE, 'ecole-dossiers');
const STUDIO = 'C:\\IA\\gl-digital-lab\\ecole\\dossiers-pedagogiques';

if (!existsSync(LOCAL)) {
  console.error('  Dossier source introuvable : ' + LOCAL);
  console.error('  (les documents publiés vivent dans le dépôt du site, dossier ecole-dossiers/)');
  process.exit(2);
}
const src = LOCAL;

/* ── Contrôle de divergence studio ↔ site ────────────────────────────────────── */
if (existsSync(STUDIO)) {
  const empreinte = (f) => createHash('sha256').update(readFileSync(f)).digest('hex').slice(0, 12);
  const ici = readdirSync(LOCAL).filter((f) => f.endsWith('.md'));
  const la = existsSync(STUDIO) ? readdirSync(STUDIO).filter((f) => f.endsWith('.md')) : [];
  const divergents = [];

  for (const f of ici) {
    const p2 = join(STUDIO, f);
    if (!existsSync(p2)) { divergents.push(f + '  (absent du dépôt du studio)'); continue; }
    if (empreinte(join(LOCAL, f)) !== empreinte(p2)) divergents.push(f + '  (contenu différent)');
  }
  for (const f of la) if (!ici.includes(f)) divergents.push(f + '  (présent au studio, non publié ici)');

  if (divergents.length) {
    console.log('');
    console.log('  ⚠️  DIVERGENCE entre les documents du studio et la copie publiée :');
    for (const d of divergents) console.log('      · ' + d);
    console.log('      Recopier depuis ' + STUDIO + ' vers ' + LOCAL + ' avant de publier,');
    console.log('      sinon le site servira une version périmée du dossier.');
    console.log('');
  } else {
    console.log('  copies identiques au dépôt du studio (' + ici.length + ' document(s))');
  }
} else {
  console.log('  (dépôt du studio non accessible depuis ici — contrôle de divergence sauté)');
}
console.log('  publication depuis : ' + LOCAL);

/*
 * OÙ ÇA SE PUBLIE — `/TARDIS/JoF/`
 *
 * Décision de Gaëtan (13/09/2026) : « à mettre en place, non répertorié, à
 * www.gldigitallab.fr/ » puis « gldigitallab.fr/TARDIS/JoF ».
 *
 * ⚠️ LA CASSE COMPTE. Le serveur est sous Linux : `/TARDIS/JoF` et `/tardis/jof` sont deux
 * adresses différentes. On écrit donc l'arborescence **exactement telle qu'elle a été
 * dictée**, et pas « en minuscules pour faire propre » — ce serait une adresse morte le
 * jour de la mise en ligne, et invérifiable depuis un poste Windows, qui lui ne distingue
 * pas la casse.
 */
const DEST = join(RACINE, 'public/TARDIS/JoF');
mkdirSync(DEST, { recursive: true });

/* ── Le convertisseur — sous-ensemble strict ─────────────────────────────────── */
const echapper = (t) => t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function enLigne(t) {
  return echapper(t)
    // `code` d'abord : sinon le gras à l'intérieur d'un code serait interprété.
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/(^|[\s(])\*([^*\n]+)\*/g, '$1<em>$2</em>');
}

function convertir(md) {
  const lignes = md.split('\n');
  const sortie = [];
  let i = 0;

  const viderTableau = (bloc) => {
    if (!bloc.length) return;
    const cellules = (l) => l.replace(/^\||\|$/g, '').split('|').map((c) => c.trim());
    const entetes = cellules(bloc[0]);
    // La deuxième ligne d'un tableau Markdown est la ligne de séparation `|---|---|`.
    const corps = bloc.slice(2).map(cellules);
    sortie.push('<table><thead><tr>' + entetes.map((c) => `<th>${enLigne(c)}</th>`).join('') + '</tr></thead>');
    sortie.push('<tbody>' + corps.map((r) => '<tr>' + r.map((c) => `<td>${enLigne(c)}</td>`).join('') + '</tr>').join('') + '</tbody></table>');
  };

  while (i < lignes.length) {
    const l = lignes[i];

    // Bloc de code
    if (l.trim().startsWith('```')) {
      const bloc = [];
      i++;
      while (i < lignes.length && !lignes[i].trim().startsWith('```')) { bloc.push(echapper(lignes[i])); i++; }
      i++;
      sortie.push('<pre><code>' + bloc.join('\n') + '</code></pre>');
      continue;
    }

    // Tableau
    if (l.trim().startsWith('|') && i + 1 < lignes.length && /^\s*\|[\s:|-]+\|/.test(lignes[i + 1])) {
      const bloc = [];
      while (i < lignes.length && lignes[i].trim().startsWith('|')) { bloc.push(lignes[i]); i++; }
      viderTableau(bloc);
      continue;
    }

    // Titres
    const titre = l.match(/^(#{1,4})\s+(.*)$/);
    if (titre) {
      const n = titre[1].length;
      sortie.push(`<h${n}>${enLigne(titre[2])}</h${n}>`);
      i++;
      continue;
    }

    // Règle horizontale
    if (/^---+$/.test(l.trim())) { sortie.push('<hr>'); i++; continue; }

    // Citation (multi-ligne)
    if (l.trim().startsWith('>')) {
      const bloc = [];
      while (i < lignes.length && lignes[i].trim().startsWith('>')) {
        bloc.push(lignes[i].replace(/^\s*>\s?/, ''));
        i++;
      }
      sortie.push('<blockquote>' + convertir(bloc.join('\n')) + '</blockquote>');
      continue;
    }

    // Liste à puces
    if (/^\s*[-·]\s+/.test(l)) {
      const items = [];
      while (i < lignes.length && /^\s*[-·]\s+/.test(lignes[i])) {
        items.push(enLigne(lignes[i].replace(/^\s*[-·]\s+/, '')));
        i++;
      }
      sortie.push('<ul>' + items.map((x) => `<li>${x}</li>`).join('') + '</ul>');
      continue;
    }

    // Liste numérotée
    if (/^\s*\d+\.\s+/.test(l)) {
      const items = [];
      while (i < lignes.length && /^\s*\d+\.\s+/.test(lignes[i])) {
        items.push(enLigne(lignes[i].replace(/^\s*\d+\.\s+/, '')));
        i++;
      }
      sortie.push('<ol>' + items.map((x) => `<li>${x}</li>`).join('') + '</ol>');
      continue;
    }

    // Ligne vide
    if (!l.trim()) { i++; continue; }

    // Paragraphe : on avale les lignes jusqu'à une ligne vide ou un nouveau bloc
    const para = [];
    while (i < lignes.length && lignes[i].trim() &&
           !/^(#{1,4}\s|>|\s*[-·]\s|\s*\d+\.\s|---+$|```|\|)/.test(lignes[i])) {
      para.push(lignes[i].trim());
      i++;
    }
    if (para.length) sortie.push('<p>' + enLigne(para.join(' ')) + '</p>');
  }
  return sortie.join('\n');
}

/* ── L'enveloppe : même charte que la page « soute », et le noindex ─────────── */
const enveloppe = (titre, corps, retour) => `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<!-- ⚠️ NON RÉPERTORIÉ — décision de Gaëtan, 13/09/2026.
     Cette page est volontairement absente du sitemap, de la navigation et du pied de page.
     Elle n'est atteignable que par son adresse directe. On l'indexe donc PAS.
     Et elle n'est PAS interdite dans robots.txt, volontairement : une exclusion de chemin
     empêcherait le robot de lire ce noindex, ce qui serait une contradiction. -->
<meta name="robots" content="noindex, nofollow">
<title>${titre} · Génie IT Tek FR</title>
<style>
  :root { color-scheme: dark; }
  * { box-sizing: border-box; }
  body {
    margin: 0; background: #03060a; color: #e8f0ec;
    font-family: 'Inter', system-ui, -apple-system, sans-serif;
    line-height: 1.75; padding: 3rem 1.25rem 6rem;
  }
  main { max-width: 46rem; margin: 0 auto; }
  .bandeau {
    font-family: ui-monospace, 'JetBrains Mono', monospace; font-size: 0.7rem;
    letter-spacing: 0.16em; text-transform: uppercase; color: #10b981;
    border: 1px dashed rgba(16,185,129,0.4); border-radius: 3px;
    padding: 0.5rem 0.75rem; margin-bottom: 2.5rem;
  }
  .bandeau strong { color: #e8f0ec; }
  h1 { font-size: clamp(1.9rem, 5vw, 2.8rem); line-height: 1.1; margin: 0 0 1.5rem; font-weight: 500; }
  h2 { font-size: 1.15rem; font-weight: 500; margin: 3rem 0 1rem; padding-bottom: 0.6rem; border-bottom: 1px solid rgba(16,185,129,0.22); }
  h3 { font-size: 1rem; font-weight: 600; margin: 2rem 0 0.75rem; color: #10b981; }
  h4 { font-size: 0.9rem; font-weight: 600; margin: 1.5rem 0 0.5rem; }
  p { color: #b9c9c2; margin: 0 0 1rem; }
  strong { color: #e8f0ec; }
  em { color: #cfe0d9; }
  a { color: #10b981; }
  a:focus-visible { outline: 2px solid #10b981; outline-offset: 2px; }
  code { font-family: ui-monospace, 'JetBrains Mono', monospace; font-size: 0.85em; background: rgba(255,255,255,0.06); padding: 0.1rem 0.3rem; border-radius: 2px; color: #e8f0ec; }
  pre { background: rgba(255,255,255,0.04); border-left: 2px solid rgba(16,185,129,0.4); padding: 1rem; overflow-x: auto; border-radius: 2px; }
  pre code { background: none; padding: 0; font-size: 0.8rem; line-height: 1.6; }
  blockquote { margin: 1.5rem 0; padding: 0.25rem 0 0.25rem 1.25rem; border-left: 2px solid #10b981; }
  blockquote p { color: #cfe0d9; margin-bottom: 0.5rem; }
  ul, ol { color: #b9c9c2; padding-left: 1.4rem; margin: 0 0 1.25rem; }
  li { margin-bottom: 0.4rem; }
  hr { border: none; border-top: 1px solid rgba(255,255,255,0.08); margin: 3rem 0; }
  table { border-collapse: collapse; width: 100%; margin: 1.25rem 0; font-size: 0.88rem; }
  th, td { text-align: left; padding: 0.6rem 0.7rem; border-bottom: 1px solid rgba(255,255,255,0.08); color: #b9c9c2; }
  th { color: #e8f0ec; font-weight: 600; }
  .sommaire { margin: 2rem 0 0; padding: 0; list-style: none; }
  .sommaire li { border-bottom: 1px solid rgba(255,255,255,0.06); }
  .sommaire a { display: block; padding: 0.7rem 0.25rem; text-decoration: none; }
  .sommaire a:hover { color: #34d399; }
  .retour { display: inline-block; margin-top: 3rem; font-family: ui-monospace, monospace; font-size: 0.78rem; }
</style>
</head>
<body>
<main>
<div class="bandeau">Page <strong>non répertoriée</strong> — hors plan du site et hors navigation</div>
${corps}
${retour ? `<a class="retour" href="${retour}">← Retour au sommaire</a>` : ''}
</main>
</body>
</html>
`;

/* ── Génération ──────────────────────────────────────────────────────────────── */
const fichiers = readdirSync(src).filter((f) => f.endsWith('.md')).sort();
const pages = fichiers.map((f) => {
  const nom = f.replace(/\.md$/, '');
  // `00-INDEX-360` devient la page d'accueil ; les autres deviennent `cycle-N.html`.
  const cible = nom.startsWith('00') ? 'index.html'
    : nom.replace(/^\d+-/, '').replace(/-\d{4}-\d{2}-\d{2}$/, '') + '.html';
  return { fichier: f, nom, cible };
});

const sommaire = pages.filter((p) => p.cible !== 'index.html');

for (const p of pages) {
  const md = readFileSync(join(src, p.fichier), 'utf8');
  const titre = (md.match(/^#\s+(.*)$/m) || [, p.nom])[1].trim();
  let corps = convertir(md);

  // Sur la page d'accueil, on insère le sommaire des documents APRÈS le premier titre.
  if (p.cible === 'index.html') {
    const liens = sommaire.map((s) => {
      const t = (readFileSync(join(src, s.fichier), 'utf8').match(/^#\s+(.*)$/m) || [, s.nom])[1].trim();
      return `<li><a href="${s.cible}">${enLigne(t)}</a></li>`;
    }).join('');
    corps = corps.replace(/(<\/h1>)/, `$1\n<ul class="sommaire">${liens}</ul>`);
  }

  writeFileSync(join(DEST, p.cible), enveloppe(titre, corps, p.cible === 'index.html' ? null : './'), 'utf8');
  console.log(`  écrit : public/TARDIS/JoF/${p.cible}  (depuis ${p.fichier})`);
}

console.log('');
console.log('  ⚠️  Ces pages portent `noindex, nofollow` et ne seront JAMAIS au sitemap.');
console.log('      Le manifeste src/config/topographie.js les déclare avec `declaration: null`.');
console.log('      Si vous voulez les rendre publiques un jour, il faudra DÉFAIRE ces trois choses.');
console.log('');
