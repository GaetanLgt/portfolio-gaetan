// src/data/guides.js — les 10 pages du test éditorial instrumenté.
//
// ⭐ POURQUOI CE FICHIER EXISTE. Le canon du studio dit « LE PREMIER PASSAGE » :
//    un titre, une réponse de 40 à 90 mots, autonome et compréhensible seule, puis
//    le développement. Une page de méthode lue le 24/09/2026 donne à la même chose
//    un autre nom — « bloc de réponse directe » — et une contrainte chiffrée que le
//    canon n'avait pas.
//
// ⛔ TOUS LES CHIFFRES DE CE FICHIER VIENNENT DE `/dossier`, lus le 24/09/2026.
//    Aucun n'est inventé, aucun n'est arrondi. Chaque montant est écrit avec la
//    prestation à laquelle il appartient — *un chiffre sans sujet est faux.*
//
// ⛔ ET AUCUN VOLUME DE RECHERCHE N'EST MESURÉ. Les intentions sont `[DÉDUIT]` :
//    chaque question dérive d'une offre réellement présente sur le site, pas d'une
//    supposition sur ce que les gens tapent.
//
// Protocole complet : `livrables/TEST-EDITORIAL-10-PAGES-2026-09-24.md`.

export const GUIDES = [
  {
    slug: 'prix-site-web-pme',
    question: 'Combien coûte un site internet pour une PME ?',
    title: "Prix d'un site web pour PME : à partir de 2 500 € HT | Génie IT Tek FR",
    description: "Site web sur mesure dès 2 500 € HT, livré en 4 à 6 semaines. Prix publics hors taxes, délais et méthode écrits noir sur blanc. Studio dans la Somme.",
    bloc: "Un site web sur mesure démarre à 2 500 € HT et se livre en 4 à 6 semaines. Une application métier démarre à 8 000 € HT, après un atelier de cadrage. L'ensemble des prix est public et hors taxes : ils sont écrits dans le dossier professionnel du studio, pas donnés au téléphone. Un projet qui sort de ces fourchettes se dit au premier échange, pas à la livraison.",
    sections: [
      { titre: 'Ce qui fait varier le prix', texte: "Le nombre de gabarits distincts, la présence d'un espace client, la reprise ou non d'un contenu existant, et le niveau de finition. Le prix de départ suppose un site vitrine : il ne comprend ni catalogue, ni paiement, ni application métier." },
      { titre: 'Ce qui est compris', texte: "La conception, le développement, l'hébergement souverain, la mise en ligne et la remise du code source. Vous repartez avec le code, pas avec une location." },
      { titre: "Ce qui ne l'est pas", texte: "La production des contenus — textes, photographies, vidéos. Elle peut être accompagnée, mais elle n'est pas incluse, et le studio le dit avant de commencer." },
      { titre: 'Comment obtenir une fourchette', texte: "Vous envoyez votre demande, vous recevez sous 24 heures une première lecture : ce qui est faisable, ce qui ne l'est pas, et une fourchette de prix ajustée à votre cas." },
    ],
  },
  {
    slug: 'heberger-ses-donnees-en-france',
    question: 'Héberger son site et ses données en France, concrètement',
    title: 'Héberger son site en France : ce que ça change | Génie IT Tek FR',
    description: "Sites, applications et IA exécutés sur la machine du studio, dans la Somme, puis publiés chez un hébergeur français. Ce qui sort, et ce qui reste.",
    bloc: "Les sites, les applications et les agents d'IA du studio sont exécutés sur sa propre machine, dans la Somme, puis publiés chez un hébergeur français. Aucune donnée client ne passe par un service d'IA étranger : l'IA tourne en local. Le code source vous appartient à la livraison. Ce qui sort de chez vous, c'est ce que vous publiez — pas ce que vous nous confiez.",
    sections: [
      { titre: 'Où tourne quoi', texte: "Le développement, les modèles d'IA, les documents de travail et les tests tournent sur la machine du studio. Seul le résultat publié part vers l'hébergeur." },
      { titre: 'Ce qui reste en local', texte: "Vos documents, vos données, vos échanges et vos fichiers de travail. Ils ne sont transmis à aucun fournisseur d'IA, français ou étranger." },
      { titre: 'Ce qui est publié', texte: "Uniquement ce que vous décidez de rendre public : les pages du site, et rien d'autre. Le reste ne quitte pas la machine." },
      { titre: 'La limite, dite franchement', texte: "« Français » ne veut pas dire « infaillible ». L'hébergeur est un tiers, et il est nommé dans le dossier professionnel. Un hébergement souverain réduit les dépendances, il ne les supprime pas." },
    ],
  },
  {
    slug: 'audit-site-web',
    question: "Un audit de site web : ce qu'il contient, combien de temps ça prend",
    title: 'Audit de site web : 149 à 199 € HT, livré en 48 h | Génie IT Tek FR',
    description: "Audit WordPress de 149 à 199 € HT, livré en 48 h. Réponse sous 24 h : ce qui est faisable, ce qui ne l'est pas, et une fourchette de prix.",
    bloc: "L'audit de site coûte 149 à 199 € HT et se livre en 48 heures. Votre demande reçoit une réponse sous 24 heures : une première lecture de ce qui est faisable, de ce qui ne l'est pas, et une fourchette de prix. L'audit porte sur un site WordPress ou sur un site existant à reprendre. On mesure avant de s'engager — c'est la première étape, et elle n'engage à rien.",
    sections: [
      { titre: "Ce que l'audit regarde", texte: "Les performances réelles, l'accessibilité, le référencement de base, la structure des pages, et ce qui peut être repris sans tout refaire." },
      { titre: "Ce qu'il ne regarde pas", texte: "Il ne juge ni votre métier, ni votre communication. Il dit ce que le site fait bien, ce qu'il fait mal, et ce que coûterait de le corriger." },
      { titre: 'Ce que vous recevez', texte: "Un document écrit, daté, avec les mesures. Pas une liste de bonnes pratiques génériques : ce que votre site fait, chiffré." },
      { titre: "Après l'audit, si vous ne continuez pas", texte: "Vous gardez le document. Il est à vous, il est lisible par un autre prestataire, et il ne dépend d'aucun outil du studio." },
    ],
  },
  {
    slug: 'sur-mesure-ou-wordpress',
    question: 'Site sur mesure ou WordPress : comment choisir',
    title: 'Site sur mesure ou WordPress : comment choisir | Génie IT Tek FR',
    description: "WordPress quand vous voulez publier vous-même ; sur mesure quand le métier est spécifique. Les deux sont audités et repris par le studio, dès 2 500 € HT.",
    bloc: "Le choix ne dépend pas du budget : il dépend de qui va écrire dedans. WordPress convient quand vous publiez souvent vous-même et que vos pages se ressemblent. Le sur mesure convient quand votre métier impose sa structure — un catalogue, un calcul, un espace client. Le studio audite et reprend les deux, à partir de 2 500 € HT. Le mauvais critère, c'est la mode ; le bon, c'est qui tient le clavier dans six mois.",
    sections: [
      { titre: 'WordPress, quand c’est le bon choix', texte: "Vous publiez régulièrement, vos pages ont une structure commune, et vous voulez pouvoir ajouter une page sans appeler quelqu'un." },
      { titre: 'Le sur mesure, quand c’est le bon choix', texte: "Votre activité ne rentre pas dans un gabarit : vous calculez, vous cataloguez, vous suivez des dossiers. Un site qui vous oblige à tordre votre métier coûte plus cher qu'il ne rapporte." },
      { titre: 'Le vrai coût, dans les deux cas', texte: "Ce n'est pas le développement : c'est ce que vous ferez dans deux ans. Un site que vous ne pouvez pas faire évoluer se refait ; un site que vous pouvez reprendre dure." },
    ],
  },
  {
    slug: 'application-metier-sur-mesure',
    question: "Une application métier sur mesure : quand ça vaut le coup",
    title: 'Application métier sur mesure : dès 8 000 € HT | Génie IT Tek FR',
    description: "Une application métier sur mesure démarre à 8 000 € HT, après un atelier de cadrage. Quand un tableur ne suffit plus, et ce que ça change au quotidien.",
    bloc: "Une application métier sur mesure démarre à 8 000 € HT, après un atelier de cadrage. Elle vaut le coup quand un tableur ne tient plus : plusieurs personnes qui saisissent la même donnée, des règles qui changent, un historique qu'on ne peut pas reconstituer. Le studio en a construit une pour une agence de voyage B2B : le temps de traitement a baissé et le volume de devis a augmenté. Le cadrage précède le devis, jamais l'inverse.",
    sections: [
      { titre: 'Les signes qu’un tableur ne suffit plus', texte: "Deux personnes modifient le même fichier. Une règle change et personne ne sait quelle version s'applique. On ne peut pas répondre à « qui a modifié quoi, et quand »." },
      { titre: 'Ce que l’atelier de cadrage décide', texte: "Le périmètre : ce que l'application fera, et surtout ce qu'elle ne fera pas. C'est ce document, validé, qui permet de donner un prix et un délai tenables." },
      { titre: 'Ce que ça change, en pratique', texte: "Le travail devient vérifiable : chaque saisie laisse une trace, chaque règle est écrite une fois et appliquée partout. Le gain ne se mesure pas en fonctionnalités, mais en erreurs évitées." },
      { titre: 'La limite', texte: "Une application sur mesure se paie au cadrage. Si le besoin tient en une feuille de calcul bien tenue, le studio le dit — et c'est une réponse, pas un refus." },
    ],
  },
  {
    slug: 'ia-locale-entreprise',
    question: 'Faire tourner une IA en local dans une entreprise',
    title: 'IA locale en entreprise : dès 1 500 € HT | Génie IT Tek FR',
    description: "Une IA qui tourne sur votre machine, pas chez un fournisseur. Audit IA puis mise en place à partir de 1 500 € HT. Rien ne sort de l'entreprise.",
    bloc: "Une IA locale s'installe sur une machine de l'entreprise et ne communique avec aucun service extérieur. Elle coûte à partir de 1 500 € HT, après un audit IA qui vérifie que le matériel et le besoin suivent. Le bon cas, c'est un document qu'on ne peut pas confier à un tiers : un contrat, un dossier client, une donnée de santé. Le mauvais cas, c'est ce qu'un outil en ligne fait mieux pour trois fois rien.",
    sections: [
      { titre: 'Ce que « local » veut dire exactement', texte: "Le modèle tourne sur une machine de l'entreprise. Aucune requête ne part vers un fournisseur : ni OpenAI, ni Google, ni Mistral. Le réseau peut être coupé, l'outil fonctionne encore." },
      { titre: 'Ce que l’audit IA vérifie', texte: "Le matériel disponible, le volume de documents à traiter, la langue, et le niveau de qualité attendu. Un modèle qui tient sur un portable ne fait pas le travail d'un modèle qui a besoin de deux cartes graphiques." },
      { titre: 'La qualité, franchement', texte: "Un modèle local de taille raisonnable n'égale pas les grands modèles en ligne. Il fait moins bien, mais il fait chez vous. Le choix se pose en ces termes, et il se pose avant l'achat." },
    ],
  },
  {
    slug: 'ce-qui-sort-dune-ia',
    question: "Confier ses données à une IA : qu'est-ce qui sort de l'entreprise ?",
    title: "Ce qu'une IA envoie dehors sans le dire | Génie IT Tek FR",
    description: "Quand vous collez un document dans un service d'IA en ligne, il sort de chez vous. Ce qui part, ce qui reste, et comment faire tenir une IA sur votre machine.",
    bloc: "Quand un document est collé dans un service d'IA en ligne, il quitte l'entreprise : il est transmis à un fournisseur, traité sur ses serveurs, et souvent conservé. La loi ne l'interdit pas toujours, mais personne dans l'entreprise ne sait ce qui est parti. Une IA locale change ça : le modèle tourne sur votre machine, le document ne bouge pas. Le studio met en place les deux et dit lequel convient.",
    sections: [
      { titre: 'Ce qui part, concrètement', texte: "Le texte que vous collez, les questions que vous posez, les fichiers que vous joignez, et les échanges qui en découlent. Tout cela est traité sur les serveurs du fournisseur." },
      { titre: 'Ce qui est conservé', texte: "Cela dépend du fournisseur et du palier tarifaire — plusieurs conditions d'utilisation se réservent explicitement l'usage des contenus pour l'entraînement. La seule lecture qui vaille est celle du contrat, au moment où on choisit." },
      { titre: 'Ce que personne ne sait', texte: "Dans la plupart des entreprises, aucun inventaire ne dit quels documents ont été collés dans quel outil. Le risque n'est pas la fuite spectaculaire : c'est l'accumulation silencieuse." },
      { titre: 'La réponse praticable', texte: "Pour les documents qu'on ne peut pas confier, une IA locale. Pour le reste, un outil en ligne, avec une règle écrite qui dit ce qu'on n'y met jamais." },
    ],
  },
  {
    slug: 'a-qui-appartient-le-code',
    question: "Qui possède le code d'un site : l'agence ou le client ?",
    title: "À qui appartient le code d'un site web ? | Génie IT Tek FR",
    description: "Chez ce studio, le code source vous est remis à la livraison. Ce que ça change le jour où vous changez de prestataire, et pourquoi ce n'est pas la règle.",
    bloc: "La loi ne tranche pas toute seule : ce qui n'est pas écrit se décide au moment de la rupture. Chez ce studio, le code est écrit pour vous, donc le code vous appartient — il est remis à la livraison, avec l'accès à l'hébergement. Concrètement, vous pouvez partir avec, ou faire reprendre le travail par quelqu'un d'autre. C'est écrit dans le dossier professionnel, pas promis à l'oral.",
    sections: [
      { titre: 'Ce que dit la loi, en bref', texte: "Le droit d'auteur reste au développeur sauf cession écrite. Une prestation qui ne dit rien vous laisse donc locataire de votre propre site — et c'est la situation la plus répandue." },
      { titre: 'Ce que ça change, en pratique', texte: "Le jour où vous changez de prestataire, celui qui n'a pas le code facture la reprise au prix qu'il veut. C'est le coût caché le plus fréquent d'un site « pas cher »." },
      { titre: 'À quoi ça ressemble, ici', texte: "Le dépôt de code, l'accès à l'hébergement, et la documentation de mise en ligne. Remis à la livraison, sans condition de durée ni redevance." },
    ],
  },
  {
    slug: 'agence-web-somme',
    question: "Trouver une agence web dans la Somme, près d'Amiens",
    title: 'Agence web dans la Somme : studio indépendant | Génie IT Tek FR',
    description: "Studio indépendant dans la Somme : sites, applications métier et IA locale. Prix publics HT, audit en 48 h, réponse sous 24 h. À distance partout en France.",
    bloc: "Le studio est indépendant et basé dans la Somme. Il travaille avec des entreprises de la région et à distance partout en France. Ce qu'un studio local change : les rendez-vous peuvent se tenir en personne, et la machine qui exécute vos outils est tenue par la même personne qui décroche. Prix publics hors taxes, audit livré en 48 heures, réponse sous 24 heures. Aucun sous-traitant, aucune plateforme intermédiaire.",
    sections: [
      { titre: 'Ce que « local » change vraiment', texte: "Le rendez-vous en personne, et un interlocuteur unique. Ni commercial, ni chef de projet intermédiaire : la personne qui parle est celle qui construit." },
      { titre: 'Et à distance ?', texte: "Le studio travaille avec des clients hors de la région. Tout passe par un document écrit, daté : ce qui est dit au téléphone se retrouve dans un devis ou un compte-rendu." },
      { titre: 'Les délais, écrits', texte: "Réponse sous 24 heures, audit livré en 48 heures, site web livré en 4 à 6 semaines à partir du lancement. Ce qui allonge un projet, ce sont les contenus qui n'arrivent pas — pas la technique." },
    ],
  },
  {
    slug: 'delai-refaire-un-site',
    question: "Combien de temps pour refaire un site, du premier appel à la mise en ligne",
    title: 'Refaire un site : 4 à 6 semaines | Génie IT Tek FR',
    description: "Un site web se livre en 4 à 6 semaines. Réponse sous 24 h, audit en 48 h, puis un plan daté. Ce qui allonge un projet, et ce qui ne l'allonge pas.",
    bloc: "Un site web se livre en 4 à 6 semaines à partir du lancement. Avant ça, votre demande reçoit une réponse sous 24 heures et un audit en 48 heures, qui dit ce qui est faisable, ce qui ne l'est pas et une fourchette de prix. Une application métier, elle, commence par un atelier de cadrage — le délai se date après. Ce qui allonge un projet : les contenus qui n'arrivent pas, et les décisions repoussées. Pas la technique.",
    sections: [
      { titre: 'Les étapes, dans l’ordre', texte: "Le premier échange, l'audit, la validation du périmètre, la production, la recette, la mise en ligne. Chaque étape a une sortie écrite : rien ne se poursuit sur un accord oral." },
      { titre: 'Ce qui allonge vraiment', texte: "Les textes et les images qui n'arrivent pas. Une décision repoussée bloque tout ce qui en dépend. Ce sont ces deux-là, presque jamais la technique." },
      { titre: 'Comment on tient un délai', texte: "En datant le lancement, et en écrivant ce que chaque partie fournit et quand. Le planning est un document, pas une intention." },
    ],
  },
];

