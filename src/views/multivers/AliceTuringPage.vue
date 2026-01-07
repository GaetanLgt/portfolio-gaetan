<template>
  <div class="alice-turing-page">
    <!-- Skip link -->
    <a href="#main-content" class="skip-link">Aller au contenu principal</a>

    <!-- TURING TAPE - Navigation horizontale -->
    <nav class="turing-tape" aria-label="Navigation bande de Turing">
      <div class="tape-track">
        <div class="tape-head" aria-hidden="true">🐰</div>
        <button 
          v-for="(cell, index) in tapeCells" 
          :key="cell.id"
          class="tape-cell"
          :class="{ active: activeSection === cell.id }"
          @click="scrollToSection(cell.id)"
          :aria-label="`Aller à ${cell.label}`"
          :aria-current="activeSection === cell.id ? 'true' : undefined"
        >
          <span class="cell-symbol">{{ cell.symbol }}</span>
          <span class="cell-label">{{ cell.label }}</span>
        </button>
      </div>
    </nav>

    <!-- HERO : Tea Party Terminal -->
    <section class="hero-section" aria-labelledby="hero-title">
      <div class="hero-bg" aria-hidden="true">
        <div class="falling-objects">
          <span class="falling-item falling-item--clock">🕐</span>
          <span class="falling-item falling-item--card">🂡</span>
          <span class="falling-item falling-item--key">🗝️</span>
          <span class="falling-item falling-item--cup">🍵</span>
          <span class="falling-item falling-item--symbol">∧</span>
          <span class="falling-item falling-item--symbol2">∨</span>
          <span class="falling-item falling-item--card2">🂾</span>
          <span class="falling-item falling-item--rabbit">🐇</span>
        </div>
        <div class="checkered-floor"></div>
        <div class="perspective-grid"></div>
      </div>

      <div class="container">
        <div class="tea-party-scene">
          <!-- Table de thé isométrique -->
          <div class="tea-table" aria-hidden="true">
            <div class="table-surface">
              <div class="teacup teacup--1">🍵</div>
              <div class="teacup teacup--2">☕</div>
              <div class="teapot">🫖</div>
              <div class="cards-stack">
                <span>🂡</span>
                <span>🂢</span>
                <span>🂣</span>
              </div>
            </div>
          </div>

          <!-- Terminal/Miroir central -->
          <div class="mirror-terminal">
            <div class="terminal-frame">
              <div class="frame-ornament frame-ornament--tl" aria-hidden="true">♠</div>
              <div class="frame-ornament frame-ornament--tr" aria-hidden="true">♥</div>
              <div class="frame-ornament frame-ornament--bl" aria-hidden="true">♣</div>
              <div class="frame-ornament frame-ornament--br" aria-hidden="true">♦</div>
              
              <div class="terminal-screen">
                <div class="screen-scanlines" aria-hidden="true"></div>
                <div class="screen-content">
                  <p class="terminal-prompt">
                    <span class="prompt-symbol">></span>
                    <span class="typing-text">{{ typingText }}</span>
                    <span class="cursor" aria-hidden="true">█</span>
                  </p>
                </div>
              </div>
            </div>

            <h1 id="hero-title" class="hero-title">
              <span class="title-line title-line--alice">Au fond du</span>
              <span class="title-line title-line--rabbit">Terrier du Lapin</span>
              <span class="title-line title-line--turing">de la Computation</span>
            </h1>

            <p class="hero-tagline">
              « Croyez-vous parler à un humain ? »
            </p>

            <div class="hero-cta">
              <button class="drink-me-btn" @click="scrollToSection('rabbit-hole')">
                <span class="btn-label">BUVEZ-MOI</span>
                <span class="btn-icon" aria-hidden="true">🧪</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Citation flottante -->
        <div class="floating-quote" aria-hidden="true">
          <p>« Six choses impossibles avant le petit-déjeuner »</p>
        </div>
      </div>

      <!-- Cheshire Chat Assistant -->
      <div class="cheshire-assistant" role="complementary" aria-label="Assistant Cheshire">
        <div class="cheshire-face" :class="{ 'smile-only': cheshireMode === 'smile' }">
          <div class="cheshire-eyes" v-if="cheshireMode !== 'smile'">
            <span class="eye eye--left">👁</span>
            <span class="eye eye--right">👁</span>
          </div>
          <div class="cheshire-smile">😸</div>
        </div>
        <div class="cheshire-bubble" v-if="showCheshireBubble">
          <p>{{ cheshireMessage }}</p>
        </div>
      </div>
    </section>

    <!-- RABBIT HOLE : Intro / Pitch -->
    <section id="rabbit-hole" class="rabbit-hole-section" aria-labelledby="rabbit-hole-title">
      <div class="hole-tunnel" aria-hidden="true">
        <div class="tunnel-ring tunnel-ring--1"></div>
        <div class="tunnel-ring tunnel-ring--2"></div>
        <div class="tunnel-ring tunnel-ring--3"></div>
        <div class="tunnel-ring tunnel-ring--4"></div>
      </div>

      <div class="container" id="main-content">
        <div class="section-header">
          <span class="section-symbol" aria-hidden="true">∞</span>
          <h2 id="rabbit-hole-title">Le Terrier du Lapin</h2>
          <p class="section-subtitle">Où tout commence à ne plus faire sens... ou si ?</p>
        </div>

        <div class="impossible-cards">
          <article class="impossible-card" v-for="(item, index) in impossibleThings" :key="index">
            <div class="card-number">{{ index + 1 }}</div>
            <div class="card-content">
              <h3>{{ item.title }}</h3>
              <p>{{ item.description }}</p>
            </div>
            <div class="card-symbol" aria-hidden="true">{{ item.symbol }}</div>
          </article>
        </div>

        <div class="logic-strip" aria-hidden="true">
          <div class="strip-tape">
            <span v-for="(sym, i) in logicSymbols" :key="i" class="strip-symbol">{{ sym }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- GARDEN : Portfolio / Galerie -->
    <section id="garden" class="garden-section" aria-labelledby="garden-title">
      <div class="garden-bg" aria-hidden="true">
        <div class="rose-bush rose-bush--1">🌹</div>
        <div class="rose-bush rose-bush--2">🌹</div>
        <div class="rose-bush rose-bush--3">🥀</div>
        <div class="paint-splash paint-splash--1"></div>
        <div class="paint-splash paint-splash--2"></div>
      </div>

      <div class="container">
        <div class="section-header section-header--garden">
          <span class="section-symbol" aria-hidden="true">🌿</span>
          <h2 id="garden-title">Le Jardin de la Reine</h2>
          <p class="section-subtitle">« Peignez ces roses en rouge ! »</p>
        </div>

        <div class="garden-grid">
          <article 
            v-for="(project, index) in gardenProjects" 
            :key="project.id"
            class="plant-card"
            :class="'plant-card--' + project.type"
            :style="{ '--delay': index * 0.1 + 's' }"
          >
            <div class="plant-pot" aria-hidden="true">
              <span class="pot-icon">{{ project.icon }}</span>
            </div>
            <div class="plant-label">
              <span class="label-tag">{{ project.tag }}</span>
              <h3>{{ project.name }}</h3>
              <p>{{ project.desc }}</p>
            </div>
            <div class="card-suit" aria-hidden="true">{{ project.suit }}</div>
          </article>
        </div>
      </div>
    </section>

    <!-- LOGIC GAME : Section Tech/IA -->
    <section id="logic-game" class="logic-section" aria-labelledby="logic-title">
      <div class="logic-bg" aria-hidden="true">
        <div class="logic-grid-overlay"></div>
      </div>

      <div class="container">
        <div class="section-header section-header--logic">
          <span class="section-symbol" aria-hidden="true">⊢</span>
          <h2 id="logic-title">Le Jeu de Logique de Carroll</h2>
          <p class="section-subtitle">« Tout ce qui est logique est vrai. La logique est-elle vraie ? »</p>
        </div>

        <div class="logic-board">
          <div class="board-row" v-for="(row, rowIndex) in logicBoard" :key="rowIndex">
            <div 
              class="board-cell"
              v-for="(cell, cellIndex) in row"
              :key="cellIndex"
              :class="{ 
                'cell--dark': (rowIndex + cellIndex) % 2 === 0,
                'cell--light': (rowIndex + cellIndex) % 2 === 1,
                'cell--active': cell.active
              }"
              @mouseenter="activateCell(rowIndex, cellIndex)"
              @mouseleave="deactivateCell(rowIndex, cellIndex)"
            >
              <span class="cell-content" v-if="cell.content">{{ cell.content }}</span>
            </div>
          </div>
        </div>

        <div class="logic-rules">
          <div class="rule-card" v-for="(rule, index) in logicRules" :key="index">
            <div class="rule-premise">
              <span class="premise-symbol">{{ rule.symbol }}</span>
              <span class="premise-text">{{ rule.premise }}</span>
            </div>
            <div class="rule-arrow" aria-hidden="true">→</div>
            <div class="rule-conclusion">{{ rule.conclusion }}</div>
          </div>
        </div>

        <!-- Turing Machine Visualizer -->
        <div class="turing-visualizer">
          <h3>Machine de Turing</h3>
          <div class="turing-machine">
            <div class="machine-tape">
              <div 
                class="machine-cell"
                v-for="(symbol, index) in turingTape"
                :key="index"
                :class="{ 'cell--current': index === turingHead }"
              >
                {{ symbol }}
              </div>
            </div>
            <div class="machine-head" aria-hidden="true">
              <span class="head-pointer">▼</span>
              <span class="head-state">q{{ turingState }}</span>
            </div>
          </div>
          <div class="machine-controls">
            <button @click="stepTuring" class="control-btn" aria-label="Avancer d'un pas">
              <span>ÉTAPE</span>
            </button>
            <button @click="resetTuring" class="control-btn" aria-label="Réinitialiser">
              <span>RESET</span>
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- LOOKING GLASS : Réflexion / À propos -->
    <section id="looking-glass" class="mirror-section" aria-labelledby="mirror-title">
      <div class="mirror-frame-bg" aria-hidden="true"></div>

      <div class="container">
        <div class="section-header">
          <span class="section-symbol" aria-hidden="true">🪞</span>
          <h2 id="mirror-title">De l'Autre Côté du Miroir</h2>
          <p class="section-subtitle">« De l'autre côté du miroir, tout est inversé »</p>
        </div>

        <div class="mirror-content">
          <div class="reflection-card">
            <div class="card-face card-face--front">
              <h3>Le Créateur</h3>
              <p>Développeur full-stack, architecte de systèmes, tisseur de logique et de créativité.</p>
              <div class="card-ornament" aria-hidden="true">♠ ♥ ♣ ♦</div>
            </div>
            <div class="card-face card-face--back">
              <h3>La Machine</h3>
              <p>Algorithmes, patterns, structures — la beauté cachée dans le code.</p>
              <div class="card-ornament" aria-hidden="true">0 1 0 1</div>
            </div>
          </div>

          <blockquote class="mirror-quote">
            <p>« La question n'est pas de savoir si les machines peuvent penser,<br>
            mais si les humains le peuvent vraiment. »</p>
            <cite>— B. F. Skinner (paraphrasant Turing)</cite>
          </blockquote>
        </div>
      </div>
    </section>

    <!-- FINAL : Mad Tea Party Contact -->
    <section id="tea-party" class="finale-section" aria-labelledby="finale-title">
      <div class="container">
        <div class="tea-party-finale">
          <h2 id="finale-title">
            <span class="finale-pre">Rejoignez la</span>
            <span class="finale-main">Folle Partie de Thé</span>
          </h2>
          
          <p class="finale-text">
            « Prenez un peu plus de thé », dit le Chapelier.<br>
            « Je n'en ai pas encore pris », répondit Alice.<br>
            « Vous ne pouvez donc pas en prendre moins. »
          </p>

          <div class="finale-cta">
            <router-link to="/contact" class="eat-me-btn">
              <span class="btn-label">MANGEZ-MOI</span>
              <span class="btn-icon" aria-hidden="true">🍰</span>
            </router-link>
          </div>

          <div class="final-symbols" aria-hidden="true">
            <span>∀x</span>
            <span>∃y</span>
            <span>x → y</span>
            <span>¬(¬p)</span>
            <span>p ∧ q</span>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

