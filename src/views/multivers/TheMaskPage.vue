<template>
  <div class="mask-page">
    <a href="#main-content" class="skip-link">Aller au contenu principal</a>

    <!-- TORNADO EFFECT -->
    <div class="tornado-bg" aria-hidden="true">
      <div class="swirl swirl--1"></div>
      <div class="swirl swirl--2"></div>
      <div class="swirl swirl--3"></div>
    </div>

    <!-- HERO : SSSSMOKIN! -->
    <section id="hero" class="mask-hero" aria-labelledby="hero-title">
      <div class="hero-bg" aria-hidden="true">
        <div class="cartoon-stars">
          <span v-for="i in 8" :key="i" class="star" :style="{ '--delay': i * 0.2 + 's' }">⭐</span>
        </div>
      </div>

      <div class="container" id="main-content">
        <div class="mask-face" @click="spinMask">
          <div class="face-inner" :class="{ spinning: isSpinning }">
            <span class="face-icon">🎭</span>
          </div>
          <div class="face-glow"></div>
        </div>

        <h1 id="hero-title" class="hero-title">
          <span class="title-pre">METS LE MASQUE ET</span>
          <span class="title-main" :class="{ smokin: showSmokin }">
            {{ showSmokin ? 'SSSPLENDIDE !' : 'DEVIENS QUELQU\'UN D\'AUTRE' }}
          </span>
        </h1>

        <p class="hero-quote">
          « C'est l'heure de faire la fête ! F-Ê-T-E ? Parce que j'ai trop envie ! »
        </p>

        <div class="power-meters">
          <div class="meter">
            <span class="meter-icon">🌀</span>
            <span class="meter-label">CHAOS</span>
            <div class="meter-bar"><div class="bar-fill fill--chaos" style="width: 100%"></div></div>
          </div>
          <div class="meter">
            <span class="meter-icon">🎨</span>
            <span class="meter-label">CRÉATIVITÉ</span>
            <div class="meter-bar"><div class="bar-fill fill--creative" style="width: 95%"></div></div>
          </div>
          <div class="meter">
            <span class="meter-icon">😜</span>
            <span class="meter-label">FOLIE</span>
            <div class="meter-bar"><div class="bar-fill fill--crazy" style="width: 110%"></div></div>
          </div>
        </div>

        <button class="smokin-btn" @click="triggerSmokin">
          <span class="btn-icon">💚</span>
          <span class="btn-text">SSSPLENDIDE !</span>
        </button>
      </div>
    </section>

    <!-- TRANSFORMATION : About -->
    <section id="transform" class="mask-section transform-section" aria-labelledby="transform-title">
      <div class="container">
        <div class="section-header">
          <span class="header-icon">🔄</span>
          <h2 id="transform-title">LA TRANSFORMATION</h2>
          <p class="section-sub">D'un dev tranquille à... autre chose</p>
        </div>

        <div class="transform-compare">
          <div class="compare-card card--before">
            <div class="card-icon">👨‍💻</div>
            <h3>STANLEY IPKISS</h3>
            <p class="card-subtitle">Ambiance employé de banque</p>
            <ul class="card-traits">
              <li>Écrit du code propre</li>
              <li>Suit les bonnes pratiques</li>
              <li>Assiste aux réunions</li>
              <li>Consommation de café normale</li>
            </ul>
          </div>
          <div class="compare-arrow">➡️</div>
          <div class="compare-card card--after">
            <div class="card-icon">🎭</div>
            <h3>LE MASQUE</h3>
            <p class="card-subtitle">Physique cartoon activé</p>
            <ul class="card-traits">
              <li>Livre des features à MACH 10</li>
              <li>Défie les lois du CSS</li>
              <li>Les réunions deviennent des stand-up</li>
              <li>CAFÉ ILLIMITÉ</li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- CUBAN PETE : Skills -->
    <section id="cuban" class="mask-section cuban-section" aria-labelledby="cuban-title">
      <div class="container">
        <div class="section-header">
          <span class="header-icon">💃</span>
          <h2 id="cuban-title">CUBAN PETE</h2>
          <p class="section-sub">On m'appelle Cuban Pete, je suis le roi du rythme Rumba !</p>
        </div>

        <div class="dance-floor">
          <div v-for="skill in skills" :key="skill.name" class="dance-card" @mouseenter="skill.dancing = true" @mouseleave="skill.dancing = false">
            <div class="dancer" :class="{ dancing: skill.dancing }">{{ skill.icon }}</div>
            <h3>{{ skill.name }}</h3>
            <p>{{ skill.desc }}</p>
            <div class="skill-bar">
              <div class="bar-fill" :style="{ width: skill.level + '%', background: skill.color }"></div>
            </div>
            <span class="skill-level">{{ skill.level }}%</span>
          </div>
        </div>
      </div>
    </section>

    <!-- COCO BONGO : Projects -->
    <section id="coco" class="mask-section coco-section" aria-labelledby="coco-title">
      <div class="container">
        <div class="section-header">
          <span class="header-icon">🎪</span>
          <h2 id="coco-title">CLUB COCO BONGO</h2>
          <p class="section-sub">Là où les projets les plus fous viennent faire la fête</p>
        </div>

        <div class="club-stage">
          <div class="spotlight spotlight--1"></div>
          <div class="spotlight spotlight--2"></div>
        </div>

        <div class="projects-carousel">
          <article v-for="project in projects" :key="project.id" class="project-card">
            <div class="card-marquee">{{ project.type }}</div>
            <div class="card-content">
              <span class="card-icon">{{ project.icon }}</span>
              <h3>{{ project.name }}</h3>
              <p>{{ project.desc }}</p>
              <div class="card-tags">
                <span v-for="tag in project.tags" :key="tag">{{ tag }}</span>
              </div>
            </div>
            <div class="card-confetti" aria-hidden="true">🎉</div>
          </article>
        </div>
      </div>
    </section>

    <!-- CONTACT : Party Invitation -->
    <section id="party" class="mask-section party-section" aria-labelledby="party-title">
      <div class="party-bg" aria-hidden="true">
        <span class="balloon balloon--1">🎈</span>
        <span class="balloon balloon--2">🎈</span>
        <span class="balloon balloon--3">🎈</span>
      </div>

      <div class="container">
        <h2 id="party-title" class="party-title">
          <span class="pre">TU ES INVITÉ À</span>
          <span class="main">LA FÊTE !</span>
        </h2>

        <p class="party-text">
          Arrêtez-moi quelqu'un ! (En fait non, collaborons plutôt)
        </p>

        <router-link to="/contact" class="party-btn">
          <span class="btn-icon">🎉</span>
          <span class="btn-text">REJOINS LA FÊTE</span>
        </router-link>

        <div class="party-footer" aria-hidden="true">
          <span>« NOTRE AMOUR EST COMME UNE ROSE ROUGE... ET MOI J'AI DES ÉPINES ! »</span>
        </div>
      </div>
    </section>

    <!-- Smokin Counter -->
    <div class="smokin-counter" aria-hidden="true" :class="{ active: showSmokin }">
      SSSPLENDIDE ! x{{ smokinCount }}
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';

