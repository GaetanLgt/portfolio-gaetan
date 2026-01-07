<template>
  <div class="matrix-reloaded" :class="{ unlocked: !locked }" ref="wrapper">
    <!-- CODE RAIN BACKGROUND -->
    <canvas ref="rainCanvas" class="rain-canvas"></canvas>

    <!-- PRELOADER -->
    <Transition name="fade-out">
      <div v-if="loading" class="preloader">
        <div class="loader-inner">
          <div class="matrix-logo">
            <span class="bracket">[</span>
            <span class="text">MATRIX</span>
            <span class="bracket">]</span>
          </div>
          <span class="loader-sub">RELOADED</span>
          <div class="loader-bar"><div :style="{width: loadPct+'%'}"></div></div>
          <p class="loader-txt">{{ loadTxt }}</p>
        </div>
      </div>
    </Transition>

    <!-- THREE.JS CONTAINER -->
    <div ref="threeContainer" class="three-container"></div>

    <!-- CROSSHAIR -->
    <div class="crosshair" v-if="!locked && !loading">
      <div class="cross-h"></div>
      <div class="cross-v"></div>
      <div class="cross-dot"></div>
    </div>

    <!-- HUD TOP LEFT - System Status -->
    <div class="hud-tl" v-if="!loading">
      <div class="system-status">
        <div class="status-header">
          <span class="pulse"></span>
          <span>SYSTEM ONLINE</span>
        </div>
        <div class="status-row">
          <span class="label">USER</span>
          <span class="value neo">NEO</span>
        </div>
        <div class="status-row">
          <span class="label">ACCESS</span>
          <span class="value admin">ADMIN</span>
        </div>
        <div class="status-row">
          <span class="label">NODES</span>
          <span class="value">{{ nodes.length }}</span>
        </div>
      </div>
      
      <!-- XP HUD -->
      <XPHud 
        class="xp-hud-wrapper" 
        @openAchievements="showAchievements = true" 
      />
      
      <!-- Minimap -->
      <Minimap 
        class="minimap-wrapper"
        :nodes="nodes"
        :playerPosition="playerPosition"
        :playerRotation="playerRotationY"
        :activeNodeId="activeNode?.id"
        :visitedNodes="playerData.visitedNodes"
      />
    </div>

    <!-- HUD TOP RIGHT - Controls -->
    <div class="hud-tr" v-if="!loading">
      <div class="controls-hint">
        <div><kbd>ZQSD</kbd> Naviguer</div>
        <div><kbd>ESPACE</kbd> Sauter</div>
        <div><kbd>SOURIS</kbd> Regarder</div>
        <div><kbd>CLIC</kbd> Interagir</div>
        <div><kbd>ESC</kbd> Libérer</div>
        <div><kbd>T</kbd> Opérateur</div>
        <div><kbd>H</kbd> Hologramme</div>
        <div><kbd>F</kbd> Workflows</div>
        <div><kbd>P</kbd> Pixel Art</div>
        <div><kbd>N</kbd> Neural Feed</div>
        <div><kbd>L</kbd> Labels</div>
      </div>
      <div class="hud-buttons">
        <button class="hologram-quick-btn" @click="openHologram" title="Vue holographique (H)">
          <span>🔮</span>
        </button>
        <button class="workflow-quick-btn" @click="openWorkflows" title="Workflows Lab (F)">
          <span>🔄</span>
        </button>
        <button class="pixelart-quick-btn" @click="openPixelArt" title="Pixel Art Lab (P)">
          <span>🎨</span>
        </button>
        <button class="techfeed-quick-btn" @click="openTechFeed" title="Neural Feed (N)">
          <span>📡</span>
        </button>
        <button class="operator-quick-btn" @click="openOperator" title="Charger des programmes">
          <span>📞</span>
        </button>
        <button class="exit-btn" @click="exitMatrix">
          <span>EXIT</span>
        </button>
      </div>
    </div>

    <!-- HUD TOP CENTER - Location -->
    <div class="hud-tc" v-if="!loading && !locked">
      <div class="location">
        <span class="loc-icon">◉</span>
        <span class="loc-text">THE CONSTRUCT</span>
      </div>
    </div>

    <!-- NODE INFO PANEL -->
    <Transition name="slide">
      <div v-if="activeNode" class="node-panel">
        <button class="panel-close" @click="activeNode = null">✕</button>
        <div class="panel-header">
          <span class="panel-icon">{{ activeNode.icon }}</span>
          <div>
            <h2>{{ activeNode.name }}</h2>
            <span class="panel-type">{{ activeNode.type }}</span>
          </div>
        </div>
        <p class="panel-desc">{{ activeNode.description }}</p>
        
        <!-- Stats -->
        <div class="panel-stats" v-if="activeNode.stats">
          <div v-for="(val, key) in activeNode.stats" :key="key" class="stat-item">
            <span class="stat-label">{{ key }}</span>
            <span class="stat-value">{{ val }}</span>
          </div>
        </div>

        <!-- Links -->
        <div class="panel-links" v-if="activeNode.links">
          <a v-for="link in activeNode.links" :key="link.url" 
             :href="link.url" target="_blank" class="panel-link">
            <span>{{ link.icon }}</span>
            {{ link.label }}
          </a>
        </div>

        <!-- Gallery Preview -->
        <div class="panel-gallery" v-if="activeNode.gallery">
          <div v-for="(img, i) in activeNode.gallery.slice(0, 4)" :key="i" 
               class="gallery-thumb" @click="openGallery(activeNode)">
            <div class="thumb-placeholder">{{ i + 1 }}</div>
          </div>
          <button v-if="activeNode.gallery.length > 4" class="gallery-more" @click="openGallery(activeNode)">
            +{{ activeNode.gallery.length - 4 }} more
          </button>
        </div>
      </div>
    </Transition>

    <!-- GALLERY OVERLAY -->
    <Transition name="fade">
      <div v-if="showGallery" class="gallery-overlay" @click.self="showGallery = false">
        <div class="gallery-container">
          <button class="gallery-close" @click="showGallery = false">✕</button>
          <h2>{{ galleryNode?.name }} — GALERIE</h2>
          <div class="gallery-grid">
            <div v-for="(item, i) in galleryNode?.gallery" :key="i" class="gallery-item">
              <div class="gallery-placeholder">
                <span>{{ item.title || `Œuvre ${i + 1}` }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- WELCOME OVERLAY -->
    <Transition name="fade">
      <div v-if="showWelcome && !loading" class="welcome-overlay" @click="enterMatrix">
        <div class="welcome-content">
          <div class="welcome-text">
            <span class="line line-1">Wake up, Neo...</span>
            <span class="line line-2">The Matrix has you...</span>
            <span class="line line-3">Follow the white rabbit.</span>
          </div>
          <button class="enter-btn">
            <span class="btn-icon">🐇</span>
            <span>ENTER THE MATRIX</span>
          </button>
        </div>
      </div>
    </Transition>

    <!-- TERMINAL (mini) -->
    <div class="mini-terminal" v-if="!loading && !locked">
      <div class="terminal-line" v-for="(line, i) in terminalLines" :key="i">
        <span class="prompt">></span> {{ line }}
      </div>
    </div>

    <!-- CHEAT NOTIFICATION -->
    <Transition name="cheat-pop">
      <div v-if="cheatNotification" class="cheat-notification">
        <span class="cheat-icon">{{ cheatNotification.icon }}</span>
        <div class="cheat-info">
          <span class="cheat-name">{{ cheatNotification.name }}</span>
          <span class="cheat-desc">{{ cheatNotification.desc }}</span>
        </div>
      </div>
    </Transition>

    <!-- CHEAT LIST OVERLAY -->
    <Transition name="fade">
      <div v-if="showCheatList" class="cheat-overlay" @click.self="showCheatList = false">
        <div class="cheat-list-container">
          <button class="cheat-close" @click="showCheatList = false">✕</button>
          <h2>🔓 CHEATCODES</h2>
          <p class="cheat-hint">Tape les codes pendant le jeu (sans espaces)</p>
          <div class="cheat-grid">
            <div v-for="(cheat, code) in CHEATCODES" :key="code" class="cheat-item">
              <span class="item-icon">{{ cheat.icon }}</span>
              <div class="item-info">
                <span class="item-name">{{ cheat.name }}</span>
                <code class="item-code">{{ code }}</code>
                <span class="item-desc">{{ cheat.desc }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- HOLOGRAPHIC SITEMAP OVERLAY -->
    <Transition name="holo-fade">
      <div 
        v-if="showHologram" 
        class="hologram-overlay" 
        @click.self="closeHologram"
        @keydown.escape="closeHologram"
        tabindex="-1"
        ref="hologramOverlay"
      >
        <div class="hologram-container">
          <!-- Close button -->
          <button class="holo-close" @click="closeHologram" aria-label="Fermer">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
          
          <!-- Header -->
          <div class="holo-header">
            <div class="holo-badge">
              <span class="holo-pulse"></span>
              <span>HOLOGRAPHIC SITEMAP</span>
            </div>
            <h2 class="holo-title">GL DIGITAL LAB</h2>
            <p class="holo-subtitle">{{ siteStructure.length }} routes • {{ getTotalPages() }} pages • Architecture complète</p>
          </div>
          
          <!-- 3D Tree Visualization -->
          <div class="holo-tree-container">
            <div class="holo-tree">
              <!-- Central Node (Root) -->
              <div class="holo-center">
                <div class="center-node" @click="navigateTo('/')">
                  <div class="center-glow"></div>
                  <span class="center-icon">🏠</span>
                  <span class="center-label">HOME</span>
                </div>
              </div>
              
              <!-- Orbital Sections -->
              <div class="holo-orbits">
                <div 
                  v-for="(section, sIndex) in siteStructure" 
                  :key="section.id"
                  class="orbit-section"
                  :style="getOrbitStyle(sIndex)"
                >
                  <!-- Section Node -->
                  <div 
                    class="section-node"
                    :class="{ expanded: expandedSection === section.id }"
                    :style="{ '--section-color': section.color }"
                    @click="toggleSection(section.id)"
                  >
                    <div class="section-ring"></div>
                    <span class="section-icon">{{ section.icon }}</span>
                    <span class="section-label">{{ section.name }}</span>
                    <span class="section-count">{{ section.routes.length }}</span>
                  </div>
                  
                  <!-- Child Routes (expanded) -->
                  <Transition name="routes-expand">
                    <div v-if="expandedSection === section.id" class="section-routes">
                      <div 
                        v-for="(route, rIndex) in section.routes.slice(0, 12)" 
                        :key="route.path"
                        class="route-node"
                        :style="getRouteStyle(rIndex, section.routes.length)"
                        @click.stop="navigateTo(route.path)"
                      >
                        <span class="route-icon">{{ route.icon || '📄' }}</span>
                        <span class="route-name">{{ route.name }}</span>
                        <span class="route-path">{{ route.path }}</span>
                      </div>
                      <div v-if="section.routes.length > 12" class="routes-more">
                        +{{ section.routes.length - 12 }} more
                      </div>
                    </div>
                  </Transition>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Stats Bar -->
          <div class="holo-stats">
            <div class="stat-item">
              <span class="stat-value">{{ siteStructure.length }}</span>
              <span class="stat-label">SECTIONS</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">{{ getTotalPages() }}</span>
              <span class="stat-label">PAGES</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">24+</span>
              <span class="stat-label">UNIVERS</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">50+</span>
              <span class="stat-label">APPS</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">13</span>
              <span class="stat-label">AGENTS IA</span>
            </div>
          </div>
          
          <!-- Quick Navigation -->
          <div class="holo-quicknav">
            <button 
              v-for="section in siteStructure" 
              :key="section.id"
              class="quicknav-btn"
              :style="{ '--btn-color': section.color }"
              @click="expandedSection = section.id"
            >
              <span>{{ section.icon }}</span>
              {{ section.name }}
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- WORKFLOWS VISUALIZER -->
    <WorkflowVisualizer v-if="showWorkflows" @close="showWorkflows = false" />

    <!-- PIXEL ART EDITOR -->
    <PixelArtEditor v-if="showPixelArt" @close="showPixelArt = false" />

    <!-- ACHIEVEMENTS PANEL -->
    <AchievementsPanel 
      :show="showAchievements" 
      @close="showAchievements = false" 
    />

    <!-- TECH FEED -->
    <TechFeed 
      :show="showTechFeed" 
      @close="showTechFeed = false" 
    />

    <!-- MOBILE CONTROLS -->
    <MobileControls
      v-if="isMobile && !loading && !showWelcome"
      :nearbyNode="hoveredNode"
      :playerXP="playerData.totalXP"
      @move="handleMobileMove"
      @look="handleMobileLook"
      @jump="handleMobileJump"
      @interact="handleMobileInteract"
      @openOperator="openOperator"
      @openHologram="openHologram"
      @openWorkflows="openWorkflows"
      @openPixelArt="openPixelArt"
      @openTechFeed="openTechFeed"
      @exit="exitMatrix"
    />

    <!-- OPERATOR LINK - LOAD PROGRAMS -->
    <Transition name="operator-slide">
      <div 
        v-if="showOperator" 
        class="operator-overlay" 
        @click.self="closeOperator"
        @keydown.escape="closeOperator"
        role="dialog"
        aria-modal="true"
        aria-labelledby="operator-title"
      >
        <div class="operator-container" ref="operatorContainer">
          <!-- Scanlines effect -->
          <div class="operator-scanlines" aria-hidden="true"></div>
          
          <button 
            class="operator-close" 
            @click="closeOperator"
            aria-label="Fermer le menu Opérateur"
            ref="closeBtn"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
          
          <div class="operator-header">
            <div class="operator-avatar" aria-hidden="true">
              <div class="avatar-ring"></div>
              <span class="avatar-icon">📞</span>
              <div class="avatar-pulse"></div>
            </div>
            <div class="operator-info">
              <h2 id="operator-title">OPERATOR LINK</h2>
              <div class="operator-status">
                <span class="status-indicator" aria-hidden="true"></span>
                <span>TANK EN LIGNE</span>
                <span class="status-latency">12ms</span>
              </div>
            </div>
          </div>
          
          <blockquote class="operator-intro">
            <span class="quote-mark" aria-hidden="true">“</span>
            Neo, j'ai ce qu'il te faut. Qu'est-ce que tu veux charger ?
            <span class="quote-mark" aria-hidden="true">”</span>
          </blockquote>
          
          <!-- Catégories avec navigation clavier -->
          <nav class="program-categories" role="tablist" aria-label="Catégories de programmes">
            <button 
              v-for="cat in programCategories" 
              :key="cat.id"
              class="cat-btn"
              :class="{ active: activeProgramCat === cat.id }"
              @click="activeProgramCat = cat.id"
              role="tab"
              :aria-selected="activeProgramCat === cat.id"
              :aria-controls="`panel-${cat.id}`"
              :id="`tab-${cat.id}`"
            >
              <span class="cat-icon" aria-hidden="true">{{ cat.icon }}</span>
              <span class="cat-name">{{ cat.name }}</span>
              <span class="cat-count">{{ getProgramCountByCategory(cat.id) }}</span>
            </button>
          </nav>
          
          <!-- Grille de programmes -->
          <div 
            class="programs-grid"
            role="tabpanel"
            :id="`panel-${activeProgramCat}`"
            :aria-labelledby="`tab-${activeProgramCat}`"
          >
            <TransitionGroup name="program-list">
              <button 
                v-for="(prog, index) in filteredPrograms" 
                :key="prog.id"
                class="program-card"
                :class="{ loaded: loadedPrograms.includes(prog.id) }"
                @click="loadProgram(prog)"
                :style="{ '--delay': `${index * 50}ms` }"
                :aria-label="`${prog.name} - ${prog.desc}. ${loadedPrograms.includes(prog.id) ? 'Chargé, cliquer pour exécuter' : 'Cliquer pour charger'}`"
              >
                <div class="prog-glow" aria-hidden="true"></div>
                <div class="prog-icon">{{ prog.icon }}</div>
                <div class="prog-info">
                  <span class="prog-name">{{ prog.name }}</span>
                  <span class="prog-desc">{{ prog.desc }}</span>
                </div>
                <div class="prog-status">
                  <span v-if="loadedPrograms.includes(prog.id)" class="loaded-badge">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" aria-hidden="true">
                      <path d="M20 6L9 17l-5-5"/>
                    </svg>
                    READY
                  </span>
                  <span v-else class="load-btn">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                      <path d="M12 5v14M5 12h14"/>
                    </svg>
                    LOAD
                  </span>
                </div>
                <div class="prog-loader" aria-hidden="true"></div>
              </button>
            </TransitionGroup>
          </div>
          
          <!-- Loaded Programs Bar -->
          <Transition name="slide-up">
            <div class="loaded-bar" v-if="loadedPrograms.length > 0" role="status" aria-live="polite">
              <div class="loaded-header">
                <span class="loaded-label">PROGRAMMES CHARGÉS</span>
                <span class="loaded-count">{{ loadedPrograms.length }}</span>
              </div>
              <div class="loaded-list">
                <button 
                  v-for="progId in loadedPrograms" 
                  :key="progId"
                  class="loaded-item"
                  @click="executeProgram(progId)"
                  :aria-label="`Exécuter ${getProgramById(progId)?.name}`"
                >
                  <span class="item-icon">{{ getProgramById(progId)?.icon }}</span>
                  <span class="item-name">{{ getProgramById(progId)?.name }}</span>
                  <span class="item-exec" aria-hidden="true">▶</span>
                </button>
              </div>
            </div>
          </Transition>
          
          <footer class="operator-footer">
            <div class="footer-hint">
              <kbd>ESC</kbd> pour fermer • <kbd>TAB</kbd> pour naviguer
            </div>
            <div class="footer-actions">
              <button class="operator-btn" @click="loadRandomProgram" aria-label="Charger un programme aléatoire">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                  <rect x="4" y="4" width="16" height="16" rx="2"/>
                  <circle cx="8" cy="8" r="1.5" fill="currentColor"/>
                  <circle cx="16" cy="8" r="1.5" fill="currentColor"/>
                  <circle cx="8" cy="16" r="1.5" fill="currentColor"/>
                  <circle cx="16" cy="16" r="1.5" fill="currentColor"/>
                  <circle cx="12" cy="12" r="1.5" fill="currentColor"/>
                </svg>
                SURPRISE
              </button>
              <button 
                class="operator-btn operator-btn--primary" 
                @click="executeAllPrograms"
                :disabled="loadedPrograms.length === 0"
                aria-label="Exécuter tous les programmes chargés"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                  <polygon points="5 3 19 12 5 21 5 3" fill="currentColor"/>
                </svg>
                EXECUTE {{ loadedPrograms.length > 0 ? `(${loadedPrograms.length})` : '' }}
              </button>
            </div>
          </footer>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted, watch } from 'vue';
import * as THREE from 'three';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';

// Import des données refactorisées
import { 
  nodes as nodesData, 
  NODE_TYPES,
  nodeConnections, 
  particleConfig, 
  lineConfig 
} from './data/index.js';
import { 
  programs, 
  programCategories, 
  getProgramById, 
  getProgramCountByCategory 
} from './data/programs.js';
import { siteStructure, getTotalPages } from './data/siteStructure.js';
import { morpheusQuotes } from './data/cheatcodes.js';

// Import des composables
import { createAllLabels, updateLabels, setLabelsVisible } from './composables/useNodeLabels.js';
import { createNodeMesh, animateNodes } from './composables/useNodeShapes.js';

// Import des composants interactifs du Construct
import WorkflowVisualizer from './components/WorkflowVisualizer.vue';
import PixelArtEditor from './components/PixelArtEditor.vue';
import XPHud from './components/XPHud.vue';
import AchievementsPanel from './components/AchievementsPanel.vue';
import Minimap from './components/Minimap.vue';
import MobileControls from './components/mobile/MobileControls.vue';
import TechFeed from './components/TechFeed.vue';

// Import du système de gamification
import { useGameProgress } from './composables/useGameProgress.js';
import { useAchievements } from './composables/useAchievements.js';

// Import des effets Matrix Awakens style
import { MatrixRain3D } from './components/effects/MatrixRain3D.js';
import { CyberpunkSkyline } from './components/effects/CyberpunkSkyline.js';
import { MatrixPostProcessing } from './components/effects/MatrixPostProcessing.js';
import { SpaceVehicles } from './components/effects/SpaceVehicles.js';
import { EFFECT_PRESETS } from './components/effects/index.js';

// ============================================================================
// STATE
// ============================================================================
const loading = ref(true);
const loadPct = ref(0);
const loadTxt = ref('Initialisation système...');
const locked = ref(true);
const showWelcome = ref(true);

const wrapper = ref(null);
const threeContainer = ref(null);
const rainCanvas = ref(null);

const activeNode = ref(null);
const showGallery = ref(false);
const galleryNode = ref(null);
const hoveredNode = ref(null);

// Interactive features
const showWorkflows = ref(false);
const showPixelArt = ref(false);
const showAchievements = ref(false);
const showTechFeed = ref(false);

// Mobile detection
const isMobile = ref(false);
const mobileJoystickMove = reactive({ x: 0, y: 0 });
const mobileJoystickLook = reactive({ x: 0, y: 0 });

// Gamification system
const { 
  playerData, 
  visitNode, 
  useCheatcode, 
  openFeature,
  incrementSession,
  addTimeSpent 
} = useGameProgress();

// Note: checkAchievements sera initialisé après la définition de nodes
let checkAchievements, achievementNotification;

// Player position for minimap (objet réactif pour éviter recréation)
const playerPosition = reactive({ x: 0, y: 2, z: 15 });
const playerRotationY = ref(0);

const terminalLines = ref([
  'System initialized',
  'Loading nodes...',
  'Connection established'
]);

// ============================================================================
// CHEATCODES SYSTEM
// ============================================================================
const cheatBuffer = ref('');
const cheatActive = reactive({
  godmode: false,
  fly: false,
  noclip: false,
  slowmo: false,
  agent: false,
  redpill: false,
  bluepill: false,
  kung_fu: false,
  nebuchadnezzar: false
});

const CHEATCODES = {
  'thereisno spoon': { id: 'godmode', name: 'GOD MODE', icon: '🥄', desc: 'Invincibilité totale', effect: () => { cheatActive.godmode = true; applyGodMode(); } },
  'iknow kungfu': { id: 'kung_fu', name: 'KUNG-FU MASTER', icon: '🥋', desc: 'Vitesse x2', effect: () => { cheatActive.kung_fu = true; moveSpeed = 100; } },
  'followthe whiterabbit': { id: 'nebuchadnezzar', name: 'NEBUCHADNEZZAR', icon: '🐇', desc: 'Révèle tous les nodes', effect: () => { cheatActive.nebuchadnezzar = true; revealAllNodes(); } },
  'redpill': { id: 'redpill', name: 'RED PILL', icon: '💊', desc: 'Vision thermique', effect: () => { cheatActive.redpill = true; applyRedPill(); } },
  'bluepill': { id: 'bluepill', name: 'BLUE PILL', icon: '💊', desc: 'Retour à la normale', effect: () => { resetAllCheats(); } },
  'agentsmith': { id: 'agent', name: 'AGENT SMITH', icon: '🕴️', desc: 'Clone les nodes', effect: () => { cheatActive.agent = true; cloneNodes(); } },
  'bullet time': { id: 'slowmo', name: 'BULLET TIME', icon: '🔫', desc: 'Ralenti Matrix', effect: () => { cheatActive.slowmo = !cheatActive.slowmo; applySlowMo(); } },
  'freefly': { id: 'fly', name: 'FREE FLY', icon: '🦅', desc: 'Vol libre', effect: () => { cheatActive.fly = !cheatActive.fly; } },
  'noclip': { id: 'noclip', name: 'NO CLIP', icon: '👻', desc: 'Traverse les murs', effect: () => { cheatActive.noclip = !cheatActive.noclip; } },
  'showme everything': { id: 'reveal', name: 'REVEAL ALL', icon: '👁️', desc: 'Affiche la liste des cheats', effect: () => { showCheatList.value = true; } },
  'morpheus': { id: 'morpheus', name: 'MORPHEUS', icon: '😎', desc: 'Citation aléatoire', effect: () => { showMorpheusQuote(); } },
  'trinity': { id: 'trinity', name: 'TRINITY', icon: '🏍️', desc: 'Effet néon', effect: () => { applyTrinityEffect(); } },
  'zion': { id: 'zion', name: 'ZION', icon: '🏛️', desc: 'Téléporte au centre', effect: () => { teleportToCenter(); } },
  'architect': { id: 'architect', name: 'THE ARCHITECT', icon: '🧓', desc: 'Mode debug', effect: () => { toggleDebugMode(); } },
  'glitch': { id: 'glitch', name: 'GLITCH', icon: '📺', desc: 'Effet glitch', effect: () => { applyGlitchEffect(); } },
  'tank': { id: 'tank', name: 'OPERATOR LINK', icon: '📞', desc: 'Charger des programmes', effect: () => { openOperator(); } },
  'loadweapons': { id: 'loadweapons', name: 'LOAD WEAPONS', icon: '🔫', desc: 'Menu de chargement rapide', effect: () => { openOperator(); } },
  'operator': { id: 'operator', name: 'CALL OPERATOR', icon: '☎️', desc: 'Contacter Tank', effect: () => { openOperator(); } },
  'ineedguns': { id: 'ineedguns', name: 'GUNS. LOTS OF GUNS.', icon: '💥', desc: 'Chargement massif d\'armes', effect: () => { loadAllWeapons(); } },
  'holistic': { id: 'holistic', name: 'HOLISTIC MAP', icon: '🗺️', desc: 'Carte de GL Tower', effect: () => { navigateTo('/carte-holistique'); } },
  'gltower': { id: 'gltower', name: 'GL TOWER', icon: '🏢', desc: 'Retour au QG', effect: () => { navigateTo('/hub'); } },
  'arkadia': { id: 'arkadia', name: 'ARKADIA', icon: '🦖', desc: 'Cluster gaming', effect: () => { navigateTo('/arkadia'); } },
  'hologram': { id: 'hologram', name: 'HOLOGRAPHIC SITEMAP', icon: '🔮', desc: 'Vue holographique du site', effect: () => { openHologram(); } },
  'sitemap': { id: 'sitemap', name: 'SITE STRUCTURE', icon: '🌐', desc: 'Architecture complète', effect: () => { openHologram(); } },
  'architect': { id: 'architect', name: 'THE ARCHITECT', icon: '👨‍💻', desc: 'Voir la structure', effect: () => { openHologram(); } },
  'workflows': { id: 'workflows', name: 'WORKFLOWS LAB', icon: '🔄', desc: 'Visualiser les workflows n8n', effect: () => { openWorkflows(); } },
  'n8n': { id: 'n8n', name: 'N8N STUDIO', icon: '⚡', desc: 'Automatisations agents', effect: () => { openWorkflows(); } },
  'pixelart': { id: 'pixelart', name: 'PIXEL ART LAB', icon: '🎨', desc: 'Éditeur pixel art', effect: () => { openPixelArt(); } },
  'sprite': { id: 'sprite', name: 'SPRITE EDITOR', icon: '🖼️', desc: 'Créer des sprites', effect: () => { openPixelArt(); } },
  // Matrix Awakens Effects
  'rain': { id: 'rain', name: 'TOGGLE RAIN', icon: '🌧️', desc: 'Activer/désactiver la pluie 3D', effect: () => { toggleRain3D(); } },
  'storm': { id: 'storm', name: 'STORM MODE', icon: '⛈️', desc: 'Pluie intense + vent', effect: () => { activateStormMode(); } },
  'cinematic': { id: 'cinematic', name: 'CINEMATIC MODE', icon: '🎬', desc: 'Post-processing cinématique', effect: () => { activateCinematicMode(); } },
  'clean': { id: 'clean', name: 'CLEAN MODE', icon: '✨', desc: 'Mode visuel propre', effect: () => { activateCleanMode(); } },
  'city': { id: 'city', name: 'TOGGLE SKYLINE', icon: '🏙️', desc: 'Afficher/masquer la ville', effect: () => { toggleSkyline(); } },
  // Space Vehicles
  'ships': { id: 'ships', name: 'TOGGLE SHIPS', icon: '🚀', desc: 'Activer/désactiver les vaisseaux', effect: () => { toggleShips(); } },
  'sentinel': { id: 'sentinel', name: 'SPAWN SENTINEL', icon: '🤖', desc: 'Invoquer une Sentinelle', effect: () => { spawnSentinel(); } },
  'fleet': { id: 'fleet', name: 'SPAWN FLEET', icon: '🛩️', desc: 'Invoquer une flotte', effect: () => { spawnFleet(); } },
  'invasion': { id: 'invasion', name: 'ALIEN INVASION', icon: '🛸', desc: 'Invasion extraterrestre!', effect: () => { alienInvasion(); } },
  'nebuchadnezzar': { id: 'nebuchadnezzar', name: 'NEBUCHADNEZZAR', icon: '⚓', desc: 'Invoquer le Nebuchadnezzar', effect: () => { spawnNebuchadnezzar(); } },
  // Performance
  'turbo': { id: 'turbo', name: 'TURBO MODE', icon: '⚡', desc: 'Mode performance max', effect: () => { activateTurboMode(); } },
  'ultra': { id: 'ultra', name: 'ULTRA MODE', icon: '🔥', desc: 'Tous les effets à fond', effect: () => { activateUltraMode(); } },
};

const showCheatList = ref(false);
const cheatNotification = ref(null);
let moveSpeed = 50;
let debugMode = false;

// ============================================================================
// OPERATOR LINK - LOAD PROGRAMS SYSTEM (utilise les imports)
// ============================================================================
const showOperator = ref(false);
const activeProgramCat = ref('weapons');
const loadedPrograms = ref([]);

// Computed pour filtrer les programmes par catégorie
const filteredPrograms = computed(() => {
  return programs.filter(p => p.category === activeProgramCat.value);
});

function loadProgram(prog) {
  if (loadedPrograms.value.includes(prog.id)) {
    // Déjà chargé -> Exécuter
    executeProgram(prog.id);
  } else {
    // Charger le programme
    loadedPrograms.value.push(prog.id);
    addTerminalLine(`LOADING: ${prog.name}...`);
    
    // Effet visuel de chargement
    cheatNotification.value = {
      icon: prog.icon,
      name: `${prog.name} LOADED`,
      desc: prog.desc
    };
    
    setTimeout(() => {
      cheatNotification.value = null;
      addTerminalLine(`${prog.name} ready for execution.`);
    }, 1500);
  }
}

function executeProgram(progId) {
  const prog = getProgramById(progId);
  if (prog && prog.url) {
    addTerminalLine(`EXECUTING: ${prog.name}`);
    // Petit délai avant navigation pour l'effet
    setTimeout(() => {
      window.location.href = prog.url;
    }, 500);
  }
}

function executeAllPrograms() {
  if (loadedPrograms.value.length === 0) {
    addTerminalLine('No programs loaded. Load some first!');
    return;
  }
  
  addTerminalLine('EXECUTING ALL PROGRAMS...');
  
  // Affiche les URLs dans le terminal
  loadedPrograms.value.forEach((progId, i) => {
    const prog = getProgramById(progId);
    setTimeout(() => {
      addTerminalLine(`[${i + 1}] ${prog.name} -> ${prog.url}`);
    }, i * 200);
  });
  
  // Ouvre le premier dans l'onglet actuel
  const firstProg = getProgramById(loadedPrograms.value[0]);
  setTimeout(() => {
    window.location.href = firstProg.url;
  }, loadedPrograms.value.length * 200 + 500);
}

function loadRandomProgram() {
  const unloaded = programs.filter(p => !loadedPrograms.value.includes(p.id));
  if (unloaded.length > 0) {
    const random = unloaded[Math.floor(Math.random() * unloaded.length)];
    loadProgram(random);
  } else {
    addTerminalLine('All programs already loaded!');
  }
}

function openOperator() {
  showOperator.value = true;
  addTerminalLine('Operator link established.');
  // Libérer le curseur pour pouvoir interagir avec le menu
  if (controls && controls.isLocked) {
    controls.unlock();
  }
  // Focus sur le premier élément interactif pour l'accessibilité
  setTimeout(() => {
    const firstBtn = document.querySelector('.operator-container .cat-btn');
    if (firstBtn) firstBtn.focus();
  }, 100);
}

function closeOperator() {
  showOperator.value = false;
  addTerminalLine('Operator link terminated.');
}

function loadAllWeapons() {
  // Charge toutes les "armes" (outils dev)
  const weapons = programs.filter(p => p.category === 'weapons');
  weapons.forEach((prog, i) => {
    setTimeout(() => {
      if (!loadedPrograms.value.includes(prog.id)) {
        loadedPrograms.value.push(prog.id);
        addTerminalLine(`LOADED: ${prog.name}`);
      }
    }, i * 200);
  });
  
  // Ouvre l'opérateur après le chargement
  setTimeout(() => {
    showOperator.value = true;
    addTerminalLine('Guns. Lots of guns.');
  }, weapons.length * 200 + 500);
}

function navigateTo(url) {
  addTerminalLine(`NAVIGATING TO: ${url}`);
  setTimeout(() => {
    window.location.href = url;
  }, 500);
}

// ============================================================================
// HOLOGRAPHIC SITEMAP SYSTEM (utilise siteStructure importé)
// ============================================================================
const showHologram = ref(false);
const expandedSection = ref(null);
const hologramOverlay = ref(null);

function openHologram() {
  showHologram.value = true;
  if (controls && controls.isLocked) {
    controls.unlock();
  }
  addTerminalLine('HOLOGRAPHIC SITEMAP ACTIVATED');
  // Focus pour permettre ESC
  setTimeout(() => {
    if (hologramOverlay.value) {
      hologramOverlay.value.focus();
    }
  }, 100);
}

function closeHologram() {
  showHologram.value = false;
  expandedSection.value = null;
  addTerminalLine('Hologram deactivated.');
}

// ============================================================================
// WORKFLOWS & PIXEL ART INTERACTIVE FEATURES
// ============================================================================
function openWorkflows() {
  showWorkflows.value = true;
  if (controls && controls.isLocked) {
    controls.unlock();
  }
  // Track feature opening
  openFeature('workflows');
  checkAchievements();
  addTerminalLine('WORKFLOWS LAB activated. 100+ n8n workflows loaded.');
}

function openPixelArt() {
  showPixelArt.value = true;
  if (controls && controls.isLocked) {
    controls.unlock();
  }
  // Track feature opening
  openFeature('pixelart');
  checkAchievements();
  addTerminalLine('PIXEL ART LAB activated. Create your sprites.');
}

function openTechFeed() {
  showTechFeed.value = true;
  if (controls && controls.isLocked) {
    controls.unlock();
  }
  openFeature('techfeed');
  checkAchievements();
  addTerminalLine('NEURAL FEED activated. Tech & IA insights loaded.');
}

// Mobile controls handlers
function handleMobileMove(input) {
  mobileJoystickMove.x = input.x;
  mobileJoystickMove.y = input.y;
}

function handleMobileLook(input) {
  mobileJoystickLook.x = input.x;
  mobileJoystickLook.y = input.y;
}

function handleMobileJump() {
  if (camera && camera.position.y <= 2.1) {
    velocity.y = 12;
  }
}

function handleMobileInteract() {
  // Simulate click for node interaction
  if (hoveredNode.value) {
    const node = hoveredNode.value;
    const result = visitNode(node.id);
    if (result.isFirst) {
      addTerminalLine(`[+${result.xp} XP] First discovery: ${node.name}`);
    }
    checkAchievements();
    activeNode.value = node;
    addTerminalLine(`Accessing node: ${node.name}`);
  }
}

function checkMobile() {
  isMobile.value = /mobile|android|iphone|ipad|tablet/i.test(navigator.userAgent) || 
                   window.innerWidth <= 1024;
}

function toggleSection(sectionId) {
  if (expandedSection.value === sectionId) {
    expandedSection.value = null;
  } else {
    expandedSection.value = sectionId;
  }
}

function getOrbitStyle(index) {
  const total = siteStructure.length;
  const angleRad = ((360 / total) * index - 90) * (Math.PI / 180); // Convert to radians, start from top
  const radius = 250; // Distance from center
  const x = Math.cos(angleRad) * radius;
  const y = Math.sin(angleRad) * radius;
  return {
    '--angle': `${(360 / total) * index}deg`,
    left: `calc(50% + ${x}px)`,
    top: `calc(50% + ${y}px)`,
    transform: 'translate(-50%, -50%)'
  };
}

function getRouteStyle(index, total) {
  const limitedTotal = Math.min(total, 12);
  const angle = (360 / limitedTotal) * index;
  return {
    '--route-angle': `${angle}deg`,
    '--route-delay': `${index * 50}ms`
  };
}

function handleCheatInput(key) {
  // Ajoute la touche au buffer
  cheatBuffer.value += key.toLowerCase();
  
  // Limite la taille du buffer
  if (cheatBuffer.value.length > 30) {
    cheatBuffer.value = cheatBuffer.value.slice(-30);
  }
  
  // Vérifie si un cheatcode match
  for (const [code, cheat] of Object.entries(CHEATCODES)) {
    if (cheatBuffer.value.endsWith(code.replace(/ /g, ''))) {
      activateCheat(cheat);
      cheatBuffer.value = '';
      break;
    }
  }
}

function activateCheat(cheat) {
  // Track cheatcode for gamification
  const cheatResult = useCheatcode(cheat.id);
  
  // Notification
  cheatNotification.value = {
    icon: cheat.icon,
    name: cheat.name,
    desc: cheat.desc
  };
  
  // Terminal log with XP
  if (cheatResult.isFirst) {
    addTerminalLine(`[+${cheatResult.xp} XP] CHEAT DISCOVERED: ${cheat.name}`);
  } else {
    addTerminalLine(`CHEAT ACTIVATED: ${cheat.name}`);
  }
  
  // Check achievements
  checkAchievements();
  
  // Execute effect
  cheat.effect();
  
  // Clear notification after 3s
  setTimeout(() => {
    cheatNotification.value = null;
  }, 3000);
}

function applyGodMode() {
  // Effet visuel doré
  scene.fog = new THREE.FogExp2(0x332200, 0.008);
  addTerminalLine('There is no spoon...');
}

function applyRedPill() {
  // Change la couleur de la scène en rouge
  scene.fog = new THREE.FogExp2(0x110000, 0.015);
  nodeMeshes.forEach(mesh => {
    mesh.material.color.setHex(0xff0000);
    mesh.material.emissive.setHex(0xff0000);
  });
  addTerminalLine('Welcome to the real world.');
}

function resetAllCheats() {
  Object.keys(cheatActive).forEach(key => {
    cheatActive[key] = false;
  });
  moveSpeed = 50;
  scene.fog = new THREE.FogExp2(0x001100, 0.015);
  // Reset node colors
  nodeMeshes.forEach((mesh, i) => {
    const originalColor = nodes[i].color;
    mesh.material.color.setHex(originalColor);
    mesh.material.emissive.setHex(originalColor);
  });
  addTerminalLine('System reset. Back in the Matrix.');
}

function revealAllNodes() {
  nodeMeshes.forEach(mesh => {
    mesh.scale.setScalar(1.5);
    mesh.material.opacity = 1;
  });
  addTerminalLine('All nodes revealed.');
}

function cloneNodes() {
  const cloneCount = nodeMeshes.length;
  for (let i = 0; i < Math.min(cloneCount, 3); i++) {
    const original = nodeMeshes[i];
    const clone = original.clone();
    clone.position.x += (Math.random() - 0.5) * 10;
    clone.position.z += (Math.random() - 0.5) * 10;
    scene.add(clone);
  }
  addTerminalLine('Mr. Anderson... we meet again.');
}

function applySlowMo() {
  if (cheatActive.slowmo) {
    clock.timeScale = 0.2;
    addTerminalLine('Bullet time engaged.');
  } else {
    clock.timeScale = 1;
    addTerminalLine('Normal speed restored.');
  }
}

function showMorpheusQuote() {
  const quotes = [
    'Free your mind.',
    'There is a difference between knowing the path and walking the path.',
    'I can only show you the door. You\'re the one that has to walk through it.',
    'What you know you can\'t explain, but you feel it.',
    'The Matrix is everywhere. It is all around us.',
    'Welcome to the desert of the real.'
  ];
  const quote = quotes[Math.floor(Math.random() * quotes.length)];
  addTerminalLine(`Morpheus: "${quote}"`);
}

function applyTrinityEffect() {
  // Flash néon cyan
  const flashLight = new THREE.PointLight(0x00ffff, 5, 100);
  flashLight.position.copy(camera.position);
  scene.add(flashLight);
  
  setTimeout(() => {
    scene.remove(flashLight);
  }, 500);
  
  addTerminalLine('Trinity: "Dodge this."');
}

function teleportToCenter() {
  camera.position.set(0, 2, 5);
  addTerminalLine('Teleported to center node.');
}

function toggleDebugMode() {
  debugMode = !debugMode;
  if (debugMode) {
    // Add axes helper
    const axesHelper = new THREE.AxesHelper(10);
    axesHelper.name = 'debugAxes';
    scene.add(axesHelper);
    addTerminalLine('Debug mode: ON');
  } else {
    const axes = scene.getObjectByName('debugAxes');
    if (axes) scene.remove(axes);
    addTerminalLine('Debug mode: OFF');
  }
}

function applyGlitchEffect() {
  // Déplace rapidement la caméra
  const originalPos = camera.position.clone();
  let glitchCount = 0;
  
  const glitchInterval = setInterval(() => {
    camera.position.x = originalPos.x + (Math.random() - 0.5) * 0.5;
    camera.position.y = originalPos.y + (Math.random() - 0.5) * 0.5;
    glitchCount++;
    
    if (glitchCount > 20) {
      clearInterval(glitchInterval);
      camera.position.copy(originalPos);
    }
  }, 50);
  
  // Trigger post-processing glitch si disponible
  if (postProcessing) {
    postProcessing.triggerGlitch(1.0, 0.5);
  }
  
  addTerminalLine('Glitch in the Matrix detected.');
}

// ============================================================================
// MATRIX AWAKENS EFFECTS CONTROLS
// ============================================================================
let rain3DEnabled = true;
let skylineVisible = true;

function toggleRain3D() {
  rain3DEnabled = !rain3DEnabled;
  if (matrixRain3D && matrixRain3D.rainDrops) {
    matrixRain3D.rainDrops.visible = rain3DEnabled;
  }
  addTerminalLine(rain3DEnabled ? 'Matrix Rain 3D: ON' : 'Matrix Rain 3D: OFF');
}

function activateStormMode() {
  if (matrixRain3D) {
    matrixRain3D.setIntensity(1.0);
    matrixRain3D.setWindStrength(2.0);
    matrixRain3D.config.dropSpeed = 40;
  }
  if (postProcessing) {
    postProcessing.setBloomStrength(0.6);
    postProcessing.setVignetteIntensity(0.5);
  }
  addTerminalLine('⛈️ STORM MODE ACTIVATED - Hold on tight!');
}

function activateCinematicMode() {
  if (postProcessing) {
    postProcessing.setCinematicMode();
  }
  addTerminalLine('🎬 Cinematic mode enabled.');
}

function activateCleanMode() {
  if (postProcessing) {
    postProcessing.setCleanMode();
  }
  if (matrixRain3D) {
    matrixRain3D.setIntensity(0.5);
    matrixRain3D.setWindStrength(0.3);
  }
  addTerminalLine('✨ Clean mode enabled.');
}

function toggleSkyline() {
  skylineVisible = !skylineVisible;
  if (cyberpunkSkyline && cyberpunkSkyline.buildingGroup) {
    cyberpunkSkyline.buildingGroup.visible = skylineVisible;
  }
  if (cyberpunkSkyline && cyberpunkSkyline.sky) {
    cyberpunkSkyline.sky.visible = skylineVisible;
  }
  addTerminalLine(skylineVisible ? '🏙️ Skyline: ON' : '🏙️ Skyline: OFF');
}

// ============================================================================
// SPACE VEHICLES CONTROLS
// ============================================================================
let shipsEnabled = true;

function toggleShips() {
  shipsEnabled = !shipsEnabled;
  if (spaceVehicles) {
    if (shipsEnabled) {
      spaceVehicles.resume();
      spaceVehicles.vehicleGroup.visible = true;
    } else {
      spaceVehicles.pause();
      spaceVehicles.vehicleGroup.visible = false;
    }
  }
  addTerminalLine(shipsEnabled ? '🚀 Space traffic: ONLINE' : '🚀 Space traffic: OFFLINE');
}

function spawnSentinel() {
  if (spaceVehicles) {
    const sentinel = spaceVehicles.spawnVehicle('sentinel');
    if (sentinel) {
      addTerminalLine('🤖 WARNING: Sentinel detected in sector 7!');
      // Effet glitch quand une sentinelle spawn
      if (postProcessing) {
        postProcessing.triggerGlitch(0.5, 0.3);
      }
    } else {
      addTerminalLine('Cannot spawn: maximum vehicles reached.');
    }
  }
}

function spawnFleet() {
  if (spaceVehicles) {
    // Flotte de spinners
    spaceVehicles.spawnFleet('spinner', 5);
    addTerminalLine('🛩️ Spinner fleet inbound!');
  }
}

function alienInvasion() {
  if (spaceVehicles) {
    spaceVehicles.spawnAlienInvasion();
    addTerminalLine('🛸 ALERT: Unknown crafts detected! Possible alien origin!');
    
    // Effet dramatique
    if (postProcessing) {
      postProcessing.triggerGlitch(1.0, 1.0);
    }
    if (matrixRain3D) {
      matrixRain3D.setIntensity(0.3); // La pluie ralentit
    }
    
    // Reset après 10 secondes
    setTimeout(() => {
      if (matrixRain3D) matrixRain3D.setIntensity(0.8);
      addTerminalLine('Alien crafts have left the sector.');
    }, 10000);
  }
}

function spawnNebuchadnezzar() {
  if (spaceVehicles) {
    const neb = spaceVehicles.spawnVehicle('hovercraft');
    if (neb) {
      // Le Nebuchadnezzar est spécial - plus gros et plus lent
      neb.mesh.scale.multiplyScalar(1.5);
      neb.speed *= 0.5;
      addTerminalLine('⚓ The Nebuchadnezzar has entered the Matrix.');
      addTerminalLine('"We\'re not here because we\'re free. We\'re here because we\'re not free."');
    }
  }
}

// ============================================================================
// PERFORMANCE MODES
// ============================================================================

function activateTurboMode() {
  // Désactiver tous les effets lourds
  if (matrixRain3D && matrixRain3D.rainDrops) {
    matrixRain3D.rainDrops.visible = false;
  }
  if (cyberpunkSkyline && cyberpunkSkyline.buildingGroup) {
    cyberpunkSkyline.buildingGroup.visible = false;
  }
  if (spaceVehicles) {
    spaceVehicles.pause();
    spaceVehicles.vehicleGroup.visible = false;
  }
  usePostProcessing.value = false;
  
  // Réduire le fog
  scene.fog = new THREE.FogExp2(0x001100, 0.008);
  
  addTerminalLine('⚡ TURBO MODE - All effects disabled for max FPS!');
  addTerminalLine('Type "ultra" to re-enable effects.');
}

function activateUltraMode() {
  // Réactiver tous les effets
  if (matrixRain3D && matrixRain3D.rainDrops) {
    matrixRain3D.rainDrops.visible = true;
    matrixRain3D.setIntensity(1.0);
  }
  if (cyberpunkSkyline && cyberpunkSkyline.buildingGroup) {
    cyberpunkSkyline.buildingGroup.visible = true;
  }
  if (spaceVehicles) {
    spaceVehicles.resume();
    spaceVehicles.vehicleGroup.visible = true;
    spaceVehicles.setMaxVehicles(12);
  }
  usePostProcessing.value = true;
  if (postProcessing) {
    postProcessing.setBloomStrength(0.8);
    postProcessing.setVignetteIntensity(0.5);
  }
  
  scene.fog = new THREE.FogExp2(0x001100, 0.015);
  
  addTerminalLine('🔥 ULTRA MODE - All effects at maximum!');
  addTerminalLine('Warning: May impact performance on weaker devices.');
}

// ============================================================================
// THREE.JS
// ============================================================================
let scene, camera, renderer, controls, clock;
let velocity = new THREE.Vector3();
let direction = new THREE.Vector3();
let moveForward = false, moveBackward = false, moveLeft = false, moveRight = false;
let moveUp = false, moveDown = false;

// Objets réutilisés pour éviter les allocations dans la boucle animate
const raycaster = new THREE.Raycaster();
const raycastCenter = new THREE.Vector2(0, 0);
const tempDirection = new THREE.Vector3();
let lastRaycastTime = 0;
const RAYCAST_INTERVAL = 100; // Raycast seulement toutes les 100ms

const nodeMeshes = [];
const nodeLabels = []; // Labels 3D flottants
const connectionLines = [];
const dataParticles = []; // Particules animées sur les connexions
let labelsGroup = null; // Groupe pour les labels
let showLabels = ref(true); // Toggle pour afficher/masquer les labels

// Matrix Awakens Effects
let matrixRain3D = null;
let cyberpunkSkyline = null;
let postProcessing = null;
let spaceVehicles = null;
let usePostProcessing = ref(true); // Toggle pour activer/désactiver le post-processing

// Utiliser les nodes importés
const nodes = reactive([...nodesData]);

// Initialiser useAchievements APRÈS la définition de nodes
const achievementsSystem = useAchievements(nodes.length);
checkAchievements = achievementsSystem.checkAchievements;
achievementNotification = achievementsSystem.achievementNotification;

function initThree() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);
  scene.fog = new THREE.FogExp2(0x001100, 0.015);

  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 2, 15);

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  threeContainer.value.appendChild(renderer.domElement);

  controls = new PointerLockControls(camera, renderer.domElement);
  
  controls.addEventListener('lock', () => { locked.value = false; });
  controls.addEventListener('unlock', () => { locked.value = true; });

  // Grid
  const gridHelper = new THREE.GridHelper(100, 50, 0x00ff00, 0x003300);
  gridHelper.material.opacity = 0.3;
  gridHelper.material.transparent = true;
  scene.add(gridHelper);

  // Ambient particles
  createParticles();
  
  // Create nodes
  createNodes();
  
  // Create connections
  createConnections();

  // Lights
  const ambient = new THREE.AmbientLight(0x003300, 0.5);
  scene.add(ambient);

  const pointLight = new THREE.PointLight(0x00ff00, 1, 50);
  pointLight.position.set(0, 10, 0);
  scene.add(pointLight);

  clock = new THREE.Clock();

  // =========================================================================
  // MATRIX AWAKENS EFFECTS INITIALIZATION (MODE PERFORMANCE)
  // =========================================================================
  
  // Détection GPU/performance
  const isLowEnd = navigator.hardwareConcurrency <= 4 || 
                   window.devicePixelRatio > 2 ||
                   /mobile|android|iphone/i.test(navigator.userAgent);
  
  addTerminalLine(isLowEnd ? 'Low-end device detected. Performance mode.' : 'High-end mode enabled.');
  
  // Cyberpunk Skyline (buildings en arrière-plan) - RÉDUIT
  try {
    cyberpunkSkyline = new CyberpunkSkyline(scene, {
      buildingCount: isLowEnd ? 25 : 40,
      radius: 150,
      minHeight: 20,
      maxHeight: 80,
      density: isLowEnd ? 0.4 : 0.6
    });
    addTerminalLine('Cyberpunk skyline loaded.');
  } catch (e) {
    console.warn('CyberpunkSkyline init failed:', e);
  }

  // Pluie 3D Matrix style - RÉDUIT SIGNIFICATIVEMENT
  try {
    matrixRain3D = new MatrixRain3D(scene, {
      dropCount: isLowEnd ? 3000 : 6000,
      areaSize: 80,
      dropSpeed: 20,
      splashEnabled: !isLowEnd, // Pas de splash sur mobile
      windStrength: 0.3
    });
    addTerminalLine('Matrix rain 3D initialized.');
  } catch (e) {
    console.warn('MatrixRain3D init failed:', e);
  }

  // Post-processing cinématique - SIMPLIFIÉ
  try {
    postProcessing = new MatrixPostProcessing(renderer, scene, camera, {
      bloomStrength: isLowEnd ? 0.4 : 0.6,
      bloomRadius: 0.4,
      bloomThreshold: 0.4,
      vignetteIntensity: 0.3,
      chromaticAberration: isLowEnd ? 0 : 0.001,
      scanlineIntensity: isLowEnd ? 0 : 0.05,
      noiseIntensity: isLowEnd ? 0 : 0.02,
      greenTint: 0.05
    });
    addTerminalLine('Post-processing pipeline active.');
  } catch (e) {
    console.warn('PostProcessing init failed:', e);
    usePostProcessing.value = false;
  }

  // Vaisseaux spatiaux et véhicules - RÉDUIT
  try {
    spaceVehicles = new SpaceVehicles(scene, {
      maxVehicles: isLowEnd ? 5 : 8,
      spawnRadius: 150,
      minAltitude: 35,
      maxAltitude: 80,
      spawnInterval: isLowEnd ? 8000 : 5000,
      enabledTypes: isLowEnd ? ['spinner', 'drone'] : ['spinner', 'drone', 'hovercraft']
    });
    addTerminalLine('Space traffic system online.');
  } catch (e) {
    console.warn('SpaceVehicles init failed:', e);
  }

  window.addEventListener('resize', onResize);
  document.addEventListener('keydown', onKeyDown);
  document.addEventListener('keyup', onKeyUp);
  renderer.domElement.addEventListener('click', onClick);
}

