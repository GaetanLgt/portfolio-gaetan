<template>
  <div class="vendetta-page">
    <a href="#main-content" class="skip-link">Aller au contenu principal</a>

    <!-- V MASK CURSOR -->
    <div class="mask-cursor" :style="{ left: mouseX + 'px', top: mouseY + 'px' }" aria-hidden="true">
      <span class="mask-icon">🎭</span>
    </div>

    <!-- HERO : Remember Remember -->
    <section id="hero" class="v-hero" aria-labelledby="hero-title">
      <div class="hero-bg" aria-hidden="true">
        <div class="dominoes">
          <div class="domino" v-for="i in 20" :key="i" :style="{ '--delay': i * 0.1 + 's' }"></div>
        </div>
        <div class="parliament-silhouette"></div>
      </div>

      <div class="container" id="main-content">
        <div class="v-symbol">
          <span class="v-letter">V</span>
          <div class="v-circle"></div>
        </div>

        <h1 id="hero-title" class="hero-title">
          <span class="title-remember">Remember, Remember</span>
          <span class="title-fifth">The Fifth of November</span>
        </h1>

        <p class="hero-quote">
          « People should not be afraid of their governments. 
          Governments should be afraid of their people. »
        </p>

        <div class="date-display">
          <span class="date-day">05</span>
          <span class="date-month">NOV</span>
          <span class="date-year">{{ currentYear }}</span>
        </div>

        <button class="revolution-btn" @click="scrollTo('idea')">
          <span class="btn-icon">⚔️</span>
          <span class="btn-text">BEGIN REVOLUTION</span>
        </button>
      </div>
    </section>

    <!-- IDEA : Philosophy -->
    <section id="idea" class="v-section idea-section" aria-labelledby="idea-title">
      <div class="container">
        <div class="section-header">
          <span class="header-icon">💡</span>
          <h2 id="idea-title">THE IDEA</h2>
          <p class="section-sub">Beneath this mask there is an idea</p>
        </div>

        <div class="idea-content">
          <div class="idea-cards">
            <div class="idea-card idea-card--fear">
              <div class="card-mask" aria-hidden="true">😰</div>
              <h3>FEAR</h3>
              <p>Dependence on proprietary systems. Lock-in. Data harvesting.</p>
              <div class="card-verdict">THE OLD WAY</div>
            </div>
            <div class="idea-card idea-card--freedom">
              <div class="card-mask" aria-hidden="true">🎭</div>
              <h3>FREEDOM</h3>
              <p>Sovereign infrastructure. Local AI. Own your data.</p>
              <div class="card-verdict">THE NEW WAY</div>
            </div>
          </div>

          <blockquote class="v-quote">
            <p>« Ideas are bulletproof. »</p>
          </blockquote>
        </div>
      </div>
    </section>

    <!-- ARSENAL : Skills -->
    <section id="arsenal" class="v-section arsenal-section" aria-labelledby="arsenal-title">
      <div class="container">
        <div class="section-header">
          <span class="header-icon">🗡️</span>
          <h2 id="arsenal-title">THE ARSENAL</h2>
          <p class="section-sub">Tools of the revolution</p>
        </div>

        <div class="arsenal-grid">
          <article v-for="weapon in weapons" :key="weapon.name" class="weapon-card">
            <div class="weapon-icon">{{ weapon.icon }}</div>
            <h3>{{ weapon.name }}</h3>
            <p>{{ weapon.desc }}</p>
            <div class="weapon-power">
              <div class="power-bar" :style="{ width: weapon.power + '%' }"></div>
            </div>
            <div class="weapon-tag">{{ weapon.tag }}</div>
          </article>
        </div>
      </div>
    </section>

    <!-- GALLERY : Projects as Dominoes -->
    <section id="gallery" class="v-section gallery-section" aria-labelledby="gallery-title">
      <div class="container">
        <div class="section-header">
          <span class="header-icon">🎯</span>
          <h2 id="gallery-title">THE GALLERY</h2>
          <p class="section-sub">Each domino falls, leading to the next</p>
        </div>

        <div class="domino-chain">
          <div 
            v-for="(project, index) in projects" 
            :key="project.id"
            class="project-domino"
            :class="{ 'domino--fallen': fallenDominoes.includes(index) }"
            @click="knockDomino(index)"
          >
            <div class="domino-face domino-face--front">
              <span class="domino-icon">{{ project.icon }}</span>
              <span class="domino-name">{{ project.name }}</span>
            </div>
            <div class="domino-face domino-face--top">
              <span class="domino-type">{{ project.type }}</span>
            </div>
          </div>
        </div>

        <p class="gallery-hint">Click to start the chain reaction</p>
      </div>
    </section>

    <!-- BROADCAST : Message -->
    <section id="broadcast" class="v-section broadcast-section" aria-labelledby="broadcast-title">
      <div class="container">
        <div class="section-header">
          <span class="header-icon">📺</span>
          <h2 id="broadcast-title">THE BROADCAST</h2>
          <p class="section-sub">A message to the people</p>
        </div>

        <div class="tv-frame">
          <div class="tv-screen">
            <div class="static-noise" aria-hidden="true"></div>
            <div class="broadcast-content">
              <div class="speaker-mask">🎭</div>
              <div class="speech">
                <p class="speech-line" v-for="(line, i) in speechLines" :key="i"
                   :class="{ 'line--visible': i <= currentSpeechLine }">
                  {{ line }}
                </p>
              </div>
            </div>
          </div>
          <div class="tv-controls">
            <span class="tv-brand">BTN</span>
            <div class="tv-buttons">
              <span class="tv-btn"></span>
              <span class="tv-btn"></span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- JOIN : Contact -->
    <section id="join" class="v-section join-section" aria-labelledby="join-title">
      <div class="join-bg" aria-hidden="true">
        <div class="fireworks">
          <span class="firework firework--1">✨</span>
          <span class="firework firework--2">💥</span>
          <span class="firework firework--3">✨</span>
        </div>
      </div>

      <div class="container">
        <h2 id="join-title" class="join-title">
          <span class="pre">THE REVOLUTION</span>
          <span class="main">BEGINS WITH YOU</span>
        </h2>

        <p class="join-text">
          Every great change starts with a single spark.<br>
          Will you light the flame?
        </p>

        <router-link to="/contact" class="join-btn">
          <span class="btn-icon">🎭</span>
          <span class="btn-text">JOIN THE CAUSE</span>
        </router-link>

        <div class="join-footer" aria-hidden="true">
          <span>« THE ONLY VERDICT IS VENGEANCE »</span>
        </div>
      </div>
    </section>

    <!-- V Counter -->
    <div class="v-counter" aria-hidden="true">
      <span class="counter-v">V</span>
      <span class="counter-date">05.11</span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const mouseX = ref(0);
