<template>
  <!--
    ⚠️ `<main>` REMPLACÉ PAR `<div>` LE 13/09/2026.

    `App.vue` pose déjà `<main id="main-content" role="main">` autour de TOUT le contenu rendu.
    Cette page en ajoutait un second, à l'intérieur du premier : deux repères `main`, dont un
    **imbriqué**. D'où deux constats d'accessibilité sur cette seule page —
    `landmark-main-is-top-level` et `landmark-no-duplicate-main`.

    Un document n'a qu'un seul contenu principal. La classe est conservée : elle porte la mise
    en page, pas la sémantique.
  -->
  <div class="soute">
    <div class="soute__enveloppe">

      <!-- ── Le retour, en haut ET en bas ──────────────────────────────────────
           Règle du cadrage : ce n'est pas un piège. On doit pouvoir repartir
           immédiatement, sans chercher. Un cul-de-sac serait l'inverse du projet. -->
      <RouterLink to="/" class="soute__retour">← Revenir sur le pont</RouterLink>

      <header class="soute__tete">
        <p class="soute__sur-titre">Compartiment bas · sous la ligne de flottaison</p>
        <h1 class="soute__titre">La soute</h1>
        <p class="soute__chapeau">
          Vous êtes descendu. Que ce soit par le tuyau vert ou par le plan complet, le
          résultat est le même : <strong>vous êtes dans la seule zone du navire qui
          contient la carte entière</strong>.
        </p>
      </header>

      <section class="soute__bloc">
        <h2 class="soute__sous-titre">Ce qu'il y a ici, et pourquoi</h2>
        <p>
          Le navire a <strong>{{ ZONES.length }} compartiments</strong>. Cinq sont indiqués
          dans la barre de navigation. Les autres existent depuis longtemps, avec de vraies
          adresses, et personne ne les avait jamais rassemblés au même endroit.
        </p>
        <p>
          Cette page ne cache rien et ne débloque rien : <strong>tout ce qui est listé
          ci-dessous est atteignable à tout moment</strong>, y compris sans jamais avoir vu
          le tuyau. C'est une carte, pas une récompense exclusive — une carte qu'on tend à
          ceux qui sont venus voir.
        </p>
      </section>

      <!-- ── LA CARTE COMPLÈTE — des liens ordinaires, donc lisibles par une
           machine comme par un lecteur d'écran. C'est ce qui rend cette couche
           d'exploration compatible avec le verrou SEO et le verrou d'accessibilité. -->
      <section
        v-for="pont in ponts"
        :key="pont.cle"
        class="soute__bloc"
      >
        <h2 class="soute__sous-titre">{{ pont.titre }}</h2>
        <p class="soute__note">{{ pont.note }}</p>
        <ul class="soute__zones">
          <li v-for="zone in pont.zones" :key="zone.id" class="soute__zone">
            <!--
              ⚠️ UNE BALISE `<a>` ORDINAIRE, ET NON UN `<RouterLink>` — DEPUIS LE 19/09/2026.
              Toutes les zones sauf une sont des routes du site, et vue-router intercepte le
              clic sur un lien interne : `<RouterLink>` n'apportait donc rien qu'une contrainte.
              Il en coûtait une, en revanche : le dossier pédagogique publié sous
              `/TARDIS/JoF/` est du HTML STATIQUE, hors routeur — avec un `<RouterLink>`, ce
              lien aurait mené nulle part.

              Et c'est le défaut que cette ligne corrige : les 22 pages de ce dossier étaient
              en ligne, avec de vraies adresses, et AUCUNE page du site ne les liait. Un robot
              pouvait les trouver ; un visiteur, non. Le lien vient maintenant du manifeste
              (`src/config/topographie.js`), comme le reste de cette carte : une source, pas
              une adresse recopiée ici.
            -->
            <a :href="zone.chemin" class="soute__lien">
              <span class="soute__zone-nom">{{ zone.nom }}</span>
              <span class="soute__zone-chemin">{{ zone.chemin }}</span>
            </a>
            <span v-if="aTrouve(zone.id)" class="soute__vu" title="Vous êtes déjà passé par là">vu</span>
          </li>
        </ul>
      </section>

      <!-- ══ LA PORTE DU KIT PÉDAGOGIQUE ══════════════════════════════════════
           Ce bloc n'est pas un compartiment de plus : c'est une PORTE. Le dossier
           pédagogique est un dossier entier, publié sous une adresse qui n'appartient pas
           au routeur (`/TARDIS/JoF/`), et dont les 22 pages se renvoient entre elles.
           La carte ci-dessus n'en montre donc que la porte d'entrée — le reste est dedans.

           ⚠️ ON LE DIT ICI PLUTÔT QUE DE LE LAISSER DEVINER : ce dossier est publié
           `noindex` (décision du dirigeant, 13/09/2026). Le lien le rend ATTEIGNABLE par
           un visiteur ; il ne le rend pas INDEXABLE par un moteur. Les deux choses sont
           différentes, et confondre les deux ferait passer un dossier destiné à une école
           pour une porte d'entrée commerciale. -->
      <section class="soute__bloc" aria-labelledby="titre-porte-dossiers">
        <h2 id="titre-porte-dossiers" class="soute__sous-titre">Une porte qui n'était reliée à rien</h2>
        <p>
          Sous ce pont se trouve un dossier entier : <strong>22 pages de travail scolaire</strong>,
          du CP à la 3<sup>e</sup>, écrites par le studio. Elles étaient en ligne depuis le
          14 septembre 2026, à une adresse réelle — et <strong>aucune page du site ne les
          liait</strong>. Un moteur pouvait tomber dessus ; vous, non.
        </p>
        <p>{{ porte.pourquoi }}</p>
        <a :href="porte.chemin" class="soute__lien soute__lien--porte">
          <span class="soute__zone-nom">{{ porte.libelle }}</span>
          <span class="soute__zone-chemin">{{ porte.chemin }}</span>
        </a>
      </section>

      <section class="soute__bloc">
        <h2 class="soute__sous-titre">Ce que cette page ne fait pas</h2>
        <ul class="soute__liste">
          <li>
            <strong>Elle ne compte pas vos découvertes.</strong> Il n'y a nulle part un
            « 6 zones sur 14 ». Le petit repère « vu » existe, l'addition n'existe pas.
          </li>
          <li>
            <strong>Elle ne vous suit pas.</strong> Votre progression tient dans le
            <code>localStorage</code> de votre navigateur — sur votre machine. Rien n'est
            envoyé, ni à nous, ni à personne : il n'y a pas de serveur derrière ceci.
          </li>
          <li>
            <strong>Elle ne verrouille rien.</strong> Aucune page du site n'exige d'avoir
            trouvé quoi que ce soit pour s'ouvrir.
          </li>
        </ul>
      </section>

      <section class="soute__bloc soute__bloc--verrous">
        <h2 class="soute__sous-titre">Les verrous du studio</h2>
        <p>
          Le studio s'impose des seuils mesurés, et les publie parce qu'ils engagent. Ce sont
          des <strong>seuils</strong>, pas des scores du jour : un chiffre mesuré une fois
          vieillit, un seuil tient.
        </p>
        <dl class="soute__verrous">
          <div class="soute__verrou">
            <dt>Poids d'une page</dt>
            <dd>moins de 1 Mo, mesuré page par page</dd>
          </div>
          <div class="soute__verrou">
            <dt>Performance</dt>
            <dd>Lighthouse ≥ 95</dd>
          </div>
          <div class="soute__verrou">
            <dt>Accessibilité</dt>
            <dd>axe-core : 0 violation</dd>
          </div>
          <div class="soute__verrou">
            <dt>Sémantique</dt>
            <dd>0 bloquant — la structure porte le sens</dd>
          </div>
          <div class="soute__verrou">
            <dt>Requêtes au 1<sup>er</sup> chargement</dt>
            <dd>14 au maximum — contrainte de l'hébergeur</dd>
          </div>
        </dl>
      </section>

      <RouterLink to="/contact" class="soute__sortie">
        Remonter et parler à quelqu'un →
      </RouterLink>

      <RouterLink to="/" class="soute__retour">← Revenir sur le pont</RouterLink>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { RouterLink } from 'vue-router';
