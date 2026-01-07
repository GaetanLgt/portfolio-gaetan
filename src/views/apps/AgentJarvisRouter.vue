<template>
  <div class="agent-app">
    <header class="app-header">
      <div class="container">
        <router-link to="/apps" class="back-link">← Retour aux Apps</router-link>
        <span class="agent-badge" style="--agent-color: #FBBF24">🎯 JARVIS</span>
      </div>
    </header>
    <main class="app-main">
      <div class="container">
        <div class="app-intro">
          <h1><span class="app-icon">🎯</span> Multi-Agent Router</h1>
          <p>Orchestrez des requêtes complexes vers plusieurs agents IA</p>
        </div>

        <!-- REQUEST INPUT -->
        <div class="request-section">
          <h3>📝 Requête à router</h3>
          <textarea v-model="request" placeholder="Décrivez votre tâche complexe... Ex: 'Créer une landing page sécurisée avec analytics'" class="request-input"></textarea>
          <button @click="analyzeRequest" class="analyze-btn" :disabled="analyzing">
            {{ analyzing ? '🔄 Analyse...' : '🎯 Analyser & Router' }}
          </button>
        </div>

        <!-- ANALYSIS RESULT -->
        <div v-if="analysis" class="analysis-section">
          <h3>🧠 Analyse JARVIS</h3>
          
          <div class="intent-card">
            <div class="intent-header">
              <span class="intent-icon">🎯</span>
              <span class="intent-label">Intent détecté</span>
            </div>
            <div class="intent-value">{{ analysis.intent }}</div>
            <div class="intent-confidence">Confiance: {{ analysis.confidence }}%</div>
          </div>

          <!-- AGENTS TO INVOLVE -->
          <div class="agents-routing">
            <h4>👥 Agents impliqués</h4>
            <div class="agents-list">
              <div v-for="(agent, i) in analysis.agents" :key="agent.id" class="routed-agent" :style="{ '--agent-color': agent.color }">
                <div class="agent-order">{{ i + 1 }}</div>
                <div class="agent-avatar">{{ agent.avatar }}</div>
                <div class="agent-info">
                  <div class="agent-name">{{ agent.name }}</div>
                  <div class="agent-task">{{ agent.task }}</div>
                </div>
                <div class="agent-priority" :class="agent.priority">{{ agent.priority }}</div>
              </div>
            </div>
          </div>

          <!-- WORKFLOW PREVIEW -->
          <div class="workflow-preview">
            <h4>🔄 Workflow généré</h4>
            <div class="workflow-nodes">
              <div class="workflow-node start">📥 Input</div>
              <div v-for="(step, i) in analysis.workflow" :key="i" class="workflow-step">
                <div class="workflow-arrow">→</div>
                <div class="workflow-node" :style="{ borderColor: step.color }">
                  <span class="node-agent">{{ step.avatar }}</span>
                  <span class="node-action">{{ step.action }}</span>
                </div>
              </div>
              <div class="workflow-arrow">→</div>
              <div class="workflow-node end">📤 Output</div>
            </div>
          </div>

          <!-- EXECUTION -->
          <div class="execution-section">
            <button @click="executeWorkflow" class="execute-btn" :disabled="executing">
              {{ executing ? '⚡ Exécution...' : '🚀 Exécuter le workflow' }}
            </button>
          </div>
        </div>

        <!-- EXECUTION LOG -->
        <div v-if="executionLog.length" class="log-section">
          <h3>📋 Log d'exécution</h3>
          <div class="log-entries">
            <div v-for="(entry, i) in executionLog" :key="i" class="log-entry" :class="entry.status">
              <span class="log-time">{{ entry.time }}</span>
              <span class="log-agent">{{ entry.agent }}</span>
              <span class="log-message">{{ entry.message }}</span>
              <span class="log-status">{{ entry.status === 'success' ? '✓' : entry.status === 'running' ? '⏳' : '○' }}</span>
            </div>
          </div>
        </div>

        <!-- PRESETS -->
        <div class="presets-section">
          <h3>📦 Scénarios types</h3>
          <div class="presets-grid">
            <button @click="loadPreset('landing')">🚀 Landing Page complète</button>
            <button @click="loadPreset('security')">🛡️ Audit sécurité</button>
            <button @click="loadPreset('feature')">⚡ Nouvelle feature</button>
            <button @click="loadPreset('campaign')">📢 Campagne marketing</button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const request = ref('');
