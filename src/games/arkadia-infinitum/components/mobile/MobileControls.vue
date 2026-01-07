<template>
  <div class="mobile-controls" v-if="isMobile">
    <!-- JOYSTICK GAUCHE - Mouvement -->
    <div 
      class="joystick joystick-left"
      ref="joystickLeft"
      @touchstart="onJoystickStart($event, 'move')"
      @touchmove="onJoystickMove($event, 'move')"
      @touchend="onJoystickEnd('move')"
    >
      <div class="joystick-base">
        <div class="joystick-ring"></div>
        <div 
          class="joystick-handle"
          :style="{ transform: `translate(${moveJoystick.x}px, ${moveJoystick.y}px)` }"
        >
          <div class="handle-inner"></div>
        </div>
      </div>
      <span class="joystick-label">MOVE</span>
    </div>

    <!-- JOYSTICK DROIT - Caméra (Look) -->
    <div 
      class="joystick joystick-right"
      ref="joystickRight"
      @touchstart="onJoystickStart($event, 'look')"
      @touchmove="onJoystickMove($event, 'look')"
      @touchend="onJoystickEnd('look')"
    >
      <div class="joystick-base">
        <div class="joystick-ring"></div>
        <div 
          class="joystick-handle"
          :style="{ transform: `translate(${lookJoystick.x}px, ${lookJoystick.y}px)` }"
        >
          <div class="handle-inner"></div>
        </div>
      </div>
      <span class="joystick-label">LOOK</span>
    </div>

    <!-- BOUTONS D'ACTION -->
    <div class="action-buttons">
      <button class="action-btn action-jump" @touchstart="$emit('jump')">
        <span class="btn-icon">⬆️</span>
        <span class="btn-label">JUMP</span>
      </button>
      <button class="action-btn action-interact" @touchstart="$emit('interact')">
        <span class="btn-icon">👆</span>
        <span class="btn-label">TAP</span>
      </button>
    </div>

    <!-- MENU RAPIDE (swipe up) -->
    <div class="quick-menu" :class="{ open: quickMenuOpen }">
      <button class="quick-toggle" @click="quickMenuOpen = !quickMenuOpen">
        <span>{{ quickMenuOpen ? '▼' : '▲' }}</span>
        <span class="toggle-label">MENU</span>
      </button>
      
      <Transition name="slide-up">
        <div v-if="quickMenuOpen" class="quick-items">
          <button class="quick-item" @click="$emit('openOperator')">
            <span>📞</span>
            <span>Opérateur</span>
          </button>
          <button class="quick-item" @click="$emit('openHologram')">
            <span>🔮</span>
            <span>Hologram</span>
          </button>
          <button class="quick-item" @click="$emit('openWorkflows')">
            <span>🔄</span>
            <span>Workflows</span>
          </button>
          <button class="quick-item" @click="$emit('openPixelArt')">
            <span>🎨</span>
            <span>Pixel Art</span>
          </button>
          <button class="quick-item" @click="$emit('openTechFeed')">
            <span>📡</span>
            <span>Tech Feed</span>
          </button>
          <button class="quick-item exit" @click="$emit('exit')">
            <span>🚪</span>
            <span>Exit</span>
          </button>
        </div>
      </Transition>
    </div>

    <!-- INDICATEUR DE NOEUD PROCHE -->
    <Transition name="fade">
      <div v-if="nearbyNode" class="nearby-indicator">
        <span class="nearby-icon">{{ nearbyNode.icon }}</span>
        <div class="nearby-info">
          <span class="nearby-name">{{ nearbyNode.name }}</span>
          <span class="nearby-hint">Tap to interact</span>
        </div>
        <div class="nearby-pulse"></div>
      </div>
    </Transition>

    <!-- MINI HUD MOBILE -->
    <div class="mobile-hud">
      <div class="hud-item">
        <span class="hud-icon">◉</span>
        <span class="hud-text">THE CONSTRUCT</span>
      </div>
      <div class="hud-item hud-xp">
        <span class="hud-icon">⚡</span>
        <span class="hud-text">{{ playerXP }} XP</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue';

const props = defineProps({
  nearbyNode: Object,
  playerXP: { type: Number, default: 0 }
});

const emit = defineEmits([
  'move', 'look', 'jump', 'interact',
  'openOperator', 'openHologram', 'openWorkflows', 'openPixelArt', 'openTechFeed',
  'exit'
]);