import { ZONES, aTrouve } from '@/composables/useDecouvertes.js';
// La porte du kit pédagogique : une adresse, sa raison, et le fait qu'elle n'est pas
// indexable. Elle vient du manifeste — voir le commentaire long plus bas.
import { PORTE_DOSSIERS } from '@/config/topographie.js';

/**
 * LA SOUTE — la zone optionnelle du cadrage « site comme un métroidvania » (13/09/2026).
 * Voir `veille-video/fiches/metroid-goyo-2026-09-13.md` et
 * `modeles/CADRAGE-site-metroidvania-2026-09-13.md` pour le raisonnement complet.
 *
 * Les compartiments viennent de `useDecouvertes.js` : une seule source de vérité pour la
 * topographie. Si une route est ajoutée au site sans être ajoutée là-bas, cette carte
 * deviendra fausse — c'est le défaut à surveiller.
 */

/**
 * LA PORTE DU KIT PÉDAGOGIQUE — la seule adresse de cette page qui ne soit PAS une route.
 *
 * ⛔ ELLE VIENT DU MANIFESTE, ELLE N'EST PAS RECOPIÉE ICI. `src/config/topographie.js`
 * l'exporte sous le nom `PORTE_DOSSIERS`, avec la raison de son existence et le fait
 * qu'elle n'est PAS indexable. Une adresse écrite à deux endroits finit par diverger :
 * c'est exactement le défaut que ce dépôt a corrigé quatre fois en septembre.
 *
 * ⚠️ POURQUOI CE N'EST PAS UN COMPARTIMENT DE LA CARTE CI-DESSOUS, ET POURQUOI CE N'EST
 * PAS UN OUBLI. Le premier jet avait ajouté le kit à `TOPOGRAPHIE` avec un compartiment ;
 * `node scripts/verifier-topographie.mjs` a répondu « compartiments de la CARTE qui ne
 * correspondent à aucune page ». Il avait raison : un compartiment est une route du
 * routeur, et ce dossier est du HTML statique publié hors routeur. La porte est donc
 * déclarée à part — et le contrôle de topographie, lui, continue de dire que les 22 pages
 * du kit restent « atteignables par aucun chemin balisé » au sens des quatre listes.
 * **C'est un fait, et on l'écrit plutôt que de le maquiller en zone du navire.**
 */
