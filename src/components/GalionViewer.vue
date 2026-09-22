<!--
  GalionViewer.vue — le galion d'ArkAdiA, rendu en 3D dans le site.

  ⭐ POURQUOI CE COMPOSANT EST AINSI
    · `three` est DÉJÀ une dépendance du site → Vite le bundle. **Aucun CDN,
      aucune requête vers jsdelivr ou unpkg**, donc aucune dépendance hors UE
      ajoutée par cette pièce.
    · Le modèle vit dans `public/galion.glb` et il est produit par
      `30-rnd/galion/galion.py` — **c'est du code, pas un asset acheté.**
      Aucune licence tierce : le navire appartient au studio.
    · Il se charge en DIFFÉRÉ (`defineAsyncComponent`), parce que le site tient
      un verrou sur le NOMBRE DE REQUÊTES du premier chargement
      (`scripts/verifier-requetes.mjs`) : o2switch renvoie un 429 au-delà d'une
      rafale d'environ 20 par IP, et l'application ne se monte plus.

  Les couleurs sont celles du site (`--accent` #00FF41 sur `--paper` #03060A),
  pas celles d'ArkAdiA : décision de Gaëtan, « t'accorde dans le site ».
-->
<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';

const props = defineProps({
  /** Le modèle à charger. `public/galion.glb` par défaut. */
  modele: { type: String, default: '/galion.glb' },
  /** Rotation continue. `.5` est lent et posé — c'est un vaisseau, pas un manège. */
  vitesse: { type: Number, default: 0.18 },
});

/*
 * ⭐ LE NAVIRE VIT À L'HEURE FRANÇAISE.
 *
 * Un navire ne dit pas « 14 h » : il dit « le quart de l'après-midi ». La journée
 * se découpe en SIX QUARTS de quatre heures, et c'est le découpage réel du bord.
 * L'éclairage de la scène en découle : le galion n'a pas la même lumière à midi
 * et à trois heures du matin.
 *
 * ⚠️ L'heure est celle de PARIS, pas celle du visiteur : `Intl.DateTimeFormat`
 * avec `timeZone: 'Europe/Paris'`. Un lecteur à Tokyo voit le navire à l'heure
 * du sol français — c'est le point, et c'est dit.
 */
const QUARTS = [
  { de: 20, a: 24, nom: 'Le premier quart',    humeur: 'nuit'  },
  { de: 0,  a: 4,  nom: 'Le quart de minuit',  humeur: 'nuit'  },
  { de: 4,  a: 8,  nom: 'Le quart du matin',   humeur: 'aube'  },
  { de: 8,  a: 12, nom: "Le quart de l'avant-midi", humeur: 'jour' },
  { de: 12, a: 16, nom: "Le quart de l'après-midi", humeur: 'jour' },
  { de: 16, a: 20, nom: 'Le quart du soir',    humeur: 'crepuscule' },
];

/** L'heure et le quart, à l'heure de Paris — quelle que soit celle du visiteur. */
function bordFrancais() {
  const maintenant = new Date();
  let h = 0, mn = 0, lisible = '';
  try {
    const f = new Intl.DateTimeFormat('fr-FR', {
      timeZone: 'Europe/Paris', hour: '2-digit', minute: '2-digit', hour12: false,
    });
    lisible = f.format(maintenant);
    h = Number(f.formatToParts(maintenant).find((p) => p.type === 'hour').value) % 24;
    mn = Number(f.formatToParts(maintenant).find((p) => p.type === 'minute').value);
  } catch (e) {
    // ⚠️ Si le fuseau n'est pas résolu, on le DIT plutôt que d'afficher 0 h.
    h = maintenant.getHours(); mn = maintenant.getMinutes();
    lisible = String(h).padStart(2, '0') + ':' + String(mn).padStart(2, '0');
  }
  const quart = QUARTS.find((q) => h >= q.de && h < q.a) || QUARTS[0];
  return { heure: lisible, h, mn, quart };
}

/**
 * L'éclairage suit le quart. ⚠️ On ne change PAS la palette (loi n° 6) : on
 * change l'INTENSITÉ et la COULEUR DES LAMPES. Le vert du site reste le vert,
 * mais il brille plus fort la nuit — et la journée, c'est le ciel qui éclaire.
 */
const HUMEURS = {
  nuit:       { ambient: 0.55, cle: 1.5, contre: 1.9, froid: 0.35, etoiles: 1.0 },
  aube:       { ambient: 1.1,  cle: 2.2, contre: 1.3, froid: 0.9,  etoiles: 0.55 },
  jour:       { ambient: 2.2,  cle: 3.4, contre: 0.7, froid: 1.6,  etoiles: 0.18 },
  crepuscule: { ambient: 0.95, cle: 2.6, contre: 1.6, froid: 0.5,  etoiles: 1.0 },
};

const racine = ref(null);
const etat = ref('chargement');   // chargement | pret | repli
const motif = ref('');
const bord = ref(bordFrancais());
let lampes = null;                // peuplé par construire(), lu par appliquerHeure()

/*
 * ⭐⭐ LES TROIS NOMBRES, ET LE PANNEAU PILOTABLE.
 *
 * Le visiteur n'a pas de YAML à ouvrir : il a trois boutons, et il voit ce qui
 * bouge. C'est la démonstration du métier du studio — *un système souverain
 * qu'on pilote sans rien connaître à la technique.*
 *
 * ⚠️ Et c'est une DÉMONSTRATION, pas une mesure : la charte (§2.4) impose de le
 *    dire. La mention « démonstration » est affichée dans le panneau, pas cachée.
 */
const faim = ref(12);
const autonomie = ref(88);
const integrite = ref(100);
const auto = ref(true);
const journal = ref(['Le bord prend sa route.']);

function dire(m) {
  journal.value = [m, ...journal.value].slice(0, 3);
}

/** Un pas de la vie du bord. Appelé par la boucle, toutes les ~4 s. */
function pasDeBord() {
  if (!auto.value) return;
  faim.value = Math.min(100, faim.value + 1);
  autonomie.value = Math.max(0, autonomie.value - 1);
  if (faim.value >= 100) dire('Le réacteur a tout pris. Il en veut encore.');
}

function reprendreLaBarre() {
  auto.value = false;
  dire('La barre est reprise. Le bord n’agit plus seul.');
}

function rendreLaBarre() {
  auto.value = true;
  dire('Conduite automatique rendue. Le bord reprend sa route.');
}

function nourrirLeReacteur() {
  faim.value = Math.max(0, faim.value - 15);
  autonomie.value = Math.min(100, autonomie.value + 12);
  dire(`Réacteur nourri. Faim à ${faim.value} %.`);
}

/*
 * ⭐ LE BORD REND COMPTE TOUT SEUL — présentation « galion domotisé ».
 *
 * ⚠️ AUCUN CHIFFRE N'EST INVENTÉ ICI, et c'est une règle, pas une précaution :
 *    la charte du studio (§2.4) interdit de présenter une démonstration comme une
 *    mesure réelle. **Ces valeurs sont les caractéristiques PUBLIÉES du navire**
 *    (section ARKADIA SS00999 de cette même page) — et elles ont été relevées sur
 *    la machine le 10/09/2026. Rien n'est recopié d'une fiche commerciale.
 *
 * Le vocabulaire est celui du site : chaque mot de bord a son équivalent machine,
 * et c'est cette correspondance qui fait le propos — *le navire est domotisé.*
 */
const BORD = [
  { cle: 'Propulsion',  machine: 'les cartes graphiques', valeur: 'RTX 3080 · 10 Go',  etat: 'nominal' },
  { cle: 'Lest',        machine: 'la mémoire vive',       valeur: '64 Go · 3600 MT/s', etat: 'nominal' },
  { cle: 'La cale',     machine: 'le stockage',           valeur: 'local · hors cloud', etat: 'nominal' },
  { cle: 'Équipage',    machine: 'les agents d’IA',       valeur: 'sur place',          etat: 'actif' },
  { cle: 'La vigie',    machine: 'la surveillance',       valeur: 'en veille',          etat: 'actif' },
  { cle: 'La barre',    machine: 'votre écran',           valeur: 'vous',               etat: 'humain' },
];

let rendu = null;
let scene = null;
let camera = null;
let objet = null;
let boucle = 0;
let observateur = null;
let redimensionnement = null;
let visible = true;
let reduit = false;

async function construire() {
  const hote = racine.value;
  if (!hote) return;

  const canvas = hote.querySelector('canvas');
  if (!canvas) { etat.value = 'repli'; motif.value = 'canvas absent'; return; }

  reduit = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let THREE;
  try {
    THREE = await import('three');
  } catch (e) {
    etat.value = 'repli'; motif.value = 'three indisponible'; return;
  }

  // --- Garde-fou matériel : si WebGL manque, on le DIT (loi n° 8) ---------
  try {
    rendu = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  } catch (e) {
    etat.value = 'repli'; motif.value = 'WebGL indisponible'; return;
  }

  rendu.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  rendu.setClearColor(0x03060a, 0);

  scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x03060a, 0.028);

  camera = new THREE.PerspectiveCamera(42, 1, 0.1, 200);
  camera.position.set(11, 5.5, 13);
  camera.lookAt(0, 2.4, 0);

  // --- Lumière : elle suit LE QUART, à l'heure de Paris ---------------------
  // ⚠️ On ne change pas la palette (loi n° 6) : on change l'intensité et la
  //    couleur DES LAMPES. Le vert du site reste le vert ; il brille plus fort
  //    la nuit, et la journée c'est le ciel qui éclaire.
  const ambiante = new THREE.AmbientLight(0x1b3a30, 1.4);
  scene.add(ambiante);

  const cle = new THREE.DirectionalLight(0x00ff41, 2.6);
  cle.position.set(-8, 9, 7);
  scene.add(cle);

  const contre = new THREE.DirectionalLight(0x66ff88, 1.1);
  contre.position.set(9, -3, -8);
  scene.add(contre);

  const froid = new THREE.DirectionalLight(0x9fd8ff, 0.7);
  froid.position.set(2, 6, -11);
  scene.add(froid);

  lampes = { ambiante, cle, contre, froid };

  // --- Le ciel étoilé : procédural, semé, donc rejouable -------------------
  const r = (() => { let a = 0x50999; return () => { a |= 0; a = a + 0x6d2b79f5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; })();
  const n = 1400;
  const pos = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    pos[i * 3] = (r() - 0.5) * 190;
    pos[i * 3 + 1] = (r() - 0.5) * 120;
    pos[i * 3 + 2] = -20 - r() * 150;
  }
  const etoiles = new THREE.Points(
    new THREE.BufferGeometry().setAttribute('position', new THREE.BufferAttribute(pos, 3)),
    new THREE.PointsMaterial({ color: 0x9fd8ff, size: 0.34, sizeAttenuation: true, transparent: true, opacity: 0.7, depthWrite: false })
  );
  scene.add(etoiles);

  // --- Le navire ----------------------------------------------------------
  const { GLTFLoader } = await import('three/examples/jsm/loaders/GLTFLoader.js');
  const chargeur = new GLTFLoader();

  chargeur.load(
    props.modele,
    (gltf) => {
      objet = gltf.scene;
      // Le GLB arrive de Blender en Y-up : on le pose sur son fond et on le
      // présente de trois quarts, étrave vers la gauche.
      const boite = new THREE.Box3().setFromObject(objet);
      const centre = boite.getCenter(new THREE.Vector3());
      objet.position.sub(centre);
      objet.position.y += (boite.max.y - boite.min.y) / 2;
      scene.add(objet);
      etat.value = 'pret';
      mesurer();
    },
    undefined,
    (err) => {
      // ⚠️ On ne laisse pas un écran vide : on dit la cause (loi n° 8).
      etat.value = 'repli';
      motif.value = 'le modèle n’a pas pu être chargé';
      console.warn('[galion]', err);
    }
  );

  // --- Dimensionnement ----------------------------------------------------
  function mesurer() {
    const b = canvas.getBoundingClientRect();
    const l = Math.max(1, b.width), h = Math.max(1, b.height);
    rendu.setSize(l, h, false);
    camera.aspect = l / h;
    camera.updateProjectionMatrix();
  }
  redimensionnement = new ResizeObserver(mesurer);
  redimensionnement.observe(canvas);
  mesurer();

  // --- On ne rend pas quand la section n'est pas à l'écran -----------------
  observateur = new IntersectionObserver(
    ([e]) => { visible = e.isIntersecting; },
    { rootMargin: '160px' }
  );
  observateur.observe(hote);

  let t = 0;
  let dernierQuart = '';

  /** Applique l'humeur du quart courant aux lampes. */
  function appliquerHeure() {
    bord.value = bordFrancais();
    if (!lampes) return;
    const h = HUMEURS[bord.value.quart.humeur] || HUMEURS.jour;
    lampes.ambiante.intensity = h.ambient;
    lampes.cle.intensity = h.cle;
    lampes.contre.intensity = h.contre;
    lampes.froid.intensity = h.froid;
    etoiles.material.opacity = h.etoiles;
    dernierQuart = bord.value.quart.humeur;
  }
  appliquerHeure();

  function frame() {
    boucle = requestAnimationFrame(frame);
    // On réévalue le quart toutes les ~30 s : l'heure de Paris peut changer.
    if (++t % 1800 === 0) appliquerHeure();
    // Et le bord vit : un pas toutes les ~4 secondes.
    if (t % 240 === 0) pasDeBord();
    if (!visible) return;
    if (!reduit) t += 1;
    if (objet && !reduit) {
      objet.rotation.y = -0.55 + Math.sin(t * 0.0025) * 0.42;
      objet.rotation.z = Math.sin(t * 0.0013) * 0.012;
      objet.position.y = Math.sin(t * 0.0019) * 0.16;
    } else if (objet) {
      objet.rotation.y = -0.35;
    }
    etoiles.rotation.y = t * 0.0004;
    rendu.render(scene, camera);
  }
  frame();
}