const mouseY = ref(0);
const currentYear = ref(new Date().getFullYear());
const fallenDominoes = ref([]);
const currentSpeechLine = ref(-1);

const weapons = [
  { name: 'SYMFONY', icon: '⚙️', desc: 'Backend fortress architecture', power: 95, tag: 'CORE' },
  { name: 'VUE.JS', icon: '🎨', desc: 'Revolutionary interfaces', power: 88, tag: 'FRONTEND' },
  { name: 'DOCKER', icon: '🐳', desc: 'Portable infrastructure', power: 82, tag: 'DEVOPS' },
  { name: 'OLLAMA', icon: '🧠', desc: 'Local AI liberation', power: 78, tag: 'AI' },
  { name: 'N8N', icon: '🔄', desc: 'Workflow automation', power: 85, tag: 'AUTOMATION' },
  { name: 'SOVEREIGNTY', icon: '🏴', desc: 'Zero cloud dependency', power: 100, tag: 'FREEDOM' }
];

const projects = [
  { id: 1, name: 'ARKADIA', icon: '🛡️', type: 'Community' },
  { id: 2, name: 'GL DIGITAL', icon: '⚡', type: 'Business' },
  { id: 3, name: 'NEURAL OPS', icon: '🧠', type: 'AI' },
  { id: 4, name: 'PORTFOLIO', icon: '🌐', type: 'Showcase' },
  { id: 5, name: 'OBSIDIAN', icon: '📚', type: 'Knowledge' },
  { id: 6, name: 'DISCORD BOT', icon: '🤖', type: 'Automation' }
];

