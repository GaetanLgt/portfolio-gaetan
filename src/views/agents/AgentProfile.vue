<template>
  <div class="agent-profile" v-if="agent" :style="{ '--agent-color': agent.color, '--agent-rgb': agent.colorRgb }">
    <!-- Back Navigation -->
    <nav class="profile-nav">
      <div class="container">
        <router-link to="/agents" class="nav-back">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
          </svg>
          GL Tower
        </router-link>
        
        <div class="nav-info">
          <span class="nav-level">{{ agent.level === 'Penthouse' ? '🏠 Penthouse' : `Niveau ${agent.level}` }}</span>
          <div class="nav-status" :class="`status--${agent.status}`">
            <span class="status-dot"></span>
            <span>{{ getStatusLabel(agent.status) }}</span>
          </div>
        </div>
      </div>
    </nav>
    
    <!-- Hero Section -->
    <header class="profile-hero">
      <div class="container">
        <div class="hero-content">
          <!-- Avatar -->
          <div class="hero-avatar">
            <span class="avatar-emoji">{{ agent.avatar }}</span>
            <div class="avatar-ring"></div>
            <div class="avatar-glow"></div>
          </div>
          
          <!-- Identity -->
          <div class="hero-identity">
            <span class="agent-codename">{{ agent.codename }}</span>
            <h1 class="agent-name">{{ agent.name }}</h1>
            <p class="agent-fullname">{{ agent.fullName }}</p>
            <p class="agent-role">{{ agent.role }}</p>
          </div>
          
          <!-- Description -->
          <p class="hero-description">{{ agent.description }}</p>
          
          <!-- Personality & Voice -->
          <div class="hero-tags">
            <div class="personality-tag glass">
              <span class="tag-icon">🎭</span>
              <span class="tag-label">Personnalité</span>
              <span class="tag-text">{{ agent.personality }}</span>
            </div>
            <div class="personality-tag glass">
              <span class="tag-icon">🎙️</span>
              <span class="tag-label">Voix</span>
              <span class="tag-text">{{ agent.voice }}</span>
            </div>
            <div class="personality-tag glass">
              <span class="tag-icon">🎬</span>
              <span class="tag-label">Inspiration</span>
              <span class="tag-text">{{ agent.inspiration }}</span>
            </div>
          </div>
          
          <!-- Catchphrase -->
          <blockquote class="hero-catchphrase">
            "{{ agent.communication.catchphrase }}"
          </blockquote>
        </div>
      </div>
    </header>
    
    <!-- Mission Section -->
    <section class="profile-section mission-section" aria-labelledby="mission-title">
      <div class="container">
        <div class="section-header">
          <span class="mono-tag" aria-hidden="true">/// MISSION</span>
          <h2 id="mission-title">Objectif Principal</h2>
        </div>
        
        <div class="mission-content glass">
          <div class="mission-statement">
            <span class="mission-icon">🎯</span>
            <p>{{ agent.mission }}</p>
          </div>
          
          <div class="objectives">
            <h3>Objectifs</h3>
            <ul class="objectives-list">
              <li v-for="(obj, i) in agent.objectives" :key="i">
                <span class="obj-number">{{ String(i + 1).padStart(2, '0') }}</span>
                <span class="obj-text">{{ obj }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
    
    <!-- System Prompt Section -->
    <section class="profile-section prompt-section" aria-labelledby="prompt-title">
      <div class="container">
        <div class="section-header">
          <span class="mono-tag" aria-hidden="true">/// SYSTEM PROMPT</span>
          <h2 id="prompt-title">Instructions IA</h2>
        </div>
        
        <div class="prompt-content glass">
          <div class="prompt-header">
            <span class="prompt-icon">🧠</span>
            <span class="prompt-label">Prompt système qui définit {{ agent.name }}</span>
            <button class="copy-btn" @click="copyPrompt" :class="{ copied: promptCopied }">
              {{ promptCopied ? '✓ Copié' : '📋 Copier' }}
            </button>
          </div>
          <pre class="prompt-code"><code>{{ agent.systemPrompt }}</code></pre>
        </div>
      </div>
    </section>
    
    <!-- Capabilities Section -->
    <section class="profile-section capabilities-section" aria-labelledby="cap-title">
      <div class="container">
        <div class="section-header">
          <span class="mono-tag" aria-hidden="true">/// CAPACITÉS</span>
          <h2 id="cap-title">Compétences</h2>
        </div>
        
        <div class="capabilities-grid">
          <div v-for="cap in agent.capabilities" :key="cap.name" class="capability-card glass">
            <div class="cap-header">
              <span class="cap-name">{{ cap.name }}</span>
              <span class="cap-level">{{ cap.level }}%</span>
            </div>
            <div class="cap-bar">
              <div class="cap-fill" :style="{ width: cap.level + '%' }"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
    
    <!-- Tools Section -->
    <section class="profile-section tools-section" aria-labelledby="tools-title">
      <div class="container">
        <div class="section-header">
          <span class="mono-tag" aria-hidden="true">/// OUTILS</span>
          <h2 id="tools-title">Stack & Intégrations</h2>
        </div>
        
        <div class="tools-grid">
          <div v-for="tool in agent.tools" :key="tool.name" class="tool-card glass" :class="{ 'tool--inactive': tool.status !== 'active' }">
            <span class="tool-icon">{{ tool.icon }}</span>
            <div class="tool-info">
              <span class="tool-name">{{ tool.name }}</span>
              <span class="tool-desc">{{ tool.description }}</span>
            </div>
            <span class="tool-status" :class="`tool-status--${tool.status}`">
              {{ tool.status === 'active' ? '● Actif' : '○ Standby' }}
            </span>
          </div>
        </div>
      </div>
    </section>
    
    <!-- Processes Section -->
    <section class="profile-section processes-section" aria-labelledby="process-title">
      <div class="container">
        <div class="section-header">
          <span class="mono-tag" aria-hidden="true">/// PROCESSUS</span>
          <h2 id="process-title">Processus Métier</h2>
        </div>
        
        <div class="processes-list">
          <article v-for="(process, i) in agent.processes" :key="i" class="process-card glass">
            <div class="process-header">
              <span class="process-number">{{ String(i + 1).padStart(2, '0') }}</span>
              <h3 class="process-name">{{ process.name }}</h3>
            </div>
            
            <div class="process-trigger">
              <span class="trigger-label">⚡ Trigger</span>
              <span class="trigger-value">{{ process.trigger }}</span>
            </div>
            
            <div class="process-flow">
              <span class="flow-label">🔄 Flow</span>
              <div class="steps-pipeline">
                <span v-for="(step, j) in process.steps" :key="j" class="step-item">
                  {{ step }}
                  <span v-if="j < process.steps.length - 1" class="step-arrow">→</span>
                </span>
              </div>
            </div>
            
            <div class="process-output">
              <span class="output-label">📤 Output</span>
              <span class="output-value">{{ process.output }}</span>
            </div>
          </article>
        </div>
      </div>
    </section>
    
    <!-- Workflows n8n Section -->
    <section v-if="agent.workflows && agent.workflows.length" class="profile-section workflows-section" aria-labelledby="workflows-title">
      <div class="container">
        <div class="section-header">
          <span class="mono-tag" aria-hidden="true">/// WORKFLOWS N8N</span>
          <h2 id="workflows-title">Automatisations</h2>
          <p class="section-desc">
            {{ agent.workflows.length }} workflows • 
            {{ agent.workflows.filter(w => w.status === 'active').length }} actifs
          </p>
        </div>
        
        <!-- Group by Capability -->
        <div v-for="(group, capability) in workflowsByCapability" :key="capability" class="workflow-group">
          <h3 class="workflow-group-title">
            <span class="group-icon">⚙️</span>
            {{ capability }}
            <span class="group-count">{{ group.length }}</span>
          </h3>
          
          <div class="workflows-grid">
            <article v-for="wf in group" :key="wf.id" class="workflow-card glass" :class="{ 'workflow--standby': wf.status === 'standby' }">
              <div class="workflow-header">
                <div class="workflow-status" :class="`wf-status--${wf.status}`">
                  <span class="wf-dot"></span>
                  {{ wf.status === 'active' ? 'Actif' : 'Standby' }}
                </div>
                <span class="workflow-freq">{{ wf.frequency }}</span>
              </div>
              
              <h4 class="workflow-name">{{ wf.name }}</h4>
              <p class="workflow-desc">{{ wf.description }}</p>
              
              <div class="workflow-trigger">
                <span class="wf-label">⚡ Trigger</span>
                <span class="wf-value">{{ wf.trigger }}</span>
              </div>
              
              <div class="workflow-nodes">
                <span class="wf-label">🔗 Nodes</span>
                <div class="nodes-list">
                  <span v-for="(node, i) in wf.nodes" :key="i" class="node-chip">
                    {{ node }}
                  </span>
                </div>
              </div>
              
              <div class="workflow-id">
                <code>{{ wf.id }}</code>
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>
    
    <!-- Metrics Section -->
    <section class="profile-section metrics-section" aria-labelledby="metrics-title">
      <div class="container">
        <div class="section-header">
          <span class="mono-tag" aria-hidden="true">/// MÉTRIQUES</span>
          <h2 id="metrics-title">Performance</h2>
        </div>
        
        <div class="metrics-grid">
          <div v-for="(value, key) in agent.metrics" :key="key" class="metric-card glass">
            <span class="metric-value">{{ value }}</span>
            <span class="metric-label">{{ formatMetricLabel(key) }}</span>
          </div>
        </div>
      </div>
    </section>
    
    <!-- Communication Section -->
    <section class="profile-section comm-section" aria-labelledby="comm-title">
      <div class="container">
        <div class="section-header">
          <span class="mono-tag" aria-hidden="true">/// COMMUNICATION</span>
          <h2 id="comm-title">Style & Format</h2>
        </div>
        
        <div class="comm-grid">
          <div class="comm-card glass">
            <span class="comm-icon">💬</span>
            <span class="comm-label">Style</span>
            <p class="comm-value">{{ agent.communication.style }}</p>
          </div>
          <div class="comm-card glass">
            <span class="comm-icon">📄</span>
            <span class="comm-label">Format</span>
            <p class="comm-value">{{ agent.communication.format }}</p>
          </div>
          <div class="comm-card glass">
            <span class="comm-icon">🌍</span>
            <span class="comm-label">Langue</span>
            <p class="comm-value">{{ agent.communication.language }}</p>
          </div>
        </div>
      </div>
    </section>
    
    <!-- Navigation Footer -->
    <nav class="profile-footer" aria-label="Navigation agents">
      <div class="container">
        <router-link v-if="prevAgent" :to="`/agents/${prevAgent.id}`" class="nav-agent nav-prev" :style="{ '--nav-color': prevAgent.color }">
          <span class="nav-direction">← Précédent</span>
          <span class="nav-name">{{ prevAgent.name }}</span>
        </router-link>
        
        <router-link to="/agents" class="nav-hub">
          🏢 GL Tower
        </router-link>
        
        <router-link v-if="nextAgent" :to="`/agents/${nextAgent.id}`" class="nav-agent nav-next" :style="{ '--nav-color': nextAgent.color }">
          <span class="nav-direction">Suivant →</span>
          <span class="nav-name">{{ nextAgent.name }}</span>
        </router-link>
      </div>
    </nav>
  </div>
  
  <!-- 404 -->
  <div v-else class="agent-not-found">
    <div class="container">
      <span class="not-found-icon">🔍</span>
      <h1>Agent non trouvé</h1>
      <p>Cet agent n'existe pas dans GL Tower.</p>
      <router-link to="/agents" class="btn-primary">Retour au Bureau</router-link>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';
import { agents, getAgentById, agentStatuses } from '@/data/agents';

const route = useRoute();

// Current agent
const agent = computed(() => getAgentById(route.params.id));

// Navigation
const currentIndex = computed(() => agents.findIndex(a => a.id === route.params.id));
const prevAgent = computed(() => currentIndex.value > 0 ? agents[currentIndex.value - 1] : null);
const nextAgent = computed(() => currentIndex.value < agents.length - 1 ? agents[currentIndex.value + 1] : null);

// Copy prompt
const promptCopied = ref(false);
const copyPrompt = async () => {
  if (agent.value?.systemPrompt) {
    await navigator.clipboard.writeText(agent.value.systemPrompt);
    promptCopied.value = true;
    setTimeout(() => promptCopied.value = false, 2000);
  }
};

// Workflows groupés par capability
const workflowsByCapability = computed(() => {
  if (!agent.value?.workflows) return {};
  
  return agent.value.workflows.reduce((groups, wf) => {
    const cap = wf.capability || 'Général';
    if (!groups[cap]) groups[cap] = [];
    groups[cap].push(wf);
    return groups;
  }, {});
});

// Helpers
const getStatusLabel = (status) => agentStatuses[status]?.label || status;

const formatMetricLabel = (key) => {
  const labels = {
    routingAccuracy: 'Précision routing',
    avgResponseTime: 'Temps réponse',
    agentsCoordinated: 'Agents coordonnés',
    dailyRequests: 'Requêtes/jour',
    vulnerabilitiesDetected: 'Vulnérabilités détectées',
    mttd: 'MTTD',
    secretsManaged: 'Secrets gérés',
    uptime: 'Uptime',
    deploySuccessRate: 'Succès déploiement',
    avgDeployTime: 'Temps déploiement',
    rollbacksThisMonth: 'Rollbacks ce mois',
    servicesMonitored: 'Services surveillés',
    avgAlertTime: 'Temps alerte',
    falsePositiveRate: 'Faux positifs',
    postsGenerated: 'Posts générés',
    avgEngagement: 'Engagement moyen',
    newsletterOpenRate: 'Taux ouverture',
    membersOnboarded: 'Membres onboardés',
    ticketsResolved: 'Tickets résolus',
    communityHealth: 'Santé communauté',
    ticketsHandled: 'Tickets traités',
    resolutionRate: 'Taux résolution',
    escalationRate: 'Taux escalade'
  };
  return labels[key] || key;
};
</script>

<style scoped>
.agent-profile {
  min-height: 100vh;
}

/* Navigation */
.profile-nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  padding: 1rem 0;
  background: rgba(10, 10, 15, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--border);
}