// ⛔ ASSERTION — Loi 2 : un fichier de données porte son propre contrôle.
//    Dix guides, dix slugs, aucun doublon, et chaque bloc dans la fourchette
//    fixée par le protocole (40 à 90 mots). *Ce qui n'est pas vérifié dérive.*
export function verifierGuides(guides = GUIDES) {
  const erreurs = [];
  const vus = new Set();
  for (const g of guides) {
    for (const champ of ['slug', 'question', 'title', 'description', 'bloc', 'sections']) {
      if (!g[champ]) erreurs.push(`${g.slug || '?'} : champ « ${champ} » manquant`);
    }
    if (vus.has(g.slug)) erreurs.push(`slug en double : ${g.slug}`);
    vus.add(g.slug);
    const mots = String(g.bloc || '').split(/\s+/).filter(Boolean).length;
    if (mots < 40 || mots > 90) erreurs.push(`${g.slug} : bloc de ${mots} mots (cible 40-90)`);
    if (String(g.title).length > 70) erreurs.push(`${g.slug} : title de ${String(g.title).length} caractères (max 70)`);
    if (String(g.description).length > 160) erreurs.push(`${g.slug} : description de ${String(g.description).length} caractères (max 160)`);
  }
  if (guides.length !== 10) erreurs.push(`${guides.length} guides au lieu de 10`);
  return erreurs;
}
