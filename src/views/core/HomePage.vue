<template>
  <div class="home-page">
    <!-- Skip Link (Opquast) -->
    <a href="#main-content" class="skip-link">Aller au contenu principal</a>
    
    <!-- HERO : Control Room Entry -->
    <SpotlightContainer :size="600" color="var(--primary)" :opacity="0.15">
      <section class="hero" id="main-content" aria-labelledby="hero-title">
        <!-- MND PREMIUM : ambiance anime cinématique (hero-bg-v2) — purement
             décorative, le texte reste lisible grâce au voile sombre côté gauche -->
        <div class="hero__ambient" aria-hidden="true"></div>

        <!-- Floating Tech Badges -->
        <div class="hero__floating-badges" aria-hidden="true">
          <span class="floating-badge" style="--delay: 0s; --x: 85%; --y: 15%;">Vue 3</span>
          <span class="floating-badge" style="--delay: 0.5s; --x: 90%; --y: 35%;">Symfony</span>
          <span class="floating-badge" style="--delay: 1s; --x: 80%; --y: 55%;">Three.js</span>
          <span class="floating-badge" style="--delay: 1.5s; --x: 88%; --y: 75%;">IA Locale</span>
        </div>
        
        <div class="container">
          <div class="hero__grid">
            <ScrollReveal animation="fade-up" :delay="0">
              <div class="hero__content">
                <!-- Status Badge -->
                <div class="status-badge">
                  <span class="status-badge__dot"></span>
                  <TextScramble text="Disponible pour vos projets" :scramble-on-mount="true" />
                </div>
                
                <!-- Main Title -->
                <h1 id="hero-title" class="hero__title">
                  Vos outils métier,<br>
                  <span class="text-gradient neon-text">vos données</span>,<br>
                  <span class="hero__title-sub">chez vous 🇫🇷</span>
                </h1>
                
                <!-- Subtitle with Typewriter -->
                <p class="hero__subtitle">
                  <strong>PME des Hauts-de-France</strong> : je bâtis vos outils web sur-mesure
                  et votre IA <strong>dans votre environnement</strong> — jamais dans un cloud
                  étranger. La machine travaille, <strong>l'humain décide</strong>.
                </p>
                
                <!-- CTA Buttons -->
                <div class="hero__actions">
                  <MagneticButton tag="router-link" to="/contact" class="btn-primary btn-large btn-glow" :strength="40" :text-strength="50">
                    💬 Demander un échange de cadrage (30 min)
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                    </svg>
                  </MagneticButton>
                  <MagneticButton tag="router-link" to="/services" class="btn-outline" :strength="25" :text-strength="35">
                    ⚡ Voir les services
                  </MagneticButton>
                </div>
                
                <!-- Quick Navigation -->
                <div class="hero__quick-nav">
                  <router-link to="/carte-holistique" class="quick-link quick-link--featured">
                    <span>🗺️</span> Carte Holistique
                  </router-link>
                  <router-link to="/arkadia" class="quick-link">
                    <span>🦖</span> Case Study
                  </router-link>
                  <router-link to="/services" class="quick-link">
                    <span>⚡</span> Services
                  </router-link>
                  <router-link to="/agents" class="quick-link">
                    <span>🤖</span> Équipage IA
                  </router-link>
                </div>
              </div>
            </ScrollReveal>
            
            <!-- Code Window Décoratif -->
            <ScrollReveal animation="fade-left" :delay="300">
              <div class="hero__code-window glass" aria-hidden="true">
                <div class="code-window__header">
                  <span class="code-dot code-dot--red"></span>
                  <span class="code-dot code-dot--yellow"></span>
                  <span class="code-dot code-dot--green"></span>
                  <span class="code-window__title">votre-projet.ts</span>
                </div>
                <div class="code-window__body">
                  <pre><code><span class="code-keyword">const</span> <span class="code-var">votreProjet</span> = {
  <span class="code-prop">objectif</span>: <span class="code-string">"Gagner du temps"</span>,
  <span class="code-prop">budget</span>: <span class="code-string">"Sur-mesure"</span>,
  <span class="code-prop">délai</span>: <span class="code-string">"Rapide"</span>,
  <span class="code-prop">données</span>: <span class="code-string">"🇫🇷 Restent en France"</span>
};

