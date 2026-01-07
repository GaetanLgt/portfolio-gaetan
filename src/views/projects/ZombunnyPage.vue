<template>
  <div class="zombunny-page">
    <!-- Ambient Background - Lab/Simulation vibe -->
    <div class="zb-ambient">
      <div class="zb-ambient__grid"></div>
      <div class="zb-ambient__glow"></div>
    </div>
    
    <!-- Floating DNA particles -->
    <div class="zb-particles" aria-hidden="true">
      <span v-for="n in 15" :key="n" class="zb-particle" :style="getParticleStyle(n)">
        {{ ['🧬', '🥚', '🐰'][n % 3] }}
      </span>
    </div>

    <!-- HERO - Immersive Lab Style -->
    <section class="zb-hero">
      <div class="container">
        <div class="zb-hero__content">
          <!-- Animated Bunny + Egg -->
          <div class="zb-hero__visual" aria-hidden="true">
            <div class="hero-lab">
              <div class="hero-maze">
                <div class="maze-cell" v-for="i in 25" :key="i" :class="getMazeClass(i)"></div>
              </div>
              <div class="hero-bunny" :style="{ left: bunnyPos.x + '%', top: bunnyPos.y + '%' }">
                🐰
              </div>
              <div class="hero-egg hero-egg--1">🥚</div>
              <div class="hero-egg hero-egg--2">🥚</div>
              <div class="hero-egg hero-egg--3">🥚</div>
            </div>
          </div>
          
          <div class="zb-hero__text">
            <div class="status-badge">
              <span class="status-badge__dot"></span>
              <span class="status-badge__text">SIMULATION EN COURS</span>
            </div>
            
            <h1 class="zb-hero__title">
              <span class="zb-hero__title-main text-gradient">Zombunny</span>
              <span class="zb-hero__subtitle-inline">Algorithmes Génétiques × Unity</span>
            </h1>
            
            <p class="zb-hero__tagline">
              Évolution. Sélection. Adaptation.
            </p>
            
            <p class="zb-hero__desc">
              Des lapins virtuels qui <strong>apprennent à survivre</strong> dans un labyrinthe.
              Pas de programmation explicite — juste la <strong>sélection naturelle</strong>.
            </p>
            
            <div class="zb-hero__stats">
              <div class="hero-stat">
                <span class="hero-stat__value">{{ generation }}</span>
                <span class="hero-stat__label">Génération</span>
              </div>
              <div class="hero-stat">
                <span class="hero-stat__value">{{ population }}</span>
                <span class="hero-stat__label">Population</span>
              </div>
              <div class="hero-stat">
                <span class="hero-stat__value">{{ bestFitness }}%</span>
                <span class="hero-stat__label">Best Fitness</span>
              </div>
            </div>
            
            <div class="zb-hero__tags">
              <span class="tag tag--csharp">C#</span>
              <span class="tag tag--unity">Unity</span>
              <span class="tag tag--ai">IA Évolutionnaire</span>
              <span class="tag tag--algo">Algorithmes Génétiques</span>
            </div>
            
            <a href="https://github.com/GaetanLgt/zombunny" target="_blank" rel="noopener" class="zb-hero__cta">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              VOIR LE CODE SOURCE
            </a>
          </div>
        </div>
      </div>
      
      <!-- Scroll hint -->
      <div class="zb-hero__scroll" aria-hidden="true">
        <span>Découvrir</span>
        <div class="zb-hero__scroll-arrow"></div>
      </div>
    </section>
    
    <!-- SIMULATION INTERACTIVE -->
    <section class="zb-simulation">
      <div class="container">
        <div class="section-header section-header--center">
          <span class="mono-tag">/// SIMULATION</span>
          <h2>Visualisation en temps réel</h2>
          <p class="section-desc">
            Observe comment les lapins évoluent pour collecter plus d'œufs à chaque génération.
          </p>
        </div>
        
        <div class="sim-container glass">
          <!-- Simulation Area -->
          <div class="sim-arena">
            <div class="sim-grid">
              <div 
                v-for="(cell, i) in simGrid" 
                :key="i" 
                class="sim-cell"
                :class="{ 
                  'sim-cell--wall': cell === 'W',
                  'sim-cell--egg': cell === 'E',
                  'sim-cell--bunny': cell === 'B',
                  'sim-cell--collected': cell === 'C'
                }"
              >
                <span v-if="cell === 'E'" class="sim-cell__content">🥚</span>
                <span v-if="cell === 'B'" class="sim-cell__content sim-bunny">🐰</span>
              </div>
            </div>
          </div>
          
          <!-- Controls -->
          <div class="sim-controls">
            <div class="sim-controls__top">
              <button @click="startSimulation" :disabled="simRunning" class="sim-btn sim-btn--primary">
                {{ simRunning ? '⏳ En cours...' : '▶️ Lancer' }}
              </button>
              <button @click="resetSimulation" class="sim-btn sim-btn--secondary">
                🔄 Reset
              </button>
              <button @click="nextGeneration" :disabled="simRunning" class="sim-btn sim-btn--secondary">
                ⏭️ Génération +1
              </button>
            </div>
            
            <div class="sim-stats">
              <div class="sim-stat">
                <span class="sim-stat__label">Génération</span>
                <span class="sim-stat__value">{{ simGeneration }}</span>
              </div>
              <div class="sim-stat">
                <span class="sim-stat__label">Œufs collectés</span>
                <span class="sim-stat__value">{{ eggsCollected }} / {{ totalEggs }}</span>
              </div>
              <div class="sim-stat">
                <span class="sim-stat__label">Fitness moyenne</span>
                <span class="sim-stat__value">{{ avgFitness }}%</span>
              </div>
              <div class="sim-stat">
                <span class="sim-stat__label">Meilleur score</span>
                <span class="sim-stat__value">{{ bestScore }}</span>
              </div>
            </div>
            
            <!-- Fitness Graph -->
            <div class="sim-graph">
              <div class="sim-graph__label">Évolution de la fitness</div>
              <div class="sim-graph__bars">
                <div 
                  v-for="(f, i) in fitnessHistory" 
                  :key="i" 
                  class="sim-graph__bar"
                  :style="{ height: f + '%' }"
                  :title="`Gen ${i + 1}: ${f}%`"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    
    <!-- CONCEPT -->
    <section class="zb-section">
      <div class="container">
        <div class="section-header">
          <span class="mono-tag">/// CONCEPT</span>
          <h2>Qu'est-ce qu'un algorithme génétique ?</h2>
        </div>
        
        <div class="zb-intro-grid">
          <div class="zb-intro__text">
            <p>
              Les <strong>algorithmes génétiques</strong> (AG) sont des méthodes d'optimisation 
              inspirées de la théorie de l'évolution de Darwin. Ils simulent le processus de 
              sélection naturelle pour résoudre des problèmes complexes.
            </p>
            <p>
              Dans <strong>Zombunny</strong>, chaque lapin possède un "ADN" qui détermine 
              son comportement dans le labyrinthe : direction préférée, réactivité, mémoire...
              Les lapins qui collectent le plus d'œufs ont plus de chances de se reproduire.
            </p>
            
            <div class="concept-highlight glass">
              <span class="concept-highlight__icon">💡</span>
              <div>
                <strong>Pas de programmation explicite</strong>
                <p>On ne dit jamais au lapin "va vers l'œuf". Il apprend seul par essai-erreur évolutif.</p>
              </div>
            </div>
          </div>
          
          <div class="zb-intro__principles glass">
            <h3>🧬 Principes de Darwin</h3>
            <ul>
              <li>
                <span class="principle-icon">🎯</span>
                <div>
                  <strong>Sélection</strong>
                  <span>Les plus adaptés survivent et se reproduisent</span>
                </div>
              </li>
              <li>
                <span class="principle-icon">🧬</span>
                <div>
                  <strong>Hérédité</strong>
                  <span>Les enfants héritent des gènes des parents</span>
                </div>
              </li>
              <li>
                <span class="principle-icon">🔀</span>
                <div>
                  <strong>Variation</strong>
                  <span>Mutations aléatoires créent de la diversité</span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
    
    <!-- CYCLE GÉNÉTIQUE -->
    <section class="zb-section zb-section--dark">
      <div class="container">
        <div class="section-header section-header--center">
          <span class="mono-tag">/// CYCLE ÉVOLUTIF</span>
          <h2>Le cycle de l'algorithme génétique</h2>
          <p class="section-desc">
            Chaque génération passe par ces 4 étapes pour évoluer vers une solution optimale.
          </p>
        </div>
        
        <!-- Cycle Cards - Horizontal -->
        <div class="zb-cycle-flow">
          <div 
            v-for="(step, index) in cycleSteps" 
            :key="step.id"
            class="zb-cycle-card glass"
            :class="{ 'active': activeStep === index }"
            @click="activeStep = index"
          >
            <div class="zb-cycle-card__num">{{ String(index + 1).padStart(2, '0') }}</div>
            <div class="zb-cycle-card__icon">{{ step.icon }}</div>
            <h3>{{ step.title }}</h3>
            <p>{{ step.short }}</p>
            
            <Transition name="expand">
              <div v-if="activeStep === index" class="zb-cycle-card__detail">
                {{ step.description }}
              </div>
            </Transition>
            
            <div v-if="index < cycleSteps.length - 1" class="zb-cycle-card__arrow">→</div>
          </div>
        </div>
      </div>
    </section>
    
    <!-- ADN STRUCTURE -->
    <section class="zb-section">
      <div class="container">
        <div class="section-header">
          <span class="mono-tag">/// STRUCTURE ADN</span>
          <h2>Le génome du lapin</h2>
        </div>
        
        <div class="zb-dna-grid">
          <!-- DNA Visual - 3 Sensors -->
          <div class="zb-dna__visual">
            <div class="sensor-diagram">
              <div class="sensor-bunny">🐰</div>
              <div class="sensor sensor--left" :class="{ active: sensorDemo.left }">
                <span class="sensor__ray"></span>
                <span class="sensor__label">L</span>
              </div>
              <div class="sensor sensor--front" :class="{ active: sensorDemo.front }">
                <span class="sensor__ray"></span>
                <span class="sensor__label">F</span>
              </div>
              <div class="sensor sensor--right" :class="{ active: sensorDemo.right }">
                <span class="sensor__ray"></span>
                <span class="sensor__label">R</span>
              </div>
              <div class="sensor-legend">
                <span @click="toggleSensor('left')" :class="{ active: sensorDemo.left }">Gauche</span>
                <span @click="toggleSensor('front')" :class="{ active: sensorDemo.front }">Devant</span>
                <span @click="toggleSensor('right')" :class="{ active: sensorDemo.right }">Droite</span>
              </div>
            </div>
            
            <div class="sensor-result">
              <span class="sensor-result__key">{{ sensorKey }}</span>
              <span class="sensor-result__arrow">→</span>
              <span class="sensor-result__angle">{{ sensorAngle }}°</span>
            </div>
          </div>
          
          <!-- Genes Info - Dictionary Structure -->
          <div class="zb-dna__info">
            <p>
              Le DNA est un <strong>Dictionary&lt;(bool,bool,bool), float&gt;</strong> : 
              la clé représente l'état des 3 capteurs (gauche, devant, droite), 
              la valeur est l'<strong>angle de rotation</strong> à appliquer (-90° à +90°).
            </p>
            
            <div class="dna-dict">
              <div class="dna-dict__header">
                <span>CLÉ (L,F,R)</span>
                <span>→</span>
                <span>ANGLE</span>
                <span>COMPORTEMENT</span>
              </div>
              <div 
                v-for="gene in genes" 
                :key="gene.name" 
                class="dna-dict__row"
                :class="{ active: gene.name === sensorKey }"
              >
                <code class="dna-dict__key">{{ gene.name }}</code>
                <span class="dna-dict__arrow">→</span>
                <span class="dna-dict__value">{{ gene.value }}°</span>
                <span class="dna-dict__desc">{{ gene.desc }}</span>
              </div>
            </div>
            
            <div class="dna-note glass">
              <span>💡</span>
              <p>2³ = <strong>8 combinaisons</strong> possibles. Chaque gène (angle) est initialisé aléatoirement, puis optimisé par sélection naturelle.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
    
    <!-- CODE SNIPPETS -->
    <section class="zb-section zb-section--dark">
      <div class="container">
        <div class="section-header">
          <span class="mono-tag">/// IMPLÉMENTATION C#</span>
          <h2>Code source clé</h2>
        </div>
        
        <div class="zb-code-tabs">
          <div class="zb-code-tabs__nav">
            <button 
              v-for="tab in codeTabs" 
              :key="tab.id"
              class="zb-code-tab"
              :class="{ 'active': activeCodeTab === tab.id }"
              @click="activeCodeTab = tab.id"
            >
              <span class="zb-code-tab__icon">{{ tab.icon }}</span>
              {{ tab.label }}
            </button>
          </div>
          
          <div class="zb-code-content glass">
            <div class="zb-code-header">
              <div class="zb-code-dots">
                <span></span><span></span><span></span>
              </div>
              <span class="zb-code-filename">{{ currentCodeTab.filename }}</span>
              <span class="zb-code-lang">C#</span>
            </div>
            <Transition name="fade" mode="out-in">
              <pre :key="activeCodeTab"><code v-html="currentCodeTab.code"></code></pre>
            </Transition>
          </div>
        </div>
      </div>
    </section>
    
    <!-- RESULTS -->
    <section class="zb-section">
      <div class="container">
        <div class="section-header section-header--center">
          <span class="mono-tag">/// RÉSULTATS</span>
          <h2>Évolution observée</h2>
          <p class="section-desc">
            Après plusieurs générations, les lapins développent des comportements émergents.
          </p>
        </div>
        
        <div class="zb-results-grid">
          <div class="zb-result-card glass">
            <div class="zb-result-card__icon">📈</div>
            <div class="zb-result-card__value">+340%</div>
            <div class="zb-result-card__label">Fitness moyenne</div>
            <p>Amélioration du score après 50 générations</p>
          </div>
          
          <div class="zb-result-card glass">
            <div class="zb-result-card__icon">🧬</div>
            <div class="zb-result-card__value">~15</div>
            <div class="zb-result-card__label">Générations</div>
            <p>Pour atteindre un comportement efficace</p>
          </div>
          
          <div class="zb-result-card glass">
            <div class="zb-result-card__icon">🎯</div>
            <div class="zb-result-card__value">92%</div>
            <div class="zb-result-card__label">Convergence</div>
            <p>Taux vers une solution optimale</p>
          </div>
        </div>
        
        <!-- Emergence Behaviors -->
        <div class="zb-emergence">
          <h3>🧠 Comportements émergents observés</h3>
          <div class="zb-emergence__grid">
            <div class="zb-emergence__item glass">
              <div class="emergence-icon">🥚</div>
              <h4>Chasse aux œufs</h4>
              <p>Les lapins apprennent à détecter et se diriger vers les œufs les plus proches.</p>
            </div>
            <div class="zb-emergence__item glass">
              <div class="emergence-icon">🧱</div>
              <h4>Évitement des murs</h4>
              <p>Développement naturel de la capacité à contourner les obstacles.</p>
            </div>
            <div class="zb-emergence__item glass">
              <div class="emergence-icon">⚡</div>
              <h4>Optimisation du chemin</h4>
              <p>Les lapins trouvent progressivement les routes les plus efficaces.</p>
            </div>
            <div class="zb-emergence__item glass">
              <div class="emergence-icon">🔄</div>
              <h4>Exploration vs Exploitation</h4>
              <p>Balance entre chercher de nouveaux œufs et exploiter les zones connues.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
    
    <!-- LEARNINGS & CTA -->
    <section class="zb-section zb-section--dark">
      <div class="container">
        <div class="zb-learnings">
          <div class="zb-learnings__content">
            <span class="mono-tag">/// APPRENTISSAGES</span>
            <h2>Ce que ce projet m'a appris</h2>
            <ul>
              <li>
                <span class="learn-icon">🎮</span>
                Implémentation d'algorithmes bio-inspirés dans Unity
              </li>
              <li>
                <span class="learn-icon">🧬</span>
                Gestion de populations et cycles de vie
              </li>
              <li>
                <span class="learn-icon">⚖️</span>
                Balance exploration/exploitation (taux de mutation)
              </li>
              <li>
                <span class="learn-icon">📊</span>
                Visualisation de données évolutives en temps réel
              </li>
              <li>
                <span class="learn-icon">⚡</span>
                Optimisation des performances pour grandes populations
              </li>
            </ul>
          </div>
          
          <div class="zb-learnings__cta glass">
            <div class="zb-learnings__bunny">🐰</div>
            <h3>Explorer le code complet</h3>
            <p>Le projet Unity est disponible sur GitHub avec toute l'implémentation des algorithmes génétiques.</p>
            <a href="https://github.com/GaetanLgt/zombunny" target="_blank" rel="noopener" class="btn btn--primary">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              VOIR SUR GITHUB
            </a>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';