function createParticles() {
  // Détection performance
  const isLowEnd = navigator.hardwareConcurrency <= 4 || 
                   /mobile|android|iphone/i.test(navigator.userAgent);
  
  const geometry = new THREE.BufferGeometry();
  const count = isLowEnd ? 500 : 1000; // RÉDUIT de 2000
  const positions = new Float32Array(count * 3);

  for (let i = 0; i < count * 3; i += 3) {
    positions[i] = (Math.random() - 0.5) * 100;
    positions[i + 1] = Math.random() * 50;
    positions[i + 2] = (Math.random() - 0.5) * 100;
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const material = new THREE.PointsMaterial({
    color: 0x00ff00,
    size: 0.05,
    transparent: true,
    opacity: 0.6
  });

  const particles = new THREE.Points(geometry, material);
  scene.add(particles);
}

function createNodes() {
  nodes.forEach((node, index) => {
    // Utiliser le composable pour créer des formes différentes par type
    const mesh = createNodeMesh(node);
    mesh.userData.index = index;
    
    scene.add(mesh);
    nodeMeshes.push(mesh);
  });
  
  // Créer les labels 3D flottants
  const labels = createAllLabels(nodes, scene);
  nodeLabels.push(...labels);
  
  addTerminalLine(`${nodes.length} nodes loaded with 3D labels.`);
}

function createConnections() {
  // Helper pour trouver un node par ID
  const findNodeById = (id) => nodes.find(n => n.id === id);
  
  // Créer les connexions définies
  nodeConnections.forEach((conn, index) => {
    const fromNode = findNodeById(conn.from);
    const toNode = findNodeById(conn.to);
    
    if (!fromNode || !toNode) return;
    
    const startPos = new THREE.Vector3(fromNode.position.x, fromNode.position.y, fromNode.position.z);
    const endPos = new THREE.Vector3(toNode.position.x, toNode.position.y, toNode.position.z);
    
    // Ligne de connexion
    const points = [startPos, endPos];
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({ 
      color: conn.color, 
      transparent: true, 
      opacity: 0.3 
    });
    
    const line = new THREE.Line(geometry, material);
    line.userData = { fromId: conn.from, toId: conn.to, startPos, endPos };
    scene.add(line);
    connectionLines.push(line);
    
    // Créer des particules de données qui voyagent sur la ligne
    const particleCount = 3;
    for (let i = 0; i < particleCount; i++) {
      const particleGeo = new THREE.SphereGeometry(0.08, 8, 8);
      const particleMat = new THREE.MeshBasicMaterial({ 
        color: conn.color,
        transparent: true,
        opacity: 0.8
      });
      const particle = new THREE.Mesh(particleGeo, particleMat);
      
      // Position initiale aléatoire sur la ligne
      const t = (i / particleCount) + (index * 0.1) % 1;
      particle.position.lerpVectors(startPos, endPos, t);
      
      // Stocker les données d'animation
      particle.userData = {
        startPos: startPos.clone(),
        endPos: endPos.clone(),
        progress: t,
        speed: 0.3 + Math.random() * 0.4,
        direction: Math.random() > 0.5 ? 1 : -1
      };
      
      // Glow effect
      const glowGeo = new THREE.SphereGeometry(0.15, 8, 8);
      const glowMat = new THREE.MeshBasicMaterial({ 
        color: conn.color,
        transparent: true,
        opacity: 0.3
      });
      const glow = new THREE.Mesh(glowGeo, glowMat);
      particle.add(glow);
      
      scene.add(particle);
      dataParticles.push(particle);
    }
  });
  
  // Ligne centrale brillante de NEO vers GL TOWER
  const neoNode = findNodeById('neo');
  const towerNode = findNodeById('gl-tower');
  if (neoNode && towerNode) {
    const tubePoints = [
      new THREE.Vector3(neoNode.position.x, neoNode.position.y, neoNode.position.z),
      new THREE.Vector3(towerNode.position.x, towerNode.position.y, towerNode.position.z)
    ];
    const tubePath = new THREE.CatmullRomCurve3(tubePoints);
    const tubeGeo = new THREE.TubeGeometry(tubePath, 20, 0.05, 8, false);
    const tubeMat = new THREE.MeshBasicMaterial({ 
      color: 0x00ff00,
      transparent: true,
      opacity: 0.4
    });
    const tube = new THREE.Mesh(tubeGeo, tubeMat);
    scene.add(tube);
  }
}

function onResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  
  // Mettre à jour le post-processing
  if (postProcessing) {
    postProcessing.onResize();
  }
  
  // Re-check mobile on resize
  checkMobile();
}

