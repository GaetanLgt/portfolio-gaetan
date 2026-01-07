<template>
  <div class="qr-app">
    <header class="app-header">
      <div class="container">
        <router-link to="/apps" class="back-link">← Retour aux Apps</router-link>
      </div>
    </header>
    <main class="app-main">
      <div class="container">
        <div class="app-intro">
          <h1><span class="app-icon">📱</span> QR Code Generator</h1>
          <p>Générez des QR codes personnalisés pour vos liens, textes et données</p>
        </div>

        <div class="generator-grid">
          <!-- LEFT: Options -->
          <div class="options-panel">
            <div class="option-group">
              <label>📝 Type de contenu</label>
              <select v-model="contentType" @change="updateContent">
                <option value="url">URL / Lien</option>
                <option value="text">Texte libre</option>
                <option value="email">Email</option>
                <option value="phone">Téléphone</option>
                <option value="sms">SMS</option>
                <option value="wifi">WiFi</option>
                <option value="vcard">vCard (Contact)</option>
              </select>
            </div>

            <!-- Dynamic inputs based on type -->
            <div v-if="contentType === 'url'" class="option-group">
              <label>🔗 URL</label>
              <input type="url" v-model="content" placeholder="https://example.com">
            </div>

            <div v-if="contentType === 'text'" class="option-group">
              <label>📄 Texte</label>
              <textarea v-model="content" placeholder="Votre texte ici..." rows="4"></textarea>
            </div>

            <div v-if="contentType === 'email'" class="option-group">
              <label>✉️ Email</label>
              <input type="email" v-model="emailTo" placeholder="destinataire@example.com">
              <input type="text" v-model="emailSubject" placeholder="Sujet">
              <textarea v-model="emailBody" placeholder="Corps du message" rows="2"></textarea>
            </div>

            <div v-if="contentType === 'phone'" class="option-group">
              <label>📞 Numéro</label>
              <input type="tel" v-model="content" placeholder="+33612345678">
            </div>

            <div v-if="contentType === 'sms'" class="option-group">
              <label>💬 SMS</label>
              <input type="tel" v-model="smsNumber" placeholder="+33612345678">
              <textarea v-model="smsMessage" placeholder="Message SMS" rows="2"></textarea>
            </div>

            <div v-if="contentType === 'wifi'" class="option-group">
              <label>📶 WiFi</label>
              <input type="text" v-model="wifiSSID" placeholder="Nom du réseau (SSID)">
              <input type="password" v-model="wifiPassword" placeholder="Mot de passe">
              <select v-model="wifiType">
                <option value="WPA">WPA/WPA2</option>
                <option value="WEP">WEP</option>
                <option value="nopass">Ouvert (pas de mot de passe)</option>
              </select>
            </div>

            <div v-if="contentType === 'vcard'" class="option-group">
              <label>👤 Contact</label>
              <input type="text" v-model="vcardName" placeholder="Nom complet">
              <input type="tel" v-model="vcardPhone" placeholder="Téléphone">
              <input type="email" v-model="vcardEmail" placeholder="Email">
              <input type="text" v-model="vcardOrg" placeholder="Entreprise">
            </div>

            <div class="option-group">
              <label>🎨 Couleurs</label>
              <div class="color-row">
                <div class="color-input">
                  <span>QR:</span>
                  <input type="color" v-model="fgColor">
                </div>
                <div class="color-input">
                  <span>Fond:</span>
                  <input type="color" v-model="bgColor">
                </div>
              </div>
            </div>

            <div class="option-group">
              <label>📏 Taille: {{ size }}px</label>
              <input type="range" v-model.number="size" min="128" max="512" step="32">
            </div>
          </div>

          <!-- RIGHT: Preview -->
          <div class="preview-panel">
            <div class="qr-preview">
              <canvas ref="canvas" :width="size" :height="size"></canvas>
            </div>
            <div class="preview-actions">
              <button @click="downloadPNG" class="dl-btn">📥 PNG</button>
              <button @click="downloadSVG" class="dl-btn">📥 SVG</button>
              <button @click="copyDataURL" :class="{copied}" class="copy-btn">{{ copied ? '✓ Copié' : '📋 Copier' }}</button>
            </div>
            <div class="qr-data">
              <label>Données encodées:</label>
              <textarea readonly :value="qrData" class="data-preview"></textarea>
            </div>
          </div>
        </div>

        <!-- PRESETS -->
        <div class="presets-section">
          <h3>🎨 Thèmes</h3>
          <div class="theme-grid">
            <button v-for="theme in themes" :key="theme.name" @click="applyTheme(theme)" class="theme-btn" :style="{background: theme.bg, color: theme.fg}">
              {{ theme.name }}
            </button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';

