<template>
  <div class="base64-app">
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
          <h1><span class="app-icon">🔐</span> Base64 Encoder</h1>
          <p>Encodez et décodez du texte en Base64</p>
        </div>

        <!-- MODE TOGGLE -->
        <div class="mode-toggle">
          <button :class="{ active: mode === 'encode' }" @click="mode = 'encode'; convert()">
            📤 Encoder
          </button>
          <button :class="{ active: mode === 'decode' }" @click="mode = 'decode'; convert()">
            📥 Décoder
          </button>
        </div>

        <!-- CONVERTER -->
        <div class="converter-grid">
          <!-- INPUT -->
          <div class="converter-panel">
            <div class="panel-header">
              <span class="panel-title">{{ mode === 'encode' ? 'Texte' : 'Base64' }}</span>
              <div class="panel-actions">
                <button class="mini-btn" @click="clearInput">🗑️</button>
                <button class="mini-btn" @click="pasteInput">📋</button>
              </div>
            </div>
            <textarea 
              v-model="input" 
              @input="convert"
              :placeholder="mode === 'encode' ? 'Entrez votre texte...' : 'Collez le Base64...'"
              class="panel-textarea"
            ></textarea>
            <div class="panel-stats">
              {{ input.length }} caractères
            </div>
          </div>

          <!-- ARROW -->
          <div class="converter-arrow">
            <span>{{ mode === 'encode' ? '→' : '←' }}</span>
          </div>

          <!-- OUTPUT -->
          <div class="converter-panel">
            <div class="panel-header">
              <span class="panel-title">{{ mode === 'encode' ? 'Base64' : 'Texte' }}</span>
              <div class="panel-actions">
                <button class="mini-btn" @click="copyOutput" :class="{ copied }">
                  {{ copied ? '✓' : '📋' }}
                </button>
              </div>
            </div>
            <textarea 
              :value="output" 
              readonly
              :placeholder="error ? '' : 'Résultat...'"
              class="panel-textarea"
              :class="{ 'panel-textarea--error': error }"
            ></textarea>
            <div class="panel-stats" :class="{ 'panel-stats--error': error }">
              {{ error || (output.length + ' caractères') }}
            </div>
          </div>
        </div>

        <!-- FILE UPLOAD -->
        <div class="file-section">
          <h2>📁 Encoder un fichier</h2>
          <div class="file-dropzone" 
               @drop.prevent="handleDrop" 
               @dragover.prevent="isDragging = true"
               @dragleave="isDragging = false"
               :class="{ 'file-dropzone--active': isDragging }">
            <input type="file" @change="handleFile" ref="fileInput" class="file-input">
            <div class="dropzone-content">
              <span class="dropzone-icon">📂</span>
              <p>Glissez un fichier ici ou <button @click="$refs.fileInput.click()">parcourez</button></p>
              <span class="dropzone-hint">Max 5 MB • Images, PDF, etc.</span>
            </div>
          </div>
          
          <div v-if="fileResult" class="file-result">
            <div class="file-info">
              <span class="file-name">{{ fileResult.name }}</span>
              <span class="file-size">{{ fileResult.size }}</span>
            </div>
            <textarea :value="fileResult.base64" readonly class="file-textarea"></textarea>
            <button class="action-btn" @click="copyFileBase64">
              {{ fileCopied ? '✓ Copié !' : '📋 Copier le Base64' }}
            </button>
          </div>
        </div>

        <!-- CHEAT SHEET -->
        <div class="cheatsheet">
          <h2>📖 Aide-mémoire</h2>
          <div class="cheatsheet-grid">
            <div class="cheat-item">
              <span class="cheat-label">Caractères valides</span>
              <code>A-Z a-z 0-9 + / =</code>
            </div>
            <div class="cheat-item">
              <span class="cheat-label">Padding</span>
              <code>= ou == en fin</code>
            </div>
            <div class="cheat-item">
              <span class="cheat-label">Ratio taille</span>
              <code>+33% vs texte</code>
            </div>
            <div class="cheat-item">
              <span class="cheat-label">Usage courant</span>
              <code>Data URLs, JWT, API</code>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const mode = ref('encode');
const input = ref('');
const output = ref('');
const error = ref('');
const copied = ref(false);
const fileCopied = ref(false);
const isDragging = ref(false);
const fileInput = ref(null);
const fileResult = ref(null);

function convert() {
  error.value = '';
  
  if (!input.value) {
    output.value = '';
    return;
  }

  try {
    if (mode.value === 'encode') {
      output.value = btoa(unescape(encodeURIComponent(input.value)));
    } else {
      output.value = decodeURIComponent(escape(atob(input.value)));
    }
  } catch (e) {
    output.value = '';
    error.value = mode.value === 'decode' ? 'Base64 invalide' : 'Erreur d\'encodage';
  }
}

function clearInput() {
  input.value = '';
  output.value = '';
  error.value = '';
}

async function pasteInput() {
  try {
    input.value = await navigator.clipboard.readText();
    convert();
  } catch (err) {
    console.error('Paste failed:', err);
  }
}

async function copyOutput() {
  try {
    await navigator.clipboard.writeText(output.value);
    copied.value = true;
    setTimeout(() => copied.value = false, 2000);
  } catch (err) {
    console.error('Copy failed:', err);
  }
}

