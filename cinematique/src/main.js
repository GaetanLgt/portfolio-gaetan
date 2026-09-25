// main.js — GL Digital Lab · site cinématique · 25/09/2026
// Actes 1-3 : séquence d'images pilotée au défilement. Actes 4-8 : scène 3D (navire, Yggdrasil).
// Tout l'aléatoire vient de la graine (graine.json → 42). Aucun tirage hors graine. Aucun CDN.
import { creerGraine, CANON, nuance } from './graine.js';
import { PIECES, construireArmure, brancherOeufs, armureTrouvee, oublierArmure } from './armure.js';
// ⭐ LE LÉVIATHAN — même méthode : modélisé, pas généré. Il n'était qu'une SPHÈRE de 26 unités
//    (« Léviathan devant la proue et au loin » au canon, et un placeholder dans le code).
import { construireLeviathan } from './leviathan.js';
// ⭐ LE TIROIR DES PÔLES D'EXPERTISE — ajouté le 26/09/2026, proposé par Gaëtan. Il vit dans son
//    propre module : il ne dépend de rien, et il se retire en supprimant cette ligne.
import { preparerSecteurs } from './secteurs.js';
// ⭐ LE BOUTON « COPIER L'ADRESSE » — ajouté le 26/09/2026 (audit externe, code reformulé). Même
//    règle que le tiroir : un module à part, qui ne dépend de rien et se retire en une ligne.
import { preparerCopieAdresse } from './copier-adresse.js';

const G = creerGraine(42);
// ⛔ INTERRUPTEUR D'ANIMATIONS — ajouté le 25/09/2026. La préférence SYSTÈME ne suffit pas :
// `prefers-reduced-motion` est un réglage de POSTE, pas de SITE. Un visiteur peut vouloir réduire
// les animations ICI — batterie, GPU qui chauffe, inconfort ponctuel — sans changer tout son
// ordinateur. On lit donc AUSSI un choix explicite, gardé dans le navigateur.
// ⚠️ REDUIT reste lue UNE SEULE FOIS, au chargement : elle commande SEPT endroits (le fond animé,
// la 3D, la séquence d'images, la révélation, l'initialisation, la boucle, les repères). La
// basculer à chaud obligerait à tout réinitialiser — un demi-correctif laisserait des animations
// actives. Le bouton écrit le choix puis RECHARGE, comme « Tout oublier » le fait pour l'armure.
const PREF_ANIM = 'gl-animations';
const choixAnim = (() => { try { return localStorage.getItem(PREF_ANIM); } catch { return null; } })();
const REDUIT = matchMedia('(prefers-reduced-motion: reduce)').matches || choixAnim === 'reduit';
const N_IMAGES = 118;
const $ = (s) => document.querySelector(s);
const actes = [...document.querySelectorAll('[data-act]')];
const fond = $('#fond'), ctx = fond.getContext('2d');

// ─── L'OUVERTURE — la vidéo du capitaine (acte 1) ──────────────────────────────
// ⭐ L'OUVERTURE — une SÉQUENCE D'IMAGES, plus un fichier vidéo (corrigé le 26/09/2026).
//    Le contrôle refuse tout `.mp4` dans `public/` (poids et droits) et plafonne `public/`
//    à 25 Mio : la vidéo de 6,79 Mo faisait tomber les deux règles d'un seul coup.
//    ⭐ LA RÈGLE DE REMPLACEMENT VIENT DE LA RÉFÉRENCE, pas de moi — tutoriel Antigravity +
//    TestSprite, 10:00 : « le fichier vidéo est encore trop large […] Optimisez la vidéo
//    pour une lecture fluide au défilement. Si une séquence d'images performe mieux,
//    utilisez cela en le répliquant. Rendez la qualité visuelle aussi proche que possible
//    de l'original. »
//    ⇒ 128 images 1280×720 à 15 i/s = 3,56 Mio.
// ⭐ LE MONTAGE A ÉTÉ REFAIT LE 26/09 APRÈS LA RÉVISION DE NÉO — quatre reproches, quatre
//    corrections mesurées : ① c'était FLOU (960×540 étirée ×2 sur un écran 1920) → 1280×720 ;
//    ② ça SACCADAIT (10 i/s pour une vidéo qui en faisait 24) → 15 i/s ;
//    ③ le FILIGRANE « KlingAI 3.0 Omni » était visible → l'image est recadrée 1778×1000 depuis
//       x=71, ce qui le coupe par la GÉOMÉTRIE (mesuré avant : x 1609→1881, y 1010→1047) ;
//    ④ les plans 4,5→7,5 s et 9 s étaient pleins d'interfaces et de faux textes
//       (« GLAB NUMÉRIQUE »), contraires à la règle « supprimer UI et textes indésirables »
//       → RETIRÉS, et un fondu de 0,4 s raccorde le samouraï au galion.
//    ⛔ SOUS REDUIT, RIEN DE PLUS N'EST DEMANDÉ QUE L'IMAGE DU HTML : ~25 Ko, une image, et
//    jamais la séquence. *Épargner à l'écran sans épargner en données n'est pas épargner.*
// ⭐ L'OUVERTURE EST DESSINÉE SUR LE CANVAS (corrigé le 26/09/2026 — « ça lag »).
//    ⛔ CE QUI LAGAIT : la première version réassignait `img.src` quinze fois par seconde avec
//    des images de 1920×1080. Réassigner un `src` fait RE-CHERCHER le fichier et RE-DÉCODER
//    2 mégapixels — quinze fois par seconde — et refait la mise en page à chaque fois.
//    Ce n'est pas l'ouverture qui saccadait : c'était le site entier.
//    ⇒ Les images sont DÉJÀ en mémoire : `prechargerSequence()` charge `ouverture/oNNNN.webp`
//      dans `images[]`. On les DESSINE. `drawImage` sur une image déjà décodée ne coûte
//      presque rien, et ne touche pas à la mise en page.
//    ⛔ L'image du HTML RESTE, et elle sert : sans JavaScript et sous animations réduites,
//      c'est elle qu'on voit — une seule image, et la séquence n'est jamais demandée.
const imageOuverture = $('#ouverture-image');
const boutonSon = $('#ouverture-son');
const N_OUVERTURE = 118, IPS_OUVERTURE = 15;
let indiceOuverture = 0;
if (imageOuverture && !REDUIT) {
  imageOuverture.style.display = 'none'; // le canvas prend le relais
  // ⭐ Elle joue AU TEMPS quand l'acte 1 est à l'écran, et SEULEMENT là : partout ailleurs,
  //    c'est le défilement qui commande la séquence.
  const jouerOuverture = (t) => {
    if (acteCourant() === 1) {
      if (t - jouerOuverture.dernier >= 1000 / IPS_OUVERTURE) {
        jouerOuverture.dernier = t;
        indiceOuverture = (indiceOuverture + 1) % N_OUVERTURE;
        if (images[indiceOuverture]) image();
      }
    } else jouerOuverture.dernier = t;
    requestAnimationFrame(jouerOuverture);
  };
  jouerOuverture.dernier = 0;
  requestAnimationFrame(jouerOuverture);
}
if (boutonSon && !REDUIT) {
  // ⛔ LE SON SE CHARGE AU CLIC, PAS AVANT. `ouverture-son.mp3` fait 103 Ko : il n'est
  //    demandé qu'au premier appui. Un fichier qu'on n'écoute pas ne se télécharge pas.
  // ⭐⭐ ET LE VOLUME SE RÈGLE — ajouté le 26/09/2026. Gaëtan : « c'est bien de pouvoir l'activer
  //    mais ça déchire les oreilles ». Il n'avait qu'un interrupteur : couper, ou subir.
  //    ⇒ Le son démarre à 30 %, et un curseur permet de doser à tout moment — y compris PENDANT
  //      la lecture, parce qu'un réglage qu'on doit couper pour ajuster n'est pas un réglage.
  let audio = null;
  const curseurVolume = $('#ouverture-volume-curseur');
  const boiteVolume = document.querySelector('.ouverture-volume');
  const volumeVoulu = () => (curseurVolume ? Number(curseurVolume.value) / 100 : 0.3);
  boutonSon.hidden = false;
  if (boiteVolume) boiteVolume.hidden = false;
  if (curseurVolume) curseurVolume.addEventListener('input', () => { if (audio) audio.volume = volumeVoulu(); });
  boutonSon.addEventListener('click', () => {
    if (!audio) { audio = new Audio('ouverture-son.mp3'); audio.loop = true; audio.volume = volumeVoulu(); }
    const actif = boutonSon.getAttribute('aria-pressed') === 'true';
    if (actif) audio.pause(); else audio.play().catch(() => {});
    boutonSon.setAttribute('aria-pressed', actif ? 'false' : 'true');
    boutonSon.textContent = actif ? 'Activer le son' : 'Couper le son';
  });
}

