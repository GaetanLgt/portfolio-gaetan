<template>
  <div class="gaming-to-dev">
    <!-- Hero Section -->
    <section class="hero">
      <div class="container">
        <div class="hero__badge">
          <span class="badge-text">Sprint 40 ans • J-{{ daysRemaining }}</span>
        </div>
        <h1 class="hero__title">
          J'ai commencé par gérer des <span class="text-gradient">dinosaures</span>.<br>
          Maintenant je gère des <span class="text-gradient">APIs</span>.
        </h1>
        <p class="hero__subtitle">
          Entre les deux : Symfony 8, Vue.js, 150 joueurs actifs,<br>
          et une obsession pour l'automatisation via IA.
        </p>
        <div class="hero__ctas">
          <button class="btn btn--primary" @click="scrollToTimeline">
            Mon parcours ↓
          </button>
          <router-link to="/services" class="btn btn--secondary">
            Mes services →
          </router-link>
        </div>
      </div>
    </section>

    <!-- Stack Tech Section -->
    <section class="stack">
      <div class="container">
        <h2 class="section-title">Stack Technique 2025</h2>
        <div class="stack__grid">
          <div v-for="category in stackData" :key="category.name" class="stack__category">
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

    <!-- Metrics ARKADIA Section -->
    <section class="metrics">
      <div class="container">
        <h2 class="section-title">ARKADIA FRANCE en chiffres</h2>
        <div class="metrics__grid">
          <MetricCard
            v-for="metric in metricsData"
            :key="metric.label"
            :value="metric.value"
            :label="metric.label"
            :icon="metric.icon"
            :trend="metric.trend"
          />
        </div>
        <div class="metrics__cta">
          <router-link to="/arkadia" class="btn btn--outline">
            Case study complet →
          </router-link>
        </div>
      </div>
    </section>

    <!-- Timeline Section -->
    <section class="timeline" ref="timelineRef">
      <div class="container">
        <h2 class="section-title">Parcours</h2>
        <div class="timeline__items">
          <TimelineItem
            v-for="(item, index) in timelineData"
            :key="item.year"
            :year="item.year"
            :title="item.title"
            :subtitle="item.subtitle"
            :is-last="index === timelineData.length - 1"
          >
            <div v-html="item.content"></div>
          </TimelineItem>
        </div>
      </div>
    </section>

    <!-- CTA Final Section -->
    <section class="final-cta">
      <div class="container">
        <div class="final-cta__content">
          <h2 class="final-cta__title">
            Prêt à moderniser votre infrastructure web ?
          </h2>
          <p class="final-cta__text">
            Symfony 8, Vue 3, automatisation IA.<br>
            De la conception au déploiement.
          </p>
          <router-link to="/contact" class="btn btn--primary btn--large">
            Discutons de votre projet
          </router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import TimelineItem from '@/components/common/TimelineItem.vue';
import MetricCard from '@/components/common/MetricCard.vue';

const timelineRef = ref(null);

// Calcul jours restants avant 40 ans
const targetDate = new Date('2026-01-29');
const today = new Date();
const diffTime = targetDate - today;
const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

// Stack technique
const stackData = ref([
  {
    name: 'Backend',
    techs: ['Symfony 8', 'PHP 8.3+', 'API Platform', 'Doctrine']
  },
  {
    name: 'Frontend',
    techs: ['Vue.js 3', 'Three.js', 'TailwindCSS', 'Nuxt 3']
  },
  {
    name: 'DevOps',
    techs: ['Docker', 'Linux', 'GitHub Actions', 'Nitrado']
  },
  {
    name: 'Automatisation',
    techs: ['n8n', 'Discord Bots', 'RCON', 'Webhooks']
  },
  {
    name: 'IA Locale',
    techs: ['Nemotron', 'ChromaDB', 'OpenWebUI', 'Continue']
  }
]);

