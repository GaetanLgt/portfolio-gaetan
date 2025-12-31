<template>
  <div class="services">
    <!-- Hero Section -->
    <section class="hero">
      <div class="container">
        <h1 class="hero__title">
          Développement web moderne<br>
          <span class="text-gradient">+ IA intégrée</span>
        </h1>
        <p class="hero__subtitle">
          Symfony 8, Vue 3, automatisation workflows.<br>
          De la conception au déploiement et maintenance.
        </p>
      </div>
    </section>

    <!-- Offres Section -->
    <section class="offers">
      <div class="container">
        <div class="offers__grid">
          <Card
            v-for="offer in offersData"
            :key="offer.id"
            :class="['offer-card', { 'offer-card--featured': offer.featured }]"
          >
            <div v-if="offer.featured" class="offer-card__badge">
              Recommandé
            </div>
            <div class="offer-card__icon">{{ offer.icon }}</div>
            <h3 class="offer-card__title">{{ offer.title }}</h3>
            <p class="offer-card__subtitle">{{ offer.subtitle }}</p>
            <div class="offer-card__price">
              <span class="price__amount">{{ offer.priceRange }}</span>
              <span class="price__label">{{ offer.priceLabel }}</span>
            </div>
            <ul class="offer-card__features">
              <li v-for="feature in offer.features" :key="feature" class="feature-item">
                <span class="feature-icon">✓</span>
                {{ feature }}
              </li>
            </ul>
            <div class="offer-card__details">
              <div class="detail">
                <span class="detail__label">Durée</span>
                <span class="detail__value">{{ offer.duration }}</span>
              </div>
              <div class="detail">
                <span class="detail__label">Support</span>
                <span class="detail__value">{{ offer.support }}</span>
              </div>
            </div>
            <router-link to="/contact" class="btn btn--primary btn--block">
              Demander un devis
            </router-link>
          </Card>
        </div>
      </div>
    </section>

    <!-- Process Section -->
    <section class="process">
      <div class="container">
        <h2 class="section-title">Comment je travaille</h2>
        <div class="process__steps">
          <div v-for="(step, index) in processSteps" :key="step.title" class="process__step">
            <div class="step__number">{{ index + 1 }}</div>
            <h3 class="step__title">{{ step.title }}</h3>
            <p class="step__description">{{ step.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Expertise Section -->
    <section class="expertise">
      <div class="container">
        <h2 class="section-title">Expertise Technique</h2>
        <div class="expertise__grid">
          <div v-for="category in expertiseData" :key="category.name" class="expertise__category">
            <div class="category__header">
              <span class="category__icon">{{ category.icon }}</span>
              <h3 class="category__title">{{ category.name }}</h3>
            </div>
            <ul class="category__techs">
              <li v-for="tech in category.techs" :key="tech" class="tech-item">
                {{ tech }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta">
      <div class="container">
        <div class="cta__content">
          <h2 class="cta__title">Un projet en tête ?</h2>
          <p class="cta__text">
            Discutons-en pour trouver la solution adaptée à vos besoins.
          </p>
          <router-link to="/contact" class="btn btn--primary btn--large">
            Prendre contact
          </router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import Card from '@/components/common/Card.vue';

const offersData = ref([
  {
    id: 'starter',
    icon: '🚀',
    title: 'STARTER',
    subtitle: 'Refonte Web Moderne',
    priceRange: '8k-15k€',
    priceLabel: 'par projet',
    duration: '4-6 semaines',
    support: '1 mois',
    featured: false,
    features: [
      'Audit existant + recommandations',
      'Design moderne Figma + intégration',
      'Backend Symfony 8 + API REST',
      'Frontend Vue 3 (ou SSR Twig)',
      'Formation client back-office',
      'Support post-launch inclus'
    ]
  },
  {
    id: 'pro',
    icon: '💼',
    title: 'PRO',
    subtitle: 'Application Métier Sur-Mesure',
    priceRange: '15k-30k€',
    priceLabel: 'par projet',
    duration: '8-12 semaines',
    support: '3 mois',
    featured: true,
    features: [
      'Analyse besoins + specs fonctionnelles',
      'Architecture technique évolutive',
      'Backend Symfony 8 + BDD optimisée',
      'Frontend Vue 3 (SPA ou hybride)',
      'Authentification sécurisée (roles)',
      'Tests automatisés + CI/CD',
      'Formation équipe + documentation'
    ]
  },
  {
    id: 'premium',
    icon: '🤖',
    title: 'PREMIUM',
    subtitle: 'Automatisation IA Complète',
    priceRange: '12k-25k€',
    priceLabel: 'par projet',
    duration: '6-10 semaines',
    support: '6 mois',
    featured: false,
    features: [
      'Audit processus + opportunités auto',
      'Workflows n8n sur-mesure',
      'Intégration IA locale ou API',
      'Bots Discord/Slack intelligents',
      'Dashboard monitoring temps réel',
      'Formation équipe technique',
      'Maintenance + optimisations'
    ]
  },
  {
    id: 'consulting',
    icon: '🎯',
    title: 'CONSULTING',
    subtitle: 'Accompagnement Stratégique',
    priceRange: '800€/jour',
    priceLabel: 'ou 3k€/mois',
    duration: '1-5 jours',
    support: 'Continu',
    featured: false,
    features: [
      'Code review avancé',
      'Architecture review + recommandations',
      'Mentorat équipe dev',
      'Audit sécurité / performance',
      'Assistance décisions techniques',
      'Disponibilité rapide (48h)'
    ]
  }
]);

const processSteps = ref([
  {
    title: 'Découverte',
    description: 'Échange initial pour comprendre vos besoins, objectifs et contraintes. Estimation transparente du budget et des délais.'
  },
  {
    title: 'Conception',
    description: 'Rédaction specs fonctionnelles + maquettes Figma. Validation architecture technique avant développement.'
  },
  {
    title: 'Développement',
    description: 'Sprints courts (1-2 semaines) avec feedbacks réguliers. Code propre, testé, documenté.'
  },
  {
    title: 'Déploiement',
    description: 'Mise en production sécurisée + formation équipe. Monitoring post-launch et support inclus.'
  }
]);

const expertiseData = ref([
  {
    name: 'Backend',
    icon: '⚙️',
    techs: [
      'Symfony 8 (LTS 7.4)',
      'PHP 8.3+ (strict types)',
      'API Platform (REST/GraphQL)',
      'Doctrine ORM',
      'Tests PHPUnit + Behat'
    ]
  },
  {
    name: 'Frontend',
    icon: '🎨',
    techs: [
      'Vue.js 3 (Composition API)',
      'Nuxt 3 (SSR si nécessaire)',
      'Three.js (3D web)',
      'TailwindCSS',
      'Tests Vitest + Cypress'
    ]
  },
  {
    name: 'DevOps',
    icon: '🐳',
    techs: [
      'Docker (dev + prod)',
      'GitHub Actions (CI/CD)',
      'VPS Linux (OVH, Scaleway)',
      'Monitoring (logs, alertes)'
    ]
  },
  {
    name: 'Automatisation',
    icon: '🤖',
    techs: [
      'n8n (workflows custom)',
      'Discord/Slack Bots',
      'API integrations',
      'RCON + Webhooks'
    ]
  },
  {
    name: 'IA Locale',
    icon: '🧠',
    techs: [
      'Nemotron (LLM local)',
      'ChromaDB (RAG)',
      'OpenWebUI',
      'Continue (VS Code)'
    ]
  }
]);
</script>

<style scoped>
.services { padding-top: 80px; }

/* Hero Section */
.hero {
  padding: var(--space-xl) 0;
  text-align: center;
  background: linear-gradient(135deg, rgba(0, 255, 65, 0.05) 0%, rgba(0, 255, 65, 0.01) 100%);
}

.hero__title {
  font-size: clamp(2rem, 5vw, 3rem);
  margin-bottom: var(--space-md);
}

.hero__subtitle {
  font-size: clamp(1rem, 2vw, 1.25rem);
  color: var(--text-secondary);
  max-width: 600px;
  margin: 0 auto;
}

/* Offers Section */
.offers {
  padding: var(--space-xl) 0;
}

.offers__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--space-lg);
}

.offer-card {
  position: relative;
  display: flex;
  flex-direction: column;
  padding: var(--space-lg);
  transition: all var(--transition-base);
}

.offer-card:hover {
  transform: translateY(-8px);
}

.offer-card--featured {
  border-color: var(--matrix-green);
  box-shadow: 0 0 30px rgba(0, 255, 65, 0.2);
}

.offer-card__badge {
  position: absolute;
  top: -12px;
  right: var(--space-md);
  padding: 0.25rem 0.75rem;
  background: var(--matrix-green);
  color: var(--code-dark);
  font-size: 0.75rem;
  font-weight: 700;
  border-radius: 12px;
  font-family: 'JetBrains Mono', monospace;
}

.offer-card__icon {
  font-size: 3rem;
  margin-bottom: var(--space-sm);
}

.offer-card__title {
  font-size: 1.5rem;
  color: var(--matrix-green);
  margin-bottom: var(--space-xs);
  font-family: 'JetBrains Mono', monospace;
}

.offer-card__subtitle {
  color: var(--text-secondary);
  margin-bottom: var(--space-md);
  font-size: 0.875rem;
}

.offer-card__price {
  display: flex;
  flex-direction: column;
  margin-bottom: var(--space-md);
  padding-bottom: var(--space-md);
  border-bottom: 1px solid var(--border-subtle);
}

.price__amount {
  font-size: 2rem;
  font-weight: 700;
  color: var(--matrix-green);
  font-family: 'JetBrains Mono', monospace;
}

.price__label {
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.offer-card__features {
  list-style: none;
  margin-bottom: var(--space-md);
  flex-grow: 1;
}

.feature-item {
  display: flex;
  align-items: flex-start;
  gap: var(--space-xs);
  margin-bottom: var(--space-sm);
  font-size: 0.875rem;
}

.feature-icon {
  color: var(--matrix-green);
  font-weight: 700;
}

.offer-card__details {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-sm);
  margin-bottom: var(--space-md);
  padding: var(--space-sm);
  background: rgba(0, 255, 65, 0.05);
  border-radius: 8px;
}

.detail {
  display: flex;
  flex-direction: column;
}

.detail__label {
  font-size: 0.75rem;
  color: var(--text-secondary);
  margin-bottom: 0.25rem;
}

.detail__value {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--matrix-green);
  font-family: 'JetBrains Mono', monospace;
}

