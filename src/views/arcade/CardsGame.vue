<template>
  <div class="cards-page">
    <!-- HEADER -->
    <header class="cards-header">
      <div class="container cards-header__inner">
        <router-link to="/arcade" class="cards-back">
          ← ARCADE
        </router-link>
        <div class="cards-header__title">
          <span class="cards-header__icon">🃏</span>
          <h1>GL CARDS</h1>
        </div>
        <div class="cards-header__info">
          {{ projects.length }} CARTES
        </div>
      </div>
    </header>
    
    <!-- INSTRUCTIONS -->
    <section class="cards-intro">
      <div class="container">
        <p>Survole les cartes pour voir l'effet holographique. Clique pour retourner et découvrir les détails.</p>
      </div>
    </section>
    
    <!-- CARDS GRID -->
    <section class="cards-grid-section">
      <div class="container">
        <div class="cards-grid" role="list" aria-label="Collection de cartes de projets">
          <button 
            v-for="(project, index) in projects" 
            :key="project.id"
            class="holo-card"
            :class="{ 'flipped': flippedCards.includes(project.id) }"
            :style="{ '--card-index': index, '--card-color': project.color }"
            @click="toggleFlip(project.id)"
            @mousemove="handleMouseMove($event, index)"
            @mouseleave="handleMouseLeave(index)"
            @keydown.enter="toggleFlip(project.id)"
            @keydown.space.prevent="toggleFlip(project.id)"
            :aria-expanded="flippedCards.includes(project.id)"
            :aria-label="`Carte ${project.name}, ${project.rarity}. Cliquez pour ${flippedCards.includes(project.id) ? 'masquer' : 'voir'} les détails.`"
            role="listitem"
            ref="cardRefs"
          >
            <!-- FRONT -->
            <div class="holo-card__front">
              <div class="holo-card__shine" :style="cardStyles[index]"></div>
              <div class="holo-card__glare" :style="cardStyles[index]"></div>
              
              <div class="holo-card__header">
                <span class="holo-card__rarity">{{ project.rarity }}</span>
                <span class="holo-card__id">#{{ String(index + 1).padStart(3, '0') }}</span>
              </div>
              
              <div class="holo-card__icon">{{ project.icon }}</div>
              
              <div class="holo-card__name">{{ project.name }}</div>
              
              <div class="holo-card__type">{{ project.type }}</div>
              
              <div class="holo-card__stats">
                <div class="holo-card__stat">
                  <span class="stat-label">IMPACT</span>
                  <div class="stat-bar">
                    <div class="stat-fill" :style="{ width: project.impact + '%' }"></div>
                  </div>
                </div>
                <div class="holo-card__stat">
                  <span class="stat-label">COMPLEXITÉ</span>
                  <div class="stat-bar">
                    <div class="stat-fill" :style="{ width: project.complexity + '%' }"></div>
                  </div>
                </div>
                <div class="holo-card__stat">
                  <span class="stat-label">FUN</span>
                  <div class="stat-bar">
                    <div class="stat-fill" :style="{ width: project.fun + '%' }"></div>
                  </div>
                </div>
              </div>
              
              <div class="holo-card__footer">
                <span class="holo-card__year">{{ project.year }}</span>
                <span class="holo-card__set">GL DIGITAL LAB</span>
              </div>
            </div>
            
            <!-- BACK -->
            <div class="holo-card__back">
              <div class="holo-card__back-content">
                <h3>{{ project.name }}</h3>
                <p class="holo-card__desc">{{ project.desc }}</p>
                
                <div class="holo-card__stack">
                  <span v-for="tech in project.stack" :key="tech" class="stack-tag">
                    {{ tech }}
                  </span>
                </div>
                
                <a 
                  v-if="project.link" 
                  :href="project.link" 
                  target="_blank" 
                  class="holo-card__link"
                  @click.stop
                >
                  VOIR LE PROJET →
                </a>
              </div>
              
              <div class="holo-card__back-logo">
                <span>GL</span>
              </div>
            </div>
          </button>
        </div>
      </div>
    </section>
    
    <!-- LEGEND -->
    <section class="cards-legend">
      <div class="container">
        <div class="legend-box glass">
          <h3>Raretés</h3>
          <div class="legend-items">
            <div class="legend-item">
              <span class="legend-rarity legend-rarity--common">●</span>
              <span>COMMON</span>
            </div>
            <div class="legend-item">
              <span class="legend-rarity legend-rarity--rare">●</span>
              <span>RARE</span>
            </div>
            <div class="legend-item">
              <span class="legend-rarity legend-rarity--epic">●</span>
              <span>EPIC</span>
            </div>
            <div class="legend-item">
              <span class="legend-rarity legend-rarity--legendary">●</span>
              <span>LEGENDARY</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';

