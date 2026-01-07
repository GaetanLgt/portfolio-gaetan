<template>
  <div class="memory-page">
    <!-- HEADER -->
    <header class="memory-header">
      <div class="container memory-header__inner">
        <router-link to="/arcade" class="memory-back">
          ← ARCADE
        </router-link>
        <div class="memory-header__title">
          <span class="memory-header__icon">🧠</span>
          <h1>MEMORY</h1>
        </div>
        <div class="memory-header__score">
          <span class="score-item">COUPS: {{ moves }}</span>
          <span class="score-item">PAIRES: {{ matchedPairs }}/{{ totalPairs }}</span>
        </div>
      </div>
    </header>
    
    <!-- GAME AREA -->
    <section class="memory-game">
      <div class="container">
        <!-- WIN SCREEN -->
        <div v-if="gameWon" class="memory-win glass">
          <div class="memory-win__icon">🎉</div>
          <h2>VICTOIRE !</h2>
          <p>Tu as trouvé toutes les paires en <strong>{{ moves }}</strong> coups !</p>
          <div class="memory-win__stats">
            <div class="win-stat">
              <span class="win-stat__value">{{ moves }}</span>
              <span class="win-stat__label">COUPS</span>
            </div>
            <div class="win-stat">
              <span class="win-stat__value">{{ timer }}s</span>
              <span class="win-stat__label">TEMPS</span>
            </div>
            <div class="win-stat">
              <span class="win-stat__value">{{ score }}</span>
              <span class="win-stat__label">SCORE</span>
            </div>
          </div>
          <button @click="restartGame" class="btn btn--primary">
            REJOUER
          </button>
        </div>
        
        <!-- GAME GRID -->
        <div 
          v-else 
          class="memory-grid" 
          :class="{ 'memory-grid--disabled': isChecking }"
          role="grid"
          aria-label="Grille de jeu Memory avec {{ totalPairs }} paires à trouver"
        >
          <button 
            v-for="(card, index) in shuffledCards" 
            :key="index"
            class="memory-card"
            :class="{ 
              'flipped': card.flipped || card.matched,
              'matched': card.matched
            }"
            @click="flipCard(index)"
            :aria-label="card.flipped || card.matched ? `Carte ${card.name}` : `Carte cachée ${index + 1}`"
            :aria-pressed="card.flipped || card.matched"
            :disabled="card.matched || isChecking"
          >
            <div class="memory-card__inner">
              <div class="memory-card__front" aria-hidden="true">
                <span class="memory-card__logo">GL</span>
              </div>
              <div class="memory-card__back" :style="{ '--card-color': card.color }" aria-hidden="true">
                <span class="memory-card__icon">{{ card.icon }}</span>
                <span class="memory-card__name">{{ card.name }}</span>
              </div>
            </div>
          </button>
        </div>
        
        <!-- Annonces pour lecteurs d'écran -->
        <div aria-live="polite" aria-atomic="true" class="sr-only">
          {{ liveAnnouncement }}
        </div>
        
        <!-- CONTROLS -->
        <div v-if="!gameWon" class="memory-controls">
          <button @click="restartGame" class="btn btn--outline">
            🔄 RECOMMENCER
          </button>
          <div class="memory-timer">
            ⏱️ {{ timer }}s
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';

const projects = [
  { id: 'arkadia', name: 'ARKADIA', icon: '🦖', color: '#A855F7' },
  { id: 'gldigitallab', name: 'GL LAB', icon: '💎', color: '#10B981' },
  { id: 'myloc', name: 'MYLOC', icon: '🏠', color: '#6366F1' },
  { id: 'zombunny', name: 'ZOMBUNNY', icon: '🧬', color: '#8B5CF6' },
  { id: 'mytv', name: 'MYTV', icon: '📺', color: '#06B6D4' },
  { id: 'pokemon', name: 'POKÉMON', icon: '🎴', color: '#FBBF24' },
  { id: 'mevn', name: 'MEVN', icon: '🔥', color: '#10B981' },
  { id: 'symfonycms', name: 'CMS', icon: '📰', color: '#6366F1' }
];

const shuffledCards = ref([]);
const moves = ref(0);
const timer = ref(0);
const isChecking = ref(false);
const firstCard = ref(null);
const secondCard = ref(null);
const liveAnnouncement = ref('');
let timerInterval = null;

const totalPairs = computed(() => projects.length);
const matchedPairs = computed(() => shuffledCards.value.filter(c => c.matched).length / 2);
const gameWon = computed(() => matchedPairs.value === totalPairs.value && shuffledCards.value.length > 0);
const score = computed(() => Math.max(0, 1000 - (moves.value * 10) - timer.value));

function initGame() {
  const cards = [];
  projects.forEach(project => {
    cards.push({ ...project, flipped: false, matched: false });
    cards.push({ ...project, flipped: false, matched: false });
  });
  
  // Fisher-Yates shuffle
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }
  
  shuffledCards.value = cards;
  moves.value = 0;
  timer.value = 0;
  firstCard.value = null;
  secondCard.value = null;
  isChecking.value = false;
  
  startTimer();
}

function startTimer() {
  if (timerInterval) clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    if (!gameWon.value) {
      timer.value++;
    }
  }, 1000);
}

function flipCard(index) {
  const card = shuffledCards.value[index];
  
  if (isChecking.value || card.flipped || card.matched) return;
  
  card.flipped = true;
  
  if (!firstCard.value) {
    firstCard.value = { index, card };
  } else {
    secondCard.value = { index, card };
    moves.value++;
    checkMatch();
  }
}

