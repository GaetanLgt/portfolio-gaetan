<template>
  <Transition name="feed-morph">
    <div v-if="show" class="neural-feed" @click.self="$emit('close')">
      <!-- Atmospheric Background -->
      <div class="feed-atmosphere">
        <div class="grid-floor"></div>
        <div class="scan-line"></div>
        <div class="noise-overlay"></div>
        <div class="glow-orbs">
          <div class="orb orb-1"></div>
          <div class="orb orb-2"></div>
          <div class="orb orb-3"></div>
        </div>
      </div>

      <div class="feed-shell">
        <!-- Glitch Header -->
        <header class="feed-header">
          <div class="header-left">
            <div class="logo-cluster">
              <div class="logo-ring">
                <svg viewBox="0 0 100 100" class="ring-svg">
                  <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" stroke-width="1" stroke-dasharray="8 4" />
                  <circle cx="50" cy="50" r="38" fill="none" stroke="currentColor" stroke-width="0.5" opacity="0.5" />
                </svg>
                <span class="logo-icon">📡</span>
              </div>
              <div class="logo-text">
                <h1 class="glitch-text" data-text="NEURAL FEED">NEURAL FEED</h1>
                <div class="logo-sub">
                  <span class="typing-text">{{ typingText }}</span>
                  <span class="cursor">▊</span>
                </div>
              </div>
            </div>
          </div>
          
          <div class="header-right">
            <div class="live-stats">
              <div class="stat-pill">
                <span class="stat-dot"></span>
                <span>{{ feedItems.length }} SIGNALS</span>
              </div>
              <div class="stat-pill accent">
                <span>{{ currentTime }}</span>
              </div>
            </div>
            <button class="close-btn" @click="$emit('close')" aria-label="Fermer">
              <span class="close-x">✕</span>
              <span class="close-label">ESC</span>
            </button>
          </div>
        </header>

        <!-- Category Orbit -->
        <nav class="category-orbit">
          <button 
            v-for="(tab, index) in tabs" 
            :key="tab.id"
            class="orbit-node"
            :class="{ active: activeTab === tab.id, featured: tab.featured }"
            :style="{ '--delay': `${index * 0.05}s`, '--hue': tab.hue }"
            @click="activeTab = tab.id"
          >
            <span class="node-icon">{{ tab.icon }}</span>
            <span class="node-label">{{ tab.name }}</span>
            <span class="node-count" v-if="getCountByCategory(tab.id) > 0">{{ getCountByCategory(tab.id) }}</span>
            <div class="node-glow"></div>
          </button>
        </nav>

        <!-- Content Matrix -->
        <main class="content-matrix">
          <!-- Featured Signal (si existe) -->
          <Transition name="signal-morph">
            <article 
              v-if="featuredItem" 
              class="signal-featured"
              :key="featuredItem.id"
              @click="openItem(featuredItem)"
            >
              <div class="featured-bg">
                <div class="featured-grid"></div>
                <div class="featured-gradient"></div>
              </div>
              <div class="featured-content">
                <div class="featured-badge">
                  <span class="badge-icon">⚡</span>
                  <span>SIGNAL PRIORITAIRE</span>
                </div>
                <h2 class="featured-title">{{ featuredItem.title }}</h2>
                <p class="featured-desc">{{ featuredItem.description }}</p>
                <div class="featured-meta">
                  <span class="meta-category">{{ featuredItem.category }}</span>
                  <span class="meta-source">{{ featuredItem.source }}</span>
                  <div class="meta-tags">
                    <span v-for="tag in featuredItem.tags?.slice(0, 3)" :key="tag" class="tag">{{ tag }}</span>
                  </div>
                </div>
              </div>
              <div class="featured-icon">{{ featuredItem.icon }}</div>
            </article>
          </Transition>

          <!-- Signal Grid -->
          <div class="signal-grid">
            <TransitionGroup name="signal-stagger">
              <article 
                v-for="(item, index) in regularItems" 
                :key="item.id"
                class="signal-card"
                :class="[item.type, { 'is-new': item.isNew }]"
                :style="{ '--index': index, '--accent': item.accent || '120' }"
                @click="openItem(item)"
              >
                <!-- Card Header -->
                <div class="card-header">
                  <div class="card-icon-wrap">
                    <span class="card-icon">{{ item.icon }}</span>
                    <div class="icon-ring"></div>
                  </div>
                  <div class="card-meta">
                    <span class="meta-type">{{ item.category }}</span>
                    <span class="meta-date">{{ item.date }}</span>
                  </div>
                  <div class="card-indicator" v-if="item.isNew">NEW</div>
                </div>

                <!-- Card Body -->
                <div class="card-body">
                  <h3 class="card-title">{{ item.title }}</h3>
                  <p class="card-desc">{{ item.description }}</p>
                </div>

                <!-- Card Footer -->
                <div class="card-footer">
                  <div class="card-tags">
                    <span v-for="tag in item.tags?.slice(0, 2)" :key="tag" class="mini-tag">{{ tag }}</span>
                  </div>
                  <div class="card-source">
                    <span class="source-icon">◉</span>
                    <span>{{ item.source }}</span>
                  </div>
                </div>

                <!-- Hover Effects -->
                <div class="card-glow"></div>
                <div class="card-scan"></div>
              </article>
            </TransitionGroup>
          </div>
        </main>

        <!-- Wisdom Terminal -->
        <section class="wisdom-terminal">
          <div class="terminal-chrome">
            <div class="chrome-dots">
              <span></span><span></span><span></span>
            </div>
            <span class="chrome-title">WISDOM.exe</span>
          </div>
          <div class="terminal-body">
            <div class="terminal-prefix">
              <span class="prefix-icon">💬</span>
              <span class="prefix-label">CITATION DU JOUR</span>
            </div>
            <blockquote class="terminal-quote">
              <Transition name="quote-fade" mode="out-in">
                <div :key="currentQuoteIndex">
                  <p class="quote-text">"{{ currentQuote.text }}"</p>
                  <footer v-if="currentQuote.author" class="quote-author">— {{ currentQuote.author }}</footer>
                </div>
              </Transition>
            </blockquote>
            <button class="quote-shuffle" @click="nextQuote">
              <span class="shuffle-icon">🔀</span>
              <span>SHUFFLE</span>
            </button>
          </div>
        </section>

        <!-- Status Bar -->
        <footer class="feed-status">
          <div class="status-left">
            <span class="status-indicator"></span>
            <span>FEED ACTIF</span>
          </div>
          <div class="status-center">
            <div class="status-stat">
              <span class="stat-num">{{ feedItems.length }}</span>
              <span class="stat-label">SIGNAUX</span>
            </div>
            <div class="status-divider"></div>
            <div class="status-stat">
              <span class="stat-num">{{ tabs.length }}</span>
              <span class="stat-label">FLUX</span>
            </div>
            <div class="status-divider"></div>
            <div class="status-stat">
              <span class="stat-num">{{ quotes.length }}</span>
              <span class="stat-label">SAGESSES</span>
            </div>
          </div>
          <div class="status-right">
            <span class="version">v2.0.26</span>
          </div>
        </footer>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';

