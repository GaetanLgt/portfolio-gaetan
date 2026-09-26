<template>
  <div class="projects-page">
    <!-- HERO -->
    <section class="projects-hero">
      <div class="container">
        <div class="projects-hero__content">
          <div class="status-badge">
            <span class="status-badge__dot"></span>
            <span class="status-badge__text">DES PREUVES, PAS UNE GALERIE</span>
          </div>
          
          <h1 class="projects-hero__title">
            <span class="text-gradient">Réalisations</span> &amp; preuves
          </h1>

          <!-- ⭐ RÉÉCRIT LE 26/09/2026. La page s’annonçait par ses technologies
               (« applications Symfony, interfaces Vue 3 ») : c’est une liste de
               moyens, pas une promesse. Elle annonce maintenant ce que le lecteur
               va pouvoir VÉRIFIER. -->
          <p class="projects-hero__desc">
            Chaque projet est présenté par <strong>ce qu’il règle</strong>, la
            <strong>contrainte</strong> qu’il subissait, l’<strong>architecture</strong>
            retenue, et <strong>ce qui tourne sans intervention</strong>.
            Les technologies arrivent après : elles disent comment, pas pourquoi.
          </p>
          
          <!-- Stats -->
          <div class="projects-stats">
            <div class="projects-stat">
              <span class="projects-stat__value">{{ projects.length }}</span>
              <span class="projects-stat__label">Projets</span>
            </div>
            <div class="projects-stat">
              <span class="projects-stat__value">{{ uniqueTechs.length }}</span>
              <span class="projects-stat__label">Technologies</span>
            </div>
            <!-- ⛔ « 5+ Années XP » RETIRÉ LE 26/09/2026 : le nombre était écrit
                 à la main et AUCUNE source du dépôt ne le produit. Ce n’est pas
                 une pudeur : un chiffre non sourcé dans un portfolio finit cité
                 dans un devis. Remplacé par un COMPTE, calculé à l’affichage. -->
            <div class="projects-stat">
              <span class="projects-stat__value">{{ projetsAvecCas.length }}</span>
              <span class="projects-stat__label">Cas d’étude publiés</span>
            </div>
          </div>
        </div>
      </div>
    </section>
    
    <!-- FILTERS -->
    <section class="projects-filters">
      <div class="container">
        <div class="filters-wrapper">
          <button 
            class="filter-btn"
            :class="{ 'active': activeFilter === 'all' }"
            @click="activeFilter = 'all'"
          >
            Tous
            <span class="filter-count">{{ projects.length }}</span>
          </button>
          <button 
            v-for="cat in categories" 
            :key="cat.id"
            class="filter-btn"
            :class="{ 'active': activeFilter === cat.id }"
            @click="activeFilter = cat.id"
          >
            {{ cat.icon }} {{ cat.name }}
            <span class="filter-count">{{ getCountByCategory(cat.id) }}</span>
          </button>
        </div>
      </div>
    </section>
    
    <!-- PROJECTS GRID -->
    <section class="projects-grid-section">
      <div class="container">
        <TransitionGroup name="projects" tag="div" class="projects-grid">
          <article 
            v-for="project in filteredProjects" 
            :key="project.id"
            class="project-card glass"
            role="button"
            tabindex="0"
            :aria-label="'Voir la preuve du projet ' + project.name"
            @click="openProject(project)"
            @keydown.enter.prevent="openProject(project)"
            @keydown.space.prevent="openProject(project)"
          >
            <!-- Header -->
            <div class="project-card__header">
              <span class="project-card__icon">{{ project.icon }}</span>
              <div class="project-card__badges">
                <span v-if="project.featured" class="badge badge--featured">⭐ Featured</span>
                <span class="badge" :class="'badge--' + project.category">{{ getCategoryName(project.category) }}</span>
              </div>
            </div>
            
            <!-- Content -->
            <div class="project-card__content">
              <!-- NIVEAU CORRIGÉ (13/09/2026) : h1 puis h3, sans h2 intercalé.
                   Lighthouse (heading-order) le relevait sur chaque carte. Le
                   titre des cartes est le niveau juste sous le titre de page : ce
                   sont des h2. Le style ne bouge pas, il passe par la classe. -->
              <h2 class="project-card__title">{{ project.name }}</h2>
              <!-- ⭐ LA CARTE OUVRE SUR LE PROBLÈME, PAS SUR LA GAMME.
                   Le résumé commercial (shortDesc) passe dans la fiche :
                   en vitrine, ce qui accroche un dirigeant, c’est la
                   situation qu’il reconnaît, pas la liste des outils. -->
              <p class="project-card__desc">{{ project.preuve.probleme }}</p>
              <p v-if="project.preuve.automatise" class="project-card__auto">
                <span class="project-card__auto-tag">Automatisé</span>
                {{ project.preuve.automatise.split('.')[0] }}.
              </p>
            </div>
            
            <!-- Tech Stack -->
            <div class="project-card__stack">
              <span 
                v-for="tech in project.stack.slice(0, 4)" 
                :key="tech"
                class="tech-tag"
              >
                {{ tech }}
              </span>
              <span v-if="project.stack.length > 4" class="tech-tag tech-tag--more">
                +{{ project.stack.length - 4 }}
              </span>
            </div>
            
            <!-- Footer -->
            <div class="project-card__footer">
              <span class="project-card__date">{{ project.year }}</span>
              <span class="project-card__action">Voir la preuve →</span>
            </div>
          </article>
        </TransitionGroup>
      </div>
    </section>
    
    <!-- PROJECT MODAL -->
    <Teleport to="body">
      <Transition name="modal">
        <!-- ⛔ ACCESSIBILITÉ, AJOUTÉE LE 26/09/2026 : la fiche s’ouvrait sans
             rôle de dialogue, sans nom accessible, et ne se fermait qu’à la
             souris (Échap ne faisait rien). Les trois sont corrigés ici. -->
        <div 
          v-if="selectedProject" 
          class="project-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="project-modal-titre"
          @click.self="closeProject"
        >
          <div class="project-modal__content glass">
            <button @click="closeProject" class="project-modal__close" aria-label="Fermer la fiche du projet">✕</button>
            
            <div class="project-modal__header">
              <span class="project-modal__icon">{{ selectedProject.icon }}</span>
              <div>
                <h2 id="project-modal-titre" class="project-modal__title">{{ selectedProject.name }}</h2>
                <span class="project-modal__category">{{ getCategoryName(selectedProject.category) }} • {{ selectedProject.year }}</span>
              </div>
            </div>
            
            <p class="project-modal__desc">{{ selectedProject.fullDesc }}</p>

            <!-- ⭐ LA GRILLE DE PREUVE — 26/09/2026. L’ordre est celui demandé,
                 et il n’est pas décoratif : il commence par le problème du
                 lecteur et finit par ce qui ne demande plus personne. -->
            <div class="preuve-etapes">
              <div class="preuve-etape">
                <h3>Problème</h3>
                <p>{{ selectedProject.preuve.probleme }}</p>
              </div>
              <div class="preuve-etape">
                <h3>Contrainte</h3>
                <p>{{ selectedProject.preuve.contrainte }}</p>
              </div>
              <div class="preuve-etape">
                <h3>Architecture</h3>
                <p>{{ selectedProject.preuve.architecture }}</p>
              </div>
              <div class="preuve-etape">
                <h3>Technologies</h3>
                <div class="project-modal__tags">
                  <span v-for="tech in selectedProject.stack" :key="tech" class="tech-tag tech-tag--large">
                    {{ tech }}
                  </span>
                </div>
                <p class="preuve-etape__note">
                  Ce sont des moyens. Ils sont écrits ici pour être vérifiés, pas
                  pour convaincre.
                </p>
              </div>
              <div class="preuve-etape">
                <h3>Solution</h3>
                <p>{{ selectedProject.preuve.solution }}</p>
              </div>
              <div class="preuve-etape">
                <h3>Résultat</h3>
                <p v-if="selectedProject.preuve.resultat">{{ selectedProject.preuve.resultat }}</p>
                <p v-else class="preuve-etape__absent">
                  <strong>Non mesuré.</strong> Aucun relevé exploitable n’existe pour
                  ce projet, donc aucun chiffre n’est affiché. Un résultat inventé
                  vaut moins qu’un résultat absent : le second se voit.
                </p>
              </div>
              <!-- ⭐ LE RELEVÉ RÉEL, LÀ OÙ IL EXISTE. Les trois valeurs sont LUES
                   dans src/data/etat-studio.json, écrit par scripts/generer-etat.mjs
                   à chaque npm run build. Elles ne peuvent pas vieillir en silence. -->
              <div v-if="selectedProject.id === 'gldigitallab' && mesuresBuild" class="preuve-etape preuve-etape--releve">
                <h3>Relevé du dernier build</h3>
                <ul class="preuve-releve">
                  <li v-if="mesuresBuild.pages !== null">
                    <strong>{{ mesuresBuild.pages }}</strong> pages prérendues
                  </li>
                  <li v-if="mesuresBuild.poids !== null">
                    Page d’accueil servie : <strong>{{ mesuresBuild.poids }} Ko</strong>
                    <span v-if="mesuresBuild.seuilPoids"> (plafond fixé à {{ mesuresBuild.seuilPoids }} Ko)</span>
                  </li>
                  <li v-if="mesuresBuild.requetes !== null">
                    <strong>{{ mesuresBuild.requetes }}</strong> requêtes au premier chargement
                    <span v-if="mesuresBuild.seuilRequetes"> (plafond fixé à {{ mesuresBuild.seuilRequetes }})</span>
                  </li>
                </ul>
                <p class="preuve-etape__note">
                  Source : <code>src/data/etat-studio.json</code>, écrit par
                  <code>scripts/generer-etat.mjs</code>. Ces valeurs sont régénérées
                  à chaque build — elles ne sont pas recopiées à la main.
                </p>
              </div>
              <div class="preuve-etape">
                <h3>Ce qui a été automatisé</h3>
                <p v-if="selectedProject.preuve.automatise">{{ selectedProject.preuve.automatise }}</p>
                <p v-else class="preuve-etape__absent">
                  Rien n’a été automatisé sur ce projet, et c’est dit plutôt que
                  comblé : toutes les actions y sont manuelles.
                </p>
              </div>
            </div>

            <!-- Features -->
            <div v-if="selectedProject.features" class="project-modal__features">
              <h3>Fonctionnalités clés</h3>
              <ul>
                <li v-for="feature in selectedProject.features" :key="feature">
                  {{ feature }}
                </li>
              </ul>
            </div>
            
            <!-- Learnings -->
            <div v-if="selectedProject.learnings" class="project-modal__learnings">
              <h3>Apprentissages</h3>
              <p>{{ selectedProject.learnings }}</p>
            </div>
            
            <!-- Links -->
            <div class="project-modal__links">
              <a 
                v-if="selectedProject.github"
                :href="selectedProject.github" 
                target="_blank" 
                rel="noopener"
                class="project-modal__link"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                Voir sur GitHub
              </a>
              <a 
                v-if="selectedProject.demo"
                :href="selectedProject.demo" 
                target="_blank" 
                rel="noopener"
                class="project-modal__link project-modal__link--primary"
              >
                🚀 Voir la démo
              </a>
              <router-link 
                v-if="selectedProject.casestudy"
                :to="selectedProject.casestudy"
                class="project-modal__link project-modal__link--primary"
                @click="closeProject"
              >
                📄 Case Study complet
              </router-link>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
    
    <!-- CTA -->
    <section class="projects-cta">
      <div class="container">
        <div class="projects-cta__box glass">
          <div class="projects-cta__content">
            <h2>Un projet en tête ?</h2>
            <p>Discutons de comment je peux vous aider à le réaliser.</p>
          </div>
          <router-link to="/contact" class="projects-cta__btn">
            DÉMARRER UN PROJET →
          </router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';

