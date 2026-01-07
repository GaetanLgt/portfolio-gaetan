<template>
  <div class="table-app">
    <header class="app-header">
      <div class="container">
        <router-link to="/apps" class="back-link">← Retour aux Apps</router-link>
      </div>
    </header>
    <main class="app-main">
      <div class="container">
        <div class="app-intro">
          <h1><span class="app-icon">📋</span> Markdown Table Generator</h1>
          <p>Créez des tableaux Markdown en quelques clics</p>
        </div>

        <!-- SIZE CONFIG -->
        <div class="config-bar">
          <div class="size-config">
            <label>
              Colonnes:
              <input type="number" v-model.number="cols" min="1" max="20" @change="resizeTable">
            </label>
            <label>
              Lignes:
              <input type="number" v-model.number="rows" min="1" max="50" @change="resizeTable">
            </label>
          </div>
          <div class="quick-actions">
            <button @click="addColumn">+ Colonne</button>
            <button @click="addRow">+ Ligne</button>
            <button @click="clearTable" class="clear-btn">🗑️ Vider</button>
          </div>
        </div>

        <!-- TABLE EDITOR -->
        <div class="editor-section">
          <h3>✏️ Éditeur</h3>
          <div class="table-editor">
            <table>
              <thead>
                <tr>
                  <th class="row-num">#</th>
                  <th v-for="(_, c) in cols" :key="c">
                    <div class="header-cell">
                      <input 
                        type="text" 
                        v-model="headers[c]" 
                        :placeholder="'Col ' + (c + 1)"
                        class="cell-input header-input"
                      >
                      <select v-model="alignments[c]" class="align-select">
                        <option value="left">⬅️</option>
                        <option value="center">↔️</option>
                        <option value="right">➡️</option>
                      </select>
                    </div>
                  </th>
                  <th class="actions-col"></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(row, r) in data" :key="r">
                  <td class="row-num">{{ r + 1 }}</td>
                  <td v-for="(_, c) in cols" :key="c">
                    <input 
                      type="text" 
                      v-model="data[r][c]" 
                      placeholder="..."
                      class="cell-input"
                    >
                  </td>
                  <td class="actions-col">
                    <button @click="removeRow(r)" class="row-action" title="Supprimer">✕</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- PREVIEW -->
        <div class="preview-section">
          <div class="preview-header">
            <h3>📋 Markdown généré</h3>
            <div class="preview-actions">
              <button @click="copyMarkdown" :class="{ copied }">{{ copied ? '✓ Copié' : '📋 Copier' }}</button>
            </div>
          </div>
          <pre class="markdown-output">{{ markdownOutput }}</pre>
        </div>

        <!-- RENDERED PREVIEW -->
        <div class="rendered-section">
          <h3>👁️ Rendu</h3>
          <div class="rendered-table" v-html="renderedHtml"></div>
        </div>

        <!-- IMPORT -->
        <div class="import-section">
          <h3>📥 Importer</h3>
          <div class="import-options">
            <button @click="showImport = 'csv'">Depuis CSV</button>
            <button @click="showImport = 'markdown'">Depuis Markdown</button>
          </div>
          <div v-if="showImport" class="import-area">
            <textarea v-model="importText" :placeholder="importPlaceholder" class="import-textarea"></textarea>
            <button @click="doImport" class="import-btn">Importer</button>
          </div>
        </div>

        <!-- TEMPLATES -->
        <div class="templates-section">
          <h3>📦 Templates</h3>
          <div class="templates-grid">
            <button @click="loadTemplate('comparison')">⚖️ Comparaison</button>
            <button @click="loadTemplate('pricing')">💰 Tarifs</button>
            <button @click="loadTemplate('features')">✅ Features</button>
            <button @click="loadTemplate('schedule')">📅 Planning</button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';

const cols = ref(3);
const rows = ref(3);
const headers = ref(['Nom', 'Description', 'Prix']);
const alignments = ref(['left', 'left', 'right']);
const data = ref([
  ['Produit A', 'Description du produit A', '29€'],
  ['Produit B', 'Description du produit B', '49€'],
  ['Produit C', 'Description du produit C', '99€']
]);
const copied = ref(false);
const showImport = ref('');
const importText = ref('');

