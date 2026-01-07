<template>
  <div class="resurrections-page">
    <a href="#main-content" class="skip-link">Aller au contenu principal</a>

    <!-- DUAL RAIN (Green + Red) -->
    <div class="dual-rain" aria-hidden="true">
      <div class="rain rain--green"></div>
      <div class="rain rain--red"></div>
    </div>

    <!-- MODAL LOOP -->
    <div class="loop-modal" v-if="showLoop">
      <div class="modal-content">
        <div class="loop-animation">
          <span class="loop-icon">🔄</span>
        </div>
        <h2>BOUCLE DÉTECTÉE</h2>
        <p>Tu es déjà passé par là. Le système te maintient dans un cycle.</p>
        <button class="res-btn" @click="breakLoop">BRISER LA BOUCLE</button>
      </div>
    </div>

    <!-- HERO -->
    <section id="hero" class="res-hero" aria-labelledby="hero-title">
      <div class="container" id="main-content">
        <div class="neo-status">
          <div class="status-avatar">
            <span class="avatar-icon">👤</span>
            <div class="avatar-glitch"></div>
          </div>
          <div class="status-info">
            <span class="info-name">THOMAS ANDERSON</span>
            <span class="info-role">Game Developer @ Deus Machina</span>
            <span class="info-note">( ou peut-être pas... )</span>
          </div>
        </div>

        <h1 id="hero-title" class="hero-title">
          <span class="title-pre">RETOUR À</span>
          <span class="title-main">
            <span class="word word--matrix">LA MATRICE</span>
          </span>
          <span class="title-sub">La seule chose qui compte, c'est ce qu'on ressent</span>
        </h1>

        <p class="hero-quote">
          « La Matrice a ressuscité. Et elle est plus réelle que jamais. »
        </p>

        <div class="pill-choice-new">
          <button class="pill-btn pill-btn--red" :class="{ active: chosenPill === 'red' }" @click="choosePill('red')">
            <span class="pill-color"></span>
            <span class="pill-label">ROUGE</span>
          </button>
          <span class="pill-or">ou</span>
          <button class="pill-btn pill-btn--blue" :class="{ active: chosenPill === 'blue' }" @click="choosePill('blue')">
            <span class="pill-color"></span>
            <span class="pill-label">BLEUE</span>
          </button>
        </div>

        <div class="choice-result" v-if="chosenPill">
          <p v-if="chosenPill === 'red'">🔴 Tu as choisi de voir jusqu'où va le terrier...</p>
          <p v-else>💙 Certains préfèrent le confort de l'illusion.</p>
        </div>
      </div>
    </section>

    <!-- DEJA VU : About -->
    <section id="dejavu" class="res-section" aria-labelledby="dejavu-title">
      <div class="container">
        <div class="section-header">
          <span class="header-icon">🐱</span>
          <h2 id="dejavu-title">DÉJÀ VU</h2>
          <p class="section-sub">« Un déjà vu, c'est quand ils changent quelque chose dans la Matrice. »</p>
        </div>

        <div class="timeline-grid">
          <div class="timeline-card" v-for="(event, index) in timeline" :key="index">
            <div class="card-year">{{ event.year }}</div>
            <div class="card-content">
              <span class="card-icon">{{ event.icon }}</span>
              <h3>{{ event.title }}</h3>
              <p>{{ event.desc }}</p>
            </div>
            <div class="card-loop" v-if="event.loop">🔄 BOUCLE</div>
          </div>
        </div>

        <div class="bugs-quote">
          <span class="quote-avatar">🦋</span>
          <p>« Si tu veux la vérité, Neo, tu vas devoir la suivre. »</p>
          <span class="quote-author">— Bugs</span>
        </div>
      </div>
    </section>

    <!-- MODAL : Projects as Game Levels -->
    <section id="modal" class="res-section modal-section" aria-labelledby="modal-title">
      <div class="container">
        <div class="section-header">
          <span class="header-icon">🎮</span>
          <h2 id="modal-title">BINARY</h2>
          <p class="section-sub">Les jeux que Thomas Anderson a créés... ou a-t-il vécu ?</p>
        </div>

        <div class="games-grid">
          <article v-for="game in games" :key="game.id" class="game-card" :style="{ '--accent': game.color }">
            <div class="game-cover">
              <span class="cover-icon">{{ game.icon }}</span>
              <div class="cover-overlay">
                <span class="overlay-text">LANCER</span>
              </div>
            </div>
            <div class="game-info">
              <h3>{{ game.name }}</h3>
              <p class="game-genre">{{ game.genre }}</p>
              <p class="game-desc">{{ game.desc }}</p>
              <div class="game-meta">
                <span class="meta-rating">⭐ {{ game.rating }}</span>
                <span class="meta-players">👥 {{ game.players }}</span>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- SKILLS : Upgrades -->
    <section id="upgrades" class="res-section upgrades-section" aria-labelledby="upgrades-title">
      <div class="container">
        <div class="section-header">
          <span class="header-icon">⬆️</span>
          <h2 id="upgrades-title">AMÉLIORATIONS</h2>
          <p class="section-sub">Nouvelles capacités téléchargées</p>
        </div>

        <div class="upgrades-grid">
          <div v-for="upgrade in upgrades" :key="upgrade.name" class="upgrade-card" 
               :class="{ unlocked: upgrade.unlocked }" @click="upgrade.unlocked = true">
            <div class="upgrade-lock" v-if="!upgrade.unlocked">🔒</div>
            <div class="upgrade-content" v-else>
              <span class="upgrade-icon">{{ upgrade.icon }}</span>
              <h4>{{ upgrade.name }}</h4>
              <p>{{ upgrade.desc }}</p>
              <div class="upgrade-bar">
                <div class="bar-fill" :style="{ width: upgrade.level + '%', background: upgrade.color }"></div>
              </div>
              <span class="upgrade-level">NIVEAU {{ upgrade.level }}%</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- IO : Contact -->
    <section id="io" class="res-section io-section" aria-labelledby="io-title">
      <div class="container">
        <div class="io-card">
          <div class="io-header">
            <span class="io-icon">🏙️</span>
            <h2 id="io-title">IO</h2>
            <p class="io-sub">La nouvelle Zion • Cité de la Résistance</p>
          </div>

          <div class="io-message">
            <p>« Nous avons survécu. Nous avons reconstruit. Et maintenant, nous avons besoin de toi. »</p>
          </div>

          <div class="io-actions">
            <router-link to="/contact" class="res-btn res-btn--primary">
              <span class="btn-icon">📡</span>
              <span class="btn-text">REJOINDRE IO</span>
            </router-link>
            <button class="res-btn res-btn--secondary" @click="showLoop = true">
              <span class="btn-icon">🔄</span>
              <span class="btn-text">BOUCLE TEMPORELLE</span>
            </button>
          </div>

          <p class="io-footer">« Ce n'est pas la fin. C'est un nouveau commencement. »</p>
        </div>
      </div>
    </section>

    <!-- SYNC COUNTER -->
    <div class="sync-counter" aria-hidden="true" :class="{ synced: isSynced }">
      <span class="sync-icon">{{ isSynced ? '🟢' : '🔴' }}</span>
      <span class="sync-text">{{ isSynced ? 'SYNCHRONISÉ' : 'DÉSYNCHRONISÉ' }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';

const showLoop = ref(false);
const chosenPill = ref(null);
const isSynced = ref(false);

const timeline = [
  { year: '1999', icon: '💊', title: 'Premier Éveil', desc: 'Neo découvre la vérité', loop: false },
  { year: '2003', icon: '⚔️', title: 'La Guerre', desc: 'Bataille pour Zion', loop: false },
  { year: '2021', icon: '🔄', title: 'Résurrection', desc: 'La boucle recommence', loop: true },
  { year: '2026', icon: '🚀', title: 'GL Digital Lab', desc: 'Nouvelle résistance', loop: false }
];

const games = [
  { id: 1, name: 'ARKADIA', icon: '🛡️', genre: 'Survie MMO', color: '#00ff00', desc: 'Cluster gaming résistant', rating: '4.8', players: '150+' },
  { id: 2, name: 'GL TOWER', icon: '🏢', genre: 'Simulation IA', color: '#ff0066', desc: '13 agents autonomes', rating: '5.0', players: '∞' },
  { id: 3, name: 'NEURAL OPS', icon: '🧠', genre: 'Stratégie IA', color: '#00ffff', desc: 'Intelligence souveraine', rating: '4.9', players: 'Local' },
  { id: 4, name: 'MULTIVERS', icon: '🌐', genre: 'Exploration', color: '#ff9900', desc: 'Portfolio dimensionnel', rating: '4.7', players: 'Toi' }
];

const upgrades = reactive([
  { name: 'SYMFONY 8', icon: '⚙️', desc: 'Framework backend ultime', level: 95, color: '#00ff00', unlocked: true },
  { name: 'VUE.JS 3', icon: '🎨', desc: 'Manipulation de réalité', level: 88, color: '#42b883', unlocked: true },
  { name: 'THREE.JS', icon: '🌐', desc: 'Simulation 3D avancée', level: 75, color: '#00ffff', unlocked: false },
  { name: 'OLLAMA', icon: '🧠', desc: 'IA locale souveraine', level: 78, color: '#ff0066', unlocked: false },
  { name: 'DOCKER', icon: '🐳', desc: 'Conteneurisation Matrix', level: 82, color: '#2496ed', unlocked: true },
  { name: 'N8N', icon: '🔄', desc: 'Automatisation des flux', level: 85, color: '#ff9900', unlocked: false }
]);

const choosePill = (color) => {
  chosenPill.value = color;
  if (color === 'red') {
    setTimeout(() => {
      isSynced.value = true;
    }, 1000);
  }
};

const breakLoop = () => {
  showLoop.value = false;
  isSynced.value = true;
};

onMounted(() => {
  // Random sync after 5 seconds
  setTimeout(() => {
    if (!chosenPill.value) {
      showLoop.value = true;
    }
  }, 8000);
});
</script>

<style scoped>
.resurrections-page {
  --green: #00ff00;
  --red: #ff0066;
  --cyan: #00ffff;
  --black: #0a0a0a;
  --dark: #111;
  background: var(--black);
  color: #fff;
  min-height: 100vh;
  font-family: 'Inter', 'Segoe UI', sans-serif;
  overflow-x: hidden;
}

/* DUAL RAIN */
.dual-rain {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
}

.rain {
  position: absolute;
  inset: 0;
  background-image: 
    linear-gradient(0deg, transparent 50%, currentColor 50%);
  background-size: 3px 8px;
  animation: rainFall 0.5s linear infinite;
  opacity: 0.1;
}

.rain--green {
  color: var(--green);
  left: 0;
  width: 50%;
}

.rain--red {
  color: var(--red);
  right: 0;
  width: 50%;
  animation-delay: 0.25s;
}

@keyframes rainFall {
  0% { background-position: 0 0; }
  100% { background-position: 0 8px; }
}

/* LOOP MODAL */
.loop-modal {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: rgba(0, 0, 0, 0.95);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-content {
  text-align: center;
  max-width: 400px;
  padding: 2rem;
}

.loop-animation {
  margin-bottom: 1.5rem;
}

.loop-icon {
  font-size: 4rem;
  display: inline-block;
  animation: loopSpin 2s linear infinite;
}

@keyframes loopSpin {
  to { transform: rotate(360deg); }
}

.modal-content h2 {
  font-size: 1.5rem;
  color: var(--red);
  margin-bottom: 1rem;
}

.modal-content p {
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 1.5rem;
}

/* HERO */
.res-hero {
  min-height: 100vh;
  display: flex;
  align-items: center;
  position: relative;
  padding: 6rem 2rem;
}

.container {
  position: relative;
  z-index: 2;
  max-width: 1100px;
  margin: 0 auto;
}

.neo-status {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.1);
  max-width: fit-content;
}

.status-avatar {
  position: relative;
  width: 50px;
  height: 50px;
  background: rgba(255, 0, 102, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-icon {
  font-size: 1.5rem;
}

.avatar-glitch {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  border: 2px solid var(--red);
  animation: glitchPulse 2s ease-in-out infinite;
}

@keyframes glitchPulse {
  0%, 100% { opacity: 0.5; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.1); }
}

.status-info {
  display: flex;
  flex-direction: column;
}

.info-name {
  font-weight: bold;
  font-size: 0.9rem;
}

.info-role {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.5);
}

.info-note {
  font-size: 0.65rem;
  color: var(--red);
  font-style: italic;
}

.hero-title {
  margin-bottom: 2rem;
}

.title-pre {
  display: block;
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.4);
  letter-spacing: 0.2em;
}