const props = defineProps({
  show: Boolean
});

const emit = defineEmits(['close']);

const activeTab = ref('all');
const currentTime = ref('');
const typingText = ref('');
const fullTypingText = 'Veille Tech & IA • Neo\'s Radar • GL Digital Lab';

// Tabs avec teintes pour variation visuelle
const tabs = [
  { id: 'all', name: 'Tous', icon: '🌐', hue: 120 },
  { id: 'ia', name: 'IA & LLM', icon: '🤖', hue: 180, featured: true },
  { id: 'dev', name: 'Dev & Archi', icon: '⚙️', hue: 60 },
  { id: 'quality', name: 'Qualité Web', icon: '✅', hue: 150 },
  { id: 'legal', name: 'RGPD & Legal', icon: '⚖️', hue: 280 },
  { id: 'social', name: 'Réseaux', icon: '🔗', hue: 320 },
  { id: 'security', name: 'Sécurité', icon: '🛡️', hue: 0 },
  { id: 'inspiration', name: 'Mindset', icon: '💡', hue: 45 }
];

// Feed Items - Contenu enrichi
const feedItems = ref([
  // ============ IA & LLM ============
  {
    id: 'perplexity-guide',
    type: 'featured',
    category: 'IA & LLM',
    categoryId: 'ia',
    icon: '📚',
    title: 'Guide Perplexity : 42 pages de playbook interne',
    description: 'Comment Perplexity utilise réellement l\'IA au quotidien : automatisation emails, préparation réunions, prompts métiers. Document interne rendu public.',
    tags: ['Perplexity', 'Productivité', 'Prompts'],
    source: 'Perplexity AI',
    date: 'Jan 2026',
    accent: '180',
    isNew: true
  },
  {
    id: 'chatgpt-features',
    type: 'standard',
    category: 'IA & LLM',
    categoryId: 'ia',
    icon: '🤖',
    title: 'ChatGPT : Toutes les fonctionnalités décryptées',
    description: 'Web search, Canvas, Mode Voix, Mémoire, GPTs customs... Le guide complet avec prompts types pour chaque feature.',
    tags: ['ChatGPT', 'OpenAI', 'Guide'],
    source: 'Infographie',
    date: 'Jan 2026',
    accent: '160'
  },
  {
    id: 'ia-not-button',
    type: 'quote',
    category: 'IA & LLM',
    categoryId: 'ia',
    icon: '⌨️',
    title: 'L\'IA ne suffit pas d\'appuyer sur un bouton',
    description: 'La vraie valeur est dans le guidage, le contexte et l\'expertise métier. Le prompt engineering est un skill, pas un click.',
    tags: ['Réflexion', 'Expertise'],
    source: 'Insight',
    date: 'Jan 2026',
    accent: '200'
  },
  {
    id: 'agents-280',
    type: 'featured',
    category: 'IA & LLM',
    categoryId: 'ia',
    icon: '🤖',
    title: '+280 Agents IA gratuits',
    description: 'Collection massive : agents conversationnels, automatisations n8n, templates Make/Zapier, ressources techniques prêtes à l\'emploi.',
    tags: ['Agents', 'Automation', 'Templates'],
    source: 'Collection',
    date: 'Jan 2026',
    accent: '170'
  },
  {
    id: 'sav-ia',
    type: 'standard',
    category: 'IA & LLM',
    categoryId: 'ia',
    icon: '🎧',
    title: 'SAV automatisé avec IA',
    description: 'Comprendre les demandes, répondre aux cas simples, escalader intelligemment. L\'IA au service du support client.',
    tags: ['SAV', 'Customer Service'],
    source: 'Use Case',
    date: 'Jan 2026',
    accent: '190'
  },

  // ============ DEV & ARCHI ============
  {
    id: 'iceberg-si',
    type: 'featured',
    category: 'Dev & Archi',
    categoryId: 'dev',
    icon: '❄️',
    title: 'L\'Iceberg du SI : Projet "simple" vs Réalité',
    description: 'En surface : un projet métier "simple". Sous l\'eau : dette technique, architecture complexe, legacy, code spaghetti, flux de données, audit préalable, urbanisation... La vraie complexité du SI.',
    tags: ['SI', 'Dette Technique', 'Legacy'],
    source: 'Infographie',
    date: 'Jan 2026',
    accent: '200',
    isNew: true
  },
  {
    id: 'digital-native-myth',
    type: 'featured',
    category: 'Dev & Archi',
    categoryId: 'dev',
    icon: '📊',
    title: 'Digital natives ≠ Maîtrise des outils',
    description: 'Scroller TikTok 3h ne rend pas compétent sur Excel. Être à l\'aise ≠ maîtriser. La vraie compétence : comprendre la logique pour devenir autonome.',
    tags: ['Formation', 'Excel', 'Autonomie'],
    source: 'LinkedIn',
    date: 'Jan 2026',
    accent: '60',
    isNew: true
  },
  {
    id: 'sudo-loco',
    type: 'featured',
    category: 'Dev & Archi',
    categoryId: 'dev',
    icon: '🚂',
    title: 'SUDO LOCO : Trains + Programmation',
    description: 'Jeu où on construit un réseau ferroviaire automatisé. Train = variables, stations = fonctions, destination = return. Aiguillages = IF. Three.js + logique.',
    tags: ['GameDev', 'Three.js', 'Puzzle'],
    source: 'LinkedIn',
    date: 'Jan 2026',
    accent: '50',
    isNew: true
  },
  {
    id: 'project-derailment',
    type: 'standard',
    category: 'Dev & Archi',
    categoryId: 'dev',
    icon: '⚠️',
    title: 'Pourquoi les projets IT dérapent',
    description: 'La règle du coût caché, le 80/20 des projets, le timing senior... Anti-patterns à éviter absolument.',
    tags: ['Gestion Projet', 'Anti-patterns'],
    source: 'Julien Rondel',
    date: 'Jan 2026',
    accent: '45'
  },
  {
    id: 'lol-ssl-bug',
    type: 'standard',
    category: 'Dev & Archi',
    categoryId: 'dev',
    icon: '🎮',
    title: 'League of Legends : Panne SSL mondiale',
    description: 'Un certificat expiré = panne mondiale. Workaround : reculer la date du PC. L\'automatisation seule ne suffit pas.',
    tags: ['SSL', 'DevOps', 'Post-mortem'],
    source: 'Gaming',
    date: 'Jan 2026',
    accent: '70'
  },

  // ============ QUALITÉ WEB (OPQUAST) ============
  {
    id: 'emotional-design',
    type: 'featured',
    category: 'Qualité Web',
    categoryId: 'quality',
    icon: '💖',
    title: 'Design Émotionnel : L\'art de toucher l\'utilisateur',
    description: '53% des consommateurs paient plus pour une expérience émotionnelle (Forrester 2024). Couleurs, typo, micro-interactions, empathie : créer une connexion unique qui fidélise.',
    tags: ['UX', 'Emotion', 'Conversion'],
    source: 'LinkedIn',
    date: 'Jan 2026',
    accent: '330',
    isNew: true
  },
  {
    id: 'opquast-certification',
    type: 'featured',
    category: 'Qualité Web',
    categoryId: 'quality',
    icon: '🏆',
    title: 'Certification OPQUAST : Le standard qualité web',
    description: '240 règles pour un web de qualité. Accessibilité, performance, SEO, sécurité, éco-conception. La référence francophone pour les pros du web.',
    tags: ['OPQUAST', 'Certification', 'Qualité'],
    source: 'OPQUAST',
    date: 'Jan 2026',
    accent: '150',
    isNew: true
  },
  {
    id: 'opquast-checklist',
    type: 'standard',
    category: 'Qualité Web',
    categoryId: 'quality',
    icon: '✅',
    title: 'Checklist OPQUAST : 240 bonnes pratiques',
    description: 'Contenus, navigation, formulaires, e-commerce, mobile, performance... Chaque règle est testable et actionnable.',
    tags: ['Checklist', 'Bonnes pratiques'],
    source: 'OPQUAST',
    date: 'Jan 2026',
    accent: '140'
  },
  {
    id: 'a11y-wcag',
    type: 'standard',
    category: 'Qualité Web',
    categoryId: 'quality',
    icon: '♿',
    title: 'Accessibilité WCAG : Les fondamentaux',
    description: 'Perceptible, Utilisable, Compréhensible, Robuste. Les 4 principes WCAG pour un web accessible à tous.',
    tags: ['Accessibilité', 'WCAG', 'A11Y'],
    source: 'W3C',
    date: 'Jan 2026',
    accent: '160'
  },
  {
    id: 'ecoconception-web',
    type: 'standard',
    category: 'Qualité Web',
    categoryId: 'quality',
    icon: '🌱',
    title: 'Éco-conception web : Réduire l\'empreinte',
    description: 'Optimiser images, lazy loading, CDN, code propre, hébergement vert. Chaque Ko compte pour la planète.',
    tags: ['Green IT', 'Performance'],
    source: 'Best Practices',
    date: 'Jan 2026',
    accent: '130'
  },

  // ============ RGPD & LEGAL (CNIL) ============
  {
    id: 'cnil-rgpd-guide',
    type: 'featured',
    category: 'RGPD & Legal',
    categoryId: 'legal',
    icon: '⚖️',
    title: 'CNIL : Guide RGPD pour développeurs',
    description: 'Consentement, cookies, données personnelles, durée de conservation, droits des utilisateurs. Le guide officiel CNIL pour être en conformité.',
    tags: ['RGPD', 'CNIL', 'Conformité'],
    source: 'CNIL',
    date: 'Jan 2026',
    accent: '280',
    isNew: true
  },
  {
    id: 'cookies-consent',
    type: 'standard',
    category: 'RGPD & Legal',
    categoryId: 'legal',
    icon: '🍪',
    title: 'Cookies : Les règles CNIL 2024-2026',
    description: 'Consentement explicite, refus aussi simple que l\'acceptation, pas de cookie walls. Les obligations légales clarifiées.',
    tags: ['Cookies', 'Consentement'],
    source: 'CNIL',
    date: 'Jan 2026',
    accent: '270'
  },
  {
    id: 'privacy-by-design',
    type: 'standard',
    category: 'RGPD & Legal',
    categoryId: 'legal',
    icon: '🔐',
    title: 'Privacy by Design : Intégrer la vie privée',
    description: 'Concevoir avec la protection des données dès le départ. Minimisation, pseudonymisation, chiffrement by default.',
    tags: ['Privacy', 'Architecture'],
    source: 'Best Practices',
    date: 'Jan 2026',
    accent: '290'
  },
  {
    id: 'dpo-role',
    type: 'standard',
    category: 'RGPD & Legal',
    categoryId: 'legal',
    icon: '👤',
    title: 'DPO : Quand et pourquoi en nommer un',
    description: 'Délégué à la Protection des Données. Obligatoire pour certaines structures, recommandé pour toutes. Rôle et responsabilités.',
    tags: ['DPO', 'Organisation'],
    source: 'CNIL',
    date: 'Jan 2026',
    accent: '260'
  },

  // ============ RÉSEAUX SOCIAUX INDÉPENDANTS ============
  {
    id: 'fediverse-intro',
    type: 'featured',
    category: 'Réseaux',
    categoryId: 'social',
    icon: '🌐',
    title: 'Fediverse : L\'alternative aux GAFAM',
    description: 'Mastodon, PeerTube, Pixelfed, Lemmy... Un écosystème décentralisé où chaque serveur est souverain. Protocole ActivityPub.',
    tags: ['Fediverse', 'Décentralisé', 'ActivityPub'],
    source: 'Fediverse.info',
    date: 'Jan 2026',
    accent: '320',
    isNew: true
  },
  {
    id: 'mastodon-setup',
    type: 'standard',
    category: 'Réseaux',
    categoryId: 'social',
    icon: '🐘',
    title: 'Mastodon : Créer sa propre instance',
    description: 'Héberger son serveur Mastodon. Docker, PostgreSQL, Redis. Contrôle total sur ses données et sa communauté.',
    tags: ['Mastodon', 'Self-hosted'],
    source: 'Documentation',
    date: 'Jan 2026',
    accent: '310'
  },
  {
    id: 'activitypub-protocol',
    type: 'standard',
    category: 'Réseaux',
    categoryId: 'social',
    icon: '🔗',
    title: 'ActivityPub : Le protocole qui unit le Fediverse',
    description: 'Standard W3C pour la fédération. Un compte = accès à tout l\'écosystème. Interopérabilité native.',
    tags: ['ActivityPub', 'W3C', 'Protocol'],
    source: 'W3C',
    date: 'Jan 2026',
    accent: '330'
  },
  {
    id: 'bluesky-atproto',
    type: 'standard',
    category: 'Réseaux',
    categoryId: 'social',
    icon: '🦋',
    title: 'Bluesky & AT Protocol : La nouvelle vague',
    description: 'Alternative Twitter avec portabilité des données. AT Protocol permet de migrer son identité entre serveurs.',
    tags: ['Bluesky', 'AT Protocol'],
    source: 'Bluesky',
    date: 'Jan 2026',
    accent: '200'
  },
  {
    id: 'sovereign-social',
    type: 'standard',
    category: 'Réseaux',
    categoryId: 'social',
    icon: '🏰',
    title: 'Réseau social souverain : Guide technique',
    description: 'Stack complète : Mastodon/Misskey + S3 + CDN + backup. Coûts, maintenance, modération. Tout pour lancer son instance.',
    tags: ['Souveraineté', 'Infrastructure'],
    source: 'Guide GL',
    date: 'Jan 2026',
    accent: '340'
  },

  // ============ SÉCURITÉ ============
  {
    id: 'cyber-9-layers',
    type: 'featured',
    category: 'Sécurité',
    categoryId: 'security',
    icon: '🛡️',
    title: '9 couches de cyberdéfense',
    description: 'IAM, Pare-feu, EDR/NDR, IDS/IPS, SIEM, Cloud Security, DLP, Incident Response, Sensibilisation. Defense in depth.',
    tags: ['Cybersécurité', 'Defense'],
    source: 'Infographie',
    date: 'Jan 2026',
    accent: '0'
  },
  {
    id: 'security-human',
    type: 'quote',
    category: 'Sécurité',
    categoryId: 'security',
    icon: '🪑',
    title: 'Entre la chaise et le clavier',
    description: 'La meilleure techno ne remplace pas la vigilance humaine. Formation et sensibilisation restent essentielles.',
    tags: ['Human Factor', 'Formation'],
    source: 'Insight',
    date: 'Jan 2026',
    accent: '10'
  },

  // ============ CLOUD ============
  {
    id: 'alloydb-postgres',
    type: 'standard',
    category: 'Dev & Archi',
    categoryId: 'dev',
    icon: '🗄️',
    title: 'AlloyDB : PostgreSQL x4 par Google',
    description: '4x plus rapide que PostgreSQL, 100x pour analytics. Base vectorielle intégrée. AlloyDB Omni pour le on-premise.',
    tags: ['PostgreSQL', 'Google Cloud'],
    source: 'Google Cloud',
    date: 'Jan 2026',
    accent: '55'
  },
  {
    id: 'cloud-translation',
    type: 'standard',
    category: 'Dev & Archi',
    categoryId: 'dev',
    icon: '🌍',
    title: 'Cloud Translation : IA multilingue',
    description: 'API de traduction neuronale. Gemini pour l\'adaptation, 100+ langues, glossaires custom. Scale illimité.',
    tags: ['Translation', 'NLP'],
    source: 'Google Cloud',
    date: 'Jan 2026',
    accent: '65'
  },

  // ============ INSPIRATION ============
  {
    id: 'silence-success',
    type: 'quote',
    category: 'Mindset',
    categoryId: 'inspiration',
    icon: '🏝️',
    title: 'Faites vos projets en silence...',
    description: '...et la réussite se chargera du bruit. Philosophie corse de l\'action discrète et efficace.',
    tags: ['Mindset', 'Focus'],
    source: 'Proverbe Corse',
    date: 'Jan 2026',
    accent: '45'
  },
  {
    id: 'brain-vs-heart',
    type: 'featured',
    category: 'Mindset',
    categoryId: 'inspiration',
    icon: '🧠',
    title: '2026 : Le cerveau prend le relais',
    description: 'Après des années de combat émotionnel (2021-2025), 2026 marque le passage à la stratégie. Vision 2026.',
    tags: ['2026', 'Vision', 'Stratégie'],
    source: 'Philosophie',
    date: 'Jan 2026',
    accent: '40'
  },
  {
    id: 'true-freedom',
    type: 'quote',
    category: 'Mindset',
    categoryId: 'inspiration',
    icon: '🌟',
    title: 'La vraie liberté',
    description: 'Commence le jour où tu comprends que tu n\'as plus rien à prouver à personne.',
    tags: ['Liberté', 'Growth'],
    source: 'Citation',
    date: 'Jan 2026',
    accent: '50'
  },
  {
    id: 'calm-power',
    type: 'quote',
    category: 'Mindset',
    categoryId: 'inspiration',
    icon: '🧘',
    title: 'Moins tu réagis, plus tu contrôles',
    description: 'La vraie force : refuser de donner ton énergie à ceux qui ne la méritent pas.',
    tags: ['Calme', 'Contrôle'],
    source: '@riannecolom',
    date: 'Jan 2026',
    accent: '35'
  },
  {
    id: 'cyberpunk-vibes',
    type: 'visual',
    category: 'Mindset',
    categoryId: 'inspiration',
    icon: '🌃',
    title: 'Night City Vibes',
    description: 'L\'ambiance cyberpunk qui inspire The Construct. Néons, buildings, atmosphère unique.',
    tags: ['Cyberpunk', 'Aesthetic'],
    source: 'Cyberpunk 2077',
    date: 'Jan 2026',
    accent: '280'
  }
]);

