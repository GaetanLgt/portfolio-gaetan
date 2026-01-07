<template>
  <div class="apps-hub">
    <a href="#main-content" class="skip-link">Aller au contenu principal</a>

    <!-- BACKGROUND -->
    <div class="hub-bg" aria-hidden="true">
      <div class="grid-pattern"></div>
      <div class="glow-orb glow-orb--1"></div>
      <div class="glow-orb glow-orb--2"></div>
    </div>

    <!-- HERO -->
    <section class="hub-hero" aria-labelledby="hero-title">
      <div class="container" id="main-content">
        <div class="hero-badge">
          <span class="badge-icon">🧰</span>
          <span class="badge-text">GL TOOLBOX</span>
        </div>

        <h1 id="hero-title" class="hero-title">
          <span class="title-pre">Boîte à outils</span>
          <span class="title-main">APPLICATIONS</span>
          <span class="title-sub">Outils dev gratuits, directement dans votre navigateur</span>
        </h1>

        <p class="hero-desc">
          Une collection d'utilitaires pour développeurs. Pas d'inscription, pas de tracking, 
          tout fonctionne côté client. <strong>100% gratuit</strong>.
        </p>

        <div class="hero-stats">
          <div class="stat">
            <span class="stat-value">{{ apps.length }}</span>
            <span class="stat-label">Outils</span>
          </div>
          <div class="stat">
            <span class="stat-value">0</span>
            <span class="stat-label">Données collectées</span>
          </div>
          <div class="stat">
            <span class="stat-value">∞</span>
            <span class="stat-label">Utilisations</span>
          </div>
        </div>
      </div>
    </section>

    <!-- FILTERS -->
    <section class="filter-section">
      <div class="container">
        <div class="filter-bar">
          <button 
            class="filter-btn" 
            :class="{ active: activeCategory === 'all' }" 
            @click="activeCategory = 'all'"
          >
            🎯 Tous ({{ apps.length }})
          </button>
          <button 
            v-for="cat in categories" 
            :key="cat.id" 
            class="filter-btn" 
            :class="{ active: activeCategory === cat.id }" 
            @click="activeCategory = cat.id"
          >
            {{ cat.icon }} {{ cat.name }} ({{ getCountByCategory(cat.id) }})
          </button>
        </div>
      </div>
    </section>

    <!-- APPS GRID -->
    <section class="apps-section">
      <div class="container">
        <div class="apps-grid">
          <router-link 
            v-for="app in filteredApps" 
            :key="app.id" 
            :to="app.route"
            class="app-card"
            :class="{ 'app-card--featured': app.featured, 'app-card--new': app.isNew }"
          >
            <span v-if="app.isNew" class="app-badge">Nouveau</span>
            <span v-else-if="app.featured" class="app-badge app-badge--featured">⭐ Populaire</span>
            
            <div class="app-icon">{{ app.icon }}</div>
            
            <div class="app-content">
              <h2 class="app-title">{{ app.name }}</h2>
              <p class="app-desc">{{ app.description }}</p>
              
              <div class="app-tags">
                <span v-for="tag in app.tags" :key="tag" class="app-tag">{{ tag }}</span>
              </div>
            </div>
            
            <div class="app-arrow">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
              </svg>
            </div>
          </router-link>
        </div>
      </div>
    </section>

    <!-- INFO SECTION -->
    <section class="info-section">
      <div class="container">
        <div class="info-grid">
          <div class="info-card">
            <span class="info-icon">🔒</span>
            <h3>100% Côté Client</h3>
            <p>Toutes les opérations sont effectuées dans votre navigateur. Aucune donnée n'est envoyée à un serveur.</p>
          </div>
          <div class="info-card">
            <span class="info-icon">⚡</span>
            <h3>Instantané</h3>
            <p>Pas de temps de chargement, pas d'API externe. Les résultats sont immédiats.</p>
          </div>
          <div class="info-card">
            <span class="info-icon">🆓</span>
            <h3>Gratuit, Pour Toujours</h3>
            <p>Pas de compte, pas de limite d'utilisation, pas de publicité. Utilisez sans modération.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="cta-section">
      <div class="container">
        <div class="cta-card glass">
          <h2>Besoin d'un outil sur-mesure ?</h2>
          <p>Ces outils vous plaisent ? Je peux créer des applications métier adaptées à vos besoins spécifiques.</p>
          <router-link to="/contact" class="btn-primary">
            💬 Discutons de votre projet
          </router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const activeCategory = ref('all');