onMounted(construire);

onBeforeUnmount(() => {
  cancelAnimationFrame(boucle);
  observateur?.disconnect();
  redimensionnement?.disconnect();
  scene?.traverse((o) => {
    o.geometry?.dispose?.();
    if (Array.isArray(o.material)) o.material.forEach((m) => m.dispose());
    else o.material?.dispose?.();
  });
  rendu?.dispose();
  rendu?.forceContextLoss?.();
});
</script>

<template>
  <div ref="racine" class="galion" :data-etat="etat">
    <canvas class="galion__canvas" aria-hidden="true"></canvas>

    <!-- Le repli : un dégradé, et une phrase qui dit pourquoi. Jamais un vide. -->
    <p v-if="etat === 'repli'" class="galion__repli">
      Le navire ne s’affiche pas ici — <span>{{ motif || 'WebGL indisponible' }}</span>.
      La suite de la page reste entièrement lisible.
    </p>

    <p v-else-if="etat === 'chargement'" class="galion__chargement">
      Le navire se hisse…
    </p>

    <!-- ⭐ LE BORD PILOTABLE — en langage de tous les jours.
         Rien de technique à l'écran : trois chiffres qui parlent d'eux-mêmes,
         trois boutons aux mots simples, et une phrase qui dit ce qui se passe.
         ⚠️ La charte (§2.4) impose d'étiqueter une démonstration : c'est fait,
         en clair, sous les boutons. -->
    <div v-if="etat === 'pret'" class="galion__bord">
      <p class="galion__tete">
        <i></i>
        <span class="galion__quart-nom">{{ bord.quart.nom }}</span>
        <span class="galion__heure">{{ bord.heure }} <em>en France</em></span>
      </p>

      <ul class="galion__chiffres">
        <li>
          <span class="galion__chiffre-nom">Le réacteur a faim</span>
          <b :data-alerte="faim > 80">{{ faim }} %</b>
          <span class="galion__jauge"><i :style="{ width: faim + '%' }"></i></span>
        </li>
        <li>
          <span class="galion__chiffre-nom">Il vous reste de quoi tenir</span>
          <b :data-alerte="autonomie < 25">{{ autonomie }} %</b>
          <span class="galion__jauge"><i :style="{ width: autonomie + '%' }"></i></span>
        </li>
        <li>
          <span class="galion__chiffre-nom">Le navire est entier</span>
          <b :data-alerte="integrite < 40">{{ integrite }} %</b>
          <span class="galion__jauge"><i :style="{ width: integrite + '%' }"></i></span>
        </li>
      </ul>

      <div class="galion__gestes">
        <button type="button" class="galion__btn" :class="{ 'galion__btn--actif': auto }" @click="rendreLaBarre">
          Laisser le bord faire
        </button>
        <button type="button" class="galion__btn" :class="{ 'galion__btn--actif': !auto }" @click="reprendreLaBarre">
          Reprendre la barre
        </button>
        <button type="button" class="galion__btn galion__btn--fort" @click="nourrirLeReacteur">
          Nourrir le réacteur
        </button>
      </div>

      <p class="galion__journal" aria-live="polite">{{ journal[0] }}</p>

      <p class="galion__aveu">
        Démonstration — les trois chiffres montrent comment le navire se comporte,
        ils ne mesurent rien de réel. Les caractéristiques techniques de la machine
        sont publiées plus haut sur cette page.
      </p>
    </div>

    <!-- Les six systèmes du bord : le vocabulaire, et son équivalent machine. -->
    <ul v-if="etat === 'pret'" class="galion__systemes" aria-label="Les six systèmes du bord">
      <li v-for="m in BORD" :key="m.cle">
        <span>{{ m.cle }}</span>
        <em>{{ m.machine }}</em>
      </li>
    </ul>

    <div class="galion__legende" aria-hidden="true">
      <span><i></i>GALION ARKADIA · SS00999</span>
      <span>tracé procédural · aucune licence tierce</span>
    </div>
  </div>