// Citations
const quotes = ref([
  { text: "Faites vos projets en silence, et la réussite se chargera du bruit.", author: "Proverbe Corse" },
  { text: "La vraie liberté commence le jour où tu comprends que tu n'as plus rien à prouver à personne.", author: null },
  { text: "Moins tu réagis, plus tu contrôles. Ton calme est leur plus grande défaite.", author: "@riannecolom" },
  { text: "Il ne suffit pas d'appuyer sur un bouton pour maîtriser l'IA.", author: null },
  { text: "Scroller TikTok 3h ne rend pas compétent sur un tableau croisé dynamique.", author: "Formateur anonyme" },
  { text: "C'est à mon tour désormais. Tu as beaucoup combattu.", author: "2026 au Cœur" },
  { text: "Free your mind.", author: "Morpheus" },
  { text: "There is a difference between knowing the path and walking the path.", author: "Morpheus" },
  { text: "Train = variables, stations = fonctions, destination = return.", author: "SUDO LOCO" },
  { text: "La qualité n'est pas un acte, c'est une habitude.", author: "Aristote" },
  { text: "Le design émotionnel place l'utilisateur au centre, en répondant à ses besoins émotionnels.", author: "Forrester 2024" },
  { text: "53% des consommateurs paient plus pour une expérience qui les touche.", author: "Étude Forrester" },
  { text: "Un projet 'simple' cache toujours un iceberg : legacy, dette technique, code spaghetti...", author: "Réalité du SI" }
]);

