<template>
  <div class="conseil-agents">
    <!-- Hero Section -->
    <section class="hero">
      <div class="container">
        <h1 class="hero__title">Le Conseil des Agents</h1>
        <h2 class="hero__subtitle">Résoudre des problèmes complexes avec 4 perspectives</h2>
        <p class="hero__description">
          Quand tu gères à la fois du code, des serveurs, et 150 humains,<br>
          les décisions simples n'existent pas.
        </p>
      </div>
    </section>

    <!-- Les 4 Agents -->
    <section class="agents">
      <div class="container">
        <h2 class="section-title">Les 4 Agents</h2>
        
        <div class="agents__grid">
          <Card
            v-for="agent in agents"
            :key="agent.id"
            :title="agent.name"
            hoverable
            :active="activeAgent === agent.id"
            @click="activeAgent = agent.id"
          >
            <template #icon>
              <div class="agent__emoji">{{ agent.emoji }}</div>
            </template>
            
            <div class="agent__role">{{ agent.role }}</div>
            <div class="agent__devise">"{{ agent.devise }}"</div>
            
            <div v-if="activeAgent === agent.id" class="agent__details">
              <h4>Forces :</h4>
              <ul>
                <li v-for="(force, i) in agent.forces" :key="i">{{ force }}</li>
              </ul>
              
              <h4>Exemple réel :</h4>
              <p>{{ agent.exemple }}</p>
            </div>
          </Card>
        </div>
      </div>
    </section>

    <!-- Le Conseil en action -->
    <section class="conseil-action">
      <div class="container">
        <h2 class="section-title">Le Conseil en action</h2>
        <h3 class="subsection-title">Event ARMAGEDDON (janvier 2026)</h3>
        
        <div class="armageddon">
          <div class="armageddon__context">
            <h4>Contexte :</h4>
            <p>Migration majeure ARKADIA FRANCE - 41 mods, 150 joueurs, cluster multi-serveurs</p>
            <p><strong>Deadline : 18 janvier 2026</strong></p>
          </div>

          <div class="armageddon__changes">
            <h4>Changements techniques :</h4>
            <div class="changes-grid">
              <div class="change-card">
                <h5>❌ Mods qui partent (9)</h5>
                <ul>
                  <li>TG Stacking Mod → Natif Game.ini</li>
                  <li>Visual Storage → Incompatible cluster</li>
                  <li>Potions → Redondance</li>
                  <li>+ 6 autres optimisations</li>
                </ul>
              </div>
              <div class="change-card">
                <h5>✅ Mods qui arrivent (2)</h5>
                <ul>
                  <li>Imbue Station → Crafting avancé</li>
                  <li>Cliffans Backpacks → QoL inventaire</li>
                </ul>
              </div>
            </div>
          </div>

          <div class="armageddon__status">
            <h4>Status actuel (J-19) :</h4>
            <MetricCard value="79" suffix="%" label="Overall Readiness" icon="🔄" />
          </div>
        </div>
      </div>
    </section>

    <!-- Transition -->
    <section class="transition">
      <div class="container">
        <div class="transition__content">
          <p>Le Conseil des Agents c'est pas de la théorie.</p>
          <p>C'est ma méthode pour naviguer la complexité.</p>
          <p class="transition__conclusion">
            Technique, humaine, créative, mesurable.
          </p>
          <router-link to="/stack-ia" class="transition__cta">
            → Voir comment j'applique ça à l'IA locale
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

const activeAgent = ref(null);

