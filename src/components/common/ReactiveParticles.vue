<template>
  <canvas 
    ref="canvasRef" 
    class="reactive-particles"
    :class="'theme--' + currentTheme"
    aria-hidden="true"
  ></canvas>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const canvasRef = ref(null);
let ctx = null;
let particles = [];
let animationId = null;
let mouseX = 0;
let mouseY = 0;
let isMouseInWindow = false;

// Thème actuel
const currentTheme = computed(() => {
  const path = route.path;
  if (path.includes('matrix')) return 'matrix';
  if (path.includes('tron')) return 'tron';
  if (path.includes('blade-runner')) return 'bladerunner';
  if (path.includes('inception')) return 'inception';
  if (path.includes('ghost')) return 'ghost';
  if (path.includes('minority')) return 'minority';
  if (path.includes('iron-man')) return 'ironman';
  if (path.includes('dragon-ball')) return 'dbz';
  if (path.includes('deadpool')) return 'deadpool';
  if (path.includes('mask')) return 'mask';
  if (path.includes('vendetta')) return 'vendetta';
  if (path.includes('ready-player')) return 'oasis';
  if (path.includes('multivers')) return 'multivers';
  return 'default';
});

// Configuration des particules par thème
const themeConfigs = {
  default: {
    color: '#10B981',
    particleCount: 50,
    particleSize: [2, 4],
    speed: 1,
    shape: 'circle',
    trail: false,
    glow: true
  },
  matrix: {
    color: '#00ff41',
    particleCount: 80,
    particleSize: [1, 3],
    speed: 2,
    shape: 'code',
    trail: true,
    glow: true,
    characters: '01アイウエオカキクケコ'
  },
  tron: {
    color: '#00d4ff',
    particleCount: 40,
    particleSize: [2, 5],
    speed: 1.5,
    shape: 'square',
    trail: true,
    glow: true
  },
  bladerunner: {
    color: '#ff6b2b',
    particleCount: 100,
    particleSize: [1, 2],
    speed: 3,
    shape: 'rain',
    trail: false,
    glow: false
  },
  inception: {
    color: '#d4af37',
    particleCount: 30,
    particleSize: [3, 6],
    speed: 0.5,
    shape: 'circle',
    trail: false,
    glow: true
  },
  ghost: {
    color: '#9d4edd',
    particleCount: 60,
    particleSize: [1, 4],
    speed: 1.2,
    shape: 'hex',
    trail: true,
    glow: true
  },
  minority: {
    color: '#4fc3f7',
    particleCount: 45,
    particleSize: [2, 4],
    speed: 1,
    shape: 'circle',
    trail: false,
    glow: true
  },
  ironman: {
    color: '#ff3d00',
    secondaryColor: '#ffd600',
    particleCount: 55,
    particleSize: [2, 5],
    speed: 1.8,
    shape: 'spark',
    trail: true,
    glow: true
  },
  dbz: {
    color: '#ff9800',
    secondaryColor: '#ffeb3b',
    particleCount: 70,
    particleSize: [2, 6],
    speed: 2.5,
    shape: 'ki',
    trail: true,
    glow: true
  },
  deadpool: {
    color: '#e53935',
    particleCount: 50,
    particleSize: [2, 4],
    speed: 1.5,
    shape: 'circle',
    trail: false,
    glow: true
  },
  mask: {
    color: '#76ff03',
    secondaryColor: '#ffeb3b',
    particleCount: 60,
    particleSize: [3, 7],
    speed: 3,
    shape: 'star',
    trail: false,
    glow: true
  },
  vendetta: {
    color: '#b71c1c',
    particleCount: 40,
    particleSize: [1, 3],
    speed: 0.8,
    shape: 'ember',
    trail: true,
    glow: true
  },
  oasis: {
    color: '#ff00ff',
    secondaryColor: '#00ffff',
    particleCount: 80,
    particleSize: [2, 5],
    speed: 2,
    shape: 'pixel',
    trail: false,
    glow: true
  },
  multivers: {
    color: '#a855f7',
    particleCount: 60,
    particleSize: [2, 5],
    speed: 1.5,
    shape: 'portal',
    trail: true,
    glow: true,
    rainbow: true
  }
};

