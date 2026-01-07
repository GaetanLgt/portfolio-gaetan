<template>
  <footer class="tower-footer">
    <div class="footer-left">
      <span class="footer-brand">
        <span class="brand-icon">◆</span>
        GL TOWER v2.0
      </span>
      <span class="footer-separator">|</span>
      <span class="footer-stat">{{ agentsCount }} Agents</span>
      <span class="footer-separator">|</span>
      <span class="footer-stat footer-stat--live">
        <span class="live-dot"></span>
        Tous systèmes opérationnels
      </span>
    </div>
    
    <div class="footer-right">
      <router-link to="/agents" class="footer-link">
        Voir tous les agents →
      </router-link>
      <router-link to="/contact" class="footer-link footer-link--cta">
        Réserver un audit
      </router-link>
    </div>
  </footer>
</template>

<script setup>
defineProps({
  agentsCount: {
    type: Number,
    default: 15
  }
});
</script>

<style scoped>
.tower-footer {
  position: relative;
  z-index: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: rgba(10, 10, 20, 0.95);
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.footer-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.footer-brand {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.85rem;
  color: #10B981;
}

.brand-icon {
  font-size: 1rem;
}

.footer-separator {
  color: rgba(255, 255, 255, 0.1);
}

.footer-stat {
  font-size: 0.8rem;
  color: #666;
}

.footer-stat--live {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #10B981;
}

.live-dot {
  width: 6px;
  height: 6px;
  background: #10B981;
  border-radius: 50%;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.footer-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.footer-link {
  font-size: 0.85rem;
  color: #888;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  transition: all 0.3s ease;
}

.footer-link:hover {
  color: #10B981;
  background: rgba(16, 185, 129, 0.1);
}

.footer-link--cta {
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.2);
  color: #10B981;
}

.footer-link--cta:hover {
  background: #10B981;
  color: #000;
}

/* Responsive */
@media (max-width: 768px) {
  .tower-footer {
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
  }
  
  .footer-left {
    flex-wrap: wrap;
    justify-content: center;
  }
  
  .footer-separator:last-of-type,
  .footer-stat--live {
    display: none;
  }
}
</style>
