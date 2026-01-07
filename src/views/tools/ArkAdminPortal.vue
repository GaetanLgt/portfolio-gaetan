<template>
  <div class="ark-portal">
    <a href="#main-content" class="skip-link">Aller au contenu principal</a>

    <!-- BACKGROUND -->
    <div class="portal-bg" aria-hidden="true">
      <div class="hex-grid"></div>
      <div class="scan-line"></div>
    </div>

    <!-- HERO -->
    <section class="portal-hero" aria-labelledby="hero-title">
      <div class="container" id="main-content">
        <div class="hero-badge">
          <span class="badge-icon">🦖</span>
          <span class="badge-text">ARKADIA FRANCE</span>
        </div>

        <h1 id="hero-title" class="hero-title">
          <span class="title-pre">Configuration</span>
          <span class="title-main">ARK ADMIN PORTAL</span>
          <span class="title-sub">Snippets INI pour serveurs ARK: Survival Ascended</span>
        </h1>

        <p class="hero-desc">
          Collection de configurations optimisées pour la gestion de cluster ARK.
          Copiez, adaptez, déployez. 🚀
        </p>

        <div class="hero-stats">
          <div class="stat">
            <span class="stat-value">{{ snippets.length }}</span>
            <span class="stat-label">Snippets</span>
          </div>
          <div class="stat">
            <span class="stat-value">{{ categories.length }}</span>
            <span class="stat-label">Catégories</span>
          </div>
          <div class="stat">
            <span class="stat-value">9</span>
            <span class="stat-label">Serveurs</span>
          </div>
        </div>
      </div>
    </section>

    <!-- FILTERS -->
    <section class="filter-section">
      <div class="container">
        <div class="filter-bar">
          <button class="filter-btn" :class="{ active: activeCategory === 'all' }" @click="activeCategory = 'all'">
            🎯 Tous ({{ snippets.length }})
          </button>
          <button v-for="cat in categories" :key="cat.id" class="filter-btn" :class="{ active: activeCategory === cat.id }" @click="activeCategory = cat.id">
            {{ cat.icon }} {{ cat.name }} ({{ getCountByCategory(cat.id) }})
          </button>
        </div>

        <div class="search-bar">
          <span class="search-icon">🔍</span>
          <input type="text" v-model="searchQuery" placeholder="Rechercher..." class="search-input">
        </div>
      </div>
    </section>

    <!-- SNIPPETS -->
    <section class="snippets-section">
      <div class="container">
        <div class="snippets-grid">
          <article v-for="snippet in filteredSnippets" :key="snippet.id" class="snippet-card" :class="{ expanded: expandedSnippet === snippet.id }">
            <div class="card-header" @click="toggleSnippet(snippet.id)">
              <div class="header-left">
                <span class="snippet-icon">{{ snippet.icon }}</span>
                <div class="snippet-info">
                  <h3>{{ snippet.name }}</h3>
                  <span class="snippet-file">{{ snippet.file }}</span>
                </div>
              </div>
              <div class="header-right">
                <span class="snippet-category">{{ getCategoryName(snippet.category) }}</span>
                <span class="expand-icon">{{ expandedSnippet === snippet.id ? '▼' : '▶' }}</span>
              </div>
            </div>

            <div class="card-body" v-show="expandedSnippet === snippet.id">
              <p class="snippet-desc">{{ snippet.description }}</p>
              
              <div class="code-block">
                <div class="code-header">
                  <span class="code-lang">{{ snippet.file }}</span>
                  <button class="copy-btn" @click="copyCode(snippet.code, snippet.id)">
                    {{ copiedId === snippet.id ? '✓ Copié !' : '📋 Copier' }}
                  </button>
                </div>
                <pre class="code-content"><code>{{ snippet.code }}</code></pre>
              </div>

              <div class="snippet-meta" v-if="snippet.notes">
                <span class="meta-icon">💡</span>
                <p>{{ snippet.notes }}</p>
              </div>

              <div class="snippet-tags">
                <span v-for="tag in snippet.tags" :key="tag" class="tag">{{ tag }}</span>
              </div>
            </div>
          </article>
        </div>

        <div v-if="filteredSnippets.length === 0" class="empty-state">
          <span class="empty-icon">🦕</span>
          <p>Aucun snippet trouvé.</p>
          <button class="reset-btn" @click="resetFilters">Réinitialiser</button>
        </div>
      </div>
    </section>

    <!-- REFERENCE -->
    <section class="reference-section">
      <div class="container">
        <h2>📚 Référence Rapide</h2>
        <div class="reference-grid">
          <div class="ref-card">
            <h3>📄 Game.ini</h3>
            <p>Configuration gameplay : taux, stats dinos/joueurs.</p>
            <code>ShooterGame/Saved/Config/WindowsServer/Game.ini</code>
          </div>
          <div class="ref-card">
            <h3>📄 GameUserSettings.ini</h3>
            <p>Paramètres serveur : nom, mot de passe, difficulté.</p>
            <code>ShooterGame/Saved/Config/WindowsServer/GameUserSettings.ini</code>
          </div>
          <div class="ref-card">
            <h3>📄 Engine.ini</h3>
            <p>Configuration moteur : tickrate, network.</p>
            <code>ShooterGame/Saved/Config/WindowsServer/Engine.ini</code>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="cta-section">
      <div class="container">
        <div class="cta-card">
          <h2>🎮 Rejoignez ARKADIA FRANCE</h2>
          <p>Cluster PvE français • 9 serveurs • 150+ joueurs</p>
          <div class="cta-buttons">
            <a href="https://discord.gg/arkadia" target="_blank" class="cta-btn cta-btn--primary">🎯 Discord</a>
            <router-link to="/arkadia" class="cta-btn cta-btn--secondary">📖 Case Study</router-link>
          </div>
        </div>
      </div>
    </section>

    <!-- TOAST -->
    <Transition name="toast">
      <div v-if="showToast" class="toast">✓ Code copié !</div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const activeCategory = ref('all');
