<template>
  <section class="view-production">
    <div class="production-header">
      <h2>🎬 Comment votre site est produit</h2>
      <p>Suivez le parcours d'une demande à travers GL Tower — de la réception à la mise en ligne</p>
    </div>

    <!-- Pipeline -->
    <div class="production-pipeline">
      <div class="pipeline-track">
        <div 
          v-for="(step, index) in pipelineSteps" 
          :key="step.id"
          class="pipeline-step"
          :class="{ active: pipelineStep >= index, current: pipelineStep === index }"
        >
          <div class="step-node" :class="{ final: index === pipelineSteps.length - 1 }">
            <div class="node-icon">{{ step.icon }}</div>
            <div class="node-pulse" v-if="pipelineStep === index"></div>
          </div>
          
          <div class="step-content">
            <h4>{{ step.title }}</h4>
            <p>{{ step.description }}</p>
            <div class="step-agents">
              <span 
                v-for="agent in step.agents" 
                :key="agent.id"
                class="agent-chip"
                :style="{ '--chip-color': agent.color }"
              >
                {{ agent.avatar }} {{ agent.name }}
              </span>
            </div>
          </div>
          
          <div class="step-connector" v-if="index < pipelineSteps.length - 1"></div>
        </div>
      </div>

      <!-- Controls -->
      <div class="pipeline-controls">
        <button class="control-btn" @click="$emit('reset')">
          <span>⏮️</span> Reset
        </button>
        <button class="control-btn control-btn--play" @click="$emit('play')" :disabled="pipelineRunning">
          <span>{{ pipelineRunning ? '⏸️' : '▶️' }}</span>
          {{ pipelineRunning ? 'En cours...' : 'Simuler' }}
        </button>
        <button class="control-btn" @click="$emit('complete')">
          <span>⏭️</span> Complet
        </button>
      </div>
    </div>

    <!-- Stats -->
    <div class="production-stats">
      <div class="prod-stat">
        <span class="stat-icon">🤖</span>
        <span class="stat-value">{{ equipageCount }}</span>
        <span class="stat-label">Agents mobilisés</span>
      </div>
      <div class="prod-stat">
        <span class="stat-icon">⚡</span>
        <span class="stat-value">{{ workflowStats.active }}</span>
        <span class="stat-label">Workflows actifs</span>
      </div>
      <div class="prod-stat">
        <span class="stat-icon">🇫🇷</span>
        <span class="stat-value">100%</span>
        <span class="stat-label">Souverain</span>
      </div>
    </div>

    <!-- CTA -->
    <div class="production-cta">
      <h3>Prêt à lancer votre projet ?</h3>
      <p>Réservez un audit gratuit de 30 minutes pour discuter de vos besoins.</p>
      <router-link to="/contact" class="cta-button">
        <span>📞</span> Réserver un audit gratuit
      </router-link>
    </div>
  </section>
</template>

<script setup>
import { agents, getAgentById, getWorkflowStats } from '@/data/agents';

defineProps({
  pipelineStep: { type: Number, default: -1 },
  pipelineRunning: { type: Boolean, default: false }
});

defineEmits(['reset', 'play', 'complete']);

// Étapes du pipeline : chaque étape référence les Lois par leur id réel (agents.js).
// Les chips sont résolus depuis la data — un seul point de vérité, aucun doublon.
const steps = [
  {
    id: 'reception',
    icon: '📥',
    title: '1. Réception',
    description: 'Votre demande arrive et est dispatchée par la coordinatrice de l\'équipage',
    agentIds: ['wa']
  },
  {
    id: 'analyse',
    icon: '🔍',
    title: '2. Analyse & Recherche',
    description: 'Étude du contexte et recherche de solutions dans la base de connaissance',
    agentIds: ['watashi']
  },
  {
    id: 'strategie',
    icon: '📋',
    title: '3. Stratégie & Cadrage',
    description: 'Cadrage de l\'architecture, des priorités et des objectifs',
    agentIds: ['wa']
  },
  {
    id: 'design',
    icon: '🎨',
    title: '4. Design & UX',
    description: 'Création des maquettes, wireframes et prototypes',
    agentIds: ['bi']
  },
  {
    id: 'dev',
    icon: '💻',
    title: '5. Développement',
    description: 'Frontend Vue 3 + Backend Symfony',
    agentIds: ['bi', 'jitsu']
  },
  {
    id: 'tests',
    icon: '🧪',
    title: '6. Tests & QA',
    description: 'Tests unitaires, intégration, E2E et couverture',
    agentIds: ['makoto']
  },
  {
    id: 'securite',
    icon: '🛡️',
    title: '7. Sécurité & Audit',
    description: 'Scan des vulnérabilités, conformité OWASP, gestion des secrets',
    agentIds: ['makoto']
  },
  {
    id: 'deploy',
    icon: '🚀',
    title: '8. Déploiement',
    description: 'Pipeline CI/CD, mise en production sans downtime',
    agentIds: ['jitsu']
  },
  {
    id: 'monitoring',
    icon: '📊',
    title: '9. Monitoring 24/7',
    description: 'Surveillance continue, alertes et métriques',
    agentIds: ['dou']
  },
  {
    id: 'support',
    icon: '✅',
    title: '10. Support & Évolution',
    description: 'Maintenance, support et améliorations continues',
    agentIds: ['watashi', 'dou']
  }
];

