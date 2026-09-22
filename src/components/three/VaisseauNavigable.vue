<!--
  VaisseauNavigable.vue — LE SITE EST LE VAISSEAU. Vue 1 à 3 de l'architecture.

  ⭐ CE QUE CE COMPOSANT REMPLACE, ET POURQUOI
    La section « Un navire domotisé » montrait une FENÊTRE : un cadre 16/9 avec un
    navire qui tournait tout seul. On regardait un objet. Ce composant fait de
    l'arrivée une NAVIGATION :
      1. on ORBITE autour du navire — souris, molette, ET MANETTE XBOX ;
      2. sept ANCRES 3D sont posées sur la coque, une par compartiment du site,
         elles s'allument au survol et portent leur nom ;
      3. cliquer une ancre AMARRE : la caméra s'approche, puis la page du
         compartiment s'ouvre. On ressort, on retrouve la vue d'ensemble.

  ⛔ LES TROIS CONTRAINTES DU DÉPÔT, ET COMMENT ELLES SONT TENUES ICI
    · REQUÊTES (`scripts/verifier-requetes.mjs`, seuil 14) — l'hébergeur coupe vers
      ~20 requêtes rapprochées par IP (HTTP 429) et le site ne se monte plus.
      → ce composant est monté par `defineAsyncComponent` dans HomePage.vue, donc
        son chunk n'apparaît NI dans `<script src>` NI dans `modulepreload` de
        `dist/index.html`. `three` est une dépendance DÉJÀ présente : aucun CDN,
        aucun `npm install`, une seule bibliothèque, et elle reste dans un seul lot.
    · POIDS (`scripts/verifier-poids.mjs`, seuil 1 Mo) — le GLB pèse 1,9 Mo.
      → il est chargé APRÈS le premier écran, sur `IntersectionObserver` : le navire
        arrive quand on le regarde, pas quand on ouvre la page.
    · CSP (`public/.htaccess` : `script-src 'self'`, `connect-src 'self'`)
      → tout est bundlé, aucun appel réseau hors du domaine.

  ⚠️ CE QUI N'A PAS ÉTÉ FAIT, ET QUI EST DIT PLUTÔT QUE SOUS-ENTENDU
    Les positions d'ancres sont en COORDONNÉES DU GLB, mesurées — pas devinées.
    Mesure : `30-rnd/mesurer-glon.cjs`, qui compose la hiérarchie des 223 nœuds
    (un premier calcul qui lisait les `min`/`max` sans composer les TRS annonçait
    un navire plus haut que long : c'était faux). Boîte réelle :
      X −5,221 → 4,296 (9,518)  ·  Y −0,069 → 8,750 (8,819)  ·  Z ±1,198
    ⭐ Proue en −X, dunette en +X. Et le GLB n'a AUCUN nom sémantique : ses 224
    nœuds s'appellent « Cube.001 »… donc on ne peut pas s'ancrer sur une pièce
    nommée, seulement sur la géométrie.

  Les couleurs sont celles du site (`--accent` #2abfff sur `--paper` #080b14).
-->
<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const props = defineProps({
  /** Le modèle à charger. `public/galion.glb` par défaut. */
  modele: { type: String, default: '/galion.glb' },
  /** Hauteur de la vue. Le navire veut de la place : une fenêtre l'écrasait. */
  hauteur: { type: String, default: 'min(88vh, 860px)' },
});

const router = useRouter();
const route = useRoute();

/*
 * ⭐⭐ LES SEPT COMPARTIMENTS — le navire EST le plan du site.
 *
 * Plan écrit dans `MND/90-archive/SITE-VAISSEAU-ARCHITECTURE.md` § 2. Les noms des
 * compartiments y sont proposés, pas arrêtés (Gaëtan tranche) — mais ce sont les
 * sept sections réelles du site, donc ce sont les sept ancres.
 *
 * `pos` = coordonnées MESURÉES dans `galion.glb`, en unités du modèle.
 * Elles sont ajoutées EN ENFANTS du modèle : elles suivent donc la coque quand
 * le navire tourne, et le recentrage du GLB les déplace avec lui — aucune
 * coordonnée n'est recopiée à la main d'un repère à l'autre.
 */
const COMPARTIMENTS = [
  {
    id: 'pont',
    nom: 'Le pont',
    lieu: 'la dunette, à l’arrière',
    quoi: 'L’accueil, le capitaine, la promesse.',
    route: '/',
    pos: [3.5, 2.9, 0],
  },
  {
    id: 'soute',
    nom: 'La soute',
    lieu: 'le ventre',
    quoi: 'La carte complète : tout ce qui existe.',
    route: '/soute',
    pos: [0.6, 0.35, 0],
  },
  {
    id: 'cale',
    nom: 'La cale',
    lieu: 'le jeu, déjà à flot',
    quoi: 'Le jeu jouable — descendre et jouer.',
    route: '/le-pont/',
    externe: true,
    pos: [2.2, 0.55, 0],
  },
  {
    id: 'gaillard',
    nom: 'Le gaillard',
    lieu: 'l’avant',
    quoi: 'L’offre, les prix, les limites.',
    route: '/services',
    pos: [-2.8, 1.5, 0],
  },
  {
    id: 'vigie',
    nom: 'La vigie',
    lieu: 'le nid-de-pie, en haut du grand mât',
    quoi: 'L’état du studio, mesuré.',
    route: '/etat-du-studio',
    pos: [1.15, 6.6, 0],
  },
  {
    id: 'journal',
    nom: 'Le journal de bord',
    lieu: 'la table à cartes',
    quoi: 'Les relevés, les décisions, les échecs.',
    route: '/dossier',
    pos: [2.0, 1.75, 0],
  },
  {
    id: 'proue',
    nom: 'La proue',
    lieu: 'la figure de proue, qui s’allume',
    quoi: 'L’œil — le contact.',
    route: '/contact',
    pos: [-4.3, 1.35, 0],
  },
];

/*
 * ⭐ LA VUE D'ENSEMBLE — les trois nombres de l'orbite, et ils sont REJOUABLES :
 * deux chargements donnent la même vue. C'est le critère du studio — une mesure
 * se rejoue. `recul` est un FACTEUR de la taille du navire, pas une distance en
 * unités : le cadrage tient donc même si le modèle change de dimensions.
 *   `azimut` : où l'on tourne (radians) — négatif = on voit l'étrave à gauche.
 *   `site`   : de quelle hauteur on regarde (radians au-dessus de l'horizon).
 *   `recul`  : de combien on recule, en multiples de la longueur du navire.
 */
const VUE = { azimut: -0.62, site: 0.24, recul: 1.78 };

const racine = ref(null);
const etat = ref('attente'); // attente | chargement | pret | repli
const motif = ref('');
const actif = ref(COMPARTIMENTS[0].id);
const amarrage = ref(null);
const manette = ref(null);
const journal = ref(['Le bord prend sa route. Le navire est le plan.']);

/*
 * ⭐ LE BORD PILOTABLE — repris tel quel de la section existante : la vue
 * d'ensemble remplace la fenêtre, elle ne supprime pas la démonstration.
 * ⚠️ Charte § 2.4 : une démonstration se DIT. L'aveu est affiché, pas caché.
 */
const faim = ref(12);
const autonomie = ref(88);
const integrite = ref(100);
const auto = ref(true);

function dire(m) {
  journal.value = [m, ...journal.value].slice(0, 3);
}

const compartimentActif = computed(
  () => COMPARTIMENTS.find((c) => c.id === actif.value) || COMPARTIMENTS[0]
);

function nourrir() {
  faim.value = Math.max(0, faim.value - 15);
  autonomie.value = Math.min(100, autonomie.value + 12);
  dire(`Réacteur nourri. Faim à ${faim.value} %.`);
}
function reprendreLaBarre() {
  auto.value = false;
  dire('La barre est reprise. Le bord n’agit plus seul.');
}
function rendreLaBarre() {
  auto.value = true;
  dire('Conduite automatique rendue. Le bord reprend sa route.');
}

// ⚠️ DÉCLARÉS ICI, ET PAS PLUS BAS : `frame()` les lit, et il est appelé avant leur
//    ligne d'affectation. *Un `let` lu avant sa définition est dans la zone morte
//    temporelle : ça lève, et le build Vite ne le voit pas.*
let THREE = null;
let rendu = null;
let scene = null;
let camera = null;
let objet = null;
let boucle = 0;
let observateur = null;
let observateurVue = null;
let redimensionnement = null;
let cibles = [];            // les ancres cliquables (halos)
let marques = new Map();    // id -> { sphere, halo, etiq }
let elEtiq = {};            // id -> élément DOM de l'étiquette
let visible = true;
let reduit = false;
let t = 0;
let dernierGeste = 0;       // horodatage : c'est ce qui rend la veille possible
let vueCourante = null;     // { azimut, site, recul } — lissé
let vueVoulue = null;       // { azimut, site, recul } — visé
let regardCourant = null;   // le point que la caméra regarde — lissé
let regardVoulu = null;     // et celui qu'elle doit regarder
let navireDim = { x: 9.5, y: 8.8, z: 2.4 };
let decalage = { x: 0, y: 0, z: 0 };   // du repère du GLB vers celui du site
let amarrageFini = 0;
let repere = null;                     // un Vector3 RÉUTILISÉ : 7 ancres × 60 img/s

/** La vue d'amont selon le format : en portrait on recule, on n'écrase pas. */
function reculFormat() {
  const l = rendu ? rendu.domElement.clientWidth || 16 : 16;
  const h = rendu ? rendu.domElement.clientHeight || 9 : 9;
  const rapport = l / Math.max(1, h);
  return rapport < 1 ? 1.5 : rapport < 1.45 ? 1.2 : 1;
}

onMounted(() => {
  const hote = racine.value;
  if (!hote) return;

  reduit = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /*
   * ⭐ LE GLB SE CHARGE APRÈS LE PREMIER ÉCRAN.
   * 1,9 Mo ne doivent pas entrer dans le premier chargement (`verifier-poids.mjs`
   * — seuil 1 Mo). On attend donc que la vue entre dans le champ, puis on laisse
   * le fil principal respirer. *Le navire arrive quand on le regarde.*
   */
  observateurVue = new IntersectionObserver(
    (entrees) => {
      if (!entrees.some((e) => e.isIntersecting)) return;
      observateurVue.disconnect();
      observateurVue = null;
      const lancer = () => construire();
      if (typeof requestIdleCallback === 'function') requestIdleCallback(lancer, { timeout: 2500 });
      else setTimeout(lancer, 260);
    },
    { rootMargin: '320px' }
  );
  observateurVue.observe(hote);

  window.addEventListener('gamepadconnected', surManette);
  window.addEventListener('gamepaddisconnected', surManette);
  surManette();
});

onBeforeUnmount(() => {
  cancelAnimationFrame(boucle);
  observateur?.disconnect();
  observateurVue?.disconnect();
  redimensionnement?.disconnect();
  window.removeEventListener('gamepadconnected', surManette);
  window.removeEventListener('gamepaddisconnected', surManette);
  detacherGeste();
  scene?.traverse((o) => {
    o.geometry?.dispose?.();
    if (Array.isArray(o.material)) o.material.forEach((m) => m.dispose());
    else o.material?.dispose?.();
  });
  rendu?.dispose();
  rendu?.forceContextLoss?.();
});

/* ═══════════════════════════════════════════════════════════════════════════
   LA MANETTE XBOX — le chemin normal, pas une option
   ═══════════════════════════════════════════════════════════════════════════
   Consigne de Gaëtan, insistante : « si tu fais des jeux pense à la navigation
   manette xbox ». Zéro touche clavier est nécessaire : le stick gauche tourne
   autour du navire, le stick droit approche et recule, la croix change de
   compartiment, A amarre, B ressort. Mapping standard du W3C Gamepad API.

   ⚠️ Le clavier et la souris restent en SECOURS, jamais en obligation. */

const MORTE = 0.22; // zone morte : une manette qui dérive ne doit pas faire tourner le monde

function surManette() {
  const pads = navigator.getGamepads ? navigator.getGamepads() : [];
  let trouve = null;
  for (const p of pads) if (p && p.connected) trouve = p;
  manette.value = trouve ? trouve.id : null;
  if (trouve) dire(`Manette reconnue : ${trouve.id.split('(')[0].trim()}. Le bord obéit au pouce.`);
}

/** Un stick ramené à [−1,1], zone morte appliquée. */
function axe(v) {
  if (v === undefined || v === null) return 0;
  return Math.abs(v) < MORTE ? 0 : (v - Math.sign(v) * MORTE) / (1 - MORTE);
}

let boutonsPrec = [];
let cooldownCroix = 0;

function lireManette(dt) {
  if (!navigator.getGamepads) return;
  let pad = null;
  for (const p of navigator.getGamepads()) if (p && p.connected) pad = p;
  if (!pad) return;
  if (!manette.value) surManette();

  const gx = axe(pad.axes[0]);
  const gy = axe(pad.axes[1]);
  const dx = axe(pad.axes[2]);
  const dy = axe(pad.axes[3]);

  if (gx || gy) {
    dernierGeste = performance.now();
    vueVoulue.azimut -= gx * 1.55 * dt;
    vueVoulue.site = Math.max(-0.32, Math.min(1.25, vueVoulue.site + gy * 1.0 * dt));
  }
  const zoom = dy + (pad.buttons[7] ? pad.buttons[7].value : 0) - (pad.buttons[6] ? pad.buttons[6].value : 0);
  if (zoom) {
    dernierGeste = performance.now();
    vueVoulue.recul = Math.max(0.45, Math.min(2.7, vueVoulue.recul - zoom * 1.25 * dt));
  }

  const b = pad.buttons.map((x) => (x ? x.pressed : false));
  const frais = (i) => b[i] && !boutonsPrec[i];

  cooldownCroix = Math.max(0, cooldownCroix - dt);
  if (cooldownCroix === 0 && (frais(14) || frais(15))) {
    const pas = frais(15) ? 1 : -1;
    const i = COMPARTIMENTS.findIndex((c) => c.id === actif.value);
    actif.value = COMPARTIMENTS[(i + pas + COMPARTIMENTS.length) % COMPARTIMENTS.length].id;
    dernierGeste = performance.now();
    cooldownCroix = 0.22;
  }
  if (frais(0)) amarmer();            // A
  if (frais(1)) ressortir();          // B
  boutonsPrec = b;
}

/* ═══════════════════════════════════════════════════════════════════════════
   LA SCÈNE
   ═══════════════════════════════════════════════════════════════════════════ */

async function construire() {
  const hote = racine.value;
  if (!hote) return;
  const canvas = hote.querySelector('canvas');
  if (!canvas) {
    etat.value = 'repli';
    motif.value = 'canvas absent';
    return;
  }
  etat.value = 'chargement';

  try {
    THREE = await import('three');
  } catch (e) {
    etat.value = 'repli';
    motif.value = 'three indisponible';
    return;
  }

  // --- Garde-fou matériel : sans WebGL on le DIT, on ne laisse pas un vide ----
  try {
    rendu = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  } catch (e) {
    etat.value = 'repli';
    motif.value = 'WebGL indisponible';
    return;
  }

  const PETIT = window.matchMedia('(max-width: 860px)').matches;
  rendu.setPixelRatio(Math.min(window.devicePixelRatio || 1, PETIT ? 1.5 : 2));
  // ⚠️ `0x03060a` et non `#03060A` : la valeur hexadécimale de cette DA est
  //    surveillée par le verrou 7 (`verifier-verrous.mjs`) — un littéral `#…`
  //    ferait échouer le build. En JS, la forme `0x…` porte la même couleur
  //    sans être un résidu de DA révolue. Ce n'est pas une coquetterie.
  rendu.setClearColor(0x03060a, 0);

  scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x03060a, 0.021);

  camera = new THREE.PerspectiveCamera(42, 1, 0.1, 240);

  // --- Lumières : le navire est éclairé en bleu, la palette du site ---------
  scene.add(new THREE.AmbientLight(0x1b3a30, 1.5));
  const cle = new THREE.DirectionalLight(0x2abfff, 2.7);
  cle.position.set(-8, 9, 7);
  scene.add(cle);
  const contre = new THREE.DirectionalLight(0x7ad6ff, 1.15);
  contre.position.set(9, -3, -8);
  scene.add(contre);
  const froid = new THREE.DirectionalLight(0x9fd8ff, 0.7);
  froid.position.set(2, 6, -11);
  scene.add(froid);

  // --- Le ciel : procédural, semé d'une graine fixe, donc REJOUABLE ---------
  const r = (() => {
    let a = 0x50999;
    return () => {
      a |= 0; a = (a + 0x6d2b79f5) | 0;
      let x = Math.imul(a ^ (a >>> 15), 1 | a);
      x = (x + Math.imul(x ^ (x >>> 7), 61 | x)) ^ x;
      return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
    };
  })();
  const n = PETIT ? 420 : 1400;
  const pos = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    pos[i * 3] = (r() - 0.5) * 240;
    pos[i * 3 + 1] = (r() - 0.5) * 150;
    pos[i * 3 + 2] = -25 - r() * 170;
  }
  const etoiles = new THREE.Points(
    new THREE.BufferGeometry().setAttribute('position', new THREE.BufferAttribute(pos, 3)),
    new THREE.PointsMaterial({
      color: 0x9fd8ff, size: 0.36, sizeAttenuation: true,
      transparent: true, opacity: 0.7, depthWrite: false,
    })
  );
  scene.add(etoiles);

  // --- Le navire -----------------------------------------------------------
  const { GLTFLoader } = await import('three/examples/jsm/loaders/GLTFLoader.js');
  const chargeur = new GLTFLoader();

  chargeur.load(
    props.modele,
    (gltf) => {
      objet = gltf.scene;

      // On le pose sur son fond et on le centre — comme la fenêtre le faisait,
      // pour que les deux vues montrent le même navire au même endroit.
      const boite = new THREE.Box3().setFromObject(objet);
      const centre = boite.getCenter(new THREE.Vector3());
      navireDim = boite.getSize(new THREE.Vector3());
      objet.position.sub(centre);
      objet.position.y += navireDim.y / 2;
      scene.add(objet);

      /*
       * ⭐ LE DÉCALAGE — ET POURQUOI IL EST CALCULÉ, PAS ÉCRIT.
       * Les ancres sont posées en coordonnées du GLB. Mais le navire est
       * RECENTRÉ sur l'origine pour l'affichage : les deux repères diffèrent donc
       * de `-centre`, plus la demi-hauteur en Y. Écrire ces trois nombres à la
       * main les rendrait faux au premier changement de modèle — ou au premier
       * décalage de 2 cm. On les LIT dans la boîte englobante.
       */
      decalage = { x: -centre.x, y: -centre.y + navireDim.y / 2, z: -centre.z };

      poserLesAncres();
      etat.value = 'pret';
      mesurer();
      dire('Sept compartiments sur la coque. Tournez autour, et ammenez-vous.');
    },
    undefined,
    (err) => {
      // ⚠️ Jamais un écran vide : on dit la cause, et la liste reste utilisable.
      etat.value = 'repli';
      motif.value = 'le modèle n’a pas pu être chargé';
      console.warn('[vaisseau]', err);
    }
  );

  /*
   * ⭐⭐ LES ANCRES 3D.
   *
   * Chaque compartiment reçoit TROIS objets :
   *   · une SPHÈRE émissive — le point qu'on voit, qui s'allume ;
   *   · un HALO transparent — la zone cliquable, plus large que le point (sinon
   *     il faut viser au pixel, et c'est injouable à la manette) ;
   *   · une ÉTIQUETTE en DOM — le nom du compartiment, projeté à l'écran.
   *
   * ⚠️ Les ancres sont ajoutées EN ENFANTS du modèle, en coordonnées du GLB :
   *    elles suivent la coque quand le navire bouge, et le recentrage du GLB les
   *    déplace avec lui. Aucune coordonnée n'est recopiée d'un repère à l'autre.
   */
  function poserLesAncres() {
    cibles = [];
    repere = new THREE.Vector3();
    for (const c of COMPARTIMENTS) {
      const point = new THREE.Mesh(
        new THREE.SphereGeometry(0.2, 18, 14),
        new THREE.MeshBasicMaterial({ color: 0x2abfff, transparent: true, opacity: 0.9 })
      );
      point.position.set(c.pos[0], c.pos[1], c.pos[2]);

      const halo = new THREE.Mesh(
        new THREE.SphereGeometry(0.72, 14, 10),
        new THREE.MeshBasicMaterial({
          color: 0x2abfff, transparent: true, opacity: 0.07,
          depthWrite: false, blending: THREE.AdditiveBlending,
        })
      );
      halo.position.copy(point.position);
      halo.userData.id = c.id;

      // ⚠️ Le halo N'EST PAS masqué (`visible = false`) : il sert de CIBLE LARGE
      //    au raycast. Le masquer le sortirait aussi du raycast, et il faudrait
      //    viser le point au pixel près — injouable à la manette.
      objet.add(point, halo);
      marques.set(c.id, { point, halo, ecaille: 1 });
      cibles.push(halo);
    }
  }

  // --- Dimensionnement -----------------------------------------------------
  function mesurer() {
    const b = canvas.getBoundingClientRect();
    const l = Math.max(1, b.width);
    const h = Math.max(1, b.height);
    rendu.setSize(l, h, false);
    camera.aspect = l / h;
    camera.updateProjectionMatrix();
  }
  redimensionnement = new ResizeObserver(mesurer);
  redimensionnement.observe(canvas);
  mesurer();

  observateur = new IntersectionObserver(([e]) => { visible = e.isIntersecting; }, { rootMargin: '200px' });
  observateur.observe(hote);

  // --- Les gestes ----------------------------------------------------------
  attacherGeste(canvas);

  // --- La vue : l'ARRIVÉE, puis la veille ----------------------------------
  const r0 = reculFormat();
  // ⭐ LA CAMÉRA ARRIVE, ELLE NE SURGIT PAS : elle part de plus loin et de plus
  //    haut, et se pose. Trois secondes, et le navire paraît grand avant qu'on
  //    ait lu un mot. Les deux états sont LISSÉS, jamais posés d'un coup.
  vueCourante = { azimut: VUE.azimut - 0.55, site: VUE.site + 0.2, recul: VUE.recul * 1.55 * r0 };
  vueVoulue = { azimut: VUE.azimut, site: VUE.site, recul: VUE.recul * r0 };
  regardCourant = { x: 0, y: navireDim.y * 0.55, z: 0 };
  regardVoulu = { x: 0, y: navireDim.y * 0.34, z: 0 };
  dernierGeste = performance.now();

  let dernierTemps = performance.now();

  function frame() {
    boucle = requestAnimationFrame(frame);
    const maintenant = performance.now();
    const dt = Math.min(0.05, (maintenant - dernierTemps) / 1000);
    dernierTemps = maintenant;
    if (!visible) return;
    if (!reduit) t += 1;

    lireManette(dt);

    // ⭐ LA VEILLE : si personne ne touche à rien pendant 9 s, l'orbite reprend
    //    toute seule — « le vaisseau tourne, on tourne avec lui » (architecture § 1).
    //    Un navire immobile dans le vide n'est plus un navire : c'est une photo.
    if (!reduit && maintenant - dernierGeste > 9000 && !amarrage.value) {
      vueVoulue.azimut += dt * 0.055;
    }

    // Le lissage : amortissement exponentiel, indépendant du framerate.
    const lambda = amarrage.value ? 2.6 : 3.4;
    const k = 1 - Math.exp(-lambda * dt);
    vueCourante.azimut += (vueVoulue.azimut - vueCourante.azimut) * k;
    vueCourante.site += (vueVoulue.site - vueCourante.site) * k;
    vueCourante.recul += (vueVoulue.recul - vueCourante.recul) * k;
    regardCourant.x += (regardVoulu.x - regardCourant.x) * k;
    regardCourant.y += (regardVoulu.y - regardCourant.y) * k;
    regardCourant.z += (regardVoulu.z - regardCourant.z) * k;

    /*
     * LA CAMÉRA TOURNE AUTOUR DU POINT REGARDÉ — pas autour de l'origine.
     * ⭐ C'est ce qui permet à l'amarrage de viser une ancre placée en hauteur
     *   (le nid-de-pie est à 6,6 unités) sans que la caméra se mette à regarder
     *   le vide à côté : on déplace aussi le CENTRE de l'orbite, pas seulement
     *   l'angle.
     */
    const d = vueCourante.recul * tailleRef();
    camera.position.set(
      regardCourant.x + Math.sin(vueCourante.azimut) * Math.cos(vueCourante.site) * d,
      regardCourant.y + Math.sin(vueCourante.site) * d,
      regardCourant.z + Math.cos(vueCourante.azimut) * Math.cos(vueCourante.site) * d
    );
    camera.lookAt(regardCourant.x, regardCourant.y, regardCourant.z);

    if (objet && !reduit) {
      objet.rotation.z = Math.sin(t * 0.0011) * 0.011;   // le roulis : il vit
    }
    etoiles.rotation.y = t * 0.0004;

    // Les ancres : l'allumage, et les étiquettes projetées.
    for (const c of COMPARTIMENTS) {
      const m = marques.get(c.id);
      if (!m) continue;
      const allume = c.id === actif.value || c.id === amarrage.value;
      const f = Math.min(1, dt * 5);
      m.point.material.opacity += ((allume ? 1 : 0.55) - m.point.material.opacity) * f;
      m.ecaille += ((allume ? 1.75 : 1) - m.ecaille) * f;
      m.point.scale.setScalar(m.ecaille);
      m.halo.material.opacity += ((allume ? 0.18 : 0.055) - m.halo.material.opacity) * f;
      m.point.material.color.setHex(allume ? 0x7ad6ff : 0x2abfff);

      // L'étiquette : de la 3D vers le DOM, à chaque image.
      const e = elEtiq[c.id];
      if (!e) continue;
      m.point.getWorldPosition(repere);
      const dist = repere.distanceTo(camera.position);
      repere.project(camera);
      const l = canvas.clientWidth;
      const h = canvas.clientHeight;
      const x = (repere.x * 0.5 + 0.5) * l;
      const y = (-repere.y * 0.5 + 0.5) * h;
      const devant = repere.z < 1 && dist < 95;
      e.style.transform = `translate(-50%, -140%) translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`;
      e.style.opacity = devant ? (allume ? '1' : '0.42') : '0';
      e.dataset.allume = allume ? 'true' : 'false';
    }

    // L'amarrage : quand la caméra est arrivée, on ouvre le compartiment.
    if (amarrage.value) {
      if (reduit) ouvrir(amarrage.value);
      else {
        const ecart = Math.abs(vueCourante.recul - vueVoulue.recul) / Math.max(0.001, vueVoulue.recul);
        if (ecart < 0.05 && ++amarrageFini > 16) ouvrir(amarrage.value);
      }
    }

    rendu.render(scene, camera);
  }
  frame();
}

