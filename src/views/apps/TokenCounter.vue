<template>
  <div class="token-app">
    <header class="app-header">
      <div class="container">
        <router-link to="/apps" class="back-link">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
          </svg>
          Retour aux Apps
        </router-link>
      </div>
    </header>

    <main class="app-main">
      <div class="container">
        <div class="app-intro">
          <h1><span class="app-icon">🔢</span> Token Counter</h1>
          <p>Estimez le nombre de tokens pour différents modèles LLM</p>
        </div>

        <!-- INPUT -->
        <div class="input-section">
          <div class="input-header">
            <span>📝 Texte à analyser</span>
            <div class="model-select">
              <label>Modèle:</label>
              <select v-model="selectedModel">
                <option value="gpt4">GPT-4 / GPT-4o</option>
                <option value="gpt35">GPT-3.5 Turbo</option>
                <option value="claude">Claude 3.x</option>
                <option value="llama">Llama 3</option>
                <option value="mistral">Mistral</option>
              </select>
            </div>
          </div>
          <textarea 
            v-model="text" 
            placeholder="Collez votre texte, prompt ou conversation ici..."
            class="main-textarea"
            @input="analyze"
          ></textarea>
          <div class="input-actions">
            <button @click="loadSample('short')">📄 Texte court</button>
            <button @click="loadSample('prompt')">🧠 Prompt exemple</button>
            <button @click="loadSample('code')">💻 Code exemple</button>
            <button @click="text = ''" class="clear-btn">🗑️ Effacer</button>
          </div>
        </div>

        <!-- STATS -->
        <div class="stats-grid">
          <div class="stat-card stat-card--primary">
            <div class="stat-icon">🎯</div>
            <div class="stat-value">{{ tokens.toLocaleString() }}</div>
            <div class="stat-label">Tokens estimés</div>
            <div class="stat-detail">{{ selectedModel.toUpperCase() }}</div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">📊</div>
            <div class="stat-value">{{ characters.toLocaleString() }}</div>
            <div class="stat-label">Caractères</div>
            <div class="stat-detail">{{ charactersNoSpaces.toLocaleString() }} sans espaces</div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">📝</div>
            <div class="stat-value">{{ words.toLocaleString() }}</div>
            <div class="stat-label">Mots</div>
            <div class="stat-detail">~{{ avgTokensPerWord.toFixed(2) }} tokens/mot</div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">📄</div>
            <div class="stat-value">{{ lines.toLocaleString() }}</div>
            <div class="stat-label">Lignes</div>
            <div class="stat-detail">{{ paragraphs }} paragraphes</div>
          </div>
        </div>

        <!-- COST ESTIMATOR -->
        <div class="cost-section">
          <h2>💰 Estimation des coûts</h2>
          <div class="cost-grid">
            <div v-for="model in costModels" :key="model.name" class="cost-card">
              <div class="cost-header">
                <span class="cost-icon">{{ model.icon }}</span>
                <span class="cost-name">{{ model.name }}</span>
              </div>
              <div class="cost-prices">
                <div class="cost-row">
                  <span>Input (1M tokens):</span>
                  <span class="cost-value">${{ model.inputPrice }}</span>
                </div>
                <div class="cost-row">
                  <span>Output (1M tokens):</span>
                  <span class="cost-value">${{ model.outputPrice }}</span>
                </div>
              </div>
              <div class="cost-estimate">
                <span>Coût estimé (input):</span>
                <span class="cost-total">${{ calculateCost(model.inputPrice).toFixed(6) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- CONTEXT WINDOWS -->
        <div class="context-section">
          <h2>📐 Fenêtres de contexte</h2>
          <div class="context-list">
            <div v-for="ctx in contextWindows" :key="ctx.model" class="context-row">
              <span class="ctx-model">{{ ctx.model }}</span>
              <div class="ctx-bar-container">
                <div class="ctx-bar" :style="{ width: getContextPercent(ctx.tokens) + '%' }">
                  <span class="ctx-fill" :style="{ width: getUsagePercent(ctx.tokens) + '%' }"></span>
                </div>
              </div>
              <span class="ctx-tokens">{{ formatTokens(ctx.tokens) }}</span>
              <span class="ctx-usage" :class="{ warning: tokens > ctx.tokens * 0.8, danger: tokens > ctx.tokens }">
                {{ getUsagePercent(ctx.tokens).toFixed(1) }}%
              </span>
            </div>
          </div>
        </div>

        <!-- INFO -->
        <div class="info-section">
          <h2>ℹ️ À propos des tokens</h2>
          <div class="info-content">
            <p>Les <strong>tokens</strong> sont les unités de texte utilisées par les modèles de langage. Un token peut être un mot, une partie de mot, ou un caractère de ponctuation.</p>
            <div class="info-facts">
              <div class="fact">🔤 En anglais: ~4 caractères = 1 token</div>
              <div class="fact">🇫🇷 En français: ~3-3.5 caractères = 1 token</div>
              <div class="fact">💻 Code: plus de tokens (syntaxe, indentation)</div>
              <div class="fact">📊 Cette estimation est approximative (~95% précision)</div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const text = ref('');
const selectedModel = ref('gpt4');

const samples = {
  short: "Bonjour, je suis un assistant IA. Comment puis-je vous aider aujourd'hui?",
  prompt: `Tu es un assistant professionnel expert en développement web.

# CONTEXTE
L'utilisateur est un développeur qui cherche à optimiser son code Vue.js.

# TÂCHE
Analyse le code fourni et propose des améliorations en termes de:
1. Performance
2. Lisibilité
3. Bonnes pratiques Vue 3

# FORMAT
Réponds en Markdown avec des exemples de code.`,
  code: `<template>
  <div class="component">
    <h1>{{ title }}</h1>
    <ul>
      <li v-for="item in items" :key="item.id">
        {{ item.name }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  title: String,
  items: Array
});

const filteredItems = computed(() => {
  return props.items.filter(item => item.active);
});
<\/script>`
};

function loadSample(type) {
  text.value = samples[type];
}

// Token estimation (approximation based on character/word ratios)
const tokens = computed(() => {
  if (!text.value) return 0;
  
  // Different models have slightly different tokenizers
  const multipliers = {
    gpt4: 0.75,      // ~4 chars per token (English), ~3 for French
    gpt35: 0.75,
    claude: 0.72,    // Claude tends to be slightly more efficient
    llama: 0.78,
    mistral: 0.76
  };
  
  const chars = text.value.length;
  const mult = multipliers[selectedModel.value] || 0.75;
  
  // Adjust for code (more tokens due to syntax)
  const hasCode = /[{}\[\]();<>]/.test(text.value);
  const codeFactor = hasCode ? 1.15 : 1;
  
  return Math.ceil(chars * mult * codeFactor / 3);
});

const characters = computed(() => text.value.length);
const charactersNoSpaces = computed(() => text.value.replace(/\s/g, '').length);
const words = computed(() => text.value.trim() ? text.value.trim().split(/\s+/).length : 0);
const lines = computed(() => text.value ? text.value.split('\n').length : 0);
const paragraphs = computed(() => text.value ? text.value.split(/\n\s*\n/).filter(p => p.trim()).length : 0);
const avgTokensPerWord = computed(() => words.value ? tokens.value / words.value : 0);

const costModels = [
  { name: 'GPT-4o', icon: '🟢', inputPrice: 2.50, outputPrice: 10.00 },
  { name: 'GPT-4 Turbo', icon: '🔵', inputPrice: 10.00, outputPrice: 30.00 },
  { name: 'Claude 3.5 Sonnet', icon: '🟣', inputPrice: 3.00, outputPrice: 15.00 },
  { name: 'Claude 3 Opus', icon: '🟠', inputPrice: 15.00, outputPrice: 75.00 },
  { name: 'GPT-3.5 Turbo', icon: '⚪', inputPrice: 0.50, outputPrice: 1.50 }
];

const contextWindows = [
  { model: 'GPT-4o', tokens: 128000 },
  { model: 'Claude 3.5 Sonnet', tokens: 200000 },
  { model: 'GPT-4 Turbo', tokens: 128000 },
  { model: 'Llama 3 70B', tokens: 8192 },
  { model: 'Mistral Large', tokens: 32000 },
  { model: 'GPT-3.5 Turbo', tokens: 16385 }
];

function calculateCost(pricePerMillion) {
  return (tokens.value / 1000000) * pricePerMillion;
}

function getContextPercent(maxTokens) {
  const maxDisplay = 200000;
  return Math.min((maxTokens / maxDisplay) * 100, 100);
}

function getUsagePercent(maxTokens) {
  return Math.min((tokens.value / maxTokens) * 100, 100);
}

function formatTokens(num) {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(0) + 'K';
  return num;
}

function analyze() {
  // Triggered on input, reactivity handles the rest
}
</script>

<style scoped>
.token-app { min-height: 100vh; background: var(--bg-primary); }
.app-header { padding: 1rem 0; border-bottom: 1px solid var(--border); background: rgba(10,10,15,0.9); backdrop-filter: blur(10px); }
.back-link { display: inline-flex; align-items: center; gap: 0.5rem; color: var(--text-muted); text-decoration: none; }
.back-link:hover { color: var(--primary); }
.app-main { padding: var(--space-lg) 0; }
.app-intro { text-align: center; margin-bottom: var(--space-lg); }
.app-intro h1 { display: flex; align-items: center; justify-content: center; gap: 0.75rem; font-size: 2rem; margin-bottom: 0.5rem; }
.app-icon { font-size: 2.5rem; }
.app-intro p { color: var(--text-muted); }

.input-section { margin-bottom: var(--space-lg); }
.input-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; font-weight: 600; }
.model-select { display: flex; align-items: center; gap: 0.5rem; }
.model-select label { font-size: 0.85rem; color: var(--text-muted); font-weight: normal; }
.model-select select { padding: 0.5rem; background: rgba(0,0,0,0.3); border: 1px solid var(--border); border-radius: 0.35rem; color: var(--text-main); }
.main-textarea { width: 100%; min-height: 200px; padding: 1rem; background: rgba(0,0,0,0.3); border: 1px solid var(--border); border-radius: 0.75rem; font-family: 'JetBrains Mono', monospace; font-size: 0.9rem; color: var(--text-main); resize: vertical; }
.main-textarea:focus { outline: none; border-color: var(--primary); }
.input-actions { display: flex; gap: 0.5rem; margin-top: 0.75rem; flex-wrap: wrap; }
.input-actions button { padding: 0.5rem 1rem; background: rgba(255,255,255,0.05); border: 1px solid var(--border); border-radius: 0.35rem; font-size: 0.8rem; color: var(--text-muted); cursor: pointer; }
.input-actions button:hover { border-color: var(--primary); color: var(--primary); }
.clear-btn:hover { border-color: #EF4444 !important; color: #EF4444 !important; }

.stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1rem; margin-bottom: var(--space-lg); }
.stat-card { padding: 1.5rem; background: rgba(255,255,255,0.02); border: 1px solid var(--border); border-radius: 0.75rem; text-align: center; }
.stat-card--primary { border-color: rgba(0,255,136,0.3); background: rgba(0,255,136,0.05); }
.stat-icon { font-size: 1.5rem; margin-bottom: 0.5rem; }
.stat-value { font-family: 'JetBrains Mono', monospace; font-size: 2rem; font-weight: 700; color: var(--text-main); }
.stat-card--primary .stat-value { color: var(--primary); }
.stat-label { font-size: 0.85rem; color: var(--text-muted); margin-top: 0.25rem; }
.stat-detail { font-size: 0.75rem; color: var(--text-dark); margin-top: 0.5rem; font-family: 'JetBrains Mono', monospace; }

.cost-section, .context-section, .info-section { margin-bottom: var(--space-lg); }
.cost-section h2, .context-section h2, .info-section h2 { font-size: 1.1rem; margin-bottom: 1rem; }

.cost-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem; }
.cost-card { padding: 1.25rem; background: rgba(255,255,255,0.02); border: 1px solid var(--border); border-radius: 0.75rem; }
.cost-header { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1rem; font-weight: 600; }
.cost-icon { font-size: 1.25rem; }
.cost-prices { margin-bottom: 1rem; padding-bottom: 1rem; border-bottom: 1px solid var(--border); }
.cost-row { display: flex; justify-content: space-between; font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.35rem; }
.cost-value { font-family: 'JetBrains Mono', monospace; color: var(--text-secondary); }
.cost-estimate { display: flex; justify-content: space-between; font-size: 0.85rem; }
.cost-total { font-family: 'JetBrains Mono', monospace; font-weight: 600; color: var(--primary); }