.title-main {
  display: block;
  font-size: clamp(3rem, 10vw, 7rem);
  font-weight: 200;
  margin: 0.5rem 0;
}

.word--matrix {
  background: linear-gradient(90deg, var(--green), var(--red));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.title-sub {
  display: block;
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.5);
  font-style: italic;
}

.hero-quote {
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.6);
  max-width: 500px;
  margin-bottom: 2rem;
}

/* PILL CHOICE NEW */
.pill-choice-new {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.pill-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: transparent;
  border: 2px solid;
  cursor: pointer;
  transition: all 0.3s;
  font-family: inherit;
}

.pill-btn--red {
  border-color: var(--red);
  color: var(--red);
}

.pill-btn--blue {
  border-color: #0066ff;
  color: #0066ff;
}

.pill-btn:hover,
.pill-btn.active {
  transform: scale(1.05);
}

.pill-btn--red:hover,
.pill-btn--red.active {
  background: var(--red);
  color: #fff;
  box-shadow: 0 0 30px var(--red);
}

.pill-btn--blue:hover,
.pill-btn--blue.active {
  background: #0066ff;
  color: #fff;
  box-shadow: 0 0 30px #0066ff;
}

.pill-color {
  width: 12px;
  height: 20px;
  border-radius: 6px;
  background: currentColor;
}

