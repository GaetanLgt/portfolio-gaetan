<template>
  <div class="dbz-page" :class="'form-' + currentForm">
    <a href="#main-content" class="skip-link">Aller au contenu principal</a>

    <!-- KI AURA EFFECT -->
    <div class="ki-aura" aria-hidden="true" :class="'aura-' + currentForm">
      <div class="aura-layer aura-layer--1"></div>
      <div class="aura-layer aura-layer--2"></div>
    </div>

    <!-- SCOUTER HUD -->
    <div class="scouter-hud" aria-hidden="true">
      <div class="scouter-frame"></div>
      <div class="scouter-data">
        <div class="data-line">NIVEAU DE PUISSANCE</div>
        <div class="power-reading" :class="{ 'reading--overflow': powerLevel > 9000 }">
          {{ powerDisplay }}
        </div>
        <div class="data-line data-line--small">{{ powerStatus }}</div>
      </div>
    </div>

    <!-- HERO -->
    <section id="hero" class="dbz-hero" aria-labelledby="hero-title">
      <div class="hero-bg" aria-hidden="true">
        <div class="energy-burst"></div>
      </div>

      <div class="container" id="main-content">
        <div class="capsule-badge">
          <span class="badge-text">CAPSULE CORP</span>
        </div>

        <h1 id="hero-title" class="hero-title">
          <span class="title-jp">ドラゴンボールZ</span>
          <span class="title-main">DRAGON BALL Z</span>
          <span class="title-sub">La légende du Développeur Saiyan</span>
        </h1>

        <p class="hero-quote">
          « La puissance vient en réponse à un besoin, pas à un désir. »
        </p>

        <div class="transformation-bar">
          <button 
            v-for="form in forms" 
            :key="form.id"
            class="form-btn"
            :class="{ active: currentForm === form.id }"
            @click="transform(form.id)"
          >
            <span class="form-icon">{{ form.icon }}</span>
            <span class="form-name">{{ form.name }}</span>
          </button>
        </div>

        <div class="power-display">
          <div class="display-label">NIVEAU DE PUISSANCE</div>
          <div class="display-value" :class="{ 'value--over9000': powerLevel > 9000 }">
            {{ powerDisplay }}
          </div>
          <div class="display-bar">
            <div class="bar-fill" :style="{ width: Math.min(powerLevel / 100, 100) + '%' }"></div>
          </div>
        </div>

        <button class="kamehameha-btn" @click="scrollTo('training')">
          <span class="btn-text">KA-ME-HA-ME-HA!</span>
        </button>
      </div>
    </section>

    <!-- TRAINING -->
    <section id="training" class="dbz-section training-section" aria-labelledby="training-title">
      <div class="container">
        <div class="section-header">
          <span class="header-icon">🥋</span>
          <h2 id="training-title">SALLE DU TEMPS</h2>
          <p class="section-sub">Un jour équivaut à un an d'entraînement</p>
        </div>

        <div class="training-grid">
          <article v-for="skill in skills" :key="skill.name" class="skill-card">
            <div class="card-icon">{{ skill.icon }}</div>
            <h3>{{ skill.name }}</h3>
            <p class="skill-desc">{{ skill.desc }}</p>
            
            <div class="skill-stats">
              <div class="stat">
                <span class="stat-label">POWER</span>
                <div class="stat-bar">
                  <div class="stat-fill" :style="{ width: skill.power + '%' }"></div>
                </div>
              </div>
            </div>

            <div class="skill-techs">
              <span v-for="tech in skill.techs" :key="tech">{{ tech }}</span>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- Z FIGHTERS -->
    <section id="zfighters" class="dbz-section zfighters-section" aria-labelledby="zfighters-title">
      <div class="container">
        <div class="section-header">
          <span class="header-icon">⭐</span>
          <h2 id="zfighters-title">GUERRIERS Z</h2>
          <p class="section-sub">Les plus puissants guerriers de la Terre</p>
        </div>

        <div class="fighters-grid">
          <article v-for="project in projects" :key="project.id" class="fighter-card">
            <div class="card-portrait">
              <span class="portrait-icon">{{ project.icon }}</span>
            </div>

            <div class="card-info">
              <div class="info-header">
                <span class="fighter-race">{{ project.race }}</span>
                <span class="fighter-status" :class="'status-' + project.status">{{ project.status }}</span>
              </div>
              
              <h3>{{ project.name }}</h3>
              <p>{{ project.desc }}</p>

              <div class="fighter-power">
                <span class="power-label">Puissance :</span>
                <span class="power-value">{{ project.power.toLocaleString() }}</span>
              </div>

              <div class="fighter-techniques">
                <span v-for="tech in project.techniques" :key="tech">{{ tech }}</span>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- DRAGON BALLS -->
    <section id="wishes" class="dbz-section wishes-section" aria-labelledby="wishes-title">
      <div class="container">
        <div class="section-header">
          <span class="header-icon">🔮</span>
          <h2 id="wishes-title">LES DRAGON BALLS</h2>
          <p class="section-sub">Exaucent n'importe quel vœu une fois réunies</p>
        </div>

        <div class="dragon-balls">
          <div 
            v-for="(wish, index) in wishes" 
            :key="index"
            class="dragon-ball"
            :class="{ 'ball--collected': index <= collectedBalls }"
            @click="collectBall(index)"
          >
            <div class="ball-stars">
              <span v-for="n in (index + 1)" :key="n" class="star">★</span>
            </div>
          </div>
        </div>

        <div class="shenron-message" v-if="collectedBalls >= 6">
          <div class="shenron-icon">🐉</div>
          <p>« Ton vœu a été exaucé ! »</p>
        </div>

        <div class="wishes-list">
          <div 
            v-for="(wish, index) in wishes" 
            :key="index"
            class="wish-item"
            :class="{ 'wish--revealed': index <= collectedBalls }"
          >
            <span class="wish-number">{{ index + 1 }}⭐</span>
            <div class="wish-content">
              <h4>{{ wish.title }}</h4>
              <p>{{ wish.desc }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- SAGA -->
    <section id="saga" class="dbz-section saga-section" aria-labelledby="saga-title">
      <div class="container">
        <div class="section-header">
          <span class="header-icon">📖</span>
          <h2 id="saga-title">LA SAGA</h2>
          <p class="section-sub">Du Saiyan à l'Ultra</p>
        </div>

        <div class="saga-timeline">
          <div class="timeline-track"></div>
          
          <div 
            v-for="(saga, index) in sagas" 
            :key="saga.year"
            class="saga-event"
            :class="{ 'event--current': index === currentSaga }"
          >
            <div class="event-marker">
              <span class="marker-icon">{{ saga.icon }}</span>
            </div>
            <div class="event-content">
              <span class="event-year">{{ saga.year }}</span>
              <h4>{{ saga.name }}</h4>
              <p>{{ saga.desc }}</p>
            </div>
          </div>
        </div>

        <blockquote class="saga-quote">
          <p>« Je suis l'espoir de l'univers. »</p>
          <cite>— Goku</cite>
        </blockquote>
      </div>
    </section>

    <!-- FUSION -->
    <section id="fusion" class="dbz-section fusion-section" aria-labelledby="fusion-title">
      <div class="fusion-bg" aria-hidden="true">
        <div class="fusion-energy"></div>
      </div>

      <div class="container">
        <div class="fusion-pose">
          <span class="pose pose--left">👈</span>
          <span class="pose-text">FU-SION</span>
          <span class="pose pose--right">👉</span>
        </div>

        <h2 id="fusion-title" class="fusion-title">
          <span class="pre">ON</span>
          <span class="main">FUSIONNE</span>
        </h2>

        <p class="fusion-text">
          Quand deux guerriers unissent leurs forces, ils deviennent inarrêtables.
        </p>

        <router-link to="/contact" class="fusion-btn">
          <span class="btn-text">FUSION... HA!</span>
        </router-link>
      </div>
    </section>

    <!-- SCOUTER STATUS -->
    <div class="scouter-status" aria-hidden="true">
      <span class="status-icon">📡</span>
      <span class="status-text">{{ scouterStatus }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';

const currentForm = ref('base');
const collectedBalls = ref(-1);
const currentSaga = ref(4);

const forms = [
  { id: 'base', name: 'BASE', icon: '👊', power: 1000 },
  { id: 'ssj', name: 'SSJ', icon: '⚡', power: 50000 },
  { id: 'ssj2', name: 'SSJ2', icon: '💫', power: 100000 },
  { id: 'ssj3', name: 'SSJ3', icon: '🔥', power: 400000 },
  { id: 'ssjgod', name: 'GOD', icon: '🔴', power: 1000000 },
  { id: 'ssjblue', name: 'BLUE', icon: '💎', power: 5000000 },
  { id: 'ui', name: 'UI', icon: '🤍', power: 9999999 }
];

const powerLevel = computed(() => {
  const form = forms.find(f => f.id === currentForm.value);
  return form ? form.power : 1000;
});

const powerDisplay = computed(() => {
  if (powerLevel.value > 9000) return 'C\'EST PLUS DE 9000 !!!';
  return powerLevel.value.toLocaleString();
});

const powerStatus = computed(() => {
  if (powerLevel.value > 1000000) return 'DIVIN';
  if (powerLevel.value > 100000) return 'LÉGENDAIRE';
  if (powerLevel.value > 9000) return 'ÉCRASANT';
  return 'ANALYSE...';
});

const scouterStatus = ref('Scanning...');

const skills = [
  { name: 'KAMEHAMEHA BACKEND', icon: '🔵', desc: 'Un rayon dévastateur de pure puissance backend', power: 95, techs: ['Symfony 8', 'PHP 8.3+', 'PostgreSQL'] },
  { name: 'FINAL FLASH FRONTEND', icon: '💛', desc: 'Attaque d\'énergie visuelle explosive', power: 88, techs: ['Vue 3', 'Three.js', 'TypeScript'] },
  { name: 'GENKI DAMA IA', icon: '🌍', desc: 'Concentre l\'énergie de toutes les sources', power: 85, techs: ['Ollama', 'n8n', 'ChromaDB'] },
  { name: 'TÉLÉPORTATION DEVOPS', icon: '✨', desc: 'Déployer partout, instantanément', power: 82, techs: ['Docker', 'CI/CD', 'GitHub'] }
];

const projects = [
  { id: 1, name: 'ARKADIA', icon: '🛡️', race: 'SAIYAN', desc: 'Cluster gaming guerrier - 150+ combattants', power: 50000, status: 'actif', techniques: ['Nitrado', 'Discord', 'Webhooks'] },
  { id: 2, name: 'GL DIGITAL LAB', icon: '⚡', race: 'SAIYAN ÉLITE', desc: 'Centre de puissance dev', power: 100000, status: 'actif', techniques: ['Symfony', 'Vue 3', 'Docker'] },
  { id: 3, name: 'NEURAL OPS', icon: '🧠', race: 'NAMEK', desc: 'Automatisation IA sage', power: 75000, status: 'actif', techniques: ['n8n', 'Ollama', 'RAG'] },
  { id: 4, name: 'PORTFOLIO', icon: '🌐', race: 'FUSION', desc: 'Vitrine multi-univers', power: 80000, status: 'actif', techniques: ['Vue 3', 'Three.js', 'Vite'] }
];

const wishes = [
  { title: 'INDÉPENDANCE', desc: 'Liberté entrepreneuriale à 40 ans' },
  { title: 'MAÎTRISE', desc: 'Expertise full-stack reconnue' },
  { title: 'SOUVERAINETÉ', desc: 'IA locale, données maîtrisées' },
  { title: 'COMMUNAUTÉ', desc: 'ARKADIA prospère et active' },
  { title: 'IMPACT', desc: 'Aider les PME à se transformer' },
  { title: 'ÉQUILIBRE', desc: 'Gaming + Dev + Vie perso' },
  { title: 'HÉRITAGE', desc: 'Créer quelque chose qui dure' }
];

const sagas = [
  { year: '2020', name: 'SAIYAN SAGA', icon: '🚀', desc: 'Formation développeur' },
  { year: '2021', name: 'NAMEK SAGA', icon: '🌍', desc: 'Premiers projets' },
  { year: '2022', name: 'ANDROID SAGA', icon: '🤖', desc: 'Symfony mastery' },
  { year: '2023', name: 'CELL SAGA', icon: '💪', desc: 'IA Integration' },
  { year: '2024', name: 'BUU SAGA', icon: '🎮', desc: 'ARKADIA Launch' },
  { year: '2025', name: 'SUPER SAGA', icon: '⚡', desc: 'GL Digital Lab' },
  { year: '2026', name: 'ULTRA SAGA', icon: '🤍', desc: 'Ultra Instinct - Autonomie totale' }
];

const transform = (formId) => {
  currentForm.value = formId;
  scouterStatus.value = 'Puissance en hausse...';
  setTimeout(() => {
    scouterStatus.value = `Forme : ${formId.toUpperCase()}`;
  }, 1000);
};

const collectBall = (index) => {
  if (index === collectedBalls.value + 1) {
    collectedBalls.value = index;
  }
};

const scrollTo = (id) => {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
};

let scouterInterval = null;

onMounted(() => {
  scouterInterval = setInterval(() => {
    const msgs = ['Analyse en cours...', 'Aucune menace détectée', 'Niveaux de puissance stables', 'Signature Ki détectée'];
    scouterStatus.value = msgs[Math.floor(Math.random() * msgs.length)];
  }, 5000);
});

onUnmounted(() => clearInterval(scouterInterval));
</script>

<style scoped>
.dbz-page {
  --orange: #ff6b00;
  --yellow: #ffcc00;
  --blue-ki: #00bfff;
  --red-ki: #ff4444;
  --bg: #0a0a0f;
  --bg-dark: #050508;
  --surface: rgba(20, 20, 30, 0.9);
  --current-ki: #ffffff;
  
  background: var(--bg);
  color: #e0e0e0;
  min-height: 100vh;
  font-family: 'Bangers', 'Impact', sans-serif;
  overflow-x: hidden;
}

.dbz-page.form-ssj,
.dbz-page.form-ssj2,
.dbz-page.form-ssj3 { --current-ki: var(--yellow); }
.dbz-page.form-ssjgod { --current-ki: var(--red-ki); }
.dbz-page.form-ssjblue { --current-ki: var(--blue-ki); }
.dbz-page.form-ui { --current-ki: #c0c0c0; }

/* KI AURA */
.ki-aura {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  opacity: 0.3;
}

.aura-layer {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at 50% 50%, var(--current-ki) 0%, transparent 70%);
  animation: auraPulse 2s ease-in-out infinite;
}

.aura-layer--2 { animation-delay: 0.3s; opacity: 0.5; }

@keyframes auraPulse {
  0%, 100% { transform: scale(1); opacity: 0.3; }
  50% { transform: scale(1.1); opacity: 0.5; }
}

/* SCOUTER HUD */
.scouter-hud {
  position: fixed;
  top: 100px;
  right: 2rem;
  width: 180px;
  z-index: 100;
  padding: 1rem;
  background: rgba(0, 0, 0, 0.7);
  border: 2px solid rgba(0, 255, 0, 0.3);
  border-radius: 10px 50px 10px 10px;
  font-family: 'JetBrains Mono', monospace;
}

.data-line {
  font-size: 0.6rem;
  color: rgba(0, 255, 0, 0.7);
  letter-spacing: 0.1em;
}

.data-line--small { font-size: 0.5rem; margin-top: 0.5rem; }

.power-reading {
  font-size: 1rem;
  font-weight: bold;
  color: #00ff00;
  margin: 0.25rem 0;
}

.reading--overflow {
  color: #ff0000;
  animation: powerOverflow 0.5s ease-in-out infinite;
}

@keyframes powerOverflow {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

/* HERO */
.dbz-hero {
  min-height: 100vh;
  display: flex;
  align-items: center;
  position: relative;
  padding: 6rem 2rem;
}

.hero-bg { position: absolute; inset: 0; overflow: hidden; }

.energy-burst {
  position: absolute;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  width: 600px; height: 600px;
  background: radial-gradient(circle, var(--current-ki) 0%, transparent 70%);
  opacity: 0.2;
  animation: energyBurst 3s ease-in-out infinite;
}

@keyframes energyBurst {
  0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.2; }
  50% { transform: translate(-50%, -50%) scale(1.3); opacity: 0.1; }
}

.container { position: relative; z-index: 10; max-width: 1100px; margin: 0 auto; }

.capsule-badge {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  background: rgba(0, 191, 255, 0.1);
  border: 2px solid var(--blue-ki);
  border-radius: 50px;
  margin-bottom: 2rem;
}

.badge-text {
  font-size: 0.9rem;
  letter-spacing: 0.2em;
  color: var(--blue-ki);
  font-family: 'Inter', sans-serif;
}

.hero-title { margin-bottom: 2rem; }

.title-jp {
  display: block;
  font-size: clamp(1rem, 3vw, 1.5rem);
  color: var(--orange);
  letter-spacing: 0.2em;
  margin-bottom: 0.5rem;
}

.title-main {
  display: block;
  font-size: clamp(3rem, 10vw, 7rem);
  color: var(--orange);
  text-shadow: 3px 3px 0 var(--yellow), 6px 6px 0 rgba(0, 0, 0, 0.3);
}

.title-sub {
  display: block;
  font-size: 1.1rem;
  color: var(--yellow);
  font-family: 'Inter', sans-serif;
  font-style: italic;
  margin-top: 0.5rem;
}

.hero-quote {
  font-size: 1.1rem;
  font-style: italic;
  color: rgba(224, 224, 224, 0.6);
  max-width: 450px;
  font-family: 'Inter', sans-serif;
  margin-bottom: 2rem;
}

/* TRANSFORMATION BAR */
.transformation-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 2rem;
}

.form-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  padding: 0.75rem 1rem;
  background: transparent;
  border: 2px solid rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 0.6);
  font-family: 'Inter', sans-serif;
  font-size: 0.7rem;
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 0.5rem;
}

