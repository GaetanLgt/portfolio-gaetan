<template>
  <div class="ironman-page">
    <a href="#main-content" class="skip-link">Aller au contenu principal</a>

    <!-- JARVIS HUD OVERLAY -->
    <div class="jarvis-hud" aria-hidden="true">
      <div class="hud-circle hud-circle--1"></div>
      <div class="hud-circle hud-circle--2"></div>
      <div class="hud-circle hud-circle--3"></div>
      <div class="hud-corner hud-corner--tl"></div>
      <div class="hud-corner hud-corner--tr"></div>
      <div class="hud-corner hud-corner--bl"></div>
      <div class="hud-corner hud-corner--br"></div>
      <div class="hud-scanline"></div>
    </div>

    <!-- HERO : Suit Up -->
    <section id="hero" class="im-hero" aria-labelledby="hero-title">
      <div class="hero-bg" aria-hidden="true">
        <div class="arc-reactor">
          <div class="reactor-core"></div>
          <div class="reactor-ring reactor-ring--1"></div>
          <div class="reactor-ring reactor-ring--2"></div>
          <div class="reactor-ring reactor-ring--3"></div>
          <div class="reactor-glow"></div>
        </div>
        <div class="tech-grid"></div>
      </div>

      <div class="container" id="main-content">
        <div class="stark-badge">
          <div class="badge-reactor"></div>
          <span class="badge-text">STARK INDUSTRIES</span>
        </div>

        <h1 id="hero-title" class="hero-title">
          <span class="title-pre">JE SUIS</span>
          <span class="title-main">IRON MAN</span>
          <span class="title-sub">Génie. Milliardaire. Développeur. Philanthrope.</span>
        </h1>

        <p class="hero-quote">
          « Parfois il faut courir avant de savoir marcher. »
        </p>

        <div class="suit-stats">
          <div class="stat-item" v-for="stat in suitStats" :key="stat.label">
            <div class="stat-ring">
              <svg viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" class="ring-bg"/>
                <circle cx="50" cy="50" r="40" class="ring-fill" 
                  :stroke-dasharray="251" 
                  :stroke-dashoffset="251 - (251 * stat.value / 100)"/>
              </svg>
              <span class="stat-icon">{{ stat.icon }}</span>
            </div>
            <span class="stat-val">{{ stat.value }}%</span>
            <span class="stat-label">{{ stat.label }}</span>
          </div>
        </div>

        <button class="jarvis-btn" @click="scrollTo('workshop')">
          <span class="btn-reactor"></span>
          <span class="btn-text">INITIALISER J.A.R.V.I.S.</span>
        </button>
      </div>
    </section>

    <!-- WORKSHOP : About / Identity -->
    <section id="workshop" class="im-section workshop-section" aria-labelledby="workshop-title">
      <div class="container">
        <div class="section-header">
          <span class="header-icon">🔧</span>
          <h2 id="workshop-title">L'ATELIER</h2>
          <p class="section-sub">Là où l'innovation prend vie</p>
        </div>

        <div class="workshop-content">
          <div class="hologram-card">
            <div class="holo-header">
              <div class="holo-avatar">
                <span class="avatar-text">GL</span>
                <div class="avatar-scan"></div>
              </div>
              <div class="holo-info">
                <h3>GAËTAN LANGLET</h3>
                <p class="holo-alias">// Codename: NEO</p>
              </div>
            <div class="holo-status">
                <span class="status-dot"></span>
                EN LIGNE
              </div>
            </div>

            <div class="holo-body">
              <div class="data-line" v-for="data in profileData" :key="data.key">
                <span class="data-key">{{ data.key }}:</span>
                <span class="data-value" :class="data.class">{{ data.value }}</span>
              </div>
            </div>

            <div class="holo-footer">
              <div class="power-level">
                <span class="power-label">PUISSANCE</span>
                <div class="power-bar">
                  <div class="power-fill" :style="{ width: powerLevel + '%' }"></div>
                </div>
                <span class="power-value">{{ powerLevel }}%</span>
              </div>
            </div>
          </div>

          <blockquote class="stark-quote">
            <p>« L'armure et moi ne faisons qu'un. »</p>
            <p class="quote-translation">Le code et moi ne faisons qu'un.</p>
          </blockquote>
        </div>
      </div>
    </section>

    <!-- ARMORY : Skills / Tech Stack -->
    <section id="armory" class="im-section armory-section" aria-labelledby="armory-title">
      <div class="container">
        <div class="section-header">
          <span class="header-icon">🦾</span>
          <h2 id="armory-title">L'ARSENAL</h2>
          <p class="section-sub">Configurations et améliorations d'armures</p>
        </div>

        <div class="suit-selector">
          <div class="selector-track">
            <button 
              v-for="(suit, index) in suits" 
              :key="suit.mark"
              class="suit-btn"
              :class="{ active: activeSuit === index }"
              @click="activeSuit = index"
            >
              <span class="suit-mark">{{ suit.mark }}</span>
              <span class="suit-name">{{ suit.name }}</span>
            </button>
          </div>
        </div>

        <div class="suit-display">
          <div class="suit-schematic">
            <div class="schematic-body">
              <div class="schematic-head"></div>
              <div class="schematic-torso">
                <div class="schematic-reactor"></div>
              </div>
              <div class="schematic-arm schematic-arm--left"></div>
              <div class="schematic-arm schematic-arm--right"></div>
              <div class="schematic-leg schematic-leg--left"></div>
              <div class="schematic-leg schematic-leg--right"></div>
            </div>
            <div class="schematic-labels">
              <div class="label label--head">INTERFACE NEURALE</div>
              <div class="label label--chest">RÉACTEUR ARC</div>
              <div class="label label--arms">RÉPULSEURS</div>
              <div class="label label--legs">SYSTÈME DE VOL</div>
            </div>
          </div>

          <div class="suit-specs">
            <h3>{{ suits[activeSuit].name }}</h3>
            <p class="suit-desc">{{ suits[activeSuit].desc }}</p>
            
            <div class="specs-grid">
              <div class="spec-item" v-for="spec in suits[activeSuit].specs" :key="spec.name">
                <span class="spec-icon">{{ spec.icon }}</span>
                <span class="spec-name">{{ spec.name }}</span>
                <div class="spec-bar">
                  <div class="spec-fill" :style="{ width: spec.level + '%' }"></div>
                </div>
              </div>
            </div>

            <div class="suit-tech">
              <span v-for="tech in suits[activeSuit].tech" :key="tech" class="tech-tag">{{ tech }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- PROJECTS : Iron Legion -->
    <section id="legion" class="im-section legion-section" aria-labelledby="legion-title">
      <div class="container">
        <div class="section-header">
          <span class="header-icon">🤖</span>
          <h2 id="legion-title">IRON LEGION</h2>
          <p class="section-sub">Systèmes autonomes déployés</p>
        </div>

        <div class="legion-grid">
          <article 
            v-for="project in projects" 
            :key="project.id" 
            class="legion-card"
            :class="'card--' + project.status"
          >
            <div class="card-hud">
              <span class="hud-id">{{ project.id }}</span>
              <span class="hud-status">{{ project.status }}</span>
            </div>
            
            <div class="card-icon">{{ project.icon }}</div>
            
            <div class="card-content">
              <h3>{{ project.name }}</h3>
              <p>{{ project.desc }}</p>
            </div>

            <div class="card-specs">
              <div class="spec" v-for="spec in project.specs" :key="spec">
                {{ spec }}
              </div>
            </div>

            <div class="card-power">
              <div class="power-indicator" :style="{ '--power': project.power + '%' }">
                <span>{{ project.power }}%</span>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- PHILOSOPHY : Vision -->
    <section id="vision" class="im-section vision-section" aria-labelledby="vision-title">
      <div class="container">
        <div class="section-header">
          <span class="header-icon">💡</span>
          <h2 id="vision-title">LA VISION</h2>
          <p class="section-sub">Construire demain, aujourd'hui</p>
        </div>

        <div class="vision-content">
          <div class="vision-cards">
            <div class="vision-card">
              <div class="card-number">01</div>
              <h3>INNOVATION</h3>
              <p>« Si nous ne pouvons pas protéger la Terre, soyez certains qu'on la vengera. »</p>
              <p class="card-meaning">Créer des solutions qui protègent et renforcent les PME face aux géants du cloud.</p>
            </div>
            <div class="vision-card">
              <div class="card-number">02</div>
              <h3>AUTONOMIE</h3>
              <p>« J'ai réussi à privatiser la paix mondiale. »</p>
              <p class="card-meaning">Souveraineté numérique : IA locale, données maîtrisées, zéro dépendance cloud US.</p>
            </div>
            <div class="vision-card">
              <div class="card-number">03</div>
              <h3>HÉRITAGE</h3>
              <p>« Le voyage, c'est aussi la fin. »</p>
              <p class="card-meaning">Construire des systèmes durables qui survivent à leur créateur.</p>
            </div>
          </div>

          <div class="legacy-quote">
            <p>« Les héros sont façonnés par le chemin qu'ils choisissent, pas par les pouvoirs qu'on leur accorde. »</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CONTACT : Avengers Initiative -->
    <section id="initiative" class="im-section initiative-section" aria-labelledby="initiative-title">
      <div class="initiative-bg" aria-hidden="true">
        <div class="bg-reactor"></div>
      </div>

      <div class="container">
        <div class="avengers-logo">
          <span>A</span>
        </div>

        <h2 id="initiative-title" class="initiative-title">
          <span class="pre">INITIATIVE</span>
          <span class="main">AVENGERS</span>
        </h2>

        <p class="initiative-text">
          Vous avez été évalué. Vous avez été jugé... digne.<br>
          Prêt à rejoindre l'équipe ?
        </p>

        <router-link to="/contact" class="initiative-btn">
          <span class="btn-reactor"></span>
          <span class="btn-text">REJOINDRE L'ÉQUIPE</span>
        </router-link>

        <div class="initiative-footer" aria-hidden="true">
          <span>// S.H.I.E.L.D. CLASSIFIÉ // NIVEAU D'HABILITATION: {{ clearanceLevel }}</span>
        </div>
      </div>
    </section>

    <!-- JARVIS Status -->
    <div class="jarvis-status" aria-hidden="true">
      <div class="status-reactor"></div>
      <div class="status-info">
        <span class="status-label">J.A.R.V.I.S.</span>
        <span class="status-msg">{{ jarvisStatus }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const activeSuit = ref(0);
const powerLevel = ref(100);
const clearanceLevel = ref(7);
const jarvisStatus = ref('Systèmes nominaux');

const suitStats = [
  { icon: '⚡', label: 'PUISSANCE', value: 100 },
  { icon: '🛡️', label: 'BLINDAGE', value: 95 },
  { icon: '🎯', label: 'ARMES', value: 88 },
  { icon: '🚀', label: 'VOL', value: 92 }
];

const profileData = [
  { key: 'DÉSIGNATION', value: 'Développeur Full-Stack', class: '' },
  { key: 'SPÉCIALISATION', value: 'Intégration IA & Automatisation', class: '' },
  { key: 'AFFILIATION', value: 'GL Digital Lab', class: 'value--gold' },
  { key: 'LOCALISATION', value: 'Limoges, France', class: '' },
  { key: 'HABILITATION', value: 'Niveau 7', class: 'value--blue' },
  { key: 'STATUT', value: 'OPÉRATIONNEL', class: 'value--green' }
];

const suits = [
  {
    mark: 'MK I',
    name: 'ARMURE BACKEND',
    desc: 'La fondation. Puissance brute et architecture élégante.',
    specs: [
      { icon: '⚙️', name: 'Symfony 8', level: 95 },
      { icon: '🐘', name: 'PHP 8.3+', level: 95 },
      { icon: '🗄️', name: 'PostgreSQL', level: 90 },
      { icon: '🔌', name: 'API Platform', level: 88 }
    ],
    tech: ['Clean Architecture', 'DDD', 'SOLID', 'REST/GraphQL']
  },
  {
    mark: 'MK II',
    name: 'ARMURE FRONTEND',
    desc: 'Élégante. Rapide. Responsive. La vitrine publique.',
    specs: [
      { icon: '💚', name: 'Vue 3', level: 90 },
      { icon: '🎨', name: 'Three.js', level: 85 },
      { icon: '📘', name: 'TypeScript', level: 82 },
      { icon: '⚡', name: 'Vite', level: 88 }
    ],
    tech: ['Composition API', 'WebGL', 'GSAP', 'Tailwind']
  },
  {
    mark: 'MK III',
    name: 'INTERFACE IA',
    desc: 'Réseaux neuronaux. Traitement local. Zéro dépendance.',
    specs: [
      { icon: '🧠', name: 'Ollama', level: 85 },
      { icon: '🔄', name: 'n8n', level: 88 },
      { icon: '📚', name: 'ChromaDB', level: 78 },
      { icon: '🤖', name: 'Systèmes RAG', level: 80 }
    ],
    tech: ['LLM Local', 'Embeddings', 'Agents', 'Workflows']
  },
  {
    mark: 'MK IV',
    name: 'ARMURE DÉPLOIEMENT',
    desc: 'Infrastructure. Conteneurs. Livraison continue.',
    specs: [
      { icon: '🐳', name: 'Docker', level: 85 },
      { icon: '🔄', name: 'CI/CD', level: 82 },
      { icon: '📊', name: 'Monitoring', level: 78 },
      { icon: '🔒', name: 'Sécurité', level: 85 }
    ],
    tech: ['GitHub Actions', 'Nginx', 'SSL', 'Backups']
  }
];

const projects = [
  { id: 'MK-001', name: 'ARKADIA', icon: '🛡️', desc: 'Cluster gaming - 150+ utilisateurs', specs: ['Nitrado', 'Discord', 'Webhooks'], status: 'active', power: 100 },
  { id: 'MK-002', name: 'GL DIGITAL LAB', icon: '⚡', desc: 'Studio dev & services IA', specs: ['Symfony', 'Vue 3', 'Docker'], status: 'active', power: 95 },
  { id: 'MK-003', name: 'NEURAL OPS', icon: '🧠', desc: 'Workflows IA locaux', specs: ['n8n', 'Ollama', 'RAG'], status: 'active', power: 88 },
  { id: 'MK-004', name: 'PORTFOLIO', icon: '🌐', desc: 'Vitrine multi-univers', specs: ['Vue 3', 'Three.js', 'Vite'], status: 'active', power: 92 },
  { id: 'MK-005', name: 'OBSIDIAN RAG', icon: '📚', desc: 'Système de base de connaissances', specs: ['ChromaDB', 'MCP', 'Sémantique'], status: 'dev', power: 75 },
  { id: 'MK-006', name: 'DISCORD BOT', icon: '🤖', desc: 'Automatisation communauté', specs: ['Node.js', 'API', 'Événements'], status: 'standby', power: 60 }
];

const scrollTo = (id) => {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
};

const jarvisMessages = [
  'Systèmes nominaux',
  'Tous les systèmes opérationnels',
  'Niveaux de puissance stables',
  'Analyse des menaces en cours...',
  'Réseau sécurisé',
  'Prêt pour le déploiement'
];

let jarvisInterval = null;
let powerInterval = null;

onMounted(() => {
  jarvisInterval = setInterval(() => {
    jarvisStatus.value = jarvisMessages[Math.floor(Math.random() * jarvisMessages.length)];
  }, 4000);

  powerInterval = setInterval(() => {
    powerLevel.value = 95 + Math.floor(Math.random() * 6);
  }, 2000);
});

onUnmounted(() => {
  clearInterval(jarvisInterval);
  clearInterval(powerInterval);
});
</script>

<style scoped>
/* =============================================================================
   IRON MAN PAGE - Variables
   ============================================================================= */
.ironman-page {
  --gold: #ffd700;
  --gold-dark: #b8860b;
  --red: #dc143c;
  --red-dark: #8b0000;
  --blue: #00bfff;
  --blue-glow: rgba(0, 191, 255, 0.5);
  --arc-blue: #5dade2;
  --bg: #0a0a0f;
  --bg-dark: #050508;
  --surface: rgba(20, 20, 30, 0.9);
  
  background: var(--bg);
  color: #e0e0e0;
  min-height: 100vh;
  font-family: 'Rajdhani', 'Orbitron', sans-serif;
  overflow-x: hidden;
}

/* =============================================================================
   JARVIS HUD OVERLAY
   ============================================================================= */
.jarvis-hud {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 50;
}

.hud-circle {
  position: absolute;
  border: 1px solid rgba(0, 191, 255, 0.2);
  border-radius: 50%;
  animation: hudRotate 20s linear infinite;
}

.hud-circle--1 {
  width: 300px; height: 300px;
  top: -100px; right: -100px;
}

.hud-circle--2 {
  width: 400px; height: 400px;
  bottom: -150px; left: -150px;
  animation-direction: reverse;
  animation-duration: 30s;
}

.hud-circle--3 {
  width: 200px; height: 200px;
  top: 50%; left: 5%;
  transform: translateY(-50%);
  animation-duration: 15s;
}

@keyframes hudRotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.hud-corner {
  position: absolute;
  width: 60px; height: 60px;
  border: 2px solid var(--blue);
  opacity: 0.3;
}

.hud-corner--tl { top: 1rem; left: 1rem; border-right: none; border-bottom: none; }
.hud-corner--tr { top: 1rem; right: 1rem; border-left: none; border-bottom: none; }
.hud-corner--bl { bottom: 70px; left: 1rem; border-right: none; border-top: none; }
.hud-corner--br { bottom: 70px; right: 1rem; border-left: none; border-top: none; }

.hud-scanline {
  position: absolute;
  left: 0; right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--blue), transparent);
  animation: scanDown 4s linear infinite;
  opacity: 0.5;
}

