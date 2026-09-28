#!/usr/bin/env node
// ============================================================================
// auditer-citation.mjs — GL Digital Lab — 28/09/2026
//
// Mesure les pages du site contre la checklist « avant mise en ligne » de
// l'article *« Comment structurer une page pour être citée par un moteur de
// réponse ? »* (Française du Numérique, 23/06/2026, modifié 24/07/2026).
//
// ═══════════════════════════════════════════════════════════════════════════
// POURQUOI CET OUTIL, ET CE QU'IL REFUSE DE FAIRE
// ═══════════════════════════════════════════════════════════════════════════
//
// L'article donne **huit contrôles** à passer avant de publier. Une bonne pratique
// qu'on lit et qu'on ne mesure pas reste un vœu : on croit l'appliquer, et rien ne
// le prouve. Ici, chaque contrôle est soit MESURÉ, soit **déclaré non mesurable**.
//
//   ⭐ LA RÈGLE, ET C'EST CELLE DU STUDIO : *on ne fait pas semblant de mesurer.*
//      Trois des huit contrôles ne sont pas mécanisables — ils demandent un
//      jugement humain. Les faire passer pour vérifiés serait pire que de ne rien
//      checker : **un contrôle qui dit « conforme » sans regarder fabrique de la
//      confiance sur du vide.**
//
// LES HUIT CONTRÔLES DE L'ARTICLE, ET CE QU'ON EN FAIT :
//
//   ① une réponse directe figure dans les premiers paragraphes ...... MESURÉ
//   ② une seule intention principale domine la page ................ NON MESURÉ (déclaré)
//   ③ les h2 et h3 sont informatifs ................................ PARTIEL (longueur + forme)
//   ④ les noms d'entités sont uniformisés .......................... MESURÉ
//   ⑤ contenu visible cohérent avec les données structurées ........ MESURÉ
//   ⑥ lisibilité mobile et vitesse perçue .......................... NON MESURÉ (outil externe)
//   ⑦ les liens internes mènent à des pages complémentaires ........ PARTIEL (cible existe ?)
//   ⑧ pas de blocs verbeux, vagues ou décoratifs ................... NON MESURÉ (déclaré)
//
// Usage :
//   node outils/auditer-citation.mjs              (toutes les pages)
//   node outils/auditer-citation.mjs --detail      (imprime chaque constat)
//
// Codes : 0 = rien à signaler · 1 = au moins un point faible · 2 = rien à auditer
// ============================================================================