// Navigation tape
const tapeCells = [
  { id: 'hero', symbol: '⌂', label: 'Début' },
  { id: 'rabbit-hole', symbol: '○', label: 'Terrier' },
  { id: 'garden', symbol: '❀', label: 'Jardin' },
  { id: 'logic-game', symbol: '⊞', label: 'Logique' },
  { id: 'looking-glass', symbol: '◇', label: 'Miroir' },
  { id: 'tea-party', symbol: '☕', label: 'Thé' }
];

const activeSection = ref('hero');

// Typing effect
const phrases = [
  'Les machines peuvent-elles penser ?',
  'Nous sommes tous fous ici.',
  'De plus en plus curieux...',
  '01001000 01101001',
  'IF (impossible) THEN croire++;'
];
const typingText = ref('');
let phraseIndex = 0;
let charIndex = 0;
let typingInterval = null;

// Cheshire Cat
const cheshireMode = ref('full'); // 'full', 'smile', 'eyes'
const showCheshireBubble = ref(false);
const cheshireMessages = [
  "Nous sommes tous fous ici.",
  "Voulez-vous jouer aux échecs ?",
  "∃x : x est impossible",
  "Je ne suis qu'un sourire...",
  "0 ou 1 ? Oui."
];
const cheshireMessage = ref(cheshireMessages[0]);

