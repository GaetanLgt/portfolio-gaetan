/**
 * TOPOGRAPHIE DU SITE — LA SOURCE UNIQUE DE VÉRITÉ. GL Digital Lab, 13/09/2026.
 *
 * POURQUOI CE FICHIER
 * Le site tenait sa topographie à quatre endroits, chacun écrit à la main :
 *   1. le routeur `src/router/index.js`  — ce que le site sert ;
 *   2. `public/sitemap.xml`              — ce qu'on déclare aux moteurs ;
 *   3. `src/composables/useDecouvertes.js` — la carte du navire ;
 *   4. `src/views/core/SitemapPage.vue`  — le plan montré au visiteur.
 *
 * Quatre listes, donc quatre occasions de diverger — et elles ont divergé : `/soute` a été
 * construite, liée, éprouvée, puis **oubliée du sitemap**. C'est Gaëtan qui l'a vu.
 *
 * CE FICHIER EN SUPPRIME DEUX. Le plan de site et la carte du navire en DÉRIVENT désormais :
 * on ne peut plus ajouter un compartiment à l'un sans l'ajouter à l'autre. Le routeur et la
 * page de plan restent écrits à la main — mais `npm run audit:topographie` compare les
 * quatre, et nomme les écarts.
 *
 * ⚠️ CE QUI N'EST PAS DÉDUIT, ET QUI NE DOIT PAS L'ÊTRE
 *   · `priority` et `changefreq` sont des DÉCISIONS ÉDITORIALES. Elles ne se calculent pas
 *     à partir d'une route. C'est la raison pour laquelle un `routes.map()` générique
 *     appauvrirait ce fichier au lieu de l'améliorer.
 *   · `/sitemap` n'est pas déclaré au sitemap, et `/demo-*` non plus : ce sont des choix,
 *     pas des oublis. Ils sont écrits ici pour qu'on ne les « répare » pas par erreur.
 *   · `/dossier` reste prioritaire sur `/liens` : la porte commerciale n'a pas le même
 *     poids qu'une page de liens. Un générateur qui mettrait tout à 0.5 effacerait ce
 *     jugement.
 *
 * LA RÈGLE DU SITEMAP, REPRISE TELLE QUELLE (elle vient de son en-tête historique)
 *   « une URL n'entre ici que si elle REND une page réelle. Ne rien rajouter "pour plus
 *     tard" — une route qui n'existe pas encore se déclare le jour où elle existe. »
 *   C'est pour ça que le générateur VÉRIFIE que chaque `chemin` correspond à un HTML
 *   prérendu dans `dist/` : une adresse déclarée sans page derrière est pire que rien.
 *
 * LA RÈGLE DE LA CARTE, REPRISE DE `useDecouvertes.js`
 *   Une zone de la carte est un COMPARTIMENT, pas une page. Les sept pages d'application
 *   sont regroupées sous « l'atelier des agents » : la carte montre la topographie, elle
 *   ne double pas le plan du site.
 */

/**
 * @typedef {Object} Compartiment
 * @property {string} id     identifiant STABLE — il est écrit dans le `localStorage` du
 *                           visiteur. Le renommer efface sa progression : ne pas y toucher.
 * @property {string} nom    le nom du compartiment sur la carte du navire.
 * @property {'superieur'|'inferieur'|'soute'} pont  le pont où il se trouve.
 *
 * @typedef {Object} Declaration
 * @property {string} lastmod     date de dernière modification RÉELLE, pas la date du jour.
 * @property {string} changefreq  décision éditoriale.
 * @property {string} priority    décision éditoriale.
 * @property {string} [note]      pourquoi cette page est là. Recopiée en commentaire.
 */

// ⭐ LA LISTE DES DIX PAGES DU TEST ÉDITORIAL EST IMPORTÉE, PAS RECOPIÉE.
// Voir le bloc « LES DIX RÉPONSES » à la fin de `TOPOGRAPHIE` : c'est là que l'import sert.
import { GUIDES } from '../data/guides.js';

