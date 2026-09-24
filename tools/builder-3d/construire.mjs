#!/usr/bin/env node
/* ═══════════════════════════════════════════════════════════════════════════════
   LE BUILDER DE SITES 3D — ArkAdiA Studio

   ⭐ CE QUE NÉO A DEMANDÉ, MOT POUR MOT (24/09/2026) :
      « Pète un builder de site ! Un système pour construire des sites 3D putain,
        fais-le quoi merde ! Des sites 3D avec des assets qu'on a créés nous-mêmes
        via ComfyUI ! »
      Et : « je veux pas des pages plates pour présenter mon projet. »

   ⛔ LE PROBLÈME QU'IL RÉSOUT. Un site normal, c'est des pages qu'on fait défiler.
      Une page = un document. **On ne visite pas un site, on le lit.**
      Ici, un site est un **MONDE** : des lieux posés dans un vide, reliés par des
      trajets, et le contenu **est** le lieu. On ne descend pas une page, **on voyage.**

   ⭐ COMMENT IL MARCHE, ET C'EST TOUT :
      · on décrit un monde dans un fichier JSON — des lieux, leurs textes, leurs liens ;
      · ce script produit UN fichier `index.html` **autonome** ;
      · `three.js` est recopié à côté, **aucun CDN** — le site tient hors ligne.

   ⛔ CE QU'IL NE FAIT PAS, ET QU'IL DIT :
      · il ne génère pas d'assets 3D — les `.glb` viennent de ComfyUI ou de Blender,
        et le monde les référence par leur chemin ;
      · il ne décide pas du contenu — il le reçoit ;
      · il n'invente aucun chiffre — *un site qui mentirait sur lui-même serait pire
        qu'une page plate.*

   USAGE :
      node construire.mjs mondes/exemple.json sortie/
   ═══════════════════════════════════════════════════════════════════════════════ */

