<template>
  <!--
    ⚠️ `<div>` ET NON `<main>` — MÊME RAISON QU'À L'ÉTAT DU STUDIO, À CE QUE NOUS NOUS
    IMPOSONS, À L'IA DE BORD ET À LA SOUTE. `App.vue` pose déjà
    `<main id="main-content" role="main">` autour de tout le contenu rendu par le routeur.
    Une page qui en ajoute un second produit un repère `main` IMBRIQUÉ : deux constats
    d'accessibilité pour une seule page (`landmark-main-is-top-level`,
    `landmark-no-duplicate-main`). Un document n'a qu'un seul contenu principal. La classe
    porte la mise en page, pas la sémantique.
  -->
  <div class="armure">
    <div class="armure__enveloppe">

      <RouterLink to="/" class="armure__retour">← Revenir sur la passerelle</RouterLink>

      <header class="armure__tete">
        <p class="armure__sur-titre">L'atelier · un projet de jeu, montré en cours</p>
        <h1 class="armure__titre">L'armure</h1>
        <p class="armure__chapeau">
          Ceci n'est pas une page de vente : c'est <strong>un projet du studio montré
          en cours de route</strong>, avec ce qui est fait, ce qui ne l'est pas encore, et
          ce que personne ne peut affirmer à ce stade. L'armure est
          <strong>notre dessin</strong> — six lois de forme tirées d'une œuvre qu'on a
          regardée, et une variante qui en est l'inverse assumé.
        </p>
        <p class="armure__date">Projet ouvert le 19 septembre 2026 · état publié le 19 septembre 2026.</p>
      </header>

      <!-- ══ 1. LE PROJET, EN CLAIR ═══════════════════════════════════════════
           Le même choix de forme qu'à « l'état du studio » : une liste de définitions,
           chaque valeur portant SON intitulé et SA source. Un `<dl>` ne contient que des
           `<dt>` et des `<dd>` — la source d'une valeur est une DÉFINITION, pas une note
           en marge : elle va donc à l'intérieur du `<dd>`. -->
      <section class="armure__bloc" aria-labelledby="titre-projet">
        <h2 id="titre-projet" class="armure__sous-titre">Le projet, en clair</h2>
        <dl class="armure__fiche">
          <div v-for="m in fiche" :key="m.intitule" class="armure__ligne">
            <dt class="armure__intitule">{{ m.intitule }}</dt>
            <dd class="armure__valeur">
              {{ m.valeur }}
              <span class="armure__source">{{ m.source }}</span>
            </dd>
          </div>
        </dl>
        <p class="armure__note">
          <strong>Le nom du projet n'est pas définitif.</strong> C'est un nom de travail, et
          il le restera tant qu'une recherche d'antériorité n'a pas été faite. Le studio ne
          l'annonce pas comme un titre : il l'écrit pour ne pas laisser croire que la
          question est réglée.
        </p>
      </section>

      <!-- ══ 2. LA PLANCHE, ET COMMENT ELLE SE LIT ════════════════════════════
           Une seule image sur cette page, et elle est de nous. Elle est servie comme
           fichier réduit (43 564 octets, contre 1 076 519 pour l'original) : le verrou de
           poids de la charte juge les octets SERVIIS, page par page. -->
      <section class="armure__bloc" aria-labelledby="titre-planche">
        <h2 id="titre-planche" class="armure__sous-titre">La planche, et ce qu'elle montre</h2>
        <p>
          Voici la première planche de conception : <strong>une vue de face, sur fond de
          studio neutre</strong>. Elle a été produite par le studio, et c'est la seule image
          de l'armure publiée ici.
        </p>

        <figure class="armure__figure">
          <img
            src="/armure/planche-01-front.webp"
            width="832"
            height="1216"
            alt="Planche de conception de l'armure : combinaison blindée à panneaux graphite et ambre, casque entièrement fermé à visière pleine ambre, antenne sur l'épaule gauche, jointures apparentes. Aucune arme tenue, aucune signature, aucune inscription."
            loading="lazy"
            decoding="async"
          >
          <figcaption class="armure__legende">
            <strong>Planche n° 1 — vue de face.</strong> 832 × 1216 pixels, produite par
            le studio. Ce qu'on y lit, et qui est vérifiable en la regardant :
            <strong>graphite et un seul accent ambre</strong>, casque entièrement fermé,
            visière pleine, antenne sur l'épaule, plaques séparées par des jointures
            apparentes. <strong>Aucune arme tenue, aucune signature, aucune inscription</strong> —
            et c'est ce qui en fait un dessin de nous, et non la reprise d'un autre.
          </figcaption>
        </figure>

        <p>
          Cette planche est <strong>antérieure à la réception de l'œuvre décrite plus
          bas</strong> : elle n'en dérive pas. Les six lois qui suivent ont donc été
          écrites <em>après</em> elle, et elles décrivent une direction que le studio tient
          déjà — elles ne l'ont pas fabriquée.
        </p>
      </section>

      <!-- ══ 3. LES SIX LOIS ══════════════════════════════════════════════════
           Elles portent sur la FORME, pas sur le dessin d'un autre. Chaque loi dit aussi
           ce qu'elle ÉVITE techniquement — c'est ce qui la rend tenable plutôt que
           décorative. -->
      <section class="armure__bloc" aria-labelledby="titre-lois">
        <h2 id="titre-lois" class="armure__sous-titre">Les six lois de forme, et ce qu'elles évitent</h2>
        <p>
          Une œuvre de quelqu'un d'autre a été montrée au studio, et
          <strong>elle a été décrite, pas reprise</strong> : le studio a écrit ce que cette
          image montre, puis il en a tiré des lois de forme. Une grammaire n'appartient à
          personne ; un dessin, si. Ces six lois portent sur la forme.
        </p>

        <ol class="armure__lois">
          <li v-for="loi in lois" :key="loi.n" class="armure__loi">
            <p class="armure__loi-titre">
              <span class="armure__loi-num">{{ loi.n }}</span>{{ loi.titre }}
            </p>
            <p class="armure__loi-texte">{{ loi.texte }}</p>
            <p class="armure__loi-gain"><strong>Ce que ça évite :</strong> {{ loi.gain }}</p>
          </li>
        </ol>

        <p class="armure__note armure__note--incertitude">
          <strong>Ce que ces six lois ne sont pas.</strong> Ce n'est pas une copie par
          contournement, et ce n'est pas non plus une preuve d'originalité : c'est une
          <strong>grammaire</strong>. Une armure énergétique à visière pleine et à élément
          d'énergie unique est un vocabulaire, comme « vaisseau spatial » ou « épée
          longue ». Ce qui s'emprunte, c'est un dessin précis et un nom — et
          <strong>ni l'un ni l'autre ne sont ici</strong>.
        </p>
      </section>

      <!-- ══ 4. LA VARIANTE ═══════════════════════════════════════════════════
           Le tableau est volontairement en deux colonnes : ce qu'on a regardé, et ce que
           NOUS faisons — la seconde colonne est l'inverse de la première sur chaque ligne,
           et c'est ce qui rend la dérivation vérifiable plutôt qu'affirmée. -->
      <section class="armure__bloc" aria-labelledby="titre-variante">
        <h2 id="titre-variante" class="armure__sous-titre">Notre variante, ligne par ligne</h2>
        <p>
          La direction retenue est <strong>l'inverse de l'œuvre décrite</strong>, sur chaque
          point qui la caractérisait. Ce n'est pas une nuance : c'est un renversement, et il
          est écrit pour être opposable au studio.
        </p>

        <table class="armure__table">
          <caption class="armure__table-legende">
            Ce qui a été observé dans l'œuvre décrite, et ce que le studio en a fait — l'inverse assumé.
          </caption>
          <thead>
            <tr>
              <th scope="col">Ce qui a été observé</th>
              <th scope="col">Ce que nous faisons</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="v in variante" :key="v.observe">
              <td>{{ v.observe }}</td>
              <td>{{ v.nous }}</td>
            </tr>
          </tbody>
        </table>

        <p>
          Dit en une phrase : <strong>une combinaison blindée fine, segmentée, sans excès, à
          accent unique</strong> — l'armure d'un corsaire, pas d'un chevalier. Et ce n'est
          pas une image choisie après coup : le personnage que le studio met dans cette
          armure est décrit comme <strong>le corsaire</strong> dans les documents du projet.
          Une armure de corsaire n'est pas une armure de héros lourd.
        </p>
      </section>

      <!-- ══ 5. L'ÉTAT RÉEL ═══════════════════════════════════════════════════
           Une page de projet qui ne dirait que le fait est une page de communication. On
           sépare donc ce qui EXISTE de ce qui n'existe pas, sans flèche dans le vide. -->
      <section class="armure__bloc" aria-labelledby="titre-etat">
        <h2 id="titre-etat" class="armure__sous-titre">Où en est le projet, ce jour-là</h2>
        <ul class="armure__etats">
          <li v-for="e in etats" :key="e.quoi" class="armure__etat" :class="{ 'armure__etat--attente': !e.fait }">
            <p class="armure__etat-quoi">
              <span class="armure__marque" aria-hidden="true">{{ e.fait ? '✓' : '·' }}</span>
              {{ e.quoi }}
              <span class="armure__etat-signe">{{ e.fait ? 'fait' : 'pas encore' }}</span>
            </p>
            <p class="armure__etat-detail">{{ e.detail }}</p>
          </li>
        </ul>
        <p class="armure__note">
          <strong>La lecture de cette liste est celle du studio, pas un état d'avancement
          commercial.</strong> Les trois vues et le maillage dépendent de deux choses qui
          n'existent pas encore : le feu vert visuel du dirigeant, et la disponibilité de la
          machine. Une seule génération lourde tourne à la fois ici, et le premier incident
          matériel arrête tout — ce n'est pas une précaution, c'est une contrainte mesurée.
        </p>
      </section>

      <!-- ══ 6. CE QUE CETTE PAGE NE GARANTIT PAS ═════════════════════════════
           LA RUBRIQUE HONNÊTE, ET ELLE EST OBLIGATOIRE ICI PLUS QU'AILLEURS : une page qui
           montre une planche réussie est exactement l'endroit où un lecteur suppose un jeu,
           et un droit. On nomme les trois manques. -->
      <section class="armure__bloc armure__bloc--limites" aria-labelledby="titre-limites">
        <h2 id="titre-limites" class="armure__sous-titre">Ce que cette page ne garantit pas</h2>

        <ul class="armure__limites">
          <li>
            <strong>Elle ne montre aucun jeu.</strong> Une planche de conception n'est pas un
            jeu : elle ne dit rien d'un déplacement, d'une caméra, d'un son, d'une boucle de
            jeu ni d'une durée de vie. Rien de tout cela n'existe aujourd'hui, et
            <strong>aucune capture, aucune vidéo, aucune démonstration jouable n'est
            publiée</strong> — parce qu'il n'y en a pas. Ce qui existe tient sur cette page,
            et sur elle seule.
          </li>
          <li>
            <strong>Elle ne dit pas que le dessin est original au sens du droit.</strong> Le
            studio a écrit ce qu'il a observé et ce qu'il en a fait ; il
            <strong>n'est pas juriste</strong> et ne produit aucun avis juridique. Aucune
            recherche d'antériorité n'a été menée, aucun dépôt n'a été fait, et
            <strong>le nom du projet n'est ni vérifié ni protégé</strong>. L'originalité
            d'un dessin ne se déclare pas : elle se constate par ceux que cela concerne.
          </li>
          <li>
            <strong>Elle ne remplace pas l'œil du dirigeant, qui seul valide le
            visuel.</strong> Les outils de vision locale du studio ont produit des
            <strong>hallucinations répétées</strong> : ils décrivent, ils ne jugent pas. La
            planche et la variante attendent donc un verdict humain. Tant qu'il n'est pas
            rendu, cette page décrit une <strong>intention tenue par écrit</strong>, pas un
            design validé.
          </li>
          <li>
            <strong>Et le point qui coûte le plus au studio : la rigidité de l'armure ne
            répond pas à ce qui manque.</strong> Le choix d'un corps blindé évite de
            modéliser un visage et de l'animer — c'est réel. Il ne supprime pas ce qui
            bloque encore : <strong>le déplacement, le vol, la caméra et la physique</strong>
            restent à écrire. <em>Une armure contourne le chaînon manquant du studio ; elle
            ne le remplace pas.</em>
          </li>
        </ul>
      </section>

      <!-- ── Les sorties ───────────────────────────────────────────────────── -->
      <p class="armure__sorties">
        <RouterLink to="/dossier" class="armure__sortie">
          Voir ce que le studio livre, prix et délais →
        </RouterLink>
        <RouterLink to="/ce-que-nous-nous-imposons" class="armure__sortie-secondaire">
          Lire les règles que le studio s'impose
        </RouterLink>
      </p>

      <RouterLink to="/" class="armure__retour">← Revenir sur la passerelle</RouterLink>
    </div>
  </div>
</template>

<script setup>
/**
 * L'ARMATURE — la page du projet `armure-neo`. GL Digital Lab, 19/09/2026.
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 * POURQUOI CETTE PAGE EXISTE
 *
 * Le studio a ouvert un projet de jeu le 19/09/2026 : une exo-combinaison blindée
 * motorisée, portée par son propre personnage. Le projet a produit, le jour même,
 * deux documents de travail et une planche de conception — et **rien de tout cela
 * n'était atteignable depuis le site**.
 *
 * Cette page est la porte. Elle publie ce qui est publiable, elle date ce qu'elle
 * affirme, et elle dit ce qu'elle ne peut pas garantir.
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 * ⛔ LES QUATRE FRONTIÈRES DE CETTE PAGE, ÉCRITES POUR NE PAS ÊTRE « RÉPARÉES »
 *
 *   1. AUCUNE IMAGE D'UN AUTRE N'EST PUBLIÉE ICI. La seule image de cette page est
 *      la planche `public/armure/planche-01-front.webp`, produite par le studio.
 *      Une œuvre de tiers a été montrée au studio et **décrite en mots** ; elle n'a
 *      été ni copiée, ni rangée dans le dépôt, ni servie. Ce n'est pas de la pudeur :
 *      deux droits se superposent sur une telle pièce — l'œuvre et son auteur — et
 *      aucun des deux n'est au studio.
 *
 *   2. AUCUN NOM DE FRANCHISE, DE MARQUE NI DE PERSONNE D'AUTRE. Ni dans le rendu,
 *      ni dans les commentaires : `scripts/verifier-verrous.mjs` lit le composant
 *      ENTIER, commentaires retirés, et échoue si un nom protégé y apparaît. C'est
 *      un verrou mesuré, pas une intention. Ce qui est décrit l'est par sa forme —
 *      « une œuvre montrée au studio », « l'œuvre décrite » — jamais par son nom.
 *
 *   3. AUCUN NOM DE FICHIER, AUCUN CHEMIN LOCAL, AUCUN NOM D'OUTIL NI DE MODÈLE
 *      D'INTELLIGENCE ARTIFICIELLE. Les documents de travail sont cités par ce
 *      qu'ils ÉTABLISSENT et par leur date. C'est la même règle qu'à
 *      `/etat-du-studio` et à `/ce-que-nous-nous-imposons` : décrire le RÔLE, jamais
 *      l'architecture.
 *
 *   4. AUCUN CHIFFRE INVENTÉ. Les dimensions et les poids cités sur cette page sont
 *      mesurés : la planche d'origine fait 832 × 1216 pixels et 1 076 519 octets,
 *      la copie servie 43 564 octets (mesure du 19/09/2026, outil de réduction du
 *      dépôt). Si une valeur n'est pas mesurable depuis cette page, elle n'y est pas.
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 * D'OÙ VIENNENT LES SIX LOIS — ET CE QU'ELLES NE SONT PAS
 *
 * Elles viennent d'un document de direction artistique daté du 19/09/2026, écrit
 * après la réception d'une image montrée par le dirigeant. Ce document a une
 * exigence qui explique la forme de cette page : **l'image est décrite en mots
 * pour être reconstruite à neuf**, jamais reprise.
 *
 * ⚠️ ET LA PART QUI COMPTE POUR LE LECTEUR : la planche publiée ici est ANTÉRIEURE
 * à cette réception. Elle ne dérive donc pas de l'œuvre décrite — c'est ce qui
 * permet d'écrire ci-dessus que les six lois « décrivent une direction déjà tenue »
 * plutôt que de laisser croire qu'elles l'ont fabriquée. Les deux faits sont datés
 * dans les documents du projet, et ils sont dans cet ordre.
 *
 * ⛔ CE QUI N'EST PAS SUR CETTE PAGE, ET QUI NE DOIT PAS Y REVENIR :
 *   · aucune image d'un autre, aucun logo, aucune capture, aucune musique ;
 *   · aucun nom de franchise, de marque, de personnage protégé ni d'artiste ;
 *   · aucune donnée personnelle, aucun chemin local, aucune adresse de tiers ;
 *   · aucun engagement de date : rien n'est promis ici, y compris à nous-mêmes.
 */

/* ── 1. La fiche du projet ──────────────────────────────────────────────────────
   Chaque ligne porte son intitulé, sa valeur et l'origine de la valeur. Les noms de
   fichiers sont volontairement ABSENTS (règle 3 de l'en-tête) : ce qui compte pour le
   lecteur est ce que le document établit et le jour où il l'établit. */
const fiche = [
  {
    intitule: 'Le projet',
    valeur: 'Une exo-combinaison blindée motorisée, portée par notre propre personnage.',
    source: 'Projet ouvert le 19 septembre 2026. C\'est le sujet de cette page, et le seul.',
  },
  {
    intitule: 'Le personnage',
    valeur: 'Le corsaire — celui que le studio met dans l\'armure.',
    source: 'Décrit comme « le corsaire » dans les documents du projet, avant que l\'armure ne soit dessinée.',
  },
  {
    intitule: 'L\'armure',
    valeur: 'Un dessin original du studio — graphite, un seul accent ambre, casque fermé.',
    source: 'Planche n° 1 produite par le studio, publiée plus bas. Aucune image d\'un tiers n\'est reprise ici.',
  },
  {
    intitule: 'Les documents de travail',
    valeur: 'Deux documents datés du 19 septembre 2026 : le cadrage du projet, et la grammaire de l\'armure.',
    source: 'Ils existent, ils sont datés, et cette page en publie la substance. Leur contenu technique d\'atelier ne sort pas.',
  },
  {
    intitule: 'Le nom du projet',
    valeur: 'Un nom de travail, pas un titre.',
    source: 'Aucune recherche d\'antériorité n\'a été menée à ce jour. Le studio l\'écrit au lieu de le laisser croire réglé.',
  },
  {
    intitule: 'Le moteur, la date de sortie, le modèle économique',
    valeur: 'Non tranchés.',
    source: 'Le studio ne les annonce pas, parce qu\'il ne les a pas décidés. Une valeur par défaut serait une invention.',
  },
];

/* ── 2. Les six lois de forme ───────────────────────────────────────────────────
   Elles portent sur la forme, et chacune dit ce qu'elle ÉVITE : c'est ce qui la rend
   tenable. Le texte est une reformulation destinée au visiteur — les documents du
   projet disent la même chose, dans le vocabulaire de l'atelier. */
const lois = [
  {
    n: '1',
    titre: 'Le casque est entièrement fermé, et la visière est le visage',
    texte: 'Le regard n\'est pas montré : la visière pleine EST le visage du personnage. La silhouette reste lisible à très petite taille, et de dos.',
    gain: 'aucune expression à animer, aucun visage à modéliser — c\'est le chaînon qui manquait au studio, et il disparaît de l\'équation.',
  },
  {
    n: '2',
    titre: 'Les épaules sont la signature, pas la tête',
    texte: 'C\'est le contour des épaules qui rend le personnage reconnaissable, y compris réduit à quelques pixels ou vu de dos.',
    gain: 'une silhouette identifiable sans détail, sans texture et sans lumière travaillée.',
  },
  {
    n: '3',
    titre: 'L\'arme est le bras',
    texte: 'Rien n\'est tenu, rien n\'est rangé : l\'énergie part du bras lui-même. Il n\'y a donc aucun objet à équiper.',
    gain: 'pas d\'accessoire, pas d\'inventaire, pas de système d\'équipement à écrire.',
  },
  {
    n: '4',
    titre: 'Le tir sort du cadre',
    texte: 'Ce qui est montré, c\'est le DÉPART du tir — pas son impact. On ne voit pas la cible.',
    gain: 'moins d\'effets à produire, et une impression de vitesse plutôt que de dégâts.',
  },
  {
    n: '5',
    titre: 'Une seule teinte d\'énergie, sur un corps sombre',
    texte: 'Un accent unique, sur un corps graphite. C\'est la même règle que celle des interfaces du studio : une seule couleur d\'action.',
    gain: 'un projectile lisible sur n\'importe quel fond, sans réglage par niveau.',
  },
  {
    n: '6',
    titre: 'Pas de sang, pas de blessure',
    texte: 'Ce qui encaisse, c\'est la plaque. L\'armure EST la surface — le corps n\'est jamais montré atteint.',
    gain: 'un traitement visuel sobre, adapté à un public large, sans rien perdre de la lisibilité du combat.',
  },
];

/* ── 3. La variante, ligne par ligne ────────────────────────────────────────────
   La colonne de droite est l'INVERSE de celle de gauche sur chaque ligne. C'est ce
   renversement qui rend la dérivation vérifiable : le lecteur peut comparer. */
const variante = [
  {
    observe: 'Des épaulières sphériques et massives',
    nous: 'Des épaulières plates et affleurantes — la masse descend vers les avant-bras.',
  },
  {
    observe: 'Un rouge profond relevé d\'un vert acide',
    nous: 'Du graphite, et un seul accent ambre.',
  },
  {
    observe: 'Un casque bombé, à visière en goutte',
    nous: 'Un casque anguleux, à visière rectangulaire pleine largeur.',
  },
  {
    observe: 'Un canon annelé, à embout large',
    nous: 'Un canon affiné, à embout circulaire sobre.',
  },
  {
    observe: 'Une surface peinte, aux textures riches',
    nous: 'Des plaques lisses, aux lignes de panneau nettes — plus proche d\'un produit industriel que d\'une armure organique.',
  },
];

/* ── 4. L'état réel ─────────────────────────────────────────────────────────────
   `fait` est un booléen, et il n'est pas décoratif : il décide de la marque affichée.
   Les entrées fausses sont écrites « pas encore » — jamais absentes, jamais en flèche. */
const etats = [
  {
    quoi: 'La grammaire de l\'armure, en six lois',
    fait: true,
    detail: 'Écrite le 19 septembre 2026. Elle est reconstituable sans l\'œuvre décrite : c\'est justement ce qu\'on lui demande.',
  },
  {
    quoi: 'La première planche de conception',
    fait: true,
    detail: 'Produite par le studio, publiée plus haut. Vue de face, graphite et ambre.',
  },
  {
    quoi: 'La variante chiffrée, ligne par ligne',
    fait: true,
    detail: 'Le tableau ci-dessus : cinq renversements assumés par rapport à l\'œuvre décrite.',
  },
  {
    quoi: 'Trois vues supplémentaires — trois-quarts, dos, détail du bras',
    fait: false,
    detail: 'Elles dépendent du feu vert visuel du dirigeant, et d\'une seule génération lourde à la fois sur la machine du studio.',
  },
  {
    quoi: 'Le maillage 3D de l\'armure',
    fait: false,
    detail: 'Il vient APRÈS la validation visuelle, jamais avant. Sa licence d\'usage commerciale n\'a pas été lue : la question est ouverte et elle est écrite comme telle.',
  },
  {
    quoi: 'Le prototype jouable — vol, tir, caméra',
    fait: false,
    detail: 'Les images de référence du genre ne décrivent pas un système : elles montrent un rendu. La boucle de jeu reste à écrire, et rien n\'en est publié tant qu\'elle n\'existe pas.',
  },
];
</script>

<style scoped>
/* ─────────────────────────────────────────────────────────────────────────────
   AUCUNE COULEUR EN DUR, AUCUN JETON REDÉCLARÉ.
   Toutes les valeurs viennent de `src/assets/styles/variables.css`. C'est un verrou
   mesuré : un jeton redéclaré hors de ce fichier, ou une valeur d'une direction
   artistique révolue, fait échouer `node scripts/verifier-verrous.mjs`.

   CONTRASTES EMPLOYÉS ICI, sur les deux fonds de la charte :
     --ink / --paper           18,34:1   texte principal
     --ink-soft / --paper      10,87:1   texte courant
     --accent / --paper        14,87:1   titres, liens, repères de liste
     --rule-strong / --paper    4,01:1   bordure FONCTIONNELLE (seul jeton autorisé)
     --alert / --paper          7,07:1   filet des points non tenus
   `--rule` (1,44:1) et `--ink-faint` ne servent PAS de bordure ici : le premier est
   décoratif, le second est réservé au grand texte.

   ⚠️ LA PLANCHE EST SUR UN FOND DE STUDIO CLAIR (gris neutre), PAS SUR LE FOND DE LA
   PAGE. On ne la pose donc pas nue dans le noir : elle est présentée dans un cadre de
   carte (`--paper-alt`) avec un filet fonctionnel, et sa légende est en texte, sous
   elle. Rien n'est superposé à l'image.

   MOUVEMENT : une seule transition de couleur au survol, aucune animation
   automatique, aucun défilement, aucun clignotement. Elle est neutralisée sous
   `prefers-reduced-motion: reduce`.
   ───────────────────────────────────────────────────────────────────────────── */

.armure {
  min-height: 100vh;
  background: var(--paper);
  color: var(--ink);
  padding: 4rem 1.25rem 6rem;
}

.armure__enveloppe {
  max-width: 46rem;
  margin: 0 auto;
}

.armure__retour {
  display: inline-block;
  margin: 2.5rem 0 0;
  color: var(--accent);
  text-decoration: none;
  font-family: var(--font-mono);
  font-size: 0.8rem;
  letter-spacing: 0.04em;
}
.armure__retour:hover,
.armure__retour:focus-visible {
  color: var(--accent-ink);
  text-decoration: underline;
}

.armure__tete {
  margin: 2.5rem 0 3.5rem;
}

.armure__sur-titre {
  font-family: var(--font-mono);
  font-size: 0.72rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--accent);
  margin: 0 0 1rem;
}

