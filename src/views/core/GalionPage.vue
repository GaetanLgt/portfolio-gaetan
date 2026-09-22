<!--
  GalionPage.vue — LA PAGE DU NAVIRE. Une adresse à elle : `/galion`.

  ⭐ DEMANDE DE GAËTAN, 22/09/2026 : « Tu me migres le modèle 3D du galion sur une page unique
     pour ça, et tu me le références dans la nav. »

  ⛔ CE QUI CHANGE PAR RAPPORT À LA PAGE D'ACCUEIL, ET POURQUOI.
     La home montre le navire **ET** les sept ancres — parce qu'elle sert de plan au site.
     Ici, on montre **LE NAVIRE**, et rien d'autre : c'est une page sur lui.

     ⚠️ **Les sept ancres de `VaisseauNavigable` ne sont PAS affichées ici** (`:ancres="false"`),
     et ce n'est pas un choix esthétique : **leurs coordonnées sont mesurées sur l'ANCIEN modèle**
     (`galion.glb`, boîte 9,5 unités). Le navire affiché ici est le **CONSTRUIT**
     (`galion-arkadia.glb`, 119,5 unités) — soit **~12,6×**. *Des ancres fausses ne sont pas un
     défaut d'affichage : ce sont sept liens qui mentent, et un clic qui ouvre une page sans
     qu'on ait rien visé.* **Les recaler demande une mesure**, pas un facteur deviné.

  ⚠️ ET POUR QUE LA PAGE NE SOIT PAS UN CUL-DE-SAC, les sept compartiments sont listés **en DOM**,
     sous la 3D — la liste ci-dessous ne dépend pas du survol, elle ne peut pas se casser.

  ⛔ LES CONTRAINTES DU DÉPÔT, TENUES ICI COMME AILLEURS :
     · REQUÊTES (`scripts/verifier-requetes.mjs`, seuil 14) → `defineAsyncComponent`, donc le
       chunk 3D n'apparaît NI dans `<script src>` NI dans `modulepreload` de `dist/index.html`.
     · POIDS (`scripts/verifier-poids-3d.mjs`, seuil 1 Mo) → `galion-arkadia.glb` pèse **764 Ko**,
       contre **2 790 Ko** pour l'ancien. *Le navire construit est 3,7× plus léger que la ruine.*
     · CSP (`public/.htaccess`, `script-src 'self'`) → tout est bundlé, aucun appel hors domaine.

  ⚠️ CE QUI N'EST PAS VÉRIFIÉ, ET QUI EST DIT PLUTÔT QUE SOUS-ENTENDU : la manette Xbox est
     câblée dans `VaisseauNavigable` (mapping W3C Gamepad), et **aucune manette physique n'a
     jamais été branchée sur cette machine**. *Ça se branche, et ça se dit.*
-->
<script setup>
import { defineAsyncComponent } from 'vue';

const VaisseauNavigable = defineAsyncComponent(
  () => import('@/components/three/VaisseauNavigable.vue')
);

/**
 * Les sept compartiments du navire — **en DOM**, pour que la page reste navigable
 * même sans les ancres 3D. Noms et routes repris de `VaisseauNavigable.vue` § COMPARTIMENTS,
 * qui les tient lui-même de `MND/90-archive/SITE-VAISSEAU-ARCHITECTURE.md` § 2.
 */
const compartiments = [
  { nom: 'Le pont', lieu: 'la dunette, à l’arrière', quoi: 'L’accueil, le capitaine, la promesse.', route: '/' },
  { nom: 'La soute', lieu: 'le ventre', quoi: 'La carte complète : tout ce qui existe.', route: '/soute' },
  { nom: 'La cale', lieu: 'le jeu, déjà à flot', quoi: 'Le jeu jouable — descendre et jouer.', route: '/le-pont/', externe: true },
  { nom: 'Le gaillard', lieu: 'l’avant', quoi: 'L’offre, les prix, les limites.', route: '/services' },
  { nom: 'La vigie', lieu: 'le nid-de-pie, en haut du grand mât', quoi: 'L’état du studio, mesuré.', route: '/etat-du-studio' },
  { nom: 'Le journal de bord', lieu: 'la table à cartes', quoi: 'Les relevés, les décisions, les échecs.', route: '/dossier' },
  { nom: 'La proue', lieu: 'la figure de proue, qui s’allume', quoi: 'L’œil — le contact.', route: '/contact' },
];

