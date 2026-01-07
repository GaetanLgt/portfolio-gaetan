<template>
  <Teleport to="body">
    <Transition name="palette">
      <div 
        v-if="isOpen" 
        class="command-palette-overlay"
        @click.self="close"
        @keydown.esc="close"
      >
        <div class="command-palette" role="dialog" aria-modal="true" aria-labelledby="palette-title">
          <!-- Search Input -->
          <div class="palette-header">
            <span class="palette-icon">⌘</span>
            <input
              ref="inputRef"
              v-model="query"
              type="text"
              class="palette-input"
              placeholder="Rechercher une page, un univers, une action..."
              aria-labelledby="palette-title"
              @keydown.down.prevent="navigateDown"
              @keydown.up.prevent="navigateUp"
              @keydown.enter.prevent="executeSelected"
            />
            <kbd class="palette-kbd">ESC</kbd>
          </div>
          
          <!-- Results -->
          <div class="palette-results" role="listbox">
            <!-- Pages -->
            <div v-if="filteredPages.length" class="result-group">
              <div class="result-group__label">Pages</div>
              <button
                v-for="(item, index) in filteredPages"
                :key="'page-' + item.path"
                class="result-item"
                :class="{ 'result-item--selected': selectedIndex === index }"
                role="option"
                :aria-selected="selectedIndex === index"
                @click="execute(item)"
                @mouseenter="selectedIndex = index"
              >
                <span class="result-icon">{{ item.icon }}</span>
                <div class="result-content">
                  <span class="result-title">{{ item.name }}</span>
                  <span class="result-path">{{ item.path }}</span>
                </div>
                <kbd class="result-kbd" v-if="item.shortcut">{{ item.shortcut }}</kbd>
              </button>
            </div>
            
            <!-- Univers -->
            <div v-if="filteredUniverses.length" class="result-group">
              <div class="result-group__label">🌌 Multivers</div>
              <button
                v-for="(item, index) in filteredUniverses"
                :key="'universe-' + item.path"
                class="result-item"
                :class="{ 'result-item--selected': selectedIndex === filteredPages.length + index }"
                :style="{ '--accent': item.color }"
                role="option"
                @click="execute(item)"
                @mouseenter="selectedIndex = filteredPages.length + index"
              >
                <span class="result-icon">{{ item.icon }}</span>
                <div class="result-content">
                  <span class="result-title">{{ item.name }}</span>
                  <span class="result-tagline">{{ item.tagline }}</span>
                </div>
                <span class="result-year">{{ item.year }}</span>
              </button>
            </div>
            
            <!-- Actions -->
            <div v-if="filteredActions.length" class="result-group">
              <div class="result-group__label">⚡ Actions</div>
              <button
                v-for="(item, index) in filteredActions"
                :key="'action-' + item.id"
                class="result-item"
                :class="{ 'result-item--selected': selectedIndex === filteredPages.length + filteredUniverses.length + index }"
                role="option"
                @click="executeAction(item)"
                @mouseenter="selectedIndex = filteredPages.length + filteredUniverses.length + index"
              >
                <span class="result-icon">{{ item.icon }}</span>
                <div class="result-content">
                  <span class="result-title">{{ item.name }}</span>
                  <span class="result-desc">{{ item.description }}</span>
                </div>
                <kbd class="result-kbd" v-if="item.shortcut">{{ item.shortcut }}</kbd>
              </button>
            </div>
            
            <!-- Empty State -->
            <div v-if="!hasResults" class="result-empty">
              <span class="empty-icon">🔍</span>
              <p>Aucun résultat pour "{{ query }}"</p>
              <span class="empty-hint">Essayez "matrix", "contact", ou "achievements"</span>
            </div>
          </div>
          
          <!-- Footer -->
          <div class="palette-footer">
            <div class="footer-hints">
              <span><kbd>↑↓</kbd> naviguer</span>
              <span><kbd>↵</kbd> sélectionner</span>
              <span><kbd>esc</kbd> fermer</span>
            </div>
            <span class="footer-brand">GL Digital Lab</span>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const isOpen = ref(false);
const query = ref('');
const selectedIndex = ref(0);
const inputRef = ref(null);

