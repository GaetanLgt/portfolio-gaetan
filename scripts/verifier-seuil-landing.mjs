#!/usr/bin/env node
/**
 * verifier-seuil-landing.mjs — « un seuil, pas un catalogue », rendu mesurable.
 *
 * ⭐ POURQUOI IL EXISTE
 * `A-FAIRE-2026-09-23-consignes-gaetan.md` § 1 demande que la page d'accueil soit
 *   « un seul élément monolithique, fait de tous les modules déjà écrits —
 *    PAS UNE PAGE QUI LES LISTE CÔTE À CÔTE ».
 * Une consigne comme celle-là n'est ni vraie ni fausse : elle est **appréciable**.
 * ⛔ Et une consigne qu'on ne peut pas mesurer se discute indéfiniment.
 *
 * ⇒ CE CONTRÔLE LA CHIFFRE. Deux nombres, et une cible :
 *     · les <section>  — les blocs de la page
 *     · les <h2>       — les chapitres que le visiteur traverse
 * Un seuil a peu de titres. Un catalogue en a un par bloc.
 *
 * ⚠️ MESURÉ LE 23/09/2026, AVANT TOUTE MODIFICATION :
 *     11 <section>   et   9 <h2>
 * *Neuf titres de niveau 2 sur une page, c'est neuf chapitres. C'est un sommaire.*
 *
 * ⛔ ET CE QU'IL NE MESURE PAS — à lire avant de s'en servir :
 *   · Il ne dit RIEN de l'aération réelle. *« Aérée » est un jugement visuel, et
 *     il appartient à Gaëtan.* Ce contrôle compte des blocs, pas des respirations.
 *   · Il ne dit rien de la qualité du texte. *Pour ça : `verifier-voix-francaise.mjs`,
 *     et surtout la lecture à voix haute.*
 *   · Il lit le TEMPLATE, pas le rendu. *Une page peut être dense en 6 blocs et
 *     aérée en 11. Les deux mesures ne se remplacent pas.*
 *
 * ⚠️⚠️ AVERTISSEMENT AJOUTÉ LE 23/09/2026, APRÈS AVOIR LU LE FICHIER QU'IL MESURE.
 *
 * ⛔ CE CONTRÔLE MESURE UN PROXY, ET IL FAUT LE SAVOIR AVANT DE S'EN SERVIR.
 *
 * Il compte les <h2> et les <section>. Il a été écrit en croyant que « neuf <h2> »
 * voulait dire « neuf chapitres », donc « un sommaire plutôt qu'un seuil ».
 *
 * ⛔ C'EST FAUX, ET LE FICHIER LE DIT LUI-MÊME — à la ligne 528 de HomePage.vue :
 *      « LES SEPT QUARTIERS — sept DIRECTIONS, pas un menu. TROISIÈME DES QUATRE TEMPS. »
 *    Et à la ligne 541 :
 *      « LE SÉPARATEUR — une frise de runes (…) entre la coque et les quartiers,
 *        comme un bordé qui marque une cloison. »
 *
 * ⇒ **La page est DÉJÀ conçue en quatre temps, avec des cloisons explicites.**
 *   Les neuf <h2> ne sont pas neuf stations : ce sont les titres de ces temps et
 *   de leurs blocs internes.
 *
 * ⭐ LA LEÇON, ET ELLE EST CELLE DU STUDIO ENTIER — « l'instrument répond à une
 *   question voisine de celle qu'on lui pose » :
 *      la question n'est pas « combien de titres ? »
 *      c'est « COMBIEN DE TEMPS LE VISITEUR TRAVERSE-T-IL ? »
 *   Et ce nombre-là n'est PAS dans le balisage : il est dans l'intention, écrite
 *   en commentaire.
 *
 * ⛔ CONSÉQUENCE DIRECTE : une fusion des cinq sections `nav-*` — que ce contrôle
 *   semblait justifier — DÉTRIRAIT une architecture déjà pensée. *Ne pas s'en
 *   servir pour ça.*
 *
 * ⭐ CE QU'IL SERT DONC À FAIRE, ET RIEN DE PLUS : constater une DÉRIVE. Si le
 *   nombre de <h2> monte seul au fil des ajouts, la page se fragmente. C'est un
 *   signal, pas un verdict — et la cible ci-dessous est un ordre de grandeur,
 *   pas une exigence.
 *
 * ⛔ Ce qu'il ne mesure pas, et qui décide vraiment :
 *   · le nombre de TEMPS — il est dans les commentaires, pas dans les balises
 *   · l'AÉRATION réelle — « aérée » est un jugement visuel, il appartient à Gaëtan
 *   · le RENDU — il lit le template, pas la page
 *
 * Usage :
 *   node scripts/verifier-seuil-landing.mjs [fichier]
 *   node scripts/verifier-seuil-landing.mjs --temoins
 *
 * Codes de sortie — les trois du dépôt :
 *   0  dans la cible
 *   1  au-dessus de la cible
 *   2  RIEN N'A ÉTÉ EXAMINÉ  (≠ 0)
 */

