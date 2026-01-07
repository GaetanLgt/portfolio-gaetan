<template>
  <div class="tower-page">
    <!-- AMBIENT BACKGROUND : Skyline + Tower -->
    <div class="tower-bg" aria-hidden="true">
      <div class="city-grid"></div>
      <div class="tower-silhouette"></div>
      <div class="arc-reactor-glow"></div>
      <div class="floating-data">
        <span class="data data--1">AGENTS: ONLINE</span>
        <span class="data data--2">UPTIME: 99.8%</span>
        <span class="data data--3">GL_TOWER_v2.0</span>
      </div>
    </div>

    <!-- HERO : GL Tower -->
    <section id="main-content" class="tower-hero" aria-labelledby="hero-title">
      <div class="container">
        <div class="tower-badge">
          <div class="arc-reactor">
            <div class="reactor-ring reactor-ring--1"></div>
            <div class="reactor-ring reactor-ring--2"></div>
            <div class="reactor-core">GL</div>
          </div>
        </div>

        <h1 id="hero-title" class="hero-title">
          <span class="title-pre">BIENVENUE DANS</span>
          <span class="title-main">GL TOWER</span>
          <span class="title-sub">QG des Agents IA • GL Digital Lab</span>
        </h1>

        <p class="hero-intro">
          Chaque niveau de la tour est couvert par un <strong>agent IA spécialisé</strong>. 
          Infrastructure humaine augmentée. Automatisation intelligente. 
          <em>Zéro dépendance cloud US.</em>
        </p>

        <div class="tower-stats">
          <div class="stat">
            <span class="stat-value">{{ allAgents.length }}</span>
            <span class="stat-label">Agents Actifs</span>
          </div>
          <div class="stat">
            <span class="stat-value">24/7</span>
            <span class="stat-label">Couverture</span>
          </div>
          <div class="stat">
            <span class="stat-value">100%</span>
            <span class="stat-label">Souverain</span>
          </div>
        </div>

        <!-- Quick Access Links -->
        <div class="hero-links">
          <router-link to="/carte-holistique" class="hero-link hero-link--map">
            <span class="link-icon">🗺️</span>
            <span class="link-text">Carte Holistique</span>
            <span class="link-desc">Vue d'ensemble interactive</span>
          </router-link>
          <router-link to="/creations" class="hero-link hero-link--gallery">
            <span class="link-icon">🎨</span>
            <span class="link-text">Galerie Créations</span>
            <span class="link-desc">62 œuvres numériques</span>
          </router-link>
          <router-link to="/multivers" class="hero-link hero-link--multivers">
            <span class="link-icon">🌌</span>
            <span class="link-text">Multivers</span>
            <span class="link-desc">21 dimensions parallèles</span>
          </router-link>
          <router-link to="/construct" class="hero-link hero-link--construct">
            <span class="link-icon">🕳️</span>
            <span class="link-text">The Construct</span>
            <span class="link-desc">Hub Admin Matrix</span>
          </router-link>
          <router-link to="/services" class="hero-link">
            <span class="link-icon">⚡</span>
            <span class="link-text">Services</span>
            <span class="link-desc">Nos offres</span>
          </router-link>
          <router-link to="/contact" class="hero-link hero-link--cta">
            <span class="link-icon">📞</span>
            <span class="link-text">Contact</span>
            <span class="link-desc">Réserver un audit</span>
          </router-link>
        </div>
      </div>
    </section>

    <!-- TOWER VISUALIZATION : Vue latérale de la tour -->
    <section class="tower-section" aria-labelledby="tower-title">
      <div class="container">
        <div class="section-header">
          <h2 id="tower-title">
            <span class="header-icon">🏢</span>
            Architecture de la Tour
          </h2>
          <p>Chaque niveau = un domaine couvert par un agent IA</p>
        </div>

        <div class="tower-structure">
          <!-- Penthouse -->
          <div class="tower-level tower-level--penthouse">
            <div class="level-indicator">
              <span class="level-num">⬡</span>
              <span class="level-name">PENTHOUSE</span>
            </div>
            <div class="level-content">
              <div class="agent-card agent-card--jarvis">
                <div class="agent-avatar">🎯</div>
                <div class="agent-info">
                  <h3>J.A.R.V.I.S.</h3>
                  <span class="agent-role">Coordination Centrale</span>
                  <p>Orchestration de tous les agents. Décisions stratégiques. Interface humain-IA.</p>
                  <div class="agent-status">
                    <span class="status-dot status-dot--online"></span>
                    <span>ONLINE</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Autres niveaux -->
          <div 
            v-for="(agent, index) in agents" 
            :key="agent.id"
            class="tower-level"
            :class="'tower-level--' + agent.id"
            :style="{ '--agent-color': agent.color }"
          >
            <div class="level-indicator">
              <span class="level-num">{{ agents.length - index }}</span>
              <span class="level-name">NIVEAU {{ agents.length - index }}</span>
            </div>
            <div class="level-content">
              <div class="agent-card">
                <div class="agent-avatar">{{ agent.icon }}</div>
                <div class="agent-info">
                  <h3>{{ agent.name }}</h3>
                  <span class="agent-role">{{ agent.role }}</span>
                  <p>{{ agent.description }}</p>
                  <div class="agent-tech">
                    <span v-for="tech in agent.tech" :key="tech">{{ tech }}</span>
                  </div>
                  <div class="agent-status">
                    <span class="status-dot" :class="'status-dot--' + agent.status"></span>
                    <span>{{ agent.status.toUpperCase() }}</span>
                  </div>
                </div>
                <div class="agent-metrics">
                  <div class="metric">
                    <span class="metric-value">{{ agent.metrics.tasks }}</span>
                    <span class="metric-label">Tasks/jour</span>
                  </div>
                  <div class="metric">
                    <span class="metric-value">{{ agent.metrics.uptime }}</span>
                    <span class="metric-label">Uptime</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Lobby -->
          <div class="tower-level tower-level--lobby">
            <div class="level-indicator">
              <span class="level-num">0</span>
              <span class="level-name">LOBBY</span>
            </div>
            <div class="level-content">
              <div class="lobby-card">
                <span class="lobby-icon">🚪</span>
                <div class="lobby-info">
                  <h3>Accueil Visiteurs</h3>
                  <p>Point d'entrée de GL Tower. Découvrez nos services et planifiez un audit.</p>
                  <div class="lobby-actions">
                    <router-link to="/services" class="lobby-btn">Services</router-link>
                    <router-link to="/contact" class="lobby-btn lobby-btn--primary">Réserver un Audit</router-link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Séparateur Sous-sols -->
          <div class="tower-separator">
            <span class="separator-line"></span>
            <span class="separator-text">🔽 DEV LAB - SOUS-SOLS 🔽</span>
            <span class="separator-line"></span>
          </div>

          <!-- Dev Lab (Sous-sols) -->
          <div 
            v-for="(agent, index) in devLabAgents" 
            :key="agent.id"
            class="tower-level tower-level--basement"
            :class="'tower-level--' + agent.id"
            :style="{ '--agent-color': agent.color }"
          >
            <div class="level-indicator level-indicator--basement">
              <span class="level-num">{{ agent.level.split(' ')[0] }}</span>
              <span class="level-name">{{ agent.level.split(' ').slice(1).join(' ') }}</span>
            </div>
            <div class="level-content">
              <div class="agent-card">
                <div class="agent-avatar">{{ agent.icon }}</div>
                <div class="agent-info">
                  <h3>{{ agent.name }}</h3>
                  <span class="agent-role">{{ agent.role }}</span>
                  <p>{{ agent.description }}</p>
                  <div class="agent-tech">
                    <span v-for="tech in agent.tech" :key="tech">{{ tech }}</span>
                  </div>
                  <div class="agent-status">
                    <span class="status-dot" :class="'status-dot--' + agent.status"></span>
                    <span>{{ agent.status.toUpperCase() }}</span>
                  </div>
                </div>
                <div class="agent-metrics">
                  <div class="metric">
                    <span class="metric-value">{{ agent.metrics.tasks }}</span>
                    <span class="metric-label">Tasks/jour</span>
                  </div>
                  <div class="metric">
                    <span class="metric-value">{{ agent.metrics.uptime }}</span>
                    <span class="metric-label">Uptime</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Séparateur Back Office -->
          <div class="tower-separator tower-separator--office">
            <span class="separator-line"></span>
            <span class="separator-text">💼 BACK OFFICE 💼</span>
            <span class="separator-line"></span>
          </div>

          <!-- Back Office -->
          <div 
            v-for="agent in backOfficeAgents" 
            :key="agent.id"
            class="tower-level tower-level--office"
            :class="'tower-level--' + agent.id"
            :style="{ '--agent-color': agent.color }"
          >
            <div class="level-indicator level-indicator--office">
              <span class="level-num">💰</span>
              <span class="level-name">{{ agent.level }}</span>
            </div>
            <div class="level-content">
              <div class="agent-card">
                <div class="agent-avatar">{{ agent.icon }}</div>
                <div class="agent-info">
                  <h3>{{ agent.name }}</h3>
                  <span class="agent-role">{{ agent.role }}</span>
                  <p>{{ agent.description }}</p>
                  <div class="agent-tech">
                    <span v-for="tech in agent.tech" :key="tech">{{ tech }}</span>
                  </div>
                  <div class="agent-status">
                    <span class="status-dot" :class="'status-dot--' + agent.status"></span>
                    <span>{{ agent.status.toUpperCase() }}</span>
                  </div>
                </div>
                <div class="agent-metrics">
                  <div class="metric">
                    <span class="metric-value">{{ agent.metrics.tasks }}</span>
                    <span class="metric-label">Tasks/jour</span>
                  </div>
                  <div class="metric">
                    <span class="metric-value">{{ agent.metrics.uptime }}</span>
                    <span class="metric-label">Uptime</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- AGENTS GRID : Vue détaillée -->
    <section class="agents-section" aria-labelledby="agents-title">
      <div class="container">
        <div class="section-header section-header--alt">
          <h2 id="agents-title">
            <span class="header-icon">🤖</span>
            L'Équipe des Agents
          </h2>
          <p>Chaque agent couvre un domaine critique de l'infrastructure</p>
        </div>

        <div class="agents-grid">
          <div 
            v-for="agent in allAgents" 
            :key="agent.id"
            class="agent-tile"
            :style="{ '--color': agent.color }"
          >
            <div class="tile-glow"></div>
            <div class="tile-header">
              <span class="tile-icon">{{ agent.icon }}</span>
              <div class="tile-status">
                <span class="status-dot" :class="'status-dot--' + agent.status"></span>
              </div>
            </div>
            <h4>{{ agent.name }}</h4>
            <span class="tile-role">{{ agent.role }}</span>
            <p>{{ agent.shortDesc }}</p>
            <div class="tile-tech">
              <span v-for="tech in agent.tech.slice(0, 3)" :key="tech">{{ tech }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- COVERAGE MAP : Domaines couverts -->
    <section class="coverage-section" aria-labelledby="coverage-title">
      <div class="container">
        <div class="section-header">
          <h2 id="coverage-title">
            <span class="header-icon">🛡️</span>
            Couverture Complète
          </h2>
          <p>Tous les niveaux de votre infrastructure sont couverts</p>
        </div>

        <div class="coverage-grid">
          <div class="coverage-item" v-for="domain in domains" :key="domain.name">
            <span class="coverage-icon">{{ domain.icon }}</span>
            <h4>{{ domain.name }}</h4>
            <p>{{ domain.desc }}</p>
            <span class="coverage-agent">Agent: {{ domain.agent }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- TERMINAL STATUS -->
    <section class="terminal-section">
      <div class="container">
        <div class="terminal-frame">
          <div class="terminal-header">
            <span class="terminal-dot terminal-dot--red"></span>
            <span class="terminal-dot terminal-dot--yellow"></span>
            <span class="terminal-dot terminal-dot--green"></span>
            <span class="terminal-title">GL_TOWER_CONTROL</span>
          </div>
          <div class="terminal-body">
            <p class="terminal-line"><span class="t-prompt">jarvis@gl-tower:~$</span> status --all</p>
            <p class="terminal-line"><span class="t-info">[INFO]</span> Scanning tower levels...</p>
            <p class="terminal-line" v-for="agent in allAgents" :key="agent.id + '-status'">
              <span class="t-prompt">[{{ agent.name.toUpperCase() }}]</span> 
              <span :class="agent.status === 'online' ? 't-success' : 't-warning'">{{ agent.status.toUpperCase() }}</span>
              <span class="t-dim"> - {{ agent.role }}</span>
            </p>
            <p class="terminal-line"><span class="t-info">[INFO]</span> All agents operational.</p>
            <p class="terminal-line"><span class="t-prompt">jarvis@gl-tower:~$</span> <span class="cursor">_</span></p>
          </div>
        </div>
      </div>
    </section>

    <!-- QUICK ACCESS -->
    <section class="quick-section" aria-labelledby="quick-title">
      <div class="container">
        <div class="section-header">
          <h2 id="quick-title">
            <span class="header-icon">⚡</span>
            Accès Rapide
          </h2>
        </div>

        <div class="quick-grid">
          <router-link to="/services" class="quick-card">
            <span class="quick-icon">🛠️</span>
            <h4>Services</h4>
            <p>Solutions sur-mesure</p>
          </router-link>
          <router-link to="/projets" class="quick-card">
            <span class="quick-icon">📁</span>
            <h4>Projets</h4>
            <p>Case studies</p>
          </router-link>
          <router-link to="/stack-ia" class="quick-card">
            <span class="quick-icon">🧠</span>
            <h4>Stack IA</h4>
            <p>Infrastructure locale</p>
          </router-link>
          <router-link to="/contact" class="quick-card quick-card--primary">
            <span class="quick-icon">📞</span>
            <h4>Contact</h4>
            <p>Réserver un audit</p>
          </router-link>
        </div>
      </div>
    </section>

    <!-- MULTIVERS TEASER -->
    <section class="multivers-teaser" aria-labelledby="multivers-title">
      <div class="container">
        <div class="teaser-content">
          <h2 id="multivers-title">🌌 Envie d'explorer d'autres dimensions ?</h2>
          <p>Ce portfolio existe dans <strong>20 univers parallèles</strong>. Matrix, Blade Runner, Tron...</p>
          <div class="teaser-scroll">
            <router-link 
              v-for="u in universePreview" 
              :key="u.path" 
              :to="u.path"
              class="teaser-card"
              :style="{ '--color': u.color }"
            >
              <span>{{ u.icon }}</span>
              <span>{{ u.name }}</span>
            </router-link>
          </div>
          <router-link to="/multivers" class="teaser-cta">
            🌌 Voir les 20 univers →
          </router-link>
        </div>
      </div>
    </section>

    <!-- FOOTER CTA -->
    <section class="tower-footer">
      <div class="container">
        <div class="footer-content">
          <p class="footer-quote">
            « L'avenir, c'est une infrastructure humaine augmentée par des agents IA souverains. »
          </p>
          <router-link to="/contact" class="footer-cta">
            <span class="cta-icon">🎯</span>
            Planifier un Audit avec JARVIS
          </router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
// Agents IA de GL Tower (du haut vers le bas)
const agents = [
  {
    id: 'edith',
    name: 'E.D.I.T.H.',
    role: 'Sécurité & Audit',
    icon: '🛡️',
    color: '#ef4444',
    description: 'Scanning de vulnérabilités, audits automatisés, alertes sécurité. Protection proactive.',
    shortDesc: 'Audits sécurité automatisés',
    tech: ['OWASP', 'Nuclei', 'Trivy'],
    status: 'online',
    metrics: { tasks: '150+', uptime: '99.9%' }
  },
  {
    id: 'veronica',
    name: 'V.E.R.O.N.I.C.A.',
    role: 'DevOps & Déploiement',
    icon: '🚀',
    color: '#8b5cf6',
    description: 'CI/CD pipelines, déploiements automatisés, rollback intelligent. Infrastructure as Code.',
    shortDesc: 'Pipelines CI/CD automatisés',
    tech: ['GitHub Actions', 'Docker', 'Ansible'],
    status: 'online',
    metrics: { tasks: '80+', uptime: '99.8%' }
  },
  {
    id: 'ultron',
    name: 'U.L.T.R.O.N.',
    role: 'Monitoring & Alertes',
    icon: '📊',
    color: '#f59e0b',
    description: 'Surveillance 24/7, métriques temps réel, alertes intelligentes. Détection d\'anomalies.',
    shortDesc: 'Monitoring infrastructure',
    tech: ['Prometheus', 'Grafana', 'n8n'],
    status: 'online',
    metrics: { tasks: '500+', uptime: '99.9%' }
  },
  {
    id: 'vision',
    name: 'V.I.S.I.O.N.',
    role: 'Content & Communication',
    icon: '📢',
    color: '#06b6d4',
    description: 'Génération de contenu, posts Discord, newsletters automatisées. Voix de la marque.',
    shortDesc: 'Contenu automatisé',
    tech: ['Ollama', 'Discord.js', 'Markdown'],
    status: 'online',
    metrics: { tasks: '200+', uptime: '99.5%' }
  },
  {
    id: 'karen',
    name: 'K.A.R.E.N.',
    role: 'Community Management',
    icon: '👥',
    color: '#ec4899',
    description: 'Modération Discord, gestion des tickets, onboarding membres. Expérience communauté.',
    shortDesc: 'Modération communauté',
    tech: ['Discord Bot', 'Webhooks', 'n8n'],
    status: 'online',
    metrics: { tasks: '300+', uptime: '99.7%' }
  },
  {
    id: 'friday',
    name: 'F.R.I.D.A.Y.',
    role: 'Support Client',
    icon: '🎧',
    color: '#10b981',
    description: 'Réponses automatisées, triage des demandes, FAQ intelligente. Premier contact client.',
    shortDesc: 'Support automatisé',
    tech: ['RAG', 'ChromaDB', 'OpenWebUI'],
    status: 'online',
    metrics: { tasks: '400+', uptime: '99.8%' }
  }
];

// Agents Dev Lab (Sous-sols)
const devLabAgents = [
  {
    id: 'tadashi',
    name: 'T.A.D.A.S.H.I.',
    role: 'Frontend Engineering',
    icon: '🦾',
    color: '#3b82f6',
    description: 'Architecture composants Vue.js, expériences 3D Three.js, animations GSAP.',
    shortDesc: 'Frontend Vue/Three.js',
    tech: ['Vue 3', 'Three.js', 'TypeScript', 'GSAP'],
    status: 'online',
    metrics: { tasks: '120+', uptime: '99.8%' },
    level: 'SS-1 FORGE'
  },
  {
    id: 'jocasta',
    name: 'J.O.C.A.S.T.A.',
    role: 'Backend Architecture',
    icon: '⚙️',
    color: '#8b5cf6',
    description: 'Architecture Symfony, APIs REST/GraphQL, logique métier, sécurité.',
    shortDesc: 'Backend Symfony/API',
    tech: ['Symfony 8', 'PHP 8.3+', 'API Platform'],
    status: 'online',
    metrics: { tasks: '100+', uptime: '99.9%' },
    level: 'SS-2 ARMURERIE'
  },
  {
    id: 'cerebro',
    name: 'C.E.R.E.B.R.O.',
    role: 'Testing & QA',
    icon: '🔬',
    color: '#ef4444',
    description: 'Tests unitaires, intégration, E2E, audits Lighthouse, couverture code.',
    shortDesc: 'Tests automatisés',
    tech: ['PHPUnit', 'Vitest', 'Playwright'],
    status: 'online',
    metrics: { tasks: '250+', uptime: '99.7%' },
    level: 'SS-3 LABO'
  },
  {
    id: 'zola',
    name: 'Z.O.L.A.',
    role: 'Data Architecture',
    icon: '🗄️',
    color: '#f59e0b',
    description: 'Schémas DB, optimisation requêtes, migrations, backups, RAG embeddings.',
    shortDesc: 'Architecture données',
    tech: ['PostgreSQL', 'Redis', 'ChromaDB'],
    status: 'online',
    metrics: { tasks: '80+', uptime: '99.9%' },
    level: 'SS-4 BUNKER'
  },
  {
    id: 'dume',
    name: 'D.U.M-E',
    role: 'Build & Tooling',
    icon: '🛠️',
    color: '#6b7280',
    description: 'Configuration Vite/Webpack, Docker, gestion dépendances, scripts CI.',
    shortDesc: 'Build & DevTools',
    tech: ['Vite', 'Docker', 'npm', 'Composer'],
    status: 'online',
    metrics: { tasks: '60+', uptime: '99.8%' },
    level: 'SS-5 ATELIER'
  }
];

// Agent Back Office
const backOfficeAgents = [
  {
    id: 'pepper',
    name: 'P.E.P.P.E.R.',
    role: 'Finance & Administration',
    icon: '💰',
    color: '#10b981',
    description: 'Facturation, devis, suivi paiements, TVA, rapports financiers.',
    shortDesc: 'Gestion financière',
    tech: ['Stripe', 'PDF', 'n8n', 'PostgreSQL'],
    status: 'online',
    metrics: { tasks: '50+', uptime: '99.9%' },
    level: 'BACK OFFICE'
  }
];

// Tous les agents incluant JARVIS, Dev Lab et Back Office
const allAgents = [
  {
    id: 'jarvis',
    name: 'J.A.R.V.I.S.',
    role: 'Coordination Centrale',
    icon: '🎯',
    color: '#fbbf24',
    description: 'Orchestration de tous les agents. Décisions stratégiques. Interface humain-IA.',
    shortDesc: 'Orchestration globale',
    tech: ['n8n', 'Ollama', 'API Gateway'],
    status: 'online',
    metrics: { tasks: '1000+', uptime: '99.9%' }
  },
  ...agents,
  ...devLabAgents,
  ...backOfficeAgents
];

// Domaines couverts
const domains = [
  { name: 'Support Client', icon: '🎧', desc: 'Tickets, FAQ, onboarding', agent: 'FRIDAY' },
  { name: 'Communauté', icon: '👥', desc: 'Discord, modération, events', agent: 'KAREN' },
  { name: 'Contenu', icon: '📢', desc: 'Posts, newsletters, docs', agent: 'VISION' },
  { name: 'Monitoring', icon: '📊', desc: 'Uptime, métriques, alertes', agent: 'ULTRON' },
  { name: 'DevOps', icon: '🚀', desc: 'CI/CD, déploiements, infra', agent: 'VERONICA' },
  { name: 'Sécurité', icon: '🛡️', desc: 'Audits, scans, protection', agent: 'EDITH' },
  { name: 'Frontend', icon: '🦾', desc: 'Vue.js, Three.js, UI/UX', agent: 'TADASHI' },
  { name: 'Backend', icon: '⚙️', desc: 'Symfony, APIs, logique', agent: 'JOCASTA' },
  { name: 'Testing', icon: '🔬', desc: 'Tests, QA, couverture', agent: 'CEREBRO' },
  { name: 'Data', icon: '🗄️', desc: 'DB, cache, migrations', agent: 'ZOLA' },
  { name: 'Build', icon: '🛠️', desc: 'Vite, Docker, tooling', agent: 'DUM-E' },
  { name: 'Finance', icon: '💰', desc: 'Factures, devis, TVA', agent: 'PEPPER' },
];

// Aperçu multivers
const universePreview = [
  { path: '/inception', icon: '🌀', name: 'Inception', color: '#3b82f6' },
  { path: '/tron', icon: '💠', name: 'TRON', color: '#06b6d4' },
  { path: '/blade-runner', icon: '🌧️', name: 'Blade Runner', color: '#f97316' },
  { path: '/iron-man', icon: '🦾', name: 'Iron Man', color: '#dc2626' },
  { path: '/ready-player-one', icon: '🎮', name: 'Ready Player One', color: '#00f5ff' },
];
</script>

<style scoped>
.tower-page {
  --primary: #fbbf24;
  --primary-soft: rgba(251, 191, 36, 0.1);
  --bg: #0a0a0f;
  --surface: #111118;
  background: var(--bg);
  color: #e5e5e5;
  min-height: 100vh;
  font-family: 'Inter', sans-serif;
}

/* BACKGROUND */
.tower-bg {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
}

.city-grid {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 40%;
  background-image: 
    linear-gradient(rgba(251, 191, 36, 0.02) 1px, transparent 1px),
    linear-gradient(90deg, rgba(251, 191, 36, 0.02) 1px, transparent 1px);
  background-size: 80px 80px;
  transform: perspective(500px) rotateX(60deg);
  transform-origin: bottom;
}

.tower-silhouette {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 120px;
  height: 60%;
  background: linear-gradient(to top, 
    rgba(251, 191, 36, 0.05), 
    rgba(251, 191, 36, 0.02) 50%,
    transparent
  );
  clip-path: polygon(20% 100%, 80% 100%, 70% 0%, 30% 0%);
}

.arc-reactor-glow {
  position: absolute;
  top: 20%;
  left: 50%;
  transform: translateX(-50%);
  width: 200px;
  height: 200px;
  background: radial-gradient(circle, rgba(251, 191, 36, 0.15), transparent 60%);
  border-radius: 50%;
  animation: reactor-pulse 3s ease-in-out infinite;
}

@keyframes reactor-pulse {
  0%, 100% { opacity: 0.5; transform: translateX(-50%) scale(1); }
  50% { opacity: 0.8; transform: translateX(-50%) scale(1.1); }
}

.floating-data {
  position: absolute;
  top: 15%;
  right: 5%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  opacity: 0.2;
}

.data {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.7rem;
  color: var(--primary);
  letter-spacing: 0.1em;
}

/* HERO */
.tower-hero {
  min-height: 80vh;
  display: flex;
  align-items: center;
  position: relative;
  padding: 8rem 2rem 4rem;
  z-index: 1;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

.tower-hero .container {
  text-align: center;
}

.tower-badge {
  margin-bottom: 2rem;
}

.arc-reactor {
  position: relative;
  width: 120px;
  height: 120px;
  margin: 0 auto;
}

.reactor-ring {
  position: absolute;
  inset: 0;
  border: 2px solid var(--primary);
  border-radius: 50%;
}

.reactor-ring--1 {
  animation: ring-spin 10s linear infinite;
}

.reactor-ring--2 {
  inset: 10px;
  border-style: dashed;
  animation: ring-spin 15s linear infinite reverse;
}

@keyframes ring-spin {
  to { transform: rotate(360deg); }
}

.reactor-core {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 60px;
  height: 60px;
  background: radial-gradient(circle, var(--primary), #b45309);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'JetBrains Mono', monospace;
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--bg);
  box-shadow: 0 0 40px var(--primary);
}

.hero-title { margin-bottom: 1.5rem; }

.title-pre {
  display: block;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.5);
  letter-spacing: 0.3em;
  margin-bottom: 0.5rem;
}

.title-main {
  display: block;
  font-size: clamp(3rem, 12vw, 8rem);
  font-weight: 200;
  color: var(--primary);
  text-shadow: 0 0 60px rgba(251, 191, 36, 0.5);
  letter-spacing: 0.15em;
}

.title-sub {
  display: block;
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.6);
  margin-top: 0.5rem;
}

.hero-intro {
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.7);
  max-width: 600px;
  margin: 0 auto 2rem;
  line-height: 1.7;
}

