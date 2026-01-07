<template>
  <div class="architect-page">
    <a href="#main-content" class="skip-link">Aller au contenu principal</a>

    <!-- BLUEPRINT GRID OVERLAY -->
    <div class="blueprint-grid" aria-hidden="true">
      <svg width="100%" height="100%">
        <defs>
          <pattern id="smallGrid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(70, 130, 180, 0.15)" stroke-width="0.5"/>
          </pattern>
          <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
            <rect width="100" height="100" fill="url(#smallGrid)"/>
            <path d="M 100 0 L 0 0 0 100" fill="none" stroke="rgba(70, 130, 180, 0.3)" stroke-width="1"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
    </div>

    <!-- HANDWRITTEN NOTES FLOATING -->
    <div class="floating-notes" aria-hidden="true">
      <span class="note note--1">structure</span>
      <span class="note note--2">lumière naturelle</span>
      <span class="note note--3">→ végétaliser</span>
      <span class="note note--4">// TODO: optimiser</span>
      <span class="note note--5">cf. sketch p.42</span>
    </div>

    <!-- HERO : Blueprint Dreams -->
    <section id="hero" class="arch-hero" aria-labelledby="hero-title">
      <div class="hero-sketch" aria-hidden="true">
        <svg class="house-sketch" viewBox="0 0 400 500" preserveAspectRatio="xMidYMid meet">
          <!-- Tree trunk -->
          <path class="sketch-line tree-trunk" d="M60 200 Q55 280 50 380 Q48 400 55 420" stroke-dasharray="500" />
          <path class="sketch-line tree-trunk" d="M70 200 Q75 280 80 380" stroke-dasharray="500" />
          
          <!-- Tree foliage circles -->
          <ellipse class="sketch-fill foliage" cx="80" cy="100" rx="60" ry="50" />
          <ellipse class="sketch-fill foliage" cx="50" cy="130" rx="45" ry="40" />
          <ellipse class="sketch-fill foliage" cx="110" cy="130" rx="40" ry="35" />
          <ellipse class="sketch-fill foliage" cx="70" cy="160" rx="50" ry="40" />
          
          <!-- House - main structure -->
          <rect class="sketch-line house-main" x="140" y="140" width="180" height="280" rx="2"/>
          
          <!-- Roof detail -->
          <line class="sketch-line" x1="140" y1="140" x2="320" y2="140"/>
          <line class="sketch-line" x1="145" y1="135" x2="315" y2="135"/>
          
          <!-- Windows - arched top -->
          <path class="sketch-line window-arch" d="M170 180 L170 240 Q195 240 195 180 Q195 160 182 160 Q170 160 170 180" />
          <path class="sketch-line window-arch" d="M220 180 L220 240 Q245 240 245 180 Q245 160 232 160 Q220 160 220 180" />
          <path class="sketch-line window-arch" d="M270 180 L270 240 Q295 240 295 180 Q295 160 282 160 Q270 160 270 180" />
          
          <!-- Main door - arched -->
          <path class="sketch-line door-main" d="M200 420 L200 320 Q230 290 260 320 L260 420" />
          
          <!-- Balcony -->
          <line class="sketch-line" x1="155" y1="280" x2="200" y2="280"/>
          <rect class="sketch-line" x="160" y="280" width="35" height="50"/>
          
          <!-- Steps -->
          <line class="sketch-line steps" x1="130" y1="420" x2="330" y2="420"/>
          <line class="sketch-line steps" x1="125" y1="430" x2="335" y2="430"/>
          <line class="sketch-line steps" x1="120" y1="440" x2="340" y2="440"/>
          
          <!-- Dimension lines -->
          <g class="dimensions">
            <line x1="140" y1="460" x2="320" y2="460" stroke-dasharray="5,3"/>
            <line x1="140" y1="455" x2="140" y2="465"/>
            <line x1="320" y1="455" x2="320" y2="465"/>
            <text x="230" y="475" text-anchor="middle">12.50m</text>
          </g>
          
          <!-- Annotations -->
          <g class="annotations">
            <text x="350" y="200">fenêtre</text>
            <text x="350" y="210">cintrée</text>
            <line x1="300" y1="200" x2="340" y2="200" stroke-dasharray="2,2"/>
            
            <text x="30" y="80">chêne</text>
            <text x="25" y="95">centenaire</text>
          </g>
          
          <!-- Lanterns glow -->
          <circle class="lantern-glow" cx="175" cy="380" r="8"/>
          <circle class="lantern-glow" cx="285" cy="380" r="8"/>
        </svg>
      </div>

      <div class="container" id="main-content">
        <div class="architect-badge">
          <div class="compass-icon">
            <svg viewBox="0 0 50 50">
              <circle cx="25" cy="25" r="22" fill="none" stroke="currentColor" stroke-width="1"/>
              <path d="M25 5 L28 25 L25 45 L22 25 Z" fill="currentColor" opacity="0.3"/>
              <path d="M25 5 L28 25 L25 20 L22 25 Z" fill="currentColor"/>
              <circle cx="25" cy="25" r="3" fill="currentColor"/>
            </svg>
          </div>
          <span class="badge-text">ARCHITECTE NUMÉRIQUE</span>
        </div>

        <h1 id="hero-title" class="hero-title">
          <span class="title-sketch">Du croquis</span>
          <span class="title-main">au code</span>
        </h1>

        <p class="hero-quote">
          « Concevoir des systèmes où chaque ligne de code<br>
          est une pierre posée avec intention. »
        </p>

        <div class="metrics-ruler">
          <div class="metric">
            <span class="metric-val">{{ projectCount }}</span>
            <span class="metric-lbl">Projets</span>
            <span class="metric-unit">construits</span>
          </div>
          <div class="metric">
            <span class="metric-val">15+</span>
            <span class="metric-lbl">Années</span>
            <span class="metric-unit">d'expérience</span>
          </div>
          <div class="metric">
            <span class="metric-val">∞</span>
            <span class="metric-lbl">Passion</span>
            <span class="metric-unit">inaltérable</span>
          </div>
        </div>

        <button class="blueprint-btn" @click="scrollTo('philosophy')">
          <span class="btn-icon">📐</span>
          <span class="btn-text">VOIR LES PLANS</span>
        </button>
      </div>
    </section>

    <!-- PHILOSOPHY : Design Principles -->
    <section id="philosophy" class="arch-section philosophy-section" aria-labelledby="philosophy-title">
      <div class="container">
        <div class="section-header">
          <span class="header-icon">📏</span>
          <h2 id="philosophy-title">PHILOSOPHIE</h2>
          <p class="section-sub">Les fondations de chaque projet</p>
        </div>

        <div class="principles-grid">
          <article v-for="(principle, index) in principles" :key="index" class="principle-card">
            <div class="card-number">{{ String(index + 1).padStart(2, '0') }}</div>
            <div class="card-sketch" aria-hidden="true">
              <span class="sketch-icon">{{ principle.icon }}</span>
            </div>
            <h3>{{ principle.title }}</h3>
            <p>{{ principle.desc }}</p>
            <div class="card-annotation">{{ principle.annotation }}</div>
          </article>
        </div>
      </div>
    </section>

    <!-- BLUEPRINTS : Projects -->
    <section id="blueprints" class="arch-section blueprints-section" aria-labelledby="blueprints-title">
      <div class="container">
        <div class="section-header">
          <span class="header-icon">🏗️</span>
          <h2 id="blueprints-title">RÉALISATIONS</h2>
          <p class="section-sub">Plans et constructions</p>
        </div>

        <div class="blueprints-grid">
          <article v-for="project in projects" :key="project.id" class="blueprint-card">
            <div class="card-blueprint">
              <div class="blueprint-frame">
                <span class="frame-icon">{{ project.icon }}</span>
              </div>
              <div class="blueprint-annotations">
                <span class="annotation annotation--1">{{ project.tech1 }}</span>
                <span class="annotation annotation--2">{{ project.tech2 }}</span>
              </div>
            </div>
            <div class="card-info">
              <div class="info-header">
                <span class="project-type">{{ project.type }}</span>
                <span class="project-year">{{ project.year }}</span>
              </div>
              <h3>{{ project.name }}</h3>
              <p>{{ project.desc }}</p>
              <div class="project-specs">
                <span v-for="spec in project.specs" :key="spec">{{ spec }}</span>
              </div>
            </div>
            <div class="card-dimensions" aria-hidden="true">
              <span>{{ project.scale }}</span>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- WORKSHOP : Skills -->
    <section id="workshop" class="arch-section workshop-section" aria-labelledby="workshop-title">
      <div class="container">
        <div class="section-header">
          <span class="header-icon">🛠️</span>
          <h2 id="workshop-title">ATELIER</h2>
          <p class="section-sub">Outils et savoir-faire</p>
        </div>

        <div class="tools-showcase">
          <div class="tool-category" v-for="cat in toolCategories" :key="cat.name">
            <h3 class="category-title">
              <span class="cat-icon">{{ cat.icon }}</span>
              {{ cat.name }}
            </h3>
            <div class="tools-grid">
              <div v-for="tool in cat.tools" :key="tool.name" class="tool-item">
                <span class="tool-icon">{{ tool.icon }}</span>
                <span class="tool-name">{{ tool.name }}</span>
                <div class="tool-level">
                  <div class="level-fill" :style="{ width: tool.level + '%' }"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CONTACT : Build Together -->
    <section id="contact" class="arch-section contact-section" aria-labelledby="contact-title">
      <div class="container">
        <div class="section-header">
          <span class="header-icon">✉️</span>
          <h2 id="contact-title">CONSTRUISONS ENSEMBLE</h2>
          <p class="section-sub">Votre projet mérite une architecture solide</p>
        </div>

        <div class="contact-blueprint">
          <div class="blueprint-sketch">
            <div class="sketch-house">
              <div class="house-glow"></div>
            </div>
            <p class="sketch-label">Votre futur projet ?</p>
          </div>
          
          <div class="contact-info">
            <a href="mailto:gtn.langlet@gmail.com" class="contact-link">
              <span class="link-icon">📧</span>
              <span class="link-text">gtn.langlet@gmail.com</span>
            </a>
            <a href="https://gldigitallab.fr" target="_blank" class="contact-link">
              <span class="link-icon">🌐</span>
              <span class="link-text">gldigitallab.fr</span>
            </a>
            <a href="https://github.com/GaetanLgt" target="_blank" class="contact-link">
              <span class="link-icon">💻</span>
              <span class="link-text">GitHub</span>
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- BACK TO MULTIVERS -->
    <nav class="nav-multivers" aria-label="Retour">
      <router-link to="/multivers" class="back-btn">
        <span class="btn-icon">←</span>
        <span class="btn-text">Retour au Multivers</span>
      </router-link>
    </nav>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const projectCount = ref(12);

