<template>
  <div class="rpo-page">
    <a href="#main-content" class="skip-link">Aller au contenu principal</a>

    <!-- OASIS GRID BACKGROUND -->
    <div class="oasis-bg" aria-hidden="true">
      <div class="grid-horizon"></div>
      <div class="floating-cubes">
        <div class="cube" v-for="n in 12" :key="n" :style="{ '--delay': n * 0.5 + 's', '--x': Math.random() * 100 + '%' }"></div>
      </div>
      <div class="scan-line"></div>
    </div>

    <!-- HERO : Bienvenue dans l'OASIS -->
    <section id="hero" class="rpo-hero" aria-labelledby="hero-title">
      <div class="container" id="main-content">
        <div class="gsc-badge">
          <div class="badge-icon">🎮</div>
          <span class="badge-text">GREGARIOUS SIMULATION SYSTEMS</span>
        </div>

        <h1 id="hero-title" class="hero-title">
          <span class="title-pre">BIENVENUE DANS</span>
          <span class="title-main">L'OASIS</span>
          <span class="title-sub">La réalité est le seul endroit où l'on peut manger</span>
        </h1>

        <p class="hero-quote">
          « Les gens viennent dans l'OASIS pour tout ce qu'ils peuvent y faire, 
          mais ils y restent pour tout ce qu'ils peuvent y être. »
        </p>

        <div class="player-hud">
          <div class="hud-item">
            <span class="hud-label">NIVEAU</span>
            <span class="hud-value">{{ playerLevel }}</span>
          </div>
          <div class="hud-item">
            <span class="hud-label">XP</span>
            <div class="xp-bar">
              <div class="xp-fill" :style="{ width: xpPercent + '%' }"></div>
            </div>
            <span class="hud-value">{{ currentXP }}/{{ nextLevelXP }}</span>
          </div>
          <div class="hud-item">
            <span class="hud-label">CRÉDITS</span>
            <span class="hud-value hud-value--gold">{{ credits.toLocaleString() }} ¤</span>
          </div>
        </div>

        <div class="avatar-selector">
          <span class="selector-label">AVATAR ACTIF</span>
          <div class="avatars">
            <button 
              v-for="avatar in avatars" 
              :key="avatar.id"
              class="avatar-btn"
              :class="{ active: currentAvatar === avatar.id }"
              @click="selectAvatar(avatar.id)"
              :title="avatar.name"
            >
              <span class="avatar-icon">{{ avatar.icon }}</span>
              <span class="avatar-name">{{ avatar.name }}</span>
            </button>
          </div>
        </div>

        <button class="enter-btn" @click="scrollTo('quest')">
          <span class="btn-icon">🚀</span>
          <span class="btn-text">ENTRER DANS L'OASIS</span>
        </button>
      </div>
    </section>

    <!-- QUEST : La Chasse à l'Œuf -->
    <section id="quest" class="rpo-section quest-section" aria-labelledby="quest-title">
      <div class="container">
        <div class="section-header">
          <span class="header-icon">🥚</span>
          <h2 id="quest-title">LA CHASSE À L'ŒUF</h2>
          <p class="section-sub">Trois clés pour débloquer l'Easter Egg ultime</p>
        </div>

        <div class="keys-grid">
          <article 
            v-for="(key, index) in easterKeys" 
            :key="key.id"
            class="key-card"
            :class="{ 'key--found': key.found }"
            @click="findKey(index)"
          >
            <div class="key-glow" :style="{ '--color': key.color }"></div>
            <div class="key-icon">{{ key.found ? '🔑' : '🔒' }}</div>
            <div class="key-content">
              <span class="key-type">{{ key.type }}</span>
              <h3>{{ key.name }}</h3>
              <p>{{ key.riddle }}</p>
            </div>
            <div class="key-challenge">
              <span class="challenge-label">DÉFI</span>
              <p>{{ key.challenge }}</p>
            </div>
            <div class="key-reward" v-if="key.found">
              <span>+{{ key.xp }} XP</span>
            </div>
          </article>
        </div>

        <div class="egg-progress">
          <div class="progress-track">
            <div class="progress-fill" :style="{ width: (keysFound / 3 * 100) + '%' }"></div>
          </div>
          <span class="progress-text">{{ keysFound }}/3 clés trouvées</span>
        </div>

        <div class="halliday-quote" v-if="keysFound === 3">
          <div class="quote-avatar">👴</div>
          <p>« Félicitations, Gunter. Tu as prouvé ta valeur. L'OASIS t'appartient désormais. »</p>
          <cite>— James Halliday</cite>
        </div>
      </div>
    </section>

    <!-- INVENTORY : Compétences & Arsenal -->
    <section id="inventory" class="rpo-section inventory-section" aria-labelledby="inventory-title">
      <div class="container">
        <div class="section-header">
          <span class="header-icon">🎒</span>
          <h2 id="inventory-title">INVENTAIRE</h2>
          <p class="section-sub">Objets, compétences et power-ups collectés</p>
        </div>

        <div class="inventory-tabs">
          <button 
            v-for="tab in inventoryTabs" 
            :key="tab.id"
            class="tab-btn"
            :class="{ active: activeTab === tab.id }"
            @click="activeTab = tab.id"
          >
            <span class="tab-icon">{{ tab.icon }}</span>
            <span class="tab-name">{{ tab.name }}</span>
            <span class="tab-count">{{ tab.count }}</span>
          </button>
        </div>

        <div class="inventory-grid">
          <div 
            v-for="item in currentInventory" 
            :key="item.id"
            class="inventory-item"
            :class="'rarity--' + item.rarity"
          >
            <div class="item-icon">{{ item.icon }}</div>
            <div class="item-info">
              <span class="item-rarity">{{ item.rarity }}</span>
              <h4>{{ item.name }}</h4>
              <p>{{ item.desc }}</p>
            </div>
            <div class="item-stats" v-if="item.stats">
              <div class="stat" v-for="(value, stat) in item.stats" :key="stat">
                <span class="stat-name">{{ stat }}</span>
                <span class="stat-value">+{{ value }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- PLANETS : Secteurs de l'OASIS -->
    <section id="planets" class="rpo-section planets-section" aria-labelledby="planets-title">
      <div class="container">
        <div class="section-header">
          <span class="header-icon">🪐</span>
          <h2 id="planets-title">SECTEURS DE L'OASIS</h2>
          <p class="section-sub">Des milliers de mondes à explorer</p>
        </div>

        <div class="planets-grid">
          <router-link 
            v-for="planet in planets" 
            :key="planet.id"
            :to="planet.path"
            class="planet-card"
            :style="{ '--planet-color': planet.color }"
          >
            <div class="planet-visual">
              <div class="planet-sphere">{{ planet.icon }}</div>
              <div class="planet-ring"></div>
            </div>
            <div class="planet-info">
              <span class="planet-sector">SECTEUR {{ planet.sector }}</span>
              <h3>{{ planet.name }}</h3>
              <p>{{ planet.desc }}</p>
              <div class="planet-stats">
                <span><strong>{{ planet.users }}</strong> utilisateurs</span>
                <span><strong>{{ planet.difficulty }}</strong></span>
              </div>
            </div>
          </router-link>
        </div>
      </div>
    </section>

    <!-- LEADERBOARD : High Scores -->
    <section id="leaderboard" class="rpo-section leaderboard-section" aria-labelledby="leaderboard-title">
      <div class="container">
        <div class="section-header">
          <span class="header-icon">🏆</span>
          <h2 id="leaderboard-title">TABLEAU DES SCORES</h2>
          <p class="section-sub">Les meilleurs Gunters de l'OASIS</p>
        </div>

        <div class="scoreboard">
          <div class="scoreboard-header">
            <span class="col-rank">RANG</span>
            <span class="col-player">JOUEUR</span>
            <span class="col-score">SCORE</span>
            <span class="col-keys">CLÉS</span>
          </div>
          <div 
            v-for="(player, index) in leaderboard" 
            :key="player.name"
            class="scoreboard-row"
            :class="{ 'row--highlight': player.isPlayer }"
          >
            <span class="col-rank">
              <span v-if="index < 3" class="rank-medal">{{ ['🥇', '🥈', '🥉'][index] }}</span>
              <span v-else>{{ index + 1 }}</span>
            </span>
            <span class="col-player">
              <span class="player-avatar">{{ player.avatar }}</span>
              <span class="player-name">{{ player.name }}</span>
            </span>
            <span class="col-score">{{ player.score.toLocaleString() }}</span>
            <span class="col-keys">
              <span v-for="n in player.keys" :key="n" class="key-icon">🔑</span>
              <span v-for="n in (3 - player.keys)" :key="'empty-' + n" class="key-icon key--empty">🔒</span>
            </span>
          </div>
        </div>
      </div>
    </section>

    <!-- CLAN : IOI vs Gunters -->
    <section id="clan" class="rpo-section clan-section" aria-labelledby="clan-title">
      <div class="container">
        <div class="section-header">
          <span class="header-icon">⚔️</span>
          <h2 id="clan-title">CHOISIS TON CAMP</h2>
          <p class="section-sub">Gunter indépendant ou empire corporatif ?</p>
        </div>

        <div class="factions">
          <div class="faction faction--gunters">
            <div class="faction-badge">🎮</div>
            <h3>LES GUNTERS</h3>
            <p class="faction-motto">« Pour la gloire, pas pour l'argent »</p>
            <ul class="faction-traits">
              <li>✓ Indépendance totale</li>
              <li>✓ Passion du code</li>
              <li>✓ Communauté ouverte</li>
              <li>✓ Open source</li>
            </ul>
            <div class="faction-members">
              <span>Parzival</span>
              <span>Art3mis</span>
              <span>Aech</span>
              <span>Daito</span>
              <span>Shoto</span>
            </div>
          </div>

          <div class="vs-separator">
            <span>VS</span>
          </div>

          <div class="faction faction--ioi">
            <div class="faction-badge">🏢</div>
            <h3>IOI / SIXERS</h3>
            <p class="faction-motto">« Le profit avant tout »</p>
            <ul class="faction-traits">
              <li>✗ Dépendance cloud</li>
              <li>✗ Vendor lock-in</li>
              <li>✗ Données captives</li>
              <li>✗ Coûts cachés</li>
            </ul>
            <div class="faction-members">
              <span>AWS</span>
              <span>Azure</span>
              <span>GCP</span>
              <span>Oracle</span>
            </div>
          </div>
        </div>

        <div class="choice-made">
          <p>Mon choix : <strong>Gunter indépendant</strong> — IA locale, données souveraines, zéro dépendance.</p>
        </div>
      </div>
    </section>

    <!-- ARCADE : Easter Eggs -->
    <section id="arcade" class="rpo-section arcade-section" aria-labelledby="arcade-title">
      <div class="container">
        <div class="section-header">
          <span class="header-icon">👾</span>
          <h2 id="arcade-title">SALLE D'ARCADE</h2>
          <p class="section-sub">Références et Easter Eggs cachés</p>
        </div>

        <div class="arcade-grid">
          <div v-for="ref in references" :key="ref.name" class="arcade-cabinet">
            <div class="cabinet-screen">
              <span class="screen-icon">{{ ref.icon }}</span>
            </div>
            <div class="cabinet-info">
              <h4>{{ ref.name }}</h4>
              <p>{{ ref.desc }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CONTACT : Rejoindre l'équipe -->
    <section id="contact" class="rpo-section contact-section" aria-labelledby="contact-title">
      <div class="contact-bg" aria-hidden="true">
        <div class="portal-effect"></div>
      </div>

      <div class="container">
        <div class="egg-icon">🥚</div>

        <h2 id="contact-title" class="contact-title">
          <span class="pre">FÉLICITATIONS</span>
          <span class="main">TU AS TROUVÉ L'EASTER EGG</span>
        </h2>

        <p class="contact-text">
          Tu as prouvé ta valeur, Gunter.<br>
          Prêt à rejoindre l'aventure ?
        </p>

        <router-link to="/contact" class="contact-btn">
          <span class="btn-icon">🎮</span>
          <span class="btn-text">REJOINDRE L'ÉQUIPE</span>
        </router-link>

        <div class="contact-footer" aria-hidden="true">
          <span>// OASIS v2.0.26 // GL DIGITAL LAB // LIMOGES, FRANCE</span>
        </div>
      </div>
    </section>

    <!-- HUD FIXE -->
    <div class="fixed-hud" aria-hidden="true">
      <div class="hud-avatar">{{ avatars.find(a => a.id === currentAvatar)?.icon || '🎮' }}</div>
      <div class="hud-info">
        <span class="hud-name">{{ avatars.find(a => a.id === currentAvatar)?.name || 'Joueur' }}</span>
        <span class="hud-level">Niv. {{ playerLevel }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const playerLevel = ref(42);
const currentXP = ref(8750);
const nextLevelXP = ref(10000);
const credits = ref(250000);
const currentAvatar = ref('parzival');
const activeTab = ref('weapons');

const xpPercent = computed(() => (currentXP.value / nextLevelXP.value) * 100);

const avatars = [
  { id: 'parzival', name: 'Parzival', icon: '🎮' },
  { id: 'art3mis', name: 'Art3mis', icon: '🏍️' },
  { id: 'aech', name: 'Aech', icon: '🤖' },
  { id: 'daito', name: 'Daito', icon: '⚔️' },
  { id: 'shoto', name: 'Shoto', icon: '🗡️' }
];

const easterKeys = ref([
  { 
    id: 'copper', 
    type: 'CLÉ DE CUIVRE', 
    name: 'La Première Porte',
    riddle: 'Le cuivre brille pour ceux qui cherchent le début',
    challenge: 'Maîtriser les fondamentaux du code',
    color: '#b87333',
    xp: 5000,
    found: true
  },
  { 
    id: 'jade', 
    type: 'CLÉ DE JADE', 
    name: 'La Deuxième Porte',
    riddle: 'Le jade révèle la sagesse de l\'architecture',
    challenge: 'Construire des systèmes scalables',
    color: '#00a86b',
    xp: 10000,
    found: true
  },
  { 
    id: 'crystal', 
    type: 'CLÉ DE CRISTAL', 
    name: 'La Troisième Porte',
    riddle: 'Le cristal reflète l\'avenir de l\'IA',
    challenge: 'Intégrer l\'intelligence artificielle',
    color: '#e0e0e0',
    xp: 25000,
    found: false
  }
]);

const keysFound = computed(() => easterKeys.value.filter(k => k.found).length);

const findKey = (index) => {
  if (!easterKeys.value[index].found && (index === 0 || easterKeys.value[index - 1].found)) {
    easterKeys.value[index].found = true;
    currentXP.value += easterKeys.value[index].xp;
    if (currentXP.value >= nextLevelXP.value) {
      playerLevel.value++;
      currentXP.value = currentXP.value - nextLevelXP.value;
    }
  }
};

const inventoryTabs = [
  { id: 'weapons', name: 'Armes', icon: '⚔️', count: 4 },
  { id: 'vehicles', name: 'Véhicules', icon: '🚗', count: 3 },
  { id: 'skills', name: 'Compétences', icon: '✨', count: 8 },
  { id: 'artifacts', name: 'Artefacts', icon: '💎', count: 5 }
];

const inventoryItems = {
  weapons: [
    { id: 1, icon: '⚙️', name: 'Symfony Blade', desc: 'Épée légendaire du backend', rarity: 'légendaire', stats: { ATK: 95, SPD: 88 } },
    { id: 2, icon: '💚', name: 'Vue Boomerang', desc: 'Arme réactive du frontend', rarity: 'épique', stats: { ATK: 85, CRT: 92 } },
    { id: 3, icon: '🧠', name: 'Neural Cannon', desc: 'Canon à IA locale', rarity: 'légendaire', stats: { ATK: 90, INT: 100 } },
    { id: 4, icon: '🐳', name: 'Docker Launcher', desc: 'Lance-conteneurs', rarity: 'rare', stats: { ATK: 75, DEF: 80 } }
  ],
  vehicles: [
    { id: 1, icon: '🏎️', name: 'DeLorean Dev', desc: 'Voyage dans le temps du code', rarity: 'légendaire', stats: { VIT: 100 } },
    { id: 2, icon: '🚀', name: 'Shuttle Deploy', desc: 'Déploiement instantané', rarity: 'épique', stats: { VIT: 95 } },
    { id: 3, icon: '🏍️', name: 'Akira Bike', desc: 'Moto cyberpunk agile', rarity: 'rare', stats: { VIT: 88 } }
  ],
  skills: [
    { id: 1, icon: '🐘', name: 'PHP 8.3+', desc: 'Maîtrise avancée', rarity: 'légendaire' },
    { id: 2, icon: '📘', name: 'TypeScript', desc: 'Typage fort', rarity: 'épique' },
    { id: 3, icon: '🗄️', name: 'PostgreSQL', desc: 'Base de données', rarity: 'épique' },
    { id: 4, icon: '🔄', name: 'n8n', desc: 'Automatisation', rarity: 'rare' },
    { id: 5, icon: '🎨', name: 'Three.js', desc: '3D WebGL', rarity: 'rare' },
    { id: 6, icon: '📚', name: 'ChromaDB', desc: 'Vecteurs IA', rarity: 'rare' },
    { id: 7, icon: '🔌', name: 'API REST', desc: 'Architecture', rarity: 'commun' },
    { id: 8, icon: '🔒', name: 'Auth JWT', desc: 'Sécurité', rarity: 'commun' }
  ],
  artifacts: [
    { id: 1, icon: '🥚', name: 'Easter Egg', desc: 'L\'œuf de Halliday', rarity: 'légendaire' },
    { id: 2, icon: '📿', name: 'Amulette RGPD', desc: 'Protection des données', rarity: 'épique' },
    { id: 3, icon: '🛡️', name: 'Bouclier Souverain', desc: 'Indépendance cloud', rarity: 'légendaire' },
    { id: 4, icon: '📜', name: 'Parchemin Opquast', desc: 'Qualité web', rarity: 'rare' },
    { id: 5, icon: '⭐', name: 'Étoile Awwwards', desc: 'Excellence design', rarity: 'épique' }
  ]
};

const currentInventory = computed(() => inventoryItems[activeTab.value] || []);

const planets = [
  { id: 1, sector: 'α', name: 'Planète Matrix', icon: '💊', path: '/', desc: 'Le hub central de l\'OASIS', color: '#22c55e', users: '∞', difficulty: 'Accueil' },
  { id: 2, sector: 'β', name: 'Ludus', icon: '🎓', path: '/parcours', desc: 'Zone d\'apprentissage', color: '#f59e0b', users: '1M+', difficulty: 'Facile' },
  { id: 3, sector: 'γ', name: 'Secteur Projets', icon: '🛠️', path: '/projets', desc: 'Forge de création', color: '#10b981', users: '500K', difficulty: 'Moyen' },
  { id: 4, sector: 'δ', name: 'Monde IA', icon: '🧠', path: '/stack-ia', desc: 'Intelligence artificielle', color: '#8b5cf6', users: '250K', difficulty: 'Expert' },
  { id: 5, sector: 'ε', name: 'ARKADIA', icon: '🦖', path: '/arkadia', desc: 'Cluster gaming', color: '#ef4444', users: '150+', difficulty: 'Survie' },
  { id: 6, sector: 'ω', name: 'Arcade Zone', icon: '👾', path: '/arcade', desc: 'Mini-jeux rétro', color: '#ec4899', users: '∞', difficulty: 'Fun' }
];

const leaderboard = [
  { name: 'Parzival', avatar: '🎮', score: 1500000, keys: 3, isPlayer: false },
  { name: 'Art3mis', avatar: '🏍️', score: 1450000, keys: 3, isPlayer: false },
  { name: 'Aech', avatar: '🤖', score: 1200000, keys: 2, isPlayer: false },
  { name: 'Neo_GL', avatar: '😎', score: 950000, keys: 2, isPlayer: true },
  { name: 'Daito', avatar: '⚔️', score: 800000, keys: 2, isPlayer: false },
  { name: 'Shoto', avatar: '🗡️', score: 750000, keys: 1, isPlayer: false }
];

const references = [
  { icon: '👾', name: 'Space Invaders', desc: 'Classique arcade 1978' },
  { icon: '🟡', name: 'Pac-Man', desc: 'Le mangeur de fantômes' },
  { icon: '🦍', name: 'Donkey Kong', desc: 'Mario avant Mario' },
  { icon: '🏎️', name: 'Pole Position', desc: 'Course rétro' },
  { icon: '⚔️', name: 'Adventure', desc: 'Premier Easter Egg' },
  { icon: '🎸', name: 'Guitar Hero', desc: 'Rythme et mélodie' }
];

const selectAvatar = (id) => {
  currentAvatar.value = id;
};

const scrollTo = (id) => {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
};
</script>

<style scoped>
/* =============================================================================
   READY PLAYER ONE - Variables
   ============================================================================= */
.rpo-page {
  --neon-blue: #00f5ff;
  --neon-pink: #ff00ff;
  --neon-green: #00ff00;
  --neon-orange: #ff6600;
  --gold: #ffd700;
  --bg: #0a0a12;
  --bg-dark: #050508;
  --surface: rgba(20, 20, 35, 0.9);
  
  background: var(--bg);
  color: #e0e0e0;
  min-height: 100vh;
  font-family: 'Orbitron', 'Rajdhani', sans-serif;
  overflow-x: hidden;
}

/* =============================================================================
   OASIS BACKGROUND
   ============================================================================= */
.oasis-bg {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
}

.grid-horizon {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 50%;
  background-image: 
    linear-gradient(rgba(0, 245, 255, 0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 245, 255, 0.05) 1px, transparent 1px);
  background-size: 50px 50px;
  transform: perspective(500px) rotateX(60deg);
  transform-origin: bottom;
}

.floating-cubes {
  position: absolute;
  inset: 0;
}

.cube {
  position: absolute;
  width: 20px;
  height: 20px;
  background: linear-gradient(135deg, var(--neon-blue), var(--neon-pink));
  opacity: 0.3;
  animation: floatCube 10s ease-in-out infinite;
  animation-delay: var(--delay);
  left: var(--x);
  top: -50px;
}

@keyframes floatCube {
  0% { transform: translateY(0) rotate(0deg); opacity: 0; }
  10% { opacity: 0.3; }
  90% { opacity: 0.3; }
  100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
}

.scan-line {
  position: absolute;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--neon-blue), transparent);
  animation: scanLine 4s linear infinite;
  opacity: 0.5;
}

@keyframes scanLine {
  0% { top: 0; }
  100% { top: 100%; }
}

/* =============================================================================
   HERO SECTION
   ============================================================================= */
.rpo-hero {
  min-height: 100vh;
  display: flex;
  align-items: center;
  position: relative;
  padding: 6rem 2rem;
  z-index: 1;
}

.container {
  position: relative;
  max-width: 1100px;
  margin: 0 auto;
}

/* Badge GSC */
.gsc-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1.5rem;
  background: rgba(0, 245, 255, 0.1);
  border: 1px solid var(--neon-blue);
  margin-bottom: 2rem;
}