.form-btn:hover { border-color: var(--current-ki); color: white; }

.form-btn.active {
  background: rgba(255, 255, 255, 0.1);
  border-color: var(--current-ki);
  color: var(--current-ki);
  box-shadow: 0 0 20px var(--current-ki);
}

.form-icon { font-size: 1.5rem; }
.form-name { font-weight: 700; letter-spacing: 0.1em; }

/* POWER DISPLAY */
.power-display {
  background: var(--surface);
  border: 2px solid var(--orange);
  padding: 1.5rem;
  margin-bottom: 2rem;
  max-width: 400px;
}

.display-label {
  font-size: 0.8rem;
  color: var(--orange);
  letter-spacing: 0.2em;
  margin-bottom: 0.5rem;
}

.display-value {
  font-size: 2rem;
  color: var(--yellow);
  font-family: 'JetBrains Mono', monospace;
  margin-bottom: 0.5rem;
}

.value--over9000 {
  color: #ff0000;
  animation: over9000 0.3s ease-in-out infinite;
}

@keyframes over9000 {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

.display-bar { height: 8px; background: rgba(255, 255, 255, 0.1); overflow: hidden; }

.display-bar .bar-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--orange), var(--yellow));
}

/* BUTTONS */
.kamehameha-btn, .fusion-btn {
  display: inline-flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem 2.5rem;
  background: linear-gradient(135deg, var(--orange), var(--yellow));
  border: none;
  color: #000;
  font-family: 'Bangers', sans-serif;
  font-size: 1.25rem;
  letter-spacing: 0.1em;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
}

