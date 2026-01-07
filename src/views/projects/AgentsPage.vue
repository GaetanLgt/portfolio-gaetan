<template>
  <div class="workflows-page">
    <!-- Ambient Background -->
    <div class="workflows-ambient">
      <div class="workflows-ambient__grid"></div>
      <div class="workflows-ambient__nodes"></div>
    </div>

    <!-- HERO -->
    <section class="workflows-hero">
      <div class="container">
        <div class="workflows-hero__content reveal">
          <div class="status-badge">
            <span class="status-badge__dot"></span>
            <span class="status-badge__text">AUTOMATISATIONS ACTIVES</span>
          </div>
          
          <h1 class="workflows-hero__title">
            <span class="text-gradient">Workflows</span>
            <span class="workflows-hero__title-sub">& Automatisations</span>
          </h1>
          
          <p class="workflows-hero__tagline">
            Trigger. Process. Deliver.
          </p>
          
          <p class="workflows-hero__desc">
            Des <strong>workflows concrets</strong> qui tournent en production.
            n8n + IA locale + APIs = automatisation sans limites.
          </p>
          
          <div class="workflows-hero__stats">
            <div class="hero-stat">
              <span class="hero-stat__value">{{ activeWorkflows }}</span>
              <span class="hero-stat__label">Workflows actifs</span>
            </div>
            <div class="hero-stat">
              <span class="hero-stat__value">24/7</span>
              <span class="hero-stat__label">Monitoring</span>
            </div>
            <div class="hero-stat">
              <span class="hero-stat__value">0</span>
              <span class="hero-stat__label">Cloud US</span>
            </div>
          </div>
        </div>
        
        <!-- Live Status Preview -->
        <div class="workflows-hero__preview reveal" data-reveal-delay="200">
          <div class="live-dashboard glass">
            <div class="live-dashboard__header">
              <span class="live-dashboard__dot live-dashboard__dot--green"></span>
              <span>Système opérationnel</span>
            </div>
            <div class="live-dashboard__items">
              <div class="dashboard-item" v-for="item in dashboardItems" :key="item.name">
                <span class="dashboard-item__icon">{{ item.icon }}</span>
                <span class="dashboard-item__name">{{ item.name }}</span>
                <span class="dashboard-item__status" :class="'dashboard-item__status--' + item.status">
                  {{ item.statusText }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- STACK OVERVIEW -->
    <section class="workflows-section workflows-section--dark">
      <div class="container">
        <div class="section-header section-header--center">
          <span class="mono-tag">/// STACK OPÉRATIONNELLE</span>
          <h2>Architecture des Workflows</h2>
          <p class="section-desc">
            Une infrastructure 100% souveraine, déployable on-premise.
          </p>
        </div>
        
        <div class="stack-diagram reveal">
          <div class="stack-layer">
            <span class="stack-layer__label">TRIGGERS</span>
            <div class="stack-layer__items">
              <div class="stack-item">
                <span class="stack-item__icon">💬</span>
                <span class="stack-item__name">Discord</span>
              </div>
              <div class="stack-item">
                <span class="stack-item__icon">📧</span>
                <span class="stack-item__name">Email</span>
              </div>
              <div class="stack-item">
                <span class="stack-item__icon">🌐</span>
                <span class="stack-item__name">Webhook</span>
              </div>
              <div class="stack-item">
                <span class="stack-item__icon">⏰</span>
                <span class="stack-item__name">Cron</span>
              </div>
            </div>
          </div>
          
          <div class="stack-arrow">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <polyline points="19 12 12 19 5 12"></polyline>
            </svg>
          </div>
          
          <div class="stack-layer stack-layer--primary">
            <span class="stack-layer__label">ORCHESTRATION</span>
            <div class="stack-layer__items">
              <div class="stack-item stack-item--large">
                <span class="stack-item__icon">🔄</span>
                <span class="stack-item__name">n8n</span>
                <span class="stack-item__desc">Workflow Engine</span>
              </div>
            </div>
          </div>
          
          <div class="stack-arrow">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <polyline points="19 12 12 19 5 12"></polyline>
            </svg>
          </div>
          
          <div class="stack-layer">
            <span class="stack-layer__label">INTELLIGENCE</span>
            <div class="stack-layer__items">
              <div class="stack-item">
                <span class="stack-item__icon">🧠</span>
                <span class="stack-item__name">Nemotron</span>
              </div>
              <div class="stack-item">
                <span class="stack-item__icon">🔍</span>
                <span class="stack-item__name">ChromaDB</span>
              </div>
              <div class="stack-item">
                <span class="stack-item__icon">📚</span>
                <span class="stack-item__name">Obsidian</span>
              </div>
            </div>
          </div>
          
          <div class="stack-arrow">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <polyline points="19 12 12 19 5 12"></polyline>
            </svg>
          </div>
          
          <div class="stack-layer">
            <span class="stack-layer__label">ACTIONS</span>
            <div class="stack-layer__items">
              <div class="stack-item">
                <span class="stack-item__icon">📝</span>
                <span class="stack-item__name">Notion</span>
              </div>
              <div class="stack-item">
                <span class="stack-item__icon">📊</span>
                <span class="stack-item__name">Sheets</span>
              </div>
              <div class="stack-item">
                <span class="stack-item__icon">🔔</span>
                <span class="stack-item__name">Notifications</span>
              </div>
              <div class="stack-item">
                <span class="stack-item__icon">🗄️</span>
                <span class="stack-item__name">Database</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- WORKFLOWS SHOWCASE -->
    <section class="workflows-section">
      <div class="container">
        <div class="section-header section-header--center">
          <span class="mono-tag">/// CAS CONCRETS</span>
          <h2>Workflows en Production</h2>
          <p class="section-desc">
            Des automatisations réelles qui tournent sur mes projets.
          </p>
        </div>
        
        <div class="workflows-grid">
          <!-- ARKADIA Discord Bot -->
          <article class="workflow-card glass reveal" v-for="(workflow, index) in workflows" :key="workflow.id" :data-reveal-delay="index * 100">
            <div class="workflow-card__header">
              <div class="workflow-card__icon" :style="{ background: workflow.color }">
                {{ workflow.icon }}
              </div>
              <div class="workflow-card__meta">
                <span class="workflow-card__project">{{ workflow.project }}</span>
                <h3>{{ workflow.name }}</h3>
              </div>
              <span class="workflow-card__status" :class="'workflow-card__status--' + workflow.status">
                {{ workflow.status === 'active' ? '● Actif' : '○ Dev' }}
              </span>
            </div>
            
            <p class="workflow-card__desc">{{ workflow.description }}</p>
            
            <!-- Flow Visualization -->
            <div class="workflow-card__flow">
              <div class="flow-step" v-for="(step, i) in workflow.steps" :key="i">
                <span class="flow-step__icon">{{ step.icon }}</span>
                <span class="flow-step__label">{{ step.label }}</span>
                <span class="flow-step__arrow" v-if="i < workflow.steps.length - 1">→</span>
              </div>
            </div>
            
            <!-- Tech Stack -->
            <div class="workflow-card__stack">
              <span class="stack-tag" v-for="tech in workflow.stack" :key="tech">{{ tech }}</span>
            </div>
            
            <!-- Metrics -->
            <div class="workflow-card__metrics" v-if="workflow.metrics">
              <div class="metric" v-for="metric in workflow.metrics" :key="metric.label">
                <span class="metric__value">{{ metric.value }}</span>
                <span class="metric__label">{{ metric.label }}</span>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- N8N DETAIL -->
    <section class="workflows-section workflows-section--dark">
      <div class="container">
        <div class="section-header section-header--center">
          <span class="mono-tag">/// FOCUS TECHNIQUE</span>
          <h2>n8n : Le Cœur de l'Orchestration</h2>
          <p class="section-desc">
            Open-source, self-hosted, 400+ intégrations natives.
          </p>
        </div>
        
        <div class="n8n-showcase reveal">
          <div class="n8n-features">
            <div class="n8n-feature glass" v-for="feature in n8nFeatures" :key="feature.title">
              <span class="n8n-feature__icon">{{ feature.icon }}</span>
              <h4>{{ feature.title }}</h4>
              <p>{{ feature.desc }}</p>
            </div>
          </div>
          
          <div class="n8n-code glass">
            <div class="n8n-code__header">
              <span class="n8n-code__dot"></span>
              <span class="n8n-code__dot"></span>
              <span class="n8n-code__dot"></span>
              <span class="n8n-code__title">workflow-discord-bot.json</span>
            </div>
            <pre class="n8n-code__content"><code>{
  "nodes": [
    {
      "name": "Discord Trigger",
      "type": "n8n-nodes-base.discordTrigger",
      "parameters": {
        "event": "messageCreate",
        "channelId": "CHANNEL_ID"
      }
    },
    {
      "name": "AI Processing",
      "type": "n8n-nodes-base.httpRequest",
      "parameters": {
        "url": "http://ollama:11434/api/generate",
        "method": "POST",
        "body": {
          "model": "nemotron",
          "prompt": "=$json.content"
        }
      }
    },
    {
      "name": "Send Response",
      "type": "n8n-nodes-base.discord",
      "parameters": {
        "operation": "sendMessage",
        "channelId": "=$node.trigger.channelId"
      }
    }
  ]
}</code></pre>
          </div>
        </div>
      </div>
    </section>

    <!-- BENEFITS -->
    <section class="workflows-section">
      <div class="container">
        <div class="section-header section-header--center">
          <span class="mono-tag">/// POURQUOI CETTE APPROCHE</span>
          <h2>Avantages de l'Automatisation Souveraine</h2>
        </div>
        
        <div class="benefits-grid reveal">
          <div class="benefit-card glass" v-for="benefit in benefits" :key="benefit.title">
            <span class="benefit-card__icon">{{ benefit.icon }}</span>
            <h4>{{ benefit.title }}</h4>
            <p>{{ benefit.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="workflows-section">
      <div class="container">
        <div class="workflows-cta glass reveal">
          <div class="workflows-cta__visual">
            <span>🔄</span>
            <span>🧠</span>
            <span>⚡</span>
          </div>
          <h3>Automatisez vos processus métier</h3>
          <p>
            Les mêmes workflows que j'utilise en production, adaptés à votre contexte.
            100% souverain, hébergement français possible.
          </p>
          <div class="workflows-cta__buttons">
            <router-link to="/contact" class="btn btn--primary">
              Discuter de votre projet →
            </router-link>
            <router-link to="/stack-ia" class="btn btn--secondary">
              Voir la stack technique
            </router-link>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useScrollReveal } from '@/composables/useScrollReveal';

// Scroll reveal
const { observeAll } = useScrollReveal();

onMounted(() => {
  observeAll('.reveal');
});

// Data
const activeWorkflows = ref(12);

const dashboardItems = ref([
  { icon: '🤖', name: 'Discord Bot ARKADIA', status: 'active', statusText: 'En ligne' },
  { icon: '📊', name: 'Backup Monitor', status: 'active', statusText: 'OK' },
  { icon: '🔔', name: 'Alert System', status: 'active', statusText: 'Actif' },
  { icon: '📝', name: 'Doc Sync', status: 'idle', statusText: 'Idle' }
]);

const workflows = ref([
  {
    id: 'arkadia-discord',
    project: 'ARKADIA FRANCE',
    name: 'Bot Discord Communautaire',
    icon: '🦖',
    color: 'linear-gradient(135deg, #10B981, #059669)',
    status: 'active',
    description: 'Gestion automatisée de la communauté : accueil nouveaux membres, commandes !status, !rules, modération automatique, logs des événements serveur.',
    steps: [
      { icon: '💬', label: 'Message Discord' },
      { icon: '🔍', label: 'Parsing commande' },
      { icon: '🧠', label: 'Traitement' },
      { icon: '📤', label: 'Réponse' }
    ],
    stack: ['Discord.js', 'n8n', 'PostgreSQL'],
    metrics: [
      { value: '150+', label: 'Membres' },
      { value: '~120', label: 'Msgs/jour' },
      { value: '24/7', label: 'Uptime' }
    ]
  },
  {
    id: 'arkadia-backup',
    project: 'ARKADIA FRANCE',
    name: 'Monitoring & Alertes',
    icon: '🛡️',
    color: 'linear-gradient(135deg, #EF4444, #DC2626)',
    status: 'active',
    description: 'Surveillance de l\'état des 9 serveurs ARK, vérification des backups, alertes Discord en cas d\'anomalie (crash, lag, espace disque).',
    steps: [
      { icon: '⏰', label: 'Cron 5min' },
      { icon: '🔌', label: 'API Nitrado' },
      { icon: '📊', label: 'Analyse' },
      { icon: '🔔', label: 'Alerte si KO' }
    ],
    stack: ['n8n', 'Nitrado API', 'Discord Webhook'],
    metrics: [
      { value: '9', label: 'Serveurs' },
      { value: '99.8%', label: 'Uptime' },
      { value: '< 2min', label: 'Réaction' }
    ]
  },
  {
    id: 'knowledge-rag',
    project: 'GL DIGITAL LAB',
    name: 'Knowledge Base RAG',
    icon: '📚',
    color: 'linear-gradient(135deg, #8B5CF6, #7C3AED)',
    status: 'active',
    description: 'Indexation automatique des notes Obsidian dans ChromaDB. Permet de questionner la documentation en langage naturel via LLM local.',
    steps: [
      { icon: '📝', label: 'Obsidian sync' },
      { icon: '🔄', label: 'Chunking' },
      { icon: '🔍', label: 'Embedding' },
      { icon: '💾', label: 'ChromaDB' }
    ],
    stack: ['Obsidian', 'ChromaDB', 'Nemotron', 'n8n'],
    metrics: [
      { value: '500+', label: 'Notes' },
      { value: '< 2s', label: 'Query' },
      { value: '100%', label: 'Local' }
    ]
  },
  {
    id: 'content-pipeline',
    project: 'GL DIGITAL LAB',
    name: 'Pipeline Contenu',
    icon: '✍️',
    color: 'linear-gradient(135deg, #F59E0B, #D97706)',
    status: 'dev',
    description: 'Génération assistée de contenu LinkedIn/Blog. Récupère les tendances, propose des angles, génère des drafts à valider humainement.',
    steps: [
      { icon: '📰', label: 'Veille RSS' },
      { icon: '🧠', label: 'Analyse IA' },
      { icon: '✏️', label: 'Draft' },
      { icon: '👁️', label: 'Review' }
    ],
    stack: ['n8n', 'Nemotron', 'Notion API'],
    metrics: null
  },
  {
    id: 'client-onboarding',
    project: 'GL DIGITAL LAB',
    name: 'Onboarding Client',
    icon: '🤝',
    color: 'linear-gradient(135deg, #06B6D4, #0891B2)',
    status: 'dev',
    description: 'Workflow automatisé pour l\'accueil des nouveaux clients : création espace Notion, envoi documents, setup initial, checklist de démarrage.',
    steps: [
      { icon: '📋', label: 'Formulaire' },
      { icon: '📁', label: 'Setup Notion' },
      { icon: '📧', label: 'Email welcome' },
      { icon: '✅', label: 'Checklist' }
    ],
    stack: ['n8n', 'Notion', 'Gmail API'],
    metrics: null
  },
  {
    id: 'invoice-reminder',
    project: 'GL DIGITAL LAB',
    name: 'Relances Factures',
    icon: '💰',
    color: 'linear-gradient(135deg, #10B981, #059669)',
    status: 'dev',
    description: 'Suivi automatique des factures : détection des impayés, envoi de relances progressives, escalade si nécessaire.',
    steps: [
      { icon: '📊', label: 'Check factures' },
      { icon: '⏳', label: 'Délai dépassé?' },
      { icon: '📧', label: 'Relance' },
      { icon: '📝', label: 'Log CRM' }
    ],
    stack: ['n8n', 'Pennylane API', 'Gmail'],
    metrics: null
  }
]);

const n8nFeatures = ref([
  {
    icon: '🔓',
    title: 'Open Source',
    desc: 'Code source auditable, pas de vendor lock-in.'
  },
  {
    icon: '🏠',
    title: 'Self-Hosted',
    desc: 'Tourne sur votre infra, vos données restent chez vous.'
  },
  {
    icon: '🔌',
    title: '400+ Intégrations',
    desc: 'Discord, Notion, Gmail, Slack, bases de données...'
  },
  {
    icon: '🧠',
    title: 'IA Ready',
    desc: 'Nodes natifs pour OpenAI, Ollama, LangChain.'
  },
  {
    icon: '🔁',
    title: 'Logique Avancée',
    desc: 'Conditions, boucles, error handling, sous-workflows.'
  },
  {
    icon: '📊',
    title: 'Monitoring',
    desc: 'Logs d\'exécution, métriques, alertes intégrées.'
  }
]);

const benefits = ref([
  {
    icon: '🔒',
    title: 'Souveraineté des Données',
    desc: 'Aucune donnée ne transite par des serveurs US. Hébergement français possible.'
  },
  {
    icon: '💰',
    title: 'Coûts Maîtrisés',
    desc: 'Pas d\'abonnement par exécution. Coût fixe = serveur + maintenance.'
  },
  {
    icon: '🎛️',
    title: 'Contrôle Total',
    desc: 'Vous possédez le code, les workflows, les données. Pas de dépendance.'
  },
  {
    icon: '🔧',
    title: 'Personnalisation Illimitée',
    desc: 'Workflows sur-mesure pour vos processus métier spécifiques.'
  },
  {
    icon: '🚀',
    title: 'Scalabilité',
    desc: 'De quelques workflows à des centaines, même architecture.'
  },
  {
    icon: '🤖',
    title: 'IA Intégrée',
    desc: 'LLM local (Nemotron) + RAG pour des automatisations intelligentes.'
  }
]);
</script>

<style scoped>
.workflows-page {
  min-height: 100vh;
  position: relative;
  overflow-x: hidden;
}

/* ============================================
   AMBIENT
   ============================================ */
.workflows-ambient {
  position: fixed;
  inset: 0;
  z-index: -1;
  pointer-events: none;
}

.workflows-ambient__grid {
  position: absolute;
  inset: 0;
  background-image: 
    linear-gradient(rgba(16, 185, 129, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(16, 185, 129, 0.03) 1px, transparent 1px);
  background-size: 50px 50px;
}

.workflows-ambient__nodes {
  position: absolute;
  inset: 0;
  background-image: 
    radial-gradient(circle at 20% 30%, rgba(16, 185, 129, 0.05) 0%, transparent 25%),
    radial-gradient(circle at 80% 70%, rgba(139, 92, 246, 0.05) 0%, transparent 25%);
}

/* ============================================
   SECTIONS
   ============================================ */
.workflows-section {
  padding: var(--space-xl) 0;
  position: relative;
  z-index: 1;
}

.workflows-section--dark {
  background: var(--surface);
}

.section-header {
  margin-bottom: var(--space-lg);
}

.section-header--center {
  text-align: center;
}

.section-header h2 {
  font-size: clamp(1.75rem, 4vw, 2.5rem);
  margin-top: 0.5rem;
}

.section-desc {
  color: var(--text-muted);
  max-width: 600px;
  margin: 0.5rem auto 0;
}

.mono-tag {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.7rem;
  color: var(--primary);
  letter-spacing: 0.1em;
}

/* ============================================
   HERO
   ============================================ */
.workflows-hero {
  min-height: 100vh;
  display: flex;
  align-items: center;
  padding: 120px 0 80px;
}

.workflows-hero .container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-xl);
  align-items: center;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.3);
  border-radius: 2rem;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.6rem;
  color: var(--primary);
  letter-spacing: 0.15em;
  margin-bottom: var(--space-md);
}

