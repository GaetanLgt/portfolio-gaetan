<template>
  <div class="uuid-app">
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
          <h1><span class="app-icon">🆔</span> UUID Generator</h1>
          <p>Générez des identifiants uniques universels (UUID v4)</p>
        </div>

        <!-- SINGLE UUID -->
        <div class="single-uuid-section">
          <div class="uuid-display" @click="copySingle">
            <span class="uuid-text">{{ currentUuid }}</span>
            <span class="uuid-copy">{{ singleCopied ? '✓' : '📋' }}</span>
          </div>
          <div class="uuid-actions">
            <button class="action-btn action-btn--primary" @click="generateSingle">
              🎲 Nouveau UUID
            </button>
            <button class="action-btn" @click="copySingle">
              {{ singleCopied ? '✓ Copié !' : '📋 Copier' }}
            </button>
          </div>
        </div>

        <!-- BULK GENERATOR -->
        <div class="bulk-section">
          <h2>📦 Génération en masse</h2>
          
          <div class="bulk-controls">
            <div class="control-group">
              <label>Quantité : {{ bulkCount }}</label>
              <input type="range" v-model.number="bulkCount" min="1" max="100" class="slider">
            </div>
            
            <div class="format-options">
              <label class="radio-label">
                <input type="radio" v-model="format" value="plain">
                <span class="radio-box"></span>
                <span>Standard</span>
              </label>
              <label class="radio-label">
                <input type="radio" v-model="format" value="uppercase">
                <span class="radio-box"></span>
                <span>MAJUSCULES</span>
              </label>
              <label class="radio-label">
                <input type="radio" v-model="format" value="braces">
                <span class="radio-box"></span>
                <span>{Braces}</span>
              </label>
              <label class="radio-label">
                <input type="radio" v-model="format" value="nodash">
                <span class="radio-box"></span>
                <span>Sans tirets</span>
              </label>
            </div>

            <button class="generate-btn" @click="generateBulk">
              ⚡ Générer {{ bulkCount }} UUID{{ bulkCount > 1 ? 's' : '' }}
            </button>
          </div>

          <div v-if="bulkUuids.length" class="bulk-output">
            <div class="bulk-header">
              <span>{{ bulkUuids.length }} UUID générés</span>
              <button class="copy-all-btn" @click="copyAll" :class="{ copied: allCopied }">
                {{ allCopied ? '✓ Tout copié !' : '📋 Tout copier' }}
              </button>
            </div>
            <div class="bulk-list">
              <div 
                v-for="(uuid, i) in bulkUuids" 
                :key="i" 
                class="bulk-item"
                @click="copyItem(uuid, i)"
                :class="{ copied: copiedIndex === i }"
              >
                <span class="item-index">{{ i + 1 }}</span>
                <span class="item-uuid">{{ uuid }}</span>
                <span class="item-copy">{{ copiedIndex === i ? '✓' : '📋' }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- INFO -->
        <div class="info-section">
          <h2>ℹ️ À propos des UUID</h2>
          <div class="info-grid">
            <div class="info-card">
              <span class="info-icon">🔢</span>
              <h3>Version 4</h3>
              <p>Génération aléatoire avec 122 bits d'entropie. Probabilité de collision quasi nulle.</p>
            </div>
            <div class="info-card">
              <span class="info-icon">📏</span>
              <h3>Format</h3>
              <p>8-4-4-4-12 = 36 caractères (32 hex + 4 tirets)</p>
              <code>xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx</code>
            </div>
            <div class="info-card">
              <span class="info-icon">🎯</span>
              <h3>Usages</h3>
              <p>IDs base de données, tokens de session, identifiants uniques distribués.</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const currentUuid = ref('');
const bulkCount = ref(10);
const format = ref('plain');
const bulkUuids = ref([]);
const singleCopied = ref(false);
const allCopied = ref(false);
const copiedIndex = ref(-1);

function generateUuidV4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

function formatUuid(uuid) {
  switch (format.value) {
    case 'uppercase':
      return uuid.toUpperCase();
    case 'braces':
      return `{${uuid}}`;
    case 'nodash':
      return uuid.replace(/-/g, '');
    default:
      return uuid;
  }
}

function generateSingle() {
  currentUuid.value = generateUuidV4();
}

function generateBulk() {
  bulkUuids.value = [];
  for (let i = 0; i < bulkCount.value; i++) {
    bulkUuids.value.push(formatUuid(generateUuidV4()));
  }
}

async function copySingle() {
  try {
    await navigator.clipboard.writeText(currentUuid.value);
    singleCopied.value = true;
    setTimeout(() => singleCopied.value = false, 2000);
  } catch (err) {
    console.error('Copy failed:', err);
  }
}

async function copyAll() {
  try {
    await navigator.clipboard.writeText(bulkUuids.value.join('\n'));
    allCopied.value = true;
    setTimeout(() => allCopied.value = false, 2000);
  } catch (err) {
    console.error('Copy failed:', err);
  }
}

async function copyItem(uuid, index) {
  try {
    await navigator.clipboard.writeText(uuid);
    copiedIndex.value = index;
    setTimeout(() => copiedIndex.value = -1, 1500);
  } catch (err) {
    console.error('Copy failed:', err);
  }
}

onMounted(() => {
  generateSingle();
});
</script>

<style scoped>
.uuid-app {
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

/* Single UUID */
.single-uuid-section {
  margin-bottom: var(--space-xl);
}

.uuid-display {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  background: rgba(0, 0, 0, 0.4);
  border: 2px solid var(--primary);
  border-radius: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 1rem;
}

.uuid-display:hover {
  background: rgba(0, 255, 136, 0.05);
  box-shadow: 0 0 30px rgba(0, 255, 136, 0.2);
}

.uuid-text {
  font-family: 'JetBrains Mono', monospace;
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--primary);
  letter-spacing: 0.05em;
}

.uuid-copy {
  font-size: 1.5rem;
  opacity: 0.5;
  transition: opacity 0.2s ease;
}

.uuid-display:hover .uuid-copy {
  opacity: 1;
}

.uuid-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.action-btn {
  padding: 0.75rem 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--border);
  border-radius: 0.5rem;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.9rem;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.3s ease;
}

