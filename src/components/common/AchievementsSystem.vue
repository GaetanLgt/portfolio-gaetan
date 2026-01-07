<template>
  <div class="achievements-system">
    <!-- Achievement Popup -->
    <Transition name="achievement">
      <div 
        v-if="showAchievement" 
        class="achievement-popup"
        :class="'rarity--' + currentAchievement?.rarity"
        role="alert"
        aria-live="polite"
      >
        <div class="achievement-glow" aria-hidden="true"></div>
        <div class="achievement-content">
          <div class="achievement-icon">{{ currentAchievement?.icon }}</div>
          <div class="achievement-info">
            <span class="achievement-label">{{ getRarityLabel(currentAchievement?.rarity) }}</span>
            <span class="achievement-title">{{ currentAchievement?.title }}</span>
            <span class="achievement-desc">{{ currentAchievement?.description }}</span>
          </div>
          <div class="achievement-xp">+{{ currentAchievement?.xp }} XP</div>
        </div>
        <div class="achievement-progress">
          <div class="progress-fill" :style="{ width: '100%' }"></div>
        </div>
      </div>
    </Transition>
    
    <!-- Stats Button -->
    <button 
      class="stats-button"
      @click="togglePanel"
      :aria-expanded="showPanel"
      aria-label="Voir les succès"
    >
      <span class="stats-icon">🏆</span>
      <span class="stats-count">{{ unlockedCount }}/{{ totalAchievements }}</span>
    </button>
    
    <!-- Stats Panel -->
    <Transition name="panel">
      <div v-if="showPanel" class="stats-panel">
        <div class="panel-header">
          <h3>🏆 Succès Multivers</h3>
          <button class="close-btn" @click="showPanel = false" aria-label="Fermer">✕</button>
        </div>
        
        <div class="panel-stats">
          <div class="stat-item">
            <span class="stat-value">{{ totalXP }}</span>
            <span class="stat-label">XP Total</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">{{ playerLevel }}</span>
            <span class="stat-label">Niveau</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">{{ unlockedCount }}/{{ totalAchievements }}</span>
            <span class="stat-label">Succès</span>
          </div>
        </div>
        
        <div class="level-progress">
          <div class="level-bar">
            <div class="level-fill" :style="{ width: levelProgress + '%' }"></div>
          </div>
          <span class="level-text">Niveau {{ playerLevel }} → {{ playerLevel + 1 }}</span>
        </div>
        
        <div class="achievements-list">
          <div 
            v-for="achievement in allAchievements" 
            :key="achievement.id"
            class="achievement-item"
            :class="[
              { 'item--unlocked': isUnlocked(achievement.id) },
              'rarity--' + achievement.rarity
            ]"
          >
            <span class="item-icon">{{ isUnlocked(achievement.id) ? achievement.icon : '🔒' }}</span>
            <div class="item-info">
              <span class="item-title">{{ achievement.title }}</span>
              <span class="item-desc">{{ isUnlocked(achievement.id) ? achievement.description : '???' }}</span>
            </div>
            <span class="item-xp" v-if="isUnlocked(achievement.id)">+{{ achievement.xp }}</span>
          </div>
        </div>
        
        <button class="reset-btn" @click="resetProgress">🗑️ Réinitialiser</button>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const showAchievement = ref(false);
const showPanel = ref(false);
const currentAchievement = ref(null);
const unlockedAchievements = ref(new Set());
const visitedPages = ref(new Set());
const clickCount = ref(0);
const scrollDistance = ref(0);
const sessionStartTime = ref(Date.now());