function onKeyDown(e) {
  if (showWelcome.value) return;
  
  // Cheatcode input (lettres uniquement)
  if (e.key.length === 1 && /[a-zA-Z ]/.test(e.key)) {
    handleCheatInput(e.key);
  }
  
  switch (e.code) {
    case 'KeyW': case 'KeyZ': moveForward = true; break;
    case 'KeyS': moveBackward = true; break;
    case 'KeyA': case 'KeyQ': moveLeft = true; break;
    case 'KeyD': moveRight = true; break;
    case 'KeyT': 
      // Raccourci pour l'opérateur
      if (!showOperator.value && !showHologram.value) openOperator();
      break;
    case 'KeyH':
      // Raccourci pour l'hologramme
      if (!showHologram.value && !showOperator.value) openHologram();
      break;
    case 'KeyL':
      // Toggle labels 3D
      showLabels.value = !showLabels.value;
      setLabelsVisible(nodeLabels, showLabels.value);
      addTerminalLine(showLabels.value ? 'Labels: ON' : 'Labels: OFF');
      break;
    case 'KeyF':
      // Workflows Lab (F pour Flow)
      if (!showWorkflows.value && !showOperator.value && !showHologram.value) openWorkflows();
      break;
    case 'KeyP':
      // Pixel Art Lab
      if (!showPixelArt.value && !showOperator.value && !showHologram.value) openPixelArt();
      break;
    case 'KeyN':
      // Neural Feed (Tech Feed)
      if (!showTechFeed.value && !showOperator.value && !showHologram.value) openTechFeed();
      break;
    case 'Space': 
      e.preventDefault();
      moveUp = true;
      break;
    case 'ShiftLeft':
    case 'ControlLeft':
      moveDown = true;
      break;
    case 'Escape': 
      if (showTechFeed.value) {
        showTechFeed.value = false;
      } else if (showWorkflows.value) {
        showWorkflows.value = false;
      } else if (showPixelArt.value) {
        showPixelArt.value = false;
      } else if (showHologram.value) {
        closeHologram();
      } else if (showOperator.value) {
        closeOperator();
      } else if (showCheatList.value) {
        showCheatList.value = false;
      } else if (activeNode.value) {
        activeNode.value = null;
      } else if (showGallery.value) {
        showGallery.value = false;
      }
      break;
  }
}

