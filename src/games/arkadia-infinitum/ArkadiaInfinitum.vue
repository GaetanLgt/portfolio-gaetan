<template>
  <div class="arkadia" :class="{ playing: isPlaying }" ref="wrapper">
    <!-- PRELOADER -->
    <Transition name="fade-out">
      <div v-if="loading" class="preloader">
        <div class="loader-inner">
          <h1 class="glitch" data-text="ARKADIA">ARKADIA</h1>
          <span class="loader-sub">INFINITUM</span>
          <div class="loader-bar"><div :style="{width: loadPct+'%'}"></div></div>
          <p>{{ loadTxt }}</p>
        </div>
      </div>
    </Transition>

    <!-- CARENCES FX OVERLAY -->
    <div class="fx-layer">
      <div class="vignette"></div>
      <div v-if="vitamins.A < 30" class="vision-blur" :style="{opacity: (30 - vitamins.A) / 50}"></div>
      <div v-if="hunger < 20 || thirst < 20" class="low-stats-overlay"></div>
    </div>

    <!-- THREE.JS CONTAINER -->
    <div ref="threeContainer" class="three-container"></div>

    <!-- CROSSHAIR -->
    <div class="crosshair" v-if="!paused && !onboard && !loading">
      <span></span><span></span><span></span><span></span>
      <div v-if="target" class="crosshair-info">{{ target.name }}</div>
    </div>

    <!-- HUD -->
    <div class="hud" v-if="!loading">
      <!-- Stats Top Left - Survie -->
      <div class="hud-tl">
        <div class="stat-bar" :class="{crit: health < 30}">
          <span class="stat-icon">❤️</span>
          <div class="bar"><div class="fill hp" :style="{width: health+'%'}"></div></div>
          <span class="stat-val">{{Math.floor(health)}}</span>
        </div>
        <div class="stat-bar" :class="{warn: hunger < 40, crit: hunger < 20}">
          <span class="stat-icon">🍽️</span>
          <div class="bar"><div class="fill hunger" :style="{width: hunger+'%'}"></div></div>
          <span class="stat-val">{{Math.floor(hunger)}}</span>
        </div>
        <div class="stat-bar" :class="{warn: thirst < 40, crit: thirst < 20}">
          <span class="stat-icon">💧</span>
          <div class="bar"><div class="fill thirst" :style="{width: thirst+'%'}"></div></div>
          <span class="stat-val">{{Math.floor(thirst)}}</span>
        </div>
      </div>

      <!-- Vitamines Top Right -->
      <div class="hud-tr">
        <div class="vitamins-panel">
          <div class="vit-title">VITAMINES</div>
          <div class="vit-grid">
            <div v-for="(val, key) in vitamins" :key="key" class="vit-item" :class="{low: val < 30, high: val > 70}">
              <span class="vit-letter">{{key}}</span>
              <div class="vit-bar"><div :style="{width: val+'%'}" :class="'vit-'+key"></div></div>
              <span class="vit-val">{{Math.floor(val)}}</span>
            </div>
          </div>
        </div>
        <div class="score-box">
          <small>SCORE</small>
          <span>{{score}}</span>
        </div>
        <button class="menu-btn" @click="togglePause">☰</button>
      </div>

      <!-- Location Top Center -->
      <div class="hud-tc">
        <div class="loc-badge">
          <span>🪐</span>
          <div><strong>{{planet.name}}</strong><small>{{planet.type}} • Zone {{currentZone}}</small></div>
        </div>
      </div>

      <!-- Hotbar Bottom -->
      <div class="hud-bottom">
        <div class="hotbar">
          <div v-for="(s,i) in hotbar" :key="i" class="slot" :class="{active:selSlot===i}" @click="selSlot=i">
            <span v-if="s">{{s.icon}}</span>
            <small v-if="s?.count>1">{{s.count}}</small>
            <kbd>{{i+1}}</kbd>
          </div>
        </div>
      </div>

      <!-- Notifications -->
      <div class="notifs">
        <TransitionGroup name="notif">
          <div v-for="n in notifs" :key="n.id" class="notif" :class="n.type">
            <span>{{n.icon}}</span>{{n.text}}
          </div>
        </TransitionGroup>
      </div>

      <!-- Interact Prompt -->
      <Transition name="prompt">
        <div v-if="target" class="interact">
          <span class="t-ico">{{target.icon}}</span>
          <div class="t-info"><strong>{{target.name}}</strong><small>Clic pour récolter</small></div>
        </div>
      </Transition>
    </div>

    <!-- PAUSE MENU -->
    <Transition name="fade">
      <div v-if="paused && !onboard" class="pause-bg">
        <div class="pause-box">
          <h1>ARKADIA<small>INFINITUM</small></h1>
          <p>{{quote}}</p>
          <div class="pause-menu">
            <button @click="togglePause">▶ Reprendre</button>
            <button class="quit" @click="quit">🚪 Quitter</button>
          </div>
          <div class="pause-stats">
            <div><small>Temps</small><strong>{{ptime}}</strong></div>
            <div><small>Score</small><strong>{{score}}</strong></div>
            <div><small>Équilibre</small><strong>{{avgVitamins}}%</strong></div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- ONBOARDING -->
    <Transition name="fade">
      <div v-if="onboard" class="onboard-bg">
        <div class="onboard glass">
          <span class="ob-ico">🥗</span>
          <h2>Survie Nutritionnelle</h2>
          <div class="controls">
            <div><kbd>ZQSD</kbd><span>Déplacer</span></div>
            <div><kbd>SOURIS</kbd><span>Regarder</span></div>
            <div><kbd>ESPACE</kbd><span>Sauter</span></div>
            <div><kbd>CLIC</kbd><span>Récolter</span></div>
            <div><kbd>1-5</kbd><span>Hotbar</span></div>
            <div><kbd>ESC</kbd><span>Pause</span></div>
          </div>
          <div class="nutrition-info">
            <h4>🧬 Équilibre Vitaminique</h4>
            <div class="vit-legend">
              <div><span class="dot a"></span><strong>A</strong> Vision</div>
              <div><span class="dot b"></span><strong>B</strong> Énergie</div>
              <div><span class="dot c"></span><strong>C</strong> Immunité</div>
              <div><span class="dot e"></span><strong>E</strong> Régénération</div>
            </div>
          </div>
          <button class="start-btn" @click="start">Commencer la survie →</button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue';