// Définition des achievements
const allAchievements = [
  // Exploration
  { id: 'first_portal', title: 'Premier Portail', description: 'Visiter un univers pour la première fois', icon: '🌀', xp: 50, rarity: 'common' },
  { id: 'explorer_5', title: 'Explorateur', description: 'Visiter 5 univers différents', icon: '🧭', xp: 100, rarity: 'common' },
  { id: 'explorer_10', title: 'Voyageur Dimensionnel', description: 'Visiter 10 univers différents', icon: '🚀', xp: 200, rarity: 'uncommon' },
  { id: 'explorer_20', title: 'Maître du Multivers', description: 'Visiter les 20 univers', icon: '👑', xp: 500, rarity: 'legendary' },
  
  // Univers spécifiques
  { id: 'matrix_neo', title: 'Réveille-toi Neo', description: 'Découvrir la Matrice', icon: '💊', xp: 75, rarity: 'uncommon' },
  { id: 'tron_user', title: 'Je me bats pour les utilisateurs', description: 'Entrer dans la Grille TRON', icon: '🏍️', xp: 75, rarity: 'uncommon' },
  { id: 'dbz_power', title: 'C\'EST PLUS DE 9000 !!!', description: 'Atteindre l\'univers Dragon Ball Z', icon: '🔥', xp: 75, rarity: 'uncommon' },
  { id: 'inception_dream', title: 'Rêve dans un rêve', description: 'Plonger dans Inception', icon: '🎯', xp: 75, rarity: 'uncommon' },
  { id: 'blade_tears', title: 'Larmes sous la pluie', description: 'Entrer dans Blade Runner', icon: '🌧️', xp: 75, rarity: 'uncommon' },
  
  // Interaction
  { id: 'clicker_100', title: 'Curieux', description: 'Cliquer 100 fois', icon: '👆', xp: 50, rarity: 'common' },
  { id: 'clicker_500', title: 'Hyperactif', description: 'Cliquer 500 fois', icon: '⚡', xp: 150, rarity: 'uncommon' },
  { id: 'scroller', title: 'Scrolleur Pro', description: 'Scroller 10000 pixels', icon: '📜', xp: 100, rarity: 'common' },
  
  // Temps
  { id: 'session_5', title: 'Intéressé', description: 'Rester 5 minutes sur le site', icon: '⏱️', xp: 75, rarity: 'common' },
  { id: 'session_15', title: 'Captivé', description: 'Rester 15 minutes sur le site', icon: '🕐', xp: 200, rarity: 'uncommon' },
  { id: 'night_owl', title: 'Hibou de Nuit', description: 'Visiter entre minuit et 5h', icon: '🦉', xp: 100, rarity: 'rare' },
  
  // Secrets
  { id: 'konami', title: 'Konami Code', description: '↑↑↓↓←→←→BA', icon: '🎮', xp: 300, rarity: 'rare' },
  { id: 'easter_egg', title: 'Chasseur d\'œufs', description: 'Trouver un easter egg caché', icon: '🥚', xp: 250, rarity: 'rare' },
  
  // Complétion
  { id: 'completionist', title: 'Complétionniste', description: 'Débloquer tous les autres succès', icon: '💎', xp: 1000, rarity: 'legendary' }
];

const totalAchievements = allAchievements.length;
const unlockedCount = computed(() => unlockedAchievements.value.size);
const totalXP = computed(() => {
  return allAchievements
    .filter(a => unlockedAchievements.value.has(a.id))
    .reduce((sum, a) => sum + a.xp, 0);
});

const playerLevel = computed(() => Math.floor(totalXP.value / 500) + 1);
const levelProgress = computed(() => (totalXP.value % 500) / 5);

const isUnlocked = (id) => unlockedAchievements.value.has(id);

const getRarityLabel = (rarity) => {
  const labels = {
    common: 'Commun',
    uncommon: 'Peu commun',
    rare: 'Rare',
    legendary: 'Légendaire'
  };
  return labels[rarity] || 'Succès';
};

// Débloquer un achievement
const unlock = (id) => {
  if (unlockedAchievements.value.has(id)) return;
  
  const achievement = allAchievements.find(a => a.id === id);
  if (!achievement) return;
  
  unlockedAchievements.value.add(id);
  saveProgress();
  
  // Afficher le popup
  currentAchievement.value = achievement;
  showAchievement.value = true;
  
  // Confetti pour achievements rares et légendaires
  if (achievement.rarity === 'legendary') {
    window.dispatchEvent(new CustomEvent('confetti', { detail: { preset: 'legendary' } }));
  } else if (achievement.rarity === 'rare') {
    window.dispatchEvent(new CustomEvent('confetti', { detail: { preset: 'achievement' } }));
  }
  
  // Toast notification
  window.dispatchEvent(new CustomEvent('toast', {
    detail: {
      type: 'achievement',
      title: achievement.title,
      message: `+${achievement.xp} XP débloqué !`,
      duration: 4000
    }
  }));
  
  setTimeout(() => {
    showAchievement.value = false;
  }, 5000);
  
  // Vérifier completionist
  checkCompletionist();
};

