/**
 * GL Tower Nodes Configuration
 * 24 nodes représentant l'architecture complète de GL Digital Lab
 * 
 * Structure verticale Y :
 * - Y=12 : Penthouse (JARVIS)
 * - Y=10 : Niveaux supérieurs (EDITH, VERONICA)
 * - Y=8  : Niveaux opérationnels (GL TOWER, ULTRON, VISION)
 * - Y=6  : Support & Services (KAREN, FRIDAY, 3 services)
 * - Y=4  : Projets (ARKADIA, PORTFOLIO, MULTIVERS)
 * - Y=3  : Centre NEO + 4 Stacks techniques
 * - Y=2  : Back Office (PEPPER)
 * - Y=0  : Dev Lab niveau 1 (TADASHI, JOCASTA)
 * - Y=-2 : Dev Lab niveau 2 (CEREBRO, ZOLA)
 * - Y=-3 : Dev Lab niveau 3 (DUM-E)
 */

export const NODE_TYPES = {
  ARCHITECT: 'architect',
  HEADQUARTERS: 'headquarters',
  AGENT_ORCHESTRATOR: 'agent-orchestrator',
  AGENT_OPERATIONAL: 'agent-operational',
  AGENT_DEVLAB: 'agent-devlab',
  AGENT_FINANCE: 'agent-finance',
  PROJECT: 'project',
  STACK: 'stack',
  SERVICE: 'service'
};

