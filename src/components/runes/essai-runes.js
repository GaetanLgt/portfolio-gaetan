/**
 * essai-runes.js — le banc d'essai des runes, pour REGARDER avant de livrer.
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * POURQUOI CETTE PAGE EXISTE
 * ───────────────────────────────────────────────────────────────────────────
 * ⭐ LA RÈGLE DU STUDIO : *une capture d'écran se regarde avant d'être citée.*
 * Un tracé qui « doit » être lisible n'est pas un tracé lisible. Cette page
 * affiche les 22 runes tracées, les deux qui n'ont pas de tracé, les mots du
 * studio, la frise — et elle se regarde.
 *
 * ELLE MONTRE LES VRAIS COMPOSANTS (`RuneTrace`, `MotEnRunes`, `BandeRunes`),
 * pas une réécriture : sinon on validerait une maquette et on livrerait autre
 * chose. Elle importe aussi les vraies données (`src/data/runes.js`), donc elle
 * ne peut pas mentir sur ce que le site dessinera.
 *
 * COMMENT L'OUVRIR — et pourquoi il y a deux chemins
 * ───────────────────────────────────────────────────────────────────────────
 *   1. SERVEUR DE DEV (recommandé) : `npm run dev`, puis
 *      http://localhost:5173/src/components/runes/essai-runes.html
 *      Les fichiers `.vue` sont compilés à la volée, c'est le vrai rendu.
 *   2. EN `file://` : Chrome BLOQUE les modules ES locaux (origine « null »,
 *      CORS). La page affiche alors un message explicite au lieu de rester
 *      blanche en silence. *Une page blanche ne dit pas pourquoi elle est
 *      blanche.*
 *
 * ⛔ CE FICHIER N'EST DANS AUCUN ROUTEUR, et son HTML porte `noindex`.
 */
import { createApp } from 'vue/dist/vue.esm-bundler.js';
import RuneTrace from './RuneTrace.vue';
import MotEnRunes from './MotEnRunes.vue';
import BandeRunes from './BandeRunes.vue';
import {
  LETTRES,
  RUNES,
  SANS_TRACE,
  ECARTS_SOURCE,
  MOTS,
  runesPour,
  verifierRunes,
} from '../../data/runes.js';

// Les comptes sont CALCULÉS, jamais écrits à la main : un chiffre écrit à la
// main devient faux sans le dire.
const compte = verifierRunes();
const traitsTotal = LETTRES.reduce((n, cle) => n + RUNES[cle].segments.length, 0);
const traitsMax = LETTRES.reduce((n, cle) => Math.max(n, RUNES[cle].segments.length), 0);

// ⭐ L'ÉPREUVE DU REFUS : on essaie un mot FAUTIF et on garde le message.
// Si cette épreuve n'attrapait rien, le garde-fou ne mordrait pas.
function epreuveDuRefus() {
  try {
    runesPour('ARKADIA 9');
    return { mordu: false, message: "⚠️ runesPour('ARKADIA 9') n'a RIEN levé — le garde-fou ne mord pas." };
  } catch (erreur) {
    return { mordu: true, message: erreur.message };
  }
}

