<template>
  <Transition name="dream-fade">
    <div v-if="show" class="architect-dream" @click.self="$emit('close')">
      <!-- Blueprint Grid Background -->
      <svg class="blueprint-bg" aria-hidden="true">
        <defs>
          <pattern id="smallGrid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(70, 130, 180, 0.15)" stroke-width="0.5"/>
          </pattern>
          <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
            <rect width="100" height="100" fill="url(#smallGrid)"/>
            <path d="M 100 0 L 0 0 0 100" fill="none" stroke="rgba(70, 130, 180, 0.25)" stroke-width="1"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      <!-- Floating Notes -->
      <div class="floating-notes" aria-hidden="true">
        <span class="note note--1" :style="{ animationDelay: '0s' }">structure porteuse</span>
        <span class="note note--2" :style="{ animationDelay: '0.5s' }">lumière naturelle</span>
        <span class="note note--3" :style="{ animationDelay: '1s' }">→ végétaliser</span>
        <span class="note note--4" :style="{ animationDelay: '1.5s' }">// TODO: optimiser</span>
        <span class="note note--5" :style="{ animationDelay: '2s' }">cf. sketch p.42</span>
        <span class="note note--6" :style="{ animationDelay: '2.5s' }">chêne centenaire</span>
      </div>

      <!-- Main Content -->
      <div class="dream-content">
        <!-- Close Button -->
        <button class="dream-close" @click="$emit('close')" aria-label="Fermer">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </button>

        <!-- Header -->
        <div class="dream-header">
          <div class="header-badge">
            <span class="badge-pulse"></span>
            <span>SECRET ZONE DISCOVERED</span>
          </div>
          <h1 class="dream-title">ARCHITECT'S DREAM</h1>
          <p class="dream-subtitle">La maison bleue dans l'arbre</p>
        </div>

        <!-- House SVG Illustration - Animated -->
        <div class="house-container">
          <svg class="house-svg" viewBox="0 0 500 600" preserveAspectRatio="xMidYMid meet">
            <!-- Tree Trunk -->
            <g class="tree-trunk">
              <path class="sketch-line animate-draw" d="M80 250 Q70 350 65 480 Q60 520 70 550" 
                    stroke="#5c4033" stroke-width="8" fill="none" stroke-linecap="round"/>
              <path class="sketch-line animate-draw" d="M100 250 Q110 350 115 480 Q120 520 110 550" 
                    stroke="#8b6914" stroke-width="6" fill="none" stroke-linecap="round"
                    style="animation-delay: 0.2s"/>
              <!-- Branch reaching to house -->
              <path class="sketch-line animate-draw" d="M95 300 Q130 280 180 290" 
                    stroke="#5c4033" stroke-width="4" fill="none" stroke-linecap="round"
                    style="animation-delay: 0.4s"/>
            </g>

            <!-- Tree Foliage -->
            <g class="tree-foliage">
              <ellipse class="foliage animate-foliage" cx="100" cy="120" rx="80" ry="70" 
                       fill="rgba(144, 238, 144, 0.4)" stroke="#228b22" stroke-width="2"/>
              <ellipse class="foliage animate-foliage" cx="60" cy="170" rx="60" ry="55" 
                       fill="rgba(144, 238, 144, 0.3)" stroke="#228b22" stroke-width="2"
                       style="animation-delay: 0.3s"/>
              <ellipse class="foliage animate-foliage" cx="140" cy="160" rx="55" ry="50" 
                       fill="rgba(144, 238, 144, 0.35)" stroke="#228b22" stroke-width="2"
                       style="animation-delay: 0.6s"/>
              <ellipse class="foliage animate-foliage" cx="90" cy="200" rx="70" ry="55" 
                       fill="rgba(144, 238, 144, 0.3)" stroke="#228b22" stroke-width="2"
                       style="animation-delay: 0.9s"/>
            </g>

            <!-- House Main Structure -->
            <g class="house-main">
              <!-- Blue Facade -->
              <rect class="house-facade animate-draw-rect" x="180" y="180" width="220" height="340" rx="3"
                    fill="rgba(42, 82, 152, 0.3)" stroke="#2a5298" stroke-width="3"/>
              
              <!-- Roof Line -->
              <line class="sketch-line animate-draw" x1="175" y1="180" x2="405" y2="180" 
                    stroke="#1a3a6e" stroke-width="4" style="animation-delay: 0.5s"/>
              <line class="sketch-line animate-draw" x1="180" y1="172" x2="400" y2="172" 
                    stroke="#1a3a6e" stroke-width="2" style="animation-delay: 0.7s"/>
            </g>

            <!-- Windows -->
            <g class="windows">
              <!-- Top Arched Window -->
              <path class="window animate-draw" d="M230 220 L230 300 Q270 300 270 220 Q270 200 250 200 Q230 200 230 220" 
                    fill="rgba(255, 200, 100, 0.3)" stroke="#8b4513" stroke-width="2"
                    style="animation-delay: 1s"/>
              <rect class="window-glow" x="235" y="230" width="30" height="50" rx="2"
                    fill="rgba(255, 215, 0, 0.6)" style="animation-delay: 1.2s"/>
              
              <!-- Middle Arched Window -->
              <path class="window animate-draw" d="M300 220 L300 300 Q340 300 340 220 Q340 200 320 200 Q300 200 300 220" 
                    fill="rgba(255, 200, 100, 0.3)" stroke="#8b4513" stroke-width="2"
                    style="animation-delay: 1.1s"/>
              <rect class="window-glow" x="305" y="230" width="30" height="50" rx="2"
                    fill="rgba(255, 215, 0, 0.6)" style="animation-delay: 1.3s"/>

              <!-- Side Windows -->
              <rect class="window animate-draw" x="195" y="330" width="40" height="60" rx="2"
                    fill="rgba(255, 200, 100, 0.2)" stroke="#8b4513" stroke-width="2"
                    style="animation-delay: 1.2s"/>
              <rect class="window-glow small" x="200" y="340" width="30" height="40" rx="2"
                    fill="rgba(255, 215, 0, 0.5)" style="animation-delay: 1.4s"/>

              <rect class="window animate-draw" x="345" y="330" width="40" height="60" rx="2"
                    fill="rgba(255, 200, 100, 0.2)" stroke="#8b4513" stroke-width="2"
                    style="animation-delay: 1.3s"/>
              <rect class="window-glow small" x="350" y="340" width="30" height="40" rx="2"
                    fill="rgba(255, 215, 0, 0.5)" style="animation-delay: 1.5s"/>
            </g>

            <!-- Main Door - Arched -->
            <g class="main-door">
              <path class="door animate-draw" d="M260 520 L260 420 Q290 380 320 420 L320 520 Z" 
                    fill="rgba(92, 64, 51, 0.8)" stroke="#3d2817" stroke-width="3"
                    style="animation-delay: 1.4s"/>
              <!-- Door Light -->
              <rect class="door-glow" x="270" y="440" width="40" height="60" rx="3"
                    fill="rgba(255, 170, 68, 0.7)" style="animation-delay: 1.6s"/>
              <rect class="door-glow-inner" x="275" y="450" width="30" height="40" rx="2"
                    fill="rgba(255, 215, 0, 0.8)" style="animation-delay: 1.8s"/>
            </g>

            <!-- Balcony -->
            <g class="balcony">
              <rect class="sketch-line animate-draw" x="190" y="310" width="55" height="5" rx="1"
                    fill="#808080" stroke="#606060" stroke-width="1"
                    style="animation-delay: 1.5s"/>
              <rect class="sketch-line animate-draw" x="195" y="315" width="45" height="70" rx="1"
                    fill="none" stroke="#606060" stroke-width="2"
                    style="animation-delay: 1.6s"/>
            </g>

            <!-- Stairs -->
            <g class="stairs">
              <rect class="sketch-line animate-draw" x="160" y="520" width="260" height="12" rx="1"
                    fill="#a0a0a0" stroke="#808080" stroke-width="1"
                    style="animation-delay: 1.7s"/>
              <rect class="sketch-line animate-draw" x="150" y="535" width="280" height="12" rx="1"
                    fill="#b0b0b0" stroke="#909090" stroke-width="1"
                    style="animation-delay: 1.8s"/>
              <rect class="sketch-line animate-draw" x="140" y="550" width="300" height="12" rx="1"
                    fill="#c0c0c0" stroke="#a0a0a0" stroke-width="1"
                    style="animation-delay: 1.9s"/>
            </g>

            <!-- Lanterns -->
            <g class="lanterns">
              <circle class="lantern" cx="210" cy="480" r="8" fill="#ffd700" style="animation-delay: 2s"/>
              <circle class="lantern" cx="370" cy="480" r="8" fill="#ffd700" style="animation-delay: 2.1s"/>
            </g>

            <!-- Plants -->
            <g class="plants">
              <ellipse class="plant" cx="165" cy="510" rx="12" ry="15" fill="#228b22" style="animation-delay: 2.2s"/>
              <ellipse class="plant" cx="415" cy="510" rx="12" ry="15" fill="#228b22" style="animation-delay: 2.3s"/>
            </g>

            <!-- Dimension Lines -->
            <g class="dimensions" opacity="0.5">
              <line x1="180" y1="580" x2="400" y2="580" stroke="#5d6d7e" stroke-width="1" stroke-dasharray="5,3"/>
              <line x1="180" y1="575" x2="180" y2="585" stroke="#5d6d7e" stroke-width="1"/>
              <line x1="400" y1="575" x2="400" y2="585" stroke="#5d6d7e" stroke-width="1"/>
              <text x="290" y="595" text-anchor="middle" fill="#5d6d7e" font-size="12" font-family="Caveat, cursive">12.50m</text>
            </g>

            <!-- Annotations -->
            <g class="annotations" font-family="Caveat, cursive" font-size="14" fill="#5d6d7e">
              <text x="420" y="260">fenêtre</text>
              <text x="420" y="275">cintrée</text>
              <line x1="345" y1="260" x2="410" y2="260" stroke="#5d6d7e" stroke-width="0.5" stroke-dasharray="3,2"/>
              
              <text x="30" y="100">chêne</text>
              <text x="25" y="118">centenaire</text>
              
              <text x="420" y="450">entrée</text>
              <text x="420" y="468">principale</text>
              <line x1="325" y1="450" x2="410" y2="450" stroke="#5d6d7e" stroke-width="0.5" stroke-dasharray="3,2"/>
            </g>
          </svg>
        </div>

        <!-- Info Panel -->
        <div class="dream-info">
          <div class="info-card">
            <span class="card-icon">🏠</span>
            <h3>La Maison Bleue</h3>
            <p>Architecture où le code rencontre le croquis. Chaque ligne est une fondation, chaque fonction une fenêtre sur le possible.</p>
          </div>
          <div class="info-card">
            <span class="card-icon">🌳</span>
            <h3>Le Chêne</h3>
            <p>Racines profondes dans les fondamentaux. Branches qui s'étendent vers l'innovation. La croissance organique du code.</p>
          </div>
          <div class="info-card">
            <span class="card-icon">💡</span>
            <h3>Les Lumières</h3>
            <p>Chaque fenêtre éclairée est un projet en vie. L'énergie qui anime nos créations numériques.</p>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="dream-actions">
          <button class="action-btn" @click="$emit('close')">
            <span>↩️</span> Retour au Construct
          </button>
          <button class="action-btn primary" @click="navigateToArchitect">
            <span>📐</span> Explorer l'Univers Architect
          </button>
        </div>

        <!-- Secret Code Hint -->
        <div class="secret-hint">
          <span>🔓</span> Tu as découvert un easter egg ! Code : <code>architectsdream</code>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