.badge-icon {
  font-size: 1.5rem;
}

.badge-text {
  font-size: 0.7rem;
  letter-spacing: 0.2em;
  color: var(--neon-blue);
}

/* Hero Title */
.hero-title {
  margin-bottom: 2rem;
}

.title-pre {
  display: block;
  font-size: 1rem;
  color: rgba(224, 224, 224, 0.5);
  letter-spacing: 0.3em;
  margin-bottom: 0.5rem;
}

.title-main {
  display: block;
  font-size: clamp(4rem, 12vw, 10rem);
  font-weight: 900;
  background: linear-gradient(135deg, var(--neon-blue), var(--neon-pink), var(--neon-orange));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  filter: drop-shadow(0 0 30px rgba(0, 245, 255, 0.5));
  line-height: 1;
}

.title-sub {
  display: block;
  font-size: 1rem;
  color: rgba(224, 224, 224, 0.6);
  margin-top: 1rem;
  font-family: 'Inter', sans-serif;
  font-style: italic;
}

.hero-quote {
  font-size: 1.1rem;
  font-style: italic;
  color: rgba(224, 224, 224, 0.6);
  max-width: 500px;
  font-family: 'Inter', sans-serif;
  margin-bottom: 2rem;
  line-height: 1.6;
}

/* Player HUD */
.player-hud {
  display: flex;
  gap: 2rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.hud-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.hud-label {
  font-size: 0.65rem;
  color: rgba(224, 224, 224, 0.5);
  letter-spacing: 0.1em;
}

.hud-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--neon-blue);
}

