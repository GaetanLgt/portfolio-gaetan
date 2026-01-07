<template>
  <div class="matrix-page">
    <a href="#main-content" class="skip-link">Aller au contenu principal</a>

    <!-- DIGITAL RAIN -->
    <canvas ref="matrixCanvas" class="matrix-rain" aria-hidden="true"></canvas>

    <!-- PILL CHOICE -->
    <div class="pill-overlay" v-if="showPillChoice" @click.self="showPillChoice = false">
      <div class="pill-container">
        <h2>FAIS TON CHOIX</h2>
        <p>Tu prends la pilule bleue, l'histoire s'arrête. Tu prends la pilule rouge, tu restes au Pays des Merveilles.</p>
        <div class="pills">
          <button class="pill pill--blue" @click="choosePill('blue')">
            <span class="pill-icon">💊</span>
            <span class="pill-text">PILULE BLEUE</span>
            <span class="pill-sub">Retour à l'illusion</span>
          </button>
          <button class="pill pill--red" @click="choosePill('red')">
            <span class="pill-icon">💊</span>
            <span class="pill-text">PILULE ROUGE</span>
            <span class="pill-sub">Découvre la vérité</span>
          </button>
        </div>
      </div>
    </div>

    <!-- HERO -->
    <section id="hero" class="matrix-hero" aria-labelledby="hero-title">
      <div class="container" id="main-content">
        <div class="terminal-prompt">
          <span class="prompt-cursor">_</span>
          <span class="prompt-text" ref="terminalText"></span>
        </div>

        <h1 id="hero-title" class="hero-title">
          <span class="title-pre">RÉVEILLE-TOI</span>
          <span class="title-main glitch" data-text="NEO">NEO</span>
          <span class="title-sub">La Matrice te retient prisonnier</span>
        </h1>

        <p class="hero-quote">
          « Je vais te montrer jusqu'où va le terrier du lapin blanc. »
        </p>

        <div class="status-display">
          <div class="status-item">
            <span class="status-icon">🔴</span>
            <span class="status-val">ÉVEILLÉ</span>
            <span class="status-label">STATUT</span>
          </div>
          <div class="status-item">
            <span class="status-icon">🧠</span>
            <span class="status-val">LIBÉRÉ</span>
            <span class="status-label">ESPRIT</span>
          </div>
          <div class="status-item">
            <span class="status-icon">⚡</span>
            <span class="status-val">{{ skillLevel }}%</span>
            <span class="status-label">KUNG-FU</span>
          </div>
        </div>

        <button class="matrix-btn" @click="showPillChoice = true">
          <span class="btn-icon">💊</span>
          <span class="btn-text">FAIS TON CHOIX</span>
        </button>
      </div>
    </section>

    <!-- UNPLUGGED : About -->
    <section id="unplugged" class="matrix-section" aria-labelledby="unplugged-title">
      <div class="container">
        <div class="section-header">
          <span class="header-icon">🔌</span>
          <h2 id="unplugged-title">DÉBRANCHÉ</h2>
          <p class="section-sub">La vérité sur le développeur derrière le code</p>
        </div>

        <div class="reality-grid">
          <div class="reality-card card--matrix">
            <div class="card-header">DANS LA MATRICE</div>
            <ul class="card-list">
              <li>👔 Employé de bureau</li>
              <li>💻 Code pendant la journée</li>
              <li>😴 Dort paisiblement</li>
              <li>🐑 Suit les règles</li>
            </ul>
          </div>
          <div class="reality-vs">VS</div>
          <div class="reality-card card--real">
            <div class="card-header">MONDE RÉEL</div>
            <ul class="card-list">
              <li>🦾 Opérateur du Nebuchadnezzar</li>
              <li>⚡ Défie les lois de la physique</li>
              <li>🧘 Maîtrise le code source</li>
              <li>🔓 Libère les esprits</li>
            </ul>
          </div>
        </div>

        <div class="morpheus-quote">
          <span class="quote-icon">🕶️</span>
          <p>« Tu es ici parce que tu sais quelque chose. Ce que tu sais, tu ne peux pas l'expliquer. Mais tu le sens. »</p>
        </div>
      </div>
    </section>

    <!-- TRAINING PROGRAM : Skills -->
    <section id="training" class="matrix-section training-section" aria-labelledby="training-title">
      <div class="container">
        <div class="section-header">
          <span class="header-icon">🥋</span>
          <h2 id="training-title">PROGRAMME D'ENTRAÎNEMENT</h2>
          <p class="section-sub">« Je connais le Kung-Fu. » — « Montre-moi. »</p>
        </div>

        <div class="programs-grid">
          <div v-for="prog in programs" :key="prog.name" class="program-card" @click="loadProgram(prog)">
            <div class="program-loading" v-if="prog.loading">
              <div class="loading-bar"><div class="bar-progress" :style="{ width: prog.progress + '%' }"></div></div>
              <span class="loading-text">CHARGEMENT... {{ prog.progress }}%</span>
            </div>
            <div class="program-content" v-else>
              <span class="program-icon">{{ prog.icon }}</span>
              <h3>{{ prog.name }}</h3>
              <p>{{ prog.desc }}</p>
              <div class="program-level">
                <div class="level-bar"><div class="bar-fill" :style="{ width: prog.level + '%' }"></div></div>
                <span>{{ prog.level }}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- MISSIONS : Projects -->
    <section id="missions" class="matrix-section missions-section" aria-labelledby="missions-title">
      <div class="container">
        <div class="section-header">
          <span class="header-icon">📡</span>
          <h2 id="missions-title">MISSIONS</h2>
          <p class="section-sub">Opérations dans la Matrice et le monde réel</p>
        </div>

        <div class="missions-grid">
          <article v-for="mission in missions" :key="mission.id" class="mission-card">
            <div class="card-status" :class="mission.status">{{ mission.statusLabel }}</div>
            <div class="card-content">
              <span class="card-icon">{{ mission.icon }}</span>
              <h3>{{ mission.name }}</h3>
              <p class="card-type">{{ mission.type }}</p>
              <p class="card-desc">{{ mission.desc }}</p>
              <div class="card-tech">
                <span v-for="t in mission.tech" :key="t">{{ t }}</span>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- ORACLE : Contact -->
    <section id="oracle" class="matrix-section oracle-section" aria-labelledby="oracle-title">
      <div class="container">
        <div class="oracle-card">
          <span class="oracle-icon">🍪</span>
          <h2 id="oracle-title">L'ORACLE</h2>
          <p class="oracle-text">« Je ne suis pas là pour te dire comment ça va finir. Je suis là pour te dire comment ça va commencer. »</p>
          <router-link to="/contact" class="matrix-btn">
            <span class="btn-text">CONSULTER L'ORACLE</span>
          </router-link>
          <p class="oracle-cookie">Prends un cookie. Tu te sentiras mieux.</p>
        </div>
      </div>
    </section>

    <!-- CODE COUNTER -->
    <div class="code-counter" aria-hidden="true">
      <span class="counter-label">LIGNES DE CODE</span>
      <span class="counter-val">{{ codeLines.toLocaleString() }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue';

const matrixCanvas = ref(null);
const terminalText = ref(null);
const showPillChoice = ref(false);
const skillLevel = ref(0);
const codeLines = ref(0);

const programs = reactive([
  { name: 'SYMFONY', icon: '⚙️', desc: 'Combat backend avancé', level: 95, loading: false, progress: 0 },
  { name: 'VUE.JS', icon: '🎨', desc: 'Manipulation de la réalité UI', level: 88, loading: false, progress: 0 },
  { name: 'DOCKER', icon: '🐳', desc: 'Création d\'environnements', level: 82, loading: false, progress: 0 },
  { name: 'IA LOCALE', icon: '🧠', desc: 'Intelligence artificielle', level: 78, loading: false, progress: 0 },
  { name: 'N8N', icon: '🔄', desc: 'Automatisation des flux', level: 85, loading: false, progress: 0 },
  { name: 'THREE.JS', icon: '🌐', desc: 'Simulation 3D', level: 75, loading: false, progress: 0 }
]);

const missions = [
  { id: 1, name: 'ARKADIA', icon: '🛡️', type: 'Serveur Zion', status: 'active', statusLabel: 'ACTIF', desc: 'Communauté de résistants gamers', tech: ['Nitrado', 'Discord'] },
  { id: 2, name: 'GL DIGITAL', icon: '⚡', type: 'Nebuchadnezzar', status: 'active', statusLabel: 'ACTIF', desc: 'Vaisseau de développement', tech: ['Symfony', 'Vue'] },
  { id: 3, name: 'NEURAL OPS', icon: '🧠', type: 'Broadcast', status: 'complete', statusLabel: 'TERMINÉ', desc: 'Diffusion IA souveraine', tech: ['Ollama', 'RAG'] },
  { id: 4, name: 'PORTFOLIO', icon: '🌐', type: 'Construct', status: 'active', statusLabel: 'ACTIF', desc: 'Programme de chargement', tech: ['Vue 3', 'Vite'] }
];

let animationId = null;
let codeInterval = null;

const choosePill = (color) => {
  showPillChoice.value = false;
  if (color === 'red') {
    skillLevel.value = 100;
    alert('🔴 Bienvenue dans le monde réel.\n\nTu as choisi de voir la vérité.');
  } else {
    alert('💙 Tu te réveilles dans ton lit et tu crois ce que tu veux croire.');
  }
};

const loadProgram = (prog) => {
  if (prog.loading) return;
  prog.loading = true;
  prog.progress = 0;
  
  const interval = setInterval(() => {
    prog.progress += Math.random() * 15;
    if (prog.progress >= 100) {
      prog.progress = 100;
      clearInterval(interval);
      setTimeout(() => {
        prog.loading = false;
        skillLevel.value = Math.min(100, skillLevel.value + 5);
      }, 500);
    }
  }, 100);
};

const typeWriter = (text, element, speed = 50) => {
  let i = 0;
  const type = () => {
    if (i < text.length && element) {
      element.textContent += text.charAt(i);
      i++;
      setTimeout(type, speed);
    }
  };
  type();
};

const initMatrixRain = () => {
  const canvas = matrixCanvas.value;
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  
  const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789';
  const fontSize = 14;
  const columns = canvas.width / fontSize;
  const drops = Array(Math.floor(columns)).fill(1);
  
  const draw = () => {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = '#00ff00';
    ctx.font = `${fontSize}px monospace`;
    
    for (let i = 0; i < drops.length; i++) {
      const text = chars[Math.floor(Math.random() * chars.length)];
      ctx.fillText(text, i * fontSize, drops[i] * fontSize);
      
      if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
        drops[i] = 0;
      }
      drops[i]++;
    }
    
    animationId = requestAnimationFrame(draw);
  };
  
  draw();
};

