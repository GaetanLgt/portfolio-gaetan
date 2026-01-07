<template>
  <div class="hex-world">
    <!-- HERO -->
    <section class="hero">
      <div class="hero-content">
        <span class="hero-badge">🎮 Générateur NFT</span>
        <h1>⬡ HEXGEN</h1>
        <p class="hero-subtitle">Créez des MON uniques avec le système de génération hexagonal</p>
        <div class="hero-stats">
          <div class="stat"><span class="stat-value">6</span><span class="stat-label">Systèmes</span></div>
          <div class="stat"><span class="stat-value">∞</span><span class="stat-label">Combinaisons</span></div>
          <div class="stat"><span class="stat-value">{{ savedMons.length }}</span><span class="stat-label">MON créés</span></div>
        </div>
        <button class="btn-start" @click="showGenerator = true; activeTab = 'create'">
          🎲 Générer un MON
        </button>
        <div class="hero-extra-btns" v-if="savedMons.length >= 2">
          <button class="btn-arena" @click="showGenerator = true; activeTab = 'arena'">⚔️ Arène</button>
          <button class="btn-arena" @click="showGenerator = true; activeTab = 'leaderboard'">🏆 Classement</button>
        </div>
      </div>
    </section>

    <!-- GENERATOR -->
    <section class="generator-section" v-if="showGenerator">
      <!-- TABS -->
      <div class="tabs-bar">
        <button class="tab-btn" :class="{ active: activeTab === 'create' }" @click="activeTab = 'create'">🎲 Créer</button>
        <button class="tab-btn" :class="{ active: activeTab === 'fusion' }" @click="activeTab = 'fusion'" :disabled="savedMons.length < 2">🧬 Fusion</button>
        <button class="tab-btn" :class="{ active: activeTab === 'collection' }" @click="activeTab = 'collection'">📚 Collection</button>
        <button class="tab-btn" :class="{ active: activeTab === 'arena' }" @click="activeTab = 'arena'" :disabled="savedMons.length < 2">⚔️ Arène</button>
        <button class="tab-btn" :class="{ active: activeTab === 'history' }" @click="activeTab = 'history'">📜 Historique</button>
        <button class="tab-btn" :class="{ active: activeTab === 'achievements' }" @click="activeTab = 'achievements'">🏅 Succès</button>
        <button class="tab-btn" :class="{ active: activeTab === 'leaderboard' }" @click="activeTab = 'leaderboard'">🏆 Classement</button>
      </div>

      <!-- TAB: CREATE -->
      <div class="tab-content" v-if="activeTab === 'create'">
      <div class="generator-container">
        <!-- LEFT: Controls -->
        <div class="controls-panel">
          <h2>⚙️ Paramètres</h2>
          
          <!-- ELEMENT -->
          <div class="param-group">
            <h3>🔥 Élément <span class="element-result">{{ elementType }}</span></h3>
            <p class="param-desc">Dualités : Solaire-Lunaire, Ciel-Terre, Feu-Eau</p>
            <div class="triple-slider">
              <label>
                <span>☀️ Solaire/Lunaire</span>
                <input type="range" v-model.number="params.element.x" min="-10" max="10" step="1">
                <span class="value">{{ params.element.x }}</span>
              </label>
              <label>
                <span>🌤️ Ciel/Terre</span>
                <input type="range" v-model.number="params.element.y" min="-10" max="10" step="1">
                <span class="value">{{ params.element.y }}</span>
              </label>
              <label>
                <span>🔥 Feu/Eau</span>
                <input type="range" v-model.number="params.element.z" min="-10" max="10" step="1">
                <span class="value">{{ params.element.z }}</span>
              </label>
            </div>
          </div>

          <!-- RACE -->
          <div class="param-group">
            <h3>🧬 Race <span class="race-result">{{ raceType }}</span></h3>
            <p class="param-desc">Magnitudes normalisées (somme = 1)</p>
            <div class="triple-slider">
              <label>
                <span>Physique/Éthéré</span>
                <input type="range" v-model.number="params.race.x" min="-1" max="1" step="0.1">
                <span class="value">{{ params.race.x.toFixed(1) }}</span>
              </label>
              <label>
                <span>Organique/Mécanique</span>
                <input type="range" v-model.number="params.race.y" min="-1" max="1" step="0.1">
                <span class="value">{{ params.race.y.toFixed(1) }}</span>
              </label>
              <label>
                <span>Naturel/Artificiel</span>
                <input type="range" v-model.number="params.race.z" min="-1" max="1" step="0.1">
                <span class="value">{{ params.race.z.toFixed(1) }}</span>
              </label>
            </div>
          </div>

          <!-- CLASS -->
          <div class="param-group">
            <h3>⚔️ Classe <span class="class-result">{{ classType }}</span></h3>
            <p class="param-desc">Tank-DPS, Healer-Burst, Melee-Ranged</p>
            <div class="triple-slider">
              <label>
                <span>🛡️ Tank/DPS</span>
                <input type="range" v-model.number="params.class.x" min="-10" max="10" step="1">
                <span class="value">{{ params.class.x }}</span>
              </label>
              <label>
                <span>💚 Healer/Burst</span>
                <input type="range" v-model.number="params.class.y" min="-10" max="10" step="1">
                <span class="value">{{ params.class.y }}</span>
              </label>
              <label>
                <span>🗡️ Melee/Ranged</span>
                <input type="range" v-model.number="params.class.z" min="-10" max="10" step="1">
                <span class="value">{{ params.class.z }}</span>
              </label>
            </div>
          </div>

          <!-- SOMA -->
          <div class="param-group">
            <h3>💪 Soma (Stats)</h3>
            <div class="stats-grid">
              <label v-for="(stat, key) in somaLabels" :key="key">
                <span>{{ stat.icon }} {{ stat.name }}</span>
                <input type="range" v-model.number="params.soma[key]" min="1" max="10" step="1">
                <span class="value">{{ params.soma[key] }}</span>
              </label>
            </div>
          </div>

          <!-- EGO -->
          <div class="param-group">
            <h3>🧠 Ego (Attributs)</h3>
            <div class="stats-grid">
              <label v-for="(stat, key) in egoLabels" :key="key">
                <span>{{ stat.icon }} {{ stat.name }}</span>
                <input type="range" v-model.number="params.ego[key]" min="1" max="10" step="1">
                <span class="value">{{ params.ego[key] }}</span>
              </label>
            </div>
          </div>

          <!-- AGE -->
          <div class="param-group">
            <h3>📅 Âge</h3>
            <div class="age-selector">
              <button v-for="age in ages" :key="age.value" 
                      :class="{ active: params.age === age.value }"
                      @click="params.age = age.value">
                {{ age.icon }} {{ age.name }}
              </button>
            </div>
          </div>

          <div class="action-buttons">
            <button class="btn-random" @click="randomize">🎲 Aléatoire</button>
            <button class="btn-save" @click="saveMon" :disabled="!canSave">💾 Sauvegarder</button>
          </div>
        </div>

        <!-- RIGHT: Preview -->
        <div class="preview-panel">
          <div class="hex-preview">
            <svg viewBox="0 0 200 200" class="hex-svg">
              <!-- Hexagon background -->
              <polygon :points="hexPoints" class="hex-bg" :style="{ fill: elementGradient }"/>
              <!-- Inner hexagons for stats -->
              <polygon :points="innerHexPoints(0.8)" class="hex-inner" />
              <polygon :points="innerHexPoints(0.6)" class="hex-inner" />
              <polygon :points="innerHexPoints(0.4)" class="hex-inner" />
              <!-- Stat lines -->
              <line v-for="(line, i) in statLines" :key="i" 
                    :x1="line.x1" :y1="line.y1" :x2="line.x2" :y2="line.y2" 
                    class="stat-line"/>
              <!-- Stat polygon -->
              <polygon :points="statPolygonPoints" class="stat-polygon"/>
              <!-- Center icon -->
              <text x="100" y="108" text-anchor="middle" class="center-icon">{{ monEmoji }}</text>
            </svg>
          </div>

          <div class="mon-card">
            <div class="card-header">
              <span class="mon-emoji">{{ monEmoji }}</span>
              <div class="mon-identity">
                <h3>{{ monName }}</h3>
                <span class="mon-type">{{ elementType }} {{ raceType }} {{ classType }}</span>
              </div>
              <span class="mon-rarity" :class="rarityClass">{{ rarity }}</span>
            </div>

            <div class="card-stats">
              <div class="stat-bar" v-for="(stat, key) in somaLabels" :key="key">
                <span class="stat-label">{{ stat.icon }} {{ stat.name }}</span>
                <div class="bar-container">
                  <div class="bar-fill" :style="{ width: params.soma[key] * 10 + '%', background: stat.color }"></div>
                </div>
                <span class="stat-value">{{ params.soma[key] }}</span>
              </div>
            </div>

            <div class="card-attributes">
              <span v-for="(stat, key) in egoLabels" :key="key" class="attribute-tag">
                {{ stat.icon }} {{ stat.name }}: {{ params.ego[key] }}
              </span>
            </div>

            <div class="card-footer">
              <span class="age-badge">{{ currentAge.icon }} {{ currentAge.name }}</span>
              <span class="power-score">⚡ {{ powerScore }}</span>
            </div>
          </div>

          <div class="hex-formula">
            <code>H = {{ hexFormula }}</code>
            <button class="btn-copy" @click="copyFormula" title="Copier">📋</button>
          </div>
          
          <div class="export-actions">
            <button class="btn-export" @click="exportAsJson">📄 Export JSON</button>
            <button class="btn-export" @click="shareUrl">🔗 Partager</button>
          </div>
        </div>
      </div>
      </div>

      <!-- TAB: COLLECTION -->
      <div class="tab-content" v-if="activeTab === 'collection'">
        <div class="collection-header">
          <h2>📚 Ma Collection ({{ savedMons.length }})</h2>
          <div class="collection-filters">
            <select v-model="sortBy">
              <option value="date">📅 Date</option>
              <option value="power">⚡ Puissance</option>
              <option value="wins">🏆 Victoires</option>
            </select>
          </div>
        </div>
        <div class="collection-grid" v-if="sortedMons.length > 0">
          <div v-for="(mon, index) in sortedMons" :key="mon.id" class="mini-card" :class="mon.rarity?.toLowerCase().replace(' ', '-')" @click="loadMon(mon)">
            <div class="mini-stats-badge">
              <span class="wins">🏆 {{ mon.wins || 0 }}</span>
              <span class="losses">💩 {{ mon.losses || 0 }}</span>
            </div>
            <span class="mini-emoji">{{ mon.emoji }}</span>
            <span class="mini-name">{{ mon.name }}</span>
            <span class="mini-type">{{ mon.type }}</span>
            <span class="mini-power">⚡ {{ mon.power }}</span>
            <div class="mini-actions">
              <button class="select-fighter-btn" @click.stop="selectFighter(mon, 1)" title="Combattant 1">🥊</button>
              <button class="select-fighter-btn" @click.stop="selectFighter(mon, 2)" title="Combattant 2">🥋</button>
              <button class="delete-btn" @click.stop="deleteMon(savedMons.indexOf(mon))">✕</button>
            </div>
          </div>
        </div>
        <div class="empty-state" v-else>
          <span>📦</span>
          <p>Aucun MON dans votre collection</p>
          <button class="btn-start" @click="activeTab = 'create'">Créer mon premier MON</button>
        </div>
      </div>

      <!-- TAB: ARENA -->
      <div class="tab-content" v-if="activeTab === 'arena'">
        <div class="arena-container">
          <h2>⚔️ Arène de Combat</h2>
          <p class="arena-desc">Sélectionnez deux MON et lancez le combat !</p>
          
          <div class="battle-setup">
            <!-- Fighter 1 -->
            <div class="fighter-slot" :class="{ selected: fighter1, winner: battleWinner?.id === fighter1?.id }" @click="openFighterModal(1)">
              <template v-if="fighter1">
                <span class="fighter-emoji">{{ fighter1.emoji }}</span>
                <span class="fighter-name">{{ fighter1.name }}</span>
                <span class="fighter-power">⚡ {{ fighter1.power }}</span>
                <div class="fighter-hp" v-if="battleStarted">
                  <div class="hp-bar">
                    <div class="hp-fill" :style="{ width: (fighter1.currentHp / fighter1.maxHp * 100) + '%' }"></div>
                  </div>
                  <span>{{ fighter1.currentHp }} / {{ fighter1.maxHp }} HP</span>
                </div>
              </template>
              <template v-else>
                <span class="empty-slot">👆</span>
                <span>Choisir MON 1</span>
              </template>
            </div>

            <div class="vs-badge" :class="{ fighting: battleInProgress }">
              <span>VS</span>
            </div>

            <!-- Fighter 2 -->
            <div class="fighter-slot" :class="{ selected: fighter2, winner: battleWinner?.id === fighter2?.id }" @click="openFighterModal(2)">
              <template v-if="fighter2">
                <span class="fighter-emoji">{{ fighter2.emoji }}</span>
                <span class="fighter-name">{{ fighter2.name }}</span>
                <span class="fighter-power">⚡ {{ fighter2.power }}</span>
                <div class="fighter-hp" v-if="battleStarted">
                  <div class="hp-bar">
                    <div class="hp-fill" :style="{ width: (fighter2.currentHp / fighter2.maxHp * 100) + '%' }"></div>
                  </div>
                  <span>{{ fighter2.currentHp }} / {{ fighter2.maxHp }} HP</span>
                </div>
              </template>
              <template v-else>
                <span class="empty-slot">👆</span>
                <span>Choisir MON 2</span>
              </template>
            </div>
          </div>

          <div class="battle-actions">
            <button class="btn-fight" @click="startBattle" :disabled="!fighter1 || !fighter2 || battleInProgress">
              {{ battleInProgress ? '⏳ Combat en cours...' : '⚔️ COMBAT !' }}
            </button>
            <button class="btn-reset" @click="resetBattle" v-if="battleStarted">🔄 Reset</button>
          </div>

          <!-- Battle Log -->
          <div class="battle-log" v-if="battleLog.length > 0">
            <h3>📜 Journal de Combat</h3>
            <div class="log-entries" ref="logContainer">
              <div v-for="(entry, i) in battleLog" :key="i" class="log-entry" :class="entry.type">
                <span class="log-icon">{{ entry.icon }}</span>
                <span class="log-text">{{ entry.text }}</span>
                <span class="log-damage" v-if="entry.damage">-{{ entry.damage }} HP</span>
              </div>
            </div>
          </div>

          <!-- Winner Announcement -->
          <div class="winner-panel" v-if="battleWinner">
            <div class="winner-trophy">🏆</div>
            <h3>{{ battleWinner.name }} remporte le combat !</h3>
            <p>HP restants : {{ battleWinner.currentHp }} / {{ battleWinner.maxHp }}</p>
            <div class="winner-rewards">
              <span>🏅 +1 Victoire</span>
              <span>⚡ +{{ Math.floor(battleWinner.power * 0.1) }} XP</span>
            </div>
          </div>
        </div>

        <!-- Fighter Selection Modal -->
        <div class="modal-overlay" v-if="showFighterModal" @click.self="showFighterModal = false">
          <div class="modal fighter-modal">
            <h3>Choisir Combattant {{ selectingSlot }}</h3>
            <div class="fighter-grid">
              <div v-for="mon in savedMons" :key="mon.id" 
                   class="fighter-option" 
                   :class="{ selected: isSelected(mon), disabled: isDisabled(mon) }"
                   @click="confirmFighter(mon)">
                <span class="fo-emoji">{{ mon.emoji }}</span>
                <span class="fo-name">{{ mon.name }}</span>
                <span class="fo-power">⚡ {{ mon.power }}</span>
                <span class="fo-record">🏆 {{ mon.wins || 0 }} - {{ mon.losses || 0 }} 💩</span>
              </div>
            </div>
            <button class="btn-close-modal" @click="showFighterModal = false">✕ Fermer</button>
          </div>
        </div>
      </div>

      <!-- TAB: LEADERBOARD -->
      <div class="tab-content" v-if="activeTab === 'leaderboard'">
        <div class="leaderboard-container">
          <h2>🏆 Classement</h2>
          
          <div class="leaderboard-tabs">
            <button :class="{ active: leaderboardSort === 'wins' }" @click="leaderboardSort = 'wins'">🏅 Victoires</button>
            <button :class="{ active: leaderboardSort === 'power' }" @click="leaderboardSort = 'power'">⚡ Puissance</button>
            <button :class="{ active: leaderboardSort === 'ratio' }" @click="leaderboardSort = 'ratio'">📊 Ratio</button>
          </div>

          <div class="leaderboard-list" v-if="leaderboardMons.length > 0">
            <div v-for="(mon, index) in leaderboardMons" :key="mon.id" class="leaderboard-item" :class="{ top3: index < 3 }">
              <span class="rank">
                <template v-if="index === 0">🥇</template>
                <template v-else-if="index === 1">🥈</template>
                <template v-else-if="index === 2">🥉</template>
                <template v-else>#{{ index + 1 }}</template>
              </span>
              <span class="lb-emoji">{{ mon.emoji }}</span>
              <div class="lb-info">
                <span class="lb-name">{{ mon.name }}</span>
                <span class="lb-type">{{ mon.type }}</span>
              </div>
              <div class="lb-stats">
                <span class="lb-wins">🏆 {{ mon.wins || 0 }}</span>
                <span class="lb-losses">💩 {{ mon.losses || 0 }}</span>
                <span class="lb-ratio">{{ getWinRatio(mon) }}%</span>
              </div>
              <span class="lb-power">⚡ {{ mon.power }}</span>
            </div>
          </div>
          
          <div class="empty-state" v-else>
            <span>🏆</span>
            <p>Créez des MON et faites-les combattre !</p>
          </div>
        </div>
      </div>

      <!-- TAB: FUSION -->
      <div class="tab-content" v-if="activeTab === 'fusion'">
        <div class="fusion-container">
          <h2>🧬 Laboratoire de Fusion</h2>
          <p class="fusion-desc">Combinez deux MON pour créer une nouvelle créature avec des attributs mélangés !</p>
          
          <div class="fusion-setup">
            <!-- Parent 1 -->
            <div class="fusion-slot" :class="{ selected: fusionParent1 }" @click="openFusionModal(1)">
              <template v-if="fusionParent1">
                <span class="fusion-emoji">{{ fusionParent1.emoji }}</span>
                <span class="fusion-name">{{ fusionParent1.name }}</span>
                <span class="fusion-power">⚡ {{ fusionParent1.power }}</span>
              </template>
              <template v-else>
                <span class="empty-slot">👆</span>
                <span>Parent 1</span>
              </template>
            </div>

            <div class="fusion-icon">
              <span>➕</span>
            </div>

            <!-- Parent 2 -->
            <div class="fusion-slot" :class="{ selected: fusionParent2 }" @click="openFusionModal(2)">
              <template v-if="fusionParent2">
                <span class="fusion-emoji">{{ fusionParent2.emoji }}</span>
                <span class="fusion-name">{{ fusionParent2.name }}</span>
                <span class="fusion-power">⚡ {{ fusionParent2.power }}</span>
              </template>
              <template v-else>
                <span class="empty-slot">👆</span>
                <span>Parent 2</span>
              </template>
            </div>

            <div class="fusion-icon" v-if="fusionParent1 && fusionParent2">
              <span>=</span>
            </div>

            <!-- Fusion Result Preview -->
            <div class="fusion-result" v-if="fusionParent1 && fusionParent2">
              <span class="fusion-emoji">{{ fusionPreview.emoji }}</span>
              <span class="fusion-name">{{ fusionPreview.name }}</span>
              <span class="fusion-type">{{ fusionPreview.type }}</span>
              <span class="fusion-power">⚡ {{ fusionPreview.power }}</span>
            </div>
          </div>

          <div class="fusion-actions" v-if="fusionParent1 && fusionParent2">
            <button class="btn-fuse" @click="performFusion" :disabled="!canSave">
              🧬 FUSIONNER !
            </button>
            <p class="fusion-warning">⚠️ Les parents seront conservés</p>
          </div>
        </div>

        <!-- Fusion Selection Modal -->
        <div class="modal-overlay" v-if="showFusionModal" @click.self="showFusionModal = false">
          <div class="modal fusion-modal">
            <h3>Choisir Parent {{ selectingFusionSlot }}</h3>
            <div class="fighter-grid">
              <div v-for="mon in savedMons" :key="mon.id" 
                   class="fighter-option" 
                   :class="{ selected: isFusionSelected(mon), disabled: isFusionDisabled(mon) }"
                   @click="confirmFusionParent(mon)">
                <span class="fo-emoji">{{ mon.emoji }}</span>
                <span class="fo-name">{{ mon.name }}</span>
                <span class="fo-power">⚡ {{ mon.power }}</span>
              </div>
            </div>
            <button class="btn-close-modal" @click="showFusionModal = false">✕ Fermer</button>
          </div>
        </div>
      </div>

      <!-- TAB: HISTORY -->
      <div class="tab-content" v-if="activeTab === 'history'">
        <div class="history-container">
          <h2>📜 Historique des Combats</h2>
          
          <div class="history-list" v-if="battleHistory.length > 0">
            <div v-for="(battle, index) in battleHistory" :key="index" class="history-item">
              <div class="history-fighters">
                <span class="history-fighter winner" v-if="battle.winner === 1">
                  {{ battle.fighter1.emoji }} {{ battle.fighter1.name }}
                </span>
                <span class="history-fighter" v-else>
                  {{ battle.fighter1.emoji }} {{ battle.fighter1.name }}
                </span>
                <span class="history-vs">VS</span>
                <span class="history-fighter winner" v-if="battle.winner === 2">
                  {{ battle.fighter2.emoji }} {{ battle.fighter2.name }}
                </span>
                <span class="history-fighter" v-else>
                  {{ battle.fighter2.emoji }} {{ battle.fighter2.name }}
                </span>
              </div>
              <div class="history-details">
                <span class="history-date">{{ formatDate(battle.date) }}</span>
                <span class="history-turns">{{ battle.turns }} tours</span>
              </div>
            </div>
          </div>
          
          <div class="empty-state" v-else>
            <span>📜</span>
            <p>Aucun combat enregistré</p>
            <button class="btn-start" @click="activeTab = 'arena'">Lancer un combat</button>
          </div>

          <button class="btn-clear-history" v-if="battleHistory.length > 0" @click="clearHistory">
            🗑️ Effacer l'historique
          </button>
        </div>
      </div>

      <!-- TAB: ACHIEVEMENTS -->
      <div class="tab-content" v-if="activeTab === 'achievements'">
        <div class="achievements-container">
          <h2>🏅 Succès</h2>
          <p class="achievements-progress">{{ unlockedCount }} / {{ achievements.length }} débloqués</p>
          
          <div class="achievements-grid">
            <div v-for="achievement in achievements" :key="achievement.id" 
                 class="achievement-card" 
                 :class="{ unlocked: isAchievementUnlocked(achievement), locked: !isAchievementUnlocked(achievement) }">
              <span class="achievement-icon">{{ isAchievementUnlocked(achievement) ? achievement.icon : '🔒' }}</span>
              <div class="achievement-info">
                <h4>{{ achievement.name }}</h4>
                <p>{{ achievement.description }}</p>
              </div>
              <span class="achievement-check" v-if="isAchievementUnlocked(achievement)">✅</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- INFO -->
    <section class="info-section" v-if="!showGenerator">
      <h2>📖 Comment ça marche ?</h2>
      <div class="info-grid">
        <div class="info-card">
          <span class="info-icon">🔥</span>
          <h3>Élément</h3>
          <p>6 éléments de base en dualités hexagonales. Les combinaisons créent des types uniques comme Vapeur ou Métal.</p>
        </div>
        <div class="info-card">
          <span class="info-icon">🧬</span>
          <h3>Race</h3>
          <p>Définit l'apparence et les affinités. Physique, Éthéré, Organique, Mécanique...</p>
        </div>
        <div class="info-card">
          <span class="info-icon">⚔️</span>
          <h3>Classe</h3>
          <p>Rôle au combat : Tank, DPS, Healer, avec équilibrage naturel par dualités.</p>
        </div>
        <div class="info-card">
          <span class="info-icon">💪</span>
          <h3>Soma</h3>
          <p>6 stats de combat traditionnelles : Santé, Dégâts, Constitution, Mana, Défense, Dextérité.</p>
        </div>
        <div class="info-card">
          <span class="info-icon">🧠</span>
          <h3>Ego</h3>
          <p>Attributs existentiels : Taille, Rareté, Intelligence, Complexité, Chance, Puissance.</p>
        </div>
        <div class="info-card">
          <span class="info-icon">📅</span>
          <h3>Âge</h3>
          <p>Phase de développement du MON, de l'œuf à la forme légendaire.</p>
        </div>
      </div>
    </section>
  <!-- Toast Notifications -->
    <div class="toast-container">
      <transition-group name="toast">
        <div v-for="toast in toasts" :key="toast.id" class="toast" :class="toast.type">
          {{ toast.message }}
        </div>
      </transition-group>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';

