#!/usr/bin/env node
/* ============================================================================
 * fusionner-verrous-ci.mjs — GL Digital Lab — 22/09/2026
 *
 * FUSION DEMANDÉE PAR GAËTAN :
 *   « Contradiction du workflow. Bah t'analyses, tu merges, et puis tu fais en
 *     sorte que ça se fasse normalement. »
 *
 * ⛔ LE DÉFAUT : le workflow portait DEUX listes de verrous.
 *   · quatre étapes ÉCRITES À LA MAIN (« Requêtes », « Poids », « Topographie »,
 *     « Contact »), qui nomment les pannes dans l'interface de la CI ;
 *   · `scripts/auditer-tout.mjs`, qui ÉNUMÈRE `scripts/` et les exécute TOUS.
 *   ⭐ **Deux listes divergent toujours** — et elles avaient déjà divergé : un
 *     commentaire du 19/09 déclarait deux verrous « volontairement dehors »
 *     alors que le passage unique les exécutait depuis la veille.
 *
 * ⇒ LA FUSION : on garde UNE liste, celle qui est ÉNUMÉRÉE (parce qu'un verrou
 *   déposé dans `scripts/` est pris en compte sans qu'on touche au workflow),
 *   et on lui rend ce que les étapes nommées apportaient — `auditer-tout.mjs`
 *   écrit désormais un TABLEAU DES 10 VERROUS dans `GITHUB_STEP_SUMMARY`.
 *
 * ⛔ ET CE SCRIPT PORTE SES ASSERTIONS, y compris la leçon du 22/09 :
 *   **on ne compte pas des chaînes, on PARSE.** Le YAML est relu par un
 *   analyseur avant et après l'écriture.
 * ========================================================================== */

import { readFileSync, writeFileSync } from 'node:fs'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
let YAML
try {
  YAML = require('C:/Users/neosp/AppData/Local/Temp/yamlcheck/node_modules/yaml')
} catch {
  throw new Error(
    'L’analyseur YAML est absent.\n' +
    '  node scripts/fusionner-verrous-ci.mjs ne peut pas vérifier ce qu’il écrit.\n' +
    '  Installer hors du dépôt :\n' +
    '    npm install yaml --prefix "$env:TEMP\\yamlcheck" --no-audit --no-fund --no-package-lock'
  )
}

const F = 'C:/IA/portfolio-gaetan/.github/workflows/deploy.yml'
const avant = readFileSync(F, 'utf8')

/* ── 1. L'ÉTAT D'AVANT, MESURÉ ───────────────────────────────────────────── */
function etapes(texte) {
  const doc = YAML.parse(texte)
  const job = doc.jobs.build
  if (!job) throw new Error('aucun job « build » dans le workflow')
  return (job.steps || []).map((s) => s.name || s.uses).filter(Boolean)
}
const etapesAvant = etapes(avant)
console.log('  étapes du job build AVANT : ' + etapesAvant.length)

const A_RETIRER = [
  '🧮 Requêtes du premier chargement',
  '⚖️ Poids du premier chargement, par page',
  '🗺️ Topographie du site',
  '📇 Contact livré au visiteur',
]
for (const n of A_RETIRER) {
  if (!etapesAvant.includes(n)) throw new Error(`ASSERTION 1 : l’étape « ${n} » est introuvable — le workflow a changé`)
}
if (!etapesAvant.includes('🧭 Tous les verrous, un seul passage')) {
  throw new Error('ASSERTION 2 : l’étape du passage unique est introuvable')
}

/* ── 2. LES BORNES — on retire UN SEUL BLOC CONTIGU ──────────────────────── */
const DEBUT = '      - name: 🧮 Requêtes du premier chargement'
const FIN = '      # ⭐ LE POINT DE PASSAGE UNIQUE'
for (const [nom, m] of [['début', DEBUT], ['fin', FIN]]) {
  const n = avant.split(m).length - 1
  if (n !== 1) throw new Error(`ASSERTION 3 : le repère de ${nom} apparaît ${n} fois, attendu 1`)
}
const i = avant.indexOf(DEBUT)
const j = avant.indexOf(FIN)
if (i >= j) throw new Error('ASSERTION 4 : le repère de début est APRÈS celui de fin')

const retire = avant.slice(i, j)
for (const n of A_RETIRER) {
  if (!retire.includes(n)) throw new Error(`ASSERTION 5 : « ${n} » n’est pas dans le bloc retiré`)
}
if (!retire.includes('VOLONTAIREMENT DEHORS')) {
  throw new Error('ASSERTION 6 : le commentaire périmé « VOLONTAIREMENT DEHORS » n’est pas dans le bloc retiré')
}
console.log('  bloc retiré : ' + retire.length + ' caractères, ' + retire.split(/\r?\n/).length + ' lignes')

