<template>
  <div class="regex-app">
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
          <h1><span class="app-icon">🔍</span> Regex Tester</h1>
          <p>Testez et validez vos expressions régulières en temps réel</p>
        </div>

        <!-- REGEX INPUT -->
        <div class="regex-input-section">
          <div class="input-row">
            <div class="regex-field">
              <span class="regex-slash">/</span>
              <input 
                type="text" 
                v-model="pattern" 
                @input="testRegex"
                placeholder="votre regex ici"
                class="regex-input"
              >
              <span class="regex-slash">/</span>
              <input 
                type="text" 
                v-model="flags" 
                @input="testRegex"
                placeholder="gi"
                class="flags-input"
                maxlength="6"
              >
            </div>
          </div>
          
          <div class="flags-help">
            <button 
              v-for="flag in availableFlags" 
              :key="flag.char"
              class="flag-btn"
              :class="{ active: flags.includes(flag.char) }"
              @click="toggleFlag(flag.char)"
              :title="flag.desc"
            >
              {{ flag.char }}
            </button>
            <span class="flags-legend">g=global, i=insensible, m=multiline, s=dotall</span>
          </div>
        </div>

        <!-- STATUS -->
        <div class="status-bar" :class="statusClass">
          <span class="status-icon">{{ isValid ? '✓' : '✗' }}</span>
          <span class="status-text">{{ statusMessage }}</span>
          <span v-if="matchCount > 0" class="match-count">{{ matchCount }} correspondance(s)</span>
        </div>

        <!-- TEST STRING -->
        <div class="test-section">
          <label>Texte de test</label>
          <div class="test-textarea-wrapper">
            <div class="test-highlighted" v-html="highlightedText"></div>
            <textarea 
              v-model="testString" 
              @input="testRegex"
              placeholder="Entrez le texte à tester..."
              class="test-textarea"
            ></textarea>
          </div>
        </div>

        <!-- MATCHES -->
        <div v-if="matches.length" class="matches-section">
          <h2>📋 Correspondances ({{ matches.length }})</h2>
          <div class="matches-list">
            <div v-for="(match, i) in matches" :key="i" class="match-item">
              <span class="match-index">#{{ i + 1 }}</span>
              <span class="match-value">{{ match.value }}</span>
              <span class="match-position">pos {{ match.index }}</span>
              <div v-if="match.groups && Object.keys(match.groups).length" class="match-groups">
                <span v-for="(val, key) in match.groups" :key="key" class="group-item">
                  {{ key }}: <code>{{ val }}</code>
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- CHEATSHEET -->
        <div class="cheatsheet">
          <h2>📖 Aide-mémoire</h2>
          <div class="cheatsheet-grid">
            <div class="cheat-category">
              <h3>Caractères</h3>
              <div class="cheat-item"><code>.</code> N'importe quel caractère</div>
              <div class="cheat-item"><code>\d</code> Chiffre [0-9]</div>
              <div class="cheat-item"><code>\w</code> Mot [a-zA-Z0-9_]</div>
              <div class="cheat-item"><code>\s</code> Espace blanc</div>
              <div class="cheat-item"><code>\D \W \S</code> Négations</div>
            </div>
            <div class="cheat-category">
              <h3>Quantificateurs</h3>
              <div class="cheat-item"><code>*</code> 0 ou plus</div>
              <div class="cheat-item"><code>+</code> 1 ou plus</div>
              <div class="cheat-item"><code>?</code> 0 ou 1</div>
              <div class="cheat-item"><code>{n}</code> Exactement n</div>
              <div class="cheat-item"><code>{n,m}</code> Entre n et m</div>
            </div>
            <div class="cheat-category">
              <h3>Ancres</h3>
              <div class="cheat-item"><code>^</code> Début de ligne</div>
              <div class="cheat-item"><code>$</code> Fin de ligne</div>
              <div class="cheat-item"><code>\b</code> Limite de mot</div>
            </div>
            <div class="cheat-category">
              <h3>Groupes</h3>
              <div class="cheat-item"><code>(abc)</code> Groupe capturant</div>
              <div class="cheat-item"><code>(?:abc)</code> Non capturant</div>
              <div class="cheat-item"><code>(?&lt;name&gt;abc)</code> Groupe nommé</div>
              <div class="cheat-item"><code>[abc]</code> Classe de caractères</div>
              <div class="cheat-item"><code>[^abc]</code> Négation de classe</div>
            </div>
          </div>
        </div>

        <!-- PRESETS -->
        <div class="presets-section">
          <h2>⚡ Regex courants</h2>
          <div class="presets-grid">
            <button v-for="preset in presets" :key="preset.name" class="preset-btn" @click="applyPreset(preset)">
              <span class="preset-icon">{{ preset.icon }}</span>
              <span class="preset-name">{{ preset.name }}</span>
            </button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const pattern = ref('');
