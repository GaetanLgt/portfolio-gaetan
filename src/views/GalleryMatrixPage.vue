<template>
  <div class="gallery-matrix" ref="container">
    <!-- CODE RAIN BACKGROUND -->
    <canvas ref="rainCanvas" class="rain-canvas"></canvas>
    
    <!-- SCAN LINE OVERLAY -->
    <div class="scanlines"></div>
    
    <!-- HEADER -->
    <header class="gallery-header">
      <div class="header-content">
        <div class="header-tag">
          <span class="tag-bracket">[</span>
          <span class="tag-text">GALERIE</span>
          <span class="tag-bracket">]</span>
        </div>
        <h1 class="header-title">
          <span class="title-line">CRÉATIONS</span>
          <span class="title-accent">NUMÉRIQUES</span>
        </h1>
        <p class="header-desc">
          Exploration visuelle à travers les univers. Designs, interfaces, branding et expérimentations génératives.
        </p>
        
        <!-- STATS -->
        <div class="header-stats">
          <div class="stat">
            <span class="stat-value">{{ filteredItems.length }}</span>
            <span class="stat-label">Œuvres</span>
          </div>
          <div class="stat">
            <span class="stat-value">{{ categories.length }}</span>
            <span class="stat-label">Catégories</span>
          </div>
          <div class="stat">
            <span class="stat-value">{{ universes.length }}</span>
            <span class="stat-label">Univers</span>
          </div>
        </div>
      </div>
      
      <!-- FILTERS -->
      <div class="filters">
        <button 
          v-for="cat in ['all', ...categories]" 
          :key="cat"
          class="filter-btn"
          :class="{ active: activeFilter === cat }"
          @click="activeFilter = cat"
        >
          <span class="filter-icon">{{ getCategoryIcon(cat) }}</span>
          <span class="filter-text">{{ cat === 'all' ? 'Tout' : cat }}</span>
        </button>
      </div>
    </header>

    <!-- GRID -->
    <main class="gallery-grid">
      <TransitionGroup name="grid" tag="div" class="grid-container">
        <article 
          v-for="(item, index) in filteredItems" 
          :key="item.id"
          class="gallery-item"
          :class="[`size-${item.size || 'normal'}`, { featured: item.featured }]"
          :style="{ '--delay': index * 0.05 + 's', '--accent': item.color }"
          @click="openLightbox(item)"
        >
          <!-- CANVAS PREVIEW -->
          <canvas 
            :ref="el => itemCanvases[item.id] = el" 
            class="item-canvas"
          ></canvas>
          
          <!-- OVERLAY -->
          <div class="item-overlay">
            <!-- SCAN EFFECT -->
            <div class="scan-line"></div>
            
            <!-- CORNER BRACKETS -->
            <div class="corner tl"></div>
            <div class="corner tr"></div>
            <div class="corner bl"></div>
            <div class="corner br"></div>
            
            <!-- INFO -->
            <div class="item-info">
              <span class="item-category">{{ item.category }}</span>
              <h3 class="item-title">{{ item.title }}</h3>
              <p class="item-desc">{{ item.desc }}</p>
              <div class="item-tags">
                <span v-for="tag in item.tags" :key="tag" class="item-tag">{{ tag }}</span>
              </div>
            </div>
            
            <!-- VIEW BUTTON -->
            <button class="view-btn">
              <span class="btn-icon">◉</span>
              <span class="btn-text">VOIR</span>
            </button>
          </div>
          
          <!-- GLITCH LAYER -->
          <div class="glitch-layer"></div>
        </article>
      </TransitionGroup>
    </main>

    <!-- LIGHTBOX -->
    <Transition name="lightbox">
      <div v-if="lightboxItem" class="lightbox" @click.self="closeLightbox">
        <div class="lightbox-container">
          <!-- CLOSE -->
          <button class="lightbox-close" @click="closeLightbox">
            <span>[</span>ESC<span>]</span>
          </button>
          
          <!-- CONTENT -->
          <div class="lightbox-content">
            <!-- CANVAS -->
            <div class="lightbox-visual">
              <canvas ref="lightboxCanvas" class="lightbox-canvas"></canvas>
              <div class="visual-frame">
                <div class="frame-corner tl"></div>
                <div class="frame-corner tr"></div>
                <div class="frame-corner bl"></div>
                <div class="frame-corner br"></div>
              </div>
            </div>
            
            <!-- INFO PANEL -->
            <div class="lightbox-info">
              <div class="info-header">
                <span class="info-id">{{ String(lightboxItem.id).padStart(3, '0') }}</span>
                <span class="info-category" :style="{ color: lightboxItem.color }">{{ lightboxItem.category }}</span>
              </div>
              
              <h2 class="info-title">{{ lightboxItem.title }}</h2>
              <p class="info-desc">{{ lightboxItem.description || lightboxItem.desc }}</p>
              
              <!-- META -->
              <div class="info-meta">
                <div class="meta-item" v-if="lightboxItem.universe">
                  <span class="meta-label">Univers</span>
                  <span class="meta-value">{{ lightboxItem.universe }}</span>
                </div>
                <div class="meta-item" v-if="lightboxItem.tech">
                  <span class="meta-label">Technologies</span>
                  <span class="meta-value">{{ lightboxItem.tech }}</span>
                </div>
                <div class="meta-item">
                  <span class="meta-label">Année</span>
                  <span class="meta-value">{{ lightboxItem.year || '2024' }}</span>
                </div>
              </div>
              
              <!-- TAGS -->
              <div class="info-tags">
                <span v-for="tag in lightboxItem.tags" :key="tag" class="info-tag">{{ tag }}</span>
              </div>
              
              <!-- ACTIONS -->
              <div class="info-actions" v-if="lightboxItem.link">
                <a :href="lightboxItem.link" target="_blank" class="action-btn primary">
                  <span>Voir le projet</span>
                  <span class="btn-arrow">→</span>
                </a>
              </div>
            </div>
          </div>
          
          <!-- NAV -->
          <div class="lightbox-nav">
            <button class="nav-btn prev" @click="prevItem" :disabled="currentIndex === 0">
              <span>◀</span> PREV
            </button>
            <span class="nav-counter">{{ currentIndex + 1 }} / {{ filteredItems.length }}</span>
            <button class="nav-btn next" @click="nextItem" :disabled="currentIndex === filteredItems.length - 1">
              NEXT <span>▶</span>
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- FOOTER -->
    <footer class="gallery-footer">
      <div class="footer-content">
        <span class="footer-text">GL DIGITAL LAB // GALERIE CRÉATIONS</span>
        <span class="footer-year">2024-2026</span>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'

// ============================================================================
// STATE
// ============================================================================
const container = ref(null)
const rainCanvas = ref(null)
const lightboxCanvas = ref(null)
const itemCanvases = reactive({})

const activeFilter = ref('all')
const lightboxItem = ref(null)
const currentIndex = ref(0)

let animationId = null
let t = 0

// Cache des images chargées
const loadedImages = reactive({})

// Charger les images des items qui en ont
const loadItemImages = () => {
  galleryItems.forEach(item => {
    if (item.image && !loadedImages[item.id]) {
      const img = new Image()
      img.onload = () => {
        loadedImages[item.id] = img
      }
      img.onerror = () => {
        console.warn(`Failed to load image for ${item.title}`)
        loadedImages[item.id] = null
      }
      img.src = item.image
    }
  })
}