const flippedCards = ref([]);
const cardStyles = reactive({});

const projects = ref([
  {
    id: 'arkadia',
    name: 'ARKADIA FRANCE',
    icon: '🦖',
    type: 'GAMING',
    rarity: 'LEGENDARY',
    color: '#A855F7',
    year: '2023-2026',
    impact: 95,
    complexity: 85,
    fun: 100,
    desc: 'Cluster ARK Survival avec 150+ joueurs, Discord actif, et infrastructure DevOps complète.',
    stack: ['Node.js', 'Discord.js', 'n8n', 'Docker'],
    link: '/arkadia'
  },
  {
    id: 'gldigitallab',
    name: 'GL DIGITAL LAB',
    icon: '💎',
    type: 'VUE.JS',
    rarity: 'LEGENDARY',
    color: '#10B981',
    year: '2026',
    impact: 100,
    complexity: 80,
    fun: 90,
    desc: 'Portfolio professionnel avec Vue 3, Three.js et design Matrix immersif.',
    stack: ['Vue 3', 'Three.js', 'Vite', 'GSAP'],
    link: '/'
  },
  {
    id: 'myloc',
    name: 'MYLOC',
    icon: '🏠',
    type: 'SYMFONY',
    rarity: 'EPIC',
    color: '#6366F1',
    year: '2022',
    impact: 75,
    complexity: 70,
    fun: 65,
    desc: 'Application de gestion de locations immobilières complète.',
    stack: ['Symfony 5', 'PHP', 'Twig', 'MySQL'],
    link: 'https://github.com/GaetanLgt/myLoc'
  },
  {
    id: 'zombunny',
    name: 'ZOMBUNNY',
    icon: '🧬',
    type: 'GAMING',
    rarity: 'EPIC',
    color: '#8B5CF6',
    year: '2020',
    impact: 70,
    complexity: 90,
    fun: 85,
    desc: 'Étude des algorithmes génétiques avec Unity et C#.',
    stack: ['Unity', 'C#', 'IA Évolutionnaire'],
    link: '/zombunny'
  },
  {
    id: 'mytv',
    name: 'MYTV DATABASE',
    icon: '📺',
    type: 'VUE.JS',
    rarity: 'RARE',
    color: '#06B6D4',
    year: '2021',
    impact: 55,
    complexity: 45,
    fun: 70,
    desc: 'Explorateur de séries TV avec l\'API TVMaze.',
    stack: ['Vue.js', 'API REST', 'Firebase'],
    link: '/tv'
  },
  {
    id: 'pokemon',
    name: 'POKÉMON MEMORY',
    icon: '🎴',
    type: 'SYMFONY',
    rarity: 'EPIC',
    color: '#FBBF24',
    year: '2023',
    impact: 65,
    complexity: 60,
    fun: 95,
    desc: 'Jeu Memory thème Pokémon avec Symfony et API PokeAPI.',
    stack: ['Symfony', 'PHP', 'JavaScript', 'Docker'],
    link: 'https://github.com/JulienHltz/Pokemon_MemoryGame'
  },
  {
    id: 'mevn',
    name: 'MEVN STACK',
    icon: '🔥',
    type: 'FULL-STACK',
    rarity: 'RARE',
    color: '#10B981',
    year: '2021',
    impact: 50,
    complexity: 65,
    fun: 55,
    desc: 'Boilerplate full-stack MongoDB, Express, Vue, Node.',
    stack: ['Vue.js', 'Node.js', 'MongoDB', 'Express'],
    link: 'https://github.com/GaetanLgt/mevnStack'
  },
  {
    id: 'ouvreboites',
    name: 'OUVRE-BOÎTES',
    icon: '🥫',
    type: 'WORDPRESS',
    rarity: 'COMMON',
    color: '#3B82F6',
    year: '2020',
    impact: 60,
    complexity: 40,
    fun: 50,
    desc: 'Site associatif avec WordPress/Timber réalisé en stage.',
    stack: ['WordPress', 'Timber', 'Twig', 'ACF'],
    link: 'https://github.com/GaetanLgt/ouvreBoites'
  },
  {
    id: 'chalets',
    name: 'CHALETS & CAVIAR',
    icon: '🏔️',
    type: 'WORDPRESS',
    rarity: 'COMMON',
    color: '#60A5FA',
    year: '2020',
    impact: 45,
    complexity: 35,
    fun: 45,
    desc: 'Site de location de chalets haut de gamme (OpenClassrooms).',
    stack: ['WordPress', 'PHP', 'CSS', 'Elementor'],
    link: null
  },
  {
    id: 'symfonycms',
    name: 'SYMFONY CMS',
    icon: '📰',
    type: 'SYMFONY',
    rarity: 'RARE',
    color: '#6366F1',
    year: '2021',
    impact: 55,
    complexity: 55,
    fun: 50,
    desc: 'CMS minimaliste développé from scratch avec Symfony.',
    stack: ['Symfony', 'PHP', 'Doctrine', 'MySQL'],
    link: 'https://github.com/GaetanLgt/SymfonyCMS'
  }
]);

