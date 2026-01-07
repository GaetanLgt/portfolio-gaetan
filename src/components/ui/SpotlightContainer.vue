<template>
  <div 
    ref="containerRef"
    class="spotlight-container"
    @mousemove="onMouseMove"
    @mouseleave="onMouseLeave"
  >
    <div 
      class="spotlight"
      :class="{ 'spotlight--active': isActive }"
      :style="spotlightStyle"
      aria-hidden="true"
    ></div>
    <div class="spotlight-content">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  size: { type: Number, default: 400 },
  color: { type: String, default: 'var(--primary, #10B981)' },
  opacity: { type: Number, default: 0.15 },
  blur: { type: Number, default: 80 },
  disabled: { type: Boolean, default: false }
});

const containerRef = ref(null);
const isActive = ref(false);
const mouseX = ref(0);
const mouseY = ref(0);

const spotlightStyle = computed(() => {
  return {
    '--x': mouseX.value + 'px',
    '--y': mouseY.value + 'px',
    '--size': props.size + 'px',
    '--color': props.color,
    '--opacity': props.opacity,
    '--blur': props.blur + 'px'
  };
});

const onMouseMove = (e) => {
  if (props.disabled) return;
  
  const rect = containerRef.value.getBoundingClientRect();
  mouseX.value = e.clientX - rect.left;
  mouseY.value = e.clientY - rect.top;
  isActive.value = true;
};

const onMouseLeave = () => {
  isActive.value = false;
};
</script>

<style scoped>
.spotlight-container {
  position: relative;
  overflow: hidden;
}

.spotlight {
  position: absolute;
  top: 0;
  left: 0;
  width: var(--size);
  height: var(--size);
  background: radial-gradient(
    circle at center,
    var(--color) 0%,
    transparent 70%
  );
  opacity: 0;
  pointer-events: none;
  transform: translate(
    calc(var(--x) - var(--size) / 2),
    calc(var(--y) - var(--size) / 2)
  );
  filter: blur(var(--blur));
  transition: opacity 0.3s ease;
  z-index: 0;
}

.spotlight--active {
  opacity: var(--opacity);
}

.spotlight-content {
  position: relative;
  z-index: 1;
}

/* A11Y */
@media (prefers-reduced-motion: reduce) {
  .spotlight {
    display: none;
  }
}
</style>