.pill-label {
  font-size: 0.8rem;
  font-weight: bold;
}

.pill-or {
  color: rgba(255, 255, 255, 0.3);
  font-size: 0.8rem;
}

.choice-result {
  padding: 1rem;
  background: rgba(255, 255, 255, 0.02);
  border-left: 3px solid var(--green);
}

.choice-result p {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
}

/* BUTTONS */
.res-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: none;
  cursor: pointer;
  font-family: inherit;
  font-size: 0.9rem;
  transition: all 0.3s;
  text-decoration: none;
}

.res-btn--primary {
  background: linear-gradient(90deg, var(--green), var(--cyan));
  color: var(--black);
}

.res-btn--secondary {
  background: transparent;
  border: 1px solid var(--red);
  color: var(--red);
}

.res-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(0, 255, 255, 0.3);
}

/* SECTIONS */
.res-section {
  min-height: 100vh;
  padding: 6rem 2rem;
}

.section-header {
  text-align: center;
  margin-bottom: 3rem;
}

.header-icon {
  display: block;
  font-size: 3rem;
  margin-bottom: 0.5rem;
}

.section-header h2 {
  font-size: clamp(1.5rem, 5vw, 3rem);
  font-weight: 200;
  background: linear-gradient(90deg, var(--green), var(--red));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.section-sub {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.4);
}