import fs from 'node:fs'
import path from 'node:path'

const CIBLE = {
  fichier: 'src/views/core/HomePage.vue',
  sections: 6,   // cible : 11 → 6  (fusion des cinq stations nav-*)
  h2: 4,         // cible :  9 → 4
}

/* ⛔ ON NE COMPTE PAS DANS LE <script> NI DANS LE <style>.
   Le fichier fait 3 500 lignes dont 1 178 de template. Compter sur le fichier
   entier donnerait des chiffres qui ne décrivent pas la page — et c'est
   exactement l'erreur que j'ai faite le 23/09 en annonçant une section à
   « 2 369 lignes » : ma découpe englobait le script et le style. */
function template(src) {
  const m = src.match(/<template>([\s\S]*?)<\/template>/i)
  return m ? m[1] : src
}

/** Les commentaires HTML ne sont pas des sections. */
function sansCommentaires(s) {
  return s.replace(/<!--[\s\S]*?-->/g, ' ')
}

function mesurer(fichier) {
  if (!fs.existsSync(fichier)) return null
  const brut = fs.readFileSync(fichier, 'utf8')
  const t = sansCommentaires(template(brut))
  return {
    sections: (t.match(/<section\b/g) || []).length,
    h2: (t.match(/<h2\b/g) || []).length,
    h3: (t.match(/<h3\b/g) || []).length,
    lignes: brut.split('\n').length,
  }
}

function verdict(m) {
  const trop = []
  if (m.sections > CIBLE.sections) trop.push(`<section> ${m.sections} > ${CIBLE.sections}`)
  if (m.h2 > CIBLE.h2) trop.push(`<h2> ${m.h2} > ${CIBLE.h2}`)
  return trop
}

