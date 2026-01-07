<template>
  <component
    :is="tag"
    ref="buttonRef"
    class="magnetic-button"
    :class="{ 'magnetic-button--hovering': isHovering }"
    :style="buttonStyle"
    @mouseenter="onMouseEnter"
    @mousemove="onMouseMove"
    @mouseleave="onMouseLeave"
    v-bind="$attrs"
  >
    <span class="magnetic-button__text" :style="textStyle">
      <slot></slot>
    </span>
    <span class="magnetic-button__bg" :style="bgStyle" aria-hidden="true"></span>
  </component>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  tag: { type: String, default: 'button' },
  strength: { type: Number, default: 30 },
  textStrength: { type: Number, default: 40 },
  disabled: { type: Boolean, default: false }
});

const buttonRef = ref(null);
const isHovering = ref(false);
const translateX = ref(0);
const translateY = ref(0);
const textTranslateX = ref(0);
const textTranslateY = ref(0);
const bgX = ref(50);
const bgY = ref(50);

const buttonStyle = computed(() => {
  if (props.disabled) return {};
  
  return {
    transform: `translate(${translateX.value}px, ${translateY.value}px)`
  };
});

const textStyle = computed(() => {
  if (props.disabled) return {};
  
  return {
    transform: `translate(${textTranslateX.value}px, ${textTranslateY.value}px)`
  };
});

const bgStyle = computed(() => {
  return {
    '--bg-x': bgX.value + '%',
    '--bg-y': bgY.value + '%'
  };
});

const onMouseEnter = () => {
  if (props.disabled) return;
  isHovering.value = true;
};

const onMouseMove = (e) => {
  if (props.disabled || !buttonRef.value) return;
  
  const rect = buttonRef.value.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  const centerX = rect.width / 2;
  const centerY = rect.height / 2;
  
  // Calculate magnetic pull for button
  const deltaX = (x - centerX) / centerX;
  const deltaY = (y - centerY) / centerY;
  
  translateX.value = deltaX * props.strength;
  translateY.value = deltaY * props.strength;
  
  // Text follows cursor directly (magnetic stick effect)
  const textOffsetX = x - centerX;
  const textOffsetY = y - centerY;
  
  // Clamp the movement but make it follow cursor
  const maxMove = props.textStrength;
  textTranslateX.value = Math.max(-maxMove, Math.min(maxMove, textOffsetX * 0.5));
  textTranslateY.value = Math.max(-maxMove, Math.min(maxMove, textOffsetY * 0.5));
  
  // Background gradient position
  bgX.value = (x / rect.width) * 100;
  bgY.value = (y / rect.height) * 100;
};

const onMouseLeave = () => {
  isHovering.value = false;
  translateX.value = 0;
  translateY.value = 0;
  textTranslateX.value = 0;
  textTranslateY.value = 0;
  bgX.value = 50;
  bgY.value = 50;
};
</script>

<style scoped>
.magnetic-button {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 1rem 2rem;
  
  background: transparent;
  border: 1px solid var(--primary, #10B981);
  border-radius: 4px;
  
  color: var(--primary, #10B981);
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  text-decoration: none;
  
  cursor: pointer;
  overflow: hidden;
  transition: transform 0.15s cubic-bezier(0.23, 1, 0.32, 1), 
              color 0.3s ease,
              border-color 0.3s ease;
}

.magnetic-button__text {
  position: relative;
  z-index: 2;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  transition: transform 0.08s cubic-bezier(0.23, 1, 0.32, 1);
  will-change: transform;
}

.magnetic-button__bg {
  position: absolute;
  inset: 0;
  z-index: 1;
  background: radial-gradient(
    circle at var(--bg-x, 50%) var(--bg-y, 50%),
    var(--primary, #10B981) 0%,
    transparent 70%
  );
  opacity: 0;
  transform: scale(0);
  transition: opacity 0.4s ease, transform 0.4s ease;
}

.magnetic-button--hovering .magnetic-button__bg {
  opacity: 0.15;
  transform: scale(2);
}

.magnetic-button--hovering {
  border-color: var(--primary, #10B981);
  color: #fff;
}

/* A11Y */
@media (prefers-reduced-motion: reduce) {
  .magnetic-button,
  .magnetic-button__text,
  .magnetic-button__bg {
    transition: none !important;
    transform: none !important;
  }
}
</style>