export const TOPOGRAPHIE = [
  // ═══ LE PONT SUPÉRIEUR — les cinq compartiments que la navigation montre ═══════════
  {
    chemin: '/',
    compartiment: { id: 'accueil', nom: 'La passerelle', pont: 'superieur' },
    declaration: { lastmod: '2026-09-10', changefreq: 'monthly', priority: '1.0' },
  },
  {
    chemin: '/services',
    compartiment: { id: 'services', nom: 'La salle des machines', pont: 'superieur' },
    declaration: {
      lastmod: '2026-09-10', changefreq: 'monthly', priority: '0.9',
      note: "Audit web 48h, sites sur-mesure, applications métier et IA locale pour PME.",
    },
  },
  {
    chemin: '/projets',
    compartiment: { id: 'projets', nom: 'Le pont des cartes', pont: 'superieur' },
    declaration: { lastmod: '2026-09-10', changefreq: 'weekly', priority: '0.9' },
  },
  {
    chemin: '/arkadia',
    compartiment: { id: 'arkadia', nom: 'Le navire ARKADIA', pont: 'superieur' },
    declaration: { lastmod: '2026-09-10', changefreq: 'monthly', priority: '0.8' },
  },
  {
    // ⭐ AJOUTÉ LE 22/09/2026 — demande de Gaëtan : « tu me le références dans la nav ».
    // ⚠️ ET C'EST EXACTEMENT L'OUBLI QUE CE FICHIER EXISTE POUR EMPÊCHER : `/soute` avait été
    //    construite, liée, éprouvée — et **oubliée du sitemap**. `generer-sitemap.mjs` écrit le
    //    plan de site DEPUIS CE MANIFESTE, plus depuis une liste tenue à la main.
    //    *Une page absente d'ici est une page que les moteurs ne verront pas.*
    chemin: '/galion',
    declaration: { lastmod: '2026-09-22', changefreq: 'monthly', priority: '0.8' },
  },
  {
    chemin: '/contact',
    compartiment: { id: 'contact', nom: 'La capitainerie', pont: 'superieur' },
    declaration: { lastmod: '2026-09-10', changefreq: 'monthly', priority: '0.8' },
  },

  // ═══ LE PONT INFÉRIEUR — ce qui existe sans être annoncé dans la navigation ═════════
  {
    chemin: '/dossier',
    compartiment: { id: 'dossier', nom: 'Le dossier de bord', pont: 'inferieur' },
    declaration: {
      lastmod: '2026-09-10', changefreq: 'monthly', priority: '0.9',
      note: "Dossier professionnel : ajouté le 10/09/2026. La page existait mais n'était déclarée nulle part — invisible pour les moteurs et pour les moteurs de réponse IA, alors que son objet même est d'être trouvée par des acheteurs publics et des appels d'offres. Priorité 0.9 assumée : c'est la porte commerciale du site, mise en avant dès le premier écran.",
    },
  },
  /* ⛔ L'ENTRÉE /carte-holistique A ÉTÉ RETIRÉE — consigne de Gaëtan, 23/09/2026.
     ⚠️ Elle portait : `chemin: '/carte-holistique'`, le compartiment
     `{ id: 'carte', nom: 'La carte holistique' }`, et une déclaration à
     `priority: '0.8'` pour le sitemap.
     ⛔ ET C'EST CE DERNIER POINT QUI COMPTAIT : cette table **génère le sitemap**.
     Laisser l'entrée ici, c'est **redéclarer l'URL aux moteurs de recherche à la
     prochaine génération** — après l'avoir retirée de `public/sitemap.xml`.
     *Deux sources pour une même URL, c'est une qui gagne et l'autre qui ment.*
     ⭐ Trouvée par le contrôle final du 23/09 : mon premier inventaire l'avait
     listée, mais **ne l'avait pas mise dans l'outil**. *Un inventaire qui n'entre
     pas dans le script est un inventaire qui n'existe pas.* */
  {
    chemin: '/voyageo-pro',
    compartiment: { id: 'voyageo', nom: "L'escale Voyageo", pont: 'inferieur' },
    declaration: { lastmod: '2026-09-10', changefreq: 'monthly', priority: '0.8' },
  },
  {
    chemin: '/ressources/tutoriels',
    compartiment: { id: 'tutoriels', nom: 'Les carnets', pont: 'inferieur' },
    declaration: { lastmod: '2026-09-10', changefreq: 'weekly', priority: '0.8' },
  },
  {
    chemin: '/components',
    compartiment: { id: 'ateliers', nom: 'La bibliothèque de pièces', pont: 'inferieur' },
    declaration: { lastmod: '2026-09-10', changefreq: 'monthly', priority: '0.6' },
  },
  {
    chemin: '/apps',
    compartiment: { id: 'apps', nom: "L'atelier des agents", pont: 'inferieur' },
    declaration: {
      lastmod: '2026-09-10', changefreq: 'monthly', priority: '0.6',
      note: "Index des applications (ajouté le 10/09/2026) : les 7 pages d'applications portaient un lien « ← Retour aux Apps » vers /apps, qui n'existait pas — en ligne, /apps répondait 403. La page a été créée pour que le libellé soit vrai. Même défaut que /agents avant elle : une adresse citée sans page derrière.",
    },
  },
  {
    chemin: '/liens',
    compartiment: { id: 'liens', nom: 'Les amarres', pont: 'inferieur' },
    declaration: {
      lastmod: '2026-09-10', changefreq: 'monthly', priority: '0.5',
      note: "Page de liens (10/09/2026) : elle remplace le « Linktree » que les fiches de communication prescrivaient — un service tiers qui hébergerait nos liens, contre la doctrine local-first du studio. Déclarée ici parce qu'elle REND une page réelle : c'est la règle de ce fichier.",
    },
  },
  {
    chemin: '/sitemap',
    compartiment: { id: 'plan', nom: 'Le plan complet', pont: 'inferieur' },
    // ⚠️ NON DÉCLARÉ, ET C'EST DÉLIBÉRÉ. Un plan de site qui se déclare lui-même n'apporte
    // rien à un moteur : il l'atteint déjà par le pied de page de chaque page. Le laisser
    // hors du sitemap est un choix, pas un oubli — écrit ici pour qu'on ne le « répare » pas.
    declaration: null,
  },

  // ═══ L'INTELLIGENCE QUI VIT À BORD — la pièce qui parle ═══════════════════════════
  {
    chemin: '/ia-de-bord',
    compartiment: { id: 'ia-bord', nom: "L'IA de bord", pont: 'inferieur' },
    declaration: {
      lastmod: '2026-09-19', changefreq: 'monthly', priority: '0.7',
      note: "L'IA de bord (ajoutée le 19/09/2026) : la pièce qui manquait au récit du navire — l'intelligence qui vit à bord et à qui le capitaine parle. Elle décrit la voix de bord, les sept postes de l'équipage AVEC les frontières entre eux (« chaque poste sait ce qu'il ne fait pas »), la mémoire du navire (consignes réécrites après chaque synthèse, références lues à la demande), les quatre verrous que le dépôt mesure vraiment (typographie, poids, contraste, juridique) et TROIS LIMITES assumées, dont l'absence de squelette d'animation et le fait que l'assistante n'a pas d'yeux. Priorité 0.7 : c'est une pièce de récit qui explique la méthode du studio, pas une porte commerciale. Déclarée parce qu'elle REND une page réelle — c'est la règle de ce fichier — et parce qu'une page non déclarée est invisible pour les moteurs alors que son objet est justement de dire ce que la machine fait et ne fait pas. Aucun nom de franchise, aucun numéro de port, aucun nom de fichier : le verrou juridique lit le composant entier, commentaires retirés.",
    },
  },

  // ═══ SOUS LA LIGNE DE FLOTTAISON — la zone qui se mérite ══════════════════════════
  {
    chemin: '/soute',
    compartiment: { id: 'soute', nom: 'La soute', pont: 'soute' },
    declaration: {
      lastmod: '2026-09-13', changefreq: 'monthly', priority: '0.5',
      note: "La soute (ajoutée le 13/09/2026) — zone optionnelle du cadrage « site comme un metroidvania ». Elle est atteignable par un lien ordinaire du pied de page, comme n'importe quelle page : le « compartiment scellé » du hero n'est qu'une façon AMUSANTE d'y arriver. Priorité basse assumée : c'est un bonus pour qui explore, pas une porte d'entrée commerciale. La déclarer ne lui donne pas de poids indu, l'omettre serait l'oublier.",
    },
  },

  // ═══ LES PAGES D'APPLICATION — hors carte (regroupées sous /apps), déclarées ═══════
  {
    chemin: '/apps/agent/wa',
    declaration: {
      lastmod: '2026-09-10', changefreq: 'monthly', priority: '0.6',
      note: "Outils et démonstrations (remplacent /agents, retiré : il n'existait pas). Les vraies pages sont celles-ci, chacune avec son titre propre.",
    },
  },
  { chemin: '/apps/agent/makoto', declaration: { lastmod: '2026-09-10', changefreq: 'monthly', priority: '0.6' } },
  { chemin: '/apps/agent/dou', declaration: { lastmod: '2026-09-10', changefreq: 'monthly', priority: '0.6' } },
  { chemin: '/apps/agent/watashi', declaration: { lastmod: '2026-09-10', changefreq: 'monthly', priority: '0.6' } },
  { chemin: '/apps/agent/jitsu', declaration: { lastmod: '2026-09-10', changefreq: 'monthly', priority: '0.6' } },
  { chemin: '/apps/seo-content', declaration: { lastmod: '2026-09-10', changefreq: 'monthly', priority: '0.6' } },
  { chemin: '/apps/invoice-generator', declaration: { lastmod: '2026-09-10', changefreq: 'monthly', priority: '0.6' } },

  // ═══ LES PAGES LÉGALES ════════════════════════════════════════════════════════════
  { chemin: '/mentions-legales', declaration: { lastmod: '2026-09-10', changefreq: 'yearly', priority: '0.3' } },
  { chemin: '/confidentialite', declaration: { lastmod: '2026-09-10', changefreq: 'yearly', priority: '0.3' } },
  { chemin: '/cgv', declaration: { lastmod: '2026-09-10', changefreq: 'yearly', priority: '0.3' } },

  // ═══ LA PAGE NON RÉPERTORIÉE — ni sur la carte, ni déclarée ══════════════════════
  {
    // Emplacement dicté par Gaëtan : « gldigitallab.fr/TARDIS/JoF ».
    // ⚠️ LA CASSE EST EXACTE ET ELLE COMPTE : le serveur est sous Linux, `/TARDIS/JoF` et
    // `/tardis/jof` sont deux adresses différentes. Cette ligne et le dossier
    // `public/TARDIS/JoF/` doivent porter les mêmes majuscules, sinon l'adresse est morte.
    chemin: '/TARDIS/JoF',
    // ⚠️ `declaration: null` EST UNE DÉCISION DE GAËTAN (13/09/2026), PAS UN OUBLI.
    // « À mettre en place, non répertorié, à www.gldigitallab.fr/ » — les dossiers
    // pédagogiques sont en ligne, mais ils ne doivent pas être trouvés par un moteur :
    // c'est une pièce qu'on envoie à une école, pas une porte d'entrée commerciale.
    //
    // Trois choses le garantissent, et il faudra défaire LES TROIS pour la rendre publique :
    //   1. `noindex, nofollow` dans chaque page générée (scripts/publier-ecole.mjs) ;
    //   2. aucune entrée au sitemap — c'est cette ligne ;
    //   3. aucun lien depuis la navigation, le pied de page ou le plan du site.
    //
    // Et on n'ajoute PAS de `Disallow` dans robots.txt : une exclusion de chemin
    // empêcherait le robot de lire le `noindex`, ce qui serait une contradiction — le
    // `robots.txt` du site porte déjà cette leçon (correction du 10/09).
    declaration: null,
  },

  // ═══ LES DÉMONSTRATIONS — ni sur la carte, ni déclarées ═══════════════════════════
  // Deux pages autonomes, sans dépendance externe, servies telles quelles. Elles ne sont
  // pas déclarées aux moteurs : ce sont des pièces de démonstration, pas des portes
  // d'entrée. Écrit ici pour que ce ne soit pas pris pour un oubli.
  { chemin: '/demo-conformite', declaration: null },
  { chemin: '/demo-festival-metz', declaration: null },

  // ═══ ARCHE — les scènes du vault Metroid ═════════════════════════════════════════
  // Cinq pages (une entrée + quatre scènes) générées par `scripts/generer-arche.mjs`,
  // en HTML et SVG EN LIGNE : 0 script, 0 ressource chargée, 0 dépendance.
  // ⛔ Pourquoi pas de 3D : `three` est une dépendance déclarée du dépôt, donc le critère
  //    du gabarit (« 0 script ou sans dépendance ») est faux — le poids, lui, passait
  //    (710 741 o avec OrbitControls, sous le verrou de 1 Mo). Mesure dans l'en-tête du
  //    générateur et sur la page d'entrée.
  // Même régime que le kit et les démonstrations : hors sitemap, hors navigation, hors
  // pied de page, `noindex`. Écrit ici pour que ce ne soit pas pris pour un oubli.
  // Adresse visée : gldigitallab.fr/Arche/
  { chemin: '/Arche', declaration: null },

  // ═══ LE RELEVÉ DU PRÉSENT — la pièce qui ne raconte pas, qui mesure ═══════════════
  // ⚠️ AJOUTÉE EN DERNIER, ET CE N'EST PAS DE LA NÉGLIGENCE : c'est la règle de ce
  // fichier appliquée à lui-même. Les compartiments et les `chemin` sont appariés PAR
  // ORDRE D'APPARITION ; insérer cette entrée plus haut décalerait tous les appariements
  // suivants, et `verifier-topographie.mjs` lirait une carte fausse. Une entrée nouvelle
  // se pose donc à la fin, jamais au milieu.
  {
    chemin: '/etat-du-studio',
    compartiment: { id: 'journal-bord', nom: 'Le journal de bord', pont: 'inferieur' },
    declaration: {
      lastmod: '2026-09-19', changefreq: 'daily', priority: '0.7',
      note: "L'état du studio (ajoutée le 19/09/2026) : le présent réel du studio, mesuré et daté — commit livré, horodatage du build, pages prérendues, poids et requêtes du premier chargement, verdict des cinq contrôles du dépôt, et les passages des moteurs d'IA en compteurs agrégés. Déclarée parce qu'elle REND une page réelle — c'est la règle de ce fichier — et parce qu'une page qui dit la vérité sur un studio doit pouvoir être trouvée par ceux qui la vérifient. `changefreq: daily` : c'est la seule page du site dont le contenu change à chaque construction, et la seule dont une partie est lue en direct. Priorité 0.7 : c'est une pièce de confiance, pas une porte commerciale. Aucun numéro de port, aucun nom de fichier, aucun nom de modèle : les services y sont décrits par leur rôle, jamais par leur architecture réseau.",
    },
  },

  // ═══ CE QUE NOUS NOUS IMPOSONS — nos règles, et ce qu'elles ne garantissent pas ══
  // ⚠️ AJOUTÉE EN DERNIER, ET CE N'EST PAS DE LA NÉGLIGENCE : c'est la règle de ce
  // fichier appliquée à lui-même. Les compartiments et les `chemin` sont appariés PAR
  // ORDRE D'APPARITION ; insérer cette entrée plus haut décalerait tous les appariements
  // suivants, et `verifier-topographie.mjs` lirait une carte fausse. Une entrée nouvelle
  // se pose donc à la fin, jamais au milieu.
  {
    chemin: '/ce-que-nous-nous-imposons',
    compartiment: { id: 'impose', nom: 'Nos règles de bord', pont: 'inferieur' },
    declaration: {
      lastmod: '2026-09-19', changefreq: 'monthly', priority: '0.6',
      note: "Ce que nous nous imposons (ajoutée le 19/09/2026) : les règles que le studio se donne, publiées pour qu'elles puissent être opposées au studio — refus argumentés (aucune plateforme qui centralise les données d'un client, aucun chiffre sans source ni date, aucune décision déléguée), la discipline de vérification, la mémoire datée des erreurs du studio et de ses propres outils, et une rubrique « ce que cette page ne garantit pas ». Trois pièces d'actualité ont motivé la page ; aucune n'y est exploitée : la société victime d'une fuite n'est pas nommée, aucun chiffre de cette fuite n'est repris, le lieu de vente des données n'est ni nommé ni désigné, et AUCUN LIEN n'est établi entre l'argumentaire commercial et la fuite — suggérer un rapport serait une allégation. Le pré-print cité (Solé et Ruffini, identifiant arXiv 2509.03344) est présenté comme non évalué par les pairs AVANT l'usage qu'on en fait. UN POINT DE LA PAGE EST DÉCLARÉ NON APPLIQUÉ : le studio n'a pas encore de périodes déconnectées, et il l'écrit plutôt que de se l'attribuer. Priorité 0.6 : c'est une pièce de méthode et de confiance, pas une porte commerciale. Déclarée parce qu'elle REND une page réelle — c'est la règle de ce fichier — et parce qu'un engagement qu'on ne peut pas trouver n'oppose rien à personne. Aucun numéro de port, aucun nom de fichier, aucun nom de modèle, aucun nom de franchise : les contrôles automatiques y sont décrits par ce qu'ils vérifient, jamais par le fichier qui les porte.",
    },
  },

  // ═══ LE KIT PÉDAGOGIQUE — publié, et longtemps orphelin ══════════════════════════
  // ⚠️ IL N'EST PAS DANS LE TABLEAU CI-DESSUS, ET C'EST UNE MESURE, PAS UN GOÛT.
  //
  // Le premier jet l'y avait mis, avec un compartiment. `npm run audit:topographie` a
  // répondu : « compartiments de la CARTE qui ne correspondent à aucune page » — le
  // contrôle normalise une route servie en `/TARDIS/JoF/metroid` et comparait à un
  // `chemin` qui finissait par `/index.html`. Une zone de la carte qui ne correspond à
  // aucune page est exactement ce que ce fichier interdit : un compartiment est une PORTE
  // DE ROUTEUR, et le kit est du HTML statique servi hors routeur.
  //
  // Ce qui est donc écrit ici, à part du manifeste : la SEULE adresse du kit, exportée.
  // Elle est lue par la page qui la publie, jamais recopiée — et la porte n'est pas
  // déclarée comme une zone du navire, parce qu'elle n'en est pas une.

  // ═══ L'ARMATURE — un projet du studio montré en cours de route ═══════════════════
  // ⚠️ AJOUTÉE EN DERNIER, ET CE N'EST PAS DE LA NÉGLIGENCE : c'est la règle de ce
  // fichier appliquée à lui-même. Les compartiments et les `chemin` sont appariés PAR
  // ORDRE D'APPARITION ; insérer cette entrée plus haut décalerait tous les appariements
  // suivants, et `verifier-topographie.mjs` lirait une carte fausse. Une entrée nouvelle
  // se pose donc à la fin, jamais au milieu.
  {
    chemin: '/armure',
    compartiment: { id: 'armure', nom: "L'atelier de l'armure", pont: 'inferieur' },
    declaration: {
      lastmod: '2026-09-19', changefreq: 'monthly', priority: '0.6',
      note: "L'armure (ajoutée le 19/09/2026) : le projet de jeu du studio montré EN COURS DE ROUTE — une planche de conception originale, six lois de forme écrites après la réception d'une œuvre décrite et NON reprise, une variante qui en est l'inverse ligne par ligne, l'état réel de ce qui est fait et de ce qui ne l'est pas, et une rubrique « ce que cette page ne garantit pas » qui dit les trois manques. Déclarée parce qu'elle REND une page réelle — c'est la règle de ce fichier — et parce qu'un projet qu'on ne peut pas trouver n'est pas montré : il est caché. Priorité 0.6 : c'est une pièce d'atelier et de méthode, pas une porte commerciale, et rien n'y est vendu. Famille de limites : AUCUN NOM DE FRANCHISE, de marque, de personnage protégé ni d'artiste — l'œuvre de tiers qui a servi de point de départ est décrite par sa FORME et jamais nommée ; aucune image d'un autre (la seule image de la page est la planche produite par le studio, réduite de 1 076 519 à 43 564 octets pour tenir le verrou de poids) ; aucun nom de fichier, aucun chemin local, aucun nom d'outil ni de modèle. Aucune date de sortie, aucun moteur, aucun modèle économique : ils ne sont pas décidés, et une valeur par défaut serait une invention.",
    },
  },

  // ═══ LES DIX RÉPONSES — le test éditorial du 24/09/2026 ═══════════════════════════
  //
  // ⛔ CE BLOC EXISTE PARCE QUE DIX PAGES ÉTAIENT DEVENUES INTROUVABLES PAR LE BUILD.
  //
  // Mesuré le 25/09/2026 : les dix pages étaient écrites (`src/data/guides.js`), routées
  // (`src/router/index.js`), liées depuis le pied de page de tout le site — et **absentes du
  // sitemap** (27 `<loc>`, zéro `/guides`), donc **jamais prérendues** : `dist/guides/`
  // n'existait pas. Le prérendu tire ses routes de `dist/sitemap.xml` ∪ les `path:`
  // LITTÉRAUX de `src/router/index.js` ; or ces dix routes sont écrites
  // `GUIDES.map((g) => ({ path: '/guides/' + g.slug }))` — une chaîne CONSTRUITE, que la
  // regex `path:\s*'([^']+)'` ne peut pas énumérer. *Un fichier juste, une liste muette.*
  //
  // ⭐ LA CORRECTION N'ÉCRIT AUCUN SLUG ICI. Elle importe `GUIDES` : la liste des pages et
  // leur déclaration au plan du site redeviennent UNE SEULE LISTE. Un onzième guide ajouté
  // dans `src/data/guides.js` entre au sitemap sans que personne n'y pense — c'est la leçon
  // de `/soute` (13/09), qui avait déjà coûté un oubli de sitemap.
  //
  // ⚠️ Ces dix pages n'ont PAS de `compartiment` : elles ne sont pas des zones de la carte
  // du navire, comme les pages légales et l'atelier des agents. Le contrôle
  // `verifier-topographie.mjs` ne les concerne donc pas — et c'est voulu.
  {
    chemin: '/guides',
    declaration: {
      lastmod: '2026-09-24', changefreq: 'monthly', priority: '0.8',
      note: "Les dix réponses (hub du test éditorial, 24/09/2026) — prix, délais, méthode : ce qu'un client demande avant d'acheter, écrit une fois et publié. Déclaré parce qu'il REND une page réelle. Priorité 0.8 : c'est une porte d'entrée commerciale, pas une pièce d'atelier. Famille de limites : aucune franchise ni marque de tiers, aucun visuel d'un autre, aucun chiffre non mesuré — les prix cités sont publics et hors taxes, les délais sont des fourchettes annoncées dès le premier échange.",
    },
  },
  ...GUIDES.map((g) => ({
    chemin: `/guides/${g.slug}`,
    declaration: {
      // ⚠️ `lastmod` EST LA DATE DE RÉDACTION RÉELLE (24/09/2026), pas celle du build.
      lastmod: '2026-09-24', changefreq: 'yearly', priority: '0.7',
      // La question du guide est recopiée en commentaire : elle dit POURQUOI la page existe,
      // en une phrase, sans qu'on ait à rouvrir `guides.js` pour le comprendre.
      note: g.question,
    },
  })),
];