// ⭐ LE RELEVÉ DU BUILD, IMPORTÉ — PAS RECOPIÉ. Écrit par scripts/generer-etat.mjs
// à chaque npm run build (prebuild ET postbuild) : il ne peut donc pas vieillir
// en silence. Une mesure indisponible vaut null, jamais zéro.
import etatDuStudio from '@/data/etat-studio.json';

// Categories
const categories = [
  { id: 'symfony', name: 'Symfony', icon: '🎼' },
  { id: 'vue', name: 'Vue.js', icon: '💚' },
  { id: 'wordpress', name: 'WordPress', icon: '📝' },
  { id: 'gaming', name: 'Gaming', icon: '🎮' },
  { id: 'fullstack', name: 'Full-Stack', icon: '⚡' }
];

// Projects data
const projects = ref([
  {
    id: 'voyageopro',
    // ⭐ LA PREUVE — ajoutée le 26/09/2026. Un écran ne prouve rien ; une
    // contrainte, une décision d’architecture et une source, si.
    // « resultat: null » n’est PAS un oubli : cela veut dire qu’aucune mesure
    // n’existe pour ce projet, et l’interface l’écrit au lieu d’inventer.
    preuve: {
      probleme: "Passer d’un suivi éparpillé entre plusieurs fichiers à une plateforme unique, sans perdre le métier au passage.",
      contrainte: "Démonstration assumée : le client, les chiffres et le témoignage sont des exemples. Et l’outil devait remplacer des fichiers de suivi sans imposer de ressaisie.",
      architecture: "Application Symfony 7 et Vue 3, données PostgreSQL, cache Redis, services conteneurisés, et l’automatisation déportée dans n8n plutôt que dans l’interface.",
      solution: "Devis, catalogue fournisseurs, facturation et relances réunis dans une seule application, avec les automatisations décrites plutôt que promises.",
      resultat: null,
      automatise: "Les relances J+3, J+7 et J+14 sont écrites comme des règles, pas comme une intention. Les workflows vivent dans n8n : ils se relisent et se rejouent sans toucher au code de l’application."
    },
    name: 'VoyageoPro',
    icon: '✈️',
    category: 'fullstack',
    year: '2025',
    featured: true,
    shortDesc: 'Démonstration (scénario) — plateforme SaaS B2B pour agence de voyage : devis, catalogue fournisseurs, automatisations.',
    fullDesc: 'Scénario de démonstration : le client, les chiffres et le témoignage sont des exemples. Transformation digitale complète d\'une agence de voyage B2B. Passage de 15 fichiers Excel à une plateforme unifiée gérant devis, catalogue de 800+ fournisseurs, facturation et relances automatisées.',
    stack: ['Symfony 7', 'Vue 3', 'PostgreSQL', 'Redis', 'n8n', 'Docker', 'Stripe'],
    features: [
      'Générateur de devis avec calcul de marges',
      'Catalogue 800+ fournisseurs avec tarifs dynamiques',
      'Dashboard analytics temps réel',
      'Automatisations relances J+3/7/14',
      'Facturation Stripe intégrée',
      'Export PDF brandé'
    ],
    learnings: 'Migration de données complexes, workflows métier B2B, intégration paiement.',
    github: null,
    demo: null,
    casestudy: '/voyageo-pro'
  },
  {
    id: 'arkadia',
    // ⭐ LA PREUVE — ajoutée le 26/09/2026. Un écran ne prouve rien ; une
    // contrainte, une décision d’architecture et une source, si.
    // « resultat: null » n’est PAS un oubli : cela veut dire qu’aucune mesure
    // n’existe pour ce projet, et l’interface l’écrit au lieu d’inventer.
    preuve: {
      probleme: "Faire tenir ensemble une communauté de joueurs et une infrastructure de serveurs, quand les deux se pilotent à la main.",
      contrainte: "Les serveurs sont loués chez un hébergeur dont l’API est la seule prise disponible, et la communauté vit sur Discord — deux systèmes qui ne se parlent pas nativement.",
      architecture: "L’API de l’hébergeur est interrogée par un service Node, les événements se propagent vers Discord, les données d’état vivent dans PostgreSQL, et l’ensemble tourne en conteneurs.",
      solution: "Un cluster piloté par API, un bot Discord qui porte l’économie et la modération, et un tableau de bord d’administration unique.",
      resultat: null,
      automatise: "La gestion des serveurs, la modération et les événements communautaires passent par des workflows : on ne redémarre plus un serveur à la main, et une règle de modération s’applique de la même façon à trois heures du matin."
    },
    name: 'ARKADIA FRANCE',
    icon: '🦖',
    category: 'gaming',
    year: '2023-2026',
    featured: true,
    shortDesc: 'Cluster ARK Survival pour une communauté de joueurs, avec Discord actif et infrastructure DevOps complète.',
    fullDesc: 'Cluster de serveurs ARK Survival Ascended animant une communauté active. Infrastructure complète avec API Nitrado, bots Discord, systèmes économiques in-game, et gestion événementielle.',
    stack: ['Nitrado API', 'Discord.js', 'Node.js', 'n8n', 'Docker', 'PostgreSQL'],
    features: [
      'Gestion multi-serveurs via API',
      'Bot Discord avec économie intégrée',
      'Système de modération automatisé',
      'Événements communautaires (Ragnarök)',
      'Dashboard admin personnalisé'
    ],
    learnings: 'Gestion de communauté à grande échelle, automatisation DevOps, et équilibre gameplay.',
    github: null,
    demo: 'https://discord.gg/arkadia',
    casestudy: '/arkadia'
  },
  {
    id: 'myloc',
    // ⭐ LA PREUVE — ajoutée le 26/09/2026. Un écran ne prouve rien ; une
    // contrainte, une décision d’architecture et une source, si.
    // « resultat: null » n’est PAS un oubli : cela veut dire qu’aucune mesure
    // n’existe pour ce projet, et l’interface l’écrit au lieu d’inventer.
    preuve: {
      probleme: "Gérer des biens, des locataires et des contrats dans des documents séparés, où chaque mise à jour manuelle est une occasion d’erreur.",
      contrainte: "La pile était imposée : Symfony 5.4 et PHP 7.4 — donc pas de bibliothèque récente, et une sécurité à écrire soi-même.",
      architecture: "Architecture MVC classique, relations Doctrine entre biens, locataires et contrats, formulaires sécurisés et rendu côté serveur.",
      solution: "Une plateforme de gestion locative avec CRUD complet, tableaux de bord, notifications et export des documents.",
      resultat: null,
      automatise: "Les exports de documents et les notifications sont générés par l’application : le contrat ne se retape plus, il se produit."
    },
    name: 'MyLoc',
    icon: '🏠',
    category: 'symfony',
    year: '2022',
    featured: true,
    shortDesc: 'Application de gestion de locations immobilières avec Symfony 5.4.',
    fullDesc: 'Plateforme complète de gestion locative permettant aux propriétaires de gérer leurs biens, locataires et contrats. Interface moderne avec tableaux de bord et statistiques.',
    stack: ['Symfony 5.4', 'PHP 7.4', 'Twig', 'JavaScript', 'MySQL', 'Bootstrap'],
    features: [
      'CRUD complet pour biens et locataires',
      'Gestion des contrats de location',
      'Tableau de bord avec KPIs',
      'Système de notifications',
      'Export PDF des documents'
    ],
    learnings: 'Architecture MVC avec Symfony, gestion des relations Doctrine, et sécurité des formulaires.',
    github: 'https://github.com/GaetanLgt/myLoc',
    demo: null,
    casestudy: null
  },
  {
    id: 'agents',
    // ⭐ LA PREUVE — ajoutée le 26/09/2026. Un écran ne prouve rien ; une
    // contrainte, une décision d’architecture et une source, si.
    // « resultat: null » n’est PAS un oubli : cela veut dire qu’aucune mesure
    // n’existe pour ce projet, et l’interface l’écrit au lieu d’inventer.
    preuve: {
      probleme: "Faire tourner des automatisations métier sans envoyer les données de l’entreprise chez un fournisseur de cloud.",
      contrainte: "Tout doit rester sur une seule machine, en local : moteur d’orchestration, base vectorielle et modèles de langue compris.",
      architecture: "n8n pour l’orchestration, conteneurs Docker pour l’isolement, ChromaDB pour la recherche documentaire, PostgreSQL pour l’état, Discord pour la surface d’usage.",
      solution: "Une pile d’automatisation souveraine : bot communautaire, surveillance des serveurs, base de connaissances interrogeable et chaîne de production de contenu.",
      resultat: null,
      automatise: "La surveillance et les alertes, l’indexation de la documentation et l’onboarding client : ce qui demandait une personne disponible tourne désormais sans elle."
    },
    name: 'Workflows & Automatisations',
    icon: '🔄',
    category: 'fullstack',
    year: '2025-2026',
    featured: true,
    shortDesc: 'Stack d\'automatisation souveraine : n8n, Discord bots, RAG, monitoring.',
    fullDesc: 'Infrastructure complète de workflows automatisés : bots Discord ARKADIA, monitoring serveurs, knowledge base RAG avec Obsidian/ChromaDB, pipelines de contenu. 100% hébergé localement.',
    stack: ['n8n', 'Docker', 'Nemotron', 'ChromaDB', 'Discord.js', 'PostgreSQL'],
    features: [
      'Bot Discord communautaire',
      'Monitoring & alertes temps réel',
      'RAG sur documentation Obsidian',
      'Pipeline contenu automatisé',
      'Onboarding client workflow'
    ],
    learnings: 'Orchestration de workflows, intégration LLM local, automatisation métier.',
    github: null,
    demo: null,
    casestudy: null
  },
  {
    id: 'mevnstack',
    // ⭐ LA PREUVE — ajoutée le 26/09/2026. Un écran ne prouve rien ; une
    // contrainte, une décision d’architecture et une source, si.
    // « resultat: null » n’est PAS un oubli : cela veut dire qu’aucune mesure
    // n’existe pour ce projet, et l’interface l’écrit au lieu d’inventer.
    preuve: {
      probleme: "Recommencer chaque projet full-stack JavaScript par les mêmes fondations : authentification, structure, état, appels réseau.",
      contrainte: "Aucune dépendance à un cadriciel d’entreprise : la pile devait rester lisible par un seul développeur.",
      architecture: "Séparation stricte client et serveur, API REST, authentification par jeton, état centralisé côté client.",
      solution: "Un squelette de démarrage : authentification, API, structure de fichiers et rechargement à chaud.",
      resultat: null,
      automatise: "Le rechargement en développement et la génération de la structure : le premier jour d’un projet ne se passe plus à recopier le projet précédent."
    },
    name: 'MEVN Stack',
    icon: '🔥',
    category: 'fullstack',
    year: '2021',
    featured: false,
    shortDesc: 'Boilerplate full-stack MongoDB, Express, Vue, Node.',
    fullDesc: 'Template de démarrage rapide pour applications full-stack JavaScript. Architecture RESTful avec authentification JWT et structure de fichiers optimisée.',
    stack: ['Vue.js', 'Node.js', 'Express', 'MongoDB', 'JWT', 'Vuex'],
    features: [
      'Authentification JWT',
      'API RESTful',
      'State management Vuex',
      'Structure modulaire',
      'Hot reload dev'
    ],
    learnings: 'Architecture full-stack JS, sécurité API, et gestion d\'état centralisée.',
    github: 'https://github.com/GaetanLgt/mevnStack',
    demo: null,
    casestudy: null
  },
  {
    id: 'ouvreboites',
    // ⭐ LA PREUVE — ajoutée le 26/09/2026. Un écran ne prouve rien ; une
    // contrainte, une décision d’architecture et une source, si.
    // « resultat: null » n’est PAS un oubli : cela veut dire qu’aucune mesure
    // n’existe pour ce projet, et l’interface l’écrit au lieu d’inventer.
    preuve: {
      probleme: "Un site associatif doit pouvoir être mis à jour par des bénévoles, pas par un développeur.",
      contrainte: "Travail en agence, sur WordPress imposé, avec une séparation nette entre contenu et présentation.",
      architecture: "WordPress et Timber : les gabarits sont écrits en Twig, la logique reste côté PHP, les contenus sont saisis dans l’administration.",
      solution: "Un thème sur mesure avec des champs de saisie adaptés au contenu réel de l’association.",
      resultat: null,
      automatise: null
    },
    name: 'Ouvre-Boîtes',
    icon: '🥫',
    category: 'wordpress',
    year: '2020',
    featured: false,
    shortDesc: 'Site associatif réalisé en stage chez Superdev avec WordPress/Timber.',
    fullDesc: 'Site vitrine pour l\'association Ouvre-Boîtes développé lors de mon stage chez Superdev. Utilisation de WordPress avec le framework Timber pour un templating Twig propre.',
    stack: ['WordPress', 'Timber', 'Twig', 'ACF', 'PHP', 'SCSS'],
    features: [
      'Thème custom Timber/Twig',
      'Champs ACF personnalisés',
      'Design responsive',
      'Optimisation SEO',
      'Formulaires de contact'
    ],
    learnings: 'WordPress avancé, séparation logique/vue avec Twig, et workflow agence.',
    github: 'https://github.com/GaetanLgt/ouvreBoites',
    demo: null,
    casestudy: null
  },
  {
    id: 'chalets',
    // ⭐ LA PREUVE — ajoutée le 26/09/2026. Un écran ne prouve rien ; une
    // contrainte, une décision d’architecture et une source, si.
    // « resultat: null » n’est PAS un oubli : cela veut dire qu’aucune mesure
    // n’existe pour ce projet, et l’interface l’écrit au lieu d’inventer.
    preuve: {
      probleme: "Présenter une offre haut de gamme et permettre une demande de réservation sans friction.",
      contrainte: "Projet de formation : le périmètre et les outils étaient fixés, la qualité de rendu était l’objectif.",
      architecture: "WordPress avec constructeur de pages, galeries optimisées et formulaire de réservation relié à la messagerie.",
      solution: "Un site vitrine orienté conversion, avec des galeries immersives et un parcours de réservation court.",
      resultat: "Projet de formation — aucune mise en production, donc aucun résultat exploitable à citer.",
      automatise: null
    },
    name: 'Chalets & Caviar',
    icon: '🏔️',
    category: 'wordpress',
    year: '2020',
    featured: false,
    shortDesc: 'Projet OpenClassrooms - Site de location de chalets de luxe.',
    fullDesc: 'Projet de formation OpenClassrooms consistant à créer un site WordPress pour une agence fictive de location de chalets haut de gamme. Focus sur le design premium et l\'expérience utilisateur.',
    stack: ['WordPress', 'PHP', 'CSS3', 'JavaScript', 'Elementor'],
    features: [
      'Design premium luxe',
      'Galeries photos immersives',
      'Formulaire de réservation',
      'Pages dynamiques',
      'Responsive design'
    ],
    learnings: 'WordPress page builder, design orienté conversion, et UX de luxe.',
    github: 'https://github.com/GaetanLgt/oc-gl-chalets-et-caviar.gaetan-langlet.fr',
    demo: null,
    casestudy: null
  },
  {
    id: 'symfonycms',
    // ⭐ LA PREUVE — ajoutée le 26/09/2026. Un écran ne prouve rien ; une
    // contrainte, une décision d’architecture et une source, si.
    // « resultat: null » n’est PAS un oubli : cela veut dire qu’aucune mesure
    // n’existe pour ce projet, et l’interface l’écrit au lieu d’inventer.
    preuve: {
      probleme: "Comprendre ce qu’un système de gestion de contenu fait réellement, en le construisant plutôt qu’en le configurant.",
      contrainte: "Développement depuis une base vide : pas de paquet existant, tout est écrit à la main.",
      architecture: "Symfony avec Doctrine, gabarits Twig, authentification et rôles, gestion des médias.",
      solution: "Un CMS léger : articles, catégories, utilisateurs, envoi d’images et bases de référencement.",
      resultat: null,
      automatise: "Les opérations de création, lecture, mise à jour et suppression sont générées par Doctrine : la base ne se modifie pas à la main."
    },
    name: 'SymfonyCMS',
    icon: '📰',
    category: 'symfony',
    year: '2021',
    featured: false,
    shortDesc: 'CMS minimaliste développé from scratch avec Symfony.',
    fullDesc: 'Système de gestion de contenu léger développé avec Symfony. Permet la création d\'articles, la gestion des catégories et l\'administration des utilisateurs.',
    stack: ['Symfony', 'PHP', 'Twig', 'Doctrine', 'MySQL', 'Bootstrap'],
    features: [
      'Gestion d\'articles WYSIWYG',
      'Système de catégories',
      'Authentification admin',
      'Upload d\'images',
      'SEO basique'
    ],
    learnings: 'Création d\'un CMS from scratch, gestion des rôles, et CRUD avancé.',
    github: 'https://github.com/GaetanLgt/SymfonyCMS',
    demo: null,
    casestudy: null
  },
  {
    id: 'gldigitallab',
    // ⭐ LA PREUVE — ajoutée le 26/09/2026. Un écran ne prouve rien ; une
    // contrainte, une décision d’architecture et une source, si.
    // « resultat: null » n’est PAS un oubli : cela veut dire qu’aucune mesure
    // n’existe pour ce projet, et l’interface l’écrit au lieu d’inventer.
    preuve: {
      probleme: "Un studio qui vend de l’architecture doit pouvoir montrer la sienne — sans équipe, sans budget publicitaire, et sans dépendre d’un service qu’il ne maîtrise pas.",
      contrainte: "Hébergement statique en FTP, une seule machine, et aucune donnée de visiteur envoyée à un service externe.",
      architecture: "Vue 3 et Vite, chaque page prérendue en HTML, les données séparées du moteur, une graine rejouable, et un relevé de mesures publié automatiquement.",
      solution: "Le site que vous lisez : contenu séparé du moteur, pages statiques, contrôles automatiques avant publication.",
      resultat: null,
      automatise: "La chaîne de construction complète — vérification des traductions, sitemap, prérendu des pages, puis écriture du relevé de mesures dans le HTML livré."
    },
    name: 'Génie IT Tek FR',
    icon: '💎',
    category: 'vue',
    year: '2026',
    featured: true,
    shortDesc: 'Ce portfolio ! Architecture Vue 3 + Three.js, ambiance émeraude sur fond sombre.',
    fullDesc: 'Portfolio professionnel développé avec Vue 3 Composition API et Three.js. Univers maison : cercle à point central, ambiance émeraude sur fond noir, animations GSAP, SEO optimisé, analytics RGPD-compliant.',
    stack: ['Vue 3', 'Three.js', 'Vite', 'GSAP', 'Matomo', 'O2Switch'],
    features: [
      'Animations Three.js',
      'Design system maison (cercle & émeraude)',
      'SEO optimisé (Schema.org)',
      'Analytics RGPD (Matomo)',
      'Performance Lighthouse 90+'
    ],
    learnings: 'Vue 3 Composition API, WebGL, et stratégie de personal branding.',
    github: null,
    demo: 'https://gldigitallab.fr',
    casestudy: null
  },
  {
    id: 'memory-jeu',
    // ⭐ LA PREUVE — ajoutée le 26/09/2026. Un écran ne prouve rien ; une
    // contrainte, une décision d’architecture et une source, si.
    // « resultat: null » n’est PAS un oubli : cela veut dire qu’aucune mesure
    // n’existe pour ce projet, et l’interface l’écrit au lieu d’inventer.
    preuve: {
      probleme: "Construire un jeu complet à deux, avec un vrai serveur derrière, et des données de jeu qui doivent pouvoir changer sans redéploiement.",
      contrainte: "Travail en binôme : le découpage du travail et la lisibilité du code comptaient autant que le résultat.",
      architecture: "Symfony avec authentification et profils utilisateurs, données de jeu chargées depuis une interface de programmation publique, conteneurisation Docker.",
      solution: "Un jeu de mémoire jouable, avec comptes, progression et cartes chargées dynamiquement.",
      resultat: null,
      automatise: "Le chargement des cartes passe par l’interface de programmation : le contenu du jeu se met à jour sans toucher au code."
    },
    name: 'Memory — jeu de mémoire',
    icon: '🎴',
    category: 'symfony',
    year: '2023',
    featured: false,
    shortDesc: 'Jeu de mémoire développé en Symfony, alimenté par une API de données publique.',
    // Dernière occurrence du nom de franchise retirée le 11/09/2026 : la sentinelle
    // la relevait dans le TEXTE SERVI sur https://gldigitallab.fr/projets (alerte HAUTE).
    // Le nom du projet, son résumé, ses fonctionnalités et le lien GitHub avaient été
    // nettoyés ; `fullDesc` avait été oublié — la page restait donc exposée.
    fullDesc: 'Jeu vidéo de type memory, développé en collaboration avec Julien Holtz. Application Symfony complète avec authentification, profils utilisateurs, et intégration d’une API de données publique pour charger dynamiquement les cartes du jeu.',
    stack: ['Symfony', 'PHP', 'Twig', 'JavaScript', 'SCSS', 'Docker', 'Webpack', 'API REST'],
    features: [
      'Jeu Memory interactif',
      'Intégration d’une API de données externe',
      'Système d\'authentification',
      'Profils utilisateurs',
      'Animations CSS (Animista)',
      'Sound design 8-bit',
      'Docker-ready'
    ],
    learnings: 'Travail collaboratif, intégration API externe, et game design avec Symfony.',
    // Lien retiré le 11/09/2026 : son adresse portait la marque d'une franchise du registre.
    demo: null,
    casestudy: null
  }
]);