// Impossible things - ACTUALISÉ
const impossibleThings = [
  { title: "Machines qui pensent", description: "Des LLM locaux qui rêvent en tokens sur ma RTX", symbol: "🤖" },
  { title: "Code qui compile du premier coup", description: "Le Saint Graal de tout développeur Symfony", symbol: "✨" },
  { title: "Bugs qui se documentent", description: "L'utopie du debugging assisté par IA", symbol: "🐛" },
  { title: "Serveurs ARK stables", description: "150 joueurs sans un seul crash... un jour peut-être", symbol: "🦖" },
  { title: "Workflows n8n sans erreur", description: "Quand l'automatisation fonctionne du premier coup", symbol: "🔄" },
  { title: "IA vraiment intelligente", description: "Ou juste très bonne en prédiction statistique ?", symbol: "🧠" }
];

// Logic symbols for strip
const logicSymbols = ['∧', '∨', '¬', '→', '↔', '∀', '∃', '⊢', '⊨', '∴', '∵', '≡', '⊕', '⊗'];

// Garden projects - ACTUALISÉ avec tes vrais projets
const gardenProjects = [
  { id: 1, name: "ARKADIA FRANCE", desc: "Cluster ARK 150+ joueurs", icon: "🦖", tag: "Communauté", type: "rose", suit: "♥" },
  { id: 2, name: "GL Digital Lab", desc: "Studio Dev & IA souveraine", icon: "🔮", tag: "Business", type: "lily", suit: "♠" },
  { id: 3, name: "Portfolio Matrix", desc: "Ce site immersif", icon: "💊", tag: "Vitrine", type: "tulip", suit: "♦" },
  { id: 4, name: "Workflows n8n", desc: "Automatisation intelligente", icon: "⚙️", tag: "Automation", type: "orchid", suit: "♣" },
  { id: 5, name: "Stack IA Locale", desc: "Ollama, RAG, ChromaDB", icon: "📚", tag: "IA", type: "rose", suit: "♥" },
  { id: 6, name: "VoyageoPro", desc: "Plateforme B2B tourisme", icon: "✈️", tag: "SaaS", type: "daisy", suit: "♠" }
];

// Logic board (chess-like)
const logicBoard = ref([
  [{ content: '∀' }, { content: '' }, { content: '∃' }, { content: '' }],
  [{ content: '' }, { content: '→' }, { content: '' }, { content: '¬' }],
  [{ content: '∧' }, { content: '' }, { content: '∨' }, { content: '' }],
  [{ content: '' }, { content: '⊢' }, { content: '' }, { content: '⊨' }]
]);

