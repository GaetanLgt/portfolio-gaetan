#!/usr/bin/env node
// verifier-jsonld.mjs — le balisage structuré des pages du site est-il VALIDE ?
//
// ⛔ POURQUOI CE CONTRÔLE EXISTE — 28/09/2026.
//    Un bloc `application/ld+json` malformé est **ignoré en silence** par les moteurs :
//    ils ne signalent rien, ils passent simplement à autre chose. On croit avoir balisé
//    une page, et on n'a rien balisé.
//    *Un contrôle qui échoue en silence n'est pas un contrôle : c'est une décoration.*
//
// ⚠️ ET IL VÉRIFIE AUSSI QUE LE BLOC NE MENT PAS : un `@type` sans `name`, ou une date
//    de modification dans le futur, sont des incohérences qu'un parseur accepte et qu'un
//    moteur rejette. *Le JSON valide n'est pas le balisage valide.*
//
// Usage : node outils/verifier-jsonld.mjs [--json]
// Codes : 0 = tout est valide · 1 = au moins un défaut · 2 = rien à vérifier (ÉCHEC)

import { readdirSync, readFileSync, existsSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ICI = path.dirname(fileURLToPath(import.meta.url));
const CINEMA = path.resolve(ICI, '..', 'cinematique');
const AUJOURDHUI = new Date().toISOString().slice(0, 10);

/* Pages du site : la racine, les dossiers qui portent un index.html, les .html racine. */
function pages() {
  // ⛔ LA RACINE EST AJOUTÉE ICI, ET ELLE NE DOIT PAS L'ÊTRE UNE DEUXIÈME FOIS PLUS BAS.
  //    Premier jet : la boucle ajoutait aussi `index.html` (elle prend tous les `.html`
  //    de la racine), donc **l'accueil était compté deux fois** — « 3 valides » au lieu de 2.
  //    *Un total faux ne se voit pas : il a l'air d'un compte.* C'est le même défaut que
  //    le seuil élargi du comparateur, sous une autre forme : la mesure mentait, pas la page.
  const out = [path.join(CINEMA, 'index.html')];
  for (const e of readdirSync(CINEMA, { withFileTypes: true })) {
    if (e.name.startsWith('.') || e.name.startsWith('_')) continue;
    if (['sources', 'node_modules', 'outils'].includes(e.name)) continue;
    if (e.isDirectory()) {
      const i = path.join(CINEMA, e.name, 'index.html');
      if (existsSync(i)) out.push(i);
    } else if (e.name.endsWith('.html') && e.name !== 'index.html') {
      out.push(path.join(CINEMA, e.name));
    }
  }
  return out;
}

const defauts = [];
const valides = [];
const sansBalisage = [];

for (const f of pages()) {
  const rel = path.relative(CINEMA, f).replace(/\\/g, '/');
  const html = readFileSync(f, 'utf8');
  const blocs = [...html.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];

  if (!blocs.length) {
    sansBalisage.push(rel);
    continue;
  }

  for (const [, corps] of blocs) {
    let objet;
    try {
      objet = JSON.parse(corps);
    } catch (e) {
      defauts.push(`${rel} — JSON INVALIDE : ${e.message}`);
      continue;
    }
    const types = [].concat(objet['@type'] || []).join(', ');
    if (!types) {
      defauts.push(`${rel} — bloc sans « @type »`);
      continue;
    }
    if (!objet.name && !objet.headline) {
      defauts.push(`${rel} — bloc « ${types} » sans « name » (un moteur ne saura pas quoi citer)`);
      continue;
    }
    // ⚠️ une date de modification dans le FUTUR est un mensonge que le parseur accepte
    if (objet.dateModified && String(objet.dateModified).slice(0, 10) > AUJOURDHUI) {
      defauts.push(`${rel} — « dateModified » dans le futur (${objet.dateModified})`);
      continue;
    }
    valides.push(`${rel} — ${types}`);
  }
}

/* ------------------------------------------------------------------ *
 * LE GARDE-FOU CONTRE L'AVEUGLEMENT
 * ------------------------------------------------------------------ */

// ⭐ Si AUCUNE page ne porte de balisage, ce n'est pas « tout va bien » : c'est un
//    contrôle qui n'a rien regardé. Le dépôt a déjà payé ce défaut.
if (!valides.length && !defauts.length) {
  console.error('⛔ AUCUNE page ne porte de balisage — ce n’est pas un succès, c’est un contrôle aveugle.');
  process.exit(2);
}

console.log('');
console.log('  BALISAGE STRUCTURÉ (schema.org) — état des pages');
console.log('  ' + '─'.repeat(66));
for (const v of valides) console.log(`  ✅ ${v}`);
for (const d of defauts) console.log(`  ⛔ ${d}`);
if (sansBalisage.length) {
  console.log('');
  console.log(`  ⚠️  ${sansBalisage.length} page(s) SANS balisage :`);
  for (const s of sansBalisage) console.log(`       ${s}`);
  console.log('     (non bloquant : c’est une dette, pas une faute — mais elle se compte.)');
}
console.log('');
console.log(`  ${valides.length} valide(s) · ${defauts.length} en défaut · ${sansBalisage.length} sans balisage`);
console.log('');
process.exit(defauts.length ? 1 : 0);