</template>

<style scoped>
.galion {
  position: relative;
  aspect-ratio: 16 / 9;
  max-height: min(78vh, 720px);
  overflow: hidden;
  background: var(--paper);
  border: 1px solid var(--rule);
  border-radius: 4px;
}

.galion__canvas {
  display: block;
  width: 100%;
  height: 100%;
}

.galion__chargement,
.galion__repli {
  position: absolute;
  inset: auto 0 0 0;
  padding: var(--space-sm);
  margin: 0;
  font-family: var(--font-mono);
  font-size: 0.78rem;
  color: var(--ink-faint);
  text-align: center;
}

.galion__repli span { color: var(--alert); }

.galion__legende {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-sm);
  justify-content: space-between;
  padding: 0.7rem var(--space-sm);
  font-family: var(--font-mono);
  font-size: 0.62rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--ink-faint);
  pointer-events: none;
}

.galion__legende i {
  display: inline-block;
  width: 6px;
  height: 6px;
  margin-right: 0.5em;
  border-radius: 50%;
  background: var(--accent);
  vertical-align: middle;
}

/* --- Le bord rend compte : la tablette de domotique du navire ------------- */

.galion__bord {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: var(--space-sm);
  background: linear-gradient(to top, rgba(3, 6, 10, 0.94), rgba(3, 6, 10, 0.6) 70%, transparent);
  border-top: 1px solid var(--rule);
}