const logicRules = [
  { symbol: 'P₁', premise: 'Tous les développeurs boivent du café', conclusion: 'Neo est développeur' },
  { symbol: 'P₂', premise: 'Neo code à Limoges', conclusion: '∴ La logique fonctionne' },
  { symbol: '∴', premise: 'Ou alors...', conclusion: 'Nous sommes dans la Matrice' }
];

// Turing Machine
const turingTape = ref(['0', '1', '1', '0', '1', '0', '0', '1', '1', '0']);
const turingHead = ref(4);
const turingState = ref(0);

const activateCell = (row, col) => {
  logicBoard.value[row][col].active = true;
};

const deactivateCell = (row, col) => {
  logicBoard.value[row][col].active = false;
};

const stepTuring = () => {
  const current = turingTape.value[turingHead.value];
  // Simple flip rule
  turingTape.value[turingHead.value] = current === '0' ? '1' : '0';
  // Move head
  if (turingHead.value < turingTape.value.length - 1) {
    turingHead.value++;
  } else {
    turingHead.value = 0;
  }
  turingState.value = (turingState.value + 1) % 3;
};

const resetTuring = () => {
  turingTape.value = ['0', '1', '1', '0', '1', '0', '0', '1', '1', '0'];
  turingHead.value = 4;
  turingState.value = 0;
};

const scrollToSection = (id) => {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
};

// Typing animation
const typeText = () => {
  const currentPhrase = phrases[phraseIndex];
  if (charIndex < currentPhrase.length) {
    typingText.value += currentPhrase[charIndex];
    charIndex++;
  } else {
    clearInterval(typingInterval);
    setTimeout(() => {
      typingText.value = '';
      charIndex = 0;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      typingInterval = setInterval(typeText, 80);
    }, 2000);
  }
};

// Cheshire animation
let cheshireInterval = null;
const animateCheshire = () => {
  const modes = ['full', 'smile', 'full', 'eyes', 'full'];
  let modeIndex = 0;
  
  cheshireInterval = setInterval(() => {
    cheshireMode.value = modes[modeIndex];
    modeIndex = (modeIndex + 1) % modes.length;
    
    if (Math.random() > 0.7) {
      showCheshireBubble.value = true;
      cheshireMessage.value = cheshireMessages[Math.floor(Math.random() * cheshireMessages.length)];
      setTimeout(() => {
        showCheshireBubble.value = false;
      }, 3000);
    }
  }, 4000);
};

// Intersection Observer for active section
let observer = null;

onMounted(() => {
  typingInterval = setInterval(typeText, 80);
  animateCheshire();
  
  observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        activeSection.value = entry.target.id || 'hero';
      }
    });
  }, { threshold: 0.3 });

  document.querySelectorAll('section[id]').forEach(section => {
    observer.observe(section);
  });
});

onUnmounted(() => {
  if (typingInterval) clearInterval(typingInterval);
  if (cheshireInterval) clearInterval(cheshireInterval);
  if (observer) observer.disconnect();
});
</script>

<style scoped>
/* =============================================================================
   ALICE IN TURINGLAND - Variables
   ============================================================================= */
.alice-turing-page {
  --cream: #FDF6E3;
  --ivory: #FEFCF3;
  --blue-night: #1A1B3A;
  --blue-deep: #0D0E23;
  --green-bottle: #2D5A4A;
  --green-sage: #4A7C6F;
  --fuchsia: #D63384;
  --red-heart: #DC3545;
  --gold: #D4AF37;
  --purple-mad: #6F42C1;
  
  background: var(--blue-deep);
  color: var(--cream);
  min-height: 100vh;
  font-family: 'Inter', -apple-system, sans-serif;
  overflow-x: hidden;
}

/* =============================================================================
   SKIP LINK
   ============================================================================= */
.skip-link {
  position: absolute;
  top: -100%;
  left: 50%;
  transform: translateX(-50%);
  padding: 1rem 2rem;
  background: var(--gold);
  color: var(--blue-deep);
  text-decoration: none;
  border-radius: 0.5rem;
  z-index: 1000;
  transition: top 0.3s ease;
}

.skip-link:focus {
  top: 1rem;
}

/* =============================================================================
   TURING TAPE NAVIGATION
   ============================================================================= */
.turing-tape {
  position: fixed;
  top: 100px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 100;
  padding: 0.5rem;
  background: rgba(26, 27, 58, 0.9);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(212, 175, 55, 0.3);
  border-radius: 0.5rem;
}

.tape-track {
  display: flex;
  align-items: center;
  gap: 0;
  position: relative;
}

.tape-head {
  position: absolute;
  top: -30px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 1.5rem;
  animation: hop 1s ease-in-out infinite;
  transition: left 0.3s ease;
}

@keyframes hop {
  0%, 100% { transform: translateX(-50%) translateY(0); }
  50% { transform: translateX(-50%) translateY(-5px); }
}

.tape-cell {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.5rem 1rem;
  background: transparent;
  border: 1px solid rgba(253, 246, 227, 0.1);
  color: var(--cream);
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 60px;
}

.tape-cell:first-child {
  border-radius: 0.25rem 0 0 0.25rem;
}

.tape-cell:last-child {
  border-radius: 0 0.25rem 0.25rem 0;
}

