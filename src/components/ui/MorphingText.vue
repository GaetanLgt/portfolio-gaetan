<template>
  <span class="morphing-text" :class="{ 'morphing-text--animating': isAnimating }">
    <span 
      v-for="(char, index) in displayedChars" 
      :key="index"
      class="morphing-char"
      :style="{ '--delay': index * 30 + 'ms' }"
    >{{ char === ' ' ? '\u00A0' : char }}</span>
  </span>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';

const props = defineProps({
  texts: {
    type: Array,
    required: true
  },
  interval: { type: Number, default: 3000 },
  morphDuration: { type: Number, default: 1000 }
});

const currentIndex = ref(0);
const displayedText = ref('');
const isAnimating = ref(false);
let intervalId = null;

const displayedChars = computed(() => displayedText.value.split(''));

const morph = (fromText, toText) => {
  isAnimating.value = true;
  const maxLength = Math.max(fromText.length, toText.length);
  const steps = 20;
  let step = 0;
  
  const morphInterval = setInterval(() => {
    let result = '';
    const progress = step / steps;
    
    for (let i = 0; i < maxLength; i++) {
      const fromChar = fromText[i] || ' ';
      const toChar = toText[i] || ' ';
      
      if (fromChar === toChar) {
        result += toChar;
      } else if (progress < 0.5) {
        // First half: scramble
        if (Math.random() > progress * 2) {
          result += fromChar;
        } else {
          result += getRandomChar();
        }
      } else {
        // Second half: reveal
        if (Math.random() < (progress - 0.5) * 2) {
          result += toChar;
        } else {
          result += getRandomChar();
        }
      }
    }
    
    displayedText.value = result;
    step++;
    
    if (step > steps) {
      clearInterval(morphInterval);
      displayedText.value = toText;
      isAnimating.value = false;
    }
  }, props.morphDuration / steps);
};

const getRandomChar = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&*';
  return chars[Math.floor(Math.random() * chars.length)];
};

const nextText = () => {
  const fromText = props.texts[currentIndex.value];
  currentIndex.value = (currentIndex.value + 1) % props.texts.length;
  const toText = props.texts[currentIndex.value];
  morph(fromText, toText);
};

onMounted(() => {
  displayedText.value = props.texts[0];
  intervalId = setInterval(nextText, props.interval);
});

onUnmounted(() => {
  clearInterval(intervalId);
});

// Watch for texts changes
watch(() => props.texts, () => {
  currentIndex.value = 0;
  displayedText.value = props.texts[0];
});
</script>

<style scoped>
.morphing-text {
  display: inline-block;
}

.morphing-char {
  display: inline-block;
  transition: transform 0.1s ease, opacity 0.1s ease;
  transition-delay: var(--delay);
}

.morphing-text--animating .morphing-char {
  animation: charMorph 0.1s ease;
}

@keyframes charMorph {
  0%, 100% {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
  50% {
    transform: translateY(-2px) scale(1.1);
    opacity: 0.8;
  }
}

/* A11Y */
@media (prefers-reduced-motion: reduce) {
  .morphing-char {
    animation: none !important;
    transition: none !important;
  }
}
</style>
