// ============================================================
// prerendre-boucle.mjs — GL Digital Lab — 24/09/2026
//
// POURQUOI CE FICHIER EXISTE
//
// ⛔ MESURÉ LE 24/09/2026 : le prérendu écrit **10 pages, puis le moteur de rendu de
// Chrome fige**. Les 24 routes suivantes échouent alors une par une, ~3 minutes chacune
// (délai CDP de 15 s × tentatives, plus le redémarrage du serveur local entre les deux) :
// une passe complète a duré **70,6 minutes pour 10 pages écrites**.
//
// ⭐ LA CAUSE N'ÉTAIT PAS NOMMÉE, ELLE L'EST MAINTENANT : ce n'est pas `/liens` — c'est le
//   NOMBRE de navigations dans une même session Chrome. Le commentaire de `prerendre.js`
//   accusait `/liens` (une page de liens) parce qu'elle tombait à la 11ᵉ place. Le journal
//   de la passe le dit sans ambiguïté : « 10 page(s) écrite(s) avant celle-ci », puis
//   « ROUTE EN ÉCHEC : /ia-de-bord » — deux routes différentes selon l'ordre, même
//   dixième page. *On accusait le passager du siège 11 d'avoir cassé le moteur.*
//
// ⭐ CE QU'ON FAIT DE CETTE CAUSE — ET CE QU'ON NE FAIT PAS.
//   On ne répare pas Chrome : on **repart**. Un Chrome neuf tient dix pages ; trente-trois
//   routes demandent donc quatre passes, pas une. Le prérendu devient une tâche REPRENABLE
//   (`--reprendre` saute les pages déjà écrites *et propres*), et cette boucle la mène
//   jusqu'au bout.
//
// ⚠️ CE QUE LA BOUCLE NE FAIT PAS : elle ne masque rien.
//   · `prerendre.js` sort en **2** quand il reste des routes (« reprends-moi ») — la boucle
//     relance ;
//   · il sort en **0** quand toutes les routes sont écrites — la boucle s'arrête, satisfaite ;
//   · il sort en **1** quand RIEN n'a pu être écrit (sitemap absent, Chrome introuvable,
//     CDP muet) — la boucle ABANDONNE TOUT DE SUITE, sans brûler dix passes pour rien.
//
// ⛔ LE VRAI ÉCHEC RESTE UN ÉCHEC. Si une route refuse de rendre pour une raison permanente,
//    elle sera retentée à chaque passe et `restantes` ne descendra jamais à zéro : au bout
//    de `PRERENDU_PASSES` (10 par défaut), la boucle sort en 2 — la CI est rouge, et c'est
//    voulu. *Un prérendu incomplet qui sort en 0 est exactement le défaut qui a laissé
//    `gldigitallab.fr/guides` répondre 404 pendant que le dépôt contenait les dix pages.*
//
// Usage : npm run prerendre          (c'est ce que `build` appelle, et ce que la CI appelle)
//         PRERENDU_PASSES=4 npm run prerendre   (borner le nombre de passes)
// ============================================================
import { spawn } from 'node:child_process'

const MAX = Number(process.env.PRERENDU_PASSES || 10)
const t0 = Date.now()

let passe = 0
let code = 2   // 2 = « reprends-moi » : c'est l'état de départ normal d'une machine qui ne tient que dix pages

console.log('')
console.log('════════════════════════════════════════════════════════════')
console.log('  PRÉRENDU PAR PASSES REPRISES')
console.log(`  Le moteur de Chrome tient un nombre limité de pages par session ;`)
console.log(`  chaque passe repart avec un Chrome neuf, ${MAX} passes au maximum.`)
console.log('════════════════════════════════════════════════════════════')

while (passe < MAX && code === 2) {
  passe++
  console.log('')
  console.log(`─── PASSE ${passe}/${MAX} ────────────────────────────────────────────`)

  code = await new Promise((res) => {
    // `stdio: 'inherit'` : la sortie de la passe va directement à l'écran, sans être
    // tamponnée. *Un `Select-Object -Last` en bout de chaîne a déjà rendu un lot de
    // transcriptions invisible pendant des heures : on ne tamponne pas un travail long.*
    // ⭐⭐ `--sauf /apps` A ÉTÉ POSÉ PUIS RETIRÉ LE MÊME JOUR — 24/09/2026. Il n'y en a plus.
    //
    // ⛔ CE QU'ON CROYAIT : `/apps` figeait Chrome (125 s de CPU en 100 s, première
    //    navigation, page jamais écrite). On l'avait donc écartée du prérendu, avec la
    //    mention « contournement daté, à retirer dès que /apps rend ».
    // ⭐ CE QUI ÉTAIT VRAI, et qui a été trouvé une heure plus tard : `/apps` est la SEULE
    //    page du site à appeler `t()` — et `t()`, dans `src/composables/useLangue.js`,
    //    écrivait une `ref` (`manquantes.value = new Set(...)`) **pendant le rendu**. Vue
    //    replanifie alors le rendu, `t()` est rappelé, la `ref` est réécrite : boucle
    //    infinie. Corrigé à la source — l'accumulation vit maintenant hors du réactif.
    // ⇒ Mesure après correctif : `/apps` rend en **22 107 octets**, titre « Applications |
    //    Les outils de l'équipage », **les huit routes `/apps*` écrivent, aucune exclusion.**
    //
    // *Le prérendu n'avait pas de route coupable : il avait une page qui bouclait, et
    //  vingt-quatre morts collatérales. Écarter la page aurait laissé le défaut vivant.*
    const p = spawn(process.execPath, ['scripts/prerendre.js', '--reprendre'], {
      stdio: 'inherit',
      cwd: process.cwd(),
    })
    p.on('exit', (c) => res(typeof c === 'number' ? c : 1))
    p.on('error', (e) => { console.error('  ⛔ lancement impossible :', e.message); res(1) })
  })

  console.log(`  → passe ${passe} terminée, code ${code}`)
}

const minutes = ((Date.now() - t0) / 60000).toFixed(1)
console.log('')
if (code === 0) {
  console.log(`✅ PRÉRENDU COMPLET en ${passe} passe(s), ${minutes} min.`)
  console.log('   Toutes les routes déclarées ont une page écrite. Le juge reste')
  console.log('   `npm run audit:topographie`, qui mesure l\'artefact réel.')
  process.exit(0)
}
if (code === 1) {
  console.error(`⛔ PRÉRENDU EN ÉCHEC à la passe ${passe} (${minutes} min) — rien n'a pu être écrit.`)
  console.error('   Ce n\'est PAS un manque de passes : c\'est une panne (sitemap absent,')
  console.error('   Chrome introuvable, CDP muet). Relancer n\'y changerait rien.')
  process.exit(1)
}
console.error(`⛔ PRÉRENDU INCOMPLET après ${MAX} passes (${minutes} min).`)
console.error(`   Des routes refusent encore de rendre : leur échec est PERMANENT,`)
console.error('   pas un figement du moteur. Chercher la route nommée plus haut.')
console.error('   ⛔ On sort en 2 : un prérendu incomplet ne doit pas passer pour un succès.')
process.exit(2)
