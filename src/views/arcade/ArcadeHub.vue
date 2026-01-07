<template>
  <div class="arcade-page">
    <!-- HERO -->
    <section class="arcade-hero">
      <div class="arcade-hero__bg">
        <div class="scanlines"></div>
        <div class="grid-bg"></div>
      </div>
      
      <div class="container">
        <div class="arcade-hero__content">
          <div class="arcade-logo">
            <span class="arcade-logo__icon">🕹️</span>
            <div class="arcade-logo__text">
              <h1>NEO'S <span class="text-gradient">ARCADE</span></h1>
              <p class="arcade-logo__tagline">// EXPLORE MY UNIVERSE</p>
            </div>
          </div>
          
          <p class="arcade-hero__desc">
            Bienvenue dans l'arcade. Chaque jeu est une nouvelle façon d'explorer 
            mes projets, compétences et créations. Choisis ton aventure.
          </p>
          
          <div class="arcade-stats">
            <div class="arcade-stat">
              <span class="arcade-stat__value">{{ games.length }}</span>
              <span class="arcade-stat__label">GAMES</span>
            </div>
            <div class="arcade-stat">
              <span class="arcade-stat__value">10</span>
              <span class="arcade-stat__label">PROJECTS</span>
            </div>
            <div class="arcade-stat">
              <span class="arcade-stat__value">∞</span>
              <span class="arcade-stat__label">FUN</span>
            </div>
          </div>
        </div>
      </div>
    </section>
    
    <!-- GAMES GRID -->
    <section class="arcade-games" aria-labelledby="games-heading">
      <div class="container">
        <h2 id="games-heading" class="sr-only">Jeux disponibles</h2>
        <div class="arcade-games__grid" role="list" aria-label="Liste des mini-jeux">
          <router-link 
            v-for="game in games" 
            :key="game.id"
            :to="game.comingSoon ? '#' : game.route"
            class="game-cabinet"
            :class="{ 'game-cabinet--coming': game.comingSoon }"
            role="listitem"
            :aria-label="`${game.name} - ${game.desc}. Difficulté ${game.difficulty} sur 3. ${game.comingSoon ? 'Bientôt disponible' : 'Cliquez pour jouer'}`"
            :aria-disabled="game.comingSoon"
            @click.prevent="game.comingSoon ? null : undefined"
          >
            <div class="game-cabinet__screen">
              <div class="game-cabinet__glow" :style="{ '--glow-color': game.color }"></div>
              <span class="game-cabinet__icon">{{ game.icon }}</span>
              <div v-if="game.comingSoon" class="game-cabinet__soon">SOON</div>
            </div>
            
            <div class="game-cabinet__info">
              <h3 class="game-cabinet__title">{{ game.name }}</h3>
              <p class="game-cabinet__desc">{{ game.desc }}</p>
              
              <div class="game-cabinet__meta">
                <span class="game-cabinet__difficulty">
                  <span v-for="i in 3" :key="i" class="difficulty-dot" :class="{ 'active': i <= game.difficulty }"></span>
                </span>
                <span class="game-cabinet__tag">{{ game.tag }}</span>
              </div>
            </div>
            
            <div class="game-cabinet__cta">
              <span v-if="!game.comingSoon">PLAY →</span>
              <span v-else>COMING SOON</span>
            </div>
          </router-link>
        </div>
      </div>
    </section>
    
    <!-- INSTRUCTIONS -->
    <section class="arcade-instructions">
      <div class="container">
        <div class="instructions-box glass">
          <div class="instructions-box__icon">📋</div>
          <div class="instructions-box__content">
            <h3>Comment ça marche ?</h3>
            <p>
              Chaque jeu te permet d'explorer mon portfolio d'une manière unique. 
              Collectionne des cartes, tape des commandes, ou teste ta mémoire. 
              Tous les chemins mènent à mes projets !
            </p>
          </div>
          <router-link to="/projets" class="instructions-box__link">
            Voir tous les projets →
          </router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const games = ref([
  {
    id: 'cards',
    name: 'GL CARDS',
    icon: '🃏',
    desc: 'Collection de cartes holographiques de mes projets',
    route: '/arcade/cards',
    color: '#10B981',
    difficulty: 1,
    tag: 'COLLECTION',
    comingSoon: false
  },
  {
    id: 'memory',
    name: 'MEMORY',
    icon: '🧠',
    desc: 'Retrouve les paires de projets cachées',
    route: '/arcade/memory',
    color: '#8B5CF6',
    difficulty: 2,
    tag: 'PUZZLE',
    comingSoon: false
  },
  {
    id: 'terminal',
    name: 'TERMINAL',
    icon: '💻',
    desc: 'Explore mes projets en ligne de commande',
    route: '/arcade/terminal',
    color: '#06B6D4',
    difficulty: 2,
    tag: 'HACKER',
    comingSoon: false
  },
  {
    id: 'slots',
    name: 'STACK SLOTS',
    icon: '🎰',
    desc: 'Tire 3 technos et découvre le projet',
    route: '/arcade/slots',
    color: '#F59E0B',
    difficulty: 1,
    tag: 'CHANCE',
    comingSoon: false
  },
  {
    id: 'world',
    name: '3D WORLD',
    icon: '🌐',
    desc: 'Explore un monde 3D de mes créations',
    route: '/arcade/world',
    color: '#EC4899',
    difficulty: 3,
    tag: 'ADVENTURE',
    comingSoon: true
  }
]);
</script>

