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
            <RouterLink :to="zone.chemin" class="soute__lien">
              <span class="soute__zone-nom">{{ zone.nom }}</span>
              <span class="soute__zone-chemin">{{ zone.chemin }}</span>
            </RouterLink>
            <span v-if="aTrouve(zone.id)" class="soute__vu" title="Vous êtes déjà passé par là">vu</span>
          </li>
        </ul>
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

/**
 * LA SOUTE — la zone optionnelle du cadrage « site comme un métroidvania » (13/09/2026).
 * Voir `veille-video/fiches/metroid-goyo-2026-09-13.md` et
 * `modeles/CADRAGE-site-metroidvania-2026-09-13.md` pour le raisonnement complet.
 *
 * Les compartiments viennent de `useDecouvertes.js` : une seule source de vérité pour la
 * topographie. Si une route est ajoutée au site sans être ajoutée là-bas, cette carte
 * deviendra fausse — c'est le défaut à surveiller.
 */
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
