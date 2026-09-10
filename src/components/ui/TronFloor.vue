<template>
  <!--
    LA GRILLE — apport TRON à la fusion D5 (site concept flagship)

    Rôle unique de TRON dans la doctrine : LA STRUCTURE. La Grille en
    perspective, le cyan glacé, l'horizon. Elle ne sert JAMAIS d'ambiance de
    fond : ici elle affleure **sous le sol** du poste — c'est le seul endroit
    où le numérique peut se brancher sur du réel.

    C'est le récit du goal mis en image : notre monde est réel, et quelque
    chose qui n'en vient pas y fait irruption. La Grille ne remplace pas le
    décor, elle le traverse.

    Coût : du CSS pur, zéro WebGL, zéro requête. Le défilement est une
    `transform: translateY()` (composée par le GPU) d'exactement une tuile —
    donc une boucle sans raccord et aucun repaint par frame.
  -->
  <div class="tron" aria-hidden="true">
    <div class="tron__scene">
      <div class="tron__floor">
        <div class="tron__grid" :class="{ 'tron__grid--defile': anime }"></div>
      </div>
    </div>
    <span class="tron__horizon"></span>
    <!-- Deux circuits lumineux : la Grille ne se contente pas d'exister,
         elle vient chercher quelque chose dans le réel. -->
    <span class="tron__circuit tron__circuit--1"></span>
    <span class="tron__circuit tron__circuit--2"></span>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

// Le mouvement est piloté ici et pas seulement en CSS : on veut pouvoir
// l'arrêter proprement (et le prouver) quand le visiteur demande moins
// d'animation.
const anime = ref(false);
let mq = null;
const maj = () => { anime.value = !mq.matches; };

onMounted(() => {
  if (typeof window === 'undefined' || !window.matchMedia) return;
  mq = window.matchMedia('(prefers-reduced-motion: reduce)');
  maj();
  mq.addEventListener('change', maj);
});

onUnmounted(() => {
  if (mq) mq.removeEventListener('change', maj);
});
</script>

<style scoped>
.tron {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 34vh;
  overflow: hidden;
  pointer-events: none;
  z-index: 0;
}

/* ── La perspective : point de fuite au-dessus de la Grille, donc le sol
   « part » vers l'horizon, exactement comme une plaine vue depuis le poste. */
.tron__scene {
  position: absolute;
  inset: 0;
  perspective: 240px;
  perspective-origin: 50% 0%;
}

.tron__floor {
  position: absolute;
  left: -35%;
  right: -35%;
  top: 0;
  height: 420%;
  transform-origin: 50% 0%;
  transform: rotateX(78deg);
  /* Le lointain s'efface : sans ce masque, la Grille devient un papier peint. */
  -webkit-mask-image: linear-gradient(to bottom, transparent 0%, #000 26%, #000 74%, transparent 98%);
  mask-image: linear-gradient(to bottom, transparent 0%, #000 26%, #000 74%, transparent 98%);
}

.tron__grid {
  position: absolute;
  left: 0;
  right: 0;
  top: -56px;
  bottom: -56px;
  background-image:
    repeating-linear-gradient(to right, rgba(0, 229, 255, 0.42) 0 1px, transparent 1px 56px),
    repeating-linear-gradient(to bottom, rgba(0, 229, 255, 0.26) 0 1px, transparent 1px 56px);
}

/* Une tuile = 56 px : la boucle est donc invisible, sans repaint (transform). */
.tron__grid--defile {
  animation: tron-defile 4.5s linear infinite;
}

@keyframes tron-defile {
  from { transform: translateY(0); }
  to   { transform: translateY(56px); }
}

/* ── L'horizon : une seule ligne cyan, la frontière entre le réel et la Grille. */
.tron__horizon {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  height: 1px;
  background: linear-gradient(
    to right,
    transparent 0%,
    rgba(0, 229, 255, 0.15) 18%,
    rgba(0, 229, 255, 0.75) 50%,
    rgba(0, 229, 255, 0.15) 82%,
    transparent 100%
  );
  box-shadow: 0 0 18px rgba(0, 229, 255, 0.45);
}

/* ── Circuits : deux traits lumineux qui « viennent chercher » le réel. */
.tron__circuit {
  position: absolute;
  height: 1px;
  background: linear-gradient(to right, transparent, var(--neon-cyan), transparent);
  box-shadow: 0 0 10px rgba(0, 229, 255, 0.6);
  opacity: 0.7;
}
.tron__circuit--1 {
  left: 6%;
  width: 26%;
  top: 38%;
  animation: tron-circuit 7s ease-in-out infinite;
}
.tron__circuit--2 {
  right: 8%;
  width: 18%;
  top: 62%;
  animation: tron-circuit 9s ease-in-out infinite reverse;
}

@keyframes tron-circuit {
  0%, 100% { opacity: 0.18; }
  50%      { opacity: 0.85; }
}

/* ── Mobile : la Grille reste (c'est la signature) mais plus discrète, et
   les circuits disparaissent — trop fins pour être lisibles sur petit écran. */
@media (max-width: 768px) {
  .tron { height: 24vh; opacity: 0.7; }
  .tron__circuit { display: none; }
}

/* ── Reduced-motion : la Grille est conservée à l'arrêt (le décor reste juste),
   plus aucun défilement ni pulsation. */
@media (prefers-reduced-motion: reduce) {
  .tron__grid { animation: none !important; }
  .tron__circuit { animation: none !important; opacity: 0.4; }
}
</style>
