<template>
  <div class="samus-elements-page">
    <a href="#main-content" class="skip-link">Aller au contenu principal</a>

    <!-- PLANETARY BACKGROUND -->
    <div class="planetary-bg" aria-hidden="true">
      <div class="stars"></div>
      <div class="mars-glow"></div>
      <div class="elements-orbit">
        <span class="orbit-element orbit-element--fire">🔥</span>
        <span class="orbit-element orbit-element--water">💧</span>
        <span class="orbit-element orbit-element--air">💨</span>
        <span class="orbit-element orbit-element--earth">🌍</span>
      </div>
    </div>

    <!-- HERO -->
    <section class="hero" aria-labelledby="hero-title">
      <div class="container" id="main-content">
        <div class="hero-badge">
          <span class="badge-icon">🎨</span>
          <span class="badge-text">CRÉATION ORIGINALE • COLLÈGE • 19/20</span>
        </div>

        <h1 id="hero-title" class="hero-title">
          <span class="title-pre">Les Quatre Éléments</span>
          <span class="title-main">SAMUS ARAN</span>
          <span class="title-sub">Chasseuse de Primes Galactique sur Mars</span>
        </h1>

        <p class="hero-quote">
          « Une guerrière solitaire, maîtrisant les forces primordiales 
          de l'univers, debout sur la planète rouge. »
        </p>

        <div class="hero-elements">
          <div class="element element--fire">
            <span class="element-icon">🔥</span>
            <span class="element-name">Feu</span>
            <span class="element-power">Plasma Beam</span>
          </div>
          <div class="element element--water">
            <span class="element-icon">💧</span>
            <span class="element-name">Eau</span>
            <span class="element-power">Ice Beam</span>
          </div>
          <div class="element element--air">
            <span class="element-icon">💨</span>
            <span class="element-name">Air</span>
            <span class="element-power">Speed Booster</span>
          </div>
          <div class="element element--earth">
            <span class="element-icon">🪨</span>
            <span class="element-name">Terre</span>
            <span class="element-power">Morph Ball</span>
          </div>
          <div class="element element--planet">
            <span class="element-icon">🌍</span>
            <span class="element-name">La Terre</span>
            <span class="element-power">Home</span>
          </div>
        </div>

        <button class="cta-btn" @click="scrollTo('composition')">
          <span class="btn-glow"></span>
          <span class="btn-text">EXPLORER LA COMPOSITION</span>
        </button>
      </div>

      <!-- Samus Silhouette -->
      <div class="samus-silhouette" aria-hidden="true">
        <div class="power-suit"></div>
        <div class="arm-cannon"></div>
        <div class="visor-glow"></div>
      </div>
    </section>

    <!-- COMPOSITION ORIGINALE -->
    <section id="composition" class="section composition-section" aria-labelledby="composition-title">
      <div class="container">
        <div class="section-header">
          <span class="header-icon">🎨</span>
          <h2 id="composition-title">La Composition Originale</h2>
          <p class="section-sub">Une vision d'enfance, une note de légende</p>
        </div>

        <div class="composition-story">
          <div class="story-card story-card--main">
            <div class="card-badge">📜 L'Histoire</div>
            <h3>Le Défi des Quatre Éléments</h3>
            <p>
              Au collège, un exercice d'arts plastiques demandait de représenter 
              les quatre éléments classiques : <strong>l'Eau, l'Air, le Feu, la Terre</strong>. 
              Mais pourquoi s'arrêter là ?
            </p>
            <p>
              L'idée est venue naturellement : ajouter <strong>la Terre en tant que planète</strong>, 
              notre maison dans l'immensité cosmique. Et pour incarner cette fusion 
              entre mythologie antique et science-fiction moderne...
            </p>
            <p class="highlight">
              <strong>Samus Aran</strong>, la chasseuse de primes légendaire de Metroid, 
              debout sur Mars, canalisant les forces élémentaires de l'univers.
            </p>
          </div>

          <div class="story-grid">
            <div class="story-card">
              <span class="card-icon">🔴</span>
              <h4>Mars</h4>
              <p>La planète rouge comme décor, symbole de l'exploration et du courage solitaire.</p>
            </div>
            <div class="story-card">
              <span class="card-icon">🛡️</span>
              <h4>Power Suit</h4>
              <p>L'armure iconique de Samus, fusion parfaite de technologie Chozo et de volonté humaine.</p>
            </div>
            <div class="story-card">
              <span class="card-icon">⚡</span>
              <h4>Les Beams</h4>
              <p>Chaque élément représenté par un pouvoir : Plasma, Ice, Wave, et les bombes Morph Ball.</p>
            </div>
            <div class="story-card">
              <span class="card-icon">🏆</span>
              <h4>19/20</h4>
              <p>La note qui valide cette vision audacieuse. Le point manquant ? Peut-être un 5ème élément.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- LES ÉLÉMENTS EN DÉTAIL -->
    <section class="section elements-section" aria-labelledby="elements-title">
      <div class="container">
        <div class="section-header">
          <span class="header-icon">🌀</span>
          <h2 id="elements-title">Les Cinq Éléments</h2>
          <p class="section-sub">Traduits dans l'arsenal de Samus</p>
        </div>

        <div class="elements-detailed">
          <article class="element-card" v-for="elem in elements" :key="elem.name" :style="{ '--accent': elem.color }">
            <div class="element-visual">
              <span class="visual-icon">{{ elem.icon }}</span>
              <div class="visual-ring"></div>
            </div>
            <div class="element-info">
              <h3>{{ elem.name }}</h3>
              <p class="element-desc">{{ elem.description }}</p>
              <div class="element-metroid">
                <span class="metroid-label">Dans Metroid :</span>
                <span class="metroid-power">{{ elem.power }}</span>
              </div>
              <p class="element-meaning">{{ elem.meaning }}</p>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- CONNEXION AU PRÉSENT -->
    <section class="section connection-section" aria-labelledby="connection-title">
      <div class="container">
        <div class="section-header">
          <span class="header-icon">🔗</span>
          <h2 id="connection-title">Du Collège au Code</h2>
          <p class="section-sub">Les fils invisibles de la créativité</p>
        </div>

        <div class="connection-content">
          <div class="timeline-vertical">
            <div class="timeline-item">
              <div class="timeline-marker">🎨</div>
              <div class="timeline-content">
                <h4>Collège — La Composition</h4>
                <p>Première fusion art + gaming + science. L'imagination sans limites.</p>
              </div>
            </div>
            <div class="timeline-item">
              <div class="timeline-marker">🎮</div>
              <div class="timeline-content">
                <h4>Gaming — L'Exploration</h4>
                <p>Des heures dans les couloirs de Zebes, SR388, et Tallon IV. L'attention au détail.</p>
              </div>
            </div>
            <div class="timeline-item">
              <div class="timeline-marker">💻</div>
              <div class="timeline-content">
                <h4>Développement — La Maîtrise</h4>
                <p>Comme Samus qui upgrade son suit, j'accumule les compétences : PHP, Vue, Three.js...</p>
              </div>
            </div>
            <div class="timeline-item">
              <div class="timeline-marker">🚀</div>
              <div class="timeline-content">
                <h4>GL Digital Lab — La Mission</h4>
                <p>Chasseur de solutions pour PME. Chaque projet est une nouvelle planète à explorer.</p>
              </div>
            </div>
          </div>

          <blockquote class="connection-quote">
            <p>« La créativité d'un enfant qui dessine Samus sur Mars est la même qui architecte des systèmes aujourd'hui. Les outils changent, pas l'essence. »</p>
            <cite>— Neo, développeur & rêveur</cite>
          </blockquote>
        </div>
      </div>
    </section>

    <!-- SAMUS SPECS -->
    <section class="section specs-section" aria-labelledby="specs-title">
      <div class="container">
        <div class="section-header">
          <span class="header-icon">📊</span>
          <h2 id="specs-title">Fiche Chasseuse</h2>
          <p class="section-sub">Données de la Fédération Galactique</p>
        </div>

        <div class="specs-grid">
          <div class="spec-card">
            <div class="spec-header">
              <span class="spec-icon">👤</span>
              <h4>Identité</h4>
            </div>
            <div class="spec-data">
              <div class="data-row"><span>Nom</span><span>Samus Aran</span></div>
              <div class="data-row"><span>Origine</span><span>K-2L (colonie Terre)</span></div>
              <div class="data-row"><span>Espèce</span><span>Humaine (ADN Chozo/Metroid)</span></div>
              <div class="data-row"><span>Profession</span><span>Chasseuse de Primes</span></div>
              <div class="data-row"><span>Affiliation</span><span>Indépendante</span></div>
            </div>
          </div>

          <div class="spec-card">
            <div class="spec-header">
              <span class="spec-icon">🛡️</span>
              <h4>Power Suit</h4>
            </div>
            <div class="spec-data">
              <div class="data-row"><span>Créateurs</span><span>Chozo</span></div>
              <div class="data-row"><span>Variantes</span><span>Varia, Gravity, Phazon</span></div>
              <div class="data-row"><span>Arm Cannon</span><span>Modulaire</span></div>
              <div class="data-row"><span>Morph Ball</span><span>0.8m diamètre</span></div>
              <div class="data-row"><span>Screw Attack</span><span>Rotation létale</span></div>
            </div>
          </div>

          <div class="spec-card spec-card--wide">
            <div class="spec-header">
              <span class="spec-icon">⚔️</span>
              <h4>Arsenal Élémentaire</h4>
            </div>
            <div class="arsenal-grid">
              <div class="arsenal-item" v-for="weapon in arsenal" :key="weapon.name" :style="{ '--color': weapon.color }">
                <span class="arsenal-icon">{{ weapon.icon }}</span>
                <span class="arsenal-name">{{ weapon.name }}</span>
                <span class="arsenal-element">{{ weapon.element }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="section cta-section" aria-labelledby="cta-title">
      <div class="container">
        <div class="cta-card">
          <div class="cta-visual">
            <span class="cta-icon">🌌</span>
          </div>
          <h2 id="cta-title">Mission Acceptée ?</h2>
          <p>Comme Samus, je pars en mission solo pour résoudre vos défis numériques.</p>
          <div class="cta-buttons">
            <router-link to="/contact" class="btn btn--primary">
              📡 Établir Contact
            </router-link>
            <router-link to="/multivers" class="btn btn--secondary">
              🌀 Autres Univers
            </router-link>
          </div>
        </div>
      </div>
    </section>

    <!-- MISSION COMPLETE BADGE -->
    <div class="mission-complete" aria-hidden="true">
      <div class="mission-ring"></div>
      <span class="mission-text">ITEM ACQUIRED</span>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const scrollTo = (id) => {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
};

const elements = [
  {
    name: 'Feu',
    icon: '🔥',
    color: '#f97316',
    description: 'L\'énergie destructrice, la passion, la transformation.',
    power: 'Plasma Beam',
    meaning: 'Le feu intérieur qui pousse à créer, à innover, à brûler les limites.'
  },
  {
    name: 'Eau',
    icon: '💧',
    color: '#3b82f6',
    description: 'L\'adaptabilité, la fluidité, la persévérance.',
    power: 'Ice Beam / Wave Beam',
    meaning: 'S\'adapter à chaque projet, contourner les obstacles comme l\'eau contourne les rochers.'
  },
  {
    name: 'Air',
    icon: '💨',
    color: '#a855f7',
    description: 'La liberté, la vitesse, l\'invisibilité.',
    power: 'Speed Booster / Space Jump',
    meaning: 'La légèreté du code propre, la vélocité de l\'exécution, l\'agilité mentale.'
  },
  {
    name: 'Terre',
    icon: '🪨',
    color: '#84cc16',
    description: 'La solidité, la fondation, l\'ancrage.',
    power: 'Morph Ball / Power Bombs',
    meaning: 'Les fondations solides d\'une architecture, la robustesse du backend.'
  },
  {
    name: 'La Planète Terre',
    icon: '🌍',
    color: '#10b981',
    description: 'Notre maison, l\'humanité, la perspective cosmique.',
    power: 'Home Base',
    meaning: 'Où que l\'on explore, on revient toujours à l\'essentiel : les humains qu\'on sert.'
  }
];

const arsenal = [
  { name: 'Power Beam', element: 'Base', icon: '⚪', color: '#e5e5e5' },
  { name: 'Plasma Beam', element: 'Feu', icon: '🔥', color: '#f97316' },
  { name: 'Ice Beam', element: 'Eau', icon: '❄️', color: '#3b82f6' },
  { name: 'Wave Beam', element: 'Air', icon: '💜', color: '#a855f7' },
  { name: 'Bombs', element: 'Terre', icon: '💣', color: '#84cc16' },
  { name: 'Missiles', element: 'Feu', icon: '🚀', color: '#ef4444' },
  { name: 'Super Missiles', element: 'Feu+', icon: '💥', color: '#dc2626' },
  { name: 'Grapple Beam', element: 'Air', icon: '🪝', color: '#06b6d4' },
];
</script>

<style scoped>
.samus-elements-page {
  --fire: #f97316;
  --water: #3b82f6;
  --air: #a855f7;
  --earth: #84cc16;
  --planet: #10b981;
  --mars: #dc2626;
  --gold: #fbbf24;
  --bg: #0a0a0f;
  --surface: #12121a;
  --text: #e5e5e5;
  --text-muted: rgba(229, 229, 229, 0.6);
  
  background: var(--bg);
  color: var(--text);
  min-height: 100vh;
  font-family: 'Inter', sans-serif;
  overflow-x: hidden;
}

/* BACKGROUND */
.planetary-bg {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
}

.stars {
  position: absolute;
  inset: 0;
  background-image: 
    radial-gradient(1px 1px at 20px 30px, white, transparent),
    radial-gradient(1px 1px at 40px 70px, rgba(255,255,255,0.8), transparent),
    radial-gradient(1px 1px at 90px 40px, white, transparent),
    radial-gradient(1px 1px at 160px 120px, rgba(255,255,255,0.6), transparent),
    radial-gradient(2px 2px at 200px 50px, white, transparent);
  background-size: 250px 250px;
  animation: twinkle 8s ease-in-out infinite;
}

@keyframes twinkle {
  0%, 100% { opacity: 0.8; }
  50% { opacity: 0.4; }
}

.mars-glow {
  position: absolute;
  top: 20%;
  right: 10%;
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, rgba(220, 38, 38, 0.15) 0%, transparent 70%);
  border-radius: 50%;
  filter: blur(40px);
}

