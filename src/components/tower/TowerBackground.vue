<template>
  <div class="tower-ambient" aria-hidden="true">
    <canvas ref="canvas" class="bg-canvas"></canvas>
    <div class="city-skyline">
      <div class="building" v-for="n in 20" :key="n" :style="buildingStyle(n)"></div>
    </div>
    <div class="fog-layer"></div>
    <div class="grid-floor"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const canvas = ref(null);
let animationId = null;
let particles = [];

const buildingStyle = (n) => {
  const height = 50 + Math.random() * 150;
  const width = 20 + Math.random() * 40;
  const left = (n - 1) * 5 + Math.random() * 2;
  return {
    height: `${height}px`,
    width: `${width}px`,
    left: `${left}%`,
    '--delay': `${Math.random() * 5}s`
  };
};

const initCanvas = () => {
  const ctx = canvas.value?.getContext('2d');
  if (!ctx) return;
  
  const resize = () => {
    canvas.value.width = window.innerWidth;
    canvas.value.height = window.innerHeight;
  };
  resize();
  window.addEventListener('resize', resize);

  // Create particles
  particles = Array.from({ length: 80 }, () => ({
    x: Math.random() * canvas.value.width,
    y: Math.random() * canvas.value.height,
    vx: (Math.random() - 0.5) * 0.3,
    vy: (Math.random() - 0.5) * 0.3,
    size: Math.random() * 2 + 0.5,
    opacity: Math.random() * 0.5 + 0.2
  }));

  const animate = () => {
    ctx.fillStyle = 'rgba(10, 10, 20, 0.05)';
    ctx.fillRect(0, 0, canvas.value.width, canvas.value.height);

    particles.forEach(p => {
      // Update position
      p.x += p.vx;
      p.y += p.vy;

      // Wrap around
      if (p.x < 0) p.x = canvas.value.width;
      if (p.x > canvas.value.width) p.x = 0;
      if (p.y < 0) p.y = canvas.value.height;
      if (p.y > canvas.value.height) p.y = 0;

      // Draw particle
      ctx.fillStyle = `rgba(16, 185, 129, ${p.opacity})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    });

    // Draw connections
    ctx.strokeStyle = 'rgba(16, 185, 129, 0.05)';
    ctx.lineWidth = 0.5;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    animationId = requestAnimationFrame(animate);
  };

  animate();
};

onMounted(() => {
  initCanvas();
});

onUnmounted(() => {
  if (animationId) cancelAnimationFrame(animationId);
});
</script>

<style scoped>
.tower-ambient {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  overflow: hidden;
}

.bg-canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

/* City Skyline */
.city-skyline {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 250px;
  pointer-events: none;
}

.building {
  position: absolute;
  bottom: 0;
  background: linear-gradient(to top, 
    rgba(20, 30, 40, 0.9),
    rgba(30, 40, 50, 0.7)
  );
  border-radius: 2px 2px 0 0;
}

.building::before {
  content: '';
  position: absolute;
  inset: 5px;
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 8px,
    rgba(255, 200, 100, 0.1) 8px,
    rgba(255, 200, 100, 0.1) 10px
  );
  opacity: 0.5;
  animation: windowFlicker 3s ease-in-out infinite var(--delay);
}

@keyframes windowFlicker {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 0.6; }
}

/* Fog Layer */
.fog-layer {
  position: absolute;
  inset: 0;
  background: radial-gradient(
    ellipse 80% 50% at 50% 100%,
    rgba(16, 185, 129, 0.03) 0%,
    transparent 70%
  );
}

/* Grid Floor */
.grid-floor {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 200px;
  background: 
    linear-gradient(to top, rgba(16, 185, 129, 0.05), transparent),
    repeating-linear-gradient(
      90deg,
      rgba(16, 185, 129, 0.03) 0px,
      rgba(16, 185, 129, 0.03) 1px,
      transparent 1px,
      transparent 50px
    ),
    repeating-linear-gradient(
      0deg,
      rgba(16, 185, 129, 0.03) 0px,
      rgba(16, 185, 129, 0.03) 1px,
      transparent 1px,
      transparent 50px
    );
  transform: perspective(500px) rotateX(60deg);
  transform-origin: bottom;
}
</style>