const isSpinning = ref(false);
const showSmokin = ref(false);
const smokinCount = ref(0);

const skills = reactive([
  { name: 'Symfony', icon: '⚙️', desc: 'Backend à vitesse cartoon', level: 95, color: '#00ff00', dancing: false },
  { name: 'Vue.js', icon: '🎨', desc: 'Interfaces qui claquent', level: 88, color: '#ffff00', dancing: false },
  { name: 'Docker', icon: '🐳', desc: 'Chaos conteneurisé', level: 82, color: '#00ffff', dancing: false },
  { name: 'IA/ML', icon: '🧠', desc: 'Intelligent et insolent', level: 78, color: '#ff00ff', dancing: false },
  { name: 'n8n', icon: '🔄', desc: 'Manie de l\'automatisation', level: 85, color: '#ff8800', dancing: false }
]);

const projects = [
  { id: 1, name: 'ARKADIA', icon: '🛡️', type: 'TÊTE D\'AFFICHE', desc: 'Chaos communautaire gaming', tags: ['Nitrado', 'Discord'] },
  { id: 2, name: 'GL DIGITAL', icon: '⚡', type: 'SPECTACLE PRINCIPAL', desc: 'Studio dev en fête', tags: ['Symfony', 'Vue'] },
  { id: 3, name: 'NEURAL OPS', icon: '🧠', type: 'INVITÉ SPÉCIAL', desc: 'Délires IA', tags: ['Ollama', 'n8n'] },
  { id: 4, name: 'PORTFOLIO', icon: '🌐', type: 'RAPPEL', desc: 'Show multi-univers', tags: ['Vue 3', 'Vite'] }
];