const checkCompletionist = () => {
  const otherAchievements = allAchievements.filter(a => a.id !== 'completionist');
  const allOthersUnlocked = otherAchievements.every(a => unlockedAchievements.value.has(a.id));
  if (allOthersUnlocked) {
    setTimeout(() => unlock('completionist'), 1000);
  }
};

// Vérifications
const checkExploration = () => {
  const multiversPaths = [
    '/matrix', '/matrix-resurrections', '/tron', '/blade-runner', '/inception',
    '/ghost-in-the-shell', '/minority-report', '/iron-man', '/dragon-ball-z',
    '/deadpool', '/the-mask', '/v-for-vendetta', '/ready-player-one',
    '/cloud-atlas', '/jupiter-ascending', '/howard-the-duck', '/alice-turing',
    '/asimov', '/mecha-mascot', '/jardin-de-mam'
  ];
  
  const isMultivers = multiversPaths.some(p => route.path.startsWith(p));
  
  if (isMultivers) {
    visitedPages.value.add(route.path);
    saveProgress();
    
    const visitedCount = visitedPages.value.size;
    
    if (visitedCount === 1) unlock('first_portal');
    if (visitedCount >= 5) unlock('explorer_5');
    if (visitedCount >= 10) unlock('explorer_10');
    if (visitedCount >= 20) unlock('explorer_20');
    
    // Univers spécifiques
    if (route.path.includes('matrix')) unlock('matrix_neo');
    if (route.path.includes('tron')) unlock('tron_user');
    if (route.path.includes('dragon-ball')) unlock('dbz_power');
    if (route.path.includes('inception')) unlock('inception_dream');
    if (route.path.includes('blade-runner')) unlock('blade_tears');
  }
};

const checkTime = () => {
  const hour = new Date().getHours();
  if (hour >= 0 && hour < 5) {
    unlock('night_owl');
  }
};

const checkSession = () => {
  const elapsed = (Date.now() - sessionStartTime.value) / 1000 / 60; // minutes
  if (elapsed >= 5) unlock('session_5');
  if (elapsed >= 15) unlock('session_15');
};

// Event handlers
const handleClick = () => {
  clickCount.value++;
  if (clickCount.value >= 100) unlock('clicker_100');
  if (clickCount.value >= 500) unlock('clicker_500');
};

const handleScroll = () => {
  scrollDistance.value += Math.abs(window.scrollY);
  if (scrollDistance.value >= 10000) unlock('scroller');
};

// Konami code
const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];
let konamiIndex = 0;

const handleKeydown = (e) => {
  if (e.code === konamiCode[konamiIndex]) {
    konamiIndex++;
    if (konamiIndex === konamiCode.length) {
      unlock('konami');
      konamiIndex = 0;
    }
  } else {
    konamiIndex = 0;
  }
};

// Persistence
const saveProgress = () => {
  try {
    localStorage.setItem('gl-achievements', JSON.stringify([...unlockedAchievements.value]));
    localStorage.setItem('gl-visited-pages', JSON.stringify([...visitedPages.value]));
    localStorage.setItem('gl-click-count', clickCount.value.toString());
  } catch (e) {}
};

const loadProgress = () => {
  try {
    const achievements = localStorage.getItem('gl-achievements');
    const pages = localStorage.getItem('gl-visited-pages');
    const clicks = localStorage.getItem('gl-click-count');
    
    if (achievements) unlockedAchievements.value = new Set(JSON.parse(achievements));
    if (pages) visitedPages.value = new Set(JSON.parse(pages));
    if (clicks) clickCount.value = parseInt(clicks);
  } catch (e) {}
};

const resetProgress = () => {
  if (confirm('Réinitialiser tous les succès ?')) {
    unlockedAchievements.value = new Set();
    visitedPages.value = new Set();
    clickCount.value = 0;
    scrollDistance.value = 0;
    localStorage.removeItem('gl-achievements');
    localStorage.removeItem('gl-visited-pages');
    localStorage.removeItem('gl-click-count');
  }
};

