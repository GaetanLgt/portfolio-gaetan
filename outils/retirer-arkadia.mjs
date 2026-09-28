// retirer-arkadia.mjs — GL Digital Lab, 28/09/2026
//
// ⛔ DEMANDE DE GAËTAN : « Et tu me vire toute mention, direct ou représentation de
//    l'arkadia ! »
//
// ⭐ INVENTAIRE MESURÉ — 6 occurrences d'ArkAdiA dans 2 pages, plus la même famille :
//      index.html L95    commentaire  « (Nœud local & ArkAdiA) »
//      index.html L336   commentaire  « les six images viennent d'ArkAdiA »
//      index.html L342   commentaire  « remplace l'image d'ArkAdiA »
//      index.html L402   VISIBLE      « Pôle 03 — ARKADIA · Mémoire documentaire »
//      index.html L915   VISIBLE      lien « ArkAdiA — l'univers »
//      la-langue-du-code VISIBLE      `CARNETS['Vault-ARKADIA']`
//    Et ce qui va AVEC, parce que c'est la même chose : « la soute » (le nom de soute
//    du navire), « la carte complète du navire », le nom du réacteur dans un commentaire.
//    ⇒ *Retirer le nom en gardant la chose ne retire rien.*
//
// ⛔⛔ POURQUOI CE SCRIPT TRAVAILLE PAR LIGNES, ET NON PAR CHAÎNES MULTI-LIGNES.
//    Ma première version comparait des chaînes de trois lignes. Six sur neuf ont échoué :
//    le fichier est en LF, mes chaînes arrivaient en CRLF, et **la comparaison exacte
//    ne matchait pas** — sans que l'erreur dise pourquoi.
//    ⭐ *On ne reconstruit pas un texte multiligne par analogie : on le LIT ligne par
//      ligne.* C'est la troisième fois aujourd'hui que la même famille de geste me mord.
//    ⇒ Ici : on repère une ligne par son CONTENU, et on agit sur des indices de lignes.
//
// ⛔ CE QUE CE SCRIPT NE FAIT PAS : il ne touche PAS aux URL `/arkadia/`, `/Arche/`,
//    `/univers/`, `/soute/`. Fermer une URL est un acte de PRODUCTION (410 + décision) —
//    il se demande, il ne se glisse pas dans un nettoyage de texte.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ICI = path.dirname(fileURLToPath(import.meta.url));
const C = path.resolve(ICI, '..', 'cinematique');
const SIMULER = process.argv.includes('--simuler');
if (!fs.existsSync(C)) { console.error('⛔ cinematique/ introuvable depuis ' + C); process.exit(2); }

const journal = [];
let faits = 0, rates = 0;

// ── OUTIL : remplacer UNE ligne, en la repérant par un fragment ────────────
function remplacerLigne(fichier, fragment, remplacement, etiquette) {
  const p = path.join(C, fichier);
  if (!fs.existsSync(p)) { journal.push('  ⛔ ' + etiquette + ' : ' + fichier + ' absent'); rates++; return; }
  const brut = fs.readFileSync(p, 'utf8');
  const fin = brut.includes('\r\n') ? '\r\n' : '\n';
  const L = brut.split(/\r?\n/);
  const idx = [];
  L.forEach((l, i) => { if (l.includes(fragment)) idx.push(i); });
  if (idx.length !== 1) {
    journal.push('  ⛔ ' + etiquette + ' : ' + idx.length + ' ligne(s) pour « ' + fragment.slice(0, 50) + ' »');
    rates++; return;
  }
  const i = idx[0];
  if (remplacement === null) { L.splice(i, 1); }
  else { L[i] = remplacement; }
  if (!SIMULER) fs.writeFileSync(p, L.join(fin), 'utf8');
  faits++;
  journal.push('  OK  ' + etiquette + '  (' + fichier + ' L' + (i + 1) + ')');
}

// ── OUTIL : supprimer un BLOC de lignes, repéré par sa première ligne ──────
function supprimerBloc(fichier, fragmentDebut, nbLignes, etiquette) {
  const p = path.join(C, fichier);
  const brut = fs.readFileSync(p, 'utf8');
  const fin = brut.includes('\r\n') ? '\r\n' : '\n';
  const L = brut.split(/\r?\n/);
  const idx = [];
  L.forEach((l, i) => { if (l.includes(fragmentDebut)) idx.push(i); });
  if (idx.length !== 1) { journal.push('  ⛔ ' + etiquette + ' : ' + idx.length + ' debut(s)'); rates++; return; }
  const i = idx[0];
  const bloc = L.slice(i, i + nbLignes);
  if (!bloc[bloc.length - 1].trim().endsWith('</div>')) {
    journal.push('  ⛔ ' + etiquette + ' : le bloc ne se termine pas par </div> — on ne coupe pas'); rates++; return;
  }
  L.splice(i, nbLignes);
  if (!SIMULER) fs.writeFileSync(p, L.join(fin), 'utf8');
  faits++;
  journal.push('  OK  ' + etiquette + '  (' + fichier + ' : ' + nbLignes + ' lignes retirées)');
}