function toggleFlip(id) {
  if (flippedCards.value.includes(id)) {
    flippedCards.value = flippedCards.value.filter(cardId => cardId !== id);
  } else {
    flippedCards.value.push(id);
  }
}

function handleMouseMove(e, index) {
  const card = e.currentTarget;
  const rect = card.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  const centerX = rect.width / 2;
  const centerY = rect.height / 2;
  
  const rotateX = (y - centerY) / 10;
  const rotateY = (centerX - x) / 10;
  
  const gradientX = (x / rect.width) * 100;
  const gradientY = (y / rect.height) * 100;
  
  cardStyles[index] = {
    '--rotate-x': `${rotateX}deg`,
    '--rotate-y': `${rotateY}deg`,
    '--gradient-x': `${gradientX}%`,
    '--gradient-y': `${gradientY}%`
  };
  
  card.style.transform = `perspective(1000px) rotateX(${-rotateX}deg) rotateY(${-rotateY}deg)`;
}

function handleMouseLeave(index) {
  const cards = document.querySelectorAll('.holo-card');
  if (cards[index]) {
    cards[index].style.transform = '';
  }
  cardStyles[index] = {};
}
</script>

<style scoped>
.cards-page {
  min-height: 100vh;
  background: #050505;
  padding-top: 80px;
}

/* HEADER */
.cards-header {
  padding: 1rem 0;
  background: #0a0a0a;
  border-bottom: 1px solid var(--border);
  position: relative;
  z-index: 10;
}

.cards-header__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.cards-back {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.75rem;
  color: var(--text-muted);
  text-decoration: none;
  transition: color 0.2s;
}

.cards-back:hover {
  color: var(--primary);
}

.cards-header__title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.cards-header__icon {
  font-size: 1.5rem;
}

.cards-header__title h1 {
  font-size: 1.25rem;
  font-weight: 700;
  letter-spacing: 0.1em;
}

.cards-header__info {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.75rem;
  color: var(--primary);
}

/* INTRO */
.cards-intro {
  padding: var(--space-md) 0;
  text-align: center;
}

.cards-intro p {
  font-size: 0.9rem;
  color: var(--text-muted);
}

/* CARDS GRID */
.cards-grid-section {
  padding: var(--space-lg) 0;
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 2rem;
  justify-items: center;
}

/* HOLO CARD */
button.holo-card {
  /* Reset button styles */
  border: none;
  background: transparent;
  padding: 0;
  font: inherit;
  text-align: left;
}

.holo-card {
  width: 260px;
  height: 380px;
  cursor: pointer;
  perspective: 1000px;
  transform-style: preserve-3d;
  transition: transform 0.1s ease-out;
}

.holo-card.flipped {
  transform: rotateY(180deg) !important;
}

.holo-card__front,
.holo-card__back {
  position: absolute;
  inset: 0;
  border-radius: 1rem;
  backface-visibility: hidden;
  overflow: hidden;
}

/* FRONT */
.holo-card__front {
  background: linear-gradient(145deg, #1a1a1a 0%, #0a0a0a 100%);
  border: 2px solid var(--card-color, var(--primary));
  display: flex;
  flex-direction: column;
  padding: 1rem;
  position: relative;
}

.holo-card__front::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    125deg,
    transparent 0%,
    rgba(255, 255, 255, 0.03) 25%,
    transparent 50%,
    rgba(255, 255, 255, 0.03) 75%,
    transparent 100%
  );
  pointer-events: none;
}

/* Holographic shine effect */
.holo-card__shine {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    var(--gradient-y, 50%) var(--gradient-x, 50%),
    transparent 0%,
    rgba(255, 255, 255, 0.1) 45%,
    rgba(255, 255, 255, 0.3) 50%,
    rgba(255, 255, 255, 0.1) 55%,
    transparent 100%
  );
  opacity: 0;
  transition: opacity 0.3s;
  pointer-events: none;
  mix-blend-mode: overlay;
}