const currentQuoteIndex = ref(0);
const currentQuote = computed(() => quotes.value[currentQuoteIndex.value]);

// Filtered items
const filteredItems = computed(() => {
  if (activeTab.value === 'all') return feedItems.value;
  return feedItems.value.filter(item => item.categoryId === activeTab.value);
});

const featuredItem = computed(() => {
  return filteredItems.value.find(item => item.type === 'featured');
});

const regularItems = computed(() => {
  return filteredItems.value.filter(item => item.type !== 'featured' || item !== featuredItem.value);
});

function getCountByCategory(catId) {
  if (catId === 'all') return feedItems.value.length;
  return feedItems.value.filter(item => item.categoryId === catId).length;
}

function nextQuote() {
  currentQuoteIndex.value = (currentQuoteIndex.value + 1) % quotes.value.length;
}

function openItem(item) {
  if (item.url && item.url !== '#') {
    window.open(item.url, '_blank');
  }
}

// Typing effect
let typingInterval;
function startTyping() {
  let i = 0;
  typingInterval = setInterval(() => {
    if (i <= fullTypingText.length) {
      typingText.value = fullTypingText.slice(0, i);
      i++;
    } else {
      clearInterval(typingInterval);
    }
  }, 50);
}

// Clock
let clockInterval;
function updateClock() {
  const now = new Date();
  currentTime.value = now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

onMounted(() => {
  currentQuoteIndex.value = Math.floor(Math.random() * quotes.value.length);
  startTyping();
  updateClock();
  clockInterval = setInterval(updateClock, 1000);
});

onUnmounted(() => {
  clearInterval(typingInterval);
  clearInterval(clockInterval);
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap');

/* ============================================================================
   CSS VARIABLES & ROOT
   ============================================================================ */
.neural-feed {
  --neon-green: #00ff88;
  --neon-cyan: #00ffff;
  --neon-purple: #bf00ff;
  --bg-deep: #010a01;
  --bg-surface: rgba(0, 20, 5, 0.95);
  --border-glow: rgba(0, 255, 136, 0.3);
  --text-primary: #00ff88;
  --text-secondary: rgba(0, 255, 136, 0.6);
  --text-muted: rgba(0, 255, 136, 0.35);
  
  position: fixed;
  inset: 0;
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-deep);
  font-family: 'JetBrains Mono', monospace;
  color: var(--text-primary);
  overflow: hidden;
}

/* ============================================================================
   ATMOSPHERIC EFFECTS
   ============================================================================ */
.feed-atmosphere {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
}

.grid-floor {
  position: absolute;
  inset: 0;
  background: 
    linear-gradient(90deg, rgba(0, 255, 136, 0.03) 1px, transparent 1px),
    linear-gradient(rgba(0, 255, 136, 0.03) 1px, transparent 1px);
  background-size: 50px 50px;
  transform: perspective(500px) rotateX(60deg);
  transform-origin: center 120%;
  opacity: 0.5;
}

.scan-line {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--neon-green), transparent);
  animation: scanDown 4s linear infinite;
  opacity: 0.3;
}