onMounted(() => {
  initMatrixRain();
  
  setTimeout(() => {
    if (terminalText.value) {
      typeWriter('Wake up, Neo...', terminalText.value, 100);
    }
  }, 1000);
  
  codeInterval = setInterval(() => {
    codeLines.value += Math.floor(Math.random() * 100);
  }, 500);
  
  skillLevel.value = 42;
});

onUnmounted(() => {
  if (animationId) cancelAnimationFrame(animationId);
  if (codeInterval) clearInterval(codeInterval);
});
</script>

<style scoped>
.matrix-page {
  --green: #00ff00;
  --dark-green: #003300;
  --black: #0a0a0a;
  background: var(--black);
  color: var(--green);
  min-height: 100vh;
  font-family: 'Courier New', monospace;
  overflow-x: hidden;
}

.matrix-rain {
  position: fixed;
  inset: 0;
  z-index: 0;
  opacity: 0.3;
}

/* PILL OVERLAY */
.pill-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: rgba(0, 0, 0, 0.95);
  display: flex;
  align-items: center;
  justify-content: center;
}

.pill-container {
  text-align: center;
  max-width: 600px;
  padding: 2rem;
}

.pill-container h2 {
  font-size: 2rem;
  color: var(--green);
  margin-bottom: 1rem;
}