const importPlaceholder = computed(() => {
  return showImport.value === 'csv' 
    ? 'col1,col2,col3\nval1,val2,val3\n...'
    : '| Col1 | Col2 |\n|------|------|\n| val1 | val2 |';
});

function resizeTable() {
  // Adjust headers
  while (headers.value.length < cols.value) headers.value.push('');
  while (headers.value.length > cols.value) headers.value.pop();
  
  // Adjust alignments
  while (alignments.value.length < cols.value) alignments.value.push('left');
  while (alignments.value.length > cols.value) alignments.value.pop();
  
  // Adjust data rows
  while (data.value.length < rows.value) data.value.push(Array(cols.value).fill(''));
  while (data.value.length > rows.value) data.value.pop();
  
  // Adjust each row's columns
  data.value.forEach(row => {
    while (row.length < cols.value) row.push('');
    while (row.length > cols.value) row.pop();
  });
}

function addColumn() {
  cols.value++;
  resizeTable();
}

function addRow() {
  rows.value++;
  resizeTable();
}

function removeRow(index) {
  if (data.value.length > 1) {
    data.value.splice(index, 1);
    rows.value = data.value.length;
  }
}

function clearTable() {
  headers.value = Array(cols.value).fill('');
  data.value = Array(rows.value).fill(null).map(() => Array(cols.value).fill(''));
}

const markdownOutput = computed(() => {
  const colWidths = headers.value.map((h, i) => {
    const headerLen = h.length || 3;
    const maxDataLen = Math.max(...data.value.map(row => (row[i] || '').length), 3);
    return Math.max(headerLen, maxDataLen);
  });
  
  const pad = (str, width, align) => {
    const s = str || '';
    const diff = width - s.length;
    if (diff <= 0) return s;
    if (align === 'center') return ' '.repeat(Math.floor(diff/2)) + s + ' '.repeat(Math.ceil(diff/2));
    if (align === 'right') return ' '.repeat(diff) + s;
    return s + ' '.repeat(diff);
  };
  
  const headerRow = '| ' + headers.value.map((h, i) => pad(h || `Col${i+1}`, colWidths[i], alignments.value[i])).join(' | ') + ' |';
  
  const separatorRow = '| ' + alignments.value.map((align, i) => {
    const w = colWidths[i];
    if (align === 'center') return ':' + '-'.repeat(w - 2) + ':';
    if (align === 'right') return '-'.repeat(w - 1) + ':';
    return '-'.repeat(w);
  }).join(' | ') + ' |';
  
  const dataRows = data.value.map(row => 
    '| ' + row.map((cell, i) => pad(cell, colWidths[i], alignments.value[i])).join(' | ') + ' |'
  ).join('\n');
  
  return [headerRow, separatorRow, dataRows].join('\n');
});

const renderedHtml = computed(() => {
  let html = '<table><thead><tr>';
  headers.value.forEach((h, i) => {
    html += `<th style="text-align:${alignments.value[i]}">${escapeHtml(h || `Col${i+1}`)}</th>`;
  });
  html += '</tr></thead><tbody>';
  data.value.forEach(row => {
    html += '<tr>';
    row.forEach((cell, i) => {
      html += `<td style="text-align:${alignments.value[i]}">${escapeHtml(cell)}</td>`;
    });
    html += '</tr>';
  });
  html += '</tbody></table>';
  return html;
});

