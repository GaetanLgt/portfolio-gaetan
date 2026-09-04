<template>
  <div class="services-page">
    <!-- Hero -->
    <section class="page-hero">
      <div class="container">
        <span class="badge">Services</span>
        <h1 class="page-hero__title">Des solutions qui s'adaptent<br><span class="text-gradient">à vos ambitions</span></h1>
        <p class="page-hero__subtitle">
          Du site vitrine à l'application métier complexe, 
          avec toujours une touche d'automatisation intelligente.
        </p>
      </div>
    </section>

    <!-- Services Grid -->
    <section class="services section">
      <div class="container">
        <div class="services__list">
          <!-- STARTER -->
          <article class="service-block">
            <div class="service-block__header">
              <span class="service-block__icon">🚀</span>
              <div>
                <span class="badge">Starter</span>
                <h2 class="service-block__title">Refonte Web Moderne</h2>
              </div>
            </div>
            
            <p class="service-block__desc">
              Pour les PME qui veulent un site professionnel, rapide et maintenable.
              Fini les usines à gaz WordPress, place à une architecture propre.
            </p>
            
            <div class="service-block__details">
              <div class="service-block__meta">
                <div class="service-block__meta-item">
                  <span class="service-block__meta-label">Stack</span>
                  <span class="service-block__meta-value">Symfony 8 + Vue 3 + Vite</span>
                </div>
                <div class="service-block__meta-item">
                  <span class="service-block__meta-label">Délai</span>
                  <span class="service-block__meta-value">4-6 semaines</span>
                </div>
                <div class="service-block__meta-item">
                  <span class="service-block__meta-label">Prix</span>
                  <span class="service-block__meta-value highlight">8 000€ - 15 000€</span>
                </div>
              </div>
              
              <div class="service-block__features">
                <h4>Ce qui est inclus :</h4>
                <ul>
                  <li>Design responsive sur-mesure</li>
                  <li>CMS intégré (admin simple et intuitif)</li>
                  <li>SEO optimisé dès le départ</li>
                  <li>Performance Web Vitals (score 90+)</li>
                  <li>Formation + documentation technique</li>
                  <li>1 mois de support post-livraison</li>
                </ul>
              </div>
            </div>
            
            <router-link to="/contact" class="btn btn--primary">
              Demander un devis
            </router-link>
          </article>

          <!-- PRO -->
          <article class="service-block service-block--featured">
            <div class="service-block__badge-corner">Populaire</div>
            <div class="service-block__header">
              <span class="service-block__icon">⚙️</span>
              <div>
                <span class="badge">Pro</span>
                <h2 class="service-block__title">Application Métier Sur-Mesure</h2>
              </div>
            </div>
            
            <p class="service-block__desc">
              Pour les entreprises avec des processus métier complexes qui méritent 
              mieux qu'un tableur Excel ou un outil générique.
            </p>
            
            <div class="service-block__details">
              <div class="service-block__meta">
                <div class="service-block__meta-item">
                  <span class="service-block__meta-label">Stack</span>
                  <span class="service-block__meta-value">Symfony 8 + API Platform + Vue 3 + PostgreSQL</span>
                </div>
                <div class="service-block__meta-item">
                  <span class="service-block__meta-label">Délai</span>
                  <span class="service-block__meta-value">8-12 semaines</span>
                </div>
                <div class="service-block__meta-item">
                  <span class="service-block__meta-label">Prix</span>
                  <span class="service-block__meta-value highlight">15 000€ - 30 000€</span>
                </div>
              </div>
              
              <div class="service-block__features">
                <h4>Ce qui est inclus :</h4>
                <ul>
                  <li>CRM / ERP / Gestion custom</li>
                  <li>Dashboard temps réel</li>
                  <li>API REST documentée</li>
                  <li>Intégrations tierces (Stripe, email, etc.)</li>
                  <li>Authentification sécurisée (JWT/OAuth)</li>
                  <li>3 mois de support inclus</li>
                  <li>Évolutions futures facilitées</li>
                </ul>
              </div>
            </div>
            
            <router-link to="/contact" class="btn btn--primary">
              Demander un devis
            </router-link>
          </article>

          <!-- PREMIUM -->
          <article class="service-block">
            <div class="service-block__header">
              <span class="service-block__icon">🤖</span>
              <div>
                <span class="badge">Premium</span>
                <h2 class="service-block__title">Automatisation IA Complète</h2>
              </div>
            </div>
            
            <p class="service-block__desc">
              Pour les entreprises qui veulent scaler sans recruter. 
              Automatisez les tâches répétitives et libérez du temps pour ce qui compte.
            </p>
            
            <div class="service-block__details">
              <div class="service-block__meta">
                <div class="service-block__meta-item">
                  <span class="service-block__meta-label">Stack</span>
                  <span class="service-block__meta-value">n8n + Claude/GPT + Webhooks + Intégrations</span>
                </div>
                <div class="service-block__meta-item">
                  <span class="service-block__meta-label">Délai</span>
                  <span class="service-block__meta-value">6-10 semaines</span>
                </div>
                <div class="service-block__meta-item">
                  <span class="service-block__meta-label">Prix</span>
                  <span class="service-block__meta-value highlight">12 000€ - 25 000€</span>
                </div>
              </div>
              
              <div class="service-block__features">
                <h4>Ce qui est inclus :</h4>
                <ul>
                  <li>Audit de vos processus actuels</li>
                  <li>Workflows automatisés (emails, relances, reporting)</li>
                  <li>Chatbots IA contextuels</li>
                  <li>Extraction et traitement de données</li>
                  <li>Intégration outils existants</li>
                  <li>Formation équipe + documentation</li>
                  <li>Maintenance workflows incluse 3 mois</li>
                </ul>
              </div>
            </div>
            
            <router-link to="/contact" class="btn btn--primary">
              Demander un devis
            </router-link>
          </article>

          <!-- CONSULTING -->
          <article class="service-block service-block--alt">
            <div class="service-block__header">
              <span class="service-block__icon">💡</span>
              <div>
                <span class="badge">Consulting</span>
                <h2 class="service-block__title">Accompagnement Stratégique Tech</h2>
              </div>
            </div>
            
            <p class="service-block__desc">
              Pour les équipes qui ont besoin d'un regard expert ponctuel. 
              Audits, roadmaps, code reviews, mentoring.
            </p>
            
            <div class="service-block__details">
              <div class="service-block__meta">
                <div class="service-block__meta-item">
                  <span class="service-block__meta-label">Format</span>
                  <span class="service-block__meta-value">Journée ou forfait mensuel</span>
                </div>
                <div class="service-block__meta-item">
                  <span class="service-block__meta-label">Tarif journée</span>
                  <span class="service-block__meta-value highlight">800€ / jour</span>
                </div>
                <div class="service-block__meta-item">
                  <span class="service-block__meta-label">Tarif mensuel</span>
                  <span class="service-block__meta-value highlight">3 000€ / mois</span>
                </div>
              </div>
              
              <div class="service-block__features">
                <h4>Exemples d'interventions :</h4>
                <ul>
                  <li>Audit architecture existante</li>
                  <li>Définition roadmap technique</li>
                  <li>Code review & recommandations</li>
                  <li>Choix technologiques argumentés</li>
                  <li>Mentoring équipe junior</li>
                  <li>Mise en place CI/CD</li>
                </ul>
              </div>
            </div>
            
            <router-link to="/contact" class="btn btn--secondary">
              Réserver un appel découverte
            </router-link>
          </article>
        </div>
      </div>
    </section>

    <!-- FAQ -->
    <section class="faq section">
      <div class="container">
        <div class="section-header">
          <span class="badge section-header__badge">FAQ</span>
          <h2 class="section-header__title">Questions fréquentes</h2>
        </div>
        
        <div class="faq__list">
          <details v-for="(faq, index) in faqs" :key="index" class="faq__item">
            <summary class="faq__question">{{ faq.question }}</summary>
            <p class="faq__answer">{{ faq.answer }}</p>
          </details>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="cta section">
      <div class="container">
        <div class="cta__content">
          <h2 class="cta__title">Un projet en tête ?</h2>
          <p class="cta__text">
            Premier appel découverte gratuit. On discute de vos besoins, 
            je vous dis franchement si je peux vous aider.
          </p>
          <router-link to="/contact" class="btn btn--primary btn--lg">
            Parlons de votre projet
          </router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const faqs = ref([
  {
    question: 'Pourquoi Symfony plutôt que Laravel ?',
    answer: 'Symfony offre une architecture plus stricte et modulaire, idéale pour les applications métier complexes. Son écosystème (Doctrine, API Platform) est mature et les conventions facilitent la maintenance long terme. Laravel est excellent pour des projets plus simples, mais Symfony brille sur les projets enterprise.'
  },
  {
    question: 'Comment se passe un projet type ?',
    answer: 'Phase 1 : Cadrage et spécifications (1-2 semaines). Phase 2 : Design et validation UX. Phase 3 : Développement itératif avec points réguliers. Phase 4 : Tests et recette. Phase 5 : Déploiement et formation. Chaque étape est validée avant de passer à la suivante.'
  },
  {
    question: 'Travaillez-vous en remote ?',
    answer: 'Oui, 100% remote avec une disponibilité sur la Somme et les Hauts-de-France pour des réunions en présentiel si nécessaire. Communication quotidienne via Slack/Discord, points hebdomadaires en visio, démos régulières.'
  },
  {
    question: 'Quelles garanties après livraison ?',
    answer: 'Selon l\'offre : 1 à 3 mois de support inclus pour corriger tout bug. Au-delà, contrat de maintenance possible. Le code source vous appartient, documentation technique fournie, vous n\'êtes jamais dépendant de moi.'
  },
  {
    question: 'Acceptez-vous les projets en cours ?',
    answer: 'Oui, je peux reprendre un projet existant après un audit initial. Tarif consulting pour l\'audit, puis devis pour les évolutions. Attention : certains projets sont parfois plus coûteux à reprendre qu\'à refaire proprement.'
  }
]);
</script>

