<template>
  <div class="schema-app">
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

    <main class="app-main">
      <div class="container">
        <div class="app-intro">
          <h1><span class="app-icon">📐</span> JSON Schema Generator</h1>
          <p>Générez des schémas JSON pour valider vos données et structurer vos APIs</p>
        </div>

        <!-- BUILDER -->
        <div class="builder-layout">
          <!-- LEFT: Fields -->
          <div class="fields-panel">
            <div class="panel-header">
              <h2>🔧 Champs</h2>
              <button class="add-field-btn" @click="addField">+ Ajouter</button>
            </div>

            <div class="fields-list">
              <div v-for="(field, i) in fields" :key="field.id" class="field-card">
                <div class="field-header">
                  <input type="text" v-model="field.name" placeholder="nom_champ" class="field-name">
                  <button class="remove-btn" @click="removeField(i)">✕</button>
                </div>
                
                <div class="field-row">
                  <select v-model="field.type" class="field-type">
                    <option value="string">String</option>
                    <option value="number">Number</option>
                    <option value="integer">Integer</option>
                    <option value="boolean">Boolean</option>
                    <option value="array">Array</option>
                    <option value="object">Object</option>
                    <option value="null">Null</option>
                  </select>
                  <label class="required-toggle">
                    <input type="checkbox" v-model="field.required">
                    <span>Required</span>
                  </label>
                </div>

                <input type="text" v-model="field.description" placeholder="Description..." class="field-desc">

                <!-- String options -->
                <div v-if="field.type === 'string'" class="field-options">
                  <div class="option-row">
                    <input type="number" v-model.number="field.minLength" placeholder="Min length" class="small-input">
                    <input type="number" v-model.number="field.maxLength" placeholder="Max length" class="small-input">
                  </div>
                  <select v-model="field.format" class="field-format">
                    <option value="">Pas de format</option>
                    <option value="email">Email</option>
                    <option value="uri">URL</option>
                    <option value="date">Date</option>
                    <option value="date-time">Date-Time</option>
                    <option value="uuid">UUID</option>
                    <option value="ipv4">IPv4</option>
                    <option value="ipv6">IPv6</option>
                  </select>
                  <input type="text" v-model="field.pattern" placeholder="Pattern regex..." class="field-pattern">
                  <input type="text" v-model="field.enumValues" placeholder="Enum: val1, val2, val3" class="field-enum">
                </div>

                <!-- Number options -->
                <div v-if="field.type === 'number' || field.type === 'integer'" class="field-options">
                  <div class="option-row">
                    <input type="number" v-model.number="field.minimum" placeholder="Minimum" class="small-input">
                    <input type="number" v-model.number="field.maximum" placeholder="Maximum" class="small-input">
                  </div>
                </div>

                <!-- Array options -->
                <div v-if="field.type === 'array'" class="field-options">
                  <select v-model="field.itemsType" class="field-format">
                    <option value="string">Items: String</option>
                    <option value="number">Items: Number</option>
                    <option value="integer">Items: Integer</option>
                    <option value="boolean">Items: Boolean</option>
                    <option value="object">Items: Object</option>
                  </select>
                  <div class="option-row">
                    <input type="number" v-model.number="field.minItems" placeholder="Min items" class="small-input">
                    <input type="number" v-model.number="field.maxItems" placeholder="Max items" class="small-input">
                  </div>
                  <label class="unique-toggle">
                    <input type="checkbox" v-model="field.uniqueItems">
                    <span>Unique items</span>
                  </label>
                </div>
              </div>

              <div v-if="!fields.length" class="empty-fields">
                <p>Ajoutez des champs pour générer votre schéma</p>
              </div>
            </div>
          </div>

          <!-- RIGHT: Preview -->
          <div class="preview-panel">
            <div class="panel-header">
              <h2>📋 Schéma JSON</h2>
              <div class="preview-actions">
                <button @click="copySchema" :class="{ copied }">{{ copied ? '✓' : '📋' }}</button>
                <button @click="downloadSchema">💾</button>
              </div>
            </div>
            <pre class="schema-preview">{{ generatedSchema }}</pre>
          </div>
        </div>

        <!-- TEMPLATES -->
        <div class="templates-section">
          <h2>📦 Templates</h2>
          <div class="templates-grid">
            <button v-for="tpl in templates" :key="tpl.name" class="template-btn" @click="loadTemplate(tpl)">
              <span class="tpl-icon">{{ tpl.icon }}</span>
              <span class="tpl-name">{{ tpl.name }}</span>
            </button>
          </div>
        </div>

        <!-- VALIDATOR -->
        <div class="validator-section">
          <h2>✅ Testeur de validation</h2>
          <div class="validator-grid">
            <div class="validator-input">
              <label>JSON à valider:</label>
              <textarea v-model="testJson" placeholder='{"name": "test", "age": 25}' class="test-textarea"></textarea>
            </div>
            <div class="validator-result">
              <label>Résultat:</label>
              <div class="result-box" :class="validationResult.valid ? 'valid' : 'invalid'">
                <span class="result-icon">{{ validationResult.valid ? '✅' : '❌' }}</span>
                <span class="result-text">{{ validationResult.message }}</span>
              </div>
              <ul v-if="validationResult.errors.length" class="error-list">
                <li v-for="(err, i) in validationResult.errors" :key="i">{{ err }}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';