// Principles
const principles = [
  {
    icon: '🏛️',
    title: 'Fondations Solides',
    desc: 'Chaque projet commence par une architecture pensée pour durer. Code propre, documentation claire, tests rigoureux.',
    annotation: '→ maintenabilité'
  },
  {
    icon: '🌱',
    title: 'Croissance Organique',
    desc: 'Comme un arbre qui pousse, le code doit pouvoir évoluer naturellement sans tout reconstruire.',
    annotation: '→ scalabilité'
  },
  {
    icon: '💡',
    title: 'Lumière & Clarté',
    desc: 'L\'interface doit guider l\'utilisateur intuitivement. Chaque élément a sa raison d\'être.',
    annotation: '→ UX/UI'
  },
  {
    icon: '🔧',
    title: 'Artisanat',
    desc: 'Le code est un métier. Chaque fonction est ciselée, chaque composant assemblé avec soin.',
    annotation: '→ qualité'
  }
];

// Projects
const projects = [
  {
    id: 1,
    icon: '🏰',
    name: 'ARKADIA FRANCE',
    type: 'Communauté Gaming',
    year: '2024',
    desc: 'Cluster de serveurs ARK avec économie intégrée, bots Discord et 150+ membres actifs.',
    tech1: 'Discord.js',
    tech2: 'Node.js',
    specs: ['Multi-serveurs', 'Économie', 'Events'],
    scale: '1:150'
  },
  {
    id: 2,
    icon: '🌐',
    name: 'GL Digital Lab',
    type: 'Portfolio Immersif',
    year: '2025',
    desc: 'Site vitrine avec 20 univers thématiques, Three.js et expériences interactives.',
    tech1: 'Vue 3',
    tech2: 'Three.js',
    specs: ['20 univers', 'WebGL', 'A11y'],
    scale: '1:∞'
  },
  {
    id: 3,
    icon: '🤖',
    name: 'GL Factory Stack',
    type: 'Infrastructure IA',
    year: '2025',
    desc: 'Pipeline d\'automatisation avec Ollama, n8n, et agents IA locaux souverains.',
    tech1: 'Docker',
    tech2: 'Ollama',
    specs: ['Local-first', 'RAG', 'Workflows'],
    scale: '1:100'
  },
  {
    id: 4,
    icon: '🎮',
    name: 'The Construct',
    type: 'Expérience 3D',
    year: '2025',
    desc: 'Environnement Matrix immersif avec gamification, achievements et mini-jeux.',
    tech1: 'Three.js',
    tech2: 'WebGL',
    specs: ['FPS', 'XP System', 'Pixel Art'],
    scale: '1:1'
  }
];

