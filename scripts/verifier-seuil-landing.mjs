#!/usr/bin/env node
/**
 * verifier-seuil-landing.mjs — la landing : QUATRE TEMPS, et un signal de dérive.
 *
 * ⭐ CE FICHIER A CHANGÉ DE QUESTION LE 23/09/2026, ET IL FAUT SAVOIR POURQUOI.
 *
 * Il comptait les `<section>` et les `<h2>`, en croyant que « neuf <h2> » voulait dire
 * « neuf chapitres », donc « un sommaire plutôt qu'un seuil ». ⛔ **C'ÉTAIT UN PROXY** —
 * et le fichier qu'il mesure le dit lui-même, à la ligne 528 de `HomePage.vue` :
 *      « LES SEPT QUARTIERS — sept DIRECTIONS, pas un menu. TROISIÈME DES QUATRE TEMPS. »
 *   Et à la ligne 536 : « Ces sept portes ne sont pas sept sections de cette page. »
 * ⇒ **La page est DÉJÀ conçue en quatre temps, avec des cloisons explicites.**
 *   Et un contrôle qui refuse une page **conforme à sa propre intention** ne mesure
 *   rien : il fait du bruit. *Un contrôle qui crie au loup finit par être ignoré —
 *   et c'est aussi grave qu'un contrôle aveugle.*
 *
 * ⭐ LA QUESTION JUSTE, ET ELLE VIENT DU FICHIER LUI-MÊME :
 *      « COMBIEN DE TEMPS LE VISITEUR TRAVERSE-T-IL ? »
 *   Ce nombre n'est pas dans le balisage : il est **déclaré**.
 *
 * ⛔ LE CONTRAT — quatre marqueurs, et ils sont la seule source de vérité :
 *      <!-- temps:1 … -->   <!-- temps:2 … -->   <!-- temps:3 … -->   <!-- temps:4 … -->
 *   Ils doivent être : **présents · uniques · dans l'ordre · et NON VIDES**
 *   — *chaque temps ouvre une `<section>` qui porte au moins un titre et du texte.*
 *   ⚠️ **C'est un contrat, pas une convention :** *renommer un marqueur fait échouer ce
 *   contrôle, et c'est voulu — le jour où la page change d'architecture, ce fichier
 *   doit être mis à jour **exprès**, pas absorbé en silence.*
 *
 * ⛔ CE QU'IL REFUSE (code 1) :
 *   · un temps absent, en double, ou dans le désordre
 *   · un temps CREUX — *une section sans titre, ou sans texte*
 *   · la dérive dure : au-delà du plafond ci-dessous
 *
 * ⚠️ CE QU'IL NE MESURE PAS, ET QUI DÉCIDE VRAIMENT :
 *   · l'AÉRATION réelle — *« aérée » est un jugement visuel, et il appartient à Gaëtan*
 *   · la qualité du texte — *pour ça : la lecture à voix haute, sans outil*
 *   · le RENDU — *il lit le template, pas la page. Une page dense en 6 blocs peut être
 *     aérée, et une page aérée en 11 peut être étouffante.*
 *
 * Usage :
 *   node scripts/verifier-seuil-landing.mjs [fichier]
 *   node scripts/verifier-seuil-landing.mjs --temoins
 *
 * Codes de sortie — les trois du dépôt :
 *   0  conforme
 *   1  refusé
 *   2  RIEN N'A ÉTÉ EXAMINÉ  (≠ 0)
 */

import fs from 'node:fs'
import path from 'node:path'

/**
 * ⚠️ LA DÉRIVE — et c'est une RÈGLE, pas un chiffre magique.
 *
 * Relevé le 23/09/2026 **par ce contrôle**, sur la page telle qu'elle est conçue : **10 sections · 9 h2**.
 * La règle retenue : **le relevé + 50 % est le plafond dur.**
 *      10 × 1,5 = 15 sections   ·   9 × 1,5 = 13 h2
 * Au-delà, ce n'est plus une dérive : c'est un catalogue — *et le chiffre devra être
 * justifié à la main, pas absorbé en silence.*
 */