<style scoped>
.arcade-page {
  min-height: 100vh;
  background: #050505;
  padding-top: 80px;
}

/* HERO */
.arcade-hero {
  position: relative;
  padding: var(--space-xl) 0;
  overflow: hidden;
}

.arcade-hero__bg {
  position: absolute;
  inset: 0;
  z-index: 0;
}

.scanlines {
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    rgba(0, 0, 0, 0.1) 2px,
    rgba(0, 0, 0, 0.1) 4px
  );
  pointer-events: none;
}

.grid-bg {
  position: absolute;
  inset: 0;
  background-image: 
    linear-gradient(rgba(16, 185, 129, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(16, 185, 129, 0.03) 1px, transparent 1px);
  background-size: 50px 50px;
  animation: grid-scroll 20s linear infinite;
}

@keyframes grid-scroll {
  0% { transform: translateY(0); }
  100% { transform: translateY(50px); }
}

.arcade-hero__content {
  position: relative;
  z-index: 1;
  text-align: center;
}

.arcade-logo {
  display: inline-flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: var(--space-lg);
}

.arcade-logo__icon {
  font-size: 4rem;
  animation: bounce 2s ease-in-out infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.arcade-logo__text h1 {
  font-size: clamp(2.5rem, 8vw, 4.5rem);
  font-weight: 900;
  letter-spacing: 0.05em;
  text-shadow: 0 0 40px rgba(16, 185, 129, 0.5);
}

.arcade-logo__tagline {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.75rem;
  color: var(--primary);
  letter-spacing: 0.2em;
}

.arcade-hero__desc {
  max-width: 600px;
  margin: 0 auto var(--space-lg);
  font-size: 1.1rem;
  color: var(--text-muted);
  line-height: 1.7;
}

.arcade-stats {
  display: inline-flex;
  gap: 3rem;
  padding: 1.5rem 3rem;
  background: rgba(16, 185, 129, 0.05);
  border: 1px solid rgba(16, 185, 129, 0.2);
  border-radius: 1rem;
}

.arcade-stat {
  text-align: center;
}

.arcade-stat__value {
  display: block;
  font-family: 'JetBrains Mono', monospace;
  font-size: 2rem;
  font-weight: 700;
  color: var(--primary);
  text-shadow: 0 0 20px rgba(16, 185, 129, 0.5);
}

.arcade-stat__label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.65rem;
  color: var(--text-dark);
  letter-spacing: 0.1em;
}

/* GAMES GRID */
.arcade-games {
  padding: var(--space-xl) 0;
}

.arcade-games__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

/* GAME CABINET */
.game-cabinet {
  display: flex;
  flex-direction: column;
  background: linear-gradient(180deg, #0a0a0a 0%, #111 100%);
  border: 2px solid var(--border);
  border-radius: 1.5rem;
  overflow: hidden;
  text-decoration: none;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}

.game-cabinet:hover {
  transform: translateY(-8px);
  border-color: var(--primary);
  box-shadow: 
    0 20px 60px rgba(16, 185, 129, 0.2),
    0 0 40px rgba(16, 185, 129, 0.1);
}

.game-cabinet--coming {
  opacity: 0.6;
  pointer-events: none;
}

.game-cabinet__screen {
  position: relative;
  height: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(180deg, #0f0f0f 0%, #1a1a1a 100%);
  overflow: hidden;
}

.game-cabinet__glow {
  position: absolute;
  inset: 0;
  background: radial-gradient(
    ellipse at center,
    var(--glow-color, var(--primary)) 0%,
    transparent 70%
  );
  opacity: 0.15;
  transition: opacity 0.3s;
}

.game-cabinet:hover .game-cabinet__glow {
  opacity: 0.3;
}

.game-cabinet__icon {
  font-size: 5rem;
  z-index: 1;
  filter: drop-shadow(0 0 30px rgba(255, 255, 255, 0.3));
  transition: transform 0.3s;
}

.game-cabinet:hover .game-cabinet__icon {
  transform: scale(1.1);
}

.game-cabinet__soon {
  position: absolute;
  top: 1rem;
  right: 1rem;
  padding: 0.35rem 0.75rem;
  background: rgba(236, 72, 153, 0.2);
  border: 1px solid rgba(236, 72, 153, 0.4);
  border-radius: 2rem;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.55rem;
  color: #EC4899;
  letter-spacing: 0.1em;
}

.game-cabinet__info {
  padding: 1.5rem;
  flex: 1;
}

.game-cabinet__title {
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  letter-spacing: 0.05em;
}

.game-cabinet__desc {
  font-size: 0.85rem;
  color: var(--text-muted);
  line-height: 1.5;
  margin-bottom: 1rem;
}

.game-cabinet__meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.game-cabinet__difficulty {
  display: flex;
  gap: 4px;
}

.difficulty-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--border);
  transition: background 0.3s;
}

.difficulty-dot.active {
  background: var(--primary);
  box-shadow: 0 0 8px var(--primary);
}

.game-cabinet__tag {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.6rem;
  color: var(--text-dark);
  padding: 0.25rem 0.6rem;
  background: var(--surface);
  border-radius: 3px;
  letter-spacing: 0.05em;
}

.game-cabinet__cta {
  padding: 1rem 1.5rem;
  background: var(--surface);
  border-top: 1px solid var(--border);
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--primary);
  text-align: center;
  letter-spacing: 0.1em;
  transition: all 0.3s;
}