.status-badge__dot {
  width: 8px;
  height: 8px;
  background: var(--primary);
  border-radius: 50%;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(1.2); }
}

.workflows-hero__title {
  font-size: clamp(3rem, 8vw, 5rem);
  font-weight: 900;
  line-height: 1;
  margin-bottom: var(--space-sm);
}

.workflows-hero__title-sub {
  display: block;
  font-size: 0.4em;
  font-weight: 400;
  color: var(--text-muted);
  margin-top: 0.5rem;
}

.workflows-hero__tagline {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.9rem;
  color: var(--primary);
  letter-spacing: 0.2em;
  margin-bottom: var(--space-sm);
}

.workflows-hero__desc {
  font-size: 1.1rem;
  color: var(--text-muted);
  line-height: 1.7;
  margin-bottom: var(--space-md);
}

.workflows-hero__desc strong {
  color: var(--text-main);
}

.workflows-hero__stats {
  display: flex;
  gap: var(--space-md);
  padding: var(--space-sm);
  background: rgba(10, 10, 10, 0.5);
  border: 1px solid var(--border);
  border-radius: 0.75rem;
}

.hero-stat {
  text-align: center;
  flex: 1;
}

.hero-stat__value {
  display: block;
  font-family: 'JetBrains Mono', monospace;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--primary);
}

