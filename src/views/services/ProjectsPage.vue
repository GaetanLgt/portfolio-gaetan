<template>
  <div class="projects-page">
    <!-- HERO -->
    <section class="projects-hero">
      <div class="container">
        <div class="projects-hero__content">
          <div class="status-badge">
            <span class="status-badge__dot"></span>
            <span class="status-badge__text">PORTFOLIO TECHNIQUE</span>
          </div>
          
          <h1 class="projects-hero__title">
            <span class="text-gradient">Projets</span> & Réalisations
          </h1>
          
          <p class="projects-hero__desc">
            Une sélection de réalisations professionnelles : applications Symfony,
            interfaces Vue 3, automatisations n8n et infrastructure souveraine.
          </p>
          
          <!-- Stats -->
          <div class="projects-stats">
            <div class="projects-stat">
              <span class="projects-stat__value">{{ projects.length }}</span>
              <span class="projects-stat__label">Projets</span>
            </div>
            <div class="projects-stat">
              <span class="projects-stat__value">{{ uniqueTechs.length }}</span>
              <span class="projects-stat__label">Technologies</span>
            </div>
            <div class="projects-stat">
              <span class="projects-stat__value">5+</span>
              <span class="projects-stat__label">Années XP</span>
            </div>
          </div>
        </div>
      </div>
    </section>
    
    <!-- FILTERS -->
    <section class="projects-filters">
      <div class="container">
        <div class="filters-wrapper">
          <button 
            class="filter-btn"
            :class="{ 'active': activeFilter === 'all' }"
            @click="activeFilter = 'all'"
          >
            Tous
            <span class="filter-count">{{ projects.length }}</span>
          </button>
          <button 
            v-for="cat in categories" 
            :key="cat.id"
            class="filter-btn"
            :class="{ 'active': activeFilter === cat.id }"
            @click="activeFilter = cat.id"
          >
            {{ cat.icon }} {{ cat.name }}
            <span class="filter-count">{{ getCountByCategory(cat.id) }}</span>
          </button>
        </div>
      </div>
    </section>
    
    <!-- PROJECTS GRID -->
    <section class="projects-grid-section">
      <div class="container">
        <TransitionGroup name="projects" tag="div" class="projects-grid">
          <article 
            v-for="project in filteredProjects" 
            :key="project.id"
            class="project-card glass"
            @click="openProject(project)"
          >
            <!-- Header -->
            <div class="project-card__header">
              <span class="project-card__icon">{{ project.icon }}</span>
              <div class="project-card__badges">
                <span v-if="project.featured" class="badge badge--featured">⭐ Featured</span>
                <span class="badge" :class="'badge--' + project.category">{{ getCategoryName(project.category) }}</span>
              </div>
            </div>
            
            <!-- Content -->
            <div class="project-card__content">
              <h3 class="project-card__title">{{ project.name }}</h3>
              <p class="project-card__desc">{{ project.shortDesc }}</p>
            </div>
            
            <!-- Tech Stack -->
            <div class="project-card__stack">
              <span 
                v-for="tech in project.stack.slice(0, 4)" 
                :key="tech"
                class="tech-tag"
              >
                {{ tech }}
              </span>
              <span v-if="project.stack.length > 4" class="tech-tag tech-tag--more">
                +{{ project.stack.length - 4 }}
              </span>
            </div>
            
            <!-- Footer -->
            <div class="project-card__footer">
              <span class="project-card__date">{{ project.year }}</span>
              <span class="project-card__action">Voir détails →</span>
            </div>
          </article>
        </TransitionGroup>
      </div>
    </section>
    
    <!-- PROJECT MODAL -->
    <Teleport to="body">
      <Transition name="modal">
        <div 
          v-if="selectedProject" 
          class="project-modal"
          @click.self="closeProject"
        >
          <div class="project-modal__content glass">
            <button @click="closeProject" class="project-modal__close">✕</button>
            
            <div class="project-modal__header">
              <span class="project-modal__icon">{{ selectedProject.icon }}</span>
              <div>
                <h2 class="project-modal__title">{{ selectedProject.name }}</h2>
                <span class="project-modal__category">{{ getCategoryName(selectedProject.category) }} • {{ selectedProject.year }}</span>
              </div>
            </div>
            
            <p class="project-modal__desc">{{ selectedProject.fullDesc }}</p>
            
            <!-- Features -->
            <div v-if="selectedProject.features" class="project-modal__features">
              <h4>Fonctionnalités clés</h4>
              <ul>
                <li v-for="feature in selectedProject.features" :key="feature">
                  {{ feature }}
                </li>
              </ul>
            </div>
            
            <!-- Stack -->
            <div class="project-modal__stack">
              <h4>Stack technique</h4>
              <div class="project-modal__tags">
                <span v-for="tech in selectedProject.stack" :key="tech" class="tech-tag tech-tag--large">
                  {{ tech }}
                </span>
              </div>
            </div>
            
            <!-- Learnings -->
            <div v-if="selectedProject.learnings" class="project-modal__learnings">
              <h4>Apprentissages</h4>
              <p>{{ selectedProject.learnings }}</p>
            </div>
            
            <!-- Links -->
            <div class="project-modal__links">
              <a 
                v-if="selectedProject.github"
                :href="selectedProject.github" 
                target="_blank" 
                rel="noopener"
                class="project-modal__link"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                Voir sur GitHub
              </a>
              <a 
                v-if="selectedProject.demo"
                :href="selectedProject.demo" 
                target="_blank" 
                rel="noopener"
                class="project-modal__link project-modal__link--primary"
              >
                🚀 Voir la démo
              </a>
              <router-link 
                v-if="selectedProject.casestudy"
                :to="selectedProject.casestudy"
                class="project-modal__link project-modal__link--primary"
                @click="closeProject"
              >
                📄 Case Study complet
              </router-link>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
    
    <!-- CTA -->
    <section class="projects-cta">
      <div class="container">
        <div class="projects-cta__box glass">
          <div class="projects-cta__content">
            <h2>Un projet en tête ?</h2>
            <p>Discutons de comment je peux vous aider à le réaliser.</p>
          </div>
          <router-link to="/contact" class="projects-cta__btn">
            DÉMARRER UN PROJET →
          </router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

