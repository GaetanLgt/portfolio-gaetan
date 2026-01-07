<template>
  <div class="scroll-progress" :class="'theme--' + currentTheme" :style="{ '--progress': progress + '%' }">
    <div class="progress-track">
      <div class="progress-fill"></div>
      <div class="progress-glow"></div>
    </div>
    <span class="progress-indicator" v-if="showPercentage">{{ Math.round(progress) }}%</span>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';

const props = defineProps({
  showPercentage: {
    type: Boolean,
    default: false
  }
});

const route = useRoute();
const progress = ref(0);

// Détection du thème selon la route
const currentTheme = computed(() => {
  const path = route.path;
  
  // Thèmes Multivers
  if (path.includes('matrix')) return 'matrix';
  if (path.includes('tron')) return 'tron';
  if (path.includes('blade-runner')) return 'bladerunner';
  if (path.includes('inception')) return 'inception';
  if (path.includes('ghost')) return 'ghost';
  if (path.includes('minority')) return 'minority';
  if (path.includes('iron-man')) return 'ironman';
  if (path.includes('dragon-ball')) return 'dbz';
  if (path.includes('deadpool')) return 'deadpool';
  if (path.includes('mask')) return 'mask';
  if (path.includes('vendetta')) return 'vendetta';
  if (path.includes('ready-player')) return 'oasis';
  if (path.includes('cloud-atlas')) return 'cloudatlas';
  if (path.includes('jupiter')) return 'jupiter';
  if (path.includes('howard')) return 'howard';
  if (path.includes('alice')) return 'alice';
  if (path.includes('asimov')) return 'asimov';
  if (path.includes('mecha') || path.includes('jardin')) return 'ghibli';
  if (path.includes('multivers')) return 'multivers';
  
  // Thème par défaut
  return 'default';
});

const updateProgress = () => {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  progress.value = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
};

onMounted(() => {
  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();
});

onUnmounted(() => {
  window.removeEventListener('scroll', updateProgress);
});
</script>

<style scoped>
.scroll-progress {
  --progress-color: var(--primary, #10B981);
  --progress-glow: rgba(16, 185, 129, 0.5);
  
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  z-index: 9999;
  pointer-events: none;
}

.progress-track {
  position: relative;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.1);
  overflow: hidden;
}

.progress-fill {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: var(--progress);
  background: var(--progress-color);
  transition: width 0.1s ease-out;
}

.progress-glow {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: var(--progress);
  background: var(--progress-color);
  filter: blur(4px);
  opacity: 0.6;
  transition: width 0.1s ease-out;
}

.progress-indicator {
  position: absolute;
  right: 1rem;
  top: 8px;
  font-size: 0.6rem;
  font-family: 'JetBrains Mono', monospace;
  color: var(--progress-color);
  background: rgba(0, 0, 0, 0.8);
  padding: 0.15rem 0.4rem;
  border-radius: 2px;
}

/* ═══════════════════════════════════════════════════════════════════════════
   THÈMES MULTIVERS
   ═══════════════════════════════════════════════════════════════════════════ */

/* Matrix - Vert néon */
.theme--matrix {
  --progress-color: #00ff41;
  --progress-glow: rgba(0, 255, 65, 0.6);
}

/* Tron - Cyan électrique */
.theme--tron {
  --progress-color: #00d4ff;
  --progress-glow: rgba(0, 212, 255, 0.6);
}

/* Blade Runner - Orange néon */
.theme--bladerunner {
  --progress-color: #ff6b2b;
  --progress-glow: rgba(255, 107, 43, 0.6);
}

/* Inception - Or/Bronze */
.theme--inception {
  --progress-color: #d4af37;
  --progress-glow: rgba(212, 175, 55, 0.6);
}

/* Ghost in the Shell - Violet cyber */
.theme--ghost {
  --progress-color: #9d4edd;
  --progress-glow: rgba(157, 78, 221, 0.6);
}

/* Minority Report - Bleu froid */
.theme--minority {
  --progress-color: #4fc3f7;
  --progress-glow: rgba(79, 195, 247, 0.6);
}

/* Iron Man - Rouge/Or */
.theme--ironman {
  --progress-color: #ff3d00;
  --progress-glow: rgba(255, 61, 0, 0.6);
}

/* Dragon Ball Z - Orange Ki */
.theme--dbz {
  --progress-color: #ff9800;
  --progress-glow: rgba(255, 152, 0, 0.6);
}

/* Deadpool - Rouge sang */
.theme--deadpool {
  --progress-color: #e53935;
  --progress-glow: rgba(229, 57, 53, 0.6);
}

/* The Mask - Vert cartoon */
.theme--mask {
  --progress-color: #76ff03;
  --progress-glow: rgba(118, 255, 3, 0.6);
}

/* V for Vendetta - Rouge révolution */
.theme--vendetta {
  --progress-color: #b71c1c;
  --progress-glow: rgba(183, 28, 28, 0.6);
}

/* Ready Player One - Néon arcade */
.theme--oasis {
  --progress-color: #ff00ff;
  --progress-glow: rgba(255, 0, 255, 0.6);
}

/* Cloud Atlas - Gradient multi-époque */
.theme--cloudatlas {
  --progress-color: #64b5f6;
  --progress-glow: rgba(100, 181, 246, 0.6);
}

/* Jupiter Ascending - Or royal */
.theme--jupiter {
  --progress-color: #ffd700;
  --progress-glow: rgba(255, 215, 0, 0.6);
}

/* Howard the Duck - Vert canard */
.theme--howard {
  --progress-color: #4caf50;
  --progress-glow: rgba(76, 175, 80, 0.6);
}

/* Alice Turing - Rose Wonderland */
.theme--alice {
  --progress-color: #e91e63;
  --progress-glow: rgba(233, 30, 99, 0.6);
}

/* Asimov - Bleu acier */
.theme--asimov {
  --progress-color: #607d8b;
  --progress-glow: rgba(96, 125, 139, 0.6);
}

/* Ghibli - Vert nature */
.theme--ghibli {
  --progress-color: #81c784;
  --progress-glow: rgba(129, 199, 132, 0.6);
}

/* Multivers Hub - Gradient animé */
.theme--multivers .progress-fill,
.theme--multivers .progress-glow {
  background: linear-gradient(90deg, #00ff41, #00d4ff, #9d4edd, #ff00ff, #ff6b2b);
  background-size: 300% 100%;
  animation: multiversGradient 3s ease infinite;
}

@keyframes multiversGradient {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

/* A11Y - Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .progress-fill,
  .progress-glow {
    transition: none;
    animation: none;
  }
}
</style>