// Métriques ARKADIA
const metricsData = ref([
  { value: '150+', label: 'Membres actifs', icon: '👥', trend: '+1400%' },
  { value: '99.8%', label: 'Uptime mensuel', icon: '⚡', trend: 'Stable' },
  { value: '41', label: 'Mods gérés', icon: '🔧', trend: null },
  { value: '91%', label: 'Satisfaction', icon: '⭐', trend: '+12%' }
]);

// Timeline complète
const timelineData = ref([
  {
    year: '2020',
    title: 'AFORMAC',
    subtitle: 'Les fondations',
    content: `
      <p><strong>Certification Développeur Web & Mobile (RNCP Niveau 6)</strong></p>
      <p>Formation intensive Symfony, PHP orienté objet, méthodologies agiles.</p>
      <ul>
        <li>Maîtrise Symfony 5 (MVC, Doctrine, Twig)</li>
        <li>API REST avec API Platform</li>
        <li>Tests unitaires et fonctionnels</li>
      </ul>
    `
  },
  {
    year: '2024',
    title: 'Superdev (Stage)',
    subtitle: 'Premier projet professionnel',
    content: `
      <p><strong>Développeur WordPress - Site OVB (Association Ouvre-Boîtes)</strong></p>
      <p>Architecture WordPress moderne sans page builder.</p>
      <ul>
        <li>Timber (Twig templates) pour maintenabilité</li>
        <li>ACF pour flexibilité contenus</li>
        <li>Respect strict charte graphique client</li>
      </ul>
    `
  },
  {
    year: '2024-2025',
    title: 'ARKADIA FRANCE',
    subtitle: 'Le terrain de jeu',
    content: `
      <p><strong>Admin serveur ARK + Automatisation complète</strong></p>
      <p>Croissance 10 → 150 membres (1400%) en 1 an.</p>
      <ul>
        <li>Bots Discord custom (Python + Nitrado API)</li>
        <li>Workflows n8n (monitoring, backups, events)</li>
        <li>Économie serveur sophistiquée (KPIs trackés)</li>
        <li>Framework décisionnel IA (Matrice Arkadian)</li>
      </ul>
    `
  },
  {
    year: '2025',
    title: 'IMA GIE',
    subtitle: 'Expérience entreprise',
    content: `
      <p><strong>Développeur Full-Stack (Symfony/Vue)</strong></p>
      <p>Sortie durant probation (misalignement culturel).</p>
      <ul>
        <li>Développement features Symfony 7</li>
        <li>Intégration Vue.js composants dynamiques</li>
        <li>Workflow agile en équipe</li>
      </ul>
      <p class="timeline-note">Leçon : l'importance du fit culturel et de l'autonomie.</p>
    `
  },
  {
    year: '2026',
    title: 'GL Digital Lab',
    subtitle: 'Indépendance',
    content: `
      <p><strong>Launch agence web indépendante (29 janvier 2026)</strong></p>
      <p>Consulting Symfony/Vue + Intégration IA workflows.</p>
      <ul>
        <li>Cible : PME françaises modernisation tech</li>
        <li>Offres : Refonte web, Apps métier, Automatisation IA</li>
        <li>Positionnement : Expertise + IA praticien</li>
      </ul>
      <p class="timeline-note">Objectif Q1 2026 : 3 clients signés, 15k€ CA.</p>
    `
  }
]);

const scrollToTimeline = () => {
  timelineRef.value?.scrollIntoView({ behavior: 'smooth' });
};
</script>

<style scoped>
.gaming-to-dev { min-height: 100vh; }

/* Hero Section */
.hero {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: var(--space-xl) 0;
}

.hero__badge {
  display: inline-block;
  margin-bottom: var(--space-md);
  padding: 0.5rem 1rem;
  background: rgba(0, 255, 65, 0.1);
  border: 1px solid var(--matrix-green);
  border-radius: 20px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.875rem;
  color: var(--matrix-green);
}

