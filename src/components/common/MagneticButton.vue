<template>
  <component
    :is="to ? 'router-link' : href ? 'a' : 'button'"
    :to="to"
    :href="href"
    :type="!to && !href ? type : undefined"
    class="magnetic-btn"
    :class="[`magnetic-btn--${variant}`, { 'magnetic-btn--large': large }]"
    ref="buttonRef"
    @mouseenter="handleMouseEnter"
    @mousemove="handleMouseMove"
    @mouseleave="handleMouseLeave"
  >
    <span class="magnetic-btn__content" ref="contentRef">
      <slot />
    </span>
  </component>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const props = defineProps({
  to: { type: String, default: null },
  href: { type: String, default: null },
  type: { type: String, default: 'button' },
  variant: { type: String, default: 'primary' }, // primary | outline
  large: { type: Boolean, default: false },
  strength: { type: Number, default: 0.3 } // Force de l'effet magnétique
});

const buttonRef = ref(null);
const contentRef = ref(null);
const isHovering = ref(false);

// Vérifier si on est sur desktop avec hover
const supportsHover = ref(false);

onMounted(() => {
  supportsHover.value = window.matchMedia('(hover: hover)').matches;
});

// Récupérer l'élément DOM réel (gère les composants Vue comme router-link)
const getElement = () => {
  if (!buttonRef.value) return null;
  // Si c'est un composant Vue, on récupère son $el
  return buttonRef.value.$el || buttonRef.value;
};

const handleMouseEnter = () => {
  if (!supportsHover.value) return;
  isHovering.value = true;
};

const handleMouseMove = (e) => {
  if (!supportsHover.value || !contentRef.value) return;
  
  const el = getElement();
  if (!el || !el.getBoundingClientRect) return;
  
  const rect = el.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  
  const deltaX = (e.clientX - centerX) * props.strength;
  const deltaY = (e.clientY - centerY) * props.strength;
  
  contentRef.value.style.transition = 'transform 0.1s ease-out';
  contentRef.value.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
};

const handleMouseLeave = () => {
  if (!supportsHover.value || !contentRef.value) return;
  isHovering.value = false;
  
  // Retour élastique
  contentRef.value.style.transition = 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
  contentRef.value.style.transform = 'translate(0, 0)';
};
</script>

<style scoped>
.magnetic-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.875rem 1.5rem;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.7rem;
  font-weight: 700;
  text-decoration: none;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
  position: relative;
  overflow: hidden;
}

.magnetic-btn--large {
  padding: 1rem 2rem;
  font-size: 0.8rem;
}

.magnetic-btn__content {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  pointer-events: none;
}

/* Primary Variant */
.magnetic-btn--primary {
  background: var(--primary);
  color: var(--bg);
  box-shadow: 0 4px 20px var(--primary-glow);
}

.magnetic-btn--primary:hover {
  background: var(--text-main);
  box-shadow: 0 6px 30px rgba(255, 255, 255, 0.2);
}

/* Outline Variant */
.magnetic-btn--outline {
  background: transparent;
  color: var(--text-muted);
  border: 1px solid var(--border);
}

.magnetic-btn--outline:hover {
  border-color: var(--text-main);
  color: var(--text-main);
}

/* Focus */
.magnetic-btn:focus-visible {
  outline: 2px solid var(--primary);
  outline-offset: 4px;
}
</style>