function onKeyUp(e) {
  switch (e.code) {
    case 'KeyW': case 'KeyZ': moveForward = false; break;
    case 'KeyS': moveBackward = false; break;
    case 'KeyA': case 'KeyQ': moveLeft = false; break;
    case 'KeyD': moveRight = false; break;
    case 'Space': moveUp = false; break;
    case 'ShiftLeft': case 'ControlLeft': moveDown = false; break;
  }
}

function onClick() {
  if (showWelcome.value) return;
  
  if (!controls.isLocked) {
    controls.lock();
    return;
  }

  // Raycast to detect node click (réutilise le raycaster global)
  raycaster.setFromCamera(raycastCenter, camera);
  
  const intersects = raycaster.intersectObjects(nodeMeshes);
  
  if (intersects.length > 0 && intersects[0].distance < 15) {
    const nodeId = intersects[0].object.userData.nodeId;
    const node = nodes.find(n => n.id === nodeId);
    if (node) {
      // Track node visit for gamification
      const result = visitNode(nodeId);
      if (result.isFirst) {
        addTerminalLine(`[+${result.xp} XP] First discovery: ${node.name}`);
      }
      
      // Check for new achievements
      checkAchievements();
      
      // Check for interactive nodes
      if (node.interactive === 'workflows') {
        openWorkflows();
        return;
      }
      if (node.interactive === 'pixelart') {
        openPixelArt();
        return;
      }
      
      activeNode.value = node;
      addTerminalLine(`Accessing node: ${node.name}`);
    }
  }
}

