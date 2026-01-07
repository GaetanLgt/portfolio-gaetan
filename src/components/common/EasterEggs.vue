<template>
  <div class="easter-eggs">
    <!-- Konami Code Effect -->
    <Transition name="konami">
      <div v-if="showKonamiEffect" class="konami-overlay">
        <div class="konami-content">
          <div class="konami-icon">🎮</div>
          <h2>KONAMI CODE ACTIVÉ !</h2>
          <p>↑↑↓↓←→←→BA</p>
          <div class="konami-reward">
            <span>+300 XP</span>
            <span>Mode Rétro débloqué</span>
          </div>
        </div>
        <div class="konami-particles" aria-hidden="true">
          <span v-for="i in 30" :key="i" class="particle" :style="getParticleStyle(i)">
            {{ ['🎮', '⭐', '🕹️', '💎', '🏆'][i % 5] }}
          </span>
        </div>
      </div>
    </Transition>
    
    <!-- Matrix Rain Easter Egg -->
    <Transition name="fade">
      <div v-if="showMatrixRain" class="matrix-rain-overlay">
        <canvas ref="matrixCanvas" class="matrix-canvas"></canvas>
        <div class="matrix-message">
          <span class="typing">Wake up, Neo...</span>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue';

const showKonamiEffect = ref(false);
const showMatrixRain = ref(false);
const matrixCanvas = ref(null);

let matrixInterval = null;

// Konami Code Detection
const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];
let konamiIndex = 0;
let konamiTimeout = null;

// Matrix sequence: "matrix" typed
const matrixSequence = ['KeyM', 'KeyA', 'KeyT', 'KeyR', 'KeyI', 'KeyX'];
let matrixIndex = 0;

const handleKeydown = (e) => {
  // Konami code
  if (e.code === konamiCode[konamiIndex]) {
    konamiIndex++;
    
    clearTimeout(konamiTimeout);
    konamiTimeout = setTimeout(() => {
      konamiIndex = 0;
    }, 2000);
    
    if (konamiIndex === konamiCode.length) {
      triggerKonamiCode();
      konamiIndex = 0;
    }
  } else if (e.code !== konamiCode[konamiIndex]) {
    konamiIndex = 0;
  }
  
  // Matrix sequence
  if (e.code === matrixSequence[matrixIndex]) {
    matrixIndex++;
    if (matrixIndex === matrixSequence.length) {
      triggerMatrixRain();
      matrixIndex = 0;
    }
  } else {
    matrixIndex = 0;
  }
};

// Konami Code Effect
const triggerKonamiCode = () => {
  showKonamiEffect.value = true;
  
  // Vibration si supporté
  if (navigator.vibrate) {
    navigator.vibrate([100, 50, 100, 50, 200]);
  }
  
  // Confetti celebration
  window.dispatchEvent(new CustomEvent('confetti', { detail: { preset: 'legendary' } }));
  
  // Toast
  window.dispatchEvent(new CustomEvent('toast', {
    detail: {
      type: 'achievement',
      title: 'KONAMI CODE !',
      message: '+300 XP - Mode Arcade débloqué',
      duration: 5000
    }
  }));
  
  // Dispatch event pour AchievementsSystem
  window.dispatchEvent(new CustomEvent('easter-egg', { detail: { type: 'konami' } }));
  
  setTimeout(() => {
    showKonamiEffect.value = false;
  }, 4000);
};

// Matrix Rain Effect
const triggerMatrixRain = () => {
  showMatrixRain.value = true;
  
  nextTick(() => {
    if (matrixCanvas.value) {
      startMatrixRain();
    }
  });
  
  // Dispatch event
  window.dispatchEvent(new CustomEvent('easter-egg', { detail: { type: 'matrix' } }));
  
  setTimeout(() => {
    showMatrixRain.value = false;
    stopMatrixRain();
  }, 5000);
};