.tape-cell:hover {
  background: rgba(212, 175, 55, 0.1);
}

.tape-cell.active {
  background: rgba(212, 175, 55, 0.2);
  border-color: var(--gold);
}

.cell-symbol {
  font-size: 1.25rem;
  margin-bottom: 0.25rem;
}

.cell-label {
  font-size: 0.6rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  opacity: 0.7;
}

/* =============================================================================
   HERO SECTION
   ============================================================================= */
.hero-section {
  min-height: 100vh;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6rem 0;
  overflow: hidden;
}

.hero-bg {
  position: absolute;
  inset: 0;
}

/* Falling objects */
.falling-objects {
  position: absolute;
  inset: 0;
  overflow: hidden;
}

.falling-item {
  position: absolute;
  font-size: 2rem;
  opacity: 0.4;
  animation: fall 15s linear infinite;
}

.falling-item--clock { left: 10%; animation-delay: 0s; animation-duration: 18s; }
.falling-item--card { left: 25%; animation-delay: 2s; animation-duration: 14s; }
.falling-item--key { left: 40%; animation-delay: 4s; animation-duration: 20s; }
.falling-item--cup { left: 55%; animation-delay: 1s; animation-duration: 16s; }
.falling-item--symbol { left: 70%; animation-delay: 3s; animation-duration: 12s; font-family: serif; }
.falling-item--symbol2 { left: 85%; animation-delay: 5s; animation-duration: 17s; font-family: serif; }
.falling-item--card2 { left: 15%; animation-delay: 6s; animation-duration: 19s; }
.falling-item--rabbit { left: 60%; animation-delay: 7s; animation-duration: 13s; }

@keyframes fall {
  0% { transform: translateY(-100vh) rotate(0deg); opacity: 0; }
  10% { opacity: 0.4; }
  90% { opacity: 0.4; }
  100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
}

/* Checkered floor */
.checkered-floor {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 40%;
  background: 
    repeating-conic-gradient(
      from 0deg at 50% 50%,
      rgba(253, 246, 227, 0.03) 0deg 90deg,
      transparent 90deg 180deg
    );
  background-size: 60px 60px;
  transform: perspective(500px) rotateX(60deg);
  transform-origin: bottom;
}

.perspective-grid {
  position: absolute;
  inset: 0;
  background-image: 
    linear-gradient(rgba(212, 175, 55, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(212, 175, 55, 0.03) 1px, transparent 1px);
  background-size: 100px 100px;
}

/* Tea Party Scene */
.tea-party-scene {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.tea-table {
  position: absolute;
  bottom: -100px;
  left: 50%;
  transform: translateX(-50%);
  opacity: 0.3;
}

.table-surface {
  display: flex;
  gap: 2rem;
  font-size: 2rem;
}

/* Mirror Terminal */
.mirror-terminal {
  text-align: center;
  position: relative;
}

.terminal-frame {
  position: relative;
  background: rgba(13, 14, 35, 0.9);
  border: 3px solid var(--gold);
  border-radius: 1rem;
  padding: 2rem;
  margin-bottom: 2rem;
  max-width: 500px;
  box-shadow: 
    0 0 30px rgba(212, 175, 55, 0.2),
    inset 0 0 60px rgba(212, 175, 55, 0.05);
}

.frame-ornament {
  position: absolute;
  font-size: 1.5rem;
  color: var(--gold);
}

.frame-ornament--tl { top: 0.5rem; left: 0.5rem; }
.frame-ornament--tr { top: 0.5rem; right: 0.5rem; }
.frame-ornament--bl { bottom: 0.5rem; left: 0.5rem; }
.frame-ornament--br { bottom: 0.5rem; right: 0.5rem; }

.terminal-screen {
  position: relative;
  background: #0a0a0a;
  border-radius: 0.5rem;
  padding: 1.5rem;
  min-height: 80px;
  overflow: hidden;
}

.screen-scanlines {
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    rgba(0, 255, 0, 0.03) 2px,
    rgba(0, 255, 0, 0.03) 4px
  );
  pointer-events: none;
}

.terminal-prompt {
  font-family: 'JetBrains Mono', monospace;
  color: #00ff00;
  font-size: 1rem;
  text-align: left;
  margin: 0;
}

.prompt-symbol {
  color: var(--gold);
  margin-right: 0.5rem;
}

.cursor {
  animation: blink 1s step-end infinite;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

.hero-title {
  margin-bottom: 1rem;
}

.title-line {
  display: block;
  line-height: 1.1;
}

.title-line--alice {
  font-family: 'Georgia', serif;
  font-size: clamp(1.5rem, 4vw, 2.5rem);
  color: var(--cream);
  font-style: italic;
}

.title-line--rabbit {
  font-family: 'Georgia', serif;
  font-size: clamp(3rem, 8vw, 5rem);
  color: var(--gold);
  text-shadow: 0 0 30px rgba(212, 175, 55, 0.5);
}

.title-line--turing {
  font-family: 'JetBrains Mono', monospace;
  font-size: clamp(1rem, 2.5vw, 1.5rem);
  color: var(--green-sage);
  letter-spacing: 0.2em;
}

.hero-tagline {
  font-family: 'Georgia', serif;
  font-style: italic;
  font-size: 1.25rem;
  color: rgba(253, 246, 227, 0.7);
  margin-bottom: 2rem;
}

/* Drink Me Button */
.drink-me-btn, .eat-me-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 2rem;
  background: linear-gradient(135deg, var(--green-bottle), var(--green-sage));
  color: var(--cream);
  border: 2px solid var(--gold);
  border-radius: 2rem;
  font-family: 'Georgia', serif;
  font-size: 1.1rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
}

.drink-me-btn:hover, .eat-me-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 10px 30px rgba(212, 175, 55, 0.3);
}

