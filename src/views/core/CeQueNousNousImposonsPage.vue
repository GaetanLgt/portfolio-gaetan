<template>
  <!--
    ⚠️ `<div>` ET NON `<main>` — MÊME RAISON QU'À L'IA DE BORD, À LA SOUTE ET À L'ÉTAT
    DU STUDIO. `App.vue` pose déjà `<main id="main-content" role="main">` autour de tout le
    contenu rendu par le routeur. Une page qui en ajoute un second produit un repère `main`
    IMBRIQUÉ : deux constats d'accessibilité pour une seule page
    (`landmark-main-is-top-level`, `landmark-no-duplicate-main`). Un document n'a qu'un seul
    contenu principal. La classe porte la mise en page, pas la sémantique.
  -->
  <div class="impose">
    <div class="impose__enveloppe">

      <RouterLink to="/" class="impose__retour">← Revenir sur la passerelle</RouterLink>

      <header class="impose__tete">
        <p class="impose__sur-titre">Compartiment de bord · nos règles et nos limites</p>
        <h1 class="impose__titre">Ce que nous nous imposons</h1>
        <p class="impose__chapeau">
          Cette page ne dit pas ce que le studio sait faire — il y en a d'autres pour cela.
          Elle dit <strong>ce qu'il s'interdit, et sur quoi il se contrôle</strong>. La liste
          est courte, elle est tenue, et <strong>quand un point n'est pas encore en place, il
          est écrit comme tel</strong> : une page de règles qui s'attribuerait une règle non
          appliquée serait exactement le défaut qu'elle prétend corriger.
        </p>
        <p class="impose__date">Règles arrêtées et publiées le 19 septembre 2026.</p>
      </header>

      <!-- ══ 1. CE QUE NOUS REFUSONS ═════════════════════════════════════════
           Chaque refus porte sa RAISON, et la raison est ce qui est tenable :
           un refus sans raison est un goût, et un goût se discute. -->
      <section class="impose__bloc" aria-labelledby="titre-refus">
        <h2 id="titre-refus" class="impose__sous-titre">Ce que nous refusons — et pourquoi</h2>
        <p>
          Trois choses que ce studio ne fera pas, même si on nous les demande, et même si
          elles se vendent bien.
        </p>

        <ul class="impose__liste">
          <li>
            <strong>Nous ne construisons pas de plateforme qui centralise toutes vos
            données.</strong> Parce qu'un fichier central est ce qu'on vole : un endroit qui
            rassemble tout est un endroit qui, s'il tombe, livre tout d'un coup. Ce qui n'a
            pas été copié ne peut pas fuir.
          </li>
          <li>
            <strong>Nous ne publions aucun chiffre sans sa source et sa date.</strong> Parce
            qu'un nombre sans origine a la forme d'un fait sans en être un. Un chiffre est
            une mesure : il porte l'instrument, le moment et le périmètre qui l'ont produit —
            sinon ce n'est pas un chiffre, c'est une impression écrite en chiffres.
          </li>
          <li>
            <strong>Nous ne déléguons pas la décision.</strong> Parce qu'un système qui
            produit une réponse ne stocke rien : il n'a ni la responsabilité de ce qu'il
            affirme, ni le moyen de savoir qu'il se trompe. Il faut quelqu'un pour vérifier,
            et ce quelqu'un doit pouvoir être nommé.
          </li>
        </ul>

        <p class="impose__note">
          Ce ne sont pas des promesses commerciales, ce sont des <strong>règles de
          travail</strong> : elles coûtent du temps, et c'est pourquoi on les écrit ici
          plutôt que de les laisser dans nos têtes.
        </p>
      </section>

      <!-- ══ 2. LES TROIS GESTES ═════════════════════════════════════════════
           ⚠️ LE TROISIÈME N'EST PAS EN PLACE, ET LA PAGE LE DIT. Le point 3 est
           séparé visuellement du reste pour que le lecteur pressé ne lise pas
           « trois gestes tenus » là où il n'y en a que deux. -->
      <section class="impose__bloc" aria-labelledby="titre-gestes">
        <h2 id="titre-gestes" class="impose__sous-titre">Les trois gestes que nous nous imposons</h2>
        <p>
          Un travail universitaire, cité plus bas, propose trois gestes de défense contre ce
          qu'il appelle un déchargement de l'attention. Nous ne le traitons pas comme une
          preuve — voir la limite, plus bas — mais il décrit assez bien une discipline que ce
          studio applique déjà en partie. La voici, <strong>avec ce qui manque</strong>.
        </p>

        <ol class="impose__gestes">
          <li class="impose__geste">
            <p class="impose__geste-titre">Vérifier systématiquement</p>
            <p>
              Chaque construction du site fait tourner des <strong>contrôles automatiques qui
              échouent quand une règle est cassée</strong> — contrastes, poids de la page
              livrée, nombre de requêtes du premier chargement, cohérence des adresses,
              coordonnées réellement arrivées au visiteur, et la signature qualité qui les
              survole. Un contrôle qui échoue <strong>arrête la livraison</strong> : il ne
              produit pas un avertissement qu'on pourrait choisir de ne pas lire.
              <RouterLink to="/etat-du-studio" class="impose__lien">Le relevé du dernier
              build</RouterLink> montre leur état, tel qu'il a été mesuré, avec l'heure.
            </p>
          </li>

          <li class="impose__geste">
            <p class="impose__geste-titre">Garder des moments sans assistance</p>
            <p>
              Quatre décisions ne passent par aucun outil d'intelligence artificielle :
              <strong>la stratégie, le visuel, le juridique et la mise en ligne</strong>.
              Elles restent au dirigeant, qui les assume. Ce n'est pas une pudeur : c'est le
              seul endroit où la responsabilité peut être nommée quand quelque chose se passe
              mal. Un agent peut proposer une option ; il ne tranche pas, et il ne signe rien.
            </p>
          </li>

          <li class="impose__geste impose__geste--absent">
            <p class="impose__geste-titre">
              S'imposer des périodes déconnectées
              <span class="impose__etiquette">pas encore en place</span>
            </p>
            <p>
              <strong>Ce point n'existe pas encore chez nous, et nous l'écrivons.</strong>
              Le studio n'a pas aujourd'hui de plage où il travaille sans assistance — ni de
              règle qui l'y obligerait. C'est un manque connu, il appartient au dirigeant de
              le trancher, et il est préférable de lire ici un point manquant qu'une
              affirmation de plus.
            </p>
          </li>
        </ol>
      </section>

      <!-- ══ 3. NOTRE MÉMOIRE DE NOS ERREURS ═════════════════════════════════
           ⚠️ LES CHIFFRES DE CE BLOC SONT DATÉS ET VÉRIFIABLES DANS L'HISTORIQUE
           DU DÉPÔT. Aucun n'est arrondi « pour faire propre », aucun n'est
           recompté ici : ils viennent de ce qui a été corrigé, ce jour-là. -->
      <section class="impose__bloc" aria-labelledby="titre-memoire">
        <h2 id="titre-memoire" class="impose__sous-titre">Notre mémoire de nos propres erreurs</h2>
        <p>
          Le studio tient <strong>un registre de ses échecs</strong> : chaque entrée porte sa
          date, ce qui a échoué, et <strong>la mesure qui l'établit</strong>. Peu
          d'organisations le font, et ce n'est pas confortable à tenir — un registre d'échecs
          est un document qui vous contredit à chaque page.
        </p>

        <div class="impose__fait">
          <p class="impose__fait-titre">Le 19 septembre 2026, six affirmations produites par nos propres outils étaient fausses ou non mesurées</p>
          <p>
            Elles ont été trouvées, nommées et corrigées le jour même, et elles tiennent en
            trois familles :
          </p>
          <ul class="impose__liste impose__liste--serree">
            <li><strong>cinq dates</strong> fausses dans quatre fichiers — un travail fait le
              19 estampillé du 20, et une page créée le 19 datée du 18 ;</li>
            <li><strong>un contrôle cité qui n'existait pas</strong> : un fichier affirmait que
              son résultat était mesuré par une commande… que personne n'avait écrite ;</li>
            <li><strong>une alerte qui annonçait « skipped »</strong> alors qu'un
              déploiement avait échoué — et un site resté figé derrière un message qui se
              lisait comme « rien ne s'est passé ».</li>
          </ul>
          <p>
            Le détail est dans l'historique du dépôt, daté. Ce qui compte ici n'est pas le
            total : c'est que <strong>ces six-là n'ont été vues ni par un contrôle ni par une
            relecture</strong>, mais par le dirigeant qui a lu ce que la machine avait écrit.
          </p>
        </div>

        <p class="impose__note impose__note--incertitude">
          <strong>Le chiffre exact, et ce qu'il ne dit pas.</strong> Le relevé du dernier
          build affiche le nombre de contrôles qui ont réellement tourné : c'est lui qui fait
          foi, pas cette page, et le nombre a changé plusieurs fois cette semaine. Cette page
          ne cite donc <strong>ni la liste de ces contrôles, ni leur nombre</strong> — elle
          cite six affirmations fausses, parce que celles-là sont des faits datés.
        </p>
      </section>

      <!-- ══ 4. CE QUE CETTE PAGE NE GARANTIT PAS ════════════════════════════
           LA RUBRIQUE HONNÊTE, ET ELLE EST OBLIGATOIRE ICI PLUS QU'AILLEURS :
           une page de règles est l'endroit exact où un lecteur suppose des
           garanties qu'on n'a pas données. -->
      <section class="impose__bloc impose__bloc--limites" aria-labelledby="titre-limites">
        <h2 id="titre-limites" class="impose__sous-titre">Ce que cette page ne garantit pas</h2>

        <ul class="impose__limites">
          <li>
            <strong>Cela ne rend personne invulnérable.</strong> Aucune méthode ne rend un
            système inviolable, et nous n'en vendons aucune. Ce que ces règles changent est
            plus étroit, et c'est déjà beaucoup : <strong>une compromission de ce studio ne
            donne pas accès au fichier de plus d'un million de personnes dont parlent les
            faits divers de cette rentrée</strong> — parce que ce fichier n'existe pas ici, et
            que rien chez nous ne le rassemble. De la même manière, une erreur du studio
            porte un nom et une date : elle est écrite, et elle reste lisible.
          </li>
          <li>
            <strong>Un travail non évalué par les pairs n'est pas une preuve.</strong>
            Le texte que nous citons plus haut — Solé et Ruffini, identifiant
            <span class="impose__reference">2509.03344</span> — est un <strong>pré-print :
            il n'a pas été évalué par les pairs</strong>, et cette fiche le dit
            elle-même. Nous ne nous appuyons donc pas dessus comme sur un résultat établi :
            nous le lisons comme une <strong>hypothèse intéressante</strong>, et nous
            appliquons des gestes que nous jugerions utiles même si l'hypothèse était fausse.
            L'étude économique citée à côté des mêmes faits d'actualité n'est pas davantage
            une garantie : c'est une étude, avec son échantillon et ses limites.
          </li>
          <li>
            <strong>Nous ne sommes pas juristes.</strong> Nous n'avons qualifié
            juridiquement aucun des faits qui ont motivé cette page, et nous ne le ferons
            pas : la qualification appartient aux autorités, et le conseil au conseil de
            ceux que cela concerne. Nos règles sont des <strong>règles de métier</strong>,
            pas un avis de droit — et cette page n'en donne aucun.
          </li>
          <li>
            <strong>Cette page ne tient pas de registre, et elle ne sera pas à jour
            d'elle-même.</strong> Elle dit l'état des règles au 19 septembre 2026. Un point
            qui change — et le troisième geste peut changer — doit être réécrit ici à la
            main ; rien ne l'y oblige. La page qui, elle, se remesure à chaque construction
            est
            <RouterLink to="/etat-du-studio" class="impose__lien">l'état du studio</RouterLink>.
          </li>
        </ul>
      </section>

      <!-- ── Les sorties ───────────────────────────────────────────────────── -->
      <p class="impose__sorties">
        <RouterLink to="/dossier" class="impose__sortie">
          Voir ce que le studio livre, prix et délais →
        </RouterLink>
        <a :href="LIEN_COURRIEL" class="impose__sortie-secondaire">Poser une question par écrit</a>
      </p>

      <RouterLink to="/" class="impose__retour">← Revenir sur la passerelle</RouterLink>
    </div>
  </div>
