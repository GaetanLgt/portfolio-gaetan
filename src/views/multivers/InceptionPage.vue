<template>
  <div class="inception-page" :class="'level-' + currentLevel">
    <!-- Skip link -->
    <a href="#main-content" class="skip-link">Aller au contenu principal</a>

    <!-- TOTEM INDICATOR - Flottant -->
    <div class="totem-indicator" aria-label="Indicateur de niveau de rêve">
      <div class="totem" :class="{ spinning: totemSpinning }" @click="spinTotem">
        <div class="totem-top"></div>
        <div class="totem-body"></div>
        <div class="totem-shadow"></div>
      </div>
      <span class="level-display">Niveau {{ currentLevel }}</span>
    </div>

    <!-- LEVEL NAVIGATOR -->
    <nav class="level-nav" aria-label="Navigation par niveau de rêve">
      <button 
        v-for="level in levels" 
        :key="level.id"
        class="level-btn"
        :class="{ active: currentLevel === level.id }"
        @click="goToLevel(level.id)"
        :aria-label="`Niveau ${level.id}: ${level.name}`"
        :aria-current="currentLevel === level.id ? 'true' : undefined"
      >
        <span class="level-num">{{ level.id }}</span>
        <span class="level-name">{{ level.name }}</span>
      </button>
    </nav>

    <!-- KICK TIMER -->
    <div class="kick-timer" v-if="kickActive" aria-live="polite">
      <span class="timer-label">KICK IN</span>
      <span class="timer-value">{{ kickTime }}</span>
      <div class="timer-bar">
        <div class="timer-fill" :style="{ width: kickProgress + '%' }"></div>
      </div>
    </div>

    <!-- LEVEL 0 : REALITY - Hero -->
    <section id="level-0" class="dream-level level-reality" aria-labelledby="reality-title">
      <div class="level-bg reality-bg" aria-hidden="true">
        <div class="city-silhouette"></div>
        <div class="reality-grain"></div>
      </div>

      <div class="container" id="main-content">
        <div class="reality-content">
          <div class="briefcase" aria-hidden="true">
            <div class="briefcase-top"></div>
            <div class="briefcase-bottom">
              <div class="pasiv-device">PASIV</div>
            </div>
          </div>

          <h1 id="reality-title" class="reality-title">
            <span class="title-sub">Your mind is the scene of the crime</span>
            <span class="title-main">INCEPTION</span>
            <span class="title-tagline">Architecture des Rêves Numériques</span>
          </h1>

          <p class="reality-intro">
            « Une idée est comme un virus. Résiliente. Hautement contagieuse. 
            Et même la plus petite graine d'une idée peut grandir. »
          </p>

          <div class="dream-team">
            <div class="team-member" v-for="member in team" :key="member.role">
              <span class="member-icon">{{ member.icon }}</span>
              <span class="member-role">{{ member.role }}</span>
            </div>
          </div>

          <button class="enter-dream-btn" @click="goToLevel(1)">
            <span>Entrer dans le rêve</span>
            <span class="btn-arrow" aria-hidden="true">↓</span>
          </button>
        </div>
      </div>
    </section>

    <!-- LEVEL 1 : THE CITY - Van Chase -->
    <section id="level-1" class="dream-level level-city" aria-labelledby="city-title">
      <div class="level-bg city-bg" aria-hidden="true">
        <div class="rain"></div>
        <div class="falling-van"></div>
        <div class="city-buildings">
          <div class="building building--1"></div>
          <div class="building building--2"></div>
          <div class="building building--3"></div>
          <div class="building building--4"></div>
          <div class="building building--5"></div>
        </div>
      </div>

      <div class="container">
        <div class="level-header">
          <span class="level-indicator" aria-hidden="true">NIVEAU 1</span>
          <h2 id="city-title">La Ville</h2>
          <p class="level-desc">Le rêve de Yusuf — La poursuite en van</p>
          <div class="time-dilation">
            <span class="time-real">5 min réelles</span>
            <span class="time-arrow">→</span>
            <span class="time-dream">1 heure de rêve</span>
          </div>
        </div>

        <div class="city-grid">
          <article class="city-card" v-for="(project, index) in cityProjects" :key="project.id">
            <div class="card-rain" aria-hidden="true"></div>
            <div class="card-content">
              <span class="card-type">{{ project.type }}</span>
              <h3>{{ project.name }}</h3>
              <p>{{ project.desc }}</p>
              <div class="card-tech">
                <span v-for="tech in project.tech" :key="tech">{{ tech }}</span>
              </div>
            </div>
            <div class="card-number" aria-hidden="true">{{ String(index + 1).padStart(2, '0') }}</div>
          </article>
        </div>

        <button class="go-deeper-btn" @click="goToLevel(2)">
          <span>Aller plus profond</span>
          <span class="depth-indicator" aria-hidden="true">▼▼</span>
        </button>
      </div>
    </section>

    <!-- LEVEL 2 : THE HOTEL - Zero Gravity -->
    <section id="level-2" class="dream-level level-hotel" aria-labelledby="hotel-title">
      <div class="level-bg hotel-bg" aria-hidden="true">
        <div class="corridor">
          <div class="corridor-floor"></div>
          <div class="corridor-ceiling"></div>
          <div class="corridor-left"></div>
          <div class="corridor-right"></div>
        </div>
        <div class="floating-objects">
          <span class="float-obj float-obj--1">🪑</span>
          <span class="float-obj float-obj--2">💼</span>
          <span class="float-obj float-obj--3">🔑</span>
          <span class="float-obj float-obj--4">📋</span>
        </div>
      </div>

      <div class="container">
        <div class="level-header level-header--rotated">
          <span class="level-indicator" aria-hidden="true">NIVEAU 2</span>
          <h2 id="hotel-title">L'Hôtel</h2>
          <p class="level-desc">Le rêve d'Arthur — Gravité Zéro</p>
          <div class="time-dilation">
            <span class="time-real">1 heure N1</span>
            <span class="time-arrow">→</span>
            <span class="time-dream">1 semaine de rêve</span>
          </div>
        </div>

        <div class="zero-g-content">
          <div class="rotating-room">
            <div class="room-card" v-for="(skill, index) in skills" :key="skill.name"
                 :style="{ '--rotation': (index * 90) + 'deg' }">
              <div class="skill-icon">{{ skill.icon }}</div>
              <h3>{{ skill.name }}</h3>
              <p>{{ skill.desc }}</p>
              <div class="skill-level">
                <div class="level-bar" :style="{ width: skill.level + '%' }"></div>
              </div>
            </div>
          </div>
        </div>

        <div class="hotel-quote">
          <p>« Vous attendez un train. Un train qui vous emmènera loin. 
          Vous savez où vous espérez qu'il vous emmène, 
          mais vous ne pouvez pas en être sûr. »</p>
        </div>

        <button class="go-deeper-btn" @click="goToLevel(3)">
          <span>Descendre encore</span>
          <span class="depth-indicator" aria-hidden="true">▼▼▼</span>
        </button>
      </div>
    </section>

    <!-- LEVEL 3 : THE FORTRESS - Snow -->
    <section id="level-3" class="dream-level level-fortress" aria-labelledby="fortress-title">
      <div class="level-bg fortress-bg" aria-hidden="true">
        <div class="snow-fall"></div>
        <div class="mountain-range"></div>
        <div class="fortress-structure"></div>
      </div>

      <div class="container">
        <div class="level-header">
          <span class="level-indicator" aria-hidden="true">NIVEAU 3</span>
          <h2 id="fortress-title">La Forteresse</h2>
          <p class="level-desc">Le rêve d'Eames — L'assaut final</p>
          <div class="time-dilation">
            <span class="time-real">1 semaine N2</span>
            <span class="time-arrow">→</span>
            <span class="time-dream">10 ans de rêve</span>
          </div>
        </div>

        <div class="fortress-grid">
          <div class="vault-door">
            <div class="vault-ring vault-ring--1"></div>
            <div class="vault-ring vault-ring--2"></div>
            <div class="vault-ring vault-ring--3"></div>
            <div class="vault-center">
              <span class="vault-icon">🔐</span>
              <span class="vault-text">CORE SKILLS</span>
            </div>
          </div>

          <div class="fortress-content">
            <article class="fortress-card" v-for="skill in coreSkills" :key="skill.name">
              <div class="card-icon">{{ skill.icon }}</div>
              <h3>{{ skill.name }}</h3>
              <ul class="skill-list">
                <li v-for="item in skill.items" :key="item">{{ item }}</li>
              </ul>
            </article>
          </div>
        </div>

        <button class="go-deeper-btn go-deeper-btn--danger" @click="goToLevel(4)">
          <span>⚠️ Entrer en Limbes</span>
          <span class="depth-indicator" aria-hidden="true">▼▼▼▼</span>
        </button>
      </div>
    </section>

    <!-- LEVEL 4 : LIMBO - Unconstructed Dream Space -->
    <section id="level-4" class="dream-level level-limbo" aria-labelledby="limbo-title">
      <div class="level-bg limbo-bg" aria-hidden="true">
        <div class="crumbling-city">
          <div class="limbo-building limbo-building--1"></div>
          <div class="limbo-building limbo-building--2"></div>
          <div class="limbo-building limbo-building--3"></div>
          <div class="limbo-building limbo-building--4"></div>
          <div class="limbo-building limbo-building--5"></div>
        </div>
        <div class="ocean-waves"></div>
        <div class="time-distortion"></div>
      </div>

      <div class="container">
        <div class="level-header level-header--limbo">
          <span class="level-indicator" aria-hidden="true">LIMBES</span>
          <h2 id="limbo-title">L'Espace Brut du Rêve</h2>
          <p class="level-desc">Espace de rêve non-construit — L'infini intérieur</p>
          <div class="time-dilation time-dilation--infinite">
            <span class="time-dream">∞ Éternité subjective</span>
          </div>
        </div>

        <div class="limbo-content">
          <div class="old-cobb">
            <blockquote class="limbo-quote">
              <p>« Nous avons construit une vie ensemble. 
              Nous avons vieilli ensemble. 
              Je me souviens de nous, vieux, 
              se tenant la main sur cette plage. »</p>
            </blockquote>
          </div>

          <div class="limbo-message">
            <h3>La Vision</h3>
            <p>
              Construire des mondes entiers à partir de rien. 
              C'est ce que fait un développeur — transformer des idées abstraites 
              en réalités tangibles, créer des architectures qui n'existaient pas, 
              donner vie à l'impossible.
            </p>
            <p class="limbo-warning">
              Mais attention : ne pas confondre le rêve avec la réalité.
              Le code est un outil, pas une fin en soi.
            </p>
          </div>

          <div class="inception-moment">
            <div class="idea-seed">
              <span class="seed-icon">💡</span>
              <p class="seed-text">L'IDÉE</p>
            </div>
            <p class="inception-text">
              « Une idée plantée dans l'esprit peut définir ou détruire quelqu'un. »
            </p>
          </div>
        </div>

        <button class="kick-btn" @click="triggerKick">
          <span>🎵 KICK — Remonter</span>
        </button>
      </div>
    </section>

    <!-- FINAL : REALITY CHECK -->
    <section id="reality-check" class="dream-level level-wake" aria-labelledby="wake-title">
      <div class="level-bg wake-bg" aria-hidden="true">
        <div class="sunlight"></div>
      </div>

      <div class="container">
        <div class="wake-content">
          <div class="final-totem">
            <div class="totem-large" :class="{ wobble: totemWobble }">
              <div class="totem-top"></div>
              <div class="totem-body"></div>
            </div>
            <p class="totem-question">La toupie tombe-t-elle ?</p>
          </div>

          <h2 id="wake-title">Retour à la Réalité</h2>
          
          <p class="wake-text">
            Peu importe si c'est un rêve ou la réalité — 
            ce qui compte, c'est ce que vous construisez.
          </p>

          <div class="final-cta">
            <router-link to="/contact" class="reality-btn">
              <span>Construisons ensemble</span>
            </router-link>
          </div>

          <div class="credits">
            <p>« Ne rêvez pas votre vie. Vivez vos rêves. »</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const currentLevel = ref(0);
