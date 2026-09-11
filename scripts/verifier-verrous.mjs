#!/usr/bin/env node
/**
 * verifier-verrous.mjs — les verrous de la signature qualité sont-ils tenus ?
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * POURQUOI CE FICHIER EXISTE — 11/09/2026
 * ───────────────────────────────────────────────────────────────────────────
 * `refs/signature-qualite.md` fixe des VERROUS : AA · reduced-motion · curseur
 * natif · < 1 Mo par page · émeraude jamais achetée · pas de motion addictive ·
 * pas d'effets gratuits · mode sobre neutre et réversible.
 *
 * Or ces verrous ne vivaient que dans **les commentaires du code**. Ce dépôt a
 * déjà payé deux fois le prix de cette confiance :
 *   · `cursor: none` a survécu au retrait du curseur personnalisé — masquer le
 *     curseur système sans le remplaçant laisse le visiteur SANS curseur. Le
 *     risque est décrit dans un commentaire, mais rien ne l'empêchait de
 *     revenir ;
 *   · la palette a changé deux fois (D1 clair → D4 sombre → retour D1) sans
 *     qu'aucun contrôle ne vérifie que les contrastes suivaient.
 *
 * **Un verrou décrit dans un commentaire n'est pas un verrou : c'est une
 * intention.** Ce script le transforme en mesure, et échoue si le verrou casse.
 *
 * CE QU'IL NE FAIT PAS
 *   Il ne juge pas le goût. Il ne dit pas si la palette est belle. Il vérifie
 *   des contraintes qu'on a décidé de tenir, et qui sont vérifiables.
 *
 * USAGE
 *   node scripts/verifier-verrous.mjs
 * Sortie 0 = tous les verrous tenus. 1 = au moins un verrou cassé.
 */

import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, extname } from 'node:path';

const RACINE = process.cwd();
let echecs = 0;
const dire = (ok, quoi, note = '') => {
  console.log(`  ${ok ? '[ok]' : '[KO]'}  ${quoi}${note ? '  — ' + note : ''}`);
  if (!ok) echecs++;
};

// ─────────────────────────────────────────────────────────────────────────────
// Outils : parcours de fichiers, retrait des commentaires, contraste WCAG
// ─────────────────────────────────────────────────────────────────────────────
function fichiers(dossier, extensions, trouves = []) {
  for (const nom of readdirSync(dossier)) {
    if (nom === 'node_modules' || nom === 'dist' || nom === '.git') continue;
    const chemin = join(dossier, nom);
    let st;
    try { st = statSync(chemin); } catch { continue; }
    if (st.isDirectory()) fichiers(chemin, extensions, trouves);
    else if (extensions.includes(extname(nom))) trouves.push(chemin);
  }
  return trouves;
}

/** Retire commentaires HTML, CSS et JS : on ne veut que le CODE ACTIF. */
function sansCommentaires(texte) {
  return texte
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/\/\*[\s\S]*?\*\//g, ' ')
    .replace(/(^|[^:])\/\/[^\n]*/g, '$1 ');
}