// Categories
const categories = [
  { id: 'symfony', name: 'Symfony', icon: '🎼' },
  { id: 'vue', name: 'Vue.js', icon: '💚' },
  { id: 'wordpress', name: 'WordPress', icon: '📝' },
  { id: 'gaming', name: 'Gaming', icon: '🎮' },
  { id: 'fullstack', name: 'Full-Stack', icon: '⚡' }
];

// Projects data
const projects = ref([
  {
    id: 'voyageopro',
    name: 'VoyageoPro',
    icon: '✈️',
    category: 'fullstack',
    year: '2025',
    featured: true,
    shortDesc: 'Plateforme SaaS B2B pour agence de voyage : devis, catalogue fournisseurs, automatisations.',
    fullDesc: 'Transformation digitale complète d\'une agence de voyage B2B. Passage de 15 fichiers Excel à une plateforme unifiée gérant devis, catalogue de 800+ fournisseurs, facturation et relances automatisées.',
    stack: ['Symfony 7', 'Vue 3', 'PostgreSQL', 'Redis', 'n8n', 'Docker', 'Stripe'],
    features: [
      'Générateur de devis avec calcul de marges',
      'Catalogue 800+ fournisseurs avec tarifs dynamiques',
      'Dashboard analytics temps réel',
      'Automatisations relances J+3/7/14',
      'Facturation Stripe intégrée',
      'Export PDF brandé'
    ],
    learnings: 'Migration de données complexes, workflows métier B2B, intégration paiement.',
    github: null,
    demo: null,
    casestudy: '/voyageo-pro'
  },
  {
    id: 'arkadia',
    name: 'ARKADIA FRANCE',
    icon: '🦖',
    category: 'gaming',
    year: '2023-2026',
    featured: true,
    shortDesc: 'Cluster ARK Survival avec 150+ joueurs, Discord actif, et infrastructure DevOps complète.',
    fullDesc: 'Cluster de serveurs ARK Survival Ascended gérant une communauté de 150+ joueurs. Infrastructure complète avec API Nitrado, bots Discord, systèmes économiques in-game, et gestion événementielle.',
    stack: ['Nitrado API', 'Discord.js', 'Node.js', 'n8n', 'Docker', 'PostgreSQL'],
    features: [
      'Gestion multi-serveurs via API',
      'Bot Discord avec économie intégrée',
      'Système de modération automatisé',
      'Événements communautaires (Ragnarök)',
      'Dashboard admin personnalisé'
    ],
    learnings: 'Gestion de communauté à grande échelle, automatisation DevOps, et équilibre gameplay.',
    github: null,
    demo: 'https://discord.gg/arkadia',
    casestudy: '/arkadia'
  },
  {
    id: 'myloc',
    name: 'MyLoc',
    icon: '🏠',
    category: 'symfony',
    year: '2022',
    featured: true,
    shortDesc: 'Application de gestion de locations immobilières avec Symfony 5.4.',
    fullDesc: 'Plateforme complète de gestion locative permettant aux propriétaires de gérer leurs biens, locataires et contrats. Interface moderne avec tableaux de bord et statistiques.',
    stack: ['Symfony 5.4', 'PHP 7.4', 'Twig', 'JavaScript', 'MySQL', 'Bootstrap'],
    features: [
      'CRUD complet pour biens et locataires',
      'Gestion des contrats de location',
      'Tableau de bord avec KPIs',
      'Système de notifications',
      'Export PDF des documents'
    ],
    learnings: 'Architecture MVC avec Symfony, gestion des relations Doctrine, et sécurité des formulaires.',
    github: 'https://github.com/GaetanLgt/myLoc',
    demo: null,
    casestudy: null
  },
  {
    id: 'agents',
    name: 'Workflows & Automatisations',
    icon: '🔄',
    category: 'fullstack',
    year: '2025-2026',
    featured: true,
    shortDesc: 'Stack d\'automatisation souveraine : n8n, Discord bots, RAG, monitoring.',
    fullDesc: 'Infrastructure complète de workflows automatisés : bots Discord ARKADIA, monitoring serveurs, knowledge base RAG avec Obsidian/ChromaDB, pipelines de contenu. 100% hébergé localement.',
    stack: ['n8n', 'Docker', 'Nemotron', 'ChromaDB', 'Discord.js', 'PostgreSQL'],
    features: [
      'Bot Discord communautaire',
      'Monitoring & alertes temps réel',
      'RAG sur documentation Obsidian',
      'Pipeline contenu automatisé',
      'Onboarding client workflow'
    ],
    learnings: 'Orchestration de workflows, intégration LLM local, automatisation métier.',
    github: null,
    demo: null,
    casestudy: '/agents'
  },
  {
    id: 'mevnstack',
    name: 'MEVN Stack',
    icon: '🔥',
    category: 'fullstack',
    year: '2021',
    featured: false,
    shortDesc: 'Boilerplate full-stack MongoDB, Express, Vue, Node.',
    fullDesc: 'Template de démarrage rapide pour applications full-stack JavaScript. Architecture RESTful avec authentification JWT et structure de fichiers optimisée.',
    stack: ['Vue.js', 'Node.js', 'Express', 'MongoDB', 'JWT', 'Vuex'],
    features: [
      'Authentification JWT',
      'API RESTful',
      'State management Vuex',
      'Structure modulaire',
      'Hot reload dev'
    ],
    learnings: 'Architecture full-stack JS, sécurité API, et gestion d\'état centralisée.',
    github: 'https://github.com/GaetanLgt/mevnStack',
    demo: null,
    casestudy: null
  },
  {
    id: 'ouvreboites',
    name: 'Ouvre-Boîtes',
    icon: '🥫',
    category: 'wordpress',
    year: '2020',
    featured: false,
    shortDesc: 'Site associatif réalisé en stage chez Superdev avec WordPress/Timber.',
    fullDesc: 'Site vitrine pour l\'association Ouvre-Boîtes développé lors de mon stage chez Superdev. Utilisation de WordPress avec le framework Timber pour un templating Twig propre.',
    stack: ['WordPress', 'Timber', 'Twig', 'ACF', 'PHP', 'SCSS'],
    features: [
      'Thème custom Timber/Twig',
      'Champs ACF personnalisés',
      'Design responsive',
      'Optimisation SEO',
      'Formulaires de contact'
    ],
    learnings: 'WordPress avancé, séparation logique/vue avec Twig, et workflow agence.',
    github: 'https://github.com/GaetanLgt/ouvreBoites',
    demo: null,
    casestudy: null
  },
  {
    id: 'chalets',
    name: 'Chalets & Caviar',
    icon: '🏔️',
    category: 'wordpress',
    year: '2020',
    featured: false,
    shortDesc: 'Projet OpenClassrooms - Site de location de chalets de luxe.',
    fullDesc: 'Projet de formation OpenClassrooms consistant à créer un site WordPress pour une agence fictive de location de chalets haut de gamme. Focus sur le design premium et l\'expérience utilisateur.',
    stack: ['WordPress', 'PHP', 'CSS3', 'JavaScript', 'Elementor'],
    features: [
      'Design premium luxe',
      'Galeries photos immersives',
      'Formulaire de réservation',
      'Pages dynamiques',
      'Responsive design'
    ],
    learnings: 'WordPress page builder, design orienté conversion, et UX de luxe.',
    github: 'https://github.com/GaetanLgt/oc-gl-chalets-et-caviar.gaetan-langlet.fr',
    demo: null,
    casestudy: null
  },
  {
    id: 'symfonycms',
    name: 'SymfonyCMS',
    icon: '📰',
    category: 'symfony',
    year: '2021',
    featured: false,
    shortDesc: 'CMS minimaliste développé from scratch avec Symfony.',
    fullDesc: 'Système de gestion de contenu léger développé avec Symfony. Permet la création d\'articles, la gestion des catégories et l\'administration des utilisateurs.',
    stack: ['Symfony', 'PHP', 'Twig', 'Doctrine', 'MySQL', 'Bootstrap'],
    features: [
      'Gestion d\'articles WYSIWYG',
      'Système de catégories',
      'Authentification admin',
      'Upload d\'images',
      'SEO basique'
    ],
    learnings: 'Création d\'un CMS from scratch, gestion des rôles, et CRUD avancé.',
    github: 'https://github.com/GaetanLgt/SymfonyCMS',
    demo: null,
    casestudy: null
  },
  {
    id: 'gldigitallab',
    name: 'GL Digital Lab',
    icon: '💎',
    category: 'vue',
    year: '2026',
    featured: true,
    shortDesc: 'Ce portfolio ! Architecture Vue 3 + Three.js, ambiance MND émeraude.',
    fullDesc: 'Portfolio professionnel développé avec Vue 3 Composition API et Three.js. Univers MND : cercle à point central, ambiance émeraude sur fond noir, animations GSAP, SEO optimisé, analytics RGPD-compliant.',
    stack: ['Vue 3', 'Three.js', 'Vite', 'GSAP', 'Matomo', 'O2Switch'],
    features: [
      'Animations Three.js',
      'Design system MND (cercle & émeraude)',
      'SEO optimisé (Schema.org)',
      'Analytics RGPD (Matomo)',
      'Performance Lighthouse 90+'
    ],
    learnings: 'Vue 3 Composition API, WebGL, et stratégie de personal branding.',
    github: null,
    demo: 'https://gldigitallab.fr',
    casestudy: null
  },
  {
    id: 'pokemon-memory',
    name: 'Pokémon Memory',
    icon: '🎴',
    category: 'symfony',
    year: '2023',
    featured: false,
    shortDesc: 'Jeu Memory thème Pokémon avec Symfony et API PokeAPI.',
    fullDesc: 'Jeu vidéo de type Memory sur le thème Pokémon, développé en collaboration avec Julien Holtz. Application Symfony complète avec authentification, profils utilisateurs, et intégration API pour charger dynamiquement les cartes Pokémon.',
    stack: ['Symfony', 'PHP', 'Twig', 'JavaScript', 'SCSS', 'Docker', 'Webpack', 'API REST'],
    features: [
      'Jeu Memory interactif',
      'Intégration API Pokémon',
      'Système d\'authentification',
      'Profils utilisateurs',
      'Animations CSS (Animista)',
      'Sound design 8-bit',
      'Docker-ready'
    ],
    learnings: 'Travail collaboratif, intégration API externe, et game design avec Symfony.',
    github: 'https://github.com/JulienHltz/Pokemon_MemoryGame',
    demo: null,
    casestudy: null
  }
]);

