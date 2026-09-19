<template>
  <!--
    ⚠️ `<div>` ET NON `<main>` — MÊME RAISON QU'À LA SOUTE (relevé le 13/09/2026).
    `App.vue` pose déjà `<main id="main-content" role="main">` autour de tout le contenu
    rendu par le routeur. Une page qui en ajoute un second produit un repère `main`
    IMBRIQUÉ : deux constats d'accessibilité pour une seule page
    (`landmark-main-is-top-level`, `landmark-no-duplicate-main`). Un document n'a qu'un
    seul contenu principal. La classe porte la mise en page, pas la sémantique.
  -->
  <div class="ia-bord">
    <div class="ia-bord__enveloppe">

      <!-- ── Le retour, en haut ET en bas ─────────────────────────────────────
           Même règle qu'à la soute : ce n'est pas un cul-de-sac. On repart sans
           chercher, et on peut aussi rejoindre la salle des machines depuis le
           bas de la page. -->
      <RouterLink to="/" class="ia-bord__retour">← Revenir sur la passerelle</RouterLink>

      <header class="ia-bord__tete">
        <p class="ia-bord__sur-titre">Compartiment de bord · la pièce qui parle</p>
        <h1 class="ia-bord__titre">L'IA de bord</h1>
        <p class="ia-bord__chapeau">
          Le navire a une passerelle, une salle des machines, une soute et un dossier de
          bord. Il lui manquait une pièce : <strong>l'intelligence qui vit à bord, et à
          qui le capitaine parle</strong>. Cette page décrit ce poste — ce qu'il fait,
          qui le compose, et <strong>ce qu'il ne fait pas</strong>.
        </p>
      </header>

      <!-- ══ LA VOIX DE BORD ═════════════════════════════════════════════════ -->
      <section class="ia-bord__bloc" aria-labelledby="titre-voix">
        <h2 id="titre-voix" class="ia-bord__sous-titre">La voix de bord</h2>
        <p>
          La voix de bord est l'interlocutrice du capitaine. <strong>Elle écoute et elle
          répond</strong>, sur le canal du studio, et elle le fait <strong>en local</strong> :
          la parole reçue n'est pas envoyée à un service extérieur pour être comprise, et
          la réponse n'est pas fabriquée ailleurs. C'est la même règle que pour le reste
          du navire — ce qui se dit à bord reste à bord.
        </p>
        <p>
          Elle n'est pas l'équipage, et c'est une distinction qui compte : <strong>elle
          est la porte d'entrée, pas la main-d'œuvre</strong>. Quand la demande dépasse
          son périmètre, elle passe la consigne au poste compétent plutôt que d'improviser
          une réponse. Un poste qui répond hors de son domaine n'est pas plus serviable :
          il est moins fiable, et il ne le dit pas.
        </p>
        <p class="ia-bord__note">
          Elle n'a pas d'yeux : elle écoute, elle lit, elle ne regarde pas. Ce point est
          repris dans les limites, plus bas, parce qu'il décide de ce qu'on peut lui
          confier.
        </p>
      </section>

      <!-- ══ L'ÉQUIPAGE — SEPT POSTES ════════════════════════════════════════ -->
      <section class="ia-bord__bloc" aria-labelledby="titre-equipage">
        <h2 id="titre-equipage" class="ia-bord__sous-titre">L'équipage : sept postes, sept périmètres</h2>
        <p>
          Le navire porte <strong>sept postes de travail distincts</strong> : la voix, et
          six postes d'équipage. Chacun a une mission séparée, et surtout
          <strong>une frontière explicite</strong>. C'est le vrai sujet de cette page :
          <em>chaque poste sait ce qu'il ne fait pas</em>. Un équipage sans frontières
          produit des réponses plausibles et fausses ; c'est exactement ce que le studio
          refuse de livrer.
        </p>

        <ul class="ia-bord__postes">
          <li v-for="poste in postes" :key="poste.cle" class="ia-bord__poste">
            <p class="ia-bord__poste-nom">{{ poste.nom }}</p>
            <p class="ia-bord__poste-role">{{ poste.role }}</p>
            <p class="ia-bord__poste-fait">
              <span class="ia-bord__etiquette">Ce qu'il fait</span>
              {{ poste.fait }}
            </p>
            <p class="ia-bord__poste-borne">
              <span class="ia-bord__etiquette">Où il s'arrête</span>
              {{ poste.borne }}
            </p>
          </li>
        </ul>

        <p class="ia-bord__note">
          Aucun de ces postes ne décide de la destination. Ils abattent le travail de
          routine et rendent des comptes ; <strong>ils ne choisissent pas ce qu'on
          livre</strong>. C'est la règle du bord, et elle n'a pas d'exception.
        </p>
      </section>

      <!-- ══ LA MÉMOIRE DU NAVIRE ════════════════════════════════════════════ -->
      <section class="ia-bord__bloc" aria-labelledby="titre-memoire">
        <h2 id="titre-memoire" class="ia-bord__sous-titre">La mémoire du navire</h2>
        <p>
          Une intelligence de bord sans mémoire recommence chaque quart à zéro. Le studio
          tient donc deux règles d'écriture, et elles coûtent du temps à chaque session :
        </p>
        <ul class="ia-bord__liste">
          <li>
            <strong>Les consignes sont réécrites après chaque synthèse de session.</strong>
            Une consigne qui n'est écrite que dans l'échange en cours disparaît avec lui :
            le poste suivant ne l'a jamais lue. On réécrit donc les consignes <em>après</em>
            la synthèse, pas avant — sinon la synthèse emporte ce qu'elle vient de résumer.
          </li>
          <li>
            <strong>Les documents de référence sont lus à la demande, jamais récités.</strong>
            Un chiffre retenu de mémoire est un chiffre qui a vieilli sans le dire. Quand
            une décision dépend d'un document, on ouvre le document — et s'il contredit la
            conclusion, c'est la conclusion qui tombe.
          </li>
        </ul>
        <p>
          La mémoire du bord n'est pas un résumé du studio : c'est <strong>une trace datée
          et sourcée</strong>. Une affirmation sans source n'y entre pas, et « je ne sais
          pas » y est une réponse valable — souvent la meilleure.
        </p>
      </section>

      <!-- ══ LES GARDES ══════════════════════════════════════════════════════ -->
      <section class="ia-bord__bloc" aria-labelledby="titre-gardes">
        <h2 id="titre-gardes" class="ia-bord__sous-titre">Les gardes</h2>
        <p>
          Le studio s'impose quatre verrous, et il les <strong>mesure à chaque
          construction du site</strong> plutôt que de les promettre. Ce sont des contrôles
          automatiques : quand l'un tombe, la construction échoue, et rien ne part en
          ligne. On les nomme, parce qu'un garde qu'on ne nomme pas ne garde rien.
        </p>
        <dl class="ia-bord__gardes">
          <div v-for="garde in gardes" :key="garde.nom" class="ia-bord__garde">
            <dt>{{ garde.nom }}</dt>
            <dd>{{ garde.mesure }}</dd>
          </div>
        </dl>
        <p class="ia-bord__note">
          Ces seuils sont des <strong>règles de conduite</strong>, pas des scores du jour.
          Un chiffre mesuré une fois vieillit ; un seuil tient. Ils ne se descendent pas
          parce qu'un contrôle a échoué : ou bien on corrige la page, ou bien la direction
          décide de changer la charte — et elle le dit.
        </p>
      </section>

      <!-- ══ LES LIMITES ═════════════════════════════════════════════════════ -->
      <section class="ia-bord__bloc ia-bord__bloc--limites" aria-labelledby="titre-limites">
        <h2 id="titre-limites" class="ia-bord__sous-titre">Ce que ce poste ne fait pas</h2>
        <p>
          Une page qui n'admettrait aucune limite ne serait pas crédible ici. Voici les
          trois qui comptent le plus, et elles sont assumées telles quelles.
        </p>
        <ul class="ia-bord__liste">
          <li>
            <strong>Elle ne juge pas le visuel.</strong> Elle n'a pas d'yeux : elle ne voit
            ni un espacement raté, ni une image mal cadrée, ni une couleur qui jure. Elle
            peut décrire une mesure de contraste, pas dire si une page est belle. Le goût
            reste dehors, et c'est très bien ainsi.
          </li>
          <li>
            <strong>Le studio n'a pas de squelette d'animation.</strong> Nous n'avons pas
            de bibliothèque de mouvements réutilisable — de ces enchaînements de
            personnage prêts à poser sur un modèle 3D. Nous produisons des objets et des
            scènes, pas des corps qui jouent. Le dire vaut mieux que de laisser croire
            l'inverse.
          </li>
          <li>
            <strong>Le verdict final appartient à l'humain.</strong> Aucun poste de
            l'équipage ne tranche seul une décision visuelle, stratégique, juridique ou
            budgétaire : ces points remontent au capitaine. La machine sert, l'humain
            décide — c'est la première ligne du règlement de bord, et elle engage aussi
            cette page.
          </li>
        </ul>
      </section>

      <!-- ── Les deux sorties ───────────────────────────────────────────────── -->
      <p class="ia-bord__sorties">
        <RouterLink to="/apps" class="ia-bord__sortie">
          Voir les outils de l'équipage →
        </RouterLink>
        <RouterLink to="/services" class="ia-bord__sortie-secondaire">
          Voir ce que le navire livre
        </RouterLink>
      </p>

      <RouterLink to="/" class="ia-bord__retour">← Revenir sur la passerelle</RouterLink>
    </div>
  </div>
