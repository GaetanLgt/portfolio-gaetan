<template>
  <div class="erd-app">
    <header class="app-header">
      <div class="container">
        <router-link to="/apps" class="back-link">← Retour aux Apps</router-link>
      </div>
    </header>
    <main class="app-main">
      <div class="container">
        <div class="app-intro">
          <h1><span class="app-icon">🗄️</span> ERD Designer</h1>
          <p>Concevez vos diagrammes entité-relation pour bases de données</p>
        </div>

        <div class="designer-layout">
          <!-- LEFT: Tables List -->
          <div class="tables-panel">
            <div class="panel-header">
              <h3>📊 Tables</h3>
              <button @click="addTable" class="add-btn">+ Table</button>
            </div>
            <div class="tables-list">
              <div v-for="table in tables" :key="table.id" class="table-item" :class="{ active: selectedTable === table.id }" @click="selectTable(table.id)">
                <span class="table-icon">📋</span>
                <span class="table-name">{{ table.name }}</span>
                <span class="table-count">{{ table.columns.length }} cols</span>
              </div>
            </div>

            <!-- Relations -->
            <div class="relations-section">
              <h4>🔗 Relations</h4>
              <div v-for="rel in relations" :key="rel.id" class="relation-item">
                <span>{{ getTableName(rel.from) }}.{{ rel.fromCol }}</span>
                <span class="rel-arrow">→</span>
                <span>{{ getTableName(rel.to) }}.{{ rel.toCol }}</span>
                <button @click="removeRelation(rel.id)" class="rel-delete">✕</button>
              </div>
              <button v-if="tables.length >= 2" @click="showAddRelation = true" class="add-rel-btn">+ Relation</button>
            </div>
          </div>

          <!-- CENTER: Table Editor -->
          <div class="editor-panel">
            <div v-if="currentTable" class="table-editor">
              <div class="editor-header">
                <input type="text" v-model="currentTable.name" class="table-name-input" placeholder="Nom de la table">
                <button @click="deleteTable(currentTable.id)" class="delete-btn">🗑️ Supprimer</button>
              </div>

              <!-- Columns -->
              <div class="columns-section">
                <h4>Colonnes</h4>
                <table class="columns-table">
                  <thead>
                    <tr>
                      <th>🔑</th>
                      <th>Nom</th>
                      <th>Type</th>
                      <th>NN</th>
                      <th>UQ</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(col, i) in currentTable.columns" :key="i">
                      <td>
                        <input type="checkbox" v-model="col.isPK" title="Primary Key">
                      </td>
                      <td>
                        <input type="text" v-model="col.name" placeholder="column_name" class="col-input">
                      </td>
                      <td>
                        <select v-model="col.type" class="type-select">
                          <option value="INT">INT</option>
                          <option value="BIGINT">BIGINT</option>
                          <option value="VARCHAR(255)">VARCHAR(255)</option>
                          <option value="TEXT">TEXT</option>
                          <option value="BOOLEAN">BOOLEAN</option>
                          <option value="DATE">DATE</option>
                          <option value="DATETIME">DATETIME</option>
                          <option value="TIMESTAMP">TIMESTAMP</option>
                          <option value="DECIMAL(10,2)">DECIMAL(10,2)</option>
                          <option value="JSON">JSON</option>
                          <option value="UUID">UUID</option>
                        </select>
                      </td>
                      <td><input type="checkbox" v-model="col.notNull" title="Not Null"></td>
                      <td><input type="checkbox" v-model="col.unique" title="Unique"></td>
                      <td>
                        <button @click="removeColumn(i)" class="col-delete">✕</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <button @click="addColumn" class="add-col-btn">+ Colonne</button>
              </div>

              <!-- Indexes -->
              <div class="indexes-section">
                <h4>Index</h4>
                <div v-for="(idx, i) in currentTable.indexes" :key="i" class="index-item">
                  <select v-model="idx.type" class="idx-type">
                    <option value="INDEX">INDEX</option>
                    <option value="UNIQUE">UNIQUE</option>
                    <option value="FULLTEXT">FULLTEXT</option>
                  </select>
                  <input type="text" v-model="idx.columns" placeholder="col1, col2" class="idx-cols">
                  <button @click="currentTable.indexes.splice(i, 1)" class="idx-delete">✕</button>
                </div>
                <button @click="addIndex" class="add-idx-btn">+ Index</button>
              </div>
            </div>

            <div v-else class="no-table">
              <span class="empty-icon">📊</span>
              <p>Sélectionnez une table ou créez-en une nouvelle</p>
            </div>
          </div>

          <!-- RIGHT: Preview & Export -->
          <div class="preview-panel">
            <div class="preview-tabs">
              <button :class="{ active: previewTab === 'diagram' }" @click="previewTab = 'diagram'">📐 Diagram</button>
              <button :class="{ active: previewTab === 'sql' }" @click="previewTab = 'sql'">💾 SQL</button>
            </div>

            <!-- Diagram Preview -->
            <div v-if="previewTab === 'diagram'" class="diagram-preview">
              <svg :viewBox="`0 0 ${diagramWidth} ${diagramHeight}`" class="erd-svg">
                <!-- Relations lines -->
                <g class="relations-layer">
                  <path v-for="rel in relations" :key="'line-'+rel.id" :d="getRelationPath(rel)" class="relation-line"/>
                </g>
                <!-- Tables -->
                <g v-for="(table, i) in tables" :key="table.id" :transform="`translate(${getTableX(i)}, ${getTableY(i)})`" class="table-box">
                  <rect :width="180" :height="40 + table.columns.length * 24" rx="4" class="table-rect"/>
                  <rect width="180" height="32" rx="4" class="table-header"/>
                  <text x="90" y="22" class="table-title">{{ table.name }}</text>
                  <g v-for="(col, j) in table.columns" :key="j" :transform="`translate(0, ${36 + j * 24})`">
                    <text x="10" y="16" class="col-pk" v-if="col.isPK">🔑</text>
                    <text :x="col.isPK ? 28 : 10" y="16" class="col-name">{{ col.name }}</text>
                    <text x="170" y="16" class="col-type">{{ col.type.split('(')[0] }}</text>
                  </g>
                </g>
              </svg>
            </div>

            <!-- SQL Preview -->
            <div v-if="previewTab === 'sql'" class="sql-preview">
              <div class="sql-actions">
                <select v-model="sqlDialect">
                  <option value="mysql">MySQL</option>
                  <option value="postgres">PostgreSQL</option>
                  <option value="sqlite">SQLite</option>
                </select>
                <button @click="copySql" :class="{ copied }">{{ copied ? '✓' : '📋' }}</button>
                <button @click="downloadSql">💾</button>
              </div>
              <pre class="sql-code">{{ generatedSql }}</pre>
            </div>
          </div>
        </div>

        <!-- Add Relation Modal -->
        <div v-if="showAddRelation" class="modal-overlay" @click="showAddRelation = false">
          <div class="modal-content" @click.stop>
            <h3>Ajouter une relation</h3>
            <div class="rel-form">
              <div class="rel-side">
                <label>Table source</label>
                <select v-model="newRelation.from">
                  <option v-for="t in tables" :key="t.id" :value="t.id">{{ t.name }}</option>
                </select>
                <select v-model="newRelation.fromCol" v-if="newRelation.from">
                  <option v-for="c in getTableById(newRelation.from)?.columns" :key="c.name" :value="c.name">{{ c.name }}</option>
                </select>
              </div>
              <span class="rel-arrow-big">→</span>
              <div class="rel-side">
                <label>Table cible</label>
                <select v-model="newRelation.to">
                  <option v-for="t in tables" :key="t.id" :value="t.id">{{ t.name }}</option>
                </select>
                <select v-model="newRelation.toCol" v-if="newRelation.to">
                  <option v-for="c in getTableById(newRelation.to)?.columns" :key="c.name" :value="c.name">{{ c.name }}</option>
                </select>
              </div>
            </div>
            <div class="modal-actions">
              <button @click="showAddRelation = false" class="cancel-btn">Annuler</button>
              <button @click="addRelation" class="confirm-btn">Ajouter</button>
            </div>
          </div>
        </div>

        <!-- Templates -->
        <div class="templates-section">
          <h3>📦 Templates</h3>
          <div class="templates-grid">
            <button @click="loadTemplate('blog')">📝 Blog</button>
            <button @click="loadTemplate('ecommerce')">🛒 E-commerce</button>
            <button @click="loadTemplate('users')">👤 Users/Auth</button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue';