.hero-stat__label {
  font-size: 0.65rem;
  color: var(--text-dark);
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

/* Live Dashboard */
.live-dashboard {
  padding: var(--space-md);
  border-radius: 1rem;
  border: 1px solid var(--border);
}

.live-dashboard__header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: var(--space-md);
  padding-bottom: var(--space-sm);
  border-bottom: 1px solid var(--border);
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.75rem;
  color: var(--primary);
}

.live-dashboard__dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.live-dashboard__dot--green {
  background: var(--primary);
  box-shadow: 0 0 10px var(--primary);
}

.live-dashboard__items {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.dashboard-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: var(--bg);
  border-radius: 0.5rem;
  border: 1px solid var(--border);
}

.dashboard-item__icon {
  font-size: 1.25rem;
}

.dashboard-item__name {
  flex: 1;
  font-size: 0.85rem;
}

.dashboard-item__status {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.7rem;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
}

.dashboard-item__status--active {
  color: var(--primary);
  background: var(--primary-soft);
}

.dashboard-item__status--idle {
  color: var(--text-dark);
  background: rgba(255,255,255,0.05);
}

/* ============================================
   STACK DIAGRAM
   ============================================ */
.stack-diagram {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-lg);
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 1rem;
}

.stack-layer {
  width: 100%;
  max-width: 600px;
  padding: var(--space-md);
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 0.75rem;
  text-align: center;
}

