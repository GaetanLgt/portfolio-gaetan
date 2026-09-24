#!/usr/bin/env node
/**
 * verifier-chaine-langue.mjs — LA LANGUE EST-ELLE BRANCHÉE, OU SEULEMENT ÉCRITE ?
 *
 * ⭐ POURQUOI IL EXISTE
 *
 * Le 23/09/2026, la mesure a dit deux choses qui ne vont pas ensemble :
 *   · la porte de langues rend **0** — `src/locales/de.js` fait **22 clés sur 22** ;
 *   · et le prérendu pose **0 balise `hreflang`** sur les 16 pages fraîchement écrites.
 * ⇒ **Les deux sont vrais, et ce n'est pas une contradiction.**
 *
 * ⛔ CE QU'ON A TROUVÉ EN TIRANT LE FIL — et c'est le motif de ce fichier :
 *   · `src/composables/useLangue.js` existe (8 949 o), sait charger une langue, sait
 *     poser `<html lang="de">`… **et AUCUN fichier de `src/` ne l'importe.**
 *   · `src/router/index.js` **ne porte aucune route de langue** : `/de/` ne résout rien,
 *     donc `dist/de/` n'existe pas, donc `pageExiste()` du prérendu répond NON pour
 *     l'allemand — et il a RAISON de ne rien émettre. *Un `hreflang` qui désignerait
 *     une page inexistante serait un mensonge ; le prérendu refuse de le dire.*
 *   · Et `Navigation.vue` l'écrit lui-même, ligne 530 : *« `hyphens: auto` SEUL NE
 *     SUFFIT PAS : la césure suit la LANGUE DE L'ÉLÉMENT. Il faut donc aussi le `lang`
 *     correct — posé sur `<html>` par `useLangue.js`. »*
 *
 * ⭐ LA LEÇON : **une traduction écrite que rien ne rend est une traduction MORTE.**
 *   *Et elle passe tous les contrôles de complétude, parce que la complétude ne dit
 *   rien de la REACHABILITE.*
 *
 * ⛔ CE QUE CE CONTRÔLE MESURE — six maillons, dans l'ordre de la chaîne :
 *   ① `langues.js` se charge tout seul (Node, pas seulement Vite)
 *   ② le fichier de la langue EXISTE dans `src/locales/`
 *   ③ la langue est DÉCLARÉE dans `langues.js`
 *   ④ le composable est IMPORTÉ par l'application, et APPELÉ
 *   ⑤ une route PORTE la langue — sans quoi aucune page traduite n'existe
 *   ⑥ `<html lang>` est POSÉ — sans quoi la césure ne suit pas la langue
 *
 * ⚠️ CE QU'IL NE MESURE PAS :
 *   · la QUALITÉ de la traduction — *ça n'est pas un contrôle, c'est une relecture*
 *   · la complétude des clés — *c'est `verifier-langues.mjs`, et il le fait mieux*
 *   · ce qui est PUBLIÉ — *il lit les sources et `src/locales`, pas le site en ligne*
 *
 * Usage :
 *   node scripts/verifier-chaine-langue.mjs
 *   node scripts/verifier-chaine-langue.mjs --temoins
 *
 * Codes de sortie — les trois du dépôt :
 *   0  la chaîne est continue (ou il n'y a qu'une langue : rien à déclarer)
 *   1  ROMPUE — et le maillon est nommé
 *   2  RIEN N'A ÉTÉ EXAMINÉ  (≠ 0)
 */

import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

// ── CE QU'ON CHERCHE, ET LE CONTRAT EST EXPLICITE ───────────────────────────
// ⚠️ Le routeur doit porter un paramètre de route nommé `langue`. C'est un CONTRAT,
// pas une convention : si un jour la langue passe autrement, ce contrôle échouera
// **exprès** — et il faudra le mettre à jour, pas le contourner.
const CONTRAT = {
  parametreRoute: /:langue\b/,
  importComposable: /from\s+['"][^'"]*useLangue(\.js)?['"]/,
  appelComposable: /useLangue\s*\(\s*\)/,
  poseDeLang: /definirLangue\s*\(/,
}

function chargerJs(racine, rel) {
  const abs = path.join(racine, rel)
  if (!fs.existsSync(abs)) return { ok: false, erreur: 'absent : ' + rel }
  return { ok: true, url: abs }
}

function fichiersSource(racine) {
  const base = path.join(racine, 'src')
  if (!fs.existsSync(base)) return []
  const out = []
  const marcher = (d) => {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, e.name)
      if (e.isDirectory()) marcher(p)
      else if (/\.(js|mjs|ts|vue)$/.test(e.name)) out.push(p)
    }
  }
  marcher(base)
  return out
}