const speechLines = [
  'Good evening, digital citizens.',
  'I am but a humble developer.',
  'I come not to destroy, but to build.',
  'To construct systems that serve the people,',
  'Not corporations that harvest your data.',
  'The revolution is sovereignty.',
  'Own your infrastructure. Own your AI.',
  'Own your future.'
];

const knockDomino = (index) => {
  if (fallenDominoes.value.length === 0) {
    // Start chain reaction
    for (let i = index; i < projects.length; i++) {
      setTimeout(() => {
        fallenDominoes.value.push(i);
      }, (i - index) * 300);
    }
    // Also knock backwards
    for (let i = index - 1; i >= 0; i--) {
      setTimeout(() => {
        fallenDominoes.value.push(i);
      }, (index - i) * 300);
    }
  } else {
    // Reset
    fallenDominoes.value = [];
  }
};

const scrollTo = (id) => {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
};

const handleMouseMove = (e) => {
  mouseX.value = e.clientX;
  mouseY.value = e.clientY;
};

let speechInterval = null;

onMounted(() => {
  document.addEventListener('mousemove', handleMouseMove);
  
  speechInterval = setInterval(() => {
    if (currentSpeechLine.value < speechLines.length - 1) {
      currentSpeechLine.value++;
    } else {
      currentSpeechLine.value = -1;
    }
  }, 2000);
});

onUnmounted(() => {
  document.removeEventListener('mousemove', handleMouseMove);
  clearInterval(speechInterval);
});
</script>

<style scoped>
.vendetta-page {
  --red: #8b0000;
  --red-bright: #dc143c;
  --gold: #d4af37;
  --black: #0a0a0a;
  --white: #f5f5f5;
  background: var(--black);
  color: var(--white);
  min-height: 100vh;
  font-family: 'Georgia', serif;
  overflow-x: hidden;
  cursor: none;
}

/* MASK CURSOR */
.mask-cursor {
  position: fixed; z-index: 9999; pointer-events: none;
  transform: translate(-50%, -50%); font-size: 1.5rem;
  transition: all 0.1s ease;
}

/* HERO */
.v-hero {
  min-height: 100vh; display: flex; align-items: center;
  position: relative; padding: 6rem 2rem;
}
.hero-bg { position: absolute; inset: 0; overflow: hidden; }
.dominoes {
  position: absolute; bottom: 20%; left: 0; right: 0;
  display: flex; justify-content: center; gap: 10px;
}
.domino {
  width: 20px; height: 50px; background: var(--white);
  transform-origin: bottom; animation: dominoFall 3s ease-in-out infinite;
  animation-delay: var(--delay);
}
@keyframes dominoFall {
  0%, 80%, 100% { transform: rotate(0deg); }
  90% { transform: rotate(80deg); }
}
.parliament-silhouette {
  position: absolute; bottom: 0; left: 0; right: 0; height: 30%;
  background: linear-gradient(180deg, transparent 0%, rgba(139, 0, 0, 0.2) 100%);
}

.container { position: relative; z-index: 2; max-width: 1100px; margin: 0 auto; text-align: center; }

.v-symbol { margin-bottom: 2rem; position: relative; display: inline-block; }
.v-letter {
  font-size: 8rem; font-weight: bold; color: var(--red-bright);
  text-shadow: 0 0 50px var(--red);
}
.v-circle {
  position: absolute; inset: -20px; border: 3px solid var(--red-bright);
  border-radius: 50%; animation: vPulse 2s ease-in-out infinite;
}
@keyframes vPulse { 50% { transform: scale(1.1); opacity: 0.5; } }

.hero-title { margin-bottom: 2rem; }
.title-remember {
  display: block; font-size: clamp(1rem, 3vw, 1.5rem);
  font-style: italic; color: rgba(245, 245, 245, 0.6);
}
.title-fifth {
  display: block; font-size: clamp(2rem, 6vw, 4rem);
  color: var(--red-bright); text-shadow: 0 0 30px var(--red);
}

.hero-quote {
  font-size: 1.1rem; font-style: italic; color: rgba(245, 245, 245, 0.7);
  max-width: 500px; margin: 0 auto 2rem; line-height: 1.8;
}

