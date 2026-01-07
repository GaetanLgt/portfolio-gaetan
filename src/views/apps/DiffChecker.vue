<template>
  <div class="diff-app">
    <a href="#main-content" class="skip-link">Aller au contenu principal</a>

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

    <main class="app-main" id="main-content">
      <div class="container">
        <div class="app-intro">
          <h1><span class="app-icon">📊</span> Diff Checker</h1>
          <p>Comparez deux textes et visualisez les différences ligne par ligne</p>
        </div>

        <!-- INPUTS -->
        <div class="inputs-grid">
          <div class="input-panel">
            <div class="panel-header">
              <span class="panel-title">📄 Texte original</span>
              <button class="clear-btn" @click="textA = ''">🗑️</button>
            </div>
            <textarea 
              v-model="textA" 
              @input="compare"
              placeholder="Collez le texte original ici..."
              class="input-textarea"
            ></textarea>
            <div class="panel-stats">{{ textA.split('\n').length }} lignes • {{ textA.length }} caractères</div>
          </div>

          <div class="input-panel">
            <div class="panel-header">
              <span class="panel-title">📝 Texte modifié</span>
              <button class="clear-btn" @click="textB = ''">🗑️</button>
            </div>
            <textarea 
              v-model="textB" 
              @input="compare"
              placeholder="Collez le texte modifié ici..."
              class="input-textarea"
            ></textarea>
            <div class="panel-stats">{{ textB.split('\n').length }} lignes • {{ textB.length }} caractères</div>
          </div>
        </div>

        <!-- OPTIONS -->
        <div class="options-bar">
          <label class="checkbox-label">
            <input type="checkbox" v-model="ignoreWhitespace" @change="compare">
            <span class="checkbox-box"></span>
            <span>Ignorer les espaces</span>
          </label>
          <label class="checkbox-label">
            <input type="checkbox" v-model="ignoreCase" @change="compare">
            <span class="checkbox-box"></span>
            <span>Ignorer la casse</span>
          </label>
          <button class="swap-btn" @click="swapTexts">🔄 Inverser</button>
        </div>

        <!-- STATS -->
        <div class="stats-bar" v-if="diffResult.length">
          <div class="stat stat--added">
            <span class="stat-icon">+</span>
            <span class="stat-value">{{ addedCount }}</span>
            <span class="stat-label">ajoutées</span>
          </div>
          <div class="stat stat--removed">
            <span class="stat-icon">−</span>
            <span class="stat-value">{{ removedCount }}</span>
            <span class="stat-label">supprimées</span>
          </div>
          <div class="stat stat--unchanged">
            <span class="stat-icon">=</span>
            <span class="stat-value">{{ unchangedCount }}</span>
            <span class="stat-label">identiques</span>
          </div>
        </div>

        <!-- DIFF OUTPUT -->
        <div class="diff-output" v-if="diffResult.length">
          <div class="diff-header">
            <span>Résultat de la comparaison</span>
            <button class="copy-btn" @click="copyDiff" :class="{ copied }">
              {{ copied ? '✓ Copié' : '📋 Copier' }}
            </button>
          </div>
          <div class="diff-content">
            <div 
              v-for="(line, i) in diffResult" 
              :key="i" 
              class="diff-line"
              :class="'diff-line--' + line.type"
            >
              <span class="line-number">{{ line.lineNum || '' }}</span>
              <span class="line-symbol">{{ line.symbol }}</span>
              <span class="line-content">{{ line.content || '(ligne vide)' }}</span>
            </div>
          </div>
        </div>

        <!-- EMPTY STATE -->
        <div class="empty-state" v-else-if="textA || textB">
          <span class="empty-icon">✓</span>
          <p>Les deux textes sont identiques</p>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const textA = ref('');
const textB = ref('');
const ignoreWhitespace = ref(false);
const ignoreCase = ref(false);
const diffResult = ref([]);
const copied = ref(false);

const addedCount = computed(() => diffResult.value.filter(l => l.type === 'added').length);
const removedCount = computed(() => diffResult.value.filter(l => l.type === 'removed').length);
const unchangedCount = computed(() => diffResult.value.filter(l => l.type === 'unchanged').length);

