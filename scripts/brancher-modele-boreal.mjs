#!/usr/bin/env node
/* ============================================================================
 * brancher-modele-boreal.mjs — GL Digital Lab — 22/09/2026
 *
 * Branche la route `/modeles/boutique-boreal` dans `src/router/index.js`.
 *
 * ⛔⛔ LE DÉFAUT QUE CE SCRIPT FERME, ET IL A ÉTÉ PAYÉ DEUX FOIS.
 *
 *   Première version, 22/09/2026 : l'ancrage était la LIGNE DE PROPRIÉTÉ
 *       "    path: '/dossier',"
 *   et le bloc était inséré DEVANT elle. Or l'accolade qui OUVRE l'objet
 *   `/dossier` se trouve AVANT cette ligne. Résultat :
 *
 *       },                      <- fin de la route précédente
 *       {                       <- ouvre /dossier… mais /dossier n'est plus là
 *       {  …ma route…  },       <- un objet DANS un objet
 *       path: '/dossier',       <- propriété ORPHELINE, dans rien
 *
 *   ⭐ ET LE PIRE : les assertions de cette première version vérifiaient le
 *     NOMBRE de routes, la présence des chaînes, le BOM et les fins de ligne —
 *     **tout sauf la STRUCTURE.** Le fichier ne se parsait plus, et le script
 *     a écrit quand même.
 *
 *   ⛔ C'est mot pour mot le défaut documenté la veille :
 *      « mes assertions vérifiaient les INGRÉDIENTS, pas la STRUCTURE.
 *        Des règles justes peuvent composer un fichier faux. »
 *
 *   ⇒ CE QUI CHANGE : le fichier est **PARSÉ** avant et après l'écriture, par un
 *     vrai analyseur (`acorn`, déjà dans `node_modules` via Rollup), et les
 *     routes sont comptées **DANS L'ARBRE SYNTAXIQUE**, pas dans le texte.
 *     *Un fichier qui ne se parse pas n'est pas un fichier.*
 * ========================================================================== */

import { readFileSync, writeFileSync } from 'node:fs'
import { parse } from 'acorn'

const F = 'C:/IA/portfolio-gaetan/src/router/index.js'
const avant = readFileSync(F, 'utf8')

/* ── 1. LA STRUCTURE, D'ABORD — et sur le fichier D'ORIGINE ──────────────── */
function routesDe(texte) {
  const arbre = parse(texte, { sourceType: 'module', ecmaVersion: 'latest' })
  const decl = arbre.body.find(
    (n) => n.type === 'VariableDeclaration' && n.declarations.some((d) => d.id.name === 'routes')
  )
  if (!decl) throw new Error("aucune déclaration `const routes = …` dans le fichier")
  const tableau = decl.declarations.find((d) => d.id.name === 'routes').init
  if (tableau.type !== 'ArrayExpression') throw new Error('`routes` n’est pas un tableau littéral')
  return tableau.elements
}
function imports(texte) {
  // ⛔ DÉFAUT DE LA PREMIÈRE VERSION, CORRIGÉ ICI : elle cherchait une
  // `VariableDeclaration` dont l'`init` serait directement un `ImportExpression`.
  // Or le code écrit `const X = () => import('…')` — l'import est dans le CORPS
  // d'une fonction fléchée. Le parcours ne trouvait donc RIEN, et l'assertion
  // accusait le fichier à tort. *Un contrôle qui ne regarde qu'une forme de
  // chemin ne couvre pas le chemin.*
  const arbre = parse(texte, { sourceType: 'module', ecmaVersion: 'latest' })
  const trouves = []
  const visite = (n) => {
    if (!n || typeof n !== 'object') return
    if (Array.isArray(n)) { n.forEach(visite); return }
    if (n.type === 'ImportExpression' && n.source && typeof n.source.value === 'string') {
      trouves.push(n.source.value)
    }
    for (const cle of Object.keys(n)) {
      if (cle !== 'type' && cle !== 'start' && cle !== 'end') visite(n[cle])
    }
  }
  visite(arbre)
  return trouves
}

if (avant.charCodeAt(0) === 0xfeff) throw new Error('ASSERTION 0 : le fichier porte un BOM')

const routesAvant = routesDe(avant)                 // lève si le fichier est déjà cassé
const CRLF = (avant.match(/\r\n/g) || []).length
const LFseul = (avant.match(/(?<!\r)\n/g) || []).length
if (CRLF === 0 || LFseul !== 0) {
  throw new Error(`ASSERTION 1 : fins de ligne inattendues (CRLF=${CRLF}, LF seul=${LFseul})`)
}
if (avant.includes('/modeles/boutique-boreal')) {
  throw new Error('ASSERTION 2 : la route existe DÉJÀ — on ne double pas')
}

/* ── 2. LES ANCRAGES — l'accolade de l'OBJET, pas la ligne de propriété ──── */
const ANCRE_IMPORT =
  "const ComponentsLibrary = () => import('@/views/resources/components-library/ComponentsLibrary.vue');"
const ANCRE_SEAM = "  },\r\n  {\r\n    path: '/contact',\r\n"

for (const [nom, a] of [['import', ANCRE_IMPORT], ['couture', ANCRE_SEAM]]) {
  const n = avant.split(a).length - 1
  if (n !== 1) throw new Error(`ASSERTION 3 : l'ancre « ${nom} » apparaît ${n} fois, attendu 1`)
}