</template>

<script setup>
/**
 * L'IA DE BORD — le poste de l'assistante du navire. GL Digital Lab, 19/09/2026.
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 * CE QUE CETTE PAGE EST : UNE ADAPTATION DE GENRE, ET RIEN DE PLUS.
 *
 * Le studio a repris la GRAMMAIRE de l'assistant de bord telle qu'elle apparaît dans
 * la culture populaire du vaisseau et de son intelligence de bord — un capitaine, un
 * navire, une intelligence à qui l'on parle, une génération d'assistants qui se
 * succèdent. C'est une grammaire narrative, pas un contenu.
 *
 * Il l'a ensuite exprimée dans SA propre fiction (le navire ARKADIA, la passerelle, la
 * salle des machines, la soute, le dossier de bord) et dans SA propre technique (des
 * postes d'agents aux périmètres séparés, des verrous mesurés à chaque construction).
 *
 * AUCUN ÉLÉMENT PROTÉGÉ N'EST REPRIS : aucun nom de personnage, aucune image, aucun
 * texte, aucun nom de franchise — la culture populaire est nommée comme culture, jamais
 * par sa marque. Le verrou juridique (`scripts/verifier-verrous.mjs`, VERROU 4) lit le
 * composant ENTIER, commentaires retirés : les mentions internes ont le droit d'exister,
 * seule la chaîne réellement rendue est surveillée. C'est le motif du dépôt.
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 * D'OÙ VIENNENT LES POSTES, ET POURQUOI LES NOMS NE SONT PAS DANS LE GABARIT.
 *
 * Les six postes d'équipage sont ceux que le site publie DÉJÀ sous « l'équipage » —
 * la source est `src/data/agents.js` (和 Wa, 誠 Makoto, 美 Bi, 実 Jitsu, 動 Dou,
 * 私 Watashi), dont les rôles sont repris ici SANS les outils, SANS les versions
 * logicielles et SANS les niveaux de compétence : publier une pile technique interne
 * sur un site public, c'est publier un plan de reconnaissance. *On décrit le rôle,
 * jamais l'architecture.*
 *
 * Les noms des agents ne sont donc PAS recopiés dans le contenu rendu : chaque poste
 * est décrit par sa FONCTION, ce qui est de toute façon le vrai sujet de la page.
 * Les frontières (« où il s'arrête ») sont dérivées du découpage réel de `agents.js`
 * et des pages d'applications de `src/views/apps/` — pas inventées pour la fiche.
 *
 * ⚠️ CE QUI N'EST VOLONTAIREMENT PAS ÉCRIT, ET QUI NE DOIT PAS Y REVENIR :
 *   · aucun numéro de port (un plan de ports publié est un plan d'attaque) ;
 *   · aucun nom de fichier, aucun chemin local, aucun nom de modèle d'IA ;
 *   · aucune version logicielle interne (ex. « Symfony 8 » figure dans `agents.js` :
 *     cette version n'a rien à faire sur une page publique) ;
 *   · aucun chiffre non mesuré — les seuls nombres de cette page sont les seuils
 *     réellement tenus par les scripts du dépôt (1 Mo, 14 requêtes, 4,5:1, 3:1, 2 familles) ;
 *   · aucune donnée personnelle du dirigeant.
 *
 * ⚠️ LE CHIFFRE « SEPT » EST UN COMPTE, PAS UNE DÉCLARATION DE PRODUIT.
 * Il vaut pour les postes décrits ci-dessous : la voix + les six postes d'équipage.
 * Si un poste s'ajoute ou disparaît, ce tableau et le texte d'introduction changent
 * ensemble — sinon la page devient fausse en silence.
 */