.armure__titre {
  font-size: clamp(2.2rem, 6vw, 3.4rem);
  line-height: 1.05;
  margin: 0 0 1.25rem;
  font-weight: 500;
  color: var(--ink);
}

.armure__chapeau {
  font-size: 1.05rem;
  line-height: 1.7;
  color: var(--ink-soft);
  margin: 0 0 1.25rem;
  max-width: 38rem;
}

.armure__date {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  letter-spacing: 0.06em;
  color: var(--ink-soft);
  margin: 0;
}

.armure__bloc {
  margin: 0 0 3rem;
}

.armure__sous-titre {
  font-size: 1.1rem;
  font-weight: 500;
  color: var(--ink);
  margin: 0 0 0.9rem;
  padding-bottom: 0.6rem;
  border-bottom: 1px solid var(--rule-strong);
}

.armure__bloc p {
  line-height: 1.75;
  color: var(--ink-soft);
  margin: 0 0 1rem;
}

.armure__bloc strong {
  color: var(--ink);
}

.armure__note {
  border-left: 3px solid var(--rule-strong);
  padding-left: 1rem;
  font-size: 0.95rem;
}

.armure__note--incertitude {
  border-left-color: var(--alert);
  font-size: 0.92rem;
}

/* ── 1. La fiche du projet ───────────────────────────────────────────────── */
.armure__fiche {
  margin: 1.5rem 0;
  display: grid;
  gap: 0.5rem;
}

