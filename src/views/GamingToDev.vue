<template>
  <div class="gaming-to-dev">
    <!-- Hero Section -->
    <section class="hero">
      <div class="container">
        <h1 class="hero__title">
          J'ai commencé par gérer des dinosaures.<br>
          <span class="text-gradient">Maintenant je gère des APIs.</span>
        </h1>
        
        <p class="hero__subtitle">
          Entre les deux : Symfony, Vue.js, 150 joueurs,<br>
          41 mods, et une obsession pour l'automatisation.
        </p>
        
        <button class="hero__cta" @click="scrollToTimeline">
          Découvrir mon parcours ↓
        </button>
      </div>
    </section>
    
    <!-- Timeline Section -->
    <section class="timeline" ref="timelineRef">
      <div class="container">
        <h2 class="section-title">Parcours</h2>
        
        <div class="timeline__items">
          <TimelineItem
            v-for="(item, index) in timelineData"
            :key="item.year"
            :year="item.year"
            :title="item.title"
            :subtitle="item.subtitle"
            :is-last="index === timelineData.length - 1"
          >
            <div v-html="item.content"></div>
          </TimelineItem>
        </div>
      </div>
    </section>
    
    <!-- Transition Section -->
    <section class="transition">
      <div class="container">
        <div class="transition__content">
          <p>Le gaming m'a appris à scaler des systèmes complexes.</p>
          <p>Le dev m'a donné les outils pour les automatiser.</p>
          <p>L'IA me permet d'aller plus vite sans sacrifier la qualité.</p>
          
          <p class="transition__conclusion">
            Ensemble, ils forment ma méthode de travail.
          </p>
          
          <router-link to="/conseil" class="transition__cta">
            → Découvrir le Conseil des Agents
          </router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import TimelineItem from '@/components/common/TimelineItem.vue';

const timelineRef = ref(null);