/* Process Section */
.process {
  padding: var(--space-xl) 0;
  background: rgba(0, 255, 65, 0.02);
  border-top: 1px solid var(--border-subtle);
  border-bottom: 1px solid var(--border-subtle);
}

.process__steps {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--space-lg);
  margin-top: var(--space-lg);
}

.process__step {
  text-align: center;
}

.step__number {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  margin-bottom: var(--space-md);
  background: var(--matrix-green);
  color: var(--code-dark);
  font-size: 1.5rem;
  font-weight: 700;
  border-radius: 50%;
  font-family: 'JetBrains Mono', monospace;
}

.step__title {
  font-size: 1.25rem;
  margin-bottom: var(--space-sm);
  color: var(--matrix-green);
}

.step__description {
  color: var(--text-secondary);
  font-size: 0.875rem;
  line-height: 1.6;
}

/* Expertise Section */
.expertise {
  padding: var(--space-xl) 0;
}

.expertise__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--space-md);
  margin-top: var(--space-lg);
}

.expertise__category {
  padding: var(--space-md);
  background: var(--card-bg);
  border: 1px solid var(--border-subtle);
  border-radius: 12px;
  transition: all var(--transition-base);
}

.expertise__category:hover {
  border-color: var(--matrix-green);
  transform: translateY(-4px);
}

