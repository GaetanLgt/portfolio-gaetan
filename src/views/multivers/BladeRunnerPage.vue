<template>
  <div class="blade-runner-page">
    <a href="#main-content" class="skip-link">Aller au contenu principal</a>

    <!-- RAIN EFFECT -->
    <div class="rain-overlay" aria-hidden="true">
      <div class="rain"></div>
    </div>

    <!-- NEON SIGNS -->
    <div class="neon-signs" aria-hidden="true">
      <span class="neon neon--1">人造人</span>
      <span class="neon neon--2">TYRELL</span>
      <span class="neon neon--3">複製人</span>
    </div>

    <!-- HERO : Los Angeles 2049 -->
    <section id="hero" class="br-hero" aria-labelledby="hero-title">
      <div class="hero-bg" aria-hidden="true">
        <div class="city-glow"></div>
        <div class="spinner" @click="spinnerActive = !spinnerActive" :class="{ active: spinnerActive }"></div>
      </div>

      <div class="container" id="main-content">
        <div class="tyrell-logo">
          <div class="pyramid"></div>
          <span class="logo-text">TYRELL CORP</span>
        </div>

        <h1 id="hero-title" class="hero-title">
          <span class="title-tag">MORE HUMAN</span>
          <span class="title-main">THAN HUMAN</span>
        </h1>

        <p class="hero-quote">
          « I've seen things you people wouldn't believe. Attack ships on fire 
          off the shoulder of Orion. I watched C-beams glitter in the dark 
          near the Tannhäuser Gate. »
        </p>

        <div class="replicant-counter">
          <div class="counter-item">
            <span class="counter-val">{{ projectCount }}</span>
            <span class="counter-lbl">Projects Active</span>
          </div>
          <div class="counter-item">
            <span class="counter-val">N7</span>
            <span class="counter-lbl">Model Series</span>
          </div>
          <div class="counter-item">
            <span class="counter-val">∞</span>
            <span class="counter-lbl">Lifespan</span>
          </div>
        </div>

        <button class="vk-btn" @click="scrollTo('test')">
          <span class="btn-eye">👁️</span>
          <span class="btn-text">BEGIN VK TEST</span>
        </button>
      </div>
    </section>

    <!-- VOIGHT-KAMPFF TEST : About -->
    <section id="test" class="br-section test-section" aria-labelledby="test-title">
      <div class="container">
        <div class="section-header">
          <span class="header-icon">👁️</span>
          <h2 id="test-title">VOIGHT-KAMPFF</h2>
          <p class="section-sub">Empathy Response Analysis</p>
        </div>

        <div class="vk-machine">
          <div class="machine-screen">
            <div class="eye-scanner">
              <div class="iris" :style="{ transform: `scale(${irisScale})` }"></div>
              <div class="pupil"></div>
              <div class="scan-line"></div>
            </div>
            <div class="readings">
              <div class="reading">
                <span class="reading-lbl">EMPATHY</span>
                <div class="reading-bar"><div class="bar-fill" style="width: 94%"></div></div>
              </div>
              <div class="reading">
                <span class="reading-lbl">RESPONSE</span>
                <div class="reading-bar"><div class="bar-fill" style="width: 87%"></div></div>
              </div>
              <div class="reading">
                <span class="reading-lbl">BASELINE</span>
                <div class="reading-bar"><div class="bar-fill" style="width: 91%"></div></div>
              </div>
            </div>
          </div>
          
          <div class="vk-result">
            <p class="result-question">« Describe in single words only the good things 
            that come into your mind about your mother. »</p>
            <p class="result-answer">Developer. Problem-solver. Builder of dreams made code.</p>
            <div class="result-verdict">
              <span class="verdict-icon">✓</span>
              <span class="verdict-text">HUMAN VERIFIED</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- REPLICANTS : Projects -->
    <section id="replicants" class="br-section replicants-section" aria-labelledby="replicants-title">
      <div class="container">
        <div class="section-header">
          <span class="header-icon">🧬</span>
          <h2 id="replicants-title">NEXUS MODELS</h2>
          <p class="section-sub">Engineered creations</p>
        </div>

        <div class="replicants-grid">
          <article v-for="rep in replicants" :key="rep.id" class="replicant-card">
            <div class="card-photo">
              <span class="photo-icon">{{ rep.icon }}</span>
              <div class="photo-glitch" aria-hidden="true"></div>
            </div>
            <div class="card-info">
              <div class="info-header">
                <span class="rep-model">{{ rep.model }}</span>
                <span class="rep-status" :class="'status--' + rep.status">{{ rep.status }}</span>
              </div>
              <h3>{{ rep.name }}</h3>
              <p class="rep-function">{{ rep.function }}</p>
              <p class="rep-desc">{{ rep.desc }}</p>
              <div class="rep-specs">
                <span v-for="spec in rep.specs" :key="spec">{{ spec }}</span>
              </div>
            </div>
            <div class="card-serial" aria-hidden="true">{{ rep.serial }}</div>
          </article>
        </div>
      </div>
    </section>

    <!-- MEMORIES : Experience -->
    <section id="memories" class="br-section memories-section" aria-labelledby="memories-title">
      <div class="container">
        <div class="section-header">
          <span class="header-icon">📷</span>
          <h2 id="memories-title">IMPLANTED MEMORIES</h2>
          <p class="section-sub">Or are they real?</p>
        </div>

        <div class="memories-grid">
          <div v-for="mem in memories" :key="mem.year" class="memory-card">
            <div class="memory-photo">
              <span class="photo-year">{{ mem.year }}</span>
            </div>
            <div class="memory-info">
              <h4>{{ mem.title }}</h4>
              <p>{{ mem.desc }}</p>
            </div>
          </div>
        </div>

        <blockquote class="memories-quote">
          <p>« All those moments will be lost in time, like tears in rain. »</p>
          <cite>— Roy Batty</cite>
        </blockquote>
      </div>
    </section>

    <!-- BASELINE : Skills -->
    <section id="baseline" class="br-section baseline-section" aria-labelledby="baseline-title">
      <div class="container">
        <div class="section-header">
          <span class="header-icon">📊</span>
          <h2 id="baseline-title">BASELINE TEST</h2>
          <p class="section-sub">Interlinked within cells</p>
        </div>

        <div class="baseline-test">
          <div class="baseline-prompt">
            <p class="prompt-line" v-for="(line, i) in baselineLines" :key="i"
               :class="{ 'line--highlight': i === currentLine }">
              {{ line }}
            </p>
          </div>

          <div class="baseline-skills">
            <div v-for="skill in skills" :key="skill.name" class="skill-bar">
              <div class="bar-header">
                <span class="skill-name">{{ skill.name }}</span>
                <span class="skill-val">{{ skill.level }}%</span>
              </div>
              <div class="bar-track">
                <div class="bar-fill" :style="{ width: skill.level + '%' }"></div>
              </div>
            </div>
          </div>
        </div>

        <div class="baseline-result">
          <span class="result-status">WITHIN BASELINE</span>
        </div>
      </div>
    </section>

    <!-- OFF-WORLD : Contact -->
    <section id="offworld" class="br-section offworld-section" aria-labelledby="offworld-title">
      <div class="offworld-bg" aria-hidden="true">
        <div class="blimp">
          <div class="blimp-body"></div>
          <div class="blimp-screen">A NEW LIFE AWAITS</div>
        </div>
      </div>

      <div class="container">
        <h2 id="offworld-title" class="offworld-title">
          <span class="pre">A NEW LIFE AWAITS YOU</span>
          <span class="main">OFF-WORLD</span>
        </h2>

        <p class="offworld-text">
          The chance to begin again in a golden land of opportunity and adventure.<br>
          Let's build something extraordinary together.
        </p>

        <router-link to="/contact" class="offworld-btn">
          <span class="btn-text">BEGIN NEW LIFE</span>
        </router-link>

        <div class="offworld-footer" aria-hidden="true">
          <span>LOS ANGELES // {{ currentYear }}</span>
        </div>
      </div>
    </section>

    <!-- Time/Location -->
    <div class="location-tag" aria-hidden="true">
      <span>LOS ANGELES</span>
      <span>SECTOR 7</span>
      <span>{{ currentTime }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const projectCount = ref(6);
const spinnerActive = ref(false);
const irisScale = ref(1);
const currentLine = ref(0);
const currentTime = ref('00:00');
const currentYear = ref('2049');

const replicants = [
  { id: 1, model: 'N7-ARK', name: 'ARKADIA', function: 'Community Guardian', icon: '🛡️', 
    desc: 'Gaming cluster management system', specs: ['Nitrado', 'Discord', '150+ Users'], 
    status: 'active', serial: 'ARK-2024-001' },
  { id: 2, model: 'N7-GLD', name: 'GL DIGITAL', function: 'Creator Unit', icon: '⚡',
    desc: 'Full-stack development studio', specs: ['Symfony', 'Vue.js', 'AI'],
    status: 'active', serial: 'GLD-2025-001' },
  { id: 3, model: 'N7-NEU', name: 'NEURAL OPS', function: 'Intelligence Core', icon: '🧠',
    desc: 'Local AI automation workflows', specs: ['n8n', 'Ollama', 'RAG'],
    status: 'active', serial: 'NEU-2024-003' },
  { id: 4, model: 'N7-PRT', name: 'PORTFOLIO', function: 'Showcase Unit', icon: '🌐',
    desc: 'Multi-universe experience platform', specs: ['Vue 3', 'Three.js', 'Vite'],
    status: 'active', serial: 'PRT-2025-001' }
];

const memories = [
  { year: '2020', title: 'The Awakening', desc: 'First lines of code. The journey begins.' },
  { year: '2022', title: 'Symfony Mastery', desc: 'Backend architecture takes shape.' },
  { year: '2024', title: 'ARKADIA Birth', desc: 'Community building at scale.' },
  { year: '2025', title: 'AI Integration', desc: 'Neural networks join the stack.' },
  { year: '2026', title: 'Independence', desc: 'GL Digital Lab launches.' }
];

const baselineLines = [
  'And blood-black nothingness began to spin...',
  'A system of cells interlinked within cells...',
  'Interlinked within one stem...',
  'And dreadfully distinct against the dark...',
  'A tall white fountain played.'
];

const skills = [
  { name: 'BACKEND SYSTEMS', level: 95 },
  { name: 'FRONTEND INTERFACE', level: 88 },
  { name: 'DEVOPS INFRASTRUCTURE', level: 82 },
  { name: 'AI INTEGRATION', level: 78 },
  { name: 'COMMUNITY MANAGEMENT', level: 90 }
];

const scrollTo = (id) => {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
};

let timeInterval = null;
let irisInterval = null;
let lineInterval = null;

onMounted(() => {
  timeInterval = setInterval(() => {
    const now = new Date();
    currentTime.value = now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });
  }, 1000);

  irisInterval = setInterval(() => {
    irisScale.value = 0.8 + Math.random() * 0.4;
  }, 2000);

  lineInterval = setInterval(() => {
    currentLine.value = (currentLine.value + 1) % baselineLines.length;
  }, 3000);
});