<span class="code-keyword">await</span> <span class="code-func">glDigitalLab</span>.<span class="code-method">build</span>(votreProjet);
<span class="code-comment">// ✨ Votre site est en ligne !</span></code></pre>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
        
        <!-- Scroll Indicator -->
        <div class="hero__scroll-indicator" aria-hidden="true">
          <span class="scroll-text">Scroll</span>
          <div class="scroll-line"></div>
        </div>
      </section>
    </SpotlightContainer>
    
    <!-- SOLUTIONS / SERVICES -->
    <section class="solutions" aria-labelledby="services-title">
      <div class="container">
        <ScrollReveal animation="fade-up">
          <div class="section-header">
            <span class="mono-tag" aria-hidden="true">/// 01 · L'OFFRE</span>
            <h2 id="services-title"><GlitchText text="Du diagnostic au sur-mesure" /></h2>
            <p class="section-header__desc">
              Pas de catalogue : chaque mission part de <strong>votre</strong> situation réelle.
              Commencez par un <strong>audit en 48 h</strong> — je vous montre, sur votre site,
              ce qui l'expose et ce qu'il faut corriger. Ensuite seulement, on construit.
              <br><span class="section-header__caveat">Budget final après atelier de cadrage : le prix dépend des
              interfaces, des règles métier, des reprises de données et du niveau d'exigence sécurité.</span>
            </p>
          </div>
        </ScrollReveal>
        
        <div class="solutions-grid" role="list">
          <ScrollReveal v-for="(solution, i) in solutions" :key="solution.title" animation="fade-up" :delay="i * 150">
            <TiltCard :max-tilt="8" :scale="1.02" :glare="true" :max-glare="0.2">
              <article class="solution-card glass" :class="{ 'solution-card--featured': solution.featured }" role="listitem">
                <router-link :to="'/services#' + solution.title.toLowerCase().replace(/ /g, '-')" class="solution-card__link-wrapper" :aria-label="solution.title + ' - ' + solution.price">
                  <span v-if="solution.badge" class="solution-card__badge" aria-label="Service populaire">{{ solution.badge }}</span>
                  <div class="solution-card__icon" aria-hidden="true">{{ solution.icon }}</div>
                  <div class="solution-card__content">
                    <h3>{{ solution.title }}</h3>
                    <span class="solution-card__price">{{ solution.price }}</span>
                    <p>{{ solution.description }}</p>
                    <ul class="solution-card__outputs" aria-label="Ce qui est inclus">
                      <li v-for="output in solution.outputs" :key="output">{{ output }}</li>
                    </ul>
                  </div>
                  <span class="solution-card__cta" aria-hidden="true">Découvrir →</span>
                </router-link>
              </article>
            </TiltCard>
          </ScrollReveal>
        </div>
      </div>
    </section>


    <!-- PROOF : ARKADIA -->
    <section class="proof" aria-labelledby="proof-title">
      <div class="container">
        <div class="proof__grid">
          <ScrollReveal animation="fade-right">
            <div class="proof__content">
              <div class="proof__header">
                <span class="proof__badge proof__badge--closed">
                  🎮 PROJET CLÔTURÉ · 18 MOIS D'EXPLOITATION
                </span>
              </div>

              <h2 id="proof-title" class="proof__title">
                ARKADIA<br>
                <span class="text-gradient">150 joueurs, 18 mois d'exploitation</span>
              </h2>

              <p class="proof__desc">
                Pendant 18 mois, j'ai exploité un <strong>cluster de 9 serveurs de jeux</strong>
                avec de vrais utilisateurs qui comptaient sur une disponibilité <strong>24/7</strong>.
              </p>

              <p class="proof__desc">
                Ça a été mon terrain d'entraînement : monitoring temps réel, sauvegardes automatiques,
                gestion de crises, communication avec la communauté. Le service a été arrêté,
                les chiffres ci-dessous sont ceux constatés sur toute la période.
              </p>
              
              <div class="proof__metrics">
                <div class="proof-metric">
                  <span class="proof-metric__value"><AnimatedCounter :value="9" /><span class="proof-metric__unit"></span></span>
                  <span class="proof-metric__label">Serveurs de jeux synchronisés</span>
                </div>
                <div class="proof-metric">
                  <span class="proof-metric__value">&lt;10<span class="proof-metric__unit"> min</span></span>
                  <span class="proof-metric__label">Rollback (restauration T-1h)</span>
                </div>
              </div>
              
              <MagneticButton tag="router-link" to="/arkadia" class="btn-outline">
                VOIR L'ÉTUDE COMPLÈTE
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                </svg>
              </MagneticButton>
            </div>
          </ScrollReveal>
          
          <!-- Gauges Panel -->
          <ScrollReveal animation="zoom">
            <TiltCard :max-tilt="10" :glare="true">
              <div class="proof__gauges glass">
                <GaugeCircle 
                  :value="150" 
                  :max="200" 
                  :size="130" 
                  label="JOUEURS"
                  suffix="+"
                />
                <GaugeCircle 
                  :value="9" 
                  :max="10" 
                  :size="130" 
                  label="SERVEURS"
                  suffix=""
                />
              </div>
            </TiltCard>
          </ScrollReveal>
        </div>
      </div>
    </section>

    <!-- STACK -->
    <section class="stack">
      <div class="container">
        <!-- flip 3D + tilt-card + backdrop-filter(glass) = artefacts de
             rendu/clignotement Firefox : reveal en fade-up, carte statique -->
        <ScrollReveal animation="fade-up">
          <div class="stack-card glass">
            <div class="stack-card__header">
              <span class="mono-tag">/// 02 STACK TECHNIQUE</span>
              <h3><TextScramble text="Architecture Souveraine" :scramble-on-hover="true" /></h3>
            </div>
            <div class="stack-card__grid">
              <div v-for="stack in stackItems" :key="stack.category" class="stack-item">
                <span class="stack-item__category">{{ stack.category }}</span>
                <div class="stack-item__techs">
                  <span 
                    v-for="tech in stack.techs" 
                    :key="tech.name"
                    :class="{ 'stack-item__tech--highlight': tech.highlight }"
                  >{{ tech.name }}</span>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
    
    <!-- MND POSITIONNEMENT : l'humain reste le centre du cercle -->
    <section class="mnd-position" aria-labelledby="mnd-title">
      <div class="container">
        <ScrollReveal animation="fade-up">
          <div class="section-header">
            <span class="mono-tag" aria-hidden="true">/// 03 · LE POSITIONNEMENT</span>
            <h2 id="mnd-title"><GlitchText text="La machine sert. L'humain décide." /></h2>
            <p class="section-header__desc">
              GL Digital Lab est un cercle : six esprits IA — les Lois — gravitent autour de votre
              projet. Chacun veille sur un domaine critique ; aucun ne décide à votre place.
            </p>
          </div>
        </ScrollReveal>

        <div class="mnd-position__grid">
          <ScrollReveal animation="fade-up">
            <div class="mnd-position__content">
              <h3 class="mnd-position__title">L'humain au centre du cercle</h3>
              <p class="mnd-position__text">
                Les agents du studio s'alignent autour de vous : <strong>Wa</strong> orchestre,
                <strong>Makoto</strong> vérifie, <strong>Bi</strong> façonne, <strong>Jitsu</strong>
                réalise, <strong>Dou</strong> surveille, <strong>Watashi</strong> mémorise.
              </p>
              <ul class="mnd-position__list" aria-label="Positionnement du studio">
                <li>Audit, création, surveillance : le cercle tourne, vous gardez la main.</li>
                <li>Zéro dépendance cloud américain : l'IA tourne sur vos serveurs, pas ailleurs.</li>
                <li>Chaque livraison est vérifiée par la machine et validée par l'humain.</li>
              </ul>
              <MagneticButton tag="router-link" to="/agents" class="btn-outline">
                RENCONTRER L'ÉQUIPAGE
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                  <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                </svg>
              </MagneticButton>
            </div>
          </ScrollReveal>

          <ScrollReveal animation="zoom">
            <div
              class="mnd-theone"
              role="img"
              aria-label="Illustration : une figure humaine souveraine au centre d'anneaux concentriques de lumière, entourée de constellations numériques"
            ></div>
          </ScrollReveal>
        </div>

        <!-- L'équipage des six Lois -->
        <ScrollReveal animation="fade-up">
          <div class="mnd-crew">
            <p class="mnd-crew__label" aria-hidden="true">/// L'équipage des six Lois</p>
            <ul class="mnd-crew__list">
              <li v-for="law in crewLaws" :key="law.id" class="mnd-crew__item">
                <router-link
                  :to="'/agents/' + law.id"
                  class="mnd-crew__link"
                  :style="{ '--law-color': law.color }"
                  :aria-label="law.fullName + ' — voir le profil'"
                >
                  <span class="mnd-crew__avatar">
                    <img
                      v-if="!avatarErrors[law.id]"
                      class="mnd-crew__img"
                      :src="lawAvatarUrl(law)"
                      alt=""
                      loading="lazy"
                      @error="handleAvatarError(law.id)"
                    />
                    <span v-else class="mnd-crew__emoji" aria-hidden="true">{{ law.avatar }}</span>
                  </span>
                  <span class="mnd-crew__name">{{ law.name }}</span>
                  <span class="mnd-crew__meaning">{{ law.meaning }}</span>
                </router-link>
              </li>
            </ul>
          </div>
        </ScrollReveal>
      </div>
    </section>
    
    <!-- CTA FINAL -->
    <section class="cta-final" aria-labelledby="cta-title">
      <div class="container">
        <ScrollReveal animation="zoom">
          <SpotlightContainer :size="400" color="var(--primary)" :opacity="0.15">
            <div class="cta-final__box glass">
              <h2 id="cta-title"><GlitchText text="Un projet en tête ?" /></h2>
              <p>Racontez-moi votre idée. Je vous réponds sous 24h avec une première estimation gratuite et sans engagement.</p>
              <MagneticButton tag="router-link" to="/contact" class="btn-primary btn-large" :strength="35" :text-strength="45">
                💬 Parlons-en !
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                  <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                </svg>
              </MagneticButton>
              <ul class="cta-final__trust" aria-label="Garanties">
                <li>✓ Réponse sous 24h</li>
                <li>✓ Premier échange gratuit</li>
                <li>✓ Sans engagement</li>
              </ul>
            </div>
          </SpotlightContainer>
        </ScrollReveal>
      </div>
    </section>
    
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