<style scoped>
/* Page Hero */
.page-hero {
  padding: var(--space-32) 0 var(--space-16);
  text-align: center;
  background: var(--gradient-hero);
}

.page-hero__title {
  margin: var(--space-4) 0;
}

.page-hero__subtitle {
  font-size: var(--text-xl);
  color: var(--text-secondary);
  max-width: 600px;
  margin: 0 auto;
}

/* Services */
.services__list {
  display: flex;
  flex-direction: column;
  gap: var(--space-8);
}

.service-block {
  position: relative;
  background: var(--bg-card);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-xl);
  padding: var(--space-8);
  transition: all var(--transition-base);
}

.service-block:hover {
  border-color: var(--border-active);
}

.service-block--featured {
  border-color: var(--accent-primary);
  box-shadow: var(--shadow-glow);
}

.service-block--alt {
  background: linear-gradient(135deg, var(--bg-card) 0%, rgba(139, 92, 246, 0.05) 100%);
}

.service-block__badge-corner {
  position: absolute;
  top: var(--space-4);
  right: var(--space-4);
  padding: var(--space-1) var(--space-3);
  background: var(--accent-primary);
  color: var(--bg-primary);
  font-size: var(--text-xs);
  font-weight: 600;
  border-radius: var(--radius-full);
}

