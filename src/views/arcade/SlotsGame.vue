<template>
  <div class="slots-page">
    <!-- HEADER -->
    <header class="slots-header">
      <div class="container slots-header__inner">
        <router-link to="/arcade" class="slots-back">
          ← ARCADE
        </router-link>
        <div class="slots-header__title">
          <span class="slots-header__icon">🎰</span>
          <h1>STACK SLOTS</h1>
        </div>
        <div class="slots-header__spins">
          SPINS: {{ spins }}
        </div>
      </div>
    </header>
    
    <!-- GAME -->
    <section class="slots-game">
      <div class="container">
        <p class="slots-intro">
          Tire le levier et découvre quel projet correspond à ces technos !
        </p>
        
        <!-- MACHINE -->
        <div class="slot-machine">
          <div class="slot-machine__frame">
            <div class="slot-machine__top">
              <span class="slot-machine__logo">🎰 GL SLOTS 🎰</span>
            </div>
            
            <!-- REELS -->
            <div class="slot-reels">
              <div 
                v-for="(reel, index) in reels" 
                :key="index"
                class="slot-reel"
                :class="{ 'spinning': spinning[index] }"
              >
                <div class="slot-reel__window">
                  <div 
                    class="slot-reel__strip"
                    :style="{ transform: `translateY(-${reelPositions[index] * 80}px)` }"
                  >
                    <div 
                      v-for="(tech, i) in allTechs" 
                      :key="i"
                      class="slot-symbol"
                    >
                      <span class="slot-symbol__icon">{{ tech.icon }}</span>
                      <span class="slot-symbol__name">{{ tech.name }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- RESULT -->
            <div 
              class="slot-result" 
              :class="{ 'show': showResult }"
              role="status"
              aria-live="polite"
              aria-atomic="true"
            >
              <template v-if="matchedProject">
                <div class="slot-result__win">
                  <span class="slot-result__icon">🎉</span>
                  <h3>{{ matchedProject.name }}</h3>
                  <p>{{ matchedProject.desc }}</p>
                  <router-link 
                    v-if="matchedProject.route" 
                    :to="matchedProject.route"
                    class="btn btn--primary btn--sm"
                  >
                    VOIR LE PROJET
                  </router-link>
                </div>
              </template>
              <template v-else-if="showResult">
                <div class="slot-result__miss">
                  <span class="slot-result__icon">🤔</span>
                  <h3>Combinaison inconnue</h3>
                  <p>Aucun projet ne correspond à cette stack. Retente ta chance !</p>
                </div>
              </template>
            </div>
            
            <!-- LEVER -->
            <button 
              class="slot-lever"
              :class="{ 'pulled': isSpinning }"
              :disabled="isSpinning"
              @click="spin"
              aria-label="Tirer le levier pour lancer les rouleaux"
              :aria-busy="isSpinning"
            >
              <div class="slot-lever__handle" aria-hidden="true">
                <div class="slot-lever__ball"></div>
              </div>
              <span class="slot-lever__text">{{ isSpinning ? 'SPINNING...' : 'PULL!' }}</span>
            </button>
          </div>
        </div>
        
        <!-- TECH LEGEND -->
        <div class="slots-legend glass">
          <h4>Technologies</h4>
          <div class="slots-legend__grid">
            <div v-for="tech in allTechs" :key="tech.name" class="legend-tech">
              <span class="legend-tech__icon">{{ tech.icon }}</span>
              <span class="legend-tech__name">{{ tech.name }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const spins = ref(0);
const isSpinning = ref(false);
const spinning = ref([false, false, false]);
const reelPositions = ref([0, 0, 0]);
const showResult = ref(false);
const matchedProject = ref(null);

const allTechs = [
  { name: 'Vue', icon: '💚' },
  { name: 'Symfony', icon: '🎵' },
  { name: 'PHP', icon: '🐘' },
  { name: 'Node', icon: '💛' },
  { name: 'Three.js', icon: '🎮' },
  { name: 'Docker', icon: '🐳' },
  { name: 'Unity', icon: '🎯' },
  { name: 'Discord', icon: '🤖' },
  { name: 'MySQL', icon: '🗄️' },
  { name: 'n8n', icon: '⚡' },
  { name: 'C#', icon: '💜' },
  { name: 'WordPress', icon: '📝' }
];

const projects = [
  {
    name: 'GL Digital Lab',
    desc: 'Portfolio Vue 3 + Three.js',
    techs: ['Vue', 'Three.js'],
    route: '/'
  },
  {
    name: 'ARKADIA FRANCE',
    desc: 'Cluster gaming avec automation',
    techs: ['Node', 'Discord', 'n8n'],
    route: '/arkadia'
  },
  {
    name: 'MyLoc',
    desc: 'Gestion de locations',
    techs: ['Symfony', 'PHP', 'MySQL'],
    route: null
  },
  {
    name: 'Zombunny',
    desc: 'Algorithmes génétiques Unity',
    techs: ['Unity', 'C#'],
    route: '/zombunny'
  },
  {
    name: 'Pokémon Memory',
    desc: 'Jeu Memory Symfony',
    techs: ['Symfony', 'PHP', 'Docker'],
    route: null
  },
  {
    name: 'MyTV Database',
    desc: 'Explorer de séries TV',
    techs: ['Vue', 'Node'],
    route: '/tv'
  },
  {
    name: 'SymfonyCMS',
    desc: 'CMS custom',
    techs: ['Symfony', 'PHP'],
    route: null
  },
  {
    name: 'MEVN Stack',
    desc: 'Boilerplate full-stack',
    techs: ['Vue', 'Node', 'Docker'],
    route: null
  }
];

const reels = ref([
  [...allTechs],
  [...allTechs],
  [...allTechs]
]);

function spin() {
  if (isSpinning.value) return;
  
  isSpinning.value = true;
  showResult.value = false;
  matchedProject.value = null;
  spins.value++;
  
  // Spin each reel with delay
  reels.value.forEach((_, index) => {
    setTimeout(() => {
      spinning.value[index] = true;
      animateReel(index);
    }, index * 200);
  });
}

function animateReel(index) {
  const finalPosition = Math.floor(Math.random() * allTechs.length);
  const spinsBeforeStop = 10 + Math.floor(Math.random() * 5);
  let currentSpin = 0;
  
  const interval = setInterval(() => {
    reelPositions.value[index] = (reelPositions.value[index] + 1) % allTechs.length;
    currentSpin++;
    
    if (currentSpin >= spinsBeforeStop * allTechs.length) {
      clearInterval(interval);
      reelPositions.value[index] = finalPosition;
      spinning.value[index] = false;
      
      // Check if all reels stopped
      if (spinning.value.every(s => !s)) {
        isSpinning.value = false;
        checkWin();
      }
    }
  }, 50);
}

function checkWin() {
  const selectedTechs = reelPositions.value.map(pos => allTechs[pos].name);
  
  // Find matching project
  for (const project of projects) {
    const matches = project.techs.filter(tech => selectedTechs.includes(tech));
    if (matches.length >= 2) {
      matchedProject.value = project;
      break;
    }
  }
  
  showResult.value = true;
}
</script>

<style scoped>
.slots-page {
  min-height: 100vh;
  background: #050505;
  padding-top: 80px;
}

/* HEADER */
.slots-header {
  padding: 1rem 0;
  background: #0a0a0a;
  border-bottom: 1px solid var(--border);
  position: relative;
  z-index: 10;
}

.slots-header__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.slots-back {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.75rem;
  color: var(--text-muted);
  text-decoration: none;
  transition: color 0.2s;
}

.slots-back:hover {
  color: var(--primary);
}

.slots-header__title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.slots-header__icon {
  font-size: 1.5rem;
}

.slots-header__title h1 {
  font-size: 1.25rem;
  font-weight: 700;
  letter-spacing: 0.1em;
}

.slots-header__spins {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.75rem;
  color: var(--primary);
}

/* GAME */
.slots-game {
  padding: var(--space-lg) 0;
}

.slots-intro {
  text-align: center;
  font-size: 1rem;
  color: var(--text-muted);
  margin-bottom: var(--space-lg);
}

/* MACHINE */
.slot-machine {
  max-width: 500px;
  margin: 0 auto var(--space-xl);
}

.slot-machine__frame {
  background: linear-gradient(180deg, #1a1a1a 0%, #0a0a0a 100%);
  border: 3px solid #FFD700;
  border-radius: 1.5rem;
  padding: 1.5rem;
  position: relative;
  box-shadow: 
    0 0 30px rgba(255, 215, 0, 0.2),
    inset 0 0 60px rgba(0, 0, 0, 0.5);
}

.slot-machine__top {
  text-align: center;
  margin-bottom: 1.5rem;
}

.slot-machine__logo {
  font-family: 'JetBrains Mono', monospace;
  font-size: 1.25rem;
  font-weight: 900;
  color: #FFD700;
  text-shadow: 0 0 20px rgba(255, 215, 0, 0.5);
}

/* REELS */
.slot-reels {
  display: flex;
  justify-content: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.slot-reel {
  width: 100px;
  height: 80px;
  background: #0f0f0f;
  border: 2px solid var(--border);
  border-radius: 0.5rem;
  overflow: hidden;
  position: relative;
}

.slot-reel::before,
.slot-reel::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  height: 20px;
  z-index: 2;
  pointer-events: none;
}

.slot-reel::before {
  top: 0;
  background: linear-gradient(180deg, #0f0f0f 0%, transparent 100%);
}

.slot-reel::after {
  bottom: 0;
  background: linear-gradient(0deg, #0f0f0f 0%, transparent 100%);
}

.slot-reel__window {
  height: 100%;
  overflow: hidden;
}

.slot-reel__strip {
  transition: transform 0.1s linear;
}

.slot-reel.spinning .slot-reel__strip {
  transition: none;
}

.slot-symbol {
  height: 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
}

.slot-symbol__icon {
  font-size: 2rem;
}

.slot-symbol__name {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.55rem;
  color: var(--text-muted);
}

/* RESULT */
.slot-result {
  min-height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
  opacity: 0;
  transform: scale(0.9);
  transition: all 0.3s ease;
}

.slot-result.show {
  opacity: 1;
  transform: scale(1);
}

.slot-result__win,
.slot-result__miss {
  text-align: center;
  padding: 1rem;
}

.slot-result__icon {
  font-size: 2.5rem;
  display: block;
  margin-bottom: 0.5rem;
}

.slot-result__win h3 {
  color: var(--primary);
  font-size: 1.1rem;
  margin-bottom: 0.25rem;
}

.slot-result__miss h3 {
  color: var(--text-muted);
  font-size: 1rem;
  margin-bottom: 0.25rem;
}

.slot-result p {
  font-size: 0.85rem;
  color: var(--text-dark);
  margin-bottom: 0.75rem;
}

/* LEVER */
.slot-lever {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  width: 100%;
  padding: 1rem;
  background: linear-gradient(180deg, #EF4444 0%, #B91C1C 100%);
  border: none;
  border-radius: 0.75rem;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
  overflow: hidden;
}

.slot-lever:hover:not(:disabled) {
  transform: scale(1.02);
  box-shadow: 0 0 30px rgba(239, 68, 68, 0.4);
}

.slot-lever:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.slot-lever__handle {
  width: 40px;
  height: 40px;
  background: linear-gradient(145deg, #ffd700, #b8860b);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s;
}

.slot-lever.pulled .slot-lever__handle {
  transform: translateY(10px);
}

.slot-lever__ball {
  width: 20px;
  height: 20px;
  background: radial-gradient(circle at 30% 30%, #fff, #ffd700);
  border-radius: 50%;
}

.slot-lever__text {
  font-family: 'JetBrains Mono', monospace;
  font-size: 1rem;
  font-weight: 700;
  color: white;
  letter-spacing: 0.1em;
}

/* LEGEND */
.slots-legend {
  max-width: 500px;
  margin: 0 auto;
  padding: 1.5rem;
  border-radius: 1rem;
  border: 1px solid var(--border);
}

.slots-legend h4 {
  font-size: 0.9rem;
  margin-bottom: 1rem;
  text-align: center;
}

.slots-legend__grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.75rem;
}

.legend-tech {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  padding: 0.5rem;
  background: var(--surface);
  border-radius: 0.5rem;
}

.legend-tech__icon {
  font-size: 1.25rem;
}

.legend-tech__name {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.55rem;
  color: var(--text-muted);
}

/* RESPONSIVE */
@media (max-width: 500px) {
  .slot-reel {
    width: 80px;
    height: 70px;
  }
  
  .slot-symbol {
    height: 70px;
  }
  
  .slot-symbol__icon {
    font-size: 1.5rem;
  }
  
  .slots-legend__grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>
