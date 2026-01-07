<template>
  <div class="flowchart-app">
    <header class="app-header">
      <div class="container">
        <router-link to="/apps" class="back-link">← Retour aux Apps</router-link>
      </div>
    </header>
    <main class="app-main">
      <div class="container-fluid">
        <div class="app-intro">
          <h1><span class="app-icon">🔀</span> Flowchart Builder</h1>
          <p>Créez des diagrammes de flux et d'algorithmes interactifs</p>
        </div>

        <div class="builder-layout">
          <!-- TOOLBAR -->
          <div class="toolbar">
            <div class="tool-group">
              <span class="group-label">Formes</span>
              <button v-for="shape in shapes" :key="shape.type" :class="['tool-btn', { active: selectedTool === shape.type }]" @click="selectedTool = shape.type" :title="shape.name">
                <span class="shape-icon">{{ shape.icon }}</span>
              </button>
            </div>
            <div class="tool-group">
              <span class="group-label">Actions</span>
              <button class="tool-btn" @click="selectedTool = 'select'" :class="{ active: selectedTool === 'select' }" title="Sélectionner">🖱️</button>
              <button class="tool-btn" @click="selectedTool = 'connect'" :class="{ active: selectedTool === 'connect' }" title="Connecter">↗️</button>
              <button class="tool-btn" @click="deleteSelected" title="Supprimer">🗑️</button>
            </div>
            <div class="tool-group">
              <span class="group-label">Fichier</span>
              <button class="tool-btn" @click="clearCanvas" title="Nouveau">📄</button>
              <button class="tool-btn" @click="exportSVG" title="Export SVG">💾</button>
              <button class="tool-btn" @click="exportJSON" title="Export JSON">📦</button>
            </div>
          </div>

          <!-- CANVAS -->
          <div class="canvas-container" ref="canvasContainer" @click="handleCanvasClick" @mousemove="handleMouseMove">
            <svg class="flowchart-canvas" :viewBox="`0 0 ${canvasWidth} ${canvasHeight}`">
              <!-- Grid -->
              <defs>
                <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="0.5"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)"/>

              <!-- Connections -->
              <g class="connections-layer">
                <path v-for="conn in connections" :key="conn.id" :d="getConnectionPath(conn)" class="connection-line" :class="{ selected: selectedConnection === conn.id }" @click.stop="selectConnection(conn.id)"/>
                <polygon v-for="conn in connections" :key="'arrow-'+conn.id" :points="getArrowPoints(conn)" class="connection-arrow"/>
              </g>

              <!-- Nodes -->
              <g v-for="node in nodes" :key="node.id" class="node-group" :class="{ selected: selectedNode === node.id, dragging: draggingNode === node.id }" :transform="`translate(${node.x}, ${node.y})`" @mousedown.stop="startDrag(node)" @click.stop="selectNode(node.id)">
                <!-- Shape -->
                <rect v-if="node.shape === 'process'" :width="node.width" :height="node.height" rx="4" class="node-shape"/>
                <ellipse v-else-if="node.shape === 'terminal'" :cx="node.width/2" :cy="node.height/2" :rx="node.width/2" :ry="node.height/2" class="node-shape"/>
                <polygon v-else-if="node.shape === 'decision'" :points="getDiamondPoints(node)" class="node-shape"/>
                <polygon v-else-if="node.shape === 'data'" :points="getParallelogramPoints(node)" class="node-shape"/>
                <rect v-else-if="node.shape === 'document'" :width="node.width" :height="node.height" rx="0" class="node-shape node-shape--document"/>
                
                <!-- Label -->
                <text :x="node.width/2" :y="node.height/2" class="node-label">{{ node.label }}</text>
                
                <!-- Connection points -->
                <g v-if="selectedNode === node.id || selectedTool === 'connect'" class="connection-points">
                  <circle :cx="node.width/2" :cy="0" r="6" class="conn-point" data-pos="top" @mousedown.stop="startConnection(node, 'top')"/>
                  <circle :cx="node.width" :cy="node.height/2" r="6" class="conn-point" data-pos="right" @mousedown.stop="startConnection(node, 'right')"/>
                  <circle :cx="node.width/2" :cy="node.height" r="6" class="conn-point" data-pos="bottom" @mousedown.stop="startConnection(node, 'bottom')"/>
                  <circle :cx="0" :cy="node.height/2" r="6" class="conn-point" data-pos="left" @mousedown.stop="startConnection(node, 'left')"/>
                </g>
              </g>

              <!-- Temp connection line -->
              <line v-if="tempConnection" :x1="tempConnection.x1" :y1="tempConnection.y1" :x2="tempConnection.x2" :y2="tempConnection.y2" class="temp-connection"/>
            </svg>
          </div>

          <!-- PROPERTIES PANEL -->
          <div class="properties-panel">
            <h3>📝 Propriétés</h3>
            <div v-if="selectedNode && getSelectedNode" class="prop-form">
              <div class="prop-field">
                <label>Label</label>
                <input type="text" v-model="getSelectedNode.label">
              </div>
              <div class="prop-field">
                <label>Couleur</label>
                <div class="color-options">
                  <button v-for="color in nodeColors" :key="color" :class="['color-btn', { active: getSelectedNode.color === color }]" :style="{ background: color }" @click="getSelectedNode.color = color"></button>
                </div>
              </div>
              <div class="prop-field">
                <label>Taille</label>
                <div class="size-inputs">
                  <input type="number" v-model.number="getSelectedNode.width" min="60" max="300" step="10">
                  <span>×</span>
                  <input type="number" v-model.number="getSelectedNode.height" min="40" max="200" step="10">
                </div>
              </div>
            </div>
            <div v-else class="prop-empty">
              <p>Sélectionnez un élément pour modifier ses propriétés</p>
            </div>

            <!-- TEMPLATES -->
            <div class="templates-section">
              <h4>📦 Templates</h4>
              <button @click="loadTemplate('basic')">Flux basique</button>
              <button @click="loadTemplate('decision')">Décision</button>
              <button @click="loadTemplate('process')">Processus</button>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const canvasWidth = 1200;
