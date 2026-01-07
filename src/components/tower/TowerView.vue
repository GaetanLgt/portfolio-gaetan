<template>
  <section class="view-tower">
    <!-- Stats Bar -->
    <div class="tower-stats-bar">
      <div class="stat-item">
        <span class="stat-icon">🤖</span>
        <div class="stat-content">
          <span class="stat-value">{{ agents.filter(a => !a.isLobby).length }}</span>
          <span class="stat-label">Agents</span>
        </div>
      </div>
      <div class="stat-item">
        <span class="stat-icon">⚡</span>
        <div class="stat-content">
          <span class="stat-value">{{ totalWorkflows }}</span>
          <span class="stat-label">Workflows</span>
        </div>
      </div>
      <div class="stat-item stat-item--live">
        <span class="stat-icon">🟢</span>
        <div class="stat-content">
          <span class="stat-value">{{ activeAgentsCount }}</span>
          <span class="stat-label">Online</span>
        </div>
      </div>
      <div class="stat-item">
        <span class="stat-icon">📊</span>
        <div class="stat-content">
          <span class="stat-value">99.8%</span>
          <span class="stat-label">Uptime</span>
        </div>
      </div>
    </div>

    <!-- Main Container -->
    <div class="tower-container">
      <!-- Left: Minimap -->
      <aside class="tower-minimap">
        <h3>Navigation</h3>
        <div class="minimap-zones">
          <div 
            v-for="zone in zones" 
            :key="zone.id" 
            class="zone-group"
          >
            <div class="zone-header">
              <span class="zone-icon">{{ zone.icon }}</span>
              <span class="zone-name">{{ zone.name }}</span>
            </div>
            <div class="zone-floors">
              <button 
                v-for="floor in getFloorsForZone(zone.id)" 
                :key="floor.id"
                class="minimap-floor"
                :class="{ 
                  active: selectedFloor === floor.id,
                  'is-lobby': floor.isLobby
                }"
                :style="{ '--floor-color': floor.color }"
                @click="$emit('selectFloor', floor.id)"
              >
                <span class="floor-icon">{{ floor.icon }}</span>
                <span class="floor-short">{{ floor.shortName }}</span>
              </button>
            </div>
          </div>
        </div>
      </aside>

      <!-- Center: Tower 3D View -->
      <div class="tower-3d-wrapper">
        <div class="tower-structure">
          <!-- Antenna -->
          <div class="tower-antenna">
            <div class="antenna-mast"></div>
            <div class="antenna-light"></div>
            <div class="antenna-signals">
              <span class="signal" v-for="n in 3" :key="n"></span>
            </div>
          </div>

          <!-- Tower Body -->
          <div class="tower-body">
            <TransitionGroup name="floor-anim" tag="div" class="floors-container">
              <div 
                v-for="floor in towerFloors" 
                :key="floor.id"
                class="tower-floor"
                :class="{ 
                  selected: selectedFloor === floor.id,
                  highlighted: highlightedFloor === floor.id,
                  'is-separator': floor.isSeparator,
                  'is-lobby': floor.isLobby,
                  [`zone-${floor.zone}`]: floor.zone
                }"
                :style="{ 
                  '--floor-color': floor.color,
                  '--floor-rgb': floor.colorRgb,
                  '--floor-height': floor.height
                }"
                @click="!floor.isSeparator && $emit('selectFloor', floor.id)"
                @mouseenter="!floor.isSeparator && $emit('highlightFloor', floor.id)"
                @mouseleave="$emit('highlightFloor', null)"
              >
                <!-- Separator -->
                <div class="floor-separator" v-if="floor.isSeparator">
                  <span class="separator-line"></span>
                  <span class="separator-label">{{ floor.label }}</span>
                  <span class="separator-line"></span>
                </div>

                <!-- Normal Floor -->
                <template v-else>
                  <div class="floor-level">
                    <span class="level-badge">{{ floor.levelDisplay }}</span>
                  </div>
                  
                  <div class="floor-facade">
                    <div class="windows-row">
                      <span 
                        class="window" 
                        v-for="w in (floor.windows || 5)" 
                        :key="w"
                        :class="{ lit: isWindowLit(floor.id, w) }"
                      ></span>
                    </div>
                    <div class="floor-reflection"></div>
                  </div>
                  
                  <div class="floor-info">
                    <span class="floor-avatar">{{ floor.icon }}</span>
                    <div class="floor-details">
                      <h4 class="floor-name">{{ floor.name }}</h4>
                      <span class="floor-role">{{ floor.role }}</span>
                    </div>
                  </div>
                  
                  <div class="floor-status">
                    <span class="status-indicator" :class="floor.status"></span>
                  </div>
                  
                  <div class="floor-glow"></div>
                  <div class="floor-hover-effect"></div>
                </template>
              </div>
            </TransitionGroup>
          </div>

          <!-- Foundation -->
          <div class="tower-foundation">
            <div class="foundation-logo">GL DIGITAL LAB</div>
            <div class="foundation-base">
              <span class="pillar" v-for="n in 5" :key="n"></span>
            </div>
            <div class="foundation-ground"></div>
          </div>
        </div>

        <!-- Elevator System -->
        <div class="elevator-shaft">
          <div class="shaft-track"></div>
          <div 
            class="elevator-car" 
            :style="{ '--elevator-pos': elevatorPosition }"
          >
            <div class="car-body">
              <span class="car-display">{{ currentFloorDisplay }}</span>
            </div>
            <div class="car-cables">
              <span class="cable"></span>
              <span class="cable"></span>
            </div>
          </div>
        </div>
      </div>

      <!-- Right: Agent Detail Panel -->
      <aside class="detail-panel" :class="{ open: selectedFloor }">
        <Transition name="slide-fade" mode="out-in">
          <!-- Agent Detail -->
          <AgentDetailCard 
            v-if="selectedAgent && !selectedAgent.isLobby"
            :key="selectedAgent.id"
            :agent="selectedAgent"
            @close="$emit('selectFloor', null)"
            @show-workflow="$emit('showWorkflow', $event)"
            @go-to-workflows="$emit('goToWorkflows', $event)"
          />
          
          <!-- Lobby Info -->
          <div v-else-if="selectedFloor === 'lobby'" :key="'lobby'" class="lobby-card">
            <div class="lobby-icon">🚪</div>
            <h3>Accueil GL Tower</h3>
            <p>Point d'entrée de GL Tower. Découvrez nos services et planifiez un audit gratuit de 30 minutes.</p>
            <div class="lobby-actions">
              <router-link to="/services" class="lobby-btn">Nos Services</router-link>
              <router-link to="/contact" class="lobby-btn lobby-btn--primary">Réserver un Audit</router-link>
            </div>
          </div>
          
          <!-- Empty State -->
          <div v-else :key="'empty'" class="empty-state">
            <div class="empty-illustration">
              <span class="empty-icon">👆</span>
              <div class="empty-rings">
                <span class="ring"></span>
                <span class="ring"></span>
              </div>
            </div>
            <p class="empty-text">Sélectionnez un étage pour découvrir l'agent</p>
            <p class="empty-hint">Cliquez sur n'importe quel niveau de la tour</p>
          </div>
        </Transition>
      </aside>
    </div>
  </section>
