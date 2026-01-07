<template>
  <div 
    class="custom-cursor" 
    :class="[
      { 'cursor--hover': isHovering, 'cursor--clicking': isClicking },
      'theme--' + currentTheme
    ]"
  >
    <div class="cursor-dot" ref="dotRef">
      <span class="dot-icon" v-if="themeIcon">{{ themeIcon }}</span>
    </div>
    <div class="cursor-ring" ref="ringRef"></div>
    <div class="cursor-trail" ref="trailRef" v-for="i in 5" :key="i"></div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const dotRef = ref(null);
const ringRef = ref(null);
const trailRef = ref([]);
const isHovering = ref(false);
const isClicking = ref(false);

let mouseX = 0;
let mouseY = 0;
let dotX = 0;
let dotY = 0;
let ringX = 0;
let ringY = 0;
let animationId = null;

// Détection du thème
const currentTheme = computed(() => {
  const path = route.path;
  if (path.includes('matrix')) return 'matrix';
  if (path.includes('tron')) return 'tron';
  if (path.includes('blade-runner')) return 'bladerunner';
  if (path.includes('inception')) return 'inception';
  if (path.includes('ghost')) return 'ghost';
  if (path.includes('minority')) return 'minority';
  if (path.includes('iron-man')) return 'ironman';
  if (path.includes('dragon-ball')) return 'dbz';
  if (path.includes('deadpool')) return 'deadpool';
  if (path.includes('mask')) return 'mask';
  if (path.includes('vendetta')) return 'vendetta';
  if (path.includes('ready-player')) return 'oasis';
  if (path.includes('cloud-atlas')) return 'cloudatlas';
  if (path.includes('jupiter')) return 'jupiter';
  if (path.includes('howard')) return 'howard';
  if (path.includes('alice')) return 'alice';
  if (path.includes('asimov')) return 'asimov';
  if (path.includes('mecha') || path.includes('jardin')) return 'ghibli';
  if (path.includes('multivers')) return 'multivers';
  return 'default';
});

// Icône thématique optionnelle
const themeIcon = computed(() => {
  const icons = {
    matrix: null, // On garde le dot simple pour Matrix
    tron: null,
    dbz: '⚡',
    ironman: '◈',
    deadpool: '💀',
    mask: '🎭',
    oasis: '🎮',
    ghibli: '✿',
    alice: '♠',
    howard: '🦆'
  };
  return isHovering.value ? icons[currentTheme.value] : null;
});

function onMouseMove(e) {
  mouseX = e.clientX;
  mouseY = e.clientY;
}

function onMouseDown() {
  isClicking.value = true;
}

function onMouseUp() {
  isClicking.value = false;
}

function onMouseEnterInteractive(e) {
  const target = e.target.closest('a, button, [role="button"], input, select, textarea, label[for], .interactive, .card, .portal-card, .skill-card, .fighter-card');
  if (target) {
    isHovering.value = true;
  }
}

function onMouseLeaveInteractive(e) {
  const target = e.target.closest('a, button, [role="button"], input, select, textarea, label[for], .interactive, .card, .portal-card, .skill-card, .fighter-card');
  if (target) {
    isHovering.value = false;
  }
}

function animate() {
  // Dot follows with smooth lerp
  dotX += (mouseX - dotX) * 0.4;
  dotY += (mouseY - dotY) * 0.4;
  
  // Ring follows with more delay
  ringX += (mouseX - ringX) * 0.12;
  ringY += (mouseY - ringY) * 0.12;
  
  if (dotRef.value) {
    dotRef.value.style.transform = `translate(${dotX}px, ${dotY}px)`;
  }
  
  if (ringRef.value) {
    ringRef.value.style.transform = `translate(${ringX}px, ${ringY}px)`;
  }
  
  animationId = requestAnimationFrame(animate);
}

onMounted(() => {
  // Check for touch device
  if (window.matchMedia('(pointer: coarse)').matches) {
    return;
  }
  
  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mousedown', onMouseDown);
  document.addEventListener('mouseup', onMouseUp);
  document.addEventListener('mouseover', onMouseEnterInteractive);
  document.addEventListener('mouseout', onMouseLeaveInteractive);
  
  animate();
});

onUnmounted(() => {
  document.removeEventListener('mousemove', onMouseMove);
  document.removeEventListener('mousedown', onMouseDown);
  document.removeEventListener('mouseup', onMouseUp);
  document.removeEventListener('mouseover', onMouseEnterInteractive);
  document.removeEventListener('mouseout', onMouseLeaveInteractive);
  
  if (animationId) {
    cancelAnimationFrame(animationId);
  }
});
</script>