.stack-layer--primary {
  border-color: var(--primary);
  background: var(--primary-soft);
}

.stack-layer__label {
  display: block;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.65rem;
  color: var(--text-dark);
  letter-spacing: 0.15em;
  margin-bottom: var(--space-sm);
}

.stack-layer--primary .stack-layer__label {
  color: var(--primary);
}

.stack-layer__items {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.stack-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  padding: 0.5rem 1rem;
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 0.5rem;
}

.stack-item--large {
  padding: 1rem 2rem;
}

.stack-item__icon {
  font-size: 1.25rem;
}

.stack-item__name {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.75rem;
  font-weight: 600;
}

.stack-item__desc {
  font-size: 0.65rem;
  color: var(--text-dark);
}

.stack-arrow {
  color: var(--primary);
  opacity: 0.5;
}

.stack-arrow svg {
  width: 24px;
  height: 24px;
}

/* ============================================
   WORKFLOWS GRID
   ============================================ */
.workflows-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-md);
}

.workflow-card {
  padding: var(--space-md);
  border-radius: 1rem;
  border: 1px solid var(--border);
  transition: all 0.3s ease;
}

.workflow-card:hover {
  border-color: var(--primary);
  transform: translateY(-5px);
}

.workflow-card__header {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: var(--space-sm);
}