function openGallery(node) {
  galleryNode.value = node;
  showGallery.value = true;
}

function enterMatrix() {
  showWelcome.value = false;
  controls.lock();
  addTerminalLine('Welcome back, Neo.');
}

function exitMatrix() {
  window.location.href = '/';
}

function addTerminalLine(text) {
  terminalLines.value.push(text);
  if (terminalLines.value.length > 5) {
    terminalLines.value.shift();
  }
}

// ============================================================================
// MATRIX RAIN
// ============================================================================
let rainCtx;
const drops = [];
const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEF';

function initRain() {
  const canvas = rainCanvas.value;
  rainCtx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const columns = Math.floor(canvas.width / 14);
  for (let i = 0; i < columns; i++) {
    drops.push(Math.random() * canvas.height);
  }
}

function drawRain() {
  if (!rainCtx) return;
  
  rainCtx.fillStyle = 'rgba(0, 0, 0, 0.05)';
  rainCtx.fillRect(0, 0, rainCanvas.value.width, rainCanvas.value.height);

  rainCtx.fillStyle = '#0f0';
  rainCtx.font = '14px monospace';

  for (let i = 0; i < drops.length; i++) {
    const char = chars[Math.floor(Math.random() * chars.length)];
    rainCtx.fillText(char, i * 14, drops[i]);

    if (drops[i] > rainCanvas.value.height && Math.random() > 0.975) {
      drops[i] = 0;
    }
    drops[i] += 14;
  }
}

// ============================================================================
// ANIMATION LOOP (OPTIMISÉ - évite allocations mémoire)
// ============================================================================
function animate() {
  requestAnimationFrame(animate);

  // Rain (2D canvas)
  drawRain();

  if (!scene || !camera || loading.value) return;

  const delta = Math.min(clock.getDelta(), 0.1);
  const now = performance.now(); // Plus précis que Date.now() et une seule fois

  // Movement (Desktop + Mobile)
  if (controls.isLocked || isMobile.value) {
    // Friction/damping horizontal
    velocity.x -= velocity.x * 5.0 * delta;
    velocity.z -= velocity.z * 5.0 * delta;

    // Direction horizontale (combine keyboard + mobile joystick)
    let inputZ = Number(moveForward) - Number(moveBackward);
    let inputX = Number(moveRight) - Number(moveLeft);
    
    // Add mobile joystick input
    if (isMobile.value) {
      inputZ += mobileJoystickMove.y; // Forward/back
      inputX += mobileJoystickMove.x; // Left/right
      
      // Mobile look (rotate camera)
      if (mobileJoystickLook.x !== 0 || mobileJoystickLook.y !== 0) {
        camera.rotation.y -= mobileJoystickLook.x * 2 * delta;
        camera.rotation.x -= mobileJoystickLook.y * delta;
        camera.rotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, camera.rotation.x));
      }
    }
    
    direction.z = inputZ;
    direction.x = inputX;
    direction.normalize();

    // Vitesse de déplacement (modifiée par cheat kung-fu)
    const speed = moveSpeed;

    if (moveForward || moveBackward) velocity.z -= direction.z * speed * delta;
    if (moveLeft || moveRight) velocity.x -= direction.x * speed * delta;

    // Appliquer le mouvement horizontal via PointerLockControls
    controls.moveRight(-velocity.x * delta);
    controls.moveForward(-velocity.z * delta);
    
    // Gravité
    velocity.y -= 30 * delta;
    
    // Saut (seulement si au sol)
    const groundLevel = 2;
    if (moveUp && camera.position.y <= groundLevel + 0.1) {
      velocity.y = 12; // Force du saut
    }
    
    // Appliquer le mouvement vertical
    camera.position.y += velocity.y * delta;
    
    // Sol
    if (camera.position.y < groundLevel) {
      camera.position.y = groundLevel;
      velocity.y = 0;
    }
  }

  // Animate nodes avec le composable (formes différentes)
  animateNodes(nodeMeshes, nodes, now, delta);
  
  // Mettre à jour les labels 3D pour qu'ils regardent la caméra
  if (nodeLabels.length > 0) {
    updateLabels(nodeLabels, camera, now);
  }

  // Animate data particles along connections
  const particleCount = dataParticles.length;
  for (let i = 0; i < particleCount; i++) {
    const particle = dataParticles[i];
    const data = particle.userData;
    
    // Avancer la particule
    data.progress += data.speed * delta * data.direction;
    
    // Rebondir aux extrémités
    if (data.progress >= 1) {
      data.progress = 1;
      data.direction = -1;
    } else if (data.progress <= 0) {
      data.progress = 0;
      data.direction = 1;
    }
    
    // Mettre à jour la position
    particle.position.lerpVectors(data.startPos, data.endPos, data.progress);
    
    // Effet de pulsation (utilise now au lieu de Date.now())
    const pulseScale = 1 + Math.sin(now * 0.01 + data.progress * 10) * 0.3;
    particle.scale.setScalar(pulseScale);
  }

  // Animate connection lines opacity (throttled - every 2 frames)
  if (Math.floor(now / 33) % 2 === 0) {
    const lineCount = connectionLines.length;
    for (let i = 0; i < lineCount; i++) {
      connectionLines[i].material.opacity = 0.2 + Math.sin(now * 0.002 + i * 0.5) * 0.15;
    }
  }

  // Update player position for minimap (réutilise tempDirection)
  if (camera) {
    playerPosition.x = camera.position.x;
    playerPosition.y = camera.position.y;
    playerPosition.z = camera.position.z;
    
    // Get Y rotation from camera direction (réutilise tempDirection)
    camera.getWorldDirection(tempDirection);
    playerRotationY.value = Math.atan2(tempDirection.x, tempDirection.z) * (180 / Math.PI);
  }

  // Raycast hover - THROTTLED à 10fps (100ms) pour éviter les freezes
  if (controls.isLocked && now - lastRaycastTime > RAYCAST_INTERVAL) {
    lastRaycastTime = now;
    
    // Réutilise le raycaster pré-alloué
    raycaster.setFromCamera(raycastCenter, camera);
    const intersects = raycaster.intersectObjects(nodeMeshes);
    
    if (intersects.length > 0 && intersects[0].distance < 15) {
      const nodeId = intersects[0].object.userData.nodeId;
      hoveredNode.value = nodes.find(n => n.id === nodeId);
      document.body.style.cursor = 'pointer';
    } else {
      hoveredNode.value = null;
      document.body.style.cursor = 'default';
    }
  }

  // =========================================================================
  // MATRIX AWAKENS EFFECTS UPDATE
  // =========================================================================
  
  // Update 3D rain with camera position
  if (matrixRain3D) {
    matrixRain3D.update(delta, camera.position);
  }
  
  // Update cyberpunk skyline animations
  if (cyberpunkSkyline) {
    cyberpunkSkyline.update(delta);
  }
  
  // Update space vehicles
  if (spaceVehicles) {
    spaceVehicles.update(delta, camera.position);
  }
  
  // Update post-processing
  if (postProcessing) {
    postProcessing.update(delta);
  }

  // Render avec ou sans post-processing
  if (postProcessing && usePostProcessing.value) {
    postProcessing.render();
  } else {
    renderer.render(scene, camera);
  }
}