.hero-intro strong { color: var(--primary); }
.hero-intro em { color: #10b981; font-style: normal; }

.tower-stats {
  display: flex;
  justify-content: center;
  gap: 4rem;
}

.stat { text-align: center; }

.stat-value {
  display: block;
  font-size: 2.5rem;
  font-weight: 200;
  color: var(--primary);
}

.stat-label {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.5);
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

/* SECTION HEADER */
.section-header {
  text-align: center;
  margin-bottom: 3rem;
}

.section-header h2 {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  font-size: 1.75rem;
  font-weight: 400;
  margin-bottom: 0.5rem;
}

.header-icon { font-size: 1.5rem; }

.section-header p {
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.95rem;
}

.section-header--alt h2 { color: #06b6d4; }

/* TOWER STRUCTURE */
.tower-section {
  padding: 6rem 2rem;
  position: relative;
  z-index: 1;
}

.tower-structure {
  max-width: 900px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1px;
  background: rgba(251, 191, 36, 0.1);
  border-radius: 1rem;
  overflow: hidden;
}

.tower-level {
  display: grid;
  grid-template-columns: 140px 1fr;
  background: var(--surface);
  transition: all 0.3s ease;
}

.tower-level:hover {
  background: rgba(255, 255, 255, 0.02);
}

.tower-level--penthouse {
  background: linear-gradient(135deg, rgba(251, 191, 36, 0.1), var(--surface));
}

.tower-level--lobby {
  background: linear-gradient(135deg, var(--surface), rgba(16, 185, 129, 0.05));
}

.level-indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  border-right: 1px solid rgba(255, 255, 255, 0.05);
  background: rgba(0, 0, 0, 0.2);
}

.level-num {
  font-size: 1.5rem;
  font-weight: 200;
  color: var(--primary);
}

.level-name {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.55rem;
  color: rgba(255, 255, 255, 0.4);
  letter-spacing: 0.1em;
  margin-top: 0.25rem;
}

.level-content {
  padding: 1.5rem 2rem;
}

/* AGENT CARD */
.agent-card {
  display: flex;
  align-items: flex-start;
  gap: 1.5rem;
}

.agent-card--jarvis {
  padding: 1rem;
  background: rgba(251, 191, 36, 0.05);
  border-radius: 0.5rem;
  border: 1px solid rgba(251, 191, 36, 0.2);
}

.agent-avatar {
  font-size: 2.5rem;
  flex-shrink: 0;
}

.agent-info {
  flex: 1;
}

.agent-info h3 {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--agent-color, var(--primary));
  margin-bottom: 0.25rem;
}