.profile-nav .container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-back {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.8rem;
  color: var(--text-muted);
  text-decoration: none;
  transition: color 0.3s ease;
}

.nav-back:hover {
  color: var(--agent-color);
}

.nav-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.nav-level {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.75rem;
  color: var(--agent-color);
}

.nav-status {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0.75rem;
  border-radius: 2rem;
  font-size: 0.7rem;
  font-family: 'JetBrains Mono', monospace;
}

.status--active {
  background: rgba(16, 185, 129, 0.1);
  color: #10B981;
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

/* Hero */
.profile-hero {
  padding: calc(80px + var(--space-xl)) 0 var(--space-xl);
  text-align: center;
  position: relative;
  overflow: hidden;
}

.profile-hero::before {
  content: '';
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 800px;
  height: 800px;
  background: radial-gradient(circle, rgba(var(--agent-rgb), 0.15) 0%, transparent 60%);
  pointer-events: none;
}

.hero-content {
  position: relative;
  z-index: 1;
  max-width: 800px;
  margin: 0 auto;
}

.hero-avatar {
  position: relative;
  width: 140px;
  height: 140px;
  margin: 0 auto 2rem;
}

.avatar-emoji {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 5rem;
  z-index: 2;
}

.avatar-ring {
  position: absolute;
  inset: 0;
  border: 3px solid var(--agent-color);
  border-radius: 50%;
  animation: ringRotate 15s linear infinite;
}

.avatar-glow {
  position: absolute;
  inset: -20px;
  background: radial-gradient(circle, rgba(var(--agent-rgb), 0.4) 0%, transparent 60%);
  border-radius: 50%;
  animation: glowPulse 4s ease-in-out infinite;
}

@keyframes ringRotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes glowPulse {
  0%, 100% { opacity: 0.5; transform: scale(1); }
  50% { opacity: 0.8; transform: scale(1.15); }
}

.hero-identity {
  margin-bottom: 1.5rem;
}

.agent-codename {
  display: inline-block;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.7rem;
  color: var(--agent-color);
  letter-spacing: 0.2em;
  padding: 0.25rem 0.75rem;
  background: rgba(var(--agent-rgb), 0.1);
  border: 1px solid rgba(var(--agent-rgb), 0.3);
  border-radius: 2rem;
  margin-bottom: 1rem;
}

.agent-name {
  font-size: clamp(2.5rem, 6vw, 4.5rem);
  font-weight: 700;
  margin-bottom: 0.25rem;
  background: linear-gradient(135deg, #fff, var(--agent-color));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.agent-fullname {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.75rem;
  color: var(--text-muted);
  margin-bottom: 0.5rem;
}

.agent-role {
  font-size: 1.25rem;
  color: var(--agent-color);
  font-weight: 500;
}

.hero-description {
  font-size: 1.1rem;
  color: var(--text-muted);
  line-height: 1.7;
  margin-bottom: 2rem;
}

.hero-tags {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.personality-tag {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  padding: 1rem 1.5rem;
  border-radius: 1rem;
  border: 1px solid var(--border);
  min-width: 180px;
}

.tag-icon {
  font-size: 1.5rem;
}

.tag-label {
  font-size: 0.65rem;
  color: var(--agent-color);
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.tag-text {
  font-size: 0.8rem;
  color: var(--text-muted);
  text-align: center;
}

.hero-catchphrase {
  font-size: 1.25rem;
  font-style: italic;
  color: var(--agent-color);
  margin: 0;
  padding: 1.5rem;
  border-left: 3px solid var(--agent-color);
  background: rgba(var(--agent-rgb), 0.05);
  border-radius: 0 1rem 1rem 0;
  display: inline-block;
}

/* Sections */
.profile-section {
  padding: var(--space-xl) 0;
}

.profile-section:nth-child(even) {
  background: rgba(255, 255, 255, 0.01);
}

.section-header {
  margin-bottom: var(--space-lg);
}

.mono-tag {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.7rem;
  color: var(--agent-color);
  letter-spacing: 0.1em;
}

.section-header h2 {
  font-size: 1.75rem;
  font-weight: 700;
  margin-top: 0.5rem;
}

/* Mission */
.mission-content {
  padding: var(--space-lg);
  border-radius: 1rem;
  border: 1px solid var(--border);
}

.mission-statement {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding-bottom: var(--space-md);
  border-bottom: 1px solid var(--border);
  margin-bottom: var(--space-md);
}

.mission-icon {
  font-size: 2.5rem;
}

.mission-statement p {
  font-size: 1.15rem;
  line-height: 1.7;
}

.objectives h3 {
  font-size: 0.9rem;
  color: var(--text-muted);
  margin-bottom: 1rem;
}

.objectives-list {
  list-style: none;
  padding: 0;
  display: grid;
  gap: 0.75rem;
}

.objectives-list li {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.obj-number {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.7rem;
  color: var(--agent-color);
  padding: 0.25rem 0.5rem;
  background: rgba(var(--agent-rgb), 0.1);
  border-radius: 4px;
}

.obj-text {
  font-size: 0.95rem;
}

/* System Prompt */
.prompt-content {
  border-radius: 1rem;
  border: 1px solid var(--border);
  overflow: hidden;
}

.prompt-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  background: rgba(var(--agent-rgb), 0.05);
  border-bottom: 1px solid var(--border);
}

.prompt-icon {
  font-size: 1.25rem;
}

.prompt-label {
  flex: 1;
  font-size: 0.85rem;
  color: var(--text-muted);
}

.copy-btn {
  padding: 0.5rem 1rem;
  background: rgba(var(--agent-rgb), 0.1);
  border: 1px solid var(--agent-color);
  border-radius: 0.5rem;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.75rem;
  color: var(--agent-color);
  cursor: pointer;
  transition: all 0.3s ease;
}

.copy-btn:hover {
  background: var(--agent-color);
  color: #000;
}

.copy-btn.copied {
  background: var(--primary);
  border-color: var(--primary);
  color: #000;
}

.prompt-code {
  padding: 1.5rem;
  margin: 0;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.85rem;
  line-height: 1.6;
  color: var(--text-main);
  white-space: pre-wrap;
  background: rgba(0, 0, 0, 0.3);
}

/* Capabilities */
.capabilities-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--space-md);
}

.capability-card {
  padding: 1.5rem;
  border-radius: 0.75rem;
  border: 1px solid var(--border);
}

.cap-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.75rem;
}

.cap-name {
  font-size: 0.9rem;
  font-weight: 600;
}

.cap-level {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.85rem;
  color: var(--agent-color);
}

.cap-bar {
  height: 8px;
  background: var(--border);
  border-radius: 4px;
  overflow: hidden;
}

.cap-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--agent-color), rgba(var(--agent-rgb), 0.5));
  border-radius: 4px;
  transition: width 1s ease;
}

