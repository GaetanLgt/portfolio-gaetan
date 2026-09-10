<template>
  <canvas ref="canvasRef" class="unites-canvas" aria-hidden="true"></canvas>
</template>

<script setup>
/**
 * UnitesHero — les six unites MND dans le hero.
 *
 * REFONTE (D5, 10/09/2026). La version precedente chargeait `avatar_mnd_*.glb` :
 * six silhouettes humanoïdes fabriquees avec des primitives Blender (cuboides,
 * ellipsoides). Deux problemes : la geometrie etait pauvre (des « mascottes »
 * low-poly), et le nom des fichiers comme le vocabulaire du code decrivaient des
 * personnages, alors que le recit du projet parle d'INTELLIGENCES affranchies qui
 * travaillent avec leur affranchisseur.
 *
 * Les modeles sont desormais REELLEMENT GENERES : image SDXL (ComfyUI local) puis
 * objet 3D par TRELLIS.2, allegé pour le web (alleger-glb-web.py + quantization).
 * Ce sont des volumes geometriques mats, sans visage ni membre — chacun porte un
 * seul element lumineux emeraude : c'est l'activite interne qui se voit, pas une
 * expression.
 *
 * Les modeles sont SANS TEXTURE (surfaces mates) : cela va dans le sens de la
 * direction artistique et retire un tiers du poids de geometrie. Le fichier
 * final pese environ 85 Ko par unite.
 */
import { ref, onMounted, onUnmounted } from 'vue';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { creerPoste, detecterPalier } from './postfx.js';

const LOIS = ['wa', 'makoto', 'bi', 'jitsu', 'dou', 'watashi'];