const categories = [
  { id: 'business', name: 'Apps Métier', icon: '🏭' },
  { id: 'ai', name: 'Outils IA', icon: '🧠' },
  { id: 'agents', name: 'Agents IA', icon: '🤖' },
  { id: 'blueprint', name: 'Blueprints', icon: '📐' },
  { id: 'converter', name: 'Convertisseurs', icon: '🔄' },
  { id: 'generator', name: 'Générateurs', icon: '⚙️' },
  { id: 'formatter', name: 'Formateurs', icon: '📝' },
  { id: 'encoder', name: 'Encodeurs', icon: '🔐' },
  { id: 'builder', name: 'Builders', icon: '🛠️' }
];

const apps = [
  // === APPS MÉTIER ===
  {
    id: 'ark-config-manager',
    name: 'ARK Config Manager',
    description: 'Gestionnaire de configuration serveur ARK: INI, mods, stacks, engrams. Outil admin ARKADIA.',
    icon: '🦖',
    category: 'business',
    route: '/apps/ark-config',
    tags: ['ARK', 'Gaming', 'Admin', 'Serveur'],
    featured: true,
    isNew: true
  },
  {
    id: 'print3d-manager',
    name: '3D Print Manager',
    description: 'Gestion complète d\'entreprise d\'impression 3D : commandes, stocks, imprimantes, facturation.',
    icon: '🖨️',
    category: 'business',
    route: '/apps/print3d-manager',
    tags: ['Impression 3D', 'Gestion', 'Facturation'],
    featured: true,
    isNew: true
  },
  {
    id: 'teacher-assistant',
    name: 'Prof Assistant IA',
    description: 'Chatbot pédagogique, générateur de quiz, aide à la correction, gestion de classe.',
    icon: '🎓',
    category: 'business',
    route: '/apps/teacher-assistant',
    tags: ['Éducation', 'IA', 'Quiz', 'Correction'],
    featured: true,
    isNew: true
  },
  {
    id: 'privacy-shield',
    name: 'Privacy Shield',
    description: 'Formation cybersécurité interactive : 7 modules, quiz, outils pratiques, certificat.',
    icon: '🛡️',
    category: 'business',
    route: '/apps/privacy-shield',
    tags: ['RGPD', 'Sécurité', 'Formation', 'Vie privée'],
    featured: true,
    isNew: true
  },
  {
    id: 'hexworld',
    name: 'HEXGEN',
    description: 'Générateur de MON NFT avec système hexagonal : 6 attributs, combat, collection, export.',
    icon: '⬡',
    category: 'business',
    route: '/apps/hexworld',
    tags: ['NFT', 'Gaming', 'Générateur', 'Blockchain'],
    featured: true,
    isNew: true
  },
  // === OUTILS IA ===
  {
    id: 'prompt-builder',
    name: 'Prompt Builder',
    description: 'Construisez des prompts structurés et optimisés pour les LLMs avec templates.',
    icon: '🧠',
    category: 'ai',
    route: '/apps/prompt-builder',
    tags: ['LLM', 'GPT', 'Claude'],
    featured: true,
    isNew: true
  },
  {
    id: 'token-counter',
    name: 'Token Counter',
    description: 'Estimez le nombre de tokens pour GPT-4, Claude, Llama. Calculez les coûts.',
    icon: '🔢',
    category: 'ai',
    route: '/apps/token-counter',
    tags: ['Tokens', 'GPT', 'Coûts'],
    featured: true,
    isNew: true
  },
  {
    id: 'json-schema-generator',
    name: 'JSON Schema Generator',
    description: 'Générez des schémas JSON pour valider vos données et APIs.',
    icon: '📐',
    category: 'ai',
    route: '/apps/json-schema',
    tags: ['Schema', 'Validation', 'API'],
    featured: false,
    isNew: true
  },
  {
    id: 'api-tester',
    name: 'API Tester',
    description: 'Testez vos endpoints REST avec un client HTTP simple et intuitif.',
    icon: '🔌',
    category: 'ai',
    route: '/apps/api-tester',
    tags: ['REST', 'HTTP', 'Debug'],
    featured: false,
    isNew: true
  },
  {
    id: 'cron-builder',
    name: 'Cron Builder',
    description: 'Créez et validez vos expressions cron pour automatiser vos tâches.',
    icon: '⏰',
    category: 'ai',
    route: '/apps/cron-builder',
    tags: ['Cron', 'Automation', 'Schedule'],
    featured: false,
    isNew: true
  },
  // === CONVERTISSEURS ===
  {
    id: 'color-converter',
    name: 'Color Converter',
    description: 'Convertissez les couleurs entre HEX, RGB, HSL et HSV. Visualisez en temps réel.',
    icon: '🎨',
    category: 'converter',
    route: '/apps/colors',
    tags: ['HEX', 'RGB', 'HSL'],
    featured: true,
    isNew: false
  },
  {
    id: 'timestamp-converter',
    name: 'Timestamp Converter',
    description: 'Convertissez entre timestamps Unix et dates lisibles. Multi-fuseaux horaires.',
    icon: '⏰',
    category: 'converter',
    route: '/apps/timestamp',
    tags: ['Unix', 'Date', 'Epoch'],
    featured: false,
    isNew: true
  },
  {
    id: 'json-formatter',
    name: 'JSON Formatter',
    description: 'Formatez, validez et minifiez votre JSON. Détection des erreurs de syntaxe.',
    icon: '📋',
    category: 'formatter',
    route: '/apps/json',
    tags: ['JSON', 'Validation', 'Pretty Print'],
    featured: true,
    isNew: false
  },
  {
    id: 'regex-tester',
    name: 'Regex Tester',
    description: 'Testez et validez vos expressions régulières en temps réel avec highlighting.',
    icon: '🔍',
    category: 'formatter',
    route: '/apps/regex',
    tags: ['Regex', 'Pattern', 'Test'],
    featured: true,
    isNew: false
  },
  {
    id: 'markdown-preview',
    name: 'Markdown Preview',
    description: 'Éditeur Markdown avec prévisualisation temps réel et export HTML.',
    icon: '📝',
    category: 'formatter',
    route: '/apps/markdown',
    tags: ['Markdown', 'Preview', 'HTML'],
    featured: false,
    isNew: true
  },
  {
    id: 'diff-checker',
    name: 'Diff Checker',
    description: 'Comparez deux textes et visualisez les différences ligne par ligne.',
    icon: '📊',
    category: 'formatter',
    route: '/apps/diff',
    tags: ['Diff', 'Compare', 'Text'],
    featured: false,
    isNew: true
  },
  {
    id: 'hash-generator',
    name: 'Hash Generator',
    description: 'Générez des empreintes MD5, SHA-1, SHA-256, SHA-512 instantanément.',
    icon: '🔐',
    category: 'encoder',
    route: '/apps/hash',
    tags: ['MD5', 'SHA', 'Crypto'],
    featured: false,
    isNew: false
  },
  {
    id: 'base64',
    name: 'Base64 Encoder',
    description: 'Encodez et décodez du texte ou des fichiers en Base64.',
    icon: '🔒',
    category: 'encoder',
    route: '/apps/base64',
    tags: ['Base64', 'Encode', 'Decode'],
    featured: false,
    isNew: false
  },
  {
    id: 'lorem-generator',
    name: 'Lorem Ipsum',
    description: 'Générez du texte placeholder pour vos maquettes. Paragraphes, mots ou phrases.',
    icon: '📄',
    category: 'generator',
    route: '/apps/lorem',
    tags: ['Lorem', 'Placeholder', 'Text'],
    featured: false,
    isNew: false
  },
  {
    id: 'password-generator',
    name: 'Password Generator',
    description: 'Créez des mots de passe forts et sécurisés avec options personnalisables.',
    icon: '🔑',
    category: 'generator',
    route: '/apps/password',
    tags: ['Sécurité', 'Password', 'Random'],
    featured: false,
    isNew: false
  },
  {
    id: 'uuid-generator',
    name: 'UUID Generator',
    description: 'Générez des identifiants uniques UUID v4. Copiez en un clic.',
    icon: '🆔',
    category: 'generator',
    route: '/apps/uuid',
    tags: ['UUID', 'GUID', 'Unique ID'],
    featured: false,
    isNew: false
  },
  {
    id: 'text-animator',
    name: 'Text Animator',
    description: 'Créez du texte animé pour forums, Discord et réseaux sociaux. Export CSS/PNG.',
    icon: '✨',
    category: 'generator',
    route: '/apps/text-animator',
    tags: ['Animation', 'CSS', 'Forum'],
    featured: true,
    isNew: true
  },
  {
    id: 'faq-generator',
    name: 'FAQ Generator',
    description: 'Créez des FAQ élégantes avec catégories et export HTML/Markdown/JSON.',
    icon: '❓',
    category: 'builder',
    route: '/apps/faq',
    tags: ['FAQ', 'HTML', 'Markdown'],
    featured: false,
    isNew: true
  },
  {
    id: 'chatbot-builder',
    name: 'Chatbot Builder',
    description: 'Créez des arbres de dialogue pour chatbots avec prévisualisation et export JSON.',
    icon: '🤖',
    category: 'builder',
    route: '/apps/chatbot',
    tags: ['Chatbot', 'Flow', 'JSON'],
    featured: true,
    isNew: true
  },
  {
    id: 'qr-code-generator',
    name: 'QR Code Generator',
    description: 'Générez des QR codes personnalisés pour URL, WiFi, vCard et plus.',
    icon: '📱',
    category: 'generator',
    route: '/apps/qr-code',
    tags: ['QR', 'URL', 'WiFi'],
    featured: false,
    isNew: true
  },
  // === OUTILS DATA ===
  {
    id: 'jwt-decoder',
    name: 'JWT Decoder',
    description: 'Décodez et analysez vos tokens JWT. Visualisez header, payload et claims.',
    icon: '🔐',
    category: 'ai',
    route: '/apps/jwt-decoder',
    tags: ['JWT', 'Token', 'Auth'],
    featured: false,
    isNew: true
  },
  {
    id: 'csv-json-converter',
    name: 'CSV ↔ JSON',
    description: 'Convertissez vos données entre CSV et JSON. Aperçu tableau inclus.',
    icon: '📊',
    category: 'converter',
    route: '/apps/csv-json',
    tags: ['CSV', 'JSON', 'Data'],
    featured: false,
    isNew: true
  },
  {
    id: 'markdown-table',
    name: 'Markdown Table',
    description: 'Créez des tableaux Markdown visuellement. Import CSV, templates.',
    icon: '📋',
    category: 'formatter',
    route: '/apps/markdown-table',
    tags: ['Markdown', 'Table', 'Export'],
    featured: false,
    isNew: true
  },
  {
    id: 'webhook-tester',
    name: 'Webhook Tester',
    description: 'Générez des URLs de test et inspectez les requêtes webhook.',
    icon: '🪝',
    category: 'ai',
    route: '/apps/webhook-tester',
    tags: ['Webhook', 'HTTP', 'Debug'],
    featured: false,
    isNew: true
  },
  {
    id: 'openapi-viewer',
    name: 'OpenAPI Viewer',
    description: 'Visualisez et explorez vos spécifications OpenAPI/Swagger.',
    icon: '📖',
    category: 'ai',
    route: '/apps/openapi',
    tags: ['OpenAPI', 'Swagger', 'API'],
    featured: false,
    isNew: true
  },
  // === AGENTS IA ===
  {
    id: 'agent-jarvis-router',
    name: 'JARVIS Router',
    description: 'Orchestrez des requêtes complexes vers plusieurs agents IA.',
    icon: '🎯',
    category: 'agents',
    route: '/apps/agent/jarvis',
    tags: ['Orchestration', 'Multi-Agent', 'Routing'],
    featured: true,
    isNew: true
  },
  {
    id: 'agent-edith-scanner',
    name: 'EDITH Scanner',
    description: 'Analysez la sécurité de vos projets et dépendances.',
    icon: '🛡️',
    category: 'agents',
    route: '/apps/agent/edith',
    tags: ['Security', 'Audit', 'CVE'],
    featured: true,
    isNew: true
  },
  {
    id: 'agent-ultron-monitor',
    name: 'ULTRON Monitor',
    description: 'Surveillez vos services et métriques en temps réel.',
    icon: '📊',
    category: 'agents',
    route: '/apps/agent/ultron',
    tags: ['Monitoring', 'Metrics', 'Alerts'],
    featured: false,
    isNew: true
  },
  {
    id: 'agent-friday-kb',
    name: 'FRIDAY Knowledge Base',
    description: 'Créez une base de connaissances RAG pour votre chatbot.',
    icon: '🎧',
    category: 'agents',
    route: '/apps/agent/friday',
    tags: ['RAG', 'Chatbot', 'Support'],
    featured: false,
    isNew: true
  },
  {
    id: 'agent-vision-content',
    name: 'VISION Content Gen',
    description: 'Générez du contenu optimisé SEO pour vos projets.',
    icon: '📢',
    category: 'agents',
    route: '/apps/agent/vision',
    tags: ['Content', 'SEO', 'Writing'],
    featured: false,
    isNew: true
  },
  {
    id: 'agent-veronica-pipeline',
    name: 'VERONICA Pipeline',
    description: 'Générez des configurations CI/CD pour GitHub Actions, GitLab CI...',
    icon: '🚀',
    category: 'agents',
    route: '/apps/agent/veronica',
    tags: ['CI/CD', 'DevOps', 'Pipeline'],
    featured: true,
    isNew: true
  },
  {
    id: 'agent-pepper-invoice',
    name: 'PEPPER Invoice',
    description: 'Créez des devis et factures professionnels en quelques clics.',
    icon: '💰',
    category: 'agents',
    route: '/apps/agent/pepper',
    tags: ['Invoice', 'Billing', 'PDF'],
    featured: false,
    isNew: true
  },
  // === BLUEPRINTS ===
  {
    id: 'flowchart-builder',
    name: 'Flowchart Builder',
    description: 'Créez des diagrammes de flux et d\'algorithmes interactifs avec export SVG.',
    icon: '🔀',
    category: 'blueprint',
    route: '/apps/flowchart',
    tags: ['Flowchart', 'Diagram', 'SVG'],
    featured: true,
    isNew: true
  },
  {
    id: 'erd-designer',
    name: 'ERD Designer',
    description: 'Concevez vos diagrammes entité-relation et générez le SQL.',
    icon: '🗄️',
    category: 'blueprint',
    route: '/apps/erd',
    tags: ['Database', 'SQL', 'Schema'],
    featured: true,
    isNew: true
  },
  {
    id: 'wireframe-builder',
    name: 'Wireframe Builder',
    description: 'Créez des maquettes UI low-fidelity avec drag & drop.',
    icon: '🖼️',
    category: 'blueprint',
    route: '/apps/wireframe',
    tags: ['UI', 'Mockup', 'Design'],
    featured: false,
    isNew: true
  },
  {
    id: 'sitemap-generator',
    name: 'Sitemap Generator',
    description: 'Créez des sitemaps visuels et exportez en XML pour le SEO.',
    icon: '🗺️',
    category: 'blueprint',
    route: '/apps/sitemap',
    tags: ['SEO', 'XML', 'Structure'],
    featured: false,
    isNew: true
  }
];