// ---------- utilitaires ----------
const charger = (src) => new Promise((ok) => { const i = new Image(); i.decoding = 'async'; i.onload = () => ok(i); i.onerror = () => ok(null); i.src = src; });
// ⭐ PLAFONNÉ À 1,5 LE 26/09/2026 — MÊME VALEUR QUE LA 3D (ligne 182), ET MESURÉ AVANT DE CHANGER.
//    À 2, le canvas de fond faisait QUATRE FOIS le travail d'effacement et de repeinture d'un
//    canvas à 1,5, pour un détail que personne ne voit : la 3D, elle, était déjà plafonnée à 1,5
//    depuis l'audit mobile. Deux résolutions différentes dans le même cadre, c'était une
//    incohérence, pas un choix.
//    ⚠️ `dernierFond = ''` N'EST PAS DÉCORATIF : changer `canvas.width` VIDE le canvas. Sans cette
//       invalidation, la mémoïsation d'`image()` croirait le fond encore dessiné et le laisserait
//       BLANC après un redimensionnement. *Un cache qu'on ne vide pas au bon moment est un écran
//       vide qui se croit à jour.*
function taille() { const r = Math.min(devicePixelRatio || 1, 1.5); fond.width = innerWidth * r; fond.height = innerHeight * r; dernierFond = ''; }
function dessinerCouverture(img, decalY = 0) {
  if (!img) return;
  const s = Math.max(fond.width / img.width, fond.height / img.height) * 1.04;
  const w = img.width * s, h = img.height * s;
  ctx.drawImage(img, (fond.width - w) / 2, (fond.height - h) / 2 + decalY * fond.height * 0.02, w, h);
}
function progressionDans(debut, fin) { // 0..1 du haut de la section « debut » au bas de « fin »
  const a = actes[debut - 1].offsetTop, b = actes[fin - 1].offsetTop + actes[fin - 1].offsetHeight - innerHeight;
  return Math.min(1, Math.max(0, (scrollY - a) / Math.max(1, b - a)));
}
function acteCourant() {
  const m = scrollY + innerHeight / 2;
  for (let i = actes.length - 1; i >= 0; i--) if (actes[i].offsetTop <= m) return i + 1;
  return 1;
}

// ---------- séquence (actes 1 à 3) ----------
const images = new Array(N_IMAGES).fill(null);
// ⭐ UNE SEULE SÉQUENCE DEPUIS LE 26/09/2026. Elle servait deux fois : `sequence/` (240 images
//    de l'ANCIENNE génération, 12,74 Mio) portait le fond des actes 1 à 3, et `ouverture/`
//    (118 images) jouait l'ouverture. Néo a demandé de sortir les anciens actifs : les deux
//    sont devenues UNE — celle de sa nouvelle vidéo — et le fond des actes 1 à 3 est le même
//    que l'ouverture. Ce qui double la charge ne se voit pas ; ce qui la divise se mesure.
const nom = (i) => `ouverture/o${String(i + 1).padStart(4, '0')}.webp`;
let charges = 0; // combien d'images de la séquence sont arrivées — sert de clé à la mémoïsation
async function prechargerSequence() {
  // d'abord 1 image sur 8 (le défilement est tout de suite fluide), puis le reste
  const ordre = [...Array(N_IMAGES).keys()].sort((a, b) => (a % 8) - (b % 8) || a - b);
  for (const i of ordre) { images[i] = await charger(nom(i)); if (images[i]) charges++; }
}
function imageProche(i) {
  for (let d = 0; d < N_IMAGES; d++) { if (images[i - d]) return images[i - d]; if (images[i + d]) return images[i + d]; }
  return null;
}

