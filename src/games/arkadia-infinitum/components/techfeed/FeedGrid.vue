<template>
  <div class="signal-grid">
    <TransitionGroup name="signal-stagger">
      <article 
        v-for="(item, index) in items" 
        :key="item.id"
        class="signal-card"
        :class="[item.type, { 'is-new': item.isNew }]"
        :style="{ '--index': index, '--accent': item.accent || '120' }"
        @click="$emit('click-item', item)"
      >
        <!-- Card Header -->
        <div class="card-header">
          <div class="card-icon-wrap">
            <span class="card-icon">{{ item.icon }}</span>
            <div class="icon-ring"></div>
          </div>
          <div class="card-meta">
            <span class="meta-type">{{ item.category }}</span>
            <span class="meta-date">{{ item.date }}</span>
          </div>
          <div class="card-indicator" v-if="item.isNew">NEW</div>
        </div>

        <!-- Card Body -->
        <div class="card-body">
          <h3 class="card-title">{{ item.title }}</h3>
          <p class="card-desc">{{ item.description }}</p>
        </div>

        <!-- Card Footer -->
        <div class="card-footer">
          <div class="card-tags">
            <span v-for="tag in item.tags?.slice(0, 2)" :key="tag" class="mini-tag">{{ tag }}</span>
          </div>
          <div class="card-source">
            <span class="source-icon">◉</span>
            <span>{{ item.source }}</span>
          </div>
        </div>

        <!-- Hover Effects -->
        <div class="card-glow"></div>
        <div class="card-scan"></div>
      </article>
    </TransitionGroup>
  </div>
</template>

<script setup>
defineProps({
  items: Array
});

defineEmits(['click-item']);
</script>

<style scoped>
.signal-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
}

.signal-card {
  position: relative;
  padding: 1.25rem;
  background: rgba(0, 20, 5, 0.6);
  border: 1px solid rgba(0, 255, 136, 0.12);
  border-radius: 12px;
  cursor: pointer;
  overflow: hidden;
  transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
  animation: cardAppear 0.5s ease backwards;
  animation-delay: calc(var(--index) * 0.05s);
}

@keyframes cardAppear {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
}

.signal-card:hover {
  border-color: hsla(var(--accent), 100%, 50%, 0.5);
  transform: translateY(-6px) scale(1.01);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.3);
}

.signal-card.is-new::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, #00ff88, #00ffff);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
}

.card-icon-wrap {
  position: relative;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-icon {
  font-size: 1.5rem;
  z-index: 1;
}

.icon-ring {
  position: absolute;
  inset: 0;
  border: 1px solid hsla(var(--accent), 100%, 50%, 0.3);
  border-radius: 10px;
  transition: all 0.3s;
}

.signal-card:hover .icon-ring {
  border-color: hsla(var(--accent), 100%, 50%, 0.6);
  transform: scale(1.1) rotate(5deg);
}

.card-meta {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.meta-type {
  font-size: 0.6rem;
  font-weight: 600;
  color: hsla(var(--accent), 100%, 60%, 1);
  letter-spacing: 0.05em;
}

.meta-date {
  font-size: 0.55rem;
  color: rgba(0, 255, 136, 0.35);
}

.card-indicator {
  padding: 0.2rem 0.5rem;
  background: #00ff88;
  border-radius: 4px;
  font-size: 0.5rem;
  font-weight: 700;
  color: #000;
  letter-spacing: 0.1em;
  animation: indicatorPulse 1.5s ease-in-out infinite;
}

@keyframes indicatorPulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

.card-body {
  margin-bottom: 0.75rem;
}

.card-title {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 0.95rem;
  font-weight: 600;
  line-height: 1.4;
  margin: 0 0 0.5rem 0;
  color: #fff;
  transition: color 0.3s;
}

.signal-card:hover .card-title {
  color: hsla(var(--accent), 100%, 70%, 1);
}

.card-desc {
  font-size: 0.75rem;
  line-height: 1.5;
  color: rgba(0, 255, 136, 0.6);
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 0.75rem;
  border-top: 1px solid rgba(0, 255, 136, 0.08);
}

.card-tags {
  display: flex;
  gap: 0.3rem;
}

.mini-tag {
  padding: 0.15rem 0.4rem;
  background: rgba(0, 255, 136, 0.05);
  border-radius: 3px;
  font-size: 0.5rem;
  color: rgba(0, 255, 136, 0.35);
}

.card-source {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.55rem;
  color: rgba(0, 255, 136, 0.35);
}

.source-icon {
  font-size: 0.4rem;
  color: hsla(var(--accent), 100%, 50%, 0.8);
}

/* Card Effects */
.card-glow {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 50% 0%, hsla(var(--accent), 100%, 50%, 0.1), transparent 60%);
  opacity: 0;
  transition: opacity 0.3s;
  pointer-events: none;
}

.signal-card:hover .card-glow {
  opacity: 1;
}

.card-scan {
  position: absolute;
  top: 0;
  left: -100%;
  width: 50%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(0, 255, 136, 0.05), transparent);
  pointer-events: none;
}

.signal-card:hover .card-scan {
  animation: cardScan 0.6s ease;
}

@keyframes cardScan {
  to { left: 150%; }
}

/* Transitions */
.signal-stagger-enter-active {
  transition: all 0.4s ease;
}

.signal-stagger-leave-active {
  transition: all 0.2s ease;
}

.signal-stagger-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.signal-stagger-leave-to {
  opacity: 0;
}

@media (max-width: 900px) {
  .signal-grid {
    grid-template-columns: 1fr;
  }
}
</style>
