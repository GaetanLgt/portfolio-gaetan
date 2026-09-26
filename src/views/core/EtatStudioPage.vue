<template>
  <!--
    ⚠️ `<div>` ET NON `<main>` — MÊME RAISON QU'À L'IA DE BORD ET À LA SOUTE.
    `App.vue` pose déjà `<main id="main-content" role="main">` autour de tout le contenu
    rendu par le routeur. Une page qui en ajoute un second produit un repère `main`
    IMBRIQUÉ : deux constats d'accessibilité pour une seule page
    (`landmark-main-is-top-level`, `landmark-no-duplicate-main`). Un document n'a qu'un
    seul contenu principal. La classe porte la mise en page, pas la sémantique.
  -->
  <div class="etat">
    <div class="etat__enveloppe">

      <RouterLink to="/" class="etat__retour">← Revenir sur la passerelle</RouterLink>

      <header class="etat__tete">
        <p class="etat__sur-titre">Compartiment de bord · le relevé du présent</p>
        <h1 class="etat__titre">L'état du studio</h1>
        <p class="etat__chapeau">
          Cette page ne raconte pas ce que le studio sait faire : elle montre
          <strong>ce qui s'est réellement passé</strong> — le commit livré, la minute du
          build, ce que les contrôles du dépôt ont rendu, et qui est venu nous lire.
          <strong>Chaque chiffre porte son heure ou sa date</strong>, et ceux qui n'ont pas
          pu être mesurés le disent plutôt que d'afficher un zéro.
        </p>
      </header>

      <!-- ══ 1. LE RELEVÉ DU BUILD ═════════════════════════════════════════════
           Tout ce bloc est PRÉRENDU : ces chiffres sont dans le HTML livré, donc
           lisibles par un robot et par un visiteur sans JavaScript. Ils ne
           dépendent d'aucune requête réseau. -->
      <section class="etat__bloc" aria-labelledby="titre-build">
        <h2 id="titre-build" class="etat__sous-titre">Le relevé du build</h2>
        <p>
          Ces valeurs sont écrites <strong>au moment de la construction du site</strong>,
          puis figées : elles décrivent le site tel qu'il a été assemblé, pas une
          intention.
        </p>

        <dl class="etat__mesures">
          <div v-for="m in mesuresBuild" :key="m.cle" class="etat__mesure">
            <dt class="etat__mesure-intitule">{{ m.intitule }}</dt>
            <!--
              ⚠️ RIEN D'AUTRE QU'UN `<dt>` ET UN `<dd>` ENTRE `<dl>` ET CETTE `<div>`.
              Défaut réellement produit ici le 19/09/2026, trouvé par `npx axe` et non
              par relecture : le premier jet mettait la phrase de source dans un `<p>`
              placé À CÔTÉ du `<dd>`, ce qui donne `dl > div > p` — du contenu qui
              n'appartient à aucune définition. axe l'a nommé : « Ensure <dl> elements
              are structured correctly ». **La source d'une mesure est une DÉFINITION,
              pas une note en marge** : elle va donc à l'intérieur du `<dd>`.
            -->
            <dd class="etat__mesure-valeur">
              <span
                :data-etat="m.cle"
                :class="{ 'etat__mesure-chiffre--absente': m.absente }"
                class="etat__mesure-chiffre"
              >{{ m.valeur }}</span>
              <span class="etat__mesure-source">{{ m.source }}</span>
            </dd>
          </div>
        </dl>

        <p v-if="etat.commit.arbre_modifie === true" class="etat__note">
          ⚠️ Le relevé a été fait sur un <strong>arbre de travail modifié</strong> : les
          fichiers livrés ne sont pas exactement ceux du commit affiché. C'est dit ici
          parce qu'un relevé qui laisse croire le contraire n'est pas un relevé.
        </p>
        <p v-else-if="etat.commit.arbre_modifie === null" class="etat__note">
          ⚠️ L'état de l'arbre de travail n'a pas pu être mesuré à cet endroit (pas de
          dépôt de gestion de versions). Le commit affiché peut donc ne pas décrire
          exactement les fichiers livrés.
        </p>
      </section>

      <!-- ══ 2. CE QUI A ÉTÉ VÉRIFIÉ, ET QUAND ═══════════════════════════════ -->
      <section class="etat__bloc" aria-labelledby="titre-verrous">
        <h2 id="titre-verrous" class="etat__sous-titre">Ce qui a été vérifié, et quand</h2>
        <p>
          Le studio ne promet pas la qualité : il la <strong>mesure</strong>, à chaque
          construction, avec des contrôles automatiques qui échouent quand une règle est
          cassée. Voici <strong>leur code de sortie réel</strong>, tel que la construction
          l'a obtenu — et c'est un code, pas un avis.
        </p>

        <ul class="etat__verrous">
          <li v-for="v in etat.verrous" :key="v.cle" class="etat__verrou">
            <p class="etat__verrou-nom">{{ nomCourt(v) }}</p>
            <p class="etat__verrou-verdict">
              <span
                :class="['etat__etat', v.code === 0 ? 'etat__etat--tenu' : 'etat__etat--inconnu']"
                :data-etat="'verrou_' + v.cle"
              >
                {{ v.code === null ? 'non mesuré' : 'code de sortie ' + v.code }}
              </span>
              <span class="etat__verrou-quand" data-etat="verrous_quand">{{ etat.build.horodatage_minute || 'non mesuré' }}</span>
            </p>
            <p v-if="v.motif" class="etat__verrou-motif">{{ v.motif }}</p>
          </li>
        </ul>

        <p class="etat__note">
          ⚠️ « Code de sortie 0 » veut dire <strong>le contrôle n'a pas échoué</strong>, et
          rien de plus. Un code de sortie ne dit jamais ce qui s'est passé : il faut lire
          la sortie du contrôle. On écrit donc le code tel quel plutôt que de le traduire
          en « tout va bien », parce que la traduction serait un jugement de plus.
        </p>
      </section>

      <!-- ══ 3. CE QUI TOURNE ════════════════════════════════════════════════
           ⛔ LES RÔLES, JAMAIS L'ARCHITECTURE. Aucun numéro de port, aucun nom de
           fichier, aucun chemin local, aucun nom de logiciel interne : publier un plan
           de ports sur un site public, c'est publier un plan de reconnaissance. Ce qui
           est écrit ici est ce que `public/llms.txt` dit déjà publiquement. -->
      <section class="etat__bloc" aria-labelledby="titre-services">
        <h2 id="titre-services" class="etat__sous-titre">Ce qui tourne en ce moment</h2>
        <p>
          Un site public n'a pas à publier le plan de ses machines — on décrit donc
          <strong>ce que chaque service fait</strong>, jamais comment le réseau est
          construit ni où quoi écoute.
        </p>
        <ul class="etat__services">
          <li v-for="s in services" :key="s.role" class="etat__service">
            <p class="etat__service-role">{{ s.role }}</p>
            <p class="etat__service-detail">{{ s.detail }}</p>
          </li>
        </ul>
        <p class="etat__note">
          Aucun de ces services n'est dans un nuage étranger. Les traitements
          d'intelligence artificielle s'exécutent sur le matériel du studio ou sur celui
          du client — c'est la règle du bord, et elle s'applique aussi à cette page.
        </p>
      </section>

      <!-- ══ 4. QUI VIENT NOUS LIRE ══════════════════════════════════════════
           LA PARTIE VIVANTE. Elle se dégrade proprement : sans JavaScript, ou si le
           relevé n'arrive pas, le texte « relevé indisponible » reste — jamais un
           zéro, jamais un vide silencieux. -->
      <section class="etat__bloc" aria-labelledby="titre-moteurs">
        <h2 id="titre-moteurs" class="etat__sous-titre">Qui vient nous lire</h2>
        <p>
          Les moteurs d'IA qui passent sur ce site laissent une trace dans le
          <strong>journal d'accès du serveur</strong> — la seule source qui les voit, parce
          qu'un compteur dans la page ne s'exécute jamais chez un robot. Le relevé
          ci-dessous est donc lu <strong>sur le serveur</strong>, et il ne rend que des
          <strong>compteurs agrégés</strong> : aucune adresse, aucune page consultée,
          aucun identifiant de visiteur.
        </p>

        <div class="etat__releve" role="status" aria-live="polite">
          <p v-if="moteurs.etat === 'lu'" class="etat__releve-tete">
            Relevé vivant · mesuré le {{ heureLisible(moteurs.mesureA) }}
          </p>
          <p v-else-if="moteurs.etat === 'vide'" class="etat__releve-tete">
            Relevé vivant · mesuré le {{ heureLisible(moteurs.mesureA) }}
          </p>
          <p v-else class="etat__releve-tete etat__releve-tete--indisponible">
            Relevé indisponible · dernier relevé connu : celui du build, plus bas
          </p>

          <table v-if="moteurs.etat === 'lu'" class="etat__table">
            <caption class="etat__table-legende">
              Passages des moteurs d'IA, comptés dans le journal d'accès du serveur.
            </caption>
            <thead>
              <tr>
                <th scope="col">Moteur</th>
                <th scope="col">Passages</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="m in moteurs.liste" :key="m.moteur">
                <td>{{ m.moteur }}</td>
                <td class="etat__table-nombre">{{ m.passages }}</td>
              </tr>
            </tbody>
          </table>

          <p v-else-if="moteurs.etat === 'vide'" class="etat__releve-vide">
            Le journal a été lu, et <strong>aucun moteur reconnu n'y figure</strong>. Ce n'est
            pas une panne : c'est un résultat. Un site jeune et peu cité peut n'avoir encore
            reçu la visite d'aucun moteur d'IA.
          </p>

          <p v-else class="etat__releve-vide">
            Le relevé n'a pas pu être obtenu à l'instant de votre visite
            ({{ moteurs.raison }}). Le comptage ne s'affiche pas, et il n'est remplacé par
            aucun zéro : <strong>« pas de réponse » n'est pas « personne n'est venu »</strong>.
          </p>

          <p class="etat__note etat__note--dans-releve">
            ⚠️ Un moteur qui <strong>passe</strong> n'est pas un moteur qui <strong>cite</strong>.
            Ce tableau compte des passages. Et il les identifie par ce que le visiteur
            déclare de lui-même : <strong>un robot peut mentir sur son nom</strong>. Ce relevé
            identifie, il ne prouve pas.
          </p>
        </div>
      </section>

      <!-- ══ 5. CE QUE CETTE PAGE NE SAIT PAS ════════════════════════════════ -->
      <section class="etat__bloc etat__bloc--limites" aria-labelledby="titre-limites">
        <h2 id="titre-limites" class="etat__sous-titre">Ce que cette page ne sait pas</h2>
        <p>
          Une page qui prétendrait tout mesurer serait fausse avant même d'être lue. Voici
          ce qui manque, en clair.
        </p>
        <ul class="etat__liste">
          <li>
            <strong>Elle ne connaît pas le présent.</strong> Le relevé du build a été figé à
            la minute indiquée plus haut : si le site a été mis à jour depuis, cette page ne
            le sait pas avant la prochaine construction. Seul le comptage des moteurs est
            lu en direct, et il peut être indisponible — c'est écrit quand c'est le cas.
          </li>
          <li>
            <strong>Elle ne compte pas les visiteurs humains.</strong> L'analyse d'audience du
            studio est auto-hébergée et n'a rien à voir avec ce relevé. Les passages des
            moteurs d'IA sont un comptage de robots : ils ne disent rien de l'audience.
          </li>
          <li>
            <strong>Elle ne mesure pas la disponibilité ni la vitesse.</strong> Aucun temps de
            réponse, aucune durée de service, aucune disponibilité n'est mesuré ici. Ces
            chiffres n'existent pas pour cette page — et un chiffre qui n'existe pas ne
            s'affiche pas.
          </li>
        </ul>
      </section>

      <!-- ── Les deux sorties ───────────────────────────────────────────────── -->
      <p class="etat__sorties">
        <RouterLink to="/dossier" class="etat__sortie">
          Voir ce que le studio livre, prix et délais →
        </RouterLink>
        <RouterLink to="/contact" class="etat__sortie-secondaire">
          Poser une question
        </RouterLink>
      </p>

      <RouterLink to="/" class="etat__retour">← Revenir sur la passerelle</RouterLink>
    </div>
  </div>