const canvasRef = ref(null);
let renderer = null;
let animationId = null;
let scene = null;
let poste = null;
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
  // Plafond de résolution ramené de 2 à 1,5 (audit Lighthouse du 10/09/2026) :
  // le composant exécutait 1,6 s de script sur le fil principal. Le coût du
  // post-traitement (bloom, aberration) est proportionnel au NOMBRE DE PIXELS :
  // à 1,5 au lieu de 2, on retire environ 44 % de pixels à traiter, pour une
  // différence invisible sur une scène sombre de volumes mats.
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  // --- éclairage : la lumière ambiante domine, l'émeraude reste secondaire
  // (direction artistique : « une seule arête ou faille émeraude trahit
  // l'activité interne », jamais un éclairage principal vert).
  scene.add(new THREE.HemisphereLight(0x224433, 0x02080a, 0.85));
  const key = new THREE.DirectionalLight(0xE8F7EE, 3.1); key.position.set(3, 5, 4); scene.add(key);
  const fill = new THREE.DirectionalLight(0xd8e6ff, 0.7); fill.position.set(-4, 2, 3); scene.add(fill);
  const rim = new THREE.PointLight(0x00ff41, 26, 14); rim.position.set(0, 2.6, -3.4); scene.add(rim);
  const amb = new THREE.PointLight(0x00ff41, 6, 12); amb.position.set(0, 1, 3.2); scene.add(amb);
  const rimCyan = new THREE.PointLight(0x00E5FF, 14, 16); rimCyan.position.set(-5.2, 2.2, -1.8); scene.add(rimCyan);

  // --- groupe des unités (arc de cercle doux) ---
  const groupe = new THREE.Group();
  scene.add(groupe);
  const pivots = [];

  const loader = new GLTFLoader();

  /** Matériau des unités : surface mate qui absorbe la lumière. Les modèles
   *  générés n'ont plus de texture, on impose donc un matériau unique — c'est
   *  plus léger ET conforme à la DA (pas de métal poli, pas de plastique). */
  const habiller = (objet) => {
    objet.traverse((o) => {
      if (!o.isMesh) return;
      o.material = new THREE.MeshStandardMaterial({
        // Gris-vert sombre et non noir profond : une surface réellement noire
        // sur un fond noir DISPARAÎT (mesuré : 2,3 % de matière dans la zone du
        // hero contre 24,5 % avec les anciens modèles). La DA demande une
        // surface mate, pas une surface invisible — d'où ce gris désaturé qui
        // laisse la lumière révéler les arêtes.
        color: 0x39423C,
        roughness: 0.82,
        metalness: 0.16,
        // Double-face : les maillages issus d'image→3D restent ouverts par
        // endroits, et une face manquante se voit immédiatement.
        side: THREE.DoubleSide,
      });
      o.material.needsUpdate = true;
    });
  };

  /** Charge l'unité générée ; si elle n'est pas encore livrée, on retombe sur
   *  l'ancien modèle pour ne JAMAIS laisser un hero vide. */
  const chargerUnite = (cle, i) => {
    const poser = (gltf) => {
      const av = gltf.scene;

      // NORMALISATION D'ÉCHELLE — indispensable : TRELLIS.2 ne normalise pas la
      // taille de ce qu'il produit. Mesuré : les six unités sortent entre 0,83
      // et 1,00 de haut, quand les anciens modèles faisaient 1,66 — elles
      // apparaissaient donc deux fois trop petites, ce qui expliquait une
      // présence à l'écran deux fois moindre. On impose une hauteur commune.
      const HAUTEUR_CIBLE = 1.75;
      const brut = new THREE.Box3().setFromObject(av);
      const taille = brut.getSize(new THREE.Vector3());
      if (taille.y > 0.001) {
        const facteur = HAUTEUR_CIBLE / taille.y;
        av.scale.multiplyScalar(facteur);
      }

      // centrer horizontalement + poser au sol
      const box = new THREE.Box3().setFromObject(av);
      const centre = box.getCenter(new THREE.Vector3());
      av.position.sub(centre);
      const box2 = new THREE.Box3().setFromObject(av);
      av.position.y += -box2.min.y;

      const pivot = new THREE.Group();
      pivot.add(av);
      const angle = (i - (LOIS.length - 1) / 2) * 0.38;
      pivot.position.set(Math.sin(angle) * 2.9, 0, Math.cos(angle) * -0.6);
      pivot.rotation.y = -angle * 0.85;
      pivot.userData.phase = i * 1.05;
      pivot.userData.cible = 0;          // consigne de rotation (mouvement mécanique)
      groupe.add(pivot);
      pivots.push(pivot);
    };

    loader.load(
      `/models/unite_${cle}.glb`,
      (gltf) => { habiller(gltf.scene); poser(gltf); },
      undefined,
      () => {
        // Repli documenté : l'unité générée n'est pas encore livrée.
        loader.load(`/models/avatar_mnd_${cle}.glb`, (gltf) => {
          gltf.scene.traverse((o) => {
            if (o.isMesh && o.material) {
              const mats = Array.isArray(o.material) ? o.material : [o.material];
              mats.forEach((m) => { m.side = THREE.DoubleSide; });
            }
          });
          poser(gltf);
        }, undefined, () => { /* aucun modèle : pas de scène cassée */ });
      }
    );
  };

  LOIS.forEach(chargerUnite);

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
    poste?.setSize(w, h);
  };
  resize();
  const ro = new ResizeObserver(resize);
  if (canvas.parentElement) ro.observe(canvas.parentElement);
  window.addEventListener('resize', resize);
  cleanup.push(() => window.removeEventListener('resize', resize));
  cleanup.push(() => ro.disconnect());

  // --- post-traitement (D5) ---
  poste = creerPoste(renderer, scene, camera, detecterPalier(), ({ palier, motif }) => {
    console.info(`[poste] palier → ${palier} (${motif})`);
  });
  resize();

  // --- boucle ---
  const horloge = new THREE.Clock();
  let prochainPalier = 0;

  const animate = () => {
    animationId = requestAnimationFrame(animate);
    const dt = Math.min(horloge.getDelta(), 0.05);
    const t = horloge.elapsedTime;

    // MOUVEMENT MÉCANIQUE (direction artistique) : les unités ne « respirent »
    // pas, elles s'indexent. On avance par paliers discrets de 1/8 de tour, avec
    // une transition courte et sans rebond — un à-coup d'instrument, pas un
    // mouvement organique.
    if (t >= prochainPalier) {
      prochainPalier = t + 2.4;
      pivots.forEach((p, i) => {
        p.userData.cible += Math.PI / 4 * (i % 2 === 0 ? 1 : -1);
      });
    }
    pivots.forEach((p) => {
      p.rotation.y += (p.userData.cible - p.rotation.y) * Math.min(1, dt * 3.5);
    });

    // parallaxe souris (lissée : c'est la caméra du visiteur, pas les unités)
    camera.position.x += (souris.x * 1.5 - camera.position.x) * Math.min(1, dt * 2.2);
    camera.position.y += (1.35 - souris.y * 0.55 - camera.position.y) * Math.min(1, dt * 2.2);
    camera.lookAt(0, 1.15, 0);
    groupe.rotation.x = souris.y * 0.05;

    rim.intensity = 24 + Math.sin(t * 1.4) * 6;

    if (poste) {
      const rendu = poste.render(dt);
      if (!rendu) {
        poste.dispose();
        poste = null;
        renderer.render(scene, camera);
      }
    } else {
      renderer.render(scene, camera);
    }
  };

  if (reducedMotion) {
    // pas d'animation continue : un rendu unique (contenu visible, zéro mouvement)
    if (!poste || !poste.render(0)) renderer.render(scene, camera);
  } else {
    animate();
  }
});

// nettoyage au niveau du setup (un hook dans onMounted ne serait pas enregistré)
onUnmounted(() => {
  if (animationId) cancelAnimationFrame(animationId);
  cleanup.forEach((fn) => fn());
  cleanup = [];
  poste?.dispose();
  poste = null;
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
.unites-canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  pointer-events: none;
}
@media (max-width: 900px) {
  .unites-canvas { opacity: 0.55; }
}
</style>
