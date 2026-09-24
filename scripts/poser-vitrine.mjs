// Pose la vitrine cinematique A LA RACINE de gldigitallab.fr.
//
// ⛔ CE QUE NEO A DIT, ET QU'IL FAUT COMPRENDRE : « au niveau du site c'est toujours
//    pas bon, j'ai toujours l'ancien site qui s'affiche. Je veux avoir le nouvel
//    element que je t'ai envoye : on voit le bateau en fond et on peut tourner
//    autour, avec des panneaux qui descendent au fur et a mesure qui aident a
//    faire la visite. »
//
//    ⇒ La vitrine existait, elle marchait, elle etait a `/vitrine/`. **Il ne la
//      voyait pas.** *Un objet livre a cote de l'endroit ou on le cherche n'est pas
//      livre — et le mesurer ne sert a rien si c'est l'oeil du destinataire qui
//      tranche.*
//
// ⭐ CE QUE CE SCRIPT FAIT : il remplace `dist/index.html` par la vitrine, APRES le
//    prerendu. Les 48 autres pages du site restent en place, a leurs adresses.
//    Seule la racine change de visage : elle montre le navire.
//
// ⚠️ POURQUOI APRES LE PRERENDU, ET PAS AVANT : le prerendu ECRIT `dist/index.html`
//    (la route `/`). Tout ce qu'on poserait avant serait ecrase en silence — c'est
//    exactement le defaut qui a produit la jauge a « 0 / 5 ». *On ecrit apres le
//    dernier ecrivain, ou on n'ecrit pas.*
import { readFileSync, writeFileSync, existsSync, statSync, copyFileSync } from 'node:fs'

const VITRINE = 'public/vitrine/index.html'
const CIBLE = 'dist/index.html'

if (!existsSync(VITRINE)) throw new Error(`ASSERTION : la vitrine est introuvable — ${VITRINE}`)
if (!existsSync(CIBLE)) throw new Error(`ASSERTION : dist/index.html est introuvable — le prerendu a-t-il tourne ?`)

let vitrine = readFileSync(VITRINE, 'utf8')
const avant = statSync(CIBLE).size

/* ── 1. LE BOUTON QUI BOUCLE ────────────────────────────────────────────────────
   La vitrine porte « GL Digital Lab ↗ » → `https://gldigitallab.fr`. Tant qu'elle
   vivait sur `/vitrine/`, ce lien menait au site. **A la racine, il mene a
   elle-meme.** *Un lien qui revient sur la page ou on l'a clique n'est pas un lien :
   c'est un cul-de-sac poli.* Il pointe desormais vers l'offre. */
const LIEN_BOUCLE = 'href="https://gldigitallab.fr"'
let liensCorriges = 0
if (vitrine.includes(LIEN_BOUCLE)) {
  vitrine = vitrine.split(LIEN_BOUCLE).join('href="/dossier"')
  liensCorriges = 1
}

/* ── 2. LE RETOUR VERS LE SITE ──────────────────────────────────────────────────
   Le visiteur qui arrive sur le navire doit pouvoir rejoindre l'agence en un geste.
   On ajoute une entree discrete dans le pied de page, pas un bandeau : *la visite du
   navire ne doit pas etre interrompue par une publicite.* */
const PIED = '<footer>'
if (vitrine.includes(PIED) && !vitrine.includes('ark-retour-site')) {
  vitrine = vitrine.replace(
    PIED,
    `<footer>
  <p class="ark-retour-site" style="margin:0 0 18px;font:400 13px/1.6 ui-monospace,Consolas,monospace;letter-spacing:.06em">
    <a href="/dossier" style="color:#2abfff;border-bottom:1px solid rgba(42,191,255,.4);text-decoration:none">Le dossier du studio</a>
    <span style="opacity:.4"> · </span>
    <a href="/services" style="color:#2abfff;border-bottom:1px solid rgba(42,191,255,.4);text-decoration:none">L'offre</a>
    <span style="opacity:.4"> · </span>
    <a href="/contact" style="color:#2abfff;border-bottom:1px solid rgba(42,191,255,.4);text-decoration:none">Écrire au capitaine</a>
  </p>`,
  )
}

/* ── 3. ASSERTIONS — on refuse de poser une page qui n'est pas la vitrine ─────── */
const controles = [
  ['le moteur 3D est la', vitrine.includes('/vendor/three.min.js')],
  ['aucun CDN', !vitrine.includes('jsdelivr') && !vitrine.includes('fonts.googleapis')],
  ['les huit actes', (vitrine.match(/data-act="\d+"/g) || []).length === 8],
  ['l\'axiome du capitaine', vitrine.includes('On ne combat pas le Mal')],
  ['aucun vert', !/37ff9a|5dff8a|3dff7a/.test(vitrine)],
  ['aucune voile', !vitrine.includes('sailMat')],
  ['le kraken', vitrine.includes('kraken')],
  ['Oracle en violet', vitrine.includes('0x9b5cff')],
  ['Yggdrasil', vitrine.includes('Yggdrasil')],
  ['la graine 42', vitrine.includes('GRAINE 42')],
]
const rates = controles.filter(([, ok]) => !ok).map(([nom]) => nom)
if (rates.length) throw new Error('ASSERTION : ' + rates.join(' · '))

writeFileSync(CIBLE, vitrine, 'utf8')
console.log(`  Racine : la vitrine est posee sur / — dist/index.html ${Math.round(avant / 1024)} Ko -> ${Math.round(vitrine.length / 1024)} Ko`)
if (liensCorriges) console.log(`  Le bouton « GL Digital Lab » ne boucle plus : il mene a /dossier`)
console.log(`  Les 48 autres pages du site restent a leurs adresses.`)