</template>

<script setup>
/**
 * L'ÉTAT DU STUDIO — le présent réel, mesuré, et seulement lui. GL Digital Lab, 19/09/2026.
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 * LA RÈGLE QUI COMMANDE TOUTE CETTE PAGE
 *
 *   RIEN DE SIMULÉ. AUCUN INDICATEUR « LIVE » QUI NE LE SOIT PAS.
 *   *Une pastille verte qui clignote sans rien mesurer est PIRE qu'une page
 *   statique : elle ajoute le mensonge à l'immobilité.*
 *
 * Conséquence, et elle explique la forme de la page : **il n'y a ici aucun point
 * qui clignote, aucun compteur qui s'incrémente tout seul, aucune animation de
 * fond.** Ce qui bouge, c'est le chiffre des moteurs d'IA quand il arrive du
 * serveur, et rien d'autre. Tout le reste est un relevé daté.
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 * D'OÙ VIENNENT LES CHIFFRES — DEUX SOURCES, JAMAIS MÉLANGÉES
 *
 *   1. LE RELEVÉ DU BUILD — `public/etat-studio.json`, écrit par
 *      `scripts/generer-etat.mjs` au moment de la construction, et importé ici.
 *      ⚠️ IL EST IMPORTÉ, DONC IL EST DANS LE HTML LIVRÉ. C'est le point qui décide
 *      de l'architecture de cette page : un `fetch()` au chargement ne serait
 *      lisible que par un navigateur, et **un robot qui n'exécute pas de JavaScript
 *      ne verrait rien** — ce qui viderait de son sens une page faite pour dire ce
 *      qui est vrai.
 *      Une mesure indisponible y vaut `null` et s'affiche « non mesuré ». Jamais
 *      zéro, jamais une valeur par défaut, jamais une estimation.
 *
 *   2. LE RELEVÉ VIVANT — `api/etat.php`, qui lit le journal d'accès du serveur et
 *      rend les passages des moteurs d'IA, en compteurs agrégés. C'est la seule
 *      partie qui vient du réseau, et elle a un délai maximum.
 *
 * ⚠️ CE QUI SE PASSE QUAND LE RELEVÉ VIVANT NE RÉPOND PAS
 *   L'affichage RESTE sur « relevé indisponible » et le dit, en nommant la raison
 *   (délai dépassé, réponse illisible, erreur du serveur). Il ne retombe pas sur le
 *   relevé du build « comme si » c'était le comptage du jour, et il n'affiche aucun
 *   zéro. **« Pas de réponse » n'est pas « personne n'est venu »** — confondre les
 *   deux serait exactement le mensonge que cette page refuse.
 *   Le gabarit est écrit de telle sorte que ce texte soit celui du HTML PRÉRENDU :
 *   c'est l'état par défaut, pas un état de secours atteint après coup.
 *
 * ⛔ CE QUI N'EST PAS DANS LE CONTENU RENDU, ET QUI NE DOIT PAS Y REVENIR
 *   · aucun numéro de port, aucun nom de fichier, aucun chemin local ;
 *   · aucun nom de logiciel interne, aucune version, aucun nom de modèle d'IA ;
 *   · aucun nom de franchise, de marque ou de personnage protégé ;
 *   · aucune donnée personnelle, aucune adresse IP, aucun chemin de page visitée :
 *     l'endpoint ne les rend pas, la page ne les demande donc pas ;
 *   · aucun chiffre non mesuré : le nombre de verrous affiché est celui du fichier
 *     (`etat.verrous.length`), pas un nombre écrit à la main.
 */