// ── TÉMOINS ─────────────────────────────────────────────────────────────────
// ⭐ Règle 1 du dépôt : tout nouveau contrôle se prouve sur un cas dont on
//    connaît la réponse, ET IL DOIT SAVOIR DIRE NON.
if (process.argv.includes('--temoins')) {
  const d = fs.mkdtempSync(path.join(process.env.TEMP || '/tmp', 'temoin-seuil-'))
  const catalogue = path.join(d, 'catalogue.vue')
  const seuil = path.join(d, 'seuil.vue')
  fs.writeFileSync(catalogue, [
    '<template>',
    ...Array.from({ length: 11 }, (_, i) => `  <section><h2>Chapitre ${i}</h2></section>`),
    '</template>',
    '<script setup>const x = 1 /* <section><h2> */</script>',
    '<style scoped>/* <section> <h2> <h2> */</style>',
  ].join('\n'))
  fs.writeFileSync(seuil, '<template><section><h2>Un</h2></section></template>')

  const mc = mesurer(catalogue), ms = mesurer(seuil)
  const vc = verdict(mc), vs = verdict(ms)

  console.log('')
  console.log('  ÉPREUVE SUR TÉMOINS — le contrôle doit savoir dire OUI et NON')
  console.log('')
  console.log('  TÉMOIN 1 — 11 sections, 11 h2, plus des faux positifs dans <script> et <style>')
  console.log(`    mesuré : ${mc.sections} sections · ${mc.h2} h2`)
  console.log(`    verdict : ${vc.length ? '⛔ refuse — ' + vc.join(' · ') : '⛔ IL ACCEPTE : le contrôle est faux'}`)
  console.log('')
  console.log('  TÉMOIN 2 — 1 section, 1 h2')
  console.log(`    mesuré : ${ms.sections} sections · ${ms.h2} h2`)
  console.log(`    verdict : ${vs.length ? '⛔ il refuse — le contrôle est faux' : '✅ accepte'}`)

  fs.rmSync(d, { recursive: true, force: true })

  // ⭐ Et le témoin 1 doit compter 11, PAS 15 : le <script> et le <style> en
  //    contiennent 4 de plus, et compter dedans a déjà fait conclure à l'envers.
  const propre = mc.sections === 11 && mc.h2 === 11
  const ok = propre && vc.length > 0 && vs.length === 0
  console.log('')
  console.log('  ' + (propre ? '✅' : '⛔') + ' il ignore <script> et <style> : ' +
    (propre ? 'oui' : `NON — ${mc.sections} sections comptées au lieu de 11`))
  console.log('')
  console.log(ok ? '  VERDICT : le contrôle sait dire OUI et NON.'
                 : '  VERDICT : ⛔ le contrôle ne tient pas. Ne pas s\'en servir.')
  console.log('')
  process.exit(ok ? 0 : 1)
}

// ── PROGRAMME ───────────────────────────────────────────────────────────────
const fichiers = process.argv.slice(2).filter((a) => !a.startsWith('--'))
const cible = fichiers.length ? fichiers : [CIBLE.fichier]

console.log('')
console.log('════════════════════════════════════════════════════════════════════')
console.log(' Seuil ou catalogue — la landing, chiffrée')
console.log('════════════════════════════════════════════════════════════════════')

let examine = 0, enFaute = 0

for (const f of cible) {
  const m = mesurer(f)
  if (!m) { console.log('  ⛔ introuvable : ' + f); continue }
  examine++
  const trop = verdict(m)
  if (!trop.length) {
    console.log(`  ✅ ${f}`)
    console.log(`     ${m.sections} sections · ${m.h2} h2 · ${m.h3} h3   (cible ≤ ${CIBLE.sections} / ≤ ${CIBLE.h2})`)
  } else {
    enFaute++
    console.log(`  ⛔ ${f}`)
    console.log(`     ${m.sections} sections · ${m.h2} h2 · ${m.h3} h3   (cible ≤ ${CIBLE.sections} / ≤ ${CIBLE.h2})`)
    for (const t of trop) console.log('       au-dessus : ' + t)
    if (m.h2 > CIBLE.h2) {
      console.log('       ⭐ ' + m.h2 + ' titres de niveau 2, c\'est ' + m.h2 + ' chapitres.')
      console.log('          *Un seuil a peu de titres. Un catalogue en a un par bloc.*')
    }
  }
}

console.log('')
if (examine === 0) {
  console.log('  ⛔ RIEN N\'A ÉTÉ EXAMINÉ — ce n\'est PAS un succès.')
  console.log('')
  process.exit(2)
}

console.log('────────────────────────────────────────────────────────────────────')
if (enFaute === 0) {
  console.log('  ✅ DANS LA CIBLE — ' + examine + ' fichier(s) examiné(s).')
} else {
  console.log('  ⛔ ' + enFaute + ' fichier(s) au-dessus de la cible.')
}
console.log('')
console.log('  ⛔ CE QUE CE CONTRÔLE NE MESURE PAS :')
console.log('     · l\'AÉRATION réelle — *« aérée » est un jugement visuel, il t\'appartient*')
console.log('     · la qualité du texte — *pour ça : verifier-voix-francaise.mjs, et la lecture*')
console.log('     · le RENDU — *il lit le template, pas la page*')
console.log('════════════════════════════════════════════════════════════════════')
console.log('')

process.exit(enFaute > 0 ? 1 : 0)