const app = createApp({
  components: { RuneTrace, MotEnRunes, BandeRunes },
  data() {
    return { LETTRES, RUNES, SANS_TRACE, ECARTS_SOURCE, MOTS, compte, traitsTotal, traitsMax, refus: epreuveDuRefus() };
  },
  computed: {
    /** Les 22 runes tracées, dans l'ordre de la source. */
    cartes() {
      return this.LETTRES.map((cle) => ({ cle, ...this.RUNES[cle] }));
    },
  },
  template: `
    <h1>Runes viking du studio — banc d'essai</h1>
    <p class="banc__note">
      Page d'essai, hors routeur, <code>noindex</code>. Les composants montés ici sont les vrais
      (<code>RuneTrace</code>, <code>MotEnRunes</code>, <code>BandeRunes</code>), et les données viennent de
      <code>src/data/runes.js</code>. Aucune image, aucune police, aucun fichier chargé.
    </p>
    <p class="banc__note">
      Futhark ancien : <strong>{{ compte.total }}</strong> runes attendues =
      <strong>{{ compte.tracees }}</strong> tracées ({{ traitsTotal }} traits, {{ traitsMax }} au maximum pour une seule rune)
      + <strong>{{ compte.sansTrace }}</strong> annoncées sans tracé.
    </p>

    <h2>1 · Les runes tracées, une par une</h2>
    <p>Chaque carte montre le tracé seul, puis sa lettre, son nom et son sens attesté.</p>
    <div class="banc__grille">
      <div class="banc__carte" v-for="r in cartes" :key="r.cle">
        <div class="banc__carte-rune">
          <RuneTrace :rune="r.cle" :taille="64" :trait="0.085" :libelle="'Rune ' + r.nom + ', ' + r.sens" />
        </div>
        <div class="banc__carte-lettre">{{ r.cle }}</div>
        <div class="banc__carte-nom">{{ r.nom }}</div>
        <div class="banc__carte-sens">{{ r.sens }}</div>
      </div>
    </div>

    <h2>2 · Ce que la source annonce et ne dessine pas</h2>
    <p>
      Ces runes du Futhark ancien n'ont <strong>aucun tracé</strong> dans
      <code>runes_viking.py</code>. Elles ne sont pas inventées ici : elles sont nommées,
      et un mot qui les contiendrait échouerait clairement.
    </p>
    <ul class="banc__liste">
      <li v-for="r in SANS_TRACE" :key="r.nom">
        <strong>{{ r.nom }}</strong> — {{ r.sens }} · <span class="banc__note">{{ r.note }}</span>
      </li>
    </ul>

    <h2>3 · Les écarts constatés dans la source</h2>
    <ul class="banc__liste">
      <li v-for="e in ECARTS_SOURCE" :key="e.quoi">
        <strong>{{ e.quoi }}</strong> — {{ e.detail }}
      </li>
    </ul>

    <h2>4 · Les mots du studio</h2>
    <p>Les seuls mots écrits en runes. Le premier porte du sens, donc il est annoncé en clair aux lecteurs d'écran.</p>
    <div class="banc__rangee">
      <span class="banc__etiquette">ARKADIA 64</span>
      <span class="banc__mot"><MotEnRunes mot="ARKADIA" :taille="64" :trait="0.085" libelle="ARKADIA" /></span>
    </div>
    <div class="banc__rangee">
      <span class="banc__etiquette">MND 40</span>
      <span class="banc__mot"><MotEnRunes mot="MND" :taille="40" :trait="0.085" libelle="MND" /></span>
    </div>
    <div class="banc__rangee">
      <span class="banc__etiquette">césure</span>
      <span class="banc__mot"><MotEnRunes mot="ARKADIA MND" :taille="28" :trait="0.09" /></span>
    </div>

    <h2>5 · L'épaisseur du trait — ce qui rend une rune reconnaissable</h2>
    <p>
      Le défaut du sceau, c'est le trait trop épais. Ici, la même rune au même corps :
      le vide intérieur est ce qui la fait lire. <strong>0.085</strong> est la valeur retenue.
    </p>
    <div class="banc__rangee">
      <span class="banc__etiquette">trait 0.05</span>
      <span class="banc__mot"><MotEnRunes mot="ARKADIA" :taille="44" :trait="0.05" /></span>
    </div>
    <div class="banc__rangee">
      <span class="banc__etiquette">trait 0.085</span>
      <span class="banc__mot"><MotEnRunes mot="ARKADIA" :taille="44" :trait="0.085" /></span>
    </div>
    <div class="banc__rangee">
      <span class="banc__etiquette">trait 0.16</span>
      <span class="banc__mot"><MotEnRunes mot="ARKADIA" :taille="44" :trait="0.16" /></span>
    </div>

    <h2>6 · Les tailles réelles d'usage</h2>
    <p>Une rune doit rester lisible petite — c'est là qu'elle sert le plus.</p>
    <div class="banc__rangee">
      <span class="banc__etiquette">MND 12</span><span class="banc__mot"><MotEnRunes mot="MND" :taille="12" :trait="0.1" /></span>
    </div>
    <div class="banc__rangee">
      <span class="banc__etiquette">MND 16</span><span class="banc__mot"><MotEnRunes mot="MND" :taille="16" :trait="0.095" /></span>
    </div>
    <div class="banc__rangee">
      <span class="banc__etiquette">MND 24</span><span class="banc__mot"><MotEnRunes mot="MND" :taille="24" :trait="0.09" /></span>
    </div>
    <div class="banc__rangee">
      <span class="banc__etiquette">MND 48</span><span class="banc__mot"><MotEnRunes mot="MND" :taille="48" :trait="0.085" /></span>
    </div>

    <h2>7 · La frise — sobre, ou ratée</h2>
    <p>
      Encre principale, puis encre faible, puis cyan. Puis sur le fond alterné, qui est le
      cas réel d'une carte. Encadrée, elle devient un séparateur de section.
    </p>
    <div class="banc__rangee">
      <span class="banc__etiquette">encre faible</span>
      <span class="banc__mot--faible"><BandeRunes :repetitions="7" :taille="16" /></span>
    </div>
    <div class="banc__rangee">
      <span class="banc__etiquette">encre</span>
      <span class="banc__mot"><BandeRunes :repetitions="7" :taille="16" couleur="var(--ink)" :opacite="0.85" /></span>
    </div>
    <div class="banc__rangee">
      <span class="banc__etiquette">cyan</span>
      <span class="banc__mot--accent"><BandeRunes :repetitions="7" :taille="16" couleur="var(--accent)" :opacite="0.8" /></span>
    </div>
    <div class="banc__rangee">
      <span class="banc__etiquette">encadrée</span>
      <span class="banc__mot--faible"><BandeRunes :repetitions="9" :taille="14" encadre :opacite="0.7" /></span>
    </div>
    <div class="banc__alt">
      <span class="banc__note">sur --paper-alt</span>
      <span class="banc__mot--faible"><BandeRunes :repetitions="6" :taille="18" :opacite="0.75" /></span>
      <span class="banc__mot"><BandeRunes mot="ARKADIA" :repetitions="2" :taille="26" couleur="var(--ink)" :opacite="0.9" /></span>
    </div>

    <h2>8 · L'épreuve du refus</h2>
    <p>
      Un mot dont une lettre n'a pas de rune doit ÉCHOUER, jamais s'afficher à moitié.
      Le banc appelle <code>runesPour('ARKADIA 9')</code> et garde le message.
    </p>
    <div class="banc__bloc-erreur">
      {{ refus.mordu ? '✅ refus obtenu :' : '❌ AUCUN REFUS :' }}
{{ refus.message }}
    </div>
    <hr class="banc__sep">
    <p class="banc__note">
      Mots déclarés par la source : {{ MOTS.join(' · ') }}.
      Runes tracées : {{ LETTRES.join(' ') }}.
    </p>
  `,
});

