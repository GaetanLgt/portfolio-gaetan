<template>
  <div class="liens-page">
    <header class="page-header">
      <div class="container">
        <div class="header-badge">
          <span class="badge-icon" aria-hidden="true">🔗</span>
          <span class="badge-text">LIENS</span>
        </div>
        <h1 class="page-title">
          <span class="title-pre">Tout le studio</span>
          <span class="title-main">EN UN SEUL ENDROIT</span>
        </h1>
        <p class="page-desc">
          La page de liens du studio — hébergée chez nous, pas chez un service tiers.
          Nos pages, et nos productions : aucune collecte, aucun traqueur, rien d'autre
          que ce que vous voyez ici.
        </p>
      </div>
    </header>

    <section class="container">
      <h2 class="section-titre">Nos pages</h2>
      <ul class="liens">
        <li v-for="lien in liens" :key="lien.href">
          <a v-if="lien.externe" :href="lien.href" class="lien" rel="noopener">
            <span class="lien__icone" aria-hidden="true">{{ lien.icone }}</span>
            <span class="lien__corps">
              <span class="lien__titre">{{ lien.titre }}</span>
              <span class="lien__desc">{{ lien.desc }}</span>
            </span>
            <span class="lien__hors" aria-hidden="true">↗</span>
          </a>
          <RouterLink v-else :to="lien.href" :class="['lien', lien.principal ? 'lien--principal' : '']">
            <span class="lien__icone" aria-hidden="true">{{ lien.icone }}</span>
            <span class="lien__corps">
              <span class="lien__titre">{{ lien.titre }}</span>
              <span class="lien__desc">{{ lien.desc }}</span>
            </span>
          </RouterLink>
        </li>
      </ul>

      <!--
        SECTION « NOS PRODUCTIONS » (ajoutée le 10/09/2026).
        Constat mesuré : cette page listait quatre pages du site, mais AUCUNE de nos
        productions — alors que l'objectif du studio est un écosystème relié. Le site
        citait déjà ArkAdiA depuis la page Services : le lien manquait ici, au seul
        endroit prévu pour regrouper nos adresses.
        Volontairement ABSENTE : la page de contrôle interne
        (controle.gldigitallab.fr), qui porte `X-Robots-Tag: noindex` — l'afficher
        ici la rendrait publique, ce qui contredirait le choix de la garder
        discrète. Décision à Gaëtan si tu veux l'ajouter.
      -->
      <h2 class="section-titre">Nos productions</h2>
      <ul class="liens">
        <li v-for="lien in productions" :key="lien.href">
          <a :href="lien.href" class="lien" rel="noopener">
            <span class="lien__icone" aria-hidden="true">{{ lien.icone }}</span>
            <span class="lien__corps">
              <span class="lien__titre">{{ lien.titre }}</span>
              <span class="lien__desc">{{ lien.desc }}</span>
            </span>
            <span class="lien__hors" aria-hidden="true">↗</span>
          </a>
        </li>
      </ul>

      <p class="note">
        Studio indépendant français, dans la Somme. Tout le calcul d'IA tourne sur notre
        propre machine : aucune donnée client ne sort.
        <RouterLink to="/dossier">Voir le dossier professionnel</RouterLink>.
      </p>
    </section>
  </div>
</template>

<script setup>
// Page de liens du studio.
//
// POURQUOI ELLE EXISTE (décision du 10/09/2026) : les fiches de communication
// prescrivaient un « Linktree ». C'est un service tiers qui héberge nos liens —
// en contradiction directe avec la doctrine local-first du studio, et une page de
// plus à maintenir. Cette page remplit la même fonction, sur notre domaine.
//
// Les quatre cibles sont des PAGES QUI EXISTENT DÉJÀ : aucun lien mort. C'est la
// raison du choix — une page de liens qui pointe dans le vide est pire que pas de
// page du tout.
const liens = [
  {
    href: '/services',
    icone: '🔍',
    titre: 'Audit WordPress 48 h',
    desc: 'Performance, sécurité, RGPD. Rendu en 48 h, tout en local.',
    principal: true,
  },
  {
    href: '/projets',
    icone: '🧭',
    titre: 'Projets et études de cas',
    desc: 'Ce que le studio a produit — dont ARKADIA France, exploité 18 mois.',
  },
  {
    href: '/dossier',
    icone: '📄',
    titre: 'Prestations et prix publies',
    desc: 'La grille complete, la methode, et les limites que nous assumons.',
  },
  {
    href: '/contact',
    icone: '✉️',
    titre: 'Nous ecrire',
    desc: 'Premier echange de 30 minutes, gratuit et sans engagement.',
  },
];

