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
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue';

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

const viewBox = 100;
const center = viewBox / 2;
const radius = (viewBox - props.strokeWidth) / 2 - 2;
const circumference = 2 * Math.PI * radius;

const targetOffset = computed(() => {
  const percent = props.value / props.max;
  return circumference - (percent * circumference);
});

// État au repos = la VRAIE valeur et l'anneau réellement rempli.
// Si le JS échoue ou si l'observer ne se déclenche jamais, la jauge affiche
// le bon chiffre plutôt que zéro.
const displayValue = ref(props.value);
const currentOffset = ref(targetOffset.value);

let observer = null;
let frameId = null;

const animateGauge = () => {
  if (frameId) cancelAnimationFrame(frameId);

  const startOffset = circumference;
  const startTime = performance.now();

  const step = (now) => {
    const progress = Math.min((now - startTime) / props.duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);

    currentOffset.value = startOffset - (startOffset - targetOffset.value) * eased;
    displayValue.value = Math.round(props.value * eased * 10) / 10;

    if (progress < 1) {
      frameId = requestAnimationFrame(step);
    } else {
      currentOffset.value = targetOffset.value;
      displayValue.value = props.value;
      frameId = null;
    }
  };

  frameId = requestAnimationFrame(step);
};

onMounted(() => {
  const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  // Animation non souhaitée ou impossible : la valeur réelle est déjà affichée.
  if (!props.animate || reducedMotion ||
      typeof IntersectionObserver === 'undefined' || !progressRef.value) {
    return;
  }

  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        observer = null;
        // On repart de zéro juste avant de compter, pas avant.
        displayValue.value = 0;
        currentOffset.value = circumference;
        animateGauge();
      });
    },
    // threshold 0 : un bloc plus haut que la fenêtre n'atteindrait jamais 0.5.
    { threshold: 0, rootMargin: '0px 0px -10% 0px' }
  );

  observer.observe(progressRef.value);
});

onBeforeUnmount(() => {
  if (frameId) cancelAnimationFrame(frameId);
  if (observer) observer.disconnect();
});

watch(() => props.value, (v) => {
  displayValue.value = v;
  currentOffset.value = targetOffset.value;
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