.workflow-card__icon {
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.75rem;
  font-size: 1.5rem;
  flex-shrink: 0;
}

.workflow-card__meta {
  flex: 1;
}

.workflow-card__project {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.65rem;
  color: var(--text-dark);
  letter-spacing: 0.1em;
}

.workflow-card__meta h3 {
  font-size: 1rem;
  margin: 0.25rem 0 0;
}

.workflow-card__status {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.7rem;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  flex-shrink: 0;
}

.workflow-card__status--active {
  color: var(--primary);
  background: var(--primary-soft);
}

.workflow-card__status--dev {
  color: #F59E0B;
  background: rgba(245, 158, 11, 0.1);
}

.workflow-card__desc {
  font-size: 0.85rem;
  color: var(--text-muted);
  line-height: 1.6;
  margin-bottom: var(--space-md);
}

/* Flow visualization */
.workflow-card__flow {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;
  padding: var(--space-sm);
  background: var(--bg);
  border-radius: 0.5rem;
  margin-bottom: var(--space-sm);
}

.flow-step {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.flow-step__icon {
  font-size: 1rem;
}

.flow-step__label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.7rem;
  color: var(--text-muted);
}

.flow-step__arrow {
  color: var(--primary);
  margin-left: 0.25rem;
}

/* Stack tags */
.workflow-card__stack {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: var(--space-sm);
}