const getCountByCategory = (catId) => apps.filter(a => a.category === catId).length;

const filteredApps = computed(() => {
  if (activeCategory.value === 'all') return apps;
  return apps.filter(a => a.category === activeCategory.value);
});
</script>

<style scoped>
.apps-hub {
  min-height: 100vh;
  background: var(--bg-primary);
  position: relative;
  overflow-x: hidden;
}

/* Background */
.hub-bg {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
}

.grid-pattern {
  position: absolute;
  inset: 0;
  background-image: 
    linear-gradient(rgba(0, 255, 136, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 255, 136, 0.03) 1px, transparent 1px);
  background-size: 50px 50px;
}

.glow-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(100px);
  opacity: 0.3;
}

.glow-orb--1 {
  width: 600px;
  height: 600px;
  background: var(--primary);
  top: -200px;
  right: -200px;
  animation: float 20s ease-in-out infinite;
}

.glow-orb--2 {
  width: 400px;
  height: 400px;
  background: var(--accent);
  bottom: -100px;
  left: -100px;
  animation: float 15s ease-in-out infinite reverse;
}

@keyframes float {
  0%, 100% { transform: translate(0, 0); }
  50% { transform: translate(30px, 30px); }
}

/* Hero */
.hub-hero {
  position: relative;
  z-index: 1;
  padding: calc(80px + var(--space-xl)) 0 var(--space-xl);
  text-align: center;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: rgba(0, 255, 136, 0.1);
  border: 1px solid rgba(0, 255, 136, 0.3);
  border-radius: 2rem;
  margin-bottom: 1.5rem;
}