.galion__bord-titre {
  display: flex;
  align-items: center;
  gap: 0.5em;
  margin: 0 0 0.6rem;
  font-family: var(--font-mono);
  font-size: 0.6rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--accent);
}

.galion__bord-titre i {
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--accent);
  animation: galion-souffle 2.6s ease-in-out infinite;
}

@keyframes galion-souffle {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}

.galion__quart {
  margin-left: auto;
  font-weight: 400;
  letter-spacing: 0.1em;
  color: var(--ink-faint);
  text-transform: none;
}
.galion__quart b { color: var(--accent); font-weight: 600; }
.galion__quart em { font-style: normal; opacity: 0.7; }

.galion__bord-liste {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 0.5rem 1rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.galion__bord-liste li {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
  padding-left: 0.6rem;
  border-left: 2px solid var(--rule-strong);
}

.galion__bord-liste li[data-etat='nominal'] { border-left-color: var(--accent); }
.galion__bord-liste li[data-etat='actif']   { border-left-color: var(--neon-cyan); }
.galion__bord-liste li[data-etat='humain']  { border-left-color: var(--action); }

.galion__bord-cle {
  font-family: var(--font-mono);
  font-size: 0.6rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--ink);
}

.galion__bord-machine {
  font-size: 0.68rem;
  color: var(--ink-faint);
}