@keyframes scanDown {
  0% { top: 0; opacity: 0; }
  10% { opacity: 0.5; }
  90% { opacity: 0.5; }
  100% { top: 100%; opacity: 0; }
}

/* =============================================================================
   HERO SECTION
   ============================================================================= */
.im-hero {
  min-height: 100vh;
  display: flex;
  align-items: center;
  position: relative;
  padding: 6rem 2rem;
}

.hero-bg {
  position: absolute;
  inset: 0;
  overflow: hidden;
}

/* Arc Reactor */
.arc-reactor {
  position: absolute;
  top: 50%;
  right: 10%;
  transform: translateY(-50%);
  width: 300px;
  height: 300px;
}

.reactor-core {
  position: absolute;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  width: 60px; height: 60px;
  background: radial-gradient(circle, #fff 0%, var(--arc-blue) 50%, transparent 70%);
  border-radius: 50%;
  box-shadow: 0 0 60px var(--arc-blue), 0 0 100px var(--arc-blue);
  animation: coreGlow 2s ease-in-out infinite;
}

@keyframes coreGlow {
  0%, 100% { box-shadow: 0 0 60px var(--arc-blue), 0 0 100px var(--arc-blue); }
  50% { box-shadow: 0 0 80px var(--arc-blue), 0 0 140px var(--arc-blue); }
}

.reactor-ring {
  position: absolute;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  border: 3px solid var(--arc-blue);
  border-radius: 50%;
  opacity: 0.6;
}

.reactor-ring--1 { width: 100px; height: 100px; animation: ringPulse 3s ease-in-out infinite; }
.reactor-ring--2 { width: 160px; height: 160px; animation: ringPulse 3s ease-in-out infinite 0.5s; }
.reactor-ring--3 { width: 220px; height: 220px; animation: ringPulse 3s ease-in-out infinite 1s; }

@keyframes ringPulse {
  0%, 100% { opacity: 0.6; transform: translate(-50%, -50%) scale(1); }
  50% { opacity: 0.3; transform: translate(-50%, -50%) scale(1.05); }
}

.reactor-glow {
  position: absolute;
  inset: -50px;
  background: radial-gradient(circle, rgba(93, 173, 226, 0.2) 0%, transparent 70%);
  animation: glowPulse 4s ease-in-out infinite;
}

@keyframes glowPulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.tech-grid {
  position: absolute;
  inset: 0;
  background-image: 
    linear-gradient(rgba(0, 191, 255, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 191, 255, 0.03) 1px, transparent 1px);
  background-size: 40px 40px;
}

.container {
  position: relative;
  z-index: 10;
  max-width: 1100px;
  margin: 0 auto;
}

/* Stark Badge */
.stark-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1.5rem;
  background: rgba(255, 215, 0, 0.1);
  border: 1px solid var(--gold);
  margin-bottom: 2rem;
}