</template>

<script setup>
/**
 * CE QUE NOUS NOUS IMPOSONS — les règles que le studio se donne, et leurs limites.
 * GL Digital Lab, 19/09/2026.
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 * POURQUOI CETTE PAGE EXISTE
 *
 * Trois pièces d'actualité sont arrivées le même jour : une étude économique sur
 * des projets d'intelligence artificielle qui ne passent pas l'échelle et qui
 * appellent à replacer l'humain dans les processus ; un argumentaire commercial
 * promettant une plateforme qui « centralise tout et remplace tout » ; et le
 * récit public d'une fuite de données massive concernant une société française.
 * Une quatrième pièce les accompagne : une fiche de lecture sur un pré-print qui
 * compare les grands modèles de langage à un virus cognitif.
 *
 * La consigne du dirigeant tient en deux phrases : « on peut faire quelque chose
 * par rapport à ça », et « nous on se confine par rapport à eux ».
 *
 * Cette page est la réponse, et ce n'est PAS un commentaire d'actualité. Un
 * studio qui réagirait à chaud produirait un article, et un article vieillit en
 * une semaine. Il produit ici **une règle de travail datée** : ce qu'il refuse,
 * ce qu'il s'impose, ce qu'il a raté, et ce que rien de tout cela ne garantit.
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 * ⛔ LES QUATRE INTERDITS DE CETTE PAGE, ET ILS SONT ÉCRITS ICI POUR NE PAS ÊTRE
 *    « RÉPARÉS » PAR ERREUR PLUS TARD
 *
 *   1. LA SOCIÉTÉ VICTIME DE LA FUITE N'EST PAS NOMMÉE. Elle n'a rien demandé, et
 *      elle est déjà attaquée. Citer son nom ici n'ajouterait rien à notre propos
 *      et lui ajouterait quelque chose à elle.
 *   2. AUCUN CHIFFRE DE LA FUITE N'EST REPRIS. Le nombre de lignes et le nombre de
 *      personnes concernées ne sont pas des statistiques : ce sont des personnes
 *      dont les dossiers circulent. Un chiffre de ce genre n'entre pas dans une
 *      page de communication, même pour illustrer une règle.
 *   3. LE LIEU DE VENTE N'EST NI NOMMÉ NI DÉSIGNÉ. On ne fait pas la publicité
 *      d'un endroit où l'on vend des données volées, pas même pour le dénoncer.
 *   4. AUCUN LIEN N'EST ÉTABLI ENTRE L'ARGUMENTAIRE COMMERCIAL ET LA FUITE.
 *      Suggérer un rapport serait une allégation, et une allégation n'est pas une
 *      mesure. Les deux pièces sont citées à des endroits différents de la page,
 *      pour des raisons différentes, et ne se rencontrent jamais.
 *
 *   Et la règle de méthode qui les commande : **une pièce d'actualité n'entre dans
 *   cette page que si le studio peut en tirer une affirmation qu'il tient.** Ce qui
 *   n'entre pas : le nom des victimes, le décompte, le lieu, le soupçon.
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 * LA PHRASE SUR LE PRÉ-PRINT, ET POURQUOI ELLE EST ÉCRITE AINSI
 *
 *   « Le texte que nous citons plus haut — Solé et Ruffini, identifiant
 *     2509.03344 — est un pré-print : il n'a pas été évalué par les pairs, et
 *     cette fiche le dit elle-même. Nous ne nous appuyons donc pas dessus comme
 *     sur un résultat établi : nous le lisons comme une hypothèse intéressante, et
 *     nous appliquons des gestes que nous jugerions utiles même si l'hypothèse
 *     était fausse. »
 *
 *   Les AUTORITÉS sont nommées, l'identifiant est donné, et le statut est dit
 *   AVANT l'usage qu'on en fait. C'est l'ordre des mots qui compte : annoncer
 *   « une étude montre que » puis, en note, « il s'agit d'un pré-print » serait
 *   exact sur le fond et faux dans l'effet. La formule retenue rend l'hypothèse
 *   inutile : nos gestes tiennent sans elle.
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 * D'OÙ VIENNENT LES CHIFFRES DE CETTE PAGE — ET CE QUI N'Y EST PAS
 *
 *   · LES SIX AFFIRMATIONS FAUSSES DU 19/09/2026 viennent de l'historique du
 *     dépôt, où elles sont datées et lisibles : cinq dates fausses (trois dans un
 *     même fichier, une dans une page, une dans une autre), un contrôle cité qui
 *     n'existait pas, et une alerte de déploiement qui annonçait « skipped » alors
 *     que le build avait échoué. Six, et non cinq ni sept : ce qui a été corrigé,
 *     ce jour-là.
 *   · LE NOMBRE DE CONTRÔLES AUTOMATIQUES N'EST PAS CITÉ ICI, VOLONTAIREMENT.
 *     Le générateur de relevé enregistre cinq scripts, et le répertoire en contient
 *     six : deux comptages du même mot qui ne s'accordent pas encore. Le relevé
 *     mesuré vit sur /etat-du-studio, où il est daté. **Recopier ici un nombre que
 *     je ne peux pas mesurer depuis cette page fabriquerait exactement le défaut
 *     que cette page dénonce.**
 *   · LE TROISIÈME GESTE EST ÉCRIT COMME NON EN PLACE. C'est le point de la page
 *     qui a le plus de valeur, et c'est le seul qu'un rédacteur pressé enlèverait.
 *
 * ⛔ CE QUI N'EST PAS DANS LE CONTENU RENDU, ET QUI NE DOIT PAS Y REVENIR
 *   · aucun numéro de port, aucun nom de fichier, aucun chemin local, aucun nom de
 *     modèle ni version de logiciel : les services sont décrits par leur RÔLE ;
 *   · aucun nom de franchise, de marque ou de personnage protégé ;
 *   · aucune donnée personnelle, aucune adresse de tiers, aucune origine réseau.
 */

