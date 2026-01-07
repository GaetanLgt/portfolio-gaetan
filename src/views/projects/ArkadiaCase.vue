<template>
  <div class="arkadia-page" :class="`arkadia-page--${currentTimeOfDay}`">
    <!-- Ambient Background -->
    <div class="ark-ambient">
      <div class="ark-ambient__sky"></div>
      <div class="ark-ambient__stars" v-if="currentTimeOfDay === 'night'"></div>
      <div class="ark-ambient__mountains"></div>
      <div class="ark-ambient__fog"></div>
    </div>
    
    <!-- Floating Particles (spores, fireflies) -->
    <div class="ark-particles" aria-hidden="true">
      <span v-for="n in 20" :key="n" class="ark-particle" :style="getParticleStyle(n)"></span>
    </div>

    <!-- Hero Section - Immersive ARK Style -->
    <section class="hero">
      <div class="container">
        <!-- Dino Silhouettes -->
        <div class="hero__silhouettes" aria-hidden="true">
          <div class="silhouette silhouette--rex"></div>
          <div class="silhouette silhouette--bronto"></div>
          <div class="silhouette silhouette--ptera"></div>
        </div>
        
        <div class="hero__content reveal">
          <div class="tag animate-pulse-slow">
            <span>🦖</span> CLUSTER ARK: SURVIVAL ASCENDED
          </div>
          
          <h1 class="hero__title">
            <span class="hero__title-ark">ARKADIA</span>
            <span class="hero__title-france text-gradient neon-text">FRANCE</span>
          </h1>
          
          <p class="hero__tagline">
            Survivre. Apprivoiser. Dominer.
          </p>
          
          <p class="hero__subtitle">
            Le cluster français de référence sur ARK: Survival Ascended.<br>
            <strong>150+ survivants</strong> · <strong>9 cartes</strong> · <strong>99.8% uptime</strong>
          </p>
          
          <div class="hero__badges">
            <span class="badge badge--ue5">
              <span class="badge__icon">⚡</span>
              Unreal Engine 5
            </span>
            <span class="badge badge--devops">
              <span class="badge__icon">🖥️</span>
              DevOps
            </span>
            <span class="badge badge--community">
              <span class="badge__icon">👥</span>
              150+ Joueurs
            </span>
            <span class="badge badge--automation">
              <span class="badge__icon">🤖</span>
              n8n Automation
            </span>
          </div>
          
          <!-- Quick Stats Bar -->
          <div class="hero__quickstats reveal" data-reveal-delay="200">
            <div class="quickstat">
              <span class="quickstat__value">9</span>
              <span class="quickstat__label">CARTES</span>
            </div>
            <div class="quickstat__divider"></div>
            <div class="quickstat">
              <span class="quickstat__value">150+</span>
              <span class="quickstat__label">SURVIVANTS</span>
            </div>
            <div class="quickstat__divider"></div>
            <div class="quickstat">
              <span class="quickstat__value">24/7</span>
              <span class="quickstat__label">ONLINE</span>
            </div>
            <div class="quickstat__divider"></div>
            <div class="quickstat">
              <span class="quickstat__value">2024</span>
              <span class="quickstat__label">LANCÉ</span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Scroll indicator -->
      <div class="hero__scroll" aria-hidden="true">
        <span>Explorer</span>
        <div class="hero__scroll-arrow"></div>
      </div>
    </section>
    
    <!-- Biomes Section -->
    <section class="biomes">
      <div class="container">
        <h2 class="section-title">
          <span class="section-title__icon">🗺️</span>
          LES BIOMES DU CLUSTER
        </h2>
        <p class="section-subtitle">
          9 cartes interconnectées, chacune avec ses défis uniques
        </p>
        
        <div class="biomes__grid reveal">
          <div 
            v-for="biome in biomes" 
            :key="biome.id"
            class="biome-card"
            :class="`biome-card--${biome.id}`"
            :style="{ '--biome-color': biome.color }"
          >
            <div class="biome-card__bg"></div>
            <div class="biome-card__content">
              <span class="biome-card__icon">{{ biome.icon }}</span>
              <h3 class="biome-card__name">{{ biome.name }}</h3>
              <p class="biome-card__desc">{{ biome.desc }}</p>
              <div class="biome-card__creatures">
                <span v-for="creature in biome.creatures" :key="creature" class="biome-card__creature">
                  {{ creature }}
                </span>
              </div>
              <div class="biome-card__stats">
                <div class="biome-stat">
                  <span class="biome-stat__label">Danger</span>
                  <div class="biome-stat__bar">
                    <div class="biome-stat__fill" :style="{ width: biome.danger + '%' }"></div>
                  </div>
                </div>
                <div class="biome-stat">
                  <span class="biome-stat__label">Ressources</span>
                  <div class="biome-stat__bar">
                    <div class="biome-stat__fill" :style="{ width: biome.resources + '%' }"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    
    <!-- Creatures Showcase -->
    <section class="creatures">
      <div class="container">
        <h2 class="section-title">
          <span class="section-title__icon">🦕</span>
          CRÉATURES EMBLÉMATIQUES
        </h2>
        <p class="section-subtitle">
          Des dinosaures aux créatures mythiques, apprivoisez-les tous
        </p>
        
        <div class="creatures__carousel reveal">
          <div 
            v-for="creature in creatures" 
            :key="creature.id"
            class="creature-card glass"
            :class="{ 'creature-card--tek': creature.tek }"
          >
            <div class="creature-card__glow" :style="{ background: creature.color }"></div>
            <div class="creature-card__icon">{{ creature.icon }}</div>
            <h3 class="creature-card__name">{{ creature.name }}</h3>
            <span class="creature-card__type">{{ creature.type }}</span>
            <div class="creature-card__stats">
              <div class="creature-stat">
                <span>💪</span>
                <span>{{ creature.power }}</span>
              </div>
              <div class="creature-stat">
                <span>⚡</span>
                <span>{{ creature.speed }}</span>
              </div>
              <div class="creature-stat">
                <span>❤️</span>
                <span>{{ creature.health }}</span>
              </div>
            </div>
            <span v-if="creature.tek" class="creature-card__tek-badge">TEK</span>
          </div>
        </div>
      </div>
    </section>
    
    <!-- Intro - The Story -->
    <section class="intro">
      <div class="container">
        <div class="intro__content glass reveal">
          <div class="intro__obelisk" aria-hidden="true">
            <div class="obelisk"></div>
          </div>
          <div class="intro__text">
            <h2>L'HISTOIRE D'ARKADIA</h2>
            <p class="intro__lead">
              ARKADIA FRANCE n'est pas qu'un serveur de jeu. C'est un <strong>écosystème vivant</strong> 
              où 150+ survivants construisent, explorent et dominent ensemble depuis 2024.
            </p>
            <p>
              Administrer ce cluster, c'est jongler entre <strong>infrastructure critique</strong>, 
              <strong>équilibrage gameplay</strong> et <strong>animation communautaire</strong>. 
              Un rôle hybride entre SysAdmin, Game Designer et Community Manager.
            </p>
          </div>
        </div>
      </div>
    </section>
    
    <!-- Stats with ARK Theme -->
    <section class="stats">
      <div class="container">
        <h2 class="section-title">
          <span class="section-title__icon">📊</span>
          MÉTRIQUES DU CLUSTER
        </h2>
        
        <div class="stats__grid reveal">
          <div class="stat-card cyber-card">
            <div class="stat-card__icon">🖥️</div>
            <span class="stat-card__value"><AnimatedCounter :value="9" /></span>
            <span class="stat-card__label">Serveurs synchronisés</span>
            <span class="stat-card__detail">The Island, Ragnarok, Aberration...</span>
          </div>
          <div class="stat-card cyber-card">
            <div class="stat-card__icon">👥</div>
            <span class="stat-card__value"><AnimatedCounter :value="150" suffix="+" /></span>
            <span class="stat-card__label">Survivants actifs</span>
            <span class="stat-card__detail">Communauté Discord</span>
          </div>
          <div class="stat-card cyber-card">
            <div class="stat-card__icon">⚡</div>
            <span class="stat-card__value"><AnimatedCounter :value="99.8" suffix="%" :decimals="1" /></span>
            <span class="stat-card__label">Uptime annuel</span>
            <span class="stat-card__detail">Infrastructure Nitrado</span>
          </div>
          <div class="stat-card cyber-card">
            <div class="stat-card__icon">💾</div>
            <span class="stat-card__value"><AnimatedCounter :value="15" suffix="min" /></span>
            <span class="stat-card__label">Fréquence backup</span>
            <span class="stat-card__detail">Disaster Recovery</span>
          </div>
        </div>
        
        <!-- Visual Gauges -->
        <div class="gauges-panel glass reveal" data-reveal-delay="100">
          <GaugeCircle 
            :value="99.8" 
            :max="100" 
            :size="140" 
            label="DISPONIBILITÉ"
            suffix="%"
          />
          <GaugeCircle 
            :value="85" 
            :max="100" 
            :size="140" 
            label="RECOVERY"
            suffix="%"
          />
          <GaugeCircle 
            :value="150" 
            :max="200" 
            :size="140" 
            label="JOUEURS"
            suffix=""
          />
          <GaugeCircle 
            :value="9" 
            :max="10" 
            :size="140" 
            label="SERVEURS"
            suffix=""
          />
        </div>
      </div>
    </section>
    
    <!-- Charts Section -->
    <section class="charts">
      <div class="container">
        <h2 class="section-title">
          <span class="section-title__icon">📈</span>
          ANALYSE DE CHARGE
        </h2>
        <p class="charts__subtitle">LOG_SOURCE: Cluster_Arkadia_Production_Metrics_2025</p>
        
        <div class="charts__grid reveal">
          <ChartPanel
            title="Charge CPU Cluster (%)"
            subtitle="Intervalle: 24h // Node Capacity: 150+ Users"
            peak="95%"
            type="line"
            :data="loadChartData"
            :accessibleData="loadAccessibleData"
          />
          
          <ChartPanel
            title="Disponibilité Globale (SLA)"
            subtitle="Mesure annuelle // Target: 99.8%"
            type="doughnut"
            :data="uptimeChartData"
            :accessibleData="uptimeAccessibleData"
          />
        </div>
        
        <div class="charts__callout glass">
          <span class="charts__callout-icon">🦖</span>
          <div>
            <span class="charts__callout-label">PRIME TIME :</span>
            Le pic à 20h correspond au raid time — le moment où les tribus s'affrontent et où la charge serveur explose. 
            L'infrastructure doit absorber ces pics sans broncher.
          </div>
        </div>
      </div>
    </section>
    
    <!-- Daily Ops Timeline -->
    <section class="daily-ops">
      <div class="container">
        <h2 class="section-title">
          <span class="section-title__icon">⏰</span>
          JOURNÉE TYPE D'ADMINISTRATION
        </h2>
        
        <div class="timeline reveal">
          <!-- Morning -->
          <div class="timeline__block">
            <div class="timeline__header">
              <span class="timeline__time">🌅 MATIN</span>
              <span class="timeline__title">Monitoring et Santé du Système</span>
            </div>
            <div class="timeline__content glass">
              <p>Ma journée commence par l'audit du Dashboard Nitrado. Avec UE5, la stabilité est critique.</p>
              
              <div class="task-list">
                <div class="task">
                  <span class="task__icon">📊</span>
                  <div class="task__content">
                    <strong>Audit des ressources</strong>
                    <p>Vérification des courbes CPU/RAM de la nuit. Un pic anormal = mod mal optimisé ou base corrompue.</p>
                  </div>
                </div>
                <div class="task">
                  <span class="task__icon">💾</span>
                  <div class="task__content">
                    <strong>Intégrité des données</strong>
                    <p>Contrôle de la taille des fichiers .ark. Variation brutale = corruption potentielle.</p>
                  </div>
                </div>
                <div class="task">
                  <span class="task__icon">🎫</span>
                  <div class="task__content">
                    <strong>Support N1</strong>
                    <p>Tickets Discord : joueur bloqué, perte de dino, crash client.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Afternoon -->
          <div class="timeline__block">
            <div class="timeline__header">
              <span class="timeline__time">☀️ JOURNÉE</span>
              <span class="timeline__title">Configuration et Déploiement</span>
            </div>
            <div class="timeline__content glass">
              <p>Le cœur technique. Je travaille directement dans les fichiers de configuration bruts.</p>
              
              <div class="code-block">
                <div class="code-block__header">
                  <span class="code-block__file">GameUserSettings.ini</span>
                  <span class="code-block__label">Économie & Progression</span>
                </div>
                <pre class="code-block__content"><code>[ServerSettings]
