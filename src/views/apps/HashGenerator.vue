<template>
  <div class="hash-app">
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
          <h1><span class="app-icon">🔐</span> Hash Generator</h1>
          <p>Générez des empreintes cryptographiques MD5, SHA-1, SHA-256, SHA-512</p>
        </div>

        <!-- INPUT -->
        <div class="input-section">
          <label>Texte à hasher</label>
          <textarea 
            v-model="input" 
            @input="generateHashes"
            placeholder="Entrez le texte à hasher..."
            class="input-textarea"
          ></textarea>
          <div class="input-stats">
            {{ input.length }} caractères • {{ new Blob([input]).size }} bytes
          </div>
        </div>

        <!-- HASHES -->
        <div class="hashes-section">
          <div v-for="hash in hashes" :key="hash.name" class="hash-card">
            <div class="hash-header">
              <span class="hash-name">{{ hash.name }}</span>
              <span class="hash-bits">{{ hash.bits }} bits</span>
            </div>
            <div class="hash-value-wrapper">
              <input 
                type="text" 
                :value="hash.value" 
                readonly 
                class="hash-value"
                :class="{ 'hash-value--empty': !hash.value }"
              >
              <button 
                class="copy-btn" 
                @click="copyHash(hash)" 
                :disabled="!hash.value"
                :class="{ copied: copiedHash === hash.name }"
              >
                {{ copiedHash === hash.name ? '✓' : '📋' }}
              </button>
            </div>
          </div>
        </div>

        <!-- COMPARE -->
        <div class="compare-section">
          <h2>🔍 Comparer un hash</h2>
          <div class="compare-row">
            <input 
              type="text" 
              v-model="compareInput" 
              placeholder="Collez un hash pour le comparer..."
              class="compare-input"
            >
            <span class="compare-result" :class="compareResultClass">
              {{ compareResult }}
            </span>
          </div>
        </div>

        <!-- INFO -->
        <div class="info-section">
          <h2>ℹ️ À propos des fonctions de hachage</h2>
          <div class="info-grid">
            <div class="info-card">
              <span class="info-icon">⚠️</span>
              <h3>MD5</h3>
              <p>128 bits. <strong>Déprécié</strong> pour la sécurité. Utilisez uniquement pour les checksums non-critiques.</p>
            </div>
            <div class="info-card">
              <span class="info-icon">⚠️</span>
              <h3>SHA-1</h3>
              <p>160 bits. <strong>Vulnérable</strong> aux collisions. Ne plus utiliser pour la sécurité.</p>
            </div>
            <div class="info-card info-card--recommended">
              <span class="info-icon">✓</span>
              <h3>SHA-256</h3>
              <p>256 bits. <strong>Recommandé</strong> pour la plupart des usages. Standard actuel.</p>
            </div>
            <div class="info-card info-card--recommended">
              <span class="info-icon">✓</span>
              <h3>SHA-512</h3>
              <p>512 bits. Maximum de sécurité. Idéal pour les données sensibles.</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

const input = ref('');
const compareInput = ref('');
const copiedHash = ref('');

const hashes = ref([
  { name: 'MD5', bits: 128, value: '', algorithm: 'MD5' },
  { name: 'SHA-1', bits: 160, value: '', algorithm: 'SHA-1' },
  { name: 'SHA-256', bits: 256, value: '', algorithm: 'SHA-256' },
  { name: 'SHA-512', bits: 512, value: '', algorithm: 'SHA-512' }
]);