const copied = ref(false);
const testJson = ref('');

const fields = ref([
  { id: 1, name: 'id', type: 'integer', required: true, description: 'Unique identifier' },
  { id: 2, name: 'name', type: 'string', required: true, description: 'User name', minLength: 1, maxLength: 100 },
  { id: 3, name: 'email', type: 'string', required: true, description: 'Email address', format: 'email' }
]);

let fieldIdCounter = 4;

const templates = [
  {
    name: 'User',
    icon: '👤',
    fields: [
      { name: 'id', type: 'integer', required: true, description: 'User ID' },
      { name: 'username', type: 'string', required: true, minLength: 3, maxLength: 50 },
      { name: 'email', type: 'string', required: true, format: 'email' },
      { name: 'age', type: 'integer', minimum: 0, maximum: 150 },
      { name: 'active', type: 'boolean', required: true }
    ]
  },
  {
    name: 'Product',
    icon: '📦',
    fields: [
      { name: 'id', type: 'string', required: true, format: 'uuid' },
      { name: 'name', type: 'string', required: true, minLength: 1 },
      { name: 'price', type: 'number', required: true, minimum: 0 },
      { name: 'category', type: 'string', enumValues: 'electronics, clothing, food, other' },
      { name: 'tags', type: 'array', itemsType: 'string', uniqueItems: true }
    ]
  },
  {
    name: 'API Response',
    icon: '🔌',
    fields: [
      { name: 'success', type: 'boolean', required: true },
      { name: 'data', type: 'object', required: true },
      { name: 'message', type: 'string' },
      { name: 'timestamp', type: 'string', format: 'date-time' }
    ]
  },
  {
    name: 'Config',
    icon: '⚙️',
    fields: [
      { name: 'apiKey', type: 'string', required: true },
      { name: 'endpoint', type: 'string', required: true, format: 'uri' },
      { name: 'timeout', type: 'integer', minimum: 0, maximum: 60000 },
      { name: 'retries', type: 'integer', minimum: 0, maximum: 10 },
      { name: 'debug', type: 'boolean' }
    ]
  }
];

function addField() {
  fields.value.push({
    id: fieldIdCounter++,
    name: '',
    type: 'string',
    required: false,
    description: ''
  });
}

function removeField(index) {
  fields.value.splice(index, 1);
}

function loadTemplate(tpl) {
  fields.value = tpl.fields.map((f, i) => ({
    id: fieldIdCounter++,
    ...f
  }));
}

const generatedSchema = computed(() => {
  const schema = {
    $schema: 'https://json-schema.org/draft/2020-12/schema',
    type: 'object',
    properties: {},
    required: []
  };

  for (const field of fields.value) {
    if (!field.name) continue;

    const prop = { type: field.type };
    
    if (field.description) prop.description = field.description;
    
    // String options
    if (field.type === 'string') {
      if (field.minLength) prop.minLength = field.minLength;
      if (field.maxLength) prop.maxLength = field.maxLength;
      if (field.format) prop.format = field.format;
      if (field.pattern) prop.pattern = field.pattern;
      if (field.enumValues) {
        prop.enum = field.enumValues.split(',').map(v => v.trim()).filter(Boolean);
      }
    }
    
    // Number options
    if (field.type === 'number' || field.type === 'integer') {
      if (field.minimum !== undefined && field.minimum !== '') prop.minimum = field.minimum;
      if (field.maximum !== undefined && field.maximum !== '') prop.maximum = field.maximum;
    }
    
    // Array options
    if (field.type === 'array') {
      prop.items = { type: field.itemsType || 'string' };
      if (field.minItems) prop.minItems = field.minItems;
      if (field.maxItems) prop.maxItems = field.maxItems;
      if (field.uniqueItems) prop.uniqueItems = true;
    }

    schema.properties[field.name] = prop;
    
    if (field.required) {
      schema.required.push(field.name);
    }
  }

  if (!schema.required.length) delete schema.required;

  return JSON.stringify(schema, null, 2);
});