.badge-reactor {
  width: 20px; height: 20px;
  background: radial-gradient(circle, var(--arc-blue) 30%, transparent 70%);
  border-radius: 50%;
  box-shadow: 0 0 10px var(--arc-blue);
}

.badge-text {
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.3em;
  color: var(--gold);
}

/* Hero Title */
.hero-title { margin-bottom: 2rem; }

.title-pre {
  display: block;
  font-size: 1.25rem;
  color: rgba(224, 224, 224, 0.5);
  letter-spacing: 0.3em;
}

.title-main {
  display: block;
  font-size: clamp(3rem, 10vw, 7rem);
  font-weight: 900;
  background: linear-gradient(135deg, var(--red) 0%, var(--gold) 50%, var(--red) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: none;
  filter: drop-shadow(0 0 30px rgba(220, 20, 60, 0.3));
}

.title-sub {
  display: block;
  font-size: 1rem;
  color: var(--gold);
  margin-top: 0.5rem;
  font-style: italic;
}

.hero-quote {
  font-size: 1.1rem;
  font-style: italic;
  color: rgba(224, 224, 224, 0.6);
  max-width: 400px;
  margin-bottom: 2rem;
}

/* Suit Stats */
.suit-stats {
  display: flex;
  gap: 2rem;
  margin-bottom: 2rem;
}

.stat-item {
  text-align: center;
}

.stat-ring {
  position: relative;
  width: 80px;
  height: 80px;
  margin: 0 auto 0.5rem;
}

.stat-ring svg {
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}

.ring-bg {
  fill: none;
  stroke: rgba(255, 255, 255, 0.1);
  stroke-width: 4;
}

.ring-fill {
  fill: none;
  stroke: var(--arc-blue);
  stroke-width: 4;
  stroke-linecap: round;
  transition: stroke-dashoffset 1s ease;
}

.stat-icon {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 1.5rem;
}

.stat-val {
  display: block;
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--arc-blue);
}

