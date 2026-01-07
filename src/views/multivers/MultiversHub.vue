<template>
  <div class="multivers-hub">
    <!-- Background animé -->
    <div class="hub-bg" aria-hidden="true">
      <div class="star-field"></div>
      <div class="portal-glow"></div>
      <div class="grid-overlay"></div>
    </div>

    <!-- Skip link -->
    <a href="#main-content" class="skip-link">Aller au contenu principal</a>

    <!-- Hero Section -->
    <section class="hub-hero" aria-labelledby="hero-title">
      <div class="container">
        <div class="portal-icon" aria-hidden="true">
          <div class="portal-ring portal-ring--1"></div>
          <div class="portal-ring portal-ring--2"></div>
          <div class="portal-ring portal-ring--3"></div>
          <div class="portal-core">🌌</div>
        </div>

        <h1 id="hero-title" class="hero-title">
          <span class="title-pre"><TextScramble text="BIENVENUE DANS LE" :scramble-on-mount="true" /></span>
          <span class="title-main"><GlitchText text="MULTIVERS" :always-active="false" /></span>
          <span class="title-sub">{{ universes.length }} Dimensions Parallèles</span>
        </h1>

        <p class="hero-intro">
          Chaque univers est une <strong>réinterprétation créative</strong> de ce portfolio.
          Même contenu, expériences visuelles radicalement différentes.
          <em>Choisissez votre réalité.</em>
        </p>

        <!-- Stats -->
        <div class="hub-stats">
          <div class="stat">
            <span class="stat-value">{{ universes.length }}</span>
            <span class="stat-label">Univers</span>
          </div>
          <div class="stat">
            <span class="stat-value">{{ categories.length }}</span>
            <span class="stat-label">Catégories</span>
          </div>
          <div class="stat">
            <span class="stat-value">∞</span>
            <span class="stat-label">Possibilités</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Filter Bar -->
    <section class="filter-section" aria-label="Filtres par catégorie">
      <div class="container">
        <div class="filter-bar">
          <button 
            class="filter-btn"
            :class="{ active: activeFilter === 'all' }"
            @click="activeFilter = 'all'"
          >
            Tous ({{ universes.length }})
          </button>
          <button 
            v-for="cat in categories" 
            :key="cat.id"
            class="filter-btn"
            :class="{ active: activeFilter === cat.id }"
            @click="activeFilter = cat.id"
            :style="{ '--cat-color': cat.color }"
          >
            {{ cat.icon }} {{ cat.name }} ({{ getCountByCategory(cat.id) }})
          </button>
        </div>
      </div>
    </section>

    <!-- Universe Grid -->
    <section id="main-content" class="universes-section" aria-labelledby="universes-title">
      <div class="container">
        <h2 id="universes-title" class="sr-only">Liste des univers</h2>

        <TransitionGroup name="universe-grid" tag="div" class="universes-grid">
          <TiltCard
            v-for="universe in filteredUniverses"
            :key="universe.id"
            :max-tilt="12"
            :scale="1.03"
            :glare="true"
            :max-glare="0.25"
            class="universe-card-wrapper"
          >
            <router-link
              :to="universe.path"
              class="universe-card"
              :style="{ 
                '--universe-color': universe.color,
                '--universe-bg': universe.bgGradient 
              }"
            >
              <div class="card-glow" aria-hidden="true"></div>
              <div class="card-content">
                <div class="card-header">
                  <span class="card-icon">{{ universe.icon }}</span>
                  <span class="card-category" :style="{ color: getCategoryColor(universe.category) }">
                    {{ getCategoryName(universe.category) }}
                  </span>
                </div>
                <h3 class="card-title">{{ universe.name }}</h3>
                <p class="card-tagline">{{ universe.tagline }}</p>
                <div class="card-meta">
                  <span class="meta-year">{{ universe.year }}</span>
                  <span class="meta-arrow">→</span>
                </div>
              </div>
              <div class="card-overlay" aria-hidden="true">
                <span class="overlay-text">ENTRER</span>
              </div>
            </router-link>
          </TiltCard>
        </TransitionGroup>

        <!-- Empty State -->
        <div v-if="filteredUniverses.length === 0" class="empty-state">
          <span class="empty-icon">🌑</span>
          <p>Aucun univers dans cette dimension... pour l'instant.</p>
        </div>
      </div>
    </section>

    <!-- Gallery Matrix Banner -->
    <section class="gallery-banner" aria-labelledby="gallery-title">
      <div class="container">
        <div class="gallery-content">
          <div class="gallery-icon" aria-hidden="true">🎨</div>
          <div class="gallery-text">
            <h2 id="gallery-title">Galerie Créations</h2>
            <p>Explorez 62 œuvres numériques avec des effets Canvas 2D immersifs style Matrix/TRON.</p>
          </div>
          <router-link to="/creations" class="gallery-btn">
            <span>Explorer la galerie</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </router-link>
        </div>
      </div>
    </section>

    <!-- ARKADIA Banner -->
    <section class="arkadia-banner" aria-labelledby="arkadia-title">
      <div class="container">
        <div class="arkadia-content">
          <div class="arkadia-icon" aria-hidden="true">🦖</div>
          <div class="arkadia-text">
            <h2 id="arkadia-title">ARKADIA FRANCE</h2>
            <p>Communauté ARK: Survival Ascended • 150+ joueurs • Cluster 9 serveurs • 99.8% uptime</p>
          </div>
          <router-link to="/arkadia" class="arkadia-btn">
            <span>Découvrir ARKADIA</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </router-link>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta-section" aria-labelledby="cta-title">
      <div class="container">
        <div class="cta-content">
          <h2 id="cta-title">Prêt à explorer ?</h2>
          <p>Chaque univers est une nouvelle expérience. Commencez par celui qui vous parle.</p>
          <div class="cta-buttons">
            <MagneticButton tag="router-link" to="/" class="cta-btn cta-btn--secondary">
              ← Retour à la réalité
            </MagneticButton>
            <MagneticButton tag="router-link" to="/contact" class="cta-btn cta-btn--primary">
              Créons votre univers →
            </MagneticButton>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

