<template>
  <div class="arkadia-case">
    <!-- Hero Section -->
    <section class="hero">
      <div class="container">
        <h1 class="hero__title">ARKADIA FRANCE</h1>
        <h2 class="hero__subtitle">Quand le gaming devient un lab technique grandeur nature</h2>
        <p class="hero__description">
          150 joueurs. 41 mods. Une économie virtuelle. Un cluster multi-serveurs.<br>
          Si ça tient face à 150 humains réels, ça tiendra partout.
        </p>
      </div>
    </section>

    <!-- Metrics Dashboard -->
    <section class="metrics">
      <div class="container">
        <h2 class="section-title">ARKADIA en chiffres</h2>
        
        <div class="metrics__grid">
          <MetricCard :value="150" label="Membres Discord actifs" icon="👥" />
          <MetricCard value="98.7" suffix="%" label="Uptime serveur 2025" icon="⚡" />
          <MetricCard :value="41" label="Mods gérés simultanément" icon="🎮" />
          <MetricCard :value="24" label="Events organisés 2025" icon="🎪" />
          <MetricCard :value="450" label="Messages bot/jour" icon="🤖" />
          <MetricCard :value="87" suffix="%" label="Rétention mensuelle" icon="📈" />
        </div>
      </div>
    </section>

    <!-- Challenges techniques -->
    <section class="challenges">
      <div class="container">
        <h2 class="section-title">Challenges techniques</h2>
        
        <div class="challenge" v-for="challenge in challenges" :key="challenge.id">
          <h3 class="challenge__title">{{ challenge.title }}</h3>
          <p class="challenge__problem"><strong>Le problème :</strong> {{ challenge.problem }}</p>
          
          <div class="challenge__solution">
            <h4>Solution déployée :</h4>
            <ul>
              <li v-for="(solution, i) in challenge.solutions" :key="i">{{ solution }}</li>
            </ul>
          </div>
          
          <div class="challenge__results" v-if="challenge.results">
            <h4>Résultats :</h4>
            <div class="results-table">
              <div class="result-row" v-for="(result, key) in challenge.results" :key="key">
                <span class="result-label">{{ key }}</span>
                <span class="result-value">{{ result }}</span>
              </div>
            </div>
          </div>

          <div class="challenge__quote" v-if="challenge.quote">
            <p>"{{ challenge.quote }}"</p>
            <span class="quote-author">— Joueur Discord</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Learnings clés -->
    <section class="learnings">
      <div class="container">
        <h2 class="section-title">Learnings clés</h2>
        
        <div class="learnings__grid">
          <Card v-for="learning in learnings" :key="learning.id" :title="learning.title">
            <p>{{ learning.content }}</p>
          </Card>
        </div>
      </div>
    </section>

    <!-- Transition -->
    <section class="transition">
      <div class="container">
        <div class="transition__content">
          <p>ARKADIA FRANCE c'est pas qu'un projet gaming.</p>
          <p>C'est mon lab technique pour scaler des systèmes complexes,</p>
          <p>gérer des utilisateurs réels, et mesurer l'impact de chaque décision.</p>
          <p class="transition__conclusion">
            Chaque problème résolu = compétence transférable ailleurs.
          </p>
          <router-link to="/" class="transition__cta">
            → Retour au parcours complet
          </router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import Card from '@/components/common/Card.vue';
import MetricCard from '@/components/common/MetricCard.vue';

const challenges = ref([
  {
    id: 1,
    title: '1. Infrastructure : 41 mods, zéro compromis',
    problem: '41 mods qui chargent dans le désordre = crash garanti',
    solutions: [
      'Audit complet dépendances (matrice 41x41)',
      'Réorganisation Game.ini par ordre strict',
      'Scripts validation automatique',
      'Monitoring uptime temps réel avec alertes'
    ],
    results: {
      'Uptime moyen': '85% → 98.7%',
      'Crashes/mois': '12 → 1',
      'Temps démarrage': '8-12 min → 4-6 min',
      'Tickets support': '-87%'
    },
    quote: 'Avant j\'osais pas faire un long breeding, peur du crash. Maintenant je dors tranquille.'
  },
  {
    id: 2,
    title: '2. Économie virtuelle : transformer l\'inflation en gameplay',
    problem: 'Serveur x5 ressources + breeding x30 = inflation massive, monnaie sans valeur',
    solutions: [
      'Sinks ludiques (chibis collectibles, monuments prestige)',
      'Events économiques cycliques (enchères live)',
      'Buffs temporaires PvE',
      'Tracking automatisé PostgreSQL'
    ],
    results: {
      'Satisfaction économie': '42% → 71%',
      'Consommation monnaie': '+248%',
      'Joueurs "rien à acheter"': '67% → 12%',
      'Participation events': '68%'
    },
    quote: 'Vous avez transformé un problème chiant en truc fun. C\'est de la magie ou quoi ?'
  },
  {
    id: 3,
    title: '3. Gestion communauté : 150 personnes, 150 attentes différentes',
    problem: 'Casual + Mid-core + Hardcore = attentes opposées sur même serveur',
    solutions: [
      'Segmentation gameplay (zones PvE strict + events PvP opt-in)',
      'Bot Discord intelligent (FAQ automatisée via Nemotron RAG)',
      'Communication transparente (votes, sondages)',
      'Support 24/7 automatisé'
    ],
    results: {
      'Rétention mensuelle': '87%',
      'Satisfaction générale': '8.3/10',
      'Requêtes bot/jour': '~450',
      'Résolues automatiquement': '78%'
    },
    quote: 'C\'est le premier serveur où je me sens écouté. Les admins testent avant de changer.'
  }
]);

