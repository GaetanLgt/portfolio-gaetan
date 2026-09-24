#!/usr/bin/env node
/* ═══════════════════════════════════════════════════════════════════════════════
   eprouver-langues.mjs — LA PORTE DE LANGUES SAIT-ELLE DIRE NON ?
   ═══════════════════════════════════════════════════════════════════════════════

   23/09/2026 — GL Digital Lab, par Samus (harnais).

   POURQUOI CE FICHIER EXISTE
   -----------------------------------------------------------------------------
   La porte `verifier-langues.mjs` est écrite, elle est honnête, et elle tourne.
   ⛔ MAIS SUR LE VRAI DÉPÔT, ELLE N'A JAMAIS REFUSÉ QUOI QUE CE SOIT : les six
   autres langues ne sont pas écrites, donc elle ne peut rien comparer — elle sort
   en 3, et le mode `--porte` ramène ce 3 à 0.

   ⭐ « Une porte qui n'a jamais dit NON n'est pas une porte : c'est une décoration. »
   ⇒ On l'éprouve sur des TÉMOINS, sans toucher au vrai dépôt. C'est déjà prévu par
     la porte elle-même (`--dossier`), et le dépôt réclamait cette épreuve :

       package.json, à propos de `npm run langues` :
       « Pour la rebrancher : l'éprouver d'abord dans la CI, sur un cas qui passe
         ET un qui échoue. »

   ⛔ CE QUE CETTE ÉPREUVE REFUSE DE FAIRE
   -----------------------------------------------------------------------------
   · Elle n'écrit RIEN dans `src/locales/`. *Un contrôle qu'on ne peut éprouver
     qu'en polluant le vrai dépôt est un contrôle qu'on n'éprouvera jamais.*
   · Elle ne recopie PAS la liste des clés : elle la lit dans `fr.js`.
     *Une épreuve qui porte sa propre liste éprouve une autre configuration que
     celle qui sera publiée.*
   · Elle ne déclare pas « réussi » quand un témoin n'a rien rendu. Un code attendu
     qui n'arrive pas est un ÉCHEC, jamais un succès par défaut.

   USAGE
     node scripts/eprouver-langues.mjs
   Sortie : 0 si les six témoins rendent le code attendu, 1 sinon.
   ═══════════════════════════════════════════════════════════════════════════════ */

