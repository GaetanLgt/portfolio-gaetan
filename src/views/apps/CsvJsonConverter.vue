<template>
  <div class="csv-app">
    <header class="app-header">
      <div class="container">
        <router-link to="/apps" class="back-link">← Retour aux Apps</router-link>
      </div>
    </header>
    <main class="app-main">
      <div class="container">
        <div class="app-intro">
          <h1><span class="app-icon">📊</span> CSV ↔ JSON Converter</h1>
          <p>Convertissez vos données entre CSV et JSON instantanément</p>
        </div>

        <!-- MODE TOGGLE -->
        <div class="mode-toggle">
          <button :class="{ active: mode === 'csvToJson' }" @click="mode = 'csvToJson'">CSV → JSON</button>
          <button :class="{ active: mode === 'jsonToCsv' }" @click="mode = 'jsonToCsv'">JSON → CSV</button>
        </div>

        <div class="converter-grid">
          <!-- INPUT -->
          <div class="panel input-panel">
            <div class="panel-header">
              <span>📥 {{ mode === 'csvToJson' ? 'CSV' : 'JSON' }}</span>
              <div class="panel-actions">
                <button @click="loadSample">📄 Exemple</button>
                <button @click="input = ''">🗑️</button>
              </div>
            </div>
            <textarea v-model="input" :placeholder="inputPlaceholder" class="code-area" @input="convert"></textarea>
            
            <!-- CSV Options -->
            <div v-if="mode === 'csvToJson'" class="options-bar">
              <label>
                Délimiteur:
                <select v-model="delimiter" @change="convert">
                  <option value=",">Virgule (,)</option>
                  <option value=";">Point-virgule (;)</option>
                  <option value="\t">Tabulation</option>
                  <option value="|">Pipe (|)</option>
                </select>
              </label>
              <label class="checkbox">
                <input type="checkbox" v-model="hasHeader" @change="convert">
                Première ligne = en-têtes
              </label>
            </div>
          </div>

          <!-- OUTPUT -->
          <div class="panel output-panel">
            <div class="panel-header">
              <span>📤 {{ mode === 'csvToJson' ? 'JSON' : 'CSV' }}</span>
              <div class="panel-actions">
                <button @click="copyOutput" :class="{ copied }">{{ copied ? '✓' : '📋' }}</button>
                <button @click="downloadOutput">💾</button>
              </div>
            </div>
            <pre class="code-area output">{{ output }}</pre>
            
            <!-- Stats -->
            <div v-if="stats" class="stats-bar">
              <span>📊 {{ stats.rows }} lignes</span>
              <span>📝 {{ stats.cols }} colonnes</span>
              <span>📦 {{ stats.size }}</span>
            </div>
          </div>
        </div>

        <!-- ERROR -->
        <div v-if="error" class="error-box">❌ {{ error }}</div>

        <!-- TABLE PREVIEW -->
        <div v-if="tableData.length" class="table-section">
          <h3>👁️ Aperçu des données</h3>
          <div class="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th v-for="(col, i) in tableHeaders" :key="i">{{ col }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(row, i) in tableData.slice(0, 10)" :key="i">
                  <td v-for="(cell, j) in row" :key="j">{{ cell }}</td>
                </tr>
              </tbody>
            </table>
            <p v-if="tableData.length > 10" class="table-note">... et {{ tableData.length - 10 }} lignes de plus</p>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const mode = ref('csvToJson');
const input = ref('');
const output = ref('');
const error = ref('');
const delimiter = ref(',');
const hasHeader = ref(true);
const copied = ref(false);
const tableData = ref([]);
const tableHeaders = ref([]);

const inputPlaceholder = computed(() => {
  return mode.value === 'csvToJson' 
    ? 'name,email,age\nJohn,john@example.com,25\nJane,jane@example.com,30'
    : '[\n  {"name": "John", "email": "john@example.com", "age": 25},\n  {"name": "Jane", "email": "jane@example.com", "age": 30}\n]';
});