// ============================================================================
// LIFECYCLE
// ============================================================================
onMounted(async () => {
  // Increment session count for gamification
  incrementSession();
  
  // Start time tracking
  const timeTracker = setInterval(() => {
    if (!loading.value && !showWelcome.value) {
      addTimeSpent(1);
      // Check time-based achievements every 10 seconds
      if (playerData.value.totalTimeSpent % 10 === 0) {
        checkAchievements();
      }
    }
  }, 1000);
  
  // Preload sequence
  const steps = [
    'Connexion à la Matrice...',
    'Chargement des nodes...',
    'Initialisation Three.js...',
    'Calibration du Construct...',
    'Système prêt.'
  ];

  for (let i = 0; i < steps.length; i++) {
    loadTxt.value = steps[i];
    loadPct.value = ((i + 1) / steps.length) * 100;
    await new Promise(r => setTimeout(r, 400));
  }

  initRain();
  initThree();
  checkMobile();
  
  await new Promise(r => setTimeout(r, 300));
  loading.value = false;
  
  animate();
});

onUnmounted(() => {
  window.removeEventListener('resize', onResize);
  document.removeEventListener('keydown', onKeyDown);
  document.removeEventListener('keyup', onKeyUp);
  
  // Cleanup Matrix Awakens effects
  if (matrixRain3D) {
    matrixRain3D.dispose();
  }
  if (cyberpunkSkyline) {
    cyberpunkSkyline.dispose();
  }
  if (spaceVehicles) {
    spaceVehicles.dispose();
  }
  if (postProcessing) {
    postProcessing.dispose();
  }
  
  if (renderer) renderer.dispose();
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap');

.matrix-reloaded {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 99999;
  background: #000;
  font-family: 'Share Tech Mono', monospace;
  color: #00ff00;
  overflow: hidden;
  cursor: default;
}

.matrix-reloaded.unlocked {
  cursor: none;
}

/* Rain Canvas */
.rain-canvas {
  position: absolute;
  inset: 0;
  z-index: 1;
  opacity: 0.15;
  pointer-events: none;
}

.three-container {
  position: absolute;
  inset: 0;
  z-index: 2;
}

/* Crosshair */
.crosshair {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 100;
  pointer-events: none;
}

.cross-h, .cross-v {
  position: absolute;
  background: #00ff00;
  box-shadow: 0 0 10px #00ff00;
}

.cross-h {
  width: 20px;
  height: 2px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.cross-v {
  width: 2px;
  height: 20px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.cross-dot {
  position: absolute;
  width: 4px;
  height: 4px;
  background: #00ff00;
  border-radius: 50%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 0 0 10px #00ff00, 0 0 20px #00ff00;
}

/* HUD */
.hud-tl, .hud-tr, .hud-tc {
  position: fixed;
  z-index: 100;
  pointer-events: auto;
}

.hud-tl {
  top: 1.5rem;
  left: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.xp-hud-wrapper {
  margin-top: 0.5rem;
}

.minimap-wrapper {
  margin-top: 0.5rem;
}

.hud-tr {
  top: 1.5rem;
  right: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 1rem;
}

.hud-tc {
  top: 1.5rem;
  left: 50%;
  transform: translateX(-50%);
}

/* System Status */
.system-status {
  background: rgba(0, 20, 0, 0.8);
  border: 1px solid #00ff00;
  padding: 1rem;
  min-width: 180px;
}

.status-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.8rem;
  font-size: 0.75rem;
  letter-spacing: 0.1em;
}

.pulse {
  width: 8px;
  height: 8px;
  background: #00ff00;
  border-radius: 50%;
  animation: pulse 1s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; box-shadow: 0 0 5px #00ff00; }
  50% { opacity: 0.5; box-shadow: 0 0 15px #00ff00; }
}

.status-row {
  display: flex;
  justify-content: space-between;
  font-size: 0.7rem;
  padding: 0.3rem 0;
  border-bottom: 1px solid rgba(0, 255, 0, 0.1);
}

.status-row:last-child {
  border-bottom: none;
}

.label {
  color: rgba(0, 255, 0, 0.5);
}

.value {
  color: #00ff00;
}

.value.neo {
  color: #fff;
  text-shadow: 0 0 10px #00ff00;
}

.value.admin {
  color: #ff0;
}

/* Controls Hint */
.controls-hint {
  background: rgba(0, 20, 0, 0.8);
  border: 1px solid rgba(0, 255, 0, 0.3);
  padding: 0.8rem;
  font-size: 0.65rem;
}

.controls-hint div {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.2rem 0;
}

.controls-hint kbd {
  background: #00ff00;
  color: #000;
  padding: 0.15rem 0.4rem;
  font-size: 0.6rem;
  font-weight: bold;
}

.exit-btn {
  background: transparent;
  border: 1px solid #ff0000;
  color: #ff0000;
  padding: 0.5rem 1rem;
  font-family: inherit;
  font-size: 0.7rem;
  cursor: pointer;
  transition: all 0.3s;
}

.exit-btn:hover {
  background: #ff0000;
  color: #000;
}

/* Location */
.location {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(0, 20, 0, 0.8);
  border: 1px solid rgba(0, 255, 0, 0.3);
  padding: 0.5rem 1rem;
  font-size: 0.8rem;
  letter-spacing: 0.2em;
}

.loc-icon {
  animation: pulse 2s infinite;
}

/* Node Panel */
.node-panel {
  position: fixed;
  top: 50%;
  right: 2rem;
  transform: translateY(-50%);
  width: 320px;
  max-height: 80vh;
  overflow-y: auto;
  background: rgba(0, 10, 0, 0.95);
  border: 1px solid #00ff00;
  z-index: 200;
}

.panel-close {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: transparent;
  border: none;
  color: #00ff00;
  font-size: 1.2rem;
  cursor: pointer;
  opacity: 0.5;
  transition: opacity 0.2s;
}

.panel-close:hover {
  opacity: 1;
}

.panel-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  border-bottom: 1px solid rgba(0, 255, 0, 0.2);
}

.panel-icon {
  font-size: 2.5rem;
}

.panel-header h2 {
  font-size: 1rem;
  letter-spacing: 0.1em;
  margin: 0;
}

.panel-type {
  font-size: 0.65rem;
  color: rgba(0, 255, 0, 0.5);
  text-transform: uppercase;
  letter-spacing: 0.15em;
}

.panel-desc {
  padding: 1rem 1.5rem;
  font-size: 0.75rem;
  line-height: 1.6;
  color: rgba(0, 255, 0, 0.8);
  border-bottom: 1px solid rgba(0, 255, 0, 0.2);
}

.panel-stats {
  padding: 1rem 1.5rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
  border-bottom: 1px solid rgba(0, 255, 0, 0.2);
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.stat-label {
  font-size: 0.55rem;
  color: rgba(0, 255, 0, 0.4);
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.stat-value {
  font-size: 0.75rem;
}

.panel-links {
  padding: 1rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.panel-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 0.8rem;
  background: rgba(0, 255, 0, 0.1);
  border: 1px solid rgba(0, 255, 0, 0.2);
  color: #00ff00;
  text-decoration: none;
  font-size: 0.7rem;
  transition: all 0.2s;
}

.panel-link:hover {
  background: rgba(0, 255, 0, 0.2);
  border-color: #00ff00;
}

/* Panel Gallery */
.panel-gallery {
  padding: 1rem 1.5rem;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem;
}

.gallery-thumb {
  aspect-ratio: 1;
  background: rgba(0, 255, 0, 0.1);
  border: 1px solid rgba(0, 255, 0, 0.3);
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.gallery-thumb:hover {
  border-color: #00ff00;
  background: rgba(0, 255, 0, 0.2);
}

.thumb-placeholder {
  font-size: 1.5rem;
  opacity: 0.3;
}

.gallery-more {
  grid-column: span 2;
  background: transparent;
  border: 1px dashed rgba(0, 255, 0, 0.3);
  color: #00ff00;
  padding: 0.5rem;
  font-family: inherit;
  font-size: 0.7rem;
  cursor: pointer;
  transition: all 0.2s;
}

.gallery-more:hover {
  border-color: #00ff00;
  background: rgba(0, 255, 0, 0.1);
}

/* Gallery Overlay */
.gallery-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.95);
  z-index: 300;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.gallery-container {
  width: 100%;
  max-width: 900px;
  max-height: 80vh;
  overflow-y: auto;
}

.gallery-close {
  position: fixed;
  top: 2rem;
  right: 2rem;
  background: transparent;
  border: 1px solid #00ff00;
  color: #00ff00;
  width: 40px;
  height: 40px;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.2s;
}

.gallery-close:hover {
  background: #00ff00;
  color: #000;
}

.gallery-container h2 {
  text-align: center;
  font-size: 1.2rem;
  letter-spacing: 0.2em;
  margin-bottom: 2rem;
}

.gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
}

.gallery-item {
  aspect-ratio: 4/3;
  background: rgba(0, 255, 0, 0.05);
  border: 1px solid rgba(0, 255, 0, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
}

.gallery-item:hover {
  border-color: #00ff00;
  transform: scale(1.02);
}

.gallery-placeholder {
  text-align: center;
  font-size: 0.8rem;
  opacity: 0.5;
}

/* Welcome Overlay */
.welcome-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.98);
  z-index: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.welcome-content {
  text-align: center;
}

.welcome-text {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 3rem;
}

.line {
  font-size: clamp(1rem, 3vw, 1.5rem);
  opacity: 0;
  animation: typeIn 0.5s ease forwards;
}

.line-1 { animation-delay: 0.5s; }
.line-2 { animation-delay: 1.5s; }
.line-3 { animation-delay: 2.5s; }

@keyframes typeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.enter-btn {
  background: transparent;
  border: 2px solid #00ff00;
  color: #00ff00;
  padding: 1rem 2rem;
  font-family: inherit;
  font-size: 1rem;
  letter-spacing: 0.2em;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 1rem;
  margin: 0 auto;
  opacity: 0;
  animation: fadeIn 0.5s ease forwards 3.5s;
  transition: all 0.3s;
}

.enter-btn:hover {
  background: #00ff00;
  color: #000;
  box-shadow: 0 0 30px rgba(0, 255, 0, 0.5);
}

.btn-icon {
  font-size: 1.5rem;
}

@keyframes fadeIn {
  to { opacity: 1; }
}

/* Mini Terminal */
.mini-terminal {
  position: fixed;
  bottom: 1.5rem;
  left: 1.5rem;
  background: rgba(0, 10, 0, 0.8);
  border: 1px solid rgba(0, 255, 0, 0.3);
  padding: 0.8rem;
  font-size: 0.6rem;
  max-width: 300px;
  z-index: 100;
}

.terminal-line {
  padding: 0.15rem 0;
  opacity: 0.7;
}

.terminal-line:last-child {
  opacity: 1;
}

.prompt {
  color: #0f0;
  margin-right: 0.5rem;
}

/* Preloader */
.preloader {
  position: fixed;
  inset: 0;
  background: #000;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.loader-inner {
  text-align: center;
}

.matrix-logo {
  font-size: clamp(2rem, 8vw, 4rem);
  font-weight: bold;
  letter-spacing: 0.3em;
  margin-bottom: 0.5rem;
}

.bracket {
  color: #00ff00;
}

.text {
  color: #00ff00;
  text-shadow: 0 0 20px #00ff00, 0 0 40px #00ff00;
}

.loader-sub {
  display: block;
  font-size: 1rem;
  letter-spacing: 0.5em;
  color: rgba(0, 255, 0, 0.5);
  margin-bottom: 2rem;
}

.loader-bar {
  width: 300px;
  height: 2px;
  background: rgba(0, 255, 0, 0.2);
  margin: 0 auto 1rem;
  overflow: hidden;
}

.loader-bar div {
  height: 100%;
  background: #00ff00;
  box-shadow: 0 0 10px #00ff00;
  transition: width 0.3s;
}

.loader-txt {
  font-size: 0.75rem;
  color: rgba(0, 255, 0, 0.6);
}

/* Transitions */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.fade-out-enter-active, .fade-out-leave-active {
  transition: opacity 0.8s;
}
.fade-out-enter-from, .fade-out-leave-to {
  opacity: 0;
}

.slide-enter-active, .slide-leave-active {
  transition: all 0.3s ease;
}
.slide-enter-from, .slide-leave-to {
  opacity: 0;
  transform: translateY(-50%) translateX(20px);
}

/* Responsive */
@media (max-width: 768px) {
  .node-panel {
    width: 100%;
    right: 0;
    top: auto;
    bottom: 0;
    transform: none;
    max-height: 60vh;
    border: none;
    border-top: 1px solid #00ff00;
  }
  
  .controls-hint {
    display: none;
  }
  
  .mini-terminal {
    display: none;
  }
}

/* ============================================================================
   CHEATCODES STYLES
   ============================================================================ */

/* Cheat Notification */
.cheat-notification {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 20, 0, 0.95);
  border: 2px solid #00ff00;
  padding: 1.5rem 2rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  z-index: 1000;
  box-shadow: 0 0 50px rgba(0, 255, 0, 0.5), inset 0 0 30px rgba(0, 255, 0, 0.1);
}

.cheat-icon {
  font-size: 3rem;
  animation: cheatPulse 0.5s ease infinite;
}

@keyframes cheatPulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.2); }
}

.cheat-info {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.cheat-name {
  font-size: 1.2rem;
  font-weight: bold;
  color: #00ff00;
  letter-spacing: 0.1em;
  text-shadow: 0 0 10px #00ff00;
}

.cheat-desc {
  font-size: 0.75rem;
  color: rgba(0, 255, 0, 0.6);
}

.cheat-pop-enter-active {
  animation: cheatPopIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.cheat-pop-leave-active {
  animation: cheatPopOut 0.3s ease-in;
}

@keyframes cheatPopIn {
  0% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.5);
  }
  100% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
}

@keyframes cheatPopOut {
  0% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
  100% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(1.2);
  }
}