import { ref, computed, onMounted } from 'vue';
// Le relevé écrit par `scripts/generer-etat.mjs` pendant le build. Voir l'en-tête :
// c'est un IMPORT et non un `fetch`, pour que les chiffres soient dans le HTML livré.
import etat from '@/data/etat-studio.json';

/* ── 1. Le relevé du build, mis en forme ────────────────────────────────────────
   Chaque ligne porte SON intitulé, SA valeur et SA source. Une valeur absente est
   écrite « non mesuré » : le `null` du fichier ne devient jamais un zéro. */
const NB = new Intl.NumberFormat('fr-FR');

const brut = (v, unite = '') => (v === null || v === undefined ? 'non mesuré' : `${NB.format(v)}${unite}`);

/**
 * ⚠️ LA CLÉ DE CHAQUE MESURE EST CELLE DU `data-etat` DU GABARIT, et elle est lue
 * par `scripts/relever-dans-html.mjs` : c'est par elle que le relevé FINAL est écrit
 * dans le HTML prérendu. Renommer une clé ici sans la renommer là-bas fait ÉCHOUER
 * cette passe — bruyamment, et c'est voulu : une zone marquée qu'on ne retrouve plus
 * doit arrêter la livraison, pas laisser une valeur périmée sur la page.
 */
