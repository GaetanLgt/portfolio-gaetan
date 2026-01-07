<template>
  <div class="api-app">
    <header class="app-header">
      <div class="container">
        <router-link to="/apps" class="back-link">← Retour aux Apps</router-link>
      </div>
    </header>
    <main class="app-main">
      <div class="container">
        <div class="app-intro">
          <h1><span class="app-icon">🔌</span> API Tester</h1>
          <p>Testez vos endpoints REST avec un client HTTP simple</p>
        </div>

        <div class="request-bar">
          <select v-model="method" class="method-select" :class="'m-' + method">
            <option>GET</option><option>POST</option><option>PUT</option><option>DELETE</option>
          </select>
          <input v-model="url" placeholder="https://api.example.com/endpoint" class="url-input">
          <button @click="send" :disabled="loading" class="send-btn">{{ loading ? '⏳' : '🚀' }} Send</button>
        </div>

        <div class="tabs">
          <button :class="{active: tab==='headers'}" @click="tab='headers'">Headers</button>
          <button :class="{active: tab==='body'}" @click="tab='body'" :disabled="method==='GET'">Body</button>
        </div>

        <div class="tab-content">
          <div v-if="tab==='headers'" class="kv-list">
            <div v-for="(h,i) in headers" :key="i" class="kv-row">
              <input v-model="h.key" placeholder="Header" class="kv-key">
              <input v-model="h.value" placeholder="Value" class="kv-val">
              <button @click="headers.splice(i,1)" class="kv-del">✕</button>
            </div>
            <button @click="headers.push({key:'',value:''})" class="add-btn">+ Header</button>
          </div>
          <div v-if="tab==='body'">
            <textarea v-model="body" placeholder='{"key": "value"}' class="body-area"></textarea>
          </div>
        </div>

        <div class="response-section" v-if="response || error">
          <div class="res-header">
            <span v-if="response" class="status" :class="response.ok?'ok':'err'">{{ response.status }}</span>
            <span v-if="response" class="meta">{{ response.time }}ms • {{ response.size }}</span>
          </div>
          <div v-if="error" class="error">❌ {{ error }}</div>
          <pre v-else class="res-body">{{ response.body }}</pre>
        </div>

        <div class="presets">
          <span>Presets:</span>
          <button @click="url='https://jsonplaceholder.typicode.com/posts/1'">JSONPlaceholder</button>
          <button @click="url='https://api.github.com/users/octocat'">GitHub API</button>
          <button @click="url='https://httpbin.org/get'">HTTPBin</button>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue';
const method = ref('GET');
const url = ref('https://jsonplaceholder.typicode.com/posts/1');
const tab = ref('headers');
const headers = ref([{key:'Content-Type',value:'application/json'}]);
const body = ref('');
const loading = ref(false);
const response = ref(null);
const error = ref('');

async function send() {
  loading.value = true; error.value = ''; response.value = null;
  const start = performance.now();
  try {
    const opts = { method: method.value, headers: {} };
    headers.value.filter(h=>h.key).forEach(h => opts.headers[h.key] = h.value);
    if (method.value !== 'GET' && body.value) opts.body = body.value;
    const res = await fetch(url.value, opts);
    const text = await res.text();
    let parsed = text;
    try { parsed = JSON.stringify(JSON.parse(text), null, 2); } catch(e) {}
    response.value = {
      status: res.status + ' ' + res.statusText,
      ok: res.ok,
      time: Math.round(performance.now() - start),
      size: (text.length/1024).toFixed(1) + 'KB',
      body: parsed
    };
  } catch(e) { error.value = e.message; }
  loading.value = false;
}
</script>

<style scoped>
.api-app { min-height: 100vh; background: var(--bg-primary); }
.app-header { padding: 1rem 0; border-bottom: 1px solid var(--border); }
.back-link { color: var(--text-muted); text-decoration: none; }
.app-main { padding: var(--space-lg) 0; }
.app-intro { text-align: center; margin-bottom: 2rem; }
.app-intro h1 { display: flex; justify-content: center; gap: 0.5rem; font-size: 2rem; }
.app-icon { font-size: 2.5rem; }
.app-intro p { color: var(--text-muted); }

