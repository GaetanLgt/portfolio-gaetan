<template>
  <div class="wireframe-app">
    <header class="app-header">
      <div class="container">
        <router-link to="/apps" class="back-link">← Retour aux Apps</router-link>
      </div>
    </header>
    <main class="app-main">
      <div class="container">
        <div class="app-intro">
          <h1><span class="app-icon">🖼️</span> Wireframe Builder</h1>
          <p>Créez des maquettes UI low-fidelity rapidement</p>
        </div>

        <div class="builder-grid">
          <!-- PALETTE -->
          <div class="palette-panel">
            <h3>🧩 Composants</h3>
            <div class="comp-list">
              <div v-for="comp in components" :key="comp.type" class="comp-item" draggable="true" @dragstart="dragStart($event, comp)">
                <span class="comp-icon">{{ comp.icon }}</span>
                <span class="comp-name">{{ comp.name }}</span>
              </div>
            </div>
          </div>

          <!-- CANVAS -->
          <div class="canvas-panel">
            <div class="canvas-toolbar">
              <select v-model="canvasSize">
                <option value="desktop">🖥️ Desktop (1200×800)</option>
                <option value="tablet">📱 Tablet (768×1024)</option>
                <option value="mobile">📲 Mobile (375×667)</option>
              </select>
              <button @click="clearCanvas">🗑️ Vider</button>
              <button @click="exportCanvas">💾 Export</button>
            </div>
            <div class="canvas-wrapper" :class="canvasSize" @dragover.prevent @drop="handleDrop" ref="canvasRef">
              <div class="wireframe-canvas">
                <div v-for="el in elements" :key="el.id" class="wf-element" :class="['wf-' + el.type, { selected: selected === el.id }]" :style="getStyle(el)" @click.stop="select(el.id)" @mousedown="startDrag($event, el)">
                  <component :is="'wf-' + el.type" />
                  <div v-if="selected === el.id" class="resize-handle" @mousedown.stop="startResize($event, el)"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- PROPS -->
          <div class="props-panel">
            <h3>⚙️ Propriétés</h3>
            <div v-if="currentEl" class="props-form">
              <label>X: <input type="number" v-model.number="currentEl.x" step="10"></label>
              <label>Y: <input type="number" v-model.number="currentEl.y" step="10"></label>
              <label>W: <input type="number" v-model.number="currentEl.w" step="10" min="50"></label>
              <label>H: <input type="number" v-model.number="currentEl.h" step="10" min="30"></label>
              <button @click="deleteEl" class="del-btn">🗑️ Supprimer</button>
            </div>
            <p v-else class="props-empty">Sélectionnez un élément</p>
            
            <h4>📦 Templates</h4>
            <button @click="loadTpl('landing')">🚀 Landing</button>
            <button @click="loadTpl('dashboard')">📊 Dashboard</button>
            <button @click="loadTpl('form')">📋 Formulaire</button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, h } from 'vue';

const canvasRef = ref(null);
const canvasSize = ref('desktop');
const selected = ref(null);
const elements = ref([]);
let idCounter = 1;

const components = [
  { type: 'header', name: 'Header', icon: '📰', w: 800, h: 60 },
  { type: 'hero', name: 'Hero', icon: '🎯', w: 800, h: 250 },
  { type: 'text', name: 'Texte', icon: '📄', w: 400, h: 80 },
  { type: 'image', name: 'Image', icon: '🖼️', w: 300, h: 200 },
  { type: 'button', name: 'Bouton', icon: '🔘', w: 150, h: 45 },
  { type: 'input', name: 'Input', icon: '📝', w: 280, h: 45 },
  { type: 'card', name: 'Card', icon: '🃏', w: 280, h: 320 },
  { type: 'nav', name: 'Nav Bar', icon: '📱', w: 375, h: 55 },
  { type: 'sidebar', name: 'Sidebar', icon: '📑', w: 200, h: 400 },
  { type: 'footer', name: 'Footer', icon: '📋', w: 800, h: 70 }
];

const currentEl = computed(() => elements.value.find(e => e.id === selected.value));

