<template>
  <!--
    ⚠️ `<div>` ET NON `<main>` : `App.vue` pose déjà `<main id="main-content" role="main">`
    autour de tout le contenu rendu par le routeur. Un second `main` produirait un repère
    IMBRIQUÉ (deux constats d'accessibilité pour une seule page). La classe porte la mise
    en page, pas la sémantique. Même règle qu'à `/ce-que-nous-nous-imposons`.
  -->
  <div class="liens-page">
    <div class="enveloppe">

      <header class="page-header">
        <p class="header-badge">
          <span class="badge-icon" aria-hidden="true">🔗</span>
          <span class="badge-text">Annuaire du studio</span>
        </p>
        <h1 class="page-title">
          <span class="title-pre">Tout le studio</span>
          <span class="title-main">EN UN SEUL ENDROIT</span>
        </h1>
        <p class="page-desc">
          Cette page rassemble nos adresses — et <strong>elle dit aussi ce qui n'existe pas
          encore</strong>. C'est la différence entre un annuaire et une vitrine :
          <strong>une rubrique vide qu'on masque laisse croire qu'il y a quelque chose
          derrière</strong>. Ici, ce qui manque est écrit, à sa place, à côté du reste.
        </p>
        <p class="page-date">Structure arrêtée et publiée le 19 septembre 2026.</p>
      </header>

      <!--
        ══ LE SOMMAIRE ═══════════════════════════════════════════════════════════
        Des ancres ordinaires (`href="#…"`) : elles fonctionnent SANS JavaScript, et
        cette page est prérendue. Un sommaire qui aurait besoin du routeur serait un
        sommaire mort pour un visiteur dont le script n'a pas démarré.
      -->
      <nav class="sommaire" aria-labelledby="titre-sommaire">
        <p id="titre-sommaire" class="sommaire__titre">Ce que cette page contient</p>
        <ul class="sommaire__liste">
          <li><a href="#nos-pages">Nos pages</a></li>
          <li><a href="#nos-productions">Nos productions</a></li>
          <li><a href="#nos-sources">Nos sources</a></li>
          <li><a href="#nous-suivre">Nous suivre</a></li>
          <li><a href="#nous-ecrire">Nous écrire</a></li>
          <li><a href="#notre-methode">Nos prix et notre méthode</a></li>
          <li><a href="#pas-encore">Ce que nous n'avons pas encore — quatre rubriques</a></li>
        </ul>
      </nav>

      <!--
        ══ NOS PAGES ═════════════════════════════════════════════════════════════
        Onze entrées, toutes vers des adresses QUI RENDENT UNE PAGE RÉELLE. Les sept
        dernières lignes portent un intitulé de RÔLE (« Nos prix et notre méthode »)
        et non un intitulé de compartiment (« Le dossier de bord ») : un annuaire se
        lit par ce qu'on y cherche, pas par le nom de la pièce.

        Le commentaire d'origine est conservé, parce qu'il explique une ABSENCE :
        la page de contrôle interne (controle.gldigitallab.fr, `X-Robots-Tag: noindex`)
        n'est PAS ici. L'afficher la rendrait publique, ce qui contredirait le choix de
        la garder discrète. Décision à Gaëtan si tu veux l'ajouter.
      -->
      <section class="bloc" aria-labelledby="titre-pages">
        <h2 id="titre-pages" class="bloc__titre">
          <a class="bloc__ancre" href="#nos-pages" id="nos-pages">Nos pages</a>
          <span class="bloc__compte">11 adresses sur notre domaine</span>
        </h2>
        <ul class="liens">
          <li v-for="lien in liens" :key="lien.href">
            <RouterLink :to="lien.href" :class="['lien', lien.principal ? 'lien--principal' : '']">
              <span class="lien__icone" aria-hidden="true">{{ lien.icone }}</span>
              <span class="lien__corps">
                <span class="lien__titre">{{ lien.titre }}</span>
                <span class="lien__desc">{{ lien.desc }}</span>
              </span>
            </RouterLink>
          </li>
        </ul>
      </section>

      <section class="bloc" aria-labelledby="titre-productions">
        <h2 id="titre-productions" class="bloc__titre">
          <a class="bloc__ancre" href="#nos-productions" id="nos-productions">Nos productions</a>
          <span class="bloc__compte">ce que nous exploitons nous-mêmes</span>
        </h2>
        <ul class="liens">
          <li v-for="lien in productions" :key="lien.href">
            <a :href="lien.href" target="_blank" rel="noopener noreferrer" class="lien">
              <span class="lien__icone" aria-hidden="true">{{ lien.icone }}</span>
              <span class="lien__corps">
                <span class="lien__titre">{{ lien.titre }}</span>
                <span class="lien__desc">{{ lien.desc }}</span>
              </span>
              <span class="lien__hors" aria-hidden="true">↗</span>
            </a>
          </li>
        </ul>
      </section>

      <!--
        ══ NOS SOURCES ═══════════════════════════════════════════════════════════
        Section ajoutée le 19/09/2026, à la demande de Gaëtan : « juste un lien, en
        indiquant qu'ils sont source d'inspiration et source d'information ».

        ⚠️ CE QU'ELLE DIT, ET CE QU'ELLE NE DIT PAS. Elle dit : ces institutions sont
        des SOURCES — on les lit, on les cite, et chaque chiffre publié par le studio
        porte la sienne et sa date. Elle ne dit PAS : partenariat, affiliation,
        labellisation, ni validation. Le studio n'a aucune référence nominative, et le
        revendique. Un lien présenté comme un partenariat serait exactement la
        sur-promesse que `/dossier` s'interdit.

        Le CNRS y est par sa DÉLÉGATION HAUTS-DE-FRANCE : c'est la région du studio.
      -->
      <section class="bloc" aria-labelledby="titre-sources">
        <h2 id="titre-sources" class="bloc__titre">
          <a class="bloc__ancre" href="#nos-sources" id="nos-sources">Nos sources</a>
          <span class="bloc__compte">ce que nous lisons, jamais nos partenaires</span>
        </h2>
        <ul class="liens">
          <li v-for="lien in sources" :key="lien.href">
            <a :href="lien.href" target="_blank" rel="noopener noreferrer" class="lien">
              <span class="lien__icone" aria-hidden="true">{{ lien.icone }}</span>
              <span class="lien__corps">
                <span class="lien__titre">{{ lien.titre }}</span>
                <span class="lien__desc">{{ lien.desc }}</span>
              </span>
              <span class="lien__hors" aria-hidden="true">↗</span>
            </a>
          </li>
        </ul>
        <p class="bloc__note">
          <strong>Ce ne sont ni nos partenaires, ni nos clients, ni des labellisations.</strong>
          Ce sont les institutions dont nous lisons les travaux et citons les chiffres, avec
          leur date. Aucune n'a validé ce que ce studio produit, et aucune n'est engagée par
          ce que nous en disons.
        </p>
      </section>

      <!--
        ══ NOUS SUIVRE ═══════════════════════════════════════════════════════════
        ⚠️ DEUX ADRESSES EXISTENT DANS `src/config/contact.js` (`RESEAUX`), ET UNE
        SEULE EST POSÉE ICI. Ce n'est pas un oubli, c'est la mesure qui tranche :

          · `github.com/GaetanLgt` → HTTP 200, mesuré le 19/09/2026 à 11:35.
          · `linkedin.com/in/gldigitallab` → HTTP 999, mesuré à la même minute. Ce
            n'est pas un lien mort : c'est un refus de servir un client non navigateur.
            La vérification automatique ÉCHOUE sur cette adresse, donc elle n'est pas
            posée sans le dire. Elle reste dans le pied de page parce qu'elle y était
            déjà publiée avant cette page — la RETIRER serait une décision, et elle
            appartient à Gaëtan, pas à un agent.

        ⛔ AUCUN AUTRE RÉSEAU N'EST LISTÉ « AU CAS OÙ ». Un annuaire qui remplit une
        rubrique pour faire nombre met un lien mort sous un logo, et c'est plus grave
        ici qu'ailleurs : la seule fonction de cette page est d'être exacte.
      -->
      <section class="bloc" aria-labelledby="titre-suivre">
        <h2 id="titre-suivre" class="bloc__titre">
          <a class="bloc__ancre" href="#nous-suivre" id="nous-suivre">Nous suivre</a>
          <span class="bloc__compte">une adresse publiée sur ce domaine</span>
        </h2>
        <ul class="liens">
          <li v-for="lien in suivre" :key="lien.href">
            <a :href="lien.href" target="_blank" rel="noopener noreferrer" class="lien">
              <span class="lien__icone" aria-hidden="true">{{ lien.icone }}</span>
              <span class="lien__corps">
                <span class="lien__titre">{{ lien.titre }}</span>
                <span class="lien__desc">{{ lien.desc }}</span>
              </span>
              <span class="lien__hors" aria-hidden="true">↗</span>
            </a>
          </li>
        </ul>
        <p class="bloc__note">
          Une deuxième adresse est publiée dans le pied de page de ce site — le profil
          professionnel du studio. Elle n'est pas répétée ici : au moment où cette page a
          été écrite, elle refusait de répondre à une vérification automatique
          (<span class="bloc__valeur">HTTP 999</span>), donc nous ne pouvons pas affirmer
          qu'elle répond. <strong>Un lien qu'on ne peut pas mesurer ne se pose pas.</strong>
        </p>
      </section>

      <!--
        ══ NOUS ÉCRIRE ═══════════════════════════════════════════════════════════
        AUCUNE COORDONNÉE N'EST ÉCRITE ICI. `scripts/verifier-contact.mjs` refuse
        toute adresse ou tout numéro en dur hors de `src/config/contact.js` — et la
        page /contact les porte déjà, depuis cette source unique. Un annuaire qui
        recopierait un courriel créerait la deuxième valeur qui diverge un jour.
      -->
      <section class="bloc" aria-labelledby="titre-ecrire">
        <h2 id="titre-ecrire" class="bloc__titre">
          <a class="bloc__ancre" href="#nous-ecrire" id="nous-ecrire">Nous écrire</a>
          <span class="bloc__compte">par courriel, par téléphone, ou par le formulaire</span>
        </h2>
        <ul class="liens">
          <li v-for="lien in ecrire" :key="lien.href">
            <RouterLink :to="lien.href" class="lien">
              <span class="lien__icone" aria-hidden="true">{{ lien.icone }}</span>
              <span class="lien__corps">
                <span class="lien__titre">{{ lien.titre }}</span>
                <span class="lien__desc">{{ lien.desc }}</span>
              </span>
            </RouterLink>
          </li>
        </ul>
      </section>

      <!--
        ══ NOS PRIX ET NOTRE MÉTHODE ═════════════════════════════════════════════
        Trois portes, trois questions différentes : combien ça coûte et comment on
        travaille (le dossier), sur quoi on se contrôle (nos règles), et ce que le
        studio donne à voir comme preuve mesurée (le relevé du présent).
      -->
      <section class="bloc" aria-labelledby="titre-methode">
        <h2 id="titre-methode" class="bloc__titre">
          <a class="bloc__ancre" href="#notre-methode" id="notre-methode">Nos prix et notre méthode</a>
          <span class="bloc__compte">ce que nous facturons, et sur quoi nous sommes jugés</span>
        </h2>
        <ul class="liens">
          <li v-for="lien in methode" :key="lien.href">
            <RouterLink :to="lien.href" class="lien">
              <span class="lien__icone" aria-hidden="true">{{ lien.icone }}</span>
              <span class="lien__corps">
                <span class="lien__titre">{{ lien.titre }}</span>
                <span class="lien__desc">{{ lien.desc }}</span>
              </span>
            </RouterLink>
          </li>
        </ul>
        <p class="bloc__note">
          Deux de ces pages ne sont pas des arguments : elles sont là pour qu'on puisse
          <strong>nous opposer ce que nous nous imposons</strong>. Elles nomment ce que le
          studio s'interdit, ce qu'il n'a pas encore mis en place, et la mesure qui
          pourrait nous contredire.
        </p>
      </section>

      <!--
        ══ CE QUE NOUS N'AVONS PAS ENCORE ════════════════════════════════════════
        ⚠️ LA SECTION LA PLUS IMPORTANTE DE CETTE PAGE, ET LA PLUS FACILE À SUPPRIMER.

        Le CNRS peut publier onze rubriques parce qu'il a onze choses dans les onze.
        Ce studio en a six. Remplir les cinq autres ferait un annuaire plus long et
        plus faux — et un annuaire faux ne sert à personne, alors qu'un annuaire court
        et exact dit exactement ce qu'un visiteur a besoin de savoir avant d'écrire.

        ⛔ ON N'AJOUTE PAS DE FORMULAIRE D'INSCRIPTION À LA NEWSLETTER. Il n'y a pas
        de newsletter, donc il n'y a rien à recevoir ; et un formulaire impliquerait un
        outil tiers et une collecte de données — les deux choses que ce studio refuse
        par écrit. Un champ de saisie serait ici une promesse, pas une rubrique.
      -->
      <section class="bloc bloc--absent" aria-labelledby="titre-absent">
        <h2 id="titre-absent" class="bloc__titre bloc__titre--absent">
          <a class="bloc__ancre" href="#pas-encore" id="pas-encore">Ce que nous n'avons pas encore</a>
          <span class="bloc__compte">quatre rubriques, nommées plutôt que masquées</span>
        </h2>
        <p class="bloc__chapeau-petit">
          Ces quatre rubriques existent chez d'autres — chez le CNRS, elles sont pleines.
          Ici elles sont vides, et <strong>nous les affichons vides plutôt que de les
          retirer</strong> : un visiteur qui ne trouve pas la rubrique « recrutement » ne
          sait pas si le studio n'embauche pas ou s'il a mal cherché.
        </p>

        <ul class="absences">
          <li v-for="manque in absences" :key="manque.titre" class="absence">
            <p class="absence__titre">
              {{ manque.titre }}
              <span class="absence__etiquette">pas encore</span>
            </p>
            <p class="absence__texte">{{ manque.texte }}</p>
          </li>
        </ul>

        <p class="bloc__note">
          <strong>La phrase que nous employons, et qui vaut pour les quatre :</strong>
          « <em>Cette rubrique n'existe pas encore chez nous. Nous ne la remplissons pas, et
          nous ne la retirons pas : elle est écrite ici pour que personne ne la cherche.</em> »
        </p>
      </section>

      <!--
        ══ CE QUE CETTE PAGE NE GARANTIT PAS ═════════════════════════════════════
        Obligatoire ici plus qu'ailleurs : un annuaire est l'endroit exact où un lecteur
        suppose une complétude qu'on n'a pas promise. Ces trois limites sont vérifiables
        et aucune n'est une précaution de style.
      -->
      <section class="bloc bloc--limites" aria-labelledby="titre-limites">
        <h2 id="titre-limites" class="bloc__titre bloc__titre--sans-filets">
          Ce que cette page ne garantit pas
        </h2>
        <ul class="limites">
          <li v-for="limite in limites" :key="limite.titre">
            <strong>{{ limite.titre }}</strong> {{ limite.texte }}
          </li>
        </ul>
      </section>

      <p class="note">
        Studio indépendant français, dans la Somme. Tout le calcul d'intelligence
        artificielle tourne sur notre propre machine : aucune donnée client ne sort.
        <RouterLink to="/dossier">Voir le dossier professionnel</RouterLink>.
      </p>

      <p class="note note--source">
        La structure de cet annuaire est adaptée de la page
        <a href="https://www.cnrs.fr/fr/cbox/ontheweb" target="_blank" rel="noopener noreferrer">« Suivre
        et découvrir le CNRS sur le web »</a> — l'annuaire des liens du CNRS, que nous
        remercions pour la forme. <strong>Elle est adaptée, pas copiée</strong> : ses
        rubriques ne sont pas remplies, et les onze qu'il publie ne sont pas onze ici.
      </p>
    </div>
  </div>
</template>

<script setup>
/**
 * LES AMARRES — l'annuaire du studio. GL Digital Lab, 19/09/2026.
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 * POURQUOI CETTE PAGE EXISTE, ET POURQUOI ELLE A CHANGÉ DE FORME
 *
 * Créée le 10/09/2026 pour remplacer le « Linktree » que les fiches de
 * communication prescrivaient : un service tiers qui hébergerait nos liens, contre
 * la doctrine local-first du studio. Elle remplissait la même fonction, sur notre
 * domaine, avec quatre adresses.
 *
 * Le 19/09/2026, Gaëtan a envoyé l'annuaire du CNRS — « Suivre et découvrir le CNRS
 * sur le web », onze rubriques — avec une consigne de deux mots : « Tu adaptes ».
 *
 * Ce qui s'adapte n'est PAS la liste des onze rubriques. C'est LA RÈGLE qui rend cet
 * annuaire-là possible : le CNRS peut publier onze rubriques parce qu'il a onze
 * choses dans les onze. Le studio en a six, et n'en a pas cinq.
 *
 * ⛔ LA TENTATION, ET ELLE EST EXACTEMENT CE QU'IL NE FALLAIT PAS FAIRE.
 * Onze rubriques recopiées avec « à venir » sous celles qui sont vides feraient une
 * page plus longue, plus impressionnante, et FAUSSE sur une page dont la seule
 * fonction est d'être exacte. Le studio a une rubrique « pas encore » qui dit les
 * quatre absences en cinq lignes — parce qu'une rubrique vide affichée vaut mieux
 * qu'une rubrique vide masquée, mais qu'une rubrique de plus reste une rubrique de
 * trop.
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 * LA MESURE QUI COMMANDE TOUT — 19/09/2026, 11 h 35 (Europe/Paris)
 *
 *   https://github.com/GaetanLgt                 → HTTP 200   posé
 *   https://www.hauts-de-france.cnrs.fr/         → HTTP 200   posé (déjà en place)
 *   https://arkadia.gldigitallab.fr              → HTTP 200   posé (déjà en place)
 *   https://www.linkedin.com/in/gldigitallab/    → HTTP 999   NON posé, et c'est écrit
 *   https://www.cnrs.fr/fr/cbox/ontheweb         → HTTP 200   posé (la source de la forme)
 *
 * Le 999 n'est pas un lien mort : c'est un refus de servir un client non navigateur.
 * Sur une page de liens, la différence ne change PAS la décision — on ne pose pas ce
 * qu'on n'a pas pu vérifier — mais elle change la formulation : on écrit « refusait
 * de répondre à une vérification automatique », jamais « lien mort ». Un fait faux
 * énoncé au bénéfice de la prudence reste un fait faux.
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 * ⛔ CE QUI N'EST PAS DANS CETTE PAGE, ET NE DOIT PAS Y REVENIR
 *
 *   · aucun formulaire d'inscription à une newsletter (il n'y a pas de newsletter,
 *     donc rien à recevoir — et un formulaire impliquerait un outil tiers et une
 *     collecte de données) ;
 *   · aucune rubrique « recrutement », « presse » ou « événements » présentée comme
 *     ouverte : le studio n'embauche pas, n'a rien de public pour la presse, et ne
 *     tient aucun événement ;
 *   · aucune coordonnée en dur (courriel, téléphone) : `verifier-contact.mjs` refuse
 *     toute valeur écrite hors de `src/config/contact.js`, et la page /contact les
 *     porte déjà depuis cette source unique ;
 *   · aucun numéro de port, nom de fichier, chemin local, ni nom de modèle ;
 *   · aucun nom de franchise, de marque ou de personnage protégé : le verrou
 *     juridique lit ce composant ENTIER, commentaires retirés.
 */

// « Nos pages » — onze entrées, et chacune REND une page réelle : le contrôle de
// topographie du dépôt échoue si une adresse déclarée n'a pas de page derrière.
//
// Les sept dernières lignes menaient ailleurs dans la version précédente, et deux
// d'entre elles n'étaient pas sur cette page du tout (l'état du studio, les règles, le
// poste de l'assistante, le plan du site). Elles y sont maintenant : c'est ce que
// « tout le studio en un seul endroit » veut dire, et ça ne se déduit pas d'un titre.
const liens = [
  {
    href: '/services',
    icone: '🔍',
    titre: 'Nos métiers et nos services',
    desc: "Audit web 48 h, sites sur-mesure, applications métier, IA locale. Ce que le studio fait, et pour qui.",
    principal: true,
  },
  {
    href: '/projets',
    icone: '🧭',
    titre: 'Projets et études de cas',
    desc: 'Ce que le studio a produit — dont ARKADIA France, exploité 18 mois.',
  },
  {
    href: '/dossier',
    icone: '📄',
    titre: 'Nos prix et notre méthode',
    desc: 'La grille complète, les délais, la méthode, et les limites que nous assumons.',
  },
  {
    href: '/arkadia',
    icone: '🕸️',
    titre: 'Notre preuve en production',
    desc: "L'étude de cas de notre réseau : ce qui tourne, depuis quand, et à quelle échelle mesurée.",
  },
  {
    href: '/ce-que-nous-nous-imposons',
    icone: '⚖️',
    titre: 'Nos engagements',
    desc: "Ce que le studio s'interdit, ce qu'il se contrôle, et ce que ses règles ne garantissent pas.",
  },
  {
    href: '/etat-du-studio',
    icone: '📊',
    titre: "L'état du studio, mesuré",
    desc: 'Le présent réel : build livré, horodatage, poids, requêtes, verdict des contrôles. Remesuré à chaque construction.',
  },
  {
    href: '/ia-de-bord',
    icone: '🗣️',
    titre: "Le poste de l'assistante",
    desc: "L'intelligence qui vit à bord, ses périmètres séparés, sa mémoire — et ses limites dites franchement.",
  },
  {
    href: '/contact',
    icone: '✉️',
    titre: 'Nous écrire',
    desc: 'Premier échange de 30 minutes, gratuit et sans engagement.',
  },
  {
    href: '/sitemap',
    icone: '🗺️',
    titre: 'Le plan du site',
    desc: 'Arborescence complète du site, y compris les pages que la navigation ne montre pas.',
  },
  {
    href: '/soute',
    icone: '📦',
    titre: 'La soute',
    desc: 'La carte complète des compartiments du navire. Rien n\'est verrouillé, rien ne quitte votre navigateur.',
  },
  {
    href: '/apps',
    icone: '🛠️',
    titre: "Les outils de l'équipage",
    desc: 'Sept applications du studio, décrites par leur rôle : audit de sécurité, supervision, base de connaissances, contenu, devis.',
  },
];

// Nos productions publiques. Une seule règle : ne lister QUE ce qui est réellement
// en ligne et joignable — vérifié de nouveau le 19/09/2026 (arkadia.gldigitallab.fr
// → HTTP 200, 17 649 octets servis).
const productions = [
  {
    href: 'https://arkadia.gldigitallab.fr',
    icone: '🕸️',
    titre: 'ArkAdiA — le réseau triple A',
    desc: 'Notre réseau social : amitié, aventure, art. Landing publique sur notre domaine, moteur sur notre serveur.',
  },
];

// Nos SOURCES. Ce ne sont pas nos partenaires, ni nos clients, ni des labellisations :
// ce sont les institutions dont le studio lit les travaux et cite les chiffres, avec
// leur date.
//
// ⚠️ Deux autres sources sont légitimes et vérifiées, mais NE SONT PAS ICI : l'ANSSI
// (source primaire du communiqué du 07/09/2026 sur REACTIV) et la Banque centrale
// européenne (communiqué du 23/07/2026 sur la refonte des billets). Elles ont été
// proposées le 19/09 ; Gaëtan a demandé « juste un lien ». Ne pas les ajouter sans
// son accord — une page de sources n'est pas une page de collecte.
const sources = [
  {
    href: 'https://www.hauts-de-france.cnrs.fr/',
    icone: '🔬',
    titre: 'CNRS — délégation Hauts-de-France',
    desc: "Source d'inspiration et source d'information : les travaux que nous lisons, et dont nous citons les chiffres avec leur date.",
  },
];

// « Nous suivre » — UNE SEULE ENTRÉE, ET C'EST UNE MESURE QUI DÉCIDE.
// `RESEAUX` (src/config/contact.js) porte deux adresses. La seconde
// (le profil professionnel du studio) a répondu HTTP 999 le 19/09/2026 : refus de
// servir un client non navigateur, pas lien mort. On ne pose donc que celle qui a
// répondu, et on écrit l'autre dans une note plutôt que de la faire disparaître.
const suivre = [
  {
    href: 'https://github.com/GaetanLgt',
    icone: '🐙',
    titre: 'GitHub — le compte du studio',
    desc: 'Le code, les dépôts publics et les contributions. Vérifié le 19 septembre 2026 : la page répond.',
  },
];

// « Nous écrire » — l'entrée pointe vers la page qui porte les coordonnées, et n'en
// recopie aucune : c'est ce que le contrôle de contact du dépôt exige.
const ecrire = [
  {
    href: '/contact',
    icone: '✉️',
    titre: 'Coordonnées et premier échange',
    desc: 'Le courriel, le téléphone et le formulaire, depuis une seule source. Réponse sous 24 h ouvrées.',
  },
];

// « Nos prix et notre méthode » — trois portes, trois questions différentes.
const methode = [
  {
    href: '/dossier',
    icone: '📄',
    titre: 'Prix publics, délais et méthode',
    desc: 'La grille hors taxes complète, les délais tenus, et les limites que nous assumons par écrit.',
  },
  {
    href: '/ce-que-nous-nous-imposons',
    icone: '⚖️',
    titre: 'Nos règles, publiées pour être opposées',
    desc: "Aucune plateforme qui centralise vos données, aucun chiffre sans source ni date, aucune décision déléguée.",
  },
  {
    href: '/etat-du-studio',
    icone: '📊',
    titre: 'Notre contrôle, remesuré à chaque build',
    desc: 'Ce que les contrôles du dépôt ont réellement répondu, daté — y compris quand ils échouent.',
  },
];

/* ── LES ABSENCES, NOMMÉES ──────────────────────────────────────────────────────
   ⚠️ CHAQUE ENTRÉE DIT UNE CHOSE QUE LE STUDIO NE PEUT PAS FAIRE AUJOURD'HUI.
   Aucune n'est une réserve de politesse : ce sont quatre faits vérifiables, et trois
   d'entre eux tiennent à des décisions déjà prises et écrites ailleurs dans le dépôt.

   ⛔ Ne pas transformer ces entrées en « bientôt disponible ». Le studio n'a pas
   planifié ces rubriques : il a constaté leur absence. Écrire « bientôt » serait
   inventer une date, ce que la règle « aucun chiffre sans source ni date » interdit
   aussi sûrement qu'un faux prix. */
const absences = [
  {
    titre: 'Newsletter',
    texte:
      "Il n'y en a pas. Aucune liste d'adresses, aucun envoi, aucun prestataire d'emailing — et donc aucun encart d'inscription sur cette page. Ce n'est pas un manque de temps : c'est le refus de détenir une liste de noms pour son propre compte. Si cela change un jour, la rubrique s'ouvrira avec la source qui la portera, pas avant.",
  },
  {
    titre: 'Recrutement',
    texte:
      "Le studio n'embauche pas. Il n'y a ni offre, ni candidature spontanée à envoyer, ni processus derrière un formulaire. Cette rubrique existe chez d'autres annuaires parce qu'ils ont des postes à pourvoir ; ici elle est vide, et le dire évite à quelqu'un d'écrire pour rien.",
  },
  {
    titre: 'Presse et médias',
    texte:
      "Rien de public. Pas de dossier de presse, pas de logo à télécharger, pas de contact dédié aux journalistes — et pas de kit mis en avant pour faire nombre. Les questions reçoivent une réponse : elles passent par la page de contact, comme les autres.",
  },
  {
    titre: 'Événements',
    texte:
      "Aucun. Le studio ne tient pas de rencontre, ne participe à aucun salon en tant qu'exposant, et n'a pas de calendrier à publier. Une rubrique « événements » vide est ce que beaucoup d'annuaires remplissent de dates passées : nous préférons ne pas l'ouvrir.",
  },
];

/* ── LES LIMITES DE CETTE PAGE ──────────────────────────────────────────────────
   Trois limites, toutes vérifiables, aucune de politesse. Un annuaire est l'endroit
   exact où un lecteur suppose une complétude qu'on ne lui a pas promise. */
const limites = [
  {
    titre: 'Elle ne sera pas à jour d\'elle-même.',
    texte:
      "Rien ne l'alimente automatiquement : chaque entrée est écrite à la main, et une adresse qui cesse de répondre reste affichée jusqu'à ce que quelqu'un la mesure. La page qui, elle, se remesure à chaque construction est l'état du studio — pas celle-ci.",
  },
  {
    titre: 'Elle ne liste pas tout ce qui existe.',
    texte:
      "Tenir un annuaire, c'est choisir ce qu'on n'y met pas, et nous avons des exclusions assumées : la page de contrôle interne du studio n'y figure pas, parce qu'elle est volontairement hors des moteurs et qu'un lien public la rendrait publique. D'autres adresses existent sans être ici.",
  },
  {
    titre: 'Une adresse qui répond n\'est pas une adresse utile.',
    texte:
      "Les contrôles de cette page disent qu'une cible a répondu, avec son code et sa date. Ils ne disent pas que son contenu est à jour, ni qu'il correspond à ce que notre description en annonce — c'est-à-dire qu'ils mesurent l'accessibilité, pas la pertinence.",
  },
];

// Le titre de la page est traité par le pied de page et par la navigation, comme sur
// les autres pages du site : cette vue n'a ni état, ni effet, ni appel réseau. Elle
// est donc entièrement lisible dans le HTML prérendu — y compris la section des
// absences, qui est du texte, pas un composant conditionnel.
</script>

<style scoped>
/* ─────────────────────────────────────────────────────────────────────────────
   AUCUNE COULEUR EN DUR, AUCUN JETON REDÉCLARÉ.
   Toutes les valeurs viennent de `src/assets/styles/variables.css` : un jeton de
   couleur redéclaré hors de ce fichier fait échouer `verifier-verrous.mjs`.

   CONTRASTES EMPLOYÉS ICI, mesurés sur les DEUX fonds de la charte D6
   (outil : la fonction de contraste de `scripts/verifier-verrous.mjs`) :
     --ink        / --paper 17,14:1  · / --paper-alt 16,39:1   texte principal
     --ink-soft   / --paper  9,75:1  · / --paper-alt  9,32:1   texte courant
     --accent     / --paper  9,36:1  · / --paper-alt  8,95:1   titres, ancres, filets
     --action     / --paper 15,62:1  · / --paper-alt 14,94:1   l'étiquette « pas encore »
     --action-ink / --action 15,62:1                            texte sur l'étiquette
     --rule-strong/ --paper  3,73:1  · / --paper-alt  3,57:1   SEULE bordure fonctionnelle
     --alert      / --paper  6,85:1  · / --paper-alt  6,55:1   filet de la section des absences

   `--rule` (1,14:1) n'est utilisé nulle part ici : le verrou le dit décoratif, et une
   carte de lien est un contrôle. Un jeton ne « passe » pas dans l'absolu — il passe sur
   un fond donné, et c'est pourquoi les deux fonds sont écrits ci-dessus.

   MOUVEMENT : deux transitions au survol (bordure, léger déplacement), aucune animation
   automatique, aucun défilement, aucun clignotement. Les deux sont neutralisées sous
   `prefers-reduced-motion: reduce`.
   ───────────────────────────────────────────────────────────────────────────── */

.liens-page {
  min-height: 100vh;
  background: var(--paper);
  color: var(--ink);
  padding: 4rem 1.25rem 6rem;
}

.enveloppe {
  max-width: 52rem;
  margin: 0 auto;
}

/* ── La tête ─────────────────────────────────────────────────────────────── */
.page-header {
  margin: 0 0 3rem;
}

.header-badge {
  display: inline-flex;
  align-items: center;
  gap: var(--space-xs);
  border: 1px solid var(--rule-strong);
  border-radius: 999px;
  padding: 0.35rem 0.9rem;
  margin: 0 0 1.5rem;
}

.badge-icon {
  font-size: 1rem;
  line-height: 1;
}

.badge-text {
  font-family: var(--font-mono);
  font-size: 0.72rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--ink-soft);
}