// ---------- planches fixes (repli et actes 5, 8) ----------
const cles = {};
async function chargerCles() { for (const k of ['K1', 'K2', 'K3', 'K4', 'K5']) cles[k] = await charger(`cles/${k}.webp`); }

// ---------- révélation au curseur (acte 1) ----------
const rev = $('#revelation');
function preparerRevelation() {
  if (REDUIT) return;
  rev.style.backgroundImage = 'url(cles/K1-jour.webp), url(cles/K1.webp)';
  // ⭐ FILTRE RÉDUIT LE 26/09/2026, ET LA MESURE DIT POURQUOI. Il valait `brightness(1.7)`
  //    du temps où `cles/K1-jour.webp` N'EXISTAIT PAS : il servait de repli en éclaircissant
  //    K1 — le code le disait lui-même. L'image du jour existe maintenant, générée EN LOCAL
  //    (RealVisXL_V5, 1344x768, denoise 0.32, 10,2 s sur la 3080) et jugée sur comparaison :
  //    même personnage — cheveux en pointes, lunettes bleues, barbe, manteau à lignes cyan,
  //    même pose — avec un éclairage franchement plus clair.
  //    ⚠️ Cumuler le filtre d'éclaircissement ET l'image du jour surexposait la zone révélée :
  //    1,7 était le chiffre du repli, pas celui du résultat.
  rev.style.filter = 'brightness(1.05) saturate(1.05)';
  const suivre = (x, y) => { rev.style.setProperty('--x', x + 'px'); rev.style.setProperty('--y', y + 'px'); };
  addEventListener('pointermove', (e) => suivre(e.clientX, e.clientY), { passive: true });
  addEventListener('touchmove', (e) => { const t = e.touches[0]; if (t) suivre(t.clientX, t.clientY); }, { passive: true });
}