// Wireframe components
const WfHeader = { render: () => h('div', { class: 'wf-c' }, [h('span', 'LOGO'), h('div', { class: 'wf-nav' }, ['Menu', 'Menu', 'Menu'].map(m => h('span', m)))]) };
const WfHero = { render: () => h('div', { class: 'wf-c wf-hero-c' }, [h('div', { class: 'wf-title' }, 'Titre Principal'), h('div', { class: 'wf-sub' }, 'Sous-titre'), h('div', { class: 'wf-btn' }, 'CTA')]) };
const WfText = { render: () => h('div', { class: 'wf-c wf-text-c' }, [h('div', { class: 'line' }), h('div', { class: 'line' }), h('div', { class: 'line short' })]) };
const WfImage = { render: () => h('div', { class: 'wf-c wf-img-c' }, '🖼️') };
const WfButton = { render: () => h('div', { class: 'wf-c wf-btn-c' }, 'Button') };
const WfInput = { render: () => h('div', { class: 'wf-c wf-input-c' }, 'Placeholder...') };
const WfCard = { render: () => h('div', { class: 'wf-c wf-card-c' }, [h('div', { class: 'card-img' }, '🖼️'), h('div', { class: 'card-title' }, 'Card Title'), h('div', { class: 'card-text' }, [h('div', { class: 'line' }), h('div', { class: 'line short' })])]) };
const WfNav = { render: () => h('div', { class: 'wf-c wf-nav-c' }, ['🏠', '🔍', '➕', '👤', '☰'].map(i => h('span', i))) };
const WfSidebar = { render: () => h('div', { class: 'wf-c wf-side-c' }, ['Dashboard', 'Analytics', 'Settings', 'Users'].map(m => h('div', { class: 'side-item' }, m))) };
const WfFooter = { render: () => h('div', { class: 'wf-c wf-footer-c' }, ['Link', 'Link', 'Link', '© 2024'].map(l => h('span', l))) };

// Register components
const compMap = { 'wf-header': WfHeader, 'wf-hero': WfHero, 'wf-text': WfText, 'wf-image': WfImage, 'wf-button': WfButton, 'wf-input': WfInput, 'wf-card': WfCard, 'wf-nav': WfNav, 'wf-sidebar': WfSidebar, 'wf-footer': WfFooter };