.armure__ligne {
  padding: 0.9rem 0;
  border-bottom: 1px solid var(--rule-strong);
}

.armure__intitule {
  font-family: var(--font-mono);
  font-size: 0.72rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--ink);
  margin: 0 0 0.35rem;
}

.armure__valeur {
  margin: 0;
  color: var(--ink-soft);
  line-height: 1.7;
}

.armure__source {
  display: block;
  margin: 0.3rem 0 0;
  font-size: 0.85rem;
  line-height: 1.6;
  color: var(--ink-soft);
}

/* ── 2. La planche ───────────────────────────────────────────────────────── */
.armure__figure {
  margin: 1.75rem 0;
  padding: 1rem;
  background: var(--paper-alt);
  border: 1px solid var(--rule-strong);
  border-radius: 0.5rem;
}

/* L'image est seule dans son cadre, centrée, et jamais étirée au-delà de sa largeur
   réelle : `max-width: 100%` suffit, la hauteur suit. Le fond clair de la planche
   n'est donc pas rogné, et rien ne la recouvre. */
.armure__figure img {
  display: block;
  margin: 0 auto;
  width: auto;
  max-width: 100%;
  height: auto;
  border-radius: 0.25rem;
}

.armure__legende {
  margin: 1rem 0 0;
  font-size: 0.9rem;
  line-height: 1.7;
  color: var(--ink-soft);
}
.armure__legende strong {
  color: var(--ink);
}

