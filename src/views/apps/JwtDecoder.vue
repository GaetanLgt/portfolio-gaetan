<template>
  <div class="jwt-app">
    <header class="app-header">
      <div class="container">
        <router-link to="/apps" class="back-link">← Retour aux Apps</router-link>
      </div>
    </header>
    <main class="app-main">
      <div class="container">
        <div class="app-intro">
          <h1><span class="app-icon">🔐</span> JWT Decoder</h1>
          <p>Décodez et analysez vos tokens JWT (JSON Web Tokens)</p>
        </div>

        <div class="decoder-grid">
          <!-- INPUT -->
          <div class="input-panel">
            <label>🔑 Token JWT</label>
            <textarea v-model="token" placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." class="token-input" @input="decode"></textarea>
            <div class="input-actions">
              <button @click="loadSample">📄 Exemple</button>
              <button @click="token = ''; decoded = null">🗑️ Effacer</button>
            </div>
          </div>

          <!-- DECODED -->
          <div class="decoded-panel" v-if="decoded">
            <!-- HEADER -->
            <div class="section header-section">
              <div class="section-header">
                <span class="section-icon" style="background: #EF4444;">H</span>
                <span class="section-title">Header</span>
                <span class="section-algo">{{ decoded.header.alg }}</span>
              </div>
              <pre class="section-content">{{ JSON.stringify(decoded.header, null, 2) }}</pre>
            </div>

            <!-- PAYLOAD -->
            <div class="section payload-section">
              <div class="section-header">
                <span class="section-icon" style="background: #8B5CF6;">P</span>
                <span class="section-title">Payload</span>
                <span class="section-badge" v-if="isExpired">⚠️ Expiré</span>
                <span class="section-badge valid" v-else-if="decoded.payload.exp">✓ Valide</span>
              </div>
              <pre class="section-content">{{ JSON.stringify(decoded.payload, null, 2) }}</pre>
              
              <!-- Claims Analysis -->
              <div class="claims-grid" v-if="Object.keys(claims).length">
                <div v-for="(value, key) in claims" :key="key" class="claim-card">
                  <span class="claim-key">{{ key }}</span>
                  <span class="claim-value">{{ value }}</span>
                </div>
              </div>
            </div>

            <!-- SIGNATURE -->
            <div class="section signature-section">
              <div class="section-header">
                <span class="section-icon" style="background: #10B981;">S</span>
                <span class="section-title">Signature</span>
              </div>
              <div class="signature-content">
                <code>{{ decoded.signature }}</code>
                <p class="signature-note">⚠️ La signature ne peut pas être vérifiée côté client (secret requis)</p>
              </div>
            </div>
          </div>

          <!-- ERROR -->
          <div class="error-panel" v-else-if="error">
            <span class="error-icon">❌</span>
            <span>{{ error }}</span>
          </div>

          <!-- EMPTY -->
          <div class="empty-panel" v-else>
            <span class="empty-icon">🔐</span>
            <p>Collez un token JWT pour le décoder</p>
          </div>
        </div>

        <!-- INFO -->
        <div class="info-section">
          <h3>📚 Structure d'un JWT</h3>
          <div class="jwt-structure">
            <span class="part header">Header</span>
            <span class="dot">.</span>
            <span class="part payload">Payload</span>
            <span class="dot">.</span>
            <span class="part signature">Signature</span>
          </div>
          <div class="claims-info">
            <h4>Claims standards:</h4>
            <ul>
              <li><code>iss</code> - Issuer (émetteur)</li>
              <li><code>sub</code> - Subject (sujet)</li>
              <li><code>aud</code> - Audience</li>
              <li><code>exp</code> - Expiration Time</li>
              <li><code>nbf</code> - Not Before</li>
              <li><code>iat</code> - Issued At</li>
              <li><code>jti</code> - JWT ID</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const token = ref('');
const decoded = ref(null);
const error = ref('');

const sampleToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiZW1haWwiOiJqb2huQGV4YW1wbGUuY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzA0MDY3MjAwLCJleHAiOjE3MzU2ODk2MDB9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

function loadSample() {
  token.value = sampleToken;
  decode();
}

function decode() {
  error.value = '';
  decoded.value = null;
  
  if (!token.value.trim()) return;
  
  try {
    const parts = token.value.trim().split('.');
    if (parts.length !== 3) {
      throw new Error('Format JWT invalide (3 parties attendues)');
    }
    
    const header = JSON.parse(atob(parts[0].replace(/-/g, '+').replace(/_/g, '/')));
    const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
    
    decoded.value = {
      header,
      payload,
      signature: parts[2]
    };
  } catch (e) {
    error.value = e.message || 'Impossible de décoder le token';
  }
}

const isExpired = computed(() => {
  if (!decoded.value?.payload?.exp) return false;
  return decoded.value.payload.exp * 1000 < Date.now();
});

