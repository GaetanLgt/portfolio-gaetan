/**
 * GL Academy - Challenges & Exercices
 * Style Frontend Mentor
 */

export const challengeLevels = [
  { id: 'newbie', name: 'Débutant', icon: '🌱', color: '#10B981', description: 'HTML, CSS basique' },
  { id: 'junior', name: 'Junior', icon: '🌿', color: '#3B82F6', description: 'JavaScript, layouts' },
  { id: 'intermediate', name: 'Intermédiaire', icon: '🌳', color: '#8B5CF6', description: 'APIs, state management' },
  { id: 'advanced', name: 'Avancé', icon: '🚀', color: '#F59E0B', description: 'Full-stack, architecture' },
  { id: 'guru', name: 'Expert', icon: '⚡', color: '#EF4444', description: 'Systèmes complexes' },
];

export const challengeCategories = [
  { id: 'html-css', name: 'HTML/CSS', icon: '🎨' },
  { id: 'javascript', name: 'JavaScript', icon: '⚡' },
  { id: 'vue', name: 'Vue.js', icon: '💚' },
  { id: 'api', name: 'APIs', icon: '🔌' },
  { id: 'fullstack', name: 'Full-Stack', icon: '🏗️' },
  { id: 'ai', name: 'IA/ML', icon: '🤖' },
];