function checkMatch() {
  isChecking.value = true;
  
  const first = firstCard.value;
  const second = secondCard.value;
  
  if (first.card.id === second.card.id) {
    shuffledCards.value[first.index].matched = true;
    shuffledCards.value[second.index].matched = true;
    liveAnnouncement.value = `Paire trouvée : ${first.card.name} ! ${matchedPairs.value + 1} sur ${totalPairs.value} paires.`;
    resetTurn();
  } else {
    liveAnnouncement.value = `Pas de correspondance entre ${first.card.name} et ${second.card.name}.`;
    setTimeout(() => {
      shuffledCards.value[first.index].flipped = false;
      shuffledCards.value[second.index].flipped = false;
      resetTurn();
    }, 1000);
  }
}

function resetTurn() {
  firstCard.value = null;
  secondCard.value = null;
  isChecking.value = false;
  
  if (gameWon.value && timerInterval) {
    clearInterval(timerInterval);
  }
}

function restartGame() {
  initGame();
}

onMounted(() => {
  initGame();
});

onUnmounted(() => {
  if (timerInterval) clearInterval(timerInterval);
});
</script>

<style scoped>
.memory-page {
  min-height: 100vh;
  background: #050505;
  padding-top: 80px;
}

/* HEADER */
.memory-header {
  padding: 1rem 0;
  background: #0a0a0a;
  border-bottom: 1px solid var(--border);
  position: relative;
  z-index: 10;
}

.memory-header__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
}

.memory-back {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.75rem;
  color: var(--text-muted);
  text-decoration: none;
  transition: color 0.2s;
}

.memory-back:hover {
  color: var(--primary);
}

.memory-header__title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.memory-header__icon {
  font-size: 1.5rem;
}

.memory-header__title h1 {
  font-size: 1.25rem;
  font-weight: 700;
  letter-spacing: 0.1em;
}

.memory-header__score {
  display: flex;
  gap: 1.5rem;
}

.score-item {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.75rem;
  color: var(--primary);
}

/* GAME */
.memory-game {
  padding: var(--space-lg) 0;
}

.memory-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  max-width: 600px;
  margin: 0 auto;
}

.memory-grid--disabled {
  pointer-events: none;
}

/* CARD */
.memory-card {
  aspect-ratio: 1;
  cursor: pointer;
  perspective: 1000px;
}

.memory-card__inner {
  position: relative;
  width: 100%;
  height: 100%;
  transition: transform 0.5s;
  transform-style: preserve-3d;
}

.memory-card.flipped .memory-card__inner {
  transform: rotateY(180deg);
}

.memory-card__front,
.memory-card__back {
  position: absolute;
  inset: 0;
  border-radius: 0.75rem;
  backface-visibility: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.memory-card__front {
  background: linear-gradient(145deg, #1a1a1a 0%, #0a0a0a 100%);
  border: 2px solid var(--border);
}

.memory-card:hover:not(.flipped):not(.matched) .memory-card__front {
  border-color: var(--primary);
}

.memory-card__logo {
  font-family: 'JetBrains Mono', monospace;
  font-size: 1.5rem;
  font-weight: 900;
  color: var(--text-dark);
}

.memory-card__back {
  background: linear-gradient(145deg, #1a1a2e 0%, #0f0f1a 100%);
  border: 2px solid var(--card-color, var(--primary));
  transform: rotateY(180deg);
}

.memory-card.matched .memory-card__back {
  box-shadow: 0 0 20px var(--card-color, var(--primary));
}

.memory-card__icon {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}

.memory-card__name {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.6rem;
  color: var(--card-color, var(--primary));
  letter-spacing: 0.1em;
}

/* CONTROLS */
.memory-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2rem;
  margin-top: var(--space-lg);
}

.memory-timer {
  font-family: 'JetBrains Mono', monospace;
  font-size: 1.25rem;
  color: var(--primary);
}

/* WIN SCREEN */
.memory-win {
  max-width: 500px;
  margin: 0 auto;
  padding: 3rem;
  text-align: center;
  border-radius: 1.5rem;
  border: 1px solid var(--primary);
  animation: winPulse 2s ease-in-out infinite;
}

@keyframes winPulse {
  0%, 100% { box-shadow: 0 0 20px rgba(16, 185, 129, 0.3); }
  50% { box-shadow: 0 0 40px rgba(16, 185, 129, 0.5); }
}

.memory-win__icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.memory-win h2 {
  font-size: 2rem;
  margin-bottom: 0.5rem;
  color: var(--primary);
}

.memory-win p {
  font-size: 1rem;
  color: var(--text-muted);
  margin-bottom: 2rem;
}

.memory-win__stats {
  display: flex;
  justify-content: center;
  gap: 3rem;
  margin-bottom: 2rem;
}

.win-stat {
  text-align: center;
}

.win-stat__value {
  display: block;
  font-family: 'JetBrains Mono', monospace;
  font-size: 2rem;
  font-weight: 700;
  color: var(--primary);
}

.win-stat__label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.65rem;
  color: var(--text-dark);
}

/* BUTTONS */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.875rem 1.5rem;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.75rem;
  font-weight: 600;
  text-decoration: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
}

.btn--primary {
  background: var(--primary);
  color: var(--bg);
}

.btn--primary:hover {
  background: #059669;
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(16, 185, 129, 0.3);
}

.btn--outline {
  background: transparent;
  color: var(--text-muted);
  border: 1px solid var(--border);
}

.btn--outline:hover {
  border-color: var(--primary);
  color: var(--primary);
  background: rgba(16, 185, 129, 0.1);
}

/* RESPONSIVE */
@media (max-width: 500px) {
  .memory-grid {
    grid-template-columns: repeat(4, 1fr);
    gap: 0.5rem;
  }
  
  .memory-card__icon {
    font-size: 1.5rem;
  }
  
  .memory-card__name {
    font-size: 0.5rem;
  }
  
  .memory-header__inner {
    flex-direction: column;
  }
}
</style>