const learnings = ref([
  {
    id: 1,
    title: 'Scaler c\'est gérer la complexité, pas la charge',
    content: 'Gérer 150 joueurs avec 41 mods est exponentiellement plus complexe que 10 joueurs avec 5 mods. La solution : architecture, automatisation, communication.'
  },
  {
    id: 2,
    title: 'Monitoring > Debugging réactif',
    content: 'Le monitoring proactif économise des heures de galère. Détection crash en 2min vs découverte au réveil (6h downtime).'
  },
  {
    id: 3,
    title: 'Transparence > Features cachées',
    content: 'Les joueurs tolèrent les bugs si tu communiques. Ils ne tolèrent pas les modifications cachées. Trust damage irréversible.'
  },
  {
    id: 4,
    title: 'Communauté = sentiment d\'appartenance',
    content: 'Ce qui fidélise : être écouté, participer aux décisions, sentir que sa voix compte. Le gameplay c\'est juste le prétexte.'
  },
  {
    id: 5,
    title: 'Le Conseil des Agents fonctionne IRL',
    content: 'Problème complexe + 4 perspectives (Néo + Root + Patch + Nayla) = Solution robuste, testée, mesurée, communiquée.'
  }
]);
</script>

<style scoped>
.arkadia-case {
  min-height: 100vh;
  padding-top: 80px;
}

.hero {
  min-height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: var(--space-xl) 0;
}

.hero__title {
  font-size: clamp(3rem, 6vw, 5rem);
  margin-bottom: var(--space-sm);
  background: linear-gradient(135deg, var(--matrix-green), var(--ark-blue));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero__subtitle {
  font-size: 1.5rem;
  color: var(--ark-blue);
  margin-bottom: var(--space-md);
}

.hero__description {
  font-size: 1.125rem;
  color: var(--text-secondary);
}

.metrics {
  padding: var(--space-xl) 0;
  background: linear-gradient(to bottom, transparent, rgba(74, 158, 255, 0.02));
}

.section-title {
  text-align: center;
  margin-bottom: var(--space-xl);
  color: var(--matrix-green);
}

.metrics__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--space-md);
}

.challenges {
  padding: var(--space-xl) 0;
}

.challenge {
  max-width: 900px;
  margin: 0 auto var(--space-xl) auto;
  background: var(--card-bg);
  border: 1px solid var(--border-subtle);
  border-radius: 12px;
  padding: var(--space-lg);
  backdrop-filter: blur(10px);
}

.challenge__title {
  color: var(--matrix-green);
  margin-bottom: var(--space-md);
  font-size: 1.5rem;
}

.challenge__problem {
  color: var(--text-secondary);
  margin-bottom: var(--space-md);
}

.challenge__solution,
.challenge__results {
  margin-bottom: var(--space-md);
}

.challenge__solution h4,
.challenge__results h4 {
  color: var(--ark-blue);
  margin-bottom: var(--space-sm);
  font-size: 1.125rem;
}

.challenge__solution ul {
  list-style: none;
  padding: 0;
}

.challenge__solution li {
  padding-left: 1.5rem;
  position: relative;
  margin-bottom: var(--space-xs);
  color: var(--text-secondary);
}

.challenge__solution li::before {
  content: '→';
  position: absolute;
  left: 0;
  color: var(--matrix-green);
}

.results-table {
  display: grid;
  gap: var(--space-xs);
}

.result-row {
  display: flex;
  justify-content: space-between;
  padding: var(--space-xs);
  background: rgba(13, 13, 13, 0.5);
  border-radius: 4px;
}

.result-label {
  color: var(--text-secondary);
}

.result-value {
  color: var(--matrix-green);
  font-family: 'JetBrains Mono', monospace;
  font-weight: 700;
}

.challenge__quote {
  margin-top: var(--space-md);
  padding: var(--space-md);
  border-left: 3px solid var(--matrix-green);
  background: rgba(0, 255, 65, 0.05);
  font-style: italic;
}

.quote-author {
  display: block;
  margin-top: var(--space-xs);
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.learnings {
  padding: var(--space-xl) 0;
  background: linear-gradient(to bottom, transparent, rgba(0, 255, 65, 0.02));
}

.learnings__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--space-md);
}

.transition {
  padding: var(--space-xl) 0;
  text-align: center;
}

.transition__content p {
  font-size: 1.5rem;
  margin-bottom: var(--space-md);
  color: var(--text-primary);
}

.transition__conclusion {
  font-weight: 700;
  color: var(--matrix-green);
  margin-top: var(--space-lg);
  margin-bottom: var(--space-lg);
}

.transition__cta {
  display: inline-block;
  padding: 1rem 2rem;
  background: var(--matrix-green);
  color: var(--code-dark);
  font-family: 'JetBrains Mono', monospace;
  font-weight: 700;
  border-radius: 8px;
  transition: all var(--transition-base);
}

.transition__cta:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 255, 65, 0.4);
}
</style>