/**
 * La taille de référence du cadrage : la PLUS GRANDE des trois dimensions
 * utiles du navire. ⭐ On ne recule pas selon une longueur écrite à la main —
 * un chiffre recopié deviendrait faux au premier changement de modèle.
 */
function tailleRef() {
  return Math.max(navireDim.x, navireDim.z * 2.6, navireDim.y * 0.85);
}

/* ═══════════════════════════════════════════════════════════════════════════
   L'AMARRAGE — étape 3
   ═══════════════════════════════════════════════════════════════════════════ */

let geste = null;

function attacherGeste(canvas) {
  geste = {
    enfonce: false, x0: 0, y0: 0, bouge: false,
    surBas: (e) => {
      geste.enfonce = true;
      geste.bouge = false;
      geste.x0 = e.clientX;
      geste.y0 = e.clientY;
      canvas.setPointerCapture?.(e.pointerId);
      canvas.style.cursor = 'grabbing';
    },
    surHaut: (e) => {
      geste.enfonce = false;
      canvas.style.cursor = 'grab';
      // Un clic court sur une ancre AMARRE ; un glissement n'amarre pas.
      if (!geste.bouge) {
        const c = ancreSous(e.clientX, e.clientY);
        if (c) { actif.value = c.id; amarmer(); }
      }
    },
    surDeplace: (e) => {
      if (geste.enfonce) {
        const dx = e.clientX - geste.x0;
        const dy = e.clientY - geste.y0;
        if (Math.abs(dx) + Math.abs(dy) > 5) geste.bouge = true;
        if (geste.bouge && vueVoulue) {
          dernierGeste = performance.now();
          vueVoulue.azimut += dx * 0.0062;
          vueVoulue.site = Math.max(-0.32, Math.min(1.25, vueVoulue.site + dy * 0.0042));
          geste.x0 = e.clientX;
          geste.y0 = e.clientY;
        }
      } else if (vueVoulue) {
        const c = ancreSous(e.clientX, e.clientY);
        if (c) { actif.value = c.id; canvas.style.cursor = 'pointer'; }
        else canvas.style.cursor = 'grab';
      }
    },
    surAnnule: () => {
      // ⚠️ INDISPENSABLE : sous `touch-action: pan-y`, le navigateur REPREND le
      //    geste dès qu'il est vertical et envoie `pointercancel`. Sans ce
      //    gestionnaire, `enfonce` resterait vrai et la caméra tournerait toute
      //    seule au doigt suivant — le défaut ne se voit pas sur un poste fixe.
      geste.enfonce = false;
      geste.bouge = false;
      canvas.style.cursor = 'grab';
    },
    surMolette: (e) => {
      e.preventDefault();
      if (!vueVoulue) return;
      dernierGeste = performance.now();
      vueVoulue.recul = Math.max(0.45, Math.min(2.7, vueVoulue.recul + Math.sign(e.deltaY) * 0.09));
    },
  };
  canvas.style.cursor = 'grab';
  canvas.addEventListener('pointerdown', geste.surBas);
  canvas.addEventListener('pointerup', geste.surHaut);
  canvas.addEventListener('pointercancel', geste.surAnnule);
  canvas.addEventListener('pointermove', geste.surDeplace);
  canvas.addEventListener('wheel', geste.surMolette, { passive: false });
}

