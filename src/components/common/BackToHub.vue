<template>
  <Transition name="fade">
    <router-link 
      v-if="isVisible && isMultiversPage" 
      to="/multivers" 
      class="back-to-hub"
      :class="'theme--' + currentTheme"
      aria-label="Retour au Hub Multivers"
    >
      <span class="hub-icon">🌀</span>
      <span class="hub-text">Hub</span>
      <span class="hub-glow" aria-hidden="true"></span>
    </router-link>
  </Transition>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const isVisible = ref(false);
const scrollThreshold = 300;

// Liste des routes multivers (hors hub)
const multiversRoutes = [
  '/matrix', '/matrix-resurrections', '/tron', '/blade-runner', '/inception',
  '/ghost-in-the-shell', '/minority-report', '/iron-man', '/dragon-ball-z',
  '/deadpool', '/the-mask', '/v-for-vendetta', '/ready-player-one',
  '/cloud-atlas', '/jupiter-ascending', '/howard-the-duck', '/alice-turing',
  '/asimov', '/mecha-mascot', '/jardin-de-mam'
];

const isMultiversPage = computed(() => {
  return multiversRoutes.some(r => route.path.startsWith(r));
});

// Thème adaptatif
const currentTheme = computed(() => {
  const path = route.path;
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
  return 'default';
});

const handleScroll = () => {
  isVisible.value = window.scrollY > scrollThreshold;
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<style scoped>
.back-to-hub {
  --hub-color: var(--primary, #10B981);
  --hub-glow: rgba(16, 185, 129, 0.4);
  
  position: fixed;
  bottom: 100px;
  right: 1.5rem;
  z-index: 1000;
  
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  
  background: rgba(0, 0, 0, 0.8);
  border: 1px solid var(--hub-color);
  border-radius: 50px;
  
  color: var(--hub-color);
  text-decoration: none;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.75rem;
  letter-spacing: 0.05em;
  
  transition: all 0.3s ease;
  overflow: hidden;
}

.back-to-hub:hover {
  background: rgba(0, 0, 0, 0.95);
  transform: translateX(-5px);
  box-shadow: 0 0 20px var(--hub-glow);
}

.hub-icon {
  font-size: 1.1rem;
  animation: portalSpin 4s linear infinite;
}

.hub-text {
  font-weight: 600;
  text-transform: uppercase;
}

.hub-glow {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 30% 50%, var(--hub-glow), transparent 70%);
  opacity: 0;
  transition: opacity 0.3s;
}

.back-to-hub:hover .hub-glow {
  opacity: 1;
}

@keyframes portalSpin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* ═══════════════════════════════════════════════════════════════════════════
   THÈMES
   ═══════════════════════════════════════════════════════════════════════════ */

.theme--matrix {
  --hub-color: #00ff41;
  --hub-glow: rgba(0, 255, 65, 0.4);
}

.theme--tron {
  --hub-color: #00d4ff;
  --hub-glow: rgba(0, 212, 255, 0.4);
}

.theme--bladerunner {
  --hub-color: #ff6b2b;
  --hub-glow: rgba(255, 107, 43, 0.4);
}

.theme--inception {
  --hub-color: #d4af37;
  --hub-glow: rgba(212, 175, 55, 0.4);
}

.theme--ghost {
  --hub-color: #9d4edd;
  --hub-glow: rgba(157, 78, 221, 0.4);
}

.theme--minority {
  --hub-color: #4fc3f7;
  --hub-glow: rgba(79, 195, 247, 0.4);
}

.theme--ironman {
  --hub-color: #ff3d00;
  --hub-glow: rgba(255, 61, 0, 0.4);
}

.theme--dbz {
  --hub-color: #ff9800;
  --hub-glow: rgba(255, 152, 0, 0.4);
}

.theme--deadpool {
  --hub-color: #e53935;
  --hub-glow: rgba(229, 57, 53, 0.4);
}

.theme--mask {
  --hub-color: #76ff03;
  --hub-glow: rgba(118, 255, 3, 0.4);
}

.theme--vendetta {
  --hub-color: #b71c1c;
  --hub-glow: rgba(183, 28, 28, 0.4);
}

.theme--oasis {
  --hub-color: #ff00ff;
  --hub-glow: rgba(255, 0, 255, 0.4);
}

.theme--cloudatlas {
  --hub-color: #64b5f6;
  --hub-glow: rgba(100, 181, 246, 0.4);
}

.theme--jupiter {
  --hub-color: #ffd700;
  --hub-glow: rgba(255, 215, 0, 0.4);
}

.theme--howard {
  --hub-color: #4caf50;
  --hub-glow: rgba(76, 175, 80, 0.4);
}

.theme--alice {
  --hub-color: #e91e63;
  --hub-glow: rgba(233, 30, 99, 0.4);
}

.theme--asimov {
  --hub-color: #607d8b;
  --hub-glow: rgba(96, 125, 139, 0.4);
}

.theme--ghibli {
  --hub-color: #81c784;
  --hub-glow: rgba(129, 199, 132, 0.4);
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateX(20px);
}

/* Responsive */
@media (max-width: 768px) {
  .back-to-hub {
    bottom: 80px;
    right: 1rem;
    padding: 0.6rem 0.8rem;
  }
  
  .hub-text {
    display: none;
  }
}

/* A11Y */
@media (prefers-reduced-motion: reduce) {
  .hub-icon {
    animation: none;
  }
  
  .back-to-hub {
    transition: none;
  }
}
</style>