/* ── 3. Les six lois ─────────────────────────────────────────────────────── */
.armure__lois {
  list-style: none;
  counter-reset: loi;
  margin: 1.5rem 0;
  padding: 0;
  display: grid;
  gap: 1rem;
}

.armure__loi {
  background: var(--paper-alt);
  border: 1px solid var(--rule-strong);
  border-radius: 0.5rem;
  padding: 1.1rem 1.25rem 0.25rem;
}

.armure__loi-titre {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 0.6rem;
  font-family: var(--font-mono);
  font-size: 0.92rem;
  line-height: 1.5;
  color: var(--ink);
  margin: 0 0 0.5rem !important;
}

.armure__loi-num {
  color: var(--accent);
  font-size: 0.8rem;
}

.armure__loi-texte {
  margin: 0 0 0.7rem !important;
  font-size: 0.95rem;
  line-height: 1.7;
  color: var(--ink-soft);
}

.armure__loi-gain {
  margin: 0 0 0.9rem !important;
  font-size: 0.88rem;
  line-height: 1.7;
  color: var(--ink-soft);
  border-left: 2px solid var(--rule-strong);
  padding-left: 0.85rem;
}

/* ── 4. La variante ──────────────────────────────────────────────────────── */
.armure__table {
  width: 100%;
  border-collapse: collapse;
  margin: 1.5rem 0;
}

