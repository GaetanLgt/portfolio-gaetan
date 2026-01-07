<template>
  <Transition name="loader">
    <div v-if="!loaded" class="loader">
      <div class="loader__content">
        <!-- Logo -->
        <div class="loader__logo">
          <span class="loader__logo-text">GL</span>
          <span class="loader__logo-cursor">_</span>
        </div>
        
        <!-- Boot Logs -->
        <div class="loader__terminal">
          <div 
            v-for="(log, index) in visibleLogs" 
            :key="index"
            class="loader__log"
            :class="{ 
              'loader__log--success': log.status === 'ok',
              'loader__log--loading': log.status === 'loading',
              'loader__log--highlight': log.highlight
            }"
          >
            <span class="loader__log-prefix">[{{ log.time }}]</span>
            <span class="loader__log-text">{{ log.text }}</span>
            <span v-if="log.status === 'ok'" class="loader__log-status">✓</span>
            <span v-else-if="log.status === 'loading'" class="loader__log-status loader__log-status--loading">...</span>
          </div>
        </div>
        
        <!-- Progress Bar -->
        <div class="loader__progress">
          <div class="loader__progress-bar" :style="{ width: progress + '%' }"></div>
        </div>
        <div class="loader__percent">{{ Math.round(progress) }}%</div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';

const emit = defineEmits(['loaded']);

const loaded = ref(false);
const progress = ref(0);
const currentLogIndex = ref(0);

const bootLogs = [
  { time: '00:00', text: 'INIT_KERNEL', status: 'ok' },
  { time: '00:01', text: 'MOUNTING_VOLUMES', status: 'ok' },
  { time: '00:02', text: 'LOADING_SYMFONY_CONTAINER', status: 'ok' },
  { time: '00:03', text: 'INITIALIZING_VUE_RUNTIME', status: 'ok' },
  { time: '00:04', text: 'CONNECTING_THREEJS_RENDERER', status: 'ok' },
  { time: '00:05', text: 'LOADING_ARKADIA_METRICS', status: 'ok' },
  { time: '00:06', text: 'CHECKING_UPTIME_STATUS', status: 'ok' },
  { time: '00:07', text: 'ESTABLISHING_SECURE_CHANNEL', status: 'ok' },
  { time: '00:08', text: 'SYSTEM_READY', status: 'ok', highlight: true },
];

const visibleLogs = computed(() => {
  return bootLogs.slice(0, currentLogIndex.value);
});

onMounted(() => {
  // Failsafe : max 4 secondes
  const failsafe = setTimeout(() => {
    loaded.value = true;
    emit('loaded');
  }, 4000);
  
  // Boot sequence
  let logInterval;
  let progressInterval;
  
  // Injecter les logs un par un
  logInterval = setInterval(() => {
    if (currentLogIndex.value < bootLogs.length) {
      currentLogIndex.value++;
    }
  }, 200);
  
  // Progress bar
  let p = 0;
  progressInterval = setInterval(() => {
    p += Math.random() * 8 + 3;
    if (p >= 100) {
      p = 100;
      progress.value = p;
      clearInterval(progressInterval);
      clearInterval(logInterval);
      clearTimeout(failsafe);
      
      // Afficher tous les logs restants
      currentLogIndex.value = bootLogs.length;
      
      setTimeout(() => {
        loaded.value = true;
        emit('loaded');
      }, 600);
    } else {
      progress.value = p;
    }
  }, 150);
});
</script>

<style scoped>
.loader {
  position: fixed;
  inset: 0;
  background: var(--bg);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
}

.loader__content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  width: 100%;
  max-width: 400px;
  padding: 0 var(--space-md);
}

/* Logo */
.loader__logo {
  display: flex;
  align-items: center;
  font-family: 'JetBrains Mono', monospace;
  font-size: 2rem;
  font-weight: 700;
}

.loader__logo-text {
  color: var(--primary);
}

.loader__logo-cursor {
  color: var(--primary);
  animation: blink 0.8s infinite;
}

/* Terminal */
.loader__terminal {
  width: 100%;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 0.5rem;
  padding: 1rem;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.65rem;
  max-height: 200px;
  overflow: hidden;
}

.loader__log {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0;
  color: var(--text-muted);
  opacity: 0;
  animation: logAppear 0.3s ease forwards;
}

@keyframes logAppear {
  from {
    opacity: 0;
    transform: translateY(-5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.loader__log-prefix {
  color: var(--text-dark);
}

.loader__log-text {
  flex-grow: 1;
}

.loader__log--success .loader__log-text {
  color: var(--text-muted);
}

.loader__log--highlight .loader__log-text {
  color: var(--primary);
  font-weight: 600;
}

.loader__log-status {
  color: var(--primary);
}

.loader__log-status--loading {
  animation: pulse-slow 1s infinite;
}

/* Progress */
.loader__progress {
  width: 100%;
  height: 2px;
  background: var(--surface-light);
  border-radius: 1px;
  overflow: hidden;
}

.loader__progress-bar {
  height: 100%;
  background: var(--primary);
  transition: width 0.15s ease-out;
  box-shadow: 0 0 10px var(--primary-glow);
}

.loader__percent {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.6rem;
  color: var(--text-dark);
}

/* Transition */
.loader-enter-active,
.loader-leave-active {
  transition: opacity 0.6s ease, transform 0.6s ease;
}

.loader-leave-to {
  opacity: 0;
  transform: scale(1.05);
}

@keyframes blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}
</style>
