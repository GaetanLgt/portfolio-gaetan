#!/usr/bin/env node
/*
 * verifier-encodage.mjs — LE VERROU QUI FERME LE PIÈGE DU BOM.
 *
 * ⛔⛔⛔ POURQUOI IL EXISTE. IL A MORDU TROIS FOIS EN UNE SEULE JOURNÉE.
 *
 *   1. `public/.htaccess` — `Set-Content -Encoding UTF8` sous PowerShell 5.1 écrit un
 *      BOM. **Apache refuse un BOM en tête d'un `.htaccess` : erreur 500 sur TOUT le
 *      site, pendant une heure, pour tout le monde.**
 *   2. `verifier-paquet.ps1` — le même mécanisme, un étage plus bas : PowerShell 5.1
 *      lit un `.ps1` en ANSI s'il n'a pas de BOM, et **ce fichier-là DOIT en avoir un**.
 *   3. `package.json` — le BOM a fait échouer le build ENTIER :
 *        « Error: Invalid package config … Unexpected token '﻿', "{ »
 *      *Vite et PostCSS ne peuvent plus lire la configuration du projet.*
 *
 *   ⭐ ET LA LEÇON N'EST PAS « faire attention ». C'est qu'**un fichier de configuration
 *      n'a pas le même encodage qu'un script** — et que **PowerShell 5.1 pose un BOM sans
 *      le dire**. Une règle qu'on se rappelle trois fois de suite n'est pas une règle.
 *
 * CE QU'IL FAIT : il lit les TROIS PREMIERS OCTETS de chaque fichier critique, et il
 * vérifie que le BOM est là où il doit être, et absent là où il ne doit pas.
 *
 * ⚠️ ET IL EST BIDIRECTIONNEL — c'est ce qui le rend juste :
 *    · un fichier qui NE DOIT PAS avoir de BOM et qui en a un  → [KO]
 *    · un fichier qui DOIT en avoir un et qui n'en a pas      → [KO]
 *    *Un verrou qui ne vérifie qu'un sens laisse passer la moitié des défauts.*
 */

import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ICI = dirname(fileURLToPath(import.meta.url));
const RACINE = join(ICI, '..');

const vert = (s) => `\x1b[32m${s}\x1b[0m`;
const rouge = (s) => `\x1b[31m${s}\x1b[0m`;
const gris = (s) => `\x1b[90m${s}\x1b[0m`;

/*
 * ⭐ LA LISTE — et elle dit POURQUOI, pour chaque ligne.
 *    Un fichier s'ajoute ici le jour où son encodage casse quelque chose.
 *    Pas par principe : **parce qu'on l'a payé.**
 */
const FICHIERS = [
  {
    chemin: 'package.json', bom: false,
    pourquoi: 'Vite et PostCSS le lisent — un BOM casse le BUILD ENTIER',
    paye: '22/09/2026 : « Invalid package config … Unexpected token »',
  },
  {
    chemin: 'public/.htaccess', bom: false,
    pourquoi: 'Apache refuse un BOM en tête — erreur 500 sur tout le site',
    paye: '22/09/2026 : une heure de panne, pour tout le monde',
  },
  {
    chemin: 'index.html', bom: false,
    pourquoi: 'un BOM s’affiche avant le doctype et casse le rendu navigateur',
    paye: '',
  },
  {
    chemin: 'vite.config.js', bom: false,
    pourquoi: 'importé par Node avant le build',
    paye: '',
  },
  {
    // ⚠️ CELUI-CI EST L’INVERSE, ET C’EST LE PIÈGE DU 22/09 AU MATIN.
    //    PowerShell 5.1 lit un `.ps1` en ANSI sauf s’il porte un BOM UTF-8 —
    //    et un `.ps1` accentué sans BOM ne DÉMARRE PAS.
    chemin: 'C:/Users/neosp/Desktop/ARKADIA Studio Retro/MND/90-archive/QUARANTAINE/verifier-paquet.ps1',
    bom: true, absolu: true,
    pourquoi: 'PowerShell 5.1 le lit en ANSI sans BOM — les accents deviennent du charabia',
    paye: '22/09/2026 : le sas refusait de démarrer',
  },
];

console.log('\n' + '='.repeat(78));
console.log('  ENCODAGE — le BOM est là où il doit être, et absent là où il ne doit pas');
console.log('='.repeat(78));

const casses = [];
const ok = [];

for (const f of FICHIERS) {
  const chemin = f.absolu ? f.chemin : join(RACINE, f.chemin);
  const nom = f.absolu ? f.chemin.split('/').pop() : f.chemin;

  if (!existsSync(chemin)) {
    // ⚠️ Absent n'est PAS un échec d'encodage : on le dit, on ne condamne pas.
    console.log(`  ${gris('[--]')}  ${nom.padEnd(16)} ${gris('absent')}`);
    continue;
  }

  const b = readFileSync(chemin);
  const aBom = b[0] === 0xEF && b[1] === 0xBB && b[2] === 0xBF;
  const attendu = f.bom ? 'BOM' : 'sans BOM';
  const octets = `${b[0].toString(16).toUpperCase().padStart(2, '0')} ${b[1].toString(16).toUpperCase().padStart(2, '0')} ${b[2].toString(16).toUpperCase().padStart(2, '0')}`;

  if (aBom === f.bom) {
    ok.push(f);
    console.log(`  ${vert('[ok]')}  ${nom.padEnd(16)} ${gris(octets)}   ${gris(attendu)}`);
  } else {
    casses.push({ ...f, nom, aBom, octets, attendu });
    console.log(`  ${rouge('[KO]')}  ${nom.padEnd(16)} ${rouge(octets)}   attendu : ${attendu}`);
  }
}

console.log('='.repeat(78));

if (casses.length === 0) {
  console.log(vert(`  Encodage tenu — ${ok.length} fichier(s) vérifié(s).`));
  console.log('='.repeat(78) + '\n');
  process.exit(0);
}

console.log(rouge(`  ${casses.length} fichier(s) au mauvais encodage.`));
console.log('');
for (const c of casses) {
  console.log(rouge(`  ─── ${c.chemin} ───`));
  console.log(`    attendu : ${c.attendu}   ·   trouvé : ${c.aBom ? 'BOM' : 'sans BOM'}`);
  console.log(`    ${c.pourquoi}`);
  if (c.paye) console.log(gris(`    ⭐ payé : ${c.paye}`));
  console.log('');
}
console.log('  ⛔ POURQUOI CE VERROU EXISTE — ET PAS UNE RÈGLE QU’ON SE RAPPELLE :');
console.log('     **PowerShell 5.1 pose un BOM sans le dire.** `Set-Content -Encoding UTF8`');
console.log('     en écrit un. Et un fichier de configuration qui porte un BOM');
console.log('     **n\'est plus lisible par Node, par Apache, ni par Vite.**');
console.log('');
console.log('  ✅ LA CORRECTION, ET ELLE EST TOUJOURS LA MÊME :');
console.log(gris('     $utf8 = New-Object System.Text.UTF8Encoding($false)'));
console.log(gris('     [System.IO.File]::WriteAllText($chemin, $contenu, $utf8)'));
console.log('');
console.log('  Ne pas désactiver ce contrôle : réécrire le fichier sans BOM.');
console.log('='.repeat(78) + '\n');
process.exit(1);
