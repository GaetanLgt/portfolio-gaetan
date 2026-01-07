import { createRouter, createWebHistory } from 'vue-router';

// ============================================================================
// IMPORTS - Organisation par catégorie
// ============================================================================

// CORE - Pages principales (HomePage chargée immédiatement)
import HomePage from '@/views/core/HomePage.vue';
const HubPage = () => import('@/views/core/HubPage.vue');
const ContactPage = () => import('@/views/core/ContactPage.vue');
const CvPage = () => import('@/views/core/CvPage.vue');
const SitemapPage = () => import('@/views/core/SitemapPage.vue');
const NotFound = () => import('@/views/core/NotFound.vue');

// SERVICES - Offres et solutions
const ServicesPage = () => import('@/views/services/ServicesPage.vue');
const ProjectsPage = () => import('@/views/services/ProjectsPage.vue');

// PARCOURS - Histoire et parcours
const GamingToDev = () => import('@/views/parcours/GamingToDev.vue');
const ConseilAgents = () => import('@/views/parcours/ConseilAgents.vue');
const StackIA = () => import('@/views/parcours/StackIA.vue');
const HolisticMapPage = () => import('@/views/parcours/HolisticMapPage.vue');

// PROJECTS - Case studies
const ArkadiaCase = () => import('@/views/projects/ArkadiaCase.vue');
const VoyageoProCase = () => import('@/views/projects/VoyageoProCase.vue');
const TvPage = () => import('@/views/projects/TvPage.vue');
const ZombunnyPage = () => import('@/views/projects/ZombunnyPage.vue');
const AgentsPage = () => import('@/views/projects/AgentsPage.vue');
const SimulationPage = () => import('@/views/projects/SimulationPage.vue');

// MULTIVERS - Univers thématiques (20 pages)
const MultiversHub = () => import(/* webpackChunkName: "multivers" */ '@/views/multivers/MultiversHub.vue');
const InceptionPage = () => import(/* webpackChunkName: "multivers" */ '@/views/multivers/InceptionPage.vue');
const TronPage = () => import(/* webpackChunkName: "multivers" */ '@/views/multivers/TronPage.vue');
const GhostShellPage = () => import(/* webpackChunkName: "multivers" */ '@/views/multivers/GhostShellPage.vue');
const MinorityReportPage = () => import(/* webpackChunkName: "multivers" */ '@/views/multivers/MinorityReportPage.vue');
const BladeRunnerPage = () => import(/* webpackChunkName: "multivers" */ '@/views/multivers/BladeRunnerPage.vue');
const VendettaPage = () => import(/* webpackChunkName: "multivers" */ '@/views/multivers/VendettaPage.vue');
const JupiterAscendingPage = () => import(/* webpackChunkName: "multivers" */ '@/views/multivers/JupiterAscendingPage.vue');
const HowardDuckPage = () => import(/* webpackChunkName: "multivers" */ '@/views/multivers/HowardDuckPage.vue');
const TheMaskPage = () => import(/* webpackChunkName: "multivers" */ '@/views/multivers/TheMaskPage.vue');
const DeadpoolPage = () => import(/* webpackChunkName: "multivers" */ '@/views/multivers/DeadpoolPage.vue');
const AliceTuringPage = () => import(/* webpackChunkName: "multivers" */ '@/views/multivers/AliceTuringPage.vue');
const AsimovPage = () => import(/* webpackChunkName: "multivers" */ '@/views/multivers/AsimovPage.vue');
const CloudAtlasPage = () => import(/* webpackChunkName: "multivers" */ '@/views/multivers/CloudAtlasPage.vue');
const MechaMascotPage = () => import(/* webpackChunkName: "multivers" */ '@/views/multivers/MechaMascotPage.vue');
const GardenMamPage = () => import(/* webpackChunkName: "multivers" */ '@/views/multivers/GardenMamPage.vue');
const IronManPage = () => import(/* webpackChunkName: "multivers" */ '@/views/multivers/IronManPage.vue');
const DragonBallPage = () => import(/* webpackChunkName: "multivers" */ '@/views/multivers/DragonBallPage.vue');
const ReadyPlayerOnePage = () => import(/* webpackChunkName: "multivers" */ '@/views/multivers/ReadyPlayerOnePage.vue');
const MatrixPage = () => import(/* webpackChunkName: "multivers" */ '@/views/multivers/MatrixPage.vue');
const MatrixResurrectionsPage = () => import(/* webpackChunkName: "multivers" */ '@/views/multivers/MatrixResurrectionsPage.vue');
const SamusElementsPage = () => import(/* webpackChunkName: "multivers" */ '@/views/multivers/SamusElementsPage.vue');
const GalleryPage = () => import(/* webpackChunkName: "multivers" */ '@/views/multivers/GalleryPage.vue');
const LeekWarsPage = () => import(/* webpackChunkName: "multivers" */ '@/views/multivers/LeekWarsPage.vue');
const TerrariaPage = () => import(/* webpackChunkName: "multivers" */ '@/views/multivers/TerrariaPage.vue');
const ArchitectPage = () => import(/* webpackChunkName: "multivers" */ '@/views/multivers/ArchitectPage.vue');

// GALLERY - Galerie créations Matrix style
const GalleryMatrixPage = () => import('@/views/GalleryMatrixPage.vue');

// LEGAL - Pages légales
const MentionsLegales = () => import('@/views/legal/MentionsLegales.vue');
const Confidentialite = () => import('@/views/legal/Confidentialite.vue');
const CGV = () => import('@/views/legal/CGV.vue');

// RESOURCES - Ressources et tutoriels
const TutorielsPage = () => import('@/views/resources/TutorielsPage.vue');
const ComponentsLibrary = () => import('@/views/resources/components-library/ComponentsLibrary.vue');

// TOOLS - Outils admin
const ArkAdminPortal = () => import('@/views/tools/ArkAdminPortal.vue');