const flags = ref('g');
const testString = ref('Hello World! Mon email est test@example.com et mon téléphone est 06 12 34 56 78.');
const isValid = ref(true);
const errorMessage = ref('');
const matches = ref([]);

const availableFlags = [
  { char: 'g', desc: 'Global - Toutes les correspondances' },
  { char: 'i', desc: 'Insensible à la casse' },
  { char: 'm', desc: 'Multiline - ^ et $ pour chaque ligne' },
  { char: 's', desc: 'Dotall - . inclut les sauts de ligne' },
  { char: 'u', desc: 'Unicode' }
];

const presets = [
  { name: 'Email', pattern: '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}', flags: 'gi', icon: '📧' },
  { name: 'Téléphone FR', pattern: '(?:0|\\+33)[1-9](?:[\\s.-]?\\d{2}){4}', flags: 'g', icon: '📱' },
  { name: 'URL', pattern: 'https?:\\/\\/[\\w\\-._~:/?#[\\]@!$&\'()*+,;=]+', flags: 'gi', icon: '🔗' },
  { name: 'Date JJ/MM/AAAA', pattern: '\\d{2}\\/\\d{2}\\/\\d{4}', flags: 'g', icon: '📅' },
  { name: 'Heure HH:MM', pattern: '\\d{2}:\\d{2}', flags: 'g', icon: '⏰' },
  { name: 'Adresse IP', pattern: '\\b(?:\\d{1,3}\\.){3}\\d{1,3}\\b', flags: 'g', icon: '🌐' },
  { name: 'Code postal FR', pattern: '\\b\\d{5}\\b', flags: 'g', icon: '📮' },
  { name: 'Mot', pattern: '\\b\\w+\\b', flags: 'g', icon: '📝' }
];

const matchCount = computed(() => matches.value.length);

const statusClass = computed(() => ({
  'status--valid': isValid.value && pattern.value,
  'status--invalid': !isValid.value,
  'status--empty': !pattern.value
}));

const statusMessage = computed(() => {
  if (!pattern.value) return 'Entrez une expression régulière...';
  if (!isValid.value) return `Erreur: ${errorMessage.value}`;
  return 'Regex valide';
});

const highlightedText = computed(() => {
  if (!pattern.value || !isValid.value || !testString.value) {
    return escapeHtml(testString.value);
  }
  
  try {
    const regex = new RegExp(pattern.value, flags.value);
    return testString.value.replace(regex, '<mark class="highlight">$&</mark>');
  } catch {
    return escapeHtml(testString.value);
  }
});

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function testRegex() {
  matches.value = [];
  
  if (!pattern.value) {
    isValid.value = true;
    return;
  }
  
  try {
    const regex = new RegExp(pattern.value, flags.value);
    isValid.value = true;
    errorMessage.value = '';
    
    if (testString.value) {
      let match;
      const results = [];
      
      if (flags.value.includes('g')) {
        while ((match = regex.exec(testString.value)) !== null) {
          results.push({
            value: match[0],
            index: match.index,
            groups: match.groups || {}
          });
          if (results.length > 100) break; // Limit
        }
      } else {
        match = regex.exec(testString.value);
        if (match) {
          results.push({
            value: match[0],
            index: match.index,
            groups: match.groups || {}
          });
        }
      }
      
      matches.value = results;
    }
  } catch (e) {
    isValid.value = false;
    errorMessage.value = e.message;
  }
}

function toggleFlag(flag) {
  if (flags.value.includes(flag)) {
    flags.value = flags.value.replace(flag, '');
  } else {
    flags.value += flag;
  }
  testRegex();
}

function applyPreset(preset) {
  pattern.value = preset.pattern;
  flags.value = preset.flags;
  testRegex();
}
</script>

<style scoped>
.regex-app {
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

/* Regex Input */
.regex-input-section {
  margin-bottom: var(--space-md);
}

.regex-field {
  display: flex;
  align-items: center;
  background: rgba(0, 0, 0, 0.4);
  border: 2px solid var(--border);
  border-radius: 0.75rem;
  padding: 0.5rem 1rem;
  transition: border-color 0.3s ease;
}

.regex-field:focus-within {
  border-color: var(--primary);
}

.regex-slash {
  font-family: 'JetBrains Mono', monospace;
  font-size: 1.5rem;
  color: var(--primary);
  opacity: 0.5;
}

.regex-input {
  flex: 1;
  padding: 0.75rem 1rem;
  background: transparent;
  border: none;
  font-family: 'JetBrains Mono', monospace;
  font-size: 1.1rem;
  color: var(--text-main);
}

.regex-input:focus { outline: none; }

.flags-input {
  width: 60px;
  padding: 0.5rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--border);
  border-radius: 0.35rem;
  font-family: 'JetBrains Mono', monospace;
  font-size: 1rem;
  color: var(--primary);
  text-align: center;
}

