<template>
  <div class="sound-manager">
    <!-- Toggle Button -->
    <button 
      class="sound-toggle"
      :class="[{ 'sound--on': isEnabled }, 'theme--' + currentTheme]"
      @click="toggleSound"
      :aria-label="isEnabled ? 'Désactiver le son' : 'Activer le son'"
      :aria-pressed="isEnabled"
    >
      <span class="toggle-icon">{{ isEnabled ? '🔊' : '🔇' }}</span>
      <span class="toggle-label">{{ isEnabled ? 'ON' : 'OFF' }}</span>
      <span class="toggle-glow" aria-hidden="true"></span>
    </button>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const isEnabled = ref(false);
const audioContext = ref(null);
const currentAmbient = ref(null);
const gainNode = ref(null);

// Thème actuel
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
  if (path.includes('multivers')) return 'multivers';
  return 'default';
});

// Fréquences et types par thème (synthétisé)
const themeConfigs = {
  default: { baseFreq: 80, type: 'sine', filterFreq: 200 },
  matrix: { baseFreq: 55, type: 'sawtooth', filterFreq: 150 },
  tron: { baseFreq: 110, type: 'square', filterFreq: 300 },
  bladerunner: { baseFreq: 65, type: 'triangle', filterFreq: 180 },
  inception: { baseFreq: 73, type: 'sine', filterFreq: 250 },
  ghost: { baseFreq: 82, type: 'sine', filterFreq: 220 },
  minority: { baseFreq: 98, type: 'triangle', filterFreq: 280 },
  ironman: { baseFreq: 87, type: 'sawtooth', filterFreq: 350 },
  dbz: { baseFreq: 130, type: 'sawtooth', filterFreq: 400 },
  deadpool: { baseFreq: 100, type: 'square', filterFreq: 320 },
  mask: { baseFreq: 146, type: 'square', filterFreq: 500 },
  vendetta: { baseFreq: 62, type: 'triangle', filterFreq: 160 },
  oasis: { baseFreq: 123, type: 'square', filterFreq: 450 },
  multivers: { baseFreq: 92, type: 'sine', filterFreq: 260 }
};

// Initialiser l'audio context
const initAudio = () => {
  if (!audioContext.value) {
    audioContext.value = new (window.AudioContext || window.webkitAudioContext)();
    gainNode.value = audioContext.value.createGain();
    gainNode.value.gain.value = 0;
    gainNode.value.connect(audioContext.value.destination);
  }
};

// Créer un drone ambient synthétisé
const createAmbient = (config) => {
  if (!audioContext.value) return;
  
  // Arrêter l'ambient précédent
  stopAmbient();
  
  const ctx = audioContext.value;
  
  // Oscillateur principal
  const osc1 = ctx.createOscillator();
  osc1.type = config.type;
  osc1.frequency.value = config.baseFreq;
  
  // Oscillateur secondaire (légère désaccordation pour richesse)
  const osc2 = ctx.createOscillator();
  osc2.type = config.type;
  osc2.frequency.value = config.baseFreq * 1.005;
  
  // Oscillateur sub-bass
  const osc3 = ctx.createOscillator();
  osc3.type = 'sine';
  osc3.frequency.value = config.baseFreq / 2;
  
  // Filtre passe-bas
  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = config.filterFreq;
  filter.Q.value = 1;
  
  // Gains individuels
  const gain1 = ctx.createGain();
  const gain2 = ctx.createGain();
  const gain3 = ctx.createGain();
  gain1.gain.value = 0.15;
  gain2.gain.value = 0.1;
  gain3.gain.value = 0.08;
  
  // LFO pour modulation légère
  const lfo = ctx.createOscillator();
  const lfoGain = ctx.createGain();
  lfo.frequency.value = 0.1;
  lfoGain.gain.value = 2;
  lfo.connect(lfoGain);
  lfoGain.connect(osc1.frequency);
  
  // Connexions
  osc1.connect(gain1);
  osc2.connect(gain2);
  osc3.connect(gain3);
  gain1.connect(filter);
  gain2.connect(filter);
  gain3.connect(filter);
  filter.connect(gainNode.value);
  
  // Démarrer
  osc1.start();
  osc2.start();
  osc3.start();
  lfo.start();
  
  currentAmbient.value = { osc1, osc2, osc3, lfo, filter };
  
  // Fade in
  gainNode.value.gain.setTargetAtTime(0.12, ctx.currentTime, 0.5);
};

// Arrêter l'ambient
const stopAmbient = () => {
  if (currentAmbient.value) {
    const { osc1, osc2, osc3, lfo } = currentAmbient.value;
    const ctx = audioContext.value;
    
    // Fade out
    gainNode.value.gain.setTargetAtTime(0, ctx.currentTime, 0.3);
    
    // Stop après fade
    setTimeout(() => {
      try {
        osc1.stop();
        osc2.stop();
        osc3.stop();
        lfo.stop();
      } catch (e) {}
    }, 500);
    
    currentAmbient.value = null;
  }
};