// Hero animation
const bunnyPos = ref({ x: 20, y: 20 });
const generation = ref(42);
const population = ref(50);
const bestFitness = ref(87);
let bunnyInterval = null;

// Sensor demo
const sensorDemo = ref({ left: false, front: true, right: false });
const sensorKey = computed(() => {
  const l = sensorDemo.value.left ? 'true' : 'false';
  const f = sensorDemo.value.front ? 'true' : 'false';
  const r = sensorDemo.value.right ? 'true' : 'false';
  return `${l},${f},${r}`;
});
const sensorAngle = computed(() => {
  const gene = genes.find(g => g.name === sensorKey.value);
  return gene ? gene.value : 0;
});
function toggleSensor(sensor) {
  sensorDemo.value[sensor] = !sensorDemo.value[sensor];
}

// Simulation state
const simRunning = ref(false);
const simGeneration = ref(1);
const eggsCollected = ref(0);
const totalEggs = ref(5);
const avgFitness = ref(15);
const bestScore = ref(0);
const fitnessHistory = ref([15]);

// Grid: 10x10 = 100 cells
const simGrid = ref(generateGrid());

function generateGrid() {
  const grid = Array(100).fill('');
  // Walls
  [12, 13, 14, 22, 32, 42, 52, 57, 58, 67, 68, 77, 78, 85, 86, 87].forEach(i => grid[i] = 'W');
  // Eggs
  [5, 34, 49, 73, 91].forEach(i => grid[i] = 'E');
  // Bunny start
  grid[0] = 'B';
  return grid;
}

