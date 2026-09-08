<template>
  <div class="agents-hub">
    <!-- Skip Link -->
    <a href="#main-content" class="skip-link">Aller au contenu principal</a>
    
    <!-- Hero -->
    <section class="hub-hero" id="main-content">
      <div class="container">
        <div class="hub-hero__content">
          <div class="hub-hero__badge">
            <span class="badge-dot"></span>
            <span>{{ activeAgents }} AGENTS EN LIGNE</span>
          </div>
          
          <h1 class="hub-hero__title">
            <span class="title-prefix">GL</span>
            <span class="text-gradient">TOWER</span>
          </h1>
          
          <p class="hub-hero__tagline">Bureau des Agents IA</p>
          
          <p class="hub-hero__desc">
            {{ mainAgents.length }} Lois gravitent autour de votre projet.
            De l'orchestration à la mémoire, chacune couvre un domaine critique.
          </p>
        </div>
      </div>
    </section>
    
    <!-- L'ÉQUIPAGE : les 6 Lois -->
    <section class="zone-section zone--main" aria-labelledby="zone-main-title">
      <div class="container">
        <div class="zone-header">
          <div class="zone-icon">🏢</div>
          <div class="zone-info">
            <h2 id="zone-main-title">L'Équipage — Six Lois</h2>
            <p>Six principes, un cercle autour de vous. La machine travaille, l'humain décide.</p>
          </div>
          <div class="zone-floors">Penthouse → Lobby</div>
        </div>
        
        <div class="agents-list">
          <AgentCard 
            v-for="agent in mainAgents" 
            :key="agent.id" 
            :agent="agent"
            :avatar-src="lawAvatarUrl(agent)"
          />
        </div>
      </div>
    </section>
    
    <!-- LOBBY -->
    <section class="lobby-section" aria-label="Lobby">
      <div class="container">
        <div class="lobby-card glass">
          <div class="lobby-level">0</div>
          <div class="lobby-icon">🚪</div>
          <div class="lobby-content">
            <h3>LOBBY</h3>
            <p>Accueil Visiteurs</p>
            <p class="lobby-desc">Point d'entrée de GL Tower. Découvrez nos services et planifiez un audit.</p>          </div>
          <div class="lobby-links">
            <router-link to="/services" class="lobby-link">Services</router-link>
            <router-link to="/contact" class="lobby-link lobby-link--primary">Réserver un Audit</router-link>
          </div>
        </div>
      </div>
    </section>
    
    <!-- Quick Nav -->
    <section class="quick-nav-section">
      <div class="container">
        <h3>Accès Rapide</h3>
        <div class="quick-nav">
          <router-link 
            v-for="agent in agents.filter(a => !a.isLobby)" 
            :key="agent.id"
            :to="`/agents/${agent.id}`"
            class="quick-chip"
            :style="{ '--chip-color': agent.color }"
          >
            <span class="chip-avatar">{{ agent.avatar }}</span>
            <span class="chip-name">{{ agent.roman }}</span>
          </router-link>
        </div>
      </div>
    </section>
    
    <!-- Back Link -->
    <div class="back-section">
      <router-link to="/" class="back-link">
        ← Retour à l'accueil
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { agents } from '@/data/agents';
import AgentCard from '@/components/agents/AgentCard.vue';
import { lawAvatarUrl } from '@/data/mndAssets';

// Les agents de l'Équipage (hors lobby), triés du Penthouse vers les étages bas
const mainAgents = computed(() => 
  agents.filter(a => !a.isLobby).sort((a, b) => b.floor - a.floor)
);

// Stats
const activeAgents = computed(() => agents.filter(a => a.status === 'active' && !a.isLobby).length);
</script>

<style scoped>
.agents-hub {
  min-height: 100vh;
  padding-bottom: var(--space-xl);
}

/* Skip Link */
.skip-link {
  position: absolute;
  top: -100px;
  left: 50%;
  transform: translateX(-50%);
  padding: 1rem 2rem;
  background: var(--primary);
  color: #000;
  font-weight: 600;
  text-decoration: none;
  border-radius: 0 0 0.5rem 0.5rem;
  z-index: 9999;
  transition: top 0.3s ease;
}

.skip-link:focus {
  top: 0;
}

/* Hero */
.hub-hero {
  padding: calc(80px + var(--space-xl)) 0 var(--space-lg);
  text-align: center;
}

.hub-hero__badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.3);
  border-radius: 2rem;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.7rem;
  color: var(--primary);
  letter-spacing: 0.1em;
  margin-bottom: 1.5rem;
}

