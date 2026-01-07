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
    const cleanup = () => {\n      element.classList.add('animation-complete');\n      element.removeEventListener('transitionend', cleanup);\n      element.removeEventListener('animationend', cleanup);\n    };\n    \n    // Écouter la fin de l'animation/transition\n    element.addEventListener('transitionend', cleanup);\n    element.addEventListener('animationend', cleanup);\n    \n    // Fallback cleanup après 1s\n    setTimeout(cleanup, 1000);\n  };\n  \n  const animateOnScroll = (selector, animationType = 'fadeInUp') => {\n    nextTick(() => {\n      const elements = document.querySelectorAll(selector);\n      elements.forEach(el => observeElement(el, animationType));\n    });\n  };\n  \n  const fadeInUp = (selector) => animateOnScroll(selector, 'fadeInUp');\n  const scaleIn = (selector) => animateOnScroll(selector, 'scaleIn');\n  \n  // Performance: pause animations si prefers-reduced-motion\n  const respectsReducedMotion = () => {\n    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;\n  };\n  \n  onMounted(() => {\n    if (!respectsReducedMotion()) {\n      setupIntersectionObserver();\n    }\n  });\n  \n  onUnmounted(() => {\n    // Cleanup observers\n    intersectionObserver.value?.disconnect();\n    \n    // Cleanup will-change sur tous les éléments\n    animatedElements.value.forEach(element => {\n      if (element && element.style) {\n        element.style.willChange = 'auto';\n      }\n    });\n    \n    animatedElements.value.clear();\n  });\n  \n  return {\n    observeElement,\n    animateOnScroll,\n    fadeInUp,\n    scaleIn,\n    triggerAnimation\n  };\n}\n\n/**\n * useScrollAnimations - Version simplifiée et rétrocompatible\n * Pour remplacer l'ancienne version sans casser le code existant\n */\nexport function useScrollAnimations() {\n  const { fadeInUp, scaleIn } = useOptimizedAnimations();\n  \n  return {\n    fadeInUp,\n    scaleIn\n  };\n}