/**
 * GL Digital Lab - Catalogue Formations
 * Formations professionnelles en développement web et IA
 * Contenu détaillé et riche pour chaque formation
 */

export const formationCategories = [
  { id: 'web', name: 'Développement Web', icon: '🌐', color: '#3B82F6' },
  { id: 'frontend', name: 'Frontend', icon: '🎨', color: '#EC4899' },
  { id: 'backend', name: 'Backend', icon: '⚙️', color: '#10B981' },
  { id: 'ia', name: 'Intelligence Artificielle', icon: '🤖', color: '#8B5CF6' },
  { id: 'devops', name: 'DevOps & Outils', icon: '🔧', color: '#F59E0B' },
  { id: 'business', name: 'Business & Stratégie', icon: '📈', color: '#06B6D4' }
];

export const formationLevels = [
  { id: 'beginner', name: 'Débutant', icon: '🌱', color: '#10B981' },
  { id: 'intermediate', name: 'Intermédiaire', icon: '🌿', color: '#F59E0B' },
  { id: 'advanced', name: 'Avancé', icon: '🌳', color: '#EF4444' },
  { id: 'expert', name: 'Expert', icon: '🏆', color: '#8B5CF6' }
];

export const formations = [
  // ============================================================================
  // SYMFONY 7 - LES FONDAMENTAUX
  // ============================================================================
  {
    id: 'symfony-fundamentals',
    slug: 'symfony-fondamentaux',
    title: 'Symfony 7 - Les Fondamentaux',
    subtitle: 'Maîtrisez le framework PHP de référence pour les applications professionnelles',
    category: 'backend',
    level: 'intermediate',
    duration: '35h',
    format: 'hybrid',
    price: 1490,
    priceInfo: 'Éligible CPF & OPCO',
    featured: true,
    new: true,
    image: '/images/formations/symfony.jpg',
    
    description: `Symfony est le framework PHP le plus utilisé en entreprise en France. Cette formation intensive de 35 heures vous donnera toutes les clés pour développer des applications web robustes, maintenables et évolutives.

Vous apprendrez non seulement la syntaxe et les concepts, mais surtout les **bonnes pratiques** issues de projets réels. Chaque module alterne théorie et pratique avec des exercices concrets.

À la fin de la formation, vous aurez développé une application complète de A à Z : un système de gestion de projet avec authentification, API REST, et interface d'administration.

**Pourquoi Symfony ?**
- Framework n°1 en France pour les applications métier
- Architecture MVC solide et éprouvée
- Écosystème riche (bundles, documentation, communauté)
- Performances excellentes en production
- Maintenabilité sur le long terme`,

    objectives: [
      'Comprendre l\'architecture MVC et le pattern Request/Response de Symfony',
      'Créer des entités Doctrine avec relations complexes (OneToMany, ManyToMany)',
      'Développer des formulaires dynamiques avec validation avancée',
      'Implémenter un système d\'authentification complet (login, register, reset password)',
      'Gérer les autorisations avec les Voters et le système de sécurité',
      'Construire une API REST avec serialization JSON',
      'Écrire des tests unitaires et fonctionnels',
      'Déployer une application Symfony sur un serveur de production',
      'Optimiser les performances (cache, lazy loading, profiler)',
      'Appliquer les bonnes pratiques et conventions Symfony'
    ],
    
    prerequisites: [
      'Maîtrise de PHP orienté objet (classes, interfaces, namespaces, traits)',
      'Connaissance des concepts POO (héritage, polymorphisme, encapsulation)',
      'Bases solides en HTML/CSS',
      'Notions de SQL et bases de données relationnelles',
      'Familiarité avec la ligne de commande',
      'Avoir un environnement de développement PHP 8.2+ fonctionnel'
    ],
    
    program: [
      {
        title: 'Module 1 - Découverte de Symfony',
        duration: '4h',
        description: 'Installation, architecture et premiers pas avec le framework',
        topics: [
          'Présentation de Symfony : histoire, philosophie, versions',
          'Installation via Composer et Symfony CLI',
          'Structure d\'un projet Symfony : dossiers, fichiers de config',
          'Le cycle Request/Response et le Front Controller',
          'Premier Controller et première route',
          'Introduction au Profiler et à la Debug Toolbar',
          'TP : Création d\'un projet "Hello Symfony"'
        ]
      },
      {
        title: 'Module 2 - Routing et Controllers',
        duration: '4h',
        description: 'Maîtriser le système de routing et les controllers',
        topics: [
          'Configuration des routes : attributs PHP 8, YAML, annotations',
          'Paramètres de route et contraintes (requirements)',
          'Génération d\'URLs avec le Router',
          'Controllers : bonnes pratiques et AbstractController',
          'Injection de dépendances dans les controllers',
          'Request et Response : manipulation des objets HTTP',
          'Redirections, JSON responses, fichiers',
          'TP : API de gestion de tâches (CRUD routes)'
        ]
      },
      {
        title: 'Module 3 - Twig et Templates',
        duration: '5h',
        description: 'Créer des interfaces utilisateur avec le moteur de templates Twig',
        topics: [
          'Syntaxe Twig : variables, filtres, fonctions',
          'Structures de contrôle : if, for, set',
          'Héritage de templates avec extends et block',
          'Inclusion de templates et macros réutilisables',
          'Gestion des assets avec Webpack Encore',
          'Installation et configuration de Tailwind CSS',
          'Création de composants UI réutilisables',
          'Internationalisation (i18n) avec Twig',
          'TP : Création d\'un layout complet avec navigation'
        ]
      },
      {
        title: 'Module 4 - Doctrine ORM',
        duration: '6h',
        description: 'Modéliser et persister les données avec Doctrine',
        topics: [
          'Concepts ORM : entités, repositories, Unit of Work',
          'Configuration de la base de données (MySQL, PostgreSQL)',
          'Création d\'entités avec attributs PHP 8',
          'Migrations : création, exécution, rollback',
          'Relations : OneToOne, OneToMany, ManyToOne, ManyToMany',
          'Repository pattern et méthodes personnalisées',
          'Query Builder : requêtes complexes',
          'DQL (Doctrine Query Language)',
          'Optimisation : lazy/eager loading, cache',
          'Fixtures : générer des données de test',
          'TP : Modélisation d\'un blog (articles, catégories, tags, commentaires)'
        ]
      },
      {
        title: 'Module 5 - Formulaires',
        duration: '5h',
        description: 'Construire des formulaires robustes et sécurisés',
        topics: [
          'Le composant Form : architecture et concepts',
          'FormBuilder et types de champs natifs',
          'Validation : constraints, groups, custom validators',
          'Gestion des erreurs et messages personnalisés',
          'Formulaires imbriqués et collections',
          'Upload de fichiers : configuration et sécurité',
          'Thèmes de formulaires avec Twig',
          'Formulaires dynamiques (events)',
          'Protection CSRF',
          'TP : Formulaire de profil utilisateur avec avatar'
        ]
      },
      {
        title: 'Module 6 - Sécurité et Authentification',
        duration: '5h',
        description: 'Sécuriser votre application de bout en bout',
        topics: [
          'Architecture du composant Security',
          'Configuration du firewall et providers',
          'Authentification : form_login, remember_me, logout',
          'Création d\'un système d\'inscription complet',
          'Reset password avec token sécurisé',
          'Hashage des mots de passe (bcrypt, argon2)',
          'Rôles et hiérarchie des rôles',
          'Voters : logique d\'autorisation métier',
          'Access Control : annotations et configuration',
          'Authentification API : JWT basics',
          'TP : Système d\'authentification complet multi-rôles'
        ]
      },
      {
        title: 'Module 7 - Services et Architecture',
        duration: '4h',
        description: 'Structurer son code avec les services et l\'injection de dépendances',
        topics: [
          'Le Container de services : concepts et fonctionnement',
          'Création de services métier',
          'Injection de dépendances : constructeur, setter, attributs',
          'Autowiring et autoconfiguration',
          'Paramètres et configuration des services',
          'Tags et compiler passes',
          'Events et EventSubscribers',
          'Messenger : queues et messages asynchrones',
          'TP : Service de notification (email, Slack)'
        ]
      },
      {
        title: 'Module 8 - API REST et Serialization',
        duration: '4h',
        description: 'Exposer des données via une API RESTful',
        topics: [
          'Principes REST et bonnes pratiques',
          'Serializer : normalizers et encoders',
          'Groups de serialization',
          'Gestion des erreurs API (JSON)',
          'Pagination et filtres',
          'Introduction à API Platform',
          'Documentation OpenAPI automatique',
          'Versioning d\'API',
          'TP : API REST complète pour une app mobile'
        ]
      },
      {
        title: 'Module 9 - Tests',
        duration: '3h',
        description: 'Tester son application pour garantir la qualité',
        topics: [
          'PHPUnit : configuration et premiers tests',
          'Tests unitaires : services, entities',
          'Tests fonctionnels : controllers, forms',
          'WebTestCase et le client de test',
          'Fixtures pour les tests',
          'Mocking et stubs',
          'Tests d\'intégration base de données',
          'Coverage et CI/CD',
          'TP : Suite de tests pour l\'application'
        ]
      },
      {
        title: 'Module 10 - Production et Déploiement',
        duration: '2h',
        description: 'Mettre en production une application Symfony',
        topics: [
          'Environnements : dev, test, prod',
          'Variables d\'environnement et secrets',
          'Optimisation : cache, OPcache, preloading',
          'Logs et monitoring (Monolog)',
          'Déploiement sur serveur Linux',
          'Configuration Nginx/Apache',
          'SSL/HTTPS avec Let\'s Encrypt',
          'Checklist de mise en production'
        ]
      }
    ],
    
    tools: ['Symfony 7', 'PHP 8.3', 'Composer', 'Doctrine ORM', 'Twig', 'MySQL/PostgreSQL', 'PHPUnit', 'Webpack Encore'],
    
    certification: true,
    certificationName: 'GL Digital Lab - Symfony Developer',
    certificationDescription: 'Certification attestant de la maîtrise des fondamentaux Symfony pour le développement d\'applications web professionnelles.',
    
    instructor: {
      name: 'Gaëtan Langlet',
      title: 'Expert Symfony & Architecte Web',
      bio: 'Développeur Symfony depuis 2018, j\'ai travaillé sur des projets variés : ERP, SaaS B2B, e-commerce, APIs. Certifié RNCP Niveau 6, je forme les développeurs aux bonnes pratiques avec une approche pragmatique orientée production.',
      avatar: '/images/neo-avatar.jpg'
    },
    
    testimonials: [
      {
        name: 'Marie L.',
        company: 'StartupTech Bordeaux',
        text: 'Formation très complète et bien structurée. Gaëtan maîtrise parfaitement Symfony et sait transmettre avec des exemples concrets. J\'ai pu appliquer directement sur mon projet d\'entreprise.',
        rating: 5
      },
      {
        name: 'Thomas D.',
        company: 'Agence Web Amiens',
        text: 'Enfin une formation qui va au-delà des tutoriels YouTube ! Les bonnes pratiques et l\'architecture propre, c\'est ce qui manquait à mon équipe.',
        rating: 5
      }
    ],
    
    nextSessions: [
      { date: '2026-02-10', location: 'Amiens (présentiel)', spots: 6 },
      { date: '2026-03-17', location: 'En ligne (visio)', spots: 10 },
      { date: '2026-04-14', location: 'Amiens (présentiel)', spots: 6 },
      { date: '2026-05-19', location: 'En ligne (visio)', spots: 10 }
    ],
    
    faq: [
      {
        question: 'Faut-il connaître un autre framework PHP avant ?',
        answer: 'Non, mais une bonne maîtrise de PHP orienté objet est indispensable. Si vous venez de Laravel ou CodeIgniter, vous vous adapterez rapidement.'
      },
      {
        question: 'Quelle version de PHP est nécessaire ?',
        answer: 'PHP 8.2 minimum, idéalement PHP 8.3. La formation utilise les dernières fonctionnalités (attributs, enums, readonly).'
      },
      {
        question: 'Est-ce que la formation couvre API Platform ?',
        answer: 'Nous faisons une introduction à API Platform dans le module API. Pour aller plus loin, une formation dédiée API Platform est disponible.'
      }
    ]
  },

  // ============================================================================
  // VUE.JS 3 - FORMATION COMPLÈTE
  // ============================================================================
  {
    id: 'vue3-complete',
    slug: 'vue3-complet',
    title: 'Vue.js 3 - Formation Complète',
    subtitle: 'Du débutant au développeur Vue confirmé avec la Composition API',
    category: 'frontend',
    level: 'intermediate',
    duration: '28h',
    format: 'hybrid',
    price: 1290,
    priceInfo: 'Éligible CPF & OPCO',
    featured: true,
    new: false,
    
    description: `Vue.js 3 a révolutionné le développement frontend avec sa Composition API, offrant une flexibilité et une réutilisabilité du code sans précédent. Cette formation vous emmène de zéro à un niveau professionnel.

Contrairement aux tutoriels qui survolent les concepts, nous allons **en profondeur** : comprendre le système de réactivité, maîtriser les patterns de composition, architecturer une vraie application.

Vous construirez progressivement une application SaaS complète : dashboard analytics avec graphiques, gestion d'utilisateurs, thème sombre, et connexion API.

**Pourquoi Vue.js 3 ?**
- Courbe d'apprentissage douce mais puissant en production
- Composition API : code plus lisible et maintenable
- Performances excellentes (Virtual DOM optimisé)
- Écosystème mature : Pinia, Vue Router, Vite
- Très demandé sur le marché français`,

    objectives: [
      'Comprendre le système de réactivité de Vue 3 (ref, reactive, computed)',
      'Maîtriser la Composition API et créer des composables réutilisables',
      'Construire des composants modulaires avec props, events et slots',
      'Gérer l\'état global avec Pinia (stores, actions, getters)',
      'Implémenter le routing avec Vue Router (guards, lazy loading)',
      'Consommer des APIs REST avec fetch et gestion d\'erreurs',
      'Écrire des tests unitaires et de composants avec Vitest',
      'Optimiser les performances (code splitting, virtual scrolling)',
      'Utiliser TypeScript avec Vue 3',
      'Déployer une application Vue sur Vercel/Netlify'
    ],
    
    prerequisites: [
      'HTML et CSS maîtrisés',
      'JavaScript ES6+ : let/const, arrow functions, destructuring, modules, async/await',
      'Notions de npm et Node.js',
      'Familiarité avec le terminal',
      'Un éditeur de code (VS Code recommandé avec Volar)'
    ],
    
    program: [
      {
        title: 'Module 1 - Fondamentaux Vue 3',
        duration: '4h',
        description: 'Les bases essentielles pour démarrer avec Vue 3',
        topics: [
          'Présentation de Vue 3 : évolutions majeures depuis Vue 2',
          'Création d\'un projet avec Vite (plus rapide que Vue CLI)',
          'Structure d\'un composant Single File Component (.vue)',
          'Template syntax : interpolation, directives (v-bind, v-on)',
          'Réactivité avec ref() et reactive()',
          'Propriétés calculées avec computed()',
          'Watchers : watch() et watchEffect()',
          'Cycle de vie des composants (onMounted, onUnmounted...)',
          'TP : Application de liste de courses réactive'
        ]
      },
      {
        title: 'Module 2 - Composants en profondeur',
        duration: '5h',
        description: 'Créer des composants réutilisables et maintenables',
        topics: [
          'Props : typage, valeurs par défaut, validation',
          'Events : $emit et convention de nommage',
          'v-model sur composants personnalisés',
          'Slots : default, named, scoped slots',
          'Provide/Inject pour l\'injection de dépendances',
          'Composants dynamiques et async',
          'Teleport pour les modales et tooltips',
          'Suspense et gestion du chargement',
          'TP : Bibliothèque de composants UI (Button, Modal, Card, Input)'
        ]
      },
      {
        title: 'Module 3 - Composition API avancée',
        duration: '5h',
        description: 'Patterns avancés pour un code professionnel',
        topics: [
          'Qu\'est-ce qu\'un composable et pourquoi ?',
          'Créer des composables : useCounter, useLocalStorage',
          'Pattern useAsync : gestion loading/error/data',
          'Composables avec paramètres réactifs',
          'Composition de composables',
          'VueUse : bibliothèque de composables prêts à l\'emploi',
          'Gestion des effets de bord et cleanup',
          'Introduction à TypeScript avec Vue 3',
          'TP : Composables métier (useAuth, useApi, useTheme)'
        ]
      },
      {
        title: 'Module 4 - Pinia State Management',
        duration: '4h',
        description: 'Gérer l\'état global de l\'application',
        topics: [
          'Pourquoi un state manager ? Quand l\'utiliser ?',
          'Installation et configuration de Pinia',
          'Définir un store : state, getters, actions',
          'Option API vs Setup Stores',
          'Accéder aux stores dans les composants',
          'Actions asynchrones et gestion d\'erreurs',
          'Plugins Pinia : persistance, logging',
          'Pinia DevTools pour le debugging',
          'Bonnes pratiques : organisation des stores',
          'TP : Store utilisateur avec authentification'
        ]
      },
      {
        title: 'Module 5 - Vue Router',
        duration: '4h',
        description: 'Navigation et routing dans une SPA',
        topics: [
          'Installation et configuration de Vue Router 4',
          'Définir des routes : path, component, name',
          'RouterLink et RouterView',
          'Routes dynamiques avec paramètres',
          'Routes imbriquées (nested routes)',
          'Navigation programmatique (useRouter, useRoute)',
          'Navigation guards : beforeEach, beforeEnter',
          'Lazy loading des routes pour les performances',
          'Gestion des erreurs 404',
          'Meta fields et layouts',
          'TP : Application multi-pages avec authentification'
        ]
      },
      {
        title: 'Module 6 - Communication API',
        duration: '3h',
        description: 'Consommer des APIs REST efficacement',
        topics: [
          'Fetch API vs Axios : avantages et inconvénients',
          'Créer un service API centralisé',
          'Gestion des headers et authentification JWT',
          'Intercepteurs pour refresh token',
          'Gestion des erreurs HTTP',
          'Loading states et feedback utilisateur',
          'Cache et optimistic updates',
          'TP : Intégration API REST avec CRUD complet'
        ]
      },
      {
        title: 'Module 7 - Tests',
        duration: '3h',
        description: 'Tester ses composants Vue',
        topics: [
          'Configuration de Vitest pour Vue',
          'Tests unitaires de composables',
          'Vue Test Utils : mounting components',
          'Tester les props, events, slots',
          'Tester avec Pinia (mock stores)',
          'Tester avec Vue Router',
          'Snapshot testing',
          'Coverage et CI/CD',
          'TP : Suite de tests pour l\'application'
        ]
      },
      {
        title: 'Module 8 - Performances et Production',
        duration: '2h',
        description: 'Optimiser et déployer',
        topics: [
          'Analyse du bundle avec Vite',
          'Code splitting et lazy loading',
          'Virtual scrolling pour les grandes listes',
          'Optimisation des re-renders',
          'PWA avec vite-plugin-pwa',
          'SEO et SSR basics (Nuxt mention)',
          'Déploiement Vercel/Netlify',
          'Variables d\'environnement'
        ]
      },
      {
        title: 'Module 9 - Projet Final',
        duration: '2h',
        description: 'Mettre en pratique toutes les compétences',
        topics: [
          'Revue de code et architecture',
          'Refactoring et bonnes pratiques',
          'Documentation du projet',
          'Préparation au déploiement',
          'Q&A et conseils carrière'
        ]
      }
    ],
    
    tools: ['Vue.js 3', 'Vite', 'Pinia', 'Vue Router 4', 'TypeScript', 'Vitest', 'Vue Test Utils', 'Tailwind CSS'],
    
    certification: true,
    certificationName: 'GL Digital Lab - Vue.js Developer',
    certificationDescription: 'Certification validant la maîtrise de Vue.js 3 et son écosystème pour le développement d\'applications frontend modernes.',
    
    instructor: {
      name: 'Gaëtan Langlet',
      title: 'Expert Vue.js & Frontend Architecture',
      bio: 'Je développe avec Vue.js depuis la version 2.x et j\'ai migré plusieurs projets vers Vue 3. Mon portfolio lui-même est une vitrine de ce que permet Vue 3 avec Three.js et des animations avancées.',
      avatar: '/images/neo-avatar.jpg'
    },
    
    testimonials: [
      {
        name: 'Sophie M.',
        company: 'Freelance',
        text: 'La Composition API me faisait peur, mais Gaëtan a su rendre ça accessible. Je ne reviendrais plus à l\'Options API !',
        rating: 5
      },
      {
        name: 'Kevin R.',
        company: 'ESN Paris',
        text: 'Formation très complète, j\'ai particulièrement apprécié les parties sur les composables et Pinia. Directement applicable en mission.',
        rating: 5
      }
    ],
    
    nextSessions: [
      { date: '2026-02-17', location: 'En ligne (visio)', spots: 12 },
      { date: '2026-03-24', location: 'Amiens (présentiel)', spots: 6 },
      { date: '2026-04-28', location: 'En ligne (visio)', spots: 12 }
    ],
    
    faq: [
      {
        question: 'Faut-il connaître Vue 2 avant ?',
        answer: 'Non ! Nous partons de zéro avec Vue 3. Si vous connaissez Vue 2, vous verrez les différences au fil de la formation.'
      },
      {
        question: 'TypeScript est-il obligatoire ?',
        answer: 'Non, mais fortement recommandé. Nous introduisons TypeScript progressivement dans la formation pour ceux qui veulent l\'adopter.'
      },
      {
        question: 'Quelle différence avec React ?',
        answer: 'Vue est plus accessible et conventionné. La formation vous donnera une base solide, et les concepts (composants, state, routing) sont transférables.'
      }
    ]
  },

  // ============================================================================
  // INTÉGRER L'IA DANS VOS PROJETS WEB
  // ============================================================================
  {
    id: 'ia-integration-web',
    slug: 'integration-ia-web',
    title: 'Intégrer l\'IA dans vos projets web',
    subtitle: 'APIs, LLMs, RAG et automatisation intelligente pour développeurs',
    category: 'ia',
    level: 'intermediate',
    duration: '21h',
    format: 'hybrid',
    price: 1690,
    priceInfo: 'Éligible CPF & OPCO',
    featured: true,
    new: true,
    
    description: `L'intelligence artificielle n'est plus réservée aux data scientists. En tant que développeur web, vous pouvez aujourd'hui intégrer des capacités IA impressionnantes dans vos applications grâce aux APIs.

Cette formation pratique vous apprend à **utiliser** l'IA, pas à la créer from scratch. Vous apprendrez à intégrer GPT-4, Claude, et même des modèles locaux avec Ollama dans vos projets Symfony, Vue.js ou Node.js.

Le point fort ? Nous construisons ensemble un **système RAG complet** : une base de connaissances intelligente qui répond aux questions en s'appuyant sur vos propres documents.

**Ce que vous saurez faire :**
- Intégrer ChatGPT/Claude dans une application web
- Déployer une IA locale pour la confidentialité
- Construire un chatbot contextuel pour votre métier
- Automatiser des tâches avec des workflows IA`,

    objectives: [
      'Comprendre le fonctionnement des LLMs (tokens, contexte, température)',
      'Rédiger des prompts efficaces et structurés',
      'Intégrer l\'API OpenAI (GPT-4) dans une application PHP/JS',
      'Intégrer l\'API Anthropic (Claude) et comparer les modèles',
      'Déployer Ollama pour une IA 100% locale',
      'Comprendre et implémenter les embeddings',
      'Construire un système RAG avec ChromaDB',
      'Créer un chatbot contextuel avec mémoire conversationnelle',
      'Automatiser des workflows avec n8n et IA',
      'Gérer les coûts et optimiser les appels API'
    ],
    
    prerequisites: [
      'Développement web (PHP, JavaScript ou Python)',
      'Compréhension des APIs REST (requêtes HTTP, JSON)',
      'Bases de Docker (pour Ollama et ChromaDB)',
      'Curiosité et envie d\'expérimenter !',
      'Compte OpenAI ou Anthropic (quelques euros de crédits suffisent)'
    ],
    
    program: [
      {
        title: 'Module 1 - Comprendre les LLMs',
        duration: '3h',
        description: 'Les fondamentaux pour démystifier l\'IA générative',
        topics: [
          'Qu\'est-ce qu\'un Large Language Model ?',
          'Comment fonctionne la génération de texte (tokens, probabilités)',
          'Le concept de contexte et sa limite (context window)',
          'Température, top_p : contrôler la créativité',
          'Les différents modèles : GPT-4, Claude, Llama, Mistral',
          'Limites des LLMs : hallucinations, biais, connaissances datées',
          'Cas d\'usage pertinents vs gadgets',
          'Éthique et responsabilité dans l\'usage de l\'IA',
          'TP : Expérimentation avec différents modèles'
        ]
      },
      {
        title: 'Module 2 - Prompt Engineering',
        duration: '3h',
        description: 'L\'art de communiquer efficacement avec les LLMs',
        topics: [
          'Anatomie d\'un bon prompt : rôle, contexte, tâche, format',
          'Techniques : few-shot, chain-of-thought, self-consistency',
          'System prompts vs user prompts',
          'Structurer les sorties : JSON, Markdown, listes',
          'Prompts pour le code : génération, review, debugging',
          'Prompts pour le contenu : rédaction, résumé, traduction',
          'Éviter les pièges courants',
          'Templates réutilisables pour vos projets',
          'TP : Créer une bibliothèque de prompts métier'
        ]
      },
      {
        title: 'Module 3 - APIs Cloud (OpenAI, Claude)',
        duration: '4h',
        description: 'Intégrer les APIs des leaders du marché',
        topics: [
          'Inscription et gestion des clés API',
          'API OpenAI : chat completions, modèles, pricing',
          'Streaming des réponses pour une meilleure UX',
          'Function calling : faire agir l\'IA',
          'API Anthropic (Claude) : spécificités et avantages',
          'Gestion des erreurs et retry logic',
          'Rate limiting et bonnes pratiques',
          'Calcul et optimisation des coûts',
          'Sécurité : ne jamais exposer les clés côté client',
          'TP : Chat IA intégré dans une app Symfony/Vue'
        ]
      },
      {
        title: 'Module 4 - IA Locale avec Ollama',
        duration: '4h',
        description: 'Déployer des modèles IA en local pour la confidentialité',
        topics: [
          'Pourquoi l\'IA locale ? (confidentialité, coûts, offline)',
          'Installation d\'Ollama (Mac, Linux, Windows WSL)',
          'Télécharger et utiliser des modèles (Llama, Mistral, Phi)',
          'API REST Ollama : compatible OpenAI',
          'Comparaison performances cloud vs local',
          'Configuration GPU vs CPU',
          'Déploiement avec Docker',
          'Cas d\'usage : données sensibles, air-gapped',
          'TP : Chatbot 100% local pour données confidentielles'
        ]
      },
      {
        title: 'Module 5 - RAG (Retrieval Augmented Generation)',
        duration: '4h',
        description: 'Créer une IA qui connaît VOS documents',
        topics: [
          'Le problème : les LLMs ne connaissent pas vos données',
          'Solution RAG : retrieval + generation',
          'Embeddings : transformer du texte en vecteurs',
          'Bases de données vectorielles : ChromaDB, Pinecone',
          'Pipeline RAG : ingestion, chunking, retrieval, generation',
          'Stratégies de chunking (taille, overlap)',
          'Améliorer la pertinence : re-ranking, filtres',
          'Évaluation de la qualité des réponses',
          'TP : Base de connaissances pour documentation technique'
        ]
      },
      {
        title: 'Module 6 - Chatbot Contextuel',
        duration: '3h',
        description: 'Construire un assistant IA personnalisé',
        topics: [
          'Architecture d\'un chatbot : frontend, backend, LLM',
          'Gestion de la mémoire conversationnelle',
          'Personnalité et ton du chatbot (system prompt)',
          'Intégration du RAG pour le contexte métier',
          'Modération des entrées/sorties',
          'Interface utilisateur : streaming, typing indicator',
          'Historique et persistance des conversations',
          'TP : Chatbot support client pour un site e-commerce'
        ]
      },
      {
        title: 'Module 7 - Automatisation avec n8n',
        duration: '3h',
        description: 'Workflows intelligents sans code',
        topics: [
          'Présentation de n8n : alternative open-source à Zapier',
          'Installation locale avec Docker',
          'Nœuds IA : OpenAI, Anthropic, Ollama',
          'Cas d\'usage : génération de contenu automatique',
          'Cas d\'usage : classification de tickets support',
          'Cas d\'usage : résumé automatique d\'emails',
          'Triggers : webhook, cron, événements',
          'Connexion avec vos applications existantes',
          'TP : Pipeline de content marketing automatisé'
        ]
      }
    ],
    
    tools: ['OpenAI API', 'Anthropic Claude API', 'Ollama', 'ChromaDB', 'n8n', 'LangChain', 'Docker', 'Python/PHP/Node.js'],
    
    certification: true,
    certificationName: 'GL Digital Lab - AI Web Integration Specialist',
    certificationDescription: 'Certification validant la capacité à intégrer des solutions IA (APIs, RAG, chatbots) dans des applications web professionnelles.',
    
    instructor: {
      name: 'Gaëtan Langlet',
      title: 'Expert IA & Automatisation',
      bio: 'Passionné par l\'IA depuis 2022, j\'ai construit ma propre stack IA locale (Ollama, ChromaDB, n8n) et j\'intègre des agents IA dans mes projets clients. Mon portfolio est assisté par 15 agents IA spécialisés !',
      avatar: '/images/neo-avatar.jpg'
    },
    
    testimonials: [
      {
        name: 'Alexandre B.',
        company: 'CTO Startup',
        text: 'On voulait intégrer de l\'IA dans notre SaaS mais on ne savait pas par où commencer. Cette formation nous a fait gagner des mois de R&D.',
        rating: 5
      },
      {
        name: 'Émilie T.',
        company: 'Développeuse Freelance',
        text: 'Le module RAG était exactement ce qu\'il me fallait pour mon projet de chatbot juridique. Très bien expliqué !',
        rating: 5
      }
    ],
    
    nextSessions: [
      { date: '2026-02-24', location: 'En ligne (visio)', spots: 10 },
      { date: '2026-04-07', location: 'Amiens (présentiel)', spots: 6 },
      { date: '2026-05-12', location: 'En ligne (visio)', spots: 10 }
    ],
    
    faq: [
      {
        question: 'Faut-il savoir coder en Python ?',
        answer: 'Non obligatoire. Les exemples sont disponibles en PHP, JavaScript et Python. Vous suivez avec votre langage préféré.'
      },
      {
        question: 'Quel budget pour les APIs ?',
        answer: 'Comptez 10-20€ pour toute la formation. Nous utilisons aussi Ollama (gratuit) pour limiter les coûts.'
      },
      {
        question: 'Mon PC peut-il faire tourner Ollama ?',
        answer: '8 Go de RAM minimum, 16 Go recommandé. Un GPU est un plus mais pas obligatoire (les petits modèles tournent en CPU).'
      }
    ]
  },

  // ============================================================================
  // DOCKER & DEVOPS ESSENTIELS
  // ============================================================================
  {
    id: 'docker-devops-essentials',
    slug: 'docker-devops-essentiels',
    title: 'Docker & DevOps Essentiels',
    subtitle: 'Containerisation, CI/CD et déploiement moderne pour développeurs',
    category: 'devops',
    level: 'intermediate',
    duration: '21h',
    format: 'hybrid',
    price: 1190,
    priceInfo: 'Éligible OPCO',
    featured: false,
    new: false,
    
    description: `Docker a révolutionné la façon dont nous développons, testons et déployons nos applications. Fini les "ça marche sur ma machine" !

Cette formation vous donne les compétences DevOps essentielles pour un développeur moderne : containeriser vos apps, orchestrer des services, automatiser vos déploiements.

Nous partons de zéro et allons jusqu'à un pipeline CI/CD complet qui build, teste et déploie automatiquement votre code sur un serveur de production.

**À la fin de la formation, vous saurez :**
- Containeriser n'importe quelle application (PHP, Node, Python)
- Créer des environnements de développement reproductibles
- Automatiser vos tests et déploiements avec GitHub Actions
- Gérer un serveur de production avec Docker`,

    objectives: [
      'Comprendre la containerisation et ses avantages vs VMs',
      'Écrire des Dockerfiles optimisés et sécurisés',
      'Utiliser Docker Compose pour orchestrer des services',
      'Mettre en place des environnements de développement reproductibles',
      'Créer des pipelines CI/CD avec GitHub Actions',
      'Automatiser les tests, builds et déploiements',
      'Gérer les secrets et variables d\'environnement',
      'Déployer sur un VPS avec Docker',
      'Configurer un reverse proxy avec Traefik',
      'Monitorer et debugger des containers en production'
    ],
    
    prerequisites: [
      'Connaissances en développement web (peu importe le langage)',
      'Familiarité avec la ligne de commande Linux',
      'Bases de Git (commit, push, pull, branches)',
      'Compte GitHub',
      'Un VPS ou serveur cloud pour la partie déploiement (optionnel)'
    ],
    
    program: [
      {
        title: 'Module 1 - Fondamentaux Docker',
        duration: '4h',
        description: 'Comprendre et utiliser Docker au quotidien',
        topics: [
          'Containers vs Machines Virtuelles : concepts et différences',
          'Installation de Docker (Windows WSL2, Mac, Linux)',
          'Docker Desktop et alternatives (Rancher Desktop, Podman)',
          'Images et containers : cycle de vie',
          'Docker Hub : trouver et utiliser des images',
          'Commandes essentielles : run, exec, logs, ps, stop, rm',
          'Volumes : persister les données',
          'Networks : faire communiquer les containers',
          'TP : Lancer une stack LAMP en containers'
        ]
      },
      {
        title: 'Module 2 - Dockerfile',
        duration: '4h',
        description: 'Créer des images Docker personnalisées',
        topics: [
          'Anatomie d\'un Dockerfile',
          'Instructions : FROM, RUN, COPY, WORKDIR, CMD, ENTRYPOINT',
          'Layers et cache : optimiser les builds',
          'Multi-stage builds : images légères',
          'Arguments et variables d\'environnement (ARG, ENV)',
          '.dockerignore : exclure des fichiers',
          'Best practices de sécurité (non-root user, scan vulnérabilités)',
          'Dockerfile pour PHP/Symfony',
          'Dockerfile pour Node.js/Vue',
          'TP : Containeriser votre projet existant'
        ]
      },
      {
        title: 'Module 3 - Docker Compose',
        duration: '4h',
        description: 'Orchestrer des applications multi-containers',
        topics: [
          'Pourquoi Docker Compose ?',
          'Syntaxe docker-compose.yml v3',
          'Services, réseaux et volumes',
          'Variables d\'environnement et fichiers .env',
          'Dépendances entre services (depends_on, healthcheck)',
          'Profiles : environnements conditionnels',
          'Override et fichiers multiples',
          'Commandes : up, down, logs, exec, build',
          'TP : Stack complète Symfony + MySQL + Redis + Mailhog'
        ]
      },
      {
        title: 'Module 4 - CI/CD avec GitHub Actions',
        duration: '5h',
        description: 'Automatiser tests, builds et déploiements',
        topics: [
          'Introduction à la CI/CD : concepts et bénéfices',
          'GitHub Actions : workflows, jobs, steps',
          'Syntaxe YAML des workflows',
          'Triggers : push, pull_request, schedule, manual',
          'Actions du marketplace',
          'Build et test automatiques',
          'Lint et analyse de code',
          'Build et push d\'images Docker',
          'Secrets et variables d\'environnement',
          'Matrices de test (versions PHP, Node)',
          'TP : Pipeline complet pour un projet Symfony'
        ]
      },
      {
        title: 'Module 5 - Déploiement Production',
        duration: '4h',
        description: 'Mettre en production avec Docker',
        topics: [
          'Choisir un hébergement : VPS, Cloud, PaaS',
          'Configuration serveur : Docker sur Ubuntu',
          'Reverse proxy avec Traefik',
          'SSL automatique avec Let\'s Encrypt',
          'Déploiement via GitHub Actions (SSH)',
          'Docker Compose en production',
          'Gestion des logs (centralisés)',
          'Health checks et restart policies',
          'Backup des volumes',
          'TP : Déployer l\'application sur un VPS'
        ]
      },
      {
        title: 'Module 6 - Monitoring et Debugging',
        duration: '2h',
        description: 'Surveiller et dépanner en production',
        topics: [
          'Logs : docker logs, drivers de logging',
          'Monitoring avec Portainer',
          'Métriques de base (CPU, RAM, disk)',
          'Debugging : exec, inspect, events',
          'Gestion des pannes et recovery',
          'Mise à jour zero-downtime',
          'Checklist de production'
        ]
      }
    ],
    
    tools: ['Docker', 'Docker Compose', 'GitHub Actions', 'Traefik', 'Portainer', 'Linux/Ubuntu'],
    
    certification: true,
    certificationName: 'GL Digital Lab - Docker DevOps Practitioner',
    certificationDescription: 'Certification attestant de la maîtrise de Docker et des pratiques CI/CD pour le déploiement d\'applications web.',
    
    instructor: {
      name: 'Gaëtan Langlet',
      title: 'DevOps & Cloud Architecture',
      bio: 'J\'utilise Docker quotidiennement depuis 2019 pour mes projets clients et personnels. Ma stack ARKADIA (serveurs de jeu) tourne entièrement sur Docker avec monitoring et déploiement automatisé.',
      avatar: '/images/neo-avatar.jpg'
    },
    
    testimonials: [
      {
        name: 'Julien P.',
        company: 'Lead Dev ESN',
        text: 'On avait des "ça marche sur ma machine" tout le temps. Depuis la formation, toute l\'équipe utilise Docker et c\'est le jour et la nuit.',
        rating: 5
      }
    ],
    
    nextSessions: [
      { date: '2026-03-03', location: 'En ligne (visio)', spots: 12 },
      { date: '2026-04-21', location: 'Amiens (présentiel)', spots: 6 }
    ],
    
    faq: [
      {
        question: 'Docker fonctionne-t-il sur Windows ?',
        answer: 'Oui, via WSL2 (Windows Subsystem for Linux). Nous couvrons l\'installation en détail au début de la formation.'
      },
      {
        question: 'Faut-il un serveur pour la formation ?',
        answer: 'Pour la partie déploiement, un petit VPS (5€/mois) est idéal. Sinon, nous faisons des démos sur mon infrastructure.'
      }
    ]
  },

  // ============================================================================
  // CONCEPTION API REST PROFESSIONNELLES
  // ============================================================================
  {
    id: 'api-rest-design',
    slug: 'conception-api-rest',
    title: 'Concevoir des APIs REST Professionnelles',
    subtitle: 'Design, documentation et sécurité pour des APIs de qualité production',
    category: 'backend',
    level: 'intermediate',
    duration: '14h',
    format: 'online',
    price: 890,
    priceInfo: 'Éligible OPCO',
    featured: false,
    new: false,
    
    description: `Une API bien conçue fait la différence entre un projet maintenable et un cauchemar technique. Cette formation vous apprend les standards et bonnes pratiques pour créer des APIs que vos collègues (et vous-même dans 6 mois) aimeront utiliser.

Nous couvrons le design RESTful, la documentation OpenAPI, l'authentification JWT, et les patterns avancés (pagination, filtres, versioning).

**Vous repartirez avec :**
- Une méthodologie de conception d'API
- Des templates OpenAPI réutilisables
- Une collection Postman complète
- Les réflexes sécurité indispensables`,

    objectives: [
      'Appliquer les principes REST et les conventions de nommage',
      'Concevoir des endpoints cohérents et prévisibles',
      'Documenter avec OpenAPI/Swagger',
      'Implémenter l\'authentification JWT',
      'Gérer pagination, filtres et tri',
      'Choisir une stratégie de versioning',
      'Gérer les erreurs de façon standardisée',
      'Tester ses APIs avec Postman',
      'Sécuriser ses endpoints (rate limiting, CORS, validation)'
    ],
    
    prerequisites: [
      'Expérience en développement backend (PHP, Node.js, Python...)',
      'Compréhension du protocole HTTP (méthodes, codes de statut)',
      'Bases de JSON',
      'Avoir déjà consommé des APIs'
    ],
    
    program: [
      {
        title: 'Module 1 - Principes REST',
        duration: '3h',
        description: 'Les fondamentaux du design RESTful',
        topics: [
          'Histoire et philosophie REST',
          'Les 6 contraintes REST',
          'Ressources et URIs : conventions de nommage',
          'Méthodes HTTP : GET, POST, PUT, PATCH, DELETE',
          'Codes de statut : 2xx, 3xx, 4xx, 5xx',
          'HATEOAS : hyperliens dans les réponses',
          'Idempotence et safety',
          'REST vs GraphQL vs gRPC : quand choisir quoi',
          'TP : Concevoir l\'API d\'un blog'
        ]
      },
      {
        title: 'Module 2 - Design Patterns API',
        duration: '3h',
        description: 'Patterns avancés pour des APIs complètes',
        topics: [
          'Pagination : offset, cursor, keyset',
          'Filtres : query params, syntaxe',
          'Tri et ordering',
          'Recherche full-text',
          'Expansion de ressources (embed)',
          'Sparse fieldsets (champs partiels)',
          'Versioning : URL, header, query param',
          'Bulk operations',
          'TP : API e-commerce avec filtres avancés'
        ]
      },
      {
        title: 'Module 3 - Sécurité API',
        duration: '3h',
        description: 'Protéger ses APIs des menaces',
        topics: [
          'Authentication vs Authorization',
          'JWT : structure, signature, claims',
          'Access tokens et refresh tokens',
          'OAuth 2.0 flows (Authorization Code, Client Credentials)',
          'API Keys : quand et comment',
          'Rate limiting : protéger contre les abus',
          'CORS : configuration sécurisée',
          'Validation des entrées',
          'Protection contre les injections',
          'TP : Sécuriser une API avec JWT'
        ]
      },
      {
        title: 'Module 4 - Documentation OpenAPI',
        duration: '3h',
        description: 'Documenter pour les développeurs',
        topics: [
          'Spécification OpenAPI 3.1',
          'Paths, operations, parameters',
          'Request bodies et responses',
          'Schemas et $ref',
          'Exemples et descriptions',
          'Swagger UI : documentation interactive',
          'Génération de code client',
          'Intégration dans le workflow de développement',
          'TP : Documenter l\'API du projet'
        ]
      },
      {
        title: 'Module 5 - Tests et Monitoring',
        duration: '2h',
        description: 'Garantir la qualité',
        topics: [
          'Tests manuels avec Postman/Insomnia',
          'Collections et environnements Postman',
          'Tests automatisés avec Newman',
          'Contract testing',
          'Monitoring et alerting',
          'Logging des requêtes API',
          'TP : Suite de tests Postman complète'
        ]
      }
    ],
    
    tools: ['OpenAPI 3.1', 'Swagger UI', 'Postman', 'JWT', 'OAuth 2.0'],
    
    certification: true,
    certificationName: 'GL Digital Lab - API Designer',
    certificationDescription: 'Certification validant la maîtrise de la conception, documentation et sécurisation d\'APIs REST professionnelles.',
    
    instructor: {
      name: 'Gaëtan Langlet',
      title: 'Expert API & Architecture Backend',
      bio: 'J\'ai conçu et maintenu des APIs pour des applications SaaS, e-commerce et internes. La documentation et la cohérence sont mes obsessions pour des APIs agréables à utiliser.',
      avatar: '/images/neo-avatar.jpg'
    },
    
    nextSessions: [
      { date: '2026-02-03', location: 'En ligne (visio)', spots: 15 },
      { date: '2026-04-14', location: 'En ligne (visio)', spots: 15 }
    ]
  },

  // ============================================================================
  // THREE.JS - EXPÉRIENCES 3D WEB
  // ============================================================================
  {
    id: 'threejs-web3d',
    slug: 'threejs-3d-web',
    title: 'Three.js - Créez des expériences 3D web',
    subtitle: 'WebGL et 3D interactive directement dans le navigateur',
    category: 'frontend',
    level: 'advanced',
    duration: '21h',
    format: 'online',
    price: 1390,
    priceInfo: 'Éligible OPCO',
    featured: false,
    new: true,
    
    description: `Three.js ouvre les portes de la 3D dans le navigateur. Créez des visualisations de données, des configurateurs produit, des jeux, ou simplement des portfolios qui marquent les esprits.

Cette formation vous emmène des bases de la 3D jusqu'à des scènes interactives complètes. Mon propre portfolio utilise Three.js pour créer des univers immersifs - vous aussi, vous pourrez créer ce genre d'expériences.

**Ce que vous créerez :**
- Une scène 3D interactive avec éclairage réaliste
- Un configurateur de produit (couleurs, matériaux)
- Des animations fluides avec GSAP
- Une intégration dans Vue.js ou React`,

    objectives: [
      'Comprendre les concepts 3D : scène, caméra, mesh, géométrie, matériau',
      'Créer et manipuler des objets 3D',
      'Gérer les lumières et les ombres',
      'Appliquer des textures et matériaux PBR',
      'Animer avec requestAnimationFrame et GSAP',
      'Charger des modèles 3D (GLTF/GLB)',
      'Gérer les interactions (raycasting, contrôles)',
      'Optimiser les performances WebGL',
      'Intégrer Three.js dans Vue.js ou React'
    ],
    
    prerequisites: [
      'JavaScript ES6+ solide (classes, modules, async/await)',
      'Notions mathématiques de base (vecteurs, angles)',
      'Connaissances en développement web frontend',
      'Curiosité pour la 3D et le design',
      'GPU dédié recommandé (intégré fonctionne pour les exercices)'
    ],
    
    program: [
      {
        title: 'Module 1 - Fondamentaux Three.js',
        duration: '4h',
        description: 'Les bases pour créer votre première scène',
        topics: [
          'Introduction à WebGL et Three.js',
          'Setup projet avec Vite',
          'La trinité : Scene, Camera, Renderer',
          'Géométries de base : Box, Sphere, Plane, Torus',
          'Matériaux : MeshBasicMaterial, MeshStandardMaterial',
          'Animation loop avec requestAnimationFrame',
          'Responsive : adapter la scène au viewport',
          'Debug avec lil-gui',
          'TP : Cube animé avec contrôles'
        ]
      },
      {
        title: 'Module 2 - Lumières et Ombres',
        duration: '4h',
        description: 'Donner vie à vos scènes avec l\'éclairage',
        topics: [
          'Types de lumières : Ambient, Directional, Point, Spot, Hemisphere',
          'Helpers pour visualiser les lumières',
          'Configuration des ombres (shadowMap)',
          'Baking : pré-calculer l\'éclairage',
          'Environment maps et HDR',
          'Tone mapping et exposition',
          'TP : Scène d\'intérieur avec éclairage réaliste'
        ]
      },
      {
        title: 'Module 3 - Textures et Matériaux',
        duration: '4h',
        description: 'Surfaces réalistes avec PBR',
        topics: [
          'TextureLoader et gestion des assets',
          'UV mapping : comprendre les coordonnées',
          'Maps : color, normal, roughness, metalness, AO',
          'MeshPhysicalMaterial : verre, eau, métal',
          'Matériaux procéduraux avec shaders',
          'CubeTexture pour les réflexions',
          'TP : Configurateur de matériaux'
        ]
      },
      {
        title: 'Module 4 - Modèles 3D et Animations',
        duration: '4h',
        description: 'Importer et animer des modèles',
        topics: [
          'Formats 3D : GLTF/GLB, OBJ, FBX',
          'GLTFLoader : charger des modèles',
          'Exporter depuis Blender pour Three.js',
          'DRACOLoader : compression des modèles',
          'AnimationMixer : jouer des animations',
          'Morph targets pour les déformations',
          'Skeletal animation',
          'TP : Personnage animé interactif'
        ]
      },
      {
        title: 'Module 5 - Interactions',
        duration: '3h',
        description: 'Rendre la scène interactive',
        topics: [
          'Raycasting : détecter les clics sur les objets',
          'OrbitControls : navigation caméra',
          'Autres contrôles : Fly, FirstPerson, PointerLock',
          'Drag and drop dans la scène 3D',
          'Events souris et touch',
          'Cursor et feedback visuel',
          'TP : Sélection et manipulation d\'objets'
        ]
      },
      {
        title: 'Module 6 - Performances et Production',
        duration: '3h',
        description: 'Optimiser pour tous les appareils',
        topics: [
          'Monitoring : stats.js, Spector.js',
          'Instancing : afficher des milliers d\'objets',
          'LOD (Level of Detail)',
          'Frustum culling',
          'Compression des textures',
          'Mobile : considérations spécifiques',
          'Post-processing : Bloom, DOF, SSAO',
          'Intégration dans Vue.js (vue-three)',
          'TP : Optimisation d\'une scène complexe'
        ]
      }
    ],
    
    tools: ['Three.js', 'WebGL', 'GSAP', 'Blender (export)', 'Vite', 'Vue.js'],
    
    certification: true,
    certificationName: 'GL Digital Lab - 3D Web Developer',
    certificationDescription: 'Certification validant la capacité à créer des expériences 3D interactives pour le web avec Three.js.',
    
    instructor: {
      name: 'Gaëtan Langlet',
      title: 'Creative Developer & 3D Enthusiast',
      bio: 'Mon portfolio est une démonstration vivante de ce que permet Three.js : 20 univers thématiques avec effets visuels, animations et interactions. J\'adore partager cette passion pour la 3D web.',
      avatar: '/images/neo-avatar.jpg'
    },
    
    nextSessions: [
      { date: '2026-03-10', location: 'En ligne (visio)', spots: 10 },
      { date: '2026-05-05', location: 'En ligne (visio)', spots: 10 }
    ]
  },

  // ============================================================================
  // PROMPT ENGINEERING PROFESSIONNEL
  // ============================================================================
  {
    id: 'prompt-engineering',
    slug: 'prompt-engineering-pro',
    title: 'Prompt Engineering Professionnel',
    subtitle: 'Maîtrisez l\'art de communiquer efficacement avec les IA',
    category: 'ia',
    level: 'beginner',
    duration: '7h',
    format: 'online',
    price: 490,
    priceInfo: '',
    featured: false,
    new: true,
    
    description: `Les LLMs comme ChatGPT et Claude sont des outils puissants... si on sait leur parler. La qualité du prompt détermine la qualité de la réponse.

Cette formation condensée vous donne les techniques pour obtenir des résultats pertinents et exploitables, que ce soit pour la rédaction, le code, l'analyse ou la créativité.

**Idéale pour :**
- Les développeurs qui veulent mieux utiliser Copilot et ChatGPT
- Les créateurs de contenu qui veulent produire plus vite
- Les professionnels qui veulent automatiser des tâches
- Toute personne curieuse de mieux comprendre ces outils`,

    objectives: [
      'Comprendre comment fonctionnent les LLMs',
      'Structurer des prompts clairs et efficaces',
      'Utiliser les techniques avancées (Chain of Thought, Few-shot)',
      'Adapter les prompts selon les cas d\'usage',
      'Créer des templates réutilisables',
      'Éviter les pièges et hallucinations',
      'Choisir le bon modèle pour chaque tâche'
    ],
    
    prerequisites: [
      'Aucun prérequis technique',
      'Avoir utilisé ChatGPT, Claude ou un autre LLM',
      'Curiosité et envie d\'expérimenter'
    ],
    
    program: [
      {
        title: 'Module 1 - Comprendre les LLMs',
        duration: '1h',
        description: 'Démystifier le fonctionnement des IA génératives',
        topics: [
          'Comment "pensent" les LLMs (spoiler: ils ne pensent pas)',
          'Tokens : l\'unité de base du texte',
          'Le contexte et ses limites',
          'Température et créativité',
          'Différences entre GPT-4, Claude, Gemini, Llama',
          'Limites : hallucinations, biais, connaissances datées'
        ]
      },
      {
        title: 'Module 2 - Anatomie d\'un bon prompt',
        duration: '2h',
        description: 'Les fondamentaux de la rédaction de prompts',
        topics: [
          'Structure RICE : Rôle, Instructions, Contexte, Exemples',
          'L\'importance de la clarté et de la précision',
          'Donner du contexte pertinent',
          'Spécifier le format de sortie attendu',
          'Contraintes et garde-fous',
          'System prompts vs user prompts',
          'Exercices pratiques'
        ]
      },
      {
        title: 'Module 3 - Techniques avancées',
        duration: '2h',
        description: 'Aller plus loin avec des patterns éprouvés',
        topics: [
          'Chain of Thought : faire raisonner l\'IA étape par étape',
          'Few-shot learning : apprendre par l\'exemple',
          'Self-consistency : vérifier ses réponses',
          'Role prompting : donner une personnalité',
          'Prompt chaining : découper les tâches complexes',
          'Méta-prompts : faire écrire des prompts par l\'IA',
          'Exercices pratiques'
        ]
      },
      {
        title: 'Module 4 - Cas d\'usage métier',
        duration: '2h',
        description: 'Applications concrètes par domaine',
        topics: [
          'Rédaction : articles, emails, rapports',
          'SEO : mots-clés, meta descriptions, contenu optimisé',
          'Code : génération, review, debugging, documentation',
          'Analyse : résumé, extraction, classification',
          'Créativité : brainstorming, storytelling',
          'Traduction et localisation',
          'Création de templates réutilisables',
          'Exercices pratiques par domaine'
        ]
      }
    ],
    
    tools: ['ChatGPT', 'Claude', 'Perplexity', 'Gemini'],
    
    certification: false,
    
    instructor: {
      name: 'Gaëtan Langlet',
      title: 'Expert IA & Prompt Engineering',
      bio: 'J\'utilise les LLMs quotidiennement pour le développement, la rédaction et l\'automatisation. J\'ai développé des dizaines de prompts pour mes agents IA et mes workflows.',
      avatar: '/images/neo-avatar.jpg'
    },
    
    nextSessions: [
      { date: '2026-01-27', location: 'En ligne (visio)', spots: 20 },
      { date: '2026-02-14', location: 'En ligne (visio)', spots: 20 },
      { date: '2026-03-14', location: 'En ligne (visio)', spots: 20 }
    ]
  },

  // ============================================================================
  // ACCESSIBILITÉ WEB - WCAG & RGAA
  // ============================================================================
  {
    id: 'web-accessibility',
    slug: 'accessibilite-web-wcag',
    title: 'Accessibilité Web - WCAG & RGAA',
    subtitle: 'Rendez vos sites accessibles à tous et conformes à la loi',
    category: 'web',
    level: 'intermediate',
    duration: '14h',
    format: 'online',
    price: 790,
    priceInfo: 'Éligible OPCO',
    featured: false,
    new: false,
    
    description: `L'accessibilité web n'est plus une option : c'est une obligation légale pour de nombreuses organisations, et surtout une question d'inclusion.

Cette formation vous donne les connaissances et outils pour auditer, corriger et concevoir des sites accessibles selon les normes WCAG 2.2 et RGAA 4.

**Pourquoi se former à l'accessibilité ?**
- Obligation légale pour le secteur public et grandes entreprises
- 15% de la population a un handicap
- Améliore l'UX pour tous les utilisateurs
- Bénéfice SEO (structure sémantique)
- Différenciation professionnelle`,

    objectives: [
      'Comprendre les enjeux de l\'accessibilité numérique',
      'Connaître les différents types de handicaps et technologies d\'assistance',
      'Maîtriser les critères WCAG 2.2 (niveaux A, AA)',
      'Appliquer le référentiel RGAA 4',
      'Auditer un site existant',
      'Corriger les problèmes d\'accessibilité courants',
      'Intégrer l\'accessibilité dans son workflow de développement',
      'Utiliser les outils d\'audit (axe, WAVE, Lighthouse)'
    ],
    
    prerequisites: [
      'HTML et CSS maîtrisés',
      'Notions de JavaScript',
      'Expérience en développement web',
      'Sensibilité aux questions d\'inclusion (un plus)'
    ],
    
    program: [
      {
        title: 'Module 1 - Introduction à l\'accessibilité',
        duration: '2h',
        description: 'Comprendre pourquoi et pour qui',
        topics: [
          'Qu\'est-ce que l\'accessibilité numérique ?',
          'Types de handicaps : visuel, auditif, moteur, cognitif',
          'Technologies d\'assistance : lecteurs d\'écran, plages braille, commutateurs',
          'Démonstration : naviguer sans souris, avec un lecteur d\'écran',
          'Cadre légal : loi française, directive européenne',
          'Qui est concerné ? Obligations par secteur',
          'ROI de l\'accessibilité'
        ]
      },
      {
        title: 'Module 2 - WCAG 2.2 & RGAA 4',
        duration: '4h',
        description: 'Maîtriser les référentiels',
        topics: [
          'Les 4 principes POUR : Perceptible, Utilisable, Compréhensible, Robuste',
          'Les 3 niveaux de conformité : A, AA, AAA',
          'Critères prioritaires pour le niveau AA',
          'RGAA 4 : le référentiel français',
          'Correspondance WCAG / RGAA',
          'Déclaration d\'accessibilité',
          'Schéma pluriannuel',
          'TP : Analyse d\'un critère en détail'
        ]
      },
      {
        title: 'Module 3 - HTML Accessible',
        duration: '3h',
        description: 'Coder accessible au quotidien',
        topics: [
          'Structure sémantique : header, nav, main, article, aside, footer',
          'Titres et hiérarchie (h1-h6)',
          'Liens et boutons : quand utiliser quoi',
          'Images et alternatives textuelles',
          'Formulaires accessibles : labels, fieldset, erreurs',
          'Tableaux de données',
          'ARIA : roles, states, properties',
          'Quand utiliser ARIA (spoiler: le moins possible)',
          'TP : Rendre un formulaire accessible'
        ]
      },
      {
        title: 'Module 4 - Navigation et Interactions',
        duration: '2h',
        description: 'Au-delà du HTML statique',
        topics: [
          'Navigation clavier : tabindex, focus visible',
          'Ordre de focus logique',
          'Skip links',
          'Gestion du focus dans les modales',
          'Live regions : aria-live, aria-atomic',
          'Animations et mouvement : prefers-reduced-motion',
          'Contraste et couleurs : outils et ratios',
          'TP : Modal accessible'
        ]
      },
      {
        title: 'Module 5 - Audit et Outils',
        duration: '3h',
        description: 'Évaluer et corriger',
        topics: [
          'Méthodologie d\'audit RGAA',
          'Outils automatiques : axe DevTools, WAVE, Lighthouse',
          'Limites des tests automatiques',
          'Tests manuels indispensables',
          'Utiliser un lecteur d\'écran (NVDA, VoiceOver)',
          'Checklist d\'audit rapide',
          'Prioriser les corrections',
          'Documenter les résultats',
          'TP : Audit d\'un site réel'
        ]
      }
    ],
    
    tools: ['axe DevTools', 'WAVE', 'Lighthouse', 'NVDA', 'VoiceOver', 'Color Contrast Analyzer'],
    
    certification: true,
    certificationName: 'GL Digital Lab - Web Accessibility Specialist',
    certificationDescription: 'Certification validant la maîtrise des normes WCAG 2.2 / RGAA 4 et la capacité à auditer et corriger l\'accessibilité d\'un site web.',
    
    instructor: {
      name: 'Gaëtan Langlet',
      title: 'Expert Accessibilité & Qualité Web',
      bio: 'L\'accessibilité fait partie de mes critères de qualité au même titre que les performances. Mon portfolio vise la conformité WCAG AA avec une attention particulière à la navigation clavier et aux contrastes.',
      avatar: '/images/neo-avatar.jpg'
    },
    
    nextSessions: [
      { date: '2026-02-10', location: 'En ligne (visio)', spots: 12 },
      { date: '2026-04-07', location: 'En ligne (visio)', spots: 12 }
    ]
  }
];