const IDX = 'index.html';
const LDC = 'analyses/la-langue-du-code.html';

// ═══ ① LES NOMS VISIBLES ═══════════════════════════════════════════════════
remplacerLigne(IDX,
  'Pôle 03 — ARKADIA · Mémoire documentaire',
  '        <span class="mf-boite-titre">Pôle 03 — MÉMOIRE · Recherche documentaire</span>',
  'pôle 03 : le nom de la maison retiré');

remplacerLigne(IDX,
  '<a href="/univers/">ArkAdiA',
  null,
  'le lien « ArkAdiA — l\'univers » retiré de la grille');

remplacerLigne(LDC,
  "CARNETS['Vault-ARKADIA']",
  "  <p><code>CARNETS['corpus-studio']</code> — c'est le nom réel d'une collection.</p>",
  'le nom de la collection retiré de l\'analyse');

// ═══ ② LA MÊME FAMILLE : LA SOUTE, LE NAVIRE ══════════════════════════════
remplacerLigne(IDX,
  '<a href="/soute/">La soute</a></span>',
  null,
  'l\'entrée « La soute » retirée de la grille');
remplacerLigne(IDX,
  '<p>La carte complète du navire.</p>',
  null,
  'la phrase « la carte complète du navire » retirée');
remplacerLigne(IDX,
  '<a href="/soute/">La soute</a></p>',
  '     <a href="/etat-du-studio/">L\'état du studio</a></p>',
  'le lien « La soute » du pied retiré');

// ═══ ③ LES COMMENTAIRES — ils portent le nom, ils le retirent aussi ═══════
remplacerLigne(IDX,
  '(Nœud local & ArkAdiA)',
  null,
  'commentaire historique : la parenthèse retirée');
remplacerLigne(IDX,
  "Les six images du site viennent d'ArkAdiA",
  "      <!-- LE VISUEL DU HERO — generee par le studio (ComfyUI, RealVisXL V5).",
  'commentaire du visuel : la provenance reecrite');
remplacerLigne(IDX,
  "Il remplace l'image d'ArkAdiA qui etait sombre",
  '           graine 20260928). Elle remplace une image interne qui etait sombre',
  'commentaire du visuel : la 2e ligne');
remplacerLigne(IDX,
  "l'oracle est la plus neutre",
  '           une salle technique se lit mieux qu\'un personnage.',
  'commentaire du visuel : le nom du reacteur');

// ── CE QU'ON N'A PAS FAIT, ET POURQUOI ────────────────────────────────────
console.log('=== RETRAIT DES MENTIONS ArkAdiA ===');
journal.forEach(l => console.log(l));
console.log('');
console.log('  faits : ' + faits + '    non appliques : ' + rates);

// ═══ LA PREUVE : on relit tout ════════════════════════════════════════════
console.log('');
console.log('=== CE QUI RESTE DANS LES PAGES PUBLIEES (relu du disque) ===');
const pages = [];
const marcher = (d) => {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const q = path.join(d, e.name);
    if (e.isDirectory()) { if (!['node_modules', '.git', 'vendor'].includes(e.name)) marcher(q); }
    else if (e.name.endsWith('.html')) pages.push(q);
  }
};
marcher(C);

const MOTS = [
  ['arkadia', 'ArkAdiA'],
  ['galion', 'galion'],
  ['kraken', 'kraken'],
  ['proue', 'proue'],
  ['r[eé]acteur', 'réacteur'],
  ['capitaine', 'capitaine'],
  ['navire', 'navire'],
  ['oracle', 'oracle']
];
let total = 0;
for (const [motif, nom] of MOTS) {
  const detail = [];
  let n = 0;
  for (const p of pages) {
    const t = fs.readFileSync(p, 'utf8');
    const c = (t.match(new RegExp(motif, 'gi')) || []).length;
    if (c) { n += c; detail.push(path.relative(C, p).replace(/\\/g, '/') + ' ×' + c); }
  }
  if (n) { console.log('  ⚠️  ' + nom.padEnd(16) + n + '  ' + detail.join(', ')); total += n; }
}
console.log('');
console.log(total === 0
  ? '  ✅ AUCUNE mention de l\'univers ArkAdiA dans les pages publiees'
  : '  ⚠️  ' + total + ' occurrence(s) restante(s) — voir ci-dessus');
console.log('');
console.log('  ⛔ NON TOUCHE, ET C\'EST VOLONTAIRE : les URL /arkadia/ /Arche/ /univers/ /soute/');
console.log('     Fermer une URL est un acte de PRODUCTION — ca se demande.');
if (SIMULER) console.log('  MODE SIMULE : rien n\'a ete ecrit.');
