<template>
  <div class="parcours-page">
    <!-- Hero -->
    <section class="hero">
      <div class="container">
        <div class="tag animate-pulse-slow">
          <span>→</span> ORIGINE STORY
        </div>
        
        <h1 class="hero__title">
          DU GAMING AU <span class="text-gradient neon-text">CODE</span>
        </h1>
        
        <p class="hero__subtitle">
          Comment la gestion de communautés gaming m'a forgé en architecte logiciel.<br>
          Un parcours atypique, une rigueur acquise sur le terrain.
        </p>
      </div>
    </section>
    
    <!-- Timeline Story -->
    <section class="story">
      <div class="container">
        <div class="timeline-vertical">
          
          <!-- Chapter 1 -->
          <div class="chapter">
            <div class="chapter__marker">
              <span class="chapter__year">2015</span>
            </div>
            <div class="chapter__content glass">
              <div class="chapter__header">
                <span class="chapter__icon">🎮</span>
                <h2>Les Premières Communautés</h2>
              </div>
              <p>
                Tout commence par une passion : les jeux de survie multijoueur. Rapidement, 
                je ne me contente plus de jouer. Je crée des serveurs, j'organise des événements, 
                je gère des dizaines puis des centaines de joueurs.
              </p>
              <div class="chapter__skills">
                <span>Community Management</span>
                <span>Organisation</span>
                <span>Médiation</span>
              </div>
            </div>
          </div>
          
          <!-- Chapter 2 -->
          <div class="chapter">
            <div class="chapter__marker">
              <span class="chapter__year">2018</span>
            </div>
            <div class="chapter__content glass">
              <div class="chapter__header">
                <span class="chapter__icon">⚙️</span>
                <h2>La Découverte du Code</h2>
              </div>
              <p>
                Les limites des outils existants me frustrent. Je veux automatiser, personnaliser, 
                créer mes propres solutions. Je découvre PHP, puis JavaScript. Les nuits blanches 
                ne sont plus pour jouer, mais pour coder.
              </p>
              <div class="chapter__skills">
                <span>PHP</span>
                <span>JavaScript</span>
                <span>MySQL</span>
                <span>Automatisation</span>
              </div>
            </div>
          </div>
          
          <!-- Chapter 3 -->
          <div class="chapter">
            <div class="chapter__marker">
              <span class="chapter__year">2020</span>
            </div>
            <div class="chapter__content glass">
              <div class="chapter__header">
                <span class="chapter__icon">🎓</span>
                <h2>La Formation Professionnelle</h2>
              </div>
              <p>
                Je formalise mes acquis avec une certification professionnelle "Développeur Web et Mobile" 
                chez AFORMAC. Stage chez Superdev où je développe un site WordPress/Timber/ACF pour 
                l'association Ouvre-Boîtes. La rigueur professionnelle s'ajoute à la passion.
              </p>
              <div class="chapter__skills">
                <span>WordPress</span>
                <span>Timber/Twig</span>
                <span>ACF</span>
                <span>Méthodologie Pro</span>
              </div>
            </div>
          </div>
          
          <!-- Chapter 4 -->
          <div class="chapter">
            <div class="chapter__marker">
              <span class="chapter__year">2021</span>
            </div>
            <div class="chapter__content glass">
              <div class="chapter__header">
                <span class="chapter__icon">🏢</span>
                <h2>L'Expérience Entreprise</h2>
              </div>
              <p>
                Embauché chez IMA GIE, je découvre les contraintes de l'entreprise : legacy code, 
                travail en équipe, processus de validation, dette technique. J'apprends à naviguer 
                dans des systèmes complexes tout en poussant pour la modernisation.
              </p>
              <div class="chapter__skills">
                <span>Symfony</span>
                <span>Travail d'équipe</span>
                <span>Legacy Systems</span>
                <span>CI/CD</span>
              </div>
            </div>
          </div>
          
          <!-- Chapter 5 -->
          <div class="chapter">
            <div class="chapter__marker">
              <span class="chapter__year">2024</span>
            </div>
            <div class="chapter__content glass">
              <div class="chapter__header">
                <span class="chapter__icon">🚀</span>
                <h2>ARKADIA : Le Laboratoire</h2>
              </div>
              <p>
                Je lance ARKADIA FRANCE, un cluster ARK: Survival Ascended de 9 serveurs. 
                C'est mon laboratoire : infrastructure Nitrado, bots Discord, workflows n8n, 
                IA locale. 150+ utilisateurs actifs, 99.8% uptime. La preuve par l'action.
              </p>
              <div class="chapter__skills">
                <span>DevOps</span>
                <span>n8n</span>
                <span>Discord Bots</span>
                <span>Infrastructure</span>
              </div>
            </div>
          </div>
          
          <!-- Chapter 6 -->
          <div class="chapter chapter--current">
            <div class="chapter__marker">
              <span class="chapter__year">2026</span>
            </div>
            <div class="chapter__content glass">
              <div class="chapter__header">
                <span class="chapter__icon">💎</span>
                <h2>GL Digital Lab</h2>
              </div>
              <p>
                Le 29 janvier 2026, jour de mes 40 ans, je lance officiellement GL Digital Lab. 
                L'aboutissement d'un parcours atypique : la rigueur gaming appliquée au développement 
                professionnel. Architecture souveraine, IA locale, solutions sur-mesure pour PME.
              </p>
              <div class="chapter__skills">
                <span>Symfony 8</span>
                <span>Vue 3</span>
                <span>IA Locale</span>
                <span>Indépendance</span>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </section>
    
    <!-- Philosophy -->
    <section class="philosophy">
      <div class="container">
        <div class="philosophy__content glass">
          <h2>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
              <line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
            Ce que le gaming m'a appris
          </h2>
          
          <div class="lessons">
            <div class="lesson">
              <span class="lesson__num">01</span>
              <h3>La Pression du Temps Réel</h3>
              <p>Quand 50 joueurs attendent que tu fixes un bug serveur, tu apprends à diagnostiquer vite et bien.</p>
            </div>
            
            <div class="lesson">
              <span class="lesson__num">02</span>
              <h3>L'Importance de la Documentation</h3>
              <p>Sans règles claires et patch notes, c'est le chaos. J'applique la même rigueur à mon code.</p>
            </div>
            
            <div class="lesson">
              <span class="lesson__num">03</span>
              <h3>L'Itération Continue</h3>
              <p>Un serveur gaming, c'est un produit vivant. Tu écoutes, tu ajustes, tu améliores. Comme un SaaS.</p>
            </div>
            
            <div class="lesson">
              <span class="lesson__num">04</span>
              <h3>La Gestion de Communauté</h3>
              <p>Gérer des joueurs passionnés prépare à gérer des clients exigeants. Même empathie, même patience.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
    
    <!-- CTA -->
    <section class="cta-section">
      <div class="container">
        <div class="cta-box glass">
          <h2 class="cta-box__title">Curieux d'en savoir plus ?</h2>
          <p class="cta-box__desc">
            Découvrez comment j'applique cette rigueur à vos projets.
          </p>
          <div class="cta-box__buttons">
            <router-link to="/arkadia" class="btn-outline">
              CASE STUDY ARKADIA
            </router-link>
            <router-link to="/services" class="btn-primary">
              VOIR LES OFFRES
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
              </svg>
            </router-link>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