// State
const activeFilter = ref('all');
const selectedProject = ref(null);

// Computed
const filteredProjects = computed(() => {
  if (activeFilter.value === 'all') return projects.value;
  return projects.value.filter(p => p.category === activeFilter.value);
});

const uniqueTechs = computed(() => {
  const techs = new Set();
  projects.value.forEach(p => p.stack.forEach(t => techs.add(t)));
  return Array.from(techs);
});

// ⭐ LES COMPTES SONT CALCULÉS, JAMAIS ÉCRITS. Un chiffre écrit à la main dans
// une page devient faux le jour où la liste change, sans rien dire. Ceux-ci ne
// peuvent pas mentir : ils comptent la liste qui les affiche.
const projetsAvecCas = computed(() => projects.value.filter(p => p.casestudy));

// Le relevé du build : trois mesures, chacune gardant son plafond quand il existe.
// Un plafond sans valeur mesurée ne s’affiche pas — on ne montre pas un seuil vide.
const mesuresBuild = computed(() => {
  const b = etatDuStudio || {};
  const lourde = b.page_la_plus_lourde || {};
  const req = b.requetes_premier_chargement || {};
  return {
    pages: typeof b.pages_prerendues === 'number' ? b.pages_prerendues : null,
    poids: typeof lourde.ko_servis === 'number' ? lourde.ko_servis : null,
    seuilPoids: typeof lourde.seuil_ko === 'number' ? lourde.seuil_ko : null,
    requetes: typeof req.total === 'number' ? req.total : null,
    seuilRequetes: typeof req.seuil === 'number' ? req.seuil : null,
  };
});