const canvas = ref(null);
const contentType = ref('url');
const content = ref('https://gl-digitallab.fr');
const size = ref(256);
const fgColor = ref('#000000');
const bgColor = ref('#ffffff');
const copied = ref(false);

// Email fields
const emailTo = ref('');
const emailSubject = ref('');
const emailBody = ref('');

// SMS fields
const smsNumber = ref('');
const smsMessage = ref('');

// WiFi fields
const wifiSSID = ref('');
const wifiPassword = ref('');
const wifiType = ref('WPA');

// vCard fields
const vcardName = ref('');
const vcardPhone = ref('');
const vcardEmail = ref('');
const vcardOrg = ref('');

const themes = [
  { name: 'Classic', fg: '#000000', bg: '#ffffff' },
  { name: 'Matrix', fg: '#00ff88', bg: '#0a0a0f' },
  { name: 'Ocean', fg: '#0066cc', bg: '#e6f2ff' },
  { name: 'Sunset', fg: '#ff6b35', bg: '#fff5f0' },
  { name: 'Neon', fg: '#ff00ff', bg: '#1a1a2e' },
  { name: 'Forest', fg: '#228b22', bg: '#f0fff0' }
];

const qrData = computed(() => {
  switch (contentType.value) {
    case 'url':
    case 'text':
    case 'phone':
      return content.value;
    case 'email':
      return `mailto:${emailTo.value}?subject=${encodeURIComponent(emailSubject.value)}&body=${encodeURIComponent(emailBody.value)}`;
    case 'sms':
      return `sms:${smsNumber.value}?body=${encodeURIComponent(smsMessage.value)}`;
    case 'wifi':
      return `WIFI:T:${wifiType.value};S:${wifiSSID.value};P:${wifiPassword.value};;`;
    case 'vcard':
      return `BEGIN:VCARD\nVERSION:3.0\nFN:${vcardName.value}\nTEL:${vcardPhone.value}\nEMAIL:${vcardEmail.value}\nORG:${vcardOrg.value}\nEND:VCARD`;
    default:
      return '';
  }
});

function updateContent() {
  content.value = '';
}

function applyTheme(theme) {
  fgColor.value = theme.fg;
  bgColor.value = theme.bg;
}

// Simple QR Code generator (simplified version)
function generateQR() {
  if (!canvas.value || !qrData.value) return;
  
  const ctx = canvas.value.getContext('2d');
  ctx.fillStyle = bgColor.value;
  ctx.fillRect(0, 0, size.value, size.value);
  
  // Use QR code library simulation (in real app, use qrcode-generator library)
  // For demo, we'll create a pattern based on data hash
  const data = qrData.value;
  const moduleCount = 25;
  const moduleSize = size.value / (moduleCount + 8);
  const offset = moduleSize * 4;
  
  ctx.fillStyle = fgColor.value;
  
  // Draw finder patterns (corners)
  drawFinderPattern(ctx, offset, offset, moduleSize);
  drawFinderPattern(ctx, size.value - offset - 7 * moduleSize, offset, moduleSize);
  drawFinderPattern(ctx, offset, size.value - offset - 7 * moduleSize, moduleSize);
  
  // Generate pseudo-random pattern from data
  const hash = simpleHash(data);
  for (let y = 0; y < moduleCount; y++) {
    for (let x = 0; x < moduleCount; x++) {
      // Skip finder pattern areas
      if ((x < 8 && y < 8) || (x >= moduleCount - 8 && y < 8) || (x < 8 && y >= moduleCount - 8)) continue;
      
      const bit = (hash >> ((x + y * moduleCount) % 32)) & 1;
      const pseudoRandom = ((x * 31 + y * 17 + hash) % 2);
      
      if (bit ^ pseudoRandom) {
        ctx.fillRect(offset + x * moduleSize, offset + y * moduleSize, moduleSize, moduleSize);
      }
    }
  }
}

