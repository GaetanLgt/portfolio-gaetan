<template>
  <div class="stack-ia">
    <!-- Hero Section -->
    <section class="hero">
      <div class="container">
        <h1 class="hero__title">De ChatGPT à mon propre écosystème IA</h1>
        <h2 class="hero__subtitle">Timeline 2025 : construction stack IA locale complète</h2>
        <p class="hero__description">
          En 2025, j'ai décidé d'arrêter de dépendre du cloud pour mes workflows de dev.<br>
          Pas par idéologie. Par pragmatisme.
        </p>
      </div>
    </section>

    <!-- Timeline 2025 -->
    <section class="timeline">
      <div class="container">
        <h2 class="section-title">Timeline 2025</h2>
        
        <div class="timeline__items">
          <TimelineItem
            v-for="(item, index) in timelineData"
            :key="item.period"
            :year="item.period"
            :title="item.title"
            :subtitle="item.subtitle"
            :is-last="index === timelineData.length - 1"
          >
            <div v-html="item.content"></div>
          </TimelineItem>
        </div>
      </div>
    </section>

    <!-- Architecture actuelle -->
    <section class="architecture">
      <div class="container">
        <h2 class="section-title">Architecture actuelle</h2>
        
        <div class="architecture__schema">
          <div class="schema-box">
            <h3>STACK IA LOCALE 2025</h3>
            
            <div class="stack-layers">
              <div class="layer">
                <strong>Interface Dev</strong>
                <p>VS Code ←→ Continue ←→ Nemotron</p>
              </div>
              
              <div class="layer">
                <strong>Documentation & RAG</strong>
                <p>Obsidian → Zettelkasten → ChromaDB</p>
              </div>
              
              <div class="layer">
                <strong>Automatisation</strong>
                <p>n8n Workflows → Discord Bot → ARKADIA</p>
              </div>
              
              <div class="layer infrastructure">
                <strong>Infrastructure</strong>
                <p>🐳 Docker Compose</p>
                <p>💾 100% local</p>
                <p>⚡ &lt;500ms latence</p>
                <p>💰 0€/mois</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Pourquoi local ? -->
    <section class="pourquoi-local">
      <div class="container">
        <h2 class="section-title">Pourquoi local ?</h2>
        
        <div class="raisons-grid">
          <Card title="Contrôle total">
            <p><strong>Mes données restent chez moi</strong></p>
            <ul>
              <li>Pas de configs ARKADIA sur serveurs externes</li>
              <li>Pas de censure modèle</li>
              <li>Fine-tuning possible sur mes données</li>
            </ul>
          </Card>

          <Card title="Coûts prévisibles">
            <p><strong>0€/mois après setup</strong></p>
            <ul>
              <li>Setup initial : ~500€ hardware</li>
              <li>ChatGPT + Claude : ~40€/mois évités</li>
              <li>ROI en 12 mois</li>
            </ul>
          </Card>

          <Card title="Performance ciblée">
            <p><strong>Latence ultra-faible</strong></p>
            <ul>
              <li>Localhost : &lt;500ms moyenne</li>
              <li>API cloud : 2-5 secondes</li>
              <li>Optimisé pour MES use cases</li>
            </ul>
          </Card>
        </div>

        <div class="limites">
          <h3>Limites assumées</h3>
          <p>Pas de remplacement complet du cloud. Usage hybride optimal :</p>
          <ul>
            <li><strong>Local :</strong> Tâches répétitives, génération configs, résumés</li>
            <li><strong>Cloud :</strong> Raisonnement complexe, créativité pure, contexte ultra-long</li>
          </ul>
        </div>
      </div>
    </section>

    <!-- Transition -->
    <section class="transition">
      <div class="container">
        <div class="transition__content">
          <p>Ma stack IA locale c'est pas un dogme.</p>
          <p>C'est un outil stratégique pour contrôler mes données,</p>
          <p>réduire mes coûts, et optimiser ma latence.</p>
          <p class="transition__conclusion">
            Le cloud reste utile. Mais maintenant j'ai le choix.
          </p>
          <router-link to="/arkadia" class="transition__cta">
            → Voir l'application concrète : ARKADIA FRANCE
          </router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import Card from '@/components/common/Card.vue';
import TimelineItem from '@/components/common/TimelineItem.vue';

