<template>
  <Transition name="slide-up">
    <div v-if="showUpdatePrompt" class="pwa-update-prompt">
      <div class="pwa-update-content">
        <span class="pwa-update-icon">🔄</span>
        <div class="pwa-update-text">
          <strong>Mise à jour disponible</strong>
          <p>Une nouvelle version du site est prête.</p>
        </div>
        <button @click="updateApp" class="pwa-update-btn">
          Mettre à jour
        </button>
        <button @click="dismissUpdate" class="pwa-update-close" aria-label="Fermer">
          ✕
        </button>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const showUpdatePrompt = ref(false);

const handleUpdateAvailable = () => {
  showUpdatePrompt.value = true;
};

const updateApp = () => {
  // Tell SW to skip waiting
  if (navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({ type: 'SKIP_WAITING' });
  }
  // Reload the page
  window.location.reload();
};

const dismissUpdate = () => {
  showUpdatePrompt.value = false;
};

onMounted(() => {
  window.addEventListener('sw:update-available', handleUpdateAvailable);
});

onUnmounted(() => {
  window.removeEventListener('sw:update-available', handleUpdateAvailable);
});
</script>

<style scoped>
.pwa-update-prompt {
  position: fixed;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 9999;
  max-width: 400px;
  width: calc(100% - 2rem);
}

.pwa-update-content {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.25rem;
  background: rgba(15, 15, 15, 0.95);
  backdrop-filter: blur(12px);
  border: 1px solid var(--primary);
  border-radius: 0.75rem;
  box-shadow: 0 10px 40px rgba(16, 185, 129, 0.2);
}

.pwa-update-icon {
  font-size: 1.5rem;
  flex-shrink: 0;
}

.pwa-update-text {
  flex: 1;
}

.pwa-update-text strong {
  display: block;
  font-size: 0.875rem;
  color: var(--text-main);
  margin-bottom: 0.125rem;
}

.pwa-update-text p {
  font-size: 0.75rem;
  color: var(--text-muted);
  margin: 0;
}

.pwa-update-btn {
  padding: 0.5rem 1rem;
  background: var(--primary);
  color: var(--bg);
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.7rem;
  font-weight: 700;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.pwa-update-btn:hover {
  background: var(--text-main);
}

.pwa-update-close {
  padding: 0.25rem;
  background: transparent;
  color: var(--text-muted);
  font-size: 1rem;
  border: none;
  cursor: pointer;
  transition: color 0.2s ease;
}

.pwa-update-close:hover {
  color: var(--text-main);
}

/* Animation */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(20px);
}
</style>
