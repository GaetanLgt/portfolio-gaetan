<template>
  <div class="json-app">
    <a href="#main-content" class="skip-link">Aller au contenu principal</a>

    <!-- HEADER -->
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

    <!-- MAIN -->
    <main class="app-main" id="main-content">
      <div class="container">
        <div class="app-intro">
          <h1>
            <span class="app-icon">📋</span>
            JSON Formatter
          </h1>
          <p>Formatez, validez et minifiez votre JSON instantanément</p>
        </div>

        <!-- STATUS BAR -->
        <div class="status-bar" :class="statusClass">
          <span class="status-icon">{{ isValid ? '✓' : '✗' }}</span>
          <span class="status-text">{{ statusMessage }}</span>
          <span v-if="stats" class="status-stats">
            {{ stats.keys }} clés • {{ stats.arrays }} tableaux • {{ stats.depth }} niveaux
          </span>
        </div>

        <!-- ACTIONS -->
        <div class="action-bar">
          <button class="action-btn" @click="formatJson" :disabled="!isValid">
            ✨ Formatter
          </button>
          <button class="action-btn" @click="minifyJson" :disabled="!isValid">
            📦 Minifier
          </button>
          <button class="action-btn" @click="copyJson" :class="{ copied }" :disabled="!input">
            {{ copied ? '✓ Copié !' : '📋 Copier' }}
          </button>
          <button class="action-btn" @click="clearJson">
            🗑️ Effacer
          </button>
          <button class="action-btn action-btn--sample" @click="loadSample">
            📝 Exemple
          </button>
        </div>

        <!-- EDITOR -->
        <div class="editor-container">
          <div class="editor-wrapper">
            <div class="editor-header">
              <span class="editor-title">Input JSON</span>
              <span class="editor-size">{{ inputSize }}</span>
            </div>
            <div class="line-numbers" aria-hidden="true">
              <span v-for="n in lineCount" :key="n">{{ n }}</span>
            </div>
            <textarea 
              ref="editorRef"
              v-model="input"
              @input="validateJson"
              @keydown.tab.prevent="insertTab"
              class="editor-textarea"
              placeholder='{\n  "votre": "json",\n  "ici": true\n}'
              spellcheck="false"
            ></textarea>
          </div>
        </div>

        <!-- ERROR DETAILS -->
        <div v-if="error" class="error-panel">
          <div class="error-header">
            <span class="error-icon">⚠️</span>
            <span class="error-title">Erreur de syntaxe</span>
          </div>
          <div class="error-content">
            <p class="error-message">{{ error.message }}</p>
            <p v-if="error.position" class="error-position">
              Position approximative : ligne {{ error.line }}, colonne {{ error.column }}
            </p>
          </div>
        </div>

        <!-- TREE VIEW (when valid) -->
        <div v-if="isValid && parsedJson" class="tree-section">
          <div class="section-header">
            <h2>🌳 Structure JSON</h2>
            <button class="collapse-btn" @click="toggleAllNodes">
              {{ allExpanded ? '➖ Tout réduire' : '➕ Tout développer' }}
            </button>
          </div>
          <div class="tree-container">
            <JsonNode :data="parsedJson" :name="'root'" :depth="0" :expanded="allExpanded" />
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, defineComponent, h } from 'vue';

