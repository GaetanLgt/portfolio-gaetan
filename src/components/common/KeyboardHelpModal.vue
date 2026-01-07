<template>
  <Teleport to="body">
    <Transition name="modal">
      <div 
        v-if="isOpen" 
        class="help-modal-overlay"
        @click.self="close"
        @keydown.esc="close"
      >
        <div class="help-modal" role="dialog" aria-modal="true" aria-labelledby="help-title">
          <div class="modal-header">
            <h2 id="help-title">⌨️ Raccourcis Clavier</h2>
            <button class="modal-close" @click="close" aria-label="Fermer">✕</button>
          </div>
          
          <div class="modal-content">
            <!-- Navigation -->
            <div class="shortcut-group">
              <h3>🧭 Navigation</h3>
              <div class="shortcut-list">
                <div class="shortcut-item">
                  <div class="shortcut-keys">
                    <kbd>Ctrl</kbd><span>+</span><kbd>K</kbd>
                  </div>
                  <span class="shortcut-desc">Ouvrir la palette de commandes</span>
                </div>
                <div class="shortcut-item">
                  <div class="shortcut-keys">
                    <kbd>/</kbd>
                  </div>
                  <span class="shortcut-desc">Recherche rapide</span>
                </div>
                <div class="shortcut-item">
                  <div class="shortcut-keys">
                    <kbd>G</kbd><span>puis</span><kbd>H</kbd>
                  </div>
                  <span class="shortcut-desc">Aller à l'accueil</span>
                </div>
                <div class="shortcut-item">
                  <div class="shortcut-keys">
                    <kbd>G</kbd><span>puis</span><kbd>M</kbd>
                  </div>
                  <span class="shortcut-desc">Aller au Multivers</span>
                </div>
                <div class="shortcut-item">
                  <div class="shortcut-keys">
                    <kbd>G</kbd><span>puis</span><kbd>C</kbd>
                  </div>
                  <span class="shortcut-desc">Aller au Contact</span>
                </div>
                <div class="shortcut-item">
                  <div class="shortcut-keys">
                    <kbd>G</kbd><span>puis</span><kbd>S</kbd>
                  </div>
                  <span class="shortcut-desc">Aller aux Services</span>
                </div>
              </div>
            </div>
            
            <!-- Actions -->
            <div class="shortcut-group">
              <h3>⚡ Actions</h3>
              <div class="shortcut-list">
                <div class="shortcut-item">
                  <div class="shortcut-keys">
                    <kbd>S</kbd>
                  </div>
                  <span class="shortcut-desc">Toggle son ambiant</span>
                </div>
                <div class="shortcut-item">
                  <div class="shortcut-keys">
                    <kbd>A</kbd>
                  </div>
                  <span class="shortcut-desc">Voir les achievements</span>
                </div>
                <div class="shortcut-item">
                  <div class="shortcut-keys">
                    <kbd>R</kbd>
                  </div>
                  <span class="shortcut-desc">Univers aléatoire</span>
                </div>
                <div class="shortcut-item">
                  <div class="shortcut-keys">
                    <kbd>?</kbd>
                  </div>
                  <span class="shortcut-desc">Afficher cette aide</span>
                </div>
              </div>
            </div>
            
            <!-- Easter Eggs -->
            <div class="shortcut-group">
              <h3>🥚 Easter Eggs</h3>
              <div class="shortcut-list">
                <div class="shortcut-item shortcut-item--secret">
                  <div class="shortcut-keys">
                    <kbd>↑</kbd><kbd>↑</kbd><kbd>↓</kbd><kbd>↓</kbd><kbd>←</kbd><kbd>→</kbd><kbd>←</kbd><kbd>→</kbd><kbd>B</kbd><kbd>A</kbd>
                  </div>
                  <span class="shortcut-desc">Konami Code</span>
                </div>
                <div class="shortcut-item shortcut-item--secret">
                  <div class="shortcut-keys">
                    <kbd>M</kbd><kbd>A</kbd><kbd>T</kbd><kbd>R</kbd><kbd>I</kbd><kbd>X</kbd>
                  </div>
                  <span class="shortcut-desc">Matrix Rain</span>
                </div>
              </div>
            </div>
            
            <!-- Général -->
            <div class="shortcut-group">
              <h3>🎯 Général</h3>
              <div class="shortcut-list">
                <div class="shortcut-item">
                  <div class="shortcut-keys">
                    <kbd>Esc</kbd>
                  </div>
                  <span class="shortcut-desc">Fermer les modales</span>
                </div>
                <div class="shortcut-item">
                  <div class="shortcut-keys">
                    <kbd>Tab</kbd>
                  </div>
                  <span class="shortcut-desc">Navigation au clavier</span>
                </div>
                <div class="shortcut-item">
                  <div class="shortcut-keys">
                    <kbd>↑</kbd><kbd>↓</kbd>
                  </div>
                  <span class="shortcut-desc">Naviguer dans les listes</span>
                </div>
                <div class="shortcut-item">
                  <div class="shortcut-keys">
                    <kbd>Enter</kbd>
                  </div>
                  <span class="shortcut-desc">Sélectionner / Valider</span>
                </div>
              </div>
            </div>
          </div>
          
          <div class="modal-footer">
            <span class="footer-tip">💡 Appuie sur <kbd>?</kbd> à tout moment pour afficher cette aide</span>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const isOpen = ref(false);