/* Cheat List Overlay */
.cheat-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.95);
  z-index: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.cheat-list-container {
  width: 100%;
  max-width: 800px;
  max-height: 80vh;
  overflow-y: auto;
  position: relative;
}

.cheat-close {
  position: absolute;
  top: 0;
  right: 0;
  background: transparent;
  border: 1px solid #00ff00;
  color: #00ff00;
  width: 40px;
  height: 40px;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.2s;
}

.cheat-close:hover {
  background: #00ff00;
  color: #000;
}

.cheat-list-container h2 {
  text-align: center;
  font-size: 1.5rem;
  letter-spacing: 0.2em;
  margin-bottom: 0.5rem;
}

.cheat-hint {
  text-align: center;
  font-size: 0.7rem;
  color: rgba(0, 255, 0, 0.5);
  margin-bottom: 2rem;
}

.cheat-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1rem;
}

.cheat-item {
  display: flex;
  align-items: flex-start;
  gap: 0.8rem;
  background: rgba(0, 255, 0, 0.05);
  border: 1px solid rgba(0, 255, 0, 0.2);
  padding: 1rem;
  transition: all 0.2s;
}

.cheat-item:hover {
  border-color: #00ff00;
  background: rgba(0, 255, 0, 0.1);
}

.item-icon {
  font-size: 1.5rem;
}

.item-info {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.item-name {
  font-size: 0.8rem;
  font-weight: bold;
  color: #00ff00;
}

.item-code {
  font-size: 0.65rem;
  background: rgba(0, 0, 0, 0.5);
  padding: 0.2rem 0.4rem;
  color: #0f0;
  border: 1px solid rgba(0, 255, 0, 0.3);
}

.item-desc {
  font-size: 0.6rem;
  color: rgba(0, 255, 0, 0.5);
}

/* ============================================================================
   OPERATOR LINK STYLES - AWWWARDS LEVEL
   ============================================================================ */

/* Transition d'entrée */
.operator-slide-enter-active {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
.operator-slide-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.operator-slide-enter-from {
  opacity: 0;
  backdrop-filter: blur(0);
}
.operator-slide-enter-from .operator-container {
  transform: translateY(30px) scale(0.95);
  opacity: 0;
}
.operator-slide-leave-to {
  opacity: 0;
}
.operator-slide-leave-to .operator-container {
  transform: translateY(-20px) scale(0.98);
  opacity: 0;
}

.operator-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.85);
  z-index: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
}

.operator-container {
  width: 100%;
  max-width: 950px;
  max-height: 90vh;
  overflow-y: auto;
  overflow-x: hidden;
  position: relative;
  background: linear-gradient(160deg, 
    rgba(0, 40, 0, 0.95) 0%, 
    rgba(0, 20, 0, 0.98) 50%,
    rgba(0, 30, 10, 0.95) 100%);
  border: 1px solid rgba(0, 255, 0, 0.3);
  border-radius: 16px;
  padding: 2.5rem;
  box-shadow: 
    0 0 0 1px rgba(0, 255, 0, 0.1),
    0 25px 50px -12px rgba(0, 0, 0, 0.5),
    0 0 100px rgba(0, 255, 0, 0.15),
    inset 0 1px 0 rgba(0, 255, 0, 0.1);
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

/* Scanlines CRT effect */
.operator-scanlines {
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    rgba(0, 0, 0, 0.1) 2px,
    rgba(0, 0, 0, 0.1) 4px
  );
  pointer-events: none;
  opacity: 0.3;
  border-radius: 16px;
}

.operator-close {
  position: absolute;
  top: 1.25rem;
  right: 1.25rem;
  background: rgba(0, 255, 0, 0.05);
  border: 1px solid rgba(0, 255, 0, 0.3);
  color: #00ff00;
  width: 44px;
  height: 44px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.operator-close svg {
  width: 20px;
  height: 20px;
}

.operator-close:hover {
  background: rgba(0, 255, 0, 0.15);
  border-color: #00ff00;
  transform: rotate(90deg);
}

.operator-close:focus-visible {
  outline: 2px solid #00ff00;
  outline-offset: 2px;
}

/* Header */
.operator-header {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.operator-avatar {
  position: relative;
  width: 72px;
  height: 72px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-ring {
  position: absolute;
  inset: 0;
  border: 2px solid #00ff00;
  border-radius: 50%;
  animation: ringRotate 8s linear infinite;
}

.avatar-ring::before {
  content: '';
  position: absolute;
  top: -2px;
  left: 50%;
  width: 8px;
  height: 8px;
  background: #00ff00;
  border-radius: 50%;
  transform: translateX(-50%);
  box-shadow: 0 0 10px #00ff00;
}

@keyframes ringRotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.avatar-icon {
  font-size: 2rem;
  z-index: 1;
}

.avatar-pulse {
  position: absolute;
  inset: -4px;
  border: 1px solid rgba(0, 255, 0, 0.3);
  border-radius: 50%;
  animation: avatarPulse 2s ease-out infinite;
}

@keyframes avatarPulse {
  0% { transform: scale(1); opacity: 0.5; }
  100% { transform: scale(1.4); opacity: 0; }
}

.operator-info h2 {
  font-size: 1.6rem;
  font-weight: 600;
  letter-spacing: 0.15em;
  margin-bottom: 0.35rem;
  background: linear-gradient(90deg, #00ff00, #00ff88);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.operator-status {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-size: 0.7rem;
  color: rgba(0, 255, 0, 0.7);
}

.status-indicator {
  width: 8px;
  height: 8px;
  background: #00ff00;
  border-radius: 50%;
  animation: statusBlink 2s ease infinite;
  box-shadow: 0 0 8px #00ff00;
}

@keyframes statusBlink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}

.status-latency {
  padding: 0.15rem 0.5rem;
  background: rgba(0, 255, 0, 0.1);
  border-radius: 4px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.6rem;
}

/* Quote */
.operator-intro {
  position: relative;
  font-style: italic;
  color: rgba(0, 255, 0, 0.6);
  font-size: 0.95rem;
  margin: 0 0 2rem 0;
  padding: 1rem 1.5rem;
  background: rgba(0, 255, 0, 0.03);
  border-left: 3px solid rgba(0, 255, 0, 0.3);
  border-radius: 0 8px 8px 0;
}

.quote-mark {
  font-size: 1.5rem;
  color: rgba(0, 255, 0, 0.3);
  font-style: normal;
}

/* Categories */
.program-categories {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  padding: 0.5rem;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 12px;
}

.cat-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.7rem 1.1rem;
  background: rgba(0, 255, 0, 0.03);
  border: 1px solid rgba(0, 255, 0, 0.15);
  border-radius: 8px;
  color: rgba(0, 255, 0, 0.6);
  font-family: inherit;
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  position: relative;
  overflow: hidden;
}

.cat-btn::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(0, 255, 0, 0.1), transparent);
  opacity: 0;
  transition: opacity 0.25s;
}

.cat-btn:hover {
  border-color: rgba(0, 255, 0, 0.5);
  color: #00ff00;
  transform: translateY(-2px);
}

.cat-btn:hover::before {
  opacity: 1;
}

.cat-btn:focus-visible {
  outline: 2px solid #00ff00;
  outline-offset: 2px;
}

.cat-btn.active {
  background: rgba(0, 255, 0, 0.15);
  border-color: #00ff00;
  color: #00ff00;
  box-shadow: 
    0 0 20px rgba(0, 255, 0, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

.cat-icon {
  font-size: 1.1rem;
}

.cat-name {
  letter-spacing: 0.08em;
  font-weight: 500;
}

.cat-count {
  padding: 0.15rem 0.4rem;
  background: rgba(0, 255, 0, 0.1);
  border-radius: 4px;
  font-size: 0.6rem;
  font-weight: 600;
  min-width: 20px;
  text-align: center;
}

/* HUD Buttons */
.hud-buttons {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  margin-top: 1rem;
}

.operator-quick-btn {
  background: rgba(0, 255, 0, 0.1);
  border: 1px solid #00ff00;
  color: #00ff00;
  padding: 0.5rem 0.75rem;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.2s;
}

.operator-quick-btn:hover {
  background: rgba(0, 255, 0, 0.2);
  transform: scale(1.1);
  box-shadow: 0 0 15px rgba(0, 255, 0, 0.5);
}

.exit-btn {
  background: rgba(255, 0, 0, 0.1);
  border: 1px solid rgba(255, 0, 0, 0.5);
  color: rgba(255, 0, 0, 0.8);
  padding: 0.5rem 1rem;
  font-size: 0.7rem;
  letter-spacing: 0.1em;
  cursor: pointer;
  transition: all 0.2s;
}

.exit-btn:hover {
  background: rgba(255, 0, 0, 0.2);
  border-color: #ff0000;
  color: #ff0000;
}

/* Grille de programmes */
.programs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

/* Animation d'entrée des cartes */
.program-list-enter-active {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  transition-delay: var(--delay, 0ms);
}
.program-list-leave-active {
  transition: all 0.2s ease;
}
.program-list-enter-from {
  opacity: 0;
  transform: translateY(15px);
}
.program-list-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

.program-card {
  position: relative;
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.25rem;
  background: rgba(0, 255, 0, 0.02);
  border: 1px solid rgba(0, 255, 0, 0.12);
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  overflow: hidden;
}

.prog-glow {
  position: absolute;
  top: 50%;
  left: 0;
  width: 100px;
  height: 100px;
  background: radial-gradient(circle, rgba(0, 255, 0, 0.15), transparent 70%);
  transform: translate(-50%, -50%);
  opacity: 0;
  transition: opacity 0.3s, left 0.5s;
  pointer-events: none;
}

.program-card:hover {
  border-color: rgba(0, 255, 0, 0.5);
  background: rgba(0, 255, 0, 0.06);
  transform: translateX(4px);
}

.program-card:hover .prog-glow {
  opacity: 1;
  left: 100%;
}

.program-card:focus-visible {
  outline: 2px solid #00ff00;
  outline-offset: 2px;
}

.program-card.loaded {
  background: linear-gradient(135deg, rgba(0, 255, 0, 0.1), rgba(0, 255, 0, 0.05));
  border-color: rgba(0, 255, 0, 0.4);
}

.program-card.loaded::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 3px;
  height: 100%;
  background: #00ff00;
  box-shadow: 0 0 10px #00ff00;
}

.prog-icon {
  font-size: 1.75rem;
  flex-shrink: 0;
  filter: drop-shadow(0 0 3px rgba(0, 255, 0, 0.3));
}

.prog-info {
  flex: 1;
  min-width: 0;
}

.prog-name {
  display: block;
  font-size: 0.8rem;
  font-weight: 600;
  color: #00ff00;
  letter-spacing: 0.03em;
  margin-bottom: 0.25rem;
}

.prog-desc {
  display: block;
  font-size: 0.68rem;
  color: rgba(0, 255, 0, 0.5);
  line-height: 1.4;
}

.prog-status {
  flex-shrink: 0;
}

.load-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.45rem 0.9rem;
  background: transparent;
  border: 1px solid rgba(0, 255, 0, 0.3);
  border-radius: 6px;
  color: rgba(0, 255, 0, 0.6);
  font-size: 0.6rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  transition: all 0.2s;
}

.load-btn svg {
  width: 12px;
  height: 12px;
}

.program-card:hover .load-btn {
  border-color: #00ff00;
  color: #00ff00;
  background: rgba(0, 255, 0, 0.1);
}

.loaded-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.45rem 0.9rem;
  background: rgba(0, 255, 0, 0.15);
  border: 1px solid #00ff00;
  border-radius: 6px;
  color: #00ff00;
  font-size: 0.6rem;
  font-weight: 600;
  letter-spacing: 0.08em;
}

.loaded-badge svg {
  width: 12px;
  height: 12px;
}

/* Loader animation on card */
.prog-loader {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0%;
  height: 2px;
  background: linear-gradient(90deg, transparent, #00ff00);
  transition: width 0.5s ease;
}

.program-card:active .prog-loader {
  width: 100%;
}

/* Loaded Bar */
.slide-up-enter-active {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
.slide-up-leave-active {
  transition: all 0.3s ease;
}
.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

.loaded-bar {
  background: linear-gradient(135deg, rgba(0, 255, 0, 0.08), rgba(0, 255, 0, 0.03));
  border: 1px solid rgba(0, 255, 0, 0.2);
  border-radius: 12px;
  padding: 1.25rem;
  margin-bottom: 1.5rem;
}

.loaded-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.loaded-label {
  font-size: 0.65rem;
  color: rgba(0, 255, 0, 0.5);
  letter-spacing: 0.12em;
  font-weight: 600;
}

.loaded-count {
  padding: 0.25rem 0.6rem;
  background: rgba(0, 255, 0, 0.15);
  border: 1px solid rgba(0, 255, 0, 0.3);
  border-radius: 20px;
  font-size: 0.7rem;
  font-weight: 700;
  color: #00ff00;
}

.loaded-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.loaded-item {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.5rem 0.9rem;
  background: rgba(0, 255, 0, 0.1);
  border: 1px solid rgba(0, 255, 0, 0.3);
  border-radius: 8px;
  font-size: 0.7rem;
  color: #00ff00;
  cursor: pointer;
  transition: all 0.2s;
}

.loaded-item:hover {
  background: #00ff00;
  color: #000;
  transform: scale(1.02);
}

.loaded-item:focus-visible {
  outline: 2px solid #00ff00;
  outline-offset: 2px;
}

.item-icon {
  font-size: 0.9rem;
}

.item-name {
  font-weight: 500;
}

.item-exec {
  opacity: 0;
  transform: translateX(-5px);
  transition: all 0.2s;
}

.loaded-item:hover .item-exec {
  opacity: 1;
  transform: translateX(0);
}

/* Footer */
.operator-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(0, 255, 0, 0.1);
}

.footer-hint {
  font-size: 0.65rem;
  color: rgba(0, 255, 0, 0.4);
}

.footer-hint kbd {
  padding: 0.15rem 0.4rem;
  background: rgba(0, 255, 0, 0.1);
  border: 1px solid rgba(0, 255, 0, 0.2);
  border-radius: 4px;
  font-family: inherit;
  font-size: 0.6rem;
}

.footer-actions {
  display: flex;
  gap: 0.75rem;
}

.operator-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.8rem 1.4rem;
  background: rgba(0, 255, 0, 0.05);
  border: 1px solid rgba(0, 255, 0, 0.3);
  border-radius: 8px;
  color: rgba(0, 255, 0, 0.8);
  font-family: inherit;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.operator-btn svg {
  width: 16px;
  height: 16px;
}

.operator-btn:hover {
  border-color: #00ff00;
  color: #00ff00;
  background: rgba(0, 255, 0, 0.1);
  transform: translateY(-2px);
}

.operator-btn:focus-visible {
  outline: 2px solid #00ff00;
  outline-offset: 2px;
}

.operator-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  transform: none;
}

