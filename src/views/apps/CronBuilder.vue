<template>
  <div class="cron-app">
    <header class="app-header">
      <div class="container">
        <router-link to="/apps" class="back-link">← Retour aux Apps</router-link>
      </div>
    </header>
    <main class="app-main">
      <div class="container">
        <div class="app-intro">
          <h1><span class="app-icon">⏰</span> Cron Expression Builder</h1>
          <p>Créez et validez vos expressions cron pour automatiser vos tâches</p>
        </div>

        <!-- VISUAL BUILDER -->
        <div class="builder-card">
          <h2>🔧 Constructeur visuel</h2>
          <div class="fields-grid">
            <div class="field">
              <label>Minute (0-59)</label>
              <select v-model="minute">
                <option value="*">Chaque minute (*)</option>
                <option value="*/5">Toutes les 5 min (*/5)</option>
                <option value="*/15">Toutes les 15 min (*/15)</option>
                <option value="*/30">Toutes les 30 min (*/30)</option>
                <option value="0">À la minute 0</option>
                <option v-for="n in 60" :key="n" :value="n-1">{{ n-1 }}</option>
              </select>
            </div>
            <div class="field">
              <label>Heure (0-23)</label>
              <select v-model="hour">
                <option value="*">Chaque heure (*)</option>
                <option value="*/2">Toutes les 2h (*/2)</option>
                <option value="*/6">Toutes les 6h (*/6)</option>
                <option v-for="n in 24" :key="n" :value="n-1">{{ n-1 }}h</option>
              </select>
            </div>
            <div class="field">
              <label>Jour du mois (1-31)</label>
              <select v-model="dayOfMonth">
                <option value="*">Chaque jour (*)</option>
                <option value="1">1er du mois</option>
                <option value="15">15 du mois</option>
                <option value="L">Dernier jour (L)</option>
                <option v-for="n in 31" :key="n" :value="n">{{ n }}</option>
              </select>
            </div>
            <div class="field">
              <label>Mois (1-12)</label>
              <select v-model="month">
                <option value="*">Chaque mois (*)</option>
                <option value="1">Janvier</option>
                <option value="2">Février</option>
                <option value="3">Mars</option>
                <option value="4">Avril</option>
                <option value="5">Mai</option>
                <option value="6">Juin</option>
                <option value="7">Juillet</option>
                <option value="8">Août</option>
                <option value="9">Septembre</option>
                <option value="10">Octobre</option>
                <option value="11">Novembre</option>
                <option value="12">Décembre</option>
              </select>
            </div>
            <div class="field">
              <label>Jour de la semaine (0-6)</label>
              <select v-model="dayOfWeek">
                <option value="*">Chaque jour (*)</option>
                <option value="1-5">Lun-Ven (1-5)</option>
                <option value="0,6">Week-end (0,6)</option>
                <option value="0">Dimanche</option>
                <option value="1">Lundi</option>
                <option value="2">Mardi</option>
                <option value="3">Mercredi</option>
                <option value="4">Jeudi</option>
                <option value="5">Vendredi</option>
                <option value="6">Samedi</option>
              </select>
            </div>
          </div>
        </div>

        <!-- EXPRESSION -->
        <div class="expression-card">
          <div class="expr-header">
            <span class="expr-label">Expression Cron:</span>
            <button @click="copyExpr" :class="{copied}">{{ copied ? '✓ Copié' : '📋 Copier' }}</button>
          </div>
          <div class="expr-display">
            <span v-for="(part, i) in cronParts" :key="i" class="expr-part" :class="{active: hoveredPart === i}" @mouseenter="hoveredPart = i" @mouseleave="hoveredPart = -1">
              {{ part }}
            </span>
          </div>
          <div class="expr-legend">
            <span :class="{active: hoveredPart === 0}">Minute</span>
            <span :class="{active: hoveredPart === 1}">Heure</span>
            <span :class="{active: hoveredPart === 2}">Jour</span>
            <span :class="{active: hoveredPart === 3}">Mois</span>
            <span :class="{active: hoveredPart === 4}">Sem.</span>
          </div>
        </div>

        <!-- HUMAN READABLE -->
        <div class="readable-card">
          <h3>📖 En français:</h3>
          <p class="readable-text">{{ humanReadable }}</p>
        </div>

        <!-- NEXT RUNS -->
        <div class="next-runs-card">
          <h3>📅 Prochaines exécutions:</h3>
          <ul class="runs-list">
            <li v-for="(run, i) in nextRuns" :key="i">
              <span class="run-date">{{ run.date }}</span>
              <span class="run-relative">{{ run.relative }}</span>
            </li>
          </ul>
        </div>

        <!-- PRESETS -->
        <div class="presets-card">
          <h3>⚡ Expressions courantes</h3>
          <div class="presets-grid">
            <button v-for="preset in presets" :key="preset.expr" @click="loadPreset(preset)">
              <span class="preset-name">{{ preset.name }}</span>
              <code>{{ preset.expr }}</code>
            </button>
          </div>
        </div>

        <!-- MANUAL INPUT -->
        <div class="manual-card">
          <h3>✏️ Saisie manuelle</h3>
          <input type="text" v-model="manualExpr" @input="parseManual" placeholder="* * * * *" class="manual-input">
          <p v-if="parseError" class="parse-error">{{ parseError }}</p>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';