import * as THREE from 'three';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';

// ============================================================================
// STATE
// ============================================================================
const loading = ref(true);
const loadPct = ref(0);
const loadTxt = ref('Initialisation...');

const wrapper = ref(null);
const threeContainer = ref(null);

// Survie
const health = ref(100);
const hunger = ref(80);
const thirst = ref(80);

// Vitamines
const vitamins = reactive({
  A: 50,
  B: 50,
  C: 50,
  E: 50
});

const score = ref(0);
const onboard = ref(true);
const paused = ref(false);
const selSlot = ref(0);
const notifs = ref([]);
const target = ref(null);
const currentZone = ref('Alpha');

const pstart = ref(null);
const ptime = ref('00:00');
const isPlaying = ref(false);

const planet = reactive({ name: 'KEPLER-442b', type: 'Tempéré' });

const hotbar = ref([
  { icon: '⛏️', name: 'Pioche', count: 1 },
  null, null, null, null
]);

// Aliments
const FOOD_TYPES = [
  // Fruits (Vitamine C++)
  { name: 'Orange', icon: '🍊', color: 0xffa500, hunger: 15, thirst: 10, vitamins: { A: 5, B: 2, C: 30, E: 2 }, count: 8, size: 0.4 },
  { name: 'Pomme', icon: '🍎', color: 0xff4444, hunger: 20, thirst: 15, vitamins: { A: 3, B: 2, C: 15, E: 3 }, count: 10, size: 0.35 },
  { name: 'Banane', icon: '🍌', color: 0xffe135, hunger: 25, thirst: 5, vitamins: { A: 2, B: 20, C: 12, E: 2 }, count: 6, size: 0.45 },
  
  // Légumes (Vitamine A++, C+)
  { name: 'Carotte', icon: '🥕', color: 0xff6600, hunger: 10, thirst: 8, vitamins: { A: 35, B: 5, C: 8, E: 5 }, count: 8, size: 0.3 },
  { name: 'Brocoli', icon: '🥦', color: 0x228b22, hunger: 15, thirst: 10, vitamins: { A: 15, B: 10, C: 30, E: 8 }, count: 6, size: 0.4 },
  { name: 'Tomate', icon: '🍅', color: 0xff6347, hunger: 10, thirst: 15, vitamins: { A: 20, B: 5, C: 25, E: 8 }, count: 8, size: 0.3 },
  { name: 'Épinards', icon: '🥬', color: 0x2e8b2e, hunger: 8, thirst: 12, vitamins: { A: 30, B: 15, C: 20, E: 15 }, count: 6, size: 0.35 },
  
  // Protéines animales (Vitamine B++, A+)
  { name: 'Viande', icon: '🍖', color: 0xaa4444, hunger: 40, thirst: -5, vitamins: { A: 8, B: 35, C: 0, E: 5 }, count: 5, size: 0.5 },
  { name: 'Poisson', icon: '🐟', color: 0x6699cc, hunger: 30, thirst: 5, vitamins: { A: 12, B: 30, C: 0, E: 10 }, count: 6, size: 0.45 },
  { name: 'Oeuf', icon: '🥚', color: 0xffffee, hunger: 20, thirst: 0, vitamins: { A: 20, B: 25, C: 0, E: 8 }, count: 8, size: 0.25 },
  
  // Produits laitiers (Vitamine A, B, E pour le lait)
  { name: 'Lait', icon: '🥛', color: 0xffffff, hunger: 10, thirst: 25, vitamins: { A: 15, B: 20, C: 2, E: 5 }, count: 8, size: 0.4, isWater: true },
  { name: 'Fromage', icon: '🧀', color: 0xffd700, hunger: 25, thirst: -5, vitamins: { A: 25, B: 15, C: 0, E: 3 }, count: 5, size: 0.3 },
  
  // Noix & Graines (Vitamine E++)
  { name: 'Amandes', icon: '🥜', color: 0xdeb887, hunger: 15, thirst: -5, vitamins: { A: 0, B: 15, C: 0, E: 40 }, count: 5, size: 0.25 },
  { name: 'Tournesol', icon: '🌻', color: 0xffc125, hunger: 12, thirst: -3, vitamins: { A: 2, B: 20, C: 2, E: 50 }, count: 4, size: 0.3 },
  { name: 'Avocat', icon: '🥑', color: 0x568203, hunger: 18, thirst: 8, vitamins: { A: 5, B: 15, C: 15, E: 30 }, count: 5, size: 0.4 },
  
  // Boissons (Hydratation++)
  { name: 'Eau', icon: '💧', color: 0x4da6ff, hunger: 0, thirst: 40, vitamins: { A: 0, B: 0, C: 0, E: 0 }, count: 12, size: 0.35, isWater: true },
  { name: 'Jus Orange', icon: '🧃', color: 0xffaa00, hunger: 5, thirst: 30, vitamins: { A: 5, B: 5, C: 35, E: 2 }, count: 6, size: 0.4 }
];