// JsonNode component (recursive)
const JsonNode = defineComponent({
  name: 'JsonNode',
  props: {
    data: { required: true },
    name: { type: String, default: '' },
    depth: { type: Number, default: 0 },
    expanded: { type: Boolean, default: true }
  },
  setup(props) {
    const isExpanded = ref(props.expanded);
    
    watch(() => props.expanded, (val) => {
      isExpanded.value = val;
    });

    const isObject = computed(() => props.data !== null && typeof props.data === 'object');
    const isArray = computed(() => Array.isArray(props.data));
    const isEmpty = computed(() => {
      if (isArray.value) return props.data.length === 0;
      if (isObject.value) return Object.keys(props.data).length === 0;
      return false;
    });

    const toggle = () => {
      if (isObject.value && !isEmpty.value) {
        isExpanded.value = !isExpanded.value;
      }
    };

    const getType = (val) => {
      if (val === null) return 'null';
      if (Array.isArray(val)) return 'array';
      return typeof val;
    };

    const formatValue = (val) => {
      if (val === null) return 'null';
      if (typeof val === 'string') return `"${val}"`;
      if (typeof val === 'boolean') return val ? 'true' : 'false';
      return String(val);
    };

    return () => {
      const children = [];
      
      // Key name
      if (props.name && props.name !== 'root') {
        children.push(h('span', { class: 'tree-key' }, `"${props.name}": `));
      }

      if (isObject.value) {
        const entries = isArray.value ? props.data : Object.entries(props.data);
        const bracket = isArray.value ? ['[', ']'] : ['{', '}'];
        const count = isArray.value ? props.data.length : Object.keys(props.data).length;

        children.push(
          h('span', { 
            class: ['tree-bracket', { 'tree-bracket--clickable': !isEmpty.value }],
            onClick: toggle
          }, [
            !isEmpty.value && h('span', { class: 'tree-toggle' }, isExpanded.value ? '▼' : '▶'),
            bracket[0],
            !isExpanded.value && !isEmpty.value && h('span', { class: 'tree-collapsed' }, `...${count} items`),
            isEmpty.value && bracket[1]
          ])
        );

        if (isExpanded.value && !isEmpty.value) {
          const items = isArray.value 
            ? props.data.map((item, i) => h(JsonNode, { data: item, name: String(i), depth: props.depth + 1, expanded: props.expanded, key: i }))
            : Object.entries(props.data).map(([key, val]) => h(JsonNode, { data: val, name: key, depth: props.depth + 1, expanded: props.expanded, key }));

          children.push(
            h('div', { class: 'tree-children' }, items),
            h('span', { class: 'tree-bracket' }, bracket[1])
          );
        }
      } else {
        const type = getType(props.data);
        children.push(
          h('span', { class: `tree-value tree-value--${type}` }, formatValue(props.data))
        );
      }

      return h('div', { class: 'tree-node', style: { paddingLeft: props.depth > 0 ? '1.5rem' : '0' } }, children);
    };
  }
});

// State
const input = ref('');
const editorRef = ref(null);
const isValid = ref(false);
const error = ref(null);
const parsedJson = ref(null);
const copied = ref(false);
const allExpanded = ref(true);

// Computed
const lineCount = computed(() => {
  return input.value.split('\n').length;
});

const inputSize = computed(() => {
  const bytes = new Blob([input.value]).size;
  if (bytes < 1024) return `${bytes} B`;
  return `${(bytes / 1024).toFixed(1)} KB`;
});

const statusClass = computed(() => ({
  'status--valid': isValid.value && input.value,
  'status--invalid': !isValid.value && input.value,
  'status--empty': !input.value
}));

const statusMessage = computed(() => {
  if (!input.value) return 'En attente de JSON...';
  return isValid.value ? 'JSON valide ✓' : 'JSON invalide';
});

const stats = computed(() => {
  if (!isValid.value || !parsedJson.value) return null;
  
  let keys = 0;
  let arrays = 0;
  let maxDepth = 0;

  const analyze = (obj, depth = 0) => {
    maxDepth = Math.max(maxDepth, depth);
    if (Array.isArray(obj)) {
      arrays++;
      obj.forEach(item => {
        if (typeof item === 'object' && item !== null) analyze(item, depth + 1);
      });
    } else if (typeof obj === 'object' && obj !== null) {
      const objKeys = Object.keys(obj);
      keys += objKeys.length;
      objKeys.forEach(key => {
        if (typeof obj[key] === 'object' && obj[key] !== null) analyze(obj[key], depth + 1);
      });
    }
  };

  analyze(parsedJson.value);
  return { keys, arrays, depth: maxDepth };
});

