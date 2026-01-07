<template>
  <Transition name="toast">
    <div 
      v-if="showToast" 
      class="universe-toast"
      :class="'theme--' + currentTheme"
      role="status"
      aria-live="polite"
    >
      <div class="toast-icon">{{ universeData?.icon || '🌀' }}</div>
      <div class="toast-content">
        <span class="toast-label">Univers découvert</span>
        <span class="toast-name">{{ universeData?.name || 'Inconnu' }}</span>
      </div>
      <div class="toast-progress">
        <span class="progress-text">{{ visitedCount }}/{{ totalUniverses }}</span>
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: progressPercent + '%' }"></div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const showToast = ref(false);
const visitedUniverses = ref(new Set());

// Configuration des univers
const universes = {
  '/matrix': { name: 'The Matrix', icon: '💊', theme: 'matrix' },
  '/matrix-resurrections': { name: 'Matrix Resurrections', icon: '🔄', theme: 'matrix' },
  '/tron': { name: 'TRON Legacy', icon: '🏍️', theme: 'tron' },
  '/blade-runner': { name: 'Blade Runner', icon: '🌧️', theme: 'bladerunner' },
  '/inception': { name: 'Inception', icon: '🎯', theme: 'inception' },
  '/ghost-in-the-shell': { name: 'Ghost in the Shell', icon: '👻', theme: 'ghost' },
  '/minority-report': { name: 'Minority Report', icon: '👁️', theme: 'minority' },
  '/iron-man': { name: 'Iron Man', icon: '🦾', theme: 'ironman' },
  '/dragon-ball-z': { name: 'Dragon Ball Z', icon: '🔮', theme: 'dbz' },
  '/deadpool': { name: 'Deadpool', icon: '💀', theme: 'deadpool' },
  '/the-mask': { name: 'The Mask', icon: '🎭', theme: 'mask' },
  '/v-for-vendetta': { name: 'V for Vendetta', icon: '🎭', theme: 'vendetta' },
  '/ready-player-one': { name: 'Ready Player One', icon: '🎮', theme: 'oasis' },
  '/cloud-atlas': { name: 'Cloud Atlas', icon: '☁️', theme: 'cloudatlas' },
  '/jupiter-ascending': { name: 'Jupiter Ascending', icon: '👑', theme: 'jupiter' },
  '/howard-the-duck': { name: 'Howard the Duck', icon: '🦆', theme: 'howard' },
  '/alice-turing': { name: 'Alice au Pays de Turing', icon: '🐰', theme: 'alice' },
  '/asimov': { name: 'Les Lois de la Robotique', icon: '🤖', theme: 'asimov' },
  '/mecha-mascot': { name: 'GL Spirit', icon: '✨', theme: 'ghibli' },
  '/jardin-de-mam': { name: 'Le Jardin de Mam\'', icon: '🌸', theme: 'ghibli' }
};

const totalUniverses = Object.keys(universes).length;

const universeData = computed(() => {
  return universes[route.path] || null;
});

const currentTheme = computed(() => {
  return universeData.value?.theme || 'default';
});

const visitedCount = computed(() => visitedUniverses.value.size);

const progressPercent = computed(() => {
  return (visitedCount.value / totalUniverses) * 100;
});

// Charger depuis localStorage
const loadProgress = () => {
  try {
    const saved = localStorage.getItem('gl-multivers-visited');
    if (saved) {
      visitedUniverses.value = new Set(JSON.parse(saved));
    }
  } catch (e) {
    console.warn('Could not load multivers progress');
  }
};

// Sauvegarder dans localStorage
const saveProgress = () => {
  try {
    localStorage.setItem('gl-multivers-visited', JSON.stringify([...visitedUniverses.value]));
  } catch (e) {
    console.warn('Could not save multivers progress');
  }
};