.game-cabinet:hover .game-cabinet__cta {
  background: var(--primary);
  color: var(--bg);
}

.game-cabinet--coming .game-cabinet__cta {
  color: var(--text-dark);
}

/* INSTRUCTIONS */
.arcade-instructions {
  padding: var(--space-lg) 0 var(--space-xl);
}

.instructions-box {
  display: flex;
  align-items: center;
  gap: 2rem;
  padding: 2rem;
  border-radius: 1rem;
  border: 1px solid var(--border);
}

.instructions-box__icon {
  font-size: 2.5rem;
}

.instructions-box__content {
  flex: 1;
}

.instructions-box__content h3 {
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
}

.instructions-box__content p {
  font-size: 0.9rem;
  color: var(--text-muted);
  line-height: 1.6;
}

.instructions-box__link {
  padding: 1rem 1.5rem;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 0.5rem;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.75rem;
  color: var(--text-muted);
  text-decoration: none;
  white-space: nowrap;
  transition: all 0.2s;
}

.instructions-box__link:hover {
  border-color: var(--primary);
  color: var(--primary);
}

/* RESPONSIVE */
@media (max-width: 768px) {
  .arcade-logo {
    flex-direction: column;
    gap: 1rem;
  }
  
  .arcade-stats {
    flex-direction: column;
    gap: 1rem;
    padding: 1.5rem;
  }
  
  .instructions-box {
    flex-direction: column;
    text-align: center;
  }
}
</style>
