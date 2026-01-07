<template>
  <div class="webhook-app">
    <header class="app-header">
      <div class="container">
        <router-link to="/apps" class="back-link">← Retour aux Apps</router-link>
      </div>
    </header>
    <main class="app-main">
      <div class="container">
        <div class="app-intro">
          <h1><span class="app-icon">🪝</span> Webhook Tester</h1>
          <p>Générez des URLs de test et inspectez les requêtes webhook entrantes</p>
        </div>

        <!-- URL GENERATOR -->
        <div class="url-section">
          <h3>🔗 URL de test</h3>
          <div class="url-display">
            <code>{{ webhookUrl }}</code>
            <button @click="copyUrl" :class="{ copied: urlCopied }">{{ urlCopied ? '✓' : '📋' }}</button>
            <button @click="generateNewUrl">🔄</button>
          </div>
          <p class="url-note">⚠️ Simulateur local - Les requêtes sont générées côté client pour la démonstration</p>
        </div>

        <!-- SEND TEST REQUEST -->
        <div class="test-section">
          <h3>🚀 Envoyer une requête test</h3>
          <div class="test-form">
            <div class="test-row">
              <select v-model="testMethod" class="method-select">
                <option>POST</option>
                <option>GET</option>
                <option>PUT</option>
                <option>DELETE</option>
              </select>
              <select v-model="testPayloadType" class="payload-select">
                <option value="json">JSON</option>
                <option value="form">Form Data</option>
                <option value="text">Text</option>
              </select>
            </div>
            <textarea v-model="testPayload" placeholder='{"event": "user.created", "data": {...}}' class="payload-input"></textarea>
            <div class="test-actions">
              <button @click="loadPayloadTemplate('user')">👤 User Event</button>
              <button @click="loadPayloadTemplate('order')">🛒 Order Event</button>
              <button @click="loadPayloadTemplate('stripe')">💳 Stripe</button>
              <button @click="sendTestRequest" class="send-btn">📤 Envoyer</button>
            </div>
          </div>
        </div>

        <!-- REQUESTS LOG -->
        <div class="log-section">
          <div class="log-header">
            <h3>📥 Requêtes reçues ({{ requests.length }})</h3>
            <button v-if="requests.length" @click="clearRequests" class="clear-btn">🗑️ Vider</button>
          </div>

          <div v-if="requests.length" class="requests-list">
            <div v-for="(req, i) in requests" :key="req.id" class="request-card" :class="{ expanded: expandedId === req.id }" @click="toggleExpand(req.id)">
              <div class="request-summary">
                <span class="req-method" :class="'m-' + req.method">{{ req.method }}</span>
                <span class="req-time">{{ req.time }}</span>
                <span class="req-type">{{ req.contentType }}</span>
                <span class="req-size">{{ req.size }}</span>
                <span class="req-expand">{{ expandedId === req.id ? '▼' : '▶' }}</span>
              </div>

              <div v-if="expandedId === req.id" class="request-details" @click.stop>
                <!-- Headers -->
                <div class="detail-section">
                  <h4>📋 Headers</h4>
                  <div class="headers-grid">
                    <div v-for="(value, key) in req.headers" :key="key" class="header-row">
                      <span class="header-key">{{ key }}:</span>
                      <span class="header-value">{{ value }}</span>
                    </div>
                  </div>
                </div>

                <!-- Body -->
                <div class="detail-section">
                  <h4>📦 Body</h4>
                  <pre class="body-content">{{ req.bodyFormatted }}</pre>
                </div>

                <!-- Actions -->
                <div class="detail-actions">
                  <button @click="copyRequest(req)">📋 Copier</button>
                  <button @click="replayRequest(req)">🔄 Rejouer</button>
                </div>
              </div>
            </div>
          </div>

          <div v-else class="empty-log">
            <span class="empty-icon">📭</span>
            <p>Aucune requête reçue</p>
            <p class="empty-hint">Envoyez une requête test ci-dessus</p>
          </div>
        </div>

        <!-- INTEGRATION EXAMPLES -->
        <div class="examples-section">
          <h3>💻 Exemples d'intégration</h3>
          <div class="examples-tabs">
            <button :class="{ active: exampleTab === 'curl' }" @click="exampleTab = 'curl'">cURL</button>
            <button :class="{ active: exampleTab === 'js' }" @click="exampleTab = 'js'">JavaScript</button>
            <button :class="{ active: exampleTab === 'php' }" @click="exampleTab = 'php'">PHP</button>
            <button :class="{ active: exampleTab === 'python' }" @click="exampleTab = 'python'">Python</button>
          </div>
          <pre class="example-code">{{ examples[exampleTab] }}</pre>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const webhookId = ref(generateId());
const webhookUrl = computed(() => `https://webhook.gl-digitallab.fr/${webhookId.value}`);
const urlCopied = ref(false);
const testMethod = ref('POST');
const testPayloadType = ref('json');
const testPayload = ref('{\n  "event": "user.created",\n  "data": {\n    "id": 123,\n    "email": "user@example.com"\n  }\n}');
const requests = ref([]);
const expandedId = ref(null);
const exampleTab = ref('curl');

