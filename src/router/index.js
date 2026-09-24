import { createRouter, createWebHistory } from 'vue-router';

// ============================================================================
// IMPORTS - Organisation par catégorie
// ============================================================================

// CORE - Pages principales (HomePage chargée immédiatement)
import HomePage from '@/views/core/HomePage.vue';
const ContactPage = () => import('@/views/core/ContactPage.vue');
const SitemapPage = () => import('@/views/core/SitemapPage.vue');
const NotFound = () => import('@/views/core/NotFound.vue');
// Page listant les applications (créée le 10/09/2026) : les 7 pages d'apps portaient un
// lien « ← Retour aux Apps » vers /apps, une adresse qui n'existait pas — en ligne elle
// répondait 403, donc les sept boutons de retour menaient à une erreur.
const AppsPage = () => import('@/views/core/AppsPage.vue');
// L'ÉTAT DU STUDIO (19/09/2026) — le relevé du présent.
const EtatStudioPage = () => import('@/views/core/EtatStudioPage.vue');
// CE QUE NOUS NOUS IMPOSONS (19/09/2026) — les règles que le studio se donne.
const CeQueNousNousImposonsPage = () => import('@/views/core/CeQueNousNousImposonsPage.vue');
// L'ARMATURE (19/09/2026) — le projet de jeu montré en cours de route.
const ArmurePage = () => import('@/views/core/ArmurePage.vue');

// SERVICES - Offres et solutions
const ServicesPage = () => import('@/views/services/ServicesPage.vue');
const ProjectsPage = () => import('@/views/services/ProjectsPage.vue');

// PARCOURS - Histoire et parcours
/* ⚠️ L'IMPORT DE HolisticMapPage EST RETIRÉ AVEC LA ROUTE.
   *Un import de composant que plus aucune route ne sert est du poids mort dans le
   paquet — et le bundler ne peut pas toujours le voir.* */

// PROJECTS - Case studies
const ArkadiaCase = () => import('@/views/projects/ArkadiaCase.vue');
const VoyageoProCase = () => import('@/views/projects/VoyageoProCase.vue');

// LEGAL - Pages légales
const MentionsLegales = () => import('@/views/legal/MentionsLegales.vue');
const Confidentialite = () => import('@/views/legal/Confidentialite.vue');
const CGV = () => import('@/views/legal/CGV.vue');

// GUIDES — les dix pages du test éditorial instrumenté (24/09/2026).
// ⭐ UN SEUL COMPOSANT POUR DIX PAGES, ET LES ROUTES SONT ENGENDRÉES PAR LES DONNÉES.
//    ⛔ Dix blocs de route écrits à la main divergeraient du contenu à la première
//       correction — c'est la loi « une seule liste, ou elle pourrit ».
//    ⇒ `src/data/guides.js` porte le CONTENU ; ce fichier en dérive les routes, les
//      titres et les descriptions. **Ajouter un guide crée sa page.**
import { GUIDES } from '@/data/guides.js';
const GuidePage = () => import('@/views/guides/GuidePage.vue');
const GuidesIndex = () => import('@/views/guides/GuidesIndex.vue');
const routesGuides = [
  // ⭐ LA PORTE D'ENTRÉE. Elle est accrochée au PIED DE PAGE, donc présente sur les
  //    trente-deux pages du site — c'est ce qui fait d'elle un relais et pas un fil.
  { path: '/guides', name: 'GuidesIndex', component: GuidesIndex,
    meta: { title: 'Dix questions, dix réponses courtes | Génie IT Tek FR',
            description: "Prix d'un site, hébergement en France, audit, IA locale, délai, propriété du code : dix réponses de 40 à 90 mots, avec les prix publics hors taxes." } },
  ...GUIDES.map((g) => ({
    path: `/guides/${g.slug}`,
    name: `Guide-${g.slug}`,
    component: GuidePage,
    meta: {
      title: g.title,
      description: g.description,
      // ⚠️ Le slug EST la donnée dont le composant a besoin pour se trouver lui-même.
      //    Le passer par `meta` évite de le relire dans l'URL — donc de dépendre de la
      //    forme du chemin le jour où on le change.
      guideSlug: g.slug,
    },
  })),
];

// RESOURCES - Ressources et tutoriels
const TutorielsPage = () => import('@/views/resources/TutorielsPage.vue');
const ComponentsLibrary = () => import('@/views/resources/components-library/ComponentsLibrary.vue');