// Tool categories
const toolCategories = [
  {
    name: 'Backend',
    icon: '⚙️',
    tools: [
      { name: 'PHP/Symfony', icon: '🐘', level: 95 },
      { name: 'Node.js', icon: '💚', level: 80 },
      { name: 'Python', icon: '🐍', level: 70 },
      { name: 'Docker', icon: '🐳', level: 85 }
    ]
  },
  {
    name: 'Frontend',
    icon: '🎨',
    tools: [
      { name: 'Vue 3', icon: '💚', level: 90 },
      { name: 'Three.js', icon: '🎲', level: 75 },
      { name: 'CSS/SCSS', icon: '🎭', level: 95 },
      { name: 'TypeScript', icon: '📘', level: 70 }
    ]
  },
  {
    name: 'Outils',
    icon: '🛠️',
    tools: [
      { name: 'Git', icon: '📦', level: 90 },
      { name: 'Matomo', icon: '📊', level: 85 },
      { name: 'n8n', icon: '🔄', level: 80 },
      { name: 'Obsidian', icon: '📝', level: 90 }
    ]
  }
];

function scrollTo(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
}

onMounted(() => {
  // Animate sketch lines on load
  const lines = document.querySelectorAll('.sketch-line');
  lines.forEach((line, i) => {
    line.style.animationDelay = `${i * 0.1}s`;
  });
});
</script>