const porte = PORTE_DOSSIERS;

const ponts = computed(() => [
  {
    cle: 'superieur',
    titre: 'Le pont supérieur',
    note: 'Les cinq compartiments indiqués dans la barre de navigation.',
    zones: ZONES.filter((z) => z.pont === 'superieur'),
  },
  {
    cle: 'inferieur',
    titre: 'Le pont inférieur',
    note: 'Des compartiments qui existent depuis longtemps, avec de vraies adresses, et que rien n\'annonçait.',
    zones: ZONES.filter((z) => z.pont === 'inferieur'),
  },
  {
    cle: 'soute',
    titre: 'Sous la ligne de flottaison',
    note: 'Vous y êtes.',
    zones: ZONES.filter((z) => z.pont === 'soute'),
  },
]);
</script>

<style scoped>
.soute {
  min-height: 100vh;
  background: #080b14;
  color: #e8f0ec;
  padding: 4rem 1.25rem 6rem;
}

.soute__enveloppe {
  max-width: 46rem;
  margin: 0 auto;
}

.soute__retour {
  display: inline-block;
  margin: 2.5rem 0 0;
  color: #10b981;
  text-decoration: none;
  font-family: 'JetBrains Mono', ui-monospace, monospace;
  font-size: 0.8rem;
  letter-spacing: 0.04em;
}
.soute__retour:hover,
.soute__retour:focus-visible {
  text-decoration: underline;
}

.soute__tete {
  margin: 2.5rem 0 3.5rem;
}

.soute__sur-titre {
  font-family: 'JetBrains Mono', ui-monospace, monospace;
  font-size: 0.72rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: #10b981;
  margin: 0 0 1rem;
}

.soute__titre {
  font-size: clamp(2.2rem, 6vw, 3.4rem);
  line-height: 1.05;
  margin: 0 0 1.25rem;
  font-weight: 500;
}

.soute__chapeau {
  font-size: 1.05rem;
  line-height: 1.7;
  color: #b9c9c2;
  margin: 0;
  max-width: 38rem;
}

.soute__bloc {
  margin: 0 0 3rem;
}

.soute__sous-titre {
  font-size: 1.1rem;
  font-weight: 500;
  margin: 0 0 0.9rem;
  padding-bottom: 0.6rem;
  border-bottom: 1px solid rgba(16, 185, 129, 0.22);
}