// ============================================================================
// LEARNING PATHS - PARCOURS DE FORMATION
// ============================================================================

export const learningPaths = [
  {
    id: 'fullstack-symfony-vue',
    slug: 'parcours-fullstack-symfony-vue',
    title: 'Parcours Développeur Full-Stack',
    subtitle: 'Symfony + Vue.js : de zéro à l\'emploi en 3 mois',
    description: `Le parcours le plus complet pour devenir développeur full-stack avec les technologies les plus demandées en France.

En combinant la puissance de Symfony côté backend et la réactivité de Vue.js côté frontend, vous serez capable de construire des applications web complètes et professionnelles.

**Ce parcours vous prépare à :**
- Postuler comme développeur full-stack junior
- Vous lancer en freelance
- Rejoindre une équipe technique sur des projets Symfony/Vue`,
    duration: '77h',
    totalPrice: 3490,
    savings: 780,
    level: 'beginner',
    color: '#3B82F6',
    icon: '🚀',
    formations: ['symfony-fundamentals', 'vue3-complete', 'api-rest-design'],
    outcomes: [
      'Développeur Full-Stack junior',
      'Freelance web',
      'Intégration équipe technique'
    ],
    skills: ['Symfony 7', 'Vue.js 3', 'API REST', 'PostgreSQL', 'Docker', 'Git'],
    timeline: '12-16 semaines à raison de 5-7h/semaine'
  },
  {
    id: 'ia-developer',
    slug: 'parcours-developpeur-ia',
    title: 'Parcours Développeur IA',
    subtitle: 'Intégrez l\'intelligence artificielle dans vos projets',
    description: `L'IA est partout et les développeurs qui savent l'intégrer sont très recherchés. Ce parcours vous emmène du prompt engineering jusqu'à la création de systèmes RAG complets.

**Ce que vous saurez faire :**
- Rédiger des prompts efficaces pour n'importe quel cas d'usage
- Intégrer les APIs OpenAI et Anthropic dans vos applications
- Déployer une IA locale avec Ollama
- Construire un chatbot contextuel avec base de connaissances`,
    duration: '28h',
    totalPrice: 2180,
    savings: 0,
    level: 'intermediate',
    color: '#8B5CF6',
    icon: '🤖',
    formations: ['prompt-engineering', 'ia-integration-web'],
    outcomes: [
      'Développeur IA',
      'Consultant IA',
      'Lead technique IA'
    ],
    skills: ['Prompt Engineering', 'OpenAI API', 'Claude API', 'Ollama', 'RAG', 'LangChain', 'ChromaDB'],
    timeline: '4-6 semaines à raison de 5-7h/semaine'
  },
  {
    id: 'devops-modern',
    slug: 'parcours-devops-moderne',
    title: 'Parcours DevOps Moderne',
    subtitle: 'CI/CD, Docker et automatisation pour développeurs',
    description: `Les compétences DevOps sont devenues indispensables pour tout développeur moderne. Ce parcours vous donne les outils pour containeriser, automatiser et déployer vos applications comme un pro.

**Ce que vous saurez faire :**
- Containeriser n'importe quelle application
- Créer des pipelines CI/CD complets
- Déployer sur des serveurs de production
- Concevoir des APIs prêtes pour le déploiement automatisé`,
    duration: '35h',
    totalPrice: 2080,
    savings: 290,
    level: 'intermediate',
    color: '#F59E0B',
    icon: '⚙️',
    formations: ['docker-devops-essentials', 'api-rest-design'],
    outcomes: [
      'DevOps Engineer',
      'SRE',
      'Platform Engineer'
    ],
    skills: ['Docker', 'Docker Compose', 'GitHub Actions', 'CI/CD', 'Linux', 'Monitoring', 'API Design'],
    timeline: '6-8 semaines à raison de 5-7h/semaine'
  }
];