const agents = ref([
  {
    id: 'neo',
    name: 'NÉO ARKADIAN',
    emoji: '🏛️',
    role: 'Architecte & Équilibreur',
    devise: 'Observer avant d\'agir',
    forces: [
      'Vision d\'ensemble système + humain',
      'Transparence totale',
      'Équilibre long terme vs gains immédiats'
    ],
    exemple: 'Refonte économie ARKADIA : création sinks ludiques (chibis, monuments) sans nerfer les rates. Satisfaction économie : 42% → 71%'
  },
  {
    id: 'root',
    name: 'ROOT',
    emoji: '⚙️',
    role: 'Système & Optimisation',
    devise: 'Performance > Élégance',
    forces: [
      'Optimisation infrastructure',
      'Sécurité et fail-safes',
      'Debugging critique'
    ],
    exemple: 'Ordre chargement 41 mods optimisé. Uptime serveur : 85% → 98.7%. Crashes : 12/mois → 1/mois'
  },
  {
    id: 'patch',
    name: 'PATCH (Léo Verdan)',
    emoji: '🎨',
    role: 'Innovation & Chaos Contrôlé',
    devise: 'Les bugs sont des features non documentées',
    forces: [
      'Solutions non conventionnelles',
      'Transformation contrainte → gameplay',
      'Pensée latérale'
    ],
    exemple: 'Inflation serveur transformée en events économiques. Participation : 68%. Engagement Discord : +127%'
  },
  {
    id: 'nayla',
    name: 'NAYLA',
    emoji: '📊',
    role: 'Analyste & KPIs',
    devise: 'Ce qui ne se mesure pas n\'existe pas',
    forces: [
      'Métriques et tracking',
      'A/B testing',
      'Décisions data-driven'
    ],
    exemple: 'Test 3 formats events : Format hybride gagne avec 68% participation vs 35-52% autres formats'
  }
]);
</script>

<style scoped>
.conseil-agents {
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
  margin-bottom: var(--space-sm);
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

.agents {
  padding: var(--space-xl) 0;
}

.section-title {
  text-align: center;
  margin-bottom: var(--space-xl);
  color: var(--matrix-green);
}

.agents__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--space-md);
}

.agent__emoji {
  font-size: 3rem;
}

.agent__role {
  font-weight: 600;
  color: var(--ark-blue);
  margin-bottom: var(--space-xs);
}

.agent__devise {
  font-style: italic;
  color: var(--text-secondary);
  margin-bottom: var(--space-md);
}

.agent__details {
  margin-top: var(--space-md);
  padding-top: var(--space-md);
  border-top: 1px solid var(--border-subtle);
}

.agent__details h4 {
  font-size: 1rem;
  margin-bottom: var(--space-sm);
  color: var(--matrix-green);
}

.agent__details ul {
  list-style: none;
  padding: 0;
  margin-bottom: var(--space-md);
}

.agent__details li {
  padding-left: 1.5rem;
  position: relative;
  margin-bottom: var(--space-xs);
  color: var(--text-secondary);
}

.agent__details li::before {
  content: '→';
  position: absolute;
  left: 0;
  color: var(--matrix-green);
}

.conseil-action {
  padding: var(--space-xl) 0;
  background: linear-gradient(to bottom, transparent, rgba(0, 255, 65, 0.02));
}

.subsection-title {
  text-align: center;
  color: var(--ark-blue);
  margin-bottom: var(--space-lg);
}

.armageddon {
  max-width: 900px;
  margin: 0 auto;
}

.armageddon__context,
.armageddon__changes {
  background: var(--card-bg);
  border: 1px solid var(--border-subtle);
  border-radius: 12px;
  padding: var(--space-md);
  margin-bottom: var(--space-md);
}

.armageddon__context h4,
.armageddon__changes h4 {
  color: var(--matrix-green);
  margin-bottom: var(--space-sm);
}

.changes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--space-md);
  margin-top: var(--space-md);
}

.change-card {
  background: rgba(13, 13, 13, 0.5);
  padding: var(--space-md);
  border-radius: 8px;
  border: 1px solid var(--border-subtle);
}

.change-card h5 {
  font-size: 1rem;
  margin-bottom: var(--space-sm);
}

.change-card ul {
  list-style: none;
  padding: 0;
}

.change-card li {
  padding-left: 1.5rem;
  position: relative;
  margin-bottom: var(--space-xs);
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.change-card li::before {
  content: '•';
  position: absolute;
  left: 0;
  color: var(--matrix-green);
}

.armageddon__status {
  display: flex;
  justify-content: center;
  margin-top: var(--space-lg);
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