.agent-role {
  display: block;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.5);
  margin-bottom: 0.5rem;
}

.agent-info p {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.5;
  margin-bottom: 0.75rem;
}

.agent-tech {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-bottom: 0.75rem;
}

.agent-tech span {
  padding: 0.2rem 0.5rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 0.25rem;
  font-size: 0.65rem;
  color: rgba(255, 255, 255, 0.6);
}

.agent-status {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.5);
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.status-dot--online {
  background: #22c55e;
  box-shadow: 0 0 10px #22c55e;
}

.status-dot--standby {
  background: #f59e0b;
  box-shadow: 0 0 10px #f59e0b;
}

.agent-metrics {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding-left: 1.5rem;
  border-left: 1px solid rgba(255, 255, 255, 0.1);
  margin-left: auto;
}

.metric { text-align: right; }

.metric-value {
  display: block;
  font-size: 1.25rem;
  font-weight: 500;
  color: var(--primary);
}

.metric-label {
  font-size: 0.6rem;
  color: rgba(255, 255, 255, 0.4);
  text-transform: uppercase;
}

/* LOBBY */
.lobby-card {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.lobby-icon { font-size: 2.5rem; }

.lobby-info h3 {
  font-size: 1.1rem;
  margin-bottom: 0.25rem;
}

.lobby-info p {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 1rem;
}

.lobby-actions {
  display: flex;
  gap: 1rem;
}

.lobby-btn {
  padding: 0.5rem 1rem;
  font-size: 0.75rem;
  font-weight: 500;
  text-decoration: none;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 0.25rem;
  color: rgba(255, 255, 255, 0.8);
  transition: all 0.3s ease;
}

.lobby-btn:hover {
  border-color: var(--primary);
  color: var(--primary);
}

.lobby-btn--primary {
  background: #10b981;
  border-color: #10b981;
  color: var(--bg);
}

.lobby-btn--primary:hover {
  background: #059669;
}

/* AGENTS GRID */
.agents-section {
  padding: 6rem 2rem;
  background: linear-gradient(180deg, var(--bg), #0f1015);
  position: relative;
  z-index: 1;
}

.agents-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

.agent-tile {
  position: relative;
  padding: 1.5rem;
  background: var(--surface);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 1rem;
  overflow: hidden;
  transition: all 0.3s ease;
}

.agent-tile:hover {
  border-color: var(--color);
  transform: translateY(-5px);
}

.agent-tile:hover .tile-glow {
  opacity: 0.1;
}

.tile-glow {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 50% 0%, var(--color), transparent 70%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.tile-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
  position: relative;
}

.tile-icon { font-size: 2rem; }

.tile-status {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.agent-tile h4 {
  font-size: 1rem;
  font-weight: 600;
  color: var(--color);
  margin-bottom: 0.25rem;
  position: relative;
}

.tile-role {
  display: block;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.65rem;
  color: rgba(255, 255, 255, 0.5);
  margin-bottom: 0.5rem;
  position: relative;
}

.agent-tile p {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.6);
  line-height: 1.5;
  margin-bottom: 1rem;
  position: relative;
}

.tile-tech {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  position: relative;
}

.tile-tech span {
  padding: 0.2rem 0.5rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 0.25rem;
  font-size: 0.6rem;
  color: rgba(255, 255, 255, 0.5);
}

/* COVERAGE */
.coverage-section {
  padding: 6rem 2rem;
  position: relative;
  z-index: 1;
}

.coverage-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.coverage-item {
  padding: 1.5rem;
  background: var(--surface);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 0.75rem;
  text-align: center;
  transition: all 0.3s ease;
}

.coverage-item:hover {
  border-color: var(--primary);
}

.coverage-icon {
  font-size: 2rem;
  display: block;
  margin-bottom: 0.75rem;
}

.coverage-item h4 {
  font-size: 0.95rem;
  margin-bottom: 0.25rem;
}

.coverage-item p {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.5);
  margin-bottom: 0.75rem;
}

.coverage-agent {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.65rem;
  color: var(--primary);
}

/* TERMINAL */
.terminal-section {
  padding: 4rem 2rem;
  position: relative;
  z-index: 1;
}

.terminal-frame {
  max-width: 700px;
  margin: 0 auto;
  background: #0d0d12;
  border: 1px solid rgba(251, 191, 36, 0.3);
  border-radius: 0.5rem;
  overflow: hidden;
}

.terminal-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: rgba(251, 191, 36, 0.1);
  border-bottom: 1px solid rgba(251, 191, 36, 0.2);
}