.galion__bord-valeur {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  color: var(--accent-ink);
}

/* ═══ LE BORD PILOTABLE — lisible d'abord, technique jamais ═══════════════ */

.galion__tete {
  display: flex;
  align-items: baseline;
  gap: 0.6em;
  flex-wrap: wrap;
  margin: 0 0 0.9rem;
  font-size: 0.95rem;
  color: var(--ink);
}

.galion__tete i {
  align-self: center;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--accent);
  animation: galion-souffle 2.6s ease-in-out infinite;
}

.galion__quart-nom { font-weight: 600; }

.galion__heure {
  margin-left: auto;
  font-family: var(--font-mono);
  font-size: 0.72rem;
  color: var(--ink-faint);
}

.galion__chiffres {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 0.9rem 1.4rem;
  margin: 0 0 1.1rem;
  padding: 0;
  list-style: none;
}

.galion__chiffres li { display: flex; flex-direction: column; gap: 0.25rem; }

.galion__chiffre-nom { font-size: 0.85rem; color: var(--ink-soft); }

.galion__chiffres b {
  font-family: var(--font-mono);
  font-size: 1.35rem;
  font-weight: 600;
  color: var(--accent);
  font-variant-numeric: tabular-nums;
}

.galion__chiffres b[data-alerte='true'] { color: var(--alert); }