const totemSpinning = ref(false);
const totemWobble = ref(false);
const kickActive = ref(false);
const kickTime = ref('00:00');
const kickProgress = ref(100);

const levels = [
  { id: 0, name: 'Réalité' },
  { id: 1, name: 'Ville' },
  { id: 2, name: 'Hôtel' },
  { id: 3, name: 'Forteresse' },
  { id: 4, name: 'Limbes' }
];

const team = [
  { role: 'Extracteur', icon: '🎯' },
  { role: 'Architecte', icon: '📐' },
  { role: 'Faussaire', icon: '🎭' },
  { role: 'Point Man', icon: '🔫' },
  { role: 'Chimiste', icon: '💉' },
  { role: 'Touriste', icon: '💼' }
];

const cityProjects = [
  { id: 1, name: 'ARKADIA France', type: 'Community', desc: 'Cluster ARK: 9 serveurs, 150+ joueurs, écosystème gaming complet', tech: ['Nitrado', 'Discord', 'n8n'] },
  { id: 2, name: 'GL Digital Lab', type: 'Business', desc: 'Studio de développement IA & automatisation pour PME', tech: ['Symfony', 'Vue.js', 'Docker'] },
  { id: 3, name: 'Portfolio Matrix', type: 'Showcase', desc: 'Ce site immersif multi-univers que vous explorez', tech: ['Vue 3', 'Three.js', 'Vite'] },
  { id: 4, name: 'Neural Workflows', type: 'Automation', desc: 'Pipelines IA locaux avec n8n et Ollama', tech: ['n8n', 'Ollama', 'ChromaDB'] }
];

