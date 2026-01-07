<template>
  <div class="home-page">
    <a href="#main" class="skip-link">Aller au contenu principal</a>
    
    <!-- ═══════════════════════════════════════════════════════════════════════
         HERO : Expérience immersive + Message clair
         ═══════════════════════════════════════════════════════════════════════ -->
    <section class="hero" id="main">
      <!-- Animated Background -->
      <div class="hero-bg" aria-hidden="true">
        <div class="gradient-orb gradient-orb--1"></div>
        <div class="gradient-orb gradient-orb--2"></div>
        <div class="grid-lines"></div>
        <div class="particles">
          <span v-for="n in 20" :key="n" class="particle" :style="getParticleStyle(n)"></span>
        </div>
      </div>
      
      <div class="container hero-grid">
        <!-- Content -->
        <div class="hero__content">
          <div class="hero-badge">
            <span class="badge-pulse"></span>
            <span class="badge-text">{{ badgeTexts[currentBadge] }}</span>
          </div>
          
          <h1 class="hero__title">
            Je crée des <span class="highlight">sites web</span><br>
            et <span class="highlight">applications</span><br>
            pour les PME
          </h1>
          
          <p class="hero__subtitle">
            Développeur indépendant à <strong>Limoges</strong>, je transforme vos idées 
            en outils numériques qui <em>travaillent pour vous</em>.
          </p>
          
          <!-- Value Pills Interactive -->
          <div class="value-pills">
            <div 
              v-for="(v, i) in values" 
              :key="i" 
              class="pill"
              :class="{ active: activePill === i }"
              @mouseenter="activePill = i"
              @mouseleave="activePill = null"
            >
              <span class="pill-icon">{{ v.icon }}</span>
              <span class="pill-text">{{ v.short }}</span>
              <transition name="expand">
                <span v-if="activePill === i" class="pill-detail">{{ v.detail }}</span>
              </transition>
            </div>
          </div>
          
          <!-- CTAs -->
          <div class="hero__cta">
            <router-link to="/contact" class="btn-primary">
              <span class="btn-glow"></span>
              <span class="btn-content">
                <span>💬</span>
                <span>Discutons de votre projet</span>
              </span>
              <span class="btn-arrow">→</span>
            </router-link>
            <router-link to="/services" class="btn-ghost">
              Voir les services
            </router-link>
          </div>
        </div>
        
        <!-- Visual : Code Window -->
        <div class="hero__visual">
          <div class="code-window">
            <div class="window-bar">
              <div class="dots"><span></span><span></span><span></span></div>
              <span class="window-title">projet.js</span>
            </div>
            <div class="window-body">
              <pre><code><span class="ln">1</span>  <span class="cmt">// Votre idée devient réalité</span>
