<script setup>
/**
 * GuidePage.vue — les dix pages du test éditorial instrumenté.
 *
 * ⭐ POURQUOI UN SEUL COMPOSANT POUR DIX PAGES : les dix réponses partagent la même
 *    forme — un intertitre qui EST la question, un bloc de 40 à 90 mots autonome,
 *    puis le développement. *Dix copies de la même mise en page divergeraient à la
 *    première correction.* **Le contenu vit dans `src/data/guides.js`, la forme ici.**
 *
 * ⛔ ET LE BLOC EST RENDU **EN PREMIER**, PAS APRÈS UNE INTRODUCTION. C'est la règle
 *    que la page du 24/09 énonce et que le canon appelait déjà « le premier
 *    passage » : *une réponse qui tient seule, compréhensible hors contexte, parce
 *    qu'un moteur ou un lecteur peut n'en lire que le début.*
 */
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { GUIDES } from '../../data/guides.js'

const route = useRoute()
const guide = computed(() => GUIDES.find((g) => g.slug === route.meta.guideSlug) || null)

// ⚠️ Une route sans données n'est pas une page vide : c'est une erreur de câblage.
//    On le dit, plutôt que de rendre un blanc qui passerait pour un bug d'affichage.
if (!guide.value && typeof window !== 'undefined') {
  console.error(`[guides] aucun guide pour le slug « ${route.meta.guideSlug} »`)
}
</script>

<template>
  <article v-if="guide" class="guide">
    <header class="guide-tete">
      <p class="guide-rubrique">Réponse directe</p>
      <h1>{{ guide.question }}</h1>
    </header>

    <p class="guide-bloc">{{ guide.bloc }}</p>

    <section v-for="(s, i) in guide.sections" :key="i" class="guide-section">
      <h2>{{ s.titre }}</h2>
      <p>{{ s.texte }}</p>
    </section>

    <footer class="guide-pied">
      <p>
        Ce que vous venez de lire est une réponse courte et datée.
        Le <a href="/dossier">dossier professionnel</a> porte les prix publics hors taxes,
        les délais et la méthode — <em>et ce qu'elle ne garantit pas.</em>
      </p>
      <p class="guide-cta">
        <a class="guide-btn" href="/contact">Décrire votre cas</a>
        <a class="guide-btn ghost" href="/services">Voir les prestations</a>
      </p>
    </footer>
  </article>
</template>

<style scoped>
/* ⚠️ On réutilise les variables du site (DA D6 du 19/09) : --paper, --ink, --accent,
   --action. En dur, ces valeurs divergeraient de la charte à la première retouche. */
.guide { max-width: 46rem; margin: 0 auto; padding: clamp(96px, 12vh, 160px) clamp(16px, 6vw, 48px) 96px; }
.guide-rubrique { font: 500 11px/1 var(--f-mono, monospace); letter-spacing: .22em; text-transform: uppercase; color: var(--accent, #2abfff); margin: 0 0 14px; }
.guide h1 { font-size: clamp(1.7rem, 4vw, 2.9rem); line-height: 1.15; margin: 0 0 28px; color: var(--ink, #e2e9f0); text-wrap: balance; }
.guide-bloc {
  font-size: clamp(1.05rem, 1.6vw, 1.22rem);
  line-height: 1.65;
  color: var(--ink, #e2e9f0);
  border-left: 2px solid var(--accent, #2abfff);
  padding-left: 20px;
  margin: 0 0 48px;
}
.guide-section { margin-bottom: 32px; }
.guide-section h2 { font-size: clamp(1.05rem, 2vw, 1.3rem); margin: 0 0 10px; color: var(--ink, #e2e9f0); }
.guide-section p { margin: 0; color: var(--ink-soft, #93a3b3); line-height: 1.7; }
.guide-pied { margin-top: 56px; padding-top: 28px; border-top: 1px solid var(--line, rgba(42,191,255,.24)); }
.guide-pied p { color: var(--ink-soft, #93a3b3); line-height: 1.7; }
.guide-pied a { color: var(--accent, #2abfff); }
.guide-cta { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 24px; }
.guide-btn { display: inline-block; padding: 13px 20px; background: var(--action, #ffe650); color: #14120a; text-decoration: none; font-weight: 600; }
.guide-btn.ghost { background: transparent; color: var(--ink, #e2e9f0); border: 1px solid var(--line, rgba(42,191,255,.24)); }
</style>