.stack-tag {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.65rem;
  padding: 0.25rem 0.5rem;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 4px;
  color: var(--text-muted);
}

/* Metrics */
.workflow-card__metrics {
  display: flex;
  gap: var(--space-sm);
  padding-top: var(--space-sm);
  border-top: 1px solid var(--border);
}

.metric {
  flex: 1;
  text-align: center;
}

.metric__value {
  display: block;
  font-family: 'JetBrains Mono', monospace;
  font-size: 1rem;
  font-weight: 700;
  color: var(--primary);
}

.metric__label {
  font-size: 0.6rem;
  color: var(--text-dark);
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

/* ============================================
   N8N SHOWCASE
   ============================================ */
.n8n-showcase {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-lg);
}

.n8n-features {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-sm);
}

.n8n-feature {
  padding: var(--space-md);
  border-radius: 0.75rem;
  border: 1px solid var(--border);
}

.n8n-feature__icon {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  display: block;
}

.n8n-feature h4 {
  font-size: 0.9rem;
  margin-bottom: 0.25rem;
}

.n8n-feature p {
  font-size: 0.8rem;
  color: var(--text-muted);
  margin: 0;
}

.n8n-code {
  border-radius: 0.75rem;
  border: 1px solid var(--border);
  overflow: hidden;
}