// State
const activeFilter = ref('all');
const selectedProject = ref(null);

// Computed
const filteredProjects = computed(() => {
  if (activeFilter.value === 'all') return projects.value;
  return projects.value.filter(p => p.category === activeFilter.value);
});

const uniqueTechs = computed(() => {
  const techs = new Set();
  projects.value.forEach(p => p.stack.forEach(t => techs.add(t)));
  return Array.from(techs);
});

// Methods
function getCountByCategory(categoryId) {
  return projects.value.filter(p => p.category === categoryId).length;
}

function getCategoryName(categoryId) {
  const cat = categories.find(c => c.id === categoryId);
  return cat ? cat.name : categoryId;
}

function openProject(project) {
  selectedProject.value = project;
  document.body.style.overflow = 'hidden';
}

function closeProject() {
  selectedProject.value = null;
  document.body.style.overflow = '';
}
</script>

<style scoped>
.projects-page {
  padding-top: 80px;
  /* Fix: assurer que sticky fonctionne */
  overflow: visible;
}

/* HERO */
.projects-hero {
  padding: var(--space-xl) 0;
  background: linear-gradient(180deg, var(--surface) 0%, var(--bg) 100%);
}

.projects-hero__content {
  max-width: 700px;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: var(--primary-soft);
  border: 1px solid rgba(16, 185, 129, 0.2);
  border-radius: 2rem;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.55rem;
  color: var(--primary);
  letter-spacing: 0.15em;
  margin-bottom: var(--space-md);
}