const pipelineSteps = steps.map(step => ({
  ...step,
  agents: step.agentIds
    .map(id => getAgentById(id))
    .filter(Boolean)
    .map(agent => ({ id: agent.id, avatar: agent.avatar, name: agent.roman, color: agent.color }))
}));

// Métriques réelles, dérivées des données — jamais en dur.
const equipageCount = agents.filter(agent => !agent.isLobby).length;
const workflowStats = getWorkflowStats();
</script>

<style scoped>
.view-production { padding: 2rem; max-width: 1000px; margin: 0 auto; }

.production-header { text-align: center; margin-bottom: 3rem; }
.production-header h2 { font-size: 2rem; margin-bottom: 0.5rem; }
.production-header p { color: #888; max-width: 500px; margin: 0 auto; }

.production-pipeline { margin-bottom: 3rem; }

.pipeline-track { display: flex; flex-direction: column; }

.pipeline-step { display: flex; gap: 1.5rem; padding: 1.25rem 0; position: relative; opacity: 0.3; transition: all 0.5s ease; }
.pipeline-step.active { opacity: 1; }
.pipeline-step.current { opacity: 1; }

.step-node { position: relative; width: 55px; height: 55px; display: flex; align-items: center; justify-content: center; background: rgba(20,20,40,0.8); border: 2px solid rgba(255,255,255,0.1); border-radius: 50%; flex-shrink: 0; z-index: 2; transition: all 0.3s; }
.pipeline-step.active .step-node { border-color: #10B981; background: rgba(16,185,129,0.1); }
.step-node.final { background: linear-gradient(135deg, #10B981, #059669) !important; border-color: #10B981 !important; }
.node-icon { font-size: 1.5rem; }
.node-pulse { position: absolute; inset: -8px; border: 2px solid #10B981; border-radius: 50%; animation: pulse 2s ease-out infinite; }
@keyframes pulse { 0% { transform: scale(1); opacity: 0.8; } 100% { transform: scale(1.5); opacity: 0; } }

.step-connector { position: absolute; left: 26px; top: 65px; width: 2px; height: calc(100% - 20px); background: rgba(255,255,255,0.1); }
.pipeline-step.active .step-connector { background: linear-gradient(to bottom, #10B981, rgba(16,185,129,0.2)); }

.step-content { flex: 1; }
.step-content h4 { font-size: 1rem; color: #fff; margin-bottom: 0.25rem; }
.step-content p { font-size: 0.85rem; color: #888; margin-bottom: 0.75rem; }

.step-agents { display: flex; flex-wrap: wrap; gap: 0.5rem; }
.agent-chip { display: inline-flex; align-items: center; gap: 0.3rem; padding: 0.3rem 0.6rem; background: rgba(255,255,255,0.03); border: 1px solid var(--chip-color); border-radius: 2rem; font-size: 0.7rem; color: var(--chip-color); }

.pipeline-controls { display: flex; justify-content: center; gap: 1rem; margin-top: 2rem; }
.control-btn { display: flex; align-items: center; gap: 0.5rem; padding: 0.75rem 1.5rem; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); border-radius: 0.5rem; color: #888; font-size: 0.85rem; cursor: pointer; transition: all 0.3s; }
.control-btn:hover:not(:disabled) { background: rgba(255,255,255,0.05); color: #fff; }
.control-btn:disabled { opacity: 0.5; cursor: not-allowed; }
.control-btn--play { background: rgba(16,185,129,0.1); border-color: #10B981; color: #10B981; }
.control-btn--play:hover:not(:disabled) { background: #10B981; color: #000; }

.production-stats { display: flex; justify-content: center; gap: 2rem; padding: 1.5rem; background: rgba(255,255,255,0.02); border-radius: 1rem; margin-bottom: 3rem; flex-wrap: wrap; }
.prod-stat { text-align: center; min-width: 100px; }
.stat-icon { display: block; font-size: 1.5rem; margin-bottom: 0.25rem; }
.stat-value { display: block; font-family: 'JetBrains Mono', monospace; font-size: 1.25rem; font-weight: 700; color: #fff; }
.stat-label { font-size: 0.7rem; color: #666; }

.production-cta { text-align: center; padding: 2.5rem; background: linear-gradient(135deg, rgba(16,185,129,0.1), rgba(6,182,212,0.05)); border: 1px solid rgba(16,185,129,0.2); border-radius: 1rem; }
.production-cta h3 { font-size: 1.5rem; margin-bottom: 0.5rem; }
.production-cta p { color: #888; margin-bottom: 1.5rem; }
.cta-button { display: inline-flex; align-items: center; gap: 0.5rem; padding: 1rem 2rem; background: linear-gradient(135deg, #10B981, #059669); border-radius: 0.5rem; color: #000; font-size: 1rem; font-weight: 600; text-decoration: none; transition: all 0.3s; }
.cta-button:hover { transform: translateY(-2px); box-shadow: 0 15px 30px rgba(16,185,129,0.3); }

@media (max-width: 600px) {
  .pipeline-step { flex-direction: column; align-items: center; text-align: center; }
  .step-connector { display: none; }
  .step-agents { justify-content: center; }
  .production-stats { gap: 1rem; }
}
</style>
