#!/usr/bin/env node
/*
 * verifier-presence.mjs — LE VERROU DE PRÉSENCE
 *
 * ⛔ LE DÉFAUT QU'IL FERME, ET IL A ÉTÉ PAYÉ LE 22/09/2026.
 *
 *   Ce jour-là, `HomePage.vue` a été restauré depuis un commit antérieur par une
 *   commande d'urgence (`git checkout <commit> -- src/views/core/HomePage.vue`).
 *   Trois modifications livrées par un autre chantier ont été EFFACÉES.
 *
 *   ⭐ Et voici ce qui s'est passé ensuite : **le build est resté VERT.**
 *     · les 5 verrous sortaient en 0 ;
 *     · le site se déployait ;
 *     · et le site ne contenait PLUS RIEN du travail livré.
 *
 *   ⛔ **Un verrou qui contrôle la QUALITÉ ne contrôle pas la PRÉSENCE.**
 *      *Un build vert sur un travail effacé est un build vert sur rien.*
 *
 * CE QU'IL FAIT : il compare ce que le HTML LIVRÉ contient réellement (dans `dist/`)
 * à une liste d'ACTIFS attendus, écrite une seule fois dans `src/config/actifs.js`.
 *
 * ⚠️ ET CE QU'IL NE FAIT PAS : il ne juge pas la QUALITÉ de ce qu'il trouve.
 *    Il dit « c'est là » ou « ce n'est plus là ». Le reste appartient aux autres verrous.
 */

import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ICI = dirname(fileURLToPath(import.meta.url));
const RACINE = join(ICI, '..');
const DIST = join(RACINE, 'dist');
const ACTIFS = join(RACINE, 'src', 'config', 'actifs.js');

const vert = (s) => `\x1b[32m${s}\x1b[0m`;
const rouge = (s) => `\x1b[31m${s}\x1b[0m`;
const gris = (s) => `\x1b[90m${s}\x1b[0m`;

console.log('\n' + '='.repeat(78));
console.log('  PRÉSENCE — ce qui a été LIVRÉ est-il encore LÀ ?');
console.log('='.repeat(78));

/* --- 1. Le dist existe-t-il ? ------------------------------------------------
 * ⚠️ Un `dist/` absent n'est PAS un échec de présence : c'est un build qui n'a pas
 *    tourné. On le dit, et on sort en 0 — sinon le verrou accuserait à tort quand
 *    on l'appelle avant le build. */
if (!existsSync(DIST)) {
  console.log(gris('  [--]  dist/ absent — le build n’a pas encore tourné.'));
  console.log(gris('        Ce verrou ne dit rien avant le build, et il le dit.'));
  console.log('='.repeat(78) + '\n');
  process.exit(0);
}

/* --- 2. La liste des actifs ---------------------------------------------------
 * ⭐ Écrite UNE FOIS. Si elle vit à deux endroits, la seconde deviendra fausse. */
if (!existsSync(ACTIFS)) {
  console.log(rouge('  [KO]  src/config/actifs.js est ABSENT.'));
  console.log(gris('        Sans la liste des actifs attendus, ce verrou ne peut rien'));
  console.log(gris('        vérifier. On ne devine pas ce qui devait être livré.'));
  console.log('='.repeat(78) + '\n');
  process.exit(1);
}

const { ACTIFS: attendus } = await import('file://' + ACTIFS.replace(/\\/g, '/'));
if (!Array.isArray(attendus) || attendus.length === 0) {
  console.log(rouge('  [KO]  la liste des actifs est vide — elle ne vérifie donc rien.'));
  console.log(gris('        Un verrou qui ne vérifie rien est pire qu’aucun verrou :'));
  console.log(gris('        il rassure.'));
  console.log('='.repeat(78) + '\n');
  process.exit(1);
}

/* --- 3. Le contrôle ---------------------------------------------------------- */
const manquants = [];
const trouves = [];

for (const a of attendus) {
  const fichier = join(DIST, a.fichier || 'index.html');
  if (!existsSync(fichier)) {
    manquants.push({ ...a, motif: `le fichier ${a.fichier || 'index.html'} n’existe pas` });
    continue;
  }
  const html = readFileSync(fichier, 'utf8');
  // Chaque actif porte des MOTIFS : des chaînes qui doivent être dans le HTML LIVRÉ.
  const absents = (a.motifs || []).filter((m) => !html.includes(m));
  if (absents.length > 0) {
    manquants.push({ ...a, motif: `absent du HTML : ${absents.map((m) => `« ${m} »`).join(', ')}` });
  } else {
    trouves.push(a);
  }
}

console.log(`  ${attendus.length} actif(s) attendu(s) dans le HTML LIVRÉ\n`);

for (const a of trouves) {
  console.log(`  ${vert('[ok]')}  ${a.nom.padEnd(34)} ${gris(a.pourquoi || '')}`);
}
for (const a of manquants) {
  console.log(`  ${rouge('[KO]')}  ${a.nom.padEnd(34)} ${rouge(a.motif)}`);
  if (a.pourquoi) console.log(`        ${gris('attendu : ' + a.pourquoi)}`);
}

console.log('='.repeat(78));

if (manquants.length > 0) {
  console.log(rouge(`  ${manquants.length} actif(s) LIVRÉ(s) ne sont plus là.`));
  console.log('');
  console.log('  ⛔ CE N’EST PAS UN DÉFAUT DE QUALITÉ : c’est un travail DISPARU.');
  console.log('     La cause la plus fréquente est un `git checkout <commit> -- <fichier>`');
  console.log('     d’urgence qui restaure un fichier et efface ce qu’un autre y avait mis.');
  console.log('');
  console.log('     ⭐ Et le build, lui, reste VERT. C’est précisément pour ça que ce');
  console.log('        verrou existe : sans lui, la perte est SILENCIEUSE.');
  console.log('');
  console.log('  Ne pas désactiver ce contrôle : retrouver ce qui a disparu.');
  console.log('='.repeat(78) + '\n');
  process.exit(1);
}

console.log(vert(`  Tous les actifs livrés sont présents — ${trouves.length}/${attendus.length}.`));
console.log('='.repeat(78) + '\n');
