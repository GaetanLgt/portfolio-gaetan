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
  {
    chemin: '/carte-holistique',
    compartiment: { id: 'carte', nom: 'La carte holistique', pont: 'inferieur' },
    declaration: {
      lastmod: '2026-09-10', changefreq: 'monthly', priority: '0.8',
      note: "REMPLACE /parcours (10/09/2026) : la page a été renommée, l'ancienne adresse rendait un 404 alors qu'elle était déclarée.",
    },
  },
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
];

/** Les compartiments de la carte du navire, dérivés du manifeste. */
export const COMPARTIMENTS = TOPOGRAPHIE
  .filter((e) => e.compartiment)
  .map((e) => ({ ...e.compartiment, chemin: e.chemin }));

/** Les pages déclarées aux moteurs, avec leur métadonnée éditoriale. */
export const DECLAREES = TOPOGRAPHIE.filter((e) => e.declaration);

export const DOMAINE = 'https://gldigitallab.fr';