.stat-label {
  font-size: 0.65rem;
  color: rgba(224, 224, 224, 0.5);
  letter-spacing: 0.1em;
}

/* Buttons */
.jarvis-btn, .initiative-btn {
  display: inline-flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 2rem;
  background: transparent;
  border: 2px solid var(--gold);
  color: var(--gold);
  font-family: inherit;
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: 0.15em;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  position: relative;
  overflow: hidden;
}

.btn-reactor {
  width: 16px;
  height: 16px;
  background: radial-gradient(circle, var(--arc-blue) 40%, transparent 70%);
  border-radius: 50%;
  box-shadow: 0 0 15px var(--arc-blue);
  animation: reactorBlink 2s ease-in-out infinite;
}

@keyframes reactorBlink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}

.jarvis-btn:hover, .initiative-btn:hover {
  background: var(--gold);
  color: var(--bg);
  box-shadow: 0 0 40px rgba(255, 215, 0, 0.4);
}

/* =============================================================================
   SECTIONS COMMON
   ============================================================================= */
.im-section {
  min-height: 100vh;
  padding: 6rem 2rem;
  position: relative;
}

.section-header {
  text-align: center;
  margin-bottom: 4rem;
}

.header-icon {
  display: block;
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}

.section-header h2 {
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 900;
  color: var(--gold);
  letter-spacing: 0.2em;
  text-shadow: 0 0 30px rgba(255, 215, 0, 0.3);
}

