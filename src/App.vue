<template>
  <!-- ⚠ `id="app"` RETIRÉ DE CETTE RACINE LE 13/09/2026 — DÉFAUT MESURÉ.
       `index.html` monte l'application dans `<div id="app">`. Ce composant
       réutilisait LE MÊME identifiant pour sa propre racine : le HTML livré
       contenait donc `<div id="app"><div id="app" class="app--loaded">`,
       **sur 24 pages** (règle Opquast 229 : « chaque identifiant HTML n'est
       utilisé qu'une seule fois par page »).
       Conséquence concrète : `getElementById('app')` rend le PREMIER — celui qui
       ne porte PAS `app--loaded`.
       ⚠ CE N'EST PAS LE POINT DE MONTAGE QU'ON RENOMME, ET C'EST DÉLIBÉRÉ :
       `scripts/prerendre.js` teste `querySelector('#app')` et `audio-poste.js`
       fait `getElementById('app')`. Renommer le montage les aurait touchés tous
       les deux. Ici, le montage garde `#app` (donc `#app { … }` continue de
       s'appliquer à lui, comme avant), et cette racine prend la classe
       `app-shell` avec **exactement les mêmes déclarations** — la géométrie
       rendue a été capturée avant et après pour le prouver. -->
  <div class="app-shell" :class="{ 'app--loaded': isLoaded, 'app--sobre': modeSobre, 'app--plein': isFullscreenGame }">
    <!-- Skip Link (Opquast A11Y) -->
    <a href="#main-content" class="skip-link">
      Passer au contenu principal
    </a>

    <!-- Bandeau de soutien — hommage du 11 septembre.
         Il porte son propre `v-if` sur la date : quand ce n'est pas le 11
         septembre, il ne rend RIEN (pas même un conteneur vide), et la règle
         `:has()` du composant ne décale donc pas la navigation. -->
    <BandeauSoutien v-if="isLoaded && !isFullscreenGame" />

    <!-- Scroll Progress Bar -->
    <ScrollProgressBar v-if="isLoaded && !isFullscreenGame" />
    
    <!-- Loader -->
    <Loader v-if="!isFullscreenGame" @loaded="onLoaded" />
    
    <!-- ═══════════════════════════════════════════════════════════════════════
         DÉCOR ANIMÉ RETIRÉ (10/09/2026, décision Gaëtan).

         Verdict après relecture : « enlève le WebGL qui ressemble à rien ».
         Sont donc supprimés du rendu — pas déplacés, supprimés :
           · la pluie de code en canvas (MatrixBackground)
           · les particules réactives au curseur (ReactiveParticles)
           · la Grille TRON en perspective (TronFloor)
           · la couche console, scanlines et vignette (ConsoleOverlay)
           · les six unités 3D générées (UnitesHero)
           · le balayage de transition entre pages
           · les anciens fonds décoratifs (Grid, Particles)

         Raison de fond, au-delà du goût : un site d'artisan qui vend des sites
         web n'a pas à faire une démonstration graphique avant de dire ce qu'il
         vend. Le décor coûtait 47 % du poids de la page, plusieurs centaines de
         millisecondes d'exécution, et il détournait l'attention de l'offre.

         Les composants restent sur disque, non montés : le travail n'est pas
         perdu, il est simplement hors du parcours.
         ═══════════════════════════════════════════════════════════════════════ -->
    
    
    <!-- Floating Decorative Elements -->
    <!-- Éléments flottants décoratifs RETIRÉS (D5, liste de suppression du
         directeur artistique) : des emojis (🚀 ✨ ⚡) et des formes qui suivaient
         la souris, sans aucune valeur pour le visiteur et contraires au verrou
         D1 « aucun emoji en icône ». Le composant reste sur disque. -->
    
    
    <!-- Noise Overlay -->
    <NoiseOverlay v-if="isLoaded && !isFullscreenGame" />
    
    <!-- ═══════════════════════════════════════════════════════════════════════
         LA COQUE — décision Gaëtan, 22/09/2026, citée mot pour mot :

           « Je veux ce bloc en page principale, je veux rien autour.
             Je veux que là où ce qu'il y a autour soit à l'intérieur. »

         CE QUI CHANGE, ET POURQUOI CE N'EST PAS UNE DÉCORATION.
         Jusqu'ici la navigation et le pied de page étaient les FRÈRES de
         `<main>` : deux bandes qui encadraient le contenu. C'est exactement ce
         que « autour » veut dire. Le bloc les CONTIENT désormais — ils ne sont
         plus le cadre du bloc, ils en sont les parties.

         ⚠️ CE QUI REND LA CHOSE VISIBLE, ET CE N'EST PAS LE FOND.
         Mesure : `--bg: var(--paper)` — le vide et le papier portent la MÊME
         valeur (`#080b14`). Un bloc de la même couleur sur le même fond ne se
         voit pas. La séparation est donc portée par une ARÊTE (bordure
         `--rule-strong` + halo), jamais par un remplissage — et surtout pas par
         un noir pur, que la charte interdit (« jamais #000 »).

         ⚠️ `position: sticky` À LA PLACE DE `fixed` : voir `Navigation.vue`.
         Sans ce changement, la barre restait collée à la fenêtre et le bloc
         n'aurait été qu'un cadre dessiné SOUS une barre flottante.

         ⛔ NE PAS mettre `overflow: hidden` ici : cela créerait un conteneur de
         défilement et tuerait le `sticky` de la navigation. (`global.css` porte
         `overflow-x: clip` sur `body` pour cette raison précise.)
         ═══════════════════════════════════════════════════════════════════════ -->
    <div class="coque">
      <!-- Navigation -->
      <Navigation v-if="isLoaded && !isFullscreenGame" />
    
    <!-- LE BALAYAGE : le scan qui traverse l'écran au changement de page.
         Décoratif (aria-hidden), CSS pur, coupé en reduced-motion. -->
    <div v-if="balayageEnCours" class="balayage" aria-hidden="true"></div>

    <!-- Main Content with Enhanced Transitions -->
    <main id="main-content" class="main-content" role="main" tabindex="-1" aria-label="Contenu principal">
      <router-view v-slot="{ Component, route }">
        <transition 
          :name="getTransitionName(route)" 
          mode="out-in"
          @before-enter="onBeforeEnter"
          @after-leave="onAfterLeave"
        >
          <component :is="Component" :key="route.path" />
        </transition>
      </router-view>
    </main>
    
      <!-- Footer classique -->
      <Footer v-if="isLoaded && !isFullscreenGame" />
    </div>
    <!-- ═══ fin de la coque : tout ce qui suit est un calque, pas un cadre ═══ -->
    
    <!-- Self-Diagnostic Bar (Footer fixe) — réservée aux pages lore/expériences -->
    <SelfDiagnosticBar v-if="isLoaded && !isFullscreenGame && !isShowcasePage" />
    
    <!-- Back to Hub et UniverseTracker retirés : ils suivaient les univers Multivers supprimés -->
    
    <!-- Toast Notifications -->
    <ToastNotifications v-if="isLoaded && !isFullscreenGame" />
    
    <!-- Keyboard Navigator -->
    <KeyboardNavigator v-if="isLoaded && !isFullscreenGame" />
    
    <!-- Cookie Banner RGPD -->
    <CookieBanner v-if="isLoaded && !isFullscreenGame" />
    
    <!-- Curseur personnalisé RETIRÉ (D5, 10/09) : le verrou de signature
         qualité impose « curseur natif », et Claude (directeur artistique)
         l'a relevé comme non-conformité : la home n'était pas dans
         `isShowcasePage`, donc elle recevait `app--lore` → curseur système
         masqué + curseur custom. La règle est désormais appliquée au
         parcours ENTIER. Le composant reste sur disque, non monté. -->
    
    <!-- Scroll to Top -->
    <ScrollToTop v-if="isLoaded && !isFullscreenGame" />
    
    <!-- PWA Update Prompt -->
    <PWAUpdatePrompt v-if="isLoaded && !isFullscreenGame" />
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useRoute } from 'vue-router';
// ═══════════════════════════════════════════════════════════════════════════════
//  CE QUI SE MONTE TOUT DE SUITE, ET CE QUI SE DIFFÈRE — 22/09/2026.
//
//  ⛔ `Navigation` et `Footer` NE SE DIFFÈRENT PAS. Ils sont affichés dès le premier
//     rendu, et `scripts/prerendre.js` les exige dans le HTML LIVRÉ :
//     « coquille (header.navigation + footer.footer) dans le HTML LIVRÉ : 28/28 routes ».
//     Les différer ferait un trou à l'écran ET ferait tomber ce verrou.
//  ⛔ `Loader` ne se diffère pas non plus : c'est lui qui déclenche `isLoaded`.
import Navigation from '@/components/sections/Navigation.vue';
import Footer from '@/components/sections/Footer.vue';
import Loader from '@/components/common/Loader.vue';

// ── LES CALQUES CONDITIONNELS — MONTÉS IMMÉDIATEMENT (état du 22/09/2026) ──────
// ⛔⛔ LE DIFFÉRÉ A ÉTÉ TENTÉ, MESURÉ, PUIS ANNULÉ LE 22/09/2026. VOICI POURQUOI.
// Les huit composants ci-dessous avaient été passés en `defineAsyncComponent` et
// regroupés dans UN SEUL morceau (`manualChunks: 'calques'`) — la règle « grouper ce
// qu'on diffère » était respectée. Le découpage ne tenait pas pour autant :
// le chantier a été suspendu sur ordre du dirigeant, parce qu'il faisait perdre des
// pages au prérendu (`verifier-topographie.mjs`) et qu'un dépôt qui ne compile pas
// bloque tous les autres agents. **Un découpage qui fait perdre des pages n'est pas
// un découpage.** On le reprendra sur un dépôt sain, un geste à la fois, avec un build
// de vérification entre chaque.
// ⭐ Ce qui est DÉFINITIF dans ce fichier, et seulement ça : l'import mort retiré.
// Les huit restent MONTÉS TOUT DE SUITE : c'est l'état sur lequel le site est livré
// et vérifié.
import SelfDiagnosticBar from '@/components/sections/SelfDiagnosticBar.vue';
import CookieBanner from '@/components/common/CookieBanner.vue';
import NoiseOverlay from '@/components/common/NoiseOverlay.vue';
// CustomCursor volontairement NON importé (D5) : voir le commentaire dans le
// gabarit. Le fichier reste sur disque pour les expériences immersives futures.
import ScrollToTop from '@/components/common/ScrollToTop.vue';
import ScrollProgressBar from '@/components/common/ScrollProgressBar.vue';
import ToastNotifications from '@/components/common/ToastNotifications.vue';
import KeyboardNavigator from '@/components/common/KeyboardNavigator.vue';
import PWAUpdatePrompt from '@/components/common/PWAUpdatePrompt.vue';

// ── FONDS DÉCORATIFS : LES IMPORTS ONT ÉTÉ RETIRÉS LE 13/09/2026 ───────────
// Ils étaient devenus du CODE MORT, et c'est mesuré, pas supposé.
// La décision du 10/09 (« enlève le WebGL qui ressemble à rien ») avait retiré
// les fonds du RENDU — mais leurs imports étaient restés : trois
// `defineAsyncComponent` (Particles, Grid, Matrix) et un import statique de
// `ReactiveParticles`, qu'aucune balise du gabarit ne montait.
// Mesure du 13/09 : 0 balise de fond dans le gabarit ; le chunk principal
// portait encore une carte `__vite__mapDeps` pointant vers `three`.
// Ce qui coûtait : un lecteur — ou un agent — croyait les fonds actifs, et la
// question « où est le décor ? » se reposait à chaque session.
// Les COMPOSANTS restent sur disque, intacts : le travail n'est pas perdu, il
// est hors du parcours. Pour rebrancher un fond, le geste est de MONTER un
// composant dans le gabarit — pas de ressusciter un sélecteur que personne ne
// lit.
// Le composant de production `three/ScrollScene.vue` (effet 3D piloté par le
// scroll) est prêt et compile ; son montage attend une décision de Gaëtan, qui
// rouvrirait la décision du 10/09.
// ⛔ `FloatingElements` : L'IMPORT A ÉTÉ RETIRÉ LE 22/09/2026, ET C'EST MESURÉ.
// Le fichier était importé et JAMAIS MONTÉ — le commentaire du gabarit le disait
// déjà (« non monté (D5) »), et le gabarit ne portait aucune balise
// `<FloatingElements>`. Ce n'est pas un doublon de commentaire, c'est du POIDS :
// `App.vue` est la coquille chargée sur TOUTES les pages, donc ce composant était
// embarqué et téléchargé par chaque visiteur de chaque page, pour ne rien afficher.
// C'est exactement le défaut réparé le 13/09 sur les trois fonds décoratifs :
// *la décision avait retiré le RENDU, l'import était resté.*
// ⭐ Le composant reste sur disque, intact. Pour le rebrancher, le geste est de
// MONTER une balise dans le gabarit — pas de ressusciter un import que personne ne lit.
// Mode sobre : préférence explicite du visiteur, distincte de reduced-motion.
import { modeSobre } from '@/composables/mode-sobre.js';

const isLoaded = ref(false);
const route = useRoute();

// Mode plein écran réservé aux expériences immersives (plus de jeu construct)
const isFullscreenGame = computed(() => {
  return route.path.startsWith('/play/');
});

// Auto-load pour les jeux fullscreen (pas de Loader)
watch(isFullscreenGame, (isGame) => {
  if (isGame && !isLoaded.value) {
    isLoaded.value = true;
  }
}, { immediate: true });

// ── LE SÉLECTEUR DE FOND A ÉTÉ RETIRÉ LE 13/09/2026, ET VOICI POURQUOI ─────
// `backgroundType` et `backgroundComponent` étaient encore là : un `ref`, un
// `computed`, trois cas de `switch`. Aucun d'eux n'était lu par le gabarit —
// mesure du 13/09 : 0 balise de fond, aucun `<component :is="backgroundComponent">`.
// Après la décision du 10/09, ce sélecteur ne choisissait plus rien : il
// désignait des composants que personne ne montait.
// Deux coûts concrets, tous deux mesurés : il tirait le graphe `three` dans la
// carte de dépendances du chunk principal, et il faisait croire au lecteur
// suivant que le décor était actif — la question s'est reposée le 13/09.
// Pour rebrancher un fond : MONTER un composant dans le gabarit. Pas de
// sélecteur invisible.

// MAJ 10/09 (DA D4 — Matrix Resurrections) : la HOME reçoit le digital rain,
// c'est la vitrine « wow ». Les pages commerciales (services, projets,
// contact, légal) restent SANS canvas animé derrière le texte : la DA
// s'applique au style, jamais à la lisibilité du contenu.
const isShowcasePage = computed(() => {
  const p = route.path;
  return p === '/services' || p === '/projets' || p === '/contact'
    || p === '/arkadia' || p === '/sitemap' || p === '/dossier'
    || p.startsWith('/mentions-legales') || p.startsWith('/confidentialite') || p.startsWith('/cgv');
});

// Pas de fond animé sur les pages vitrine (un canvas qui redessine l'écran
// derrière un texte commercial = lag inutile + distraction).
const showAnimatedBackground = computed(() => !isShowcasePage.value);

// Transition par défaut (les transitions spéciales Multivers ont été retirées
// avec les pages d'univers)
const getTransitionName = () => 'page';

// ── LE BALAYAGE (expérience signature n°3 de la doctrine D5) ────────────────
// Un scan traverse l'écran au changement de page : le poste « lit » la page
// avant de la poser. Purement décoratif, CSS uniquement.
// Il ne retarde RIEN : la nouvelle page s'affiche pendant le balayage, le scan
// passe par-dessus. Aucune attente n'est imposée au visiteur.
const balayageEnCours = ref(false);
let minuteurBalayage = null;

const lancerBalayage = () => {
  if (typeof window === 'undefined') return;
  // Coupé si le visiteur a demandé moins de mouvement — sans exception.
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  // On repasse par false pour que l'animation redémarre même sur deux
  // navigations rapprochées : sinon la seconde n'aurait aucun balayage.
  balayageEnCours.value = false;
  requestAnimationFrame(() => {
    balayageEnCours.value = true;
    if (minuteurBalayage) clearTimeout(minuteurBalayage);
    minuteurBalayage = setTimeout(() => { balayageEnCours.value = false; }, 520);
  });
};

// Callbacks de transition
const onBeforeEnter = () => {
  lancerBalayage();
  // Scroll to top before entering new page
  window.scrollTo({ top: 0, behavior: 'instant' });
};

const onAfterLeave = () => {
  // Cleanup si nécessaire
};

const onLoaded = () => {
  isLoaded.value = true;
};
</script>

<style>
@import './assets/styles/variables.css';
@import './assets/styles/global.css';
@import './assets/styles/a11y.css';

/* Le point de MONTAGE (`index.html`) porte `#app` ; la RACINE DU COMPOSANT porte
   `.app-shell`. Les deux reçoivent les mêmes déclarations : la géométrie rendue
   est donc identique à avant, alors que l'identifiant n'est plus dupliqué. */
#app,
.app-shell {
  position: relative;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  /* ── LE VIDE AUTOUR ───────────────────────────────────────────────────────
     La coque ne touche plus les bords de la fenêtre. C'est ce qui rend
     « rien autour » VISIBLE : sans retrait, un bloc qui remplit tout l'écran
     n'est pas un bloc, il est la page — et rien ne changerait.
     `clamp(0px, …)` : sur un écran étroit, le retrait tombe à zéro et la coque
     reprend toute la largeur. Un cadre n'a pas de sens là où il n'y a pas la
     place pour un cadre. */
  padding: clamp(0px, 1.1vw, 18px);
}

/* ═══════════════════════════════════════════════════════════════════════════
   LA COQUE — l'objet, pas un conteneur de mise en page de plus.
   La navigation, le contenu et le pied de page sont DEDANS : ils ne l'encadrent
   plus, ils en font partie.
   ═══════════════════════════════════════════════════════════════════════════ */
.coque {
  position: relative;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  min-width: 0;

  /* L'ARÊTE PORTE LA SÉPARATION, PAS LE FOND.
     Mesure du 22/09/2026 : `--bg: var(--paper)` — le vide et le papier ont la
     MÊME valeur (`#080b14`). Un bloc de la même couleur sur le même fond ne se
     voit pas. C'est donc le bord qui parle, et c'est aussi ce qui évite un noir
     pur, interdit par la charte (« jamais #000 »). */
  border: 1px solid var(--rule-strong);

  /* Le halo : un pixel d'arête ne suffit pas à lire un bloc sur un écran à
     forte densité. Trois ombres font le relief — un liseré froid, la teinte
     « sacrée » du site en trace, et une ombre portée profonde.
     Aucune image, aucune licence, aucun coût réseau. */
  box-shadow:
    0 0 0 1px rgba(53, 113, 155, 0.22),
    0 0 90px rgba(42, 191, 255, 0.05),
    0 32px 110px rgba(0, 0, 0, 0.55);
}

/* Expériences plein écran (`/play/*`) : la coque disparaît entièrement. Un jeu
   immersif encadré par une bordure n'est plus immersif — et sur ces routes,
   `Navigation` et `Footer` ne sont de toute façon pas montés. */
.app--plein {
  padding: 0;
}

.app--plein .coque {
  border: none;
  box-shadow: none;
}

.app-shell.app--loaded .main-content {
  opacity: 1;
}

.main-content {
  flex-grow: 1;
  position: relative;
  z-index: 2;
  opacity: 0;
  transition: opacity 0.5s ease 0.2s;
}

.main-content:focus {
  outline: none;
}

/* SKIP LINK (A11Y + Awwwards) */
.skip-link {
  position: fixed;
  top: 0;
  left: 50%;
  transform: translateX(-50%) translateY(-100%);
  z-index: 10000;
  padding: 0.875rem 2rem;
  background: var(--primary);
  color: var(--bg);
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.8rem;
  font-weight: 700;
  text-decoration: none;
  border-radius: 0 0 8px 8px;
  box-shadow: var(--shadow-md);
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.skip-link:focus {
  transform: translateX(-50%) translateY(0);
  outline: none;
}

/* ═══════════════════════════════════════════════════════════════════════════
   PAGE TRANSITIONS - Default
   ═══════════════════════════════════════════════════════════════════════════ */

/* ── LE BALAYAGE (doctrine D5, expérience signature n°3) ──────────────────
   Un trait lumineux traverse l'écran horizontalement, suivi d'un voile qui
   s'efface : le poste « lit » la page avant de la poser.
   CSS pur, aucune image, aucun JavaScript pendant l'animation.
   Il ne bloque rien : la page est déjà affichée dessous. */
.balayage {
  position: fixed;
  inset: 0;
  z-index: 400;          /* au-dessus du contenu, sous la navigation (500) */
  pointer-events: none;
  overflow: hidden;
}

/* Le voile : une teinte sombre qui balaie de gauche à droite puis disparaît. */
.balayage::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to right,
    transparent 0%,
    rgba(0, 229, 255, 0.06) 38%,
    rgba(42, 191, 255, 0.10) 50%,
    rgba(0, 229, 255, 0.06) 62%,
    transparent 100%
  );
  transform: translateX(-100%);
  animation: balayage-voile 420ms cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

/* Le trait : une ligne nette qui mène le balayage, comme un rayon de lecture. */
.balayage::after {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  width: 2px;
  background: var(--accent);
  box-shadow: 0 0 24px 4px rgba(42, 191, 255, 0.55);
  transform: translateX(-10px);
  animation: balayage-trait 420ms cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

@keyframes balayage-voile {
  from { transform: translateX(-100%); opacity: 1; }
  70%  { opacity: 1; }
  to   { transform: translateX(100%); opacity: 0; }
}

@keyframes balayage-trait {
  from { transform: translateX(-10px); opacity: 0; }
  10%  { opacity: 1; }
  90%  { opacity: 1; }
  to   { transform: translateX(100vw); opacity: 0; }
}

/* Réduction de mouvement : on ne masque pas le balayage, on ne le joue pas.
   Le composant ne le monte déjà pas dans ce cas — cette règle est la seconde
   ceinture, au cas où une animation serait déclenchée autrement. */
@media (prefers-reduced-motion: reduce) {
  .balayage { display: none; }
}

.page-enter-active,
.page-leave-active {
  transition: opacity 0.4s ease, transform 0.4s ease;
}

.page-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.page-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

/* ═══════════════════════════════════════════════════════════════════════════
   A11Y - Reduced Motion
   ═══════════════════════════════════════════════════════════════════════════ */

@media (prefers-reduced-motion: reduce) {
  .page-enter-active,
  .page-leave-active {
    animation: none !important;
    transition: opacity 0.2s ease !important;
  }

  .page-enter-from,
  .page-leave-to {
    transform: none !important;
    filter: none !important;
  }
}
</style>