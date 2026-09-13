<template>
  <div class="carte">
    <!-- ── Le bouton ────────────────────────────────────────────────────────────
         Un vrai <button>, pas un <div> cliquable : il annonce son état (`aria-expanded`)
         et se pilote au clavier. Le panneau est désigné par `aria-controls`. -->
    <button
      type="button"
      class="carte__bouton"
      :aria-expanded="ouverte ? 'true' : 'false'"
      aria-controls="carte-du-navire"
      @click="ouverte = !ouverte"
    >
      <span class="carte__bouton-texte">{{ ouverte ? 'Fermer' : 'Carte' }}</span>
      <span class="carte__bouton-repere" aria-hidden="true">
        {{ nbTrouvees }}<span class="carte__bouton-total">/{{ ZONES.length }}</span>
      </span>
    </button>

    <transition name="carte">
      <nav
        v-if="ouverte"
        id="carte-du-navire"
        ref="panneau"
        class="carte__panneau"
        aria-label="Carte du navire — tous les compartiments du site"
        @keydown.esc="ouverte = false"
      >
        <header class="carte__tete">
          <p class="carte__titre">Le navire</p>
          <p class="carte__legende">
            Ce que vous avez déjà vu s'allume. Le reste a toujours été là — rien n'est
            verrouillé, et cette liste ne quitte pas votre navigateur.
          </p>
        </header>

        <section v-for="pont in ponts" :key="pont.cle" class="carte__pont">
          <p class="carte__pont-nom">{{ pont.titre }}</p>
          <ul class="carte__liste">
            <li v-for="zone in pont.zones" :key="zone.id">
              <RouterLink
                :to="zone.chemin"
                class="carte__zone"
                :class="{ 'carte__zone--vue': aTrouve(zone.id) }"
                @click="ouverte = false"
              >
                <span class="carte__marque" aria-hidden="true">{{ aTrouve(zone.id) ? '●' : '○' }}</span>
                <span class="carte__nom">{{ zone.nom }}</span>
                <span class="carte__etat">{{ aTrouve(zone.id) ? 'vu' : '' }}</span>
              </RouterLink>
            </li>
          </ul>
        </section>

        <p class="carte__pied">
          La carte entière est aussi sur
          <RouterLink to="/soute" class="carte__lien-soute" @click="ouverte = false">la soute</RouterLink>.
        </p>
      </nav>
    </transition>
  </div>
</template>

<script setup>
/**
 * CARTE DU NAVIRE — la couche d'exploration du cadrage B (13/09/2026, décision Gaëtan).
 *
 * CE QU'ELLE FAIT, ET RIEN DE PLUS : elle rend VISIBLE une topographie qui existait déjà
 * sans être montrée. Le site n'annonce que cinq zones dans sa navigation ; treize autres
 * ont de vraies adresses. La carte les rassemble, et marque celles qu'on a déjà traversées.
 *
 * CE QU'ELLE N'EST PAS
 *   · pas un verrou — aucun lien n'est caché, tout est cliquable dès la première visite ;
 *   · pas une note — aucun « 6 sur 14 » n'est mis en avant comme un score. Le compteur du
 *     bouton sert à savoir où on en est, pas à féliciter ;
 *   · pas un effet — donc le MODE SOBRE ne la coupe pas. `mode-sobre.js` l'écrit :
 *     « le mode sobre ne touche jamais au contenu, aux prix, aux liens, ni aux repères
 *     d'accessibilité. Il coupe des effets, rien d'autre. » Une carte est de la navigation.
 *
 * CHARGEMENT : ce composant est importé à la demande par l'accueil (voir HomePage.vue), et
 * monté au premier GESTE du visiteur plutôt qu'au premier moment d'inactivité. La leçon est
 * du même jour : `requestIdleCallback` se déclenche PENDANT la fenêtre que Lighthouse mesure,
 * donc un composant « paresseux » monté trop tôt est payé plein tarif.
 */
import { ref, computed, onMounted, watch, nextTick } from 'vue';
import { RouterLink, useRoute } from 'vue-router';
import { ZONES, aTrouve, marquerTrouvee, nbTrouvees } from '@/composables/useDecouvertes.js';

const ouverte = ref(false);
const route = useRoute();

/** La zone correspondant à une adresse, si elle est connue de la carte. */
function zoneDeChemin(chemin) {
  // Les adresses enfants (`/apps/agent/wa`) rattachent à leur zone parente (`/apps`).
  // On prend la correspondance la PLUS LONGUE pour que `/apps/agent/wa` ne soit pas
  // compté comme `/` au passage.
  return ZONES
    .filter((z) => chemin === z.chemin || (z.chemin !== '/' && chemin.startsWith(z.chemin + '/')))
    .sort((a, b) => b.chemin.length - a.chemin.length)[0];
}

/** On marque la zone à l'arrivée, y compris à la première visite de la page. */
function marquerCourante() {
  const z = zoneDeChemin(route.path);
  if (z) marquerTrouvee(z.id);
}

onMounted(marquerCourante);
watch(() => route.path, marquerCourante);

