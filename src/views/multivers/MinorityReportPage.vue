<template>
  <div class="minority-page">
    <a href="#main-content" class="skip-link">Aller au contenu principal</a>

    <!-- PRECRIME HUD -->
    <div class="hud-overlay" aria-hidden="true">
      <div class="hud-corner hud-corner--tl"></div>
      <div class="hud-corner hud-corner--tr"></div>
      <div class="hud-corner hud-corner--bl"></div>
      <div class="hud-corner hud-corner--br"></div>
      <div class="hud-scanline"></div>
    </div>

    <!-- HERO : Precog Vision -->
    <section id="hero" class="mr-hero" aria-labelledby="hero-title">
      <div class="hero-bg" aria-hidden="true">
        <div class="data-streams">
          <div class="stream stream--1"></div>
          <div class="stream stream--2"></div>
          <div class="stream stream--3"></div>
        </div>
      </div>

      <div class="container" id="main-content">
        <div class="precrime-badge">
          <div class="badge-eye">👁️</div>
          <span class="badge-text">DIVISION PRÉCRIME</span>
        </div>

        <h1 id="hero-title" class="hero-title">
          <span class="title-pre">LE FUTUR</span>
          <span class="title-main">PEUT ÊTRE VU</span>
        </h1>

        <p class="hero-quote">
          « Le fait que vous l'ayez empêché de se produire ne change pas 
          le fait que ça allait arriver. »
        </p>

        <div class="precog-status">
          <div class="precog" v-for="p in precogs" :key="p.name">
            <div class="precog-orb" :class="'orb--' + p.status">
              <span class="orb-inner"></span>
            </div>
            <span class="precog-name">{{ p.name }}</span>
            <span class="precog-status">{{ p.status }}</span>
          </div>
        </div>

        <button class="gesture-btn" @click="scrollTo('interface')">
          <span class="btn-hand">🖐️</span>
          <span class="btn-text">ACCÉDER À L'INTERFACE</span>
        </button>
      </div>
    </section>

    <!-- GESTURE INTERFACE : Projects -->
    <section id="interface" class="mr-section interface-section" aria-labelledby="interface-title">
      <div class="container">
        <div class="section-header">
          <span class="header-icon">🖐️</span>
          <h2 id="interface-title">INTERFACE GESTUELLE</h2>
          <p class="section-sub">Manipuler les données par le mouvement</p>
        </div>

        <div class="gesture-area" @mousemove="handleGesture" @mouseleave="resetGesture">
          <div class="gesture-cursor" :style="{ left: cursorX + 'px', top: cursorY + 'px' }">
            <div class="cursor-ring"></div>
            <div class="cursor-dot"></div>
          </div>

          <div class="data-panels">
            <article 
              v-for="(panel, index) in panels" 
              :key="panel.id"
              class="data-panel"
              :class="{ 'panel--active': activePanel === panel.id }"
              :style="{ '--index': index }"
              @mouseenter="activePanel = panel.id"
              @mouseleave="activePanel = null"
            >
              <div class="panel-header">
                <span class="panel-id">{{ panel.id }}</span>
                <span class="panel-type">{{ panel.type }}</span>
              </div>
              <div class="panel-content">
                <h3>{{ panel.name }}</h3>
                <p>{{ panel.desc }}</p>
                <div class="panel-meta">
                  <span class="meta-item">{{ panel.tech }}</span>
                  <span class="meta-status" :class="'status--' + panel.status">{{ panel.status }}</span>
                </div>
              </div>
              <div class="panel-glow" aria-hidden="true"></div>
            </article>
          </div>
        </div>
      </div>
    </section>

    <!-- PREVISION : Skills Timeline -->
    <section id="prevision" class="mr-section prevision-section" aria-labelledby="prevision-title">
      <div class="container">
        <div class="section-header">
          <span class="header-icon">⏱️</span>
          <h2 id="prevision-title">ANALYSE PRÉVISIONNELLE</h2>
          <p class="section-sub">Prédire les résultats grâce aux données</p>
        </div>

        <div class="timeline-container">
          <div class="timeline-track">
            <div class="timeline-progress" :style="{ width: timelineProgress + '%' }"></div>
          </div>

          <div class="timeline-events">
            <div 
              v-for="(event, index) in timelineEvents" 
              :key="event.year"
              class="timeline-event"
              :class="{ 'event--past': index <= currentEventIndex }"
              :style="{ left: (index / (timelineEvents.length - 1)) * 100 + '%' }"
            >
              <div class="event-marker"></div>
              <div class="event-content">
                <span class="event-year">{{ event.year }}</span>
                <span class="event-title">{{ event.title }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="prediction-box">
          <div class="prediction-header">
            <span class="pred-icon">🔮</span>
            <span class="pred-label">ÉVÉNEMENT PRÉDIT SUIVANT</span>
          </div>
          <div class="prediction-content">
            <h3>{{ nextPrediction.title }}</h3>
            <p>{{ nextPrediction.desc }}</p>
            <span class="pred-probability">Probabilité : {{ nextPrediction.prob }}%</span>
          </div>
        </div>
      </div>
    </section>

    <!-- MINORITY REPORT : Philosophy -->
    <section id="minority" class="mr-section minority-section" aria-labelledby="minority-title">
      <div class="container">
        <div class="section-header">
          <span class="header-icon">📋</span>
          <h2 id="minority-title">LE RAPPORT MINORITAIRE</h2>
          <p class="section-sub">Quand un précog voit différemment</p>
        </div>

        <div class="report-content">
          <div class="report-cards">
            <div class="report-card report-card--majority">
              <div class="card-label">RAPPORT MAJORITAIRE</div>
              <p>Suivre le chemin standard. Utiliser des technologies éprouvées. Construire ce qui est attendu.</p>
              <div class="card-verdict">CONVENTIONNEL</div>
            </div>
            <div class="report-card report-card--minority">
              <div class="card-label">RAPPORT MINORITAIRE</div>
              <p>Remettre en question les hypothèses. Intégrer l'IA localement. Posséder sa souveraineté des données.</p>
              <div class="card-verdict">INNOVANT</div>
            </div>
          </div>

          <blockquote class="minority-quote">
            <p>« Vous avez encore le choix. Le futur n'est pas fixé. »</p>
          </blockquote>
        </div>
      </div>
    </section>

    <!-- FREE WILL : Contact -->
    <section id="choice" class="mr-section choice-section" aria-labelledby="choice-title">
      <div class="choice-bg" aria-hidden="true">
        <div class="choice-orbs">
          <div class="orb orb--1"></div>
          <div class="orb orb--2"></div>
          <div class="orb orb--3"></div>
        </div>
      </div>

      <div class="container">
        <h2 id="choice-title" class="choice-title">
          <span class="pre">VOUS POUVEZ</span>
          <span class="main">CHOISIR</span>
        </h2>

        <p class="choice-text">
          Les précogs ont vu le potentiel de votre projet.<br>
          La question est : allez-vous agir ?
        </p>

        <router-link to="/contact" class="choice-btn">
          <span class="btn-hand">🖐️</span>
          <span class="btn-text">ÉTABLIR LE CONTACT</span>
        </router-link>

        <div class="choice-footer" aria-hidden="true">
          <span>// DÉPARTEMENT PRÉCRIME - {{ currentTime }}</span>
        </div>
      </div>
    </section>

    <!-- Time Display -->
    <div class="time-display" aria-hidden="true">
      <span class="time-label">HEURE SYSTÈME</span>
      <span class="time-value">{{ currentTime }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';

const cursorX = ref(0);
const cursorY = ref(0);
const activePanel = ref(null);
const currentTime = ref('00:00:00');
const timelineProgress = ref(0);
const currentEventIndex = ref(2);

const precogs = [
  { name: 'Agatha', status: 'actif' },
  { name: 'Arthur', status: 'actif' },
  { name: 'Dashiell', status: 'actif' }
];

const panels = [
  { id: 'PRJ-001', name: 'ARKADIA', type: 'COMMUNAUTÉ', desc: 'Gestion de cluster gaming', tech: 'Nitrado • Discord', status: 'actif' },
  { id: 'PRJ-002', name: 'GL DIGITAL', type: 'BUSINESS', desc: 'Studio dev & services IA', tech: 'Symfony • Vue', status: 'actif' },
  { id: 'PRJ-003', name: 'NEURAL OPS', type: 'IA', desc: 'Workflows IA locaux', tech: 'n8n • Ollama', status: 'actif' },
  { id: 'PRJ-004', name: 'PORTFOLIO', type: 'VITRINE', desc: 'Expérience multi-univers', tech: 'Vue 3 • Vite', status: 'actif' },
  { id: 'PRJ-005', name: 'OBSIDIAN RAG', type: 'CONNAISSANCE', desc: 'Système de recherche sémantique', tech: 'ChromaDB', status: 'dev' },
  { id: 'PRJ-006', name: 'DISCORD BOT', type: 'AUTOMATISATION', desc: 'Assistant communautaire', tech: 'Node.js', status: 'veille' }
];

const timelineEvents = [
  { year: '2020', title: 'Formation Dev Web' },
  { year: '2021', title: 'Premiers Projets' },
  { year: '2022', title: 'Maîtrise Symfony' },
  { year: '2023', title: 'Intégration IA' },
  { year: '2024', title: 'Lancement ARKADIA' },
  { year: '2025', title: 'GL Digital Lab' },
  { year: '2026', title: 'Autonomie Totale' }
];

const nextPrediction = {
  title: 'Lancement GL Digital Lab',
  desc: 'Studio de développement indépendant spécialisé dans l\'intégration IA et l\'infrastructure souveraine.',
  prob: 94
};

const handleGesture = (e) => {
  const rect = e.currentTarget.getBoundingClientRect();
  cursorX.value = e.clientX - rect.left;
  cursorY.value = e.clientY - rect.top;
};

const resetGesture = () => {
  cursorX.value = 0;
  cursorY.value = 0;
};

const scrollTo = (id) => {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
};

let timeInterval = null;
let progressInterval = null;

onMounted(() => {
  timeInterval = setInterval(() => {
    const now = new Date();
    currentTime.value = now.toLocaleTimeString('en-US', { hour12: false });
  }, 1000);

  progressInterval = setInterval(() => {
    timelineProgress.value = (timelineProgress.value + 0.5) % 100;
  }, 100);
});

onUnmounted(() => {
  clearInterval(timeInterval);
  clearInterval(progressInterval);
});
</script>

<style scoped>
.minority-page {
  --blue: #4fc3f7;
  --blue-dark: #0288d1;
  --white: #ffffff;
  --bg: #0a0a12;
  --bg-panel: rgba(10, 20, 40, 0.9);
  background: var(--bg);
  color: #e0e0e0;
  min-height: 100vh;
  font-family: 'Inter', -apple-system, sans-serif;
  overflow-x: hidden;
}

/* HUD OVERLAY */
.hud-overlay { position: fixed; inset: 0; pointer-events: none; z-index: 100; }
.hud-corner {
  position: absolute; width: 50px; height: 50px;
  border: 2px solid rgba(79, 195, 247, 0.3);
}
.hud-corner--tl { top: 1rem; left: 1rem; border-right: none; border-bottom: none; }
.hud-corner--tr { top: 1rem; right: 1rem; border-left: none; border-bottom: none; }
.hud-corner--bl { bottom: 1rem; left: 1rem; border-right: none; border-top: none; }
.hud-corner--br { bottom: 1rem; right: 1rem; border-left: none; border-top: none; }
.hud-scanline {
  position: absolute; top: 0; left: 0; right: 0; height: 2px;
  background: linear-gradient(90deg, transparent, var(--blue), transparent);
  animation: scanMove 4s linear infinite;
}
@keyframes scanMove {
  0% { top: 0; opacity: 0; }
  10% { opacity: 1; }
  90% { opacity: 1; }
  100% { top: 100%; opacity: 0; }
}

/* HERO */
.mr-hero {
  min-height: 100vh; display: flex; align-items: center;
  position: relative; padding: 6rem 2rem;
}
.hero-bg { position: absolute; inset: 0; overflow: hidden; }
.data-streams { position: absolute; inset: 0; }
.stream {
  position: absolute; width: 2px; background: linear-gradient(180deg, transparent, var(--blue), transparent);
  animation: streamFall 8s linear infinite;
}
.stream--1 { left: 20%; height: 200px; animation-delay: 0s; }
.stream--2 { left: 50%; height: 150px; animation-delay: 2s; }
.stream--3 { left: 80%; height: 180px; animation-delay: 4s; }
@keyframes streamFall {
  0% { transform: translateY(-100%); opacity: 0; }
  50% { opacity: 1; }
  100% { transform: translateY(100vh); opacity: 0; }
}

.container { position: relative; z-index: 2; max-width: 1100px; margin: 0 auto; }

.precrime-badge {
  display: inline-flex; align-items: center; gap: 0.75rem;
  padding: 0.75rem 1.5rem; background: rgba(79, 195, 247, 0.1);
  border: 1px solid var(--blue); margin-bottom: 2rem;
}
.badge-eye { font-size: 1.5rem; }
.badge-text { font-size: 0.75rem; letter-spacing: 0.3em; color: var(--blue); }

.hero-title { margin-bottom: 2rem; }
.title-pre { display: block; font-size: 1rem; color: rgba(224,224,224,0.5); letter-spacing: 0.3em; }
.title-main {
  display: block; font-size: clamp(2.5rem, 7vw, 5rem); font-weight: 300;
  color: var(--blue); letter-spacing: 0.1em;
  text-shadow: 0 0 40px rgba(79, 195, 247, 0.5);
}

.hero-quote {
  font-size: 1rem; font-style: italic; color: rgba(224,224,224,0.6);
  max-width: 450px; line-height: 1.8; margin-bottom: 2rem;
}

.precog-status { display: flex; gap: 2rem; margin-bottom: 2rem; }
.precog { text-align: center; }
.precog-orb {
  width: 60px; height: 60px; border-radius: 50%;
  background: radial-gradient(circle, rgba(79, 195, 247, 0.3) 0%, transparent 70%);
  display: flex; align-items: center; justify-content: center;
  margin: 0 auto 0.5rem; position: relative;
}
.orb-inner {
  width: 30px; height: 30px; border-radius: 50%;
  background: var(--blue); box-shadow: 0 0 20px var(--blue);
  animation: orbPulse 2s ease-in-out infinite;
}
.orb--active .orb-inner { background: #4caf50; box-shadow: 0 0 20px #4caf50; }
@keyframes orbPulse { 50% { transform: scale(1.1); opacity: 0.8; } }
.precog-name { display: block; font-size: 0.75rem; color: var(--blue); }
.precog-status { display: block; font-size: 0.6rem; color: rgba(224,224,224,0.5); text-transform: uppercase; }

.gesture-btn, .choice-btn {
  display: inline-flex; align-items: center; gap: 0.75rem;
  padding: 1rem 2rem; background: transparent;
  border: 1px solid var(--blue); color: var(--blue);
  font-family: inherit; font-size: 0.9rem; letter-spacing: 0.15em;
  cursor: pointer; transition: all 0.3s; text-decoration: none;
}
.gesture-btn:hover, .choice-btn:hover {
  background: rgba(79, 195, 247, 0.1); box-shadow: 0 0 30px rgba(79, 195, 247, 0.3);
}
.btn-hand { font-size: 1.25rem; }

/* SECTIONS */
.mr-section { min-height: 100vh; padding: 6rem 2rem; position: relative; }
.section-header { text-align: center; margin-bottom: 4rem; }
.header-icon { display: block; font-size: 2rem; margin-bottom: 0.5rem; }
.section-header h2 {
  font-size: clamp(1.5rem, 4vw, 2.5rem); font-weight: 300;
  color: var(--blue); letter-spacing: 0.2em;
}
.section-sub { font-size: 0.85rem; color: rgba(224,224,224,0.5); margin-top: 0.5rem; }

/* INTERFACE */
.interface-section { background: linear-gradient(180deg, var(--bg) 0%, #0a1525 100%); }
.gesture-area { position: relative; min-height: 500px; cursor: none; }
.gesture-cursor {
  position: absolute; width: 60px; height: 60px;
  pointer-events: none; transform: translate(-50%, -50%);
  transition: all 0.1s ease;
}
.cursor-ring {
  position: absolute; inset: 0; border: 2px solid var(--blue);
  border-radius: 50%; animation: cursorPulse 1.5s ease-in-out infinite;
}
@keyframes cursorPulse { 50% { transform: scale(1.2); opacity: 0.5; } }
.cursor-dot {
  position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
  width: 10px; height: 10px; background: var(--blue);
  border-radius: 50%; box-shadow: 0 0 15px var(--blue);
}

.data-panels {
  display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}
.data-panel {
  background: var(--bg-panel); border: 1px solid rgba(79, 195, 247, 0.2);
  padding: 1.5rem; position: relative; overflow: hidden;
  transition: all 0.3s; transform-style: preserve-3d;
}
.data-panel:hover, .panel--active {
  border-color: var(--blue); transform: translateY(-5px);
  box-shadow: 0 10px 40px rgba(79, 195, 247, 0.2);
}
.panel-header {
  display: flex; justify-content: space-between;
  margin-bottom: 1rem; font-size: 0.7rem;
}
.panel-id { color: var(--blue); font-family: monospace; }
.panel-type { color: rgba(224,224,224,0.5); }
.panel-content h3 { font-size: 1.25rem; color: var(--white); margin-bottom: 0.5rem; }
.panel-content p { font-size: 0.85rem; color: rgba(224,224,224,0.6); margin-bottom: 1rem; }
.panel-meta { display: flex; justify-content: space-between; font-size: 0.75rem; }
.meta-item { color: rgba(224,224,224,0.5); }
.meta-status { text-transform: uppercase; }
.status--actif { color: #4caf50; }
.status--dev { color: #ff9800; }
.status--veille { color: #9e9e9e; }
.panel-glow {
  position: absolute; inset: 0; opacity: 0;
  background: radial-gradient(circle at center, rgba(79, 195, 247, 0.1) 0%, transparent 70%);
  transition: opacity 0.3s;
}
.data-panel:hover .panel-glow { opacity: 1; }

/* PREVISION */
.prevision-section { background: #0a1525; }
.timeline-container { margin-bottom: 3rem; }
.timeline-track {
  height: 4px; background: rgba(79, 195, 247, 0.2);
  border-radius: 2px; margin-bottom: 3rem; position: relative;
}
.timeline-progress {
  height: 100%; background: linear-gradient(90deg, var(--blue), transparent);
  border-radius: 2px; transition: width 0.1s linear;
}
.timeline-events { position: relative; height: 80px; }
.timeline-event {
  position: absolute; transform: translateX(-50%);
  text-align: center;
}
.event-marker {
  width: 12px; height: 12px; background: rgba(79, 195, 247, 0.3);
  border: 2px solid var(--blue); border-radius: 50%;
  margin: 0 auto 0.5rem; transition: all 0.3s;
}
.event--past .event-marker { background: var(--blue); box-shadow: 0 0 15px var(--blue); }
.event-year { display: block; font-size: 0.8rem; color: var(--blue); font-weight: bold; }
.event-title { display: block; font-size: 0.65rem; color: rgba(224,224,224,0.5); }

.prediction-box {
  max-width: 500px; margin: 0 auto;
  background: var(--bg-panel); border: 1px solid var(--blue);
}
.prediction-header {
  display: flex; align-items: center; gap: 0.75rem;
  padding: 1rem; background: rgba(79, 195, 247, 0.1);
  border-bottom: 1px solid rgba(79, 195, 247, 0.2);
}
.pred-icon { font-size: 1.25rem; }
.pred-label { font-size: 0.7rem; color: var(--blue); letter-spacing: 0.1em; }
.prediction-content { padding: 1.5rem; }
.prediction-content h3 { font-size: 1.25rem; color: var(--white); margin-bottom: 0.5rem; }
.prediction-content p { font-size: 0.9rem; color: rgba(224,224,224,0.6); margin-bottom: 1rem; }
.pred-probability { font-size: 0.85rem; color: #4caf50; font-weight: bold; }

/* MINORITY */
.minority-section { background: linear-gradient(180deg, #0a1525 0%, var(--bg) 100%); }
.report-cards { display: grid; grid-template-columns: repeat(2, 1fr); gap: 2rem; margin-bottom: 2rem; }
.report-card {
  padding: 2rem; border: 1px solid rgba(224,224,224,0.1);
  text-align: center;
}
.report-card--majority { background: rgba(158, 158, 158, 0.1); }
.report-card--minority { background: rgba(79, 195, 247, 0.1); border-color: var(--blue); }
.card-label { font-size: 0.7rem; letter-spacing: 0.2em; margin-bottom: 1rem; color: rgba(224,224,224,0.5); }
.report-card p { font-size: 0.95rem; color: rgba(224,224,224,0.7); line-height: 1.7; margin-bottom: 1rem; }
.card-verdict { font-size: 0.8rem; font-weight: bold; }
.report-card--majority .card-verdict { color: #9e9e9e; }
.report-card--minority .card-verdict { color: var(--blue); }

.minority-quote { text-align: center; }
.minority-quote p { font-size: 1.25rem; font-style: italic; color: var(--blue); }

/* CHOICE */
.choice-section {
  display: flex; align-items: center; justify-content: center;
  min-height: 100vh; text-align: center; position: relative;
}
.choice-bg { position: absolute; inset: 0; }
.choice-orbs { position: absolute; inset: 0; display: flex; justify-content: center; align-items: center; }
.orb {
  position: absolute; border-radius: 50%;
  background: radial-gradient(circle, rgba(79, 195, 247, 0.2) 0%, transparent 70%);
  animation: orbFloat 6s ease-in-out infinite;
}
.orb--1 { width: 300px; height: 300px; animation-delay: 0s; }
.orb--2 { width: 200px; height: 200px; left: 30%; animation-delay: 2s; }
.orb--3 { width: 250px; height: 250px; right: 25%; animation-delay: 4s; }
@keyframes orbFloat { 50% { transform: translateY(-20px); } }

.choice-title { margin-bottom: 1rem; }
.choice-title .pre { display: block; font-size: 1rem; color: rgba(224,224,224,0.5); letter-spacing: 0.3em; }
.choice-title .main {
  display: block; font-size: clamp(3rem, 8vw, 6rem); font-weight: 200;
  color: var(--blue); text-shadow: 0 0 50px rgba(79, 195, 247, 0.5);
}
.choice-text { color: rgba(224,224,224,0.6); margin-bottom: 2rem; line-height: 1.8; }
.choice-footer { margin-top: 3rem; font-size: 0.7rem; color: rgba(79, 195, 247, 0.3); }

/* TIME DISPLAY */
.time-display {
  position: fixed; top: 1rem; right: 1rem;
  padding: 0.5rem 1rem; background: rgba(0,0,0,0.5);
  border: 1px solid rgba(79, 195, 247, 0.3); font-size: 0.7rem;
}
.time-label { display: block; color: rgba(79, 195, 247, 0.5); font-size: 0.6rem; }
.time-value { color: var(--blue); font-family: monospace; }

/* RESPONSIVE */
@media (max-width: 768px) {
  .precog-status { flex-direction: column; gap: 1rem; }
  .report-cards { grid-template-columns: 1fr; }
  .gesture-area { cursor: auto; }
  .gesture-cursor { display: none; }
}

/* A11Y */
@media (prefers-reduced-motion: reduce) {
  .hud-scanline, .stream, .orb-inner, .cursor-ring, .orb, .timeline-progress { animation: none !important; }
}
</style>
