<template>
  <div id="app" :class="{ 'app--loaded': isLoaded }">
    <!-- Skip Link (Opquast A11Y) -->
    <a href="#main-content" class="skip-link">
      Passer au contenu principal
    </a>
    
    <!-- Scroll Progress Bar -->
    <ScrollProgressBar v-if="isLoaded && !isFullscreenGame" />
    
    <!-- Loader -->
    <Loader v-if="!isFullscreenGame" @loaded="onLoaded" />
    
    <!-- Backgrounds (choix via backgroundType) -->
    <component :is="backgroundComponent" v-if="isLoaded && !isFullscreenGame" />
    
    <!-- Reactive Particles (follows cursor) -->
    <ReactiveParticles v-if="isLoaded && !isFullscreenGame" />
    
    <!-- Floating Decorative Elements -->
    <FloatingElements v-if="isLoaded && !isFullscreenGame" />
    
    <!-- Noise Overlay -->
    <NoiseOverlay v-if="isLoaded && !isFullscreenGame" />
    
    <!-- Navigation -->
    <Navigation v-if="isLoaded && !isFullscreenGame" />
    
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
    
    <!-- Self-Diagnostic Bar (Footer fixe) -->
    <SelfDiagnosticBar v-if="isLoaded && !isFullscreenGame" />
    
    <!-- Back to Hub Button (Multivers pages) -->
    <BackToHub v-if="isLoaded && !isFullscreenGame" />
    
    <!-- Universe Progress Tracker -->
    <UniverseTracker v-if="isLoaded && !isFullscreenGame" />
    
    <!-- Achievements System -->
    <AchievementsSystem v-if="isLoaded && !isFullscreenGame" />
    
    <!-- Sound Manager -->
    <SoundManager v-if="isLoaded && !isFullscreenGame" />
    
    <!-- Easter Eggs (Konami, Matrix) -->
    <EasterEggs v-if="isLoaded && !isFullscreenGame" />
    
    <!-- Command Palette (Ctrl+K) -->
    <CommandPalette v-if="isLoaded && !isFullscreenGame" />
    
    <!-- Toast Notifications -->
    <ToastNotifications v-if="isLoaded && !isFullscreenGame" />
    
    <!-- Confetti Effect -->
    <ConfettiEffect v-if="isLoaded && !isFullscreenGame" />
    
    <!-- Keyboard Navigator -->
    <KeyboardNavigator v-if="isLoaded && !isFullscreenGame" />
    
    <!-- Cookie Banner RGPD -->
    <CookieBanner v-if="isLoaded && !isFullscreenGame" />
    
    <!-- Custom Cursor (Awwwards) -->
    <CustomCursor v-if="isLoaded && !isFullscreenGame" />
    
    <!-- Scroll to Top -->
    <ScrollToTop v-if="isLoaded && !isFullscreenGame" />
    
    <!-- PWA Update Prompt -->
    <PWAUpdatePrompt v-if="isLoaded && !isFullscreenGame" />
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import Navigation from '@/components/sections/Navigation.vue';
import Footer from '@/components/sections/Footer.vue';
import SelfDiagnosticBar from '@/components/sections/SelfDiagnosticBar.vue';
import CookieBanner from '@/components/common/CookieBanner.vue';
import Loader from '@/components/common/Loader.vue';
import NoiseOverlay from '@/components/common/NoiseOverlay.vue';
import CustomCursor from '@/components/common/CustomCursor.vue';
import ScrollToTop from '@/components/common/ScrollToTop.vue';
import ScrollProgressBar from '@/components/common/ScrollProgressBar.vue';
import BackToHub from '@/components/common/BackToHub.vue';
import UniverseTracker from '@/components/common/UniverseTracker.vue';
import ReactiveParticles from '@/components/common/ReactiveParticles.vue';
import AchievementsSystem from '@/components/common/AchievementsSystem.vue';
import SoundManager from '@/components/common/SoundManager.vue';
import EasterEggs from '@/components/common/EasterEggs.vue';
import CommandPalette from '@/components/common/CommandPalette.vue';
import ToastNotifications from '@/components/common/ToastNotifications.vue';
import ConfettiEffect from '@/components/common/ConfettiEffect.vue';
import KeyboardNavigator from '@/components/common/KeyboardNavigator.vue';
import PWAUpdatePrompt from '@/components/common/PWAUpdatePrompt.vue';
import ParticlesBackground from '@/components/three/ParticlesBackground.vue';
import GridBackground from '@/components/three/GridBackground.vue';
import MatrixBackground from '@/components/three/MatrixBackground.vue';
import FloatingElements from '@/components/ui/FloatingElements.vue';

const isLoaded = ref(false);
const route = useRoute();

// Mode fullscreen pour les jeux (cache header/footer/decorations)
const isFullscreenGame = computed(() => {
  return route.path.startsWith('/play/') || route.path === '/construct';
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

// Transitions adaptatives selon la route
const getTransitionName = (targetRoute) => {
  const path = targetRoute.path;
  
  // Transitions spéciales pour le Multivers
  if (path.includes('multivers')) return 'portal';
  if (path.includes('matrix')) return 'glitch';
  if (path.includes('tron')) return 'digitize';
  if (path.includes('inception')) return 'dream';
  if (path.includes('blade-runner')) return 'rain';
  if (path.includes('dragon-ball')) return 'power';
  if (path.includes('ready-player')) return 'arcade';
  
  // Transition par défaut
  return 'page';
};

// Callbacks de transition
const onBeforeEnter = () => {
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

#app {
  position: relative;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

#app.app--loaded .main-content {
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
  box-shadow: 0 4px 20px rgba(16, 185, 129, 0.4);
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.skip-link:focus {
  transform: translateX(-50%) translateY(0);
  outline: none;
}

/* ═══════════════════════════════════════════════════════════════════════════
   PAGE TRANSITIONS - Default
   ═══════════════════════════════════════════════════════════════════════════ */

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
