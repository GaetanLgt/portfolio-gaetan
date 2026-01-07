<template>
  <Transition name="signal-morph">
    <article 
      class="signal-featured"
      :key="item.id"
      @click="$emit('click')"
    >
      <div class="featured-bg">
        <div class="featured-grid"></div>
        <div class="featured-gradient"></div>
      </div>
      <div class="featured-content">
        <div class="featured-badge">
          <span class="badge-icon">⚡</span>
          <span>SIGNAL PRIORITAIRE</span>
        </div>
        <h2 class="featured-title">{{ item.title }}</h2>
        <p class="featured-desc">{{ item.description }}</p>
        <div class="featured-meta">
          <span class="meta-category">{{ item.category }}</span>
          <span class="meta-source">{{ item.source }}</span>
          <div class="meta-tags">
            <span v-for="tag in item.tags?.slice(0, 3)" :key="tag" class="tag">{{ tag }}</span>
          </div>
        </div>
      </div>
      <div class="featured-icon">{{ item.icon }}</div>
    </article>
  </Transition>
</template>

<script setup>
defineProps({
  item: Object
});

defineEmits(['click']);
</script>

<style scoped>
.signal-featured {
  position: relative;
  margin-bottom: 1.5rem;
  padding: 2rem;
  background: linear-gradient(135deg, rgba(0, 255, 136, 0.08), rgba(0, 255, 255, 0.05));
  border: 1px solid rgba(0, 255, 136, 0.3);
  border-radius: 16px;
  cursor: pointer;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.signal-featured:hover {
  border-color: #00ff88;
  transform: translateY(-4px);
  box-shadow: 0 20px 40px rgba(0, 255, 136, 0.15);
}

.featured-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.featured-grid {
  position: absolute;
  inset: 0;
  background: 
    linear-gradient(90deg, rgba(0, 255, 136, 0.02) 1px, transparent 1px),
    linear-gradient(rgba(0, 255, 136, 0.02) 1px, transparent 1px);
  background-size: 20px 20px;
}

.featured-gradient {
  position: absolute;
  top: 0;
  right: 0;
  width: 50%;
  height: 100%;
  background: radial-gradient(ellipse at right, rgba(0, 255, 136, 0.1), transparent 70%);
}

.featured-content {
  position: relative;
  z-index: 1;
  max-width: 70%;
}

.featured-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.3rem 0.8rem;
  background: rgba(0, 255, 136, 0.15);
  border: 1px solid rgba(0, 255, 136, 0.3);
  border-radius: 6px;
  font-size: 0.6rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  margin-bottom: 1rem;
  animation: badgePulse 2s ease-in-out infinite;
}

@keyframes badgePulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(0, 255, 136, 0.4); }
  50% { box-shadow: 0 0 0 8px rgba(0, 255, 136, 0); }
}

.featured-title {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1.3;
  margin: 0 0 0.75rem 0;
  background: linear-gradient(135deg, #fff, #00ff88);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.featured-desc {
  font-size: 0.85rem;
  line-height: 1.6;
  color: rgba(0, 255, 136, 0.6);
  margin: 0 0 1rem 0;
}

.featured-meta {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.meta-category {
  padding: 0.25rem 0.6rem;
  background: rgba(0, 255, 255, 0.1);
  border-radius: 4px;
  font-size: 0.6rem;
  color: #00ffff;
  font-weight: 600;
}

.meta-source {
  font-size: 0.65rem;
  color: rgba(0, 255, 136, 0.35);
}

.meta-tags {
  display: flex;
  gap: 0.4rem;
}

.tag {
  padding: 0.2rem 0.5rem;
  background: rgba(0, 255, 136, 0.08);
  border: 1px solid rgba(0, 255, 136, 0.2);
  border-radius: 4px;
  font-size: 0.55rem;
  color: rgba(0, 255, 136, 0.6);
}

.featured-icon {
  position: absolute;
  top: 50%;
  right: 2rem;
  transform: translateY(-50%);
  font-size: 5rem;
  opacity: 0.15;
  filter: blur(1px);
}

/* Transition */
.signal-morph-enter-active,
.signal-morph-leave-active {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.signal-morph-enter-from,
.signal-morph-leave-to {
  opacity: 0;
  transform: translateY(15px);
}

@media (max-width: 900px) {
  .featured-content {
    max-width: 100%;
  }
  
  .featured-icon {
    display: none;
  }
}

@media (max-width: 600px) {
  .signal-featured {
    padding: 1.25rem;
  }
  
  .featured-title {
    font-size: 1.2rem;
  }
}
</style>