const showGenerator = ref(false);
const savedMons = ref([]);
const toasts = ref([]);
const activeTab = ref('create');
const sortBy = ref('date');

// Battle System State
const fighter1 = ref(null);
const fighter2 = ref(null);
const showFighterModal = ref(false);
const selectingSlot = ref(1);
const battleInProgress = ref(false);
const battleStarted = ref(false);
const battleLog = ref([]);
const battleWinner = ref(null);
const leaderboardSort = ref('wins');
const logContainer = ref(null);

// Fusion State
const fusionParent1 = ref(null);
const fusionParent2 = ref(null);
const showFusionModal = ref(false);
const selectingFusionSlot = ref(1);

// History & Achievements
const battleHistory = ref([]);
const soundEnabled = ref(true);

const params = reactive({
  element: { x: 0, y: 0, z: 0 },
  race: { x: 0, y: 0, z: 0 },
  class: { x: 0, y: 0, z: 0 },
  soma: { health: 5, damage: 5, constitution: 5, mana: 5, defense: 5, dexterity: 5 },
  ego: { size: 1, rarity: 5, intelligence: 5, complexity: 5, luck: 5, power: 5 },
  age: 3
});

const somaLabels = {
  health: { name: 'Santé', icon: '❤️', color: '#ef4444' },
  damage: { name: 'Dégâts', icon: '⚔️', color: '#f97316' },
  constitution: { name: 'Constitution', icon: '🛡️', color: '#eab308' },
  mana: { name: 'Mana', icon: '💎', color: '#3b82f6' },
  defense: { name: 'Défense', icon: '🔰', color: '#22c55e' },
  dexterity: { name: 'Dextérité', icon: '💨', color: '#a855f7' }
};