function normalize(text) {
  let result = text;
  if (ignoreWhitespace.value) {
    result = result.replace(/\s+/g, ' ').trim();
  }
  if (ignoreCase.value) {
    result = result.toLowerCase();
  }
  return result;
}

function compare() {
  if (!textA.value && !textB.value) {
    diffResult.value = [];
    return;
  }

  const linesA = textA.value.split('\n');
  const linesB = textB.value.split('\n');
  
  // Simple diff algorithm (LCS-based)
  const result = [];
  const normA = linesA.map(normalize);
  const normB = linesB.map(normalize);
  
  let i = 0, j = 0;
  let lineNumA = 1, lineNumB = 1;
  
  while (i < linesA.length || j < linesB.length) {
    if (i >= linesA.length) {
      // Rest of B are additions
      result.push({ type: 'added', symbol: '+', content: linesB[j], lineNum: lineNumB++ });
      j++;
    } else if (j >= linesB.length) {
      // Rest of A are removals
      result.push({ type: 'removed', symbol: '−', content: linesA[i], lineNum: lineNumA++ });
      i++;
    } else if (normA[i] === normB[j]) {
      // Lines match
      result.push({ type: 'unchanged', symbol: ' ', content: linesA[i], lineNum: lineNumA++ });
      lineNumB++;
      i++;
      j++;
    } else {
      // Look ahead for potential match
      let foundInB = normB.slice(j + 1, j + 5).indexOf(normA[i]);
      let foundInA = normA.slice(i + 1, i + 5).indexOf(normB[j]);
      
      if (foundInB !== -1 && (foundInA === -1 || foundInB <= foundInA)) {
        // Lines added in B
        for (let k = 0; k <= foundInB; k++) {
          result.push({ type: 'added', symbol: '+', content: linesB[j], lineNum: lineNumB++ });
          j++;
        }
      } else if (foundInA !== -1) {
        // Lines removed from A
        for (let k = 0; k <= foundInA; k++) {
          result.push({ type: 'removed', symbol: '−', content: linesA[i], lineNum: lineNumA++ });
          i++;
        }
      } else {
        // No match found, show as change
        result.push({ type: 'removed', symbol: '−', content: linesA[i], lineNum: lineNumA++ });
        result.push({ type: 'added', symbol: '+', content: linesB[j], lineNum: lineNumB++ });
        i++;
        j++;
      }
    }
  }
  
  // Filter out if all unchanged
  if (result.every(r => r.type === 'unchanged')) {
    diffResult.value = [];
  } else {
    diffResult.value = result;
  }
}

function swapTexts() {
  const temp = textA.value;
  textA.value = textB.value;
  textB.value = temp;
  compare();
}

async function copyDiff() {
  const text = diffResult.value
    .map(l => `${l.symbol} ${l.content}`)
    .join('\n');
  
  try {
    await navigator.clipboard.writeText(text);
    copied.value = true;
    setTimeout(() => copied.value = false, 2000);
  } catch (err) {
    console.error('Copy failed:', err);
  }
}
</script>

<style scoped>
.diff-app {
  min-height: 100vh;
  background: var(--bg-primary);
}