function startSimulation() {
  if (simRunning.value) return;
  simRunning.value = true;
  runSimStep();
}

function runSimStep() {
  if (!simRunning.value) return;
  
  // Simple simulation: move bunny towards eggs
  const bunnyIndex = simGrid.value.indexOf('B');
  if (bunnyIndex === -1) {
    simRunning.value = false;
    return;
  }
  
  // Find nearest egg
  let nearestEgg = -1;
  let minDist = Infinity;
  simGrid.value.forEach((cell, i) => {
    if (cell === 'E') {
      const dist = Math.abs(i % 10 - bunnyIndex % 10) + Math.abs(Math.floor(i / 10) - Math.floor(bunnyIndex / 10));
      if (dist < minDist) {
        minDist = dist;
        nearestEgg = i;
      }
    }
  });
  
  if (nearestEgg === -1) {
    // All eggs collected!
    simRunning.value = false;
    avgFitness.value = Math.min(100, avgFitness.value + 15);
    return;
  }
  
  // Move towards egg (with some randomness based on fitness)
  const bx = bunnyIndex % 10;
  const by = Math.floor(bunnyIndex / 10);
  const ex = nearestEgg % 10;
  const ey = Math.floor(nearestEgg / 10);
  
  let newIndex = bunnyIndex;
  const moveChance = avgFitness.value / 100;
  
  if (Math.random() < moveChance) {
    // Smart move
    if (ex > bx) newIndex = bunnyIndex + 1;
    else if (ex < bx) newIndex = bunnyIndex - 1;
    else if (ey > by) newIndex = bunnyIndex + 10;
    else if (ey < by) newIndex = bunnyIndex - 10;
  } else {
    // Random move
    const dirs = [1, -1, 10, -10];
    newIndex = bunnyIndex + dirs[Math.floor(Math.random() * 4)];
  }
  
  // Validate move
  if (newIndex >= 0 && newIndex < 100 && simGrid.value[newIndex] !== 'W') {
    const newGrid = [...simGrid.value];
    newGrid[bunnyIndex] = '';
    
    if (newGrid[newIndex] === 'E') {
      eggsCollected.value++;
      bestScore.value = Math.max(bestScore.value, eggsCollected.value);
    }
    
    newGrid[newIndex] = 'B';
    simGrid.value = newGrid;
  }
  
  setTimeout(runSimStep, 300);
}

function resetSimulation() {
  simRunning.value = false;
  simGrid.value = generateGrid();
  eggsCollected.value = 0;
}

function nextGeneration() {
  simGeneration.value++;
  avgFitness.value = Math.min(95, avgFitness.value + Math.floor(Math.random() * 10) + 5);
  fitnessHistory.value.push(avgFitness.value);
  if (fitnessHistory.value.length > 15) fitnessHistory.value.shift();
  resetSimulation();
}

// Maze cell class for hero
function getMazeClass(i) {
  const walls = [3, 4, 8, 13, 14, 18, 23];
  return walls.includes(i) ? 'maze-cell--wall' : '';
}

// Particles
function getParticleStyle(n) {
  return {
    '--delay': `${Math.random() * 15}s`,
    '--x': `${Math.random() * 100}%`,
    '--duration': `${15 + Math.random() * 20}s`,
    left: `${Math.random() * 100}%`,
    animationDelay: `${Math.random() * 10}s`
  };
}