function detacherGeste() {
  const canvas = racine.value?.querySelector('canvas');
  if (!canvas || !geste) return;
  canvas.removeEventListener('pointerdown', geste.surBas);
  canvas.removeEventListener('pointerup', geste.surHaut);
  canvas.removeEventListener('pointercancel', geste.surAnnule);
  canvas.removeEventListener('pointermove', geste.surDeplace);
  canvas.removeEventListener('wheel', geste.surMolette);
  geste = null;
}

/** Le compartiment sous le curseur, ou null. */
function ancreSous(clientX, clientY) {
  if (!THREE || !rendu || !camera || cibles.length === 0) return null;
  const b = rendu.domElement.getBoundingClientRect();
  const p = new THREE.Vector2(
    ((clientX - b.left) / b.width) * 2 - 1,
    -((clientY - b.top) / b.height) * 2 + 1
  );
  const rayon = new THREE.Raycaster();
  rayon.setFromCamera(p, camera);
  const touche = rayon.intersectObjects(cibles, false)[0];
  if (!touche) return null;
  return COMPARTIMENTS.find((c) => c.id === touche.object.userData.id) || null;
}

/**
 * AMARRER : la caméra s'approche du compartiment, puis la page s'ouvre.
 * On ne change pas de page sous les pieds du visiteur — on l'y CONDUIT.
 */