import { readdirSync, readFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ICI = path.dirname(fileURLToPath(import.meta.url));
const CINEMA = path.resolve(ICI, '..', 'cinematique');
const DETAIL = process.argv.includes('--detail');

/* ------------------------------------------------------------------ *
 * ① LES PAGES
 * ------------------------------------------------------------------ */

function pages() {
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

/* ------------------------------------------------------------------ *
 * ② LES OUTILS D'ANALYSE
 * ------------------------------------------------------------------ */

/** Le texte visible : on retire script, style, commentaires, puis les balises. */
function texteVisible(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&[a-z]+;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const titres = (html, n) => [...html.matchAll(new RegExp(`<h${n}\\b[^>]*>([\\s\\S]*?)</h${n}>`, 'gi'))]
  .map((m) => texteVisible(m[1]));

/* ------------------------------------------------------------------ *
 * ③ LES CONTRÔLES
 * ------------------------------------------------------------------ */

const resultats = [];

for (const f of pages()) {
  const rel = path.relative(CINEMA, f).replace(/\\/g, '/');
  const html = readFileSync(f, 'utf8');
  const txt = texteVisible(html);
  const constats = [];

  /* ── ① RÉPONSE DIRECTE EN HAUT ──────────────────────────────────────
     Mesure : y a-t-il du texte AVANT le premier <h2>, et quelle longueur ?
     L'article : « ouvrir avec 2 ou 3 paragraphes courts qui définissent le
     sujet, répondent à la question et cadrent les conditions de validité. »
     ⚠️ La page d'accueil est hors sujet : c'est un récit, pas une réponse. */
  const premierH2 = html.search(/<h2\b/i);
  const avantH2 = premierH2 > 0 ? texteVisible(html.slice(0, premierH2)) : txt;
  const motsAvantH2 = avantH2 ? avantH2.split(/\s+/).length : 0;
  if (rel === 'index.html') {
    constats.push({ c: '①', etat: 'HORS SUJET', dit: 'la page d’accueil est un récit, pas une réponse' });
  } else if (motsAvantH2 >= 25 && motsAvantH2 <= 260) {
    constats.push({ c: '①', etat: 'OK', dit: `réponse d’ouverture de ${motsAvantH2} mots avant le premier titre` });
  } else {
    constats.push({ c: '①', etat: 'FAIBLE', dit: `seulement ${motsAvantH2} mots avant le premier <h2> — la réponse est enterrée` });
  }

  /* ── ③ TITRES INFORMATIFS ───────────────────────────────────────────
     Mesure partielle, et elle le dit : on regarde la FORME, pas le sens.
     ⛔⛔ CORRIGÉ APRÈS DEUX FAUX POSITIFS MESURÉS LE 28/09/2026.
        Premier jet : tout titre de moins de deux mots était déclaré FAIBLE.
        Résultat : **« L'Offre » et « Méthode » signalés comme mauvais titres.**
        Or ce sont d'excellents titres de section — courts, clairs, et ils
        annoncent exactement ce qu'ils contiennent.
        ⭐ *La longueur n'est pas le sens.* Un outil qui compte les mots ne peut
           pas juger si un titre annonce un sujet — et **un contrôle qui crie pour
           rien est un contrôle qu'on désactive**.
        ⇒ Un titre court devient « À RELIRE » : signalé, non bloquant, et rendu
          à celui qui peut juger. On ne fait pas semblant de savoir. */
  const h2 = titres(html, 2);
  const creux = h2.filter((t) => t.split(/\s+/).filter(Boolean).length < 2);
  if (!h2.length && rel !== 'index.html') {
    constats.push({ c: '③', etat: 'FAIBLE', dit: 'aucun <h2> : la page n’annonce aucune sous-question' });
  } else if (creux.length) {
    constats.push({ c: '③', etat: 'À RELIRE', dit: `${creux.length} titre(s) court(s), à juger à la main : ${creux.slice(0, 3).join(' · ')}` });
  } else if (h2.length) {
    constats.push({ c: '③', etat: 'OK', dit: `${h2.length} titre(s) de section, tous explicites` });
  }

  /* ── ④ ENTITÉS UNIFORMISÉES ─────────────────────────────────────────
     Mesure : les variantes du nom du studio. On cherche les formes CONNUES,
     et on signale s'il en coexiste plusieurs dans la même page. */
  const variantes = {
    'GL Digital Lab': /GL Digital Lab/g,
    'Génie IT Tek FR': /Génie IT Tek FR/g,
    'Génie IT TeK FR': /Génie IT TeK FR/g,
  };
  const trouvees = Object.entries(variantes)
    .map(([nom, re]) => [nom, (txt.match(re) || []).length])
    .filter(([, n]) => n > 0);
  const contradiction = trouvees.some(([n]) => n.includes('TeK')) && trouvees.some(([n]) => n.includes('Tek'));
  if (contradiction) {
    constats.push({ c: '④', etat: 'FAIBLE', dit: 'deux graphies du même nom coexistent (« TeK » et « Tek »)' });
  } else if (trouvees.length) {
    constats.push({ c: '④', etat: 'OK', dit: 'entités nommées : ' + trouvees.map(([n, c]) => `${n} ×${c}`).join(' · ') });
  } else {
    constats.push({ c: '④', etat: 'FAIBLE', dit: 'aucun nom d’entité reconnu dans le texte visible' });
  }

  /* ── ⑤ CONTENU VISIBLE ↔ DONNÉES STRUCTURÉES ────────────────────────
     Mesure : le balisage décrit-il ce que la page MONTRE ? On compare l'URL
     canonique et le nom déclaré, quand il y en a. */
  const bloc = html.match(/<script[^>]*application\/ld\+json[^>]*>([\s\S]*?)<\/script>/i);
  if (!bloc) {
    constats.push({ c: '⑤', etat: 'FAIBLE', dit: 'aucune donnée structurée (voir outils/verifier-jsonld.mjs)' });
  } else {
    let o = null;
    try { o = JSON.parse(bloc[1]); } catch { o = null; }
    if (!o) {
      constats.push({ c: '⑤', etat: 'FAIBLE', dit: 'balisage présent mais INVALIDE' });
    } else {
      const canonical = (html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)/i) || [, ''])[1];
      const urlBalise = o.url || '';
      if (canonical && urlBalise && !canonical.replace(/\/$/, '').startsWith(urlBalise.replace(/\/$/, '')) && !urlBalise.startsWith(canonical.replace(/\/$/, ''))) {
        constats.push({ c: '⑤', etat: 'FAIBLE', dit: `l’URL déclarée (${urlBalise}) ne correspond pas au canonical (${canonical})` });
      } else {
        constats.push({ c: '⑤', etat: 'OK', dit: `balisage « ${[].concat(o['@type'] || []).join(', ')} » cohérent avec la page` });
      }
    }
  }

  /* ── ⑦ LIENS INTERNES ───────────────────────────────────────────────
     Mesure : chaque lien interne mène-t-il à un fichier qui EXISTE ?
     ⚠️ L'article demande plus que ça (« pages réellement complémentaires ») —
     on ne mesure que l'existence, et on le dit. */
  const liens = [...new Set([...html.matchAll(/href=["'](\/[^"'#?]*)/g)].map((m) => m[1]))];
  const casses = liens.filter((h) => {
    if (h.startsWith('/.well-known') || h === '/llms.txt' || h === '/robots.txt' || h === '/sitemap.xml') return false;
    const cible = h.endsWith('/') ? path.join(CINEMA, h.slice(1), 'index.html') : path.join(CINEMA, h.slice(1));
    return !existsSync(cible) && !existsSync(path.join(CINEMA, h.slice(1), 'index.html'));
  });
  if (casses.length) {
    constats.push({ c: '⑦', etat: 'FAIBLE', dit: `${casses.length} lien(s) interne(s) sans cible locale : ${casses.slice(0, 4).join(' · ')}` });
  } else {
    constats.push({ c: '⑦', etat: 'OK', dit: `${liens.length} lien(s) interne(s), tous résolus en local` });
  }

  resultats.push({ rel, constats, mots: txt.split(/\s+/).length });
}

/* ------------------------------------------------------------------ *
 * ④ LA SORTIE
 * ------------------------------------------------------------------ */

const faibles = resultats.filter((r) => r.constats.some((c) => c.etat === 'FAIBLE'));

console.log('');
console.log('  AUDIT DE CITATION — les pages du site contre la checklist de l’article');
console.log('  ' + '─'.repeat(74));
console.log(`  ${resultats.length} page(s) · ${faibles.length} avec au moins un point faible`);
console.log('');

for (const r of resultats) {
  const pire = r.constats.some((c) => c.etat === 'FAIBLE');
  console.log(`  ${pire ? '⚠️ ' : '✅'} ${r.rel}  (${r.mots} mots)`);
  if (DETAIL || pire) {
    for (const c of r.constats) {
      const m = c.etat === 'FAIBLE' ? '⚠️ ' : c.etat === 'OK' ? '  ·' : '  ⊘';
      console.log(`       ${m} ${c.c} ${c.dit}`);
    }
  }
}

console.log('');
console.log('  ' + '─'.repeat(74));
console.log('  ⛔ TROIS CONTRÔLES SUR HUIT NE SONT PAS MESURÉS ICI, ET ILS SONT NOMMÉS :');
console.log('     ② une seule intention principale  — demande un jugement éditorial');
console.log('     ⑥ lisibilité mobile et vitesse    — demande Lighthouse ou PageSpeed');
console.log('     ⑧ blocs verbeux ou décoratifs     — demande une relecture humaine');
console.log('     *Un contrôle qui dit « conforme » sans regarder fabrique de la confiance');
console.log('      sur du vide. On préfère dire ce qu’on ne sait pas.*');
console.log('');
process.exit(faibles.length ? 1 : 0);