const egoLabels = {
  size: { name: 'Taille', icon: '📏' },
  rarity: { name: 'Rareté', icon: '💎' },
  intelligence: { name: 'Intelligence', icon: '🧠' },
  complexity: { name: 'Complexité', icon: '🔮' },
  luck: { name: 'Chance', icon: '🍀' },
  power: { name: 'Puissance', icon: '⚡' }
};

const ages = [
  { value: 1, name: 'Œuf', icon: '🥒' },
  { value: 2, name: 'Juvénile', icon: '🐣' },
  { value: 3, name: 'Adulte', icon: '🦊' },
  { value: 4, name: 'Vétéran', icon: '🦁' },
  { value: 5, name: 'Légendaire', icon: '🐉' }
];

const elements = {
  fire: { name: 'Feu', emoji: '🔥', color: '#ef4444' },
  water: { name: 'Eau', emoji: '💧', color: '#3b82f6' },
  earth: { name: 'Terre', emoji: '🌍', color: '#84cc16' },
  sky: { name: 'Ciel', emoji: '☁️', color: '#06b6d4' },
  solar: { name: 'Solaire', emoji: '☀️', color: '#fbbf24' },
  lunar: { name: 'Lunaire', emoji: '🌙', color: '#8b5cf6' },
  vapor: { name: 'Vapeur', emoji: '💨', color: '#94a3b8' },
  metal: { name: 'Métal', emoji: '⚙️', color: '#64748b' },
  ice: { name: 'Glace', emoji: '❄️', color: '#67e8f9' },
  lightning: { name: 'Foudre', emoji: '⚡', color: '#facc15' },
  nature: { name: 'Nature', emoji: '🌿', color: '#22c55e' },
  shadow: { name: 'Ombre', emoji: '🌑', color: '#1e1b4b' }
};

const races = ['Racine', 'Éthéré', 'Mécanique', 'Organique', 'Cristallin', 'Spectral', 'Primordial', 'Hybride'];
const classes = ['Tank', 'DPS', 'Healer', 'Support', 'Assassin', 'Mage', 'Ranger', 'Berserker'];