@keyframes scanDown {
  0% { top: 0; }
  100% { top: 100%; }
}

.noise-overlay {
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
  opacity: 0.03;
  mix-blend-mode: overlay;
}

.glow-orbs {
  position: absolute;
  inset: 0;
}

.orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.15;
  animation: orbFloat 20s ease-in-out infinite;
}

.orb-1 {
  width: 400px;
  height: 400px;
  background: var(--neon-green);
  top: -100px;
  right: -100px;
  animation-delay: 0s;
}

.orb-2 {
  width: 300px;
  height: 300px;
  background: var(--neon-cyan);
  bottom: -50px;
  left: 10%;
  animation-delay: -7s;
}

.orb-3 {
  width: 250px;
  height: 250px;
  background: var(--neon-purple);
  top: 40%;
  left: -50px;
  animation-delay: -14s;
}

@keyframes orbFloat {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(30px, -20px) scale(1.1); }
  66% { transform: translate(-20px, 30px) scale(0.9); }
}

/* ============================================================================
   MAIN SHELL
   ============================================================================ */
.feed-shell {
  position: relative;
  width: 100%;
  max-width: 1400px;
  max-height: 95vh;
  margin: 1rem;
  padding: 0;
  background: var(--bg-surface);
  border: 1px solid var(--border-glow);
  border-radius: 24px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow:
    0 0 0 1px rgba(0, 255, 136, 0.1),
    0 25px 80px rgba(0, 0, 0, 0.8),
    0 0 100px rgba(0, 255, 136, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.03);
  z-index: 1;
}

/* ============================================================================
   HEADER
   ============================================================================ */
.feed-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem 2rem;
  border-bottom: 1px solid rgba(0, 255, 136, 0.15);
  background: rgba(0, 0, 0, 0.3);
  flex-shrink: 0;
}

.logo-cluster {
  display: flex;
  align-items: center;
  gap: 1.25rem;
}

.logo-ring {
  position: relative;
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ring-svg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  color: var(--neon-green);
  animation: ringRotate 20s linear infinite;
}

@keyframes ringRotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.logo-icon {
  font-size: 1.75rem;
  z-index: 1;
  filter: drop-shadow(0 0 8px var(--neon-green));
}