<span class="ln">2</span>  <span class="kw">const</span> <span class="var">projet</span> = {
<span class="ln">3</span>    <span class="prop">idée</span>: <span class="str">"💡 Votre vision"</span>,
<span class="ln">4</span>    <span class="prop">tech</span>: [<span class="str">"Symfony"</span>, <span class="str">"Vue.js"</span>],
<span class="ln">5</span>    <span class="prop">hébergement</span>: <span class="str">"🇫🇷 France"</span>,
<span class="ln">6</span>  };
<span class="ln">7</span>
<span class="ln">8</span>  <span class="kw">const</span> <span class="var">résultat</span> = <span class="fn">build</span>(projet);
<span class="ln">9</span>  <span class="cmt">// → 🚀 En production !</span></code></pre>
            </div>
            <div class="window-status">
              <span><span class="status-dot"></span> Ready</span>
              <span>UTF-8</span>
            </div>
          </div>
          
          <!-- Floating Tech -->
          <div class="floating-tech">
            <span class="tech-float" style="--x: 0%; --y: 20%; --d: 0s">Symfony</span>
            <span class="tech-float" style="--x: 80%; --y: 10%; --d: 0.5s">Vue.js</span>
            <span class="tech-float" style="--x: 90%; --y: 70%; --d: 1s">Docker</span>
            <span class="tech-float" style="--x: 5%; --y: 80%; --d: 1.5s">PHP 8</span>
          </div>
        </div>
      </div>
      
      <!-- Scroll -->
      <button class="scroll-hint" @click="scrollTo('services')" aria-label="Défiler vers les services">
        <span>Explorer</span>
        <div class="mouse"><div class="wheel"></div></div>
      </button>
    </section>

    <!-- ═══════════════════════════════════════════════════════════════════════
         SERVICES : Cartes expansibles
         ═══════════════════════════════════════════════════════════════════════ -->
    <section id="services" class="section services-section">
      <div class="container">
        <header class="section-header">
          <span class="section-tag"><span>01</span> Services</span>
          <h2>Ce que je peux <span class="accent">créer pour vous</span></h2>
          <p>Du site vitrine à l'application métier, chaque projet est unique.</p>
        </header>
        
        <div class="services-grid">
          <article 
            v-for="(s, i) in services" 
            :key="i"
            class="service-card"
            :class="{ expanded: expandedService === i }"
            @click="expandedService = expandedService === i ? null : i"
            :style="{ '--accent': s.color }"
          >
            <div class="card-glow"></div>
            <header class="card-head">
              <div class="card-icon">{{ s.icon }}</div>
              <div class="card-meta">
                <h3>{{ s.title }}</h3>
                <span class="card-price">{{ s.price }}</span>
              </div>
              <span class="card-toggle">{{ expandedService === i ? '−' : '+' }}</span>
            </header>
            <p class="card-intro">{{ s.intro }}</p>
            
            <transition name="slide">
              <div v-if="expandedService === i" class="card-details">
                <div class="details-col">
                  <h4>✓ Ce que vous obtenez</h4>
                  <ul>
                    <li v-for="(f, j) in s.features" :key="j">{{ f }}</li>
                  </ul>
                </div>
                <div class="details-col">
                  <h4>💡 Exemples</h4>
                  <div class="tags">
                    <span v-for="(e, j) in s.examples" :key="j">{{ e }}</span>
                  </div>
                </div>
              </div>
            </transition>
          </article>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════════════════════════════════
         PROCESS : Timeline interactive
         ═══════════════════════════════════════════════════════════════════════ -->
    <section class="section process-section">
      <div class="container">
        <header class="section-header center">
          <span class="section-tag"><span>02</span> Processus</span>
          <h2>Comment ça <span class="accent">se passe ?</span></h2>
        </header>
        
        <div class="timeline">
          <div class="timeline-line">
            <div class="line-progress" :style="{ width: ((activeStep + 1) / steps.length) * 100 + '%' }"></div>
          </div>
          <div class="timeline-steps">
            <div 
              v-for="(step, i) in steps" 
              :key="i" 
              class="step"
              :class="{ active: i <= activeStep, current: i === activeStep }"
              @mouseenter="activeStep = i"
            >
              <div class="step-marker">
                <span>{{ i + 1 }}</span>
              </div>
              <div class="step-body">
                <span class="step-icon">{{ step.icon }}</span>
                <h4>{{ step.title }}</h4>
                <p>{{ step.desc }}</p>
                <span class="step-time">{{ step.time }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════════════════════════════════
         CASE STUDY : ARKADIA Dashboard
         ═══════════════════════════════════════════════════════════════════════ -->
    <section class="section case-section">
      <div class="container">
        <div class="case-grid">
          <div class="case-content">
            <span class="case-badge">🎮 Cas concret en production</span>
            <h2>ARKADIA</h2>
            <p class="case-sub">150 joueurs • 9 serveurs • 0 problème</p>
            <p>
              Je gère un cluster de serveurs de jeux avec de vrais utilisateurs 
              qui comptent sur une disponibilité <strong>24/7</strong>. Mon terrain 
              d'entraînement pour l'infrastructure critique.
            </p>
            
            <div class="stats-row">
              <div class="stat" v-for="(st, i) in arkStats" :key="i">
                <span class="stat-val">{{ st.val }}<small>{{ st.unit }}</small></span>
                <span class="stat-label">{{ st.label }}</span>
              </div>
            </div>
            
            <div class="case-insight">
              <span>💡</span>
              <p><strong>Ce que ça prouve :</strong> Je sais faire tourner des systèmes critiques avec de vrais utilisateurs exigeants.</p>
            </div>
            
            <router-link to="/arkadia" class="link-arrow">Voir l'étude complète →</router-link>
          </div>
          
          <!-- Dashboard -->
          <div class="case-visual">
            <div class="dashboard">
              <div class="dash-head">
                <span>🖥️ Cluster Monitor</span>
                <span class="live"><span class="dot"></span> LIVE</span>
              </div>
              <div class="servers">
                <div 
                  v-for="(srv, i) in servers" 
                  :key="i" 
                  class="srv"
                  :class="{ hover: hoveredSrv === i }"
                  @mouseenter="hoveredSrv = i"
                  @mouseleave="hoveredSrv = null"
                >
                  <span class="srv-name">{{ srv.name }}</span>
                  <span class="srv-dot"></span>
                  <div v-if="hoveredSrv === i" class="srv-metrics">
                    <div class="metric"><span>CPU</span><div class="bar"><div :style="{width: srv.cpu+'%'}"></div></div><span>{{ srv.cpu }}%</span></div>
                    <div class="metric"><span>RAM</span><div class="bar"><div :style="{width: srv.ram+'%'}"></div></div><span>{{ srv.ram }}%</span></div>
                  </div>
                </div>
              </div>
              <div class="dash-foot">
                <span>Sync: 2min</span>
                <span>👥 {{ players }} joueurs</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════════════════════════════════
         ABOUT
         ═══════════════════════════════════════════════════════════════════════ -->
    <section class="section about-section">
      <div class="container">
        <div class="about-grid">
          <div class="about-visual">
            <div class="avatar">
              <div class="avatar-ring"></div>
              <span class="avatar-emoji">👨‍💻</span>
            </div>
            <div class="id-card">
              <div class="id-row"><span>NOM</span><span>Gaëtan Langlet</span></div>
              <div class="id-row"><span>ALIAS</span><span class="accent">"Neo"</span></div>
              <div class="id-row"><span>BASE</span><span>📍 Limoges, FR</span></div>
              <div class="id-row"><span>XP</span><span>Depuis 2020</span></div>
            </div>
          </div>
          
          <div class="about-content">
            <header class="section-header">
              <span class="section-tag"><span>03</span> À propos</span>
              <h2>Qui suis-je <span class="accent">vraiment ?</span></h2>
            </header>
            <p>
              J'ai commencé par <strong>gérer des communautés de joueurs</strong> — 
              des milliers d'utilisateurs exigeants, des serveurs à maintenir 24/7.
            </p>
            <p>
              Cette expérience m'a appris la <em>rigueur technique</em> et surtout 
              l'importance d'<strong>écouter les utilisateurs</strong>.
            </p>
            
            <div class="values">
              <div v-for="(v, i) in aboutValues" :key="i" class="value-card">
                <span class="v-icon">{{ v.icon }}</span>
                <h4>{{ v.title }}</h4>
                <p>{{ v.desc }}</p>
              </div>
            </div>
            
            <router-link to="/parcours" class="link-arrow">Mon parcours complet →</router-link>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════════════════════════════════
         TECH STACK
         ═══════════════════════════════════════════════════════════════════════ -->
    <section class="section tech-section">
      <div class="container">
        <header class="section-header center">
          <span class="section-tag"><span>04</span> Technologies</span>
          <h2>Mes outils de <span class="accent">travail</span></h2>
        </header>
        
        <div class="tech-grid">
          <div v-for="(cat, i) in techCats" :key="i" class="tech-card">
            <h4>{{ cat.icon }} {{ cat.name }}</h4>
            <p>{{ cat.desc }}</p>
            <div class="tech-tags">
              <span v-for="t in cat.techs" :key="t" :class="{ highlight: cat.highlight?.includes(t) }">{{ t }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════════════════════════════════
         MULTIVERS TEASER
         ═══════════════════════════════════════════════════════════════════════ -->
    <section class="section multivers-section">
      <div class="portal-rings" aria-hidden="true">
        <div class="ring"></div><div class="ring"></div><div class="ring"></div>
      </div>
      <div class="container">
        <div class="multivers-content">
          <span class="easter-badge">🎮 Easter Egg</span>
          <h2>Envie d'explorer ?</h2>
          <p>Ce portfolio cache <strong>21 univers parallèles</strong>. Matrix, Blade Runner, Dragon Ball...</p>
          
          <div class="universe-row">
            <router-link 
              v-for="(u, i) in universes" 
              :key="i" 
              :to="u.path" 
              class="universe-orb"
              :style="{ '--c': u.color, '--d': i * 0.15 + 's' }"
            >
              <span>{{ u.icon }}</span>
            </router-link>
            <span class="more">+16</span>
          </div>
          
          <router-link to="/multivers" class="btn-portal">
            <span class="portal-spin">🌀</span>
            Explorer le Multivers
          </router-link>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════════════════════════════════
         FINAL CTA
         ═══════════════════════════════════════════════════════════════════════ -->
    <section class="section final-section">
      <div class="container">
        <div class="final-card">
          <h2>Un projet en tête ?</h2>
          <p>Racontez-moi votre idée. Je réponds sous 24h avec une première estimation.</p>
          <router-link to="/contact" class="btn-primary btn-lg">
            <span class="btn-glow"></span>
            <span class="btn-content"><span>💬</span> Parlons-en !</span>
            <span class="btn-arrow">→</span>
          </router-link>
          <div class="trust">
            <span>✓ Réponse 24h</span>
            <span>✓ Échange gratuit</span>
            <span>✓ Sans engagement</span>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

// State
const currentBadge = ref(0);
const activePill = ref(null);
const expandedService = ref(null);
const activeStep = ref(0);
const hoveredSrv = ref(null);
const players = ref(47);

// Data
const badgeTexts = ['Bienvenue chez GL Digital Lab', 'Développeur Full-Stack', 'Basé à Limoges', 'Disponible'];

const values = [
  { icon: '🇫🇷', short: '100% France', detail: 'Hébergement souverain' },
  { icon: '🔒', short: 'Vos données', detail: 'Restent votre propriété' },
  { icon: '🤝', short: 'Sur-mesure', detail: 'Chaque projet est unique' },
  { icon: '🚀', short: 'Performance', detail: 'Optimisé pour la vitesse' },
];

const services = [
  {
    icon: '🌐', title: 'Sites Web', price: 'À partir de 2 500€', color: '#3b82f6',
    intro: 'Site vitrine, e-commerce, blog... Un site qui vous ressemble.',
    features: ['Design responsive', 'Optimisé SEO', 'Admin simple', 'Ultra rapide'],
    examples: ['Artisan', 'Restaurant', 'Cabinet', 'Association'],
  },
  {
    icon: '⚙️', title: 'Applications Métier', price: 'À partir de 8 000€', color: '#10b981',
    intro: 'Logiciels sur-mesure pour automatiser et gagner du temps.',
    features: ['Adapté à VOS processus', 'Intégrations', 'Formation incluse', 'Support'],
    examples: ['Gestion devis', 'Suivi client', 'Planning', 'Stock'],
  },
  {
    icon: '🤖', title: 'IA & Automatisation', price: 'Sur devis', color: '#a855f7',
    intro: 'Intelligence artificielle locale, sans fuite de données.',
    features: ['IA chez VOUS', 'Données privées', 'Automatisations', 'Rapports auto'],
    examples: ['Chatbot', 'Tri documents', 'Génération', 'Assistant'],
  },
];

const steps = [
  { icon: '☕', title: 'On discute', desc: 'Appel 30 min pour comprendre votre besoin', time: 'Gratuit' },
  { icon: '📝', title: 'Je propose', desc: 'Devis clair avec planning et budget', time: '48-72h' },
  { icon: '🔨', title: 'Je construis', desc: 'Développement avec points réguliers', time: '4-12 sem.' },
  { icon: '🚀', title: 'C\'est live !', desc: 'Mise en prod, formation, support', time: 'Continu' },
];

const arkStats = [
  { val: '99.8', unit: '%', label: 'Disponibilité' },
  { val: '18', unit: 'mois', label: 'Production' },
  { val: '150', unit: '+', label: 'Utilisateurs' },
];

const servers = ref([
  { name: 'TheIsland', cpu: 45, ram: 68 },
  { name: 'Ragnarok', cpu: 52, ram: 71 },
  { name: 'Fjordur', cpu: 38, ram: 59 },
  { name: 'Aberration', cpu: 41, ram: 63 },
  { name: 'Scorched', cpu: 35, ram: 54 },
  { name: 'Extinction', cpu: 48, ram: 66 },
  { name: 'Genesis', cpu: 55, ram: 72 },
  { name: 'LostIsland', cpu: 42, ram: 61 },
  { name: 'Center', cpu: 39, ram: 57 },
]);

const aboutValues = [
  { icon: '🎯', title: 'Pragmatique', desc: 'Ce qui marche, pas ce qui est à la mode' },
  { icon: '💬', title: 'Accessible', desc: 'J\'explique sans jargon' },
  { icon: '🔐', title: 'Souverain', desc: 'Vos données en France' },
];

const techCats = [
  { icon: '🔧', name: 'Backend', desc: 'Le moteur invisible', techs: ['Symfony', 'PHP 8', 'PostgreSQL'] },
  { icon: '🎨', name: 'Frontend', desc: 'L\'expérience utilisateur', techs: ['Vue.js', 'Three.js', 'GSAP'] },
  { icon: '🤖', name: 'IA', desc: 'Intelligence locale', techs: ['Ollama', 'n8n', 'RAG'], highlight: ['Ollama'] },
  { icon: '🏠', name: 'Infra', desc: 'Hébergement souverain', techs: ['Docker', 'Linux', 'FR'], highlight: ['FR'] },
];

const universes = [
  { icon: '💊', path: '/matrix', color: '#00ff41' },
  { icon: '🌧️', path: '/blade-runner', color: '#f97316' },
  { icon: '🔥', path: '/dragon-ball-z', color: '#ff9800' },
  { icon: '💠', path: '/tron', color: '#00d4ff' },
  { icon: '🦾', path: '/iron-man', color: '#dc2626' },
];

// Methods
const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

const getParticleStyle = (n) => ({
  '--x': Math.random() * 100 + '%',
  '--y': Math.random() * 100 + '%',
  '--d': Math.random() * 5 + 's',
  '--s': 0.5 + Math.random() * 1,
});

// Lifecycle
let intervals = [];
onMounted(() => {
  intervals.push(setInterval(() => {
    currentBadge.value = (currentBadge.value + 1) % badgeTexts.length;
  }, 3000));
  
  intervals.push(setInterval(() => {
    servers.value = servers.value.map(s => ({
      ...s,
      cpu: Math.max(20, Math.min(80, s.cpu + (Math.random() - 0.5) * 8)),
      ram: Math.max(40, Math.min(85, s.ram + (Math.random() - 0.5) * 4)),
    }));
    players.value = Math.floor(40 + Math.random() * 30);
  }, 4000));
});

onUnmounted(() => intervals.forEach(clearInterval));
</script>

<style scoped>
/* ═══════════════════════════════════════════════════════════════════════════
   VARIABLES & BASE
   ═══════════════════════════════════════════════════════════════════════════ */
.home-page {
  --primary: #10b981;
  --primary-glow: rgba(16, 185, 129, 0.4);
  --primary-soft: rgba(16, 185, 129, 0.1);
  --text: #e5e5e5;
  --text-muted: rgba(229, 229, 229, 0.7);
  --text-soft: rgba(229, 229, 229, 0.5);
  --bg: #0a0a0f;
  --surface: #12121a;
  --border: rgba(255, 255, 255, 0.08);
  
  background: var(--bg);
  color: var(--text);
  min-height: 100vh;
}

.container { max-width: 1200px; margin: 0 auto; padding: 0 2rem; }
.section { padding: 6rem 0; position: relative; }
.accent { color: var(--primary); }

/* Skip Link */
.skip-link {
  position: absolute; top: -100px; left: 50%; transform: translateX(-50%);
  padding: 1rem 2rem; background: var(--primary); color: #000;
  border-radius: 0.5rem; z-index: 9999; text-decoration: none;
}
.skip-link:focus { top: 1rem; }

/* ═══════════════════════════════════════════════════════════════════════════
   HERO
   ═══════════════════════════════════════════════════════════════════════════ */
.hero {
  min-height: 100vh;
  display: flex;
  align-items: center;
  position: relative;
  overflow: hidden;
  padding: 6rem 0;
}

.hero-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.gradient-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(100px);
  opacity: 0.3;
  animation: drift 20s ease-in-out infinite;
}
.gradient-orb--1 { width: 600px; height: 600px; background: var(--primary); top: -200px; left: -200px; }
.gradient-orb--2 { width: 500px; height: 500px; background: #a855f7; bottom: -150px; right: -150px; animation-delay: -10s; }

@keyframes drift {
  0%, 100% { transform: translate(0, 0); }
  50% { transform: translate(40px, -40px); }
}

.grid-lines {
  position: absolute;
  inset: 0;
  background-image: 
    linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px);
  background-size: 80px 80px;
  mask-image: radial-gradient(ellipse 70% 70% at 50% 50%, black, transparent);
}

.particles {
  position: absolute;
  inset: 0;
}
.particle {
  position: absolute;
  width: 4px; height: 4px;
  background: var(--primary);
  border-radius: 50%;
  left: var(--x); top: var(--y);
  opacity: 0.3;
  animation: float calc(4s * var(--s)) ease-in-out infinite;
  animation-delay: var(--d);
}
@keyframes float {
  0%, 100% { transform: translateY(0) scale(1); opacity: 0.3; }
  50% { transform: translateY(-20px) scale(1.2); opacity: 0.6; }
}

.hero-grid {
  display: grid;
  grid-template-columns: 1fr 480px;
  gap: 4rem;
  align-items: center;
  position: relative;
  z-index: 1;
}

/* Hero Badge */
.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 1rem;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 2rem;
  margin-bottom: 2rem;
}
.badge-pulse {
  width: 8px; height: 8px;
  background: var(--primary);
  border-radius: 50%;
  animation: pulse 2s ease-in-out infinite;
}
@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.3); opacity: 0.5; }
}
.badge-text { font-size: 0.85rem; color: var(--text-muted); }

