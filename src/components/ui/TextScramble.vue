<template>
  <div 
    class="text-scramble"
    :class="{ 'text-scramble--active': isAnimating }"
    @mouseenter="onMouseEnter"
    @mouseleave="onMouseLeave"
  >
    {{ displayedText }}
  </div>
</template>

<script setup>
import { ref, watch, onUnmounted } from 'vue';

const props = defineProps({
  text: { type: String, required: true },
  scrambleOnHover: { type: Boolean, default: true },
  scrambleOnMount: { type: Boolean, default: false },
  characters: { type: String, default: '!<>-_\\/[]{}—=+*^?#________' },
  speed: { type: Number, default: 30 },
  revealDelay: { type: Number, default: 50 }
});

const emit = defineEmits(['complete']);

const displayedText = ref(props.text);
const isAnimating = ref(false);
let frameRequest = null;
let queue = [];

class TextScrambler {
  constructor(chars) {
    this.chars = chars;
  }
  
  randomChar() {
    return this.chars[Math.floor(Math.random() * this.chars.length)];
  }
}

const scrambler = new TextScrambler(props.characters);

const scramble = (newText) => {
  const oldText = displayedText.value;
  const length = Math.max(oldText.length, newText.length);
  queue = [];
  
  for (let i = 0; i < length; i++) {
    const from = oldText[i] || '';
    const to = newText[i] || '';
    const start = Math.floor(Math.random() * 40);
    const end = start + Math.floor(Math.random() * 40);
    queue.push({ from, to, start, end });
  }
  
  cancelAnimationFrame(frameRequest);
  isAnimating.value = true;
  let frame = 0;
  
  const update = () => {
    let output = '';
    let complete = 0;
    
    for (let i = 0; i < queue.length; i++) {
      let { from, to, start, end, char } = queue[i];
      
      if (frame >= end) {
        complete++;
        output += to;
      } else if (frame >= start) {
        if (!char || Math.random() < 0.28) {
          char = scrambler.randomChar();
          queue[i].char = char;
        }
        output += char;
      } else {
        output += from;
      }
    }
    
    displayedText.value = output;
    
    if (complete === queue.length) {
      isAnimating.value = false;
      emit('complete');
    } else {
      frameRequest = requestAnimationFrame(update);
      frame++;
    }
  };
  
  update();
};

const onMouseEnter = () => {
  if (props.scrambleOnHover) {
    scramble(props.text);
  }
};

const onMouseLeave = () => {
  // Reset to original text
  displayedText.value = props.text;
};

// Watch for text changes
watch(() => props.text, (newText) => {
  if (props.scrambleOnMount) {
    scramble(newText);
  } else {
    displayedText.value = newText;
  }
}, { immediate: props.scrambleOnMount });

// Expose scramble method
defineExpose({ scramble });

onUnmounted(() => {
  cancelAnimationFrame(frameRequest);
});
</script>

<style scoped>
.text-scramble {
  display: inline-block;
  font-family: 'JetBrains Mono', monospace;
}

.text-scramble--active {
  color: var(--primary, #10B981);
}

/* A11Y */
@media (prefers-reduced-motion: reduce) {
  .text-scramble--active {
    color: inherit;
  }
}
</style>
