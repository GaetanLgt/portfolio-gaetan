<template>
  <canvas 
    ref="canvasRef" 
    class="confetti-canvas"
    aria-hidden="true"
  ></canvas>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const canvasRef = ref(null);
let ctx = null;
let particles = [];
let animationId = null;

// Confetti Particle
class ConfettiParticle {
  constructor(x, y, color, options = {}) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.size = options.size || Math.random() * 10 + 5;
    this.speedX = (Math.random() - 0.5) * (options.spread || 15);
    this.speedY = Math.random() * -15 - 5;
    this.gravity = options.gravity || 0.5;
    this.rotation = Math.random() * 360;
    this.rotationSpeed = (Math.random() - 0.5) * 10;
    this.opacity = 1;
    this.decay = options.decay || 0.01;
    this.shape = options.shapes 
      ? options.shapes[Math.floor(Math.random() * options.shapes.length)]
      : ['square', 'circle', 'triangle'][Math.floor(Math.random() * 3)];
    this.wobble = Math.random() * 10;
    this.wobbleSpeed = Math.random() * 0.1 + 0.05;
  }

  update() {
    this.speedY += this.gravity;
    this.x += this.speedX + Math.sin(this.wobble) * 2;
    this.y += this.speedY;
    this.rotation += this.rotationSpeed;
    this.wobble += this.wobbleSpeed;
    this.opacity -= this.decay;
    
    // Air resistance
    this.speedX *= 0.99;
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate((this.rotation * Math.PI) / 180);
    ctx.globalAlpha = this.opacity;
    ctx.fillStyle = this.color;

    switch (this.shape) {
      case 'square':
        ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
        break;
      case 'circle':
        ctx.beginPath();
        ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
        ctx.fill();
        break;
      case 'triangle':
        ctx.beginPath();
        ctx.moveTo(0, -this.size / 2);
        ctx.lineTo(this.size / 2, this.size / 2);
        ctx.lineTo(-this.size / 2, this.size / 2);
        ctx.closePath();
        ctx.fill();
        break;
      case 'star':
        this.drawStar(ctx, this.size / 2);
        break;
      case 'ribbon':
        ctx.fillRect(-this.size / 4, -this.size, this.size / 2, this.size * 2);
        break;
    }

    ctx.restore();
  }

  drawStar(ctx, size) {
    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
      const angle = (i * 4 * Math.PI) / 5 - Math.PI / 2;
      const x = Math.cos(angle) * size;
      const y = Math.sin(angle) * size;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fill();
  }
}

// Initialize
const init = () => {
  const canvas = canvasRef.value;
  if (!canvas) return;

  ctx = canvas.getContext('2d');
  resize();
};

const resize = () => {
  const canvas = canvasRef.value;
  if (!canvas) return;

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
};

// Animation loop
const animate = () => {
  if (!ctx || !canvasRef.value) return;

  ctx.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height);

  particles = particles.filter((p) => p.opacity > 0 && p.y < canvasRef.value.height + 100);

  particles.forEach((p) => {
    p.update();
    p.draw(ctx);
  });

  if (particles.length > 0) {
    animationId = requestAnimationFrame(animate);
  } else {
    animationId = null;
  }
};

// Fire confetti
const fire = (options = {}) => {
  const {
    x = window.innerWidth / 2,
    y = window.innerHeight / 2,
    count = 100,
    colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ffd700', '#ff6b6b'],
    spread = 15,
    gravity = 0.5,
    decay = 0.01,
    shapes = ['square', 'circle', 'triangle'],
    size = null
  } = options;

  for (let i = 0; i < count; i++) {
    const color = colors[Math.floor(Math.random() * colors.length)];
    particles.push(
      new ConfettiParticle(x, y, color, {
        spread,
        gravity,
        decay,
        shapes,
        size
      })
    );
  }

  if (!animationId) {
    animate();
  }
};

// Presets
const celebration = () => {
  // Burst from multiple points
  const positions = [
    { x: window.innerWidth * 0.2, y: window.innerHeight },
    { x: window.innerWidth * 0.5, y: window.innerHeight },
    { x: window.innerWidth * 0.8, y: window.innerHeight }
  ];

  positions.forEach((pos, i) => {
    setTimeout(() => {
      fire({
        x: pos.x,
        y: pos.y,
        count: 80,
        spread: 20,
        gravity: 0.4
      });
    }, i * 150);
  });
};

const achievement = () => {
  // Golden confetti burst from center
  fire({
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
    count: 150,
    colors: ['#ffd700', '#ffb700', '#ff9500', '#fff4b0', '#ffe066'],
    spread: 25,
    gravity: 0.3,
    shapes: ['star', 'circle', 'square']
  });
};

const legendary = () => {
  // Epic rainbow explosion
  const colors = [
    '#ff0000', '#ff7f00', '#ffff00', '#00ff00', 
    '#0000ff', '#4b0082', '#9400d3', '#ffd700'
  ];
  
  // Multiple waves
  for (let wave = 0; wave < 3; wave++) {
    setTimeout(() => {
      fire({
        x: window.innerWidth / 2,
        y: window.innerHeight / 3,
        count: 100,
        colors,
        spread: 30 + wave * 5,
        gravity: 0.35,
        shapes: ['star', 'circle', 'triangle', 'ribbon']
      });
    }, wave * 200);
  }
};

const sides = () => {
  // From both sides
  fire({ x: 0, y: window.innerHeight / 2, count: 60, spread: 10 });
  fire({ x: window.innerWidth, y: window.innerHeight / 2, count: 60, spread: 10 });
};

// Event listener
const handleConfettiEvent = (e) => {
  const preset = e.detail?.preset || 'celebration';
  
  switch (preset) {
    case 'achievement':
      achievement();
      break;
    case 'legendary':
      legendary();
      break;
    case 'sides':
      sides();
      break;
    case 'custom':
      fire(e.detail.options);
      break;
    default:
      celebration();
  }
};

// Expose methods
defineExpose({
  fire,
  celebration,
  achievement,
  legendary,
  sides
});

onMounted(() => {
  // Check reduced motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  init();
  window.addEventListener('resize', resize);
  window.addEventListener('confetti', handleConfettiEvent);
});

onUnmounted(() => {
  if (animationId) {
    cancelAnimationFrame(animationId);
  }
  window.removeEventListener('resize', resize);
  window.removeEventListener('confetti', handleConfettiEvent);
});
</script>

<style scoped>
.confetti-canvas {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 99997;
}

@media (prefers-reduced-motion: reduce) {
  .confetti-canvas {
    display: none;
  }
}
</style>