.hud-value--gold {
  color: var(--gold);
}

.xp-bar {
  width: 150px;
  height: 8px;
  background: rgba(255, 255, 255, 0.1);
  overflow: hidden;
}

.xp-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--neon-blue), var(--neon-pink));
  transition: width 0.5s ease;
}

/* Avatar Selector */
.avatar-selector {
  margin-bottom: 2rem;
}

.selector-label {
  display: block;
  font-size: 0.7rem;
  color: rgba(224, 224, 224, 0.5);
  letter-spacing: 0.1em;
  margin-bottom: 0.75rem;
}

.avatars {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.avatar-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  padding: 0.75rem 1rem;
  background: transparent;
  border: 2px solid rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 0.6);
  font-family: inherit;
  font-size: 0.65rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.avatar-btn:hover {
  border-color: var(--neon-blue);
  color: white;
}

.avatar-btn.active {
  background: rgba(0, 245, 255, 0.1);
  border-color: var(--neon-blue);
  color: var(--neon-blue);
  box-shadow: 0 0 20px rgba(0, 245, 255, 0.3);
}

.avatar-icon {
  font-size: 1.5rem;
}

.avatar-name {
  letter-spacing: 0.05em;
}

/* Enter Button */
.enter-btn, .contact-btn {
  display: inline-flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem 2.5rem;
  background: linear-gradient(135deg, var(--neon-blue), var(--neon-pink));
  border: none;
  color: white;
  font-family: 'Orbitron', sans-serif;
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
}