// Toggle sound
const toggleSound = () => {
  initAudio();
  
  if (audioContext.value.state === 'suspended') {
    audioContext.value.resume();
  }
  
  isEnabled.value = !isEnabled.value;
  
  if (isEnabled.value) {
    const config = themeConfigs[currentTheme.value] || themeConfigs.default;
    createAmbient(config);
    localStorage.setItem('gl-sound-enabled', 'true');
  } else {
    stopAmbient();
    localStorage.setItem('gl-sound-enabled', 'false');
  }
};

// Son de hover (click subtil)
const playHoverSound = () => {
  if (!isEnabled.value || !audioContext.value) return;
  
  const ctx = audioContext.value;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  
  osc.type = 'sine';
  osc.frequency.value = 800;
  gain.gain.value = 0.03;
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
  
  osc.connect(gain);
  gain.connect(ctx.destination);
  
  osc.start();
  osc.stop(ctx.currentTime + 0.1);
};

// Son de click
const playClickSound = () => {
  if (!isEnabled.value || !audioContext.value) return;
  
  const ctx = audioContext.value;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  
  osc.type = 'square';
  osc.frequency.value = 150;
  osc.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 0.1);
  gain.gain.value = 0.05;
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
  
  osc.connect(gain);
  gain.connect(ctx.destination);
  
  osc.start();
  osc.stop(ctx.currentTime + 0.15);
};

// Exposer les méthodes pour d'autres composants
defineExpose({
  playHoverSound,
  playClickSound,
  isEnabled
});

// Event listeners pour hover/click globaux
const handleMouseEnter = (e) => {
  if (!e.target || typeof e.target.closest !== 'function') return;
  const target = e.target.closest('a, button, [role="button"], .interactive');
  if (target) playHoverSound();
};

const handleClick = (e) => {
  if (!e.target || typeof e.target.closest !== 'function') return;
  const target = e.target.closest('a, button, [role="button"], .interactive');
  if (target) playClickSound();
};

// Changer l'ambient quand le thème change
watch(currentTheme, (newTheme) => {
  if (isEnabled.value) {
    const config = themeConfigs[newTheme] || themeConfigs.default;
    createAmbient(config);
  }
});

onMounted(() => {
  // Restaurer préférence
  const saved = localStorage.getItem('gl-sound-enabled');
  if (saved === 'true') {
    // Ne pas auto-play (politique navigateurs)
    // L'utilisateur devra recliquer
  }
  
  // Event listeners
  document.addEventListener('mouseenter', handleMouseEnter, true);
  document.addEventListener('click', handleClick, true);
});

onUnmounted(() => {
  stopAmbient();
  document.removeEventListener('mouseenter', handleMouseEnter, true);
  document.removeEventListener('click', handleClick, true);
});
</script>

<style scoped>
.sound-manager {
  position: fixed;
  bottom: 100px;
  left: 1.5rem;
  z-index: 1000;
}

.sound-toggle {
  --sound-color: var(--primary, #10B981);
  
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.5rem 0.75rem;
  
  background: rgba(0, 0, 0, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  
  color: rgba(255, 255, 255, 0.6);
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.65rem;
  
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.sound-toggle:hover {
  border-color: var(--sound-color);
  color: var(--sound-color);
}

.sound-toggle.sound--on {
  border-color: var(--sound-color);
  color: var(--sound-color);
  box-shadow: 0 0 15px rgba(16, 185, 129, 0.3);
}

.toggle-icon {
  font-size: 0.9rem;
}

.toggle-label {
  font-weight: 600;
  letter-spacing: 0.05em;
}

.toggle-glow {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 30% 50%, var(--sound-color), transparent 70%);
  opacity: 0;
  transition: opacity 0.3s;
}

.sound--on .toggle-glow {
  opacity: 0.15;
  animation: glowPulse 2s ease-in-out infinite;
}

@keyframes glowPulse {
  0%, 100% { opacity: 0.1; }
  50% { opacity: 0.2; }
}

/* Thèmes */
.theme--matrix { --sound-color: #00ff41; }
.theme--tron { --sound-color: #00d4ff; }
.theme--bladerunner { --sound-color: #ff6b2b; }
.theme--inception { --sound-color: #d4af37; }
.theme--ghost { --sound-color: #9d4edd; }
.theme--minority { --sound-color: #4fc3f7; }
.theme--ironman { --sound-color: #ff3d00; }
.theme--dbz { --sound-color: #ff9800; }
.theme--deadpool { --sound-color: #e53935; }
.theme--mask { --sound-color: #76ff03; }
.theme--vendetta { --sound-color: #b71c1c; }
.theme--oasis { --sound-color: #ff00ff; }
.theme--multivers { --sound-color: #a855f7; }

/* Responsive */
@media (max-width: 768px) {
  .sound-manager {
    bottom: 80px;
    left: 1rem;
  }
  
  .toggle-label {
    display: none;
  }
}

/* A11Y */
@media (prefers-reduced-motion: reduce) {
  .toggle-glow {
    animation: none;
  }
}
</style>
