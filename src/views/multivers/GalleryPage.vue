<template>
  <div class="gallery-page" :style="{ '--accent': currentUniverse?.colors.primary }">
    <!-- Back to Multivers -->
    <router-link to="/multivers" class="back-btn">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M19 12H5M12 19l-7-7 7-7"/>
      </svg>
      <span>Multivers</span>
    </router-link>

    <!-- Generator View -->
    <div class="generator" v-if="!generatedGallery">
      <header class="generator-header">
        <span class="generator-tag">Générateur de Galeries</span>
        <h1 class="generator-title">Choisissez votre <em>univers</em></h1>
        <p class="generator-desc">Sélectionnez un univers pour générer une galerie d'art complète avec son esthétique unique.</p>
      </header>

      <div class="universe-grid">
        <div 
          v-for="(universe, key) in universes" 
          :key="key"
          class="universe-option"
          :class="{ selected: selectedUniverse === key }"
          @click="selectUniverse(key)"
        >
          <div class="universe-option-bg" :style="{ background: `linear-gradient(135deg, ${universe.colors.bg} 0%, ${universe.colors.secondary}44 100%)` }"></div>
          <div class="universe-option-content">
            <h3 class="universe-option-name" :style="{ color: universe.colors.primary }">{{ universe.name }}</h3>
            <p class="universe-option-tagline">{{ universe.tagline }}</p>
            <div class="universe-option-accent" :style="{ background: universe.colors.primary }"></div>
          </div>
        </div>
      </div>

      <div class="generate-section">
        <button class="generate-btn" :disabled="!selectedUniverse" @click="generateGallery">
          <span>Générer la galerie</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- Generated Gallery View -->
    <div class="gallery-view" v-else>
      <button class="back-gallery-btn" @click="backToGenerator">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
        <span>Choisir un autre univers</span>
      </button>

      <!-- Preloader -->
      <div class="preloader" v-if="loading">
        <h2 class="preloader-title" :style="{ color: currentUniverse?.colors.primary }">{{ currentUniverse?.name }}</h2>
        <div class="preloader-bar">
          <div class="preloader-bar-fill" :style="{ width: loadingProgress + '%', background: currentUniverse?.colors.primary }"></div>
        </div>
        <span class="preloader-text">{{ loadingProgress }}%</span>
      </div>

      <!-- Hero -->
      <section class="gallery-hero" v-else>
        <canvas ref="heroCanvas" class="hero-canvas"></canvas>
        <div class="hero-content">
          <span class="hero-tag">Galerie d'Art</span>
          <h1 class="hero-title" :style="{ color: currentUniverse?.colors.primary }">{{ currentUniverse?.name }}</h1>
          <p class="hero-tagline">{{ currentUniverse?.tagline }}</p>
        </div>
        <div class="hero-scroll">
          <span>Scroll</span>
          <div class="hero-scroll-line" :style="{ background: `linear-gradient(to bottom, ${currentUniverse?.colors.primary}, transparent)` }"></div>
        </div>
      </section>

      <!-- Marquee -->
      <div class="marquee" v-if="!loading">
        <div class="marquee-track">
          <span v-for="(artwork, i) in [...currentUniverse?.artworks, ...currentUniverse?.artworks]" :key="i" class="marquee-item">
            {{ artwork.title }}
          </span>
        </div>
      </div>

      <!-- About -->
      <section class="about-section" v-if="!loading">
        <div class="about-visual">
          <canvas ref="aboutCanvas" class="about-canvas"></canvas>
        </div>
        <div class="about-content">
          <span class="about-tag" :style="{ color: currentUniverse?.colors.primary }">L'Univers</span>
          <h2 class="about-title">Bienvenue dans <em :style="{ color: currentUniverse?.colors.primary }">{{ currentUniverse?.name }}</em></h2>
          <p class="about-text">Une dimension artistique unique où chaque œuvre capture l'essence de cet univers. Explorez une collection exclusive d'artistes qui ont puisé leur inspiration dans cette réalité alternative.</p>
          <div class="about-stats">
            <div class="about-stat">
              <span class="stat-number" :style="{ color: currentUniverse?.colors.primary }">{{ currentUniverse?.artworks.length }}</span>
              <span class="stat-label">Œuvres</span>
            </div>
            <div class="about-stat">
              <span class="stat-number" :style="{ color: currentUniverse?.colors.primary }">{{ currentUniverse?.artworks.length }}</span>
              <span class="stat-label">Artistes</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Gallery Grid -->
      <section class="gallery-grid-section" v-if="!loading">
        <div class="section-header">
          <div>
            <span class="section-tag" :style="{ color: currentUniverse?.colors.primary }">Collection</span>
            <h2 class="section-title">Œuvres en vedette</h2>
          </div>
          <span class="section-count" :style="{ color: currentUniverse?.colors.primary }">{{ currentUniverse?.artworks.length }}</span>
        </div>

        <div class="gallery-grid">
          <article 
            v-for="(artwork, i) in currentUniverse?.artworks" 
            :key="i" 
            class="artwork"
            :class="'artwork-' + (i + 1)"
          >
            <div class="artwork-inner">
              <canvas :ref="el => artworkCanvases[i] = el" class="artwork-canvas"></canvas>
              <div class="artwork-overlay">
                <span class="artwork-label">
                  <span class="label-dot" :style="{ background: currentUniverse?.colors.primary }"></span>
                  {{ currentUniverse?.name }}
                </span>
                <h3 class="artwork-title">{{ artwork.title }}</h3>
                <p class="artwork-desc">{{ artwork.desc }}</p>
                <span class="artwork-meta">{{ artwork.artist }} • {{ artwork.year }}</span>
              </div>
            </div>
          </article>
        </div>
      </section>

      <!-- CTA -->
      <section class="cta-section" v-if="!loading">
        <div class="cta-rings">
          <div class="cta-ring" v-for="n in 3" :key="n" :style="{ borderColor: currentUniverse?.colors.primary }"></div>
        </div>
        <div class="cta-content">
          <span class="cta-tag" :style="{ color: currentUniverse?.colors.primary }">Explorer</span>
          <h2 class="cta-title">Prêt à entrer dans <em :style="{ color: currentUniverse?.colors.primary }">{{ currentUniverse?.name }}</em> ?</h2>
          <p class="cta-text">Cette galerie n'est qu'un aperçu. L'univers entier vous attend.</p>
          <router-link :to="currentUniverse?.route || '/multivers'" class="cta-btn">
            <span>Découvrir l'univers complet</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </router-link>
        </div>
      </section>

      <!-- Footer -->
      <footer class="gallery-footer" v-if="!loading">
        <div class="footer-inner">
          <span class="footer-brand" :style="{ color: currentUniverse?.colors.primary }">{{ currentUniverse?.name }} Gallery</span>
          <span class="footer-copy">© 2026 GL Digital Lab — Galerie Multivers</span>
        </div>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted, nextTick } from 'vue';

const selectedUniverse = ref(null);
const generatedGallery = ref(false);
const loading = ref(false);
const loadingProgress = ref(0);

const heroCanvas = ref(null);
const aboutCanvas = ref(null);
const artworkCanvases = reactive([]);

let animationId = null;
let t = 0;

// Universe Data avec effets uniques par œuvre
const universes = {
  matrix: {
    name: 'Matrix',
    tagline: 'Wake up, Neo. The Matrix has you.',
    route: '/matrix',
    colors: { primary: '#00ff41', secondary: '#003b00', bg: '#0a0a0a' },
    artworks: [
      { title: 'Cascade de Code', artist: 'Neo Arkadian', year: '2024', desc: 'La pluie verte du code source', effect: 'matrixRain' },
      { title: 'Le Choix des Pilules', artist: 'Morpheus Studio', year: '2024', desc: 'Rouge ou bleu, le destin bascule', effect: 'pills' },
      { title: 'Le Construct Blanc', artist: 'The Architect', year: '2023', desc: 'L\'infini du vide créatif', effect: 'construct' },
      { title: 'Bullet Time', artist: 'Trinity Arts', year: '2024', desc: 'Le temps se fige', effect: 'bulletTime' },
      { title: 'Sentinelles', artist: 'Zion Collective', year: '2023', desc: 'Les gardiens mécaniques', effect: 'sentinels' },
      { title: 'L\'Éveil', artist: 'Neo Arkadian', year: '2024', desc: 'Ouvrir les yeux sur le réel', effect: 'awakening' },
      { title: 'L\'Oracle', artist: 'Sybil Digital', year: '2023', desc: 'Les cookies de la vérité', effect: 'oracle' },
      { title: 'Agents en Costume', artist: 'Smith & Co', year: '2024', desc: 'La multiplication du contrôle', effect: 'agents' },
      { title: 'Le Téléphone Sonne', artist: 'Operator One', year: '2023', desc: 'La sortie de secours', effect: 'phone' },
      { title: 'Zion Underground', artist: 'Resistance Art', year: '2024', desc: 'La dernière ville humaine', effect: 'zion' }
    ]
  },
  tron: {
    name: 'TRON',
    tagline: 'The Grid. A digital frontier.',
    route: '/tron',
    colors: { primary: '#00d4ff', secondary: '#ff6600', bg: '#0a0a14' },
    artworks: [
      { title: 'Light Cycle Duel', artist: 'Flynn Digital', year: '2024', desc: 'La course lumineuse', effect: 'lightCycle' },
      { title: 'La Grille Infinie', artist: 'Grid Master', year: '2023', desc: 'Géométrie néon', effect: 'tronGrid' },
      { title: 'Identity Disc', artist: 'Quorra Arts', year: '2024', desc: 'L\'arme de l\'identité', effect: 'disc' },
      { title: 'End of Line Club', artist: 'Castor Studio', year: '2023', desc: 'Où les programmes dansent', effect: 'club' },
      { title: 'Recognizer Flight', artist: 'CLU Empire', year: '2024', desc: 'Les vaisseaux de surveillance', effect: 'recognizer' },
      { title: 'Le Portail', artist: 'ISO Collective', year: '2023', desc: 'La sortie vers le monde réel', effect: 'portal' },
      { title: 'Derezzed', artist: 'Daft Punk Visual', year: '2024', desc: 'La désintégration numérique', effect: 'derezzed' },
      { title: 'Sea of Simulation', artist: 'Flynn Digital', year: '2023', desc: 'L\'océan de données', effect: 'seaSim' },
      { title: 'Tron Legacy', artist: 'Program One', year: '2024', desc: 'L\'héritage du code', effect: 'legacy' },
      { title: 'Arena Combat', artist: 'Grid Games', year: '2023', desc: 'L\'arène des programmes', effect: 'arena' }
    ]
  },
  blade: {
    name: 'Blade Runner',
    tagline: 'All those moments will be lost in time.',
    route: '/blade-runner',
    colors: { primary: '#ff6b35', secondary: '#00a8cc', bg: '#1a0a05' },
    artworks: [
      { title: 'Larmes sous la Pluie', artist: 'Roy Batty', year: '2024', desc: 'Comme des larmes dans la pluie', effect: 'tearsRain' },
      { title: 'Néons de Los Angeles', artist: 'Tyrell Corp', year: '2023', desc: 'La ville qui ne dort jamais', effect: 'neonCity' },
      { title: 'Origami Licorne', artist: 'Gaff Studio', year: '2024', desc: 'Le message caché', effect: 'origami' },
      { title: 'Spinner au Crépuscule', artist: 'LAPD Air', year: '2023', desc: 'Au-dessus des tours', effect: 'spinner' },
      { title: 'Test Voight-Kampff', artist: 'Nexus Arts', year: '2024', desc: 'L\'empathie mesurée', effect: 'voightKampff' },
      { title: 'Pyramide Tyrell', artist: 'Corporate Vision', year: '2023', desc: 'Le siège du créateur', effect: 'pyramid' },
      { title: 'Mémoires Implantées', artist: 'Rachael Echo', year: '2024', desc: 'Les souvenirs d\'une autre', effect: 'memories' },
      { title: 'Baseline Test', artist: 'Officer K', year: '2023', desc: 'Intérieur, extérieur', effect: 'baseline' },
      { title: 'Colombe Blanche', artist: 'Batty Legacy', year: '2024', desc: 'L\'envol de l\'âme', effect: 'dove' },
      { title: 'Wallace Corp', artist: '2049 Studio', year: '2023', desc: 'Les nouveaux dieux', effect: 'wallace' }
    ]
  },
  ghost: {
    name: 'Ghost in the Shell',
    tagline: 'The net is vast and infinite.',
    route: '/ghost-in-the-shell',
    colors: { primary: '#e91e63', secondary: '#00bcd4', bg: '#0d1117' },
    artworks: [
      { title: 'Le Puppet Master', artist: 'Section 9', year: '2024', desc: 'L\'IA qui veut vivre', effect: 'puppetMaster' },
      { title: 'Plongée Neurale', artist: 'Major Kusanagi', year: '2023', desc: 'Connexion directe', effect: 'neuralDive' },
      { title: 'Corps Cybernétique', artist: 'Megatech Body', year: '2024', desc: 'La coquille parfaite', effect: 'cyberBody' },
      { title: 'Tachikoma Blues', artist: 'AI Tank Unit', year: '2023', desc: 'Les petits chars pensants', effect: 'tachikoma' },
      { title: 'Ghost Hack', artist: 'Togusa Vision', year: '2024', desc: 'L\'intrusion invisible', effect: 'ghostHack' },
      { title: 'Oeil de Batou', artist: 'Ranger Optics', year: '2023', desc: 'Voir au-delà du visible', effect: 'batouEye' },
      { title: 'Le Laughing Man', artist: 'Hacker Art', year: '2024', desc: 'Le terroriste numérique', effect: 'laughingMan' },
      { title: 'Aramaki Office', artist: 'Section Chief', year: '2023', desc: 'Le bureau du chef', effect: 'aramaki' },
      { title: 'Stand Alone Complex', artist: 'SAC Studio', year: '2024', desc: 'L\'effet papillon numérique', effect: 'sac' },
      { title: 'Réseau Infini', artist: 'Net Diver', year: '2023', desc: 'L\'océan de données', effect: 'infiniteNet' }
    ]
  },
  inception: {
    name: 'Inception',
    tagline: "You're waiting for a train.",
    route: '/inception',
    colors: { primary: '#ffd700', secondary: '#8b4513', bg: '#1a1508' },
    artworks: [
      { title: 'Les Limbes', artist: 'Dom Cobb', year: '2024', desc: 'L\'infini du subconscient', effect: 'limbo' },
      { title: 'La Toupie', artist: 'Totem Arts', year: '2023', desc: 'Réalité ou rêve ?', effect: 'totem' },
      { title: 'Escalier de Penrose', artist: 'Ariadne Design', year: '2024', desc: 'Géométrie impossible', effect: 'penrose' },
      { title: 'Paris Plié', artist: 'Dream Architect', year: '2023', desc: 'La ville se replie', effect: 'foldingCity' },
      { title: 'Le Kick', artist: 'Eames Studio', year: '2024', desc: 'La chute qui réveille', effect: 'kick' },
      { title: 'Train des Limbes', artist: 'Mal Memory', year: '2023', desc: 'Le souvenir qui hante', effect: 'limboTrain' },
      { title: 'Hôtel Gravité Zéro', artist: 'Arthur Float', year: '2024', desc: 'Le couloir qui tourne', effect: 'zeroGravity' },
      { title: 'Forteresse de Neige', artist: 'Fischer Target', year: '2023', desc: 'Le niveau le plus profond', effect: 'snowFortress' },
      { title: 'Sédation', artist: 'Yusuf Chimiste', year: '2024', desc: 'Le sommeil artificiel', effect: 'sedation' },
      { title: 'Projection Hostile', artist: 'Subconscious', year: '2023', desc: 'L\'esprit qui se défend', effect: 'projection' }
    ]
  },
  vendetta: {
    name: 'V pour Vendetta',
    tagline: 'Remember, remember the 5th of November.',
    route: '/v-for-vendetta',
    colors: { primary: '#ff0000', secondary: '#1a1a1a', bg: '#0d0000' },
    artworks: [
      { title: '5 Novembre', artist: 'Anonymous V', year: '2024', desc: 'Le jour où tout change', effect: 'november5' },
      { title: 'Masque de Guy Fawkes', artist: 'Evey Arts', year: '2023', desc: 'Le visage de la résistance', effect: 'guyFawkes' },
      { title: 'Dominos Rouges', artist: 'V Studio', year: '2024', desc: 'L\'effet de cascade', effect: 'dominos' },
      { title: 'Shadow Gallery', artist: 'Underground Art', year: '2023', desc: 'Le sanctuaire de la culture', effect: 'shadowGallery' },
      { title: 'Roses pour Valerie', artist: 'Memory Lane', year: '2024', desc: 'L\'amour interdit', effect: 'roses' },
      { title: 'Parliament Ablaze', artist: 'Revolution Art', year: '2023', desc: 'L\'édifice qui brûle', effect: 'parliament' },
      { title: 'Propagande', artist: 'Norsefire Design', year: '2024', desc: 'Le mensonge affiché', effect: 'propaganda' },
      { title: 'La Cellule', artist: 'Evey Rebirth', year: '2023', desc: 'La torture qui libère', effect: 'cell' },
      { title: 'Jukebox Underground', artist: 'Valerie Song', year: '2024', desc: 'La musique de la révolte', effect: 'jukebox' },
      { title: 'Idées Pare-Balles', artist: 'V Legacy', year: '2023', desc: 'Ce qui ne meurt jamais', effect: 'bulletproof' }
    ]
  },
  deadpool: {
    name: 'Deadpool',
    tagline: 'Maximum effort!',
    route: '/deadpool',
    colors: { primary: '#ff0033', secondary: '#000000', bg: '#1a0008' },
    artworks: [
      { title: 'Maximum Effort', artist: 'Wade Wilson', year: '2024', desc: 'L\'effort absolu', effect: 'maxEffort' },
      { title: 'Chimichanga Supreme', artist: 'Weasel Kitchen', year: '2023', desc: 'Le plat préféré', effect: 'chimichanga' },
      { title: 'Le 4ème Mur Brisé', artist: 'Meta Arts', year: '2024', desc: 'Je te vois, lecteur', effect: 'fourthWall' },
      { title: 'Régénération X', artist: 'Healing Factor', year: '2023', desc: 'Le corps qui repousse', effect: 'regeneration' },
      { title: 'Katanas Croisées', artist: 'Merc Studio', year: '2024', desc: 'Les armes favorites', effect: 'katanas' },
      { title: 'Baby Hand', artist: 'Regrowth Art', year: '2023', desc: 'La petite main qui repousse', effect: 'babyHand' },
      { title: 'Taxi de Dopinder', artist: 'Ride Share', year: '2024', desc: 'La course mortelle', effect: 'taxi' },
      { title: 'X-Force Portrait', artist: 'Cable Vision', year: '2023', desc: 'L\'équipe la plus courte', effect: 'xforce' },
      { title: 'Costume Rouge', artist: 'Tailor Made', year: '2024', desc: 'Pour cacher le sang', effect: 'redSuit' },
      { title: 'Emoji Masque', artist: 'Expression Art', year: '2023', desc: 'Les yeux qui parlent', effect: 'emoji' }
    ]
  },
  asimov: {
    name: 'Asimov',
    tagline: 'The Foundation will endure.',
    route: '/asimov',
    colors: { primary: '#8b5cf6', secondary: '#a855f7', bg: '#0a0a14' },
    artworks: [
      { title: 'La Fondation', artist: 'Hari Seldon', year: '2024', desc: 'Le plan millénaire', effect: 'foundation' },
      { title: 'Psychohistoire', artist: 'Mathématiciens', year: '2023', desc: 'Prédire l\'avenir', effect: 'psychohistory' },
      { title: 'Le Mulet', artist: 'Mutant Vision', year: '2024', desc: 'L\'anomalie du plan', effect: 'mule' },
      { title: 'Terminus', artist: 'Edge of Galaxy', year: '2023', desc: 'La planète aux confins', effect: 'terminus' },
      { title: 'Les Trois Lois', artist: 'Positronic Brain', year: '2024', desc: 'L\'éthique robotique', effect: 'threeLaws' },
      { title: 'Trantor', artist: 'Imperial City', year: '2023', desc: 'La planète-cité', effect: 'trantor' },
      { title: 'Seconde Fondation', artist: 'Hidden Masters', year: '2024', desc: 'Les gardiens secrets', effect: 'secondFoundation' },
      { title: 'Gaia Conscience', artist: 'Collective Mind', year: '2023', desc: 'La planète vivante', effect: 'gaia' },
      { title: 'R. Daneel Olivaw', artist: 'Robot Portrait', year: '2024', desc: 'Le robot éternel', effect: 'daneel' },
      { title: 'Galaxie Spirale', artist: 'Cosmic View', year: '2023', desc: 'L\'Empire qui s\'écroule', effect: 'galaxySpiral' }
    ]
  },
  cloudatlas: {
    name: 'Cloud Atlas',
    tagline: 'Our lives are not our own.',
    route: '/cloud-atlas',
    colors: { primary: '#14b8a6', secondary: '#f97316', bg: '#0a1210' },
    artworks: [
      { title: 'Âmes Connectées', artist: 'Sonmi-451', year: '2024', desc: 'Les vies entrelacées', effect: 'connectedSouls' },
      { title: 'Le Sextet Cloud Atlas', artist: 'Robert Frobisher', year: '2023', desc: 'La mélodie éternelle', effect: 'sextet' },
      { title: 'Lettre à Sixsmith', artist: 'Forbidden Love', year: '2024', desc: 'L\'amour par correspondance', effect: 'letter' },
      { title: 'Neo Seoul 2144', artist: 'Fabricant Art', year: '2023', desc: 'Le futur cloné', effect: 'neoSeoul' },
      { title: 'La Vallée', artist: 'Zachry Vision', year: '2024', desc: 'Après la Chute', effect: 'valley' },
      { title: 'Comète Birthmark', artist: 'Soul Mark', year: '2023', desc: 'La marque des réincarnés', effect: 'comet' },
      { title: 'Journal du Pacifique', artist: 'Adam Ewing', year: '2024', desc: 'Le voyage de 1849', effect: 'pacificJournal' },
      { title: 'Luisa Rey', artist: 'Journalist Art', year: '2023', desc: 'L\'enquêtrice courageuse', effect: 'luisaRey' },
      { title: 'Timothy Cavendish', artist: 'Comedy Drama', year: '2024', desc: 'L\'éditeur piégé', effect: 'cavendish' },
      { title: 'Réincarnation Cycle', artist: 'Eternal Return', year: '2023', desc: 'La roue des vies', effect: 'reincarnation' }
    ]
  },
  mask: {
    name: 'The Mask',
    tagline: "Ssssmokin'!",
    route: '/the-mask',
    colors: { primary: '#00ff00', secondary: '#ffff00', bg: '#0a1a0a' },
    artworks: [
      { title: 'SSSSMOKIN!', artist: 'Stanley Ipkiss', year: '2024', desc: 'L\'exclamation iconique', effect: 'smokin' },
      { title: 'Cuban Pete Dance', artist: 'Coco Bongo', year: '2023', desc: 'La danse endiabélée', effect: 'cubanPete' },
      { title: 'Physique Cartoon', artist: 'Toon Physics', year: '2024', desc: 'Les lois de l\'impossible', effect: 'cartoonPhysics' },
      { title: 'Tornado Vert', artist: 'Chaos Art', year: '2023', desc: 'Le tourbillon de folie', effect: 'tornado' },
      { title: 'Milo le Chien', artist: 'Faithful Dog', year: '2024', desc: 'Le meilleur ami masqué', effect: 'milo' },
      { title: 'Tina Carlyle', artist: 'Femme Fatale', year: '2023', desc: 'L\'amour impossible', effect: 'tina' },
      { title: 'Masque de Loki', artist: 'Norse Artifact', year: '2024', desc: 'L\'objet maudit', effect: 'lokiMask' },
      { title: 'Transformation', artist: 'Green Metamorphosis', year: '2023', desc: 'Le changement', effect: 'transformation' },
      { title: 'Flic Kellaway', artist: 'Law & Order', year: '2024', desc: 'L\'inspecteur dépassé', effect: 'kellaway' },
      { title: 'Coeur Géant', artist: 'Love Pop Out', year: '2023', desc: 'L\'amour qui déborde', effect: 'giantHeart' }
    ]
  },
  leekwars: {
    name: 'Leek Wars',
    tagline: 'Code your leek, fight for glory!',
    route: '/leek-wars',
    colors: { primary: '#7bc043', secondary: '#3e8914', bg: '#0a150a' },
    artworks: [
      { title: 'Code Cascade', artist: 'LeekScript Studio', year: '2026', desc: 'Le code qui pleut', effect: 'leekCode' },
      { title: 'Guerrier Poireau', artist: 'Potager Digital', year: '2025', desc: 'Le combattant vert', effect: 'leekWarrior' },
      { title: 'Arène de Combat', artist: 'Battle Arena', year: '2026', desc: 'Où les IAs s\'affrontent', effect: 'battleArena' },
      { title: 'Puces Équipées', artist: 'Chip Master', year: '2025', desc: 'L\'arsenal du poireau', effect: 'chipEquipment' },
      { title: 'Bracket Tournoi', artist: 'Tournament View', year: '2026', desc: 'La route vers la gloire', effect: 'tournament' },
      { title: 'Éditeur LeekScript', artist: 'Code Farmer', year: '2025', desc: 'Là où naît l\'intelligence', effect: 'leekScript' },
      { title: 'Slot d\'Arme', artist: 'Fusil Quantique', year: '2026', desc: 'Équipement de combat', effect: 'weaponSlot' },
      { title: 'Barres de Stats', artist: 'Progression RPG', year: '2025', desc: 'Force, Agilité, Sagesse...', effect: 'statsBars' },
      { title: 'Classement Ladder', artist: 'Rank Master', year: '2026', desc: 'Les meilleurs au sommet', effect: 'ladderRank' },
      { title: 'Combat d\'Équipe', artist: 'Team Battle', year: '2025', desc: '4v4 Éleveurs', effect: 'teamBattle' }
    ]
  }
};