const mesuresBuild = computed(() => {
  const c = etat.commit || {};
  const b = etat.build || {};
  const p = etat.page_la_plus_lourde || {};
  const r = etat.requetes_premier_chargement || {};
  return [
    {
      cle: 'commit',
      intitule: 'Commit livré',
      valeur: c.court ? `${c.court}${c.sujet ? ' — ' + c.sujet : ''}` : 'non mesuré',
      absente: !c.court,
      // ⚠️ LA DATE EST COUPÉE AU JOUR, ET VOLONTAIREMENT. Le premier jet affichait
      // les 19 premiers caractères de l'horodatage ISO : « 2026-09-19 à 09:50:31+ ».
      // Le « + » du fuseau restait pendu au bout, sans sa suite — une date tronquée
      // au milieu d'un fuseau horaire. On n'affiche que le JOUR, qui est lisible et
      // exact ; l'heure du commit ne sert à rien ici, celle du build est plus haut.
      source: c.date ? `Commit du ${String(c.date).slice(0, 10)}.` : 'Mesuré par le générateur, au build.',
    },
    {
      cle: 'horodatage',
      intitule: 'Horodatage du build',
      valeur: b.horodatage_local || 'non mesuré',
      absente: !b.horodatage_local,
      source: b.fuseau ? `Heure locale du poste de construction (${b.fuseau}), à la seconde.` : 'Heure locale du poste de construction.',
    },
    {
      cle: 'pages',
      intitule: 'Pages prérendues',
      valeur: brut(etat.pages_prerendues),
      absente: etat.pages_prerendues === null || etat.pages_prerendues === undefined,
      source: 'Compté dans le site construit : chaque page a son HTML, sans exécuter de JavaScript.',
    },
    {
      cle: 'poids',
      intitule: 'Page la plus lourde',
      valeur: p.ko_servis === null || p.ko_servis === undefined
        ? 'non mesuré'
        : `${p.chemin} — ${NB.format(p.ko_servis)} Ko servis`,
      absente: p.ko_servis === null || p.ko_servis === undefined,
      source: p.seuil_ko ? `Textes compressés, binaires sur disque. Seuil tenu : ${NB.format(p.seuil_ko)} Ko par page.` : 'Textes compressés, binaires sur disque.',
    },
    {
      cle: 'requetes',
      intitule: 'Requêtes du premier chargement',
      valeur: r.total === null || r.total === undefined ? 'non mesuré' : NB.format(r.total),
      absente: r.total === null || r.total === undefined,
      source: r.seuil ? `Mesuré sur le site construit. Seuil tenu : ${NB.format(r.seuil)} requêtes.` : 'Mesuré sur le site construit.',
    },
  ];
});