// ============================================================================
// WORKSHOPS & ÉVÉNEMENTS
// ============================================================================

export const workshops = [
  {
    id: 'workshop-ia-local',
    title: 'Workshop : Déployer une IA locale avec Ollama',
    description: 'Atelier pratique de 3h pour installer Ollama, tester différents modèles (Llama, Mistral, Phi), et intégrer l\'IA locale dans un projet web. Repartez avec une stack fonctionnelle !',
    duration: '3h',
    price: 149,
    date: '2026-01-30',
    time: '14:00',
    location: 'En ligne (visio)',
    spots: 15,
    spotsLeft: 8,
    topics: ['Installation Ollama', 'Comparaison modèles', 'API REST', 'Intégration PHP/JS']
  },
  {
    id: 'workshop-portfolio',
    title: 'Workshop : Créer un portfolio développeur qui décroche des missions',
    description: 'Analysons ensemble les portfolios qui convertissent. Structure, contenu, design, SEO : tous les ingrédients pour vous démarquer et attirer les recruteurs ou clients.',
    duration: '3h',
    price: 99,
    date: '2026-02-06',
    time: '18:00',
    location: 'En ligne (visio)',
    spots: 20,
    spotsLeft: 12,
    topics: ['Structure gagnante', 'Projets à mettre en avant', 'SEO pour développeur', 'Call-to-action']
  },
  {
    id: 'workshop-docker-symfony',
    title: 'Workshop : Environnement Symfony avec Docker',
    description: 'Créez un environnement de développement Symfony complet avec Docker : PHP, MySQL, Redis, Mailhog. Plus jamais de "ça marche sur ma machine" !',
    duration: '3h',
    price: 129,
    date: '2026-02-20',
    time: '14:00',
    location: 'En ligne (visio)',
    spots: 12,
    spotsLeft: 7,
    topics: ['Docker Compose', 'PHP-FPM', 'MySQL/PostgreSQL', 'Xdebug', 'Mailhog']
  }
];

export default {
  formations,
  formationCategories,
  formationLevels,
  learningPaths,
  workshops
};
