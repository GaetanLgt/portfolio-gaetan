<template>
  <div class="not-found">
    <div class="container">
      <div class="not-found__content">
        <!-- Glitch Effect Title -->
        <div class="not-found__code">
          <span class="glitch" data-text="404">404</span>
        </div>
        
        <!-- Status -->
        <div class="not-found__status">
          <span class="status-indicator"></span>
          <span class="status-text">CONNEXION INTERROMPUE</span>
        </div>
        
        <!-- Message -->
        <h1 class="not-found__title">
          Signal <span class="text-gradient">Perdu</span>
        </h1>
        
        <p class="not-found__desc">
          La page que vous cherchez n'existe pas, a été déplacée, 
          ou vous n'avez pas les clearances nécessaires.
        </p>
        
        <!-- Terminal -->
        <div class="not-found__terminal glass">
          <div class="terminal-line">
            <span class="prompt">$</span> 
            <span class="command">locate {{ currentPath }}</span>
          </div>
          <div class="terminal-line terminal-line--error">
            <span class="prefix">[ERROR]</span> 
            <span>Resource not found in cluster</span>
          </div>
          <div class="terminal-line">
            <span class="prompt">$</span> 
            <span class="command">suggest --alternatives</span>
          </div>
          <div class="terminal-line terminal-line--success">
            <span class="prefix">[OK]</span> 
            <span>Redirecting to safe zone...</span>
          </div>
        </div>
        
        <!-- Actions -->
        <div class="not-found__actions">
          <MagneticButton to="/" variant="primary">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
            RETOUR AU HUB
          </MagneticButton>
          
          <MagneticButton to="/contact" variant="outline">
            SIGNALER UN PROBLÈME
          </MagneticButton>
        </div>
        
        <!-- Quick Links -->
        <div class="not-found__links">
          <span class="links-label">Accès rapide :</span>
          <router-link to="/services">Services</router-link>
          <router-link to="/arkadia">Case Study</router-link>
          <router-link to="/parcours">Parcours</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import MagneticButton from '@/components/common/MagneticButton.vue';

const route = useRoute();
const currentPath = computed(() => route.fullPath);
</script>

<style scoped>
.not-found {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  text-align: center;
}

.not-found__content {
  max-width: 600px;
}

/* Glitch Effect */
.not-found__code {
  margin-bottom: var(--space-md);
}

.glitch {
  font-family: 'JetBrains Mono', monospace;
  font-size: clamp(6rem, 20vw, 12rem);
  font-weight: 900;
  color: var(--primary);
  position: relative;
  text-shadow: 
    0 0 10px rgba(16, 185, 129, 0.8),
    0 0 20px rgba(16, 185, 129, 0.6),
    0 0 40px rgba(16, 185, 129, 0.4);
  animation: glitch-skew 4s infinite linear alternate-reverse;
}