// Classe Particle
class Particle {
  constructor(x, y, config) {
    this.x = x;
    this.y = y;
    this.config = config;
    this.size = config.particleSize[0] + Math.random() * (config.particleSize[1] - config.particleSize[0]);
    this.speedX = (Math.random() - 0.5) * config.speed * 2;
    this.speedY = (Math.random() - 0.5) * config.speed * 2;
    this.life = 1;
    this.decay = 0.01 + Math.random() * 0.02;
    this.color = config.rainbow ? this.getRandomColor() : config.color;
    this.angle = Math.random() * Math.PI * 2;
    this.character = config.characters ? config.characters[Math.floor(Math.random() * config.characters.length)] : null;
    
    // Pour les trails
    this.trail = config.trail ? [] : null;
    this.maxTrail = 8;
  }
  
  getRandomColor() {
    const colors = ['#00ff41', '#00d4ff', '#9d4edd', '#ff00ff', '#ff6b2b', '#ffd700'];
    return colors[Math.floor(Math.random() * colors.length)];
  }
  
  update(mouseX, mouseY) {
    // Attraction vers la souris
    const dx = mouseX - this.x;
    const dy = mouseY - this.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    
    if (dist < 150) {
      const force = (150 - dist) / 150;
      this.speedX += (dx / dist) * force * 0.3;
      this.speedY += (dy / dist) * force * 0.3;
    }
    
    // Trail
    if (this.trail) {
      this.trail.unshift({ x: this.x, y: this.y });
      if (this.trail.length > this.maxTrail) {
        this.trail.pop();
      }
    }
    
    // Mouvement
    this.x += this.speedX;
    this.y += this.speedY;
    
    // Friction
    this.speedX *= 0.98;
    this.speedY *= 0.98;
    
    // Decay
    this.life -= this.decay;
    
    // Rotation pour certaines formes
    this.angle += 0.02;
  }
  
