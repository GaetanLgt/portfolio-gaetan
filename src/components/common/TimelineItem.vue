<template>
  <div 
    class="timeline-item" 
    :class="{ 'timeline-item--active': isVisible }"
    ref="timelineRef"
  >
    <div class="timeline-item__marker">
      <span class="timeline-item__year">{{ year }}</span>
    </div>
    
    <div class="timeline-item__content">
      <h3 class="timeline-item__title">{{ title }}</h3>
      <p class="timeline-item__subtitle">{{ subtitle }}</p>
      
      <div class="timeline-item__body">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const props = defineProps({
  year: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  subtitle: String,
  isLast: {
    type: Boolean,
    default: false
  }
});

const timelineRef = ref(null);
const isVisible = ref(false);

let observer;

onMounted(() => {
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          isVisible.value = true;
        }
      });
    },
    { threshold: 0.3 }
  );
  
  if (timelineRef.value) {
    observer.observe(timelineRef.value);
  }
});

onUnmounted(() => {
  if (observer && timelineRef.value) {
    observer.unobserve(timelineRef.value);
  }
});
</script>

<style scoped>
.timeline-item {
  position: relative;
  padding-left: 5rem;
  margin-bottom: var(--space-xl);
  opacity: 0;
  transform: translateX(-30px);
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.timeline-item--active {
  opacity: 1;
  transform: translateX(0);
}

.timeline-item__marker {
  position: absolute;
  left: 0;
  top: 0;
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 50%;
  background: var(--code-darker);
  border: 3px solid var(--matrix-green);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 20px rgba(0, 255, 65, 0.3);
  z-index: 2;
}

.timeline-item__year {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.875rem;
  font-weight: 700;
  color: var(--matrix-green);
}

.timeline-item__marker::before {
  content: '';
  position: absolute;
  left: 50%;
  top: 100%;
  width: 2px;
  height: 200px;
  background: linear-gradient(
    to bottom,
    var(--matrix-green),
    transparent
  );
  transform: translateX(-50%);
}

.timeline-item:last-child .timeline-item__marker::before {
  display: none;
}

.timeline-item__content {
  background: var(--card-bg);
  border: 1px solid var(--border-subtle);
  border-radius: 12px;
  padding: var(--space-md);
  backdrop-filter: blur(10px);
}

.timeline-item__title {
  font-size: 1.75rem;
  margin-bottom: var(--space-xs);
  color: var(--text-primary);
}

.timeline-item__subtitle {
  font-size: 1rem;
  color: var(--ark-blue);
  margin-bottom: var(--space-md);
  font-weight: 600;
}

.timeline-item__body {
  color: var(--text-secondary);
  line-height: 1.8;
}
</style>