/**
 * Les six postes d'équipage + la voix de bord, décrits par leur rôle et leur frontière.
 * L'ordre suit la table de `agents.js` : orchestration, sécurité et qualité, interface,
 * réalisation, veille, mémoire.
 */
const postes = [
  {
    cle: 'voix',
    nom: 'La voix',
    role: 'Poste d\'écoute et de réponse · en local',
    fait: 'Elle reçoit la parole du capitaine, la comprend sur place et répond. Elle reformule une demande floue avant d\'engager un poste, et elle dit quand elle n\'a pas compris plutôt que de deviner.',
    borne: 'Elle ne produit pas le livrable et ne juge pas le résultat. Quand la demande sort de son périmètre, elle passe la consigne au poste compétent.',
  },
  {
    cle: 'orchestration',
    nom: 'Le timonier',
    role: 'Orchestration et coordination',
    fait: 'Il reçoit la demande, la découpe, l\'oriente vers le bon poste et rassemble les réponses en une seule. Il tient le fil entre deux sessions pour qu\'une consigne ne se perde pas en route.',
    borne: 'Il ne tranche pas à la place d\'un poste spécialisé, et il ne décide pas de la destination. Router n\'est pas décider.',
  },
  {
    cle: 'securite',
    nom: 'La vigie de sûreté',
    role: 'Sécurité et contrôle qualité',
    fait: 'Elle relève les vulnérabilités d\'un projet et de ses dépendances, surveille les secrets et les certificats, et exécute les tests — y compris ceux qui doivent échouer.',
    borne: 'Elle constate et rapporte, elle ne décide pas de corriger. Un rapport de sûreté n\'autorise rien à lui seul.',
  },
  {
    cle: 'interface',
    nom: 'Le charpentier de coque',
    role: 'Interface et rendu',
    fait: 'Il construit ce que le visiteur voit et touche : structure des pages, composants, mise en page, animations — toujours sous contrainte de contraste et de poids.',
    borne: 'Il ne choisit pas l\'identité visuelle du studio, et il ne valide pas son propre ouvrage à l\'œil. Un rendu ne s\'auto-approuve pas.',
  },
  {
    cle: 'realisation',
    nom: 'Le maître d\'équipage',
    role: 'Réalisation et livraison',
    fait: 'Il prend en charge le socle technique, les interfaces de service, la chaîne de construction et la mise en ligne, avec la vérification qui suit le déploiement.',
    borne: 'Il ne met rien en ligne sans l\'accord du capitaine. La chaîne est prête à livrer ; c\'est l\'humain qui appuie.',
  },
  {
    cle: 'veille',
    nom: 'Le veilleur',
    role: 'Surveillance et veille',
    fait: 'Il regarde les indicateurs de la machine et des services, repère les écarts par rapport à l\'habitude, et alerte par paliers plutôt que tout au même niveau.',
    borne: 'Il ne répare pas et ne décide pas de l\'urgence. Il nomme ce qu\'il voit et passe la main.',
  },
  {
    cle: 'memoire',
    nom: 'Le gardien de la cale',
    role: 'Mémoire documentaire et réponses sourcées',
    fait: 'Il indexe les documents de référence, retrouve le passage utile et rend la réponse AVEC sa source. Interrogé sur un sujet que le corpus ne couvre pas, il le dit.',
    borne: 'Il ne complète jamais un manque par une supposition. Une réponse sans source ne sort pas de ce poste.',
  },
];

