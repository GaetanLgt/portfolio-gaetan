<template>
  <div class="timestamp-app">
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
          <h1><span class="app-icon">⏰</span> Timestamp Converter</h1>
          <p>Convertissez entre timestamp Unix et dates lisibles</p>
        </div>

        <!-- CURRENT TIME -->
        <div class="current-time-card">
          <div class="current-label">Timestamp actuel</div>
          <div class="current-value">{{ currentTimestamp }}</div>
          <div class="current-date">{{ currentDate }}</div>
          <button class="use-btn" @click="useCurrentTimestamp">Utiliser</button>
        </div>

        <!-- CONVERTER -->
        <div class="converter-grid">
          <!-- TIMESTAMP INPUT -->
          <div class="converter-panel">
            <h2>🔢 Timestamp Unix</h2>
            <div class="input-group">
              <input 
                type="text" 
                v-model="timestampInput" 
                @input="convertFromTimestamp"
                placeholder="Ex: 1704067200"
                class="main-input"
              >
              <select v-model="timestampUnit" @change="convertFromTimestamp" class="unit-select">
                <option value="s">Secondes</option>
                <option value="ms">Millisecondes</option>
              </select>
            </div>
            <div class="quick-actions">
              <button @click="setTimestamp(0)">Epoch</button>
              <button @click="setTimestamp(Math.floor(Date.now() / 1000))">Now</button>
              <button @click="setTimestamp(Math.floor(Date.now() / 1000) + 86400)">+1 jour</button>
              <button @click="setTimestamp(Math.floor(Date.now() / 1000) + 604800)">+1 semaine</button>
            </div>
          </div>

          <!-- ARROW -->
          <div class="converter-arrow">⇄</div>

          <!-- DATE INPUT -->
          <div class="converter-panel">
            <h2>📅 Date & Heure</h2>
            <div class="date-inputs">
              <input type="date" v-model="dateInput" @input="convertFromDate" class="date-input">
              <input type="time" v-model="timeInput" @input="convertFromDate" step="1" class="time-input">
            </div>
            <div class="timezone-row">
              <label>Fuseau horaire :</label>
              <select v-model="timezone" @change="convertFromTimestamp" class="tz-select">
                <option value="local">Local ({{ localTzName }})</option>
                <option value="UTC">UTC</option>
                <option value="Europe/Paris">Europe/Paris</option>
                <option value="America/New_York">America/New_York</option>
                <option value="Asia/Tokyo">Asia/Tokyo</option>
              </select>
            </div>
          </div>
        </div>

        <!-- RESULTS -->
        <div class="results-section" v-if="timestampInput">
          <h2>📋 Formats de sortie</h2>
          <div class="results-grid">
            <div class="result-item" v-for="format in outputFormats" :key="format.label">
              <div class="result-label">{{ format.label }}</div>
              <div class="result-value-row">
                <input type="text" :value="format.value" readonly class="result-input">
                <button class="copy-mini" @click="copyValue(format.value)" :class="{ copied: copiedValue === format.value }">
                  {{ copiedValue === format.value ? '✓' : '📋' }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- RELATIVE TIME -->
        <div class="relative-section" v-if="timestampInput && relativeTime">
          <h2>⏱️ Temps relatif</h2>
          <div class="relative-card" :class="relativeClass">
            <span class="relative-value">{{ relativeTime }}</span>
            <span class="relative-detail">{{ relativeDetail }}</span>
          </div>
        </div>

        <!-- INFO -->
        <div class="info-section">
          <h2>ℹ️ À propos des timestamps Unix</h2>
          <div class="info-content">
            <p>Le <strong>timestamp Unix</strong> (ou epoch time) représente le nombre de secondes écoulées depuis le <strong>1er janvier 1970 à 00:00:00 UTC</strong>.</p>
            <div class="info-facts">
              <div class="fact">
                <span class="fact-icon">📅</span>
                <span><strong>Epoch</strong> : 1 Jan 1970 00:00:00 UTC</span>
              </div>
              <div class="fact">
                <span class="fact-icon">⚠️</span>
                <span><strong>Y2K38</strong> : Limite 32-bit le 19 Jan 2038</span>
              </div>
              <div class="fact">
                <span class="fact-icon">💡</span>
                <span><strong>JavaScript</strong> utilise des millisecondes</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';

const timestampInput = ref('');
const timestampUnit = ref('s');
const dateInput = ref('');
const timeInput = ref('');
const timezone = ref('local');
const copiedValue = ref('');

const currentTimestamp = ref(0);
const currentDate = ref('');
let interval = null;

const localTzName = Intl.DateTimeFormat().resolvedOptions().timeZone;

function updateCurrentTime() {
  currentTimestamp.value = Math.floor(Date.now() / 1000);
  currentDate.value = new Date().toLocaleString('fr-FR');
}

function useCurrentTimestamp() {
  timestampInput.value = currentTimestamp.value.toString();
  convertFromTimestamp();
}

function setTimestamp(ts) {
  timestampInput.value = ts.toString();
  convertFromTimestamp();
}

function getDateFromTimestamp() {
  if (!timestampInput.value) return null;
  
  let ts = parseInt(timestampInput.value);
  if (isNaN(ts)) return null;
  
  // Convert to milliseconds if in seconds
  if (timestampUnit.value === 's') {
    ts *= 1000;
  }
  
  return new Date(ts);
}

function convertFromTimestamp() {
  const date = getDateFromTimestamp();
  if (!date || isNaN(date.getTime())) {
    dateInput.value = '';
    timeInput.value = '';
    return;
  }
  
  if (timezone.value === 'UTC') {
    dateInput.value = date.toISOString().split('T')[0];
    timeInput.value = date.toISOString().split('T')[1].split('.')[0];
  } else {
    const options = { timeZone: timezone.value === 'local' ? undefined : timezone.value };
    const localDate = new Date(date.toLocaleString('en-US', options));
    
    const year = localDate.getFullYear();
    const month = String(localDate.getMonth() + 1).padStart(2, '0');
    const day = String(localDate.getDate()).padStart(2, '0');
    dateInput.value = `${year}-${month}-${day}`;
    
    const hours = String(localDate.getHours()).padStart(2, '0');
    const minutes = String(localDate.getMinutes()).padStart(2, '0');
    const seconds = String(localDate.getSeconds()).padStart(2, '0');
    timeInput.value = `${hours}:${minutes}:${seconds}`;
  }
}

function convertFromDate() {
  if (!dateInput.value) return;
  
  const dateStr = `${dateInput.value}T${timeInput.value || '00:00:00'}`;
  let date;
  
  if (timezone.value === 'UTC') {
    date = new Date(dateStr + 'Z');
  } else {
    date = new Date(dateStr);
  }
  
  if (isNaN(date.getTime())) return;
  
  const ts = Math.floor(date.getTime() / (timestampUnit.value === 's' ? 1000 : 1));
  timestampInput.value = ts.toString();
}

const outputFormats = computed(() => {
  const date = getDateFromTimestamp();
  if (!date || isNaN(date.getTime())) return [];
  
  return [
    { label: 'ISO 8601', value: date.toISOString() },
    { label: 'UTC String', value: date.toUTCString() },
    { label: 'Date locale (FR)', value: date.toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) },
    { label: 'Heure locale', value: date.toLocaleTimeString('fr-FR') },
    { label: 'Date complète', value: date.toLocaleString('fr-FR') },
    { label: 'Timestamp (s)', value: Math.floor(date.getTime() / 1000).toString() },
    { label: 'Timestamp (ms)', value: date.getTime().toString() }
  ];
});