.page-title {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  margin: 0 0 1.25rem;
  font-size: clamp(2rem, 6vw, 3.4rem);
  line-height: 1.05;
}

.title-pre {
  font-size: 0.5em;
  font-weight: 500;
  color: var(--ink-soft);
}

.title-main {
  font-weight: 700;
  letter-spacing: -0.01em;
}

.page-desc {
  max-width: 46ch;
  color: var(--ink-soft);
  font-size: 1.05rem;
  line-height: 1.7;
  margin: 0 0 1rem;
}

.page-desc strong {
  color: var(--ink);
}

.page-date {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  letter-spacing: 0.06em;
  color: var(--ink-soft);
  margin: 0;
}

/* ── Le sommaire — des ancres, lisibles sans JavaScript ──────────────────── */
.sommaire {
  border: 1px solid var(--rule-strong);
  border-radius: 10px;
  padding: 1.1rem 1.25rem 1.25rem;
  margin: 0 0 3rem;
}

.sommaire__titre {
  font-family: var(--font-mono);
  font-size: 0.72rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--ink-soft);
  margin: 0 0 0.75rem;
}

.sommaire__liste {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 0.45rem 1.5rem;
  grid-template-columns: repeat(auto-fit, minmax(15rem, 1fr));
}

.sommaire__liste a {
  color: var(--accent);
  text-decoration: none;
  font-size: 0.95rem;
}

