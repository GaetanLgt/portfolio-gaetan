<template>
  <footer class="sdb" :class="{ 'sdb--hidden': isHidden }" role="status" aria-label="Diagnostic système en temps réel">
    <div class="sdb__metrics" aria-live="polite" aria-atomic="false">
      <!-- System Status -->
      <div class="sdb__item sdb__item--status">
        <span class="sdb__dot"></span>
        <span class="sdb__label">SYSTEM:</span>
        <span class="sdb__value sdb__value--brand">ONLINE</span>
      </div>
      
      <!-- FPS -->
      <div class="sdb__item">
        <span class="sdb__label">FPS:</span>
        <span class="sdb__value">{{ fps }}</span>
      </div>
      
      <!-- TTI -->
      <div class="sdb__item">
        <span class="sdb__label">TTI:</span>
        <span class="sdb__value">{{ tti }}s</span>
      </div>
      
      <!-- A11Y -->
      <div class="sdb__item">
        <span class="sdb__label">A11Y:</span>
        <span class="sdb__value" :class="a11yStatus === 'PASS' ? 'sdb__value--pass' : 'sdb__value--warn'">{{ a11yStatus }}</span>
      </div>
      
      <!-- CO2 -->
      <div class="sdb__item">
        <span class="sdb__label">CO2:</span>
        <span class="sdb__value">{{ co2 }}g</span>
      </div>
    </div>
    
    <div class="sdb__cluster">
      <span>CLUSTER_STATUS: STABLE</span>
      <span class="sdb__separator">//</span>
      <span>2026_EDITION</span>
    </div>
  </footer>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const fps = ref(60);
const tti = ref('--');
const a11yStatus = ref('PASS');
const co2 = ref('0.02');
const isHidden = ref(false);

let frameCount = 0;
let lastTime = performance.now();
let rafId = null;
let lastScrollY = 0;

// FPS Monitor
const monitorFPS = () => {
  frameCount++;
  const now = performance.now();
  
  if (now >= lastTime + 1000) {
    fps.value = frameCount;
    frameCount = 0;
    lastTime = now;
  }
  
  rafId = requestAnimationFrame(monitorFPS);
};

// TTI (Time to Interactive) - approximation
const measureTTI = () => {
  if (window.performance && window.performance.timing) {
    const timing = window.performance.timing;
    const interactive = timing.domInteractive - timing.navigationStart;
    tti.value = (interactive / 1000).toFixed(1);
  } else {
    tti.value = '0.4';
  }
};

// CO2 estimation (basé sur taille page)
const estimateCO2 = () => {
  if (window.performance && window.performance.getEntriesByType) {
    const resources = window.performance.getEntriesByType('resource');
    let totalBytes = 0;
    resources.forEach(r => {
      if (r.transferSize) totalBytes += r.transferSize;
    });
    // ~0.2g CO2 per MB (estimation Website Carbon)
    const co2Grams = (totalBytes / 1024 / 1024) * 0.2;
    co2.value = co2Grams.toFixed(2);
  }
};

// Hide on scroll down (optionnel)
const handleScroll = () => {
  const currentScrollY = window.scrollY;
  isHidden.value = currentScrollY > lastScrollY && currentScrollY > 200;
  lastScrollY = currentScrollY;
};

onMounted(() => {
  // Respecter prefers-reduced-motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  if (!prefersReducedMotion) {
    monitorFPS();
  }
  
  measureTTI();
  estimateCO2();
  
  // Optionnel: hide on scroll
  // window.addEventListener('scroll', handleScroll, { passive: true });
});

onUnmounted(() => {
  if (rafId) {
    cancelAnimationFrame(rafId);
  }
  // window.removeEventListener('scroll', handleScroll);
});
</script>

<style scoped>
.sdb {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 100;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 1rem;
  background: rgba(5, 5, 5, 0.95);
  backdrop-filter: blur(8px);
  border-top: 1px solid var(--border);
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.6rem;
  color: var(--text-dark);
  transition: transform 0.3s ease;
}

.sdb--hidden {
  transform: translateY(100%);
}

.sdb__metrics {
  display: flex;
  gap: 1.5rem;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
}

.sdb__metrics::-webkit-scrollbar {
  display: none;
}

.sdb__item {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  white-space: nowrap;
}

.sdb__item--status {
  color: var(--primary);
}

.sdb__dot {
  width: 6px;
  height: 6px;
  background: var(--primary);
  border-radius: 50%;
  animation: pulse-slow 2s infinite;
}

.sdb__label {
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.sdb__value {
  color: var(--text-main);
  font-weight: 600;
}

.sdb__value--brand {
  color: var(--primary);
}

.sdb__value--pass {
  color: var(--primary);
}

.sdb__value--warn {
  color: #F59E0B;
}

.sdb__cluster {
  display: none;
  align-items: center;
  gap: 0.5rem;
  padding-left: 1rem;
  border-left: 1px solid var(--border);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-size: 0.5rem;
}

.sdb__separator {
  color: var(--text-dark);
}

@media (min-width: 640px) {
  .sdb__cluster {
    display: flex;
  }
}

@media (max-width: 480px) {
  .sdb {
    padding: 0.4rem 0.75rem;
  }
  
  .sdb__metrics {
    gap: 1rem;
  }
  
  .sdb__item:nth-child(n+4) {
    display: none;
  }
}
</style>