const claims = computed(() => {
  if (!decoded.value?.payload) return {};
  
  const result = {};
  const p = decoded.value.payload;
  
  if (p.iss) result['Émetteur (iss)'] = p.iss;
  if (p.sub) result['Sujet (sub)'] = p.sub;
  if (p.aud) result['Audience (aud)'] = p.aud;
  if (p.iat) result['Créé le (iat)'] = new Date(p.iat * 1000).toLocaleString('fr-FR');
  if (p.exp) result['Expire le (exp)'] = new Date(p.exp * 1000).toLocaleString('fr-FR');
  if (p.nbf) result['Valide après (nbf)'] = new Date(p.nbf * 1000).toLocaleString('fr-FR');
  
  return result;
});
</script>

<style scoped>
.jwt-app { min-height: 100vh; background: var(--bg-primary); }
.app-header { padding: 1rem 0; border-bottom: 1px solid var(--border); }
.back-link { color: var(--text-muted); text-decoration: none; }
.app-main { padding: var(--space-lg) 0; }
.app-intro { text-align: center; margin-bottom: 2rem; }
.app-intro h1 { display: flex; justify-content: center; gap: 0.5rem; font-size: 2rem; }
.app-icon { font-size: 2.5rem; }

.decoder-grid { margin-bottom: 2rem; }
.input-panel { margin-bottom: 1.5rem; }
.input-panel label { display: block; font-weight: 600; margin-bottom: 0.5rem; }
.token-input { width: 100%; min-height: 120px; padding: 1rem; background: rgba(0,0,0,0.3); border: 1px solid var(--border); border-radius: 0.5rem; font-family: monospace; font-size: 0.85rem; color: var(--text-main); resize: vertical; word-break: break-all; }
.input-actions { display: flex; gap: 0.5rem; margin-top: 0.75rem; }
.input-actions button { padding: 0.5rem 1rem; background: rgba(255,255,255,0.05); border: 1px solid var(--border); border-radius: 0.35rem; color: var(--text-muted); cursor: pointer; }
.input-actions button:hover { border-color: var(--primary); color: var(--primary); }

.section { background: rgba(255,255,255,0.02); border: 1px solid var(--border); border-radius: 0.75rem; padding: 1rem; margin-bottom: 1rem; }
.section-header { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.75rem; }
.section-icon { width: 28px; height: 28px; border-radius: 0.35rem; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.85rem; color: white; }
.section-title { font-weight: 600; }
.section-algo { font-family: monospace; font-size: 0.8rem; color: var(--primary); background: rgba(0,255,136,0.1); padding: 0.2rem 0.5rem; border-radius: 0.25rem; }
.section-badge { font-size: 0.75rem; padding: 0.2rem 0.5rem; border-radius: 0.25rem; background: rgba(239,68,68,0.2); color: #EF4444; }
.section-badge.valid { background: rgba(16,185,129,0.2); color: #10B981; }
.section-content { font-family: monospace; font-size: 0.85rem; color: var(--text-secondary); background: rgba(0,0,0,0.2); padding: 1rem; border-radius: 0.5rem; overflow-x: auto; }

.claims-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 0.75rem; margin-top: 1rem; padding-top: 1rem; border-top: 1px solid var(--border); }
.claim-card { padding: 0.75rem; background: rgba(0,0,0,0.2); border-radius: 0.5rem; }
.claim-key { display: block; font-size: 0.75rem; color: var(--text-muted); margin-bottom: 0.25rem; }
.claim-value { font-family: monospace; font-size: 0.85rem; color: var(--primary); }

.signature-content code { display: block; font-size: 0.75rem; color: var(--text-muted); word-break: break-all; margin-bottom: 0.5rem; }
.signature-note { font-size: 0.8rem; color: var(--text-dark); }

.error-panel, .empty-panel { text-align: center; padding: 3rem; color: var(--text-muted); }
.error-panel { color: #EF4444; }
.error-icon, .empty-icon { font-size: 2.5rem; display: block; margin-bottom: 1rem; }

.info-section { background: rgba(255,255,255,0.02); border: 1px solid var(--border); border-radius: 0.75rem; padding: 1.5rem; }
.info-section h3 { font-size: 1rem; margin-bottom: 1rem; }
.jwt-structure { display: flex; align-items: center; justify-content: center; gap: 0.25rem; margin-bottom: 1.5rem; font-family: monospace; font-size: 1.1rem; }
.part { padding: 0.5rem 1rem; border-radius: 0.35rem; }
.part.header { background: rgba(239,68,68,0.2); color: #EF4444; }
.part.payload { background: rgba(139,92,246,0.2); color: #8B5CF6; }
.part.signature { background: rgba(16,185,129,0.2); color: #10B981; }
.dot { color: var(--text-muted); font-weight: bold; }
.claims-info h4 { font-size: 0.9rem; margin-bottom: 0.5rem; }
.claims-info ul { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 0.5rem; list-style: none; padding: 0; }
.claims-info li { font-size: 0.85rem; color: var(--text-muted); }
.claims-info code { color: var(--primary); }
</style>