onUnmounted(() => {
  clearInterval(timeInterval);
  clearInterval(irisInterval);
  clearInterval(lineInterval);
});
</script>

<style scoped>
.blade-runner-page {
  --orange: #ff6b35;
  --cyan: #00d4ff;
  --pink: #ff1493;
  --yellow: #ffd700;
  --bg: #0a0a0f;
  --bg-dark: #050508;
  background: var(--bg);
  color: #c0c0c0;
  min-height: 100vh;
  font-family: 'Inter', -apple-system, sans-serif;
  overflow-x: hidden;
}

/* RAIN */
.rain-overlay { position: fixed; inset: 0; pointer-events: none; z-index: 1; }
.rain {
  position: absolute; inset: 0;
  background-image: linear-gradient(180deg, transparent 0%, rgba(0,212,255,0.1) 50%, transparent 50%);
  background-size: 1px 15px;
  animation: rainFall 0.3s linear infinite;
  opacity: 0.4;
}
@keyframes rainFall { to { background-position: 0 15px; } }

/* NEON SIGNS */
.neon-signs { position: fixed; inset: 0; pointer-events: none; z-index: 2; }
.neon {
  position: absolute; font-size: clamp(1rem, 3vw, 2rem);
  animation: neonFlicker 4s ease-in-out infinite;
}
.neon--1 { top: 20%; right: 5%; color: var(--pink); text-shadow: 0 0 20px var(--pink); }
.neon--2 { top: 40%; left: 3%; color: var(--orange); text-shadow: 0 0 20px var(--orange); animation-delay: 1s; }
.neon--3 { bottom: 30%; right: 8%; color: var(--cyan); text-shadow: 0 0 20px var(--cyan); animation-delay: 2s; }
@keyframes neonFlicker {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.8; }
  52% { opacity: 1; }
  54% { opacity: 0.6; }
  56% { opacity: 1; }
}