// Pages principales
const pages = [
  { name: 'Accueil', path: '/', icon: '🏠', shortcut: 'G H' },
  { name: 'Services', path: '/services', icon: '⚡', shortcut: 'G S' },
  { name: 'Contact', path: '/contact', icon: '📧', shortcut: 'G C' },
  { name: 'Parcours', path: '/parcours', icon: '🎮' },
  { name: 'Stack IA', path: '/stack-ia', icon: '🧠' },
  { name: 'Arkadia Case Study', path: '/arkadia', icon: '🦖' },
  { name: 'ARK Admin Portal', path: '/ark-admin', icon: '⚙️' },
  { name: 'VoyageoPro Case Study', path: '/voyageo-pro', icon: '✈️' },
  { name: 'Tutoriels', path: '/ressources/tutoriels', icon: '📖' },
  { name: 'Arcade', path: '/arcade', icon: '🕹️' },
  { name: 'Mon CV', path: '/cv', icon: '📄' },
  { name: 'GL Tower Hub', path: '/hub', icon: '🏢' },
  { name: 'Carte Holistique', path: '/carte-holistique', icon: '🗺️' },
  { name: 'Multivers Hub', path: '/multivers', icon: '🌌', shortcut: 'G M' },
];

// Univers
const universes = [
  { name: 'The Matrix', path: '/matrix', icon: '💊', tagline: 'Réveille-toi Neo...', year: '1999', color: '#00ff41' },
  { name: 'Matrix Resurrections', path: '/matrix-resurrections', icon: '🔴', tagline: 'Retour à la Matrice', year: '2021', color: '#ff0040' },
  { name: 'TRON', path: '/tron', icon: '💠', tagline: 'Je me bats pour les utilisateurs', year: '1982', color: '#00f5ff' },
  { name: 'Blade Runner', path: '/blade-runner', icon: '🌧️', tagline: 'More human than human', year: '1982', color: '#f97316' },
  { name: 'Inception', path: '/inception', icon: '🌀', tagline: 'Architecture des rêves', year: '2010', color: '#d4af37' },
  { name: 'Ghost in the Shell', path: '/ghost-in-the-shell', icon: '🧠', tagline: 'Le réseau est vaste', year: '1995', color: '#06b6d4' },
  { name: 'Minority Report', path: '/minority-report', icon: '👁️', tagline: 'Le futur peut être vu', year: '2002', color: '#3b82f6' },
  { name: 'Iron Man', path: '/iron-man', icon: '🦾', tagline: 'Je suis Iron Man', year: '2008', color: '#dc2626' },
  { name: 'Dragon Ball Z', path: '/dragon-ball-z', icon: '🔥', tagline: 'C\'EST PLUS DE 9000 !!!', year: '1989', color: '#f97316' },
  { name: 'Deadpool', path: '/deadpool', icon: '💀', tagline: 'Maximum Effort', year: '2016', color: '#ef4444' },
  { name: 'The Mask', path: '/the-mask', icon: '🎭', tagline: 'SSSSMOKIN!', year: '1994', color: '#22c55e' },
  { name: 'V pour Vendetta', path: '/v-for-vendetta', icon: '🎭', tagline: 'Les idées sont à l\'épreuve des balles', year: '2005', color: '#991b1b' },
  { name: 'Ready Player One', path: '/ready-player-one', icon: '🎮', tagline: 'Bienvenue dans l\'OASIS', year: '2018', color: '#00f5ff' },
  { name: 'Cloud Atlas', path: '/cloud-atlas', icon: '☁️', tagline: 'Six époques, une âme', year: '2012', color: '#60a5fa' },
  { name: 'Jupiter Ascending', path: '/jupiter-ascending', icon: '🪐', tagline: 'L\'héritière', year: '2015', color: '#a855f7' },
  { name: 'Howard the Duck', path: '/howard-the-duck', icon: '🦆', tagline: 'Perle rare héroïque', year: '1986', color: '#fbbf24' },
  { name: 'Alice in Turingland', path: '/alice-turing', icon: '🐰', tagline: 'Pays des merveilles logique', year: '1865+', color: '#ec4899' },
  { name: 'Asimov', path: '/asimov', icon: '🤖', tagline: 'Les trois lois', year: '1950', color: '#94a3b8' },
  { name: 'GL Spirit', path: '/mecha-mascot', icon: '🌿', tagline: 'Mascotte Ghibli', year: '2024', color: '#10b981' },
  { name: 'Le Jardin de Mam\'', path: '/jardin-de-mam', icon: '🌸', tagline: 'Pour elle, avec amour', year: '2024', color: '#f472b6' },
  { name: 'Samus & Les Éléments', path: '/samus-elements', icon: '🔥', tagline: '19/20 au collège', year: '200X', color: '#fbbf24' },
];