// Matrix Rain Canvas Animation
const startMatrixRain = () => {
  const canvas = matrixCanvas.value;
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  
  const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789';
  const fontSize = 14;
  const columns = canvas.width / fontSize;
  const drops = Array(Math.floor(columns)).fill(1);
  
  const draw = () => {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = '#00ff41';
    ctx.font = fontSize + 'px monospace';
    
    for (let i = 0; i < drops.length; i++) {
      const char = chars[Math.floor(Math.random() * chars.length)];
      ctx.fillText(char, i * fontSize, drops[i] * fontSize);
      
      if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
        drops[i] = 0;
      }
      drops[i]++;
    }
  };
  
  matrixInterval = setInterval(draw, 35);
};

const stopMatrixRain = () => {
  if (matrixInterval) {
    clearInterval(matrixInterval);
    matrixInterval = null;
  }
};

// Particle style generator
const getParticleStyle = (i) => {
  return {
    '--x': Math.random() * 100 + '%',
    '--y': Math.random() * 100 + '%',
    '--delay': Math.random() * 0.5 + 's',
    '--duration': 1 + Math.random() * 2 + 's',
    '--scale': 0.5 + Math.random() * 1.5
  };
};

onMounted(() => {
  document.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown);
  stopMatrixRain();
});
</script>

<style scoped>
/* Konami Overlay */
.konami-overlay {
  position: fixed;
  inset: 0;
  z-index: 99999;
  background: radial-gradient(circle at center, rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0.98));
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.konami-content {
  text-align: center;
  z-index: 2;
  animation: konamiPop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes konamiPop {
  0% { transform: scale(0); opacity: 0; }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); opacity: 1; }
}

.konami-icon {
  font-size: 5rem;
  animation: konamiShake 0.5s ease-in-out infinite;
}

@keyframes konamiShake {
  0%, 100% { transform: rotate(-5deg); }
  50% { transform: rotate(5deg); }
}

.konami-content h2 {
  font-size: 2rem;
  color: #ffd700;
  text-shadow: 0 0 20px #ffd700;
  margin: 1rem 0;
  font-family: 'JetBrains Mono', monospace;
  letter-spacing: 0.1em;
}

.konami-content p {
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.6);
  font-family: 'JetBrains Mono', monospace;
}

.konami-reward {
  margin-top: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.konami-reward span {
  display: inline-block;
  padding: 0.5rem 1rem;
  background: rgba(255, 215, 0, 0.2);
  border: 1px solid #ffd700;
  color: #ffd700;
  font-size: 0.9rem;
  font-family: 'JetBrains Mono', monospace;
}

/* Particles */
.konami-particles {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.particle {
  position: absolute;
  left: var(--x);
  top: var(--y);
  font-size: calc(1.5rem * var(--scale));
  animation: particleFall var(--duration) ease-out var(--delay) forwards;
  opacity: 0;
}

@keyframes particleFall {
  0% {
    opacity: 1;
    transform: translateY(-50px) rotate(0deg);
  }
  100% {
    opacity: 0;
    transform: translateY(100vh) rotate(360deg);
  }
}

/* Matrix Rain */
.matrix-rain-overlay {
  position: fixed;
  inset: 0;
  z-index: 99998;
  background: #000;
}

.matrix-canvas {
  width: 100%;
  height: 100%;
}

.matrix-message {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 2;
}

.typing {
  font-size: 2rem;
  color: #00ff41;
  font-family: 'JetBrains Mono', monospace;
  text-shadow: 0 0 20px #00ff41;
  overflow: hidden;
  white-space: nowrap;
  border-right: 3px solid #00ff41;
  width: 0;
  animation: typing 2s steps(15) forwards, blink 0.5s step-end infinite alternate;
}

@keyframes typing {
  from { width: 0; }
  to { width: 15ch; }
}

@keyframes blink {
  50% { border-color: transparent; }
}

/* Transitions */
.konami-enter-active {
  animation: konamiIn 0.3s ease-out;
}

.konami-leave-active {
  animation: konamiOut 0.5s ease-in;
}

@keyframes konamiIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes konamiOut {
  from { opacity: 1; }
  to { opacity: 0; }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Responsive */
@media (max-width: 768px) {
  .konami-content h2 {
    font-size: 1.5rem;
  }
  
  .typing {
    font-size: 1.2rem;
  }
}

/* A11Y */
@media (prefers-reduced-motion: reduce) {
  .konami-icon,
  .particle,
  .typing {
    animation: none !important;
  }
  
  .typing {
    width: auto;
    border: none;
  }
}
</style>