.sommaire__liste a:hover,
.sommaire__liste a:focus-visible {
  color: var(--accent-ink);
  text-decoration: underline;
}

/* ── Les blocs ───────────────────────────────────────────────────────────── */
.bloc {
  margin: 0 0 3.25rem;
}

.bloc__titre {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 0.4rem 1rem;
  margin: 0 0 1rem;
  padding-bottom: 0.6rem;
  border-bottom: 1px solid var(--rule-strong);
  font-size: 1.1rem;
  font-weight: 500;
}

.bloc__ancre {
  color: var(--ink);
  text-decoration: none;
  scroll-margin-top: 5rem;
}

.bloc__ancre:hover,
.bloc__ancre:focus-visible {
  color: var(--accent);
  text-decoration: underline;
}

.bloc__compte {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--ink-soft);
}

.bloc__titre--sans-filets {
  border-bottom: none;
}

.bloc__chapeau-petit {
  color: var(--ink-soft);
  font-size: 0.98rem;
  line-height: 1.7;
  margin: 0 0 1.25rem;
}

.bloc__chapeau-petit strong {
  color: var(--ink);
}

.bloc__note {
  margin: 1rem 0 0;
  padding-left: 1rem;
  border-left: 2px solid var(--rule-strong);
  color: var(--ink-soft);
  font-size: 0.95rem;
  line-height: 1.7;
}

