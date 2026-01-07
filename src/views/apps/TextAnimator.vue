<template>
  <div class="gif-app">
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
          <h1><span class="app-icon">✨</span> Text Animator</h1>
          <p>Créez du texte animé pour vos forums, Discord et réseaux sociaux</p>
        </div>

        <div class="preview-card">
          <div class="preview-text" :style="previewStyles" :class="'anim-' + animation">
            <span v-for="(char, i) in displayText" :key="i" :style="{ animationDelay: (i * 0.05) + 's' }">{{ char === ' ' ? '\u00A0' : char }}</span>
          </div>
        </div>

        <div class="config-card">
          <h2>📝 Texte</h2>
          <input type="text" v-model="text" placeholder="Votre texte..." class="text-input" maxlength="50">
        </div>

        <div class="config-grid">
          <div class="config-card">
            <h2>🔤 Police</h2>
            <select v-model="font" class="config-select">
              <option value="'JetBrains Mono', monospace">Monospace</option>
              <option value="'Arial Black', sans-serif">Arial Black</option>
              <option value="'Impact', sans-serif">Impact</option>
            </select>
          </div>

          <div class="config-card">
            <h2>📏 Taille: {{ fontSize }}px</h2>
            <input type="range" v-model.number="fontSize" min="16" max="72" class="config-slider">
          </div>

          <div class="config-card">
            <h2>🎨 Couleur</h2>
            <div class="color-options">
              <button v-for="c in ['#00FF88','#00D4FF','#FF00FF','#FFD700','#FF4500']" :key="c" class="color-btn" :style="{background:c}" :class="{active:textColor===c}" @click="textColor=c"></button>
              <input type="color" v-model="textColor" class="color-picker">
            </div>
          </div>

          <div class="config-card">
            <h2>✨ Animation</h2>
            <div class="animation-grid">
              <button v-for="a in ['none','wave','pulse','bounce','shake','glitch','rainbow','neon']" :key="a" class="anim-btn" :class="{active:animation===a}" @click="animation=a">{{ a }}</button>
            </div>
          </div>
        </div>

        <div class="config-card">
          <h2>🎭 Effets</h2>
          <div class="effects-grid">
            <label class="effect-toggle"><input type="checkbox" v-model="shadow"><span class="toggle-box"></span>Ombre</label>
            <label class="effect-toggle"><input type="checkbox" v-model="glow"><span class="toggle-box"></span>Glow</label>
            <label class="effect-toggle"><input type="checkbox" v-model="uppercase"><span class="toggle-box"></span>MAJUSCULES</label>
          </div>
        </div>

        <div class="export-buttons">
          <button class="export-btn" @click="copyCSS">📋 Copier CSS</button>
          <button class="export-btn export-btn--primary" @click="downloadImage">🖼️ PNG</button>
        </div>

        <pre v-if="showCSS" class="css-output">{{ generatedCSS }}</pre>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const text = ref('GL Digital Lab');
const font = ref("'JetBrains Mono', monospace");
const fontSize = ref(36);
const textColor = ref('#00FF88');
const animation = ref('wave');
const shadow = ref(true);
const glow = ref(true);
const uppercase = ref(false);
const showCSS = ref(false);

const displayText = computed(() => uppercase.value ? text.value.toUpperCase() : text.value);

const previewStyles = computed(() => {
  let styles = { fontFamily: font.value, fontSize: fontSize.value + 'px', color: textColor.value };
  let shadows = [];
  if (shadow.value) shadows.push('2px 2px 4px rgba(0,0,0,0.5)');
  if (glow.value) shadows.push(`0 0 10px ${textColor.value}, 0 0 20px ${textColor.value}`);
  if (shadows.length) styles.textShadow = shadows.join(', ');
  return styles;
});

const generatedCSS = computed(() => {
  let css = `.animated-text {\n  font-family: ${font.value};\n  font-size: ${fontSize.value}px;\n  color: ${textColor.value};\n`;
  if (shadow.value || glow.value) {
    let s = [];
    if (shadow.value) s.push('2px 2px 4px rgba(0,0,0,0.5)');
    if (glow.value) s.push(`0 0 10px ${textColor.value}`);
    css += `  text-shadow: ${s.join(', ')};\n`;
  }
  if (animation.value !== 'none') css += `  animation: ${animation.value} 1s ease-in-out infinite;\n`;
  css += '}';
  return css;
});

function copyCSS() { navigator.clipboard.writeText(generatedCSS.value); showCSS.value = true; }

function downloadImage() {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  ctx.font = `${fontSize.value}px Arial`;
  const m = ctx.measureText(displayText.value);
  canvas.width = m.width + 80; canvas.height = fontSize.value * 2;
  ctx.fillStyle = '#0a0a0f'; ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.font = `${fontSize.value}px Arial`; ctx.fillStyle = textColor.value;
  if (glow.value) { ctx.shadowColor = textColor.value; ctx.shadowBlur = 20; }
  ctx.fillText(displayText.value, 40, fontSize.value * 1.2);
  const a = document.createElement('a'); a.download = 'text.png'; a.href = canvas.toDataURL(); a.click();
}
</script>