const canvasHeight = 800;
const canvasContainer = ref(null);

const selectedTool = ref('select');
const selectedNode = ref(null);
const selectedConnection = ref(null);
const draggingNode = ref(null);
const dragOffset = ref({ x: 0, y: 0 });
const tempConnection = ref(null);
const connectingFrom = ref(null);

const shapes = [
  { type: 'terminal', name: 'Début/Fin', icon: '⬭' },
  { type: 'process', name: 'Processus', icon: '▭' },
  { type: 'decision', name: 'Décision', icon: '◇' },
  { type: 'data', name: 'Données', icon: '▱' },
  { type: 'document', name: 'Document', icon: '📄' }
];

const nodeColors = ['#00ff88', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

const nodes = ref([]);
const connections = ref([]);
let nodeIdCounter = 1;
let connIdCounter = 1;

const getSelectedNode = computed(() => nodes.value.find(n => n.id === selectedNode.value));

function handleCanvasClick(e) {
  if (selectedTool.value === 'select') {
    selectedNode.value = null;
    selectedConnection.value = null;
    return;
  }
  
  if (shapes.find(s => s.type === selectedTool.value)) {
    const rect = canvasContainer.value.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * canvasWidth - 60;
    const y = ((e.clientY - rect.top) / rect.height) * canvasHeight - 30;
    
    nodes.value.push({
      id: nodeIdCounter++,
      shape: selectedTool.value,
      label: getDefaultLabel(selectedTool.value),
      x: Math.max(0, Math.min(x, canvasWidth - 120)),
      y: Math.max(0, Math.min(y, canvasHeight - 60)),
      width: 120,
      height: 60,
      color: '#00ff88'
    });
    
    selectedTool.value = 'select';
  }
}

function getDefaultLabel(shape) {
  const labels = {
    terminal: 'Début',
    process: 'Processus',
    decision: 'Condition?',
    data: 'Données',
    document: 'Document'
  };
  return labels[shape] || 'Node';
}

function selectNode(id) {
  if (selectedTool.value === 'connect' && connectingFrom.value) {
    const toNode = nodes.value.find(n => n.id === id);
    if (toNode && connectingFrom.value.node.id !== id) {
      connections.value.push({
        id: connIdCounter++,
        from: connectingFrom.value.node.id,
        fromPos: connectingFrom.value.pos,
        to: id,
        toPos: 'top'
      });
    }
    connectingFrom.value = null;
    tempConnection.value = null;
  } else {
    selectedNode.value = id;
    selectedConnection.value = null;
  }
}

function selectConnection(id) {
  selectedConnection.value = id;
  selectedNode.value = null;
}

function startDrag(node) {
  if (selectedTool.value !== 'select') return;
  draggingNode.value = node.id;
  selectedNode.value = node.id;
  
  const rect = canvasContainer.value.getBoundingClientRect();
  dragOffset.value = { x: 0, y: 0 };
  
  const onMove = (e) => {
    const x = ((e.clientX - rect.left) / rect.width) * canvasWidth - node.width / 2;
    const y = ((e.clientY - rect.top) / rect.height) * canvasHeight - node.height / 2;
    node.x = Math.max(0, Math.min(x, canvasWidth - node.width));
    node.y = Math.max(0, Math.min(y, canvasHeight - node.height));
  };
  
  const onUp = () => {
    draggingNode.value = null;
    window.removeEventListener('mousemove', onMove);
    window.removeEventListener('mouseup', onUp);
  };
  
  window.addEventListener('mousemove', onMove);
  window.addEventListener('mouseup', onUp);
}

function startConnection(node, pos) {
  connectingFrom.value = { node, pos };
  const point = getConnectionPoint(node, pos);
  tempConnection.value = { x1: point.x, y1: point.y, x2: point.x, y2: point.y };
}

function handleMouseMove(e) {
  if (tempConnection.value && connectingFrom.value) {
    const rect = canvasContainer.value.getBoundingClientRect();
    tempConnection.value.x2 = ((e.clientX - rect.left) / rect.width) * canvasWidth;
    tempConnection.value.y2 = ((e.clientY - rect.top) / rect.height) * canvasHeight;
  }
}

function getConnectionPoint(node, pos) {
  const points = {
    top: { x: node.x + node.width / 2, y: node.y },
    right: { x: node.x + node.width, y: node.y + node.height / 2 },
    bottom: { x: node.x + node.width / 2, y: node.y + node.height },
    left: { x: node.x, y: node.y + node.height / 2 }
  };
  return points[pos];
}

function getConnectionPath(conn) {
  const fromNode = nodes.value.find(n => n.id === conn.from);
  const toNode = nodes.value.find(n => n.id === conn.to);
  if (!fromNode || !toNode) return '';
  
  const from = getConnectionPoint(fromNode, conn.fromPos);
  const to = getConnectionPoint(toNode, conn.toPos);
  
  const midX = (from.x + to.x) / 2;
  const midY = (from.y + to.y) / 2;
  
  return `M ${from.x} ${from.y} Q ${midX} ${from.y} ${midX} ${midY} Q ${midX} ${to.y} ${to.x} ${to.y}`;
}

function getArrowPoints(conn) {
  const toNode = nodes.value.find(n => n.id === conn.to);
  if (!toNode) return '';
  
  const to = getConnectionPoint(toNode, conn.toPos);
  const size = 8;
  
  const arrows = {
    top: `${to.x},${to.y} ${to.x-size},${to.y-size*1.5} ${to.x+size},${to.y-size*1.5}`,
    bottom: `${to.x},${to.y} ${to.x-size},${to.y+size*1.5} ${to.x+size},${to.y+size*1.5}`,
    left: `${to.x},${to.y} ${to.x-size*1.5},${to.y-size} ${to.x-size*1.5},${to.y+size}`,
    right: `${to.x},${to.y} ${to.x+size*1.5},${to.y-size} ${to.x+size*1.5},${to.y+size}`
  };
  return arrows[conn.toPos] || arrows.top;
}

function getDiamondPoints(node) {
  const w = node.width, h = node.height;
  return `${w/2},0 ${w},${h/2} ${w/2},${h} 0,${h/2}`;
}

function getParallelogramPoints(node) {
  const w = node.width, h = node.height, offset = 15;
  return `${offset},0 ${w},0 ${w-offset},${h} 0,${h}`;
}

function deleteSelected() {
  if (selectedNode.value) {
    nodes.value = nodes.value.filter(n => n.id !== selectedNode.value);
    connections.value = connections.value.filter(c => c.from !== selectedNode.value && c.to !== selectedNode.value);
    selectedNode.value = null;
  }
  if (selectedConnection.value) {
    connections.value = connections.value.filter(c => c.id !== selectedConnection.value);
    selectedConnection.value = null;
  }
}

function clearCanvas() {
  nodes.value = [];
  connections.value = [];
  selectedNode.value = null;
  selectedConnection.value = null;
}

function exportSVG() {
  const svg = canvasContainer.value.querySelector('svg').outerHTML;
  const blob = new Blob([svg], { type: 'image/svg+xml' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'flowchart.svg';
  a.click();
}

function exportJSON() {
  const data = { nodes: nodes.value, connections: connections.value };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'flowchart.json';
  a.click();
}

function loadTemplate(type) {
  clearCanvas();
  
  if (type === 'basic') {
    nodes.value = [
      { id: 1, shape: 'terminal', label: 'Début', x: 540, y: 50, width: 120, height: 60, color: '#00ff88' },
      { id: 2, shape: 'process', label: 'Étape 1', x: 540, y: 180, width: 120, height: 60, color: '#3B82F6' },
      { id: 3, shape: 'process', label: 'Étape 2', x: 540, y: 310, width: 120, height: 60, color: '#3B82F6' },
      { id: 4, shape: 'terminal', label: 'Fin', x: 540, y: 440, width: 120, height: 60, color: '#EF4444' }
    ];
    connections.value = [
      { id: 1, from: 1, fromPos: 'bottom', to: 2, toPos: 'top' },
      { id: 2, from: 2, fromPos: 'bottom', to: 3, toPos: 'top' },
      { id: 3, from: 3, fromPos: 'bottom', to: 4, toPos: 'top' }
    ];
  } else if (type === 'decision') {
    nodes.value = [
      { id: 1, shape: 'terminal', label: 'Début', x: 540, y: 50, width: 120, height: 60, color: '#00ff88' },
      { id: 2, shape: 'decision', label: 'Condition?', x: 540, y: 180, width: 140, height: 80, color: '#F59E0B' },
      { id: 3, shape: 'process', label: 'Oui', x: 350, y: 320, width: 120, height: 60, color: '#10B981' },
      { id: 4, shape: 'process', label: 'Non', x: 730, y: 320, width: 120, height: 60, color: '#EF4444' },
      { id: 5, shape: 'terminal', label: 'Fin', x: 540, y: 450, width: 120, height: 60, color: '#8B5CF6' }
    ];
    connections.value = [
      { id: 1, from: 1, fromPos: 'bottom', to: 2, toPos: 'top' },
      { id: 2, from: 2, fromPos: 'left', to: 3, toPos: 'top' },
      { id: 3, from: 2, fromPos: 'right', to: 4, toPos: 'top' },
      { id: 4, from: 3, fromPos: 'bottom', to: 5, toPos: 'left' },
      { id: 5, from: 4, fromPos: 'bottom', to: 5, toPos: 'right' }
    ];
  } else if (type === 'process') {
    nodes.value = [
      { id: 1, shape: 'data', label: 'Input', x: 100, y: 200, width: 120, height: 60, color: '#3B82F6' },
      { id: 2, shape: 'process', label: 'Traitement', x: 350, y: 200, width: 140, height: 60, color: '#00ff88' },
      { id: 3, shape: 'decision', label: 'Valide?', x: 600, y: 190, width: 120, height: 80, color: '#F59E0B' },
      { id: 4, shape: 'document', label: 'Output', x: 850, y: 200, width: 120, height: 60, color: '#8B5CF6' },
      { id: 5, shape: 'process', label: 'Correction', x: 600, y: 350, width: 120, height: 60, color: '#EF4444' }
    ];
    connections.value = [
      { id: 1, from: 1, fromPos: 'right', to: 2, toPos: 'left' },
      { id: 2, from: 2, fromPos: 'right', to: 3, toPos: 'left' },
      { id: 3, from: 3, fromPos: 'right', to: 4, toPos: 'left' },
      { id: 4, from: 3, fromPos: 'bottom', to: 5, toPos: 'top' },
      { id: 5, from: 5, fromPos: 'left', to: 2, toPos: 'bottom' }
    ];
  }
  
  nodeIdCounter = Math.max(...nodes.value.map(n => n.id)) + 1;
  connIdCounter = Math.max(...connections.value.map(c => c.id)) + 1;
}
</script>

<style scoped>
.flowchart-app { min-height: 100vh; background: var(--bg-primary); }
.app-header { padding: 1rem 0; border-bottom: 1px solid var(--border); }
.back-link { color: var(--text-muted); text-decoration: none; }
.app-main { padding: 1rem 0; }
.container-fluid { max-width: 1600px; margin: 0 auto; padding: 0 1rem; }
.app-intro { text-align: center; margin-bottom: 1rem; }
.app-intro h1 { display: flex; justify-content: center; gap: 0.5rem; font-size: 1.75rem; margin-bottom: 0.25rem; }
.app-icon { font-size: 2rem; }
.app-intro p { color: var(--text-muted); font-size: 0.9rem; }

.builder-layout { display: grid; grid-template-columns: auto 1fr 280px; gap: 1rem; }

.toolbar { display: flex; flex-direction: column; gap: 1rem; padding: 1rem; background: rgba(255,255,255,0.02); border: 1px solid var(--border); border-radius: 0.5rem; }
.tool-group { display: flex; flex-direction: column; gap: 0.35rem; }
.group-label { font-size: 0.7rem; color: var(--text-muted); text-transform: uppercase; margin-bottom: 0.25rem; }
.tool-btn { width: 44px; height: 44px; display: flex; align-items: center; justify-content: center; background: rgba(0,0,0,0.2); border: 1px solid var(--border); border-radius: 0.35rem; font-size: 1.25rem; cursor: pointer; transition: all 0.2s; }
.tool-btn:hover { border-color: var(--primary); }
.tool-btn.active { background: var(--primary); border-color: var(--primary); }

.canvas-container { background: rgba(0,0,0,0.3); border: 1px solid var(--border); border-radius: 0.5rem; overflow: hidden; }
.flowchart-canvas { width: 100%; height: 600px; }

.node-group { cursor: move; }
.node-group.selected .node-shape { stroke: var(--primary); stroke-width: 3; }
.node-group.dragging { opacity: 0.8; }
.node-shape { fill: rgba(0,0,0,0.5); stroke: var(--primary); stroke-width: 2; }
.node-shape--document { rx: 0 0 10 10; }
.node-label { fill: var(--text-main); font-size: 14px; text-anchor: middle; dominant-baseline: middle; pointer-events: none; }

.connection-points { opacity: 0; transition: opacity 0.2s; }
.node-group:hover .connection-points, .node-group.selected .connection-points { opacity: 1; }
.conn-point { fill: var(--bg-primary); stroke: var(--primary); stroke-width: 2; cursor: crosshair; }
.conn-point:hover { fill: var(--primary); }

.connection-line { fill: none; stroke: var(--text-muted); stroke-width: 2; }
.connection-line.selected { stroke: var(--primary); stroke-width: 3; }
.connection-arrow { fill: var(--text-muted); }
.temp-connection { stroke: var(--primary); stroke-width: 2; stroke-dasharray: 5,5; }

.properties-panel { padding: 1rem; background: rgba(255,255,255,0.02); border: 1px solid var(--border); border-radius: 0.5rem; }
.properties-panel h3 { font-size: 1rem; margin-bottom: 1rem; }
.prop-form { display: flex; flex-direction: column; gap: 1rem; }
.prop-field label { display: block; font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.35rem; }
.prop-field input[type="text"], .prop-field input[type="number"] { width: 100%; padding: 0.5rem; background: rgba(0,0,0,0.3); border: 1px solid var(--border); border-radius: 0.35rem; color: var(--text-main); }
.color-options { display: flex; gap: 0.35rem; }
.color-btn { width: 28px; height: 28px; border: 2px solid transparent; border-radius: 0.25rem; cursor: pointer; }
.color-btn.active { border-color: white; }
.size-inputs { display: flex; align-items: center; gap: 0.5rem; }
.size-inputs input { width: 60px; }
.prop-empty { color: var(--text-muted); font-size: 0.85rem; text-align: center; padding: 1rem; }

.templates-section { margin-top: 1.5rem; padding-top: 1rem; border-top: 1px solid var(--border); }
.templates-section h4 { font-size: 0.9rem; margin-bottom: 0.75rem; }
.templates-section button { display: block; width: 100%; padding: 0.5rem; margin-bottom: 0.35rem; background: rgba(0,0,0,0.2); border: 1px solid var(--border); border-radius: 0.35rem; color: var(--text-muted); cursor: pointer; font-size: 0.85rem; text-align: left; }
.templates-section button:hover { border-color: var(--primary); color: var(--primary); }

@media (max-width: 1024px) {
  .builder-layout { grid-template-columns: 1fr; }
  .toolbar { flex-direction: row; flex-wrap: wrap; }
  .tool-group { flex-direction: row; }
}
</style>