.section-sub {
  font-size: 0.9rem;
  color: rgba(224, 224, 224, 0.5);
  margin-top: 0.5rem;
}

/* =============================================================================
   WORKSHOP SECTION
   ============================================================================= */
.workshop-section {
  background: linear-gradient(180deg, var(--bg) 0%, var(--bg-dark) 100%);
}

.workshop-content {
  max-width: 700px;
  margin: 0 auto;
}

/* Hologram Card */
.hologram-card {
  background: var(--surface);
  border: 1px solid var(--blue);
  position: relative;
  overflow: hidden;
}

.hologram-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(0, 191, 255, 0.1), transparent);
  animation: holoScan 3s linear infinite;
}

@keyframes holoScan {
  to { left: 100%; }
}

.holo-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: rgba(0, 191, 255, 0.05);
  border-bottom: 1px solid rgba(0, 191, 255, 0.2);
}

.holo-avatar {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, var(--red), var(--gold));
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.avatar-text {
  font-size: 1.5rem;
  font-weight: 900;
  color: white;
  z-index: 1;
}

.avatar-scan {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background: var(--arc-blue);
  animation: avatarScan 2s linear infinite;
}

@keyframes avatarScan {
  0% { top: 0; }
  100% { top: 100%; }
}

.holo-info h3 {
  font-size: 1.25rem;
  color: var(--gold);
  margin-bottom: 0.25rem;
}