XPMultiplier=2.0
HarvestAmountMultiplier=2.5
TamingSpeedMultiplier=4.0
DifficultyOffset=1.0
OverrideOfficialDifficulty=5.0</code></pre>
              </div>
              
              <div class="code-block">
                <div class="code-block__header">
                  <span class="code-block__file">Game.ini</span>
                  <span class="code-block__label">Breeding & Spawns</span>
                </div>
                <pre class="code-block__content"><code>[/Script/ShooterGame.ShooterGameMode]
MatingIntervalMultiplier=0.5
EggHatchSpeedMultiplier=10.0
BabyMatureSpeedMultiplier=10.0
bDisableStructurePlacementCollision=true</code></pre>
              </div>
              
              <h4>🔄 Cycle de vie des Mods</h4>
              <div class="mod-cycle">
                <div class="mod-step">
                  <span class="mod-step__num">01</span>
                  <span class="mod-step__label">VEILLE</span>
                  <p>Changelogs CurseForge</p>
                </div>
                <div class="mod-step">
                  <span class="mod-step__num">02</span>
                  <span class="mod-step__label">STAGING</span>
                  <p>Test sur instance dédiée</p>
                </div>
                <div class="mod-step">
                  <span class="mod-step__num">03</span>
                  <span class="mod-step__label">DEPLOY</span>
                  <p>Notif Discord + restart</p>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Evening -->
          <div class="timeline__block">
            <div class="timeline__header">
              <span class="timeline__time">🌙 SOIRÉE</span>
              <span class="timeline__title">Intervention Terrain et Animation</span>
            </div>
            <div class="timeline__content glass">
              <p>Prime Time. La charge monte. Je passe en mode "Admin In-Game".</p>
              
              <div class="code-block">
                <div class="code-block__header">
                  <span class="code-block__file">Console Admin</span>
                  <span class="code-block__label">Commandes intervention</span>
                </div>
                <pre class="code-block__content"><code>enablecheats **************