</template>

<script setup>
import { computed, ref } from 'vue';
import { getAllWorkflows } from '@/data/agents';
import AgentDetailCard from './AgentDetailCard.vue';

const props = defineProps({
  agents: { type: Array, required: true },
  towerFloors: { type: Array, required: true },
  selectedFloor: { type: String, default: null },
  highlightedFloor: { type: String, default: null }
});

const emit = defineEmits(['selectFloor', 'highlightFloor', 'showWorkflow', 'goToWorkflows']);

// Zones
const zones = [
  { id: 'main', name: 'Étages Principaux', icon: '🏢' },
  { id: 'devlab', name: 'Dev Lab', icon: '🔬' },
  { id: 'backoffice', name: 'Back Office', icon: '💼' }
];

// Computed
const totalWorkflows = computed(() => getAllWorkflows().length);
const activeAgentsCount = computed(() => props.agents.filter(a => a.status === 'active' && !a.isLobby).length);

const selectedAgent = computed(() => {
  if (!props.selectedFloor) return null;
  return props.agents.find(a => a.id === props.selectedFloor);
});

const elevatorPosition = computed(() => {
  if (!props.selectedFloor) return '95%';
  const floors = props.towerFloors.filter(f => !f.isSeparator);
  const index = floors.findIndex(f => f.id === props.selectedFloor);
  if (index === -1) return '95%';
  return `${5 + (index / floors.length) * 90}%`;
});

const currentFloorDisplay = computed(() => {
  if (!props.selectedFloor) return '--';
  const floor = props.towerFloors.find(f => f.id === props.selectedFloor);
  return floor?.levelDisplay || '--';
});