.service-block__header {
  display: flex;
  align-items: flex-start;
  gap: var(--space-4);
  margin-bottom: var(--space-4);
}

.service-block__icon {
  font-size: 3rem;
}

.service-block__title {
  font-size: var(--text-2xl);
  margin-top: var(--space-2);
}

.service-block__desc {
  font-size: var(--text-base);
  margin-bottom: var(--space-6);
  max-width: 800px;
}

.service-block__details {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-8);
  margin-bottom: var(--space-6);
}

@media (max-width: 768px) {
  .service-block__details {
    grid-template-columns: 1fr;
  }
}

.service-block__meta {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.service-block__meta-item {
  display: flex;
  justify-content: space-between;
  padding: var(--space-3);
  background: var(--bg-elevated);
  border-radius: var(--radius-md);
}

.service-block__meta-label {
  font-size: var(--text-sm);
  color: var(--text-muted);
}

.service-block__meta-value {
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  color: var(--text-secondary);
}

.service-block__meta-value.highlight {
  color: var(--accent-primary);
  font-weight: 600;
}

.service-block__features h4 {
  font-size: var(--text-sm);
  color: var(--text-muted);
  margin-bottom: var(--space-3);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.service-block__features ul {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.service-block__features li {
  position: relative;
  padding-left: var(--space-6);
  font-size: var(--text-sm);
  color: var(--text-secondary);
}

.service-block__features li::before {
  content: '✓';
  position: absolute;
  left: 0;
  color: var(--accent-primary);
  font-weight: 600;
}

/* FAQ */
.faq__list {
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.faq__item {
  background: var(--bg-card);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.faq__item[open] {
  border-color: var(--border-active);
}

.faq__question {
  padding: var(--space-5) var(--space-6);
  cursor: pointer;
  font-weight: 500;
  color: var(--text-primary);
  list-style: none;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.faq__question::-webkit-details-marker {
  display: none;
}

.faq__question::after {
  content: '+';
  font-size: var(--text-xl);
  color: var(--accent-primary);
  transition: transform var(--transition-fast);
}

.faq__item[open] .faq__question::after {
  transform: rotate(45deg);
}

.faq__answer {
  padding: 0 var(--space-6) var(--space-5);
  font-size: var(--text-sm);
  color: var(--text-secondary);
  line-height: 1.7;
}

/* CTA */
.cta {
  background: linear-gradient(180deg, var(--bg-primary) 0%, var(--bg-secondary) 100%);
  border-top: 1px solid var(--border-subtle);
}

.cta__content {
  text-align: center;
  max-width: 600px;
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
</style>
