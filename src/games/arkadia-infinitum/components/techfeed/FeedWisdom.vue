<template>
  <section class="wisdom-terminal">
    <div class="terminal-chrome">
      <div class="chrome-dots">
        <span></span><span></span><span></span>
      </div>
      <span class="chrome-title">WISDOM.exe</span>
    </div>
    <div class="terminal-body">
      <div class="terminal-prefix">
        <span class="prefix-icon">💬</span>
        <span class="prefix-label">CITATION DU JOUR</span>
      </div>
      <blockquote class="terminal-quote">
        <Transition name="quote-fade" mode="out-in">
          <div :key="quote.text">
            <p class="quote-text">"{{ quote.text }}"</p>
            <footer v-if="quote.author" class="quote-author">— {{ quote.author }}</footer>
          </div>
        </Transition>
      </blockquote>
      <button class="quote-shuffle" @click="$emit('shuffle')">
        <span class="shuffle-icon">🔀</span>
        <span>SHUFFLE</span>
      </button>
    </div>
  </section>
</template>

<script setup>
defineProps({
  quote: Object
});

defineEmits(['shuffle']);
</script>

<style scoped>
.wisdom-terminal {
  margin: 1.5rem 2rem;
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(0, 255, 136, 0.2);
  border-radius: 12px;
  overflow: hidden;
  flex-shrink: 0;
}

.terminal-chrome {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.6rem 1rem;
  background: rgba(0, 255, 136, 0.05);
  border-bottom: 1px solid rgba(0, 255, 136, 0.1);
}

.chrome-dots {
  display: flex;
  gap: 0.3rem;
}

.chrome-dots span {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.chrome-dots span:nth-child(1) { background: #ff5f56; }
.chrome-dots span:nth-child(2) { background: #ffbd2e; }
.chrome-dots span:nth-child(3) { background: #27ca40; }

.chrome-title {
  font-size: 0.65rem;
  letter-spacing: 0.1em;
  color: rgba(0, 255, 136, 0.35);
}

.terminal-body {
  padding: 1.25rem;
}

.terminal-prefix {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.prefix-icon {
  font-size: 1rem;
}

.prefix-label {
  font-size: 0.6rem;
  letter-spacing: 0.15em;
  color: rgba(0, 255, 136, 0.35);
}

.terminal-quote {
  margin: 0;
  padding: 0;
  border: none;
}

.quote-text {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1.1rem;
  font-style: italic;
  line-height: 1.6;
  color: #00ff88;
  margin: 0 0 0.5rem 0;
  text-shadow: 0 0 20px rgba(0, 255, 136, 0.3);
}

.quote-author {
  font-size: 0.75rem;
  color: rgba(0, 255, 136, 0.6);
  text-align: right;
}

.quote-shuffle {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background: transparent;
  border: 1px solid rgba(0, 255, 136, 0.25);
  border-radius: 6px;
  color: rgba(0, 255, 136, 0.6);
  font-family: inherit;
  font-size: 0.65rem;
  letter-spacing: 0.05em;
  cursor: pointer;
  transition: all 0.25s;
}

.quote-shuffle:hover {
  border-color: #00ff88;
  color: #00ff88;
  background: rgba(0, 255, 136, 0.05);
}

.shuffle-icon {
  transition: transform 0.3s;
}

.quote-shuffle:hover .shuffle-icon {
  transform: rotate(180deg);
}

/* Transition */
.quote-fade-enter-active,
.quote-fade-leave-active {
  transition: all 0.3s ease;
}

.quote-fade-enter-from,
.quote-fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

@media (max-width: 600px) {
  .wisdom-terminal {
    margin: 1rem;
  }
}
</style>