.enter-btn:hover, .contact-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 0 40px rgba(0, 245, 255, 0.5);
}

.btn-icon {
  font-size: 1.25rem;
}

/* =============================================================================
   SECTIONS COMMON
   ============================================================================= */
.rpo-section {
  min-height: 100vh;
  padding: 6rem 2rem;
  position: relative;
  z-index: 1;
}

.section-header {
  text-align: center;
  margin-bottom: 4rem;
}

.header-icon {
  display: block;
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}

.section-header h2 {
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 900;
  background: linear-gradient(135deg, var(--neon-blue), var(--neon-pink));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: 0.1em;
}

.section-sub {
  font-size: 0.9rem;
  color: rgba(224, 224, 224, 0.5);
  font-family: 'Inter', sans-serif;
  margin-top: 0.5rem;
}

/* =============================================================================
   QUEST SECTION
   ============================================================================= */
.quest-section {
  background: linear-gradient(180deg, var(--bg) 0%, var(--bg-dark) 100%);
}

.keys-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.key-card {
  background: var(--surface);
  border: 2px solid rgba(255, 255, 255, 0.1);
  padding: 2rem;
  position: relative;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
}

.key-card:hover {
  border-color: var(--neon-blue);
  transform: translateY(-5px);
}

.key-card.key--found {
  border-color: var(--gold);
}