.terminal-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.terminal-dot--red { background: #ef4444; }
.terminal-dot--yellow { background: #f59e0b; }
.terminal-dot--green { background: #22c55e; }

.terminal-title {
  margin-left: auto;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.7rem;
  color: rgba(251, 191, 36, 0.7);
}

.terminal-body {
  padding: 1.5rem;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.75rem;
}

.terminal-line {
  margin-bottom: 0.4rem;
  color: rgba(255, 255, 255, 0.7);
}

.t-prompt { color: var(--primary); }
.t-info { color: #06b6d4; }
.t-success { color: #22c55e; }
.t-warning { color: #f59e0b; }
.t-dim { color: rgba(255, 255, 255, 0.4); }

.cursor {
  animation: blink 1s step-end infinite;
}

@keyframes blink {
  50% { opacity: 0; }
}

/* QUICK ACCESS */
.quick-section {
  padding: 6rem 2rem;
  position: relative;
  z-index: 1;
}

.quick-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  max-width: 900px;
  margin: 0 auto;
}

.quick-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 2rem 1.5rem;
  background: var(--surface);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 1rem;
  text-decoration: none;
  color: inherit;
  transition: all 0.3s ease;
}

.quick-card:hover {
  border-color: var(--primary);
  transform: translateY(-5px);
}

.quick-card--primary {
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), var(--surface));
  border-color: rgba(16, 185, 129, 0.3);
}

.quick-card--primary:hover {
  border-color: #10b981;
}

.quick-icon {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.quick-card h4 {
  font-size: 1rem;
  margin-bottom: 0.25rem;
}

.quick-card p {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.5);
}

/* MULTIVERS TEASER */
.multivers-teaser {
  padding: 4rem 2rem;
  background: linear-gradient(180deg, transparent, rgba(168, 85, 247, 0.05));
  position: relative;
  z-index: 1;
}

.teaser-content {
  text-align: center;
}

.teaser-content h2 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

.teaser-content p {
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 2rem;
}

.teaser-content strong { color: #a855f7; }

.teaser-scroll {
  display: flex;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.teaser-card {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  background: rgba(168, 85, 247, 0.1);
  border: 1px solid rgba(168, 85, 247, 0.2);
  border-radius: 2rem;
  text-decoration: none;
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.85rem;
  transition: all 0.3s ease;
}

.teaser-card:hover {
  border-color: var(--color);
  transform: scale(1.05);
}

.teaser-cta {
  display: inline-block;
  margin-top: 1.5rem;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, rgba(168, 85, 247, 0.2), rgba(168, 85, 247, 0.1));
  border: 1px solid #a855f7;
  border-radius: 0.5rem;
  color: #a855f7;
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.3s ease;
}

.teaser-cta:hover {
  background: #a855f7;
  color: var(--bg);
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(168, 85, 247, 0.3);
}

/* FOOTER */
.tower-footer {
  padding: 6rem 2rem;
  text-align: center;
  position: relative;
  z-index: 1;
}

.footer-quote {
  font-size: 1.25rem;
  font-style: italic;
  color: rgba(255, 255, 255, 0.6);
  max-width: 600px;
  margin: 0 auto 2rem;
}

.footer-cta {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 2rem;
  background: var(--primary);
  color: var(--bg);
  text-decoration: none;
  font-weight: 600;
  border-radius: 0.5rem;
  transition: all 0.3s ease;
}

.footer-cta:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 40px rgba(251, 191, 36, 0.4);
}

.cta-icon { font-size: 1.25rem; }

/* HERO LINKS */
.hero-links {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  margin-top: 2.5rem;
  flex-wrap: wrap;
}

.hero-link {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 1.25rem 1.5rem;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 1rem;
  text-decoration: none;
  color: inherit;
  transition: all 0.3s ease;
  min-width: 140px;
}

.hero-link:hover {
  border-color: var(--primary);
  background: rgba(16, 185, 129, 0.1);
  transform: translateY(-3px);
}

.hero-link--map {
  background: linear-gradient(135deg, rgba(251, 191, 36, 0.1), rgba(180, 83, 9, 0.05));
  border-color: rgba(251, 191, 36, 0.3);
}

.hero-link--map:hover {
  border-color: #FBBF24;
  background: rgba(251, 191, 36, 0.15);
}

.hero-link--map .link-text {
  color: #FBBF24;
}

.hero-link--gallery {
  background: linear-gradient(135deg, rgba(0, 255, 65, 0.1), rgba(6, 182, 212, 0.05));
  border-color: rgba(0, 255, 65, 0.3);
}

.hero-link--gallery:hover {
  border-color: #00ff41;
  background: rgba(0, 255, 65, 0.15);
}

.hero-link--gallery .link-text {
  color: #00ff41;
}

.hero-link--multivers {
  background: linear-gradient(135deg, rgba(168, 85, 247, 0.1), rgba(59, 130, 246, 0.05));
  border-color: rgba(168, 85, 247, 0.3);
}

.hero-link--multivers:hover {
  border-color: #a855f7;
  background: rgba(168, 85, 247, 0.15);
}

.hero-link--multivers .link-text {
  color: #a855f7;
}

.hero-link--construct {
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(0, 0, 0, 0.1));
  border-color: rgba(239, 68, 68, 0.3);
}

.hero-link--construct:hover {
  border-color: #ef4444;
  background: rgba(239, 68, 68, 0.15);
}

.hero-link--construct .link-text {
  color: #ef4444;
}

.hero-link--cta {
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(16, 185, 129, 0.05));
  border-color: rgba(16, 185, 129, 0.4);
}