// ---------- scène 3D (actes 4 à 8) : le navire mis en valeur ----------
let trois = null;
async function preparer3D() {
  if (REDUIT) return;
  let THREE, GLTFLoader, RoomEnvironment;
  try {
    THREE = await import('three');
    ({ GLTFLoader } = await import('three/addons/loaders/GLTFLoader.js'));
    try { ({ RoomEnvironment } = await import('three/addons/environments/RoomEnvironment.js')); } catch { RoomEnvironment = null; }
  } catch { return; } // pas de moteur 3D : on reste sur les planches fixes
  const toile = $('#scene3d');
  let rendu;
  try { rendu = new THREE.WebGLRenderer({ canvas: toile, antialias: true, powerPreference: 'high-performance' }); } catch { return; }
  // ⭐ MOBILE : LA RÉSOLUTION BAISSE (audit du 26/09). Sur un écran étroit, rendre 1,5 fois la
  //    densité de pixels coûte le triple de fragments pour un détail que personne ne voit.
  //    En dessous de 700 px, on rend à la densité NATURELLE (1) — même image, trois fois moins
  //    de pixels à calculer. ⚠️ Les polygones, eux, ne changent pas : le maillage est le même,
  //    et le réduire demanderait un second modèle — c'est un choix, pas un réglage.
  rendu.setPixelRatio(innerWidth < 700 ? 1 : Math.min(devicePixelRatio || 1, 1.5));
  // ⭐ EXPOSITION RELEVÉE LE 26/09/2026 — MESURÉ, PAS JUGÉ. Les actes 4, 6, 7 et 8 sortaient à
  //    41 à 68 % de pixels PUREMENT NOIRS (moyenne 11,5 à 18,7 / 255). La scène 3D marchait :
  //    elle rendait du vide. *Un décor noir par manque de lumière n'est pas une direction
  //    artistique, c'est un réglage oublié.* Le canon dit « obscurité permanente, la seule
  //    lumière est celle du navire » : on garde l'obscurité, on rend le navire visible.
  rendu.toneMapping = THREE.ACESFilmicToneMapping; rendu.toneMappingExposure = 1.45;
  rendu.outputColorSpace = THREE.SRGBColorSpace;
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(CANON.fond);
  // ⚠️ 0.0011 écrasait tout au-delà de ~900 unités : le navire s'y noyait avant d'être vu.
  scene.fog = new THREE.FogExp2(CANON.fond, 0.0007);
  if (RoomEnvironment) { const pm = new THREE.PMREMGenerator(rendu); scene.environment = pm.fromScene(new RoomEnvironment(), 0.04).texture; 
    // ⛔ RELEVÉ DE 0.35 À 0.85 LE 26/09/2026 — « la texture, la couleur, les matériaux du
    //    vaisseau ne sont pas là ». CE N'ÉTAIT PAS LE MODÈLE : un métal n'a PAS de couleur
    //    propre, il n'a que ses RÉFLEXIONS. Avec `metalness = 0.9` et un environnement à 0.35,
    //    la coque n'avait presque rien à réfléchir — elle rendait un gris sombre et plat, et la
    //    texture devenait invisible. *Un métal sans environnement est un métal noir.*
    scene.environmentIntensity = 0.85; }
  const camera = new THREE.PerspectiveCamera(42, 1, 0.5, 6000);

  // étoiles (graine « etoiles »), deux couches pour la profondeur
  // ⭐ ÉTOILES AGRANDIES LE 26/09/2026 : 1,4 et 2,2 pixels sur un écran de 1920, ce n'est pas
  //    un ciel, c'est du bruit. Elles étaient invisibles à l'œil et ne remplissaient rien.
  const ge = G.pour('etoiles');
  for (const [n, rMin, rMax, taille] of [[2200, 1200, 2600, 2.4], [500, 700, 1100, 3.4]]) {
    const pos = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) { const r = ge.entre(rMin, rMax), t = ge.entre(0, Math.PI * 2), p = Math.acos(ge.entre(-1, 1));
      pos.set([r * Math.sin(p) * Math.cos(t), r * Math.cos(p), r * Math.sin(p) * Math.sin(t)], i * 3); }
    const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    scene.add(new THREE.Points(geo, new THREE.PointsMaterial({ color: nuance(CANON.cyan, G.pour('palette')), size: taille, sizeAttenuation: false, transparent: true, opacity: 0.85 })));
  }

  // halo doux (texture dessinée, rien de téléchargé)
  const halo = (couleur, taille) => { const c = document.createElement('canvas'); c.width = c.height = 128; const g = c.getContext('2d');
    const d = g.createRadialGradient(64, 64, 0, 64, 64, 64); d.addColorStop(0, couleur); d.addColorStop(1, 'transparent'); g.fillStyle = d; g.fillRect(0, 0, 128, 128);
    const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(c), blending: THREE.AdditiveBlending, depthWrite: false, transparent: true })); s.scale.setScalar(taille); return s; };

  // lumières : obscurité permanente, la seule lumière est celle du navire (canon § 19)
  scene.add(new THREE.HemisphereLight(0x2a3d5a, 0x05070c, 0.5));
  const cle = new THREE.DirectionalLight(0xbfd9ff, 1.1); cle.position.set(-120, 160, 220); scene.add(cle);
  const contour = new THREE.DirectionalLight(CANON.cyan, 1.6); contour.position.set(160, 60, -240); scene.add(contour); // liseré cyan
  const oracle = new THREE.PointLight(CANON.oracle, 40, 260, 1.6); scene.add(oracle);                                   // le cœur, violet
  const haloOracle = halo('rgba(155,92,255,.9)', 70); scene.add(haloOracle);

  const chargeur = new GLTFLoader();
  const glb = (u) => new Promise((ok) => chargeur.load(u, (g) => ok(g.scene), undefined, () => ok(null)));
  const [navire, arbre] = await Promise.all([glb('modeles/arkadia-navire.glb'), glb('modeles/yggdrasil.glb')]);

  // le navire : centré, mis à l'échelle, métal sombre, voiles lumineuses
  const pivot = new THREE.Group(); scene.add(pivot);
  let rayon = 60;
  if (navire) {
    const boite = new THREE.Box3().setFromObject(navire), dim = boite.getSize(new THREE.Vector3()), centre = boite.getCenter(new THREE.Vector3());
    const echelle = 130 / Math.max(dim.x, dim.y, dim.z); navire.scale.setScalar(echelle); navire.position.copy(centre).multiplyScalar(-echelle);
    navire.traverse((o) => {
      if (!o.isMesh) return; const m = o.material; if (!m || !m.color || !m.isMeshStandardMaterial) return; // matériaux sans éclairage (unlit) : on n'y touche pas
      // ⛔ `DoubleSide` FORCÉ LE 26/09/2026 — « le modèle 3D a des trous ! ». DEUX causes, et
      //    celle-ci ne coûte rien : une coque est faite de surfaces MINCES, et une face dont la
      //    normale pointe à l'envers est ÉLIMINÉE par le culling — on voit alors à travers,
      //    ce qui se lit exactement comme un trou. `DoubleSide` la rend visible des deux côtés.
      //    ⚠️ L'autre cause est réelle et ne se corrige pas ici : la décimation à 40 000
      //    triangles (4 % de l'original) perce le maillage. On monte à 60 000 en même temps.
      m.side = THREE.DoubleSide;
      const { r, g, b } = m.color, lum = 0.3 * r + 0.59 * g + 0.11 * b;
      if (m.transparent && m.opacity < 0.6) { m.emissive = m.color.clone(); m.emissiveIntensity = 0.9; m.depthWrite = false; m.side = THREE.DoubleSide; } // voiles de lumière
      else if (lum < 0.3) { m.metalness = 0.9; m.roughness = 0.38; }                                                       // coque de métal
      else if (b > r && b > g) { m.emissive = m.color.clone(); m.emissiveIntensity = 0.6; }                                // lignes cyan
    });
    pivot.add(navire); rayon = 65;
    // ⛔ LA FIGURE DE PROUE A ÉTÉ RETIRÉE LE 26/09/2026, SUR DEMANDE DE NÉO : « le kraken à
    //    enlever ». Le kraken modélisé (tête sombre, deux yeux en or, tentacules) a vécu un
    //    tour de piste, a été regardé sur capture, et il ne reste pas.
    //    ⚠️ SIGNALÉ, PARCE QUE ÇA CONTREDIT L'ÉCRIT : le canon du 22/09/2026 dit « la figure de
    //    proue est UN KRAKEN À TÊTE DE MORT ». Sans elle, **le navire n'a plus de figure de
    //    proue** — ce n'est pas un retour à l'état d'avant, c'est un état qui n'a jamais existé.
    //    ⇒ `public/src/kraken.js` reste sur le disque, intact et non importé : il sera là le
    //      jour où la décision reviendra, ou quand le modèle sera meilleur (mâchoire et dents
    //      lisibles, tentacules moins « araignée » — c'est écrit dans la note du 26/09).
  }
  oracle.position.set(0, 4, 0); haloOracle.position.copy(oracle.position);
  pivot.add(oracle); pivot.add(haloOracle);
  if (arbre) { arbre.position.set(-900, -200, -2000); arbre.scale.setScalar(1.6); scene.add(arbre); const h = halo('rgba(42,191,255,.35)', 900); h.position.set(-900, 250, -2050); scene.add(h); }
  // ⭐ LE LÉVIATHAN, MODÉLISÉ LE 26/09/2026 — il était une SPHÈRE (`SphereGeometry(26)`).
  //    Le canon dit « devant la proue et au loin » : il est loin, il est sombre, et ce qui le
  //    révèle sont ses veines bioluminescentes vertes. Il est tourné vers le navire.
  const leviathan = construireLeviathan(THREE);
  leviathan.scale.setScalar(7);
  leviathan.position.set(170, 58, 760);
  leviathan.rotation.y = -2.1;
  scene.add(leviathan); // canon 24/09 : devant la proue, au loin
  const haloLeviathan = halo('rgba(44,227,155,.20)', 420); haloLeviathan.position.set(170, 58, 760); scene.add(haloLeviathan);

  // L'Armure du Capitaine : générée par la graine, à côté du navire ; les pièces non trouvées restent en fil de fer
  const arm = construireArmure(THREE, G.pour('armure'));
  const socle = new THREE.Mesh(new THREE.RingGeometry(1.1, 1.25, 6), new THREE.MeshBasicMaterial({ color: CANON.cyan, transparent: true, opacity: 0.5, side: THREE.DoubleSide }));
  socle.rotation.x = -Math.PI / 2; arm.groupe.add(socle);
  // ⛔ L'ARMURE EST REPOSITIONNÉE LE 26/09/2026 — « l'armure à refaire et à mettre PROPREMENT
  //    dans la page ». MESURÉ : elle était posée à (−29, −10, 123) pour un navire de 130 unités,
  //    soit `rayon*1.9` en profondeur. Or le rail de caméra a été rapproché le MÊME jour
  //    (R = rayon*0.55) : la caméra se promène maintenant entre 43 et 68 unités du centre.
  //    **L'armure était DERRIÈRE elle** — elle ne revenait dans le cadre que par le décalage
  //    latéral, d'où une boule de fil de fer coupée au bord gauche de la page.
  //    ⚠️ Position en fraction de `rayon` et NON de `R` : l'armure est créée AVANT `R`, et
  //    s'appuyer sur `R` ici serait une variable non initialisée — le piège est silencieux.
  arm.socle = socle;
  scene.add(arm.groupe);
  // ⛔ L'ARMURE EST NORMALISÉE PAR SA BOÎTE, LE 26/09/2026 — et c'est un correctif de MON fait.
  //    En la redessinant (pièces écartées pour qu'aucune n'en recouvre une autre), sa hauteur
  //    locale est passée de 3,35 à 6,35. À `scale 8`, elle mesurait donc **48 unités et montait
  //    jusqu'à y≈45** : au-dessus du cadre, invisible — la capture ne la montrait plus.
  //    *Un chiffre d'échelle écrit à la main redevient faux dès qu'on redessine le modèle.*
  //    ⇒ On MESURE la boîte et on ramène l'armure à 26 unités, centrée sur sa propre place.
  const ba = new THREE.Box3().setFromObject(arm.groupe), da = ba.getSize(new THREE.Vector3()), ca = ba.getCenter(new THREE.Vector3());
  const echArmure = 26 / Math.max(da.x, da.y, da.z);
  arm.groupe.scale.setScalar(echArmure);
  arm.groupe.position.set(-rayon * 0.62 - ca.x * echArmure, -4 - ca.y * echArmure, rayon * 0.30 - ca.z * echArmure);
  const feu = new THREE.PointLight(CANON.cyan, 6, 40, 1.5); feu.position.set(0, 3, 2.5); arm.groupe.add(feu); arm.feu = feu;
  const trouvees = armureTrouvee(); PIECES.forEach((p) => arm.montrer(p.id, trouvees.includes(p.id)));
  armure3D = arm; majArmure3D(trouvees);

  // rail de caméra (graine « camera », ±2 %) autour du navire + léger regard à la souris
  // ⭐ RECUL RÉGLÉ À 0,80 LE 26/09/2026 — TROISIÈME ESSAI, ET LES DEUX PREMIERS SE MESURENT.
  //    ① `rayon` (1,0) : la caméra à 2,2-3,4 fois le navire → une silhouette perdue dans 68 %
  //       de noir. ② `rayon * 0.55` : la caméra ENTRE dans la coque — la capture de l'acte 8
  //       ne montre plus qu'un mur de tôle verte, et l'armure sort du cadre. ③ 0,80 : le navire
  //       se lit ENTIER (130 unités vues de ~57 à 89) et l'armure, posée à 40 unités sur la
  //       gauche, tient dans le même cadre. *Deux mesures, deux corrections, et la bonne est
  //       entre les deux — c'est exactement ce qu'un chiffre seul ne dit pas.*
  const gc = G.pour('camera'), j = (v) => v * (1 + gc.entre(-0.02, 0.02)), R = rayon * 0.80;
  const rail = new THREE.CatmullRomCurve3([
    new THREE.Vector3(j(3.2 * R), j(1.1 * R), j(-2.6 * R)), new THREE.Vector3(j(2.2 * R), j(0.4 * R), j(0.6 * R)),
    new THREE.Vector3(j(-1.6 * R), j(0.3 * R), j(1.8 * R)), new THREE.Vector3(j(-2.4 * R), j(0.9 * R), j(-1.2 * R)), new THREE.Vector3(j(0.6 * R), j(0.35 * R), j(3.4 * R)) ]);
  const cible = new THREE.Vector3(0, 6, 0), regard = { x: 0, y: 0 };
  addEventListener('pointermove', (e) => { regard.x = (e.clientX / innerWidth - 0.5) * 2; regard.y = (e.clientY / innerHeight - 0.5) * 2; }, { passive: true });

  function redimensionner() { rendu.setSize(innerWidth, innerHeight, false); camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix(); }
  redimensionner(); addEventListener('resize', redimensionner);
  // navigation fluide : la caméra rejoint le défilement avec amortissement, et le navire se place du côté libre de la carte
  let tLisse = 0, decalage = 0;
  trois = { toile, rendre(t) {
    const s = performance.now() / 1000;
    tLisse += (t - tLisse) * 0.06;
    const cote = acteCourant() % 2 === 0 ? -1 : 1; // acte pair : carte à droite → navire à gauche
    decalage += (cote * innerWidth * 0.2 - decalage) * 0.05;
    // ⛔ RETOUR EN ARRIÈRE, ET LA RAISON EST MESURÉE. J'ai remplacé ce `setViewOffset` par une
    //    translation de caméra pour faire taire l'avertissement WebGL « destination rect smaller
    //    than the viewport rect ». **Résultat : le navire est passé DERRIÈRE le panneau de
    //    texte** — la capture le montre, il est à droite, à moitié caché. Mon signe était
    //    inversé, et la translation ne reproduit pas la projection décalée.
    //    ⇒ On ne remplace pas un mécanisme qui marche pour supprimer un AVERTISSEMENT : celui-ci
    //      est inoffensif (il n'est donné qu'une fois), le cadrage ne l'était pas.
    camera.setViewOffset(innerWidth, innerHeight, -decalage, 0, innerWidth, innerHeight);
    t = tLisse;
    pivot.position.y = Math.sin(s * 0.6) * 1.6; pivot.rotation.z = Math.sin(s * 0.4) * 0.025; pivot.rotation.x = Math.sin(s * 0.33) * 0.015; // il flotte
    rail.getPointAt(t, camera.position); camera.position.x += regard.x * 6; camera.position.y -= regard.y * 4; camera.lookAt(cible);
    arm.groupe.rotation.y = s * 0.25; arm.pieces.coeur.rotation.y = s * 1.2; // l'armure tourne lentement, le cœur bat
    oracle.intensity = 36 + Math.sin(s * 1.4) * 8; haloOracle.material.opacity = 0.75 + Math.sin(s * 1.4) * 0.2; // ORACLE bat
    rendu.render(scene, camera);
  } };
}