const skills = [
  { name: 'Backend', icon: '⚙️', desc: 'Symfony, PHP 8.3+, API Platform', level: 95 },
  { name: 'Frontend', icon: '🎨', desc: 'Vue 3, Three.js, TypeScript', level: 88 },
  { name: 'DevOps', icon: '🐳', desc: 'Docker, CI/CD, Monitoring', level: 82 },
  { name: 'IA', icon: '🧠', desc: 'Ollama, RAG, Agents', level: 78 }
];

const coreSkills = [
  { name: 'Architecture', icon: '🏛️', items: ['Clean Architecture', 'Domain-Driven Design', 'SOLID Principles', 'Event Sourcing'] },
  { name: 'Sécurité', icon: '🔒', items: ['OWASP Top 10', 'Auth JWT/OAuth', 'Data Encryption', 'RGPD Compliance'] },
  { name: 'Performance', icon: '⚡', items: ['Cache Strategies', 'Query Optimization', 'Lazy Loading', 'CDN Integration'] },
  { name: 'Souveraineté', icon: '🏴', items: ['Self-Hosted Stack', 'Zero Cloud US', 'Data Ownership', 'Local AI'] }
];

const goToLevel = (level) => {
  currentLevel.value = level;
  const element = document.getElementById(`level-${level}`);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
};

const spinTotem = () => {
  totemSpinning.value = true;
  setTimeout(() => {
    totemSpinning.value = false;
  }, 3000);
};