const timelineData = ref([
  {
    period: 'JAN-MAR',
    title: 'La frustration',
    subtitle: 'Le déclic initial',
    content: `
      <p><strong>Le problème :</strong> Je paye ChatGPT Plus + Claude. Limites de tokens. Temps d'attente. Coûts qui montent.</p>
      <p><strong>La question :</strong> "Et si je pouvais faire tourner ça localement ?"</p>
      <p><strong>Premiers tests :</strong></p>
      <ul>
        <li>Installation Ollama</li>
        <li>Llama 2 et Mistral</li>
        <li>Latence : quasi-instantanée</li>
        <li>Problème : Interface terminal pas pratique</li>
      </ul>
    `
  },
  {
    period: 'APR-JUN',
    title: 'Les fondations',
    subtitle: 'Stack de base',
    content: `
      <p><strong>Infrastructure déployée :</strong></p>
      <ul>
        <li><strong>Nemotron :</strong> LLM local performant (équivalent GPT-3.5)</li>
        <li><strong>OpenWebUI :</strong> Interface unifiée multi-modèles</li>
        <li><strong>Continue :</strong> Copilote VS Code</li>
      </ul>
      <p><strong>Use cases immédiats :</strong> Génération code Symfony, refactoring, debugging.</p>
      <p><strong>Apprentissage clé :</strong> Prompting modèles locaux ≠ GPT-4</p>
    `
  },
  {
    period: 'JUL-SEP',
    title: 'L\'infrastructure',
    subtitle: 'Automatisation complète',
    content: `
      <p><strong>Workflows n8n déployés :</strong></p>
      <ul>
        <li>Bot Discord ARKADIA (commandes IA)</li>
        <li>Résumés meetings communauté</li>
        <li>Génération configs serveur validées</li>
      </ul>
      <p><strong>ChromaDB + RAG :</strong></p>
      <ul>
        <li>Mes docs Obsidian indexés</li>
        <li>Nemotron répond avec MES données</li>
        <li>Fix incompatibilité Pydantic v1/v2</li>
      </ul>
    `
  },
  {
    period: 'OCT-DEC',
    title: 'Production',
    subtitle: 'Intégration totale',
    content: `
      <p><strong>Passage en production :</strong></p>
      <ul>
        <li>Pipeline GitHub + webhooks + OpenWebUI</li>
        <li>Zettelkasten Obsidian → RAG ChromaDB</li>
        <li>Système suivi distribué ARKADIA</li>
      </ul>
      <p><strong>Résultats mesurés :</strong></p>
      <ul>
        <li>Génération configs : 2-3s → &lt;500ms</li>
        <li>Économie : ~20€/mois</li>
        <li>Latence divisée par 4</li>
      </ul>
    `
  }
]);
</script>

<style scoped>
.stack-ia {
  min-height: 100vh;
  padding-top: 80px;
}

.hero {
  min-height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: var(--space-xl) 0;
}

.hero__title {
  margin-bottom: var(--space-sm);
}

.hero__subtitle {
  font-size: 1.5rem;
  color: var(--ark-blue);
  margin-bottom: var(--space-md);
}

.hero__description {
  font-size: 1.125rem;
  color: var(--text-secondary);
}

.timeline {
  padding: var(--space-xl) 0;
}

.section-title {
  text-align: center;
  margin-bottom: var(--space-xl);
  color: var(--matrix-green);
}

.architecture {
  padding: var(--space-xl) 0;
  background: linear-gradient(to bottom, transparent, rgba(0, 255, 65, 0.02));
}

.architecture__schema {
  max-width: 800px;
  margin: 0 auto;
}

.schema-box {
  background: var(--card-bg);
  border: 2px solid var(--matrix-green);
  border-radius: 12px;
  padding: var(--space-lg);
  backdrop-filter: blur(10px);
}

.schema-box h3 {
  text-align: center;
  color: var(--matrix-green);
  margin-bottom: var(--space-lg);
  font-size: 1.5rem;
}

.stack-layers {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.layer {
  background: rgba(13, 13, 13, 0.5);
  border: 1px solid var(--border-subtle);
  border-radius: 8px;
  padding: var(--space-md);
}

.layer strong {
  display: block;
  color: var(--ark-blue);
  margin-bottom: var(--space-xs);
  font-size: 1.125rem;
}

.layer p {
  color: var(--text-secondary);
  margin-bottom: var(--space-xs);
}

.layer.infrastructure {
  border-color: var(--matrix-green);
  background: rgba(0, 255, 65, 0.05);
}

.pourquoi-local {
  padding: var(--space-xl) 0;
}

.raisons-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--space-md);
  margin-bottom: var(--space-xl);
}

.raisons-grid ul {
  list-style: none;
  padding: 0;
  margin-top: var(--space-sm);
}

.raisons-grid li {
  padding-left: 1.5rem;
  position: relative;
  margin-bottom: var(--space-xs);
  color: var(--text-secondary);
  font-size: 0.875rem;
}

.raisons-grid li::before {
  content: '✓';
  position: absolute;
  left: 0;
  color: var(--matrix-green);
}

.limites {
  max-width: 800px;
  margin: 0 auto;
  background: var(--card-bg);
  border: 1px solid var(--border-subtle);
  border-radius: 12px;
  padding: var(--space-md);
}

.limites h3 {
  color: var(--ark-blue);
  margin-bottom: var(--space-sm);
}

.limites ul {
  margin-top: var(--space-sm);
}

.limites li {
  margin-bottom: var(--space-xs);
  color: var(--text-secondary);
}

.transition {
  padding: var(--space-xl) 0;
  text-align: center;
}

.transition__content p {
  font-size: 1.5rem;
  margin-bottom: var(--space-md);
  color: var(--text-primary);
}

.transition__conclusion {
  font-weight: 700;
  color: var(--matrix-green);
  margin-top: var(--space-lg);
  margin-bottom: var(--space-lg);
}

.transition__cta {
  display: inline-block;
  padding: 1rem 2rem;
  background: var(--matrix-green);
  color: var(--code-dark);
  font-family: 'JetBrains Mono', monospace;
  font-weight: 700;
  border-radius: 8px;
  transition: all var(--transition-base);
}

.transition__cta:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 255, 65, 0.4);
}
</style>