// APPS - Applications utilitaires (chunk séparé)
const AppsHub = () => import(/* webpackChunkName: "apps" */ '@/views/apps/AppsHub.vue');
const ColorConverter = () => import(/* webpackChunkName: "apps" */ '@/views/apps/ColorConverter.vue');
const JsonFormatter = () => import(/* webpackChunkName: "apps" */ '@/views/apps/JsonFormatter.vue');
const Base64Tool = () => import(/* webpackChunkName: "apps" */ '@/views/apps/Base64Tool.vue');
const LoremGenerator = () => import(/* webpackChunkName: "apps" */ '@/views/apps/LoremGenerator.vue');
const PasswordGenerator = () => import(/* webpackChunkName: "apps" */ '@/views/apps/PasswordGenerator.vue');
const UuidGenerator = () => import(/* webpackChunkName: "apps" */ '@/views/apps/UuidGenerator.vue');
const RegexTester = () => import(/* webpackChunkName: "apps" */ '@/views/apps/RegexTester.vue');
const HashGenerator = () => import(/* webpackChunkName: "apps" */ '@/views/apps/HashGenerator.vue');
const DiffChecker = () => import(/* webpackChunkName: "apps" */ '@/views/apps/DiffChecker.vue');
const TimestampConverter = () => import(/* webpackChunkName: "apps" */ '@/views/apps/TimestampConverter.vue');
const MarkdownPreview = () => import(/* webpackChunkName: "apps" */ '@/views/apps/MarkdownPreview.vue');
const TextAnimator = () => import(/* webpackChunkName: "apps" */ '@/views/apps/TextAnimator.vue');
const FaqGenerator = () => import(/* webpackChunkName: "apps" */ '@/views/apps/FaqGenerator.vue');
const ChatbotBuilder = () => import(/* webpackChunkName: "apps" */ '@/views/apps/ChatbotBuilder.vue');

// AI TOOLS
const PromptBuilder = () => import(/* webpackChunkName: "apps-ai" */ '@/views/apps/PromptBuilder.vue');
const TokenCounter = () => import(/* webpackChunkName: "apps-ai" */ '@/views/apps/TokenCounter.vue');
const JsonSchemaGenerator = () => import(/* webpackChunkName: "apps-ai" */ '@/views/apps/JsonSchemaGenerator.vue');
const ApiTester = () => import(/* webpackChunkName: "apps-ai" */ '@/views/apps/ApiTester.vue');
const CronBuilder = () => import(/* webpackChunkName: "apps-ai" */ '@/views/apps/CronBuilder.vue');
const QrCodeGenerator = () => import(/* webpackChunkName: "apps" */ '@/views/apps/QrCodeGenerator.vue');
const JwtDecoder = () => import(/* webpackChunkName: "apps-ai" */ '@/views/apps/JwtDecoder.vue');
const CsvJsonConverter = () => import(/* webpackChunkName: "apps" */ '@/views/apps/CsvJsonConverter.vue');
const MarkdownTableGenerator = () => import(/* webpackChunkName: "apps" */ '@/views/apps/MarkdownTableGenerator.vue');
const WebhookTester = () => import(/* webpackChunkName: "apps-ai" */ '@/views/apps/WebhookTester.vue');
const OpenApiViewer = () => import(/* webpackChunkName: "apps-ai" */ '@/views/apps/OpenApiViewer.vue');

// BLUEPRINTS
const FlowchartBuilder = () => import(/* webpackChunkName: "apps-blueprint" */ '@/views/apps/FlowchartBuilder.vue');
const ErdDesigner = () => import(/* webpackChunkName: "apps-blueprint" */ '@/views/apps/ErdDesigner.vue');
const WireframeBuilder = () => import(/* webpackChunkName: "apps-blueprint" */ '@/views/apps/WireframeBuilder.vue');
const SitemapGenerator = () => import(/* webpackChunkName: "apps-blueprint" */ '@/views/apps/SitemapGenerator.vue');

// AGENTS IA APPS
const AgentJarvisRouter = () => import(/* webpackChunkName: "apps-agents" */ '@/views/apps/AgentJarvisRouter.vue');
const AgentEdithScanner = () => import(/* webpackChunkName: "apps-agents" */ '@/views/apps/AgentEdithScanner.vue');
const AgentUltronMonitor = () => import(/* webpackChunkName: "apps-agents" */ '@/views/apps/AgentUltronMonitor.vue');
const AgentFridayKnowledgeBase = () => import(/* webpackChunkName: "apps-agents" */ '@/views/apps/AgentFridayKnowledgeBase.vue');
const AgentVisionContentGen = () => import(/* webpackChunkName: "apps-agents" */ '@/views/apps/AgentVisionContentGen.vue');
const AgentVeronicaPipeline = () => import(/* webpackChunkName: "apps-agents" */ '@/views/apps/AgentVeronicaPipeline.vue');
const AgentPepperInvoice = () => import(/* webpackChunkName: "apps-agents" */ '@/views/apps/AgentPepperInvoice.vue');

// AGENTS - Bureau des Agents IA
const AgentsHub = () => import('@/views/agents/AgentsHub.vue');
const AgentProfile = () => import('@/views/agents/AgentProfile.vue');

// GL TOWER - Visite interactive
const GLTowerInteractive = () => import(/* webpackChunkName: "tower" */ '@/views/tower/GLTowerInteractive.vue');

// FORMATION - Pôle éducation
const FormationHub = () => import(/* webpackChunkName: "formation" */ '@/views/formation/FormationHub.vue');
const FormationDetail = () => import(/* webpackChunkName: "formation" */ '@/views/formation/FormationDetail.vue');
const FormationPath = () => import(/* webpackChunkName: "formation" */ '@/views/formation/FormationPath.vue');
const ChallengesHub = () => import(/* webpackChunkName: "formation" */ '@/views/formation/ChallengesHub.vue');

// APPS - Métier spécialisées
const Print3DManager = () => import(/* webpackChunkName: "apps-business" */ '@/views/apps/Print3DManager.vue');
const TeacherAssistant = () => import(/* webpackChunkName: "apps-business" */ '@/views/apps/TeacherAssistant.vue');
const ArkConfigManager = () => import(/* webpackChunkName: "apps-business" */ '@/views/apps/ArkConfigManager.vue');
const PrivacyShield = () => import(/* webpackChunkName: "apps-business" */ '@/views/apps/PrivacyShield.vue');
const HexWorld = () => import(/* webpackChunkName: "apps-business" */ '@/views/apps/HexWorld.vue');