// Computed
const avgVitamins = computed(() => Math.round((vitamins.A + vitamins.B + vitamins.C + vitamins.E) / 4));

const quote = computed(() => {
  if (hunger.value < 20) return "J'ai tellement faim...";
  if (thirst.value < 20) return "Besoin d'eau...";
  if (avgVitamins.value < 30) return "Carences détectées";
  return "Équilibre nutritionnel";
});

// ============================================================================
// THREE.JS
// ============================================================================
let scene, camera, renderer, controls, clock;
let velocity, direction;
let canJump = false;
let moveForward = false, moveBackward = false, moveLeft = false, moveRight = false;

const resources = [];
const resourceMeshes = [];
const ARENA_SIZE = 50;
const WALL_HEIGHT = 8;

function initThree() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x1a2a1a);
  scene.fog = new THREE.FogExp2(0x1a2a1a, 0.015);

  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 2, 0);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  threeContainer.value.appendChild(renderer.domElement);

  controls = new PointerLockControls(camera, renderer.domElement);

  // Lights
  scene.add(new THREE.AmbientLight(0x88aa88, 0.5));
  
  const sun = new THREE.DirectionalLight(0xffffee, 1);
  sun.position.set(30, 50, 30);
  sun.castShadow = true;
  sun.shadow.mapSize.width = 2048;
  sun.shadow.mapSize.height = 2048;
  scene.add(sun);

  createArena();
  createResources();
  createSky();

  clock = new THREE.Clock();
  velocity = new THREE.Vector3();
  direction = new THREE.Vector3();

  window.addEventListener('resize', onResize);
  document.addEventListener('keydown', onKeyDown);
  document.addEventListener('keyup', onKeyUp);
  renderer.domElement.addEventListener('click', onCanvasClick);
}

function createArena() {
  // Sol herbeux
  const floorGeo = new THREE.PlaneGeometry(ARENA_SIZE, ARENA_SIZE);
  const floorMat = new THREE.MeshStandardMaterial({ color: 0x2d5a2d, roughness: 0.9 });
  const floor = new THREE.Mesh(floorGeo, floorMat);
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  scene.add(floor);

  // Grille
  const grid = new THREE.GridHelper(ARENA_SIZE, 25, 0x3a7a3a, 0x1a3a1a);
  grid.position.y = 0.01;
  scene.add(grid);

  // Murs en bois
  const wallMat = new THREE.MeshStandardMaterial({ color: 0x4a3728, roughness: 0.8 });
  const wallGeo = new THREE.BoxGeometry(ARENA_SIZE, WALL_HEIGHT, 0.5);

  [[0, -ARENA_SIZE/2], [0, ARENA_SIZE/2]].forEach(([x, z]) => {
    const wall = new THREE.Mesh(wallGeo, wallMat);
    wall.position.set(x, WALL_HEIGHT/2, z);
    scene.add(wall);
  });

  const wallGeo2 = new THREE.BoxGeometry(0.5, WALL_HEIGHT, ARENA_SIZE);
  [[-ARENA_SIZE/2, 0], [ARENA_SIZE/2, 0]].forEach(([x, z]) => {
    const wall = new THREE.Mesh(wallGeo2, wallMat);
    wall.position.set(x, WALL_HEIGHT/2, z);
    scene.add(wall);
  });

  // Poteaux
  const postGeo = new THREE.CylinderGeometry(0.3, 0.4, WALL_HEIGHT + 1, 8);
  const postMat = new THREE.MeshStandardMaterial({ color: 0x5a4a38 });
  [[-1,-1], [-1,1], [1,-1], [1,1]].forEach(([sx, sz]) => {
    const post = new THREE.Mesh(postGeo, postMat);
    post.position.set(sx * ARENA_SIZE/2, WALL_HEIGHT/2 + 0.5, sz * ARENA_SIZE/2);
    post.castShadow = true;
    scene.add(post);
  });
}