// Détection mobile
const isMobile = ref(false);
const quickMenuOpen = ref(false);

// Joysticks state
const moveJoystick = reactive({ x: 0, y: 0, active: false });
const lookJoystick = reactive({ x: 0, y: 0, active: false });
const joystickRadius = 50;

// Touch tracking
let moveTouchId = null;
let lookTouchId = null;

function checkMobile() {
  isMobile.value = /mobile|android|iphone|ipad|tablet/i.test(navigator.userAgent) || 
                   window.innerWidth <= 1024;
}

function onJoystickStart(e, type) {
  e.preventDefault();
  const touch = e.touches[0];
  const rect = e.target.closest('.joystick').getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  
  if (type === 'move') {
    moveTouchId = touch.identifier;
    moveJoystick.active = true;
  } else {
    lookTouchId = touch.identifier;
    lookJoystick.active = true;
  }
  
  updateJoystick(touch.clientX - centerX, touch.clientY - centerY, type);
}

function onJoystickMove(e, type) {
  e.preventDefault();
  const joystick = e.target.closest('.joystick');
  const rect = joystick.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  
  for (const touch of e.touches) {
    if (type === 'move' && touch.identifier === moveTouchId) {
      updateJoystick(touch.clientX - centerX, touch.clientY - centerY, 'move');
    } else if (type === 'look' && touch.identifier === lookTouchId) {
      updateJoystick(touch.clientX - centerX, touch.clientY - centerY, 'look');
    }
  }
}

function updateJoystick(dx, dy, type) {
  // Clamp to radius
  const distance = Math.sqrt(dx * dx + dy * dy);
  const clampedDistance = Math.min(distance, joystickRadius);
  const angle = Math.atan2(dy, dx);
  
  const x = Math.cos(angle) * clampedDistance;
  const y = Math.sin(angle) * clampedDistance;
  
  // Normalize values (-1 to 1)
  const normalizedX = x / joystickRadius;
  const normalizedY = y / joystickRadius;
  
  if (type === 'move') {
    moveJoystick.x = x;
    moveJoystick.y = y;
    emit('move', { x: normalizedX, y: -normalizedY }); // Invert Y for forward
  } else {
    lookJoystick.x = x;
    lookJoystick.y = y;
    emit('look', { x: normalizedX, y: normalizedY });
  }
}

function onJoystickEnd(type) {
  if (type === 'move') {
    moveJoystick.x = 0;
    moveJoystick.y = 0;
    moveJoystick.active = false;
    moveTouchId = null;
    emit('move', { x: 0, y: 0 });
  } else {
    lookJoystick.x = 0;
    lookJoystick.y = 0;
    lookJoystick.active = false;
    lookTouchId = null;
    emit('look', { x: 0, y: 0 });
  }
}

onMounted(() => {
  checkMobile();
  window.addEventListener('resize', checkMobile);
});

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile);
});
</script>

<style scoped>
.mobile-controls {
  position: fixed;
  inset: 0;
  z-index: 1000;
  pointer-events: none;
  font-family: 'Share Tech Mono', monospace;
}

/* Joysticks */
.joystick {
  position: fixed;
  bottom: 2rem;
  width: 130px;
  height: 130px;
  pointer-events: auto;
  touch-action: none;
}

.joystick-left {
  left: 1.5rem;
}

.joystick-right {
  right: 1.5rem;
}

