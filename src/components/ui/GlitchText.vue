<template>
  <span 
    class="glitch-text"
    :class="{ 'glitch-text--active': isActive || alwaysActive }"
    :data-text="text"
    @mouseenter="onMouseEnter"
    @mouseleave="onMouseLeave"
  >
    <span class="glitch-text__main">{{ text }}</span>
    <span class="glitch-text__clone glitch-text__clone--1" aria-hidden="true">{{ text }}</span>
    <span class="glitch-text__clone glitch-text__clone--2" aria-hidden="true">{{ text }}</span>
  </span>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  text: { type: String, required: true },
  alwaysActive: { type: Boolean, default: false },
  intensity: { type: String, default: 'medium' } // light, medium, heavy
});

const isActive = ref(false);

const onMouseEnter = () => {
  isActive.value = true;
};

const onMouseLeave = () => {
  isActive.value = false;
};
</script>

<style scoped>
.glitch-text {
  position: relative;
  display: inline-block;
  font-weight: inherit;
  font-size: inherit;
  color: inherit;
}

.glitch-text__main {
  position: relative;
  z-index: 1;
}

.glitch-text__clone {
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0;
  pointer-events: none;
}

/* Active state */
.glitch-text--active .glitch-text__clone {
  opacity: 0.8;
}

.glitch-text--active .glitch-text__clone--1 {
  color: #00ffff;
  animation: glitch1 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) infinite;
  clip-path: polygon(0 0, 100% 0, 100% 45%, 0 45%);
}

.glitch-text--active .glitch-text__clone--2 {
  color: #ff00ff;
  animation: glitch2 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) infinite reverse;
  clip-path: polygon(0 55%, 100% 55%, 100% 100%, 0 100%);
}

@keyframes glitch1 {
  0% {
    transform: translate(0);
  }
  20% {
    transform: translate(-3px, 3px);
  }
  40% {
    transform: translate(-3px, -3px);
  }
  60% {
    transform: translate(3px, 3px);
  }
  80% {
    transform: translate(3px, -3px);
  }
  100% {
    transform: translate(0);
  }
}

@keyframes glitch2 {
  0% {
    transform: translate(0);
  }
  20% {
    transform: translate(3px, -3px);
  }
  40% {
    transform: translate(3px, 3px);
  }
  60% {
    transform: translate(-3px, -3px);
  }
  80% {
    transform: translate(-3px, 3px);
  }
  100% {
    transform: translate(0);
  }
}

/* Intensity variants */
.glitch-text--light.glitch-text--active .glitch-text__clone--1,
.glitch-text--light.glitch-text--active .glitch-text__clone--2 {
  opacity: 0.4;
  animation-duration: 0.5s;
}

.glitch-text--heavy.glitch-text--active .glitch-text__clone--1,
.glitch-text--heavy.glitch-text--active .glitch-text__clone--2 {
  opacity: 1;
  animation-duration: 0.15s;
}

/* A11Y */
@media (prefers-reduced-motion: reduce) {
  .glitch-text__clone {
    display: none;
  }
}
</style>