.date-display {
  display: flex; justify-content: center; gap: 1rem; margin-bottom: 2rem;
}
.date-day { font-size: 3rem; color: var(--red-bright); font-weight: bold; }
.date-month { font-size: 1.5rem; color: var(--gold); align-self: flex-end; }
.date-year { font-size: 1rem; color: rgba(245, 245, 245, 0.5); align-self: flex-end; }

.revolution-btn, .join-btn {
  display: inline-flex; align-items: center; gap: 0.75rem;
  padding: 1rem 2rem; background: transparent;
  border: 2px solid var(--red-bright); color: var(--red-bright);
  font-family: inherit; font-size: 1rem; letter-spacing: 0.1em;
  cursor: none; transition: all 0.3s; text-decoration: none;
}
.revolution-btn:hover, .join-btn:hover {
  background: var(--red-bright); color: var(--black);
}

/* SECTIONS */
.v-section { min-height: 100vh; padding: 6rem 2rem; position: relative; }
.section-header { text-align: center; margin-bottom: 4rem; }
.header-icon { display: block; font-size: 2rem; margin-bottom: 0.5rem; }
.section-header h2 {
  font-size: clamp(1.5rem, 4vw, 2.5rem);
  color: var(--red-bright); letter-spacing: 0.15em;
}
.section-sub { font-size: 0.9rem; color: rgba(245, 245, 245, 0.5); font-style: italic; margin-top: 0.5rem; }