.btn-icon {
  font-size: 1.5rem;
}

/* Floating Quote */
.floating-quote {
  position: absolute;
  bottom: 10%;
  right: 5%;
  font-family: 'Georgia', serif;
  font-style: italic;
  font-size: 0.9rem;
  color: rgba(253, 246, 227, 0.4);
  max-width: 200px;
  animation: float 6s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

/* Cheshire Assistant */
.cheshire-assistant {
  position: fixed;
  bottom: 80px;
  right: 2rem;
  z-index: 50;
}

.cheshire-face {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, var(--purple-mad), var(--fuchsia));
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.5s ease;
  box-shadow: 0 5px 20px rgba(111, 66, 193, 0.4);
}

.cheshire-face.smile-only {
  background: transparent;
  box-shadow: none;
}

.cheshire-eyes {
  display: flex;
  gap: 0.5rem;
  font-size: 0.8rem;
  margin-bottom: 0.25rem;
  transition: opacity 0.3s ease;
}

.cheshire-smile {
  font-size: 1.5rem;
}

.cheshire-bubble {
  position: absolute;
  bottom: 70px;
  right: 0;
  background: var(--cream);
  color: var(--blue-night);
  padding: 0.75rem 1rem;
  border-radius: 1rem;
  font-size: 0.8rem;
  max-width: 200px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
  animation: bubble-appear 0.3s ease;
}

.cheshire-bubble::after {
  content: '';
  position: absolute;
  bottom: -8px;
  right: 20px;
  width: 0;
  height: 0;
  border-left: 8px solid transparent;
  border-right: 8px solid transparent;
  border-top: 8px solid var(--cream);
}

@keyframes bubble-appear {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* =============================================================================
   RABBIT HOLE SECTION
   ============================================================================= */
.rabbit-hole-section {
  position: relative;
  padding: 8rem 0;
  background: linear-gradient(180deg, var(--blue-deep) 0%, #0a0b1a 100%);
  overflow: hidden;
}

.hole-tunnel {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  height: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  overflow: hidden;
}

.tunnel-ring {
  position: absolute;
  border: 2px solid rgba(212, 175, 55, 0.2);
  border-radius: 50%;
  animation: tunnel-pulse 3s ease-in-out infinite;
}

.tunnel-ring--1 { width: 100px; height: 50px; top: 20px; animation-delay: 0s; }
.tunnel-ring--2 { width: 200px; height: 100px; top: 60px; animation-delay: 0.5s; }
.tunnel-ring--3 { width: 350px; height: 175px; top: 120px; animation-delay: 1s; }
.tunnel-ring--4 { width: 550px; height: 275px; top: 200px; animation-delay: 1.5s; }

@keyframes tunnel-pulse {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 0.6; }
}

.section-header {
  text-align: center;
  margin-bottom: 4rem;
}

.section-symbol {
  font-size: 2rem;
  display: block;
  margin-bottom: 0.5rem;
  color: var(--gold);
}

.section-header h2 {
  font-family: 'Georgia', serif;
  font-size: clamp(2rem, 5vw, 3.5rem);
  color: var(--cream);
  margin-bottom: 0.5rem;
}

.section-subtitle {
  font-family: 'Georgia', serif;
  font-style: italic;
  color: rgba(253, 246, 227, 0.6);
  font-size: 1.1rem;
}

/* Impossible Cards */
.impossible-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  margin-bottom: 4rem;
}

.impossible-card {
  position: relative;
  background: rgba(26, 27, 58, 0.8);
  border: 1px solid rgba(212, 175, 55, 0.2);
  border-radius: 1rem;
  padding: 1.5rem;
  transition: all 0.3s ease;
  overflow: hidden;
}

.impossible-card:hover {
  transform: translateY(-5px) scale(1.02);
  border-color: var(--gold);
  box-shadow: 0 15px 40px rgba(212, 175, 55, 0.15);
}

.card-number {
  position: absolute;
  top: 0.75rem;
  left: 0.75rem;
  font-family: 'Georgia', serif;
  font-size: 2rem;
  font-weight: bold;
  color: rgba(212, 175, 55, 0.2);
}

.card-content h3 {
  font-family: 'Georgia', serif;
  font-size: 1.1rem;
  color: var(--gold);
  margin-bottom: 0.5rem;
}

.card-content p {
  font-size: 0.9rem;
  color: rgba(253, 246, 227, 0.7);
  line-height: 1.5;
}

.card-symbol {
  position: absolute;
  bottom: 0.75rem;
  right: 0.75rem;
  font-size: 1.5rem;
  opacity: 0.6;
}

/* Logic Strip */
.logic-strip {
  overflow: hidden;
  padding: 1rem 0;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 0.5rem;
}

.strip-tape {
  display: flex;
  gap: 2rem;
  animation: scroll-tape 20s linear infinite;
}

.strip-symbol {
  font-family: serif;
  font-size: 1.5rem;
  color: var(--gold);
  opacity: 0.5;
}

@keyframes scroll-tape {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}