// Données équipage + visuels MND (assets copiés dans public/images/mnd/)
import { agents } from '@/data/agents';
import { lawAvatarUrl } from '@/data/mndAssets';

// Components
import AnimatedCounter from '@/components/common/AnimatedCounter.vue';
import GaugeCircle from '@/components/common/GaugeCircle.vue';

// UI Components
import { 
  TiltCard, 
  MagneticButton, 
  GlitchText, 
  TypeWriter, 
  TextScramble,
  ScrollReveal, 
  SpotlightContainer 
} from '@/components/ui';

// Data

const solutions = [
  {
    icon: '🔍',
    title: 'Audit WordPress — 48 h',
    price: '149 € – 199 € HT',
    description: 'Je relève sur VOTRE site les failles réelles : version obsolète, plugin vulnérable, absence de mises à jour. Chiffres à l\'appui, avant qu\'un pirate ou Google ne s\'en charge.',
    outputs: [
      'Analyse 100 % locale — aucune donnée ne quitte votre machine',
      'Rapport clair, sans jargon, avec les risques en une phrase',
      'Plan chiffré des corrections, devis en option',
      'Résultat sous 48 h'
    ],
    badge: 'L\'ENTRÉE DU CERCLE'
  },
  {
    icon: '🌐',
    title: 'Site web',
    price: 'Dès 2 500 € HT',
    description: 'Vitrine ou refonte : un site qui charge vite, se met à jour sans technicien et fait venir des demandes.',
    outputs: [
      'Jusqu\'à 8 pages · atelier de cadrage inclus',
      'Responsive, SEO technique, RGPD',
      'Formation à l\'administration',
      'Livraison en 4 à 6 semaines'
    ]
  },
  {
    icon: '⚙️',
    title: 'Application métier',
    price: 'Dès 8 000 € HT',
    description: 'Un outil interne taillé sur vos processus, pour supprimer les ressaisies et les fichiers Excel qui circulent.',
    outputs: [
      'Atelier de cadrage préalable obligatoire',
      'Jusqu\'à 10 utilisateurs dans le lot initial',
      'Reprise de vos données existantes',
      'Formation des équipes et maintenance'
    ],
    featured: true,
    badge: 'LE PLUS DEMANDÉ'
  },
  {
    icon: '🤖',
    title: 'IA & automatisation locale',
    price: 'Audit IA + prototype dès 1 500 € HT',
    description: 'De l\'IA qui tourne sur vos serveurs. Vos documents et vos données ne sortent pas de votre réseau.',
    outputs: [
      'Audit IA + prototype sur un cas d\'usage réel',
      'Hébergement dans votre environnement',
      'Aucune donnée envoyée hors de France',
      'Chiffrage du déploiement à l\'issue de l\'audit'
    ]
  },
  {
    icon: '📚',
    title: 'RAG MÉMOIRE',
    price: 'Dès 3 000 € HT · 3 niveaux',
    description: 'Un assistant interne qui répond aux questions de votre entreprise à partir de VOS documents — réponses sourcées, zéro hallucination.',
    outputs: [
      'Indexation de vos documents (PDF, Word, mails)',
      'Chaque réponse cite son document d\'origine',
      'Hébergement France, données jamais utilisées pour entraîner',
      'RGPD : suppression sur demande · Découverte 3k · Standard 8k · Sur-mesure 15k'
    ]
  }
];