.logo-text h1 {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  margin: 0;
  background: linear-gradient(135deg, var(--neon-green), var(--neon-cyan));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.glitch-text {
  position: relative;
}

.glitch-text::before,
.glitch-text::after {
  content: attr(data-text);
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: var(--bg-surface);
  -webkit-background-clip: text;
  background-clip: text;
}

.glitch-text::before {
  left: 2px;
  text-shadow: -2px 0 var(--neon-cyan);
  clip: rect(24px, 550px, 90px, 0);
  animation: glitch-1 2s infinite linear alternate-reverse;
}

.glitch-text::after {
  left: -2px;
  text-shadow: -2px 0 var(--neon-purple);
  clip: rect(85px, 550px, 140px, 0);
  animation: glitch-2 2s infinite linear alternate-reverse;
}

@keyframes glitch-1 {
  0% { clip: rect(42px, 9999px, 44px, 0); }
  5% { clip: rect(12px, 9999px, 59px, 0); }
  10% { clip: rect(48px, 9999px, 29px, 0); }
  15% { clip: rect(42px, 9999px, 73px, 0); }
  20% { clip: rect(63px, 9999px, 27px, 0); }
  25% { clip: rect(34px, 9999px, 55px, 0); }
  30% { clip: rect(86px, 9999px, 73px, 0); }
  35% { clip: rect(20px, 9999px, 20px, 0); }
  40% { clip: rect(26px, 9999px, 60px, 0); }
  45% { clip: rect(25px, 9999px, 66px, 0); }
  50% { clip: rect(57px, 9999px, 98px, 0); }
  55% { clip: rect(5px, 9999px, 46px, 0); }
  60% { clip: rect(82px, 9999px, 31px, 0); }
  65% { clip: rect(54px, 9999px, 27px, 0); }
  70% { clip: rect(28px, 9999px, 99px, 0); }
  75% { clip: rect(45px, 9999px, 69px, 0); }
  80% { clip: rect(23px, 9999px, 85px, 0); }
  85% { clip: rect(54px, 9999px, 84px, 0); }
  90% { clip: rect(45px, 9999px, 47px, 0); }
  95% { clip: rect(37px, 9999px, 20px, 0); }
  100% { clip: rect(4px, 9999px, 91px, 0); }
}

@keyframes glitch-2 {
  0% { clip: rect(65px, 9999px, 100px, 0); }
  5% { clip: rect(52px, 9999px, 74px, 0); }
  10% { clip: rect(79px, 9999px, 85px, 0); }
  15% { clip: rect(75px, 9999px, 5px, 0); }
  20% { clip: rect(67px, 9999px, 61px, 0); }
  25% { clip: rect(14px, 9999px, 79px, 0); }
  30% { clip: rect(1px, 9999px, 66px, 0); }
  35% { clip: rect(86px, 9999px, 30px, 0); }
  40% { clip: rect(23px, 9999px, 98px, 0); }
  45% { clip: rect(85px, 9999px, 72px, 0); }
  50% { clip: rect(71px, 9999px, 75px, 0); }
  55% { clip: rect(2px, 9999px, 48px, 0); }
  60% { clip: rect(30px, 9999px, 16px, 0); }
  65% { clip: rect(59px, 9999px, 50px, 0); }
  70% { clip: rect(41px, 9999px, 62px, 0); }
  75% { clip: rect(2px, 9999px, 82px, 0); }
  80% { clip: rect(47px, 9999px, 73px, 0); }
  85% { clip: rect(3px, 9999px, 27px, 0); }
  90% { clip: rect(26px, 9999px, 55px, 0); }
  95% { clip: rect(42px, 9999px, 25px, 0); }
  100% { clip: rect(38px, 9999px, 49px, 0); }
}

.logo-sub {
  display: flex;
  align-items: center;
  font-size: 0.7rem;
  color: var(--text-muted);
  margin-top: 0.25rem;
}

.cursor {
  animation: blink 1s step-end infinite;
  color: var(--neon-green);
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

.header-right {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.live-stats {
  display: flex;
  gap: 0.75rem;
}

.stat-pill {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.4rem 0.8rem;
  background: rgba(0, 255, 136, 0.05);
  border: 1px solid rgba(0, 255, 136, 0.2);
  border-radius: 20px;
  font-size: 0.65rem;
  letter-spacing: 0.05em;
}

.stat-dot {
  width: 6px;
  height: 6px;
  background: var(--neon-green);
  border-radius: 50%;
  animation: pulse 2s ease-in-out infinite;
  box-shadow: 0 0 8px var(--neon-green);
}

@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(0.8); }
}

.stat-pill.accent {
  background: rgba(0, 255, 255, 0.05);
  border-color: rgba(0, 255, 255, 0.2);
  color: var(--neon-cyan);
  font-family: 'JetBrains Mono', monospace;
}

.close-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.2rem;
  padding: 0.6rem 0.8rem;
  background: rgba(255, 0, 0, 0.05);
  border: 1px solid rgba(255, 100, 100, 0.3);
  border-radius: 10px;
  color: #ff6666;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.close-btn:hover {
  background: rgba(255, 0, 0, 0.15);
  border-color: #ff6666;
  transform: scale(1.05);
}

.close-x {
  font-size: 1.1rem;
  font-weight: bold;
}

.close-label {
  font-size: 0.5rem;
  letter-spacing: 0.1em;
  opacity: 0.7;
}

/* ============================================================================
   CATEGORY ORBIT
   ============================================================================ */
.category-orbit {
  display: flex;
  gap: 0.5rem;
  padding: 1rem 2rem;
  overflow-x: auto;
  scrollbar-width: none;
  border-bottom: 1px solid rgba(0, 255, 136, 0.1);
  background: rgba(0, 0, 0, 0.2);
  flex-shrink: 0;
}

.category-orbit::-webkit-scrollbar {
  display: none;
}

.orbit-node {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1rem;
  background: rgba(0, 255, 136, 0.03);
  border: 1px solid rgba(0, 255, 136, 0.15);
  border-radius: 10px;
  color: var(--text-secondary);
  font-size: 0.7rem;
  font-weight: 500;
  white-space: nowrap;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  animation: nodeAppear 0.5s ease backwards;
  animation-delay: var(--delay);
  overflow: hidden;
}

@keyframes nodeAppear {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
}

.orbit-node:hover {
  background: rgba(0, 255, 136, 0.08);
  border-color: rgba(0, 255, 136, 0.4);
  color: var(--text-primary);
  transform: translateY(-2px);
}

.orbit-node.active {
  background: rgba(0, 255, 136, 0.15);
  border-color: var(--neon-green);
  color: var(--neon-green);
  box-shadow: 0 0 20px rgba(0, 255, 136, 0.2);
}

.orbit-node.featured {
  border-color: var(--neon-cyan);
}

.orbit-node.featured.active {
  border-color: var(--neon-cyan);
  box-shadow: 0 0 20px rgba(0, 255, 255, 0.2);
}

.node-icon {
  font-size: 1rem;
}

