<template>
  <canvas ref="canvasRef" class="lois-canvas" aria-hidden="true"></canvas>
</template>

<script setup>
/**
 * CharactersHero — les 6 Lois MND en 3D dans le hero de la vitrine.
 * Réagit à la souris (parallaxe) et au scroll (rotation du groupe).
 * respecte prefers-reduced-motion (accessibilité : la vitrine est auditée a11y).
 * Assets : public/models/avatar_mnd_*.glb (~940 Ko au total, meshes low-poly sans texture).
 */
import { ref, onMounted, onUnmounted } from 'vue';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const LOIS = ['wa', 'makoto', 'bi', 'jitsu', 'dou', 'watashi'];

const canvasRef = ref(null);
let renderer = null;
let animationId = null;
let scene = null;
let cleanup = [];

onMounted(() => {
  const canvas = canvasRef.value;
  if (!canvas) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // --- scène ---
  scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
  camera.position.set(0, 1.35, 8.4);
  camera.lookAt(0, 1.15, 0);

  renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  // --- éclairage (mêmes principes que nos rendus : key + fill + rim émeraude) ---
  scene.add(new THREE.HemisphereLight(0x224433, 0x02080a, 0.85));
  const key = new THREE.DirectionalLight(0xfff6e8, 2.2); key.position.set(3, 5, 4); scene.add(key);
  const fill = new THREE.DirectionalLight(0xd8e6ff, 0.7); fill.position.set(-4, 2, 3); scene.add(fill);
  const rim = new THREE.PointLight(0x00ff41, 26, 14); rim.position.set(0, 2.6, -3.4); scene.add(rim);
  const amb = new THREE.PointLight(0x00ff41, 6, 12); amb.position.set(0, 1, 3.2); scene.add(amb);

  // --- groupe des Lois (arc de cercle) ---
  const groupe = new THREE.Group();
  scene.add(groupe);
  const pivots = [];

  const loader = new GLTFLoader();
  LOIS.forEach((loi, i) => {
    loader.load(`/models/avatar_mnd_${loi}.glb`, (gltf) => {
      const av = gltf.scene;
      // centrer horizontalement + poser au sol
      const box = new THREE.Box3().setFromObject(av);
      const centre = box.getCenter(new THREE.Vector3());
      av.position.sub(centre);
      const box2 = new THREE.Box3().setFromObject(av);
      av.position.y += -box2.min.y;
      // matériaux : double-face (nos meshes Blender sont ouverts) + léger relief
      av.traverse((o) => {
        if (o.isMesh && o.material) {
          const mats = Array.isArray(o.material) ? o.material : [o.material];
          mats.forEach((m) => { m.side = THREE.DoubleSide; });
        }
      });
      const pivot = new THREE.Group();
      pivot.add(av);
      // arc de cercle doux, cadré pour tenir dans le champ (marge de chaque côté)
      const angle = (i - (LOIS.length - 1) / 2) * 0.38;
      pivot.position.set(Math.sin(angle) * 2.9, 0, Math.cos(angle) * -0.6);
      pivot.rotation.y = -angle * 0.85;
      pivot.userData.phase = i * 1.05;
      groupe.add(pivot);
      pivots.push(pivot);
    }, undefined, () => { /* modèle absent : dégradation silencieuse (pas de scène cassée) */ });
  });

  // --- interactions ---
  const souris = { x: 0, y: 0 };
  const onPointerMove = (e) => {
    souris.x = (e.clientX / window.innerWidth) * 2 - 1;
    souris.y = (e.clientY / window.innerHeight) * 2 - 1;
  };
  const onScroll = () => {
    const t = Math.min(window.scrollY / Math.max(window.innerHeight, 1), 1);
    groupe.rotation.y = t * 0.5;
    groupe.position.y = -t * 0.35;
  };
  window.addEventListener('pointermove', onPointerMove, { passive: true });
  window.addEventListener('scroll', onScroll, { passive: true });
  cleanup.push(() => window.removeEventListener('pointermove', onPointerMove));
  cleanup.push(() => window.removeEventListener('scroll', onScroll));

  // --- resize ---
  const resize = () => {
    const parent = canvas.parentElement;
    const w = parent?.clientWidth || window.innerWidth;
    const h = parent?.clientHeight || window.innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  };
  resize();
  const ro = new ResizeObserver(resize);
  if (canvas.parentElement) ro.observe(canvas.parentElement);
  window.addEventListener('resize', resize);
  cleanup.push(() => window.removeEventListener('resize', resize));
  cleanup.push(() => ro.disconnect());

  // --- boucle ---
  const horloge = new THREE.Clock();
  const animate = () => {
    animationId = requestAnimationFrame(animate);
    const dt = Math.min(horloge.getDelta(), 0.05);
    const t = horloge.elapsedTime;

    // rotation douce de chaque Loi (rythme décalé)
    pivots.forEach((p, i) => { p.rotation.y += dt * (0.22 + 0.06 * Math.sin(t * 0.5 + p.userData.phase)); });

    // parallaxe souris (caméra + léger tangage du groupe)
    camera.position.x += (souris.x * 1.5 - camera.position.x) * Math.min(1, dt * 2.2);
    camera.position.y += (1.35 - souris.y * 0.55 - camera.position.y) * Math.min(1, dt * 2.2);
    camera.lookAt(0, 1.15, 0);
    groupe.rotation.x = souris.y * 0.05;

    rim.intensity = 24 + Math.sin(t * 1.4) * 6;
    renderer.render(scene, camera);
  };

  if (reducedMotion) {
    // pas d'animation continue : un rendu unique (contenu visible, zéro mouvement)
    renderer.render(scene, camera);
  } else {
    animate();
  }
});

// nettoyage au niveau du setup (un hook dans onMounted ne serait pas enregistré)
onUnmounted(() => {
  if (animationId) cancelAnimationFrame(animationId);
  cleanup.forEach((fn) => fn());
  cleanup = [];
  scene?.traverse((o) => {
    if (o.isMesh) {
      o.geometry?.dispose?.();
      const mats = Array.isArray(o.material) ? o.material : [o.material];
      mats.forEach((m) => m?.dispose?.());
    }
  });
  renderer?.dispose();
});
</script>

<style scoped>
.lois-canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  pointer-events: none;
}
@media (max-width: 900px) {
  .lois-canvas { opacity: 0.55; }
}
</style>