const relativeTime = computed(() => {
  const date = getDateFromTimestamp();
  if (!date || isNaN(date.getTime())) return '';
  
  const now = Date.now();
  const diff = date.getTime() - now;
  const absDiff = Math.abs(diff);
  
  const seconds = Math.floor(absDiff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);
  
  let result = '';
  if (years > 0) result = `${years} an${years > 1 ? 's' : ''}`;
  else if (months > 0) result = `${months} mois`;
  else if (days > 0) result = `${days} jour${days > 1 ? 's' : ''}`;
  else if (hours > 0) result = `${hours} heure${hours > 1 ? 's' : ''}`;
  else if (minutes > 0) result = `${minutes} minute${minutes > 1 ? 's' : ''}`;
  else result = `${seconds} seconde${seconds > 1 ? 's' : ''}`;
  
  return diff < 0 ? `Il y a ${result}` : `Dans ${result}`;
});

const relativeDetail = computed(() => {
  const date = getDateFromTimestamp();
  if (!date || isNaN(date.getTime())) return '';
  
  const diff = Math.abs(date.getTime() - Date.now());
  return `${Math.floor(diff / 1000).toLocaleString()} secondes`;
});

const relativeClass = computed(() => {
  const date = getDateFromTimestamp();
  if (!date || isNaN(date.getTime())) return '';
  return date.getTime() < Date.now() ? 'relative--past' : 'relative--future';
});

async function copyValue(value) {
  try {
    await navigator.clipboard.writeText(value);
    copiedValue.value = value;
    setTimeout(() => copiedValue.value = '', 2000);
  } catch (err) {
    console.error('Copy failed:', err);
  }
}

onMounted(() => {
  updateCurrentTime();
  interval = setInterval(updateCurrentTime, 1000);
});

onUnmounted(() => {
  if (interval) clearInterval(interval);
});
</script>