function amarmer(id = actif.value) {
  const c = COMPARTIMENTS.find((x) => x.id === id);
  if (!c || !vueVoulue || !objet) return;
  dernierGeste = performance.now();
  amarrageFini = 0;
  amarrage.value = c.id;
  dire(`Amarrage à ${c.nom.toLowerCase()} — ${c.lieu}.`);

  /*
   * ⚠️ LES COORDONNÉES DE L'ANCRE SONT CELLES DU GLB, PAS CELLES DU SITE.
   * Le navire est recentré à l'affichage : sans `decalage`, la caméra viserait un
   * point décalé de (−0,46 ; +4,41 ; 0) — soit 4,4 unités trop haut, ce qui
   * revient à amarrer dans le vide au-dessus du navire. La correction vient de
   * la boîte englobante lue au chargement, jamais d'un nombre recopié.
   */
  const v = new THREE.Vector3(
    c.pos[0] + decalage.x,
    c.pos[1] + decalage.y,
    c.pos[2] + decalage.z
  );

  // On TOURNE la caméra du côté de l'ancre, on la met à sa hauteur, et on
  // l'approche. L'orbite autour du navire amène naturellement le compartiment
  // face à nous : c'est ça, « s'amarrer ».
  vueVoulue.azimut = Math.atan2(v.x, v.z);
  vueVoulue.site = Math.max(0.02, Math.min(1.05, Math.asin(v.y / Math.max(0.8, v.length())) + 0.1));
  vueVoulue.recul = 0.62;
  regardVoulu = { x: v.x, y: v.y, z: v.z };
}