.badge-icon {
  font-size: 1.25rem;
}

.badge-text {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--primary);
  letter-spacing: 0.1em;
}

.hero-title {
  margin-bottom: 1.5rem;
}

.title-pre {
  display: block;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.8rem;
  color: var(--text-muted);
  letter-spacing: 0.2em;
  text-transform: uppercase;
  margin-bottom: 0.5rem;
}

.title-main {
  display: block;
  font-size: clamp(2.5rem, 8vw, 5rem);
  font-weight: 800;
  background: linear-gradient(135deg, #fff 0%, var(--primary) 50%, var(--accent) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1.1;
}

.title-sub {
  display: block;
  font-size: 1rem;
  font-weight: 400;
  color: var(--text-muted);
  margin-top: 0.75rem;
}

.hero-desc {
  max-width: 600px;
  margin: 0 auto 2rem;
  font-size: 1.1rem;
  color: var(--text-secondary);
  line-height: 1.7;
}

.hero-stats {
  display: flex;
  justify-content: center;
  gap: 3rem;
  flex-wrap: wrap;
}

.stat {
  text-align: center;
}

.stat-value {
  display: block;
  font-family: 'JetBrains Mono', monospace;
  font-size: 2rem;
  font-weight: 700;
  color: var(--primary);
}

.stat-label {
  font-size: 0.8rem;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* Filter Section */
.filter-section {
  position: relative;
  z-index: 1;
  padding: var(--space-md) 0;
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
}

.filter-bar {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  justify-content: center;
}

.filter-btn {
  padding: 0.5rem 1rem;
  background: transparent;
  border: 1px solid var(--border);
  border-radius: 2rem;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.8rem;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.3s ease;
}

.filter-btn:hover {
  border-color: var(--primary);
  color: var(--primary);
}

.filter-btn.active {
  background: var(--primary);
  border-color: var(--primary);
  color: var(--bg-primary);
}

/* Apps Grid */
.apps-section {
  position: relative;
  z-index: 1;
  padding: var(--space-xl) 0;
}

.apps-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: var(--space-md);
}

.app-card {
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid var(--border);
  border-radius: 1rem;
  text-decoration: none;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}

.app-card::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(0, 255, 136, 0.05) 0%, transparent 50%);
  opacity: 0;
  transition: opacity 0.4s ease;
}