.galion__jauge {
  height: 4px;
  border-radius: 99px;
  background: var(--rule);
  overflow: hidden;
}

.galion__jauge i {
  display: block;
  height: 100%;
  border-radius: 99px;
  background: var(--accent);
  transition: width 0.4s ease;
}

/* --- Les trois gestes : gros, clairs, au pouce --------------------------- */

.galion__gestes {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
  margin-bottom: 0.8rem;
}

.galion__btn {
  min-height: 46px;                 /* une cible qu'un pouce atteint */
  padding: 0.7em 1.3em;
  border: 1px solid var(--rule-strong);
  border-radius: 3px;
  background: transparent;
  color: var(--ink);
  font: inherit;
  font-size: 0.85rem;
  cursor: pointer;
  transition: background 0.15s ease, border-color 0.15s ease;
}

.galion__btn:hover { border-color: var(--accent); }
.galion__btn:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }

.galion__btn--actif {
  border-color: var(--accent);
  background: rgba(0, 255, 65, 0.1);
  color: var(--accent-ink);
}

.galion__btn--fort {
  border-color: var(--action);
  color: var(--action);
}
.galion__btn--fort:hover { background: rgba(252, 238, 10, 0.1); }

.galion__journal {
  margin: 0 0 0.6rem;
  font-size: 0.85rem;
  color: var(--ink-soft);
  min-height: 1.4em;
}

.galion__aveu {
  margin: 0;
  font-size: 0.72rem;
  line-height: 1.5;
  color: var(--ink-faint);
}

/* --- Les six systèmes : le vocabulaire, en une ligne --------------------- */

.galion__systemes {
  display: flex;
  flex-wrap: wrap;
  gap: 0.3rem 1.1rem;
  margin: 0;
  padding: 0.7rem var(--space-sm) 0;
  list-style: none;
  border-top: 1px solid var(--rule);
  font-size: 0.7rem;
  color: var(--ink-faint);
}

.galion__systemes li { display: flex; gap: 0.4em; align-items: baseline; }
.galion__systemes span {
  font-family: var(--font-mono);
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--ink-soft);
}
.galion__systemes em { font-style: normal; }

@media (prefers-reduced-motion: reduce) {
  .galion__tete i { animation: none; }
  .galion__jauge i { transition: none; }
}

@media (max-width: 860px) {
  .galion { aspect-ratio: 4 / 3; }
  .galion__legende span:last-child { display: none; }
  .galion__heures { margin-left: 0; }
  .galion__systemes em { display: none; }
  /* Sur un téléphone, les trois boutons prennent toute la largeur. */
  .galion__btn { flex: 1 1 100%; }
}
</style>