/* Hero Title */
.hero__title {
  font-size: clamp(2.2rem, 5vw, 3.5rem);
  font-weight: 700;
  line-height: 1.15;
  margin-bottom: 1.5rem;
}
.hero__title .highlight {
  color: var(--primary);
  position: relative;
}
.hero__title .highlight::after {
  content: '';
  position: absolute;
  bottom: 2px; left: 0;
  width: 100%; height: 3px;
  background: var(--primary);
  transform: scaleX(0);
  transform-origin: left;
  animation: underline 0.8s ease-out 0.5s forwards;
}
@keyframes underline { to { transform: scaleX(1); } }

.hero__subtitle {
  font-size: 1.1rem;
  color: var(--text-muted);
  line-height: 1.7;
  margin-bottom: 2rem;
  max-width: 480px;
}
.hero__subtitle strong { color: var(--text); }
.hero__subtitle em { color: var(--primary); font-style: normal; }

/* Value Pills */
.value-pills {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-bottom: 2rem;
}
.pill {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1rem;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 2rem;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}
.pill:hover, .pill.active {
  border-color: var(--primary);
  background: var(--primary-soft);
}
.pill-icon { font-size: 1.1rem; }
.pill-text { font-size: 0.85rem; color: var(--text); }
.pill-detail {
  position: absolute;
  top: 100%; left: 50%;
  transform: translateX(-50%);
  margin-top: 0.5rem;
  padding: 0.4rem 0.8rem;
  background: var(--surface);
  border: 1px solid var(--primary);
  border-radius: 0.5rem;
  font-size: 0.75rem;
  color: var(--primary);
  white-space: nowrap;
  z-index: 10;
}

