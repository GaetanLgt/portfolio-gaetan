<template>
  <div 
    ref="elementRef"
    class="scroll-reveal"
    :class="[
      'scroll-reveal--' + animation,
      { 'scroll-reveal--visible': isVisible }
    ]"
    :style="revealStyle"
  >
    <slot></slot>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';

const props = defineProps({
  animation: {
    type: String,
    default: 'fade-up',
    validator: (v) => ['fade-up', 'fade-down', 'fade-left', 'fade-right', 'zoom', 'flip', 'blur'].includes(v)
  },
  delay: { type: Number, default: 0 },
  duration: { type: Number, default: 600 },
  threshold: { type: Number, default: 0.1 },
  once: { type: Boolean, default: true },
  disabled: { type: Boolean, default: false }
});

const elementRef = ref(null);
const isVisible = ref(false);
let observer = null;

const revealStyle = computed(() => ({
  '--delay': props.delay + 'ms',
  '--duration': props.duration + 'ms'
}));

const handleIntersect = (entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      isVisible.value = true;
      if (props.once && observer) {
        observer.unobserve(entry.target);
      }
    } else if (!props.once) {
      isVisible.value = false;
    }
  });
};

onMounted(() => {
  if (props.disabled) {
    isVisible.value = true;
    return;
  }
  
  // Check for reduced motion preference
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    isVisible.value = true;
    return;
  }
  
  observer = new IntersectionObserver(handleIntersect, {
    threshold: props.threshold,
    rootMargin: '0px 0px -50px 0px'
  });
  
  if (elementRef.value) {
    observer.observe(elementRef.value);
  }
});

onUnmounted(() => {
  if (observer && elementRef.value) {
    observer.unobserve(elementRef.value);
    observer.disconnect();
  }
});
</script>

<style scoped>
.scroll-reveal {
  transition: 
    opacity var(--duration) cubic-bezier(0.16, 1, 0.3, 1) var(--delay),
    transform var(--duration) cubic-bezier(0.16, 1, 0.3, 1) var(--delay),
    filter var(--duration) cubic-bezier(0.16, 1, 0.3, 1) var(--delay);
}

/* Fade Up */
.scroll-reveal--fade-up {
  opacity: 0;
  transform: translateY(40px);
}

.scroll-reveal--fade-up.scroll-reveal--visible {
  opacity: 1;
  transform: translateY(0);
}

/* Fade Down */
.scroll-reveal--fade-down {
  opacity: 0;
  transform: translateY(-40px);
}

.scroll-reveal--fade-down.scroll-reveal--visible {
  opacity: 1;
  transform: translateY(0);
}

/* Fade Left */
.scroll-reveal--fade-left {
  opacity: 0;
  transform: translateX(40px);
}

.scroll-reveal--fade-left.scroll-reveal--visible {
  opacity: 1;
  transform: translateX(0);
}

/* Fade Right */
.scroll-reveal--fade-right {
  opacity: 0;
  transform: translateX(-40px);
}

.scroll-reveal--fade-right.scroll-reveal--visible {
  opacity: 1;
  transform: translateX(0);
}

/* Zoom */
.scroll-reveal--zoom {
  opacity: 0;
  transform: scale(0.8);
}

.scroll-reveal--zoom.scroll-reveal--visible {
  opacity: 1;
  transform: scale(1);
}

/* Flip */
.scroll-reveal--flip {
  opacity: 0;
  transform: perspective(1000px) rotateX(-30deg);
  transform-origin: top center;
}

.scroll-reveal--flip.scroll-reveal--visible {
  opacity: 1;
  transform: perspective(1000px) rotateX(0);
}

/* Blur */
.scroll-reveal--blur {
  opacity: 0;
  filter: blur(10px);
}

.scroll-reveal--blur.scroll-reveal--visible {
  opacity: 1;
  filter: blur(0);
}

/* A11Y */
@media (prefers-reduced-motion: reduce) {
  .scroll-reveal {
    opacity: 1 !important;
    transform: none !important;
    filter: none !important;
    transition: none !important;
  }
}
</style>