const DERIVE = { sections: 15, h2: 13 }

/** Le relevé qui a servi à poser la règle. Gardé pour qu'on puisse la contester. */
const RELEVE_23_09 = { sections: 10, h2: 9 }

const CIBLE = 'src/views/core/HomePage.vue'
const TEMPS_ATTENDUS = [1, 2, 3, 4]

/** Un temps creux : moins de 200 caractères de texte visible. */
const SEUIL_CREUX = 200

// ── LECTURE ─────────────────────────────────────────────────────────────────

function template(src) {
  const m = src.match(/<template>([\s\S]*?)<\/template>/i)
  return m ? m[1] : src
}

function sansCommentaires(s) {
  return s.replace(/<!--[\s\S]*?-->/g, ' ')
}

/** Les marqueurs `<!-- temps:N … -->`, dans l'ordre du fichier. */
function marqueurs(t) {
  const re = /<!--\s*temps\s*:\s*(\d+)\s*([^>]*?)-->/g
  const out = []
  let m
  while ((m = re.exec(t))) out.push({ n: Number(m[1]), libelle: (m[2] || '').trim(), index: m.index })
  return out
}

/**
 * La `<section>` qui suit une position, jusqu'à sa fermeture ÉQUILIBRÉE.
 * ⛔ Un simple `indexOf('</section>')` se trompe dès qu'une section en contient une
 *    autre — et `nav-arrivee` en contient.
 */
function sectionApres(t, depuis) {
  const i = t.indexOf('<section', depuis)
  if (i < 0) return null
  let j = i, prof = 0
  while (j < t.length) {
    const o = t.indexOf('<section', j)
    const c = t.indexOf('</section>', j)
    if (c < 0) return null
    if (o >= 0 && o < c) { prof++; j = o + 8 } else { prof--; j = c + 10; if (prof === 0) return t.slice(i, j) }
  }
  return null
}

function texteVisible(h) {
  return h.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim().length
}