cheat gcm  # Creative mode
cheat fly  # Survol rapide
cheat tpcoords X Y Z  # Téléportation
cheat destroytarget  # Suppression chirurgicale</code></pre>
              </div>
              
              <div class="scenario glass">
                <h4>📍 Scénario vécu</h4>
                <p>
                  Une tribu construit une base qui fait chuter les FPS du secteur. 
                  Je me téléporte, analyse la structure, et supprime chirurgicalement 
                  les éléments problématiques après explication en vocal.
                </p>
              </div>
              
              <div class="task">
                <span class="task__icon">🏆</span>
                <div class="task__content">
                  <strong>Animation Communautaire</strong>
                  <p>Organisation d'événements "Arène de Boss" — créatures spécifiques, zone sécurisée, challenge PvE unique.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    
    <!-- Events Section -->
    <section class="events">
      <div class="container">
        <h2 class="section-title">
          <span class="section-title__icon">🎉</span>
          ÉVÉNEMENTS LÉGENDAIRES
        </h2>
        
        <div class="events__grid reveal">
          <div class="event-card glass">
            <div class="event-card__date">
              <span class="event-card__day">18</span>
              <span class="event-card__month">JAN</span>
            </div>
            <div class="event-card__content">
              <h3>RAGNARÖK</h3>
              <p>Wipe complet du cluster. Nouveau départ, nouvelles règles, nouveaux défis.</p>
              <div class="event-card__tags">
                <span>🔥 Wipe</span>
                <span>⚔️ PvP</span>
                <span>🎁 Rewards</span>
              </div>
            </div>
          </div>
          
          <div class="event-card glass">
            <div class="event-card__date">
              <span class="event-card__day">XX</span>
              <span class="event-card__month">FEB</span>
            </div>
            <div class="event-card__content">
              <h3>BOSS ARENA</h3>
              <p>Affrontez les boss du cluster en équipe. Loot exclusif pour les vainqueurs.</p>
              <div class="event-card__tags">
                <span>🦖 PvE</span>
                <span>👥 Coop</span>
                <span>💎 Loot</span>
              </div>
            </div>
          </div>
          
          <div class="event-card glass">
            <div class="event-card__date">
              <span class="event-card__day">XX</span>
              <span class="event-card__month">MAR</span>
            </div>
            <div class="event-card__content">
              <h3>DINO CHAMPIONSHIP</h3>
              <p>Tournoi de courses et combats de dinosaures. Qui a le meilleur Rex ?</p>
              <div class="event-card__tags">
                <span>🏆 Tournament</span>
                <span>🦕 Dinos</span>
                <span>🎮 Fun</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    
    <!-- Security Section -->
    <section class="security">
      <div class="container">
        <h2 class="section-title">
          <span class="section-title__icon">🛡️</span>
          RIGUEUR ET SÉCURITÉ
        </h2>
        
        <div class="security__grid reveal">
          <div class="security-card cyber-card">
            <h3>
              <span class="security-card__icon">💾</span>
              Backup & Disaster Recovery
            </h3>
            <ul>
              <li><strong>Backups automatisés</strong> — Toutes les 2 heures</li>
              <li><strong>Sauvegardes manuelles</strong> — Avant chaque changement majeur</li>
              <li><strong>Rollback</strong> — Restauration T-1h en moins de 10 minutes</li>
            </ul>
          </div>
          
          <div class="security-card cyber-card">
            <h3>
              <span class="security-card__icon">🔒</span>
              Sécurité & Modération
            </h3>
            <ul>
              <li><strong>Whitelist</strong> — Accès restreint en maintenance</li>
              <li><strong>Password Admin</strong> — Rotation régulière</li>
              <li><strong>Ban Management</strong> — SteamID tracking, Fair Play</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
    
    <!-- Skills Transfer -->
    <section class="skills">
      <div class="container">
        <h2 class="section-title">
          <span class="section-title__icon">⭐</span>
          COMPÉTENCES TRANSFÉRABLES
        </h2>
        
        <p class="skills__intro">
          Cette expérience valide des compétences techniques et humaines 
          <strong>directement applicables en entreprise</strong>.
        </p>
        
        <div class="skills__grid reveal">
          <div class="skill-card cyber-card">
            <div class="skill-card__icon">🖥️</div>
            <h3>Administration Système</h3>
            <ul>
              <li>Configuration serveur</li>
              <li>Monitoring ressources</li>
              <li>Backup/restore</li>
              <li>Gestion dépendances</li>
            </ul>
          </div>
          
          <div class="skill-card cyber-card">
            <div class="skill-card__icon">👥</div>
            <h3>Support & Gestion de Crise</h3>
            <ul>
              <li>Diagnostic sous pression</li>
              <li>Communication claire</li>
              <li>Résolution conflits</li>
              <li>Priorisation urgences</li>
            </ul>
          </div>
          
          <div class="skill-card cyber-card">
            <div class="skill-card__icon">📊</div>
            <h3>Gestion de Produit</h3>
            <ul>
              <li>Analyse métriques</li>
              <li>Itération continue</li>
              <li>Amélioration UX</li>
              <li>Feedback utilisateurs</li>
            </ul>
          </div>
          
          <div class="skill-card cyber-card">
            <div class="skill-card__icon">📝</div>
            <h3>Rigueur & Documentation</h3>
            <ul>
              <li>Maintenance logs</li>
              <li>Règles claires</li>
              <li>Patch Notes</li>
              <li>Knowledge base</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
    
    <!-- CTA -->
    <section class="cta-section">
      <div class="container">
        <div class="cta-box glass reveal">
          <div class="cta-box__dinos" aria-hidden="true">
            <span>🦖</span>
            <span>🦕</span>
          </div>
          <h2 class="cta-box__title">Cette rigueur appliquée à votre projet ?</h2>
          <p class="cta-box__desc">
            Les mêmes méthodes de monitoring, backup et gestion de crise<br>
            appliquées à votre infrastructure métier.
          </p>
          <router-link to="/contact" class="btn-primary">
            DISCUTONS DE VOTRE PROJET
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
            </svg>
          </router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useScrollReveal } from '@/composables/useScrollReveal';
