#!/usr/bin/env node
// ============================================================================
// adosser-pages-serveur.mjs — GL Digital Lab — 29/09/2026
//
// Adosse au site les pages qui existent SUR LE SERVEUR mais pas dans le dépôt.
//
// ═══════════════════════════════════════════════════════════════════════════
// POURQUOI CET OUTIL EXISTE — MESURE DU 29/09/2026
// ═══════════════════════════════════════════════════════════════════════════
//
// En inventoriant les surfaces publiques de gldigitallab.fr, quatre pages sont
// apparues — publiées, répondant 200, et **inatteignables au clic** :
//
//     /services/     135 406 o
//     /laboratoire/  124 197 o
//     /demos/         12 450 o
//     /eva01/        128 226 o
//     /monde/         39 136 o
//
// Aucune n'est liée depuis la page d'accueil (0 occurrence), aucune n'est
// déclarée au plan de site, aucune n'est dans `robots.txt`, et **aucune n'a de
// source dans le dépôt déployé** (`cinematique/`). Elles viennent du site Vue
// dont `deploy.yml` a été arrêté le 26/09/2026 — elles sont restées en ligne.
//
// ⭐ *Une page que personne ne peut atteindre n'existe pas* — la règle est déjà
//    écrite dans le studio. Elle était appliquée aux pages du récit, pas à celles-là.
//
// ═══════════════════════════════════════════════════════════════════════════
// ⛔ CE QUE CET OUTIL NE FAIT PAS, ET C'EST DÉLIBÉRÉ
// ═══════════════════════════════════════════════════════════════════════════
//
//   · Il n'ÉCRIT RIEN sur le serveur. Il lit et il écrit dans le dépôt, point.
//     La mise en ligne reste une décision de Gaëtan (§ 5).
//   · Il ne récupère PAS les dépendances hashées (`assets/index-8KiEqFdU.js`).
//     Ces noms changent à chaque build Vue : les recopier créerait une dette qui
//     casse au premier republish. *On ne recopie pas un nom qui a une date de
//     péremption.* Les pages qui en dépendent sont SIGNALÉES, pas converties.
//   · Il ne juge pas si une page est publiable — il applique la question 2 de la
//     règle (`verifier-publication.mjs`) et refuse d'écrire une page qui échoue.
//
// ⛔ ET LE DÉFAUT QUE CET OUTIL A TROUVÉ EN PASSANT, IL FAUT LE DIRE :
//    `/demos/` affirme « ComfyUI répond sur 8188 ». **Mesuré le 29/09 : le port
//    8188 est FERMÉ.** La page publie un fait faux. Elle publie aussi
//    « http://127.0.0.1:8080/ répond 200 » — une adresse locale, inutile pour un
//    visiteur, et une prise pour qui cherche à entrer.
//    ⇒ Une page de PREUVE qui affirme un fait non vérifié est pire qu'une page
//      qui n'affirme rien : elle apprend au lecteur à croire ce qu'elle dit.
//
// Usage :
//   node outils/adosser-pages-serveur.mjs --etat       (n'écrit rien, montre l'écart)
//   node outils/adosser-pages-serveur.mjs --recuperer  (télécharge dans cinematique/)
//
// Codes : 0 = ok  ·  1 = une page est refusée par le contrôle de publication  ·  2 = réseau
// ============================================================================