/** Les compartiments de la carte du navire, dérivés du manifeste. */
export const COMPARTIMENTS = TOPOGRAPHIE
  .filter((e) => e.compartiment)
  .map((e) => ({ ...e.compartiment, chemin: e.chemin }));

/** Les pages déclarées aux moteurs, avec leur métadonnée éditoriale. */
export const DECLAREES = TOPOGRAPHIE.filter((e) => e.declaration);

/**
 * LA PORTE DU KIT PÉDAGOGIQUE — la seule adresse du site qui ne soit pas une route.
 *
 * ⛔ ELLE N'EST PAS DANS `TOPOGRAPHIE`, ET CE N'EST PAS UN OUBLI. `TOPOGRAPHIE` décrit les
 * COMPARTIMENTS du navire : chaque entrée avec un `compartiment` doit correspondre à une
 * route réellement servie, et `scripts/verifier-topographie.mjs` ÉCHOUE dans le cas
 * contraire. Le kit pédagogique est du HTML statique publié hors du routeur, sous une
 * arborescence dictée (`/TARDIS/JoF/`, casse exacte) : il n'est pas une route, donc il
 * n'est pas un compartiment. Le premier jet l'y avait mis — et le contrôle l'a dit :
 * « compartiments de la CARTE qui ne correspondent à aucune page ». *Un contrôle qui
 * contredit une conclusion, c'est la conclusion qui tombe.*
 *
 * ⛔ CE QUE CETTE PORTE CORRIGE, ET C'EST UNE MESURE DU 19/09/2026.
 * Les 22 pages du dossier étaient publiées, dans `dist/`, avec de vraies adresses, et
 * `audit:topographie` les listait dans les « pages ni sur la carte, ni dans le plan du site
 * — atteignables par aucun chemin balisé ». Un robot pouvait les trouver ; un visiteur,
 * non. C'était le défaut que ce module existe pour empêcher, appliqué à un dossier entier.
 *
 * ⚠️ ATTEIGNABLE N'EST PAS INDEXABLE, ET LES DEUX NE SE CONFONDENT PAS ICI.
 * Les trois verrous posés le 13/09 par le dirigeant tiennent toujours : `noindex, nofollow`
 * dans chacune des 22 pages générées, aucune entrée au sitemap, et AUCUNE exclusion dans
 * `robots.txt` (une exclusion empêcherait le robot de lire le `noindex` : ce serait une
 * contradiction, et c'est la leçon que le `robots.txt` du site porte déjà). Si Gaëtan décide
 * un jour d'ouvrir ce dossier, ce sont LES TROIS qu'il faudra défaire — pas seulement le lien.
 */