.hero-link--cta:hover {
  background: var(--primary);
  border-color: var(--primary);
}

.hero-link--cta:hover .link-text,
.hero-link--cta:hover .link-desc {
  color: var(--bg);
}

.link-icon {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

.link-text {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-main);
  margin-bottom: 0.25rem;
}

.link-desc {
  font-size: 0.65rem;
  color: var(--text-dark);
}

/* TOWER SEPARATOR */
.tower-separator {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem 2rem;
  background: linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.1), transparent);
}

.tower-separator--office {
  background: linear-gradient(90deg, transparent, rgba(16, 185, 129, 0.1), transparent);
}

.separator-line {
  flex: 1;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.5), transparent);
}

.tower-separator--office .separator-line {
  background: linear-gradient(90deg, transparent, rgba(16, 185, 129, 0.5), transparent);
}

.separator-text {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.75rem;
  color: #3b82f6;
  letter-spacing: 0.15em;
  white-space: nowrap;
}

.tower-separator--office .separator-text {
  color: #10b981;
}

/* BASEMENT LEVELS (Dev Lab) */
.tower-level--basement {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.05), var(--surface));
}

.tower-level--basement:hover {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(255, 255, 255, 0.02));
}

.level-indicator--basement {
  background: rgba(59, 130, 246, 0.1);
  border-right-color: rgba(59, 130, 246, 0.2);
}

