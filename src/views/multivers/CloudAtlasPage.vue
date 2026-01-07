<template>
  <div class="cloud-atlas-page">
    <!-- Skip link -->
    <a href="#main-content" class="skip-link">Aller au contenu principal</a>
    
    <!-- HERO : Atlas de nuages -->
    <section class="atlas-hero" aria-labelledby="hero-title">
      <div class="atlas-hero__bg" aria-hidden="true">
        <div class="atlas-hero__stars"></div>
        <div class="atlas-hero__clouds"></div>
        <div class="atlas-hero__connections">
          <svg class="connections-svg" viewBox="0 0 1200 600" preserveAspectRatio="none" aria-hidden="true">
            <defs>
              <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#0ea5e9" stop-opacity="0" />
                <stop offset="50%" stop-color="#ec4899" stop-opacity="0.8" />
                <stop offset="100%" stop-color="#0ea5e9" stop-opacity="0" />
              </linearGradient>
            </defs>
            <!-- Lignes de connexion entre époques -->
            <path class="connection-line" d="M100,500 Q300,200 500,350 T900,150 T1100,400" 
                  stroke="url(#lineGradient)" fill="none" stroke-width="2"/>
            <path class="connection-line connection-line--delay" d="M50,300 Q250,450 450,200 T850,350 T1150,200" 
                  stroke="url(#lineGradient)" fill="none" stroke-width="1.5"/>
          </svg>
          <!-- Points d'époque -->
          <div class="era-point era-point--1849" data-era="1849" aria-hidden="true">
            <span class="era-point__dot"></span>
            <span class="era-point__label">1849</span>
          </div>
          <div class="era-point era-point--1936" data-era="1936" aria-hidden="true">
            <span class="era-point__dot"></span>
            <span class="era-point__label">1936</span>
          </div>
          <div class="era-point era-point--1973" data-era="1973" aria-hidden="true">
            <span class="era-point__dot"></span>
            <span class="era-point__label">1973</span>
          </div>
          <div class="era-point era-point--2012" data-era="2012" aria-hidden="true">
            <span class="era-point__dot"></span>
            <span class="era-point__label">2012</span>
          </div>
          <div class="era-point era-point--2144" data-era="2144" aria-hidden="true">
            <span class="era-point__dot"></span>
            <span class="era-point__label">2144</span>
          </div>
          <div class="era-point era-point--2321" data-era="2321" aria-hidden="true">
            <span class="era-point__dot"></span>
            <span class="era-point__label">2321</span>
          </div>
        </div>
      </div>
      
      <div class="container atlas-hero__content">
        <div class="comet-badge" aria-hidden="true">
          <svg class="comet-icon" viewBox="0 0 40 40" width="24" height="24" aria-hidden="true">
            <circle cx="20" cy="20" r="8" fill="none" stroke="currentColor" stroke-width="2"/>
            <path d="M20 8 Q25 4 30 6 Q28 10 20 12" fill="currentColor" opacity="0.6"/>
          </svg>
          <span>Nos vies ne nous appartiennent pas</span>
        </div>
        
        <h1 id="hero-title" class="atlas-hero__title">
          <span class="title-line title-line--1">Cloud</span>
          <span class="title-line title-line--2">Atlas</span>
        </h1>
        
        <p class="atlas-hero__quote">
          « Du berceau à la tombe, nous sommes liés aux autres.<br>
          Passé et présent. Et par chaque crime, chaque acte de bonté,<br>
          nous façonnons notre avenir. »
        </p>
        
        <div class="atlas-hero__scroll" aria-hidden="true">
          <span>Explorer les époques</span>
          <div class="scroll-indicator">
            <span></span>
          </div>
        </div>
      </div>
    </section>

    <!-- TIMELINE Navigation -->
    <nav class="timeline-nav" aria-label="Navigation par époque">
      <div class="container">
        <div class="timeline-track" role="tablist" aria-label="Sélection d'époque">
          <div class="timeline-line" aria-hidden="true"></div>
          <button 
            v-for="era in eras" 
            :key="era.year"
            class="timeline-point"
            :class="{ 'active': activeEra === era.year }"
            @click="scrollToEra(era.year)"
            role="tab"
            :aria-selected="activeEra === era.year"
            :aria-label="`Époque ${era.year} - ${era.shortName}`"
          >
            <span class="timeline-point__dot" :style="{ background: era.color }" aria-hidden="true"></span>
            <span class="timeline-point__year">{{ era.year }}</span>
            <span class="timeline-point__name">{{ era.shortName }}</span>
          </button>
        </div>
      </div>
    </nav>

    <!-- SECTIONS PAR ÉPOQUE -->
    <main id="main-content">
    <!-- 1849 : Le Journal du Pacifique -->
    <section class="era-section era-1849" id="era-1849" data-era="1849" aria-labelledby="era-1849-title">
      <div class="era-section__bg"></div>
      <div class="container">
        <div class="era-header">
          <span class="era-number" aria-hidden="true">I</span>
          <div class="era-titles">
            <h2 id="era-1849-title" class="era-title">Le Journal du Pacifique d'Adam Ewing</h2>
            <span class="era-subtitle">1849 · Océan Pacifique</span>
          </div>
        </div>
        
        <div class="era-content era-content--split">
          <div class="era-text">
            <p class="era-intro">
              Un notaire américain navigue vers son pays depuis les îles Chatham, 
              documentant son voyage et les horreurs du colonialisme dont il est témoin.
            </p>
            <blockquote class="era-quote">
              « Que ne donnerais-je pas pour une carte immuable de l'ineffable constant ? 
              Posséder, en quelque sorte, un atlas de nuages. »
            </blockquote>
          </div>
          
          <div class="artifact artifact--journal">
            <div class="artifact__frame">
              <div class="artifact__header">
                <span class="artifact__type">Journal de bord</span>
                <span class="artifact__date">Nov. 1849</span>
              </div>
              <div class="artifact__content">
                <p class="artifact__text artifact__text--handwritten">
                  La traversée du Pacifique a mis ma constitution à rude épreuve. 
                  Le Dr Goose insiste que mon mal nécessite son étrange vermifuge...
                </p>
                <div class="artifact__comet">☄</div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="era-themes">
          <span class="theme-tag">Colonialisme</span>
          <span class="theme-tag">Esclavage</span>
          <span class="theme-tag">Compassion</span>
        </div>
      </div>
    </section>

    <!-- 1936 : Lettres de Zedelghem -->
    <section class="era-section era-1936" id="era-1936" data-era="1936" aria-labelledby="era-1936-title">
      <div class="era-section__bg"></div>
      <div class="container">
        <div class="era-header">
          <span class="era-number" aria-hidden="true">II</span>
          <div class="era-titles">
            <h2 id="era-1936-title" class="era-title">Lettres de Zedelghem</h2>
            <span class="era-subtitle">1936 · Belgique</span>
          </div>
        </div>
        
        <div class="era-content era-content--split era-content--reverse">
          <div class="artifact artifact--letter">
            <div class="artifact__frame">
              <div class="artifact__header">
                <span class="artifact__type">Lettre</span>
                <span class="artifact__date">Zedelghem, 1936</span>
              </div>
              <div class="artifact__content">
                <p class="artifact__text artifact__text--typewriter">
                  Sixsmith,<br><br>
                  J'ai trouvé le paradis dans ce château. Le vieux compositeur Vyvyan Ayrs 
                  m'a pris comme secrétaire. Ce soir, je commence à composer ma propre œuvre — 
                  le Sextuor de l'Atlas des Nuages...
                </p>
                <div class="artifact__comet">☄</div>
              </div>
            </div>
          </div>
          
          <div class="era-text">
            <p class="era-intro">
              Un jeune compositeur anglais bisexuel, Robert Frobisher, devient le secrétaire 
              d'un compositeur célèbre mais vieillissant, tout en écrivant son chef-d'œuvre.
            </p>
            <blockquote class="era-quote">
              « Un livre inachevé est, après tout, une histoire d'amour inachevée. »
            </blockquote>
          </div>
        </div>
        
        <div class="era-themes">
          <span class="theme-tag">Art</span>
          <span class="theme-tag">Obsession</span>
          <span class="theme-tag">Héritage</span>
        </div>
      </div>
    </section>

    <!-- 1973 : Demi-Vies -->
    <section class="era-section era-1973" id="era-1973" data-era="1973" aria-labelledby="era-1973-title">
      <div class="era-section__bg"></div>
      <div class="container">
        <div class="era-header">
          <span class="era-number" aria-hidden="true">III</span>
          <div class="era-titles">
            <h2 id="era-1973-title" class="era-title">Demi-Vies : Le Premier Mystère de Luisa Rey</h2>
            <span class="era-subtitle">1973 · San Francisco</span>
          </div>
        </div>
        
        <div class="era-content era-content--split">
          <div class="era-text">
            <p class="era-intro">
              Une jeune journaliste enquête sur une conspiration dans une centrale nucléaire, 
              mettant sa vie en danger pour exposer la malveillance des grandes entreprises.
            </p>
            <blockquote class="era-quote">
              « La vérité est singulière. Ses « versions » sont des contre-vérités. »
            </blockquote>
          </div>
          
          <div class="artifact artifact--report">
            <div class="artifact__frame">
              <div class="artifact__header">
                <span class="artifact__type">Rapport confidentiel</span>
                <span class="artifact__date">SWANNEKKE NUCLEAR</span>
              </div>
              <div class="artifact__content">
                <p class="artifact__text artifact__text--mono">
                  CLASSIFIÉ<br>
                  ────────────────<br>
                  Objet : Analyse de sécurité du réacteur<br>
                  Statut : DÉFAILLANCES CRITIQUES DÉTECTÉES<br>
                  Action : [EXPURGÉ]<br>
                  ────────────────<br>
                </p>
                <div class="artifact__comet">☄</div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="era-themes">
          <span class="theme-tag">Conspiration</span>
          <span class="theme-tag">Journalisme</span>
          <span class="theme-tag">Courage</span>
        </div>
      </div>
    </section>

    <!-- 2012 : L'Épouvantable Calvaire -->
    <section class="era-section era-2012" id="era-2012" data-era="2012" aria-labelledby="era-2012-title">
      <div class="era-section__bg"></div>
      <div class="container">
        <div class="era-header">
          <span class="era-number" aria-hidden="true">IV</span>
          <div class="era-titles">
            <h2 id="era-2012-title" class="era-title">L'Épouvantable Calvaire de Timothy Cavendish</h2>
            <span class="era-subtitle">2012 · Angleterre</span>
          </div>
        </div>
        
        <div class="era-content era-content--split era-content--reverse">
          <div class="artifact artifact--manuscript">
            <div class="artifact__frame">
              <div class="artifact__header">
                <span class="artifact__type">Manuscrit</span>
                <span class="artifact__date">Aurora House</span>
              </div>
              <div class="artifact__content">
                <p class="artifact__text artifact__text--print">
                  Chapitre 1 : Comment je fus emprisonné<br><br>
                  Les personnes âgées, je l'apprends, sont les nègres littéraires de l'Histoire. 
                  Nos récits sont honteusement étouffés...
                </p>
                <div class="artifact__comet">☄</div>
              </div>
            </div>
          </div>
          
          <div class="era-text">
            <p class="era-intro">
              Un éditeur à compte d'auteur se retrouve piégé dans une maison de retraite 
              après avoir fui des gangsters, menant une évasion comique avec ses compagnons.
            </p>
            <blockquote class="era-quote">
              « Dehors, de gros flocons de neige tombaient sur les toits d'ardoise et les murs de granit. 
              Je savais que j'étais sur le point de tenter une évasion. »
            </blockquote>
          </div>
        </div>
        
        <div class="era-themes">
          <span class="theme-tag">Liberté</span>
          <span class="theme-tag">Vieillesse</span>
          <span class="theme-tag">Rébellion</span>
        </div>
      </div>
    </section>

    <!-- 2144 : L'Oraison de Sonmi~451 -->
    <section class="era-section era-2144" id="era-2144" data-era="2144" aria-labelledby="era-2144-title">
      <div class="era-section__bg" aria-hidden="true">
        <div class="neo-seoul-grid"></div>
        <div class="neo-seoul-hologram"></div>
      </div>
      <div class="container">
        <div class="era-header era-header--neon">
          <span class="era-number" aria-hidden="true">V</span>
          <div class="era-titles">
            <h2 id="era-2144-title" class="era-title">L'Oraison de Sonmi~451</h2>
            <span class="era-subtitle">2144 · Néo-Séoul</span>
          </div>
        </div>
        
        <div class="era-content era-content--split">
          <div class="era-text era-text--neon">
            <p class="era-intro">
              Une « fabricante » génétiquement modifiée, servant dans un fast-food, 
              prend conscience d'elle-même et mène une rébellion contre l'État corporatiste.
            </p>
            <blockquote class="era-quote era-quote--neon">
              « Nos vies ne nous appartiennent pas. Du berceau à la tombe, nous sommes liés aux autres. »
            </blockquote>
          </div>
          
          <div class="artifact artifact--orison">
            <div class="artifact__frame artifact__frame--hologram">
              <div class="artifact__header">
                <span class="artifact__type">ENREGISTREMENT_ORAISON</span>
                <span class="artifact__date">ARCHIVE_UNION</span>
              </div>
              <div class="artifact__content">
                <div class="orison-display">
                  <div class="orison-avatar">⬡</div>
                  <p class="artifact__text artifact__text--digital">
                    SONMI~451<br>
                    STATUT : ASCENSIONÉE<br>
                    MESSAGE : La vérité est singulière...<br>
                    TRANSMISSION : ACTIVE
                  </p>
                </div>
                <div class="artifact__comet artifact__comet--neon">☄</div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="era-themes era-themes--neon">
          <span class="theme-tag theme-tag--cyan">Révolution</span>
          <span class="theme-tag theme-tag--magenta">Identité</span>
          <span class="theme-tag theme-tag--yellow">Sacrifice</span>
        </div>
      </div>
    </section>

    <!-- 2321 : La Traversée de Sloosha -->
    <section class="era-section era-2321" id="era-2321" data-era="2321" aria-labelledby="era-2321-title">
      <div class="era-section__bg" aria-hidden="true">
        <div class="post-apo-mist"></div>
      </div>
      <div class="container">
        <div class="era-header era-header--tribal">
          <span class="era-number" aria-hidden="true">VI</span>
          <div class="era-titles">
            <h2 id="era-2321-title" class="era-title">La Traversée de Sloosha et tout c'qui s'ensuit</h2>
            <span class="era-subtitle">2321 · Grande Île, Hawaï</span>
          </div>
        </div>
        
        <div class="era-content era-content--split era-content--reverse">
          <div class="artifact artifact--sacred">
            <div class="artifact__frame artifact__frame--tribal">
              <div class="artifact__header">
                <span class="artifact__type">Texte Sacré</span>
                <span class="artifact__date">Temple de Sonmi</span>
              </div>
              <div class="artifact__content">
                <p class="artifact__text artifact__text--tribal">
                  Les Prescients parlaient d'Sonmi<br>
                  Qui s'dressa contre la corporocratie<br>
                  Ses mots sont maintenant vérité sacrée<br>
                  Nous guidant à travers la Chute...
                </p>
                <div class="artifact__comet artifact__comet--fire">☄</div>
              </div>
            </div>
          </div>
          
          <div class="era-text">
            <p class="era-intro">
              Dans un Hawaï post-apocalyptique, un membre de tribu nommé Zachry rencontre 
              l'une des dernières personnes technologiquement avancées, cherchant des réponses 
              sur la Chute.
            </p>
            <blockquote class="era-quote era-quote--tribal">
              « Si nous croyons qu'une vie ne vaut rien, alors quel prix pouvons-nous mettre sur la mort ? »
            </blockquote>
          </div>
        </div>
        
        <div class="era-themes">
          <span class="theme-tag theme-tag--earth">Foi</span>
          <span class="theme-tag theme-tag--earth">Survie</span>
          <span class="theme-tag theme-tag--earth">Espoir</span>
        </div>
      </div>
    </section>
    </main>

    <!-- CONNEXIONS : Liens visuels -->
    <section class="connections-section" aria-labelledby="connections-title">
      <div class="container">
        <h2 id="connections-title" class="connections-title">
          <span class="comet-icon-inline" aria-hidden="true">☄</span>
          La Marque de la Comète
        </h2>
        <p class="connections-desc">
          Chaque protagoniste porte une tache de naissance en forme de comète, suggérant la même âme 
          se réincarnant à travers le temps. Leurs histoires s'entrelacent : le journal d'Ewing inspire 
          Frobisher, dont les lettres parviennent à Luisa Rey, dont l'histoire devient le livre de Cavendish, 
          qui devient un film vénéré par Sonmi, dont les enseignements deviennent la religion de Zachry.
        </p>
        
        <div class="soul-chain">
          <div 
            v-for="(soul, index) in souls" 
            :key="soul.name"
            class="soul-node"
            :class="'soul-node--' + soul.era"
            @mouseenter="highlightConnections(soul.era)"
            @mouseleave="clearHighlights"
          >
            <div class="soul-node__avatar">{{ soul.icon }}</div>
            <span class="soul-node__name">{{ soul.name }}</span>
            <span class="soul-node__era">{{ soul.era }}</span>
            <div class="soul-node__comet">☄</div>
          </div>
        </div>
      </div>
    </section>

    <!-- CITATION FINALE -->
    <section class="final-section">
      <div class="container">
        <blockquote class="final-quote">
          <p>« Ma vie ne représente rien de plus qu'une goutte dans un océan sans limites. »</p>
          <p class="final-quote__response">« Mais qu'est-ce qu'un océan, sinon une multitude de gouttes ? »</p>
        </blockquote>
        
        <div class="final-comet">
          <svg viewBox="0 0 100 100" class="comet-large">
            <circle cx="50" cy="50" r="20" fill="none" stroke="url(#cometGradient)" stroke-width="3"/>
            <path d="M50 25 Q70 10 85 15 Q80 30 50 30" fill="url(#cometGradient)" opacity="0.6"/>
            <defs>
              <linearGradient id="cometGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#0ea5e9"/>
                <stop offset="50%" stop-color="#ec4899"/>
                <stop offset="100%" stop-color="#f59e0b"/>
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const activeEra = ref('1849');
const highlightedEra = ref(null);