defineProps({
  show: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['close']);

function navigateToArchitect() {
  window.location.href = '/architect';
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Caveat:wght@400;700&display=swap');

/* Transition */
.dream-fade-enter-active {
  transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}
.dream-fade-leave-active {
  transition: all 0.4s ease;
}
.dream-fade-enter-from,
.dream-fade-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

/* Main Container */
.architect-dream {
  position: fixed;
  inset: 0;
  z-index: 3000;
  background: linear-gradient(135deg, 
    rgba(250, 248, 245, 0.98) 0%,
    rgba(240, 245, 250, 0.98) 50%,
    rgba(245, 250, 245, 0.98) 100%
  );
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

/* Blueprint Grid */
.blueprint-bg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  opacity: 0.6;
}

/* Floating Notes */
.floating-notes {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 1;
}

.note {
  position: absolute;
  font-family: 'Caveat', cursive;
  font-size: 1rem;
  color: #5d6d7e;
  opacity: 0;
  animation: noteFloat 0.6s ease forwards;
}

.note--1 { top: 10%; left: 5%; transform: rotate(-8deg); }
.note--2 { top: 20%; right: 8%; transform: rotate(5deg); }
.note--3 { top: 45%; left: 3%; transform: rotate(-3deg); }
.note--4 { top: 60%; right: 5%; transform: rotate(7deg); font-family: 'JetBrains Mono', monospace; font-size: 0.8rem; }
.note--5 { top: 80%; left: 8%; transform: rotate(-6deg); }
.note--6 { top: 75%; right: 10%; transform: rotate(4deg); }

@keyframes noteFloat {
  from {
    opacity: 0;
    transform: translateY(20px) rotate(var(--rotate, 0deg));
  }
  to {
    opacity: 0.6;
    transform: translateY(0) rotate(var(--rotate, 0deg));
  }
}

/* Content */
.dream-content {
  position: relative;
  z-index: 10;
  width: 95%;
  max-width: 1100px;
  max-height: 95vh;
  overflow-y: auto;
  padding: 2rem;
}

/* Close Button */
.dream-close {
  position: absolute;
  top: 0;
  right: 0;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(42, 82, 152, 0.1);
  border: 1px solid rgba(42, 82, 152, 0.3);
  border-radius: 12px;
  color: #2a5298;
  cursor: pointer;
  transition: all 0.25s;
}

.dream-close svg {
  width: 24px;
  height: 24px;
}

.dream-close:hover {
  background: #2a5298;
  color: white;
  transform: rotate(90deg);
}

/* Header */
.dream-header {
  text-align: center;
  margin-bottom: 2rem;
}

.header-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.4rem 1rem;
  background: rgba(125, 154, 106, 0.2);
  border: 1px solid rgba(125, 154, 106, 0.4);
  border-radius: 20px;
  font-size: 0.7rem;
  letter-spacing: 0.15em;
  color: #7d9a6a;
  margin-bottom: 1rem;
}

.badge-pulse {
  width: 8px;
  height: 8px;
  background: #7d9a6a;
  border-radius: 50%;
  animation: badgePulse 2s ease-in-out infinite;
}

@keyframes badgePulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(0.8); }
}