/* Tools */
.tools-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--space-sm);
}

.tool-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem;
  border-radius: 0.75rem;
  border: 1px solid var(--border);
  transition: all 0.3s ease;
}

.tool-card:hover {
  border-color: var(--agent-color);
}

.tool--inactive {
  opacity: 0.5;
}

.tool-icon {
  font-size: 1.75rem;
}

.tool-info {
  flex: 1;
}

.tool-name {
  display: block;
  font-size: 0.95rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.tool-desc {
  font-size: 0.75rem;
  color: var(--text-muted);
}

.tool-status {
  font-size: 0.65rem;
  font-family: 'JetBrains Mono', monospace;
}

.tool-status--active {
  color: var(--primary);
}

.tool-status--standby {
  color: #F59E0B;
}

/* Processes */
.processes-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.process-card {
  padding: var(--space-lg);
  border-radius: 1rem;
  border: 1px solid var(--border);
}

.process-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.process-number {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.7rem;
  color: var(--agent-color);
  padding: 0.5rem 0.75rem;
  background: rgba(var(--agent-rgb), 0.1);
  border-radius: 0.5rem;
}

.process-name {
  font-size: 1.25rem;
  font-weight: 600;
}

.process-trigger,
.process-flow,
.process-output {
  margin-bottom: 1rem;
}

.trigger-label,
.flow-label,
.output-label {
  display: block;
  font-size: 0.75rem;
  color: var(--text-muted);
  margin-bottom: 0.5rem;
}

.trigger-value {
  font-size: 0.95rem;
  color: var(--agent-color);
}

.steps-pipeline {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-items: center;
}

.step-item {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: rgba(var(--agent-rgb), 0.05);
  border: 1px solid rgba(var(--agent-rgb), 0.2);
  border-radius: 2rem;
  font-size: 0.8rem;
}

.step-arrow {
  color: var(--agent-color);
  margin-left: 0.5rem;
}

.output-value {
  font-size: 0.95rem;
  color: var(--primary);
  font-weight: 500;
}

/* Metrics */
.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: var(--space-md);
}

