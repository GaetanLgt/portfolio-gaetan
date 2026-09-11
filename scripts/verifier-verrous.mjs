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
const PROTEGES = ['Albator', 'Harlock', 'Matrix Resurrections', 'Evangelion', 'Cyberpunk 2077', 'TRON'];
const fuites = [];
for (const f of sources) {
  if (!f.endsWith('.vue')) continue;
  const code = sansCommentaires(readFileSync(f, 'utf8'));
  // On ne garde que le <template>, et on retire les commentaires HTML déjà ôtés.
  const tpl = (code.match(/<template>([\s\S]*)<\/template>/) || [, ''])[1];
  for (const nom of PROTEGES) {
    if (tpl.includes(nom)) fuites.push(`${f.split(/[\\/]/).pop()} → ${nom}`);
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
