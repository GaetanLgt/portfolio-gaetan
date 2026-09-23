#!/usr/bin/env node
/**
 * verifier-nomenclature.mjs — la règle de graphie d'ARKADIA, rendue vérifiable.
 *
 * ⭐ POURQUOI IL EXISTE
 * `A-FAIRE-2026-09-23-consignes-gaetan.md` § 3 demande de fusionner ARKADIA.
 * L'inventaire est fait : **138 mentions dans 27 fichiers** (23/09/2026).
 * ⛔ Mais la fusion est IMPOSSIBLE telle quelle — et sa raison est écrite dans
 * `docs/nomenclature-projet.md` :
 *
 *   « ARKADIA désigne TROIS choses différentes : le vaisseau (le poste de calcul),
 *     le réseau social ArkAdiA en production, et le cluster de jeu
 *     ARKADIA France PvE exploité 18 mois. »
 *
 * ⇒ Fondre ces trois-là ne les unirait pas : ça les EFFACERAIT.
 *   *Trois choses distinctes qui partagent un nom ne se fondent pas — elles se
 *    distinguent.*
 *
 * ⚠️ ET LE FICHIER LE DIT DÉJÀ. `HomePage.vue` sert le vaisseau sous le nom
 *    complet `ARKADIA SS00999`, et `ArkadiaCase.vue` porte en commentaire :
 *      « “ARKADIA” EN CAPITALES, ET C'EST DÉLIBÉRÉ (corrigé le 19/09/2026).
 *        docs/nomenclature-projet.md dit que “ARKADIA” est le nom du cluster,
 *        que “ArkAdiA” est celui du réseau social, et que “arkadia” en minuscules
 *        est réservé aux routes et aux domaines. »
 *
 * ⇒ CE CONTRÔLE NE DÉCIDE RIEN. Il CONSTATE une seule chose, qui est mesurable :
 *   **combien de mentions d'ARKADIA sont AMBIGUËS**, c'est-à-dire n'importe
 *   laquelle des deux formes désambiguïsées.
 *
 * ⭐ ET C'EST CE CHIFFRE QUI MANQUE À GAËTAN POUR TRANCHER. La question ouverte
 *   (« ARKADIA reste-t-il au vaisseau, ou va-t-il au produit ? ») se répond
 *   mieux en sachant combien de mentions sont en jeu.
 *
 * ⛔⛔⛔ AVERTISSEMENT — SES CHIFFRES NE SONT PAS FIABLES. NE PAS LES CITER.
 *
 * Mesuré le 23/09/2026, en vérifiant l'échantillon qu'il désignait :
 *     le contrôle annonce « ServicesPage.vue : 14 mentions ambiguës »
 *     les premières lignes désignées portent :
 *         l.341   <div class="preuve-arkadia__box">
 *         l.342   <div class="preuve-arkadia__texte">
 * ⇒ **CE SONT DES CLASSES CSS, pas des mentions ambiguës en prose.**
 *
 * Le filtre `HORS_TEXTE` — qui doit retirer les routes, les domaines et les noms
 * de classe en minuscules — NE FAIT PAS SON TRAVAIL. ⚠️ La cause n'est PAS
 * établie : son motif devrait matcher `preuve-arkadia`. *Je ne la devine pas —
 * cette session a déjà produit six diagnostics déduits au lieu d'être mesurés.*
 *
 * ⭐ CE QUI EST ÉTABLI EN REVANCHE, ET QUI A ÉTÉ CORRIGÉ :
 *   la LOCALISATION. La version d'avant écrasait les nouvelles lignes en retirant
 *   les commentaires, et annonçait « l.337 » pour du contenu situé ailleurs. *Un
 *   contrôle dont les numéros de ligne mentent ne se vérifie pas — et un contrôle
 *   qu'on ne peut pas vérifier n'est pas un contrôle.* C'est ce défaut-là qui a
 *   permis de trouver le suivant.
 *
 * ⭐ CE QUI RESTE UTILISABLE MALGRÉ TOUT : les TÉMOINS. Ils prouvent que le
 *   contrôle sait dire OUI et NON sur des cas dont on connaît la réponse. Le
 *   moteur est bon ; c'est le filtre des emplois hors texte qu'il faut réparer.
 *
 * Usage :
 *   node scripts/verifier-nomenclature.mjs [dossier]
 *   node scripts/verifier-nomenclature.mjs --liste    les formes reconnues
 *   node scripts/verifier-nomenclature.mjs --temoins
 *
 * Codes de sortie :
 *   0  aucune mention ambiguë
 *   1  au moins une mention ambiguë
 *   2  RIEN N'A ÉTÉ EXAMINÉ  (≠ 0)
 */