/**
 * Ce que le navire EST, et chaque ligne vient du canon verrouillé — aucune n'est inventée ici.
 * ⚠️ Les dates sont celles des décisions, pas celles de cette page.
 */
const canon = [
  { quoi: 'La figure de proue', dit: 'un kraken à tête de mort — le crâne EST la tête du kraken, les tentacules en naissent, et ses deux yeux sont ses yeux', quand: '22/09/2026' },
  { quoi: 'Le réacteur', dit: 'ORACLE — un organisme vivant qui fait avancer le navire en le mangeant', quand: '22/09/2026' },
  { quoi: 'Le pavillon', dit: 'le A, un triangle et deux serres — le sceau cercle-à-point passe à la hampe', quand: '15/09/2026' },
  { quoi: 'La coque', dit: 'de métal — pas de bois, pas de cordages, pas de voiles', quand: '15/09/2026' },
  { quoi: 'La palette', dit: 'noir · or · argent — l’or est le sacré, et il sert aux deux yeux', quand: '15/09/2026' },
  { quoi: 'Les canons', dit: 'deux rangées de seize par bord, soit soixante-quatre pièces', quand: '22/09/2026' },
];
</script>

<template>
  <main class="galion">
    <header class="galion__entete">
      <p class="galion__sur">Génie IT TeK FR — le navire</p>
      <h1 class="galion__titre">Le galion</h1>
      <p class="galion__chapeau">
        On ne combat pas le Mal : on le joue, en le sachant. Voici le navire —
        <strong>construit par le studio</strong>, pas acheté, pas généré.
        Tournez autour : souris, molette, ou manette.
      </p>
    </header>

    <!--
      ⛔ `:ancres="false"` — voir l'en-tête du fichier. Les sept ancres de compartiments sont
         mesurées sur l'ANCIEN modèle : les afficher ici serait ouvrir sept liens qui mentent.
      ⚠️ `modele` pointe le navire CONSTRUIT : 764 Ko contre 2 790 Ko pour l'ancien.
    -->
    <VaisseauNavigable
      modele="/galion-arkadia.glb"
      :ancres="false"
      hauteur="min(86vh, 900px)"
    />

    <!-- ⭐ La porte de secours : sept liens en DOM, qui ne dépendent d'aucun survol. -->
    <section class="galion__compartiments" aria-labelledby="compartiments-titre">
      <h2 id="compartiments-titre">Les sept compartiments</h2>
      <p class="galion__note">
        Le navire <em>est</em> le plan du site. Chaque compartiment ouvre une page.
      </p>
      <ul class="galion__liste">
        <li v-for="c in compartiments" :key="c.nom" class="galion__item">
          <a
            v-if="c.externe"
            :href="c.route"
            class="galion__lien"
            rel="noopener"
          >
            <span class="galion__nom">{{ c.nom }}</span>
            <span class="galion__lieu">{{ c.lieu }}</span>
            <span class="galion__quoi">{{ c.quoi }}</span>
          </a>
          <router-link v-else :to="c.route" class="galion__lien">
            <span class="galion__nom">{{ c.nom }}</span>
            <span class="galion__lieu">{{ c.lieu }}</span>
            <span class="galion__quoi">{{ c.quoi }}</span>
          </router-link>
        </li>
      </ul>
    </section>

    <section class="galion__canon" aria-labelledby="canon-titre">
      <h2 id="canon-titre">Ce que le navire est — les décisions, et leur date</h2>
      <p class="galion__note">
        Chaque ligne porte la date de la décision qui l’a fixée. Le canon vit dans
        <code>ArkAdiA/DECISIONS-CANON-*.md</code>.
      </p>
      <dl class="galion__faits">
        <template v-for="f in canon" :key="f.quoi">
          <dt>{{ f.quoi }}</dt>
          <dd>{{ f.dit }} <span class="galion__quand">— {{ f.quand }}</span></dd>
        </template>
      </dl>
    </section>

    <footer class="galion__pied">
      <p>
        Le navire est engendré par un générateur —
        <code>gl-os/fond-ecran/construire-galion.py</code> : mêmes paramètres, même navire.
        <strong>331 objets, 15 914 triangles.</strong>
      </p>
    </footer>
  </main>