.bloc__note strong {
  color: var(--ink);
}

.bloc__valeur {
  font-family: var(--font-mono);
  font-size: 0.9em;
  color: var(--ink);
}

/* ── Les listes de liens ─────────────────────────────────────────────────── */
.liens {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: var(--space-sm);
}

.lien {
  display: flex;
  align-items: flex-start;
  gap: var(--space-sm);
  padding: 1.1rem 1.25rem;
  border: 1px solid var(--rule-strong);
  border-radius: 10px;
  background: var(--paper-alt);
  color: inherit;
  text-decoration: none;
  transition: border-color var(--transition-fast), transform var(--transition-fast);
}

.lien:hover,
.lien:focus-visible {
  border-color: var(--accent);
  transform: translateY(-1px);
}

/* L'indicateur de focus est explicite : la page est un point d'entrée depuis les
   réseaux, donc souvent utilisée au clavier sur mobile. */
.lien:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 3px;
}

/* L'entrée d'appel : elle porte le seul jeton d'ACTION de la page, réservé à ce qui
   fait agir. Le reste de l'annuaire est de la lecture. */
.lien--principal {
  background: var(--action);
  border-color: var(--action);
  color: var(--action-ink);
}

.lien--principal .lien__titre {
  color: var(--action-ink);
}