.expand-enter-active, .expand-leave-active { transition: all 0.2s ease; }
.expand-enter-from, .expand-leave-to { opacity: 0; transform: translateX(-50%) translateY(-5px); }

/* Hero CTA */
.hero__cta {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.btn-primary {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  background: var(--primary);
  border: none;
  border-radius: 0.5rem;
  color: #000;
  font-weight: 600;
  font-size: 0.95rem;
  text-decoration: none;
  overflow: hidden;
  transition: all 0.3s ease;
}
.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 40px var(--primary-glow);
}
.btn-glow {
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
  transform: translateX(-100%);
}
.btn-primary:hover .btn-glow { animation: shimmer 0.6s forwards; }
@keyframes shimmer { to { transform: translateX(100%); } }

.btn-content { display: flex; align-items: center; gap: 0.5rem; position: relative; z-index: 1; }
.btn-arrow { transition: transform 0.3s ease; }
.btn-primary:hover .btn-arrow { transform: translateX(4px); }

.btn-ghost {
  padding: 1rem 1.5rem;
  background: transparent;
  border: 1px solid var(--border);
  border-radius: 0.5rem;
  color: var(--text);
  text-decoration: none;
  transition: all 0.3s ease;
}
.btn-ghost:hover { border-color: var(--primary); color: var(--primary); }