/* HERO */
.br-hero {
  min-height: 100vh; display: flex; align-items: center;
  position: relative; padding: 6rem 2rem;
}
.hero-bg { position: absolute; inset: 0; }
.city-glow {
  position: absolute; bottom: 0; left: 0; right: 0; height: 40%;
  background: linear-gradient(180deg, transparent 0%, rgba(255, 107, 53, 0.1) 100%);
}
.spinner {
  position: absolute; top: 15%; right: 10%; width: 80px; height: 40px;
  background: #1a1a2e; border: 1px solid var(--orange);
  cursor: pointer; transition: all 0.3s;
}
.spinner.active { box-shadow: 0 0 30px var(--orange); }

.container { position: relative; z-index: 10; max-width: 1100px; margin: 0 auto; }

.tyrell-logo { margin-bottom: 2rem; }
.pyramid {
  width: 0; height: 0;
  border-left: 30px solid transparent; border-right: 30px solid transparent;
  border-bottom: 50px solid var(--orange);
  margin-bottom: 0.5rem; opacity: 0.8;
}
.logo-text { font-size: 0.7rem; letter-spacing: 0.3em; color: var(--orange); }

.hero-title { margin-bottom: 2rem; }
.title-tag { display: block; font-size: 1rem; color: rgba(192,192,192,0.5); letter-spacing: 0.3em; }
.title-main {
  display: block; font-size: clamp(2.5rem, 7vw, 5rem); font-weight: 300;
  color: var(--orange); letter-spacing: 0.05em;
  text-shadow: 0 0 40px rgba(255, 107, 53, 0.5);
}