import GaugeCircle from '@/components/common/GaugeCircle.vue';
import AnimatedCounter from '@/components/common/AnimatedCounter.vue';
import ChartPanel from '@/components/charts/ChartPanel.vue';

// Scroll reveal
const { observeAll, prefersReducedMotion } = useScrollReveal();

onMounted(() => {
  observeAll('.reveal');
});

// Time of day cycle
const currentTimeOfDay = ref('day');
let timeInterval = null;

onMounted(() => {
  // Cycle through times
  const times = ['dawn', 'day', 'dusk', 'night'];
  let index = 1;
  timeInterval = setInterval(() => {
    index = (index + 1) % times.length;
    currentTimeOfDay.value = times[index];
  }, 30000); // Change every 30s
});

onUnmounted(() => {
  if (timeInterval) clearInterval(timeInterval);
});

// Particle styles
function getParticleStyle(n) {
  return {
    '--delay': `${Math.random() * 10}s`,
    '--x': `${Math.random() * 100}%`,
    '--duration': `${10 + Math.random() * 20}s`,
    '--size': `${2 + Math.random() * 4}px`
  };
}

// Biomes data
const biomes = ref([
  { 
    id: 'beach', 
    name: 'PLAGES', 
    icon: '🏝️', 
    desc: 'Zone de départ idéale, ressources basiques et créatures dociles.',
    color: '#F4D03F',
    creatures: ['🐢', '🦤', '🐊'],
    danger: 20,
    resources: 60
  },
  { 
    id: 'jungle', 
    name: 'JUNGLE', 
    icon: '🌴', 
    desc: 'Forêt dense, prédateurs furtifs et trésors cachés.',
    color: '#27AE60',
    creatures: ['🦖', '🐍', '🦎'],
    danger: 60,
    resources: 80
  },
  { 
    id: 'mountain', 
    name: 'MONTAGNE', 
    icon: '🏔️', 
    desc: 'Sommets enneigés, métal précieux et prédateurs alpins.',
    color: '#5DADE2',
    creatures: ['🦅', '🐺', '🦣'],
    danger: 75,
    resources: 90
  },
  { 
    id: 'volcano', 
    name: 'VOLCAN', 
    icon: '🌋', 
    desc: 'Chaleur extrême, obsidienne et créatures endémiques.',
    color: '#E74C3C',
    creatures: ['🦂', '🔥', '🐉'],
    danger: 90,
    resources: 95
  },
  { 
    id: 'tek', 
    name: 'ZONE TEK', 
    icon: '🔮', 
    desc: 'Ruines futuristes, technologie avancée et boss légendaires.',
    color: '#9B59B6',
    creatures: ['🤖', '⚡', '💎'],
    danger: 100,
    resources: 100
  }
]);

// Creatures data
const creatures = ref([
  { id: 'rex', name: 'T-REX', icon: '🦖', type: 'Carnivore', power: 95, speed: 60, health: 90, color: '#E74C3C', tek: false },
  { id: 'bronto', name: 'BRONTO', icon: '🦕', type: 'Herbivore', power: 70, speed: 30, health: 100, color: '#3498DB', tek: false },
  { id: 'raptor', name: 'RAPTOR', icon: '🦎', type: 'Carnivore', power: 50, speed: 95, health: 40, color: '#2ECC71', tek: false },
  { id: 'ptera', name: 'PTÉRA', icon: '🦅', type: 'Volant', power: 30, speed: 100, health: 35, color: '#F39C12', tek: false },
  { id: 'mosa', name: 'MOSASAURE', icon: '🐋', type: 'Aquatique', power: 85, speed: 70, health: 85, color: '#1ABC9C', tek: false },
  { id: 'tekrx', name: 'TEK REX', icon: '🤖', type: 'Tek', power: 100, speed: 65, health: 95, color: '#9B59B6', tek: true }
]);

// Chart data
const loadChartData = ref({
  labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '24:00'],
  datasets: [{
    label: 'Charge Cluster (%)',
    data: [15, 12, 45, 82, 65, 95, 30],
    borderColor: '#10b981',
    backgroundColor: 'rgba(16, 185, 129, 0.05)',
    fill: true,
    tension: 0.4,
    borderWidth: 2,
    pointRadius: 0
  }]
});

const loadAccessibleData = ref([
  { label: '00:00', value: '15%' },
  { label: '04:00', value: '12%' },
  { label: '08:00', value: '45%' },
  { label: '12:00', value: '82%' },
  { label: '16:00', value: '65%' },
  { label: '20:00', value: '95% (pic)' },
  { label: '24:00', value: '30%' }
]);

const uptimeChartData = ref({
  labels: ['Online', 'Maintenance'],
  datasets: [{
    data: [99.8, 0.2],
    backgroundColor: ['#10b981', '#18181b'],
    borderWidth: 0,
    cutout: '80%'
  }]
});

const uptimeAccessibleData = ref([
  { label: 'Temps de fonctionnement', value: '99.8%' },
  { label: 'Maintenance planifiée', value: '0.2%' }
]);
</script>