function generateId() {
  return Math.random().toString(36).substring(2, 15);
}

function generateNewUrl() {
  webhookId.value = generateId();
}

async function copyUrl() {
  await navigator.clipboard.writeText(webhookUrl.value);
  urlCopied.value = true;
  setTimeout(() => urlCopied.value = false, 2000);
}

function loadPayloadTemplate(type) {
  const templates = {
    user: {
      event: 'user.created',
      timestamp: new Date().toISOString(),
      data: {
        id: 12345,
        email: 'john@example.com',
        name: 'John Doe',
        plan: 'premium'
      }
    },
    order: {
      event: 'order.completed',
      timestamp: new Date().toISOString(),
      data: {
        order_id: 'ORD-2024-001',
        customer_id: 12345,
        total: 149.99,
        currency: 'EUR',
        items: [
          { sku: 'PROD-001', qty: 2, price: 49.99 },
          { sku: 'PROD-002', qty: 1, price: 50.01 }
        ]
      }
    },
    stripe: {
      id: 'evt_' + generateId(),
      object: 'event',
      type: 'payment_intent.succeeded',
      created: Math.floor(Date.now() / 1000),
      data: {
        object: {
          id: 'pi_' + generateId(),
          amount: 2000,
          currency: 'eur',
          status: 'succeeded'
        }
      }
    }
  };
  
  testPayload.value = JSON.stringify(templates[type], null, 2);
}

function sendTestRequest() {
  let body = testPayload.value;
  let bodyFormatted = body;
  
  try {
    const parsed = JSON.parse(body);
    bodyFormatted = JSON.stringify(parsed, null, 2);
  } catch (e) {}
  
  const req = {
    id: Date.now(),
    method: testMethod.value,
    time: new Date().toLocaleTimeString('fr-FR'),
    contentType: testPayloadType.value === 'json' ? 'application/json' : testPayloadType.value === 'form' ? 'application/x-www-form-urlencoded' : 'text/plain',
    size: formatSize(body.length),
    headers: {
      'Content-Type': testPayloadType.value === 'json' ? 'application/json' : 'text/plain',
      'User-Agent': 'WebhookTester/1.0',
      'X-Request-Id': generateId(),
      'X-Webhook-Signature': 'sha256=' + generateId()
    },
    body,
    bodyFormatted
  };
  
  requests.value.unshift(req);
  expandedId.value = req.id;
}

function formatSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  return (bytes / 1024).toFixed(1) + ' KB';
}

function toggleExpand(id) {
  expandedId.value = expandedId.value === id ? null : id;
}

function clearRequests() {
  requests.value = [];
  expandedId.value = null;
}

async function copyRequest(req) {
  const data = {
    method: req.method,
    headers: req.headers,
    body: req.body
  };
  await navigator.clipboard.writeText(JSON.stringify(data, null, 2));
}

function replayRequest(req) {
  testMethod.value = req.method;
  testPayload.value = req.body;
}

const examples = {
  curl: `curl -X POST ${webhookUrl.value} \\
  -H "Content-Type: application/json" \\
  -d '{"event": "test", "data": {}}'`,
  
  js: `fetch('${webhookUrl.value}', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ event: 'test', data: {} })
});`,
  
  php: `<?php
$ch = curl_init('${webhookUrl.value}');
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
  'event' => 'test',
  'data' => []
]));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
  'Content-Type: application/json'
]);
curl_exec($ch);`,
  
  python: `import requests

requests.post(
    '${webhookUrl.value}',
    json={'event': 'test', 'data': {}},
    headers={'Content-Type': 'application/json'}
)`
};
</script>

<style scoped>
.webhook-app { min-height: 100vh; background: var(--bg-primary); }
.app-header { padding: 1rem 0; border-bottom: 1px solid var(--border); }
.back-link { color: var(--text-muted); text-decoration: none; }
.app-main { padding: var(--space-lg) 0; }
.app-intro { text-align: center; margin-bottom: 2rem; }
.app-intro h1 { display: flex; justify-content: center; gap: 0.5rem; font-size: 2rem; }
.app-icon { font-size: 2.5rem; }

.url-section, .test-section, .log-section, .examples-section { margin-bottom: 2rem; }
.url-section h3, .test-section h3, .log-header h3, .examples-section h3 { font-size: 1rem; margin-bottom: 1rem; }

.url-display { display: flex; align-items: center; gap: 0.5rem; padding: 1rem; background: rgba(0,0,0,0.3); border: 1px solid var(--border); border-radius: 0.5rem; }
.url-display code { flex: 1; font-family: monospace; color: var(--primary); word-break: break-all; }
.url-display button { padding: 0.5rem; background: transparent; border: 1px solid var(--border); border-radius: 0.25rem; color: var(--text-muted); cursor: pointer; }
.url-display button:hover { border-color: var(--primary); color: var(--primary); }
.url-display button.copied { background: var(--primary); border-color: var(--primary); color: var(--bg-primary); }
.url-note { font-size: 0.8rem; color: var(--text-dark); margin-top: 0.5rem; }