.app-header {
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

.back-link:hover { color: var(--primary); }

.app-main { padding: var(--space-lg) 0; }

.app-intro {
  text-align: center;
  margin-bottom: var(--space-lg);
}

.app-intro h1 {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.app-icon { font-size: 2.5rem; }
.app-intro p { color: var(--text-muted); }

/* Inputs Grid */
.inputs-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: var(--space-md);
}

.input-panel {
  display: flex;
  flex-direction: column;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid var(--border);
  border-radius: 0.75rem;
  overflow: hidden;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  background: rgba(0, 0, 0, 0.2);
  border-bottom: 1px solid var(--border);
}

.panel-title {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.8rem;
  color: var(--text-muted);
}

.clear-btn {
  padding: 0.25rem 0.5rem;
  background: transparent;
  border: 1px solid var(--border);
  border-radius: 0.25rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.clear-btn:hover { border-color: var(--primary); }

.input-textarea {
  flex: 1;
  min-height: 200px;
  padding: 1rem;
  background: transparent;
  border: none;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.85rem;
  color: var(--text-main);
  resize: vertical;
}

.input-textarea:focus { outline: none; }

.panel-stats {
  padding: 0.5rem 1rem;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.7rem;
  color: var(--text-dark);
  border-top: 1px solid var(--border);
}

/* Options Bar */
.options-bar {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: var(--space-md);
  flex-wrap: wrap;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-size: 0.85rem;
  color: var(--text-secondary);
}

.checkbox-label input { display: none; }

.checkbox-box {
  width: 18px;
  height: 18px;
  border: 2px solid var(--border);
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.checkbox-label input:checked + .checkbox-box {
  background: var(--primary);
  border-color: var(--primary);
}

.checkbox-label input:checked + .checkbox-box::after {
  content: '✓';
  color: var(--bg-primary);
  font-size: 0.7rem;
}

.swap-btn {
  margin-left: auto;
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--border);
  border-radius: 0.5rem;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.8rem;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s ease;
}

.swap-btn:hover { border-color: var(--primary); color: var(--primary); }

/* Stats Bar */
.stats-bar {
  display: flex;
  gap: 2rem;
  margin-bottom: var(--space-md);
  padding: 1rem;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid var(--border);
  border-radius: 0.75rem;
}

.stat {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.stat-icon {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  font-weight: bold;
}

.stat--added .stat-icon { background: rgba(16, 185, 129, 0.2); color: #10B981; }
.stat--removed .stat-icon { background: rgba(239, 68, 68, 0.2); color: #EF4444; }
.stat--unchanged .stat-icon { background: rgba(148, 163, 184, 0.2); color: #94A3B8; }

.stat-value { font-weight: 600; color: var(--text-main); }
.stat-label { font-size: 0.8rem; color: var(--text-muted); }

/* Diff Output */
.diff-output {
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid var(--border);
  border-radius: 0.75rem;
  overflow: hidden;
}

.diff-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  background: rgba(0, 0, 0, 0.2);
  border-bottom: 1px solid var(--border);
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.8rem;
  color: var(--text-muted);
}

.copy-btn {
  padding: 0.35rem 0.75rem;
  background: transparent;
  border: 1px solid var(--border);
  border-radius: 0.35rem;
  font-size: 0.75rem;
  color: var(--text-muted);
  cursor: pointer;
  transition: all 0.2s ease;
}

.copy-btn:hover { border-color: var(--primary); color: var(--primary); }
.copy-btn.copied { background: var(--primary); border-color: var(--primary); color: var(--bg-primary); }

.diff-content {
  max-height: 500px;
  overflow-y: auto;
}

.diff-line {
  display: flex;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.85rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.03);
}

.diff-line--added { background: rgba(16, 185, 129, 0.1); }
.diff-line--removed { background: rgba(239, 68, 68, 0.1); }
.diff-line--unchanged { background: transparent; }

.line-number {
  width: 50px;
  padding: 0.5rem;
  text-align: right;
  color: var(--text-dark);
  background: rgba(0, 0, 0, 0.2);
  border-right: 1px solid var(--border);
}

.line-symbol {
  width: 30px;
  padding: 0.5rem;
  text-align: center;
  font-weight: bold;
}

.diff-line--added .line-symbol { color: #10B981; }
.diff-line--removed .line-symbol { color: #EF4444; }
.diff-line--unchanged .line-symbol { color: var(--text-dark); }

.line-content {
  flex: 1;
  padding: 0.5rem 1rem;
  white-space: pre-wrap;
  word-break: break-all;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 3rem;
  color: var(--text-muted);
}

.empty-icon {
  font-size: 3rem;
  display: block;
  margin-bottom: 1rem;
  color: var(--primary);
}

@media (max-width: 768px) {
  .inputs-grid { grid-template-columns: 1fr; }
  .stats-bar { flex-wrap: wrap; gap: 1rem; }
}
</style>