export const PORTE_DOSSIERS = {
  chemin: '/TARDIS/JoF/metroid/index.html',
  nom: 'Les dossiers pédagogiques',
  libelle: 'Entrer dans les dossiers pédagogiques',
  // Ce que la porte dit d'elle-même, à l'écran. Écrit ici plutôt que dans la page pour que
  // l'adresse, le fait et sa raison restent au même endroit.
  //
  // ⚠️ CE TEXTE NE RÉPÈTE PAS CELUI DE LA PAGE QUI L'AFFICHE. Le premier jet disait deux
  // fois la même chose à deux paragraphes d'intervalle — la page raconte l'histoire du lien
  // manquant, et cette ligne-ci dit ce qui la distingue d'une publication : elle est
  // ATTEIGNABLE, pas INDEXABLE. *Une porte qui explique deux fois pourquoi elle existe
  // n'explique rien deux fois.*
  pourquoi:
    "Ce n'est pas une publication : ce dossier ne figure pas au plan du site. C'est une "
    + "pièce qu'on envoie à une école, et elle est publiée en « ne pas indexer ». Le lien "
    + "ci-dessous la rend joignable par un visiteur ; il ne la rend pas trouvable par un "
    + "moteur de recherche, et c'est voulu.",
  indexable: false,
};

export const DOMAINE = 'https://gldigitallab.fr';