const togglePanel = () => {
  showPanel.value = !showPanel.value;
};

// Watchers
watch(() => route.path, checkExploration, { immediate: true });

// Lifecycle
onMounted(() => {
  loadProgress();
  checkTime();
  
  // Session timer
  setInterval(checkSession, 60000);
  
  // Event listeners
  document.addEventListener('click', handleClick);
  window.addEventListener('scroll', handleScroll, { passive: true });
  document.addEventListener('keydown', handleKeydown);
});
</script>

<style scoped>
/* Achievement Popup */
.achievement-popup {
  position: fixed;
  top: 100px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10000;
  
  min-width: 350px;
  padding: 1rem 1.5rem;
  
  background: linear-gradient(135deg, rgba(20, 20, 30, 0.98), rgba(10, 10, 20, 0.98));
  border: 2px solid var(--rarity-color, #10B981);
  border-radius: 12px;
  
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5), 0 0 60px var(--rarity-glow, rgba(16, 185, 129, 0.3));
}

.achievement-glow {
  position: absolute;
  inset: -2px;
  background: linear-gradient(45deg, var(--rarity-color), transparent, var(--rarity-color));
  border-radius: 14px;
  opacity: 0.5;
  animation: glowRotate 3s linear infinite;
  z-index: -1;
}

@keyframes glowRotate {
  from { filter: hue-rotate(0deg); }
  to { filter: hue-rotate(360deg); }
}

.achievement-content {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.achievement-icon {
  font-size: 2.5rem;
  animation: iconBounce 0.5s ease-out;
}

@keyframes iconBounce {
  0% { transform: scale(0); }
  50% { transform: scale(1.3); }
  100% { transform: scale(1); }
}

.achievement-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.achievement-label {
  font-size: 0.65rem;
  color: var(--rarity-color);
  text-transform: uppercase;
  letter-spacing: 0.15em;
  font-family: 'JetBrains Mono', monospace;
}

.achievement-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: #fff;
}

.achievement-desc {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.6);
}

.achievement-xp {
  font-size: 1rem;
  font-weight: 700;
  color: var(--rarity-color);
  font-family: 'JetBrains Mono', monospace;
}

.achievement-progress {
  margin-top: 0.75rem;
  height: 3px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  overflow: hidden;
}

.achievement-progress .progress-fill {
  height: 100%;
  background: var(--rarity-color);
  animation: progressFill 4s linear forwards;
}

@keyframes progressFill {
  from { width: 100%; }
  to { width: 0%; }
}

/* Rarity colors */
.rarity--common {
  --rarity-color: #9e9e9e;
  --rarity-glow: rgba(158, 158, 158, 0.3);
}

.rarity--uncommon {
  --rarity-color: #4caf50;
  --rarity-glow: rgba(76, 175, 80, 0.3);
}

.rarity--rare {
  --rarity-color: #2196f3;
  --rarity-glow: rgba(33, 150, 243, 0.4);
}

.rarity--legendary {
  --rarity-color: #ff9800;
  --rarity-glow: rgba(255, 152, 0, 0.5);
}

.rarity--legendary .achievement-glow {
  animation: legendaryGlow 2s ease-in-out infinite;
}

@keyframes legendaryGlow {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 0.8; }
}

/* Stats Button */
.stats-button {
  position: fixed;
  top: 100px;
  right: 1.5rem;
  z-index: 1000;
  
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.5rem 0.75rem;
  
  background: rgba(0, 0, 0, 0.8);
  border: 1px solid rgba(255, 215, 0, 0.3);
  border-radius: 20px;
  
  color: #ffd700;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.7rem;
  
  cursor: pointer;
  transition: all 0.3s;
}

.stats-button:hover {
  border-color: #ffd700;
  box-shadow: 0 0 20px rgba(255, 215, 0, 0.3);
}

.stats-icon {
  font-size: 1rem;
}