  draw(ctx) {
    ctx.save();
    ctx.globalAlpha = this.life;
    
    // Glow effect
    if (this.config.glow) {
      ctx.shadowColor = this.color;
      ctx.shadowBlur = 10;
    }
    
    ctx.fillStyle = this.color;
    ctx.strokeStyle = this.color;
    
    // Trail
    if (this.trail && this.trail.length > 1) {
      ctx.beginPath();
      ctx.moveTo(this.trail[0].x, this.trail[0].y);
      for (let i = 1; i < this.trail.length; i++) {
        ctx.lineTo(this.trail[i].x, this.trail[i].y);
      }
      ctx.strokeStyle = this.color;
      ctx.lineWidth = this.size * 0.5;
      ctx.globalAlpha = this.life * 0.3;
      ctx.stroke();
      ctx.globalAlpha = this.life;
    }
    
    ctx.translate(this.x, this.y);
    
    switch (this.config.shape) {
      case 'square':
        ctx.rotate(this.angle);
        ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
        break;
        
      case 'code':
        ctx.font = `${this.size * 4}px monospace`;
        ctx.fillText(this.character, 0, 0);
        break;
        
      case 'rain':
        ctx.beginPath();
        ctx.moveTo(0, -this.size * 2);
        ctx.lineTo(0, this.size * 2);
        ctx.lineWidth = 1;
        ctx.stroke();
        break;
        
      case 'hex':
        this.drawHex(ctx, this.size);
        break;
        
      case 'spark':
        this.drawSpark(ctx, this.size);
        break;
        
      case 'ki':
        this.drawKi(ctx, this.size);
        break;
        
      case 'star':
        this.drawStar(ctx, this.size, 5);
        break;
        
      case 'ember':
        ctx.beginPath();
        ctx.arc(0, 0, this.size, 0, Math.PI * 2);
        ctx.fill();
        // Petite queue
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(-this.speedX * 3, -this.speedY * 3);
        ctx.lineWidth = this.size * 0.5;
        ctx.stroke();
        break;
        
      case 'pixel':
        ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
        break;
        
      case 'portal':
        ctx.rotate(this.angle * 2);
        ctx.beginPath();
        ctx.arc(0, 0, this.size, 0, Math.PI * 1.5);
        ctx.lineWidth = 2;
        ctx.stroke();
        break;
        
      default: // circle
        ctx.beginPath();
        ctx.arc(0, 0, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
    
    ctx.restore();
  }
  
  drawHex(ctx, size) {
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i;
      const x = Math.cos(angle) * size;
      const y = Math.sin(angle) * size;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.stroke();
  }
  
  drawSpark(ctx, size) {
    ctx.beginPath();
    for (let i = 0; i < 4; i++) {
      const angle = (Math.PI / 2) * i + this.angle;
      ctx.moveTo(0, 0);
      ctx.lineTo(Math.cos(angle) * size * 2, Math.sin(angle) * size * 2);
    }
    ctx.lineWidth = 1;
    ctx.stroke();
  }
  
  drawKi(ctx, size) {
    // Aura ki style DBZ
    ctx.beginPath();
    ctx.arc(0, 0, size, 0, Math.PI * 2);
    ctx.fill();
    
    // Flammes
    ctx.globalAlpha *= 0.5;
    ctx.beginPath();
    ctx.arc(0, -size, size * 0.6, 0, Math.PI * 2);
    ctx.fill();
  }
  
  drawStar(ctx, size, points) {
    ctx.beginPath();
    ctx.rotate(this.angle);
    for (let i = 0; i < points * 2; i++) {
      const radius = i % 2 === 0 ? size : size / 2;
      const angle = (Math.PI / points) * i;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fill();
  }
}

// Initialisation
const init = () => {
  const canvas = canvasRef.value;
  if (!canvas) return;
  
  ctx = canvas.getContext('2d');
  resize();
  particles = [];
};

// Resize
const resize = () => {
  const canvas = canvasRef.value;
  if (!canvas) return;
  
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
};

// Spawn particles près de la souris
const spawnParticles = (x, y, count = 3) => {
  const config = themeConfigs[currentTheme.value] || themeConfigs.default;
  
  for (let i = 0; i < count; i++) {
    const offsetX = (Math.random() - 0.5) * 20;
    const offsetY = (Math.random() - 0.5) * 20;
    particles.push(new Particle(x + offsetX, y + offsetY, config));
  }
  
  // Limiter le nombre de particules
  if (particles.length > config.particleCount) {
    particles = particles.slice(-config.particleCount);
  }
};

// Animation loop
const animate = () => {
  if (!ctx || !canvasRef.value) return;
  
  ctx.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height);
  
  // Update et draw particles
  particles = particles.filter(p => p.life > 0);
  
  particles.forEach(p => {
    p.update(mouseX, mouseY);
    p.draw(ctx);
  });
  
  // Spawn continu si souris dans la fenêtre
  if (isMouseInWindow && Math.random() > 0.7) {
    spawnParticles(mouseX, mouseY, 1);
  }
  
  animationId = requestAnimationFrame(animate);
};

// Event handlers
const handleMouseMove = (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  isMouseInWindow = true;
  
  // Spawn on move
  if (Math.random() > 0.5) {
    spawnParticles(mouseX, mouseY, 2);
  }
};

const handleMouseLeave = () => {
  isMouseInWindow = false;
};

const handleClick = (e) => {
  // Burst on click
  spawnParticles(e.clientX, e.clientY, 15);
};

// Lifecycle
onMounted(() => {
  // Check reduced motion preference
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }
  
  init();
  animate();
  
  window.addEventListener('resize', resize);
  window.addEventListener('mousemove', handleMouseMove);
  window.addEventListener('mouseleave', handleMouseLeave);
  window.addEventListener('click', handleClick);
});

onUnmounted(() => {
  if (animationId) {
    cancelAnimationFrame(animationId);
  }
  
  window.removeEventListener('resize', resize);
  window.removeEventListener('mousemove', handleMouseMove);
  window.removeEventListener('mouseleave', handleMouseLeave);
  window.removeEventListener('click', handleClick);
});

// Reset particles on theme change
watch(currentTheme, () => {
  particles = [];
});
</script>

<style scoped>
.reactive-particles {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 9998;
}

/* Hide on touch devices */
@media (pointer: coarse) {
  .reactive-particles {
    display: none;
  }
}

/* A11Y - Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .reactive-particles {
    display: none;
  }
}
</style>