.status-badge__dot {
  width: 6px;
  height: 6px;
  background: var(--primary);
  border-radius: 50%;
  animation: pulse-slow 2s infinite;
}

.projects-hero__title {
  font-size: clamp(2.5rem, 7vw, 4rem);
  font-weight: 700;
  line-height: 1.1;
  margin-bottom: var(--space-md);
}

.projects-hero__desc {
  font-size: 1.1rem;
  color: var(--text-muted);
  line-height: 1.7;
  margin-bottom: var(--space-lg);
}

.projects-stats {
  display: flex;
  gap: 2rem;
}

.projects-stat {
  display: flex;
  flex-direction: column;
}

.projects-stat__value {
  font-family: 'JetBrains Mono', monospace;
  font-size: 2rem;
  font-weight: 700;
  color: var(--primary);
}

.projects-stat__label {
  font-size: 0.8rem;
  color: var(--text-dark);
}

/* FILTERS - Position normale (scroll avec le contenu) */
.projects-filters {
  padding: var(--space-md) 0;
  border-bottom: 1px solid var(--border);
  background: var(--bg);
}

.filters-wrapper {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.filter-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1rem;
  background: transparent;
  border: 1px solid var(--border);
  border-radius: 2rem;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.75rem;
  color: var(--text-muted);
  cursor: pointer;
  transition: all 0.2s ease;
}

