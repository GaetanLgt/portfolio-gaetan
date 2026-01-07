<template>
  <div class="blue-house-scene" ref="sceneContainer">
    <!-- Three.js Canvas -->
    <canvas ref="canvas" class="three-canvas"></canvas>
    
    <!-- Overlay UI -->
    <div class="scene-overlay">
      <div class="scene-title">
        <span class="title-sketch">Du croquis</span>
        <span class="title-main">au code</span>
      </div>
      
      <div class="scene-stats">
        <div class="stat">
          <span class="stat-val">{{ lightsOn }}</span>
          <span class="stat-lbl">lumières</span>
        </div>
        <div class="stat">
          <span class="stat-val">∞</span>
          <span class="stat-lbl">possibilités</span>
        </div>
      </div>
      
      <p class="scene-hint">Déplace la souris pour explorer</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import * as THREE from 'three';

const sceneContainer = ref(null);
const canvas = ref(null);
const lightsOn = ref(0);

let scene, camera, renderer;
let mouseX = 0, mouseY = 0;
let windowLights = [];
let particles = [];

// Scene setup
function initScene() {
  // Scene
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0a1628);
  scene.fog = new THREE.FogExp2(0x0a1628, 0.015);

  // Camera
  camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 2, 15);

  // Renderer
  renderer = new THREE.WebGLRenderer({ 
    canvas: canvas.value, 
    antialias: true,
    alpha: true 
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  // Lights
  const ambientLight = new THREE.AmbientLight(0x1a3a6e, 0.3);
  scene.add(ambientLight);

  const moonLight = new THREE.DirectionalLight(0x4a6fa5, 0.5);
  moonLight.position.set(10, 20, 10);
  moonLight.castShadow = true;
  scene.add(moonLight);

  // Create scene elements
  createGround();
  createHouse();
  createTree();
  createStars();
  createFireflies();

  // Events
  window.addEventListener('resize', onResize);
  window.addEventListener('mousemove', onMouseMove);

  // Start animation
  animate();
}

// Ground plane
function createGround() {
  const groundGeo = new THREE.PlaneGeometry(100, 100);
  const groundMat = new THREE.MeshStandardMaterial({ 
    color: 0x1a2a3a,
    roughness: 0.9,
    metalness: 0.1
  });
  const ground = new THREE.Mesh(groundGeo, groundMat);
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -2;
  ground.receiveShadow = true;
  scene.add(ground);

  // Grid pattern on ground
  const gridHelper = new THREE.GridHelper(100, 50, 0x2a5298, 0x1a3a6e);
  gridHelper.position.y = -1.99;
  gridHelper.material.opacity = 0.3;
  gridHelper.material.transparent = true;
  scene.add(gridHelper);
}

// House structure
function createHouse() {
  const houseGroup = new THREE.Group();

  // Main building
  const houseGeo = new THREE.BoxGeometry(6, 8, 4);
  const houseMat = new THREE.MeshStandardMaterial({ 
    color: 0x2a5298,
    roughness: 0.7,
    metalness: 0.2
  });
  const house = new THREE.Mesh(houseGeo, houseMat);
  house.position.y = 2;
  house.castShadow = true;
  house.receiveShadow = true;
  houseGroup.add(house);

  // Roof
  const roofGeo = new THREE.BoxGeometry(6.5, 0.3, 4.5);
  const roofMat = new THREE.MeshStandardMaterial({ color: 0x1a3a6e });
  const roof = new THREE.Mesh(roofGeo, roofMat);
  roof.position.y = 6.15;
  houseGroup.add(roof);

  // Windows with lights
  const windowPositions = [
    { x: -1.5, y: 4, z: 2.01 },  // Top left
    { x: 1.5, y: 4, z: 2.01 },   // Top right
    { x: -1.5, y: 1, z: 2.01 },  // Bottom left
    { x: 1.5, y: 1, z: 2.01 },   // Bottom right
    { x: 0, y: 4, z: 2.01 },     // Top center
  ];

  windowPositions.forEach((pos, i) => {
    // Window frame
    const windowGeo = new THREE.BoxGeometry(1.2, 1.5, 0.1);
    const windowMat = new THREE.MeshStandardMaterial({ 
      color: 0x3d2817,
      roughness: 0.8
    });
    const windowMesh = new THREE.Mesh(windowGeo, windowMat);
    windowMesh.position.set(pos.x, pos.y, pos.z);
    houseGroup.add(windowMesh);

    // Window glass (will glow)
    const glassGeo = new THREE.BoxGeometry(0.9, 1.2, 0.05);
    const glassMat = new THREE.MeshStandardMaterial({ 
      color: 0x000000,
      emissive: 0xffaa44,
      emissiveIntensity: 0,
      transparent: true,
      opacity: 0.9
    });
    const glass = new THREE.Mesh(glassGeo, glassMat);
    glass.position.set(pos.x, pos.y, pos.z + 0.05);
    glass.userData = { 
      isWindow: true, 
      lightOn: false,
      targetIntensity: 0,
      delay: i * 500 + Math.random() * 1000
    };
    houseGroup.add(glass);
    windowLights.push(glass);

    // Point light for each window
    const light = new THREE.PointLight(0xffaa44, 0, 5);
    light.position.set(pos.x, pos.y, pos.z + 1);
    glass.userData.light = light;
    houseGroup.add(light);
  });

  // Door
  const doorGeo = new THREE.BoxGeometry(1.5, 2.5, 0.2);
  const doorMat = new THREE.MeshStandardMaterial({ color: 0x3d2817 });
  const door = new THREE.Mesh(doorGeo, doorMat);
  door.position.set(0, -0.75, 2.1);
  houseGroup.add(door);

  // Door light
  const doorLight = new THREE.PointLight(0xffdd88, 0.8, 4);
  doorLight.position.set(0, 0, 3);
  houseGroup.add(doorLight);

  // Steps
  for (let i = 0; i < 3; i++) {
    const stepGeo = new THREE.BoxGeometry(3 + i * 0.5, 0.3, 0.8);
    const stepMat = new THREE.MeshStandardMaterial({ color: 0x808080 });
    const step = new THREE.Mesh(stepGeo, stepMat);
    step.position.set(0, -2 + i * 0.25, 2.5 + i * 0.5);
    step.receiveShadow = true;
    houseGroup.add(step);
  }

  // Lanterns
  [-2, 2].forEach(x => {
    const lanternGeo = new THREE.SphereGeometry(0.15, 8, 8);
    const lanternMat = new THREE.MeshStandardMaterial({
      color: 0xffd700,
      emissive: 0xffd700,
      emissiveIntensity: 1
    });
    const lantern = new THREE.Mesh(lanternGeo, lanternMat);
    lantern.position.set(x, 0.5, 2.5);
    houseGroup.add(lantern);

    const lanternLight = new THREE.PointLight(0xffd700, 0.5, 3);
    lanternLight.position.set(x, 0.5, 2.5);
    houseGroup.add(lanternLight);
  });

  scene.add(houseGroup);

  // Trigger lights animation
  setTimeout(animateLightsOn, 1000);
}

// Tree
function createTree() {
  const treeGroup = new THREE.Group();
  treeGroup.position.set(-5, 0, 0);

  // Trunk
  const trunkGeo = new THREE.CylinderGeometry(0.3, 0.5, 8, 8);
  const trunkMat = new THREE.MeshStandardMaterial({ 
    color: 0x5c4033,
    roughness: 0.9
  });
  const trunk = new THREE.Mesh(trunkGeo, trunkMat);
  trunk.position.y = 2;
  trunk.castShadow = true;
  treeGroup.add(trunk);

  // Branches
  const branchGeo = new THREE.CylinderGeometry(0.08, 0.15, 3, 6);
  const branch1 = new THREE.Mesh(branchGeo, trunkMat);
  branch1.position.set(1, 4, 0);
  branch1.rotation.z = Math.PI / 4;
  treeGroup.add(branch1);

  // Foliage (multiple spheres)
  const foliagePositions = [
    { x: 0, y: 7, z: 0, r: 2 },
    { x: -1.5, y: 6, z: 0, r: 1.5 },
    { x: 1.5, y: 6.5, z: 0.5, r: 1.3 },
    { x: 0, y: 5.5, z: 1, r: 1.4 },
    { x: 0.5, y: 8, z: -0.5, r: 1.2 },
  ];

  foliagePositions.forEach(pos => {
    const foliageGeo = new THREE.SphereGeometry(pos.r, 12, 12);
    const foliageMat = new THREE.MeshStandardMaterial({
      color: 0x228b22,
      roughness: 0.8,
      transparent: true,
      opacity: 0.9
    });
    const foliage = new THREE.Mesh(foliageGeo, foliageMat);
    foliage.position.set(pos.x, pos.y, pos.z);
    foliage.castShadow = true;
    treeGroup.add(foliage);
  });

  scene.add(treeGroup);
}

// Stars background
function createStars() {
  const starsGeo = new THREE.BufferGeometry();
  const count = 1000;
  const positions = new Float32Array(count * 3);

  for (let i = 0; i < count * 3; i += 3) {
    positions[i] = (Math.random() - 0.5) * 200;
    positions[i + 1] = Math.random() * 50 + 10;
    positions[i + 2] = (Math.random() - 0.5) * 200;
  }

  starsGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const starsMat = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.1,
    transparent: true,
    opacity: 0.8
  });

  const stars = new THREE.Points(starsGeo, starsMat);
  scene.add(stars);
}