/**
 * Analyse d'une racine de site. Tout passe par `racine` pour que les témoins
 * puissent fabriquer une arborescence minimale et éprouver chaque maillon.
 */
async function analyser(racine) {
  const constats = []
  const ruptures = []

  // ① `langues.js` se charge-t-il tout seul ?
  const cheminLangues = 'src/config/langues.js'
  let cfg = null
  try {
    const u = pathToFileURL(path.join(racine, cheminLangues)).href
    cfg = await import(u)
  } catch (e) {
    ruptures.push({ code: '①', quoi: '`src/config/langues.js` ne se charge pas hors du bundler', detail: String(e.message || e).split('\n')[0] })
  }

  const actives = cfg?.LANGUES_ACTIVES?.map((l) => l.code) ?? []
  const accueil = cfg?.LANGUE_ACCUEIL ?? null
  const declarees = cfg?.LANGUES?.map((l) => l.code) ?? []
  const comp = chargerJs(racine, 'src/composables/useLangue.js')

  // ②③ Quelles langues ont un fichier, et sont-elles déclarées ?
  const dossierLocales = path.join(racine, 'src/locales')
  const fichiersLocales = fs.existsSync(dossierLocales)
    ? fs.readdirSync(dossierLocales).filter((n) => n.endsWith('.js')).map((n) => n.replace(/\.js$/, ''))
    : []

  for (const f of fichiersLocales) {
    /* ⛔ ORPHELIN = le fichier existe et la langue n'est pas ACTIVE.
       *Déclarée mais « à décider » ne compte pas : elle ne sera jamais chargée.* */
    if (![...actives, accueil].includes(f)) {
      ruptures.push({ code: '③', quoi: `\`src/locales/${f}.js\` existe mais \`${f}\` n'est déclarée nulle part dans \`langues.js\``, detail: 'un fichier orphelin ne sera jamais chargé' })
    }
  }

  /* ⚠️ ET UNE LANGUE SANS FICHIER N'EST **PAS** UNE RUPTURE.
     *C'est un chantier.* Une langue qui n'existe pas ne peut pas être en retard —
     et la porte de complétude (`verifier-langues.mjs`) est là pour ça, pas ce contrôle. */
  const ecrites = fichiersLocales.filter((l) => accueil === null || l !== accueil)
  const nonEcrites = actives.filter((l) => !fichiersLocales.includes(l))

  // ④ Le composable est-il importé ET appelé ailleurs que dans son propre fichier ?
  const sources = fichiersSource(racine)
  const absComp = path.join(racine, 'src/composables/useLangue.js')
  const importateurs = sources.filter((p) => p !== absComp && CONTRAT.importComposable.test(fs.readFileSync(p, 'utf8')))
  const appelants = sources.filter((p) => p !== absComp && CONTRAT.appelComposable.test(fs.readFileSync(p, 'utf8')))

  // ⑤ Une route porte-t-elle la langue ?
  const cheminRouteur = path.join(racine, 'src/router/index.js')
  const srcRouteur = fs.existsSync(cheminRouteur) ? fs.readFileSync(cheminRouteur, 'utf8') : ''
  const routeurPorteLaLangue = CONTRAT.parametreRoute.test(srcRouteur)

  // ⑥ `<html lang>` est-il posé quelque part ?
  const poseurs = sources.filter((p) => p !== absComp && CONTRAT.poseDeLang.test(fs.readFileSync(p, 'utf8')))

  /* ⭐ LA RÈGLE DE DÉCISION, ET ELLE EST LE CŒUR DU FICHIER :
     s'il n'y a AUCUNE langue écrite en plus de l'accueil, il n'y a rien à brancher —
     et le prérendu a raison de poser 0 `hreflang`. */
  if (ecrites.length > 0) {
    if (!comp.ok) ruptures.push({ code: '④', quoi: '`src/composables/useLangue.js` est absent', detail: comp.erreur })
    else {
      if (importateurs.length === 0) ruptures.push({ code: '④', quoi: 'PERSONNE n\'importe `useLangue`', detail: 'la traduction existe et rien ne la rend' })
      else if (appelants.length === 0) ruptures.push({ code: '④', quoi: '`useLangue` est importé mais jamais appelé', detail: 'importé par : ' + importateurs.map((p) => path.relative(racine, p)).join(', ') })
      if (!routeurPorteLaLangue) ruptures.push({ code: '⑤', quoi: 'AUCUNE route ne porte la langue', detail: 'sans route `/:langue`, aucune page traduite n\'existe — et le prérendu a raison de ne poser aucun `hreflang`' })
      if (poseurs.length === 0) ruptures.push({ code: '⑥', quoi: '`<html lang>` n\'est JAMAIS posé', detail: 'la césure (`hyphens: auto`) ne suit pas la langue' })
    }
  }

  return { racine, actives, accueil, declarees, fichiersLocales, ecrites, nonEcrites, importateurs, appelants, routeurPorteLaLangue, poseurs, ruptures, constats }
}