.filter-btn:hover {
  border-color: var(--primary);
  color: var(--primary);
}

.filter-btn.active {
  background: var(--primary);
  border-color: var(--primary);
  color: var(--bg);
}

.filter-count {
  padding: 0.15rem 0.4rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 1rem;
  font-size: 0.65rem;
}

.filter-btn.active .filter-count {
  background: rgba(0, 0, 0, 0.2);
}

/* GRID */
.projects-grid-section {
  padding: var(--space-xl) 0;
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: var(--space-md);
}

/* CARD */
.project-card {
  padding: 1.5rem;
  border-radius: 1rem;
  border: 1px solid var(--border);
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
}

.project-card:hover {
  border-color: var(--rule-strong);
  transform: translateY(-4px);
  box-shadow: var(--shadow-md);
}

.project-card__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.project-card__icon {
  font-size: 2.5rem;
}

.project-card__badges {
  display: flex;
  gap: 0.5rem;
}

.badge {
  padding: 0.25rem 0.6rem;
  border-radius: 2rem;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.6rem;
  background: var(--surface);
  border: 1px solid var(--rule);
  color: var(--text-muted);
}

/* DS clair (D1) : les variantes colorées étaient illisibles sur papier
   (1,4-3:1). Toutes les pastilles deviennent neutres et AA — le contenu
   (emoji, texte) porte l'information, pas la couleur. */
.badge--featured {
  background: var(--surface);
  border-color: var(--rule-strong);
  color: var(--ink);
  font-weight: 700;
}

.badge--symfony,
.badge--vue,
.badge--wordpress,
.badge--gaming,
.badge--fullstack {
  background: var(--surface);
  border-color: var(--rule);
  color: var(--ink-soft);
}

.project-card__content {
  flex: 1;
  margin-bottom: 1rem;
}

.project-card__title {
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
}

.project-card__desc {
  font-size: 0.85rem;
  color: var(--text-muted);
  line-height: 1.6;
}

.project-card__stack {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
  margin-bottom: 1rem;
}

.tech-tag {
  padding: 0.25rem 0.5rem;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 4px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.6rem;
  color: var(--text-dark);
}