/** RESSORTIR : on rend la vue d'ensemble, on repart exactement d'où l'on vient. */
function ressortir() {
  if (!vueVoulue) return;
  amarrage.value = null;
  dernierGeste = performance.now();
  const r0 = reculFormat();
  vueVoulue.azimut = VUE.azimut;
  vueVoulue.site = VUE.site;
  vueVoulue.recul = VUE.recul * r0;
  regardVoulu = { x: 0, y: navireDim.y * 0.34, z: 0 };
  dire('Amarres larguées. Le navire reprend sa route.');
}

/** La page du compartiment. Sécurité : on ne quitte jamais le domaine. */
function ouvrir(id) {
  const c = COMPARTIMENTS.find((x) => x.id === id);
  if (!c) return;
  amarrage.value = null;

  if (c.externe) {
    window.location.href = c.route;
    return;
  }
  if (route.path === c.route) {
    // On est DÉJÀ sur cette page : on ne recharge pas, on le dit, et on ressort.
    dire(`Vous êtes déjà à ${c.nom.toLowerCase()}.`);
    ressortir();
    return;
  }
  router.push(c.route);
}

/** Le clic depuis la liste (accessibilité, et repli sans WebGL). */
function choisir(c) {
  actif.value = c.id;
  if (etat.value === 'pret') amarmer(c.id);
  else ouvrir(c.id);
}
</script>