const stackItems = [
  { category: 'BACKEND', techs: [{ name: 'Symfony 8' }, { name: 'PHP 8.3+' }, { name: 'PostgreSQL' }] },
  { category: 'FRONTEND', techs: [{ name: 'Vue 3' }, { name: 'Three.js' }, { name: 'GSAP' }] },
  { category: 'IA LOCALE', techs: [{ name: 'Ollama', highlight: true }, { name: 'Qwen 3' }, { name: 'RAG Open WebUI' }] },
  { category: 'INFRA', techs: [{ name: 'Docker' }, { name: 'Hébergement FR', highlight: true }, { name: 'Linux' }] }
];


// Les six Lois (hors lobby), triées du Penthouse vers les étages bas
const crewLaws = computed(() =>
  agents.filter(a => !a.isLobby).sort((a, b) => b.floor - a.floor)
);

// Fallback visuel : tant que les PNG MND ne sont pas copiés dans
// public/images/mnd/agents/, on bascule sur l'emoji d'origine de la Loi.
const avatarErrors = ref({});
const handleAvatarError = (id) => {
  avatarErrors.value[id] = true;
};

// Health check terminal lines
</script>

<style scoped>
.home-page {
  min-height: 100vh;
  position: relative;
  z-index: 1;
}

/* ═══════════════════════════════════════════════════════════════════════════
   OPQUAST / A11Y
   ═══════════════════════════════════════════════════════════════════════════ */

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
  outline: 2px solid #fff;
  outline-offset: 2px;
}

/* Focus Visible (Opquast) */
:focus-visible {
  outline: 2px solid var(--primary);
  outline-offset: 3px;
}

/* Reduced Motion (Opquast) */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}

/* HERO */
.hero {
  min-height: 100vh;
  display: flex;
  align-items: center;
  padding-top: 80px;
  position: relative;
  overflow: hidden;
}

.hero__grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
  /* au-dessus de l'ambient MND (z-index 0) */
  position: relative;
  z-index: 1;
  }

.hero__content {
  max-width: 600px;
}

/* Floating Tech Badges */


@keyframes floatBadge {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-15px) rotate(3deg); }
}

/* Code Window */

.hero__code-window:hover {
  transform: perspective(1000px) rotateY(0deg) rotateX(0deg);
}