.tech-tag--more {
  background: var(--surface);
  border-color: var(--rule);
  color: var(--ink-soft);
}

.project-card__footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  border-top: 1px solid var(--border);
}

.project-card__date {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.7rem;
  color: var(--text-dark);
}

.project-card__action {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.7rem;
  color: var(--ink-soft);
}

/* MODAL */
.project-modal {
  position: fixed;
  inset: 0;
  z-index: 999999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(8px);
  cursor: pointer; /* Indique qu'on peut cliquer pour fermer */
}

.project-modal__content {
  position: relative;
  width: 100%;
  max-width: 700px;
  max-height: 90vh;
  overflow-y: auto;
  padding: 2rem;
  border-radius: 1rem;
  border: 1px solid var(--border);
  background: var(--bg);
  cursor: default; /* Curseur normal dans le contenu */
}

.project-modal__close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 50%;
  color: var(--text-muted);
  cursor: pointer;
  transition: all 0.2s;
  z-index: 10;
}

.project-modal__close:hover {
  border-color: var(--primary);
  color: var(--primary);
}

.project-modal__header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.project-modal__icon {
  font-size: 3rem;
}

.project-modal__title {
  font-size: 1.75rem;
  margin-bottom: 0.25rem;
}

.project-modal__category {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.75rem;
  color: var(--primary);
}

.project-modal__desc {
  font-size: 1rem;
  color: var(--text-muted);
  line-height: 1.7;
  margin-bottom: 1.5rem;
}

.project-modal__features,
.project-modal__stack,
.project-modal__learnings {
  margin-bottom: 1.5rem;
}

.project-modal__features h4,
.project-modal__stack h4,
.project-modal__learnings h4 {
  font-size: 0.85rem;
  color: var(--primary);
  margin-bottom: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.project-modal__features ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.project-modal__features li {
  position: relative;
  padding: 0.5rem 0 0.5rem 1.5rem;
  font-size: 0.9rem;
  color: var(--text-muted);
}

.project-modal__features li::before {
  content: '→';
  position: absolute;
  left: 0;
  color: var(--primary);
}

.project-modal__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tech-tag--large {
  padding: 0.4rem 0.75rem;
  font-size: 0.7rem;
}

.project-modal__learnings p {
  font-size: 0.9rem;
  color: var(--text-muted);
  line-height: 1.6;
  font-style: italic;
}

.project-modal__links {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--border);
}

.project-modal__link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 0.5rem;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.75rem;
  color: var(--text-muted);
  text-decoration: none;
  transition: all 0.2s;
}

.project-modal__link:hover {
  border-color: var(--primary);
  color: var(--primary);
}

.project-modal__link--primary {
  background: var(--primary);
  border-color: var(--primary);
  color: var(--bg);
}

.project-modal__link--primary:hover {
  background: #059669;
  color: var(--bg);
}

/* CTA */
.projects-cta {
  padding: var(--space-xl) 0;
}

.projects-cta__box {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2.5rem;
  border-radius: 1rem;
  border: 1px solid var(--border);
}

.projects-cta__content h2 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

.projects-cta__content p {
  color: var(--text-muted);
}

.projects-cta__btn {
  padding: 1rem 2rem;
  background: var(--primary);
  color: var(--bg);
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.75rem;
  font-weight: 700;
  text-decoration: none;
  border-radius: 0.5rem;
  transition: all 0.2s;
}

.projects-cta__btn:hover {
  background: #059669;
  box-shadow: 0 0 20px rgba(16, 185, 129, 0.4);
}

/* TRANSITIONS */
.projects-enter-active,
.projects-leave-active {
  transition: all 0.3s ease;
}

.projects-enter-from,
.projects-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-active .project-modal__content,
.modal-leave-active .project-modal__content {
  transition: transform 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .project-modal__content,
.modal-leave-to .project-modal__content {
  transform: scale(0.95) translateY(20px);
}

/* RESPONSIVE */
@media (max-width: 768px) {
  .projects-stats {
    gap: 1.5rem;
  }
  
  .projects-stat__value {
    font-size: 1.5rem;
  }
  
  .projects-grid {
    grid-template-columns: 1fr;
  }
  
  .projects-cta__box {
    flex-direction: column;
    text-align: center;
    gap: 1.5rem;
  }
  
  .project-modal__header {
    flex-direction: column;
    text-align: center;
  }
}
</style>