const minute = ref('0');
const hour = ref('*');
const dayOfMonth = ref('*');
const month = ref('*');
const dayOfWeek = ref('*');
const hoveredPart = ref(-1);
const copied = ref(false);
const manualExpr = ref('');
const parseError = ref('');

const cronParts = computed(() => [minute.value, hour.value, dayOfMonth.value, month.value, dayOfWeek.value]);
const cronExpression = computed(() => cronParts.value.join(' '));

const presets = [
  { name: 'Chaque minute', expr: '* * * * *' },
  { name: 'Chaque heure', expr: '0 * * * *' },
  { name: 'Chaque jour à minuit', expr: '0 0 * * *' },
  { name: 'Chaque jour à 9h', expr: '0 9 * * *' },
  { name: 'Lun-Ven à 9h', expr: '0 9 * * 1-5' },
  { name: 'Chaque dimanche', expr: '0 0 * * 0' },
  { name: '1er du mois', expr: '0 0 1 * *' },
  { name: 'Toutes les 5 min', expr: '*/5 * * * *' },
  { name: 'Toutes les 30 min', expr: '*/30 * * * *' },
  { name: 'Chaque 6h', expr: '0 */6 * * *' }
];

function loadPreset(preset) {
  const parts = preset.expr.split(' ');
  minute.value = parts[0];
  hour.value = parts[1];
  dayOfMonth.value = parts[2];
  month.value = parts[3];
  dayOfWeek.value = parts[4];
}

const humanReadable = computed(() => {
  let text = 'Exécute ';
  
  // Minute
  if (minute.value === '*') text += 'chaque minute';
  else if (minute.value.startsWith('*/')) text += `toutes les ${minute.value.slice(2)} minutes`;
  else text += `à la minute ${minute.value}`;
  
  // Hour
  if (hour.value === '*') text += ' de chaque heure';
  else if (hour.value.startsWith('*/')) text += `, toutes les ${hour.value.slice(2)} heures`;
  else text += ` à ${hour.value}h`;
  
  // Day of week
  if (dayOfWeek.value === '1-5') text += ', du lundi au vendredi';
  else if (dayOfWeek.value === '0,6') text += ', le week-end';
  else if (dayOfWeek.value !== '*') {
    const days = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
    text += `, le ${days[parseInt(dayOfWeek.value)] || dayOfWeek.value}`;
  }
  
  // Day of month
  if (dayOfMonth.value === 'L') text += ', le dernier jour du mois';
  else if (dayOfMonth.value !== '*') text += `, le ${dayOfMonth.value} du mois`;
  
  // Month
  if (month.value !== '*') {
    const months = ['', 'janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
    text += ` en ${months[parseInt(month.value)] || month.value}`;
  }
  
  return text;
});

const nextRuns = computed(() => {
  const runs = [];
  let date = new Date();
  
  for (let i = 0; i < 5; i++) {
    date = getNextRun(date);
    if (!date) break;
    runs.push({
      date: date.toLocaleString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }),
      relative: getRelativeTime(date)
    });
    date = new Date(date.getTime() + 60000);
  }
  return runs;
});

function getNextRun(from) {
  const d = new Date(from);
  d.setSeconds(0);
  d.setMilliseconds(0);
  
  for (let i = 0; i < 525600; i++) { // Max 1 year
    d.setMinutes(d.getMinutes() + 1);
    if (matchesCron(d)) return d;
  }
  return null;
}

function matchesCron(date) {
  return matchField(minute.value, date.getMinutes(), 0, 59) &&
         matchField(hour.value, date.getHours(), 0, 23) &&
         matchField(dayOfMonth.value, date.getDate(), 1, 31) &&
         matchField(month.value, date.getMonth() + 1, 1, 12) &&
         matchDayOfWeek(dayOfWeek.value, date.getDay());
}

function matchField(expr, value, min, max) {
  if (expr === '*') return true;
  if (expr === 'L') return value === new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
  if (expr.includes('/')) {
    const step = parseInt(expr.split('/')[1]);
    return value % step === 0;
  }
  if (expr.includes('-')) {
    const [start, end] = expr.split('-').map(Number);
    return value >= start && value <= end;
  }
  if (expr.includes(',')) {
    return expr.split(',').map(Number).includes(value);
  }
  return parseInt(expr) === value;
}

