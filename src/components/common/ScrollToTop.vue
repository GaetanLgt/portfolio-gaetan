<template>
  <Transition name="scroll-top">
    <button 
      v-if="isVisible" 
      class="scroll-top" 
      @click="scrollToTop"
      aria-label="Retourner en haut de page"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="18 15 12 9 6 15"/>
      </svg>
      <span class="scroll-top__progress" :style="{ height: scrollProgress + '%' }"></span>
    </button>
  </Transition>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const isVisible = ref(false);
const scrollProgress = ref(0);

const handleScroll = () => {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  
  // Show button after 400px scroll
  isVisible.value = scrollTop > 400;
  
  // Calculate scroll progress
  scrollProgress.value = Math.min((scrollTop / docHeight) * 100, 100);
};

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true });
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<style scoped>
.scroll-top {
  position: fixed;
  bottom: 5rem;
  right: 1.5rem;
  width: 44px;
  height: 44px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  overflow: hidden;
  transition: 
    border-color 0.3s ease,
    box-shadow 0.3s ease,
    transform 0.3s ease;
}

.scroll-top:hover {
  border-color: var(--primary);
  box-shadow: 0 0 20px var(--primary-glow);
  transform: translateY(-3px);
}

.scroll-top:active {
  transform: translateY(0);
}

.scroll-top svg {
  color: var(--primary);
  position: relative;
  z-index: 2;
  transition: transform 0.3s ease;
}

.scroll-top:hover svg {
  transform: translateY(-2px);
}

.scroll-top__progress {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  background: var(--primary-soft);
  transition: height 0.1s ease;
  z-index: 1;
}

/* Transition */
.scroll-top-enter-active,
.scroll-top-leave-active {
  transition: 
    opacity 0.3s ease,
    transform 0.3s ease;
}

.scroll-top-enter-from,
.scroll-top-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.8);
}

/* Responsive */
@media (max-width: 768px) {
  .scroll-top {
    bottom: 4.5rem;
    right: 1rem;
    width: 40px;
    height: 40px;
  }
}

/* Respect reduced motion */
@media (prefers-reduced-motion: reduce) {
  .scroll-top {
    transition: none;
  }
  
  .scroll-top svg {
    transition: none;
  }
  
  .scroll-top-enter-active,
  .scroll-top-leave-active {
    transition: opacity 0.1s ease;
  }
  
  .scroll-top-enter-from,
  .scroll-top-leave-to {
    transform: none;
  }
}
</style>