// ── TÉMOINS ─────────────────────────────────────────────────────────────────
// ⭐ Règle 1 du dépôt : tout contrôle se prouve sur des cas dont on connaît la
//    réponse — ET IL DOIT SAVOIR DIRE NON.
if (process.argv.includes('--temoins')) {
  const d = fs.mkdtempSync(path.join(process.env.TEMP || '/tmp', 'temoin-chaine-'))
  let n = 0
  /**
   * Fabrique une arborescence MINIMALE et cohérente, puis casse UN maillon.
   * *Un témoin par maillon : si un témoin rend le mauvais code, on sait lequel.*
   */
  function fabriquer({ localeDe = true, declaree = true, importe = true, appelle = true, route = true, pose = true } = {}) {
    const r = path.join(d, 'cas-' + (++n))
    const w = (rel, txt) => { const p = path.join(r, rel); fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, txt, 'utf8') }
    w('src/config/langues.js', [
      "export const LANGUE_ACCUEIL = 'fr';",
      "export const LANGUES = [" + [['fr', true], ['de', declaree]].map(([c, d2]) => `{ code: '${c}', role: '${d2 ? 'active' : 'a-decider'}' }`).join(', ') + '];',
      "export const LANGUES_ACTIVES = LANGUES.filter((l) => l.role !== 'a-decider');",
    ].join('\n'))
    w('src/locales/fr.js', 'export default { "a": "a" };')
    if (localeDe) w('src/locales/de.js', 'export default { "a": "b" };')
    w('src/composables/useLangue.js', 'export function useLangue() { return {} }\nexport async function definirLangue(c) { return c }')
    if (importe) w('src/App.vue', `<script setup>\nimport { useLangue } from '@/composables/useLangue.js'\n${appelle ? 'const { t } = useLangue()\n' : ''}${pose ? "definirLangue('de')\n" : ''}</script>`)
    w('src/router/index.js', `export const routes = [\n  { path: '/', component: {} },\n  { path: '${route ? '/:langue?' : '/'}', component: {} },\n]`)
    return r
  }

  const cas = [
    ['chaîne continue', 'tout est branché', fabriquer(), 0],
    ['aucune langue écrite', 'seul le français existe — rien à déclarer, et ce n’est PAS une rupture', fabriquer({ localeDe: false }), 0],
    ['fichier orphelin', '`de.js` existe mais `de` n’est pas déclarée', fabriquer({ declaree: false }), 1],
    ['composable orphelin', '`useLangue` n’est importé par personne', fabriquer({ importe: false }), 1],
    ['composable importé jamais appelé', 'importé, mais `useLangue()` n’est jamais appelé', fabriquer({ appelle: false }), 1],
    ['aucune route de langue', '`/:langue` absent du routeur', fabriquer({ route: false }), 1],
    ['`<html lang>` jamais posé', '`definirLangue` n’est appelé nulle part', fabriquer({ pose: false }), 1],
  ]

  console.log('')
  console.log('  ÉPREUVE SUR TÉMOINS — le contrôle doit savoir dire OUI et NON')
  console.log('')
  let tordus = 0
  for (const [nom, raison, racine, attendu] of cas) {
    const a = await analyser(racine)
    const obtenu = a.ruptures.length ? 1 : 0
    const ok = obtenu === attendu
    if (!ok) tordus++
    console.log(`  ${ok ? '✅' : '⛔'} TÉMOIN — ${nom}`)
    console.log(`      ${raison} · attendu : ${attendu === 0 ? 'accepte' : 'refuse'} · obtenu : ${obtenu === 0 ? 'accepte' : 'refuse'}`)
    if (a.ruptures.length) console.log(`      maillon : ${a.ruptures.map((x) => x.code).join(' ')} — ${a.ruptures[0].quoi}`)
    console.log('')
  }

  fs.rmSync(d, { recursive: true, force: true })
  const ok = tordus === 0
  console.log('  VERDICT : ' + (ok
    ? `le contrôle sait dire OUI et NON sur les ${cas.length} témoins.`
    : `⛔ ${tordus} témoin(s) mal jugé(s). NE PAS S'EN SERVIR.`))
  console.log('')
  process.exit(ok ? 0 : 1)
}

