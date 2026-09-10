<template>
  <div class="home-page">
    <!-- Skip Link (Opquast) -->
    <a href="#main-content" class="skip-link">Aller au contenu principal</a>
    
    <!-- HERO : Control Room Entry -->
    <SpotlightContainer :size="600" color="var(--primary)" :opacity="0.15">
      <section class="hero" id="main-content" aria-labelledby="hero-title">
        <!-- DS clair (D1) : fond papier nu — l'ambiance anime sombre MND
             (hero-bg) est retirée, elle cassait le fond clair et pesait
             plusieurs centaines de Ko. L'orbite reste la seule signature. -->

        <!-- DÉCOR DU HERO RETIRÉ (10/09/2026, décision Gaëtan : « enlève le
             WebGL qui ressemble à rien »). Partis d'ici : les anneaux orbitaux,
             la Grille TRON, les six unités 3D et la couche console avec ses
             scanlines. Le hero ne contient plus que ce qui informe : l'offre,
             le titre, la promesse, le bouton, et les deux chemins visiteur.
             Les composants restent sur disque, non montés. -->

        <!-- Floating Tech Badges retirés (D5, décision du directeur artistique) :
             Vue 3 / Symfony / Three.js / IA Locale sont des choix d'outillage
             INTERNES. Un client ne choisit pas un studio parce qu'il utilise Vue
             plutôt que React, et ces badges flottants coûtaient une animation CSS
             permanente pour aucune information utile au visiteur. -->

        <div class="container">
          <div class="hero__grid">
            <!-- HERO peint par HTML/CSS, jamais animé au reveal (audit) -->
            <div class="hero__content">
                <!-- Status Badge -->
                <div class="status-badge">
                  <span class="status-badge__dot"></span>
                  <TextScramble text="Un seul navire · IA locale · Harponville, Somme" :scramble-on-mount="true" />
                </div>
                
                <!-- CE QUE NOUS VENDONS — EN PREMIER ÉCRAN (10/09/2026).
                     Constat après relecture : le hero racontait un univers mais
                     ne disait ni ce qu'on vend, ni pour qui, ni à quel prix. Un
                     dirigeant de PME arrivait sur un vaisseau et repartait sans
                     savoir si c'était pour lui. La direction artistique reste,
                     mais l'offre passe devant le récit.
                     Aucun chiffre inventé : ce sont les prix publics du studio. -->
                <p class="hero__offre">
                  <strong>Sites web</strong> · <strong>Applications métier</strong> ·
                  <strong>IA locale</strong> — pour PME et collectivités.
                  À partir de <strong>1 500 € HT</strong>.
                </p>

                <!-- Main Title — message éditorial fort
                     DA D4 : glitch Matrix Resurrections sur la seule ligne accentuée
                     (intensité « light » : les clones restent à 40 % et le texte réel
                     n'est jamais décalé — la lisibilité commerciale est préservée.
                     prefers-reduced-motion annule les clones dans GlitchText.vue). -->
                <h1 id="hero-title" class="hero__title">
                  La machine travaille.<br>
                  <span class="text-gradient neon-text">
                    <GlitchText text="Vous décidez." always-active intensity="light" />
                  </span>
                </h1>
                
                <!-- Subtitle — la valeur concrète, dite avec le vocabulaire du
                     bord sans jamais noyer le propos commercial. La phrase est
                     vérifiable : les agents tournent bien sur une machine
                     identifiée, en France. -->
                <p class="hero__subtitle">
                  Nos agents — rédaction, code, audit, visuels — ne tournent pas dans
                  un <strong>cloud que vous ne pouvez pas nommer</strong> : ils
                  travaillent sur notre propre navire, à Harponville. Vos documents
                  restent dans la cale. En 48 h, nous rendons visible ce qui freine
                  votre système.
                </p>
                
                <!-- CTA : le premier engagement commercial = l'audit -->
                <div class="hero__actions">
                  <!-- LE PAVILLON (apport ALBATOR, D5) : il ne se hisse qu'aux
                       moments de décision. Ici, c'est le CTA principal — le seul
                       endroit où le visiteur s'engage. Décoratif (aria-hidden),
                       CSS pur, jamais hissé en reduced-motion. -->
                  <span class="pavillon" aria-hidden="true">
                    <span class="pavillon__mat"></span>
                    <span class="pavillon__etoffe"><span class="pavillon__sceau"></span></span>
                  </span>
                  <MagneticButton tag="router-link" to="/contact" class="btn-primary btn-large btn-glow" :strength="40" :text-strength="50">
                    Commencer par voir clair
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                    </svg>
                  </MagneticButton>
                </div>
                
                <!-- Chemins selon le visiteur (principe 7) -->
                <div class="hero__paths">
                  <router-link to="/contact" class="hero__path hero__path--pme">
                    <span class="hero__path-tag">PME</span>
                    Vous dirigez une entreprise ? Commencez par l'audit 48 h.
                  </router-link>
                  <router-link to="/projets" class="hero__path hero__path--cto">
                    <span class="hero__path-tag">TECH</span>
                    Vous pilotez la technique ? Voir l'architecture.
                  </router-link>
                </div>
                
                <!-- Quick Navigation (D5) : emojis retirés (verrou D1 : aucun
                     emoji en icône d'interface) et lien « Carte Holistique »
                     retiré — il violait D2 (« GL Tower, Carte Holistique,
                     Workflows n8n, portraits des Lois : hors nav »,
                     decisions-refonte-awwwards-2026.md ligne 22). Les deux liens
                     restants sont sobres et ne dupliquent pas la navigation. -->
                <div class="hero__quick-nav">
                  <router-link to="/arkadia" class="quick-link">
                    Voir la preuve — ARKADIA en production
                  </router-link>
                  <router-link to="/services" class="quick-link">
                    Voir l'offre et les tarifs
                  </router-link>
                </div>
              </div>
          </div>
        </div>
        
        <!-- Scroll Indicator -->
        <div class="hero__scroll-indicator" aria-hidden="true">
          <span class="scroll-text">Scroll</span>
          <div class="scroll-line"></div>
        </div>
      </section>
    </SpotlightContainer>

    <!-- ═══════════════════════════════════════════════════════════════════════
         LE VAISSEAU — ARKADIA SS00999
         Le concept D5 : un navire, un équipage d'IA affranchies, un capitaine.
         L'analogie bateau ↔ ordinateur n'est pas décorative : elle rend la
         souveraineté vérifiable. « Vos données sont dans la cale, et la cale ne
         quitte pas le navire » se comprend sans connaître un seul mot de
         technique.

         MAKOTO : la fiche technique est RELEVÉE sur la machine réelle
         (Win32_Processor, Win32_PhysicalMemory, nvidia-smi), pas estimée. Le
         visuel est généré par notre propre chaîne locale et étiqueté comme tel.
         ═══════════════════════════════════════════════════════════════════════ -->
    <section class="vaisseau" aria-labelledby="vaisseau-title">
      <div class="container">
        <ScrollReveal animation="fade-up">
          <div class="section-header">
            <span class="mono-tag" aria-hidden="true">/// LE VAISSEAU</span>
            <h2 id="vaisseau-title">ARKADIA <span class="text-gradient">SS00999</span></h2>
            <p class="section-header__desc">
              Un seul navire, et il est réel. Tous les agents qui travaillent pour vous
              tournent sur cette machine, dans la Somme. Pas de ferme de serveurs louée,
              pas de sous-traitance : le vaisseau est identifié et ses caractéristiques
              sont publiques.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal animation="fade-up">
          <figure class="vaisseau__figure">
            <img
              src="/models/vaisseau-arkadia-1400.jpg"
              width="1400" height="583"
              loading="lazy" decoding="async"
              alt="Le vaisseau ARKADIA : un galion volant qui traverse un espace
                   numérique, propulsé par un sillage de code lumineux."
            >
            <figcaption>
              Visuel <strong>simulé</strong>, produit par notre propre chaîne locale
              (ComfyUI sur ARKADIA). Aucune image de banque, aucun droit tiers.
            </figcaption>
          </figure>
        </ScrollReveal>

        <ScrollReveal animation="fade-up">
          <div class="vaisseau__bloc">
            <h3 class="vaisseau__sous-titre">Le bateau, c'est l'ordinateur</h3>
            <p class="vaisseau__intro">
              Un navire et une machine de calcul font le même métier : porter une charge
              utile d'un point à un autre sans la perdre en route. Voici le vocabulaire
              de bord, traduit — c'est exactement comme cela que fonctionne le poste.
            </p>

            <!-- La phrase du capitaine : c'est le cœur du concept, pas une
                 décoration. Toute la production du studio se lit à partir d'elle. -->
            <blockquote class="vaisseau__citation">
              <p>Les pages web que nous faisons sont nos voiles.</p>
              <cite>Gaëtan Langlet — capitaine du navire</cite>
            </blockquote>

            <table class="vaisseau__table">
              <caption class="vaisseau__legende">Vocabulaire de bord et son équivalent machine</caption>
              <thead>
                <tr>
                  <th scope="col">À bord</th>
                  <th scope="col">Sur la machine</th>
                  <th scope="col">Ce que ça change pour vous</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row">La coque</th>
                  <td>Le châssis, le boîtier</td>
                  <td>Ce qui protège physiquement le matériel. Il est chez nous, pas dans un centre de données anonyme.</td>
                </tr>
                <tr>
                  <th scope="row">La quille</th>
                  <td>La carte mère</td>
                  <td>La pièce qui tient tout le reste. On la connaît par son modèle, pas par un numéro de parc.</td>
                </tr>
                <tr class="vaisseau__rang--clef">
                  <th scope="row">La propulsion</th>
                  <td>Les cartes graphiques</td>
                  <td><strong>C'est notre propulsion.</strong> C'est ce qui pousse le navire et fait tourner les modèles d'IA à bord — pas une machine louée à l'heure dans un autre pays.</td>
                </tr>
                <tr class="vaisseau__rang--clef">
                  <th scope="row">Les voiles</th>
                  <td>Les sites et applications que nous livrons</td>
                  <td><strong>Chaque site livré est une voile.</strong> C'est lui qui capte le vent et fait avancer votre activité. Une voile mal taillée, et le navire n'avance pas — même avec toute la propulsion du monde.</td>
                </tr>
                <tr>
                  <th scope="row">La cale</th>
                  <td>Le stockage</td>
                  <td><strong>Vos documents sont dans la cale. Et la cale ne quitte pas le navire.</strong></td>
                </tr>
                <tr>
                  <th scope="row">La barre</th>
                  <td>Votre écran et votre clavier</td>
                  <td>Le seul endroit d'où l'on décide. Rien ne se lance sans que quelqu'un tienne la barre.</td>
                </tr>
                <tr>
                  <th scope="row">L'équipage</th>
                  <td>Les agents d'IA</td>
                  <td>Ils abattent le travail de routine. Ils ne décident pas de la destination.</td>
                </tr>
                <tr>
                  <th scope="row">Le capitaine</th>
                  <td>Vous</td>
                  <td>La machine sert, l'humain décide. C'est la règle du bord, et elle n'a pas d'exception.</td>
                </tr>
                <tr>
                  <th scope="row">Le journal de bord</th>
                  <td>Les journaux d'exécution</td>
                  <td>Chaque action est traçable. On peut toujours répondre à « qui a fait quoi, et quand ».</td>
                </tr>
                <tr>
                  <th scope="row">L'ancre</th>
                  <td>Les sauvegardes</td>
                  <td>Ce qu'on jette quand ça tangue. On teste la remontée avant d'en avoir besoin.</td>
                </tr>
                <tr>
                  <th scope="row">La vigie</th>
                  <td>La surveillance</td>
                  <td>Quelqu'un regarde les indicateurs. Une panne se voit avant de coûter une journée.</td>
                </tr>
                <tr>
                  <th scope="row">Le pavillon</th>
                  <td>Notre signature</td>
                  <td>Le cercle-à-point : on sait qui a fait le travail, et on répond de ce qu'on livre.</td>
                </tr>
                <tr>
                  <th scope="row">Le port d'attache</th>
                  <td>Le lieu d'hébergement</td>
                  <td>Harponville, Somme. En France, sous droit français, pas dans un pays qu'on ne peut pas nommer.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </ScrollReveal>

        <ScrollReveal animation="fade-up">
          <div class="vaisseau__bloc vaisseau__bloc--fiche">
            <h3 class="vaisseau__sous-titre">Le navire, en clair</h3>
            <p class="vaisseau__intro">
              Relevé sur la machine elle-même, pas recopié d'une fiche commerciale.
              Une seule unité, pas un parc : c'est ce qui nous empêche de vous vendre
              de la capacité que nous n'avons pas.
            </p>
            <dl class="vaisseau__fiche">
              <div class="vaisseau__ligne">
                <dt>Propulsion</dt>
                <dd>Intel Core i7-11700KF — 8 cœurs, 16 threads</dd>
              </div>
              <div class="vaisseau__ligne">
                <dt>Lest</dt>
                <dd>64 Go de mémoire à 3600 MT/s</dd>
              </div>
              <div class="vaisseau__ligne">
                <dt>Voilure</dt>
                <dd>NVIDIA GeForce RTX 3080 — 10 Go de mémoire vidéo</dd>
              </div>
              <div class="vaisseau__ligne">
                <dt>Équipage embarqué</dt>
                <dd>Agents d'IA, modèles de langage et recherche documentaire, exécutés sur place</dd>
              </div>
              <div class="vaisseau__ligne">
                <dt>Rôle du navire</dt>
                <dd>
                  <strong>Unité de R&amp;D et de démonstration</strong> — pas une
                  infrastructure de production critique
                </dd>
              </div>
              <div class="vaisseau__ligne">
                <dt>Port d'attache</dt>
                <dd>Harponville, Somme — Hauts-de-France, France</dd>
              </div>
            </dl>
            <!-- REQUALIFICATION (10/09/2026) — cette précision vient d'un audit
                 externe qui a classé la « machine unique » en risque critique :
                 tout faire reposer sur un seul poste, c'est un point de
                 défaillance unique. La réponse n'est pas de le cacher ni de
                 promettre une redondance que nous n'avons pas, mais de dire
                 exactement ce que cette machine EST : un poste de recherche et
                 de démonstration de pointe, pas un centre de production.
                 Les environnements qui portent une activité critique se
                 dimensionnent au cas par cas, avec le client, selon ses
                 exigences de continuité. -->
            <p class="vaisseau__note vaisseau__note--alerte">
              <strong>Ce que ce navire n'est pas.</strong> C'est une unité de
              recherche et de démonstration : elle ne prétend pas à la haute
              disponibilité, et <strong>la continuité de service n'est jamais
              garantie par ce seul poste</strong>. Un projet dont l'activité ne
              peut pas s'interrompre se conçoit sur une architecture dédiée,
              dimensionnée avec vous — nous le disons avant la signature, pas
              après.
            </p>
            <p class="vaisseau__note">
              Caractéristiques relevées sur la machine le 10 septembre 2026. Elles ne sont
              pas mises à jour automatiquement : si le navire change, cette page change.
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>

    <!-- LE TERMINAL DU POSTE (D5) : démonstration scénarisée, réponses
         déterministes. Aucun agent d'IA connecté, et la page le dit en tête et
         sans possibilité de le masquer. Placement après la section du vaisseau :
         le visiteur a vu le navire, puis il l'interroge. -->
    <TerminalMnd />



    <!-- PREUVE PRODUIT : ArkAdiA, réseau social souverain EN LIGNE — bande claire
         (la preuve moderne : le studio s'est construit un produit en production avec
         sa stack d'agents IA locaux). Distinct de la preuve d'exploitation ARKADIA
         France PvE (section sombre plus bas). -->
    <section class="preuve-arkadia" aria-labelledby="preuve-arkadia-title">
      <div class="container">
        <ScrollReveal animation="fade-up">
          <div class="preuve-arkadia__box">
            <div class="preuve-arkadia__texte">
              <span class="mono-tag" aria-hidden="true">/// LA PREUVE</span>
              <h2 id="preuve-arkadia-title" class="preuve-arkadia__titre">
                On l'a fait pour nous-mêmes.<br>
                <span class="text-gradient">Ça tourne. En production.</span>
              </h2>
              <p class="preuve-arkadia__desc">
                <strong>ArkAdiA</strong> — notre réseau social souverain (comptes, communautés,
                messagerie temps réel, modération humaine, IA 100 % locale, zéro traceur) —
                tourne en ligne sur <strong>arkadia.gldigitallab.fr</strong>. C'est notre
                démonstration permanente, pas une maquette.
              </p>
              <p class="preuve-arkadia__desc">
                La même stack d'agents et d'IA locale qui fait tourner ArkAdiA, nous la déployons
                chez nos clients : systèmes multi-agents, RAG mémoire, automatisations —
                exécutés sur du matériel identifié, en France. Le détail de chaque flux de
                données est publié, sans formule absolue.
              </p>
              <div class="preuve-arkadia__actions">
                <a class="btn-outline preuve-arkadia__lien" href="https://arkadia.gldigitallab.fr" target="_blank" rel="noopener noreferrer">
                  Voir ArkAdiA en ligne ↗
                </a>
                <router-link class="btn-primary" to="/contact">
                  Parler de mon projet
                </router-link>
              </div>
            </div>
            <div class="preuve-arkadia__reperes" role="list" aria-label="Repères ArkAdiA">
              <div class="preuve-arkadia__repere" role="listitem">
                <span class="preuve-arkadia__valeur">EN LIGNE</span>
                <span class="preuve-arkadia__label">Production réelle</span>
              </div>
              <div class="preuve-arkadia__repere" role="listitem">
                <span class="preuve-arkadia__valeur">16 ANS +</span>
                <span class="preuve-arkadia__label">Politique produit assumée</span>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>


    <!-- PROOF : ARKADIA FRANCE PvE — cluster ARK: Survival Ascended clôturé
         (distinct du réseau social ArkAdiA, arkadia.gldigitallab.fr) -->

    
    <!-- MÉTHODE : fonctionnement du studio, présenté de façon pragmatique (2026-09) -->
    <section class="method" aria-labelledby="method-title">
      <div class="container">
        <ScrollReveal animation="fade-up">
          <div class="section-header">
            <span class="mono-tag" aria-hidden="true">/// 03 · LA MÉTHODE</span>
            <h2 id="method-title">Comment travaille le studio</h2>
            <p class="section-header__desc">
              GL Digital Lab est un studio indépendant (SASU) dirigé par un architecte de
              systèmes multi-agents. Des agents IA spécialisés — orchestration, rédaction,
              code, audit, mémoire — sont nos outils de production : contrôlés à chaque
              étape, jamais un intermédiaire qui décide à votre place.
            </p>
          </div>
        </ScrollReveal>

        <div class="method__grid">
          <ScrollReveal v-for="(step, i) in methodSteps" :key="step.title" animation="fade-up" :delay="i * 120">
            <article class="method-step">
              <span class="method-step__num" aria-hidden="true">{{ String(i + 1).padStart(2, '0') }}</span>
              <h3 class="method-step__title">{{ step.title }}</h3>
              <p class="method-step__text">{{ step.text }}</p>
            </article>
          </ScrollReveal>
        </div>

        <ScrollReveal animation="fade-up">
          <div class="method__guarantees">
            <div v-for="g in methodGuarantees" :key="g.title" class="method-guarantee">
              <h3 class="method-guarantee__title">{{ g.title }}</h3>
              <p class="method-guarantee__text">{{ g.text }}</p>
            </div>
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
              <h2 id="cta-title">Qu'est-ce qu'on fait avancer&nbsp;?</h2>
              <p>Dites-moi ce qui vous ralentit. Je réponds sous 24 h, avec une première estimation gratuite et sans engagement — et si votre besoin n'est pas de notre ressort, je vous le dis aussi.</p>
              <MagneticButton tag="router-link" to="/contact" class="btn-primary btn-large" :strength="35" :text-strength="45">
                Parlons-en !
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
// Components
import AnimatedCounter from '@/components/common/AnimatedCounter.vue';
import GaugeCircle from '@/components/common/GaugeCircle.vue';
// 3D : les 6 unités MND (chargé en async : n'alourdit pas le premier rendu).
// Modèles RÉELLEMENT GÉNÉRÉS : image SDXL (ComfyUI local) → objet 3D TRELLIS.2 →
// allègement web. 407 Ko pour les six, contre 938 Ko pour les anciens avatars
// fabriqués en primitives Blender.
import { defineAsyncComponent, ref, onMounted } from 'vue';

/**
 * DÉCALAGE DE LA 3D HORS DU CHEMIN CRITIQUE (10/09/2026, audit Lighthouse).
 *
 * Mesuré : la scène 3D s'exécutait pendant la fenêtre de Largest Contentful
 * Paint — 9 secondes de travail sur le fil principal, LCP à 6,8 s, score de
 * performance entre 49 et 61 pour une cible de 95. Or ces 2,5 Mo de travail
 * (three.js + six modèles + post-traitement) ne servent à rien avant que le
 * visiteur ait vu le hero.
 *
 * On attend donc le premier moment d'inactivité du navigateur, avec un délai
 * de repli si `requestIdleCallback` n'existe pas. La page est complète et
 * lisible avant : le titre, le sous-titre, le CTA et la Grille TRON sont en
 * HTML et CSS purs.
 */
const unitesPretes = ref(false);

onMounted(() => {
  const reveiller = () => { unitesPretes.value = true; };
  if (typeof window === 'undefined') return;
  if ('requestIdleCallback' in window) {
    // Le délai de 2500 ms garantit que la 3D arrive même sur une page qui ne
    // devient jamais inactive (onglet au premier plan, animations continues).
    window.requestIdleCallback(reveiller, { timeout: 2500 });
  } else {
    window.setTimeout(reveiller, 1200);
  }
});

// UI Components
import { 
  MagneticButton, 
  TextScramble,
  GlitchText,

  TerminalMnd,
  ScrollReveal, 
  SpotlightContainer 
} from '@/components/ui';

// Data

const solutions = [
  {
    title: 'Audit WordPress — 48 h',
    role: 'La sonde',
    price: '149 € – 199 € HT',
    description: 'Je relève sur VOTRE site les failles réelles : version obsolète, plugin vulnérable, absence de mises à jour. Chiffres à l\'appui, avant qu\'un pirate ou Google ne s\'en charge.',
    outputs: [
      'Analyse exécutée sur notre machine, en France — aucun service d\'analyse tiers',
      'Rapport clair, sans jargon, avec les risques en une phrase',
      'Plan chiffré des corrections, devis en option',
      'Résultat sous 48 h'
    ],
    badge: 'POUR COMMENCER',
    // L'audit lit un site PUBLIC : prétendre qu'« aucune donnée ne quitte votre
    // machine » était faux. Formulation corrigée après l'audit Perplexity.
    flux: 'Lecture seule sur un site public. Détail des flux : /flux-de-donnees'
  },
  {
    title: 'Site web',
    role: 'Votre première voile',
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
    title: 'Application métier',
    role: 'La coque, ajustée à votre métier',
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
    title: 'IA & automatisation locale',
    role: 'La propulsion',
    price: 'Audit IA + prototype dès 1 500 € HT',
    description: 'De l\'IA qui s\'exécute sur votre matériel ou sur le nôtre, en France. Le détail de ce qui sort et de ce qui ne sort pas est publié, sans formule absolue.',
    outputs: [
      'Audit IA + prototype sur un cas d\'usage réel',
      'Hébergement dans votre environnement',
      'Aucune donnée envoyée hors de France',
      'Chiffrage du déploiement à l\'issue de l\'audit'
    ]
  },
  {
    title: 'RAG MÉMOIRE',
    role: 'La cale',
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


// Déroulé de travail (méthode, présentée sans détour)
const methodSteps = [
  {
    title: 'Audit 48 h',
    text: 'État des lieux factuel — sécurité, performance, automatisation possible — avec les risques en une phrase et un plan chiffré, sans jargon.'
  },
  {
    title: 'Conception du système',
    text: 'Quels agents, quelle mémoire, quelles données : le système multi-agents est conçu pour VOTRE métier, dans votre environnement ou hébergé en France.'
  },
  {
    title: 'Construction',
    text: 'Agents, RAG, interfaces : livrés par étapes visibles et testables, contrôlés par une vérification qualité indépendante à chaque livraison.'
  },
  {
    title: 'Mise en route & suivi',
    text: 'Déploiement, formation de vos équipes, supervision continue. Vous gardez la main : chaque décision est validée par vous.'
  }
];

const methodGuarantees = [
  {
    title: 'Données sous votre contrôle',
    text: 'L\'IA s\'exécute sur votre matériel ou sur le nôtre, en France. Ce qui sort et ce qui ne sort pas est écrit noir sur blanc, sans formule absolue.'
  },
  {
    title: 'Vérification systématique',
    text: 'Chaque livraison passe un contrôle qualité indépendant : sources citées, tests, zéro métrique inventée.'
  },
  {
    title: 'Vous gardez la main',
    text: 'Aucune décision — technique, visuelle, budgétaire — n\'est verrouillée sans votre validation.'
  }
];
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


/* Button Glow — DS clair : plus de halo émeraude pulsé (D1) */
.btn-glow {
  box-shadow: var(--shadow-md);
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

/* L'offre en premier écran : sobre, lisible, jamais criarde. Elle passe AVANT
   le titre éditorial parce qu'un visiteur doit savoir en deux secondes ce qu'on
   vend. Les prix sont les prix publics du studio, pas une accroche. */
.hero__offre {
  font-family: var(--font-mono);
  font-size: 0.78rem;
  line-height: 1.7;
  letter-spacing: 0.04em;
  color: var(--ink-soft);
  margin-bottom: 1.25rem;
  padding-left: 0.9rem;
  border-left: 2px solid var(--action);
}

.hero__offre strong {
  color: var(--ink);
  font-weight: 700;
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
  color: var(--ink);
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

/* Neon text glow — supprimé (D1 : plus de halo) */
.neon-text {
  /* halo retiré — le gradient clair fait le travail */
}

/* Hero actions spacing */





.quick-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: var(--paper-alt);
  border: 1px solid var(--rule);
  border-radius: 2rem;
  font-size: 0.75rem;
  color: var(--text-muted);
  text-decoration: none;
  transition: all 0.3s ease;
}



.hero__quick-nav {
  display: flex;
  justify-content: flex-start;
  gap: 1rem;
  margin-top: 2rem;
  flex-wrap: wrap;
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
  color: var(--ink-soft);
  letter-spacing: 0.1em;
  opacity: 0.9;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: var(--paper-alt);
  border: 1px solid var(--rule);
  border-radius: 2rem;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.55rem;
  color: var(--ink-soft);
  letter-spacing: 0.15em;
  margin-bottom: var(--space-md);
}

/* pendant l'animation de scramble, pas de couleur d'accent : on hérite */
.status-badge :deep(.text-scramble--active) {
  color: inherit;
}

.status-badge__dot {
  width: 6px;
  height: 6px;
  background: var(--ink-soft);
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
  color: var(--ink-soft);
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
  border-color: var(--rule-strong);
}

.solution-card--featured {
  border-color: var(--rule-strong);
}

.solution-card__badge {
  position: absolute;
  top: -10px;
  right: var(--space-sm);
  padding: 0.25rem 0.75rem;
  background: var(--ink);
  color: var(--paper);
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
  color: var(--ink-soft);
  padding: 0.25rem 0.5rem;
  background: var(--paper-alt);
  border: 1px solid var(--rule);
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
  color: var(--ink-soft);
}

.solution-card__cta {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.7rem;
  color: var(--ink);
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

/* PROOF — bandeau preuve ARKADIA en SECTION INVERSÉE (fond encre, DS D1).
   Une des 1-2 sections sombres max de la home, pour rythmer. */
.proof {
  padding: var(--space-xl) 0;
  background: var(--ink);
  border-top: 1px solid rgba(244, 241, 234, 0.12);
  border-bottom: 1px solid rgba(244, 241, 234, 0.12);
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
  color: var(--accent-inv);
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.proof__badge-dot {
  width: 8px;
  height: 8px;
  background: var(--accent-inv);
  border-radius: 50%;
  animation: pulse-slow 2s infinite;
}

/* Projet cloture : ni point pulsant ni couleur d'accent — le badge ne doit
   pas suggerer un service encore en ligne. */
.proof__badge--closed {
  color: rgba(244, 241, 234, 0.78);
  border: 1px solid currentColor;
  border-radius: 3px;
  padding: 0.25rem 0.6rem;
}

.proof__title {
  font-size: 2.5rem;
  font-weight: 700;
  margin: var(--space-sm) 0 var(--space-md);
  color: var(--paper);
}

.proof__desc {
  font-size: 0.95rem;
  color: rgba(244, 241, 234, 0.85);
  line-height: 1.8;
  margin-bottom: var(--space-sm);
}

.proof__desc strong {
  color: var(--paper);
}

.proof__metrics {
  display: flex;
  gap: var(--space-md);
  margin: var(--space-md) 0;
}

.proof-metric {
  padding: var(--space-sm) var(--space-md);
  background: rgba(255, 255, 255, 0.06);
  border-left: 2px solid var(--accent-inv);
}

.proof-metric__value {
  display: block;
  font-family: 'JetBrains Mono', monospace;
  font-size: 2rem;
  font-weight: 700;
  color: var(--paper);
}

.proof-metric__unit {
  font-size: 1rem;
  color: var(--paper);
}

.proof-metric__label {
  display: block;
  font-size: 0.6rem;
  color: rgba(244, 241, 234, 0.68);
  text-transform: uppercase;
  margin-top: 0.25rem;
}

.proof__gauges {
  display: flex;
  justify-content: center;
  gap: var(--space-lg);
  padding: var(--space-lg);
  border-radius: 1rem;
  border: 1px solid rgba(244, 241, 234, 0.16);
}

/* Jauges (GaugeCircle) en section inversée — couleurs forcées */
.proof :deep(.gauge__track) {
  stroke: rgba(244, 241, 234, 0.16) !important;
}

.proof :deep(.gauge__progress) {
  stroke: var(--accent-inv) !important;
  filter: none !important;
}

.proof :deep(.gauge__value) {
  color: var(--paper) !important;
}

.proof :deep(.gauge__label) {
  color: rgba(244, 241, 234, 0.92) !important;
}

/* Bouton outline inversé : papier sur encre */
.proof .btn-outline {
  color: var(--paper) !important;
  border-color: var(--paper) !important;
  background: transparent !important;
}

.proof .btn-outline:hover {
  background: var(--paper) !important;
  color: var(--ink) !important;
  border-color: var(--paper) !important;
}

/* Gradient du titre ARKADIA : version inversée (papier → terre cuite claire) */
.proof .text-gradient {
  background: linear-gradient(135deg, var(--paper), var(--accent-inv));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
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
  color: var(--ink) !important;
  font-weight: 700;
}

.stack-card__link {
  display: block;
  text-align: center;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.75rem;
  color: var(--ink);
  text-decoration: none;
  transition: color 0.3s ease;
}

.stack-card__link:hover {
  color: var(--accent);
}

/* MULTIVERS TEASER */



.universe-card:hover {
  border-color: var(--accent);
  box-shadow: 0 0 30px color-mix(in srgb, var(--accent) 30%, transparent);
}




/* HERO QUICK NAV */


.quick-link:hover {
  border-color: var(--accent);
  color: var(--accent);
  background: rgba(0, 255, 65, 0.06);
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
  border: 1px solid var(--rule);
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

/* Numérotation technique des cartes (D5) : un index monospace remplace les
   emojis d'icône. L'ADN technique vient de la mise en forme, pas d'un pictogramme
   dont le rendu dépend du système d'exploitation du visiteur. */
.solution-card__icon {
  font-family: var(--font-mono);
  font-size: 0.82rem;
  font-weight: 700;
  letter-spacing: 0.16em;
  color: var(--neon-cyan);
  opacity: 0.85;
  transition: color var(--transition-base);
}

.solution-card:hover .solution-card__icon {
  color: var(--accent);
  opacity: 1;
}

/* ── Rôle au chantier naval (D5) : le vocabulaire du navire posé sur l'offre,
   au-dessus du nom commercial qui reste, lui, parfaitement clair. ── */
.solution-card__role {
  display: block;
  font-family: var(--font-mono);
  font-size: 0.6rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--neon-cyan);
  margin-bottom: 0.35rem;
}

/* ── LE CHANTIER NAVAL : le renversement du concept, en fin de section offre ── */
.chantier {
  margin-top: 3rem;
  padding: 2rem 2.25rem;
  border: 1px solid var(--rule);
  border-left: 3px solid var(--neon-cyan);
  background: var(--paper-alt);
  display: grid;
  grid-template-columns: minmax(0, 1.35fr) minmax(0, 1fr);
  gap: 2.5rem;
  align-items: start;
}

.chantier__titre {
  font-size: clamp(1.25rem, 2.6vw, 1.7rem);
  margin-bottom: 0.85rem;
}

.chantier__texte p {
  color: var(--ink-soft);
  line-height: 1.75;
  max-width: 62ch;
}

.chantier__points {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0;
}

.chantier__points li {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  padding: 0.85rem 0;
  border-bottom: 1px solid var(--rule);
}

.chantier__points li:last-child {
  border-bottom: 0;
}

.chantier__points strong {
  font-family: var(--font-mono);
  font-size: 0.72rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--accent);
}

.chantier__points span {
  font-size: 0.9rem;
  color: var(--ink-soft);
}

@media (max-width: 860px) {
  .chantier {
    grid-template-columns: 1fr;
    gap: 1.5rem;
    padding: 1.5rem;
  }
}

/* Price tag : halo retiré (D1) */

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

/* Metric value counter glow — supprimé (D1) */

/* Proof metric border animation */
.proof-metric {
  transition: border-color 0.3s ease, background 0.3s ease;
}

.proof-metric:hover {
  border-color: var(--accent-inv);
  background: rgba(255, 255, 255, 0.05);
}

/* Stack tech highlight pulse (sans halo) */
.stack-item__tech--highlight {
  animation: techPulse 3s ease-in-out infinite;
}

@keyframes techPulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

/* Selection style */
::selection {
  background: rgba(0, 255, 65, 0.28);
  color: var(--ink);
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
  background: linear-gradient(135deg, var(--ink), #6E6352);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.glass {
  background: rgba(255, 255, 255, 0.55);
  backdrop-filter: blur(10px);
  border: 1px solid var(--rule);
}

/* ═══════════════════════════════════════════════════════════════════════════
   LA MÉTHODE — fonctionnement du studio (remplace la section « cercle » lore,
   09/2026) : message pragmatique, étapes de travail + garanties.
   ═══════════════════════════════════════════════════════════════════════════ */

.method {
  padding: var(--space-xl) 0;
}

.method__grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-md);
  margin-top: var(--space-xl);
}

.method-step {
  height: 100%;
  background: var(--paper-alt);
  border: 1px solid var(--rule);
  border-radius: 0.9rem;
  padding: var(--space-md);
}

.method-step__num {
  display: block;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.16em;
  color: var(--accent);
  margin-bottom: var(--space-xs);
}

.method-step__title {
  font-size: 1rem;
  font-weight: 700;
  color: var(--text-main);
  margin-bottom: var(--space-xs);
}

.method-step__text {
  font-size: 0.85rem;
  color: var(--text-muted);
  line-height: 1.65;
  margin: 0;
}

.method__guarantees {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-md);
  margin-top: var(--space-lg);
  padding-top: var(--space-lg);
  border-top: 1px solid var(--border);
}

.method-guarantee__title {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--text-main);
  margin: 0 0 var(--space-xs);
}

.method-guarantee__text {
  font-size: 0.85rem;
  color: var(--text-muted);
  line-height: 1.65;
  margin: 0;
}
/* RESPONSIVE */
@media (max-width: 1024px) {
  .hero__grid {
    grid-template-columns: 1fr;
    gap: 2rem;
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

/* MÉTHODE RESPONSIVE */
@media (max-width: 1024px) {
  .method__grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .method__guarantees {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .method__grid {
    grid-template-columns: 1fr;
  }
}
/* ═══════════════════════════════════════════════════════════════════════════
   SIGNATURE ORBITE (2026-10, d'après recherche Awwwards)
   « La technologie peut bouger ; le centre de gravité ne bouge pas. »
   Point émeraude FIXE + anneaux pointillés qui tournent (transform = GPU).
   Décoratif (aria-hidden), zéro WebGL, réduit avec prefers-reduced-motion.
   ═══════════════════════════════════════════════════════════════════════════ */
.hero__orbit {
  position: absolute;
  top: 50%;
  right: clamp(-40px, -2vw, 0px);
  width: clamp(320px, 42vw, 560px);
  aspect-ratio: 1 / 1;
  transform: translateY(-50%);
  z-index: 0;
  pointer-events: none;
  opacity: 0.85;
}

/* LES 6 LOIS EN 3D — surimpression transparente (fond papier préservé, D1).
   Zone : moitié droite du hero, derrière le contenu texte. */
.hero__lois {
  position: absolute;
  top: 50%;
  right: clamp(-60px, -3vw, 0px);
  width: clamp(420px, 52vw, 820px);
  height: min(88vh, 760px);
  transform: translateY(-50%);
  z-index: 0;
  pointer-events: none;
}
@media (max-width: 1024px) {
  .hero__lois { opacity: 0.6; }
}
@media (max-width: 768px) {
  /* mobile : la scène 3D passe en fond discret, le texte reste prioritaire */
  .hero__lois { right: 0; width: 100%; height: 60vh; opacity: 0.4; }
}

/* point central : le centre de gravité — immobile */
.hero__orbit-core {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 10px;
  height: 10px;
  margin: -5px;
  border-radius: 50%;
  background: var(--accent);
  box-shadow: 0 0 8px rgba(0, 255, 65, 0.4);
  animation: orbit-core-pulse 3.5s ease-in-out infinite;
}

@keyframes orbit-core-pulse {
  0%, 100% { transform: scale(1); opacity: 0.95; }
  50%      { transform: scale(1.25); opacity: 1; }
}

/* anneaux pointillés qui tournent — le système recalcule sa trajectoire */
.hero__orbit-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  border-radius: 50%;
  border: 1px dashed rgba(0, 255, 65, 0.28);
  transform: translate(-50%, -50%);
}

.hero__orbit-ring--1 { width: 34%; height: 34%; animation: orbit-spin 42s linear infinite; }
.hero__orbit-ring--2 { width: 58%; height: 58%; animation: orbit-spin 60s linear infinite reverse; border-color: rgba(0, 255, 65, 0.20); }
.hero__orbit-ring--3 { width: 82%; height: 82%; animation: orbit-spin 80s linear infinite; border-style: solid; border-color: rgba(0, 229, 255, 0.12); }

@keyframes orbit-spin {
  from { transform: translate(-50%, -50%) rotate(0deg); }
  to   { transform: translate(-50%, -50%) rotate(360deg); }
}

/* A11Y : mouvement coupé, motif figé mais présent */
@media (prefers-reduced-motion: reduce) {
  .hero__orbit-core,
  .hero__orbit-ring { animation: none !important; }
  .hero__orbit { opacity: 0.5; }
}

/* ═══════════════════════════════════════════════════════════════════════════
   CHEMINS VISITEUR (principe 7) : deux portes lisibles sous le CTA
   PME → audit 48 h · TECH → architecture. Discrets, pas de pill tape-à-l'œil.
   ═══════════════════════════════════════════════════════════════════════════ */
.hero__paths {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem 2rem;
  margin-top: 2rem;
}

.hero__path {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  /* Pile système (D5) — plus aucune famille réseau en dehors de Fraunces et
     JetBrains Mono. */
  font-family: inherit;
  font-size: 0.8rem;
  color: var(--text-muted);
  text-decoration: none;
  transition: color var(--transition-base);
}

.hero__path:hover {
  color: var(--text-main);
}

.hero__path-tag {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.6rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  color: var(--ink-soft);
  border: 1px solid var(--rule);
  padding: 0.15rem 0.45rem;
  border-radius: 0.3rem;
  flex-shrink: 0;
}

.hero__path--cto .hero__path-tag {
  color: var(--ink-soft);
}

/* ═══════════════════════════════════════════════════════════════════════
   OVERRIDES DS CLAIR (D1) — boutons MagneticButton du parcours.
   Le composant appose ses propres couleurs (brique + hover #fff) par-dessus
   .btn-primary/.btn-outline : on force l'état « bouton plein brique » sur
   papier et « outline papier » sur la section inversée (proof).
   ═══════════════════════════════════════════════════════════════════════ */
.btn-primary.magnetic-button {
  background: var(--accent) !important;
  border-color: var(--accent) !important;
  color: var(--paper) !important;
}

.btn-primary.magnetic-button:hover {
  background: var(--accent-ink) !important;
  border-color: var(--accent-ink) !important;
  color: var(--paper) !important;
}

/* ═══════════════════════════════════════════════════════════════════════
   PREUVE ARKADIA (bande claire, 09/09/2026) — « On l'a fait pour nous-mêmes »
   Section claire : ne PAS reprendre .proof (fond encre) pour éviter deux
   bandeaux sombres consécutifs avec la preuve ARKADIA France PvE.
   ═══════════════════════════════════════════════════════════════════════ */
.preuve-arkadia {
  padding: var(--space-xl) 0;
}

.preuve-arkadia__box {
  background: var(--surface-light);
  border: 1px solid var(--rule);
  border-radius: 1.1rem;
  padding: clamp(1.5rem, 4vw, 3rem);
  display: grid;
  grid-template-columns: 1.6fr 1fr;
  gap: var(--space-lg);
  align-items: center;
}

.preuve-arkadia__titre {
  font-size: clamp(1.5rem, 3vw, 2.2rem);
  font-weight: 700;
  color: var(--text-main);
  line-height: 1.15;
  margin: var(--space-sm) 0 var(--space-md);
}

.preuve-arkadia__desc {
  color: var(--text-muted);
  line-height: 1.75;
  max-width: 62ch;
  margin: 0 0 var(--space-sm);
}

.preuve-arkadia__desc strong {
  color: var(--text-main);
}

.preuve-arkadia__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: var(--space-sm);
}

.preuve-arkadia__actions .btn-primary,
.preuve-arkadia__actions .btn-outline {
  text-decoration: none;
}

.preuve-arkadia__reperes {
  display: grid;
  gap: var(--space-sm);
}

.preuve-arkadia__repere {
  padding: var(--space-sm) var(--space-md);
  background: var(--paper);
  border: 1px solid var(--rule);
  border-left: 3px solid var(--accent);
  border-radius: 0.5rem;
}

.preuve-arkadia__valeur {
  display: block;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--text-main);
}

.preuve-arkadia__label {
  display: block;
  font-size: 0.65rem;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-top: 0.2rem;
}

@media (max-width: 900px) {
  .preuve-arkadia__box {
    grid-template-columns: 1fr;
  }
}

/* ═══════════════════════════════════════════════════════════════════════════
   LE PAVILLON (apport ALBATOR, concept D5)
   Son style est défini dans global.css — il sert aussi sur la page Contact,
   dans le bouton d'envoi. Une seule définition, deux usages.
   ═══════════════════════════════════════════════════════════════════════════ */

/* ═══════════════════════════════════════════════════════════════════════════
   LE VAISSEAU (concept D5) — ARKADIA SS00999
   Section de récit : l'analogie bateau ↔ ordinateur, puis la fiche réelle.
   ═══════════════════════════════════════════════════════════════════════════ */
.vaisseau {
  padding: var(--space-xl) 0;
}

.vaisseau__figure {
  margin: 2.5rem 0 0;
  position: relative;
  border: 1px solid var(--rule);
  overflow: hidden;
}

.vaisseau__figure img {
  display: block;
  width: 100%;
  height: auto;
}

.vaisseau__figure figcaption {
  padding: 0.7rem 1rem;
  font-family: var(--font-mono);
  font-size: 0.62rem;
  letter-spacing: 0.10em;
  color: var(--ink-faint);
  border-top: 1px solid var(--rule);
  background: var(--paper-alt);
}

.vaisseau__figure figcaption strong {
  color: var(--alert);
  font-weight: 700;
}

.vaisseau__bloc {
  margin-top: 3.5rem;
}

.vaisseau__sous-titre {
  font-size: clamp(1.4rem, 3vw, 1.9rem);
  margin-bottom: 0.75rem;
}

.vaisseau__intro {
  max-width: 68ch;
  color: var(--ink-soft);
  line-height: 1.75;
  margin-bottom: 2rem;
}

/* ── La phrase du capitaine : mise en avant, mais jamais criée ── */
.vaisseau__citation {
  margin: 0 0 2.5rem;
  padding: 1.5rem 0 1.5rem 1.75rem;
  border-left: 3px solid var(--accent);
  background: linear-gradient(to right, rgba(0, 255, 65, 0.05), transparent 70%);
}

.vaisseau__citation p {
  font-size: clamp(1.3rem, 3.2vw, 2rem);
  line-height: 1.25;
  color: var(--ink);
  text-wrap: balance;
}

.vaisseau__citation cite {
  display: block;
  margin-top: 0.85rem;
  font-family: var(--font-mono);
  font-size: 0.66rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--ink-faint);
  font-style: normal;
}

/* La ligne des voiles est la clé de voûte du concept : elle se distingue. */
.vaisseau__rang--clef {
  background: rgba(0, 229, 255, 0.04);
}

.vaisseau__rang--clef th[scope="row"] {
  color: var(--neon-cyan);
}

/* ── Table d'analogie : à bord / sur la machine / l'effet pour le client ── */
.vaisseau__table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.92rem;
}

.vaisseau__legende {
  caption-side: top;
  text-align: left;
  font-family: var(--font-mono);
  font-size: 0.6rem;
  letter-spacing: 0.16em;
  color: var(--ink-faint);
  text-transform: uppercase;
  padding-bottom: 0.75rem;
}

.vaisseau__table th,
.vaisseau__table td {
  text-align: left;
  vertical-align: top;
  padding: 0.85rem 1rem 0.85rem 0;
  border-bottom: 1px solid var(--rule);
}

.vaisseau__table thead th {
  font-family: var(--font-mono);
  font-size: 0.62rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--neon-cyan);
  border-bottom-color: var(--rule-strong);
}

