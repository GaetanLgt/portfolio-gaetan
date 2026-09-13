<template>
  <div ref="hote" class="scene-scroll" aria-hidden="true">
    <canvas ref="canvasRef" class="scene-scroll__canvas"></canvas>
  </div>
</template>

<script setup>
/**
 * ScrollScene — un tunnel 3D dont l'AVANCEMENT suit le SCROLL de la page.
 *
 * POURQUOI CE COMPOSANT
 * `GridBackground`, `MatrixBackground` et `ParticlesBackground` animent un décor
 * INDÉPENDAMMENT de la lecture : ils tournent, le visiteur descend, et les deux
 * ne se parlent pas. Ici, la position de lecture PILOTE la scène — descendre,
 * c'est avancer dans le tunnel. C'est ce que la vidéo de référence appelle un
 * « 3D scroll effect ».
 *
 * CE QUI N'EST PAS FAIT, ET POURQUOI
 *   · Aucune dépendance ajoutée. `three` et `gsap` sont déjà là (455 887 o brut,
 *     111 545 o gzip pour three — chiffre écrit dans `mode-sobre.js`). Pas de
 *     `Lenis` : le lissage est obtenu par interpolation, sans bibliothèque.
 *   · Pas de post-traitement : `postfx.js` existe, il coûte un rendu de plus.
 *
 * LES DEUX RÈGLES QUI GAGNENT, DANS CET ORDRE
 *   1. `prefers-reduced-motion` — décision du studio, non négociable : il gagne
 *      TOUJOURS. La scène est alors rendue UNE fois, fixe, au milieu du tunnel.
 *   2. Le mode sobre — s'il est actif, la scène n'est pas montée du tout, et le
 *      contexte WebGL est libéré.
 *
 * ET LE NETTOYAGE, PARCE QU'UN CONTEXTE WEBGL NE SE RÉCUPÈRE PAS
 *   `dispose()` sur chaque géométrie, chaque matériau, le renderer ; et le
 *   ScrollTrigger est tué (`kill()`). Un contexte perdu fait tomber TOUS les
 *   décors three de la page, pas seulement celui-ci.
 */
import { ref, onMounted, onUnmounted, watch } from 'vue';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { decorActif } from '../../composables/mode-sobre.js';

gsap.registerPlugin(ScrollTrigger);

const props = defineProps({
  /** Nombre d'anneaux du tunnel. 36 tient sur une carte modeste. */
  anneaux: { type: Number, default: 36 },
  /** Écart entre deux anneaux, en unités de scène. */
  ecart: { type: Number, default: 2.4 },
  /** Couleur d'accent — émeraude du studio par défaut. */
  accent: { type: String, default: '#10B981' },
  /** Suit le scroll du document. false = tunnel immobile (utile en test). */
  suitLeScroll: { type: Boolean, default: true }
});

const hote = ref(null);
const canvasRef = ref(null);

let renderer = null;
let scene = null;
let camera = null;
let trigger = null;
let frame = null;
let geometries = [];
let materiaux = [];

// `cible` = progression brute du scroll (0 → 1). `lisse` = sa valeur rattrapée
// image par image. C'est ce rattrapage qui donne le « smooth scroll » sans Lenis.
let cible = 0;
let lisse = 0;
let reduitLeMouvement = false;