// Methods
const getFloorsForZone = (zoneId) => {
  if (zoneId === 'backoffice') {
    return props.towerFloors.filter(f => f.zone === 'backoffice' || f.zone === 'creative');
  }
  return props.towerFloors.filter(f => f.zone === zoneId && !f.isSeparator);
};

// Window lighting effect - pseudo-random but deterministic
const isWindowLit = (floorId, windowIndex) => {
  const hash = floorId.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
  return ((hash + windowIndex) % 3) !== 0;
};
</script>

<style scoped>
.view-tower {
  padding: 2rem;
  min-height: calc(100vh - 80px);
}

/* ============================================
   STATS BAR
   ============================================ */
.tower-stats-bar {
  display: flex;
  justify-content: center;
  gap: 2rem;
  padding: 1rem 2rem;
  margin: 0 auto 2rem;
  max-width: 800px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 1rem;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.stat-icon {
  font-size: 1.5rem;
}

.stat-content {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-family: 'JetBrains Mono', monospace;
  font-size: 1.25rem;
  font-weight: 700;
  color: #fff;
}

.stat-label {
  font-size: 0.65rem;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.stat-item--live .stat-value {
  color: #10B981;
}

/* ============================================
   MAIN CONTAINER
   ============================================ */
.tower-container {
  display: grid;
  grid-template-columns: 220px 1fr 380px;
  gap: 2rem;
  max-width: 1600px;
  margin: 0 auto;
}

/* ============================================
   MINIMAP
   ============================================ */
.tower-minimap {
  position: sticky;
  top: 100px;
  height: fit-content;
  padding: 1.25rem;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 1rem;
}

.tower-minimap h3 {
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #666;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.minimap-zones {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.zone-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.zone-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  color: #888;
  padding: 0.25rem 0;
}

.zone-icon {
  font-size: 0.9rem;
}

.zone-name {
  font-weight: 500;
}

.zone-floors {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding-left: 0.5rem;
  border-left: 2px solid rgba(255, 255, 255, 0.05);
}

.minimap-floor {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.4rem 0.6rem;
  background: transparent;
  border: none;
  border-radius: 0.25rem;
  color: #666;
  font-size: 0.75rem;
  text-align: left;
  cursor: pointer;
  transition: all 0.2s ease;
}

.minimap-floor:hover {
  background: rgba(255, 255, 255, 0.03);
  color: #fff;
  padding-left: 1rem;
}

.minimap-floor.active {
  background: rgba(var(--floor-color), 0.1);
  color: var(--floor-color);
  border-left: 2px solid var(--floor-color);
  margin-left: -2px;
}

.floor-icon {
  font-size: 1rem;
}

.floor-short {
  font-family: 'JetBrains Mono', monospace;
}

/* ============================================
   TOWER 3D VIEW
   ============================================ */
.tower-3d-wrapper {
  position: relative;
  display: flex;
  justify-content: center;
}

.tower-structure {
  position: relative;
  width: 100%;
  max-width: 550px;
}

/* Antenna */
.tower-antenna {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 0.5rem;
  position: relative;
}

.antenna-mast {
  width: 4px;
  height: 40px;
  background: linear-gradient(to top, #333, #555);
  border-radius: 2px;
}

.antenna-light {
  width: 12px;
  height: 12px;
  background: #EF4444;
  border-radius: 50%;
  box-shadow: 0 0 20px #EF4444, 0 0 40px rgba(239, 68, 68, 0.5);
  animation: blink 2s ease-in-out infinite;
  margin-top: -6px;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}

.antenna-signals {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100px;
  height: 100px;
}

.signal {
  position: absolute;
  inset: 0;
  border: 1px solid rgba(16, 185, 129, 0.3);
  border-radius: 50%;
  animation: signalPulse 3s ease-out infinite;
}

.signal:nth-child(2) { animation-delay: 1s; }
.signal:nth-child(3) { animation-delay: 2s; }

@keyframes signalPulse {
  0% { transform: scale(0.3); opacity: 0.8; }
  100% { transform: scale(1.5); opacity: 0; }
}

/* Tower Body */
.tower-body {
  position: relative;
  background: linear-gradient(
    180deg,
    rgba(30, 35, 50, 0.9) 0%,
    rgba(20, 25, 40, 0.95) 100%
  );
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px 8px 0 0;
  overflow: hidden;
}

.tower-body::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #10B981, #06B6D4, #8B5CF6);
}

.floors-container {
  display: flex;
  flex-direction: column;
}

/* Tower Floor */
.tower-floor {
  position: relative;
  height: var(--floor-height, 75px);
  display: grid;
  grid-template-columns: 55px 1fr auto 30px;
  align-items: center;
  padding: 0 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.03);
  cursor: pointer;
  transition: all 0.3s ease;
}

.tower-floor:hover:not(.is-separator) {
  background: rgba(255, 255, 255, 0.02);
}

.tower-floor.selected {
  background: rgba(var(--floor-rgb), 0.08);
  border-left: 3px solid var(--floor-color);
}

.tower-floor.highlighted {
  background: rgba(var(--floor-rgb), 0.05);
}

.tower-floor.is-separator {
  height: 45px;
  cursor: default;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.2);
}

