<template>
  <header class="feed-header">
    <div class="header-left">
      <div class="logo-cluster">
        <div class="logo-ring">
          <svg viewBox="0 0 100 100" class="ring-svg">
            <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" stroke-width="1" stroke-dasharray="8 4" />
            <circle cx="50" cy="50" r="38" fill="none" stroke="currentColor" stroke-width="0.5" opacity="0.5" />
          </svg>
          <span class="logo-icon">📡</span>
        </div>
        <div class="logo-text">
          <h1 class="glitch-text" data-text="NEURAL FEED">NEURAL FEED</h1>
          <div class="logo-sub">
            <span class="typing-text">{{ typingText }}</span>
            <span class="cursor">▊</span>
          </div>
        </div>
      </div>
    </div>
    
    <div class="header-right">
      <div class="live-stats">
        <div class="stat-pill">
          <span class="stat-dot"></span>
          <span>{{ signalCount }} SIGNALS</span>
        </div>
        <div class="stat-pill accent">
          <span>{{ currentTime }}</span>
        </div>
      </div>
      <button class="close-btn" @click="$emit('close')" aria-label="Fermer">
        <span class="close-x">✕</span>
        <span class="close-label">ESC</span>
      </button>
    </div>
  </header>
</template>

<script setup>
defineProps({
  currentTime: String,
  typingText: String,
  signalCount: Number
});

defineEmits(['close']);
</script>

<style scoped>
.feed-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem 2rem;
  border-bottom: 1px solid rgba(0, 255, 136, 0.15);
  background: rgba(0, 0, 0, 0.3);
  flex-shrink: 0;
}

.logo-cluster {
  display: flex;
  align-items: center;
  gap: 1.25rem;
}

.logo-ring {
  position: relative;
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ring-svg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  color: #00ff88;
  animation: ringRotate 20s linear infinite;
}

@keyframes ringRotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.logo-icon {
  font-size: 1.75rem;
  z-index: 1;
  filter: drop-shadow(0 0 8px #00ff88);
}

.logo-text h1 {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  margin: 0;
  background: linear-gradient(135deg, #00ff88, #00ffff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.logo-sub {
  display: flex;
  align-items: center;
  font-size: 0.7rem;
  color: rgba(0, 255, 136, 0.35);
  margin-top: 0.25rem;
}

.cursor {
  animation: blink 1s step-end infinite;
  color: #00ff88;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

.header-right {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.live-stats {
  display: flex;
  gap: 0.75rem;
}

.stat-pill {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.4rem 0.8rem;
  background: rgba(0, 255, 136, 0.05);
  border: 1px solid rgba(0, 255, 136, 0.2);
  border-radius: 20px;
  font-size: 0.65rem;
  letter-spacing: 0.05em;
}

.stat-dot {
  width: 6px;
  height: 6px;
  background: #00ff88;
  border-radius: 50%;
  animation: pulse 2s ease-in-out infinite;
  box-shadow: 0 0 8px #00ff88;
}

@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(0.8); }
}

.stat-pill.accent {
  background: rgba(0, 255, 255, 0.05);
  border-color: rgba(0, 255, 255, 0.2);
  color: #00ffff;
  font-family: 'JetBrains Mono', monospace;
}

.close-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.2rem;
  padding: 0.6rem 0.8rem;
  background: rgba(255, 0, 0, 0.05);
  border: 1px solid rgba(255, 100, 100, 0.3);
  border-radius: 10px;
  color: #ff6666;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.close-btn:hover {
  background: rgba(255, 0, 0, 0.15);
  border-color: #ff6666;
  transform: scale(1.05);
}

.close-x {
  font-size: 1.1rem;
  font-weight: bold;
}

.close-label {
  font-size: 0.5rem;
  letter-spacing: 0.1em;
  opacity: 0.7;
}

@media (max-width: 900px) {
  .feed-header {
    flex-direction: column;
    gap: 1rem;
    padding: 1rem 1.5rem;
  }
  
  .header-left, .header-right {
    width: 100%;
    justify-content: space-between;
  }
}

@media (max-width: 600px) {
  .logo-cluster {
    gap: 0.75rem;
  }
  
  .logo-ring {
    width: 44px;
    height: 44px;
  }
  
  .logo-text h1 {
    font-size: 1.1rem;
  }
  
  .live-stats {
    display: none;
  }
}
</style>
