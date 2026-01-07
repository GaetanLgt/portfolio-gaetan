<template>
  <div class="color-app">
    <a href="#main-content" class="skip-link">Aller au contenu principal</a>

    <!-- BACKGROUND -->
    <div class="app-bg" aria-hidden="true" :style="{ '--preview-color': previewColor }">
      <div class="color-glow"></div>
    </div>

    <!-- HEADER -->
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

    <!-- MAIN -->
    <main class="app-main" id="main-content">
      <div class="container">
        <div class="app-intro">
          <h1>
            <span class="app-icon">🎨</span>
            Color Converter
          </h1>
          <p>Convertissez instantanément entre HEX, RGB, HSL et HSV</p>
        </div>

        <!-- COLOR PREVIEW -->
        <div class="color-preview-section">
          <div class="color-preview" :style="{ backgroundColor: previewColor }">
            <div class="preview-overlay">
              <span class="preview-text" :style="{ color: contrastColor }">{{ previewColor }}</span>
            </div>
          </div>
          
          <div class="color-actions">
            <button class="action-btn" @click="copyColor(hex)" :class="{ copied: copiedFormat === 'hex' }">
              {{ copiedFormat === 'hex' ? '✓' : '📋' }} HEX
            </button>
            <button class="action-btn" @click="copyColor(rgbString)" :class="{ copied: copiedFormat === 'rgb' }">
              {{ copiedFormat === 'rgb' ? '✓' : '📋' }} RGB
            </button>
            <button class="action-btn" @click="copyColor(hslString)" :class="{ copied: copiedFormat === 'hsl' }">
              {{ copiedFormat === 'hsl' ? '✓' : '📋' }} HSL
            </button>
            <button class="action-btn action-btn--random" @click="randomColor">
              🎲 Random
            </button>
          </div>
        </div>

        <!-- INPUT SECTIONS -->
        <div class="inputs-grid">
          <!-- HEX -->
          <div class="input-card">
            <div class="input-header">
              <h2>HEX</h2>
              <span class="format-hint">#RRGGBB</span>
            </div>
            <div class="input-field">
              <span class="input-prefix">#</span>
              <input 
                type="text" 
                v-model="hexInput" 
                @input="updateFromHex"
                maxlength="6"
                placeholder="00FF88"
                class="hex-input"
              >
            </div>
          </div>

          <!-- RGB -->
          <div class="input-card">
            <div class="input-header">
              <h2>RGB</h2>
              <span class="format-hint">0-255</span>
            </div>
            <div class="rgb-inputs">
              <div class="rgb-input-group">
                <label>R</label>
                <input 
                  type="number" 
                  v-model.number="rgb.r" 
                  @input="updateFromRgb"
                  min="0" 
                  max="255"
                >
                <input 
                  type="range" 
                  v-model.number="rgb.r" 
                  @input="updateFromRgb"
                  min="0" 
                  max="255"
                  class="slider slider--red"
                >
              </div>
              <div class="rgb-input-group">
                <label>G</label>
                <input 
                  type="number" 
                  v-model.number="rgb.g" 
                  @input="updateFromRgb"
                  min="0" 
                  max="255"
                >
                <input 
                  type="range" 
                  v-model.number="rgb.g" 
                  @input="updateFromRgb"
                  min="0" 
                  max="255"
                  class="slider slider--green"
                >
              </div>
              <div class="rgb-input-group">
                <label>B</label>
                <input 
                  type="number" 
                  v-model.number="rgb.b" 
                  @input="updateFromRgb"
                  min="0" 
                  max="255"
                >
                <input 
                  type="range" 
                  v-model.number="rgb.b" 
                  @input="updateFromRgb"
                  min="0" 
                  max="255"
                  class="slider slider--blue"
                >
              </div>
            </div>
          </div>

          <!-- HSL -->
          <div class="input-card">
            <div class="input-header">
              <h2>HSL</h2>
              <span class="format-hint">H: 0-360, S/L: 0-100</span>
            </div>
            <div class="hsl-inputs">
              <div class="hsl-input-group">
                <label>H</label>
                <input 
                  type="number" 
                  v-model.number="hsl.h" 
                  @input="updateFromHsl"
                  min="0" 
                  max="360"
                >
                <input 
                  type="range" 
                  v-model.number="hsl.h" 
                  @input="updateFromHsl"
                  min="0" 
                  max="360"
                  class="slider slider--hue"
                >
              </div>
              <div class="hsl-input-group">
                <label>S</label>
                <input 
                  type="number" 
                  v-model.number="hsl.s" 
                  @input="updateFromHsl"
                  min="0" 
                  max="100"
                >
                <input 
                  type="range" 
                  v-model.number="hsl.s" 
                  @input="updateFromHsl"
                  min="0" 
                  max="100"
                  class="slider slider--saturation"
                >
              </div>
              <div class="hsl-input-group">
                <label>L</label>
                <input 
                  type="number" 
                  v-model.number="hsl.l" 
                  @input="updateFromHsl"
                  min="0" 
                  max="100"
                >
                <input 
                  type="range" 
                  v-model.number="hsl.l" 
                  @input="updateFromHsl"
                  min="0" 
                  max="100"
                  class="slider slider--lightness"
                >
              </div>
            </div>
          </div>
        </div>

        <!-- COLOR PALETTE -->
        <div class="palette-section">
          <h2>🎯 Palette de variations</h2>
          <div class="palette-grid">
            <div 
              v-for="(shade, i) in shades" 
              :key="i" 
              class="palette-swatch"
              :style="{ backgroundColor: shade }"
              @click="setColor(shade)"
            >
              <span class="swatch-label" :style="{ color: getContrastColor(shade) }">{{ shade }}</span>
            </div>
          </div>
        </div>

        <!-- RECENT COLORS -->
        <div class="recent-section" v-if="recentColors.length">
          <h2>🕐 Couleurs récentes</h2>
          <div class="recent-colors">
            <button 
              v-for="color in recentColors" 
              :key="color"
              class="recent-swatch"
              :style="{ backgroundColor: color }"
              @click="setColor(color)"
              :title="color"
            ></button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';

