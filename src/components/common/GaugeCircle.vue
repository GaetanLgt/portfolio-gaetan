<template>
  <div class="gauge" :style="{ width: size + 'px', height: size + 'px' }">
    <svg class="gauge__svg" :viewBox="`0 0 ${viewBox} ${viewBox}`">
      <!-- Track -->
      <circle 
        class="gauge__track"
        :cx="center" 
        :cy="center" 
        :r="radius"
        fill="none"
        :stroke-width="strokeWidth"
      />
      <!-- Progress -->
      <circle 
        ref="progressRef"
        class="gauge__progress"
        :cx="center" 
        :cy="center" 
        :r="radius"
        fill="none"
        :stroke-width="strokeWidth"
        :stroke-dasharray="circumference"
        :stroke-dashoffset="currentOffset"
        stroke-linecap="round"
      />
    </svg>
    <div class="gauge__content">
      <span class="gauge__value">{{ displayValue }}{{ suffix }}</span>
      <span class="gauge__label">{{ label }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';

const props = defineProps({
  value: { type: Number, default: 0 },
  max: { type: Number, default: 100 },
  size: { type: Number, default: 120 },
  strokeWidth: { type: Number, default: 8 },
  label: { type: String, default: '' },
  suffix: { type: String, default: '%' },
  animate: { type: Boolean, default: true },
  duration: { type: Number, default: 2000 }
});

const progressRef = ref(null);
const displayValue = ref(0);
const currentOffset = ref(0);

const viewBox = 100;
const center = viewBox / 2;
const radius = (viewBox - props.strokeWidth) / 2 - 2;
const circumference = 2 * Math.PI * radius;

const targetOffset = computed(() => {
  const percent = props.value / props.max;
  return circumference - (percent * circumference);
});

const animateGauge = () => {
  if (!props.animate) {
    displayValue.value = props.value;
    currentOffset.value = targetOffset.value;
    return;
  }
  
  const startOffset = circumference;
  const startValue = 0;
  const startTime = performance.now();
  
  const animate = (currentTime) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / props.duration, 1);
    
    // Easing
    const eased = 1 - Math.pow(1 - progress, 3);
    
    currentOffset.value = startOffset - (startOffset - targetOffset.value) * eased;
    displayValue.value = Math.round(startValue + (props.value - startValue) * eased * 10) / 10;
    
    if (progress < 1) {
      requestAnimationFrame(animate);
    }
  };
  
  requestAnimationFrame(animate);
};

// Observer pour déclencher l'animation au scroll
onMounted(() => {
  currentOffset.value = circumference;
  
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateGauge();
          observer.disconnect();
        }
      });
    },
    { threshold: 0.5 }
  );
  
  if (progressRef.value) {
    observer.observe(progressRef.value);
  }
});

watch(() => props.value, () => {
  animateGauge();
});
</script>

<style scoped>
.gauge {
  position: relative;
}

.gauge__svg {
  transform: rotate(-90deg);
  width: 100%;
  height: 100%;
}

.gauge__track {
  stroke: var(--surface-light);
}

.gauge__progress {
  stroke: var(--primary);
  filter: drop-shadow(0 0 6px var(--primary-glow));
  transition: stroke-dashoffset 0.1s ease-out;
}

.gauge__content {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.gauge__value {
  font-family: 'JetBrains Mono', monospace;
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-main);
}

.gauge__label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.55rem;
  color: var(--text-dark);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-top: 0.25rem;
}
</style>