// Methods
function validateJson() {
  if (!input.value.trim()) {
    isValid.value = false;
    error.value = null;
    parsedJson.value = null;
    return;
  }

  try {
    parsedJson.value = JSON.parse(input.value);
    isValid.value = true;
    error.value = null;
  } catch (e) {
    isValid.value = false;
    parsedJson.value = null;
    
    // Parse error position
    const match = e.message.match(/position (\d+)/);
    if (match) {
      const pos = parseInt(match[1]);
      const lines = input.value.substring(0, pos).split('\n');
      error.value = {
        message: e.message,
        position: pos,
        line: lines.length,
        column: lines[lines.length - 1].length + 1
      };
    } else {
      error.value = { message: e.message };
    }
  }
}

function formatJson() {
  if (isValid.value && parsedJson.value) {
    input.value = JSON.stringify(parsedJson.value, null, 2);
  }
}

function minifyJson() {
  if (isValid.value && parsedJson.value) {
    input.value = JSON.stringify(parsedJson.value);
  }
}

async function copyJson() {
  try {
    await navigator.clipboard.writeText(input.value);
    copied.value = true;
    setTimeout(() => copied.value = false, 2000);
  } catch (err) {
    console.error('Copy failed:', err);
  }
}

function clearJson() {
  input.value = '';
  validateJson();
}

function loadSample() {
  input.value = JSON.stringify({
    "name": "GL Digital Lab",
    "type": "Agence Web",
    "location": {
      "city": "Limoges",
      "country": "France",
      "coordinates": [45.8336, 1.2611]
    },
    "services": [
      "Développement Web",
      "Applications Métier",
      "Intégration IA"
    ],
    "technologies": {
      "backend": ["Symfony", "PHP 8.3+", "PostgreSQL"],
      "frontend": ["Vue 3", "Three.js", "TypeScript"],
      "ai": ["Ollama", "ChromaDB", "n8n"]
    },
    "stats": {
      "projects": 50,
      "uptime": 99.9,
      "satisfaction": true
    },
    "contact": null
  }, null, 2);
  validateJson();
}

function insertTab(e) {
  const start = e.target.selectionStart;
  const end = e.target.selectionEnd;
  input.value = input.value.substring(0, start) + '  ' + input.value.substring(end);
  e.target.selectionStart = e.target.selectionEnd = start + 2;
}

function toggleAllNodes() {
  allExpanded.value = !allExpanded.value;
}

// Init
onMounted(() => {
  validateJson();
});
</script>

<style scoped>
.json-app {
  min-height: 100vh;
  background: var(--bg-primary);
}

/* Header */
.app-header {
  position: relative;
  z-index: 10;
  padding: 1rem 0;
  border-bottom: 1px solid var(--border);
  background: rgba(10, 10, 15, 0.9);
  backdrop-filter: blur(10px);
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-muted);
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.3s ease;
}

.back-link:hover {
  color: var(--primary);
}

/* Main */
.app-main {
  padding: var(--space-lg) 0 var(--space-xl);
}

.app-intro {
  text-align: center;
  margin-bottom: var(--space-md);
}

.app-intro h1 {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.app-icon {
  font-size: 2.5rem;
}

.app-intro p {
  color: var(--text-muted);
}

/* Status Bar */
.status-bar {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.85rem;
  transition: all 0.3s ease;
}

.status--empty {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid var(--border);
}

.status--valid {
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.3);
  color: #10B981;
}

.status--invalid {
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: #EF4444;
}

.status-icon {
  font-size: 1rem;
}

.status-text {
  font-weight: 600;
}

.status-stats {
  margin-left: auto;
  color: var(--text-muted);
  font-size: 0.75rem;
}