.glitch::before,
.glitch::after {
  content: attr(data-text);
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.glitch::before {
  left: 2px;
  text-shadow: -2px 0 #EF4444;
  clip: rect(44px, 450px, 56px, 0);
  animation: glitch-anim 5s infinite linear alternate-reverse;
}

.glitch::after {
  left: -2px;
  text-shadow: -2px 0 #3B82F6;
  clip: rect(44px, 450px, 56px, 0);
  animation: glitch-anim2 5s infinite linear alternate-reverse;
}

@keyframes glitch-anim {
  0% { clip: rect(31px, 9999px, 94px, 0); }
  5% { clip: rect(70px, 9999px, 71px, 0); }
  10% { clip: rect(29px, 9999px, 24px, 0); }
  15% { clip: rect(69px, 9999px, 64px, 0); }
  20% { clip: rect(14px, 9999px, 1px, 0); }
  25% { clip: rect(22px, 9999px, 98px, 0); }
  30% { clip: rect(88px, 9999px, 91px, 0); }
  35% { clip: rect(49px, 9999px, 16px, 0); }
  40% { clip: rect(29px, 9999px, 40px, 0); }
  45% { clip: rect(65px, 9999px, 100px, 0); }
  50% { clip: rect(82px, 9999px, 28px, 0); }
  55% { clip: rect(31px, 9999px, 71px, 0); }
  60% { clip: rect(92px, 9999px, 38px, 0); }
  65% { clip: rect(58px, 9999px, 35px, 0); }
  70% { clip: rect(48px, 9999px, 47px, 0); }
  75% { clip: rect(42px, 9999px, 88px, 0); }
  80% { clip: rect(67px, 9999px, 99px, 0); }
  85% { clip: rect(33px, 9999px, 13px, 0); }
  90% { clip: rect(94px, 9999px, 57px, 0); }
  95% { clip: rect(18px, 9999px, 54px, 0); }
  100% { clip: rect(45px, 9999px, 77px, 0); }
}

@keyframes glitch-anim2 {
  0% { clip: rect(65px, 9999px, 100px, 0); }
  5% { clip: rect(52px, 9999px, 74px, 0); }
  10% { clip: rect(79px, 9999px, 85px, 0); }
  15% { clip: rect(75px, 9999px, 5px, 0); }
  20% { clip: rect(67px, 9999px, 61px, 0); }
  25% { clip: rect(14px, 9999px, 79px, 0); }
  30% { clip: rect(1px, 9999px, 66px, 0); }
  35% { clip: rect(86px, 9999px, 30px, 0); }
  40% { clip: rect(23px, 9999px, 98px, 0); }
  45% { clip: rect(85px, 9999px, 72px, 0); }
  50% { clip: rect(71px, 9999px, 75px, 0); }
  55% { clip: rect(2px, 9999px, 48px, 0); }
  60% { clip: rect(30px, 9999px, 16px, 0); }
  65% { clip: rect(59px, 9999px, 50px, 0); }
  70% { clip: rect(41px, 9999px, 62px, 0); }
  75% { clip: rect(2px, 9999px, 82px, 0); }
  80% { clip: rect(47px, 9999px, 73px, 0); }
  85% { clip: rect(3px, 9999px, 27px, 0); }
  90% { clip: rect(26px, 9999px, 55px, 0); }
  95% { clip: rect(42px, 9999px, 25px, 0); }
  100% { clip: rect(38px, 9999px, 49px, 0); }
}

@keyframes glitch-skew {
  0% { transform: skew(0deg); }
  20% { transform: skew(0deg); }
  21% { transform: skew(1deg); }
  22% { transform: skew(-1deg); }
  23% { transform: skew(0deg); }
  100% { transform: skew(0deg); }
}

/* Status */
.not-found__status {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 2rem;
  margin-bottom: var(--space-md);
}

.status-indicator {
  width: 8px;
  height: 8px;
  background: #EF4444;
  border-radius: 50%;
  animation: blink 1s infinite;
}

@keyframes blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0.3; }
}

.status-text {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.65rem;
  color: #EF4444;
  letter-spacing: 0.1em;
}

/* Title */
.not-found__title {
  font-size: clamp(1.5rem, 5vw, 2.5rem);
  font-weight: 700;
  margin-bottom: var(--space-sm);
}

.not-found__desc {
  font-size: 1rem;
  color: var(--text-muted);
  line-height: 1.7;
  margin-bottom: var(--space-lg);
}

/* Terminal */
.not-found__terminal {
  text-align: left;
  padding: 1rem 1.5rem;
  border-radius: 0.5rem;
  margin-bottom: var(--space-lg);
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.75rem;
  border: 1px solid var(--border);
}

.terminal-line {
  padding: 0.25rem 0;
  color: var(--text-muted);
}

.terminal-line--error {
  color: #EF4444;
}

.terminal-line--success {
  color: var(--primary);
}

.prompt {
  color: var(--primary);
  margin-right: 0.5rem;
}

.prefix {
  margin-right: 0.5rem;
  font-weight: 600;
}

.command {
  color: var(--text-main);
}

/* Actions */
.not-found__actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: var(--space-sm);
  margin-bottom: var(--space-lg);
}

/* Quick Links */
.not-found__links {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.8rem;
}

.links-label {
  color: var(--text-dark);
}

.not-found__links a {
  color: var(--text-muted);
  text-decoration: none;
  transition: color 0.2s ease;
}

.not-found__links a:hover {
  color: var(--primary);
}

/* Responsive */
@media (max-width: 640px) {
  .not-found__terminal {
    font-size: 0.65rem;
    padding: 0.75rem 1rem;
  }
  
  .not-found__actions {
    flex-direction: column;
  }
}

/* Reduce motion */
@media (prefers-reduced-motion: reduce) {
  .glitch::before,
  .glitch::after {
    animation: none;
  }
  
  .glitch {
    animation: none;
  }
  
  .status-indicator {
    animation: none;
  }
}
</style>