<style scoped>
.custom-cursor {
  --cursor-color: #ffffff;
  --cursor-glow: rgba(255, 255, 255, 0.5);
  --cursor-accent: var(--primary, #10B981);
  
  pointer-events: none;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 99999;
  mix-blend-mode: difference;
}

/* Hide on touch devices */
@media (pointer: coarse) {
  .custom-cursor {
    display: none;
  }
}

.cursor-dot {
  position: fixed;
  top: -5px;
  left: -5px;
  width: 10px;
  height: 10px;
  background: var(--cursor-color);
  border-radius: 50%;
  transition: width 0.2s, height 0.2s, top 0.2s, left 0.2s, background 0.3s;
  will-change: transform;
  display: flex;
  align-items: center;
  justify-content: center;
}

.dot-icon {
  font-size: 0.6rem;
  mix-blend-mode: normal;
}

.cursor-ring {
  position: fixed;
  top: -20px;
  left: -20px;
  width: 40px;
  height: 40px;
  border: 1.5px solid var(--cursor-color);
  border-radius: 50%;
  opacity: 0.5;
  transition: width 0.3s, height 0.3s, top 0.3s, left 0.3s, border-color 0.3s, opacity 0.3s;
  will-change: transform;
}

/* Hover state */
.cursor--hover .cursor-dot {
  width: 14px;
  height: 14px;
  top: -7px;
  left: -7px;
  background: var(--cursor-accent);
}

.cursor--hover .cursor-ring {
  width: 60px;
  height: 60px;
  top: -30px;
  left: -30px;
  border-color: var(--cursor-accent);
  opacity: 0.4;
}

/* Clicking state */
.cursor--clicking .cursor-dot {
  transform: scale(0.7);
}

.cursor--clicking .cursor-ring {
  transform: scale(0.85);
}

/* ═══════════════════════════════════════════════════════════════════════════
   THÈMES MULTIVERS
   ═══════════════════════════════════════════════════════════════════════════ */

/* Matrix - Vert néon avec glitch */
.theme--matrix {
  --cursor-color: #00ff41;
  --cursor-accent: #00ff41;
  --cursor-glow: rgba(0, 255, 65, 0.6);
  mix-blend-mode: normal;
}

.theme--matrix .cursor-dot {
  box-shadow: 0 0 10px var(--cursor-glow), 0 0 20px var(--cursor-glow);
}

.theme--matrix .cursor-ring {
  border-style: dashed;
  animation: matrixRing 2s linear infinite;
}

@keyframes matrixRing {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Tron - Cyan électrique */
.theme--tron {
  --cursor-color: #00d4ff;
  --cursor-accent: #00d4ff;
  mix-blend-mode: normal;
}

.theme--tron .cursor-dot {
  box-shadow: 0 0 15px rgba(0, 212, 255, 0.8);
}

.theme--tron .cursor-ring {
  border-width: 2px;
  box-shadow: inset 0 0 10px rgba(0, 212, 255, 0.3);
}

/* Blade Runner - Orange néon */
.theme--bladerunner {
  --cursor-color: #ff6b2b;
  --cursor-accent: #ff6b2b;
  mix-blend-mode: normal;
}

.theme--bladerunner .cursor-ring {
  border-style: double;
  border-width: 3px;
}

/* Inception - Or profond */
.theme--inception {
  --cursor-color: #d4af37;
  --cursor-accent: #d4af37;
  mix-blend-mode: normal;
}

.theme--inception .cursor-ring {
  animation: inceptionPulse 3s ease-in-out infinite;
}

@keyframes inceptionPulse {
  0%, 100% { opacity: 0.3; transform: scale(1); }
  50% { opacity: 0.6; transform: scale(1.1); }
}

/* Ghost in the Shell - Violet cyber */
.theme--ghost {
  --cursor-color: #9d4edd;
  --cursor-accent: #9d4edd;
  mix-blend-mode: normal;
}

.theme--ghost .cursor-dot {
  border-radius: 2px;
}

.theme--ghost .cursor-ring {
  border-radius: 4px;
}

/* Minority Report - Bleu froid */
.theme--minority {
  --cursor-color: #4fc3f7;
  --cursor-accent: #4fc3f7;
  mix-blend-mode: normal;
}

.theme--minority .cursor-ring {
  border: none;
  background: radial-gradient(circle, transparent 40%, rgba(79, 195, 247, 0.2) 100%);
}

/* Iron Man - Rouge/Or HUD */
.theme--ironman {
  --cursor-color: #ff3d00;
  --cursor-accent: #ffd600;
  mix-blend-mode: normal;
}

.theme--ironman .cursor-ring {
  border-color: #ffd600;
  border-width: 1px;
}

.theme--ironman .cursor-dot {
  background: linear-gradient(135deg, #ff3d00, #ffd600);
}

/* Dragon Ball Z - Ki orange */
.theme--dbz {
  --cursor-color: #ff9800;
  --cursor-accent: #ffeb3b;
  mix-blend-mode: normal;
}

.theme--dbz .cursor-ring {
  border: none;
  background: radial-gradient(circle, rgba(255, 152, 0, 0.3) 0%, transparent 70%);
  animation: kiAura 1s ease-in-out infinite;
}

@keyframes kiAura {
  0%, 100% { transform: scale(1); opacity: 0.4; }
  50% { transform: scale(1.2); opacity: 0.6; }
}

/* Deadpool - Rouge sang */
.theme--deadpool {
  --cursor-color: #e53935;
  --cursor-accent: #e53935;
  mix-blend-mode: normal;
}

.theme--deadpool .cursor-ring {
  border-style: dotted;
}

/* The Mask - Vert cartoon */
.theme--mask {
  --cursor-color: #76ff03;
  --cursor-accent: #ffeb3b;
  mix-blend-mode: normal;
}

.theme--mask .cursor-dot {
  animation: maskBounce 0.5s ease-in-out infinite;
}

@keyframes maskBounce {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.3); }
}

/* V for Vendetta - Rouge sombre */
.theme--vendetta {
  --cursor-color: #b71c1c;
  --cursor-accent: #b71c1c;
  mix-blend-mode: normal;
}

/* Ready Player One - Néon arcade */
.theme--oasis {
  --cursor-color: #ff00ff;
  --cursor-accent: #00ffff;
  mix-blend-mode: normal;
}

.theme--oasis .cursor-dot {
  animation: oasisGlow 1s ease-in-out infinite alternate;
}

@keyframes oasisGlow {
  from { background: #ff00ff; box-shadow: 0 0 10px #ff00ff; }
  to { background: #00ffff; box-shadow: 0 0 10px #00ffff; }
}

/* Cloud Atlas - Bleu tranquille */
.theme--cloudatlas {
  --cursor-color: #64b5f6;
  --cursor-accent: #64b5f6;
  mix-blend-mode: normal;
}

/* Jupiter Ascending - Or royal */
.theme--jupiter {
  --cursor-color: #ffd700;
  --cursor-accent: #ffd700;
  mix-blend-mode: normal;
}

.theme--jupiter .cursor-dot {
  box-shadow: 0 0 15px rgba(255, 215, 0, 0.6);
}

/* Howard the Duck - Vert canard */
.theme--howard {
  --cursor-color: #4caf50;
  --cursor-accent: #ff9800;
  mix-blend-mode: normal;
}

/* Alice Turing - Rose Wonderland */
.theme--alice {
  --cursor-color: #e91e63;
  --cursor-accent: #9c27b0;
  mix-blend-mode: normal;
}

.theme--alice .cursor-ring {
  border-style: dashed;
}

/* Asimov - Bleu acier */
.theme--asimov {
  --cursor-color: #607d8b;
  --cursor-accent: #90a4ae;
  mix-blend-mode: normal;
}

.theme--asimov .cursor-dot {
  border-radius: 2px;
}

.theme--asimov .cursor-ring {
  border-radius: 6px;
}

/* Ghibli - Vert nature doux */
.theme--ghibli {
  --cursor-color: #81c784;
  --cursor-accent: #a5d6a7;
  mix-blend-mode: normal;
}

.theme--ghibli .cursor-dot {
  border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
}

.theme--ghibli .cursor-ring {
  border-radius: 40% 60% 60% 40% / 40% 40% 60% 60%;
  border-style: dotted;
  opacity: 0.3;
}

/* Multivers Hub - Gradient arc-en-ciel */
.theme--multivers {
  mix-blend-mode: normal;
}

.theme--multivers .cursor-dot {
  background: linear-gradient(135deg, #00ff41, #00d4ff, #9d4edd, #ff00ff);
  background-size: 200% 200%;
  animation: multiversDot 2s ease infinite;
}

.theme--multivers .cursor-ring {
  border-image: linear-gradient(135deg, #00ff41, #00d4ff, #9d4edd, #ff00ff) 1;
  animation: multiversRing 3s linear infinite;
}

@keyframes multiversDot {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

@keyframes multiversRing {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* A11Y - Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .cursor-dot,
  .cursor-ring {
    animation: none !important;
    transition: none !important;
  }
}
</style>