// Static page, no reactive state needed
</script>

<style scoped>
.parcours-page {
  min-height: 100vh;
  padding-top: 80px;
  position: relative;
  z-index: 1;
}

/* HERO */
.hero {
  padding: var(--space-xl) 0 var(--space-lg);
  text-align: center;
}

.hero__title {
  font-size: clamp(2.5rem, 8vw, 4.5rem);
  font-weight: 900;
  margin: var(--space-md) 0;
}

.hero__subtitle {
  font-size: 1.1rem;
  color: var(--text-muted);
  line-height: 1.8;
  max-width: 600px;
  margin: 0 auto;
}

/* STORY TIMELINE */
.story {
  padding: var(--space-lg) 0 var(--space-xl);
}

.timeline-vertical {
  position: relative;
  max-width: 800px;
  margin: 0 auto;
  padding-left: 80px;
}

.timeline-vertical::before {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  left: 35px;
  width: 2px;
  background: linear-gradient(to bottom, var(--primary), rgba(16, 185, 129, 0.1));
}

.chapter {
  position: relative;
  margin-bottom: var(--space-lg);
}

.chapter:last-child {
  margin-bottom: 0;
}

.chapter__marker {
  position: absolute;
  left: -80px;
  top: 0;
  width: 70px;
  text-align: right;
}