/* IDEA */
.idea-section { background: linear-gradient(180deg, var(--black) 0%, #1a0a0a 100%); }
.idea-cards { display: grid; grid-template-columns: repeat(2, 1fr); gap: 2rem; margin-bottom: 2rem; }
.idea-card {
  padding: 2rem; border: 1px solid rgba(245, 245, 245, 0.1);
  text-align: center; transition: all 0.3s;
}
.idea-card--fear { background: rgba(0, 0, 0, 0.5); }
.idea-card--freedom { background: rgba(139, 0, 0, 0.2); border-color: var(--red-bright); }
.card-mask { font-size: 3rem; margin-bottom: 1rem; }
.idea-card h3 { font-size: 1.5rem; color: var(--red-bright); margin-bottom: 1rem; }
.idea-card p { font-size: 0.95rem; color: rgba(245, 245, 245, 0.7); line-height: 1.7; margin-bottom: 1rem; }
.card-verdict { font-size: 0.75rem; color: rgba(245, 245, 245, 0.4); letter-spacing: 0.2em; }
.idea-card--freedom .card-verdict { color: var(--gold); }

.v-quote { text-align: center; }
.v-quote p { font-size: 1.5rem; font-style: italic; color: var(--red-bright); }

/* ARSENAL */
.arsenal-section { background: #1a0a0a; }
.arsenal-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.5rem; }
.weapon-card {
  padding: 1.5rem; background: rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(139, 0, 0, 0.3); text-align: center;
  transition: all 0.3s;
}
.weapon-card:hover { border-color: var(--red-bright); transform: translateY(-5px); }
.weapon-icon { font-size: 2.5rem; margin-bottom: 1rem; }
.weapon-card h3 { font-size: 1.1rem; color: var(--red-bright); margin-bottom: 0.5rem; }
.weapon-card p { font-size: 0.85rem; color: rgba(245, 245, 245, 0.6); margin-bottom: 1rem; }
.weapon-power { height: 4px; background: rgba(245, 245, 245, 0.1); margin-bottom: 1rem; }
.power-bar { height: 100%; background: linear-gradient(90deg, var(--red), var(--red-bright)); }
.weapon-tag { font-size: 0.7rem; color: var(--gold); letter-spacing: 0.1em; }

/* GALLERY */
.gallery-section { background: linear-gradient(180deg, #1a0a0a 0%, var(--black) 100%); }
.domino-chain {
  display: flex; justify-content: center; gap: 2rem;
  perspective: 1000px; margin-bottom: 2rem;
}
.project-domino {
  width: 80px; height: 150px; position: relative;
  transform-style: preserve-3d; cursor: none;
  transition: transform 0.5s ease;
}
.domino--fallen { transform: rotateX(90deg); }
.domino-face {
  position: absolute; backface-visibility: hidden;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  border: 2px solid var(--red-bright);
}
.domino-face--front {
  width: 100%; height: 100%; background: var(--black);
}
.domino-face--top {
  width: 100%; height: 30px; background: var(--red);
  transform: rotateX(-90deg) translateZ(15px);
  top: -15px;
}
.domino-icon { font-size: 2rem; margin-bottom: 0.5rem; }
.domino-name { font-size: 0.6rem; color: var(--red-bright); text-align: center; }
.domino-type { font-size: 0.5rem; color: var(--white); }
.gallery-hint { text-align: center; font-size: 0.85rem; color: rgba(245, 245, 245, 0.4); font-style: italic; }

/* BROADCAST */
.broadcast-section { background: var(--black); }
.tv-frame {
  max-width: 600px; margin: 0 auto;
  background: #1a1a1a; border-radius: 20px; padding: 20px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
}
.tv-screen {
  aspect-ratio: 4/3; background: #0a0a0a;
  border-radius: 10px; overflow: hidden; position: relative;
}
.static-noise {
  position: absolute; inset: 0; opacity: 0.05;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
  animation: staticFlicker 0.1s infinite;
}
@keyframes staticFlicker { 50% { opacity: 0.08; } }
.broadcast-content { position: relative; z-index: 2; padding: 2rem; text-align: center; }
.speaker-mask { font-size: 4rem; margin-bottom: 1rem; }
.speech-line {
  font-size: 0.9rem; color: rgba(245, 245, 245, 0.3);
  margin-bottom: 0.5rem; transition: all 0.5s;
}
.line--visible { color: var(--red-bright); }
.tv-controls {
  display: flex; justify-content: space-between; align-items: center;
  padding-top: 15px;
}
.tv-brand { font-size: 0.8rem; color: rgba(245, 245, 245, 0.3); }
.tv-buttons { display: flex; gap: 10px; }
.tv-btn { width: 15px; height: 15px; background: #333; border-radius: 50%; }

/* JOIN */
.join-section {
  display: flex; align-items: center; justify-content: center;
  min-height: 100vh; text-align: center; position: relative;
}
.join-bg { position: absolute; inset: 0; }
.fireworks { position: absolute; inset: 0; }
.firework {
  position: absolute; font-size: 2rem;
  animation: fireworkBurst 3s ease-in-out infinite;
}
.firework--1 { top: 20%; left: 20%; }
.firework--2 { top: 30%; right: 25%; animation-delay: 1s; }
.firework--3 { bottom: 40%; left: 30%; animation-delay: 2s; }
@keyframes fireworkBurst {
  0%, 100% { transform: scale(0); opacity: 0; }
  50% { transform: scale(1.5); opacity: 1; }
}

.join-title { margin-bottom: 1rem; }
.join-title .pre { display: block; font-size: 1rem; color: rgba(245, 245, 245, 0.5); font-style: italic; }
.join-title .main {
  display: block; font-size: clamp(2rem, 6vw, 4rem);
  color: var(--red-bright); text-shadow: 0 0 40px var(--red);
}
.join-text { color: rgba(245, 245, 245, 0.6); margin-bottom: 2rem; line-height: 1.8; font-style: italic; }
.join-footer { margin-top: 3rem; font-size: 0.8rem; color: rgba(139, 0, 0, 0.5); }

/* V COUNTER */
.v-counter {
  position: fixed; bottom: 1rem; right: 1rem;
  display: flex; flex-direction: column; align-items: center;
  padding: 0.5rem 1rem; background: rgba(0,0,0,0.8);
  border: 1px solid var(--red);
}
.counter-v { font-size: 1.5rem; color: var(--red-bright); font-weight: bold; }
.counter-date { font-size: 0.7rem; color: rgba(245, 245, 245, 0.5); }

/* RESPONSIVE */
@media (max-width: 768px) {
  .vendetta-page { cursor: auto; }
  .mask-cursor { display: none; }
  .idea-cards { grid-template-columns: 1fr; }
  .domino-chain { flex-wrap: wrap; gap: 1rem; }
  .project-domino { width: 60px; height: 120px; }
}

/* A11Y */
@media (prefers-reduced-motion: reduce) {
  .domino, .v-circle, .static-noise, .firework { animation: none !important; }
}
</style>