<style scoped>
/* ============================================================================
   ARCHITECT PAGE - Blueprint Style
   ============================================================================ */

.architect-page {
  min-height: 100vh;
  background: #faf8f5;
  color: #2c3e50;
  font-family: 'Inter', 'Segoe UI', sans-serif;
  position: relative;
  overflow-x: hidden;
}

/* Blueprint Grid */
.blueprint-grid {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  opacity: 0.6;
}

/* Floating Notes */
.floating-notes {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 1;
}

.note {
  position: absolute;
  font-family: 'Caveat', 'Comic Sans MS', cursive;
  font-size: 1rem;
  color: #5d6d7e;
  transform: rotate(var(--rotate, -5deg));
  opacity: 0.6;
}

.note--1 { top: 15%; left: 5%; --rotate: -8deg; }
.note--2 { top: 30%; right: 8%; --rotate: 5deg; }
.note--3 { top: 55%; left: 3%; --rotate: -3deg; }
.note--4 { top: 70%; right: 5%; --rotate: 7deg; font-family: 'JetBrains Mono', monospace; font-size: 0.8rem; }
.note--5 { top: 85%; left: 10%; --rotate: -6deg; }

/* Skip Link */
.skip-link {
  position: absolute;
  top: -100px;
  left: 50%;
  transform: translateX(-50%);
  background: #2a5298;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 0 0 8px 8px;
  z-index: 9999;
  transition: top 0.3s;
}