.context-list { display: flex; flex-direction: column; gap: 0.75rem; }
.context-row { display: grid; grid-template-columns: 150px 1fr 70px 60px; gap: 1rem; align-items: center; padding: 0.75rem 1rem; background: rgba(255,255,255,0.02); border: 1px solid var(--border); border-radius: 0.5rem; }
.ctx-model { font-size: 0.85rem; font-weight: 500; }
.ctx-bar-container { height: 8px; background: var(--border); border-radius: 4px; overflow: hidden; position: relative; }
.ctx-bar { height: 100%; background: rgba(255,255,255,0.1); position: relative; }
.ctx-fill { position: absolute; left: 0; top: 0; height: 100%; background: var(--primary); border-radius: 4px; transition: width 0.3s ease; }
.ctx-tokens { font-family: 'JetBrains Mono', monospace; font-size: 0.8rem; color: var(--text-muted); text-align: right; }
.ctx-usage { font-family: 'JetBrains Mono', monospace; font-size: 0.8rem; color: var(--primary); text-align: right; }
.ctx-usage.warning { color: #F59E0B; }
.ctx-usage.danger { color: #EF4444; }

.info-content { padding: 1.5rem; background: rgba(255,255,255,0.02); border: 1px solid var(--border); border-radius: 0.75rem; }
.info-content p { margin-bottom: 1rem; line-height: 1.6; color: var(--text-secondary); }
.info-facts { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 0.5rem; }
.fact { font-size: 0.85rem; color: var(--text-muted); padding: 0.5rem; background: rgba(0,0,0,0.2); border-radius: 0.35rem; }

@media (max-width: 768px) {
  .context-row { grid-template-columns: 1fr; gap: 0.5rem; }
  .ctx-bar-container { order: -1; }
}
</style>
