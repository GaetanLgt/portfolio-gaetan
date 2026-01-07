<template>
  <div class="pixel-art-editor">
    <!-- Header -->
    <div class="pae-header">
      <button class="pae-close" @click="$emit('close')">✕</button>
      <h2>🎨 PIXEL ART LAB</h2>
      <p class="pae-subtitle">Grille {{ gridSize }}×{{ gridSize }} · {{ currentPalette.name }}</p>
    </div>

    <!-- Main Content -->
    <div class="pae-content">
      <!-- Left: Toolbox -->
      <div class="pae-toolbox">
        <!-- Tools -->
        <div class="tool-section">
          <span class="section-title">OUTILS</span>
          <div class="tools-grid">
            <button 
              v-for="tool in tools" 
              :key="tool.id"
              class="tool-btn"
              :class="{ active: currentTool === tool.id }"
              :title="tool.name"
              @click="currentTool = tool.id"
            >
              {{ tool.icon }}
            </button>
          </div>
        </div>

        <!-- Color Palette -->
        <div class="tool-section">
          <span class="section-title">PALETTE</span>
          <div class="palette-grid">
            <button 
              v-for="(color, i) in currentPalette.colors" 
              :key="i"
              class="color-swatch"
              :class="{ active: currentColor === color }"
              :style="{ background: color }"
              @click="currentColor = color"
            />
          </div>
          <div class="current-color">
            <div class="color-preview" :style="{ background: currentColor }"></div>
            <span class="color-hex">{{ currentColor }}</span>
          </div>
        </div>

        <!-- Palette Selector -->
        <div class="tool-section">
          <span class="section-title">THÈMES</span>
          <div class="palette-selector">
            <button 
              v-for="palette in palettes" 
              :key="palette.id"
              class="palette-btn"
              :class="{ active: currentPalette.id === palette.id }"
              @click="currentPalette = palette"
            >
              <div class="palette-preview">
                <span 
                  v-for="(c, i) in palette.colors.slice(0, 4)" 
                  :key="i"
                  :style="{ background: c }"
                />
              </div>
              <span class="palette-name">{{ palette.name }}</span>
            </button>
          </div>
        </div>

        <!-- Actions -->
        <div class="tool-section">
          <span class="section-title">ACTIONS</span>
          <div class="actions-grid">
            <button class="action-btn" @click="clearCanvas">🗑️ Clear</button>
            <button class="action-btn" @click="undo" :disabled="historyIndex <= 0">↩️ Undo</button>
            <button class="action-btn" @click="exportPNG">💾 Export</button>
            <button class="action-btn" @click="fillCanvas">🪣 Fill</button>
          </div>
        </div>
      </div>

      <!-- Center: Canvas -->
      <div class="pae-canvas-wrapper">
        <div 
          class="pae-canvas"
          :style="{ 
            gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
            gridTemplateRows: `repeat(${gridSize}, 1fr)`
          }"
          @mousedown="startDrawing"
          @mouseup="stopDrawing"
          @mouseleave="stopDrawing"
        >
          <div 
            v-for="(color, i) in pixels" 
            :key="i"
            class="pixel"
            :style="{ background: color }"
            @mouseenter="draw(i)"
            @mousedown="draw(i)"
          />
        </div>
        
        <!-- Grid Toggle -->
        <label class="grid-toggle">
          <input type="checkbox" v-model="showGrid" />
          <span>Afficher grille</span>
        </label>
      </div>

      <!-- Right: Preview -->
      <div class="pae-preview">
        <div class="preview-section">
          <span class="section-title">APERÇU</span>
          <div class="preview-sizes">
            <div class="preview-box preview-1x">
              <canvas ref="preview1x" :width="gridSize" :height="gridSize"></canvas>
              <span>1×</span>
            </div>
            <div class="preview-box preview-2x">
              <canvas ref="preview2x" :width="gridSize * 2" :height="gridSize * 2"></canvas>
              <span>2×</span>
            </div>
            <div class="preview-box preview-4x">
              <canvas ref="preview4x" :width="gridSize * 4" :height="gridSize * 4"></canvas>
              <span>4×</span>
            </div>
          </div>
        </div>

        <!-- Templates -->
        <div class="preview-section">
          <span class="section-title">TEMPLATES</span>
          <div class="templates-grid">
            <button 
              v-for="template in templates" 
              :key="template.id"
              class="template-btn"
              @click="loadTemplate(template)"
            >
              <span class="template-icon">{{ template.icon }}</span>
              <span class="template-name">{{ template.name }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted, nextTick } from 'vue';

defineEmits(['close']);

// Grid configuration
const gridSize = 32;
const pixels = ref(Array(gridSize * gridSize).fill('#000000'));

// History for undo
const history = ref([]);
const historyIndex = ref(-1);

// Drawing state
const isDrawing = ref(false);
const currentColor = ref('#00ff00');
const currentTool = ref('pencil');
const showGrid = ref(true);

// Tools
const tools = [
  { id: 'pencil', name: 'Crayon', icon: '✏️' },
  { id: 'eraser', name: 'Gomme', icon: '🧹' },
  { id: 'fill', name: 'Remplissage', icon: '🪣' },
  { id: 'picker', name: 'Pipette', icon: '💉' }
];