const searchQuery = ref('');
const expandedSnippet = ref(null);
const copiedId = ref(null);
const showToast = ref(false);

const categories = [
  { id: 'rates', name: 'Taux', icon: '📊' },
  { id: 'dinos', name: 'Dinos', icon: '🦖' },
  { id: 'breeding', name: 'Breeding', icon: '🥚' },
  { id: 'player', name: 'Joueur', icon: '👤' },
  { id: 'server', name: 'Serveur', icon: '🖥️' },
  { id: 'quality', name: 'Loot', icon: '💎' },
  { id: 'events', name: 'Events', icon: '🎄' },
];

const snippets = ref([
  { id: 1, name: 'Taux de récolte x5', icon: '⛏️', category: 'rates', file: 'GameUserSettings.ini',
    description: 'Multiplie par 5 les ressources récoltées.',
    code: `[ServerSettings]\nHarvestAmountMultiplier=5.0\nHarvestHealthMultiplier=1.0\nResourcesRespawnPeriodMultiplier=0.5`,
    notes: 'Réduisez ResourcesRespawnPeriodMultiplier pour un respawn plus rapide.', tags: ['harvest', 'resources'] },
  { id: 2, name: 'Taux XP x3', icon: '⭐', category: 'rates', file: 'GameUserSettings.ini',
    description: 'Triple l\'XP gagnée.',
    code: `[ServerSettings]\nXPMultiplier=3.0\nKillXPMultiplier=2.0\nHarvestXPMultiplier=2.0\nCraftXPMultiplier=2.0`,
    notes: 'XPMultiplier est le multiplicateur global.', tags: ['XP', 'leveling'] },
  { id: 3, name: 'Apprivoisement x10', icon: '💚', category: 'rates', file: 'GameUserSettings.ini',
    description: 'Accélère l\'apprivoisement par 10.',
    code: `[ServerSettings]\nTamingSpeedMultiplier=10.0\nDinoCharacterFoodDrainMultiplier=0.5\nWildDinoTorporDrainMultiplier=0.5`,
    notes: 'WildDinoTorporDrainMultiplier réduit = torpeur baisse moins vite.', tags: ['taming', 'dinos'] },
  { id: 4, name: 'Dinos max niveau 150', icon: '🦕', category: 'dinos', file: 'GameUserSettings.ini',
    description: 'Configure les dinos sauvages jusqu\'au niveau 150.',
    code: `[ServerSettings]\nDifficultyOffset=1.0\nOverrideOfficialDifficulty=5.0`,
    notes: 'Formule : Niveau max = OverrideOfficialDifficulty × 30.', tags: ['difficulty', 'levels'] },
  { id: 5, name: 'Stats dinos par niveau', icon: '📈', category: 'dinos', file: 'Game.ini',
    description: 'Personnalise les stats par niveau des dinos apprivoisés.',
    code: `[/Script/ShooterGame.ShooterGameMode]\nPerLevelStatsMultiplier_DinoTamed[0]=1.0  ; Health\nPerLevelStatsMultiplier_DinoTamed[7]=1.0  ; Weight\nPerLevelStatsMultiplier_DinoTamed[8]=1.0  ; Melee`,
    notes: 'Index 8 (Melee) et 0 (Health) sont les plus impactants.', tags: ['stats', 'customization'] },
  { id: 6, name: 'Désactiver dinos gênants', icon: '🚫', category: 'dinos', file: 'Game.ini',
    description: 'Empêche certaines créatures de spawn.',
    code: `[/Script/ShooterGame.ShooterGameMode]\nNPCReplacements=(FromClassName="Cnidaria_Character_BP_C",ToClassName="")\nNPCReplacements=(FromClassName="Pegomastax_Character_BP_C",ToClassName="")`,
    notes: 'Cnidaria et Pegomastax souvent désactivés en PvE.', tags: ['spawn', 'disable'] },
  { id: 7, name: 'Breeding x50', icon: '🥚', category: 'breeding', file: 'GameUserSettings.ini',
    description: 'Breeding ultra rapide.',
    code: `[ServerSettings]\nMatingIntervalMultiplier=0.02\nEggHatchSpeedMultiplier=50.0\nBabyMatureSpeedMultiplier=50.0\nBabyCuddleIntervalMultiplier=0.02`,
    notes: 'Idéal pour événements ou serveurs très boosted.', tags: ['breeding', 'eggs'] },
  { id: 8, name: 'Breeding équilibré x10', icon: '🍼', category: 'breeding', file: 'GameUserSettings.ini',
    description: 'Breeding accéléré mais avec progression.',
    code: `[ServerSettings]\nMatingIntervalMultiplier=0.1\nEggHatchSpeedMultiplier=10.0\nBabyMatureSpeedMultiplier=15.0\nBabyImprintingStatScaleMultiplier=1.5`,
    notes: 'Bon compromis vitesse/gameplay.', tags: ['breeding', 'balanced'] },
  { id: 9, name: 'Stats joueur boostées', icon: '👤', category: 'player', file: 'Game.ini',
    description: 'Boost les stats joueur par niveau.',
    code: `[/Script/ShooterGame.ShooterGameMode]\nPerLevelStatsMultiplier_Player[0]=2.0  ; Health\nPerLevelStatsMultiplier_Player[7]=5.0  ; Weight\nPerLevelStatsMultiplier_Player[8]=2.0  ; Melee`,
    notes: 'Weight souvent très boosté pour le confort.', tags: ['player', 'stats'] },
  { id: 10, name: 'Configuration cluster', icon: '🔗', category: 'server', file: 'GameUserSettings.ini',
    description: 'Active les transferts entre serveurs.',
    code: `[ServerSettings]\nPreventDownloadSurvivors=False\nPreventDownloadItems=False\nPreventDownloadDinos=False\n\n; Commande: -clusterid=ARKADIA_CLUSTER`,
    notes: 'Tous les serveurs doivent avoir le même clusterid.', tags: ['cluster', 'transfer'] },
  { id: 11, name: 'RCON Administration', icon: '🔧', category: 'server', file: 'GameUserSettings.ini',
    description: 'Active RCON pour admin à distance.',
    code: `[ServerSettings]\nServerAdminPassword=VotreMotDePasseAdmin\nRCONEnabled=True\nRCONPort=27020`,
    notes: 'Mot de passe admin DIFFÉRENT du mot de passe joueur !', tags: ['RCON', 'admin'] },
  { id: 12, name: 'Performance serveur', icon: '⚡', category: 'server', file: 'Engine.ini',
    description: 'Optimise les performances réseau.',
    code: `[/Script/OnlineSubsystemUtils.IpNetDriver]\nNetServerMaxTickRate=60\nMaxClientRate=100000`,
    notes: 'Tickrate 60 = meilleure réactivité mais plus de CPU.', tags: ['performance', 'network'] },
  { id: 13, name: 'Loot quality x3', icon: '💎', category: 'quality', file: 'GameUserSettings.ini',
    description: 'Améliore la qualité du loot.',
    code: `[ServerSettings]\nSupplyCrateLootQualityMultiplier=3.0\nFishingLootQualityMultiplier=3.0`,
    notes: 'Affecte drops et pêche.', tags: ['loot', 'quality'] },
  { id: 14, name: 'Stacks x10', icon: '📦', category: 'quality', file: 'Game.ini',
    description: 'Augmente la taille des stacks.',
    code: `[/Script/ShooterGame.ShooterGameMode]\nItemStackSizeMultiplier=10.0`,
    notes: 'Réduit l\'encombrement inventaire.', tags: ['stacks', 'QoL'] },
  { id: 15, name: 'Event Winter Wonderland', icon: '❄️', category: 'events', file: 'GameUserSettings.ini',
    description: 'Active l\'événement de Noël.',
    code: `[ServerSettings]\nActiveEvent=WinterWonderland\n\n; Ou en commande: -ActiveEvent=WinterWonderland`,
    notes: 'Events : WinterWonderland, FearEvolved, Easter, Summer...', tags: ['event', 'christmas'] },
  { id: 16, name: 'Rates x2 Event', icon: '🎉', category: 'events', file: 'GameUserSettings.ini',
    description: 'Double tous les taux (style event officiel).',
    code: `[ServerSettings]\nTamingSpeedMultiplier=2.0\nHarvestAmountMultiplier=2.0\nXPMultiplier=2.0\nMatingIntervalMultiplier=0.5`,
    notes: 'À appliquer EN PLUS de vos taux de base.', tags: ['event', 'x2', 'boost'] },
]);

