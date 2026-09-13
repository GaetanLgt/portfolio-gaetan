#!/usr/bin/env node
/**
 * verifier-css-sans-balisage.mjs — du CSS dont le balisage a disparu
 *
 * POURQUOI. Ce dépôt a déjà laissé du CSS derrière lui : la direction artistique a
 * changé les 09-11/09 (« l'ambiance anime sombre MND est retirée »), des sections ont
 * quitté le balisage, et leurs règles sont restées. *Un composant qu'on vide laisse
 * ses murs.*
 *
 * QUATRE VERSIONS ONT ÉTÉ NÉCESSAIRES. LES TROIS PREMIÈRES ÉTAIENT FAUSSES.
 *   ① Une sonde `querySelector` sur 26 routes, à une largeur et dans un état :
 *      58,5 % de sélecteurs « jamais apparus ». Sa propre liste la démentait
 *      (`.nav-mobile`, des modales) — c'étaient des absences de la sonde, pas du site.
 *   ② Un contrôle qui cherchait la classe **avec son point** dans le `<template>`.
 *      Dans un balisage une classe s'écrit `class="help-modal"`, SANS point : le motif
 *      ne pouvait JAMAIS en trouver une. Il annonçait 14 classes mortes là où il y en
 *      avait 8, et déclarait absente `.help-modal`, présent ligne 10 de son composant.
 *   ③ Un rapport à 356 « orphelines » mêlant cinq familles de faux positifs.
 *   ④ Cette version. Elle traite les cinq :
 *        · les classes de TRANSITION VUE (`page-enter-active`…) — Vue les injecte à
 *          l'exécution depuis le `name` d'un `<Transition>`, et **ce nom peut être
 *          CALCULÉ** (`App.vue` : `const getTransitionName = () => 'page'`). Chercher
 *          le nom est la mauvaise approche : on reconnaît le SUFFIXE, réservé par Vue.
 *        · les classes COMPOSÉES (`'scroll-reveal--' + animation`) — seul le préfixe
 *          existe dans le code.
 *        · les points des URL et des extensions, pris pour des classes (`w3.org` →
 *          « w3 »). Corrigé en ne lisant que les PRÉLUDES de sélecteurs, jamais les
 *          corps de règle ni les valeurs.
 *        · les fichiers `.js`/`.ts`, jamais parcourus alors que des classes y sont
 *          posées (`useScrollReveal` pose `revealed`).
 *        · la RÉGION de style : la prendre jusqu'à la fin du fichier absorbait du
 *          JavaScript quand un composant porte du script après son style. Le rapport
 *          sortait alors des « classes » nommées `createElement`, `href`, `download`,
 *          `w3`, `org`. *Ce n'était pas des classes : c'était mon découpage.*
 *
 * LA RÈGLE QUI GOUVERNE CE FICHIER : **un contrôle doit être éprouvé sur un cas dont
 * on CONNAÎT la réponse avant de servir à décider.** L'auto-test ci-dessous a un témoin
 * PAR FAMILLE, et il a REFUSÉ de conclure deux fois pendant l'écriture de ce script —
 * les deux fois à raison.
 *
 * DEUX PORTÉES, QUI NE SE CONFONDENT PAS :
 *   · `<style scoped>` d'un `.vue` → ne peut s'appliquer qu'à un élément DE CE
 *     composant : on cherche dans **son** template ;
 *   · `.css` global → s'applique partout : on cherche dans **tous** les balisages.
 *
 * USAGE
 *   node scripts/verifier-css-sans-balisage.mjs [--verbeux]
 * Sortie 0 = aucune orpheline · 1 = il y en a · 2 = auto-test en échec.
 */

import fs from 'node:fs';
import path from 'node:path';

const RACINE = process.cwd();
const SRC = path.join(RACINE, 'src');
const VERBEUX = process.argv.includes('--verbeux');

