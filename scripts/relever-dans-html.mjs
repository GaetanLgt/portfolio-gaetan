#!/usr/bin/env node
/**
 * relever-dans-html.mjs — écrire le relevé FINAL dans le HTML DÉJÀ PRÉRENDU.
 * GL Digital Lab · 19/09/2026
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * POURQUOI CE FICHIER EXISTE — une contrainte d'ordre, mesurée, pas supposée
 *
 * La page `/etat-du-studio` doit afficher des chiffres qui soient (a) RÉELS,
 * (b) PRÉSENTS DANS LE HTML LIVRÉ — sinon un robot qui n'exécute pas de
 * JavaScript ne voit rien, et la page perd son objet. Ce second point impose que
 * les chiffres soient **importés par le composant**, donc connus de Vite **avant**
 * `vite build`.
 *
 * Or `dist/` n'existe qu'APRÈS le build. Le premier relevé ne peut donc pas
 * connaître les pages prérendues, le poids de la page la plus lourde ni le
 * nombre de requêtes. Mesure faite sur ce dépôt le 19/09/2026, à la première
 * version de ce montage :
 *
 *   HTML livré → « Horodatage du build : 09:53 », « 61 pages », « 406,1 Ko »
 *   fichier écrit en fin de build → « 09:54 », « 62 pages », « 406,2 Ko »
 *   et les verdicts portaient l'heure de 09:53 alors qu'ils avaient été obtenus
 *   à 09:54.
 *
 * Autrement dit : **le HTML décrivait une construction qui n'était plus celle
 * qu'on venait de faire.** Un décalage d'une minute et d'un kilooctet ne ruine
 * personne — mais c'est exactement le motif que cette page existe pour refuser :
 * un chiffre qui a l'air d'un fait et qui décrit autre chose.
 *
 * LA SOLUTION RETENUE, ET POURQUOI PAS UNE AUTRE
 *   · Remplacer le `import` par un `fetch()` : écarté — un robot n'exécute pas
 *     de JavaScript, donc il ne verrait aucun chiffre. C'est le contraire du but.
 *   · Reconstruire le site : écarté — `vite build` a déjà figé la valeur dans le
 *     paquet ; il faudrait une deuxième construction complète pour un chiffre.
 *   · Réécrire le HTML par une expression régulière sur les nombres : écarté — une
 *     expression régulière sur du texte rendu casse au premier changement de mise
 *     en page, et en silence.
 *   · **Ce fichier** : les zones qui portent une mesure sont MARQUÉES dans le
 *     composant (`data-etat="…"`), et cette passe n'écrit QUE dans les zones
 *     marquées. Le reste du HTML n'est pas touché — pas même un espace.
 *
 * ⚠️ CE QUE CETTE PASSE N'EST PAS : ce n'est pas une correction du HTML. C'est
 * l'écriture d'une mesure dans une zone qui lui est réservée, à l'endroit que le
 * composant a désigné. Si une zone marquée n'est pas trouvée, la passe ÉCHOUE et
 * le dit — un relevé qu'on croit écrit et qui ne l'est pas est pire que pas de
 * relevé. Et si elle trouve des valeurs DIFFÉRENTES de celles qui étaient
 * prérendues, elle les rapporte : c'est la mesure de l'écart décrit plus haut.
 *
 * USAGE
 *   node scripts/relever-dans-html.mjs                 → écrit, et rapporte
 *   node scripts/relever-dans-html.mjs --simuler       → rapporte sans écrire
 *
 * Sortie 0 = écrit (ou simulé). 1 = une zone marquée manque, ou dist/ est absent.
 * Ce script n'est PAS un verrou : il n'a pas de seuil à juger. Il rapporte.
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const RACINE = process.cwd();
const SIMULER = process.argv.includes('--simuler');

const RELEVE = join(RACINE, 'src', 'data', 'etat-studio.json');
const CIBLE = join(RACINE, 'dist', 'etat-du-studio', 'index.html');

if (!existsSync(RELEVE)) {
  console.error('  [KO]  src/data/etat-studio.json introuvable — lancer `node scripts/generer-etat.mjs`.');
  process.exit(1);
}
if (!existsSync(CIBLE)) {
  console.error('  [KO]  dist/etat-du-studio/index.html introuvable.');
  console.error('        Cette passe écrit dans le HTML LIVRÉ : lancez-la après `npm run build`.');
  process.exit(1);
}

const etat = JSON.parse(readFileSync(RELEVE, 'utf8'));

/** La valeur d'une mesure, mise en forme EXACTEMENT comme le composant le fait. */
const NB = new Intl.NumberFormat('fr-FR');
const ou = (v, unite = '') => (v === null || v === undefined ? 'non mesuré' : `${NB.format(v)}${unite}`);

/**
 * Les zones marquées, et ce qu'elles doivent porter.
 * ⚠️ Les clés sont celles du `data-etat` posé dans `EtatStudioPage.vue`. Ajouter
 * une mesure à la page sans l'ajouter ici laisserait une valeur prérendue (celle
 * du relevé précédent) : la passe le signale, justement pour ne pas laisser ce
 * décalage s'installer en silence.
 */