const stats = computed(() => {
  if (!tableData.value.length) return null;
  return {
    rows: tableData.value.length,
    cols: tableHeaders.value.length,
    size: formatSize(output.value.length)
  };
});

function formatSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  return (bytes / 1024).toFixed(1) + ' KB';
}

function loadSample() {
  if (mode.value === 'csvToJson') {
    input.value = `name,email,age,city
John Doe,john@example.com,25,Paris
Jane Smith,jane@example.com,30,Lyon
Bob Wilson,bob@example.com,35,Marseille
Alice Brown,alice@example.com,28,Toulouse`;
  } else {
    input.value = `[
  {"name": "John Doe", "email": "john@example.com", "age": 25, "city": "Paris"},
  {"name": "Jane Smith", "email": "jane@example.com", "age": 30, "city": "Lyon"},
  {"name": "Bob Wilson", "email": "bob@example.com", "age": 35, "city": "Marseille"},
  {"name": "Alice Brown", "email": "alice@example.com", "age": 28, "city": "Toulouse"}
]`;
  }
  convert();
}

function convert() {
  error.value = '';
  output.value = '';
  tableData.value = [];
  tableHeaders.value = [];
  
  if (!input.value.trim()) return;
  
  try {
    if (mode.value === 'csvToJson') {
      csvToJson();
    } else {
      jsonToCsv();
    }
  } catch (e) {
    error.value = e.message;
  }
}

function csvToJson() {
  const lines = input.value.trim().split('\n').map(line => parseCsvLine(line, delimiter.value));
  
  if (lines.length === 0) throw new Error('Aucune donnée');
  
  let headers, dataLines;
  
  if (hasHeader.value) {
    headers = lines[0];
    dataLines = lines.slice(1);
  } else {
    headers = lines[0].map((_, i) => `col${i + 1}`);
    dataLines = lines;
  }
  
  const result = dataLines.map(line => {
    const obj = {};
    headers.forEach((header, i) => {
      let value = line[i] || '';
      // Try to parse numbers
      if (/^-?\d+$/.test(value)) value = parseInt(value);
      else if (/^-?\d+\.\d+$/.test(value)) value = parseFloat(value);
      else if (value.toLowerCase() === 'true') value = true;
      else if (value.toLowerCase() === 'false') value = false;
      obj[header] = value;
    });
    return obj;
  });
  
  output.value = JSON.stringify(result, null, 2);
  tableHeaders.value = headers;
  tableData.value = dataLines;
}