app.mount('#essai');

/**
 * REGARDER UNE SECTION À LA FOIS — `?section=4` isole la quatrième.
 * ⭐ Un banc d'essai qui ne se regarde qu'en entier ne se regarde pas : la page
 * fait plusieurs milliers de pixels de haut, et une capture réduite pour tenir
 * dans l'écran ne montre plus si une rune est reconnaissable. Le filtre ne
 * réécrit rien, il masque — le reste de la page est bien monté.
 */
const section = new URLSearchParams(window.location.search).get('section');
if (section) {
  const racine = document.getElementById('essai');
  const enfants = Array.from(racine.children);
  const debut = enfants.findIndex(
    (n) => n.tagName === 'H2' && n.textContent.trim().startsWith(`${section} `)
  );
  if (debut === -1) {
    console.warn(`essai-runes : aucune section « ${section} » dans ce banc.`);
  } else {
    let fin = enfants.length;
    for (let i = debut + 1; i < enfants.length; i += 1) {
      if (enfants[i].tagName === 'H2') { fin = i; break; }
    }
    // Les trois premiers enfants (titre + les deux notes) restent visibles :
    // une capture sans son en-tête ne dit plus ce qu'elle montre.
    enfants.forEach((n, i) => {
      if (i >= 3 && (i < debut || i >= fin)) n.style.display = 'none';
    });
  }
}