// MODÈLES — les gabarits vendables du studio.
// ⭐ Construit le 22/09/2026 en « tranche verticale » : un seul modèle, entier et
// mesuré, plutôt que vingt annoncés. Doctrine du studio : *« tant que cette
// tranche n'existe pas, l'offre n'est pas vendable. »*
// ⛔ Rien d'un tiers n'y entre : boutique, objets, textes et pictogrammes sont
// inventés, et les couleurs viennent des jetons de `variables.css`.
const ModeleBorealBoutique = () => import('@/views/modeles/ModeleBorealBoutique.vue');

// TOOLS - Outils admin
// /ark-admin retirée du build le 11/09/2026 (décision Gaëtan) — voir la section TOOLS.

// ÉQUIPAGE - Outils des Agents IA (7 conservés, accès direct)
const WaRouter = () => import(/* webpackChunkName: "apps-agents" */ '@/views/apps/WaRouter.vue');
const MakotoScanner = () => import(/* webpackChunkName: "apps-agents" */ '@/views/apps/MakotoScanner.vue');
const DouMonitor = () => import(/* webpackChunkName: "apps-agents" */ '@/views/apps/DouMonitor.vue');
const WatashiKnowledgeBase = () => import(/* webpackChunkName: "apps-agents" */ '@/views/apps/WatashiKnowledgeBase.vue');
const JitsuPipeline = () => import(/* webpackChunkName: "apps-agents" */ '@/views/apps/JitsuPipeline.vue');
const SeoContentGenerator = () => import(/* webpackChunkName: "apps" */ '@/views/apps/SeoContentGenerator.vue');
const InvoiceGenerator = () => import(/* webpackChunkName: "apps" */ '@/views/apps/InvoiceGenerator.vue');

// FORMATION — section abandonnée (décision Gaëtan du 10/09/2026).
// Historique, pour qui se demanderait où elle est passée :
//   · 10/09 — imports retirés. Les quatre composants (FormationHub, FormationDetail,
//     FormationPath, ChallengesHub) n'étaient référencés que par le bloc de routes ;
//     vérifié avant retrait : 0 occurrence hors de ce fichier.
//   · 11/09 — le bloc de 4 routes, DÉJÀ ENTIÈREMENT COMMENTÉ depuis le « masquage
//     temporaire (droits en attente) », a été supprimé à son tour. Il ne servait rien :
//     du code mort dans un commentaire n'est pas du code — et il faussait le comptage
//     des routes, qui annonçait 29 là où le routeur en déclare 25.
// Le contenu source est archivé, pas perdu : modeles/archives/formation-2026-09-10/.
// Le `Disallow: /formation` de robots.txt a été retiré en même temps : un Disallow sur
// un chemin qui n'existe plus est un vestige, pas une protection.

// ============================================================================
// ROUTES
// ============================================================================