.elements-orbit {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 400px;
  height: 400px;
  transform: translate(-50%, -50%);
  animation: orbit 30s linear infinite;
}

@keyframes orbit { to { transform: translate(-50%, -50%) rotate(360deg); } }

.orbit-element {
  position: absolute;
  font-size: 1.5rem;
  opacity: 0.3;
  animation: counter-orbit 30s linear infinite;
}

@keyframes counter-orbit { to { transform: rotate(-360deg); } }

.orbit-element--fire { top: 0; left: 50%; transform: translateX(-50%); }
.orbit-element--water { top: 50%; right: 0; }
.orbit-element--air { bottom: 0; left: 50%; transform: translateX(-50%); }
.orbit-element--earth { top: 50%; left: 0; }

/* HERO */
.hero {
  position: relative;
  z-index: 1;
  min-height: 100vh;
  display: flex;
  align-items: center;
  padding: 6rem 2rem;
}

.container {
  max-width: 1100px;
  margin: 0 auto;
  position: relative;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: rgba(251, 191, 36, 0.1);
  border: 1px solid var(--gold);
  border-radius: 2rem;
  margin-bottom: 1.5rem;
}

.badge-icon { font-size: 1.25rem; }
.badge-text { font-size: 0.7rem; letter-spacing: 0.1em; color: var(--gold); font-family: 'JetBrains Mono', monospace; }