function escapeHtml(str) {
  return (str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

async function copyMarkdown() {
  await navigator.clipboard.writeText(markdownOutput.value);
  copied.value = true;
  setTimeout(() => copied.value = false, 2000);
}

function doImport() {
  if (showImport.value === 'csv') {
    const lines = importText.value.trim().split('\n');
    if (lines.length < 2) return;
    
    const parseLine = (line) => line.split(',').map(s => s.trim().replace(/^"|"$/g, ''));
    headers.value = parseLine(lines[0]);
    data.value = lines.slice(1).map(parseLine);
    cols.value = headers.value.length;
    rows.value = data.value.length;
    alignments.value = Array(cols.value).fill('left');
  } else {
    const lines = importText.value.trim().split('\n').filter(l => l.startsWith('|'));
    if (lines.length < 2) return;
    
    const parseLine = (line) => line.split('|').slice(1, -1).map(s => s.trim());
    headers.value = parseLine(lines[0]);
    data.value = lines.slice(2).map(parseLine);
    cols.value = headers.value.length;
    rows.value = data.value.length;
    
    // Parse alignments
    const sepLine = lines[1];
    alignments.value = sepLine.split('|').slice(1, -1).map(s => {
      s = s.trim();
      if (s.startsWith(':') && s.endsWith(':')) return 'center';
      if (s.endsWith(':')) return 'right';
      return 'left';
    });
  }
  
  showImport.value = '';
  importText.value = '';
}

function loadTemplate(type) {
  const templates = {
    comparison: {
      headers: ['Fonctionnalité', 'Produit A', 'Produit B', 'Produit C'],
      alignments: ['left', 'center', 'center', 'center'],
      data: [
        ['Prix', '29€/mois', '49€/mois', '99€/mois'],
        ['Utilisateurs', '1', '5', 'Illimité'],
        ['Support', 'Email', 'Email + Chat', 'Prioritaire'],
        ['API', '❌', '✅', '✅']
      ]
    },
    pricing: {
      headers: ['Plan', 'Prix', 'Fonctionnalités'],
      alignments: ['left', 'right', 'left'],
      data: [
        ['Starter', '0€', 'Fonctionnalités de base'],
        ['Pro', '29€/mois', 'Tout Starter + Analytics'],
        ['Enterprise', 'Sur devis', 'Tout Pro + Support dédié']
      ]
    },
    features: {
      headers: ['Feature', 'Status', 'Notes'],
      alignments: ['left', 'center', 'left'],
      data: [
        ['Authentication', '✅', 'OAuth2, JWT'],
        ['Dark Mode', '✅', 'Auto/Manual'],
        ['Export PDF', '🚧', 'En cours'],
        ['Mobile App', '📅', 'Prévu Q2']
      ]
    },
    schedule: {
      headers: ['Jour', 'Matin', 'Après-midi'],
      alignments: ['left', 'center', 'center'],
      data: [
        ['Lundi', '9h-12h', '14h-18h'],
        ['Mardi', '9h-12h', '14h-18h'],
        ['Mercredi', '10h-12h', 'Fermé'],
        ['Jeudi', '9h-12h', '14h-18h'],
        ['Vendredi', '9h-12h', '14h-17h']
      ]
    }
  };
  
  const tpl = templates[type];
  headers.value = [...tpl.headers];
  alignments.value = [...tpl.alignments];
  data.value = tpl.data.map(row => [...row]);
  cols.value = tpl.headers.length;
  rows.value = tpl.data.length;
}
</script>

<style scoped>
.table-app { min-height: 100vh; background: var(--bg-primary); }
.app-header { padding: 1rem 0; border-bottom: 1px solid var(--border); }
.back-link { color: var(--text-muted); text-decoration: none; }
.app-main { padding: var(--space-lg) 0; }
.app-intro { text-align: center; margin-bottom: 2rem; }
.app-intro h1 { display: flex; justify-content: center; gap: 0.5rem; font-size: 2rem; }
.app-icon { font-size: 2.5rem; }

.config-bar { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; margin-bottom: 1.5rem; padding: 1rem; background: rgba(255,255,255,0.02); border: 1px solid var(--border); border-radius: 0.5rem; }
.size-config { display: flex; gap: 1rem; }
.size-config label { display: flex; align-items: center; gap: 0.5rem; font-size: 0.9rem; }
.size-config input { width: 60px; padding: 0.4rem; background: rgba(0,0,0,0.3); border: 1px solid var(--border); border-radius: 0.25rem; color: var(--text-main); text-align: center; }
.quick-actions { display: flex; gap: 0.5rem; }
.quick-actions button { padding: 0.5rem 1rem; background: rgba(255,255,255,0.05); border: 1px solid var(--border); border-radius: 0.35rem; color: var(--text-muted); cursor: pointer; font-size: 0.85rem; }
.quick-actions button:hover { border-color: var(--primary); color: var(--primary); }
.clear-btn:hover { border-color: #EF4444 !important; color: #EF4444 !important; }

.editor-section, .preview-section, .rendered-section, .import-section, .templates-section { margin-bottom: 1.5rem; }
.editor-section h3, .preview-section h3, .rendered-section h3, .import-section h3, .templates-section h3 { font-size: 1rem; margin-bottom: 1rem; }

.table-editor { overflow-x: auto; }
.table-editor table { width: 100%; border-collapse: collapse; }
.table-editor th, .table-editor td { padding: 0.35rem; border: 1px solid var(--border); }
.table-editor th { background: rgba(0,0,0,0.2); }
.row-num { width: 40px; text-align: center; color: var(--text-muted); font-size: 0.8rem; }
.actions-col { width: 40px; }
.header-cell { display: flex; gap: 0.25rem; }
.cell-input { width: 100%; padding: 0.5rem; background: rgba(0,0,0,0.2); border: 1px solid transparent; border-radius: 0.25rem; color: var(--text-main); font-size: 0.85rem; }
.cell-input:focus { outline: none; border-color: var(--primary); }
.header-input { font-weight: 600; color: var(--primary); }
.align-select { width: 40px; padding: 0.25rem; background: rgba(0,0,0,0.3); border: 1px solid var(--border); border-radius: 0.25rem; font-size: 0.75rem; cursor: pointer; }
.row-action { padding: 0.25rem 0.5rem; background: transparent; border: 1px solid var(--border); border-radius: 0.25rem; color: var(--text-muted); cursor: pointer; }
.row-action:hover { border-color: #EF4444; color: #EF4444; }

.preview-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; }
.preview-actions button { padding: 0.5rem 1rem; background: var(--primary); border: none; border-radius: 0.35rem; color: var(--bg-primary); cursor: pointer; }
.preview-actions button.copied { background: #10B981; }
.markdown-output { padding: 1rem; background: rgba(0,0,0,0.3); border: 1px solid var(--border); border-radius: 0.5rem; font-family: monospace; font-size: 0.85rem; color: var(--text-secondary); overflow-x: auto; }

.rendered-table { padding: 1rem; background: rgba(255,255,255,0.02); border: 1px solid var(--border); border-radius: 0.5rem; overflow-x: auto; }
.rendered-table :deep(table) { width: 100%; border-collapse: collapse; }
.rendered-table :deep(th), .rendered-table :deep(td) { padding: 0.6rem 0.75rem; border: 1px solid var(--border); }
.rendered-table :deep(th) { background: rgba(0,0,0,0.2); color: var(--primary); }
.rendered-table :deep(td) { color: var(--text-secondary); }

.import-options { display: flex; gap: 0.5rem; margin-bottom: 0.75rem; }
.import-options button { padding: 0.5rem 1rem; background: rgba(255,255,255,0.05); border: 1px solid var(--border); border-radius: 0.35rem; color: var(--text-muted); cursor: pointer; }
.import-options button:hover { border-color: var(--primary); color: var(--primary); }
.import-area { display: flex; flex-direction: column; gap: 0.5rem; }
.import-textarea { width: 100%; min-height: 100px; padding: 0.75rem; background: rgba(0,0,0,0.3); border: 1px solid var(--border); border-radius: 0.5rem; font-family: monospace; font-size: 0.85rem; color: var(--text-main); }
.import-btn { align-self: flex-start; padding: 0.5rem 1.5rem; background: var(--primary); border: none; border-radius: 0.35rem; color: var(--bg-primary); cursor: pointer; }

.templates-grid { display: flex; flex-wrap: wrap; gap: 0.75rem; }
.templates-grid button { padding: 0.6rem 1rem; background: rgba(255,255,255,0.02); border: 1px solid var(--border); border-radius: 0.5rem; color: var(--text-muted); cursor: pointer; }
.templates-grid button:hover { border-color: var(--primary); color: var(--primary); }
</style>
