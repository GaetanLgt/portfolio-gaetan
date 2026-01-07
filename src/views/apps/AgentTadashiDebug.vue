<template>
  <div class="agent-app">
    <header class="app-header">
      <div class="container">
        <router-link to="/apps" class="back-link">← Retour aux Apps</router-link>
        <span class="agent-badge" style="--agent-color: #F97316">🐛 TADASHI</span>
      </div>
    </header>
    <main class="app-main">
      <div class="container">
        <div class="app-intro">
          <h1><span class="app-icon">🐛</span> Debug Assistant</h1>
          <p class="app-desc">Assistant intelligent de débogage et résolution de problèmes</p>
          <div class="agent-team">
            <span class="team-badge dev">🛠️ Équipe Développement</span>
          </div>
        </div>

        <!-- FEATURES -->
        <div class="features-grid">
          <div class="feature-card">
            <span class="feature-icon">🔍</span>
            <h3>Analyse d'erreurs</h3>
            <p>Collez vos stack traces et logs pour une analyse intelligente</p>
          </div>
          <div class="feature-card">
            <span class="feature-icon">💡</span>
            <h3>Suggestions de fix</h3>
            <p>Recevez des recommandations de correction contextualisées</p>
          </div>
          <div class="feature-card">
            <span class="feature-icon">📚</span>
            <h3>Base de connaissances</h3>
            <p>Accédez à des solutions pour les erreurs courantes</p>
          </div>
          <div class="feature-card">
            <span class="feature-icon">🧪</span>
            <h3>Tests de régression</h3>
            <p>Générez des tests pour éviter les régressions</p>
          </div>
        </div>

        <!-- DEBUG INPUT -->
        <div class="debug-section">
          <h2>🐛 Analysez votre erreur</h2>
          <div class="input-group">
            <label>Type d'erreur</label>
            <select v-model="errorType" class="select-input">
              <option value="stacktrace">Stack Trace</option>
              <option value="log">Logs</option>
              <option value="console">Console Browser</option>
              <option value="sql">SQL Error</option>
              <option value="api">API Response</option>
            </select>
          </div>
          <div class="input-group">
            <label>Langage / Framework</label>
            <select v-model="language" class="select-input">
              <option value="php">PHP / Symfony</option>
              <option value="js">JavaScript / Vue</option>
              <option value="python">Python</option>
              <option value="sql">SQL</option>
              <option value="docker">Docker</option>
            </select>
          </div>
          <div class="input-group">
            <label>Collez votre erreur ici</label>
            <textarea v-model="errorInput" class="code-input" rows="10" placeholder="Collez votre stack trace, log ou message d'erreur..."></textarea>
          </div>
          <button @click="analyzeError" class="analyze-btn" :disabled="analyzing">
            {{ analyzing ? '🔄 Analyse en cours...' : '🐛 Analyser l\'erreur' }}
          </button>
        </div>

        <!-- RESULTS -->
        <div v-if="analysis" class="analysis-section">
          <div class="analysis-header">
            <h2>📊 Analyse TADASHI</h2>
            <span class="confidence-badge" :class="analysis.confidence">
              Confiance: {{ analysis.confidenceLabel }}
            </span>
          </div>

          <div class="analysis-card">
            <h3>🎯 Diagnostic</h3>
            <p class="diagnosis">{{ analysis.diagnosis }}</p>
          </div>

          <div class="analysis-card">
            <h3>💡 Cause probable</h3>
            <p>{{ analysis.cause }}</p>
          </div>

          <div class="analysis-card">
            <h3>🔧 Solutions recommandées</h3>
            <ol class="solutions-list">
              <li v-for="(solution, i) in analysis.solutions" :key="i">
                <strong>{{ solution.title }}</strong>
                <p>{{ solution.description }}</p>
                <pre v-if="solution.code"><code>{{ solution.code }}</code></pre>
              </li>
            </ol>
          </div>

          <div class="analysis-card">
            <h3>📚 Ressources</h3>
            <ul class="resources-list">
              <li v-for="(res, i) in analysis.resources" :key="i">
                <a :href="res.url" target="_blank">{{ res.title }}</a>
              </li>
            </ul>
          </div>
        </div>

        <!-- COMMON ERRORS -->
        <div class="common-errors">
          <h2>📋 Erreurs courantes</h2>
          <div class="errors-grid">
            <div v-for="err in commonErrors" :key="err.id" class="error-card" @click="loadExample(err)">
              <span class="error-icon">{{ err.icon }}</span>
              <span class="error-name">{{ err.name }}</span>
              <span class="error-lang">{{ err.lang }}</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const errorType = ref('stacktrace');
const language = ref('php');
const errorInput = ref('');
const analyzing = ref(false);
const analysis = ref(null);

const commonErrors = [
  { id: 1, icon: '🔴', name: 'CORS Error', lang: 'JavaScript' },
  { id: 2, icon: '🟠', name: 'Memory Limit', lang: 'PHP' },
  { id: 3, icon: '🟡', name: 'Undefined Variable', lang: 'PHP' },
  { id: 4, icon: '🔵', name: 'Connection Refused', lang: 'SQL' },
  { id: 5, icon: '🟣', name: 'Module Not Found', lang: 'Node.js' },
  { id: 6, icon: '⚪', name: 'Docker Build Failed', lang: 'Docker' },
];