// MD5 implementation (browser doesn't support it natively)
function md5(string) {
  function md5cycle(x, k) {
    var a = x[0], b = x[1], c = x[2], d = x[3];
    a = ff(a, b, c, d, k[0], 7, -680876936);
    d = ff(d, a, b, c, k[1], 12, -389564586);
    c = ff(c, d, a, b, k[2], 17, 606105819);
    b = ff(b, c, d, a, k[3], 22, -1044525330);
    a = ff(a, b, c, d, k[4], 7, -176418897);
    d = ff(d, a, b, c, k[5], 12, 1200080426);
    c = ff(c, d, a, b, k[6], 17, -1473231341);
    b = ff(b, c, d, a, k[7], 22, -45705983);
    a = ff(a, b, c, d, k[8], 7, 1770035416);
    d = ff(d, a, b, c, k[9], 12, -1958414417);
    c = ff(c, d, a, b, k[10], 17, -42063);
    b = ff(b, c, d, a, k[11], 22, -1990404162);
    a = ff(a, b, c, d, k[12], 7, 1804603682);
    d = ff(d, a, b, c, k[13], 12, -40341101);
    c = ff(c, d, a, b, k[14], 17, -1502002290);
    b = ff(b, c, d, a, k[15], 22, 1236535329);
    a = gg(a, b, c, d, k[1], 5, -165796510);
    d = gg(d, a, b, c, k[6], 9, -1069501632);
    c = gg(c, d, a, b, k[11], 14, 643717713);
    b = gg(b, c, d, a, k[0], 20, -373897302);
    a = gg(a, b, c, d, k[5], 5, -701558691);
    d = gg(d, a, b, c, k[10], 9, 38016083);
    c = gg(c, d, a, b, k[15], 14, -660478335);
    b = gg(b, c, d, a, k[4], 20, -405537848);
    a = gg(a, b, c, d, k[9], 5, 568446438);
    d = gg(d, a, b, c, k[14], 9, -1019803690);
    c = gg(c, d, a, b, k[3], 14, -187363961);
    b = gg(b, c, d, a, k[8], 20, 1163531501);
    a = gg(a, b, c, d, k[13], 5, -1444681467);
    d = gg(d, a, b, c, k[2], 9, -51403784);
    c = gg(c, d, a, b, k[7], 14, 1735328473);
    b = gg(b, c, d, a, k[12], 20, -1926607734);
    a = hh(a, b, c, d, k[5], 4, -378558);
    d = hh(d, a, b, c, k[8], 11, -2022574463);
    c = hh(c, d, a, b, k[11], 16, 1839030562);
    b = hh(b, c, d, a, k[14], 23, -35309556);
    a = hh(a, b, c, d, k[1], 4, -1530992060);
    d = hh(d, a, b, c, k[4], 11, 1272893353);
    c = hh(c, d, a, b, k[7], 16, -155497632);
    b = hh(b, c, d, a, k[10], 23, -1094730640);
    a = hh(a, b, c, d, k[13], 4, 681279174);
    d = hh(d, a, b, c, k[0], 11, -358537222);
    c = hh(c, d, a, b, k[3], 16, -722521979);
    b = hh(b, c, d, a, k[6], 23, 76029189);
    a = hh(a, b, c, d, k[9], 4, -640364487);
    d = hh(d, a, b, c, k[12], 11, -421815835);
    c = hh(c, d, a, b, k[15], 16, 530742520);
    b = hh(b, c, d, a, k[2], 23, -995338651);
    a = ii(a, b, c, d, k[0], 6, -198630844);
    d = ii(d, a, b, c, k[7], 10, 1126891415);
    c = ii(c, d, a, b, k[14], 15, -1416354905);
    b = ii(b, c, d, a, k[5], 21, -57434055);
    a = ii(a, b, c, d, k[12], 6, 1700485571);
    d = ii(d, a, b, c, k[3], 10, -1894986606);
    c = ii(c, d, a, b, k[10], 15, -1051523);
    b = ii(b, c, d, a, k[1], 21, -2054922799);
    a = ii(a, b, c, d, k[8], 6, 1873313359);
    d = ii(d, a, b, c, k[15], 10, -30611744);
    c = ii(c, d, a, b, k[6], 15, -1560198380);
    b = ii(b, c, d, a, k[13], 21, 1309151649);
    a = ii(a, b, c, d, k[4], 6, -145523070);
    d = ii(d, a, b, c, k[11], 10, -1120210379);
    c = ii(c, d, a, b, k[2], 15, 718787259);
    b = ii(b, c, d, a, k[9], 21, -343485551);
    x[0] = add32(a, x[0]);
    x[1] = add32(b, x[1]);
    x[2] = add32(c, x[2]);
    x[3] = add32(d, x[3]);
  }
  function cmn(q, a, b, x, s, t) {
    a = add32(add32(a, q), add32(x, t));
    return add32((a << s) | (a >>> (32 - s)), b);
  }
  function ff(a, b, c, d, x, s, t) { return cmn((b & c) | ((~b) & d), a, b, x, s, t); }
  function gg(a, b, c, d, x, s, t) { return cmn((b & d) | (c & (~d)), a, b, x, s, t); }
  function hh(a, b, c, d, x, s, t) { return cmn(b ^ c ^ d, a, b, x, s, t); }
  function ii(a, b, c, d, x, s, t) { return cmn(c ^ (b | (~d)), a, b, x, s, t); }
  function md51(s) {
    var n = s.length, state = [1732584193, -271733879, -1732584194, 271733878], i;
    for (i = 64; i <= s.length; i += 64) {
      md5cycle(state, md5blk(s.substring(i - 64, i)));
    }
    s = s.substring(i - 64);
    var tail = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    for (i = 0; i < s.length; i++)
      tail[i >> 2] |= s.charCodeAt(i) << ((i % 4) << 3);
    tail[i >> 2] |= 0x80 << ((i % 4) << 3);
    if (i > 55) {
      md5cycle(state, tail);
      for (i = 0; i < 16; i++) tail[i] = 0;
    }
    tail[14] = n * 8;
    md5cycle(state, tail);
    return state;
  }
  function md5blk(s) {
    var md5blks = [], i;
    for (i = 0; i < 64; i += 4) {
      md5blks[i >> 2] = s.charCodeAt(i) + (s.charCodeAt(i + 1) << 8) + (s.charCodeAt(i + 2) << 16) + (s.charCodeAt(i + 3) << 24);
    }
    return md5blks;
  }
  var hex_chr = '0123456789abcdef'.split('');
  function rhex(n) {
    var s = '', j = 0;
    for (; j < 4; j++)
      s += hex_chr[(n >> (j * 8 + 4)) & 0x0F] + hex_chr[(n >> (j * 8)) & 0x0F];
    return s;
  }
  function hex(x) {
    for (var i = 0; i < x.length; i++) x[i] = rhex(x[i]);
    return x.join('');
  }
  function add32(a, b) { return (a + b) & 0xFFFFFFFF; }
  return hex(md51(string));
}