.app-card:hover {
  border-color: var(--primary);
  transform: translateY(-4px);
  box-shadow: 0 20px 40px rgba(0, 255, 136, 0.1);
}

.app-card:hover::before {
  opacity: 1;
}

.app-card--featured {
  border-color: rgba(0, 255, 136, 0.3);
}

.app-card--new {
  border-color: rgba(255, 193, 7, 0.3);
}

.app-badge {
  position: absolute;
  top: 1rem;
  right: 1rem;
  padding: 0.25rem 0.75rem;
  background: rgba(255, 193, 7, 0.2);
  border: 1px solid rgba(255, 193, 7, 0.5);
  border-radius: 1rem;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.65rem;
  font-weight: 600;
  color: #ffc107;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.app-badge--featured {
  background: rgba(0, 255, 136, 0.1);
  border-color: rgba(0, 255, 136, 0.3);
  color: var(--primary);
}

.app-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  filter: grayscale(0.2);
  transition: filter 0.3s ease, transform 0.3s ease;
}

.app-card:hover .app-icon {
  filter: grayscale(0);
  transform: scale(1.1);
}

.app-content {
  flex: 1;
}

.app-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-main);
  margin-bottom: 0.5rem;
}

.app-desc {
  font-size: 0.9rem;
  color: var(--text-muted);
  line-height: 1.6;
  margin-bottom: 1rem;
}