const triggerKick = () => {
  kickActive.value = true;
  kickProgress.value = 100;
  let timeLeft = 5;
  
  const kickInterval = setInterval(() => {
    timeLeft--;
    kickTime.value = `00:0${timeLeft}`;
    kickProgress.value = (timeLeft / 5) * 100;
    
    if (timeLeft <= 0) {
      clearInterval(kickInterval);
      kickActive.value = false;
      
      // Remontée dramatique
      [4, 3, 2, 1, 0].forEach((level, index) => {
        setTimeout(() => {
          currentLevel.value = level;
          if (level === 0) {
            totemWobble.value = true;
            setTimeout(() => {
              document.getElementById('reality-check')?.scrollIntoView({ behavior: 'smooth' });
            }, 500);
          }
        }, index * 800);
      });
    }
  }, 1000);
};

// Intersection Observer for current level
let observer = null;

onMounted(() => {
  observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const levelMatch = entry.target.id.match(/level-(\d+)/);
        if (levelMatch) {
          currentLevel.value = parseInt(levelMatch[1]);
        }
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.dream-level[id^="level-"]').forEach(section => {
    observer.observe(section);
  });
});

onUnmounted(() => {
  if (observer) observer.disconnect();
});
</script>

<style scoped>
/* =============================================================================
   INCEPTION PAGE - Variables
   ============================================================================= */
.inception-page {
  --bg-reality: #1a1a2e;
  --bg-city: #16213e;
  --bg-hotel: #1f1f3d;
  --bg-fortress: #0f1729;
  --bg-limbo: #0a0a12;
  
  --gold: #d4af37;
  --gold-dark: #b8960c;
  --blue-dream: #4a90d9;
  --red-danger: #dc3545;
  --snow-white: #f8f9fa;
  --text-main: #e8e6e3;
  --text-muted: rgba(232, 230, 227, 0.6);
  
  background: var(--bg-reality);
  color: var(--text-main);
  min-height: 100vh;
  font-family: 'Inter', -apple-system, sans-serif;
  overflow-x: hidden;
}

/* Level-based background transitions */
.inception-page.level-0 { background: var(--bg-reality); }
.inception-page.level-1 { background: var(--bg-city); }
.inception-page.level-2 { background: var(--bg-hotel); }
.inception-page.level-3 { background: var(--bg-fortress); }
.inception-page.level-4 { background: var(--bg-limbo); }

/* =============================================================================
   TOTEM INDICATOR
   ============================================================================= */
