<template>
  <span class="typewriter" :class="{ 'typewriter--done': isDone }">
    <span class="typewriter__text">{{ displayedText }}</span>
    <span 
      v-if="showCursor" 
      class="typewriter__cursor"
      :class="{ 'typewriter__cursor--blinking': !isTyping }"
      aria-hidden="true"
    >{{ cursor }}</span>
  </span>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue';

const props = defineProps({
  text: { type: String, required: true },
  speed: { type: Number, default: 50 },
  delay: { type: Number, default: 0 },
  cursor: { type: String, default: '|' },
  showCursor: { type: Boolean, default: true },
  loop: { type: Boolean, default: false },
  loopDelay: { type: Number, default: 2000 },
  deleteSpeed: { type: Number, default: 30 }
});

const emit = defineEmits(['complete', 'start']);

const displayedText = ref('');
const isTyping = ref(false);
const isDone = ref(false);
let timeoutId = null;
let intervalId = null;

const typeText = () => {
  isTyping.value = true;
  emit('start');
  
  let index = 0;
  displayedText.value = '';
  
  intervalId = setInterval(() => {
    if (index < props.text.length) {
      displayedText.value += props.text[index];
      index++;
    } else {
      clearInterval(intervalId);
      isTyping.value = false;
      isDone.value = true;
      emit('complete');
      
      if (props.loop) {
        timeoutId = setTimeout(deleteText, props.loopDelay);
      }
    }
  }, props.speed);
};

const deleteText = () => {
  isTyping.value = true;
  isDone.value = false;
  
  intervalId = setInterval(() => {
    if (displayedText.value.length > 0) {
      displayedText.value = displayedText.value.slice(0, -1);
    } else {
      clearInterval(intervalId);
      timeoutId = setTimeout(typeText, props.delay);
    }
  }, props.deleteSpeed);
};

const start = () => {
  timeoutId = setTimeout(typeText, props.delay);
};

const stop = () => {
  clearTimeout(timeoutId);
  clearInterval(intervalId);
  isTyping.value = false;
};

const reset = () => {
  stop();
  displayedText.value = '';
  isDone.value = false;
};

// Expose methods
defineExpose({ start, stop, reset });

watch(() => props.text, () => {
  reset();
  start();
});

onMounted(() => {
  start();
});

onUnmounted(() => {
  stop();
});
</script>

<style scoped>
.typewriter {
  display: inline;
}

.typewriter__text {
  white-space: pre-wrap;
}

.typewriter__cursor {
  display: inline-block;
  margin-left: 2px;
  font-weight: 400;
  color: var(--primary, #10B981);
}

.typewriter__cursor--blinking {
  animation: cursorBlink 1s step-end infinite;
}

@keyframes cursorBlink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

/* A11Y */
@media (prefers-reduced-motion: reduce) {
  .typewriter__cursor--blinking {
    animation: none;
    opacity: 1;
  }
}
</style>