export const nodes = [
  // ============================================================================
  // CENTRE - NEO & GL TOWER
  // ============================================================================
  {
    id: 'neo',
    name: 'NEO',
    type: 'Architecte Numérique',
    nodeType: NODE_TYPES.ARCHITECT,
    icon: '👤',
    color: 0x00ff00,
    position: { x: 0, y: 3, z: 0 },
    description: 'Gaëtan "Neo" Langlet - Architecte numérique & développeur full-stack. Fondateur de GL Digital Lab et ARKADIA FRANCE.',
    stats: {
      'Rôle': 'Fondateur',
      'Stack': 'Symfony, Vue 3, Three.js',
      'Spécialité': 'Architecture souveraine',
      'Base': 'Limoges, France 🇫🇷'
    },
    links: [
      { icon: '🏠', label: 'Portfolio', url: '/' },
      { icon: '📄', label: 'CV', url: '/cv' },
      { icon: '📞', label: 'Contact', url: '/contact' }
    ]
  },
  {
    id: 'gl-tower',
    name: 'GL TOWER',
    type: 'QG Central',
    nodeType: NODE_TYPES.HEADQUARTERS,
    icon: '🏢',
    color: 0xfbbf24,
    position: { x: 0, y: 8, z: 0 },
    description: 'Quartier Général de GL Digital Lab. 15 étages, 13 agents IA, infrastructure souveraine complète.',
    stats: {
      'Étages': '15',
      'Agents IA': '13',
      'Workflows': '100+',
      'Uptime': '99.9%'
    },
    links: [
      { icon: '🏢', label: 'Visite interactive', url: '/tower' },
      { icon: '🗺️', label: 'Carte holistique', url: '/carte-holistique' }
    ]
  },

  // ============================================================================
  // PENTHOUSE - DIRECTION (Niveau 15)
  // ============================================================================
  {
    id: 'jarvis',
    name: 'JARVIS',
    type: 'Agent IA - Orchestrateur',
    nodeType: NODE_TYPES.AGENT_ORCHESTRATOR,
    icon: '🎯',
    color: 0x06b6d4,
    position: { x: 0, y: 12, z: -5 },
    description: 'Intelligence artificielle centrale. Orchestre tous les autres agents, route les requêtes, coordonne les workflows.',
    stats: {
      'Niveau': 'Penthouse',
      'Rôle': 'Orchestrateur Multi-Agent',
      'Modèle': 'Claude + GPT-4',
      'Requêtes/jour': '500+'
    },
    links: [
      { icon: '🎯', label: 'Router', url: '/apps/agent/jarvis' }
    ]
  },

  // ============================================================================
  // NIVEAUX SUPÉRIEURS - AGENTS OPÉRATIONNELS
  // ============================================================================
  {
    id: 'edith',
    name: 'EDITH',
    type: 'Agent IA - Sécurité',
    nodeType: NODE_TYPES.AGENT_OPERATIONAL,
    icon: '🛡️',
    color: 0xef4444,
    position: { x: -8, y: 10, z: -3 },
    description: 'Even Dead I\'m The Hero. Surveillance sécurité, audit des dépendances, détection de vulnérabilités.',
    stats: {
      'Niveau': '14 - Sécurité',
      'Scans/jour': '50+',
      'CVE détectées': '12',
      'Alertes': 'Temps réel'
    },
    links: [
      { icon: '🛡️', label: 'Scanner', url: '/apps/agent/edith' }
    ]
  },
  {
    id: 'veronica',
    name: 'VERONICA',
    type: 'Agent IA - DevOps',
    nodeType: NODE_TYPES.AGENT_OPERATIONAL,
    icon: '🚀',
    color: 0x8b5cf6,
    position: { x: 8, y: 10, z: -3 },
    description: 'Virtual Enhanced Resource Operating Network for Integrated Computing Architecture. CI/CD, déploiements, infrastructure.',
    stats: {
      'Niveau': '13 - DevOps',
      'Pipelines': '15+',
      'Déploiements': '200+',
      'Environnements': '3'
    },
    links: [
      { icon: '🚀', label: 'Pipeline', url: '/apps/agent/veronica' }
    ]
  },
  {
    id: 'ultron',
    name: 'ULTRON',
    type: 'Agent IA - Monitoring',
    nodeType: NODE_TYPES.AGENT_OPERATIONAL,
    icon: '📊',
    color: 0xdc2626,
    position: { x: -6, y: 8, z: 5 },
    description: 'Surveillance système 24/7. Monitoring des services, alertes, métriques de performance, logs centralisés.',
    stats: {
      'Niveau': '12 - Monitoring',
      'Services surveillés': '25+',
      'Métriques': '150+',
      'Alertes/mois': '~20'
    },
    links: [
      { icon: '📊', label: 'Dashboard', url: '/apps/agent/ultron' }
    ]
  },
  {
    id: 'vision',
    name: 'VISION',
    type: 'Agent IA - Content',
    nodeType: NODE_TYPES.AGENT_OPERATIONAL,
    icon: '📝',
    color: 0xf59e0b,
    position: { x: 6, y: 8, z: 5 },
    description: 'Génération de contenu SEO, rédaction, optimisation. Création de descriptions, articles, documentation.',
    stats: {
      'Niveau': '11 - Content',
      'Articles générés': '50+',
      'SEO Score moyen': '92',
      'Langues': 'FR, EN'
    },
    links: [
      { icon: '📝', label: 'Generator', url: '/apps/agent/vision' }
    ]
  },
  {
    id: 'karen',
    name: 'KAREN',
    type: 'Agent IA - Support',
    nodeType: NODE_TYPES.AGENT_OPERATIONAL,
    icon: '🎧',
    color: 0x06b6d4,
    position: { x: -10, y: 6, z: 0 },
    description: 'Support client et assistance utilisateur. Répond aux questions, guide les utilisateurs, escalade si nécessaire.',
    stats: {
      'Niveau': '10 - Support',
      'Tickets résolus': '200+',
      'Temps réponse': '<5min',
      'Satisfaction': '94%'
    },
    links: [
      { icon: '🎧', label: 'Support', url: '/contact' }
    ]
  },
  {
    id: 'friday',
    name: 'FRIDAY',
    type: 'Agent IA - Knowledge',
    nodeType: NODE_TYPES.AGENT_OPERATIONAL,
    icon: '📚',
    color: 0x10b981,
    position: { x: 10, y: 6, z: 0 },
    description: 'Female Replacement Intelligent Digital Assistant Youth. Base de connaissances RAG, documentation, FAQ.',
    stats: {
      'Niveau': '9 - Knowledge',
      'Documents indexés': '500+',
      'Requêtes RAG/jour': '100+',
      'Précision': '96%'
    },
    links: [
      { icon: '📚', label: 'Knowledge Base', url: '/apps/agent/friday' }
    ]
  },

  // ============================================================================
  // NIVEAUX INTERMÉDIAIRES - PROJETS
  // ============================================================================
  {
    id: 'arkadia',
    name: 'ARKADIA FRANCE',
    type: 'Projet Gaming',
    nodeType: NODE_TYPES.PROJECT,
    icon: '🦖',
    color: 0x22c55e,
    position: { x: -8, y: 4, z: -8 },
    description: 'Cluster de 9 serveurs ARK: Survival Ascended. Communauté gaming française avec 150+ membres actifs.',
    stats: {
      'Serveurs': '9',
      'Joueurs': '150+',
      'Uptime': '99.8%',
      'Discord': '150+ membres'
    },
    links: [
      { icon: '🦖', label: 'ARKADIA', url: '/arkadia' },
      { icon: '💬', label: 'Discord', url: 'https://discord.gg/arkadia' }
    ]
  },
  {
    id: 'portfolio',
    name: 'PORTFOLIO',
    type: 'Projet Web',
    nodeType: NODE_TYPES.PROJECT,
    icon: '🌐',
    color: 0xff00ff,
    position: { x: 8, y: 4, z: -8 },
    description: 'Portfolio immersif Vue 3 + Three.js. 24 univers thématiques, 50+ apps, architecture souveraine.',
    stats: {
      'Pages': '80+',
      'Univers': '24',
      'Apps': '50+',
      'Lighthouse': '95+'
    },
    links: [
      { icon: '🏠', label: 'Accueil', url: '/' },
      { icon: '🌌', label: 'Multivers', url: '/multivers' }
    ]
  },
  {
    id: 'multivers',
    name: 'MULTIVERS',
    type: 'Projet Créatif',
    nodeType: NODE_TYPES.PROJECT,
    icon: '🌌',
    color: 0x6366f1,
    position: { x: 0, y: 4, z: -10 },
    description: '24 univers thématiques : Matrix, TRON, Blade Runner, Iron Man... Chaque page une expérience unique.',
    stats: {
      'Univers': '24',
      'Effets visuels': '100+',
      'Easter eggs': '50+',
      'Lignes de code': '30K+'
    },
    links: [
      { icon: '🌌', label: 'Explorer', url: '/multivers' },
      { icon: '💊', label: 'Matrix', url: '/matrix' }
    ]
  },

  // ============================================================================
  // SOUS-SOLS - DEV LAB
  // ============================================================================
  {
    id: 'tadashi',
    name: 'TADASHI',
    type: 'Agent IA - R&D',
    nodeType: NODE_TYPES.AGENT_DEVLAB,
    icon: '🔬',
    color: 0x14b8a6,
    position: { x: -6, y: 0, z: 6 },
    description: 'Recherche et développement. Tests de nouveaux modèles, expérimentations, proof of concepts.',
    stats: {
      'Niveau': 'Sous-sol 1 - R&D',
      'Expériences': '20+',
      'Modèles testés': '15',
      'POCs': '8'
    },
    links: [
      { icon: '🔬', label: 'Lab', url: '/stack-ia' }
    ]
  },
  {
    id: 'jocasta',
    name: 'JOCASTA',
    type: 'Agent IA - Tests',
    nodeType: NODE_TYPES.AGENT_DEVLAB,
    icon: '🧪',
    color: 0xec4899,
    position: { x: 6, y: 0, z: 6 },
    description: 'Tests automatisés, QA, validation. Cypress, PHPUnit, tests d\'intégration et de régression.',
    stats: {
      'Niveau': 'Sous-sol 2 - QA',
      'Tests': '500+',
      'Couverture': '85%',
      'CI runs/jour': '20+'
    },
    links: [
      { icon: '🧪', label: 'Tests', url: '/workflows' }
    ]
  },
  {
    id: 'cerebro',
    name: 'CEREBRO',
    type: 'Agent IA - Data',
    nodeType: NODE_TYPES.AGENT_DEVLAB,
    icon: '🧠',
    color: 0x7c3aed,
    position: { x: -4, y: -2, z: 3 },
    description: 'Traitement de données, analytics, ML. ChromaDB, embeddings, analyse de tendances.',
    stats: {
      'Niveau': 'Sous-sol 3 - Data',
      'Vecteurs': '10K+',
      'Embeddings': 'Mistral',
      'Requêtes/jour': '200+'
    },
    links: [
      { icon: '🧠', label: 'Analytics', url: '/conseil' }
    ]
  },
  {
    id: 'zola',
    name: 'ZOLA',
    type: 'Agent IA - Archive',
    nodeType: NODE_TYPES.AGENT_DEVLAB,
    icon: '📦',
    color: 0x64748b,
    position: { x: 4, y: -2, z: 3 },
    description: 'Archivage et backup. Sauvegarde des données, versioning, récupération, historique.',
    stats: {
      'Niveau': 'Sous-sol 4 - Archive',
      'Backups': 'Quotidiens',
      'Rétention': '90 jours',
      'Storage': '500GB'
    },
    links: [
      { icon: '📦', label: 'Archives', url: '/workflows' }
    ]
  },
  {
    id: 'dum-e',
    name: 'DUM-E',
    type: 'Agent IA - Maintenance',
    nodeType: NODE_TYPES.AGENT_DEVLAB,
    icon: '🔧',
    color: 0xf97316,
    position: { x: 0, y: -3, z: 8 },
    description: 'Maintenance et nettoyage. Tâches répétitives, cron jobs, optimisation, garbage collection.',
    stats: {
      'Niveau': 'Sous-sol 5 - Maintenance',
      'Tâches/jour': '100+',
      'Cron jobs': '25',
      'Uptime': '24/7'
    },
    links: [
      { icon: '🔧', label: 'Maintenance', url: '/workflows' }
    ]
  },

  // ============================================================================
  // BACK OFFICE - FINANCE
  // ============================================================================
  {
    id: 'pepper',
    name: 'PEPPER',
    type: 'Agent IA - Finance',
    nodeType: NODE_TYPES.AGENT_FINANCE,
    icon: '💰',
    color: 0xeab308,
    position: { x: 10, y: 2, z: 8 },
    description: 'Gestion financière. Facturation, devis, comptabilité, suivi des paiements.',
    stats: {
      'Niveau': 'Back Office',
      'Factures/mois': '10+',
      'Devis générés': '50+',
      'Suivi': 'Temps réel'
    },
    links: [
      { icon: '💰', label: 'Facturation', url: '/apps/agent/pepper' }
    ]
  },

  // ============================================================================
  // STACKS TECHNIQUES
  // ============================================================================
  {
    id: 'stack-backend',
    name: 'STACK BACKEND',
    type: 'Infrastructure',
    nodeType: NODE_TYPES.STACK,
    icon: '⚙️',
    color: 0x3b82f6,
    position: { x: -12, y: 3, z: -5 },
    description: 'Symfony 8, PHP 8.3, PostgreSQL, Redis. API REST, authentication, ORM Doctrine.',
    stats: {
      'Framework': 'Symfony 8',
      'PHP': '8.3',
      'Base': 'PostgreSQL',
      'Cache': 'Redis'
    },
    links: [
      { icon: '⚙️', label: 'Stack', url: '/stack-ia' }
    ]
  },
  {
    id: 'stack-frontend',
    name: 'STACK FRONTEND',
    type: 'Infrastructure',
    nodeType: NODE_TYPES.STACK,
    icon: '🎨',
    color: 0x22d3ee,
    position: { x: 12, y: 3, z: -5 },
    description: 'Vue 3, Vite, Three.js, TailwindCSS. SPA réactive, 3D immersif, animations fluides.',
    stats: {
      'Framework': 'Vue 3',
      'Build': 'Vite',
      '3D': 'Three.js',
      'CSS': 'Tailwind'
    },
    links: [
      { icon: '🎨', label: 'Stack', url: '/stack-ia' }
    ]
  },
  {
    id: 'stack-ia',
    name: 'STACK IA',
    type: 'Infrastructure',
    nodeType: NODE_TYPES.STACK,
    icon: '🤖',
    color: 0xa855f7,
    position: { x: -12, y: 3, z: 5 },
    description: 'Ollama, Mistral 7B, ChromaDB, n8n. IA locale souveraine, RAG, workflows automatisés.',
    stats: {
      'LLM': 'Mistral 7B',
      'Vector DB': 'ChromaDB',
      'Orchestration': 'n8n',
      'Souverain': '100% local'
    },
    links: [
      { icon: '🤖', label: 'Stack IA', url: '/stack-ia' },
      { icon: '🧠', label: 'Conseil', url: '/conseil' }
    ]
  },
  {
    id: 'stack-devops',
    name: 'STACK DEVOPS',
    type: 'Infrastructure',
    nodeType: NODE_TYPES.STACK,
    icon: '🐳',
    color: 0x0ea5e9,
    position: { x: 12, y: 3, z: 5 },
    description: 'Docker, GitHub Actions, Matomo. Conteneurisation, CI/CD, analytics souverain.',
    stats: {
      'Containers': 'Docker',
      'CI/CD': 'GitHub Actions',
      'Analytics': 'Matomo',
      'Hébergement': 'France 🇫🇷'
    },
    links: [
      { icon: '🐳', label: 'DevOps', url: '/workflows' }
    ]
  },

  // ============================================================================
  // EXPERIMENTAL LAB - THE CONSTRUCT EXCLUSIVES
  // ============================================================================
  {
    id: 'workflows-lab',
    name: 'WORKFLOWS LAB',
    type: 'Visualiseur n8n',
    nodeType: NODE_TYPES.PROJECT,
    icon: '🔄',
    color: 0xff6d00,
    position: { x: -15, y: 5, z: 0 },
    description: 'Visualisez les 100+ workflows n8n des agents IA. Documentation interactive des automatisations en production.',
    stats: {
      'Workflows': '100+',
      'Agents': '13',
      'Triggers': 'Webhooks, Cron, Events',
      'Status': 'Production'
    },
    links: [
      { icon: '🔄', label: 'Workflows', url: '/workflows' },
      { icon: '🤖', label: 'Agents', url: '/agents' }
    ],
    interactive: 'workflows'
  },
  {
    id: 'pixel-art-lab',
    name: 'PIXEL ART LAB',
    type: 'Mini-jeu Créatif',
    nodeType: NODE_TYPES.PROJECT,
    icon: '🎨',
    color: 0xff00ff,
    position: { x: 15, y: 5, z: 0 },
    description: 'Éditeur de pixel art rétro. Créez des sprites, exportez en PNG, palette Matrix incluse.',
    stats: {
      'Grille': '32x32',
      'Palettes': '5',
      'Export': 'PNG',
      'Style': 'Rétro 8-bit'
    },
    links: [
      { icon: '🕹️', label: 'Arcade', url: '/arcade' }
    ],
    interactive: 'pixelart'
  },

  // ============================================================================
  // SERVICES
  // ============================================================================
  {
    id: 'service-performance',
    name: 'PERFORMANCE',
    type: 'Service',
    nodeType: NODE_TYPES.SERVICE,
    icon: '⚡',
    color: 0xfbbf24,
    position: { x: -6, y: 6, z: -10 },
    description: 'Audit et optimisation. Lighthouse, Core Web Vitals, temps de chargement, SEO technique.',
    stats: {
      'Audits': '20+',
      'Score moyen': '95+',
      'Gain perf': '+40%',
      'SEO': 'A+'
    },
    links: [
      { icon: '⚡', label: 'Services', url: '/services' }
    ]
  },
  {
    id: 'service-factory',
    name: 'DIGITAL FACTORY',
    type: 'Service',
    nodeType: NODE_TYPES.SERVICE,
    icon: '🏭',
    color: 0x10b981,
    position: { x: 6, y: 6, z: -10 },
    description: 'Développement sur-mesure. Sites, applications, APIs, intégrations. Du brief à la production.',
    stats: {
      'Projets': '15+',
      'Technologies': '10+',
      'Délai moyen': '4-8 sem',
      'Satisfaction': '98%'
    },
    links: [
      { icon: '🏭', label: 'Services', url: '/services' }
    ]
  },
  {
    id: 'service-neural',
    name: 'NEURAL OPS',
    type: 'Service',
    nodeType: NODE_TYPES.SERVICE,
    icon: '🧠',
    color: 0x8b5cf6,
    position: { x: 0, y: 6, z: -12 },
    description: 'Intégration IA. Chatbots, RAG, automatisation, agents IA personnalisés pour votre entreprise.',
    stats: {
      'Intégrations': '10+',
      'Agents déployés': '5+',
      'Économie temps': '-60%',
      'ROI': '300%+'
    },
    links: [
      { icon: '🧠', label: 'Services', url: '/services' }
    ]
  }
];

export default nodes;