.lien--principal .lien__desc {
  color: var(--action-ink);
  opacity: 0.92;
}

.lien--principal:hover,
.lien--principal:focus-visible {
  background: var(--action-dark);
  border-color: var(--action-dark);
}

.lien--principal:focus-visible {
  outline-color: var(--ink);
}

.lien__icone {
  font-size: 1.4rem;
  line-height: 1;
}

.lien__corps {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.lien__titre {
  font-size: 1.05rem;
  font-weight: 600;
}

.lien__desc {
  color: var(--ink-soft);
  font-size: 0.95rem;
  line-height: 1.55;
}

/* Marqueur de lien sortant : le visiteur doit savoir qu'il quitte le domaine. */
.lien__hors {
  margin-left: auto;
  color: var(--ink-soft);
  font-size: 1.05rem;
  line-height: 1;
}

.lien--principal .lien__hors {
  color: var(--action-ink);
}

/* ── Les absences ────────────────────────────────────────────────────────── */
/* Le filet `--alert` (6,85:1 sur le fond) marque un état de lecture, pas une panne :
   c'est le même jeton que « le geste non tenu » de la page des règles, et la
   cohérence entre pages fait partie de ce qu'un lecteur vérifie sans le dire. */
.bloc--absent {
  border-left: 3px solid var(--alert);
  padding-left: 1.25rem;
}

.bloc__titre--absent {
  border-bottom-color: var(--alert);
}

.absences {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 1rem;
}

.absence {
  background: var(--paper-alt);
  border: 1px solid var(--rule-strong);
  border-radius: 10px;
  padding: 1rem 1.25rem;
}

.absence__titre {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.6rem;
  margin: 0 0 0.4rem;
  font-family: var(--font-mono);
  font-size: 0.92rem;
  color: var(--ink);
}

.absence__etiquette {
  font-family: var(--font-mono);
  font-size: 0.68rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--action-ink);
  background: var(--action);
  border-radius: 2px;
  padding: 0.15rem 0.45rem;
}

