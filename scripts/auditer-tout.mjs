#!/usr/bin/env node
/*
 * auditer-tout.mjs — LE POINT DE PASSAGE UNIQUE DES VERROUS.
 *
 * ⛔ LE DÉFAUT QU'IL FERME, MESURÉ LE 22/09/2026 À 13h19 :
 *
 *   Huit verrous existaient sur le disque. Cinq tournaient dans la CI.
 *   Trois ne tournaient NULLE PART :
 *     · verifier-a11y-rendu.mjs
 *     · verifier-css-sans-balisage.mjs
 *     · verifier-presence.mjs   (écrit ce jour-là)
 *
 *   ⭐ Un verrou écrit mais JAMAIS LANCÉ n'est pas un verrou : c'est un fichier.
 *      **Il rassure sans protéger, et c'est pire que rien.**
 *
 * CE QU'IL FAIT : il découvre les verrous TOUT SEUL — il ne les liste pas.
 *   ⚠️ Une liste écrite à la main devient fausse dès qu'un verrou est ajouté, et
 *      personne ne s'en aperçoit. **On ÉNUMÈRE le dossier.** Un verrou déposé dans
 *      `scripts/` est pris en compte sans qu'on touche à ce fichier.
 *
 * ⭐ ET IL DIT CE QU'IL N'A PAS PU FAIRE : un verrou qui plante à l'exécution est
 *    signalé comme tel — ni vert par silence, ni rouge par confusion.
 */

import { readdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const ICI = dirname(fileURLToPath(import.meta.url));
const RACINE = join(ICI, '..');
const SCRIPTS = join(RACINE, 'scripts');
const DIST = join(RACINE, 'dist');

const vert = (s) => `\x1b[32m${s}\x1b[0m`;
const rouge = (s) => `\x1b[31m${s}\x1b[0m`;
const jaune = (s) => `\x1b[33m${s}\x1b[0m`;
const gris = (s) => `\x1b[90m${s}\x1b[0m`;

/*
 * ⭐⭐⭐ L'INTERRUPTEUR — IL APPARTIENT À GAËTAN.
 *
 *   Décision de Gaëtan, 22/09/2026 : « le verrou qui condamne, tu le fais sauter.
 *   C'EST MA PROPRE STRUCTURE, elle ne va pas m'emmerder. »
 *
 *   ⭐ Il a raison, et pas seulement parce que c'est son dépôt : **un garde-fou qui
 *     empêche de travailler est un garde-fou qu'on apprend à contourner en silence.**
 *     Et un contournement silencieux est pire qu'un verrou absent.
 *
 *   DONC : cet interrupteur existe, il est DOCUMENTÉ, il est VISIBLE dans la sortie.
 *   ⛔ Mais il ne s'active JAMAIS tout seul. Il faut le demander.
 *
 *   Usage :   SKIP_VERROUS=1 node scripts/auditer-tout.mjs
 *
 *   ⚠️ Et ce qu'il ne fait PAS : il ne rend pas les verrous verts. **Il les saute, et
 *      il le DIT en haut de la sortie.** *Un saut qui se déguise en succès est
 *      exactement le défaut qu'on a passé la journée à réparer.*
 */
const SAUT = process.env.SKIP_VERROUS === '1';

console.log('\n' + '='.repeat(78));
console.log('  AUDIT COMPLET — tous les verrous, un seul passage');
console.log('='.repeat(78));

/*
 * ⛔ ON TESTE LE FICHIER, PAS LE DOSSIER — corrigé le 22/09/2026.
 *
 *   Avant : `if (!existsSync(DIST))` — le DOSSIER `dist/`.
 *   ⚠️ Et pendant un build, le dossier existe et `index.html` n'est pas encore écrit.
 *      Résultat mesuré : **les huit verrous se sont lancés et six ont crié**, chacun
 *      sur un fichier absent — *six cris pour un seul fait*.
 *
 *   ⭐ Un audit qui crie six fois pour une cause unique apprend à être ignoré, et
 *     c'est exactement ce qu'on a passé la journée à réparer.
 *     **On constate UNE fois, on s'arrête, et on dit pourquoi.**
 */
const TEMOIN = join(DIST, 'index.html');

if (!existsSync(TEMOIN)) {
  console.log(jaune('  [--]  dist/index.html est absent.'));
  if (existsSync(DIST)) {
    console.log(gris('        Le dossier dist/ existe, mais la page d’entrée n’est pas'));
    console.log(gris('        écrite : un build est probablement EN COURS, ou interrompu.'));
  } else {
    console.log(gris('        Le dossier dist/ lui-même n’existe pas : aucun build n’a tourné.'));
  }
  console.log('');
  console.log(gris('  ⭐ On ne lance PAS les verrous : ils mesureraient le vide, et six d’entre'));
  console.log(gris('     eux criraient pour une seule et même cause. Une constatation, pas huit.'));
  console.log('='.repeat(78) + '\n');
  process.exit(SAUT ? 0 : 1);
}

if (SAUT) {
  console.log(jaune('  ⚠️  SKIP_VERROUS=1 — LES VERROUS SONT SAUTÉS.'));
  console.log(gris('      Ce n’est pas un succès : c’est un saut volontaire.'));
  console.log(gris('      Rien n’a été mesuré. On le dit au lieu de faire semblant.'));
  console.log('='.repeat(78) + '\n');
  process.exit(0);
}

/* --- LA DÉCOUVERTE : on énumère, on ne liste pas. ---------------------------- */
const verrous = readdirSync(SCRIPTS)
  .filter((f) => f.startsWith('verifier-') && f.endsWith('.mjs'))
  .sort();

if (verrous.length === 0) {
  console.log(rouge('  [KO]  aucun verrou trouvé dans scripts/.'));
  console.log(gris('        Soit le dossier a changé, soit on regarde au mauvais endroit.'));
  console.log('='.repeat(78) + '\n');
  process.exit(1);
}

console.log(`  ${verrous.length} verrou(x) découvert(s) par énumération du dossier.\n`);

/* --- L'EXÉCUTION ------------------------------------------------------------- */
const resultats = [];

for (const v of verrous) {
  const t0 = Date.now();
  const r = spawnSync(process.execPath, [join(SCRIPTS, v)], {
    cwd: RACINE,
    encoding: 'utf8',
    timeout: 300_000,
  });
  const ms = Date.now() - t0;
  const code = r.status;

  let etat;
  if (code === 0) etat = 'ok';
  else if (code === null) etat = 'plante';        // tué ou timeout — pas un échec métier
  else etat = 'ko';

  resultats.push({ v, code, etat, ms, sortie: (r.stdout || '') + (r.stderr || '') });

  const nom = v.replace(/^verifier-/, '').replace(/\.mjs$/, '');
  const marque = etat === 'ok' ? vert('[ok]  ') : etat === 'ko' ? rouge('[KO]  ') : rouge('[??]  ');
  console.log(`  ${marque}${nom.padEnd(26)} ${gris(String(ms).padStart(6) + ' ms')}   exit=${code}`);
}

/* --- LE VERDICT -------------------------------------------------------------- */
const casses = resultats.filter((r) => r.etat !== 'ok');

console.log('='.repeat(78));

if (casses.length === 0) {
  console.log(vert(`  Les ${resultats.length} verrous sont tenus.`));
  console.log('='.repeat(78) + '\n');
  process.exit(0);
}

console.log(rouge(`  ${casses.length} verrou(x) sur ${resultats.length} ne passent pas.`));
console.log('');

for (const c of casses) {
  console.log(rouge(`  ─── ${c.v} ───`));
  // ⚠️ On montre les lignes qui PARLENT : `[KO]`, `[!!]`, `Error`, et les comptes.
  const parlantes = c.sortie
    .split(/\r?\n/)
    .filter((l) => /\[KO\]|\[!!\]|Error|error|absent|manquant|ne sont plus là|échou|ECHEC/.test(l))
    .slice(0, 8);
  if (parlantes.length > 0) {
    for (const l of parlantes) console.log('    ' + l.trim());
  } else {
    console.log(gris('    (aucune ligne parlante — la sortie complète est à relancer)'));
    const dernieres = c.sortie.split(/\r?\n/).filter(Boolean).slice(-5);
    for (const l of dernieres) console.log(gris('    ' + l.trim()));
  }
  console.log('');
}

console.log('  Ne pas désactiver ce contrôle : corriger ce qu’il signale.');
console.log('  ⭐ Et si un verrou est absent de ce passage, c’est qu’il ne s’appelle');
console.log('     pas `verifier-*.mjs` dans scripts/ — donc personne ne le lance.');
console.log('='.repeat(78) + '\n');
process.exit(1);