.tower-floor.is-lobby {
  background: rgba(100, 116, 139, 0.05);
}

/* Floor Separator */
.floor-separator {
  display: flex;
  align-items: center;
  gap: 1rem;
  width: 100%;
  padding: 0 1rem;
}

.separator-line {
  flex: 1;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
}

.separator-label {
  font-size: 0.7rem;
  color: #666;
  white-space: nowrap;
  letter-spacing: 0.05em;
}

/* Floor Level */
.floor-level {
  display: flex;
  justify-content: center;
}

.level-badge {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--floor-color);
  background: rgba(var(--floor-rgb), 0.1);
  padding: 0.3rem 0.6rem;
  border-radius: 4px;
  min-width: 35px;
  text-align: center;
}

/* Floor Facade (Windows) */
.floor-facade {
  position: relative;
  padding: 0 1rem;
}

.windows-row {
  display: flex;
  gap: 6px;
  justify-content: center;
}

.window {
  width: 10px;
  height: 14px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 1px;
  transition: all 0.5s ease;
}

.window.lit {
  background: rgba(255, 200, 100, 0.2);
  border-color: rgba(255, 200, 100, 0.3);
  box-shadow: 0 0 8px rgba(255, 200, 100, 0.2);
}

.tower-floor:hover .window.lit {
  background: rgba(255, 200, 100, 0.35);
  box-shadow: 0 0 12px rgba(255, 200, 100, 0.3);
}

/* Floor Info */
.floor-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.floor-avatar {
  font-size: 1.75rem;
  transition: transform 0.3s ease;
}

.tower-floor:hover .floor-avatar {
  transform: scale(1.1);
}

.tower-floor.selected .floor-avatar {
  transform: scale(1.15);
}

.floor-details {
  display: flex;
  flex-direction: column;
}

.floor-name {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--floor-color);
  margin-bottom: 0.1rem;
}

.floor-role {
  font-size: 0.7rem;
  color: #888;
}

/* Floor Status */
.floor-status {
  display: flex;
  justify-content: center;
}

.status-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #10B981;
  box-shadow: 0 0 8px rgba(16, 185, 129, 0.5);
  animation: statusPulse 2s ease-in-out infinite;
}

.status-indicator.standby {
  background: #F59E0B;
  box-shadow: 0 0 8px rgba(245, 158, 11, 0.5);
}

.status-indicator.offline {
  background: #EF4444;
  animation: none;
}

@keyframes statusPulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

/* Floor Effects */
.floor-glow {
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, var(--floor-color), transparent);
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease;
}

.tower-floor.selected .floor-glow {
  opacity: 0.05;
}

.floor-hover-effect {
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, 
    transparent 0%,
    rgba(255, 255, 255, 0.02) 50%,
    transparent 100%
  );
  transform: translateX(-100%);
  pointer-events: none;
}

.tower-floor:hover .floor-hover-effect {
  animation: shimmer 0.8s ease-out;
}

@keyframes shimmer {
  to { transform: translateX(100%); }
}

/* Foundation */
.tower-foundation {
  background: linear-gradient(to bottom, rgba(20, 25, 40, 0.95), rgba(10, 15, 25, 1));
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-top: none;
  border-radius: 0 0 8px 8px;
  padding: 1rem;
  text-align: center;
}

.foundation-logo {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.7rem;
  color: #555;
  letter-spacing: 0.2em;
  margin-bottom: 0.75rem;
}

.foundation-base {
  display: flex;
  justify-content: space-around;
  margin-bottom: 0.5rem;
}