// UI Components
import { TiltCard, GlitchText, MagneticButton, ScrollReveal, SpotlightContainer, TextScramble } from '@/components/ui';

const activeFilter = ref('all');

// Catégories d'univers
const categories = [
  { id: 'cyberpunk', name: 'Cyberpunk', icon: '🌃', color: '#06b6d4' },
  { id: 'scifi', name: 'Sci-Fi', icon: '🚀', color: '#8b5cf6' },
  { id: 'action', name: 'Action', icon: '💥', color: '#ef4444' },
  { id: 'fantasy', name: 'Fantasy', icon: '✨', color: '#f59e0b' },
  { id: 'experimental', name: 'Gaming & Lab', icon: '🎮', color: '#10b981' },
  { id: 'personal', name: 'Personnel', icon: '💚', color: '#ec4899' },
];

// Liste des 20 univers
const universes = [
  // CYBERPUNK (5)
  {
    id: 'matrix',
    name: 'The Matrix',
    tagline: 'Réveille-toi Neo...',
    icon: '🐇',
    path: '/matrix',
    year: '1999',
    category: 'cyberpunk',
    color: '#00ff41',
    bgGradient: 'linear-gradient(135deg, #0a0a0a, #003300)'
  },
  {
    id: 'matrix-resurrections',
    name: 'Matrix Resurrections',
    tagline: 'Retour à la Matrice',
    icon: '🔴',
    path: '/matrix-resurrections',
    year: '2021',
    category: 'cyberpunk',
    color: '#ff0040',
    bgGradient: 'linear-gradient(135deg, #1a0a0a, #330011)'
  },
  {
    id: 'blade-runner',
    name: 'Blade Runner',
    tagline: 'More human than human',
    icon: '🌧️',
    path: '/blade-runner',
    year: '1982',
    category: 'cyberpunk',
    color: '#f97316',
    bgGradient: 'linear-gradient(135deg, #1a1a2e, #16213e)'
  },
  {
    id: 'ghost-shell',
    name: 'Ghost in the Shell',
    tagline: 'Le réseau est vaste et infini',
    icon: '🧠',
    path: '/ghost-in-the-shell',
    year: '1995',
    category: 'cyberpunk',
    color: '#06b6d4',
    bgGradient: 'linear-gradient(135deg, #0a1929, #1a237e)'
  },
  {
    id: 'tron',
    name: 'TRON',
    tagline: 'Je me bats pour les utilisateurs',
    icon: '💠',
    path: '/tron',
    year: '1982',
    category: 'cyberpunk',
    color: '#00f5ff',
    bgGradient: 'linear-gradient(135deg, #000000, #001a1a)'
  },

  // SCI-FI (6)
  {
    id: 'inception',
    name: 'Inception',
    tagline: 'Architecture des rêves',
    icon: '🌀',
    path: '/inception',
    year: '2010',
    category: 'scifi',
    color: '#d4af37',
    bgGradient: 'linear-gradient(135deg, #1a1a2e, #0f0f1a)'
  },
  {
    id: 'minority-report',
    name: 'Minority Report',
    tagline: 'Le futur peut être vu',
    icon: '👁️',
    path: '/minority-report',
    year: '2002',
    category: 'scifi',
    color: '#3b82f6',
    bgGradient: 'linear-gradient(135deg, #0f172a, #1e3a5f)'
  },
  {
    id: 'jupiter',
    name: 'Jupiter Ascending',
    tagline: 'L\'héritière',
    icon: '🪐',
    path: '/jupiter-ascending',
    year: '2015',
    category: 'scifi',
    color: '#a855f7',
    bgGradient: 'linear-gradient(135deg, #1a0a2e, #2d1b4e)'
  },
  {
    id: 'cloud-atlas',
    name: 'Cloud Atlas',
    tagline: 'Six époques, une âme',
    icon: '☁️',
    path: '/cloud-atlas',
    year: '2012',
    category: 'scifi',
    color: '#60a5fa',
    bgGradient: 'linear-gradient(135deg, #1e293b, #334155)'
  },
  {
    id: 'asimov',
    name: 'Asimov',
    tagline: 'Les trois lois de la robotique',
    icon: '🤖',
    path: '/asimov',
    year: '1950',
    category: 'scifi',
    color: '#94a3b8',
    bgGradient: 'linear-gradient(135deg, #1f2937, #374151)'
  },
  {
    id: 'ready-player-one',
    name: 'Ready Player One',
    tagline: 'Bienvenue dans l\'OASIS',
    icon: '🎮',
    path: '/ready-player-one',
    year: '2018',
    category: 'scifi',
    color: '#00f5ff',
    bgGradient: 'linear-gradient(135deg, #0a0a1a, #1a1a3a)'
  },

  // ACTION (4)
  {
    id: 'iron-man',
    name: 'Iron Man',
    tagline: 'Je suis Iron Man',
    icon: '🦾',
    path: '/iron-man',
    year: '2008',
    category: 'action',
    color: '#dc2626',
    bgGradient: 'linear-gradient(135deg, #1a0a0a, #2a1515)'
  },
  {
    id: 'vendetta',
    name: 'V pour Vendetta',
    tagline: 'Les idées sont à l\'épreuve des balles',
    icon: '🎭',
    path: '/v-for-vendetta',
    year: '2005',
    category: 'action',
    color: '#991b1b',
    bgGradient: 'linear-gradient(135deg, #0a0a0a, #1a0a0a)'
  },
  {
    id: 'deadpool',
    name: 'Deadpool',
    tagline: 'Maximum Effort',
    icon: '💀',
    path: '/deadpool',
    year: '2016',
    category: 'action',
    color: '#ef4444',
    bgGradient: 'linear-gradient(135deg, #1a0a0a, #2a0a0a)'
  },
  {
    id: 'dragon-ball',
    name: 'Dragon Ball Z',
    tagline: 'C\'EST PLUS DE 9000 !!!',
    icon: '🔥',
    path: '/dragon-ball-z',
    year: '1989',
    category: 'action',
    color: '#f97316',
    bgGradient: 'linear-gradient(135deg, #1a1a0a, #2a2a0a)'
  },

  // FANTASY (2)
  {
    id: 'alice-turing',
    name: 'Alice in Turingland',
    tagline: 'Pays des merveilles logique',
    icon: '🐰',
    path: '/alice-turing',
    year: '1865+',
    category: 'fantasy',
    color: '#ec4899',
    bgGradient: 'linear-gradient(135deg, #1a0a1a, #2a0a2a)'
  },
  {
    id: 'mask',
    name: 'The Mask',
    tagline: 'SSSSMOKIN!',
    icon: '🎭',
    path: '/the-mask',
    year: '1994',
    category: 'fantasy',
    color: '#22c55e',
    bgGradient: 'linear-gradient(135deg, #0a1a0a, #0a2a0a)'
  },

  // EXPERIMENTAL (2)
  {
    id: 'howard-duck',
    name: 'Howard the Duck',
    tagline: 'Perle rare héroïque',
    icon: '🦆',
    path: '/howard-the-duck',
    year: '1986',
    category: 'experimental',
    color: '#fbbf24',
    bgGradient: 'linear-gradient(135deg, #1a1a0a, #2a2a1a)'
  },
  {
    id: 'mecha-mascot',
    name: 'GL Spirit',
    tagline: 'Mascotte style Ghibli',
    icon: '🌿',
    path: '/mecha-mascot',
    year: '2024',
    category: 'experimental',
    color: '#10b981',
    bgGradient: 'linear-gradient(135deg, #0a1a1a, #0a2a2a)'
  },

  // PERSONAL (2)
  {
    id: 'jardin-mam',
    name: 'Le Jardin de Mam\'',
    tagline: 'Pour elle, avec amour',
    icon: '🌸',
    path: '/jardin-de-mam',
    year: '2024',
    category: 'personal',
    color: '#f472b6',
    bgGradient: 'linear-gradient(135deg, #1a0f1a, #2a1a2a)'
  },
  {
    id: 'samus-elements',
    name: 'Samus & Les Éléments',
    tagline: '19/20 au collège',
    icon: '🔥',
    path: '/samus-elements',
    year: '2003',
    category: 'personal',
    color: '#ff6b35',
    bgGradient: 'linear-gradient(135deg, #1a0f0a, #2a1a0a)'
  },

  // GAMING (2)
  {
    id: 'leek-wars',
    name: 'Leek Wars',
    tagline: 'Code ton poireau',
    icon: '🥦',
    path: '/leek-wars',
    year: '2014',
    category: 'experimental',
    color: '#84cc16',
    bgGradient: 'linear-gradient(135deg, #0a1a0a, #1a2a0a)'
  },
  {
    id: 'terraria',
    name: 'Terraria',
    tagline: 'Dig. Fight. Build.',
    icon: '⛏️',
    path: '/terraria',
    year: '2011',
    category: 'experimental',
    color: '#a78bfa',
    bgGradient: 'linear-gradient(135deg, #1a1a2a, #2a2a3a)'
  },
  {
    id: 'arkadia',
    name: 'ARKADIA FRANCE',
    tagline: 'Cluster ARK Survival',
    icon: '🦖',
    path: '/arkadia',
    year: '2024',
    category: 'experimental',
    color: '#00d4ff',
    bgGradient: 'linear-gradient(135deg, #0a151a, #152535)'
  },
];

