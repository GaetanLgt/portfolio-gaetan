<template>
  <div class="floating-elements" aria-hidden="true">
    <div 
      v-for="(element, index) in elements" 
      :key="index"
      class="floating-element"
      :class="'floating-element--' + element.type"
      :style="getElementStyle(element, index)"
    >
      <span v-if="element.type === 'emoji'">{{ element.content }}</span>
      <span v-else-if="element.type === 'code'" class="code-snippet">{{ element.content }}</span>
      <div v-else-if="element.type === 'shape'" :class="'shape--' + element.shape"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';

const props = defineProps({
  elements: {
    type: Array,
    default: () => [
      { type: 'emoji', content: '⚡', x: 10, y: 20, speed: 0.3, size: 2 },
      { type: 'emoji', content: '🚀', x: 85, y: 15, speed: 0.5, size: 1.5 },
      { type: 'code', content: '<div>', x: 5, y: 60, speed: 0.2, size: 0.8 },
      { type: 'code', content: '{ }', x: 90, y: 70, speed: 0.4, size: 1 },
      { type: 'shape', shape: 'circle', x: 15, y: 80, speed: 0.35, size: 1 },
      { type: 'shape', shape: 'square', x: 80, y: 40, speed: 0.25, size: 0.8 },
      { type: 'emoji', content: '✨', x: 50, y: 10, speed: 0.6, size: 1.2 },
      { type: 'code', content: '/>', x: 70, y: 85, speed: 0.15, size: 0.9 }
    ]
  },
  parallaxStrength: { type: Number, default: 1 }
});

const scrollY = ref(0);
const mouseX = ref(0);
const mouseY = ref(0);

const getElementStyle = (element, index) => {
  const parallaxY = scrollY.value * element.speed * props.parallaxStrength;
  const mouseOffsetX = (mouseX.value - window.innerWidth / 2) * 0.02 * element.speed;
  const mouseOffsetY = (mouseY.value - window.innerHeight / 2) * 0.02 * element.speed;
  
  return {
    '--x': element.x + '%',
    '--y': element.y + '%',
    '--size': element.size,
    '--parallax-y': -parallaxY + 'px',
    '--mouse-x': mouseOffsetX + 'px',
    '--mouse-y': mouseOffsetY + 'px',
    '--delay': (index * 0.1) + 's',
    '--duration': (3 + index * 0.5) + 's'
  };
};

const handleScroll = () => {
  scrollY.value = window.scrollY;
};

const handleMouseMove = (e) => {
  mouseX.value = e.clientX;
  mouseY.value = e.clientY;
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true });
  window.addEventListener('mousemove', handleMouseMove, { passive: true });
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
  window.removeEventListener('mousemove', handleMouseMove);
});
</script>

<style scoped>
.floating-elements {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 1;
  overflow: hidden;
}

.floating-element {
  position: absolute;
  left: var(--x);
  top: var(--y);
  font-size: calc(1rem * var(--size));
  opacity: 0.15;
  transform: translate(
    calc(var(--mouse-x, 0px)),
    calc(var(--parallax-y, 0px) + var(--mouse-y, 0px))
  );
  animation: float var(--duration) ease-in-out infinite;
  animation-delay: var(--delay);
  transition: transform 0.3s ease-out;
}

@keyframes float {
  0%, 100% {
    transform: translate(
      var(--mouse-x, 0px),
      calc(var(--parallax-y, 0px) + var(--mouse-y, 0px))
    );
  }
  50% {
    transform: translate(
      var(--mouse-x, 0px),
      calc(var(--parallax-y, 0px) + var(--mouse-y, 0px) - 20px)
    );
  }
}

/* Types */
.floating-element--emoji {
  filter: grayscale(0.5);
}

.floating-element--code {
  font-family: 'JetBrains Mono', monospace;
  color: var(--primary, #10B981);
  font-weight: 600;
}

.floating-element--shape .shape--circle {
  width: calc(30px * var(--size));
  height: calc(30px * var(--size));
  border: 2px solid var(--primary, #10B981);
  border-radius: 50%;
}

.floating-element--shape .shape--square {
  width: calc(25px * var(--size));
  height: calc(25px * var(--size));
  border: 2px solid var(--primary, #10B981);
  transform: rotate(45deg);
}

/* A11Y */
@media (prefers-reduced-motion: reduce) {
  .floating-element {
    animation: none;
    transform: none;
  }
}

/* Hide on mobile for performance */
@media (max-width: 768px) {
  .floating-elements {
    display: none;
  }
}
</style>
