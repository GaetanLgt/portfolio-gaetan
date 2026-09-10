/**
 * POST-TRAITEMENT DU POSTE — D5 (site concept flagship)
 *
 * La signature visuelle de la fusion, appliquée à la scène des 6 unités :
 *   · bloom sélectif  → l'émeraude MND déborde (le signal, apport Matrix)
 *   · aberration chromatique → les bords de l'écran se séparent (apport TRON)
 *   · balayage de tube → la matière « écran » (apport Evangelion)
 *   · vignette → le regard au centre du poste
 *
 * TROIS FILETS DE SÉCURITÉ, parce qu'un effet WebGL qui casse est pire que
 * pas d'effet du tout :
 *   1. PALIER DE QUALITÉ décidé avant même de créer la chaîne (matériel +
 *      choix du visiteur). Un appareil modeste ne reçoit que la passe légère.
 *   2. VÉRIFICATION DE TRANSPARENCE : le canvas du hero est transparent (la
 *      Grille TRON et la pluie passent derrière). Si la chaîne rend l'alpha
 *      opaque, on le DÉTECTE en lisant les pixels et on revient au rendu direct.
 *      Vérifié dans la source de three : UnrealBloomPass efface avec alpha 0 et
 *      OutputPass ne réécrit que `.rgb` — mais on ne parie pas, on mesure.
 *      La vérification est refaite APRÈS le chargement des modèles (2 s), sinon
 *      on ne teste qu'une scène vide et le contrôle ne prouve rien.
 *   3. CHIEN DE GARDE FPS : si la moyenne descend sous le seuil, on descend d'un
 *      palier en cours de route, sans rechargement.
 */
import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { palierPoste, motifPoste } from '@/composables/etat-poste.js';

/** Passe unique : aberration + balayage + vignette. L'alpha de la scène est
 *  conservé intact (on ne réécrit que `.rgb`), condition de la transparence. */