.node-label {
  letter-spacing: 0.03em;
}

.node-count {
  padding: 0.15rem 0.4rem;
  background: rgba(0, 255, 136, 0.2);
  border-radius: 6px;
  font-size: 0.55rem;
  font-weight: 700;
}

.node-glow {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at center, hsla(var(--hue), 100%, 50%, 0.1), transparent 70%);
  opacity: 0;
  transition: opacity 0.3s;
}

.orbit-node:hover .node-glow,
.orbit-node.active .node-glow {
  opacity: 1;
}

/* ============================================================================
   CONTENT MATRIX
   ============================================================================ */
.content-matrix {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem 2rem;
  scrollbar-width: thin;
  scrollbar-color: rgba(0, 255, 136, 0.3) transparent;
}

.content-matrix::-webkit-scrollbar {
  width: 6px;
}

.content-matrix::-webkit-scrollbar-track {
  background: transparent;
}

.content-matrix::-webkit-scrollbar-thumb {
  background: rgba(0, 255, 136, 0.3);
  border-radius: 3px;
}

/* Featured Signal */
.signal-featured {
  position: relative;
  margin-bottom: 1.5rem;
  padding: 2rem;
  background: linear-gradient(135deg, rgba(0, 255, 136, 0.08), rgba(0, 255, 255, 0.05));
  border: 1px solid rgba(0, 255, 136, 0.3);
  border-radius: 16px;
  cursor: pointer;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.signal-featured:hover {
  border-color: var(--neon-green);
  transform: translateY(-4px);
  box-shadow: 0 20px 40px rgba(0, 255, 136, 0.15);
}

.featured-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.featured-grid {
  position: absolute;
  inset: 0;
  background: 
    linear-gradient(90deg, rgba(0, 255, 136, 0.02) 1px, transparent 1px),
    linear-gradient(rgba(0, 255, 136, 0.02) 1px, transparent 1px);
  background-size: 20px 20px;
}

.featured-gradient {
  position: absolute;
  top: 0;
  right: 0;
  width: 50%;
  height: 100%;
  background: radial-gradient(ellipse at right, rgba(0, 255, 136, 0.1), transparent 70%);
}

.featured-content {
  position: relative;
  z-index: 1;
  max-width: 70%;
}

.featured-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.3rem 0.8rem;
  background: rgba(0, 255, 136, 0.15);
  border: 1px solid rgba(0, 255, 136, 0.3);
  border-radius: 6px;
  font-size: 0.6rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  margin-bottom: 1rem;
  animation: badgePulse 2s ease-in-out infinite;
}

@keyframes badgePulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(0, 255, 136, 0.4); }
  50% { box-shadow: 0 0 0 8px rgba(0, 255, 136, 0); }
}

.featured-title {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1.3;
  margin: 0 0 0.75rem 0;
  background: linear-gradient(135deg, #fff, var(--neon-green));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.featured-desc {
  font-size: 0.85rem;
  line-height: 1.6;
  color: var(--text-secondary);
  margin: 0 0 1rem 0;
}

.featured-meta {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.meta-category {
  padding: 0.25rem 0.6rem;
  background: rgba(0, 255, 255, 0.1);
  border-radius: 4px;
  font-size: 0.6rem;
  color: var(--neon-cyan);
  font-weight: 600;
}

.meta-source {
  font-size: 0.65rem;
  color: var(--text-muted);
}

.meta-tags {
  display: flex;
  gap: 0.4rem;
}

.tag {
  padding: 0.2rem 0.5rem;
  background: rgba(0, 255, 136, 0.08);
  border: 1px solid rgba(0, 255, 136, 0.2);
  border-radius: 4px;
  font-size: 0.55rem;
  color: var(--text-secondary);
}

.featured-icon {
  position: absolute;
  top: 50%;
  right: 2rem;
  transform: translateY(-50%);
  font-size: 5rem;
  opacity: 0.15;
  filter: blur(1px);
}

/* Signal Grid */
.signal-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
}

/* Signal Card */
.signal-card {
  position: relative;
  padding: 1.25rem;
  background: rgba(0, 20, 5, 0.6);
  border: 1px solid rgba(0, 255, 136, 0.12);
  border-radius: 12px;
  cursor: pointer;
  overflow: hidden;
  transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
  animation: cardAppear 0.5s ease backwards;
  animation-delay: calc(var(--index) * 0.05s);
}

@keyframes cardAppear {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
}

.signal-card:hover {
  border-color: hsla(var(--accent), 100%, 50%, 0.5);
  transform: translateY(-6px) scale(1.01);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.3);
}

.signal-card.is-new::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, var(--neon-green), var(--neon-cyan));
}

.card-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
}

.card-icon-wrap {
  position: relative;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-icon {
  font-size: 1.5rem;
  z-index: 1;
}

.icon-ring {
  position: absolute;
  inset: 0;
  border: 1px solid hsla(var(--accent), 100%, 50%, 0.3);
  border-radius: 10px;
  transition: all 0.3s;
}

.signal-card:hover .icon-ring {
  border-color: hsla(var(--accent), 100%, 50%, 0.6);
  transform: scale(1.1) rotate(5deg);
}

.card-meta {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.meta-type {
  font-size: 0.6rem;
  font-weight: 600;
  color: hsla(var(--accent), 100%, 60%, 1);
  letter-spacing: 0.05em;
}

.meta-date {
  font-size: 0.55rem;
  color: var(--text-muted);
}

.card-indicator {
  padding: 0.2rem 0.5rem;
  background: var(--neon-green);
  border-radius: 4px;
  font-size: 0.5rem;
  font-weight: 700;
  color: #000;
  letter-spacing: 0.1em;
  animation: indicatorPulse 1.5s ease-in-out infinite;
}

@keyframes indicatorPulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

.card-body {
  margin-bottom: 0.75rem;
}

.card-title {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 0.95rem;
  font-weight: 600;
  line-height: 1.4;
  margin: 0 0 0.5rem 0;
  color: #fff;
  transition: color 0.3s;
}

.signal-card:hover .card-title {
  color: hsla(var(--accent), 100%, 70%, 1);
}

.card-desc {
  font-size: 0.75rem;
  line-height: 1.5;
  color: var(--text-secondary);
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 0.75rem;
  border-top: 1px solid rgba(0, 255, 136, 0.08);
}

.card-tags {
  display: flex;
  gap: 0.3rem;
}

.mini-tag {
  padding: 0.15rem 0.4rem;
  background: rgba(0, 255, 136, 0.05);
  border-radius: 3px;
  font-size: 0.5rem;
  color: var(--text-muted);
}

.card-source {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.55rem;
  color: var(--text-muted);
}

.source-icon {
  font-size: 0.4rem;
  color: hsla(var(--accent), 100%, 50%, 0.8);
}

/* Card Effects */
.card-glow {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 50% 0%, hsla(var(--accent), 100%, 50%, 0.1), transparent 60%);
  opacity: 0;
  transition: opacity 0.3s;
  pointer-events: none;
}

.signal-card:hover .card-glow {
  opacity: 1;
}

.card-scan {
  position: absolute;
  top: 0;
  left: -100%;
  width: 50%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(0, 255, 136, 0.05), transparent);
  pointer-events: none;
}