/* ── 2. Le nom court d'un verrou, affiché au visiteur ───────────────────────────
   ⚠️ CE N'EST PAS UNE DÉCORATION : c'est une traduction de nom de fichier en français
   lisible, et elle a coûté DEUX corrections le 19/09/2026, toutes deux vues dans le
   HTML LIVRÉ et non en relisant ce fichier :
     · la dérivation automatique (« verifier-requetes.mjs » → « Requetes ») rendait le
       nom SANS SON ACCENT. Le français complet est une règle du studio : un accent
       perdu dans un libellé est un défaut, pas une broutille ;
     · le même procédé donnait « Verrous » pour le premier contrôle — le titre de sa
       propre catégorie. Le lecteur voyait donc une liste dont le premier élément
       s'appelait comme la liste.
   La table ci-dessous écrit les noms UNE FOIS, en français. Elle est indexée par la
   clé du relevé (`etat.verrous[].cle`), qui vient du générateur : le nombre de lignes
   affichées reste celui du fichier, jamais un nombre recopié ici. Un contrôle ajouté
   au générateur apparaît avec la forme dérivée de son nom de fichier — imparfaite,
   mais jamais absente.
   ⚠️ Les noms restent DESCRIPTIFS DU RÔLE, jamais du contenu interne : nommer les
   règles que le contrôle protège (contrastes, poids, topographie) est ce que la page
   explique déjà plus bas ; nommer ses fichiers ne l'est pas. */
const NOMS_VERROUS = {
  verrous: 'Signature qualité',
  poids: 'Poids du premier chargement',
  requetes: 'Requêtes du premier chargement',
  topographie: 'Topographie du site',
  contact: 'Contact livré au visiteur',
};

function nomCourt(verrou) {
  if (NOMS_VERROUS[verrou.cle]) return NOMS_VERROUS[verrou.cle];
  // Repli pour un contrôle que le générateur connaîtrait sans que cette page le sache :
  // on le rend lisible, plutôt que de laisser un nom de fichier brut à l'écran.
  return (verrou.nom || 'verrou').charAt(0).toUpperCase() + (verrou.nom || 'verrou').slice(1);
}

/* ── 3. Ce qui tourne — LES RÔLES, JAMAIS L'ARCHITECTURE ────────────────────────
   Chaque ligne est vérifiable dans `public/llms.txt`, c'est-à-dire dans ce que le
   studio dit DÉJÀ publiquement de lui-même. Rien n'est ajouté ici qui ne soit écrit
   ailleurs sur le site : cette page montre l'état du studio, elle ne publie pas une
   description technique de plus. */
const services = [
  {
    role: 'Ce site',
    detail: 'Il est servi depuis un hébergement mutualisé en France, et chaque page arrive déjà écrite : le contenu est lisible sans exécuter de script.',
  },
  {
    role: 'Le formulaire de contact',
    detail: 'Traité par un script hébergé sur le serveur du studio, en France. Aucun sous-traitant, aucun transfert hors de l\'Union européenne.',
  },
  {
    role: 'La mesure d\'audience',
    detail: 'Assurée par une instance auto-hébergée, en France. Aucun outil d\'analyse tiers ne reçoit la visite.',
  },
  {
    role: 'Les traitements d\'intelligence artificielle',
    detail: 'Exécutés sur le matériel du studio ou sur celui du client, en France — jamais dans un nuage étranger.',
  },
  {
    role: 'La mémoire documentaire',
    detail: 'Les documents de référence du bord sont indexés localement, et une réponse ne sort jamais sans sa source.',
  },
];