import { readFileSync, writeFileSync, mkdirSync, existsSync, copyFileSync, statSync, readdirSync } from 'node:fs'
import { join, dirname, basename, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const ICI = dirname(fileURLToPath(import.meta.url))

/* ⭐ OU EST three.js — ET POURQUOI ON LE CHERCHE AU LIEU DE L'ECRIRE.
   ⛔ CE CHEMIN A ETE FAUX UNE FOIS, LE 24/09/2026. Le builder vivait dans
      `C:\IA\ArkAdiA\builder\` et three.js dans `C:\IA\portfolio-gaetan\public\vendor\`.
      Un chemin relatif en deux `..` marchait DE LA. Copie dans
      `portfolio-gaetan/tools/builder-3d/`, le meme chemin pointait dans le vide —
      et un chemin faux ne plante pas tout de suite : il produit un site SANS moteur 3D.
      *Un chemin qui depend de l'endroit d'ou on regarde est un chemin qui casse au
        premier demenagement.* On liste les emplacements plausibles et on prend celui
        qui existe. Si aucun n'existe, on le DIT au lieu d'ecrire un site mort. */
const CANDIDATS_THREE = [
  join(ICI, 'three.min.js'),
  join(ICI, '..', '..', 'public', 'vendor', 'three.min.js'),
  join(ICI, '..', '..', '..', 'portfolio-gaetan', 'public', 'vendor', 'three.min.js'),
  'C:/IA/portfolio-gaetan/public/vendor/three.min.js',
]
const THREE_LOCAL = CANDIDATS_THREE.find(function (p) { return existsSync(p) })

/* ⭐ OÙ SONT LES MODÈLES 3D — ET POURQUOI ON LES CHERCHE.
   ⛔ Néo a DÉJÀ ses modèles : galion.glb (10 Mo), chasseur_demo.glb (13,8 Mo),
      unite3d-dou.glb, creature.glb, douze avatars MND.
      **Il ne manque pas d'assets : il manquait que le builder sache les lire.**
   ⛔ ET CE N'EST PAS UN JOB GPU. Lancer ComfyUI pour un fichier qu'on a déjà, c'est
      payer deux fois. *On charge, on ne régénère pas.*
   ⭐ Les racines sont CHERCHÉES, jamais écrites en dur — même leçon que three.js :
      *un chemin qui dépend de l'endroit d'où on regarde casse au premier déménagement.* */
const RACINES_MODELES = [
  'C:/IA/arkadia-outils/forge-ia/demo-three/assets',
  'C:/IA/ArkAdiA/assets',
  join(ICI, '..', '..', 'assets'),
  join(ICI, 'assets'),
]
const CANDIDATS_LOADER = [
  'C:/IA/arkadia-outils/forge-ia/demo-three/vendor/GLTFLoader/GLTFLoader.js',
  'C:/IA/gl-digital-lab/forge-ia/demo-three/vendor/GLTFLoader/GLTFLoader.js',
  join(ICI, 'GLTFLoader.js'),
]
const LOADER_GLTF = CANDIDATS_LOADER.find(function (p) { return existsSync(p) })

/** Trouve un modèle par son nom : à la racine, puis un niveau sous la racine. */
function trouverModele(nom) {
  for (const r of RACINES_MODELES) {
    const p = join(r, nom)
    if (existsSync(p)) return p
  }
  for (const r of RACINES_MODELES) {
    if (!existsSync(r)) continue
    try {
      for (const f of readdirSync(r, { withFileTypes: true })) {
        if (f.isDirectory()) {
          const p = join(r, f.name, nom)
          if (existsSync(p)) return p
        }
      }
    } catch { /* racine illisible : on passe */ }
  }
  return null
}
if (!THREE_LOCAL) {
  console.error('  ATTENTION : three.min.js est introuvable. Emplacements essayes :')
  CANDIDATS_THREE.forEach(function (p) { console.error('     ' + p) })
}

/* ── 1. LES ARGUMENTS ───────────────────────────────────────────────────────── */
const [, , FICHIER_MONDE, DOSSIER_SORTIE] = process.argv
if (!FICHIER_MONDE) {
  console.error('  usage : node construire.mjs <monde.json> [dossier-de-sortie]')
  process.exit(2)
}
const MONDE = resolve(FICHIER_MONDE)
if (!existsSync(MONDE)) {
  console.error(`  ⛔ le monde est introuvable : ${MONDE}`)
  process.exit(2)
}
const SORTIE = resolve(DOSSIER_SORTIE || join(dirname(MONDE), 'site-' + Date.now()))

/* ── 2. LE MONDE EST-IL VALIDE ? ─────────────────────────────────────────────
 * ⛔ ON REFUSE D'ÉCRIRE UN MONDE INCOHÉRENT. Un lieu sans nom, une cible de lien
 *    qui n'existe pas : ce sont des défauts qui ne se voient qu'à l'écran, une fois
 *    le site livré. *Le builder est le dernier endroit où on peut encore dire non.* */
const monde = JSON.parse(readFileSync(MONDE, 'utf8'))
const erreurs = []

if (!monde.titre) erreurs.push('le monde n’a pas de titre')
if (!Array.isArray(monde.lieux) || monde.lieux.length === 0) erreurs.push('le monde n’a aucun lieu')

const ids = new Set((monde.lieux || []).map((l) => l.id))
for (const [i, l] of (monde.lieux || []).entries()) {
  if (!l.id) erreurs.push(`le lieu ${i} n’a pas d’id`)
  if (!l.nom) erreurs.push(`le lieu « ${l.id || i} » n’a pas de nom`)
  for (const lien of l.liens || []) {
    if (!ids.has(lien.vers)) erreurs.push(`« ${l.id} » pointe vers « ${lien.vers} », qui n’existe pas`)
  }
}
for (const lien of monde.entree?.liens || []) {
  if (!ids.has(lien.vers)) erreurs.push(`l’entrée pointe vers « ${lien.vers} », qui n’existe pas`)
}
/* ⭐ ON RÉSOUT LES MODÈLES MAINTENANT, PAS À L'ÉCRAN.
   Un `modele` introuvable produirait un lieu vide — et **ça ne se verrait qu'une fois le
   site livré**. Même famille de défaut que le lien mort, même traitement : on refuse. */
const modelesTrouves = new Map()
for (const l of (monde.lieux || [])) {
  if (!l.modele) continue
  const trouve = trouverModele(basename(l.modele))
  if (!trouve) {
    erreurs.push(`« ${l.id} » demande le modèle « ${l.modele} », introuvable. Racines essayées : ${RACINES_MODELES.join(' · ')}`)
  } else {
    modelesTrouves.set(l.id, trouve)
  }
}
if (modelesTrouves.size > 0 && !LOADER_GLTF) {
  erreurs.push('des modèles sont demandés mais GLTFLoader.js est introuvable — aucune des pistes ne répond')
}
const aDesModeles = modelesTrouves.size > 0

if (erreurs.length) {
  console.error('  ⛔ MONDE INCOHÉRENT — rien n’a été écrit :')
  for (const e of erreurs) console.error('     · ' + e)
  process.exit(1)
}

/* ── 3. LES COULEURS — la palette du studio, jamais inventée ───────────────────
 * ⭐ Noir · cyan · or. **Pas de vert** : sorti du canon le 15/09/2026, et un verrou
 *    le refuse sur le site. *Une palette qui vient d'ailleurs fait un site qui vient
 *    d'ailleurs.* */
const P = {
  fond: monde.palette?.fond || '#060a14',
  cyan: monde.palette?.accent || '#2abfff',
  or: monde.palette?.or || '#ffe650',
  texte: monde.palette?.texte || '#d7e6f2',
  doux: monde.palette?.doux || '#8ea6b8',
}

/* ── 4. LA SCÈNE — un site est un monde, pas une page ─────────────────────────
 * Chaque lieu a une position dans le vide. On voyage de l'un à l'autre ; la caméra
 * glisse, et le texte du lieu s'affiche quand on y arrive.
 * ⚠️ LES POSITIONS SONT CALCULÉES, pas écrites à la main : une spirale qui s'ouvre.
 *    *Un monde dont les lieux se chevauchent est un monde illisible.* */
const lieux = monde.lieux.map((l, i) => {
  const n = monde.lieux.length
  const angle = (i / n) * Math.PI * 2 - Math.PI / 2
  const rayon = l.rayon ?? 220 + i * 26
  return {
    ...l,
    x: Math.cos(angle) * rayon,
    y: (l.hauteur ?? 0) + Math.sin(i * 1.7) * 34,
    z: Math.sin(angle) * rayon,
    taille: l.taille ?? 16,
  }
})

const JS_LIEUX = JSON.stringify(lieux, null, 2)

/* ── 5. LA PAGE ─────────────────────────────────────────────────────────────── */
const html = `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${echapper(monde.titre)}</title>
<meta name="description" content="${echapper(monde.description || monde.titre)}">
<link rel="icon" type="image/svg+xml" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='8' fill='${encodeURIComponent(P.fond)}'/%3E%3Ccircle cx='16' cy='16' r='10' fill='none' stroke='${encodeURIComponent(P.cyan)}' stroke-width='2.5'/%3E%3Ccircle cx='16' cy='16' r='3.4' fill='${encodeURIComponent(P.or)}'/%3E%3C/svg%3E">
<style>
  :root{--fond:${P.fond};--cyan:${P.cyan};--or:${P.or};--texte:${P.texte};--doux:${P.doux}}
  *{box-sizing:border-box}
  html,body{margin:0;height:100%;background:var(--fond);color:var(--texte);
    font-family:system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;overflow:hidden}
  #scene{position:fixed;inset:0;display:block}
  .voile{position:fixed;inset:0;pointer-events:none;
    background:radial-gradient(ellipse at 50% 45%,transparent 40%,rgba(4,7,14,.82) 100%)}
  header{position:fixed;top:0;left:0;right:0;padding:14px 18px;z-index:20;
    display:flex;justify-content:space-between;align-items:baseline;gap:12px;flex-wrap:wrap}
  header h1{margin:0;font-size:.82rem;letter-spacing:.2em;text-transform:uppercase;
    font-family:ui-monospace,Consolas,monospace;font-weight:600;color:var(--cyan)}
  header p{margin:0;font-size:.72rem;letter-spacing:.1em;color:var(--doux);
    font-family:ui-monospace,Consolas,monospace}
  nav{position:fixed;bottom:0;left:0;right:0;padding:10px 14px 14px;z-index:20;
    display:flex;gap:6px;justify-content:center;flex-wrap:wrap}
  nav button{background:rgba(8,12,20,.72);border:1px solid rgba(42,191,255,.22);
    color:var(--doux);font:500 .68rem/1 ui-monospace,Consolas,monospace;
    letter-spacing:.1em;text-transform:uppercase;padding:8px 11px;border-radius:3px;
    cursor:pointer;transition:color .18s,border-color .18s,background .18s}
  nav button:hover,nav button:focus-visible{color:#fff;border-color:var(--cyan);
    background:rgba(42,191,255,.14);outline:none}
  nav button[aria-current="true"]{color:var(--fond);background:var(--cyan);border-color:var(--cyan);font-weight:700}
  #panneau{position:fixed;left:0;right:0;bottom:64px;z-index:15;padding:0 18px;
    display:flex;justify-content:center;pointer-events:none}
  #panneau .carte{max-width:44rem;width:100%;padding:1.1rem 1.3rem;border-radius:.45rem;
    border:1px solid rgba(42,191,255,.28);background:rgba(6,10,20,.86);
    backdrop-filter:blur(8px);pointer-events:auto;transition:opacity .35s}
  #panneau h2{margin:0 0 .5rem;font-size:1.15rem;letter-spacing:-.01em}
  #panneau .corps{font-size:.93rem;line-height:1.65;color:var(--texte)}
  #panneau .actes{margin-top:.9rem;display:flex;gap:8px;flex-wrap:wrap}
  #panneau a{color:var(--cyan);text-decoration:none;font-weight:600;font-size:.9rem}
  #panneau a:hover,#panneau a:focus-visible{text-decoration:underline}
  #aide{position:fixed;right:16px;top:50%;transform:translateY(-50%);z-index:20;
    font:400 .68rem/1.7 ui-monospace,Consolas,monospace;color:var(--doux);
    text-align:right;opacity:.75}
  #aide kbd{color:var(--cyan);font-family:inherit}
  .sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)}
  @media (max-width:640px){#aide{display:none}#panneau{bottom:58px;padding:0 10px}
    nav button{font-size:.6rem;padding:7px 8px}}
  @media (prefers-reduced-motion:reduce){#panneau .carte{transition:none}}
</style>
</head>
<body>
<canvas id="scene" aria-hidden="true"></canvas>
<div class="voile" aria-hidden="true"></div>

<header>
  <h1>${echapper(monde.titre)}</h1>
  <p>${lieux.length} lieu${lieux.length > 1 ? 'x' : ''} · graine ${monde.graine ?? 42} · ce monde est généré, et il le dit</p>
</header>

<nav id="navigation" aria-label="Les lieux du monde"></nav>

<div id="panneau" aria-live="polite">
  <article class="carte" id="carte"></article>
</div>

<div id="aide" aria-hidden="true">
  <kbd>←</kbd> <kbd>→</kbd> voyager<br>
  <kbd>clic</kbd> glisser · tourner<br>
  <kbd>molette</kbd> approcher
</div>

<p class="sr" id="annonce" aria-live="polite"></p>

<script src="./three.min.js"></script>
${aDesModeles ? '<script src="./GLTFLoader.js"></script>' : ''}
<script>
"use strict";
/* ═══════════════════════════════════════════════════════════════════════════════
   LE MONDE — ${echapper(monde.titre)}
   ⭐ Ce fichier est PRODUIT. La source est le JSON, pas ce HTML.
      *Modifier le produit d'une génération, c'est perdre la modification au suivant.*
   ═══════════════════════════════════════════════════════════════════════════════ */
var MONDE = ${JS_LIEUX};
var FOND = ${JSON.stringify(P.fond)}, CYAN = ${JSON.stringify(P.cyan)}, OR = ${JSON.stringify(P.or)};
var reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

if (!window.THREE) {
  document.getElementById('carte').innerHTML =
    '<h2>3D indisponible</h2><div class="corps">Le moteur n\\'a pas pu être chargé. ' +
    'Le monde reste lisible : ses lieux sont listés en bas de page.</div>';
  var nav = document.getElementById('navigation');
  MONDE.forEach(function (l, i) {
    var b = document.createElement('button'); b.textContent = l.nom;
    b.onclick = function () { montrer(i); }; nav.appendChild(b);
  });
  function montrer(i) { var l = MONDE[i];
    document.getElementById('carte').innerHTML = '<h2>' + l.nom + '</h2><div class="corps">' + l.texte + '</div>';
    [].forEach.call(nav.children, function (b, j) { b.setAttribute('aria-current', j === i ? 'true' : 'false'); }); }
  montrer(0);
} else {
(function(){
var T = THREE;
var canvas = document.getElementById('scene');
var renderer = new T.WebGLRenderer({ canvas: canvas, antialias: true, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
renderer.setClearColor(new T.Color(FOND), 1);

var scene = new T.Scene();
scene.fog = new T.FogExp2(new T.Color(FOND).getHex(), .0009);
var camera = new T.PerspectiveCamera(52, 1, .1, 6000);

/* ⭐ L'ÉCLAIRAGE — on éclaire l'ESPACE, pas les objets.
   *Un monde dont on ne voit que les objets n'est pas un monde : c'est une liste.* */
scene.add(new T.AmbientLight(0x5f7799, .72));
var loin = new T.DirectionalLight(0xd8e4ff, .85); loin.position.set(-200, 320, -400); scene.add(loin);
var contre = new T.DirectionalLight(0x9fcaff, 1.1); contre.position.set(260, -140, 300); scene.add(contre);

/* ── LA GRAINE — le monde est DÉTERMINISTE. Même graine, même monde. ───────── */
function mulberry32(a){return function(){a|=0;a=a+0x6D2B79F5|0;var t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
var graine = ${monde.graine ?? 42}, rnd = mulberry32(graine);

/* ── LE VIDE : une grille, des étoiles, et des astéroïdes ──────────────────── */
var grille = new T.GridHelper(2400, 120, CYAN, 0x1a5f80);
grille.material.transparent = true; grille.material.opacity = .26; grille.position.y = -260; scene.add(grille);

var ep = [];
for (var i = 0; i < 1400; i++) {
  var th = rnd() * Math.PI * 2, ph = Math.acos(2 * rnd() - 1), r = 700 + rnd() * 1500;
  ep.push(Math.sin(ph) * Math.cos(th) * r, Math.cos(ph) * r, Math.sin(ph) * Math.sin(th) * r);
}
var ge = new T.BufferGeometry(); ge.setAttribute('position', new T.Float32BufferAttribute(ep, 3));
scene.add(new T.Points(ge, new T.PointsMaterial({ color: 0x9fb4c8, size: 1.4, sizeAttenuation: false, transparent: true, opacity: .55, fog: false })));

/* ⭐ LES ASTÉROÏDES — ils ne portent pas de contenu : ils donnent l'ÉCHELLE.
   Sans eux, deux lieux flottent dans un vide sans distance. */
(function () {
  var geo = new T.IcosahedronGeometry(1, 0);
  var mat = new T.MeshStandardMaterial({ color: 0x2a3644, metalness: .5, roughness: .9, flatShading: true });
  var n = 190, im = new T.InstancedMesh(geo, mat, n);
  var m = new T.Matrix4(), q = new T.Quaternion(), e = new T.Euler(), s = new T.Vector3(), p = new T.Vector3();
  for (var k = 0; k < n; k++) {
    var th2 = rnd() * Math.PI * 2, rr = 260 + rnd() * 620;
    p.set(Math.cos(th2) * rr, (rnd() - .5) * 340, Math.sin(th2) * rr);
    e.set(rnd() * 6, rnd() * 6, rnd() * 6); q.setFromEuler(e);
    var sc = 3 + Math.pow(rnd(), 3) * 22; s.set(sc, sc * (.7 + rnd() * .5), sc);
    m.compose(p, q, s); im.setMatrixAt(k, m);
  }
  scene.add(im);
})();

/* ── LES LIEUX — chaque lieu EST son contenu ───────────────────────────────── */
var ancres = [], noyaux = [];

/* ⭐ POSER UN MODÈLE DANS UN LIEU.
   Le .glb est mis à l'échelle du lieu, centré, et la sphère s'efface derrière lui.
   *Un modèle qu'on ne met pas à l'échelle est un modèle qui écrase le monde.* */
window.__poserModele = function (lieu, groupe, noyau, taille) {
  if (!window.THREE || !THREE.GLTFLoader) return;
  new THREE.GLTFLoader().load('./modeles/' + lieu.modele.split('/').pop(), function (gltf) {
    var obj = gltf.scene;
    /* On mesure l'objet, on le ramène à la taille du lieu. */
    var boite = new T.Box3().setFromObject(obj);
    var dim = new T.Vector3(); boite.getSize(dim);
    var maxi = Math.max(dim.x, dim.y, dim.z) || 1;
    var k = (taille * 3.4) / maxi;
    obj.scale.setScalar(k);
    var centre = new T.Vector3(); boite.getCenter(centre);
    obj.position.sub(centre.multiplyScalar(k));
    obj.traverse(function (o) {
      if (o.isMesh) {
        o.material.metalness = Math.min(1, (o.material.metalness ?? .5) + .15);
        o.material.envMapIntensity = 1;
      }
    });
    groupe.add(obj);
    /* La sphère s'efface : elle a fait son travail. */
    noyau.material.transparent = true;
    var t0 = performance.now();
    (function fondu() {
      var p = Math.min(1, (performance.now() - t0) / 650);
      noyau.material.opacity = 1 - p;
      if (p < 1) requestAnimationFrame(fondu); else noyau.visible = false;
    })();
  }, undefined, function () {
    /* Le modèle n'a pas pu être lu : la sphère RESTE. *Un lieu sans son modèle est
       moins beau, pas cassé — et on ne laisse pas un trou à la place.* */
  });
};

MONDE.forEach(function (lieu, i) {
  var g = new T.Group();
  g.position.set(lieu.x, lieu.y, lieu.z);
  var taille = lieu.taille;

  /* La sphère du lieu : facettée à la main, jamais lisse — *une sphère parfaite
     n'a pas de lieu, elle a une forme.* */
  var geo = new T.IcosahedronGeometry(taille, 1);
  var pa = geo.attributes.position, v = new T.Vector3();
  for (var u = 0; u < pa.count; u++) {
    v.fromBufferAttribute(pa, u);
    var b = 1 + Math.sin(v.x * .35 + i) * .12 + Math.cos(v.y * .4 - i) * .1;
    pa.setXYZ(u, v.x * b, v.y * b, v.z * b);
  }
  geo.computeVertexNormals();

  var noyau = new T.Mesh(geo, new T.MeshStandardMaterial({
    color: i === 0 ? CYAN : 0x2b3a4d, emissive: i === 0 ? CYAN : 0x0a1420,
    emissiveIntensity: i === 0 ? .45 : .18, metalness: .55, roughness: .45, flatShading: true,
  }));
  g.add(noyau); noyaux.push(noyau);

  /* L'anneau : la marque du lieu habité. *Un lieu sans anneau est un caillou.* */
  var anneau = new T.Mesh(new T.TorusGeometry(taille * 1.7, .35, 8, 72),
    new T.MeshBasicMaterial({ color: i === 0 ? CYAN : OR, transparent: true, opacity: .42, blending: T.AdditiveBlending, depthWrite: false }));
  anneau.rotation.x = Math.PI / 2.4 + (i % 3) * .3; g.add(anneau);
  g.userData.anneau = anneau;

  /* Le halo : on voit qu'un lieu existe avant de le lire. */
  var halo = new T.Mesh(new T.SphereGeometry(taille * 2.6, 24, 16),
    new T.MeshBasicMaterial({ color: CYAN, transparent: true, opacity: .05, blending: T.AdditiveBlending, depthWrite: false, side: T.BackSide }));
  g.add(halo);

  scene.add(g);

  /* ⭐ LE MODÈLE 3D DU LIEU — s'il en a un.
     Le .glb REMPLACE la sphère : *une sphère est un bouchon, un modèle est un lieu.*
     ⚠️ Chargement ASYNCHRONE : la sphère reste visible jusqu'à l'arrivée du modèle, puis
        s'efface en douceur. *Un lieu qui disparaît pendant le chargement est un lieu
        qu'on croit cassé.* */
  if (lieu.modele && window.__poserModele) window.__poserModele(lieu, g, noyau, taille);
  var a = new T.Object3D(); a.position.set(0, taille * 2.2, 0); g.add(a);
  ancres.push(a); lieu._g = g;
});

/* ── LA CAMÉRA : on VOYAGE, on ne défile pas ───────────────────────────────── */
var cible = 0, avance = 0, tourne = 0, distance = 190, glisse = 0;
function poserCamera(k) {
  var l = MONDE[k], g = l._g;
  var th = Math.atan2(g.position.z, g.position.x);
  var cx = g.position.x + Math.cos(th + glisse) * distance;
  var cz = g.position.z + Math.sin(th + glisse) * distance;
  var cy = g.position.y + distance * .34;
  camera.position.lerp(new T.Vector3(cx, cy, cz), reduce ? 1 : .045);
  camera.lookAt(g.position.x, g.position.y, g.position.z);
}
function voyager(k) {
  cible = (k + MONDE.length) % MONDE.length;
  montrer(cible);
}

/* ── LE PANNEAU : le contenu du lieu ───────────────────────────────────────── */
var nav = document.getElementById('navigation'), carte = document.getElementById('carte');
MONDE.forEach(function (l, i) {
  var b = document.createElement('button');
  b.textContent = l.nom;
  b.onclick = function () { voyager(i); };
  nav.appendChild(b);
});
function montrer(i) {
  var l = MONDE[i];
  var liens = (l.liens || []).map(function (x) { return '<a href="#" data-vers="' + x.vers + '">' + x.texte + ' →</a>'; }).join('');
  carte.innerHTML = '<h2>' + l.nom + '</h2><div class="corps">' + l.texte + '</div>' +
    (liens ? '<div class="actes">' + liens + '</div>' : '');
  [].forEach.call(nav.children, function (b, j) { b.setAttribute('aria-current', j === i ? 'true' : 'false'); });
  document.getElementById('annonce').textContent = l.nom + '. ' + carte.querySelector('.corps').textContent.slice(0, 120);
  [].forEach.call(carte.querySelectorAll('[data-vers]'), function (a2) {
    a2.onclick = function (ev) {
      ev.preventDefault();
      var j = MONDE.findIndex(function (x) { return x.id === a2.dataset.vers; });
      if (j >= 0) voyager(j);
    };
  });
}

/* ── LES COMMANDES : clavier, clic, molette — et la manette d'abord ────────── */
addEventListener('keydown', function (e) {
  if (e.key === 'ArrowRight' || e.key === 'PageDown') voyager(cible + 1);
  else if (e.key === 'ArrowLeft' || e.key === 'PageUp') voyager(cible - 1);
});
canvas.addEventListener('pointerdown', function (e) { avance = e.clientX; canvas.setPointerCapture(e.pointerId); });
canvas.addEventListener('pointermove', function (e) {
  if (avance === 0) return;
  glisse -= (e.clientX - avance) * .005; avance = e.clientX;
});
canvas.addEventListener('pointerup', function () { avance = 0; });
canvas.addEventListener('wheel', function (e) {
  e.preventDefault(); distance = Math.min(420, Math.max(90, distance + e.deltaY * .28));
}, { passive: false });

/* ⭐ LA MANETTE EST LE CHEMIN NORMAL. Consigne du studio : *« si tu fais des jeux,
   pense à la navigation manette xbox »*. Stick gauche : voyager. Gâchette : approcher. */
var manettePrecedente = -1;
function lireManette() {
  var ms = navigator.getGamepads ? navigator.getGamepads() : [];
  for (var i = 0; i < ms.length; i++) {
    var g = ms[i]; if (!g) continue;
    var ax = g.axes[0] || 0;
    if (Math.abs(ax) > .6) {
      var dir = ax > 0 ? 1 : -1;
      if (manettePrecedente !== dir) { voyager(cible + dir); manettePrecedente = dir; }
    } else manettePrecedente = 0;
    if (g.buttons[7] && g.buttons[7].pressed) distance = Math.min(420, distance + 3);
    if (g.buttons[6] && g.buttons[6].pressed) distance = Math.max(90, distance - 3);
  }
}

/* ── LA BOUCLE ─────────────────────────────────────────────────────────────── */
function redimensionner() {
  var l = innerWidth, h = innerHeight;
  renderer.setSize(l, h, false);
  camera.aspect = l / h; camera.updateProjectionMatrix();
}
addEventListener('resize', redimensionner); redimensionner();
montrer(0);

var horloge = new T.Clock(), t = 0;
function boucle() {
  requestAnimationFrame(boucle);
  var dt = Math.min(horloge.getDelta(), .05); t += dt;
  lireManette();
  poserCamera(cible);

  /* Les lieux respirent — lentement. *Un monde figé est une image.* */
  if (!reduce) {
    noyaux.forEach(function (n2, i) {
      var s = 1 + Math.sin(t * .6 + i * 1.3) * .035;
      n2.scale.setScalar(s);
      var a2 = MONDE[i]._g.userData.anneau;
      if (a2) { a2.rotation.z += dt * (.12 + i * .03); a2.material.opacity = .34 + Math.sin(t * .8 + i) * .12; }
    });
    var c0 = MONDE[cible]._g;
    c0.position.y = MONDE[cible].y + Math.sin(t * .5) * 3.5;
  }
  renderer.render(scene, camera);
}
boucle();
})();
}
</script>
</body>
</html>
`

function echapper(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

/* ── 6. L'ÉCRITURE ──────────────────────────────────────────────────────────── */
mkdirSync(SORTIE, { recursive: true })
writeFileSync(join(SORTIE, 'index.html'), html, 'utf8')

/* ⭐ LES MODÈLES ET LEUR CHARGEUR — copiés SEULEMENT s'ils servent.
   *Un monde de texte ne doit pas peser 111 Ko de loader inutile.* */
let loaderCopie = false
const modelesCopies = []
if (aDesModeles) {
  mkdirSync(join(SORTIE, 'modeles'), { recursive: true })
  for (const [, chemin] of modelesTrouves) {
    const nom = basename(chemin)
    copyFileSync(chemin, join(SORTIE, 'modeles', nom))
    modelesCopies.push(nom)
  }
  if (LOADER_GLTF) {
    copyFileSync(LOADER_GLTF, join(SORTIE, 'GLTFLoader.js'))
    loaderCopie = true
  }
}

/* ⭐ three.js EST RECOPIÉ, PAS LIÉ. Le CSP du studio interdit tout CDN, et un site
   qui dépend d'un domaine tiers ne s'exécute pas sur un site qui interdit les
   domaines tiers. *On a payé cette leçon le 24/09/2026, sur la vitrine.* */
let threeCopie = false
if (existsSync(THREE_LOCAL)) {
  copyFileSync(THREE_LOCAL, join(SORTIE, 'three.min.js'))
  threeCopie = true
}

/* ── 7. LES ASSERTIONS SUR LE RÉSULTAT ──────────────────────────────────────── */
const produit = readFileSync(join(SORTIE, 'index.html'), 'utf8')
const controles = [
  ['le titre du monde est dans la page', produit.includes(monde.titre)],
  ['les lieux sont tous écrits', lieux.every((l) => produit.includes(l.nom))],
  ['three.js est copié à côté', threeCopie],
  ['aucun CDN dans la page', !/cdn\.|jsdelivr|googleapis/.test(produit)],
  ['⛔ aucun vert', !/#?37ff9a|#?5dff8a|#?3dff7a/i.test(produit)],
  ['la navigation au clavier est là', produit.includes('ArrowRight')],
  ['la manette est lue', produit.includes('getGamepads')],
  ['le mouvement réduit est respecté', produit.includes('prefers-reduced-motion')],
  ['la graine est affichée', produit.includes('graine')],
]
const rates = controles.filter(([, ok]) => !ok).map(([n]) => n)
if (rates.length) {
  console.error('  ⛔ le site produit ne passe pas ses contrôles : ' + rates.join(' · '))
  process.exit(1)
}

const ko = statSync(join(SORTIE, 'index.html')).size / 1024
console.log(`  ✅ ${monde.titre}`)
console.log(`     ${lieux.length} lieu(x) · ${ko.toFixed(0)} Ko + three.min.js`)
console.log(`     ${SORTIE}`)
console.log(`     ouvrir : index.html — ← → pour voyager, manette Xbox reconnue`)