// Nos productions publiques. Une seule règle : ne lister QUE ce qui est réellement
// en ligne et joignable — vérifié le 10/09/2026 (arkadia.gldigitallab.fr → HTTP 200).
const productions = [
  {
    href: 'https://arkadia.gldigitallab.fr',
    icone: '🕸️',
    titre: 'ArkAdiA — le réseau triple A',
    desc: 'Notre réseau social : amitié, aventure, art. Landing publique sur notre domaine, moteur sur notre serveur.',
  },
];
</script>

<style scoped>
/* Tout est construit sur les jetons du design system (variables.css) :
   papier chaud, encre chaude, et l'accent brique UNIQUEMENT sur l'action
   primaire — c'est la règle écrite dans variables.css. Aucune couleur en dur. */

.liens-page {
  min-height: 100vh;
  background: var(--paper);
  color: var(--ink);
  padding-bottom: var(--space-xl);
}

.container {
  width: min(760px, 92vw);
  margin: 0 auto;
}

.page-header {
  padding: var(--space-xl) 0 var(--space-lg);
}

.header-badge {
  display: inline-flex;
  align-items: center;
  gap: var(--space-xs);
  border: 1px solid var(--rule);
  border-radius: 999px;
  padding: 0.35rem 0.9rem;
  margin-bottom: var(--space-md);
}

.badge-icon {
  font-size: 1rem;
}

.badge-text {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  letter-spacing: 0.14em;
  color: var(--ink-soft);
}

.page-title {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  margin: 0 0 var(--space-sm);
  font-size: clamp(2rem, 6vw, 3.4rem);
  line-height: 1.05;
}

.title-pre {
  font-size: 0.5em;
  font-weight: 500;
  color: var(--ink-soft);
}

.title-main {
  font-weight: 700;
  letter-spacing: -0.01em;
}

.page-desc {
  max-width: 52ch;
  color: var(--ink-soft);
  font-size: 1.05rem;
  line-height: 1.6;
}

.liens {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: var(--space-sm);
}

/* Titre de section : deux groupes sur cette page (nos pages / nos productions),
   donc il faut les nommer — sinon la liste paraît hétérogène. */
.section-titre {
  margin: var(--space-lg) 0 var(--space-sm);
  font-family: var(--font-mono);
  font-size: 0.78rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--ink-soft);
}

.section-titre:first-of-type {
  margin-top: var(--space-sm);
}

/* Marqueur de lien sortant : le visiteur doit savoir qu'il quitte le domaine. */
.lien__hors {
  margin-left: auto;
  color: var(--ink-soft);
  font-size: 1.05rem;
  line-height: 1;
}

.lien {
  display: flex;
  align-items: flex-start;
  gap: var(--space-sm);
  padding: var(--space-md);
  border: 1px solid var(--rule);
  border-radius: 10px;
  background: var(--paper-alt);
  color: inherit;
  text-decoration: none;
  transition: border-color var(--transition-fast), transform var(--transition-fast);
}

.lien:hover,
.lien:focus-visible {
  border-color: var(--rule-strong);
  transform: translateY(-1px);
}

/* L'indicateur de focus est explicite : la page est un point d'entrée depuis
   les réseaux, donc souvent utilisée au clavier sur mobile. */
.lien:focus-visible {
  outline: 2px solid var(--ink);
  outline-offset: 3px;
}

.lien--principal {
  background: var(--accent);
  border-color: var(--accent);
  color: var(--paper);
}

.lien--principal .lien__desc {
  color: var(--paper);
  opacity: 0.92;
}

.lien--principal:hover,
.lien--principal:focus-visible {
  background: var(--accent-ink);
  border-color: var(--accent-ink);
}

.lien--principal:focus-visible {
  outline-color: var(--ink);
}

.lien__icone {
  font-size: 1.4rem;
  line-height: 1;
}

.lien__corps {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.lien__titre {
  font-size: 1.1rem;
  font-weight: 600;
}

.lien__desc {
  color: var(--ink-soft);
  font-size: 0.95rem;
  line-height: 1.5;
}

.note {
  margin-top: var(--space-lg);
  padding-top: var(--space-sm);
  border-top: 1px solid var(--rule);
  color: var(--ink-soft);
  font-size: 0.9rem;
  line-height: 1.6;
}

.note a {
  color: var(--ink);
  text-decoration: underline;
  text-underline-offset: 3px;
}

.note a:hover {
  color: var(--accent-ink);
}

@media (prefers-reduced-motion: reduce) {
  .lien {
    transition: none;
  }
  .lien:hover,
  .lien:focus-visible {
    transform: none;
  }
}
</style>