/* ── 3. LE BLOC À INSÉRER ────────────────────────────────────────────────── */
const IMPORT = [
  '',
  '// MODÈLES — les gabarits vendables du studio.',
  '// ⭐ Construit le 22/09/2026 en « tranche verticale » : un seul modèle, entier et',
  '// mesuré, plutôt que vingt annoncés. Doctrine du studio : *« tant que cette',
  '// tranche n\'existe pas, l\'offre n\'est pas vendable. »*',
  '// ⛔ Rien d\'un tiers n\'y entre : boutique, objets, textes et pictogrammes sont',
  '// inventés, et les couleurs viennent des jetons de `variables.css`.',
  'const ModeleBorealBoutique = () => import(\'@/views/modeles/ModeleBorealBoutique.vue\');',
].join('\r\n')

const ROUTE = [
  '  // ── MODÈLES : le gabarit vendable, en tranche verticale ──────────────────',
  '  {',
  "    path: '/modeles/boutique-boreal',",
  "    name: 'ModeleBorealBoutique',",
  '    // UNE SEULE ROUTE POUR CINQ MARCHES, ET C\'EST DÉLIBÉRÉ.',
  '    // La vitrine, le catalogue, la fiche produit, le panier et la commande vivent',
  '    // dans l\'état local et le fragment d\'adresse (`#catalogue`, `#fiche/<id>`,',
  '    // `#panier`, `#commande` : liens directs qui marchent).',
  '    // Cinq routes séparées auraient eu besoin de cinq entrées au routeur, au',
  '    // prérendu et à la topographie — cinq occasions de divergence, pour un seul',
  '    // modèle. *On ne multiplie pas les portes quand une suffit.*',
  '    // ⚠️ `topographie.js` est la source du PLAN DE SITE, pas le routeur : sans',
  '    //   entrée là-bas, `verifier-topographie.mjs` rend une NOTE non bloquante.',
  '    //   Le prérendu, lui, lit le routeur : la page SERA prérendue. La note est',
  '    //   assumée tant que la publication de ces modèles au sitemap n\'est pas décidée.',
  '    component: ModeleBorealBoutique,',
  '    meta: {',
  "      title: 'Modèle de boutique — démonstration Atelier Boréal | Génie IT TeK FR',",
  '      description: \'Démonstration d\\\'un modèle de boutique : catalogue filtrable, fiche produit, panier persistant et tunnel de commande simulé — aucun paiement, aucune donnée transmise. Navigation clavier et manette Xbox.\'',
  '    }',
  '  },',
].join('\r\n')

/* ── 4. L'ÉCRITURE, EN DEUX TEMPS, CHACUN ASSERTÉ ────────────────────────── */
let apres = avant.replace(ANCRE_IMPORT, ANCRE_IMPORT + '\r\n' + IMPORT)
if (apres === avant) throw new Error("ASSERTION 4 : l'import n'a pas été inséré")

apres = apres.replace(ANCRE_SEAM, '  },\r\n' + ROUTE + '\r\n  {\r\n    path: \'/contact\',\r\n')
if (apres === avant) throw new Error('ASSERTION 5 : la route n’a pas été insérée')

/* ⭐⭐⭐ L'ASSERTION STRUCTURELLE — CELLE QUI MANQUAIT. */
let routesApres
try {
  routesApres = routesDe(apres)
} catch (e) {
  throw new Error('ASSERTION 6 : LE FICHIER NE SE PARSE PLUS — rien n’a été écrit.\n         ' + e.message)
}
if (routesApres.length !== routesAvant.length + 1) {
  throw new Error(`ASSERTION 7 : ${routesAvant.length} route(s) avant, ${routesApres.length} après — attendu ${routesAvant.length + 1}`)
}

/* Et on vérifie la route DANS L'ARBRE, pas dans le texte. */
function valeurPropriete(objet, nom) {
  const p = objet.properties.find((x) => x.key && (x.key.name === nom || x.key.value === nom))
  return p ? (p.value.value ?? p.value.name ?? null) : null
}
const trouvees = routesApres.filter(
  (e) => e && e.type === 'ObjectExpression' && valeurPropriete(e, 'path') === '/modeles/boutique-boreal'
)
if (trouvees.length !== 1) {
  throw new Error(`ASSERTION 8 : ${trouvees.length} route(s) « /modeles/boutique-boreal » dans l'ARBRE, attendu 1`)
}
const r = trouvees[0]
if (valeurPropriete(r, 'name') !== 'ModeleBorealBoutique') {
  throw new Error('ASSERTION 9 : le nom de la route ne correspond pas au nom du composant')
}
if (valeurPropriete(r, 'component') !== 'ModeleBorealBoutique') {
  throw new Error('ASSERTION 10 : la route ne monte pas la constante importée')
}
if (!imports(apres).includes('@/views/modeles/ModeleBorealBoutique.vue')) {
  throw new Error("ASSERTION 11 : l'import paresseux du composant est introuvable dans l'ARBRE")
}
if ((apres.match(/\r\n/g) || []).length < CRLF) throw new Error('ASSERTION 12 : des CRLF ont disparu')
if ((apres.match(/(?<!\r)\n/g) || []).length !== 0) throw new Error('ASSERTION 13 : des LF se sont glissés dans un fichier CRLF')

/* ── 5. ON ÉCRIT — seulement maintenant ──────────────────────────────────── */
writeFileSync(F, apres, 'utf8')
const b = readFileSync(F)
console.log('  ECRIT.')
console.log('  octets          : ' + b.length + '   (avant ' + Buffer.byteLength(avant) + ')')
console.log('  routes          : ' + routesAvant.length + ' -> ' + routesApres.length + '   (comptées DANS L\'ARBRE)')
console.log('  la route        : path=' + valeurPropriete(r, 'path') + '  name=' + valeurPropriete(r, 'name') + '  component=' + valeurPropriete(r, 'component'))
console.log('  le fichier SE PARSE : oui')
console.log('  premiers octets : ' + [...b.slice(0, 3)].join(' ') + (b[0] === 0xEF ? '  ** BOM **' : '  (pas de BOM)'))