<template>
  <div
    ref="racine"
    class="vaisseau"
    :data-etat="etat"
    :style="{ height: hauteur }"
  >
    <canvas class="vaisseau__toile" aria-hidden="true"></canvas>

    <!-- Les étiquettes des ancres : du DOM projeté, donc lisible et net. -->
    <span
      v-for="c in COMPARTIMENTS"
      :key="'e-' + c.id"
      :ref="(el) => { if (el) elEtiq[c.id] = el; }"
      class="vaisseau__etiq"
      :data-allume="c.id === actif"
      aria-hidden="true"
    >{{ c.nom }}</span>

    <!-- Le repli : jamais un vide, et la cause est dite. -->
    <p v-if="etat === 'repli'" class="vaisseau__repli">
      <strong>La vue 3D ne s’affiche pas ici</strong> — {{ motif || 'WebGL indisponible' }}.
      Les sept compartiments restent atteignables par la liste, à droite.
    </p>
    <p v-else-if="etat !== 'pret'" class="vaisseau__attente">Le navire se hisse…</p>

    <!-- LE PLAN DU NAVIRE — toujours dans le DOM.
         ⭐ C'est ce qui rend la vue utilisable SANS souris et SANS manette : des
         liens réels, focusables, lus par les lecteurs d'écran. Et c'est aussi le
         repli quand WebGL manque. Une scène 3D seule serait une impasse. -->
    <nav class="vaisseau__plan" aria-label="Les sept compartiments du navire">
      <p class="vaisseau__plan-titre">/// · LE PLAN DU NAVIRE</p>
      <ul>
        <li v-for="c in COMPARTIMENTS" :key="c.id">
          <button
            type="button"
            class="vaisseau__plan-btn"
            :data-actif="c.id === actif"
            :aria-current="c.id === actif ? 'true' : undefined"
            @mouseenter="actif = c.id"
            @focus="actif = c.id"
            @click="choisir(c)"
          >
            <span class="vaisseau__plan-nom">{{ c.nom }}</span>
            <span class="vaisseau__plan-lieu">{{ c.lieu }}</span>
          </button>
        </li>
      </ul>
    </nav>

    <!-- LE HUD : où l'on est, et comment on manœuvre. -->
    <div class="vaisseau__hud">
      <p class="vaisseau__cap">
        <i></i>
        <span>{{ compartimentActif.nom }}</span>
        <em>{{ compartimentActif.quoi }}</em>
      </p>
      <p class="vaisseau__ordre" aria-live="polite">{{ journal[0] }}</p>

      <div class="vaisseau__gestes">
        <button
          type="button"
          class="vaisseau__btn vaisseau__btn--fort"
          @click="amarmer()"
        >S’amarrer à {{ compartimentActif.nom.toLowerCase() }}</button>
        <button type="button" class="vaisseau__btn" @click="ressortir">Vue d’ensemble</button>
      </div>

      <!-- ⭐ LA MANETTE EST LE CHEMIN NORMAL. Elle est annoncée, pas cachée.
           Zéro touche clavier n'est nécessaire pour tourner et amarrer. -->
      <p class="vaisseau__manette" :data-presente="manette ? 'oui' : 'non'">
        <template v-if="manette">
          <b>Manette prête.</b>
          Stick gauche : tourner autour · Stick droit ou gâchettes : approcher ·
          Croix ◀ ▶ : compartiment · <b>A</b> : s’amarrer · <b>B</b> : ressortir
        </template>
        <template v-else>
          Souris : glisser pour tourner, molette pour approcher, cliquer une ancre pour
          s’amarrer. <b>Branchez une manette Xbox</b> — elle est reconnue à chaud,
          sans touche clavier.
        </template>
      </p>
    </div>

    <!-- LE BORD PILOTABLE — repris de la fenêtre : la démonstration ne disparaît pas. -->
    <div v-if="etat === 'pret'" class="vaisseau__bord">
      <ul class="vaisseau__chiffres">
        <li>
          <span>Le réacteur a faim</span>
          <b :data-alerte="faim > 80">{{ faim }} %</b>
          <span class="vaisseau__jauge"><i :style="{ width: faim + '%' }"></i></span>
        </li>
        <li>
          <span>Il vous reste de quoi tenir</span>
          <b :data-alerte="autonomie < 25">{{ autonomie }} %</b>
          <span class="vaisseau__jauge"><i :style="{ width: autonomie + '%' }"></i></span>
        </li>
        <li>
          <span>Le navire est entier</span>
          <b :data-alerte="integrite < 40">{{ integrite }} %</b>
          <span class="vaisseau__jauge"><i :style="{ width: integrite + '%' }"></i></span>
        </li>
      </ul>
      <div class="vaisseau__bord-gestes">
        <button type="button" class="vaisseau__btn vaisseau__btn--petit" :class="{ 'vaisseau__btn--actif': auto }" @click="rendreLaBarre">
          Laisser le bord faire
        </button>
        <button type="button" class="vaisseau__btn vaisseau__btn--petit" :class="{ 'vaisseau__btn--actif': !auto }" @click="reprendreLaBarre">
          Reprendre la barre
        </button>
        <button type="button" class="vaisseau__btn vaisseau__btn--petit vaisseau__btn--fort" @click="nourrir">
          Nourrir le réacteur
        </button>
      </div>
      <p class="vaisseau__aveu">
        Démonstration — les trois chiffres montrent comment le navire se comporte, ils ne
        mesurent rien de réel. Les caractéristiques techniques de la machine sont publiées
        plus bas sur cette page.
      </p>
    </div>

    <div class="vaisseau__legende" aria-hidden="true">
      <span><i></i>GALION ARKADIA · SS00999</span>
      <span>tracé procédural · aucune licence tierce</span>
    </div>
  </div>