const validationResult = computed(() => {
  if (!testJson.value.trim()) {
    return { valid: true, message: 'Entrez du JSON à valider', errors: [] };
  }

  let data;
  try {
    data = JSON.parse(testJson.value);
  } catch (e) {
    return { valid: false, message: 'JSON invalide: ' + e.message, errors: [] };
  }

  const errors = [];
  const schema = JSON.parse(generatedSchema.value);

  // Check required fields
  if (schema.required) {
    for (const req of schema.required) {
      if (!(req in data)) {
        errors.push(`Champ requis manquant: "${req}"`);
      }
    }
  }

  // Check types and constraints
  for (const [key, prop] of Object.entries(schema.properties)) {
    if (!(key in data)) continue;
    
    const value = data[key];
    const expectedType = prop.type;
    
    // Type checking
    if (expectedType === 'string' && typeof value !== 'string') {
      errors.push(`"${key}" devrait être une string`);
    } else if (expectedType === 'number' && typeof value !== 'number') {
      errors.push(`"${key}" devrait être un number`);
    } else if (expectedType === 'integer' && (!Number.isInteger(value))) {
      errors.push(`"${key}" devrait être un integer`);
    } else if (expectedType === 'boolean' && typeof value !== 'boolean') {
      errors.push(`"${key}" devrait être un boolean`);
    } else if (expectedType === 'array' && !Array.isArray(value)) {
      errors.push(`"${key}" devrait être un array`);
    } else if (expectedType === 'object' && (typeof value !== 'object' || Array.isArray(value))) {
      errors.push(`"${key}" devrait être un object`);
    }

    // String constraints
    if (expectedType === 'string' && typeof value === 'string') {
      if (prop.minLength && value.length < prop.minLength) {
        errors.push(`"${key}" trop court (min: ${prop.minLength})`);
      }
      if (prop.maxLength && value.length > prop.maxLength) {
        errors.push(`"${key}" trop long (max: ${prop.maxLength})`);
      }
      if (prop.enum && !prop.enum.includes(value)) {
        errors.push(`"${key}" doit être parmi: ${prop.enum.join(', ')}`);
      }
    }

    // Number constraints
    if ((expectedType === 'number' || expectedType === 'integer') && typeof value === 'number') {
      if (prop.minimum !== undefined && value < prop.minimum) {
        errors.push(`"${key}" trop petit (min: ${prop.minimum})`);
      }
      if (prop.maximum !== undefined && value > prop.maximum) {
        errors.push(`"${key}" trop grand (max: ${prop.maximum})`);
      }
    }
  }

  return {
    valid: errors.length === 0,
    message: errors.length === 0 ? 'JSON valide ✓' : `${errors.length} erreur(s) trouvée(s)`,
    errors
  };
});

async function copySchema() {
  await navigator.clipboard.writeText(generatedSchema.value);
  copied.value = true;
  setTimeout(() => copied.value = false, 2000);
}