function createResources() {
  FOOD_TYPES.forEach(type => {
    for (let i = 0; i < type.count; i++) {
      let x, z;
      do {
        x = (Math.random() - 0.5) * (ARENA_SIZE - 6);
        z = (Math.random() - 0.5) * (ARENA_SIZE - 6);
      } while (Math.sqrt(x*x + z*z) < 4);

      const geo = type.isWater 
        ? new THREE.CylinderGeometry(type.size * 0.5, type.size * 0.5, type.size * 1.2, 8)
        : new THREE.SphereGeometry(type.size, 12, 12);
      
      const mat = new THREE.MeshStandardMaterial({ color: type.color, roughness: 0.5 });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(x, type.size + 0.2, z);
      mesh.castShadow = true;
      mesh.userData = { ...type, index: resources.length };

      scene.add(mesh);
      resources.push({ mesh, type, collected: false });
      resourceMeshes.push(mesh);
    }
  });
}

function createSky() {
  // Ciel bleu-vert
  const skyGeo = new THREE.SphereGeometry(200, 32, 32);
  const skyMat = new THREE.MeshBasicMaterial({ color: 0x87ceeb, side: THREE.BackSide });
  scene.add(new THREE.Mesh(skyGeo, skyMat));

  // Soleil
  const sunGeo = new THREE.SphereGeometry(8, 32, 32);
  const sunMat = new THREE.MeshBasicMaterial({ color: 0xffff88 });
  const sun = new THREE.Mesh(sunGeo, sunMat);
  sun.position.set(60, 80, -60);
  scene.add(sun);

  // Nuages simples
  for (let i = 0; i < 10; i++) {
    const cloudGeo = new THREE.SphereGeometry(5 + Math.random() * 5, 8, 8);
    const cloudMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.8 });
    const cloud = new THREE.Mesh(cloudGeo, cloudMat);
    cloud.position.set(
      (Math.random() - 0.5) * 150,
      40 + Math.random() * 20,
      (Math.random() - 0.5) * 150
    );
    cloud.scale.set(2, 0.5, 1);
    scene.add(cloud);
  }
}

function onResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function onKeyDown(e) {
  if (onboard.value) return;
  switch (e.code) {
    case 'KeyW': case 'KeyZ': moveForward = true; break;
    case 'KeyS': moveBackward = true; break;
    case 'KeyA': case 'KeyQ': moveLeft = true; break;
    case 'KeyD': moveRight = true; break;
    case 'Space': if (canJump) { velocity.y = 8; canJump = false; } break;
    case 'Escape': togglePause(); break;
    case 'Digit1': case 'Digit2': case 'Digit3': case 'Digit4': case 'Digit5':
      selSlot.value = parseInt(e.code.replace('Digit', '')) - 1; break;
  }
}

function onKeyUp(e) {
  switch (e.code) {
    case 'KeyW': case 'KeyZ': moveForward = false; break;
    case 'KeyS': moveBackward = false; break;
    case 'KeyA': case 'KeyQ': moveLeft = false; break;
    case 'KeyD': moveRight = false; break;
  }
}

function onCanvasClick() {
  if (onboard.value) return;
  if (!controls.isLocked) controls.lock();
  else collectResource();
}

function collectResource() {
  const ray = new THREE.Raycaster();
  ray.setFromCamera(new THREE.Vector2(0, 0), camera);
  const hits = ray.intersectObjects(resourceMeshes);
  
  if (hits.length > 0 && hits[0].distance < 5) {
    const mesh = hits[0].object;
    const data = mesh.userData;
    const idx = data.index;
    
    if (resources[idx] && !resources[idx].collected) {
      resources[idx].collected = true;
      
      // Animation
      const anim = () => {
        mesh.position.y += 0.15;
        mesh.rotation.y += 0.3;
        mesh.scale.multiplyScalar(0.9);
        if (mesh.scale.x > 0.05) requestAnimationFrame(anim);
        else {
          scene.remove(mesh);
          resourceMeshes.splice(resourceMeshes.indexOf(mesh), 1);
        }
      };
      anim();

      // Effets
      hunger.value = Math.min(100, hunger.value + data.hunger);
      thirst.value = Math.min(100, Math.max(0, thirst.value + data.thirst));
      
      Object.keys(data.vitamins).forEach(v => {
        vitamins[v] = Math.min(100, vitamins[v] + data.vitamins[v]);
      });
      
      score.value += data.hunger + Math.max(0, data.thirst) + Object.values(data.vitamins).reduce((a,b) => a+b, 0);
      
      if (data.hunger > 0) notify('🍽️', `Faim +${data.hunger}`, 'success');
      if (data.thirst > 0) notify('💧', `Soif +${data.thirst}`, 'info');
      
      // Vitamines significatives
      Object.entries(data.vitamins).forEach(([v, val]) => {
        if (val >= 15) notify(v === 'A' ? '👁️' : v === 'B' ? '⚡' : v === 'C' ? '🛡️' : '💚', `Vit. ${v} +${val}`, 'warning');
      });
      
      addToHotbar(data.name, data.icon);
      
      if (resources.every(r => r.collected)) {
        notify('🎉', 'Zone récoltée !', 'success');
        setTimeout(respawnResources, 1500);
      }
    }
  }
}

