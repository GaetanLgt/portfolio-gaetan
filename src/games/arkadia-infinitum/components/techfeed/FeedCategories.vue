<template>
  <nav class="category-orbit">
    <button 
      v-for="(tab, index) in tabs" 
      :key="tab.id"
      class="orbit-node"
      :class="{ active: activeTab === tab.id, featured: tab.featured }"
      :style="{ '--delay': `${index * 0.05}s`, '--hue': tab.hue }"
      @click="$emit('select', tab.id)"
    >
      <span class="node-icon">{{ tab.icon }}</span>
      <span class="node-label">{{ tab.name }}</span>
      <span class="node-count" v-if="getCount(tab.id) > 0">{{ getCount(tab.id) }}</span>
      <div class="node-glow"></div>
    </button>
  </nav>
</template>

<script setup>
defineProps({
  tabs: Array,
  activeTab: String,
  getCount: Function
});

defineEmits(['select']);
</script>

<style scoped>
.category-orbit {
  display: flex;
  gap: 0.5rem;
  padding: 1rem 2rem;
  overflow-x: auto;
  scrollbar-width: none;
  border-bottom: 1px solid rgba(0, 255, 136, 0.1);
  background: rgba(0, 0, 0, 0.2);
  flex-shrink: 0;
}

.category-orbit::-webkit-scrollbar {
  display: none;
}

.orbit-node {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1rem;
  background: rgba(0, 255, 136, 0.03);
  border: 1px solid rgba(0, 255, 136, 0.15);
  border-radius: 10px;
  color: rgba(0, 255, 136, 0.6);
  font-size: 0.7rem;
  font-weight: 500;
  white-space: nowrap;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  animation: nodeAppear 0.5s ease backwards;
  animation-delay: var(--delay);
  overflow: hidden;
}

@keyframes nodeAppear {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
}

.orbit-node:hover {
  background: rgba(0, 255, 136, 0.08);
  border-color: rgba(0, 255, 136, 0.4);
  color: #00ff88;
  transform: translateY(-2px);
}

.orbit-node.active {
  background: rgba(0, 255, 136, 0.15);
  border-color: #00ff88;
  color: #00ff88;
  box-shadow: 0 0 20px rgba(0, 255, 136, 0.2);
}

.orbit-node.featured {
  border-color: #00ffff;
}

.orbit-node.featured.active {
  border-color: #00ffff;
  box-shadow: 0 0 20px rgba(0, 255, 255, 0.2);
}

.node-icon {
  font-size: 1rem;
}

.node-label {
  letter-spacing: 0.03em;
}

.node-count {
  padding: 0.15rem 0.4rem;
  background: rgba(0, 255, 136, 0.2);
  border-radius: 6px;
  font-size: 0.55rem;
  font-weight: 700;
}

.node-glow {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at center, hsla(var(--hue), 100%, 50%, 0.1), transparent 70%);
  opacity: 0;
  transition: opacity 0.3s;
}

.orbit-node:hover .node-glow,
.orbit-node.active .node-glow {
  opacity: 1;
}
</style>