/* =============================================================================
   GARDEN SECTION
   ============================================================================= */
.garden-section {
  position: relative;
  padding: 8rem 0;
  background: linear-gradient(180deg, #0a0b1a 0%, var(--green-bottle) 50%, #0a0b1a 100%);
  overflow: hidden;
}

.garden-bg {
  position: absolute;
  inset: 0;
}

.rose-bush {
  position: absolute;
  font-size: 3rem;
  opacity: 0.3;
}

.rose-bush--1 { top: 20%; left: 5%; }
.rose-bush--2 { top: 60%; right: 8%; }
.rose-bush--3 { bottom: 15%; left: 15%; }

.paint-splash {
  position: absolute;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  filter: blur(40px);
}

.paint-splash--1 {
  top: 30%;
  left: 10%;
  background: var(--red-heart);
  opacity: 0.2;
}

.paint-splash--2 {
  bottom: 20%;
  right: 15%;
  background: var(--red-heart);
  opacity: 0.15;
}

.section-header--garden .section-symbol {
  color: var(--green-sage);
}

/* Garden Grid */
.garden-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
}

.plant-card {
  position: relative;
  background: rgba(26, 27, 58, 0.9);
  border: 1px solid rgba(74, 124, 111, 0.3);
  border-radius: 1rem;
  padding: 2rem;
  transition: all 0.4s ease;
  animation: grow-in 0.6s ease var(--delay) both;
}

