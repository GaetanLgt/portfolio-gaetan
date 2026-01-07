<template>
  <div class="gits-page">
    <a href="#main-content" class="skip-link">Aller au contenu principal</a>

    <!-- NEURAL NETWORK BG -->
    <div class="neural-bg" aria-hidden="true">
      <canvas ref="neuralCanvas" class="neural-canvas"></canvas>
    </div>

    <!-- HERO : Cyberspace Dive -->
    <section id="hero" class="gits-hero" aria-labelledby="hero-title">
      <div class="hero-glitch" aria-hidden="true">
        <div class="glitch-block glitch-block--1"></div>
        <div class="glitch-block glitch-block--2"></div>
        <div class="glitch-block glitch-block--3"></div>
      </div>

      <div class="container" id="main-content">
        <div class="hero-content">
          <div class="section9-badge">
            <span class="badge-icon">⬡</span>
            <span class="badge-text">SECTION 9</span>
          </div>

          <h1 id="hero-title" class="hero-title">
            <span class="title-jp">攻殻機動隊</span>
            <span class="title-en">GHOST IN THE SHELL</span>
            <span class="title-sub">Le Réseau est vaste et infini</span>
          </h1>

          <p class="hero-quote">
            « Et où va le nouveau-né à partir d'ici ? 
            Le réseau est vaste et infini. »
          </p>

          <div class="cyber-stats">
            <div class="stat">
              <span class="stat-icon">🧠</span>
              <span class="stat-val">{{ brainUsage }}%</span>
              <span class="stat-lbl">Cybercerveau</span>
            </div>
            <div class="stat">
              <span class="stat-icon">👁️</span>
              <span class="stat-val">ACTIF</span>
              <span class="stat-lbl">Optiques</span>
            </div>
            <div class="stat">
              <span class="stat-icon">🔗</span>
              <span class="stat-val">CONNECTÉ</span>
              <span class="stat-lbl">Plongée Réseau</span>
            </div>
          </div>

          <button class="dive-btn" @click="scrollTo('ghost')">
            <span class="btn-scan"></span>
            <span class="btn-text">PLONGER DANS LE RÉSEAU</span>
          </button>
        </div>

        <div class="motoko-silhouette" aria-hidden="true">
          <div class="silhouette-body"></div>
          <div class="silhouette-ports">
            <span class="port port--1"></span>
            <span class="port port--2"></span>
            <span class="port port--3"></span>
          </div>
        </div>
      </div>
    </section>

    <!-- GHOST : Identity / About -->
    <section id="ghost" class="gits-section ghost-section" aria-labelledby="ghost-title">
      <div class="container">
        <div class="section-header">
          <span class="header-kanji">魂</span>
          <h2 id="ghost-title">LE GHOST</h2>
          <p class="section-sub">Qu'est-ce qui définit votre identité ?</p>
        </div>

        <div class="ghost-content">
          <div class="identity-card">
            <div class="card-header">
              <div class="avatar-frame">
                <div class="avatar-glitch">GL</div>
              </div>
              <div class="card-info">
                <h3>GAËTAN LANGLET</h3>
                <p class="alias">// alias : NEO</p>
              </div>
            </div>
            <div class="card-body">
              <div class="data-row">
                <span class="data-key">DÉSIGNATION :</span>
                <span class="data-val">Développeur Full-Stack</span>
              </div>
              <div class="data-row">
                <span class="data-key">SPÉCIALISATION :</span>
                <span class="data-val">Intégration IA & Automatisation</span>
              </div>
              <div class="data-row">
                <span class="data-key">AFFILIATION :</span>
                <span class="data-val">GL Digital Lab</span>
              </div>
              <div class="data-row">
                <span class="data-key">LOCALISATION :</span>
                <span class="data-val">Limoges, France</span>
              </div>
              <div class="data-row">
                <span class="data-key">INTÉGRITÉ_GHOST :</span>
                <span class="data-val data-val--good">100%</span>
              </div>
            </div>
          </div>

          <blockquote class="ghost-quote">
            <p>« Ton effort pour rester ce que tu es, c'est ce qui te limite. »</p>
            <cite>— Le Marionnettiste</cite>
          </blockquote>
        </div>
      </div>
    </section>

    <!-- SHELL : Skills / Tech Stack -->
    <section id="shell" class="gits-section shell-section" aria-labelledby="shell-title">
      <div class="container">
        <div class="section-header">
          <span class="header-kanji">殻</span>
          <h2 id="shell-title">LE SHELL</h2>
          <p class="section-sub">Augmentations du corps prosthétique</p>
        </div>

        <div class="augments-grid">
          <article v-for="aug in augmentations" :key="aug.name" class="augment-card">
            <div class="aug-icon">{{ aug.icon }}</div>
            <div class="aug-info">
              <h3>{{ aug.name }}</h3>
              <p>{{ aug.desc }}</p>
              <div class="aug-bar">
                <div class="bar-fill" :style="{ width: aug.level + '%' }"></div>
              </div>
              <div class="aug-specs">
                <span v-for="spec in aug.specs" :key="spec">{{ spec }}</span>
              </div>
            </div>
            <div class="aug-status">
              <span class="status-light"></span>
              EN LIGNE
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- NET : Projects / Portfolio -->
    <section id="net" class="gits-section net-section" aria-labelledby="net-title">
      <div class="container">
        <div class="section-header">
          <span class="header-kanji">網</span>
          <h2 id="net-title">LE RÉSEAU</h2>
          <p class="section-sub">Nœuds connectés dans le réseau</p>
        </div>

        <div class="net-visualization">
          <div class="central-node">
            <span class="node-icon">⬡</span>
            <span class="node-label">NOYAU GL</span>
          </div>
          
          <div class="node-ring">
            <div 
              v-for="(node, index) in netNodes" 
              :key="node.id"
              class="net-node"
              :style="{ '--angle': (index * 60) + 'deg' }"
              @mouseenter="activeNode = node.id"
              @mouseleave="activeNode = null"
            >
              <div class="node-content">
                <span class="node-icon">{{ node.icon }}</span>
                <span class="node-name">{{ node.name }}</span>
              </div>
              <div class="node-link" aria-hidden="true"></div>
            </div>
          </div>
        </div>

        <div class="node-details" v-if="activeNode">
          <div class="detail-card">
            <h4>{{ getNodeById(activeNode)?.name }}</h4>
            <p>{{ getNodeById(activeNode)?.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- STAND ALONE COMPLEX : Philosophy -->
    <section id="sac" class="gits-section sac-section" aria-labelledby="sac-title">
      <div class="container">
        <div class="section-header">
          <span class="header-kanji">複</span>
          <h2 id="sac-title">STAND ALONE COMPLEX</h2>
          <p class="section-sub">Comportement émergent d'individus connectés</p>
        </div>

        <div class="sac-content">
          <div class="laughing-man" aria-hidden="true">
            <div class="lm-circle">
              <span class="lm-text">Je pensais que je ferais semblant d'être un de ces sourds-muets</span>
            </div>
            <div class="lm-face">😊</div>
          </div>

          <div class="philosophy-text">
            <p>
              Comme le phénomène Stand Alone Complex, le développement moderne repose sur 
              des individus agissant indépendamment tout en créant des motifs émergents. 
              Chaque projet, chaque ligne de code, contribue à quelque chose de plus grand.
            </p>
            <p class="highlight">
              « Nous tissons notre propre ghost dans le shell que nous créons. »
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- CONTACT : Hack Access -->
    <section id="access" class="gits-section access-section" aria-labelledby="access-title">
      <div class="access-bg" aria-hidden="true">
        <div class="matrix-rain"></div>
      </div>

      <div class="container">
        <h2 id="access-title" class="access-title">
          <span class="pre">ÉTABLIR</span>
          <span class="main">CONNEXION</span>
        </h2>

        <p class="access-text">
          Prêt à plonger ensemble dans le réseau ?<br>
          Ouvrez un canal sécurisé.
        </p>

        <router-link to="/contact" class="access-btn">
          <span class="btn-scan"></span>
          <span class="btn-text">INITIER LE LIEN</span>
        </router-link>

        <div class="access-footer" aria-hidden="true">
          <span>// FIN DE TRANSMISSION</span>
        </div>
      </div>
    </section>

    <!-- Brain Activity Monitor -->
    <div class="brain-monitor" aria-hidden="true">
      <div class="monitor-wave"></div>
      <span class="monitor-label">ACTIVITÉ NEURALE</span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';

const brainUsage = ref(87);
const activeNode = ref(null);
let brainInterval = null;

const augmentations = [
  { 
    name: 'CYBERCERVEAU', 
    icon: '🧠', 
    desc: 'Architecture backend & conception d\'API',
    level: 95,
    specs: ['Symfony 8', 'PHP 8.3+', 'PostgreSQL']
  },
  { 
    name: 'CAMOUFLAGE OPTIQUE', 
    icon: '👁️', 
    desc: 'Interfaces frontend & design visuel',
    level: 88,
    specs: ['Vue 3', 'Three.js', 'TypeScript']
  },
  { 
    name: 'BRAS PROSTHÉTIQUES', 
    icon: '🦾', 
    desc: 'DevOps & automatisation d\'infrastructure',
    level: 82,
    specs: ['Docker', 'n8n', 'CI/CD']
  },
  { 
    name: 'PLONGÉE RÉSEAU', 
    icon: '🔌', 
    desc: 'Intégration IA & réseaux neuronaux',
    level: 78,
    specs: ['Ollama', 'RAG', 'ChromaDB']
  }
];

const netNodes = [
  { id: 1, name: 'ARKADIA', icon: '🛡️', desc: 'Cluster communauté gaming - 150+ utilisateurs' },
  { id: 2, name: 'GL DIGITAL', icon: '⚡', desc: 'Studio de développement & services IA' },
  { id: 3, name: 'NEURAL OPS', icon: '🧠', desc: 'Workflows IA automatisés' },
  { id: 4, name: 'PORTFOLIO', icon: '🌐', desc: 'Vitrine multi-univers' },
  { id: 5, name: 'OBSIDIAN', icon: '📚', desc: 'Système de base de connaissances' },
  { id: 6, name: 'DISCORD', icon: '🤖', desc: 'Réseau d\'automatisation bot' }
];

const getNodeById = (id) => netNodes.find(n => n.id === id);

const scrollTo = (id) => {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
};

onMounted(() => {
  brainInterval = setInterval(() => {
    brainUsage.value = 80 + Math.floor(Math.random() * 18);
  }, 2000);
});

onUnmounted(() => clearInterval(brainInterval));
</script>

<style scoped>
.gits-page {
  --cyan: #00d4ff;
  --magenta: #ff00ff;
  --green: #00ff41;
  --bg: #0a0a12;
  --bg-dark: #050508;
  background: var(--bg);
  color: #e0e0e0;
  min-height: 100vh;
  font-family: 'JetBrains Mono', monospace;
  overflow-x: hidden;
  position: relative;
}

/* NEURAL BG */
.neural-bg { position: fixed; inset: 0; z-index: 0; opacity: 0.3; }
.neural-canvas { width: 100%; height: 100%; }

/* HERO */
.gits-hero {
  min-height: 100vh; display: flex; align-items: center;
  position: relative; padding: 6rem 2rem;
}
.hero-glitch { position: absolute; inset: 0; pointer-events: none; }
.glitch-block {
  position: absolute; background: var(--cyan); opacity: 0.1;
  animation: glitchMove 8s ease-in-out infinite;
}
.glitch-block--1 { top: 20%; left: 10%; width: 100px; height: 2px; }
.glitch-block--2 { top: 50%; right: 15%; width: 150px; height: 1px; animation-delay: 2s; }
.glitch-block--3 { bottom: 30%; left: 30%; width: 80px; height: 3px; animation-delay: 4s; }
@keyframes glitchMove {
  0%, 100% { transform: translateX(0); opacity: 0.1; }
  50% { transform: translateX(20px); opacity: 0.3; }
}

.container { position: relative; z-index: 2; max-width: 1100px; margin: 0 auto; }

.section9-badge {
  display: inline-flex; align-items: center; gap: 0.5rem;
  padding: 0.5rem 1rem; background: rgba(0,212,255,0.1);
  border: 1px solid var(--cyan); margin-bottom: 1.5rem;
}
.badge-icon { color: var(--cyan); }
.badge-text { font-size: 0.7rem; letter-spacing: 0.2em; color: var(--cyan); }

.hero-title { margin-bottom: 2rem; }
.title-jp {
  display: block; font-size: clamp(1rem, 3vw, 1.5rem);
  color: var(--magenta); letter-spacing: 0.3em; margin-bottom: 0.5rem;
}
.title-en {
  display: block; font-size: clamp(2rem, 6vw, 4rem);
  color: var(--cyan); letter-spacing: 0.1em;
  text-shadow: 0 0 30px rgba(0,212,255,0.5);
}
.title-sub {
  display: block; font-size: 0.9rem; color: rgba(224,224,224,0.5);
  font-style: italic; margin-top: 0.5rem;
}

.hero-quote {
  font-size: 1rem; font-style: italic; color: rgba(224,224,224,0.6);
  max-width: 400px; line-height: 1.8; margin-bottom: 2rem;
}

.cyber-stats { display: flex; gap: 2rem; margin-bottom: 2rem; }
.stat { text-align: center; }
.stat-icon { display: block; font-size: 1.5rem; margin-bottom: 0.25rem; }
.stat-val { display: block; font-size: 1.25rem; color: var(--cyan); }
.stat-lbl { font-size: 0.65rem; color: rgba(224,224,224,0.5); letter-spacing: 0.1em; }

.dive-btn, .access-btn {
  display: inline-flex; align-items: center; gap: 0.75rem;
  padding: 1rem 2rem; background: transparent;
  border: 1px solid var(--cyan); color: var(--cyan);
  font-family: inherit; font-size: 0.9rem; letter-spacing: 0.15em;
  cursor: pointer; transition: all 0.3s; text-decoration: none;
  position: relative; overflow: hidden;
}
.btn-scan {
  position: absolute; top: 0; left: -100%; width: 100%; height: 100%;
  background: linear-gradient(90deg, transparent, rgba(0,212,255,0.2), transparent);
  animation: scanLine 2s infinite;
}
@keyframes scanLine { to { left: 100%; } }
.dive-btn:hover, .access-btn:hover {
  background: rgba(0,212,255,0.1); box-shadow: 0 0 30px rgba(0,212,255,0.3);
}

.motoko-silhouette {
  position: absolute; right: 5%; top: 50%; transform: translateY(-50%);
  width: 200px; height: 400px; opacity: 0.2;
}
.silhouette-body {
  width: 100%; height: 100%;
  background: linear-gradient(180deg, var(--cyan) 0%, transparent 100%);
  clip-path: polygon(30% 0%, 70% 0%, 80% 30%, 75% 100%, 25% 100%, 20% 30%);
}
.silhouette-ports { position: absolute; left: 40%; top: 20%; }
.port {
  display: block; width: 8px; height: 8px; background: var(--magenta);
  border-radius: 50%; margin-bottom: 15px;
  box-shadow: 0 0 10px var(--magenta);
}

/* SECTIONS */
.gits-section { min-height: 100vh; padding: 6rem 2rem; position: relative; }
.section-header { text-align: center; margin-bottom: 4rem; }
.header-kanji { display: block; font-size: 3rem; color: var(--magenta); opacity: 0.3; margin-bottom: 0.5rem; }
.section-header h2 {
  font-size: clamp(1.5rem, 4vw, 2.5rem); color: var(--cyan);
  letter-spacing: 0.2em; text-shadow: 0 0 20px rgba(0,212,255,0.3);
}
.section-sub { font-size: 0.85rem; color: rgba(224,224,224,0.5); margin-top: 0.5rem; }

/* GHOST */
.ghost-section { background: linear-gradient(180deg, var(--bg) 0%, var(--bg-dark) 100%); }
.ghost-content { max-width: 600px; margin: 0 auto; }
.identity-card {
  background: rgba(0,0,0,0.5); border: 1px solid var(--cyan);
  margin-bottom: 2rem; overflow: hidden;
}
.card-header {
  display: flex; align-items: center; gap: 1rem;
  padding: 1.5rem; background: rgba(0,212,255,0.05);
  border-bottom: 1px solid rgba(0,212,255,0.2);
}
.avatar-frame {
  width: 60px; height: 60px; border: 2px solid var(--cyan);
  display: flex; align-items: center; justify-content: center;
}
.avatar-glitch { font-size: 1.5rem; color: var(--cyan); font-weight: bold; }
.card-info h3 { font-size: 1rem; color: var(--cyan); margin-bottom: 0.25rem; }
.alias { font-size: 0.75rem; color: var(--magenta); }
.card-body { padding: 1.5rem; }
.data-row {
  display: flex; justify-content: space-between; padding: 0.5rem 0;
  border-bottom: 1px solid rgba(255,255,255,0.05); font-size: 0.8rem;
}
.data-key { color: rgba(224,224,224,0.5); }
.data-val { color: var(--cyan); }
.data-val--good { color: var(--green); }

.ghost-quote { text-align: center; }
.ghost-quote p { font-style: italic; color: rgba(224,224,224,0.6); font-size: 1.1rem; }
.ghost-quote cite { display: block; color: var(--magenta); font-size: 0.85rem; margin-top: 0.5rem; }

/* SHELL */
.shell-section { background: var(--bg-dark); }
.augments-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem; }
.augment-card {
  background: rgba(10,10,18,0.9); border: 1px solid rgba(0,212,255,0.2);
  padding: 1.5rem; position: relative; transition: all 0.3s;
}
.augment-card:hover { border-color: var(--cyan); box-shadow: 0 0 30px rgba(0,212,255,0.2); }
.aug-icon { font-size: 2rem; margin-bottom: 1rem; }
.aug-info h3 { font-size: 1rem; color: var(--cyan); margin-bottom: 0.5rem; }
.aug-info p { font-size: 0.8rem; color: rgba(224,224,224,0.6); margin-bottom: 1rem; }
.aug-bar { height: 4px; background: rgba(255,255,255,0.1); margin-bottom: 1rem; }
.bar-fill { height: 100%; background: linear-gradient(90deg, var(--cyan), var(--magenta)); }
.aug-specs { display: flex; flex-wrap: wrap; gap: 0.5rem; }
.aug-specs span {
  padding: 0.2rem 0.5rem; background: rgba(0,212,255,0.1);
  font-size: 0.65rem; color: var(--cyan);
}
.aug-status {
  position: absolute; top: 1rem; right: 1rem;
  display: flex; align-items: center; gap: 0.5rem;
  font-size: 0.65rem; color: var(--green);
}
.status-light {
  width: 6px; height: 6px; background: var(--green);
  border-radius: 50%; box-shadow: 0 0 10px var(--green);
}

/* NET */
.net-section { background: linear-gradient(180deg, var(--bg-dark) 0%, var(--bg) 100%); }
.net-visualization { position: relative; height: 400px; margin-bottom: 2rem; }
.central-node {
  position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
  width: 100px; height: 100px; background: rgba(0,212,255,0.1);
  border: 2px solid var(--cyan); border-radius: 50%;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  box-shadow: 0 0 30px rgba(0,212,255,0.3);
}
.central-node .node-icon { font-size: 2rem; color: var(--cyan); }
.central-node .node-label { font-size: 0.6rem; color: var(--cyan); margin-top: 0.25rem; }

.node-ring { position: absolute; inset: 0; }
.net-node {
  position: absolute; top: 50%; left: 50%;
  transform: rotate(var(--angle)) translateY(-150px) rotate(calc(-1 * var(--angle)));
  cursor: pointer; transition: all 0.3s;
}
.net-node:hover { transform: rotate(var(--angle)) translateY(-150px) rotate(calc(-1 * var(--angle))) scale(1.2); }
.node-content {
  display: flex; flex-direction: column; align-items: center;
  padding: 0.75rem; background: rgba(10,10,18,0.9);
  border: 1px solid rgba(0,212,255,0.3); min-width: 80px;
}
.node-content .node-icon { font-size: 1.5rem; }
.node-name { font-size: 0.6rem; color: var(--cyan); margin-top: 0.25rem; }
.node-link {
  position: absolute; top: 100%; left: 50%; width: 1px; height: 80px;
  background: linear-gradient(180deg, var(--cyan), transparent);
  transform-origin: top;
}

.node-details { text-align: center; }
.detail-card {
  display: inline-block; padding: 1rem 2rem;
  background: rgba(0,212,255,0.1); border: 1px solid var(--cyan);
}
.detail-card h4 { color: var(--cyan); margin-bottom: 0.5rem; }
.detail-card p { font-size: 0.85rem; color: rgba(224,224,224,0.7); }

/* SAC */
.sac-section { background: var(--bg); }
.sac-content { display: flex; flex-direction: column; align-items: center; gap: 2rem; }
.laughing-man {
  position: relative; width: 150px; height: 150px;
  animation: lmSpin 20s linear infinite;
}
@keyframes lmSpin { to { transform: rotate(360deg); } }
.lm-circle {
  position: absolute; inset: 0; border: 2px solid var(--cyan); border-radius: 50%;
  display: flex; align-items: center; justify-content: center; padding: 1rem;
}
.lm-text {
  font-size: 0.35rem; color: var(--cyan); text-align: center;
  animation: lmSpinReverse 20s linear infinite;
}
@keyframes lmSpinReverse { to { transform: rotate(-360deg); } }
.lm-face {
  position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
  font-size: 3rem;
}
.philosophy-text { max-width: 500px; text-align: center; }
.philosophy-text p { font-size: 0.95rem; color: rgba(224,224,224,0.7); line-height: 1.8; margin-bottom: 1rem; }
.highlight { color: var(--magenta) !important; font-style: italic; }

/* ACCESS */
.access-section {
  display: flex; align-items: center; justify-content: center;
  min-height: 100vh; text-align: center; position: relative;
}
.access-bg { position: absolute; inset: 0; }
.matrix-rain {
  position: absolute; inset: 0; opacity: 0.1;
  background: repeating-linear-gradient(
    0deg, transparent, transparent 2px, var(--green) 2px, var(--green) 4px
  );
  background-size: 20px 20px;
  animation: matrixFall 10s linear infinite;
}
@keyframes matrixFall { to { background-position: 0 100px; } }

.access-title { margin-bottom: 1rem; }
.access-title .pre { display: block; font-size: 0.9rem; color: rgba(224,224,224,0.5); letter-spacing: 0.2em; }
.access-title .main {
  display: block; font-size: clamp(2rem, 5vw, 3.5rem); color: var(--cyan);
  text-shadow: 0 0 30px rgba(0,212,255,0.5);
}
.access-text { color: rgba(224,224,224,0.6); margin-bottom: 2rem; line-height: 1.8; }
.access-footer { margin-top: 3rem; font-size: 0.7rem; color: rgba(0,212,255,0.3); }

/* BRAIN MONITOR */
.brain-monitor {
  position: fixed; bottom: 70px; left: 1rem;
  padding: 0.5rem 1rem; background: rgba(0,0,0,0.8);
  border: 1px solid var(--cyan); font-size: 0.65rem;
  z-index: 50;
}
.monitor-wave {
  height: 20px; width: 100px;
  background: linear-gradient(90deg, var(--cyan), var(--magenta), var(--cyan));
  background-size: 200% 100%;
  animation: waveMove 2s linear infinite;
  clip-path: polygon(0 50%, 5% 30%, 10% 50%, 15% 70%, 20% 50%, 25% 20%, 30% 50%, 35% 80%, 40% 50%, 45% 30%, 50% 50%, 55% 60%, 60% 50%, 65% 40%, 70% 50%, 75% 70%, 80% 50%, 85% 25%, 90% 50%, 95% 60%, 100% 50%);
}
@keyframes waveMove { to { background-position: -200% 0; } }
.monitor-label { display: block; color: var(--cyan); margin-top: 0.25rem; }

/* RESPONSIVE */
@media (max-width: 768px) {
  .cyber-stats { flex-direction: column; gap: 1rem; }
  .motoko-silhouette { display: none; }
  .net-visualization { height: 300px; }
  .net-node { transform: rotate(var(--angle)) translateY(-100px) rotate(calc(-1 * var(--angle))); }
}

/* A11Y */
@media (prefers-reduced-motion: reduce) {
  .glitch-block, .btn-scan, .laughing-man, .lm-text, .matrix-rain, .monitor-wave { animation: none !important; }
}
</style>