// Actions
const actions = [
  { id: 'toggle-sound', name: 'Toggle Son', icon: '🔊', description: 'Activer/désactiver l\'ambiance sonore', shortcut: 'S' },
  { id: 'show-achievements', name: 'Achievements', icon: '🏆', description: 'Voir vos succès débloqués', shortcut: 'A' },
  { id: 'show-help', name: 'Aide Clavier', icon: '⌨️', description: 'Raccourcis clavier disponibles', shortcut: '?' },
  { id: 'random-universe', name: 'Univers Aléatoire', icon: '🎲', description: 'Téléportation surprise !', shortcut: 'R' },
  { id: 'toggle-theme', name: 'Toggle Thème', icon: '🌙', description: 'Basculer clair/sombre' },
  { id: 'konami', name: 'Konami Code', icon: '🎮', description: '↑↑↓↓←→←→BA' },
];

// Filtrage
const normalize = (str) => str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

const filteredPages = computed(() => {
  if (!query.value) return pages.slice(0, 5);
  const q = normalize(query.value);
  return pages.filter(p => 
    normalize(p.name).includes(q) || 
    normalize(p.path).includes(q)
  );
});

const filteredUniverses = computed(() => {
  if (!query.value) return universes.slice(0, 4);
  const q = normalize(query.value);
  return universes.filter(u => 
    normalize(u.name).includes(q) || 
    normalize(u.tagline).includes(q)
  );
});

const filteredActions = computed(() => {
  if (!query.value) return actions.slice(0, 3);
  const q = normalize(query.value);
  return actions.filter(a => 
    normalize(a.name).includes(q) || 
    normalize(a.description).includes(q)
  );
});

const totalResults = computed(() => 
  filteredPages.value.length + filteredUniverses.value.length + filteredActions.value.length
);

const hasResults = computed(() => totalResults.value > 0);

// Navigation clavier
const navigateDown = () => {
  if (selectedIndex.value < totalResults.value - 1) {
    selectedIndex.value++;
  } else {
    selectedIndex.value = 0;
  }
};

const navigateUp = () => {
  if (selectedIndex.value > 0) {
    selectedIndex.value--;
  } else {
    selectedIndex.value = totalResults.value - 1;
  }
};

const executeSelected = () => {
  const pagesLen = filteredPages.value.length;
  const universesLen = filteredUniverses.value.length;
  
  if (selectedIndex.value < pagesLen) {
    execute(filteredPages.value[selectedIndex.value]);
  } else if (selectedIndex.value < pagesLen + universesLen) {
    execute(filteredUniverses.value[selectedIndex.value - pagesLen]);
  } else {
    executeAction(filteredActions.value[selectedIndex.value - pagesLen - universesLen]);
  }
};

// Exécution
const execute = (item) => {
  router.push(item.path);
  close();
};

const executeAction = (action) => {
  switch (action.id) {
    case 'toggle-sound':
      window.dispatchEvent(new CustomEvent('toggle-sound'));
      break;
    case 'show-achievements':
      window.dispatchEvent(new CustomEvent('show-achievements'));
      break;
    case 'show-help':
      window.dispatchEvent(new CustomEvent('show-help'));
      break;
    case 'random-universe':
      const random = universes[Math.floor(Math.random() * universes.length)];
      router.push(random.path);
      break;
    case 'konami':
      window.dispatchEvent(new CustomEvent('easter-egg', { detail: { type: 'konami' } }));
      break;
  }
  close();
};

// Open/Close
const open = () => {
  isOpen.value = true;
  query.value = '';
  selectedIndex.value = 0;
  nextTick(() => {
    inputRef.value?.focus();
  });
};

const close = () => {
  isOpen.value = false;
};

const toggle = () => {
  isOpen.value ? close() : open();
};