</template>

<style scoped>
/* Les couleurs sont celles du site — DA D6 du 19/09/2026. ⛔ Aucun vert : il a été retiré. */
.galion {
  max-width: 1180px;
  margin: 0 auto;
  padding: 96px 24px 64px;
  color: var(--ink, #eaf0f7);
}

.galion__entete {
  margin-bottom: 32px;
  border-bottom: 1px solid var(--rule, #131a2f);
  padding-bottom: 20px;
}

.galion__sur {
  font-family: var(--font-mono, monospace);
  font-size: 0.6875rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--accent, #2abfff);
  margin: 0 0 8px;
}

.galion__titre {
  font-family: var(--font-display, Georgia, serif);
  font-weight: 400;
  font-size: clamp(2rem, 6vw, 3.25rem);
  line-height: 1.05;
  letter-spacing: -0.02em;
  margin: 0 0 12px;
}

.galion__chapeau {
  max-width: 62ch;
  color: var(--ink-soft, #a9b8cc);
  font-size: 1rem;
  line-height: 1.7;
  margin: 0;
}

.galion__chapeau strong { color: var(--ink, #eaf0f7); }

.galion__compartiments,
.galion__canon {
  margin-top: 56px;
  padding-top: 24px;
  border-top: 1px solid var(--rule, #131a2f);
}

.galion__compartiments h2,
.galion__canon h2 {
  font-family: var(--font-display, Georgia, serif);
  font-weight: 400;
  font-size: 1.5rem;
  letter-spacing: -0.015em;
  margin: 0 0 6px;
}

.galion__note {
  color: var(--ink-faint, #8496ad);
  font-size: 0.875rem;
  max-width: 72ch;
  margin: 0 0 20px;
}

.galion__liste {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 1px;
  background: var(--rule, #131a2f);
  border: 1px solid var(--rule, #131a2f);
  border-radius: 4px;
  overflow: hidden;
}

.galion__lien {
  display: flex;
  flex-direction: column;
  gap: 4px;
  height: 100%;
  padding: 16px 18px;
  background: var(--paper-alt, #0d111f);
  text-decoration: none;
  color: inherit;
  transition: background 150ms ease;
}

.galion__lien:hover { background: #12172a; }
.galion__lien:focus-visible { outline: 2px solid var(--accent, #2abfff); outline-offset: -2px; }

.galion__nom {
  font-size: 1rem;
  color: var(--ink, #eaf0f7);
}

.galion__lieu {
  font-family: var(--font-mono, monospace);
  font-size: 0.6875rem;
  letter-spacing: 0.06em;
  color: var(--accent, #2abfff);
}

.galion__quoi {
  font-size: 0.875rem;
  color: var(--ink-soft, #a9b8cc);
}

.galion__faits {
  display: grid;
  grid-template-columns: 180px minmax(0, 1fr);
  gap: 8px 20px;
  margin: 0;
}

.galion__faits dt {
  font-family: var(--font-mono, monospace);
  font-size: 0.6875rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--ink-faint, #8496ad);
  padding-top: 3px;
}

.galion__faits dd {
  margin: 0;
  font-size: 0.9375rem;
  color: var(--ink-soft, #a9b8cc);
  line-height: 1.6;
}

.galion__quand {
  font-family: var(--font-mono, monospace);
  font-size: 0.75rem;
  color: var(--ink-faint, #8496ad);
  white-space: nowrap;
}

.galion__pied {
  margin-top: 56px;
  padding-top: 20px;
  border-top: 1px solid var(--rule, #131a2f);
  font-size: 0.875rem;
  color: var(--ink-faint, #8496ad);
  max-width: 72ch;
}

.galion code {
  font-family: var(--font-mono, monospace);
  font-size: 0.8125rem;
  color: var(--accent-ink, #7ad6ff);
}

@media (max-width: 720px) {
  .galion { padding: 80px 18px 48px; }
  .galion__faits { grid-template-columns: minmax(0, 1fr); gap: 2px 0; }
  .galion__faits dd { margin-bottom: 12px; }
}

@media (prefers-reduced-motion: reduce) {
  .galion__lien { transition: none; }
}
</style>
