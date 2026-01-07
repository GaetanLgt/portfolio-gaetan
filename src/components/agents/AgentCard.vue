<template>
  <article 
    class="agent-card" 
    :class="[`agent-card--${variant}`, { 'agent-card--lobby': agent.isLobby }]"
    :style="{ '--agent-color': agent.color, '--agent-rgb': agent.colorRgb }"
  >
    <router-link 
      :to="`/agents/${agent.id}`" 
      class="agent-card__link"
      :aria-label="`Voir le profil de ${agent.name} - ${agent.role}`"
    >
      <!-- Level -->
      <div class="agent-card__level">
        <span class="level-number">{{ formatLevel(agent.level) }}</span>
        <span class="level-name" v-if="agent.codename">{{ agent.codename }}</span>
      </div>
      
      <!-- Avatar -->
      <div class="agent-card__avatar">
        <span class="avatar-emoji">{{ agent.avatar }}</span>
      </div>
      
      <!-- Info -->
      <div class="agent-card__info">
        <h3 class="agent-name">{{ agent.name }}</h3>
        <p class="agent-role">{{ agent.role }}</p>
        <p class="agent-desc" v-if="variant !== 'compact'">{{ agent.description }}</p>
      </div>
      
      <!-- Tools -->
      <div class="agent-card__tools" v-if="agent.tools && variant !== 'compact'">
        <span 
          v-for="tool in agent.tools.slice(0, 4)" 
          :key="tool.name" 
          class="tool-tag"
        >
          {{ tool.name }}
        </span>
      </div>
      
      <!-- Status & Metrics -->
      <div class="agent-card__status">
        <div class="status-badge" :class="`status--${agent.status}`">
          <span class="status-dot"></span>
          <span class="status-label">{{ agent.status === 'active' ? 'ONLINE' : 'OFFLINE' }}</span>
        </div>
        
        <div class="metrics" v-if="agent.metrics">
          <div class="metric" v-if="agent.metrics.tasksPerDay">
            <span class="metric-value">{{ agent.metrics.tasksPerDay }}</span>
            <span class="metric-label">Tasks/jour</span>
          </div>
          <div class="metric" v-if="agent.metrics.uptime">
            <span class="metric-value">{{ agent.metrics.uptime }}</span>
            <span class="metric-label">Uptime</span>
          </div>
        </div>
      </div>
      
      <!-- Arrow -->
      <div class="agent-card__arrow">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
        </svg>
      </div>
    </router-link>
  </article>
</template>

<script setup>
const props = defineProps({
  agent: {
    type: Object,
    required: true
  },
  variant: {
    type: String,
    default: 'default' // default, devlab, compact
  }
});

const formatLevel = (level) => {
  if (level === 'Penthouse') return '🏠';
  if (typeof level === 'string' && level.startsWith('SS-')) return level;
  if (level === 'Back Office') return '💼';
  if (level === 'Creative Studio') return '🎨';
  if (level === 'Marketing Hub') return '📈';
  return level;
};
</script>

<style scoped>
.agent-card {
  border-radius: 1rem;
  border: 1px solid var(--border);
  background: rgba(255, 255, 255, 0.02);
  transition: all 0.3s ease;
  overflow: hidden;
}

.agent-card:hover {
  border-color: var(--agent-color);
  background: rgba(var(--agent-rgb), 0.05);
  transform: translateX(4px);
}

.agent-card__link {
  display: grid;
  grid-template-columns: 80px 70px 1fr auto auto auto;
  align-items: center;
  gap: 1.5rem;
  padding: 1.25rem 1.5rem;
  text-decoration: none;
  color: inherit;
}

.agent-card__link:focus-visible {
  outline: 2px solid var(--agent-color);
  outline-offset: -2px;
}

/* Level */
.agent-card__level {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
}

.level-number {
  font-family: 'JetBrains Mono', monospace;
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--agent-color);
}

