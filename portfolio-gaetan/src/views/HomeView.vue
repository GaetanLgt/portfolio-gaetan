<template>
  <div class="home">
    <!-- Hero Section with Three.js -->
    <section class="hero">
      <div class="hero__canvas" ref="canvasContainer"></div>
      <div class="hero__overlay"></div>
      
      <div class="hero__content container">
        <div class="hero__badge badge">
          <span class="badge__dot"></span>
          Sprint 40 ans • J-{{ daysRemaining }}
        </div>
        
        <h1 class="hero__title">
          <span class="hero__title-line">Développeur Full-Stack</span>
          <span class="hero__title-line text-gradient">&amp; Architecte IA</span>
        </h1>
        
        <p class="hero__subtitle">
          Je construis des systèmes web qui travaillent pendant que vous dormez.<br>
          Symfony 8, Vue 3, automatisation intelligente.
        </p>
        
        <div class="hero__ctas">
          <router-link to="/services" class="btn btn--primary btn--lg">
            Découvrir mes services
          </router-link>
          <router-link to="/portfolio/arkadia" class="btn btn--secondary btn--lg">
            Voir ARKADIA →
          </router-link>
        </div>
        
        <div class="hero__scroll">
          <span>Scroll</span>
          <div class="hero__scroll-line"></div>
        </div>
      </div>
    </section>

    <!-- Metrics Section -->
    <section class="metrics section">
      <div class="container">
        <div class="metrics__grid">
          <div v-for="metric in metrics" :key="metric.label" class="metric-card">
            <span class="metric-card__value">{{ metric.value }}</span>
            <span class="metric-card__label">{{ metric.label }}</span>
            <span v-if="metric.trend" class="metric-card__trend badge badge--success">
              {{ metric.trend }}
            </span>
          </div>
        </div>
      </div>
    </section>

    <!-- Services Preview Section -->
    <section class="services-preview section">
      <div class="container">
        <div class="section-header">
          <span class="badge section-header__badge">Services</span>
          <h2 class="section-header__title">Des solutions qui s'adaptent</h2>
          <p class="section-header__subtitle">
            Du site vitrine à l'application métier complexe, 
            avec toujours une touche d'automatisation IA.
          </p>
        </div>
        
        <div class="services-preview__grid">
          <div v-for="service in services" :key="service.title" class="service-card card card--glow">
            <span class="service-card__icon">{{ service.icon }}</span>
            <h3 class="service-card__title">{{ service.title }}</h3>
            <p class="service-card__desc">{{ service.description }}</p>
            <div class="service-card__meta">
              <span class="service-card__price">{{ service.price }}</span>
              <span class="service-card__duration">{{ service.duration }}</span>
            </div>
          </div>
        </div>
        
        <div class="services-preview__cta">
          <router-link to="/services" class="btn btn--secondary">
            Voir tous les services →
          </router-link>
        </div>
      </div>
    </section>

    <!-- Case Study Spotlight -->
    <section class="spotlight section">
      <div class="container">
        <div class="spotlight__content">
          <div class="spotlight__text">
            <span class="badge badge--success">Case Study</span>
            <h2 class="spotlight__title">ARKADIA FRANCE</h2>
            <p class="spotlight__subtitle">
              Cluster ARK • 150 membres • Écosystème automatisé
            </p>
            <p class="spotlight__desc">
              De 10 à 150 joueurs en 6 mois. Infrastructure automatisée avec bots Discord, 
              monitoring temps réel, économie custom et workflows n8n. 
              Une preuve concrète de mes capacités à gérer des systèmes complexes 24/7.
            </p>
            <div class="spotlight__stats">
              <div class="spotlight__stat">
                <span class="spotlight__stat-value">+1400%</span>
                <span class="spotlight__stat-label">Croissance</span>
              </div>
              <div class="spotlight__stat">
                <span class="spotlight__stat-value">99.8%</span>
                <span class="spotlight__stat-label">Uptime</span>
              </div>
              <div class="spotlight__stat">
                <span class="spotlight__stat-value">91%</span>
                <span class="spotlight__stat-label">Satisfaction</span>
              </div>
            </div>
            <router-link to="/portfolio/arkadia" class="btn btn--primary">
              Découvrir le case study complet
            </router-link>
          </div>
          <div class="spotlight__visual">
            <div class="spotlight__image-placeholder">
              <span class="spotlight__image-text">ARKADIA</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Stack Section -->
    <section class="stack section">
      <div class="container">
        <div class="section-header">
          <span class="badge section-header__badge">Stack Technique</span>
          <h2 class="section-header__title">Technologies maîtrisées</h2>
        </div>
        
        <div class="stack__grid">
          <div v-for="category in stack" :key="category.name" class="stack__category">
            <h3 class="stack__category-title">{{ category.name }}</h3>
            <div class="stack__tags">
              <span v-for="tech in category.techs" :key="tech" class="stack__tag">
                {{ tech }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta section">
      <div class="container">
        <div class="cta__content">
          <h2 class="cta__title">Prêt à moderniser votre infrastructure ?</h2>
          <p class="cta__text">
            Discutons de votre projet. Premier appel découverte gratuit.
          </p>
          <div class="cta__buttons">
            <router-link to="/contact" class="btn btn--primary btn--lg">
              Parlons de votre projet
            </router-link>
            <router-link to="/about" class="btn btn--ghost btn--lg">
              En savoir plus sur moi
            </router-link>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useThreeHero } from '@/composables/useThreeHero';