.pill-container > p {
  color: rgba(0, 255, 0, 0.7);
  margin-bottom: 2rem;
  line-height: 1.6;
}

.pills {
  display: flex;
  gap: 2rem;
  justify-content: center;
  flex-wrap: wrap;
}

.pill {
  padding: 1.5rem 2rem;
  border: none;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s;
  min-width: 150px;
}

.pill--blue {
  background: linear-gradient(135deg, #0066cc, #003366);
  color: #66ccff;
}

.pill--red {
  background: linear-gradient(135deg, #cc0000, #660000);
  color: #ff6666;
}

.pill:hover {
  transform: scale(1.1);
  box-shadow: 0 0 30px currentColor;
}

.pill-icon {
  font-size: 2rem;
}

.pill-text {
  font-weight: bold;
  font-size: 0.9rem;
}

.pill-sub {
  font-size: 0.7rem;
  opacity: 0.7;
}

/* HERO */
.matrix-hero {
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

.terminal-prompt {
  margin-bottom: 2rem;
  font-size: 1.2rem;
}

.prompt-cursor {
  animation: blink 1s infinite;
}

@keyframes blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}

.hero-title {
  margin-bottom: 2rem;
}

.title-pre {
  display: block;
  font-size: 1rem;
  color: rgba(0, 255, 0, 0.5);
  letter-spacing: 0.3em;
}

.title-main {
  display: block;
  font-size: clamp(4rem, 15vw, 10rem);
  font-weight: bold;
  text-shadow: 0 0 20px var(--green), 0 0 40px var(--green);
}

.glitch {
  position: relative;
}

.glitch::before,
.glitch::after {
  content: attr(data-text);
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.glitch::before {
  animation: glitch-1 0.3s infinite;
  color: #ff0000;
  z-index: -1;
}

.glitch::after {
  animation: glitch-2 0.3s infinite;
  color: #0000ff;
  z-index: -2;
}

@keyframes glitch-1 {
  0%, 100% { clip-path: inset(40% 0 61% 0); transform: translate(-2px, 2px); }
  20% { clip-path: inset(92% 0 1% 0); transform: translate(2px, -2px); }
  40% { clip-path: inset(43% 0 1% 0); transform: translate(-2px, 2px); }
  60% { clip-path: inset(25% 0 58% 0); transform: translate(2px, -2px); }
  80% { clip-path: inset(54% 0 7% 0); transform: translate(-2px, 2px); }
}

@keyframes glitch-2 {
  0%, 100% { clip-path: inset(25% 0 58% 0); transform: translate(2px, -2px); }
  20% { clip-path: inset(54% 0 7% 0); transform: translate(-2px, 2px); }
  40% { clip-path: inset(40% 0 61% 0); transform: translate(2px, -2px); }
  60% { clip-path: inset(92% 0 1% 0); transform: translate(-2px, 2px); }
  80% { clip-path: inset(43% 0 1% 0); transform: translate(2px, -2px); }
}

.title-sub {
  display: block;
  font-size: 1rem;
  color: rgba(0, 255, 0, 0.6);
}

.hero-quote {
  font-style: italic;
  color: rgba(0, 255, 0, 0.6);
  max-width: 500px;
  margin-bottom: 2rem;
}

.status-display {
  display: flex;
  gap: 2rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.status-item {
  text-align: center;
}

.status-icon {
  display: block;
  font-size: 1.5rem;
}

.status-val {
  display: block;
  font-size: 1.2rem;
  color: var(--green);
  font-weight: bold;
}

.status-label {
  display: block;
  font-size: 0.6rem;
  color: rgba(0, 255, 0, 0.5);
}

.matrix-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 2rem;
  background: transparent;
  border: 2px solid var(--green);
  color: var(--green);
  font-family: inherit;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s;
  text-decoration: none;
}

.matrix-btn:hover {
  background: var(--green);
  color: var(--black);
  box-shadow: 0 0 30px var(--green);
}

/* SECTIONS */
.matrix-section {
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
  color: var(--green);
  text-shadow: 0 0 10px var(--green);
}

.section-sub {
  font-size: 0.9rem;
  color: rgba(0, 255, 0, 0.5);
}

/* UNPLUGGED */
.reality-grid {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  flex-wrap: wrap;
  margin-bottom: 3rem;
}

.reality-card {
  width: 280px;
  padding: 1.5rem;
  border: 1px solid;
}

.card--matrix {
  border-color: #0066cc;
  background: rgba(0, 102, 204, 0.1);
}

.card--real {
  border-color: var(--green);
  background: rgba(0, 255, 0, 0.05);
}

.card-header {
  font-size: 0.8rem;
  font-weight: bold;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid currentColor;
}

.card--matrix .card-header {
  color: #66ccff;
}

.card--real .card-header {
  color: var(--green);
}

.card-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.card-list li {
  padding: 0.5rem 0;
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.7);
}

.reality-vs {
  font-size: 1.5rem;
  color: var(--green);
  font-weight: bold;
}

.morpheus-quote {
  max-width: 600px;
  margin: 0 auto;
  text-align: center;
  padding: 2rem;
  border: 1px solid rgba(0, 255, 0, 0.2);
  background: rgba(0, 255, 0, 0.02);
}

.quote-icon {
  font-size: 2rem;
  display: block;
  margin-bottom: 1rem;
}

.morpheus-quote p {
  font-style: italic;
  color: rgba(0, 255, 0, 0.8);
  line-height: 1.6;
}

/* TRAINING */
.training-section {
  background: linear-gradient(180deg, var(--black), #001100);
}

.programs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1.5rem;
}

.program-card {
  padding: 1.5rem;
  border: 1px solid rgba(0, 255, 0, 0.3);
  background: rgba(0, 255, 0, 0.02);
  cursor: pointer;
  transition: all 0.3s;
  min-height: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.program-card:hover {
  border-color: var(--green);
  box-shadow: 0 0 20px rgba(0, 255, 0, 0.2);
}

.program-loading {
  text-align: center;
  width: 100%;
}

.loading-bar {
  height: 4px;
  background: rgba(0, 255, 0, 0.2);
  margin-bottom: 0.5rem;
}

.bar-progress {
  height: 100%;
  background: var(--green);
  transition: width 0.1s;
}

.loading-text {
  font-size: 0.7rem;
  color: var(--green);
}

.program-content {
  text-align: center;
}

.program-icon {
  font-size: 2rem;
  display: block;
  margin-bottom: 0.5rem;
}

.program-card h3 {
  font-size: 0.9rem;
  color: var(--green);
  margin-bottom: 0.25rem;
}

.program-card p {
  font-size: 0.7rem;
  color: rgba(0, 255, 0, 0.5);
  margin-bottom: 0.5rem;
}

.program-level {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.level-bar {
  flex: 1;
  height: 4px;
  background: rgba(0, 255, 0, 0.2);
}

.bar-fill {
  height: 100%;
  background: var(--green);
}

.program-level span {
  font-size: 0.7rem;
  color: var(--green);
}

/* MISSIONS */
.missions-section {
  background: linear-gradient(180deg, #001100, var(--black));
}

.missions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1.5rem;
}

.mission-card {
  border: 1px solid rgba(0, 255, 0, 0.3);
  background: rgba(0, 0, 0, 0.5);
  overflow: hidden;
}

.card-status {
  padding: 0.5rem 1rem;
  font-size: 0.7rem;
  font-weight: bold;
}

.card-status.active {
  background: var(--green);
  color: var(--black);
}

.card-status.complete {
  background: rgba(0, 255, 0, 0.2);
  color: var(--green);
}

.card-content {
  padding: 1.5rem;
  text-align: center;
}

.card-icon {
  font-size: 2.5rem;
}

.mission-card h3 {
  font-size: 1.1rem;
  color: var(--green);
  margin: 0.5rem 0;
}

.card-type {
  font-size: 0.65rem;
  color: rgba(0, 255, 0, 0.5);
  margin-bottom: 0.5rem;
}

.card-desc {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 0.75rem;
}

.card-tech {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.card-tech span {
  padding: 0.2rem 0.5rem;
  background: rgba(0, 255, 0, 0.1);
  border: 1px solid rgba(0, 255, 0, 0.3);
  font-size: 0.6rem;
  color: var(--green);
}

/* ORACLE */
.oracle-section {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
}

.oracle-card {
  text-align: center;
  max-width: 500px;
  padding: 3rem;
  border: 1px solid rgba(0, 255, 0, 0.3);
  background: rgba(0, 255, 0, 0.02);
}

.oracle-icon {
  font-size: 4rem;
  display: block;
  margin-bottom: 1rem;
}

.oracle-card h2 {
  font-size: 2rem;
  color: var(--green);
  margin-bottom: 1rem;
}

.oracle-text {
  font-style: italic;
  color: rgba(0, 255, 0, 0.7);
  margin-bottom: 2rem;
  line-height: 1.6;
}

.oracle-cookie {
  margin-top: 1.5rem;
  font-size: 0.8rem;
  color: rgba(0, 255, 0, 0.4);
}

/* CODE COUNTER */
.code-counter {
  position: fixed;
  bottom: 1rem;
  right: 1rem;
  padding: 0.5rem 1rem;
  background: rgba(0, 0, 0, 0.8);
  border: 1px solid var(--green);
  text-align: right;
}

.counter-label {
  display: block;
  font-size: 0.6rem;
  color: rgba(0, 255, 0, 0.5);
}

.counter-val {
  font-size: 1rem;
  color: var(--green);
  font-weight: bold;
}

/* RESPONSIVE */
@media (max-width: 768px) {
  .reality-grid {
    flex-direction: column;
  }
  
  .reality-vs {
    transform: rotate(90deg);
  }
  
  .status-display {
    flex-direction: column;
    gap: 1rem;
  }
  
  .pills {
    flex-direction: column;
  }
}

/* A11Y */
@media (prefers-reduced-motion: reduce) {
  .glitch::before,
  .glitch::after,
  .prompt-cursor {
    animation: none !important;
  }
}
</style>