.dream-title {
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 700;
  color: #2a5298;
  letter-spacing: 0.1em;
  margin-bottom: 0.5rem;
  text-shadow: 0 2px 10px rgba(42, 82, 152, 0.2);
}

.dream-subtitle {
  font-family: 'Caveat', cursive;
  font-size: 1.5rem;
  color: #5d6d7e;
}

/* House Container */
.house-container {
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
}

.house-svg {
  width: 100%;
  max-width: 500px;
  height: auto;
}

/* SVG Animations */
.animate-draw {
  stroke-dasharray: 1000;
  stroke-dashoffset: 1000;
  animation: drawLine 1.5s ease forwards;
}

@keyframes drawLine {
  to { stroke-dashoffset: 0; }
}

.animate-draw-rect {
  stroke-dasharray: 1200;
  stroke-dashoffset: 1200;
  animation: drawLine 2s ease forwards;
}

.animate-foliage {
  opacity: 0;
  transform-origin: center;
  animation: foliageGrow 0.8s ease forwards;
}

@keyframes foliageGrow {
  from {
    opacity: 0;
    transform: scale(0.5);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.window-glow, .door-glow, .door-glow-inner {
  opacity: 0;
  animation: glowFadeIn 0.5s ease forwards;
}

@keyframes glowFadeIn {
  to { opacity: 1; }
}

.window-glow, .door-glow, .door-glow-inner {
  animation: windowFlicker 4s ease-in-out infinite;
}

@keyframes windowFlicker {
  0%, 100% { opacity: 0.6; }
  50% { opacity: 0.9; }
  52% { opacity: 0.7; }
  54% { opacity: 0.9; }
}

.lantern {
  opacity: 0;
  animation: lanternGlow 0.5s ease forwards, lanternPulse 2s ease-in-out infinite 0.5s;
}

@keyframes lanternGlow {
  to { opacity: 1; }
}

@keyframes lanternPulse {
  0%, 100% { 
    r: 8;
    filter: drop-shadow(0 0 5px #ffd700);
  }
  50% { 
    r: 10;
    filter: drop-shadow(0 0 15px #ffd700);
  }
}

.plant {
  opacity: 0;
  animation: plantGrow 0.6s ease forwards;
}

@keyframes plantGrow {
  from {
    opacity: 0;
    transform: scaleY(0);
    transform-origin: bottom;
  }
  to {
    opacity: 1;
    transform: scaleY(1);
  }
}

/* Info Cards */
.dream-info {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.info-card {
  background: white;
  border: 1px solid rgba(42, 82, 152, 0.2);
  border-radius: 12px;
  padding: 1.5rem;
  text-align: center;
  transition: all 0.3s;
}

.info-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 40px rgba(42, 82, 152, 0.15);
  border-color: #2a5298;
}

.card-icon {
  font-size: 2rem;
  display: block;
  margin-bottom: 0.75rem;
}

.info-card h3 {
  font-size: 1rem;
  color: #2a5298;
  margin-bottom: 0.5rem;
}

.info-card p {
  font-size: 0.85rem;
  color: #5d6d7e;
  line-height: 1.5;
}

/* Actions */
.dream-actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 1.5rem;
}

.action-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.8rem 1.5rem;
  background: white;
  border: 1px solid rgba(42, 82, 152, 0.3);
  border-radius: 8px;
  color: #2a5298;
  font-family: inherit;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.25s;
}

.action-btn:hover {
  border-color: #2a5298;
  background: rgba(42, 82, 152, 0.05);
  transform: translateY(-2px);
}

.action-btn.primary {
  background: #2a5298;
  border-color: #2a5298;
  color: white;
}

.action-btn.primary:hover {
  background: #1a3a6e;
  box-shadow: 0 10px 30px rgba(42, 82, 152, 0.3);
}

/* Secret Hint */
.secret-hint {
  text-align: center;
  font-size: 0.75rem;
  color: #7d9a6a;
  padding: 0.75rem;
  background: rgba(125, 154, 106, 0.1);
  border-radius: 8px;
}

.secret-hint code {
  background: rgba(125, 154, 106, 0.2);
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.7rem;
}

/* Responsive */
@media (max-width: 768px) {
  .dream-content {
    padding: 1rem;
  }
  
  .floating-notes {
    display: none;
  }
  
  .dream-info {
    grid-template-columns: 1fr;
  }
  
  .dream-actions {
    flex-direction: column;
  }
  
  .action-btn {
    width: 100%;
    justify-content: center;
  }
}
</style>