/* DEJA VU */
.timeline-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.timeline-card {
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
  transition: all 0.3s;
}

.timeline-card:hover {
  border-color: var(--green);
}

.card-year {
  font-size: 0.7rem;
  color: var(--cyan);
  margin-bottom: 0.5rem;
}

.card-icon {
  font-size: 2rem;
  display: block;
  margin-bottom: 0.5rem;
}

.timeline-card h3 {
  font-size: 1rem;
  color: #fff;
  margin-bottom: 0.25rem;
}

.timeline-card p {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.5);
}

.card-loop {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  font-size: 0.6rem;
  color: var(--red);
  padding: 0.2rem 0.4rem;
  border: 1px solid var(--red);
}

.bugs-quote {
  max-width: 500px;
  margin: 0 auto;
  text-align: center;
  padding: 2rem;
  background: rgba(255, 0, 102, 0.05);
  border: 1px solid rgba(255, 0, 102, 0.2);
}

.quote-avatar {
  font-size: 2rem;
  display: block;
  margin-bottom: 1rem;
}

.bugs-quote p {
  font-style: italic;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 0.5rem;
}

.quote-author {
  font-size: 0.8rem;
  color: var(--red);
}

/* GAMES / MODAL */
.modal-section {
  background: linear-gradient(180deg, var(--black), #0f0010);
}

.games-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.game-card {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.1);
  overflow: hidden;
  transition: all 0.3s;
}