.signal-card:hover .card-scan {
  animation: cardScan 0.6s ease;
}

@keyframes cardScan {
  to { left: 150%; }
}

/* ============================================================================
   WISDOM TERMINAL
   ============================================================================ */
.wisdom-terminal {
  margin: 1.5rem 2rem;
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(0, 255, 136, 0.2);
  border-radius: 12px;
  overflow: hidden;
  flex-shrink: 0;
}

.terminal-chrome {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.6rem 1rem;
  background: rgba(0, 255, 136, 0.05);
  border-bottom: 1px solid rgba(0, 255, 136, 0.1);
}

.chrome-dots {
  display: flex;
  gap: 0.3rem;
}

.chrome-dots span {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(0, 255, 136, 0.3);
}

.chrome-dots span:nth-child(1) { background: #ff5f56; }
.chrome-dots span:nth-child(2) { background: #ffbd2e; }
.chrome-dots span:nth-child(3) { background: #27ca40; }

.chrome-title {
  font-size: 0.65rem;
  letter-spacing: 0.1em;
  color: var(--text-muted);
}

.terminal-body {
  padding: 1.25rem;
}

.terminal-prefix {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.prefix-icon {
  font-size: 1rem;
}

.prefix-label {
  font-size: 0.6rem;
  letter-spacing: 0.15em;
  color: var(--text-muted);
}

.terminal-quote {
  margin: 0;
  padding: 0;
  border: none;
}

.quote-text {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 1.1rem;
  font-style: italic;
  line-height: 1.6;
  color: var(--neon-green);
  margin: 0 0 0.5rem 0;
  text-shadow: 0 0 20px rgba(0, 255, 136, 0.3);
}

.quote-author {
  font-size: 0.75rem;
  color: var(--text-secondary);
  text-align: right;
}

.quote-shuffle {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background: transparent;
  border: 1px solid rgba(0, 255, 136, 0.25);
  border-radius: 6px;
  color: var(--text-secondary);
  font-family: inherit;
  font-size: 0.65rem;
  letter-spacing: 0.05em;
  cursor: pointer;
  transition: all 0.25s;
}

.quote-shuffle:hover {
  border-color: var(--neon-green);
  color: var(--neon-green);
  background: rgba(0, 255, 136, 0.05);
}

.shuffle-icon {
  transition: transform 0.3s;
}

.quote-shuffle:hover .shuffle-icon {
  transform: rotate(180deg);
}

/* ============================================================================
   STATUS BAR
   ============================================================================ */
.feed-status {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 2rem;
  background: rgba(0, 0, 0, 0.3);
  border-top: 1px solid rgba(0, 255, 136, 0.1);
  flex-shrink: 0;
}

.status-left {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.6rem;
  color: var(--text-muted);
}

.status-indicator {
  width: 6px;
  height: 6px;
  background: var(--neon-green);
  border-radius: 50%;
  animation: pulse 2s ease-in-out infinite;
}

.status-center {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.status-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.15rem;
}

.stat-num {
  font-size: 1rem;
  font-weight: 700;
  color: var(--neon-green);
}

.stat-label {
  font-size: 0.5rem;
  letter-spacing: 0.1em;
  color: var(--text-muted);
}

.status-divider {
  width: 1px;
  height: 24px;
  background: rgba(0, 255, 136, 0.2);
}

.status-right {
  font-size: 0.55rem;
  color: var(--text-muted);
  letter-spacing: 0.1em;
}

/* ============================================================================
   TRANSITIONS
   ============================================================================ */
.feed-morph-enter-active {
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

.feed-morph-leave-active {
  transition: all 0.35s ease;
}

.feed-morph-enter-from {
  opacity: 0;
}

.feed-morph-enter-from .feed-shell {
  transform: scale(0.95) translateY(20px);
  opacity: 0;
}

.feed-morph-leave-to {
  opacity: 0;
}

.feed-morph-leave-to .feed-shell {
  transform: scale(0.98);
  opacity: 0;
}

.signal-morph-enter-active,
.signal-morph-leave-active {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.signal-morph-enter-from,
.signal-morph-leave-to {
  opacity: 0;
  transform: translateY(15px);
}

.signal-stagger-enter-active {
  transition: all 0.4s ease;
}

.signal-stagger-leave-active {
  transition: all 0.2s ease;
}

.signal-stagger-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.signal-stagger-leave-to {
  opacity: 0;
}

.quote-fade-enter-active,
.quote-fade-leave-active {
  transition: all 0.3s ease;
}

.quote-fade-enter-from,
.quote-fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

/* ============================================================================
   RESPONSIVE
   ============================================================================ */
@media (max-width: 900px) {
  .feed-header {
    flex-direction: column;
    gap: 1rem;
    padding: 1rem 1.5rem;
  }
  
  .header-left, .header-right {
    width: 100%;
    justify-content: space-between;
  }
  
  .content-matrix {
    padding: 1rem 1.5rem;
  }
  
  .signal-grid {
    grid-template-columns: 1fr;
  }
  
  .featured-content {
    max-width: 100%;
  }
  
  .featured-icon {
    display: none;
  }
}

@media (max-width: 600px) {
  .feed-shell {
    margin: 0;
    border-radius: 0;
    max-height: 100vh;
  }
  
  .logo-cluster {
    gap: 0.75rem;
  }
  
  .logo-ring {
    width: 44px;
    height: 44px;
  }
  
  .logo-text h1 {
    font-size: 1.1rem;
  }
  
  .live-stats {
    display: none;
  }
  
  .signal-featured {
    padding: 1.25rem;
  }
  
  .featured-title {
    font-size: 1.2rem;
  }
  
  .wisdom-terminal {
    margin: 1rem;
  }
  
  .status-center {
    gap: 1rem;
  }
}
</style>