.absence__texte {
  margin: 0;
  color: var(--ink-soft);
  font-size: 0.95rem;
  line-height: 1.7;
}

/* ── Les limites ─────────────────────────────────────────────────────────── */
.bloc--limites {
  background: var(--paper-alt);
  border-radius: 10px;
  padding: 1.5rem 1.5rem 0.5rem;
}

.limites {
  list-style: none;
  margin: 0;
  padding: 0;
}

.limites li {
  position: relative;
  padding: 0 0 1rem 1.4rem;
  line-height: 1.7;
  color: var(--ink-soft);
}

.limites li::before {
  content: '—';
  position: absolute;
  left: 0;
  color: var(--accent);
}

.limites strong {
  color: var(--ink);
}

/* ── Les notes de pied ───────────────────────────────────────────────────── */
.note {
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid var(--rule-strong);
  color: var(--ink-soft);
  font-size: 0.9rem;
  line-height: 1.7;
}

.note--source {
  margin-top: 1.25rem;
  padding-top: 0;
  border-top: none;
  font-size: 0.85rem;
}

.note a {
  color: var(--accent);
  text-decoration: underline;
  text-underline-offset: 3px;
}

.note a:hover,
.note a:focus-visible {
  color: var(--accent-ink);
}

/* ── Le calme demandé est respecté ───────────────────────────────────────── */
@media (prefers-reduced-motion: reduce) {
  .lien {
    transition: none;
  }
  .lien:hover,
  .lien:focus-visible {
    transform: none;
  }
}

@media (max-width: 640px) {
  .liens-page {
    padding: 3rem 1rem 4rem;
  }
  .bloc--absent {
    padding-left: 0.85rem;
  }
  .bloc--limites {
    padding: 1.25rem 1.25rem 0.25rem;
  }
}
</style>