// ============================================================================
// DATA - Tes créations
// ============================================================================
const galleryItems = reactive([
  // ========================================================================
  // UNIVERS MULTIVERS - 21 univers
  // ========================================================================
  {
    id: 1,
    title: 'Matrix Code Rain',
    desc: 'Animation générative du code qui tombe',
    description: 'Recréation fidèle de l\'effet iconique de la pluie de code Matrix. Animation Canvas en temps réel avec caractères japonais et variations de vitesse/opacité.',
    category: 'Univers',
    universe: 'Matrix',
    tags: ['Canvas', 'Génératif', 'Animation'],
    color: '#00ff41',
    effect: 'matrixRain',
    size: 'large',
    featured: true,
    tech: 'JavaScript, Canvas 2D',
    year: '2024',
    link: '/matrix'
  },
  {
    id: 101,
    title: 'Matrix Resurrections',
    desc: 'Retour dans la Matrice',
    description: 'Page univers Matrix 4 avec effets de glitch, dualité rouge/bleu et références au nouveau chapitre.',
    category: 'Univers',
    universe: 'Matrix',
    tags: ['Glitch', 'Dualité', 'Néo-Matrix'],
    color: '#ff0044',
    effect: 'matrixGlitch',
    tech: 'Vue.js, CSS Animations',
    year: '2024',
    link: '/matrix-resurrections'
  },
  {
    id: 2,
    title: 'Tron Light Grid',
    desc: 'Grille néon perspective infinie',
    description: 'Grille cybernétique inspirée de TRON Legacy. Effet de profondeur avec lignes lumineuses et animations de pulse.',
    category: 'Univers',
    universe: 'TRON',
    tags: ['Three.js', 'Néon', '3D'],
    color: '#00d4ff',
    effect: 'tronGrid',
    size: 'normal',
    tech: 'Three.js, WebGL',
    year: '2024',
    link: '/tron'
  },
  {
    id: 102,
    title: 'Light Cycle Trail',
    desc: 'Traces lumineuses des motos',
    description: 'Animation des light cycles de TRON avec traînées néon persistantes et effet de vitesse.',
    category: 'Univers',
    universe: 'TRON',
    tags: ['Animation', 'Véhicules', 'Néon'],
    color: '#ff6600',
    effect: 'lightCycle',
    tech: 'Canvas 2D',
    year: '2024',
    link: '/tron'
  },
  {
    id: 3,
    title: 'Blade Runner City',
    desc: 'Skyline cyberpunk sous la pluie',
    description: 'Panorama nocturne de Los Angeles 2049. Buildings néon, pluie synthétique et atmosphère dystopique.',
    category: 'Univers',
    universe: 'Blade Runner',
    tags: ['Concept Art', 'Atmosphère', 'Néon'],
    color: '#ff6b35',
    effect: 'bladeCity',
    size: 'wide',
    tech: 'Canvas 2D, Génératif',
    year: '2024',
    link: '/blade-runner'
  },
  {
    id: 103,
    title: 'Voight-Kampff Test',
    desc: 'Interface de test empathie',
    description: 'Reproduction de l\'interface du test Voight-Kampff avec scan oculaire et détection émotionnelle.',
    category: 'Univers',
    universe: 'Blade Runner',
    tags: ['Interface', 'Rétro-futur', 'Analyse'],
    color: '#00a8cc',
    effect: 'voightKampff',
    tech: 'Vue.js, Canvas',
    year: '2024',
    link: '/blade-runner'
  },
  {
    id: 4,
    title: 'Ghost Shell Interface',
    desc: 'Interface neurale cyberpunk',
    description: 'UI inspirée de Ghost in the Shell. Données holographiques, scans biométriques et esthétique cyber-japonaise.',
    category: 'Univers',
    universe: 'Ghost in the Shell',
    tags: ['UI', 'HUD', 'Cyber'],
    color: '#e91e63',
    effect: 'ghostUI',
    size: 'normal',
    tech: 'Vue.js, CSS',
    year: '2024',
    link: '/ghost-in-the-shell'
  },
  {
    id: 104,
    title: 'Tachikoma Network',
    desc: 'Réseau de tanks pensants',
    description: 'Visualisation du réseau de communication entre Tachikomas avec partage de données et personnalités.',
    category: 'Univers',
    universe: 'Ghost in the Shell',
    tags: ['Réseau', 'IA', 'Mecha'],
    color: '#00bcd4',
    effect: 'tachikomaNet',
    tech: 'Canvas 2D, Nodes',
    year: '2024',
    link: '/ghost-in-the-shell'
  },
  {
    id: 5,
    title: 'Inception Dream Layers',
    desc: 'Visualisation des niveaux de rêve',
    description: 'Représentation abstraite des couches de rêves emboîtés. Géométrie impossible et distorsions temporelles.',
    category: 'Univers',
    universe: 'Inception',
    tags: ['Abstrait', 'Géométrie', 'Surréaliste'],
    color: '#ffd700',
    effect: 'inceptionLayers',
    size: 'normal',
    tech: 'Canvas 2D',
    year: '2024',
    link: '/inception'
  },
  {
    id: 105,
    title: 'Spinning Totem',
    desc: 'La toupie qui ne tombe jamais',
    description: 'Animation hypnotique de la toupie d\'Inception. Rotation infinie avec reflets métalliques.',
    category: 'Univers',
    universe: 'Inception',
    tags: ['3D', 'Rotation', 'Symbolique'],
    color: '#c0c0c0',
    effect: 'spinningTotem',
    tech: 'Three.js',
    year: '2024',
    link: '/inception'
  },
  {
    id: 106,
    title: 'Minority Report UI',
    desc: 'Interface gestuelle précognition',
    description: 'Reproduction de l\'interface gestuelle du film. Manipulation de données 3D avec les mains.',
    category: 'Univers',
    universe: 'Minority Report',
    tags: ['Gestuel', 'Futuriste', 'Hologramme'],
    color: '#4fc3f7',
    effect: 'minorityUI',
    size: 'wide',
    tech: 'Three.js, Gestures',
    year: '2024',
    link: '/minority-report'
  },
  {
    id: 107,
    title: 'V Mask Revolution',
    desc: 'Masque iconique Anonymous',
    description: 'Animation du masque de Guy Fawkes avec effets de particules et citations révolutionnaires.',
    category: 'Univers',
    universe: 'V pour Vendetta',
    tags: ['Symbolique', 'Révolution', 'Particules'],
    color: '#ff0000',
    effect: 'vMask',
    tech: 'Canvas 2D, Particles',
    year: '2024',
    link: '/v-for-vendetta'
  },
  {
    id: 108,
    title: 'Deadpool 4th Wall',
    desc: 'Il te regarde. Oui, TOI.',
    description: 'Animation interactive où Deadpool brise le quatrième mur et commente tes actions.',
    category: 'Univers',
    universe: 'Deadpool',
    tags: ['Humour', 'Interactif', 'Meta'],
    color: '#ff0033',
    effect: 'deadpool4thWall',
    featured: true,
    tech: 'Vue.js, Easter Eggs',
    year: '2024',
    link: '/deadpool'
  },
  {
    id: 109,
    title: 'The Mask SMOKIN',
    desc: 'Transformation cartoon explosive',
    description: 'Effet de transformation style cartoon avec couleurs vives et physique impossible.',
    category: 'Univers',
    universe: 'The Mask',
    tags: ['Cartoon', 'Transformation', 'Fun'],
    color: '#00ff00',
    effect: 'maskTransform',
    tech: 'Canvas 2D, Squash & Stretch',
    year: '2024',
    link: '/the-mask'
  },
  {
    id: 110,
    title: 'Iron Man HUD',
    desc: 'Interface casque Mark LXXXV',
    description: 'HUD holographique du casque Iron Man avec diagnostics, radar et assistant JARVIS.',
    category: 'Univers',
    universe: 'Iron Man',
    tags: ['HUD', 'Tech', 'Hologramme'],
    color: '#ff4444',
    effect: 'ironManHUD',
    size: 'large',
    tech: 'Three.js, WebGL',
    year: '2024',
    link: '/iron-man'
  },
  {
    id: 111,
    title: 'Dragon Ball Power Level',
    desc: 'Scouter et aura Ki',
    description: 'Interface scouter avec lecture de puissance et effet d\'aura énergétique dynamique.',
    category: 'Univers',
    universe: 'Dragon Ball',
    tags: ['Anime', 'Énergie', 'Combat'],
    color: '#ffcc00',
    effect: 'dbzPower',
    tech: 'Canvas 2D, Particles',
    year: '2024',
    link: '/dragon-ball'
  },
  {
    id: 112,
    title: 'Ready Player One OASIS',
    desc: 'Portail vers le metaverse',
    description: 'Interface de connexion à l\'OASIS avec sélection d\'avatar et zones de jeu.',
    category: 'Univers',
    universe: 'Ready Player One',
    tags: ['Metaverse', 'Gaming', 'VR'],
    color: '#00ffcc',
    effect: 'oasisPortal',
    size: 'wide',
    tech: 'Three.js, VR Ready',
    year: '2024',
    link: '/ready-player-one'
  },
  {
    id: 113,
    title: 'Asimov Foundation',
    desc: 'Psychohistoire visualisée',
    description: 'Représentation des équations de psychohistoire avec prédictions galactiques.',
    category: 'Univers',
    universe: 'Asimov',
    tags: ['Sci-Fi', 'Math', 'Galaxie'],
    color: '#8b5cf6',
    effect: 'foundationMath',
    tech: 'Canvas 2D, Algorithms',
    year: '2024',
    link: '/asimov'
  },
  {
    id: 114,
    title: 'Cloud Atlas Connections',
    desc: 'Âmes liées à travers le temps',
    description: 'Visualisation des connexions entre personnages à travers les différentes époques.',
    category: 'Univers',
    universe: 'Cloud Atlas',
    tags: ['Connexions', 'Temps', 'Destins'],
    color: '#14b8a6',
    effect: 'cloudAtlasWeb',
    tech: 'D3.js, Nodes',
    year: '2024',
    link: '/cloud-atlas'
  },
  {
    id: 115,
    title: 'Alice Turing Wonderland',
    desc: 'Logique au pays des merveilles',
    description: 'Fusion surréaliste entre Alice et les concepts de Turing. Portes logiques et lapins binaires.',
    category: 'Univers',
    universe: 'Alice & Turing',
    tags: ['Surréaliste', 'Logique', 'Whimsical'],
    color: '#ff69b4',
    effect: 'aliceTuring',
    tech: 'Canvas 2D, Animations',
    year: '2024',
    link: '/alice-turing'
  },
  {
    id: 116,
    title: 'Ghibli GL Spirit',
    desc: 'Esprit nature et technologie',
    description: 'Fusion de l\'esthétique Ghibli avec le monde digital. Sprites forestiers et code naturel.',
    category: 'Univers',
    universe: 'GL Spirit',
    tags: ['Ghibli', 'Nature', 'Poétique'],
    color: '#4ade80',
    effect: 'ghibliSpirit',
    tech: 'Canvas 2D, Watercolor',
    year: '2024',
    link: '/gl-spirit'
  },
  {
    id: 117,
    title: 'Jardin de Mam\'',
    desc: 'Hommage floral digital',
    description: 'Jardin génératif en hommage. Fleurs qui poussent et papillons qui dansent.',
    category: 'Univers',
    universe: 'Jardin de Mam\'',
    tags: ['Hommage', 'Fleurs', 'Poétique'],
    color: '#f472b6',
    effect: 'gardenMam',
    tech: 'Canvas 2D, Génératif',
    year: '2024',
    link: '/jardin-mam'
  },
  {
    id: 118,
    title: 'Samus Elements',
    desc: 'Power Suit et éléments',
    description: 'Visualisation des pouvoirs élémentaires de Samus avec effets de particules.',
    category: 'Univers',
    universe: 'Samus',
    tags: ['Metroid', 'Éléments', 'Gaming'],
    color: '#f97316',
    effect: 'samusElements',
    tech: 'Canvas 2D, Particles',
    year: '2024',
    link: '/samus-elements'
  },
  {
    id: 119,
    title: 'Jupiter Ascending Throne',
    desc: 'Héritage cosmique royal',
    description: 'Visualisation du trône intergalactique avec effets spatiaux et royauté cosmique.',
    category: 'Univers',
    universe: 'Jupiter Ascending',
    tags: ['Space Opera', 'Royauté', 'Cosmos'],
    color: '#a855f7',
    effect: 'jupiterThrone',
    tech: 'Three.js, Particles',
    year: '2024',
    link: '/jupiter-ascending'
  },
  {
    id: 120,
    title: 'Howard Duck Portal',
    desc: 'Dimension improbable',
    description: 'Portail dimensionnel absurde avec effet de distorsion humoristique.',
    category: 'Univers',
    universe: 'Howard the Duck',
    tags: ['Absurde', 'Portail', 'Humour'],
    color: '#eab308',
    effect: 'howardPortal',
    tech: 'Canvas 2D, Distortion',
    year: '2024',
    link: '/howard-duck'
  },
  
  // ========================================================================
  // UI/UX - Interfaces
  // ========================================================================
  {
    id: 6,
    title: 'Dashboard GL Tower',
    desc: 'Interface admin style terminal',
    description: 'Dashboard administrateur avec esthétique Matrix. Stats temps réel, graphiques animés et navigation par commandes.',
    category: 'UI/UX',
    tags: ['Dashboard', 'Admin', 'Terminal'],
    color: '#00ff41',
    effect: 'dashboardUI',
    size: 'large',
    featured: true,
    tech: 'Vue.js, Recharts',
    year: '2024',
    link: '/gl-tower'
  },
  {
    id: 7,
    title: 'Command Palette',
    desc: 'Navigation Ctrl+K style VSCode',
    description: 'Palette de commandes universelle. Recherche fuzzy, raccourcis clavier et navigation rapide.',
    category: 'UI/UX',
    tags: ['Navigation', 'Accessibilité', 'Productivité'],
    color: '#8b5cf6',
    effect: 'commandPalette',
    size: 'normal',
    tech: 'Vue.js, Fuse.js',
    year: '2024'
  },
  {
    id: 8,
    title: 'Cookie Banner RGPD',
    desc: 'Consentement conforme et élégant',
    description: 'Banner de consentement RGPD avec design minimal. Granularité des choix et persistance des préférences.',
    category: 'UI/UX',
    tags: ['RGPD', 'Legal', 'UX'],
    color: '#14b8a6',
    effect: 'cookieBanner',
    size: 'normal',
    tech: 'Vue.js, LocalStorage',
    year: '2024'
  },
  {
    id: 201,
    title: 'Terminal Hacker',
    desc: 'Interface ligne de commande',
    description: 'Terminal interactif avec commandes personnalisées, easter eggs et navigation du portfolio.',
    category: 'UI/UX',
    tags: ['Terminal', 'CLI', 'Hacker'],
    color: '#00ff41',
    effect: 'terminalUI',
    tech: 'Vue.js, Custom Parser',
    year: '2024',
    link: '/arcade/terminal'
  },
  {
    id: 202,
    title: 'Cards Holographiques',
    desc: 'Collection de projets 3D',
    description: 'Cartes de projets avec effet holographique, rotation 3D et reflets dynamiques.',
    category: 'UI/UX',
    tags: ['Cards', '3D', 'Hologramme'],
    color: '#00d4ff',
    effect: 'holoCards',
    size: 'wide',
    tech: 'CSS 3D, Vanilla JS',
    year: '2024',
    link: '/arcade/cards'
  },
  {
    id: 203,
    title: 'Memory Game UI',
    desc: 'Jeu de mémoire portfolio',
    description: 'Interface de jeu de mémoire avec animations de flip et système de score.',
    category: 'UI/UX',
    tags: ['Gaming', 'Animation', 'Ludique'],
    color: '#e91e63',
    effect: 'memoryGame',
    tech: 'Vue.js, CSS Flip',
    year: '2024',
    link: '/arcade/memory'
  },
  {
    id: 204,
    title: 'Slot Machine Tech',
    desc: 'Machine à sous de technologies',
    description: 'Machine à sous thématique avec rouleaux de technologies et combinaisons gagnantes.',
    category: 'UI/UX',
    tags: ['Gaming', 'Fun', 'Aléatoire'],
    color: '#ffd700',
    effect: 'slotMachine',
    tech: 'Vue.js, Animations',
    year: '2024',
    link: '/arcade/slots'
  },
  {
    id: 205,
    title: 'Agents Bureau',
    desc: 'Hub des agents IA',
    description: 'Interface de gestion des 7 agents IA avec profils, statuts et interactions.',
    category: 'UI/UX',
    tags: ['Agents', 'IA', 'Dashboard'],
    color: '#ff4444',
    effect: 'agentsHub',
    size: 'large',
    tech: 'Vue.js, WebSocket',
    year: '2024',
    link: '/agents'
  },
  
  // ========================================================================
  // BRANDING - Identités visuelles
  // ========================================================================
  {
    id: 9,
    title: 'Logo GL Digital Lab',
    desc: 'Identité visuelle principale',
    description: 'Logo minimaliste représentant l\'architecture digitale. Formes géométriques et couleurs néon sur fond sombre.',
    category: 'Branding',
    tags: ['Logo', 'Identité', 'Minimal'],
    color: '#00ff41',
    effect: 'logoGL',
    size: 'normal',
    tech: 'Figma, SVG',
    year: '2024'
  },
  {
    id: 10,
    title: 'Logo ARKADIA',
    desc: 'Branding communauté gaming',
    description: 'Identité visuelle pour le cluster ARK Survival Ascended. Design tricolore (glace/feu/nature) représentant les éléments du jeu, avec griffes de dinosaure stylisées.',
    category: 'Branding',
    universe: 'ARKADIA',
    tags: ['Gaming', 'Communauté', 'Logo'],
    color: '#7bc043',
    effect: 'logoArkadia',
    image: '/logos/LogoARKADIA-no-bg.png',
    size: 'normal',
    tech: 'Illustrator, SVG',
    year: '2024',
    link: '/arkadia'
  },
  {
    id: 11,
    title: 'Palette Multivers',
    desc: 'Système de couleurs par univers',
    description: 'Charte graphique complète avec 20 palettes thématiques. Chaque univers a son identité colorimétrique unique.',
    category: 'Branding',
    tags: ['Couleurs', 'Design System', 'Thèmes'],
    color: '#ff00ff',
    effect: 'colorPalette',
    size: 'wide',
    tech: 'CSS Variables',
    year: '2024'
  },
  {
    id: 301,
    title: 'Icons Agents IA',
    desc: '7 icônes pour 7 agents',
    description: 'Set d\'icônes personnalisées pour chaque agent IA : JARVIS, EDITH, ULTRON, FRIDAY, VISION, VERONICA, PEPPER.',
    category: 'Branding',
    tags: ['Icônes', 'IA', 'Système'],
    color: '#ff4444',
    effect: 'agentIcons',
    tech: 'SVG, Illustrator',
    year: '2024'
  },
  {
    id: 302,
    title: 'Typography System',
    desc: 'Hiérarchie typographique',
    description: 'Système typographique complet avec JetBrains Mono, Space Grotesk et Playfair Display.',
    category: 'Branding',
    tags: ['Typo', 'Design System', 'Fonts'],
    color: '#ffffff',
    effect: 'typoSystem',
    tech: 'CSS, Variable Fonts',
    year: '2024'
  },
  {
    id: 303,
    title: 'Loading Animations',
    desc: 'Collection de loaders',
    description: 'Bibliothèque de 12 animations de chargement thématiques : Matrix, Tron, Glitch, etc.',
    category: 'Branding',
    tags: ['Animation', 'Loader', 'Micro-interaction'],
    color: '#00ff41',
    effect: 'loadingAnims',
    size: 'wide',
    tech: 'CSS, SVG Animations',
    year: '2024'
  },
  
  // ========================================================================
  // 3D - Expériences immersives
  // ========================================================================
  {
    id: 12,
    title: 'Construct 3D Hub',
    desc: 'Espace admin Matrix immersif',
    description: 'Hub administrateur navigable en 3D. Nodes système connectés, déplacement libre et interactions.',
    category: '3D',
    universe: 'Matrix',
    tags: ['Three.js', 'Navigation', 'Immersif'],
    color: '#00ff41',
    effect: 'construct3D',
    size: 'large',
    featured: true,
    tech: 'Three.js, PointerLock',
    year: '2024',
    link: '/construct'
  },
  {
    id: 13,
    title: 'Particles Background',
    desc: 'Fond animé particules réactives',
    description: 'Système de particules interactif. Réagit au mouvement de la souris avec connexions dynamiques.',
    category: '3D',
    tags: ['Particules', 'Interactif', 'Background'],
    color: '#00d4ff',
    effect: 'particles3D',
    size: 'normal',
    tech: 'Three.js, WebGL',
    year: '2024'
  },
  {
    id: 14,
    title: 'Grid Holographique',
    desc: 'Sol néon perspective',
    description: 'Grille de sol animée style Tron. Lignes lumineuses avec effet de scan et profondeur infinie.',
    category: '3D',
    tags: ['Grid', 'Hologramme', 'Ambiance'],
    color: '#00ffff',
    effect: 'holoGrid',
    size: 'normal',
    tech: 'Three.js, Shaders',
    year: '2024'
  },
  {
    id: 401,
    title: 'Galaxy Spiral',
    desc: 'Galaxie spirale interactive',
    description: 'Visualisation 3D d\'une galaxie avec millions d\'étoiles et navigation spatiale.',
    category: '3D',
    tags: ['Space', 'Particules', 'Navigation'],
    color: '#8b5cf6',
    effect: 'galaxySpiral',
    size: 'large',
    tech: 'Three.js, GPU Particles',
    year: '2024'
  },
  {
    id: 402,
    title: 'Cube Tesseract',
    desc: 'Hypercube 4D projeté',
    description: 'Visualisation d\'un tesseract (hypercube 4D) avec rotation sur plusieurs axes.',
    category: '3D',
    tags: ['Math', '4D', 'Géométrie'],
    color: '#ffd700',
    effect: 'tesseract',
    tech: 'Three.js, Math',
    year: '2024'
  },
  {
    id: 403,
    title: 'Terrain Procedural',
    desc: 'Paysage généré en temps réel',
    description: 'Terrain infini généré procéduralement avec Perlin noise et biomes dynamiques.',
    category: '3D',
    tags: ['Procédural', 'Terrain', 'Génératif'],
    color: '#22c55e',
    effect: 'proceduralTerrain',
    size: 'wide',
    tech: 'Three.js, Noise',
    year: '2024'
  },
  
  // ========================================================================
  // GÉNÉRATIF - Art algorithmique
  // ========================================================================
  {
    id: 15,
    title: 'Neural Network Viz',
    desc: 'Visualisation réseau de neurones',
    description: 'Représentation animée d\'un réseau neuronal. Nodes connectés avec propagation de signaux.',
    category: 'Génératif',
    tags: ['IA', 'Data Viz', 'Animation'],
    color: '#8b5cf6',
    effect: 'neuralViz',
    size: 'normal',
    tech: 'Canvas 2D, Math',
    year: '2024'
  },
  {
    id: 16,
    title: 'Flow Field Art',
    desc: 'Champ de vecteurs artistique',
    description: 'Art génératif basé sur les champs de flux. Particules suivant des courbes mathématiques.',
    category: 'Génératif',
    tags: ['Flow Field', 'Particules', 'Math'],
    color: '#ff6b35',
    effect: 'flowField',
    size: 'wide',
    tech: 'Canvas 2D, Perlin Noise',
    year: '2024'
  },
  {
    id: 17,
    title: 'Glitch Typography',
    desc: 'Texte avec effet glitch',
    description: 'Animation typographique style corruption digitale. RGB shift, noise et distorsions.',
    category: 'Génératif',
    tags: ['Typo', 'Glitch', 'Animation'],
    color: '#ff0000',
    effect: 'glitchText',
    size: 'normal',
    tech: 'CSS, JavaScript',
    year: '2024'
  },
  {
    id: 18,
    title: 'Audio Visualizer',
    desc: 'Visualisation audio réactive',
    description: 'Barres et formes réactives au son. Fréquences analysées en temps réel.',
    category: 'Génératif',
    tags: ['Audio', 'WebAudio', 'Réactif'],
    color: '#e91e63',
    effect: 'audioViz',
    size: 'normal',
    tech: 'Web Audio API, Canvas',
    year: '2024'
  },
  {
    id: 501,
    title: 'Mandelbrot Zoom',
    desc: 'Fractale infinie interactive',
    description: 'Exploration infinie de l\'ensemble de Mandelbrot avec zoom continu et palette de couleurs.',
    category: 'Génératif',
    tags: ['Fractale', 'Math', 'Infini'],
    color: '#00ffff',
    effect: 'mandelbrot',
    size: 'large',
    tech: 'WebGL, Shaders',
    year: '2024'
  },
  {
    id: 502,
    title: 'Conway Game of Life',
    desc: 'Automate cellulaire vivant',
    description: 'Implémentation interactive du Jeu de la Vie avec patterns prédéfinis et dessin libre.',
    category: 'Génératif',
    tags: ['Automate', 'Simulation', 'Vie'],
    color: '#00ff41',
    effect: 'gameOfLife',
    tech: 'Canvas 2D, Simulation',
    year: '2024'
  },
  {
    id: 503,
    title: 'Lorenz Attractor',
    desc: 'Chaos déterministe 3D',
    description: 'Visualisation de l\'attracteur de Lorenz, icône de la théorie du chaos.',
    category: 'Génératif',
    tags: ['Chaos', 'Math', '3D'],
    color: '#ff6b35',
    effect: 'lorenzAttractor',
    tech: 'Three.js, Differential Eq',
    year: '2024'
  },
  {
    id: 504,
    title: 'Wave Interference',
    desc: 'Interférences ondulatoires',
    description: 'Simulation d\'interférences entre plusieurs sources d\'ondes avec patterns dynamiques.',
    category: 'Génératif',
    tags: ['Physique', 'Ondes', 'Simulation'],
    color: '#3b82f6',
    effect: 'waveInterference',
    tech: 'Canvas 2D, Physics',
    year: '2024'
  },
  
  // ========================================================================
  // PROJETS - Case studies
  // ========================================================================
  {
    id: 601,
    title: 'ARKADIA France',
    desc: 'Cluster ARK Survival',
    description: 'Communauté gaming de 150+ membres avec serveurs ARK, Discord et outils d\'administration.',
    category: 'Projets',
    universe: 'ARKADIA',
    tags: ['Gaming', 'Communauté', 'Discord'],
    color: '#7bc043',
    effect: 'arkadiaProject',
    size: 'large',
    featured: true,
    tech: 'Node.js, Discord.js, Nitrado API',
    year: '2024',
    link: '/arkadia'
  },
  {
    id: 602,
    title: 'VoyageoPro',
    desc: 'Application voyage B2B',
    description: 'Solution complète de gestion de voyages professionnels avec réservations et reporting.',
    category: 'Projets',
    tags: ['B2B', 'Voyage', 'Full-Stack'],
    color: '#0ea5e9',
    effect: 'voyageoProject',
    size: 'wide',
    tech: 'Symfony, Vue.js, PostgreSQL',
    year: '2024',
    link: '/voyageo-pro'
  },
  {
    id: 603,
    title: 'GL Factory Stack',
    desc: 'Pipeline d\'automatisation',
    description: 'Infrastructure Docker avec n8n, Ollama, PostgreSQL pour génération automatique de contenu.',
    category: 'Projets',
    tags: ['DevOps', 'IA', 'Automation'],
    color: '#00ff41',
    effect: 'glFactoryStack',
    tech: 'Docker, n8n, Ollama',
    year: '2024'
  },
  {
    id: 604,
    title: 'Portfolio Multivers',
    desc: 'Ce site que tu explores',
    description: '21 univers thématiques, 50+ mini-apps, système d\'agents IA et expériences immersives.',
    category: 'Projets',
    tags: ['Portfolio', 'Vue.js', 'Three.js'],
    color: '#00d4ff',
    effect: 'portfolioMultivers',
    size: 'large',
    tech: 'Vue 3, Three.js, Vite',
    year: '2024',
    link: '/'
  },
  
  // ========================================================================
  // INFOGRAPHIES - Veille Tech 2026
  // ========================================================================
  {
    id: 801,
    title: 'Iceberg du SI',
    desc: 'Projet "simple" vs Réalité technique',
    description: 'Infographie illustrant la complexité cachée des projets IT. En surface : besoin simple. Sous l\'eau : dette technique, legacy, architecture complexe, code spaghetti, flux de données...',
    category: 'Infographie',
    tags: ['SI', 'Dette Technique', 'Archi'],
    color: '#00c8ff',
    effect: 'icebergSI',
    size: 'wide',
    featured: true,
    tech: 'Concept, Illustration',
    year: '2026'
  },
  {
    id: 802,
    title: 'Design Émotionnel',
    desc: 'L\'art de toucher l\'utilisateur',
    description: '53% des consommateurs paient plus pour une expérience émotionnelle (Forrester 2024). Couleurs, typo, micro-interactions, empathie : créer une connexion unique.',
    category: 'Infographie',
    tags: ['UX', 'Emotion', 'Design'],
    color: '#ff69b4',
    effect: 'emotionalDesign',
    size: 'normal',
    tech: 'UX Research, Psychology',
    year: '2026'
  },
  {
    id: 803,
    title: 'Cyberdéfense 9 Couches',
    desc: 'Defense in depth illustrée',
    description: 'IAM, Pare-feu, EDR/NDR, IDS/IPS, SIEM, Cloud Security, DLP, Incident Response, Sensibilisation. Les 9 couches de protection cyber.',
    category: 'Infographie',
    tags: ['Sécurité', 'Cyber', 'Defense'],
    color: '#ff4444',
    effect: 'cyberLayers',
    size: 'large',
    tech: 'Security Architecture',
    year: '2026'
  },
  {
    id: 804,
    title: 'Guide Perplexity IA',
    desc: '42 pages de playbook interne',
    description: 'Comment Perplexity utilise l\'IA au quotidien : automatisation emails, préparation réunions, prompts métiers. Document interne rendu public.',
    category: 'Infographie',
    tags: ['IA', 'Perplexity', 'Guide'],
    color: '#00d4aa',
    effect: 'perplexityGuide',
    size: 'normal',
    tech: 'AI, Productivity',
    year: '2026'
  },
  {
    id: 805,
    title: 'SUDO LOCO Concept',
    desc: 'Trains + Programmation',
    description: 'Jeu où on construit un réseau ferroviaire automatisé. Train = variables, stations = fonctions, destination = return. Aiguillages = IF.',
    category: 'Infographie',
    tags: ['GameDev', 'Puzzle', 'Code'],
    color: '#ffd700',
    effect: 'sudoLoco',
    size: 'wide',
    tech: 'Three.js, Game Design',
    year: '2026'
  },
  {
    id: 806,
    title: 'Fediverse Map',
    desc: 'Réseaux sociaux indépendants',
    description: 'Mastodon, PeerTube, Pixelfed, Lemmy... L\'écosystème décentralisé où chaque serveur est souverain. Protocole ActivityPub.',
    category: 'Infographie',
    tags: ['Fediverse', 'Social', 'Decentralisé'],
    color: '#8b5cf6',
    effect: 'fediverseMap',
    size: 'normal',
    tech: 'ActivityPub, Self-hosted',
    year: '2026'
  },
  {
    id: 807,
    title: 'RGPD Dev Guide',
    desc: 'CNIL pour développeurs',
    description: 'Consentement, cookies, données personnelles, durée de conservation, droits des utilisateurs. Le guide officiel CNIL pour être en conformité.',
    category: 'Infographie',
    tags: ['RGPD', 'CNIL', 'Legal'],
    color: '#3b82f6',
    effect: 'rgpdGuide',
    size: 'normal',
    tech: 'Legal, Compliance',
    year: '2026'
  },
  {
    id: 808,
    title: 'OPQUAST 240 Règles',
    desc: 'Qualité web certifiée',
    description: 'Accessibilité, performance, SEO, sécurité, éco-conception. Les 240 règles OPQUAST pour un web de qualité.',
    category: 'Infographie',
    tags: ['Qualité', 'OPQUAST', 'Web'],
    color: '#22c55e',
    effect: 'opquastRules',
    size: 'wide',
    tech: 'Quality Assurance',
    year: '2026'
  },

  // ========================================================================
  // CONSTRUCT - Features 2026
  // ========================================================================
  {
    id: 901,
    title: 'Neural Feed',
    desc: 'Hub de veille tech intégré',
    description: 'Agrégateur de veille technologique niveau Awwwards. IA, Dev, Sécurité, RGPD, Réseaux sociaux, Mindset. Effets atmosphériques et animations fluides.',
    category: 'UI/UX',
    universe: 'Matrix',
    tags: ['Veille', 'IA', 'Aggregator'],
    color: '#00ff88',
    effect: 'neuralFeed',
    size: 'large',
    featured: true,
    tech: 'Vue 3, CSS Animations',
    year: '2026',
    link: '/construct'
  },
  {
    id: 902,
    title: 'Mobile Controls',
    desc: 'Joysticks touch pour Construct',
    description: 'Système de contrôles tactiles pour navigation 3D mobile. Double joystick, boutons d\'action, menu rapide glissant.',
    category: 'UI/UX',
    universe: 'Matrix',
    tags: ['Mobile', 'Touch', '3D'],
    color: '#00d4ff',
    effect: 'mobileControls',
    size: 'normal',
    tech: 'Vue 3, Touch Events',
    year: '2026',
    link: '/construct'
  },
  {
    id: 903,
    title: 'Wisdom Terminal',
    desc: 'Citations aléatoires Matrix',
    description: 'Terminal intégré au Neural Feed avec citations inspirantes : Morpheus, proverbes corses, philosophie 2026...',
    category: 'UI/UX',
    universe: 'Matrix',
    tags: ['Terminal', 'Quotes', 'Inspiration'],
    color: '#00ff41',
    effect: 'wisdomTerminal',
    size: 'normal',
    tech: 'Vue 3, Randomization',
    year: '2026'
  },

  // ========================================================================
  // APPS - Outils développeur
  // ========================================================================
  {
    id: 701,
    title: 'JSON Formatter',
    desc: 'Formatage et validation JSON',
    description: 'Outil de formatage, validation et minification JSON avec coloration syntaxique.',
    category: 'Apps',
    tags: ['Dev Tool', 'JSON', 'Utility'],
    color: '#fbbf24',
    effect: 'jsonFormatter',
    tech: 'Vue.js, CodeMirror',
    year: '2024',
    link: '/apps/json-formatter'
  },
  {
    id: 702,
    title: 'Regex Tester',
    desc: 'Test d\'expressions régulières',
    description: 'Testeur de regex avec highlighting des matches, groupes de capture et explications.',
    category: 'Apps',
    tags: ['Dev Tool', 'Regex', 'Utility'],
    color: '#22c55e',
    effect: 'regexTester',
    tech: 'Vue.js, Regex Engine',
    year: '2024',
    link: '/apps/regex-tester'
  },
  {
    id: 703,
    title: 'Color Converter',
    desc: 'Conversion HEX/RGB/HSL',
    description: 'Convertisseur de couleurs avec picker, palettes et export en différents formats.',
    category: 'Apps',
    tags: ['Design', 'Couleurs', 'Utility'],
    color: '#ec4899',
    effect: 'colorConverter',
    tech: 'Vue.js, Color Math',
    year: '2024',
    link: '/apps/color-converter'
  },
  {
    id: 704,
    title: 'Prompt Builder',
    desc: 'Constructeur de prompts IA',
    description: 'Outil de création de prompts structurés pour Claude, GPT et autres LLMs.',
    category: 'Apps',
    tags: ['IA', 'Prompts', 'Productivity'],
    color: '#8b5cf6',
    effect: 'promptBuilder',
    size: 'wide',
    tech: 'Vue.js, Templates',
    year: '2024',
    link: '/apps/prompt-builder'
  },
  {
    id: 705,
    title: 'ARK Config Manager',
    desc: 'Éditeur de config ARK',
    description: 'Éditeur visuel pour GameUserSettings.ini et Game.ini avec presets et validation.',
    category: 'Apps',
    tags: ['Gaming', 'Config', 'Editor'],
    color: '#7bc043',
    effect: 'arkConfig',
    tech: 'Vue.js, INI Parser',
    year: '2024',
    link: '/apps/ark-config'
  }
])