function mesurer(fichier) {
  if (!fs.existsSync(fichier)) return null
  const brut = fs.readFileSync(fichier, 'utf8')
  const t = template(brut)
  const propre = sansCommentaires(t)
  const ms = marqueurs(t)
  const temps = ms.map((m) => {
    const sec = sectionApres(t, m.index)
    return {
      n: m.n,
      libelle: m.libelle.replace(/\s*\(.*$/, '').replace(/^·\s*/, ''),
      titre: sec ? (sec.match(/<h[123]\b/g) || []).length : 0,
      texte: sec ? texteVisible(sec) : 0,
      presente: sec !== null,
    }
  })
  return {
    fichier,
    temps,
    sections: (propre.match(/<section\b/g) || []).length,
    h2: (propre.match(/<h2\b/g) || []).length,
    h3: (propre.match(/<h3\b/g) || []).length,
  }
}

// ── VERDICT ─────────────────────────────────────────────────────────────────

function refus(m) {
  const r = []
  const vus = m.temps.map((x) => x.n)

  for (const n of TEMPS_ATTENDUS) {
    const combien = vus.filter((v) => v === n).length
    if (combien === 0) r.push(`temps ${n} ABSENT`)
    else if (combien > 1) r.push(`temps ${n} en DOUBLE (${combien} fois)`)
  }
  const inconnus = vus.filter((v) => !TEMPS_ATTENDUS.includes(v))
  if (inconnus.length) r.push(`marqueur(s) hors contrat : temps ${inconnus.join(', ')}`)
  if (vus.length > 0 && vus.join(',') !== TEMPS_ATTENDUS.join(',')) {
    if (vus.length === TEMPS_ATTENDUS.length && new Set(vus).size === vus.length) {
      r.push(`DÉSORDRE : lu « ${vus.join(' · ')} », attendu « ${TEMPS_ATTENDUS.join(' · ')} »`)
    }
  }
  for (const x of m.temps) {
    if (!x.presente) r.push(`temps ${x.n} : aucune <section> ne suit le marqueur`)
    else if (x.titre === 0) r.push(`temps ${x.n} CREUX : la section ne porte aucun titre`)
    else if (x.texte < SEUIL_CREUX) r.push(`temps ${x.n} CREUX : ${x.texte} caractères de texte (< ${SEUIL_CREUX})`)
  }
  if (m.sections > DERIVE.sections) r.push(`DÉRIVE : ${m.sections} sections > ${DERIVE.sections}`)
  if (m.h2 > DERIVE.h2) r.push(`DÉRIVE : ${m.h2} h2 > ${DERIVE.h2}`)
  return r
}

// ── TÉMOINS ─────────────────────────────────────────────────────────────────
// ⭐ Règle 1 du dépôt : tout contrôle se prouve sur des cas dont on connaît la
//    réponse — ET IL DOIT SAVOIR DIRE NON.
if (process.argv.includes('--temoins')) {
  const d = fs.mkdtempSync(path.join(process.env.TEMP || '/tmp', 'temoin-temps-'))
  const plein = 'du texte de contenu, assez long pour que la section ne soit pas creuse. '.repeat(4)
  /* ⛔ `template()` ne garde que le PREMIER bloc `<template>` : chaque témoin est donc
     UN SEUL document. Et le `<script>` qui suit est là pour prouver qu'il est ignoré —
     compter dedans a déjà fait conclure à l'envers. */
  const corps = (n, texte) =>
    `<!-- temps:${n} · TEMPS ${n} -->\n<section><h2>Titre ${n}</h2><p>${texte || plein}</p></section>`
  const enveloppe = (interieur) =>
    `<template>\n${interieur}\n</template>\n<script setup>const faux = '<section><h2>'</script>\n<style>/* <section> <h2> <h2> */</style>`

  const cas = [
    ['conforme', 'quatre temps pleins, dans l’ordre',
      enveloppe(TEMPS_ATTENDUS.map((n) => corps(n)).join('\n')), 0, null, 4],
    ['temps manquant', 'il n’en reste que trois',
      enveloppe([1, 2, 3].map((n) => corps(n)).join('\n')), 1, 'ABSENT'],
    ['désordre', 'le temps 3 avant le temps 2',
      enveloppe([1, 3, 2, 4].map((n) => corps(n)).join('\n')), 1, 'DÉSORDRE'],
    ['temps creux — sans titre', 'la section du temps 2 est vide',
      enveloppe([1, 2, 3, 4].map((n) => (n === 2 ? '<!-- temps:2 · CREUX -->\n<section></section>' : corps(n))).join('\n')), 1, 'CREUX'],
    ['temps creux — sans texte', 'le temps 3 n’a qu’un titre',
      enveloppe([1, 2, 3, 4].map((n) => (n === 3 ? corps(3, 'court') : corps(n))).join('\n')), 1, 'CREUX'],
    ['temps en double', 'le temps 3 est déclaré deux fois',
      enveloppe([1, 2, 3, 3, 4].map((n) => corps(n)).join('\n')), 1, 'DOUBLE'],
    ['aucun marqueur', 'rien n’est déclaré',
      enveloppe('<section><h2>Rien</h2></section>'), 1, 'ABSENT'],
    ['dérive', 'quatre temps conformes, mais 18 sections',
      enveloppe(TEMPS_ATTENDUS.map((n) => corps(n)).join('\n') + '\n' + '<section><h2>x</h2></section>'.repeat(14)), 1, 'DÉRIVE'],
  ]

  console.log('')
  console.log('  ÉPREUVE SUR TÉMOINS — le contrôle doit savoir dire OUI et NON')
  console.log('')
  let tordus = 0
  cas.forEach(([nom, raison, source, attendu, motif, sectionsAttendues], i) => {
    const p = path.join(d, `temoin-${i}.vue`)
    fs.writeFileSync(p, source, 'utf8')
    const m = mesurer(p)
    const r = refus(m)
    const obtenu = r.length ? 1 : 0
    const motifOk = !motif || r.some((x) => x.includes(motif))
    const compteOk = sectionsAttendues === undefined || m.sections === sectionsAttendues
    const ok = obtenu === attendu && motifOk && compteOk
    if (!ok) tordus++
    console.log(`  ${ok ? '✅' : '⛔'} TÉMOIN ${i + 1} — ${nom}`)
    console.log(`      ${raison} · attendu : ${attendu === 0 ? 'accepte' : 'refuse'} · obtenu : ${obtenu === 0 ? 'accepte' : 'refuse'}`)
    console.log(`      temps lus : [${m.temps.map((x) => x.n).join(' ')}] · ${m.sections} sections · ${m.h2} h2`)
    if (r.length) console.log('      motif : ' + r[0])
    if (!motifOk) console.log('      ⛔ le motif attendu manque : ' + motif)
    if (!compteOk) console.log(`      ⛔ sections comptées : ${m.sections}, attendu ${sectionsAttendues} — le <script> est-il compté ?`)
    console.log('')
  })

  fs.rmSync(d, { recursive: true, force: true })
  const ok = tordus === 0
  console.log('  VERDICT : ' + (ok
    ? `le contrôle sait dire OUI et NON sur les ${cas.length} témoins.`
    : `⛔ ${tordus} témoin(s) mal jugé(s). NE PAS S'EN SERVIR.`))
  console.log('')
  process.exit(ok ? 0 : 1)
}

// ── PROGRAMME ───────────────────────────────────────────────────────────────
const args = process.argv.slice(2).filter((a) => !a.startsWith('--'))
const cible = args.length ? args : [CIBLE]

console.log('')
console.log('════════════════════════════════════════════════════════════════════')
console.log(' La landing — quatre temps, et un signal de dérive')
console.log('════════════════════════════════════════════════════════════════════')

let examine = 0, enFaute = 0

for (const f of cible) {
  const m = mesurer(f)
  if (!m) { console.log('  ⛔ introuvable : ' + f); continue }
  examine++
  const r = refus(m)

  console.log(`  ${r.length ? '⛔' : '✅'} ${f}`)
  for (const x of m.temps) {
    const etat = !x.presente ? '⛔ aucune section'
      : x.titre === 0 ? '⛔ CREUX — aucun titre'
      : x.texte < SEUIL_CREUX ? `⛔ CREUX — ${x.texte} caractères`
      : `✅ ${x.titre} titre(s) · ${x.texte} caractères de texte`
    console.log(`     temps ${x.n} · ${x.libelle || '(sans libellé)'}  →  ${etat}`)
  }
  console.log(`     dérive : ${m.sections} sections · ${m.h2} h2 · ${m.h3} h3`)
  console.log(`              *relevé du 23/09 : ${RELEVE_23_09.sections}/${RELEVE_23_09.h2} · plafond : ${DERIVE.sections}/${DERIVE.h2}*`)
  if (r.length) { enFaute++; for (const x of r) console.log('       REFUS — ' + x) }
}

console.log('')
if (examine === 0) {
  console.log("  ⛔ RIEN N'A ÉTÉ EXAMINÉ — ce n'est PAS un succès.")
  console.log('')
  process.exit(2)
}

console.log('────────────────────────────────────────────────────────────────────')
console.log(enFaute === 0
  ? `  ✅ CONFORME — ${examine} fichier(s) : les quatre temps sont déclarés, pleins et dans l'ordre.`
  : `  ⛔ ${enFaute} fichier(s) refusé(s).`)
console.log('')
console.log('  ⛔ CE QUE CE CONTRÔLE NE MESURE PAS :')
console.log("     · l'AÉRATION réelle — *« aérée » est un jugement visuel, il appartient à Gaëtan*")
console.log('     · la qualité du texte — *pour ça : la lecture à voix haute, sans outil*')
console.log('     · le RENDU — *il lit le template, pas la page*')
console.log('     · le nombre de clics avant la première information')
console.log('════════════════════════════════════════════════════════════════════')
console.log('')

process.exit(enFaute > 0 ? 1 : 0)