.holo-card:hover .holo-card__shine {
  opacity: 1;
}

/* Rainbow glare */
.holo-card__glare {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    calc(var(--gradient-x, 50%) * 3.6deg),
    #ff0000 0%,
    #ff8000 14%,
    #ffff00 28%,
    #00ff00 42%,
    #00ffff 56%,
    #0080ff 70%,
    #8000ff 84%,
    #ff0080 100%
  );
  opacity: 0;
  transition: opacity 0.3s;
  pointer-events: none;
  mix-blend-mode: color-dodge;
}

.holo-card:hover .holo-card__glare {
  opacity: 0.15;
}

.holo-card__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.holo-card__rarity {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.55rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  padding: 0.25rem 0.5rem;
  border-radius: 3px;
  background: rgba(255, 255, 255, 0.1);
}

.holo-card__rarity:contains('LEGENDARY') {
  color: #FBBF24;
}

.holo-card__id {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.65rem;
  color: var(--text-dark);
}

.holo-card__icon {
  font-size: 4rem;
  text-align: center;
  margin: 1rem 0;
  filter: drop-shadow(0 0 20px rgba(255, 255, 255, 0.3));
}

.holo-card__name {
  font-size: 1.1rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 0.25rem;
  letter-spacing: 0.05em;
}

.holo-card__type {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.6rem;
  text-align: center;
  color: var(--card-color, var(--primary));
  letter-spacing: 0.1em;
  margin-bottom: 1rem;
}

.holo-card__stats {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 0.5rem;
}

.holo-card__stat {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.stat-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.5rem;
  color: var(--text-dark);
  width: 70px;
  letter-spacing: 0.05em;
}

.stat-bar {
  flex: 1;
  height: 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
  overflow: hidden;
}

.stat-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--card-color, var(--primary)), var(--primary));
  border-radius: 3px;
  transition: width 0.3s ease;
}

.holo-card__footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 0.75rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  margin-top: 0.75rem;
}

.holo-card__year {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.6rem;
  color: var(--text-dark);
}

.holo-card__set {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.5rem;
  color: var(--text-dark);
  letter-spacing: 0.1em;
}

/* BACK */
.holo-card__back {
  background: linear-gradient(145deg, #1a1a2e 0%, #0f0f1a 100%);
  border: 2px solid var(--primary);
  transform: rotateY(180deg);
  display: flex;
  flex-direction: column;
  padding: 1.5rem;
}

.holo-card__back-content {
  flex: 1;
}

.holo-card__back h3 {
  font-size: 1.1rem;
  margin-bottom: 0.75rem;
  color: var(--primary);
}

.holo-card__desc {
  font-size: 0.8rem;
  color: var(--text-muted);
  line-height: 1.6;
  margin-bottom: 1rem;
}

.holo-card__stack {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
  margin-bottom: 1rem;
}

.stack-tag {
  padding: 0.25rem 0.5rem;
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.3);
  border-radius: 3px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.55rem;
  color: var(--primary);
}

.holo-card__link {
  display: inline-block;
  padding: 0.6rem 1rem;
  background: var(--primary);
  color: var(--bg);
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.65rem;
  font-weight: 700;
  text-decoration: none;
  border-radius: 0.5rem;
  transition: all 0.2s;
}

.holo-card__link:hover {
  background: #059669;
}

.holo-card__back-logo {
  text-align: center;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.holo-card__back-logo span {
  font-family: 'JetBrains Mono', monospace;
  font-size: 1.5rem;
  font-weight: 900;
  color: rgba(16, 185, 129, 0.3);
}

/* LEGEND */
.cards-legend {
  padding: var(--space-lg) 0 var(--space-xl);
}

.legend-box {
  padding: 1.5rem 2rem;
  border-radius: 1rem;
  border: 1px solid var(--border);
}

.legend-box h3 {
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

.legend-items {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.7rem;
  color: var(--text-muted);
}

.legend-rarity {
  font-size: 1rem;
}

.legend-rarity--common { color: #9CA3AF; }
.legend-rarity--rare { color: #3B82F6; }
.legend-rarity--epic { color: #8B5CF6; }
.legend-rarity--legendary { color: #FBBF24; text-shadow: 0 0 10px #FBBF24; }

/* RESPONSIVE */
@media (max-width: 768px) {
  .cards-grid {
    grid-template-columns: 1fr;
  }
  
  .cards-header__inner {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .legend-items {
    gap: 1rem;
  }
}
</style>