.holo-alias {
  font-size: 0.8rem;
  color: var(--blue);
}

.holo-status {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  color: #00ff00;
}

.status-dot {
  width: 8px;
  height: 8px;
  background: #00ff00;
  border-radius: 50%;
  box-shadow: 0 0 10px #00ff00;
  animation: statusBlink 2s ease-in-out infinite;
}

@keyframes statusBlink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.holo-body {
  padding: 1.5rem;
}

.data-line {
  display: flex;
  justify-content: space-between;
  padding: 0.75rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  font-size: 0.9rem;
}

.data-key {
  color: rgba(224, 224, 224, 0.5);
  font-weight: 600;
}

.data-value {
  color: #e0e0e0;
}

.value--gold { color: var(--gold); }
.value--blue { color: var(--blue); }
.value--green { color: #00ff00; }

.holo-footer {
  padding: 1.5rem;
  background: rgba(0, 191, 255, 0.05);
  border-top: 1px solid rgba(0, 191, 255, 0.2);
}

.power-level {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.power-label {
  font-size: 0.7rem;
  color: rgba(224, 224, 224, 0.5);
  letter-spacing: 0.1em;
}

.power-bar {
  flex: 1;
  height: 8px;
  background: rgba(255, 255, 255, 0.1);
  overflow: hidden;
}

.power-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--arc-blue), var(--gold));
  transition: width 0.5s ease;
}

.power-value {
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--arc-blue);
}

/* Stark Quote */
.stark-quote {
  text-align: center;
  margin-top: 2rem;
}

.stark-quote p {
  font-size: 1.25rem;
  font-style: italic;
  color: rgba(224, 224, 224, 0.6);
}

.quote-translation {
  font-size: 1rem !important;
  color: var(--gold) !important;
  margin-top: 0.5rem;
}

/* =============================================================================
   ARMORY SECTION
   ============================================================================= */
.armory-section {
  background: var(--bg-dark);
}

/* Suit Selector */
.suit-selector {
  margin-bottom: 3rem;
}

