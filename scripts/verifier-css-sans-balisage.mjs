#!/usr/bin/env node
/**
 * verifier-css-sans-balisage.mjs — du CSS dont le balisage a disparu
 *
 * POURQUOI CE VERROU EXISTE, ET CE QU'IL A COÛTÉ POUR ÊTRE ÉCRIT JUSTE.
 * Ce dépôt a déjà laissé du CSS derrière lui : la direction artistique a changé les
 * 09-11/09 (« l'ambiance anime sombre MND est retirée »), des sections ont quitté le
 * balisage, et leurs règles sont restées. *Un composant qu'on vide laisse ses murs.*
 *
 * Trois tentatives ont été nécessaires, et les deux premières étaient fausses :
 *
 *   ① Une sonde par `querySelector` sur 26 routes : 58,5 % de sélecteurs « jamais
 *      apparus ». Sa propre liste la démentait — les plus gros postes étaient
 *      `.nav-mobile` (une largeur non testée) et des modales (un état non provoqué).
 *   ② Un contrôle de source qui cherchait la classe **avec son point** dans le
 *      `<template>`. Or dans un balisage une classe s'écrit `class="help-modal"`,
 *      SANS point : le motif ne pouvait **jamais** trouver une classe dans un
 *      template. Il annonçait 14 classes mortes là où il y en avait 8, et
 *      `.help-modal` — présent ligne 10 de son propre composant — était déclaré absent.
 *
 * D'où la règle qui gouverne ce fichier : **un contrôle doit être éprouvé sur un cas
 * dont on CONNAÎT la réponse avant de servir à décider.** C'est ce que fait l'AUTO-TEST
 * ci-dessous : il vérifie que le contrôle classe VIVANTES des classes dont on sait
 * qu'elles le sont, et **il échoue bruyamment sinon**.
 *
 * DEUX PORTÉES, ET ELLES NE SE CONFONDENT PAS :
 *   · une classe dans un `<style scoped>` d'un `.vue` ne peut s'appliquer qu'à un
 *     élément DE CE composant → on la cherche dans **son** template ;
 *   · une classe dans un `.css` global s'applique partout → on la cherche dans
 *     **tous** les templates.
 *
 * USAGE
 *   node scripts/verifier-css-sans-balisage.mjs            → rapport
 *   node scripts/verifier-css-sans-balisage.mjs --verbeux  → avec les noms
 * Sortie 0 = aucune classe orpheline · 1 = il y en a · 2 = auto-test en échec.
 */

import fs from 'node:fs';
import path from 'node:path';

const RACINE = process.cwd();
const SRC = path.join(RACINE, 'src');
const VERBEUX = process.argv.includes('--verbeux');

/* ── Rassembler les fichiers ────────────────────────────────────────────── */
const vues = [];
const css = [];
(function p(d) {
  let e;
  try { e = fs.readdirSync(d, { withFileTypes: true }) } catch { return }
  for (const x of e) {
    const q = path.join(d, x.name);
    if (x.isDirectory()) p(q);
    else if (x.name.endsWith('.vue')) vues.push(q);
    else if (x.name.endsWith('.css')) css.push(q);
  }
})(SRC);
if (!vues.length) { console.error('  [KO] aucun .vue sous src/ — rien à mesurer.'); process.exit(2) }

/* ── Découper un .vue en régions ────────────────────────────────────────── */
function regions(chemin) {
  const src = fs.readFileSync(chemin, 'utf8');
  const iT = src.indexOf('<template');
  const iS = src.indexOf('<script');
  const iY = src.indexOf('<style');
  const bornes = [iT, iS, iY].filter((i) => i >= 0).sort((a, b) => a - b);
  const finTemplate = bornes.find((b) => b > iT) ?? src.length;
  return {
    src,
    // Le balisage : de <template> au bloc suivant.
    template: iT >= 0 ? src.slice(iT, finTemplate) : '',
    // Les styles : tous les <style> jusqu'à la fin.
    style: iY >= 0 ? src.slice(iY) : '',
    // Le script : entre <script et <style>, plus tout ce qui n'est ni template ni style.
    script: src.slice(0, iT >= 0 ? iT : src.length) + (iS >= 0 ? src.slice(iS, iY > iS ? iY : src.length) : ''),
    scoped: /<style[^>]*\bscoped\b/.test(src),
  };
}

/* Occupations d'une classe dans du texte de balisage : SANS point, mot entier. */
const dansBalisage = (classe, texte) => new RegExp('(?<![\\w-])' + classe.replace(/[-]/g, '\\-') + '(?![\\w-])').test(texte);

/* Classes déclarées dans un bloc de styles : AVEC point, mot entier. */
function classesStylees(texte) {
  const trouvees = new Set();
  for (const m of texte.matchAll(/\.([a-zA-Z][\w-]*)/g)) trouvees.add(m[1]);
  return trouvees;
}

/* ── Occupation globale (pour les feuilles non scopées) ──────────────────── */
const info = new Map();
for (const v of vues) info.set(v, regions(v));
const balisageGlobal = [...info.values()].map((r) => r.template + r.script).join('\n');

/* ── AUTO-TEST — avant toute conclusion ─────────────────────────────────── */
/* Ces classes sont CONNUES comme vivantes : présentes dans un template, une
   liaison :class, ou posées par le script. Si le contrôle ne les voit pas, il est
   faux et n'a pas le droit de conclure quoi que ce soit.

   ⚠ LA LISTE DES TÉMOINS DOIT ÊTRE VÉRIFIÉE COMME LE RESTE. La première version
   contenait `pre-outline-local` — un nom que j'avais inventé en écrivant la liste.
   Le contrôle a donc REFUSÉ de conclure, ce qui était le bon comportement : il ne
   savait pas reconnaître une classe vivante, et il l'a dit au lieu de produire un
   rapport. *Un auto-test qui échoue sur une faute de frappe est un auto-test qui
   fonctionne.* */