const open = () => {
  isOpen.value = true;
};

const close = () => {
  isOpen.value = false;
};

const toggle = () => {
  isOpen.value ? close() : open();
};

// Event listener
const handleShowHelp = () => {
  open();
};

// Expose methods
defineExpose({ open, close, toggle });

onMounted(() => {
  window.addEventListener('show-help', handleShowHelp);
});

onUnmounted(() => {
  window.removeEventListener('show-help', handleShowHelp);
});
</script>

<style scoped>
.help-modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 99999;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.help-modal {
  width: 100%;
  max-width: 700px;
  max-height: 85vh;
  background: linear-gradient(180deg, #1a1a24, #12121a);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.modal-header h2 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #fff;
  margin: 0;
}

.modal-close {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 8px;
  color: rgba(255, 255, 255, 0.6);
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
}

.modal-close:hover {
  background: rgba(255, 255, 255, 0.15);
  color: #fff;
}

.modal-content {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
}

.shortcut-group h3 {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--primary, #10B981);
  margin: 0 0 0.75rem 0;
}

.shortcut-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.shortcut-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.5rem 0.75rem;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 8px;
  transition: background 0.2s;
}

.shortcut-item:hover {
  background: rgba(255, 255, 255, 0.06);
}

.shortcut-item--secret {
  background: rgba(255, 215, 0, 0.05);
  border: 1px solid rgba(255, 215, 0, 0.1);
}

.shortcut-item--secret .shortcut-desc {
  color: #ffd700;
}

.shortcut-keys {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  flex-shrink: 0;
}

.shortcut-keys kbd {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 24px;
  height: 24px;
  padding: 0 0.4rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 4px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.65rem;
  color: rgba(255, 255, 255, 0.8);
  box-shadow: 0 2px 0 rgba(0, 0, 0, 0.3);
}

.shortcut-keys span {
  font-size: 0.6rem;
  color: rgba(255, 255, 255, 0.3);
  margin: 0 0.15rem;
}

.shortcut-desc {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.6);
  text-align: right;
}

.modal-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(0, 0, 0, 0.2);
}

.footer-tip {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.4);
}

.footer-tip kbd {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 18px;
  height: 18px;
  padding: 0 0.3rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.6rem;
  color: rgba(255, 255, 255, 0.6);
  margin: 0 0.2rem;
}

/* Transitions */
.modal-enter-active {
  transition: all 0.25s ease-out;
}

.modal-leave-active {
  transition: all 0.2s ease-in;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .help-modal,
.modal-leave-to .help-modal {
  transform: scale(0.95);
  opacity: 0;
}

/* Scrollbar */
.modal-content::-webkit-scrollbar {
  width: 6px;
}

.modal-content::-webkit-scrollbar-track {
  background: transparent;
}

.modal-content::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
}

/* Responsive */
@media (max-width: 640px) {
  .help-modal-overlay {
    padding: 1rem;
  }
  
  .modal-content {
    grid-template-columns: 1fr;
  }
  
  .shortcut-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .shortcut-desc {
    text-align: left;
  }
}
</style>