.hero-quote {
  font-size: 1rem; font-style: italic; color: rgba(192,192,192,0.6);
  max-width: 500px; line-height: 1.8; margin-bottom: 2rem;
}

.replicant-counter { display: flex; gap: 2.5rem; margin-bottom: 2rem; }
.counter-item { text-align: center; }
.counter-val { display: block; font-size: 2rem; color: var(--orange); }
.counter-lbl { font-size: 0.65rem; color: rgba(192,192,192,0.5); letter-spacing: 0.1em; }

.vk-btn, .offworld-btn {
  display: inline-flex; align-items: center; gap: 0.75rem;
  padding: 1rem 2rem; background: transparent;
  border: 1px solid var(--orange); color: var(--orange);
  font-family: inherit; font-size: 0.9rem; letter-spacing: 0.15em;
  cursor: pointer; transition: all 0.3s; text-decoration: none;
}
.vk-btn:hover, .offworld-btn:hover {
  background: rgba(255, 107, 53, 0.1); box-shadow: 0 0 30px rgba(255, 107, 53, 0.3);
}
.btn-eye { font-size: 1.25rem; }

/* SECTIONS */
.br-section { min-height: 100vh; padding: 6rem 2rem; position: relative; }
.section-header { text-align: center; margin-bottom: 4rem; }
.header-icon { display: block; font-size: 2rem; margin-bottom: 0.5rem; }
.section-header h2 {
  font-size: clamp(1.5rem, 4vw, 2.5rem); font-weight: 300;
  color: var(--orange); letter-spacing: 0.2em;
}
.section-sub { font-size: 0.85rem; color: rgba(192,192,192,0.5); margin-top: 0.5rem; }

