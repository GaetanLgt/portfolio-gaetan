<template>
  <div v-if="decorActif" class="decor-tunnel" aria-hidden="true">
    <img
      class="decor-tunnel__image"
      src="/models/decor-tunnel-1536.webp"
      width="1536" height="864"
      alt=""
      loading="lazy" decoding="async" fetchpriority="low"
    >
  </div>
</template>

<script setup>
/**
 * DÉCOR DE FOND — le tunnel, produit par la chaîne locale du studio.
 *
 * PROVENANCE, PARCE QU'ELLE COMPTE
 *  1. Généré sur notre carte graphique (ComfyUI, RTX 3080 — modèle `bigASP_v2`,
 *     16,5 s) : c'est lui qui a fourni la FORME, un tunnel à point de fuite unique.
 *  2. Étalonné à la charte en local (`scripts/coloriser-decor.mjs`) : c'est lui qui
 *     a fourni la COULEUR. Le tirage brut sortait beige rosé, à l'opposé du site.
 *  3. AGRANDI SUR LA CARTE GRAPHIQUE, en deux temps et pas d'un coup — c'est ce qui
 *     distingue un agrandissement d'une extrapolation. Le 1024 a d'abord été porté à
 *     1536 par Lanczos (`sharp`, local), PUIS repassé sur la carte graphique en
 *     img2img (`LoadImage` → `VAEEncode` → `KSampler`, denoise 0,30, 26 pas, 24,8 s)
 *     pour que le modèle REDESSINE le détail au lieu de l'inventer de zéro. Le
 *     low-denoise est le point clé : à denoise haut, le modèle réinvente le tunnel
 *     et la forme validée par Gaëtan est perdue.
 *
 *     Gain mesuré : 2,2 fois plus de pixels, palette identique au point près
 *     (r=8 v=62 b=47 contre r=8 v=63 b=48 sur la version 1024), et 71,0 Ko sur le
 *     réseau au lieu de 59,8 — soit +11 Ko. Sur un écran 1920 le décor n'est plus
 *     agrandi par le navigateur.
 *
 * Aucune image de banque, aucun droit tiers. Le fichier servi est
 * `public/models/decor-tunnel-1536.webp` — 71,0 Ko, contre 843,8 Ko pour le tirage
 * brut de la carte graphique (et 1507,1 Ko pour l'agrandissement GPU non conformé).
 *
 * POURQUOI UNE IMAGE ET PAS UNE SCÈNE 3D — C'EST MESURÉ, PAS PRÉFÉRÉ
 * La version WebGL de ce décor (three.js, `src/components/three/ScrollScene.vue`)
 * a été montée, éprouvée 4 cas sur 4, puis mesurée en A/B sur cette même page :
 *     avec la scène : performance 91 · 92 · 91 | TBT 44-90 ms | LCP ~3 340 ms
 *     sans la scène : performance 97 · 96 · 98 | TBT 24-33 ms | LCP ~2 338 ms
 * Le montage faisait repasser le site SOUS son propre seuil de 95. La cause n'était
 * pas le transfert (107,8 Ko compressés) mais l'exécution de 442,7 Ko de JavaScript.
 * Le composant three.js reste dans le dépôt, intact — il n'est simplement pas monté.
 *
 * MODE SOBRE
 * `decorActif` est le même interrupteur que celui du pied de page (« Revenir au mode
 * sobre ») et que celui de tous les autres décors du site : en mode sobre, ce décor
 * n'est pas monté du tout. Il n'y a rien à animer ici, donc `prefers-reduced-motion`
 * n'a pas d'objet — une image fixe n'a pas de mouvement à réduire.
 */
import { decorActif } from '@/composables/mode-sobre.js';
</script>

<style scoped>
.decor-tunnel {
  position: fixed;
  inset: 0;
  /* Même empilement que la scène 3D qu'il remplace (`z-index: 0`, premier enfant) :
     le contenu positionné qui suit dans le DOM passe donc au-dessus. Vérifié à la
     capture, pas déduit — un décor qui recouvrirait le titre ne se devine pas, il
     se voit. */
  z-index: 0;
  pointer-events: none;
  overflow: hidden;
}

.decor-tunnel__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  /* Le point de fuite est au centre-gauche de l'image : on le remonte un peu pour
     qu'il tombe dans l'axe du titre sur les écrans larges. */
  object-position: center 40%;
  /* Volontairement discret. Le décor ne doit pas se disputer la lecture avec le
     texte du héros : à 0,34, la zone la plus claire de l'image ne pèse plus que
     ~6/65/45 sur le noir de la charte, très loin derrière le seuil de contraste. */
  opacity: 0.34;
  /* Et on éteint carrément le décor là où vit le texte (à gauche, en bas), au lieu
     d'espérer que ça passe. Un masque est un choix, une espérance n'en est pas un. */
  -webkit-mask-image: linear-gradient(100deg, transparent 0%, rgba(0, 0, 0, 0.3) 36%, #000 72%);
  mask-image: linear-gradient(100deg, transparent 0%, rgba(0, 0, 0, 0.3) 36%, #000 72%);
}

@media (max-width: 767px) {
  /* Sur téléphone le décor passe SOUS le texte plus qu'à côté : on baisse encore,
     et on remonte le point de fuite hors de la zone de lecture. */
  .decor-tunnel__image {
    opacity: 0.22;
    object-position: center 22%;
  }
}
</style>