.hero-title { margin-bottom: 1.5rem; }

.title-pre {
  display: block;
  font-size: 0.9rem;
  color: var(--text-muted);
  letter-spacing: 0.2em;
  text-transform: uppercase;
  margin-bottom: 0.5rem;
}

.title-main {
  display: block;
  font-size: clamp(2.5rem, 8vw, 5rem);
  font-weight: 800;
  background: linear-gradient(135deg, var(--gold) 0%, var(--fire) 50%, var(--mars) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1.1;
}

.title-sub {
  display: block;
  font-size: 1.1rem;
  color: var(--text-muted);
  margin-top: 0.5rem;
}

.hero-quote {
  font-size: 1.1rem;
  font-style: italic;
  color: var(--text-muted);
  max-width: 500px;
  line-height: 1.7;
  margin-bottom: 2rem;
}

.hero-elements {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 2rem;
}

.element {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.75rem;
  min-width: 80px;
  transition: all 0.3s ease;
}

.element:hover {
  transform: translateY(-5px);
  border-color: var(--gold);
}

.element--fire:hover { border-color: var(--fire); box-shadow: 0 10px 30px rgba(249, 115, 22, 0.2); }
.element--water:hover { border-color: var(--water); box-shadow: 0 10px 30px rgba(59, 130, 246, 0.2); }
.element--air:hover { border-color: var(--air); box-shadow: 0 10px 30px rgba(168, 85, 247, 0.2); }
.element--earth:hover { border-color: var(--earth); box-shadow: 0 10px 30px rgba(132, 204, 22, 0.2); }
.element--planet:hover { border-color: var(--planet); box-shadow: 0 10px 30px rgba(16, 185, 129, 0.2); }

.element-icon { font-size: 1.75rem; margin-bottom: 0.5rem; }
.element-name { font-size: 0.75rem; font-weight: 600; color: var(--text); }
.element-power { font-size: 0.6rem; color: var(--text-muted); font-family: 'JetBrains Mono', monospace; }

.cta-btn {
  position: relative;
  display: inline-flex;
  align-items: center;
  padding: 1rem 2rem;
  background: linear-gradient(135deg, var(--gold), var(--fire));
  border: none;
  border-radius: 0.5rem;
  color: #000;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.85rem;
  font-weight: 700;
  cursor: pointer;
  overflow: hidden;
  transition: all 0.3s ease;
}

.cta-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 15px 40px rgba(251, 191, 36, 0.3);
}