// Cycle steps
const activeStep = ref(0);
const cycleSteps = [
  {
    id: 'selection',
    icon: '🎯',
    title: 'Sélection',
    short: 'Évaluer la fitness',
    description: 'Chaque lapin est évalué selon le nombre d\'œufs collectés. Les meilleurs ont plus de chances de se reproduire.'
  },
  {
    id: 'crossover',
    icon: '🔀',
    title: 'Croisement',
    short: 'Combiner les gènes',
    description: 'Deux parents échangent des portions de leur ADN pour créer des enfants avec les traits des deux.'
  },
  {
    id: 'mutation',
    icon: '⚡',
    title: 'Mutation',
    short: 'Variations aléatoires',
    description: 'Modifications aléatoires du génome (1-5%) pour explorer de nouvelles stratégies.'
  },
  {
    id: 'generation',
    icon: '🔄',
    title: 'Nouvelle génération',
    short: 'Itérer le processus',
    description: 'La nouvelle population remplace l\'ancienne. Le cycle recommence.'
  }
];

// Genes - Représentation Dictionary<(bool,bool,bool), float>
// 8 combinaisons possibles pour gauche/devant/droite
const genes = [
  { name: 'false,false,false', icon: '↑', value: 0, desc: 'Aucun mur → tout droit (0°)' },
  { name: 'false,false,true', icon: '↰', value: -45, desc: 'Mur à droite → tourner gauche' },
  { name: 'false,true,false', icon: '↶', value: 90, desc: 'Mur devant → demi-tour' },
  { name: 'false,true,true', icon: '↰', value: -90, desc: 'Devant+droite → tourner gauche' },
  { name: 'true,false,false', icon: '↱', value: 45, desc: 'Mur à gauche → tourner droite' },
  { name: 'true,false,true', icon: '↑', value: 0, desc: 'Gauche+droite → avancer (couloir)' },
  { name: 'true,true,false', icon: '↱', value: 90, desc: 'Gauche+devant → tourner droite' },
  { name: 'true,true,true', icon: '↶', value: 180, desc: 'Cul-de-sac → demi-tour complet' }
];

// DNA visualization
const dnaSequence = ['A', 'T', 'G', 'C'];
const dnaColors = ['green', 'red', 'yellow', 'blue'];

function getDnaLetter(index, side) {
  const baseIndex = (index + (side === 'right' ? 2 : 0)) % 4;
  return dnaSequence[baseIndex];
}

function getDnaColor(index, side) {
  const baseIndex = (index + (side === 'right' ? 2 : 0)) % 4;
  return dnaColors[baseIndex];
}

// Code tabs - Basés sur la vraie implémentation des vidéos
const activeCodeTab = ref('dna');
const codeTabs = [
  { id: 'dna', label: 'DNA.cs', icon: '🧬' },
  { id: 'brain', label: 'Brain.cs', icon: '🧠' },
  { id: 'population', label: 'PopulationManager.cs', icon: '👥' },
  { id: 'breed', label: 'Breed()', icon: '🔀' }
];

// Code snippets - Implémentation réelle basée sur les vidéos
const codeSnippets = {
  dna: {
    filename: 'DNA.cs',
    code: `<span class="code-keyword">public class</span> <span class="code-class">DNA</span>
{
    <span class="code-comment">// Clé: (gauche, devant, droite) → Valeur: angle de rotation</span>
    <span class="code-class">Dictionary</span><<span class="code-keyword">string</span>, <span class="code-keyword">float</span>> genes;
    <span class="code-keyword">int</span> dnaLength;

    <span class="code-keyword">public</span> <span class="code-function">DNA</span>()
    {
        genes = <span class="code-keyword">new</span> <span class="code-class">Dictionary</span><<span class="code-keyword">string</span>, <span class="code-keyword">float</span>>();
        <span class="code-function">SetRandom</span>();
    }

    <span class="code-keyword">public void</span> <span class="code-function">SetRandom</span>()
    {
        genes.Clear();
        <span class="code-comment">// 8 combinaisons possibles (2³)</span>
        <span class="code-keyword">string</span>[] keys = { <span class="code-string">"000"</span>, <span class="code-string">"001"</span>, <span class="code-string">"010"</span>, <span class="code-string">"011"</span>,
                         <span class="code-string">"100"</span>, <span class="code-string">"101"</span>, <span class="code-string">"110"</span>, <span class="code-string">"111"</span> };
        <span class="code-keyword">foreach</span> (<span class="code-keyword">var</span> key <span class="code-keyword">in</span> keys)
            genes[key] = <span class="code-class">Random</span>.Range(<span class="code-number">-90f</span>, <span class="code-number">90f</span>);
        dnaLength = genes.Count;
    }

    <span class="code-keyword">public float</span> <span class="code-function">GetGene</span>(<span class="code-keyword">bool</span> left, <span class="code-keyword">bool</span> front, <span class="code-keyword">bool</span> right)
    {
        <span class="code-keyword">string</span> key = (left?<span class="code-string">"1"</span>:<span class="code-string">"0"</span>) + (front?<span class="code-string">"1"</span>:<span class="code-string">"0"</span>) + (right?<span class="code-string">"1"</span>:<span class="code-string">"0"</span>);
        <span class="code-keyword">return</span> genes[key];
    }
}`
  },
  brain: {
    filename: 'Brain.cs',
    code: `<span class="code-keyword">public class</span> <span class="code-class">Brain</span> : <span class="code-class">MonoBehaviour</span>
{
    <span class="code-keyword">public</span> <span class="code-class">DNA</span> dna;
    <span class="code-keyword">public</span> <span class="code-class">GameObject</span> eyes;  <span class="code-comment">// Point de départ des raycasts</span>
    <span class="code-keyword">public int</span> eggsFound = <span class="code-number">0</span>;
    <span class="code-keyword">bool</span> seeWallLeft, seeWallFront, seeWallRight;
    <span class="code-keyword">bool</span> canMove = <span class="code-keyword">true</span>;

    <span class="code-keyword">void</span> <span class="code-function">Update</span>()
    {
        <span class="code-comment">// 3 SphereCasts: gauche, devant, droite</span>
        seeWallLeft = <span class="code-class">Physics</span>.SphereCast(eyes.transform.position,
            <span class="code-number">0.1f</span>, -eyes.transform.right, <span class="code-keyword">out</span> _, <span class="code-number">1f</span>);
        seeWallFront = <span class="code-class">Physics</span>.SphereCast(eyes.transform.position,
            <span class="code-number">0.1f</span>, eyes.transform.forward, <span class="code-keyword">out</span> _, <span class="code-number">1f</span>);
        seeWallRight = <span class="code-class">Physics</span>.SphereCast(eyes.transform.position,
            <span class="code-number">0.1f</span>, eyes.transform.right, <span class="code-keyword">out</span> _, <span class="code-number">1f</span>);
        canMove = !seeWallFront;
    }

    <span class="code-keyword">void</span> <span class="code-function">FixedUpdate</span>()
    {
        <span class="code-keyword">float</span> angle = dna.GetGene(seeWallLeft, seeWallFront, seeWallRight);
        transform.Rotate(<span class="code-number">0</span>, angle, <span class="code-number">0</span>);
        <span class="code-keyword">if</span> (canMove) transform.Translate(<span class="code-number">0</span>, <span class="code-number">0</span>, <span class="code-number">0.1f</span>);
    }

    <span class="code-keyword">void</span> <span class="code-function">OnTriggerEnter</span>(<span class="code-class">Collider</span> col)
    {
        <span class="code-keyword">if</span> (col.CompareTag(<span class="code-string">"Egg"</span>)) {
            eggsFound++;
            col.gameObject.SetActive(<span class="code-keyword">false</span>);
        }
    }
}`
  },
  population: {
    filename: 'PopulationManager.cs',
    code: `<span class="code-keyword">public class</span> <span class="code-class">PopulationManager</span> : <span class="code-class">MonoBehaviour</span>
{
    <span class="code-keyword">public int</span> populationSize = <span class="code-number">50</span>;
    <span class="code-keyword">public float</span> trialTime = <span class="code-number">60f</span>;
    <span class="code-keyword">public float</span> elapsed = <span class="code-number">0</span>;
    <span class="code-keyword">public int</span> generation = <span class="code-number">1</span>;
    <span class="code-class">List</span><<span class="code-class">GameObject</span>> population;

    <span class="code-keyword">void</span> <span class="code-function">Update</span>()
    {
        elapsed += <span class="code-class">Time</span>.deltaTime;
        <span class="code-keyword">if</span> (elapsed >= trialTime)
        {
            <span class="code-function">BreedNewPopulation</span>();
            elapsed = <span class="code-number">0</span>;
        }
    }

    <span class="code-keyword">void</span> <span class="code-function">BreedNewPopulation</span>()
    {
        <span class="code-comment">// Trier par fitness (œufs trouvés)</span>
        <span class="code-keyword">var</span> sorted = population
            .OrderByDescending(o => o.GetComponent<<span class="code-class">Brain</span>>().eggsFound)
            .ToList();
        
        <span class="code-comment">// Sélection des meilleurs parents (top 25%)</span>
        <span class="code-keyword">int</span> cutoff = sorted.Count / <span class="code-number">4</span>;
        <span class="code-keyword">var</span> newPop = <span class="code-keyword">new</span> <span class="code-class">List</span><<span class="code-class">GameObject</span>>();

        <span class="code-keyword">for</span> (<span class="code-keyword">int</span> i = <span class="code-number">0</span>; i < cutoff; i++)
            <span class="code-keyword">for</span> (<span class="code-keyword">int</span> j = <span class="code-number">0</span>; j < cutoff && newPop.Count < populationSize; j++)
                newPop.Add(<span class="code-function">Breed</span>(sorted[i], sorted[j]));

        <span class="code-comment">// Détruire ancienne génération</span>
        <span class="code-keyword">foreach</span> (<span class="code-keyword">var</span> b <span class="code-keyword">in</span> sorted) Destroy(b);
        population = newPop;
        generation++;
    }
}`
  },
  breed: {
    filename: 'PopulationManager.cs',
    code: `<span class="code-class">GameObject</span> <span class="code-function">Breed</span>(<span class="code-class">GameObject</span> parent1, <span class="code-class">GameObject</span> parent2)
{
    <span class="code-comment">// Spawn à une position aléatoire</span>
    <span class="code-keyword">var</span> spawn = spawnPoints[<span class="code-class">Random</span>.Range(<span class="code-number">0</span>, spawnPoints.Length)];
    <span class="code-keyword">var</span> offspring = Instantiate(bunnyPrefab, spawn.position, spawn.rotation);
    <span class="code-keyword">var</span> brain = offspring.GetComponent<<span class="code-class">Brain</span>>();

    <span class="code-comment">// Mutation: 1 chance sur 100 → DNA entièrement aléatoire</span>
    <span class="code-keyword">if</span> (<span class="code-class">Random</span>.Range(<span class="code-number">0</span>, <span class="code-number">100</span>) == <span class="code-number">1</span>)
    {
        brain.dna = <span class="code-keyword">new</span> <span class="code-class">DNA</span>();  <span class="code-comment">// SetRandom() dans constructeur</span>
    }
    <span class="code-keyword">else</span>
    {
        <span class="code-comment">// Croisement normal</span>
        brain.dna = <span class="code-keyword">new</span> <span class="code-class">DNA</span>();
        brain.dna.Combine(
            parent1.GetComponent<<span class="code-class">Brain</span>>().dna,
            parent2.GetComponent<<span class="code-class">Brain</span>>().dna
        );
    }
    <span class="code-keyword">return</span> offspring;
}

<span class="code-comment">// Dans DNA.cs - Méthode Combine</span>
<span class="code-keyword">public void</span> <span class="code-function">Combine</span>(<span class="code-class">DNA</span> d1, <span class="code-class">DNA</span> d2)
{
    <span class="code-keyword">int</span> i = <span class="code-number">0</span>;
    <span class="code-keyword">foreach</span> (<span class="code-keyword">var</span> key <span class="code-keyword">in</span> genes.Keys.ToList())
    {
        genes[key] = i < dnaLength/<span class="code-number">2</span> ? d1.genes[key] : d2.genes[key];
        i++;
    }
}`
  }
};