// Marquer un univers comme visité
const markVisited = (path) => {
  if (universes[path] && !visitedUniverses.value.has(path)) {
    visitedUniverses.value.add(path);
    saveProgress();
    
    // Afficher le toast
    showToast.value = true;
    setTimeout(() => {
      showToast.value = false;
    }, 4000);
  }
};

// Surveiller les changements de route
watch(() => route.path, (newPath) => {
  markVisited(newPath);
}, { immediate: true });

onMounted(() => {
  loadProgress();
  // Vérifier la route actuelle
  if (universes[route.path]) {
    markVisited(route.path);
  }
});
</script>

<style scoped>
.universe-toast {
  --toast-color: var(--primary, #10B981);
  
  position: fixed;
  bottom: 160px;
  right: 1.5rem;
  z-index: 1001;
  
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.25rem;
  
  background: rgba(0, 0, 0, 0.9);
  border: 1px solid var(--toast-color);
  border-radius: 8px;
  
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5), 0 0 30px rgba(16, 185, 129, 0.2);
}

.toast-icon {
  font-size: 1.5rem;
  animation: iconPop 0.3s ease-out;
}

@keyframes iconPop {
  0% { transform: scale(0); }
  50% { transform: scale(1.3); }
  100% { transform: scale(1); }
}

.toast-content {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.toast-label {
  font-size: 0.6rem;
  color: var(--toast-color);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-family: 'JetBrains Mono', monospace;
}

.toast-name {
  font-size: 0.9rem;
  color: #fff;
  font-weight: 600;
}

.toast-progress {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.25rem;
  margin-left: 0.5rem;
  padding-left: 0.75rem;
  border-left: 1px solid rgba(255, 255, 255, 0.1);
}

.progress-text {
  font-size: 0.65rem;
  color: rgba(255, 255, 255, 0.6);
  font-family: 'JetBrains Mono', monospace;
}

.progress-bar {
  width: 60px;
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: var(--toast-color);
  transition: width 0.5s ease;
}

/* Thèmes */
.theme--matrix { --toast-color: #00ff41; }
.theme--tron { --toast-color: #00d4ff; }
.theme--bladerunner { --toast-color: #ff6b2b; }
.theme--inception { --toast-color: #d4af37; }
.theme--ghost { --toast-color: #9d4edd; }
.theme--minority { --toast-color: #4fc3f7; }
.theme--ironman { --toast-color: #ff3d00; }
.theme--dbz { --toast-color: #ff9800; }
.theme--deadpool { --toast-color: #e53935; }
.theme--mask { --toast-color: #76ff03; }
.theme--vendetta { --toast-color: #b71c1c; }
.theme--oasis { --toast-color: #ff00ff; }
.theme--cloudatlas { --toast-color: #64b5f6; }
.theme--jupiter { --toast-color: #ffd700; }
.theme--howard { --toast-color: #4caf50; }
.theme--alice { --toast-color: #e91e63; }
.theme--asimov { --toast-color: #607d8b; }
.theme--ghibli { --toast-color: #81c784; }

/* Transitions */
.toast-enter-active {
  animation: toastIn 0.4s ease-out;
}

.toast-leave-active {
  animation: toastOut 0.3s ease-in;
}

@keyframes toastIn {
  0% {
    opacity: 0;
    transform: translateX(100px) scale(0.8);
  }
  100% {
    opacity: 1;
    transform: translateX(0) scale(1);
  }
}

@keyframes toastOut {
  0% {
    opacity: 1;
    transform: translateX(0);
  }
  100% {
    opacity: 0;
    transform: translateX(50px);
  }
}

/* Responsive */
@media (max-width: 768px) {
  .universe-toast {
    bottom: 140px;
    right: 1rem;
    left: 1rem;
    padding: 0.75rem 1rem;
  }
  
  .toast-progress {
    display: none;
  }
}

/* A11Y */
@media (prefers-reduced-motion: reduce) {
  .toast-icon {
    animation: none;
  }
  
  .toast-enter-active,
  .toast-leave-active {
    animation: none;
    transition: opacity 0.2s;
  }
}
</style>