function jsonToCsv() {
  const data = JSON.parse(input.value);
  
  if (!Array.isArray(data)) throw new Error('Le JSON doit être un tableau');
  if (data.length === 0) throw new Error('Tableau vide');
  
  const headers = [...new Set(data.flatMap(obj => Object.keys(obj)))];
  
  const lines = [
    headers.join(delimiter.value),
    ...data.map(obj => 
      headers.map(h => {
        let val = obj[h] ?? '';
        // Escape values with delimiter or quotes
        if (typeof val === 'string' && (val.includes(delimiter.value) || val.includes('"') || val.includes('\n'))) {
          val = '"' + val.replace(/"/g, '""') + '"';
        }
        return val;
      }).join(delimiter.value)
    )
  ];
  
  output.value = lines.join('\n');
  tableHeaders.value = headers;
  tableData.value = data.map(obj => headers.map(h => obj[h] ?? ''));
}

function parseCsvLine(line, delim) {
  const result = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === delim && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  
  return result;
}

async function copyOutput() {
  await navigator.clipboard.writeText(output.value);
  copied.value = true;
  setTimeout(() => copied.value = false, 2000);
}

function downloadOutput() {
  const ext = mode.value === 'csvToJson' ? 'json' : 'csv';
  const type = mode.value === 'csvToJson' ? 'application/json' : 'text/csv';
  const blob = new Blob([output.value], { type });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `data.${ext}`;
  a.click();
}
</script>

<style scoped>
.csv-app { min-height: 100vh; background: var(--bg-primary); }
.app-header { padding: 1rem 0; border-bottom: 1px solid var(--border); }
.back-link { color: var(--text-muted); text-decoration: none; }
.app-main { padding: var(--space-lg) 0; }
.app-intro { text-align: center; margin-bottom: 2rem; }
.app-intro h1 { display: flex; justify-content: center; gap: 0.5rem; font-size: 2rem; }
.app-icon { font-size: 2.5rem; }

.mode-toggle { display: flex; justify-content: center; gap: 0.25rem; margin-bottom: 1.5rem; }
.mode-toggle button { padding: 0.75rem 1.5rem; background: rgba(255,255,255,0.02); border: 1px solid var(--border); color: var(--text-muted); cursor: pointer; font-size: 0.9rem; }
.mode-toggle button:first-child { border-radius: 0.5rem 0 0 0.5rem; }
.mode-toggle button:last-child { border-radius: 0 0.5rem 0.5rem 0; }
.mode-toggle button.active { background: var(--primary); border-color: var(--primary); color: var(--bg-primary); }

.converter-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-bottom: 1rem; }
.panel { background: rgba(255,255,255,0.02); border: 1px solid var(--border); border-radius: 0.75rem; overflow: hidden; }
.panel-header { display: flex; justify-content: space-between; align-items: center; padding: 0.75rem 1rem; background: rgba(0,0,0,0.2); border-bottom: 1px solid var(--border); font-weight: 600; }
.panel-actions { display: flex; gap: 0.25rem; }
.panel-actions button { padding: 0.35rem 0.6rem; background: transparent; border: 1px solid var(--border); border-radius: 0.25rem; color: var(--text-muted); cursor: pointer; font-size: 0.8rem; }
.panel-actions button:hover { border-color: var(--primary); color: var(--primary); }
.panel-actions button.copied { background: var(--primary); border-color: var(--primary); color: var(--bg-primary); }

.code-area { width: 100%; min-height: 300px; padding: 1rem; background: transparent; border: none; font-family: monospace; font-size: 0.85rem; color: var(--text-main); resize: vertical; }
.code-area:focus { outline: none; }
.code-area.output { color: var(--text-secondary); overflow: auto; }

.options-bar { display: flex; gap: 1.5rem; padding: 0.75rem 1rem; border-top: 1px solid var(--border); background: rgba(0,0,0,0.1); }
.options-bar label { display: flex; align-items: center; gap: 0.5rem; font-size: 0.85rem; color: var(--text-muted); }
.options-bar select { padding: 0.35rem; background: rgba(0,0,0,0.3); border: 1px solid var(--border); border-radius: 0.25rem; color: var(--text-main); }
.checkbox input { accent-color: var(--primary); }

.stats-bar { display: flex; gap: 1.5rem; padding: 0.75rem 1rem; border-top: 1px solid var(--border); background: rgba(0,0,0,0.1); font-size: 0.8rem; color: var(--text-muted); }

.error-box { padding: 1rem; background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.3); border-radius: 0.5rem; color: #EF4444; margin-bottom: 1rem; }

.table-section { background: rgba(255,255,255,0.02); border: 1px solid var(--border); border-radius: 0.75rem; padding: 1rem; }
.table-section h3 { font-size: 1rem; margin-bottom: 1rem; }
.table-wrapper { overflow-x: auto; }
table { width: 100%; border-collapse: collapse; font-size: 0.85rem; }
th, td { padding: 0.6rem 0.75rem; text-align: left; border-bottom: 1px solid var(--border); }
th { background: rgba(0,0,0,0.2); font-weight: 600; color: var(--primary); }
td { color: var(--text-secondary); }
.table-note { text-align: center; color: var(--text-muted); font-size: 0.8rem; margin-top: 0.5rem; }

@media (max-width: 768px) { .converter-grid { grid-template-columns: 1fr; } }
</style>