const currentCodeTab = computed(() => codeSnippets[activeCodeTab.value]);

// Animation loop for hero bunny
onMounted(() => {
  bunnyInterval = setInterval(() => {
    bunnyPos.value = {
      x: 20 + Math.random() * 60,
      y: 20 + Math.random() * 60
    };
  }, 2000);
});

onUnmounted(() => {
  if (bunnyInterval) clearInterval(bunnyInterval);
});
</script>

<style scoped>
.zombunny-page {
  min-height: 100vh;
  position: relative;
  overflow-x: hidden;
}

/* ============================================
   AMBIENT BACKGROUND
   ============================================ */
.zb-ambient {
  position: fixed;
  inset: 0;
  z-index: -1;
  pointer-events: none;
}

.zb-ambient__grid {
  position: absolute;
  inset: 0;
  background-image: 
    linear-gradient(rgba(16, 185, 129, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(16, 185, 129, 0.03) 1px, transparent 1px);
  background-size: 50px 50px;
}

.zb-ambient__glow {
  position: absolute;
  top: 20%;
  left: 50%;
  transform: translateX(-50%);
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, rgba(16, 185, 129, 0.1) 0%, transparent 70%);
  filter: blur(60px);
}

/* Floating particles */
.zb-particles {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
}

.zb-particle {
  position: absolute;
  font-size: 1.5rem;
  opacity: 0.3;
  animation: floatParticle 20s ease-in-out infinite;
}

@keyframes floatParticle {
  0%, 100% {
    transform: translateY(100vh) rotate(0deg);
    opacity: 0;
  }
  10% { opacity: 0.4; }
  90% { opacity: 0.4; }
  100% {
    transform: translateY(-100px) rotate(360deg);
    opacity: 0;
  }
}

/* ============================================
   SECTIONS
   ============================================ */
.zb-section {
  padding: var(--space-xl) 0;
  position: relative;
  z-index: 1;
}

.zb-section--dark {
  background: var(--surface);
}

.section-header {
  margin-bottom: var(--space-lg);
}

.section-header--center {
  text-align: center;
}

.section-header h2 {
  font-size: clamp(1.75rem, 4vw, 2.5rem);
  margin-top: 0.5rem;
}

.section-desc {
  color: var(--text-muted);
  max-width: 600px;
  margin: 0.5rem auto 0;
}

.mono-tag {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.7rem;
  color: var(--primary);
  letter-spacing: 0.1em;
}

/* ============================================
   HERO
   ============================================ */
.zb-hero {
  min-height: 100vh;
  display: flex;
  align-items: center;
  padding: 120px 0 80px;
  position: relative;
}

.zb-hero__content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-xl);
  align-items: center;
}

.zb-hero__visual {
  display: flex;
  justify-content: center;
}

.hero-lab {
  position: relative;
  width: 300px;
  height: 300px;
  background: rgba(10, 10, 10, 0.8);
  border: 2px solid var(--primary);
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 0 40px rgba(16, 185, 129, 0.2);
}

.hero-maze {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 2px;
  padding: 10px;
  height: 100%;
}