function handleFile(e) {
  const file = e.target.files[0];
  if (file) processFile(file);
}

function handleDrop(e) {
  isDragging.value = false;
  const file = e.dataTransfer.files[0];
  if (file) processFile(file);
}

function processFile(file) {
  if (file.size > 5 * 1024 * 1024) {
    alert('Fichier trop volumineux (max 5 MB)');
    return;
  }

  const reader = new FileReader();
  reader.onload = () => {
    fileResult.value = {
      name: file.name,
      size: formatSize(file.size),
      base64: reader.result
    };
  };
  reader.readAsDataURL(file);
}

function formatSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / 1024 / 1024).toFixed(1) + ' MB';
}

async function copyFileBase64() {
  try {
    await navigator.clipboard.writeText(fileResult.value.base64);
    fileCopied.value = true;
    setTimeout(() => fileCopied.value = false, 2000);
  } catch (err) {
    console.error('Copy failed:', err);
  }
}

watch(mode, () => {
  // Swap input/output when mode changes
  const temp = input.value;
  input.value = output.value;
  output.value = temp;
  convert();
});
</script>

<style scoped>
.base64-app {
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

.app-main {
  padding: var(--space-lg) 0;
}

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

/* Mode Toggle */
.mode-toggle {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: var(--space-lg);
}

.mode-toggle button {
  padding: 0.75rem 2rem;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid var(--border);
  border-radius: 0.5rem;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.9rem;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.3s ease;
}

.mode-toggle button:hover {
  border-color: var(--primary);
}

.mode-toggle button.active {
  background: var(--primary);
  border-color: var(--primary);
  color: var(--bg-primary);
}

/* Converter Grid */
.converter-grid {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 1rem;
  align-items: stretch;
  margin-bottom: var(--space-xl);
}

.converter-panel {
  display: flex;
  flex-direction: column;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid var(--border);
  border-radius: 1rem;
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
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.panel-actions {
  display: flex;
  gap: 0.5rem;
}

.mini-btn {
  padding: 0.35rem 0.5rem;
  background: transparent;
  border: 1px solid var(--border);
  border-radius: 0.35rem;
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.mini-btn:hover {
  border-color: var(--primary);
}

.mini-btn.copied {
  background: var(--primary);
  border-color: var(--primary);
}

.panel-textarea {
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

.panel-textarea:focus {
  outline: none;
}

.panel-textarea--error {
  color: #EF4444;
}

.panel-stats {
  padding: 0.5rem 1rem;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.7rem;
  color: var(--text-muted);
  border-top: 1px solid var(--border);
}

.panel-stats--error {
  color: #EF4444;
}

.converter-arrow {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  color: var(--primary);
}

/* File Section */
.file-section {
  margin-bottom: var(--space-xl);
}

.file-section h2 {
  font-size: 1.1rem;
  margin-bottom: 1rem;
}

.file-dropzone {
  position: relative;
  padding: 3rem;
  background: rgba(255, 255, 255, 0.02);
  border: 2px dashed var(--border);
  border-radius: 1rem;
  text-align: center;
  transition: all 0.3s ease;
}

.file-dropzone--active {
  border-color: var(--primary);
  background: rgba(0, 255, 136, 0.05);
}

.file-input {
  display: none;
}

.dropzone-icon {
  font-size: 3rem;
  display: block;
  margin-bottom: 1rem;
  opacity: 0.5;
}

.dropzone-content p {
  color: var(--text-secondary);
  margin-bottom: 0.5rem;
}

.dropzone-content button {
  background: none;
  border: none;
  color: var(--primary);
  text-decoration: underline;
  cursor: pointer;
}

.dropzone-hint {
  font-size: 0.8rem;
  color: var(--text-muted);
}

.file-result {
  margin-top: 1.5rem;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid var(--border);
  border-radius: 1rem;
}

.file-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.file-name {
  font-weight: 600;
}

.file-size {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.85rem;
  color: var(--text-muted);
}

.file-textarea {
  width: 100%;
  height: 100px;
  padding: 0.75rem;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid var(--border);
  border-radius: 0.5rem;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.75rem;
  color: var(--text-muted);
  margin-bottom: 1rem;
  resize: none;
}

.action-btn {
  padding: 0.75rem 1.5rem;
  background: var(--primary);
  border: none;
  border-radius: 0.5rem;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.9rem;
  color: var(--bg-primary);
  cursor: pointer;
  transition: all 0.3s ease;
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(0, 255, 136, 0.3);
}

/* Cheatsheet */
.cheatsheet h2 {
  font-size: 1.1rem;
  margin-bottom: 1rem;
}

.cheatsheet-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.cheat-item {
  padding: 1rem;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid var(--border);
  border-radius: 0.75rem;
}

.cheat-label {
  display: block;
  font-size: 0.8rem;
  color: var(--text-muted);
  margin-bottom: 0.5rem;
}

.cheat-item code {
  font-family: 'JetBrains Mono', monospace;
  color: var(--primary);
}

@media (max-width: 768px) {
  .converter-grid {
    grid-template-columns: 1fr;
  }
  
  .converter-arrow {
    transform: rotate(90deg);
    padding: 1rem 0;
  }
}
</style>