// ============================================================================
// COMPUTED
// ============================================================================
const categories = computed(() => {
  return [...new Set(galleryItems.map(item => item.category))]
})

const universes = computed(() => {
  return [...new Set(galleryItems.filter(i => i.universe).map(i => i.universe))]
})

const filteredItems = computed(() => {
  if (activeFilter.value === 'all') return galleryItems
  return galleryItems.filter(item => item.category === activeFilter.value)
})

// ============================================================================
// EFFECTS - Rendus Canvas pour chaque item
// ============================================================================
const seededRandom = (seed) => {
  const x = Math.sin(seed * 9999) * 10000
  return x - Math.floor(x)
}

const effects = {
  // ========================================================================
  // MATRIX / CYBER
  // ========================================================================
  matrixRain: (ctx, w, h, color, seed, time) => {
    ctx.fillStyle = '#000'
    ctx.fillRect(0, 0, w, h)
    const chars = 'アイウエオカキクケコ0123456789ABCDEF'
    ctx.font = '10px monospace'
    for (let i = 0; i < 40; i++) {
      const x = seededRandom(seed + i) * w
      const y = (seededRandom(seed + i + 100) * h + time * 60) % h
      ctx.fillStyle = `${color}${Math.floor(seededRandom(seed + i + 200) * 200 + 55).toString(16).padStart(2, '0')}`
      ctx.fillText(chars[Math.floor(seededRandom(seed + i + 300) * chars.length)], x, y)
    }
  },

  matrixGlitch: (ctx, w, h, color, seed, time) => {
    ctx.fillStyle = '#000'
    ctx.fillRect(0, 0, w, h)
    // Dual color rain
    const chars = 'アイウエオ01'
    ctx.font = '8px monospace'
    for (let i = 0; i < 30; i++) {
      const x = seededRandom(seed + i) * w
      const y = (seededRandom(seed + i + 100) * h + time * 50) % h
      ctx.fillStyle = i % 2 === 0 ? '#00ff41' : '#ff0044'
      ctx.fillText(chars[Math.floor(seededRandom(seed + i + 300) * chars.length)], x, y)
    }
    // Glitch bars
    if (Math.sin(time * 10) > 0.8) {
      ctx.fillStyle = '#ff004433'
      ctx.fillRect(0, Math.random() * h, w, 5)
    }
  },

  // ========================================================================
  // TRON
  // ========================================================================
  tronGrid: (ctx, w, h, color, seed, time) => {
    ctx.fillStyle = '#0a0a14'
    ctx.fillRect(0, 0, w, h)
    ctx.strokeStyle = color + '44'
    ctx.lineWidth = 1
    for (let i = 0; i <= 12; i++) {
      ctx.beginPath()
      ctx.moveTo(i * w / 12, 0)
      ctx.lineTo(i * w / 12, h)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(0, i * h / 12)
      ctx.lineTo(w, i * h / 12)
      ctx.stroke()
    }
    ctx.strokeStyle = color
    ctx.lineWidth = 2
    const pulseX = (time * 50) % w
    ctx.beginPath()
    ctx.moveTo(pulseX, 0)
    ctx.lineTo(pulseX, h)
    ctx.stroke()
  },

  lightCycle: (ctx, w, h, color, seed, time) => {
    ctx.fillStyle = '#0a0a14'
    ctx.fillRect(0, 0, w, h)
    // Trail
    ctx.strokeStyle = color
    ctx.lineWidth = 3
    ctx.shadowColor = color
    ctx.shadowBlur = 10
    ctx.beginPath()
    const cycleX = (time * 80) % (w + 100) - 50
    ctx.moveTo(0, h * 0.6)
    ctx.lineTo(Math.min(cycleX, w * 0.3), h * 0.6)
    ctx.lineTo(Math.min(cycleX, w * 0.3), h * 0.4)
    ctx.lineTo(cycleX, h * 0.4)
    ctx.stroke()
    // Cycle head
    ctx.fillStyle = '#fff'
    ctx.beginPath()
    ctx.arc(cycleX, h * 0.4, 5, 0, Math.PI * 2)
    ctx.fill()
    ctx.shadowBlur = 0
  },

  // ========================================================================
  // BLADE RUNNER
  // ========================================================================
  bladeCity: (ctx, w, h, color, seed, time) => {
    ctx.fillStyle = '#0d0508'
    ctx.fillRect(0, 0, w, h)
    for (let i = 0; i < 15; i++) {
      const bw = seededRandom(seed + i) * 30 + 15
      const bh = seededRandom(seed + i + 50) * h * 0.6 + h * 0.2
      const x = i * w / 15
      ctx.fillStyle = '#1a1015'
      ctx.fillRect(x, h - bh, bw, bh)
      for (let j = 0; j < 6; j++) {
        if (seededRandom(seed + i + j) > 0.4) {
          ctx.fillStyle = seededRandom(seed + i + j + 100) > 0.5 ? color + 'aa' : '#00a8cc88'
          ctx.fillRect(x + 3, h - bh + 10 + j * 15, 4, 6)
        }
      }
    }
    ctx.strokeStyle = '#ffffff22'
    for (let i = 0; i < 50; i++) {
      const x = seededRandom(seed + i + 200) * w
      const y = (seededRandom(seed + i + 300) * h + time * 100) % h
      ctx.beginPath()
      ctx.moveTo(x, y)
      ctx.lineTo(x, y + 8)
      ctx.stroke()
    }
  },

  voightKampff: (ctx, w, h, color, seed, time) => {
    ctx.fillStyle = '#0a0505'
    ctx.fillRect(0, 0, w, h)
    // Eye
    ctx.strokeStyle = color
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.ellipse(w / 2, h / 2, 50, 30, 0, 0, Math.PI * 2)
    ctx.stroke()
    // Iris
    ctx.beginPath()
    ctx.arc(w / 2, h / 2, 20 + Math.sin(time * 2) * 5, 0, Math.PI * 2)
    ctx.stroke()
    // Pupil
    ctx.fillStyle = color
    ctx.beginPath()
    ctx.arc(w / 2, h / 2, 8, 0, Math.PI * 2)
    ctx.fill()
    // Scan line
    ctx.strokeStyle = '#ff000066'
    ctx.beginPath()
    ctx.moveTo(w * 0.2, h / 2 + Math.sin(time * 3) * 20)
    ctx.lineTo(w * 0.8, h / 2 + Math.sin(time * 3) * 20)
    ctx.stroke()
  },

  // ========================================================================
  // GHOST IN THE SHELL
  // ========================================================================
  ghostUI: (ctx, w, h, color, seed, time) => {
    ctx.fillStyle = '#0d1117'
    ctx.fillRect(0, 0, w, h)
    for (let i = 0; i < 5; i++) {
      ctx.strokeStyle = color + Math.floor(30 + i * 10).toString(16).padStart(2, '0')
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.arc(w / 2, h / 2, 20 + i * 20 + Math.sin(time + i) * 5, 0, Math.PI * 2)
      ctx.stroke()
    }
    ctx.strokeStyle = '#00bcd444'
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2 + time * 0.5
      ctx.beginPath()
      ctx.moveTo(w / 2, h / 2)
      ctx.lineTo(w / 2 + Math.cos(angle) * 60, h / 2 + Math.sin(angle) * 60)
      ctx.stroke()
    }
  },

  tachikomaNet: (ctx, w, h, color, seed, time) => {
    ctx.fillStyle = '#0d1117'
    ctx.fillRect(0, 0, w, h)
    // Network nodes (tachikomas)
    const nodes = []
    for (let i = 0; i < 6; i++) {
      nodes.push({
        x: w * 0.2 + seededRandom(seed + i) * w * 0.6,
        y: h * 0.2 + seededRandom(seed + i + 50) * h * 0.6
      })
    }
    // Connections
    ctx.strokeStyle = color + '44'
    nodes.forEach((n1, i) => {
      nodes.slice(i + 1).forEach(n2 => {
        ctx.beginPath()
        ctx.moveTo(n1.x, n1.y)
        ctx.lineTo(n2.x, n2.y)
        ctx.stroke()
      })
    })
    // Nodes
    nodes.forEach((n, i) => {
      const pulse = Math.sin(time * 2 + i) > 0
      ctx.fillStyle = pulse ? color : color + '66'
      ctx.beginPath()
      ctx.arc(n.x, n.y, pulse ? 10 : 6, 0, Math.PI * 2)
      ctx.fill()
    })
    // Data packet
    const packetPos = (time * 0.5) % 1
    const n1 = nodes[0], n2 = nodes[1]
    ctx.fillStyle = '#fff'
    ctx.beginPath()
    ctx.arc(n1.x + (n2.x - n1.x) * packetPos, n1.y + (n2.y - n1.y) * packetPos, 4, 0, Math.PI * 2)
    ctx.fill()
  },

  // ========================================================================
  // INCEPTION
  // ========================================================================
  inceptionLayers: (ctx, w, h, color, seed, time) => {
    ctx.fillStyle = '#1a1508'
    ctx.fillRect(0, 0, w, h)
    for (let i = 0; i < 6; i++) {
      const size = 80 - i * 12
      const rot = time * 0.2 + i * 0.3
      const x = w / 2 + Math.sin(time + i) * 10
      const y = h / 2 + Math.cos(time + i) * 10
      ctx.save()
      ctx.translate(x, y)
      ctx.rotate(rot)
      ctx.strokeStyle = color + Math.floor(40 + i * 20).toString(16).padStart(2, '0')
      ctx.lineWidth = 2
      ctx.strokeRect(-size / 2, -size / 2, size, size)
      ctx.restore()
    }
  },

  spinningTotem: (ctx, w, h, color, seed, time) => {
    ctx.fillStyle = '#1a1508'
    ctx.fillRect(0, 0, w, h)
    // Table surface
    ctx.fillStyle = '#2a2518'
    ctx.fillRect(0, h * 0.7, w, h * 0.3)
    // Totem (spinning top)
    const wobble = Math.sin(time * 8) * 3
    ctx.save()
    ctx.translate(w / 2 + wobble, h * 0.6)
    ctx.rotate(time * 5)
    // Body
    ctx.fillStyle = color
    ctx.beginPath()
    ctx.moveTo(0, -30)
    ctx.lineTo(15, 10)
    ctx.lineTo(-15, 10)
    ctx.closePath()
    ctx.fill()
    // Point
    ctx.beginPath()
    ctx.moveTo(0, 10)
    ctx.lineTo(3, 25)
    ctx.lineTo(-3, 25)
    ctx.closePath()
    ctx.fill()
    ctx.restore()
  },

  // ========================================================================
  // OTHER UNIVERSES
  // ========================================================================
  minorityUI: (ctx, w, h, color, seed, time) => {
    ctx.fillStyle = '#0a0a14'
    ctx.fillRect(0, 0, w, h)
    // Floating panels
    for (let i = 0; i < 5; i++) {
      const x = w * 0.1 + i * w * 0.18
      const y = h * 0.3 + Math.sin(time + i) * 20
      ctx.strokeStyle = color + '66'
      ctx.strokeRect(x, y, w * 0.15, h * 0.4)
      // Content lines
      for (let j = 0; j < 4; j++) {
        ctx.fillStyle = color + '44'
        ctx.fillRect(x + 5, y + 10 + j * 20, w * 0.1, 3)
      }
    }
    // Hand cursor
    ctx.fillStyle = '#ffffff44'
    ctx.beginPath()
    ctx.arc(w / 2 + Math.sin(time) * 50, h / 2, 15, 0, Math.PI * 2)
    ctx.fill()
  },

  vMask: (ctx, w, h, color, seed, time) => {
    ctx.fillStyle = '#0a0a0a'
    ctx.fillRect(0, 0, w, h)
    // Mask outline
    ctx.strokeStyle = color
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.ellipse(w / 2, h / 2 - 10, 40, 50, 0, 0, Math.PI * 2)
    ctx.stroke()
    // Eyes
    ctx.beginPath()
    ctx.arc(w / 2 - 15, h / 2 - 15, 8, 0, Math.PI * 2)
    ctx.arc(w / 2 + 15, h / 2 - 15, 8, 0, Math.PI * 2)
    ctx.stroke()
    // Smile
    ctx.beginPath()
    ctx.arc(w / 2, h / 2 + 5, 20, 0.2, Math.PI - 0.2)
    ctx.stroke()
    // V
    ctx.font = 'bold 30px serif'
    ctx.fillStyle = color
    ctx.textAlign = 'center'
    ctx.fillText('V', w / 2, h - 30)
    // Particles
    for (let i = 0; i < 20; i++) {
      const px = seededRandom(seed + i) * w
      const py = (seededRandom(seed + i + 100) * h + time * 30) % h
      ctx.fillStyle = color + '44'
      ctx.fillRect(px, py, 2, 2)
    }
  },

  deadpool4thWall: (ctx, w, h, color, seed, time) => {
    ctx.fillStyle = '#1a0a0a'
    ctx.fillRect(0, 0, w, h)
    // Mask
    ctx.fillStyle = color
    ctx.beginPath()
    ctx.ellipse(w / 2, h / 2, 50, 60, 0, 0, Math.PI * 2)
    ctx.fill()
    // Black around eyes
    ctx.fillStyle = '#000'
    ctx.beginPath()
    ctx.ellipse(w / 2 - 20, h / 2 - 10, 18, 25, -0.3, 0, Math.PI * 2)
    ctx.ellipse(w / 2 + 20, h / 2 - 10, 18, 25, 0.3, 0, Math.PI * 2)
    ctx.fill()
    // White eyes
    ctx.fillStyle = '#fff'
    const blink = Math.sin(time * 2) > 0.95 ? 0.1 : 1
    ctx.beginPath()
    ctx.ellipse(w / 2 - 20, h / 2 - 10, 12, 18 * blink, -0.3, 0, Math.PI * 2)
    ctx.ellipse(w / 2 + 20, h / 2 - 10, 12, 18 * blink, 0.3, 0, Math.PI * 2)
    ctx.fill()
    // Speech bubble
    ctx.fillStyle = '#fff'
    ctx.beginPath()
    ctx.ellipse(w * 0.8, h * 0.2, 40, 25, 0, 0, Math.PI * 2)
    ctx.fill()
    ctx.font = '10px sans-serif'
    ctx.fillStyle = '#000'
    ctx.textAlign = 'center'
    ctx.fillText('Hey you!', w * 0.8, h * 0.22)
  },

  maskTransform: (ctx, w, h, color, seed, time) => {
    ctx.fillStyle = '#0a1a0a'
    ctx.fillRect(0, 0, w, h)
    // Cartoon stretch effect
    const stretch = 1 + Math.sin(time * 8) * 0.3
    ctx.save()
    ctx.translate(w / 2, h / 2)
    ctx.scale(1 / stretch, stretch)
    // Face
    ctx.fillStyle = color
    ctx.beginPath()
    ctx.ellipse(0, 0, 40, 50, 0, 0, Math.PI * 2)
    ctx.fill()
    // Big teeth
    ctx.fillStyle = '#fff'
    ctx.beginPath()
    ctx.rect(-30, 10, 60, 25)
    ctx.fill()
    // Eyes
    ctx.fillStyle = '#fff'
    ctx.beginPath()
    ctx.ellipse(-15, -15, 15, 20, 0, 0, Math.PI * 2)
    ctx.ellipse(15, -15, 15, 20, 0, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = '#000'
    ctx.beginPath()
    ctx.arc(-15, -15, 5, 0, Math.PI * 2)
    ctx.arc(15, -15, 5, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()
    // SSSSMOKIN text
    if (Math.sin(time * 3) > 0) {
      ctx.font = 'bold 16px Impact'
      ctx.fillStyle = '#ffff00'
      ctx.textAlign = 'center'
      ctx.fillText('SSSSMOKIN!', w / 2, h - 20)
    }
  },

  ironManHUD: (ctx, w, h, color, seed, time) => {
    ctx.fillStyle = '#0a0505'
    ctx.fillRect(0, 0, w, h)
    // HUD frame
    ctx.strokeStyle = color
    ctx.lineWidth = 2
    // Corner brackets
    ctx.beginPath()
    ctx.moveTo(20, 40); ctx.lineTo(20, 20); ctx.lineTo(40, 20)
    ctx.moveTo(w - 20, 40); ctx.lineTo(w - 20, 20); ctx.lineTo(w - 40, 20)
    ctx.moveTo(20, h - 40); ctx.lineTo(20, h - 20); ctx.lineTo(40, h - 20)
    ctx.moveTo(w - 20, h - 40); ctx.lineTo(w - 20, h - 20); ctx.lineTo(w - 40, h - 20)
    ctx.stroke()
    // Central circle
    ctx.beginPath()
    ctx.arc(w / 2, h / 2, 40 + Math.sin(time * 2) * 5, 0, Math.PI * 2)
    ctx.stroke()
    // Arc reactor
    ctx.beginPath()
    ctx.arc(w / 2, h / 2, 15, 0, Math.PI * 2)
    ctx.fillStyle = '#00d4ff'
    ctx.fill()
    // Data readouts
    ctx.font = '8px monospace'
    ctx.fillStyle = color
    ctx.fillText('POWER: 98%', 30, 50)
    ctx.fillText('THRUST: NOMINAL', 30, 65)
    ctx.fillText('J.A.R.V.I.S: ONLINE', w - 100, 50)
  },

  dbzPower: (ctx, w, h, color, seed, time) => {
    ctx.fillStyle = '#0a0a1a'
    ctx.fillRect(0, 0, w, h)
    // Aura effect
    const auraSize = 60 + Math.sin(time * 5) * 20
    for (let i = 5; i > 0; i--) {
      ctx.fillStyle = color + Math.floor(10 + i * 10).toString(16).padStart(2, '0')
      ctx.beginPath()
      ctx.ellipse(w / 2, h / 2, auraSize + i * 10, auraSize * 1.3 + i * 15, 0, 0, Math.PI * 2)
      ctx.fill()
    }
    // Energy sparks
    for (let i = 0; i < 10; i++) {
      const angle = time * 3 + i * 0.6
      const dist = 50 + Math.sin(time * 5 + i) * 20
      ctx.fillStyle = '#fff'
      ctx.beginPath()
      ctx.arc(w / 2 + Math.cos(angle) * dist, h / 2 + Math.sin(angle) * dist, 2, 0, Math.PI * 2)
      ctx.fill()
    }
    // Power level
    ctx.font = 'bold 14px monospace'
    ctx.fillStyle = color
    ctx.textAlign = 'center'
    const power = Math.floor(9000 + Math.sin(time) * 500)
    ctx.fillText(`POWER: ${power}`, w / 2, h - 20)
  },

  oasisPortal: (ctx, w, h, color, seed, time) => {
    ctx.fillStyle = '#0a0a14'
    ctx.fillRect(0, 0, w, h)
    // Portal rings
    for (let i = 0; i < 8; i++) {
      const ringTime = time + i * 0.2
      const scale = ((ringTime * 0.5) % 1)
      ctx.strokeStyle = color + Math.floor((1 - scale) * 200).toString(16).padStart(2, '0')
      ctx.lineWidth = 3 * (1 - scale)
      ctx.beginPath()
      ctx.ellipse(w / 2, h / 2, 20 + scale * 80, 10 + scale * 40, 0, 0, Math.PI * 2)
      ctx.stroke()
    }
    // Center glow
    ctx.fillStyle = '#fff'
    ctx.beginPath()
    ctx.arc(w / 2, h / 2, 10 + Math.sin(time * 3) * 3, 0, Math.PI * 2)
    ctx.fill()
    // OASIS text
    ctx.font = 'bold 12px monospace'
    ctx.fillStyle = color
    ctx.textAlign = 'center'
    ctx.fillText('OASIS', w / 2, h - 15)
  },

  foundationMath: (ctx, w, h, color, seed, time) => {
    ctx.fillStyle = '#0a0a14'
    ctx.fillRect(0, 0, w, h)
    // Mathematical equations floating
    ctx.font = '10px serif'
    ctx.fillStyle = color + '88'
    const equations = ['Ψ(x,t)', '∫ρdτ', 'P(H|E)', 'ΣF=0', '∇²ψ']
    for (let i = 0; i < 15; i++) {
      const x = seededRandom(seed + i) * w
      const y = (seededRandom(seed + i + 100) * h + time * 20) % h
      ctx.fillText(equations[i % equations.length], x, y)
    }
    // Galaxy spiral
    ctx.strokeStyle = color + '44'
    ctx.beginPath()
    for (let a = 0; a < Math.PI * 6; a += 0.1) {
      const r = 5 + a * 8
      const x = w / 2 + Math.cos(a + time * 0.3) * r
      const y = h / 2 + Math.sin(a + time * 0.3) * r * 0.5
      if (a === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }
    ctx.stroke()
  },

  cloudAtlasWeb: (ctx, w, h, color, seed, time) => {
    ctx.fillStyle = '#0a1414'
    ctx.fillRect(0, 0, w, h)
    // Timeline nodes
    const eras = 6
    const nodes = []
    for (let i = 0; i < eras; i++) {
      nodes.push({
        x: w * 0.1 + i * w * 0.15,
        y: h / 2 + Math.sin(i + time) * 30
      })
    }
    // Connections between eras
    ctx.strokeStyle = color + '44'
    ctx.lineWidth = 1
    for (let i = 0; i < nodes.length - 1; i++) {
      ctx.beginPath()
      ctx.moveTo(nodes[i].x, nodes[i].y)
      ctx.lineTo(nodes[i + 1].x, nodes[i + 1].y)
      ctx.stroke()
    }
    // Soul connections (curved)
    ctx.strokeStyle = color + '22'
    ctx.beginPath()
    ctx.moveTo(nodes[0].x, nodes[0].y)
    ctx.bezierCurveTo(w / 2, h * 0.1, w / 2, h * 0.9, nodes[nodes.length - 1].x, nodes[nodes.length - 1].y)
    ctx.stroke()
    // Era nodes
    nodes.forEach((n, i) => {
      ctx.fillStyle = color
      ctx.beginPath()
      ctx.arc(n.x, n.y, 8, 0, Math.PI * 2)
      ctx.fill()
    })
  },

  aliceTuring: (ctx, w, h, color, seed, time) => {
    ctx.fillStyle = '#1a0a1a'
    ctx.fillRect(0, 0, w, h)
    // Chess pattern
    const size = 20
    for (let i = 0; i < w / size; i++) {
      for (let j = 0; j < h / size; j++) {
        if ((i + j) % 2 === 0) {
          ctx.fillStyle = '#2a1a2a'
          ctx.fillRect(i * size, j * size, size, size)
        }
      }
    }
    // Binary rabbit
    ctx.font = '10px monospace'
    ctx.fillStyle = color
    const binary = '01'
    for (let i = 0; i < 20; i++) {
      const x = w * 0.3 + seededRandom(seed + i) * w * 0.4
      const y = (seededRandom(seed + i + 50) * h + time * 40) % h
      ctx.fillText(binary[Math.floor(seededRandom(seed + i) * 2)], x, y)
    }
    // Portal
    ctx.strokeStyle = color
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.ellipse(w / 2, h / 2, 30 + Math.sin(time * 2) * 10, 50, 0, 0, Math.PI * 2)
    ctx.stroke()
  },

  ghibliSpirit: (ctx, w, h, color, seed, time) => {
    ctx.fillStyle = '#0a1a0a'
    ctx.fillRect(0, 0, w, h)
    // Grass/forest floor
    for (let i = 0; i < 30; i++) {
      const x = seededRandom(seed + i) * w
      const grassH = 10 + seededRandom(seed + i + 50) * 20
      ctx.strokeStyle = color + '66'
      ctx.beginPath()
      ctx.moveTo(x, h)
      ctx.quadraticCurveTo(x + Math.sin(time + i) * 5, h - grassH / 2, x, h - grassH)
      ctx.stroke()
    }
    // Floating spirit (kodama-like)
    const bobY = Math.sin(time * 2) * 10
    ctx.fillStyle = '#fff'
    ctx.beginPath()
    ctx.ellipse(w / 2, h * 0.4 + bobY, 15, 20, 0, 0, Math.PI * 2)
    ctx.fill()
    // Eyes
    ctx.fillStyle = '#000'
    ctx.beginPath()
    ctx.arc(w / 2 - 5, h * 0.38 + bobY, 2, 0, Math.PI * 2)
    ctx.arc(w / 2 + 5, h * 0.38 + bobY, 2, 0, Math.PI * 2)
    ctx.fill()
    // Code particles
    ctx.font = '8px monospace'
    ctx.fillStyle = color + '44'
    for (let i = 0; i < 10; i++) {
      ctx.fillText('01', seededRandom(seed + i + 100) * w, (time * 20 + seededRandom(seed + i + 150) * h) % h)
    }
  },

  gardenMam: (ctx, w, h, color, seed, time) => {
    ctx.fillStyle = '#0a0a0a'
    ctx.fillRect(0, 0, w, h)
    // Ground
    ctx.fillStyle = '#1a2a1a'
    ctx.fillRect(0, h * 0.7, w, h * 0.3)
    // Flowers
    for (let i = 0; i < 8; i++) {
      const fx = w * 0.1 + i * w * 0.11
      const stemH = 30 + seededRandom(seed + i) * 40
      // Stem
      ctx.strokeStyle = '#4a8a4a'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(fx, h * 0.7)
      ctx.quadraticCurveTo(fx + Math.sin(time + i) * 10, h * 0.7 - stemH / 2, fx, h * 0.7 - stemH)
      ctx.stroke()
      // Petals
      const petalColor = ['#ff6b9d', '#ff9ecd', '#ffc4dd', '#ffb6c1'][i % 4]
      ctx.fillStyle = petalColor
      for (let p = 0; p < 5; p++) {
        const angle = (p / 5) * Math.PI * 2 + time * 0.5
        ctx.beginPath()
        ctx.ellipse(
          fx + Math.cos(angle) * 8,
          h * 0.7 - stemH + Math.sin(angle) * 8,
          6, 10, angle, 0, Math.PI * 2
        )
        ctx.fill()
      }
      // Center
      ctx.fillStyle = '#ffff00'
      ctx.beginPath()
      ctx.arc(fx, h * 0.7 - stemH, 5, 0, Math.PI * 2)
      ctx.fill()
    }
    // Butterfly
    const bx = w / 2 + Math.sin(time) * 50
    const by = h * 0.3 + Math.cos(time * 1.5) * 20
    ctx.fillStyle = color
    const wingFlap = Math.sin(time * 10) * 0.3 + 0.7
    ctx.save()
    ctx.translate(bx, by)
    ctx.scale(wingFlap, 1)
    ctx.beginPath()
    ctx.ellipse(-8, 0, 8, 12, -0.3, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()
    ctx.save()
    ctx.translate(bx, by)
    ctx.scale(wingFlap, 1)
    ctx.beginPath()
    ctx.ellipse(8, 0, 8, 12, 0.3, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()
  },

  samusElements: (ctx, w, h, color, seed, time) => {
    ctx.fillStyle = '#0a0a14'
    ctx.fillRect(0, 0, w, h)
    // Arm cannon charging
    const chargeSize = 20 + Math.sin(time * 3) * 10
    // Energy rings
    for (let i = 0; i < 3; i++) {
      ctx.strokeStyle = color + Math.floor(60 - i * 20).toString(16).padStart(2, '0')
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.arc(w / 2, h / 2, chargeSize + i * 15, 0, Math.PI * 2)
      ctx.stroke()
    }
    // Core energy
    ctx.fillStyle = color
    ctx.beginPath()
    ctx.arc(w / 2, h / 2, chargeSize / 2, 0, Math.PI * 2)
    ctx.fill()
    // Element particles
    const elements = ['#ff4444', '#44ff44', '#4444ff', '#ffff44']
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2 + time
      const dist = 50 + Math.sin(time * 2 + i) * 10
      ctx.fillStyle = elements[i % 4]
      ctx.beginPath()
      ctx.arc(w / 2 + Math.cos(angle) * dist, h / 2 + Math.sin(angle) * dist, 3, 0, Math.PI * 2)
      ctx.fill()
    }
  },

  jupiterThrone: (ctx, w, h, color, seed, time) => {
    ctx.fillStyle = '#0a0514'
    ctx.fillRect(0, 0, w, h)
    // Stars
    for (let i = 0; i < 50; i++) {
      const sx = seededRandom(seed + i) * w
      const sy = seededRandom(seed + i + 50) * h
      const brightness = seededRandom(seed + i + 100)
      ctx.fillStyle = `rgba(255,255,255,${brightness * 0.5})`
      ctx.beginPath()
      ctx.arc(sx, sy, brightness * 2, 0, Math.PI * 2)
      ctx.fill()
    }
    // Throne silhouette
    ctx.fillStyle = color + '22'
    ctx.beginPath()
    ctx.moveTo(w * 0.3, h * 0.9)
    ctx.lineTo(w * 0.35, h * 0.3)
    ctx.lineTo(w * 0.5, h * 0.2)
    ctx.lineTo(w * 0.65, h * 0.3)
    ctx.lineTo(w * 0.7, h * 0.9)
    ctx.closePath()
    ctx.fill()
    // Crown glow
    ctx.strokeStyle = color
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.arc(w / 2, h * 0.25, 15 + Math.sin(time * 2) * 5, 0, Math.PI * 2)
    ctx.stroke()
  },

  howardPortal: (ctx, w, h, color, seed, time) => {
    ctx.fillStyle = '#1a1a0a'
    ctx.fillRect(0, 0, w, h)
    // Swirling portal
    ctx.strokeStyle = color
    ctx.lineWidth = 2
    for (let i = 0; i < 5; i++) {
      ctx.beginPath()
      for (let a = 0; a < Math.PI * 2; a += 0.1) {
        const r = 20 + i * 12 + Math.sin(a * 3 + time * 2) * 5
        const x = w / 2 + Math.cos(a + time + i * 0.2) * r
        const y = h / 2 + Math.sin(a + time + i * 0.2) * r * 0.6
        if (a === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.closePath()
      ctx.stroke()
    }
    // Question mark
    ctx.font = 'bold 30px serif'
    ctx.fillStyle = color
    ctx.textAlign = 'center'
    ctx.fillText('?', w / 2, h / 2 + 10)
  },

  // ========================================================================
  // UI/UX EFFECTS
  // ========================================================================
  dashboardUI: (ctx, w, h, color, seed, time) => {
    ctx.fillStyle = '#0a0a0a'
    ctx.fillRect(0, 0, w, h)
    // Grid
    ctx.strokeStyle = color + '22'
    for (let i = 0; i < 10; i++) {
      ctx.beginPath()
      ctx.moveTo(i * w / 10, 0)
      ctx.lineTo(i * w / 10, h)
      ctx.stroke()
    }
    // Bars chart
    for (let i = 0; i < 8; i++) {
      const barH = (seededRandom(seed + i) * 0.6 + 0.2) * h * 0.6 + Math.sin(time * 2 + i) * 10
      ctx.fillStyle = color
      ctx.fillRect(w * 0.1 + i * w * 0.1, h - barH - 20, w * 0.06, barH)
    }
    // Label
    ctx.font = '10px monospace'
    ctx.fillStyle = color
    ctx.fillText('SYSTEM STATUS', 10, 20)
  },

  commandPalette: (ctx, w, h, color, seed, time) => {
    ctx.fillStyle = '#1a1a2e'
    ctx.fillRect(0, 0, w, h)
    // Search box
    ctx.strokeStyle = color
    ctx.lineWidth = 2
    ctx.strokeRect(w * 0.1, h * 0.2, w * 0.8, 30)
    // Results
    for (let i = 0; i < 4; i++) {
      const y = h * 0.35 + i * 25
      ctx.fillStyle = i === Math.floor(time) % 4 ? color + '44' : '#ffffff11'
      ctx.fillRect(w * 0.1, y, w * 0.8, 20)
      ctx.fillStyle = '#fff'
      ctx.font = '9px monospace'
      ctx.fillText('> Command ' + (i + 1), w * 0.15, y + 14)
    }
  },
  
  cookieBanner: (ctx, w, h, color, seed, time) => {
    ctx.fillStyle = '#0a0a0a'
    ctx.fillRect(0, 0, w, h)
    // Banner
    ctx.fillStyle = '#1a1a1a'
    ctx.fillRect(w * 0.05, h * 0.6, w * 0.9, h * 0.35)
    ctx.strokeStyle = color
    ctx.lineWidth = 1
    ctx.strokeRect(w * 0.05, h * 0.6, w * 0.9, h * 0.35)
    // Buttons
    ctx.fillStyle = color
    ctx.fillRect(w * 0.55, h * 0.75, w * 0.15, 20)
    ctx.fillStyle = '#333'
    ctx.fillRect(w * 0.75, h * 0.75, w * 0.15, 20)
  },
  
  logoGL: (ctx, w, h, color, seed, time) => {
    ctx.fillStyle = '#0a0a0a'
    ctx.fillRect(0, 0, w, h)
    // G + L stylisé
    ctx.strokeStyle = color
    ctx.lineWidth = 4
    ctx.beginPath()
    ctx.arc(w * 0.4, h / 2, 25, 0.5, Math.PI * 2 - 0.5)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(w * 0.4, h / 2)
    ctx.lineTo(w * 0.4 + 15, h / 2)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(w * 0.6, h * 0.3)
    ctx.lineTo(w * 0.6, h * 0.7)
    ctx.lineTo(w * 0.75, h * 0.7)
    ctx.stroke()
  },
  
  logoArkadia: (ctx, w, h, color, seed, time, logoImg) => {
    // Background avec gradient
    const bgGrad = ctx.createRadialGradient(w/2, h/2, 0, w/2, h/2, w * 0.8)
    bgGrad.addColorStop(0, '#0a1510')
    bgGrad.addColorStop(1, '#050a08')
    ctx.fillStyle = bgGrad
    ctx.fillRect(0, 0, w, h)
    
    // Particules flottantes (éléments du jeu: Glace, Feu, Nature)
    const elements = ['#00d4ff', '#ff6600', '#7bc043']
    for (let i = 0; i < 15; i++) {
      const px = seededRandom(seed + i) * w
      const py = (seededRandom(seed + i + 100) * h + time * 15) % h
      const elementColor = elements[i % 3]
      ctx.fillStyle = elementColor + '44'
      ctx.beginPath()
      ctx.arc(px, py, 2 + seededRandom(seed + i + 200) * 3, 0, Math.PI * 2)
      ctx.fill()
    }
    
    // Glow pulsant autour du centre
    const glowSize = 50 + Math.sin(time * 2) * 10
    const glowGrad = ctx.createRadialGradient(w/2, h/2, 0, w/2, h/2, glowSize)
    glowGrad.addColorStop(0, color + '33')
    glowGrad.addColorStop(0.5, color + '11')
    glowGrad.addColorStop(1, 'transparent')
    ctx.fillStyle = glowGrad
    ctx.beginPath()
    ctx.arc(w/2, h/2, glowSize, 0, Math.PI * 2)
    ctx.fill()
    
    // Si l'image du logo est chargée, l'afficher
    if (logoImg && logoImg.complete && logoImg.naturalWidth > 0) {
      const logoSize = Math.min(w, h) * 0.75
      const logoX = (w - logoSize) / 2
      const logoY = (h - logoSize) / 2
      ctx.drawImage(logoImg, logoX, logoY, logoSize, logoSize)
    } else {
      // Fallback: A tricolore stylisé ARKADIA
      ctx.save()
      ctx.translate(w/2, h/2)
      // Triangle principal (comme le logo ARK)
      ctx.beginPath()
      ctx.moveTo(0, -35)
      ctx.lineTo(-30, 25)
      ctx.lineTo(30, 25)
      ctx.closePath()
      // Gradient tricolore
      const triGrad = ctx.createLinearGradient(-30, -35, 30, 25)
      triGrad.addColorStop(0, '#00d4ff')   // Glace (haut)
      triGrad.addColorStop(0.5, '#ff6600') // Feu (milieu)
      triGrad.addColorStop(1, '#7bc043')   // Nature (bas)
      ctx.fillStyle = triGrad
      ctx.fill()
      ctx.strokeStyle = '#ffffff33'
      ctx.lineWidth = 1
      ctx.stroke()
      // A intérieur
      ctx.fillStyle = '#0a150a'
      ctx.beginPath()
      ctx.moveTo(0, 5)
      ctx.lineTo(-12, 25)
      ctx.lineTo(12, 25)
      ctx.closePath()
      ctx.fill()
      ctx.restore()
    }
    
    // Cercles d'énergie rotatifs
    ctx.strokeStyle = color + '22'
    ctx.lineWidth = 1
    for (let i = 0; i < 3; i++) {
      ctx.beginPath()
      ctx.arc(w/2, h/2, 55 + i * 12, time + i, time + i + Math.PI * 1.5)
      ctx.stroke()
    }
  },
  
  colorPalette: (ctx, w, h, color, seed, time) => {
    ctx.fillStyle = '#0a0a0a'
    ctx.fillRect(0, 0, w, h)
    const colors = ['#00ff41', '#00d4ff', '#ff6b35', '#e91e63', '#ffd700', '#8b5cf6', '#14b8a6', '#ff0033']
    for (let i = 0; i < colors.length; i++) {
      const x = (i % 4) * w / 4
      const y = Math.floor(i / 4) * h / 2
      ctx.fillStyle = colors[i]
      ctx.fillRect(x + 5, y + 5, w / 4 - 10, h / 2 - 10)
    }
  },
  
  construct3D: (ctx, w, h, color, seed, time) => {
    ctx.fillStyle = '#000'
    ctx.fillRect(0, 0, w, h)
    // Grid floor
    ctx.strokeStyle = color + '33'
    ctx.lineWidth = 1
    for (let i = 0; i < 10; i++) {
      const perspective = 1 - i * 0.08
      ctx.beginPath()
      ctx.moveTo(w * (0.5 - 0.4 * perspective), h * 0.9 - i * 15)
      ctx.lineTo(w * (0.5 + 0.4 * perspective), h * 0.9 - i * 15)
      ctx.stroke()
    }
    // Nodes
    const nodes = [
      { x: 0.3, y: 0.4 }, { x: 0.5, y: 0.3 }, { x: 0.7, y: 0.4 },
      { x: 0.25, y: 0.6 }, { x: 0.75, y: 0.6 }
    ]
    nodes.forEach((n, i) => {
      ctx.fillStyle = color
      ctx.beginPath()
      ctx.arc(w * n.x + Math.sin(time + i) * 5, h * n.y, 8, 0, Math.PI * 2)
      ctx.fill()
    })
    // Connections
    ctx.strokeStyle = color + '44'
    ctx.beginPath()
    ctx.moveTo(w * 0.5, h * 0.3)
    nodes.forEach(n => ctx.lineTo(w * n.x, h * n.y))
    ctx.stroke()
  },
  
  particles3D: (ctx, w, h, color, seed, time) => {
    ctx.fillStyle = '#0a0a14'
    ctx.fillRect(0, 0, w, h)
    const particles = []
    for (let i = 0; i < 50; i++) {
      particles.push({
        x: seededRandom(seed + i) * w,
        y: seededRandom(seed + i + 100) * h,
        size: seededRandom(seed + i + 200) * 3 + 1
      })
    }
    // Connections
    ctx.strokeStyle = color + '22'
    particles.forEach((p1, i) => {
      particles.slice(i + 1).forEach(p2 => {
        const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y)
        if (dist < 60) {
          ctx.beginPath()
          ctx.moveTo(p1.x, p1.y)
          ctx.lineTo(p2.x, p2.y)
          ctx.stroke()
        }
      })
    })
    // Dots
    particles.forEach(p => {
      ctx.fillStyle = color
      ctx.beginPath()
      ctx.arc(p.x + Math.sin(time + p.x) * 3, p.y + Math.cos(time + p.y) * 3, p.size, 0, Math.PI * 2)
      ctx.fill()
    })
  },
  
  holoGrid: (ctx, w, h, color, seed, time) => {
    ctx.fillStyle = '#000'
    ctx.fillRect(0, 0, w, h)
    // Perspective grid
    ctx.strokeStyle = color
    ctx.lineWidth = 1
    for (let i = 0; i < 15; i++) {
      const y = h * 0.4 + i * 10
      const spread = (i / 15) * 0.4
      ctx.globalAlpha = 1 - i * 0.05
      ctx.beginPath()
      ctx.moveTo(w * (0.5 - spread), y)
      ctx.lineTo(w * (0.5 + spread), y)
      ctx.stroke()
    }
    ctx.globalAlpha = 1
    // Vertical lines
    for (let i = 0; i < 8; i++) {
      const x = w * 0.2 + i * w * 0.08
      ctx.beginPath()
      ctx.moveTo(w / 2, h * 0.4)
      ctx.lineTo(x, h)
      ctx.stroke()
    }
    // Scan line
    const scanY = h * 0.4 + ((time * 30) % (h * 0.6))
    ctx.strokeStyle = color
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(0, scanY)
    ctx.lineTo(w, scanY)
    ctx.stroke()
  },
  
  neuralViz: (ctx, w, h, color, seed, time) => {
    ctx.fillStyle = '#0a0a14'
    ctx.fillRect(0, 0, w, h)
    // Layers
    const layers = [3, 5, 4, 2]
    const layerX = [0.15, 0.4, 0.65, 0.9]
    const nodes = []
    layers.forEach((count, li) => {
      for (let i = 0; i < count; i++) {
        nodes.push({
          x: w * layerX[li],
          y: h * (0.2 + (i / (count - 1 || 1)) * 0.6),
          layer: li
        })
      }
    })
    // Connections
    ctx.strokeStyle = color + '33'
    nodes.forEach(n1 => {
      nodes.forEach(n2 => {
        if (n2.layer === n1.layer + 1) {
          ctx.beginPath()
          ctx.moveTo(n1.x, n1.y)
          ctx.lineTo(n2.x, n2.y)
          ctx.stroke()
        }
      })
    })
    // Nodes
    nodes.forEach((n, i) => {
      const pulse = Math.sin(time * 3 + i) > 0.5
      ctx.fillStyle = pulse ? color : color + '66'
      ctx.beginPath()
      ctx.arc(n.x, n.y, pulse ? 6 : 4, 0, Math.PI * 2)
      ctx.fill()
    })
  },
  
  flowField: (ctx, w, h, color, seed, time) => {
    ctx.fillStyle = '#0d0508'
    ctx.fillRect(0, 0, w, h)
    // Flow lines
    for (let i = 0; i < 30; i++) {
      let x = seededRandom(seed + i) * w
      let y = seededRandom(seed + i + 100) * h
      ctx.strokeStyle = color + Math.floor(50 + seededRandom(seed + i + 200) * 100).toString(16)
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(x, y)
      for (let j = 0; j < 20; j++) {
        const angle = Math.sin(x * 0.02 + y * 0.02 + time) * Math.PI
        x += Math.cos(angle) * 5
        y += Math.sin(angle) * 5
        ctx.lineTo(x, y)
      }
      ctx.stroke()
    }
  },
  
  glitchText: (ctx, w, h, color, seed, time) => {
    ctx.fillStyle = '#0a0a0a'
    ctx.fillRect(0, 0, w, h)
    ctx.font = 'bold 24px monospace'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    // RGB shift
    const shift = Math.sin(time * 10) * 3
    ctx.fillStyle = '#ff000088'
    ctx.fillText('GLITCH', w / 2 - shift, h / 2)
    ctx.fillStyle = '#00ff0088'
    ctx.fillText('GLITCH', w / 2, h / 2)
    ctx.fillStyle = '#0000ff88'
    ctx.fillText('GLITCH', w / 2 + shift, h / 2)
    // Noise bars
    if (Math.random() > 0.8) {
      ctx.fillStyle = '#fff'
      ctx.fillRect(0, Math.random() * h, w, 2)
    }
  },
  
  audioViz: (ctx, w, h, color, seed, time) => {
    ctx.fillStyle = '#0a0a14'
    ctx.fillRect(0, 0, w, h)
    // Bars
    for (let i = 0; i < 20; i++) {
      const barH = Math.abs(Math.sin(time * 4 + i * 0.5)) * h * 0.7
      const hue = (i / 20) * 60
      ctx.fillStyle = `hsl(${hue + 300}, 100%, 50%)`
      ctx.fillRect(w * 0.05 + i * w * 0.045, h - barH - 10, w * 0.035, barH)
    }
    // Center circle
    const radius = 20 + Math.sin(time * 5) * 10
    ctx.strokeStyle = color
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.arc(w / 2, h * 0.3, radius, 0, Math.PI * 2)
    ctx.stroke()
  },

  // ========================================================================
  // 3D EFFECTS
  // ========================================================================
  galaxySpiral: (ctx, w, h, color, seed, time) => {
    ctx.fillStyle = '#050510'
    ctx.fillRect(0, 0, w, h)
    // Stars background
    for (let i = 0; i < 100; i++) {
      const sx = seededRandom(seed + i) * w
      const sy = seededRandom(seed + i + 50) * h
      const brightness = seededRandom(seed + i + 100) * 0.5
      ctx.fillStyle = `rgba(255,255,255,${brightness})`
      ctx.beginPath()
      ctx.arc(sx, sy, 1, 0, Math.PI * 2)
      ctx.fill()
    }
    // Spiral arms
    for (let arm = 0; arm < 2; arm++) {
      ctx.strokeStyle = color + '44'
      ctx.lineWidth = 2
      ctx.beginPath()
      for (let a = 0; a < Math.PI * 4; a += 0.1) {
        const r = 10 + a * 15
        const offset = arm * Math.PI
        const x = w / 2 + Math.cos(a + time * 0.2 + offset) * r
        const y = h / 2 + Math.sin(a + time * 0.2 + offset) * r * 0.4
        if (a === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.stroke()
    }
    // Center glow
    const gradient = ctx.createRadialGradient(w/2, h/2, 0, w/2, h/2, 30)
    gradient.addColorStop(0, color)
    gradient.addColorStop(1, 'transparent')
    ctx.fillStyle = gradient
    ctx.beginPath()
    ctx.arc(w/2, h/2, 30, 0, Math.PI * 2)
    ctx.fill()
  },

  tesseract: (ctx, w, h, color, seed, time) => {
    ctx.fillStyle = '#0a0a14'
    ctx.fillRect(0, 0, w, h)
    // Inner cube
    const s1 = 30
    const s2 = 60
    const cx = w / 2
    const cy = h / 2
    const rot = time * 0.5
    
    // Draw outer cube
    ctx.strokeStyle = color + '44'
    ctx.lineWidth = 1
    const outerPoints = [
      [-s2, -s2], [s2, -s2], [s2, s2], [-s2, s2]
    ].map(([x, y]) => [
      cx + x * Math.cos(rot) - y * Math.sin(rot) * 0.3,
      cy + x * Math.sin(rot) * 0.3 + y * Math.cos(rot) * 0.5
    ])
    ctx.beginPath()
    outerPoints.forEach((p, i) => {
      if (i === 0) ctx.moveTo(p[0], p[1])
      else ctx.lineTo(p[0], p[1])
    })
    ctx.closePath()
    ctx.stroke()
    
    // Draw inner cube
    ctx.strokeStyle = color
    ctx.lineWidth = 2
    const innerPoints = [
      [-s1, -s1], [s1, -s1], [s1, s1], [-s1, s1]
    ].map(([x, y]) => [
      cx + x * Math.cos(rot + 0.5) - y * Math.sin(rot + 0.5) * 0.3,
      cy + x * Math.sin(rot + 0.5) * 0.3 + y * Math.cos(rot + 0.5) * 0.5
    ])
    ctx.beginPath()
    innerPoints.forEach((p, i) => {
      if (i === 0) ctx.moveTo(p[0], p[1])
      else ctx.lineTo(p[0], p[1])
    })
    ctx.closePath()
    ctx.stroke()
    
    // Connect cubes
    ctx.strokeStyle = color + '66'
    ctx.lineWidth = 1
    for (let i = 0; i < 4; i++) {
      ctx.beginPath()
      ctx.moveTo(innerPoints[i][0], innerPoints[i][1])
      ctx.lineTo(outerPoints[i][0], outerPoints[i][1])
      ctx.stroke()
    }
  },

  proceduralTerrain: (ctx, w, h, color, seed, time) => {
    ctx.fillStyle = '#0a1a0a'
    ctx.fillRect(0, 0, w, h)
    // Sky gradient
    const skyGrad = ctx.createLinearGradient(0, 0, 0, h * 0.5)
    skyGrad.addColorStop(0, '#0a0a1a')
    skyGrad.addColorStop(1, '#1a2a3a')
    ctx.fillStyle = skyGrad
    ctx.fillRect(0, 0, w, h * 0.5)
    // Mountains/terrain
    ctx.fillStyle = color + '44'
    ctx.beginPath()
    ctx.moveTo(0, h)
    for (let x = 0; x <= w; x += 10) {
      const noiseVal = Math.sin(x * 0.02 + seed) * Math.cos(x * 0.01 + time * 0.5) * 50
      const y = h * 0.5 + noiseVal + Math.sin(x * 0.05) * 20
      ctx.lineTo(x, y)
    }
    ctx.lineTo(w, h)
    ctx.closePath()
    ctx.fill()
    // Foreground terrain
    ctx.fillStyle = color + '22'
    ctx.beginPath()
    ctx.moveTo(0, h)
    for (let x = 0; x <= w; x += 8) {
      const noiseVal = Math.sin(x * 0.03 + seed + 100) * Math.cos(x * 0.02 + time * 0.3) * 30
      const y = h * 0.7 + noiseVal
      ctx.lineTo(x, y)
    }
    ctx.lineTo(w, h)
    ctx.closePath()
    ctx.fill()
    // Grid overlay
    ctx.strokeStyle = color + '11'
    for (let y = h * 0.5; y < h; y += 20) {
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(w, y)
      ctx.stroke()
    }
  },

  // ========================================================================
  // UI/UX EFFECTS
  // ========================================================================
  dashboardUI: (ctx, w, h, color, seed, time) => {
    ctx.fillStyle = '#0a0a0a'
    ctx.fillRect(0, 0, w, h)
    // Grid
    ctx.strokeStyle = color + '22'
    for (let i = 0; i < 10; i++) {
      ctx.beginPath()
      ctx.moveTo(i * w / 10, 0)
      ctx.lineTo(i * w / 10, h)
      ctx.stroke()
    }
    // Bars chart
    for (let i = 0; i < 8; i++) {
      const barH = (seededRandom(seed + i) * 0.6 + 0.2) * h * 0.6 + Math.sin(time * 2 + i) * 10
      ctx.fillStyle = color
      ctx.fillRect(w * 0.1 + i * w * 0.1, h - barH - 20, w * 0.06, barH)
    }
    // Label
    ctx.font = '10px monospace'
    ctx.fillStyle = color
    ctx.fillText('SYSTEM STATUS', 10, 20)
  },

  terminalUI: (ctx, w, h, color, seed, time) => {
    ctx.fillStyle = '#0a0a0a'
    ctx.fillRect(0, 0, w, h)
    // Terminal lines
    ctx.font = '10px monospace'
    ctx.fillStyle = color
    const lines = ['$ whoami', 'neo@gldigitallab', '$ ls -la', 'projects/', 'skills/', '$ _']
    lines.forEach((line, i) => {
      const showLine = i <= Math.floor(time * 2) % (lines.length + 2)
      if (showLine) {
        ctx.fillStyle = i === lines.length - 1 && Math.sin(time * 5) > 0 ? color : (i === lines.length - 1 ? 'transparent' : color)
        ctx.fillText(line, 15, 25 + i * 18)
      }
    })
    // Border
    ctx.strokeStyle = color + '44'
    ctx.strokeRect(5, 5, w - 10, h - 10)
  },

  holoCards: (ctx, w, h, color, seed, time) => {
    ctx.fillStyle = '#0a0a14'
    ctx.fillRect(0, 0, w, h)
    // Stacked cards effect
    for (let i = 2; i >= 0; i--) {
      const offset = i * 15
      const cardW = w * 0.5
      const cardH = h * 0.6
      const x = w / 2 - cardW / 2 + offset
      const y = h / 2 - cardH / 2 - offset
      
      // Card
      ctx.fillStyle = `rgba(${20 + i * 10}, ${20 + i * 10}, ${30 + i * 10}, 0.9)`
      ctx.fillRect(x, y, cardW, cardH)
      
      // Holographic shine
      const gradient = ctx.createLinearGradient(x, y, x + cardW, y + cardH)
      gradient.addColorStop(0, 'transparent')
      gradient.addColorStop(0.5 + Math.sin(time * 2) * 0.3, color + '33')
      gradient.addColorStop(1, 'transparent')
      ctx.fillStyle = gradient
      ctx.fillRect(x, y, cardW, cardH)
      
      // Border
      ctx.strokeStyle = i === 0 ? color : color + '44'
      ctx.lineWidth = i === 0 ? 2 : 1
      ctx.strokeRect(x, y, cardW, cardH)
    }
  },

  memoryGame: (ctx, w, h, color, seed, time) => {
    ctx.fillStyle = '#0a0a14'
    ctx.fillRect(0, 0, w, h)
    // Card grid 4x3
    const cols = 4, rows = 3
    const cardW = w / (cols + 1)
    const cardH = h / (rows + 1)
    const gap = 8
    
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const x = (col + 0.5) * (w / cols)
        const y = (row + 0.5) * (h / rows)
        const isFlipped = seededRandom(seed + row * cols + col) > 0.5 || (row + col) % 3 === Math.floor(time) % 3
        
        if (isFlipped) {
          // Face up
          ctx.fillStyle = color + '33'
          ctx.fillRect(x - cardW/2 + gap/2, y - cardH/2 + gap/2, cardW - gap, cardH - gap)
          // Symbol
          ctx.font = '16px monospace'
          ctx.fillStyle = color
          ctx.textAlign = 'center'
          ctx.fillText(['♠', '♥', '♦', '♣', '★', '◆'][Math.floor(seededRandom(seed + row * cols + col + 50) * 6)], x, y + 6)
        } else {
          // Face down
          ctx.fillStyle = '#1a1a2a'
          ctx.fillRect(x - cardW/2 + gap/2, y - cardH/2 + gap/2, cardW - gap, cardH - gap)
          ctx.strokeStyle = color + '44'
          ctx.strokeRect(x - cardW/2 + gap/2, y - cardH/2 + gap/2, cardW - gap, cardH - gap)
        }
      }
    }
  },

  slotMachine: (ctx, w, h, color, seed, time) => {
    ctx.fillStyle = '#1a0a0a'
    ctx.fillRect(0, 0, w, h)
    // Machine frame
    ctx.strokeStyle = color
    ctx.lineWidth = 3
    ctx.strokeRect(w * 0.15, h * 0.2, w * 0.7, h * 0.5)
    
    // Reels
    const symbols = ['✦', '◆', '★', '7', '♣']
    const reelWidth = w * 0.2
    for (let i = 0; i < 3; i++) {
      const x = w * 0.2 + i * reelWidth
      // Reel background
      ctx.fillStyle = '#0a0a0a'
      ctx.fillRect(x, h * 0.25, reelWidth - 10, h * 0.4)
      // Symbol
      ctx.font = 'bold 30px sans-serif'
      ctx.fillStyle = color
      ctx.textAlign = 'center'
      const symbolIndex = Math.floor(time * (3 + i) + seededRandom(seed + i) * 10) % symbols.length
      ctx.fillText(symbols[symbolIndex], x + reelWidth / 2 - 5, h * 0.5)
    }
    // Lever
    ctx.fillStyle = '#ff4444'
    ctx.beginPath()
    ctx.arc(w * 0.9, h * 0.4, 10, 0, Math.PI * 2)
    ctx.fill()
    ctx.strokeStyle = '#ff4444'
    ctx.lineWidth = 4
    ctx.beginPath()
    ctx.moveTo(w * 0.9, h * 0.4)
    ctx.lineTo(w * 0.9, h * 0.6 + Math.sin(time * 8) * 10)
    ctx.stroke()
  },

  agentsHub: (ctx, w, h, color, seed, time) => {
    ctx.fillStyle = '#0a0505'
    ctx.fillRect(0, 0, w, h)
    // Agent nodes in circle
    const agents = ['J', 'E', 'U', 'F', 'V', 'P']
    const centerX = w / 2
    const centerY = h / 2
    const radius = Math.min(w, h) * 0.35
    
    // Connections
    ctx.strokeStyle = color + '22'
    ctx.lineWidth = 1
    agents.forEach((_, i) => {
      agents.forEach((_, j) => {
        if (i < j) {
          const a1 = (i / agents.length) * Math.PI * 2 - Math.PI / 2
          const a2 = (j / agents.length) * Math.PI * 2 - Math.PI / 2
          ctx.beginPath()
          ctx.moveTo(centerX + Math.cos(a1) * radius, centerY + Math.sin(a1) * radius)
          ctx.lineTo(centerX + Math.cos(a2) * radius, centerY + Math.sin(a2) * radius)
          ctx.stroke()
        }
      })
    })
    
    // Agents
    agents.forEach((agent, i) => {
      const angle = (i / agents.length) * Math.PI * 2 - Math.PI / 2
      const x = centerX + Math.cos(angle) * radius
      const y = centerY + Math.sin(angle) * radius
      const isActive = i === Math.floor(time) % agents.length
      
      // Node
      ctx.fillStyle = isActive ? color : color + '66'
      ctx.beginPath()
      ctx.arc(x, y, isActive ? 18 : 15, 0, Math.PI * 2)
      ctx.fill()
      
      // Label
      ctx.font = 'bold 12px monospace'
      ctx.fillStyle = '#000'
      ctx.textAlign = 'center'
      ctx.fillText(agent, x, y + 4)
    })
    
    // Center hub
    ctx.fillStyle = color
    ctx.beginPath()
    ctx.arc(centerX, centerY, 10, 0, Math.PI * 2)
    ctx.fill()
  },

  // ========================================================================
  // BRANDING EFFECTS
  // ========================================================================
  agentIcons: (ctx, w, h, color, seed, time) => {
    ctx.fillStyle = '#0a0a0a'
    ctx.fillRect(0, 0, w, h)
    // Grid of 7 icons
    const icons = ['J', 'E', 'U', 'F', 'V', 'R', 'P']
    const cols = 4
    icons.forEach((icon, i) => {
      const col = i % cols
      const row = Math.floor(i / cols)
      const x = (col + 0.5) * (w / cols)
      const y = (row + 0.5) * (h / 2) + h * 0.1
      
      // Circle
      ctx.strokeStyle = color
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.arc(x, y, 20, 0, Math.PI * 2)
      ctx.stroke()
      
      // Letter
      ctx.font = 'bold 16px monospace'
      ctx.fillStyle = color
      ctx.textAlign = 'center'
      ctx.fillText(icon, x, y + 6)
    })
  },

  typoSystem: (ctx, w, h, color, seed, time) => {
    ctx.fillStyle = '#0a0a0a'
    ctx.fillRect(0, 0, w, h)
    // Typography samples
    ctx.fillStyle = color
    ctx.font = 'bold 24px sans-serif'
    ctx.fillText('Aa', 20, 40)
    ctx.font = '16px monospace'
    ctx.fillText('JetBrains Mono', 20, 70)
    ctx.font = 'italic 14px serif'
    ctx.fillText('Playfair Display', 20, 95)
    ctx.font = '12px sans-serif'
    ctx.fillStyle = '#888'
    ctx.fillText('ABCDEFGHIJKLMNOPQRSTUVWXYZ', 20, 120)
    ctx.fillText('0123456789', 20, 140)
    // Size scale
    const sizes = [8, 10, 12, 14, 16, 20, 24]
    sizes.forEach((size, i) => {
      ctx.font = `${size}px monospace`
      ctx.fillStyle = color + Math.floor(40 + i * 20).toString(16).padStart(2, '0')
      ctx.fillText('Ag', w - 60, 30 + i * 20)
    })
  },

  loadingAnims: (ctx, w, h, color, seed, time) => {
    ctx.fillStyle = '#0a0a0a'
    ctx.fillRect(0, 0, w, h)
    // Multiple loading animations
    // Spinner
    ctx.strokeStyle = color
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.arc(w * 0.25, h * 0.4, 20, time * 3, time * 3 + Math.PI * 1.5)
    ctx.stroke()
    // Dots
    for (let i = 0; i < 3; i++) {
      const bounce = Math.sin(time * 5 + i * 0.5) * 10
      ctx.fillStyle = color
      ctx.beginPath()
      ctx.arc(w * 0.5 + i * 15 - 15, h * 0.4 - bounce, 5, 0, Math.PI * 2)
      ctx.fill()
    }
    // Bar
    ctx.fillStyle = color + '44'
    ctx.fillRect(w * 0.65, h * 0.35, w * 0.25, 10)
    ctx.fillStyle = color
    const barWidth = ((time * 0.5) % 1) * w * 0.25
    ctx.fillRect(w * 0.65, h * 0.35, barWidth, 10)
    // Labels
    ctx.font = '8px monospace'
    ctx.fillStyle = '#666'
    ctx.fillText('SPINNER', w * 0.18, h * 0.7)
    ctx.fillText('DOTS', w * 0.45, h * 0.7)
    ctx.fillText('PROGRESS', w * 0.7, h * 0.7)
  },

  // ========================================================================
  // PROJECT EFFECTS
  // ========================================================================
  arkadiaProject: (ctx, w, h, color, seed, time) => {
    ctx.fillStyle = '#0a150a'
    ctx.fillRect(0, 0, w, h)
    // Dino silhouette
    ctx.fillStyle = color + '33'
    ctx.beginPath()
    ctx.moveTo(w * 0.2, h * 0.8)
    ctx.lineTo(w * 0.35, h * 0.3)
    ctx.lineTo(w * 0.45, h * 0.25)
    ctx.lineTo(w * 0.5, h * 0.35)
    ctx.lineTo(w * 0.55, h * 0.4)
    ctx.lineTo(w * 0.7, h * 0.8)
    ctx.closePath()
    ctx.fill()
    // Server racks
    for (let i = 0; i < 3; i++) {
      const x = w * 0.65 + i * 30
      ctx.fillStyle = '#1a2a1a'
      ctx.fillRect(x, h * 0.3, 25, h * 0.5)
      // Lights
      for (let j = 0; j < 5; j++) {
        ctx.fillStyle = Math.sin(time * 3 + i + j) > 0 ? color : '#333'
        ctx.beginPath()
        ctx.arc(x + 12, h * 0.35 + j * 20, 3, 0, Math.PI * 2)
        ctx.fill()
      }
    }
    // Member count
    ctx.font = 'bold 14px monospace'
    ctx.fillStyle = color
    ctx.fillText('150+ MEMBERS', 15, h - 20)
  },

  voyageoProject: (ctx, w, h, color, seed, time) => {
    ctx.fillStyle = '#0a0a14'
    ctx.fillRect(0, 0, w, h)
    // Map grid
    ctx.strokeStyle = color + '22'
    ctx.lineWidth = 1
    for (let i = 0; i < 8; i++) {
      ctx.beginPath()
      ctx.moveTo(i * w / 8, 0)
      ctx.lineTo(i * w / 8, h)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(0, i * h / 8)
      ctx.lineTo(w, i * h / 8)
      ctx.stroke()
    }
    // Route
    ctx.strokeStyle = color
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(w * 0.2, h * 0.7)
    ctx.quadraticCurveTo(w * 0.5, h * 0.2, w * 0.8, h * 0.5)
    ctx.stroke()
    // Points
    const points = [[0.2, 0.7], [0.5, 0.35], [0.8, 0.5]]
    points.forEach(([px, py], i) => {
      ctx.fillStyle = i === Math.floor(time) % 3 ? color : color + '66'
      ctx.beginPath()
      ctx.arc(w * px, h * py, i === Math.floor(time) % 3 ? 8 : 5, 0, Math.PI * 2)
      ctx.fill()
    })
    // Plane
    const planePos = (time * 0.3) % 1
    const planeX = w * 0.2 + (w * 0.6) * planePos
    const planeY = h * 0.7 - Math.sin(planePos * Math.PI) * h * 0.35
    ctx.font = '16px sans-serif'
    ctx.fillStyle = '#fff'
    ctx.fillText('✈', planeX - 8, planeY + 5)
  },

  glFactoryStack: (ctx, w, h, color, seed, time) => {
    ctx.fillStyle = '#0a0a0a'
    ctx.fillRect(0, 0, w, h)
    // Docker containers stacked
    const containers = ['n8n', 'Ollama', 'PgSQL', 'Redis']
    containers.forEach((name, i) => {
      const y = h * 0.15 + i * (h * 0.2)
      const pulse = Math.sin(time * 2 + i) > 0.5
      
      // Container box
      ctx.fillStyle = pulse ? color + '33' : '#1a1a1a'
      ctx.fillRect(w * 0.15, y, w * 0.7, h * 0.15)
      ctx.strokeStyle = pulse ? color : color + '44'
      ctx.lineWidth = 1
      ctx.strokeRect(w * 0.15, y, w * 0.7, h * 0.15)
      
      // Name
      ctx.font = '10px monospace'
      ctx.fillStyle = pulse ? color : '#888'
      ctx.fillText(name, w * 0.2, y + h * 0.1)
      
      // Status indicator
      ctx.fillStyle = pulse ? '#00ff41' : '#888'
      ctx.beginPath()
      ctx.arc(w * 0.75, y + h * 0.075, 4, 0, Math.PI * 2)
      ctx.fill()
    })
    // Connection arrows
    ctx.strokeStyle = color + '44'
    ctx.setLineDash([5, 5])
    for (let i = 0; i < 3; i++) {
      ctx.beginPath()
      ctx.moveTo(w * 0.5, h * 0.3 + i * h * 0.2)
      ctx.lineTo(w * 0.5, h * 0.35 + i * h * 0.2)
      ctx.stroke()
    }
    ctx.setLineDash([])
  },

  portfolioMultivers: (ctx, w, h, color, seed, time) => {
    ctx.fillStyle = '#0a0a14'
    ctx.fillRect(0, 0, w, h)
    // Central node
    ctx.fillStyle = color
    ctx.beginPath()
    ctx.arc(w / 2, h / 2, 15, 0, Math.PI * 2)
    ctx.fill()
    // Orbiting universe nodes
    const universes = 8
    for (let i = 0; i < universes; i++) {
      const angle = (i / universes) * Math.PI * 2 + time * 0.3
      const dist = 50 + Math.sin(time + i) * 10
      const x = w / 2 + Math.cos(angle) * dist
      const y = h / 2 + Math.sin(angle) * dist * 0.6
      const hue = (i / universes) * 360
      
      // Connection
      ctx.strokeStyle = `hsla(${hue}, 70%, 50%, 0.3)`
      ctx.beginPath()
      ctx.moveTo(w / 2, h / 2)
      ctx.lineTo(x, y)
      ctx.stroke()
      
      // Node
      ctx.fillStyle = `hsl(${hue}, 70%, 50%)`
      ctx.beginPath()
      ctx.arc(x, y, 8, 0, Math.PI * 2)
      ctx.fill()
    }
  },

  // ========================================================================
  // APP EFFECTS
  // ========================================================================
  jsonFormatter: (ctx, w, h, color, seed, time) => {
    ctx.fillStyle = '#1a1a2e'
    ctx.fillRect(0, 0, w, h)
    // JSON preview
    ctx.font = '9px monospace'
    const json = [
      '{',
      '  "name": "Neo",',
      '  "role": "dev",',
      '  "skills": [',
      '    "Vue",',
      '    "Three.js"',
      '  ]',
      '}'
    ]
    json.forEach((line, i) => {
      if (i <= Math.floor(time * 3) % (json.length + 1)) {
        ctx.fillStyle = line.includes(':') ? color : (line.includes('[') || line.includes(']') ? '#ff6b35' : '#888')
        ctx.fillText(line, 15, 20 + i * 14)
      }
    })
  },

  regexTester: (ctx, w, h, color, seed, time) => {
    ctx.fillStyle = '#1a1a2e'
    ctx.fillRect(0, 0, w, h)
    // Pattern input
    ctx.fillStyle = '#2a2a3e'
    ctx.fillRect(10, 10, w - 20, 25)
    ctx.font = '10px monospace'
    ctx.fillStyle = color
    ctx.fillText('/[a-z]+@[a-z]+\\.[a-z]+/gi', 15, 27)
    // Test string with highlights
    ctx.fillStyle = '#2a2a3e'
    ctx.fillRect(10, 45, w - 20, 60)
    ctx.fillStyle = '#888'
    ctx.fillText('Contact: ', 15, 65)
    // Highlighted match
    ctx.fillStyle = color + '44'
    ctx.fillRect(70, 55, 100, 15)
    ctx.fillStyle = color
    ctx.fillText('neo@gllab.fr', 72, 67)
    // Match count
    ctx.fillStyle = '#888'
    ctx.fillText('1 match found', 15, 95)
  },

  colorConverter: (ctx, w, h, color, seed, time) => {
    ctx.fillStyle = '#0a0a0a'
    ctx.fillRect(0, 0, w, h)
    // Color preview
    const hue = (time * 30) % 360
    const previewColor = `hsl(${hue}, 70%, 50%)`
    ctx.fillStyle = previewColor
    ctx.fillRect(15, 15, 60, 60)
    ctx.strokeStyle = '#fff'
    ctx.strokeRect(15, 15, 60, 60)
    // Values
    ctx.font = '9px monospace'
    ctx.fillStyle = '#888'
    ctx.fillText('HEX', 90, 30)
    ctx.fillText('RGB', 90, 50)
    ctx.fillText('HSL', 90, 70)
    ctx.fillStyle = color
    ctx.fillText(`#${Math.floor(Math.sin(hue/60)*127+128).toString(16).padStart(2,'0')}ff41`, 120, 30)
    ctx.fillText(`rgb(${Math.floor(Math.sin(hue/60)*127+128)}, 255, 65)`, 120, 50)
    ctx.fillText(`hsl(${Math.floor(hue)}, 100%, 50%)`, 120, 70)
    // Palette
    const palette = ['#ff4444', '#44ff44', '#4444ff', '#ffff44', '#ff44ff', '#44ffff']
    palette.forEach((c, i) => {
      ctx.fillStyle = c
      ctx.fillRect(15 + i * 25, h - 30, 20, 20)
    })
  },

  promptBuilder: (ctx, w, h, color, seed, time) => {
    ctx.fillStyle = '#0a0a14'
    ctx.fillRect(0, 0, w, h)
    // Building blocks
    const blocks = ['ROLE', 'CONTEXT', 'TASK', 'FORMAT']
    blocks.forEach((block, i) => {
      const y = 15 + i * (h * 0.22)
      const width = w * 0.4 + Math.sin(time + i) * 20
      
      ctx.fillStyle = color + Math.floor(30 + i * 15).toString(16).padStart(2, '0')
      ctx.fillRect(15, y, width, h * 0.18)
      ctx.strokeStyle = color
      ctx.strokeRect(15, y, width, h * 0.18)
      
      ctx.font = '9px monospace'
      ctx.fillStyle = '#fff'
      ctx.fillText(block, 20, y + h * 0.12)
    })
    // Output arrow
    ctx.strokeStyle = color
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(w * 0.6, h / 2)
    ctx.lineTo(w * 0.8, h / 2)
    ctx.lineTo(w * 0.75, h / 2 - 10)
    ctx.moveTo(w * 0.8, h / 2)
    ctx.lineTo(w * 0.75, h / 2 + 10)
    ctx.stroke()
  },

  arkConfig: (ctx, w, h, color, seed, time) => {
    ctx.fillStyle = '#0a150a'
    ctx.fillRect(0, 0, w, h)
    // INI file preview
    ctx.font = '8px monospace'
    const config = [
      '[ServerSettings]',
      'DifficultyOffset=1.0',
      'XPMultiplier=2.0',
      'TamingSpeed=3.0',
      'HarvestAmount=2.0',
      '[/Script/ShooterGame]',
      'bAllowFlyerCarry=True'
    ]
    config.forEach((line, i) => {
      const isSection = line.startsWith('[')
      const isValue = line.includes('=')
      ctx.fillStyle = isSection ? color : (isValue ? '#888' : '#666')
      if (isValue) {
        const [key, val] = line.split('=')
        ctx.fillText(key + '=', 10, 18 + i * 13)
        ctx.fillStyle = color
        ctx.fillText(val, 10 + ctx.measureText(key + '=').width, 18 + i * 13)
      } else {
        ctx.fillText(line, 10, 18 + i * 13)
      }
    })
    // Edit indicator
    if (Math.sin(time * 4) > 0) {
      ctx.fillStyle = color
      ctx.fillRect(w - 15, 10, 5, 5)
    }
  },

  // ========================================================================
  // GENERATIF EXTRA
  // ========================================================================
  mandelbrot: (ctx, w, h, color, seed, time) => {
    ctx.fillStyle = '#000'
    ctx.fillRect(0, 0, w, h)
    // Simplified mandelbrot approximation
    const zoom = 50 + Math.sin(time * 0.5) * 30
    const offsetX = -0.5
    const offsetY = 0
    
    for (let px = 0; px < w; px += 4) {
      for (let py = 0; py < h; py += 4) {
        const x0 = (px - w / 2) / zoom + offsetX
        const y0 = (py - h / 2) / zoom + offsetY
        let x = 0, y = 0, iter = 0
        const maxIter = 20
        
        while (x * x + y * y <= 4 && iter < maxIter) {
          const xTemp = x * x - y * y + x0
          y = 2 * x * y + y0
          x = xTemp
          iter++
        }
        
        if (iter < maxIter) {
          const hue = (iter / maxIter) * 360 + time * 50
          ctx.fillStyle = `hsl(${hue % 360}, 100%, ${50 + iter * 2}%)`
          ctx.fillRect(px, py, 4, 4)
        }
      }
    }
  },

  gameOfLife: (ctx, w, h, color, seed, time) => {
    ctx.fillStyle = '#0a0a0a'
    ctx.fillRect(0, 0, w, h)
    // Grid of cells
    const cellSize = 8
    const cols = Math.floor(w / cellSize)
    const rows = Math.floor(h / cellSize)
    
    for (let col = 0; col < cols; col++) {
      for (let row = 0; row < rows; row++) {
        // Pseudo-random based on position and time
        const alive = Math.sin(col * 0.5 + row * 0.3 + time + seededRandom(seed + col + row * cols) * 10) > 0.3
        if (alive) {
          ctx.fillStyle = color + Math.floor(50 + Math.sin(time + col + row) * 30).toString(16).padStart(2, '0')
          ctx.fillRect(col * cellSize, row * cellSize, cellSize - 1, cellSize - 1)
        }
      }
    }
  },

  lorenzAttractor: (ctx, w, h, color, seed, time) => {
    ctx.fillStyle = '#0a0a14'
    ctx.fillRect(0, 0, w, h)
    // Draw Lorenz attractor path
    ctx.strokeStyle = color
    ctx.lineWidth = 1
    ctx.beginPath()
    
    let x = 0.1, y = 0, z = 0
    const sigma = 10, rho = 28, beta = 8/3
    const dt = 0.01
    const scale = 3
    
    for (let i = 0; i < 500; i++) {
      const dx = sigma * (y - x) * dt
      const dy = (x * (rho - z) - y) * dt
      const dz = (x * y - beta * z) * dt
      x += dx
      y += dy
      z += dz
      
      const px = w / 2 + x * scale
      const py = h / 2 + (z - 25) * scale * 0.5
      
      if (i === 0) ctx.moveTo(px, py)
      else ctx.lineTo(px, py)
    }
    ctx.stroke()
    
    // Current position
    ctx.fillStyle = '#fff'
    const progress = (time * 10) % 500
    ctx.beginPath()
    ctx.arc(w / 2 + Math.sin(progress * 0.1) * 30, h / 2 + Math.cos(progress * 0.1) * 20, 3, 0, Math.PI * 2)
    ctx.fill()
  },

  waveInterference: (ctx, w, h, color, seed, time) => {
    ctx.fillStyle = '#0a0a14'
    ctx.fillRect(0, 0, w, h)
    // Two wave sources
    const sources = [
      { x: w * 0.3, y: h * 0.5 },
      { x: w * 0.7, y: h * 0.5 }
    ]
    
    // Draw interference pattern
    for (let px = 0; px < w; px += 4) {
      for (let py = 0; py < h; py += 4) {
        let totalWave = 0
        sources.forEach(source => {
          const dist = Math.hypot(px - source.x, py - source.y)
          totalWave += Math.sin(dist * 0.1 - time * 3)
        })
        
        const intensity = (totalWave + 2) / 4
        ctx.fillStyle = `rgba(${Math.floor(intensity * 100)}, ${Math.floor(intensity * 200)}, ${Math.floor(intensity * 255)}, ${intensity})`
        ctx.fillRect(px, py, 4, 4)
      }
    }
    
    // Source points
    sources.forEach(source => {
      ctx.fillStyle = color
      ctx.beginPath()
      ctx.arc(source.x, source.y, 5, 0, Math.PI * 2)
      ctx.fill()
    })
  }
}

// Fallback
const renderEffect = (ctx, w, h, effectName, color, seed, time, itemId) => {
  // Récupérer l'image si elle existe
  const logoImg = loadedImages[itemId] || null
  
  if (effects[effectName]) {
    effects[effectName](ctx, w, h, color, seed, time, logoImg)
  } else {
    // Generic fallback
    ctx.fillStyle = '#0a0a0a'
    ctx.fillRect(0, 0, w, h)
    ctx.strokeStyle = color + '44'
    for (let i = 0; i < 10; i++) {
      ctx.beginPath()
      ctx.arc(w / 2, h / 2, 10 + i * 10, 0, Math.PI * 2)
      ctx.stroke()
    }
  }
}

// ============================================================================
// LIGHTBOX
// ============================================================================
const openLightbox = (item) => {
  lightboxItem.value = item
  currentIndex.value = filteredItems.value.findIndex(i => i.id === item.id)
  document.body.style.overflow = 'hidden'
  nextTick(() => {
    if (lightboxCanvas.value) {
      lightboxCanvas.value.width = lightboxCanvas.value.parentElement.offsetWidth
      lightboxCanvas.value.height = lightboxCanvas.value.parentElement.offsetHeight
    }
  })
}

const closeLightbox = () => {
  lightboxItem.value = null
  document.body.style.overflow = ''
}

const prevItem = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--
    lightboxItem.value = filteredItems.value[currentIndex.value]
  }
}

const nextItem = () => {
  if (currentIndex.value < filteredItems.value.length - 1) {
    currentIndex.value++
    lightboxItem.value = filteredItems.value[currentIndex.value]
  }
}

// Keyboard nav
const handleKeydown = (e) => {
  if (!lightboxItem.value) return
  if (e.key === 'Escape') closeLightbox()
  if (e.key === 'ArrowLeft') prevItem()
  if (e.key === 'ArrowRight') nextItem()
}

// ============================================================================
// HELPERS
// ============================================================================
const getCategoryIcon = (cat) => {
  const icons = {
    all: '◉',
    'Univers': '🌌',
    'UI/UX': '🎨',
    'Branding': '✦',
    '3D': '🔮',
    'Génératif': '⚡',
    'Projets': '🚀',
    'Apps': '🛠️'
  }
  return icons[cat] || '◆'
}

// ============================================================================
// CODE RAIN BACKGROUND
// ============================================================================
let rainCtx
const drops = []
const chars = 'アイウエオカキクケコ01'

const initRain = () => {
  const canvas = rainCanvas.value
  if (!canvas) return
  rainCtx = canvas.getContext('2d')
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  
  const columns = Math.floor(canvas.width / 20)
  drops.length = 0
  for (let i = 0; i < columns; i++) {
    drops.push(Math.random() * canvas.height)
  }
}

const drawRain = () => {
  if (!rainCtx) return
  rainCtx.fillStyle = 'rgba(0, 0, 0, 0.05)'
  rainCtx.fillRect(0, 0, rainCanvas.value.width, rainCanvas.value.height)
  
  rainCtx.fillStyle = '#00ff4115'
  rainCtx.font = '14px monospace'
  
  for (let i = 0; i < drops.length; i++) {
    const char = chars[Math.floor(Math.random() * chars.length)]
    rainCtx.fillText(char, i * 20, drops[i])
    
    if (drops[i] > rainCanvas.value.height && Math.random() > 0.98) {
      drops[i] = 0
    }
    drops[i] += 8
  }
}

// ============================================================================
// ANIMATION LOOP
// ============================================================================
const animate = () => {
  t += 0.016
  
  // Rain
  drawRain()
  
  // Item canvases
  filteredItems.value.forEach((item, index) => {
    const canvas = itemCanvases[item.id]
    if (canvas) {
      if (!canvas.width) {
        canvas.width = canvas.parentElement?.offsetWidth || 300
        canvas.height = canvas.parentElement?.offsetHeight || 200
      }
      const ctx = canvas.getContext('2d')
      renderEffect(ctx, canvas.width, canvas.height, item.effect, item.color, item.id * 1000, t, item.id)
    }
  })
  
  // Lightbox canvas
  if (lightboxItem.value && lightboxCanvas.value) {
    const ctx = lightboxCanvas.value.getContext('2d')
    renderEffect(ctx, lightboxCanvas.value.width, lightboxCanvas.value.height, lightboxItem.value.effect, lightboxItem.value.color, lightboxItem.value.id * 1000, t, lightboxItem.value.id)
  }
  
  animationId = requestAnimationFrame(animate)
}

// ============================================================================
// LIFECYCLE
// ============================================================================
onMounted(() => {
  loadItemImages() // Charger les images des items
  initRain()
  animate()
  window.addEventListener('resize', initRain)
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  if (animationId) cancelAnimationFrame(animationId)
  window.removeEventListener('resize', initRain)
  window.removeEventListener('keydown', handleKeydown)
  document.body.style.overflow = ''
})

// Re-init canvases on filter change
watch(activeFilter, () => {
  nextTick(() => {
    filteredItems.value.forEach(item => {
      const canvas = itemCanvases[item.id]
      if (canvas) {
        canvas.width = canvas.parentElement?.offsetWidth || 300
        canvas.height = canvas.parentElement?.offsetHeight || 200
      }
    })
  })
})
</script>

<style scoped>
.gallery-matrix {
  min-height: 100vh;
  background: #0a0a0a;
  color: #fff;
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  position: relative;
  overflow-x: hidden;
}

/* CODE RAIN */
.rain-canvas {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
}

/* SCANLINES */
.scanlines {
  position: fixed;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    rgba(0, 255, 65, 0.03) 2px,
    rgba(0, 255, 65, 0.03) 4px
  );
}

/* HEADER */
.gallery-header {
  position: relative;
  z-index: 10;
  padding: 6rem 2rem 4rem;
  max-width: 1400px;
  margin: 0 auto;
}

.header-content {
  margin-bottom: 3rem;
}

.header-tag {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.tag-bracket {
  color: #00ff41;
  font-size: 1.5rem;
}

.tag-text {
  font-size: 0.7rem;
  letter-spacing: 0.3em;
  color: #666;
}

.header-title {
  margin-bottom: 1.5rem;
}

.title-line {
  display: block;
  font-size: clamp(2rem, 8vw, 5rem);
  font-weight: 300;
  letter-spacing: 0.1em;
  color: #fff;
}

.title-accent {
  display: block;
  font-size: clamp(2rem, 8vw, 5rem);
  font-weight: 700;
  letter-spacing: 0.05em;
  color: #00ff41;
  text-shadow: 0 0 30px rgba(0, 255, 65, 0.5);
}

.header-desc {
  font-size: 0.85rem;
  color: #888;
  max-width: 500px;
  line-height: 1.8;
  margin-bottom: 2rem;
}

.header-stats {
  display: flex;
  gap: 3rem;
}

.stat {
  text-align: left;
}

.stat-value {
  display: block;
  font-size: 2rem;
  font-weight: 700;
  color: #00ff41;
}

.stat-label {
  font-size: 0.65rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: #666;
}

/* FILTERS */
.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.filter-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1.2rem;
  background: transparent;
  border: 1px solid #333;
  color: #888;
  font-family: inherit;
  font-size: 0.7rem;
  letter-spacing: 0.1em;
  cursor: pointer;
  transition: all 0.3s;
}

.filter-btn:hover {
  border-color: #00ff41;
  color: #00ff41;
}

.filter-btn.active {
  background: #00ff41;
  border-color: #00ff41;
  color: #000;
}

.filter-icon {
  font-size: 0.9rem;
}

/* GRID */
.gallery-grid {
  position: relative;
  z-index: 10;
  padding: 0 2rem 4rem;
  max-width: 1400px;
  margin: 0 auto;
}

.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}

