<template>
  <div class="tron-page">
    <a href="#main-content" class="skip-link">Aller au contenu principal</a>

    <div class="grid-overlay" aria-hidden="true">
      <div class="grid-lines"></div>
    </div>

    <!-- HERO -->
    <section id="hero" class="tron-hero" aria-labelledby="hero-title">
      <div class="hero-bg" aria-hidden="true">
        <div class="lightcycle-trail lightcycle-trail--1"></div>
        <div class="lightcycle-trail lightcycle-trail--2"></div>
      </div>

      <div class="container" id="main-content">
        <h1 id="hero-title" class="hero-title">
          <span class="title-sub">THE</span>
          <span class="title-main">GRID</span>
        </h1>

        <p class="hero-quote">
          « The Grid. A digital frontier. I tried to picture clusters of information 
          as they moved through the computer. »
        </p>

        <div class="hero-stats">
          <div class="stat"><span class="val">2,847</span><span class="lbl">Cycles</span></div>
          <div class="stat"><span class="val">12</span><span class="lbl">Programs</span></div>
          <div class="stat"><span class="val">1</span><span class="lbl">User</span></div>
        </div>

        <button class="grid-btn" @click="scrollTo('programs')">
          <span>ENTER THE GRID</span>
        </button>
      </div>
    </section>

    <!-- PROGRAMS -->
    <section id="programs" class="tron-section" aria-labelledby="programs-title">
      <div class="container">
        <h2 id="programs-title" class="section-title">PROGRAMS</h2>
        <p class="section-sub">Active processes in the system</p>

        <div class="programs-grid">
          <article v-for="p in programs" :key="p.id" class="program-card" :class="'card--' + p.type">
            <div class="card-circuit" aria-hidden="true"></div>
            <span class="card-icon">{{ p.icon }}</span>
            <h3>{{ p.name }}</h3>
            <p class="card-type">{{ p.type }}</p>
            <p class="card-desc">{{ p.desc }}</p>
            <div class="card-status">
              <span class="dot" :class="'dot--' + p.status"></span>
              {{ p.status }}
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- ARENA -->
    <section id="arena" class="tron-section arena-section" aria-labelledby="arena-title">
      <div class="container">
        <h2 id="arena-title" class="section-title">GAME ARENA</h2>
        <p class="section-sub">Disc Wars & Light Cycle skills</p>

        <div class="skills-grid">
          <div v-for="s in skills" :key="s.name" class="skill-ring">
            <svg viewBox="0 0 100 100" class="ring-svg">
              <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(0,255,255,0.1)" stroke-width="4"/>
              <circle cx="50" cy="50" r="40" fill="none" :stroke="s.color" stroke-width="4"
                :stroke-dasharray="251" :stroke-dashoffset="251 - (251 * s.level / 100)"
                stroke-linecap="round" transform="rotate(-90 50 50)"/>
            </svg>
            <div class="skill-info">
              <span class="skill-icon">{{ s.icon }}</span>
              <span class="skill-name">{{ s.name }}</span>
              <span class="skill-lvl">{{ s.level }}%</span>
            </div>
          </div>
        </div>

        <p class="arena-quote">« I fight for the Users. »</p>
      </div>
    </section>

    <!-- END OF LINE CLUB -->
    <section id="club" class="tron-section club-section" aria-labelledby="club-title">
      <div class="club-bg" aria-hidden="true">
        <div class="neon-sign">END OF LINE</div>
      </div>

      <div class="container">
        <h2 id="club-title" class="section-title">END OF LINE CLUB</h2>

        <div class="terminal-box">
          <div class="term-header">
            <span class="dot-r"></span><span class="dot-y"></span><span class="dot-g"></span>
            <span class="term-title">user_profile.exe</span>
          </div>
          <div class="term-body">
            <p><span class="pr">></span> IDENTIFY PROGRAM</p>
            <p class="res">USER: GAËTAN "NEO" LANGLET</p>
            <p class="res">TYPE: FULL-STACK DEVELOPER</p>
            <p class="res">DIRECTIVE: FIGHT FOR THE USERS</p>
            <p class="res">LOCATION: LIMOGES, FRANCE</p>
            <p><span class="pr">></span> <span class="cursor">█</span></p>
          </div>
        </div>

        <blockquote class="club-quote">
          <p>« The thing about perfection is that it's unknowable. »</p>
          <cite>— Kevin Flynn</cite>
        </blockquote>
      </div>
    </section>

    <!-- PORTAL -->
    <section id="portal" class="tron-section portal-section" aria-labelledby="portal-title">
      <div class="portal-bg" aria-hidden="true">
        <div class="portal-rings">
          <div class="ring r1"></div>
          <div class="ring r2"></div>
          <div class="ring r3"></div>
        </div>
      </div>

      <div class="container">
        <h2 id="portal-title" class="portal-title">
          <span class="pre">ACCESS THE</span>
          <span class="main">REAL WORLD</span>
        </h2>
        <p class="portal-text">The portal to the outside is open.</p>
        <router-link to="/contact" class="grid-btn grid-btn--orange">I/O TOWER</router-link>
        <div class="flynn-lives" aria-hidden="true">FLYNN LIVES</div>
      </div>
    </section>

    <div class="cycle-counter" aria-hidden="true">CYCLE: {{ cycle }}</div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const cycle = ref('0000');