.btn-glow {
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
  transform: translateX(-100%);
  animation: shimmer 2s infinite;
}

@keyframes shimmer { to { transform: translateX(100%); } }

/* Samus Silhouette */
.samus-silhouette {
  position: absolute;
  right: 5%;
  top: 50%;
  transform: translateY(-50%);
  width: 200px;
  height: 350px;
  opacity: 0.15;
}

.power-suit {
  width: 100%;
  height: 100%;
  background: linear-gradient(180deg, var(--gold) 0%, var(--fire) 50%, var(--mars) 100%);
  clip-path: polygon(
    40% 0%, 60% 0%, 
    70% 10%, 75% 25%, 
    80% 40%, 78% 55%, 
    85% 70%, 75% 85%, 
    70% 100%, 30% 100%,
    25% 85%, 15% 70%,
    22% 55%, 20% 40%,
    25% 25%, 30% 10%
  );
}

.arm-cannon {
  position: absolute;
  right: -20px;
  top: 40%;
  width: 60px;
  height: 25px;
  background: var(--gold);
  border-radius: 0 20px 20px 0;
}

.visor-glow {
  position: absolute;
  top: 8%;
  left: 35%;
  width: 60px;
  height: 20px;
  background: #00ff41;
  border-radius: 50%;
  box-shadow: 0 0 20px #00ff41, 0 0 40px #00ff41;
  animation: visorPulse 2s ease-in-out infinite;
}

