<template>
  <div class="minimap-container" :class="{ expanded: isExpanded }">
    <!-- Toggle Button -->
    <button class="minimap-toggle" @click="isExpanded = !isExpanded">
      <span v-if="isExpanded">▼</span>
      <span v-else>▲</span>
    </button>
    
    <!-- Minimap -->
    <div class="minimap">
      <!-- Radar sweep effect -->
      <div class="radar-sweep"></div>
      
      <!-- Grid lines -->
      <div class="grid-lines">
        <div class="grid-h"></div>
        <div class="grid-v"></div>
        <div class="grid-circle c1"></div>
        <div class="grid-circle c2"></div>
        <div class="grid-circle c3"></div>
      </div>
      
      <!-- Nodes -->
      <div 
        v-for="node in visibleNodes" 
        :key="node.id"
        class="map-node"
        :class="{ 
          active: activeNodeId === node.id,
          visited: visitedNodes.includes(node.id)
        }"
        :style="getNodeStyle(node)"
        :title="node.name"
      >
        <span class="node-dot"></span>
        <span class="node-label" v-if="isExpanded">{{ node.icon }}</span>
      </div>
      
      <!-- Player position -->
      <div class="player-marker" :style="playerStyle">
        <div class="player-dot"></div>
        <div class="player-direction" :style="{ transform: `rotate(${playerRotation}deg)` }"></div>
        <div class="player-fov"></div>
      </div>
      
      <!-- Compass -->
      <div class="compass">
        <span class="compass-n">N</span>
        <span class="compass-s">S</span>
        <span class="compass-e">E</span>
        <span class="compass-w">W</span>
      </div>
    </div>
    
    <!-- Legend (expanded) -->
    <div class="minimap-legend" v-if="isExpanded">
      <div class="legend-item">
        <span class="legend-dot visited"></span>
        <span>Visited</span>
      </div>
      <div class="legend-item">
        <span class="legend-dot unvisited"></span>
        <span>Unvisited</span>
      </div>
      <div class="legend-item">
        <span class="legend-dot active"></span>
        <span>Active</span>
      </div>
    </div>
    
    <!-- Stats (expanded) -->
    <div class="minimap-stats" v-if="isExpanded">
      <span>{{ visitedNodes.length }}/{{ nodes.length }} discovered</span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  nodes: {
    type: Array,
    required: true
  },
  playerPosition: {
    type: Object,
    default: () => ({ x: 0, y: 0, z: 0 })
  },
  playerRotation: {
    type: Number,
    default: 0
  },
  activeNodeId: {
    type: String,
    default: null
  },
  visitedNodes: {
    type: Array,
    default: () => []
  }
});

const isExpanded = ref(false);

// Map bounds (adjust based on your node positions)
const mapBounds = {
  minX: -20,
  maxX: 20,
  minZ: -15,
  maxZ: 15
};

const mapSize = computed(() => isExpanded.value ? 200 : 120);

// Filter nodes that are on the same general Y level (visible range)
const visibleNodes = computed(() => {
  return props.nodes.filter(node => {
    const yDiff = Math.abs(node.position.y - props.playerPosition.y);
    return yDiff < 10; // Show nodes within 10 units of player Y
  });
});

// Convert world position to map position
function worldToMap(x, z) {
  const mapX = ((x - mapBounds.minX) / (mapBounds.maxX - mapBounds.minX)) * 100;
  const mapZ = ((z - mapBounds.minZ) / (mapBounds.maxZ - mapBounds.minZ)) * 100;
  return { x: mapX, z: mapZ };
}

function getNodeStyle(node) {
  const pos = worldToMap(node.position.x, node.position.z);
  return {
    left: `${pos.x}%`,
    top: `${pos.z}%`,
    '--node-color': `#${node.color.toString(16).padStart(6, '0')}`
  };
}

const playerStyle = computed(() => {
  const pos = worldToMap(props.playerPosition.x, props.playerPosition.z);
  return {
    left: `${Math.max(5, Math.min(95, pos.x))}%`,
    top: `${Math.max(5, Math.min(95, pos.z))}%`
  };
});
</script>

<style scoped>
.minimap-container {
  position: relative;
  width: 120px;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.minimap-container.expanded {
  width: 200px;
}

/* Toggle Button */
.minimap-toggle {
  position: absolute;
  bottom: -24px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 20, 0, 0.9);
  border: 1px solid rgba(0, 255, 0, 0.3);
  color: #00ff00;
  width: 30px;
  height: 20px;
  border-radius: 0 0 6px 6px;
  cursor: pointer;
  font-size: 0.6rem;
  transition: all 0.2s;
  z-index: 10;
}

.minimap-toggle:hover {
  background: rgba(0, 255, 0, 0.2);
}

