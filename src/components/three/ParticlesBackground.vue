<template>
  <canvas ref="canvasRef" class="particles-canvas"></canvas>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import * as THREE from 'three';

const canvasRef = ref(null);
let animationId = null;
let renderer = null;

onMounted(() => {
  if (!canvasRef.value) return;
  
  // Check reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  // Scene setup
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x050505, 0.002);
  
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.z = 10;
  
  renderer = new THREE.WebGLRenderer({
    canvas: canvasRef.value,
    alpha: true,
    antialias: true
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  
  // Particles
  const geometry = new THREE.BufferGeometry();
  const count = 600;
  const posArray = new Float32Array(count * 3);
  
  for (let i = 0; i < count * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 50;
  }
  
  geometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
  
  const material = new THREE.PointsMaterial({
    size: 0.05,
    color: 0x10B981,
    transparent: true,
    opacity: 0.8,
  });
  
  const particles = new THREE.Points(geometry, material);
  scene.add(particles);
  
  // Mouse interaction
  let mouseX = 0;
  let mouseY = 0;
  
  const handleMouseMove = (event) => {
    mouseX = event.clientX * 0.0005;
    mouseY = event.clientY * 0.0005;
  };
  
  document.addEventListener('mousemove', handleMouseMove);
  
  // Animation
  const animate = () => {
    animationId = requestAnimationFrame(animate);
    
    particles.rotation.y += 0.001;
    particles.rotation.x += 0.0005;
    
    camera.position.x += (mouseX - camera.position.x) * 0.05;
    camera.position.y += (-mouseY - camera.position.y) * 0.05;
    
    renderer.render(scene, camera);
  };
  
  if (!prefersReducedMotion) {
    animate();
  } else {
    // Static render for reduced motion
    renderer.render(scene, camera);
  }
  
  // Resize handler
  const handleResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  };
  
  window.addEventListener('resize', handleResize);
  
  // Cleanup
  onUnmounted(() => {
    if (animationId) cancelAnimationFrame(animationId);
    document.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('resize', handleResize);
    if (renderer) renderer.dispose();
  });
});
</script>

<style scoped>
.particles-canvas {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  pointer-events: none;
  opacity: 0.5;
}
</style>
