<template>
  <!-- ⚠ `id="app"` RETIRÉ DE CETTE RACINE LE 13/09/2026 — DÉFAUT MESURÉ.
       `index.html` monte l'application dans `<div id="app">`. Ce composant
       réutilisait LE MÊME identifiant pour sa propre racine : le HTML livré
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
  <div class="app-shell" :class="{ 'app--loaded': isLoaded, 'app--sobre': modeSobre }">
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
import { ref, computed, watch, defineAsyncComponent } from 'vue';
import { useRoute } from 'vue-router';
import Navigation from '@/components/sections/Navigation.vue';
import Footer from '@/components/sections/Footer.vue';
import SelfDiagnosticBar from '@/components/sections/SelfDiagnosticBar.vue';
import CookieBanner from '@/components/common/CookieBanner.vue';
import Loader from '@/components/common/Loader.vue';
import NoiseOverlay from '@/components/common/NoiseOverlay.vue';
// CustomCursor volontairement NON importé (D5) : voir le commentaire dans le
// gabarit. Le fichier reste sur disque pour les expériences immersives futures.
import ScrollToTop from '@/components/common/ScrollToTop.vue';
import ScrollProgressBar from '@/components/common/ScrollProgressBar.vue';
import ReactiveParticles from '@/components/common/ReactiveParticles.vue';
import ToastNotifications from '@/components/common/ToastNotifications.vue';
import KeyboardNavigator from '@/components/common/KeyboardNavigator.vue';
import PWAUpdatePrompt from '@/components/common/PWAUpdatePrompt.vue';
// Fonds decoratifs charges a la demande : un seul est affiche a la fois, et
// les importer statiquement tirait Three.js (522 Ko) dans le chargement
// bloquant de CHAQUE page, pour un element purement ornemental.
// En asynchrone, la page s'affiche d'abord et le decor arrive ensuite.
const ParticlesBackground = defineAsyncComponent(() => import('@/components/three/ParticlesBackground.vue'));
const GridBackground = defineAsyncComponent(() => import('@/components/three/GridBackground.vue'));
const MatrixBackground = defineAsyncComponent(() => import('@/components/three/MatrixBackground.vue'));
import FloatingElements from '@/components/ui/FloatingElements.vue'; // non monté (D5)
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

// Choix du background : 'particles' | 'grid' | 'matrix'
const backgroundType = ref('matrix');

const backgroundComponent = computed(() => {
  switch (backgroundType.value) {
    case 'matrix':
      return MatrixBackground;
    case 'particles':
      return ParticlesBackground;
    case 'grid':
    default:
      return GridBackground;
  }
});

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
    rgba(0, 255, 65, 0.10) 50%,
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
  box-shadow: 0 0 24px 4px rgba(0, 255, 65, 0.55);
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
   PORTAL TRANSITION - Multivers Hub
   ═══════════════════════════════════════════════════════════════════════════ */

