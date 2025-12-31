<template>
  <div 
    class="card" 
    :class="{ 
      'card--hoverable': hoverable,
      'card--active': active 
    }"
    @click="handleClick"
  >
    <div v-if="$slots.icon" class="card__icon">
      <slot name="icon" />
    </div>
    
    <h3 v-if="title" class="card__title">{{ title }}</h3>
    
    <div class="card__content">
      <slot />
    </div>
    
    <div v-if="$slots.footer" class="card__footer">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  title: String,
  hoverable: {
    type: Boolean,
    default: false
  },
  active: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['click']);

const handleClick = () => {
  if (props.hoverable) {
    emit('click');
  }
};
</script>

<style scoped>
.card {
  background: var(--card-bg);
  border: 1px solid var(--border-subtle);
  border-radius: 12px;
  padding: var(--space-md);
  backdrop-filter: blur(10px);
  transition: all var(--transition-base);
}

.card--hoverable {
  cursor: pointer;
}

.card--hoverable:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-glow);
  border-color: var(--matrix-green);
}

.card--active {
  border-color: var(--matrix-green);
  box-shadow: var(--shadow-glow);
}

.card__icon {
  font-size: 2rem;
  margin-bottom: var(--space-sm);
  color: var(--matrix-green);
}

.card__title {
  font-size: 1.5rem;
  margin-bottom: var(--space-sm);
  color: var(--text-primary);
}

.card__content {
  color: var(--text-secondary);
}

.card__footer {
  margin-top: var(--space-md);
  padding-top: var(--space-sm);
  border-top: 1px solid var(--border-subtle);
}
</style>
