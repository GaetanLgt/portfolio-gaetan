import { createRouter, createWebHistory } from 'vue-router';

// ============================================================================
// IMPORTS - Organisation par catégorie
// ============================================================================

// CORE - Pages principales (HomePage chargée immédiatement)
import HomePage from '@/views/core/HomePage.vue';
const HubPage = () => import('@/views/core/HubPage.vue');
const ContactPage = () => import('@/views/core/ContactPage.vue');
const SitemapPage = () => import('@/views/core/SitemapPage.vue');
const NotFound = () => import('@/views/core/NotFound.vue');

// SERVICES - Offres et solutions
const ServicesPage = () => import('@/views/services/ServicesPage.vue');
const ProjectsPage = () => import('@/views/services/ProjectsPage.vue');

// PARCOURS - Histoire et parcours
const HolisticMapPage = () => import('@/views/parcours/HolisticMapPage.vue');

// PROJECTS - Case studies
const ArkadiaCase = () => import('@/views/projects/ArkadiaCase.vue');
const VoyageoProCase = () => import('@/views/projects/VoyageoProCase.vue');
const AgentsPage = () => import('@/views/projects/AgentsPage.vue');

// LEGAL - Pages légales
const MentionsLegales = () => import('@/views/legal/MentionsLegales.vue');
const Confidentialite = () => import('@/views/legal/Confidentialite.vue');
const CGV = () => import('@/views/legal/CGV.vue');

// RESOURCES - Ressources et tutoriels
const TutorielsPage = () => import('@/views/resources/TutorielsPage.vue');
const ComponentsLibrary = () => import('@/views/resources/components-library/ComponentsLibrary.vue');

// TOOLS - Outils admin
const ArkAdminPortal = () => import('@/views/tools/ArkAdminPortal.vue');

// ÉQUIPAGE - Outils des Agents IA (7 conservés, accès direct)
const WaRouter = () => import(/* webpackChunkName: "apps-agents" */ '@/views/apps/WaRouter.vue');
const MakotoScanner = () => import(/* webpackChunkName: "apps-agents" */ '@/views/apps/MakotoScanner.vue');
const DouMonitor = () => import(/* webpackChunkName: "apps-agents" */ '@/views/apps/DouMonitor.vue');
const WatashiKnowledgeBase = () => import(/* webpackChunkName: "apps-agents" */ '@/views/apps/WatashiKnowledgeBase.vue');
const JitsuPipeline = () => import(/* webpackChunkName: "apps-agents" */ '@/views/apps/JitsuPipeline.vue');
const SeoContentGenerator = () => import(/* webpackChunkName: "apps" */ '@/views/apps/SeoContentGenerator.vue');
const InvoiceGenerator = () => import(/* webpackChunkName: "apps" */ '@/views/apps/InvoiceGenerator.vue');

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
      title: 'Sites web & IA sur-mesure pour PME | GL Digital Lab',
      description: 'Applications web et IA locales pour PME françaises : vos outils, vos données, chez vous. La machine travaille, l\'humain décide. Audit 48h, devis gratuit sous 24h.'
    }
  },
  {
    path: '/hub',
    name: 'Hub',
    component: HubPage,
    meta: { 
      title: 'GL TOWER | QG des six Lois',
      description: 'Centre de commandement GL Digital Lab. L\'équipage des six Lois couvre tous les niveaux de votre infrastructure : orchestration, sécurité, frontend, backend, monitoring, mémoire. L\'humain garde la main.'
    }
  },
  {
    path: '/contact',
    name: 'Contact',
    component: ContactPage,
    meta: { 
      title: 'Contact | Audit 30 min gratuit',
      description: 'Parlons de votre projet : premier échange gratuit de 30 minutes, sans engagement. Réponse sous 24h. Sites web, applications métier et IA locale pour PME.'
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
      title: 'Services | Audit, sites, applications, IA locale',
      description: 'Audit web 48h, sites sur-mesure, applications métier et IA locale pour PME. Vos outils, chez vous : hébergement souverain, code à vous, l\'humain décide.'
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
    path: '/agents',
    name: 'AgentsHub',
    component: AgentsHub,
    meta: { 
      title: 'Équipage des 6 Lois | GL Digital Lab',
      description: 'Six principes — Harmonie, Sincérité, Beauté, Réalisation, Mouvement, Intériorité — gravitent autour de votre projet. La machine travaille, l\'humain décide.'
    }
  },
  {
    path: '/tower',
    name: 'GLTowerInteractive',
    component: GLTowerInteractive,
    meta: { 
      title: 'GL TOWER | Visite Interactive du QG',
      description: 'Explorez GL Tower de manière interactive : l\'équipage des six Lois, leurs workflows automatisés, et découvrez comment votre site est produit de A à Z.'
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
  // ÉQUIPAGE - Outils des Agents IA (7 conservés, accès direct)
  // -------------------------------------------------------------------------
  {
    path: '/apps/agent/wa',
    name: 'WaRouter',
    component: WaRouter,
    meta: { 
      title: 'Wa Router | Orchestrateur Multi-Agent',
      description: 'Orchestrez des requêtes complexes vers les six Lois de l\'équipage.'
    }
  },
  {
    path: '/apps/agent/makoto',
    name: 'MakotoScanner',
    component: MakotoScanner,
    meta: { 
      title: 'Makoto Scanner | Audit de Sécurité',
      description: 'Analysez la sécurité de vos projets et dépendances.'
    }
  },
  {
    path: '/apps/agent/dou',
    name: 'DouMonitor',
    component: DouMonitor,
    meta: { 
      title: 'Dou Monitor | Supervision Système',
      description: 'Surveillez vos services et métriques en temps réel.'
    }
  },
  {
    path: '/apps/agent/watashi',
    name: 'WatashiKnowledgeBase',
    component: WatashiKnowledgeBase,
    meta: { 
      title: 'Watashi Knowledge Base | Base de Connaissances',
      description: 'Créez une base de connaissances RAG pour votre chatbot.'
    }
  },
  {
    path: '/apps/agent/jitsu',
    name: 'JitsuPipeline',
    component: JitsuPipeline,
    meta: { 
      title: 'Jitsu Pipeline | Générateur CI/CD',
      description: 'Générez des configurations CI/CD pour GitHub Actions, GitLab CI.'
    }
  },
  {
    path: '/apps/seo-content',
    name: 'SeoContentGenerator',
    component: SeoContentGenerator,
    meta: { 
      title: 'SEO Content Generator | Contenu Optimisé',
      description: 'Générez du contenu optimisé SEO pour vos projets.'
    }
  },
  {
    path: '/apps/invoice-generator',
    name: 'InvoiceGenerator',
    component: InvoiceGenerator,
    meta: { 
      title: 'Invoice Generator | Devis & Factures',
      description: 'Créez des devis et factures professionnels en quelques clics.'
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
