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

/* ── 2. LA NAVIGATION ET LE RETOUR VERS LE SITE ────────────────────────────────
   ⛔ MESURE DU 24/09/2026, ET C'EST LE DÉFAUT LE PLUS BÊTE DE LA JOURNÉE :
     `ark-retour-site`  SOURCE 0 · SCRIPT 2 · GÉNÉRÉ 0
   Le script ÉCRIVAIT le bloc, et le fichier livré ne l'avait PAS. Parce que le
   remplacement cherchait `<footer>` — qui n'existe pas dans cette page — et
   qu'**un `replace()` qui ne trouve rien ne lève aucune erreur.**
   ⭐ *Un remplacement sans assertion est un remplacement à l'aveugle* — la loi que
   le studio a payée trois fois, et que je viens de repayer.
   ⇒ On ancre sur `</body>`, qui existe dans toute page HTML, ET on l'assère.

   ⭐ ET LA NAVIGATION VIT ICI, PAS DANS LE FICHIER GÉNÉRÉ. Elle y avait été posée
   directement : au build suivant, ce script régénère la page depuis la source et
   **la navigation disparaît**. *Ce qui doit survivre à une régénération s'écrit
   dans le générateur, jamais dans le généré.* */
const NAV = `
<style id="ark-site-nav-style">
  /* ⭐ LA NAVIGATION DU SITE, PAR-DESSUS LA VISITE.
     Le visiteur arrive sur un navire : il doit pouvoir en SORTIR en un geste. */
  .ark-site-nav {
    position: fixed; top: 14px; right: 18px; z-index: 40;
    display: flex; gap: 6px; align-items: center; flex-wrap: wrap;
    justify-content: flex-end; max-width: min(680px, 62vw);
  }
  .ark-site-nav a {
    font-family: 'JetBrains Mono', ui-monospace, Consolas, monospace;
    font-size: 11px; letter-spacing: .12em; text-transform: uppercase;
    color: #9fc4d8; text-decoration: none; padding: 7px 11px;
    border: 1px solid rgba(42,191,255,.22); border-radius: 3px;
    background: rgba(8,11,20,.62); backdrop-filter: blur(6px);
    transition: color .18s, border-color .18s, background .18s;
  }
  .ark-site-nav a:hover, .ark-site-nav a:focus-visible {
    color: #eaf6ff; border-color: rgba(42,191,255,.75);
    background: rgba(42,191,255,.12); outline: none;
  }
  .ark-site-nav a:focus-visible { box-shadow: 0 0 0 2px rgba(42,191,255,.55); }
  .ark-site-nav__cta {
    color: #080b14 !important; background: #2abfff !important;
    border-color: #2abfff !important; font-weight: 700;
  }
  .ark-site-nav__cta:hover, .ark-site-nav__cta:focus-visible {
    background: #7fd8ff !important; border-color: #7fd8ff !important;
  }
  @media (max-width: 720px) {
    .ark-site-nav { top: auto; bottom: 10px; right: 10px; left: 10px; max-width: none; justify-content: center; gap: 5px; }
    .ark-site-nav a { font-size: 10px; padding: 6px 8px; letter-spacing: .08em; }
  }
  @media (prefers-reduced-motion: reduce) { .ark-site-nav a { transition: none; } }
</style>
<nav class="ark-site-nav" id="ark-site-nav" aria-label="Navigation du site GL Digital Lab">
  <a href="/services">Offre</a>
  <a href="/projets">Réalisations</a>
  <a href="/dossier">Méthode</a>
  <a href="/galion">Le navire</a>
  <a href="/contact" class="ark-site-nav__cta">Parler de votre projet</a>
</nav>
`

/* Cinq entrées, pas sept : *un menu qui liste tout ne guide personne.* */

const ANCRE_FIN = '</body>'
if (!vitrine.includes(ANCRE_FIN)) {
  throw new Error('ASSERTION : </body> introuvable — impossible de poser la navigation sans casser la page')
}
if (!vitrine.includes('ark-site-nav')) {
  // Le style va dans <head>, la barre juste apres <body> — l'ordre du document compte.
  vitrine = vitrine.replace('</head>', NAV.split('<nav')[0] + '</head>')
  vitrine = vitrine.replace(ANCRE_FIN, NAV.slice(NAV.indexOf('<nav')) + '\n' + ANCRE_FIN)
}
/* ⛔ L'ASSERTION QUI MANQUAIT : on VÉRIFIE que le bloc est bien dans le résultat.
   Sans elle, un `replace()` qui ne trouve rien passe pour un succès. */
if (!vitrine.includes('id="ark-site-nav"')) {
  throw new Error('ASSERTION : la navigation n\'est PAS dans le resultat — le remplacement a echoue en silence')
}
if (!vitrine.includes('ark-site-nav-style')) {
  throw new Error('ASSERTION : le style de la navigation n\'est PAS dans le resultat')
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