let interval = null;

const programs = [
  { id: 1, name: 'ARKADIA', type: 'guardian', icon: '🛡️', desc: 'Community system 150+ users', status: 'active' },
  { id: 2, name: 'GL DIGITAL', type: 'creator', icon: '⚡', desc: 'Full-stack & AI integration', status: 'active' },
  { id: 3, name: 'NEURAL OPS', type: 'security', icon: '🧠', desc: 'Local AI zero cloud', status: 'active' },
  { id: 4, name: 'PORTFOLIO', type: 'utility', icon: '🌐', desc: 'Multi-universe showcase', status: 'active' },
  { id: 5, name: 'DISCORD BOT', type: 'messenger', icon: '🤖', desc: 'Community automation', status: 'standby' },
  { id: 6, name: 'OBSIDIAN RAG', type: 'memory', icon: '📚', desc: 'Semantic knowledge base', status: 'active' }
];

const skills = [
  { name: 'Backend', icon: '⚙️', level: 95, color: '#00ffff' },
  { name: 'Frontend', icon: '🎨', level: 88, color: '#ff6600' },
  { name: 'DevOps', icon: '🐳', level: 82, color: '#00ffff' },
  { name: 'AI/ML', icon: '🧠', level: 78, color: '#ff6600' }
];

const scrollTo = (id) => {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
};

onMounted(() => {
  interval = setInterval(() => {
    cycle.value = String(Math.floor(Math.random() * 10000)).padStart(4, '0');
  }, 100);
});

onUnmounted(() => clearInterval(interval));
</script>

<style scoped>
.tron-page {
  --cyan: #00ffff;
  --orange: #ff6600;
  --bg: #0a0a0f;
  background: var(--bg);
  color: #e0f7fa;
  min-height: 100vh;
  font-family: 'Orbitron', 'JetBrains Mono', monospace;
  overflow-x: hidden;
}

/* GRID */
.grid-overlay { position: fixed; inset: 0; pointer-events: none; z-index: 0; }
.grid-lines {
  position: absolute; inset: 0;
  background-image: linear-gradient(rgba(0,255,255,0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0,255,255,0.03) 1px, transparent 1px);
  background-size: 50px 50px;
  transform: perspective(500px) rotateX(60deg);
  transform-origin: top; height: 200%;
  animation: gridScroll 20s linear infinite;
}
@keyframes gridScroll {
  to { transform: perspective(500px) rotateX(60deg) translateY(50px); }
}

/* HERO */
.tron-hero {
  min-height: 100vh; display: flex; align-items: center;
  position: relative; padding: 6rem 2rem;
}
.hero-bg { position: absolute; inset: 0; }
.lightcycle-trail {
  position: absolute; height: 3px;
  background: linear-gradient(90deg, transparent, var(--cyan));
  box-shadow: 0 0 20px var(--cyan);
  animation: trailMove 8s linear infinite;
}
.lightcycle-trail--1 { bottom: 30%; left: -200px; width: 200px; }
.lightcycle-trail--2 {
  bottom: 25%; left: -300px; width: 150px;
  background: linear-gradient(90deg, transparent, var(--orange));
  box-shadow: 0 0 20px var(--orange);
  animation-delay: 3s;
}
@keyframes trailMove { to { transform: translateX(calc(100vw + 400px)); } }