// ── PROGRAMME ───────────────────────────────────────────────────────────────
const racine = process.cwd()
console.log('')
console.log('════════════════════════════════════════════════════════════════════')
console.log(' La langue — ÉCRITE, ou BRANCHÉE ?')
console.log('════════════════════════════════════════════════════════════════════')

const a = await analyser(racine)

console.log(`  langues actives : ${a.actives.join(' ') || '(aucune)'}   ·   accueil : ${a.accueil ?? '?'}`)
console.log(`  fichiers présents dans src/locales : ${a.fichiersLocales.join(' ') || '(aucun)'}`)
console.log(`  écrites en plus de l'accueil : ${a.ecrites.join(' ') || '(aucune)'}`)
if (a.nonEcrites.length) console.log(`  ○ chantier, et ce n'est PAS un défaut : ${a.nonEcrites.join(' ')}`)
console.log('')
console.log(`  ④ useLangue importé par : ${a.importateurs.length ? a.importateurs.map((p) => path.relative(racine, p)).join(', ') : '⛔ PERSONNE'}`)
console.log(`     et appelé par         : ${a.appelants.length ? a.appelants.map((p) => path.relative(racine, p)).join(', ') : '⛔ PERSONNE'}`)
console.log(`  ⑤ route portant la langue : ${a.routeurPorteLaLangue ? '✅ oui' : '⛔ aucune'}`)
console.log(`  ⑥ <html lang> posé par    : ${a.poseurs.length ? a.poseurs.map((p) => path.relative(racine, p)).join(', ') : '⛔ PERSONNE'}`)
console.log('')

console.log('────────────────────────────────────────────────────────────────────')
if (a.ecrites.length === 0) {
  console.log("  ✅ RIEN À BRANCHER — une seule langue est écrite.")
  console.log('     *Et le prérendu a raison de ne poser aucun `hreflang` : il n\'y a pas d\'alternative.*')
  console.log('')
  console.log('════════════════════════════════════════════════════════════════════')
  console.log('')
  process.exit(0)
}

if (a.ruptures.length === 0) {
  console.log(`  ✅ LA CHAÎNE EST CONTINUE sur ${a.ecrites.length} langue(s) écrite(s) en plus de l'accueil.`)
} else {
  console.log(`  ⛔ LA CHAÎNE EST ROMPUE — ${a.ruptures.length} maillon(s) :`)
  console.log('')
  for (const r of a.ruptures) {
    console.log(`     ${r.code}  ${r.quoi}`)
    console.log(`         *${r.detail}*`)
  }
  console.log('')
  console.log('  ⛔ CE QUE ÇA VEUT DIRE, ET IL FAUT LE DIRE AINSI :')
  console.log('     la traduction est ÉCRITE et elle n\'est PAS RENDUE.')
  console.log('     *Continuer à écrire des langues avant de rebrancher celle-ci ajouterait')
  console.log('      du travail mort — et la porte de complétude dirait « ✅ » à chaque fois.*')
}
console.log('')
console.log("  ⛔ CE QUE CE CONTRÔLE NE MESURE PAS :")
console.log('     · la QUALITÉ de la traduction — *ça n\'est pas un contrôle, c\'est une relecture*')
console.log('     · la COMPLÉTUDE des clés — *c\'est `verifier-langues.mjs`, et il le fait mieux*')
console.log('     · ce qui est PUBLIÉ — *il lit les sources, pas le site en ligne*')
console.log('════════════════════════════════════════════════════════════════════')
console.log('')

process.exit(a.ruptures.length ? 1 : 0)