// Methods
function getCountByCategory(categoryId) {
  return projects.value.filter(p => p.category === categoryId).length;
}

function getCategoryName(categoryId) {
  const cat = categories.find(c => c.id === categoryId);
  return cat ? cat.name : categoryId;
}

function openProject(project) {
  selectedProject.value = project;
  document.body.style.overflow = 'hidden';
}

function closeProject() {
  selectedProject.value = null;
  document.body.style.overflow = '';
}

// ⛔ ÉCHAP FERME LA FICHE. Sans cela, la fiche était un piège : le visiteur
// au clavier ne pouvait en sortir qu’en tabulant jusqu’au bout de l’écran,
// et le `body` restait figé en `overflow: hidden` si l’onglet changeait.
// L’écouteur est posé au montage et RETIRÉ au démontage — un écouteur
// global qu’on oublie de retirer est une fuite qui ne dit pas son nom.
function surTouche(e) {
  if (e.key === 'Escape' && selectedProject.value) closeProject();
}

onMounted(() => {
  window.addEventListener('keydown', surTouche);
});

onUnmounted(() => {
  window.removeEventListener('keydown', surTouche);
  document.body.style.overflow = '';
});
</script>

<style scoped>
.projects-page {
  padding-top: 80px;
  /* Fix: assurer que sticky fonctionne */
  overflow: visible;
}