// State
const hexInput = ref('00FF88');
const rgb = ref({ r: 0, g: 255, b: 136 });
const hsl = ref({ h: 152, s: 100, l: 50 });
const copiedFormat = ref(null);
const recentColors = ref([]);

// Computed
const hex = computed(() => '#' + hexInput.value.toUpperCase());
const previewColor = computed(() => hex.value);
const rgbString = computed(() => `rgb(${rgb.value.r}, ${rgb.value.g}, ${rgb.value.b})`);
const hslString = computed(() => `hsl(${hsl.value.h}, ${hsl.value.s}%, ${hsl.value.l}%)`);

const contrastColor = computed(() => getContrastColor(hex.value));

const shades = computed(() => {
  const result = [];
  for (let l = 90; l >= 10; l -= 10) {
    result.push(hslToHex(hsl.value.h, hsl.value.s, l));
  }
  return result;
});

// Color conversion functions
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

function rgbToHex(r, g, b) {
  return '#' + [r, g, b].map(x => {
    const hex = Math.max(0, Math.min(255, Math.round(x))).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('').toUpperCase();
}

function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  };
}

function hslToRgb(h, s, l) {
  h /= 360; s /= 100; l /= 100;
  let r, g, b;

  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255)
  };
}

function hslToHex(h, s, l) {
  const { r, g, b } = hslToRgb(h, s, l);
  return rgbToHex(r, g, b);
}

function getContrastColor(hex) {
  const rgb = hexToRgb(hex);
  if (!rgb) return '#000';
  const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
  return luminance > 0.5 ? '#000000' : '#FFFFFF';
}