const TEMOINS_VIVANTS = ['help-modal', 'shortcut-item', 'progress-indicator', 'btn-outline', 'toast-container'];
const echecsTemoins = TEMOINS_VIVANTS.filter((t) => !dansBalisage(t, balisageGlobal));
/* Un témoin MORT : une classe inventée qui ne peut exister nulle part. */
const TEMOIN_MORT = 'classe-inexistante-verrou-css-2026';
const fauxNegatifMort = dansBalisage(TEMOIN_MORT, balisageGlobal);

console.log('='.repeat(76));
console.log('  CSS dont le balisage a disparu');
console.log('='.repeat(76));
console.log(`  fichiers analysés : ${vues.length} .vue · ${css.length} .css`);
console.log('');
console.log('  ── AUTO-TEST (avant toute conclusion) ──');
console.log(`     classes témoins VIVANTES reconnues : ${TEMOINS_VIVANTS.length - echecsTemoins.length}/${TEMOINS_VIVANTS.length}`);
if (echecsTemoins.length) console.log(`     [KO] non reconnues : ${echecsTemoins.join(', ')}`);
console.log(`     classe témoin MORTE correctement absente : ${fauxNegatifMort ? 'NON' : 'oui'}`);
if (echecsTemoins.length || fauxNegatifMort) {
  console.error('\n  [REFUS] l\'auto-test échoue : ce contrôle ne sait pas reconnaître une classe');
  console.error('          vivante. Il n\'a pas le droit de conclure. Rien n\'est rapporté.');
  process.exit(2);
}
console.log('     → le contrôle sait dire « oui ». Il peut donc dire « non ».');
console.log('');

/* ── Le rapport ─────────────────────────────────────────────────────────── */
const orphelines = [];
for (const [chemin, r] of info) {
  if (!r.style) continue;
  const stylees = classesStylees(r.style);
  const vivantes = r.scoped
    ? [...stylees].filter((c) => dansBalisage(c, r.template + r.script))
    : [...stylees].filter((c) => dansBalisage(c, balisageGlobal));
  const mortes = [...stylees].filter((c) => !vivantes.includes(c));
  if (mortes.length) orphelines.push({ chemin: path.relative(RACINE, chemin), n: mortes.length, mortes, octets: r.style.length });
}
/* Les feuilles .css globales. */
for (const chemin of css) {
  const texte = fs.readFileSync(chemin, 'utf8');
  const stylees = classesStylees(texte);
  const mortes = [...stylees].filter((c) => !dansBalisage(c, balisageGlobal));
  if (mortes.length) orphelines.push({ chemin: path.relative(RACINE, chemin), n: mortes.length, mortes, octets: texte.length });
}

orphelines.sort((a, b) => b.n - a.n);
const total = orphelines.reduce((s, o) => s + o.n, 0);
for (const o of orphelines) {
  console.log(`  ${String(o.n).padStart(3)} classe(s) orpheline(s)  ${o.chemin}${o.n >= 8 ? '   <-- concentration' : ''}`);
  if (VERBEUX) console.log('        ' + o.mortes.slice(0, 14).join(', ') + (o.mortes.length > 14 ? `, … +${o.mortes.length - 14}` : ''));
}
console.log('');
console.log('='.repeat(76));
console.log(`  ${total} classe(s) stylée(s) sans aucun balisage, réparties sur ${orphelines.length} fichier(s).`);
console.log('');
console.log('  ⛔ CE VERROU N\'EST PAS ENCORE FIABLE — NE PAS AGIR SUR SON VERDICT.');
console.log('     Son auto-test prouve qu\'il SAIT reconnaître une classe vivante littérale.');
console.log('     Mais sa première exécution complète a produit 356 « orphelines » dont');
console.log('     l\'essentiel sont des faux positifs, en QUATRE familles systématiques :');
console.log('');
console.log('     ① LES CLASSES DE TRANSITION VUE — `page-enter-active`, `modal-enter-from`,');
console.log('        `toast-leave-to`, `slide-up-enter-active`… Vue les INJECTE à l\'exécution');
console.log('        depuis l\'attribut `name` d\'un `<Transition>`. Elles n\'apparaissent');
console.log('        JAMAIS dans un balisage, et elles sont parfaitement vivantes.');
console.log('     ② LES CLASSES COMPOSÉES — `\'scroll-reveal--\' + animation`, `theme--{{…}}`,');
console.log('        `toast--{{type}}`. Le nom complet n\'existe nulle part, seulement son');
console.log('        préfixe. Le contrôle doit suivre les compositions, pas chercher un nom.');
console.log('     ③ LE MOTIF LUI-MÊME — `\\.([a-zA-Z][\\w-]*)` attrape les points des URL et des');
console.log('        extensions : `w3.org` donne « w3 » et « org », `index.css` donne « css »,');
console.log('        `f.woff2` donne « woff2 ». Ce ne sont pas des classes.');
console.log('     ④ LES FICHIERS `.js` NE SONT PAS PARCOURUS — `revealed` par exemple est posé');
console.log('        par le composable `useScrollReveal`, que ce script n\'ouvre pas.');
console.log('');
console.log('     Tant que ces quatre familles ne sont pas traitées, le chiffre ci-dessus est');
console.log('     une BORNE HAUTE sans valeur d\'action. *Un verrou dont on ne peut pas lire le');
console.log('     verdict n\'est pas un verrou — c\'est un brouillon, et il est écrit ici pour');
console.log('     que personne ne s\'en serve par erreur.*');
console.log('='.repeat(76));
process.exit(total ? 1 : 0);
