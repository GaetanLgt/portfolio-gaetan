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

// Check if user is typing in an input
const isTyping = () => {
  const active = document.activeElement;
  return active && ['INPUT', 'TEXTAREA', 'SELECT'].includes(active.tagName);
};

// Handle keyboard events
const handleKeydown = (e) => {
  // Skip if typing in input or modal is open
  if (isTyping()) return;
  
  // Skip if Ctrl/Cmd/Alt is pressed
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

onMounted(() => {
  document.addEventListener('keydown', handleKeydown);
  window.addEventListener('show-help', handleShowHelp);
});

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown);
  window.removeEventListener('show-help', handleShowHelp);
  clearTimeout(gTimeout);
});
</script>