const PosteShader = {
  name: 'PosteShader',
  uniforms: {
    tDiffuse: { value: null },
    uAberration: { value: 0.0018 },
    uBalayage: { value: 0.055 },
    uVignette: { value: 0.55 },
    uHauteur: { value: 900 },
  },
  vertexShader: /* glsl */`
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: /* glsl */`
    uniform sampler2D tDiffuse;
    uniform float uAberration;
    uniform float uBalayage;
    uniform float uVignette;
    uniform float uHauteur;
    varying vec2 vUv;

    void main() {
      vec2 c = vUv - 0.5;
      float d = length(c);

      // Aberration chromatique : nulle au centre, croissante vers les bords.
      vec2 dec = c * uAberration * (0.35 + d);
      vec4 col;
      col.r = texture2D(tDiffuse, vUv + dec).r;
      col.g = texture2D(tDiffuse, vUv).g;
      col.b = texture2D(tDiffuse, vUv - dec).b;
      col.a = texture2D(tDiffuse, vUv).a;   // alpha inchangé : transparence préservée

      // Balayage : une période d'environ 4 pixels physiques.
      float ligne = 0.5 + 0.5 * sin(vUv.y * uHauteur * 1.6);
      col.rgb *= 1.0 - uBalayage * ligne;

      // Vignette douce.
      col.rgb *= 1.0 - uVignette * dot(c, c);

      gl_FragColor = col;
    }
  `,
};

/** Points testés pour la transparence, en coordonnées relatives (0 = bas/gauche). */
const POINTS_CONTROLE = [[0.03, 0.03], [0.03, 0.97], [0.97, 0.97]];

/**
 * Palier de qualité, décidé sur des signaux RÉELS du navigateur.
 * 'haut' = bloom + passe complète · 'moyen' = passe complète seule · 'statique' = rien.
 */
export function detecterPalier() {
  if (typeof navigator === 'undefined' || typeof window === 'undefined') return 'statique';

  // Un visiteur qui a demandé moins de mouvement reçoit la version la plus
  // sobre : la matière d'écran reste, le halo coûteux part.
  if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return 'moyen';

  // Économie de données : on ne fait pas chauffer un GPU sur un forfait mobile.
  if (navigator.connection?.saveData) return 'moyen';

  const coeurs = navigator.hardwareConcurrency ?? 4;
  const memoire = navigator.deviceMemory ?? 8;

  if (coeurs >= 8 && memoire >= 8) return 'haut';
  if (coeurs >= 4) return 'moyen';
  return 'statique';
}

/**
 * Vérifie que la chaîne n'a PAS rendu le canvas opaque : au moins un point de
 * contrôle doit avoir un alpha quasi nul. Renvoie true si c'est le cas.
 * (Tester plusieurs points évite le faux positif si un coin se trouve couvert.)
 */
function transparenceIntacte(renderer) {
  try {
    const gl = renderer.getContext();
    const taille = renderer.getDrawingBufferSize(new THREE.Vector2());
    const pixel = new Uint8Array(4);
    for (const [rx, ry] of POINTS_CONTROLE) {
      const x = Math.min(taille.x - 1, Math.max(0, Math.round(rx * taille.x)));
      const y = Math.min(taille.y - 1, Math.max(0, Math.round(ry * taille.y)));
      gl.readPixels(x, y, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixel);
      if (pixel[3] <= 8) return true;
    }
    return false;
  } catch {
    // Lecture impossible (contexte perdu, restriction navigateur) : on ne casse
    // rien, on laisse la chaîne en place et le chien de garde tranchera.
    return true;
  }
}

/**
 * Construit la chaîne. Renvoie null si le palier est 'statique' — l'appelant
 * retombe alors sur renderer.render().
 *
 * @param {THREE.WebGLRenderer} renderer
 * @param {THREE.Scene} scene
 * @param {THREE.Camera} camera
 * @param {'haut'|'moyen'|'statique'} palierDemande
 * @param {(e:{palier:string, motif:string}) => void} [onChangement]
 *        Appelé si le poste descend de palier en cours de route. Si l'appelant
 *        reçoit 'statique', il doit cesser d'utiliser cette chaîne.
 */
export function creerPoste(renderer, scene, camera, palierDemande, onChangement) {
  // On publie le palier réellement appliqué : la barre de diagnostic l'affiche,
  // donc il doit être vrai avant même que la chaîne soit construite.
  palierPoste.value = palierDemande === 'statique' ? 'statique' : palierDemande;
  motifPoste.value = '';
  if (palierDemande === 'statique') return null;

  let palier = palierDemande;

  /** Publie l'état réel ET met à jour la copie locale : une seule source de
   *  vérité, sinon le getter `palier` mentirait après une descente. */
  const signaler = (nouveau, motif) => {
    palier = nouveau;
    palierPoste.value = nouveau;
    motifPoste.value = motif;
    onChangement?.({ palier: nouveau, motif });
  };

  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));

  let bloom = null;
  const ajouterBloom = () => {
    if (bloom) return;
    // force 0.55 / radius 0.7 / seuil 0.85 : on ne veut PAS un halo de néon sur
    // toute l'image, seulement le débordement des valeurs très claires — les
    // liserés émeraude des unités.
    bloom = new UnrealBloomPass(new THREE.Vector2(1, 1), 0.55, 0.7, 0.85);
    // Ordre voulu : rendu → halo → matière d'écran → sortie.
    composer.insertPass(bloom, 1);
  };
  const retirerBloom = () => {
    if (!bloom) return;
    composer.removePass(bloom);
    bloom.dispose?.();
    bloom = null;
  };

  if (palier === 'haut') ajouterBloom();

  const passe = new ShaderPass(PosteShader);
  composer.addPass(passe);
  composer.addPass(new OutputPass());

  // --- chien de garde FPS : moyenne glissante, descente d'un palier si besoin
  const SEUIL_FPS = 45;
  let cumul = 0;
  let frames = 0;
  let dejaBaisse = palier === 'moyen';
  let abandonne = false;

  const mesurer = (dt) => {
    cumul += dt;
    frames++;
    if (cumul < 2) return;             // fenêtre de 2 s
    const fps = frames / cumul;
    cumul = 0;
    frames = 0;
    if (fps >= SEUIL_FPS) return;
    if (!dejaBaisse) {
      dejaBaisse = true;
      retirerBloom();
      signaler('moyen', `fps ${fps.toFixed(1)} < ${SEUIL_FPS}`);
    } else if (palier !== 'statique') {
      abandonne = true;
      signaler('statique', `fps ${fps.toFixed(1)} toujours sous le seuil`);
    }
  };

  let premier = true;
  let verifieDiffere = false;
  const verifierA = typeof performance !== 'undefined' ? performance.now() + 2000 : Infinity;

  return {
    get palier() { return palier; },
    get aBloom() { return !!bloom; },
    get abandonne() { return abandonne; },

    setSize(w, h) {
      composer.setSize(w, h);
      bloom?.setSize(w, h);
      passe.uniforms.uHauteur.value = h * renderer.getPixelRatio();
    },

    /** Renvoie true si le rendu a été fait par la chaîne, false si elle a
     *  abandonné (l'appelant doit alors faire un renderer.render() direct). */
    render(dt = 0.016) {
      if (abandonne) return false;

      composer.render(dt);

      if (premier) {
        premier = false;
        if (!transparenceIntacte(renderer)) {
          abandonne = true;
          signaler('statique', 'transparence perdue');
        }
        return true;
      }

      // Contrôle différé, UNE seule fois : à ce moment les modèles sont chargés,
      // donc le test porte sur une scène réellement remplie.
      if (!verifieDiffere && performance.now() >= verifierA) {
        verifieDiffere = true;
        if (!transparenceIntacte(renderer)) {
          abandonne = true;
          signaler('statique', 'transparence perdue (scène chargée)');
          return true;
        }
      }

      mesurer(dt);
      return true;
    },

    dispose() {
      retirerBloom();
      passe.dispose?.();
      composer.dispose?.();
    },
  };
}
