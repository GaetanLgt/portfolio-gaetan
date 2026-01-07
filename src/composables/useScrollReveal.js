/**
 * useScrollReveal - Composable for scroll-triggered animations
 * Respects prefers-reduced-motion accessibility setting
 */
import { ref, onMounted, onUnmounted } from 'vue';

export function useScrollReveal(options = {}) {
  const {
    threshold = 0.1,
    rootMargin = '0px 0px -50px 0px',
    once = true
  } = options;

  const elements = ref([]);
  const observer = ref(null);
  const prefersReducedMotion = ref(false);

  // Check user preference for reduced motion
  const checkReducedMotion = () => {
    if (typeof window !== 'undefined') {
      prefersReducedMotion.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
  };

  // Initialize Intersection Observer
  const initObserver = () => {
    if (typeof window === 'undefined') return;

    checkReducedMotion();

    // Listen for changes in motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    mediaQuery.addEventListener('change', checkReducedMotion);

    observer.value = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Add visible class with optional delay
          const delay = entry.target.dataset.revealDelay || 0;
          
          if (prefersReducedMotion.value) {
            // Instant reveal for reduced motion preference
            entry.target.classList.add('revealed');
          } else {
            setTimeout(() => {
              entry.target.classList.add('revealed');
            }, delay);
          }

          if (once) {
            observer.value.unobserve(entry.target);
          }
        } else if (!once) {
          entry.target.classList.remove('revealed');
        }
      });
    }, {
      threshold,
      rootMargin
    });
  };

  // Observe an element
  const observe = (el) => {
    if (el && observer.value) {
      elements.value.push(el);
      observer.value.observe(el);
    }
  };

  // Directive-style ref function
  const revealRef = (el) => {
    if (el) observe(el);
  };

  // Observe multiple elements by selector
  const observeAll = (selector) => {
    if (typeof document === 'undefined') return;
    
    const els = document.querySelectorAll(selector);
    els.forEach((el, index) => {
      // Stagger delay based on index (cap at 500ms)
      el.dataset.revealDelay = Math.min(index * 100, 500);
      observe(el);
    });
  };
  
  // Observe all reveal variants
  const observeAllVariants = () => {
    observeAll('.reveal');
    observeAll('.reveal-left');
    observeAll('.reveal-right');
    observeAll('.reveal-scale');
  };

  onMounted(() => {
    initObserver();
  });

  onUnmounted(() => {
    if (observer.value) {
      observer.value.disconnect();
    }
  });

  return {
    observe,
    observeAll,
    observeAllVariants,
    revealRef,
    prefersReducedMotion
  };
}

// CSS classes to add to your styles:
/*
.reveal {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.6s ease-out, transform 0.6s ease-out;
}

.reveal.revealed {
  opacity: 1;
  transform: translateY(0);
}

.reveal--left {
  transform: translateX(-30px);
}

.reveal--left.revealed {
  transform: translateX(0);
}

.reveal--right {
  transform: translateX(30px);
}

.reveal--right.revealed {
  transform: translateX(0);
}

.reveal--scale {
  transform: scale(0.95);
}

.reveal--scale.revealed {
  transform: scale(1);
}

@media (prefers-reduced-motion: reduce) {
  .reveal {
    opacity: 1;
    transform: none;
    transition: none;
  }
}
*/
