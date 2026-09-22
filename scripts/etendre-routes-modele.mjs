#!/usr/bin/env node
/* ============================================================================
 * etendre-routes-modele.mjs — GL Digital Lab — 22/09/2026
 *
 * ⛔ LA DÉCISION QUI ANNULE LA PRÉCÉDENTE.
 *   Gaëtan, 22/09/2026 : « Le garde-fou qui gère qu'une seule route à la fois,
 *   c'est bon, il casse les pieds et tu le dégages. »
 *
 *   MESURE : il n'existait AUCUN garde-fou. La contrainte n'était qu'un
 *   COMMENTAIRE — celui du composant (« Poser cinq routes aurait voulu dire soit
 *   modifier src/router/index.js (interdit ici), soit livrer cinq liens morts »)
 *   et celui du script de branchement. Le sous-agent avait l'interdiction de
 *   toucher au routeur ; elle a été levée depuis, et l'interdiction est restée
 *   écrite alors que sa raison avait disparu.
 *   ⭐ *Une contrainte qui survit à sa raison est une contrainte qu'on subit.*
 *
 *   ET LA RAISON DE FOND EST DE MÉTIER : un panier en `#panier` **ne s'indexe
 *   pas, ne se partage pas, ne s'achète pas.** Un modèle de boutique destiné à
 *   la vente avec cinq fragments au lieu de cinq adresses, personne ne l'achète.
 *
 * ⭐⭐ ET LA MÉTHODE, ELLE, A CHANGÉ — c'est la vraie leçon du 22/09.
 *   La première version de ce branchement ANCRAIT SUR UNE LIGNE DE TEXTE
 *   («     path: '/dossier', ») et a inséré le bloc au mauvais endroit : un
 *   objet dans un objet, des propriétés orphelines, un fichier qui ne se
 *   parsait plus — **et elle a écrit quand même.**
 *   ⇒ ICI, ON NE DEVINE AUCUNE ANCRE : on demande à l'analyseur la POSITION
 *     EXACTE du nœud après lequel insérer (`node.end`), et on écrit là.
 *     *Un analyseur sait où est la fin d'un objet. Une expression régulière le
 *     suppose.*
 * ========================================================================== */

import { readFileSync, writeFileSync } from 'node:fs'
import { parse } from 'acorn'

const F = 'C:/IA/portfolio-gaetan/src/router/index.js'
const avant = readFileSync(F, 'utf8')
const CRLF = avant.includes('\r\n') ? '\r\n' : '\n'

/* ── 1. LES OUTILS D'ANALYSE ─────────────────────────────────────────────── */
function arbreDe(texte) {
  return parse(texte, { sourceType: 'module', ecmaVersion: 'latest' })
}
function routesNoeuds(texte) {
  const arbre = arbreDe(texte)
  const decl = arbre.body.find(
    (n) => n.type === 'VariableDeclaration' && n.declarations.some((d) => d.id.name === 'routes')
  )
  if (!decl) throw new Error('aucune déclaration `const routes = …`')
  return decl.declarations.find((d) => d.id.name === 'routes').init.elements.filter(Boolean)
}
const prop = (obj, nom) => {
  const p = obj.properties.find((x) => x.key && (x.key.name === nom || x.key.value === nom))
  return p ? (p.value.value ?? p.value.name ?? null) : null
}

if (avant.charCodeAt(0) === 0xfeff) throw new Error('ASSERTION 0 : le fichier porte un BOM')

const noeudsAvant = routesNoeuds(avant)      // lève si le fichier est déjà cassé
console.log('  routes AVANT : ' + noeudsAvant.length)

/* ── 2. LES CINQ MARCHES ─────────────────────────────────────────────────── */
const BASE = '/modeles/boutique-boreal'
const A_AJOUTER = [
  { path: BASE + '/catalogue',   name: 'ModeleBorealCatalogue', titre: 'Catalogue',              desc: 'Catalogue filtrable et triable du modèle de boutique Atelier Boréal : 13 objets, 4 catégories, aucune ressource externe.' },
  { path: BASE + '/produit/:id', name: 'ModeleBorealProduit',   titre: 'Fiche produit',          desc: 'Fiche produit du modèle de boutique Atelier Boréal : variantes, quantité, ajout au panier persistant.' },
  { path: BASE + '/panier',      name: 'ModeleBorealPanier',    titre: 'Panier',                 desc: 'Panier persistant du modèle de boutique Atelier Boréal : quantités, suppression, sous-total et livraison.' },
  { path: BASE + '/commande',    name: 'ModeleBorealCommande',  titre: 'Commande simulée',       desc: 'Tunnel de commande SIMULÉ du modèle de boutique Atelier Boréal : coordonnées, livraison, récapitulatif. Aucun paiement, aucune donnée transmise.' },
]

// ⛔ UNE APOSTROPHE DANS UN TITRE OU UNE DESCRIPTION CASSERAIT LA CHAÎNE JS
//    QU'ON GÉNÈRE : le fichier routeur est écrit en guillemets SIMPLES, donc un
//    `'` dans le texte produit une chaîne invalide. *On vérifie l'ENTRÉE avant
//    de fabriquer la SORTIE.*
//    ⚠️ Et ce contrôle vit ICI, après la déclaration : placé plus haut, il
//    tombait dans la zone morte temporelle de `const` — mesuré, pas supposé.
for (const r of A_AJOUTER) {
  for (const [champ, val] of [['titre', r.titre], ['description', r.desc], ['name', r.name], ['path', r.path]]) {
    if (val.includes("'")) {
      throw new Error(`ASSERTION 0 bis : le champ « ${champ} » de ${r.path} contient une apostrophe — la chaîne JS générée serait invalide`)
    }
  }
}