const zones = new Map([
  ['commit', etat.commit && etat.commit.court ? `${etat.commit.court}${etat.commit.sujet ? ' — ' + etat.commit.sujet : ''}` : 'non mesuré'],
  ['horodatage', (etat.build && etat.build.horodatage_local) || 'non mesuré'],
  ['pages', ou(etat.pages_prerendues)],
  [
    'poids',
    etat.page_la_plus_lourde && etat.page_la_plus_lourde.ko_servis !== null && etat.page_la_plus_lourde.ko_servis !== undefined
      ? `${etat.page_la_plus_lourde.chemin} — ${NB.format(etat.page_la_plus_lourde.ko_servis)} Ko servis`
      : 'non mesuré',
  ],
  [
    'requetes',
    etat.requetes_premier_chargement && etat.requetes_premier_chargement.total !== null && etat.requetes_premier_chargement.total !== undefined
      ? NB.format(etat.requetes_premier_chargement.total)
      : 'non mesuré',
  ],
  ['verrous_quand', (etat.build && etat.build.horodatage_minute) || 'non mesuré'],
]);

for (const v of etat.verrous || []) {
  zones.set(
    'verrou_' + v.cle,
    v.code === null || v.code === undefined ? 'non mesuré' : 'code de sortie ' + v.code,
  );
}

/* ─── Lecture du HTML livré ───────────────────────────────────────────────── */
let html = readFileSync(CIBLE, 'utf8');
const avant = html.length;

/** Échappe ce qu'on insère : on écrit du TEXTE dans un document HTML. */
const echapper = (t) => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

let ecrites = 0;
const manquantes = [];
const ecarts = [];

/**
 * Remplace le contenu de TOUS les éléments marqués d'une clé donnée.
 * ⚠️ TOUS, ET PAS LE PREMIER — c'est un défaut réellement produit ici le 19/09/2026,
 * trouvé en relisant le HTML livré et pas en relisant ce script : `String.replace`
 * avec un motif non global n'écrit que la PREMIÈRE occurrence. L'horodatage des verrous
 * était donc écrit pour le premier verrou et restait à la valeur du relevé précédent
 * pour les quatre autres — **quatre valeurs périmées sur la page**, toutes en
 * « code de sortie 0 », donc invisibles à l'œil.
 * *Une passe de correction qui n'en corrige qu'un sur cinq est pire que pas de passe :
 * elle donne l'assurance que le relevé est à jour.*
 * Le compteur de couverture plus bas ne voyait pas le défaut non plus, puisqu'il
 * compare des CLÉS et non des occurrences : il faut donc bel et bien remplacer tout.
 *
 * L'élément est repéré par son ATTRIBUT, pas par sa position ni par le nombre qu'il
 * contient : c'est ce qui rend cette passe insensible à une refonte de la mise en page.
 * On ne remplace jamais l'élément lui-même — seulement son contenu — pour ne pas
 * emporter ses attributs (`class`, `data-*`), qui portent le style.
 */
function remplacer(cle, valeur) {
  // Le motif accepte les attributs dans n'importe quel ordre, et exige que
  // l'attribut soit EXACT (`data-etat="pages"` ne doit pas répondre à `data-etat="pages-bis"`).
  const motif = new RegExp(`(<([a-z]+)\\b[^>]*\\bdata-etat="${cle}"[^>]*>)([\\s\\S]*?)(</\\2>)`, 'g');
  const occurrences = [...html.matchAll(motif)];
  if (occurrences.length === 0) { manquantes.push(cle); return; }
  const attendu = String(valeur);
  for (const m of occurrences) {
    const actuel = m[3].replace(/\s+/g, ' ').trim();
    if (actuel !== attendu) ecarts.push({ cle, avant: actuel.slice(0, 70), apres: attendu.slice(0, 70) });
  }
  html = html.replace(motif, (_entier, ouvrante, _balise, _contenu, fermante) => ouvrante + echapper(attendu) + fermante);
  ecrites += occurrences.length;
}

for (const [cle, valeur] of zones) remplacer(cle, valeur);

/* ─── Verdict ─────────────────────────────────────────────────────────────── */
console.log('');
console.log('='.repeat(72));
console.log('  RELEVÉ FINAL → HTML PRÉRENDU');
console.log('='.repeat(72));
console.log(`  cible        : dist/etat-du-studio/index.html`);
console.log(`  écritures    : ${ecrites} occurrence(s), sur ${zones.size} mesure(s) connue(s)`);