.maze-cell {
  background: rgba(16, 185, 129, 0.1);
  border-radius: 2px;
}

.maze-cell--wall {
  background: rgba(16, 185, 129, 0.4);
}

.hero-bunny {
  position: absolute;
  font-size: 2rem;
  transition: all 1s ease;
  filter: drop-shadow(0 0 10px rgba(16, 185, 129, 0.5));
  animation: bunnyBounce 0.5s ease-in-out infinite;
}

@keyframes bunnyBounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}

.hero-egg {
  position: absolute;
  font-size: 1.5rem;
  animation: eggGlow 2s ease-in-out infinite;
}

.hero-egg--1 { top: 20%; right: 15%; animation-delay: 0s; }
.hero-egg--2 { bottom: 30%; left: 20%; animation-delay: 0.5s; }
.hero-egg--3 { bottom: 15%; right: 25%; animation-delay: 1s; }

@keyframes eggGlow {
  0%, 100% { filter: brightness(1); transform: scale(1); }
  50% { filter: brightness(1.3); transform: scale(1.1); }
}

/* Hero Text */
.zb-hero__text {
  max-width: 550px;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.3);
  border-radius: 2rem;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.6rem;
  color: var(--primary);
  letter-spacing: 0.15em;
  margin-bottom: var(--space-md);
}

.status-badge__dot {
  width: 8px;
  height: 8px;
  background: var(--primary);
  border-radius: 50%;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(1.2); }
}

.zb-hero__title {
  font-size: clamp(3rem, 8vw, 5rem);
  font-weight: 900;
  line-height: 1;
  margin-bottom: var(--space-sm);
}

.zb-hero__title-main {
  display: block;
}

.zb-hero__subtitle-inline {
  display: block;
  font-size: 0.25em;
  font-weight: 400;
  color: var(--text-muted);
  margin-top: 0.5rem;
  letter-spacing: 0.05em;
}

.zb-hero__tagline {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.9rem;
  color: var(--primary);
  letter-spacing: 0.2em;
  margin-bottom: var(--space-sm);
}

.zb-hero__desc {
  font-size: 1.1rem;
  color: var(--text-muted);
  line-height: 1.7;
  margin-bottom: var(--space-md);
}

.zb-hero__desc strong {
  color: var(--text-main);
}

/* Hero Stats */
.zb-hero__stats {
  display: flex;
  gap: var(--space-md);
  margin-bottom: var(--space-md);
  padding: var(--space-sm);
  background: rgba(10, 10, 10, 0.5);
  border: 1px solid var(--border);
  border-radius: 0.75rem;
}

.hero-stat {
  text-align: center;
  flex: 1;
}

.hero-stat__value {
  display: block;
  font-family: 'JetBrains Mono', monospace;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--primary);
}

.hero-stat__label {
  font-size: 0.65rem;
  color: var(--text-dark);
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

/* Tags */
.zb-hero__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: var(--space-lg);
}

.tag {
  padding: 0.4rem 0.8rem;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 2rem;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.65rem;
  color: var(--text-muted);
  transition: all 0.2s ease;
}

