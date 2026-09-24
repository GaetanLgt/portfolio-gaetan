#!/usr/bin/env node
/* ═══════════════════════════════════════════════════════════════════════════════
   verifier-largeurs-fixes.mjs — LES RÈGLES ④ ET ⑤ DE LA CONSIGNE ALLEMANDE
   ═══════════════════════════════════════════════════════════════════════════════

   23/09/2026 — GL Digital Lab, par Samus (harnais).

   CONSIGNE (A-FAIRE-2026-09-23, § 1, « L'allemand est le banc d'essai ») :
     ④ Aucun bouton à largeur fixe
     ⑤ Tableaux en `%`, jamais en `px`

   ⛔ POURQUOI CE CONTRÔLE N'EXISTAIT PAS — ET LE PIÈGE QU'IL A FALLU ÉVITER
   -----------------------------------------------------------------------------
   Un contrôle naïf avait déjà été écrit, et il a produit un FAUX POSITIF documenté
   dans le dépôt (`Navigation.vue`, l. 512) :

       « "5 largeurs fixes" : il avait matché `max-width: 1024px` dans un `@media`. »

   ⭐ TROIS CHOSES NE SONT PAS DES LARGEURS FIXES, et un contrôle qui les compte
      ensemble ne contrôle rien :
        · `max-width` / `min-width`  — *un plafond et un plancher, pas une largeur*
        · une déclaration DANS un `@media` — *c'est une adaptation, et c'est même la
          preuve qu'on s'adapte*
        · une largeur en `%`, `vw`, `ch`, `clamp()` — *relative par construction*

   ⛔ ET UNE CHOSE EN EST UNE, même si elle n'est pas en pixels : `width: 12rem` sur un
      bouton est une largeur FIXE. *Le problème n'est pas l'unité, c'est qu'un mot long
      ne peut pas l'élargir — et en allemand, le mot long arrive.*

   ⭐ COMMENT L'EXCLUSION DES `@media` EST FAITE — et c'est la partie qui a été
      réécrite : **on retire les blocs `@media` du texte AVANT de l'analyser**, en
      suivant les accolades. *La première version suivait la profondeur pendant le
      découpage, et elle ne capturait jamais les blocs intérieurs : elle excluait
      **par accident**. Ce qui est exclu par accident finit un jour par être compté.*

   USAGE
     node scripts/verifier-largeurs-fixes.mjs            → juge src/
     node scripts/verifier-largeurs-fixes.mjs --detail   → et nomme chaque défaut
     node scripts/verifier-largeurs-fixes.mjs --epreuve  → éprouve le détecteur (8 cas)
   Sortie : 0 si propre · 1 si un défaut réel · 3 si rien n'a pu être examiné.
   ═══════════════════════════════════════════════════════════════════════════════ */

import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join, dirname, extname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const ICI = dirname(fileURLToPath(import.meta.url));
const RACINE = join(ICI, '..');
const DETAIL = process.argv.includes('--detail');
const EPREUVE = process.argv.includes('--epreuve');

/* ── ① LES DEUX FAMILLES ──────────────────────────────────────────────────────
   · INTERACTIF — un bouton. *Un mot long ne peut pas l'élargir : il déborde.*
   · TABLEAU    — une cellule, une colonne. *Une colonne en px ne se répartit pas.* */
const MOTIF_BOUTON = /(^|[^a-z-])(button|btn|bouton|cta)/i;
const MOTIF_TABLEAU = /(^|[^a-z-])(table|thead|tbody|tr|th|td|cell|col)\b/i;

/* ── ② RETIRER LES COMMENTAIRES, PUIS LES `@media` ───────────────────────────
   ⛔⛔ LES COMMENTAIRES SE RETIRENT EN PREMIER, ET C'EST UNE CORRECTION MESURÉE.
   Première passe sur `src/` : **trois défauts annoncés, trois faux positifs.**
   Deux d'entre eux avaient pour « sélecteur » le TEXTE D'UN COMMENTAIRE :

       l. 195  ④ bouton à largeur fixe   [34px]   /* ═══════════════════════
       l. 278  ④ bouton à largeur fixe   [22px]   /* Variante DANS UN BOUTON (page Contact)…

   ⭐ *Un commentaire qui parle d'un bouton n'est pas un bouton.* Et le dépôt en est plein :
   ses commentaires citent la consigne, donc ils contiennent les mots `bouton`, `btn`,
   `tableau`. **Un contrôle sur ce dépôt qui ne retire pas les commentaires se condamne
   à signaler sa propre documentation.**
   ⚠️ Et le troisième (`button .pavillon__etoffe`) reste à vérifier : *il peut être réel.* */