function addToHotbar(name, icon) {
  for (let i = 0; i < hotbar.value.length; i++) {
    if (hotbar.value[i]?.name === name) { hotbar.value[i].count++; return; }
  }
  for (let i = 0; i < hotbar.value.length; i++) {
    if (!hotbar.value[i]) { hotbar.value[i] = { name, icon, count: 1 }; return; }
  }
}

function respawnResources() {
  currentZone.value = ['Alpha', 'Beta', 'Gamma', 'Delta'][Math.floor(Math.random() * 4)];
  resources.forEach(r => {
    r.collected = false;
    let x, z;
    do {
      x = (Math.random() - 0.5) * (ARENA_SIZE - 6);
      z = (Math.random() - 0.5) * (ARENA_SIZE - 6);
    } while (Math.sqrt(x*x + z*z) < 4);
    r.mesh.position.set(x, r.type.size + 0.2, z);
    r.mesh.scale.set(1, 1, 1);
    scene.add(r.mesh);
    if (!resourceMeshes.includes(r.mesh)) resourceMeshes.push(r.mesh);
  });
}

function notify(icon, text, type = 'info') {
  const id = Date.now() + Math.random();
  notifs.value.push({ id, icon, text, type });
  setTimeout(() => notifs.value = notifs.value.filter(n => n.id !== id), 3000);
}

function togglePause() {
  paused.value = !paused.value;
  if (paused.value) {
    controls.unlock();
    isPlaying.value = false;
  } else {
    controls.lock();
    isPlaying.value = true;
  }
}

function quit() { window.location.href = '/arcade'; }

function start() {
  onboard.value = false;
  pstart.value = Date.now();
  isPlaying.value = true;
  controls.lock();
}