.pillar {
  width: 20px;
  height: 25px;
  background: linear-gradient(to bottom, #333, #222);
  border-radius: 0 0 3px 3px;
}

.foundation-ground {
  height: 3px;
  background: linear-gradient(90deg, transparent, #333, transparent);
  border-radius: 2px;
}

/* ============================================
   ELEVATOR SYSTEM
   ============================================ */
.elevator-shaft {
  position: absolute;
  right: -45px;
  top: 60px;
  bottom: 80px;
  width: 35px;
}

.shaft-track {
  position: absolute;
  left: 50%;
  top: 0;
  bottom: 0;
  width: 2px;
  background: linear-gradient(to bottom, #444, #222);
  transform: translateX(-50%);
}

.elevator-car {
  position: absolute;
  left: 50%;
  top: var(--elevator-pos, 95%);
  transform: translate(-50%, -50%);
  transition: top 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.car-body {
  width: 30px;
  height: 35px;
  background: linear-gradient(to bottom, #444, #333);
  border: 1px solid #555;
  border-radius: 3px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.car-body::before {
  content: '';
  position: absolute;
  top: 3px;
  left: 3px;
  right: 3px;
  height: 8px;
  background: linear-gradient(to bottom, rgba(255, 255, 255, 0.1), transparent);
  border-radius: 2px 2px 0 0;
}

.car-display {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.55rem;
  color: #10B981;
  background: #111;
  padding: 2px 4px;
  border-radius: 2px;
  text-shadow: 0 0 5px rgba(16, 185, 129, 0.5);
}

.car-cables {
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 6px;
}

.cable {
  width: 1px;
  height: 1000px;
  background: linear-gradient(to top, #444, #333);
}

/* ============================================
   DETAIL PANEL
   ============================================ */
.detail-panel {
  position: sticky;
  top: 100px;
  height: fit-content;
  max-height: calc(100vh - 140px);
  overflow-y: auto;
  background: rgba(20, 25, 40, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 1rem;
  padding: 1.5rem;
}

/* Lobby Card */
.lobby-card {
  text-align: center;
  padding: 2rem 1rem;
}

.lobby-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.lobby-card h3 {
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
}

.lobby-card p {
  font-size: 0.9rem;
  color: #888;
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

.lobby-actions {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.lobby-btn {
  padding: 0.75rem 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.5rem;
  color: #aaa;
  text-decoration: none;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.lobby-btn:hover {
  border-color: #10B981;
  color: #10B981;
}

.lobby-btn--primary {
  background: #10B981;
  border-color: #10B981;
  color: #000;
}

.lobby-btn--primary:hover {
  background: #059669;
  transform: translateY(-2px);
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 3rem 1rem;
}

.empty-illustration {
  position: relative;
  width: 100px;
  height: 100px;
  margin: 0 auto 1.5rem;
}

.empty-icon {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  z-index: 2;
  animation: bounce 2s ease-in-out infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.empty-rings {
  position: absolute;
  inset: 0;
}

.empty-rings .ring {
  position: absolute;
  inset: 0;
  border: 2px dashed rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  animation: ringRotate 10s linear infinite;
}

.empty-rings .ring:nth-child(2) {
  inset: 10px;
  animation-direction: reverse;
  animation-duration: 15s;
}

@keyframes ringRotate {
  to { transform: rotate(360deg); }
}

.empty-text {
  font-size: 0.95rem;
  color: #888;
  margin-bottom: 0.5rem;
}

.empty-hint {
  font-size: 0.8rem;
  color: #555;
}

/* Slide Fade Transition */
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease;
}

.slide-fade-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.slide-fade-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

/* Floor Animation */
.floor-anim-enter-active,
.floor-anim-leave-active {
  transition: all 0.3s ease;
}

.floor-anim-enter-from,
.floor-anim-leave-to {
  opacity: 0;
  transform: scaleY(0);
}

/* ============================================
   RESPONSIVE
   ============================================ */
@media (max-width: 1200px) {
  .tower-container {
    grid-template-columns: 180px 1fr 320px;
    gap: 1.5rem;
  }
}

@media (max-width: 1000px) {
  .tower-container {
    grid-template-columns: 1fr;
  }
  
  .tower-minimap {
    display: none;
  }
  
  .detail-panel {
    position: relative;
    top: 0;
    max-height: none;
  }
  
  .elevator-shaft {
    display: none;
  }
}

@media (max-width: 600px) {
  .view-tower {
    padding: 1rem;
  }
  
  .tower-stats-bar {
    flex-wrap: wrap;
    gap: 1rem;
  }
  
  .stat-item {
    flex: 1 1 45%;
    justify-content: center;
  }
  
  .tower-floor {
    grid-template-columns: 45px 1fr 25px;
  }
  
  .floor-facade {
    display: none;
  }
}
</style>