.hero__title { 
  margin-bottom: var(--space-md);
  font-size: clamp(2rem, 5vw, 3.5rem);
  line-height: 1.2;
}

.hero__subtitle {
  font-size: clamp(1rem, 2vw, 1.25rem);
  color: var(--text-secondary);
  margin-bottom: var(--space-lg);
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
}

.hero__ctas {
  display: flex;
  gap: var(--space-md);
  justify-content: center;
  flex-wrap: wrap;
}

/* Stack Section */
.stack {
  padding: var(--space-xl) 0;
  background: rgba(0, 255, 65, 0.02);
  border-top: 1px solid var(--border-subtle);
  border-bottom: 1px solid var(--border-subtle);
}

.stack__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--space-lg);
  margin-top: var(--space-lg);
}

.stack__category {
  padding: var(--space-md);
  background: var(--card-bg);
  border: 1px solid var(--border-subtle);
  border-radius: 12px;
  transition: all var(--transition-base);
}

.stack__category:hover {
  border-color: var(--matrix-green);
  transform: translateY(-4px);
}

.stack__category-title {
  font-size: 1.125rem;
  color: var(--matrix-green);
  margin-bottom: var(--space-sm);
  font-family: 'JetBrains Mono', monospace;
}

.stack__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.stack__tag {
  padding: 0.25rem 0.75rem;
  background: rgba(0, 255, 65, 0.1);
  border: 1px solid rgba(0, 255, 65, 0.3);
  border-radius: 6px;
  font-size: 0.875rem;
  font-family: 'JetBrains Mono', monospace;
  color: var(--text-primary);
}

/* Metrics Section */
.metrics {
  padding: var(--space-xl) 0;
}

.metrics__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--space-md);
  margin-top: var(--space-lg);
}

.metrics__cta {
  text-align: center;
  margin-top: var(--space-xl);
}

/* Timeline Section */
.timeline { 
  padding: var(--space-xl) 0;
  background: rgba(0, 255, 65, 0.02);
  border-top: 1px solid var(--border-subtle);
}

.section-title {
  text-align: center;
  margin-bottom: var(--space-xl);
  color: var(--matrix-green);
  font-size: clamp(2rem, 4vw, 2.5rem);
}

.timeline-note {
  margin-top: var(--space-sm);
  padding: var(--space-sm);
  background: rgba(0, 255, 65, 0.05);
  border-left: 3px solid var(--matrix-green);
  font-size: 0.875rem;
  font-style: italic;
}

/* Final CTA Section */
.final-cta {
  padding: var(--space-xl) 0;
  text-align: center;
  background: linear-gradient(135deg, rgba(0, 255, 65, 0.05) 0%, rgba(0, 255, 65, 0.01) 100%);
}

.final-cta__content {
  max-width: 700px;
  margin: 0 auto;
}

.final-cta__title {
  font-size: clamp(1.75rem, 4vw, 2.5rem);
  margin-bottom: var(--space-md);
  color: var(--matrix-green);
}

.final-cta__text {
  font-size: 1.125rem;
  color: var(--text-secondary);
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

.btn--secondary {
  background: transparent;
  color: var(--matrix-green);
  border: 2px solid var(--matrix-green);
}

.btn--secondary:hover {
  background: var(--matrix-green);
  color: var(--code-dark);
}

.btn--outline {
  background: transparent;
  color: var(--matrix-green);
  border: 2px solid var(--matrix-green);
  padding: 0.75rem 1.5rem;
}

.btn--outline:hover {
  background: var(--matrix-green);
  color: var(--code-dark);
}

.btn--large {
  padding: 1rem 2rem;
  font-size: 1rem;
}

@media (max-width: 768px) {
  .hero__ctas {
    flex-direction: column;
    align-items: center;
  }
  
  .stack__grid {
    grid-template-columns: 1fr;
  }
  
  .metrics__grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
