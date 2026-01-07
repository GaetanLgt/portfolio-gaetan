<template>
  <div class="password-app">
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
          <h1><span class="app-icon">🔑</span> Password Generator</h1>
          <p>Créez des mots de passe forts et sécurisés</p>
        </div>

        <!-- PASSWORD OUTPUT -->
        <div class="password-output">
          <div class="password-display" :class="strengthClass">
            <span class="password-text" :style="{ fontSize: passwordFontSize }">{{ password }}</span>
          </div>
          <div class="password-actions">
            <button class="action-btn" @click="generatePassword">🎲 Générer</button>
            <button class="action-btn" @click="copyPassword" :class="{ copied }">
              {{ copied ? '✓ Copié !' : '📋 Copier' }}
            </button>
          </div>
        </div>

        <!-- STRENGTH METER -->
        <div class="strength-meter">
          <div class="strength-bar">
            <div class="strength-fill" :style="{ width: strengthPercent + '%' }" :class="strengthClass"></div>
          </div>
          <div class="strength-info">
            <span class="strength-label">Force : {{ strengthLabel }}</span>
            <span class="strength-time">Temps de crack : ~{{ crackTime }}</span>
          </div>
        </div>

        <!-- OPTIONS -->
        <div class="options-card">
          <h2>⚙️ Options</h2>
          
          <div class="option-row">
            <label>Longueur : {{ length }}</label>
            <input type="range" v-model.number="length" min="4" max="64" @input="generatePassword" class="slider">
          </div>

          <div class="options-grid">
            <label class="checkbox-label">
              <input type="checkbox" v-model="options.uppercase" @change="generatePassword">
              <span class="checkbox-box"></span>
              <span>Majuscules (A-Z)</span>
            </label>
            <label class="checkbox-label">
              <input type="checkbox" v-model="options.lowercase" @change="generatePassword">
              <span class="checkbox-box"></span>
              <span>Minuscules (a-z)</span>
            </label>
            <label class="checkbox-label">
              <input type="checkbox" v-model="options.numbers" @change="generatePassword">
              <span class="checkbox-box"></span>
              <span>Chiffres (0-9)</span>
            </label>
            <label class="checkbox-label">
              <input type="checkbox" v-model="options.symbols" @change="generatePassword">
              <span class="checkbox-box"></span>
              <span>Symboles (!@#$%)</span>
            </label>
            <label class="checkbox-label">
              <input type="checkbox" v-model="options.noAmbiguous" @change="generatePassword">
              <span class="checkbox-box"></span>
              <span>Exclure ambigus (0Ol1I)</span>
            </label>
          </div>
        </div>

        <!-- HISTORY -->
        <div class="history-section" v-if="history.length">
          <h2>🕐 Historique (session)</h2>
          <div class="history-list">
            <div v-for="(item, i) in history" :key="i" class="history-item" @click="copyHistoryItem(item)">
              <span class="history-password">{{ item }}</span>
              <span class="history-copy">📋</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

const password = ref('');
const length = ref(16);
const copied = ref(false);
const history = ref([]);

const options = ref({
  uppercase: true,
  lowercase: true,
  numbers: true,
  symbols: true,
  noAmbiguous: false
});

const charsets = {
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  numbers: '0123456789',
  symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?'
};

const ambiguous = 'O0l1I';

function generatePassword() {
  let chars = '';
  
  if (options.value.uppercase) chars += charsets.uppercase;
  if (options.value.lowercase) chars += charsets.lowercase;
  if (options.value.numbers) chars += charsets.numbers;
  if (options.value.symbols) chars += charsets.symbols;
  
  if (options.value.noAmbiguous) {
    chars = chars.split('').filter(c => !ambiguous.includes(c)).join('');
  }
  
  if (!chars) {
    password.value = 'Sélectionnez au moins une option';
    return;
  }
  
  const array = new Uint32Array(length.value);
  crypto.getRandomValues(array);
  
  password.value = Array.from(array, x => chars[x % chars.length]).join('');
  
  if (history.value[0] !== password.value) {
    history.value.unshift(password.value);
    if (history.value.length > 5) history.value.pop();
  }
}

const passwordFontSize = computed(() => {
  if (length.value <= 16) return '1.5rem';
  if (length.value <= 32) return '1.1rem';
  return '0.85rem';
});

const strength = computed(() => {
  let score = 0;
  const p = password.value;
  
  if (p.length >= 8) score += 1;
  if (p.length >= 12) score += 1;
  if (p.length >= 16) score += 1;
  if (/[a-z]/.test(p) && /[A-Z]/.test(p)) score += 1;
  if (/\d/.test(p)) score += 1;
  if (/[^a-zA-Z0-9]/.test(p)) score += 2;
  
  return Math.min(score, 7);
});

const strengthPercent = computed(() => (strength.value / 7) * 100);

const strengthLabel = computed(() => {
  if (strength.value <= 2) return 'Faible';
  if (strength.value <= 4) return 'Moyen';
  if (strength.value <= 5) return 'Fort';
  return 'Très fort';
});

const strengthClass = computed(() => {
  if (strength.value <= 2) return 'strength--weak';
  if (strength.value <= 4) return 'strength--medium';
  if (strength.value <= 5) return 'strength--strong';
  return 'strength--very-strong';
});

const crackTime = computed(() => {
  let poolSize = 0;
  if (options.value.uppercase) poolSize += 26;
  if (options.value.lowercase) poolSize += 26;
  if (options.value.numbers) poolSize += 10;
  if (options.value.symbols) poolSize += 32;
  
  const combinations = Math.pow(poolSize, length.value);
  const guessesPerSecond = 10000000000;
  const seconds = combinations / guessesPerSecond / 2;
  
  if (seconds < 1) return 'Instantané';
  if (seconds < 60) return Math.round(seconds) + ' secondes';
  if (seconds < 3600) return Math.round(seconds / 60) + ' minutes';
  if (seconds < 86400) return Math.round(seconds / 3600) + ' heures';
  if (seconds < 31536000) return Math.round(seconds / 86400) + ' jours';
  if (seconds < 31536000 * 1000) return Math.round(seconds / 31536000) + ' ans';
  if (seconds < 31536000 * 1000000) return Math.round(seconds / 31536000 / 1000) + 'K ans';
  return '∞ années';
});

async function copyPassword() {
  try {
    await navigator.clipboard.writeText(password.value);
    copied.value = true;
    setTimeout(() => copied.value = false, 2000);
  } catch (err) {
    console.error('Copy failed:', err);
  }
}

async function copyHistoryItem(item) {
  try {
    await navigator.clipboard.writeText(item);
  } catch (err) {
    console.error('Copy failed:', err);
  }
}

onMounted(() => {
  generatePassword();
});
</script>

<style scoped>
.password-app {
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
  max-width: 700px;
  margin: 0 auto;
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

/* Password Output */
.password-output {
  margin-bottom: var(--space-md);
}

.password-display {
  padding: 1.5rem;
  background: rgba(0, 0, 0, 0.4);
  border: 2px solid var(--border);
  border-radius: 1rem;
  text-align: center;
  margin-bottom: 1rem;
  transition: border-color 0.3s ease;
}

.password-display.strength--weak { border-color: #EF4444; }
.password-display.strength--medium { border-color: #F59E0B; }
.password-display.strength--strong { border-color: #10B981; }
.password-display.strength--very-strong { border-color: var(--primary); box-shadow: 0 0 30px rgba(0, 255, 136, 0.2); }

.password-text {
  font-family: 'JetBrains Mono', monospace;
  font-weight: 600;
  color: var(--text-main);
  word-break: break-all;
}

.password-actions {
  display: flex;
  gap: 0.75rem;
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

.action-btn.copied {
  background: var(--primary);
  border-color: var(--primary);
  color: var(--bg-primary);
}

/* Strength Meter */
.strength-meter {
  margin-bottom: var(--space-lg);
}

.strength-bar {
  height: 8px;
  background: var(--border);
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.strength-fill {
  height: 100%;
  transition: width 0.3s ease, background 0.3s ease;
}

.strength-fill.strength--weak { background: #EF4444; }
.strength-fill.strength--medium { background: #F59E0B; }
.strength-fill.strength--strong { background: #10B981; }
.strength-fill.strength--very-strong { background: var(--primary); }

.strength-info {
  display: flex;
  justify-content: space-between;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.8rem;
}

.strength-label { color: var(--text-secondary); }
.strength-time { color: var(--text-muted); }

/* Options Card */
.options-card {
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid var(--border);
  border-radius: 1rem;
  margin-bottom: var(--space-lg);
}

.options-card h2 {
  font-size: 1.1rem;
  margin-bottom: 1.5rem;
}

.option-row {
  margin-bottom: 1.5rem;
}

.option-row label {
  display: block;
  margin-bottom: 0.5rem;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.85rem;
  color: var(--text-secondary);
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
  box-shadow: 0 2px 10px rgba(0, 255, 136, 0.4);
}

.options-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.checkbox-label input {
  display: none;
}

.checkbox-box {
  width: 20px;
  height: 20px;
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
  font-size: 0.75rem;
  font-weight: bold;
}

/* History */
.history-section h2 {
  font-size: 1.1rem;
  margin-bottom: 1rem;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.history-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid var(--border);
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.history-item:hover {
  border-color: var(--primary);
}

.history-password {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.85rem;
  color: var(--text-muted);
}

.history-copy {
  opacity: 0;
  transition: opacity 0.2s ease;
}

.history-item:hover .history-copy {
  opacity: 1;
}

@media (max-width: 768px) {
  .strength-info {
    flex-direction: column;
    gap: 0.25rem;
  }
  
  .options-grid {
    grid-template-columns: 1fr;
  }
}
</style>