.skip-link:focus {
  top: 0;
}

/* ============================================================================
   HERO SECTION
   ============================================================================ */

.arch-hero {
  min-height: 100vh;
  display: flex;
  align-items: center;
  position: relative;
  padding: 2rem;
}

.hero-sketch {
  position: absolute;
  right: 5%;
  top: 50%;
  transform: translateY(-50%);
  width: 40%;
  max-width: 400px;
  opacity: 0.8;
}

.house-sketch {
  width: 100%;
  height: auto;
}

.sketch-line {
  fill: none;
  stroke: #5d6d7e;
  stroke-width: 1.5;
  stroke-linecap: round;
  stroke-linejoin: round;
  animation: drawLine 2s ease forwards;
}

.sketch-fill {
  fill: none;
  stroke: #7d9a6a;
  stroke-width: 1;
  opacity: 0.6;
}

.foliage {
  fill: rgba(144, 238, 144, 0.3);
  stroke: #228b22;
}

.house-main {
  fill: rgba(70, 130, 180, 0.15);
  stroke: #2a5298;
  stroke-width: 2;
}

.window-arch, .door-main {
  stroke: #8b4513;
  stroke-width: 1.5;
}

.lantern-glow {
  fill: #ffd700;
  opacity: 0.6;
  animation: glow 2s ease-in-out infinite;
}

@keyframes drawLine {
  from { stroke-dashoffset: 500; }
  to { stroke-dashoffset: 0; }
}

@keyframes glow {
  0%, 100% { opacity: 0.4; r: 6; }
  50% { opacity: 0.8; r: 10; }
}

.dimensions text, .annotations text {
  font-family: 'Caveat', cursive;
  font-size: 12px;
  fill: #5d6d7e;
}

.dimensions line, .annotations line {
  stroke: #5d6d7e;
  stroke-width: 0.5;
}

/* Hero Content */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  position: relative;
  z-index: 2;
}

.architect-badge {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 2rem;
}

.compass-icon {
  width: 40px;
  height: 40px;
  color: #2a5298;
  animation: rotate 20s linear infinite;
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.badge-text {
  font-size: 0.8rem;
  letter-spacing: 0.2em;
  color: #5d6d7e;
  font-weight: 500;
}

.hero-title {
  font-size: clamp(2.5rem, 8vw, 5rem);
  line-height: 1.1;
  margin-bottom: 1.5rem;
}

.title-sketch {
  display: block;
  font-family: 'Caveat', cursive;
  font-weight: 400;
  color: #7d9a6a;
  font-size: 0.5em;
}

.title-main {
  display: block;
  font-weight: 700;
  color: #2a5298;
}

.hero-quote {
  font-family: 'Caveat', cursive;
  font-size: 1.5rem;
  color: #5d6d7e;
  max-width: 500px;
  margin-bottom: 2rem;
  line-height: 1.4;
}

/* Metrics */
.metrics-ruler {
  display: flex;
  gap: 2rem;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: rgba(70, 130, 180, 0.05);
  border: 1px solid rgba(70, 130, 180, 0.2);
  border-radius: 4px;
  max-width: fit-content;
}

.metric {
  text-align: center;
}

.metric-val {
  display: block;
  font-size: 2rem;
  font-weight: 700;
  color: #2a5298;
}

.metric-lbl {
  display: block;
  font-size: 0.75rem;
  letter-spacing: 0.1em;
  color: #5d6d7e;
  text-transform: uppercase;
}

.metric-unit {
  display: block;
  font-family: 'Caveat', cursive;
  font-size: 0.9rem;
  color: #7d9a6a;
}

/* Button */
.blueprint-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 2rem;
  background: #2a5298;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 0.9rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  cursor: pointer;
  transition: all 0.3s;
}