const spinMask = () => {
  isSpinning.value = true;
  setTimeout(() => { isSpinning.value = false; }, 1000);
};

const triggerSmokin = () => {
  showSmokin.value = true;
  smokinCount.value++;
  setTimeout(() => { showSmokin.value = false; }, 2000);
};
</script>

<style scoped>
.mask-page {
  --green: #00ff00;
  --yellow: #ffff00;
  --pink: #ff69b4;
  --purple: #9932cc;
  --bg: #1a0a30;
  background: var(--bg);
  color: #fff;
  min-height: 100vh;
  font-family: 'Comic Sans MS', 'Bangers', cursive;
  overflow-x: hidden;
}

/* TORNADO BG */
.tornado-bg { position: fixed; inset: 0; pointer-events: none; z-index: 0; }
.swirl {
  position: absolute; width: 300px; height: 300px;
  border: 3px solid rgba(0, 255, 0, 0.2); border-radius: 50%;
  animation: swirlSpin 10s linear infinite;
}
.swirl--1 { top: 10%; left: 10%; }
.swirl--2 { top: 40%; right: 5%; animation-direction: reverse; animation-duration: 15s; }
.swirl--3 { bottom: 10%; left: 30%; animation-duration: 20s; }
@keyframes swirlSpin { to { transform: rotate(360deg) scale(1.2); } }

/* HERO */
.mask-hero { min-height: 100vh; display: flex; align-items: center; position: relative; padding: 6rem 2rem; }
.hero-bg { position: absolute; inset: 0; }
.cartoon-stars { position: absolute; inset: 0; }
.star { position: absolute; font-size: 2rem; animation: starPop 2s ease-in-out infinite; animation-delay: var(--delay); }
.star:nth-child(1) { top: 15%; left: 10%; }
.star:nth-child(2) { top: 25%; right: 15%; }
.star:nth-child(3) { top: 60%; left: 5%; }
.star:nth-child(4) { bottom: 20%; right: 10%; }
.star:nth-child(5) { top: 10%; left: 50%; }
.star:nth-child(6) { bottom: 30%; left: 20%; }
.star:nth-child(7) { top: 45%; right: 25%; }
.star:nth-child(8) { bottom: 15%; right: 30%; }
@keyframes starPop { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.5) rotate(180deg); } }

.container { position: relative; z-index: 2; max-width: 1100px; margin: 0 auto; text-align: center; }

.mask-face { width: 150px; height: 150px; margin: 0 auto 2rem; position: relative; cursor: pointer; }
.face-inner {
  width: 100%; height: 100%; background: var(--green);
  border-radius: 50%; display: flex; align-items: center; justify-content: center;
  font-size: 4rem; transition: transform 0.5s;
  box-shadow: 0 0 50px var(--green);
}
.face-inner.spinning { animation: maskSpin 1s ease-in-out; }
@keyframes maskSpin { 0% { transform: rotate(0) scale(1); } 50% { transform: rotate(180deg) scale(1.5); } 100% { transform: rotate(360deg) scale(1); } }
.face-glow { position: absolute; inset: -20px; border-radius: 50%; background: var(--green); opacity: 0.3; filter: blur(20px); animation: glowPulse 2s ease-in-out infinite; }
@keyframes glowPulse { 50% { opacity: 0.6; transform: scale(1.1); } }

.hero-title { margin-bottom: 2rem; }
.title-pre { display: block; font-size: 1rem; color: var(--yellow); }
.title-main {
  display: block; font-size: clamp(2rem, 8vw, 5rem);
  color: var(--green); text-shadow: 4px 4px 0 var(--yellow), 8px 8px 0 var(--pink);
  transition: all 0.3s;
}
.title-main.smokin { animation: smokinShake 0.5s ease-in-out; color: var(--yellow); }
@keyframes smokinShake { 0%, 100% { transform: rotate(0); } 25% { transform: rotate(-10deg); } 75% { transform: rotate(10deg); } }
.hero-quote { font-size: 1.1rem; color: var(--pink); max-width: 400px; margin: 0 auto 2rem; }