const analyzing = ref(false);
const executing = ref(false);
const analysis = ref(null);
const executionLog = ref([]);

const agentsDB = {
  jarvis: { id: 'jarvis', name: 'JARVIS', avatar: '🎯', color: '#FBBF24' },
  edith: { id: 'edith', name: 'EDITH', avatar: '🛡️', color: '#EF4444' },
  veronica: { id: 'veronica', name: 'VERONICA', avatar: '🚀', color: '#8B5CF6' },
  ultron: { id: 'ultron', name: 'ULTRON', avatar: '📊', color: '#F59E0B' },
  vision: { id: 'vision', name: 'VISION', avatar: '📢', color: '#06B6D4' },
  karen: { id: 'karen', name: 'KAREN', avatar: '👥', color: '#EC4899' },
  friday: { id: 'friday', name: 'FRIDAY', avatar: '🎧', color: '#10B981' },
  tadashi: { id: 'tadashi', name: 'TADASHI', avatar: '🦾', color: '#14B8A6' },
  jocasta: { id: 'jocasta', name: 'JOCASTA', avatar: '⚙️', color: '#6366F1' },
  cerebro: { id: 'cerebro', name: 'CEREBRO', avatar: '🔬', color: '#A855F7' },
  zola: { id: 'zola', name: 'ZOLA', avatar: '🗄️', color: '#0EA5E9' },
  natasha: { id: 'natasha', name: 'NATASHA', avatar: '🎨', color: '#F43F5E' },
  maria: { id: 'maria', name: 'MARIA', avatar: '📈', color: '#22C55E' },
  pepper: { id: 'pepper', name: 'PEPPER', avatar: '💰', color: '#F97316' }
};

async function analyzeRequest() {
  if (!request.value.trim()) return;
  analyzing.value = true;
  analysis.value = null;
  executionLog.value = [];
  
  await new Promise(r => setTimeout(r, 1500));
  
  const text = request.value.toLowerCase();
  const detectedAgents = [];
  const workflow = [];
  
  // Detect intent and agents
  if (text.includes('landing') || text.includes('page') || text.includes('site')) {
    detectedAgents.push({ ...agentsDB.natasha, task: 'Design UI/UX', priority: 'high' });
    detectedAgents.push({ ...agentsDB.tadashi, task: 'Développement Vue.js', priority: 'high' });
    workflow.push({ ...agentsDB.natasha, action: 'Wireframe' });
    workflow.push({ ...agentsDB.tadashi, action: 'Component' });
  }
  if (text.includes('sécuri') || text.includes('audit') || text.includes('vuln')) {
    detectedAgents.push({ ...agentsDB.edith, task: 'Scan vulnérabilités', priority: 'critical' });
    workflow.push({ ...agentsDB.edith, action: 'Security Scan' });
  }
  if (text.includes('api') || text.includes('backend') || text.includes('symfony')) {
    detectedAgents.push({ ...agentsDB.jocasta, task: 'Architecture API', priority: 'high' });
    workflow.push({ ...agentsDB.jocasta, action: 'API Design' });
  }
  if (text.includes('test') || text.includes('qa')) {
    detectedAgents.push({ ...agentsDB.cerebro, task: 'Tests automatisés', priority: 'medium' });
    workflow.push({ ...agentsDB.cerebro, action: 'Test Suite' });
  }
  if (text.includes('deploy') || text.includes('ci') || text.includes('prod')) {
    detectedAgents.push({ ...agentsDB.veronica, task: 'CI/CD Pipeline', priority: 'high' });
    workflow.push({ ...agentsDB.veronica, action: 'Deploy' });
  }
  if (text.includes('monitor') || text.includes('alert') || text.includes('log')) {
    detectedAgents.push({ ...agentsDB.ultron, task: 'Monitoring setup', priority: 'medium' });
    workflow.push({ ...agentsDB.ultron, action: 'Monitor' });
  }
  if (text.includes('content') || text.includes('blog') || text.includes('article')) {
    detectedAgents.push({ ...agentsDB.vision, task: 'Rédaction contenu', priority: 'medium' });
    workflow.push({ ...agentsDB.vision, action: 'Write' });
  }
  if (text.includes('seo') || text.includes('analytics') || text.includes('marketing')) {
    detectedAgents.push({ ...agentsDB.maria, task: 'Optimisation SEO', priority: 'medium' });
    workflow.push({ ...agentsDB.maria, action: 'SEO Audit' });
  }
  if (text.includes('database') || text.includes('data') || text.includes('sql')) {
    detectedAgents.push({ ...agentsDB.zola, task: 'Architecture data', priority: 'high' });
    workflow.push({ ...agentsDB.zola, action: 'Schema Design' });
  }
  
  // Default if nothing detected
  if (detectedAgents.length === 0) {
    detectedAgents.push({ ...agentsDB.friday, task: 'Analyse demande', priority: 'medium' });
    workflow.push({ ...agentsDB.friday, action: 'Analyze' });
  }
  
  analysis.value = {
    intent: detectIntent(text),
    confidence: 75 + Math.floor(Math.random() * 20),
    agents: detectedAgents,
    workflow
  };
  
  analyzing.value = false;
}

