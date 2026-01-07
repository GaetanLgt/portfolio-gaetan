<template>
  <div class="howard-page">
    <a href="#main-content" class="skip-link">Aller au contenu principal</a>

    <!-- QUACK BG -->
    <div class="quack-bg" aria-hidden="true">
      <span v-for="i in 10" :key="i" class="floating-feather" :style="{ '--delay': i * 0.5 + 's', '--x': (i * 10) + '%' }">🪶</span>
    </div>

    <!-- HERO : Duck World -->
    <section id="hero" class="howard-hero" aria-labelledby="hero-title">
      <div class="hero-bg" aria-hidden="true">
        <div class="duckworld-portal"></div>
        <div class="80s-grid"></div>
      </div>

      <div class="container" id="main-content">
        <div class="duck-badge">
          <span class="badge-icon">🦆</span>
          <span class="badge-text">COINCÉ SUR TERRE</span>
        </div>

        <h1 id="hero-title" class="hero-title">
          <span class="title-pre">LE CANARD VENU</span>
          <span class="title-main">D'UN AUTRE MONDE</span>
          <span class="title-tag">Personne ne rit d'un maître du QUACK FU !</span>
        </h1>

        <p class="hero-quote">
          « Sur ma planète, on a un dicton : 
          Fini le gentil canard ! »
        </p>

        <div class="duck-stats">
          <div class="stat">
            <span class="stat-icon">🪐</span>
            <span class="stat-val">CANARDWORLD</span>
            <span class="stat-lbl">Planète d'origine</span>
          </div>
          <div class="stat">
            <span class="stat-icon">🥋</span>
            <span class="stat-val">MAÎTRE</span>
            <span class="stat-lbl">Quack Fu</span>
          </div>
          <div class="stat">
            <span class="stat-icon">💼</span>
            <span class="stat-val">NAUFRAGÉ</span>
            <span class="stat-lbl">Statut</span>
          </div>
        </div>

        <button class="quack-btn" @click="playQuack">
          <span class="btn-duck">🦆</span>
          <span class="btn-text">COIN !</span>
        </button>

        <p class="quack-counter" v-if="quackCount > 0">Coin-coin : {{ quackCount }}</p>
      </div>
    </section>

    <!-- STRANDED : About -->
    <section id="stranded" class="howard-section" aria-labelledby="stranded-title">
      <div class="container">
        <div class="section-header">
          <span class="header-icon">🌍</span>
          <h2 id="stranded-title">NAUFRAGÉ SUR TERRE</h2>
          <p class="section-sub">Tirer le meilleur d'une situation bizarre</p>
        </div>

        <div class="stranded-content">
          <div class="bio-card">
            <div class="card-avatar">🦆</div>
            <div class="card-info">
              <h3>GAËTAN "HOWARD" LANGLET</h3>
              <p class="card-alias">// Se sent parfois comme un canard hors de l'eau</p>
              <div class="card-stats">
                <div class="mini-stat">
                  <span class="mini-lbl">ESPÈCE :</span>
                  <span class="mini-val">Humain (paraît-il)</span>
                </div>
                <div class="mini-stat">
                  <span class="mini-lbl">SPÉCIALITÉ :</span>
                  <span class="mini-val">Développement Full-Stack</span>
                </div>
                <div class="mini-stat">
                  <span class="mini-lbl">LOCALISATION :</span>
                  <span class="mini-val">Limoges, France</span>
                </div>
                <div class="mini-stat">
                  <span class="mini-lbl">SUPER-POUVOIR :</span>
                  <span class="mini-val">Faire fonctionner le code</span>
                </div>
              </div>
            </div>
          </div>

          <blockquote class="howard-quote">
            <p>« Je suis un canard, pas un faiseur de miracles ! »</p>
            <p class="sub-quote">(Mais je vais quand même essayer)</p>
          </blockquote>
        </div>
      </div>
    </section>

    <!-- QUACK FU : Skills -->
    <section id="quackfu" class="howard-section quackfu-section" aria-labelledby="quackfu-title">
      <div class="container">
        <div class="section-header">
          <span class="header-icon">🥋</span>
          <h2 id="quackfu-title">MAÎTRISE DU QUACK FU</h2>
          <p class="section-sub">Arts martiaux ancestraux des canards, version code</p>
        </div>

        <div class="moves-grid">
          <div v-for="move in quackMoves" :key="move.name" class="move-card" @click="executeMove(move.name)">
            <div class="move-icon">{{ move.icon }}</div>
            <h3>{{ move.name }}</h3>
            <p>{{ move.desc }}</p>
            <div class="move-power">
              <span v-for="i in move.power" :key="i" class="power-duck">🦆</span>
            </div>
            <div class="move-hit" v-if="lastMove === move.name">COIN !</div>
          </div>
        </div>
      </div>
    </section>

    <!-- ADVENTURES : Projects -->
    <section id="adventures" class="howard-section adventures-section" aria-labelledby="adventures-title">
      <div class="container">
        <div class="section-header">
          <span class="header-icon">🎬</span>
          <h2 id="adventures-title">AVENTURES TERRESTRES</h2>
          <p class="section-sub">Des projets qui prouvent que même un canard peut réussir</p>
        </div>

        <div class="adventures-grid">
          <article v-for="adv in adventures" :key="adv.id" class="adventure-card">
            <div class="card-scene" :style="{ background: adv.bg }">
              <span class="scene-icon">{{ adv.icon }}</span>
              <span class="scene-duck" aria-hidden="true">🦆</span>
            </div>
            <div class="card-content">
              <span class="card-episode">Épisode {{ adv.id }}</span>
              <h3>{{ adv.name }}</h3>
              <p>{{ adv.desc }}</p>
              <div class="card-tech">
                <span v-for="t in adv.tech" :key="t">{{ t }}</span>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- BEVERLY : Fun Section -->
    <section id="beverly" class="howard-section beverly-section" aria-labelledby="beverly-title">
      <div class="container">
        <div class="section-header">
          <span class="header-icon">🎸</span>
          <h2 id="beverly-title">CHERRY BOMB</h2>
          <p class="section-sub">Parce que tout canard a besoin d'un groupe</p>
        </div>

        <div class="band-content">
          <div class="jukebox">
            <div class="jukebox-screen">
              <span class="now-playing">EN LECTURE</span>
              <span class="track-name">{{ currentTrack }}</span>
            </div>
            <div class="jukebox-buttons">
              <button v-for="track in tracks" :key="track" @click="currentTrack = track" class="track-btn">
                {{ track }}
              </button>
            </div>
          </div>

          <div class="fun-facts">
            <h3>🦆 Le saviez-vous ?</h3>
            <ul>
              <li>Howard a été créé par Steve Gerber en 1973</li>
              <li>Il vient de Canardworld, dans une autre dimension</li>
              <li>Maître des arts martiaux Quack Fu</li>
              <li>Il s'est présenté à la présidence (véridique !)</li>
              <li>Il apparaît dans Les Gardiens de la Galaxie !</li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- BACK HOME : Contact -->
    <section id="contact" class="howard-section contact-section" aria-labelledby="contact-title">
      <div class="container">
        <h2 id="contact-title" class="contact-title">
          <span class="pre">AIDEZ-MOI À RENTRER</span>
          <span class="main">SUR CANARDWORLD</span>
          <span class="sub">(Ou au moins, travaillons ensemble)</span>
        </h2>

        <p class="contact-text">
          Tant que je suis coincé sur cette planète, autant faire de super projets.<br>
          Venez me faire un petit coucou !
        </p>

        <router-link to="/contact" class="waddle-btn">
          <span class="btn-duck">🦆</span>
          <span class="btn-text">VENEZ PAR ICI</span>
        </router-link>

        <div class="contact-footer" aria-hidden="true">
          <span>« Dans un monde plein d'humains, soyez un canard »</span>
        </div>
      </div>
    </section>

    <!-- Duck Counter -->
    <div class="duck-counter" aria-hidden="true">
      <span class="counter-duck">🦆</span>
      <span class="counter-text">COIN-O-MÈTRE : {{ quackCount }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const quackCount = ref(0);
const lastMove = ref('');
const currentTrack = ref('Cherry Bomb');

const quackMoves = [
  { name: 'COUP D\'AILE', icon: '🪶', desc: 'Développement API rapide', power: 4 },
  { name: 'FRAPPE DU BEC', icon: '🦷', desc: 'Élimination de bugs', power: 5 },
  { name: 'FURIE DE PLUMES', icon: '💨', desc: 'Optimisation performance', power: 4 },
  { name: 'PLONGEON', icon: '🌊', desc: 'Debugging système profond', power: 5 },
  { name: 'LÂCHER D\'ŒUF', icon: '🥚', desc: 'Déploiement en production', power: 3 },
  { name: 'ATTAQUE COIN', icon: '📢', desc: 'Communication client', power: 4 }
];

const adventures = [
  { id: 1, name: 'ARKADIA', icon: '🏰', desc: 'Aventure communautaire gaming', tech: ['Nitrado', 'Discord'], bg: 'linear-gradient(135deg, #1a4a6e, #0d2840)' },
  { id: 2, name: 'GL DIGITAL', icon: '🏢', desc: 'Quête dans le monde des affaires', tech: ['Symfony', 'Vue.js'], bg: 'linear-gradient(135deg, #6e4a1a, #402d0d)' },
  { id: 3, name: 'NEURAL OPS', icon: '🧪', desc: 'Escapade au labo IA', tech: ['n8n', 'Ollama'], bg: 'linear-gradient(135deg, #4a1a6e, #280d40)' },
  { id: 4, name: 'PORTFOLIO', icon: '🎪', desc: 'Vitrine spectaculaire', tech: ['Vue 3', 'Three.js'], bg: 'linear-gradient(135deg, #1a6e4a, #0d4028)' }
];

const tracks = ['Cherry Bomb', 'Duck Tales', 'Quack Rock', 'Hymne à Plumes'];

const playQuack = () => {
  quackCount.value++;
};

const executeMove = (moveName) => {
  lastMove.value = moveName;
  quackCount.value++;
  setTimeout(() => { lastMove.value = ''; }, 500);
};
</script>

<style scoped>
.howard-page {
  --yellow: #ffd700;
  --orange: #ff8c00;
  --purple: #9932cc;
  --pink: #ff69b4;
  --bg: #1a0a2e;
  background: var(--bg);
  color: #fff;
  min-height: 100vh;
  font-family: 'Comic Sans MS', 'Inter', sans-serif;
  overflow-x: hidden;
}

/* FLOATING FEATHERS */
.quack-bg { position: fixed; inset: 0; pointer-events: none; z-index: 0; }
.floating-feather {
  position: absolute; font-size: 1.5rem; left: var(--x);
  animation: featherFall 10s ease-in-out infinite;
  animation-delay: var(--delay);
}
@keyframes featherFall {
  0%, 100% { transform: translateY(-50px) rotate(0deg); opacity: 0; }
  50% { opacity: 0.5; }
  100% { transform: translateY(100vh) rotate(360deg); }
}

/* HERO */
.howard-hero {
  min-height: 100vh; display: flex; align-items: center;
  position: relative; padding: 6rem 2rem;
}
.hero-bg { position: absolute; inset: 0; overflow: hidden; }
.duckworld-portal {
  position: absolute; top: 10%; right: 10%;
  width: 200px; height: 200px; border-radius: 50%;
  background: radial-gradient(circle, var(--purple) 0%, var(--pink) 50%, transparent 70%);
  animation: portalSwirl 5s linear infinite;
  filter: blur(2px);
}
@keyframes portalSwirl { to { transform: rotate(360deg); } }
.80s-grid {
  position: absolute; bottom: 0; left: 0; right: 0; height: 40%;
  background-image: linear-gradient(var(--pink) 1px, transparent 1px),
    linear-gradient(90deg, var(--pink) 1px, transparent 1px);
  background-size: 40px 40px;
  transform: perspective(500px) rotateX(60deg);
  opacity: 0.2;
}

.container { position: relative; z-index: 2; max-width: 1100px; margin: 0 auto; }

.duck-badge {
  display: inline-flex; align-items: center; gap: 0.5rem;
  padding: 0.5rem 1rem; background: rgba(255, 215, 0, 0.2);
  border: 2px solid var(--yellow); border-radius: 2rem; margin-bottom: 1.5rem;
}
.badge-icon { font-size: 1.5rem; }
.badge-text { font-size: 0.75rem; letter-spacing: 0.1em; color: var(--yellow); }

.hero-title { margin-bottom: 2rem; }
.title-pre { display: block; font-size: 1rem; color: var(--pink); }
.title-main {
  display: block; font-size: clamp(2.5rem, 8vw, 5rem); font-weight: bold;
  color: var(--yellow); text-shadow: 3px 3px 0 var(--orange), 6px 6px 0 var(--purple);
}
.title-tag { display: block; font-size: 1rem; color: var(--orange); font-style: italic; }
.hero-quote { font-style: italic; color: rgba(255,255,255,0.7); max-width: 400px; margin-bottom: 2rem; }

.duck-stats { display: flex; gap: 2rem; margin-bottom: 2rem; flex-wrap: wrap; }
.stat { text-align: center; }
.stat-icon { display: block; font-size: 1.5rem; }
.stat-val { display: block; font-size: 1.1rem; color: var(--yellow); }
.stat-lbl { font-size: 0.6rem; color: rgba(255,255,255,0.5); }

.quack-btn, .waddle-btn {
  display: inline-flex; align-items: center; gap: 0.75rem;
  padding: 1rem 2rem; background: var(--yellow);
  border: 3px solid var(--orange); color: var(--bg);
  font-family: inherit; font-size: 1.1rem; font-weight: bold;
  cursor: pointer; transition: all 0.3s; text-decoration: none;
  border-radius: 2rem;
}
.quack-btn:hover, .waddle-btn:hover {
  transform: scale(1.1) rotate(-5deg);
  box-shadow: 0 10px 30px rgba(255, 215, 0, 0.5);
}
.btn-duck { font-size: 1.5rem; }
.quack-counter { margin-top: 1rem; font-size: 0.9rem; color: var(--pink); }

/* SECTIONS */
.howard-section { min-height: 100vh; padding: 6rem 2rem; }
.section-header { text-align: center; margin-bottom: 3rem; }
.header-icon { display: block; font-size: 2.5rem; margin-bottom: 0.5rem; }
.section-header h2 {
  font-size: clamp(1.5rem, 4vw, 2.5rem);
  color: var(--yellow); text-shadow: 2px 2px 0 var(--orange);
}
.section-sub { font-size: 0.9rem; color: var(--pink); }

/* STRANDED */
.stranded-content { max-width: 600px; margin: 0 auto; }
.bio-card {
  display: flex; gap: 1.5rem; padding: 2rem;
  background: rgba(255, 215, 0, 0.1); border: 3px solid var(--yellow);
  border-radius: 1rem; margin-bottom: 2rem;
}
.card-avatar { font-size: 4rem; }
.card-info h3 { font-size: 1.25rem; color: var(--yellow); }
.card-alias { font-size: 0.8rem; color: var(--pink); margin-bottom: 1rem; }
.mini-stat { display: flex; gap: 0.5rem; margin-bottom: 0.5rem; }
.mini-lbl { font-size: 0.75rem; color: rgba(255,255,255,0.5); }
.mini-val { font-size: 0.75rem; color: var(--orange); }

.howard-quote { text-align: center; }
.howard-quote p { font-size: 1.25rem; color: var(--yellow); }
.sub-quote { font-size: 0.9rem !important; color: var(--pink) !important; }

/* QUACK FU */
.quackfu-section { background: linear-gradient(180deg, var(--bg), #2a1040); }
.moves-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1.5rem; }
.move-card {
  padding: 1.5rem; background: rgba(255, 215, 0, 0.1);
  border: 2px solid var(--orange); border-radius: 1rem;
  text-align: center; cursor: pointer; transition: all 0.3s;
  position: relative;
}
.move-card:hover { transform: scale(1.05); border-color: var(--yellow); }
.move-icon { font-size: 2.5rem; margin-bottom: 0.5rem; }
.move-card h3 { font-size: 1rem; color: var(--yellow); margin-bottom: 0.5rem; }
.move-card p { font-size: 0.75rem; color: rgba(255,255,255,0.6); margin-bottom: 0.5rem; }
.move-power { display: flex; justify-content: center; gap: 0.25rem; }
.power-duck { font-size: 0.8rem; }
.move-hit {
  position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
  font-size: 2rem; color: var(--yellow); font-weight: bold;
  animation: hitPop 0.5s ease-out;
}
@keyframes hitPop {
  0% { transform: translate(-50%, -50%) scale(0); opacity: 1; }
  100% { transform: translate(-50%, -50%) scale(2); opacity: 0; }
}

/* ADVENTURES */
.adventures-section { background: #2a1040; }
.adventures-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1.5rem; }
.adventure-card {
  background: rgba(0,0,0,0.3); border: 2px solid var(--purple);
  border-radius: 1rem; overflow: hidden; transition: all 0.3s;
}
.adventure-card:hover { transform: translateY(-5px); border-color: var(--pink); }
.card-scene { height: 120px; position: relative; display: flex; align-items: center; justify-content: center; }
.scene-icon { font-size: 3rem; }
.scene-duck { position: absolute; bottom: 10px; right: 10px; font-size: 1.5rem; animation: waddle 1s ease-in-out infinite; }
@keyframes waddle { 50% { transform: rotate(-10deg); } }
.card-content { padding: 1.25rem; }
.card-episode { font-size: 0.65rem; color: var(--pink); }
.card-content h3 { font-size: 1.1rem; color: var(--yellow); margin-bottom: 0.5rem; }
.card-content p { font-size: 0.8rem; color: rgba(255,255,255,0.6); margin-bottom: 0.75rem; }
.card-tech { display: flex; flex-wrap: wrap; gap: 0.5rem; }
.card-tech span { padding: 0.2rem 0.5rem; background: var(--purple); font-size: 0.6rem; border-radius: 0.25rem; }

/* BEVERLY */
.beverly-section { background: linear-gradient(180deg, #2a1040, var(--bg)); }
.band-content { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; max-width: 800px; margin: 0 auto; }
.jukebox {
  padding: 1.5rem; background: linear-gradient(180deg, #ff69b4, #9932cc);
  border-radius: 1rem; text-align: center;
}
.jukebox-screen { padding: 1rem; background: #000; border-radius: 0.5rem; margin-bottom: 1rem; }
.now-playing { display: block; font-size: 0.6rem; color: var(--pink); }
.track-name { display: block; font-size: 1.25rem; color: var(--yellow); }
.jukebox-buttons { display: flex; flex-wrap: wrap; gap: 0.5rem; justify-content: center; }
.track-btn {
  padding: 0.5rem 1rem; background: var(--yellow); border: none;
  color: var(--bg); font-size: 0.75rem; cursor: pointer; border-radius: 0.25rem;
}
.track-btn:hover { background: var(--orange); }

.fun-facts { padding: 1.5rem; background: rgba(255,215,0,0.1); border-radius: 1rem; }
.fun-facts h3 { font-size: 1.1rem; color: var(--yellow); margin-bottom: 1rem; }
.fun-facts ul { list-style: none; padding: 0; }
.fun-facts li { padding: 0.5rem 0; font-size: 0.85rem; color: rgba(255,255,255,0.7); border-bottom: 1px solid rgba(255,255,255,0.1); }
.fun-facts li::before { content: '🦆 '; }

/* CONTACT */
.contact-section { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; text-align: center; }
.contact-title { margin-bottom: 1rem; }
.contact-title .pre { display: block; font-size: 1rem; color: var(--pink); }
.contact-title .main { display: block; font-size: clamp(2rem, 6vw, 4rem); color: var(--yellow); text-shadow: 3px 3px 0 var(--orange); }
.contact-title .sub { display: block; font-size: 0.9rem; color: var(--orange); }
.contact-text { color: rgba(255,255,255,0.7); margin-bottom: 2rem; }
.contact-footer { margin-top: 2rem; font-size: 0.8rem; color: var(--pink); }

/* DUCK COUNTER */
.duck-counter {
  position: fixed; bottom: 70px; right: 1rem;
  padding: 0.5rem 1rem; background: var(--yellow);
  color: var(--bg); font-size: 0.75rem; font-weight: bold;
  border-radius: 2rem; display: flex; align-items: center; gap: 0.5rem;
  z-index: 50;
}
.counter-duck { font-size: 1.25rem; }

/* RESPONSIVE */
@media (max-width: 768px) {
  .duck-stats { flex-direction: column; gap: 1rem; }
  .bio-card { flex-direction: column; text-align: center; }
  .band-content { grid-template-columns: 1fr; }
}

/* A11Y */
@media (prefers-reduced-motion: reduce) {
  .floating-feather, .duckworld-portal, .scene-duck { animation: none !important; }
}

/* Skip link */
.skip-link {
  position: absolute;
  top: -100%;
  left: 50%;
  transform: translateX(-50%);
  padding: 1rem 2rem;
  background: var(--yellow);
  color: var(--bg);
  text-decoration: none;
  border-radius: 0.5rem;
  z-index: 1000;
  transition: top 0.3s ease;
}

.skip-link:focus {
  top: 1rem;
}
</style>
