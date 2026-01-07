/**
 * LazyBackground.vue - Lazy loading intelligent pour les backgrounds Three.js
 * Charge uniquement quand nécessaire, réduit le bundle initial
 */

<template>
  <div class="lazy-background" :class="{ 'loading': isLoading }">
    <!-- Fallback simple pendant le chargement -->
    <div v-if="isLoading" class="fallback-bg"></div>
    
    <!-- Component chargé dynamiquement -->
    <Suspense v-else>
      <component 
        :is="BackgroundComponent" 
        v-bind="componentProps"
      />
      
      <template #fallback>
        <div class="fallback-bg"></div>
      </template>
    </Suspense>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, defineAsyncComponent } from 'vue';

const props = defineProps({
  type: { type: String, default: 'grid' }, // 'grid' | 'particles' | 'matrix'
  enabled: { type: Boolean, default: true }
});

const isLoading = ref(true);
const BackgroundComponent = ref(null);

// Lazy import des composants Three.js
const backgroundComponents = {
  grid: defineAsyncComponent(() => import('@/components/three/GridBackground.vue')),
  particles: defineAsyncComponent(() => import('@/components/three/ParticleField.vue')),
  matrix: defineAsyncComponent(() => import('@/components/three/MatrixBackground.vue'))
};

const componentProps = computed(() => {
  const { type, enabled, ...rest } = props;
  return rest;
});

const loadBackgroundComponent = async () => {
  if (!props.enabled) {
    isLoading.value = false;
    return;
  }
  
  try {
    // Vérifier si l'utilisateur préfère les animations réduites
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
      // Charger seulement le fond statique
      BackgroundComponent.value = backgroundComponents.grid;
    } else {
      // Charger le composant demandé
      BackgroundComponent.value = backgroundComponents[props.type] || backgroundComponents.grid;
    }
    
    // Délai pour éviter le FOUC (Flash Of Unstyled Content)
    await new Promise(resolve => setTimeout(resolve, 100));
    
    isLoading.value = false;
  } catch (error) {
    console.warn('Failed to load background component:', error);
    isLoading.value = false;
  }
};

onMounted(() => {
  // Charger après que la page soit stabilisée
  if (window.requestIdleCallback) {
    requestIdleCallback(loadBackgroundComponent, { timeout: 2000 });
  } else {
    setTimeout(loadBackgroundComponent, 1000);
  }
});
</script>

<style scoped>
.lazy-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  transition: opacity 0.3s ease;
}

.fallback-bg {
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at 25% 25%, rgba(16, 185, 129, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 75% 75%, rgba(6, 182, 212, 0.1) 0%, transparent 50%);
  background-size: 100% 100%;
  animation: subtlePulse 4s ease-in-out infinite;
}

@keyframes subtlePulse {
  0%, 100% { opacity: 0.8; }
  50% { opacity: 0.6; }
}

/* Mode réduit pour prefers-reduced-motion */
@media (prefers-reduced-motion: reduce) {
  .fallback-bg {
    animation: none;
    opacity: 0.5;
  }
}
</style>