/* ── Les zones marquées DANS LE COMPOSANT mais absentes de la table ci-dessus ──
   C'est le garde-fou qui empêche le retour du décalage qu'on vient de corriger :
   une mesure ajoutée à la page sans être ajoutée ici resterait figée sur le
   relevé précédent, et personne ne le verrait. On la NOMME.

   ⚠️ DEUX FORMES SEULEMENT, ET ELLES SONT TENUES À PART.
   Le premier jet de ce garde-fou lisait toutes les valeurs de `data-etat` par une
   expression régulière, et il a immédiatement signalé `m.cle` et `'verrou_' + v.cle`
   comme des zones inconnues. **C'était un faux positif** : ce sont des LIAISONS
   Vue, dont les clés réelles sont construites à l'exécution. Les compter comme des
   zones inconnues aurait fait échouer cette passe sur un site correct — et un
   contrôle qui échoue à tort finit par être ignoré, ce qui est pire que pas de
   contrôle.
     · forme littérale  `data-etat="pages"`            → la clé est VÉRIFIÉE ;
     · forme liée       `:data-etat="…"`               → déclarée explicitement
       ci-dessous, et vérifiée autrement : par le NOMBRE de zones marquées dans le
       HTML livré (voir plus bas), qui est la seule mesure qui ne peut pas mentir. */
const LIAISONS_CONNUES = [
  { motif: 'm.cle', rendues: 5, pourquoi: 'les cinq mesures du build' },
  { motif: "'verrou_' + v.cle", rendues: null, pourquoi: 'une par verrou, comptée dans le HTML' },
];

const marqueesDansLeComposant = new Set();
const composant = join(RACINE, 'src', 'views', 'core', 'EtatStudioPage.vue');
if (existsSync(composant)) {
  const src = readFileSync(composant, 'utf8');
  for (const m of src.matchAll(/(?<![:\w-])data-etat="([^"]+)"/g)) marqueesDansLeComposant.add(m[1]);
}
const inconnues = [...marqueesDansLeComposant].filter(
  (c) => !zones.has(c) && !LIAISONS_CONNUES.some((l) => l.motif === c),
);
if (inconnues.length) {
  console.log('');
  console.log(`  [KO]  ${inconnues.length} zone(s) marquée(s) dans le composant mais inconnue(s) ici :`);
  for (const c of inconnues) console.log(`        · data-etat="${c}"`);
  console.log('        Ces zones garderaient la valeur du relevé PRÉCÉDENT. Ajoutez-les à ce script.');
}

/* ── Le contrôle qui ne peut pas se tromper : ce qui est RÉELLEMENT dans le HTML ──
   On lit les clés marquées dans le fichier livré, et on exige de les avoir TOUTES
   écrites. Une zone marquée que la table ne connaît pas y apparaît, quelle que soit
   la façon dont le composant l'a écrite — y compris par une liaison Vue que l'analyse
   du source aurait manquée.
   ⚠️ On compare des CLÉS DISTINCTES, pas des occurrences : une même mesure répétée
   dans la page ne doit pas fabriquer un écart qui n'existe pas. */
const clesDansLeHtml = new Set([...html.matchAll(/data-etat="([^"]+)"/g)].map((m) => m[1]));
const nonEcrites = [...clesDansLeHtml].filter((c) => !zones.has(c));
if (nonEcrites.length) {
  console.log('');
  console.log(`  [KO]  ${nonEcrites.length} zone(s) marquée(s) dans le HTML livré mais pas écrite(s) :`);
  for (const c of nonEcrites) console.log(`        · data-etat="${c}"`);
  console.log('        Elles garderaient la valeur du relevé PRÉCÉDENT.');
} else {
  console.log(`  couverture   : ${clesDansLeHtml.size} zone(s) marquée(s) dans le HTML livré, toutes écrites`);
}

if (ecarts.length) {
  console.log('');
  console.log(`  ⚠️  ${ecarts.length} valeur(s) DIFFÉRENTE(S) de celle qui avait été prérendue`);
  console.log('      (c\'est le décalage que cette passe existe pour corriger) :');
  for (const e of ecarts) console.log(`        ${e.cle.padEnd(16)} « ${e.avant} »  →  « ${e.apres} »`);
} else {
  console.log('');
  console.log('  Aucun écart : le HTML prérendu portait déjà les valeurs du relevé final.');
}

if (manquantes.length || inconnues.length || nonEcrites.length) {
  console.log('');
  if (manquantes.length) {
    console.log(`  [KO]  ${manquantes.length} zone(s) marquée(s) INTROUVABLE(S) dans le HTML livré :`);
    for (const c of manquantes) console.log(`        · data-etat="${c}"`);
    console.log('        Le composant a changé, ou la page n\'est pas celle attendue.');
    console.log('        On n\'écrit pas un relevé partiel en le présentant comme complet.');
  }
  console.log('='.repeat(72));
  process.exit(1);
}

if (SIMULER) {
  console.log('');
  console.log('  (simulation : rien n\'a été écrit)');
  console.log('='.repeat(72));
  process.exit(0);
}

writeFileSync(CIBLE, html, 'utf8');
console.log('');
console.log(`  fichier      : ${avant} → ${html.length} octets`);
console.log('  Verrou tenu : le relevé livré est celui de la construction qui vient de finir.');
console.log('='.repeat(72));
console.log('');