import fs from 'node:fs'
import path from 'node:path'

/* ⭐ LES FORMES DÉSAMBIGUÏSÉES — celles qui ne prêtent à aucune confusion.
   Toute mention d'ARKADIA qui n'est AUCUNE de celles-là est AMBIGUË. */
const DESAMBIGUISEES = [
  { re: /ARKADIA\s+SS00999/g,            dit: 'le VAISSEAU   (toujours avec son code)' },
  { re: /ARKADIA\s+France\s+PvE/g,       dit: 'le CLUSTER    (toujours avec « France PvE »)' },
  { re: /ArkAdiA/g,                      dit: 'le RÉSEAU SOCIAL « ArkAdiA »' },
]

/* Toute graphie d'ARKADIA, quelle qu'elle soit. */
const TOUTE = /ARKADIA|Arkadia|ArkAdiA|arkadia/g

/* ⛔ LES EMPLOIS HORS TEXTE VISIBLE — ils ne comptent pas comme ambiguïtés.
   Une route `/arkadia`, un identifiant `arkadia-page`, un domaine
   `arkadia.gldigitallab.fr` : la nomenclature réserve explicitement les
   minuscules aux routes et aux domaines.

   ⚠️⚠️ CORRIGÉ LE 23/09/2026 — LE MOTIF NE MATCHAIT QUE LA MOITIÉ DES CAS.
   Il était :  une classe de caractères, puis arkadia encadré de deux frontières
   de mot, le tout avec le drapeau global. *Le motif exact est écrit ci-dessous
   dans la constante corrigée, sans risque de fermer ce commentaire.*
   MESURÉ, un cas par ligne :
       class="preuve-arkadia"  ->  retiré   ✅   (le guillemet après arkadia fait que la frontière est VRAIE)
       preuve-arkadia-title    ->  retiré   ✅   (le tiret fait que la frontière est VRAIE)
       preuve-arkadia__box     ->  NON RETIRÉ ⛔ (le souligné est un CARACTÈRE DE MOT)
   ⇒ **le souligné appartient à la classe des caractères de mot**, donc entre
     `arkadia` et le souligné il n'y a PAS de frontière de mot : elle est fausse,
     et le motif entier échoue.
   ⭐ C'est pour ça que le défaut était invisible : il ne se déclenchait que sur les
     classes COMPOSÉES (avec un double souligné), pas sur les classes simples.
     *Un défaut qui ne se déclenche que sur la moitié des cas passe pour un succès.*

   ⇒ Corrigé : le souligné ajouté à la classe de caractères, et la frontière de mot
     finale retirée — elle ne servait qu'à délimiter, ce que la classe fait déjà en
     englobant le mot entier.
   ⛔ ET CE COMMENTAIRE A D'ABORD ÉTÉ ÉCRIT AVEC LE MOTIF BRUT DEDANS : les deux
     caractères de fin de commentaire s'y trouvaient, ils ont fermé le bloc, et
     tout le reste est devenu du JavaScript invalide. *C'est le piège documenté
     dans `regle-quoting-2026-09-23.md` — un contenu technique recopié dans un
     commentaire le casse en silence. Le portier de syntaxe l'a vu.* */