.btn-lg { padding: 1.25rem 2rem; font-size: 1.1rem; }

/* Code Window */
.hero__visual { position: relative; }

.code-window {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 25px 80px rgba(0,0,0,0.4);
}
.window-bar {
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  background: rgba(0,0,0,0.3);
  border-bottom: 1px solid var(--border);
}
.dots { display: flex; gap: 6px; }
.dots span { width: 12px; height: 12px; border-radius: 50%; }
.dots span:nth-child(1) { background: #ff5f56; }
.dots span:nth-child(2) { background: #ffbd2e; }
.dots span:nth-child(3) { background: #27ca40; }
.window-title { flex: 1; text-align: center; font-family: 'JetBrains Mono', monospace; font-size: 0.75rem; color: var(--text-soft); }

.window-body {
  padding: 1.5rem;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.85rem;
  line-height: 1.9;
}
.window-body code { display: block; }
.window-body .ln { color: var(--text-soft); user-select: none; display: inline-block; width: 24px; }
.window-body .cmt { color: #6a737d; }
.window-body .kw { color: #ff79c6; }
.window-body .var { color: #50fa7b; }
.window-body .prop { color: #8be9fd; }
.window-body .str { color: #f1fa8c; }
.window-body .fn { color: #bd93f9; }

.window-status {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 1rem;
  background: rgba(0,0,0,0.2);
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.65rem;
  color: var(--text-soft);
}
.status-dot { display: inline-block; width: 6px; height: 6px; background: var(--primary); border-radius: 50%; margin-right: 0.5rem; }

/* Floating Tech */
.floating-tech { position: absolute; inset: -30px; pointer-events: none; }
.tech-float {
  position: absolute;
  left: var(--x); top: var(--y);
  padding: 0.4rem 0.8rem;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 2rem;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.7rem;
  color: var(--primary);
  animation: floatTech 5s ease-in-out infinite;
  animation-delay: var(--d);
}
@keyframes floatTech { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-12px); } }

/* Scroll Hint */
.scroll-hint {
  position: absolute;
  bottom: 2rem; left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none;
  color: var(--text-soft);
  cursor: pointer;
  opacity: 0.6;
  transition: opacity 0.3s;
}
.scroll-hint:hover { opacity: 1; }
.scroll-hint span { font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.1em; }
.mouse { width: 22px; height: 36px; border: 2px solid currentColor; border-radius: 11px; position: relative; }
.wheel { position: absolute; top: 6px; left: 50%; width: 4px; height: 8px; background: currentColor; border-radius: 2px; transform: translateX(-50%); animation: scroll 1.5s ease-in-out infinite; }
@keyframes scroll { 0%, 100% { transform: translateX(-50%) translateY(0); opacity: 1; } 50% { transform: translateX(-50%) translateY(8px); opacity: 0; } }

/* ═══════════════════════════════════════════════════════════════════════════
   SECTION HEADERS
   ═══════════════════════════════════════════════════════════════════════════ */
.section-header { margin-bottom: 3rem; }
.section-header.center { text-align: center; }
.section-tag {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.8rem;
  color: var(--text-soft);
  margin-bottom: 0.75rem;
}
.section-tag span:first-child {
  font-family: 'JetBrains Mono', monospace;
  color: var(--primary);
  font-weight: 700;
}
.section-header h2 {
  font-size: clamp(1.75rem, 4vw, 2.5rem);
  font-weight: 700;
  line-height: 1.2;
}
.section-header p {
  font-size: 1rem;
  color: var(--text-muted);
  margin-top: 0.75rem;
  max-width: 500px;
}
.section-header.center p { margin: 0.75rem auto 0; }

/* ═══════════════════════════════════════════════════════════════════════════
   SERVICES
   ═══════════════════════════════════════════════════════════════════════════ */
.services-section {
  background: linear-gradient(180deg, transparent, var(--surface) 15%, var(--surface) 85%, transparent);
}

.services-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

.service-card {
  position: relative;
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 1rem;
  padding: 2rem;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
.service-card:hover {
  border-color: var(--accent);
  transform: translateY(-4px);
}
.service-card.expanded {
  grid-column: 1 / -1;
  background: var(--surface);
}

.card-glow {
  position: absolute;
  inset: -1px;
  background: linear-gradient(135deg, var(--accent), transparent 60%);
  border-radius: 1rem;
  opacity: 0;
  z-index: -1;
  transition: opacity 0.3s;
}
.service-card:hover .card-glow { opacity: 0.08; }

.card-head {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1rem;
}
.card-icon {
  font-size: 2rem;
  width: 56px; height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--primary-soft);
  border-radius: 0.75rem;
}
.card-meta { flex: 1; }
.card-meta h3 { font-size: 1.2rem; font-weight: 600; margin-bottom: 0.25rem; }
.card-price { font-family: 'JetBrains Mono', monospace; font-size: 0.75rem; color: var(--accent); }
.card-toggle {
  width: 28px; height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 50%;
  font-size: 1.2rem;
  color: var(--text-soft);
  transition: all 0.3s;
}
.service-card:hover .card-toggle { border-color: var(--accent); color: var(--accent); }

.card-intro { font-size: 0.9rem; color: var(--text-muted); line-height: 1.6; }

.card-details {
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid var(--border);
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}
.details-col h4 { font-size: 0.85rem; margin-bottom: 1rem; color: var(--text); }
.details-col ul { list-style: none; padding: 0; margin: 0; }
.details-col li { padding: 0.4rem 0; font-size: 0.85rem; color: var(--text-muted); padding-left: 1.5rem; position: relative; }
.details-col li::before { content: '→'; position: absolute; left: 0; color: var(--primary); }
.tags { display: flex; flex-wrap: wrap; gap: 0.5rem; }
.tags span { padding: 0.35rem 0.75rem; background: var(--primary-soft); border-radius: 2rem; font-size: 0.75rem; color: var(--primary); }

.slide-enter-active, .slide-leave-active { transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
.slide-enter-from, .slide-leave-to { opacity: 0; max-height: 0; margin-top: 0; padding-top: 0; }

/* ═══════════════════════════════════════════════════════════════════════════
   PROCESS TIMELINE
   ═══════════════════════════════════════════════════════════════════════════ */
.timeline { position: relative; margin-top: 4rem; }
.timeline-line {
  position: absolute;
  top: 50px; left: 0; right: 0;
  height: 2px;
  background: var(--border);
}
.line-progress { height: 100%; background: var(--primary); transition: width 0.5s ease; }

.timeline-steps { display: flex; justify-content: space-between; }
.step { flex: 1; text-align: center; opacity: 0.4; transition: all 0.3s; }
.step.active { opacity: 1; }
.step.current { transform: scale(1.05); }

.step-marker {
  width: 70px; height: 70px;
  margin: 0 auto 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--surface);
  border: 2px solid var(--border);
  border-radius: 50%;
  font-family: 'JetBrains Mono', monospace;
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-soft);
  transition: all 0.3s;
}
.step.active .step-marker { border-color: var(--primary); color: var(--primary); background: var(--primary-soft); }

.step-body { padding: 0 0.5rem; }
.step-icon { font-size: 2rem; display: block; margin-bottom: 0.5rem; }
.step-body h4 { font-size: 1rem; margin-bottom: 0.5rem; }
.step-body p { font-size: 0.8rem; color: var(--text-muted); line-height: 1.5; margin-bottom: 0.5rem; }
.step-time { font-family: 'JetBrains Mono', monospace; font-size: 0.7rem; color: var(--primary); padding: 0.2rem 0.5rem; background: var(--primary-soft); border-radius: 0.25rem; }

/* ═══════════════════════════════════════════════════════════════════════════
   CASE STUDY
   ═══════════════════════════════════════════════════════════════════════════ */
.case-section { background: var(--surface); }

.case-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
}

.case-badge {
  display: inline-block;
  padding: 0.5rem 1rem;
  background: rgba(249, 115, 22, 0.1);
  border: 1px solid rgba(249, 115, 22, 0.3);
  border-radius: 2rem;
  font-size: 0.75rem;
  color: #f97316;
  margin-bottom: 1rem;
}

.case-content h2 { font-size: clamp(1.75rem, 3vw, 2.5rem); font-weight: 700; margin-bottom: 0.5rem; }
.case-sub { font-size: 1rem; color: var(--text-muted); margin-bottom: 1.5rem; }
.case-content > p { font-size: 1rem; color: var(--text-muted); line-height: 1.7; margin-bottom: 1.5rem; }

.stats-row { display: flex; gap: 1.5rem; margin-bottom: 1.5rem; }
.stat { padding: 1rem; background: var(--bg); border: 1px solid var(--border); border-radius: 0.75rem; text-align: center; }
.stat-val { font-family: 'JetBrains Mono', monospace; font-size: 1.75rem; font-weight: 700; color: var(--primary); }
.stat-val small { font-size: 0.9rem; color: var(--text-soft); margin-left: 2px; }
.stat-label { display: block; font-size: 0.7rem; color: var(--text-soft); margin-top: 0.25rem; }

.case-insight {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background: var(--primary-soft);
  border-left: 3px solid var(--primary);
  border-radius: 0 0.5rem 0.5rem 0;
  margin-bottom: 1.5rem;
}
.case-insight span { font-size: 1.25rem; }
.case-insight p { font-size: 0.9rem; color: var(--text); line-height: 1.5; margin: 0; }

.link-arrow {
  font-size: 0.9rem;
  color: var(--primary);
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  transition: gap 0.3s;
}
.link-arrow:hover { gap: 0.75rem; }

/* Dashboard */
.dashboard {
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 1rem;
  overflow: hidden;
}
.dash-head {
  display: flex;
  justify-content: space-between;
  padding: 1rem;
  background: rgba(0,0,0,0.3);
  border-bottom: 1px solid var(--border);
  font-size: 0.85rem;
  font-weight: 600;
}
.live { display: flex; align-items: center; gap: 0.5rem; font-family: 'JetBrains Mono', monospace; font-size: 0.7rem; color: #22c55e; }
.live .dot { width: 8px; height: 8px; background: currentColor; border-radius: 50%; animation: livePulse 1.5s ease-in-out infinite; }
@keyframes livePulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }

.servers { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.5rem; padding: 1rem; }
.srv {
  padding: 0.75rem;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 0.5rem;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  transition: all 0.3s;
}
.srv.hover { border-color: var(--primary); background: var(--primary-soft); }
.srv-name { font-size: 0.75rem; color: var(--text-muted); }
.srv-dot { width: 8px; height: 8px; background: #22c55e; border-radius: 50%; box-shadow: 0 0 8px #22c55e; }
.srv-metrics { width: 100%; margin-top: 0.5rem; padding-top: 0.5rem; border-top: 1px solid var(--border); }
.metric { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.4rem; font-size: 0.6rem; }
.metric span:first-child { width: 28px; color: var(--text-soft); }
.metric span:last-child { width: 32px; text-align: right; font-family: 'JetBrains Mono', monospace; color: var(--text-muted); }
.metric .bar { flex: 1; height: 4px; background: var(--border); border-radius: 2px; overflow: hidden; }
.metric .bar div { height: 100%; background: var(--primary); transition: width 0.5s; }

.dash-foot {
  display: flex;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  background: rgba(0,0,0,0.2);
  font-size: 0.7rem;
  color: var(--text-soft);
}
.dash-foot span:last-child { color: var(--primary); }

/* ═══════════════════════════════════════════════════════════════════════════
   ABOUT
   ═══════════════════════════════════════════════════════════════════════════ */
.about-grid {
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 4rem;
  align-items: center;
}

.avatar {
  position: relative;
  width: 180px; height: 180px;
  margin: 0 auto 2rem;
}
.avatar-ring {
  position: absolute;
  inset: 0;
  border: 2px solid var(--primary);
  border-radius: 50%;
  animation: spin 20s linear infinite;
}
.avatar-ring::before {
  content: '';
  position: absolute;
  top: -4px; left: 50%;
  width: 8px; height: 8px;
  background: var(--primary);
  border-radius: 50%;
  transform: translateX(-50%);
}
@keyframes spin { to { transform: rotate(360deg); } }
.avatar-emoji {
  position: absolute;
  inset: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 4rem;
  background: var(--surface);
  border-radius: 50%;
}

.id-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 0.75rem;
  padding: 1.5rem;
}
.id-row {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-bottom: 1px solid var(--border);
  font-size: 0.85rem;
}
.id-row:last-child { border-bottom: none; }
.id-row span:first-child { font-family: 'JetBrains Mono', monospace; font-size: 0.65rem; color: var(--text-soft); }
.id-row span:last-child { color: var(--text); }
.id-row .accent { color: var(--primary); }

.about-content p { font-size: 1rem; color: var(--text-muted); line-height: 1.7; margin-bottom: 1rem; }
.about-content p strong { color: var(--text); }
.about-content p em { color: var(--primary); font-style: normal; }

.values { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin: 2rem 0; }
.value-card {
  padding: 1.25rem;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 0.75rem;
  transition: all 0.3s;
}
.value-card:hover { border-color: var(--primary); transform: translateY(-4px); }
.v-icon { font-size: 1.5rem; display: block; margin-bottom: 0.75rem; }
.value-card h4 { font-size: 0.95rem; margin-bottom: 0.5rem; }
.value-card p { font-size: 0.8rem; color: var(--text-muted); line-height: 1.4; }

/* ═══════════════════════════════════════════════════════════════════════════
   TECH
   ═══════════════════════════════════════════════════════════════════════════ */
.tech-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
}
.tech-card {
  padding: 1.5rem;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 0.75rem;
  text-align: center;
}
.tech-card h4 { font-size: 0.95rem; margin-bottom: 0.5rem; }
.tech-card > p { font-size: 0.75rem; color: var(--text-soft); margin-bottom: 1rem; }
.tech-tags { display: flex; flex-direction: column; gap: 0.5rem; }
.tech-tags span {
  padding: 0.4rem 0.75rem;
  background: var(--bg);
  border-radius: 0.5rem;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.75rem;
  color: var(--text-muted);
}
.tech-tags span.highlight { background: var(--primary-soft); color: var(--primary); border: 1px solid rgba(16,185,129,0.2); }

/* ═══════════════════════════════════════════════════════════════════════════
   MULTIVERS
   ═══════════════════════════════════════════════════════════════════════════ */
.multivers-section {
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, rgba(168, 85, 247, 0.05), rgba(99, 102, 241, 0.05));
  border-top: 1px solid rgba(168, 85, 247, 0.2);
  border-bottom: 1px solid rgba(168, 85, 247, 0.2);
}

.portal-rings {
  position: absolute;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  width: 500px; height: 500px;
  pointer-events: none;
}
.ring {
  position: absolute;
  inset: 0;
  border: 1px solid rgba(168, 85, 247, 0.1);
  border-radius: 50%;
  animation: spinSlow 30s linear infinite;
}
.ring:nth-child(2) { inset: 50px; animation-duration: 25s; animation-direction: reverse; }
.ring:nth-child(3) { inset: 100px; animation-duration: 20s; }
@keyframes spinSlow { to { transform: rotate(360deg); } }

.multivers-content {
  position: relative;
  text-align: center;
  max-width: 550px;
  margin: 0 auto;
}

.easter-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: rgba(168, 85, 247, 0.1);
  border: 1px solid rgba(168, 85, 247, 0.3);
  border-radius: 2rem;
  font-size: 0.75rem;
  color: #a855f7;
  margin-bottom: 1.5rem;
}

.multivers-content h2 { font-size: clamp(1.75rem, 4vw, 2.5rem); margin-bottom: 1rem; }
.multivers-content > p { font-size: 1rem; color: var(--text-muted); margin-bottom: 2rem; }

.universe-row {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
}
.universe-orb {
  width: 60px; height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0,0,0,0.4);
  border: 2px solid var(--c);
  border-radius: 50%;
  font-size: 1.5rem;
  text-decoration: none;
  animation: orb-float 3s ease-in-out infinite;
  animation-delay: var(--d);
  transition: all 0.3s;
}
.universe-orb:hover {
  transform: scale(1.2);
  box-shadow: 0 0 30px var(--c);
}
@keyframes orb-float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
.more { font-family: 'JetBrains Mono', monospace; font-size: 0.85rem; color: var(--text-soft); }

.btn-portal {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 2rem;
  background: linear-gradient(135deg, #a855f7, #6366f1);
  border-radius: 0.5rem;
  color: #fff;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s;
}
.btn-portal:hover { transform: translateY(-2px); box-shadow: 0 10px 40px rgba(168, 85, 247, 0.3); }
.portal-spin { animation: spin 3s linear infinite; }

/* ═══════════════════════════════════════════════════════════════════════════
   FINAL CTA
   ═══════════════════════════════════════════════════════════════════════════ */
.final-section { padding: 8rem 0; }

.final-card {
  max-width: 650px;
  margin: 0 auto;
  padding: 4rem;
  background: var(--surface);
  border: 1px solid var(--primary);
  border-radius: 1.5rem;
  text-align: center;
  box-shadow: 0 0 80px var(--primary-glow);
}
.final-card h2 { font-size: clamp(1.75rem, 4vw, 2.5rem); margin-bottom: 1rem; }
.final-card > p { font-size: 1rem; color: var(--text-muted); margin-bottom: 2rem; line-height: 1.6; }

.trust {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-top: 2rem;
  font-size: 0.85rem;
  color: var(--text-soft);
}

/* ═══════════════════════════════════════════════════════════════════════════
   RESPONSIVE
   ═══════════════════════════════════════════════════════════════════════════ */
@media (max-width: 1024px) {
  .hero-grid { grid-template-columns: 1fr; gap: 3rem; }
  .hero__visual { max-width: 500px; margin: 0 auto; }
  .services-grid { grid-template-columns: 1fr; }
  .service-card.expanded { grid-column: span 1; }
  .card-details { grid-template-columns: 1fr; }
  .case-grid { grid-template-columns: 1fr; gap: 3rem; }
  .case-visual { order: -1; }
  .about-grid { grid-template-columns: 1fr; gap: 3rem; }
  .tech-grid { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 768px) {
  .container { padding: 0 1rem; }
  .section { padding: 4rem 0; }
  .value-pills { flex-direction: column; }
  .timeline-steps { flex-direction: column; gap: 2rem; }
  .timeline-line { display: none; }
  .step { opacity: 1; }
  .stats-row { flex-wrap: wrap; }
  .stat { flex: 1 1 45%; }
  .servers { grid-template-columns: repeat(2, 1fr); }
  .values { grid-template-columns: 1fr; }
  .tech-grid { grid-template-columns: 1fr; }
  .trust { flex-direction: column; gap: 0.5rem; }
  .final-card { padding: 2rem; }
}

/* ═══════════════════════════════════════════════════════════════════════════
   REDUCED MOTION
   ═══════════════════════════════════════════════════════════════════════════ */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
</style>