export const challenges = [
  // DÉBUTANT
  {
    id: 'qr-code',
    title: 'QR Code Component',
    slug: 'qr-code-component',
    description: 'Un composant simple avec une image et du texte centré.',
    longDescription: 'Parfait pour débuter ! Construisez un composant de carte QR code responsive avec flexbox. Vous apprendrez le centrage, les bordures arrondies et les ombres.',
    level: 'newbie',
    category: 'html-css',
    skills: ['HTML sémantique', 'Flexbox', 'Box model', 'Responsive'],
    tools: ['HTML', 'CSS'],
    estimatedTime: '1-2h',
    submissions: 2847,
    featured: false,
    premium: false,
    figmaIncluded: false,
    image: '/challenges/qr-code.jpg',
    learnings: [
      'Structurer du HTML sémantique',
      'Centrer des éléments avec Flexbox',
      'Appliquer des ombres et arrondis',
      'Gérer les images responsive'
    ]
  },
  {
    id: 'results-summary',
    title: 'Results Summary Component',
    slug: 'results-summary-component',
    description: 'Un composant de résultats avec scores et catégories colorées.',
    longDescription: 'Créez un composant affichant des résultats de test avec différentes catégories. Excellent pour pratiquer les gradients, les couleurs HSL et les layouts.',
    level: 'newbie',
    category: 'html-css',
    skills: ['CSS Grid', 'Gradients', 'Variables CSS', 'Couleurs HSL'],
    tools: ['HTML', 'CSS'],
    estimatedTime: '2-3h',
    submissions: 1923,
    featured: true,
    premium: false,
    figmaIncluded: true,
    image: '/challenges/results-summary.jpg',
    learnings: [
      'Utiliser CSS Grid pour les layouts',
      'Créer des gradients linéaires',
      'Travailler avec les variables CSS',
      'Comprendre HSL et l\'opacité'
    ]
  },
  {
    id: 'social-links',
    title: 'Social Links Profile',
    slug: 'social-links-profile',
    description: 'Une page de profil avec liens vers les réseaux sociaux.',
    longDescription: 'Construisez une page de profil personnelle avec des liens stylisés. Parfait pour pratiquer les états hover et les transitions.',
    level: 'newbie',
    category: 'html-css',
    skills: ['Hover states', 'Transitions', 'Layout centré', 'Typography'],
    tools: ['HTML', 'CSS'],
    estimatedTime: '1-2h',
    submissions: 3105,
    featured: false,
    premium: false,
    figmaIncluded: false,
    image: '/challenges/social-links.jpg',
    learnings: [
      'Créer des effets hover élégants',
      'Animer avec des transitions',
      'Structurer une page de profil',
      'Styliser des listes de liens'
    ]
  },

  // JUNIOR
  {
    id: 'newsletter-form',
    title: 'Newsletter Sign-up Form',
    slug: 'newsletter-signup-form',
    description: 'Un formulaire d\'inscription avec validation et états d\'erreur.',
    longDescription: 'Créez un formulaire d\'inscription newsletter avec validation côté client. Apprenez à gérer les états de succès et d\'erreur.',
    level: 'junior',
    category: 'javascript',
    skills: ['Forms HTML5', 'Validation JS', 'DOM manipulation', 'États UI'],
    tools: ['HTML', 'CSS', 'JavaScript'],
    estimatedTime: '3-4h',
    submissions: 1456,
    featured: true,
    premium: false,
    figmaIncluded: true,
    image: '/challenges/newsletter.jpg',
    learnings: [
      'Valider les formulaires en JavaScript',
      'Afficher des messages d\'erreur contextuels',
      'Gérer les états de succès',
      'Créer une UX de formulaire fluide'
    ]
  },
  {
    id: 'age-calculator',
    title: 'Age Calculator App',
    slug: 'age-calculator-app',
    description: 'Application de calcul d\'âge avec animations sur les chiffres.',
    longDescription: 'Construisez une application qui calcule l\'âge exact en années, mois et jours. Incluez des animations sur les résultats.',
    level: 'junior',
    category: 'javascript',
    skills: ['Date manipulation', 'Form validation', 'Animations CSS', 'Calculs'],
    tools: ['HTML', 'CSS', 'JavaScript'],
    estimatedTime: '4-5h',
    submissions: 987,
    featured: false,
    premium: false,
    figmaIncluded: true,
    image: '/challenges/age-calculator.jpg',
    learnings: [
      'Manipuler les objets Date en JS',
      'Valider des entrées numériques',
      'Animer des chiffres qui changent',
      'Gérer les cas limites (années bissextiles)'
    ]
  },
  {
    id: 'interactive-rating',
    title: 'Interactive Rating Component',
    slug: 'interactive-rating-component',
    description: 'Composant de notation avec sélection et confirmation.',
    longDescription: 'Créez un composant de notation interactive où l\'utilisateur sélectionne un score puis voit un écran de confirmation.',
    level: 'junior',
    category: 'javascript',
    skills: ['Event listeners', 'State management', 'Conditional rendering', 'UX'],
    tools: ['HTML', 'CSS', 'JavaScript'],
    estimatedTime: '2-3h',
    submissions: 2234,
    featured: false,
    premium: false,
    figmaIncluded: false,
    image: '/challenges/rating.jpg',
    learnings: [
      'Gérer des clics sur des éléments multiples',
      'Maintenir un état en JavaScript vanilla',
      'Afficher différentes vues conditionnellement',
      'Créer des boutons de sélection accessibles'
    ]
  },

  // INTERMÉDIAIRE
  {
    id: 'todo-app',
    title: 'Todo App avec Vue.js',
    slug: 'todo-app-vue',
    description: 'Application de tâches complète avec filtres, drag & drop et thème sombre.',
    longDescription: 'Construisez une application de gestion de tâches complète avec Vue.js. Incluez le stockage local, les filtres, le drag & drop pour réorganiser et un mode sombre.',
    level: 'intermediate',
    category: 'vue',
    skills: ['Vue 3 Composition API', 'LocalStorage', 'Drag & Drop', 'Dark mode'],
    tools: ['Vue.js', 'CSS', 'LocalStorage API'],
    estimatedTime: '8-12h',
    submissions: 567,
    featured: true,
    premium: true,
    figmaIncluded: true,
    image: '/challenges/todo-vue.jpg',
    learnings: [
      'Structurer une app Vue.js complète',
      'Utiliser la Composition API',
      'Persister les données en localStorage',
      'Implémenter le drag & drop',
      'Créer un système de thèmes'
    ]
  },
  {
    id: 'countries-api',
    title: 'REST Countries API',
    slug: 'rest-countries-api',
    description: 'Application listant tous les pays avec recherche, filtres et détails.',
    longDescription: 'Intégrez l\'API REST Countries pour afficher tous les pays du monde. Ajoutez une recherche, des filtres par région et une page de détail avec les pays frontaliers.',
    level: 'intermediate',
    category: 'api',
    skills: ['Fetch API', 'Routing', 'Search & Filter', 'Dark mode'],
    tools: ['Vue.js', 'Vue Router', 'REST API'],
    estimatedTime: '10-15h',
    submissions: 423,
    featured: true,
    premium: true,
    figmaIncluded: true,
    image: '/challenges/countries.jpg',
    learnings: [
      'Consommer une API REST',
      'Implémenter une recherche temps réel',
      'Créer des filtres dynamiques',
      'Gérer le routing avec Vue Router',
      'Afficher des données imbriquées'
    ]
  },
  {
    id: 'ecommerce-cart',
    title: 'E-commerce Product Page',
    slug: 'ecommerce-product-page',
    description: 'Page produit e-commerce avec galerie, sélecteur de quantité et panier.',
    longDescription: 'Créez une page produit complète avec lightbox gallery, sélection de quantité et panier fonctionnel. Design responsive pour mobile.',
    level: 'intermediate',
    category: 'javascript',
    skills: ['Gallery/Lightbox', 'Cart logic', 'Responsive design', 'State management'],
    tools: ['HTML', 'CSS', 'JavaScript'],
    estimatedTime: '8-10h',
    submissions: 678,
    featured: false,
    premium: true,
    figmaIncluded: true,
    image: '/challenges/ecommerce.jpg',
    learnings: [
      'Créer une lightbox gallery',
      'Gérer un panier avec état local',
      'Naviguer dans les images',
      'Adapter le design mobile/desktop'
    ]
  },

  // AVANCÉ
  {
    id: 'kanban-board',
    title: 'Kanban Task Management',
    slug: 'kanban-task-management',
    description: 'Application Kanban complète avec colonnes, tâches et sous-tâches.',
    longDescription: 'Construisez une application Kanban style Trello avec création de boards, colonnes personnalisables, tâches avec sous-tâches et drag & drop entre colonnes.',
    level: 'advanced',
    category: 'fullstack',
    skills: ['Complex state', 'Drag & Drop', 'CRUD', 'Modal forms', 'Dark mode'],
    tools: ['Vue.js', 'Pinia', 'Supabase/Firebase'],
    estimatedTime: '20-30h',
    submissions: 156,
    featured: true,
    premium: true,
    figmaIncluded: true,
    image: '/challenges/kanban.jpg',
    learnings: [
      'Gérer un état complexe avec Pinia',
      'Drag & drop entre conteneurs',
      'Créer des modales de formulaires',
      'Structurer une app multi-boards',
      'Persister en base de données'
    ]
  },
  {
    id: 'invoice-app',
    title: 'Invoice App Full-Stack',
    slug: 'invoice-app-fullstack',
    description: 'Application de facturation avec création, édition et filtrage.',
    longDescription: 'Créez une application de facturation professionnelle. Générez des factures avec numérotation automatique, gérez les statuts et filtrez par état.',
    level: 'advanced',
    category: 'fullstack',
    skills: ['Full CRUD', 'Form handling', 'PDF generation', 'Status workflow'],
    tools: ['Vue.js', 'Symfony API', 'PostgreSQL'],
    estimatedTime: '25-35h',
    submissions: 89,
    featured: false,
    premium: true,
    figmaIncluded: true,
    image: '/challenges/invoice.jpg',
    learnings: [
      'Créer une API REST avec Symfony',
      'Générer des numéros de facture uniques',
      'Gérer les workflows de statut',
      'Générer des PDF côté serveur',
      'Valider des formulaires complexes'
    ]
  },
  {
    id: 'chat-app',
    title: 'Real-time Chat Application',
    slug: 'realtime-chat-app',
    description: 'Application de chat en temps réel avec WebSockets.',
    longDescription: 'Construisez une application de messagerie en temps réel avec WebSockets. Incluez les indicateurs de frappe, les accusés de lecture et les notifications.',
    level: 'advanced',
    category: 'fullstack',
    skills: ['WebSockets', 'Real-time', 'Notifications', 'Authentication'],
    tools: ['Vue.js', 'Socket.io', 'Node.js', 'MongoDB'],
    estimatedTime: '30-40h',
    submissions: 67,
    featured: true,
    premium: true,
    figmaIncluded: true,
    image: '/challenges/chat.jpg',
    learnings: [
      'Implémenter WebSockets avec Socket.io',
      'Gérer les connexions temps réel',
      'Créer des indicateurs de frappe',
      'Implémenter l\'authentification',
      'Stocker l\'historique des messages'
    ]
  },

  // EXPERT
  {
    id: 'ai-chatbot',
    title: 'AI Chatbot avec RAG',
    slug: 'ai-chatbot-rag',
    description: 'Chatbot intelligent avec base de connaissances et embeddings.',
    longDescription: 'Créez un chatbot IA qui répond à des questions sur une base de connaissances personnalisée. Utilisez des embeddings et la recherche vectorielle pour des réponses contextuelles.',
    level: 'guru',
    category: 'ai',
    skills: ['RAG', 'Embeddings', 'Vector DB', 'LLM Integration', 'Prompt Engineering'],
    tools: ['Vue.js', 'Ollama/OpenAI', 'ChromaDB', 'LangChain'],
    estimatedTime: '40-60h',
    submissions: 23,
    featured: true,
    premium: true,
    figmaIncluded: false,
    image: '/challenges/ai-chatbot.jpg',
    learnings: [
      'Comprendre le RAG (Retrieval Augmented Generation)',
      'Créer des embeddings de documents',
      'Configurer une base vectorielle',
      'Intégrer un LLM (Ollama ou OpenAI)',
      'Optimiser les prompts système'
    ]
  },
  {
    id: 'multi-agent',
    title: 'Multi-Agent Workflow System',
    slug: 'multi-agent-workflow',
    description: 'Système d\'orchestration d\'agents IA spécialisés.',
    longDescription: 'Construisez un système où plusieurs agents IA spécialisés collaborent pour résoudre des tâches complexes. Incluez un orchestrateur et des agents experts.',
    level: 'guru',
    category: 'ai',
    skills: ['Agent Systems', 'Orchestration', 'Tool Use', 'Memory', 'Streaming'],
    tools: ['n8n', 'Ollama', 'Redis', 'PostgreSQL'],
    estimatedTime: '50-80h',
    submissions: 12,
    featured: true,
    premium: true,
    figmaIncluded: false,
    image: '/challenges/multi-agent.jpg',
    learnings: [
      'Architecturer un système multi-agent',
      'Créer des agents spécialisés',
      'Implémenter la mémoire partagée',
      'Orchestrer avec n8n',
      'Gérer les outils et fonctions'
    ]
  },
];

// Learning Paths
export const learningPaths = [
  {
    id: 'html-css-mastery',
    title: 'Maîtrise HTML/CSS',
    description: 'De zéro à héros en HTML et CSS',
    challenges: ['qr-code', 'results-summary', 'social-links'],
    duration: '1 semaine',
    level: 'newbie',
  },
  {
    id: 'javascript-fundamentals',
    title: 'Fondamentaux JavaScript',
    description: 'Apprenez JS par la pratique',
    challenges: ['newsletter-form', 'age-calculator', 'interactive-rating'],
    duration: '2 semaines',
    level: 'junior',
  },
  {
    id: 'vue-journey',
    title: 'Parcours Vue.js',
    description: 'Devenez développeur Vue.js',
    challenges: ['todo-app', 'countries-api', 'kanban-board'],
    duration: '4 semaines',
    level: 'intermediate',
  },
  {
    id: 'fullstack-pro',
    title: 'Full-Stack Professionnel',
    description: 'Applications complètes front-to-back',
    challenges: ['invoice-app', 'chat-app', 'ai-chatbot'],
    duration: '8 semaines',
    level: 'advanced',
  },
];

export default challenges;