import { writeFileSync, mkdirSync, existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ICI = path.dirname(fileURLToPath(import.meta.url));
const RACINE = path.resolve(ICI, '..');
const CINEMA = path.join(RACINE, 'cinematique');
const DOMAINE = 'https://gldigitallab.fr';

const ETAT = process.argv.includes('--etat');
const RECUPERER = process.argv.includes('--recuperer');

/* ------------------------------------------------------------------ *
 * ① LES PAGES À ADOSSER — mesurées le 29/09/2026
 * ------------------------------------------------------------------ */

const PAGES = [
  { url: '/services/',    titre: 'Services',      poids: 135406 },
  { url: '/laboratoire/', titre: 'Laboratoire',   poids: 124197 },
  { url: '/eva01/',       titre: 'Le poste',      poids: 128226 },
  { url: '/monde/',       titre: 'Le monde',      poids: 39136  },
  { url: '/demos/',       titre: 'Les démos',     poids: 12450  },
];

/* ------------------------------------------------------------------ *
 * ② LA LECTURE
 * ------------------------------------------------------------------ */

async function lire(url) {
  const r = await fetch(DOMAINE + url, { redirect: 'follow' });
  if (!r.ok) throw new Error(`HTTP ${r.status} sur ${url}`);
  return await r.text();
}

/** Les dépendances qui ont une date de péremption : les assets hashés d'un build. */
function dependancesPerissables(html) {
  return [...new Set(
    [...html.matchAll(/(?:src|href)="([^"]*assets\/[^"]+)"/g)].map((m) => m[1]),
  )];
}

/* ------------------------------------------------------------------ *
 * ③ L'ÉTAT — et il se lit avant d'agir
 * ------------------------------------------------------------------ */

const lignes = [];
let perissables = 0;

for (const p of PAGES) {
  let html;
  try {
    html = await lire(p.url);
  } catch (e) {
    lignes.push(`  ⛔ ${p.url.padEnd(16)} illisible — ${e.message}`);
    continue;
  }
  const deps = dependancesPerissables(html);
  const local = existsSync(path.join(CINEMA, p.url.replace(/^\/|\/$/g, ''), 'index.html'));
  const signe = local ? '✅' : '⚠️ ';
  lignes.push(
    `  ${signe} ${p.url.padEnd(16)} ${String(html.length).padStart(7)} o   ` +
    `dép. hashées : ${String(deps.length).padStart(2)}   ` +
    `${local ? 'dans le dépôt' : 'ABSENTE du dépôt'}`,
  );
  if (deps.length) perissables++;
}

console.log('');
console.log('  PAGES SERVIES SANS SOURCE DANS LE DÉPÔT');
console.log('  ' + '─'.repeat(72));
for (const l of lignes) console.log(l);
console.log('');
console.log(`  ${perissables} page(s) dépendent d'assets hashés (non recopiables sans dette).`);
console.log('');

if (ETAT || !RECUPERER) {
  console.log('  Mode --etat : RIEN n\'a été écrit. Utilise --recuperer pour adosser.');
  console.log('');
  process.exit(0);
}

/* ------------------------------------------------------------------ *
 * ④ LA RÉCUPÉRATION — une page à la fois, et on vérifie chacune
 * ------------------------------------------------------------------ */

// ⛔⛔ LE GARDE-FOU QUI MANQUAIT — AJOUTÉ APRÈS L'AVOIR PAYÉ LE 29/09/2026.
//
//    La première version affichait « 3 page(s) dépendent d'assets hashés (non
//    recopiables sans dette) » — **puis les recopiait quand même.**
//    L'avertissement était un commentaire, pas un garde-fou : il informait sans
//    empêcher. *Un garde-fou qui ne bloque pas n'en est pas un.*
//
//    ⇒ Une page qui dépend d'un asset hashé est REFUSÉE, pas signalée. Le nom du
//      fichier (`ServicesPage-DKxd7KTJ.js`) contient un hash de build : il change
//      au prochain `npm run build`. Recopier un nom qui a une date de péremption,
//      c'est programmer une page qui cassera sans prévenir.
//
//    ⚠️ ET ÇA SE DIT, PARCE QUE CE N'EST PAS UN ÉCHEC DE L'OUTIL : c'est une
//       décision. Ces pages ont besoin d'une CONVERSION (extraire le HTML rendu),
//       pas d'une copie. On refuse de faire semblant.
const REFUSER_PERISSABLES = true;

console.log('  RÉCUPÉRATION');
console.log('  ' + '─'.repeat(72));

let refus = 0;
let ignores = 0;

for (const p of PAGES) {
  const dossier = path.join(CINEMA, p.url.replace(/^\/|\/$/g, ''));
  const fichier = path.join(dossier, 'index.html');

  if (existsSync(fichier)) {
    console.log(`  ⏭  ${p.url.padEnd(16)} déjà dans le dépôt — non touchée.`);
    continue;
  }

  let html;
  try {
    html = await lire(p.url);
  } catch (e) {
    console.log(`  ⛔ ${p.url.padEnd(16)} ${e.message}`);
    refus++;
    continue;
  }

  // ── LE REFUS DES ASSETS PÉRISSABLES ─────────────────────────────────────
  const deps = dependancesPerissables(html);
  if (REFUSER_PERISSABLES && deps.length) {
    console.log(
      `  ⏭  ${p.url.padEnd(16)} REFUSÉE — ${deps.length} asset(s) hashé(s). ` +
      `À CONVERTIR, pas à copier.`,
    );
    ignores++;
    continue;
  }

  // ⛔ INTÉGRITÉ — on refuse d'écrire un fichier tronqué. Un téléchargement coupé
  //    produirait une page cassée qu'on croirait valide : *un fichier écrit n'est
  //    pas un fichier complet.*
  //
  //    ⚠️ TEST INSENSIBLE À LA CASSE, ET C'EST UNE CORRECTION MESURÉE : la première
  //       version cherchait `<!DOCTYPE` en majuscules. `/monde/` écrit `<!doctype html>`
  //       — minuscules, parfaitement valide — et l'outil l'a déclarée « incomplète ».
  //       *Je testais une FORME, pas un FAIT.* Le HTML n'est pas sensible à la casse
  //       sur ce point, et mon contrôle ne devait pas l'être non plus.
  const debut = html.trimStart().toLowerCase().startsWith('<!doctype');
  const fin = html.trimEnd().toLowerCase().endsWith('</html>');
  if (!debut || !fin) {
    console.log(
      `  ⛔ ${p.url.padEnd(16)} incomplète (doctype=${debut}, /html=${fin}) — NON écrite.`,
    );
    refus++;
    continue;
  }

  mkdirSync(dossier, { recursive: true });
  writeFileSync(fichier, html, 'utf8');
  console.log(`  ✅ ${p.url.padEnd(16)} ${String(html.length).padStart(7)} o écrits  (autonome)`);
}

console.log('');
if (ignores) {
  console.log(`  ${ignores} page(s) REFUSÉE(S) — elles dépendent d'assets hashés et demandent`);
  console.log('     une CONVERSION (extraire le HTML rendu), pas une copie de fichiers.');
  console.log('     ⛔ Rien n\'a été écrit pour elles.');
}
if (refus) {
  console.log(`  ${refus} page(s) en échec de lecture ou d'intégrité — rien écrit pour elles.`);
}
console.log('');
console.log('  ⛔ RIEN N\'EST EN LIGNE : les fichiers sont dans le dépôt, et rien d\'autre.');
console.log('');