function matchDayOfWeek(expr, value) {
  if (expr === '*') return true;
  if (expr.includes('-')) {
    const [start, end] = expr.split('-').map(Number);
    return value >= start && value <= end;
  }
  if (expr.includes(',')) {
    return expr.split(',').map(Number).includes(value);
  }
  return parseInt(expr) === value;
}

function getRelativeTime(date) {
  const diff = date - new Date();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 0) return `dans ${days}j ${hours % 24}h`;
  if (hours > 0) return `dans ${hours}h ${minutes % 60}min`;
  return `dans ${minutes}min`;
}

async function copyExpr() {
  await navigator.clipboard.writeText(cronExpression.value);
  copied.value = true;
  setTimeout(() => copied.value = false, 2000);
}

function parseManual() {
  const parts = manualExpr.value.trim().split(/\s+/);
  if (parts.length !== 5) {
    parseError.value = 'Format: minute heure jour mois jour_semaine';
    return;
  }
  parseError.value = '';
  minute.value = parts[0];
  hour.value = parts[1];
  dayOfMonth.value = parts[2];
  month.value = parts[3];
  dayOfWeek.value = parts[4];
}

watch(cronExpression, (val) => {
  manualExpr.value = val;
});
</script>

<style scoped>
.cron-app { min-height: 100vh; background: var(--bg-primary); }
.app-header { padding: 1rem 0; border-bottom: 1px solid var(--border); }
.back-link { color: var(--text-muted); text-decoration: none; }
.app-main { padding: var(--space-lg) 0; }
.app-intro { text-align: center; margin-bottom: 2rem; }
.app-intro h1 { display: flex; justify-content: center; gap: 0.5rem; font-size: 2rem; }
.app-icon { font-size: 2.5rem; }

.builder-card, .expression-card, .readable-card, .next-runs-card, .presets-card, .manual-card {
  background: rgba(255,255,255,0.02); border: 1px solid var(--border); border-radius: 0.75rem; padding: 1.5rem; margin-bottom: 1.5rem;
}
.builder-card h2, .presets-card h3, .readable-card h3, .next-runs-card h3, .manual-card h3 { font-size: 1rem; margin-bottom: 1rem; }

.fields-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1rem; }
.field label { display: block; font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.5rem; }
.field select { width: 100%; padding: 0.75rem; background: rgba(0,0,0,0.3); border: 1px solid var(--border); border-radius: 0.5rem; color: var(--text-main); }

.expr-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
.expr-label { font-weight: 600; }
.expr-header button { padding: 0.5rem 1rem; background: var(--primary); border: none; border-radius: 0.35rem; color: var(--bg-primary); cursor: pointer; font-size: 0.85rem; }
.expr-header button.copied { background: #10B981; }

.expr-display { display: flex; justify-content: center; gap: 1rem; font-family: 'JetBrains Mono', monospace; font-size: 2rem; margin-bottom: 0.5rem; }
.expr-part { padding: 0.5rem 1rem; background: rgba(0,0,0,0.3); border-radius: 0.5rem; transition: all 0.2s; }
.expr-part.active { background: var(--primary); color: var(--bg-primary); }
.expr-legend { display: flex; justify-content: center; gap: 1rem; font-size: 0.75rem; color: var(--text-muted); }
.expr-legend span.active { color: var(--primary); font-weight: 600; }

.readable-text { font-size: 1.1rem; color: var(--text-secondary); line-height: 1.6; }

.runs-list { list-style: none; padding: 0; }
.runs-list li { display: flex; justify-content: space-between; padding: 0.75rem 0; border-bottom: 1px solid var(--border); }
.run-date { font-family: 'JetBrains Mono', monospace; }
.run-relative { color: var(--primary); font-size: 0.85rem; }

.presets-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 0.75rem; }
.presets-grid button { display: flex; flex-direction: column; gap: 0.25rem; padding: 0.75rem; background: rgba(0,0,0,0.2); border: 1px solid var(--border); border-radius: 0.5rem; text-align: left; cursor: pointer; transition: all 0.2s; }
.presets-grid button:hover { border-color: var(--primary); }
.preset-name { font-size: 0.85rem; color: var(--text-main); }
.presets-grid code { font-size: 0.75rem; color: var(--primary); }

.manual-input { width: 100%; padding: 0.75rem; background: rgba(0,0,0,0.3); border: 1px solid var(--border); border-radius: 0.5rem; font-family: 'JetBrains Mono', monospace; font-size: 1.25rem; color: var(--text-main); text-align: center; }
.parse-error { color: #EF4444; font-size: 0.85rem; margin-top: 0.5rem; }
</style>