const eras = [
  { year: '1849', shortName: 'Pacific', color: '#d4a574' },
  { year: '1936', shortName: 'Zedelghem', color: '#c9a962' },
  { year: '1973', shortName: 'Luisa Rey', color: '#8b7355' },
  { year: '2012', shortName: 'Cavendish', color: '#6b8e6b' },
  { year: '2144', shortName: 'Neo Seoul', color: '#ec4899' },
  { year: '2321', shortName: "Sloosha's", color: '#4a7c59' }
];

const souls = [
  { name: 'Adam Ewing', era: '1849', icon: '📜' },
  { name: 'Robert Frobisher', era: '1936', icon: '🎼' },
  { name: 'Luisa Rey', era: '1973', icon: '📰' },
  { name: 'Timothy Cavendish', era: '2012', icon: '📖' },
  { name: 'Sonmi~451', era: '2144', icon: '⬡' },
  { name: 'Zachry', era: '2321', icon: '🔥' }
];

const scrollToEra = (year) => {
  activeEra.value = year;
  const element = document.getElementById(`era-${year}`);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
};

const highlightConnections = (era) => {
  highlightedEra.value = era;
  // Add glow effect to related artifacts
  document.querySelectorAll(`[data-era="${era}"]`).forEach(el => {
    el.classList.add('connected-glow');
  });
};