.code-dot--yellow { background: #ffbd2e; }



.code-window__body pre {
  margin: 0;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.8rem;
  line-height: 1.6;
}

.code-keyword { color: #c792ea; }
.code-var { color: #82aaff; }
.code-prop { color: #f78c6c; }
.code-string { color: #c3e88d; }
.code-func { color: #82aaff; }
.code-method { color: #ffcb6b; }
.code-comment { color: #546e7a; font-style: italic; }

/* Button Glow */
.btn-glow {
  box-shadow: 
    0 0 20px rgba(16, 185, 129, 0.4),
    0 0 40px rgba(16, 185, 129, 0.2);
  animation: btnPulse 2s ease-in-out infinite;
}

@keyframes btnPulse {
  0%, 100% { box-shadow: 0 0 20px rgba(16, 185, 129, 0.4), 0 0 40px rgba(16, 185, 129, 0.2); }
  50% { box-shadow: 0 0 30px rgba(16, 185, 129, 0.6), 0 0 60px rgba(16, 185, 129, 0.3); }
}

/* Scroll Indicator */
.hero__scroll-indicator {
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.scroll-text {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.6rem;
  color: var(--text-muted);
  letter-spacing: 0.2em;
  text-transform: uppercase;
}

.scroll-line {
  width: 1px;
  height: 40px;
  background: linear-gradient(to bottom, var(--primary), transparent);
  animation: scrollLine 2s ease-in-out infinite;
}

@keyframes scrollLine {
  0% { transform: scaleY(0); transform-origin: top; }
  50% { transform: scaleY(1); transform-origin: top; }
  50.1% { transform: scaleY(1); transform-origin: bottom; }
  100% { transform: scaleY(0); transform-origin: bottom; }
}

/* ═══════════════════════════════════════════════════════════════════════════
   AWWWARDS POLISH - Typography & Spacing
   ═══════════════════════════════════════════════════════════════════════════ */

/* Hero Title - More dramatic sizing */
.hero__title {
  font-size: clamp(2.5rem, 6vw, 4rem);
  font-weight: 700;
  line-height: 1.1;
  letter-spacing: -0.02em;
  margin-bottom: 1.5rem;
}

/* Improved subtitle contrast */
.hero__subtitle {
  font-size: 1.15rem;
  line-height: 1.7;
  color: rgba(229, 229, 229, 0.85); /* Better contrast than text-muted */
  margin-bottom: 2rem;
  max-width: 550px;
}

.hero__subtitle strong {
  color: #fff;
  font-weight: 600;
}

/* Status badge polish */
.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 1rem;
  background: rgba(16, 185, 129, 0.08);
  border: 1px solid rgba(16, 185, 129, 0.2);
  border-radius: 2rem;
  margin-bottom: 1.5rem;
  font-size: 0.8rem;
  letter-spacing: 0.05em;
}

.status-badge__dot {
  width: 8px;
  height: 8px;
  background: var(--primary);
  border-radius: 50%;
  animation: pulse-dot 2s ease-in-out infinite;
  box-shadow: 0 0 10px var(--primary);
}

@keyframes pulse-dot {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.2); opacity: 0.7; }
}

/* Neon text glow effect */
.neon-text {
  text-shadow: 
    0 0 10px rgba(16, 185, 129, 0.5),
    0 0 20px rgba(16, 185, 129, 0.3),
    0 0 40px rgba(16, 185, 129, 0.1);
}

/* Hero actions spacing */




.floating-badge {
  position: absolute;
  left: var(--x);
  top: var(--y);
  padding: 0.4rem 0.8rem;
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.3);
  border-radius: 2rem;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.65rem;
  color: var(--primary);
  animation: floatBadge 6s ease-in-out infinite;
  animation-delay: var(--delay);
  opacity: 0.7;
}

.quick-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 2rem;
  font-size: 0.75rem;
  color: var(--text-muted);
  text-decoration: none;
  transition: all 0.3s ease;
}

.code-window__header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: rgba(0, 0, 0, 0.5);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.code-window__body {
  padding: 1.25rem;
  background: rgba(0, 0, 0, 0.3);
}

.code-window__title {
  margin-left: auto;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.7rem;
  color: var(--text-muted);
}

.code-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.hero__floating-badges {
  position: absolute;
  top: 0;
  right: 0;
  width: 50%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
}

.hero__quick-nav {
  display: flex;
  justify-content: flex-start;
  gap: 1rem;
  margin-top: 2rem;
  flex-wrap: wrap;
}

.hero__code-window {
  border-radius: 12px;
  border: 1px solid rgba(16, 185, 129, 0.2);
  overflow: hidden;
  transform: perspective(1000px) rotateY(-5deg) rotateX(2deg);
  transition: transform 0.5s ease;
  box-shadow: 
    0 25px 50px -12px rgba(0, 0, 0, 0.5),
    0 0 40px rgba(16, 185, 129, 0.1);
}

.hero__actions {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

/* Button hover state enhancement */
.btn-primary {
  position: relative;
  overflow: hidden;
}

.btn-primary::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
  transform: translateX(-100%);
  transition: transform 0.6s ease;
}

.btn-primary:hover::before {
  transform: translateX(100%);
}

/* Section headers polish */
.section-header {
  margin-bottom: 3rem;
}

.section-header h2 {
  font-size: clamp(1.75rem, 4vw, 2.5rem);
  font-weight: 700;
  letter-spacing: -0.01em;
  margin-top: 0.5rem;
}

.section-header__desc {
  font-size: 1rem;
  color: rgba(229, 229, 229, 0.75);
  margin-top: 0.75rem;
  max-width: 500px;
  line-height: 1.6;
}

/* Mono tag styling */
.mono-tag {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.7rem;
  color: var(--primary);
  letter-spacing: 0.1em;
  opacity: 0.9;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: var(--primary-soft);
  border: 1px solid rgba(16, 185, 129, 0.2);
  border-radius: 2rem;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.55rem;
  color: var(--primary);
  letter-spacing: 0.15em;
  margin-bottom: var(--space-md);
}

.status-badge__dot {
  width: 6px;
  height: 6px;
  background: var(--primary);
  border-radius: 50%;
  animation: pulse-slow 2s infinite;
}

@keyframes pulse-slow {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(1.2); }
}

.hero__title {
  font-size: clamp(2.5rem, 7vw, 4.5rem);
  font-weight: 700;
  line-height: 1.1;
  margin-bottom: var(--space-md);
}

.hero__subtitle {
  font-size: 1.1rem;
  color: var(--text-muted);
  line-height: 1.8;
  margin-bottom: var(--space-lg);
  max-width: 550px;
}

.hero__highlight {
  display: block;
  color: var(--text-main);
  font-weight: 500;
  margin-top: 0.5rem;
}

.hero__actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-sm);
}

/* Buttons */
.btn-primary {
  padding: 1rem 2rem;
  background: var(--primary);
  border: 1px solid var(--primary);
  color: var(--bg);
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.btn-primary:hover {
  background: transparent;
  color: var(--primary);
}

.btn-outline {
  padding: 1rem 2rem;
  background: transparent;
  border: 1px solid var(--primary);
  color: var(--primary);
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.btn-outline:hover {
  background: var(--primary);
  color: var(--bg);
}

.btn-large {
  padding: 1.25rem 2.5rem;
  font-size: 0.8rem;
}

/* METRICS BAR */





/* SOLUTIONS */
.solutions {
  padding: var(--space-xl) 0;
}

.section-header {
  margin-bottom: var(--space-lg);
  max-width: 600px;
}

.section-header--center {
  text-align: center;
  margin-left: auto;
  margin-right: auto;
}

.mono-tag {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.7rem;
  color: var(--primary);
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.section-header h2 {
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0.5rem 0;
}

.section-header__desc {
  font-size: 0.95rem;
  color: var(--text-muted);
  line-height: 1.7;
}

.solutions-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-md);
}

.solution-card {
  display: flex;
  flex-direction: column;
  padding: var(--space-lg);
  text-decoration: none;
  border-radius: 1rem;
  border: 1px solid var(--border);
  position: relative;
  transition: border-color 0.3s ease;
  height: 100%;
}

.solution-card:hover {
  border-color: var(--primary);
}

.solution-card--featured {
  border-color: rgba(16, 185, 129, 0.3);
}

.solution-card__badge {
  position: absolute;
  top: -10px;
  right: var(--space-sm);
  padding: 0.25rem 0.75rem;
  background: var(--primary);
  color: var(--bg);
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.5rem;
  font-weight: 700;
  border-radius: 2rem;
  letter-spacing: 0.05em;
}

.solution-card__icon {
  font-size: 2rem;
  margin-bottom: var(--space-sm);
}

.solution-card__content {
  flex-grow: 1;
}

.solution-card h3 {
  font-size: 1.25rem;
  margin-bottom: 0.25rem;
  color: var(--text-main);
}

.solution-card__price {
  display: inline-block;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.6rem;
  color: var(--primary);
  padding: 0.25rem 0.5rem;
  background: var(--primary-soft);
  border: 1px solid rgba(16, 185, 129, 0.2);
  border-radius: 4px;
  margin-bottom: var(--space-sm);
}

.solution-card p {
  font-size: 0.85rem;
  color: var(--text-muted);
  line-height: 1.6;
  margin-bottom: var(--space-sm);
}

.solution-card__outputs {
  list-style: none;
  padding: 0;
  margin: 0 0 var(--space-sm) 0;
}

.solution-card__outputs li {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.65rem;
  color: var(--text-dark);
  padding: 0.25rem 0;
  padding-left: 1rem;
  position: relative;
}

.solution-card__outputs li::before {
  content: '→';
  position: absolute;
  left: 0;
  color: var(--primary);
}

.solution-card__cta {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.7rem;
  color: var(--primary);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.solution-card:hover .solution-card__cta {
  opacity: 1;
}

/* PROOF */


.section-header__caveat {
  display: inline-block;
  margin-top: 0.6rem;
  font-size: 0.82rem;
  opacity: 0.7;
}

.proof {
  padding: var(--space-xl) 0;
  background: rgba(10, 10, 10, 0.5);
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
}

.proof__grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-xl);
  align-items: center;
}

.proof__badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.6rem;
  color: var(--primary);
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.proof__badge-dot {
  width: 8px;
  height: 8px;
  background: var(--primary);
  border-radius: 50%;
  animation: pulse-slow 2s infinite;
}

/* Projet cloture : ni point pulsant ni couleur d'accent — le badge ne doit
   pas suggerer un service encore en ligne. */
.proof__badge--closed {
  color: var(--text-muted, #8a9099);
  border: 1px solid currentColor;
  border-radius: 3px;
  padding: 0.25rem 0.6rem;
}

.proof__title {
  font-size: 2.5rem;
  font-weight: 700;
  margin: var(--space-sm) 0 var(--space-md);
}

.proof__desc {
  font-size: 0.95rem;
  color: var(--text-muted);
  line-height: 1.8;
  margin-bottom: var(--space-sm);
}

.proof__desc strong {
  color: var(--text-main);
}

.proof__metrics {
  display: flex;
  gap: var(--space-md);
  margin: var(--space-md) 0;
}

.proof-metric {
  padding: var(--space-sm) var(--space-md);
  background: rgba(0, 0, 0, 0.4);
  border-left: 2px solid var(--primary);
}

.proof-metric__value {
  display: block;
  font-family: 'JetBrains Mono', monospace;
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-main);
}

.proof-metric__unit {
  font-size: 1rem;
  color: var(--primary);
}

.proof-metric__label {
  display: block;
  font-size: 0.6rem;
  color: var(--text-dark);
  text-transform: uppercase;
  margin-top: 0.25rem;
}

.proof__gauges {
  display: flex;
  justify-content: center;
  gap: var(--space-lg);
  padding: var(--space-lg);
  border-radius: 1rem;
  border: 1px solid var(--border);
}

/* SYSTEM CHECK */

.system-check .system-terminal {
  max-width: 700px;
  margin: 0 auto;
}

/* STACK */
.stack {
  padding: var(--space-xl) 0;
  overflow: hidden; /* Contenir les effets de lumière */
}

.stack-card {
  max-width: 800px;
  margin: 0 auto;
  padding: var(--space-lg);
  border-radius: 1rem;
  border: 1px solid var(--border);
  position: relative;
  overflow: hidden; /* Empêcher le débordement du glare */
  isolation: isolate; /* Créer un nouveau contexte d'empilement */
}

.stack-card__header {
  text-align: center;
  margin-bottom: var(--space-md);
}

.stack-card__header h3 {
  font-size: 1.25rem;
  margin-top: 0.5rem;
}

.stack-card__grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-md);
  margin-bottom: var(--space-md);
}