.kamehameha-btn:hover, .fusion-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 0 50px var(--orange);
}

/* SECTIONS */
.dbz-section {
  min-height: 100vh;
  padding: 6rem 2rem;
  position: relative;
}

.section-header { text-align: center; margin-bottom: 4rem; }
.header-icon { display: block; font-size: 2.5rem; margin-bottom: 0.5rem; }

.section-header h2 {
  font-size: clamp(2rem, 5vw, 3rem);
  color: var(--orange);
  text-shadow: 2px 2px 0 var(--yellow);
  letter-spacing: 0.1em;
}

.section-sub { font-size: 0.9rem; color: rgba(224, 224, 224, 0.5); font-family: 'Inter', sans-serif; }

/* TRAINING */
.training-section { background: linear-gradient(180deg, var(--bg) 0%, var(--bg-dark) 100%); }

.training-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

.skill-card {
  background: var(--surface);
  border: 2px solid rgba(255, 107, 0, 0.3);
  padding: 2rem;
  transition: all 0.3s ease;
}

.skill-card:hover {
  border-color: var(--orange);
  transform: translateY(-5px);
  box-shadow: 0 10px 40px rgba(255, 107, 0, 0.2);
}

.card-icon { font-size: 3rem; margin-bottom: 1rem; }

.skill-card h3 { font-size: 1.25rem; color: var(--orange); margin-bottom: 0.5rem; }