const canvasContainer = ref(null);

// Days remaining until 40th birthday
const targetDate = new Date('2026-01-29');
const daysRemaining = computed(() => {
  const today = new Date();
  const diff = targetDate - today;
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
});

// Metrics data
const metrics = ref([
  { value: '150+', label: 'Membres ARKADIA', trend: '+1400%' },
  { value: '99.8%', label: 'Uptime serveur', trend: null },
  { value: '5+', label: 'Années d\'expérience', trend: null },
  { value: '40h', label: 'Max / semaine', trend: null }
]);

// Services preview
const services = ref([
  {
    icon: '🚀',
    title: 'Refonte Web Moderne',
    description: 'Sites performants avec Symfony 8 et Vue 3. SEO optimisé, responsive, maintenable.',
    price: '8k - 15k€',
    duration: '4-6 semaines'
  },
  {
    icon: '⚙️',
    title: 'Application Métier',
    description: 'CRM, ERP, dashboards sur-mesure. Architecture robuste, évolutive.',
    price: '15k - 30k€',
    duration: '8-12 semaines'
  },
  {
    icon: '🤖',
    title: 'Automatisation IA',
    description: 'Workflows n8n, chatbots, extraction de données. Gagnez du temps.',
    price: '12k - 25k€',
    duration: '6-10 semaines'
  }
]);

// Stack technique
const stack = ref([
  { name: 'Backend', techs: ['Symfony 8', 'PHP 8.3+', 'API Platform', 'Doctrine'] },
  { name: 'Frontend', techs: ['Vue 3', 'Three.js', 'TypeScript', 'GSAP'] },
  { name: 'DevOps', techs: ['Docker', 'GitHub Actions', 'Linux', 'Nitrado'] },
  { name: 'IA & Auto', techs: ['n8n', 'Claude/GPT', 'OpenWebUI', 'Obsidian RAG'] }
]);

// Three.js hero
let cleanup = null;

onMounted(() => {
  if (canvasContainer.value) {
    cleanup = useThreeHero(canvasContainer.value);
  }
});

onUnmounted(() => {
  if (cleanup) cleanup();
});
</script>

<style scoped>
/* === HERO === */
.hero {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.hero__canvas {
  position: absolute;
  inset: 0;
  z-index: 0;
}

.hero__overlay {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at center, transparent 0%, var(--bg-primary) 70%);
  z-index: 1;
}

.hero__content {
  position: relative;
  z-index: 2;
  text-align: center;
  padding: var(--space-8) 0;
}

.hero__badge {
  margin-bottom: var(--space-6);
}

.badge__dot {
  width: 8px;
  height: 8px;
  background: var(--matrix-green);
  border-radius: 50%;
  display: inline-block;
  animation: pulse 2s infinite;
}

.hero__title {
  margin-bottom: var(--space-6);
}

.hero__title-line {
  display: block;
}

.hero__subtitle {
  font-size: var(--text-xl);
  color: var(--text-secondary);
  margin-bottom: var(--space-10);
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.hero__ctas {
  display: flex;
  gap: var(--space-4);
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: var(--space-16);
}

.hero__scroll {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-2);
  color: var(--text-muted);
  font-size: var(--text-sm);
}

.hero__scroll-line {
  width: 1px;
  height: 60px;
  background: linear-gradient(to bottom, var(--accent-primary), transparent);
  animation: fadeInUp 1.5s ease-out infinite;
}

/* === METRICS === */
.metrics {
  background: var(--bg-secondary);
  border-top: 1px solid var(--border-subtle);
  border-bottom: 1px solid var(--border-subtle);
  padding: var(--space-12) 0;
}

.metrics__grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-6);
}