// Update functions
function updateFromHex() {
  let val = hexInput.value.replace(/[^a-fA-F0-9]/g, '').substring(0, 6);
  hexInput.value = val;
  
  if (val.length === 6) {
    const rgbVal = hexToRgb(val);
    if (rgbVal) {
      rgb.value = rgbVal;
      hsl.value = rgbToHsl(rgbVal.r, rgbVal.g, rgbVal.b);
      addToRecent(hex.value);
    }
  }
}

function updateFromRgb() {
  const hexVal = rgbToHex(rgb.value.r, rgb.value.g, rgb.value.b);
  hexInput.value = hexVal.substring(1);
  hsl.value = rgbToHsl(rgb.value.r, rgb.value.g, rgb.value.b);
  addToRecent(hexVal);
}

function updateFromHsl() {
  const rgbVal = hslToRgb(hsl.value.h, hsl.value.s, hsl.value.l);
  rgb.value = rgbVal;
  const hexVal = rgbToHex(rgbVal.r, rgbVal.g, rgbVal.b);
  hexInput.value = hexVal.substring(1);
  addToRecent(hexVal);
}

function setColor(hexColor) {
  hexInput.value = hexColor.replace('#', '');
  updateFromHex();
}

function randomColor() {
  const randomHex = Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
  hexInput.value = randomHex;
  updateFromHex();
}

async function copyColor(value) {
  try {
    await navigator.clipboard.writeText(value);
    copiedFormat.value = value.startsWith('#') ? 'hex' : value.startsWith('rgb') ? 'rgb' : 'hsl';
    setTimeout(() => copiedFormat.value = null, 2000);
  } catch (err) {
    console.error('Copy failed:', err);
  }
}

function addToRecent(color) {
  if (!recentColors.value.includes(color)) {
    recentColors.value.unshift(color);
    if (recentColors.value.length > 10) {
      recentColors.value.pop();
    }
    localStorage.setItem('recentColors', JSON.stringify(recentColors.value));
  }
}

// Init
onMounted(() => {
  const saved = localStorage.getItem('recentColors');
  if (saved) {
    recentColors.value = JSON.parse(saved);
  }
  updateFromHex();
});
</script>

<style scoped>
.color-app {
  min-height: 100vh;
  background: var(--bg-primary);
  position: relative;
}

/* Background */
.app-bg {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
}

.color-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 800px;
  height: 800px;
  background: var(--preview-color, var(--primary));
  border-radius: 50%;
  filter: blur(200px);
  opacity: 0.15;
  transition: background 0.5s ease;
}

/* Header */
.app-header {
  position: relative;
  z-index: 10;
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

.back-link:hover {
  color: var(--primary);
}

/* Main */
.app-main {
  position: relative;
  z-index: 1;
  padding: var(--space-lg) 0 var(--space-xl);
}

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

.app-icon {
  font-size: 2.5rem;
}

.app-intro p {
  color: var(--text-muted);
}

/* Color Preview */
.color-preview-section {
  margin-bottom: var(--space-lg);
}

.color-preview {
  position: relative;
  height: 200px;
  border-radius: 1rem;
  overflow: hidden;
  transition: background-color 0.3s ease;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.preview-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.1);
}

.preview-text {
  font-family: 'JetBrains Mono', monospace;
  font-size: 2rem;
  font-weight: 700;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.color-actions {
  display: flex;
  justify-content: center;
  gap: 0.75rem;
  margin-top: 1rem;
  flex-wrap: wrap;
}

.action-btn {
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--border);
  border-radius: 0.5rem;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.8rem;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.3s ease;
}

.action-btn:hover {
  border-color: var(--primary);
  color: var(--primary);
}

.action-btn.copied {
  background: var(--primary);
  border-color: var(--primary);
  color: var(--bg-primary);
}

.action-btn--random {
  background: rgba(0, 255, 136, 0.1);
  border-color: var(--primary);
  color: var(--primary);
}