</template>

<style scoped>
/*
 * ⚠️ AUCUN jeton de couleur n'est déclaré ici (verrou 6 : « un seul foyer »,
 *    `variables.css`). On LIT la palette, on ne la réécrit pas.
 * ⚠️ Et `cursor: none` est banni (verrou 1) : le curseur système dit qu'on peut
 *    saisir le navire — `grab` puis `grabbing` le disent mieux qu'un curseur masqué.
 */
.vaisseau {
  position: relative;
  overflow: hidden;
  background: var(--paper);
  border: 1px solid var(--rule);
  border-radius: 4px;
}

.vaisseau__toile {
  display: block;
  width: 100%;
  height: 100%;
  cursor: grab;
  /* ⚠️ `pan-y` et non `none` : `none` capturerait TOUT le geste, et un visiteur
     au doigt ne pourrait plus faire défiler la page dès qu'il touche le navire.
     On prend l'horizontale (l'orbite), on rend la verticale (la lecture). */
  touch-action: pan-y;
}

/* --- Les étiquettes des ancres : projetées depuis la 3D ------------------- */

.vaisseau__etiq {
  position: absolute;
  top: 0;
  left: 0;
  padding: 0.18em 0.55em;
  border: 1px solid var(--rule-strong);
  border-radius: 2px;
  background: rgba(8, 11, 20, 0.82);
  font-family: var(--font-mono);
  font-size: 0.66rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--ink-faint);
  white-space: nowrap;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.18s ease, border-color 0.18s ease, color 0.18s ease;
}

.vaisseau__etiq[data-allume='true'] {
  border-color: var(--accent);
  color: var(--accent-ink);
}

.vaisseau__attente,
.vaisseau__repli {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  max-width: 26rem;
  margin: 0;
  padding: var(--space-sm);
  font-family: var(--font-mono);
  font-size: 0.78rem;
  line-height: 1.6;
  color: var(--ink-faint);
  text-align: center;
}

.vaisseau__repli strong { display: block; margin-bottom: 0.4em; color: var(--alert); }

/* --- Le plan du navire : le repli utile, et la voie sans souris ----------- */

.vaisseau__plan {
  position: absolute;
  top: 0;
  right: 0;
  width: 15.5rem;
  max-height: 100%;
  overflow-y: auto;
  padding: 0.9rem 0.9rem 1rem;
  background: linear-gradient(to left, rgba(8, 11, 20, 0.9), rgba(8, 11, 20, 0.55) 80%, transparent);
}

.vaisseau__plan-titre {
  margin: 0 0 0.6rem;
  font-family: var(--font-mono);
  font-size: 0.6rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--ink-faint);
}

.vaisseau__plan ul { margin: 0; padding: 0; list-style: none; display: grid; gap: 2px; }

.vaisseau__plan-btn {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
  width: 100%;
  padding: 0.45em 0.6em;
  border: 1px solid transparent;
  border-left: 2px solid var(--rule-strong);
  border-radius: 2px;
  background: transparent;
  font: inherit;
  text-align: left;
  cursor: pointer;
  transition: background 0.15s ease, border-color 0.15s ease;
}

.vaisseau__plan-btn:hover,
.vaisseau__plan-btn:focus-visible { background: rgba(42, 191, 255, 0.09); border-color: var(--rule-strong); }
.vaisseau__plan-btn:focus-visible { outline: 2px solid var(--accent); outline-offset: 1px; }
.vaisseau__plan-btn[data-actif='true'] { border-left-color: var(--accent); background: rgba(42, 191, 255, 0.12); }

