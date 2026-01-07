<template>
  <!-- Ce composant est invisible, il gère uniquement les événements clavier -->
  <KeyboardHelpModal ref="helpModalRef" />
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import KeyboardHelpModal from './KeyboardHelpModal.vue';

const router = useRouter();
const helpModalRef = ref(null);

// State for key sequences
let gPressed = false;
let gTimeout = null;

// Universes for random navigation
const universes = [
  '/matrix', '/matrix-resurrections', '/tron', '/blade-runner', '/inception',
  '/ghost-in-the-shell', '/minority-report', '/iron-man', '/dragon-ball-z',
  '/deadpool', '/the-mask', '/v-for-vendetta', '/ready-player-one',
  '/cloud-atlas', '/jupiter-ascending', '/howard-the-duck', '/alice-turing',
  '/asimov', '/mecha-mascot', '/jardin-de-mam'
];

// Check if user is typing in an input
const isTyping = () => {
  const active = document.activeElement;
  return active && ['INPUT', 'TEXTAREA', 'SELECT'].includes(active.tagName);
};

// Handle keyboard events
const handleKeydown = (e) => {
  // Skip if typing in input or modal is open
  if (isTyping()) return;
  
  // Skip if Ctrl/Cmd/Alt is pressed (except for Ctrl+K which is handled by CommandPalette)
  if (e.ctrlKey || e.metaKey || e.altKey) return;
  
  const key = e.key.toLowerCase();
  
  // G + key navigation sequences
  if (gPressed) {
    gPressed = false;
    clearTimeout(gTimeout);
    
    switch (key) {
      case 'h':
        e.preventDefault();
        router.push('/');
        showToast('🏠 Accueil');
        break;
      case 'm':
        e.preventDefault();
        router.push('/multivers');
        showToast('🌌 Multivers');
        break;
      case 'c':
        e.preventDefault();
        router.push('/contact');
        showToast('📧 Contact');
        break;
      case 's':
        e.preventDefault();
        router.push('/services');
        showToast('⚡ Services');
        break;
    }
    return;
  }
  
  // Single key shortcuts
  switch (key) {
    case 'g':
      // Start G sequence
      gPressed = true;
      gTimeout = setTimeout(() => {
        gPressed = false;
      }, 1000);
      break;
      
    case 's':
      // Toggle sound
      e.preventDefault();
      window.dispatchEvent(new CustomEvent('toggle-sound'));
      break;
      
    case 'a':
      // Show achievements
      e.preventDefault();
      window.dispatchEvent(new CustomEvent('show-achievements'));
      break;
      
    case 'r':
      // Random universe
      e.preventDefault();
      const randomUniverse = universes[Math.floor(Math.random() * universes.length)];
      router.push(randomUniverse);
      showToast('🎲 Téléportation aléatoire !');
      window.dispatchEvent(new CustomEvent('confetti', { detail: { preset: 'sides' } }));
      break;
      
    case '?':
      // Show help
      e.preventDefault();
      helpModalRef.value?.open();
      break;
  }
};

// Show toast helper
const showToast = (message) => {
  window.dispatchEvent(new CustomEvent('toast', {
    detail: { type: 'info', message, duration: 2000 }
  }));
};

// Listen for custom events
const handleShowHelp = () => {
  helpModalRef.value?.open();
};

const handleShowAchievements = () => {
  // Dispatch to achievements system
  const achievementsBtn = document.querySelector('.stats-button');
  if (achievementsBtn) {
    achievementsBtn.click();
  }
};

const handleToggleSound = () => {
  const soundBtn = document.querySelector('.sound-toggle');
  if (soundBtn) {
    soundBtn.click();
  }
};

onMounted(() => {
  document.addEventListener('keydown', handleKeydown);
  window.addEventListener('show-help', handleShowHelp);
  window.addEventListener('show-achievements', handleShowAchievements);
  window.addEventListener('toggle-sound', handleToggleSound);
});

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown);
  window.removeEventListener('show-help', handleShowHelp);
  window.removeEventListener('show-achievements', handleShowAchievements);
  window.removeEventListener('toggle-sound', handleToggleSound);
  clearTimeout(gTimeout);
});
</script>