// Computed
const filteredUniverses = computed(() => {
  if (activeFilter.value === 'all') return universes;
  return universes.filter(u => u.category === activeFilter.value);
});

// Methods
const getCountByCategory = (categoryId) => {
  return universes.filter(u => u.category === categoryId).length;
};

const getCategoryColor = (categoryId) => {
  const cat = categories.find(c => c.id === categoryId);
  return cat ? cat.color : '#666';
};

const getCategoryName = (categoryId) => {
  const cat = categories.find(c => c.id === categoryId);
  return cat ? cat.name : categoryId;
};
</script>

<style scoped>
/* =============================================================================
   MULTIVERS HUB - Variables
   ============================================================================= */
.multivers-hub {
  --bg-dark: #0a0a0f;
  --surface: #111118;
  --primary: #a855f7;
  --primary-soft: rgba(168, 85, 247, 0.15);
  --text-main: #e5e5e5;
  --text-muted: rgba(229, 229, 229, 0.6);
  --border: rgba(255, 255, 255, 0.1);
  
  background: var(--bg-dark);
  color: var(--text-main);
  min-height: 100vh;
  position: relative;
  overflow-x: hidden;
}

/* =============================================================================
   BACKGROUND
   ============================================================================= */
.hub-bg {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
}

.star-field {
  position: absolute;
  inset: 0;
  background-image: 
    radial-gradient(2px 2px at 20px 30px, white, transparent),
    radial-gradient(2px 2px at 40px 70px, rgba(168, 85, 247, 0.8), transparent),
    radial-gradient(1px 1px at 90px 40px, white, transparent),
    radial-gradient(2px 2px at 160px 120px, rgba(59, 130, 246, 0.6), transparent),
    radial-gradient(1px 1px at 230px 180px, white, transparent);
  background-size: 250px 250px;
  animation: star-drift 60s linear infinite;
  opacity: 0.5;
}