const timelineData = ref([
  {
    year: '2020',
    title: 'AFORMAC',
    subtitle: 'Les fondations',
    content: `
      <p><strong>Certification Développeur Web & Mobile</strong></p>
      <p>Là où tout commence. Formation intensive, découverte de Symfony et du PHP orienté objet. Je passe de "faire des sites" à "architecturer des applications".</p>
      
      <p><strong>Projets clés :</strong></p>
      <ul>
        <li>MyBlog : Premier CRUD Symfony, gestion utilisateurs</li>
        <li>MyShop : E-commerce from scratch, paiement Stripe</li>
        <li>Apprentissage MVC, Doctrine, Twig</li>
      </ul>
      
      <p><strong>Le déclic :</strong> Comprendre qu'un framework c'est pas une contrainte, c'est un langage commun.</p>
    `
  },
  {
    year: '2021',
    title: 'Superdev',
    subtitle: 'Passage en prod',
    content: `
      <p><strong>Alternance - Premier client réel</strong></p>
      <p>Le grand saut : travailler sur du code qui sert vraiment, avec des deadlines réelles et des utilisateurs qui râlent si ça bug.</p>
      
      <p><strong>Projet principal : OVB</strong></p>
      <ul>
        <li>Application métier Symfony en équipe</li>
        <li>Découverte Git en environnement pro</li>
        <li>Premières revues de code (humilité++)</li>
      </ul>
      
      <p><strong>Compétences acquises :</strong></p>
      <ul>
        <li>Symfony en production (cache, performance, déploiement)</li>
        <li>Travail en équipe (conventions, documentation)</li>
        <li>Gestion legacy code (refactoring progressif)</li>
      </ul>
      
      <p><strong>La leçon :</strong> Le code parfait n'existe pas. Le code qui marche et qu'on peut maintenir, oui.</p>
    `
  },
  {
    year: '2024',
    title: 'ARKADIA FRANCE',
    subtitle: 'Le terrain de jeu',
    content: `
      <p><strong>Création communauté gaming + infrastructure complète</strong></p>
      <p>J'avais besoin d'un projet où je pouvais tout casser sans conséquences pro. ARKADIA FRANCE est né : serveur ARK Survival Ascended, 0 membre au départ.</p>
      
      <p><strong>12 mois plus tard :</strong></p>
      <ul>
        <li>150 membres Discord actifs</li>
        <li>Serveur PvE x5 ressources, breeding x30</li>
        <li>Économie virtuelle avec monnaie custom</li>
        <li>41 mods gérés, ordre de chargement optimisé</li>
      </ul>
      
      <p><strong>Stack technique déployée :</strong></p>
      <ul>
        <li>API Nitrado (monitoring serveur temps réel)</li>
        <li>Discord.js (bots administration + assistance)</li>
        <li>n8n (workflows automatisation complète)</li>
        <li>PostgreSQL (tracking économie + logs)</li>
      </ul>
      
      <p><strong>Le vrai apprentissage :</strong> Gérer une communauté = gérer un produit. Tu dois scaler l'infrastructure ET les humains. Les bugs techniques sont faciles comparés aux attentes divergentes de 150 personnes.</p>
      
      <p><strong>Problèmes résolus :</strong></p>
      <ul>
        <li>Inflation économique massive → Marché dynamique + sinks ludiques</li>
        <li>Uptime aléatoire → Monitoring + alertes automatisées</li>
        <li>Support 24/7 impossible → Bot FAQ + commandes automatisées</li>
        <li>Gestion 41 mods → Scripts vérification compatibilité</li>
      </ul>
    `
  },
  {
    year: '2025',
    title: 'Stack IA locale',
    subtitle: "L'indépendance",
    content: `
      <p><strong>Construction écosystème IA personnel</strong></p>
      <p>Fatigué de dépendre d'APIs cloud pour des tâches répétitives. Fatigué de payer pour des requêtes que je pourrais traiter localement. Fatigué d'envoyer mes données de projet à des serveurs US.</p>
      
      <p><strong>Infrastructure déployée :</strong></p>
      <ul>
        <li><strong>Nemotron :</strong> LLM local performant (équivalent GPT-3.5)</li>
        <li><strong>OpenWebUI :</strong> Interface unifiée, gestion multi-modèles</li>
        <li><strong>Continue :</strong> Copilote code directement dans VS Code</li>
        <li><strong>ChromaDB :</strong> Base vectorielle pour RAG</li>
        <li><strong>n8n :</strong> Orchestration workflows IA</li>
      </ul>
      
      <p><strong>Use cases concrets :</strong></p>
      <ul>
        <li>Génération code assistée (components Vue, controllers Symfony)</li>
        <li>Résumés automatiques meetings communauté ARKADIA</li>
        <li>Suggestions configs serveur (.ini optimisés)</li>
        <li>Documentation auto-générée depuis Zettelkasten Obsidian</li>
      </ul>
      
      <p><strong>Galères surmontées :</strong></p>
      <ul>
        <li>Incompatibilité Pydantic v1/v2 avec ChromaDB (fix: versions spécifiques)</li>
        <li>Contexte limité modèles locaux vs GPT-4 (optimisation prompts)</li>
        <li>Trade-off vitesse/qualité (choix modèle selon tâche)</li>
      </ul>
      
      <p><strong>Le gain réel :</strong> Latence divisée par 10. Coûts prévisibles (hardware one-time). Contrôle total sur fine-tuning. Et surtout : mes données de projet restent chez moi.</p>
    `
  },
  {
    year: '2026',
    title: 'Ragnarök',
    subtitle: 'Le test ultime (en cours)',
    content: `
      <p><strong>Migration serveur massive - Deadline : 18 janvier 2026</strong></p>
      <p>Le plus gros challenge technique à ce jour. Migrer ARKADIA FRANCE vers une nouvelle map sans perdre la communauté, sans casser les 41 mods, sans downtime catastrophique.</p>
      
      <p><strong>Contraintes :</strong></p>
      <ul>
        <li>3 semaines de préparation totale</li>
        <li>150 utilisateurs qui attendent la migration</li>
        <li>41 mods à revalider compatibilité un par un</li>
        <li>Économie virtuelle à réinitialiser proprement</li>
      </ul>
      
      <p><strong>Application réelle de tout ce que j'ai appris :</strong> Conseil des Agents en action. Stack IA locale pour générer docs migration. Automatisation n8n pour séquencer les tâches critiques.</p>
      
      <p><strong>Le résultat déterminera si je maîtrise vraiment ce que je prétends maîtriser.</strong></p>
    `
  }
]);

const scrollToTimeline = () => {
  timelineRef.value?.scrollIntoView({ behavior: 'smooth' });
};
</script>

<style scoped>
.gaming-to-dev {
  min-height: 100vh;
}

.hero {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.hero__title {
  margin-bottom: var(--space-md);
  animation: fadeInUp 1s ease;
}

.hero__subtitle {
  font-size: 1.25rem;
  color: var(--text-secondary);
  margin-bottom: var(--space-lg);
  animation: fadeInUp 1s ease 0.2s backwards;
}

.hero__cta {
  padding: 1rem 2rem;
  background: transparent;
  border: 2px solid var(--matrix-green);
  color: var(--matrix-green);
  font-family: 'JetBrains Mono', monospace;
  font-size: 1rem;
  cursor: pointer;
  border-radius: 8px;
  transition: all var(--transition-base);
  animation: fadeInUp 1s ease 0.4s backwards;
}

.hero__cta:hover {
  background: var(--matrix-green);
  color: var(--code-dark);
  box-shadow: 0 0 20px var(--matrix-green);
  transform: translateY(-2px);
}

.timeline {
  padding: var(--space-xl) 0;
}

.section-title {
  text-align: center;
  margin-bottom: var(--space-xl);
  color: var(--matrix-green);
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

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
