<template>
  <div class="feed-atmosphere">
    <div class="grid-floor"></div>
    <div class="scan-line"></div>
    <div class="noise-overlay"></div>
    <div class="glow-orbs">
      <div class="orb orb-1"></div>
      <div class="orb orb-2"></div>
      <div class="orb orb-3"></div>
    </div>
  </div>
</template>

<script setup>
// Pure visual component - no logic needed
</script>

<style scoped>
.feed-atmosphere {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
}

.grid-floor {
  position: absolute;
  inset: 0;
  background: 
    linear-gradient(90deg, rgba(0, 255, 136, 0.03) 1px, transparent 1px),
    linear-gradient(rgba(0, 255, 136, 0.03) 1px, transparent 1px);
  background-size: 50px 50px;
  transform: perspective(500px) rotateX(60deg);
  transform-origin: center 120%;
  opacity: 0.5;
}

.scan-line {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, #00ff88, transparent);
  animation: scanDown 4s linear infinite;
  opacity: 0.3;
}

@keyframes scanDown {
  0% { top: 0; }
  100% { top: 100%; }
}

.noise-overlay {
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
  opacity: 0.03;
  mix-blend-mode: overlay;
}

.glow-orbs {
  position: absolute;
  inset: 0;
}

.orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.15;
  animation: orbFloat 20s ease-in-out infinite;
}

.orb-1 {
  width: 400px;
  height: 400px;
  background: #00ff88;
  top: -100px;
  right: -100px;
}

.orb-2 {
  width: 300px;
  height: 300px;
  background: #00ffff;
  bottom: -50px;
  left: 10%;
  animation-delay: -7s;
}

.orb-3 {
  width: 250px;
  height: 250px;
  background: #bf00ff;
  top: 40%;
  left: -50px;
  animation-delay: -14s;
}

@keyframes orbFloat {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(30px, -20px) scale(1.1); }
  66% { transform: translate(-20px, 30px) scale(0.9); }
}
</style>