// Les coordonnées viennent de la source unique (`src/config/contact.js`), jamais
// recopiées : c'est le sujet d'un contrôle du dépôt, et cette page n'y fait pas
// exception. Rien d'autre n'est importé — la page n'a ni état, ni effet, ni appel
// réseau, donc elle est entièrement lisible dans le HTML prérendu.
import { LIEN_COURRIEL } from '@/config/contact.js';
</script>

<style scoped>
/* ─────────────────────────────────────────────────────────────────────────────
   AUCUNE COULEUR EN DUR, AUCUN JETON REDÉCLARÉ.
   Toutes les valeurs viennent de `src/assets/styles/variables.css` : un jeton de
   couleur redéclaré hors de ce fichier fait échouer `verifier-verrous.mjs`.

   CONTRASTES EMPLOYÉS ICI, mesurés sur les deux fonds de la charte :
     --ink / --paper           18,34:1   texte principal
     --ink-soft / --paper      10,87:1   texte courant
     --accent / --paper        14,87:1   titres, liens, repères de liste
     --rule-strong / --paper    4,01:1   bordure FONCTIONNELLE (seul jeton autorisé)
     --alert / --paper          7,07:1   filet des notes
   `--rule` (1,44:1) et `--ink-faint` ne servent PAS de bordure ici : le premier est
   décoratif, le second est réservé au grand texte. Cette page n'en a besoin d'aucun.

   MOUVEMENT : deux transitions de couleur au survol, aucune animation automatique,
   aucun défilement, aucun clignotement. Les deux sont neutralisées sous
   `prefers-reduced-motion: reduce`.
   ───────────────────────────────────────────────────────────────────────────── */