/* HERO */
.projects-hero {
  padding: var(--space-xl) 0;
  background: linear-gradient(180deg, var(--surface) 0%, var(--bg) 100%);
}

.projects-hero__content {
  max-width: 700px;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: var(--primary-soft);
  border: 1px solid rgba(42, 191, 255, 0.2);
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

.projects-hero__title {
  font-size: clamp(2.5rem, 7vw, 4rem);
  font-weight: 700;
  line-height: 1.1;
  margin-bottom: var(--space-md);
}

.projects-hero__desc {
  font-size: 1.1rem;
  color: var(--text-muted);
  line-height: 1.7;
  margin-bottom: var(--space-lg);
}

.projects-stats {
  display: flex;
  gap: 2rem;
}

.projects-stat {
  display: flex;
  flex-direction: column;
}

.projects-stat__value {
  font-family: 'JetBrains Mono', monospace;
  font-size: 2rem;
  font-weight: 700;
  color: var(--primary);
}

.projects-stat__label {
  font-size: 0.8rem;
  color: var(--text-dark);
}

/* FILTERS - Position normale (scroll avec le contenu) */
.projects-filters {
  padding: var(--space-md) 0;
  border-bottom: 1px solid var(--border);
  background: var(--bg);
}

.filters-wrapper {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.filter-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1rem;
  background: transparent;
  border: 1px solid var(--border);
  border-radius: 2rem;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.75rem;
  color: var(--text-muted);
  cursor: pointer;
  transition: all 0.2s ease;
}

.filter-btn:hover {
  border-color: var(--primary);
  color: var(--primary);
}

.filter-btn.active {
  background: var(--primary);
  border-color: var(--primary);
  color: var(--bg);
}

.filter-count {
  padding: 0.15rem 0.4rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 1rem;
  font-size: 0.65rem;
}

.filter-btn.active .filter-count {
  background: rgba(0, 0, 0, 0.2);
}

/* GRID */
.projects-grid-section {
  padding: var(--space-xl) 0;
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: var(--space-md);
}

/* CARD */
.project-card {
  padding: 1.5rem;
  border-radius: 1rem;
  border: 1px solid var(--border);
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
}

.project-card:hover {
  border-color: var(--rule-strong);
  transform: translateY(-4px);
  box-shadow: var(--shadow-md);
}

.project-card__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.project-card__icon {
  font-size: 2.5rem;
}

.project-card__badges {
  display: flex;
  gap: 0.5rem;
}

.badge {
  padding: 0.25rem 0.6rem;
  border-radius: 2rem;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.6rem;
  background: var(--surface);
  border: 1px solid var(--rule);
  color: var(--text-muted);
}

/* DS clair (D1) : les variantes colorées étaient illisibles sur papier
   (1,4-3:1). Toutes les pastilles deviennent neutres et AA — le contenu
   (emoji, texte) porte l'information, pas la couleur. */
.badge--featured {
  background: var(--surface);
  border-color: var(--rule-strong);
  color: var(--ink);
  font-weight: 700;
}

.badge--symfony,
.badge--vue,
.badge--wordpress,
.badge--gaming,
.badge--fullstack {
  background: var(--surface);
  border-color: var(--rule);
  color: var(--ink-soft);
}

.project-card__content {
  flex: 1;
  margin-bottom: 1rem;
}

.project-card__title {
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
}

.project-card__desc {
  font-size: 0.85rem;
  color: var(--text-muted);
  line-height: 1.6;
}

.project-card__stack {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
  margin-bottom: 1rem;
}

.tech-tag {
  padding: 0.25rem 0.5rem;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 4px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.6rem;
  color: var(--text-dark);
}

.tech-tag--more {
  background: var(--surface);
  border-color: var(--rule);
  color: var(--ink-soft);
}

.project-card__footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  border-top: 1px solid var(--border);
}