.action-btn:hover {
  border-color: var(--primary);
  color: var(--primary);
}

.action-btn--primary {
  background: var(--primary);
  border-color: var(--primary);
  color: var(--bg-primary);
}

.action-btn--primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(0, 255, 136, 0.3);
}

/* Bulk Section */
.bulk-section {
  margin-bottom: var(--space-xl);
}

.bulk-section h2 {
  font-size: 1.1rem;
  margin-bottom: 1.5rem;
}

.bulk-controls {
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid var(--border);
  border-radius: 1rem;
  margin-bottom: 1.5rem;
}

.control-group {
  margin-bottom: 1.5rem;
}

.control-group label {
  display: block;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.85rem;
  color: var(--text-muted);
  margin-bottom: 0.75rem;
}

.slider {
  width: 100%;
  -webkit-appearance: none;
  height: 8px;
  border-radius: 4px;
  background: var(--border);
  cursor: pointer;
}

.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: var(--primary);
  cursor: pointer;
}

.format-options {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.radio-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.radio-label input { display: none; }

.radio-box {
  width: 18px;
  height: 18px;
  border: 2px solid var(--border);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.radio-label input:checked + .radio-box {
  border-color: var(--primary);
}

.radio-label input:checked + .radio-box::after {
  content: '';
  width: 10px;
  height: 10px;
  background: var(--primary);
  border-radius: 50%;
}

.generate-btn {
  width: 100%;
  padding: 0.875rem;
  background: rgba(0, 255, 136, 0.1);
  border: 1px solid var(--primary);
  border-radius: 0.5rem;
  font-family: 'JetBrains Mono', monospace;
  font-size: 1rem;
  color: var(--primary);
  cursor: pointer;
  transition: all 0.3s ease;
}

.generate-btn:hover {
  background: var(--primary);
  color: var(--bg-primary);
}

/* Bulk Output */
.bulk-output {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid var(--border);
  border-radius: 1rem;
  overflow: hidden;
}

.bulk-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  background: rgba(0, 0, 0, 0.2);
  border-bottom: 1px solid var(--border);
}

.bulk-header span {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.85rem;
  color: var(--text-muted);
}

.copy-all-btn {
  padding: 0.5rem 1rem;
  background: transparent;
  border: 1px solid var(--border);
  border-radius: 0.35rem;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.75rem;
  color: var(--text-muted);
  cursor: pointer;
  transition: all 0.2s ease;
}

.copy-all-btn:hover {
  border-color: var(--primary);
  color: var(--primary);
}

.copy-all-btn.copied {
  background: var(--primary);
  border-color: var(--primary);
  color: var(--bg-primary);
}

.bulk-list {
  max-height: 400px;
  overflow-y: auto;
}

.bulk-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 1.5rem;
  border-bottom: 1px solid var(--border);
  cursor: pointer;
  transition: background 0.2s ease;
}

.bulk-item:hover {
  background: rgba(0, 255, 136, 0.05);
}

.bulk-item.copied {
  background: rgba(0, 255, 136, 0.1);
}

.bulk-item:last-child {
  border-bottom: none;
}

.item-index {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.75rem;
  color: var(--text-dark);
  width: 30px;
}

.item-uuid {
  flex: 1;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.85rem;
  color: var(--text-secondary);
}

.item-copy {
  opacity: 0;
  transition: opacity 0.2s ease;
}

.bulk-item:hover .item-copy,
.bulk-item.copied .item-copy {
  opacity: 1;
}

/* Info Section */
.info-section h2 {
  font-size: 1.1rem;
  margin-bottom: 1rem;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1rem;
}

.info-card {
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid var(--border);
  border-radius: 1rem;
}

.info-icon {
  font-size: 2rem;
  display: block;
  margin-bottom: 0.75rem;
}

.info-card h3 {
  font-size: 1rem;
  margin-bottom: 0.5rem;
}

.info-card p {
  font-size: 0.85rem;
  color: var(--text-muted);
  line-height: 1.5;
  margin-bottom: 0.5rem;
}

.info-card code {
  display: block;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.75rem;
  color: var(--primary);
  margin-top: 0.5rem;
}

@media (max-width: 768px) {
  .uuid-text {
    font-size: 1rem;
  }
  
  .uuid-actions {
    flex-direction: column;
  }
  
  .format-options {
    flex-direction: column;
  }
}
</style>