/* ── 3. LE BLOC QUI LE REMPLACE — LA RÈGLE, ÉCRITE UNE FOIS ─────────────── */
const CRLF = avant.includes('\r\n') ? '\r\n' : '\n'
const NOUVEAU = [
  '      # ⛔ FUSIONNÉ LE 22/09/2026 — IL Y AVAIT DEUX LISTES, IL N’EN RESTE QU’UNE.',
  '      #',
  '      # DÉCISION DE GAËTAN : « t’analyses, tu merges, et puis tu fais en sorte',
  '      # que ça se fasse normalement. »',
  '      #',
  '      # CE QUI A ÉTÉ RETIRÉ, ET POURQUOI. Quatre étapes nommées à la main',
  '      # vivaient ici — « Requêtes », « Poids », « Topographie », « Contact » —',
  '      # et elles exécutaient EXACTEMENT les mêmes verrous que le passage unique',
  '      # ci-dessous. ⭐ **Deux listes pour la même chose divergent toujours** : un',
  '      # commentaire du 19/09 déclarait encore deux verrous « volontairement',
  '      # dehors » alors que le passage unique les exécutait depuis la veille.',
  '      # *Un fichier qui se contredit fait douter de tout ce qu’il contient.*',
  '      #',
  '      # CE QUI EST GARDÉ, ET CE QUI LE REMPLACE. On garde la liste ÉNUMÉRÉE',
  '      # (`auditer-tout.mjs` découvre les verrous en listant `scripts/`) : un',
  '      # verrou déposé dans le dossier est pris en compte SANS toucher à ce',
  '      # fichier, alors qu’une liste écrite à la main devient fausse en silence.',
  '      # ⚠️ MAIS on ne perd pas ce que les étapes nommées apportaient : dans',
  '      # l’onglet Actions, un échec se lisait comme une ÉTAPE ROUGE portant le',
  '      # nom du verrou fautif. `auditer-tout.mjs` écrit donc désormais un',
  '      # **tableau des verrous** dans `GITHUB_STEP_SUMMARY` (durée, code de',
  '      # sortie, état) — visible sur la page du passage, à côté du journal.',
  '      # *Une fusion qui fait perdre une information n’est pas une fusion,*',
  '      # *c’est une suppression.*',
  '      #',
  '      # ⭐ ET LA RÈGLE SUR LES DEUX VERROUS QUI DÉSIGNENT SANS CONDAMNER :',
  '      #   · `verifier-a11y-rendu.mjs` pilote un Chrome sans interface ;',
  '      #   · `verifier-css-sans-balisage.mjs` désigne des classes mortes sans les',
  '      #     supprimer — il demande un arbitrage, il ne le prend pas.',
  '      # Ils TOURNENT (ils mesurent, et leur verdict est publié), et ils sortent',
  '      # en 0 par défaut : **ils désignent au lieu de condamner.** Le jour où',
  '      # l’un doit bloquer un déploiement, son interrupteur est NOMMÉ et visible :',
  '      #     A11Y_BLOQUANT=1  ·  CSS_BLOQUANT=1  ·  MIROIRS_BLOQUANT=1',
  '      # ⛔ Un verrou qui échoue sur une décision qu’il n’a pas le droit de prendre',
  '      # bloque la CI pour rien. *Il rapporte ; on décide.*',
  '',
].join(CRLF)

const apres = avant.slice(0, i) + NOUVEAU + avant.slice(j)

/* ── 4. LES ASSERTIONS SUR LE RÉSULTAT, AVANT D'ÉCRIRE ──────────────────── */
let doc
try {
  doc = YAML.parse(apres)
} catch (e) {
  throw new Error('ASSERTION 7 : LE YAML NE SE PARSE PLUS — rien n’a été écrit.\n         ' + e.message)
}
const etapesApres = etapes(apres)
for (const n of A_RETIRER) {
  if (etapesApres.includes(n)) throw new Error(`ASSERTION 8 : « ${n} » est encore là`)
}
if (etapesApres.filter((n) => n === '🧭 Tous les verrous, un seul passage').length !== 1) {
  throw new Error('ASSERTION 9 : le passage unique n’est pas exactement une fois')
}
if (etapesApres.length !== etapesAvant.length - 4) {
  throw new Error(`ASSERTION 10 : ${etapesAvant.length} étapes avant, ${etapesApres.length} après — attendu ${etapesAvant.length - 4}`)
}
if (apres.includes('VOLONTAIREMENT DEHORS')) {
  throw new Error('ASSERTION 11 : le commentaire périmé est encore dans le fichier')
}
if (!apres.includes('danse.')) { /* ancre inutile */ }
if (apres.split(CRLF).length < 100) throw new Error('ASSERTION 12 : le fichier a perdu sa structure')
if ((apres.match(/(?<!\r)\n/g) || []).length !== 0 && CRLF === '\r\n') {
  throw new Error('ASSERTION 13 : des LF se sont glissés dans un fichier CRLF')
}

writeFileSync(F, apres, 'utf8')
const b = readFileSync(F)
console.log('  ECRIT.')
console.log('  octets          : ' + b.length + '   (avant ' + Buffer.byteLength(avant) + ')')
console.log('  étapes du job build : ' + etapesAvant.length + ' -> ' + etapesApres.length)
console.log('  le YAML SE PARSE : oui')
console.log('  étapes restantes :')
for (const n of etapesApres) console.log('      - ' + n)
console.log('  premiers octets : ' + [...b.slice(0, 3)].join(' ') + (b[0] === 0xEF ? '  ** BOM **' : '  (pas de BOM)'))
