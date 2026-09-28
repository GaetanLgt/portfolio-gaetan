#!/usr/bin/env node
// ============================================================================
// comparer-depot-serveur.mjs — GL Digital Lab — 29/09/2026
//
// Compare ce qui est DANS LE DÉPÔT avec ce qui est SERVI en ligne.
//
// ═══════════════════════════════════════════════════════════════════════════
// LE DÉFAUT QUI A PRODUIT CET OUTIL — mesuré le 29/09/2026
// ═══════════════════════════════════════════════════════════════════════════
//
// `https://gldigitallab.fr/monde/` était **EN LIGNE**, répondait 200, et publiait
// **30 documents internes du studio** : trois rapports d'incident, un plan de
// réponse à incident, deux journaux serveur, une transcription portant le nom de
// la machine, et le nom d'un client. **Aucun `noindex`.** Indexable.
//
// ⛔ CETTE PAGE N'ÉTAIT DANS AUCUN CONTRÔLE, ET PAS PAR NÉGLIGENCE :
//    le contrôle de publication (`verifier-publication.mjs`) lit les fichiers de
//    `cinematique/`. `/monde/` **n'est pas dans `cinematique/`** — elle est sur le
//    serveur, posée par le pipeline Vue arrêté le 26/09, **sans source versionnée**.
//
// ⭐ *Un garde-fou qui ne couvre qu'un chemin est une porte.* Ici le chemin
//    manquant n'était pas un fichier : c'était **tout ce qui est servi sans être
//    dans le dépôt**. Un fichier propre devient sale en étant servi — et rien ne
//    comparait les deux.
//
// ═══════════════════════════════════════════════════════════════════════════
// CE QUE CET OUTIL FAIT — et ce qu'il ne peut PAS faire
// ═══════════════════════════════════════════════════════════════════════════
//
//   ✅ Il confronte deux ensembles : les fichiers du dépôt, et ce que le serveur
//      rend réellement, URL par URL.
//   ✅ Il nomme les trois écarts qui comptent :
//        · SERVI SANS SOURCE   — une page en ligne qui n'est dans aucun dépôt
//        · DANS LE DÉPÔT, PAS SERVI — un fichier commité qui n'est pas en ligne
//        · DIVERGENT           — les deux existent, et le contenu diffère
//
//   ⛔ Il ne peut PAS énumérer le serveur : le FTP est en écriture mais le
//      listage n'est pas exposé en HTTP. **On ne découvre donc que les URLs qu'on
//      lui donne.** ⚠️ C'EST UNE LIMITE RÉELLE, ET ELLE DOIT SE DIRE : cet outil
//      compare ce qu'on lui désigne, il ne balaie pas le serveur. *Un contrôle
//      dont on ignore la limite finit par être cru au-delà de ce qu'il fait.*
//
//      ⇒ La liste des URLs vient de `outils/surfaces-publiques.json`, qui est
//        ÉCRIT À LA MAIN et doit être tenu à jour. C'est une dette assumée : tant
//        qu'on n'a pas d'inventaire serveur, l'inventaire est une liste.
//
// Usage :
//   node outils/comparer-depot-serveur.mjs            (rapport, code 1 si écart)
//   node outils/comparer-depot-serveur.mjs --json     (sortie machine)
//
// Codes : 0 = concordance  ·  1 = au moins un écart  ·  2 = liste illisible
// ============================================================================

import { readFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ICI = path.dirname(fileURLToPath(import.meta.url));
const RACINE = path.resolve(ICI, '..');
const CINEMA = path.join(RACINE, 'cinematique');
const LISTE = path.join(ICI, 'surfaces-publiques.json');
const DOMAINE = 'https://gldigitallab.fr';
const JSON_SEUL = process.argv.includes('--json');

if (!existsSync(LISTE)) {
  console.error(`⛔ ${LISTE} est absent — cet outil ne devine pas les URLs, il les lit.`);
  process.exit(2);
}

/* ------------------------------------------------------------------ *
 * ① LA LISTE — les surfaces qu'on surveille
 * ------------------------------------------------------------------ */

const { urls } = JSON.parse(readFileSync(LISTE, 'utf8'));
if (!Array.isArray(urls) || !urls.length) {
  console.error('⛔ la liste des surfaces est vide — un contrôle à vide ne prouve rien.');
  process.exit(2);
}

/* ------------------------------------------------------------------ *
 * ② LA CORRESPONDANCE URL → FICHIER DU DÉPÔT
 * ------------------------------------------------------------------ */

/** `/formation/` → `cinematique/formation/index.html` · `/llms.txt` → `cinematique/llms.txt` */
function fichierPour(url) {
  const net = url.replace(/^\//, '');
  if (!net) return path.join(CINEMA, 'index.html');
  if (url.endsWith('/')) return path.join(CINEMA, net, 'index.html');
  return path.join(CINEMA, net);
}

/* ------------------------------------------------------------------ *
 * ③ LA COMPARAISON
 * ------------------------------------------------------------------ */

const resultats = [];

for (const url of urls) {
  const attendu = fichierPour(url);
  const dansDepot = existsSync(attendu);

  let statut = null;
  let taille = null;
  let corps = null;
  try {
    const r = await fetch(DOMAINE + url, { redirect: 'follow' });
    statut = r.status;
    if (r.ok) {
      corps = await r.text();
      taille = corps.length;
    }
  } catch (e) {
    statut = `ERREUR ${e.message}`;
  }

  const servi = statut === 200;

  // ── le verdict, et il est nommé ────────────────────────────────────────
  let verdict;
  if (servi && !dansDepot) {
    verdict = 'SERVI-SANS-SOURCE';
  } else if (!servi && dansDepot) {
    verdict = 'DEPOT-NON-SERVI';
  } else if (servi && dansDepot) {
    // ⛔⛔ LA COMPARAISON A ÉTÉ CORRIGÉE LE 29/09/2026, APRÈS AVOIR CRIÉ POUR RIEN.
    //
    //    Première version : longueur comparée à 1 % près + égalité du <title>.
    //    Résultat du premier run : **3 faux positifs sur 3** (`/`, `mentions-legales.html`,
    //    `security.txt`), avec des écarts de 1,05 % à 1,98 % — alors que les titres
    //    étaient IDENTIQUES et le contenu réellement déployé.
    //
    //    La cause n'était pas le seuil, c'était MA MESURE : les fins de ligne. Le
    //    dépôt est en CRLF (Windows) et le serveur sert du LF. Sur un fichier de
    //    1 046 caractères avec ~40 lignes, cela fait ~40 caractères d'écart — soit
    //    3,8 %, à lui seul.
    //
    //    ⭐ *Élargir le seuil aurait été le réflexe et c'était le mauvais : on ne
    //       corrige pas une mesure fausse en la rendant plus tolérante, on corrige
    //       la mesure.* **Un contrôle qui crie pour rien est un contrôle qu'on
    //       désactive** — et celui-ci aurait été désactivé dans la semaine.
    //
    //    ⇒ On NORMALISE avant de comparer : fins de ligne unifiées, espaces de fin
    //      de ligne retirés. Ce qui reste est une vraie différence de contenu.
    const normaliser = (t) => t.replace(/\r\n/g, '\n').replace(/[ \t]+$/gm, '').trim();
    const local = normaliser(readFileSync(attendu, 'utf8'));
    const enLigne = normaliser(corps);

    const titreLocal = (local.match(/<title>([^<]*)<\/title>/i) || [, ''])[1];
    const titreServi = (enLigne.match(/<title>([^<]*)<\/title>/i) || [, ''])[1];

    if (titreLocal !== titreServi) {
      verdict = 'DIVERGENT';
    } else if (local.length !== enLigne.length) {
      // après normalisation, un écart de longueur EST un écart de contenu
      verdict = 'DIVERGENT';
    } else if (local !== enLigne) {
      verdict = 'DIVERGENT';
    } else {
      verdict = 'CONCORDE';
    }
  } else {
    verdict = 'ABSENT-DES-DEUX';
  }

  resultats.push({ url, statut, taille, dansDepot, verdict });
}

/* ------------------------------------------------------------------ *
 * ④ LA SORTIE
 * ------------------------------------------------------------------ */

const ordre = ['DIVERGENT', 'SERVI-SANS-SOURCE', 'DEPOT-NON-SERVI', 'ABSENT-DES-DEUX', 'CONCORDE'];
const grave = resultats.filter((r) => r.verdict === 'DIVERGENT' || r.verdict === 'SERVI-SANS-SOURCE');

if (JSON_SEUL) {
  console.log(JSON.stringify({ quand: new Date().toISOString(), resultats }, null, 2));
  process.exit(grave.length ? 1 : 0);
}

console.log('');
console.log('  DÉPÔT ↔ SERVEUR — confrontation des surfaces');
console.log('  ' + '─'.repeat(74));
console.log(`  quand : ${new Date().toLocaleString('fr-FR')}`);
console.log('');

for (const v of ordre) {
  const lot = resultats.filter((r) => r.verdict === v);
  if (!lot.length) continue;
  const marque = v === 'CONCORDE' ? '✅' : v === 'DIVERGENT' || v === 'SERVI-SANS-SOURCE' ? '⛔' : '⚠️ ';
  console.log(`  ${marque} ${v}  (${lot.length})`);
  for (const r of lot) {
    console.log(`       ${r.url.padEnd(28)} HTTP ${String(r.statut).padEnd(5)} ${r.taille ?? '—'} o`);
  }
  console.log('');
}

console.log('  ' + '─'.repeat(74));
console.log(`  ${resultats.length} surface(s) confrontée(s) · ${grave.length} écart(s) grave(s)`);
if (grave.length) {
  console.log('');
  console.log('  ⛔ SERVI SANS SOURCE = une page en ligne que personne ne versionne.');
  console.log('     Elle échappe à TOUT contrôle de publication, par construction.');
  console.log('     → Soit elle entre dans le dépôt, soit elle sort du serveur.');
}
console.log('');
process.exit(grave.length ? 1 : 0);