const selectedTable = ref(null);
const previewTab = ref('diagram');
const sqlDialect = ref('mysql');
const copied = ref(false);
const showAddRelation = ref(false);

const tables = ref([]);
const relations = ref([]);
let tableIdCounter = 1;
let relationIdCounter = 1;

const newRelation = reactive({ from: null, fromCol: '', to: null, toCol: '' });

const diagramWidth = 800;
const diagramHeight = 500;

const currentTable = computed(() => tables.value.find(t => t.id === selectedTable.value));

function addTable() {
  const id = tableIdCounter++;
  tables.value.push({
    id,
    name: `table_${id}`,
    columns: [
      { name: 'id', type: 'INT', isPK: true, notNull: true, unique: false }
    ],
    indexes: []
  });
  selectedTable.value = id;
}

function selectTable(id) {
  selectedTable.value = id;
}

function deleteTable(id) {
  tables.value = tables.value.filter(t => t.id !== id);
  relations.value = relations.value.filter(r => r.from !== id && r.to !== id);
  selectedTable.value = null;
}

function addColumn() {
  if (!currentTable.value) return;
  currentTable.value.columns.push({
    name: '',
    type: 'VARCHAR(255)',
    isPK: false,
    notNull: false,
    unique: false
  });
}

function removeColumn(index) {
  if (!currentTable.value) return;
  currentTable.value.columns.splice(index, 1);
}