.operator-btn--primary {
  background: linear-gradient(135deg, rgba(0, 255, 0, 0.2), rgba(0, 255, 0, 0.1));
  border-color: #00ff00;
  color: #00ff00;
  box-shadow: 0 0 20px rgba(0, 255, 0, 0.1);
}

.operator-btn--primary:hover:not(:disabled) {
  background: #00ff00;
  color: #000;
  box-shadow: 0 0 30px rgba(0, 255, 0, 0.4);
}

/* Responsive */
@media (max-width: 768px) {
  .operator-container {
    padding: 1.5rem;
    margin: 1rem;
    max-height: calc(100vh - 2rem);
  }
  
  .operator-header {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }
  
  .program-categories {
    justify-content: center;
  }
  
  .programs-grid {
    grid-template-columns: 1fr;
  }
  
  .operator-footer {
    flex-direction: column;
    text-align: center;
  }
  
  .footer-actions {
    width: 100%;
    flex-direction: column;
  }
  
  .operator-btn {
    width: 100%;
    justify-content: center;
  }
}

/* ============================================================================
   HOLOGRAPHIC SITEMAP STYLES
   ============================================================================ */

/* Transition */
.holo-fade-enter-active {
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}
.holo-fade-leave-active {
  transition: all 0.3s ease;
}
.holo-fade-enter-from,
.holo-fade-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

/* Overlay */
.hologram-overlay {
  position: fixed;
  inset: 0;
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 10, 0, 0.95);
  backdrop-filter: blur(10px);
}

/* Container */
.hologram-container {
  position: relative;
  width: 95vw;
  max-width: 1200px;
  max-height: 90vh;
  padding: 2rem;
  background: linear-gradient(160deg, 
    rgba(0, 40, 0, 0.9), 
    rgba(0, 20, 10, 0.95),
    rgba(0, 30, 20, 0.9)
  );
  border: 1px solid rgba(0, 255, 0, 0.3);
  border-radius: 20px;
  box-shadow:
    0 0 0 1px rgba(0, 255, 0, 0.1),
    0 25px 80px rgba(0, 0, 0, 0.8),
    0 0 100px rgba(0, 255, 0, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
  overflow-y: auto;
  overflow-x: hidden;
}

/* Scanline effect */
.hologram-container::before {
  content: '';
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    rgba(0, 255, 0, 0.03) 2px,
    rgba(0, 255, 0, 0.03) 4px
  );
  pointer-events: none;
  z-index: 10;
}

/* Close Button */
.holo-close {
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 255, 0, 0.1);
  border: 1px solid rgba(0, 255, 0, 0.3);
  border-radius: 12px;
  color: #00ff00;
  cursor: pointer;
  transition: all 0.25s;
  z-index: 20;
}

.holo-close svg {
  width: 20px;
  height: 20px;
  transition: transform 0.25s;
}

.holo-close:hover {
  background: rgba(0, 255, 0, 0.2);
  border-color: #00ff00;
}

.holo-close:hover svg {
  transform: rotate(90deg);
}

/* Header */
.holo-header {
  text-align: center;
  margin-bottom: 2rem;
  position: relative;
  z-index: 5;
}

.holo-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.4rem 1rem;
  background: rgba(0, 255, 0, 0.1);
  border: 1px solid rgba(0, 255, 0, 0.3);
  border-radius: 20px;
  font-size: 0.65rem;
  letter-spacing: 0.15em;
  color: rgba(0, 255, 0, 0.8);
  margin-bottom: 1rem;
}

.holo-pulse {
  width: 8px;
  height: 8px;
  background: #00ff00;
  border-radius: 50%;
  animation: holoPulse 2s ease-in-out infinite;
}

@keyframes holoPulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(0.8); }
}

.holo-title {
  font-size: 2rem;
  font-weight: 700;
  color: #00ff00;
  text-shadow: 0 0 30px rgba(0, 255, 0, 0.5);
  letter-spacing: 0.15em;
  margin-bottom: 0.5rem;
}

.holo-subtitle {
  font-size: 0.8rem;
  color: rgba(0, 255, 0, 0.5);
  letter-spacing: 0.1em;
}

/* Tree Container */
.holo-tree-container {
  position: relative;
  height: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 2rem;
}

.holo-tree {
  position: relative;
  width: 700px;
  height: 700px;
}

/* Center Node */
.holo-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 10;
}

.center-node {
  position: relative;
  width: 100px;
  height: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: radial-gradient(circle, rgba(0, 255, 0, 0.3), rgba(0, 255, 0, 0.1));
  border: 2px solid #00ff00;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s;
}

.center-node:hover {
  transform: scale(1.1);
  box-shadow: 0 0 40px rgba(0, 255, 0, 0.5);
}

.center-glow {
  position: absolute;
  inset: -20px;
  border: 1px solid rgba(0, 255, 0, 0.2);
  border-radius: 50%;
  animation: centerGlow 3s ease-in-out infinite;
}

@keyframes centerGlow {
  0%, 100% { transform: scale(1); opacity: 0.5; }
  50% { transform: scale(1.2); opacity: 0.2; }
}

.center-icon {
  font-size: 2rem;
  margin-bottom: 0.25rem;
}

.center-label {
  font-size: 0.7rem;
  font-weight: 700;
  color: #00ff00;
  letter-spacing: 0.1em;
}

/* Orbital Sections */
.holo-orbits {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.orbit-section {
  position: absolute;
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
  z-index: 5;
}

/* Section Node */
.section-node {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.3rem;
  padding: 1rem;
  background: rgba(0, 0, 0, 0.7);
  border: 2px solid var(--section-color, #00ff00);
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s;
  min-width: 90px;
}

.section-node:hover {
  transform: scale(1.1);
  box-shadow: 0 0 30px color-mix(in srgb, var(--section-color) 50%, transparent);
}

.section-node.expanded {
  background: color-mix(in srgb, var(--section-color) 15%, transparent);
  box-shadow: 0 0 50px color-mix(in srgb, var(--section-color) 40%, transparent);
}

.section-ring {
  position: absolute;
  inset: -8px;
  border: 1px solid var(--section-color);
  border-radius: 20px;
  opacity: 0.3;
  animation: sectionRing 4s linear infinite;
}

@keyframes sectionRing {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.section-icon {
  font-size: 1.5rem;
}

.section-label {
  font-size: 0.6rem;
  font-weight: 700;
  color: var(--section-color);
  letter-spacing: 0.1em;
  text-align: center;
}

.section-count {
  position: absolute;
  top: -8px;
  right: -8px;
  min-width: 22px;
  height: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--section-color);
  border-radius: 11px;
  font-size: 0.6rem;
  font-weight: 700;
  color: #000;
}

/* Section Routes (expanded) */
.routes-expand-enter-active {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
.routes-expand-leave-active {
  transition: all 0.2s ease;
}
.routes-expand-enter-from,
.routes-expand-leave-to {
  opacity: 0;
  transform: scale(0.8);
}

.section-routes {
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  padding: 0.75rem;
  background: rgba(0, 0, 0, 0.9);
  border: 1px solid rgba(0, 255, 0, 0.3);
  border-radius: 12px;
  max-height: 300px;
  overflow-y: auto;
  min-width: 200px;
  z-index: 100;
}

.route-node {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  background: rgba(0, 255, 0, 0.05);
  border: 1px solid rgba(0, 255, 0, 0.15);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  animation: routeFadeIn 0.3s ease-out;
  animation-delay: var(--route-delay, 0ms);
  animation-fill-mode: both;
}

@keyframes routeFadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.route-node:hover {
  background: rgba(0, 255, 0, 0.15);
  border-color: #00ff00;
  transform: translateX(5px);
}

.route-icon {
  font-size: 1rem;
  flex-shrink: 0;
}

.route-name {
  flex: 1;
  font-size: 0.7rem;
  font-weight: 500;
  color: #00ff00;
}

.route-path {
  font-size: 0.55rem;
  color: rgba(0, 255, 0, 0.4);
  font-family: monospace;
}

.routes-more {
  text-align: center;
  padding: 0.5rem;
  font-size: 0.65rem;
  color: rgba(0, 255, 0, 0.5);
  border-top: 1px solid rgba(0, 255, 0, 0.1);
  margin-top: 0.25rem;
}

/* Stats Bar */
.holo-stats {
  display: flex;
  justify-content: center;
  gap: 2rem;
  padding: 1.5rem;
  background: rgba(0, 255, 0, 0.03);
  border: 1px solid rgba(0, 255, 0, 0.15);
  border-radius: 12px;
  margin-bottom: 1.5rem;
}

.holo-stats .stat-item {
  text-align: center;
}

.holo-stats .stat-value {
  display: block;
  font-size: 1.5rem;
  font-weight: 700;
  color: #00ff00;
  text-shadow: 0 0 10px rgba(0, 255, 0, 0.5);
}

.holo-stats .stat-label {
  font-size: 0.6rem;
  color: rgba(0, 255, 0, 0.5);
  letter-spacing: 0.1em;
}

/* Quick Navigation */
.holo-quicknav {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.5rem;
}

.quicknav-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.5rem 1rem;
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid var(--btn-color, rgba(0, 255, 0, 0.3));
  border-radius: 8px;
  color: var(--btn-color, #00ff00);
  font-size: 0.65rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  cursor: pointer;
  transition: all 0.2s;
}

.quicknav-btn:hover {
  background: color-mix(in srgb, var(--btn-color, #00ff00) 20%, transparent);
  transform: translateY(-2px);
  box-shadow: 0 5px 20px color-mix(in srgb, var(--btn-color, #00ff00) 30%, transparent);
}

.quicknav-btn span {
  font-size: 1rem;
}

/* Hologram Quick Button */
.hologram-quick-btn {
  background: rgba(138, 43, 226, 0.15);
  border: 1px solid rgba(138, 43, 226, 0.5);
  color: #8a2be2;
  padding: 0.5rem 0.75rem;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.2s;
  border-radius: 4px;
}

.hologram-quick-btn:hover {
  background: rgba(138, 43, 226, 0.3);
  transform: scale(1.1);
  box-shadow: 0 0 15px rgba(138, 43, 226, 0.5);
}

/* Workflow Quick Button */
.workflow-quick-btn {
  background: rgba(255, 109, 0, 0.15);
  border: 1px solid rgba(255, 109, 0, 0.5);
  color: #ff6d00;
  padding: 0.5rem 0.75rem;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.2s;
  border-radius: 4px;
}

.workflow-quick-btn:hover {
  background: rgba(255, 109, 0, 0.3);
  transform: scale(1.1);
  box-shadow: 0 0 15px rgba(255, 109, 0, 0.5);
}

/* Pixel Art Quick Button */
.pixelart-quick-btn {
  background: rgba(255, 0, 255, 0.15);
  border: 1px solid rgba(255, 0, 255, 0.5);
  color: #ff00ff;
  padding: 0.5rem 0.75rem;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.2s;
  border-radius: 4px;
}

.pixelart-quick-btn:hover {
  background: rgba(255, 0, 255, 0.3);
  transform: scale(1.1);
  box-shadow: 0 0 15px rgba(255, 0, 255, 0.5);
}

/* Tech Feed Quick Button */
.techfeed-quick-btn {
  background: rgba(0, 200, 255, 0.15);
  border: 1px solid rgba(0, 200, 255, 0.5);
  color: #00c8ff;
  padding: 0.5rem 0.75rem;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.2s;
  border-radius: 4px;
}

.techfeed-quick-btn:hover {
  background: rgba(0, 200, 255, 0.3);
  transform: scale(1.1);
  box-shadow: 0 0 15px rgba(0, 200, 255, 0.5);
}

/* Responsive Hologram */
@media (max-width: 900px) {
  .holo-tree-container {
    height: 400px;
  }
  
  .holo-tree {
    width: 500px;
    height: 500px;
    transform: scale(0.7);
  }
  
  .holo-stats {
    flex-wrap: wrap;
    gap: 1rem;
  }
  
  .holo-quicknav {
    max-height: 150px;
    overflow-y: auto;
  }
}

@media (max-width: 600px) {
  .hologram-container {
    padding: 1rem;
    max-height: 90vh;
    overflow-y: auto;
  }
  
  .holo-tree-container {
    display: none;
  }
  
  .holo-quicknav {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 0.5rem;
  }
  
  .quicknav-btn {
    justify-content: center;
  }
  
  .holo-stats {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>
