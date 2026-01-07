<template>
  <header class="tower-header">
    <router-link to="/" class="header-logo">
      <span class="logo-reactor">
        <span class="reactor-ring"></span>
        <span class="reactor-core">GL</span>
      </span>
      <span class="logo-text">
        <span class="text-main">TOWER</span>
        <span class="text-sub">QG des Agents IA</span>
      </span>
    </router-link>

    <nav class="header-nav" role="navigation" aria-label="Navigation principale">
      <button 
        v-for="view in views" 
        :key="view.id"
        class="nav-btn" 
        :class="{ active: viewMode === view.id }"
        @click="$emit('changeView', view.id)"
        :aria-current="viewMode === view.id ? 'page' : undefined"
      >
        <span class="nav-icon">{{ view.icon }}</span>
        <span class="nav-label">{{ view.label }}</span>
      </button>
    </nav>

    <div class="header-actions">
      <div class="status-indicator">
        <span class="status-dot"></span>
        <span class="status-text">Tous systèmes OK</span>
      </div>
      
      <button 
        class="tour-btn" 
        @click="tourActive ? $emit('stopTour') : $emit('startTour')"
        :class="{ 'tour-btn--stop': tourActive }"
      >
        <span class="tour-icon">{{ tourActive ? '✕' : '🎫' }}</span>
        <span class="tour-text">{{ tourActive ? 'Arrêter' : 'Visite Guidée' }}</span>
      </button>
    </div>
  </header>
</template>

<script setup>
defineProps({
  viewMode: {
    type: String,
    default: 'tower'
  },
  tourActive: {
    type: Boolean,
    default: false
  }
});

defineEmits(['changeView', 'startTour', 'stopTour']);

const views = [
  { id: 'tower', icon: '🏢', label: 'Tour' },
  { id: 'workflow', icon: '🔄', label: 'Workflows' },
  { id: 'production', icon: '🎬', label: 'Production' }
];
</script>

<style scoped>
.tower-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 2rem;
  background: rgba(10, 10, 20, 0.95);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

/* Logo */
.header-logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;
  color: inherit;
}

.logo-reactor {
  position: relative;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.reactor-ring {
  position: absolute;
  inset: 0;
  border: 2px solid rgba(16, 185, 129, 0.3);
  border-radius: 50%;
  animation: reactorSpin 10s linear infinite;
}

.reactor-ring::before {
  content: '';
  position: absolute;
  top: -2px;
  left: 50%;
  transform: translateX(-50%);
  width: 8px;
  height: 8px;
  background: #10B981;
  border-radius: 50%;
  box-shadow: 0 0 10px #10B981;
}

@keyframes reactorSpin {
  to { transform: rotate(360deg); }
}

.reactor-core {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.9rem;
  font-weight: 700;
  color: #10B981;
  text-shadow: 0 0 10px rgba(16, 185, 129, 0.5);
}

.logo-text {
  display: flex;
  flex-direction: column;
}

.text-main {
  font-family: 'JetBrains Mono', monospace;
  font-size: 1.1rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  background: linear-gradient(135deg, #FBBF24, #F59E0B);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.text-sub {
  font-size: 0.6rem;
  color: #666;
  letter-spacing: 0.05em;
}

/* Navigation */
.header-nav {
  display: flex;
  gap: 0.25rem;
  padding: 0.25rem;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 0.75rem;
}

.nav-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1.25rem;
  background: transparent;
  border: none;
  border-radius: 0.5rem;
  color: #666;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.nav-btn:hover {
  color: #fff;
  background: rgba(255, 255, 255, 0.05);
}

.nav-btn.active {
  background: rgba(16, 185, 129, 0.15);
  color: #10B981;
}

.nav-icon {
  font-size: 1rem;
}

.nav-label {
  font-weight: 500;
}

/* Actions */
.header-actions {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.status-indicator {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.4rem 0.75rem;
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.2);
  border-radius: 2rem;
}

.status-dot {
  width: 8px;
  height: 8px;
  background: #10B981;
  border-radius: 50%;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.6; transform: scale(1.1); }
}

.status-text {
  font-size: 0.7rem;
  color: #10B981;
  font-family: 'JetBrains Mono', monospace;
}

.tour-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1.25rem;
  background: linear-gradient(135deg, #10B981, #059669);
  border: none;
  border-radius: 0.5rem;
  color: #000;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.tour-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(16, 185, 129, 0.3);
}

.tour-btn--stop {
  background: linear-gradient(135deg, #EF4444, #DC2626);
}

.tour-btn--stop:hover {
  box-shadow: 0 10px 25px rgba(239, 68, 68, 0.3);
}

.tour-icon {
  font-size: 1rem;
}

/* Responsive */
@media (max-width: 900px) {
  .tower-header {
    padding: 0.75rem 1rem;
  }
  
  .nav-label {
    display: none;
  }
  
  .nav-btn {
    padding: 0.6rem 0.8rem;
  }
  
  .status-indicator {
    display: none;
  }
  
  .tour-text {
    display: none;
  }
  
  .logo-text {
    display: none;
  }
}
</style>