// Palettes
const palettes = [
  {
    id: 'matrix',
    name: 'Matrix',
    colors: ['#000000', '#001100', '#003300', '#005500', '#007700', '#009900', '#00bb00', '#00dd00', '#00ff00', '#33ff33', '#66ff66', '#99ff99', '#ccffcc', '#ffffff']
  },
  {
    id: 'retro',
    name: 'Retro 8-bit',
    colors: ['#000000', '#1D2B53', '#7E2553', '#008751', '#AB5236', '#5F574F', '#C2C3C7', '#FFF1E8', '#FF004D', '#FFA300', '#FFEC27', '#00E436', '#29ADFF', '#83769C', '#FF77A8', '#FFCCAA']
  },
  {
    id: 'cyberpunk',
    name: 'Cyberpunk',
    colors: ['#0a0a0a', '#1a1a2e', '#16213e', '#0f3460', '#e94560', '#ff6b6b', '#feca57', '#00d2d3', '#54a0ff', '#5f27cd', '#ff9ff3', '#ffffff']
  },
  {
    id: 'neon',
    name: 'Neon',
    colors: ['#000000', '#0d0221', '#0f084b', '#26408b', '#ff00ff', '#00ffff', '#ff0080', '#80ff00', '#ffff00', '#ff8000', '#ffffff']
  },
  {
    id: 'grayscale',
    name: 'Grayscale',
    colors: ['#000000', '#111111', '#222222', '#333333', '#444444', '#555555', '#666666', '#777777', '#888888', '#999999', '#aaaaaa', '#bbbbbb', '#cccccc', '#dddddd', '#eeeeee', '#ffffff']
  },
  {
    id: 'pokemon',
    name: 'Pokémon',
    colors: ['#000000', '#ffffff', '#ffcb05', '#f5d742', '#cc9900', '#996600', '#ff0000', '#cc0000', '#4a4a4a', '#808080', '#c0c0c0', '#2a75bb', '#ff6699', '#00aa00']
  },
  {
    id: 'marvel',
    name: 'Marvel',
    colors: ['#000000', '#ffffff', '#ed1d24', '#b11313', '#8b0000', '#0476f2', '#003366', '#ffd700', '#c0c0c0', '#808080', '#4a4a4a', '#8b4513', '#2e8b57', '#ff6600']
  },
  {
    id: 'nintendo',
    name: 'Nintendo',
    colors: ['#000000', '#ffffff', '#e60012', '#0058a0', '#009e60', '#f8d210', '#ff8c00', '#00bfff', '#ffc0cb', '#8b4513', '#228b22', '#9932cc', '#87ceeb', '#ffd700']
  },
  {
    id: 'skin',
    name: 'Skin Tones',
    colors: ['#000000', '#ffffff', '#8d5524', '#c68642', '#e0ac69', '#f1c27d', '#ffdbac', '#ffe4c4', '#ffd5b4', '#d2691e', '#a0522d', '#6b4423', '#4a3728', '#2d1f14']
  }
];

const currentPalette = ref(palettes[0]);

// Templates
const templates = [
  { id: 'heart', name: 'Cœur', icon: '❤️' },
  { id: 'skull', name: 'Crâne', icon: '💀' },
  { id: 'robot', name: 'Robot', icon: '🤖' },
  { id: 'ghost', name: 'Fantôme', icon: '👻' },
  { id: 'pikachu', name: 'Pikachu', icon: '⚡' },
  { id: 'deadpool', name: 'Deadpool', icon: '🔴' },
  { id: 'mushroom', name: 'Champi', icon: '🍄' },
  { id: 'sword', name: 'Épée', icon: '⚔️' },
  { id: 'star', name: 'Étoile', icon: '⭐' },
  { id: 'invader', name: 'Invader', icon: '👾' },
  { id: 'bluehouse', name: 'Maison', icon: '🏠' },
  { id: 'tree', name: 'Arbre', icon: '🌳' }
];

// Canvas refs
const preview1x = ref(null);
const preview2x = ref(null);
const preview4x = ref(null);

// Save state
function saveState() {
  // Remove future states if we've undone
  history.value = history.value.slice(0, historyIndex.value + 1);
  history.value.push([...pixels.value]);
  historyIndex.value = history.value.length - 1;
  
  // Limit history size
  if (history.value.length > 50) {
    history.value.shift();
    historyIndex.value--;
  }
}

// Drawing functions
function startDrawing() {
  isDrawing.value = true;
}

function stopDrawing() {
  if (isDrawing.value) {
    saveState();
  }
  isDrawing.value = false;
}

function draw(index) {
  if (!isDrawing.value && event.type !== 'mousedown') return;
  
  switch (currentTool.value) {
    case 'pencil':
      pixels.value[index] = currentColor.value;
      break;
    case 'eraser':
      pixels.value[index] = '#000000';
      break;
    case 'picker':
      currentColor.value = pixels.value[index];
      break;
    case 'fill':
      floodFill(index, pixels.value[index], currentColor.value);
      break;
  }
  
  updatePreviews();
}