.impose {
  min-height: 100vh;
  background: var(--paper);
  color: var(--ink);
  padding: 4rem 1.25rem 6rem;
}

.impose__enveloppe {
  max-width: 46rem;
  margin: 0 auto;
}

.impose__retour {
  display: inline-block;
  margin: 2.5rem 0 0;
  color: var(--accent);
  text-decoration: none;
  font-family: var(--font-mono);
  font-size: 0.8rem;
  letter-spacing: 0.04em;
}
.impose__retour:hover,
.impose__retour:focus-visible {
  color: var(--accent-ink);
  text-decoration: underline;
}

.impose__tete {
  margin: 2.5rem 0 3.5rem;
}

.impose__sur-titre {
  font-family: var(--font-mono);
  font-size: 0.72rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--accent);
  margin: 0 0 1rem;
}

.impose__titre {
  font-size: clamp(2.2rem, 6vw, 3.4rem);
  line-height: 1.05;
  margin: 0 0 1.25rem;
  font-weight: 500;
  color: var(--ink);
}

.impose__chapeau {
  font-size: 1.05rem;
  line-height: 1.7;
  color: var(--ink-soft);
  margin: 0 0 1.25rem;
  max-width: 38rem;
}

.impose__date {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  letter-spacing: 0.06em;
  color: var(--ink-soft);
  margin: 0;
}