// ---------- façade vidéos : rien n'est chargé depuis YouTube avant le clic ----------
// ⛔ AMÉLIORÉ LE 25/09/2026 sur un point de l'audit externe, et il était juste : le bouton ne
// disait RIEN de ce qui se passait après le clic. Pas d'état, pas de secours, pas d'information
// sur ce que le clic transmet — et un visiteur devant une façade figée ne sait pas si ça
// travaille ou si c'est cassé.
function facades() {
  document.querySelectorAll('.facade').forEach((b) => b.addEventListener('click', () => {
    const video = b.dataset.video;
    if (!video) { open(b.dataset.chaine, '_blank', 'noopener'); return; }

    const boite = document.createElement('div');
    boite.className = 'facade-boite';
    const f = document.createElement('iframe');
    f.src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(video)}?autoplay=1`;
    f.title = 'Vidéo'; f.allow = 'autoplay; encrypted-media; picture-in-picture'; f.allowFullscreen = true;
    f.style.cssText = 'width:100%;aspect-ratio:16/9;border:0';
    const etat = document.createElement('p');
    etat.className = 'facade-etat';
    etat.setAttribute('role', 'status');       // annoncé aux lecteurs d'écran sans voler le focus
    etat.textContent = 'Chargement de la vidéo…';
    boite.append(f, etat);
    // ⚠️ Une iframe ne déclenche pas `error` de façon fiable : on se fie à `load`, et le VRAI
    //    filet est le lien externe posé sous la vidéo — pas un gestionnaire d'erreur qui
    //    n'arriverait jamais.
    // ⚠️ LE SECOURS POINTE VERS LA CHAÎNE, PAS VERS /watch — et ce n'est pas un détail :
    //    la règle du contrôle (tests/controle.js:55) n'autorise que `youtube-nocookie.com` et
    //    `youtube.com/@`. Une première version pointait vers `youtube.com/watch` : le verrou l'a
    //    REFUSÉE, à juste titre, et il avait raison de le faire. Et l'audit demandait bien
    //    « un lien externe alternatif vers la CHAÎNE » — c'est ce que porte `data-chaine`.
    const chaine = b.dataset.chaine || null;
    f.addEventListener('load', () => {
      etat.innerHTML = (chaine ? '<a href="' + chaine + '" target="_blank" rel="noopener">Voir la chaîne du studio sur YouTube</a> — ' : '')
        + '<small>si la vidéo reste noire, c\'est ce lien qui marche. Le chargement peut transmettre votre adresse IP et des données de navigation à YouTube (Google) ; le reste du site ne charge rien avant ce clic.</small>';
    });
    b.replaceWith(boite);
  }));
}

// ---------- boucle ----------
let enAttente = false;
let dernierFond = '';     // ce qui est DESSINÉ sur le canvas de fond — la clé de la mémoïsation d'`image()`
let trame = 0;            // l'identifiant de la boucle 3D : 0 quand elle est ARRÊTÉE
let troisDemande = false; // la 3D n'est demandée qu'une fois, et seulement quand elle approche
let armure3D = null; // renseigné par preparer3D si la 3D est disponible
function image() {
  enAttente = false;
  const a = acteCourant();
  // ⭐ ON NE REDESSINE QUE SUR CHANGEMENT RÉEL — 26/09/2026, ET C'EST LA CORRECTION DE FOND.
  //    `image()` était appelée 60 fois par seconde, y compris par la boucle 3D, alors que la
  //    séquence est à 15 images par seconde : on effaçait et on repeignait tout le canvas
  //    quarante-cinq fois par seconde pour rien. `quoi` porte EXACTEMENT ce qui décide du dessin,
  //    et rien de plus — c'est ce qui évite les deux pièges : trop peu (l'image ne se met plus à
  //    jour) et trop (on ne gagne rien).
  //    ⚠️ LA 3D N'EST PAS DANS LA CLÉ, ET C'EST VOLONTAIRE : `trois.rendre` a sa PROPRE horloge
  //       (`performance.now()` — le navire flotte, l'armure tourne, ORACLE bat) et sa caméra est
  //       amortie (`tLisse`). Sauter `rendre` pour gagner une image FIGERAIT la scène. Le fond est
  //       mémoïsé, la 3D ne l'est pas.
  let quoi;
  if (REDUIT) quoi = 'reduit|' + a;
  else if (a === 1) quoi = 'ouverture|' + indiceOuverture + '|' + charges;
  else if (a <= 3) quoi = 'sequence|' + Math.round(progressionDans(1, 3) * (N_IMAGES - 1)) + '|' + charges;
  else if (!trois) quoi = 'sans3d|' + a + '|' + Math.round(progressionDans(4, 8) * 60);
  else if (a === 5 && cles.K5) quoi = 'k5|' + Math.round(progressionDans(5, 5) * 60);
  else quoi = 'plat|' + a;
  if (quoi !== dernierFond) {
    dernierFond = quoi;
    ctx.fillStyle = CANON.fond; ctx.fillRect(0, 0, fond.width, fond.height);
    if (REDUIT) dessinerCouverture(cles[['K1', 'K2', 'K3', 'K3', 'K5', 'K5', 'K4', 'K4'][a - 1]] || cles.K1);
    else if (a === 1) {
      // ⭐ L'OUVERTURE SE DESSINE AU TEMPS — l'indice avance dans `jouerOuverture`, 15 fois par
      //    seconde, et cette fonction ne fait plus que le dessiner. Une seule surface, un seul
      //    préchargement, aucune mise en page touchée.
      dessinerCouverture(imageProche(indiceOuverture) || cles.K1);
    } else if (a <= 3) {
      const p = progressionDans(1, 3), i = Math.round(p * (N_IMAGES - 1));
      dessinerCouverture(imageProche(i) || cles.K1);
    } else if (!trois) dessinerCouverture(a === 5 ? (cles.K5 || cles.K4) : cles.K4, progressionDans(4, 8));
    else if (a === 5 && cles.K5) dessinerCouverture(cles.K5, progressionDans(5, 5));
  }
  if (REDUIT) return; // en mode réduit il n'y a ni révélation au curseur ni 3D
  rev.style.opacity = a === 1 ? '1' : '0';
  if (trois) {
    const entree = Math.min(1, Math.max(0, (scrollY + innerHeight - actes[3].offsetTop) / innerHeight)); // fondu d'une hauteur d'écran avant l'acte 4
    const montre = entree > 0 && !(a === 5 && cles.K5);
    trois.toile.style.opacity = montre ? String(a >= 4 ? 1 : entree) : '0';
    if (montre) trois.rendre(progressionDans(4, 8));
  }
}
// ⭐ LA BOUCLE NE TOURNE PLUS À VIDE — 26/09/2026. Elle démarrait avec `preparer3D()`, donc AVANT
//    que la 3D existe à l'écran, et demandait une image soixante fois par seconde pour ne rien
//    faire avant l'acte 3. Un `requestAnimationFrame` qui ne dessine rien empêche quand même le
//    navigateur de se reposer, et il tournait du premier pixel jusqu'à l'acte 3.
//    ⇒ Elle DÉMARRE à l'approche de l'acte 3, et elle S'ARRÊTE toute seule dès qu'elle n'a plus
//      rien à animer (retour en arrière, mode réduit). Aucun drapeau à éteindre à la main : la
//      condition de sortie est la même que la condition d'entrée, c'est ce qui évite la boucle
//      qu'on croit arrêtée.
function boucle3D() {
  trame = 0;
  if (!trois || REDUIT || acteCourant() < 3) { demander(); return; }
  image();
  trame = requestAnimationFrame(boucle3D);
}
const demander = () => {
  const a = acteCourant();
  // ① le visiteur DÉFILE vers l'acte 3 : c'est le bon moment pour commencer à charger le navire.
  if (a >= 2) demander3D();
  // À partir de l'acte 3, c'est la boucle qui pilote le dessin : la caméra dépend du défilement,
  // donc l'image doit être refaite à chaque image — et `image()` ne refait le fond que s'il a
  // changé. Avant l'acte 3, un seul dessin suffit : on ne réveille pas la boucle pour rien.
  if (trois && !REDUIT && a >= 3) { if (!trame) trame = requestAnimationFrame(boucle3D); return; }
  if (!enAttente) { enAttente = true; requestAnimationFrame(image); }
};
// ⭐ LA 3D ARRIVE QUAND ELLE APPROCHE — ET PLUS AU DÉMARRAGE (26/09/2026). MESURÉ AVANT : le
//    navigateur téléchargeait 13,5 Mio de modèle avant d'afficher quoi que ce soit, alors que le
//    navire n'apparaît qu'à l'acte 4. Les trois textures PNG représentaient 12,9 Mio de ces 13,5.
//    ⇒ `demander3D()` est appelé ① quand le visiteur approche de l'acte 3 (il défile), et
//      ② une fois la séquence entièrement préchargée, au repos — le premier écran est alors déjà
//      peint, et le visiteur ne paie plus le modèle avant de voir quelque chose.
function demander3D() {
  if (troisDemande || REDUIT) return;
  troisDemande = true;
  preparer3D().then(() => demander());
}

preparerTextes();
preparerArmure();
taille();
addEventListener('resize', () => { taille(); demander(); });
addEventListener('scroll', demander, { passive: true });
facades();
preparerRevelation();
// ⭐ le tiroir des pôles d'expertise (secteurs.js) — il s'installe en dernier, quand le DOM est là
preparerSecteurs();
// ⭐ et le bouton « copier l'adresse » de l'acte 8, sur le même principe d'installation tardive
preparerCopieAdresse();
await chargerCles(); demander();
// ⚠️ AVANT le `if (!REDUIT)` ci-dessous, et c'est le point : en mode réduit il faut POUVOIR
// REVENIR. Un interrupteur branché à l'intérieur du bloc laisserait le visiteur coincé.
preparerInterrupteurAnimations();
// ⭐ LE PREMIER ÉCRAN D'ABORD, LA 3D ENSUITE — 26/09/2026. Cette ligne appelait `preparer3D()` au
//    démarrage : le navigateur téléchargeait le modèle du navire (13,5 Mio) et construisait le
//    contexte WebGL AVANT que le visiteur ait vu quoi que ce soit. Le navire n'apparaît qu'à
//    l'acte 4. ⇒ `demander3D()` est désormais appelé ① au défilement vers l'acte 3 (dans
//    `demander`), ② ici, une fois la séquence entièrement préchargée et le premier écran peint.
if (!REDUIT) prechargerSequence().then(() => {
  demander();
  // ② le filet : la séquence est au complet, l'écran d'ouverture tourne — on prépare la 3D au repos.
  const auRepos = window.requestIdleCallback ? (f) => requestIdleCallback(f, { timeout: 4000 }) : (f) => setTimeout(f, 3000);
  auRepos(() => demander3D());
});

// ---------- texte dynamique : apparitions, titres lettre à lettre, lore en frappe, boucle qui tourne ----------
document.documentElement.classList.add('js');
function preparerTextes() {
  document.querySelectorAll('.panneau').forEach((p) => {
    let i = 0;
    p.querySelectorAll('h1,h2').forEach((h) => { const t = h.textContent; h.setAttribute('aria-label', t); h.classList.add('lettres');
      // ⚠️ RESTAURÉ LE 25/09 après écrasement par la session de 03:50. Un <span> par LETTRE,
      // mis en `display:inline-block` par le CSS : chaque lettre est une BOÎTE inline atomique,
      // donc une occasion de coupure de ligne. Le navigateur coupait À L'INTÉRIEUR des mots —
      // « Le cœur opérationn / el » et « Garde-fous et limite / s » sur mobile 390×844, mesuré
      // avec `overflow-wrap:normal`. On groupe les lettres PAR MOT : le mot est insécable, la
      // ligne ne se rompt plus qu'aux espaces. L'étalement `--l` est conservé.
      let l = 0;
      h.innerHTML = t.split(' ').map((mot) => `<span class="mot">${[...mot].map((c) => `<span aria-hidden="true" style="--l:${l++}">${c}</span>`).join('')}</span>`).join(' '); });
    p.querySelectorAll(':scope > p, :scope > h3, :scope > ul > li, :scope > ol > li, :scope > div').forEach((e) => { e.classList.add('revele'); e.style.setProperty('--i', i++); });
    p.querySelectorAll('.lore').forEach((e) => e.classList.add('frappe'));
  });
  const vu = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) e.target.classList.add('visible'); }), { threshold: 0.25 });
  document.querySelectorAll('.acte').forEach((a) => vu.observe(a));
  // la boucle : Produire → Observer → Mesurer → Corriger, une étape allumée à la fois
  const etapes = [...document.querySelectorAll('.boucle li')]; let k = 0;
  if (!REDUIT && etapes.length) setInterval(() => { etapes.forEach((e, j) => e.classList.toggle('actif', j === k)); k = (k + 1) % etapes.length; }, 1100);
  // repères des actes
  const reps = [...document.querySelectorAll('.reperes a')];
  addEventListener('scroll', () => { const a = acteCourant(); reps.forEach((r) => r.classList.toggle('actif', +r.dataset.rep === a)); }, { passive: true });
  reps[0]?.classList.add('actif');
}

// ---------- L'Armure du Capitaine : six pièces, six secrets (le jeu reste lisible sans 3D et sans animation) ----------
function majArmure3D(trouves) {
  if (!armure3D) return;
  const complet = trouves.length === PIECES.length;
  armure3D.socle.material.opacity = complet ? 0.95 : 0.25 + 0.1 * trouves.length;
  armure3D.pieces.coeur.material.emissiveIntensity = complet ? 3 : 1.6;
  armure3D.feu.intensity = 2 + trouves.length * (complet ? 2 : 1);
}
function preparerArmure() {
  const hud = document.createElement('aside');
  hud.className = 'armure'; hud.setAttribute('aria-label', "L'Armure du Capitaine");
  hud.innerHTML = `<button class="armure-bouton" aria-expanded="false" aria-controls="armure-liste"><span class="armure-runes" aria-hidden="true"></span><span class="armure-compte"></span></button>
    <div class="armure-panneau" id="armure-liste" hidden><h3>L'Armure du Capitaine</h3><p class="armure-regle">Six pièces sont cachées dans cette page. Chacune a son secret.</p><ul></ul>
    <p class="armure-fin" hidden>L'Armure du Capitaine est complète. Le navire peut partir.</p><button class="armure-oubli" type="button">Tout oublier</button></div>
    <p class="armure-annonce" role="status" aria-live="polite"></p>`;
  document.body.append(hud);
  const bouton = hud.querySelector('.armure-bouton'), panneau = hud.querySelector('.armure-panneau'), annonce = hud.querySelector('.armure-annonce');
  bouton.addEventListener('click', () => { const o = panneau.hidden; panneau.hidden = !o; bouton.setAttribute('aria-expanded', String(o)); });
  hud.querySelector('.armure-oubli').addEventListener('click', () => { oublierArmure(); location.reload(); });
  let delai = 0;
  const afficher = (trouves, nouveau) => {
    hud.querySelector('.armure-runes').innerHTML = PIECES.map((p) => `<i class="${trouves.includes(p.id) ? 'ok' : ''}${p.id === nouveau ? ' neuf' : ''}">${p.rune}</i>`).join('');
    hud.querySelector('.armure-compte').textContent = `${trouves.length}/${PIECES.length}`;
    hud.querySelector('ul').innerHTML = PIECES.map((p) => { const ok = trouves.includes(p.id);
      return `<li class="${ok ? 'ok' : ''}"><b aria-hidden="true">${p.rune}</b> <span>${ok ? p.nom : 'Pièce manquante'}</span><small>${ok ? 'trouvée' : p.indice}</small></li>`; }).join('');
    const complet = trouves.length === PIECES.length;
    hud.classList.toggle('complet', complet); hud.querySelector('.armure-fin').hidden = !complet;
    hud.hidden = trouves.length === 0 && !hud.dataset.vu; // invisible tant qu'aucune pièce n'est trouvée : c'est un secret
  };
  const trouves = brancherOeufs((id, liste) => {
    hud.dataset.vu = '1';
    afficher(liste, id);
    armure3D?.montrer(id, true); majArmure3D(liste); demander();
    const p = PIECES.find((x) => x.id === id);
    annonce.textContent = liste.length === PIECES.length ? "L'Armure du Capitaine est complète." : `${p.nom} trouvé${id === 'jambieres' || id === 'bottes' ? 'es' : id === 'gantelets' ? 's' : ''} — ${liste.length}/${PIECES.length}`;
    annonce.classList.add('montre'); clearTimeout(delai); delai = setTimeout(() => annonce.classList.remove('montre'), 3200);
  });
  if (trouves.length) hud.dataset.vu = '1';
  afficher(trouves);
}

// ---------- interrupteur d'animations : le choix explicite du visiteur ----------
// ⚠️ Le bouton ne fait pas que basculer une classe : il ÉCRIT le choix puis recharge. C'est le
// seul moyen honnête, parce que REDUIT est consommée par sept endroits au chargement. Une bascule
// à chaud laisserait la 3D lancée, la boucle en marche et la séquence d'images préchargée — un
// interrupteur qui ne coupe pas tout est pire que pas d'interrupteur.
function preparerInterrupteurAnimations() {
  const b = document.getElementById('interrupteur-animations');
  if (!b) return;
  // Nom CONSTANT + état porté par aria-pressed : c'est le motif d'un bouton bascule.
  // Un libellé qui changerait ferait annoncer deux choses différentes par le lecteur d'écran.
  b.setAttribute('aria-pressed', String(REDUIT));
  b.title = REDUIT
    ? 'Les animations sont réduites. Cliquez pour les rétablir (la page se rechargera).'
    : 'Réduire les animations de cette page (la page se rechargera). Le réglage est gardé dans votre navigateur.';
  b.addEventListener('click', () => {
    try { localStorage.setItem(PREF_ANIM, REDUIT ? 'plein' : 'reduit'); } catch { /* navigation privée : le choix ne survivra pas au rechargement, et c'est tout */ }
    location.reload();
  });
}