// Keyboard shortcut
const handleKeydown = (e) => {
  // Ctrl+K or Cmd+K
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault();
    toggle();
  }
  
  // / to open (si pas dans un input)
  if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) {
    e.preventDefault();
    open();
  }
};

// Reset index on query change
watch(query, () => {
  selectedIndex.value = 0;
});

// Expose for external use
defineExpose({ open, close, toggle });

onMounted(() => {
  document.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown);
});
</script>

<style scoped>
.command-palette-overlay {
  position: fixed;
  inset: 0;
  z-index: 99999;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 15vh;
}

.command-palette {
  width: 100%;
  max-width: 600px;
  background: linear-gradient(180deg, #1a1a24, #12121a);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  box-shadow: 
    0 25px 50px -12px rgba(0, 0, 0, 0.5),
    0 0 0 1px rgba(255, 255, 255, 0.05) inset;
  overflow: hidden;
}

/* Header */
.palette-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.palette-icon {
  font-size: 1.25rem;
  opacity: 0.5;
}

.palette-input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  font-size: 1.1rem;
  color: #fff;
  font-family: inherit;
}

.palette-input::placeholder {
  color: rgba(255, 255, 255, 0.4);
}

.palette-kbd {
  padding: 0.25rem 0.5rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.65rem;
  color: rgba(255, 255, 255, 0.5);
}

/* Results */
.palette-results {
  max-height: 400px;
  overflow-y: auto;
  padding: 0.5rem;
}

.result-group {
  margin-bottom: 0.5rem;
}

.result-group__label {
  padding: 0.5rem 0.75rem;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.65rem;
  color: rgba(255, 255, 255, 0.4);
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.result-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.75rem;
  background: transparent;
  border: none;
  border-radius: 8px;
  text-align: left;
  cursor: pointer;
  transition: all 0.15s ease;
}

.result-item:hover,
.result-item--selected {
  background: rgba(255, 255, 255, 0.08);
}

.result-item--selected {
  background: rgba(16, 185, 129, 0.15);
  outline: 1px solid rgba(16, 185, 129, 0.3);
}

.result-icon {
  font-size: 1.5rem;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
}

.result-content {
  flex: 1;
  min-width: 0;
}

.result-title {
  display: block;
  font-size: 0.95rem;
  color: #fff;
  font-weight: 500;
}

.result-path,
.result-tagline,
.result-desc {
  display: block;
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.4);
  margin-top: 0.1rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.result-tagline {
  color: var(--accent, rgba(255, 255, 255, 0.4));
}

.result-kbd {
  padding: 0.2rem 0.4rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.6rem;
  color: rgba(255, 255, 255, 0.5);
}

.result-year {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.7rem;
  color: var(--accent, rgba(255, 255, 255, 0.3));
}

/* Empty State */
.result-empty {
  text-align: center;
  padding: 2rem;
}

.empty-icon {
  font-size: 2.5rem;
  display: block;
  margin-bottom: 0.5rem;
  opacity: 0.5;
}

.result-empty p {
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 0.25rem;
}

.empty-hint {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.3);
}

/* Footer */
.palette-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(0, 0, 0, 0.2);
}

.footer-hints {
  display: flex;
  gap: 1rem;
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.4);
}

.footer-hints kbd {
  padding: 0.15rem 0.35rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.6rem;
  margin-right: 0.25rem;
}

.footer-brand {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.65rem;
  color: rgba(16, 185, 129, 0.6);
}

/* Transitions */
.palette-enter-active {
  transition: all 0.2s ease-out;
}

.palette-leave-active {
  transition: all 0.15s ease-in;
}

.palette-enter-from {
  opacity: 0;
}

.palette-enter-from .command-palette {
  transform: scale(0.95) translateY(-10px);
  opacity: 0;
}

.palette-leave-to {
  opacity: 0;
}

.palette-leave-to .command-palette {
  transform: scale(0.98);
  opacity: 0;
}

/* Scrollbar */
.palette-results::-webkit-scrollbar {
  width: 6px;
}

.palette-results::-webkit-scrollbar-track {
  background: transparent;
}

.palette-results::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
}

/* Responsive */
@media (max-width: 640px) {
  .command-palette-overlay {
    padding: 1rem;
    padding-top: 5vh;
  }
  
  .footer-hints {
    display: none;
  }
}
</style>