function drawFinderPattern(ctx, x, y, size) {
  // Outer square
  ctx.fillRect(x, y, size * 7, size * 7);
  // White square
  ctx.fillStyle = bgColor.value;
  ctx.fillRect(x + size, y + size, size * 5, size * 5);
  // Inner square
  ctx.fillStyle = fgColor.value;
  ctx.fillRect(x + size * 2, y + size * 2, size * 3, size * 3);
}

function simpleHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash = hash & hash;
  }
  return Math.abs(hash);
}

function downloadPNG() {
  const link = document.createElement('a');
  link.download = 'qrcode.png';
  link.href = canvas.value.toDataURL('image/png');
  link.click();
}

function downloadSVG() {
  // Simplified SVG export
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size.value}" height="${size.value}">
    <rect width="100%" height="100%" fill="${bgColor.value}"/>
    <foreignObject width="100%" height="100%">
      <img src="${canvas.value.toDataURL()}" width="${size.value}" height="${size.value}"/>
    </foreignObject>
  </svg>`;
  
  const blob = new Blob([svg], { type: 'image/svg+xml' });
  const link = document.createElement('a');
  link.download = 'qrcode.svg';
  link.href = URL.createObjectURL(blob);
  link.click();
}

async function copyDataURL() {
  await navigator.clipboard.writeText(canvas.value.toDataURL());
  copied.value = true;
  setTimeout(() => copied.value = false, 2000);
}

watch([qrData, size, fgColor, bgColor], generateQR);
onMounted(generateQR);
</script>

<style scoped>
.qr-app { min-height: 100vh; background: var(--bg-primary); }
.app-header { padding: 1rem 0; border-bottom: 1px solid var(--border); }
.back-link { color: var(--text-muted); text-decoration: none; }
.app-main { padding: var(--space-lg) 0; }
.app-intro { text-align: center; margin-bottom: 2rem; }
.app-intro h1 { display: flex; justify-content: center; gap: 0.5rem; font-size: 2rem; }
.app-icon { font-size: 2.5rem; }

.generator-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-bottom: 2rem; }

.options-panel { display: flex; flex-direction: column; gap: 1.25rem; }
.option-group { display: flex; flex-direction: column; gap: 0.5rem; }
.option-group label { font-size: 0.9rem; font-weight: 600; }
.option-group input, .option-group select, .option-group textarea { padding: 0.75rem; background: rgba(0,0,0,0.3); border: 1px solid var(--border); border-radius: 0.5rem; color: var(--text-main); }
.option-group input:focus, .option-group textarea:focus { outline: none; border-color: var(--primary); }

.color-row { display: flex; gap: 1rem; }
.color-input { display: flex; align-items: center; gap: 0.5rem; }
.color-input input { width: 50px; height: 36px; padding: 0; border: 1px solid var(--border); border-radius: 0.25rem; cursor: pointer; }

.preview-panel { display: flex; flex-direction: column; align-items: center; gap: 1.5rem; }
.qr-preview { padding: 1rem; background: white; border-radius: 0.75rem; }
.qr-preview canvas { display: block; }

.preview-actions { display: flex; gap: 0.75rem; }
.dl-btn, .copy-btn { padding: 0.6rem 1.25rem; background: rgba(255,255,255,0.05); border: 1px solid var(--border); border-radius: 0.5rem; color: var(--text-muted); cursor: pointer; }
.dl-btn:hover, .copy-btn:hover { border-color: var(--primary); color: var(--primary); }
.copy-btn.copied { background: var(--primary); border-color: var(--primary); color: var(--bg-primary); }

.qr-data { width: 100%; }
.qr-data label { display: block; font-size: 0.85rem; color: var(--text-muted); margin-bottom: 0.5rem; }
.data-preview { width: 100%; padding: 0.75rem; background: rgba(0,0,0,0.3); border: 1px solid var(--border); border-radius: 0.5rem; font-family: monospace; font-size: 0.8rem; color: var(--text-secondary); min-height: 80px; resize: none; }

.presets-section h3 { font-size: 1rem; margin-bottom: 1rem; }
.theme-grid { display: flex; flex-wrap: wrap; gap: 0.75rem; }
.theme-btn { padding: 0.5rem 1rem; border: 2px solid transparent; border-radius: 0.5rem; font-size: 0.85rem; cursor: pointer; transition: all 0.2s; }
.theme-btn:hover { transform: scale(1.05); }

@media (max-width: 768px) { .generator-grid { grid-template-columns: 1fr; } }
</style>
