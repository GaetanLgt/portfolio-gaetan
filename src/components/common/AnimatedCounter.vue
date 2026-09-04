<template>
  <span ref="counterRef" class="counter">{{ displayValue }}{{ suffix }}</span>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';

const props = defineProps({
  value: { type: Number, required: true },
  suffix: { type: String, default: '' },
  duration: { type: Number, default: 2000 },
  decimals: { type: Number, default: 0 }
});

const counterRef = ref(null);
let observer = null;
let frameId = null;

const format = (v) => (props.decimals > 0 ? Number(v).toFixed(props.decimals) : Math.round(v));

// État au repos = la VRAIE valeur, jamais zéro.
// Si le JS échoue, si l'observer ne se déclenche jamais, si un crawler lit la page
// sans exécuter les animations : c'est le chiffre réel qui s'affiche.
// L'animation part de zéro uniquement quand elle est effectivement lancée.
const displayValue = ref(format(props.value));

const animateCounter = () => {
  if (frameId) cancelAnimationFrame(frameId);

  const startTime = performance.now();

  const step = (now) => {
    const progress = Math.min((now - startTime) / props.duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    displayValue.value = format(props.value * eased);

    if (progress < 1) {
      frameId = requestAnimationFrame(step);
    } else {
      displayValue.value = format(props.value);   // garantit la valeur exacte en fin de course
      frameId = null;
    }
  };

  frameId = requestAnimationFrame(step);
};

onMounted(() => {
  const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  // Pas d'animation demandée ou observer indisponible : la valeur est déjà affichée.
  if (reducedMotion || typeof IntersectionObserver === 'undefined' || !counterRef.value) {
    return;
  }

  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        observer = null;
        displayValue.value = format(0);   // on retombe à zéro juste avant de compter
        animateCounter();
      });
    },
    // threshold 0 : un bloc plus haut que la fenêtre n'atteindrait jamais 0.5
    // et resterait figé. rootMargin déclenche un peu avant l'entrée à l'écran.
    { threshold: 0, rootMargin: '0px 0px -10% 0px' }
  );

  observer.observe(counterRef.value);
});

onBeforeUnmount(() => {
  if (frameId) cancelAnimationFrame(frameId);
  if (observer) observer.disconnect();
});

// Si la valeur change après coup, on l'affiche sans repartir de zéro.
watch(() => props.value, (v) => {
  displayValue.value = format(v);
});
</script>

<style scoped>
.counter {
  font-family: 'JetBrains Mono', monospace;
  font-variant-numeric: tabular-nums;
}
</style>