// Flood fill algorithm
function floodFill(index, targetColor, fillColor) {
  if (targetColor === fillColor) return;
  if (pixels.value[index] !== targetColor) return;
  
  const stack = [index];
  const visited = new Set();
  
  while (stack.length > 0) {
    const current = stack.pop();
    if (visited.has(current)) continue;
    if (current < 0 || current >= pixels.value.length) continue;
    if (pixels.value[current] !== targetColor) continue;
    
    visited.add(current);
    pixels.value[current] = fillColor;
    
    const x = current % gridSize;
    const y = Math.floor(current / gridSize);
    
    if (x > 0) stack.push(current - 1);
    if (x < gridSize - 1) stack.push(current + 1);
    if (y > 0) stack.push(current - gridSize);
    if (y < gridSize - 1) stack.push(current + gridSize);
  }
}

// Actions
function clearCanvas() {
  pixels.value = Array(gridSize * gridSize).fill('#000000');
  saveState();
  updatePreviews();
}

function fillCanvas() {
  pixels.value = Array(gridSize * gridSize).fill(currentColor.value);
  saveState();
  updatePreviews();
}

function undo() {
  if (historyIndex.value > 0) {
    historyIndex.value--;
    pixels.value = [...history.value[historyIndex.value]];
    updatePreviews();
  }
}

// Update preview canvases
function updatePreviews() {
  nextTick(() => {
    [
      { ref: preview1x.value, scale: 1 },
      { ref: preview2x.value, scale: 2 },
      { ref: preview4x.value, scale: 4 }
    ].forEach(({ ref: canvas, scale }) => {
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      ctx.imageSmoothingEnabled = false;
      
      for (let y = 0; y < gridSize; y++) {
        for (let x = 0; x < gridSize; x++) {
          ctx.fillStyle = pixels.value[y * gridSize + x];
          ctx.fillRect(x * scale, y * scale, scale, scale);
        }
      }
    });
  });
}