.category__header {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  margin-bottom: var(--space-md);
}

.category__icon {
  font-size: 1.5rem;
}

.category__title {
  font-size: 1.125rem;
  color: var(--matrix-green);
  font-family: 'JetBrains Mono', monospace;
}

.category__techs {
  list-style: none;
}

.tech-item {
  padding: var(--space-xs) 0;
  font-size: 0.875rem;
  color: var(--text-secondary);
  border-bottom: 1px solid rgba(0, 255, 65, 0.1);
}

.tech-item:last-child {
  border-bottom: none;
}

/* CTA Section */
.cta {
  padding: var(--space-xl) 0;
  text-align: center;
  background: linear-gradient(135deg, rgba(0, 255, 65, 0.05) 0%, rgba(0, 255, 65, 0.01) 100%);
}

.cta__content {
  max-width: 700px;
  margin: 0 auto;
}

.cta__title {
  font-size: clamp(1.75rem, 4vw, 2.5rem);
  margin-bottom: var(--space-md);
  color: var(--matrix-green);
}

.cta__text {
  font-size: 1.125rem;
  color: var(--text-secondary);
  margin-bottom: var(--space-lg);
}

.section-title {
  text-align: center;
  font-size: clamp(2rem, 4vw, 2.5rem);
  color: var(--matrix-green);
  margin-bottom: var(--space-lg);
}

/* Buttons */
.btn {
  display: inline-block;
  padding: 0.875rem 1.75rem;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.875rem;
  text-align: center;
  border-radius: 8px;
  transition: all var(--transition-base);
  cursor: pointer;
  text-decoration: none;
}

.btn--primary {
  background: var(--matrix-green);
  color: var(--code-dark);
  border: 2px solid var(--matrix-green);
}

.btn--primary:hover {
  background: transparent;
  color: var(--matrix-green);
}

.btn--block {
  display: block;
  width: 100%;
}

.btn--large {
  padding: 1rem 2rem;
  font-size: 1rem;
}

@media (max-width: 768px) {
  .offers__grid {
    grid-template-columns: 1fr;
  }
  
  .process__steps {
    grid-template-columns: 1fr;
  }
  
  .expertise__grid {
    grid-template-columns: 1fr;
  }
}
</style>