.project-card__date {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.7rem;
  color: var(--text-dark);
}

.project-card__action {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.7rem;
  color: var(--ink-soft);
}

/* MODAL */
.project-modal {
  position: fixed;
  inset: 0;
  z-index: 999999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(8px);
  cursor: pointer; /* Indique qu'on peut cliquer pour fermer */
}

.project-modal__content {
  position: relative;
  width: 100%;
  max-width: 700px;
  max-height: 90vh;
  overflow-y: auto;
  padding: 2rem;
  border-radius: 1rem;
  border: 1px solid var(--border);
  background: var(--bg);
  cursor: default; /* Curseur normal dans le contenu */
}

.project-modal__close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 50%;
  color: var(--text-muted);
  cursor: pointer;
  transition: all 0.2s;
  z-index: 10;
}

.project-modal__close:hover {
  border-color: var(--primary);
  color: var(--primary);
}

.project-modal__header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.project-modal__icon {
  font-size: 3rem;
}

.project-modal__title {
  font-size: 1.75rem;
  margin-bottom: 0.25rem;
}

.project-modal__category {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.75rem;
  color: var(--primary);
}

.project-modal__desc {
  font-size: 1rem;
  color: var(--text-muted);
  line-height: 1.7;
  margin-bottom: 1.5rem;
}