// Achievements
const achievements = [
  { id: 'first_mon', name: 'Premier Pas', description: 'Créer votre premier MON', icon: '🌟', check: () => savedMons.value.length >= 1 },
  { id: 'collector_5', name: 'Collectionneur', description: 'Avoir 5 MON dans la collection', icon: '📦', check: () => savedMons.value.length >= 5 },
  { id: 'collector_10', name: 'Grand Collectionneur', description: 'Avoir 10 MON dans la collection', icon: '🎪', check: () => savedMons.value.length >= 10 },
  { id: 'collector_25', name: 'Maître Collectionneur', description: 'Avoir 25 MON dans la collection', icon: '👑', check: () => savedMons.value.length >= 25 },
  { id: 'first_battle', name: 'Première Victoire', description: 'Gagner votre premier combat', icon: '⚔️', check: () => savedMons.value.some(m => (m.wins || 0) >= 1) },
  { id: 'warrior_10', name: 'Guerrier', description: 'Accumuler 10 victoires', icon: '🏆', check: () => savedMons.value.reduce((sum, m) => sum + (m.wins || 0), 0) >= 10 },
  { id: 'champion', name: 'Champion', description: 'Avoir un MON avec 10 victoires', icon: '🥇', check: () => savedMons.value.some(m => (m.wins || 0) >= 10) },
  { id: 'legendary', name: 'Légendaire', description: 'Obtenir un MON Légendaire', icon: '🐉', check: () => savedMons.value.some(m => m.rarity === 'Légendaire') },
  { id: 'first_fusion', name: 'Alchimiste', description: 'Réaliser votre première fusion', icon: '🧬', check: () => savedMons.value.some(m => m.isFusion) },
  { id: 'power_100', name: 'Puissance 100', description: 'Créer un MON avec 100+ de puissance', icon: '⚡', check: () => savedMons.value.some(m => m.power >= 100) },
  { id: 'battles_50', name: 'Vétéran', description: 'Participer à 50 combats', icon: '🎖️', check: () => battleHistory.value.length >= 50 },
  { id: 'perfect_win', name: 'Victoire Parfaite', description: 'Gagner sans perdre de HP', icon: '💫', check: () => battleHistory.value.some(b => b.perfectWin) }
];

// Computed properties
const elementType = computed(() => {
  const { x, y, z } = params.element;
  const dominant = Math.max(Math.abs(x), Math.abs(y), Math.abs(z));
  
  if (dominant < 3) return 'Neutre';
  
  if (Math.abs(x) === dominant) {
    if (x > 0 && y > 0) return elements.vapor.name;
    if (x > 0 && z < 0) return elements.lightning.name;
    return x > 0 ? elements.solar.name : elements.lunar.name;
  }
  if (Math.abs(y) === dominant) {
    if (y > 0 && z > 0) return elements.nature.name;
    return y > 0 ? elements.sky.name : elements.earth.name;
  }
  if (Math.abs(z) === dominant) {
    if (z > 0 && y < 0) return elements.metal.name;
    if (z < 0 && x > 0) return elements.ice.name;
    return z > 0 ? elements.fire.name : elements.water.name;
  }
  return 'Neutre';
});

const elementColor = computed(() => {
  const type = elementType.value.toLowerCase();
  const found = Object.values(elements).find(e => e.name.toLowerCase() === type);
  return found?.color || '#6b7280';
});

const elementGradient = computed(() => {
  return `url(#elementGrad)`;
});

const raceType = computed(() => {
  const { x, y, z } = params.race;
  const idx = Math.floor((x + 1) * 2 + (y + 1) + Math.abs(z)) % races.length;
  return races[idx];
});

const classType = computed(() => {
  const { x, y, z } = params.class;
  if (x > 3) return 'Tank';
  if (x < -3) return 'DPS';
  if (y > 3) return 'Healer';
  if (y < -3) return 'Burst';
  if (z > 3) return 'Melee';
  if (z < -3) return 'Ranged';
  return 'Hybride';
});

const currentAge = computed(() => ages.find(a => a.value === params.age) || ages[2]);

const monEmoji = computed(() => {
  const ageEmojis = {
    1: ['🥚', '🪺'],
    2: ['🐣', '🐤', '🦎'],
    3: ['🦊', '🐺', '🦅', '🐙', '🦑'],
    4: ['🦁', '🐯', '🦈', '🦂', '🐲'],
    5: ['🐉', '🦄', '🔱', '👑']
  };
  const emojis = ageEmojis[params.age] || ageEmojis[3];
  const hash = Object.values(params.soma).reduce((a, b) => a + b, 0);
  return emojis[hash % emojis.length];
});

const monName = computed(() => {
  const prefixes = ['Neo', 'Hex', 'Zyx', 'Aero', 'Pyro', 'Aqua', 'Terra', 'Nox', 'Lux', 'Chrono'];
  const suffixes = ['mon', 'rex', 'dra', 'kin', 'tor', 'lix', 'ra', 'gon', 'us', 'ix'];
  const pIdx = (params.element.x + params.element.y + 20) % prefixes.length;
  const sIdx = (params.soma.health + params.soma.mana) % suffixes.length;
  return prefixes[pIdx] + suffixes[sIdx];
});

const rarity = computed(() => {
  const score = params.ego.rarity;
  if (score >= 9) return 'Légendaire';
  if (score >= 7) return 'Épique';
  if (score >= 5) return 'Rare';
  if (score >= 3) return 'Peu commun';
  return 'Commun';
});

const rarityClass = computed(() => rarity.value.toLowerCase().replace(' ', '-'));

const powerScore = computed(() => {
  const somaTotal = Object.values(params.soma).reduce((a, b) => a + b, 0);
  const egoBonus = params.ego.power + params.ego.rarity;
  const ageMultiplier = params.age * 0.5;
  return Math.round((somaTotal + egoBonus) * ageMultiplier);
});

const hexFormula = computed(() => {
  const e = params.element;
  const r = params.race;
  const c = params.class;
  const s = Object.values(params.soma);
  const g = Object.values(params.ego);
  return `{5, (${e.x},${e.y},${e.z}), (${r.x.toFixed(1)},${r.y.toFixed(1)},${r.z.toFixed(1)}), (${c.x},${c.y},${c.z}), (${s.join(',')}), (${g.join(',')}), ${params.age}}`;
});

const canSave = computed(() => savedMons.value.length < 50);

// Sorted collections
const sortedMons = computed(() => {
  const mons = [...savedMons.value];
  switch (sortBy.value) {
    case 'power': return mons.sort((a, b) => (b.power || 0) - (a.power || 0));
    case 'wins': return mons.sort((a, b) => (b.wins || 0) - (a.wins || 0));
    default: return mons.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
  }
});

const leaderboardMons = computed(() => {
  const mons = [...savedMons.value];
  switch (leaderboardSort.value) {
    case 'power': return mons.sort((a, b) => (b.power || 0) - (a.power || 0));
    case 'ratio': return mons.sort((a, b) => getWinRatio(b) - getWinRatio(a));
    default: return mons.sort((a, b) => (b.wins || 0) - (a.wins || 0));
  }
});

// Fusion Preview
const fusionPreview = computed(() => {
  if (!fusionParent1.value || !fusionParent2.value) return null;
  const p1 = fusionParent1.value;
  const p2 = fusionParent2.value;
  
  // Mix names
  const name1 = p1.name.slice(0, Math.ceil(p1.name.length / 2));
  const name2 = p2.name.slice(Math.floor(p2.name.length / 2));
  const name = name1 + name2;
  
  // Random emoji from parents based on power
  const emojis = [p1.emoji, p2.emoji, '🦋', '🦉', '✨', '🌟'];
  const emoji = emojis[Math.floor((p1.power + p2.power) % emojis.length)];
  
  // Average power with bonus
  const power = Math.round((p1.power + p2.power) / 2 * 1.1);
  
  // Mix types
  const type1Parts = p1.type?.split(' ') || ['Neutre'];
  const type2Parts = p2.type?.split(' ') || ['Neutre'];
  const type = `${type1Parts[0]} ${type2Parts[type2Parts.length - 1]}`;
  
  return { name, emoji, power, type };
});

// Achievements
const unlockedCount = computed(() => {
  return achievements.filter(a => a.check()).length;
});