function sansCommentaires(css) {
  return css.replace(/\/\*[\s\S]*?\*\//g, ' ');
}

function sansMedia(css) {
  let sortie = '';
  let i = 0;
  while (i < css.length) {
    const m = /@media[^{]*\{/i.exec(css.slice(i));
    if (!m) { sortie += css.slice(i); break; }
    sortie += css.slice(i, i + m.index);
    let j = i + m.index + m[0].length;
    let prof = 1;
    while (j < css.length && prof > 0) {
      if (css[j] === '{') prof++;
      else if (css[j] === '}') prof--;
      j++;
    }
    i = j;
  }
  return sortie;
}

/* ── ③ LES BLOCS, SUR LE TEXTE DÉJÀ DÉBARRASSÉ DES `@media` ────────────────── */
function blocsCss(css) {
  const texte = sansMedia(sansCommentaires(css));
  const sortie = [];
  const re = /([^{}]+)\{([^{}]*)\}/g;
  let m;
  while ((m = re.exec(texte))) sortie.push({ bloc: m[1], corps: m[2] });
  return sortie;
}

/** Les `width` à unité absolue d'un corps — hors `max-` et `min-`. */
function largeursAbsolues(corps) {
  const trouvees = [];
  const re = /([a-z-]*)(width)\s*:\s*([0-9.]+)\s*(px|rem|em)\b/gi;
  let m;
  while ((m = re.exec(corps))) {
    if (/^(max-|min-)$/i.test(m[1])) continue;   // un plafond, un plancher — pas une largeur
    trouvees.push(m[3] + m[4]);
  }
  return trouvees;
}

/** ⭐ LA CIBLE D'UN SÉLECTEUR — le dernier composé, celui qui reçoit la déclaration.
    ⛔ POURQUOI CE N'EST PAS UN DÉTAIL : `button .pavillon__etoffe { width: 20px }` a
    été signalé comme « bouton à largeur fixe » — c'est un **drapeau décoratif de 20 px
    posé DANS un bouton**. *Un enfant étroit ne contraint pas son parent : c'est le
    parent qui s'adapte.* ⇒ On juge la cible, pas l'ascendance. */
function cibleDe(sel) {
  const parties = sel.split(/\s*[>+~]\s*|\s+/).filter(Boolean);
  return (parties[parties.length - 1] || '').toLowerCase();
}

/** Le sélecteur CONTIENT-IL un bouton avant sa cible ? Alors la cible est dedans. */
function estDansUnBouton(sel) {
  const parties = sel.split(/\s*[>+~]\s*|\s+/).filter(Boolean);
  if (parties.length < 2) return false;
  return parties.slice(0, -1).some((p) => MOTIF_BOUTON.test(p));
}

/** La cible EST-elle un bouton, ou un élément de tableau ? */
const CIBLE_BOUTON = /^(button|input|a)?\s*\.?[a-z0-9_-]*(btn|bouton|cta)/i;
const CIBLE_TABLEAU = /^(table|thead|tbody|tfoot|tr|th|td|col|colgroup)$|\.(table|tableau)(__|$)/i;

/* ⛔ LA TROISIÈME CATÉGORIE, ET ELLE A COÛTÉ DEUX FAUX POSITIFS DE PLUS.
   La règle ④ existe pour UNE raison : *un libellé long ne peut pas élargir un bouton
   à largeur fixe — et en allemand, le libellé long arrive.*
   ⇒ **Un bouton-icône n'a pas de libellé.** Une croix de fermeture de 32 px et un bouton
   rond de 2,5 rem sont LÉGITIMES : *leur largeur est leur forme.*
   ⚠️ On ne les efface pas pour autant — *on les nomme, et un humain confirme.*
   *Un contrôle qui tranche à la place d'un lecteur se trompe deux fois : il accuse à
   tort, et il fait perdre confiance dans les fois où il a raison.* */
/* ⚠️ `[^a-z]` ET NON `[^a-z-]` : la première version excluait le TIRET, donc
   `.boreal-bouton--rond` ne matchait pas — *le nom d'une variante BEM sépare ses mots
   par des tirets, et un motif qui refuse le tiret refuse précisément les noms qu'il
   cherche.* Le témoin « bouton-icône (rond) » l'a attrapé. */
const CIBLE_ICONE = /(^|[^a-z])(rond|round|close|croix|fermer|icon|icone|burger|hamburger|toggle|switch)/i;

function analyserCss(css) {
  const defauts = [];
  const avertissements = [];
  for (const { bloc, corps } of blocsCss(css)) {
    const sel = bloc.replace(/\s+/g, ' ').trim();
    if (!sel || sel.startsWith('@')) continue;
    const cible = cibleDe(sel);

    let regle = null;
    let motif = null;
    if (CIBLE_BOUTON.test(cible) || /^button$/i.test(cible)) {
      regle = '④ bouton à largeur fixe';
      if (estDansUnBouton(sel) || /__/.test(cible)) {
        motif = 'posé DANS un bouton — un enfant étroit ne contraint pas son parent';
      } else if (CIBLE_ICONE.test(cible)) {
        motif = 'bouton-icône — pas de libellé à faire tenir';
      }
    } else if (CIBLE_TABLEAU.test(cible)) {
      regle = '⑤ tableau en unité absolue';
    } else {
      continue;
    }

    for (const valeur of largeursAbsolues(corps)) {
      const d = { regle, selecteur: sel.slice(0, 70), valeur, motif };
      if (motif) avertissements.push(d);
      else defauts.push(d);
    }
  }
  return { defauts, avertissements };
}
const defautsDeCss = (css) => analyserCss(css).defauts;

/* ── ④ ANALYSER UN FICHIER ─────────────────────────────────────────────────── */
function numeroDeLigne(lignes, index) {
  let curseur = 0;
  for (let n = 0; n < lignes.length; n++) {
    curseur += lignes[n].length + 1;
    if (curseur > index) return n + 1;
  }
  return lignes.length;
}

function analyserFichier(chemin) {
  const texte = readFileSync(chemin, 'utf8');
  const lignes = texte.split(/\r?\n/);
  const { defauts, avertissements } = analyserCss(texte);
  const placer = (d) => ({
    ...d,
    fichier: chemin,
    ligne: numeroDeLigne(lignes, Math.max(0, texte.indexOf(d.selecteur.split(' ').pop()))),
  });

  const sortie = { defauts: defauts.map(placer), avertissements: avertissements.map(placer) };

  /* Les largeurs écrites DANS LE BALISAGE. L'attribut `width` est plus ancien que le
     CSS et fait exactement le même dégât sur une colonne. */
  for (const m of texte.matchAll(/<(td|th|table|col)\b[^>]*\bwidth\s*=\s*["']?([0-9]+)/gi)) {
    sortie.defauts.push({
      fichier: chemin,
      regle: '⑤ tableau : `width` en ATTRIBUT',
      selecteur: '<' + m[1].toLowerCase() + ' width=' + m[2] + '>',
      valeur: m[2] + 'px',
      ligne: numeroDeLigne(lignes, m.index),
    });
  }
  return sortie;
}

function fichiersSources(dossier, sortie = []) {
  for (const e of readdirSync(dossier)) {
    const p = join(dossier, e);
    if (statSync(p).isDirectory()) {
      if (['node_modules', 'dist', '.git', 'public'].includes(e)) continue;
      fichiersSources(p, sortie);
    } else if (['.vue', '.css', '.html'].includes(extname(p).toLowerCase())) {
      sortie.push(p);
    }
  }
  return sortie;
}

/* ── ⑤ L'ÉPREUVE — huit témoins ───────────────────────────────────────────────
   ⛔ Un détecteur qu'on n'éprouve pas est un détecteur qui validera n'importe quoi.
   ⭐ Les témoins « max-width », « min-width », « % » et « @media » ne sont pas là pour
      décorer : **ils vérifient que le contrôle SAIT NE PAS SIGNALER.** *C'est la
      moitié du travail, et c'est celle que la version naïve avait ratée.* */
const TEMOINS = [
  { nom: 'bouton en px',            css: '.btn { width: 200px; }',                                attendu: 1 },
  { nom: 'bouton en rem',           css: '.cta-btn { width: 12rem; }',                            attendu: 1 },
  { nom: 'bouton en max-width',     css: '.btn { max-width: 200px; }',                            attendu: 0 },
  { nom: 'bouton en min-width',     css: '.btn { min-width: 200px; }',                            attendu: 0 },
  { nom: 'bouton DANS un @media',   css: '@media (max-width: 768px) { .btn { width: 100px; } }',  attendu: 0 },
  { nom: 'bouton en pourcentage',   css: '.btn { width: 50%; }',                                   attendu: 0 },
  { nom: 'cellule en px',           css: 'td { width: 150px; }',                                   attendu: 1 },
  { nom: 'cellule dans un @media',  css: '@media (max-width: 768px) { td { width: 90px; } }',     attendu: 0 },
  /* ⛔ LE TÉMOIN QUI MANQUAIT, ET QUI A COÛTÉ TROIS FAUX POSITIFS SUR `src/` :
     un commentaire qui PARLE d'un bouton. *Ce dépôt cite sa propre consigne dans ses
     commentaires — donc ils contiennent `bouton`, `btn`, `tableau` — et un contrôle
     qui ne les retire pas signale sa documentation.* */
  { nom: 'commentaire CSS',         css: '/* .btn { width: 200px; } */',                          attendu: 0 },
  /* ⛔ LE SECOND TÉMOIN QUI A COÛTÉ UN FAUX POSITIF : un élément DANS un bouton.
     *Un drapeau décoratif de 20 px posé dans un bouton ne contraint pas le bouton —
     c'est le parent qui s'adapte.* Il doit donc être un AVERTISSEMENT, pas un défaut. */
  { nom: 'élément DANS un bouton',  css: 'button .pavillon__etoffe { width: 20px; }',             attendu: 0 },
  { nom: 'cellule d’une classe',    css: '.dossier__table td { width: 150px; }',                  attendu: 1 },
  /* ⛔ LE TROISIÈME, ET C'EST LE PLUS SUBTIL : un bouton-ICÔNE. *Une croix de 32 px
     n'a aucun libellé à faire tenir — sa largeur est sa forme.* Défaut ? Non.
     Mais on le NOMME, parce qu'un humain doit pouvoir confirmer. */
  { nom: 'bouton-icône (croix)',    css: '.close-btn { width: 32px; }',                           attendu: 0 },
  { nom: 'bouton-icône (rond)',     css: '.boreal-bouton--rond { width: 2.5rem; }',               attendu: 0 },
];

if (EPREUVE) {
  console.log('════════════════════════════════════════════════════════════════════');
  console.log(' Épreuve du détecteur de largeurs fixes — huit témoins');
  console.log('════════════════════════════════════════════════════════════════════');
  let rates = 0;
  for (const t of TEMOINS) {
    const n = defautsDeCss(t.css).length;
    const ok = n === t.attendu;
    if (!ok) rates++;
    console.log('  ' + (ok ? '✅' : '⛔') + '  ' + t.nom.padEnd(28) + ' attendu ' + t.attendu + ' · obtenu ' + n);
  }
  console.log('');
  if (rates) {
    console.log('  ⛔ ' + rates + ' témoin(s) sur ' + TEMOINS.length + ' ne réagissent pas comme annoncé.');
    console.log('     ⇒ Le détecteur ne peut pas servir. NE PAS L’UTILISER.');
    process.exitCode = 1;
  } else {
    console.log('  ✅ ' + TEMOINS.length + ' témoins sur ' + TEMOINS.length + ' réagissent comme annoncé.');
    console.log('     ⭐ Il signale les deux familles, et il SAIT NE PAS SIGNALER :');
    console.log('        `max-width`, `min-width`, `%`, et tout ce qui vit DANS un `@media`.');
    process.exitCode = 0;
  }
  console.log('════════════════════════════════════════════════════════════════════');
} else {
  /* ── ⑥ LA PASSE ─────────────────────────────────────────────────────────── */
  const SOURCE = join(RACINE, 'src');
  if (!existsSync(SOURCE)) {
    console.error('⛔ src/ est introuvable. Rien à examiner.');
    process.exit(3);
  }

  const fichiers = fichiersSources(SOURCE);
  const defauts = [];
  const avertissements = [];
  for (const f of fichiers) {
    const r = analyserFichier(f);
    defauts.push(...r.defauts);
    avertissements.push(...r.avertissements);
  }

  console.log('════════════════════════════════════════════════════════════════════');
  console.log(' Largeurs fixes — règles ④ et ⑤ de la consigne allemande');
  console.log('════════════════════════════════════════════════════════════════════');
  console.log('  fichiers examinés : ' + fichiers.length + ' (.vue, .css, .html de src/)');
  console.log('');

  const grouper = (liste) => {
    const m = new Map();
    for (const d of liste) {
      const k = relative(RACINE, d.fichier).replace(/\\/g, '/');
      if (!m.has(k)) m.set(k, []);
      m.get(k).push(d);
    }
    return [...m.entries()].sort();
  };

  if (!fichiers.length) {
    console.log('  ⛔ AUCUN fichier examiné — le contrôle ne peut RIEN conclure.');
    process.exitCode = 3;
  } else if (!defauts.length && !avertissements.length) {
    console.log('  ✅ Aucune largeur fixe sur un bouton ou une cellule.');
    process.exitCode = 0;
  } else {
    for (const [f, liste] of grouper(defauts)) {
      console.log('  ⛔ ' + f + '  —  ' + liste.length + ' défaut(s)');
      if (DETAIL) {
        for (const d of liste) {
          console.log('       l. ' + String(d.ligne).padStart(5) + '  ' + d.regle +
            '   [' + d.valeur + ']   ' + d.selecteur);
        }
      }
    }

    /* ⭐ LES AVERTISSEMENTS NE BLOQUENT PAS, ET ILS SONT MONTRÉS QUAND MÊME.
       Une largeur fixe sur un élément POSÉ DANS un bouton n'empêche pas le bouton de
       s'élargir : *c'est le parent qui s'adapte.* ⇒ Ce n'est pas un défaut — mais le
       taire serait cacher une information. *On sépare, on ne supprime pas.* */
    if (avertissements.length) {
      console.log('');
      for (const [f, liste] of grouper(avertissements)) {
        console.log('  ⚠️  ' + f + '  —  ' + liste.length + ' à VÉRIFIER');
        if (DETAIL) {
          for (const d of liste) {
            console.log('       l. ' + String(d.ligne).padStart(5) + '  ' + d.regle +
              '   [' + d.valeur + ']   ' + d.selecteur);
            console.log('              → ' + (d.motif || ''));
          }
        }
      }
    }

    console.log('');
    if (defauts.length) {
      console.log('  ⛔ ' + defauts.length + ' défaut(s) réel(s)' +
        (avertissements.length ? ' · ' + avertissements.length + ' à vérifier' : '') + '.');
      console.log('     ⭐ POURQUOI ÇA COMPTE ICI : *un mot long ne peut pas élargir un bouton à');
      console.log('        largeur fixe — et en allemand, le mot long arrive.*');
      process.exitCode = 1;
    } else {
      console.log('  ✅ Aucun défaut réel — ' + avertissements.length + ' élément(s) à vérifier,');
      console.log('     tous POSÉS DANS un bouton : *un enfant étroit ne contraint pas son parent.*');
      process.exitCode = 0;
    }
  }

  console.log('');
  console.log('  ⛔ CE QUE CE CONTRÔLE NE MESURE PAS, ET IL FAUT LE SAVOIR :');
  console.log('     · **Le RENDU.** Il lit le CSS, il ne regarde pas la page.');
  console.log('       *Une largeur fixe peut ne jamais déborder, si le texte est court.*');
  console.log('     · **Les largeurs en `ch`, `vw`, `clamp()`** — ignorées volontairement :');
  console.log('       *elles s’adaptent, c’est leur définition.*');
  console.log('     · **Le vrai test de la consigne** — fenêtre étroite, version allemande,');
  console.log('       et chercher une barre de défilement horizontale : **ça, ça se regarde.**');
  console.log('     · **L’exhaustivité** : il ne voit que `.vue`, `.css`, `.html` de `src/`.');
  console.log('       *`public/` et les styles injectés par JavaScript ne sont pas lus.*');
  console.log('════════════════════════════════════════════════════════════════════');
}
