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

const props = defineProps({
  chars: { type: String, default: '01GLX' },
  fontSize: { type: Number, default: 14 },
  speed: { type: Number, default: 50 }, // ms entre frames
  opacity: { type: Number, default: 0.12 },
  color: { type: String, default: '#10b981' }
});

const initMatrix = () => {
  const canvas = canvasRef.value;
  if (!canvas) return;
  
  ctx = canvas.getContext('2d');
  
  // Resize
  const resize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const columns = Math.floor(canvas.width / props.fontSize);
    drops = Array(columns).fill(1);
  };
  
  resize();
  window.addEventListener('resize', resize);
  
  // Draw
  const draw = () => {
    // Fade effect
    ctx.fillStyle = `rgba(5, 5, 5, 0.05)`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Characters
    ctx.fillStyle = props.color;
    ctx.font = `${props.fontSize}px monospace`;
    
    for (let i = 0; i < drops.length; i++) {
      const char = props.chars.charAt(Math.floor(Math.random() * props.chars.length));
      ctx.fillText(char, i * props.fontSize, drops[i] * props.fontSize);
      
      // Reset drop
      if (drops[i] * props.fontSize > canvas.height && Math.random() > 0.975) {
        drops[i] = 0;
      }
      drops[i]++;
    }
  };
  
  // Animation loop
  const loop = () => {
    draw();
    animationId = setTimeout(() => {
      requestAnimationFrame(loop);
    }, props.speed);
  };
  
  loop();
};

onMounted(() => {
  // Respecter prefers-reduced-motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  if (!prefersReducedMotion) {
    initMatrix();
  }
});

onUnmounted(() => {
  if (animationId) {
    clearTimeout(animationId);
  }
  window.removeEventListener('resize', () => {});
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