/* VK TEST */
.test-section { background: linear-gradient(180deg, var(--bg) 0%, var(--bg-dark) 100%); }
.vk-machine { max-width: 700px; margin: 0 auto; }
.machine-screen {
  display: grid; grid-template-columns: 200px 1fr; gap: 2rem;
  padding: 2rem; background: rgba(0,0,0,0.5);
  border: 1px solid var(--orange); margin-bottom: 2rem;
}
.eye-scanner {
  width: 150px; height: 150px; position: relative;
  background: radial-gradient(circle, #1a3040 0%, #0a1520 100%);
  border-radius: 50%; border: 2px solid var(--cyan);
  display: flex; align-items: center; justify-content: center;
}
.iris {
  width: 100px; height: 100px; border-radius: 50%;
  background: radial-gradient(circle, #2a6090 0%, #1a4060 50%, #0a2030 100%);
  transition: transform 0.5s ease;
}
.pupil {
  position: absolute; width: 40px; height: 40px;
  background: #000; border-radius: 50%;
}
.scan-line {
  position: absolute; width: 100%; height: 2px;
  background: var(--cyan); animation: scanVK 2s linear infinite;
}
@keyframes scanVK {
  0% { top: 20%; opacity: 0; }
  50% { opacity: 1; }
  100% { top: 80%; opacity: 0; }
}

.readings { display: flex; flex-direction: column; gap: 1rem; }
.reading-lbl { display: block; font-size: 0.7rem; color: rgba(192,192,192,0.5); margin-bottom: 0.25rem; }
.reading-bar { height: 8px; background: rgba(255,255,255,0.1); }
.bar-fill { height: 100%; background: linear-gradient(90deg, var(--cyan), var(--orange)); }

.vk-result { text-align: center; }
.result-question { font-style: italic; color: rgba(192,192,192,0.6); margin-bottom: 1rem; }
.result-answer { color: var(--orange); font-size: 1.1rem; margin-bottom: 1.5rem; }
.result-verdict {
  display: inline-flex; align-items: center; gap: 0.5rem;
  padding: 0.5rem 1.5rem; background: rgba(0, 255, 0, 0.1);
  border: 1px solid #00ff00;
}
.verdict-icon { color: #00ff00; }
.verdict-text { font-size: 0.8rem; color: #00ff00; letter-spacing: 0.1em; }

/* REPLICANTS */
.replicants-section { background: var(--bg-dark); }
.replicants-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem; }
.replicant-card {
  background: rgba(10,10,18,0.9); border: 1px solid rgba(255, 107, 53, 0.2);
  overflow: hidden; transition: all 0.3s; position: relative;
}
.replicant-card:hover { border-color: var(--orange); box-shadow: 0 0 30px rgba(255, 107, 53, 0.2); }
.card-photo {
  height: 120px; background: linear-gradient(135deg, #1a1a2e 0%, #0a0a12 100%);
  display: flex; align-items: center; justify-content: center;
  position: relative; overflow: hidden;
}
.photo-icon { font-size: 3rem; }
.photo-glitch {
  position: absolute; inset: 0;
  background: linear-gradient(90deg, transparent 0%, rgba(255, 107, 53, 0.1) 50%, transparent 100%);
  animation: glitchScan 3s linear infinite;
}
@keyframes glitchScan { to { transform: translateX(200%); } }
.card-info { padding: 1.5rem; }
.info-header { display: flex; justify-content: space-between; margin-bottom: 0.5rem; }
.rep-model { font-size: 0.7rem; color: var(--cyan); }
.rep-status { font-size: 0.65rem; text-transform: uppercase; }
.status--active { color: #00ff00; }
.card-info h3 { font-size: 1.25rem; color: var(--orange); margin-bottom: 0.25rem; }
.rep-function { font-size: 0.75rem; color: rgba(192,192,192,0.5); margin-bottom: 0.75rem; }
.rep-desc { font-size: 0.85rem; color: rgba(192,192,192,0.7); margin-bottom: 1rem; }
.rep-specs { display: flex; flex-wrap: wrap; gap: 0.5rem; }
.rep-specs span {
  padding: 0.2rem 0.5rem; background: rgba(255, 107, 53, 0.1);
  font-size: 0.65rem; color: var(--orange);
}
.card-serial {
  position: absolute; bottom: 0.5rem; right: 0.5rem;
  font-size: 0.6rem; color: rgba(192,192,192,0.2); font-family: monospace;
}

/* MEMORIES */
.memories-section { background: linear-gradient(180deg, var(--bg-dark) 0%, var(--bg) 100%); }
.memories-grid { display: flex; gap: 1rem; overflow-x: auto; padding-bottom: 1rem; margin-bottom: 2rem; }
.memory-card { min-width: 200px; background: rgba(0,0,0,0.5); border: 1px solid rgba(192,192,192,0.1); }
.memory-photo {
  height: 100px; background: linear-gradient(135deg, #2a2a3e 0%, #1a1a2e 100%);
  display: flex; align-items: center; justify-content: center;
}
.photo-year { font-size: 2rem; color: var(--orange); opacity: 0.5; }
.memory-info { padding: 1rem; }
.memory-info h4 { font-size: 0.9rem; color: var(--orange); margin-bottom: 0.25rem; }
.memory-info p { font-size: 0.75rem; color: rgba(192,192,192,0.6); }

.memories-quote { text-align: center; }
.memories-quote p { font-size: 1.25rem; font-style: italic; color: rgba(192,192,192,0.6); }
.memories-quote cite { display: block; color: var(--orange); font-size: 0.9rem; margin-top: 0.5rem; }

/* BASELINE */
.baseline-section { background: var(--bg); }
.baseline-test { display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; max-width: 900px; margin: 0 auto 2rem; }
.baseline-prompt {
  padding: 1.5rem; background: rgba(0,0,0,0.5);
  border: 1px solid rgba(192,192,192,0.1);
}
.prompt-line { font-size: 0.9rem; color: rgba(192,192,192,0.4); margin-bottom: 0.75rem; transition: all 0.3s; }
.line--highlight { color: var(--orange); }

.baseline-skills { display: flex; flex-direction: column; gap: 1rem; }
.skill-bar { }
.bar-header { display: flex; justify-content: space-between; margin-bottom: 0.25rem; }
.skill-name { font-size: 0.75rem; color: rgba(192,192,192,0.7); }
.skill-val { font-size: 0.75rem; color: var(--orange); }
.bar-track { height: 6px; background: rgba(255,255,255,0.1); }
.bar-fill { height: 100%; background: linear-gradient(90deg, var(--orange), var(--pink)); }

.baseline-result { text-align: center; }
.result-status {
  display: inline-block; padding: 0.5rem 2rem;
  background: rgba(0, 255, 0, 0.1); border: 1px solid #00ff00;
  color: #00ff00; font-size: 0.8rem; letter-spacing: 0.2em;
}

/* OFF-WORLD */
.offworld-section {
  display: flex; align-items: center; justify-content: center;
  min-height: 100vh; text-align: center; position: relative;
}
.offworld-bg { position: absolute; inset: 0; }
.blimp {
  position: absolute; top: 20%; right: 10%;
  animation: blimpFloat 20s ease-in-out infinite;
}
@keyframes blimpFloat {
  0%, 100% { transform: translateX(0); }
  50% { transform: translateX(-50px); }
}
.blimp-body { width: 150px; height: 50px; background: #1a1a2e; border-radius: 25px; }
.blimp-screen {
  position: absolute; top: 10px; left: 10px; right: 10px;
  font-size: 0.5rem; color: var(--yellow); text-align: center;
  animation: blimpText 3s ease-in-out infinite;
}
@keyframes blimpText { 50% { opacity: 0.5; } }

.offworld-title { margin-bottom: 1rem; }
.offworld-title .pre { display: block; font-size: 0.9rem; color: rgba(192,192,192,0.5); letter-spacing: 0.2em; }
.offworld-title .main {
  display: block; font-size: clamp(3rem, 8vw, 6rem); font-weight: 200;
  color: var(--orange); text-shadow: 0 0 50px rgba(255, 107, 53, 0.5);
}
.offworld-text { color: rgba(192,192,192,0.6); margin-bottom: 2rem; line-height: 1.8; }
.offworld-footer { margin-top: 3rem; font-size: 0.7rem; color: rgba(255, 107, 53, 0.3); }

/* LOCATION TAG */
.location-tag {
  position: fixed; bottom: 70px; left: 1rem; /* Au-dessus du SDB footer */
  display: flex; flex-direction: column; gap: 0.25rem;
  font-size: 0.65rem; color: rgba(255, 107, 53, 0.4);
  z-index: 50;
}

/* RESPONSIVE */
@media (max-width: 768px) {
  .replicant-counter { flex-direction: column; gap: 1rem; }
  .machine-screen { grid-template-columns: 1fr; }
  .baseline-test { grid-template-columns: 1fr; }
  .neon-signs { display: none; }
}

/* A11Y */
@media (prefers-reduced-motion: reduce) {
  .rain, .neon, .scan-line, .photo-glitch, .blimp, .blimp-screen { animation: none !important; }
}
</style>
