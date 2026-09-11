import { createRouter, createWebHistory } from 'vue-router';

// ============================================================================
// IMPORTS - Organisation par catégorie
// ============================================================================

// CORE - Pages principales (HomePage chargée immédiatement)
import HomePage from '@/views/core/HomePage.vue';
const ContactPage = () => import('@/views/core/ContactPage.vue');
const SitemapPage = () => import('@/views/core/SitemapPage.vue');
const NotFound = () => import('@/views/core/NotFound.vue');
// Page listant les applications (créée le 10/09/2026) : les 7 pages d'apps portaient un
// lien « ← Retour aux Apps » vers /apps, une adresse qui n'existait pas — en ligne elle
// répondait 403, donc les sept boutons de retour menaient à une erreur.
const AppsPage = () => import('@/views/core/AppsPage.vue');

// SERVICES - Offres et solutions
const ServicesPage = () => import('@/views/services/ServicesPage.vue');
const ProjectsPage = () => import('@/views/services/ProjectsPage.vue');

// PARCOURS - Histoire et parcours
const HolisticMapPage = () => import('@/views/parcours/HolisticMapPage.vue');

// PROJECTS - Case studies
const ArkadiaCase = () => import('@/views/projects/ArkadiaCase.vue');
const VoyageoProCase = () => import('@/views/projects/VoyageoProCase.vue');

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

// FORMATION — section abandonnée (décision Gaëtan du 10/09/2026).
// Historique, pour qui se demanderait où elle est passée :
//   · 10/09 — imports retirés. Les quatre composants (FormationHub, FormationDetail,
//     FormationPath, ChallengesHub) n'étaient référencés que par le bloc de routes ;
//     vérifié avant retrait : 0 occurrence hors de ce fichier.
//   · 11/09 — le bloc de 4 routes, DÉJÀ ENTIÈREMENT COMMENTÉ depuis le « masquage
//     temporaire (droits en attente) », a été supprimé à son tour. Il ne servait rien :
//     du code mort dans un commentaire n'est pas du code — et il faussait le comptage
//     des routes, qui annonçait 29 là où le routeur en déclare 25.
// Le contenu source est archivé, pas perdu : modeles/archives/formation-2026-09-10/.
// Le `Disallow: /formation` de robots.txt a été retiré en même temps : un Disallow sur
// un chemin qui n'existe plus est un vestige, pas une protection.

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
      title: 'Sites web & IA sur-mesure pour PME',
      description: 'Sites web, applications métier et agents d\'IA exécutés sur notre propre machine, dans la Somme. Vos données restent dans la cale. Audit 48 h, réponse sous 24 h.'
    }
  },
  {
    path: '/dossier',
    name: 'Dossier',
    // Chargement différé : cette page est sobre et rarement visitée, elle n'a
    // pas à peser sur le paquet initial du site.
    component: () => import('@/views/core/DossierPage.vue'),
    meta: {
      title: 'Dossier professionnel | Prestations, prix, méthode et limites',
      description: 'Prestations, prix publics hors taxes, délais, méthode et limites assumées de GL Digital Lab, studio indépendant dans la Somme. Document imprimable, sans animation.'
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
    path: '/liens',
    name: 'Liens',
    // Page de liens du studio (10/09/2026) : elle remplace le « Linktree » que les
    // fiches de communication prescrivaient — un service tiers qui hébergerait nos
    // liens, contre la doctrine local-first du studio. Ses quatre cibles sont des
    // pages QUI EXISTENT DÉJÀ : aucun lien mort, c'est la raison de ce choix.
    component: () => import('@/views/core/LiensPage.vue'),
    meta: {
      title: 'Liens | Audit WordPress 48 h, projets, prestations | GL Digital Lab',
      description: 'Tous les liens du studio en un seul endroit : audit WordPress 48 h, projets et études de cas, prestations et prix publiés, contact. Page hébergée chez nous, sans traqueur ni service tiers.'
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
      title: 'Projets & Réalisations',
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
      title: 'Carte Holistique | Neo',
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
      title: 'Case Study ARKADIA France (ARK)',
      description: 'Administration de cluster ARK: Survival Ascended. 9 serveurs, 99.8% uptime. DevOps appliqué au gaming.'
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
  // APPLICATIONS - page d'index (créée le 10/09/2026)
  // Les 7 pages d'applications renvoyaient toutes vers /apps, qui n'existait pas.
  // -------------------------------------------------------------------------
  {
    path: '/apps',
    name: 'Apps',
    component: AppsPage,
    meta: {
      title: 'Applications | Les outils de l\'équipage',
      description: 'Les applications du studio : orchestrateur multi-agent, audit de sécurité, supervision système, base de connaissances, CI/CD, contenu SEO, devis et factures.'
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