.impose__bloc {
  margin: 0 0 3rem;
}

.impose__sous-titre {
  font-size: 1.1rem;
  font-weight: 500;
  color: var(--ink);
  margin: 0 0 0.9rem;
  padding-bottom: 0.6rem;
  border-bottom: 1px solid var(--rule-strong);
}

.impose__bloc p {
  line-height: 1.75;
  color: var(--ink-soft);
  margin: 0 0 1rem;
}

.impose__bloc strong {
  color: var(--ink);
}

.impose__lien {
  color: var(--accent);
}
.impose__lien:hover,
.impose__lien:focus-visible {
  color: var(--accent-ink);
  text-decoration: underline;
}

.impose__note {
  border-left: 3px solid var(--rule-strong);
  padding-left: 1rem;
  font-size: 0.95rem;
}

.impose__note--incertitude {
  border-left-color: var(--alert);
  font-size: 0.92rem;
}

/* ── Les listes de refus et de faits ─────────────────────────────────────── */
.impose__liste {
  list-style: none;
  margin: 1.5rem 0;
  padding: 0;
}

.impose__liste li {
  position: relative;
  padding: 0 0 1rem 1.4rem;
  line-height: 1.7;
  color: var(--ink-soft);
}
.impose__liste li::before {
  content: '—';
  position: absolute;
  left: 0;
  color: var(--accent);
}