/* ── Rassembler les fichiers ────────────────────────────────────────────── */
const vues = [], css = [], js = [];
(function p(d) {
  let e; try { e = fs.readdirSync(d, { withFileTypes: true }) } catch { return }
  for (const x of e) {
    const q = path.join(d, x.name);
    if (x.isDirectory()) p(q);
    else if (x.name.endsWith('.vue')) vues.push(q);
    else if (x.name.endsWith('.css')) css.push(q);
    else if (/\.(js|ts|mjs)$/.test(x.name)) js.push(q);
  }
})(SRC);
if (!vues.length) { console.error('  [KO] aucun .vue sous src/ — rien à mesurer.'); process.exit(2) }

const lire = (f) => fs.readFileSync(f, 'utf8');
/* ⚠ LES FICHIERS HTML COMPTENT AUSSI. `no-js` est écrit dans `index.html`, puis
   retiré par un script en ligne du `<head>` : la classe vit hors de `src/`, et ne
   pas la lire la faisait ressortir comme orpheline. On collecte donc ici, AVANT
   tout usage, les `.html` de la racine et de `public/`. */
const htmls = [];
for (const d of [RACINE, path.join(RACINE, 'public'), path.join(RACINE, 'src')]) {
  let e; try { e = fs.readdirSync(d, { withFileTypes: true }) } catch { continue }
  for (const x of e) if (!x.isDirectory() && x.name.endsWith('.html')) htmls.push(path.join(d, x.name));
}
/* Chaque région est BORNÉE par sa balise de fermeture — jamais « jusqu'à la fin ». */
const blocTemplate = (src) => (src.match(/<template[\s\S]*?<\/template>/g) || []).join('\n');
const blocStyle = (src) => (src.match(/<style[^>]*>[\s\S]*?<\/style>/g) || []).join('\n');
const blocScript = (src) => src.replace(/<template[\s\S]*?<\/template>/g, ' ').replace(/<style[^>]*>[\s\S]*?<\/style>/g, ' ');

const info = new Map();
for (const v of vues) {
  const src = lire(v);
  info.set(v, {
    template: blocTemplate(src),
    style: blocStyle(src),
    script: blocScript(src),
    scoped: /<style[^>]*\bscoped\b/.test(src),
  });
}

/* ── Lire les classes dans les PRÉLUDES de sélecteurs, jamais dans les corps ─
   On avance de séparateur en séparateur en suivant la PROFONDEUR des accolades :
   à profondeur 0, ce qui précède un `{` est un prélude de règle (on y lit les
   classes) ou un prélude d'@règle (on l'ignore) ; à profondeur > 0, on est dans un
   corps, où il n'y a pas de sélecteur — donc pas de classe à lire. C'est ce qui
   supprime les « classes » venues des URL et des extensions. */