const routes = [
  // ⭐ LES DIX GUIDES, EN TÊTE — et ce n'est pas cosmétique : la route attrape-tout
  //    (`/:pathMatch(.*)*`) vit plus bas, et tout ce qu'on place après elle devient
  //    inatteignable. *Une route morte n'est pas une route : c'est une ligne.*
  ...routesGuides,
  // -------------------------------------------------------------------------
  // CORE
  // -------------------------------------------------------------------------
  {
    path: '/',
    name: 'Home',
    component: HomePage,
    meta: { 
      // Baseline assumée (décision Gaëtan, 11/09/2026) : elle était portée par og:title
      // et par le JSON-LD, mais ni par le <title> servi ni par le titre de route — trois
      // formulations coexistaient pour une même page. Le nom du studio ne change pas
      // (D12) : c'est la baseline qui reprend sa place ici.
      title: 'Architecture Numérique Souveraine',
      description: 'Sites web, applications métier et agents d\'IA exécutés sur notre propre machine, dans la Somme. Vos données restent dans la cale. Audit 48 h, réponse sous 24 h.'
    }
  },
  {
    path: '/dossier',
    name: 'Dossier',
    // Chargement différé : cette page est sobre et rarement visitée, elle n'a
    // pas à peser sur le paquet initial du site.
    component: () => import('@/views/core/DossierPage.vue'),
    meta: {
      title: 'Dossier professionnel | Prestations, prix, méthode et limites',
      description: 'Prestations, prix publics hors taxes, délais, méthode et limites assumées de Génie IT Tek FR, studio indépendant dans la Somme. Document imprimable, sans animation.'
    }
  },
  // ── MODÈLES : le gabarit vendable, en tranche verticale ──────────────────
  {
    path: '/modeles/boutique-boreal',
    name: 'ModeleBorealBoutique',
    // UNE SEULE ROUTE POUR CINQ MARCHES, ET C'EST DÉLIBÉRÉ.
    // La vitrine, le catalogue, la fiche produit, le panier et la commande vivent
    // dans l'état local et le fragment d'adresse (`#catalogue`, `#fiche/<id>`,
    // `#panier`, `#commande` : liens directs qui marchent).
    // Cinq routes séparées auraient eu besoin de cinq entrées au routeur, au
    // prérendu et à la topographie — cinq occasions de divergence, pour un seul
    // modèle. *On ne multiplie pas les portes quand une suffit.*
    // ⚠️ `topographie.js` est la source du PLAN DE SITE, pas le routeur : sans
    //   entrée là-bas, `verifier-topographie.mjs` rend une NOTE non bloquante.
    //   Le prérendu, lui, lit le routeur : la page SERA prérendue. La note est
    //   assumée tant que la publication de ces modèles au sitemap n'est pas décidée.
    component: ModeleBorealBoutique,
    meta: {
      title: 'Modèle de boutique — démonstration Atelier Boréal | Génie IT TeK FR',
      description: 'Démonstration d\'un modèle de boutique : catalogue filtrable, fiche produit, panier persistant et tunnel de commande simulé — aucun paiement, aucune donnée transmise. Navigation clavier et manette Xbox.'
    }
  },
  // Catalogue — une VRAIE adresse, pas un fragment d’ancre.
  // ⭐ « Le garde-fou qui gère qu’une seule route à la fois… tu le dégages. »
  //   (Gaëtan, 22/09/2026) — un panier en `#panier` ne s’indexe pas, ne se
  //   partage pas, ne s’achète pas. Un modèle vendable a des adresses.
  {
    path: '/modeles/boutique-boreal/catalogue',
    name: 'ModeleBorealCatalogue',
    component: ModeleBorealBoutique,
    meta: {
      title: 'Catalogue — modèle de boutique Atelier Boréal | Génie IT TeK FR',
      description: 'Catalogue filtrable et triable du modèle de boutique Atelier Boréal : 13 objets, 4 catégories, aucune ressource externe.',
    }
  },
  // Fiche produit — une VRAIE adresse, pas un fragment d’ancre.
  // ⭐ « Le garde-fou qui gère qu’une seule route à la fois… tu le dégages. »
  //   (Gaëtan, 22/09/2026) — un panier en `#panier` ne s’indexe pas, ne se
  //   partage pas, ne s’achète pas. Un modèle vendable a des adresses.
  {
    path: '/modeles/boutique-boreal/produit/:id',
    name: 'ModeleBorealProduit',
    component: ModeleBorealBoutique,
    meta: {
      title: 'Fiche produit — modèle de boutique Atelier Boréal | Génie IT TeK FR',
      description: 'Fiche produit du modèle de boutique Atelier Boréal : variantes, quantité, ajout au panier persistant.',
    }
  },
  // Panier — une VRAIE adresse, pas un fragment d’ancre.
  // ⭐ « Le garde-fou qui gère qu’une seule route à la fois… tu le dégages. »
  //   (Gaëtan, 22/09/2026) — un panier en `#panier` ne s’indexe pas, ne se
  //   partage pas, ne s’achète pas. Un modèle vendable a des adresses.
  {
    path: '/modeles/boutique-boreal/panier',
    name: 'ModeleBorealPanier',
    component: ModeleBorealBoutique,
    meta: {
      title: 'Panier — modèle de boutique Atelier Boréal | Génie IT TeK FR',
      description: 'Panier persistant du modèle de boutique Atelier Boréal : quantités, suppression, sous-total et livraison.',
    }
  },
  // Commande simulée — une VRAIE adresse, pas un fragment d’ancre.
  // ⭐ « Le garde-fou qui gère qu’une seule route à la fois… tu le dégages. »
  //   (Gaëtan, 22/09/2026) — un panier en `#panier` ne s’indexe pas, ne se
  //   partage pas, ne s’achète pas. Un modèle vendable a des adresses.
  {
    path: '/modeles/boutique-boreal/commande',
    name: 'ModeleBorealCommande',
    component: ModeleBorealBoutique,
    meta: {
      title: 'Commande simulée — modèle de boutique Atelier Boréal | Génie IT TeK FR',
      description: 'Tunnel de commande SIMULÉ du modèle de boutique Atelier Boréal : coordonnées, livraison, récapitulatif. Aucun paiement, aucune donnée transmise.',
    }
  },
  {
    path: '/contact',
    name: 'Contact',
    component: ContactPage,
    meta: { 
      // « Diagnostic » et non « audit » : le site appelait « audit » DEUX choses
      // différentes — le rendez-vous gratuit de 30 min (l'entrée) et la prestation
      // payante livrée en 48 h (le produit). Deux choses, un seul mot : le prospect
      // ne savait pas ce qu'il réservait. Décision Gaëtan, 11/09/2026.
      title: 'Contact | Diagnostic 30 min gratuit',
      description: 'Parlons de votre projet : premier échange gratuit de 30 minutes, sans engagement. Réponse sous 24h. Sites web, applications métier et IA locale pour PME.'
    }
  },
  {
    path: '/liens',
    name: 'Liens',
    // Page de liens du studio (10/09/2026) : elle remplace le « Linktree » que les
    // fiches de communication prescrivaient — un service tiers qui hébergerait nos
    // liens, contre la doctrine local-first du studio. Ses quatre cibles sont des
    // pages QUI EXISTENT DÉJÀ : aucun lien mort, c'est la raison de ce choix.
    component: () => import('@/views/core/LiensPage.vue'),
    meta: {
      title: 'Liens | Audit WordPress 48 h, projets, prestations | Génie IT Tek FR',
      description: 'Tous les liens du studio en un seul endroit : audit WordPress 48 h, projets et études de cas, prestations et prix publiés, contact. Page hébergée chez nous, sans traqueur ni service tiers.'
    }
  },
  {
    path: '/sitemap',
    name: 'SitemapPage',
    component: SitemapPage,
    meta: { 
      title: 'Plan du Site | Carte Applicative',
      description: 'Explorez l\'ensemble des pages et applications du portfolio Génie IT Tek FR. Arborescence complète du site.'
    }
  },
  {
    // LA SOUTE — la zone optionnelle du cadrage « site comme un métroidvania »
    // (13/09/2026, décision Gaëtan). Rôle : donner la CARTE COMPLÈTE des compartiments
    // du site à qui est venu voir, y compris ceux qui ne sont annoncés nulle part.
    //
    // ⚠️ C'EST UNE PAGE ORDINAIRE, ET C'EST DÉLIBÉRÉ. Elle est liée depuis le plan du
    // site et depuis le pied de page : un moteur de recherche et un lecteur d'écran
    // l'atteignent normalement. Le « tuyau vert » du hero n'est qu'une façon AMUSANTE
    // d'y arriver — jamais la seule. Un contenu atteignable uniquement par l'exploration
    // n'existe ni pour une machine ni pour un lecteur d'écran, et le studio verrouille
    // le SEO (100) et l'accessibilité (axe 0).
    path: '/soute',
    name: 'Soute',
    component: () => import('@/views/core/SoutePage.vue'),
    meta: {
      title: 'La soute | La carte complète du navire | Génie IT Tek FR',
      description: 'Tous les compartiments du site au même endroit : ce que la navigation montre, et ce qu\'elle ne montrait pas. Rien n\'est verrouillé, la progression ne quitte pas votre navigateur.'
    }
  },

  {
    // L'IA DE BORD (19/09/2026) — le poste de l'assistante du navire.
    //
    // POURQUOI CETTE PAGE EXISTE. Le site racontait déjà une fiction navale complète :
    // la passerelle, la salle des machines, la soute, la capitainerie, le dossier de
    // bord. Il manquait la pièce qui relie le récit à la méthode — l'intelligence qui
    // vit à bord, à qui le capitaine parle, et dont on peut dire honnêtement ce qu'elle
    // fait ET ce qu'elle ne fait pas.
    //
    // ⚠️ PAGE ORDINAIRE, LIÉE DEPUIS LE PLAN DU SITE ET LE PIED DE PAGE. Même règle
    // qu'à `/soute` : un contenu atteignable seulement par un chemin non balisé
    // n'existe ni pour un lecteur d'écran ni pour un moteur de recherche, et le studio
    // verrouille l'accessibilité (axe 0) et le SEO (100).
    //
    // ⚠️ RIEN D'INTERNE DANS LE CONTENU RENDU : ni numéro de port, ni nom de fichier,
    // ni nom de modèle, ni version logicielle, ni nom de franchise. Le verrou
    // juridique de `scripts/verifier-verrous.mjs` lit le composant entier, commentaires
    // retirés — les mentions internes gardent le droit d'exister, pas de s'afficher.
    path: '/ia-de-bord',
    name: 'IaDeBord',
    component: () => import('@/views/core/IaDeBordPage.vue'),
    meta: {
      title: 'L\'IA de bord | La pièce qui parle, ses sept postes et ses limites',
      description: 'L\'intelligence qui vit à bord : la voix locale du capitaine, sept postes aux périmètres séparés, la mémoire du navire, quatre verrous mesurés — et trois limites dites franchement.'
    }
  },

  {
    // L'ÉTAT DU STUDIO (19/09/2026) — le présent réel, mesuré, et seulement lui.
    //
    // POURQUOI CETTE PAGE EXISTE. Gaëtan a demandé « un site vivant qui réagit en temps
    // réel, pas un site statique ou mort ». La réponse du studio n'est pas un compteur
    // qui s'agite : c'est une page qui dit ce qui est VRAI maintenant — le commit livré,
    // la minute du build, le verdict réel des contrôles du dépôt, et qui est venu nous
    // lire. La règle qui la commande, écrite dans son en-tête : *une pastille verte qui
    // clignote sans rien mesurer est pire qu'une page statique, parce qu'elle ajoute le
    // mensonge à l'immobilité.*
    //
    // ⚠️ PAGE ORDINAIRE, LIÉE DEPUIS LE PLAN DU SITE ET LE PIED DE PAGE. Même règle
    // qu'à `/soute` et `/ia-de-bord` : un contenu atteignable seulement par un chemin
    // non balisé n'existe ni pour un lecteur d'écran ni pour un moteur de recherche.
    //
    // ⚠️ SES CHIFFRES SONT PRÉRENDUS. La page importe le relevé écrit au build par
    // `scripts/generer-etat.mjs` (`src/data/etat-studio.json`) : les nombres sont donc
    // dans le HTML livré, lisibles sans exécuter de JavaScript. Le complément vivant —
    // les passages des moteurs d'IA — vient de `public/api/etat.php`, qui ne rend que
    // des compteurs agrégés : aucune adresse, aucun chemin de page, aucun agent brut.
    //
    // ⚠️ RIEN D'INTERNE DANS LE CONTENU RENDU : ni numéro de port, ni nom de fichier,
    // ni nom de modèle, ni version logicielle, ni nom de franchise. Les services sont
    // décrits par leur RÔLE, jamais par leur architecture réseau.
    path: '/etat-du-studio',
    name: 'EtatDuStudio',
    component: EtatStudioPage,
    meta: {
      title: 'L\'état du studio | Le relevé du présent, mesuré et daté',
      description: 'Le studio en ce moment : commit livré, horodatage du build, pages prérendues, poids, requêtes, verdict des cinq contrôles du dépôt — et les moteurs d\'IA qui sont venus nous lire. Chaque chiffre porte son heure, et ce qui n\'est pas mesuré le dit.'
    }
  },

  {
    // CE QUE NOUS NOUS IMPOSONS (19/09/2026) — les règles que le studio se donne.
    //
    // POURQUOI CETTE PAGE EXISTE. Trois pièces d'actualité sont arrivées le même jour : une
    // étude économique sur des projets d'intelligence artificielle qui ne passent pas
    // l'échelle, un argumentaire promettant une plateforme qui centralise tout, et le récit
    // public d'une fuite de données massive. La consigne du dirigeant : « on peut faire
    // quelque chose par rapport à ça », et « nous on se confine par rapport à eux ».
    //
    // ⚠️ CE N'EST PAS UN COMMENTAIRE D'ACTUALITÉ. Un article réagirait à chaud et
    // vieillirait en une semaine. Ce qui est publié ici est une RÈGLE DE TRAVAIL DATÉE :
    // ce que le studio refuse, ce qu'il s'impose, ce qu'il a raté, et ce que rien de tout
    // cela ne garantit — dont un point qu'il reconnaît NE PAS appliquer encore.
    //
    // ⛔ CE QUE CETTE PAGE NE CONTIENT PAS, ET NE CONTIENDRA PAS : le nom de la société
    // victime de la fuite, aucun chiffre de cette fuite, ni le nom ni l'adresse du lieu où
    // les données se vendent, et AUCUN LIEN entre l'argumentaire commercial et la fuite —
    // suggérer un rapport serait une allégation. Le pré-print cité (Solé et Ruffini) est
    // donné avec son identifiant ET son statut non évalué par les pairs, avant l'usage
    // qu'on en fait.
    //
    // ⚠️ PAGE ORDINAIRE, LIÉE DEPUIS LE PIED DE PAGE. Même règle qu'à `/soute`,
    // `/ia-de-bord` et `/etat-du-studio` : un contenu atteignable seulement par un chemin
    // non balisé n'existe ni pour un lecteur d'écran ni pour un moteur de recherche.
    //
    // ⚠️ RIEN D'INTERNE DANS LE CONTENU RENDU : ni numéro de port, ni nom de fichier, ni
    // nom de modèle, ni version logicielle, ni nom de franchise. Les contrôles automatiques
    // y sont décrits par ce qu'ils vérifient, jamais par le fichier qui les porte.
    path: '/ce-que-nous-nous-imposons',
    name: 'CeQueNousNousImposons',
    component: CeQueNousNousImposonsPage,
    meta: {
      title: 'Ce que nous nous imposons | Nos règles, nos limites',
      description: 'Ce que ce studio s\'interdit et pourquoi : pas de plateforme qui centralise vos données, aucun chiffre sans source ni date, aucune décision déléguée. Avec les règles qu\'il tient, celles qu\'il ne tient pas encore, et ce que rien de tout cela ne garantit.'
    }
  },

  {
    // L'ARMATURE (19/09/2026) — le projet de jeu du studio, montré en cours de route.
    //
    // POURQUOI CETTE PAGE EXISTE. Le studio a ouvert un projet de jeu le 19/09/2026 : une
    // exo-combinaison blindée motorisée portée par son propre personnage. Le jour même, il
    // a produit deux documents de travail et une planche de conception — et **rien de tout
    // cela n'était atteignable depuis le site**. Cette page est la porte.
    //
    // ⚠️ PAGE ORDINAIRE, LIÉE DEPUIS LE PIED DE PAGE. Même règle qu'à `/soute`,
    // `/ia-de-bord`, `/etat-du-studio` et `/ce-que-nous-nous-imposons` : un contenu
    // atteignable seulement par un chemin non balisé n'existe ni pour un lecteur d'écran
    // ni pour un moteur de recherche.
    //
    // ⛔ CE QU'ELLE NE CONTIENT PAS, ET NE CONTIENDRA PAS : aucun nom de franchise, de
    // marque, de personnage protégé ni d'artiste — l'œuvre de tiers qui a servi de point
    // de départ est DÉCRITE en mots, jamais nommée, jamais servie ; aucune image d'un
    // autre (la seule image de la page est la planche produite par le studio) ; aucun nom
    // de fichier, aucun chemin local, aucun nom d'outil ni de modèle. Le verrou juridique
    // de `scripts/verifier-verrous.mjs` lit le composant ENTIER, commentaires retirés.
    //
    // ⚠️ SON POIDS EST MESURÉ, PAS ESTIMÉ : la planche servie fait 43 564 octets, contre
    // 1 076 519 pour l'original — le verrou de la charte juge les octets SERVIIS, page par
    // page. La valeur est écrite dans l'en-tête du composant et dans sa légende.
    path: '/armure',
    name: 'Armure',
    component: ArmurePage,
    meta: {
      title: 'L\'armure | Un projet de jeu montré en cours de route',
      description: 'L\'armure d\'un projet de jeu du studio : une planche de conception originale, six lois de forme écrites à partir d\'une œuvre décrite et non reprise, une variante qui en est l\'inverse — et ce que cette page ne garantit pas.'
    }
  },

  // -------------------------------------------------------------------------
  // SERVICES
  // -------------------------------------------------------------------------
  {
    path: '/services',
    name: 'Services',
    component: ServicesPage,
    meta: { 
      title: 'Services | Audit, sites, applications, IA locale',
      description: 'Audit web 48h, sites sur-mesure, applications métier et IA locale pour PME. Vos outils, chez vous : hébergement souverain, code à vous, l\'humain décide.'
    }
  },
  {
    path: '/projets',
    name: 'ProjectsPage',
    component: ProjectsPage,
    meta: { 
      title: 'Projets & Réalisations',
      description: 'Portfolio de projets Symfony, Vue.js, WordPress et gaming. Découvrez mes réalisations techniques et créatives.'
    }
  },

  // -------------------------------------------------------------------------
  // PARCOURS
  // -------------------------------------------------------------------------
  /* ⛔ /carte-holistique A ÉTÉ RETIRÉE — consigne de Gaëtan, 23/09/2026.
     ⚠️ Elle avait REMPLACÉ /parcours le 10/09/2026 : la page avait été
     renommée, et l'ancienne adresse rendait un 404 alors qu'elle était
     déclarée. En la retirant, on ferme les deux bouts.
     *On ne retire pas une page en laissant ses portes ouvertes.*
     ⚠️ HolisticMapPage.vue (38 699 o) n'est PAS supprimé : il reste sur le
     disque, inatteignable. *Une page qu'aucune route ne sert n'est pas
     publiée — et un fichier gardé n'est pas un fichier perdu.* */

  // -------------------------------------------------------------------------
  // PROJECTS (Case Studies)
  // -------------------------------------------------------------------------
  {
    path: '/arkadia',
    name: 'ArkadiaCase',
    component: ArkadiaCase,
    meta: { 
      title: 'Case Study ARKADIA France (ARK)',
      description: 'Administration de cluster ARK: Survival Ascended. 9 serveurs, 99.8% uptime. DevOps appliqué au gaming.'
    }
  },
  // -------------------------------------------------------------------------
  // LE NAVIRE — page unique, ajoutée le 22/09/2026 (demande de Gaëtan).
  // `defineAsyncComponent` dans la vue : le chunk 3D reste hors du premier chargement.
  // ⚠️ Le modèle servi est `public/galion-arkadia.glb` (764 Ko) — le navire CONSTRUIT.
  //    L'ancien (`galion.glb`, 2 790 Ko) est le maître d'origine, requalifié en RUINE le 18/09.
  // -------------------------------------------------------------------------
  {
    path: '/galion',
    name: 'Galion',
    component: () => import('@/views/core/GalionPage.vue'),
    meta: {
      title: 'Le galion — le navire d\'ArkAdiA, construit par le studio',
      description: 'Le galion fantôme d\'ArkAdiA en 3D navigable : un kraken à tête de mort, deux yeux d\'or, soixante-quatre canons. Construit par un générateur — mêmes paramètres, même navire.'
    }
  },
  {
    path: '/voyageo-pro',
    name: 'VoyageoProCase',
    component: VoyageoProCase,
    meta: { 
      title: 'Case Study VoyageoPro | Plateforme B2B Tourisme',
      description: 'Transformation digitale d\'une agence de voyage B2B. De Excel à une plateforme SaaS : -70% temps de traitement, +180% volume de devis.'
    }
  },

  // -------------------------------------------------------------------------
  // LEGAL
  // -------------------------------------------------------------------------
  {
    path: '/mentions-legales',
    name: 'MentionsLegales',
    component: MentionsLegales,
    meta: { 
      title: 'Mentions Légales',
      description: 'Mentions légales de Génie IT Tek FR : éditeur, hébergement, propriété intellectuelle.'
    }
  },
  {
    path: '/confidentialite',
    name: 'Confidentialite',
    component: Confidentialite,
    meta: { 
      title: 'Politique de Confidentialité',
      description: 'Politique de confidentialité de Génie IT Tek FR : traitement des données personnelles, droits RGPD, cookies.'
    }
  },
  {
    path: '/cgv',
    name: 'CGV',
    component: CGV,
    meta: { 
      title: 'Conditions Générales de Vente',
      description: 'CGV de Génie IT Tek FR : tarifs, modalités de paiement, garanties, propriété intellectuelle.'
    }
  },

  // -------------------------------------------------------------------------
  // RESOURCES
  // -------------------------------------------------------------------------
  {
    path: '/ressources/tutoriels',
    name: 'TutorielsPage',
    component: TutorielsPage,
    meta: { 
      title: 'Tutoriels & Guides Techniques',
      description: 'Guides pas à pas pour Symfony 7, Vue 3, Vite, Docker et IA locale. Documentation technique par Génie IT Tek FR.'
    }
  },

  // -------------------------------------------------------------------------
  // TOOLS
  // -------------------------------------------------------------------------
  // /ark-admin a été RETIRÉE DU BUILD le 11/09/2026 (décision Gaëtan).
  // Deux défauts mesurés, pas supposés :
  //   · la page était PUBLIQUE (HTTP 200) et absente de TOUT sitemap — ni le
  //     sitemap du site, ni les noms de fichiers publiés ne la voyaient ;
  //   · son titre servi portait une marque tierce : « ARK Admin Portal » et
  //     « ARK: Survival Ascended », sur le domaine du studio.
  // Une page d'administration n'a pas à être publiée sans décision explicite.
  // La vue `ArkAdminPortal.vue` reste dans les sources : elle n'est simplement
  // plus construite ni servie. La rouvrir demande une décision écrite.
  // -------------------------------------------------------------------------

  // -------------------------------------------------------------------------
  // APPLICATIONS - page d'index (créée le 10/09/2026)
  // Les 7 pages d'applications renvoyaient toutes vers /apps, qui n'existait pas.
  // -------------------------------------------------------------------------
  {
    path: '/apps',
    name: 'Apps',
    component: AppsPage,
    meta: {
      title: 'Applications | Les outils de l\'équipage',
      description: 'Les applications du studio : orchestrateur multi-agent, audit de sécurité, supervision système, base de connaissances, CI/CD, contenu SEO, devis et factures.'
    }
  },

  // -------------------------------------------------------------------------
  // ÉQUIPAGE - Outils des Agents IA (7 conservés, accès direct)
  // -------------------------------------------------------------------------
  {
    path: '/apps/agent/wa',
    name: 'WaRouter',
    component: WaRouter,
    meta: { 
      title: 'Wa Router | Orchestrateur Multi-Agent',
      description: 'Orchestrez des requêtes complexes vers les six Lois de l\'équipage.'
    }
  },
  {
    path: '/apps/agent/makoto',
    name: 'MakotoScanner',
    component: MakotoScanner,
    meta: { 
      title: 'Makoto Scanner | Audit de Sécurité',
      description: 'Analysez la sécurité de vos projets et dépendances.'
    }
  },
  {
    path: '/apps/agent/dou',
    name: 'DouMonitor',
    component: DouMonitor,
    meta: { 
      title: 'Dou Monitor | Supervision Système',
      description: 'Surveillez vos services et métriques en temps réel.'
    }
  },
  {
    path: '/apps/agent/watashi',
    name: 'WatashiKnowledgeBase',
    component: WatashiKnowledgeBase,
    meta: { 
      title: 'Watashi Knowledge Base | Base de Connaissances',
      description: 'Créez une base de connaissances RAG pour votre chatbot.'
    }
  },
  {
    path: '/apps/agent/jitsu',
    name: 'JitsuPipeline',
    component: JitsuPipeline,
    meta: { 
      title: 'Jitsu Pipeline | Générateur CI/CD',
      description: 'Générez des configurations CI/CD pour GitHub Actions, GitLab CI.'
    }
  },
  {
    path: '/apps/seo-content',
    name: 'SeoContentGenerator',
    component: SeoContentGenerator,
    meta: { 
      title: 'SEO Content Generator | Contenu Optimisé',
      description: 'Générez du contenu optimisé SEO pour vos projets.'
    }
  },
  {
    path: '/apps/invoice-generator',
    name: 'InvoiceGenerator',
    component: InvoiceGenerator,
    meta: { 
      title: 'Invoice Generator | Devis & Factures',
      description: 'Créez des devis et factures professionnels en quelques clics.'
    }
  },

  // -------------------------------------------------------------------------
  // RESOURCES - Bibliothèque de composants
  // -------------------------------------------------------------------------
  {
    path: '/components',
    name: 'ComponentsLibrary',
    component: ComponentsLibrary,
    meta: { 
      title: 'Component Library | Vue & Symfony',
      description: 'Bibliothèque de composants Vue 3 et Symfony réutilisables. RGPD, OPQUAST, 18+, Social. Copiez-collez et déployez.'
    }
  },

  // -------------------------------------------------------------------------
  // 404 - Catch all (DOIT ÊTRE EN DERNIER)
  // -------------------------------------------------------------------------
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound,
    meta: { 
      title: 'Page Non Trouvée',
      description: 'La page que vous recherchez n\'existe pas ou a été déplacée.'
    }
  }
];


// ============================================================================
// ROUTER CONFIGURATION
// ============================================================================

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    }
    return { top: 0, behavior: 'smooth' };
  }
});

// Opquast N°98 : Title et meta description uniques par page
router.beforeEach((to, from, next) => {
  // Update title
  document.title = `${to.meta.title} | Génie IT Tek FR`;
  
  // Update meta description
  const metaDescription = document.querySelector('meta[name="description"]');
  if (metaDescription && to.meta.description) {
    metaDescription.setAttribute('content', to.meta.description);
  }
  
  // Update canonical URL
  let canonical = document.querySelector('link[rel="canonical"]');
  if (canonical) {
    canonical.setAttribute('href', `https://gldigitallab.fr${to.path}`);
  }
  
  next();
});

export default router;
