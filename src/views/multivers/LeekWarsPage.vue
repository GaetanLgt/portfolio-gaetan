<template>
  <div class="leek-page">
    <a href="#main-content" class="skip-link">Aller au contenu principal</a>

    <!-- CODE RAIN BACKGROUND -->
    <div class="code-rain" aria-hidden="true">
      <div v-for="i in 25" :key="i" class="code-drop" :style="{ '--delay': i * 0.12 + 's', '--x': (i * 4) + '%' }">
        {{ codeSnippets[i % codeSnippets.length] }}
      </div>
    </div>

    <!-- HERO : DEATHTINY -->
    <section id="hero" class="leek-hero" aria-labelledby="hero-title">
      <div class="arena-bg" aria-hidden="true">
        <div class="arena-grid">
          <div v-for="i in 64" :key="i" class="grid-cell" :class="{ active: activeCells.includes(i) }"></div>
        </div>
      </div>

      <div class="container" id="main-content">
        <div class="hero-content">
          <div class="leek-card">
            <div class="leek-avatar" @click="attackAnimation">
              <div class="leek-body" :class="{ attacking: isAttacking }">
                <span class="leek-emoji">🥬</span>
              </div>
              <div class="attack-particles" v-if="isAttacking">
                <span v-for="i in 5" :key="i" class="particle">⚡</span>
              </div>
            </div>
            <div class="leek-info">
              <h2 class="leek-name">Deathtiny</h2>
              <p class="leek-farmer">Élevé par <strong>NeoKamuy</strong></p>
              <div class="leek-level">
                <span class="level-badge">Niv. 26</span>
                <span class="talent">🏆 58</span>
              </div>
            </div>
          </div>

          <div class="hero-text">
            <h1 id="hero-title" class="hero-title">
              <span class="title-pre">LEEK WARS</span>
              <span class="title-main" :class="{ victory: showVictory }">
                {{ showVictory ? '🏆 VICTOIRE !' : 'CODE. COMBAT. CONQUÊTE.' }}
              </span>
            </h1>
            <p class="hero-quote">
              « Dans l'arène, seul le code le plus malin survit. »
            </p>
          </div>
        </div>

        <div class="combat-record">
          <div class="record-stat win">
            <span class="record-value">155</span>
            <span class="record-label">Victoires</span>
          </div>
          <div class="record-stat draw">
            <span class="record-value">13</span>
            <span class="record-label">Nuls</span>
          </div>
          <div class="record-stat loss">
            <span class="record-value">149</span>
            <span class="record-label">Défaites</span>
          </div>
        </div>

        <div class="hero-actions">
          <button class="battle-btn" @click="triggerVictory">
            <span class="btn-icon">⚔️</span>
            <span class="btn-text">LANCER UN COMBAT</span>
          </button>
          <a href="https://leekwars.com" target="_blank" rel="noopener" class="play-btn">
            <span class="btn-icon">🎮</span>
            <span class="btn-text">JOUER À LEEK WARS</span>
          </a>
        </div>
      </div>
    </section>

    <!-- STATS : Caractéristiques Deathtiny -->
    <section id="stats" class="leek-section stats-section" aria-labelledby="stats-title">
      <div class="container">
        <div class="section-header">
          <span class="header-icon">📊</span>
          <h2 id="stats-title">CARACTÉRISTIQUES</h2>
          <p class="section-sub">Build Agilité/Esquive de Deathtiny</p>
        </div>

        <div class="stats-grid">
          <div v-for="stat in leekStats" :key="stat.name" class="stat-card" :style="{ '--stat-color': stat.color }">
            <div class="stat-header">
              <span class="stat-icon">{{ stat.icon }}</span>
              <span class="stat-name">{{ stat.name }}</span>
            </div>
            <div class="stat-bar-container">
              <div class="stat-bar-bg">
                <div class="stat-bar-fill" :style="{ width: (stat.value / stat.max * 100) + '%' }"></div>
              </div>
            </div>
            <div class="stat-values">
              <span class="stat-current">{{ stat.value }}</span>
              <span class="stat-max">/ {{ stat.max }}</span>
            </div>
          </div>
        </div>

        <div class="build-analysis">
          <div class="analysis-card">
            <h3>🎯 Analyse du Build</h3>
            <ul class="analysis-list">
              <li><span class="highlight green">100 Agilité</span> = Haute esquive & précision</li>
              <li><span class="highlight red">0 Force</span> = Dégâts arme faibles</li>
              <li><span class="highlight blue">20 Science</span> = Dégâts puces modérés</li>
              <li><span class="highlight yellow">Stratégie</span> = Tank esquive + War of Attrition</li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- EQUIPMENT : Armes & Puces -->
    <section id="equipment" class="leek-section equipment-section" aria-labelledby="equipment-title">
      <div class="container">
        <div class="section-header">
          <span class="header-icon">🎒</span>
          <h2 id="equipment-title">ÉQUIPEMENT</h2>
          <p class="section-sub">L'arsenal de Deathtiny</p>
        </div>

        <div class="equipment-grid">
          <div class="equipment-category">
            <h3 class="category-title">⚔️ Armes <span class="count">2/2</span></h3>
            <div class="items-grid">
              <div v-for="weapon in weapons" :key="weapon.name" class="item-card weapon">
                <span class="item-icon">{{ weapon.icon }}</span>
                <div class="item-info">
                  <span class="item-name">{{ weapon.name }}</span>
                  <span class="item-stats">{{ weapon.stats }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="equipment-category">
            <h3 class="category-title">💊 Puces <span class="count">11/20</span></h3>
            <div class="items-grid chips">
              <div v-for="chip in chips" :key="chip.name" class="item-card chip" :class="chip.type">
                <span class="item-icon">{{ chip.icon }}</span>
                <div class="item-info">
                  <span class="item-name">{{ chip.name }}</span>
                  <span class="item-cost">{{ chip.cost }} PT</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- AI CODE : LeekScript -->
    <section id="ai-code" class="leek-section code-section" aria-labelledby="code-title">
      <div class="container">
        <div class="section-header">
          <span class="header-icon">🧠</span>
          <h2 id="code-title">INTELLIGENCE ARTIFICIELLE</h2>
          <p class="section-sub">NeoFindThePath v7 - IA optimisée anti-plantage</p>
        </div>

        <div class="code-editor">
          <div class="editor-header">
            <div class="editor-dots">
              <span class="dot dot--red"></span>
              <span class="dot dot--yellow"></span>
              <span class="dot dot--green"></span>
            </div>
            <span class="editor-title">NeoFindThePath_v7.ls</span>
            <div class="editor-actions">
              <button class="copy-btn" @click="copyCode">📋 Copier</button>
            </div>
          </div>
          <div class="editor-content">
            <pre class="code-block"><code><span class="code-comment">// NeoFindThePath v7 ULTRA MINIMAL</span>
<span class="code-comment">// Build: Agilité 100 / Force 0</span>
<span class="code-comment">// Stratégie: Esquive + Puces</span>

<span class="code-comment">// === INIT ===</span>
<span class="code-keyword">if</span> (<span class="code-func">getWeapon</span>() == <span class="code-null">null</span>) <span class="code-func">setWeapon</span>(WEAPON_PISTOL);
<span class="code-keyword">var</span> enemy = <span class="code-func">getNearestEnemy</span>();

<span class="code-comment">// === DEFENSE ===</span>
<span class="code-keyword">var</span> vie = <span class="code-func">getLife</span>() / <span class="code-func">getTotalLife</span>();

<span class="code-keyword">if</span> (<span class="code-func">canUseChip</span>(CHIP_HELMET, <span class="code-func">getEntity</span>())) {
  <span class="code-func">useChip</span>(CHIP_HELMET, <span class="code-func">getEntity</span>());
}

<span class="code-keyword">if</span> (vie < <span class="code-num">0.7</span>) {
  <span class="code-keyword">if</span> (<span class="code-func">canUseChip</span>(CHIP_CURE, <span class="code-func">getEntity</span>())) 
    <span class="code-func">useChip</span>(CHIP_CURE, <span class="code-func">getEntity</span>());
  <span class="code-keyword">if</span> (<span class="code-func">canUseChip</span>(CHIP_BANDAGE, <span class="code-func">getEntity</span>())) 
    <span class="code-func">useChip</span>(CHIP_BANDAGE, <span class="code-func">getEntity</span>());
}

<span class="code-comment">// === ATTACK ===</span>
<span class="code-keyword">if</span> (enemy != <span class="code-null">null</span> && <span class="code-func">isAlive</span>(enemy)) {
  <span class="code-comment">// SPARK x4 (dégâts Science)</span>
  <span class="code-keyword">if</span> (<span class="code-func">canUseChip</span>(CHIP_SPARK, enemy)) <span class="code-func">useChip</span>(CHIP_SPARK, enemy);
  <span class="code-keyword">if</span> (<span class="code-func">canUseChip</span>(CHIP_SPARK, enemy)) <span class="code-func">useChip</span>(CHIP_SPARK, enemy);
  <span class="code-keyword">if</span> (<span class="code-func">canUseChip</span>(CHIP_SPARK, enemy)) <span class="code-func">useChip</span>(CHIP_SPARK, enemy);
  <span class="code-keyword">if</span> (<span class="code-func">canUseChip</span>(CHIP_SPARK, enemy)) <span class="code-func">useChip</span>(CHIP_SPARK, enemy);
  
  <span class="code-comment">// ICE (ralentit l'ennemi)</span>
  <span class="code-keyword">if</span> (<span class="code-func">canUseChip</span>(CHIP_ICE, enemy)) <span class="code-func">useChip</span>(CHIP_ICE, enemy);
}</code></pre>
          </div>
          <div class="editor-footer">
            <span class="status success">✅ 0 plantages garantis</span>
            <span class="ops">&lt; 10k ops/tour</span>
          </div>
        </div>

        <div class="version-history">
          <h3>📜 Historique des versions</h3>
          <div class="versions">
            <div class="version" v-for="v in versions" :key="v.name">
              <span class="version-name">{{ v.name }}</span>
              <span class="version-status" :class="v.status">{{ v.statusText }}</span>
              <span class="version-desc">{{ v.desc }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- NODE EDITOR : Visual Programming -->
    <section id="node-editor" class="leek-section node-section" aria-labelledby="node-title">
      <div class="container">
        <div class="section-header">
          <span class="header-icon">🎨</span>
          <h2 id="node-title">NODE EDITOR</h2>
          <p class="section-sub">Programmation visuelle pour LeekScript</p>
        </div>

        <div class="node-preview">
          <div class="node-canvas">
            <svg class="node-connections">
              <path d="M 150 80 C 200 80, 220 140, 270 140" stroke="#7bc043" stroke-width="3" fill="none" />
              <path d="M 150 100 C 200 100, 220 200, 270 200" stroke="#ffd93d" stroke-width="3" fill="none" />
              <path d="M 420 170 C 470 170, 490 140, 540 140" stroke="#a855f7" stroke-width="3" fill="none" />
            </svg>
            
            <div class="node node-start" style="left: 30px; top: 50px;">
              <div class="node-header">🚀 Début Tour</div>
              <div class="node-port port-out"></div>
            </div>
            
            <div class="node node-target" style="left: 30px; top: 160px;">
              <div class="node-header">🎯 Ennemi proche</div>
              <div class="node-port port-out target"></div>
            </div>
            
            <div class="node node-condition" style="left: 270px; top: 110px;">
              <div class="node-header">❓ Peut tirer?</div>
              <div class="node-ports">
                <div class="node-port port-in"></div>
                <div class="node-port port-in target"></div>
              </div>
              <div class="node-port port-out bool"></div>
            </div>
            
            <div class="node node-action" style="left: 540px; top: 100px;">
              <div class="node-header">⚡ Utiliser Arme</div>
              <div class="node-ports">
                <div class="node-port port-in"></div>
                <div class="node-port port-in target"></div>
              </div>
            </div>
          </div>
          
          <div class="node-info">
            <h3>🧩 Programmation par blocs</h3>
            <p>Crée ton IA sans écrire une ligne de code ! Connecte des nodes pour définir le comportement de ton poireau.</p>
            <ul class="node-features">
              <li><span class="node-type flow">🔀</span> Flux d'exécution</li>
              <li><span class="node-type target">🎯</span> Ciblage</li>
              <li><span class="node-type condition">❓</span> Conditions</li>
              <li><span class="node-type action">⚡</span> Actions</li>
            </ul>
            <a href="/leekwars/node-editor.html" target="_blank" class="try-editor-btn">
              🚀 Essayer l'éditeur
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- COMBAT LOG : Dernier combat -->
    <section id="combat" class="leek-section combat-section" aria-labelledby="combat-title">
      <div class="container">
        <div class="section-header">
          <span class="header-icon">📋</span>
          <h2 id="combat-title">DERNIER COMBAT</h2>
          <p class="section-sub">Deathtiny vs Dracobulbe</p>
        </div>

        <div class="combat-result victory">
          <div class="result-header">
            <span class="result-icon">🏆</span>
            <span class="result-text">VICTOIRE</span>
          </div>
          
          <div class="combatants">
            <div class="combatant winner">
              <span class="combatant-emoji">🥬</span>
              <span class="combatant-name">Deathtiny</span>
              <span class="combatant-level">Niv. 26</span>
            </div>
            <div class="vs">VS</div>
            <div class="combatant loser">
              <span class="combatant-emoji">🥬</span>
              <span class="combatant-name">Dracobulbe</span>
              <span class="combatant-level">Niv. 26</span>
            </div>
          </div>

          <div class="combat-stats-grid">
            <div class="combat-stat">
              <span class="stat-label">Dégâts infligés</span>
              <div class="stat-comparison">
                <span class="stat-value win">688</span>
                <span class="stat-value lose">427</span>
              </div>
            </div>
            <div class="combat-stat">
              <span class="stat-label">Soins</span>
              <div class="stat-comparison">
                <span class="stat-value win">192</span>
                <span class="stat-value lose">97</span>
              </div>
            </div>
            <div class="combat-stat">
              <span class="stat-label">Tours joués</span>
              <div class="stat-comparison">
                <span class="stat-value">23</span>
                <span class="stat-value">22</span>
              </div>
            </div>
            <div class="combat-stat">
              <span class="stat-label">Tirs</span>
              <div class="stat-comparison">
                <span class="stat-value win">37</span>
                <span class="stat-value lose">22</span>
              </div>
            </div>
          </div>

          <div class="combat-highlight">
            <span class="highlight-icon">💡</span>
            <span class="highlight-text">Dracobulbe a planté 2 fois ! Bug dans son IA = tours gratuits 🎁</span>
          </div>
        </div>
      </div>
    </section>

    <!-- LEGENDS : ColiqueNephretique -->
    <section id="legends" class="leek-section legends-section" aria-labelledby="legends-title">
      <div class="container">
        <div class="section-header">
          <span class="header-icon">👑</span>
          <h2 id="legends-title">LÉGENDES</h2>
          <p class="section-sub">Les poireaux d'élite</p>
        </div>

        <div class="legends-grid">
          <!-- ColiqueNephretique -->
          <div class="legend-card legendary">
            <div class="legend-header">
              <div class="legend-avatar">
                <span class="legend-emoji">🥬</span>
                <span class="legend-crown">👑</span>
              </div>
              <div class="legend-title">
                <h3 class="legend-name">ColiqueNephretique</h3>
                <p class="legend-quote">« Donneuse douée »</p>
                <p class="legend-farmer">Élevé par <strong>PaploufLePalouf</strong></p>
              </div>
            </div>
            
            <div class="legend-stats-row">
              <div class="legend-level">
                <span class="level-number">300</span>
                <span class="level-label">Niveau</span>
              </div>
              <div class="legend-talent">
                <span class="talent-number">1369</span>
                <span class="talent-label">Talent</span>
              </div>
            </div>

            <div class="legend-record">
              <div class="record-item win">
                <span class="record-value">3945</span>
                <span class="record-label">Victoires</span>
              </div>
              <div class="record-item draw">
                <span class="record-value">2138</span>
                <span class="record-label">Nuls</span>
              </div>
              <div class="record-item loss">
                <span class="record-value">3514</span>
                <span class="record-label">Défaites</span>
              </div>
            </div>

            <div class="legend-build">
              <h4>Build Tank DPS Poison 🔥</h4>
              <div class="build-stats">
                <div class="build-stat"><span class="stat-icon">❤️</span> 1505 Vie</div>
                <div class="build-stat"><span class="stat-icon">💪</span> 403 Force</div>
                <div class="build-stat"><span class="stat-icon">🔬</span> 403 Science</div>
                <div class="build-stat"><span class="stat-icon">🛡️</span> 231 Résist.</div>
                <div class="build-stat"><span class="stat-icon">🏃</span> 100 Agilité</div>
                <div class="build-stat"><span class="stat-icon">🎯</span> 22 PT</div>
              </div>
            </div>

            <div class="legend-equipment">
              <div class="equip-section">
                <span class="equip-label">Armes</span>
                <span class="equip-items">🔥 Lance-flammes • 🔫 Double Gun • ⚔️</span>
              </div>
              <div class="equip-section">
                <span class="equip-label">Puces</span>
                <span class="equip-items">20/20 équipées (FULL!)</span>
              </div>
            </div>
          </div>

          <!-- Deathtiny (en progression) -->
          <div class="legend-card apprentice">
            <div class="legend-header">
              <div class="legend-avatar">
                <span class="legend-emoji">🥬</span>
                <span class="legend-badge">🌱</span>
              </div>
              <div class="legend-title">
                <h3 class="legend-name">Deathtiny</h3>
                <p class="legend-quote">« L'apprenti »</p>
                <p class="legend-farmer">Élevé par <strong>NeoKamuy</strong></p>
              </div>
            </div>
            
            <div class="legend-stats-row">
              <div class="legend-level">
                <span class="level-number">26</span>
                <span class="level-label">Niveau</span>
              </div>
              <div class="legend-talent">
                <span class="talent-number">58</span>
                <span class="talent-label">Talent</span>
              </div>
            </div>

            <div class="legend-record">
              <div class="record-item win">
                <span class="record-value">155</span>
                <span class="record-label">Victoires</span>
              </div>
              <div class="record-item draw">
                <span class="record-value">13</span>
                <span class="record-label">Nuls</span>
              </div>
              <div class="record-item loss">
                <span class="record-value">149</span>
                <span class="record-label">Défaites</span>
              </div>
            </div>

            <div class="legend-build">
              <h4>Build Agilité/Esquive 🏃</h4>
              <div class="build-stats">
                <div class="build-stat"><span class="stat-icon">❤️</span> 275 Vie</div>
                <div class="build-stat"><span class="stat-icon">🏃</span> 100 Agilité</div>
                <div class="build-stat"><span class="stat-icon">🔬</span> 20 Science</div>
                <div class="build-stat"><span class="stat-icon">🧠</span> 20 Sagesse</div>
                <div class="build-stat"><span class="stat-icon">⚡</span> 20 Fréquence</div>
                <div class="build-stat"><span class="stat-icon">🎯</span> 10 PT</div>
              </div>
            </div>

            <div class="legend-progress">
              <div class="progress-bar">
                <div class="progress-fill" style="width: 8.6%"></div>
              </div>
              <span class="progress-text">Niveau 26/300 (8.6%)</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- GAME MODES -->
    <section id="modes" class="leek-section modes-section" aria-labelledby="modes-title">
      <div class="container">
        <div class="section-header">
          <span class="header-icon">🎮</span>
          <h2 id="modes-title">MODES DE JEU</h2>
          <p class="section-sub">Différentes façons de combattre</p>
        </div>

        <div class="modes-grid">
          <div v-for="mode in gameModes" :key="mode.name" class="mode-card">
            <span class="mode-icon">{{ mode.icon }}</span>
            <h3 class="mode-name">{{ mode.name }}</h3>
            <p class="mode-desc">{{ mode.desc }}</p>
            <span class="mode-players">{{ mode.players }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- LADDER -->
    <section id="ladder" class="leek-section ladder-section" aria-labelledby="ladder-title">
      <div class="container">
        <div class="section-header">
          <span class="header-icon">🏆</span>
          <h2 id="ladder-title">CLASSEMENT</h2>
          <p class="section-sub">Grimpez dans le ladder !</p>
        </div>

        <div class="ladder-tabs">
          <button 
            v-for="tab in ladderTabs" 
            :key="tab.id" 
            class="tab-btn"
            :class="{ active: activeLadderTab === tab.id }"
            @click="activeLadderTab = tab.id"
          >
            {{ tab.icon }} {{ tab.name }}
          </button>
        </div>

        <div class="ladder-table">
          <div class="ladder-header">
            <span class="col-rank">#</span>
            <span class="col-name">Nom</span>
            <span class="col-talent">Talent</span>
            <span class="col-level">Niveau</span>
          </div>
          <div class="ladder-body">
            <div v-for="(entry, index) in currentLadder" :key="entry.name" class="ladder-row" :class="{ highlight: entry.highlight }">
              <span class="col-rank">{{ index + 1 }}</span>
              <span class="col-name">
                <span class="entry-emoji">🥬</span>
                {{ entry.name }}
              </span>
              <span class="col-talent">{{ entry.talent }}</span>
              <span class="col-level">{{ entry.level }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ARKADIA INFINITUM PROMO -->
    <section id="game-promo" class="leek-section game-promo-section" aria-labelledby="promo-title">
      <div class="container">
        <div class="promo-card">
          <div class="promo-header">
            <span class="promo-badge">NOUVEAU</span>
            <h2 id="promo-title">ARKADIA INFINITUM</h2>
            <p class="promo-tagline">L'univers est infini. Ta santé mentale ne l'est pas.</p>
          </div>
          
          <div class="promo-features">
            <div class="promo-feature">
              <span class="feature-icon">🌳</span>
              <span>Exploration Terraria</span>
            </div>
            <div class="promo-feature">
              <span class="feature-icon">⚙️</span>
              <span>Automatisation Factorio</span>
            </div>
            <div class="promo-feature">
              <span class="feature-icon">🦖</span>
              <span>Taming ARK</span>
            </div>
            <div class="promo-feature">
              <span class="feature-icon">🌌</span>
              <span>Univers No Man's Sky</span>
            </div>
            <div class="promo-feature">
              <span class="feature-icon">🎭</span>
              <span>Sanity Eternal Darkness</span>
            </div>
            <div class="promo-feature">
              <span class="feature-icon">💻</span>
              <span>Code tes créatures</span>
            </div>
          </div>

          <div class="promo-warning">
            <span class="warning-icon">👁️</span>
            <p>Attention : Le jeu peut te troller. Faux bugs, faux crashs, hallucinations... Le vide spatial affecte ta santé mentale.</p>
          </div>

          <router-link to="/play/arkadia-infinitum" class="play-game-btn">
            <span class="btn-icon">🚀</span>
            <span class="btn-text">JOUER MAINTENANT</span>
          </router-link>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section id="cta" class="leek-section cta-section" aria-labelledby="cta-title">
      <div class="container">
        <div class="cta-content">
          <div class="cta-icon">🥬⚔️</div>
          <h2 id="cta-title">PRÊT À CODER TON CHAMPION ?</h2>
          <p>Rejoins 50 000+ joueurs et élève ton propre poireau guerrier !</p>
          <div class="cta-buttons">
            <a href="https://leekwars.com" target="_blank" rel="noopener" class="cta-btn primary">
              <span>🎮 Jouer Gratuitement</span>
            </a>
            <a href="https://leekwars.com/help/tutorial" target="_blank" rel="noopener" class="cta-btn secondary">
              <span>📖 Tutoriel</span>
            </a>
          </div>
          <p class="cta-note">🇫🇷 Fait en France • 100% Gratuit • Pas de Pay-to-Win</p>
        </div>
      </div>
    </section>

    <!-- FOOTER -->
    <footer class="leek-footer">
      <div class="container">
        <div class="footer-content">
          <router-link to="/multivers" class="back-link">
            <span>←</span> Retour au Multivers
          </router-link>
          <p class="footer-credit">
            Univers inspiré par <a href="https://leekwars.com" target="_blank" rel="noopener">Leek Wars</a>
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
import { ref, reactive, computed } from 'vue';

// Animations
const isAttacking = ref(false);
const showVictory = ref(false);
const activeCells = ref([27, 28, 35, 36]);
const activeLadderTab = ref('leeks');

// Code snippets pour le rain effect
const codeSnippets = [
  'var enemy',
  'getLife()',
  'moveToward',
  'useWeapon',
  'CHIP_SPARK',
  'if (alive)',
  'getNearestEnemy',
  'getTP()',
  'setWeapon',
  'useChip',
  'getCell()',
  'isAlive(e)',
  'getMP()',
  'lineOfSight',
  'WEAPON_PISTOL'
];

// Stats de Deathtiny (réelles!)
const leekStats = reactive([
  { name: 'Vie', icon: '❤️', value: 275, max: 1000, color: '#e74c3c' },
  { name: 'Force', icon: '💪', value: 0, max: 500, color: '#e67e22' },
  { name: 'Agilité', icon: '🏃', value: 100, max: 500, color: '#2ecc71' },
  { name: 'Sagesse', icon: '🧠', value: 20, max: 500, color: '#9b59b6' },
  { name: 'Résistance', icon: '🛡️', value: 0, max: 500, color: '#3498db' },
  { name: 'Science', icon: '🔬', value: 20, max: 500, color: '#1abc9c' },
  { name: 'Magie', icon: '✨', value: 0, max: 500, color: '#e91e63' },
  { name: 'Fréquence', icon: '⚡', value: 20, max: 100, color: '#f1c40f' },
  { name: 'PM', icon: '👟', value: 4, max: 10, color: '#00bcd4' },
  { name: 'PT', icon: '🎯', value: 10, max: 20, color: '#ff5722' }
]);

// Équipement
const weapons = reactive([
  { name: 'Pistolet', icon: '🔫', stats: 'Portée: 1-7 • Coût: 3 PT' },
  { name: 'Shotgun', icon: '💥', stats: 'Portée: 1-3 • Coût: 4 PT' }
]);

const chips = reactive([
  { name: 'Bandage', icon: '🩹', cost: 2, type: 'heal' },
  { name: 'Guérison', icon: '💚', cost: 4, type: 'heal' },
  { name: 'Casque', icon: '🪖', cost: 3, type: 'shield' },
  { name: 'Étincelle', icon: '⚡', cost: 3, type: 'damage' },
  { name: 'Glaçon', icon: '🧊', cost: 4, type: 'damage' },
  { name: 'Ice', icon: '❄️', cost: 3, type: 'control' }
]);

// Versions de l'IA
const versions = reactive([
  { name: 'v8 OPTIMIZED', status: 'success', statusText: '✅ Nouvelle!', desc: 'Full features, anti-plantage, niveau 300+' },
  { name: 'v7 MINIMAL', status: 'success', statusText: '✅ Active', desc: 'Ultra-légère, 0 plantage' },
  { name: 'v6 AGILITY', status: 'warning', statusText: '⚠️ Trop lourd', desc: 'Build esquive optimisé' },
  { name: 'v5 OPTIMIZED', status: 'error', statusText: '❌ Plantages', desc: 'Trop d\'opérations' },
  { name: 'v4 LEGACY', status: 'error', statusText: '❌ Obsolète', desc: 'Version initiale' }
]);

// Modes de jeu
const gameModes = reactive([
  { name: 'Solo', icon: '🥬', desc: 'Combat 1 contre 1', players: '1v1' },
  { name: 'Équipe', icon: '👥', desc: 'Combats en équipe', players: '3v3' },
  { name: 'Éleveur', icon: '🌱', desc: 'Tous tes poireaux', players: '4v4' },
  { name: 'Battle Royale', icon: '👑', desc: 'Chacun pour soi', players: 'FFA' }
]);

// Ladder tabs
const ladderTabs = [
  { id: 'leeks', name: 'Poireaux', icon: '🥬' },
  { id: 'farmers', name: 'Éleveurs', icon: '👨‍🌾' },
  { id: 'teams', name: 'Équipes', icon: '👥' }
];

// Ladder data
const ladderData = {
  leeks: [
    { name: 'MasterLeek', talent: 5420, level: 301 },
    { name: 'GreenWarrior', talent: 5380, level: 298 },
    { name: 'CodeNinja', talent: 5350, level: 295 },
    { name: 'PoireauKing', talent: 5290, level: 290 },
    { name: 'Deathtiny', talent: 58, level: 26, highlight: true }
  ],
  farmers: [
    { name: 'TopFarmer', talent: 12500, level: 350 },
    { name: 'LeekMaster', talent: 12200, level: 345 },
    { name: 'ProGrower', talent: 11900, level: 340 },
    { name: 'VegetableKing', talent: 11500, level: 335 },
    { name: 'NeoKamuy', talent: 58, level: 26, highlight: true }
  ],
  teams: [
    { name: 'Elite Squad', talent: 8500, level: '-' },
    { name: 'Green Force', talent: 8200, level: '-' },
    { name: 'Vegan Army', talent: 7900, level: '-' },
    { name: 'Leek Lords', talent: 7600, level: '-' },
    { name: 'Solo Warriors', talent: 7300, level: '-' }
  ]
};

const currentLadder = computed(() => ladderData[activeLadderTab.value]);

// Actions
const attackAnimation = () => {
  isAttacking.value = true;
  // Activer des cellules random
  activeCells.value = Array.from({ length: 8 }, () => Math.floor(Math.random() * 64));
  setTimeout(() => {
    isAttacking.value = false;
    activeCells.value = [27, 28, 35, 36];
  }, 500);
};

const triggerVictory = () => {
  showVictory.value = true;
  attackAnimation();
  setTimeout(() => showVictory.value = false, 2000);
};

const copyCode = () => {
  const code = `// NeoFindThePath v7 ULTRA MINIMAL
if (getWeapon() == null) setWeapon(WEAPON_PISTOL);
var enemy = getNearestEnemy();

var vie = getLife() / getTotalLife();
if (canUseChip(CHIP_HELMET, getEntity())) useChip(CHIP_HELMET, getEntity());
if (vie < 0.7) {
  if (canUseChip(CHIP_CURE, getEntity())) useChip(CHIP_CURE, getEntity());
  if (canUseChip(CHIP_BANDAGE, getEntity())) useChip(CHIP_BANDAGE, getEntity());
}

if (enemy != null && isAlive(enemy)) {
  if (canUseChip(CHIP_SPARK, enemy)) useChip(CHIP_SPARK, enemy);
  if (canUseChip(CHIP_SPARK, enemy)) useChip(CHIP_SPARK, enemy);
  if (canUseChip(CHIP_SPARK, enemy)) useChip(CHIP_SPARK, enemy);
  if (canUseChip(CHIP_SPARK, enemy)) useChip(CHIP_SPARK, enemy);
  if (canUseChip(CHIP_ICE, enemy)) useChip(CHIP_ICE, enemy);
}`;
  navigator.clipboard.writeText(code);
  alert('Code copié ! 📋');
};
</script>

<style scoped>
/* ========== VARIABLES ========== */
.leek-page {
  --leek-green: #7bc043;
  --leek-dark: #3e8914;
  --leek-light: #a4d96c;
  --bg-dark: #0a150a;
  --bg-card: #1a2e1a;
  --bg-card-hover: #243d24;
  --text: #e8f5e8;
  --text-muted: #8ba88b;
  --gold: #ffd700;
  --red: #e74c3c;
  --blue: #3498db;
  
  min-height: 100vh;
  background: var(--bg-dark);
  color: var(--text);
  font-family: 'Space Grotesk', system-ui, sans-serif;
  overflow-x: hidden;
}

/* ========== UTILITIES ========== */
.skip-link {
  position: absolute;
  top: -100%;
  left: 0;
  background: var(--leek-green);
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

/* ========== CODE RAIN ========== */
.code-rain {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
}

.code-drop {
  position: absolute;
  top: -50px;
  left: var(--x);
  font-family: 'Fira Code', monospace;
  font-size: 0.7rem;
  color: var(--leek-green);
  opacity: 0.15;
  animation: codeFall 8s linear infinite;
  animation-delay: var(--delay);
  writing-mode: vertical-rl;
}

@keyframes codeFall {
  0% { transform: translateY(-50px); opacity: 0; }
  10% { opacity: 0.15; }
  90% { opacity: 0.15; }
  100% { transform: translateY(100vh); opacity: 0; }
}

/* ========== HERO ========== */
.leek-hero {
  min-height: 100vh;
  display: flex;
  align-items: center;
  position: relative;
  padding: 4rem 0;
  z-index: 1;
}

.arena-bg {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.1;
}

.arena-grid {
  display: grid;
  grid-template-columns: repeat(8, 40px);
  gap: 2px;
}

.grid-cell {
  width: 40px;
  height: 40px;
  background: var(--leek-dark);
  border-radius: 4px;
  transition: all 0.3s;
}

.grid-cell.active {
  background: var(--leek-green);
  box-shadow: 0 0 20px var(--leek-green);
}

.hero-content {
  display: flex;
  align-items: center;
  gap: 3rem;
  margin-bottom: 2rem;
}

.leek-card {
  background: var(--bg-card);
  border: 2px solid var(--leek-dark);
  border-radius: 16px;
  padding: 1.5rem;
  text-align: center;
  min-width: 200px;
}

.leek-avatar {
  width: 100px;
  height: 100px;
  margin: 0 auto 1rem;
  cursor: pointer;
  position: relative;
}

.leek-body {
  font-size: 4rem;
  transition: transform 0.1s;
}

.leek-body.attacking {
  animation: leekAttack 0.3s ease-out;
}

@keyframes leekAttack {
  0%, 100% { transform: translateX(0) rotate(0); }
  25% { transform: translateX(-10px) rotate(-10deg); }
  75% { transform: translateX(10px) rotate(10deg); }
}

.attack-particles {
  position: absolute;
  inset: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

.attack-particles .particle {
  position: absolute;
  font-size: 1.5rem;
  animation: particleBurst 0.5s ease-out forwards;
}

.particle:nth-child(1) { animation-delay: 0s; }
.particle:nth-child(2) { animation-delay: 0.1s; }
.particle:nth-child(3) { animation-delay: 0.2s; }
.particle:nth-child(4) { animation-delay: 0.3s; }
.particle:nth-child(5) { animation-delay: 0.4s; }

@keyframes particleBurst {
  0% { transform: translate(0, 0) scale(0); opacity: 1; }
  100% { transform: translate(var(--tx, 30px), var(--ty, -30px)) scale(1); opacity: 0; }
}

.particle:nth-child(1) { --tx: -40px; --ty: -20px; }
.particle:nth-child(2) { --tx: 40px; --ty: -20px; }
.particle:nth-child(3) { --tx: 0; --ty: -50px; }
.particle:nth-child(4) { --tx: -30px; --ty: 20px; }
.particle:nth-child(5) { --tx: 30px; --ty: 20px; }

.leek-name {
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--leek-green);
  margin-bottom: 0.25rem;
}

.leek-farmer {
  font-size: 0.85rem;
  color: var(--text-muted);
  margin-bottom: 0.75rem;
}

.leek-level {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.level-badge {
  background: var(--leek-dark);
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: bold;
}

.talent {
  font-size: 0.9rem;
  color: var(--gold);
}

.hero-title {
  margin-bottom: 1rem;
}

.title-pre {
  display: block;
  font-size: clamp(0.8rem, 2vw, 1rem);
  letter-spacing: 0.3em;
  color: var(--leek-green);
  margin-bottom: 0.5rem;
}

.title-main {
  display: block;
  font-size: clamp(2rem, 5vw, 3.5rem);
  font-weight: 700;
  line-height: 1.1;
  transition: all 0.3s;
}

.title-main.victory {
  color: var(--gold);
  text-shadow: 0 0 30px var(--gold);
}

.hero-quote {
  font-style: italic;
  color: var(--text-muted);
  font-size: 1.1rem;
}

.combat-record {
  display: flex;
  justify-content: center;
  gap: 3rem;
  margin-bottom: 2rem;
}

.record-stat {
  text-align: center;
}

.record-value {
  display: block;
  font-size: 2.5rem;
  font-weight: bold;
}

.record-stat.win .record-value { color: var(--leek-green); }
.record-stat.draw .record-value { color: var(--text-muted); }
.record-stat.loss .record-value { color: var(--red); }

.record-label {
  font-size: 0.8rem;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.hero-actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.battle-btn, .play-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 2rem;
  border: 2px solid var(--leek-green);
  border-radius: 8px;
  font-family: inherit;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s;
  text-decoration: none;
}

.battle-btn {
  background: var(--leek-green);
  color: #000;
}

.battle-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 0 30px var(--leek-green);
}

.play-btn {
  background: transparent;
  color: var(--leek-green);
}

.play-btn:hover {
  background: var(--leek-green);
  color: #000;
}

/* ========== SECTIONS ========== */
.leek-section {
  padding: 6rem 0;
  position: relative;
  z-index: 1;
}

.section-header {
  text-align: center;
  margin-bottom: 3rem;
}

.header-icon {
  font-size: 3rem;
  display: block;
  margin-bottom: 0.5rem;
}

.section-header h2 {
  font-size: clamp(1.5rem, 4vw, 2rem);
  color: var(--leek-green);
  letter-spacing: 0.1em;
  margin-bottom: 0.5rem;
}

.section-sub {
  color: var(--text-muted);
}

/* ========== STATS ========== */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: var(--bg-card);
  border: 1px solid var(--leek-dark);
  border-radius: 12px;
  padding: 1rem;
}

.stat-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.stat-icon {
  font-size: 1.2rem;
}

.stat-name {
  font-weight: 600;
  font-size: 0.9rem;
}

.stat-bar-container {
  margin-bottom: 0.5rem;
}

.stat-bar-bg {
  height: 8px;
  background: rgba(0,0,0,0.3);
  border-radius: 4px;
  overflow: hidden;
}

.stat-bar-fill {
  height: 100%;
  background: var(--stat-color);
  border-radius: 4px;
  transition: width 0.5s ease-out;
}

.stat-values {
  display: flex;
  justify-content: flex-end;
  gap: 0.25rem;
  font-size: 0.85rem;
}

.stat-current {
  color: var(--stat-color);
  font-weight: bold;
}

.stat-max {
  color: var(--text-muted);
}

.build-analysis {
  display: flex;
  justify-content: center;
}

.analysis-card {
  background: var(--bg-card);
  border: 1px solid var(--leek-dark);
  border-radius: 12px;
  padding: 1.5rem 2rem;
  max-width: 500px;
}

.analysis-card h3 {
  margin-bottom: 1rem;
  color: var(--leek-green);
}

.analysis-list {
  list-style: none;
}

.analysis-list li {
  padding: 0.5rem 0;
  border-bottom: 1px solid rgba(255,255,255,0.05);
}

.analysis-list li:last-child {
  border-bottom: none;
}

.highlight {
  font-weight: bold;
  padding: 0.1rem 0.4rem;
  border-radius: 4px;
}

.highlight.green { background: rgba(123, 192, 67, 0.2); color: var(--leek-green); }
.highlight.red { background: rgba(231, 76, 60, 0.2); color: #e74c3c; }
.highlight.blue { background: rgba(52, 152, 219, 0.2); color: #3498db; }
.highlight.yellow { background: rgba(241, 196, 15, 0.2); color: #f1c40f; }

/* ========== EQUIPMENT ========== */
.equipment-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.equipment-category {
  background: var(--bg-card);
  border: 1px solid var(--leek-dark);
  border-radius: 12px;
  padding: 1.5rem;
}

.category-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  font-size: 1.1rem;
}

.count {
  font-size: 0.85rem;
  color: var(--text-muted);
}

.items-grid {
  display: grid;
  gap: 0.75rem;
}

.items-grid.chips {
  grid-template-columns: repeat(2, 1fr);
}

.item-card {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: rgba(0,0,0,0.2);
  border-radius: 8px;
  padding: 0.75rem;
  border: 1px solid transparent;
  transition: all 0.2s;
}

.item-card:hover {
  border-color: var(--leek-green);
  background: rgba(123, 192, 67, 0.1);
}

.item-icon {
  font-size: 1.5rem;
}

.item-name {
  display: block;
  font-weight: 600;
  font-size: 0.9rem;
}

.item-stats, .item-cost {
  font-size: 0.75rem;
  color: var(--text-muted);
}

.chip.heal { border-left: 3px solid #2ecc71; }
.chip.damage { border-left: 3px solid #e74c3c; }
.chip.shield { border-left: 3px solid #3498db; }
.chip.control { border-left: 3px solid #9b59b6; }

/* ========== CODE EDITOR ========== */
.code-editor {
  background: #0d0d0d;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #333;
  margin-bottom: 2rem;
}

.editor-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 1rem;
  background: #1a1a1a;
  border-bottom: 1px solid #333;
}

.editor-dots {
  display: flex;
  gap: 0.5rem;
}

.dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.dot--red { background: #ff5f56; }
.dot--yellow { background: #ffbd2e; }
.dot--green { background: #27ca40; }

.editor-title {
  flex: 1;
  font-size: 0.85rem;
  color: var(--text-muted);
}

.editor-actions {
  display: flex;
  gap: 0.5rem;
}

.copy-btn {
  background: var(--leek-dark);
  border: none;
  color: var(--text);
  padding: 0.4rem 0.8rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.8rem;
  transition: all 0.2s;
}

.copy-btn:hover {
  background: var(--leek-green);
  color: #000;
}

.editor-content {
  padding: 1.5rem;
  overflow-x: auto;
}

.code-block {
  font-family: 'Fira Code', monospace;
  font-size: 0.85rem;
  line-height: 1.6;
  margin: 0;
}

.code-keyword { color: #ff79c6; }
.code-func { color: #50fa7b; }
.code-num { color: #bd93f9; }
.code-null { color: #8be9fd; }
.code-comment { color: #6272a4; }

.editor-footer {
  display: flex;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  background: #1a1a1a;
  border-top: 1px solid #333;
  font-size: 0.8rem;
}

.status.success { color: var(--leek-green); }
.ops { color: var(--text-muted); }

.version-history {
  background: var(--bg-card);
  border-radius: 12px;
  padding: 1.5rem;
}

.version-history h3 {
  margin-bottom: 1rem;
  color: var(--leek-green);
}

.versions {
  display: grid;
  gap: 0.75rem;
}

.version {
  display: grid;
  grid-template-columns: 120px 100px 1fr;
  gap: 1rem;
  align-items: center;
  padding: 0.75rem;
  background: rgba(0,0,0,0.2);
  border-radius: 8px;
}

.version-name {
  font-weight: bold;
}

.version-status {
  font-size: 0.8rem;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
}

.version-status.success { background: rgba(46, 204, 113, 0.2); color: #2ecc71; }
.version-status.warning { background: rgba(241, 196, 15, 0.2); color: #f1c40f; }
.version-status.error { background: rgba(231, 76, 60, 0.2); color: #e74c3c; }

.version-desc {
  color: var(--text-muted);
  font-size: 0.85rem;
}

/* ========== NODE EDITOR ========== */
.node-preview {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
  background: var(--bg-card);
  border-radius: 12px;
  overflow: hidden;
}

.node-canvas {
  position: relative;
  min-height: 300px;
  background: #0d1a0d;
  background-image: 
    linear-gradient(rgba(123, 192, 67, 0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(123, 192, 67, 0.05) 1px, transparent 1px);
  background-size: 20px 20px;
}

.node-connections {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.node {
  position: absolute;
  background: #1a2e1a;
  border: 2px solid var(--leek-dark);
  border-radius: 8px;
  min-width: 140px;
}

.node-header {
  padding: 0.5rem 0.75rem;
  font-size: 0.8rem;
  font-weight: bold;
  border-radius: 6px 6px 0 0;
}

.node-start .node-header { background: linear-gradient(135deg, #3a1a4a, #1a2e1a); }
.node-target .node-header { background: linear-gradient(135deg, #4a2a1a, #1a2e1a); }
.node-condition .node-header { background: linear-gradient(135deg, #4a3a1a, #1a2e1a); }
.node-action .node-header { background: linear-gradient(135deg, #4a1a1a, #1a2e1a); }

.node-port {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: 2px solid;
  position: absolute;
}

.port-out { right: -6px; top: 50%; transform: translateY(-50%); border-color: #a855f7; background: #a855f7; }
.port-out.target { border-color: #ff9f43; background: #ff9f43; }
.port-out.bool { border-color: #ffd93d; background: #ffd93d; }

.node-ports {
  padding: 0.5rem;
}

.port-in { left: -6px; border-color: #a855f7; background: transparent; }
.port-in.target { border-color: #ff9f43; }

.node-info {
  padding: 1.5rem;
}

.node-info h3 {
  margin-bottom: 0.75rem;
  color: var(--leek-green);
}

.node-info p {
  color: var(--text-muted);
  margin-bottom: 1rem;
  font-size: 0.9rem;
}

.node-features {
  list-style: none;
  margin-bottom: 1.5rem;
}

.node-features li {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.4rem 0;
}

.node-type {
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
}

.node-type.flow { background: rgba(168, 85, 247, 0.2); }
.node-type.target { background: rgba(255, 159, 67, 0.2); }
.node-type.condition { background: rgba(255, 217, 61, 0.2); }
.node-type.action { background: rgba(255, 107, 107, 0.2); }

.try-editor-btn {
  display: inline-block;
  background: var(--leek-green);
  color: #000;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  text-decoration: none;
  font-weight: bold;
  transition: all 0.3s;
}

.try-editor-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 0 20px var(--leek-green);
}

/* ========== COMBAT LOG ========== */
.combat-result {
  background: var(--bg-card);
  border-radius: 12px;
  padding: 2rem;
  max-width: 700px;
  margin: 0 auto;
}

.combat-result.victory {
  border: 2px solid var(--leek-green);
}

.result-header {
  text-align: center;
  margin-bottom: 1.5rem;
}

.result-icon {
  font-size: 3rem;
  display: block;
  margin-bottom: 0.5rem;
}

.result-text {
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--leek-green);
  letter-spacing: 0.2em;
}

.combatants {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2rem;
  margin-bottom: 2rem;
}

.combatant {
  text-align: center;
}

.combatant-emoji {
  font-size: 2.5rem;
  display: block;
  margin-bottom: 0.5rem;
}

.combatant-name {
  display: block;
  font-weight: bold;
  margin-bottom: 0.25rem;
}

.combatant.winner .combatant-name { color: var(--leek-green); }
.combatant.loser .combatant-name { color: var(--red); }

.combatant-level {
  font-size: 0.8rem;
  color: var(--text-muted);
}

.vs {
  font-size: 1.2rem;
  font-weight: bold;
  color: var(--text-muted);
}

.combat-stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.combat-stat {
  background: rgba(0,0,0,0.2);
  padding: 1rem;
  border-radius: 8px;
  text-align: center;
}

.stat-label {
  display: block;
  font-size: 0.8rem;
  color: var(--text-muted);
  margin-bottom: 0.5rem;
}

.stat-comparison {
  display: flex;
  justify-content: center;
  gap: 2rem;
}

.stat-value {
  font-size: 1.2rem;
  font-weight: bold;
}

.stat-value.win { color: var(--leek-green); }
.stat-value.lose { color: var(--red); }

.combat-highlight {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: rgba(241, 196, 15, 0.1);
  border: 1px solid rgba(241, 196, 15, 0.3);
  padding: 1rem;
  border-radius: 8px;
}

.highlight-icon {
  font-size: 1.5rem;
}

.highlight-text {
  font-size: 0.9rem;
}

/* ========== GAME MODES ========== */
.modes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.5rem;
}

.mode-card {
  background: var(--bg-card);
  border: 1px solid var(--leek-dark);
  border-radius: 12px;
  padding: 1.5rem;
  text-align: center;
  transition: all 0.3s;
}

.mode-card:hover {
  border-color: var(--leek-green);
  transform: translateY(-5px);
}

.mode-icon {
  font-size: 2.5rem;
  display: block;
  margin-bottom: 0.75rem;
}

.mode-name {
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
}

.mode-desc {
  font-size: 0.85rem;
  color: var(--text-muted);
  margin-bottom: 0.75rem;
}

.mode-players {
  display: inline-block;
  background: var(--leek-dark);
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: bold;
}

/* ========== LADDER ========== */
.ladder-tabs {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.tab-btn {
  background: var(--bg-card);
  border: 1px solid var(--leek-dark);
  color: var(--text);
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-family: inherit;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;
}

.tab-btn:hover {
  border-color: var(--leek-green);
}

.tab-btn.active {
  background: var(--leek-green);
  border-color: var(--leek-green);
  color: #000;
}

.ladder-table {
  background: var(--bg-card);
  border-radius: 12px;
  overflow: hidden;
  max-width: 700px;
  margin: 0 auto;
}

.ladder-header {
  display: grid;
  grid-template-columns: 60px 1fr 100px 80px;
  padding: 1rem;
  background: rgba(0,0,0,0.3);
  font-weight: bold;
  font-size: 0.85rem;
  color: var(--text-muted);
}

.ladder-row {
  display: grid;
  grid-template-columns: 60px 1fr 100px 80px;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid rgba(255,255,255,0.05);
  align-items: center;
}

.ladder-row:last-child {
  border-bottom: none;
}

.ladder-row.highlight {
  background: rgba(123, 192, 67, 0.1);
  border-left: 3px solid var(--leek-green);
}

.col-rank {
  font-weight: bold;
  color: var(--gold);
}

.col-name {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.entry-emoji {
  font-size: 1.2rem;
}

.col-talent {
  color: var(--leek-green);
  font-weight: bold;
}

/* ========== LEGENDS ========== */
.legends-section {
  background: linear-gradient(180deg, transparent, rgba(255, 215, 0, 0.05));
}

.legends-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
}

.legend-card {
  background: var(--bg-card);
  border-radius: 16px;
  padding: 1.5rem;
  position: relative;
  overflow: hidden;
}

.legend-card.legendary {
  border: 2px solid var(--gold);
  box-shadow: 0 0 30px rgba(255, 215, 0, 0.2);
}

.legend-card.legendary::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, transparent, var(--gold), transparent);
}

.legend-card.apprentice {
  border: 2px solid var(--leek-dark);
}

.legend-header {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.legend-avatar {
  position: relative;
  font-size: 3rem;
}

.legend-crown {
  position: absolute;
  top: -10px;
  right: -5px;
  font-size: 1.2rem;
  animation: crownFloat 2s ease-in-out infinite;
}

.legend-badge {
  position: absolute;
  bottom: -5px;
  right: -5px;
  font-size: 1rem;
}

@keyframes crownFloat {
  0%, 100% { transform: translateY(0) rotate(-5deg); }
  50% { transform: translateY(-3px) rotate(5deg); }
}

.legend-title {
  flex: 1;
}

.legend-name {
  font-size: 1.3rem;
  margin-bottom: 0.25rem;
}

.legendary .legend-name {
  color: var(--gold);
}

.apprentice .legend-name {
  color: var(--leek-green);
}

.legend-quote {
  font-style: italic;
  color: var(--text-muted);
  font-size: 0.85rem;
  margin-bottom: 0.25rem;
}

.legend-farmer {
  font-size: 0.8rem;
  color: var(--text-muted);
}

.legend-stats-row {
  display: flex;
  justify-content: center;
  gap: 3rem;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: rgba(0,0,0,0.2);
  border-radius: 8px;
}

.legend-level, .legend-talent {
  text-align: center;
}

.level-number, .talent-number {
  display: block;
  font-size: 2rem;
  font-weight: bold;
}

.legendary .level-number {
  color: var(--gold);
}

.legendary .talent-number {
  color: #ff6b6b;
}

.apprentice .level-number {
  color: var(--leek-green);
}

.apprentice .talent-number {
  color: var(--leek-light);
}

.level-label, .talent-label {
  font-size: 0.75rem;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.legend-record {
  display: flex;
  justify-content: space-around;
  margin-bottom: 1.5rem;
}

.record-item {
  text-align: center;
}

.record-item .record-value {
  display: block;
  font-size: 1.3rem;
  font-weight: bold;
}

.record-item.win .record-value { color: var(--leek-green); }
.record-item.draw .record-value { color: var(--text-muted); }
.record-item.loss .record-value { color: var(--red); }

.record-item .record-label {
  font-size: 0.7rem;
  color: var(--text-muted);
  text-transform: uppercase;
}

.legend-build {
  margin-bottom: 1rem;
  padding: 1rem;
  background: rgba(0,0,0,0.2);
  border-radius: 8px;
}

.legend-build h4 {
  font-size: 0.9rem;
  margin-bottom: 0.75rem;
  color: var(--leek-green);
}

.build-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.5rem;
}

.build-stat {
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

.build-stat .stat-icon {
  font-size: 0.9rem;
}

.legend-equipment {
  border-top: 1px solid rgba(255,255,255,0.1);
  padding-top: 1rem;
}

.equip-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.4rem 0;
  font-size: 0.8rem;
}

.equip-label {
  color: var(--text-muted);
}

.equip-items {
  color: var(--leek-light);
}

.legend-progress {
  margin-top: 1rem;
}

.progress-bar {
  height: 8px;
  background: rgba(0,0,0,0.3);
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--leek-dark), var(--leek-green));
  border-radius: 4px;
  transition: width 0.5s;
}

.progress-text {
  font-size: 0.75rem;
  color: var(--text-muted);
  text-align: center;
  display: block;
}

/* ========== GAME PROMO ========== */
.game-promo-section {
  background: linear-gradient(135deg, rgba(155, 89, 182, 0.1), rgba(0, 206, 209, 0.1));
}

.promo-card {
  background: linear-gradient(135deg, #1a1a3a, #0a1a2a);
  border: 2px solid #9b59b6;
  border-radius: 20px;
  padding: 3rem;
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.promo-card::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(155, 89, 182, 0.1) 0%, transparent 70%);
  animation: rotateBg 20s linear infinite;
}

@keyframes rotateBg {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.promo-header {
  position: relative;
  z-index: 1;
  margin-bottom: 2rem;
}

.promo-badge {
  display: inline-block;
  background: linear-gradient(90deg, #e74c3c, #9b59b6);
  color: white;
  padding: 0.25rem 1rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: bold;
  letter-spacing: 0.1em;
  margin-bottom: 1rem;
  animation: pulseBadge 2s ease-in-out infinite;
}

@keyframes pulseBadge {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

.promo-header h2 {
  font-size: clamp(1.8rem, 5vw, 2.5rem);
  background: linear-gradient(90deg, #00CED1, #9b59b6, #e74c3c);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 0.5rem;
}

.promo-tagline {
  color: var(--text-muted);
  font-style: italic;
  font-size: 1.1rem;
}

.promo-features {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;
  position: relative;
  z-index: 1;
}

.promo-feature {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255,255,255,0.05);
  padding: 0.75rem 1rem;
  border-radius: 8px;
  font-size: 0.85rem;
  transition: all 0.3s;
}

.promo-feature:hover {
  background: rgba(155, 89, 182, 0.2);
  transform: translateY(-2px);
}

.feature-icon {
  font-size: 1.2rem;
}

.promo-warning {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: rgba(231, 76, 60, 0.1);
  border: 1px solid rgba(231, 76, 60, 0.3);
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 2rem;
  position: relative;
  z-index: 1;
}

.warning-icon {
  font-size: 2rem;
  animation: eyeBlink 3s ease-in-out infinite;
}

@keyframes eyeBlink {
  0%, 45%, 55%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

.promo-warning p {
  font-size: 0.85rem;
  color: #e74c3c;
  text-align: left;
  margin: 0;
}

.play-game-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  background: linear-gradient(90deg, #9b59b6, #00CED1);
  color: white;
  padding: 1rem 2.5rem;
  border-radius: 30px;
  text-decoration: none;
  font-weight: bold;
  font-size: 1.1rem;
  position: relative;
  z-index: 1;
  transition: all 0.3s;
  overflow: hidden;
}

.play-game-btn::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, #00CED1, #9b59b6);
  opacity: 0;
  transition: opacity 0.3s;
}

.play-game-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 0 40px rgba(155, 89, 182, 0.5);
}

.play-game-btn:hover::before {
  opacity: 1;
}

.play-game-btn .btn-icon,
.play-game-btn .btn-text {
  position: relative;
  z-index: 1;
}

/* ========== CTA ========== */
.cta-section {
  background: linear-gradient(135deg, rgba(62, 137, 20, 0.2), rgba(123, 192, 67, 0.1));
  text-align: center;
}

.cta-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.cta-section h2 {
  font-size: clamp(1.5rem, 4vw, 2rem);
  color: var(--leek-green);
  margin-bottom: 1rem;
}

.cta-section > .container > p {
  color: var(--text-muted);
  margin-bottom: 2rem;
  font-size: 1.1rem;
}

.cta-buttons {
  display: flex;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 1.5rem;
}

.cta-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  border-radius: 8px;
  text-decoration: none;
  font-weight: bold;
  transition: all 0.3s;
}

.cta-btn.primary {
  background: var(--leek-green);
  color: #000;
}

.cta-btn.primary:hover {
  transform: scale(1.05);
  box-shadow: 0 0 30px var(--leek-green);
}

.cta-btn.secondary {
  background: transparent;
  border: 2px solid var(--leek-green);
  color: var(--leek-green);
}

.cta-btn.secondary:hover {
  background: var(--leek-green);
  color: #000;
}

.cta-note {
  font-size: 0.85rem;
  color: var(--text-muted);
}

/* ========== FOOTER ========== */
.leek-footer {
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
}

.back-link, .gallery-link {
  color: var(--leek-green);
  text-decoration: none;
  transition: opacity 0.3s;
}

.back-link:hover, .gallery-link:hover {
  opacity: 0.7;
}

.footer-credit {
  color: var(--text-muted);
  font-size: 0.85rem;
}

.footer-credit a {
  color: var(--leek-green);
  text-decoration: none;
}

/* ========== RESPONSIVE ========== */
@media (max-width: 768px) {
  .hero-content {
    flex-direction: column;
    text-align: center;
  }
  
  .combat-record {
    gap: 1.5rem;
  }
  
  .node-preview {
    grid-template-columns: 1fr;
  }
  
  .node-canvas {
    min-height: 200px;
  }
  
  .version {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }
  
  .items-grid.chips {
    grid-template-columns: 1fr;
  }
  
  .legends-grid {
    grid-template-columns: 1fr;
  }
  
  .legend-stats-row {
    gap: 1.5rem;
  }
  
  .build-stats {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .promo-features {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .promo-card {
    padding: 1.5rem;
  }
  
  .footer-content {
    flex-direction: column;
    text-align: center;
  }
}
</style>