const clearHighlights = () => {
  highlightedEra.value = null;
  document.querySelectorAll('.connected-glow').forEach(el => {
    el.classList.remove('connected-glow');
  });
};

// Intersection Observer for active era
let observer = null;

onMounted(() => {
  observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        activeEra.value = entry.target.dataset.era;
      }
    });
  }, { threshold: 0.3 });

  document.querySelectorAll('.era-section').forEach(section => {
    observer.observe(section);
  });
});

onUnmounted(() => {
  if (observer) observer.disconnect();
});
</script>

<style scoped>
/* =====================================================
   CLOUD ATLAS PAGE - Multi-Era Immersive Design
   ===================================================== */

.cloud-atlas-page {
  background: #0a0a0f;
  color: #e8e6e3;
  overflow-x: hidden;
}

/* =====================================================
   HERO SECTION
   ===================================================== */
.atlas-hero {
  min-height: 100vh;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.atlas-hero__bg {
  position: absolute;
  inset: 0;
  background: 
    radial-gradient(ellipse at 30% 20%, rgba(14, 165, 233, 0.15) 0%, transparent 50%),
    radial-gradient(ellipse at 70% 80%, rgba(236, 72, 153, 0.15) 0%, transparent 50%),
    linear-gradient(180deg, #0a0a1a 0%, #0f0f1f 50%, #0a0a0f 100%);
}

.atlas-hero__stars {
  position: absolute;
  inset: 0;
  background-image: 
    radial-gradient(2px 2px at 20px 30px, white, transparent),
    radial-gradient(2px 2px at 40px 70px, rgba(255,255,255,0.8), transparent),
    radial-gradient(1px 1px at 90px 40px, white, transparent),
    radial-gradient(2px 2px at 160px 120px, rgba(255,255,255,0.6), transparent),
    radial-gradient(1px 1px at 230px 80px, white, transparent),
    radial-gradient(2px 2px at 300px 150px, rgba(255,255,255,0.7), transparent);
  background-size: 350px 200px;
  animation: twinkle 8s ease-in-out infinite;
}

@keyframes twinkle {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
}

.atlas-hero__clouds {
  position: absolute;
  inset: 0;
  background: 
    url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
  opacity: 0.03;
}

.atlas-hero__connections {
  position: absolute;
  inset: 0;
}

.connections-svg {
  width: 100%;
  height: 100%;
}

.connection-line {
  stroke-dasharray: 1000;
  stroke-dashoffset: 1000;
  animation: drawLine 4s ease forwards;
}

.connection-line--delay {
  animation-delay: 1s;
}

@keyframes drawLine {
  to { stroke-dashoffset: 0; }
}

.era-point {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.era-point:hover {
  transform: scale(1.2);
}

.era-point__dot {
  width: 12px;
  height: 12px;
  background: #ec4899;
  border-radius: 50%;
  box-shadow: 0 0 20px rgba(236, 72, 153, 0.6);
  animation: pulse-glow 2s ease-in-out infinite;
}

.era-point__label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.6rem;
  color: rgba(255,255,255,0.6);
}

.era-point--1849 { top: 70%; left: 10%; }
.era-point--1936 { top: 30%; left: 25%; }
.era-point--1973 { top: 55%; left: 40%; }
.era-point--2012 { top: 25%; left: 55%; }
.era-point--2144 { top: 60%; left: 70%; }
.era-point--2321 { top: 35%; left: 85%; }

@keyframes pulse-glow {
  0%, 100% { box-shadow: 0 0 20px rgba(236, 72, 153, 0.6); }
  50% { box-shadow: 0 0 40px rgba(236, 72, 153, 0.9); }
}

.atlas-hero__content {
  position: relative;
  z-index: 2;
  text-align: center;
  padding-top: 80px;
}

.comet-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 1.25rem;
  background: rgba(236, 72, 153, 0.1);
  border: 1px solid rgba(236, 72, 153, 0.3);
  border-radius: 2rem;
  margin-bottom: 2rem;
}

.comet-badge span {
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: 0.9rem;
  font-style: italic;
  color: rgba(255,255,255,0.8);
}

.comet-icon {
  color: #ec4899;
}

.atlas-hero__title {
  margin-bottom: 2rem;
}

.title-line {
  display: block;
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-weight: 300;
  line-height: 1;
}

.title-line--1 {
  font-size: clamp(4rem, 15vw, 10rem);
  color: rgba(255,255,255,0.9);
  letter-spacing: 0.2em;
}

.title-line--2 {
  font-size: clamp(5rem, 20vw, 14rem);
  background: linear-gradient(135deg, #0ea5e9, #ec4899, #f59e0b);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: 0.1em;
}

.atlas-hero__quote {
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: clamp(1rem, 2.5vw, 1.5rem);
  font-style: italic;
  color: rgba(255,255,255,0.6);
  line-height: 1.8;
  max-width: 600px;
  margin: 0 auto 3rem;
}

.atlas-hero__scroll {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.atlas-hero__scroll span {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.7rem;
  color: rgba(255,255,255,0.4);
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.scroll-indicator {
  width: 24px;
  height: 40px;
  border: 2px solid rgba(255,255,255,0.3);
  border-radius: 12px;
  position: relative;
}

.scroll-indicator span {
  position: absolute;
  top: 8px;
  left: 50%;
  transform: translateX(-50%);
  width: 4px;
  height: 8px;
  background: #ec4899;
  border-radius: 2px;
  animation: scroll-bounce 2s ease-in-out infinite;
}

@keyframes scroll-bounce {
  0%, 100% { top: 8px; opacity: 1; }
  50% { top: 20px; opacity: 0.5; }
}

/* =====================================================
   TIMELINE NAVIGATION
   ===================================================== */
.timeline-nav {
  position: sticky;
  top: 80px;
  z-index: 50;
  padding: 1rem 0;
  background: rgba(10, 10, 15, 0.95);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(255,255,255,0.05);
}

.timeline-track {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  padding: 0 1rem;
}

.timeline-line {
  position: absolute;
  top: 50%;
  left: 2rem;
  right: 2rem;
  height: 2px;
  background: linear-gradient(90deg, 
    #d4a574, #c9a962, #8b7355, #6b8e6b, #ec4899, #4a7c59
  );
  opacity: 0.3;
}

.timeline-point {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  background: none;
  border: none;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.timeline-point:hover {
  transform: translateY(-4px);
}

.timeline-point__dot {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 2px solid rgba(255,255,255,0.3);
  transition: all 0.3s ease;
}

.timeline-point.active .timeline-point__dot {
  border-color: transparent;
  box-shadow: 0 0 20px currentColor;
}

.timeline-point__year {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.7rem;
  color: rgba(255,255,255,0.8);
}

.timeline-point__name {
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: 0.65rem;
  color: rgba(255,255,255,0.4);
}

/* =====================================================
   ERA SECTIONS - BASE
   ===================================================== */
.era-section {
  min-height: 100vh;
  position: relative;
  padding: 8rem 0;
  overflow: hidden;
}

.era-section__bg {
  position: absolute;
  inset: 0;
  z-index: 0;
}

.era-header {
  display: flex;
  align-items: flex-start;
  gap: 2rem;
  margin-bottom: 4rem;
  position: relative;
  z-index: 2;
}

.era-number {
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: 6rem;
  font-weight: 300;
  line-height: 1;
  opacity: 0.2;
}

.era-titles {
  padding-top: 1rem;
}

.era-title {
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: clamp(2rem, 5vw, 3.5rem);
  font-weight: 400;
  margin-bottom: 0.5rem;
}

.era-subtitle {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.8rem;
  opacity: 0.6;
  letter-spacing: 0.1em;
}

.era-content {
  position: relative;
  z-index: 2;
}

.era-content--split {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
}

.era-content--reverse {
  direction: rtl;
}

.era-content--reverse > * {
  direction: ltr;
}

.era-text {
  max-width: 500px;
}

.era-intro {
  font-size: 1.1rem;
  line-height: 1.8;
  margin-bottom: 2rem;
  color: rgba(255,255,255,0.8);
}

.era-quote {
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: 1.25rem;
  font-style: italic;
  padding-left: 1.5rem;
  border-left: 3px solid currentColor;
  opacity: 0.7;
}

.era-themes {
  display: flex;
  gap: 0.75rem;
  margin-top: 3rem;
  position: relative;
  z-index: 2;
}

.theme-tag {
  padding: 0.5rem 1rem;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 2rem;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.7rem;
  color: rgba(255,255,255,0.6);
}

/* =====================================================
   ARTIFACTS
   ===================================================== */
.artifact {
  max-width: 400px;
}

.artifact__frame {
  background: rgba(20, 20, 25, 0.8);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 0.5rem;
  overflow: hidden;
  transition: all 0.3s ease;
}

.artifact:hover .artifact__frame {
  border-color: rgba(255,255,255,0.2);
  box-shadow: 0 20px 60px rgba(0,0,0,0.4);
}

.artifact__header {
  display: flex;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  background: rgba(255,255,255,0.03);
  border-bottom: 1px solid rgba(255,255,255,0.05);
}

.artifact__type,
.artifact__date {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.65rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  opacity: 0.5;
}

.artifact__content {
  padding: 1.5rem;
  position: relative;
}

.artifact__text {
  font-size: 0.9rem;
  line-height: 1.7;
  color: rgba(255,255,255,0.7);
}

.artifact__text--handwritten {
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-style: italic;
}

.artifact__text--typewriter {
  font-family: 'Courier New', monospace;
}

.artifact__text--mono {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.75rem;
}

.artifact__text--print {
  font-family: 'Georgia', serif;
}

.artifact__text--digital {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.75rem;
  color: #0ea5e9;
}

.artifact__text--tribal {
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: 1rem;
  line-height: 2;
}

.artifact__comet {
  position: absolute;
  bottom: 1rem;
  right: 1rem;
  font-size: 1.5rem;
  opacity: 0.2;
  transition: all 0.3s ease;
}

.artifact:hover .artifact__comet {
  opacity: 0.6;
  transform: scale(1.2);
}

/* =====================================================
   ERA 1849 - PACIFIC
   ===================================================== */
.era-1849 {
  --era-color: #d4a574;
}

.era-1849 .era-section__bg {
  background: 
    linear-gradient(180deg, rgba(10,10,15,0) 0%, rgba(30, 25, 20, 0.3) 100%),
    radial-gradient(ellipse at 80% 100%, rgba(212, 165, 116, 0.1) 0%, transparent 50%);
}

.era-1849 .era-number { color: var(--era-color); }
.era-1849 .era-quote { border-color: var(--era-color); }
.era-1849 .artifact__frame { border-color: rgba(212, 165, 116, 0.2); }

/* =====================================================
   ERA 1936 - ZEDELGHEM
   ===================================================== */
.era-1936 {
  --era-color: #c9a962;
}

.era-1936 .era-section__bg {
  background: 
    linear-gradient(180deg, rgba(10,10,15,0) 0%, rgba(40, 35, 25, 0.3) 100%),
    radial-gradient(ellipse at 20% 80%, rgba(201, 169, 98, 0.1) 0%, transparent 50%);
}

.era-1936 .era-number { color: var(--era-color); }
.era-1936 .era-quote { border-color: var(--era-color); }
.era-1936 .artifact__frame { border-color: rgba(201, 169, 98, 0.2); }

/* =====================================================
   ERA 1973 - SAN FRANCISCO
   ===================================================== */
.era-1973 {
  --era-color: #8b7355;
}

.era-1973 .era-section__bg {
  background: 
    linear-gradient(180deg, rgba(10,10,15,0) 0%, rgba(35, 30, 25, 0.4) 100%),
    radial-gradient(ellipse at 70% 30%, rgba(139, 115, 85, 0.1) 0%, transparent 50%);
}

.era-1973 .era-number { color: var(--era-color); }
.era-1973 .era-quote { border-color: var(--era-color); }
.era-1973 .artifact__frame { 
  border-color: rgba(139, 115, 85, 0.2);
  background: rgba(15, 15, 15, 0.9);
}

/* =====================================================
   ERA 2012 - ENGLAND
   ===================================================== */
.era-2012 {
  --era-color: #6b8e6b;
}

.era-2012 .era-section__bg {
  background: 
    linear-gradient(180deg, rgba(10,10,15,0) 0%, rgba(25, 35, 25, 0.3) 100%),
    radial-gradient(ellipse at 30% 70%, rgba(107, 142, 107, 0.1) 0%, transparent 50%);
}

.era-2012 .era-number { color: var(--era-color); }
.era-2012 .era-quote { border-color: var(--era-color); }
.era-2012 .artifact__frame { border-color: rgba(107, 142, 107, 0.2); }

/* =====================================================
   ERA 2144 - NEO SEOUL
   ===================================================== */
.era-2144 {
  --era-color: #ec4899;
}

.era-2144 .era-section__bg {
  background: 
    linear-gradient(180deg, rgba(10,10,20,0) 0%, rgba(20, 10, 30, 0.6) 100%);
}

.neo-seoul-grid {
  position: absolute;
  inset: 0;
  background-image: 
    linear-gradient(rgba(14, 165, 233, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(14, 165, 233, 0.03) 1px, transparent 1px);
  background-size: 50px 50px;
  animation: grid-scroll 20s linear infinite;
}

@keyframes grid-scroll {
  0% { transform: perspective(500px) rotateX(60deg) translateY(0); }
  100% { transform: perspective(500px) rotateX(60deg) translateY(50px); }
}

.neo-seoul-hologram {
  position: absolute;
  top: 20%;
  right: 10%;
  width: 200px;
  height: 200px;
  background: radial-gradient(circle, rgba(236, 72, 153, 0.2) 0%, transparent 70%);
  border-radius: 50%;
  animation: hologram-pulse 4s ease-in-out infinite;
}

@keyframes hologram-pulse {
  0%, 100% { opacity: 0.3; transform: scale(1); }
  50% { opacity: 0.6; transform: scale(1.1); }
}

.era-header--neon .era-number {
  color: #ec4899;
  text-shadow: 0 0 30px rgba(236, 72, 153, 0.5);
}

.era-header--neon .era-title {
  color: #0ea5e9;
  text-shadow: 0 0 20px rgba(14, 165, 233, 0.3);
}

.era-text--neon .era-intro {
  color: rgba(14, 165, 233, 0.9);
}

.era-quote--neon {
  border-color: #ec4899;
  color: #ec4899;
}

.artifact__frame--hologram {
  background: rgba(10, 10, 30, 0.9);
  border: 1px solid rgba(14, 165, 233, 0.3);
  box-shadow: 
    0 0 20px rgba(14, 165, 233, 0.1),
    inset 0 0 30px rgba(14, 165, 233, 0.05);
}

.orison-display {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}

.orison-avatar {
  font-size: 2.5rem;
  color: #0ea5e9;
  animation: avatar-flicker 3s ease-in-out infinite;
}

@keyframes avatar-flicker {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
  52% { opacity: 1; }
  54% { opacity: 0.8; }
}

.artifact__comet--neon {
  color: #0ea5e9;
  text-shadow: 0 0 10px #0ea5e9;
}

.era-themes--neon {
  gap: 1rem;
}

.theme-tag--cyan {
  background: rgba(14, 165, 233, 0.1);
  border-color: rgba(14, 165, 233, 0.3);
  color: #0ea5e9;
}

.theme-tag--magenta {
  background: rgba(236, 72, 153, 0.1);
  border-color: rgba(236, 72, 153, 0.3);
  color: #ec4899;
}

.theme-tag--yellow {
  background: rgba(245, 158, 11, 0.1);
  border-color: rgba(245, 158, 11, 0.3);
  color: #f59e0b;
}

/* =====================================================
   ERA 2321 - POST-APO
   ===================================================== */
.era-2321 {
  --era-color: #4a7c59;
}

.era-2321 .era-section__bg {
  background: 
    linear-gradient(180deg, rgba(10,15,10,0) 0%, rgba(20, 30, 20, 0.4) 100%);
}

.post-apo-mist {
  position: absolute;
  inset: 0;
  background: 
    radial-gradient(ellipse at 50% 100%, rgba(74, 124, 89, 0.15) 0%, transparent 60%);
}

.era-header--tribal .era-number {
  color: #4a7c59;
}

.era-header--tribal .era-title {
  font-family: 'Georgia', serif;
}

.era-quote--tribal {
  border-color: #4a7c59;
  font-family: 'Georgia', serif;
}

.artifact__frame--tribal {
  background: rgba(20, 25, 20, 0.9);
  border-color: rgba(74, 124, 89, 0.3);
}

.artifact__comet--fire {
  color: #f59e0b;
  text-shadow: 0 0 10px rgba(245, 158, 11, 0.6);
}

.theme-tag--earth {
  background: rgba(74, 124, 89, 0.1);
  border-color: rgba(74, 124, 89, 0.3);
  color: #4a7c59;
}

/* =====================================================
   CONNECTIONS SECTION
   ===================================================== */
.connections-section {
  padding: 8rem 0;
  background: linear-gradient(180deg, rgba(10,10,15,1) 0%, rgba(15,15,25,1) 100%);
  text-align: center;
}

.connections-title {
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 400;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

.comet-icon-inline {
  font-size: 1.5em;
  color: #ec4899;
}

.connections-desc {
  max-width: 700px;
  margin: 0 auto 4rem;
  font-size: 1.1rem;
  line-height: 1.8;
  color: rgba(255,255,255,0.7);
}

.soul-chain {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 2rem;
}

.soul-node {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1.5rem;
  background: rgba(255,255,255,0.02);
  border: 1px solid rgba(255,255,255,0.05);
  border-radius: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

.soul-node:hover,
.soul-node.connected-glow {
  background: rgba(236, 72, 153, 0.05);
  border-color: rgba(236, 72, 153, 0.3);
  box-shadow: 0 0 30px rgba(236, 72, 153, 0.2);
}

.soul-node__avatar {
  font-size: 2.5rem;
}

.soul-node__name {
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: 1rem;
  color: rgba(255,255,255,0.9);
}

.soul-node__era {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.65rem;
  color: rgba(255,255,255,0.4);
}

.soul-node__comet {
  position: absolute;
  top: -8px;
  right: -8px;
  font-size: 1rem;
  opacity: 0;
  transition: all 0.3s ease;
}

.soul-node:hover .soul-node__comet,
.soul-node.connected-glow .soul-node__comet {
  opacity: 1;
  color: #ec4899;
  text-shadow: 0 0 10px #ec4899;
}

/* =====================================================
   FINAL SECTION
   ===================================================== */
.final-section {
  padding: 8rem 0;
  text-align: center;
  background: radial-gradient(ellipse at center, rgba(20, 15, 30, 1) 0%, rgba(10, 10, 15, 1) 100%);
}

.final-quote {
  max-width: 600px;
  margin: 0 auto 4rem;
}

.final-quote p {
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: clamp(1.5rem, 4vw, 2.5rem);
  font-style: italic;
  line-height: 1.6;
  color: rgba(255,255,255,0.6);
}

.final-quote__response {
  color: rgba(255,255,255,0.9) !important;
  margin-top: 1rem;
}

.final-comet {
  display: flex;
  justify-content: center;
}

.comet-large {
  width: 120px;
  height: 120px;
  animation: comet-spin 20s linear infinite;
}

@keyframes comet-spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* =====================================================
   RESPONSIVE
   ===================================================== */
@media (max-width: 1024px) {
  .era-content--split {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  
  .era-content--reverse {
    direction: ltr;
  }
  
  .artifact {
    max-width: 100%;
  }
}

@media (max-width: 768px) {
  .era-header {
    flex-direction: column;
    gap: 1rem;
  }
  
  .era-number {
    font-size: 4rem;
  }
  
  .timeline-point__name {
    display: none;
  }
  
  .era-point {
    display: none;
  }
  
  .soul-chain {
    gap: 1rem;
  }
  
  .soul-node {
    padding: 1rem;
  }
}

/* =====================================================
   ANIMATIONS - Connected glow effect
   ===================================================== */
.connected-glow {
  animation: connected-pulse 1s ease-in-out infinite;
}

@keyframes connected-pulse {
  0%, 100% { box-shadow: 0 0 20px rgba(236, 72, 153, 0.2); }
  50% { box-shadow: 0 0 40px rgba(236, 72, 153, 0.4); }
}
</style>