.metric-card {
  padding: 1.5rem;
  border-radius: 0.75rem;
  border: 1px solid var(--border);
  text-align: center;
}

.metric-value {
  display: block;
  font-family: 'JetBrains Mono', monospace;
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--agent-color);
  margin-bottom: 0.25rem;
}

.metric-label {
  font-size: 0.75rem;
  color: var(--text-muted);
}

/* Communication */
.comm-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-md);
}

.comm-card {
  padding: 1.5rem;
  border-radius: 0.75rem;
  border: 1px solid var(--border);
  text-align: center;
}

.comm-icon {
  display: block;
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

.comm-label {
  display: block;
  font-size: 0.7rem;
  color: var(--agent-color);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 0.5rem;
}

.comm-value {
  font-size: 0.9rem;
  line-height: 1.5;
  margin: 0;
}

/* Footer Navigation */
.profile-footer {
  padding: var(--space-xl) 0;
  border-top: 1px solid var(--border);
  background: rgba(0, 0, 0, 0.3);
}

.profile-footer .container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-agent {
  display: flex;
  flex-direction: column;
  text-decoration: none;
  transition: all 0.3s ease;
  padding: 1rem;
  border-radius: 0.75rem;
  border: 1px solid transparent;
}

.nav-agent:hover {
  border-color: var(--nav-color);
  background: rgba(255, 255, 255, 0.02);
}

.nav-direction {
  font-size: 0.75rem;
  color: var(--text-muted);
}

.nav-name {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--nav-color);
}