if (noeudsAvant.some((n) => prop(n, 'path') === BASE + '/catalogue')) {
  throw new Error('ASSERTION 1 : les routes existent DÉJÀ — on ne double pas')
}
const base = noeudsAvant.find((n) => prop(n, 'path') === BASE)
if (!base) throw new Error("ASSERTION 2 : la route de base « " + BASE + " » est introuvable")
if (prop(base, 'name') !== 'ModeleBorealBoutique') {
  throw new Error('ASSERTION 3 : la route de base ne porte pas le nom attendu')
}

/* ── 3. LA POSITION EXACTE, DONNÉE PAR L'ANALYSEUR ──────────────────────── */
// `base.end` est l'index JUSTE APRÈS l'accolade fermante de l'objet.
let fin = base.end
while (fin < avant.length && /[,\s]/.test(avant[fin]) === false) fin++
if (avant[fin] !== ',') throw new Error('ASSERTION 4 : aucune virgule après la route de base — structure inattendue')
const point = fin + 1                       // juste après la virgule
const contexte = avant.slice(Math.max(0, base.end - 2), point + 3)
console.log('  point d’insertion : caractère ' + point + '  (contexte ' + JSON.stringify(contexte) + ')')

/* ── 4. LE BLOC ──────────────────────────────────────────────────────────── */
const bloc = A_AJOUTER.map((r) => [
  '  // ' + r.titre + ' — une VRAIE adresse, pas un fragment d’ancre.',
  '  // ⭐ « Le garde-fou qui gère qu’une seule route à la fois… tu le dégages. »',
  '  //   (Gaëtan, 22/09/2026) — un panier en `#panier` ne s’indexe pas, ne se',
  '  //   partage pas, ne s’achète pas. Un modèle vendable a des adresses.',
  '  {',
  "    path: '" + r.path + "',",
  "    name: '" + r.name + "',",
  '    component: ModeleBorealBoutique,',
  '    meta: {',
  "      title: '" + r.titre + " — modèle de boutique Atelier Boréal | Génie IT TeK FR',",
  "      description: '" + r.desc + "',",
  '    }',
  '  },',
].join(CRLF)).join(CRLF)

const apres = avant.slice(0, point) + CRLF + bloc + avant.slice(point)

/* ── 5. LES ASSERTIONS SUR LE RÉSULTAT — DANS L'ARBRE, PAS DANS LE TEXTE ── */
let noeudsApres
try {
  noeudsApres = routesNoeuds(apres)
} catch (e) {
  throw new Error('ASSERTION 5 : LE FICHIER NE SE PARSE PLUS — rien n’a été écrit.\n         ' + e.message)
}
if (noeudsApres.length !== noeudsAvant.length + A_AJOUTER.length) {
  throw new Error(`ASSERTION 6 : ${noeudsAvant.length} routes avant, ${noeudsApres.length} après — attendu ${noeudsAvant.length + A_AJOUTER.length}`)
}
for (const r of A_AJOUTER) {
  const trouves = noeudsApres.filter((n) => prop(n, 'path') === r.path)
  if (trouves.length !== 1) throw new Error(`ASSERTION 7 : « ${r.path} » trouvée ${trouves.length} fois dans l'ARBRE, attendu 1`)
  if (prop(trouves[0], 'name') !== r.name) throw new Error(`ASSERTION 8 : ${r.path} ne porte pas le nom ${r.name}`)
  if (prop(trouves[0], 'component') !== 'ModeleBorealBoutique') {
    throw new Error(`ASSERTION 9 : ${r.path} ne monte pas ModeleBorealBoutique`)
  }
}
if ((apres.match(/\r\n/g) || []).length < (avant.match(/\r\n/g) || []).length) {
  throw new Error('ASSERTION 10 : des CRLF ont disparu')
}
if ((apres.match(/(?<!\r)\n/g) || []).length !== 0) {
  throw new Error('ASSERTION 11 : des LF se sont glissés dans un fichier CRLF')
}

writeFileSync(F, apres, 'utf8')
const b = readFileSync(F)
console.log('  ECRIT.')
console.log('  octets  : ' + b.length + '   (avant ' + Buffer.byteLength(avant) + ')')
console.log('  routes  : ' + noeudsAvant.length + ' -> ' + noeudsApres.length + '   (comptées DANS L\'ARBRE)')
console.log('  le fichier SE PARSE : oui')
console.log('  les cinq marches :')
for (const p of [BASE, ...A_AJOUTER.map((r) => r.path)]) {
  const n = noeudsApres.find((x) => prop(x, 'path') === p)
  console.log('      ' + p + '   ->  ' + prop(n, 'name'))
}
console.log('  premiers octets : ' + [...b.slice(0, 3)].join(' ') + (b[0] === 0xEF ? '  ** BOM **' : '  (pas de BOM)'))