function addIndex() {
  if (!currentTable.value) return;
  currentTable.value.indexes.push({ type: 'INDEX', columns: '' });
}

function getTableById(id) {
  return tables.value.find(t => t.id === id);
}

function getTableName(id) {
  return getTableById(id)?.name || '?';
}

function addRelation() {
  if (!newRelation.from || !newRelation.to || !newRelation.fromCol || !newRelation.toCol) return;
  relations.value.push({
    id: relationIdCounter++,
    from: newRelation.from,
    fromCol: newRelation.fromCol,
    to: newRelation.to,
    toCol: newRelation.toCol
  });
  showAddRelation.value = false;
  newRelation.from = null;
  newRelation.fromCol = '';
  newRelation.to = null;
  newRelation.toCol = '';
}

function removeRelation(id) {
  relations.value = relations.value.filter(r => r.id !== id);
}

function getTableX(index) {
  return 50 + (index % 3) * 250;
}

function getTableY(index) {
  return 50 + Math.floor(index / 3) * 200;
}

function getRelationPath(rel) {
  const fromIdx = tables.value.findIndex(t => t.id === rel.from);
  const toIdx = tables.value.findIndex(t => t.id === rel.to);
  if (fromIdx < 0 || toIdx < 0) return '';
  
  const x1 = getTableX(fromIdx) + 180;
  const y1 = getTableY(fromIdx) + 50;
  const x2 = getTableX(toIdx);
  const y2 = getTableY(toIdx) + 50;
  
  return `M ${x1} ${y1} C ${x1 + 50} ${y1} ${x2 - 50} ${y2} ${x2} ${y2}`;
}