function downloadSchema() {
  const blob = new Blob([generatedSchema.value], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'schema.json';
  a.click();
}
</script>

<style scoped>
.schema-app { min-height: 100vh; background: var(--bg-primary); }
.app-header { padding: 1rem 0; border-bottom: 1px solid var(--border); background: rgba(10,10,15,0.9); backdrop-filter: blur(10px); }
.back-link { display: inline-flex; align-items: center; gap: 0.5rem; color: var(--text-muted); text-decoration: none; }
.back-link:hover { color: var(--primary); }
.app-main { padding: var(--space-lg) 0; }
.app-intro { text-align: center; margin-bottom: var(--space-lg); }
.app-intro h1 { display: flex; align-items: center; justify-content: center; gap: 0.75rem; font-size: 2rem; margin-bottom: 0.5rem; }
.app-icon { font-size: 2.5rem; }
.app-intro p { color: var(--text-muted); }

.builder-layout { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-bottom: var(--space-lg); }
.fields-panel, .preview-panel { background: rgba(255,255,255,0.02); border: 1px solid var(--border); border-radius: 0.75rem; }
.panel-header { display: flex; justify-content: space-between; align-items: center; padding: 1rem; border-bottom: 1px solid var(--border); }
.panel-header h2 { font-size: 1rem; margin: 0; }
.add-field-btn { padding: 0.4rem 0.75rem; background: var(--primary); border: none; border-radius: 0.35rem; font-size: 0.8rem; color: var(--bg-primary); cursor: pointer; }

.fields-list { padding: 1rem; max-height: 600px; overflow-y: auto; display: flex; flex-direction: column; gap: 1rem; }
.field-card { padding: 1rem; background: rgba(0,0,0,0.2); border: 1px solid var(--border); border-radius: 0.5rem; }
.field-header { display: flex; gap: 0.5rem; margin-bottom: 0.75rem; }
.field-name { flex: 1; padding: 0.5rem; background: rgba(0,0,0,0.3); border: 1px solid var(--border); border-radius: 0.35rem; font-family: 'JetBrains Mono', monospace; font-size: 0.85rem; color: var(--primary); }
.remove-btn { padding: 0.35rem 0.5rem; background: transparent; border: 1px solid var(--border); border-radius: 0.25rem; color: var(--text-muted); cursor: pointer; }
.remove-btn:hover { border-color: #EF4444; color: #EF4444; }

.field-row { display: flex; gap: 0.75rem; align-items: center; margin-bottom: 0.5rem; }
.field-type { flex: 1; padding: 0.5rem; background: rgba(0,0,0,0.3); border: 1px solid var(--border); border-radius: 0.35rem; color: var(--text-main); font-size: 0.85rem; }
.required-toggle, .unique-toggle { display: flex; align-items: center; gap: 0.35rem; font-size: 0.8rem; color: var(--text-muted); cursor: pointer; }
.required-toggle input, .unique-toggle input { accent-color: var(--primary); }

.field-desc { width: 100%; padding: 0.5rem; background: rgba(0,0,0,0.3); border: 1px solid var(--border); border-radius: 0.35rem; font-size: 0.8rem; color: var(--text-secondary); margin-bottom: 0.5rem; }
.field-options { display: flex; flex-direction: column; gap: 0.5rem; padding-top: 0.5rem; border-top: 1px solid var(--border); }
.option-row { display: flex; gap: 0.5rem; }
.small-input { flex: 1; padding: 0.4rem; background: rgba(0,0,0,0.3); border: 1px solid var(--border); border-radius: 0.25rem; font-size: 0.8rem; color: var(--text-main); }
.field-format, .field-pattern, .field-enum { width: 100%; padding: 0.4rem; background: rgba(0,0,0,0.3); border: 1px solid var(--border); border-radius: 0.25rem; font-size: 0.8rem; color: var(--text-main); }

.empty-fields { text-align: center; padding: 2rem; color: var(--text-muted); }

.preview-actions { display: flex; gap: 0.25rem; }
.preview-actions button { padding: 0.35rem 0.6rem; background: transparent; border: 1px solid var(--border); border-radius: 0.25rem; cursor: pointer; }
.preview-actions button:hover { border-color: var(--primary); }
.preview-actions button.copied { background: var(--primary); border-color: var(--primary); }
.schema-preview { padding: 1rem; font-family: 'JetBrains Mono', monospace; font-size: 0.8rem; color: var(--text-secondary); white-space: pre-wrap; max-height: 600px; overflow-y: auto; line-height: 1.5; }

.templates-section, .validator-section { margin-bottom: var(--space-lg); }
.templates-section h2, .validator-section h2 { font-size: 1.1rem; margin-bottom: 1rem; }
.templates-grid { display: flex; flex-wrap: wrap; gap: 0.75rem; }
.template-btn { display: flex; align-items: center; gap: 0.5rem; padding: 0.6rem 1rem; background: rgba(255,255,255,0.02); border: 1px solid var(--border); border-radius: 0.5rem; cursor: pointer; }
.template-btn:hover { border-color: var(--primary); }
.tpl-icon { font-size: 1.25rem; }
.tpl-name { font-size: 0.85rem; color: var(--text-secondary); }

.validator-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
.validator-input label, .validator-result label { display: block; font-size: 0.85rem; margin-bottom: 0.5rem; color: var(--text-muted); }
.test-textarea { width: 100%; min-height: 120px; padding: 0.75rem; background: rgba(0,0,0,0.3); border: 1px solid var(--border); border-radius: 0.5rem; font-family: 'JetBrains Mono', monospace; font-size: 0.85rem; color: var(--text-main); resize: vertical; }
.result-box { display: flex; align-items: center; gap: 0.75rem; padding: 1rem; border-radius: 0.5rem; margin-bottom: 0.75rem; }
.result-box.valid { background: rgba(16,185,129,0.1); border: 1px solid rgba(16,185,129,0.3); }
.result-box.invalid { background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.3); }
.result-icon { font-size: 1.25rem; }
.result-text { font-size: 0.9rem; }
.result-box.valid .result-text { color: #10B981; }
.result-box.invalid .result-text { color: #EF4444; }
.error-list { padding-left: 1.25rem; font-size: 0.8rem; color: #EF4444; }
.error-list li { margin-bottom: 0.25rem; }

@media (max-width: 968px) {
  .builder-layout, .validator-grid { grid-template-columns: 1fr; }
}
</style>
