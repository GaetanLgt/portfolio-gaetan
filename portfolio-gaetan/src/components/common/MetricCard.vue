<template>
  <div class="metric-card" ref="metricRef">
    <div class="metric-card__icon">
      <slot name="icon">{{ icon }}</slot>
    </div>
    
    <div class="metric-card__value">
      {{ displayValue }}{{ suffix }}
    </div>
    
    <div class="metric-card__label">
      {{ label }}
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useCounter } from '@/composables/useCounter';

const props = defineProps({
  value: {
    type: [Number, String],
    required: true
  },
  label: {
    type: String,
    required: true
  },
  suffix: {
    type: String,
    default: ''
  },
  icon: {
    type: String,
    default: '📊'
  },
  duration: {
    type: Number,
    default: 2000
  }
});

const metricRef = ref(null);
const shouldAnimate = ref(false);

const { count } = useCounter(
  computed(() => shouldAnimate.value ? props.value : 0),
  props.duration
);

const displayValue = computed(() => {
  if (typeof props.value === 'string') {
    return props.value;
  }
  return Math.round(count.value).toLocaleString('fr-FR');
});

let observer;

onMounted(() => {
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !shouldAnimate.value) {
          shouldAnimate.value = true;
        }
      });
    },
    { threshold: 0.5 }
  );
  
  if (metricRef.value) {
    observer.observe(metricRef.value);
  }
});

onUnmounted(() => {
  if (observer && metricRef.value) {
    observer.unobserve(metricRef.value);
  }
});
</script>

<style scoped>
.metric-card {
  background: var(--card-bg);
  border: 1px solid var(--border-subtle);
  border-radius: 12px;
  padding: var(--space-md);
  text-align: center;
  backdrop-filter: blur(10px);
  transition: all var(--transition-base);
}

.metric-card:hover {
  transform: translateY(-4px);
  border-color: var(--matrix-green);
  box-shadow: var(--shadow-glow);
}

.metric-card__icon {
  font-size: 2.5rem;
  margin-bottom: var(--space-sm);
}

.metric-card__value {
  font-family: 'JetBrains Mono', monospace;
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--matrix-green);
  margin-bottom: var(--space-xs);
  text-shadow: 0 0 10px rgba(0, 255, 65, 0.3);
}

.metric-card__label {
  font-size: 0.875rem;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.1em;
}
</style>