const ponts = computed(() => [
  { cle: 'superieur', titre: 'Pont supérieur', zones: ZONES.filter((z) => z.pont === 'superieur') },
  { cle: 'inferieur', titre: 'Pont inférieur', zones: ZONES.filter((z) => z.pont === 'inferieur') },
  { cle: 'soute', titre: 'Sous la flottaison', zones: ZONES.filter((z) => z.pont === 'soute') },
]);

// Le focus part dans le panneau à l'ouverture : on doit pouvoir le parcourir au clavier
// sans avoir à deviner qu'il s'est ouvert quelque part à l'écran.
const panneau = ref(null);
watch(ouverte, async (v) => {
  if (!v) return;
  await nextTick();
  const premier = panneau.value?.querySelector('a');
  premier?.focus();
});
</script>

<style scoped>
.carte {
  position: fixed;
  right: 1rem;
  /* On dégage la barre d'état du bas : un bouton posé dessus serait invisible. */
  bottom: 3.25rem;
  z-index: 40;
  font-family: 'JetBrains Mono', ui-monospace, monospace;
}

/* ── Le bouton ─────────────────────────────────────────────────────────────── */
.carte__bouton {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.5rem 0.85rem;
  background: rgba(3, 6, 10, 0.92);
  color: #10b981;
  border: 1px solid rgba(16, 185, 129, 0.45);
  border-radius: 3px;
  font-family: inherit;
  font-size: 0.72rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  cursor: pointer;
  backdrop-filter: blur(4px);
}
.carte__bouton:hover {
  border-color: #10b981;
}
.carte__bouton:focus-visible {
  outline: 2px solid #10b981;
  outline-offset: 2px;
}

.carte__bouton-repere {
  color: #e8f0ec;
}
.carte__bouton-total {
  color: #8fa39c;
}

/* ── Le panneau ────────────────────────────────────────────────────────────── */
.carte__panneau {
  position: absolute;
  right: 0;
  bottom: calc(100% + 0.6rem);
  width: min(22rem, calc(100vw - 2rem));
  max-height: min(70vh, 34rem);
  overflow-y: auto;
  padding: 1rem 1.1rem 1.1rem;
  background: rgba(3, 6, 10, 0.97);
  border: 1px solid rgba(16, 185, 129, 0.3);
  border-radius: 4px;
  backdrop-filter: blur(6px);
}

.carte__tete {
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.carte__titre {
  margin: 0 0 0.4rem;
  font-size: 0.75rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #10b981;
}

.carte__legende {
  margin: 0;
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 0.78rem;
  line-height: 1.55;
  color: #8fa39c;
}

.carte__pont {
  margin-bottom: 0.9rem;
}

.carte__pont-nom {
  margin: 0 0 0.35rem;
  font-size: 0.62rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #8fa39c;
}

.carte__liste {
  list-style: none;
  margin: 0;
  padding: 0;
}

.carte__zone {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.32rem 0.3rem;
  color: #b9c9c2;
  text-decoration: none;
  border-radius: 2px;
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 0.82rem;
}
.carte__zone:hover {
  background: rgba(16, 185, 129, 0.1);
  color: #e8f0ec;
}
.carte__zone:focus-visible {
  outline: 2px solid #10b981;
  outline-offset: 1px;
}

.carte__zone--vue {
  color: #e8f0ec;
}

.carte__marque {
  /* ⚠️ CORRIGÉ LE 13/09/2026 : ce marqueur était en `#4a5c56`, soit 2,3:1 sur le fond
     de la charte — très en dessous des 4,5:1 exigés pour du texte courant. Le cercle
     `○` est un CARACTÈRE, donc du texte : la mesure l'a compté, et elle a fait tomber
     l'accessibilité de 100 à 97. On ne descend pas un seuil, on remonte la couleur. */
  color: #8fa39c;
  font-size: 0.6rem;
}
.carte__zone--vue .carte__marque {
  color: #10b981;
}

.carte__nom {
  flex: 1;
}

.carte__etat {
  font-family: 'JetBrains Mono', ui-monospace, monospace;
  font-size: 0.58rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #10b981;
}

.carte__pied {
  margin: 0.75rem 0 0;
  padding-top: 0.7rem;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 0.74rem;
  color: #8fa39c;
}

.carte__lien-soute {
  color: #10b981;
}

/* ── Mouvement ─────────────────────────────────────────────────────────────── */
/* ⚠️ `prefers-reduced-motion` gagne toujours sur ce réglage — la règle du studio. Ici
   l'animation est purement cosmétique : on l'enlève sans rien retirer de la fonction. */
.carte-enter-active,
.carte-leave-active {
  transition: opacity 0.14s ease, transform 0.14s ease;
}
.carte-enter-from,
.carte-leave-to {
  opacity: 0;
  transform: translateY(6px);
}

@media (prefers-reduced-motion: reduce) {
  .carte-enter-active,
  .carte-leave-active {
    transition: none;
  }
  .carte-enter-from,
  .carte-leave-to {
    transform: none;
  }
}
</style>