/**
 * Les quatre verrous réellement tenus par le dépôt, nommés « gardes ».
 * ⚠️ Les seuils recopiés ici viennent des scripts, pas d'une intention :
 *   · `< 1 Mo` et `14 requêtes` → `scripts/verifier-poids.mjs`, `scripts/verifier-requetes.mjs`
 *   · `4,5:1` / `3:1` et le foyer unique des jetons → `scripts/verifier-verrous.mjs`, VERROU 3 et 6
 *   · `2 familles réseau maximum`, famille citée = famille déclarée → même script, VERROU 8
 *   · noms protégés absents du contenu rendu → même script, VERROU 4
 * Si un seuil change dans un script, il change ici le jour même — ou la page ment.
 */
const gardes = [
  {
    nom: 'Le verrou typographique',
    mesure: 'Toute famille de police citée par une page doit être une famille réellement déclarée, et le réseau s\'arrête à deux familles. Une famille citée sans déclaration ne tombe pas en silence : elle fait échouer le contrôle.',
  },
  {
    nom: 'Le verrou de poids',
    mesure: 'Moins de 1 Mo par page servie. Il est mesuré sur le site construit, page par page, en octets réellement servis — texte compressé, fichiers binaires pris tels quels. Il ne dépend ni de la machine ni de l\'heure.',
  },
  {
    nom: 'Le verrou de contraste',
    mesure: 'Le texte tient au minimum 4,5:1, et 3:1 pour les éléments non textuels et les grands caractères. Les couleurs sont vérifiées sur les deux fonds du site, et rejetées si elles sont redéclarées ailleurs que dans le fichier de jetons.',
  },
  {
    nom: 'Le verrou juridique',
    mesure: 'Aucun nom de marque, de franchise ou de personnage protégé ne peut apparaître dans le contenu visible d\'une page. Le contrôle lit le composant entier, commentaires exclus : ce qui n\'est pas rendu au visiteur garde le droit d\'exister en note interne.',
  },
];
</script>