.test-form { background: rgba(255,255,255,0.02); border: 1px solid var(--border); border-radius: 0.75rem; padding: 1rem; }
.test-row { display: flex; gap: 0.5rem; margin-bottom: 0.75rem; }
.method-select, .payload-select { padding: 0.5rem; background: rgba(0,0,0,0.3); border: 1px solid var(--border); border-radius: 0.35rem; color: var(--text-main); }
.payload-input { width: 100%; min-height: 150px; padding: 0.75rem; background: rgba(0,0,0,0.3); border: 1px solid var(--border); border-radius: 0.5rem; font-family: monospace; font-size: 0.85rem; color: var(--text-main); resize: vertical; margin-bottom: 0.75rem; }
.test-actions { display: flex; gap: 0.5rem; flex-wrap: wrap; }
.test-actions button { padding: 0.5rem 1rem; background: rgba(255,255,255,0.05); border: 1px solid var(--border); border-radius: 0.35rem; color: var(--text-muted); cursor: pointer; font-size: 0.85rem; }
.test-actions button:hover { border-color: var(--primary); color: var(--primary); }
.send-btn { background: var(--primary) !important; border-color: var(--primary) !important; color: var(--bg-primary) !important; }

.log-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
.clear-btn { padding: 0.4rem 0.75rem; background: transparent; border: 1px solid var(--border); border-radius: 0.25rem; color: var(--text-muted); cursor: pointer; font-size: 0.8rem; }
.clear-btn:hover { border-color: #EF4444; color: #EF4444; }

.requests-list { display: flex; flex-direction: column; gap: 0.5rem; }
.request-card { background: rgba(255,255,255,0.02); border: 1px solid var(--border); border-radius: 0.5rem; overflow: hidden; cursor: pointer; }
.request-card.expanded { border-color: var(--primary); }
.request-summary { display: flex; align-items: center; gap: 1rem; padding: 0.75rem 1rem; }
.req-method { padding: 0.2rem 0.5rem; border-radius: 0.25rem; font-size: 0.75rem; font-weight: 600; }
.m-POST { background: rgba(245,158,11,0.2); color: #F59E0B; }
.m-GET { background: rgba(16,185,129,0.2); color: #10B981; }
.m-PUT { background: rgba(59,130,246,0.2); color: #3B82F6; }
.m-DELETE { background: rgba(239,68,68,0.2); color: #EF4444; }
.req-time { font-family: monospace; font-size: 0.8rem; color: var(--text-muted); }
.req-type { font-size: 0.8rem; color: var(--text-muted); }
.req-size { font-size: 0.8rem; color: var(--text-muted); margin-left: auto; }
.req-expand { color: var(--text-muted); }

.request-details { padding: 1rem; border-top: 1px solid var(--border); cursor: default; }
.detail-section { margin-bottom: 1rem; }
.detail-section h4 { font-size: 0.85rem; margin-bottom: 0.5rem; color: var(--text-muted); }
.headers-grid { display: grid; gap: 0.25rem; }
.header-row { display: flex; gap: 0.5rem; font-size: 0.8rem; }
.header-key { color: var(--primary); font-family: monospace; }
.header-value { color: var(--text-secondary); }
.body-content { padding: 0.75rem; background: rgba(0,0,0,0.2); border-radius: 0.35rem; font-family: monospace; font-size: 0.8rem; color: var(--text-secondary); overflow-x: auto; }
.detail-actions { display: flex; gap: 0.5rem; }
.detail-actions button { padding: 0.4rem 0.75rem; background: transparent; border: 1px solid var(--border); border-radius: 0.25rem; color: var(--text-muted); cursor: pointer; font-size: 0.8rem; }
.detail-actions button:hover { border-color: var(--primary); color: var(--primary); }

.empty-log { text-align: center; padding: 3rem; color: var(--text-muted); }
.empty-icon { font-size: 2.5rem; display: block; margin-bottom: 0.5rem; }
.empty-hint { font-size: 0.85rem; color: var(--text-dark); }

.examples-tabs { display: flex; gap: 0.25rem; margin-bottom: 0.5rem; }
.examples-tabs button { padding: 0.5rem 1rem; background: rgba(255,255,255,0.02); border: 1px solid var(--border); border-radius: 0.35rem 0.35rem 0 0; color: var(--text-muted); cursor: pointer; font-size: 0.85rem; }
.examples-tabs button.active { background: var(--primary); border-color: var(--primary); color: var(--bg-primary); }
.example-code { padding: 1rem; background: rgba(0,0,0,0.3); border: 1px solid var(--border); border-radius: 0 0.5rem 0.5rem 0.5rem; font-family: monospace; font-size: 0.8rem; color: var(--text-secondary); overflow-x: auto; white-space: pre-wrap; }
</style>