.request-bar { display: flex; gap: 0.5rem; margin-bottom: 1rem; }
.method-select { width: 100px; padding: 0.75rem; background: rgba(0,0,0,0.3); border: 1px solid var(--border); border-radius: 0.5rem; font-weight: 600; }
.m-GET { color: #10B981; } .m-POST { color: #F59E0B; } .m-PUT { color: #3B82F6; } .m-DELETE { color: #EF4444; }
.url-input { flex: 1; padding: 0.75rem; background: rgba(0,0,0,0.3); border: 1px solid var(--border); border-radius: 0.5rem; font-family: monospace; color: var(--text-main); }
.send-btn { padding: 0.75rem 1.5rem; background: var(--primary); border: none; border-radius: 0.5rem; font-weight: 600; color: var(--bg-primary); cursor: pointer; }

.tabs { display: flex; gap: 0.25rem; margin-bottom: 0.5rem; }
.tabs button { padding: 0.5rem 1rem; background: rgba(255,255,255,0.02); border: 1px solid var(--border); border-radius: 0.35rem; color: var(--text-muted); cursor: pointer; }
.tabs button.active { background: var(--primary); border-color: var(--primary); color: var(--bg-primary); }
.tabs button:disabled { opacity: 0.3; }

.tab-content { padding: 1rem; background: rgba(255,255,255,0.02); border: 1px solid var(--border); border-radius: 0.5rem; margin-bottom: 1rem; min-height: 100px; }
.kv-list { display: flex; flex-direction: column; gap: 0.5rem; }
.kv-row { display: flex; gap: 0.5rem; }
.kv-key, .kv-val { flex: 1; padding: 0.5rem; background: rgba(0,0,0,0.3); border: 1px solid var(--border); border-radius: 0.25rem; color: var(--text-main); }
.kv-del { padding: 0.5rem; background: transparent; border: 1px solid var(--border); border-radius: 0.25rem; color: var(--text-muted); cursor: pointer; }
.add-btn { align-self: flex-start; padding: 0.5rem 1rem; background: transparent; border: 1px dashed var(--border); border-radius: 0.25rem; color: var(--text-muted); cursor: pointer; }
.body-area { width: 100%; min-height: 150px; padding: 0.75rem; background: rgba(0,0,0,0.3); border: 1px solid var(--border); border-radius: 0.5rem; font-family: monospace; color: var(--text-main); resize: vertical; }

.response-section { padding: 1rem; background: rgba(255,255,255,0.02); border: 1px solid var(--border); border-radius: 0.5rem; margin-bottom: 1rem; }
.res-header { display: flex; gap: 1rem; align-items: center; margin-bottom: 0.75rem; }
.status { padding: 0.25rem 0.75rem; border-radius: 0.25rem; font-weight: 600; }
.status.ok { background: rgba(16,185,129,0.2); color: #10B981; }
.status.err { background: rgba(239,68,68,0.2); color: #EF4444; }
.meta { font-size: 0.8rem; color: var(--text-muted); }
.error { color: #EF4444; }
.res-body { font-family: monospace; font-size: 0.85rem; color: var(--text-secondary); white-space: pre-wrap; max-height: 400px; overflow: auto; }

.presets { display: flex; gap: 0.5rem; align-items: center; flex-wrap: wrap; }
.presets span { color: var(--text-muted); font-size: 0.85rem; }
.presets button { padding: 0.4rem 0.75rem; background: rgba(255,255,255,0.02); border: 1px solid var(--border); border-radius: 0.25rem; font-size: 0.8rem; color: var(--text-muted); cursor: pointer; }
.presets button:hover { border-color: var(--primary); color: var(--primary); }
</style>