.level-indicator--basement .level-num {
  color: #3b82f6;
  font-size: 0.9rem;
}

.level-indicator--basement .level-name {
  color: rgba(59, 130, 246, 0.7);
}

/* OFFICE LEVEL (Back Office) */
.tower-level--office {
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.05), var(--surface));
}

.tower-level--office:hover {
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(255, 255, 255, 0.02));
}

.level-indicator--office {
  background: rgba(16, 185, 129, 0.1);
  border-right-color: rgba(16, 185, 129, 0.2);
}

.level-indicator--office .level-num {
  color: #10b981;
}

.level-indicator--office .level-name {
  color: rgba(16, 185, 129, 0.7);
}

/* RESPONSIVE */
@media (max-width: 768px) {
  .hero-links {
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }
  
  .hero-link {
    width: 100%;
    max-width: 280px;
    flex-direction: row;
    text-align: left;
    gap: 1rem;
    padding: 1rem;
  }
  
  .link-icon {
    margin-bottom: 0;
  }
  
  .tower-stats {
    flex-direction: column;
    gap: 1.5rem;
  }
  
  .tower-level {
    grid-template-columns: 1fr;
  }
  
  .level-indicator {
    flex-direction: row;
    justify-content: flex-start;
    gap: 1rem;
    border-right: none;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  }
  
  .agent-card {
    flex-direction: column;
  }
  
  .agent-metrics {
    flex-direction: row;
    padding-left: 0;
    padding-top: 1rem;
    border-left: none;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    margin-left: 0;
    margin-top: 1rem;
    gap: 2rem;
  }
  
  .metric { text-align: left; }
  
  .lobby-card {
    flex-direction: column;
    text-align: center;
  }
  
  .lobby-actions {
    justify-content: center;
  }
  
  .floating-data {
    display: none;
  }
}

/* A11Y */
@media (prefers-reduced-motion: reduce) {
  .reactor-ring,
  .arc-reactor-glow,
  .cursor {
    animation: none !important;
  }
}
</style>