.impose__liste--serree {
  margin: 0.75rem 0 1rem;
}
.impose__liste--serree li {
  padding-bottom: 0.5rem;
  font-size: 0.95rem;
}

/* ── Les trois gestes ────────────────────────────────────────────────────── */
.impose__gestes {
  list-style: none;
  counter-reset: geste;
  margin: 1.5rem 0;
  padding: 0;
  display: grid;
  gap: 1rem;
}

.impose__geste {
  background: var(--paper-alt);
  border: 1px solid var(--rule-strong);
  border-radius: 0.5rem;
  padding: 1.1rem 1.25rem 0.25rem;
  transition: transform var(--transition-fast);
}
.impose__geste:hover {
  transform: translateY(-2px);
}

/* ⚠️ LE GESTE NON TENU EST DISTINGUÉ PAR UNE BORDURE, PAS PAR UNE COULEUR
   D'ALERTE PLEINE : c'est une information de lecture, pas une panne. Le filet
   `--alert` (7,07:1 sur le fond, 6,7:1 sur les cartes) est le même jeton que
   celui des notes du dossier professionnel — la cohérence entre pages fait
   partie de ce qu'un lecteur vérifie sans le dire. */
.impose__geste--absent {
  border-left-width: 3px;
  border-left-color: var(--alert);
}