.nav-next {
  text-align: right;
}

.nav-hub {
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #FBBF24, #F59E0B);
  color: #000;
  border-radius: 0.5rem;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.8rem;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
}

.nav-hub:hover {
  transform: scale(1.05);
  box-shadow: 0 10px 30px rgba(251, 191, 36, 0.3);
}

/* 404 */
.agent-not-found {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.not-found-icon {
  font-size: 4rem;
  display: block;
  margin-bottom: 1rem;
}

.agent-not-found h1 {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.agent-not-found p {
  color: var(--text-muted);
  margin-bottom: 2rem;
}

.btn-primary {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  background: var(--primary);
  color: #000;
  border-radius: 0.5rem;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
}

.btn-primary:hover {
  transform: translateY(-2px);
}

/* Utilities */
.glass {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(10px);
}

/* Workflows Section */
.workflows-section {
  background: rgba(var(--agent-rgb), 0.02);
}

.section-desc {
  font-size: 0.85rem;
  color: var(--text-muted);
  margin-top: 0.5rem;
}

.workflow-group {
  margin-bottom: var(--space-lg);
}

.workflow-group:last-child {
  margin-bottom: 0;
}

.workflow-group-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--agent-color);
  margin-bottom: var(--space-md);
  padding-bottom: 0.75rem;
  border-bottom: 1px solid rgba(var(--agent-rgb), 0.2);
}