.n8n-code__header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: var(--surface);
  border-bottom: 1px solid var(--border);
}

.n8n-code__dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--border);
}

.n8n-code__dot:nth-child(1) { background: #EF4444; }
.n8n-code__dot:nth-child(2) { background: #F59E0B; }
.n8n-code__dot:nth-child(3) { background: #10B981; }

.n8n-code__title {
  margin-left: auto;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.7rem;
  color: var(--text-dark);
}

.n8n-code__content {
  margin: 0;
  padding: 1rem;
  background: var(--bg);
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.7rem;
  line-height: 1.6;
  color: var(--text-muted);
  overflow-x: auto;
}

.n8n-code__content code {
  color: var(--primary);
}

/* ============================================
   BENEFITS GRID
   ============================================ */
.benefits-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-md);
}

.benefit-card {
  padding: var(--space-md);
  border-radius: 0.75rem;
  border: 1px solid var(--border);
  text-align: center;
  transition: all 0.3s ease;
}

.benefit-card:hover {
  border-color: var(--primary);
  transform: translateY(-5px);
}

.benefit-card__icon {
  font-size: 2rem;
  margin-bottom: var(--space-sm);
  display: block;
}

.benefit-card h4 {
  font-size: 0.95rem;
  margin-bottom: 0.5rem;
}

.benefit-card p {
  font-size: 0.8rem;
  color: var(--text-muted);
  margin: 0;
  line-height: 1.6;
}

/* ============================================
   CTA
   ============================================ */
.workflows-cta {
  text-align: center;
  padding: var(--space-xl);
  border-radius: 1rem;
  border: 1px solid var(--border);
}

.workflows-cta__visual {
  display: flex;
  justify-content: center;
  gap: var(--space-md);
  font-size: 2.5rem;
  margin-bottom: var(--space-md);
}

.workflows-cta h3 {
  font-size: 1.5rem;
  margin-bottom: var(--space-sm);
}

.workflows-cta p {
  color: var(--text-muted);
  max-width: 500px;
  margin: 0 auto var(--space-lg);
}

.workflows-cta__buttons {
  display: flex;
  justify-content: center;
  gap: var(--space-sm);
}

.btn {
  padding: 1rem 2rem;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.8rem;
  font-weight: 700;
  text-decoration: none;
  border-radius: 0.5rem;
  transition: all 0.3s ease;
}

.btn--primary {
  background: var(--primary);
  color: var(--bg);
}

.btn--primary:hover {
  background: #059669;
  box-shadow: 0 0 30px rgba(16, 185, 129, 0.5);
}

.btn--secondary {
  background: transparent;
  color: var(--text-main);
  border: 1px solid var(--border);
}

.btn--secondary:hover {
  border-color: var(--primary);
  color: var(--primary);
}

/* ============================================
   SCROLL REVEAL
   ============================================ */
.reveal {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), 
              transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

.reveal.revealed {
  opacity: 1;
  transform: translateY(0);
}

@media (prefers-reduced-motion: reduce) {
  .reveal {
    opacity: 1;
    transform: none;
    transition: none;
  }
  
  .status-badge__dot {
    animation: none;
  }
}

/* ============================================
   RESPONSIVE
   ============================================ */
@media (max-width: 1200px) {
  .workflows-grid {
    grid-template-columns: 1fr;
  }
  
  .n8n-showcase {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 1024px) {
  .workflows-hero .container {
    grid-template-columns: 1fr;
    text-align: center;
  }
  
  .live-dashboard {
    max-width: 400px;
    margin: var(--space-lg) auto 0;
  }
  
  .benefits-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .n8n-features {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 768px) {
  .workflows-hero__stats {
    flex-direction: column;
  }
  
  .benefits-grid {
    grid-template-columns: 1fr;
  }
  
  .n8n-features {
    grid-template-columns: 1fr;
  }
  
  .workflows-cta__buttons {
    flex-direction: column;
  }
  
  .workflow-card__flow {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .flow-step__arrow {
    transform: rotate(90deg);
  }
}
</style>