// Export as PNG
function exportPNG() {
  const canvas = document.createElement('canvas');
  canvas.width = gridSize * 8;
  canvas.height = gridSize * 8;
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = false;
  
  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      ctx.fillStyle = pixels.value[y * gridSize + x];
      ctx.fillRect(x * 8, y * 8, 8, 8);
    }
  }
  
  const link = document.createElement('a');
  link.download = `pixel-art-${Date.now()}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
}

// Load template
function loadTemplate(template) {
  const templateData = {
    heart: createHeartTemplate(),
    skull: createSkullTemplate(),
    robot: createRobotTemplate(),
    ghost: createGhostTemplate(),
    pikachu: createPikachuTemplate(),
    deadpool: createDeadpoolTemplate(),
    mushroom: createMushroomTemplate(),
    sword: createSwordTemplate(),
    star: createStarTemplate(),
    invader: createInvaderTemplate(),
    bluehouse: createBlueHouseTemplate(),
    tree: createTreeTemplate()
  };
  
  if (templateData[template.id]) {
    pixels.value = templateData[template.id];
    saveState();
    updatePreviews();
  }
}

// Template generators
function createHeartTemplate() {
  const arr = Array(gridSize * gridSize).fill('#000000');
  const heart = [
    [12,10], [13,10], [14,10], [17,10], [18,10], [19,10],
    [11,11], [12,11], [13,11], [14,11], [15,11], [16,11], [17,11], [18,11], [19,11], [20,11],
    [10,12], [11,12], [12,12], [13,12], [14,12], [15,12], [16,12], [17,12], [18,12], [19,12], [20,12], [21,12],
    [10,13], [11,13], [12,13], [13,13], [14,13], [15,13], [16,13], [17,13], [18,13], [19,13], [20,13], [21,13],
    [11,14], [12,14], [13,14], [14,14], [15,14], [16,14], [17,14], [18,14], [19,14], [20,14],
    [12,15], [13,15], [14,15], [15,15], [16,15], [17,15], [18,15], [19,15],
    [13,16], [14,16], [15,16], [16,16], [17,16], [18,16],
    [14,17], [15,17], [16,17], [17,17],
    [15,18], [16,18]
  ];
  heart.forEach(([x, y]) => {
    arr[y * gridSize + x] = '#ff0044';
  });
  return arr;
}

function createSkullTemplate() {
  const arr = Array(gridSize * gridSize).fill('#000000');
  const skull = [
    [12,8], [13,8], [14,8], [15,8], [16,8], [17,8], [18,8], [19,8],
    [11,9], [20,9],
    [10,10], [12,10], [13,10], [18,10], [19,10], [21,10],
    [10,11], [12,11], [13,11], [18,11], [19,11], [21,11],
    [10,12], [21,12],
    [10,13], [21,13],
    [11,14], [14,14], [15,14], [16,14], [17,14], [20,14],
    [12,15], [13,15], [18,15], [19,15],
    [13,16], [15,16], [16,16], [18,16],
    [14,17], [15,17], [16,17], [17,17]
  ];
  skull.forEach(([x, y]) => {
    arr[y * gridSize + x] = '#ffffff';
  });
  return arr;
}

function createRobotTemplate() {
  const arr = Array(gridSize * gridSize).fill('#000000');
  // Head
  for (let x = 12; x <= 19; x++) {
    for (let y = 6; y <= 13; y++) {
      arr[y * gridSize + x] = '#00ff00';
    }
  }
  // Eyes
  arr[8 * gridSize + 14] = '#ff0000';
  arr[8 * gridSize + 17] = '#ff0000';
  // Body
  for (let x = 11; x <= 20; x++) {
    for (let y = 15; y <= 23; y++) {
      arr[y * gridSize + x] = '#00aa00';
    }
  }
  // Antenna
  arr[5 * gridSize + 15] = '#ffff00';
  arr[5 * gridSize + 16] = '#ffff00';
  return arr;
}

function createGhostTemplate() {
  const arr = Array(gridSize * gridSize).fill('#000000');
  // Body
  for (let x = 11; x <= 20; x++) {
    for (let y = 8; y <= 20; y++) {
      arr[y * gridSize + x] = '#ffffff';
    }
  }
  // Eyes
  arr[11 * gridSize + 13] = '#000000';
  arr[11 * gridSize + 14] = '#000000';
  arr[12 * gridSize + 13] = '#000000';
  arr[12 * gridSize + 14] = '#000000';
  arr[11 * gridSize + 17] = '#000000';
  arr[11 * gridSize + 18] = '#000000';
  arr[12 * gridSize + 17] = '#000000';
  arr[12 * gridSize + 18] = '#000000';
  // Bottom waves
  arr[21 * gridSize + 12] = '#000000';
  arr[21 * gridSize + 15] = '#000000';
  arr[21 * gridSize + 18] = '#000000';
  return arr;
}

function createPikachuTemplate() {
  const arr = Array(gridSize * gridSize).fill('#000000');
  const yellow = '#ffcb05';
  const darkYellow = '#cc9900';
  const red = '#ff0000';
  const black = '#000000';
  const white = '#ffffff';
  
  // Ears (left)
  [[10,4],[11,4],[10,5],[11,5],[12,5],[11,6],[12,6],[13,6]].forEach(([x,y]) => arr[y*gridSize+x] = black);
  [[11,5],[12,6]].forEach(([x,y]) => arr[y*gridSize+x] = yellow);
  
  // Ears (right)
  [[20,4],[21,4],[19,5],[20,5],[21,5],[18,6],[19,6],[20,6]].forEach(([x,y]) => arr[y*gridSize+x] = black);
  [[20,5],[19,6]].forEach(([x,y]) => arr[y*gridSize+x] = yellow);
  
  // Head
  for(let x = 12; x <= 19; x++) {
    for(let y = 7; y <= 14; y++) {
      arr[y*gridSize+x] = yellow;
    }
  }
  // Face outline
  [[11,8],[11,9],[11,10],[11,11],[11,12],[12,13],[13,14],[18,14],[19,13],[20,12],[20,11],[20,10],[20,9],[20,8]].forEach(([x,y]) => arr[y*gridSize+x] = yellow);
  
  // Eyes
  arr[9*gridSize+14] = black; arr[9*gridSize+17] = black;
  arr[10*gridSize+14] = black; arr[10*gridSize+17] = black;
  arr[9*gridSize+15] = white; arr[9*gridSize+18] = white;
  
  // Cheeks
  arr[11*gridSize+12] = red; arr[12*gridSize+12] = red;
  arr[11*gridSize+19] = red; arr[12*gridSize+19] = red;
  
  // Nose
  arr[11*gridSize+16] = darkYellow;
  
  // Body
  for(let x = 13; x <= 18; x++) {
    for(let y = 15; y <= 22; y++) {
      arr[y*gridSize+x] = yellow;
    }
  }
  [[12,16],[12,17],[12,18],[12,19],[19,16],[19,17],[19,18],[19,19]].forEach(([x,y]) => arr[y*gridSize+x] = yellow);
  
  // Tail
  [[20,15],[21,14],[22,13],[23,12],[24,11],[24,12],[23,13]].forEach(([x,y]) => arr[y*gridSize+x] = yellow);
  [[21,13],[22,12]].forEach(([x,y]) => arr[y*gridSize+x] = darkYellow);
  
  return arr;
}

function createDeadpoolTemplate() {
  const arr = Array(gridSize * gridSize).fill('#000000');
  const red = '#ed1d24';
  const darkRed = '#b11313';
  const black = '#000000';
  const white = '#ffffff';
  const gray = '#808080';
  const brown = '#8b4513';
  
  // Head
  for(let x = 12; x <= 19; x++) {
    for(let y = 5; y <= 12; y++) {
      arr[y*gridSize+x] = red;
    }
  }
  [[11,6],[11,7],[11,8],[11,9],[11,10],[11,11],[20,6],[20,7],[20,8],[20,9],[20,10],[20,11]].forEach(([x,y]) => arr[y*gridSize+x] = red);
  
  // Black mask pattern
  [[12,6],[13,6],[14,6],[17,6],[18,6],[19,6]].forEach(([x,y]) => arr[y*gridSize+x] = black);
  [[12,7],[13,7],[14,7],[17,7],[18,7],[19,7]].forEach(([x,y]) => arr[y*gridSize+x] = black);
  
  // Eyes (white)
  arr[8*gridSize+13] = white; arr[8*gridSize+14] = white;
  arr[8*gridSize+17] = white; arr[8*gridSize+18] = white;
  arr[9*gridSize+14] = white; arr[9*gridSize+17] = white;
  
  // Body
  for(let x = 11; x <= 20; x++) {
    for(let y = 13; y <= 24; y++) {
      arr[y*gridSize+x] = red;
    }
  }
  
  // Belt
  for(let x = 11; x <= 20; x++) {
    arr[18*gridSize+x] = brown;
  }
  arr[18*gridSize+15] = gray; arr[18*gridSize+16] = gray;
  
  // Legs separation
  arr[22*gridSize+15] = black; arr[23*gridSize+15] = black; arr[24*gridSize+15] = black;
  arr[22*gridSize+16] = black; arr[23*gridSize+16] = black; arr[24*gridSize+16] = black;
  
  // Swords on back
  arr[10*gridSize+9] = gray; arr[9*gridSize+9] = gray; arr[8*gridSize+9] = gray; arr[7*gridSize+9] = gray;
  arr[10*gridSize+22] = gray; arr[9*gridSize+22] = gray; arr[8*gridSize+22] = gray; arr[7*gridSize+22] = gray;
  
  return arr;
}

function createMushroomTemplate() {
  const arr = Array(gridSize * gridSize).fill('#000000');
  const red = '#ff0000';
  const white = '#ffffff';
  const beige = '#ffe4c4';
  
  // Cap
  for(let x = 10; x <= 21; x++) {
    for(let y = 6; y <= 13; y++) {
      arr[y*gridSize+x] = red;
    }
  }
  [[11,5],[12,5],[13,5],[14,5],[17,5],[18,5],[19,5],[20,5]].forEach(([x,y]) => arr[y*gridSize+x] = red);
  
  // White spots
  [[12,7],[13,7],[12,8],[13,8]].forEach(([x,y]) => arr[y*gridSize+x] = white);
  [[18,7],[19,7],[18,8],[19,8]].forEach(([x,y]) => arr[y*gridSize+x] = white);
  [[15,10],[16,10],[15,11],[16,11]].forEach(([x,y]) => arr[y*gridSize+x] = white);
  
  // Stem
  for(let x = 13; x <= 18; x++) {
    for(let y = 14; y <= 22; y++) {
      arr[y*gridSize+x] = beige;
    }
  }
  [[12,15],[12,16],[12,17],[19,15],[19,16],[19,17]].forEach(([x,y]) => arr[y*gridSize+x] = beige);
  
  // Eyes
  arr[16*gridSize+14] = '#000000'; arr[16*gridSize+17] = '#000000';
  
  return arr;
}

function createSwordTemplate() {
  const arr = Array(gridSize * gridSize).fill('#000000');
  const silver = '#c0c0c0';
  const darkSilver = '#808080';
  const gold = '#ffd700';
  const brown = '#8b4513';
  
  // Blade
  for(let y = 4; y <= 18; y++) {
    arr[y*gridSize+15] = silver;
    arr[y*gridSize+16] = silver;
  }
  arr[4*gridSize+15] = darkSilver;
  arr[4*gridSize+16] = darkSilver;
  
  // Edge highlights
  for(let y = 5; y <= 17; y++) {
    arr[y*gridSize+14] = darkSilver;
    arr[y*gridSize+17] = darkSilver;
  }
  
  // Crossguard
  for(let x = 11; x <= 20; x++) {
    arr[19*gridSize+x] = gold;
    arr[20*gridSize+x] = gold;
  }
  
  // Handle
  for(let y = 21; y <= 26; y++) {
    arr[y*gridSize+15] = brown;
    arr[y*gridSize+16] = brown;
  }
  
  // Pommel
  arr[27*gridSize+15] = gold;
  arr[27*gridSize+16] = gold;
  
  return arr;
}

function createStarTemplate() {
  const arr = Array(gridSize * gridSize).fill('#000000');
  const yellow = '#ffd700';
  const lightYellow = '#ffec27';
  
  // Star shape
  const starPixels = [
    [15,4],[16,4],
    [15,5],[16,5],
    [14,6],[15,6],[16,6],[17,6],
    [13,7],[14,7],[15,7],[16,7],[17,7],[18,7],
    [12,8],[13,8],[14,8],[15,8],[16,8],[17,8],[18,8],[19,8],
    [8,9],[9,9],[10,9],[11,9],[12,9],[13,9],[14,9],[15,9],[16,9],[17,9],[18,9],[19,9],[20,9],[21,9],[22,9],[23,9],
    [9,10],[10,10],[11,10],[12,10],[13,10],[14,10],[15,10],[16,10],[17,10],[18,10],[19,10],[20,10],[21,10],[22,10],
    [10,11],[11,11],[12,11],[13,11],[14,11],[15,11],[16,11],[17,11],[18,11],[19,11],[20,11],[21,11],
    [11,12],[12,12],[13,12],[14,12],[15,12],[16,12],[17,12],[18,12],[19,12],[20,12],
    [12,13],[13,13],[14,13],[15,13],[16,13],[17,13],[18,13],[19,13],
    [12,14],[13,14],[14,14],[15,14],[16,14],[17,14],[18,14],[19,14],
    [11,15],[12,15],[13,15],[14,15],[17,15],[18,15],[19,15],[20,15],
    [10,16],[11,16],[12,16],[13,16],[18,16],[19,16],[20,16],[21,16],
    [9,17],[10,17],[11,17],[12,17],[19,17],[20,17],[21,17],[22,17],
    [8,18],[9,18],[10,18],[11,18],[20,18],[21,18],[22,18],[23,18]
  ];
  
  starPixels.forEach(([x,y]) => arr[y*gridSize+x] = yellow);
  
  // Inner highlight
  [[15,8],[16,8],[14,9],[15,9],[16,9],[17,9],[15,10],[16,10]].forEach(([x,y]) => arr[y*gridSize+x] = lightYellow);
  
  return arr;
}

function createInvaderTemplate() {
  const arr = Array(gridSize * gridSize).fill('#000000');
  const green = '#00ff00';
  
  // Classic Space Invader shape
  const invader = [
    [13,6],[18,6],
    [14,7],[17,7],
    [13,8],[14,8],[15,8],[16,8],[17,8],[18,8],
    [12,9],[13,9],[15,9],[16,9],[18,9],[19,9],
    [11,10],[12,10],[13,10],[14,10],[15,10],[16,10],[17,10],[18,10],[19,10],[20,10],
    [11,11],[12,11],[14,11],[15,11],[16,11],[17,11],[19,11],[20,11],
    [11,12],[12,12],[14,12],[15,12],[16,12],[17,12],[19,12],[20,12],
    [11,13],[12,13],[13,13],[14,13],[15,13],[16,13],[17,13],[18,13],[19,13],[20,13],
    [11,14],[12,14],[13,14],[18,14],[19,14],[20,14],
    [12,15],[13,15],[18,15],[19,15],
    [11,16],[14,16],[17,16],[20,16],
    [10,17],[11,17],[14,17],[15,17],[16,17],[17,17],[20,17],[21,17]
  ];
  
  invader.forEach(([x,y]) => arr[y*gridSize+x] = green);
  
  return arr;
}

function createBlueHouseTemplate() {
  const arr = Array(gridSize * gridSize).fill('#000000');
  const blue = '#2a5298';
  const darkBlue = '#1a3a6e';
  const brown = '#8b4513';
  const darkBrown = '#5c2e0a';
  const yellow = '#ffd700';
  const warmLight = '#ffaa44';
  const gray = '#808080';
  const lightGray = '#c0c0c0';
  const green = '#228b22';
  const lightGreen = '#90EE90';
  
  // Stairs
  for(let x = 8; x <= 23; x++) {
    arr[29*gridSize+x] = gray;
    arr[30*gridSize+x] = lightGray;
  }
  for(let x = 9; x <= 22; x++) {
    arr[28*gridSize+x] = gray;
  }
  
  // Main building - blue facade
  for(let x = 10; x <= 21; x++) {
    for(let y = 10; y <= 27; y++) {
      arr[y*gridSize+x] = blue;
    }
  }
  
  // Darker blue accents
  for(let y = 10; y <= 27; y++) {
    arr[y*gridSize+10] = darkBlue;
    arr[y*gridSize+21] = darkBlue;
  }
  
  // Main door (arch)
  for(let x = 14; x <= 17; x++) {
    for(let y = 22; y <= 27; y++) {
      arr[y*gridSize+x] = darkBrown;
    }
  }
  // Door arch top
  arr[21*gridSize+14] = darkBrown; arr[21*gridSize+17] = darkBrown;
  arr[20*gridSize+15] = darkBrown; arr[20*gridSize+16] = darkBrown;
  // Door light
  arr[23*gridSize+15] = warmLight; arr[23*gridSize+16] = warmLight;
  arr[24*gridSize+15] = warmLight; arr[24*gridSize+16] = warmLight;
  arr[25*gridSize+15] = yellow; arr[25*gridSize+16] = yellow;
  
  // Upper window (arch)
  arr[12*gridSize+14] = brown; arr[12*gridSize+15] = brown; arr[12*gridSize+16] = brown; arr[12*gridSize+17] = brown;
  arr[13*gridSize+14] = warmLight; arr[13*gridSize+15] = warmLight; arr[13*gridSize+16] = warmLight; arr[13*gridSize+17] = warmLight;
  arr[14*gridSize+14] = warmLight; arr[14*gridSize+15] = yellow; arr[14*gridSize+16] = yellow; arr[14*gridSize+17] = warmLight;
  arr[15*gridSize+14] = brown; arr[15*gridSize+15] = brown; arr[15*gridSize+16] = brown; arr[15*gridSize+17] = brown;
  arr[11*gridSize+15] = brown; arr[11*gridSize+16] = brown;
  
  // Side window left
  arr[17*gridSize+11] = brown; arr[17*gridSize+12] = warmLight; arr[17*gridSize+13] = brown;
  arr[18*gridSize+11] = brown; arr[18*gridSize+12] = yellow; arr[18*gridSize+13] = brown;
  arr[19*gridSize+11] = brown; arr[19*gridSize+12] = warmLight; arr[19*gridSize+13] = brown;
  
  // Side window right  
  arr[17*gridSize+18] = brown; arr[17*gridSize+19] = warmLight; arr[17*gridSize+20] = brown;
  arr[18*gridSize+18] = brown; arr[18*gridSize+19] = yellow; arr[18*gridSize+20] = brown;
  arr[19*gridSize+18] = brown; arr[19*gridSize+19] = warmLight; arr[19*gridSize+20] = brown;
  
  // Balcony
  arr[16*gridSize+11] = gray; arr[16*gridSize+12] = gray; arr[16*gridSize+13] = gray;
  
  // Tree trunk (left side)
  for(let y = 12; y <= 28; y++) {
    arr[y*gridSize+6] = darkBrown;
    arr[y*gridSize+7] = brown;
  }
  arr[11*gridSize+7] = brown;
  arr[10*gridSize+8] = brown;
  
  // Tree foliage
  const foliage = [
    [3,3],[4,3],[5,3],[6,3],[7,3],[8,3],[9,3],[10,3],
    [2,4],[3,4],[4,4],[5,4],[6,4],[7,4],[8,4],[9,4],[10,4],[11,4],
    [2,5],[3,5],[4,5],[5,5],[6,5],[7,5],[8,5],[9,5],[10,5],[11,5],[12,5],
    [3,6],[4,6],[5,6],[6,6],[7,6],[8,6],[9,6],[10,6],[11,6],[12,6],
    [4,7],[5,7],[6,7],[7,7],[8,7],[9,7],[10,7],[11,7],
    [5,8],[6,8],[7,8],[8,8],[9,8],[10,8],
    [6,9],[7,9],[8,9],[9,9]
  ];
  foliage.forEach(([x,y]) => {
    arr[y*gridSize+x] = Math.random() > 0.3 ? green : lightGreen;
  });
  
  // Lanterns
  arr[22*gridSize+12] = yellow;
  arr[22*gridSize+19] = yellow;
  
  // Plants on stairs
  arr[27*gridSize+9] = green;
  arr[27*gridSize+22] = green;
  
  return arr;
}

function createTreeTemplate() {
  const arr = Array(gridSize * gridSize).fill('#000000');
  const brown = '#8b4513';
  const darkBrown = '#5c2e0a';
  const green = '#228b22';
  const lightGreen = '#90EE90';
  const darkGreen = '#006400';
  
  // Trunk
  for(let y = 16; y <= 28; y++) {
    arr[y*gridSize+15] = darkBrown;
    arr[y*gridSize+16] = brown;
  }
  // Trunk details
  arr[18*gridSize+14] = darkBrown;
  arr[20*gridSize+17] = darkBrown;
  arr[22*gridSize+14] = darkBrown;
  arr[25*gridSize+17] = darkBrown;
  
  // Roots
  arr[28*gridSize+13] = darkBrown;
  arr[28*gridSize+14] = darkBrown;
  arr[29*gridSize+12] = darkBrown;
  arr[28*gridSize+17] = darkBrown;
  arr[28*gridSize+18] = darkBrown;
  arr[29*gridSize+19] = darkBrown;
  
  // Branches
  arr[16*gridSize+14] = brown;
  arr[15*gridSize+13] = brown;
  arr[14*gridSize+12] = brown;
  arr[16*gridSize+17] = brown;
  arr[15*gridSize+18] = brown;
  arr[14*gridSize+19] = brown;
  
  // Foliage - layered circles
  const foliage = [
    // Top layer
    [14,4],[15,4],[16,4],[17,4],
    [13,5],[14,5],[15,5],[16,5],[17,5],[18,5],
    [12,6],[13,6],[14,6],[15,6],[16,6],[17,6],[18,6],[19,6],
    [11,7],[12,7],[13,7],[14,7],[15,7],[16,7],[17,7],[18,7],[19,7],[20,7],
    [10,8],[11,8],[12,8],[13,8],[14,8],[15,8],[16,8],[17,8],[18,8],[19,8],[20,8],[21,8],
    [9,9],[10,9],[11,9],[12,9],[13,9],[14,9],[15,9],[16,9],[17,9],[18,9],[19,9],[20,9],[21,9],[22,9],
    [9,10],[10,10],[11,10],[12,10],[13,10],[14,10],[15,10],[16,10],[17,10],[18,10],[19,10],[20,10],[21,10],[22,10],
    [8,11],[9,11],[10,11],[11,11],[12,11],[13,11],[14,11],[15,11],[16,11],[17,11],[18,11],[19,11],[20,11],[21,11],[22,11],[23,11],
    [8,12],[9,12],[10,12],[11,12],[12,12],[13,12],[14,12],[17,12],[18,12],[19,12],[20,12],[21,12],[22,12],[23,12],
    [9,13],[10,13],[11,13],[12,13],[13,13],[18,13],[19,13],[20,13],[21,13],[22,13],
    [10,14],[11,14],[12,14],[19,14],[20,14],[21,14],
    [11,15],[12,15],[19,15],[20,15]
  ];
  
  foliage.forEach(([x,y]) => {
    const rand = Math.random();
    if (rand > 0.6) arr[y*gridSize+x] = lightGreen;
    else if (rand > 0.2) arr[y*gridSize+x] = green;
    else arr[y*gridSize+x] = darkGreen;
  });
  
  return arr;
}

// Initialize
onMounted(() => {
  saveState();
  updatePreviews();
});

// Watch for pixel changes
watch(pixels, updatePreviews, { deep: true });
</script>

<style scoped>
.pixel-art-editor {
  position: fixed;
  inset: 2%;
  background: rgba(0, 0, 0, 0.98);
  border: 1px solid rgba(0, 255, 0, 0.3);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  z-index: 1000;
}

/* Header */
.pae-header {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid rgba(0, 255, 0, 0.2);
  position: relative;
}

.pae-close {
  position: absolute;
  top: 0.75rem;
  right: 1rem;
  background: none;
  border: 1px solid rgba(0, 255, 0, 0.3);
  color: #00ff00;
  width: 28px;
  height: 28px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
}

.pae-header h2 {
  font-family: 'JetBrains Mono', monospace;
  font-size: 1.1rem;
  color: #00ff00;
  margin: 0;
}

.pae-subtitle {
  font-size: 0.75rem;
  color: rgba(0, 255, 0, 0.6);
  margin: 0.25rem 0 0;
}

/* Content Layout */
.pae-content {
  flex: 1;
  display: grid;
  grid-template-columns: 200px 1fr 180px;
  gap: 1rem;
  padding: 1rem;
  overflow: hidden;
}

/* Toolbox */
.pae-toolbox {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  overflow-y: auto;
}

.tool-section {
  background: rgba(0, 255, 0, 0.03);
  border: 1px solid rgba(0, 255, 0, 0.1);
  border-radius: 6px;
  padding: 0.75rem;
}

.section-title {
  display: block;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.6rem;
  color: rgba(0, 255, 0, 0.5);
  margin-bottom: 0.5rem;
  letter-spacing: 0.1em;
}

.tools-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.25rem;
}

.tool-btn {
  aspect-ratio: 1;
  background: rgba(0, 255, 0, 0.05);
  border: 1px solid rgba(0, 255, 0, 0.2);
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.2s;
}

.tool-btn:hover {
  background: rgba(0, 255, 0, 0.1);
}

.tool-btn.active {
  background: rgba(0, 255, 0, 0.2);
  border-color: #00ff00;
  box-shadow: 0 0 10px rgba(0, 255, 0, 0.3);
}

/* Palette */
.palette-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 3px;
}

.color-swatch {
  aspect-ratio: 1;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  cursor: pointer;
  transition: transform 0.1s;
}

.color-swatch:hover {
  transform: scale(1.15);
  z-index: 1;
}

.color-swatch.active {
  border: 2px solid #fff;
  box-shadow: 0 0 8px rgba(255, 255, 255, 0.5);
}

.current-color {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.5rem;
  padding-top: 0.5rem;
  border-top: 1px solid rgba(0, 255, 0, 0.1);
}

.color-preview {
  width: 24px;
  height: 24px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 3px;
}

.color-hex {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.7rem;
  color: rgba(0, 255, 0, 0.7);
}

/* Palette Selector */
.palette-selector {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.palette-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.4rem;
  background: none;
  border: 1px solid rgba(0, 255, 0, 0.1);
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.palette-btn:hover {
  background: rgba(0, 255, 0, 0.05);
}

.palette-btn.active {
  background: rgba(0, 255, 0, 0.1);
  border-color: #00ff00;
}

.palette-preview {
  display: flex;
  gap: 2px;
}

.palette-preview span {
  width: 12px;
  height: 12px;
  border-radius: 2px;
}

.palette-name {
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.7);
}

/* Actions */
.actions-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.25rem;
}

.action-btn {
  padding: 0.4rem;
  background: rgba(0, 255, 0, 0.05);
  border: 1px solid rgba(0, 255, 0, 0.2);
  border-radius: 4px;
  color: #00ff00;
  font-size: 0.65rem;
  cursor: pointer;
  transition: all 0.2s;
}

.action-btn:hover:not(:disabled) {
  background: rgba(0, 255, 0, 0.15);
}

.action-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

/* Canvas */
.pae-canvas-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.pae-canvas {
  display: grid;
  background: #000;
  border: 2px solid rgba(0, 255, 0, 0.5);
  width: min(100%, 512px);
  aspect-ratio: 1;
  cursor: crosshair;
}

.pixel {
  border: 1px solid v-bind(showGrid ? 'rgba(0, 255, 0, 0.08)' : 'transparent');
  transition: background 0.05s;
}

.pixel:hover {
  opacity: 0.8;
}

.grid-toggle {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.7rem;
  color: rgba(0, 255, 0, 0.6);
  cursor: pointer;
}

.grid-toggle input {
  accent-color: #00ff00;
}

/* Preview */
.pae-preview {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.preview-section {
  background: rgba(0, 255, 0, 0.03);
  border: 1px solid rgba(0, 255, 0, 0.1);
  border-radius: 6px;
  padding: 0.75rem;
}

.preview-sizes {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
}

.preview-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
}

.preview-box canvas {
  border: 1px solid rgba(0, 255, 0, 0.3);
  image-rendering: pixelated;
}

.preview-1x canvas { width: 32px; height: 32px; }
.preview-2x canvas { width: 64px; height: 64px; }
.preview-4x canvas { width: 128px; height: 128px; }

.preview-box span {
  font-size: 0.6rem;
  color: rgba(0, 255, 0, 0.5);
}

/* Templates */
.templates-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.25rem;
  max-height: 200px;
  overflow-y: auto;
}

.template-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  padding: 0.5rem;
  background: rgba(0, 255, 0, 0.05);
  border: 1px solid rgba(0, 255, 0, 0.2);
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.template-btn:hover {
  background: rgba(0, 255, 0, 0.15);
  border-color: #00ff00;
}

.template-icon {
  font-size: 1.25rem;
}

.template-name {
  font-size: 0.6rem;
  color: rgba(0, 255, 0, 0.7);
}

/* Responsive */
@media (max-width: 900px) {
  .pae-content {
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr auto;
  }
  
  .pae-toolbox {
    flex-direction: row;
    flex-wrap: wrap;
    overflow-x: auto;
  }
  
  .tool-section {
    flex: 1;
    min-width: 150px;
  }
  
  .pae-preview {
    flex-direction: row;
  }
}
</style>
