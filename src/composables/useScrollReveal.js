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

  /* ⛔ `elements` N'EST PAS UN `ref` — corrigé le 23/09/2026.
     C'était `ref([])`, et on y faisait `elements.value.push(el)` pour chaque
     élément observé. **Sur une page à plusieurs centaines de `.reveal`, ça
     déclenche la réactivité des centaines de fois pour rien.**
     ⭐ Et « pour rien » est le mot : `elements` **n'est jamais retourné** par le
     composable (voir le `return` en fin de fichier) et **aucun `watch` ni
     `computed` ne le lit**. C'est un accumulateur technique, pas un état
     d'interface. *Un état réactif que personne n'observe ne coûte presque rien —
     mais il n'a non plus aucune raison d'être réactif.* */
  const elements = []
  const observer = ref(null)
  const prefersReducedMotion = ref(false)
  // ⭐ La `MediaQueryList` qu'on écoute — gardée pour pouvoir RETIRER l'écouteur.
  let mediaQueryRef = null

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
    mediaQueryRef = mediaQuery   // ⭐ conservée pour le retrait en onUnmounted

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
      elements.push(el);
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
    /* ⛔ ET ON RETIRE L'ÉCOUTEUR DE PRÉFÉRENCE — ajouté le 23/09/2026.
       `initObserver` pose un écouteur sur une `MediaQueryList` :
           mediaQuery.addEventListener('change', checkReducedMotion)
       ⭐ **Il n'était jamais retiré.** À chaque montage d'une page, un écouteur
       de plus restait accroché. *Ce n'est pas ce qui fige un moteur de rendu,
       mais c'est une fuite, et elle s'accumule à chaque navigation — donc
       précisément dans un prérendu qui visite 32 pages d'affilée.*
       ⇒ On garde la référence pour pouvoir le retirer. */
    if (mediaQueryRef) {
      mediaQueryRef.removeEventListener('change', checkReducedMotion);
      mediaQueryRef = null;
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
