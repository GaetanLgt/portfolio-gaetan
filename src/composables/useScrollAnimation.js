import { ref, onMounted, onUnmounted } from 'vue';

export function useScrollAnimation(options = {}) {
  const {
    threshold = 0.3,
    rootMargin = '0px'
  } = options;

  const isVisible = ref(false);
  const elementRef = ref(null);
  let observer;

  const observe = () => {
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            isVisible.value = true;
            if (options.once) {
              observer.unobserve(entry.target);
            }
          } else if (!options.once) {
            isVisible.value = false;
          }
        });
      },
      { threshold, rootMargin }
    );

    if (elementRef.value) {
      observer.observe(elementRef.value);
    }
  };

  onMounted(() => {
    observe();
  });

  onUnmounted(() => {
    if (observer && elementRef.value) {
      observer.unobserve(elementRef.value);
    }
  });

  return {
    elementRef,
    isVisible
  };
}
