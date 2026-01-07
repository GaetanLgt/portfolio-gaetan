<template>
  <div class="openapi-app">
    <header class="app-header">
      <div class="container">
        <router-link to="/apps" class="back-link">← Retour aux Apps</router-link>
      </div>
    </header>
    <main class="app-main">
      <div class="container">
        <div class="app-intro">
          <h1><span class="app-icon">📖</span> OpenAPI Viewer</h1>
          <p>Visualisez et explorez vos spécifications OpenAPI/Swagger</p>
        </div>

        <!-- SAMPLE SELECTOR -->
        <div class="sample-section">
          <span>Exemples:</span>
          <button @click="loadSample('petstore')" :class="{ active: activeSample === 'petstore' }">🐕 Petstore</button>
          <button @click="loadSample('users')" :class="{ active: activeSample === 'users' }">👤 Users API</button>
        </div>

        <!-- API INFO -->
        <div v-if="spec" class="spec-content">
          <div class="api-header">
            <h2>{{ spec.info.title }}</h2>
            <span class="api-version">v{{ spec.info.version }}</span>
            <p class="api-desc">{{ spec.info.description }}</p>
            <code class="server-url">{{ spec.servers[0].url }}</code>
          </div>

          <!-- ENDPOINTS -->
          <div class="endpoints-list">
            <div v-for="(pathData, path) in spec.paths" :key="path" class="endpoint-group">
              <div v-for="(opData, method) in filterMethods(pathData)" :key="method" class="endpoint-card" @click="toggleEndpoint(path + method)">
                <div class="endpoint-summary">
                  <span class="method-badge" :class="'m-' + method">{{ method.toUpperCase() }}</span>
                  <code class="endpoint-path">{{ path }}</code>
                  <span class="endpoint-title">{{ opData.summary }}</span>
                </div>
                
                <div v-if="expanded === path + method" class="endpoint-details" @click.stop>
                  <div v-if="opData.parameters?.length" class="params-section">
                    <h4>Paramètres</h4>
                    <div v-for="p in opData.parameters" :key="p.name" class="param-row">
                      <code>{{ p.name }}</code>
                      <span class="param-in">{{ p.in }}</span>
                      <span class="param-type">{{ p.schema?.type }}</span>
                      <span v-if="p.required" class="required">requis</span>
                    </div>
                  </div>
                  <div class="responses-section">
                    <h4>Réponses</h4>
                    <div v-for="(resp, code) in opData.responses" :key="code" class="response-row">
                      <span class="status-code" :class="getStatusClass(code)">{{ code }}</span>
                      <span>{{ resp.description }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- STATS -->
          <div class="api-stats">
            <div class="stat"><span class="stat-val">{{ countEndpoints }}</span> endpoints</div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const activeSample = ref('petstore');
const expanded = ref(null);

const samples = {
  petstore: {
    openapi: '3.0.0',
    info: { title: 'Petstore API', version: '1.0.0', description: 'API de gestion d\'animaux' },
    servers: [{ url: 'https://api.petstore.com/v1' }],
    paths: {
      '/pets': {
        get: { summary: 'Liste les animaux', parameters: [{ name: 'limit', in: 'query', schema: { type: 'integer' } }], responses: { '200': { description: 'OK' } } },
        post: { summary: 'Créer un animal', responses: { '201': { description: 'Créé' } } }
      },
      '/pets/{id}': {
        get: { summary: 'Détails animal', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { '200': { description: 'OK' }, '404': { description: 'Non trouvé' } } },
        delete: { summary: 'Supprimer', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { '204': { description: 'Supprimé' } } }
      }
    }
  },
  users: {
    openapi: '3.0.0',
    info: { title: 'Users API', version: '2.0.0', description: 'Gestion utilisateurs' },
    servers: [{ url: 'https://api.example.com' }],
    paths: {
      '/users': {
        get: { summary: 'Liste utilisateurs', parameters: [{ name: 'page', in: 'query', schema: { type: 'integer' } }], responses: { '200': { description: 'OK' } } },
        post: { summary: 'Créer utilisateur', responses: { '201': { description: 'Créé' }, '400': { description: 'Invalide' } } }
      },
      '/users/{id}': {
        get: { summary: 'Détails', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { '200': { description: 'OK' } } },
        patch: { summary: 'Modifier', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { '200': { description: 'OK' } } },
        delete: { summary: 'Supprimer', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { '204': { description: 'OK' } } }
      }
    }
  }
};

const spec = computed(() => samples[activeSample.value]);

function loadSample(name) { activeSample.value = name; expanded.value = null; }
function toggleEndpoint(id) { expanded.value = expanded.value === id ? null : id; }
function filterMethods(data) { return Object.fromEntries(Object.entries(data).filter(([k]) => ['get','post','put','patch','delete'].includes(k))); }
function getStatusClass(code) { const c = parseInt(code); return c < 300 ? 'success' : c < 500 ? 'error' : 'server'; }
const countEndpoints = computed(() => Object.values(spec.value.paths).reduce((sum, p) => sum + Object.keys(filterMethods(p)).length, 0));
</script>

<style scoped>
.openapi-app { min-height: 100vh; background: var(--bg-primary); }
.app-header { padding: 1rem 0; border-bottom: 1px solid var(--border); }
.back-link { color: var(--text-muted); text-decoration: none; }
.app-main { padding: var(--space-lg) 0; }
.app-intro { text-align: center; margin-bottom: 2rem; }
.app-intro h1 { display: flex; justify-content: center; gap: 0.5rem; font-size: 2rem; }
.app-icon { font-size: 2.5rem; }

.sample-section { display: flex; gap: 0.5rem; align-items: center; margin-bottom: 2rem; flex-wrap: wrap; }
.sample-section span { color: var(--text-muted); }
.sample-section button { padding: 0.5rem 1rem; background: rgba(255,255,255,0.02); border: 1px solid var(--border); border-radius: 0.35rem; color: var(--text-muted); cursor: pointer; }
.sample-section button:hover, .sample-section button.active { border-color: var(--primary); color: var(--primary); }

.api-header { padding: 1.5rem; background: rgba(255,255,255,0.02); border: 1px solid var(--border); border-radius: 0.75rem; margin-bottom: 1.5rem; }
.api-header h2 { margin: 0 0 0.5rem; display: inline; }
.api-version { background: var(--primary); color: var(--bg-primary); padding: 0.2rem 0.5rem; border-radius: 0.25rem; font-size: 0.75rem; margin-left: 0.5rem; }
.api-desc { color: var(--text-muted); margin: 0.75rem 0; }
.server-url { display: block; padding: 0.5rem; background: rgba(0,0,0,0.2); border-radius: 0.25rem; font-size: 0.85rem; color: var(--text-secondary); }

.endpoint-group { margin-bottom: 0.5rem; }
.endpoint-card { background: rgba(255,255,255,0.02); border: 1px solid var(--border); border-radius: 0.5rem; margin-bottom: 0.35rem; cursor: pointer; overflow: hidden; }
.endpoint-summary { display: flex; align-items: center; gap: 0.75rem; padding: 0.75rem 1rem; }
.method-badge { padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-size: 0.7rem; font-weight: 700; min-width: 55px; text-align: center; }
.m-get { background: rgba(16,185,129,0.2); color: #10B981; }
.m-post { background: rgba(245,158,11,0.2); color: #F59E0B; }
.m-put { background: rgba(59,130,246,0.2); color: #3B82F6; }
.m-patch { background: rgba(139,92,246,0.2); color: #8B5CF6; }
.m-delete { background: rgba(239,68,68,0.2); color: #EF4444; }
.endpoint-path { font-size: 0.9rem; color: var(--text-main); }
.endpoint-title { color: var(--text-muted); font-size: 0.85rem; margin-left: auto; }

.endpoint-details { padding: 1rem; border-top: 1px solid var(--border); background: rgba(0,0,0,0.1); cursor: default; }
.params-section, .responses-section { margin-bottom: 1rem; }
.params-section h4, .responses-section h4 { font-size: 0.85rem; margin-bottom: 0.5rem; color: var(--text-muted); }
.param-row, .response-row { display: flex; gap: 0.75rem; align-items: center; padding: 0.35rem 0; font-size: 0.85rem; }
.param-in { background: rgba(0,0,0,0.2); padding: 0.15rem 0.4rem; border-radius: 0.2rem; font-size: 0.75rem; }
.param-type { color: var(--primary); font-family: monospace; }
.required { color: #EF4444; font-size: 0.75rem; }
.status-code { padding: 0.15rem 0.4rem; border-radius: 0.2rem; font-family: monospace; font-size: 0.8rem; }
.status-code.success { background: rgba(16,185,129,0.2); color: #10B981; }
.status-code.error { background: rgba(239,68,68,0.2); color: #EF4444; }

.api-stats { display: flex; gap: 2rem; justify-content: center; padding: 1.5rem; margin-top: 1.5rem; }
.stat { text-align: center; }
.stat-val { font-size: 2rem; font-weight: 700; color: var(--primary); margin-right: 0.5rem; }
</style>