<style scoped>
.timestamp-app {
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

/* Current Time Card */
.current-time-card {
  text-align: center;
  padding: 1.5rem;
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(6, 182, 212, 0.1));
  border: 1px solid rgba(16, 185, 129, 0.3);
  border-radius: 1rem;
  margin-bottom: var(--space-lg);
}

.current-label {
  font-size: 0.8rem;
  color: var(--text-muted);
  margin-bottom: 0.5rem;
}

.current-value {
  font-family: 'JetBrains Mono', monospace;
  font-size: 2rem;
  font-weight: 700;
  color: var(--primary);
  margin-bottom: 0.25rem;
}

.current-date {
  font-size: 0.9rem;
  color: var(--text-secondary);
  margin-bottom: 1rem;
}

.use-btn {
  padding: 0.5rem 1.5rem;
  background: var(--primary);
  border: none;
  border-radius: 0.5rem;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.85rem;
  color: var(--bg-primary);
  cursor: pointer;
  transition: all 0.2s ease;
}

.use-btn:hover { transform: translateY(-2px); box-shadow: 0 5px 20px var(--primary-glow); }

/* Converter Grid */
.converter-grid {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 1.5rem;
  align-items: start;
  margin-bottom: var(--space-lg);
}

.converter-panel {
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid var(--border);
  border-radius: 1rem;
}

.converter-panel h2 {
  font-size: 1rem;
  margin-bottom: 1rem;
}

.converter-arrow {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  color: var(--primary);
  padding-top: 3rem;
}

.input-group {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.main-input {
  flex: 1;
  padding: 0.75rem 1rem;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid var(--border);
  border-radius: 0.5rem;
  font-family: 'JetBrains Mono', monospace;
  font-size: 1rem;
  color: var(--text-main);
}

.main-input:focus { outline: none; border-color: var(--primary); }

.unit-select, .tz-select {
  padding: 0.75rem;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid var(--border);
  border-radius: 0.5rem;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.85rem;
  color: var(--text-main);
  cursor: pointer;
}

.quick-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.quick-actions button {
  padding: 0.4rem 0.75rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--border);
  border-radius: 0.35rem;
  font-size: 0.75rem;
  color: var(--text-muted);
  cursor: pointer;
  transition: all 0.2s ease;
}

.quick-actions button:hover { border-color: var(--primary); color: var(--primary); }

.date-inputs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.date-input, .time-input {
  flex: 1;
  padding: 0.75rem;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid var(--border);
  border-radius: 0.5rem;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.9rem;
  color: var(--text-main);
}

.date-input:focus, .time-input:focus { outline: none; border-color: var(--primary); }

.timezone-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.timezone-row label {
  font-size: 0.8rem;
  color: var(--text-muted);
}

/* Results Section */
.results-section {
  margin-bottom: var(--space-lg);
}

.results-section h2 {
  font-size: 1.1rem;
  margin-bottom: 1rem;
}

.results-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 0.75rem;
}

.result-item {
  padding: 0.75rem 1rem;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid var(--border);
  border-radius: 0.5rem;
}

.result-label {
  font-size: 0.75rem;
  color: var(--text-dark);
  margin-bottom: 0.35rem;
}

.result-value-row {
  display: flex;
  gap: 0.5rem;
}

.result-input {
  flex: 1;
  padding: 0.5rem;
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid var(--border);
  border-radius: 0.35rem;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.8rem;
  color: var(--text-main);
}

.copy-mini {
  padding: 0.5rem;
  background: transparent;
  border: 1px solid var(--border);
  border-radius: 0.35rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.copy-mini:hover { border-color: var(--primary); }
.copy-mini.copied { background: var(--primary); border-color: var(--primary); }

/* Relative Section */
.relative-section {
  margin-bottom: var(--space-lg);
}

.relative-section h2 {
  font-size: 1.1rem;
  margin-bottom: 1rem;
}

.relative-card {
  padding: 1.5rem;
  border-radius: 0.75rem;
  text-align: center;
}

.relative--past { background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.3); }
.relative--future { background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.3); }

.relative-value {
  display: block;
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.relative--past .relative-value { color: #EF4444; }
.relative--future .relative-value { color: #10B981; }

.relative-detail {
  font-size: 0.85rem;
  color: var(--text-muted);
}

/* Info Section */
.info-section h2 {
  font-size: 1.1rem;
  margin-bottom: 1rem;
}

.info-content {
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid var(--border);
  border-radius: 0.75rem;
}

.info-content p {
  margin-bottom: 1rem;
  line-height: 1.6;
  color: var(--text-secondary);
}

.info-facts {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.fact {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.9rem;
  color: var(--text-muted);
}

.fact-icon { font-size: 1.25rem; }

@media (max-width: 768px) {
  .converter-grid {
    grid-template-columns: 1fr;
  }
  
  .converter-arrow {
    transform: rotate(90deg);
    padding: 1rem 0;
  }
  
  .date-inputs {
    flex-direction: column;
  }
}
</style>