.container { position: relative; z-index: 2; max-width: 1100px; margin: 0 auto; }
.hero-title { margin-bottom: 2rem; }
.title-sub { display: block; font-size: 1.5rem; color: rgba(224,247,250,0.5); letter-spacing: 0.5em; }
.title-main {
  display: block; font-size: clamp(5rem, 15vw, 12rem); color: var(--cyan);
  text-shadow: 0 0 30px var(--cyan), 0 0 60px rgba(0,255,255,0.5);
  letter-spacing: 0.3em;
}
.hero-quote {
  font-size: 1.1rem; font-style: italic; color: rgba(224,247,250,0.6);
  max-width: 500px; line-height: 1.8; margin-bottom: 2rem;
}
.hero-stats { display: flex; gap: 2rem; margin-bottom: 2rem; }
.stat { text-align: center; }
.stat .val { display: block; font-size: 2rem; color: var(--cyan); }
.stat .lbl { font-size: 0.7rem; color: rgba(224,247,250,0.5); letter-spacing: 0.1em; }

.grid-btn {
  display: inline-block; padding: 1rem 2.5rem;
  background: transparent; border: 2px solid var(--cyan);
  color: var(--cyan); font-family: inherit; font-size: 1rem;
  letter-spacing: 0.15em; cursor: pointer;
  transition: all 0.3s; text-decoration: none;
}
.grid-btn:hover { background: var(--cyan); color: var(--bg); box-shadow: 0 0 30px var(--cyan); }
.grid-btn--orange { border-color: var(--orange); color: var(--orange); }
.grid-btn--orange:hover { background: var(--orange); color: var(--bg); box-shadow: 0 0 30px var(--orange); }

/* SECTIONS */
.tron-section { min-height: 100vh; padding: 6rem 2rem; position: relative; }
.section-title {
  font-size: clamp(2rem, 5vw, 3.5rem); text-align: center;
  color: var(--cyan); letter-spacing: 0.3em;
  text-shadow: 0 0 20px rgba(0,255,255,0.5); margin-bottom: 0.5rem;
}
.section-sub { text-align: center; color: rgba(224,247,250,0.5); font-size: 0.9rem; margin-bottom: 3rem; }