.portal-enter-active {
  transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

.portal-leave-active {
  transition: all 0.4s cubic-bezier(0.7, 0, 0.84, 0);
}

.portal-enter-from {
  opacity: 0;
  transform: scale(0.8) rotateY(15deg);
  filter: blur(10px);
}

.portal-leave-to {
  opacity: 0;
  transform: scale(1.1) rotateY(-15deg);
  filter: blur(10px);
}

/* ═══════════════════════════════════════════════════════════════════════════
   GLITCH TRANSITION - Matrix
   ═══════════════════════════════════════════════════════════════════════════ */

.glitch-enter-active {
  animation: glitchIn 0.5s ease-out forwards;
}

.glitch-leave-active {
  animation: glitchOut 0.4s ease-in forwards;
}

@keyframes glitchIn {
  0% {
    opacity: 0;
    transform: translateX(-20px);
    filter: hue-rotate(90deg) saturate(2);
    clip-path: polygon(0 0, 100% 0, 100% 0, 0 0);
  }
  20% {
    clip-path: polygon(0 0, 100% 0, 100% 30%, 0 30%);
  }
  40% {
    clip-path: polygon(0 0, 100% 0, 100% 60%, 0 60%);
    filter: hue-rotate(45deg) saturate(1.5);
  }
  60% {
    clip-path: polygon(0 0, 100% 0, 100% 80%, 0 80%);
  }
  80% {
    filter: hue-rotate(0deg) saturate(1);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
    filter: none;
    clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
  }
}

@keyframes glitchOut {
  0% {
    opacity: 1;
    filter: none;
  }
  30% {
    filter: hue-rotate(-45deg);
    transform: translateX(5px);
  }
  60% {
    filter: hue-rotate(-90deg) saturate(2);
    transform: translateX(-5px);
  }
  100% {
    opacity: 0;
    filter: hue-rotate(-180deg) saturate(3);
    transform: translateX(20px) skewX(10deg);
  }
}

/* ═══════════════════════════════════════════════════════════════════════════
   DIGITIZE TRANSITION - Tron
   ═══════════════════════════════════════════════════════════════════════════ */

.digitize-enter-active {
  animation: digitizeIn 0.6s ease-out forwards;
}

.digitize-leave-active {
  animation: digitizeOut 0.4s ease-in forwards;
}

@keyframes digitizeIn {
  0% {
    opacity: 0;
    transform: scale(0.95);
    filter: brightness(3) contrast(0.5);
  }
  50% {
    filter: brightness(1.5) contrast(1.2);
  }
  100% {
    opacity: 1;
    transform: scale(1);
    filter: brightness(1) contrast(1);
  }
}

@keyframes digitizeOut {
  0% {
    opacity: 1;
    filter: brightness(1);
  }
  50% {
    filter: brightness(2);
  }
  100% {
    opacity: 0;
    transform: scale(1.05);
    filter: brightness(5) contrast(0);
  }
}

/* ═══════════════════════════════════════════════════════════════════════════
   DREAM TRANSITION - Inception
   ═══════════════════════════════════════════════════════════════════════════ */

.dream-enter-active {
  animation: dreamIn 0.8s cubic-bezier(0.23, 1, 0.32, 1) forwards;
}

.dream-leave-active {
  animation: dreamOut 0.5s cubic-bezier(0.55, 0.085, 0.68, 0.53) forwards;
}

@keyframes dreamIn {
  0% {
    opacity: 0;
    transform: scale(1.2) translateY(-30px);
    filter: blur(20px);
  }
  100% {
    opacity: 1;
    transform: scale(1) translateY(0);
    filter: blur(0);
  }
}

@keyframes dreamOut {
  0% {
    opacity: 1;
    transform: scale(1);
    filter: blur(0);
  }
  100% {
    opacity: 0;
    transform: scale(0.9) translateY(30px);
    filter: blur(15px);
  }
}

/* ═══════════════════════════════════════════════════════════════════════════
   RAIN TRANSITION - Blade Runner
   ═══════════════════════════════════════════════════════════════════════════ */

.rain-enter-active {
  animation: rainIn 0.6s ease-out forwards;
}

.rain-leave-active {
  animation: rainOut 0.4s ease-in forwards;
}

@keyframes rainIn {
  0% {
    opacity: 0;
    transform: translateY(-100%);
    filter: brightness(0.3) saturate(0.5);
  }
  60% {
    filter: brightness(0.8) saturate(0.8);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
    filter: brightness(1) saturate(1);
  }
}

@keyframes rainOut {
  0% {
    opacity: 1;
    filter: brightness(1);
  }
  100% {
    opacity: 0;
    transform: translateY(50%);
    filter: brightness(0.2) saturate(0.3);
  }
}

/* ═══════════════════════════════════════════════════════════════════════════
   POWER TRANSITION - Dragon Ball Z
   ═══════════════════════════════════════════════════════════════════════════ */

.power-enter-active {
  animation: powerIn 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

.power-leave-active {
  animation: powerOut 0.4s ease-in forwards;
}

@keyframes powerIn {
  0% {
    opacity: 0;
    transform: scale(0.5);
    filter: brightness(3) saturate(2);
  }
  50% {
    transform: scale(1.1);
    filter: brightness(1.5) saturate(1.5);
  }
  100% {
    opacity: 1;
    transform: scale(1);
    filter: brightness(1) saturate(1);
  }
}

@keyframes powerOut {
  0% {
    opacity: 1;
    transform: scale(1);
  }
  100% {
    opacity: 0;
    transform: scale(1.3);
    filter: brightness(3);
  }
}

/* ═══════════════════════════════════════════════════════════════════════════
   ARCADE TRANSITION - Ready Player One
   ═══════════════════════════════════════════════════════════════════════════ */

.arcade-enter-active {
  animation: arcadeIn 0.5s steps(8) forwards;
}

.arcade-leave-active {
  animation: arcadeOut 0.4s steps(6) forwards;
}

@keyframes arcadeIn {
  0% {
    opacity: 0;
    transform: scale(0.1);
  }
  25% {
    transform: scale(0.4);
  }
  50% {
    transform: scale(0.7);
  }
  75% {
    transform: scale(0.9);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes arcadeOut {
  0% {
    opacity: 1;
    transform: scale(1);
  }
  100% {
    opacity: 0;
    transform: scale(0.1);
  }
}

/* ═══════════════════════════════════════════════════════════════════════════
   A11Y - Reduced Motion
   ═══════════════════════════════════════════════════════════════════════════ */

@media (prefers-reduced-motion: reduce) {
  .page-enter-active,
  .page-leave-active,
  .portal-enter-active,
  .portal-leave-active,
  .glitch-enter-active,
  .glitch-leave-active,
  .digitize-enter-active,
  .digitize-leave-active,
  .dream-enter-active,
  .dream-leave-active,
  .rain-enter-active,
  .rain-leave-active,
  .power-enter-active,
  .power-leave-active,
  .arcade-enter-active,
  .arcade-leave-active {
    animation: none !important;
    transition: opacity 0.2s ease !important;
  }
  
  .page-enter-from,
  .page-leave-to,
  .portal-enter-from,
  .portal-leave-to,
  .glitch-enter-from,
  .glitch-leave-to {
    transform: none !important;
    filter: none !important;
  }
}
</style>