/* Action Bar */
.action-bar {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.action-btn {
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid var(--border);
  border-radius: 0.5rem;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.8rem;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.3s ease;
}

.action-btn:hover:not(:disabled) {
  border-color: var(--primary);
  color: var(--primary);
}

.action-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.action-btn.copied {
  background: var(--primary);
  border-color: var(--primary);
  color: var(--bg-primary);
}

.action-btn--sample {
  margin-left: auto;
  background: rgba(0, 255, 136, 0.05);
  border-color: rgba(0, 255, 136, 0.2);
  color: var(--primary);
}

/* Editor */
.editor-container {
  margin-bottom: var(--space-md);
}

.editor-wrapper {
  position: relative;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid var(--border);
  border-radius: 0.75rem;
  overflow: hidden;
}

.editor-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  background: rgba(255, 255, 255, 0.02);
  border-bottom: 1px solid var(--border);
}

.editor-title {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.75rem;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.editor-size {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.7rem;
  color: var(--primary);
}

.line-numbers {
  position: absolute;
  top: 50px;
  left: 0;
  width: 50px;
  padding: 1rem 0;
  background: rgba(0, 0, 0, 0.2);
  border-right: 1px solid var(--border);
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.85rem;
  line-height: 1.5;
  color: var(--text-dark);
  text-align: right;
  pointer-events: none;
  user-select: none;
}

.line-numbers span {
  display: block;
  padding-right: 1rem;
}

.editor-textarea {
  width: 100%;
  min-height: 300px;
  padding: 1rem 1rem 1rem 60px;
  background: transparent;
  border: none;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.85rem;
  line-height: 1.5;
  color: var(--text-main);
  resize: vertical;
}

.editor-textarea:focus {
  outline: none;
}

.editor-textarea::placeholder {
  color: var(--text-dark);
}

/* Error Panel */
.error-panel {
  padding: 1rem;
  background: rgba(239, 68, 68, 0.05);
  border: 1px solid rgba(239, 68, 68, 0.2);
  border-radius: 0.75rem;
  margin-bottom: var(--space-md);
}

.error-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.error-icon {
  font-size: 1.25rem;
}

.error-title {
  font-weight: 600;
  color: #EF4444;
}

.error-message {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.85rem;
  color: var(--text-secondary);
  margin-bottom: 0.25rem;
}

.error-position {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.75rem;
  color: var(--text-muted);
}

/* Tree View */
.tree-section {
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid var(--border);
  border-radius: 0.75rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.section-header h2 {
  font-size: 1rem;
}

.collapse-btn {
  padding: 0.35rem 0.75rem;
  background: transparent;
  border: 1px solid var(--border);
  border-radius: 0.35rem;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.7rem;
  color: var(--text-muted);
  cursor: pointer;
  transition: all 0.2s ease;
}

.collapse-btn:hover {
  border-color: var(--primary);
  color: var(--primary);
}

.tree-container {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.85rem;
  line-height: 1.6;
  overflow-x: auto;
}

/* Tree Node Styles (global for recursive component) */
:deep(.tree-node) {
  white-space: nowrap;
}

:deep(.tree-key) {
  color: #9CDCFE;
}

:deep(.tree-bracket) {
  color: var(--text-muted);
}

:deep(.tree-bracket--clickable) {
  cursor: pointer;
}

:deep(.tree-bracket--clickable:hover) {
  color: var(--primary);
}

:deep(.tree-toggle) {
  display: inline-block;
  width: 1rem;
  font-size: 0.65rem;
  color: var(--text-dark);
}

:deep(.tree-collapsed) {
  color: var(--text-dark);
  font-style: italic;
  margin-left: 0.25rem;
}

:deep(.tree-children) {
  border-left: 1px dashed var(--border);
  margin-left: 0.5rem;
}

:deep(.tree-value--string) { color: #CE9178; }
:deep(.tree-value--number) { color: #B5CEA8; }
:deep(.tree-value--boolean) { color: #569CD6; }
:deep(.tree-value--null) { color: #569CD6; font-style: italic; }

/* Responsive */
@media (max-width: 768px) {
  .action-bar {
    justify-content: center;
  }
  
  .action-btn--sample {
    margin-left: 0;
    width: 100%;
  }
  
  .status-stats {
    display: none;
  }
}
</style>