.project-modal__features,
.project-modal__stack,
.project-modal__learnings {
  margin-bottom: 1.5rem;
}

.project-modal__features h3,
.project-modal__stack h3,
.project-modal__learnings h3 {
  font-size: 0.85rem;
  color: var(--primary);
  margin-bottom: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.project-modal__features ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.project-modal__features li {
  position: relative;
  padding: 0.5rem 0 0.5rem 1.5rem;
  font-size: 0.9rem;
  color: var(--text-muted);
}

.project-modal__features li::before {
  content: '→';
  position: absolute;
  left: 0;
  color: var(--primary);
}

.project-modal__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tech-tag--large {
  padding: 0.4rem 0.75rem;
  font-size: 0.7rem;
}

.project-modal__learnings p {
  font-size: 0.9rem;
  color: var(--text-muted);
  line-height: 1.6;
  font-style: italic;
}

.project-modal__links {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--border);
}

.project-modal__link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 0.5rem;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.75rem;
  color: var(--text-muted);
  text-decoration: none;
  transition: all 0.2s;
}

.project-modal__link:hover {
  border-color: var(--primary);
  color: var(--primary);
}

.project-modal__link--primary {
  background: var(--primary);
  border-color: var(--primary);
  color: var(--bg);
}

.project-modal__link--primary:hover {
  background: var(--primary-dark);
  color: var(--bg);
}