<style scoped>
/* ─────────────────────────────────────────────────────────────────────────────
   AUCUNE COULEUR EN DUR, AUCUN JETON REDÉCLARÉ.
   Toutes les valeurs viennent de `src/assets/styles/variables.css`. C'est un
   verrou mesuré : un jeton de couleur redéclaré hors de ce fichier fait échouer
   `node scripts/verifier-verrous.mjs` (VERROU 6), et une redéclaration qui
   passerait sous le seuil de contraste le fait échouer aussi (VERROU 3).

   RAPPEL DES SEUILS, tels que le dépôt les juge :
     --ink / --paper            18,34:1  → texte principal, sans réserve
     --ink-soft / --paper       10,87:1  → texte secondaire, sans réserve
     --accent / --paper         14,87:1  → titres et liens, « sacré », reste rare
     --rule-strong / carte       3,80:1  → bordure FONCTIONNELLE, seul jeton autorisé
     --rule / --paper            1,44:1  → DÉCORATIF uniquement, jamais une bordure
                                           de contrôle. Cette page ne l'utilise pas.
   `--ink-faint` (3,0:1) et `--neon-cyan` (limite sur les cartes) sont réservés au
   grand texte : cette page ne les emploie pas du tout — c'est plus sûr, et le
   contrôle ne peut pas être contourné par un usage détourné.

   MOUVEMENT : une seule transition, un décalage de 2 px au survol des cartes.
   Elle est neutralisée sous `prefers-reduced-motion: reduce`. Aucune animation
   automatique, aucune boucle, aucun effet au chargement : la page ne bouge que
   si le visiteur la touche, et pas du tout s'il a demandé le calme.
   ───────────────────────────────────────────────────────────────────────────── */

.ia-bord {
  min-height: 100vh;
  background: var(--paper);
  color: var(--ink);
  padding: 4rem 1.25rem 6rem;
}

.ia-bord__enveloppe {
  max-width: 46rem;
  margin: 0 auto;
}

.ia-bord__retour {
  display: inline-block;
  margin: 2.5rem 0 0;
  color: var(--accent);
  text-decoration: none;
  font-family: var(--font-mono);
  font-size: 0.8rem;
  letter-spacing: 0.04em;
}
.ia-bord__retour:hover,
.ia-bord__retour:focus-visible {
  color: var(--accent-ink);
  text-decoration: underline;
}

.ia-bord__tete {
  margin: 2.5rem 0 3.5rem;
}

.ia-bord__sur-titre {
  font-family: var(--font-mono);
  font-size: 0.72rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--accent);
  margin: 0 0 1rem;
}

.ia-bord__titre {
  font-size: clamp(2.2rem, 6vw, 3.4rem);
  line-height: 1.05;
  margin: 0 0 1.25rem;
  font-weight: 500;
  color: var(--ink);
}

.ia-bord__chapeau {
  font-size: 1.05rem;
  line-height: 1.7;
  color: var(--ink-soft);
  margin: 0;
  max-width: 38rem;
}

.ia-bord__bloc {
  margin: 0 0 3rem;
}

.ia-bord__sous-titre {
  font-size: 1.1rem;
  font-weight: 500;
  color: var(--ink);
  margin: 0 0 0.9rem;
  padding-bottom: 0.6rem;
  border-bottom: 1px solid var(--rule-strong);
}

.ia-bord__bloc p {
  line-height: 1.75;
  color: var(--ink-soft);
  margin: 0 0 1rem;
}