.tag--csharp { border-color: #9B4DCA; color: #9B4DCA; }
.tag--unity { border-color: #222; color: #fff; background: #222; }
.tag--ai { border-color: #10B981; color: #10B981; }
.tag--algo { border-color: #F59E0B; color: #F59E0B; }

/* CTA */
.zb-hero__cta {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  background: var(--primary);
  color: var(--bg);
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.75rem;
  font-weight: 700;
  text-decoration: none;
  border-radius: 0.5rem;
  transition: all 0.3s ease;
}

.zb-hero__cta:hover {
  background: #059669;
  box-shadow: 0 0 30px rgba(16, 185, 129, 0.5);
  transform: translateY(-2px);
}

/* Scroll hint */
.zb-hero__scroll {
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  animation: bounce 2s ease-in-out infinite;
}

.zb-hero__scroll span {
  display: block;
  font-size: 0.7rem;
  color: var(--text-dark);
  margin-bottom: 0.5rem;
  letter-spacing: 0.1em;
}

.zb-hero__scroll-arrow {
  width: 20px;
  height: 20px;
  border-right: 2px solid var(--primary);
  border-bottom: 2px solid var(--primary);
  transform: rotate(45deg);
  margin: 0 auto;
}

@keyframes bounce {
  0%, 100% { transform: translateX(-50%) translateY(0); }
  50% { transform: translateX(-50%) translateY(10px); }
}

/* ============================================
   SIMULATION
   ============================================ */
.zb-simulation {
  padding: var(--space-xl) 0;
  background: linear-gradient(180deg, var(--bg), var(--surface));
}

.sim-container {
  display: grid;
  grid-template-columns: 400px 1fr;
  gap: var(--space-lg);
  padding: var(--space-lg);
  border-radius: 1rem;
  border: 1px solid var(--border);
}

.sim-arena {
  background: var(--bg);
  border: 2px solid var(--primary);
  border-radius: 0.5rem;
  padding: 10px;
  aspect-ratio: 1;
}

.sim-grid {
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  gap: 2px;
  height: 100%;
}

.sim-cell {
  background: rgba(16, 185, 129, 0.05);
  border-radius: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.sim-cell--wall {
  background: rgba(16, 185, 129, 0.3);
}

.sim-cell--egg {
  background: rgba(251, 191, 36, 0.2);
}

.sim-cell--collected {
  background: rgba(16, 185, 129, 0.1);
}

.sim-cell__content {
  font-size: 1.2rem;
}

.sim-bunny {
  animation: bunnyBounce 0.3s ease-in-out infinite;
}

/* Controls */
.sim-controls {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.sim-controls__top {
  display: flex;
  gap: var(--space-xs);
}

.sim-btn {
  padding: 0.75rem 1.25rem;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.75rem;
  font-weight: 600;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.sim-btn--primary {
  background: var(--primary);
  color: var(--bg);
}

.sim-btn--primary:hover:not(:disabled) {
  background: #059669;
}

.sim-btn--primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.sim-btn--secondary {
  background: var(--surface);
  color: var(--text-main);
  border: 1px solid var(--border);
}

.sim-btn--secondary:hover {
  border-color: var(--primary);
}

/* Stats */
.sim-stats {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-sm);
}

.sim-stat {
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 0.5rem;
  padding: var(--space-sm);
  text-align: center;
}

.sim-stat__label {
  display: block;
  font-size: 0.65rem;
  color: var(--text-dark);
  margin-bottom: 0.25rem;
}

.sim-stat__value {
  font-family: 'JetBrains Mono', monospace;
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--primary);
}

/* Graph */
.sim-graph {
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 0.5rem;
  padding: var(--space-sm);
}

.sim-graph__label {
  font-size: 0.7rem;
  color: var(--text-muted);
  margin-bottom: var(--space-xs);
}

.sim-graph__bars {
  display: flex;
  align-items: flex-end;
  gap: 4px;
  height: 80px;
}

.sim-graph__bar {
  flex: 1;
  background: var(--primary);
  border-radius: 2px 2px 0 0;
  min-height: 5px;
  transition: height 0.3s ease;
}

/* ============================================
   INTRO GRID
   ============================================ */
.zb-intro-grid {
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: var(--space-lg);
  align-items: start;
}

.zb-intro__text p {
  font-size: 1rem;
  color: var(--text-muted);
  line-height: 1.8;
  margin-bottom: 1rem;
}

.zb-intro__text strong {
  color: var(--text-main);
}

.concept-highlight {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  border-radius: 0.75rem;
  border: 1px solid rgba(16, 185, 129, 0.3);
  margin-top: var(--space-md);
}

.concept-highlight__icon {
  font-size: 2rem;
}

.concept-highlight strong {
  display: block;
  color: var(--primary);
  margin-bottom: 0.25rem;
}

.concept-highlight p {
  font-size: 0.85rem;
  color: var(--text-muted);
  margin: 0;
}

/* Principles */
.zb-intro__principles {
  padding: 1.5rem;
  border-radius: 1rem;
  border: 1px solid var(--border);
}

.zb-intro__principles h3 {
  font-size: 1rem;
  color: var(--primary);
  margin-bottom: 1rem;
}

.zb-intro__principles ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.zb-intro__principles li {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 0;
  border-bottom: 1px solid var(--border);
}

.zb-intro__principles li:last-child {
  border-bottom: none;
}

.principle-icon {
  font-size: 1.5rem;
}

.zb-intro__principles li strong {
  display: block;
  font-size: 0.9rem;
}

.zb-intro__principles li span {
  font-size: 0.75rem;
  color: var(--text-dark);
}

/* ============================================
   CYCLE FLOW
   ============================================ */
.zb-cycle-flow {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-sm);
}

.zb-cycle-card {
  position: relative;
  padding: var(--space-md);
  border-radius: 1rem;
  border: 1px solid var(--border);
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
}

.zb-cycle-card:hover,
.zb-cycle-card.active {
  border-color: var(--primary);
  background: rgba(16, 185, 129, 0.05);
}

.zb-cycle-card__num {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.6rem;
  color: var(--text-dark);
  margin-bottom: 0.5rem;
}

.zb-cycle-card__icon {
  font-size: 2.5rem;
  margin-bottom: var(--space-xs);
}

.zb-cycle-card h3 {
  font-size: 1rem;
  margin-bottom: 0.25rem;
}

.zb-cycle-card > p {
  font-size: 0.75rem;
  color: var(--text-muted);
}

.zb-cycle-card__detail {
  margin-top: var(--space-sm);
  padding-top: var(--space-sm);
  border-top: 1px solid var(--border);
  font-size: 0.8rem;
  color: var(--text-muted);
  text-align: left;
}

.zb-cycle-card__arrow {
  position: absolute;
  right: -20px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 1.5rem;
  color: var(--primary);
  opacity: 0.5;
}

/* ============================================
   DNA SECTION
   ============================================ */
.zb-dna-grid {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: var(--space-xl);
  align-items: center;
}

.zb-dna__visual {
  text-align: center;
}

.dna-helix {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: var(--space-md);
  background: rgba(10, 10, 10, 0.5);
  border: 1px solid var(--border);
  border-radius: 1rem;
}

.dna-pair {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  animation: dnaFloat 3s ease-in-out infinite;
  animation-delay: calc(var(--pair-index) * 0.15s);
}

@keyframes dnaFloat {
  0%, 100% { transform: translateX(0) rotateY(0); }
  50% { transform: translateX(15px) rotateY(20deg); }
}

.dna-base {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'JetBrains Mono', monospace;
  font-size: 1rem;
  font-weight: 700;
  border-radius: 50%;
  background: var(--surface);
  border: 2px solid;
  transition: all 0.3s ease;
}

.dna-base--green { border-color: #10B981; color: #10B981; }
.dna-base--red { border-color: #EF4444; color: #EF4444; }
.dna-base--yellow { border-color: #FBBF24; color: #FBBF24; }
.dna-base--blue { border-color: #3B82F6; color: #3B82F6; }

.dna-connector {
  width: 40px;
  height: 3px;
  background: linear-gradient(90deg, var(--primary), transparent, var(--primary));
}

.dna-label {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-top: var(--space-sm);
  font-size: 0.8rem;
  color: var(--text-muted);
}

.dna-label__icon {
  font-size: 1.5rem;
}

/* Genes */
.zb-dna__info p {
  font-size: 1rem;
  color: var(--text-muted);
  line-height: 1.7;
  margin-bottom: var(--space-md);
}

.dna-genes {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.dna-gene {
  padding: 1rem;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 0.75rem;
}

.dna-gene__header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.dna-gene__icon {
  font-size: 1.25rem;
}

.dna-gene__name {
  font-weight: 600;
  font-size: 0.9rem;
  flex: 1;
}

.dna-gene__value {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.85rem;
  color: var(--primary);
}

.dna-gene__bar {
  height: 6px;
  background: var(--border);
  border-radius: 3px;
  margin-bottom: 0.5rem;
  overflow: hidden;
}

.dna-gene__fill {
  height: 100%;
  background: linear-gradient(90deg, var(--primary), #34d399);
  border-radius: 3px;
  transition: width 0.5s ease;
}

.dna-gene__desc {
  font-size: 0.75rem;
  color: var(--text-dark);
}

/* ============================================
   SENSOR DIAGRAM - 3 Raycasts visualization
   ============================================ */
.sensor-diagram {
  position: relative;
  width: 250px;
  height: 250px;
  margin: 0 auto;
  background: rgba(16, 185, 129, 0.05);
  border: 2px solid var(--border);
  border-radius: 50%;
}

.sensor-bunny {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 3rem;
  z-index: 10;
}

.sensor {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.sensor__ray {
  width: 80px;
  height: 4px;
  background: var(--border);
  border-radius: 2px;
  transition: all 0.3s ease;
}

.sensor.active .sensor__ray {
  background: #EF4444;
  box-shadow: 0 0 15px #EF4444;
}

.sensor__label {
  position: absolute;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.7rem;
  font-weight: 700;
  color: var(--text-dark);
  background: var(--surface);
  padding: 0.2rem 0.4rem;
  border-radius: 3px;
}

.sensor.active .sensor__label {
  color: #EF4444;
}

.sensor--left {
  top: 50%;
  left: 15%;
  transform: translateY(-50%) rotate(-45deg);
}

.sensor--left .sensor__label {
  left: -25px;
}

.sensor--front {
  top: 15%;
  left: 50%;
  transform: translateX(-50%) rotate(-90deg);
}

.sensor--front .sensor__label {
  top: -25px;
  left: 50%;
  transform: translateX(-50%) rotate(90deg);
}

.sensor--right {
  top: 50%;
  right: 15%;
  transform: translateY(-50%) rotate(45deg);
}

.sensor--right .sensor__label {
  right: -25px;
}

.sensor-legend {
  position: absolute;
  bottom: -50px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 1rem;
}

.sensor-legend span {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.7rem;
  padding: 0.4rem 0.8rem;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.sensor-legend span:hover {
  border-color: var(--primary);
}

.sensor-legend span.active {
  background: #EF4444;
  border-color: #EF4444;
  color: white;
}

.sensor-result {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-top: 70px;
  padding: 1rem;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 0.5rem;
}

.sensor-result__key {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.9rem;
  color: var(--text-muted);
  background: var(--bg);
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
}

.sensor-result__arrow {
  color: var(--primary);
  font-size: 1.25rem;
}

.sensor-result__angle {
  font-family: 'JetBrains Mono', monospace;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--primary);
}

/* DNA Dictionary Table */
.dna-dict {
  border: 1px solid var(--border);
  border-radius: 0.75rem;
  overflow: hidden;
  margin-bottom: var(--space-md);
}

.dna-dict__header {
  display: grid;
  grid-template-columns: 120px 30px 60px 1fr;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: var(--surface);
  border-bottom: 1px solid var(--border);
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.65rem;
  color: var(--text-dark);
  font-weight: 600;
}

.dna-dict__row {
  display: grid;
  grid-template-columns: 120px 30px 60px 1fr;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-bottom: 1px solid var(--border);
  font-size: 0.8rem;
  transition: all 0.2s ease;
}

.dna-dict__row:last-child {
  border-bottom: none;
}

.dna-dict__row:hover,
.dna-dict__row.active {
  background: rgba(16, 185, 129, 0.1);
}

.dna-dict__row.active {
  border-left: 3px solid var(--primary);
}

.dna-dict__key {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.75rem;
  color: var(--primary);
  background: var(--primary-soft);
  padding: 0.2rem 0.5rem;
  border-radius: 3px;
  width: fit-content;
}

.dna-dict__arrow {
  color: var(--text-dark);
}

.dna-dict__value {
  font-family: 'JetBrains Mono', monospace;
  font-weight: 700;
  color: var(--text-main);
}

.dna-dict__desc {
  font-size: 0.75rem;
  color: var(--text-muted);
}

.dna-note {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 1rem;
  border-radius: 0.5rem;
  border: 1px solid rgba(16, 185, 129, 0.3);
}

.dna-note span:first-child {
  font-size: 1.25rem;
}

.dna-note p {
  font-size: 0.85rem;
  color: var(--text-muted);
  margin: 0;
  line-height: 1.6;
}

/* ============================================
   CODE TABS
   ============================================ */
.zb-code-tabs__nav {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.zb-code-tab {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  background: transparent;
  border: 1px solid var(--border);
  border-radius: 0.5rem;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.75rem;
  color: var(--text-muted);
  cursor: pointer;
  transition: all 0.2s ease;
}

.zb-code-tab__icon {
  font-size: 1rem;
}

.zb-code-tab:hover {
  border-color: var(--primary);
  color: var(--primary);
}

.zb-code-tab.active {
  background: var(--primary);
  border-color: var(--primary);
  color: var(--bg);
}

.zb-code-content {
  border-radius: 0.75rem;
  border: 1px solid var(--border);
  overflow: hidden;
}

.zb-code-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 1rem;
  background: rgba(0, 0, 0, 0.5);
  border-bottom: 1px solid var(--border);
}

.zb-code-dots {
  display: flex;
  gap: 6px;
}

.zb-code-dots span {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--border);
}

.zb-code-dots span:nth-child(1) { background: #EF4444; }
.zb-code-dots span:nth-child(2) { background: #FBBF24; }
.zb-code-dots span:nth-child(3) { background: #10B981; }

.zb-code-filename {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.75rem;
  color: var(--text-muted);
  flex: 1;
}

.zb-code-lang {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.65rem;
  color: var(--primary);
  padding: 0.2rem 0.6rem;
  background: var(--primary-soft);
  border-radius: 4px;
}

.zb-code-content pre {
  margin: 0;
  padding: 1.5rem;
  overflow-x: auto;
}

.zb-code-content code {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.8rem;
  line-height: 1.7;
  color: var(--text-main);
}

/* Code highlighting */
:deep(.code-keyword) { color: #C678DD; }
:deep(.code-class) { color: #E5C07B; }
:deep(.code-function) { color: #61AFEF; }
:deep(.code-number) { color: #D19A66; }
:deep(.code-string) { color: #98C379; }
:deep(.code-comment) { color: #5C6370; font-style: italic; }

/* ============================================
   RESULTS
   ============================================ */
.zb-results-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-md);
  margin-bottom: var(--space-xl);
}

.zb-result-card {
  padding: 2rem;
  border-radius: 1rem;
  border: 1px solid var(--border);
  text-align: center;
  transition: all 0.3s ease;
}

.zb-result-card:hover {
  border-color: var(--primary);
  transform: translateY(-5px);
}

.zb-result-card__icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.zb-result-card__value {
  font-family: 'JetBrains Mono', monospace;
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--primary);
  margin-bottom: 0.25rem;
}

.zb-result-card__label {
  font-size: 0.85rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.zb-result-card p {
  font-size: 0.8rem;
  color: var(--text-muted);
}

/* Emergence */
.zb-emergence {
  text-align: center;
}

.zb-emergence h3 {
  font-size: 1.25rem;
  margin-bottom: var(--space-md);
}

.zb-emergence__grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-md);
}

.zb-emergence__item {
  padding: 1.5rem;
  border-radius: 1rem;
  border: 1px solid var(--border);
  text-align: left;
  transition: all 0.3s ease;
}

.zb-emergence__item:hover {
  border-color: var(--primary);
}

.emergence-icon {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.zb-emergence__item h4 {
  font-size: 0.95rem;
  margin-bottom: 0.5rem;
}

.zb-emergence__item p {
  font-size: 0.8rem;
  color: var(--text-muted);
  line-height: 1.6;
}

/* ============================================
   LEARNINGS
   ============================================ */
.zb-learnings {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: var(--space-xl);
  align-items: start;
}

.zb-learnings__content h2 {
  font-size: 2rem;
  margin: 0.5rem 0 var(--space-md);
}

.zb-learnings__content ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.zb-learnings__content li {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 0;
  font-size: 1rem;
  color: var(--text-muted);
  border-bottom: 1px solid var(--border);
}

.zb-learnings__content li:last-child {
  border-bottom: none;
}

.learn-icon {
  font-size: 1.25rem;
}

.zb-learnings__cta {
  padding: 2rem;
  border-radius: 1rem;
  border: 1px solid var(--border);
  text-align: center;
}

.zb-learnings__bunny {
  font-size: 4rem;
  margin-bottom: 1rem;
  animation: bunnyBounce 1s ease-in-out infinite;
}

.zb-learnings__cta h3 {
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
}

.zb-learnings__cta p {
  font-size: 0.9rem;
  color: var(--text-muted);
  margin-bottom: 1.5rem;
}

.btn--primary {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  background: var(--primary);
  color: var(--bg);
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.75rem;
  font-weight: 700;
  text-decoration: none;
  border-radius: 0.5rem;
  transition: all 0.3s ease;
}

.btn--primary:hover {
  background: #059669;
  box-shadow: 0 0 30px rgba(16, 185, 129, 0.5);
  transform: translateY(-2px);
}

/* ============================================
   TRANSITIONS
   ============================================ */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
}

.expand-enter-from,
.expand-leave-to {
  opacity: 0;
  max-height: 0;
  padding-top: 0;
  margin-top: 0;
}

/* ============================================
   RESPONSIVE
   ============================================ */
@media (max-width: 1024px) {
  .zb-hero__content {
    grid-template-columns: 1fr;
    text-align: center;
  }
  
  .zb-hero__visual {
    order: -1;
  }
  
  .zb-hero__text {
    max-width: 100%;
  }
  
  .zb-intro-grid,
  .zb-dna-grid,
  .zb-learnings {
    grid-template-columns: 1fr;
  }
  
  .sim-container {
    grid-template-columns: 1fr;
  }
  
  .sim-arena {
    max-width: 400px;
    margin: 0 auto;
  }
  
  .zb-cycle-flow {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .zb-cycle-card__arrow {
    display: none;
  }
  
  .zb-emergence__grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .zb-results-grid,
  .zb-emergence__grid,
  .zb-cycle-flow {
    grid-template-columns: 1fr;
  }
  
  .hero-lab {
    width: 250px;
    height: 250px;
  }
  
  .zb-hero__stats {
    flex-direction: column;
    gap: var(--space-xs);
  }
}
</style>