.group-icon {
  font-size: 1.25rem;
}

.group-count {
  font-size: 0.7rem;
  font-weight: 600;
  padding: 0.2rem 0.5rem;
  background: rgba(var(--agent-rgb), 0.15);
  border-radius: 1rem;
  color: var(--agent-color);
}

.workflows-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: var(--space-md);
}

.workflow-card {
  padding: 1.5rem;
  border-radius: 1rem;
  border: 1px solid var(--border);
  transition: all 0.3s ease;
}

.workflow-card:hover {
  border-color: var(--agent-color);
  transform: translateY(-2px);
}

.workflow--standby {
  opacity: 0.6;
}

.workflow-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.workflow-status {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0.75rem;
  border-radius: 2rem;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.65rem;
}

.wf-status--active {
  background: rgba(16, 185, 129, 0.1);
  color: #10B981;
}

.wf-status--active .wf-dot {
  background: #10B981;
  box-shadow: 0 0 8px #10B981;
}

.wf-status--standby {
  background: rgba(245, 158, 11, 0.1);
  color: #F59E0B;
}

.wf-status--standby .wf-dot {
  background: #F59E0B;
}

.wf-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
}

.workflow-freq {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.65rem;
  color: var(--text-muted);
  padding: 0.25rem 0.5rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 4px;
}