.stack-item {
  text-align: center;
}

.stack-item__category {
  display: block;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.55rem;
  color: var(--text-dark);
  letter-spacing: 0.1em;
  margin-bottom: 0.5rem;
}

.stack-item__techs {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.stack-item__techs span {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.7rem;
  color: var(--text-muted);
}

.stack-item__tech--highlight {
  color: var(--primary) !important;
}

.stack-card__link {
  display: block;
  text-align: center;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.75rem;
  color: var(--primary);
  text-decoration: none;
  transition: color 0.3s ease;
}

.stack-card__link:hover {
  color: var(--text-main);
}

/* MULTIVERS TEASER */



.universe-card:hover {
  border-color: var(--accent);
  box-shadow: 0 0 30px color-mix(in srgb, var(--accent) 30%, transparent);
}




/* HERO QUICK NAV */


.quick-link:hover {
  border-color: var(--primary);
  color: var(--primary);
  background: rgba(16, 185, 129, 0.1);
}


.quick-link--featured:hover {
  border-color: #FBBF24;
  background: rgba(251, 191, 36, 0.2);
}

/* CTA FINAL */
.cta-final {
  padding: var(--space-xl) 0;
}

.cta-final__box {
  max-width: 700px;
  margin: 0 auto;
  padding: var(--space-xl);
  border-radius: 1.5rem;
  border: 1px solid rgba(16, 185, 129, 0.2);
  text-align: center;
}

.cta-final__box h2 {
  font-size: 2rem;
  margin-bottom: var(--space-sm);
}

.cta-final__box p {
  font-size: 0.95rem;
  color: var(--text-muted);
  margin-bottom: var(--space-md);
  line-height: 1.7;
}

.cta-final__trust {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-top: 1.5rem;
  font-size: 0.85rem;
  color: var(--text-muted);
  list-style: none;
  padding: 0;
}

.cta-final__trust li {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

/* Solution Card Link Wrapper */
.solution-card__link-wrapper {
  display: flex;
  flex-direction: column;
  height: 100%;
  text-decoration: none;
  color: inherit;
}

.solution-card__link-wrapper:focus-visible {
  outline: none;
}

.solution-card:has(.solution-card__link-wrapper:focus-visible) {
  outline: 2px solid var(--primary);
  outline-offset: 4px;
}

/* Hero Title Sub */
.hero__title-sub {
  color: var(--text-muted);
  font-size: 0.85em;
  font-weight: 400;
}

/* ═══════════════════════════════════════════════════════════════════════════
   AWWWARDS MICRO-INTERACTIONS
   ═══════════════════════════════════════════════════════════════════════════ */

/* Smooth section transitions */
section {
  position: relative;
}

/* Link underline animation */
a:not(.btn-primary):not(.btn-outline):not(.solution-card__link-wrapper):not(.universe-card):not(.quick-link):not(.skip-link) {
  position: relative;
}

/* Card lift on hover */
.solution-card,
.universe-card,
.stack-card {
  transition: transform 0.4s cubic-bezier(0.23, 1, 0.32, 1), 
              border-color 0.3s ease,
              box-shadow 0.4s ease;
}

.solution-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

/* Icon bounce on card hover */
.solution-card__icon {
  transition: transform 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.solution-card:hover .solution-card__icon {
  transform: scale(1.15) rotate(-5deg);
}

/* Price tag glow on hover */
.solution-card:hover .solution-card__price {
  box-shadow: 0 0 15px rgba(16, 185, 129, 0.4);
}

/* Universe card float */
.universe-card:hover {
  transform: translateY(-8px);
}

/* Quick link arrow animation */

.quick-link::after {
  content: '→';
  position: absolute;
  right: -20px;
  opacity: 0;
  transition: all 0.3s ease;
}

.quick-link:hover::after {
  right: 1rem;
  opacity: 1;
}

.quick-link:hover {
  padding-right: 2.5rem;
}

/* Metric value counter glow */

.metric-mini:hover .metric-mini__value {
  text-shadow: 0 0 20px rgba(16, 185, 129, 0.5);
}

/* Proof metric border animation */
.proof-metric {
  transition: border-color 0.3s ease, background 0.3s ease;
}

.proof-metric:hover {
  border-color: var(--primary);
  background: rgba(16, 185, 129, 0.05);
}

/* Stack tech highlight pulse */
.stack-item__tech--highlight {
  animation: techPulse 3s ease-in-out infinite;
}

@keyframes techPulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; text-shadow: 0 0 10px var(--primary); }
}

/* Selection style */
::selection {
  background: rgba(16, 185, 129, 0.3);
  color: #fff;
}

/* Smooth scroll */
html {
  scroll-behavior: smooth;
}

@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto;
  }
}