.armure__table-legende {
  caption-side: top;
  text-align: left;
  font-size: 0.85rem;
  line-height: 1.6;
  color: var(--ink-soft);
  padding-bottom: 0.75rem;
}

.armure__table th,
.armure__table td {
  text-align: left;
  padding: 0.6rem 0.7rem;
  border-bottom: 1px solid var(--rule-strong);
  font-size: 0.92rem;
  line-height: 1.65;
  color: var(--ink-soft);
  vertical-align: top;
}

.armure__table th {
  font-family: var(--font-mono);
  font-size: 0.72rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--ink);
}

/* ── 5. L'état du projet ─────────────────────────────────────────────────── */
.armure__etats {
  list-style: none;
  margin: 1.5rem 0;
  padding: 0;
  display: grid;
  gap: 0.75rem;
}

.armure__etat {
  border: 1px solid var(--rule-strong);
  border-radius: 0.5rem;
  padding: 1rem 1.15rem;
}

/* Le point NON tenu est distingué par un filet d'alerte, pas par une couleur pleine :
   c'est une information de lecture, pas une panne. Même jeton que la page des règles. */
.armure__etat--attente {
  border-left-width: 3px;
  border-left-color: var(--alert);
}

.armure__etat-quoi {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 0.6rem;
  margin: 0 0 0.3rem !important;
  font-family: var(--font-mono);
  font-size: 0.9rem;
  line-height: 1.55;
  color: var(--ink);
}