async function sha(algorithm, message) {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest(algorithm, msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

async function generateHashes() {
  if (!input.value) {
    hashes.value.forEach(h => h.value = '');
    return;
  }

  // MD5 (synchronous, custom implementation)
  hashes.value[0].value = md5(input.value);
  
  // SHA algorithms (async, Web Crypto API)
  hashes.value[1].value = await sha('SHA-1', input.value);
  hashes.value[2].value = await sha('SHA-256', input.value);
  hashes.value[3].value = await sha('SHA-512', input.value);
}

const compareResult = computed(() => {
  if (!compareInput.value) return '';
  const normalized = compareInput.value.toLowerCase().trim();
  
  for (const hash of hashes.value) {
    if (hash.value && hash.value.toLowerCase() === normalized) {
      return `✓ Correspond à ${hash.name}`;
    }
  }
  return '✗ Aucune correspondance';
});

const compareResultClass = computed(() => {
  if (!compareInput.value) return '';
  return compareResult.value.startsWith('✓') ? 'compare-result--match' : 'compare-result--nomatch';
});

async function copyHash(hash) {
  try {
    await navigator.clipboard.writeText(hash.value);
    copiedHash.value = hash.name;
    setTimeout(() => copiedHash.value = '', 2000);
  } catch (err) {
    console.error('Copy failed:', err);
  }
}

onMounted(() => {
  generateHashes();
});
</script>

<style scoped>
.hash-app {
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

/* Input Section */
.input-section {
  margin-bottom: var(--space-lg);
}

.input-section label {
  display: block;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.85rem;
  color: var(--text-muted);
  margin-bottom: 0.5rem;
}

.input-textarea {
  width: 100%;
  min-height: 120px;
  padding: 1rem;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid var(--border);
  border-radius: 0.75rem;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.9rem;
  color: var(--text-main);
  resize: vertical;
}

.input-textarea:focus {
  outline: none;
  border-color: var(--primary);
}

.input-stats {
  margin-top: 0.5rem;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.75rem;
  color: var(--text-dark);
}

/* Hashes Section */
.hashes-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: var(--space-lg);
}

.hash-card {
  padding: 1rem 1.5rem;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid var(--border);
  border-radius: 0.75rem;
}

.hash-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.hash-name {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--primary);
}

.hash-bits {
  font-size: 0.75rem;
  color: var(--text-dark);
}

.hash-value-wrapper {
  display: flex;
  gap: 0.5rem;
}

.hash-value {
  flex: 1;
  padding: 0.75rem;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid var(--border);
  border-radius: 0.5rem;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.8rem;
  color: var(--text-main);
  word-break: break-all;
}

.hash-value--empty {
  color: var(--text-dark);
}

.copy-btn {
  padding: 0.75rem 1rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--border);
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.copy-btn:hover:not(:disabled) {
  border-color: var(--primary);
}

.copy-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.copy-btn.copied {
  background: var(--primary);
  border-color: var(--primary);
  color: var(--bg-primary);
}

/* Compare Section */
.compare-section {
  margin-bottom: var(--space-lg);
}

.compare-section h2 {
  font-size: 1.1rem;
  margin-bottom: 1rem;
}

.compare-row {
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
}

.compare-input {
  flex: 1;
  min-width: 300px;
  padding: 0.75rem 1rem;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid var(--border);
  border-radius: 0.5rem;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.85rem;
  color: var(--text-main);
}

.compare-input:focus {
  outline: none;
  border-color: var(--primary);
}

.compare-result {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.9rem;
}

.compare-result--match { color: #10B981; }
.compare-result--nomatch { color: #EF4444; }

/* Info Section */
.info-section h2 {
  font-size: 1.1rem;
  margin-bottom: 1rem;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1rem;
}

.info-card {
  padding: 1.25rem;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid var(--border);
  border-radius: 0.75rem;
}

.info-card--recommended {
  border-color: rgba(16, 185, 129, 0.3);
  background: rgba(16, 185, 129, 0.05);
}

.info-icon {
  font-size: 1.25rem;
  display: block;
  margin-bottom: 0.5rem;
}

.info-card h3 {
  font-size: 1rem;
  margin-bottom: 0.5rem;
}

.info-card p {
  font-size: 0.85rem;
  color: var(--text-muted);
  line-height: 1.5;
}

@media (max-width: 768px) {
  .compare-row {
    flex-direction: column;
    align-items: stretch;
  }
  
  .compare-input {
    min-width: 100%;
  }
}
</style>