/* GRID ITEM */
.gallery-item {
  position: relative;
  aspect-ratio: 4/3;
  cursor: pointer;
  overflow: hidden;
  background: #111;
  border: 1px solid #222;
  transition: all 0.4s cubic-bezier(0.4, 0, 0, 1);
  animation: itemFadeIn 0.6s ease forwards;
  animation-delay: var(--delay);
  opacity: 0;
}

@keyframes itemFadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.gallery-item.size-large {
  grid-column: span 2;
  aspect-ratio: 2/1;
}

.gallery-item.size-wide {
  grid-column: span 2;
}

.gallery-item:hover {
  border-color: var(--accent, #00ff41);
  box-shadow: 0 0 30px rgba(0, 255, 65, 0.2), inset 0 0 30px rgba(0, 255, 65, 0.05);
  transform: translateY(-5px);
}

.gallery-item.featured::before {
  content: 'FEATURED';
  position: absolute;
  top: 1rem;
  right: 1rem;
  z-index: 20;
  padding: 0.3rem 0.6rem;
  background: var(--accent, #00ff41);
  color: #000;
  font-size: 0.55rem;
  letter-spacing: 0.1em;
  font-weight: 700;
}

/* ITEM CANVAS */
.item-canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  transition: transform 0.6s;
}

.gallery-item:hover .item-canvas {
  transform: scale(1.05);
}

/* ITEM OVERLAY */
.item-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.9) 0%, transparent 50%);
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 1.5rem;
  opacity: 0;
  transition: opacity 0.4s;
}