.power-meters { display: flex; justify-content: center; gap: 2rem; margin-bottom: 2rem; flex-wrap: wrap; }
.meter { text-align: center; width: 120px; }
.meter-icon { font-size: 1.5rem; }
.meter-label { display: block; font-size: 0.7rem; color: var(--yellow); margin: 0.25rem 0; }
.meter-bar { height: 8px; background: rgba(255,255,255,0.2); border-radius: 4px; overflow: hidden; }
.bar-fill { height: 100%; border-radius: 4px; }
.fill--chaos { background: linear-gradient(90deg, var(--green), var(--yellow)); }
.fill--creative { background: linear-gradient(90deg, var(--pink), var(--purple)); }
.fill--crazy { background: linear-gradient(90deg, var(--yellow), #ff0000); }

.smokin-btn, .party-btn {
  display: inline-flex; align-items: center; gap: 0.75rem;
  padding: 1rem 2.5rem; background: var(--green);
  border: 4px solid var(--yellow); color: var(--bg);
  font-family: inherit; font-size: 1.2rem; font-weight: bold;
  cursor: pointer; border-radius: 2rem; transition: all 0.3s;
  text-decoration: none;
}
.smokin-btn:hover, .party-btn:hover { transform: scale(1.1) rotate(-5deg); box-shadow: 0 10px 40px var(--green); }

/* SECTIONS */
.mask-section { min-height: 100vh; padding: 6rem 2rem; }
.section-header { text-align: center; margin-bottom: 3rem; }
.header-icon { display: block; font-size: 3rem; margin-bottom: 0.5rem; }
.section-header h2 { font-size: clamp(1.5rem, 5vw, 3rem); color: var(--green); text-shadow: 3px 3px 0 var(--yellow); }
.section-sub { font-size: 1rem; color: var(--pink); }

/* TRANSFORM */
.transform-section { background: linear-gradient(180deg, var(--bg), #0a0520); }
.transform-compare { display: flex; align-items: center; justify-content: center; gap: 2rem; flex-wrap: wrap; }
.compare-card {
  width: 280px; padding: 2rem; border-radius: 1rem; text-align: center;
}
.card--before { background: rgba(150, 150, 150, 0.2); border: 3px solid #888; }
.card--after { background: rgba(0, 255, 0, 0.2); border: 3px solid var(--green); animation: cardGlow 2s ease-in-out infinite; }
@keyframes cardGlow { 50% { box-shadow: 0 0 30px var(--green); } }
.card-icon { font-size: 3rem; margin-bottom: 1rem; }
.compare-card h3 { font-size: 1.25rem; color: var(--yellow); }
.card-subtitle { font-size: 0.8rem; color: rgba(255,255,255,0.6); margin-bottom: 1rem; }
.card-traits { list-style: none; padding: 0; text-align: left; }
.card-traits li { padding: 0.5rem 0; font-size: 0.85rem; border-bottom: 1px solid rgba(255,255,255,0.1); }
.card--after .card-traits li { color: var(--green); }
.compare-arrow { font-size: 2rem; animation: arrowBounce 1s ease-in-out infinite; }
@keyframes arrowBounce { 50% { transform: translateX(10px); } }

/* CUBAN PETE */
.cuban-section { background: #0a0520; }
.dance-floor { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1.5rem; }
.dance-card {
  padding: 1.5rem; background: rgba(255, 255, 0, 0.1);
  border: 3px solid var(--yellow); border-radius: 1rem;
  text-align: center; transition: all 0.3s;
}
.dance-card:hover { transform: scale(1.05); }
.dancer { font-size: 2.5rem; transition: all 0.3s; }
.dancer.dancing { animation: danceMove 0.5s ease-in-out infinite; }
@keyframes danceMove { 0%, 100% { transform: rotate(-10deg); } 50% { transform: rotate(10deg); } }
.dance-card h3 { font-size: 1rem; color: var(--green); margin: 0.5rem 0; }
.dance-card p { font-size: 0.75rem; color: rgba(255,255,255,0.6); margin-bottom: 0.5rem; }
.skill-bar { height: 6px; background: rgba(255,255,255,0.2); border-radius: 3px; margin-bottom: 0.25rem; }
.skill-level { font-size: 0.75rem; color: var(--yellow); }

/* COCO BONGO */
.coco-section { background: linear-gradient(180deg, #0a0520, var(--bg)); position: relative; }
.club-stage { position: relative; height: 100px; margin-bottom: 2rem; }
.spotlight {
  position: absolute; width: 100px; height: 200px;
  background: linear-gradient(180deg, var(--yellow) 0%, transparent 100%);
  opacity: 0.3; animation: spotlightMove 3s ease-in-out infinite;
}
.spotlight--1 { left: 20%; }
.spotlight--2 { right: 20%; animation-delay: 1.5s; }
@keyframes spotlightMove { 0%, 100% { transform: rotate(-15deg); } 50% { transform: rotate(15deg); } }

.projects-carousel { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.5rem; }
.project-card {
  background: rgba(0,0,0,0.5); border: 3px solid var(--pink);
  border-radius: 1rem; overflow: hidden; position: relative;
  transition: all 0.3s;
}
.project-card:hover { transform: translateY(-10px) rotate(2deg); border-color: var(--green); }
.card-marquee {
  padding: 0.5rem; background: var(--pink); color: var(--bg);
  font-size: 0.7rem; text-align: center; font-weight: bold;
}
.card-content { padding: 1.5rem; text-align: center; }
.card-icon { font-size: 2.5rem; }
.project-card h3 { font-size: 1.1rem; color: var(--yellow); margin: 0.5rem 0; }
.project-card p { font-size: 0.8rem; color: rgba(255,255,255,0.6); margin-bottom: 0.75rem; }
.card-tags { display: flex; justify-content: center; gap: 0.5rem; }
.card-tags span { padding: 0.2rem 0.5rem; background: var(--purple); font-size: 0.6rem; border-radius: 0.25rem; }
.card-confetti { position: absolute; top: 10px; right: 10px; font-size: 1.5rem; animation: confettiPop 2s ease-in-out infinite; }
@keyframes confettiPop { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.3) rotate(20deg); } }

/* PARTY */
.party-section { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; text-align: center; position: relative; }
.party-bg { position: absolute; inset: 0; }
.balloon { position: absolute; font-size: 3rem; animation: balloonFloat 5s ease-in-out infinite; }
.balloon--1 { left: 15%; bottom: 20%; }
.balloon--2 { right: 20%; bottom: 30%; animation-delay: 1s; }
.balloon--3 { left: 40%; bottom: 15%; animation-delay: 2s; }
@keyframes balloonFloat { 0%, 100% { transform: translateY(0) rotate(-5deg); } 50% { transform: translateY(-30px) rotate(5deg); } }

.party-title .pre { display: block; font-size: 1rem; color: var(--pink); }
.party-title .main { display: block; font-size: clamp(2.5rem, 8vw, 5rem); color: var(--green); text-shadow: 4px 4px 0 var(--yellow); }
.party-text { color: var(--yellow); margin-bottom: 2rem; font-size: 1.1rem; }
.party-footer { margin-top: 2rem; font-size: 0.75rem; color: var(--pink); max-width: 400px; }

/* SMOKIN COUNTER */
.smokin-counter {
  position: fixed; bottom: 1rem; right: 1rem;
  padding: 0.5rem 1rem; background: var(--green); color: var(--bg);
  font-size: 0.9rem; font-weight: bold; border-radius: 1rem;
  opacity: 0.5; transition: all 0.3s;
}
.smokin-counter.active { opacity: 1; transform: scale(1.2); }

/* RESPONSIVE */
@media (max-width: 768px) {
  .transform-compare { flex-direction: column; }
  .compare-arrow { transform: rotate(90deg); }
  .power-meters { flex-direction: column; gap: 1rem; }
}

/* A11Y */
@media (prefers-reduced-motion: reduce) {
  .swirl, .star, .face-glow, .spotlight, .balloon, .card-confetti, .dancer { animation: none !important; }
}
</style>