.joystick-base {
  position: relative;
  width: 100%;
  height: 100%;
  background: rgba(0, 20, 0, 0.6);
  border: 2px solid rgba(0, 255, 0, 0.3);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.joystick-ring {
  position: absolute;
  inset: 8px;
  border: 1px dashed rgba(0, 255, 0, 0.2);
  border-radius: 50%;
}

.joystick-handle {
  width: 50px;
  height: 50px;
  background: radial-gradient(circle, rgba(0, 255, 0, 0.4), rgba(0, 255, 0, 0.2));
  border: 2px solid #00ff00;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.05s ease-out;
  box-shadow: 0 0 20px rgba(0, 255, 0, 0.4);
}

.handle-inner {
  width: 20px;
  height: 20px;
  background: #00ff00;
  border-radius: 50%;
  box-shadow: 0 0 10px #00ff00;
}

.joystick-label {
  position: absolute;
  bottom: -1.5rem;
  left: 50%;
  transform: translateX(-50%);
  font-size: 0.6rem;
  color: rgba(0, 255, 0, 0.5);
  letter-spacing: 0.1em;
}

/* Action Buttons */
.action-buttons {
  position: fixed;
  right: 1.5rem;
  bottom: 12rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  pointer-events: auto;
}

.action-btn {
  width: 60px;
  height: 60px;
  background: rgba(0, 20, 0, 0.7);
  border: 2px solid rgba(0, 255, 0, 0.5);
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.2rem;
  color: #00ff00;
  touch-action: manipulation;
  transition: all 0.15s;
}

.action-btn:active {
  transform: scale(0.9);
  background: rgba(0, 255, 0, 0.2);
  border-color: #00ff00;
  box-shadow: 0 0 20px rgba(0, 255, 0, 0.5);
}

.btn-icon {
  font-size: 1.2rem;
}

.btn-label {
  font-size: 0.5rem;
  letter-spacing: 0.05em;
}

.action-jump {
  border-color: rgba(0, 200, 255, 0.5);
}

.action-jump:active {
  border-color: #00c8ff;
  box-shadow: 0 0 20px rgba(0, 200, 255, 0.5);
}

/* Quick Menu */
.quick-menu {
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  pointer-events: auto;
  z-index: 1100;
}

.quick-toggle {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.2rem;
  padding: 0.5rem 1.5rem;
  background: rgba(0, 20, 0, 0.9);
  border: 1px solid rgba(0, 255, 0, 0.4);
  border-bottom: none;
  border-radius: 12px 12px 0 0;
  color: #00ff00;
  font-size: 0.8rem;
}

.toggle-label {
  font-size: 0.5rem;
  letter-spacing: 0.1em;
  opacity: 0.6;
}

.quick-items {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.5rem;
  padding: 1rem;
  background: rgba(0, 10, 0, 0.95);
  border: 1px solid rgba(0, 255, 0, 0.3);
  border-radius: 16px 16px 0 0;
  min-width: 280px;
}

.quick-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.3rem;
  padding: 0.75rem 0.5rem;
  background: rgba(0, 255, 0, 0.05);
  border: 1px solid rgba(0, 255, 0, 0.2);
  border-radius: 10px;
  color: #00ff00;
  font-size: 0.6rem;
  transition: all 0.2s;
}

.quick-item:active {
  background: rgba(0, 255, 0, 0.2);
  transform: scale(0.95);
}

.quick-item span:first-child {
  font-size: 1.3rem;
}

.quick-item.exit {
  border-color: rgba(255, 0, 0, 0.3);
  color: #ff4444;
}

/* Nearby Node Indicator */
.nearby-indicator {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.5rem;
  background: rgba(0, 20, 0, 0.9);
  border: 2px solid #00ff00;
  border-radius: 16px;
  pointer-events: none;
  box-shadow: 0 0 30px rgba(0, 255, 0, 0.3);
}

.nearby-icon {
  font-size: 2rem;
}

.nearby-info {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.nearby-name {
  font-size: 0.9rem;
  font-weight: bold;
  color: #00ff00;
}

.nearby-hint {
  font-size: 0.6rem;
  color: rgba(0, 255, 0, 0.5);
  animation: blink 1s infinite;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}

.nearby-pulse {
  position: absolute;
  inset: -4px;
  border: 1px solid rgba(0, 255, 0, 0.5);
  border-radius: 20px;
  animation: nearbyPulse 1.5s ease-out infinite;
}

@keyframes nearbyPulse {
  0% { transform: scale(1); opacity: 0.5; }
  100% { transform: scale(1.1); opacity: 0; }
}

/* Mobile HUD */
.mobile-hud {
  position: fixed;
  top: 1rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 1rem;
  padding: 0.5rem 1rem;
  background: rgba(0, 10, 0, 0.8);
  border: 1px solid rgba(0, 255, 0, 0.3);
  border-radius: 20px;
  pointer-events: none;
}

.hud-item {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.65rem;
  color: rgba(0, 255, 0, 0.8);
}

.hud-icon {
  color: #00ff00;
}

.hud-xp {
  color: #ffcc00;
}

.hud-xp .hud-icon {
  color: #ffcc00;
}

/* Transitions */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