.blueprint-btn:hover {
  background: #1a3a6e;
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(42, 82, 152, 0.3);
}

.btn-icon {
  font-size: 1.2rem;
}

/* ============================================================================
   SECTIONS
   ============================================================================ */

.arch-section {
  padding: 6rem 2rem;
  position: relative;
}

.section-header {
  text-align: center;
  margin-bottom: 4rem;
}

.header-icon {
  font-size: 2rem;
  display: block;
  margin-bottom: 1rem;
}

.section-header h2 {
  font-size: 2rem;
  color: #2a5298;
  letter-spacing: 0.1em;
  margin: 0;
}

.section-sub {
  font-family: 'Caveat', cursive;
  font-size: 1.2rem;
  color: #5d6d7e;
  margin-top: 0.5rem;
}

/* ============================================================================
   PRINCIPLES
   ============================================================================ */

.principles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  max-width: 1000px;
  margin: 0 auto;
}

.principle-card {
  background: white;
  border: 1px solid rgba(70, 130, 180, 0.2);
  border-radius: 8px;
  padding: 2rem;
  position: relative;
  transition: all 0.3s;
}

.principle-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 40px rgba(42, 82, 152, 0.15);
}

.card-number {
  position: absolute;
  top: 1rem;
  right: 1rem;
  font-size: 2rem;
  font-weight: 700;
  color: rgba(70, 130, 180, 0.1);
}

.card-sketch {
  margin-bottom: 1rem;
}

.sketch-icon {
  font-size: 2.5rem;
}

.principle-card h3 {
  font-size: 1.1rem;
  color: #2a5298;
  margin-bottom: 0.75rem;
}

.principle-card p {
  font-size: 0.9rem;
  color: #5d6d7e;
  line-height: 1.6;
}

.card-annotation {
  margin-top: 1rem;
  font-family: 'Caveat', cursive;
  font-size: 1rem;
  color: #7d9a6a;
}

/* ============================================================================
   BLUEPRINTS / PROJECTS
   ============================================================================ */

.blueprints-section {
  background: rgba(70, 130, 180, 0.03);
}

.blueprints-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.blueprint-card {
  background: white;
  border: 1px solid rgba(70, 130, 180, 0.3);
  border-radius: 8px;
  overflow: hidden;
  position: relative;
  transition: all 0.3s;
}

.blueprint-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 50px rgba(42, 82, 152, 0.2);
}