// Hexagon calculations
const hexPoints = computed(() => {
  const cx = 100, cy = 100, r = 90;
  return Array.from({ length: 6 }, (_, i) => {
    const angle = (Math.PI / 3) * i - Math.PI / 2;
    return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`;
  }).join(' ');
});

function innerHexPoints(scale) {
  const cx = 100, cy = 100, r = 90 * scale;
  return Array.from({ length: 6 }, (_, i) => {
    const angle = (Math.PI / 3) * i - Math.PI / 2;
    return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`;
  }).join(' ');
}

const statLines = computed(() => {
  const cx = 100, cy = 100, r = 90;
  return Array.from({ length: 6 }, (_, i) => {
    const angle = (Math.PI / 3) * i - Math.PI / 2;
    return {
      x1: cx, y1: cy,
      x2: cx + r * Math.cos(angle),
      y2: cy + r * Math.sin(angle)
    };
  });
});

const statPolygonPoints = computed(() => {
  const cx = 100, cy = 100, maxR = 80;
  const stats = Object.values(params.soma);
  return stats.map((stat, i) => {
    const angle = (Math.PI / 3) * i - Math.PI / 2;
    const r = (stat / 10) * maxR;
    return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`;
  }).join(' ');
});

// Methods
function randomize() {
  params.element.x = Math.floor(Math.random() * 21) - 10;
  params.element.y = Math.floor(Math.random() * 21) - 10;
  params.element.z = Math.floor(Math.random() * 21) - 10;
  params.race.x = Math.round((Math.random() * 2 - 1) * 10) / 10;
  params.race.y = Math.round((Math.random() * 2 - 1) * 10) / 10;
  params.race.z = Math.round((Math.random() * 2 - 1) * 10) / 10;
  params.class.x = Math.floor(Math.random() * 21) - 10;
  params.class.y = Math.floor(Math.random() * 21) - 10;
  params.class.z = Math.floor(Math.random() * 21) - 10;
  Object.keys(params.soma).forEach(k => params.soma[k] = Math.floor(Math.random() * 10) + 1);
  Object.keys(params.ego).forEach(k => params.ego[k] = Math.floor(Math.random() * 10) + 1);
  params.age = Math.floor(Math.random() * 5) + 1;
}

function saveMon() {
  if (!canSave.value) return;
  const mon = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2),
    name: monName.value,
    emoji: monEmoji.value,
    type: `${elementType.value} ${raceType.value} ${classType.value}`,
    params: JSON.parse(JSON.stringify(params)),
    power: powerScore.value,
    rarity: rarity.value,
    createdAt: Date.now()
  };
  savedMons.value.push(mon);
  localStorage.setItem('hexworld_mons', JSON.stringify(savedMons.value));
  showToast(`✅ ${mon.name} sauvegardé !`, 'success');
}

function loadMon(mon) {
  Object.assign(params.element, mon.params.element);
  Object.assign(params.race, mon.params.race);
  Object.assign(params.class, mon.params.class);
  Object.assign(params.soma, mon.params.soma);
  Object.assign(params.ego, mon.params.ego);
  params.age = mon.params.age;
  showGenerator.value = true;
}

function deleteMon(index) {
  const mon = savedMons.value[index];
  savedMons.value.splice(index, 1);
  localStorage.setItem('hexworld_mons', JSON.stringify(savedMons.value));
  showToast(`🗑️ ${mon.name} supprimé`, 'warning');
}

// Export functions
function copyFormula() {
  navigator.clipboard.writeText(hexFormula.value);
  showToast('📋 Formule copiée !', 'success');
}

function exportAsJson() {
  const data = {
    name: monName.value,
    type: `${elementType.value} ${raceType.value} ${classType.value}`,
    power: powerScore.value,
    rarity: rarity.value,
    params: JSON.parse(JSON.stringify(params)),
    formula: hexFormula.value,
    createdAt: new Date().toISOString()
  };
  
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${data.name}.json`;
  a.click();
  URL.revokeObjectURL(url);
  showToast('📄 JSON exporté !', 'success');
}

function shareUrl() {
  const data = btoa(JSON.stringify(params));
  const url = `${window.location.origin}${window.location.pathname}?mon=${data}`;
  navigator.clipboard.writeText(url);
  showToast('🔗 Lien copié !', 'success');
}

// Toast system
function showToast(message, type = 'info') {
  const id = Date.now();
  toasts.value.push({ id, message, type });
  setTimeout(() => {
    toasts.value = toasts.value.filter(t => t.id !== id);
  }, 3000);
}

// Battle System Functions
function getWinRatio(mon) {
  const total = (mon.wins || 0) + (mon.losses || 0);
  if (total === 0) return 0;
  return Math.round((mon.wins || 0) / total * 100);
}

function selectFighter(mon, slot) {
  if (slot === 1) {
    fighter1.value = { ...mon, currentHp: mon.params.soma.health * 10, maxHp: mon.params.soma.health * 10 };
  } else {
    fighter2.value = { ...mon, currentHp: mon.params.soma.health * 10, maxHp: mon.params.soma.health * 10 };
  }
  showToast(`🥊 ${mon.name} sélectionné comme Combattant ${slot}`, 'info');
  activeTab.value = 'arena';
}

function openFighterModal(slot) {
  if (battleInProgress.value) return;
  selectingSlot.value = slot;
  showFighterModal.value = true;
}

function confirmFighter(mon) {
  if (isDisabled(mon)) return;
  selectFighter(mon, selectingSlot.value);
  showFighterModal.value = false;
}

function isSelected(mon) {
  return fighter1.value?.id === mon.id || fighter2.value?.id === mon.id;
}

function isDisabled(mon) {
  if (selectingSlot.value === 1) return fighter2.value?.id === mon.id;
  return fighter1.value?.id === mon.id;
}

function resetBattle() {
  battleStarted.value = false;
  battleInProgress.value = false;
  battleLog.value = [];
  battleWinner.value = null;
  if (fighter1.value) {
    fighter1.value.currentHp = fighter1.value.maxHp;
  }
  if (fighter2.value) {
    fighter2.value.currentHp = fighter2.value.maxHp;
  }
}

async function startBattle() {
  if (!fighter1.value || !fighter2.value || battleInProgress.value) return;
  
  resetBattle();
  battleStarted.value = true;
  battleInProgress.value = true;
  
  // Initialize HP
  fighter1.value.currentHp = fighter1.value.maxHp;
  fighter2.value.currentHp = fighter2.value.maxHp;
  
  addLog('🏁', `Combat entre ${fighter1.value.name} et ${fighter2.value.name} !`, 'start');
  await delay(800);
  
  let turn = 1;
  const maxTurns = 20;
  
  while (fighter1.value.currentHp > 0 && fighter2.value.currentHp > 0 && turn <= maxTurns) {
    // Determine attack order based on dexterity
    const f1Speed = fighter1.value.params.soma.dexterity + Math.random() * 5;
    const f2Speed = fighter2.value.params.soma.dexterity + Math.random() * 5;
    
    const [first, second] = f1Speed >= f2Speed 
      ? [fighter1.value, fighter2.value] 
      : [fighter2.value, fighter1.value];
    
    // First attack
    await performAttack(first, second, turn);
    if (second.currentHp <= 0) break;
    
    await delay(600);
    
    // Counter attack
    await performAttack(second, first, turn);
    if (first.currentHp <= 0) break;
    
    turn++;
    await delay(400);
  }
  
  // Determine winner
  const winner = fighter1.value.currentHp > fighter2.value.currentHp ? fighter1.value : fighter2.value;
  const loser = winner === fighter1.value ? fighter2.value : fighter1.value;
  const perfectWin = winner.currentHp === winner.maxHp;
  
  battleWinner.value = winner;
  addLog('🏆', `${winner.name} remporte la victoire !`, 'victory');
  
  // Add to history
  addBattleToHistory(fighter1.value, fighter2.value, winner, turn, perfectWin);
  
  // Update stats
  updateMonStats(winner.id, true);
  updateMonStats(loser.id, false);
  
  battleInProgress.value = false;
  playSound('victory');
  showToast(`🏆 ${winner.name} gagne le combat !`, 'success');
  checkAchievements();
}

async function performAttack(attacker, defender, turn) {
  const baseDamage = attacker.params.soma.damage;
  const defense = defender.params.soma.defense;
  const constitution = defender.params.soma.constitution;
  
  // Element multiplier
  const elementMult = getElementMultiplier(attacker.type, defender.type);
  
  // Calculate damage
  const rawDamage = baseDamage * 2 + Math.floor(Math.random() * 5);
  const reduction = (defense + constitution / 2) * 0.3;
  const finalDamage = Math.max(1, Math.round((rawDamage - reduction) * elementMult));
  
  // Critical hit chance based on luck
  const isCritical = Math.random() < (attacker.params?.ego?.luck || 5) * 0.03;
  const damage = isCritical ? Math.round(finalDamage * 1.5) : finalDamage;
  
  defender.currentHp = Math.max(0, defender.currentHp - damage);
  
  playSound('attack');
  
  const icon = isCritical ? '💥' : '⚔️';
  const critText = isCritical ? ' CRITIQUE !' : '';
  addLog(icon, `${attacker.name} attaque ${defender.name}${critText}`, attacker === fighter1.value ? 'f1' : 'f2', damage);
}

function getElementMultiplier(attackerType, defenderType) {
  const advantages = {
    'Feu': ['Nature', 'Glace', 'Métal'],
    'Eau': ['Feu', 'Terre'],
    'Terre': ['Foudre', 'Feu'],
    'Ciel': ['Terre', 'Nature'],
    'Solaire': ['Lunaire', 'Ombre', 'Glace'],
    'Lunaire': ['Solaire'],
    'Nature': ['Eau', 'Terre'],
    'Glace': ['Ciel', 'Nature'],
    'Foudre': ['Eau', 'Ciel'],
    'Métal': ['Glace'],
    'Vapeur': ['Feu'],
    'Ombre': ['Ciel']
  };
  
  for (const [element, targets] of Object.entries(advantages)) {
    if (attackerType?.includes(element)) {
      for (const target of targets) {
        if (defenderType?.includes(target)) return 1.5;
      }
    }
  }
  
  // Check disadvantage
  for (const [element, targets] of Object.entries(advantages)) {
    if (defenderType?.includes(element)) {
      for (const target of targets) {
        if (attackerType?.includes(target)) return 0.75;
      }
    }
  }
  
  return 1;
}

function addLog(icon, text, type, damage = null) {
  battleLog.value.push({ icon, text, type, damage });
  // Auto-scroll
  setTimeout(() => {
    if (logContainer.value) {
      logContainer.value.scrollTop = logContainer.value.scrollHeight;
    }
  }, 50);
}

function updateMonStats(monId, isWin) {
  const idx = savedMons.value.findIndex(m => m.id === monId);
  if (idx >= 0) {
    if (isWin) {
      savedMons.value[idx].wins = (savedMons.value[idx].wins || 0) + 1;
    } else {
      savedMons.value[idx].losses = (savedMons.value[idx].losses || 0) + 1;
    }
    localStorage.setItem('hexworld_mons', JSON.stringify(savedMons.value));
  }
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Fusion Functions
function openFusionModal(slot) {
  selectingFusionSlot.value = slot;
  showFusionModal.value = true;
}

function confirmFusionParent(mon) {
  if (isFusionDisabled(mon)) return;
  if (selectingFusionSlot.value === 1) {
    fusionParent1.value = mon;
  } else {
    fusionParent2.value = mon;
  }
  showFusionModal.value = false;
  playSound('select');
}

function isFusionSelected(mon) {
  return fusionParent1.value?.id === mon.id || fusionParent2.value?.id === mon.id;
}

function isFusionDisabled(mon) {
  if (selectingFusionSlot.value === 1) return fusionParent2.value?.id === mon.id;
  return fusionParent1.value?.id === mon.id;
}

function performFusion() {
  if (!fusionParent1.value || !fusionParent2.value || !canSave.value) return;
  
  const p1 = fusionParent1.value;
  const p2 = fusionParent2.value;
  
  // Create fused params by averaging
  const fusedParams = {
    element: {
      x: Math.round((p1.params.element.x + p2.params.element.x) / 2),
      y: Math.round((p1.params.element.y + p2.params.element.y) / 2),
      z: Math.round((p1.params.element.z + p2.params.element.z) / 2)
    },
    race: {
      x: (p1.params.race.x + p2.params.race.x) / 2,
      y: (p1.params.race.y + p2.params.race.y) / 2,
      z: (p1.params.race.z + p2.params.race.z) / 2
    },
    class: {
      x: Math.round((p1.params.class.x + p2.params.class.x) / 2),
      y: Math.round((p1.params.class.y + p2.params.class.y) / 2),
      z: Math.round((p1.params.class.z + p2.params.class.z) / 2)
    },
    soma: {},
    ego: {},
    age: Math.max(p1.params.age, p2.params.age)
  };
  
  // Average soma stats with slight random bonus
  Object.keys(p1.params.soma).forEach(key => {
    const avg = (p1.params.soma[key] + p2.params.soma[key]) / 2;
    const bonus = Math.random() > 0.7 ? 1 : 0;
    fusedParams.soma[key] = Math.min(10, Math.round(avg) + bonus);
  });
  
  // Average ego stats
  Object.keys(p1.params.ego).forEach(key => {
    fusedParams.ego[key] = Math.round((p1.params.ego[key] + p2.params.ego[key]) / 2);
  });
  
  const preview = fusionPreview.value;
  const fusedMon = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2),
    name: preview.name,
    emoji: preview.emoji,
    type: preview.type,
    params: fusedParams,
    power: preview.power,
    rarity: fusedParams.ego.rarity >= 9 ? 'Légendaire' : fusedParams.ego.rarity >= 7 ? 'Épique' : fusedParams.ego.rarity >= 5 ? 'Rare' : 'Peu commun',
    isFusion: true,
    parents: [p1.name, p2.name],
    wins: 0,
    losses: 0,
    createdAt: Date.now()
  };
  
  savedMons.value.push(fusedMon);
  localStorage.setItem('hexworld_mons', JSON.stringify(savedMons.value));
  
  fusionParent1.value = null;
  fusionParent2.value = null;
  
  playSound('fusion');
  showToast(`🧬 ${fusedMon.name} créé par fusion !`, 'success');
  checkAchievements();
}

// History Functions
function addBattleToHistory(f1, f2, winner, turns, perfectWin = false) {
  const battle = {
    fighter1: { name: f1.name, emoji: f1.emoji },
    fighter2: { name: f2.name, emoji: f2.emoji },
    winner: winner === f1 ? 1 : 2,
    turns,
    perfectWin,
    date: Date.now()
  };
  battleHistory.value.unshift(battle);
  if (battleHistory.value.length > 100) battleHistory.value.pop(); // Keep last 100
  localStorage.setItem('hexworld_history', JSON.stringify(battleHistory.value));
}

function formatDate(timestamp) {
  const date = new Date(timestamp);
  return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
}

function clearHistory() {
  battleHistory.value = [];
  localStorage.removeItem('hexworld_history');
  showToast('🗑️ Historique effacé', 'info');
}

// Achievement Functions
function isAchievementUnlocked(achievement) {
  return achievement.check();
}

function checkAchievements() {
  const newlyUnlocked = achievements.filter(a => {
    const wasUnlocked = localStorage.getItem(`achievement_${a.id}`);
    const isNowUnlocked = a.check();
    if (isNowUnlocked && !wasUnlocked) {
      localStorage.setItem(`achievement_${a.id}`, 'true');
      return true;
    }
    return false;
  });
  
  newlyUnlocked.forEach(a => {
    showToast(`🏅 Succès débloqué : ${a.name}`, 'success');
    playSound('achievement');
  });
}

// Sound Effects
function playSound(type) {
  if (!soundEnabled.value) return;
  // Using Web Audio API for simple sounds
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    switch(type) {
      case 'select':
        oscillator.frequency.value = 600;
        gainNode.gain.value = 0.1;
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.1);
        break;
      case 'attack':
        oscillator.frequency.value = 200;
        oscillator.type = 'sawtooth';
        gainNode.gain.value = 0.15;
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.15);
        break;
      case 'victory':
        oscillator.frequency.value = 800;
        gainNode.gain.value = 0.1;
        oscillator.start();
        setTimeout(() => oscillator.frequency.value = 1000, 100);
        setTimeout(() => oscillator.frequency.value = 1200, 200);
        oscillator.stop(audioCtx.currentTime + 0.4);
        break;
      case 'fusion':
        oscillator.frequency.value = 400;
        oscillator.type = 'sine';
        gainNode.gain.value = 0.1;
        oscillator.start();
        setTimeout(() => oscillator.frequency.value = 600, 150);
        setTimeout(() => oscillator.frequency.value = 800, 300);
        oscillator.stop(audioCtx.currentTime + 0.5);
        break;
      case 'achievement':
        oscillator.frequency.value = 523;
        oscillator.type = 'sine';
        gainNode.gain.value = 0.1;
        oscillator.start();
        setTimeout(() => oscillator.frequency.value = 659, 100);
        setTimeout(() => oscillator.frequency.value = 784, 200);
        setTimeout(() => oscillator.frequency.value = 1047, 300);
        oscillator.stop(audioCtx.currentTime + 0.5);
        break;
    }
  } catch(e) {
    // Audio not supported
  }
}