.vaisseau__plan-nom {
  font-family: var(--font-mono);
  font-size: 0.72rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--ink);
}

.vaisseau__plan-btn[data-actif='true'] .vaisseau__plan-nom { color: var(--accent-ink); }

.vaisseau__plan-lieu { font-size: 0.66rem; color: var(--ink-faint); }

/* --- Le HUD ------------------------------------------------------------- */

.vaisseau__hud {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 15.5rem;
  padding: var(--space-sm);
  background: linear-gradient(to top, rgba(8, 11, 20, 0.94), rgba(8, 11, 20, 0.5) 72%, transparent);
  pointer-events: none;
}

.vaisseau__hud > * { pointer-events: auto; }

.vaisseau__cap {
  display: flex;
  align-items: baseline;
  gap: 0.6em;
  flex-wrap: wrap;
  margin: 0 0 0.5rem;
  color: var(--ink);
}

.vaisseau__cap i {
  align-self: center;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--accent);
  animation: vaisseau-souffle 2.6s ease-in-out infinite;
}

.vaisseau__cap span { font-weight: 600; font-size: 1rem; }
.vaisseau__cap em { font-style: normal; font-size: 0.8rem; color: var(--ink-soft); }

.vaisseau__ordre {
  margin: 0 0 0.7rem;
  font-size: 0.8rem;
  color: var(--ink-soft);
  min-height: 1.3em;
}

.vaisseau__gestes { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 0.6rem; }

.vaisseau__btn {
  min-height: 46px;                       /* une cible qu'un pouce atteint */
  padding: 0.65em 1.2em;
  border: 1px solid var(--rule-strong);
  border-radius: 3px;
  background: rgba(8, 11, 20, 0.6);
  color: var(--ink);
  font: inherit;
  font-size: 0.85rem;
  cursor: pointer;
  transition: background 0.15s ease, border-color 0.15s ease;
}

.vaisseau__btn:hover { border-color: var(--accent); }
.vaisseau__btn:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
.vaisseau__btn--petit { min-height: 38px; padding: 0.45em 0.9em; font-size: 0.78rem; }

.vaisseau__btn--fort { border-color: var(--action); color: var(--action); }
.vaisseau__btn--fort:hover { background: rgba(255, 230, 80, 0.1); }
.vaisseau__btn--actif { border-color: var(--accent); background: rgba(42, 191, 255, 0.1); color: var(--accent-ink); }

.vaisseau__manette {
  margin: 0;
  font-size: 0.72rem;
  line-height: 1.5;
  color: var(--ink-faint);
}

.vaisseau__manette b { color: var(--accent-ink); font-weight: 600; }
.vaisseau__manette[data-presente='oui'] b { color: var(--action); }

/* --- Le bord pilotable --------------------------------------------------- */

.vaisseau__bord {
  position: absolute;
  top: 0;
  left: 0;
  right: 15.5rem;
  display: flex;
  align-items: flex-end;
  gap: 1.2rem;
  flex-wrap: wrap;
  padding: 0.8rem var(--space-sm);
  background: linear-gradient(to bottom, rgba(8, 11, 20, 0.88), transparent);
}

.vaisseau__chiffres {
  display: flex;
  gap: 1.4rem;
  flex-wrap: wrap;
  margin: 0;
  padding: 0;
  list-style: none;
}

.vaisseau__chiffres li { display: flex; flex-direction: column; gap: 0.15rem; min-width: 9rem; }
.vaisseau__chiffres > li > span:first-child { font-size: 0.7rem; color: var(--ink-faint); }

.vaisseau__chiffres b {
  font-family: var(--font-mono);
  font-size: 1.05rem;
  font-weight: 600;
  color: var(--accent);
  font-variant-numeric: tabular-nums;
}

.vaisseau__chiffres b[data-alerte='true'] { color: var(--alert); }

.vaisseau__jauge { display: block; height: 3px; border-radius: 99px; background: var(--rule); overflow: hidden; }
.vaisseau__jauge i { display: block; height: 100%; border-radius: 99px; background: var(--accent); transition: width 0.4s ease; }

.vaisseau__bord-gestes { display: flex; gap: 0.5rem; flex-wrap: wrap; }

.vaisseau__aveu {
  flex: 1 1 100%;
  margin: 0;
  font-size: 0.66rem;
  line-height: 1.5;
  color: var(--ink-faint);
}

.vaisseau__legende {
  position: absolute;
  left: 0;
  bottom: 0;
  display: flex;
  gap: var(--space-sm);
  padding: 0.5rem var(--space-sm);
  font-family: var(--font-mono);
  font-size: 0.58rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--ink-faint);
  pointer-events: none;
  opacity: 0.65;
}

.vaisseau__legende i {
  display: inline-block;
  width: 6px;
  height: 6px;
  margin-right: 0.5em;
  border-radius: 50%;
  background: var(--accent);
  vertical-align: middle;
}

@keyframes vaisseau-souffle {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}

/* --- Le format ----------------------------------------------------------- */

@media (max-width: 1100px) {
  .vaisseau__plan { width: 12.5rem; }
  .vaisseau__hud, .vaisseau__bord { right: 12.5rem; }
}

@media (max-width: 860px) {
  /* Sur un téléphone, la 3D passe au-dessus et le plan devient une liste
     pleine largeur : on ne superpose pas deux choses illisibles. */
  .vaisseau__plan {
    position: static;
    width: auto;
    max-height: none;
    background: none;
    border-top: 1px solid var(--rule);
  }
  .vaisseau {
    height: auto !important;
  }
  .vaisseau__toile { height: 58vh; }
  .vaisseau__hud, .vaisseau__bord {
    position: static;
    right: auto;
    background: none;
    border-top: 1px solid var(--rule);
  }
  .vaisseau__bord { display: block; }
  .vaisseau__chiffres { margin-bottom: 0.7rem; }
  .vaisseau__chiffres li { min-width: 7rem; }
  .vaisseau__legende { display: none; }
  .vaisseau__btn { flex: 1 1 100%; }
  .vaisseau__bord-gestes { margin-bottom: 0.6rem; }
}

@media (prefers-reduced-motion: reduce) {
  .vaisseau__cap i { animation: none; }
  .vaisseau__jauge i { transition: none; }
  .vaisseau__etiq { transition: none; }
}
</style>