.totem-indicator {
  position: fixed;
  top: 100px;
  right: 2rem;
  z-index: 100;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.totem {
  position: relative;
  width: 30px;
  height: 50px;
  transition: transform 0.3s ease;
}

.totem.spinning {
  animation: spin-totem 3s ease-in-out;
}

@keyframes spin-totem {
  0% { transform: rotateY(0deg); }
  100% { transform: rotateY(1440deg); }
}

.totem-top {
  width: 20px;
  height: 20px;
  background: linear-gradient(135deg, var(--gold), var(--gold-dark));
  border-radius: 50%;
  margin: 0 auto;
  box-shadow: 0 2px 10px rgba(212, 175, 55, 0.5);
}

.totem-body {
  width: 8px;
  height: 30px;
  background: linear-gradient(180deg, var(--gold), var(--gold-dark));
  margin: 0 auto;
  border-radius: 0 0 4px 4px;
}

.totem-shadow {
  position: absolute;
  bottom: -5px;
  left: 50%;
  transform: translateX(-50%);
  width: 20px;
  height: 6px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 50%;
  filter: blur(2px);
}

.level-display {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.7rem;
  color: var(--gold);
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

/* =============================================================================
   LEVEL NAVIGATOR
   ============================================================================= */
.level-nav {
  position: fixed;
  left: 2rem;
  top: 50%;
  transform: translateY(-50%);
  z-index: 100;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.level-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  background: rgba(26, 26, 46, 0.8);
  border: 1px solid rgba(212, 175, 55, 0.2);
  border-radius: 0.5rem;
  color: var(--text-muted);
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.level-btn:hover {
  border-color: var(--gold);
  color: var(--text-main);
}

.level-btn.active {
  background: rgba(212, 175, 55, 0.2);
  border-color: var(--gold);
  color: var(--gold);
}

.level-num {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.8rem;
  font-weight: bold;
}

.level-name {
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* =============================================================================
   KICK TIMER
   ============================================================================= */
.kick-timer {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 200;
  background: rgba(220, 53, 69, 0.95);
  padding: 2rem 3rem;
  border-radius: 1rem;
  text-align: center;
  animation: pulse-danger 0.5s ease-in-out infinite;
}

@keyframes pulse-danger {
  0%, 100% { box-shadow: 0 0 30px rgba(220, 53, 69, 0.5); }
  50% { box-shadow: 0 0 60px rgba(220, 53, 69, 0.8); }
}

.timer-label {
  display: block;
  font-size: 0.8rem;
  letter-spacing: 0.2em;
  margin-bottom: 0.5rem;
}

.timer-value {
  display: block;
  font-family: 'JetBrains Mono', monospace;
  font-size: 3rem;
  font-weight: bold;
}

.timer-bar {
  width: 200px;
  height: 4px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 2px;
  margin-top: 1rem;
}

.timer-fill {
  height: 100%;
  background: white;
  border-radius: 2px;
  transition: width 1s linear;
}

/* =============================================================================
   DREAM LEVELS - Common
   ============================================================================= */
.dream-level {
  min-height: 100vh;
  position: relative;
  padding: 6rem 0;
  overflow: hidden;
}

.level-bg {
  position: absolute;
  inset: 0;
  z-index: 0;
}

.container {
  position: relative;
  z-index: 2;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.level-header {
  text-align: center;
  margin-bottom: 4rem;
}

.level-indicator {
  display: inline-block;
  padding: 0.25rem 1rem;
  background: rgba(212, 175, 55, 0.2);
  border: 1px solid var(--gold);
  border-radius: 2rem;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.7rem;
  color: var(--gold);
  letter-spacing: 0.2em;
  margin-bottom: 1rem;
}

.level-header h2 {
  font-size: clamp(2.5rem, 6vw, 4rem);
  font-weight: 300;
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.level-desc {
  font-size: 1.1rem;
  color: var(--text-muted);
  margin-bottom: 1rem;
}

.time-dilation {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.85rem;
}

.time-real {
  color: var(--text-muted);
}

.time-arrow {
  color: var(--gold);
}

.time-dream {
  color: var(--blue-dream);
}

/* =============================================================================
   LEVEL 0 : REALITY
   ============================================================================= */
.level-reality {
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 120px;
}

.reality-bg {
  background: 
    linear-gradient(180deg, rgba(26, 26, 46, 0) 0%, rgba(26, 26, 46, 0.8) 100%),
    radial-gradient(ellipse at 50% 0%, rgba(74, 144, 217, 0.1) 0%, transparent 50%);
}

.city-silhouette {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 30%;
  background: 
    linear-gradient(90deg, 
      transparent 0%, 
      #0a0a12 10%, 
      #0a0a12 15%,
      transparent 15%,
      transparent 25%,
      #0a0a12 25%,
      #0a0a12 35%,
      transparent 35%,
      transparent 50%,
      #0a0a12 50%,
      #0a0a12 60%,
      transparent 60%,
      transparent 75%,
      #0a0a12 75%,
      #0a0a12 85%,
      transparent 85%
    );
  opacity: 0.3;
}

.reality-grain {
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
  opacity: 0.03;
}

.reality-content {
  text-align: center;
  max-width: 800px;
  margin: 0 auto;
}

/* Briefcase PASIV */
.briefcase {
  width: 120px;
  height: 80px;
  margin: 0 auto 2rem;
  position: relative;
}

.briefcase-top {
  width: 100%;
  height: 10px;
  background: linear-gradient(90deg, #4a4a4a, #6a6a6a, #4a4a4a);
  border-radius: 4px 4px 0 0;
}

.briefcase-bottom {
  width: 100%;
  height: 70px;
  background: linear-gradient(180deg, #3a3a3a, #2a2a2a);
  border-radius: 0 0 8px 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #4a4a4a;
}

.pasiv-device {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.8rem;
  color: var(--gold);
  letter-spacing: 0.2em;
  padding: 0.25rem 0.75rem;
  background: rgba(212, 175, 55, 0.1);
  border: 1px solid var(--gold);
  border-radius: 0.25rem;
}

.reality-title {
  margin-bottom: 2rem;
}

.title-sub {
  display: block;
  font-size: 1rem;
  font-style: italic;
  color: var(--text-muted);
  margin-bottom: 0.5rem;
}

.title-main {
  display: block;
  font-size: clamp(4rem, 12vw, 8rem);
  font-weight: 200;
  letter-spacing: 0.3em;
  color: var(--gold);
  text-shadow: 0 0 60px rgba(212, 175, 55, 0.3);
}

.title-tagline {
  display: block;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.9rem;
  color: var(--blue-dream);
  letter-spacing: 0.15em;
  margin-top: 0.5rem;
}

.reality-intro {
  font-size: 1.1rem;
  font-style: italic;
  color: var(--text-muted);
  line-height: 1.8;
  max-width: 600px;
  margin: 0 auto 3rem;
}

/* Dream Team */
.dream-team {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 3rem;
}

.team-member {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  padding: 0.75rem 1rem;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.5rem;
  transition: all 0.3s ease;
}

.team-member:hover {
  border-color: var(--gold);
  transform: translateY(-3px);
}

.member-icon {
  font-size: 1.5rem;
}

.member-role {
  font-size: 0.7rem;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* Enter Dream Button */
.enter-dream-btn, .go-deeper-btn, .kick-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 2rem;
  background: transparent;
  border: 2px solid var(--gold);
  color: var(--gold);
  font-size: 1rem;
  font-weight: 500;
  letter-spacing: 0.1em;
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 0;
}

.enter-dream-btn:hover, .go-deeper-btn:hover, .kick-btn:hover {
  background: var(--gold);
  color: var(--bg-reality);
}

.btn-arrow {
  animation: bounce-down 1s ease-in-out infinite;
}

@keyframes bounce-down {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(5px); }
}

.go-deeper-btn {
  margin-top: 3rem;
}

.go-deeper-btn--danger {
  border-color: var(--red-danger);
  color: var(--red-danger);
}

.go-deeper-btn--danger:hover {
  background: var(--red-danger);
  color: white;
}

.depth-indicator {
  opacity: 0.5;
}

/* =============================================================================
   LEVEL 1 : CITY
   ============================================================================= */
.level-city {
  background: var(--bg-city);
}

.city-bg {
  background: linear-gradient(180deg, #16213e 0%, #0f1629 100%);
}

/* Rain effect */
.rain {
  position: absolute;
  inset: 0;
  background-image: 
    linear-gradient(180deg, transparent 0%, rgba(255, 255, 255, 0.1) 50%, transparent 50%);
  background-size: 1px 20px;
  animation: rain-fall 0.5s linear infinite;
  opacity: 0.3;
}

@keyframes rain-fall {
  0% { background-position: 0 0; }
  100% { background-position: 0 20px; }
}

.city-buildings {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 40%;
  display: flex;
  align-items: flex-end;
  justify-content: space-around;
}

.building {
  background: #0a0a12;
  opacity: 0.5;
}

.building--1 { width: 8%; height: 60%; }
.building--2 { width: 12%; height: 80%; }
.building--3 { width: 6%; height: 50%; }
.building--4 { width: 15%; height: 90%; }
.building--5 { width: 10%; height: 70%; }

/* City Grid */
.city-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
}

.city-card {
  position: relative;
  background: rgba(22, 33, 62, 0.8);
  border: 1px solid rgba(74, 144, 217, 0.2);
  border-radius: 0.5rem;
  padding: 2rem;
  overflow: hidden;
  transition: all 0.3s ease;
}

.city-card:hover {
  border-color: var(--blue-dream);
  transform: translateY(-5px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.card-rain {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 100%;
  background-image: 
    linear-gradient(180deg, rgba(74, 144, 217, 0.1) 0%, transparent 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.city-card:hover .card-rain {
  opacity: 1;
}

.card-type {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background: rgba(74, 144, 217, 0.2);
  border-radius: 1rem;
  font-size: 0.7rem;
  color: var(--blue-dream);
  margin-bottom: 0.75rem;
}

.card-content h3 {
  font-size: 1.5rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.card-content p {
  font-size: 0.9rem;
  color: var(--text-muted);
  line-height: 1.6;
  margin-bottom: 1rem;
}

.card-tech {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.card-tech span {
  padding: 0.25rem 0.5rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 0.25rem;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.7rem;
  color: var(--text-muted);
}

.card-number {
  position: absolute;
  top: 1rem;
  right: 1rem;
  font-family: 'JetBrains Mono', monospace;
  font-size: 2rem;
  font-weight: bold;
  color: rgba(74, 144, 217, 0.1);
}

/* =============================================================================
   LEVEL 2 : HOTEL - Zero Gravity
   ============================================================================= */
.level-hotel {
  background: var(--bg-hotel);
}

.hotel-bg {
  perspective: 1000px;
}

.corridor {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) rotateX(10deg);
  width: 80%;
  height: 60%;
}

.corridor-floor,
.corridor-ceiling {
  position: absolute;
  left: 0;
  right: 0;
  height: 30%;
  background: repeating-linear-gradient(
    90deg,
    #2a2a4a 0px,
    #2a2a4a 50px,
    #1a1a3a 50px,
    #1a1a3a 100px
  );
}

.corridor-floor {
  bottom: 0;
  transform: perspective(500px) rotateX(60deg);
}

.corridor-ceiling {
  top: 0;
  transform: perspective(500px) rotateX(-60deg);
}

.floating-objects {
  position: absolute;
  inset: 0;
}

.float-obj {
  position: absolute;
  font-size: 2rem;
  animation: float-rotate 10s ease-in-out infinite;
}

.float-obj--1 { top: 20%; left: 20%; animation-delay: 0s; }
.float-obj--2 { top: 40%; right: 25%; animation-delay: 2s; }
.float-obj--3 { bottom: 30%; left: 30%; animation-delay: 4s; }
.float-obj--4 { bottom: 20%; right: 20%; animation-delay: 6s; }

@keyframes float-rotate {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  25% { transform: translateY(-20px) rotate(90deg); }
  50% { transform: translateY(0) rotate(180deg); }
  75% { transform: translateY(20px) rotate(270deg); }
}

.level-header--rotated {
  animation: slight-rotate 8s ease-in-out infinite;
}

@keyframes slight-rotate {
  0%, 100% { transform: rotate(0deg); }
  25% { transform: rotate(1deg); }
  75% { transform: rotate(-1deg); }
}

/* Zero-G Content */
.zero-g-content {
  display: flex;
  justify-content: center;
  margin-bottom: 3rem;
}

.rotating-room {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
  max-width: 800px;
}

.room-card {
  background: rgba(31, 31, 61, 0.9);
  border: 1px solid rgba(212, 175, 55, 0.2);
  border-radius: 0.5rem;
  padding: 2rem;
  text-align: center;
  transition: all 0.5s ease;
}

.room-card:hover {
  transform: rotate(5deg) scale(1.05);
  border-color: var(--gold);
}

.skill-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.room-card h3 {
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
  color: var(--gold);
}

.room-card p {
  font-size: 0.85rem;
  color: var(--text-muted);
  margin-bottom: 1rem;
}

.skill-level {
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  overflow: hidden;
}

.level-bar {
  height: 100%;
  background: linear-gradient(90deg, var(--gold), var(--blue-dream));
  border-radius: 2px;
  transition: width 1s ease;
}

.hotel-quote {
  max-width: 600px;
  margin: 0 auto;
  text-align: center;
}

.hotel-quote p {
  font-style: italic;
  font-size: 1.1rem;
  color: var(--text-muted);
  line-height: 1.8;
}

/* =============================================================================
   LEVEL 3 : FORTRESS
   ============================================================================= */
.level-fortress {
  background: var(--bg-fortress);
}

.fortress-bg {
  background: linear-gradient(180deg, #0f1729 0%, #0a0a12 100%);
}

/* Snow effect */
.snow-fall {
  position: absolute;
  inset: 0;
  background-image: 
    radial-gradient(2px 2px at 20px 30px, white, transparent),
    radial-gradient(2px 2px at 40px 70px, rgba(255,255,255,0.8), transparent),
    radial-gradient(1px 1px at 90px 40px, white, transparent),
    radial-gradient(2px 2px at 130px 80px, rgba(255,255,255,0.6), transparent);
  background-size: 200px 200px;
  animation: snow-drift 10s linear infinite;
  opacity: 0.5;
}

@keyframes snow-drift {
  0% { transform: translateY(-200px); }
  100% { transform: translateY(0); }
}

.mountain-range {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 40%;
  background: 
    linear-gradient(135deg, transparent 40%, #1a2744 40%, #1a2744 42%, transparent 42%),
    linear-gradient(225deg, transparent 40%, #152238 40%, #152238 42%, transparent 42%),
    linear-gradient(160deg, transparent 50%, #0f1729 50%);
  background-size: 100px 100%, 100px 100%, 100% 100%;
}

/* Fortress Grid */
.fortress-grid {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 3rem;
  align-items: start;
}

/* Vault Door */
.vault-door {
  position: relative;
  width: 250px;
  height: 250px;
  margin: 0 auto;
}

.vault-ring {
  position: absolute;
  border: 2px solid var(--gold);
  border-radius: 50%;
  animation: vault-spin 20s linear infinite;
}

.vault-ring--1 {
  inset: 0;
  border-style: dashed;
}

.vault-ring--2 {
  inset: 20px;
  animation-direction: reverse;
  animation-duration: 15s;
}

.vault-ring--3 {
  inset: 40px;
  animation-duration: 25s;
}

@keyframes vault-spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.vault-center {
  position: absolute;
  inset: 60px;
  background: rgba(212, 175, 55, 0.1);
  border: 2px solid var(--gold);
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.vault-icon {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.vault-text {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.6rem;
  color: var(--gold);
  letter-spacing: 0.1em;
}

/* Fortress Content */
.fortress-content {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
}

.fortress-card {
  background: rgba(15, 23, 41, 0.9);
  border: 1px solid rgba(248, 249, 250, 0.1);
  border-radius: 0.5rem;
  padding: 1.5rem;
  transition: all 0.3s ease;
}

.fortress-card:hover {
  border-color: var(--snow-white);
  transform: translateY(-3px);
}

.fortress-card .card-icon {
  font-size: 2rem;
  margin-bottom: 0.75rem;
}

.fortress-card h3 {
  font-size: 1.1rem;
  margin-bottom: 0.75rem;
  color: var(--snow-white);
}

.skill-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.skill-list li {
  padding: 0.25rem 0;
  font-size: 0.85rem;
  color: var(--text-muted);
  position: relative;
  padding-left: 1rem;
}

.skill-list li::before {
  content: '▸';
  position: absolute;
  left: 0;
  color: var(--gold);
}

/* =============================================================================
   LEVEL 4 : LIMBO
   ============================================================================= */
.level-limbo {
  background: var(--bg-limbo);
  min-height: 120vh;
}

.limbo-bg {
  background: linear-gradient(180deg, #0a0a12 0%, #050508 100%);
}

.crumbling-city {
  position: absolute;
  bottom: 20%;
  left: 0;
  right: 0;
  height: 50%;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  gap: 2rem;
}

.limbo-building {
  background: linear-gradient(180deg, #1a1a2e 0%, #0a0a12 100%);
  opacity: 0.3;
  animation: crumble 15s ease-in-out infinite;
}

.limbo-building--1 { width: 60px; height: 200px; animation-delay: 0s; }
.limbo-building--2 { width: 80px; height: 300px; animation-delay: 2s; }
.limbo-building--3 { width: 100px; height: 400px; animation-delay: 4s; }
.limbo-building--4 { width: 70px; height: 250px; animation-delay: 6s; }
.limbo-building--5 { width: 50px; height: 180px; animation-delay: 8s; }

@keyframes crumble {
  0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.3; }
  50% { transform: translateY(10px) rotate(1deg); opacity: 0.2; }
}

.ocean-waves {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 20%;
  background: linear-gradient(180deg, transparent 0%, rgba(74, 144, 217, 0.1) 100%);
}

.time-distortion {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at center, transparent 0%, rgba(10, 10, 18, 0.5) 100%);
}

.level-header--limbo .level-indicator {
  background: rgba(220, 53, 69, 0.2);
  border-color: var(--red-danger);
  color: var(--red-danger);
}

.time-dilation--infinite .time-dream {
  color: var(--red-danger);
  font-size: 1.25rem;
}

/* Limbo Content */
.limbo-content {
  max-width: 800px;
  margin: 0 auto;
}

.limbo-quote {
  text-align: center;
  margin-bottom: 3rem;
}

.limbo-quote p {
  font-size: 1.25rem;
  font-style: italic;
  color: var(--text-muted);
  line-height: 1.8;
}

.limbo-message {
  background: rgba(10, 10, 18, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.5rem;
  padding: 2rem;
  margin-bottom: 3rem;
}

.limbo-message h3 {
  font-size: 1.5rem;
  color: var(--gold);
  margin-bottom: 1rem;
}

.limbo-message p {
  font-size: 1rem;
  color: var(--text-muted);
  line-height: 1.8;
  margin-bottom: 1rem;
}

.limbo-warning {
  color: var(--red-danger) !important;
  font-style: italic;
}

/* Inception Moment */
.inception-moment {
  text-align: center;
  margin-bottom: 3rem;
}

.idea-seed {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  background: rgba(212, 175, 55, 0.1);
  border: 2px solid var(--gold);
  border-radius: 50%;
  margin-bottom: 1rem;
  animation: pulse-gold 2s ease-in-out infinite;
}

@keyframes pulse-gold {
  0%, 100% { box-shadow: 0 0 20px rgba(212, 175, 55, 0.3); }
  50% { box-shadow: 0 0 40px rgba(212, 175, 55, 0.6); }
}

.seed-icon {
  font-size: 3rem;
}

.seed-text {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.8rem;
  color: var(--gold);
  letter-spacing: 0.2em;
  margin-top: 0.5rem;
}

.inception-text {
  font-style: italic;
  color: var(--text-muted);
}

.kick-btn {
  border-color: var(--red-danger);
  color: var(--red-danger);
  animation: pulse-danger-btn 1s ease-in-out infinite;
}

@keyframes pulse-danger-btn {
  0%, 100% { box-shadow: 0 0 10px rgba(220, 53, 69, 0.3); }
  50% { box-shadow: 0 0 20px rgba(220, 53, 69, 0.6); }
}

.kick-btn:hover {
  background: var(--red-danger);
  color: white;
}

/* =============================================================================
   REALITY CHECK / WAKE
   ============================================================================= */
.level-wake {
  background: linear-gradient(180deg, var(--bg-limbo) 0%, #1a1a2e 50%, #2a2a4e 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
}

.wake-bg {
  background: radial-gradient(ellipse at 50% 0%, rgba(255, 223, 128, 0.1) 0%, transparent 50%);
}

.sunlight {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 200%;
  height: 50%;
  background: radial-gradient(ellipse at 50% 0%, rgba(255, 223, 128, 0.2) 0%, transparent 70%);
}

.wake-content {
  text-align: center;
  max-width: 600px;
}

.final-totem {
  margin-bottom: 2rem;
}

.totem-large {
  width: 60px;
  height: 100px;
  margin: 0 auto 1rem;
}

.totem-large.wobble {
  animation: wobble-fall 3s ease-in-out forwards;
}

@keyframes wobble-fall {
  0% { transform: rotate(0deg); }
  20% { transform: rotate(5deg); }
  40% { transform: rotate(-5deg); }
  60% { transform: rotate(3deg); }
  80% { transform: rotate(-2deg); }
  100% { transform: rotate(0deg); }
}

.totem-large .totem-top {
  width: 40px;
  height: 40px;
}

.totem-large .totem-body {
  width: 16px;
  height: 60px;
}

.totem-question {
  font-style: italic;
  color: var(--text-muted);
  font-size: 1.1rem;
}

.wake-content h2 {
  font-size: 2.5rem;
  font-weight: 300;
  margin-bottom: 1rem;
  color: var(--gold);
}

.wake-text {
  font-size: 1.1rem;
  color: var(--text-muted);
  line-height: 1.8;
  margin-bottom: 2rem;
}

.reality-btn {
  display: inline-block;
  padding: 1rem 2.5rem;
  background: var(--gold);
  color: var(--bg-reality);
  font-size: 1rem;
  font-weight: 600;
  text-decoration: none;
  letter-spacing: 0.1em;
  transition: all 0.3s ease;
}

.reality-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 10px 30px rgba(212, 175, 55, 0.3);
}

.credits {
  margin-top: 3rem;
}

.credits p {
  font-style: italic;
  font-size: 0.9rem;
  color: var(--text-muted);
}

/* =============================================================================
   RESPONSIVE
   ============================================================================= */
@media (max-width: 1024px) {
  .level-nav {
    display: none;
  }
  
  .city-grid {
    grid-template-columns: 1fr;
  }
  
  .fortress-grid {
    grid-template-columns: 1fr;
  }
  
  .vault-door {
    margin-bottom: 2rem;
  }
  
  .fortress-content {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .totem-indicator {
    top: auto;
    bottom: 1rem;
    right: 1rem;
  }
  
  .rotating-room {
    grid-template-columns: 1fr;
  }
  
  .dream-team {
    gap: 0.5rem;
  }
  
  .team-member {
    padding: 0.5rem;
  }
}

/* =============================================================================
   ACCESSIBILITY
   ============================================================================= */
@media (prefers-reduced-motion: reduce) {
  .totem.spinning,
  .rain,
  .snow-fall,
  .float-obj,
  .vault-ring,
  .limbo-building,
  .idea-seed,
  .kick-btn,
  .btn-arrow {
    animation: none !important;
  }
  
  .level-header--rotated {
    animation: none;
  }
}
</style>
