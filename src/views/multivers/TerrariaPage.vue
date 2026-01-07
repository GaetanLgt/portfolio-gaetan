<template>
  <div class="terraria-page">
    <a href="#main-content" class="skip-link">Aller au contenu principal</a>

    <!-- PARALLAX BACKGROUND LAYERS -->
    <div class="world-bg" aria-hidden="true">
      <div class="layer layer--sky"></div>
      <div class="layer layer--clouds">
        <div v-for="i in 5" :key="i" class="cloud" :style="{ '--delay': i * 3 + 's', '--y': (i * 15) + 'px' }"></div>
      </div>
      <div class="layer layer--sun"></div>
      <div class="layer layer--terrain"></div>
    </div>

    <!-- HERO : SURFACE -->
    <section id="hero" class="terraria-hero" aria-labelledby="hero-title">
      <div class="container" id="main-content">
        <div class="player-sprite" @click="swing">
          <div class="player-body" :class="{ swinging: isSwinging }">
            <span class="player-head">🧑</span>
            <span class="player-tool" :class="{ active: isSwinging }">⛏️</span>
          </div>
          <div class="dig-particles" v-if="isSwinging">
            <span v-for="i in 5" :key="i" class="particle">💎</span>
          </div>
        </div>

        <h1 id="hero-title" class="hero-title">
          <span class="title-pre">DIG. FIGHT. EXPLORE. BUILD.</span>
          <span class="title-main" :class="{ boss: showBoss }">
            {{ showBoss ? 'A BOSS HAS AWOKEN!' : 'BIENVENUE SUR TERRARIA' }}
          </span>
        </h1>

        <p class="hero-quote">
          « Le monde entier est à ta portée, il suffit de creuser. »
        </p>

        <div class="quick-stats">
          <div class="stat">
            <span class="stat-icon">❤️</span>
            <div class="stat-bar health"><div class="bar-fill" style="width: 100%"></div></div>
            <span>500/500</span>
          </div>
          <div class="stat">
            <span class="stat-icon">⭐</span>
            <div class="stat-bar mana"><div class="bar-fill" style="width: 80%"></div></div>
            <span>160/200</span>
          </div>
          <div class="stat">
            <span class="stat-icon">🛡️</span>
            <span class="defense">78 DEF</span>
          </div>
        </div>

        <button class="summon-btn" @click="triggerBoss">
          <span class="btn-icon">👁️</span>
          <span class="btn-text">INVOQUER UN BOSS</span>
        </button>
      </div>
    </section>

    <!-- BIOMES : About -->
    <section id="biomes" class="terraria-section biomes-section" aria-labelledby="biomes-title">
      <div class="container">
        <div class="section-header">
          <span class="header-icon">🌍</span>
          <h2 id="biomes-title">LES BIOMES</h2>
          <p class="section-sub">Explore des environnements uniques avec leurs dangers et trésors</p>
        </div>

        <div class="biomes-grid">
          <article v-for="biome in biomes" :key="biome.name" class="biome-card" :style="{ '--biome-color': biome.color }">
            <div class="biome-icon">{{ biome.icon }}</div>
            <h3>{{ biome.name }}</h3>
            <p>{{ biome.desc }}</p>
            <div class="biome-loot">
              <span v-for="loot in biome.loot" :key="loot" class="loot-item">{{ loot }}</span>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- CRAFTING : Skills -->
    <section id="crafting" class="terraria-section crafting-section" aria-labelledby="crafting-title">
      <div class="container">
        <div class="section-header">
          <span class="header-icon">🔨</span>
          <h2 id="crafting-title">CRAFTING</h2>
          <p class="section-sub">Plus de 3500 objets à crafter avec 30+ stations</p>
        </div>

        <div class="crafting-bench">
          <div class="bench-header">
            <span class="station-icon">⚒️</span>
            <span class="station-name">Forge en Adamantite</span>
          </div>

          <div class="recipe-list">
            <div v-for="recipe in recipes" :key="recipe.name" class="recipe-card">
              <div class="recipe-result">
                <span class="result-icon">{{ recipe.icon }}</span>
                <span class="result-name">{{ recipe.name }}</span>
              </div>
              <div class="recipe-arrow">→</div>
              <div class="recipe-ingredients">
                <span v-for="(ing, idx) in recipe.ingredients" :key="idx" class="ingredient">
                  {{ ing.icon }} ×{{ ing.qty }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div class="progression-tiers">
          <h3>📈 Progression des Minerais</h3>
          <div class="tiers-bar">
            <div v-for="tier in oreTiers" :key="tier.name" class="tier" :style="{ background: tier.color }">
              <span class="tier-icon">{{ tier.icon }}</span>
              <span class="tier-name">{{ tier.name }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- BOSSES : Projects -->
    <section id="bosses" class="terraria-section bosses-section" aria-labelledby="bosses-title">
      <div class="container">
        <div class="section-header">
          <span class="header-icon">💀</span>
          <h2 id="bosses-title">LES BOSS</h2>
          <p class="section-sub">17 boss légendaires à vaincre pour progresser</p>
        </div>

        <div class="boss-timeline">
          <div class="timeline-line"></div>
          <div v-for="(boss, index) in bosses" :key="boss.name" class="boss-card" :class="{ defeated: boss.defeated }">
            <div class="boss-number">{{ index + 1 }}</div>
            <div class="boss-icon">{{ boss.icon }}</div>
            <div class="boss-info">
              <h3>{{ boss.name }}</h3>
              <p>{{ boss.hp }} HP</p>
              <span class="boss-phase">{{ boss.phase }}</span>
            </div>
            <div class="boss-status">
              {{ boss.defeated ? '✅' : '⚔️' }}
            </div>
          </div>
        </div>

        <div class="hardmode-banner">
          <span class="banner-icon">🌙</span>
          <div class="banner-text">
            <h3>HARDMODE</h3>
            <p>Après le Mur de Chair, le monde se transforme...</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CLASSES : Play Styles -->
    <section id="classes" class="terraria-section classes-section" aria-labelledby="classes-title">
      <div class="container">
        <div class="section-header">
          <span class="header-icon">⚔️</span>
          <h2 id="classes-title">CLASSES DE COMBAT</h2>
          <p class="section-sub">4 styles de jeu uniques à maîtriser</p>
        </div>

        <div class="classes-grid">
          <article v-for="cls in classes" :key="cls.name" class="class-card" :style="{ '--class-color': cls.color }">
            <div class="class-icon">{{ cls.icon }}</div>
            <h3>{{ cls.name }}</h3>
            <p>{{ cls.desc }}</p>
            <div class="class-weapons">
              <span v-for="weapon in cls.weapons" :key="weapon">{{ weapon }}</span>
            </div>
            <div class="class-stat">
              <span>Difficulté</span>
              <div class="diff-bar">
                <div class="diff-fill" :style="{ width: cls.difficulty + '%' }"></div>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- EVENTS -->
    <section id="events" class="terraria-section events-section" aria-labelledby="events-title">
      <div class="container">
        <div class="section-header">
          <span class="header-icon">🎃</span>
          <h2 id="events-title">ÉVÉNEMENTS</h2>
          <p class="section-sub">Des invasions et événements saisonniers épiques</p>
        </div>

        <div class="events-carousel">
          <article v-for="event in events" :key="event.name" class="event-card">
            <div class="event-header" :style="{ background: event.gradient }">
              <span class="event-icon">{{ event.icon }}</span>
            </div>
            <div class="event-body">
              <h3>{{ event.name }}</h3>
              <p>{{ event.desc }}</p>
              <span class="event-reward">🎁 {{ event.reward }}</span>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- NPC HOUSING -->
    <section id="npcs" class="terraria-section npcs-section" aria-labelledby="npcs-title">
      <div class="container">
        <div class="section-header">
          <span class="header-icon">🏠</span>
          <h2 id="npcs-title">PNJ & LOGEMENTS</h2>
          <p class="section-sub">28 PNJ uniques avec leurs préférences de biome</p>
        </div>

        <div class="housing-grid">
          <div v-for="npc in npcs" :key="npc.name" class="npc-card">
            <div class="npc-portrait">{{ npc.icon }}</div>
            <div class="npc-info">
              <span class="npc-name">{{ npc.name }}</span>
              <span class="npc-role">{{ npc.role }}</span>
            </div>
            <div class="npc-likes">
              <span class="like" title="Aime">❤️ {{ npc.likes }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section id="cta" class="terraria-section cta-section" aria-labelledby="cta-title">
      <div class="container">
        <div class="cta-content">
          <div class="cta-chest">📦✨</div>
          <h2 id="cta-title">PRÊT À EXPLORER ?</h2>
          <p>Plus de 500 heures de contenu t'attendent dans ce monde généré procéduralement</p>
          <a href="https://terraria.org" target="_blank" rel="noopener" class="cta-btn">
            <span class="btn-icon">⛏️</span>
            <span class="btn-text">DÉCOUVRIR TERRARIA</span>
          </a>
          <p class="version-note">Version 1.4.4 "Labor of Love" - 2024</p>
        </div>
      </div>
    </section>

    <!-- FOOTER -->
    <footer class="terraria-footer">
      <div class="container">
        <div class="footer-content">
          <router-link to="/multivers" class="back-link">
            <span>←</span> Retour au Multivers
          </router-link>
          <p class="footer-credit">
            Univers inspiré par <a href="https://terraria.org" target="_blank" rel="noopener">Terraria</a> de Re-Logic
          </p>
          <router-link to="/galerie" class="gallery-link">
            Voir la galerie 🎨
          </router-link>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';

const isSwinging = ref(false);
const showBoss = ref(false);

const biomes = reactive([
  { name: 'Forêt', icon: '🌲', color: '#228B22', desc: 'Point de départ verdoyant', loot: ['🌰', '🍄', '🐰'] },
  { name: 'Désert', icon: '🏜️', color: '#F4A460', desc: 'Sables brûlants et pyramides', loot: ['🦂', '💀', '🏺'] },
  { name: 'Jungle', icon: '🌴', color: '#32CD32', desc: 'Végétation dense et dangereuse', loot: ['🐝', '🌺', '💎'] },
  { name: 'Neige', icon: '❄️', color: '#87CEEB', desc: 'Terres gelées hostiles', loot: ['⛄', '🐧', '💠'] },
  { name: 'Corruption', icon: '💜', color: '#8B008B', desc: 'Biome maléfique violet', loot: ['👁️', '🦇', '⚫'] },
  { name: 'Carmin', icon: '❤️', color: '#DC143C', desc: 'Biome maléfique rouge', loot: ['🧠', '🩸', '👹'] },
  { name: 'Sacré', icon: '🌈', color: '#FFB6C1', desc: 'Terres bénies multicolores', loot: ['🦄', '🧚', '✨'] },
  { name: 'Enfer', icon: '🔥', color: '#FF4500', desc: 'Les profondeurs ardentes', loot: ['😈', '🌋', '💀'] }
]);

const recipes = reactive([
  { name: 'Épée Terra', icon: '⚔️', ingredients: [{ icon: '🗡️', qty: 1 }, { icon: '🌙', qty: 1 }] },
  { name: 'Armure Hallow', icon: '🛡️', ingredients: [{ icon: '💎', qty: 36 }, { icon: '✨', qty: 12 }] },
  { name: 'Zenith', icon: '🌟', ingredients: [{ icon: '⚔️', qty: 10 }, { icon: '💫', qty: 1 }] },
  { name: 'Cellphone', icon: '📱', ingredients: [{ icon: '🧭', qty: 1 }, { icon: '⏰', qty: 1 }, { icon: '🗺️', qty: 1 }] }
]);

const oreTiers = reactive([
  { name: 'Cuivre', icon: '🟤', color: '#B87333' },
  { name: 'Fer', icon: '⚪', color: '#A19D94' },
  { name: 'Argent', icon: '🔘', color: '#C0C0C0' },
  { name: 'Or', icon: '🟡', color: '#FFD700' },
  { name: 'Météore', icon: '☄️', color: '#8B0000' },
  { name: 'Obsidian', icon: '⬛', color: '#1C1C1C' },
  { name: 'Cobalt', icon: '🔵', color: '#0047AB' },
  { name: 'Mythril', icon: '💚', color: '#50C878' },
  { name: 'Adamantite', icon: '🔴', color: '#E62020' },
  { name: 'Chlorophyte', icon: '💛', color: '#7FFF00' },
  { name: 'Luminite', icon: '🌙', color: '#40E0D0' }
]);

const bosses = reactive([
  { name: 'Œil de Cthulhu', icon: '👁️', hp: '2800', phase: 'Pre-Hardmode', defeated: true },
  { name: 'Roi des Slimes', icon: '👑', hp: '2000', phase: 'Pre-Hardmode', defeated: true },
  { name: 'Cerveau de Cthulhu', icon: '🧠', hp: '1000', phase: 'Pre-Hardmode', defeated: true },
  { name: 'Reine des Abeilles', icon: '🐝', hp: '3400', phase: 'Pre-Hardmode', defeated: true },
  { name: 'Squeletron', icon: '💀', hp: '4400', phase: 'Pre-Hardmode', defeated: true },
  { name: 'Mur de Chair', icon: '🧱', hp: '8000', phase: 'Hardmode Unlock', defeated: true },
  { name: 'Les Jumeaux', icon: '👀', hp: '43000', phase: 'Hardmode', defeated: false },
  { name: 'Le Destructeur', icon: '🐛', hp: '80000', phase: 'Hardmode', defeated: false },
  { name: 'Squeletron Prime', icon: '🤖', hp: '28000', phase: 'Hardmode', defeated: false },
  { name: 'Plantera', icon: '🌸', hp: '30000', phase: 'Hardmode', defeated: false },
  { name: 'Golem', icon: '🗿', hp: '39000', phase: 'Hardmode', defeated: false },
  { name: 'Duc Fishron', icon: '🐟', hp: '50000', phase: 'Optional', defeated: false },
  { name: 'Seigneur Lunaire', icon: '🌙', hp: '145000', phase: 'Final Boss', defeated: false }
]);

const classes = reactive([
  { name: 'Mêlée', icon: '⚔️', color: '#FF6B6B', desc: 'Combat rapproché dévastateur', weapons: ['🗡️', '⚔️', '🪓'], difficulty: 40 },
  { name: 'Distance', icon: '🏹', color: '#4ECDC4', desc: 'Tirs précis à distance', weapons: ['🏹', '🔫', '🎯'], difficulty: 50 },
  { name: 'Magie', icon: '✨', color: '#9B59B6', desc: 'Sorts puissants et variés', weapons: ['🪄', '📖', '💫'], difficulty: 70 },
  { name: 'Invocation', icon: '👻', color: '#F39C12', desc: 'Armée de créatures alliées', weapons: ['🐉', '👁️', '🦅'], difficulty: 60 }
]);

const events = reactive([
  { name: 'Blood Moon', icon: '🌑', gradient: 'linear-gradient(135deg, #8B0000, #DC143C)', desc: 'Les monstres envahissent la nuit', reward: 'Drops spéciaux' },
  { name: 'Goblin Army', icon: '👺', gradient: 'linear-gradient(135deg, #2E8B57, #3CB371)', desc: 'Invasion de gobelins', reward: 'Tinkerer NPC' },
  { name: 'Frost Legion', icon: '⛄', gradient: 'linear-gradient(135deg, #4169E1, #87CEEB)', desc: 'Armée des glaces', reward: 'Snow Globe' },
  { name: 'Pumpkin Moon', icon: '🎃', gradient: 'linear-gradient(135deg, #FF8C00, #FF4500)', desc: 'Halloween terrifiante', reward: 'Armes légendaires' },
  { name: 'Frost Moon', icon: '🎄', gradient: 'linear-gradient(135deg, #006400, #DC143C)', desc: 'Noël cauchemardesque', reward: 'Montures rares' },
  { name: 'Lunar Events', icon: '🌙', gradient: 'linear-gradient(135deg, #4B0082, #9400D3)', desc: 'Pilliers célestes', reward: 'Fragments lunaires' }
]);

const npcs = reactive([
  { name: 'Guide', icon: '📖', role: 'Aide & Recettes', likes: 'Forêt' },
  { name: 'Marchand', icon: '💰', role: 'Vente items basiques', likes: 'Désert' },
  { name: 'Infirmière', icon: '💉', role: 'Soins & Débuffs', likes: 'Sacré' },
  { name: 'Démolisseur', icon: '💣', role: 'Explosifs', likes: 'Souterrain' },
  { name: 'Bricoleur', icon: '🔧', role: 'Reforge & Combine', likes: 'Neige' },
  { name: 'Dryade', icon: '🧚', role: 'Nature & Purification', likes: 'Jungle' },
  { name: 'Sorcier', icon: '🧙', role: 'Magie', likes: 'Sacré' },
  { name: 'Mécanicienne', icon: '⚙️', role: 'Câbles & Mécanismes', likes: 'Neige' }
]);

const swing = () => {
  isSwinging.value = true;
  setTimeout(() => isSwinging.value = false, 400);
};

const triggerBoss = () => {
  showBoss.value = true;
  setTimeout(() => showBoss.value = false, 3000);
};
</script>

<style scoped>
.terraria-page {
  --terra-brown: #8B4513;
  --terra-green: #228B22;
  --terra-sky: #87CEEB;
  --terra-gold: #FFD700;
  --bg-dark: #1a0f0a;
  --bg-card: #2d1f1580;
  --text: #f5e6d3;
  --text-muted: #c4a77d;
  
  min-height: 100vh;
  background: var(--bg-dark);
  color: var(--text);
  font-family: 'Press Start 2P', 'Space Grotesk', system-ui, sans-serif;
  overflow-x: hidden;
  position: relative;
}

.skip-link {
  position: absolute;
  top: -100%;
  left: 0;
  background: var(--terra-gold);
  color: #000;
  padding: 1rem;
  z-index: 9999;
}
.skip-link:focus { top: 0; }

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

/* WORLD BACKGROUND */
.world-bg {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
}

.layer {
  position: absolute;
  inset: 0;
}

.layer--sky {
  background: linear-gradient(180deg, #1e90ff 0%, #87ceeb 50%, #ffd700 100%);
  opacity: 0.3;
}

.layer--clouds {
  overflow: hidden;
}

.cloud {
  position: absolute;
  width: 100px;
  height: 40px;
  background: rgba(255,255,255,0.3);
  border-radius: 50px;
  top: var(--y);
  animation: cloudFloat 30s linear infinite;
  animation-delay: var(--delay);
}

@keyframes cloudFloat {
  0% { transform: translateX(-150px); }
  100% { transform: translateX(calc(100vw + 150px)); }
}

.layer--sun {
  width: 80px;
  height: 80px;
  background: radial-gradient(circle, #FFD700, #FFA500);
  border-radius: 50%;
  position: absolute;
  top: 50px;
  right: 100px;
  box-shadow: 0 0 60px #FFD700;
  opacity: 0.6;
}

.layer--terrain {
  bottom: 0;
  height: 200px;
  background: linear-gradient(180deg, transparent, #2d1f15 50%, #1a0f0a);
}

/* HERO */
.terraria-hero {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  text-align: center;
  padding: 4rem 0;
  z-index: 1;
}

.player-sprite {
  position: relative;
  cursor: pointer;
  margin-bottom: 2rem;
}

.player-body {
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: transform 0.1s;
}

.player-body.swinging {
  animation: swingAnim 0.4s;
}

@keyframes swingAnim {
  0%, 100% { transform: rotate(0); }
  25% { transform: rotate(-15deg); }
  75% { transform: rotate(15deg); }
}

.player-head { font-size: 3rem; }
.player-tool { 
  font-size: 2.5rem; 
  transition: transform 0.2s;
  transform-origin: bottom center;
}
.player-tool.active {
  animation: toolSwing 0.4s;
}

@keyframes toolSwing {
  0% { transform: rotate(0); }
  50% { transform: rotate(-45deg); }
  100% { transform: rotate(0); }
}

.dig-particles {
  position: absolute;
  bottom: -20px;
  left: 50%;
  transform: translateX(-50%);
}

.particle {
  display: inline-block;
  animation: particlePop 0.5s forwards;
  opacity: 0;
}

.particle:nth-child(1) { animation-delay: 0s; }
.particle:nth-child(2) { animation-delay: 0.1s; }
.particle:nth-child(3) { animation-delay: 0.2s; }
.particle:nth-child(4) { animation-delay: 0.3s; }
.particle:nth-child(5) { animation-delay: 0.4s; }

@keyframes particlePop {
  0% { transform: translateY(0) scale(0); opacity: 1; }
  100% { transform: translateY(-30px) scale(1); opacity: 0; }
}

.hero-title { margin-bottom: 1rem; }

.title-pre {
  display: block;
  font-size: clamp(0.6rem, 1.5vw, 0.8rem);
  letter-spacing: 0.2em;
  color: var(--terra-gold);
  margin-bottom: 0.5rem;
}

.title-main {
  display: block;
  font-size: clamp(1.5rem, 5vw, 3rem);
  font-weight: 700;
  color: var(--terra-green);
  text-shadow: 3px 3px 0 #000, 0 0 20px var(--terra-green);
  transition: all 0.3s;
}

.title-main.boss {
  color: #DC143C;
  text-shadow: 3px 3px 0 #000, 0 0 30px #DC143C;
  animation: bossAlert 0.5s infinite;
}

@keyframes bossAlert {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

.hero-quote {
  font-family: 'Space Grotesk', sans-serif;
  font-style: italic;
  color: var(--text-muted);
  margin-bottom: 2rem;
  font-size: 0.9rem;
}

.quick-stats {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.stat {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: 'Space Grotesk', sans-serif;
  font-size: 0.9rem;
}

.stat-icon { font-size: 1.2rem; }

.stat-bar {
  width: 100px;
  height: 12px;
  background: rgba(0,0,0,0.5);
  border: 2px solid;
  border-radius: 2px;
}

.stat-bar.health { border-color: #DC143C; }
.stat-bar.health .bar-fill { background: linear-gradient(180deg, #FF6B6B, #DC143C); }

.stat-bar.mana { border-color: #4169E1; }
.stat-bar.mana .bar-fill { background: linear-gradient(180deg, #87CEEB, #4169E1); }

.defense { color: var(--terra-gold); font-weight: bold; }

.summon-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  background: linear-gradient(135deg, #8B0000, #DC143C);
  color: #fff;
  border: 3px solid #FFD700;
  padding: 1rem 2rem;
  font-family: inherit;
  font-size: 0.8rem;
  cursor: pointer;
  transition: transform 0.3s, box-shadow 0.3s;
  image-rendering: pixelated;
}

.summon-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 0 30px rgba(220, 20, 60, 0.5);
}

/* SECTIONS */
.terraria-section {
  padding: 6rem 0;
  position: relative;
  z-index: 1;
}

.section-header {
  text-align: center;
  margin-bottom: 4rem;
}

.header-icon {
  font-size: 3rem;
  display: block;
  margin-bottom: 1rem;
}

.section-header h2 {
  font-size: clamp(1rem, 3vw, 1.5rem);
  color: var(--terra-gold);
  margin-bottom: 0.5rem;
  text-shadow: 2px 2px 0 #000;
}

.section-sub {
  font-family: 'Space Grotesk', sans-serif;
  color: var(--text-muted);
  font-size: 0.9rem;
}

/* BIOMES */
.biomes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.5rem;
}

.biome-card {
  background: var(--bg-card);
  padding: 1.5rem;
  border: 3px solid var(--biome-color);
  text-align: center;
  transition: transform 0.3s;
}

.biome-card:hover {
  transform: translateY(-5px);
}

.biome-icon { font-size: 2.5rem; margin-bottom: 0.5rem; }
.biome-card h3 { 
  color: var(--biome-color); 
  font-size: 0.9rem; 
  margin-bottom: 0.5rem;
}
.biome-card p { 
  font-family: 'Space Grotesk', sans-serif;
  color: var(--text-muted); 
  font-size: 0.8rem;
  margin-bottom: 0.75rem;
}

.biome-loot {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
}

.loot-item { font-size: 1.2rem; }

/* CRAFTING */
.crafting-bench {
  background: var(--bg-card);
  border: 3px solid var(--terra-brown);
  margin-bottom: 2rem;
}

.bench-header {
  background: var(--terra-brown);
  padding: 0.75rem 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.station-icon { font-size: 1.5rem; }
.station-name { font-size: 0.8rem; color: var(--terra-gold); }

.recipe-list {
  padding: 1rem;
  display: grid;
  gap: 0.75rem;
}

.recipe-card {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem;
  background: rgba(0,0,0,0.3);
  border: 1px solid var(--terra-brown);
}

.recipe-result {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.result-icon { font-size: 1.5rem; }
.result-name { font-family: 'Space Grotesk', sans-serif; font-size: 0.85rem; }

.recipe-arrow { color: var(--terra-gold); font-size: 1.2rem; }

.recipe-ingredients {
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
}

.ingredient {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 0.8rem;
}

.progression-tiers {
  background: var(--bg-card);
  padding: 1.5rem;
  border: 3px solid var(--terra-brown);
}

.progression-tiers h3 {
  text-align: center;
  margin-bottom: 1rem;
  font-size: 0.9rem;
  color: var(--terra-gold);
}

.tiers-bar {
  display: flex;
  overflow-x: auto;
  gap: 2px;
}

.tier {
  flex: 1;
  min-width: 70px;
  padding: 0.5rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
}

.tier-icon { font-size: 1.2rem; }
.tier-name { font-size: 0.6rem; color: #fff; text-shadow: 1px 1px 0 #000; }

/* BOSSES */
.boss-timeline {
  position: relative;
  padding-left: 40px;
}

.timeline-line {
  position: absolute;
  left: 15px;
  top: 0;
  bottom: 0;
  width: 4px;
  background: linear-gradient(180deg, var(--terra-green), #DC143C);
}

.boss-card {
  display: grid;
  grid-template-columns: 50px 50px 1fr auto;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  margin-bottom: 0.5rem;
  background: var(--bg-card);
  border: 2px solid transparent;
  transition: border-color 0.3s;
}

.boss-card:hover { border-color: var(--terra-gold); }
.boss-card.defeated { opacity: 0.6; }

.boss-number {
  width: 30px;
  height: 30px;
  background: var(--terra-brown);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  color: var(--terra-gold);
  position: relative;
  z-index: 1;
}

.boss-icon { font-size: 2rem; }

.boss-info h3 { font-size: 0.8rem; color: var(--text); margin-bottom: 0.25rem; }
.boss-info p { font-family: 'Space Grotesk', sans-serif; font-size: 0.75rem; color: #DC143C; }
.boss-phase { font-family: 'Space Grotesk', sans-serif; font-size: 0.65rem; color: var(--text-muted); }

.boss-status { font-size: 1.5rem; }

.hardmode-banner {
  margin-top: 2rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: linear-gradient(135deg, #4B0082, #8B008B);
  border: 3px solid #FFD700;
}

.banner-icon { font-size: 2.5rem; }
.banner-text h3 { font-size: 0.9rem; color: var(--terra-gold); margin-bottom: 0.25rem; }
.banner-text p { font-family: 'Space Grotesk', sans-serif; font-size: 0.8rem; color: var(--text); }

/* CLASSES */
.classes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.class-card {
  background: var(--bg-card);
  padding: 1.5rem;
  border: 3px solid var(--class-color);
  text-align: center;
}

.class-icon { font-size: 2.5rem; margin-bottom: 0.5rem; }
.class-card h3 { font-size: 0.9rem; color: var(--class-color); margin-bottom: 0.5rem; }
.class-card p { font-family: 'Space Grotesk', sans-serif; font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.75rem; }

.class-weapons {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  font-size: 1.5rem;
}

.class-stat {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 0.75rem;
}

.diff-bar {
  height: 8px;
  background: rgba(0,0,0,0.5);
  margin-top: 0.25rem;
}

.diff-fill {
  height: 100%;
  background: var(--class-color);
}

/* EVENTS */
.events-carousel {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
}

.event-card {
  background: var(--bg-card);
  border: 2px solid var(--terra-brown);
  overflow: hidden;
}

.event-header {
  padding: 1.5rem;
  text-align: center;
}

.event-icon { font-size: 2.5rem; }

.event-body {
  padding: 1rem;
}

.event-body h3 { font-size: 0.8rem; color: var(--terra-gold); margin-bottom: 0.5rem; }
.event-body p { font-family: 'Space Grotesk', sans-serif; font-size: 0.75rem; color: var(--text-muted); margin-bottom: 0.5rem; }
.event-reward { font-family: 'Space Grotesk', sans-serif; font-size: 0.7rem; color: var(--terra-gold); }

/* NPCS */
.housing-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.npc-card {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: var(--bg-card);
  border: 2px solid var(--terra-brown);
}

.npc-portrait {
  width: 40px;
  height: 40px;
  background: rgba(0,0,0,0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
}

.npc-info { flex: 1; }
.npc-name { display: block; font-size: 0.75rem; color: var(--text); }
.npc-role { font-family: 'Space Grotesk', sans-serif; font-size: 0.65rem; color: var(--text-muted); }

.npc-likes {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 0.65rem;
}

/* CTA */
.cta-section {
  background: linear-gradient(135deg, rgba(139, 69, 19, 0.2), rgba(34, 139, 34, 0.2));
  text-align: center;
}

.cta-chest {
  font-size: 4rem;
  margin-bottom: 1rem;
  animation: chestBounce 2s infinite;
}

@keyframes chestBounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.cta-content h2 {
  font-size: clamp(1rem, 3vw, 1.5rem);
  color: var(--terra-gold);
  margin-bottom: 1rem;
}

.cta-content > p {
  font-family: 'Space Grotesk', sans-serif;
  color: var(--text-muted);
  margin-bottom: 2rem;
  font-size: 0.9rem;
}

.cta-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  background: linear-gradient(135deg, var(--terra-brown), #5D3A1A);
  color: var(--terra-gold);
  text-decoration: none;
  padding: 1rem 2rem;
  font-family: inherit;
  font-size: 0.8rem;
  border: 3px solid var(--terra-gold);
  transition: transform 0.3s, box-shadow 0.3s;
}

.cta-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 0 30px rgba(255, 215, 0, 0.3);
}

.version-note {
  margin-top: 2rem;
  font-family: 'Space Grotesk', sans-serif;
  font-size: 0.75rem;
  color: var(--text-muted);
}

/* FOOTER */
.terraria-footer {
  background: rgba(0,0,0,0.5);
  padding: 2rem 0;
  position: relative;
  z-index: 1;
}

.footer-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
  font-family: 'Space Grotesk', sans-serif;
}

.back-link, .gallery-link {
  color: var(--terra-gold);
  text-decoration: none;
  font-size: 0.85rem;
  transition: opacity 0.3s;
}

.back-link:hover, .gallery-link:hover { opacity: 0.7; }

.footer-credit {
  color: var(--text-muted);
  font-size: 0.75rem;
}

.footer-credit a {
  color: var(--terra-green);
  text-decoration: none;
}

/* RESPONSIVE */
@media (max-width: 768px) {
  .boss-card { grid-template-columns: 40px 40px 1fr; }
  .boss-status { display: none; }
  .footer-content { justify-content: center; text-align: center; }
  .recipe-card { grid-template-columns: 1fr; text-align: center; }
  .recipe-arrow { display: none; }
  .recipe-ingredients { justify-content: center; }
}
</style>
