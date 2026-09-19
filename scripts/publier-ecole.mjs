// ============================================================
// publier-ecole.mjs — GL Digital Lab — 13/09/2026
//   étendu le 14/09/2026 : publication des KITS (sous-dossiers) et des renvois [[…]]
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
// listes, tableaux, règles, code inline, gras, italique, blocs de code, et depuis le
// 14/09 les renvois Obsidian `[[cible]]` / `[[cible|texte]]`. **Il n'est pas un
// convertisseur Markdown général** et ne prétend pas l'être — un document qui utiliserait
// des liens Markdown, des images ou des listes imbriquées sortirait faux.
//
// ⚠️ EXTENSION DU 14/09/2026 — LES KITS PÉDAGOGIQUES (sous-dossiers)
//   1. Un SOUS-DOSSIER de `ecole-dossiers/` est un KIT. Il devient un dossier publié :
//      `public/TARDIS/JoF/<kit>/index.html` + une page par note, les sous-dossiers du
//      kit étant CONSERVÉS (`fiches/` reste `fiches/`), parce que la structure du dépôt
//      est une information, pas un détail de rangement.
//   2. Les RENVOIS OBSIDIAN `[[cible]]` / `[[cible|texte]]` deviennent des liens vers la
//      page générée **si la note cible fait partie du même kit publié**, et du TEXTE SEUL
//      sinon. *Sur une page publique, un renvoi mort est pire que pas de renvoi* : un
//      lecteur qui tombe sur un 404 en conclut que le site est cassé, alors qu'un nom sans
//      lien se lit simplement comme un nom. Le script COMPTE et AFFICHE les deux cas.
//   3. Le FRONTMATTER YAML des notes (`---`, `tags:`, `statut:`…) est RETIRÉ : c'est de la
//      métadonnée Obsidian, pas du contenu destiné à un lecteur. **Les cinq documents à
//      plat n'en ont pas** — le retrait ne change donc rien pour eux (vérifié par
//      empreinte après coup).
//   4. Les documents À PLAT (`*.md` à la racine de `ecole-dossiers/`) gardent EXACTEMENT
//      le comportement d'origine : mêmes noms de pages, même sommaire. Seul l'accueil
//      gagne une ligne, celle qui liste le kit.
//
// Usage : node scripts/publier-ecole.mjs
// ============================================================
import { readFileSync, writeFileSync, mkdirSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
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

/* Liste récursive des `.md`, en chemins relatifs à `/`, sous-dossiers compris.
 * `.obsidian/` et tout dossier commençant par un point sont IGNORÉS : c'est de la
 * configuration d'éditeur, pas du contenu publiable. */
function listeMd(racine) {
  const trouves = [];
  const parcourir = (rel) => {
    const abs = rel ? join(racine, rel) : racine;
    if (!existsSync(abs)) return;
    for (const e of readdirSync(abs, { withFileTypes: true })) {
      if (e.name.startsWith('.')) continue;
      const r = rel ? rel + '/' + e.name : e.name;
      if (e.isDirectory()) parcourir(r);
      else if (e.name.endsWith('.md')) trouves.push(r);
    }
  };
  parcourir('');
  return trouves.sort((a, b) => a.localeCompare(b, 'fr'));
}

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

/* ── Contrôle de divergence VAULT METROID ↔ copie du kit ───────────────────────
 * Le contrôle ci-dessus ne regarde QUE la racine de `ecole-dossiers/` : il ne descend pas
 * dans les sous-dossiers. Or un kit vit justement dans un sous-dossier — sans cette
 * seconde comparaison, `ecole-dossiers/metroid/` pourrait publier une version périmée du
 * vault sans que rien ne le signale. Même logique, même avertissement, un niveau plus bas.
 *
 * Le vault est dans OneDrive et ne doit JAMAIS être modifié par ce script : il est LU.
 */
const KIT_SOURCE = 'C:\\Users\\neosp\\OneDrive\\Documents\\Metroid\\Vault-Metroid';
const KIT_LOCAL = join(LOCAL, 'metroid');

if (existsSync(KIT_SOURCE) || existsSync(KIT_LOCAL)) {
  const empreinte = (f) => createHash('sha256').update(readFileSync(f)).digest('hex').slice(0, 12);
  const ici = existsSync(KIT_LOCAL) ? listeMd(KIT_LOCAL) : [];
  const la = existsSync(KIT_SOURCE) ? listeMd(KIT_SOURCE) : [];
  const divergents = [];

  for (const f of ici) {
    const p2 = join(KIT_SOURCE, f);
    if (!existsSync(p2)) { divergents.push(f + '  (absent du vault)'); continue; }
    if (empreinte(join(KIT_LOCAL, f)) !== empreinte(p2)) divergents.push(f + '  (contenu différent)');
  }
  for (const f of la) if (!ici.includes(f)) divergents.push(f + '  (présent dans le vault, non copié ici)');

  if (divergents.length) {
    console.log('');
    console.log('  ⚠️  DIVERGENCE entre le vault Metroid et le kit copié (ecole-dossiers/metroid) :');
    for (const d of divergents) console.log('      · ' + d);
    console.log('      Recopier depuis ' + KIT_SOURCE);
    console.log('      vers ' + KIT_LOCAL + ' avant de publier,');
    console.log('      sinon le site servira une version périmée du kit.');
    console.log('');
  } else if (ici.length) {
    console.log('  kit metroid : ' + ici.length + ' note(s), copies identiques au vault');
  }
} else {
  console.log('  (vault Metroid non accessible depuis ici — contrôle de divergence du kit sauté)');
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

/* ── Le frontmatter Obsidian est retiré ──────────────────────────────────────── */
function retirerFrontmatter(md) {
  const bloc = md.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
  if (!bloc) return md;
  // Garde-fou : un vrai frontmatter tient en quelques lignes et n'a pas de ligne vide.
  // Sans lui, un document qui COMMENCE par une règle horizontale et en contient une autre
  // plus bas verrait son début avalé. (Les cinq documents à plat n'ont pas de frontmatter :
  // ce retrait ne les touche pas — c'est vérifié par empreinte, pas supposé.)
  if (/^[ \t]*$/m.test(bloc[1]) || bloc[1].split('\n').length > 25) return md;
  return md.slice(bloc[0].length);
}

/* ── Renvois Obsidian `[[cible]]` / `[[cible|texte]]` ────────────────────────────
 * Le contexte `renvois` est posé pendant la conversion d'UNE note. Hors de ce contexte
 * (`renvois === null`, c'est le cas des documents à plat), un `[[…]]` reste le texte brut
 * d'origine : aucun lien n'est fabriqué sans savoir si sa cible est publiée.
 */
let renvois = null;
let liensExternes = 0;   // comptés à la conversion, affichés au bilan (mesuré, pas supposé)
const nouveauBilan = () => ({ notes: 0, repares: 0, liens: 0, texte: 0, proteges: 0, nonResolus: [], protegesListe: [] });

function lienRelatif(depuisPage, versPage) {
  const depuis = depuisPage.split('/').slice(0, -1);
  const vers = versPage.split('/');
  const fichier = vers.pop();
  let i = 0;
  while (i < depuis.length && depuis[i] === vers[i]) i++;
  return [...depuis.slice(i).map(() => '..'), ...vers.slice(i), fichier].join('/');
}

/* ── Le convertisseur — sous-ensemble strict ─────────────────────────────────── */
const echapper = (t) => t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function enLigne(t) {
  let s = echapper(t);

  // Les `code` sont mis de côté AVANT tout le reste : leur contenu ne doit être
  // réinterprété ni par le gras, ni par l'italique, ni par les renvois. Le README du
  // vault contient l'EXEMPLE de syntaxe `[[questions-ouvertes]]` — s'il devenait un lien,
  // l'exemple ne montrerait plus la syntaxe qu'il est justement là pour montrer.
  const codes = [];
  s = s.replace(/`([^`]+)`/g, (m, contenu) => {
    if (renvois && contenu.includes('[[')) {
      renvois.bilan.proteges++;
      renvois.bilan.protegesListe.push({ note: renvois.depuis, extrait: contenu.trim() });
    }
    codes.push('<code>' + contenu + '</code>');
    return '\u0001' + (codes.length - 1) + '\u0001';
  });

  s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  s = s.replace(/(^|[\s(])\*([^*\n]+)\*/g, '$1<em>$2</em>');

  /* ── Les liens vers l'extérieur — `[texte](https://…)` ET l'URL nue ─────────────
   * ⚠️ POURQUOI CES DEUX PASSES EXISTENT (14/09/2026). Un kit MONTRE ses sources : c'est
   * son troisième élément (`ecole/kits-pedagogiques-PASSE-0-inventaire-2026-09-14.md` § 3).
   * Laissées en syntaxe Markdown brute, elles donnaient des tableaux de sources illisibles —
   * `[Wikipédia FR, Metroid](https://…)`, crochets et parenthèses compris. Mesuré sur le kit
   * pilote : 243 liens Markdown + 1 URL nue.
   *
   * **Un lien n'est PAS une ressource chargée.** Rien ne se télécharge tant qu'on ne clique
   * pas : la page s'ouvre toujours hors ligne, et le critère du studio reste « 0 ressource
   * CHARGÉE » (police, script, feuille de style, image). *Le mot compte : c'est lui qui
   * décide si un lien vers Wikipédia fait tomber le critère ou non.*
   *
   * Pas de `target="_blank"` : ouvrir une fenêtre sans le dire est un défaut d'accessibilité.
   *
   * L'URL nue est traitée AVANT les liens Markdown, et c'est volontaire : dans
   * `[texte](https://…)`, l'URL est précédée de `](`, et ce motif-ci n'accepte devant elle
   * qu'un blanc, un `|` ou un `>`. Elle ne peut donc pas être convertie deux fois.
   * Les 12 URL qui contiennent des parenthèses (pages Wikipédia) sont prises en charge. */
  s = s.replace(/(^|[\s|>])(https?:\/\/[^\s<)|]+)/g, (m, avant, url) => {
    liensExternes++;
    return avant + '<a href="' + url + '">' + url + '</a>';
  });
  s = s.replace(/\[([^\]\n]+)\]\((https?:\/\/[^\s)]+(?:\([^\s)]*\)[^\s)]*)*)\)/g, (m, texte, url) => {
    liensExternes++;
    return '<a href="' + url + '">' + texte + '</a>';
  });

  // Les renvois EN DERNIER : le HTML du lien ne doit pas repasser dans le gras.
  // Le texte capturé vient d'être échappé — on ne le ré-échappe donc pas (ce serait un
  // double échappement, `&` deviendrait `&amp;amp;`).
  if (renvois) {
    s = s.replace(/\[\[([^\[\]|]+)(?:\|([^\[\]]+))?\]\]/g, (m, cible, texte) => {
      const libelle = (texte === undefined ? cible : texte).trim();
      renvois.bilan.repares++;
      // Une ancre (`[[note#titre]]`) est refusée : les pages générées ne portent AUCUN `id`
      // de titre, donc l'ancre serait morte. Aucune note du vault n'en utilise aujourd'hui.
      const cle = cible.trim().replace(/^\.\//, '').replace(/\.md$/i, '');
      const note = cle.includes('#')
        ? null
        : renvois.parCle.get(cle.toLowerCase()) || renvois.parCle.get(cle.split('/').pop().toLowerCase());
      if (!note) {
        renvois.bilan.texte++;
        renvois.bilan.nonResolus.push({ note: renvois.depuis, cible: cible.trim() });
        return libelle;
      }
      renvois.bilan.liens++;
      const formate = libelle
        .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
        .replace(/(^|[\s(])\*([^*\n]+)\*/g, '$1<em>$2</em>');
      return `<a href="${lienRelatif(renvois.page, note.page)}">${formate}</a>`;
    });
  }

  return s.replace(/\u0001(\d+)\u0001/g, (m, i) => codes[+i]);
}

function convertir(md) {
  const lignes = md.split('\n');
  const sortie = [];
  let i = 0;

  const viderTableau = (bloc) => {
    if (!bloc.length) return;
    const cellules = (l) => l
      // Un renvoi avec alias `[[cible|texte]]` contient un `|` qui n'est PAS un séparateur
      // de cellule : on le met de côté le temps de la découpe, sinon la cellule serait
      // coupée en deux et la page afficherait `[[cible` puis `texte]]`.
      .replace(/\[\[([^\[\]]*)\|([^\[\]]*)\]\]/g, '[[$1\u0002$2]]')
      .replace(/^\||\|$/g, '').split('|')
      .map((c) => c.trim().replace(/\u0002/g, '|'));
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
const enveloppe = (titre, corps, retour, libelleRetour) => `<!DOCTYPE html>
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
    margin: 0; background: #080b14; color: #eaf0f7;
    font-family: 'Inter', system-ui, -apple-system, sans-serif;
    line-height: 1.75; padding: 3rem 1.25rem 6rem;
  }
  main { max-width: 46rem; margin: 0 auto; }
  .bandeau {
    font-family: ui-monospace, 'JetBrains Mono', monospace; font-size: 0.7rem;
    letter-spacing: 0.16em; text-transform: uppercase; color: #2abfff;
    border: 1px dashed rgba(16,185,129,0.4); border-radius: 3px;
    padding: 0.5rem 0.75rem; margin-bottom: 2.5rem;
  }
  .bandeau strong { color: #eaf0f7; }
  h1 { font-size: clamp(1.9rem, 5vw, 2.8rem); line-height: 1.1; margin: 0 0 1.5rem; font-weight: 500; }
  h2 { font-size: 1.15rem; font-weight: 500; margin: 3rem 0 1rem; padding-bottom: 0.6rem; border-bottom: 1px solid rgba(16,185,129,0.22); }
  h3 { font-size: 1rem; font-weight: 600; margin: 2rem 0 0.75rem; color: #2abfff; }
  h4 { font-size: 0.9rem; font-weight: 600; margin: 1.5rem 0 0.5rem; }
  p { color: #a9b8cc; margin: 0 0 1rem; }
  strong { color: #eaf0f7; }
  em { color: #cfe0ec; }
  a { color: #2abfff; }
  a:focus-visible { outline: 2px solid #2abfff; outline-offset: 2px; }
  code { font-family: ui-monospace, 'JetBrains Mono', monospace; font-size: 0.85em; background: rgba(255,255,255,0.06); padding: 0.1rem 0.3rem; border-radius: 2px; color: #eaf0f7; }
  pre { background: rgba(255,255,255,0.04); border-left: 2px solid rgba(16,185,129,0.4); padding: 1rem; overflow-x: auto; border-radius: 2px; }
  pre code { background: none; padding: 0; font-size: 0.8rem; line-height: 1.6; }
  blockquote { margin: 1.5rem 0; padding: 0.25rem 0 0.25rem 1.25rem; border-left: 2px solid #2abfff; }
  blockquote p { color: #cfe0ec; margin-bottom: 0.5rem; }
  ul, ol { color: #a9b8cc; padding-left: 1.4rem; margin: 0 0 1.25rem; }
  li { margin-bottom: 0.4rem; }
  hr { border: none; border-top: 1px solid rgba(255,255,255,0.08); margin: 3rem 0; }
  table { border-collapse: collapse; width: 100%; margin: 1.25rem 0; font-size: 0.88rem; }
  th, td { text-align: left; padding: 0.6rem 0.7rem; border-bottom: 1px solid rgba(255,255,255,0.08); color: #a9b8cc; }
  th { color: #eaf0f7; font-weight: 600; }
  .sommaire { margin: 2rem 0 0; padding: 0; list-style: none; }
  .sommaire li { border-bottom: 1px solid rgba(255,255,255,0.06); }
  .sommaire a { display: block; padding: 0.7rem 0.25rem; text-decoration: none; }
  .sommaire a:hover { color: #7ad6ff; }
  .retour { display: inline-block; margin-top: 3rem; font-family: ui-monospace, monospace; font-size: 0.78rem; }
</style>
</head>
<body>
<main>
<div class="bandeau">Page <strong>non répertoriée</strong> — hors plan du site et hors navigation</div>
${corps}
${retour ? `<a class="retour" href="${retour}">${libelleRetour || '← Retour au sommaire'}</a>` : ''}
</main>
</body>
</html>
`;

/* ══════════════════════════════════════════════════════════════════════════════
 * DÉCOUVERTE : les documents à plat, puis les kits (sous-dossiers)
 * ══════════════════════════════════════════════════════════════════════════════ */

/* ── Les documents à plat — règles de nommage INCHANGÉES ─────────────────────── */
const fichiers = readdirSync(src, { withFileTypes: true })
  .filter((e) => e.isFile() && e.name.endsWith('.md')).map((e) => e.name).sort();
const pages = fichiers.map((f) => {
  const nom = f.replace(/\.md$/, '');
  // `00-INDEX-360` devient la page d'accueil ; les autres deviennent `cycle-N.html`.
  const cible = nom.startsWith('00') ? 'index.html'
    : nom.replace(/^\d+-/, '').replace(/-\d{4}-\d{2}-\d{2}$/, '') + '.html';
  return { fichier: f, nom, cible };
});

const sommaire = pages.filter((p) => p.cible !== 'index.html');

/* ── Les kits : un sous-dossier = un kit ──────────────────────────────────────── */
const kits = readdirSync(src, { withFileTypes: true })
  .filter((e) => e.isDirectory() && !e.name.startsWith('.'))
  .map((e) => e.name).sort((a, b) => a.localeCompare(b, 'fr'));

/*
 * Nom de page d'une note de kit : le nom du fichier, extension remplacée.
 * Ainsi `[[05-le-lore]]` désigne `05-le-lore.html` — la correspondance entre le vault et
 * le site reste LISIBLE, et un renvoi n'a pas besoin d'une table de conversion.
 *
 * ⚠️ UNE SEULE EXCEPTION, ET ELLE EST OBLIGATOIRE : la note d'entrée du vault s'appelle
 * `INDEX.md`. Sur un système de fichiers insensible à la casse (Windows, ici), `INDEX.html`
 * et `index.html` sont LE MÊME FICHIER : écrire les deux ferait disparaître l'un par
 * l'autre. `INDEX` devient donc la page d'entrée du kit — exactement comme
 * `00-INDEX-360.md` devient `index.html` pour les documents à plat.
 */
const nommerPage = (sansExt) => {
  if (!sansExt.includes('/') && sansExt.toLowerCase() === 'index') return 'index.html';
  return sansExt + '.html';
};

const kitsNotes = new Map();   // kit → [{ rel, sansExt, page, titre }]
const kitsCles = new Map();    // kit → Map(clé de renvoi → note)

for (const kit of kits) {
  const liste = listeMd(join(LOCAL, kit)).map((rel) => {
    const sansExt = rel.replace(/\.md$/i, '');
    // Les titres sont lus AVANT tout contexte de renvois : un titre n'appelle aucun renvoi,
    // il ne doit donc pas entrer dans le compte des liens.
    const md = retirerFrontmatter(readFileSync(join(LOCAL, kit, rel), 'utf8'));
    const titre = (md.match(/^#\s+(.*)$/m) || [, sansExt])[1].trim();
    return { rel, sansExt, page: nommerPage(sansExt), titre };
  });

  // Deux notes qui produiraient LA MÊME page s'écraseraient en silence. On le dit.
  const vues = new Map();
  for (const p of liste) {
    const cle = p.page.toLowerCase();
    if (vues.has(cle)) {
      console.log('  ⚠️  ' + kit + ' : ' + p.rel + ' et ' + vues.get(cle) +
        ' donnent tous deux la page ' + p.page + ' — une seule sera écrite.');
    } else vues.set(cle, p.rel);
  }

  // Index de résolution : le chemin relatif sans extension ET le nom de note seul, tous
  // deux en minuscules (un renvoi `[[metroid-goyo-2026-09-13]]` désigne une note rangée
  // dans `fiches/` : sans la clé par nom de note, le renvoi resterait en texte).
  const parCle = new Map();
  for (const p of liste) {
    for (const cle of new Set([p.sansExt.toLowerCase(), p.sansExt.split('/').pop().toLowerCase()])) {
      if (!parCle.has(cle)) parCle.set(cle, p);
    }
  }
  kitsNotes.set(kit, liste);
  kitsCles.set(kit, parCle);
  console.log('  kit ' + kit + ' : ' + liste.length + ' note(s) à publier');
}

/* ── Génération des documents à plat ─────────────────────────────────────────── */
for (const p of pages) {
  const md = readFileSync(join(src, p.fichier), 'utf8');
  const titre = (md.match(/^#\s+(.*)$/m) || [, p.nom])[1].trim();
  let corps = convertir(md);

  // Sur la page d'accueil, on insère le sommaire des documents APRÈS le premier titre —
  // puis, à la suite, un lien vers chaque kit (un kit = un lien, pas dix-neuf).
  if (p.cible === 'index.html') {
    const liens = sommaire.map((s) => {
      const t = (readFileSync(join(src, s.fichier), 'utf8').match(/^#\s+(.*)$/m) || [, s.nom])[1].trim();
      return `<li><a href="${s.cible}">${enLigne(t)}</a></li>`;
    }).join('');
    const liensKits = kits.map((kit) => {
      const liste = kitsNotes.get(kit);
      const entree = liste.find((x) => x.page === 'index.html') || liste[0];
      const libelle = entree ? entree.titre : kit;
      return `<li><a href="${kit}/index.html">${enLigne(libelle)} · kit de ${liste.length} note(s)</a></li>`;
    }).join('');
    corps = corps.replace(/(<\/h1>)/, `$1\n<ul class="sommaire">${liens}${liensKits}</ul>`);
  }

  writeFileSync(join(DEST, p.cible), enveloppe(titre, corps, p.cible === 'index.html' ? null : './'), 'utf8');
  console.log(`  écrit : public/TARDIS/JoF/${p.cible}  (depuis ${p.fichier})`);
}

/* ── Génération des kits ─────────────────────────────────────────────────────── */
const bilans = [];

for (const kit of kits) {
  const liste = kitsNotes.get(kit);
  const parCle = kitsCles.get(kit);
  const bilan = nouveauBilan();
  const dossier = join(DEST, kit);

  // Sommaire du kit : il est inséré dans SA page d'entrée, comme le sommaire des documents
  // à plat l'est dans l'accueil. Calculé hors contexte de renvois (ce sont des titres, pas
  // des renvois : ils ne doivent pas compter comme des liens).
  const sommaireKit = liste.filter((p) => p.page !== 'index.html')
    .map((p) => `<li><a href="${lienRelatif('index.html', p.page)}">${enLigne(p.titre)}</a></li>`).join('');

  /* ── « Cité par » — le renvoi inverse, et il est MESURÉ ────────────────────────
   * ⚠️ POURQUOI CETTE SECTION EXISTE (ajoutée le 14/09/2026).
   *   Une note de navigation qui dit « ceci renvoie là » oblige le lecteur à faire l'aller-retour
   *   pour savoir QUI l'a appelée. Sur un vault dont les renvois sont la structure, cette
   *   information est déjà calculée par le publieur — il suffit de la lui faire écrire.
   *
   * ⚠️ ET LE GARDE-FOU QUI LA REND HONNÊTE : on ne rend PAS la symétrie décorative.
   *   Le glossaire « est cité par » beaucoup de notes, mais le glossaire CITE ses termes : le
   *   compter comme une destination utile serait du bruit. La règle du studio (passe de liaison du
   *   14/09/2026) est : **un lien sans raison est un lien qu'on ne suit pas.** Cette section ne
   *   fabrique donc AUCUN renvoi : elle affiche ceux qui EXISTENT déjà dans le Markdown, résolus
   *   par la même table que la conversion. Si une note n'est citée par personne, elle n'a pas de
   *   section — *un bloc « Cité par : 0 » serait du remplissage.*
   *
   * Les `code` entre backticks sont retirés AVANT la lecture, exactement comme dans `enLigne` :
   * l'exemple de syntaxe `[[questions-ouvertes]]` du README ne doit pas devenir une citation. */
  const citesPar = new Map();
  for (const p of liste) {
    const brut = retirerFrontmatter(readFileSync(join(LOCAL, kit, p.rel), 'utf8')).replace(/`[^`]*`/g, ' ');
    for (const m of brut.matchAll(/\[\[([^\[\]|#]+)(?:\|[^\[\]]*)?\]\]/g)) {
      const cle = m[1].trim().replace(/^\.\//, '').replace(/\.md$/i, '').toLowerCase();
      const cible = parCle.get(cle) || parCle.get(cle.split('/').pop().toLowerCase());
      if (!cible || cible.page === p.page) continue;
      if (!citesPar.has(cible.page)) citesPar.set(cible.page, new Map());
      citesPar.get(cible.page).set(cible.page === p.page ? null : p.page, p);
    }
  }
  bilan.citesParPages = 0;
  bilan.citesParEntrees = 0;

  for (const p of liste) {
    renvois = { depuis: kit + '/' + p.rel, parCle, page: p.page, bilan };
    const md = retirerFrontmatter(readFileSync(join(LOCAL, kit, p.rel), 'utf8'));
    let corps = convertir(md);
    if (p.page === 'index.html') {
      corps = corps.replace(/(<\/h1>)/, `$1\n<ul class="sommaire">${sommaireKit}</ul>`);
    }

    // Le renvoi inverse, écrit APRÈS le corps : il ne double aucun titre, il le suit.
    const entrantes = [...(citesPar.get(p.page) || new Map()).values()];
    if (entrantes.length) {
      const listeEntrantes = entrantes
        .map((c) => `<li><a href="${lienRelatif(p.page, c.page)}">${enLigne(c.titre)}</a></li>`).join('');
      corps += `\n<h2>Cité par</h2>\n<p>${entrantes.length} note(s) de ce kit renvoient ici.</p>\n<ul>${listeEntrantes}</ul>`;
      bilan.citesParPages++;
      bilan.citesParEntrees += entrantes.length;
    }

    // Le « retour » ne mène jamais dans le vide : une note du kit revient à la page
    // d'entrée du kit, et cette page d'entrée revient à l'accueil des dossiers.
    const retour = p.page === 'index.html' ? '../index.html' : lienRelatif(p.page, 'index.html');
    const libelleRetour = p.page === 'index.html' ? '← Retour au sommaire des dossiers' : '← Sommaire du kit';

    const abs = join(dossier, p.page);
    mkdirSync(dirname(abs), { recursive: true });
    writeFileSync(abs, enveloppe(p.titre, corps, retour, libelleRetour), 'utf8');
    bilan.notes++;
    console.log(`  écrit : public/TARDIS/JoF/${kit}/${p.page}  (depuis ${kit}/${p.rel})`);
  }

  renvois = null;
  bilans.push({ kit, bilan });
}

/* ── Ce que les renvois sont devenus : mesuré, pas supposé ───────────────────── */
if (bilans.length) {
  console.log('');
  console.log('  ── renvois Obsidian [[…]] dans les kits ──');
  for (const { kit, bilan } of bilans) {
    console.log(`  ${kit} — ${bilan.notes} page(s) :`);
    console.log(`      ${bilan.repares} renvoi(s) traité(s) → ${bilan.liens} en LIEN, ` +
      `${bilan.texte} en TEXTE SEUL, ${bilan.proteges} protégé(s) dans un \`code\` (exemple de syntaxe)`);
    for (const n of bilan.nonResolus) {
      console.log(`      · TEXTE SEUL depuis ${n.note} : [[${n.cible}]] — cible hors du kit publié`);
    }
    for (const n of bilan.protegesListe) {
      console.log(`      · PROTÉGÉ depuis ${n.note} : \`${n.extrait}\` (montré, pas cliquable)`);
    }
    console.log(`      « Cité par » : ${bilan.citesParPages || 0}/${bilan.notes} page(s) en portent une, ` +
      `${bilan.citesParEntrees || 0} entrée(s) au total — 0 entrée fabriquée, ce sont les renvois DÉJÀ présents`);
  }
}

console.log('');
console.log("  ── liens vers l'extérieur (les sources du kit, rendues cliquables) ──");
console.log(`  ${liensExternes} lien(s) rendu(s) cliquable(s). Un lien n'est PAS une ressource chargée :`);
console.log("  la page s'ouvre toujours hors ligne, et le critère reste « 0 ressource CHARGÉE ».");

console.log('');
console.log('  ⚠️  Ces pages portent `noindex, nofollow` et ne seront JAMAIS au sitemap.');
console.log('      Le manifeste src/config/topographie.js les déclare avec `declaration: null`.');
console.log('      Si vous voulez les rendre publiques un jour, il faudra DÉFAIRE ces trois choses.');
console.log('');