<style scoped>
.arkadia-page {
  min-height: 100vh;
  position: relative;
  z-index: 1;
  overflow-x: hidden;
}

/* ============================================
   AMBIENT BACKGROUND - ARK ATMOSPHERE
   ============================================ */
.ark-ambient {
  position: fixed;
  inset: 0;
  z-index: -1;
  pointer-events: none;
  transition: all 2s ease;
}

.ark-ambient__sky {
  position: absolute;
  inset: 0;
  transition: background 3s ease;
}

/* Time of day variations */
.arkadia-page--dawn .ark-ambient__sky {
  background: linear-gradient(180deg, #1a1a2e 0%, #4a3f6b 30%, #e8a87c 70%, #f8b739 100%);
}

.arkadia-page--day .ark-ambient__sky {
  background: linear-gradient(180deg, #0a0a0a 0%, #1a1a2e 40%, #2d3436 100%);
}

.arkadia-page--dusk .ark-ambient__sky {
  background: linear-gradient(180deg, #1a1a2e 0%, #4a3f6b 30%, #c0392b 70%, #e74c3c 100%);
}

.arkadia-page--night .ark-ambient__sky {
  background: linear-gradient(180deg, #000 0%, #0a0a1a 50%, #1a1a2e 100%);
}

.ark-ambient__stars {
  position: absolute;
  inset: 0;
  background-image: 
    radial-gradient(2px 2px at 20px 30px, white, transparent),
    radial-gradient(2px 2px at 40px 70px, rgba(255,255,255,0.8), transparent),
    radial-gradient(1px 1px at 90px 40px, white, transparent),
    radial-gradient(2px 2px at 160px 120px, rgba(255,255,255,0.9), transparent),
    radial-gradient(1px 1px at 230px 80px, white, transparent);
  background-size: 300px 200px;
  animation: twinkle 4s ease-in-out infinite;
}

@keyframes twinkle {
  0%, 100% { opacity: 0.8; }
  50% { opacity: 1; }
}

.ark-ambient__mountains {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 30vh;
  background: 
    linear-gradient(135deg, transparent 40%, rgba(20,20,30,0.8) 40%, rgba(20,20,30,0.8) 42%, transparent 42%),
    linear-gradient(225deg, transparent 40%, rgba(30,30,40,0.6) 40%, rgba(30,30,40,0.6) 42%, transparent 42%),
    linear-gradient(160deg, transparent 50%, rgba(15,15,25,0.9) 50%);
}

.ark-ambient__fog {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 20vh;
  background: linear-gradient(to top, rgba(10,10,10,0.9), transparent);
}

/* FLOATING PARTICLES */
.ark-particles {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
}

.ark-particle {
  position: absolute;
  width: var(--size);
  height: var(--size);
  background: rgba(16, 185, 129, 0.6);
  border-radius: 50%;
  left: var(--x);
  bottom: -10px;
  animation: floatUp var(--duration) ease-in-out infinite;
  animation-delay: var(--delay);
  filter: blur(1px);
}

@keyframes floatUp {
  0% {
    transform: translateY(0) translateX(0);
    opacity: 0;
  }
  10% {
    opacity: 0.8;
  }
  90% {
    opacity: 0.8;
  }
  100% {
    transform: translateY(-100vh) translateX(20px);
    opacity: 0;
  }
}

/* ============================================
   HERO SECTION - IMMERSIVE
   ============================================ */
.hero {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  padding: 120px 0 80px;
}

.hero__silhouettes {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}

.silhouette {
  position: absolute;
  background-size: contain;
  background-repeat: no-repeat;
  opacity: 0.1;
  filter: blur(1px);
}

.silhouette--rex {
  width: 300px;
  height: 200px;
  bottom: 10%;
  right: 5%;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 60'%3E%3Cpath fill='%2310b981' d='M90 35c0-5-3-10-8-12l-5-20c-1-2-3-3-5-2l-10 5-15-3c-3-1-6 1-7 4l-5 15-25 5c-3 1-5 4-4 7l3 10 5 5h70c3 0 6-3 6-6v-8z'/%3E%3C/svg%3E");
  animation: dinoWalk 20s ease-in-out infinite;
}

.silhouette--bronto {
  width: 400px;
  height: 250px;
  bottom: 5%;
  left: -5%;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 80'%3E%3Cpath fill='%2310b981' d='M110 50c0-15-10-28-25-32l-30-15c-3-1-6 0-8 3l-15 25-25 3c-4 1-7 5-6 9l5 20 10 10h90c3 0 5-3 5-6v-17z'/%3E%3C/svg%3E");
  animation: dinoWalk 30s ease-in-out infinite reverse;
}

.silhouette--ptera {
  width: 150px;
  height: 80px;
  top: 20%;
  right: 20%;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 80 40'%3E%3Cpath fill='%2310b981' d='M70 20c-5-10-15-15-25-15l-35 5c-3 0-5 3-4 6l10 15 15 5h35c3 0 5-3 5-6v-10z'/%3E%3C/svg%3E");
  animation: pteraFly 15s ease-in-out infinite;
}

@keyframes dinoWalk {
  0%, 100% { transform: translateX(0); }
  50% { transform: translateX(30px); }
}

@keyframes pteraFly {
  0%, 100% { transform: translate(0, 0) rotate(-5deg); }
  25% { transform: translate(50px, -30px) rotate(5deg); }
  50% { transform: translate(100px, 0) rotate(-5deg); }
  75% { transform: translate(50px, 20px) rotate(5deg); }
}

.hero__content {
  text-align: center;
  position: relative;
  z-index: 2;
}

.hero__title {
  font-size: clamp(3rem, 12vw, 8rem);
  font-weight: 900;
  line-height: 0.9;
  margin: var(--space-md) 0;
}

.hero__title-ark {
  display: block;
  color: var(--text-main);
  text-shadow: 0 0 40px rgba(255,255,255,0.1);
}

.hero__title-france {
  display: block;
  font-size: 0.6em;
}

.hero__tagline {
  font-family: 'JetBrains Mono', monospace;
  font-size: 1rem;
  color: var(--primary);
  letter-spacing: 0.3em;
  text-transform: uppercase;
  margin-bottom: var(--space-sm);
}

.hero__subtitle {
  font-size: 1.1rem;
  color: var(--text-muted);
  line-height: 1.8;
  margin-bottom: var(--space-md);
}

.hero__subtitle strong {
  color: var(--text-main);
}

.hero__badges {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.75rem;
  margin-bottom: var(--space-lg);
}

.badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.7rem;
  font-weight: 500;
  color: var(--text-main);
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.1);
  padding: 0.5rem 1rem;
  border-radius: 9999px;
  transition: all 0.3s ease;
}

.badge:hover {
  border-color: var(--primary);
  background: var(--primary-soft);
}

.badge__icon {
  font-size: 1rem;
}

/* Quick Stats Bar */
.hero__quickstats {
  display: inline-flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-sm) var(--space-md);
  background: rgba(10,10,10,0.8);
  border: 1px solid var(--border);
  border-radius: 9999px;
  backdrop-filter: blur(10px);
}

.quickstat {
  text-align: center;
}

.quickstat__value {
  display: block;
  font-family: 'JetBrains Mono', monospace;
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--primary);
}