function dragStart(e, comp) { e.dataTransfer.setData('comp', JSON.stringify(comp)); }
function handleDrop(e) {
  const data = e.dataTransfer.getData('comp');
  if (!data) return;
  const comp = JSON.parse(data);
  const rect = canvasRef.value.getBoundingClientRect();
  elements.value.push({ id: idCounter++, type: comp.type, x: e.clientX - rect.left - comp.w/2, y: e.clientY - rect.top - comp.h/2, w: comp.w, h: comp.h });
}
function select(id) { selected.value = id; }
function getStyle(el) { return { left: el.x + 'px', top: el.y + 'px', width: el.w + 'px', height: el.h + 'px' }; }
function startDrag(e, el) {
  const startX = e.clientX - el.x, startY = e.clientY - el.y;
  const move = (e) => { el.x = Math.max(0, e.clientX - startX); el.y = Math.max(0, e.clientY - startY); };
  const up = () => { window.removeEventListener('mousemove', move); window.removeEventListener('mouseup', up); };
  window.addEventListener('mousemove', move); window.addEventListener('mouseup', up);
}
function startResize(e, el) {
  const startX = e.clientX, startY = e.clientY, startW = el.w, startH = el.h;
  const move = (e) => { el.w = Math.max(50, startW + e.clientX - startX); el.h = Math.max(30, startH + e.clientY - startY); };
  const up = () => { window.removeEventListener('mousemove', move); window.removeEventListener('mouseup', up); };
  window.addEventListener('mousemove', move); window.addEventListener('mouseup', up);
}
function deleteEl() { elements.value = elements.value.filter(e => e.id !== selected.value); selected.value = null; }
function clearCanvas() { elements.value = []; selected.value = null; }
function exportCanvas() {
  const html = `<html><body style="background:#fff;font-family:sans-serif"><div style="position:relative;width:900px;margin:auto;min-height:600px;border:1px solid #ddd">${elements.value.map(el => `<div style="position:absolute;left:${el.x}px;top:${el.y}px;width:${el.w}px;height:${el.h}px;border:2px dashed #ccc;background:#f9f9f9;display:flex;align-items:center;justify-content:center">${el.type}</div>`).join('')}</div></body></html>`;
  const blob = new Blob([html], { type: 'text/html' });
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'wireframe.html'; a.click();
}
function loadTpl(type) {
  clearCanvas();
  if (type === 'landing') {
    elements.value = [
      { id: 1, type: 'header', x: 0, y: 0, w: 900, h: 60 },
      { id: 2, type: 'hero', x: 0, y: 70, w: 900, h: 280 },
      { id: 3, type: 'card', x: 50, y: 380, w: 260, h: 280 },
      { id: 4, type: 'card', x: 330, y: 380, w: 260, h: 280 },
      { id: 5, type: 'card', x: 610, y: 380, w: 260, h: 280 },
      { id: 6, type: 'footer', x: 0, y: 690, w: 900, h: 60 }
    ];
  } else if (type === 'dashboard') {
    elements.value = [
      { id: 1, type: 'header', x: 0, y: 0, w: 900, h: 50 },
      { id: 2, type: 'sidebar', x: 0, y: 60, w: 200, h: 540 },
      { id: 3, type: 'card', x: 220, y: 70, w: 320, h: 180 },
      { id: 4, type: 'card', x: 560, y: 70, w: 320, h: 180 },
      { id: 5, type: 'text', x: 220, y: 270, w: 660, h: 300 }
    ];
  } else if (type === 'form') {
    elements.value = [
      { id: 1, type: 'text', x: 300, y: 50, w: 300, h: 60 },
      { id: 2, type: 'input', x: 300, y: 130, w: 300, h: 45 },
      { id: 3, type: 'input', x: 300, y: 190, w: 300, h: 45 },
      { id: 4, type: 'input', x: 300, y: 250, w: 300, h: 45 },
      { id: 5, type: 'button', x: 375, y: 320, w: 150, h: 45 }
    ];
  }
  idCounter = elements.value.length + 1;
}
loadTpl('landing');
</script>

<style scoped>
.wireframe-app { min-height: 100vh; background: var(--bg-primary); }
.app-header { padding: 1rem 0; border-bottom: 1px solid var(--border); }
.back-link { color: var(--text-muted); text-decoration: none; }
.app-main { padding: var(--space-lg) 0; }
.app-intro { text-align: center; margin-bottom: 1.5rem; }
.app-intro h1 { display: flex; justify-content: center; gap: 0.5rem; font-size: 1.75rem; }
.app-icon { font-size: 2rem; }

.builder-grid { display: grid; grid-template-columns: 180px 1fr 200px; gap: 1rem; }
.palette-panel, .props-panel { background: rgba(255,255,255,0.02); border: 1px solid var(--border); border-radius: 0.5rem; padding: 1rem; }
.palette-panel h3, .props-panel h3, .props-panel h4 { font-size: 0.9rem; margin-bottom: 0.75rem; }
.props-panel h4 { margin-top: 1.5rem; }

.comp-list { display: flex; flex-direction: column; gap: 0.35rem; }
.comp-item { display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem; background: rgba(0,0,0,0.2); border: 1px solid var(--border); border-radius: 0.35rem; cursor: grab; font-size: 0.8rem; }
.comp-item:hover { border-color: var(--primary); }
.comp-icon { font-size: 1rem; }
.comp-name { color: var(--text-muted); }

.canvas-panel { background: rgba(255,255,255,0.02); border: 1px solid var(--border); border-radius: 0.5rem; overflow: hidden; }
.canvas-toolbar { display: flex; gap: 0.5rem; padding: 0.75rem; border-bottom: 1px solid var(--border); }
.canvas-toolbar select, .canvas-toolbar button { padding: 0.4rem 0.75rem; background: rgba(0,0,0,0.3); border: 1px solid var(--border); border-radius: 0.25rem; color: var(--text-main); font-size: 0.8rem; cursor: pointer; }