import { mkdirSync, writeFileSync, copyFileSync, rmSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { spawnSync } from 'node:child_process';

const ICI = dirname(fileURLToPath(import.meta.url));
const RACINE = join(ICI, '..');
const TEMOINS = join(RACINE, 'tmp', 'epreuve-langues');
const PORTE = join(ICI, 'verifier-langues.mjs');
const FICHIER_FR = join(RACINE, 'src', 'locales', 'fr.js');

/* ── ① LA RÉFÉRENCE, LUE — même règle d'aplatissement que la porte ───────────── */
function aplatir(obj, prefixe = '', sortie = {}) {
  for (const [k, v] of Object.entries(obj)) {
    const cle = prefixe ? prefixe + '.' + k : k;
    if (v && typeof v === 'object' && !Array.isArray(v)) aplatir(v, cle, sortie);
    else sortie[cle] = v;
  }
  return sortie;
}

if (!existsSync(FICHIER_FR)) {
  console.error('⛔ src/locales/fr.js est absent : il n’y a pas de référence à éprouver.');
  process.exit(1);
}

const mFr = await import(pathToFileURL(FICHIER_FR).href);
const ref = aplatir(mFr.default || mFr);
const CLES = Object.keys(ref).sort();

if (CLES.length === 0) {
  console.error('⛔ fr.js se charge mais ne contient AUCUNE clé. Rien à éprouver.');
  process.exit(1);
}

/* ── ② LES TÉMOINS ────────────────────────────────────────────────────────────
   Un témoin, c’est un dossier qui contient un `fr.js` identique au vrai, et un
   `de.js` fabriqué pour porter UN défaut précis. *Un témoin par défaut : si un
   seul dossier portait les trois, on ne saurait pas lequel a été vu.*           */

rmSync(TEMOINS, { recursive: true, force: true });

function ecrireDe(dossier, entrees, { supprimer = [], vide = [], ajouter = {} } = {}) {
  mkdirSync(dossier, { recursive: true });
  copyFileSync(FICHIER_FR, join(dossier, 'fr.js'));

  const plat = {};
  for (const c of CLES) {
    if (supprimer.includes(c)) continue;
    plat[c] = vide.includes(c) ? '' : 'de:' + c;
  }
  for (const [k, v] of Object.entries(ajouter)) plat[k] = v;

  writeFileSync(join(dossier, 'de.js'), 'export default ' + JSON.stringify(plat, null, 2) + '\n', 'utf8');
  return Object.keys(plat).length;
}

const troisPremieres = CLES.slice(0, 3);

const CAS = [
  {
    nom: 'incomplet',
    quoi: 'de.js avec 3 clés manquantes',
    attendu: 1,
    args: [],
    monter: () => ecrireDe(join(TEMOINS, 'incomplet'), null, { supprimer: troisPremieres }),
  },
  {
    nom: 'complet',
    quoi: 'de.js avec les ' + CLES.length + ' clés — et les 5 autres langues ABSENTES',
    attendu: 0,
    args: [],
    /* ⭐ C’EST LE CAS LE PLUS IMPORTANT, ET C’EST UNE RÉGRESSION DOCUMENTÉE.
       Le commentaire de la porte (l. 146-156) raconte : `de.js` copié de `fr.js`,
       22/22 clés, ZÉRO écart — et pourtant « 5 PROBLÈME(S) », sortie 1, à cause des
       cinq langues annoncées sans fichier. ⇒ La porte ne pouvait donc jamais rendre 0
       avant que les sept langues soient écrites, c’est-à-dire jamais.
       Ce témoin prouve que la correction tient. Si un jour il rend 1, la porte est
       redevenue un interdit général — et ce test le dira AVANT la CI. */
    monter: () => ecrireDe(join(TEMOINS, 'complet'), null),
  },
  {
    nom: 'vide',
    quoi: 'de.js complet, mais une clé à chaîne vide',
    attendu: 1,
    args: [],
    monter: () => ecrireDe(join(TEMOINS, 'vide'), null, { vide: [CLES[0]] }),
  },
  {
    nom: 'en-trop',
    quoi: 'de.js complet + une clé qui n’existe pas en français',
    attendu: 1,
    args: [],
    monter: () => ecrireDe(join(TEMOINS, 'en-trop'), null, { ajouter: { 'cle.inventee.pour.lepreuve': 'de:trop' } }),
  },
  {
    nom: 'source-seule',
    quoi: 'fr.js seul — aucune langue comparable',
    attendu: 3,
    args: [],
    monter: () => { mkdirSync(join(TEMOINS, 'source-seule'), { recursive: true }); copyFileSync(FICHIER_FR, join(TEMOINS, 'source-seule', 'fr.js')); return 1; },
  },
  {
    nom: 'source-seule-porte',
    quoi: 'fr.js seul, en MODE PORTE — le build ne doit pas être interdit',
    attendu: 0,
    args: ['--porte'],
    monter: () => { mkdirSync(join(TEMOINS, 'source-seule-porte'), { recursive: true }); copyFileSync(FICHIER_FR, join(TEMOINS, 'source-seule-porte', 'fr.js')); return 1; },
  },
];

/* ── ③ LA PASSE ───────────────────────────────────────────────────────────────
   ⚠️ `stdio: 'inherit'` EST DÉLIBÉRÉ, et ce n’est pas un détail de confort :
   sous le bac à sable Windows, un enfant lancé avec un tuyau (`pipe`) échoue en
   EPERM. *On ne capture pas la sortie : on la laisse passer, et on lit le CODE —
   qui est justement ce que cette épreuve mesure.*                                */

console.log('════════════════════════════════════════════════════════════════════');
console.log(' Épreuve de la porte de langues — six témoins');
console.log('════════════════════════════════════════════════════════════════════');
console.log('  référence lue dans fr.js : ' + CLES.length + ' clés');
console.log('  témoins                  : ' + TEMOINS);
console.log('');

const resultats = [];

for (const cas of CAS) {
  const dossier = join(TEMOINS, cas.nom);
  const posees = cas.monter();

  console.log('────────────────────────────────────────────────────────────────────');
  console.log(' TÉMOIN : ' + cas.nom);
  console.log('   ' + cas.quoi);
  console.log('   de.js posé : ' + (cas.nom.startsWith('source-seule') ? 'aucun (témoin volontaire)' : posees + ' clé(s)'));
  console.log('   attendu    : code ' + cas.attendu);
  console.log('');

  const r = spawnSync(process.execPath, [PORTE, '--dossier', dossier, ...cas.args], { stdio: 'inherit' });

  /* ⛔ `r.status` VAUT `null` QUAND LE PROCESSUS A ÉTÉ TUÉ PAR UN SIGNAL.
     Un `null` comparé à `0` ne lève rien : il faut donc le refuser EXPLICITEMENT.
     *Un contrôle qui lit « pas de code » comme « code 0 » valide au lieu de bloquer.* */
  const code = r.status;
  const obtenu = (code === null || code === undefined) ? null : code;
  const tenu = obtenu === cas.attendu;

  console.log('');
  console.log('   obtenu     : ' + (obtenu === null ? 'AUCUN (processus tué ou jamais rendu)' : 'code ' + obtenu) + '   ' + (tenu ? '✅' : '⛔'));

  resultats.push({ ...cas, obtenu, tenu });
}

/* ── ④ LE VERDICT ─────────────────────────────────────────────────────────── */
console.log('════════════════════════════════════════════════════════════════════');
console.log(' VERDICT');
console.log('════════════════════════════════════════════════════════════════════');

for (const r of resultats) {
  console.log('  ' + (r.tenu ? '✅' : '⛔') + '  ' + r.nom.padEnd(20) +
    ' attendu ' + r.attendu + ' · obtenu ' + (r.obtenu === null ? 'aucun' : r.obtenu));
}

const rates = resultats.filter((r) => !r.tenu);

console.log('');
if (rates.length) {
  console.log('  ⛔ ' + rates.length + ' témoin(s) sur ' + resultats.length + ' ne rendent PAS le code attendu.');
  console.log('     ⇒ La porte ne se comporte pas comme elle le dit. NE PAS LA BRANCHER.');
  console.log('     *Un contrôle qui échoue à son épreuve est un contrôle qui validera n’importe quoi.*');
  process.exitCode = 1;
} else {
  console.log('  ✅ ' + resultats.length + ' témoins sur ' + resultats.length + ' rendent le code attendu.');
  console.log('     ⭐ La porte SAIT DIRE NON (témoins incomplet, vide, en-trop → code 1),');
  console.log('        elle sait DIRE « je ne peux pas conclure » (3), elle SAIT PASSER (0),');
  console.log('        et le mode porte ne bloque pas un build sur une abstention.');
  console.log('     ⇒ Elle peut être branchée — si Gaëtan le décide.');
  process.exitCode = 0;
}

/* =============================================================================
   ⚠️ CE QUE CETTE ÉPREUVE NE PROUVE PAS
   -----------------------------------------------------------------------------
   · **Elle ne prouve pas que la porte attrape un DÉFAUT RÉEL dans une vraie
     traduction.** *Elle prouve qu’elle réagit comme annoncé sur des défauts
     fabriqués.* C’est exactement ce qui manquait, et ce n’est pas la même chose.
   · **Elle ne prouve rien sur la QUALITÉ des traductions.** *La porte compte les
     clés ; elle ne les lit pas. Une traduction fausse passe les deux.*
   · **Elle ne branche rien.** `package.json` porte la décision du 23/09 : la porte
     reste DISPONIBLE (`npm run langues`) et ne bloque rien. La rebrancher est une
     décision de Gaëtan, pas une conséquence de cette épreuve.
   · **Elle n’écrit que dans `tmp/epreuve-langues/`.** Le vrai `src/locales/` n’est
     jamais touché : sa liste de clés est LUE, jamais modifiée.
   ============================================================================= */
