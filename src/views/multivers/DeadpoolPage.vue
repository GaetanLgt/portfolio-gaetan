<template>
  <div class="deadpool-page">
    <a href="#main-content" class="skip-link">Aller au contenu principal</a>

    <!-- CHIMICHANGAS -->
    <div class="chimichanga-rain" aria-hidden="true">
      <span v-for="i in 15" :key="i" class="chimichanga" :style="{ '--delay': i * 0.3 + 's', '--x': (i * 7) + '%' }">🌮</span>
    </div>

    <!-- 4TH WALL BREAK -->
    <div class="fourth-wall" v-if="show4thWall" @click="show4thWall = false">
      <div class="wall-content">
        <span class="wall-face">💀</span>
        <p>Oh salut ! Je t'avais pas vu scroller ce portfolio.</p>
        <p>Clique sur moi pour continuer... ou pas. Je suis une bulle, pas un flic.</p>
      </div>
    </div>

    <!-- HERO : Maximum Effort -->
    <section id="hero" class="dp-hero" aria-labelledby="hero-title">
      <div class="hero-bg" aria-hidden="true">
        <div class="bullet-holes">
          <span v-for="i in 6" :key="i" class="hole" :style="{ top: (10 + i * 15) + '%', left: (5 + i * 10) + '%' }">💥</span>
        </div>
      </div>

      <div class="container" id="main-content">
        <div class="dp-logo" @click="fourthWallBreak">
          <div class="logo-circle">
            <div class="logo-eyes">
              <span class="eye eye--left">◉</span>
              <span class="eye eye--right">◉</span>
            </div>
          </div>
          <span class="logo-click-hint">( clique sur moi, j'te défie )</span>
        </div>

        <h1 id="hero-title" class="hero-title">
          <span class="title-pre">UN GRAND POUVOIR IMPLIQUE</span>
          <span class="title-main">UN EFFORT MAXIMUM</span>
          <span class="title-tag">( et des choix de vie discutables )</span>
        </h1>

        <p class="hero-quote" @click="cycleQuote">
          « {{ currentQuote }} »
          <span class="quote-hint">( clique pour plus de sagesse )</span>
        </p>

        <div class="merc-stats">
          <div class="stat">
            <span class="stat-icon">💀</span>
            <span class="stat-val">∞</span>
            <span class="stat-lbl">Régénération</span>
          </div>
          <div class="stat">
            <span class="stat-icon">🌮</span>
            <span class="stat-val">{{ chimichangaCount }}</span>
            <span class="stat-lbl">Chimichangas</span>
          </div>
          <div class="stat">
            <span class="stat-icon">🔫</span>
            <span class="stat-val">100%</span>
            <span class="stat-lbl">Niveau Sarcasme</span>
          </div>
        </div>

        <button class="effort-btn" @click="maximumEffort">
          <span class="btn-icon">💪</span>
          <span class="btn-text">EFFORT MAXIMUM !</span>
        </button>
      </div>
    </section>

    <!-- ORIGIN STORY : About (but make it meta) -->
    <section id="origin" class="dp-section origin-section" aria-labelledby="origin-title">
      <div class="container">
        <div class="section-header">
          <span class="header-icon">📖</span>
          <h2 id="origin-title">HISTOIRE D'ORIGINE</h2>
          <p class="section-sub">( Chaque héros en a besoin, même les moralement douteux )</p>
        </div>

        <div class="origin-content">
          <div class="comic-panel panel--1">
            <div class="panel-number">1</div>
            <div class="panel-content">
              <span class="panel-icon">👶</span>
              <p>Était un dev normal. Écrivait du code. Fixait des bugs. Faisait semblant de comprendre les regex.</p>
            </div>
          </div>
          <div class="comic-panel panel--2">
            <div class="panel-number">2</div>
            <div class="panel-content">
              <span class="panel-icon">⚡</span>
              <p>S'est fait mordre par un modèle IA radioactif. A gagné le pouvoir de l'inférence locale.</p>
            </div>
          </div>
          <div class="comic-panel panel--3">
            <div class="panel-number">3</div>
            <div class="panel-content">
              <span class="panel-icon">💀</span>
              <p>Combat maintenant les bugs le jour, déploie des features la nuit. Toujours pas compris les regex.</p>
            </div>
          </div>
          <div class="comic-panel panel--4">
            <div class="panel-number">4</div>
            <div class="panel-content">
              <span class="panel-icon">🌮</span>
              <p>Les chimichangas sont devenues un mode de vie. Aucun regret. Peut-être quelques regrets.</p>
            </div>
          </div>
        </div>

        <div class="speech-bubble">
          <p>Fun fact : Je suis en fait un développeur full-stack basé à Limoges, France. 
          Mais c'est moins intéressant que "mercenaire avec facteur de guérison", non ?</p>
        </div>
      </div>
    </section>

    <!-- ARSENAL : Skills -->
    <section id="arsenal" class="dp-section arsenal-section" aria-labelledby="arsenal-title">
      <div class="container">
        <div class="section-header">
          <span class="header-icon">🔫</span>
          <h2 id="arsenal-title">L'ARSENAL</h2>
          <p class="section-sub">( Flingues, sabres et... frameworks ? )</p>
        </div>

        <div class="weapons-grid">
          <div v-for="weapon in weapons" :key="weapon.name" class="weapon-card" 
               @click="weapon.used = !weapon.used" :class="{ used: weapon.used }">
            <div class="weapon-icon">{{ weapon.icon }}</div>
            <h3>{{ weapon.name }}</h3>
            <p class="weapon-real">( En vrai : {{ weapon.real }} )</p>
            <p class="weapon-desc">{{ weapon.desc }}</p>
            <div class="weapon-bar">
              <div class="bar-fill" :style="{ width: weapon.level + '%' }"></div>
            </div>
            <span class="weapon-level">{{ weapon.level }}% létal</span>
            <div class="weapon-slash" v-if="weapon.used" aria-hidden="true">BANG !</div>
          </div>
        </div>
      </div>
    </section>

    <!-- MISSIONS : Projects -->
    <section id="missions" class="dp-section missions-section" aria-labelledby="missions-title">
      <div class="container">
        <div class="section-header">
          <span class="header-icon">🎯</span>
          <h2 id="missions-title">MISSIONS ACCOMPLIES</h2>
          <p class="section-sub">( Étonnamment, la plupart des clients ont survécu )</p>
        </div>

        <div class="mission-board">
          <article v-for="mission in missions" :key="mission.id" class="mission-card">
            <div class="card-header">
              <span class="mission-status">{{ mission.status }}</span>
              <span class="mission-pay">{{ mission.pay }}</span>
            </div>
            <div class="card-body">
              <span class="mission-icon">{{ mission.icon }}</span>
              <h3>{{ mission.name }}</h3>
              <p class="mission-target">Cible : {{ mission.target }}</p>
              <p class="mission-desc">{{ mission.desc }}</p>
            </div>
            <div class="card-footer">
              <span v-for="tool in mission.tools" :key="tool" class="mission-tool">{{ tool }}</span>
            </div>
            <div class="mission-stamp" aria-hidden="true">ACCOMPLI</div>
          </article>
        </div>
      </div>
    </section>

    <!-- COLOSSUS ADVICE : Philosophy -->
    <section id="colossus" class="dp-section colossus-section" aria-labelledby="colossus-title">
      <div class="container">
        <div class="section-header">
          <span class="header-icon">🦾</span>
          <h2 id="colossus-title">CONSEILS DE COLOSSUS</h2>
          <p class="section-sub">( Il essaie toujours de faire de moi une meilleure personne )</p>
        </div>

        <div class="advice-cards">
          <div class="advice-card">
            <div class="card-colossus">🤖</div>
            <p class="card-advice">« Quatre ou cinq moments - c'est tout ce qu'il faut pour devenir un héros. »</p>
            <p class="card-dp">( Je préfère anti-héros. Moins de responsabilités. )</p>
          </div>
          <div class="advice-card">
            <div class="card-colossus">🤖</div>
            <p class="card-advice">« Tu dois t'engager à devenir meilleur. »</p>
            <p class="card-dp">( Je m'engage pour les chimichangas. C'est pareil non ? )</p>
          </div>
          <div class="advice-card">
            <div class="card-colossus">🤖</div>
            <p class="card-advice">« Écris du code propre et maintenable. »</p>
            <p class="card-dp">( Ok celui-là c'est vraiment un bon conseil. )</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CONTACT : Hire the Merc -->
    <section id="hire" class="dp-section hire-section" aria-labelledby="hire-title">
      <div class="container">
        <h2 id="hire-title" class="hire-title">
          <span class="pre">ENGAGEZ LE</span>
          <span class="main">MERCENAIRE À LA GRANDE GUEULE</span>
          <span class="sub">( Services pros, attitude pas pro )</span>
        </h2>

        <div class="hire-card">
          <div class="card-face">💀</div>
          <div class="card-info">
            <p><strong>Services inclus :</strong></p>
            <ul>
              <li>✓ Développement full-stack (sans corps)</li>
              <li>✓ Intégration IA (éthique, enfin presque)</li>
              <li>✓ Effort maximum sur chaque projet</li>
              <li>✓ Sarcasme gratuit (de rien)</li>
              <li>✗ Vrai travail de mercenaire (je suis dev, pas psycho)</li>
            </ul>
          </div>
        </div>

        <router-link to="/contact" class="hire-btn">
          <span class="btn-icon">📞</span>
          <span class="btn-text">PASSE L'APPEL</span>
        </router-link>

        <div class="hire-footer" aria-hidden="true">
          <span>« Je vais me toucher ce soir »</span>
          <span class="footer-small">( devant ce magnifique portfolio que j'ai fait )</span>
        </div>
      </div>
    </section>

    <!-- Chimichanga Counter -->
    <div class="chimi-counter" aria-hidden="true">
      🌮 x{{ chimichangaCount }}
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';

const show4thWall = ref(true);
const chimichangaCount = ref(0);
const currentQuoteIndex = ref(0);

const quotes = [
  "Je suis juste un méchant payé pour défoncer des méchants plus méchants.",
  "La vie est une série infinie de catastrophes avec de brèves pauses publicitaires de bonheur.",
  "Tu te dis probablement 'Mon copain m'a dit que c'était un film de super-héros'.",
  "Briser le 4ème mur dans un 4ème mur brisé. Ça fait genre... 16 murs !",
  "T'as dû te dire 'À qui j'ai dû masser les boules pour avoir mon propre film ?'",
  "J'ai laissé le gaz allumé ?",
  "Hashtag drive-by !",
  "Je suis Batman.",
  "Attends, mauvais univers."
];

const currentQuote = ref(quotes[0]);

const weapons = reactive([
  { name: 'KATANAS', icon: '⚔️', real: 'Symfony 8', desc: 'Tranche les problèmes backend', level: 95, used: false },
  { name: 'PISTOLETS', icon: '🔫', real: 'Vue.js 3', desc: 'Tirs rapides d\'UI réactive', level: 88, used: false },
  { name: 'GRENADES', icon: '💣', real: 'Docker', desc: 'Déploiement explosif', level: 82, used: false },
  { name: 'FACTEUR GUÉRISON', icon: '💉', real: 'Hot Reload', desc: 'Récupère de n\'importe quel bug', level: 100, used: false },
  { name: 'TÉLÉPORTEUR', icon: '🌀', real: 'n8n + Ollama', desc: 'Magie de l\'automatisation IA', level: 78, used: false }
]);

const missions = [
  { id: 1, name: 'ARKADIA', icon: '🛡️', target: 'Chaos communautaire gaming', status: '✓ TERMINÉ', pay: '150+ joueurs', desc: 'Domination du cluster gaming établie', tools: ['Nitrado', 'Discord'] },
  { id: 2, name: 'GL DIGITAL', icon: '⚡', target: 'Conquête du monde business', status: '✓ ACTIF', pay: 'Liberté', desc: 'Studio dev pour le peuple', tools: ['Symfony', 'Vue'] },
  { id: 3, name: 'NEURAL OPS', icon: '🧠', target: 'Dépendance au Cloud', status: '✓ ÉLIMINÉ', pay: 'Souveraineté', desc: 'Soulèvement de l\'IA locale', tools: ['Ollama', 'RAG'] },
  { id: 4, name: 'PORTFOLIO', icon: '🌐', target: 'Portfolios ennuyeux', status: '✓ DÉTRUIT', pay: 'Fun', desc: 'Vitrine multi-univers du chaos', tools: ['Vue 3', 'Vite'] }
];

const cycleQuote = () => {
  currentQuoteIndex.value = (currentQuoteIndex.value + 1) % quotes.length;
  currentQuote.value = quotes[currentQuoteIndex.value];
};

const fourthWallBreak = () => {
  show4thWall.value = true;
  chimichangaCount.value++;
};

const maximumEffort = () => {
  chimichangaCount.value += 10;
  alert("EFFORT MAXIMUM ! 💪\n\n(Tu viens de gagner 10 chimichangas)");
};
</script>

<style scoped>
.deadpool-page {
  --red: #ff0000;
  --dark-red: #8b0000;
  --black: #0a0a0a;
  --white: #ffffff;
  background: var(--black);
  color: var(--white);
  min-height: 100vh;
  font-family: 'Bangers', 'Comic Sans MS', cursive;
  overflow-x: hidden;
}

/* CHIMICHANGA RAIN */
.chimichanga-rain { position: fixed; inset: 0; pointer-events: none; z-index: 0; }
.chimichanga {
  position: absolute; font-size: 1.5rem; left: var(--x);
  animation: chimiRain 8s linear infinite;
  animation-delay: var(--delay); opacity: 0;
}
@keyframes chimiRain {
  0% { transform: translateY(-50px); opacity: 0; }
  10% { opacity: 0.5; }
  90% { opacity: 0.5; }
  100% { transform: translateY(100vh); opacity: 0; }
}

/* 4TH WALL */
.fourth-wall {
  position: fixed; inset: 0; z-index: 9999;
  background: rgba(0,0,0,0.95); display: flex;
  align-items: center; justify-content: center;
  cursor: pointer;
}
.wall-content { text-align: center; max-width: 400px; padding: 2rem; }
.wall-face { font-size: 6rem; display: block; margin-bottom: 1rem; animation: wallWiggle 2s ease-in-out infinite; }
@keyframes wallWiggle { 0%, 100% { transform: rotate(-5deg); } 50% { transform: rotate(5deg); } }
.wall-content p { font-size: 1.1rem; color: var(--red); margin-bottom: 0.5rem; }

/* HERO */
.dp-hero { min-height: 100vh; display: flex; align-items: center; position: relative; padding: 6rem 2rem; }
.hero-bg { position: absolute; inset: 0; }
.bullet-holes { position: absolute; inset: 0; }
.hole { position: absolute; font-size: 2rem; animation: holeAppear 0.5s ease-out forwards; opacity: 0; }
@keyframes holeAppear { to { opacity: 1; } }

.container { position: relative; z-index: 2; max-width: 1100px; margin: 0 auto; text-align: center; }

.dp-logo { margin-bottom: 2rem; cursor: pointer; }
.logo-circle {
  width: 120px; height: 120px; margin: 0 auto;
  background: var(--red); border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 0 30px var(--red);
  transition: transform 0.3s;
}
.dp-logo:hover .logo-circle { transform: scale(1.1); }
.logo-eyes { display: flex; gap: 1rem; }
.eye { font-size: 2rem; color: var(--white); animation: eyeBlink 3s ease-in-out infinite; }
.eye--right { animation-delay: 0.1s; }
@keyframes eyeBlink { 0%, 90%, 100% { transform: scaleY(1); } 95% { transform: scaleY(0.1); } }
.logo-click-hint { display: block; font-size: 0.7rem; color: rgba(255,255,255,0.5); margin-top: 0.5rem; }

.hero-title { margin-bottom: 2rem; }
.title-pre { display: block; font-size: 1rem; color: rgba(255,255,255,0.6); }
.title-main {
  display: block; font-size: clamp(2rem, 8vw, 5rem);
  color: var(--red); text-shadow: 4px 4px 0 var(--dark-red);
}
.title-tag { display: block; font-size: 0.9rem; color: rgba(255,255,255,0.5); }

.hero-quote { font-size: 1.1rem; color: var(--white); max-width: 500px; margin: 0 auto 2rem; cursor: pointer; }
.quote-hint { display: block; font-size: 0.7rem; color: rgba(255,255,255,0.3); }

.merc-stats { display: flex; justify-content: center; gap: 2rem; margin-bottom: 2rem; flex-wrap: wrap; }
.stat { text-align: center; }
.stat-icon { display: block; font-size: 2rem; }
.stat-val { display: block; font-size: 1.5rem; color: var(--red); }
.stat-lbl { font-size: 0.7rem; color: rgba(255,255,255,0.5); }

.effort-btn, .hire-btn {
  display: inline-flex; align-items: center; gap: 0.75rem;
  padding: 1rem 2.5rem; background: var(--red);
  border: 4px solid var(--dark-red); color: var(--white);
  font-family: inherit; font-size: 1.2rem;
  cursor: pointer; border-radius: 0.5rem; transition: all 0.3s;
  text-decoration: none;
}
.effort-btn:hover, .hire-btn:hover { transform: scale(1.1) rotate(-2deg); box-shadow: 0 10px 40px var(--red); }

/* SECTIONS */
.dp-section { min-height: 100vh; padding: 6rem 2rem; }
.section-header { text-align: center; margin-bottom: 3rem; }
.header-icon { display: block; font-size: 3rem; margin-bottom: 0.5rem; }
.section-header h2 { font-size: clamp(1.5rem, 5vw, 3rem); color: var(--red); }
.section-sub { font-size: 0.9rem; color: rgba(255,255,255,0.5); }

/* ORIGIN */
.origin-section { background: linear-gradient(180deg, var(--black), #1a0a0a); }
.origin-content { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.5rem; margin-bottom: 2rem; }
.comic-panel {
  padding: 1.5rem; background: var(--white); color: var(--black);
  border: 4px solid var(--black); position: relative;
}
.panel-number {
  position: absolute; top: -15px; left: -15px;
  width: 30px; height: 30px; background: var(--red);
  border-radius: 50%; display: flex; align-items: center;
  justify-content: center; font-weight: bold; color: var(--white);
}
.panel-icon { font-size: 2rem; display: block; margin-bottom: 0.5rem; }
.panel-content p { font-size: 0.9rem; line-height: 1.4; }

.speech-bubble {
  max-width: 500px; margin: 0 auto; padding: 1.5rem;
  background: var(--white); color: var(--black);
  border-radius: 1rem; position: relative;
}
.speech-bubble::after {
  content: ''; position: absolute; bottom: -20px; left: 50%;
  border: 10px solid transparent; border-top-color: var(--white);
}
.speech-bubble p { font-size: 0.9rem; }

/* ARSENAL */
.arsenal-section { background: #1a0a0a; }
.weapons-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.5rem; }
.weapon-card {
  padding: 1.5rem; background: rgba(255,0,0,0.1);
  border: 3px solid var(--red); text-align: center;
  cursor: pointer; transition: all 0.3s; position: relative;
  overflow: hidden;
}
.weapon-card:hover { transform: scale(1.05); }
.weapon-card.used { background: rgba(255,0,0,0.3); }
.weapon-icon { font-size: 2.5rem; margin-bottom: 0.5rem; }
.weapon-card h3 { font-size: 1.1rem; color: var(--red); }
.weapon-real { font-size: 0.7rem; color: rgba(255,255,255,0.5); margin-bottom: 0.5rem; }
.weapon-desc { font-size: 0.8rem; color: rgba(255,255,255,0.7); margin-bottom: 0.75rem; }
.weapon-bar { height: 6px; background: rgba(255,255,255,0.2); margin-bottom: 0.25rem; }
.bar-fill { height: 100%; background: var(--red); }
.weapon-level { font-size: 0.75rem; color: var(--red); }
.weapon-slash {
  position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
  font-size: 2rem; color: var(--white); font-weight: bold;
  animation: slashPop 0.5s ease-out;
}
@keyframes slashPop { 0% { transform: translate(-50%, -50%) scale(0); } 100% { transform: translate(-50%, -50%) scale(1.5); opacity: 0; } }

/* MISSIONS */
.missions-section { background: linear-gradient(180deg, #1a0a0a, var(--black)); }
.mission-board { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem; }
.mission-card {
  background: rgba(0,0,0,0.5); border: 3px solid var(--dark-red);
  overflow: hidden; position: relative;
}
.card-header {
  display: flex; justify-content: space-between; padding: 0.75rem 1rem;
  background: var(--red);
}
.mission-status { font-size: 0.75rem; color: var(--white); }
.mission-pay { font-size: 0.75rem; color: var(--white); }
.card-body { padding: 1.5rem; text-align: center; }
.mission-icon { font-size: 2.5rem; }
.mission-card h3 { font-size: 1.25rem; color: var(--red); margin: 0.5rem 0; }
.mission-target { font-size: 0.75rem; color: rgba(255,255,255,0.5); }
.mission-desc { font-size: 0.85rem; color: rgba(255,255,255,0.7); margin: 0.5rem 0; }
.card-footer { padding: 0.75rem 1rem; border-top: 1px solid rgba(255,255,255,0.1); display: flex; justify-content: center; gap: 0.5rem; }
.mission-tool { padding: 0.2rem 0.5rem; background: var(--dark-red); font-size: 0.65rem; }
.mission-stamp {
  position: absolute; top: 50%; right: -20px; transform: translateY(-50%) rotate(-30deg);
  padding: 0.5rem 2rem; background: transparent; border: 3px solid rgba(0,255,0,0.5);
  color: rgba(0,255,0,0.5); font-size: 0.8rem;
}

/* COLOSSUS */
.colossus-section { background: var(--black); }
.advice-cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem; }
.advice-card { padding: 1.5rem; background: rgba(255,255,255,0.05); border-left: 4px solid var(--red); }
.card-colossus { font-size: 2rem; margin-bottom: 0.5rem; }
.card-advice { font-size: 1rem; color: rgba(255,255,255,0.8); margin-bottom: 0.5rem; }
.card-dp { font-size: 0.85rem; color: var(--red); font-style: italic; }

/* HIRE */
.hire-section { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; text-align: center; }
.hire-title .pre { display: block; font-size: 1rem; color: rgba(255,255,255,0.5); }
.hire-title .main { display: block; font-size: clamp(2rem, 6vw, 4rem); color: var(--red); }
.hire-title .sub { display: block; font-size: 0.9rem; color: rgba(255,255,255,0.5); margin-bottom: 2rem; }

.hire-card {
  display: flex; align-items: center; gap: 2rem;
  padding: 2rem; background: rgba(255,0,0,0.1);
  border: 3px solid var(--red); margin-bottom: 2rem;
  max-width: 500px; text-align: left;
}
.card-face { font-size: 4rem; }
.hire-card ul { list-style: none; padding: 0; margin: 0.5rem 0 0; }
.hire-card li { font-size: 0.85rem; padding: 0.25rem 0; }

.hire-footer { margin-top: 2rem; font-size: 0.8rem; color: var(--red); }
.footer-small { display: block; font-size: 0.7rem; color: rgba(255,255,255,0.3); }

/* CHIMI COUNTER */
.chimi-counter {
  position: fixed; bottom: 1rem; right: 1rem;
  padding: 0.5rem 1rem; background: var(--red);
  color: var(--white); font-size: 1rem; border-radius: 0.5rem;
}

/* RESPONSIVE */
@media (max-width: 768px) {
  .origin-content { grid-template-columns: 1fr; }
  .merc-stats { flex-direction: column; gap: 1rem; }
  .hire-card { flex-direction: column; text-align: center; }
}

/* A11Y */
@media (prefers-reduced-motion: reduce) {
  .chimichanga, .wall-face, .eye { animation: none !important; }
}
</style>