/* PROGRAMS */
.programs-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem; }
.program-card {
  background: rgba(10,10,15,0.9); border: 1px solid rgba(0,255,255,0.2);
  padding: 2rem; position: relative; overflow: hidden; transition: all 0.3s;
}
.program-card:hover { border-color: var(--cyan); transform: translateY(-5px); box-shadow: 0 10px 40px rgba(0,255,255,0.2); }
.card-circuit {
  position: absolute; top: 0; right: 0; width: 80px; height: 80px;
  background: linear-gradient(135deg, transparent 50%, rgba(0,255,255,0.05) 50%);
}
.card-icon { font-size: 2rem; margin-bottom: 1rem; display: block; }
.program-card h3 { font-size: 1.25rem; color: var(--cyan); margin-bottom: 0.25rem; }
.card-type { font-size: 0.7rem; color: var(--orange); letter-spacing: 0.1em; margin-bottom: 0.75rem; }
.card-desc { font-size: 0.85rem; color: rgba(224,247,250,0.6); line-height: 1.5; margin-bottom: 1rem; }
.card-status { display: flex; align-items: center; gap: 0.5rem; font-size: 0.75rem; color: rgba(224,247,250,0.5); }
.dot { width: 8px; height: 8px; border-radius: 50%; }
.dot--active { background: #00ff00; box-shadow: 0 0 10px #00ff00; }
.dot--standby { background: #ffff00; box-shadow: 0 0 10px #ffff00; }

/* ARENA */
.arena-section { background: linear-gradient(180deg, var(--bg) 0%, #0d1020 100%); }
.skills-grid { display: flex; justify-content: center; flex-wrap: wrap; gap: 2rem; margin-bottom: 3rem; }
.skill-ring { position: relative; width: 150px; height: 150px; }
.ring-svg { width: 100%; height: 100%; }
.skill-info {
  position: absolute; inset: 0; display: flex; flex-direction: column;
  align-items: center; justify-content: center; text-align: center;
}
.skill-icon { font-size: 1.5rem; }
.skill-name { font-size: 0.7rem; color: rgba(224,247,250,0.7); margin-top: 0.25rem; }
.skill-lvl { font-size: 1rem; color: var(--cyan); }
.arena-quote { text-align: center; font-style: italic; font-size: 1.25rem; color: var(--orange); }

/* CLUB */
.club-section { background: linear-gradient(180deg, #0d1020 0%, #0a0a12 100%); position: relative; }
.club-bg { position: absolute; inset: 0; display: flex; justify-content: center; padding-top: 3rem; }
.neon-sign {
  font-size: clamp(1.5rem, 4vw, 3rem); color: var(--orange); letter-spacing: 0.2em;
  text-shadow: 0 0 20px var(--orange), 0 0 40px var(--orange);
  animation: flicker 3s infinite;
}
@keyframes flicker {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.8; }
  52% { opacity: 1; }
  54% { opacity: 0.9; }
}

.terminal-box {
  max-width: 500px; margin: 4rem auto 2rem;
  background: rgba(0,0,0,0.8); border: 1px solid var(--cyan);
  border-radius: 0.5rem; overflow: hidden;
}
.term-header {
  display: flex; align-items: center; gap: 0.5rem;
  padding: 0.5rem 1rem; background: rgba(0,255,255,0.1);
}
.dot-r, .dot-y, .dot-g { width: 10px; height: 10px; border-radius: 50%; }
.dot-r { background: #ff5f56; }
.dot-y { background: #ffbd2e; }
.dot-g { background: #27ca40; }
.term-title { margin-left: auto; font-size: 0.7rem; color: rgba(224,247,250,0.5); }
.term-body { padding: 1rem; font-size: 0.85rem; line-height: 1.8; }
.term-body .pr { color: var(--cyan); }
.term-body .res { color: var(--orange); margin-left: 1rem; }
.cursor { animation: blink 1s step-end infinite; }
@keyframes blink { 50% { opacity: 0; } }

.club-quote { text-align: center; margin-top: 2rem; }
.club-quote p { font-style: italic; color: rgba(224,247,250,0.6); font-size: 1.1rem; }
.club-quote cite { display: block; margin-top: 0.5rem; color: var(--cyan); font-size: 0.9rem; }

/* PORTAL */
.portal-section {
  display: flex; align-items: center; justify-content: center;
  text-align: center; position: relative; min-height: 100vh;
}
.portal-bg { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; }
.portal-rings { position: relative; width: 400px; height: 400px; }
.ring {
  position: absolute; border: 2px solid var(--cyan); border-radius: 50%;
  animation: ringPulse 3s ease-in-out infinite;
}
.r1 { inset: 0; }
.r2 { inset: 40px; animation-delay: 0.5s; }
.r3 { inset: 80px; animation-delay: 1s; }
@keyframes ringPulse {
  0%, 100% { opacity: 0.3; transform: scale(1); }
  50% { opacity: 0.8; transform: scale(1.05); }
}

.portal-title { margin-bottom: 1rem; }
.portal-title .pre { display: block; font-size: 1rem; color: rgba(224,247,250,0.5); letter-spacing: 0.2em; }
.portal-title .main {
  display: block; font-size: clamp(2rem, 6vw, 4rem); color: var(--orange);
  text-shadow: 0 0 30px var(--orange);
}
.portal-text { color: rgba(224,247,250,0.6); margin-bottom: 2rem; }
.flynn-lives {
  margin-top: 3rem; font-size: 0.8rem; color: rgba(0,255,255,0.3);
  letter-spacing: 0.3em;
}

/* CYCLE COUNTER */
.cycle-counter {
  position: fixed; bottom: 70px; left: 1rem; /* Au-dessus du SDB footer */
  font-size: 0.7rem; color: rgba(0,255,255,0.3);
  font-family: 'JetBrains Mono', monospace;
  z-index: 50;
}

/* RESPONSIVE */
@media (max-width: 768px) {
  .hero-stats { flex-direction: column; gap: 1rem; }
  .skills-grid { gap: 1rem; }
  .skill-ring { width: 120px; height: 120px; }
}

/* A11Y */
@media (prefers-reduced-motion: reduce) {
  .grid-lines, .lightcycle-trail, .ring, .neon-sign, .cursor { animation: none !important; }
}
</style>