.app-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.app-tag {
  padding: 0.2rem 0.5rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 4px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.65rem;
  color: var(--text-muted);
}

.app-arrow {
  position: absolute;
  bottom: 1.5rem;
  right: 1.5rem;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 255, 136, 0.1);
  border-radius: 50%;
  color: var(--primary);
  opacity: 0;
  transform: translateX(-10px);
  transition: all 0.3s ease;
}

.app-card:hover .app-arrow {
  opacity: 1;
  transform: translateX(0);
}

/* Info Section */
.info-section {
  position: relative;
  z-index: 1;
  padding: var(--space-xl) 0;
  background: rgba(0, 0, 0, 0.2);
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--space-md);
}

.info-card {
  padding: 2rem;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid var(--border);
  border-radius: 1rem;
  text-align: center;
}

.info-icon {
  font-size: 2.5rem;
  display: block;
  margin-bottom: 1rem;
}

.info-card h3 {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.info-card p {
  font-size: 0.9rem;
  color: var(--text-muted);
  line-height: 1.6;
}

/* CTA Section */
.cta-section {
  position: relative;
  z-index: 1;
  padding: var(--space-xl) 0;
}

.cta-card {
  padding: 3rem;
  text-align: center;
  border-radius: 1.5rem;
  border: 1px solid var(--border);
  background: rgba(0, 255, 136, 0.02);
}

.cta-card h2 {
  font-size: 1.75rem;
  margin-bottom: 1rem;
}

.cta-card p {
  max-width: 500px;
  margin: 0 auto 1.5rem;
  color: var(--text-muted);
}

.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 1.75rem;
  background: var(--primary);
  color: var(--bg-primary);
  border-radius: 0.5rem;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(0, 255, 136, 0.3);
}

/* Responsive */
@media (max-width: 768px) {
  .hero-stats {
    gap: 2rem;
  }
  
  .apps-grid {
    grid-template-columns: 1fr;
  }
  
  .filter-bar {
    justify-content: flex-start;
    overflow-x: auto;
    padding-bottom: 0.5rem;
  }
}
</style>