.chapter__year {
  display: inline-block;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--text-muted);
  background: var(--surface);
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
  border: 1px solid var(--border);
  position: relative;
}

.chapter__year::after {
  content: '';
  position: absolute;
  right: -15px;
  top: 50%;
  transform: translateY(-50%);
  width: 10px;
  height: 10px;
  background: var(--primary);
  border-radius: 50%;
  box-shadow: 0 0 10px var(--primary-glow);
}

.chapter--current .chapter__year {
  background: var(--primary);
  color: var(--bg);
  border-color: var(--primary);
}

.chapter--current .chapter__year::after {
  width: 14px;
  height: 14px;
  animation: pulse-slow 2s infinite;
}

.chapter__content {
  padding: var(--space-md);
  border-radius: 1rem;
  border: 1px solid var(--border);
  transition: var(--transition-base);
}

.chapter:hover .chapter__content {
  border-color: var(--primary);
}

.chapter__header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: var(--space-sm);
}

.chapter__icon {
  font-size: 1.5rem;
}

.chapter__header h2 {
  font-size: 1.25rem;
  margin: 0;
}

.chapter__content > p {
  color: var(--text-muted);
  line-height: 1.8;
  margin-bottom: var(--space-sm);
}

.chapter__skills {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.chapter__skills span {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.65rem;
  color: var(--primary);
  background: var(--primary-soft);
  border: 1px solid rgba(16, 185, 129, 0.2);
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
}

/* PHILOSOPHY */
.philosophy {
  padding: var(--space-xl) 0;
  background: var(--surface);
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
}

.philosophy__content {
  max-width: 900px;
  margin: 0 auto;
  padding: var(--space-lg);
  border-radius: 1rem;
  border: 1px solid var(--border);
}

.philosophy__content h2 {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.5rem;
  margin-bottom: var(--space-lg);
}

.philosophy__content h2 svg {
  color: var(--primary);
}

.lessons {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-md);
}

.lesson {
  padding: var(--space-sm);
  background: var(--bg);
  border-radius: 0.75rem;
  border: 1px solid var(--border);
  transition: var(--transition-base);
}

.lesson:hover {
  border-color: var(--primary);
}

.lesson__num {
  display: block;
  font-family: 'JetBrains Mono', monospace;
  font-size: 2rem;
  font-weight: 700;
  color: var(--primary);
  opacity: 0.2;
  margin-bottom: 0.25rem;
}

.lesson h3 {
  font-size: 0.95rem;
  margin-bottom: 0.5rem;
}

.lesson p {
  font-size: 0.8rem;
  color: var(--text-muted);
  line-height: 1.6;
}

/* CTA */
.cta-section {
  padding: var(--space-xl) 0;
}

.cta-box {
  text-align: center;
  padding: var(--space-lg);
  border-radius: 1.5rem;
  border: 1px solid rgba(16, 185, 129, 0.2);
  max-width: 700px;
  margin: 0 auto;
}

.cta-box__title {
  font-size: 1.75rem;
  margin-bottom: var(--space-sm);
}

.cta-box__desc {
  color: var(--text-muted);
  margin-bottom: var(--space-md);
}

.cta-box__buttons {
  display: flex;
  justify-content: center;
  gap: var(--space-sm);
  flex-wrap: wrap;
}

/* RESPONSIVE */
@media (max-width: 768px) {
  .timeline-vertical {
    padding-left: 60px;
  }
  
  .timeline-vertical::before {
    left: 25px;
  }
  
  .chapter__marker {
    left: -60px;
    width: 50px;
  }
  
  .chapter__year {
    font-size: 0.7rem;
    padding: 0.375rem 0.5rem;
  }
  
  .lessons {
    grid-template-columns: 1fr;
  }
}
</style>