.canvas-wrapper { padding: 1rem; overflow: auto; display: flex; justify-content: center; }
.wireframe-canvas { position: relative; background: #fff; box-shadow: 0 4px 20px rgba(0,0,0,0.3); }
.canvas-wrapper.desktop .wireframe-canvas { width: 900px; min-height: 600px; }
.canvas-wrapper.tablet .wireframe-canvas { width: 768px; min-height: 500px; }
.canvas-wrapper.mobile .wireframe-canvas { width: 375px; min-height: 667px; }

.wf-element { position: absolute; border: 2px solid #ddd; background: #f9f9f9; cursor: move; overflow: hidden; }
.wf-element.selected { border-color: var(--primary); box-shadow: 0 0 0 2px rgba(0,255,136,0.3); }
.resize-handle { position: absolute; right: -5px; bottom: -5px; width: 12px; height: 12px; background: var(--primary); cursor: se-resize; }

/* Wireframe component styles */
.wf-c { width: 100%; height: 100%; display: flex; padding: 8px; box-sizing: border-box; color: #333; font-size: 12px; }
.wf-header .wf-c { align-items: center; background: #f5f5f5; justify-content: space-between; }
.wf-nav { display: flex; gap: 1rem; color: #666; }
.wf-hero-c { flex-direction: column; align-items: center; justify-content: center; text-align: center; }
.wf-title { font-size: 24px; font-weight: bold; margin-bottom: 8px; }
.wf-sub { color: #666; margin-bottom: 16px; }
.wf-btn { padding: 8px 20px; background: #333; color: #fff; }
.wf-text-c { flex-direction: column; justify-content: center; }
.line { height: 10px; background: #ddd; margin-bottom: 6px; border-radius: 2px; width: 100%; }
.line.short { width: 60%; }
.wf-img-c { align-items: center; justify-content: center; background: #e5e5e5; font-size: 2rem; color: #999; }
.wf-btn-c { align-items: center; justify-content: center; background: #333; color: #fff; }
.wf-input-c { align-items: center; border: 1px solid #ccc; background: #fff; color: #999; }
.wf-card-c { flex-direction: column; }
.card-img { height: 45%; background: #e5e5e5; display: flex; align-items: center; justify-content: center; font-size: 2rem; color: #999; }
.card-title { font-weight: bold; padding: 8px 0; }
.card-text { flex: 1; }
.wf-nav-c { justify-content: space-around; background: #333; align-items: center; font-size: 1.25rem; }
.wf-nav-c span { color: #fff; }
.wf-side-c { flex-direction: column; background: #f0f0f0; padding: 0; }
.side-item { padding: 12px; border-bottom: 1px solid #ddd; }
.side-item:first-child { background: #e0e0e0; }
.wf-footer-c { justify-content: center; gap: 2rem; background: #333; color: #fff; align-items: center; }

.props-form { display: flex; flex-direction: column; gap: 0.5rem; }
.props-form label { display: flex; justify-content: space-between; align-items: center; font-size: 0.8rem; color: var(--text-muted); }
.props-form input { width: 80px; padding: 0.35rem; background: rgba(0,0,0,0.3); border: 1px solid var(--border); border-radius: 0.25rem; color: var(--text-main); text-align: right; }
.del-btn { margin-top: 0.5rem; padding: 0.5rem; background: transparent; border: 1px solid #EF4444; border-radius: 0.35rem; color: #EF4444; cursor: pointer; }
.props-empty { color: var(--text-muted); font-size: 0.8rem; }
.props-panel button { display: block; width: 100%; padding: 0.5rem; margin-bottom: 0.35rem; background: rgba(0,0,0,0.2); border: 1px solid var(--border); border-radius: 0.35rem; color: var(--text-muted); cursor: pointer; font-size: 0.8rem; text-align: left; }
.props-panel button:hover { border-color: var(--primary); color: var(--primary); }

@media (max-width: 1024px) { .builder-grid { grid-template-columns: 1fr; } }
</style>