@keyframes visorPulse {
  0%, 100% { opacity: 0.8; }
  50% { opacity: 1; }
}

/* SECTIONS */
.section {
  position: relative;
  z-index: 1;
  padding: 6rem 2rem;
}

.section-header {
  text-align: center;
  margin-bottom: 3rem;
}

.header-icon {
  display: block;
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}

.section-header h2 {
  font-size: clamp(1.5rem, 4vw, 2.5rem);
  font-weight: 700;
  color: var(--text);
  margin-bottom: 0.5rem;
}

.section-sub {
  font-size: 0.9rem;
  color: var(--text-muted);
}

/* COMPOSITION SECTION */
.composition-section {
  background: linear-gradient(180deg, transparent, rgba(251, 191, 36, 0.02), transparent);
}

.composition-story {
  max-width: 900px;
  margin: 0 auto;
}

.story-card {
  background: var(--surface);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 1rem;
  padding: 2rem;
  margin-bottom: 1.5rem;
}

.story-card--main {
  border-color: var(--gold);
  background: linear-gradient(135deg, rgba(251, 191, 36, 0.05), rgba(249, 115, 22, 0.05));
}

.card-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background: rgba(251, 191, 36, 0.2);
  border-radius: 1rem;
  font-size: 0.7rem;
  color: var(--gold);
  margin-bottom: 1rem;
}