function detectIntent(text) {
  if (text.includes('créer') || text.includes('nouveau')) return 'Création de projet';
  if (text.includes('audit') || text.includes('analyse')) return 'Audit & Analyse';
  if (text.includes('optimis') || text.includes('amélio')) return 'Optimisation';
  if (text.includes('deploy') || text.includes('mise en prod')) return 'Déploiement';
  if (text.includes('fix') || text.includes('bug') || text.includes('corrig')) return 'Correction';
  return 'Assistance générale';
}

async function executeWorkflow() {
  if (!analysis.value) return;
  executing.value = true;
  executionLog.value = [];
  
  const addLog = (agent, message, status) => {
    executionLog.value.push({
      time: new Date().toLocaleTimeString('fr-FR'),
      agent,
      message,
      status
    });
  };
  
  addLog('JARVIS', 'Initialisation du workflow...', 'running');
  await new Promise(r => setTimeout(r, 800));
  addLog('JARVIS', 'Workflow initialisé', 'success');
  
  for (const step of analysis.value.workflow) {
    addLog(step.name, `Démarrage: ${step.action}`, 'running');
    await new Promise(r => setTimeout(r, 1000 + Math.random() * 1000));
    addLog(step.name, `${step.action} terminé`, 'success');
  }
  
  addLog('JARVIS', 'Workflow terminé avec succès ✓', 'success');
  executing.value = false;
}

function loadPreset(type) {
  const presets = {
    landing: 'Créer une landing page moderne avec design responsive, animations, formulaire de contact sécurisé, et analytics intégrés',
    security: 'Effectuer un audit de sécurité complet : scan vulnérabilités, vérification dépendances, test d\'intrusion, rapport OWASP',
    feature: 'Développer une nouvelle feature : API backend, composants frontend, tests unitaires et E2E, déploiement staging',
    campaign: 'Lancer une campagne marketing : création contenu SEO, landing page, tracking analytics, A/B testing'
  };
  request.value = presets[type];
  analyzeRequest();
}
</script>

<style scoped>
.agent-app { min-height: 100vh; background: var(--bg-primary); }
.app-header { padding: 1rem 0; border-bottom: 1px solid var(--border); }
.app-header .container { display: flex; justify-content: space-between; align-items: center; }
.back-link { color: var(--text-muted); text-decoration: none; }
.agent-badge { padding: 0.35rem 0.75rem; background: rgba(251,191,36,0.1); border: 1px solid var(--agent-color); border-radius: 2rem; font-size: 0.8rem; color: var(--agent-color); }
.app-main { padding: var(--space-lg) 0; }
.app-intro { text-align: center; margin-bottom: 2rem; }
.app-intro h1 { display: flex; justify-content: center; gap: 0.5rem; font-size: 1.75rem; }
.app-icon { font-size: 2rem; }

.request-section, .analysis-section, .log-section, .presets-section { margin-bottom: 2rem; }
.request-section h3, .analysis-section h3, .log-section h3, .presets-section h3 { font-size: 1rem; margin-bottom: 1rem; }