.impose__geste-titre {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.6rem;
  font-family: var(--font-mono);
  font-size: 0.92rem;
  color: var(--ink);
  margin: 0 0 0.4rem !important;
}

.impose__etiquette {
  font-family: var(--font-mono);
  font-size: 0.68rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--ink);
  background: var(--alert);
  border-radius: 2px;
  padding: 0.15rem 0.45rem;
}

.impose__geste p {
  margin: 0 0 0.9rem;
  font-size: 0.95rem;
  line-height: 1.7;
  color: var(--ink-soft);
}

/* ── Le fait daté ────────────────────────────────────────────────────────── */
.impose__fait {
  border: 1px solid var(--rule-strong);
  border-radius: 0.5rem;
  padding: 1.1rem 1.25rem 0.25rem;
  margin: 1.5rem 0;
}

.impose__fait-titre {
  font-family: var(--font-mono);
  font-size: 0.9rem;
  line-height: 1.6;
  color: var(--accent);
  margin: 0 0 0.75rem !important;
}

/* ── Les limites ─────────────────────────────────────────────────────────── */
.impose__bloc--limites {
  background: var(--paper-alt);
  border-radius: 0.5rem;
  padding: 1.5rem 1.5rem 0.5rem;
}
.impose__bloc--limites .impose__sous-titre {
  border-bottom: none;
  padding-bottom: 0;
}

.impose__limites {
  list-style: none;
  margin: 0;
  padding: 0;
}

.impose__limites li {
  position: relative;
  padding: 0 0 1rem 1.4rem;
  line-height: 1.7;
  color: var(--ink-soft);
}
.impose__limites li::before {
  content: '—';
  position: absolute;
  left: 0;
  color: var(--accent);
}

.impose__reference {
  font-family: var(--font-mono);
  font-size: 0.9rem;
  color: var(--accent);
  overflow-wrap: anywhere;
}

/* ── Les sorties ─────────────────────────────────────────────────────────── */
.impose__sorties {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1.25rem;
  margin: 0 0 0.5rem !important;
}

.impose__sortie {
  display: inline-block;
  padding: 0.85rem 1.6rem;
  background: var(--accent);
  color: var(--action-ink);
  font-weight: 600;
  text-decoration: none;
  border-radius: 3px;
  transition: background var(--transition-fast);
}
.impose__sortie:hover,
.impose__sortie:focus-visible {
  background: var(--accent-ink);
}

.impose__sortie-secondaire {
  color: var(--ink);
  font-size: 0.95rem;
}
.impose__sortie-secondaire:hover,
.impose__sortie-secondaire:focus-visible {
  color: var(--accent);
}

/* ── Le calme demandé est respecté ───────────────────────────────────────── */
@media (prefers-reduced-motion: reduce) {
  .impose__geste,
  .impose__sortie {
    transition: none;
  }
  .impose__geste:hover {
    transform: none;
  }
}

@media (max-width: 640px) {
  .impose__geste,
  .impose__fait {
    padding: 1rem 1rem 0.25rem;
  }
  .impose__bloc--limites {
    padding: 1.25rem 1.25rem 0.25rem;
  }
}
</style>