.level-name {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.55rem;
  color: var(--text-muted);
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

/* Avatar */
.agent-card__avatar {
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(var(--agent-rgb), 0.1);
  border: 2px solid var(--agent-color);
  border-radius: 50%;
  transition: all 0.3s ease;
}

.agent-card:hover .agent-card__avatar {
  transform: scale(1.1);
  box-shadow: 0 0 20px rgba(var(--agent-rgb), 0.3);
}

.avatar-emoji {
  font-size: 1.75rem;
}

/* Info */
.agent-card__info {
  min-width: 0;
}

.agent-name {
  font-size: 1.1rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
  color: var(--agent-color);
}

.agent-role {
  font-size: 0.85rem;
  color: var(--text-main);
  margin-bottom: 0.5rem;
}

.agent-desc {
  font-size: 0.8rem;
  color: var(--text-muted);
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Tools */
.agent-card__tools {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  max-width: 200px;
}

.tool-tag {
  padding: 0.25rem 0.5rem;
  background: rgba(var(--agent-rgb), 0.1);
  border: 1px solid rgba(var(--agent-rgb), 0.3);
  border-radius: 4px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.65rem;
  color: var(--agent-color);
}

/* Status & Metrics */
.agent-card__status {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.5rem;
  min-width: 120px;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0.75rem;
  border-radius: 2rem;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.65rem;
  letter-spacing: 0.05em;
}

.status--active {
  background: rgba(16, 185, 129, 0.1);
  color: #10B981;
}

.status--active .status-dot {
  background: #10B981;
  box-shadow: 0 0 8px #10B981;
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.metrics {
  display: flex;
  gap: 1rem;
}

.metric {
  text-align: right;
}

.metric-value {
  display: block;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-main);
}

.metric-label {
  font-size: 0.6rem;
  color: var(--text-muted);
}

/* Arrow */
.agent-card__arrow {
  color: var(--text-muted);
  transition: all 0.3s ease;
}

.agent-card:hover .agent-card__arrow {
  color: var(--agent-color);
  transform: translateX(4px);
}

/* ============================================
   VARIANT: DevLab
   ============================================ */
.agent-card--devlab {
  background: rgba(20, 184, 166, 0.02);
}

.agent-card--devlab .level-number {
  font-size: 0.9rem;
  padding: 0.25rem 0.5rem;
  background: rgba(var(--agent-rgb), 0.1);
  border-radius: 4px;
}

/* ============================================
   VARIANT: Compact
   ============================================ */
.agent-card--compact .agent-card__link {
  grid-template-columns: 60px 50px 1fr auto auto;
  padding: 1rem 1.25rem;
}

.agent-card--compact .agent-card__avatar {
  width: 45px;
  height: 45px;
}

.agent-card--compact .avatar-emoji {
  font-size: 1.25rem;
}

.agent-card--compact .agent-name {
  font-size: 0.95rem;
}

.agent-card--compact .agent-role {
  font-size: 0.8rem;
  margin-bottom: 0;
}

/* ============================================
   RESPONSIVE
   ============================================ */
@media (max-width: 1024px) {
  .agent-card__link {
    grid-template-columns: 60px 60px 1fr auto;
  }
  
  .agent-card__tools {
    display: none;
  }
}

@media (max-width: 768px) {
  .agent-card__link {
    grid-template-columns: 1fr;
    gap: 1rem;
    text-align: center;
  }
  
  .agent-card__level {
    flex-direction: row;
    justify-content: center;
  }
  
  .agent-card__avatar {
    margin: 0 auto;
  }
  
  .agent-card__status {
    align-items: center;
  }
  
  .metrics {
    justify-content: center;
  }
  
  .metric {
    text-align: center;
  }
  
  .agent-card__arrow {
    display: none;
  }
}

/* Reduced Motion */
@media (prefers-reduced-motion: reduce) {
  .status-dot {
    animation: none;
  }
}
</style>