/* UTILITIES */
.text-gradient {
  background: linear-gradient(135deg, var(--primary), var(--secondary, #60a5fa));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.glass {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(10px);
}

/* ═══════════════════════════════════════════════════════════════════════════
   MND PREMIUM — ambiance hero + section « l'humain au centre du cercle »
   Visuels MND copiés dans public/images/mnd/ (voir mndAssets.js)
   ═══════════════════════════════════════════════════════════════════════════ */

/* Hero : ambiance anime cinématique sombre. Voile dégradé pour garder le
   texte parfaitement lisible, l'image reste décorative (z-index négatif).
   Fond = shinigami-hero (VALIDÉ par Gaëtan 2026-10 — guerriers du web). */
.hero__ambient {
  position: absolute;
  /* commence SOUS la navbar fixe (80px) pour ne pas être coupée par elle */
  top: 80px;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 0;
  pointer-events: none;
  background-image:
    linear-gradient(100deg, rgba(5, 5, 5, 0.97) 0%, rgba(5, 5, 5, 0.92) 34%, rgba(5, 5, 5, 0.55) 64%, rgba(5, 5, 5, 0.85) 100%),
    url('/images/mnd/shinigami-hero.png');
  background-size: cover;
  background-position: center;
}

/* Positionnement */
.mnd-position {
  padding: var(--space-xl) 0;
}

.mnd-position__grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-xl);
  align-items: center;
}