function classesStylees(texteCss) {
  const sans = texteCss
    .replace(/\/\*[\s\S]*?\*\//g, ' ')
    .replace(/@font-face[\s\S]*?\{[\s\S]*?\}/g, ' ');
  const trouvees = new Set();
  let profondeur = 0, depart = 0;
  for (let i = 0; i < sans.length; i++) {
    const c = sans[i];
    if (c === '{') {
      const prelude = sans.slice(depart, i).trim();
      if (prelude && !prelude.startsWith('@')) {
        for (const m of prelude.matchAll(/\.(-?[_a-zA-Z][\w-]*)/g)) trouvees.add(m[1]);
      }
      profondeur++; depart = i + 1;
    } else if (c === '}') {
      profondeur = Math.max(0, profondeur - 1); depart = i + 1;
    } else if (c === ';' && profondeur === 0) {
      depart = i + 1;
    }
  }
  return trouvees;
}

/* ── ① Transitions Vue : on reconnaît le SUFFIXE, pas le nom ─────────────── */
const SUFFIXES_TRANSITION = ['-enter-active', '-leave-active', '-enter-from', '-leave-to', '-enter-to', '-leave-from'];
const nomsTransition = new Set();
for (const r of info.values()) {
  for (const m of r.template.matchAll(/<(?:Transition|transition|TransitionGroup|transition-group)\b[^>]*?\bname\s*=\s*["']([^"']+)["']/g)) nomsTransition.add(m[1]);
  if (/<(?:Transition|transition)\b/.test(r.template)) nomsTransition.add('v');
}
const estClasseDeTransition = (c) => SUFFIXES_TRANSITION.some((s) => c.endsWith(s));

/* ── ② Classes composées : on collecte les fragments concaténés ──────────── */
const texteTotal = [...info.values()].map((r) => r.script + r.template).join('\n') + js.map(lire).join('\n');
const fragments = new Set();
/* Concatenation classique : 'prefixe-' + x  et  x + 'suffixe' */
for (const m of texteTotal.matchAll(/["'`]([A-Za-z][\w-]{2,60})["'`]\s*\+/g)) fragments.add(m[1]);
for (const m of texteTotal.matchAll(/\+\s*["'`]([A-Za-z][\w-]{2,60})["'`]/g)) fragments.add(m[1]);
/* ⑥ GABARITS À INTERPOLATION : `arkadia-page--${theme}` ne laisse AUCUN signe `+`.
   Sans cette ligne, des modificateurs BEM parfaitement vivants ressortaient comme
   orphelins (`arkadia-page--dawn`, `solution-card--featured`, `offer-card--featured`).
   On prend le texte qui précède la première interpolation. */
for (const m of texteTotal.matchAll(/`([A-Za-z][\w-]{2,60}?)\$\{/g)) fragments.add(m[1]);
const estProbablementComposee = (c) => [...fragments].some((f) => f.length >= 3 && c.startsWith(f));

/* ── ④ La matière où chercher : balisage, scripts, ET fichiers HTML ──────── */
/* ⚠ `htmls` est déclaré plus bas : on le calcule donc ici sous forme de fonction,
   pour que le périmètre GLOBAL en tienne compte comme le périmètre scopé. Ne pas
   l'inclure laissait `no-js` — écrit dans `index.html` — ressortir comme orphelin. */
const balisageGlobal = () => [...info.values()].map((r) => r.template + r.script).join('\n')
  + js.map(lire).join('\n') + htmls.map(lire).join('\n');
const dansTexte = (classe, texte) => new RegExp('(?<![\\w-])' + classe.replace(/-/g, '\\-') + '(?![\\w-])').test(texte);
const vivante = (c, haystack) => dansTexte(c, haystack) || estClasseDeTransition(c) || estProbablementComposee(c);

/* ── AUTO-TEST — un témoin par famille, AVANT toute conclusion ──────────── */
const TEMOINS = [
  ['help-modal', 'littérale dans un template'],
  ['shortcut-item', 'littérale, plusieurs occurrences'],
  ['page-enter-active', '① transition Vue à nom CALCULÉ'],
  ['modal-enter-from', '① transition Vue à nom littéral'],
  ['scroll-reveal--fade-up', '② composée par concaténation'],
  ['arkadia-page--dawn', '⑥ composée par GABARIT À INTERPOLATION'],
  ['revealed', '④ posée par un .js (composable)'],
];
const echecs = TEMOINS.filter(([c]) => !vivante(c, balisageGlobal()));
const TEMOIN_MORT = 'classe-inexistante-verrou-css-2026';
const mortBienVue = !vivante(TEMOIN_MORT, balisageGlobal());

console.log('='.repeat(78));
console.log('  CSS dont le balisage a disparu');
console.log('='.repeat(78));
console.log(`  fichiers : ${vues.length} .vue · ${css.length} .css · ${js.length} .js/.ts`);
console.log(`  transitions : ${nomsTransition.size} nom(s) repéré(s) · suffixes réservés reconnus structurellement`);
console.log(`  fragments de composition : ${fragments.size}`);
console.log('');
console.log('  ── AUTO-TEST (un témoin par famille) ──');
for (const [c, quoi] of TEMOINS) console.log(`     ${echecs.some(([x]) => x === c) ? '[KO]' : '[ok]'}  ${c.padEnd(24)} ${quoi}`);
console.log(`     ${mortBienVue ? '[ok]' : '[KO]'}  ${TEMOIN_MORT.padEnd(24)} témoin mort, correctement absent`);
if (echecs.length || !mortBienVue) {
  console.error('\n  [REFUS] auto-test en échec : le contrôle ne sait pas reconnaître une famille.');
  console.error('          Il n\'a pas le droit de conclure. Rien n\'est rapporté.');
  process.exit(2);
}
console.log('     → les cinq familles sont couvertes. Le contrôle peut conclure.');
console.log('');

/* ── Le rapport ─────────────────────────────────────────────────────────── */
const NON_CLASSES = new Set(['js', 'ts', 'css', 'woff', 'woff2', 'png', 'jpg', 'svg', 'json', 'mjs', 'html', 'org', 'com', 'fr', 'net']);
/* ── ⑧ Deux sources d'occupation HORS de `src/` ────────────────────────────
   Deux familles de plus ressortaient comme orphelines alors qu'elles sont vivantes :
     · les classes INJECTÉES PAR UN CADRE — Vue Router pose `router-link-active`,
       `router-link-exact-active` et `router-link-active` sur le lien courant. Elles
       n'existent nulle part dans le code : le routeur les ajoute à l'exécution.
     · les classes posées par le script EN LIGNE de `index.html` — `no-js` est écrit
       dans le HTML livré, puis retiré par un script du `<head>`. Ce fichier ne vit
       pas sous `src/`, donc le verrou ne le lisait pas.
   On lit donc aussi les `.html` de la racine et de `public/` — collectés plus haut,
   avec le reste des fichiers, pour que le périmètre GLOBAL en tienne compte aussi. */
/* Classes que le routeur de Vue ajoute : elles ne sont écrites nulle part. */
const CLASSES_DU_CADRE = new Set([
  'router-link-active', 'router-link-exact-active', 'router-link-active-exact',
]);

/* ── ⑦ Un style SCOPÉ peut quand même être appliqué par un composable ──────
   Le périmètre d'un `<style scoped>` est le composant — mais la CLASSE peut être
   posée par un fichier `.js` partagé (`useScrollReveal` pose `revealed`, que trois
   composants reçoivent). Chercher seulement dans le template et le script du
   composant faisait donc ressortir `revealed` comme orphelin dans trois fichiers.
   On ajoute les `.js` — et les `.html` — au périmètre des composants scopés, sans y
   ajouter les autres templates, qui ne peuvent pas atteindre ce composant. */
const texteHorsComposant = js.map(lire).join('\n') + htmls.map(lire).join('\n');
const orphelines = [];
const examiner = (chemin, texte, haystack) => {
  const mortes = [...classesStylees(texte)].filter((c) =>
    c.length > 2 && !NON_CLASSES.has(c) && !CLASSES_DU_CADRE.has(c) && !vivante(c, haystack));
  if (mortes.length) orphelines.push({ chemin: path.relative(RACINE, chemin), mortes });
};
for (const [chemin, r] of info) if (r.style) examiner(chemin, r.style, r.scoped ? r.template + r.script + texteHorsComposant : balisageGlobal());
for (const f of css) examiner(f, lire(f), balisageGlobal());

orphelines.sort((a, b) => b.mortes.length - a.mortes.length);
const total = orphelines.reduce((s, o) => s + o.mortes.length, 0);
for (const o of orphelines) {
  console.log(`  ${String(o.mortes.length).padStart(3)} classe(s)   ${o.chemin}`);
  if (VERBEUX) console.log('        ' + o.mortes.slice(0, 16).join(', ') + (o.mortes.length > 16 ? `, … +${o.mortes.length - 16}` : ''));
}
console.log('');
console.log('='.repeat(78));
console.log(`  ${total} classe(s) stylée(s) sans balisage, sur ${orphelines.length} fichier(s).`);
if (total) {
  console.log('');
  console.log('  PORTÉE DU VERDICT');
  console.log('    · les cinq familles de faux positifs sont exclues, et l\'auto-test le prouve');
  console.log('      famille par famille ;');
  console.log('    · le sens est utile : une classe ABSENTE de tout balisage, de toute');
  console.log('      composition et de tout script NE PEUT PAS s\'appliquer ;');
  console.log('    · ce n\'est PAS une preuve de mort : une classe vivante peut n\'être jamais');
  console.log('      RENDUE (un `v-if` faux). On ne conclut pas « inutile », on conclut');
  console.log('      « non applicable » ;');
  console.log('    · la retirer se fait fichier par fichier, avec comparaison de géométrie');
  console.log('      avant/après. Ce verrou DÉSIGNE ; il ne supprime pas.');
}
console.log('='.repeat(78));
process.exit(total ? 1 : 0);