.skill-desc { font-size: 0.9rem; color: rgba(224, 224, 224, 0.6); font-family: 'Inter', sans-serif; margin-bottom: 1rem; }

.skill-stats { margin-bottom: 1rem; }

.stat { margin-bottom: 0.5rem; }
.stat-label { font-size: 0.7rem; color: rgba(224, 224, 224, 0.5); }
.stat-bar { height: 6px; background: rgba(255, 255, 255, 0.1); margin-top: 0.25rem; }
.stat-fill { height: 100%; background: linear-gradient(90deg, var(--orange), var(--yellow)); }

.skill-techs { display: flex; flex-wrap: wrap; gap: 0.5rem; }
.skill-techs span {
  padding: 0.25rem 0.5rem;
  background: rgba(255, 107, 0, 0.1);
  font-size: 0.65rem;
  color: var(--orange);
  font-family: 'JetBrains Mono', monospace;
}

/* Z FIGHTERS */
.zfighters-section { background: var(--bg-dark); }

.fighters-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.fighter-card {
  display: grid;
  grid-template-columns: 100px 1fr;
  background: var(--surface);
  border: 2px solid rgba(255, 204, 0, 0.2);
  overflow: hidden;
  transition: all 0.3s ease;
}

.fighter-card:hover {
  border-color: var(--yellow);
  box-shadow: 0 10px 40px rgba(255, 204, 0, 0.2);
}