/* Inputs Grid */
.inputs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--space-md);
  margin-bottom: var(--space-lg);
}

.input-card {
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid var(--border);
  border-radius: 1rem;
}

.input-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.input-header h2 {
  font-size: 1rem;
  font-weight: 600;
}

.format-hint {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.7rem;
  color: var(--text-muted);
}

/* HEX Input */
.input-field {
  display: flex;
  align-items: center;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid var(--border);
  border-radius: 0.5rem;
  overflow: hidden;
}

.input-prefix {
  padding: 0.75rem 1rem;
  font-family: 'JetBrains Mono', monospace;
  font-size: 1.25rem;
  color: var(--text-muted);
  background: rgba(255, 255, 255, 0.02);
  border-right: 1px solid var(--border);
}

.hex-input {
  flex: 1;
  padding: 0.75rem 1rem;
  background: transparent;
  border: none;
  font-family: 'JetBrains Mono', monospace;
  font-size: 1.25rem;
  color: var(--text-main);
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.hex-input:focus {
  outline: none;
}

/* RGB & HSL Inputs */
.rgb-inputs,
.hsl-inputs {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.rgb-input-group,
.hsl-input-group {
  display: grid;
  grid-template-columns: 30px 80px 1fr;
  gap: 0.75rem;
  align-items: center;
}

.rgb-input-group label,
.hsl-input-group label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.8rem;
  color: var(--text-muted);
  text-align: center;
}

.rgb-input-group input[type="number"],
.hsl-input-group input[type="number"] {
  padding: 0.5rem;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid var(--border);
  border-radius: 0.5rem;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.9rem;
  color: var(--text-main);
  text-align: center;
}

.rgb-input-group input[type="number"]:focus,
.hsl-input-group input[type="number"]:focus {
  outline: none;
  border-color: var(--primary);
}

/* Sliders */
.slider {
  -webkit-appearance: none;
  height: 8px;
  border-radius: 4px;
  background: var(--border);
  cursor: pointer;
}

.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: var(--primary);
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 255, 136, 0.4);
}

.slider--red { background: linear-gradient(90deg, #000, #f00); }
.slider--green { background: linear-gradient(90deg, #000, #0f0); }
.slider--blue { background: linear-gradient(90deg, #000, #00f); }
.slider--hue { background: linear-gradient(90deg, #f00, #ff0, #0f0, #0ff, #00f, #f0f, #f00); }
.slider--saturation { background: linear-gradient(90deg, #888, var(--primary)); }
.slider--lightness { background: linear-gradient(90deg, #000, #888, #fff); }

/* Palette */
.palette-section {
  margin-bottom: var(--space-lg);
}

.palette-section h2 {
  font-size: 1.1rem;
  margin-bottom: 1rem;
}

.palette-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 0.5rem;
}

.palette-swatch {
  height: 60px;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  display: flex;
  align-items: flex-end;
  padding: 0.5rem;
}

.palette-swatch:hover {
  transform: scale(1.05);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.swatch-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.65rem;
  opacity: 0.8;
}

/* Recent Colors */
.recent-section h2 {
  font-size: 1.1rem;
  margin-bottom: 1rem;
}

.recent-colors {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.recent-swatch {
  width: 40px;
  height: 40px;
  border-radius: 0.5rem;
  border: 2px solid var(--border);
  cursor: pointer;
  transition: transform 0.2s ease, border-color 0.2s ease;
}

.recent-swatch:hover {
  transform: scale(1.1);
  border-color: var(--primary);
}

/* Responsive */
@media (max-width: 768px) {
  .color-preview {
    height: 150px;
  }
  
  .preview-text {
    font-size: 1.25rem;
  }
  
  .inputs-grid {
    grid-template-columns: 1fr;
  }
  
  .rgb-input-group,
  .hsl-input-group {
    grid-template-columns: 25px 60px 1fr;
    gap: 0.5rem;
  }
}
</style>