/* ── 4. Le relevé vivant ────────────────────────────────────────────────────────
   ⚠️ ÉTAT INITIAL = « indisponible », ET C'EST VOULU.
   Sans JavaScript, sans réseau, ou avant que la réponse n'arrive, la page affiche
   « relevé indisponible ». Ce n'est donc pas un état de secours atteint après un
   échec : c'est l'état écrit dans le HTML prérendu, celui que lit un robot.
   Le délai maximum est de 4 secondes : au-delà, un compteur qui n'arrive pas ne doit
   pas laisser le visiteur devant un vide, ni devant une promesse.
*/
const DELAI_MAX_MS = 4000;

const moteurs = ref({ etat: 'indisponible', liste: [], mesureA: null, raison: 'en cours de relevé' });

/** Vrai si la forme reçue est celle qu'on sait lire — sinon on refuse de l'afficher. */
function releveLisible(d) {
  return !!d
    && d.releve === 'lu'
    && Array.isArray(d.moteurs)
    && d.moteurs.every((m) => m && typeof m.moteur === 'string' && Number.isFinite(m.passages));
}

function heureLisible(iso) {
  if (!iso) return 'heure non transmise';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return 'heure illisible';
  return d.toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' });
}

onMounted(async () => {
  // Le prérendu s'exécute dans un navigateur : `fetch` existe, mais l'endpoint n'est
  // pas servi par le serveur de prérendu. On ne protège donc pas seulement l'absence
  // de `fetch` — on assume que l'appel peut échouer ici, et c'est sans conséquence :
  // le HTML livré porte déjà l'état « indisponible », qui est le bon.
  if (typeof fetch !== 'function') {
    moteurs.value = { etat: 'indisponible', liste: [], mesureA: null, raison: 'prise en charge réseau absente' };
    return;
  }
  const minuterie = new AbortController();
  const reveil = setTimeout(() => minuterie.abort(), DELAI_MAX_MS);
  try {
    const reponse = await fetch('/api/etat.php', {
      signal: minuterie.signal,
      headers: { Accept: 'application/json' },
      credentials: 'omit',      // aucun cookie n'a de raison de partir avec ce relevé
      cache: 'no-store',        // c'est un relevé : on ne veut pas d'une version en cache du navigateur
    });
    if (!reponse.ok) {
      moteurs.value = { etat: 'indisponible', liste: [], mesureA: null, raison: `réponse du serveur ${reponse.status}` };
      return;
    }
    const donnees = await reponse.json();
    if (!releveLisible(donnees)) {
      moteurs.value = { etat: 'indisponible', liste: [], mesureA: null, raison: 'réponse illisible' };
      return;
    }
    moteurs.value = {
      // « lu » avec une liste vide est un RÉSULTAT (le journal a été lu, personne n'est
      // venu), et non une panne. Les deux cas ne disent pas la même chose, donc on ne
      // les affiche pas de la même façon.
      etat: donnees.moteurs.length ? 'lu' : 'vide',
      liste: donnees.moteurs,
      mesureA: donnees.mesure_a || null,
      raison: null,
    };
  } catch (e) {
    const delai = e && (e.name === 'AbortError' || e.name === 'TimeoutError');
    moteurs.value = {
      etat: 'indisponible',
      liste: [],
      mesureA: null,
      raison: delai ? 'délai de 4 secondes dépassé' : 'relevé injoignable',
    };
  } finally {
    clearTimeout(reveil);
  }
});
</script>

<style scoped>
/* ─────────────────────────────────────────────────────────────────────────────
   AUCUNE COULEUR EN DUR, AUCUN JETON REDÉCLARÉ.
   Toutes les valeurs viennent de `src/assets/styles/variables.css`. C'est un verrou
   mesuré : un jeton de couleur redéclaré hors de ce fichier fait échouer
   `node scripts/verifier-verrous.mjs` (VERROU 6).

   RAPPEL DES SEUILS, tels que le dépôt les juge :
     --ink / --paper            18,34:1  → texte principal
     --ink-soft / --paper       10,87:1  → texte secondaire
     --accent / --paper         14,87:1  → titres, liens et VALEURS MESURÉES
     --rule-strong / carte       3,80:1  → bordure FONCTIONNELLE, seul jeton autorisé
     --rule / --paper            1,44:1  → DÉCORATIF uniquement : cette page ne
                                           l'emploie pas du tout, c'est plus sûr.
   `--ink-faint` (3,0:1) et les néons sont réservés au grand texte : cette page ne
   les emploie pas non plus, pour que le contrôle ne puisse pas être contourné par
   un usage détourné.
   ⚠️ LA SEULE INVERSION DE LA PAGE, ET ELLE EST RAISONNÉE : les valeurs mesurées
   (commit, horodatage, Ko, requêtes, passages) sont écrites en `--accent` SUR
   `--paper` — 14,87:1. Jamais en `--accent` sur une carte (`--paper-alt`), où il
   ne donnerait plus que 11,61:1 : au-dessus du seuil, mais cette page n'a aucune
   raison de s'en approcher alors qu'un fond de page suffit.

   MOUVEMENT : deux transitions de couleur au survol, aucune animation automatique,
   aucune boucle, aucun clignotement — c'est la règle de la page (rien de simulé).
   Les deux transitions sont neutralisées sous `prefers-reduced-motion: reduce`.
   ───────────────────────────────────────────────────────────────────────────── */