.mnd-position__title {
  font-size: clamp(1.5rem, 3vw, 2.2rem);
  font-weight: 700;
  color: var(--text-main);
  line-height: 1.2;
  margin-bottom: var(--space-sm);
}

.mnd-position__text {
  font-size: 0.95rem;
  color: var(--text-muted);
  line-height: 1.8;
  margin-bottom: var(--space-md);
}

.mnd-position__text strong {
  color: var(--primary);
}

.mnd-position__list {
  list-style: none;
  padding: 0;
  margin: 0 0 var(--space-md);
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
}

.mnd-position__list li {
  position: relative;
  padding-left: 1.5rem;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.72rem;
  color: var(--text-muted);
  line-height: 1.6;
}

.mnd-position__list li::before {
  content: '◈';
  position: absolute;
  left: 0;
  color: var(--primary);
}

/* Visuel « the-one » : l'humain au centre (carré, cadre premium) */
.mnd-theone {
  aspect-ratio: 1 / 1;
  width: 100%;
  max-width: 480px;
  margin-left: auto;
  border-radius: 1.25rem;
  border: 1px solid rgba(16, 185, 129, 0.18);
  background-color: rgba(16, 185, 129, 0.03);
  background-image:
    radial-gradient(circle at 50% 42%, rgba(16, 185, 129, 0.1), transparent 65%),
    url('/images/mnd/the-one-v2.png');
  background-size: auto, contain;
  background-position: center;
  background-repeat: no-repeat;
  box-shadow:
    0 0 70px rgba(16, 185, 129, 0.07),
    inset 0 0 90px rgba(0, 0, 0, 0.35);
}

/* Équipage : bandeau des six Lois */
.mnd-crew {
  margin-top: var(--space-xl);
  padding-top: var(--space-lg);
  border-top: 1px solid var(--border);
}

.mnd-crew__label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.7rem;
  color: var(--primary);
  letter-spacing: 0.2em;
  text-transform: uppercase;
  text-align: center;
  margin-bottom: var(--space-lg);
}

.mnd-crew__list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: var(--space-md);
}

.mnd-crew__link {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.6rem;
  padding: 0.5rem;
  text-decoration: none;
  transition: transform var(--transition-base);
}

.mnd-crew__link:hover {
  transform: translateY(-4px);
}

.mnd-crew__avatar {
  width: 84px;
  height: 84px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid color-mix(in srgb, var(--law-color) 55%, transparent);
  box-shadow: 0 0 0 4px rgba(5, 5, 5, 0.9), 0 0 22px color-mix(in srgb, var(--law-color) 18%, transparent);
  transition: box-shadow var(--transition-base);
}

.mnd-crew__link:hover .mnd-crew__avatar {
  box-shadow: 0 0 0 4px rgba(5, 5, 5, 0.9), 0 0 30px color-mix(in srgb, var(--law-color) 40%, transparent);
}

.mnd-crew__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.mnd-crew__emoji {
  font-size: 1.9rem;
}

.mnd-crew__name {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--text-main);
  white-space: nowrap;
}

.mnd-crew__meaning {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.6rem;
  color: var(--text-dark);
  text-transform: uppercase;
  letter-spacing: 0.15em;
}

/* RESPONSIVE */
@media (max-width: 1024px) {
  .hero__grid {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  
  .hero__code-window {
    transform: none;
    max-width: 500px;
    margin: 0 auto;
  }
  
  .hero__floating-badges {
    display: none;
  }
  
  .proof__grid {
    grid-template-columns: 1fr;
    gap: var(--space-lg);
  }
  
  .solutions-grid {
    grid-template-columns: 1fr;
  }
  
  .stack-card__grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  
  .proof__metrics {
    flex-direction: column;
  }
  
  .proof__gauges {
    flex-direction: column;
    align-items: center;
  }
  
  .hero__actions {
    flex-direction: column;
  }
  
  .multivers-preview {
    gap: var(--space-sm);
  }
  
  .universe-card {
    padding: 1rem 1.5rem;
  }
  
  .cta-final__trust {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .hero__quick-nav {
    justify-content: center;
  }
}

/* MND RESPONSIVE */
@media (max-width: 1024px) {
  .mnd-position__grid {
    grid-template-columns: 1fr;
    gap: var(--space-lg);
  }

  .mnd-theone {
    margin: 0 auto;
    max-width: 420px;
  }
}

@media (max-width: 640px) {
  .mnd-crew__avatar {
    width: 72px;
    height: 72px;
  }

  .mnd-crew__meaning {
    font-size: 0.55rem;
  }
}

/* Anciens navigateurs sans aspect-ratio : hauteur de repli pour le cadre */
@supports not (aspect-ratio: 1 / 1) {
  .mnd-theone {
    height: 440px;
  }
}
</style>