// ============================================================================
// GAME LOOP
// ============================================================================
function animate() {
  requestAnimationFrame(animate);
  
  if (!controls || !scene || loading.value) {
    if (renderer && scene && camera) renderer.render(scene, camera);
    return;
  }

  if (paused.value || onboard.value) {
    renderer.render(scene, camera);
    return;
  }

  const delta = Math.min(clock.getDelta(), 0.1);

  // === SURVIE ===
  if (Math.random() < 0.015) {
    hunger.value = Math.max(0, hunger.value - 0.25);
    thirst.value = Math.max(0, thirst.value - 0.35);
  }
  
  if (Math.random() < 0.008) {
    Object.keys(vitamins).forEach(v => vitamins[v] = Math.max(0, vitamins[v] - 0.15));
  }
  
  // Effets carences
  if (vitamins.A < 30 && scene.fog) scene.fog.density = 0.02 + (30 - vitamins.A) * 0.001;
  else if (scene.fog) scene.fog.density = 0.015;
  
  if ((hunger.value < 10 || thirst.value < 10) && Math.random() < 0.008) {
    health.value = Math.max(1, health.value - 0.5);
  }
  
  if (hunger.value > 60 && thirst.value > 60 && health.value < 100) {
    const rate = vitamins.E > 50 ? 0.015 : 0.005;
    if (Math.random() < rate) health.value = Math.min(100, health.value + 0.5);
  }
  
  if (hunger.value < 15 && Math.random() < 0.003) notify('🍽️', 'Tu as faim !', 'warning');
  if (thirst.value < 15 && Math.random() < 0.003) notify('💧', 'Tu as soif !', 'danger');

  // Timer
  if (pstart.value) {
    const s = Math.floor((Date.now() - pstart.value) / 1000);
    ptime.value = `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;
  }

  // Physics
  velocity.y -= 20 * delta;
  direction.z = Number(moveForward) - Number(moveBackward);
  direction.x = Number(moveRight) - Number(moveLeft);
  direction.normalize();

  let speed = 12;
  if (vitamins.B < 30) speed = 8;
  else if (vitamins.B > 70) speed = 15;

  if (moveForward || moveBackward) velocity.z -= direction.z * speed * delta;
  if (moveLeft || moveRight) velocity.x -= direction.x * speed * delta;

  velocity.x *= 0.88;
  velocity.z *= 0.88;

  controls.moveRight(-velocity.x * delta);
  controls.moveForward(-velocity.z * delta);
  camera.position.y += velocity.y * delta;

  if (camera.position.y < 2) { camera.position.y = 2; velocity.y = 0; canJump = true; }

  const lim = ARENA_SIZE / 2 - 1;
  camera.position.x = Math.max(-lim, Math.min(lim, camera.position.x));
  camera.position.z = Math.max(-lim, Math.min(lim, camera.position.z));

  // Target
  const ray = new THREE.Raycaster();
  ray.setFromCamera(new THREE.Vector2(0, 0), camera);
  const hits = ray.intersectObjects(resourceMeshes);
  target.value = (hits.length > 0 && hits[0].distance < 5) 
    ? { name: hits[0].object.userData.name, icon: hits[0].object.userData.icon } 
    : null;

  // Animate food
  resources.forEach((r, i) => {
    if (!r.collected && r.mesh.parent) {
      r.mesh.rotation.y += 0.015;
      r.mesh.position.y = r.type.size + 0.2 + Math.sin(Date.now() * 0.003 + i) * 0.08;
    }
  });

  renderer.render(scene, camera);
}

// ============================================================================
// LIFECYCLE
// ============================================================================
onMounted(async () => {
  for (let i = 0; i < 4; i++) {
    loadTxt.value = ['Chargement...', 'Création du terrain...', 'Placement des aliments...', 'Prêt !'][i];
    loadPct.value = (i + 1) * 25;
    await new Promise(r => setTimeout(r, 250));
  }
  initThree();
  await new Promise(r => setTimeout(r, 200));
  loading.value = false;
  animate();
});

onUnmounted(() => {
  window.removeEventListener('resize', onResize);
  document.removeEventListener('keydown', onKeyDown);
  document.removeEventListener('keyup', onKeyUp);
  if (renderer) renderer.dispose();
});
</script>

<style scoped>
.arkadia {
  position: fixed;
  inset: 0;
  z-index: 99999 !important;
  background: #1a2a1a;
  font-family: 'Space Grotesk', system-ui, sans-serif;
  color: #e8eaf6;
  overflow: hidden;
  cursor: default;
}

.arkadia.playing {
  cursor: none;
}

.three-container { position: absolute; inset: 0; z-index: 1; }

/* FX */
.fx-layer { position: fixed; inset: 0; pointer-events: none; z-index: 200; }
.vignette { position: absolute; inset: 0; background: radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.5) 100%); }
.vision-blur { position: absolute; inset: 0; backdrop-filter: blur(3px); background: rgba(0,0,0,0.2); }
.low-stats-overlay { position: absolute; inset: 0; background: rgba(255,0,0,0.05); animation: pulse 1s infinite; }
@keyframes pulse { 0%,100% { opacity: 0.3; } 50% { opacity: 0.6; } }

/* Crosshair */
.crosshair { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 100; pointer-events: none; }
.crosshair span { position: absolute; background: rgba(255,255,255,0.9); box-shadow: 0 0 4px #4ade80; }
.crosshair span:nth-child(1) { width: 2px; height: 12px; top: -18px; left: -1px; }
.crosshair span:nth-child(2) { width: 2px; height: 12px; bottom: -18px; left: -1px; }
.crosshair span:nth-child(3) { width: 12px; height: 2px; left: -18px; top: -1px; }
.crosshair span:nth-child(4) { width: 12px; height: 2px; right: -18px; top: -1px; }
.crosshair-info { position: absolute; top: 28px; left: 50%; transform: translateX(-50%); background: rgba(0,0,0,0.8); padding: 0.2rem 0.5rem; border-radius: 4px; font-size: 0.7rem; white-space: nowrap; border: 1px solid #4ade80; }

/* HUD */
.hud { position: fixed; inset: 0; pointer-events: none; z-index: 100; padding: 1rem; }
.hud > * { pointer-events: auto; }

.hud-tl { position: absolute; top: 1rem; left: 1rem; display: flex; flex-direction: column; gap: 0.4rem; }

.stat-bar { display: flex; align-items: center; gap: 0.4rem; background: rgba(0,0,0,0.7); backdrop-filter: blur(8px); padding: 0.35rem 0.6rem; border-radius: 6px; border: 1px solid rgba(255,255,255,0.1); min-width: 130px; }
.stat-bar.warn { border-color: #f59e0b; }
.stat-bar.crit { border-color: #ef4444; animation: pulse 0.5s infinite; }
.stat-icon { font-size: 0.85rem; }
.bar { flex: 1; height: 5px; background: rgba(255,255,255,0.1); border-radius: 3px; overflow: hidden; }
.fill { height: 100%; border-radius: 3px; transition: width 0.3s; }
.fill.hp { background: linear-gradient(90deg, #ef4444, #dc2626); }
.fill.hunger { background: linear-gradient(90deg, #f59e0b, #d97706); }
.fill.thirst { background: linear-gradient(90deg, #3b82f6, #2563eb); }
.stat-val { font-size: 0.65rem; font-weight: 600; min-width: 18px; text-align: right; }

.hud-tr { position: absolute; top: 1rem; right: 1rem; display: flex; align-items: flex-start; gap: 0.6rem; }

.vitamins-panel { background: rgba(0,0,0,0.7); backdrop-filter: blur(8px); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; padding: 0.5rem; }
.vit-title { font-size: 0.5rem; letter-spacing: 0.1em; color: rgba(255,255,255,0.5); margin-bottom: 0.3rem; text-align: center; }
.vit-grid { display: flex; flex-direction: column; gap: 0.25rem; }
.vit-item { display: flex; align-items: center; gap: 0.3rem; }
.vit-item.low .vit-letter { color: #ef4444; }
.vit-item.high .vit-letter { color: #4ade80; }
.vit-letter { font-size: 0.6rem; font-weight: bold; width: 12px; }
.vit-bar { width: 40px; height: 4px; background: rgba(255,255,255,0.1); border-radius: 2px; overflow: hidden; }
.vit-bar > div { height: 100%; border-radius: 2px; transition: width 0.3s; }
.vit-A { background: #f97316; }
.vit-B { background: #eab308; }
.vit-C { background: #22c55e; }
.vit-E { background: #a855f7; }
.vit-val { font-size: 0.55rem; width: 16px; text-align: right; }

.score-box { background: rgba(0,0,0,0.7); backdrop-filter: blur(8px); border: 1px solid #4ade80; border-radius: 6px; padding: 0.3rem 0.7rem; text-align: center; }
.score-box small { font-size: 0.45rem; color: rgba(255,255,255,0.5); display: block; letter-spacing: 0.1em; }
.score-box span { font-size: 1rem; font-weight: bold; color: #4ade80; }

.menu-btn { width: 34px; height: 34px; background: rgba(0,0,0,0.7); backdrop-filter: blur(8px); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; color: #fff; cursor: pointer; transition: all 0.2s; }
.menu-btn:hover { background: rgba(255,255,255,0.1); border-color: #4ade80; }

.hud-tc { position: absolute; top: 1rem; left: 50%; transform: translateX(-50%); }
.loc-badge { display: flex; align-items: center; gap: 0.5rem; background: rgba(0,0,0,0.7); backdrop-filter: blur(8px); border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 0.3rem 0.8rem; }
.loc-badge span { font-size: 1rem; }
.loc-badge strong { font-size: 0.75rem; color: #4ade80; display: block; }
.loc-badge small { font-size: 0.55rem; color: rgba(255,255,255,0.5); }

.hud-bottom { position: absolute; bottom: 1rem; left: 50%; transform: translateX(-50%); }
.hotbar { display: flex; gap: 3px; background: rgba(0,0,0,0.7); backdrop-filter: blur(8px); border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; padding: 5px; }
.slot { width: 46px; height: 46px; background: rgba(255,255,255,0.05); border: 2px solid transparent; border-radius: 6px; position: relative; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 1.3rem; transition: all 0.2s; }
.slot:hover { background: rgba(255,255,255,0.1); }
.slot.active { border-color: #4ade80; box-shadow: 0 0 12px rgba(74,222,128,0.4); }
.slot small { position: absolute; bottom: 1px; right: 3px; font-size: 0.55rem; font-weight: bold; background: rgba(0,0,0,0.7); padding: 1px 3px; border-radius: 2px; }
.slot kbd { position: absolute; top: 1px; left: 3px; font-size: 0.45rem; color: rgba(255,255,255,0.4); }

/* Notifications */
.notifs { position: fixed; top: 80px; right: 1rem; display: flex; flex-direction: column; gap: 0.3rem; z-index: 300; }
.notif { display: flex; align-items: center; gap: 0.4rem; background: rgba(0,0,0,0.8); backdrop-filter: blur(8px); border: 1px solid rgba(255,255,255,0.1); border-radius: 6px; padding: 0.4rem 0.6rem; font-size: 0.7rem; animation: slideIn 0.3s ease-out; }
@keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
.notif.success { border-left: 3px solid #4ade80; }
.notif.warning { border-left: 3px solid #f59e0b; }
.notif.danger { border-left: 3px solid #ef4444; }
.notif.info { border-left: 3px solid #3b82f6; }
.notif-enter-active, .notif-leave-active { transition: all 0.3s; }
.notif-enter-from, .notif-leave-to { opacity: 0; transform: translateX(20px); }

/* Interact */
.interact { position: fixed; bottom: 90px; left: 50%; transform: translateX(-50%); background: rgba(0,0,0,0.8); backdrop-filter: blur(8px); border: 1px solid #4ade80; border-radius: 10px; padding: 0.5rem 0.8rem; display: flex; align-items: center; gap: 0.5rem; }
.t-ico { font-size: 1.3rem; }
.t-info strong { display: block; font-size: 0.8rem; color: #4ade80; }
.t-info small { font-size: 0.6rem; color: rgba(255,255,255,0.5); }
.prompt-enter-active, .prompt-leave-active { transition: all 0.2s; }
.prompt-enter-from, .prompt-leave-to { opacity: 0; transform: translateX(-50%) translateY(10px); }

/* Pause */
.pause-bg { position: fixed; inset: 0; z-index: 500; background: rgba(0,0,0,0.9); backdrop-filter: blur(10px); display: flex; align-items: center; justify-content: center; }
.pause-box { text-align: center; max-width: 300px; }
.pause-box h1 { font-size: 1.8rem; font-weight: 900; letter-spacing: 0.1em; color: #4ade80; margin-bottom: 0.3rem; }
.pause-box h1 small { display: block; font-size: 0.65rem; letter-spacing: 0.3em; color: rgba(255,255,255,0.5); font-weight: 400; }
.pause-box > p { color: rgba(255,255,255,0.5); margin-bottom: 1.2rem; font-size: 0.8rem; }
.pause-menu { display: flex; flex-direction: column; gap: 0.4rem; margin-bottom: 1.2rem; }
.pause-menu button { padding: 0.7rem 1.2rem; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; color: #fff; cursor: pointer; font-size: 0.85rem; transition: all 0.2s; }
.pause-menu button:hover { background: rgba(255,255,255,0.1); border-color: #4ade80; }
.pause-menu .quit:hover { border-color: #ef4444; }
.pause-stats { display: flex; justify-content: center; gap: 1.2rem; }
.pause-stats > div { text-align: center; }
.pause-stats small { display: block; font-size: 0.5rem; color: rgba(255,255,255,0.5); text-transform: uppercase; }
.pause-stats strong { font-size: 0.9rem; color: #4ade80; }

/* Onboarding */
.onboard-bg { position: fixed; inset: 0; z-index: 600; background: rgba(0,0,0,0.95); display: flex; align-items: center; justify-content: center; padding: 1rem; }
.onboard { max-width: 400px; width: 100%; padding: 1.3rem; background: rgba(0,0,0,0.8); backdrop-filter: blur(15px); border: 1px solid rgba(255,255,255,0.1); border-radius: 14px; }
.ob-ico { font-size: 2.2rem; display: block; text-align: center; margin-bottom: 0.4rem; }
.onboard h2 { text-align: center; font-size: 1.2rem; color: #4ade80; margin-bottom: 0.8rem; }
.controls { display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.35rem; margin-bottom: 0.8rem; }
.controls > div { display: flex; align-items: center; gap: 0.5rem; padding: 0.35rem 0.5rem; background: rgba(255,255,255,0.05); border-radius: 5px; }
.controls kbd { background: #4ade80; color: #000; padding: 0.15rem 0.35rem; border-radius: 3px; font-weight: bold; font-size: 0.55rem; min-width: 45px; text-align: center; }
.controls span { font-size: 0.65rem; color: rgba(255,255,255,0.6); }
.nutrition-info { background: rgba(74,222,128,0.1); border: 1px solid rgba(74,222,128,0.3); border-radius: 8px; padding: 0.6rem; margin-bottom: 0.8rem; }
.nutrition-info h4 { font-size: 0.7rem; color: #4ade80; margin-bottom: 0.4rem; }
.vit-legend { display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.3rem; }
.vit-legend > div { display: flex; align-items: center; gap: 0.3rem; font-size: 0.6rem; }
.dot { width: 8px; height: 8px; border-radius: 50%; }
.dot.a { background: #f97316; }
.dot.b { background: #eab308; }
.dot.c { background: #22c55e; }
.dot.e { background: #a855f7; }
.start-btn { width: 100%; padding: 0.7rem; background: linear-gradient(135deg, #4ade80, #22c55e); border: none; border-radius: 8px; color: #000; font-size: 0.85rem; font-weight: 600; cursor: pointer; transition: all 0.3s; }
.start-btn:hover { transform: scale(1.02); box-shadow: 0 0 20px rgba(74,222,128,0.4); }

/* Preloader */
.preloader { position: fixed; inset: 0; background: #0a150a; display: flex; align-items: center; justify-content: center; z-index: 9999; }
.loader-inner { text-align: center; }
.glitch { font-size: clamp(2rem, 7vw, 4rem); font-weight: 900; letter-spacing: 0.15em; color: #4ade80; }
.loader-sub { display: block; font-size: 0.9rem; letter-spacing: 0.4em; color: rgba(255,255,255,0.5); margin-top: 0.3rem; }
.loader-bar { width: 240px; height: 4px; background: rgba(255,255,255,0.1); border-radius: 2px; margin: 2rem auto 0.8rem; overflow: hidden; }
.loader-bar div { height: 100%; background: linear-gradient(90deg, #4ade80, #22c55e); transition: width 0.3s; }
.preloader p { color: rgba(255,255,255,0.5); font-size: 0.75rem; }

/* Transitions */
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
.fade-out-enter-active, .fade-out-leave-active { transition: opacity 0.5s; }
.fade-out-enter-from, .fade-out-leave-to { opacity: 0; }

/* Responsive */
@media (max-width: 768px) {
  .stat-bar { min-width: 100px; }
  .slot { width: 40px; height: 40px; }
  .vitamins-panel { display: none; }
  .controls { grid-template-columns: 1fr; }
}
</style>