.workflow-name {
  font-size: 1.1rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: var(--agent-color);
}

.workflow-desc {
  font-size: 0.85rem;
  color: var(--text-muted);
  line-height: 1.5;
  margin-bottom: 1rem;
}

.workflow-trigger,
.workflow-nodes {
  margin-bottom: 1rem;
}

.wf-label {
  display: block;
  font-size: 0.7rem;
  color: var(--text-muted);
  margin-bottom: 0.5rem;
}

.wf-value {
  font-size: 0.85rem;
  color: var(--agent-color);
}

.nodes-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.node-chip {
  padding: 0.25rem 0.5rem;
  background: rgba(var(--agent-rgb), 0.1);
  border: 1px solid rgba(var(--agent-rgb), 0.2);
  border-radius: 4px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.65rem;
  color: var(--agent-color);
}

.workflow-id {
  padding-top: 1rem;
  border-top: 1px solid var(--border);
}

.workflow-id code {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.65rem;
  color: var(--text-dark);
  background: rgba(0, 0, 0, 0.3);
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
}

/* Responsive */
@media (max-width: 1024px) {
  .hero-tags {
    flex-direction: column;
    align-items: center;
  }
  
  .personality-tag {
    width: 100%;
    max-width: 300px;
  }
}

@media (max-width: 768px) {
  .comm-grid {
    grid-template-columns: 1fr;
  }
  
  .profile-footer .container {
    flex-direction: column;
    gap: 1rem;
  }
  
  .nav-agent {
    text-align: center;
  }
  
  .nav-next {
    text-align: center;
  }
  
  .steps-pipeline {
    flex-direction: column;
    align-items: stretch;
  }
  
  .step-arrow {
    display: none;
  }
  
  .nav-info {
    flex-direction: column;
    gap: 0.5rem;
  }
}

/* Reduced Motion */
@media (prefers-reduced-motion: reduce) {
  .avatar-ring,
  .avatar-glow,
  .status-dot {
    animation: none;
  }
}
</style>