const currentUniverse = computed(() => selectedUniverse.value ? universes[selectedUniverse.value] : null);

// Seeded random pour reproductibilité
const seededRandom = (seed) => {
  const x = Math.sin(seed * 9999) * 10000;
  return x - Math.floor(x);
};

// Effets visuels uniques par artwork
const artworkEffects = {
  // MATRIX
  matrixRain: (ctx, w, h, colors, seed, t) => {
    const chars = 'アイウエオカキクケコ0123456789';
    ctx.font = '12px monospace';
    for (let i = 0; i < 60; i++) {
      const x = seededRandom(seed + i) * w;
      const y = (seededRandom(seed + i + 100) * h + t * 80) % h;
      ctx.fillStyle = `${colors.primary}${Math.floor(seededRandom(seed + i + 200) * 200 + 55).toString(16)}`;
      ctx.fillText(chars[Math.floor(seededRandom(seed + i + 300) * chars.length)], x, y);
    }
  },
  pills: (ctx, w, h, colors, seed, t) => {
    ctx.fillStyle = '#ff0000';
    ctx.beginPath();
    ctx.ellipse(w * 0.35, h * 0.5 + Math.sin(t) * 5, 30, 15, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#0066ff';
    ctx.beginPath();
    ctx.ellipse(w * 0.65, h * 0.5 - Math.sin(t) * 5, 30, 15, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = colors.primary + '22';
    for (let i = 0; i < 20; i++) {
      ctx.beginPath();
      ctx.arc(seededRandom(seed + i) * w, seededRandom(seed + i + 50) * h, 2, 0, Math.PI * 2);
      ctx.fill();
    }
  },
  construct: (ctx, w, h, colors, seed, t) => {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = '#ddd';
    for (let i = 0; i < 15; i++) {
      ctx.beginPath();
      ctx.moveTo(0, i * h / 15);
      ctx.lineTo(w, i * h / 15);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(i * w / 15, 0);
      ctx.lineTo(i * w / 15, h);
      ctx.stroke();
    }
  },
  bulletTime: (ctx, w, h, colors, seed, t) => {
    for (let i = 0; i < 8; i++) {
      ctx.strokeStyle = `${colors.primary}${Math.floor((8 - i) * 25).toString(16).padStart(2, '0')}`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(w / 2, h / 2, 15 + i * 20 + Math.sin(t + i * 0.5) * 5, 0, Math.PI * 2);
      ctx.stroke();
    }
    for (let i = 0; i < 5; i++) {
      ctx.fillStyle = '#888';
      ctx.beginPath();
      ctx.ellipse(w * 0.15 + i * w * 0.17, h * 0.25, 3, 8, Math.PI / 4 + t * 0.1, 0, Math.PI * 2);
      ctx.fill();
    }
  },
  sentinels: (ctx, w, h, colors, seed, t) => {
    for (let s = 0; s < 3; s++) {
      const x = w * 0.25 + s * w * 0.25;
      const y = h * 0.4 + Math.sin(t + s) * 15;
      ctx.fillStyle = '#222';
      ctx.beginPath();
      ctx.ellipse(x, y, 18, 28, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#333';
      ctx.lineWidth = 2;
      for (let j = 0; j < 5; j++) {
        const angle = (j / 5) * Math.PI + Math.PI / 2 + Math.sin(t + j) * 0.2;
        ctx.beginPath();
        ctx.moveTo(x, y + 20);
        ctx.quadraticCurveTo(x + Math.cos(angle) * 25, y + 40, x + Math.cos(angle) * 15, y + 55);
        ctx.stroke();
      }
      ctx.fillStyle = '#ff0000';
      ctx.beginPath();
      ctx.arc(x, y - 8, 4, 0, Math.PI * 2);
      ctx.fill();
    }
  },
  awakening: (ctx, w, h, colors, seed, t) => {
    const openness = (Math.sin(t) + 1) / 2 * 25 + 15;
    ctx.strokeStyle = colors.primary;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.ellipse(w / 2, h / 2, 70, openness, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = colors.primary + '66';
    ctx.beginPath();
    ctx.arc(w / 2, h / 2, 18, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(w / 2, h / 2, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(w / 2 - 4, h / 2 - 4, 3, 0, Math.PI * 2);
    ctx.fill();
  },
  oracle: (ctx, w, h, colors, seed, t) => {
    for (let i = 0; i < 6; i++) {
      const x = w * 0.15 + i * w * 0.14;
      const y = h * 0.6 + seededRandom(seed + i) * 30;
      ctx.fillStyle = '#8B4513';
      ctx.beginPath();
      ctx.arc(x, y, 12, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#5a3a1a';
      for (let j = 0; j < 3; j++) {
        ctx.beginPath();
        ctx.arc(x + seededRandom(seed + i + j) * 10 - 5, y + seededRandom(seed + i + j + 20) * 10 - 5, 2, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.strokeStyle = '#ffffff15';
    ctx.lineWidth = 1;
    for (let i = 0; i < 8; i++) {
      ctx.beginPath();
      ctx.moveTo(w * 0.5 + Math.sin(t + i) * 10, h * 0.25);
      ctx.quadraticCurveTo(w * 0.5 + Math.sin(t * 2 + i) * 20, h * 0.15, w * 0.5 + Math.sin(t * 3 + i) * 25, h * 0.05);
      ctx.stroke();
    }
  },
  agents: (ctx, w, h, colors, seed, t) => {
    for (let i = 0; i < 5; i++) {
      const x = w * 0.12 + i * w * 0.19;
      const y = h * 0.5;
      ctx.fillStyle = '#111';
      ctx.fillRect(x - 12, y - 15, 24, 40);
      ctx.fillStyle = '#e0d8d0';
      ctx.beginPath();
      ctx.arc(x, y - 25, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#000';
      ctx.fillRect(x - 8, y - 27, 6, 3);
      ctx.fillRect(x + 2, y - 27, 6, 3);
    }
  },
  phone: (ctx, w, h, colors, seed, t) => {
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(w * 0.35, h * 0.3, w * 0.3, h * 0.4);
    ctx.fillStyle = '#111';
    ctx.beginPath();
    ctx.roundRect(w * 0.38, h * 0.33, w * 0.24, h * 0.07, 4);
    ctx.fill();
    ctx.strokeStyle = colors.primary;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(w * 0.5, h * 0.55, 25, 0, Math.PI * 2);
    ctx.stroke();
    for (let i = 0; i < 3; i++) {
      ctx.strokeStyle = colors.primary + Math.floor((3 - i) * 60).toString(16).padStart(2, '0');
      ctx.beginPath();
      ctx.arc(w * 0.5, h * 0.18, 15 + i * 12 + Math.sin(t * 3) * 4, Math.PI * 0.2, Math.PI * 0.8);
      ctx.stroke();
    }
  },
  zion: (ctx, w, h, colors, seed, t) => {
    ctx.fillStyle = '#0d0805';
    ctx.fillRect(0, 0, w, h);
    for (let i = 0; i < 6; i++) {
      ctx.strokeStyle = colors.primary + Math.floor(20 + i * 8).toString(16).padStart(2, '0');
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(w / 2, h + 40, 80 + i * 35, Math.PI, Math.PI * 2);
      ctx.stroke();
    }
    for (let i = 0; i < 25; i++) {
      ctx.fillStyle = colors.primary + '77';
      ctx.beginPath();
      ctx.arc(seededRandom(seed + i) * w, seededRandom(seed + i + 100) * h * 0.75, 1.5, 0, Math.PI * 2);
      ctx.fill();
    }
  },
  
  // TRON
  lightCycle: (ctx, w, h, colors, seed, t) => {
    ctx.strokeStyle = colors.primary + '33';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 10; i++) {
      ctx.beginPath();
      ctx.moveTo(i * w / 10, 0);
      ctx.lineTo(i * w / 10, h);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * h / 10);
      ctx.lineTo(w, i * h / 10);
      ctx.stroke();
    }
    ctx.strokeStyle = colors.primary;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(0, h * 0.7);
    ctx.lineTo(w * 0.25, h * 0.7);
    ctx.lineTo(w * 0.25, h * 0.35);
    ctx.lineTo(w * 0.55, h * 0.35);
    ctx.stroke();
    ctx.fillStyle = colors.primary;
    ctx.beginPath();
    ctx.moveTo(w * 0.55, h * 0.3);
    ctx.lineTo(w * 0.65, h * 0.35);
    ctx.lineTo(w * 0.55, h * 0.4);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = colors.secondary;
    ctx.beginPath();
    ctx.moveTo(w, h * 0.25);
    ctx.lineTo(w * 0.7, h * 0.25);
    ctx.lineTo(w * 0.7, h * 0.6);
    ctx.stroke();
  },
  tronGrid: (ctx, w, h, colors, seed, t) => {
    ctx.strokeStyle = colors.primary + '44';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 12; i++) {
      ctx.beginPath();
      ctx.moveTo(i * w / 12, 0);
      ctx.lineTo(i * w / 12, h);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * h / 12);
      ctx.lineTo(w, i * h / 12);
      ctx.stroke();
    }
    ctx.strokeStyle = colors.primary;
    ctx.lineWidth = 2;
    for (let i = 0; i < 3; i++) {
      const startX = seededRandom(seed + i) * w * 0.3;
      const startY = seededRandom(seed + i + 10) * h;
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(startX + w * 0.2, startY);
      ctx.lineTo(startX + w * 0.2, startY + h * 0.3);
      ctx.stroke();
    }
  },
  disc: (ctx, w, h, colors, seed, t) => {
    ctx.strokeStyle = colors.primary;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(w / 2, h / 2, 45, 0, Math.PI * 2);
    ctx.stroke();
    ctx.strokeStyle = colors.primary + '88';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(w / 2, h / 2, 32, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = colors.primary;
    ctx.beginPath();
    ctx.arc(w / 2, h / 2, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = colors.primary;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(w / 2, h / 2, 45, t % (Math.PI * 2), (t + Math.PI * 0.7) % (Math.PI * 2));
    ctx.stroke();
  },
  club: (ctx, w, h, colors, seed, t) => {
    ctx.strokeStyle = colors.primary + '22';
    for (let i = 0; i <= 8; i++) {
      ctx.beginPath();
      ctx.moveTo(i * w / 8, 0);
      ctx.lineTo(i * w / 8, h);
      ctx.stroke();
    }
    for (let i = 0; i < 10; i++) {
      const barH = Math.abs(Math.sin(t * 2 + i * 0.8)) * h * 0.6;
      ctx.fillStyle = i % 2 === 0 ? colors.primary : colors.secondary;
      ctx.fillRect(w * 0.08 + i * w * 0.085, h - barH, w * 0.06, barH);
    }
  },
  recognizer: (ctx, w, h, colors, seed, t) => {
    ctx.strokeStyle = colors.primary + '33';
    for (let i = 0; i <= 8; i++) {
      ctx.beginPath();
      ctx.moveTo(i * w / 8, 0);
      ctx.lineTo(i * w / 8, h);
      ctx.stroke();
    }
    const y = h * 0.3 + Math.sin(t) * 15;
    ctx.fillStyle = '#0a0a14';
    ctx.beginPath();
    ctx.moveTo(w * 0.3, y + 50);
    ctx.lineTo(w * 0.3, y);
    ctx.lineTo(w * 0.5, y - 18);
    ctx.lineTo(w * 0.7, y);
    ctx.lineTo(w * 0.7, y + 50);
    ctx.lineTo(w * 0.6, y + 50);
    ctx.lineTo(w * 0.6, y + 18);
    ctx.lineTo(w * 0.4, y + 18);
    ctx.lineTo(w * 0.4, y + 50);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = colors.primary;
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = colors.secondary;
    ctx.beginPath();
    ctx.arc(w * 0.37, y + 8, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(w * 0.63, y + 8, 4, 0, Math.PI * 2);
    ctx.fill();
  },
  portal: (ctx, w, h, colors, seed, t) => {
    for (let i = 0; i < 6; i++) {
      ctx.strokeStyle = `${colors.primary}${Math.floor((6 - i) * 35).toString(16).padStart(2, '0')}`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(w / 2, h / 2, 25 + i * 18 + Math.sin(t + i) * 5, 40 + i * 25, 0, 0, Math.PI * 2);
      ctx.stroke();
    }
    const gradient = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, 25);
    gradient.addColorStop(0, '#ffffff');
    gradient.addColorStop(1, colors.primary + '00');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(w / 2, h / 2, 25, 0, Math.PI * 2);
    ctx.fill();
  },
  derezzed: (ctx, w, h, colors, seed, t) => {
    for (let i = 0; i < 120; i++) {
      const x = w * 0.25 + seededRandom(seed + i) * w * 0.5;
      const y = seededRandom(seed + i + 100) * h;
      const size = 2 + seededRandom(seed + i + 200) * 6;
      const phase = (seededRandom(seed + i + 300) + t * 0.3) % 1;
      const alpha = Math.max(0, 1 - phase);
      ctx.fillStyle = `${colors.primary}${Math.floor(alpha * 200).toString(16).padStart(2, '0')}`;
      ctx.fillRect(x, y + phase * 30, size, size);
    }
  },
  seaSim: (ctx, w, h, colors, seed, t) => {
    for (let y = 0; y < h; y += 15) {
      ctx.strokeStyle = colors.primary + '55';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, y);
      for (let x = 0; x < w; x += 8) {
        ctx.lineTo(x, y + Math.sin((x + t * 60) * 0.025 + y * 0.01) * 8);
      }
      ctx.stroke();
    }
  },
  legacy: (ctx, w, h, colors, seed, t) => {
    ctx.strokeStyle = colors.primary + '33';
    for (let i = 0; i <= 8; i++) {
      ctx.beginPath();
      ctx.moveTo(i * w / 8, 0);
      ctx.lineTo(i * w / 8, h);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * h / 8);
      ctx.lineTo(w, i * h / 8);
      ctx.stroke();
    }
    ctx.font = 'bold 36px sans-serif';
    ctx.fillStyle = colors.primary;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('TRON', w / 2, h / 2);
  },
  arena: (ctx, w, h, colors, seed, t) => {
    ctx.strokeStyle = colors.primary + '33';
    for (let i = 0; i < 12; i++) {
      ctx.beginPath();
      ctx.ellipse(w / 2, h * 0.85, w * 0.35, 12 + i * 8, 0, 0, Math.PI);
      ctx.stroke();
    }
    ctx.fillStyle = colors.primary;
    ctx.beginPath();
    ctx.arc(w * 0.35, h * 0.45, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = colors.secondary;
    ctx.beginPath();
    ctx.arc(w * 0.65, h * 0.45, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = colors.primary + '66';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(w * 0.35, h * 0.45);
    ctx.lineTo(w * 0.65, h * 0.45);
    ctx.stroke();
  },

  // BLADE RUNNER
  tearsRain: (ctx, w, h, colors, seed, t) => {
    ctx.strokeStyle = '#ffffff22';
    for (let i = 0; i < 60; i++) {
      const x = seededRandom(seed + i) * w;
      const y = (seededRandom(seed + i + 100) * h + t * 120) % h;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + 0.5, y + 12);
      ctx.stroke();
    }
    ctx.fillStyle = colors.secondary + '99';
    ctx.beginPath();
    ctx.moveTo(w / 2, h * 0.35);
    ctx.quadraticCurveTo(w / 2 + 12, h * 0.45, w / 2, h * 0.55);
    ctx.quadraticCurveTo(w / 2 - 12, h * 0.45, w / 2, h * 0.35);
    ctx.fill();
  },
  neonCity: (ctx, w, h, colors, seed, t) => {
    for (let i = 0; i < 12; i++) {
      const bh = seededRandom(seed + i) * h * 0.55 + h * 0.2;
      const bw = w * 0.065;
      const x = i * w * 0.083;
      ctx.fillStyle = '#0a0808';
      ctx.fillRect(x, h - bh, bw, bh);
      for (let fy = h - bh + 8; fy < h - 8; fy += 12) {
        for (let fx = x + 4; fx < x + bw - 4; fx += 8) {
          if (seededRandom(seed + fx + fy) > 0.45) {
            ctx.fillStyle = seededRandom(seed + fx + fy + 50) > 0.5 ? colors.primary + 'aa' : colors.secondary + 'aa';
            ctx.fillRect(fx, fy, 4, 6);
          }
        }
      }
    }
  },
  origami: (ctx, w, h, colors, seed, t) => {
    ctx.strokeStyle = '#ffffffcc';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(w * 0.3, h * 0.65);
    ctx.lineTo(w * 0.5, h * 0.35);
    ctx.lineTo(w * 0.7, h * 0.65);
    ctx.lineTo(w * 0.6, h * 0.72);
    ctx.lineTo(w * 0.4, h * 0.72);
    ctx.closePath();
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(w * 0.5, h * 0.35);
    ctx.lineTo(w * 0.55, h * 0.22);
    ctx.lineTo(w * 0.6, h * 0.32);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(w * 0.55, h * 0.22);
    ctx.lineTo(w * 0.55, h * 0.12);
    ctx.stroke();
    ctx.fillStyle = '#ffffff33';
    ctx.beginPath();
    ctx.moveTo(w * 0.3, h * 0.65);
    ctx.lineTo(w * 0.5, h * 0.35);
    ctx.lineTo(w * 0.5, h * 0.65);
    ctx.closePath();
    ctx.fill();
  },
  spinner: (ctx, w, h, colors, seed, t) => {
    for (let i = 0; i < 8; i++) {
      const bh = seededRandom(seed + i) * h * 0.4 + h * 0.15;
      ctx.fillStyle = '#111';
      ctx.fillRect(i * w * 0.12, h - bh, w * 0.08, bh);
    }
    const y = h * 0.28 + Math.sin(t) * 12;
    ctx.fillStyle = '#222';
    ctx.beginPath();
    ctx.ellipse(w * 0.5, y, 28, 10, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = colors.primary;
    ctx.beginPath();
    ctx.arc(w * 0.44, y, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ff0000';
    ctx.beginPath();
    ctx.arc(w * 0.56, y, 3, 0, Math.PI * 2);
    ctx.fill();
  },
  voightKampff: (ctx, w, h, colors, seed, t) => {
    ctx.strokeStyle = colors.primary;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(w / 2, h / 2, 55, 22, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.strokeStyle = colors.secondary;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(w / 2, h / 2, 18, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(w / 2, h / 2, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = colors.primary;
    ctx.fillRect(w / 2 - 2, h / 2 - 4, 2, 3);
  },
  pyramid: (ctx, w, h, colors, seed, t) => {
    ctx.fillStyle = '#111';
    ctx.beginPath();
    ctx.moveTo(w * 0.2, h * 0.85);
    ctx.lineTo(w * 0.5, h * 0.18);
    ctx.lineTo(w * 0.8, h * 0.85);
    ctx.closePath();
    ctx.fill();
    for (let i = 0; i < 25; i++) {
      ctx.fillStyle = colors.primary + '99';
      const py = h * 0.28 + seededRandom(seed + i) * h * 0.45;
      const px = w * 0.32 + seededRandom(seed + i + 50) * w * 0.36;
      ctx.fillRect(px, py, 2, 2);
    }
    ctx.fillStyle = colors.secondary;
    ctx.beginPath();
    ctx.arc(w * 0.5, h * 0.2, 5, 0, Math.PI * 2);
    ctx.fill();
  },
  memories: (ctx, w, h, colors, seed, t) => {
    for (let i = 0; i < 5; i++) {
      const x = w * 0.12 + i * w * 0.19;
      const y = h * 0.35 + Math.sin(t + i * 0.8) * 8;
      const rot = seededRandom(seed + i) * 0.25 - 0.125;
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rot);
      ctx.fillStyle = '#f5f5f0';
      ctx.fillRect(-18, -22, 36, 44);
      ctx.fillStyle = '#1a1a1a';
      ctx.fillRect(-15, -19, 30, 30);
      ctx.restore();
    }
  },
  baseline: (ctx, w, h, colors, seed, t) => {
    ctx.font = '11px monospace';
    ctx.fillStyle = colors.primary + 'aa';
    const texts = ['CELLS', 'INTERLINKED', 'WITHIN', 'CELLS'];
    for (let i = 0; i < texts.length; i++) {
      ctx.fillText(texts[i], w * 0.32, h * 0.25 + i * 22);
    }
    ctx.fillStyle = colors.secondary;
    ctx.fillRect(w * 0.32, h * 0.68, ((Math.sin(t) + 1) / 2) * w * 0.36, 3);
  },
  dove: (ctx, w, h, colors, seed, t) => {
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.ellipse(w / 2, h / 2, 22, 14, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(w / 2, h / 2 - 8);
    ctx.quadraticCurveTo(w / 2 + 35, h / 2 - 35 + Math.sin(t * 4) * 8, w / 2 + 42, h / 2 - 18);
    ctx.quadraticCurveTo(w / 2 + 28, h / 2, w / 2, h / 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(w / 2 - 18, h / 2 - 4, 9, 0, Math.PI * 2);
    ctx.fill();
  },
  wallace: (ctx, w, h, colors, seed, t) => {
    ctx.fillStyle = '#0d0500';
    ctx.fillRect(0, 0, w, h);
    for (let i = 0; i < 12; i++) {
      ctx.strokeStyle = colors.primary + Math.floor(15 + i * 4).toString(16).padStart(2, '0');
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, h * i / 12);
      ctx.lineTo(w, h * i / 12 + Math.sin(t + i * 0.5) * 18);
      ctx.stroke();
    }
  },

  // GHOST IN THE SHELL
  puppetMaster: (ctx, w, h, colors, seed, t) => {
    for (let i = 0; i < 8; i++) {
      ctx.strokeStyle = colors.primary + '44';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(w * 0.1 + i * w * 0.1, 0);
      ctx.quadraticCurveTo(w * 0.1 + i * w * 0.1 + Math.sin(t + i) * 20, h * 0.5, w * 0.5, h);
      ctx.stroke();
    }
    ctx.fillStyle = colors.primary + '33';
    ctx.beginPath();
    ctx.arc(w / 2, h * 0.4, 25, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(w / 2 - 15, h * 0.4 + 20, 30, 45);
  },
  neuralDive: (ctx, w, h, colors, seed, t) => {
    for (let i = 0; i < 15; i++) {
      const depth = (i / 15 + t * 0.1) % 1;
      const size = depth * 100;
      ctx.strokeStyle = `${colors.primary}${Math.floor((1 - depth) * 150).toString(16).padStart(2, '0')}`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(w / 2, h / 2, size, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.fillStyle = colors.secondary;
    ctx.beginPath();
    ctx.arc(w / 2, h / 2, 8, 0, Math.PI * 2);
    ctx.fill();
  },
  cyberBody: (ctx, w, h, colors, seed, t) => {
    ctx.strokeStyle = colors.primary;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(w / 2, h * 0.25, 20, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(w / 2, h * 0.3);
    ctx.lineTo(w / 2, h * 0.6);
    ctx.moveTo(w * 0.35, h * 0.35);
    ctx.lineTo(w * 0.65, h * 0.35);
    ctx.moveTo(w / 2, h * 0.6);
    ctx.lineTo(w * 0.4, h * 0.85);
    ctx.moveTo(w / 2, h * 0.6);
    ctx.lineTo(w * 0.6, h * 0.85);
    ctx.stroke();
    ctx.strokeStyle = colors.secondary + '66';
    for (let i = 0; i < 8; i++) {
      ctx.beginPath();
      ctx.arc(w / 2, h * 0.45, 5 + i * 8, Math.PI * 0.2, Math.PI * 0.8);
      ctx.stroke();
    }
  },
  tachikoma: (ctx, w, h, colors, seed, t) => {
    const bounce = Math.sin(t * 3) * 5;
    ctx.fillStyle = colors.secondary;
    ctx.beginPath();
    ctx.ellipse(w / 2, h * 0.5 + bounce, 40, 25, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = colors.primary;
    ctx.beginPath();
    ctx.arc(w / 2 - 15, h * 0.45 + bounce, 10, 0, Math.PI * 2);
    ctx.arc(w / 2 + 15, h * 0.45 + bounce, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(w / 2 - 15, h * 0.45 + bounce, 4, 0, Math.PI * 2);
    ctx.arc(w / 2 + 15, h * 0.45 + bounce, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = colors.secondary;
    ctx.lineWidth = 3;
    for (let i = 0; i < 4; i++) {
      const angle = (i / 4) * Math.PI + Math.PI / 4;
      ctx.beginPath();
      ctx.moveTo(w / 2 + Math.cos(angle) * 35, h * 0.5 + bounce + 15);
      ctx.lineTo(w / 2 + Math.cos(angle) * 50, h * 0.75);
      ctx.stroke();
    }
  },
  ghostHack: (ctx, w, h, colors, seed, t) => {
    ctx.font = '10px monospace';
    const chars = '01アイウエオ';
    for (let i = 0; i < 40; i++) {
      const x = seededRandom(seed + i) * w;
      const y = (seededRandom(seed + i + 100) * h + t * 100) % h;
      ctx.fillStyle = `${colors.primary}${Math.floor(seededRandom(seed + i + 200) * 200 + 55).toString(16)}`;
      ctx.fillText(chars[Math.floor(seededRandom(seed + i + 300) * chars.length)], x, y);
    }
    ctx.strokeStyle = colors.primary;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(w / 2, h / 2, 30 + Math.sin(t * 2) * 10, 0, Math.PI * 2);
    ctx.stroke();
  },
  batouEye: (ctx, w, h, colors, seed, t) => {
    ctx.strokeStyle = colors.secondary;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(w / 2, h / 2, 50, 0, Math.PI * 2);
    ctx.stroke();
    for (let i = 0; i < 8; i++) {
      ctx.strokeStyle = colors.primary;
      ctx.lineWidth = 2;
      const angle = (i / 8) * Math.PI * 2 + t;
      ctx.beginPath();
      ctx.moveTo(w / 2 + Math.cos(angle) * 20, h / 2 + Math.sin(angle) * 20);
      ctx.lineTo(w / 2 + Math.cos(angle) * 40, h / 2 + Math.sin(angle) * 40);
      ctx.stroke();
    }
    ctx.fillStyle = '#ff0000';
    ctx.beginPath();
    ctx.arc(w / 2, h / 2, 10, 0, Math.PI * 2);
    ctx.fill();
  },
  laughingMan: (ctx, w, h, colors, seed, t) => {
    ctx.strokeStyle = colors.secondary;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(w / 2, h / 2, 45, 0, Math.PI * 2);
    ctx.stroke();
    ctx.strokeStyle = colors.primary;
    ctx.lineWidth = 1;
    for (let i = 0; i < 20; i++) {
      const angle = (i / 20) * Math.PI * 2 + t * 0.5;
      ctx.beginPath();
      ctx.arc(w / 2 + Math.cos(angle) * 55, h / 2 + Math.sin(angle) * 55, 3, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.fillStyle = colors.secondary;
    ctx.beginPath();
    ctx.arc(w / 2 - 15, h / 2 - 10, 5, 0, Math.PI * 2);
    ctx.arc(w / 2 + 15, h / 2 - 10, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = colors.secondary;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(w / 2, h / 2 + 5, 20, 0.1 * Math.PI, 0.9 * Math.PI);
    ctx.stroke();
  },
  aramaki: (ctx, w, h, colors, seed, t) => {
    ctx.fillStyle = '#111';
    ctx.fillRect(w * 0.1, h * 0.6, w * 0.8, h * 0.3);
    for (let i = 0; i < 3; i++) {
      ctx.fillStyle = colors.bg;
      ctx.fillRect(w * 0.15 + i * w * 0.25, h * 0.2, w * 0.2, h * 0.35);
      ctx.strokeStyle = colors.primary;
      ctx.lineWidth = 2;
      ctx.strokeRect(w * 0.15 + i * w * 0.25, h * 0.2, w * 0.2, h * 0.35);
      ctx.fillStyle = colors.primary + '88';
      for (let j = 0; j < 5; j++) {
        ctx.fillRect(w * 0.17 + i * w * 0.25, h * 0.25 + j * 15, w * 0.15 * seededRandom(seed + i + j), 8);
      }
    }
  },
  sac: (ctx, w, h, colors, seed, t) => {
    const nodes = [];
    for (let i = 0; i < 12; i++) {
      nodes.push({ x: seededRandom(seed + i) * w * 0.8 + w * 0.1, y: seededRandom(seed + i + 50) * h * 0.8 + h * 0.1 });
    }
    ctx.strokeStyle = colors.primary + '44';
    ctx.lineWidth = 1;
    nodes.forEach((n1, i) => {
      nodes.slice(i + 1).forEach(n2 => {
        if (seededRandom(seed + i + n2.x) > 0.6) {
          ctx.beginPath();
          ctx.moveTo(n1.x, n1.y);
          ctx.lineTo(n2.x, n2.y);
          ctx.stroke();
        }
      });
    });
    nodes.forEach((n, i) => {
      ctx.fillStyle = i % 3 === 0 ? colors.primary : colors.secondary;
      ctx.beginPath();
      ctx.arc(n.x + Math.sin(t + i) * 3, n.y + Math.cos(t + i) * 3, 5, 0, Math.PI * 2);
      ctx.fill();
    });
  },
  infiniteNet: (ctx, w, h, colors, seed, t) => {
    ctx.strokeStyle = colors.primary + '33';
    ctx.lineWidth = 1;
    for (let i = 0; i < 20; i++) {
      const y = h * 0.5 + (i - 10) * 20 + (t * 30) % 20;
      const scale = 1 - Math.abs(i - 10) / 15;
      ctx.beginPath();
      ctx.moveTo(w * (0.5 - scale * 0.5), y);
      ctx.lineTo(w * (0.5 + scale * 0.5), y);
      ctx.stroke();
    }
    for (let i = 0; i < 10; i++) {
      ctx.beginPath();
      ctx.moveTo(w * 0.5, h * 0.5);
      ctx.lineTo(w * (0.1 + i * 0.08), h);
      ctx.stroke();
    }
  },

  // INCEPTION
  limbo: (ctx, w, h, colors, seed, t) => {
    ctx.fillStyle = '#1a1508';
    ctx.fillRect(0, 0, w, h);
    for (let i = 0; i < 15; i++) {
      const bh = seededRandom(seed + i) * h * 0.6 + h * 0.1;
      const x = seededRandom(seed + i + 50) * w;
      ctx.fillStyle = `rgba(50, 40, 30, ${0.3 + seededRandom(seed + i + 100) * 0.4})`;
      ctx.fillRect(x, h - bh, 30 + seededRandom(seed + i + 150) * 40, bh);
    }
    ctx.strokeStyle = colors.primary + '22';
    for (let i = 0; i < 5; i++) {
      ctx.beginPath();
      ctx.moveTo(0, h * 0.9 + i * 8);
      for (let x = 0; x < w; x += 20) {
        ctx.lineTo(x, h * 0.9 + i * 8 + Math.sin(x * 0.02 + t) * 5);
      }
      ctx.stroke();
    }
  },
  totem: (ctx, w, h, colors, seed, t) => {
    const spin = t * 3;
    ctx.save();
    ctx.translate(w / 2, h * 0.6);
    ctx.rotate(spin);
    ctx.fillStyle = '#888';
    ctx.beginPath();
    ctx.moveTo(0, -40);
    ctx.lineTo(15, 0);
    ctx.lineTo(0, 20);
    ctx.lineTo(-15, 0);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.beginPath();
    ctx.ellipse(w / 2, h * 0.75, 20 + Math.sin(t) * 5, 5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.font = '24px serif';
    ctx.fillStyle = colors.primary + '66';
    ctx.textAlign = 'center';
    ctx.fillText('?', w / 2, h * 0.25);
  },
  penrose: (ctx, w, h, colors, seed, t) => {
    ctx.strokeStyle = colors.primary;
    ctx.lineWidth = 2;
    const cx = w / 2, cy = h / 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy - 50);
    ctx.lineTo(cx + 50, cy + 30);
    ctx.lineTo(cx - 50, cy + 30);
    ctx.closePath();
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx, cy - 30);
    ctx.lineTo(cx + 30, cy + 15);
    ctx.lineTo(cx - 30, cy + 15);
    ctx.closePath();
    ctx.stroke();
    ctx.strokeStyle = colors.secondary + '88';
    ctx.beginPath();
    ctx.arc(cx, cy, 60 + Math.sin(t) * 5, 0, Math.PI * 2);
    ctx.stroke();
  },
  foldingCity: (ctx, w, h, colors, seed, t) => {
    const fold = Math.sin(t * 0.5) * 0.3;
    ctx.fillStyle = '#2a2a2a';
    ctx.beginPath();
    ctx.moveTo(0, h * 0.6);
    ctx.lineTo(w, h * 0.6);
    ctx.lineTo(w, h);
    ctx.lineTo(0, h);
    ctx.fill();
    for (let i = 0; i < 8; i++) {
      const bh = 30 + seededRandom(seed + i) * 50;
      ctx.fillStyle = '#1a1a1a';
      ctx.fillRect(i * w * 0.12, h * 0.6 - bh, w * 0.1, bh);
    }
    ctx.save();
    ctx.translate(w / 2, h * 0.6);
    ctx.rotate(fold);
    for (let i = 0; i < 8; i++) {
      const bh = 30 + seededRandom(seed + i + 100) * 50;
      ctx.fillStyle = '#333';
      ctx.fillRect(-w * 0.4 + i * w * 0.1, -bh - 20, w * 0.08, bh);
    }
    ctx.restore();
  },
  kick: (ctx, w, h, colors, seed, t) => {
    const fall = (t % 3) / 3;
    ctx.fillStyle = colors.primary;
    const y = h * 0.2 + fall * h * 0.6;
    const rot = fall * Math.PI * 2;
    ctx.save();
    ctx.translate(w / 2, y);
    ctx.rotate(rot);
    ctx.fillRect(-10, -25, 20, 50);
    ctx.beginPath();
    ctx.arc(0, -35, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    ctx.strokeStyle = colors.primary + '44';
    for (let i = 0; i < 10; i++) {
      ctx.beginPath();
      ctx.moveTo(w * 0.3 + seededRandom(seed + i) * w * 0.4, y - 50 - i * 20);
      ctx.lineTo(w * 0.3 + seededRandom(seed + i) * w * 0.4, y - 30 - i * 20);
      ctx.stroke();
    }
  },
  limboTrain: (ctx, w, h, colors, seed, t) => {
    ctx.fillStyle = '#1a1508';
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = '#444';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, h * 0.7);
    ctx.lineTo(w, h * 0.7);
    ctx.moveTo(0, h * 0.75);
    ctx.lineTo(w, h * 0.75);
    ctx.stroke();
    for (let i = 0; i < 20; i++) {
      const x = (i * w * 0.06 + t * 50) % w;
      ctx.strokeStyle = '#333';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x, h * 0.68);
      ctx.lineTo(x, h * 0.77);
      ctx.stroke();
    }
    ctx.fillStyle = '#222';
    ctx.fillRect(w * 0.3, h * 0.5, w * 0.4, h * 0.18);
    ctx.fillStyle = colors.primary + '44';
    ctx.fillRect(w * 0.35, h * 0.52, w * 0.1, h * 0.08);
    ctx.fillRect(w * 0.5, h * 0.52, w * 0.1, h * 0.08);
  },
  zeroGravity: (ctx, w, h, colors, seed, t) => {
    ctx.save();
    ctx.translate(w / 2, h / 2);
    ctx.rotate(t * 0.3);
    ctx.strokeStyle = colors.primary;
    ctx.lineWidth = 2;
    ctx.strokeRect(-w * 0.3, -h * 0.35, w * 0.6, h * 0.7);
    for (let i = 0; i < 3; i++) {
      ctx.strokeStyle = colors.secondary + '88';
      ctx.strokeRect(-w * 0.25 + i * w * 0.2, -h * 0.25, w * 0.1, h * 0.4);
    }
    ctx.fillStyle = '#fff';
    const floatY = Math.sin(t * 2) * 20;
    ctx.fillRect(-5, floatY - 20, 10, 30);
    ctx.beginPath();
    ctx.arc(0, floatY - 30, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  },
  snowFortress: (ctx, w, h, colors, seed, t) => {
    ctx.fillStyle = '#e8e8e8';
    ctx.fillRect(0, h * 0.6, w, h * 0.4);
    ctx.fillStyle = '#ccc';
    ctx.beginPath();
    ctx.moveTo(0, h * 0.6);
    ctx.lineTo(w * 0.3, h * 0.2);
    ctx.lineTo(w * 0.5, h * 0.5);
    ctx.lineTo(w * 0.7, h * 0.15);
    ctx.lineTo(w, h * 0.5);
    ctx.lineTo(w, h * 0.6);
    ctx.fill();
    ctx.fillStyle = '#888';
    ctx.fillRect(w * 0.35, h * 0.35, w * 0.3, h * 0.25);
    ctx.fillRect(w * 0.4, h * 0.25, w * 0.05, h * 0.1);
    ctx.fillRect(w * 0.55, h * 0.25, w * 0.05, h * 0.1);
    ctx.fillStyle = '#fff';
    for (let i = 0; i < 30; i++) {
      const x = seededRandom(seed + i) * w;
      const y = (seededRandom(seed + i + 100) * h + t * 40) % h;
      ctx.beginPath();
      ctx.arc(x, y, 2, 0, Math.PI * 2);
      ctx.fill();
    }
  },
  sedation: (ctx, w, h, colors, seed, t) => {
    ctx.fillStyle = colors.primary + '33';
    for (let i = 0; i < 8; i++) {
      const x = w * 0.2 + i * w * 0.08;
      const drop = (t * 0.5 + seededRandom(seed + i)) % 1;
      const y = h * 0.2 + drop * h * 0.5;
      ctx.beginPath();
      ctx.moveTo(x, y - 10);
      ctx.quadraticCurveTo(x + 8, y, x, y + 15);
      ctx.quadraticCurveTo(x - 8, y, x, y - 10);
      ctx.fill();
    }
    ctx.strokeStyle = colors.primary + '66';
    ctx.lineWidth = 2;
    ctx.strokeRect(w * 0.4, h * 0.1, w * 0.2, h * 0.25);
    ctx.beginPath();
    ctx.moveTo(w * 0.5, h * 0.35);
    ctx.lineTo(w * 0.5, h * 0.7);
    ctx.stroke();
  },
  projection: (ctx, w, h, colors, seed, t) => {
    for (let i = 0; i < 6; i++) {
      const x = w * 0.15 + i * w * 0.14;
      const y = h * 0.5 + Math.sin(t + i) * 10;
      ctx.fillStyle = '#222';
      ctx.fillRect(x - 8, y - 20, 16, 35);
      ctx.beginPath();
      ctx.arc(x, y - 30, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ff0000';
      ctx.beginPath();
      ctx.arc(x - 3, y - 32, 2, 0, Math.PI * 2);
      ctx.arc(x + 3, y - 32, 2, 0, Math.PI * 2);
      ctx.fill();
    }
  },

  // V POUR VENDETTA
  november5: (ctx, w, h, colors, seed, t) => {
    ctx.font = 'bold 48px serif';
    ctx.fillStyle = colors.primary;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('V', w / 2, h * 0.35);
    ctx.font = '18px serif';
    ctx.fillText('5 NOVEMBER', w / 2, h * 0.55);
    for (let i = 0; i < 15; i++) {
      const angle = seededRandom(seed + i) * Math.PI * 2;
      const dist = 60 + seededRandom(seed + i + 50) * 40;
      const x = w / 2 + Math.cos(angle + t * 0.5) * dist;
      const y = h * 0.45 + Math.sin(angle + t * 0.5) * dist * 0.5;
      ctx.fillStyle = colors.primary + '88';
      ctx.beginPath();
      ctx.arc(x, y, 2, 0, Math.PI * 2);
      ctx.fill();
    }
  },
  guyFawkes: (ctx, w, h, colors, seed, t) => {
    ctx.strokeStyle = '#f5f5dc';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(w / 2, h / 2, 40, 50, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(w / 2 - 25, h / 2 - 15);
    ctx.lineTo(w / 2 - 10, h / 2 - 20);
    ctx.moveTo(w / 2 + 25, h / 2 - 15);
    ctx.lineTo(w / 2 + 10, h / 2 - 20);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(w / 2 - 15, h / 2 - 10, 5, 0, Math.PI * 2);
    ctx.arc(w / 2 + 15, h / 2 - 10, 5, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(w / 2 - 20, h / 2 + 15);
    ctx.quadraticCurveTo(w / 2, h / 2 + 5, w / 2 + 20, h / 2 + 15);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(w / 2, h / 2 + 20, 15, 0.1 * Math.PI, 0.9 * Math.PI);
    ctx.stroke();
  },
  dominos: (ctx, w, h, colors, seed, t) => {
    for (let i = 0; i < 8; i++) {
      const fall = Math.max(0, Math.min(1, (t * 0.5 - i * 0.1)));
      const angle = fall * Math.PI / 2;
      ctx.save();
      ctx.translate(w * 0.15 + i * w * 0.1, h * 0.7);
      ctx.rotate(-angle);
      ctx.fillStyle = colors.primary;
      ctx.fillRect(-5, -40, 10, 40);
      ctx.restore();
    }
  },
  shadowGallery: (ctx, w, h, colors, seed, t) => {
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, w, h);
    for (let i = 0; i < 4; i++) {
      ctx.strokeStyle = colors.primary + '66';
      ctx.lineWidth = 2;
      ctx.strokeRect(w * 0.1 + i * w * 0.22, h * 0.25, w * 0.18, h * 0.35);
      ctx.fillStyle = '#333';
      ctx.fillRect(w * 0.12 + i * w * 0.22, h * 0.28, w * 0.14, h * 0.29);
    }
    const gradient = ctx.createRadialGradient(w / 2, h * 0.1, 0, w / 2, h * 0.1, h * 0.5);
    gradient.addColorStop(0, 'rgba(255, 200, 100, 0.1)');
    gradient.addColorStop(1, 'transparent');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, w, h);
  },
  roses: (ctx, w, h, colors, seed, t) => {
    for (let i = 0; i < 5; i++) {
      const x = w * 0.2 + i * w * 0.15;
      const y = h * 0.5 + Math.sin(t + i) * 10;
      ctx.fillStyle = colors.primary;
      for (let p = 0; p < 5; p++) {
        const angle = (p / 5) * Math.PI * 2 + t * 0.2;
        ctx.beginPath();
        ctx.ellipse(x + Math.cos(angle) * 8, y + Math.sin(angle) * 8, 10, 6, angle, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.fillStyle = '#8b0000';
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#228b22';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x, y + 10);
      ctx.lineTo(x, y + 50);
      ctx.stroke();
    }
  },
  parliament: (ctx, w, h, colors, seed, t) => {
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(w * 0.4, h * 0.2, w * 0.2, h * 0.6);
    ctx.strokeStyle = colors.primary;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(w / 2, h * 0.35, 20, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(w / 2, h * 0.35);
    ctx.lineTo(w / 2, h * 0.35 - 15);
    ctx.moveTo(w / 2, h * 0.35);
    ctx.lineTo(w / 2 + 10, h * 0.35);
    ctx.stroke();
    ctx.fillStyle = colors.primary + 'aa';
    for (let i = 0; i < 10; i++) {
      const fx = w * 0.35 + seededRandom(seed + i) * w * 0.3;
      const fy = h * 0.1 + seededRandom(seed + i + 50) * h * 0.3;
      const fh = 20 + Math.sin(t * 3 + i) * 10;
      ctx.beginPath();
      ctx.moveTo(fx, fy + fh);
      ctx.quadraticCurveTo(fx + 5, fy, fx + 10, fy + fh);
      ctx.fill();
    }
  },
  propaganda: (ctx, w, h, colors, seed, t) => {
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(w * 0.15, h * 0.15, w * 0.7, h * 0.7);
    ctx.strokeStyle = colors.primary;
    ctx.lineWidth = 3;
    ctx.strokeRect(w * 0.15, h * 0.15, w * 0.7, h * 0.7);
    ctx.font = 'bold 16px sans-serif';
    ctx.fillStyle = colors.primary;
    ctx.textAlign = 'center';
    ctx.fillText('STRENGTH', w / 2, h * 0.4);
    ctx.fillText('THROUGH', w / 2, h * 0.55);
    ctx.fillText('UNITY', w / 2, h * 0.7);
  },
  cell: (ctx, w, h, colors, seed, t) => {
    ctx.fillStyle = '#111';
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = '#444';
    ctx.lineWidth = 4;
    for (let i = 0; i < 6; i++) {
      ctx.beginPath();
      ctx.moveTo(w * 0.2 + i * w * 0.12, 0);
      ctx.lineTo(w * 0.2 + i * w * 0.12, h);
      ctx.stroke();
    }
    const gradient = ctx.createRadialGradient(w / 2, h * 0.3, 0, w / 2, h * 0.3, 100);
    gradient.addColorStop(0, 'rgba(255, 255, 200, 0.2)');
    gradient.addColorStop(1, 'transparent');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, w, h);
  },
  jukebox: (ctx, w, h, colors, seed, t) => {
    ctx.fillStyle = '#8b4513';
    ctx.fillRect(w * 0.3, h * 0.2, w * 0.4, h * 0.6);
    ctx.fillStyle = '#333';
    ctx.fillRect(w * 0.35, h * 0.25, w * 0.3, h * 0.3);
    ctx.fillStyle = '#111';
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      ctx.arc(w * 0.4 + i * w * 0.1, h * 0.4, 12, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = colors.primary;
    for (let i = 0; i < 5; i++) {
      if (Math.sin(t * 3 + i) > 0) {
        ctx.beginPath();
        ctx.arc(w * 0.35 + i * w * 0.075, h * 0.65, 5, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  },
  bulletproof: (ctx, w, h, colors, seed, t) => {
    ctx.font = 'italic 20px serif';
    ctx.fillStyle = colors.primary;
    ctx.textAlign = 'center';
    ctx.fillText('Ideas are', w / 2, h * 0.4);
    ctx.fillText('bulletproof', w / 2, h * 0.55);
    for (let i = 0; i < 5; i++) {
      const angle = (i / 5) * Math.PI * 2 + t;
      const x = w / 2 + Math.cos(angle) * 80;
      const y = h / 2 + Math.sin(angle) * 30;
      ctx.fillStyle = '#888';
      ctx.beginPath();
      ctx.ellipse(x, y, 3, 6, angle, 0, Math.PI * 2);
      ctx.fill();
    }
  },

  // DEADPOOL
  maxEffort: (ctx, w, h, colors, seed, t) => {
    ctx.font = 'bold 28px sans-serif';
    ctx.fillStyle = colors.primary;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const shake = Math.sin(t * 10) * 3;
    ctx.fillText('MAXIMUM', w / 2 + shake, h * 0.4);
    ctx.fillText('EFFORT!', w / 2 - shake, h * 0.6);
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2 + t;
      ctx.fillStyle = colors.secondary + '88';
      ctx.beginPath();
      ctx.moveTo(w / 2 + Math.cos(angle) * 60, h / 2 + Math.sin(angle) * 40);
      ctx.lineTo(w / 2 + Math.cos(angle) * 70, h / 2 + Math.sin(angle) * 50);
      ctx.lineTo(w / 2 + Math.cos(angle + 0.1) * 65, h / 2 + Math.sin(angle + 0.1) * 45);
      ctx.fill();
    }
  },
  chimichanga: (ctx, w, h, colors, seed, t) => {
    ctx.fillStyle = '#D2691E';
    ctx.beginPath();
    ctx.ellipse(w / 2, h / 2, 60, 25, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#8B4513';
    ctx.beginPath();
    ctx.ellipse(w / 2, h / 2, 55, 20, 0, 0, Math.PI * 2);
    ctx.fill();
    const toppings = ['#ff6347', '#228b22', '#ffd700', '#ff4500'];
    for (let i = 0; i < 12; i++) {
      ctx.fillStyle = toppings[i % toppings.length];
      ctx.beginPath();
      ctx.arc(w * 0.35 + seededRandom(seed + i) * w * 0.3, h * 0.4 + seededRandom(seed + i + 50) * h * 0.2, 4 + seededRandom(seed + i + 100) * 4, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.strokeStyle = '#ffffff44';
    for (let i = 0; i < 5; i++) {
      ctx.beginPath();
      ctx.arc(w * 0.4 + i * 15, h * 0.25 - Math.sin(t * 2 + i) * 10, 5, 0, Math.PI * 2);
      ctx.stroke();
    }
  },
  fourthWall: (ctx, w, h, colors, seed, t) => {
    ctx.strokeStyle = '#444';
    ctx.lineWidth = 3;
    for (let i = 0; i < 8; i++) {
      const x = seededRandom(seed + i) * w;
      const y = seededRandom(seed + i + 50) * h;
      const len = 20 + seededRandom(seed + i + 100) * 40;
      const angle = seededRandom(seed + i + 150) * Math.PI;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + Math.cos(angle) * len, y + Math.sin(angle) * len);
      ctx.stroke();
    }
    ctx.fillStyle = colors.primary;
    ctx.beginPath();
    ctx.ellipse(w / 2, h / 2, 20, 12, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(w / 2 - 5, h / 2 - 3, 5, 0, Math.PI * 2);
    ctx.fill();
  },
  regeneration: (ctx, w, h, colors, seed, t) => {
    for (let i = 0; i < 25; i++) {
      const x = seededRandom(seed + i) * w;
      const y = seededRandom(seed + i + 50) * h;
      const size = 5 + Math.sin(t * 3 + i) * 3;
      ctx.fillStyle = colors.primary + Math.floor(50 + Math.sin(t * 2 + i) * 50).toString(16).padStart(2, '0');
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.strokeStyle = colors.primary + '44';
    ctx.lineWidth = 1;
    for (let i = 0; i < 10; i++) {
      ctx.beginPath();
      ctx.moveTo(seededRandom(seed + i + 200) * w, seededRandom(seed + i + 250) * h);
      ctx.lineTo(seededRandom(seed + i + 300) * w, seededRandom(seed + i + 350) * h);
      ctx.stroke();
    }
  },
  katanas: (ctx, w, h, colors, seed, t) => {
    ctx.strokeStyle = '#888';
    ctx.lineWidth = 4;
    ctx.save();
    ctx.translate(w / 2, h / 2);
    ctx.rotate(0.3);
    ctx.beginPath();
    ctx.moveTo(-50, 0);
    ctx.lineTo(50, 0);
    ctx.stroke();
    ctx.fillStyle = '#333';
    ctx.fillRect(-60, -5, 15, 10);
    ctx.restore();
    ctx.save();
    ctx.translate(w / 2, h / 2);
    ctx.rotate(-0.3);
    ctx.beginPath();
    ctx.moveTo(-50, 0);
    ctx.lineTo(50, 0);
    ctx.stroke();
    ctx.fillStyle = '#333';
    ctx.fillRect(-60, -5, 15, 10);
    ctx.restore();
    ctx.strokeStyle = '#ffffff22';
    ctx.lineWidth = 1;
    for (let i = 0; i < 5; i++) {
      const shimmer = Math.sin(t * 4 + i * 0.5) * 20;
      ctx.beginPath();
      ctx.moveTo(w / 2 - 30 + i * 15, h / 2 - 20 + shimmer);
      ctx.lineTo(w / 2 - 25 + i * 15, h / 2 + 20 - shimmer);
      ctx.stroke();
    }
  },
  babyHand: (ctx, w, h, colors, seed, t) => {
    const growth = (Math.sin(t * 0.5) + 1) / 2;
    const size = 0.3 + growth * 0.7;
    ctx.fillStyle = '#ffcba4';
    ctx.save();
    ctx.translate(w / 2, h / 2);
    ctx.scale(size, size);
    ctx.beginPath();
    ctx.ellipse(0, 20, 25, 35, 0, 0, Math.PI * 2);
    ctx.fill();
    for (let i = 0; i < 5; i++) {
      const angle = -0.4 + i * 0.2;
      const len = i === 2 ? 40 : 30;
      ctx.beginPath();
      ctx.ellipse(Math.sin(angle) * 20, -len, 6, len / 2, angle, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  },
  taxi: (ctx, w, h, colors, seed, t) => {
    ctx.fillStyle = '#333';
    ctx.fillRect(0, h * 0.7, w, h * 0.1);
    ctx.strokeStyle = '#555';
    ctx.lineWidth = 2;
    ctx.setLineDash([20, 10]);
    ctx.beginPath();
    ctx.moveTo(0, h * 0.75);
    ctx.lineTo(w, h * 0.75);
    ctx.stroke();
    ctx.setLineDash([]);
    const carX = (t * 50) % (w + 100) - 50;
    ctx.fillStyle = '#ffd700';
    ctx.fillRect(carX, h * 0.55, 60, 25);
    ctx.fillRect(carX + 10, h * 0.45, 40, 15);
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(carX + 12, h * 0.8, 8, 0, Math.PI * 2);
    ctx.arc(carX + 48, h * 0.8, 8, 0, Math.PI * 2);
    ctx.fill();
  },
  xforce: (ctx, w, h, colors, seed, t) => {
    ctx.font = 'bold 40px sans-serif';
    ctx.fillStyle = '#666';
    ctx.textAlign = 'center';
    ctx.fillText('X', w / 2, h * 0.45);
    ctx.font = '12px sans-serif';
    ctx.fillStyle = colors.primary;
    const names = ['Peter', 'Vanisher', 'Zeitgeist', 'Bedlam'];
    for (let i = 0; i < 4; i++) {
      ctx.fillText('R.I.P ' + names[i], w * 0.2 + i * w * 0.2, h * 0.75);
    }
  },
  redSuit: (ctx, w, h, colors, seed, t) => {
    ctx.fillStyle = colors.primary;
    ctx.beginPath();
    ctx.arc(w / 2, h * 0.35, 30, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(w / 2 - 25, h * 0.4, 50, 60);
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.ellipse(w / 2 - 12, h * 0.32, 12, 8, -0.2, 0, Math.PI * 2);
    ctx.ellipse(w / 2 + 12, h * 0.32, 12, 8, 0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.ellipse(w / 2 - 12, h * 0.32, 8, 5, -0.2, 0, Math.PI * 2);
    ctx.ellipse(w / 2 + 12, h * 0.32, 8, 5, 0.2, 0, Math.PI * 2);
    ctx.fill();
  },
  emoji: (ctx, w, h, colors, seed, t) => {
    const expressions = [
      { eyes: '^^', mouth: 'D' },
      { eyes: 'OO', mouth: 'o' },
      { eyes: '><', mouth: 'v' },
      { eyes: '--', mouth: '|' }
    ];
    const expr = expressions[Math.floor(t * 0.5) % expressions.length];
    ctx.fillStyle = colors.primary;
    ctx.beginPath();
    ctx.arc(w / 2, h / 2, 50, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#000';
    ctx.fillRect(w / 2 - 30, h / 2 - 20, 20, 10);
    ctx.fillRect(w / 2 + 10, h / 2 - 20, 20, 10);
    ctx.font = 'bold 24px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(expr.mouth, w / 2, h / 2 + 25);
  },

  // ASIMOV
  foundation: (ctx, w, h, colors, seed, t) => {
    for (let i = 0; i < 5; i++) {
      ctx.strokeStyle = colors.primary + Math.floor(30 + i * 15).toString(16).padStart(2, '0');
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(w / 2, h / 2, 20 + i * 20, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.font = 'bold 36px serif';
    ctx.fillStyle = colors.primary;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('F', w / 2, h / 2);
    for (let i = 0; i < 20; i++) {
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(seededRandom(seed + i) * w, seededRandom(seed + i + 50) * h, 1, 0, Math.PI * 2);
      ctx.fill();
    }
  },
  psychohistory: (ctx, w, h, colors, seed, t) => {
    ctx.font = '10px monospace';
    ctx.fillStyle = colors.primary + '88';
    const equations = ['∫ψ(x)dx', 'Σn→∞', 'P(t)=e^λt', '∂H/∂t'];
    for (let i = 0; i < 8; i++) {
      ctx.fillText(equations[i % equations.length], w * 0.1 + seededRandom(seed + i) * w * 0.8, h * 0.15 + i * h * 0.1);
    }
    ctx.strokeStyle = colors.secondary;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(w * 0.1, h * 0.8);
    for (let x = 0; x < w * 0.8; x += 5) {
      ctx.lineTo(w * 0.1 + x, h * 0.5 + Math.sin(x * 0.05 + t) * 30 * Math.exp(-x * 0.005));
    }
    ctx.stroke();
  },
  mule: (ctx, w, h, colors, seed, t) => {
    ctx.fillStyle = '#1a1a2e';
    ctx.beginPath();
    ctx.arc(w / 2, h / 2, 30, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(w / 2 - 15, h / 2 + 25, 30, 40);
    for (let i = 0; i < 3; i++) {
      ctx.strokeStyle = colors.primary + Math.floor(60 - i * 20).toString(16).padStart(2, '0');
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(w / 2, h / 2, 45 + i * 20 + Math.sin(t * 2) * 5, 0, Math.PI * 2);
      ctx.stroke();
    }
  },
  terminus: (ctx, w, h, colors, seed, t) => {
    ctx.fillStyle = colors.secondary;
    ctx.beginPath();
    ctx.arc(w / 2, h / 2, 50, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = colors.primary + '44';
    ctx.beginPath();
    ctx.ellipse(w / 2 - 15, h / 2, 20, 25, 0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(w / 2 + 20, h / 2 + 10, 15, 18, -0.5, 0, Math.PI * 2);
    ctx.fill();
    for (let i = 0; i < 15; i++) {
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(seededRandom(seed + i) * w, seededRandom(seed + i + 50) * h, 1, 0, Math.PI * 2);
      ctx.fill();
    }
  },
  threeLaws: (ctx, w, h, colors, seed, t) => {
    ctx.font = '11px sans-serif';
    ctx.fillStyle = colors.primary;
    ctx.fillText('1. Protect humans', w * 0.15, h * 0.3);
    ctx.fillText('2. Obey orders', w * 0.15, h * 0.5);
    ctx.fillText('3. Self-preserve', w * 0.15, h * 0.7);
    ctx.strokeStyle = colors.secondary + '66';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(w * 0.75, h / 2, 35, 0, Math.PI * 2);
    ctx.stroke();
    for (let i = 0; i < 6; i++) {
      ctx.beginPath();
      ctx.moveTo(w * 0.75, h / 2);
      ctx.lineTo(w * 0.75 + Math.cos(t + i) * 30, h / 2 + Math.sin(t + i) * 30);
      ctx.stroke();
    }
  },
  trantor: (ctx, w, h, colors, seed, t) => {
    ctx.fillStyle = '#2a2a3a';
    ctx.beginPath();
    ctx.arc(w / 2, h / 2, 55, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = colors.primary + '44';
    ctx.lineWidth = 1;
    for (let i = 0; i < 10; i++) {
      ctx.beginPath();
      ctx.arc(w / 2, h / 2, 10 + i * 5, 0, Math.PI * 2);
      ctx.stroke();
    }
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(w / 2, h / 2);
      ctx.lineTo(w / 2 + Math.cos(angle) * 55, h / 2 + Math.sin(angle) * 55);
      ctx.stroke();
    }
    for (let i = 0; i < 40; i++) {
      ctx.fillStyle = colors.primary + '66';
      const angle = seededRandom(seed + i) * Math.PI * 2;
      const dist = seededRandom(seed + i + 50) * 50;
      ctx.fillRect(w / 2 + Math.cos(angle) * dist - 1, h / 2 + Math.sin(angle) * dist - 1, 2, 2);
    }
  },
  secondFoundation: (ctx, w, h, colors, seed, t) => {
    ctx.fillStyle = '#1a1a2e44';
    ctx.fillRect(0, 0, w, h);
    for (let i = 0; i < 5; i++) {
      ctx.fillStyle = colors.primary + '33';
      const x = w * 0.2 + i * w * 0.15;
      ctx.beginPath();
      ctx.arc(x, h * 0.5 + Math.sin(t + i) * 10, 15, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillRect(x - 8, h * 0.5 + 12, 16, 30);
    }
    ctx.font = 'bold 20px serif';
    ctx.fillStyle = colors.primary + '66';
    ctx.textAlign = 'center';
    ctx.fillText('?', w / 2, h * 0.2);
  },
  gaia: (ctx, w, h, colors, seed, t) => {
    ctx.fillStyle = '#228b22';
    ctx.beginPath();
    ctx.arc(w / 2, h / 2, 50, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = colors.primary + '66';
    ctx.lineWidth = 1;
    for (let i = 0; i < 20; i++) {
      const x1 = w / 2 + (seededRandom(seed + i) - 0.5) * 80;
      const y1 = h / 2 + (seededRandom(seed + i + 50) - 0.5) * 80;
      const x2 = w / 2 + (seededRandom(seed + i + 100) - 0.5) * 80;
      const y2 = h / 2 + (seededRandom(seed + i + 150) - 0.5) * 80;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }
  },
  daneel: (ctx, w, h, colors, seed, t) => {
    ctx.fillStyle = '#c0c0c0';
    ctx.beginPath();
    ctx.arc(w / 2, h * 0.35, 25, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(w / 2 - 20, h * 0.4, 40, 50);
    ctx.strokeStyle = colors.primary;
    ctx.lineWidth = 1;
    for (let i = 0; i < 5; i++) {
      ctx.beginPath();
      ctx.moveTo(w / 2 - 15 + i * 8, h * 0.45);
      ctx.lineTo(w / 2 - 15 + i * 8, h * 0.75);
      ctx.stroke();
    }
    ctx.fillStyle = colors.secondary;
    ctx.beginPath();
    ctx.arc(w / 2 - 8, h * 0.33, 4, 0, Math.PI * 2);
    ctx.arc(w / 2 + 8, h * 0.33, 4, 0, Math.PI * 2);
    ctx.fill();
  },
  galaxySpiral: (ctx, w, h, colors, seed, t) => {
    ctx.fillStyle = colors.primary + '11';
    ctx.beginPath();
    ctx.arc(w / 2, h / 2, 70, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = colors.primary + '66';
    ctx.lineWidth = 2;
    for (let arm = 0; arm < 4; arm++) {
      ctx.beginPath();
      for (let i = 0; i < 50; i++) {
        const angle = (arm / 4) * Math.PI * 2 + i * 0.15 + t * 0.2;
        const radius = i * 1.5;
        const x = w / 2 + Math.cos(angle) * radius;
        const y = h / 2 + Math.sin(angle) * radius * 0.6;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
    for (let i = 0; i < 30; i++) {
      ctx.fillStyle = '#fff';
      const angle = seededRandom(seed + i) * Math.PI * 2;
      const dist = seededRandom(seed + i + 50) * 60;
      ctx.beginPath();
      ctx.arc(w / 2 + Math.cos(angle) * dist, h / 2 + Math.sin(angle) * dist * 0.6, 1, 0, Math.PI * 2);
      ctx.fill();
    }
  },

  // CLOUD ATLAS
  connectedSouls: (ctx, w, h, colors, seed, t) => {
    const souls = [];
    for (let i = 0; i < 8; i++) {
      souls.push({
        x: w * 0.15 + i * w * 0.1,
        y: h * 0.3 + Math.sin(t + i * 0.8) * 20 + (i % 2) * h * 0.3
      });
    }
    ctx.strokeStyle = colors.primary + '44';
    ctx.lineWidth = 1;
    souls.forEach((s1, i) => {
      souls.slice(i + 1).forEach(s2 => {
        ctx.beginPath();
        ctx.moveTo(s1.x, s1.y);
        ctx.quadraticCurveTo((s1.x + s2.x) / 2, (s1.y + s2.y) / 2 - 30, s2.x, s2.y);
        ctx.stroke();
      });
    });
    souls.forEach(s => {
      ctx.fillStyle = colors.secondary;
      ctx.beginPath();
      ctx.arc(s.x, s.y, 8, 0, Math.PI * 2);
      ctx.fill();
    });
  },
  sextet: (ctx, w, h, colors, seed, t) => {
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 1;
    for (let i = 0; i < 5; i++) {
      ctx.beginPath();
      ctx.moveTo(w * 0.1, h * 0.3 + i * 12);
      ctx.lineTo(w * 0.9, h * 0.3 + i * 12);
      ctx.stroke();
    }
    ctx.fillStyle = colors.primary;
    const notes = [0, 2, 4, 5, 7, 9, 11, 12];
    for (let i = 0; i < 8; i++) {
      const x = w * 0.15 + i * w * 0.1;
      const noteY = h * 0.36 + (notes[i] % 5) * 6;
      ctx.beginPath();
      ctx.ellipse(x + Math.sin(t + i) * 3, noteY, 6, 4, -0.3, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = colors.primary;
      ctx.beginPath();
      ctx.moveTo(x + 5, noteY);
      ctx.lineTo(x + 5, noteY - 20);
      ctx.stroke();
    }
  },
  letter: (ctx, w, h, colors, seed, t) => {
    ctx.fillStyle = '#f5f5dc';
    ctx.fillRect(w * 0.2, h * 0.15, w * 0.6, h * 0.7);
    ctx.strokeStyle = '#ddd';
    ctx.lineWidth = 1;
    for (let i = 0; i < 12; i++) {
      ctx.beginPath();
      ctx.moveTo(w * 0.25, h * 0.22 + i * 15);
      ctx.lineTo(w * 0.75, h * 0.22 + i * 15);
      ctx.stroke();
    }
    ctx.font = 'italic 14px serif';
    ctx.fillStyle = '#333';
    ctx.fillText('My Dearest...', w * 0.25, h * 0.25);
    ctx.font = 'italic 12px serif';
    ctx.fillText('Forever yours,', w * 0.55, h * 0.78);
  },
  neoSeoul: (ctx, w, h, colors, seed, t) => {
    for (let i = 0; i < 10; i++) {
      const bh = seededRandom(seed + i) * h * 0.6 + h * 0.2;
      ctx.fillStyle = '#1a1a2e';
      ctx.fillRect(i * w * 0.1, h - bh, w * 0.08, bh);
      for (let j = 0; j < 8; j++) {
        ctx.fillStyle = colors.primary + Math.floor(seededRandom(seed + i + j) * 100 + 50).toString(16).padStart(2, '0');
        ctx.fillRect(i * w * 0.1 + 3, h - bh + 10 + j * 20, w * 0.02, 8);
      }
    }
    ctx.fillStyle = colors.secondary;
    const vx = (t * 40) % w;
    ctx.beginPath();
    ctx.ellipse(vx, h * 0.3, 15, 8, 0, 0, Math.PI * 2);
    ctx.fill();
  },
  valley: (ctx, w, h, colors, seed, t) => {
    ctx.fillStyle = '#87ceeb';
    ctx.fillRect(0, 0, w, h * 0.5);
    ctx.fillStyle = '#228b22';
    ctx.beginPath();
    ctx.moveTo(0, h * 0.6);
    ctx.lineTo(w * 0.3, h * 0.3);
    ctx.lineTo(w * 0.5, h * 0.5);
    ctx.lineTo(w * 0.7, h * 0.25);
    ctx.lineTo(w, h * 0.55);
    ctx.lineTo(w, h);
    ctx.lineTo(0, h);
    ctx.fill();
    ctx.fillStyle = '#006400';
    for (let i = 0; i < 5; i++) {
      const x = w * 0.2 + i * w * 0.15;
      ctx.beginPath();
      ctx.moveTo(x, h * 0.7);
      ctx.lineTo(x - 15, h * 0.85);
      ctx.lineTo(x + 15, h * 0.85);
      ctx.fill();
    }
    ctx.fillStyle = '#ffd700';
    ctx.beginPath();
    ctx.arc(w * 0.85, h * 0.15, 20, 0, Math.PI * 2);
    ctx.fill();
  },
  comet: (ctx, w, h, colors, seed, t) => {
    ctx.fillStyle = colors.secondary;
    ctx.beginPath();
    ctx.arc(w * 0.7, h * 0.4, 15, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = colors.secondary + '44';
    ctx.lineWidth = 3;
    for (let i = 0; i < 5; i++) {
      ctx.beginPath();
      ctx.moveTo(w * 0.7, h * 0.4);
      ctx.quadraticCurveTo(w * 0.4, h * 0.5 + i * 5, w * 0.1, h * 0.6 + Math.sin(t + i) * 10);
      ctx.stroke();
    }
    for (let i = 0; i < 20; i++) {
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(seededRandom(seed + i) * w, seededRandom(seed + i + 50) * h, 1, 0, Math.PI * 2);
      ctx.fill();
    }
  },
  pacificJournal: (ctx, w, h, colors, seed, t) => {
    ctx.fillStyle = '#d4a574';
    ctx.fillRect(w * 0.2, h * 0.1, w * 0.6, h * 0.8);
    ctx.strokeStyle = '#8b4513';
    ctx.lineWidth = 3;
    ctx.strokeRect(w * 0.2, h * 0.1, w * 0.6, h * 0.8);
    ctx.font = 'italic 12px serif';
    ctx.fillStyle = '#333';
    ctx.fillText('Pacific Journal', w * 0.3, h * 0.2);
    ctx.fillText('1849', w * 0.65, h * 0.2);
    ctx.strokeStyle = '#00008844';
    ctx.lineWidth = 1;
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      ctx.moveTo(w * 0.25, h * 0.8 + i * 8);
      for (let x = 0; x < w * 0.5; x += 10) {
        ctx.lineTo(w * 0.25 + x, h * 0.8 + i * 8 + Math.sin(x * 0.1 + t + i) * 3);
      }
      ctx.stroke();
    }
  },
  luisaRey: (ctx, w, h, colors, seed, t) => {
    ctx.fillStyle = '#333';
    ctx.fillRect(w * 0.25, h * 0.3, w * 0.5, h * 0.4);
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(w * 0.28, h * 0.33, w * 0.44, h * 0.25);
    ctx.fillStyle = '#f5f5f5';
    ctx.fillRect(w * 0.3, h * 0.6, w * 0.4, h * 0.08);
    const keys = '##########';
    ctx.font = '10px monospace';
    ctx.fillStyle = '#333';
    for (let i = 0; i < 10; i++) {
      ctx.fillText('#', w * 0.32 + i * 12 + Math.sin(t * 10 + i) * 1, h * 0.66);
    }
  },
  cavendish: (ctx, w, h, colors, seed, t) => {
    ctx.fillStyle = '#8b0000';
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(w * 0.3, h * 0.15, w * 0.4, h * 0.7);
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 2; j++) {
        ctx.fillStyle = '#87ceeb';
        ctx.fillRect(w * 0.35 + j * w * 0.15, h * 0.2 + i * h * 0.2, w * 0.1, h * 0.12);
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(w * 0.4 + j * w * 0.15, h * 0.2 + i * h * 0.2);
        ctx.lineTo(w * 0.4 + j * w * 0.15, h * 0.32 + i * h * 0.2);
        ctx.stroke();
      }
    }
    ctx.font = '10px sans-serif';
    ctx.fillStyle = '#fff';
    ctx.fillText('AURORA HOUSE', w * 0.32, h * 0.92);
  },
  reincarnation: (ctx, w, h, colors, seed, t) => {
    ctx.strokeStyle = colors.primary;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(w / 2, h / 2, 50, 0, Math.PI * 2);
    ctx.stroke();
    const eras = ['1849', '1936', '1973', '2012', '2144', '2321'];
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2 - Math.PI / 2 + t * 0.2;
      const x = w / 2 + Math.cos(angle) * 50;
      const y = h / 2 + Math.sin(angle) * 50;
      ctx.fillStyle = colors.secondary;
      ctx.beginPath();
      ctx.arc(x, y, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.font = '8px sans-serif';
      ctx.fillStyle = colors.primary;
      ctx.textAlign = 'center';
      ctx.fillText(eras[i], x, y + 20);
    }
  },

  // THE MASK
  smokin: (ctx, w, h, colors, seed, t) => {
    ctx.font = 'bold 32px sans-serif';
    ctx.fillStyle = colors.primary;
    ctx.textAlign = 'center';
    const scale = 1 + Math.sin(t * 5) * 0.1;
    ctx.save();
    ctx.translate(w / 2, h / 2);
    ctx.scale(scale, scale);
    ctx.fillText("SMOKIN'!", 0, 0);
    ctx.restore();
    ctx.strokeStyle = '#ffffff44';
    for (let i = 0; i < 5; i++) {
      ctx.beginPath();
      ctx.arc(w * 0.3 + i * w * 0.1, h * 0.7 - Math.sin(t * 2 + i) * 20, 8, 0, Math.PI * 2);
      ctx.stroke();
    }
  },
  cubanPete: (ctx, w, h, colors, seed, t) => {
    const bounce = Math.sin(t * 8) * 10;
    ctx.fillStyle = colors.primary;
    ctx.beginPath();
    ctx.arc(w / 2, h * 0.35 + bounce, 25, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(w / 2 - 15, h * 0.4 + bounce, 30, 40);
    ctx.strokeStyle = colors.secondary;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(w / 2 - 25, h * 0.45 + bounce);
    ctx.lineTo(w / 2 - 40, h * 0.3 + Math.sin(t * 10) * 20);
    ctx.moveTo(w / 2 + 25, h * 0.45 + bounce);
    ctx.lineTo(w / 2 + 40, h * 0.3 - Math.sin(t * 10) * 20);
    ctx.stroke();
    ctx.font = '12px sans-serif';
    ctx.fillStyle = colors.secondary;
    for (let i = 0; i < 5; i++) {
      ctx.fillText('♪', w * 0.2 + i * w * 0.15, h * 0.2 + Math.sin(t * 3 + i) * 15);
    }
  },
  cartoonPhysics: (ctx, w, h, colors, seed, t) => {
    const stretch = 1 + Math.sin(t * 4) * 0.5;
    ctx.fillStyle = colors.primary;
    ctx.save();
    ctx.translate(w / 2, h / 2);
    ctx.scale(1 / stretch, stretch);
    ctx.beginPath();
    ctx.arc(0, 0, 30, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    ctx.font = 'bold 16px sans-serif';
    ctx.fillStyle = colors.secondary;
    const effects = ['POW!', 'BAM!', 'ZAP!'];
    for (let i = 0; i < 3; i++) {
      if (Math.sin(t * 3 + i * 2) > 0.5) {
        ctx.fillText(effects[i], w * 0.2 + i * w * 0.25, h * 0.2 + seededRandom(seed + i) * h * 0.1);
      }
    }
  },
  tornado: (ctx, w, h, colors, seed, t) => {
    ctx.strokeStyle = colors.primary;
    ctx.lineWidth = 3;
    for (let i = 0; i < 15; i++) {
      const y = h * 0.2 + i * h * 0.05;
      const width = 20 + i * 8;
      const offset = Math.sin(t * 5 + i * 0.5) * 10;
      ctx.beginPath();
      ctx.arc(w / 2 + offset, y, width, 0, Math.PI);
      ctx.stroke();
    }
    for (let i = 0; i < 10; i++) {
      ctx.fillStyle = colors.secondary + '88';
      const angle = t * 3 + i * 0.6;
      const dist = 30 + i * 10;
      ctx.beginPath();
      ctx.arc(w / 2 + Math.cos(angle) * dist, h * 0.5 + Math.sin(angle) * dist * 0.3, 3, 0, Math.PI * 2);
      ctx.fill();
    }
  },
  milo: (ctx, w, h, colors, seed, t) => {
    const bounce = Math.abs(Math.sin(t * 4)) * 15;
    ctx.fillStyle = '#f5deb3';
    ctx.beginPath();
    ctx.ellipse(w / 2, h * 0.55 - bounce, 25, 35, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(w / 2, h * 0.35 - bounce, 20, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#8b4513';
    ctx.beginPath();
    ctx.ellipse(w / 2 - 15, h * 0.3 - bounce, 10, 15, -0.5, 0, Math.PI * 2);
    ctx.ellipse(w / 2 + 15, h * 0.3 - bounce, 10, 15, 0.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(w / 2 - 5, h * 0.33 - bounce, 3, 0, Math.PI * 2);
    ctx.arc(w / 2 + 5, h * 0.33 - bounce, 3, 0, Math.PI * 2);
    ctx.arc(w / 2, h * 0.38 - bounce, 5, 0, Math.PI * 2);
    ctx.fill();
    if (Math.sin(t * 2) > 0) {
      ctx.fillStyle = colors.primary + '88';
      ctx.beginPath();
      ctx.ellipse(w / 2, h * 0.35 - bounce, 22, 18, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  },
  tina: (ctx, w, h, colors, seed, t) => {
    ctx.fillStyle = '#ff0000';
    ctx.beginPath();
    ctx.moveTo(w / 2, h * 0.25);
    ctx.lineTo(w / 2 + 30, h * 0.85);
    ctx.lineTo(w / 2 - 30, h * 0.85);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#ffcba4';
    ctx.beginPath();
    ctx.arc(w / 2, h * 0.2, 15, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffd700';
    ctx.beginPath();
    ctx.arc(w / 2, h * 0.15, 20, Math.PI, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = colors.secondary;
    ctx.lineWidth = 1;
    for (let i = 0; i < 5; i++) {
      ctx.beginPath();
      ctx.arc(w / 2, h * 0.5, 40 + i * 15 + Math.sin(t * 2) * 5, 0, Math.PI * 2);
      ctx.stroke();
    }
  },
  lokiMask: (ctx, w, h, colors, seed, t) => {
    ctx.fillStyle = colors.primary;
    ctx.beginPath();
    ctx.ellipse(w / 2, h / 2, 35, 45, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = colors.secondary;
    ctx.lineWidth = 2;
    for (let i = 0; i < 6; i++) {
      const y = h * 0.3 + i * 15;
      ctx.beginPath();
      ctx.moveTo(w / 2 - 25, y);
      ctx.quadraticCurveTo(w / 2, y + Math.sin(t + i) * 5, w / 2 + 25, y);
      ctx.stroke();
    }
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.ellipse(w / 2 - 12, h / 2 - 10, 10, 6, 0, 0, Math.PI * 2);
    ctx.ellipse(w / 2 + 12, h / 2 - 10, 10, 6, 0, 0, Math.PI * 2);
    ctx.fill();
  },
  transformation: (ctx, w, h, colors, seed, t) => {
    const phase = (t % 2) / 2;
    ctx.fillStyle = phase < 0.5 ? '#ffcba4' : colors.primary;
    ctx.beginPath();
    ctx.arc(w / 2, h * 0.4, 30, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(w / 2 - 20, h * 0.45, 40, 50);
    ctx.strokeStyle = colors.primary;
    ctx.lineWidth = 3;
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2 + t * 3;
      const len = 20 + Math.sin(t * 5 + i) * 10;
      ctx.beginPath();
      ctx.moveTo(w / 2, h * 0.4);
      ctx.lineTo(w / 2 + Math.cos(angle) * len, h * 0.4 + Math.sin(angle) * len);
      ctx.stroke();
    }
  },
  kellaway: (ctx, w, h, colors, seed, t) => {
    ctx.fillStyle = '#1a1a1a';
    ctx.beginPath();
    ctx.arc(w / 2, h * 0.35, 25, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(w / 2 - 20, h * 0.4, 40, 50);
    ctx.fillStyle = '#c0c0c0';
    ctx.beginPath();
    ctx.ellipse(w / 2, h * 0.25, 30, 10, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffd700';
    ctx.beginPath();
    ctx.arc(w / 2 - 20, h * 0.5, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.font = '8px sans-serif';
    ctx.fillStyle = '#1a1a1a';
    ctx.fillText('POLICE', w / 2 - 26, h * 0.52);
  },
  giantHeart: (ctx, w, h, colors, seed, t) => {
    const beat = 1 + Math.sin(t * 6) * 0.2;
    ctx.fillStyle = '#ff0000';
    ctx.save();
    ctx.translate(w / 2, h / 2);
    ctx.scale(beat, beat);
    ctx.beginPath();
    ctx.moveTo(0, 15);
    ctx.bezierCurveTo(-40, -20, -40, -50, 0, -25);
    ctx.bezierCurveTo(40, -50, 40, -20, 0, 15);
    ctx.fill();
    ctx.restore();
    ctx.fillStyle = '#ff000044';
    for (let i = 0; i < 5; i++) {
      const size = 5 + i * 3;
      const dist = 50 + i * 20;
      const angle = t * 2 + i * 1.2;
      ctx.beginPath();
      ctx.arc(w / 2 + Math.cos(angle) * dist, h / 2 + Math.sin(angle) * dist * 0.5, size, 0, Math.PI * 2);
      ctx.fill();
    }
  },

  // LEEK WARS
  leekCode: (ctx, w, h, colors, seed, t) => {
    ctx.font = '10px monospace';
    const code = ['if(enemy)', '  attack()', 'else', '  move()', 'heal()', 'var x=1'];
    for (let i = 0; i < 15; i++) {
      const y = (seededRandom(seed + i) * h + t * 50) % h;
      ctx.fillStyle = colors.primary + Math.floor(50 + seededRandom(seed + i + 100) * 150).toString(16).padStart(2, '0');
      ctx.fillText(code[i % code.length], seededRandom(seed + i + 50) * w * 0.7, y);
    }
  },
  leekWarrior: (ctx, w, h, colors, seed, t) => {
    const bounce = Math.sin(t * 3) * 5;
    ctx.fillStyle = colors.primary;
    ctx.beginPath();
    ctx.ellipse(w / 2, h * 0.55 + bounce, 20, 35, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#228b22';
    ctx.beginPath();
    ctx.moveTo(w / 2 - 5, h * 0.35 + bounce);
    ctx.quadraticCurveTo(w / 2 - 20, h * 0.1, w / 2 - 10, h * 0.05);
    ctx.quadraticCurveTo(w / 2, h * 0.15, w / 2 + 10, h * 0.05);
    ctx.quadraticCurveTo(w / 2 + 20, h * 0.1, w / 2 + 5, h * 0.35 + bounce);
    ctx.fill();
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(w / 2 - 5, h * 0.5 + bounce, 3, 0, Math.PI * 2);
    ctx.arc(w / 2 + 5, h * 0.5 + bounce, 3, 0, Math.PI * 2);
    ctx.fill();
  },
  battleArena: (ctx, w, h, colors, seed, t) => {
    ctx.strokeStyle = colors.primary + '44';
    ctx.lineWidth = 2;
    for (let i = 0; i < 8; i++) {
      ctx.beginPath();
      ctx.arc(w / 2, h * 0.9, 20 + i * 25, Math.PI, Math.PI * 2);
      ctx.stroke();
    }
    ctx.fillStyle = colors.primary;
    ctx.beginPath();
    ctx.ellipse(w * 0.3, h * 0.6, 12, 20, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = colors.secondary;
    ctx.beginPath();
    ctx.ellipse(w * 0.7, h * 0.6, 12, 20, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#ff0000';
    ctx.lineWidth = 2;
    const flash = Math.sin(t * 8) > 0;
    if (flash) {
      ctx.beginPath();
      ctx.moveTo(w * 0.35, h * 0.55);
      ctx.lineTo(w * 0.65, h * 0.55);
      ctx.stroke();
    }
  },
  chipEquipment: (ctx, w, h, colors, seed, t) => {
    for (let i = 0; i < 6; i++) {
      const x = w * 0.15 + i * w * 0.14;
      const y = h * 0.5 + Math.sin(t + i) * 10;
      ctx.fillStyle = colors.secondary;
      ctx.fillRect(x - 12, y - 15, 24, 30);
      ctx.strokeStyle = colors.primary;
      ctx.lineWidth = 2;
      ctx.strokeRect(x - 12, y - 15, 24, 30);
      ctx.fillStyle = colors.primary;
      for (let j = 0; j < 3; j++) {
        ctx.fillRect(x - 8, y - 10 + j * 10, 16, 4);
      }
    }
  },
  tournament: (ctx, w, h, colors, seed, t) => {
    ctx.strokeStyle = colors.primary;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(w * 0.2, h * 0.2);
    ctx.lineTo(w * 0.35, h * 0.2);
    ctx.lineTo(w * 0.35, h * 0.4);
    ctx.lineTo(w * 0.2, h * 0.4);
    ctx.moveTo(w * 0.2, h * 0.6);
    ctx.lineTo(w * 0.35, h * 0.6);
    ctx.lineTo(w * 0.35, h * 0.8);
    ctx.lineTo(w * 0.2, h * 0.8);
    ctx.moveTo(w * 0.35, h * 0.3);
    ctx.lineTo(w * 0.5, h * 0.3);
    ctx.lineTo(w * 0.5, h * 0.5);
    ctx.moveTo(w * 0.35, h * 0.7);
    ctx.lineTo(w * 0.5, h * 0.7);
    ctx.lineTo(w * 0.5, h * 0.5);
    ctx.lineTo(w * 0.7, h * 0.5);
    ctx.stroke();
    ctx.fillStyle = colors.secondary;
    ctx.beginPath();
    ctx.moveTo(w * 0.75, h * 0.35);
    ctx.lineTo(w * 0.85, h * 0.5);
    ctx.lineTo(w * 0.75, h * 0.65);
    ctx.lineTo(w * 0.7, h * 0.5);
    ctx.fill();
  },
  leekScript: (ctx, w, h, colors, seed, t) => {
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(w * 0.1, h * 0.1, w * 0.8, h * 0.8);
    ctx.font = '9px monospace';
    const lines = [
      'function ai() {',
      '  var enemy = getNear',
      '  if (enemy) {',
      '    attack(enemy)',
      '  } else {',
      '    moveToward()',
      '  }',
      '}'
    ];
    for (let i = 0; i < lines.length; i++) {
      ctx.fillStyle = i === Math.floor(t * 2) % lines.length ? colors.primary : colors.primary + '88';
      ctx.fillText(lines[i], w * 0.15, h * 0.2 + i * 14);
    }
    ctx.fillStyle = colors.primary;
    ctx.fillRect(w * 0.15 + (t * 20) % 60, h * 0.17 + (Math.floor(t * 2) % lines.length) * 14, 6, 10);
  },
  weaponSlot: (ctx, w, h, colors, seed, t) => {
    ctx.strokeStyle = colors.primary + '66';
    ctx.lineWidth = 2;
    ctx.strokeRect(w * 0.3, h * 0.3, w * 0.4, h * 0.4);
    ctx.fillStyle = colors.secondary + '44';
    ctx.fillRect(w * 0.3, h * 0.3, w * 0.4, h * 0.4);
    ctx.strokeStyle = colors.primary;
    ctx.lineWidth = 3;
    ctx.save();
    ctx.translate(w / 2, h / 2);
    ctx.rotate(t * 0.5);
    ctx.beginPath();
    ctx.moveTo(-30, 0);
    ctx.lineTo(30, 0);
    ctx.moveTo(20, -8);
    ctx.lineTo(30, 0);
    ctx.lineTo(20, 8);
    ctx.stroke();
    ctx.restore();
    ctx.font = '10px sans-serif';
    ctx.fillStyle = colors.primary;
    ctx.textAlign = 'center';
    ctx.fillText('Fusil Quantique', w / 2, h * 0.8);
  },
  statsBars: (ctx, w, h, colors, seed, t) => {
    const stats = ['VIE', 'FOR', 'AGI', 'WIS', 'RES', 'SCI'];
    for (let i = 0; i < 6; i++) {
      const barWidth = (seededRandom(seed + i) * 0.5 + 0.3) * w * 0.5;
      const pulse = Math.sin(t * 2 + i) * 5;
      ctx.fillStyle = colors.primary + '44';
      ctx.fillRect(w * 0.25, h * 0.15 + i * h * 0.12, w * 0.5, 15);
      ctx.fillStyle = colors.primary;
      ctx.fillRect(w * 0.25, h * 0.15 + i * h * 0.12, barWidth + pulse, 15);
      ctx.font = '9px sans-serif';
      ctx.fillStyle = '#fff';
      ctx.fillText(stats[i], w * 0.15, h * 0.17 + i * h * 0.12 + 10);
    }
  },
  ladderRank: (ctx, w, h, colors, seed, t) => {
    for (let i = 0; i < 5; i++) {
      const x = w * 0.15 + i * w * 0.17;
      const barH = (5 - i) * h * 0.1 + Math.sin(t + i) * 5;
      ctx.fillStyle = i === 0 ? '#ffd700' : i === 1 ? '#c0c0c0' : i === 2 ? '#cd7f32' : colors.primary;
      ctx.fillRect(x, h * 0.8 - barH, w * 0.12, barH);
      ctx.font = '10px sans-serif';
      ctx.fillStyle = '#fff';
      ctx.textAlign = 'center';
      ctx.fillText('#' + (i + 1), x + w * 0.06, h * 0.85);
    }
  },
  teamBattle: (ctx, w, h, colors, seed, t) => {
    for (let i = 0; i < 4; i++) {
      ctx.fillStyle = colors.primary;
      ctx.beginPath();
      ctx.ellipse(w * 0.15 + i * w * 0.08, h * 0.5 + Math.sin(t + i) * 10, 10, 18, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.font = 'bold 20px sans-serif';
    ctx.fillStyle = '#fff';
    ctx.textAlign = 'center';
    ctx.fillText('VS', w / 2, h / 2);
    for (let i = 0; i < 4; i++) {
      ctx.fillStyle = colors.secondary;
      ctx.beginPath();
      ctx.ellipse(w * 0.6 + i * w * 0.08, h * 0.5 - Math.sin(t + i) * 10, 10, 18, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  }
};

// Fonction de rendu générique avec fallback
const renderArtwork = (ctx, w, h, colors, effectName, seed, time) => {
  ctx.fillStyle = colors.bg;
  ctx.fillRect(0, 0, w, h);
  
  if (artworkEffects[effectName]) {
    artworkEffects[effectName](ctx, w, h, colors, seed, time);
  } else {
    // Fallback abstrait basé sur le nom
    const hash = effectName.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
    for (let i = 0; i < 20; i++) {
      const x = seededRandom(hash + i) * w;
      const y = seededRandom(hash + i + 100) * h;
      const size = 8 + seededRandom(hash + i + 200) * 35;
      ctx.fillStyle = `${colors.primary}${Math.floor(25 + seededRandom(hash + i + 300) * 40).toString(16).padStart(2, '0')}`;
      if (seededRandom(hash + i + 400) > 0.5) {
        ctx.beginPath();
        ctx.arc(x, y, size / 2, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillRect(x - size / 2, y - size / 2, size, size);
      }
    }
    ctx.strokeStyle = colors.primary + '33';
    ctx.lineWidth = 1;
    for (let i = 0; i < 5; i++) {
      ctx.beginPath();
      ctx.moveTo(seededRandom(hash + i + 500) * w, seededRandom(hash + i + 600) * h);
      ctx.lineTo(seededRandom(hash + i + 700) * w, seededRandom(hash + i + 800) * h);
      ctx.stroke();
    }
  }
};

const selectUniverse = (key) => {
  selectedUniverse.value = key;
};

const generateGallery = async () => {
  if (!selectedUniverse.value) return;
  
  generatedGallery.value = true;
  loading.value = true;
  loadingProgress.value = 0;
  
  const interval = setInterval(() => {
    loadingProgress.value += Math.random() * 15;
    if (loadingProgress.value >= 100) {
      loadingProgress.value = 100;
      clearInterval(interval);
      setTimeout(() => {
        loading.value = false;
        nextTick(() => {
          initCanvases();
        });
      }, 500);
    }
  }, 100);
};

const backToGenerator = () => {
  generatedGallery.value = false;
  if (animationId) {
    cancelAnimationFrame(animationId);
    animationId = null;
  }
};

const initCanvases = () => {
  if (heroCanvas.value) {
    heroCanvas.value.width = heroCanvas.value.parentElement.offsetWidth;
    heroCanvas.value.height = heroCanvas.value.parentElement.offsetHeight;
  }
  
  if (aboutCanvas.value) {
    aboutCanvas.value.width = aboutCanvas.value.parentElement.offsetWidth;
    aboutCanvas.value.height = aboutCanvas.value.parentElement.offsetHeight;
  }
  
  artworkCanvases.forEach((canvas) => {
    if (canvas) {
      canvas.width = canvas.parentElement.offsetWidth;
      canvas.height = canvas.parentElement.offsetHeight;
    }
  });
  
  startAnimation();
};

const startAnimation = () => {
  const animate = () => {
    t += 0.02;
    const universe = currentUniverse.value;
    if (!universe) return;
    
    if (heroCanvas.value) {
      const ctx = heroCanvas.value.getContext('2d');
      renderArtwork(ctx, heroCanvas.value.width, heroCanvas.value.height, universe.colors, universe.artworks[0].effect, 0, t);
    }
    
    if (aboutCanvas.value) {
      const ctx = aboutCanvas.value.getContext('2d');
      renderArtwork(ctx, aboutCanvas.value.width, aboutCanvas.value.height, universe.colors, universe.artworks[1].effect, 1000, t);
    }
    
    artworkCanvases.forEach((canvas, index) => {
      if (canvas && universe.artworks[index]) {
        const ctx = canvas.getContext('2d');
        const artwork = universe.artworks[index];
        renderArtwork(ctx, canvas.width, canvas.height, universe.colors, artwork.effect, index * 1000, t);
      }
    });
    
    animationId = requestAnimationFrame(animate);
  };
  
  animate();
};

onMounted(() => {
  window.addEventListener('resize', initCanvases);
});

onUnmounted(() => {
  if (animationId) {
    cancelAnimationFrame(animationId);
  }
  window.removeEventListener('resize', initCanvases);
});
</script>

<style scoped>
.gallery-page {
  --accent: #00ff41;
  --bg: #0a0a0a;
  --text: #ffffff;
  --grey: #666;
  min-height: 100vh;
  background: var(--bg);
  color: var(--text);
  font-family: 'Space Grotesk', system-ui, sans-serif;
}

.back-btn {
  position: fixed;
  top: 1.5rem;
  left: 1.5rem;
  z-index: 1000;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 0.75rem 1.25rem;
  border: 1px solid rgba(255,255,255,0.2);
  background: rgba(0,0,0,0.8);
  color: var(--text);
  text-decoration: none;
  backdrop-filter: blur(10px);
  border-radius: 4px;
  transition: all 0.3s;
}

.back-btn:hover {
  border-color: var(--accent);
  color: var(--accent);
}

.back-btn svg {
  width: 14px;
  height: 14px;
}

.generator {
  min-height: 100vh;
  padding: 6rem 2rem 4rem;
}

.generator-header {
  text-align: center;
  margin-bottom: 4rem;
}

.generator-tag {
  font-size: 0.65rem;
  letter-spacing: 0.4em;
  text-transform: uppercase;
  color: var(--accent);
  margin-bottom: 1rem;
  display: block;
}

.generator-title {
  font-family: 'Playfair Display', serif;
  font-size: clamp(2rem, 6vw, 4rem);
  font-weight: 400;
  line-height: 1.1;
  margin-bottom: 1rem;
}

.generator-title em {
  font-style: italic;
  color: var(--accent);
}

.generator-desc {
  color: var(--grey);
  max-width: 500px;
  margin: 0 auto;
  line-height: 1.7;
}

.universe-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
  max-width: 1400px;
  margin: 0 auto 4rem;
}

.universe-option {
  position: relative;
  aspect-ratio: 4/3;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.4s cubic-bezier(0.4, 0, 0, 1);
}

.universe-option:hover {
  transform: scale(1.02);
}

.universe-option.selected {
  outline: 2px solid var(--accent);
  outline-offset: 4px;
}

.universe-option-bg {
  position: absolute;
  inset: 0;
  transition: transform 0.6s;
}

.universe-option:hover .universe-option-bg {
  transform: scale(1.1);
}

.universe-option::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.5) 100%);
  z-index: 1;
}

.universe-option-content {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 1.5rem;
  z-index: 2;
}

.universe-option-name {
  font-family: 'Playfair Display', serif;
  font-size: 1.5rem;
  font-style: italic;
  margin-bottom: 0.25rem;
}

.universe-option-tagline {
  font-size: 0.8rem;
  color: var(--grey);
  margin-bottom: 0.75rem;
}

.universe-option-accent {
  width: 30px;
  height: 3px;
  border-radius: 2px;
  transition: width 0.4s;
}

.universe-option:hover .universe-option-accent {
  width: 60px;
}

.generate-section {
  text-align: center;
  padding: 2rem;
}

.generate-btn {
  display: inline-flex;
  align-items: center;
  gap: 1rem;
  font-size: 0.8rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  padding: 1.25rem 3rem;
  border: none;
  background: var(--accent);
  color: #000;
  cursor: pointer;
  border-radius: 4px;
  transition: transform 0.3s, box-shadow 0.3s;
}

.generate-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 40px rgba(0, 255, 65, 0.3);
}

.generate-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.generate-btn svg {
  width: 18px;
  height: 18px;
}

.gallery-view {
  min-height: 100vh;
}

.back-gallery-btn {
  position: fixed;
  top: 1.5rem;
  right: 1.5rem;
  z-index: 1000;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.7rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 0.75rem 1.25rem;
  border: 1px solid rgba(255,255,255,0.2);
  background: rgba(0,0,0,0.8);
  color: var(--text);
  cursor: pointer;
  backdrop-filter: blur(10px);
  border-radius: 4px;
  transition: all 0.3s;
}

.back-gallery-btn:hover {
  border-color: var(--accent);
  color: var(--accent);
}

.back-gallery-btn svg {
  width: 14px;
  height: 14px;
}

.preloader {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: var(--bg);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.preloader-title {
  font-family: 'Playfair Display', serif;
  font-size: clamp(2rem, 5vw, 4rem);
  font-style: italic;
  margin-bottom: 2rem;
}

.preloader-bar {
  width: 200px;
  height: 2px;
  background: rgba(255,255,255,0.1);
  border-radius: 2px;
  overflow: hidden;
}

.preloader-bar-fill {
  height: 100%;
  transition: width 0.1s;
}

.preloader-text {
  font-size: 0.7rem;
  letter-spacing: 0.2em;
  color: var(--grey);
  margin-top: 1rem;
}

.gallery-hero {
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.hero-canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.hero-content {
  position: relative;
  z-index: 2;
  text-align: center;
  padding: 2rem;
}

.hero-tag {
  font-size: 0.6rem;
  letter-spacing: 0.5em;
  text-transform: uppercase;
  color: var(--accent);
  margin-bottom: 1rem;
  display: block;
}

.hero-title {
  font-family: 'Playfair Display', serif;
  font-size: clamp(3rem, 12vw, 10rem);
  font-weight: 400;
  font-style: italic;
  line-height: 0.95;
  margin-bottom: 1rem;
}

.hero-tagline {
  font-size: 1rem;
  color: var(--grey);
  max-width: 400px;
  margin: 0 auto;
}

.hero-scroll {
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.hero-scroll span {
  font-size: 0.55rem;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: var(--grey);
}

.hero-scroll-line {
  width: 1px;
  height: 50px;
  animation: scrollPulse 2s ease-in-out infinite;
}

@keyframes scrollPulse {
  0%, 100% { transform: scaleY(1); }
  50% { transform: scaleY(1.3); }
}

.marquee {
  padding: 1rem 0;
  border-top: 1px solid rgba(255,255,255,0.05);
  border-bottom: 1px solid rgba(255,255,255,0.05);
  overflow: hidden;
}

.marquee-track {
  display: flex;
  width: fit-content;
  animation: marquee 30s linear infinite;
}

.marquee-item {
  padding: 0 2rem;
  font-family: 'Playfair Display', serif;
  font-size: 1.2rem;
  font-style: italic;
  color: #333;
  white-space: nowrap;
}

.marquee-item::after {
  content: ' ◆ ';
  font-size: 0.4rem;
  color: var(--accent);
  vertical-align: middle;
}

@keyframes marquee {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}

.about-section {
  padding: 8rem 2rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
}

.about-visual {
  aspect-ratio: 1;
  position: relative;
  border: 1px solid rgba(255,255,255,0.05);
}

.about-canvas {
  width: 100%;
  height: 100%;
}

.about-tag {
  font-size: 0.55rem;
  letter-spacing: 0.4em;
  text-transform: uppercase;
  margin-bottom: 1rem;
  display: block;
}

.about-title {
  font-family: 'Playfair Display', serif;
  font-size: clamp(1.5rem, 3vw, 2.5rem);
  font-weight: 400;
  line-height: 1.3;
  margin-bottom: 1rem;
}

.about-text {
  color: var(--grey);
  line-height: 1.8;
  margin-bottom: 2rem;
}

.about-stats {
  display: flex;
  gap: 2rem;
}

.about-stat {
  text-align: center;
}

.stat-number {
  font-family: 'Playfair Display', serif;
  font-size: 2.5rem;
  font-style: italic;
  display: block;
}

.stat-label {
  font-size: 0.55rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--grey);
}

.gallery-grid-section {
  padding: 4rem 2rem 8rem;
  max-width: 1200px;
  margin: 0 auto;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 4rem;
}

.section-tag {
  font-size: 0.55rem;
  letter-spacing: 0.4em;
  text-transform: uppercase;
  margin-bottom: 0.5rem;
  display: block;
}

.section-title {
  font-family: 'Playfair Display', serif;
  font-size: clamp(1.5rem, 4vw, 3rem);
  font-weight: 400;
}

.section-count {
  font-size: 4rem;
  opacity: 0.2;
}

.gallery-grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 1.5rem;
}

.artwork {
  position: relative;
  overflow: hidden;
  cursor: pointer;
}

.artwork-1 { grid-column: span 8; }
.artwork-2 { grid-column: span 4; }
.artwork-3 { grid-column: span 4; }
.artwork-4 { grid-column: span 4; }
.artwork-5 { grid-column: span 4; }
.artwork-6 { grid-column: span 6; }
.artwork-7 { grid-column: span 6; }
.artwork-8 { grid-column: span 4; }
.artwork-9 { grid-column: span 4; }
.artwork-10 { grid-column: span 4; }

.artwork-inner {
  position: relative;
  padding-bottom: 100%;
}

.artwork-1 .artwork-inner { padding-bottom: 60%; }
.artwork-6 .artwork-inner,
.artwork-7 .artwork-inner { padding-bottom: 80%; }

.artwork-canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  transition: transform 0.8s cubic-bezier(0.4, 0, 0, 1);
}

.artwork:hover .artwork-canvas {
  transform: scale(1.05);
}

.artwork-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 60%);
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 1.5rem;
}

.artwork-label {
  font-size: 0.5rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--accent);
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.label-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
}

.artwork-title {
  font-family: 'Playfair Display', serif;
  font-size: clamp(1rem, 2vw, 1.5rem);
  font-style: italic;
  transform: translateY(15px);
  opacity: 0;
  transition: all 0.5s;
}

.artwork:hover .artwork-title {
  transform: translateY(0);
  opacity: 1;
}

.artwork-desc {
  font-size: 0.75rem;
  color: var(--grey);
  margin-top: 0.25rem;
  transform: translateY(15px);
  opacity: 0;
  transition: all 0.5s 0.05s;
}

.artwork:hover .artwork-desc {
  transform: translateY(0);
  opacity: 1;
}

.artwork-meta {
  font-size: 0.55rem;
  color: var(--grey);
  margin-top: 0.25rem;
  transform: translateY(15px);
  opacity: 0;
  transition: all 0.5s 0.1s;
}

.artwork:hover .artwork-meta {
  transform: translateY(0);
  opacity: 1;
}

.cta-section {
  min-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.cta-rings {
  position: absolute;
  inset: 0;
}

.cta-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  border-radius: 50%;
  border: 1px solid;
  opacity: 0.1;
}

.cta-ring:nth-child(1) {
  width: 200px;
  height: 200px;
  margin: -100px 0 0 -100px;
  animation: ringPulse 5s ease-in-out infinite;
}

.cta-ring:nth-child(2) {
  width: 350px;
  height: 350px;
  margin: -175px 0 0 -175px;
  animation: ringPulse 5s ease-in-out infinite 1s;
}

.cta-ring:nth-child(3) {
  width: 500px;
  height: 500px;
  margin: -250px 0 0 -250px;
  animation: ringPulse 5s ease-in-out infinite 2s;
}

@keyframes ringPulse {
  0%, 100% { transform: scale(1); opacity: 0.05; }
  50% { transform: scale(1.05); opacity: 0.15; }
}

.cta-content {
  position: relative;
  z-index: 2;
  text-align: center;
  max-width: 600px;
  padding: 2rem;
}

.cta-tag {
  font-size: 0.55rem;
  letter-spacing: 0.5em;
  text-transform: uppercase;
  margin-bottom: 1rem;
  display: block;
}

.cta-title {
  font-family: 'Playfair Display', serif;
  font-size: clamp(2rem, 6vw, 4rem);
  font-weight: 400;
  line-height: 1.1;
  margin-bottom: 1rem;
}

.cta-text {
  color: var(--grey);
  margin-bottom: 2rem;
  line-height: 1.7;
}

.cta-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.7rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  padding: 1.25rem 2.5rem;
  border: 1px solid #fff;
  background: transparent;
  color: #fff;
  text-decoration: none;
  position: relative;
  overflow: hidden;
  transition: color 0.4s;
}

.cta-btn::before {
  content: '';
  position: absolute;
  inset: 0;
  background: #fff;
  transform: scaleY(0);
  transform-origin: bottom;
  transition: transform 0.4s cubic-bezier(0.76, 0, 0.24, 1);
}

.cta-btn:hover {
  color: var(--bg);
}

.cta-btn:hover::before {
  transform: scaleY(1);
  transform-origin: top;
}

.cta-btn span,
.cta-btn svg {
  position: relative;
  z-index: 1;
}

.cta-btn svg {
  width: 16px;
  height: 16px;
}

.gallery-footer {
  padding: 4rem 2rem 2rem;
  border-top: 1px solid rgba(255,255,255,0.05);
}

.footer-inner {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.footer-brand {
  font-family: 'Playfair Display', serif;
  font-size: 1.2rem;
  font-style: italic;
}

.footer-copy {
  font-size: 0.55rem;
  letter-spacing: 0.1em;
  color: var(--grey);
}

@media (max-width: 1024px) {
  .about-section {
    grid-template-columns: 1fr;
    gap: 3rem;
  }
  
  .gallery-grid {
    grid-template-columns: repeat(6, 1fr);
  }
  
  .artwork-1,
  .artwork-2,
  .artwork-3,
  .artwork-4,
  .artwork-5,
  .artwork-6,
  .artwork-7,
  .artwork-8,
  .artwork-9,
  .artwork-10 {
    grid-column: span 3;
  }
  
  .artwork-1 {
    grid-column: span 6;
  }
}

@media (max-width: 768px) {
  .universe-grid {
    grid-template-columns: 1fr;
  }
  
  .gallery-grid {
    grid-template-columns: 1fr;
  }
  
  .artwork-1,
  .artwork-2,
  .artwork-3,
  .artwork-4,
  .artwork-5,
  .artwork-6,
  .artwork-7,
  .artwork-8,
  .artwork-9,
  .artwork-10 {
    grid-column: span 1;
  }
  
  .footer-inner {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
  
  .back-btn,
  .back-gallery-btn {
    padding: 0.5rem 1rem;
    font-size: 0.6rem;
  }
}
</style>