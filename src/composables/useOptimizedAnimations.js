/**
 * useOptimizedAnimations - Composable pour animations performantes
 * Gère automatiquement will-change et cleanup
 */

import { ref, onMounted, onUnmounted, nextTick } from 'vue';

export function useOptimizedAnimations() {
  const animatedElements = ref(new Set());
  
  // Observer pour détecter quand les animations sont terminées
  const intersectionObserver = ref(null);
  
  const setupIntersectionObserver = () => {
    intersectionObserver.value = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            triggerAnimation(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '50px 0px -50px 0px'
      }
    );
  };
  
  const observeElement = (element, animationType = 'fadeInUp') => {
    if (!element) return;
    
    // Ajouter la classe d'animation
    element.classList.add(`animate-${animationType}`);
    
    // Observer l'élément
    intersectionObserver.value?.observe(element);
    animatedElements.value.add(element);
  };
  
  const triggerAnimation = (element) => {
    if (!element) return;
    
    // Ajouter la classe visible pour déclencher l'animation
    element.classList.add('visible');
    
    // Cleanup après l'animation
    const cleanup = () => {
      element.classList.add('animation-complete');
      element.removeEventListener('transitionend', cleanup);
      element.removeEventListener('animationend', cleanup);
    };
    
    // Écouter la fin de l'animation/transition
    element.addEventListener('transitionend', cleanup);
    element.addEventListener('animationend', cleanup);
    
    // Fallback cleanup après 1s
    setTimeout(cleanup, 1000);
  };
  
  const animateOnScroll = (selector, animationType = 'fadeInUp') => {
    nextTick(() => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(el => observeElement(el, animationType));
    });
  };
  
  const fadeInUp = (selector) => animateOnScroll(selector, 'fadeInUp');
  const scaleIn = (selector) => animateOnScroll(selector, 'scaleIn');
  
  // Performance: pause animations si prefers-reduced-motion
  const respectsReducedMotion = () => {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  };
  
  onMounted(() => {
    if (!respectsReducedMotion()) {
      setupIntersectionObserver();
    }
  });
  
  onUnmounted(() => {
    // Cleanup observers
    intersectionObserver.value?.disconnect();
    
    // Cleanup will-change sur tous les éléments
    animatedElements.value.forEach(element => {
      if (element && element.style) {
        element.style.willChange = 'auto';
      }
    });
    
    animatedElements.value.clear();
  });
  
  return {
    observeElement,
    animateOnScroll,
    fadeInUp,
    scaleIn,
    triggerAnimation
  };
}

/**
 * useScrollAnimations - Version simplifiée et rétrocompatible
 * Pour remplacer l'ancienne version sans casser le code existant
 */
export function useScrollAnimations() {
  const { fadeInUp, scaleIn } = useOptimizedAnimations();
  
  return {
    fadeInUp,
    scaleIn
  };
}