.ia-bord__bloc strong {
  color: var(--ink);
}

.ia-bord__note {
  border-left: 3px solid var(--rule-strong);
  padding-left: 1rem;
  font-size: 0.95rem;
}

/* ── Les sept postes ─────────────────────────────────────────────────────── */
.ia-bord__postes {
  list-style: none;
  margin: 1.5rem 0 1.5rem;
  padding: 0;
  display: grid;
  gap: 0.85rem;
}

.ia-bord__poste {
  background: var(--paper-alt);
  border: 1px solid var(--rule-strong);
  border-radius: 0.5rem;
  padding: 1.1rem 1.25rem;
  transition: transform var(--transition-fast);
}
.ia-bord__poste:hover {
  transform: translateY(-2px);
}

.ia-bord__poste-nom {
  font-family: var(--font-mono);
  font-size: 0.95rem;
  letter-spacing: 0.02em;
  color: var(--accent);
  margin: 0 0 0.2rem !important;
}

.ia-bord__poste-role {
  font-size: 0.85rem;
  color: var(--ink-soft);
  margin: 0 0 0.75rem !important;
}

.ia-bord__poste-fait,
.ia-bord__poste-borne {
  font-size: 0.95rem;
  line-height: 1.7;
  color: var(--ink-soft);
  margin: 0 0 0.5rem !important;
}

.ia-bord__poste-borne {
  margin-bottom: 0 !important;
}

.ia-bord__etiquette {
  display: block;
  font-family: var(--font-mono);
  font-size: 0.68rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--ink);
  margin-bottom: 0.15rem;
}

/* ── Les listes de la mémoire et des limites ─────────────────────────────── */
.ia-bord__liste {
  list-style: none;
  margin: 0;
  padding: 0;
}

.ia-bord__liste li {
  position: relative;
  padding: 0 0 1rem 1.4rem;
  line-height: 1.7;
  color: var(--ink-soft);
}
.ia-bord__liste li::before {
  content: '—';
  position: absolute;
  left: 0;
  color: var(--accent);
}

/* ── Les gardes ──────────────────────────────────────────────────────────── */
.ia-bord__gardes {
  margin: 1.5rem 0;
  display: grid;
  gap: 0.5rem;
}

.ia-bord__garde {
  padding: 0.85rem 0;
  border-bottom: 1px solid var(--rule-strong);
}

.ia-bord__garde dt {
  font-family: var(--font-mono);
  font-size: 0.9rem;
  color: var(--ink);
  margin-bottom: 0.35rem;
}

.ia-bord__garde dd {
  margin: 0;
  font-size: 0.95rem;
  line-height: 1.7;
  color: var(--ink-soft);
}

/* ── Les limites : un cadre, pas un encadré d'alerte ─────────────────────── */
.ia-bord__bloc--limites {
  background: var(--paper-alt);
  border-radius: 0.5rem;
  padding: 1.5rem 1.5rem 0.5rem;
}
.ia-bord__bloc--limites .ia-bord__sous-titre {
  border-bottom: none;
  padding-bottom: 0;
}

/* ── Les sorties ─────────────────────────────────────────────────────────── */
.ia-bord__sorties {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1.25rem;
  margin: 0 0 0.5rem !important;
}

.ia-bord__sortie {
  display: inline-block;
  padding: 0.85rem 1.6rem;
  background: var(--accent);
  color: var(--action-ink);
  font-weight: 600;
  text-decoration: none;
  border-radius: 3px;
  transition: background var(--transition-fast);
}
.ia-bord__sortie:hover,
.ia-bord__sortie:focus-visible {
  background: var(--accent-ink);
}

.ia-bord__sortie-secondaire {
  color: var(--ink);
  font-size: 0.95rem;
}
.ia-bord__sortie-secondaire:hover,
.ia-bord__sortie-secondaire:focus-visible {
  color: var(--accent);
}

/* ── Le calme demandé est respecté ───────────────────────────────────────── */
@media (prefers-reduced-motion: reduce) {
  .ia-bord__poste,
  .ia-bord__sortie {
    transition: none;
  }
  .ia-bord__poste:hover {
    transform: none;
  }
}

@media (max-width: 640px) {
  .ia-bord__poste {
    padding: 1rem;
  }
  .ia-bord__bloc--limites {
    padding: 1.25rem 1.25rem 0.25rem;
  }
}
</style>
