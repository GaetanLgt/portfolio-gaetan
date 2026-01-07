<template>
  <div 
    ref="cardRef"
    class="tilt-card"
    :class="{ 'tilt-card--active': isHovering }"
    :style="cardStyle"
    @mouseenter="onMouseEnter"
    @mousemove="onMouseMove"
    @mouseleave="onMouseLeave"
  >
    <div class="tilt-card__glare" :style="glareStyle" aria-hidden="true"></div>
    <div class="tilt-card__content">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  maxTilt: { type: Number, default: 15 },
  scale: { type: Number, default: 1.05 },
  speed: { type: Number, default: 400 },
  glare: { type: Boolean, default: true },
  maxGlare: { type: Number, default: 0.3 },
  perspective: { type: Number, default: 1000 },
  disabled: { type: Boolean, default: false }
});

const cardRef = ref(null);
const isHovering = ref(false);
const tiltX = ref(0);
const tiltY = ref(0);
const glareX = ref(50);
const glareY = ref(50);

const cardStyle = computed(() => {
  if (props.disabled || !isHovering.value) {
    return {
      transform: 'perspective(' + props.perspective + 'px) rotateX(0deg) rotateY(0deg) scale(1)',
      transition: 'transform ' + props.speed + 'ms ease-out'
    };
  }
  
  return {
    transform: `perspective(${props.perspective}px) rotateX(${tiltX.value}deg) rotateY(${tiltY.value}deg) scale(${props.scale})`,
    transition: 'transform 100ms ease-out'
  };
});

const glareStyle = computed(() => {
  if (!props.glare || !isHovering.value) {
    return { opacity: 0 };
  }
  
  return {
    opacity: props.maxGlare,
    background: `radial-gradient(circle at ${glareX.value}% ${glareY.value}%, rgba(255,255,255,0.8) 0%, transparent 60%)`
  };
});

const onMouseEnter = () => {
  if (props.disabled) return;
  isHovering.value = true;
};

const onMouseMove = (e) => {
  if (props.disabled || !cardRef.value) return;
  
  const rect = cardRef.value.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  const centerX = rect.width / 2;
  const centerY = rect.height / 2;
  
  // Calculate tilt
  tiltX.value = ((y - centerY) / centerY) * -props.maxTilt;
  tiltY.value = ((x - centerX) / centerX) * props.maxTilt;
  
  // Calculate glare position
  glareX.value = (x / rect.width) * 100;
  glareY.value = (y / rect.height) * 100;
};

const onMouseLeave = () => {
  isHovering.value = false;
  tiltX.value = 0;
  tiltY.value = 0;
};
</script>

<style scoped>
.tilt-card {
  position: relative;
  will-change: transform;
  /* NO overflow:hidden - permet aux badges de dépasser */
}

.tilt-card__glare {
  position: absolute;
  inset: 0;
  pointer-events: none;
  border-radius: 1rem;
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: 2;
  /* Clip le glare pour qu'il ne déborde pas */
  clip-path: inset(0 round 1rem);
}

.tilt-card__content {
  position: relative;
  z-index: 1;
}

/* A11Y */
@media (prefers-reduced-motion: reduce) {
  .tilt-card {
    transform: none !important;
    transition: none !important;
  }
}
</style>