.key-glow {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background: var(--color);
}

.key--found .key-glow {
  box-shadow: 0 0 20px var(--color);
}

.key-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.key-type {
  font-size: 0.7rem;
  color: var(--gold);
  letter-spacing: 0.1em;
}

.key-card h3 {
  font-size: 1.25rem;
  color: white;
  margin: 0.5rem 0;
}

.key-card p {
  font-size: 0.9rem;
  color: rgba(224, 224, 224, 0.6);
  font-family: 'Inter', sans-serif;
}

.key-challenge {
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.challenge-label {
  font-size: 0.65rem;
  color: var(--neon-pink);
  letter-spacing: 0.1em;
}

.key-reward {
  position: absolute;
  top: 1rem;
  right: 1rem;
  padding: 0.25rem 0.75rem;
  background: var(--gold);
  color: black;
  font-size: 0.7rem;
  font-weight: 700;
}

.egg-progress {
  max-width: 400px;
  margin: 0 auto 2rem;
  text-align: center;
}

.progress-track {
  height: 10px;
  background: rgba(255, 255, 255, 0.1);
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #b87333, #00a86b, #e0e0e0);
  transition: width 0.5s ease;
}

.progress-text {
  font-size: 0.8rem;
  color: var(--gold);
}

.halliday-quote {
  text-align: center;
  padding: 2rem;
  background: rgba(255, 215, 0, 0.1);
  border: 2px solid var(--gold);
  max-width: 600px;
  margin: 0 auto;
}

.quote-avatar {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.halliday-quote p {
  font-size: 1.1rem;
  color: var(--gold);
  font-style: italic;
  font-family: 'Inter', sans-serif;
}

.halliday-quote cite {
  display: block;
  margin-top: 1rem;
  color: rgba(224, 224, 224, 0.6);
}

/* =============================================================================
   INVENTORY SECTION
   ============================================================================= */
.inventory-section {
  background: var(--bg-dark);
}

.inventory-tabs {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.tab-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: transparent;
  border: 2px solid rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 0.6);
  font-family: inherit;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.tab-btn:hover {
  border-color: var(--neon-blue);
  color: white;
}

.tab-btn.active {
  background: rgba(0, 245, 255, 0.1);
  border-color: var(--neon-blue);
  color: var(--neon-blue);
}

.tab-icon {
  font-size: 1.25rem;
}

.tab-count {
  padding: 0.2rem 0.5rem;
  background: rgba(255, 255, 255, 0.1);
  font-size: 0.7rem;
}

.inventory-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
}

.inventory-item {
  background: var(--surface);
  border: 2px solid rgba(255, 255, 255, 0.1);
  padding: 1.5rem;
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 1rem;
  align-items: start;
  transition: all 0.3s ease;
}

.inventory-item:hover {
  transform: translateY(-3px);
}

.rarity--légendaire {
  border-color: var(--gold);
  background: linear-gradient(135deg, rgba(255, 215, 0, 0.1), transparent);
}

.rarity--épique {
  border-color: #a855f7;
  background: linear-gradient(135deg, rgba(168, 85, 247, 0.1), transparent);
}

.rarity--rare {
  border-color: var(--neon-blue);
  background: linear-gradient(135deg, rgba(0, 245, 255, 0.1), transparent);
}

.rarity--commun {
  border-color: rgba(255, 255, 255, 0.2);
}

.item-icon {
  font-size: 2.5rem;
}

.item-rarity {
  font-size: 0.6rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.rarity--légendaire .item-rarity { color: var(--gold); }
.rarity--épique .item-rarity { color: #a855f7; }
.rarity--rare .item-rarity { color: var(--neon-blue); }
.rarity--commun .item-rarity { color: rgba(255, 255, 255, 0.5); }

.item-info h4 {
  font-size: 1rem;
  color: white;
  margin: 0.25rem 0;
}

.item-info p {
  font-size: 0.8rem;
  color: rgba(224, 224, 224, 0.6);
  font-family: 'Inter', sans-serif;
}

.item-stats {
  grid-column: 1 / -1;
  display: flex;
  gap: 1rem;
  padding-top: 0.75rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.item-stats .stat {
  display: flex;
  gap: 0.5rem;
  font-size: 0.75rem;
}

.stat-name {
  color: rgba(224, 224, 224, 0.5);
}

.stat-value {
  color: var(--neon-green);
}

/* =============================================================================
   PLANETS SECTION
   ============================================================================= */
.planets-section {
  background: linear-gradient(180deg, var(--bg-dark) 0%, var(--bg) 100%);
}

.planets-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 1.5rem;
}

.planet-card {
  background: var(--surface);
  border: 2px solid rgba(255, 255, 255, 0.1);
  padding: 2rem;
  display: grid;
  grid-template-columns: 100px 1fr;
  gap: 1.5rem;
  align-items: center;
  text-decoration: none;
  color: inherit;
  transition: all 0.3s ease;
}

.planet-card:hover {
  border-color: var(--planet-color);
  transform: translateY(-5px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.planet-visual {
  position: relative;
}

.planet-sphere {
  width: 80px;
  height: 80px;
  background: radial-gradient(circle at 30% 30%, var(--planet-color), transparent);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  box-shadow: 0 0 30px var(--planet-color);
}

.planet-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) rotateX(75deg);
  width: 100px;
  height: 100px;
  border: 2px solid var(--planet-color);
  border-radius: 50%;
  opacity: 0.5;
}

.planet-sector {
  font-size: 0.65rem;
  color: var(--planet-color);
  letter-spacing: 0.1em;
}

.planet-info h3 {
  font-size: 1.25rem;
  color: white;
  margin: 0.25rem 0;
}

.planet-info p {
  font-size: 0.85rem;
  color: rgba(224, 224, 224, 0.6);
  font-family: 'Inter', sans-serif;
  margin-bottom: 0.75rem;
}

.planet-stats {
  display: flex;
  gap: 1.5rem;
  font-size: 0.75rem;
  color: rgba(224, 224, 224, 0.5);
}

.planet-stats strong {
  color: var(--planet-color);
}

/* =============================================================================
   LEADERBOARD SECTION
   ============================================================================= */
.leaderboard-section {
  background: var(--bg);
}

.scoreboard {
  max-width: 800px;
  margin: 0 auto;
  background: var(--surface);
  border: 2px solid var(--neon-blue);
  overflow: hidden;
}

.scoreboard-header {
  display: grid;
  grid-template-columns: 80px 1fr 120px 120px;
  padding: 1rem 1.5rem;
  background: rgba(0, 245, 255, 0.1);
  font-size: 0.7rem;
  color: var(--neon-blue);
  letter-spacing: 0.1em;
}

.scoreboard-row {
  display: grid;
  grid-template-columns: 80px 1fr 120px 120px;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  align-items: center;
  transition: background 0.3s ease;
}

.scoreboard-row:hover {
  background: rgba(0, 245, 255, 0.05);
}

.row--highlight {
  background: rgba(255, 215, 0, 0.1);
  border-left: 3px solid var(--gold);
}

.rank-medal {
  font-size: 1.5rem;
}

.col-player {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.player-avatar {
  font-size: 1.5rem;
}

.player-name {
  font-weight: 600;
}

.col-score {
  color: var(--neon-green);
  font-family: 'JetBrains Mono', monospace;
}

.col-keys {
  display: flex;
  gap: 0.25rem;
}

.key-icon {
  font-size: 1rem;
}

.key--empty {
  opacity: 0.3;
}

/* =============================================================================
   CLAN SECTION
   ============================================================================= */
.clan-section {
  background: linear-gradient(180deg, var(--bg) 0%, var(--bg-dark) 100%);
}

.factions {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 2rem;
  align-items: center;
  max-width: 900px;
  margin: 0 auto 3rem;
}

.faction {
  background: var(--surface);
  padding: 2rem;
  text-align: center;
}

.faction--gunters {
  border: 2px solid var(--neon-green);
}

.faction--ioi {
  border: 2px solid #ef4444;
}

.faction-badge {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.faction h3 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

.faction--gunters h3 {
  color: var(--neon-green);
}

.faction--ioi h3 {
  color: #ef4444;
}

.faction-motto {
  font-size: 0.9rem;
  font-style: italic;
  color: rgba(224, 224, 224, 0.6);
  font-family: 'Inter', sans-serif;
  margin-bottom: 1.5rem;
}

.faction-traits {
  list-style: none;
  padding: 0;
  margin: 0 0 1.5rem;
  text-align: left;
}

.faction-traits li {
  padding: 0.5rem 0;
  font-size: 0.9rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.faction--gunters .faction-traits li {
  color: var(--neon-green);
}

.faction--ioi .faction-traits li {
  color: #ef4444;
}

.faction-members {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  justify-content: center;
}

.faction-members span {
  padding: 0.25rem 0.75rem;
  background: rgba(255, 255, 255, 0.1);
  font-size: 0.7rem;
}

.vs-separator {
  font-size: 2rem;
  font-weight: 900;
  color: var(--neon-pink);
  text-shadow: 0 0 20px var(--neon-pink);
}

.choice-made {
  text-align: center;
  padding: 1.5rem;
  background: rgba(0, 255, 0, 0.1);
  border: 1px solid var(--neon-green);
  max-width: 600px;
  margin: 0 auto;
  font-family: 'Inter', sans-serif;
}

.choice-made strong {
  color: var(--neon-green);
}

/* =============================================================================
   ARCADE SECTION
   ============================================================================= */
.arcade-section {
  background: var(--bg-dark);
}

.arcade-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1.5rem;
  max-width: 800px;
  margin: 0 auto;
}

.arcade-cabinet {
  background: var(--surface);
  border: 2px solid rgba(255, 255, 255, 0.1);
  padding: 1.5rem;
  text-align: center;
  transition: all 0.3s ease;
}

.arcade-cabinet:hover {
  border-color: var(--neon-pink);
  transform: translateY(-5px);
}

.cabinet-screen {
  width: 60px;
  height: 60px;
  margin: 0 auto 1rem;
  background: linear-gradient(135deg, var(--neon-blue), var(--neon-pink));
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
}

.cabinet-info h4 {
  font-size: 0.9rem;
  color: white;
  margin-bottom: 0.25rem;
}

.cabinet-info p {
  font-size: 0.75rem;
  color: rgba(224, 224, 224, 0.5);
  font-family: 'Inter', sans-serif;
}

/* =============================================================================
   CONTACT SECTION
   ============================================================================= */
.contact-section {
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  position: relative;
  min-height: 100vh;
}

.contact-bg {
  position: absolute;
  inset: 0;
}

.portal-effect {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, rgba(0, 245, 255, 0.2) 0%, transparent 70%);
  animation: portalPulse 3s ease-in-out infinite;
}

@keyframes portalPulse {
  0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.5; }
  50% { transform: translate(-50%, -50%) scale(1.2); opacity: 0.3; }
}

.egg-icon {
  font-size: 5rem;
  margin-bottom: 2rem;
  animation: eggFloat 3s ease-in-out infinite;
}

@keyframes eggFloat {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.contact-title {
  margin-bottom: 1rem;
}

.contact-title .pre {
  display: block;
  font-size: 1rem;
  color: var(--gold);
  letter-spacing: 0.3em;
}

.contact-title .main {
  display: block;
  font-size: clamp(2rem, 6vw, 4rem);
  font-weight: 900;
  background: linear-gradient(135deg, var(--gold), var(--neon-orange));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.contact-text {
  font-size: 1.1rem;
  color: rgba(224, 224, 224, 0.6);
  font-family: 'Inter', sans-serif;
  margin-bottom: 2rem;
  line-height: 1.8;
}

.contact-footer {
  margin-top: 3rem;
  font-size: 0.7rem;
  color: rgba(0, 245, 255, 0.4);
  font-family: 'JetBrains Mono', monospace;
}

/* =============================================================================
   FIXED HUD
   ============================================================================= */
.fixed-hud {
  position: fixed;
  bottom: 70px;
  left: 1rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  background: rgba(0, 0, 0, 0.9);
  border: 1px solid var(--neon-blue);
  z-index: 50;
}

.hud-avatar {
  font-size: 1.5rem;
}

.hud-info {
  display: flex;
  flex-direction: column;
}

.hud-name {
  font-size: 0.8rem;
  color: white;
}

.hud-level {
  font-size: 0.65rem;
  color: var(--neon-blue);
}

/* =============================================================================
   RESPONSIVE
   ============================================================================= */
@media (max-width: 1024px) {
  .factions {
    grid-template-columns: 1fr;
  }
  
  .vs-separator {
    padding: 1rem 0;
  }
}

@media (max-width: 768px) {
  .player-hud {
    gap: 1rem;
  }
  
  .scoreboard-header,
  .scoreboard-row {
    grid-template-columns: 60px 1fr 80px;
  }
  
  .col-keys {
    display: none;
  }
  
  .planet-card {
    grid-template-columns: 1fr;
    text-align: center;
  }
  
  .planet-visual {
    margin: 0 auto;
  }
}

/* =============================================================================
   ACCESSIBILITY
   ============================================================================= */
@media (prefers-reduced-motion: reduce) {
  .cube,
  .scan-line,
  .portal-effect,
  .egg-icon {
    animation: none !important;
  }
}
</style>
