<script setup>
/**
 * GuidesIndex.vue — la porte d'entrée des dix réponses.
 *
 * ⭐ POURQUOI CETTE PAGE EXISTE, ET POURQUOI ELLE EST LE POINT DE MAILLAGE.
 *
 * Le protocole du test éditorial dit : « liées depuis le site ». Mais un lien depuis
 * la seule page parente est faible — *le studio a mesuré que **douze pages du site
 * n'ont qu'un seul lien entrant**, et ce sont justement les moins explorées.*
 *
 * ⇒ **Une page d'index, accrochée au pied de page.** Elle reçoit les liens des
 *   trente-deux pages du site, et elle en donne un à chacune des dix réponses.
 *   *Un relais vaut mieux que dix fils tendus séparément — et il se répare une fois.*
 *
 * ⛔ ET ELLE EST ENGENDRÉE PAR LES DONNÉES, comme les routes : `GUIDES` est la seule
 *    liste. Ajouter une réponse la fait apparaître ici sans toucher à ce fichier.
 */
import { GUIDES } from '../../data/guides.js'
</script>

<template>
  <section class="guides-index">
    <header>
      <p class="rubrique">Réponses directes</p>
      <h1>Dix questions, dix réponses courtes</h1>
      <p class="chapeau">
        Chacune tient en quarante à quatre-vingt-dix mots, et se comprend seule.
        Le développement suit, avec ce qui est compris, ce qui ne l'est pas, et ce que ça coûte.
        <em>Tous les prix sont publics et hors taxes.</em>
      </p>
    </header>

    <ul class="liste">
      <li v-for="g in GUIDES" :key="g.slug">
        <router-link :to="`/guides/${g.slug}`">
          <span class="question">{{ g.question }}</span>
          <span class="resume">{{ g.bloc.slice(0, 150) }}…</span>
        </router-link>
      </li>
    </ul>

    <footer class="pied">
      <p>
        Une question qui n'est pas là ? <router-link to="/contact">Posez-la</router-link> —
        <em>réponse sous 24 heures.</em>
      </p>
    </footer>
  </section>
</template>

<style scoped>
.guides-index { max-width: 52rem; margin: 0 auto; padding: clamp(96px, 12vh, 160px) clamp(16px, 6vw, 48px) 96px; }
.rubrique { font: 500 11px/1 var(--f-mono, monospace); letter-spacing: .22em; text-transform: uppercase; color: var(--accent, #2abfff); margin: 0 0 14px; }
.guides-index h1 { font-size: clamp(1.7rem, 4vw, 2.8rem); line-height: 1.15; margin: 0 0 20px; color: var(--ink, #e2e9f0); text-wrap: balance; }
.chapeau { color: var(--ink-soft, #93a3b3); line-height: 1.7; margin: 0 0 48px; max-width: 46ch; }
.liste { list-style: none; margin: 0; padding: 0; display: grid; gap: 1px; background: var(--line, rgba(42,191,255,.24)); border: 1px solid var(--line, rgba(42,191,255,.24)); }
.liste li { background: var(--paper, #080b14); }
.liste a { display: block; padding: 20px 22px; text-decoration: none; transition: background .25s; }
.liste a:hover { background: rgba(42,191,255,.07); }
.question { display: block; color: var(--ink, #e2e9f0); font-size: 1.08rem; font-weight: 600; margin-bottom: 6px; }
.resume { display: block; color: var(--ink-soft, #93a3b3); font-size: .95rem; line-height: 1.55; }
.pied { margin-top: 40px; color: var(--ink-soft, #93a3b3); line-height: 1.7; }
.pied a { color: var(--accent, #2abfff); }
</style>