/* Stats Panel */
.stats-panel {
  position: fixed;
  top: 150px;
  right: 1.5rem;
  z-index: 1001;
  
  width: 320px;
  max-height: 70vh;
  overflow-y: auto;
  
  background: rgba(10, 10, 20, 0.98);
  border: 1px solid rgba(255, 215, 0, 0.3);
  border-radius: 12px;
  
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.panel-header h3 {
  font-size: 1rem;
  color: #ffd700;
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  font-size: 1.2rem;
  padding: 0.25rem;
}

.close-btn:hover {
  color: #fff;
}

.panel-stats {
  display: flex;
  justify-content: space-around;
  padding: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.stat-item {
  text-align: center;
}

.stat-value {
  display: block;
  font-size: 1.25rem;
  font-weight: 700;
  color: #ffd700;
  font-family: 'JetBrains Mono', monospace;
}

.stat-label {
  font-size: 0.65rem;
  color: rgba(255, 255, 255, 0.5);
  text-transform: uppercase;
}

.level-progress {
  padding: 0.75rem 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.level-bar {
  height: 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.level-fill {
  height: 100%;
  background: linear-gradient(90deg, #ffd700, #ff9800);
  transition: width 0.3s;
}

.level-text {
  font-size: 0.65rem;
  color: rgba(255, 255, 255, 0.5);
}

.achievements-list {
  padding: 0.5rem;
  max-height: 300px;
  overflow-y: auto;
}

.achievement-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  border-radius: 8px;
  margin-bottom: 0.5rem;
  background: rgba(255, 255, 255, 0.03);
  opacity: 0.4;
  transition: all 0.3s;
}

.achievement-item.item--unlocked {
  opacity: 1;
  background: rgba(255, 255, 255, 0.05);
  border-left: 3px solid var(--rarity-color, #9e9e9e);
}

.item-icon {
  font-size: 1.5rem;
}

.item-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
}

.item-title {
  font-size: 0.85rem;
  color: #fff;
  font-weight: 600;
}

.item-desc {
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.5);
}

.item-xp {
  font-size: 0.75rem;
  color: var(--rarity-color);
  font-family: 'JetBrains Mono', monospace;
}

.reset-btn {
  width: calc(100% - 2rem);
  margin: 1rem;
  padding: 0.5rem;
  background: rgba(183, 28, 28, 0.2);
  border: 1px solid rgba(183, 28, 28, 0.5);
  border-radius: 6px;
  color: #ef5350;
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.3s;
}

.reset-btn:hover {
  background: rgba(183, 28, 28, 0.3);
}

/* Transitions */
.achievement-enter-active {
  animation: achievementIn 0.5s ease-out;
}

.achievement-leave-active {
  animation: achievementOut 0.3s ease-in;
}

@keyframes achievementIn {
  0% {
    opacity: 0;
    transform: translateX(-50%) translateY(-30px) scale(0.8);
  }
  100% {
    opacity: 1;
    transform: translateX(-50%) translateY(0) scale(1);
  }
}

@keyframes achievementOut {
  0% {
    opacity: 1;
    transform: translateX(-50%) scale(1);
  }
  100% {
    opacity: 0;
    transform: translateX(-50%) translateY(-20px) scale(0.9);
  }
}

.panel-enter-active,
.panel-leave-active {
  transition: all 0.3s ease;
}

.panel-enter-from,
.panel-leave-to {
  opacity: 0;
  transform: translateX(20px);
}

/* Responsive */
@media (max-width: 768px) {
  .achievement-popup {
    min-width: auto;
    left: 1rem;
    right: 1rem;
    transform: none;
  }
  
  .stats-button {
    top: auto;
    bottom: 160px;
    right: 1rem;
  }
  
  .stats-panel {
    top: auto;
    bottom: 200px;
    right: 1rem;
    left: 1rem;
    width: auto;
  }
}

/* A11Y */
@media (prefers-reduced-motion: reduce) {
  .achievement-glow,
  .achievement-icon {
    animation: none;
  }
}

/* Scrollbar */
.stats-panel::-webkit-scrollbar,
.achievements-list::-webkit-scrollbar {
  width: 4px;
}

.stats-panel::-webkit-scrollbar-track,
.achievements-list::-webkit-scrollbar-track {
  background: transparent;
}

.stats-panel::-webkit-scrollbar-thumb,
.achievements-list::-webkit-scrollbar-thumb {
  background: rgba(255, 215, 0, 0.3);
  border-radius: 2px;
}
</style>