.story-card h3 {
  font-size: 1.25rem;
  color: var(--text);
  margin-bottom: 1rem;
}

.story-card p {
  color: var(--text-muted);
  line-height: 1.7;
  margin-bottom: 1rem;
}

.story-card p.highlight {
  color: var(--gold);
  font-weight: 500;
}

.story-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.story-grid .story-card {
  text-align: center;
  margin-bottom: 0;
}

.card-icon {
  display: block;
  font-size: 2rem;
  margin-bottom: 0.75rem;
}

.story-grid h4 {
  font-size: 1rem;
  color: var(--text);
  margin-bottom: 0.5rem;
}

.story-grid p {
  font-size: 0.85rem;
  margin-bottom: 0;
}

/* ELEMENTS DETAILED */
.elements-section {
  background: var(--surface);
}

.elements-detailed {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-width: 800px;
  margin: 0 auto;
}

.element-card {
  display: flex;
  gap: 2rem;
  padding: 2rem;
  background: var(--bg);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 1rem;
  transition: all 0.3s ease;
}

.element-card:hover {
  border-color: var(--accent);
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
}

.element-visual {
  position: relative;
  flex-shrink: 0;
}

.visual-icon {
  font-size: 3rem;
  display: block;
}

.visual-ring {
  position: absolute;
  inset: -10px;
  border: 2px solid var(--accent);
  border-radius: 50%;
  opacity: 0.3;
  animation: ringPulse 2s ease-in-out infinite;
}

@keyframes ringPulse {
  0%, 100% { transform: scale(1); opacity: 0.3; }
  50% { transform: scale(1.1); opacity: 0.1; }
}

.element-info h3 {
  font-size: 1.25rem;
  color: var(--accent);
  margin-bottom: 0.5rem;
}

.element-desc {
  color: var(--text-muted);
  margin-bottom: 0.75rem;
}

.element-metroid {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.metroid-label {
  font-size: 0.75rem;
  color: var(--text-muted);
}

.metroid-power {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.75rem;
  color: var(--accent);
  padding: 0.2rem 0.5rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 0.25rem;
}

.element-meaning {
  font-size: 0.85rem;
  color: var(--text);
  font-style: italic;
}

/* CONNECTION SECTION */
.connection-content {
  max-width: 700px;
  margin: 0 auto;
}

.timeline-vertical {
  position: relative;
  padding-left: 3rem;
}

.timeline-vertical::before {
  content: '';
  position: absolute;
  left: 1rem;
  top: 0;
  bottom: 0;
  width: 2px;
  background: linear-gradient(180deg, var(--gold), var(--planet));
}

.timeline-item {
  position: relative;
  margin-bottom: 2rem;
}

.timeline-marker {
  position: absolute;
  left: -2.5rem;
  top: 0;
  width: 2.5rem;
  height: 2.5rem;
  background: var(--surface);
  border: 2px solid var(--gold);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
}

.timeline-content h4 {
  font-size: 1rem;
  color: var(--gold);
  margin-bottom: 0.25rem;
}

.timeline-content p {
  color: var(--text-muted);
  font-size: 0.9rem;
}

.connection-quote {
  margin-top: 3rem;
  padding: 2rem;
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(251, 191, 36, 0.05));
  border-left: 4px solid var(--planet);
  border-radius: 0 1rem 1rem 0;
}

.connection-quote p {
  font-size: 1.1rem;
  font-style: italic;
  color: var(--text);
  line-height: 1.7;
  margin-bottom: 0.75rem;
}

.connection-quote cite {
  font-size: 0.85rem;
  color: var(--planet);
}