.etat {
  min-height: 100vh;
  background: var(--paper);
  color: var(--ink);
  padding: 4rem 1.25rem 6rem;
}

.etat__enveloppe {
  max-width: 46rem;
  margin: 0 auto;
}

.etat__retour {
  display: inline-block;
  margin: 2.5rem 0 0;
  color: var(--accent);
  text-decoration: none;
  font-family: var(--font-mono);
  font-size: 0.8rem;
  letter-spacing: 0.04em;
}
.etat__retour:hover,
.etat__retour:focus-visible {
  color: var(--accent-ink);
  text-decoration: underline;
}

.etat__tete {
  margin: 2.5rem 0 3.5rem;
}

.etat__sur-titre {
  font-family: var(--font-mono);
  font-size: 0.72rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--accent);
  margin: 0 0 1rem;
}

.etat__titre {
  font-size: clamp(2.2rem, 6vw, 3.4rem);
  line-height: 1.05;
  margin: 0 0 1.25rem;
  font-weight: 500;
  color: var(--ink);
}

.etat__chapeau {
  font-size: 1.05rem;
  line-height: 1.7;
  color: var(--ink-soft);
  margin: 0;
  max-width: 38rem;
}

.etat__bloc {
  margin: 0 0 3rem;
}

.etat__sous-titre {
  font-size: 1.1rem;
  font-weight: 500;
  color: var(--ink);
  margin: 0 0 0.9rem;
  padding-bottom: 0.6rem;
  border-bottom: 1px solid var(--rule-strong);
}

.etat__bloc p {
  line-height: 1.75;
  color: var(--ink-soft);
  margin: 0 0 1rem;
}

.etat__bloc strong {
  color: var(--ink);
}

.etat__note {
  border-left: 3px solid var(--rule-strong);
  padding-left: 1rem;
  font-size: 0.95rem;
}

/* ── Les mesures du build ────────────────────────────────────────────────── */
.etat__mesures {
  margin: 1.5rem 0;
  display: grid;
  gap: 0.5rem;
}

.etat__mesure {
  padding: 0.9rem 0;
  border-bottom: 1px solid var(--rule-strong);
}

.etat__mesure-intitule {
  font-family: var(--font-mono);
  font-size: 0.72rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--ink);
  margin: 0 0 0.35rem;
}

.etat__mesure-valeur {
  margin: 0;
  color: var(--ink-soft);
}

/* ⚠️ LA SEULE INVERSION DE LA PAGE : les VALEURS MESURÉES sont en `--accent`, et
   elles sont posées sur `--paper` — 14,87:1. Jamais sur une carte (`--paper-alt`),
   où le même accent ne donnerait plus que 11,61:1 : au-dessus du seuil, mais cette
   page n'a aucune raison de s'en approcher alors qu'un fond de page suffit. */
.etat__mesure-chiffre {
  display: block;
  font-family: var(--font-mono);
  font-size: 1.02rem;
  line-height: 1.5;
  color: var(--accent);
  overflow-wrap: anywhere;
}

.etat__mesure-chiffre--absente {
  color: var(--ink-soft);
  font-style: italic;
}

.etat__mesure-source {
  display: block;
  margin: 0.3rem 0 0;
  font-size: 0.85rem;
  line-height: 1.6;
  color: var(--ink-soft);
}

/* ── Les verrous ─────────────────────────────────────────────────────────── */
.etat__verrous {
  list-style: none;
  margin: 1.5rem 0;
  padding: 0;
  display: grid;
  gap: 0.5rem;
}

.etat__verrou {
  background: var(--paper-alt);
  border: 1px solid var(--rule-strong);
  border-radius: 0.5rem;
  padding: 0.9rem 1.1rem;
}

.etat__verrou-nom {
  font-family: var(--font-mono);
  font-size: 0.9rem;
  color: var(--ink);
  margin: 0 0 0.3rem !important;
}

.etat__verrou-verdict {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: space-between;
  gap: 0.5rem;
  margin: 0 !important;
}

.etat__etat {
  font-family: var(--font-mono);
  font-size: 0.85rem;
  color: var(--ink);
}