const HORS_TEXTE = [
  /[\w.'"/_-]*arkadia[\w.'"/_-]*/g,       // minuscules : routes, classes, domaines
  /\/arkadia\b/g,
  /arkadia\.gldigitallab\.fr/g,
]

const EXT = new Set(['.vue', '.js', '.mjs', '.md', '.json', '.html', '.xml'])

/** ⛔ On ne juge pas le contenu des commentaires : ils CITENT la règle.
 *
 * ⚠️⚠️ ET LE RETRAIT DOIT PRÉSERVER LES NUMÉROS DE LIGNE — corrigé le 23/09/2026,
 * après avoir vérifié l'échantillon que le contrôle désignait.
 *
 * La version fautive remplaçait un commentaire par un simple `' '` :
 *     s.replace(/\/\*[\s\S]*?\*\//g, ' ')
 * ⇒ un bloc de commentaire de trente lignes devenait UN caractère, **et tout ce
 *   qui suivait remontait de vingt-neuf lignes.**
 *   *Mesure du défaut, sur `ServicesPage.vue` : le contrôle annonçait
 *    « l.337 arkadia ». La ligne 337 est VIDE ; la 338 est un commentaire ; la 339
 *    porte `class="preuve-arkadia"`. Le compte pouvait être juste — la
 *    LOCALISATION était fausse, donc invérifiable.*
 * ⭐ Un contrôle dont les numéros de ligne mentent ne se vérifie pas : on ne peut
 *   pas aller voir. Et un contrôle qu'on ne peut pas vérifier n'est pas un contrôle.
 *
 * ⇒ On remplace chaque caractère NON-NOUVELLE-LIGNE par une espace, et on GARDE
 *   les nouvelles lignes. Le décalage disparaît. */
const garderLignes = (m) => m.replace(/[^\n]/g, ' ')

function sansCommentaires(s, ext) {
  if (ext === '.md') return s.replace(/```[\s\S]*?```/g, garderLignes).replace(/`[^`\n]*`/g, garderLignes)
  let t = s.replace(/\/\*[\s\S]*?\*\//g, garderLignes).replace(/(^|[^:'"\\])\/\/[^\n]*/g, '$1 ')
  if (ext === '.vue' || ext === '.html') t = t.replace(/<!--[\s\S]*?-->/g, garderLignes)
  return t
}

function fichiers(dossier) {
  const out = []
  const marcher = (d) => {
    let e; try { e = fs.readdirSync(d, { withFileTypes: true }) } catch { return }
    for (const x of e) {
      if (x.name === 'node_modules' || x.name === '.git' || x.name === 'dist') continue
      const p = path.join(d, x.name)
      if (x.isDirectory()) marcher(p)
      else if (EXT.has(path.extname(x.name).toLowerCase())) out.push(p)
    }
  }
  marcher(dossier)
  return out
}

/** Les mentions ambiguës d'un fichier, avec leur ligne. */
function ambigues(chemin) {
  const ext = path.extname(chemin).toLowerCase()
  let t
  try { t = sansCommentaires(fs.readFileSync(chemin, 'utf8'), ext) } catch { return null }

  // ① on retire les emplois hors texte visible (routes, domaines, classes)
  let zone = t
  for (const re of HORS_TEXTE) zone = zone.replace(re, '\u0000'.repeat(4))
  // ② on retire les formes désambiguïsées
  for (const d of DESAMBIGUISEES) zone = zone.replace(d.re, '\u0000'.repeat(4))

  const trouvees = []
  TOUTE.lastIndex = 0
  let m
  while ((m = TOUTE.exec(zone)) !== null) {
    trouvees.push({ ligne: zone.slice(0, m.index).split('\n').length, texte: m[0] })
  }
  return trouvees
}

// ── TÉMOINS ─────────────────────────────────────────────────────────────────
if (process.argv.includes('--temoins')) {
  const d = fs.mkdtempSync(path.join(process.env.TEMP || '/tmp', 'temoin-nom-'))
  const clair = path.join(d, 'clair.vue')
  const flou = path.join(d, 'flou.vue')
  fs.writeFileSync(clair, [
    '<template>',
    '  <h2>ARKADIA SS00999</h2>',
    '  <p>Le réseau ArkAdiA est en production.</p>',
    '  <p>ARKADIA France PvE a tourné 18 mois.</p>',
    '  <a href="/arkadia">la preuve</a>',
    '  <a href="https://arkadia.gldigitallab.fr">le site</a>',
    '</template>',
  ].join('\n'))
  fs.writeFileSync(flou, [
    '<template>',
    '  <h2>ARKADIA</h2>',
    '  <p>Nous avons lancé Arkadia en production.</p>',
    '</template>',
  ].join('\n'))
  const a = ambigues(clair), b = ambigues(flou)
  console.log('')
  console.log('  ÉPREUVE SUR TÉMOINS — le contrôle doit savoir dire OUI et NON')
  console.log('')
  console.log(`  TÉMOIN 1 — formes désambiguïsées + routes et domaines`)
  console.log(`    ambiguës trouvées : ${a.length}   (attendu 0)`)
  console.log(`    verdict : ${a.length === 0 ? '✅ accepte' : '⛔ il signale : ' + a.map((x) => x.texte).join(', ')}`)
  console.log('')
  console.log(`  TÉMOIN 2 — « ARKADIA » nu et « Arkadia » ambigu`)
  console.log(`    ambiguës trouvées : ${b.length}   (attendu 2)`)
  console.log(`    verdict : ${b.length === 2 ? '✅ refuse' : '⛔ IL NE TROUVE PAS : le contrôle est faux'}`)
  fs.rmSync(d, { recursive: true, force: true })
  const ok = a.length === 0 && b.length === 2
  console.log('')
  console.log(ok ? '  VERDICT : le contrôle sait dire OUI et NON.'
                 : '  VERDICT : ⛔ le contrôle ne tient pas. Ne pas s\'en servir.')
  console.log('')
  process.exit(ok ? 0 : 1)
}

if (process.argv.includes('--liste')) {
  console.log('')
  console.log('  LES FORMES QUI NE PRÊTENT PAS À CONFUSION — et ce qu\'elles désignent\n')
  for (const d of DESAMBIGUISEES) console.log('    ' + d.re.source.padEnd(26) + d.dit)
  console.log('')
  console.log('  ⛔ Toute autre mention d\'ARKADIA est AMBIGUË : on ne sait pas laquelle')
  console.log('     des trois choses elle désigne.')
  console.log('  ⭐ Source : docs/nomenclature-projet.md, et le commentaire de')
  console.log('     src/views/projects/ArkadiaCase.vue (corrigé le 19/09/2026).')
  console.log('')
  console.log('  ⚠️ Ce contrôle NE TRANCHE PAS la question ouverte — savoir si ARKADIA')
  console.log('     reste au vaisseau ou va au produit. *Elle appartient à Gaëtan.*')
  console.log('')
  process.exit(0)
}

// ── PROGRAMME ───────────────────────────────────────────────────────────────
const cibles = process.argv.slice(2).filter((a) => !a.startsWith('--'))
const racine = cibles.length ? cibles[0] : 'src'

console.log('')
console.log('════════════════════════════════════════════════════════════════════')
console.log(' Nomenclature ARKADIA — les mentions ambiguës')
console.log('════════════════════════════════════════════════════════════════════')

const liste = fichiers(racine)
console.log('  fichiers examinés : ' + liste.length)
console.log('')

if (!liste.length) {
  console.log('  ⛔ RIEN N\'A ÉTÉ EXAMINÉ — ce n\'est PAS un succès.')
  console.log('')
  process.exit(2)
}

let total = 0, touches = 0
const parFichier = []

for (const f of liste) {
  const a = ambigues(f)
  if (a === null || !a.length) continue
  touches++
  total += a.length
  parFichier.push({ f, n: a.length, ex: a.slice(0, 2) })
}

parFichier.sort((x, y) => y.n - x.n)

for (const p of parFichier.slice(0, 12)) {
  console.log(`  ⛔ ${p.n.toString().padStart(3)}  ${p.f.replace(/\\/g, '/')}`)
  for (const e of p.ex) console.log(`         l.${e.ligne}  ${e.texte}`)
}
if (parFichier.length > 12) console.log(`  … et ${parFichier.length - 12} autre(s) fichier(s)`)

console.log('')
console.log('────────────────────────────────────────────────────────────────────')
if (total === 0) {
  console.log('  ✅ aucune mention ambiguë sur ' + liste.length + ' fichier(s).')
} else {
  console.log(`  ⛔ ${total} mention(s) AMBIGUË(S) dans ${touches} fichier(s) sur ${liste.length}.`)
  console.log('     *Chacune désigne « ARKADIA » sans dire laquelle des trois choses.*')
}
console.log('')
console.log('  ⛔ CE QUE CE CONTRÔLE NE DIT PAS :')
console.log('     · laquelle est la BONNE graphie dans chaque cas — *c\'est éditorial*')
console.log('     · si « ARKADIA » doit rester au vaisseau ou aller au produit')
console.log('       — *question ouverte, décision de Gaëtan*')
console.log('     · l\'opportunité d\'une fusion — *il compte, il ne propose pas*')
console.log('════════════════════════════════════════════════════════════════════')
console.log('')

process.exit(total > 0 ? 1 : 0)