.quickstat__label {
  font-size: 0.6rem;
  color: var(--text-dark);
  letter-spacing: 0.1em;
}

.quickstat__divider {
  width: 1px;
  height: 30px;
  background: var(--border);
}

/* Scroll indicator */
.hero__scroll {
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  animation: bounce 2s ease-in-out infinite;
}

.hero__scroll span {
  display: block;
  font-size: 0.7rem;
  color: var(--text-dark);
  margin-bottom: 0.5rem;
  letter-spacing: 0.1em;
}

.hero__scroll-arrow {
  width: 20px;
  height: 20px;
  border-right: 2px solid var(--primary);
  border-bottom: 2px solid var(--primary);
  transform: rotate(45deg);
  margin: 0 auto;
}

@keyframes bounce {
  0%, 100% { transform: translateX(-50%) translateY(0); }
  50% { transform: translateX(-50%) translateY(10px); }
}

/* ============================================
   BIOMES SECTION
   ============================================ */
.biomes {
  padding: var(--space-xl) 0;
  background: linear-gradient(180deg, transparent, var(--surface) 20%, var(--surface) 80%, transparent);
}

.section-title {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  font-size: 1.5rem;
  margin-bottom: var(--space-sm);
  text-align: center;
}

.section-title__icon {
  font-size: 1.5rem;
}

.section-subtitle {
  text-align: center;
  color: var(--text-muted);
  margin-bottom: var(--space-lg);
}

.biomes__grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: var(--space-sm);
}

.biome-card {
  position: relative;
  border-radius: 1rem;
  overflow: hidden;
  aspect-ratio: 3/4;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  border: 1px solid rgba(255,255,255,0.05);
  background: rgba(10,10,10,0.8);
}

.biome-card:hover {
  transform: translateY(-10px) scale(1.02);
  z-index: 10;
  box-shadow: 0 20px 40px rgba(0,0,0,0.4);
  border-color: var(--biome-color);
}

.biome-card__bg {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, transparent 0%, var(--biome-color) 100%);
  opacity: 0.3;
  transition: opacity 0.3s ease;
}

.biome-card:hover .biome-card__bg {
  opacity: 0.5;
}

.biome-card__content {
  position: relative;
  z-index: 2;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: var(--space-sm);
  background: linear-gradient(180deg, transparent 30%, rgba(0,0,0,0.9) 100%);
}

.biome-card__icon {
  font-size: 2.5rem;
  margin-bottom: var(--space-xs);
}

.biome-card__name {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--biome-color);
  margin-bottom: 0.25rem;
}

.biome-card__desc {
  font-size: 0.7rem;
  color: var(--text-muted);
  line-height: 1.5;
  margin-bottom: var(--space-xs);
}

.biome-card__creatures {
  display: flex;
  gap: 0.25rem;
  margin-bottom: var(--space-xs);
}

.biome-card__creature {
  font-size: 1.25rem;
}

.biome-card__stats {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.biome-stat {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.biome-stat__label {
  font-size: 0.6rem;
  color: var(--text-dark);
  width: 60px;
}

.biome-stat__bar {
  flex: 1;
  height: 4px;
  background: rgba(255,255,255,0.1);
  border-radius: 2px;
  overflow: hidden;
}

.biome-stat__fill {
  height: 100%;
  background: var(--biome-color);
  border-radius: 2px;
  transition: width 0.5s ease;
}

/* ============================================
   CREATURES SECTION
   ============================================ */
.creatures {
  padding: var(--space-xl) 0;
}

.creatures__carousel {
  display: flex;
  gap: var(--space-md);
  overflow-x: auto;
  padding: var(--space-sm) 0;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
}

.creatures__carousel::-webkit-scrollbar {
  height: 4px;
}

.creatures__carousel::-webkit-scrollbar-thumb {
  background: var(--primary);
  border-radius: 2px;
}

.creature-card {
  flex: 0 0 180px;
  scroll-snap-align: start;
  padding: var(--space-md);
  text-align: center;
  border-radius: 1rem;
  border: 1px solid var(--border);
  position: relative;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  background: rgba(10,10,10,0.6);
}

.creature-card:hover {
  transform: translateY(-8px) scale(1.02);
  border-color: var(--primary);
  box-shadow: 0 15px 30px rgba(0,0,0,0.3);
}

.creature-card__glow {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  opacity: 0.1;
  filter: blur(40px);
  transition: opacity 0.3s ease;
}

.creature-card:hover .creature-card__glow {
  opacity: 0.2;
}

.creature-card__icon {
  font-size: 3rem;
  margin-bottom: var(--space-xs);
  position: relative;
  z-index: 2;
}

.creature-card__name {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.85rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
  position: relative;
  z-index: 2;
}

.creature-card__type {
  font-size: 0.65rem;
  color: var(--text-dark);
  margin-bottom: var(--space-sm);
  position: relative;
  z-index: 2;
}

.creature-card__stats {
  display: flex;
  justify-content: center;
  gap: var(--space-sm);
  position: relative;
  z-index: 2;
}

.creature-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 0.7rem;
}

.creature-stat span:first-child {
  font-size: 1rem;
}

.creature-card__tek-badge {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.6rem;
  font-weight: 700;
  color: #9B59B6;
  background: rgba(155, 89, 182, 0.2);
  border: 1px solid rgba(155, 89, 182, 0.4);
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
}

.creature-card--tek {
  border-color: rgba(155, 89, 182, 0.4);
}

.creature-card--tek .creature-card__name {
  color: #9B59B6;
}

/* ============================================
   INTRO SECTION
   ============================================ */
.intro {
  padding: var(--space-xl) 0;
}

.intro__content {
  display: flex;
  align-items: center;
  gap: var(--space-lg);
  max-width: 1000px;
  margin: 0 auto;
  padding: var(--space-lg);
  border-radius: 1.5rem;
  border: 1px solid var(--border);
}

.intro__obelisk {
  flex-shrink: 0;
}

.obelisk {
  width: 60px;
  height: 150px;
  background: linear-gradient(180deg, var(--primary) 0%, transparent 100%);
  clip-path: polygon(50% 0%, 100% 100%, 0% 100%);
  position: relative;
  animation: obeliskPulse 3s ease-in-out infinite;
}

.obelisk::before {
  content: '';
  position: absolute;
  inset: 5px;
  background: var(--bg);
  clip-path: polygon(50% 0%, 100% 100%, 0% 100%);
}

.obelisk::after {
  content: '';
  position: absolute;
  top: 20%;
  left: 50%;
  transform: translateX(-50%);
  width: 10px;
  height: 10px;
  background: var(--primary);
  border-radius: 50%;
  box-shadow: 0 0 20px var(--primary), 0 0 40px var(--primary);
  animation: obeliskGlow 2s ease-in-out infinite;
}

@keyframes obeliskPulse {
  0%, 100% { filter: brightness(1); }
  50% { filter: brightness(1.2); }
}

@keyframes obeliskGlow {
  0%, 100% { opacity: 1; transform: translateX(-50%) scale(1); }
  50% { opacity: 0.5; transform: translateX(-50%) scale(1.5); }
}

.intro__text h2 {
  font-size: 1.5rem;
  margin-bottom: var(--space-sm);
  color: var(--primary);
}

.intro__lead {
  font-size: 1.1rem;
  line-height: 1.8;
  margin-bottom: var(--space-sm);
}

.intro__text p {
  color: var(--text-muted);
  line-height: 1.8;
}

.intro__text strong {
  color: var(--primary);
}

/* ============================================
   STATS SECTION
   ============================================ */
.stats {
  padding: var(--space-xl) 0;
  background: var(--surface);
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
}

.stats__grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-sm);
  margin-bottom: var(--space-lg);
}