.soute__bloc p {
  line-height: 1.75;
  color: #b9c9c2;
  margin: 0 0 1rem;
}

.soute__bloc strong {
  color: #e8f0ec;
}

.soute__note {
  font-size: 0.9rem;
  color: #8fa39c;
  margin-bottom: 1.25rem !important;
}

.soute__zones,
.soute__liste {
  list-style: none;
  margin: 0;
  padding: 0;
}

.soute__zone {
  display: flex;
  align-items: baseline;
  gap: 0.75rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.soute__lien {
  flex: 1;
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.7rem 0.25rem;
  color: #e8f0ec;
  text-decoration: none;
}
.soute__lien:hover,
.soute__lien:focus-visible {
  color: #10b981;
}
.soute__lien:focus-visible {
  outline: 2px solid #10b981;
  outline-offset: 2px;
}

.soute__zone-nom {
  font-size: 0.95rem;
}

/* ── LA PORTE DU KIT PÉDAGOGIQUE (19/09/2026) ─────────────────────────────────
   C'est le SEUL lien de cette page qui mène hors du routeur : il doit se voir comme une
   porte, pas comme une ligne de plus dans la liste des compartiments. On le sort donc de
   la grille par un cadre plein et un peu d'air — sans changer la palette ni la typo de
   la page, qui a la sienne.

   ⚠️ Cette page garde sa palette d'origine (`#10b981` / `#b9c9c2`), et ce n'est pas un
   oubli : `/soute` a été écrite avant la bascule vers la charte courante, et sa migration
   est un chantier à part, qui ne se fait pas au détour d'un ajout de lien. Introduire ici
   les jetons actuels mélangerait deux DA sur une même page — ce qui serait un défaut
   visible, à l'endroit exact où l'on corrige un défaut invisible. */
.soute__lien--porte {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 1rem;
  margin: 1.5rem 0 0;
  padding: 0.85rem 1rem;
  border: 1px solid rgba(16, 185, 129, 0.4);
  border-radius: 3px;
  color: #e8f0ec;
  text-decoration: none;
}
.soute__lien--porte:hover,
.soute__lien--porte:focus-visible {
  background: rgba(16, 185, 129, 0.08);
  color: #10b981;
}
.soute__lien--porte:focus-visible {
  outline: 2px solid #10b981;
  outline-offset: 2px;
}
.soute__lien--porte .soute__zone-nom {
  font-weight: 600;
}

.soute__zone-chemin {
  font-family: 'JetBrains Mono', ui-monospace, monospace;
  font-size: 0.75rem;
  color: #8fa39c;
  white-space: nowrap;
}

.soute__vu {
  font-family: 'JetBrains Mono', ui-monospace, monospace;
  font-size: 0.65rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #10b981;
  border: 1px solid rgba(16, 185, 129, 0.4);
  border-radius: 2px;
  padding: 0.1rem 0.3rem;
}

.soute__liste li {
  position: relative;
  padding: 0 0 1rem 1.4rem;
  line-height: 1.7;
  color: #b9c9c2;
}
.soute__liste li::before {
  content: '—';
  position: absolute;
  left: 0;
  color: #10b981;
}

.soute__liste code {
  font-family: 'JetBrains Mono', ui-monospace, monospace;
  font-size: 0.85em;
  color: #e8f0ec;
  background: rgba(255, 255, 255, 0.06);
  padding: 0.1rem 0.3rem;
  border-radius: 2px;
}

.soute__verrous {
  margin: 0;
  display: grid;
  gap: 0.5rem;
}

.soute__verrou {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem 1rem;
  justify-content: space-between;
  padding: 0.6rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.soute__verrou dt {
  font-size: 0.9rem;
  color: #e8f0ec;
}

.soute__verrou dd {
  margin: 0;
  font-family: 'JetBrains Mono', ui-monospace, monospace;
  font-size: 0.78rem;
  color: #10b981;
}

.soute__sortie {
  display: inline-block;
  margin-top: 1rem;
  padding: 0.85rem 1.6rem;
  background: #10b981;
  color: #080b14;
  font-weight: 600;
  text-decoration: none;
  border-radius: 3px;
}
.soute__sortie:hover,
.soute__sortie:focus-visible {
  background: #34d399;
}
</style>