// ARCADE - Mini-jeux (chunk séparé)
const ArcadeHub = () => import(/* webpackChunkName: "arcade" */ '@/views/arcade/ArcadeHub.vue');
const CardsGame = () => import(/* webpackChunkName: "arcade" */ '@/views/arcade/CardsGame.vue');
const MemoryGame = () => import(/* webpackChunkName: "arcade" */ '@/views/arcade/MemoryGame.vue');
const TerminalGame = () => import(/* webpackChunkName: "arcade" */ '@/views/arcade/TerminalGame.vue');
const SlotsGame = () => import(/* webpackChunkName: "arcade" */ '@/views/arcade/SlotsGame.vue');

// MATRIX - Admin Hub
const MatrixAdminHub = () => import(/* webpackChunkName: "matrix" */ '@/games/arkadia-infinitum/MatrixAdminHub.vue');


// ============================================================================
// ROUTES
// ============================================================================

const routes = [
  // -------------------------------------------------------------------------
  // CORE
  // -------------------------------------------------------------------------
  {
    path: '/',
    name: 'Home',
    component: HomePage,
    meta: { 
      title: 'Architecte de vos Systèmes Critiques',
      description: 'Architecture numérique souveraine pour PME : Symfony 8, Vue 3, IA locale. Développement sur-mesure, observabilité et automatisation. Basé à Limoges.'
    }
  },
  {
    path: '/hub',
    name: 'Hub',
    component: HubPage,
    meta: { 
      title: 'GL TOWER | QG des Agents IA',
      description: 'Centre de commandement GL Digital Lab. 7 agents IA couvrent tous les niveaux de votre infrastructure : support, community, content, monitoring, DevOps, sécurité.'
    }
  },
  {
    path: '/contact',
    name: 'Contact',
    component: ContactPage,
    meta: { 
      title: 'Ouvrir un Canal Sécurisé',
      description: 'Planifiez un audit gratuit de 30 minutes. On définit ensemble l\'architecture, les risques à éviter et les garde-fous.'
    }
  },
  {
    path: '/cv',
    name: 'CvPage',
    component: CvPage,
    meta: { 
      title: 'CV Gaëtan LANGLET | Développeur Full-Stack',
      description: 'CV de Gaëtan LANGLET, développeur full-stack spécialisé Symfony, Vue.js et intégration IA. Limoges, France.'
    }
  },
  {
    path: '/sitemap',
    name: 'SitemapPage',
    component: SitemapPage,
    meta: { 
      title: 'Plan du Site | Carte Applicative',
      description: 'Explorez l\'ensemble des pages et applications du portfolio GL Digital Lab. Arborescence complète du site.'
    }
  },

  // -------------------------------------------------------------------------
  // SERVICES
  // -------------------------------------------------------------------------
  {
    path: '/services',
    name: 'Services',
    component: ServicesPage,
    meta: { 
      title: 'Débranchez-vous de la Matrice Cloud',
      description: 'Performance, Digital Factory, Neural Ops : trois protocoles pour reprendre le contrôle de votre infrastructure. Solutions souveraines pour PME.'
    }
  },
  {
    path: '/projets',
    name: 'ProjectsPage',
    component: ProjectsPage,
    meta: { 
      title: 'Projets & Réalisations | GL Digital Lab',
      description: 'Portfolio de projets Symfony, Vue.js, WordPress et gaming. Découvrez mes réalisations techniques et créatives.'
    }
  },

  // -------------------------------------------------------------------------
  // PARCOURS
  // -------------------------------------------------------------------------
  {
    path: '/parcours',
    name: 'GamingToDev',
    component: GamingToDev,
    meta: { 
      title: 'Du Gaming au Code',
      description: 'Mon parcours atypique : de la gestion de communautés gaming à l\'architecture logicielle. Rigueur acquise sur le terrain.'
    }
  },
  {
    path: '/conseil',
    name: 'ConseilAgents',
    component: ConseilAgents,
    meta: { 
      title: 'Le Conseil des Agents',
      description: 'Ma vision de l\'IA en entreprise : un écosystème d\'agents spécialisés qui travaillent ensemble. 100% souverain, 0% cloud US.'
    }
  },
  {
    path: '/stack-ia',
    name: 'StackIA',
    component: StackIA,
    meta: { 
      title: 'Stack IA Souveraine',
      description: 'Infrastructure IA locale : Nemotron, ChromaDB, n8n, OpenWebUI. Zéro dépendance cloud US, déployable on-premise.'
    }
  },
  {
    path: '/carte-holistique',
    name: 'HolisticMap',
    component: HolisticMapPage,
    meta: { 
      title: 'Carte Holistique | Neo / GL Digital Lab',
      description: 'Visualisation interactive de l\'écosystème GL Digital Lab : rôles, compétences, projets, services et vision. Carte conceptuelle du portfolio.'
    }
  },

  // -------------------------------------------------------------------------
  // PROJECTS (Case Studies)
  // -------------------------------------------------------------------------
  {
    path: '/arkadia',
    name: 'ArkadiaCase',
    component: ArkadiaCase,
    meta: { 
      title: 'Case Study ARKADIA',
      description: 'Administration de cluster ARK: Survival Ascended. 9 serveurs, 150+ utilisateurs, 99.8% uptime. DevOps appliqué au gaming.'
    }
  },
  {
    path: '/voyageo-pro',
    name: 'VoyageoProCase',
    component: VoyageoProCase,
    meta: { 
      title: 'Case Study VoyageoPro | Plateforme B2B Tourisme',
      description: 'Transformation digitale d\'une agence de voyage B2B. De Excel à une plateforme SaaS : -70% temps de traitement, +180% volume de devis.'
    }
  },
  {
    path: '/tv',
    name: 'TvPage',
    component: TvPage,
    meta: { 
      title: 'MyTV Database',
      description: 'Explorez les séries TV avec l\'API TVMaze. Side-project démontrant l\'intégration d\'APIs externes.'
    }
  },
  {
    path: '/zombunny',
    name: 'ZombunnyPage',
    component: ZombunnyPage,
    meta: { 
      title: 'Zombunny - Algorithmes Génétiques',
      description: 'Étude des algorithmes évolutionnaires en C# avec Unity. Sélection naturelle, mutation et croisement génétique.'
    }
  },
  {
    path: '/agents',
    name: 'AgentsHub',
    component: AgentsHub,
    meta: { 
      title: 'Bureau des Agents IA',
      description: 'L\'équipe d\'intelligences artificielles qui pilote GL Digital Lab et ARKADIA. Chaque agent a son rôle, ses outils et ses processus définis.'
    }
  },
  {
    path: '/tower',
    name: 'GLTowerInteractive',
    component: GLTowerInteractive,
    meta: { 
      title: 'GL TOWER | Visite Interactive du QG',
      description: 'Explorez GL Tower de manière interactive : 15 agents IA, 100+ workflows automatisés, et découvrez comment votre site est produit de A à Z.'
    }
  },
  {
    path: '/agents/:id',
    name: 'AgentProfile',
    component: AgentProfile,
    meta: { 
      title: 'Profil Agent IA',
      description: 'Fiche détaillée d\'un agent IA : mission, capacités, outils, processus et métriques de performance.'
    }
  },
  {
    path: '/workflows',
    name: 'AgentsPage',
    component: AgentsPage,
    meta: { 
      title: 'Workflows & Automatisations',
      description: 'Workflows n8n en production : Discord bots, monitoring, RAG, automatisations métier. Stack 100% souveraine, zéro cloud US.'
    }
  },
  {
    path: '/simulation',
    name: 'SimulationPage',
    component: SimulationPage,
    meta: { 
      title: 'Simulacres et Simulation',
      description: 'Le désert du réel : de Baudrillard à la Matrice numérique. Débranchez-vous du simulacre cloud.'
    }
  },

  // -------------------------------------------------------------------------
  // MULTIVERS (20 univers thématiques)
  // -------------------------------------------------------------------------
  {
    path: '/multivers',
    name: 'MultiversHub',
    component: MultiversHub,
    meta: { 
      title: 'Multivers | 20 Dimensions Parallèles',
      description: 'Explorez 20 univers parallèles de ce portfolio : Matrix, Blade Runner, Inception, TRON et plus. Chaque dimension offre une expérience unique.'
    }
  },
  {
    path: '/inception',
    name: 'Inception',
    component: InceptionPage,
    meta: { 
      title: 'Inception | Architecture des Rêves Numériques',
      description: 'Plongez dans les niveaux de rêve du développement. Du code réel aux limbes de la créativité, explorez l\'architecture mentale.'
    }
  },
  {
    path: '/tron',
    name: 'Tron',
    component: TronPage,
    meta: { 
      title: 'TRON | The Grid',
      description: 'Bienvenue sur la Grille. Programmes, arènes de combat, lightcycles. Je me bats pour les utilisateurs.'
    }
  },
  {
    path: '/ghost-in-the-shell',
    name: 'GhostShell',
    component: GhostShellPage,
    meta: { 
      title: 'Ghost in the Shell | Le Réseau est vaste et infini',
      description: 'Plongez dans le cyberespace. Ghost, Shell, Net - explorez l\'identité numérique et les augmentations technologiques.'
    }
  },
  {
    path: '/minority-report',
    name: 'MinorityReport',
    component: MinorityReportPage,
    meta: { 
      title: 'Minority Report | Le Futur peut être vu',
      description: 'Interface gestuelle futuriste. Précogs, prévisions et libre arbitre. Le futur n\'est pas écrit.'
    }
  },
  {
    path: '/blade-runner',
    name: 'BladeRunner',
    component: BladeRunnerPage,
    meta: { 
      title: 'Blade Runner | More Human Than Human',
      description: 'Los Angeles 2049. Réplicants, test Voight-Kampff et mémoires implantées. Tous ces moments seront perdus dans le temps.'
    }
  },
  {
    path: '/v-for-vendetta',
    name: 'Vendetta',
    component: VendettaPage,
    meta: { 
      title: 'V pour Vendetta | Les idées sont à l\'épreuve des balles',
      description: 'Remember, remember the 5th of November. La révolution commence avec une idée. Souveraineté numérique.'
    }
  },
  {
    path: '/jupiter-ascending',
    name: 'JupiterAscending',
    component: JupiterAscendingPage,
    meta: { 
      title: 'Jupiter Ascending | L\'Héritier',
      description: 'Bureaucratie galactique et héritage cosmique. Vous êtes l\'héritier de quelque chose d\'extraordinaire.'
    }
  },
  {
    path: '/howard-the-duck',
    name: 'HowardDuck',
    component: HowardDuckPage,
    meta: { 
      title: 'Howard the Duck | Perle rare héroïque',
      description: 'Un canard d\'un autre monde, coincé sur Terre. Une perle rare du cinéma héroïque des années 80.'
    }
  },
  {
    path: '/the-mask',
    name: 'TheMask',
    component: TheMaskPage,
    meta: { 
      title: 'The Mask | SSSSMOKIN!',
      description: 'Mettez le masque et devenez quelqu\'un d\'autre. Physique cartoon, chaos créatif et Cuban Pete!'
    }
  },
  {
    path: '/deadpool',
    name: 'Deadpool',
    component: DeadpoolPage,
    meta: { 
      title: 'Deadpool | Maximum Effort',
      description: 'Le mercenaire à la grande bouche. 4ème mur brisé, chimichangas et sarcasme inclus.'
    }
  },
  {
    path: '/alice-turing',
    name: 'AliceTuring',
    component: AliceTuringPage,
    meta: { 
      title: 'Alice au Pays de Turing | Logique & Merveilles',
      description: 'Quand Alice rencontre la machine de Turing. Explorez le terrier du lapin logique, le jardin de la Reine et la folle partie de thé computationnelle.'
    }
  },
  {
    path: '/asimov',
    name: 'Asimov',
    component: AsimovPage,
    meta: { 
      title: 'Les Trois Lois de la Robotique | Asimov',
      description: 'Panneau tri-vision interactif présentant les trois lois de la robotique d\'Isaac Asimov. Éthique de l\'IA depuis 1942.'
    }
  },
  {
    path: '/cloud-atlas',
    name: 'CloudAtlas',
    component: CloudAtlasPage,
    meta: { 
      title: 'Cloud Atlas | Six Époques, Une Âme',
      description: 'Exploration visuelle de Cloud Atlas : voyage à travers six époques interconnectées, de 1849 à 2321. Réincarnation et liberté.'
    }
  },
  {
    path: '/mecha-mascot',
    name: 'MechaMascot',
    component: MechaMascotPage,
    meta: { 
      title: 'GL Spirit | Mascotte Style Ghibli',
      description: 'Concept de mascotte inspirée Studio Ghibli. Un esprit gardien du code, doux et bienveillant, dans la tradition de Miyazaki.'
    }
  },
  {
    path: '/jardin-de-mam',
    name: 'GardenMam',
    component: GardenMamPage,
    meta: { 
      title: 'Le Jardin de Mam\' | Pour elle, avec amour',
      description: 'Un jardin pour faire pousser ses conseils, ses fleurs et ses souvenirs. Pour Mam\', passionnée de dahlias et fan de Claude François.'
    }
  },
  {
    path: '/iron-man',
    name: 'IronMan',
    component: IronManPage,
    meta: { 
      title: 'Iron Man | Je suis Iron Man',
      description: 'Je suis Iron Man. Génie. Milliardaire. Développeur. L\'armure Stark Industries pour le code : Réacteur Arc, JARVIS, et technologies de pointe.'
    }
  },
  {
    path: '/dragon-ball-z',
    name: 'DragonBall',
    component: DragonBallPage,
    meta: { 
      title: 'Dragon Ball Z | C\'EST PLUS DE 9000 !!!',
      description: 'Le parcours du développeur Saiyan. Transformations, niveaux de puissance et Dragon Balls. Technique Kaméhaméha et entraînement dans la Salle du Temps.'
    }
  },
  {
    path: '/ready-player-one',
    name: 'ReadyPlayerOne',
    component: ReadyPlayerOnePage,
    meta: { 
      title: 'Ready Player One | Bienvenue dans l\'OASIS',
      description: 'Explorez l\'OASIS comme un Gunter. Chasse à l\'Œuf, inventaire, planètes et tableau des scores. Le portfolio ultime pour les joueurs.'
    }
  },
  {
    path: '/matrix',
    name: 'Matrix',
    component: MatrixPage,
    meta: { 
      title: 'Matrix | Réveille-toi Neo',
      description: 'Pilule rouge ou pilule bleue ? Découvrez la vérité sur le développeur derrière le code. Programmes d\'entraînement et missions dans la Matrice.'
    }
  },
  {
    path: '/matrix-resurrections',
    name: 'MatrixResurrections',
    component: MatrixResurrectionsPage,
    meta: { 
      title: 'Matrix Resurrections | Retour à la Matrice',
      description: 'La Matrice a ressuscité. Brisez la boucle, débloquez les améliorations et rejoignez IO, la nouvelle cité de la résistance.'
    }
  },
  {
    path: '/samus-elements',
    name: 'SamusElements',
    component: SamusElementsPage,
    meta: { 
      title: 'Samus & Les Éléments | Création Originale',
      description: 'Les Quatre Éléments rencontrent Metroid : une composition artistique du collège qui fusionne mythologie, sci-fi et Samus Aran sur Mars. 19/20.'
    }
  },
  {
    path: '/galerie',
    name: 'GalleryPage',
    component: GalleryPage,
    meta: { 
      title: 'Générateur de Galeries | Multivers',
      description: 'Générez des galeries d\'art thématiques pour chaque univers du Multivers. Matrix, TRON, Blade Runner, Inception et plus.'
    }
  },
  {
    path: '/leek-wars',
    name: 'LeekWars',
    component: LeekWarsPage,
    meta: { 
      title: 'Leek Wars | Code ton poireau, combats pour la gloire',
      description: 'Univers Leek Wars : jeu de programmation où tu codes l\'IA de ton poireau en LeekScript. Tournois, classements, 300 trophées.'
    }
  },
  {
    path: '/terraria',
    name: 'Terraria',
    component: TerrariaPage,
    meta: { 
      title: 'Terraria | Dig. Fight. Explore. Build.',
      description: 'Univers Terraria : exploration 2D sandbox, 17 boss épiques, crafting, biomes uniques. Plus de 500 heures de contenu.'
    }
  },
  {
    path: '/architect',
    name: 'Architect',
    component: ArchitectPage,
    meta: { 
      title: 'Architect | Du Croquis au Code',
      description: 'Univers Architecte : style croquis et blueprints. Construire des systèmes numériques comme on conçoit des bâtiments.'
    }
  },

  // -------------------------------------------------------------------------
  // LEGAL
  // -------------------------------------------------------------------------
  {
    path: '/mentions-legales',
    name: 'MentionsLegales',
    component: MentionsLegales,
    meta: { 
      title: 'Mentions Légales',
      description: 'Mentions légales de GL Digital Lab : éditeur, hébergement, propriété intellectuelle.'
    }
  },
  {
    path: '/confidentialite',
    name: 'Confidentialite',
    component: Confidentialite,
    meta: { 
      title: 'Politique de Confidentialité',
      description: 'Politique de confidentialité de GL Digital Lab : traitement des données personnelles, droits RGPD, cookies.'
    }
  },
  {
    path: '/cgv',
    name: 'CGV',
    component: CGV,
    meta: { 
      title: 'Conditions Générales de Vente',
      description: 'CGV de GL Digital Lab : tarifs, modalités de paiement, garanties, propriété intellectuelle.'
    }
  },

  // -------------------------------------------------------------------------
  // RESOURCES
  // -------------------------------------------------------------------------
  {
    path: '/ressources/tutoriels',
    name: 'TutorielsPage',
    component: TutorielsPage,
    meta: { 
      title: 'Tutoriels & Guides Techniques',
      description: 'Guides pas à pas pour Symfony 7, Vue 3, Vite, Docker et IA locale. Documentation technique par GL Digital Lab.'
    }
  },

  // -------------------------------------------------------------------------
  // TOOLS
  // -------------------------------------------------------------------------
  {
    path: '/ark-admin',
    name: 'ArkAdminPortal',
    component: ArkAdminPortal,
    meta: { 
      title: 'ARK Admin Portal | Snippets INI',
      description: 'Collection de configurations INI optimisées pour serveurs ARK: Survival Ascended. Taux, breeding, dinos, cluster.'
    }
  },

  // -------------------------------------------------------------------------
  // APPS - Applications utilitaires
  // -------------------------------------------------------------------------
  {
    path: '/apps',
    name: 'AppsHub',
    component: AppsHub,
    meta: { 
      title: 'Applications | Boîte à Outils Dev',
      description: 'Outils gratuits pour développeurs : convertisseur de couleurs, formateur JSON, générateur de mots de passe, Base64, UUID et plus.'
    }
  },
  {
    path: '/apps/colors',
    name: 'ColorConverter',
    component: ColorConverter,
    meta: { 
      title: 'Color Converter | HEX RGB HSL',
      description: 'Convertissez instantanément les couleurs entre HEX, RGB, HSL et HSV. Visualisez et copiez en un clic.'
    }
  },
  {
    path: '/apps/json',
    name: 'JsonFormatter',
    component: JsonFormatter,
    meta: { 
      title: 'JSON Formatter | Validateur & Pretty Print',
      description: 'Formatez, validez et minifiez votre JSON. Détection des erreurs de syntaxe et vue arborescente.'
    }
  },
  {
    path: '/apps/base64',
    name: 'Base64Tool',
    component: Base64Tool,
    meta: { 
      title: 'Base64 Encoder/Decoder',
      description: 'Encodez et décodez du texte ou des fichiers en Base64. Support des images et documents.'
    }
  },
  {
    path: '/apps/lorem',
    name: 'LoremGenerator',
    component: LoremGenerator,
    meta: { 
      title: 'Lorem Ipsum Generator',
      description: 'Générez du texte placeholder Lorem Ipsum pour vos maquettes. Paragraphes, phrases ou mots.'
    }
  },
  {
    path: '/apps/password',
    name: 'PasswordGenerator',
    component: PasswordGenerator,
    meta: { 
      title: 'Password Generator | Mots de Passe Sécurisés',
      description: 'Créez des mots de passe forts et sécurisés. Options personnalisables et indicateur de force.'
    }
  },
  {
    path: '/apps/uuid',
    name: 'UuidGenerator',
    component: UuidGenerator,
    meta: { 
      title: 'UUID Generator | Identifiants Uniques',
      description: 'Générez des UUID v4 uniques. Génération en masse, différents formats disponibles.'
    }
  },
  {
    path: '/apps/regex',
    name: 'RegexTester',
    component: RegexTester,
    meta: { 
      title: 'Regex Tester | Testeur d\'Expressions Régulières',
      description: 'Testez et validez vos regex en temps réel. Highlighting des correspondances, aide-mémoire et patterns courants.'
    }
  },
  {
    path: '/apps/hash',
    name: 'HashGenerator',
    component: HashGenerator,
    meta: { 
      title: 'Hash Generator | MD5 SHA-256 SHA-512',
      description: 'Générez des empreintes cryptographiques MD5, SHA-1, SHA-256 et SHA-512 instantanément.'
    }
  },
  {
    path: '/apps/diff',
    name: 'DiffChecker',
    component: DiffChecker,
    meta: { 
      title: 'Diff Checker | Comparaison de Textes',
      description: 'Comparez deux textes et visualisez les différences ligne par ligne.'
    }
  },
  {
    path: '/apps/timestamp',
    name: 'TimestampConverter',
    component: TimestampConverter,
    meta: { 
      title: 'Timestamp Converter | Unix Epoch',
      description: 'Convertissez entre timestamps Unix et dates lisibles. Support multi-fuseaux horaires.'
    }
  },
  {
    path: '/apps/markdown',
    name: 'MarkdownPreview',
    component: MarkdownPreview,
    meta: { 
      title: 'Markdown Preview | Éditeur MD',
      description: 'Éditeur Markdown avec prévisualisation temps réel et export HTML.'
    }
  },
  {
    path: '/apps/text-animator',
    name: 'TextAnimator',
    component: TextAnimator,
    meta: { 
      title: 'Text Animator | Texte Animé',
      description: 'Créez du texte animé pour forums, Discord et réseaux sociaux.'
    }
  },
  {
    path: '/apps/faq',
    name: 'FaqGenerator',
    component: FaqGenerator,
    meta: { 
      title: 'FAQ Generator | Générateur FAQ',
      description: 'Créez des FAQ élégantes avec export HTML, Markdown et JSON.'
    }
  },
  {
    path: '/apps/chatbot',
    name: 'ChatbotBuilder',
    component: ChatbotBuilder,
    meta: { 
      title: 'Chatbot Builder | Créateur Chatbot',
      description: 'Créez des arbres de dialogue pour chatbots avec prévisualisation et export JSON.'
    }
  },
  // AI TOOLS
  {
    path: '/apps/prompt-builder',
    name: 'PromptBuilder',
    component: PromptBuilder,
    meta: { 
      title: 'Prompt Builder | Créateur de Prompts IA',
      description: 'Construisez des prompts structurés et optimisés pour les LLMs.'
    }
  },
  {
    path: '/apps/token-counter',
    name: 'TokenCounter',
    component: TokenCounter,
    meta: { 
      title: 'Token Counter | Compteur de Tokens LLM',
      description: 'Estimez le nombre de tokens pour GPT-4, Claude, Llama et calculez les coûts.'
    }
  },
  {
    path: '/apps/json-schema',
    name: 'JsonSchemaGenerator',
    component: JsonSchemaGenerator,
    meta: { 
      title: 'JSON Schema Generator | Schémas JSON',
      description: 'Générez des schémas JSON pour valider vos données et APIs.'
    }
  },
  {
    path: '/apps/api-tester',
    name: 'ApiTester',
    component: ApiTester,
    meta: { 
      title: 'API Tester | Client REST',
      description: 'Testez vos endpoints REST avec un client HTTP simple et intuitif.'
    }
  },
  {
    path: '/apps/cron-builder',
    name: 'CronBuilder',
    component: CronBuilder,
    meta: { 
      title: 'Cron Builder | Expressions Cron',
      description: 'Créez et validez vos expressions cron pour automatiser vos tâches.'
    }
  },
  {
    path: '/apps/qr-code',
    name: 'QrCodeGenerator',
    component: QrCodeGenerator,
    meta: { 
      title: 'QR Code Generator | Générateur QR',
      description: 'Générez des QR codes personnalisés pour URL, WiFi, vCard et plus.'
    }
  },
  {
    path: '/apps/jwt-decoder',
    name: 'JwtDecoder',
    component: JwtDecoder,
    meta: { 
      title: 'JWT Decoder | Décodeur JWT',
      description: 'Décodez et analysez vos tokens JWT.'
    }
  },
  {
    path: '/apps/csv-json',
    name: 'CsvJsonConverter',
    component: CsvJsonConverter,
    meta: { 
      title: 'CSV ↔ JSON Converter',
      description: 'Convertissez vos données entre CSV et JSON.'
    }
  },
  {
    path: '/apps/markdown-table',
    name: 'MarkdownTableGenerator',
    component: MarkdownTableGenerator,
    meta: { 
      title: 'Markdown Table Generator',
      description: 'Créez des tableaux Markdown visuellement.'
    }
  },
  {
    path: '/apps/webhook-tester',
    name: 'WebhookTester',
    component: WebhookTester,
    meta: { 
      title: 'Webhook Tester',
      description: 'Générez des URLs de test et inspectez les requêtes webhook.'
    }
  },
  {
    path: '/apps/openapi',
    name: 'OpenApiViewer',
    component: OpenApiViewer,
    meta: { 
      title: 'OpenAPI Viewer | Swagger',
      description: 'Visualisez et explorez vos spécifications OpenAPI/Swagger.'
    }
  },
  // BLUEPRINTS
  {
    path: '/apps/flowchart',
    name: 'FlowchartBuilder',
    component: FlowchartBuilder,
    meta: { 
      title: 'Flowchart Builder | Diagrammes de flux',
      description: 'Créez des diagrammes de flux et d\'algorithmes interactifs.'
    }
  },
  {
    path: '/apps/erd',
    name: 'ErdDesigner',
    component: ErdDesigner,
    meta: { 
      title: 'ERD Designer | Diagrammes Base de Données',
      description: 'Concevez vos diagrammes entité-relation et générez le SQL.'
    }
  },
  {
    path: '/apps/wireframe',
    name: 'WireframeBuilder',
    component: WireframeBuilder,
    meta: { 
      title: 'Wireframe Builder | Maquettes UI',
      description: 'Créez des maquettes UI low-fidelity rapidement.'
    }
  },
  {
    path: '/apps/sitemap',
    name: 'SitemapGenerator',
    component: SitemapGenerator,
    meta: { 
      title: 'Sitemap Generator | SEO',
      description: 'Créez des sitemaps visuels et exportez en XML.'
    }
  },
  // AGENTS IA APPS
  {
    path: '/apps/agent/jarvis',
    name: 'AgentJarvisRouter',
    component: AgentJarvisRouter,
    meta: { 
      title: 'JARVIS Router | Multi-Agent Orchestrator',
      description: 'Orchestrez des requêtes complexes vers plusieurs agents IA.'
    }
  },
  {
    path: '/apps/agent/edith',
    name: 'AgentEdithScanner',
    component: AgentEdithScanner,
    meta: { 
      title: 'EDITH Scanner | Security Audit',
      description: 'Analysez la sécurité de vos projets et dépendances.'
    }
  },
  {
    path: '/apps/agent/ultron',
    name: 'AgentUltronMonitor',
    component: AgentUltronMonitor,
    meta: { 
      title: 'ULTRON Monitor | System Monitoring',
      description: 'Surveillez vos services et métriques en temps réel.'
    }
  },
  {
    path: '/apps/agent/friday',
    name: 'AgentFridayKnowledgeBase',
    component: AgentFridayKnowledgeBase,
    meta: { 
      title: 'FRIDAY Knowledge Base | RAG Builder',
      description: 'Créez une base de connaissances RAG pour votre chatbot.'
    }
  },
  {
    path: '/apps/agent/vision',
    name: 'AgentVisionContentGen',
    component: AgentVisionContentGen,
    meta: { 
      title: 'VISION Content Gen | SEO Content',
      description: 'Générez du contenu optimisé SEO pour vos projets.'
    }
  },
  {
    path: '/apps/agent/veronica',
    name: 'AgentVeronicaPipeline',
    component: AgentVeronicaPipeline,
    meta: { 
      title: 'VERONICA Pipeline | CI/CD Builder',
      description: 'Générez des configurations CI/CD pour GitHub Actions, GitLab CI.'
    }
  },
  {
    path: '/apps/agent/pepper',
    name: 'AgentPepperInvoice',
    component: AgentPepperInvoice,
    meta: { 
      title: 'PEPPER Invoice | Facturation',
      description: 'Créez des devis et factures professionnels.'
    }
  },

  // -------------------------------------------------------------------------
  // FORMATION - Masqué temporairement (droits en attente)
  // -------------------------------------------------------------------------
  /*
  {
    path: '/formation',
    name: 'FormationHub',
    component: FormationHub,
    meta: { 
      title: 'Formations Développement Web & IA | GL Academy',
      description: 'Formations professionnelles Symfony, Vue.js, IA, DevOps. Formateur expert terrain, petits groupes, certifications. Éligible CPF.'
    }
  },
  {
    path: '/formation/challenges',
    name: 'ChallengesHub',
    component: ChallengesHub,
    meta: { 
      title: 'Challenges Développement | GL Academy',
      description: 'Challenges de code professionnels pour construire votre portfolio. 15+ projets sur 5 niveaux, du débutant à l\'expert.'
    }
  },
  {
    path: '/formation/parcours/:slug',
    name: 'FormationPath',
    component: FormationPath,
    meta: { 
      title: 'Parcours de Formation | GL Academy',
      description: 'Parcours complet de formation pour atteindre vos objectifs professionnels.'
    }
  },
  {
    path: '/formation/:slug',
    name: 'FormationDetail',
    component: FormationDetail,
    meta: { 
      title: 'Formation | GL Academy',
      description: 'Découvrez le programme complet, les objectifs et les prochaines sessions de cette formation.'
    }
  },
  */

  // -------------------------------------------------------------------------
  // APPS - Métier spécialisées
  // -------------------------------------------------------------------------
  {
    path: '/apps/print3d-manager',
    name: 'Print3DManager',
    component: Print3DManager,
    meta: { 
      title: '3D Print Manager | Gestion Impression 3D',
      description: 'Application complète de gestion d\'entreprise d\'impression 3D : commandes, inventaire, imprimantes, facturation, calculateur de prix.'
    }
  },
  {
    path: '/apps/teacher-assistant',
    name: 'TeacherAssistant',
    component: TeacherAssistant,
    meta: { 
      title: 'Prof Assistant IA | Chatbot Pédagogique',
      description: 'Assistant IA pour professeurs : génération de quiz, aide à la correction, plans de cours, gestion de classe et chatbot pédagogique.'
    }
  },
  {
    path: '/apps/ark-config',
    name: 'ArkConfigManager',
    component: ArkConfigManager,
    meta: { 
      title: 'ARK Config Manager | ARKADIA FRANCE',
      description: 'Gestionnaire de configuration ARK: GameUserSettings.ini, Game.ini, mods, stacks, engrams. Outil admin pour serveurs ARK Survival.'
    }
  },
  {
    path: '/apps/privacy-shield',
    name: 'PrivacyShield',
    component: PrivacyShield,
    meta: { 
      title: 'Privacy Shield | Formation Cybersécurité',
      description: 'Formation interactive à la protection de la vie privée numérique. 7 modules : mots de passe, réseaux sociaux, phishing, cookies, RGPD, paiements, WiFi.'
    }
  },
  {
    path: '/apps/hexworld',
    name: 'HexWorld',
    component: HexWorld,
    meta: { 
      title: 'HEXGEN | Générateur de MON NFT',
      description: 'Créez des MON uniques avec le système de génération hexagonal HEXGEN. 6 attributs, combinaisons infinies, sauvegarde locale.'
    }
  },

  // -------------------------------------------------------------------------
  // ARCADE
  // -------------------------------------------------------------------------
  {
    path: '/arcade',
    name: 'ArcadeHub',
    component: ArcadeHub,
    meta: { 
      title: 'Neo\'s Arcade | Mini-jeux Portfolio',
      description: 'Explorez mon portfolio de façon ludique : cartes holographiques, memory, terminal hacker et machine à sous tech.'
    }
  },
  {
    path: '/arcade/cards',
    name: 'CardsGame',
    component: CardsGame,
    meta: { 
      title: 'GL Cards | Collection de Projets',
      description: 'Collection de cartes holographiques de mes projets. Survolez pour l\'effet 3D, cliquez pour découvrir les détails.'
    }
  },
  {
    path: '/arcade/memory',
    name: 'MemoryGame',
    component: MemoryGame,
    meta: { 
      title: 'Memory | Jeu de Mémoire',
      description: 'Retrouvez les paires de projets dans ce jeu de mémoire. Testez votre concentration !'
    }
  },
  {
    path: '/arcade/terminal',
    name: 'TerminalGame',
    component: TerminalGame,
    meta: { 
      title: 'Terminal | Mode Hacker',
      description: 'Explorez mes projets en ligne de commande. Tapez help pour commencer l\'aventure Matrix.'
    }
  },
  {
    path: '/arcade/slots',
    name: 'SlotsGame',
    component: SlotsGame,
    meta: { 
      title: 'Stack Slots | Machine à Sous Tech',
      description: 'Tirez le levier et découvrez quel projet correspond à la combinaison de technologies !'
    }
  },

  // -------------------------------------------------------------------------
  // MATRIX - Admin Hub (The Construct)
  // -------------------------------------------------------------------------
  {
    path: '/construct',
    name: 'MatrixAdminHub',
    component: MatrixAdminHub,
    meta: { 
      title: 'THE CONSTRUCT | Admin Hub',
      description: 'Hub administrateur immersif. Visualisez vos systèmes, explorez vos nodes, accédez à vos dashboards. Welcome back, Neo.'
    }
  },

  // -------------------------------------------------------------------------
  // GALERIE - Créations numériques style Matrix
  // -------------------------------------------------------------------------
  {
    path: '/creations',
    name: 'GalleryMatrix',
    component: GalleryMatrixPage,
    meta: { 
      title: 'Galerie Créations | Matrix Style',
      description: 'Explorez mes créations numériques : designs d\'univers, interfaces UI/UX, branding, 3D et art génératif. Style Matrix/Tron immersif.'
    }
  },

  // -------------------------------------------------------------------------
  // RESOURCES - Bibliothèque de composants
  // -------------------------------------------------------------------------
  {
    path: '/components',
    name: 'ComponentsLibrary',
    component: ComponentsLibrary,
    meta: { 
      title: 'Component Library | Vue & Symfony',
      description: 'Bibliothèque de composants Vue 3 et Symfony réutilisables. RGPD, OPQUAST, 18+, Social. Copiez-collez et déployez.'
    }
  },

  // -------------------------------------------------------------------------
  // 404 - Catch all (DOIT ÊTRE EN DERNIER)
  // -------------------------------------------------------------------------
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound,
    meta: { 
      title: 'Page Non Trouvée',
      description: 'La page que vous recherchez n\'existe pas ou a été déplacée.'
    }
  }
];


// ============================================================================
// ROUTER CONFIGURATION
// ============================================================================

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    }
    return { top: 0, behavior: 'smooth' };
  }
});

// Opquast N°98 : Title et meta description uniques par page
router.beforeEach((to, from, next) => {
  // Update title
  document.title = `${to.meta.title} | GL Digital Lab`;
  
  // Update meta description
  const metaDescription = document.querySelector('meta[name="description"]');
  if (metaDescription && to.meta.description) {
    metaDescription.setAttribute('content', to.meta.description);
  }
  
  // Update canonical URL
  let canonical = document.querySelector('link[rel="canonical"]');
  if (canonical) {
    canonical.setAttribute('href', `https://gldigitallab.fr${to.path}`);
  }
  
  next();
});

export default router;