.stat-card {
  padding: var(--space-md);
  text-align: center;
}

.stat-card__icon {
  font-size: 2rem;
  margin-bottom: var(--space-xs);
}

.stat-card__value {
  display: block;
  font-family: 'JetBrains Mono', monospace;
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--primary);
  margin-bottom: 0.25rem;
}

.stat-card__label {
  display: block;
  font-size: 0.8rem;
  color: var(--text-muted);
  margin-bottom: 0.25rem;
}

.stat-card__detail {
  font-size: 0.65rem;
  color: var(--text-dark);
}

.gauges-panel {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--space-lg);
  padding: var(--space-lg);
  border-radius: 1rem;
  border: 1px solid var(--border);
  background: var(--bg);
}

/* ============================================
   CHARTS SECTION
   ============================================ */
.charts {
  padding: var(--space-xl) 0;
}

.charts__subtitle {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.65rem;
  color: var(--text-dark);
  text-align: center;
  margin-bottom: var(--space-md);
}

.charts__grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-md);
}

.charts__callout {
  display: flex;
  align-items: flex-start;
  gap: var(--space-sm);
  margin-top: var(--space-md);
  padding: var(--space-sm) var(--space-md);
  border-radius: 0.75rem;
  border-left: 3px solid var(--primary);
}

.charts__callout-icon {
  font-size: 1.5rem;
  flex-shrink: 0;
}

.charts__callout-label {
  color: var(--primary);
  font-weight: 700;
  font-family: 'JetBrains Mono', monospace;
}

/* ============================================
   DAILY OPS SECTION
   ============================================ */
.daily-ops {
  padding: var(--space-xl) 0;
  background: linear-gradient(180deg, transparent, var(--surface) 10%, var(--surface) 90%, transparent);
}

.timeline {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
  max-width: 900px;
  margin: 0 auto;
}

.timeline__block {
  position: relative;
}

.timeline__header {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  margin-bottom: var(--space-sm);
}

.timeline__time {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--primary);
  background: var(--primary-soft);
  padding: 0.5rem 1rem;
  border-radius: 9999px;
}

.timeline__title {
  font-size: 1.1rem;
  font-weight: 700;
}

.timeline__content {
  padding: var(--space-md);
  border-radius: 1rem;
  border: 1px solid var(--border);
}

.timeline__content > p {
  color: var(--text-muted);
  margin-bottom: var(--space-md);
  line-height: 1.8;
}

.timeline__content h4 {
  font-size: 0.9rem;
  color: var(--primary);
  margin: var(--space-md) 0 var(--space-sm);
}

/* Task list */
.task-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.task {
  display: flex;
  gap: 1rem;
  padding: var(--space-sm);
  background: var(--bg);
  border-radius: 0.75rem;
  border: 1px solid var(--border);
}

.task__icon {
  font-size: 1.5rem;
  flex-shrink: 0;
}

.task__content strong {
  display: block;
  font-size: 0.9rem;
  margin-bottom: 0.25rem;
}

.task__content p {
  font-size: 0.8rem;
  color: var(--text-muted);
  line-height: 1.6;
  margin: 0;
}

/* Code block */
.code-block {
  margin: var(--space-sm) 0;
  border-radius: 0.75rem;
  overflow: hidden;
  border: 1px solid var(--border);
}

.code-block__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 1rem;
  background: var(--surface-light);
  border-bottom: 1px solid var(--border);
}

.code-block__file {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.75rem;
  color: var(--primary);
}

.code-block__label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.65rem;
  color: var(--text-dark);
}

.code-block__content {
  margin: 0;
  padding: 1rem;
  background: var(--bg);
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.75rem;
  line-height: 1.8;
  color: var(--text-muted);
  overflow-x: auto;
}

.code-block__content code {
  color: var(--text-main);
}

/* Mod cycle */
.mod-cycle {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-sm);
  margin-top: var(--space-sm);
}

.mod-step {
  text-align: center;
  padding: var(--space-sm);
  background: var(--bg);
  border-radius: 0.75rem;
  border: 1px solid var(--border);
}

.mod-step__num {
  display: block;
  font-family: 'JetBrains Mono', monospace;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--primary);
  opacity: 0.3;
}

.mod-step__label {
  display: block;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.7rem;
  font-weight: 700;
  color: var(--primary);
  margin-bottom: 0.25rem;
}

.mod-step p {
  font-size: 0.75rem;
  color: var(--text-muted);
  margin: 0;
}