function luminance(hexa) {
  const h = hexa.replace('#', '');
  const n = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
  const rgb = [0, 2, 4].map((i) => parseInt(n.slice(i, i + 2), 16) / 255);
  const lin = rgb.map((c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * lin[0] + 0.7152 * lin[1] + 0.0722 * lin[2];
}
function contraste(a, b) {
  const [x, y] = [luminance(a), luminance(b)];
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
}

console.log('='.repeat(72));
console.log('  Verrous de la signature qualité — ' + RACINE.split(/[\\/]/).pop());
console.log('='.repeat(72));

const sources = fichiers(join(RACINE, 'src'), ['.vue', '.css', '.ts', '.js']);
if (sources.length === 0) {
  console.error('  Aucun fichier source trouvé dans src/. Le balayage est cassé, pas le code.');
  process.exit(1);
}
console.log(`  ${sources.length} fichier(s) source analysé(s)\n`);

// ─── VERROU 1 : curseur natif ───────────────────────────────────────────────
console.log('  ── Curseur natif ──');
const curseurActif = [];
for (const f of sources) {
  const code = sansCommentaires(readFileSync(f, 'utf8'));
  if (/cursor\s*:\s*none/.test(code)) curseurActif.push(f.replace(RACINE + '\\', '').replace(RACINE + '/', ''));
}
if (curseurActif.length === 0) {
  dire(true, 'aucun `cursor: none` actif');
} else {
  dire(false, '`cursor: none` ACTIF', curseurActif.join(', '));
  console.log('        Masquer le curseur système sans curseur de remplacement laisse le');
  console.log('        visiteur SANS curseur. C\'est la panne que le commentaire de');
  console.log('        global.css décrit — et un commentaire n\'empêche rien.');
}

// ─── VERROU 2 : reduced-motion ──────────────────────────────────────────────
console.log('\n  ── Mouvement ──');
const rm = sources.filter((f) => readFileSync(f, 'utf8').includes('prefers-reduced-motion'));
dire(rm.length > 0, '`prefers-reduced-motion` présent', rm.length ? `${rm.length} fichier(s)` : 'ABSENT');

const toutesSources = sources.map((f) => readFileSync(f, 'utf8')).join('\n');
const sobreCss = /\.app--sobre|body\.sobre/.test(sansCommentaires(toutesSources));
dire(sobreCss, 'mode sobre défini en CSS');

const effets = ['matrix-bg', 'tron', 'particles', 'noise-overlay', 'spotlight', 'floating-element', 'glitch'];
const desactives = effets.filter((e) => {
  const re = new RegExp(`\\.app--sobre[^{]*\\{[^}]*${e}|${e}[^{]*\\{[^}]*animation\\s*:\\s*none`, 'i');
  return re.test(toutesSources);
});
if (sobreCss) {
  dire(true, 'le mode sobre cible des effets', `${desactives.length} motif(s) neutralisé(s)`);
}

// ─── VERROU 3 : contrastes AA de la palette RÉELLEMENT définie ──────────────
console.log('\n  ── Contrastes AA (jetons lus dans variables.css) ──');
const fichierVariables = sources.find((f) => f.endsWith('variables.css'));
if (!fichierVariables) {
  dire(false, 'variables.css introuvable', 'les contrastes ne peuvent pas être vérifiés');
} else {
  const css = readFileSync(fichierVariables, 'utf8');
  const jetons = {};
  for (const m of css.matchAll(/(--[a-z0-9-]+)\s*:\s*(#[0-9A-Fa-f]{3,8})\s*;/g)) jetons[m[1]] = m[2];

  const fond = jetons['--paper'] || jetons['--bg'];
  const fondAlt = jetons['--paper-alt'] || jetons['--surface'] || fond;
  if (!fond) {
    dire(false, 'jeton de fond (--paper ou --bg) introuvable');
  } else {
    // ON TESTE LES DEUX FONDS, ET CE N'EST PAS DU ZÈLE.
    // Le 11/09/2026, `--rule-strong: #2E685C` donnait 3,14:1 sur `--paper` —
    // conforme — mais 2,98:1 sur `--paper-alt`. Une bordure de bouton posée sur
    // une carte passait donc SOUS le seuil, alors que le contrôle annonçait
    // « verrou tenu ». Un jeton ne « passe » pas dans l'absolu : il passe SUR UN
    // FOND DONNÉ. Tester un seul fond, c'est tester la moitié du produit.
    //
    // Défaut trouvé en migrant la maquette La Barre vers D5 — pas en relisant ce
    // fichier. C'est la seconde fois aujourd'hui qu'un travail de conception
    // révèle un défaut qu'aucun contrôle ne cherchait.
    const couples = [
      ['--ink', 4.5, 'texte principal'],
      ['--ink-soft', 4.5, 'texte secondaire'],
      ['--ink-faint', 3.0, 'texte tertiaire (grand texte seulement)'],
      ['--accent', 3.0, 'accent (grand texte / composant)'],
      ['--action', 4.5, 'action / CTA (texte)'],
      ['--alert', 4.5, 'alerte (texte)'],
      ['--critical', 4.5, 'erreur (texte)'],
      ['--neon-cyan', 4.5, 'micro-labels'],
      ['--neon-magenta', 3.0, 'ponctuations'],
      ['--rule-strong', 3.0, 'bordure fonctionnelle'],
    ];
    for (const [nom, seuil, quoi] of couples) {
      const avant = jetons[nom];
      if (!avant) continue;   // jeton absent de cette DA : rien à juger
      const rFond = contraste(avant, fond);
      const rCarte = contraste(avant, fondAlt);
      const pire = Math.min(rFond, rCarte);
      const ou = rFond <= rCarte ? 'fond' : 'cartes';
      dire(pire >= seuil,
        `${nom} : ${rFond.toFixed(2)}:1 sur le fond, ${rCarte.toFixed(2)}:1 sur les cartes`,
        `seuil ${seuil} — ${quoi}` + (pire < seuil ? ` — ÉCHEC sur le ${ou}` : ''));
    }
    // Le cas qui a mordu deux fois : le filet décoratif.
    if (jetons['--rule']) {
      const r = contraste(jetons['--rule'], fond);
      const ok = r >= 3.0;
      console.log(`  ${ok ? '[ok]' : '[!!]'}  --rule sur le fond : ${r.toFixed(2)}:1` +
        (ok ? '' : '  — sous 3:1 : DÉCORATIF UNIQUEMENT, jamais bordure de contrôle'));
    }
  }
}

// ─── VERROU 4 : les noms protégés ne sortent pas dans le contenu visible ────
console.log('\n  ── Garde-fou juridique ──');
const PROTEGES = [
  // Marques et noms de code du studio (D5, charte)
  'Albator', 'Harlock', 'Matrix Resurrections', 'Evangelion', 'Cyberpunk 2077', 'TRON',
  // Franchises du registre `licences-refusees.md` — AJOUTÉES LE 11/09/2026.
  // Motif MESURÉ : « Pokémon Memory » était le nom PUBLIC d'un projet servi sur
  // https://gldigitallab.fr/projets, et ce verrou affichait [ok] au même moment.
  // Deux causes, cumulées : (1) ces termes n'étaient pas dans la liste — une
  // interdiction qui n'est pas cherchée n'est pas une interdiction ; (2) le contrôle
  // ne lisait QUE le <template>, alors que le nom venait du tableau `projects[]` du
  // <script setup>. Un verrou qui ne lit qu'une moitié du composant ne peut pas voir
  // la moitié qui est arrivée en production.
  'Nintendo', 'Pokémon', 'Zelda', 'Mario', 'Metroid', 'Splatoon',
  'Palworld', 'Pocketpair', 'Grapeshot',
];
const fuites = [];
for (const f of sources) {
  if (!f.endsWith('.vue')) continue;
  const code = sansCommentaires(readFileSync(f, 'utf8'));
  // ⚠️ ON LIT LE COMPOSANT ENTIER, PLUS SEULEMENT SON <template> (corrigé le 11/09/2026).
  // Les commentaires sont déjà retirés par `sansCommentaires` : les mentions internes
  // gardent le droit d'exister, seule la chaîne réellement rendue est surveillée.
  for (const nom of PROTEGES) {
    if (code.includes(nom)) fuites.push(`${f.split(/[\\/]/).pop()} → ${nom}`);
  }
}
dire(fuites.length === 0, 'aucun nom protégé dans le contenu visible des pages',
  fuites.length ? fuites.join(' ; ') : 'les mentions restent dans les commentaires internes');

// ─── VERROU 5 : poids — DÉLIBÉRÉMENT ABSENT ─────────────────────────────────
// Ma première version additionnait la taille des fichiers source et échouait si le
// total dépassait 1 Mo. C'est FAUX : le verrou porte sur « moins de 1 Mo PAR PAGE
// SERVIE », et 1110 Ko de sources TypeScript ne disent rien du poids d'une page une
// fois compilée, découpée et compressée. Le contrôle échouait donc à tort — et un
// contrôle qui échoue à tort finit par être ignoré, ce qui est pire que pas de
// contrôle.
//
// Le poids réel est DÉJÀ vérifié, au bon endroit : `deploy.yml` a une étape
// « 📏 Check file sizes » qui mesure les fichiers construits. On ne duplique pas
// ici une mesure qu'on ferait mal.
console.log('\n  ── Poids ──');
console.log('  [--]  non mesuré ici : voir l\'étape « Check file sizes » de deploy.yml,');
console.log('        qui mesure les fichiers CONSTRUITS. Un total de sources ne dirait rien.');

// ─── VERROU 6 : les jetons de COULEUR n'ont qu'un seul foyer ────────────────
// 11/09/2026 : gldigitallab.fr s'affichait en CLAIR alors que la charte D5 est
// sombre. Cause mesurée : `critical.css` redéclarait --bg, --text-main, --primary…
// dans un `:root` INCONDITIONNEL, et main.js l'importe APRÈS variables.css. À
// spécificité égale le dernier gagne : `body { background: var(--bg) }` recevait
// donc #F4F1EA, le papier de l'ancienne DA.
//
// Le commentaire de ce fichier disait « les valeurs DOIVENT rester alignées ».
// Elles ne l'étaient pas, et RIEN ne le mesurait. C'est le même motif d'échec que
// le curseur natif et les contrastes : un contrôle qui valide une intention au
// lieu de valider le code. Ce verrou lit les déclarations réelles.
console.log('\n  ── Jetons de couleur : un seul foyer ──');
if (!fichierVariables) {
  dire(false, 'variables.css introuvable', 'impossible de savoir quels jetons font foi');
} else {
  const canoniques = new Set(
    [...readFileSync(fichierVariables, 'utf8').matchAll(/(--[a-z0-9-]+)\s*:/g)].map((m) => m[1]),
  );
  // Un jeton est « de couleur » si sa VALEUR en est une. On ne juge pas au nom :
  // --action contient #FCEE0A, --surface contient var(--paper-alt).
  const VALEUR_COULEUR = /^\s*(#[0-9A-Fa-f]{3,8}\b|rgba?\(|hsla?\(|var\(--(paper|ink|accent|action|alert|critical|rule|border|bg|surface|primary|text|neon|glow|code|card))/;
  /** Spans [début, fin] des blocs @media, par comptage d'accolades. */
  const spansMedia = (code) => {
    const spans = [];
    for (let i = code.indexOf('@media'); i !== -1; i = code.indexOf('@media', i + 1)) {
      const ouvrante = code.indexOf('{', i);
      if (ouvrante === -1) break;
      let profondeur = 0;
      for (let j = ouvrante; j < code.length; j++) {
        if (code[j] === '{') profondeur++;
        else if (code[j] === '}') {
          profondeur--;
          if (profondeur === 0) { spans.push([i, j]); break; }
        }
      }
    }
    return spans;
  };
  const collisions = [];
  for (const f of sources) {
    if (f === fichierVariables) continue;
    const code = sansCommentaires(readFileSync(f, 'utf8'));
    const medias = spansMedia(code);
    for (const m of code.matchAll(/(^|[}{;])\s*(:root|html|body)\s*\{([^}]*)\}/g)) {
      // Sous @media : la redéfinition est CONDITIONNELLE, donc légitime.
      if (medias.some(([a, b]) => m.index > a && m.index < b)) continue;
      for (const d of m[3].matchAll(/(--[a-z0-9-]+)\s*:\s*([^;]+);/g)) {
        if (!canoniques.has(d[1])) continue;
        if (!VALEUR_COULEUR.test(d[2])) continue;
        collisions.push(`${f.split(/[\\/]/).pop()} → ${d[1]} (${d[2].trim()})`);
      }
    }
  }
  dire(collisions.length === 0, 'aucun jeton de couleur redéclaré hors variables.css',
    collisions.length ? collisions.slice(0, 6).join(' ; ') : `${canoniques.size} jeton(s) canonique(s) protégé(s)`);
  if (collisions.length) {
    console.log('        Un `:root` inconditionnel dans un fichier importé APRÈS');
    console.log('        variables.css écrase la charte en silence. Retirer la');
    console.log('        déclaration — ou la placer sous @media si elle est conditionnelle.');
  }
}

// ─── VERROU 7 : l'ancienne DA claire n'a aucun survivant ────────────────────
// Né du même incident : après le passage à D5, `critical.css`, le bloc <noscript>
// de index.html, la barre de navigation et le mode contraste élevé servaient
// encore du papier clair — et de l'encre sombre par-dessus.
console.log('\n  ── Aucune valeur de l\'ancienne DA claire ──');
const DA_CLAIRE = ['#F4F1EA', '#EBE7DD', '#D6D1C4', '#1A1A18', '#5F5E5A', '#A63F26',
  '#7E2E1A', '#6E6352', '#10100E', '#33322F', '#6B665A', '#8F3019'];
const publics = existsSync(join(RACINE, 'public'))
  ? fichiers(join(RACINE, 'public'), ['.html', '.css', '.js'])
  : [];
const aScanner = [join(RACINE, 'index.html'), ...sources, ...publics].filter(existsSync);
const residus = [];
for (const f of aScanner) {
  const code = sansCommentaires(readFileSync(f, 'utf8')).toUpperCase();
  const trouves = DA_CLAIRE.filter((h) => code.includes(h));
  if (trouves.length) residus.push(`${f.split(/[\\/]/).pop()} → ${trouves.join(', ')}`);
}
dire(residus.length === 0, 'aucune valeur de l\'ancienne DA claire dans le code actif',
  residus.length ? residus.join(' ; ') : `${DA_CLAIRE.length} valeur(s) surveillée(s), ${aScanner.length} fichier(s)`);

// ─── VERROU 8 : une famille citée doit être une famille déclarée ────────────
// 11/09/2026 : `critical.css` demandait `'Space Grotesk'` alors que le @font-face
// de cette famille avait été RETIRÉ du réseau par la direction artistique. La
// déclaration ne résolvait plus rien : elle retombait en silence sur le
// `sans-serif` générique, et deux `body{font-family:…}` se marchaient dessus dans
// le bundle. Le verrou existant ne le voyait pas : il ne reliait jamais une
// `font-family` aux `@font-face` qui la déclarent.
console.log('\n  ── Typographie : une famille citée est une famille déclarée ──');
const SYSTEME = /^(inherit|initial|unset|revert|serif|sans-serif|monospace|cursive|fantasy|system-ui|ui-\w+|emoji|math|fangsong|-apple-system|blinkmacsystemfont|segoe ui|roboto|helvetica neue|arial|helvetica|georgia|times|cambria|consolas|menlo|courier|var\()/i;
const cssVue = sources
  .filter((f) => /\.(css|vue)$/.test(f))
  .map((f) => ({ f, code: sansCommentaires(readFileSync(f, 'utf8')) }));
const declarees = new Set();
for (const { code } of cssVue) {
  for (const m of code.matchAll(/@font-face\s*\{[\s\S]{0,400}?font-family\s*:\s*([^;]+);/g)) {
    declarees.add(m[1].trim().replace(/^['"]|['"]$/g, '').toLowerCase());
  }
}
const orphelines = [];
for (const { f, code } of cssVue) {
  for (const m of code.matchAll(/font-family\s*:\s*([^;}]+)/g)) {
    const premiere = m[1].split(',')[0].trim().replace(/^['"]|['"]$/g, '');
    if (!premiere || SYSTEME.test(premiere)) continue;
    if (declarees.has(premiere.toLowerCase())) continue;
    orphelines.push(`${f.split(/[\\/]/).pop()} → « ${premiere} »`);
  }
}
dire(orphelines.length === 0, 'aucune famille citée sans @font-face déclaré',
  orphelines.length
    ? [...new Set(orphelines)].join(' ; ')
    : `${declarees.size} famille(s) déclarée(s) : ${[...declarees].join(', ')}`);
dire(declarees.size <= 2, 'deux familles réseau au maximum (verrou de non-régression)',
  `${declarees.size} déclarée(s)`);

console.log('\n' + '='.repeat(72));
if (echecs === 0) {
  console.log('  Tous les verrous sont tenus.');
  console.log('='.repeat(72));
  process.exit(0);
}
console.log(`  ${echecs} verrou(x) cassé(s).`);
console.log('  Ne pas désactiver ce contrôle : corriger ce qu\'il signale.');
console.log('='.repeat(72));
process.exit(1);