onMounted(() => {
  const saved = localStorage.getItem('hexworld_mons');
  if (saved) savedMons.value = JSON.parse(saved);
  
  const history = localStorage.getItem('hexworld_history');
  if (history) battleHistory.value = JSON.parse(history);
  
  // Check achievements on load
  checkAchievements();
});
</script>

<style scoped>
.hex-world {
  min-height: 100vh;
  background: linear-gradient(180deg, #0a0a0a, #1a1a2e);
  color: #f5f5f5;
  padding-top: 80px;
}

/* HERO */
.hero {
  padding: 4rem 2rem;
  text-align: center;
}

.hero-content {
  max-width: 600px;
  margin: 0 auto;
}

.hero-badge {
  display: inline-block;
  padding: 0.5rem 1rem;
  background: rgba(139, 92, 246, 0.2);
  border: 1px solid rgba(139, 92, 246, 0.3);
  border-radius: 2rem;
  color: #a78bfa;
  margin-bottom: 1rem;
}

.hero h1 {
  font-size: 3.5rem;
  background: linear-gradient(135deg, #fbbf24, #f97316, #ef4444);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 0.5rem;
}

.hero-subtitle {
  color: #9ca3af;
  margin-bottom: 2rem;
  font-size: 1.1rem;
}

.hero-stats {
  display: flex;
  justify-content: center;
  gap: 3rem;
  margin-bottom: 2rem;
}

.stat-value {
  display: block;
  font-size: 2rem;
  font-weight: 700;
  color: #fbbf24;
}

.stat-label {
  font-size: 0.85rem;
  color: #6b7280;
}

.btn-start {
  padding: 1rem 2rem;
  font-size: 1.1rem;
  font-weight: 600;
  background: linear-gradient(135deg, #fbbf24, #f97316);
  border: none;
  border-radius: 0.75rem;
  color: #0a0a0a;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-start:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(251, 191, 36, 0.3);
}

/* GENERATOR */
.generator-section {
  padding: 2rem;
}

.generator-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.controls-panel, .preview-panel {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 1rem;
  padding: 1.5rem;
}

.controls-panel h2, .preview-panel h2 {
  margin: 0 0 1.5rem;
  font-size: 1.25rem;
}

.param-group {
  margin-bottom: 1.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.param-group h3 {
  margin: 0 0 0.25rem;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.param-group h3 span {
  font-size: 0.8rem;
  padding: 0.15rem 0.5rem;
  background: rgba(251, 191, 36, 0.2);
  border-radius: 0.25rem;
  color: #fbbf24;
}

.param-desc {
  margin: 0 0 0.75rem;
  font-size: 0.8rem;
  color: #6b7280;
}

.triple-slider, .stats-grid {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.triple-slider label, .stats-grid label {
  display: grid;
  grid-template-columns: 140px 1fr 40px;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.85rem;
}

.triple-slider input[type="range"], .stats-grid input[type="range"] {
  width: 100%;
  accent-color: #fbbf24;
}

.value {
  text-align: right;
  font-family: monospace;
  color: #fbbf24;
}

.age-selector {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.age-selector button {
  padding: 0.5rem 0.75rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.5rem;
  color: #9ca3af;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.85rem;
}

.age-selector button:hover {
  border-color: #fbbf24;
}

.age-selector button.active {
  background: rgba(251, 191, 36, 0.2);
  border-color: #fbbf24;
  color: #fbbf24;
}

.action-buttons {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.btn-random, .btn-save {
  flex: 1;
  padding: 0.75rem;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-random {
  background: rgba(255, 255, 255, 0.1);
  color: #f5f5f5;
}

.btn-random:hover {
  background: rgba(255, 255, 255, 0.15);
}

.btn-save {
  background: linear-gradient(135deg, #fbbf24, #f97316);
  color: #0a0a0a;
}

.btn-save:hover:not(:disabled) {
  transform: translateY(-1px);
}

.btn-save:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* PREVIEW */
.hex-preview {
  display: flex;
  justify-content: center;
  margin-bottom: 1.5rem;
}

.hex-svg {
  width: 220px;
  height: 220px;
}

.hex-bg {
  fill: url(#hexGrad);
  stroke: #fbbf24;
  stroke-width: 2;
}

.hex-inner {
  fill: none;
  stroke: rgba(255, 255, 255, 0.1);
  stroke-width: 1;
}

.stat-line {
  stroke: rgba(255, 255, 255, 0.1);
  stroke-width: 1;
}

.stat-polygon {
  fill: rgba(251, 191, 36, 0.3);
  stroke: #fbbf24;
  stroke-width: 2;
}

.center-icon {
  font-size: 2.5rem;
}

/* MON CARD */
.mon-card {
  background: linear-gradient(135deg, rgba(251, 191, 36, 0.1), rgba(139, 92, 246, 0.1));
  border: 1px solid rgba(251, 191, 36, 0.3);
  border-radius: 1rem;
  padding: 1.25rem;
  margin-bottom: 1rem;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.mon-emoji {
  font-size: 2.5rem;
}

.mon-identity {
  flex: 1;
}

.mon-identity h3 {
  margin: 0;
  font-size: 1.25rem;
}

.mon-type {
  font-size: 0.8rem;
  color: #9ca3af;
}

.mon-rarity {
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 600;
}

.mon-rarity.légendaire { background: linear-gradient(135deg, #fbbf24, #f97316); color: #0a0a0a; }
.mon-rarity.épique { background: #8b5cf6; color: white; }
.mon-rarity.rare { background: #3b82f6; color: white; }
.mon-rarity.peu-commun { background: #22c55e; color: white; }
.mon-rarity.commun { background: #6b7280; color: white; }

.card-stats {
  margin-bottom: 1rem;
}

.stat-bar {
  display: grid;
  grid-template-columns: 100px 1fr 30px;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.4rem;
  font-size: 0.8rem;
}

.bar-container {
  height: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.3s;
}

.card-attributes {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.attribute-tag {
  padding: 0.25rem 0.5rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 0.25rem;
  font-size: 0.75rem;
  color: #9ca3af;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 0.75rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.age-badge {
  font-size: 0.85rem;
}

.power-score {
  font-size: 1.1rem;
  font-weight: 700;
  color: #fbbf24;
}

.hex-formula {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(0, 0, 0, 0.3);
  padding: 0.75rem;
  border-radius: 0.5rem;
  overflow-x: auto;
  margin-bottom: 1rem;
}

.hex-formula code {
  font-family: monospace;
  font-size: 0.75rem;
  color: #a78bfa;
  white-space: nowrap;
  flex: 1;
}

.btn-copy {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  padding: 0.25rem;
  opacity: 0.7;
  transition: opacity 0.2s;
}

.btn-copy:hover {
  opacity: 1;
}

.export-actions {
  display: flex;
  gap: 0.5rem;
}

.btn-export {
  flex: 1;
  padding: 0.5rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.5rem;
  color: #9ca3af;
  cursor: pointer;
  font-size: 0.8rem;
  transition: all 0.2s;
}

.btn-export:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #f5f5f5;
  border-color: #fbbf24;
}

/* COLLECTION */
.collection-section {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.collection-section h2 {
  margin-bottom: 1.5rem;
}

.collection-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
}

.mini-card {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.75rem;
  padding: 1rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
}

.mini-card:hover {
  border-color: #fbbf24;
  transform: translateY(-2px);
}

.mini-emoji {
  font-size: 2rem;
  display: block;
  margin-bottom: 0.5rem;
}

.mini-name {
  display: block;
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.mini-type {
  font-size: 0.7rem;
  color: #6b7280;
}

.delete-btn {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: rgba(239, 68, 68, 0.2);
  border: none;
  color: #ef4444;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.2s;
}

.mini-card:hover .delete-btn {
  opacity: 1;
}

/* INFO */
.info-section {
  padding: 3rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.info-section h2 {
  text-align: center;
  margin-bottom: 2rem;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

.info-card {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 1rem;
  padding: 1.5rem;
  text-align: center;
}

.info-icon {
  font-size: 2.5rem;
  display: block;
  margin-bottom: 0.75rem;
}

.info-card h3 {
  margin: 0 0 0.5rem;
}

.info-card p {
  margin: 0;
  font-size: 0.9rem;
  color: #9ca3af;
  line-height: 1.6;
}

/* TABS BAR */
.tabs-bar {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  padding: 1rem;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 1rem 1rem 0 0;
  margin-bottom: 0;
  flex-wrap: wrap;
}

.tab-btn {
  padding: 0.75rem 1.25rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.5rem;
  color: #9ca3af;
  cursor: pointer;
  transition: all 0.2s;
}

.tab-btn:hover:not(:disabled) {
  border-color: #fbbf24;
  color: #fbbf24;
}

.tab-btn.active {
  background: rgba(251, 191, 36, 0.2);
  border-color: #fbbf24;
  color: #fbbf24;
}

.tab-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.tab-content {
  padding: 1.5rem;
}

/* HERO EXTRA BUTTONS */
.hero-extra-btns {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 1rem;
}

.btn-arena {
  padding: 0.75rem 1.5rem;
  background: rgba(239, 68, 68, 0.2);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 0.5rem;
  color: #fca5a5;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-arena:hover {
  background: rgba(239, 68, 68, 0.3);
  border-color: #ef4444;
}

/* COLLECTION HEADER */
.collection-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.collection-header h2 {
  margin: 0;
}

.collection-filters select {
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.5rem;
  color: #f5f5f5;
  cursor: pointer;
}

.mini-stats-badge {
  position: absolute;
  top: 0.5rem;
  left: 0.5rem;
  display: flex;
  gap: 0.5rem;
  font-size: 0.65rem;
}

.mini-stats-badge .wins { color: #22c55e; }
.mini-stats-badge .losses { color: #ef4444; }

.mini-power {
  display: block;
  color: #fbbf24;
  font-size: 0.85rem;
  margin-top: 0.25rem;
}

.mini-actions {
  position: absolute;
  bottom: 0.5rem;
  left: 0.5rem;
  right: 0.5rem;
  display: flex;
  justify-content: center;
  gap: 0.25rem;
  opacity: 0;
  transition: opacity 0.2s;
}

.mini-card:hover .mini-actions {
  opacity: 1;
}

.select-fighter-btn {
  width: 28px;
  height: 28px;
  border-radius: 0.25rem;
  background: rgba(251, 191, 36, 0.3);
  border: none;
  cursor: pointer;
  font-size: 0.75rem;
}

.mini-card.légendaire { border-color: #fbbf24; }
.mini-card.épique { border-color: #8b5cf6; }
.mini-card.rare { border-color: #3b82f6; }
.mini-card.peu-commun { border-color: #22c55e; }

/* ARENA */
.arena-container {
  max-width: 900px;
  margin: 0 auto;
  text-align: center;
}

.arena-container h2 {
  margin: 0 0 0.5rem;
}

.arena-desc {
  color: #9ca3af;
  margin-bottom: 2rem;
}

.battle-setup {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  margin-bottom: 2rem;
}

.fighter-slot {
  width: 200px;
  min-height: 180px;
  background: rgba(255, 255, 255, 0.02);
  border: 2px dashed rgba(255, 255, 255, 0.2);
  border-radius: 1rem;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.fighter-slot:hover {
  border-color: #fbbf24;
}

.fighter-slot.selected {
  border-style: solid;
  border-color: #fbbf24;
  background: rgba(251, 191, 36, 0.1);
}

.fighter-slot.winner {
  border-color: #22c55e;
  background: rgba(34, 197, 94, 0.1);
  animation: pulse 1s infinite;
}

@keyframes pulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.4); }
  50% { box-shadow: 0 0 0 10px rgba(34, 197, 94, 0); }
}

.fighter-emoji {
  font-size: 3rem;
}

.fighter-name {
  font-weight: 600;
  font-size: 1.1rem;
}

.fighter-power {
  color: #fbbf24;
}

.fighter-hp {
  width: 100%;
  margin-top: 0.5rem;
}

.hp-bar {
  height: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 0.25rem;
}

.hp-fill {
  height: 100%;
  background: linear-gradient(90deg, #ef4444, #22c55e);
  border-radius: 4px;
  transition: width 0.3s;
}

.fighter-hp span {
  font-size: 0.75rem;
  color: #9ca3af;
}

.empty-slot {
  font-size: 2rem;
  opacity: 0.5;
}

.vs-badge {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #ef4444, #dc2626);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 1.25rem;
  color: white;
  box-shadow: 0 0 20px rgba(239, 68, 68, 0.5);
}

.vs-badge.fighting {
  animation: shake 0.3s infinite;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}

.battle-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 2rem;
}

.btn-fight {
  padding: 1rem 3rem;
  font-size: 1.25rem;
  font-weight: 700;
  background: linear-gradient(135deg, #ef4444, #dc2626);
  border: none;
  border-radius: 0.75rem;
  color: white;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-fight:hover:not(:disabled) {
  transform: scale(1.05);
  box-shadow: 0 0 30px rgba(239, 68, 68, 0.5);
}

.btn-fight:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-reset {
  padding: 1rem 2rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 0.75rem;
  color: #f5f5f5;
  cursor: pointer;
}

/* BATTLE LOG */
.battle-log {
  background: rgba(0, 0, 0, 0.3);
  border-radius: 1rem;
  padding: 1.5rem;
  margin-bottom: 2rem;
  text-align: left;
}

.battle-log h3 {
  margin: 0 0 1rem;
  text-align: center;
}

.log-entries {
  max-height: 250px;
  overflow-y: auto;
}

.log-entry {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
  margin-bottom: 0.5rem;
  animation: fadeIn 0.3s;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

.log-entry.f1 { background: rgba(59, 130, 246, 0.1); }
.log-entry.f2 { background: rgba(239, 68, 68, 0.1); }
.log-entry.start { background: rgba(251, 191, 36, 0.1); }
.log-entry.victory { background: rgba(34, 197, 94, 0.2); }

.log-icon {
  font-size: 1.25rem;
}

.log-text {
  flex: 1;
  font-size: 0.9rem;
}

.log-damage {
  color: #ef4444;
  font-weight: 600;
}

/* WINNER PANEL */
.winner-panel {
  background: linear-gradient(135deg, rgba(34, 197, 94, 0.2), rgba(251, 191, 36, 0.2));
  border: 2px solid #22c55e;
  border-radius: 1rem;
  padding: 2rem;
  text-align: center;
  animation: bounceIn 0.5s;
}

@keyframes bounceIn {
  0% { transform: scale(0.5); opacity: 0; }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); opacity: 1; }
}

.winner-trophy {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.winner-panel h3 {
  margin: 0 0 0.5rem;
  color: #22c55e;
}

.winner-rewards {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-top: 1rem;
  color: #fbbf24;
}

/* MODAL */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 2rem;
}

.modal {
  background: #1f2937;
  border-radius: 1rem;
  padding: 2rem;
  max-width: 600px;
  width: 100%;
  max-height: 80vh;
  overflow-y: auto;
}

.modal h3 {
  margin: 0 0 1.5rem;
  text-align: center;
}

.fighter-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.fighter-option {
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.75rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
}

.fighter-option:hover:not(.disabled) {
  border-color: #fbbf24;
}

.fighter-option.selected {
  border-color: #22c55e;
  background: rgba(34, 197, 94, 0.1);
}

.fighter-option.disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.fo-emoji {
  font-size: 2rem;
  display: block;
  margin-bottom: 0.5rem;
}

.fo-name {
  display: block;
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.fo-power {
  display: block;
  color: #fbbf24;
  font-size: 0.85rem;
}

.fo-record {
  display: block;
  font-size: 0.7rem;
  color: #6b7280;
  margin-top: 0.25rem;
}

.btn-close-modal {
  width: 100%;
  padding: 0.75rem;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 0.5rem;
  color: #9ca3af;
  cursor: pointer;
}

/* LEADERBOARD */
.leaderboard-container {
  max-width: 800px;
  margin: 0 auto;
}

.leaderboard-container h2 {
  text-align: center;
  margin-bottom: 1.5rem;
}

.leaderboard-tabs {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.leaderboard-tabs button {
  padding: 0.5rem 1.25rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.5rem;
  color: #9ca3af;
  cursor: pointer;
}

.leaderboard-tabs button.active {
  background: rgba(251, 191, 36, 0.2);
  border-color: #fbbf24;
  color: #fbbf24;
}

.leaderboard-list {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 1rem;
  overflow: hidden;
}

.leaderboard-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.leaderboard-item:last-child {
  border-bottom: none;
}

.leaderboard-item.top3 {
  background: rgba(251, 191, 36, 0.05);
}

.rank {
  width: 40px;
  text-align: center;
  font-size: 1.25rem;
}

.lb-emoji {
  font-size: 1.75rem;
}

.lb-info {
  flex: 1;
}

.lb-name {
  display: block;
  font-weight: 600;
}

.lb-type {
  font-size: 0.75rem;
  color: #6b7280;
}

.lb-stats {
  display: flex;
  gap: 1rem;
  font-size: 0.85rem;
}

.lb-wins { color: #22c55e; }
.lb-losses { color: #ef4444; }
.lb-ratio { color: #a78bfa; }

.lb-power {
  color: #fbbf24;
  font-weight: 600;
}

/* EMPTY STATE */
.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  color: #6b7280;
}

.empty-state span {
  font-size: 4rem;
  display: block;
  margin-bottom: 1rem;
}

/* FUSION */
.fusion-container {
  max-width: 900px;
  margin: 0 auto;
  text-align: center;
}

.fusion-container h2 {
  margin: 0 0 0.5rem;
}

.fusion-desc {
  color: #9ca3af;
  margin-bottom: 2rem;
}

.fusion-setup {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.fusion-slot {
  width: 160px;
  min-height: 160px;
  background: rgba(255, 255, 255, 0.02);
  border: 2px dashed rgba(139, 92, 246, 0.3);
  border-radius: 1rem;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.fusion-slot:hover {
  border-color: #8b5cf6;
}

.fusion-slot.selected {
  border-style: solid;
  border-color: #8b5cf6;
  background: rgba(139, 92, 246, 0.1);
}

.fusion-emoji {
  font-size: 2.5rem;
}

.fusion-name {
  font-weight: 600;
}

.fusion-power {
  color: #fbbf24;
}

.fusion-type {
  font-size: 0.75rem;
  color: #9ca3af;
}

.fusion-icon {
  font-size: 2rem;
  color: #8b5cf6;
}

.fusion-result {
  width: 180px;
  min-height: 180px;
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(251, 191, 36, 0.2));
  border: 2px solid #8b5cf6;
  border-radius: 1rem;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  animation: glow 2s infinite alternate;
}

@keyframes glow {
  from { box-shadow: 0 0 10px rgba(139, 92, 246, 0.3); }
  to { box-shadow: 0 0 30px rgba(139, 92, 246, 0.6); }
}

.fusion-actions {
  margin-top: 1rem;
}

.btn-fuse {
  padding: 1rem 3rem;
  font-size: 1.25rem;
  font-weight: 700;
  background: linear-gradient(135deg, #8b5cf6, #a855f7);
  border: none;
  border-radius: 0.75rem;
  color: white;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-fuse:hover:not(:disabled) {
  transform: scale(1.05);
  box-shadow: 0 0 30px rgba(139, 92, 246, 0.5);
}

.btn-fuse:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.fusion-warning {
  margin-top: 1rem;
  font-size: 0.85rem;
  color: #9ca3af;
}

/* HISTORY */
.history-container {
  max-width: 800px;
  margin: 0 auto;
}

.history-container h2 {
  text-align: center;
  margin-bottom: 1.5rem;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.history-item {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.75rem;
  padding: 1rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.history-fighters {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.history-fighter {
  font-size: 0.95rem;
}

.history-fighter.winner {
  color: #22c55e;
  font-weight: 600;
}

.history-vs {
  color: #ef4444;
  font-weight: 700;
  font-size: 0.85rem;
}

.history-details {
  display: flex;
  gap: 1.5rem;
  font-size: 0.8rem;
  color: #6b7280;
}

.btn-clear-history {
  display: block;
  margin: 2rem auto 0;
  padding: 0.75rem 1.5rem;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 0.5rem;
  color: #fca5a5;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-clear-history:hover {
  background: rgba(239, 68, 68, 0.2);
}

/* ACHIEVEMENTS */
.achievements-container {
  max-width: 900px;
  margin: 0 auto;
}

.achievements-container h2 {
  text-align: center;
  margin-bottom: 0.5rem;
}

.achievements-progress {
  text-align: center;
  color: #9ca3af;
  margin-bottom: 2rem;
}

.achievements-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
}

.achievement-card {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.75rem;
  padding: 1.25rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: all 0.2s;
}

.achievement-card.unlocked {
  border-color: #22c55e;
  background: rgba(34, 197, 94, 0.05);
}

.achievement-card.locked {
  opacity: 0.5;
}

.achievement-icon {
  font-size: 2rem;
  min-width: 50px;
  text-align: center;
}

.achievement-info {
  flex: 1;
}

.achievement-info h4 {
  margin: 0 0 0.25rem;
  font-size: 1rem;
}

.achievement-info p {
  margin: 0;
  font-size: 0.8rem;
  color: #9ca3af;
}

.achievement-check {
  font-size: 1.25rem;
}

/* TOAST */
.toast-container {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.toast {
  padding: 0.75rem 1.25rem;
  border-radius: 0.5rem;
  font-size: 0.9rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  animation: slideIn 0.3s ease;
}

.toast.success { background: #22c55e; color: white; }
.toast.info { background: #3b82f6; color: white; }
.toast.warning { background: #f97316; color: white; }
.toast.error { background: #ef4444; color: white; }

@keyframes slideIn {
  from { transform: translateX(100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}

/* RESPONSIVE */
@media (max-width: 900px) {
  .generator-container { grid-template-columns: 1fr; }
  .hero h1 { font-size: 2.5rem; }
  .hero-stats { gap: 1.5rem; }
  .triple-slider label, .stats-grid label { grid-template-columns: 100px 1fr 35px; }
}

@media (max-width: 480px) {
  .hero-stats { flex-direction: column; gap: 1rem; }
  .age-selector { justify-content: center; }
  .triple-slider label, .stats-grid label { grid-template-columns: 80px 1fr 30px; font-size: 0.75rem; }
}
</style>