const generatedSql = computed(() => {
  let sql = '';
  const q = sqlDialect.value === 'mysql' ? '`' : '"';
  
  tables.value.forEach(table => {
    sql += `CREATE TABLE ${q}${table.name}${q} (\n`;
    
    const colDefs = table.columns.map(col => {
      let def = `  ${q}${col.name}${q} ${col.type}`;
      if (col.notNull) def += ' NOT NULL';
      if (col.unique && !col.isPK) def += ' UNIQUE';
      if (col.isPK && sqlDialect.value !== 'sqlite') def += ' AUTO_INCREMENT';
      return def;
    });
    
    const pks = table.columns.filter(c => c.isPK).map(c => `${q}${c.name}${q}`);
    if (pks.length) {
      colDefs.push(`  PRIMARY KEY (${pks.join(', ')})`);
    }
    
    sql += colDefs.join(',\n');
    sql += '\n);\n\n';
    
    table.indexes.forEach(idx => {
      const cols = idx.columns.split(',').map(c => `${q}${c.trim()}${q}`).join(', ');
      sql += `CREATE ${idx.type} idx_${table.name}_${idx.columns.replace(/,\s*/g, '_')} ON ${q}${table.name}${q} (${cols});\n`;
    });
  });
  
  relations.value.forEach(rel => {
    const fromTable = getTableById(rel.from);
    const toTable = getTableById(rel.to);
    if (fromTable && toTable) {
      sql += `\nALTER TABLE ${q}${fromTable.name}${q} ADD CONSTRAINT fk_${fromTable.name}_${rel.fromCol} FOREIGN KEY (${q}${rel.fromCol}${q}) REFERENCES ${q}${toTable.name}${q}(${q}${rel.toCol}${q});\n`;
    }
  });
  
  return sql || '-- Créez des tables pour générer le SQL';
});

async function copySql() {
  await navigator.clipboard.writeText(generatedSql.value);
  copied.value = true;
  setTimeout(() => copied.value = false, 2000);
}