/* CTA */
.projects-cta {
  padding: var(--space-xl) 0;
}

.projects-cta__box {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2.5rem;
  border-radius: 1rem;
  border: 1px solid var(--border);
}

.projects-cta__content h2 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

.projects-cta__content p {
  color: var(--text-muted);
}

.projects-cta__btn {
  padding: 1rem 2rem;
  background: var(--primary);
  color: var(--bg);
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.75rem;
  font-weight: 700;
  text-decoration: none;
  border-radius: 0.5rem;
  transition: all 0.2s;
}

.projects-cta__btn:hover {
  background: var(--primary-dark);
  box-shadow: 0 0 20px rgba(42, 191, 255, 0.4);
}

/* TRANSITIONS */
.projects-enter-active,
.projects-leave-active {
  transition: all 0.3s ease;
}

.projects-enter-from,
.projects-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-active .project-modal__content,
.modal-leave-active .project-modal__content {
  transition: transform 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .project-modal__content,
.modal-leave-to .project-modal__content {
  transform: scale(0.95) translateY(20px);
}

/* RESPONSIVE */
@media (max-width: 768px) {
  .projects-stats {
    gap: 1.5rem;
  }
  
  .projects-stat__value {
    font-size: 1.5rem;
  }
  
  .projects-grid {
    grid-template-columns: 1fr;
  }
  
  .projects-cta__box {
    flex-direction: column;
    text-align: center;
    gap: 1.5rem;
  }
  
  .project-modal__header {
    flex-direction: column;
    text-align: center;
  }
}

/* ═══════════════════════════════════════════════════════════════════════════
   LA GRILLE DE PREUVE — 26/09/2026. Ajoutée en fin de bloc, jamais répartie
   dans l’existant. Les couleurs viennent des jetons déjà déclarés dans
   src/assets/styles/variables.css : aucune valeur nouvelle n’est introduite.
   ═══════════════════════════════════════════════════════════════════════════ */

.project-card__auto {
  margin: 0.5rem 0 0;
  font-size: 0.82rem;
  line-height: 1.55;
  color: var(--text-muted);
}

.project-card__auto-tag {
  display: inline-block;
  margin-right: 0.4rem;
  padding: 0.05rem 0.45rem;
  border: 1px solid var(--border-hover);
  border-radius: 999px;
  font-family: var(--font-mono);
  font-size: 0.66rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--primary-light);
}

.project-card[role="button"]:focus-visible {
  outline: 3px solid var(--primary);
  outline-offset: 3px;
}

.preuve-etapes {
  display: grid;
  gap: 0.9rem;
  margin: 1.25rem 0 1.5rem;
}

.preuve-etape {
  padding: 0.9rem 1rem;
  border: 1px solid var(--border);
  border-left: 3px solid var(--primary);
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.18);
}

.preuve-etape h3 {
  margin: 0 0 0.4rem;
  font-family: var(--font-mono);
  font-size: 0.74rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--primary-light);
}

.preuve-etape p {
  margin: 0;
  font-size: 0.93rem;
  line-height: 1.6;
  color: var(--text-muted);
}

.preuve-etape__note {
  margin-top: 0.55rem !important;
  font-size: 0.78rem !important;
}

.preuve-etape__absent {
  font-style: italic;
}

.preuve-etape--releve {
  border-left-color: var(--action);
}

.preuve-etape--releve h3 {
  color: var(--action);
}

.preuve-releve {
  margin: 0.4rem 0 0;
  padding-left: 1.1rem;
  font-size: 0.9rem;
  line-height: 1.7;
  color: var(--text-muted);
}

@media (max-width: 640px) {
  .preuve-etape {
    padding: 0.8rem 0.85rem;
  }
}

</style>
