<template>
  <canvas ref="canvasRef" class="grid-canvas"></canvas>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import * as THREE from 'three';

const canvasRef = ref(null);
let animationId = null;
let renderer = null;

onMounted(() => {
  if (!canvasRef.value) return;
  
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  // Scene
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x050505, 0.015);
  
  // Camera
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(0, 5, 15);
  camera.lookAt(0, 0, 0);
  
  // Renderer
  renderer = new THREE.WebGLRenderer({
    canvas: canvasRef.value,
    alpha: true,
    antialias: true
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  
  // Grid
  const grid = new THREE.GridHelper(200, 50, 0x10B981, 0x1a1a1a);
  grid.position.y = -2;
  scene.add(grid);
  
  // Secondary grid (plus fine)
  const grid2 = new THREE.GridHelper(200, 100, 0x10B981, 0x111111);
  grid2.position.y = -2.01;
  grid2.material.opacity = 0.3;
  grid2.material.transparent = true;
  scene.add(grid2);
  
  // Animation
  const animate = () => {
    animationId = requestAnimationFrame(animate);
    
    // Avancement de la grille
    grid.position.z = (Date.now() * 0.002) % 4;
    grid2.position.z = (Date.now() * 0.002) % 2;
    
    renderer.render(scene, camera);
  };
  
  if (!prefersReducedMotion) {
    animate();
  } else {
    renderer.render(scene, camera);
  }
  
  // Resize
  const handleResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  };
  
  window.addEventListener('resize', handleResize);
  
  onUnmounted(() => {
    if (animationId) cancelAnimationFrame(animationId);
    window.removeEventListener('resize', handleResize);
    if (renderer) renderer.dispose();
  });
});
</script>

<style scoped>
.grid-canvas {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  pointer-events: none;
  opacity: 0.4;
}
</style>