.flags-input:focus { outline: none; border-color: var(--primary); }

.flags-help {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.75rem;
  flex-wrap: wrap;
}

.flag-btn {
  width: 32px;
  height: 32px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid var(--border);
  border-radius: 0.35rem;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.9rem;
  color: var(--text-muted);
  cursor: pointer;
  transition: all 0.2s ease;
}

.flag-btn:hover { border-color: var(--primary); color: var(--primary); }
.flag-btn.active { background: var(--primary); border-color: var(--primary); color: var(--bg-primary); }

.flags-legend {
  font-size: 0.75rem;
  color: var(--text-dark);
  margin-left: auto;
}

/* Status */
.status-bar {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  margin-bottom: var(--space-md);
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.85rem;
}

.status--empty { background: rgba(255, 255, 255, 0.02); border: 1px solid var(--border); }
.status--valid { background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.3); color: #10B981; }
.status--invalid { background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.3); color: #EF4444; }

.match-count { margin-left: auto; opacity: 0.7; }

/* Test Section */
.test-section {
  margin-bottom: var(--space-lg);
}

.test-section label {
  display: block;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.85rem;
  color: var(--text-muted);
  margin-bottom: 0.5rem;
}

.test-textarea-wrapper {
  position: relative;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid var(--border);
  border-radius: 0.75rem;
  overflow: hidden;
}

.test-highlighted {
  position: absolute;
  inset: 0;
  padding: 1rem;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.9rem;
  line-height: 1.6;
  color: var(--text-main);
  white-space: pre-wrap;
  word-wrap: break-word;
  pointer-events: none;
}

.test-highlighted :deep(.highlight) {
  background: rgba(0, 255, 136, 0.3);
  border-radius: 2px;
  padding: 0 2px;
}

.test-textarea {
  width: 100%;
  min-height: 150px;
  padding: 1rem;
  background: transparent;
  border: none;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.9rem;
  line-height: 1.6;
  color: transparent;
  caret-color: var(--text-main);
  resize: vertical;
}

.test-textarea:focus { outline: none; }

/* Matches */
.matches-section {
  margin-bottom: var(--space-lg);
}

.matches-section h2 {
  font-size: 1.1rem;
  margin-bottom: 1rem;
}

.matches-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  max-height: 300px;
  overflow-y: auto;
}

.match-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 1rem;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid var(--border);
  border-radius: 0.5rem;
  flex-wrap: wrap;
}

.match-index {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.75rem;
  color: var(--text-dark);
}

.match-value {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.9rem;
  color: var(--primary);
  background: rgba(0, 255, 136, 0.1);
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
}

.match-position {
  font-size: 0.75rem;
  color: var(--text-dark);
  margin-left: auto;
}

.match-groups {
  width: 100%;
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-top: 0.5rem;
  padding-top: 0.5rem;
  border-top: 1px dashed var(--border);
}

.group-item {
  font-size: 0.75rem;
  color: var(--text-muted);
}

.group-item code {
  color: var(--accent);
}

/* Cheatsheet */
.cheatsheet {
  margin-bottom: var(--space-lg);
}

.cheatsheet h2 {
  font-size: 1.1rem;
  margin-bottom: 1rem;
}

.cheatsheet-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.cheat-category {
  padding: 1rem;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid var(--border);
  border-radius: 0.75rem;
}

.cheat-category h3 {
  font-size: 0.85rem;
  color: var(--primary);
  margin-bottom: 0.75rem;
}

.cheat-item {
  font-size: 0.8rem;
  color: var(--text-muted);
  margin-bottom: 0.35rem;
}

.cheat-item code {
  font-family: 'JetBrains Mono', monospace;
  color: var(--text-main);
  background: rgba(0, 0, 0, 0.3);
  padding: 0.1rem 0.35rem;
  border-radius: 0.2rem;
  margin-right: 0.35rem;
}

/* Presets */
.presets-section h2 {
  font-size: 1.1rem;
  margin-bottom: 1rem;
}

.presets-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 0.75rem;
}

.preset-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid var(--border);
  border-radius: 0.75rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.preset-btn:hover {
  border-color: var(--primary);
  transform: translateY(-2px);
}

.preset-icon { font-size: 1.5rem; }
.preset-name { font-size: 0.8rem; color: var(--text-secondary); }

@media (max-width: 768px) {
  .flags-legend { display: none; }
  .cheatsheet-grid { grid-template-columns: 1fr; }
}
</style>