/* SPECS SECTION */
.specs-section {
  background: linear-gradient(180deg, var(--bg), rgba(220, 38, 38, 0.02));
}

.specs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  max-width: 900px;
  margin: 0 auto;
}

.spec-card {
  background: var(--surface);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 1rem;
  overflow: hidden;
}

.spec-card--wide {
  grid-column: 1 / -1;
}

.spec-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  background: rgba(255, 255, 255, 0.03);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.spec-icon { font-size: 1.25rem; }
.spec-header h4 { font-size: 0.9rem; color: var(--text); }

.spec-data {
  padding: 1rem 1.5rem;
}

.data-row {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  font-size: 0.8rem;
}

.data-row:last-child { border-bottom: none; }
.data-row span:first-child { color: var(--text-muted); }
.data-row span:last-child { color: var(--gold); font-family: 'JetBrains Mono', monospace; }

.arsenal-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 0.75rem;
  padding: 1rem 1.5rem;
}

.arsenal-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.75rem;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 0.5rem;
  text-align: center;
}

.arsenal-icon { font-size: 1.5rem; margin-bottom: 0.25rem; }
.arsenal-name { font-size: 0.75rem; color: var(--color); font-weight: 600; }
.arsenal-element { font-size: 0.6rem; color: var(--text-muted); }

/* CTA */
.cta-section {
  padding-bottom: 8rem;
}

.cta-card {
  text-align: center;
  padding: 3rem;
  background: linear-gradient(135deg, rgba(251, 191, 36, 0.1), rgba(16, 185, 129, 0.05));
  border: 1px solid var(--gold);
  border-radius: 1.5rem;
  max-width: 600px;
  margin: 0 auto;
}

.cta-visual {
  margin-bottom: 1rem;
}

.cta-icon {
  font-size: 3rem;
}

.cta-card h2 {
  font-size: 1.75rem;
  color: var(--gold);
  margin-bottom: 0.5rem;
}

.cta-card > p {
  color: var(--text-muted);
  margin-bottom: 2rem;
}

.cta-buttons {
  display: flex;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 1.5rem;
  border-radius: 0.5rem;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.85rem;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
}

.btn--primary {
  background: var(--gold);
  color: #000;
}

.btn--primary:hover {
  background: #fcd34d;
  transform: translateY(-2px);
}

.btn--secondary {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: var(--text);
}

.btn--secondary:hover {
  border-color: var(--gold);
  color: var(--gold);
}

/* MISSION COMPLETE */
.mission-complete {
  position: fixed;
  bottom: 80px;
  right: 1.5rem;
  z-index: 50;
}

.mission-ring {
  width: 60px;
  height: 60px;
  border: 2px solid var(--gold);
  border-radius: 50%;
  animation: missionPulse 3s ease-in-out infinite;
}

@keyframes missionPulse {
  0%, 100% { transform: scale(1); opacity: 0.5; }
  50% { transform: scale(1.1); opacity: 0.2; }
}

.mission-text {
  position: absolute;
  bottom: -20px;
  left: 50%;
  transform: translateX(-50%);
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.5rem;
  color: var(--gold);
  white-space: nowrap;
  opacity: 0.5;
}

/* RESPONSIVE */
@media (max-width: 768px) {
  .hero-elements {
    justify-content: center;
  }
  
  .samus-silhouette {
    display: none;
  }
  
  .element-card {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }
  
  .timeline-vertical {
    padding-left: 2.5rem;
  }
  
  .timeline-marker {
    left: -2rem;
    width: 2rem;
    height: 2rem;
    font-size: 0.8rem;
  }
}

/* A11Y */
.skip-link {
  position: absolute;
  top: -100%;
  left: 50%;
  transform: translateX(-50%);
  padding: 1rem 2rem;
  background: var(--gold);
  color: #000;
  text-decoration: none;
  border-radius: 0.5rem;
  z-index: 1000;
}

.skip-link:focus {
  top: 1rem;
}

@media (prefers-reduced-motion: reduce) {
  .stars, .elements-orbit, .orbit-element, .visor-glow, .btn-glow, .visual-ring, .mission-ring {
    animation: none !important;
  }
}
</style>