.vaisseau__table tbody th {
  font-weight: 600;
  color: var(--accent);
  white-space: nowrap;
}

.vaisseau__table tbody td {
  color: var(--ink-soft);
}

.vaisseau__table tbody td:nth-child(2) {
  color: var(--ink);
}

.vaisseau__table tbody td strong {
  color: var(--ink);
  font-weight: 600;
}

.vaisseau__table tbody tr:hover {
  background: rgba(0, 255, 65, 0.03);
}

/* ── Fiche technique réelle ── */
.vaisseau__bloc--fiche {
  border-top: 1px solid var(--rule-strong);
  padding-top: 2.5rem;
}

.vaisseau__fiche {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 0;
  border: 1px solid var(--rule);
  border-left: 3px solid var(--accent);
  background: var(--paper-alt);
}

.vaisseau__ligne {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  padding: 1.1rem 1.25rem;
  border-bottom: 1px solid var(--rule);
  border-right: 1px solid var(--rule);
}

.vaisseau__ligne dt {
  font-family: var(--font-mono);
  font-size: 0.6rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--ink-faint);
}

.vaisseau__ligne dd {
  color: var(--ink);
  font-size: 0.95rem;
  line-height: 1.5;
}

.vaisseau__note {
  margin-top: 1rem;
  font-family: var(--font-mono);
  font-size: 0.62rem;
  letter-spacing: 0.08em;
  color: var(--ink-faint);
  max-width: 70ch;
}

/* Note d'alerte : sert à énoncer une limite assumée, pas un argument.
   Bande orange à gauche + fond opaque, pour qu'elle ne passe pas inaperçue
   sans pour autant crier. */
.vaisseau__note--alerte {
  padding: 1rem 1.25rem;
  border-left: 3px solid var(--alert);
  background: var(--paper-alt);
  font-family: inherit;
  font-size: 0.92rem;
  line-height: 1.7;
  letter-spacing: normal;
  color: var(--ink-soft);
  max-width: 76ch;
  margin-top: 1.5rem;
}

.vaisseau__note--alerte strong {
  color: var(--ink);
}

@media (max-width: 720px) {
  .vaisseau__table {
    font-size: 0.85rem;
  }
  .vaisseau__table thead {
    display: none;   /* sur mobile, les colonnes empilées se lisent sans en-tête */
  }
  .vaisseau__table tbody th,
  .vaisseau__table tbody td {
    display: block;
    padding: 0.35rem 0;
    border-bottom: 0;
  }
  .vaisseau__table tbody tr {
    display: block;
    padding: 0.85rem 0;
    border-bottom: 1px solid var(--rule);
  }
}
</style>
