<template>
  <canvas 
    ref="canvasRef" 
    class="matrix-bg" 
    aria-hidden="true"
  ></canvas>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const canvasRef = ref(null);
let animationId = null;
let ctx = null;
let drops = [];
let resizeHandler = null;

const props = defineProps({
  // Glyphes : binaire Matrix + katakana + les 6 kanji des Lois MND (signature studio)
  chars: { type: String, default: '0101ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿ和誠美実動私' },
  fontSize: { type: Number, default: 15 },
  speed: { type: Number, default: 50 }, // ms entre frames
  opacity: { type: Number, default: 0.18 },
  color: { type: String, default: '#00FF41' } // vert code Matrix (DA D4)
});

const draw = () => {
  // Fade : teinte du fond Matrice (#03060A) pour un fondu cohérent
  ctx.fillStyle = 'rgba(3, 6, 10, 0.06)';
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  // Characters
  ctx.fillStyle = props.color;
  ctx.font = `${props.fontSize}px monospace`;

  for (let i = 0; i < drops.length; i++) {
    const char = props.chars.charAt(Math.floor(Math.random() * props.chars.length));
    ctx.fillText(char, i * props.fontSize, drops[i] * props.fontSize);

    // Reset drop
    if (drops[i] * props.fontSize > ctx.canvas.height && Math.random() > 0.975) {
      drops[i] = 0;
    }
    drops[i]++;
  }
};

// Boucle unique : ralentit quand l'onglet est masqué, ne consomme rien si l'animation est coupée.
const loop = () => {
  if (document.hidden) {
    animationId = setTimeout(loop, 250);
    return;
  }
  draw();
  animationId = setTimeout(() => {
    requestAnimationFrame(loop);
  }, props.speed);
};

const stop = () => {
  if (animationId) {
    clearTimeout(animationId);
    animationId = null;
  }
};

const resize = () => {
  const canvas = canvasRef.value;
  if (!canvas) return;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const columns = Math.floor(canvas.width / props.fontSize);
  drops = Array(columns).fill(1);
};

const onVisibility = () => {
  if (document.hidden) {
    stop();
  } else if (!animationId && canvasRef.value && ctx) {
    loop();
  }
};

onMounted(() => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  const canvas = canvasRef.value;
  if (!canvas) return;

  ctx = canvas.getContext('2d');
  resize();
  resizeHandler = resize;
  window.addEventListener('resize', resize);
  document.addEventListener('visibilitychange', onVisibility);
  loop();
});

onUnmounted(() => {
  stop();
  if (resizeHandler) {
    window.removeEventListener('resize', resizeHandler);
  }
  document.removeEventListener('visibilitychange', onVisibility);
});
</script>

<style scoped>
.matrix-bg {
  position: fixed;
  inset: 0;
  z-index: 0;
  opacity: v-bind(opacity);
  pointer-events: none;
}
</style>