// Fireflies
function createFireflies() {
  for (let i = 0; i < 30; i++) {
    const fireflyGeo = new THREE.SphereGeometry(0.05, 8, 8);
    const fireflyMat = new THREE.MeshBasicMaterial({
      color: 0x7fff00,
      transparent: true,
      opacity: 0
    });
    const firefly = new THREE.Mesh(fireflyGeo, fireflyMat);
    
    firefly.position.set(
      (Math.random() - 0.5) * 20,
      Math.random() * 5 + 1,
      (Math.random() - 0.5) * 10
    );
    
    firefly.userData = {
      baseY: firefly.position.y,
      speed: 0.5 + Math.random() * 0.5,
      phase: Math.random() * Math.PI * 2,
      glowPhase: Math.random() * Math.PI * 2
    };

    scene.add(firefly);
    particles.push(firefly);
  }
}

// Animate lights turning on
function animateLightsOn() {
  windowLights.forEach((window, i) => {
    setTimeout(() => {
      window.userData.targetIntensity = 0.8 + Math.random() * 0.4;
      window.userData.lightOn = true;
      lightsOn.value++;
    }, window.userData.delay);
  });
}

// Mouse movement
function onMouseMove(e) {
  mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
  mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
}

// Resize
function onResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

// Animation loop
function animate() {
  requestAnimationFrame(animate);

  const time = Date.now() * 0.001;

  // Camera parallax
  camera.position.x += (mouseX * 3 - camera.position.x) * 0.05;
  camera.position.y += (-mouseY * 1.5 + 2 - camera.position.y) * 0.05;
  camera.lookAt(0, 2, 0);

  // Window lights animation
  windowLights.forEach(window => {
    const current = window.material.emissiveIntensity;
    const target = window.userData.targetIntensity;
    
    if (window.userData.lightOn) {
      // Smooth transition to target
      window.material.emissiveIntensity += (target - current) * 0.05;
      
      // Flickering effect
      const flicker = Math.sin(time * 3 + Math.random()) * 0.1;
      window.material.emissiveIntensity += flicker;
      
      // Update point light
      if (window.userData.light) {
        window.userData.light.intensity = window.material.emissiveIntensity * 0.5;
      }
    }
  });

  // Fireflies animation
  particles.forEach(firefly => {
    const data = firefly.userData;
    
    // Float movement
    firefly.position.y = data.baseY + Math.sin(time * data.speed + data.phase) * 0.5;
    firefly.position.x += Math.sin(time * 0.5 + data.phase) * 0.01;
    
    // Glow animation
    const glow = (Math.sin(time * 2 + data.glowPhase) + 1) * 0.5;
    firefly.material.opacity = glow * 0.8;
  });

  renderer.render(scene, camera);
}

onMounted(() => {
  initScene();
});

onUnmounted(() => {
  window.removeEventListener('resize', onResize);
  window.removeEventListener('mousemove', onMouseMove);
  if (renderer) {
    renderer.dispose();
  }
});
</script>

<style scoped>
.blue-house-scene {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background: #0a1628;
}

.three-canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.scene-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  padding: 3rem;
  pointer-events: none;
  z-index: 10;
}

.scene-title {
  text-align: center;
  margin-bottom: 2rem;
}

.title-sketch {
  display: block;
  font-family: 'Caveat', cursive;
  font-size: 1.5rem;
  color: rgba(125, 154, 106, 0.8);
}

.title-main {
  display: block;
  font-size: 3rem;
  font-weight: 700;
  color: #fff;
  text-shadow: 0 0 30px rgba(42, 82, 152, 0.8);
  letter-spacing: 0.1em;
}

.scene-stats {
  display: flex;
  gap: 3rem;
  margin-bottom: 1.5rem;
}

.stat {
  text-align: center;
}

.stat-val {
  display: block;
  font-size: 2rem;
  font-weight: 700;
  color: #ffd700;
  text-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
}

.stat-lbl {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.6);
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.scene-hint {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.4);
  font-style: italic;
}
</style>