function construire() {
  if (!canvasRef.value || !hote.value) return;

  reduitLeMouvement = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  scene = new THREE.Scene();
  // ⚠️ BROUILLARD ALLÉGÉ LE 13/09/2026, APRÈS ÉPREUVE DE RENDU.
  // Densité 0,032 : les anneaux au-delà de quelques unités étaient entièrement
  // noyés, et l'épreuve CDP a montré une scène presque noire — le même défaut
  // qu'avait la séquence d'images à son premier jet. Une scène qu'on ne voit pas
  // ne fait pas un effet, elle fait un temps de chargement.
  scene.fog = new THREE.FogExp2(0x03060a, 0.018);

  camera = new THREE.PerspectiveCamera(
    62,
    window.innerWidth / Math.max(window.innerHeight, 1),
    0.1,
    320
  );
  camera.position.set(0, 0, 6);

  renderer = new THREE.WebGLRenderer({
    canvas: canvasRef.value,
    alpha: true,
    antialias: true,
    powerPreference: 'high-performance'
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  // 2 suffit : au-delà, on paie des pixels que personne ne distingue (mesure du studio).
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const couleurAccent = new THREE.Color(props.accent);
  // `0x0c3a2b` était presque indistinct du fond : les anneaux « sombres » ne se
  // lisaient pas du tout. Relevé après l'épreuve de rendu du 13/09/2026.
  const couleurSombre = new THREE.Color(0x14795a);

  // ── Le tunnel : des anneaux, une seule géométrie partagée ──────────────────
  // Tore épaissi (0,011 → 0,02) : à l'écran, les anneaux fins disparaissaient
  // dans le bruit du fond.
  const geoAnneau = new THREE.TorusGeometry(3.1, 0.02, 6, 72);
  geometries.push(geoAnneau);

  for (let i = 0; i < props.anneaux; i++) {
    const estAccent = i % 6 === 0;
    const mat = new THREE.MeshBasicMaterial({
      color: estAccent ? couleurAccent : couleurSombre,
      transparent: true,
      // Les plus lointains s'effacent : c'est ce qui donne la profondeur.
      opacity: estAccent ? 0.95 : 0.75,
      depthWrite: false
    });
    materiaux.push(mat);

    const anneau = new THREE.Mesh(geoAnneau, mat);
    anneau.position.z = -i * props.ecart;
    anneau.rotation.z = i * 0.09;
    anneau.userData.phase = i * 0.09;
    anneau.userData.z0 = -i * props.ecart;
    scene.add(anneau);
  }

  // ── La poussière : 420 points, un seul objet à dessiner ────────────────────
  const nb = 420;
  const positions = new Float32Array(nb * 3);
  for (let i = 0; i < nb; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 26;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 16;
    positions[i * 3 + 2] = -Math.random() * props.anneaux * props.ecart;
  }
  const geoPts = new THREE.BufferGeometry();
  geoPts.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometries.push(geoPts);

  const matPts = new THREE.PointsMaterial({
    color: couleurAccent,
    // Taille et opacité relevées : à 0,035 et 0,55, la poussière était
    // indiscernable sur la capture d'épreuve.
    size: 0.055,
    transparent: true,
    opacity: 0.8,
    depthWrite: false
  });
  materiaux.push(matPts);
  scene.add(new THREE.Points(geoPts, matPts));

  // ── Le scroll pilote la progression ───────────────────────────────────────
  if (props.suitLeScroll && !reduitLeMouvement) {
    trigger = ScrollTrigger.create({
      trigger: document.documentElement,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => { cible = self.progress; }
    });
  } else if (reduitLeMouvement) {
    // Mouvement réduit : on montre UNE image, au milieu du parcours. La scène
    // existe, elle ne bouge pas — c'est le choix du visiteur, pas un oubli.
    cible = 0.35;
    lisse = 0.35;
    avancer(0);
    renderer.render(scene, camera);
  }

  // ── La boucle ─────────────────────────────────────────────────────────────
  const boucle = () => {
    frame = requestAnimationFrame(boucle);
    avancer(0.075);
    renderer.render(scene, camera);
  };

  if (!reduitLeMouvement) {
    frame = requestAnimationFrame(boucle);
  }

  window.addEventListener('resize', redimensionner);
}

function avancer(facteur) {
  if (!camera) return;

  // Rattrapage : sans lui, la caméra saute à chaque cran de molette.
  lisse += (cible - lisse) * facteur;

  const course = (props.anneaux - 4) * props.ecart;
  camera.position.z = 6 - lisse * course;

  // Une oscillation très légère : assez pour que l'image respire, pas assez
  // pour donner le mal des transports.
  const t = performance.now() * 0.0004;
  camera.position.x = Math.sin(t) * 0.45;
  camera.position.y = Math.cos(t * 0.8) * 0.3;
  camera.rotation.z = Math.sin(t * 0.5) * 0.02;

  // Les anneaux tournent doucement sur eux-mêmes, décalés dans le temps.
  scene.children.forEach((enfant) => {
    if (enfant.userData && enfant.userData.phase !== undefined) {
      enfant.rotation.z = enfant.userData.phase + lisse * 1.6;
    }
  });
}

function redimensionner() {
  if (!renderer || !camera) return;
  const l = window.innerWidth;
  const h = Math.max(window.innerHeight, 1);
  camera.aspect = l / h;
  camera.updateProjectionMatrix();
  renderer.setSize(l, h);
}

function demonter() {
  if (frame) { cancelAnimationFrame(frame); frame = null; }
  window.removeEventListener('resize', redimensionner);
  if (trigger) { trigger.kill(); trigger = null; }

  // Un contexte WebGL perdu fait tomber TOUS les décors de la page : on libère.
  geometries.forEach((g) => g.dispose());
  materiaux.forEach((m) => m.dispose());
  geometries = [];
  materiaux = [];

  if (scene) {
    scene.clear();
    scene = null;
  }
  if (renderer) {
    renderer.dispose();
    renderer = null;
  }
  camera = null;
  cible = 0;
  lisse = 0;
}

onMounted(() => {
  // Le mode sobre coupe le décor — sauf si le visiteur a réduit le mouvement :
  // dans ce cas on rend l'image fixe, qui ne bouge pas et ne dérange personne.
  if (decorActif.value || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    construire();
  }
});

// Basculer le mode sobre MONTE ou DÉMONTE la scène immédiatement.
watch(decorActif, (actif) => {
  if (actif) {
    if (!renderer) construire();
  } else {
    demonter();
  }
});

onUnmounted(demonter);
</script>

<style scoped>
.scene-scroll {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
}

.scene-scroll__canvas {
  display: block;
  width: 100%;
  height: 100%;
}

/* Le tunnel reste en retrait : il accompagne le propos, il ne le remplace pas.
   Verdict de Gaëtan du 10/09 : « la 3D nuit au sérieux » — d'où cette retenue. */
.scene-scroll {
  opacity: 0.55;
}
</style>