.game-card:hover {
  border-color: var(--accent);
  transform: translateY(-5px);
}

.game-cover {
  height: 120px;
  background: linear-gradient(135deg, var(--accent), transparent);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  cursor: pointer;
}

.cover-icon {
  font-size: 3rem;
}

.cover-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s;
}

.game-card:hover .cover-overlay {
  opacity: 1;
}

.overlay-text {
  color: var(--accent);
  font-weight: bold;
  font-size: 0.9rem;
}

.game-info {
  padding: 1.25rem;
}

.game-info h3 {
  font-size: 1rem;
  color: #fff;
  margin-bottom: 0.25rem;
}

.game-genre {
  font-size: 0.7rem;
  color: var(--accent);
  margin-bottom: 0.5rem;
}

.game-desc {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.5);
  margin-bottom: 0.75rem;
}

.game-meta {
  display: flex;
  gap: 1rem;
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.4);
}

/* UPGRADES */
.upgrades-section {
  background: linear-gradient(180deg, #0f0010, var(--black));
}

.upgrades-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 1rem;
}

.upgrade-card {
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.1);
  text-align: center;
  min-height: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s;
}

.upgrade-card:hover {
  border-color: var(--cyan);
}

.upgrade-card.unlocked {
  border-color: var(--green);
}

.upgrade-lock {
  font-size: 2rem;
  opacity: 0.3;
}

.upgrade-icon {
  font-size: 2rem;
  display: block;
  margin-bottom: 0.5rem;
}

.upgrade-card h4 {
  font-size: 0.85rem;
  color: #fff;
  margin-bottom: 0.25rem;
}

.upgrade-card p {
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.5);
  margin-bottom: 0.5rem;
}

.upgrade-bar {
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  margin-bottom: 0.25rem;
}

.upgrade-level {
  font-size: 0.65rem;
  color: var(--green);
}

/* IO */
.io-section {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
}

.io-card {
  text-align: center;
  max-width: 500px;
  padding: 3rem;
  background: linear-gradient(135deg, rgba(0, 255, 0, 0.02), rgba(255, 0, 102, 0.02));
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.io-icon {
  font-size: 3rem;
  display: block;
  margin-bottom: 1rem;
}

.io-card h2 {
  font-size: 3rem;
  font-weight: 200;
  background: linear-gradient(90deg, var(--green), var(--cyan));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 0.5rem;
}

.io-sub {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.4);
  margin-bottom: 2rem;
}

.io-message {
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.02);
  margin-bottom: 2rem;
}

.io-message p {
  font-style: italic;
  color: rgba(255, 255, 255, 0.7);
}

.io-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 1.5rem;
}

.io-footer {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.3);
  font-style: italic;
}

/* SYNC COUNTER */
.sync-counter {
  position: fixed;
  bottom: 1rem;
  right: 1rem;
  padding: 0.5rem 1rem;
  background: rgba(0, 0, 0, 0.8);
  border: 1px solid var(--red);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s;
}

.sync-counter.synced {
  border-color: var(--green);
}

.sync-icon {
  font-size: 0.8rem;
}

.sync-text {
  font-size: 0.7rem;
  color: currentColor;
}

.sync-counter:not(.synced) {
  color: var(--red);
}

.sync-counter.synced {
  color: var(--green);
}

/* RESPONSIVE */
@media (max-width: 768px) {
  .neo-status {
    flex-direction: column;
    text-align: center;
  }
  
  .pill-choice-new {
    flex-direction: column;
  }
  
  .io-actions {
    flex-direction: column;
  }
}

/* A11Y */
@media (prefers-reduced-motion: reduce) {
  .rain,
  .loop-icon,
  .avatar-glitch {
    animation: none !important;
  }
}
</style>