@keyframes star-drift {
  from { transform: translateY(0); }
  to { transform: translateY(-250px); }
}

.portal-glow {
  position: absolute;
  top: 10%;
  left: 50%;
  transform: translateX(-50%);
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, rgba(168, 85, 247, 0.15), transparent 60%);
  border-radius: 50%;
  animation: portal-pulse 4s ease-in-out infinite;
}

@keyframes portal-pulse {
  0%, 100% { opacity: 0.3; transform: translateX(-50%) scale(1); }
  50% { opacity: 0.6; transform: translateX(-50%) scale(1.1); }
}

.grid-overlay {
  position: absolute;
  inset: 0;
  background-image: 
    linear-gradient(rgba(168, 85, 247, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(168, 85, 247, 0.03) 1px, transparent 1px);
  background-size: 50px 50px;
}

/* =============================================================================
   SKIP LINK
   ============================================================================= */
.skip-link {
  position: absolute;
  top: -100%;
  left: 50%;
  transform: translateX(-50%);
  padding: 1rem 2rem;
  background: var(--primary);
  color: var(--bg-dark);
  text-decoration: none;
  border-radius: 0.5rem;
  z-index: 1000;
  transition: top 0.3s ease;
}

.skip-link:focus {
  top: 1rem;
}

/* =============================================================================
   HERO
   ============================================================================= */
.hub-hero {
  position: relative;
  z-index: 1;
  padding: 8rem 2rem 4rem;
  text-align: center;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

/* Portal Icon */
.portal-icon {
  position: relative;
  width: 150px;
  height: 150px;
  margin: 0 auto 2rem;
}

.portal-ring {
  position: absolute;
  inset: 0;
  border: 2px solid var(--primary);
  border-radius: 50%;
}

.portal-ring--1 {
  animation: ring-spin 15s linear infinite;
  border-style: dashed;
}

.portal-ring--2 {
  inset: 15px;
  animation: ring-spin 10s linear infinite reverse;
  border-color: rgba(168, 85, 247, 0.5);
}

.portal-ring--3 {
  inset: 30px;
  animation: ring-spin 20s linear infinite;
  border-style: dotted;
  border-color: rgba(168, 85, 247, 0.3);
}

@keyframes ring-spin {
  to { transform: rotate(360deg); }
}

.portal-core {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 3rem;
  animation: core-pulse 2s ease-in-out infinite;
}

@keyframes core-pulse {
  0%, 100% { transform: translate(-50%, -50%) scale(1); }
  50% { transform: translate(-50%, -50%) scale(1.1); }
}

/* Title */
.hero-title {
  margin-bottom: 1.5rem;
}

.title-pre {
  display: block;
  font-size: 0.9rem;
  color: var(--text-muted);
  letter-spacing: 0.3em;
  margin-bottom: 0.5rem;
}

.title-main {
  display: block;
  font-size: clamp(3rem, 10vw, 7rem);
  font-weight: 200;
  color: var(--primary);
  text-shadow: 0 0 60px rgba(168, 85, 247, 0.5);
  letter-spacing: 0.2em;
}

.title-sub {
  display: block;
  font-family: 'JetBrains Mono', monospace;
  font-size: 1rem;
  color: var(--text-muted);
  margin-top: 0.5rem;
}

.hero-intro {
  font-size: 1.1rem;
  color: var(--text-muted);
  max-width: 600px;
  margin: 0 auto 2rem;
  line-height: 1.7;
}

.hero-intro strong { color: var(--primary); }
.hero-intro em { color: #10b981; font-style: normal; }

/* Stats */
.hub-stats {
  display: flex;
  justify-content: center;
  gap: 4rem;
}

.stat { text-align: center; }

.stat-value {
  display: block;
  font-size: 2.5rem;
  font-weight: 200;
  color: var(--primary);
}

.stat-label {
  font-size: 0.75rem;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

/* =============================================================================
   FILTER BAR
   ============================================================================= */
.filter-section {
  position: relative;
  z-index: 1;
  padding: 0 2rem 2rem;
}

.filter-bar {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.filter-btn {
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--border);
  border-radius: 2rem;
  color: var(--text-muted);
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.filter-btn:hover {
  border-color: var(--cat-color, var(--primary));
  color: var(--text-main);
}

.filter-btn.active {
  background: var(--primary-soft);
  border-color: var(--primary);
  color: var(--primary);
}

/* =============================================================================
   UNIVERSES GRID
   ============================================================================= */
.universes-section {
  position: relative;
  z-index: 1;
  padding: 2rem;
}

.universes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}

/* Universe Card Wrapper - Fix for TiltCard */
.universe-card-wrapper {
  height: 100%;
}

.universe-card-wrapper :deep(.tilt-card__content) {
  transform: none !important;
}

/* Universe Card */
.universe-card {
  position: relative;
  display: block;
  height: 100%;
  min-height: 220px;
  background: var(--universe-bg, var(--surface));
  border: 1px solid var(--border);
  border-radius: 1rem;
  overflow: hidden;
  text-decoration: none;
  color: inherit;
  transition: border-color 0.4s ease, box-shadow 0.4s ease;
}

.universe-card:hover {
  border-color: var(--universe-color);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
}

.universe-card:hover .card-glow {
  opacity: 0.3;
}

.card-glow {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 50% 0%, var(--universe-color), transparent 70%);
  opacity: 0;
  transition: opacity 0.4s ease;
}

.card-content {
  position: relative;
  padding: 1.5rem;
  z-index: 1;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.card-icon {
  font-size: 2rem;
}

.card-category {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.6rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.card-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--universe-color);
  margin-bottom: 0.5rem;
}

.card-tagline {
  font-size: 0.85rem;
  color: var(--text-muted);
  font-style: italic;
  margin-bottom: 1rem;
  line-height: 1.4;
}

.card-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.meta-year {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.7rem;
  color: var(--text-muted);
}

.meta-arrow {
  color: var(--universe-color);
  font-size: 1.25rem;
  transition: transform 0.3s ease;
}

.universe-card:hover .meta-arrow {
  transform: translateX(5px);
}

/* Card Overlay */
.card-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: 10;
  pointer-events: none;
}

.overlay-text {
  font-family: 'JetBrains Mono', monospace;
  font-size: 1rem;
  color: var(--universe-color);
  letter-spacing: 0.2em;
  padding: 0.75rem 1.5rem;
  border: 2px solid var(--universe-color);
  background: rgba(0, 0, 0, 0.5);
  transform: translateY(10px);
  transition: transform 0.3s ease;
}

.universe-card:hover .card-overlay {
  opacity: 1;
}

.universe-card:hover .overlay-text {
  transform: translateY(0);
}

/* Grid Animation */
.universe-grid-enter-active,
.universe-grid-leave-active {
  transition: all 0.4s ease;
}

.universe-grid-enter-from,
.universe-grid-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 4rem 2rem;
}

.empty-icon {
  font-size: 4rem;
  display: block;
  margin-bottom: 1rem;
}

.empty-state p {
  color: var(--text-muted);
}

/* =============================================================================
   GALLERY BANNER
   ============================================================================= */
.gallery-banner {
  position: relative;
  z-index: 1;
  padding: 3rem 2rem;
  background: linear-gradient(135deg, rgba(168, 85, 247, 0.1) 0%, rgba(0, 255, 65, 0.05) 100%);
  border-top: 1px solid rgba(168, 85, 247, 0.2);
  border-bottom: 1px solid rgba(168, 85, 247, 0.2);
}

.gallery-content {
  display: flex;
  align-items: center;
  gap: 2rem;
  max-width: 1000px;
  margin: 0 auto;
  flex-wrap: wrap;
  justify-content: center;
}

.gallery-icon {
  font-size: 3rem;
  flex-shrink: 0;
}

.gallery-text {
  flex: 1;
  min-width: 250px;
}

.gallery-text h2 {
  font-size: 1.5rem;
  font-weight: 500;
  margin-bottom: 0.25rem;
  background: linear-gradient(90deg, #a855f7, #00ff41);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.gallery-text p {
  color: var(--text-muted);
  font-size: 0.9rem;
}

.gallery-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 2rem;
  background: linear-gradient(135deg, #a855f7, #00ff41);
  color: #000;
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  text-decoration: none;
  border-radius: 0.5rem;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.gallery-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(168, 85, 247, 0.4);
}

.gallery-btn svg {
  width: 18px;
  height: 18px;
  transition: transform 0.3s;
}

.gallery-btn:hover svg {
  transform: translateX(4px);
}

@media (max-width: 768px) {
  .gallery-content {
    flex-direction: column;
    text-align: center;
  }
  
  .gallery-btn {
    width: 100%;
    justify-content: center;
  }
}

/* =============================================================================
   ARKADIA BANNER
   ============================================================================= */
.arkadia-banner {
  position: relative;
  z-index: 1;
  padding: 3rem 2rem;
  background: linear-gradient(135deg, rgba(0, 212, 255, 0.1) 0%, rgba(255, 102, 0, 0.05) 50%, rgba(123, 192, 67, 0.05) 100%);
  border-top: 1px solid rgba(0, 212, 255, 0.2);
  border-bottom: 1px solid rgba(123, 192, 67, 0.2);
}

.arkadia-content {
  display: flex;
  align-items: center;
  gap: 2rem;
  max-width: 1000px;
  margin: 0 auto;
  flex-wrap: wrap;
  justify-content: center;
}

.arkadia-icon {
  font-size: 3rem;
  flex-shrink: 0;
}

.arkadia-text {
  flex: 1;
  min-width: 250px;
}

.arkadia-text h2 {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
  background: linear-gradient(90deg, #00d4ff, #ff6600, #7bc043);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.arkadia-text p {
  color: var(--text-muted);
  font-size: 0.9rem;
}

.arkadia-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 2rem;
  background: linear-gradient(135deg, #00d4ff, #7bc043);
  color: #000;
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  text-decoration: none;
  border-radius: 0.5rem;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.arkadia-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(0, 212, 255, 0.4);
}

.arkadia-btn svg {
  width: 18px;
  height: 18px;
  transition: transform 0.3s;
}

.arkadia-btn:hover svg {
  transform: translateX(4px);
}

@media (max-width: 768px) {
  .arkadia-content {
    flex-direction: column;
    text-align: center;
  }
  
  .arkadia-btn {
    width: 100%;
    justify-content: center;
  }
}

/* =============================================================================
   CTA SECTION
   ============================================================================= */
.cta-section {
  position: relative;
  z-index: 1;
  padding: 6rem 2rem;
}

.cta-content {
  text-align: center;
  max-width: 600px;
  margin: 0 auto;
}

.cta-content h2 {
  font-size: 2rem;
  font-weight: 400;
  margin-bottom: 0.5rem;
}

.cta-content p {
  color: var(--text-muted);
  margin-bottom: 2rem;
}

.cta-buttons {
  display: flex;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.cta-btn {
  padding: 1rem 2rem;
  font-size: 0.9rem;
  font-weight: 500;
  text-decoration: none;
  border-radius: 0.5rem;
  transition: all 0.3s ease;
}

.cta-btn--secondary {
  background: transparent;
  border: 1px solid var(--border);
  color: var(--text-muted);
}

.cta-btn--secondary:hover {
  border-color: var(--primary);
  color: var(--primary);
}

.cta-btn--primary {
  background: var(--primary);
  border: 1px solid var(--primary);
  color: var(--bg-dark);
}

.cta-btn--primary:hover {
  background: #9333ea;
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(168, 85, 247, 0.4);
}

/* =============================================================================
   UTILITIES
   ============================================================================= */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* =============================================================================
   RESPONSIVE
   ============================================================================= */
@media (max-width: 768px) {
  .hub-stats {
    flex-direction: column;
    gap: 1.5rem;
  }
  
  .filter-bar {
    gap: 0.5rem;
  }
  
  .filter-btn {
    font-size: 0.7rem;
    padding: 0.4rem 0.75rem;
  }
  
  .universes-grid {
    grid-template-columns: 1fr;
  }
  
  .cta-buttons {
    flex-direction: column;
  }
  
  .cta-btn {
    width: 100%;
    text-align: center;
  }
}

/* =============================================================================
   ACCESSIBILITY
   ============================================================================= */
@media (prefers-reduced-motion: reduce) {
  .star-field,
  .portal-glow,
  .portal-ring,
  .portal-core {
    animation: none !important;
  }
  
  .universe-card:hover {
    transform: none;
  }
}

/* Focus styles */
.universe-card:focus-visible {
  outline: 2px solid var(--primary);
  outline-offset: 4px;
}

.filter-btn:focus-visible {
  outline: 2px solid var(--primary);
  outline-offset: 2px;
}
</style>