.card-portrait {
  background: linear-gradient(135deg, var(--orange), var(--yellow));
  display: flex;
  align-items: center;
  justify-content: center;
}

.portrait-icon { font-size: 3rem; }

.card-info { padding: 1.5rem; }

.info-header { display: flex; justify-content: space-between; margin-bottom: 0.5rem; font-size: 0.7rem; }
.fighter-race { color: var(--yellow); }
.fighter-status { text-transform: uppercase; }
.status-actif { color: #00ff00; }

.card-info h3 { font-size: 1.25rem; color: var(--orange); margin-bottom: 0.5rem; }
.card-info p { font-size: 0.85rem; color: rgba(224, 224, 224, 0.6); font-family: 'Inter', sans-serif; margin-bottom: 0.75rem; }

.fighter-power { margin-bottom: 0.75rem; }
.power-label { font-size: 0.7rem; color: rgba(224, 224, 224, 0.5); }
.power-value { font-size: 1rem; color: var(--yellow); font-family: 'JetBrains Mono', monospace; }

.fighter-techniques { display: flex; flex-wrap: wrap; gap: 0.5rem; }
.fighter-techniques span {
  padding: 0.2rem 0.5rem;
  background: rgba(255, 204, 0, 0.1);
  font-size: 0.6rem;
  color: var(--yellow);
  font-family: 'JetBrains Mono', monospace;
}

/* DRAGON BALLS */
.wishes-section { background: linear-gradient(180deg, var(--bg-dark) 0%, var(--bg) 100%); }

.dragon-balls {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.dragon-ball {
  width: 80px; height: 80px;
  background: linear-gradient(135deg, #ff9500, #ff6600);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  opacity: 0.4;
  filter: grayscale(1);
}

.dragon-ball.ball--collected {
  opacity: 1;
  filter: grayscale(0);
  box-shadow: 0 0 30px rgba(255, 149, 0, 0.6);
}

.dragon-ball:hover { transform: scale(1.1); }

.ball-stars {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 2px;
  color: #8b0000;
  font-size: 0.8rem;
}

.shenron-message {
  text-align: center;
  margin-bottom: 2rem;
  padding: 2rem;
  background: rgba(0, 255, 0, 0.1);
  border: 2px solid #00ff00;
}

.shenron-icon { font-size: 4rem; margin-bottom: 1rem; }
.shenron-message p { font-size: 1.25rem; color: #00ff00; font-family: 'Inter', sans-serif; }

.wishes-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1rem;
}

.wish-item {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background: var(--surface);
  border: 1px solid rgba(255, 255, 255, 0.1);
  opacity: 0.4;
  transition: all 0.3s ease;
}

.wish-item.wish--revealed {
  opacity: 1;
  border-color: var(--orange);
}

.wish-number { font-size: 1.5rem; color: var(--yellow); }
.wish-content h4 { color: var(--orange); margin-bottom: 0.25rem; }
.wish-content p { font-size: 0.85rem; color: rgba(224, 224, 224, 0.6); font-family: 'Inter', sans-serif; }

/* SAGA */
.saga-section { background: var(--bg); }

.saga-timeline { position: relative; padding: 2rem 0; }

.timeline-track {
  position: absolute;
  left: 50%;
  top: 0; bottom: 0;
  width: 2px;
  background: linear-gradient(180deg, var(--orange), var(--yellow));
  transform: translateX(-50%);
}

.saga-event {
  display: flex;
  align-items: center;
  margin-bottom: 3rem;
  position: relative;
}

.saga-event:nth-child(odd) { flex-direction: row-reverse; text-align: right; }

.event-marker {
  width: 60px; height: 60px;
  background: var(--bg);
  border: 3px solid var(--orange);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2;
}

.event--current .event-marker {
  background: var(--orange);
  box-shadow: 0 0 30px var(--orange);
}

.event-content {
  flex: 1;
  padding: 0 3rem;
  max-width: 400px;
}

.event-year { font-size: 0.8rem; color: var(--yellow); }
.event-content h4 { font-size: 1.25rem; color: var(--orange); margin: 0.25rem 0; }
.event-content p { font-size: 0.85rem; color: rgba(224, 224, 224, 0.6); font-family: 'Inter', sans-serif; }

.saga-quote { text-align: center; margin-top: 3rem; }
.saga-quote p { font-size: 1.5rem; color: var(--yellow); font-style: italic; font-family: 'Inter', sans-serif; }
.saga-quote cite { display: block; color: var(--orange); margin-top: 0.5rem; }

/* FUSION */
.fusion-section {
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  position: relative;
  min-height: 100vh;
}

.fusion-bg { position: absolute; inset: 0; }

.fusion-energy {
  position: absolute;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  width: 400px; height: 400px;
  background: radial-gradient(circle, var(--current-ki) 0%, transparent 70%);
  opacity: 0.3;
  animation: fusionPulse 2s ease-in-out infinite;
}

@keyframes fusionPulse {
  0%, 100% { transform: translate(-50%, -50%) scale(1); }
  50% { transform: translate(-50%, -50%) scale(1.2); }
}

.fusion-pose {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  margin-bottom: 2rem;
}

.pose { font-size: 3rem; animation: poseMove 1s ease-in-out infinite; }
.pose--left { animation-delay: 0s; }
.pose--right { animation-delay: 0.5s; }

@keyframes poseMove {
  0%, 100% { transform: translateX(0); }
  50% { transform: translateX(10px); }
}

.pose-text {
  font-size: 2rem;
  color: var(--orange);
  letter-spacing: 0.2em;
}

.fusion-title { margin-bottom: 1rem; }
.fusion-title .pre { display: block; font-size: 1rem; color: rgba(224, 224, 224, 0.5); letter-spacing: 0.3em; }
.fusion-title .main {
  display: block;
  font-size: clamp(4rem, 12vw, 8rem);
  color: var(--orange);
  text-shadow: 4px 4px 0 var(--yellow);
}

.fusion-text {
  font-size: 1.1rem;
  color: rgba(224, 224, 224, 0.6);
  font-family: 'Inter', sans-serif;
  margin-bottom: 2rem;
}

/* SCOUTER STATUS */
.scouter-status {
  position: fixed;
  bottom: 70px;
  left: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: rgba(0, 0, 0, 0.8);
  border: 1px solid rgba(0, 255, 0, 0.3);
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.7rem;
  color: #00ff00;
  z-index: 50;
}

/* RESPONSIVE */
@media (max-width: 1024px) {
  .scouter-hud { display: none; }
}

@media (max-width: 768px) {
  .transformation-bar { justify-content: center; }
  .fighter-card { grid-template-columns: 1fr; }
  .card-portrait { height: 100px; }
  
  .timeline-track { left: 30px; }
  .event-marker { left: 30px; }
  .saga-event, .saga-event:nth-child(odd) { flex-direction: column; text-align: left; }
  .event-content { padding: 1rem 0 0 60px; }
}

/* A11Y */
@media (prefers-reduced-motion: reduce) {
  .aura-layer, .energy-burst, .fusion-energy, .pose { animation: none !important; }
  .reading--overflow, .value--over9000 { animation: none !important; }
}
</style>
