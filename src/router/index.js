import { createRouter, createWebHistory } from 'vue-router';
import GamingToDev from '@/views/GamingToDev.vue';
import ConseilAgents from '@/views/ConseilAgents.vue';
import StackIA from '@/views/StackIA.vue';
import ArkadiaCase from '@/views/ArkadiaCase.vue';

const routes = [
  {
    path: '/',
    name: 'GamingToDev',
    component: GamingToDev,
    meta: { title: 'Gaming → Dev' }
  },
  {
    path: '/conseil',
    name: 'ConseilAgents',
    component: ConseilAgents,
    meta: { title: 'Conseil des Agents' }
  },
  {
    path: '/stack-ia',
    name: 'StackIA',
    component: StackIA,
    meta: { title: 'Stack IA 2025' }
  },
  {
    path: '/arkadia',
    name: 'ArkadiaCase',
    component: ArkadiaCase,
    meta: { title: 'ARKADIA FRANCE' }
  }
];

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

router.beforeEach((to, from, next) => {
  document.title = `${to.meta.title} | Gaëtan - Full-Stack Dev` || 'Portfolio Gaëtan';
  next();
});

export default router;