@media (max-width: 768px) {
  .metrics__grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

.metric-card {
  text-align: center;
  padding: var(--space-4);
}

.metric-card__value {
  display: block;
  font-family: var(--font-display);
  font-size: var(--text-3xl);
  font-weight: 700;
  color: var(--accent-primary);
  margin-bottom: var(--space-1);
}

.metric-card__label {
  display: block;
  font-size: var(--text-sm);
  color: var(--text-secondary);
  margin-bottom: var(--space-2);
}

.metric-card__trend {
  font-size: var(--text-xs);
}

/* === SERVICES PREVIEW === */
.services-preview__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-6);
  margin-bottom: var(--space-12);
}

@media (max-width: 1024px) {
  .services-preview__grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .services-preview__grid {
    grid-template-columns: 1fr;
  }
}

.service-card {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.service-card__icon {
  font-size: 2.5rem;
}

.service-card__title {
  font-size: var(--text-xl);
  color: var(--text-primary);
}

.service-card__desc {
  font-size: var(--text-sm);
  flex: 1;
}

.service-card__meta {
  display: flex;
  justify-content: space-between;
  padding-top: var(--space-4);
  border-top: 1px solid var(--border-subtle);
  font-family: var(--font-mono);
  font-size: var(--text-xs);
}

.service-card__price {
  color: var(--accent-primary);
  font-weight: 600;
}

.service-card__duration {
  color: var(--text-muted);
}

.services-preview__cta {
  text-align: center;
}

/* === SPOTLIGHT === */
.spotlight {
  background: var(--gradient-hero);
}

.spotlight__content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-16);
  align-items: center;
}

@media (max-width: 968px) {
  .spotlight__content {
    grid-template-columns: 1fr;
    text-align: center;
  }
}

.spotlight__text {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

@media (max-width: 968px) {
  .spotlight__text {
    align-items: center;
  }
}

.spotlight__title {
  font-size: var(--text-4xl);
  color: var(--matrix-green);
}

.spotlight__subtitle {
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  color: var(--text-muted);
}

.spotlight__desc {
  font-size: var(--text-base);
  margin: var(--space-4) 0;
}

.spotlight__stats {
  display: flex;
  gap: var(--space-8);
  margin: var(--space-6) 0;
}

@media (max-width: 968px) {
  .spotlight__stats {
    justify-content: center;
  }
}

.spotlight__stat {
  text-align: center;
}

.spotlight__stat-value {
  display: block;
  font-family: var(--font-display);
  font-size: var(--text-2xl);
  font-weight: 700;
  color: var(--accent-primary);
}

.spotlight__stat-label {
  font-size: var(--text-xs);
  color: var(--text-muted);
}

.spotlight__visual {
  display: flex;
  justify-content: center;
  align-items: center;
}

.spotlight__image-placeholder {
  width: 100%;
  max-width: 500px;
  aspect-ratio: 16/10;
  background: var(--bg-card);
  border: 1px solid var(--matrix-green);
  border-radius: var(--radius-xl);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow-glow);
}

.spotlight__image-text {
  font-family: var(--font-display);
  font-size: var(--text-3xl);
  font-weight: 700;
  color: var(--matrix-green);
  opacity: 0.5;
}

/* === STACK === */
.stack__grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-6);
}

@media (max-width: 1024px) {
  .stack__grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .stack__grid {
    grid-template-columns: 1fr;
  }
}

.stack__category {
  padding: var(--space-6);
  background: var(--bg-card);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  transition: all var(--transition-base);
}

.stack__category:hover {
  border-color: var(--border-active);
}

.stack__category-title {
  font-size: var(--text-sm);
  font-family: var(--font-mono);
  color: var(--accent-primary);
  margin-bottom: var(--space-4);
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.stack__tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
}

.stack__tag {
  padding: var(--space-1) var(--space-3);
  background: rgba(6, 182, 212, 0.1);
  border: 1px solid rgba(6, 182, 212, 0.2);
  border-radius: var(--radius-sm);
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  color: var(--text-secondary);
}

/* === CTA === */
.cta {
  background: linear-gradient(180deg, var(--bg-primary) 0%, var(--bg-secondary) 100%);
  border-top: 1px solid var(--border-subtle);
}

.cta__content {
  text-align: center;
  max-width: 700px;
  margin: 0 auto;
}

.cta__title {
  font-size: var(--text-3xl);
  margin-bottom: var(--space-4);
}

.cta__text {
  font-size: var(--text-lg);
  margin-bottom: var(--space-8);
}

.cta__buttons {
  display: flex;
  gap: var(--space-4);
  justify-content: center;
  flex-wrap: wrap;
}
</style>
