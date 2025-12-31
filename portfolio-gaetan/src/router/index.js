import { createRouter, createWebHistory } from 'vue-router';

// Lazy loading pour performance
const HomeView = () => import('@/views/HomeView.vue');
const ServicesView = () => import('@/views/ServicesView.vue');
const PortfolioView = () => import('@/views/PortfolioView.vue');
const ArkadiaView = () => import('@/views/ArkadiaView.vue');
const AboutView = () => import('@/views/AboutView.vue');
const ContactView = () => import('@/views/ContactView.vue');

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView,
    meta: { 
      title: 'GL Digital Lab',
      description: 'Développement web moderne + IA intégrée pour PME'
    }
  },
  {
    path: '/services',
    name: 'Services',
    component: ServicesView,
    meta: { 
      title: 'Services',
      description: 'Refonte web, applications métier, automatisation IA'
    }
  },
  {
    path: '/portfolio',
    name: 'Portfolio',
    component: PortfolioView,
    meta: { 
      title: 'Portfolio',
      description: 'Mes réalisations et case studies'
    }
  },
  {
    path: '/portfolio/arkadia',
    name: 'Arkadia',
    component: ArkadiaView,
    meta: { 
      title: 'ARKADIA FRANCE',
      description: 'Case study - Infrastructure gaming automatisée'
    }
  },
  {
    path: '/about',
    name: 'About',
    component: AboutView,
    meta: { 
      title: 'À propos',
      description: 'Parcours, vision et stack technique'
    }
  },
  {
    path: '/contact',
    name: 'Contact',
    component: ContactView,
    meta: { 
      title: 'Contact',
      description: 'Parlons de votre projet'
    }
  },
  // Redirects pour anciennes URLs
  {
    path: '/arkadia',
    redirect: '/portfolio/arkadia'
  },
  {
    path: '/conseil',
    redirect: '/portfolio/arkadia'
  },
  {
    path: '/stack-ia',
    redirect: '/about'
  },
  // 404
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    }
    if (to.hash) {
      return { el: to.hash, behavior: 'smooth' };
    }
    return { top: 0, behavior: 'smooth' };
  }
});

// SEO meta tags
router.beforeEach((to, from, next) => {
  const baseTitle = 'Gaëtan Music | Dev Full-Stack & IA';
  document.title = to.meta.title ? `${to.meta.title} | ${baseTitle}` : baseTitle;
  
  // Update meta description
  const metaDescription = document.querySelector('meta[name="description"]');
  if (metaDescription && to.meta.description) {
    metaDescription.setAttribute('content', to.meta.description);
  }
  
  next();
});

export default router;