.etat__etat--tenu {
  color: var(--sens-mental);   /* VERT DU CANON (25/09) : un verrou tenu est un etat de sante MESURE. Le cyan disait l'accent ; le vert dit ce que l'etat VEUT DIRE. */
}

.etat__verrou-quand {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--ink-soft);
}

.etat__verrou-motif {
  margin: 0.35rem 0 0 !important;
  font-size: 0.85rem;
  font-style: italic;
  color: var(--ink-soft);
}

/* ── Ce qui tourne ───────────────────────────────────────────────────────── */
.etat__services {
  list-style: none;
  margin: 1.5rem 0;
  padding: 0;
  display: grid;
  gap: 0.85rem;
}

.etat__service {
  background: var(--paper-alt);
  border: 1px solid var(--rule-strong);
  border-radius: 0.5rem;
  padding: 1rem 1.15rem;
  transition: transform var(--transition-fast);
}
.etat__service:hover {
  transform: translateY(-2px);
}

.etat__service-role {
  font-family: var(--font-mono);
  font-size: 0.92rem;
  color: var(--ink);
  margin: 0 0 0.3rem !important;
}

.etat__service-detail {
  margin: 0 !important;
  font-size: 0.95rem;
  line-height: 1.7;
  color: var(--ink-soft);
}

/* ── Le relevé vivant ────────────────────────────────────────────────────── */
.etat__releve {
  border: 1px solid var(--rule-strong);
  border-radius: 0.5rem;
  padding: 1.1rem 1.25rem 1.25rem;
  margin: 1.5rem 0;
}

.etat__releve-tete {
  font-family: var(--font-mono);
  font-size: 0.78rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--accent);
  margin: 0 0 1rem !important;
}

.etat__releve-tete--indisponible {
  color: var(--ink-soft);
}

.etat__releve-vide {
  margin: 0 !important;
  font-size: 0.95rem;
  line-height: 1.7;
  color: var(--ink-soft);
}

.etat__table {
  width: 100%;
  border-collapse: collapse;
  margin: 0 0 1rem;
}

.etat__table-legende {
  caption-side: top;
  text-align: left;
  font-size: 0.82rem;
  color: var(--ink-soft);
  padding-bottom: 0.6rem;
}

.etat__table th,
.etat__table td {
  text-align: left;
  padding: 0.5rem 0.6rem;
  border-bottom: 1px solid var(--rule-strong);
  font-size: 0.95rem;
  color: var(--ink-soft);
}

.etat__table th {
  font-family: var(--font-mono);
  font-size: 0.72rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--ink);
}

.etat__table-nombre {
  text-align: right;
  font-family: var(--font-mono);
  color: var(--accent);
}

.etat__note--dans-releve {
  margin: 0 !important;
  font-size: 0.88rem;
}

/* ── Les limites ─────────────────────────────────────────────────────────── */
.etat__bloc--limites {
  background: var(--paper-alt);
  border-radius: 0.5rem;
  padding: 1.5rem 1.5rem 0.5rem;
}
.etat__bloc--limites .etat__sous-titre {
  border-bottom: none;
  padding-bottom: 0;
}

.etat__liste {
  list-style: none;
  margin: 0;
  padding: 0;
}

.etat__liste li {
  position: relative;
  padding: 0 0 1rem 1.4rem;
  line-height: 1.7;
  color: var(--ink-soft);
}
.etat__liste li::before {
  content: '—';
  position: absolute;
  left: 0;
  color: var(--accent);
}

/* ── Les sorties ─────────────────────────────────────────────────────────── */
.etat__sorties {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1.25rem;
  margin: 0 0 0.5rem !important;
}

.etat__sortie {
  display: inline-block;
  padding: 0.85rem 1.6rem;
  background: var(--accent);
  color: var(--action-ink);
  font-weight: 600;
  text-decoration: none;
  border-radius: 3px;
  transition: background var(--transition-fast);
}
.etat__sortie:hover,
.etat__sortie:focus-visible {
  background: var(--accent-ink);
}

.etat__sortie-secondaire {
  color: var(--ink);
  font-size: 0.95rem;
}
.etat__sortie-secondaire:hover,
.etat__sortie-secondaire:focus-visible {
  color: var(--accent);
}

/* ── Le calme demandé est respecté ───────────────────────────────────────── */
@media (prefers-reduced-motion: reduce) {
  .etat__service,
  .etat__sortie {
    transition: none;
  }
  .etat__service:hover {
    transform: none;
  }
}

@media (max-width: 640px) {
  .etat__service {
    padding: 0.9rem 1rem;
  }
  .etat__bloc--limites {
    padding: 1.25rem 1.25rem 0.25rem;
  }
  .etat__releve {
    padding: 1rem 1rem 1.1rem;
  }
}
</style>