.request-input { width: 100%; min-height: 120px; padding: 1rem; background: rgba(0,0,0,0.3); border: 1px solid var(--border); border-radius: 0.5rem; color: var(--text-main); font-size: 0.95rem; resize: vertical; margin-bottom: 1rem; }
.analyze-btn { padding: 0.75rem 2rem; background: #FBBF24; border: none; border-radius: 0.5rem; font-weight: 600; cursor: pointer; font-size: 1rem; }
.analyze-btn:disabled { opacity: 0.6; cursor: not-allowed; }

.intent-card { padding: 1.5rem; background: rgba(251,191,36,0.1); border: 1px solid rgba(251,191,36,0.3); border-radius: 0.75rem; margin-bottom: 1.5rem; }
.intent-header { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem; }
.intent-icon { font-size: 1.5rem; }
.intent-label { font-size: 0.8rem; color: var(--text-muted); }
.intent-value { font-size: 1.5rem; font-weight: 700; color: #FBBF24; margin-bottom: 0.25rem; }
.intent-confidence { font-size: 0.85rem; color: var(--text-muted); }

.agents-routing { margin-bottom: 1.5rem; }
.agents-routing h4 { font-size: 0.9rem; margin-bottom: 0.75rem; }
.agents-list { display: flex; flex-direction: column; gap: 0.5rem; }
.routed-agent { display: flex; align-items: center; gap: 1rem; padding: 0.75rem 1rem; background: rgba(255,255,255,0.02); border: 1px solid var(--border); border-left: 3px solid var(--agent-color); border-radius: 0.5rem; }
.agent-order { width: 24px; height: 24px; background: rgba(255,255,255,0.1); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.75rem; font-weight: 600; }
.agent-avatar { font-size: 1.5rem; }
.agent-info { flex: 1; }
.agent-name { font-weight: 600; font-size: 0.9rem; color: var(--agent-color); }
.agent-task { font-size: 0.8rem; color: var(--text-muted); }
.agent-priority { padding: 0.2rem 0.5rem; border-radius: 0.25rem; font-size: 0.7rem; text-transform: uppercase; }
.agent-priority.critical { background: rgba(239,68,68,0.2); color: #EF4444; }
.agent-priority.high { background: rgba(245,158,11,0.2); color: #F59E0B; }
.agent-priority.medium { background: rgba(59,130,246,0.2); color: #3B82F6; }

.workflow-preview { margin-bottom: 1.5rem; }
.workflow-preview h4 { font-size: 0.9rem; margin-bottom: 0.75rem; }
.workflow-nodes { display: flex; align-items: center; flex-wrap: wrap; gap: 0.5rem; padding: 1rem; background: rgba(0,0,0,0.2); border-radius: 0.5rem; overflow-x: auto; }
.workflow-node { padding: 0.5rem 1rem; background: rgba(255,255,255,0.05); border: 1px solid var(--border); border-radius: 0.35rem; display: flex; align-items: center; gap: 0.5rem; font-size: 0.85rem; white-space: nowrap; }
.workflow-node.start { background: rgba(16,185,129,0.2); border-color: #10B981; }
.workflow-node.end { background: rgba(139,92,246,0.2); border-color: #8B5CF6; }
.workflow-arrow { color: var(--text-muted); }
.node-agent { font-size: 1rem; }
.node-action { color: var(--text-secondary); }

.execute-btn { width: 100%; padding: 1rem; background: linear-gradient(135deg, #10B981, #059669); border: none; border-radius: 0.5rem; font-weight: 600; font-size: 1rem; color: white; cursor: pointer; }
.execute-btn:disabled { opacity: 0.6; cursor: not-allowed; }

.log-entries { display: flex; flex-direction: column; gap: 0.35rem; }
.log-entry { display: flex; align-items: center; gap: 1rem; padding: 0.5rem 0.75rem; background: rgba(0,0,0,0.2); border-radius: 0.35rem; font-size: 0.8rem; font-family: monospace; }
.log-time { color: var(--text-muted); min-width: 70px; }
.log-agent { color: var(--primary); min-width: 80px; }
.log-message { flex: 1; color: var(--text-secondary); }
.log-status { font-size: 1rem; }
.log-entry.running { background: rgba(245,158,11,0.1); border-left: 2px solid #F59E0B; }
.log-entry.success { background: rgba(16,185,129,0.1); border-left: 2px solid #10B981; }

.presets-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 0.75rem; }
.presets-grid button { padding: 0.75rem 1rem; background: rgba(255,255,255,0.02); border: 1px solid var(--border); border-radius: 0.5rem; color: var(--text-muted); cursor: pointer; text-align: left; font-size: 0.85rem; }
.presets-grid button:hover { border-color: var(--primary); color: var(--primary); }
</style>