@keyframes grow-in {
  from {
    opacity: 0;
    transform: scale(0.8) translateY(20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.plant-card:hover {
  transform: scale(1.05);
  border-color: var(--green-sage);
  box-shadow: 0 20px 50px rgba(45, 90, 74, 0.3);
}

.plant-pot {
  text-align: center;
  margin-bottom: 1rem;
}

.pot-icon {
  font-size: 3rem;
  display: block;
  margin-bottom: 0.5rem;
}

.label-tag {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background: rgba(74, 124, 111, 0.3);
  border-radius: 1rem;
  font-size: 0.7rem;
  color: var(--green-sage);
  margin-bottom: 0.5rem;
}

.plant-label h3 {
  font-family: 'Georgia', serif;
  font-size: 1.25rem;
  color: var(--cream);
  margin-bottom: 0.5rem;
}

.plant-label p {
  font-size: 0.85rem;
  color: rgba(253, 246, 227, 0.6);
}

.card-suit {
  position: absolute;
  top: 1rem;
  right: 1rem;
  font-size: 1.5rem;
  color: var(--red-heart);
  opacity: 0.4;
}

/* =============================================================================
   LOGIC SECTION
   ============================================================================= */
.logic-section {
  position: relative;
  padding: 8rem 0;
  background: var(--blue-night);
  overflow: hidden;
}

.logic-bg {
  position: absolute;
  inset: 0;
}

.logic-grid-overlay {
  position: absolute;
  inset: 0;
  background-image: 
    linear-gradient(rgba(212, 175, 55, 0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(212, 175, 55, 0.05) 1px, transparent 1px);
  background-size: 40px 40px;
}

.section-header--logic .section-symbol {
  font-family: serif;
}

/* Logic Board */
.logic-board {
  max-width: 400px;
  margin: 0 auto 3rem;
  border: 2px solid var(--gold);
  border-radius: 0.5rem;
  overflow: hidden;
}

.board-row {
  display: flex;
}

.board-cell {
  width: 100px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: serif;
  font-size: 2rem;
  transition: all 0.3s ease;
  cursor: pointer;
}

.cell--dark {
  background: rgba(0, 0, 0, 0.4);
  color: var(--cream);
}

.cell--light {
  background: rgba(253, 246, 227, 0.1);
  color: var(--gold);
}

.cell--active {
  background: rgba(212, 175, 55, 0.3) !important;
  transform: scale(1.1);
}

/* Logic Rules */
.logic-rules {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 600px;
  margin: 0 auto 4rem;
}

.rule-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.5rem;
  background: rgba(26, 27, 58, 0.8);
  border: 1px solid rgba(212, 175, 55, 0.2);
  border-radius: 0.5rem;
}

.rule-premise {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.premise-symbol {
  font-family: serif;
  font-size: 1.25rem;
  color: var(--gold);
  min-width: 30px;
}

.premise-text {
  font-size: 0.9rem;
  color: rgba(253, 246, 227, 0.8);
}

.rule-arrow {
  font-size: 1.5rem;
  color: var(--gold);
}

.rule-conclusion {
  font-family: 'Georgia', serif;
  font-style: italic;
  color: var(--fuchsia);
}

/* Turing Visualizer */
.turing-visualizer {
  max-width: 600px;
  margin: 0 auto;
  text-align: center;
}

.turing-visualizer h3 {
  font-family: 'Georgia', serif;
  font-size: 1.5rem;
  color: var(--gold);
  margin-bottom: 1.5rem;
}

.turing-machine {
  position: relative;
  margin-bottom: 1.5rem;
}

.machine-tape {
  display: flex;
  justify-content: center;
  gap: 0;
  background: rgba(0, 0, 0, 0.4);
  padding: 1rem;
  border-radius: 0.5rem;
  border: 1px solid rgba(212, 175, 55, 0.3);
}

.machine-cell {
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(253, 246, 227, 0.1);
  border: 1px solid rgba(212, 175, 55, 0.2);
  font-family: 'JetBrains Mono', monospace;
  font-size: 1.5rem;
  color: var(--cream);
  transition: all 0.3s ease;
}

.machine-cell.cell--current {
  background: rgba(212, 175, 55, 0.3);
  border-color: var(--gold);
  transform: scale(1.1);
}

.machine-head {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 0.5rem;
}

.head-pointer {
  font-size: 1.5rem;
  color: var(--gold);
  animation: point 0.5s ease-in-out infinite;
}

@keyframes point {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-3px); }
}

.head-state {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.8rem;
  color: var(--fuchsia);
}

.machine-controls {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.control-btn {
  padding: 0.75rem 1.5rem;
  background: rgba(212, 175, 55, 0.2);
  border: 1px solid var(--gold);
  color: var(--cream);
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.9rem;
  border-radius: 0.25rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.control-btn:hover {
  background: var(--gold);
  color: var(--blue-night);
}

/* =============================================================================
   MIRROR SECTION
   ============================================================================= */
.mirror-section {
  position: relative;
  padding: 8rem 0;
  background: linear-gradient(180deg, var(--blue-night) 0%, var(--blue-deep) 100%);
  overflow: hidden;
}

.mirror-frame-bg {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80%;
  height: 80%;
  border: 3px solid rgba(212, 175, 55, 0.1);
  border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
}

.mirror-content {
  max-width: 700px;
  margin: 0 auto;
}

.reflection-card {
  position: relative;
  height: 250px;
  margin-bottom: 3rem;
  perspective: 1000px;
}

.card-face {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 2rem;
  background: rgba(26, 27, 58, 0.9);
  border: 2px solid var(--gold);
  border-radius: 1rem;
  backface-visibility: hidden;
  transition: transform 0.8s ease;
}

.card-face--front {
  text-align: left;
}

.card-face--back {
  transform: rotateY(180deg);
  text-align: right;
}

.reflection-card:hover .card-face--front {
  transform: rotateY(-180deg);
}

.reflection-card:hover .card-face--back {
  transform: rotateY(0deg);
}

.card-face h3 {
  font-family: 'Georgia', serif;
  font-size: 1.75rem;
  color: var(--gold);
  margin-bottom: 1rem;
}

.card-face p {
  font-size: 1.1rem;
  color: rgba(253, 246, 227, 0.8);
  line-height: 1.6;
}

.card-ornament {
  margin-top: 1rem;
  font-size: 1.5rem;
  letter-spacing: 0.5rem;
  opacity: 0.4;
}

.mirror-quote {
  text-align: center;
}

.mirror-quote p {
  font-family: 'Georgia', serif;
  font-size: 1.25rem;
  font-style: italic;
  color: rgba(253, 246, 227, 0.7);
  line-height: 1.8;
}

.mirror-quote cite {
  display: block;
  margin-top: 1rem;
  font-size: 0.9rem;
  color: rgba(253, 246, 227, 0.5);
}

/* =============================================================================
   FINALE SECTION
   ============================================================================= */
.finale-section {
  padding: 8rem 0;
  background: radial-gradient(ellipse at center, var(--blue-night) 0%, var(--blue-deep) 100%);
  text-align: center;
}

.tea-party-finale h2 {
  margin-bottom: 2rem;
}

.finale-pre {
  display: block;
  font-family: 'Georgia', serif;
  font-size: 1.25rem;
  font-style: italic;
  color: rgba(253, 246, 227, 0.6);
}

.finale-main {
  display: block;
  font-family: 'Georgia', serif;
  font-size: clamp(2.5rem, 6vw, 4rem);
  color: var(--gold);
  text-shadow: 0 0 40px rgba(212, 175, 55, 0.4);
}

.finale-text {
  font-family: 'Georgia', serif;
  font-style: italic;
  font-size: 1.1rem;
  color: rgba(253, 246, 227, 0.7);
  line-height: 1.8;
  max-width: 500px;
  margin: 0 auto 2rem;
}

.eat-me-btn {
  background: linear-gradient(135deg, var(--fuchsia), var(--purple-mad));
}

.finale-cta {
  margin-bottom: 3rem;
}

.final-symbols {
  display: flex;
  justify-content: center;
  gap: 2rem;
  font-family: serif;
  font-size: 1.25rem;
  color: rgba(212, 175, 55, 0.3);
}

/* =============================================================================
   RESPONSIVE
   ============================================================================= */
@media (max-width: 1024px) {
  .impossible-cards {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .garden-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .turing-tape {
    display: none;
  }
}

@media (max-width: 768px) {
  .impossible-cards {
    grid-template-columns: 1fr;
  }
  
  .garden-grid {
    grid-template-columns: 1fr;
  }
  
  .board-cell {
    width: 70px;
    height: 70px;
    font-size: 1.5rem;
  }
  
  .machine-cell {
    width: 35px;
    height: 35px;
    font-size: 1rem;
  }
  
  .cheshire-assistant {
    bottom: 80px;
    right: 1rem;
  }
  
  .terminal-frame {
    padding: 1rem;
  }
}

/* =============================================================================
   ACCESSIBILITY
   ============================================================================= */
@media (prefers-reduced-motion: reduce) {
  .falling-item,
  .tunnel-ring,
  .strip-tape,
  .cursor,
  .tape-head,
  .head-pointer {
    animation: none !important;
  }
  
  .plant-card {
    animation: none;
    opacity: 1;
    transform: none;
  }
}
</style>