/* Scenario */
.scenario {
  padding: var(--space-sm);
  border-radius: 0.75rem;
  border: 1px solid rgba(16, 185, 129, 0.3);
  margin: var(--space-sm) 0;
}

.scenario h4 {
  font-size: 0.85rem;
  color: var(--primary);
  margin: 0 0 0.5rem 0;
}

.scenario p {
  font-size: 0.85rem;
  color: var(--text-muted);
  line-height: 1.7;
  margin: 0;
}

/* ============================================
   EVENTS SECTION
   ============================================ */
.events {
  padding: var(--space-xl) 0;
}

.events__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-md);
}

.event-card {
  display: flex;
  gap: var(--space-md);
  padding: var(--space-md);
  border-radius: 1rem;
  border: 1px solid var(--border);
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  background: rgba(10,10,10,0.6);
}

.event-card:hover {
  border-color: var(--primary);
  transform: translateY(-8px);
  box-shadow: 0 15px 30px rgba(0,0,0,0.3), 0 0 0 1px rgba(16, 185, 129, 0.1);
}

.event-card__date {
  flex-shrink: 0;
  text-align: center;
  padding: var(--space-sm);
  background: var(--primary-soft);
  border-radius: 0.5rem;
  border: 1px solid rgba(16, 185, 129, 0.2);
}

.event-card__day {
  display: block;
  font-family: 'JetBrains Mono', monospace;
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--primary);
  line-height: 1;
}

.event-card__month {
  display: block;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.7rem;
  color: var(--primary);
}

.event-card__content h3 {
  font-size: 1rem;
  margin-bottom: 0.5rem;
}

.event-card__content p {
  font-size: 0.8rem;
  color: var(--text-muted);
  line-height: 1.6;
  margin-bottom: var(--space-xs);
}

.event-card__tags {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.event-card__tags span {
  font-size: 0.65rem;
  color: var(--text-dark);
  background: rgba(255,255,255,0.05);
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
}

/* ============================================
   SECURITY SECTION
   ============================================ */
.security {
  padding: var(--space-xl) 0;
  background: var(--surface);
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
}

.security__grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-md);
}

.security-card {
  padding: var(--space-md);
}

.security-card h3 {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1rem;
  margin-bottom: var(--space-sm);
}

.security-card__icon {
  font-size: 1.25rem;
}

.security-card ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.security-card li {
  font-size: 0.85rem;
  color: var(--text-muted);
  padding: 0.5rem 0;
  border-bottom: 1px solid var(--border);
}

.security-card li:last-child {
  border-bottom: none;
}

.security-card li strong {
  color: var(--text-main);
}

/* ============================================
   SKILLS SECTION
   ============================================ */
.skills {
  padding: var(--space-xl) 0;
}

.skills__intro {
  max-width: 700px;
  margin: 0 auto var(--space-lg);
  text-align: center;
  font-size: 1rem;
  color: var(--text-muted);
  line-height: 1.8;
}

.skills__intro strong {
  color: var(--primary);
}

.skills__grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-md);
}

.skill-card {
  padding: var(--space-md);
  text-align: center;
}

.skill-card__icon {
  font-size: 2rem;
  margin-bottom: var(--space-sm);
}

.skill-card h3 {
  font-size: 0.9rem;
  margin-bottom: var(--space-sm);
}

.skill-card ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.skill-card li {
  font-size: 0.75rem;
  color: var(--text-muted);
  padding: 0.25rem 0;
}

/* ============================================
   CTA SECTION
   ============================================ */
.cta-section {
  padding: var(--space-xl) 0;
}

.cta-box {
  position: relative;
  text-align: center;
  padding: var(--space-xl) var(--space-lg);
  border-radius: 1.5rem;
  border: 1px solid rgba(16, 185, 129, 0.2);
  max-width: 700px;
  margin: 0 auto;
  overflow: hidden;
}

.cta-box__dinos {
  position: absolute;
  top: 1rem;
  left: 50%;
  transform: translateX(-50%);
  font-size: 3rem;
  opacity: 0.1;
  display: flex;
  gap: 1rem;
}

.cta-box__title {
  font-size: 1.75rem;
  margin-bottom: var(--space-sm);
}

.cta-box__desc {
  color: var(--text-muted);
  font-size: 1rem;
  margin-bottom: var(--space-md);
  line-height: 1.8;
}

/* ============================================
   SCROLL REVEAL ANIMATIONS
   ============================================ */
.reveal {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), 
              transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

.reveal.revealed {
  opacity: 1;
  transform: translateY(0);
}

/* Prefers Reduced Motion */
@media (prefers-reduced-motion: reduce) {
  .reveal {
    opacity: 1;
    transform: none;
    transition: none;
  }
  
  .ark-particle {
    animation: none;
    opacity: 0.3;
  }
  
  .silhouette--rex,
  .silhouette--bronto,
  .silhouette--ptera {
    animation: none;
  }
  
  .ark-ambient__stars {
    animation: none;
  }
  
  .obelisk,
  .obelisk::after {
    animation: none;
  }
  
  .hero__scroll {
    animation: none;
  }
  
  .biome-card,
  .creature-card,
  .event-card,
  .badge {
    transition: none;
  }
}

/* ============================================
   RESPONSIVE
   ============================================ */
@media (max-width: 1200px) {
  .biomes__grid {
    grid-template-columns: repeat(3, 1fr);
  }
  
  .biomes__grid .biome-card:nth-child(4),
  .biomes__grid .biome-card:nth-child(5) {
    grid-column: span 1;
  }
}

@media (max-width: 1024px) {
  .skills__grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .events__grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .hero__quickstats {
    flex-wrap: wrap;
    justify-content: center;
    border-radius: 1rem;
  }
  
  .quickstat__divider {
    display: none;
  }
  
  .biomes__grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .stats__grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .charts__grid {
    grid-template-columns: 1fr;
  }
  
  .security__grid {
    grid-template-columns: 1fr;
  }
  
  .mod-cycle {
    grid-template-columns: 1fr;
  }
  
  .skills__grid {
    grid-template-columns: 1fr;
  }
  
  .intro__content {
    flex-direction: column;
    text-align: center;
  }
  
  .gauges-panel {
    gap: var(--space-md);
  }
}

@media (max-width: 480px) {
  .biomes__grid {
    grid-template-columns: 1fr;
  }
  
  .hero__title {
    font-size: 3rem;
  }
  
  .creature-card {
    flex: 0 0 150px;
  }
}
</style>