.badge-dot {
  width: 8px;
  height: 8px;
  background: var(--primary);
  border-radius: 50%;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(1.2); }
}

.hub-hero__title {
  font-size: clamp(3rem, 8vw, 5rem);
  font-weight: 700;
  line-height: 1;
  margin-bottom: 0.5rem;
}

.title-prefix {
  color: var(--text-muted);
  font-weight: 400;
}

.text-gradient {
  background: linear-gradient(135deg, #FBBF24, #F59E0B);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hub-hero__tagline {
  font-family: 'JetBrains Mono', monospace;
  font-size: 1rem;
  color: var(--primary);
  letter-spacing: 0.1em;
  margin-bottom: 1rem;
}

.hub-hero__desc {
  font-size: 1rem;
  color: var(--text-muted);
  max-width: 500px;
  margin: 0 auto;
}

/* Zone Sections */
.zone-section {
  padding: var(--space-lg) 0;
}

.zone-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: var(--space-lg);
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border);
}

.zone-icon {
  font-size: 2rem;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 1rem;
}

.zone-info h2 {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
}

.zone-info p {
  font-size: 0.85rem;
  color: var(--text-muted);
}

.zone-floors {
  margin-left: auto;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.75rem;
  color: var(--text-muted);
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 2rem;
}

/* Agents List */
.agents-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* Lobby */
.lobby-section {
  padding: var(--space-md) 0;
}

.lobby-card {
  display: grid;
  grid-template-columns: auto auto 1fr auto;
  align-items: center;
  gap: 1.5rem;
  padding: 1.5rem 2rem;
  border-radius: 1rem;
  border: 1px solid var(--border);
  background: rgba(100, 116, 139, 0.05);
}

.lobby-level {
  font-family: 'JetBrains Mono', monospace;
  font-size: 1.5rem;
  font-weight: 700;
  color: #64748B;
  width: 50px;
  text-align: center;
}

.lobby-icon {
  font-size: 2.5rem;
}

.lobby-content h3 {
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
}

.lobby-content p {
  font-size: 0.85rem;
  color: var(--text-muted);
}

.lobby-desc {
  margin-top: 0.5rem;
  max-width: 400px;
}

.lobby-links {
  display: flex;
  gap: 1rem;
}

.lobby-link {
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.8rem;
  text-decoration: none;
  transition: all 0.3s ease;
  border: 1px solid var(--border);
  color: var(--text-main);
}

.lobby-link:hover {
  border-color: var(--primary);
  color: var(--primary);
}

.lobby-link--primary {
  background: var(--primary);
  border-color: var(--primary);
  color: #000;
}

.lobby-link--primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(16, 185, 129, 0.2);
}

/* Zone Separator */
.zone-separator {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: var(--space-lg) 0;
}

.separator-line {
  flex: 1;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--border), transparent);
}

.separator-text {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.8rem;
  color: var(--text-muted);
  white-space: nowrap;
}

/* Zone Variants */
.zone--devlab {
  background: rgba(20, 184, 166, 0.02);
}

.zone--backoffice {
  background: rgba(249, 115, 22, 0.02);
}

/* Quick Nav */
.quick-nav-section {
  padding: var(--space-lg) 0;
  text-align: center;
}

.quick-nav-section h3 {
  font-size: 1rem;
  color: var(--text-muted);
  margin-bottom: 1rem;
}

.quick-nav {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.5rem;
}

.quick-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--border);
  border-radius: 2rem;
  text-decoration: none;
  transition: all 0.3s ease;
}

.quick-chip:hover {
  border-color: var(--chip-color);
  background: rgba(var(--chip-color), 0.1);
}

.chip-avatar {
  font-size: 1rem;
}

.chip-name {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.7rem;
  color: var(--chip-color);
}

/* Back Section */
.back-section {
  text-align: center;
  padding: var(--space-lg) 0;
}

.back-link {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.85rem;
  color: var(--text-muted);
  text-decoration: none;
  transition: color 0.3s ease;
}

.back-link:hover {
  color: var(--primary);
}

/* Utilities */
.glass {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(10px);
}

/* Responsive */
@media (max-width: 768px) {
  .zone-header {
    flex-wrap: wrap;
  }
  
  .zone-floors {
    margin-left: 0;
    width: 100%;
    text-align: center;
    margin-top: 0.5rem;
  }
  
  .lobby-card {
    grid-template-columns: 1fr;
    text-align: center;
  }
  
  .lobby-links {
    justify-content: center;
  }
}

/* Reduced Motion */
@media (prefers-reduced-motion: reduce) {
  .badge-dot {
    animation: none;
  }
}
</style>