.selector-track {
  display: flex;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.suit-btn {
  padding: 1rem 1.5rem;
  background: transparent;
  border: 1px solid rgba(255, 215, 0, 0.3);
  color: rgba(224, 224, 224, 0.6);
  font-family: inherit;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
}

.suit-btn:hover {
  border-color: var(--gold);
  color: var(--gold);
}

.suit-btn.active {
  background: rgba(255, 215, 0, 0.1);
  border-color: var(--gold);
  color: var(--gold);
  box-shadow: 0 0 20px rgba(255, 215, 0, 0.2);
}

.suit-mark {
  font-size: 1.25rem;
  font-weight: 900;
}

.suit-name {
  font-size: 0.65rem;
  letter-spacing: 0.1em;
}

/* Suit Display */
.suit-display {
  display: grid;
  grid-template-columns: 1fr 1.5fr;
  gap: 3rem;
  align-items: start;
}

/* Schematic */
.suit-schematic {
  position: relative;
  padding: 2rem;
}

.schematic-body {
  position: relative;
  width: 150px;
  height: 300px;
  margin: 0 auto;
}

.schematic-head {
  width: 50px;
  height: 60px;
  background: linear-gradient(180deg, var(--red) 0%, var(--gold) 100%);
  border-radius: 25px 25px 15px 15px;
  margin: 0 auto;
  position: relative;
}

.schematic-head::after {
  content: '';
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  width: 30px;
  height: 8px;
  background: var(--arc-blue);
  box-shadow: 0 0 10px var(--arc-blue);
}

.schematic-torso {
  width: 80px;
  height: 100px;
  background: linear-gradient(180deg, var(--red) 0%, var(--red-dark) 100%);
  margin: 5px auto 0;
  position: relative;
  clip-path: polygon(10% 0%, 90% 0%, 100% 100%, 0% 100%);
}

.schematic-reactor {
  position: absolute;
  top: 30%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 25px;
  height: 25px;
  background: radial-gradient(circle, #fff 20%, var(--arc-blue) 50%, transparent 70%);
  border-radius: 50%;
  box-shadow: 0 0 20px var(--arc-blue);
  animation: schematicGlow 2s ease-in-out infinite;
}

@keyframes schematicGlow {
  0%, 100% { box-shadow: 0 0 20px var(--arc-blue); }
  50% { box-shadow: 0 0 40px var(--arc-blue); }
}

.schematic-arm {
  position: absolute;
  width: 25px;
  height: 90px;
  background: linear-gradient(180deg, var(--red) 0%, var(--gold) 100%);
  top: 65px;
  border-radius: 10px;
}

.schematic-arm--left { left: 0; transform: rotate(15deg); }
.schematic-arm--right { right: 0; transform: rotate(-15deg); }

.schematic-leg {
  position: absolute;
  width: 30px;
  height: 120px;
  background: linear-gradient(180deg, var(--red) 0%, var(--gold) 100%);
  bottom: 0;
  border-radius: 10px;
}

.schematic-leg--left { left: 30px; }
.schematic-leg--right { right: 30px; }

.schematic-labels {
  position: absolute;
  inset: 0;
  font-size: 0.6rem;
  color: var(--blue);
  letter-spacing: 0.05em;
}

.label {
  position: absolute;
  padding: 0.25rem 0.5rem;
  background: rgba(0, 191, 255, 0.1);
  border-left: 2px solid var(--blue);
  white-space: nowrap;
}

.label--head { top: 20px; right: -20px; }
.label--chest { top: 100px; left: -30px; }
.label--arms { top: 140px; right: -30px; }
.label--legs { bottom: 50px; left: -20px; }

/* Suit Specs */
.suit-specs {
  background: var(--surface);
  border: 1px solid rgba(255, 215, 0, 0.2);
  padding: 2rem;
}

.suit-specs h3 {
  font-size: 1.5rem;
  color: var(--gold);
  margin-bottom: 0.5rem;
}

.suit-desc {
  color: rgba(224, 224, 224, 0.6);
  margin-bottom: 1.5rem;
}

.specs-grid {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.spec-item {
  display: grid;
  grid-template-columns: 30px 120px 1fr;
  align-items: center;
  gap: 1rem;
}

.spec-icon {
  font-size: 1.25rem;
}

.spec-name {
  font-size: 0.85rem;
  color: rgba(224, 224, 224, 0.8);
}

.spec-bar {
  height: 6px;
  background: rgba(255, 255, 255, 0.1);
  overflow: hidden;
}

.spec-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--arc-blue), var(--gold));
  transition: width 0.5s ease;
}

.suit-tech {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tech-tag {
  padding: 0.25rem 0.75rem;
  background: rgba(0, 191, 255, 0.1);
  border: 1px solid rgba(0, 191, 255, 0.3);
  font-size: 0.7rem;
  color: var(--blue);
}

/* =============================================================================
   LEGION SECTION
   ============================================================================= */
.legion-section {
  background: linear-gradient(180deg, var(--bg-dark) 0%, var(--bg) 100%);
}

.legion-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 1.5rem;
}

.legion-card {
  background: var(--surface);
  border: 1px solid rgba(0, 191, 255, 0.2);
  padding: 1.5rem;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
}