.gallery-item:hover .item-overlay {
  opacity: 1;
}

/* SCAN LINE */
.scan-line {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--accent, #00ff41);
  box-shadow: 0 0 10px var(--accent, #00ff41);
  transform: translateY(-100%);
  transition: none;
}

.gallery-item:hover .scan-line {
  animation: scanDown 1s linear infinite;
}

@keyframes scanDown {
  from { transform: translateY(-100%); }
  to { transform: translateY(calc(100vh)); }
}

/* CORNERS */
.corner {
  position: absolute;
  width: 20px;
  height: 20px;
  border-color: var(--accent, #00ff41);
  border-style: solid;
  opacity: 0;
  transition: opacity 0.3s, transform 0.3s;
}

.corner.tl { top: 10px; left: 10px; border-width: 2px 0 0 2px; transform: translate(-5px, -5px); }
.corner.tr { top: 10px; right: 10px; border-width: 2px 2px 0 0; transform: translate(5px, -5px); }
.corner.bl { bottom: 10px; left: 10px; border-width: 0 0 2px 2px; transform: translate(-5px, 5px); }
.corner.br { bottom: 10px; right: 10px; border-width: 0 2px 2px 0; transform: translate(5px, 5px); }

.gallery-item:hover .corner {
  opacity: 1;
  transform: translate(0, 0);
}

/* ITEM INFO */
.item-info {
  transform: translateY(10px);
  transition: transform 0.4s;
}

.gallery-item:hover .item-info {
  transform: translateY(0);
}

.item-category {
  display: inline-block;
  font-size: 0.55rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--accent, #00ff41);
  margin-bottom: 0.5rem;
}

.item-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 0.3rem;
}

.item-desc {
  font-size: 0.75rem;
  color: #888;
  margin-bottom: 0.75rem;
}

.item-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.item-tag {
  padding: 0.2rem 0.5rem;
  background: rgba(255, 255, 255, 0.1);
  font-size: 0.6rem;
  color: #aaa;
}

/* VIEW BUTTON */
.view-btn {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(0.8);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: transparent;
  border: 1px solid var(--accent, #00ff41);
  color: var(--accent, #00ff41);
  font-family: inherit;
  font-size: 0.7rem;
  letter-spacing: 0.1em;
  cursor: pointer;
  opacity: 0;
  transition: all 0.3s;
}

.gallery-item:hover .view-btn {
  opacity: 1;
  transform: translate(-50%, -50%) scale(1);
}

.view-btn:hover {
  background: var(--accent, #00ff41);
  color: #000;
}

/* GLITCH LAYER */
.glitch-layer {
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: 0;
}

.gallery-item:hover .glitch-layer {
  animation: glitchFlicker 0.3s ease;
}

@keyframes glitchFlicker {
  0%, 100% { opacity: 0; }
  10% { opacity: 1; background: var(--accent); mix-blend-mode: overlay; }
  20% { opacity: 0; }
  30% { opacity: 1; transform: translateX(-2px); }
  40% { opacity: 0; transform: translateX(0); }
}

/* LIGHTBOX */
.lightbox {
  position: fixed;
  inset: 0;
  z-index: 1000;
  background: rgba(0, 0, 0, 0.95);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.lightbox-container {
  width: 100%;
  max-width: 1200px;
  max-height: 90vh;
  position: relative;
}

.lightbox-close {
  position: absolute;
  top: -3rem;
  right: 0;
  background: transparent;
  border: none;
  color: #666;
  font-family: inherit;
  font-size: 0.8rem;
  cursor: pointer;
  transition: color 0.3s;
}

.lightbox-close:hover {
  color: #00ff41;
}

.lightbox-close span {
  color: #00ff41;
}

.lightbox-content {
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: 3rem;
  align-items: start;
}

.lightbox-visual {
  position: relative;
  aspect-ratio: 16/10;
  background: #111;
  border: 1px solid #333;
}

.lightbox-canvas {
  width: 100%;
  height: 100%;
}

.visual-frame {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.frame-corner {
  position: absolute;
  width: 30px;
  height: 30px;
  border-color: #00ff41;
  border-style: solid;
}

.frame-corner.tl { top: -1px; left: -1px; border-width: 2px 0 0 2px; }
.frame-corner.tr { top: -1px; right: -1px; border-width: 2px 2px 0 0; }
.frame-corner.bl { bottom: -1px; left: -1px; border-width: 0 0 2px 2px; }
.frame-corner.br { bottom: -1px; right: -1px; border-width: 0 2px 2px 0; }

/* LIGHTBOX INFO */
.lightbox-info {
  padding: 1rem 0;
}

.info-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.info-id {
  font-size: 0.7rem;
  color: #444;
}

.info-category {
  font-size: 0.65rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
}

.info-title {
  font-size: 1.8rem;
  font-weight: 600;
  margin-bottom: 1rem;
  line-height: 1.2;
}

.info-desc {
  font-size: 0.85rem;
  color: #888;
  line-height: 1.8;
  margin-bottom: 2rem;
}

.info-meta {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding: 1rem 0;
  border-top: 1px solid #222;
  border-bottom: 1px solid #222;
}

.meta-item {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.meta-label {
  font-size: 0.6rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #666;
}

.meta-value {
  font-size: 0.8rem;
  color: #fff;
}

.info-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 2rem;
}

.info-tag {
  padding: 0.4rem 0.8rem;
  background: rgba(0, 255, 65, 0.1);
  border: 1px solid rgba(0, 255, 65, 0.3);
  font-size: 0.65rem;
  color: #00ff41;
}

.info-actions {
  display: flex;
  gap: 1rem;
}

.action-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1.5rem;
  background: transparent;
  border: 1px solid #00ff41;
  color: #00ff41;
  font-family: inherit;
  font-size: 0.75rem;
  letter-spacing: 0.1em;
  text-decoration: none;
  transition: all 0.3s;
}

.action-btn.primary {
  background: #00ff41;
  color: #000;
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 20px rgba(0, 255, 65, 0.3);
}

/* LIGHTBOX NAV */
.lightbox-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid #222;
}

.nav-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: transparent;
  border: 1px solid #333;
  color: #888;
  font-family: inherit;
  font-size: 0.7rem;
  cursor: pointer;
  transition: all 0.3s;
}

.nav-btn:hover:not(:disabled) {
  border-color: #00ff41;
  color: #00ff41;
}

.nav-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.nav-counter {
  font-size: 0.75rem;
  color: #666;
}

/* FOOTER */
.gallery-footer {
  position: relative;
  z-index: 10;
  padding: 3rem 2rem;
  border-top: 1px solid #1a1a1a;
}

.footer-content {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.footer-text {
  font-size: 0.65rem;
  letter-spacing: 0.15em;
  color: #444;
}

.footer-year {
  font-size: 0.65rem;
  color: #00ff41;
}

/* TRANSITIONS */
.lightbox-enter-active,
.lightbox-leave-active {
  transition: opacity 0.4s;
}

.lightbox-enter-from,
.lightbox-leave-to {
  opacity: 0;
}

.grid-enter-active,
.grid-leave-active {
  transition: all 0.4s ease;
}

.grid-enter-from,
.grid-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

.grid-move {
  transition: transform 0.4s ease;
}

/* RESPONSIVE */
@media (max-width: 1024px) {
  .lightbox-content {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  
  .gallery-item.size-large,
  .gallery-item.size-wide {
    grid-column: span 1;
    aspect-ratio: 4/3;
  }
}

@media (max-width: 768px) {
  .gallery-header {
    padding: 4rem 1rem 2rem;
  }
  
  .header-stats {
    gap: 2rem;
  }
  
  .filters {
    gap: 0.5rem;
  }
  
  .filter-btn {
    padding: 0.5rem 0.8rem;
    font-size: 0.6rem;
  }
  
  .gallery-grid {
    padding: 0 1rem 2rem;
  }
  
  .grid-container {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .lightbox {
    padding: 1rem;
  }
  
  .info-meta {
    grid-template-columns: 1fr;
  }
}
</style>