.armure__marque {
  color: var(--accent);
}

.armure__etat-signe {
  font-size: 0.68rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--ink-soft);
}

.armure__etat-detail {
  margin: 0 !important;
  font-size: 0.92rem;
  line-height: 1.7;
  color: var(--ink-soft);
}

/* ── 6. Les limites ──────────────────────────────────────────────────────── */
.armure__bloc--limites {
  background: var(--paper-alt);
  border-radius: 0.5rem;
  padding: 1.5rem 1.5rem 0.5rem;
}
.armure__bloc--limites .armure__sous-titre {
  border-bottom: none;
  padding-bottom: 0;
}

.armure__limites {
  list-style: none;
  margin: 0;
  padding: 0;
}

.armure__limites li {
  position: relative;
  padding: 0 0 1rem 1.4rem;
  line-height: 1.7;
  color: var(--ink-soft);
}
.armure__limites li::before {
  content: '—';
  position: absolute;
  left: 0;
  color: var(--accent);
}

/* ── Les sorties ─────────────────────────────────────────────────────────── */
.armure__sorties {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1.25rem;
  margin: 0 0 0.5rem !important;
}

.armure__sortie {
  display: inline-block;
  padding: 0.85rem 1.6rem;
  background: var(--accent);
  color: var(--action-ink);
  font-weight: 600;
  text-decoration: none;
  border-radius: 3px;
  transition: background var(--transition-fast);
}
.armure__sortie:hover,
.armure__sortie:focus-visible {
  background: var(--accent-ink);
}

.armure__sortie-secondaire {
  color: var(--ink);
  font-size: 0.95rem;
}
.armure__sortie-secondaire:hover,
.armure__sortie-secondaire:focus-visible {
  color: var(--accent);
}

/* ── Le calme demandé est respecté ───────────────────────────────────────── */
@media (prefers-reduced-motion: reduce) {
  .armure__sortie {
    transition: none;
  }
}

@media (max-width: 640px) {
  .armure__loi,
  .armure__etat {
    padding: 1rem 1rem 0.25rem;
  }
  .armure__etat {
    padding: 1rem;
  }
  .armure__bloc--limites {
    padding: 1.25rem 1.25rem 0.25rem;
  }
  .armure__figure {
    padding: 0.75rem;
  }
  .armure__table th,
  .armure__table td {
    padding: 0.5rem 0.45rem;
    font-size: 0.85rem;
  }
}
</style>