.card-blueprint {
  background: linear-gradient(135deg, rgba(70, 130, 180, 0.1), rgba(70, 130, 180, 0.05));
  padding: 2rem;
  position: relative;
  min-height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.blueprint-frame {
  width: 80px;
  height: 80px;
  border: 2px dashed rgba(70, 130, 180, 0.4);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.frame-icon {
  font-size: 2.5rem;
}

.blueprint-annotations {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.annotation {
  position: absolute;
  font-family: 'Caveat', cursive;
  font-size: 0.8rem;
  color: #5d6d7e;
  background: rgba(255, 255, 255, 0.8);
  padding: 0.2rem 0.5rem;
  border-radius: 2px;
}

.annotation--1 { top: 1rem; left: 1rem; }
.annotation--2 { bottom: 1rem; right: 1rem; }

.card-info {
  padding: 1.5rem;
}

.info-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.project-type {
  font-size: 0.7rem;
  letter-spacing: 0.1em;
  color: #7d9a6a;
  text-transform: uppercase;
}

.project-year {
  font-family: 'Caveat', cursive;
  color: #5d6d7e;
}

.card-info h3 {
  font-size: 1.2rem;
  color: #2a5298;
  margin-bottom: 0.5rem;
}

.card-info p {
  font-size: 0.85rem;
  color: #5d6d7e;
  line-height: 1.5;
  margin-bottom: 1rem;
}

.project-specs {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.project-specs span {
  font-size: 0.7rem;
  padding: 0.25rem 0.5rem;
  background: rgba(70, 130, 180, 0.1);
  color: #2a5298;
  border-radius: 3px;
}

.card-dimensions {
  position: absolute;
  bottom: 0.5rem;
  right: 0.5rem;
  font-family: 'Caveat', cursive;
  font-size: 0.8rem;
  color: rgba(70, 130, 180, 0.5);
}

/* ============================================================================
   WORKSHOP / SKILLS
   ============================================================================ */

.tools-showcase {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  max-width: 1000px;
  margin: 0 auto;
}

.tool-category {
  background: white;
  border: 1px solid rgba(70, 130, 180, 0.2);
  border-radius: 8px;
  padding: 1.5rem;
}

.category-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  color: #2a5298;
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid rgba(70, 130, 180, 0.1);
}

.cat-icon {
  font-size: 1.2rem;
}

.tools-grid {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.tool-item {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 0.75rem;
}

.tool-icon {
  font-size: 1.2rem;
}

.tool-name {
  font-size: 0.85rem;
  color: #2c3e50;
}

.tool-level {
  width: 60px;
  height: 6px;
  background: rgba(70, 130, 180, 0.1);
  border-radius: 3px;
  overflow: hidden;
}

.level-fill {
  height: 100%;
  background: linear-gradient(90deg, #7d9a6a, #2a5298);
  border-radius: 3px;
  transition: width 1s ease;
}

/* ============================================================================
   CONTACT
   ============================================================================ */

.contact-section {
  background: linear-gradient(180deg, rgba(70, 130, 180, 0.05), rgba(125, 154, 106, 0.05));
}

.contact-blueprint {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  max-width: 800px;
  margin: 0 auto;
  align-items: center;
}

.blueprint-sketch {
  text-align: center;
}

.sketch-house {
  width: 150px;
  height: 150px;
  margin: 0 auto 1rem;
  border: 2px dashed rgba(70, 130, 180, 0.4);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.house-glow {
  width: 60px;
  height: 60px;
  background: radial-gradient(circle, rgba(255, 215, 0, 0.4), transparent);
  border-radius: 50%;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 0.6; }
  50% { transform: scale(1.2); opacity: 1; }
}

.sketch-label {
  font-family: 'Caveat', cursive;
  font-size: 1.2rem;
  color: #5d6d7e;
}

.contact-info {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.contact-link {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.5rem;
  background: white;
  border: 1px solid rgba(70, 130, 180, 0.2);
  border-radius: 8px;
  text-decoration: none;
  color: #2c3e50;
  transition: all 0.3s;
}

.contact-link:hover {
  border-color: #2a5298;
  transform: translateX(5px);
  box-shadow: 0 5px 20px rgba(42, 82, 152, 0.15);
}

.link-icon {
  font-size: 1.5rem;
}

.link-text {
  font-size: 0.95rem;
}

/* ============================================================================
   NAV MULTIVERS
   ============================================================================ */

.nav-multivers {
  padding: 2rem;
  text-align: center;
  background: rgba(70, 130, 180, 0.03);
}

.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: transparent;
  border: 1px solid #2a5298;
  color: #2a5298;
  border-radius: 4px;
  text-decoration: none;
  font-size: 0.9rem;
  transition: all 0.3s;
}

.back-btn:hover {
  background: #2a5298;
  color: white;
}

/* ============================================================================
   RESPONSIVE
   ============================================================================ */

@media (max-width: 900px) {
  .hero-sketch {
    position: relative;
    right: auto;
    top: auto;
    transform: none;
    width: 80%;
    max-width: 300px;
    margin: 0 auto 2rem;
  }
  
  .arch-hero {
    flex-direction: column;
    text-align: center;
  }
  
  .metrics-ruler {
    margin: 0 auto 2rem;
  }
  
  .contact-blueprint {
    grid-template-columns: 1fr;
  }
  
  .floating-notes {
    display: none;
  }
}
</style>
