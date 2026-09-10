<template>
  <div class="apps-page">
    <header class="page-header">
      <div class="container">
        <div class="header-badge">
          <span class="badge-icon" aria-hidden="true">🧩</span>
          <span class="badge-text">APPLICATIONS</span>
        </div>
        <h1 class="page-title">
          <span class="title-pre">Les outils de</span>
          <span class="title-main">L'ÉQUIPAGE</span>
        </h1>
        <p class="page-desc">
          Les applications que le studio utilise et montre. Chacune est un outil réel,
          décrit sans promesse excessive — y compris ce qu'elle ne fait pas.
        </p>
      </div>
    </header>

    <main class="container">
      <!--
        PAGE CRÉÉE LE 10/09/2026 POUR CORRIGER UN DÉFAUT MESURÉ.
        Constat : les 7 pages d'applications portaient toutes un lien « ← Retour aux Apps »
        vers /apps — une adresse qui n'a JAMAIS existé (ni route dans le routeur, ni page
        pré-rendue, ni entrée au plan de site). En ligne, /apps répondait 403 : les sept
        boutons de retour menaient donc à une erreur.
        Vérifié par l'audit des liens du site publié : 21 pages lues, 10 liens internes
        distincts, 1 lien mort — celui-ci, cité 7 fois.
        Correctif choisi : créer la page que le libellé annonçait, plutôt que de renommer
        sept liens. Le contenu existait déjà (chaque app a son titre et sa description).
      -->
      <h2 class="section-titre">Nos applications</h2>
      <ul class="apps">
        <li v-for="app in apps" :key="app.href">
          <RouterLink :to="app.href" class="app">
            <span class="app__icone" aria-hidden="true">{{ app.icone }}</span>
            <span class="app__corps">
              <span class="app__titre">{{ app.nom }}</span>
              <span class="app__role">{{ app.role }}</span>
              <span class="app__desc">{{ app.desc }}</span>
            </span>
          </RouterLink>
        </li>
      </ul>

      <p class="apps__note">
        Ces outils tournent <strong>chez nous</strong>. Aucun n'est un service en ligne
        auquel vous vous abonnez : ils servent à produire les livraisons du studio.
      </p>
    </main>
  </div>
</template>

<script setup>
/* Liste des applications — reprise des routes du routeur (`src/router/index.js`).
   Toute app ajoutée au routeur doit l'être ici aussi, sinon elle devient invisible
   depuis cette page. */
const apps = [
  {
    href: '/apps/agent/wa',
    icone: '🧭',
    nom: 'Wa Router',
    role: 'Orchestrateur multi-agent',
    desc: 'Oriente une demande vers le bon outil de l\'équipage et rassemble les réponses.'
  },
  {
    href: '/apps/agent/makoto',
    icone: '🛡️',
    nom: 'Makoto Scanner',
    role: 'Audit de sécurité',
    desc: 'Relève les vulnérabilités d\'un projet et de ses dépendances, avec le détail de chaque constat.'
  },
  {
    href: '/apps/agent/dou',
    icone: '📊',
    nom: 'Dou Monitor',
    role: 'Supervision système',
    desc: 'Surveille les services et les métriques de la machine : ports, processus, disponibilité.'
  },
  {
    href: '/apps/agent/watashi',
    icone: '📚',
    nom: 'Watashi Knowledge Base',
    role: 'Base de connaissances',
    desc: 'Indexe des documents et répond de façon citée, ancrée sur les sources fournies.'
  },
  {
    href: '/apps/agent/jitsu',
    icone: '⚙️',
    nom: 'Jitsu Pipeline',
    role: 'Générateur CI/CD',
    desc: 'Produit des configurations d\'intégration continue pour GitHub Actions et GitLab CI.'
  },
  {
    href: '/apps/seo-content',
    icone: '🔍',
    nom: 'SEO Content Generator',
    role: 'Contenu optimisé',
    desc: 'Rédige et structure du contenu en respectant les règles de référencement technique.'
  },
  {
    href: '/apps/invoice-generator',
    icone: '🧾',
    nom: 'Invoice Generator',
    role: 'Devis et factures',
    desc: 'Génère les documents commerciaux du studio à partir d\'un modèle.'
  }
];
</script>

<style scoped>
.apps-page {
  min-height: 100vh;
}

.page-header {
  padding: clamp(5rem, 12vw, 8rem) 0 clamp(2.5rem, 6vw, 4rem);
  text-align: center;
}

.header-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.25rem;
  font-size: 0.75rem;
  letter-spacing: 0.16em;
}

.badge-icon {
  font-size: 1.1rem;
}

.page-title {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  margin: 0 0 1rem;
  line-height: 1.1;
}

.title-pre {
  font-size: clamp(1rem, 2.4vw, 1.3rem);
  font-weight: 400;
  opacity: 0.75;
}

.title-main {
  font-size: clamp(1.9rem, 5.5vw, 3rem);
  font-weight: 800;
  letter-spacing: 0.02em;
}

.page-desc {
  max-width: 46rem;
  margin: 0 auto;
  line-height: 1.7;
  opacity: 0.85;
}

.container {
  max-width: 64rem;
  margin: 0 auto;
  padding: 0 1.25rem;
}

.section-titre {
  margin: 0 0 1.5rem;
  font-size: 1.1rem;
  letter-spacing: 0.06em;
}

.apps {
  display: grid;
  gap: 0.85rem;
  margin: 0 0 2.5rem;
  padding: 0;
  list-style: none;
}

.app {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
  padding: 1.1rem 1.25rem;
  border: 1px solid rgba(127, 127, 127, 0.28);
  border-radius: 0.85rem;
  text-decoration: none;
  color: inherit;
  transition: border-color 0.2s ease, transform 0.2s ease;
}

.app:hover,
.app:focus-visible {
  border-color: rgba(16, 185, 129, 0.55);
  transform: translateY(-2px);
}

.app__icone {
  font-size: 1.5rem;
  line-height: 1;
  flex-shrink: 0;
}

.app__corps {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.app__titre {
  font-weight: 700;
}

.app__role {
  font-size: 0.82rem;
  letter-spacing: 0.05em;
  opacity: 0.7;
}

.app__desc {
  margin-top: 0.25rem;
  line-height: 1.6;
  opacity: 0.85;
}

.apps__note {
  padding: 1rem 1.25rem;
  border-left: 3px solid rgba(16, 185, 129, 0.5);
  line-height: 1.7;
  opacity: 0.9;
}

@media (max-width: 640px) {
  .app {
    padding: 1rem;
  }
}
</style>