function downloadSql() {
  const blob = new Blob([generatedSql.value], { type: 'text/sql' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'schema.sql';
  a.click();
}

function loadTemplate(type) {
  tables.value = [];
  relations.value = [];
  tableIdCounter = 1;
  relationIdCounter = 1;
  
  if (type === 'blog') {
    tables.value = [
      { id: 1, name: 'users', columns: [
        { name: 'id', type: 'INT', isPK: true, notNull: true },
        { name: 'email', type: 'VARCHAR(255)', notNull: true, unique: true },
        { name: 'name', type: 'VARCHAR(255)', notNull: true },
        { name: 'created_at', type: 'TIMESTAMP', notNull: true }
      ], indexes: [] },
      { id: 2, name: 'posts', columns: [
        { name: 'id', type: 'INT', isPK: true, notNull: true },
        { name: 'user_id', type: 'INT', notNull: true },
        { name: 'title', type: 'VARCHAR(255)', notNull: true },
        { name: 'content', type: 'TEXT' },
        { name: 'published_at', type: 'DATETIME' }
      ], indexes: [{ type: 'INDEX', columns: 'user_id' }] },
      { id: 3, name: 'comments', columns: [
        { name: 'id', type: 'INT', isPK: true, notNull: true },
        { name: 'post_id', type: 'INT', notNull: true },
        { name: 'user_id', type: 'INT', notNull: true },
        { name: 'body', type: 'TEXT', notNull: true }
      ], indexes: [] }
    ];
    relations.value = [
      { id: 1, from: 2, fromCol: 'user_id', to: 1, toCol: 'id' },
      { id: 2, from: 3, fromCol: 'post_id', to: 2, toCol: 'id' },
      { id: 3, from: 3, fromCol: 'user_id', to: 1, toCol: 'id' }
    ];
    tableIdCounter = 4;
    relationIdCounter = 4;
  } else if (type === 'ecommerce') {
    tables.value = [
      { id: 1, name: 'products', columns: [
        { name: 'id', type: 'INT', isPK: true, notNull: true },
        { name: 'name', type: 'VARCHAR(255)', notNull: true },
        { name: 'price', type: 'DECIMAL(10,2)', notNull: true },
        { name: 'stock', type: 'INT', notNull: true }
      ], indexes: [] },
      { id: 2, name: 'orders', columns: [
        { name: 'id', type: 'INT', isPK: true, notNull: true },
        { name: 'customer_id', type: 'INT', notNull: true },
        { name: 'total', type: 'DECIMAL(10,2)', notNull: true },
        { name: 'status', type: 'VARCHAR(255)' }
      ], indexes: [] },
      { id: 3, name: 'order_items', columns: [
        { name: 'id', type: 'INT', isPK: true, notNull: true },
        { name: 'order_id', type: 'INT', notNull: true },
        { name: 'product_id', type: 'INT', notNull: true },
        { name: 'quantity', type: 'INT', notNull: true }
      ], indexes: [] }
    ];
    relations.value = [
      { id: 1, from: 3, fromCol: 'order_id', to: 2, toCol: 'id' },
      { id: 2, from: 3, fromCol: 'product_id', to: 1, toCol: 'id' }
    ];
    tableIdCounter = 4;
    relationIdCounter = 3;
  } else if (type === 'users') {
    tables.value = [
      { id: 1, name: 'users', columns: [
        { name: 'id', type: 'UUID', isPK: true, notNull: true },
        { name: 'email', type: 'VARCHAR(255)', notNull: true, unique: true },
        { name: 'password_hash', type: 'VARCHAR(255)', notNull: true },
        { name: 'role', type: 'VARCHAR(255)' }
      ], indexes: [] },
      { id: 2, name: 'sessions', columns: [
        { name: 'id', type: 'UUID', isPK: true, notNull: true },
        { name: 'user_id', type: 'UUID', notNull: true },
        { name: 'token', type: 'VARCHAR(255)', notNull: true },
        { name: 'expires_at', type: 'DATETIME', notNull: true }
      ], indexes: [{ type: 'INDEX', columns: 'user_id' }] }
    ];
    relations.value = [
      { id: 1, from: 2, fromCol: 'user_id', to: 1, toCol: 'id' }
    ];
    tableIdCounter = 3;
    relationIdCounter = 2;
  }
  
  selectedTable.value = tables.value[0]?.id || null;
}

// Load default template
loadTemplate('blog');
</script>

<style scoped>
.erd-app { min-height: 100vh; background: var(--bg-primary); }
.app-header { padding: 1rem 0; border-bottom: 1px solid var(--border); }
.back-link { color: var(--text-muted); text-decoration: none; }
.app-main { padding: var(--space-lg) 0; }
.app-intro { text-align: center; margin-bottom: 1.5rem; }
.app-intro h1 { display: flex; justify-content: center; gap: 0.5rem; font-size: 1.75rem; }
.app-icon { font-size: 2rem; }

.designer-layout { display: grid; grid-template-columns: 220px 1fr 320px; gap: 1rem; margin-bottom: 2rem; }

.tables-panel, .editor-panel, .preview-panel { background: rgba(255,255,255,0.02); border: 1px solid var(--border); border-radius: 0.5rem; }

.panel-header { display: flex; justify-content: space-between; align-items: center; padding: 0.75rem; border-bottom: 1px solid var(--border); }
.panel-header h3 { font-size: 0.9rem; margin: 0; }
.add-btn { padding: 0.35rem 0.75rem; background: var(--primary); border: none; border-radius: 0.25rem; font-size: 0.8rem; color: var(--bg-primary); cursor: pointer; }

.tables-list { padding: 0.5rem; max-height: 250px; overflow-y: auto; }
.table-item { display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem; border-radius: 0.35rem; cursor: pointer; margin-bottom: 0.25rem; }
.table-item:hover { background: rgba(255,255,255,0.05); }
.table-item.active { background: rgba(0,255,136,0.1); border: 1px solid var(--primary); }
.table-icon { font-size: 1rem; }
.table-name { flex: 1; font-size: 0.85rem; font-family: monospace; }
.table-count { font-size: 0.7rem; color: var(--text-muted); }

.relations-section { padding: 0.75rem; border-top: 1px solid var(--border); }
.relations-section h4 { font-size: 0.85rem; margin-bottom: 0.5rem; }
.relation-item { display: flex; align-items: center; gap: 0.35rem; font-size: 0.75rem; padding: 0.35rem; background: rgba(0,0,0,0.2); border-radius: 0.25rem; margin-bottom: 0.35rem; font-family: monospace; }
.rel-arrow { color: var(--primary); }
.rel-delete { padding: 0.15rem 0.35rem; background: transparent; border: none; color: var(--text-muted); cursor: pointer; margin-left: auto; }
.add-rel-btn { width: 100%; padding: 0.4rem; background: transparent; border: 1px dashed var(--border); border-radius: 0.25rem; color: var(--text-muted); cursor: pointer; font-size: 0.8rem; }

.editor-panel { padding: 1rem; }
.editor-header { display: flex; gap: 0.75rem; margin-bottom: 1rem; }
.table-name-input { flex: 1; padding: 0.5rem; background: rgba(0,0,0,0.3); border: 1px solid var(--border); border-radius: 0.35rem; font-family: monospace; font-size: 1rem; color: var(--primary); }
.delete-btn { padding: 0.5rem 0.75rem; background: transparent; border: 1px solid #EF4444; border-radius: 0.35rem; color: #EF4444; cursor: pointer; font-size: 0.8rem; }

.columns-section h4, .indexes-section h4 { font-size: 0.9rem; margin-bottom: 0.5rem; }
.columns-table { width: 100%; border-collapse: collapse; font-size: 0.85rem; margin-bottom: 0.5rem; }
.columns-table th { text-align: left; padding: 0.35rem; color: var(--text-muted); font-weight: normal; font-size: 0.75rem; }
.columns-table td { padding: 0.35rem; }
.columns-table input[type="checkbox"] { accent-color: var(--primary); }
.col-input { width: 100%; padding: 0.35rem; background: rgba(0,0,0,0.3); border: 1px solid var(--border); border-radius: 0.25rem; font-family: monospace; font-size: 0.8rem; color: var(--text-main); }
.type-select { padding: 0.35rem; background: rgba(0,0,0,0.3); border: 1px solid var(--border); border-radius: 0.25rem; font-size: 0.8rem; color: var(--text-main); }
.col-delete { padding: 0.2rem 0.4rem; background: transparent; border: none; color: var(--text-muted); cursor: pointer; }
.add-col-btn, .add-idx-btn { padding: 0.4rem 0.75rem; background: transparent; border: 1px dashed var(--border); border-radius: 0.25rem; color: var(--text-muted); cursor: pointer; font-size: 0.8rem; }

.indexes-section { margin-top: 1rem; padding-top: 1rem; border-top: 1px solid var(--border); }
.index-item { display: flex; gap: 0.5rem; margin-bottom: 0.35rem; }
.idx-type { padding: 0.35rem; background: rgba(0,0,0,0.3); border: 1px solid var(--border); border-radius: 0.25rem; font-size: 0.8rem; color: var(--text-main); }
.idx-cols { flex: 1; padding: 0.35rem; background: rgba(0,0,0,0.3); border: 1px solid var(--border); border-radius: 0.25rem; font-family: monospace; font-size: 0.8rem; color: var(--text-main); }
.idx-delete { padding: 0.2rem 0.4rem; background: transparent; border: none; color: var(--text-muted); cursor: pointer; }

.no-table { text-align: center; padding: 3rem; color: var(--text-muted); }
.empty-icon { font-size: 3rem; display: block; margin-bottom: 1rem; }

.preview-tabs { display: flex; border-bottom: 1px solid var(--border); }
.preview-tabs button { flex: 1; padding: 0.75rem; background: transparent; border: none; color: var(--text-muted); cursor: pointer; font-size: 0.85rem; }
.preview-tabs button.active { background: rgba(0,255,136,0.1); color: var(--primary); }

.diagram-preview { padding: 0.5rem; }
.erd-svg { width: 100%; height: 350px; background: rgba(0,0,0,0.2); border-radius: 0.35rem; }
.table-rect { fill: rgba(0,0,0,0.5); stroke: var(--border); stroke-width: 1; }
.table-header { fill: var(--primary); opacity: 0.2; }
.table-title { fill: var(--primary); font-size: 12px; font-weight: 600; text-anchor: middle; }
.col-pk { font-size: 10px; }
.col-name { fill: var(--text-main); font-size: 11px; font-family: monospace; }
.col-type { fill: var(--text-muted); font-size: 10px; text-anchor: end; }
.relation-line { fill: none; stroke: var(--text-muted); stroke-width: 1.5; stroke-dasharray: 4,2; }

.sql-preview { padding: 0.5rem; }
.sql-actions { display: flex; gap: 0.35rem; margin-bottom: 0.5rem; }
.sql-actions select { padding: 0.35rem; background: rgba(0,0,0,0.3); border: 1px solid var(--border); border-radius: 0.25rem; color: var(--text-main); font-size: 0.8rem; }
.sql-actions button { padding: 0.35rem 0.6rem; background: transparent; border: 1px solid var(--border); border-radius: 0.25rem; color: var(--text-muted); cursor: pointer; }
.sql-actions button.copied { background: var(--primary); border-color: var(--primary); color: var(--bg-primary); }
.sql-code { padding: 0.75rem; background: rgba(0,0,0,0.3); border-radius: 0.35rem; font-family: monospace; font-size: 0.75rem; color: var(--text-secondary); max-height: 300px; overflow: auto; white-space: pre-wrap; }

.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.7); display: flex; align-items: center; justify-content: center; z-index: 100; }
.modal-content { background: var(--bg-primary); border: 1px solid var(--border); border-radius: 0.75rem; padding: 1.5rem; width: 90%; max-width: 500px; }
.modal-content h3 { margin-bottom: 1rem; }
.rel-form { display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem; }
.rel-side { flex: 1; }
.rel-side label { display: block; font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.35rem; }
.rel-side select { width: 100%; padding: 0.5rem; background: rgba(0,0,0,0.3); border: 1px solid var(--border); border-radius: 0.35rem; color: var(--text-main); margin-bottom: 0.5rem; }
.rel-arrow-big { font-size: 1.5rem; color: var(--primary); }
.modal-actions { display: flex; justify-content: flex-end; gap: 0.5rem; }
.cancel-btn { padding: 0.5rem 1rem; background: transparent; border: 1px solid var(--border); border-radius: 0.35rem; color: var(--text-muted); cursor: pointer; }
.confirm-btn { padding: 0.5rem 1rem; background: var(--primary); border: none; border-radius: 0.35rem; color: var(--bg-primary); cursor: pointer; }

.templates-section h3 { font-size: 1rem; margin-bottom: 0.75rem; }
.templates-grid { display: flex; gap: 0.75rem; flex-wrap: wrap; }
.templates-grid button { padding: 0.6rem 1rem; background: rgba(255,255,255,0.02); border: 1px solid var(--border); border-radius: 0.5rem; color: var(--text-muted); cursor: pointer; }
.templates-grid button:hover { border-color: var(--primary); color: var(--primary); }

@media (max-width: 1024px) { .designer-layout { grid-template-columns: 1fr; } }
</style>