<style scoped>
.gif-app { min-height: 100vh; background: var(--bg-primary); }
.app-header { padding: 1rem 0; border-bottom: 1px solid var(--border); background: rgba(10,10,15,0.9); backdrop-filter: blur(10px); }
.back-link { display: inline-flex; align-items: center; gap: 0.5rem; color: var(--text-muted); text-decoration: none; font-size: 0.9rem; }
.back-link:hover { color: var(--primary); }
.app-main { padding: var(--space-lg) 0; }
.app-intro { text-align: center; margin-bottom: var(--space-lg); }
.app-intro h1 { display: flex; align-items: center; justify-content: center; gap: 0.75rem; font-size: 2rem; margin-bottom: 0.5rem; }
.app-icon { font-size: 2.5rem; }
.app-intro p { color: var(--text-muted); }

.preview-card { min-height: 180px; display: flex; align-items: center; justify-content: center; background: rgba(0,0,0,0.4); border: 1px solid var(--border); border-radius: 1rem; padding: 2rem; margin-bottom: var(--space-lg); }
.preview-text { display: flex; white-space: nowrap; }
.preview-text span { display: inline-block; }

.anim-wave span { animation: wave 1s ease-in-out infinite; }
.anim-pulse span { animation: pulse 1s ease-in-out infinite; }
.anim-bounce span { animation: bounce 0.6s ease-in-out infinite; }
.anim-shake span { animation: shake 0.3s ease-in-out infinite; }
.anim-glitch span { animation: glitch 0.5s ease-in-out infinite; }
.anim-rainbow span { animation: rainbow 3s linear infinite; }
.anim-neon span { animation: neon 1.5s ease-in-out infinite; }

@keyframes wave { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-15px)} }
@keyframes pulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.15)} }
@keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-25px)} }
@keyframes shake { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-5px)} 75%{transform:translateX(5px)} }
@keyframes glitch { 0%,100%{transform:translate(0);filter:none} 20%{transform:translate(-3px,3px);filter:hue-rotate(90deg)} 40%{transform:translate(3px,-3px);filter:hue-rotate(180deg)} }
@keyframes rainbow { 0%{filter:hue-rotate(0deg)} 100%{filter:hue-rotate(360deg)} }
@keyframes neon { 0%,100%{opacity:1;filter:brightness(1)} 50%{opacity:0.7;filter:brightness(1.8)} }

.config-card { padding: 1.25rem; background: rgba(255,255,255,0.02); border: 1px solid var(--border); border-radius: 0.75rem; margin-bottom: 1rem; }
.config-card h2 { font-size: 0.9rem; margin-bottom: 1rem; color: var(--text-muted); }
.config-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem; }

.text-input, .config-select { width: 100%; padding: 0.75rem; background: rgba(0,0,0,0.3); border: 1px solid var(--border); border-radius: 0.5rem; font-size: 1rem; color: var(--text-main); }
.text-input:focus, .config-select:focus { outline: none; border-color: var(--primary); }

.config-slider { width: 100%; -webkit-appearance: none; height: 8px; border-radius: 4px; background: var(--border); }
.config-slider::-webkit-slider-thumb { -webkit-appearance: none; width: 20px; height: 20px; border-radius: 50%; background: var(--primary); cursor: pointer; }

.color-options { display: flex; flex-wrap: wrap; gap: 0.5rem; }
.color-btn { width: 36px; height: 36px; border: 2px solid transparent; border-radius: 0.5rem; cursor: pointer; }
.color-btn.active, .color-btn:hover { border-color: white; transform: scale(1.1); }
.color-picker { width: 36px; height: 36px; padding: 0; border: 2px solid var(--border); border-radius: 0.5rem; cursor: pointer; }

.animation-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.5rem; }
.anim-btn { padding: 0.5rem; background: rgba(255,255,255,0.02); border: 1px solid var(--border); border-radius: 0.35rem; font-size: 0.7rem; color: var(--text-muted); cursor: pointer; text-transform: capitalize; }
.anim-btn:hover { border-color: var(--primary); color: var(--primary); }
.anim-btn.active { background: var(--primary); border-color: var(--primary); color: var(--bg-primary); }

.effects-grid { display: flex; flex-wrap: wrap; gap: 1.5rem; }
.effect-toggle { display: flex; align-items: center; gap: 0.5rem; cursor: pointer; font-size: 0.85rem; color: var(--text-muted); }
.effect-toggle input { display: none; }
.toggle-box { width: 40px; height: 22px; background: var(--border); border-radius: 11px; position: relative; transition: all 0.2s; }
.toggle-box::after { content: ''; position: absolute; top: 2px; left: 2px; width: 18px; height: 18px; background: white; border-radius: 50%; transition: all 0.2s; }
.effect-toggle input:checked + .toggle-box { background: var(--primary); }
.effect-toggle input:checked + .toggle-box::after { left: 20px; }

.export-buttons { display: flex; gap: 1rem; margin-bottom: 1rem; }
.export-btn { padding: 0.75rem 1.5rem; background: rgba(255,255,255,0.05); border: 1px solid var(--border); border-radius: 0.5rem; font-family: 'JetBrains Mono', monospace; font-size: 0.9rem; color: var(--text-secondary); cursor: pointer; }
.export-btn:hover { border-color: var(--primary); color: var(--primary); }
.export-btn--primary { background: var(--primary); border-color: var(--primary); color: var(--bg-primary); }

.css-output { padding: 1rem; background: rgba(0,0,0,0.4); border: 1px solid var(--border); border-radius: 0.5rem; font-family: 'JetBrains Mono', monospace; font-size: 0.8rem; color: var(--primary); white-space: pre-wrap; }

@media (max-width: 768px) { .animation-grid { grid-template-columns: repeat(2, 1fr); } }
</style>
