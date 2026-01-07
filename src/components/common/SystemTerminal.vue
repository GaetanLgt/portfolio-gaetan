<template>
  <div class="system-terminal glass">
    <div class="terminal__header">
      <div class="terminal__dots">
        <span class="terminal__dot terminal__dot--red"></span>
        <span class="terminal__dot terminal__dot--yellow"></span>
        <span class="terminal__dot terminal__dot--green"></span>
      </div>
      <span class="terminal__title">{{ title }}</span>
      <div class="terminal__status">
        <span class="terminal__status-dot" :class="{ 'terminal__status-dot--active': isRunning }"></span>
        <span class="terminal__status-text">{{ isRunning ? 'LIVE' : 'IDLE' }}</span>
      </div>
    </div>
    
    <div class="terminal__body" ref="terminalBody">
      <div 
        v-for="(line, index) in displayedLines" 
        :key="index"
        class="terminal__line"
        :class="{
          'terminal__line--prompt': line.type === 'prompt',
          'terminal__line--output': line.type === 'output',
          'terminal__line--success': line.status === 'success',
          'terminal__line--warning': line.status === 'warning',
          'terminal__line--error': line.status === 'error',
          'terminal__line--highlight': line.highlight
        }"
      >
        <span v-if="line.type === 'prompt'" class="terminal__prompt">$</span>
        <span v-if="line.prefix" class="terminal__prefix">{{ line.prefix }}</span>
        <span class="terminal__text">{{ line.text }}</span>
        <span v-if="line.status === 'success'" class="terminal__check">✓</span>
        <span v-if="line.status === 'warning'" class="terminal__warn">⚠</span>
        <span v-if="line.status === 'error'" class="terminal__error">✗</span>
      </div>
      
      <!-- Cursor clignotant -->
      <div v-if="showCursor" class="terminal__cursor">
        <span class="terminal__prompt">$</span>
        <span class="terminal__cursor-blink">_</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from 'vue';

const props = defineProps({
  title: { type: String, default: 'gl@lab:~' },
  lines: { type: Array, default: () => [] },
  autoPlay: { type: Boolean, default: true },
  typeDelay: { type: Number, default: 150 },
  showCursor: { type: Boolean, default: true }
});

const terminalBody = ref(null);
const displayedLines = ref([]);
const isRunning = ref(false);

const scrollToBottom = async () => {
  await nextTick();
  if (terminalBody.value) {
    terminalBody.value.scrollTop = terminalBody.value.scrollHeight;
  }
};

const playSequence = async () => {
  isRunning.value = true;
  displayedLines.value = [];
  
  for (const line of props.lines) {
    await new Promise(resolve => setTimeout(resolve, props.typeDelay));
    displayedLines.value.push(line);
    await scrollToBottom();
  }
  
  isRunning.value = false;
};

onMounted(() => {
  if (props.autoPlay) {
    // Observer pour déclencher au scroll
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            playSequence();
            observer.disconnect();
          }
        });
      },
      { threshold: 0.3 }
    );
    
    if (terminalBody.value) {
      observer.observe(terminalBody.value);
    }
  } else {
    displayedLines.value = props.lines;
  }
});

watch(() => props.lines, () => {
  if (!props.autoPlay) {
    displayedLines.value = props.lines;
  }
});
</script>

<style scoped>
.system-terminal {
  border-radius: 0.75rem;
  border: 1px solid var(--border);
  overflow: hidden;
  font-family: 'JetBrains Mono', monospace;
}

/* Header */
.terminal__header {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 1rem;
  background: var(--surface-light);
  border-bottom: 1px solid var(--border);
}

.terminal__dots {
  display: flex;
  gap: 6px;
}

.terminal__dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--text-dark);
}

.terminal__dot--red { background: #EF4444; }
.terminal__dot--yellow { background: #F59E0B; }
.terminal__dot--green { background: #10B981; }

.terminal__title {
  font-size: 0.7rem;
  color: var(--text-dark);
  flex-grow: 1;
}

.terminal__status {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.terminal__status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--text-dark);
}

.terminal__status-dot--active {
  background: var(--primary);
  animation: pulse-slow 1.5s infinite;
}

.terminal__status-text {
  font-size: 0.55rem;
  color: var(--text-dark);
  letter-spacing: 0.1em;
}

/* Body */
.terminal__body {
  padding: 1rem;
  min-height: 150px;
  max-height: 300px;
  overflow-y: auto;
  background: var(--bg);
}

.terminal__line {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  padding: 0.25rem 0;
  font-size: 0.75rem;
  line-height: 1.5;
}

.terminal__prompt {
  color: var(--primary);
  flex-shrink: 0;
}

.terminal__prefix {
  color: var(--text-dark);
  flex-shrink: 0;
}

.terminal__text {
  color: var(--text-muted);
}

/* Line types */
.terminal__line--prompt .terminal__text {
  color: var(--text-main);
}

.terminal__line--output {
  padding-left: 1rem;
}

.terminal__line--success .terminal__text {
  color: var(--text-muted);
}

.terminal__line--warning .terminal__text {
  color: #F59E0B;
}

.terminal__line--error .terminal__text {
  color: #EF4444;
}

.terminal__line--highlight .terminal__text {
  color: var(--primary);
  font-weight: 600;
}

/* Status icons */
.terminal__check {
  color: var(--primary);
  margin-left: auto;
}

.terminal__warn {
  color: #F59E0B;
  margin-left: auto;
}

.terminal__error {
  color: #EF4444;
  margin-left: auto;
}

/* Cursor */
.terminal__cursor {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0;
  font-size: 0.75rem;
}

.terminal__cursor-blink {
  color: var(--primary);
  animation: blink 0.8s infinite;
}

@keyframes blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}

/* Scrollbar */
.terminal__body::-webkit-scrollbar {
  width: 4px;
}

.terminal__body::-webkit-scrollbar-track {
  background: var(--surface);
}

.terminal__body::-webkit-scrollbar-thumb {
  background: var(--border);
  border-radius: 2px;
}
</style>