const filteredSnippets = computed(() => {
  let result = snippets.value;
  if (activeCategory.value !== 'all') result = result.filter(s => s.category === activeCategory.value);
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase();
    result = result.filter(s => s.name.toLowerCase().includes(q) || s.description.toLowerCase().includes(q) || s.tags.some(t => t.toLowerCase().includes(q)));
  }
  return result;
});

const getCountByCategory = (catId) => snippets.value.filter(s => s.category === catId).length;
const getCategoryName = (catId) => categories.find(c => c.id === catId)?.name || catId;
const toggleSnippet = (id) => { expandedSnippet.value = expandedSnippet.value === id ? null : id; };
const resetFilters = () => { activeCategory.value = 'all'; searchQuery.value = ''; };

const copyCode = async (code, id) => {
  try {
    await navigator.clipboard.writeText(code);
    copiedId.value = id;
    showToast.value = true;
    setTimeout(() => { copiedId.value = null; showToast.value = false; }, 2000);
  } catch (err) { console.error('Erreur copie:', err); }
};
</script>

<style scoped>
.ark-portal { --primary: #ff6b00; --accent: #00ff88; --bg: #0a0a0f; --surface: #12121a; --text: #e5e5e5; --text-muted: rgba(229,229,229,0.6); --border: rgba(255,107,0,0.2); background: var(--bg); color: var(--text); min-height: 100vh; font-family: 'JetBrains Mono', monospace; }
.portal-bg { position: fixed; inset: 0; pointer-events: none; z-index: 0; }
.hex-grid { position: absolute; inset: 0; background: radial-gradient(circle at 25% 25%, rgba(255,107,0,0.03) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(0,255,136,0.03) 0%, transparent 50%); }
.scan-line { position: absolute; top: 0; left: 0; right: 0; height: 4px; background: linear-gradient(90deg, transparent, var(--primary), transparent); animation: scan 4s linear infinite; }
@keyframes scan { 0% { transform: translateY(0); opacity: 0; } 10%, 90% { opacity: 1; } 100% { transform: translateY(100vh); opacity: 0; } }
.portal-hero { position: relative; z-index: 1; padding: 8rem 2rem 4rem; text-align: center; }
.container { max-width: 1200px; margin: 0 auto; }
.hero-badge { display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.5rem 1rem; background: rgba(255,107,0,0.1); border: 1px solid var(--primary); border-radius: 2rem; margin-bottom: 1.5rem; }
.badge-icon { font-size: 1.25rem; } .badge-text { font-size: 0.75rem; letter-spacing: 0.15em; color: var(--primary); }
.hero-title { margin-bottom: 1.5rem; }
.title-pre { display: block; font-size: 0.9rem; color: var(--text-muted); letter-spacing: 0.2em; text-transform: uppercase; }
.title-main { display: block; font-size: clamp(2rem, 6vw, 4rem); font-weight: 700; color: var(--primary); text-shadow: 0 0 40px rgba(255,107,0,0.4); margin: 0.5rem 0; }
.title-sub { display: block; font-size: 1rem; color: var(--text-muted); }
.hero-desc { font-size: 1.1rem; color: var(--text-muted); max-width: 600px; margin: 0 auto 2rem; }
.hero-stats { display: flex; justify-content: center; gap: 3rem; }
.stat { text-align: center; } .stat-value { display: block; font-size: 2rem; font-weight: 700; color: var(--primary); } .stat-label { font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; }
.filter-section { position: relative; z-index: 1; padding: 0 2rem 2rem; }
.filter-bar { display: flex; justify-content: center; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 1.5rem; }
.filter-btn { padding: 0.5rem 1rem; background: var(--surface); border: 1px solid var(--border); border-radius: 0.5rem; color: var(--text-muted); font-family: inherit; font-size: 0.8rem; cursor: pointer; transition: all 0.3s; }
.filter-btn:hover { border-color: var(--primary); color: var(--text); }
.filter-btn.active { background: rgba(255,107,0,0.15); border-color: var(--primary); color: var(--primary); }
.search-bar { position: relative; max-width: 400px; margin: 0 auto; }
.search-icon { position: absolute; left: 1rem; top: 50%; transform: translateY(-50%); }
.search-input { width: 100%; padding: 0.75rem 2.5rem; background: var(--surface); border: 1px solid var(--border); border-radius: 0.5rem; color: var(--text); font-family: inherit; }
.search-input:focus { outline: none; border-color: var(--primary); }
.snippets-section { position: relative; z-index: 1; padding: 2rem; }
.snippets-grid { display: flex; flex-direction: column; gap: 1rem; }
.snippet-card { background: var(--surface); border: 1px solid var(--border); border-radius: 0.75rem; overflow: hidden; transition: all 0.3s; }
.snippet-card:hover, .snippet-card.expanded { border-color: var(--primary); }
.snippet-card.expanded { box-shadow: 0 10px 40px rgba(255,107,0,0.15); }
.card-header { display: flex; justify-content: space-between; align-items: center; padding: 1rem 1.5rem; cursor: pointer; transition: background 0.3s; }
.card-header:hover { background: #1a1a25; }
.header-left { display: flex; align-items: center; gap: 1rem; }
.snippet-icon { font-size: 1.5rem; }
.snippet-info h3 { font-size: 1rem; font-weight: 600; margin-bottom: 0.25rem; }
.snippet-file { font-size: 0.75rem; color: var(--accent); }
.header-right { display: flex; align-items: center; gap: 1rem; }
.snippet-category { font-size: 0.7rem; color: var(--text-muted); padding: 0.25rem 0.75rem; background: #1a1a25; border-radius: 1rem; }
.expand-icon { color: var(--primary); font-size: 0.8rem; }
.card-body { padding: 0 1.5rem 1.5rem; border-top: 1px solid var(--border); }
.snippet-desc { font-size: 0.9rem; color: var(--text-muted); margin: 1rem 0; line-height: 1.6; }
.code-block { background: var(--bg); border: 1px solid var(--border); border-radius: 0.5rem; overflow: hidden; margin: 1rem 0; }
.code-header { display: flex; justify-content: space-between; align-items: center; padding: 0.5rem 1rem; background: #1a1a25; border-bottom: 1px solid var(--border); }
.code-lang { font-size: 0.75rem; color: var(--accent); }
.copy-btn { padding: 0.25rem 0.75rem; background: var(--primary); border: none; border-radius: 0.25rem; color: #000; font-family: inherit; font-size: 0.75rem; font-weight: 600; cursor: pointer; }
.copy-btn:hover { background: #ff8533; }
.code-content { padding: 1rem; margin: 0; font-size: 0.8rem; line-height: 1.6; overflow-x: auto; color: var(--accent); white-space: pre-wrap; }
.snippet-meta { display: flex; align-items: flex-start; gap: 0.75rem; padding: 1rem; background: rgba(0,255,136,0.05); border: 1px solid rgba(0,255,136,0.2); border-radius: 0.5rem; margin: 1rem 0; }
.snippet-meta p { font-size: 0.85rem; color: var(--text-muted); margin: 0; }
.snippet-tags { display: flex; flex-wrap: wrap; gap: 0.5rem; }
.tag { padding: 0.2rem 0.6rem; background: #1a1a25; border: 1px solid var(--border); border-radius: 0.25rem; font-size: 0.7rem; color: var(--text-muted); }
.empty-state { text-align: center; padding: 4rem 2rem; }
.empty-icon { font-size: 4rem; display: block; margin-bottom: 1rem; }
.reset-btn { padding: 0.75rem 1.5rem; background: var(--primary); border: none; border-radius: 0.5rem; color: #000; font-family: inherit; font-weight: 600; cursor: pointer; }
.reference-section { position: relative; z-index: 1; padding: 4rem 2rem; background: var(--surface); }
.reference-section h2 { text-align: center; font-size: 1.5rem; color: var(--primary); margin-bottom: 2rem; }
.reference-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem; }
.ref-card { padding: 1.5rem; background: var(--bg); border: 1px solid var(--border); border-radius: 0.75rem; }
.ref-card h3 { font-size: 1rem; color: var(--primary); margin-bottom: 0.75rem; }
.ref-card p { font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1rem; }
.ref-card code { display: block; padding: 0.5rem; background: var(--surface); border-radius: 0.25rem; font-size: 0.65rem; color: var(--accent); word-break: break-all; }
.cta-section { position: relative; z-index: 1; padding: 4rem 2rem; }
.cta-card { text-align: center; padding: 3rem; background: linear-gradient(135deg, rgba(255,107,0,0.1), rgba(0,255,136,0.05)); border: 1px solid var(--primary); border-radius: 1rem; }
.cta-card h2 { font-size: 1.75rem; color: var(--primary); margin-bottom: 0.5rem; }
.cta-card > p { color: var(--text-muted); margin-bottom: 2rem; }
.cta-buttons { display: flex; justify-content: center; gap: 1rem; flex-wrap: wrap; }
.cta-btn { display: inline-flex; align-items: center; gap: 0.5rem; padding: 1rem 1.5rem; border-radius: 0.5rem; font-family: inherit; font-size: 0.9rem; font-weight: 600; text-decoration: none; transition: all 0.3s; }
.cta-btn--primary { background: var(--primary); color: #000; }
.cta-btn--primary:hover { background: #ff8533; transform: translateY(-2px); }
.cta-btn--secondary { background: transparent; border: 1px solid var(--border); color: var(--text); }
.cta-btn--secondary:hover { border-color: var(--primary); color: var(--primary); }
.toast { position: fixed; bottom: 2rem; left: 50%; transform: translateX(-50%); padding: 1rem 2rem; background: var(--accent); color: #000; font-weight: 600; border-radius: 0.5rem; z-index: 1000; }
.toast-enter-active, .toast-leave-active { transition: all 0.3s ease; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateX(-50%) translateY(20px); }
.skip-link { position: absolute; top: -100%; left: 50%; transform: translateX(-50%); padding: 1rem; background: var(--primary); color: #000; text-decoration: none; border-radius: 0.5rem; z-index: 1000; }
.skip-link:focus { top: 1rem; }
@media (max-width: 768px) { .hero-stats { flex-direction: column; gap: 1.5rem; } .filter-btn { font-size: 0.7rem; padding: 0.4rem 0.75rem; } .card-header { flex-direction: column; align-items: flex-start; gap: 0.75rem; } .cta-buttons { flex-direction: column; } }
@media (prefers-reduced-motion: reduce) { .scan-line { animation: none; } }
</style>
