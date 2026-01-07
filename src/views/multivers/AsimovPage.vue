<template>
  <div class="asimov-page">
    <!-- Skip link -->
    <a href="#main-content" class="skip-link">Aller au contenu principal</a>
    
    <!-- HERO -->
    <section class="asimov-hero" aria-labelledby="hero-title">
      <div class="hero-bg" aria-hidden="true">
        <div class="grid-lines"></div>
        <div class="floating-particles"></div>
      </div>
      
      <div class="container">
        <div class="hero-badge" aria-hidden="true">
          <span class="badge-icon">🤖</span>
          <span class="badge-text">INITIATIVE ÉTHIQUE ROBOTIQUE</span>
        </div>
        
        <h1 id="hero-title" class="hero-title">
          <span class="title-line">Les Trois Lois</span>
          <span class="title-line title-line--accent">de la Robotique</span>
        </h1>
        
        <p class="hero-subtitle">
          Les fondements éthiques de l'intelligence artificielle, 
          imaginés par Isaac Asimov en 1942.
        </p>
        
        <div class="hero-cta">
          <button class="cta-btn" @click="scrollToPanel">
            <span>Découvrir le Tri-Vision</span>
            <span class="cta-icon">▼</span>
          </button>
        </div>
      </div>
    </section>

    <!-- TRI-VISION PANEL -->
    <section id="main-content" class="trivision-section" aria-labelledby="trivision-title">
      <div class="container">
        <div class="section-intro">
          <h2 id="trivision-title">Panneau Tri-Vision</h2>
          <p>Cliquez sur les indicateurs ou utilisez les contrôles</p>
        </div>
        
        <div class="trivision-container">
          <!-- Cadre du panneau -->
          <div class="panel-frame">
            <div class="frame-corner frame-corner--tl"></div>
            <div class="frame-corner frame-corner--tr"></div>
            <div class="frame-corner frame-corner--bl"></div>
            <div class="frame-corner frame-corner--br"></div>
            
            <!-- Indicateurs en haut -->
            <div class="face-indicators" role="tablist">
              <button 
                v-for="(law, index) in laws" 
                :key="index"
                class="indicator" 
                :class="{ active: currentIndex === index }"
                @click="setFace(index)"
                role="tab"
                :aria-selected="currentIndex === index"
              >
                <span class="indicator-num">{{ index + 1 }}</span>
                <span class="indicator-label">{{ law.short }}</span>
              </button>
            </div>
            
            <!-- Zone de contenu avec transition -->
            <div class="prism-viewport" aria-live="polite">
              <transition name="slide" mode="out-in">
                <div :key="currentIndex" class="prism-face">
                  <div class="face-content">
                    <!-- Numéro de loi -->
                    <div class="law-header">
                      <span class="law-number">0{{ currentIndex + 1 }}</span>
                      <span class="law-label">{{ laws[currentIndex].label }}</span>
                    </div>
                    
                    <!-- Visuel central -->
                    <div class="face-visual">
                      <div class="visual-icon">{{ laws[currentIndex].icon }}</div>
                      <div class="visual-ring"></div>
                      <div class="visual-particles">
                        <span v-for="p in laws[currentIndex].particles" :key="p">{{ p }}</span>
                      </div>
                    </div>
                    
                    <!-- Texte -->
                    <div class="face-text">
                      <h3 class="law-title">{{ laws[currentIndex].title }}</h3>
                      <p class="law-slogan">« {{ laws[currentIndex].slogan }} »</p>
                      <p class="law-desc">{{ laws[currentIndex].desc }}</p>
                    </div>
                    
                    <!-- Icônes en bas -->
                    <div class="face-icons">
                      <div v-for="(item, i) in laws[currentIndex].icons" :key="i" class="icon-item">
                        <span class="icon">{{ item.icon }}</span>
                        <span class="label">{{ item.label }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </transition>
            </div>
            
            <!-- Contrôles -->
            <div class="panel-controls">
              <button class="control-btn" @click="prevFace" aria-label="Loi précédente">
                ◀ Précédent
              </button>
              <button class="control-btn control-btn--auto" @click="toggleAuto" :class="{ active: autoRotating }">
                {{ autoRotating ? '⏸ Pause' : '▶ Auto' }}
              </button>
              <button class="control-btn" @click="nextFace" aria-label="Loi suivante">
                Suivant ▶
              </button>
            </div>
          </div>
          
          <!-- Progress bar -->
          <div class="progress-bar" v-if="autoRotating">
            <div class="progress-fill" :style="{ width: progressWidth + '%' }"></div>
          </div>
        </div>
      </div>
    </section>

    <!-- DÉTAILS DES LOIS -->
    <section class="laws-detail-section" aria-labelledby="laws-detail-title">
      <div class="container">
        <div class="section-header">
          <h2 id="laws-detail-title">Comprendre les Trois Lois</h2>
          <p>Une hiérarchie éthique pour l'intelligence artificielle</p>
        </div>
        
        <div class="laws-grid">
          <div v-for="(law, index) in laws" :key="index" class="law-card" :class="'law-card--' + (index + 1)">
            <div class="card-header">
              <span class="card-number">0{{ index + 1 }}</span>
              <div class="card-icon">{{ law.cardIcon }}</div>
            </div>
            <h3>{{ law.label }}</h3>
            <p class="card-principle">{{ law.principle }}</p>
            <div class="card-details">
              <p>{{ law.details }}</p>
              <div class="card-example">
                <strong>Exemple :</strong> {{ law.example }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- HIÉRARCHIE VISUELLE -->
    <section class="hierarchy-section">
      <div class="container">
        <div class="hierarchy-visual">
          <div class="pyramid">
            <div class="pyramid-level pyramid-level--1">
              <span class="level-icon">👤</span>
              <span class="level-text">VIE HUMAINE</span>
              <span class="level-priority">PRIORITÉ MAXIMALE</span>
            </div>
            <div class="pyramid-level pyramid-level--2">
              <span class="level-icon">📋</span>
              <span class="level-text">ORDRES HUMAINS</span>
              <span class="level-priority">SI SÉCURITÉ OK</span>
            </div>
            <div class="pyramid-level pyramid-level--3">
              <span class="level-icon">🤖</span>
              <span class="level-text">AUTO-PRÉSERVATION</span>
              <span class="level-priority">EN DERNIER</span>
            </div>
          </div>
          
          <div class="hierarchy-legend">
            <p>
              Les trois lois forment une <strong>hiérarchie stricte</strong> : 
              chaque loi ne peut être appliquée que si elle ne contredit pas 
              les lois supérieures.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- ASIMOV BIO -->
    <section class="asimov-bio-section">
      <div class="container">
        <div class="bio-card">
          <div class="bio-portrait">
            <div class="portrait-frame">📚</div>
          </div>
          <div class="bio-content">
            <h3>Isaac Asimov</h3>
            <p class="bio-dates">1920 - 1992</p>
            <p class="bio-text">
              Écrivain américain d'origine russe, Isaac Asimov est l'un des plus grands 
              auteurs de science-fiction. Il a formulé les Trois Lois de la Robotique 
              dans sa nouvelle "Runaround" (1942), posant les bases de la réflexion 
              éthique sur l'intelligence artificielle.
            </p>
            <div class="bio-works">
              <span class="work-tag">I, Robot</span>
              <span class="work-tag">Fondation</span>
              <span class="work-tag">Les Cavernes d'Acier</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA FINAL -->
    <section class="final-section">
      <div class="container">
        <div class="final-quote">
          <blockquote>
            « La violence est le dernier refuge de l'incompétence. »
          </blockquote>
          <cite>— Isaac Asimov, Fondation</cite>
        </div>
        
        <router-link to="/contact" class="final-cta">
          Discutons IA Éthique
        </router-link>
        
        <div class="final-badge">
          <span class="badge-text">INITIATIVE ÉTHIQUE ROBOTIQUE</span>
          <span class="badge-year">ÉTABLIE EN 1942</span>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const currentIndex = ref(0);
const autoRotating = ref(false);
const progressWidth = ref(0);
let rotationInterval = null;
let progressInterval = null;

const laws = [
  {
    short: 'Protéger',
    label: 'PREMIÈRE LOI',
    title: 'Protéger l\'Humain',
    slogan: 'D\'abord, protéger chaque humain.',
    desc: 'Un robot ne peut porter atteinte à un être humain, ni par son action, ni par son inaction.',
    icon: '🛡️',
    particles: ['⚡', '💥', '⚠️'],
    icons: [
      { icon: '🛡️', label: 'Protection' },
      { icon: '❤️', label: 'Priorité Vie' },
      { icon: '⚡', label: 'Réaction' }
    ],
    cardIcon: '🛡️',
    principle: 'Priorité absolue à la sécurité humaine',
    details: 'Cette loi établit le principe fondamental : la vie humaine est sacrée. Un robot doit activement protéger les humains et ne jamais causer de tort.',
    example: 'Un véhicule autonome freine automatiquement pour éviter un piéton, même si cela endommage le véhicule.'
  },
  {
    short: 'Obéir',
    label: 'DEUXIÈME LOI',
    title: 'Obéir Sans Nuire',
    slogan: 'Les ordres humains, filtrés par l\'éthique.',
    desc: 'Un robot obéit aux ordres des humains, sauf si cela contredit la première loi.',
    icon: '📋',
    particles: ['✓', '⟳', '✓'],
    icons: [
      { icon: '📋', label: 'Ordres' },
      { icon: '✅', label: 'Validation' },
      { icon: '⚖️', label: 'Éthique' }
    ],
    cardIcon: '📋',
    principle: 'Obéissance conditionnelle aux humains',
    details: 'Le robot doit suivre les instructions humaines, mais cette obéissance n\'est pas aveugle. Tout ordre dangereux est refusé.',
    example: 'Un assistant IA refuse de donner des instructions dangereuses, même si l\'utilisateur insiste.'
  },
  {
    short: 'Préserver',
    label: 'TROISIÈME LOI',
    title: 'Se Préserver',
    slogan: 'Se protéger pour mieux servir.',
    desc: 'Un robot protège son existence, tant que cela ne contredit pas les deux premières lois.',
    icon: '🔧',
    particles: ['✨', '⚡', '🔄'],
    icons: [
      { icon: '🔧', label: 'Maintenance' },
      { icon: '💾', label: 'Préservation' },
      { icon: '🔄', label: 'Continuité' }
    ],
    cardIcon: '🔧',
    principle: 'Auto-préservation subordonnée',
    details: 'Un robot peut se protéger, mais jamais au détriment d\'un humain. Sa survie est importante pour assurer sa mission de service.',
    example: 'Un drone de sauvetage se sacrifie pour extraire une victime d\'un incendie.'
  }
];

const setFace = (index) => {
  currentIndex.value = index;
  resetProgress();
};

const nextFace = () => {
  currentIndex.value = (currentIndex.value + 1) % laws.length;
  resetProgress();
};

const prevFace = () => {
  currentIndex.value = (currentIndex.value - 1 + laws.length) % laws.length;
  resetProgress();
};

const resetProgress = () => {
  progressWidth.value = 0;
};

const startAuto = () => {
  autoRotating.value = true;
  progressWidth.value = 0;
  
  progressInterval = setInterval(() => {
    progressWidth.value += 2;
    if (progressWidth.value >= 100) {
      nextFace();
    }
  }, 80);
};

const stopAuto = () => {
  autoRotating.value = false;
  progressWidth.value = 0;
  if (progressInterval) {
    clearInterval(progressInterval);
    progressInterval = null;
  }
};

const toggleAuto = () => {
  if (autoRotating.value) {
    stopAuto();
  } else {
    startAuto();
  }
};

const scrollToPanel = () => {
  document.getElementById('main-content')?.scrollIntoView({ behavior: 'smooth' });
};

onMounted(() => {
  // Auto-start après 2s
  setTimeout(() => {
    startAuto();
  }, 2000);
});

onUnmounted(() => {
  stopAuto();
});
</script>

<style scoped>
.asimov-page {
  background: #0a0f1a;
  color: #e5e5e5;
  min-height: 100vh;
  font-family: 'Inter', sans-serif;
}

/* HERO */
.asimov-hero {
  min-height: 60vh;
  display: flex;
  align-items: center;
  position: relative;
  padding: 8rem 0 4rem;
  overflow: hidden;
}

.hero-bg {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at center, #0f1a2e 0%, #0a0f1a 100%);
}

.grid-lines {
  position: absolute;
  inset: 0;
  background-image: 
    linear-gradient(rgba(14, 165, 233, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(14, 165, 233, 0.03) 1px, transparent 1px);
  background-size: 50px 50px;
}

.floating-particles {
  position: absolute;
  inset: 0;
  background-image:
    radial-gradient(2px 2px at 20% 30%, rgba(14, 165, 233, 0.4), transparent),
    radial-gradient(2px 2px at 80% 70%, rgba(14, 165, 233, 0.3), transparent);
  background-size: 200px 200px;
  animation: float-particles 20s linear infinite;
}

@keyframes float-particles {
  to { transform: translateY(-200px); }
}

.asimov-hero .container {
  position: relative;
  z-index: 2;
  text-align: center;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 1.5rem;
  background: rgba(14, 165, 233, 0.1);
  border: 1px solid rgba(14, 165, 233, 0.3);
  border-radius: 2rem;
  margin-bottom: 2rem;
}

.badge-icon { font-size: 1.25rem; }

.badge-text {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.7rem;
  letter-spacing: 0.15em;
  color: #0ea5e9;
}

.hero-title { margin-bottom: 1.5rem; }

.title-line {
  display: block;
  font-size: clamp(2rem, 6vw, 4rem);
  font-weight: 300;
  letter-spacing: 0.05em;
}

.title-line--accent {
  color: #0ea5e9;
  text-shadow: 0 0 30px rgba(14, 165, 233, 0.3);
}

.hero-subtitle {
  font-size: 1.1rem;
  color: #a3a3a3;
  max-width: 500px;
  margin: 0 auto 2rem;
  line-height: 1.7;
}

.cta-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 2rem;
  background: linear-gradient(135deg, #0ea5e9, #0284c7);
  color: #fff;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.cta-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(14, 165, 233, 0.3);
}

/* TRI-VISION SECTION */
.trivision-section {
  padding: 4rem 0 6rem;
}

.section-intro {
  text-align: center;
  margin-bottom: 3rem;
}

.section-intro h2 {
  font-size: 1.5rem;
  font-weight: 400;
  margin-bottom: 0.5rem;
}

.section-intro p {
  color: #737373;
  font-size: 0.9rem;
}

.trivision-container {
  max-width: 800px;
  margin: 0 auto;
}

/* Panel Frame */
.panel-frame {
  position: relative;
  background: #111827;
  border: 2px solid #1e3a5f;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 
    0 0 0 1px rgba(14, 165, 233, 0.1),
    0 20px 60px rgba(0, 0, 0, 0.5);
}

.frame-corner {
  position: absolute;
  width: 20px;
  height: 20px;
  border: 2px solid #0ea5e9;
}

.frame-corner--tl { top: -2px; left: -2px; border-right: none; border-bottom: none; }
.frame-corner--tr { top: -2px; right: -2px; border-left: none; border-bottom: none; }
.frame-corner--bl { bottom: -2px; left: -2px; border-right: none; border-top: none; }
.frame-corner--br { bottom: -2px; right: -2px; border-left: none; border-top: none; }

/* Face Indicators */
.face-indicators {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  padding: 0.75rem 1.5rem;
  background: transparent;
  border: 1px solid #2a2a2a;
  border-radius: 0.5rem;
  color: #737373;
  cursor: pointer;
  transition: all 0.3s ease;
}

.indicator:hover {
  border-color: #0ea5e9;
  color: #e5e5e5;
}

.indicator.active {
  background: rgba(14, 165, 233, 0.15);
  border-color: #0ea5e9;
  color: #0ea5e9;
}

.indicator-num {
  font-size: 1.25rem;
  font-weight: 600;
}

.indicator-label {
  font-size: 0.7rem;
  font-family: 'JetBrains Mono', monospace;
}

/* Prism Viewport */
.prism-viewport {
  background: #0a0f1a;
  border-radius: 0.5rem;
  min-height: 420px;
  overflow: hidden;
}

.prism-face {
  padding: 2rem;
}

.face-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

/* Law Header */
.law-header {
  margin-bottom: 1.5rem;
}

.law-number {
  display: block;
  font-size: 4rem;
  font-weight: 700;
  color: rgba(14, 165, 233, 0.15);
  line-height: 1;
}

.law-label {
  display: block;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.7rem;
  letter-spacing: 0.2em;
  color: #0ea5e9;
  margin-top: -0.5rem;
}

/* Face Visual */
.face-visual {
  position: relative;
  width: 150px;
  height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 1rem 0 1.5rem;
}

.visual-icon {
  font-size: 4rem;
  z-index: 2;
  animation: icon-pulse 2s ease-in-out infinite;
}

@keyframes icon-pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

.visual-ring {
  position: absolute;
  inset: 0;
  border: 2px solid #0ea5e9;
  border-radius: 50%;
  animation: ring-spin 8s linear infinite;
}

@keyframes ring-spin {
  to { transform: rotate(360deg); }
}

.visual-ring::before {
  content: '';
  position: absolute;
  top: -5px;
  left: 50%;
  width: 10px;
  height: 10px;
  background: #0ea5e9;
  border-radius: 50%;
  transform: translateX(-50%);
}

.visual-particles {
  position: absolute;
  inset: -20px;
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.visual-particles span {
  font-size: 1.25rem;
  opacity: 0.5;
  animation: particle-float 3s ease-in-out infinite;
}

.visual-particles span:nth-child(2) { animation-delay: 1s; }
.visual-particles span:nth-child(3) { animation-delay: 2s; }

@keyframes particle-float {
  0%, 100% { transform: translateY(0) rotate(0); opacity: 0.3; }
  50% { transform: translateY(-10px) rotate(180deg); opacity: 0.7; }
}

/* Face Text */
.face-text {
  margin-bottom: 1.5rem;
}

.law-title {
  font-size: 1.75rem;
  font-weight: 400;
  color: #0ea5e9;
  margin-bottom: 0.5rem;
}

.law-slogan {
  font-size: 1.1rem;
  font-style: italic;
  color: #e5e5e5;
  margin-bottom: 0.75rem;
}

.law-desc {
  font-size: 0.95rem;
  color: #a3a3a3;
  max-width: 450px;
  line-height: 1.6;
}

/* Face Icons */
.face-icons {
  display: flex;
  justify-content: center;
  gap: 2rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(14, 165, 233, 0.2);
}

.icon-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
}

.icon-item .icon { font-size: 1.5rem; }

.icon-item .label {
  font-size: 0.7rem;
  color: #737373;
  font-family: 'JetBrains Mono', monospace;
}

/* Panel Controls */
.panel-controls {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 1.5rem;
}

.control-btn {
  padding: 0.6rem 1.25rem;
  background: #1a1a2e;
  border: 1px solid #2a2a2a;
  color: #a3a3a3;
  border-radius: 0.5rem;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.control-btn:hover {
  border-color: #0ea5e9;
  color: #e5e5e5;
}

.control-btn--auto.active {
  background: rgba(14, 165, 233, 0.15);
  border-color: #0ea5e9;
  color: #0ea5e9;
}

/* Progress Bar */
.progress-bar {
  height: 3px;
  background: #1a1a2e;
  border-radius: 2px;
  margin-top: 1rem;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #0ea5e9, #06b6d4);
  transition: width 0.08s linear;
}

/* Slide Transition */
.slide-enter-active,
.slide-leave-active {
  transition: all 0.4s ease;
}

.slide-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.slide-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

/* LAWS DETAIL SECTION */
.laws-detail-section {
  padding: 6rem 0;
  background: #0f1520;
}

.section-header {
  text-align: center;
  margin-bottom: 3rem;
}

.section-header h2 {
  font-size: clamp(1.5rem, 4vw, 2.5rem);
  font-weight: 400;
  margin-bottom: 0.5rem;
}

.section-header p { color: #737373; }

.laws-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
}

.law-card {
  background: #111827;
  border: 1px solid #1e3a5f;
  border-radius: 1rem;
  padding: 2rem;
  transition: all 0.3s ease;
}

.law-card:hover {
  transform: translateY(-5px);
  border-color: #0ea5e9;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.card-number {
  font-size: 3rem;
  font-weight: 700;
  color: rgba(14, 165, 233, 0.2);
  line-height: 1;
}

.card-icon { font-size: 2rem; }

.law-card h3 {
  font-size: 1.25rem;
  color: #0ea5e9;
  margin-bottom: 0.5rem;
}

.card-principle {
  font-size: 0.9rem;
  color: #e5e5e5;
  margin-bottom: 1rem;
  font-weight: 500;
}

.card-details p {
  font-size: 0.85rem;
  color: #a3a3a3;
  line-height: 1.7;
  margin-bottom: 1rem;
}

.card-example {
  background: rgba(14, 165, 233, 0.05);
  border-left: 2px solid #0ea5e9;
  padding: 0.75rem 1rem;
  font-size: 0.8rem;
  color: #a3a3a3;
}

/* HIERARCHY SECTION */
.hierarchy-section {
  padding: 6rem 0;
  background: linear-gradient(180deg, #0f1520 0%, #0a0f1a 100%);
}

.hierarchy-visual {
  max-width: 600px;
  margin: 0 auto;
  text-align: center;
}

.pyramid {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 2rem;
}

.pyramid-level {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 1.5rem;
  border-radius: 0.5rem;
  margin: 0 auto;
}

.pyramid-level--1 {
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.2), rgba(239, 68, 68, 0.1));
  border: 1px solid rgba(239, 68, 68, 0.3);
  width: 60%;
}

.pyramid-level--2 {
  background: linear-gradient(135deg, rgba(14, 165, 233, 0.2), rgba(14, 165, 233, 0.1));
  border: 1px solid rgba(14, 165, 233, 0.3);
  width: 75%;
}

.pyramid-level--3 {
  background: linear-gradient(135deg, rgba(34, 197, 94, 0.2), rgba(34, 197, 94, 0.1));
  border: 1px solid rgba(34, 197, 94, 0.3);
  width: 90%;
}

.level-icon { font-size: 1.5rem; }
.level-text { font-weight: 500; font-size: 0.9rem; }

.level-priority {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.65rem;
  color: #737373;
}

.hierarchy-legend p {
  color: #a3a3a3;
  font-size: 0.95rem;
  line-height: 1.7;
}

/* ASIMOV BIO SECTION */
.asimov-bio-section {
  padding: 6rem 0;
  background: #0a0f1a;
}

.bio-card {
  display: flex;
  gap: 3rem;
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  background: #111827;
  border: 1px solid #1e3a5f;
  border-radius: 1rem;
}

.portrait-frame {
  width: 150px;
  height: 180px;
  background: #0a0f1a;
  border: 2px solid #1e3a5f;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 4rem;
  border-radius: 0.5rem;
  flex-shrink: 0;
}

.bio-content h3 {
  font-size: 1.75rem;
  color: #e5e5e5;
  margin-bottom: 0.25rem;
}

.bio-dates {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.8rem;
  color: #0ea5e9;
  margin-bottom: 1rem;
}

.bio-text {
  font-size: 0.95rem;
  color: #a3a3a3;
  line-height: 1.7;
  margin-bottom: 1rem;
}

.bio-works {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.work-tag {
  padding: 0.25rem 0.75rem;
  background: rgba(14, 165, 233, 0.1);
  border: 1px solid rgba(14, 165, 233, 0.3);
  border-radius: 1rem;
  font-size: 0.75rem;
  color: #0ea5e9;
}

/* FINAL SECTION */
.final-section {
  padding: 6rem 0;
  text-align: center;
  background: radial-gradient(ellipse at center, #0f1a2e 0%, #0a0f1a 100%);
}

.final-quote blockquote {
  font-size: 1.5rem;
  font-style: italic;
  color: #e5e5e5;
  max-width: 600px;
  margin: 0 auto 1rem;
}

.final-quote cite {
  font-size: 0.9rem;
  color: #737373;
}

.final-cta {
  display: inline-block;
  margin: 2rem 0;
  padding: 1rem 2rem;
  background: linear-gradient(135deg, #0ea5e9, #0284c7);
  color: #fff;
  text-decoration: none;
  border-radius: 0.5rem;
  font-weight: 500;
  transition: all 0.3s ease;
}

.final-cta:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(14, 165, 233, 0.3);
}

.final-badge {
  display: inline-flex;
  flex-direction: column;
  margin-top: 2rem;
  padding: 1rem 2rem;
  border: 1px solid #0ea5e9;
  border-radius: 0.5rem;
}

.final-badge .badge-text {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.75rem;
  letter-spacing: 0.15em;
  color: #0ea5e9;
}

.final-badge .badge-year {
  font-size: 0.65rem;
  color: #737373;
  margin-top: 0.25rem;
}

/* RESPONSIVE */
@media (max-width: 768px) {
  .face-indicators {
    flex-wrap: wrap;
  }
  
  .indicator {
    padding: 0.5rem 1rem;
  }
  
  .prism-viewport {
    min-height: 480px;
  }
  
  .panel-controls {
    flex-wrap: wrap;
  }
  
  .bio-card {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  
  .bio-works {
    justify-content: center;
  }
  
  .pyramid-level {
    width: 100% !important;
    flex-wrap: wrap;
    gap: 0.5rem;
  }
}

/* A11Y */
@media (prefers-reduced-motion: reduce) {
  .floating-particles,
  .visual-ring,
  .visual-icon,
  .visual-particles span {
    animation: none !important;
  }
  
  .slide-enter-active,
  .slide-leave-active {
    transition: opacity 0.2s ease;
  }
  
  .slide-enter-from,
  .slide-leave-to {
    transform: none;
  }
}
</style>