.legion-card:hover {
  border-color: var(--gold);
  transform: translateY(-5px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.card--active { border-left: 3px solid #00ff00; }
.card--dev { border-left: 3px solid #ff9800; }
.card--standby { border-left: 3px solid #9e9e9e; }

.card-hud {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
  font-size: 0.7rem;
}

.hud-id {
  color: var(--blue);
  font-family: 'JetBrains Mono', monospace;
}

.hud-status {
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.card--active .hud-status { color: #00ff00; }
.card--dev .hud-status { color: #ff9800; }
.card--standby .hud-status { color: #9e9e9e; }

.card-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.card-content h3 {
  font-size: 1.25rem;
  color: var(--gold);
  margin-bottom: 0.5rem;
}

.card-content p {
  font-size: 0.9rem;
  color: rgba(224, 224, 224, 0.6);
  margin-bottom: 1rem;
}

.card-specs {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.card-specs .spec {
  padding: 0.2rem 0.5rem;
  background: rgba(255, 215, 0, 0.1);
  font-size: 0.65rem;
  color: var(--gold);
}

.card-power {
  display: flex;
  align-items: center;
}

.power-indicator {
  width: 100%;
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  position: relative;
  overflow: hidden;
}

.power-indicator::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: var(--power);
  background: linear-gradient(90deg, var(--arc-blue), var(--gold));
}

.power-indicator span {
  position: absolute;
  right: 0;
  top: -20px;
  font-size: 0.7rem;
  color: var(--arc-blue);
}

/* =============================================================================
   VISION SECTION
   ============================================================================= */
.vision-section {
  background: var(--bg);
}

.vision-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
}

.vision-card {
  background: var(--surface);
  border: 1px solid rgba(255, 215, 0, 0.2);
  padding: 2rem;
  position: relative;
}

.card-number {
  position: absolute;
  top: 1rem;
  right: 1rem;
  font-size: 3rem;
  font-weight: 900;
  color: rgba(255, 215, 0, 0.1);
}

.vision-card h3 {
  font-size: 1.25rem;
  color: var(--gold);
  margin-bottom: 1rem;
  letter-spacing: 0.1em;
}

.vision-card p {
  font-size: 0.95rem;
  font-style: italic;
  color: rgba(224, 224, 224, 0.6);
  margin-bottom: 1rem;
}

.card-meaning {
  font-style: normal !important;
  color: var(--blue) !important;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.legacy-quote {
  text-align: center;
  font-size: 1.5rem;
  font-style: italic;
  color: var(--gold);
  max-width: 600px;
  margin: 0 auto;
}

/* =============================================================================
   INITIATIVE SECTION
   ============================================================================= */
.initiative-section {
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  position: relative;
  min-height: 100vh;
}

.initiative-bg {
  position: absolute;
  inset: 0;
}

.bg-reactor {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, rgba(93, 173, 226, 0.1) 0%, transparent 70%);
  animation: bgPulse 4s ease-in-out infinite;
}

@keyframes bgPulse {
  0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.5; }
  50% { transform: translate(-50%, -50%) scale(1.2); opacity: 0.3; }
}

.avengers-logo {
  width: 80px;
  height: 80px;
  margin: 0 auto 2rem;
  background: linear-gradient(135deg, var(--red), var(--gold));
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  font-weight: 900;
  color: white;
  clip-path: polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%);
}

.initiative-title {
  margin-bottom: 1rem;
}

.initiative-title .pre {
  display: block;
  font-size: 1rem;
  color: rgba(224, 224, 224, 0.5);
  letter-spacing: 0.3em;
}

.initiative-title .main {
  display: block;
  font-size: clamp(3rem, 8vw, 5rem);
  font-weight: 900;
  color: var(--gold);
  text-shadow: 0 0 50px rgba(255, 215, 0, 0.3);
}

.initiative-text {
  font-size: 1.1rem;
  color: rgba(224, 224, 224, 0.6);
  margin-bottom: 2rem;
  line-height: 1.8;
}

.initiative-footer {
  margin-top: 3rem;
  font-size: 0.7rem;
  color: rgba(0, 191, 255, 0.4);
  font-family: 'JetBrains Mono', monospace;
}

/* =============================================================================
   JARVIS STATUS
   ============================================================================= */
.jarvis-status {
  position: fixed;
  bottom: 70px;
  left: 1rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 1rem;
  background: rgba(0, 0, 0, 0.8);
  border: 1px solid var(--blue);
  z-index: 50;
}

.status-reactor {
  width: 12px;
  height: 12px;
  background: radial-gradient(circle, var(--arc-blue) 40%, transparent 70%);
  border-radius: 50%;
  box-shadow: 0 0 10px var(--arc-blue);
  animation: reactorBlink 2s ease-in-out infinite;
}

.status-info {
  display: flex;
  flex-direction: column;
}

.status-label {
  font-size: 0.6rem;
  color: var(--blue);
  letter-spacing: 0.1em;
}

.status-msg {
  font-size: 0.7rem;
  color: rgba(224, 224, 224, 0.7);
}

/* =============================================================================
   RESPONSIVE
   ============================================================================= */
@media (max-width: 1024px) {
  .suit-display {
    grid-template-columns: 1fr;
  }
  
  .suit-schematic {
    order: 2;
  }
  
  .arc-reactor {
    display: none;
  }
}

@media (max-width: 768px) {
  .suit-stats {
    flex-wrap: wrap;
    justify-content: center;
  }
  
  .stat-item {
    flex: 0 0 45%;
  }
  
  .holo-header {
    flex-wrap: wrap;
  }
  
  .holo-status {
    width: 100%;
    margin-top: 1rem;
    margin-left: 0;
  }
}

/* =============================================================================
   ACCESSIBILITY
   ============================================================================= */
@media (prefers-reduced-motion: reduce) {
  .hud-circle,
  .hud-scanline,
  .reactor-core,
  .reactor-ring,
  .reactor-glow,
  .hologram-card::before,
  .avatar-scan,
  .status-dot,
  .btn-reactor,
  .bg-reactor,
  .schematic-reactor {
    animation: none !important;
  }
}
</style>
