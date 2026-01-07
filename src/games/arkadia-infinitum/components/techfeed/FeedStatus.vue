<template>
  <footer class="feed-status">
    <div class="status-left">
      <span class="status-indicator"></span>
      <span>FEED ACTIF</span>
    </div>
    <div class="status-center">
      <div class="status-stat">
        <span class="stat-num">{{ stats.signals }}</span>
        <span class="stat-label">SIGNAUX</span>
      </div>
      <div class="status-divider"></div>
      <div class="status-stat">
        <span class="stat-num">{{ stats.categories }}</span>
        <span class="stat-label">FLUX</span>
      </div>
      <div class="status-divider"></div>
      <div class="status-stat">
        <span class="stat-num">{{ stats.quotes }}</span>
        <span class="stat-label">SAGESSES</span>
      </div>
    </div>
    <div class="status-right">
      <span class="version">v2.0.26</span>
    </div>
  </footer>
</template>

<script setup>
defineProps({
  stats: Object
});
</script>

<style scoped>
.feed-status {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 2rem;
  background: rgba(0, 0, 0, 0.3);
  border-top: 1px solid rgba(0, 255, 136, 0.1);
  flex-shrink: 0;
}

.status-left {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.6rem;
  color: rgba(0, 255, 136, 0.35);
}

.status-indicator {
  width: 6px;
  height: 6px;
  background: #00ff88;
  border-radius: 50%;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(0.8); }
}

.status-center {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.status-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.15rem;
}

.stat-num {
  font-size: 1rem;
  font-weight: 700;
  color: #00ff88;
}

.stat-label {
  font-size: 0.5rem;
  letter-spacing: 0.1em;
  color: rgba(0, 255, 136, 0.35);
}

.status-divider {
  width: 1px;
  height: 24px;
  background: rgba(0, 255, 136, 0.2);
}

.status-right {
  font-size: 0.55rem;
  color: rgba(0, 255, 136, 0.35);
  letter-spacing: 0.1em;
}

@media (max-width: 600px) {
  .status-center {
    gap: 1rem;
  }
}
</style>
