<template>
  <span ref="counterRef" class="counter">{{ displayValue }}{{ suffix }}</span>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';

const props = defineProps({
  value: { type: Number, required: true },
  suffix: { type: String, default: '' },
  duration: { type: Number, default: 2000 },
  decimals: { type: Number, default: 0 }
});

const counterRef = ref(null);
const displayValue = ref(0);

const animateCounter = () => {
  const startValue = 0;
  const startTime = performance.now();
  
  const animate = (currentTime) => {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / props.duration, 1);
    
    // Easing out
    const eased = 1 - Math.pow(1 - progress, 3);
    
    const currentValue = startValue + (props.value - startValue) * eased;
    displayValue.value = props.decimals > 0 
      ? currentValue.toFixed(props.decimals)
      : Math.round(currentValue);
    
    if (progress < 1) {
      requestAnimationFrame(animate);
    }
  };
  
  requestAnimationFrame(animate);
};

onMounted(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter();
          observer.disconnect();
        }
      });
    },
    { threshold: 0.5 }
  );
  
  if (counterRef.value) {
    observer.observe(counterRef.value);
  }
});

watch(() => props.value, () => {
  animateCounter();
});
</script>

<style scoped>
.counter {
  font-family: 'JetBrains Mono', monospace;
  font-variant-numeric: tabular-nums;
}
</style>