/* Minimap */
.minimap {
  width: 100%;
  aspect-ratio: 1;
  background: rgba(0, 10, 0, 0.9);
  border: 2px solid rgba(0, 255, 0, 0.4);
  border-radius: 50%;
  position: relative;
  overflow: hidden;
  box-shadow: 
    0 0 20px rgba(0, 255, 0, 0.2),
    inset 0 0 30px rgba(0, 255, 0, 0.1);
}

/* Radar Sweep */
.radar-sweep {
  position: absolute;
  inset: 0;
  background: conic-gradient(
    from 0deg,
    transparent 0deg,
    rgba(0, 255, 0, 0.3) 30deg,
    transparent 60deg
  );
  animation: radarSweep 4s linear infinite;
  pointer-events: none;
}

@keyframes radarSweep {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Grid Lines */
.grid-lines {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.grid-h, .grid-v {
  position: absolute;
  background: rgba(0, 255, 0, 0.15);
}

.grid-h {
  width: 100%;
  height: 1px;
  top: 50%;
}

.grid-v {
  height: 100%;
  width: 1px;
  left: 50%;
}

.grid-circle {
  position: absolute;
  border: 1px solid rgba(0, 255, 0, 0.1);
  border-radius: 50%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.grid-circle.c1 { width: 30%; height: 30%; }
.grid-circle.c2 { width: 60%; height: 60%; }
.grid-circle.c3 { width: 90%; height: 90%; }

/* Nodes */
.map-node {
  position: absolute;
  transform: translate(-50%, -50%);
  z-index: 5;
  cursor: pointer;
}

.node-dot {
  display: block;
  width: 6px;
  height: 6px;
  background: var(--node-color, #00ff00);
  border-radius: 50%;
  opacity: 0.5;
  transition: all 0.2s;
}

.map-node.visited .node-dot {
  opacity: 1;
  box-shadow: 0 0 8px var(--node-color);
}

.map-node.active .node-dot {
  width: 10px;
  height: 10px;
  animation: activeNode 1s ease-in-out infinite;
}

@keyframes activeNode {
  0%, 100% { box-shadow: 0 0 5px var(--node-color); }
  50% { box-shadow: 0 0 15px var(--node-color), 0 0 25px var(--node-color); }
}

.node-label {
  position: absolute;
  top: -16px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 0.7rem;
  white-space: nowrap;
}

/* Player Marker */
.player-marker {
  position: absolute;
  transform: translate(-50%, -50%);
  z-index: 10;
}

.player-dot {
  width: 10px;
  height: 10px;
  background: #fff;
  border: 2px solid #00ff00;
  border-radius: 50%;
  box-shadow: 0 0 10px #00ff00;
}

.player-direction {
  position: absolute;
  top: -8px;
  left: 50%;
  width: 0;
  height: 0;
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-bottom: 10px solid #00ff00;
  transform-origin: bottom center;
  margin-left: -4px;
}

.player-fov {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 40px;
  height: 40px;
  background: conic-gradient(
    from -30deg,
    transparent 0deg,
    rgba(0, 255, 0, 0.15) 30deg,
    rgba(0, 255, 0, 0.15) 30deg,
    transparent 60deg
  );
  transform: translate(-50%, -50%) rotate(-90deg);
  pointer-events: none;
}

/* Compass */
.compass {
  position: absolute;
  inset: 4px;
  font-size: 0.5rem;
  color: rgba(0, 255, 0, 0.4);
  pointer-events: none;
}

.compass span {
  position: absolute;
}

.compass-n { top: 2px; left: 50%; transform: translateX(-50%); }
.compass-s { bottom: 2px; left: 50%; transform: translateX(-50%); }
.compass-e { right: 4px; top: 50%; transform: translateY(-50%); }
.compass-w { left: 4px; top: 50%; transform: translateY(-50%); }

/* Legend */
.minimap-legend {
  display: flex;
  justify-content: center;
  gap: 0.75rem;
  margin-top: 0.5rem;
  font-size: 0.55rem;
  color: rgba(0, 255, 0, 0.6);
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.legend-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
}

.legend-dot.visited {
  background: #00ff00;
  box-shadow: 0 0 5px #00ff00;
}

.legend-dot.unvisited {
  background: rgba(0, 255, 0, 0.3);
}

.legend-dot.active {
  background: #fff;
  border: 1px solid #00ff00;
}

/* Stats */
.minimap-stats {
  text-align: center;
  margin-top: 0.25rem;
  font-size: 0.6rem;
  color: rgba(0, 255, 0, 0.5);
}

/* Responsive */
.minimap-container.expanded .minimap {
  border-radius: 12px;
}

.minimap-container.expanded .radar-sweep {
  border-radius: 12px;
}

.minimap-container.expanded .node-dot {
  width: 8px;
  height: 8px;
}
</style>