const analyzeError = () => {
  if (!errorInput.value.trim()) return;
  
  analyzing.value = true;
  
  setTimeout(() => {
    analysis.value = {
      confidence: 'high',
      confidenceLabel: '92%',
      diagnosis: 'Erreur de type "Undefined array key" détectée dans votre code PHP.',
      cause: 'Vous essayez d\'accéder à une clé de tableau qui n\'existe pas. Cela se produit souvent lorsque les données attendues ne sont pas présentes.',
      solutions: [
        {
          title: 'Vérifier l\'existence de la clé',
          description: 'Utilisez isset() ou l\'opérateur null coalescing avant d\'accéder à la clé.',
          code: '$value = $array[\'key\'] ?? \'default\';'
        },
        {
          title: 'Utiliser array_key_exists()',
          description: 'Pour une vérification plus explicite.',
          code: 'if (array_key_exists(\'key\', $array)) { ... }'
        }
      ],
      resources: [
        { title: 'Documentation PHP - Arrays', url: 'https://www.php.net/manual/en/language.types.array.php' },
        { title: 'Null Coalescing Operator', url: 'https://www.php.net/manual/en/language.operators.comparison.php' }
      ]
    };
    analyzing.value = false;
  }, 1500);
};

const loadExample = (err) => {
  errorInput.value = `Example error: ${err.name} in ${err.lang}`;
};
</script>

<style scoped>
.agent-app {
  min-height: 100vh;
  background: #0a0a0a;
  color: #f5f5f5;
}

.app-header {
  padding: 1rem 0;
  border-bottom: 1px solid rgba(255,255,255,0.1);
  background: rgba(0,0,0,0.5);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.back-link {
  color: #737373;
  text-decoration: none;
  font-size: 0.9rem;
  margin-right: 1rem;
}

.back-link:hover {
  color: #00ff88;
}

.agent-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.4rem 1rem;
  background: rgba(249, 115, 22, 0.1);
  border: 1px solid rgba(249, 115, 22, 0.3);
  border-radius: 2rem;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.8rem;
  color: #F97316;
}

.app-main {
  padding: 3rem 0;
}

.app-intro {
  text-align: center;
  margin-bottom: 3rem;
}

.app-intro h1 {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
}

.app-icon {
  font-size: 2.5rem;
}

.app-desc {
  color: #a3a3a3;
  font-size: 1.1rem;
  margin-bottom: 1rem;
}

.team-badge {
  display: inline-block;
  padding: 0.3rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 600;
}

.team-badge.dev {
  background: rgba(249, 115, 22, 0.1);
  color: #F97316;
  border: 1px solid rgba(249, 115, 22, 0.3);
}

/* Features Grid */
.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.feature-card {
  padding: 1.5rem;
  background: rgba(255,255,255,0.02);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 1rem;
  text-align: center;
}

.feature-icon {
  font-size: 2.5rem;
  display: block;
  margin-bottom: 1rem;
}

.feature-card h3 {
  font-size: 1rem;
  margin-bottom: 0.5rem;
}

.feature-card p {
  font-size: 0.85rem;
  color: #737373;
}

/* Debug Section */
.debug-section {
  background: rgba(255,255,255,0.02);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 1rem;
  padding: 2rem;
  margin-bottom: 2rem;
}

.debug-section h2 {
  margin-bottom: 1.5rem;
}

.input-group {
  margin-bottom: 1rem;
}

.input-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  color: #a3a3a3;
}

.select-input,
.code-input {
  width: 100%;
  padding: 0.75rem 1rem;
  background: rgba(0,0,0,0.3);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 0.5rem;
  color: #f5f5f5;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.9rem;
}

.code-input {
  resize: vertical;
  min-height: 150px;
}

.analyze-btn {
  width: 100%;
  padding: 1rem;
  background: #F97316;
  border: none;
  border-radius: 0.5rem;
  color: white;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s;
}

.analyze-btn:hover:not(:disabled) {
  background: #ea580c;
  transform: translateY(-2px);
}

.analyze-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Analysis Section */
.analysis-section {
  margin-top: 2rem;
}

.analysis-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.confidence-badge {
  padding: 0.3rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.8rem;
  font-weight: 600;
}

.confidence-badge.high {
  background: rgba(16, 185, 129, 0.1);
  color: #10B981;
}

.analysis-card {
  background: rgba(255,255,255,0.02);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 1rem;
  padding: 1.5rem;
  margin-bottom: 1rem;
}

.analysis-card h3 {
  font-size: 1rem;
  margin-bottom: 1rem;
  color: #F97316;
}

.diagnosis {
  font-size: 1.1rem;
  line-height: 1.6;
}

.solutions-list {
  padding-left: 1.5rem;
}

.solutions-list li {
  margin-bottom: 1rem;
}

.solutions-list pre {
  margin-top: 0.5rem;
  padding: 1rem;
  background: rgba(0,0,0,0.3);
  border-radius: 0.5rem;
  overflow-x: auto;
}

.solutions-list code {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.85rem;
  color: #10B981;
}

.resources-list {
  list-style: none;
  padding: 0;
}

.resources-list li {
  margin-bottom: 0.5rem;
}

.resources-list a {
  color: #00ff88;
  text-decoration: none;
}

.resources-list a:hover {
  text-decoration: underline;
}

/* Common Errors */
.common-errors {
  margin-top: 3rem;
}

.common-errors h2 {
  margin-bottom: 1.5rem;
}

.errors-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 1rem;
}

.error-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1.5rem;
  background: rgba(255,255,255,0.02);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 1rem;
  cursor: pointer;
  transition: all 0.3s;
}

.error-card:hover {
  border-color: #F97316;
  transform: translateY(-4px);
}

.error-icon {
  font-size: 2rem;
}

.error-name {
  font-weight: 600;
  text-align: center;
}

.error-lang {
  font-size: 0.75rem;
  color: #737373;
}
</style>
