<template>
  <div class="conseil-page">
    <!-- Hero -->
    <section class="hero">
      <div class="container">
        <div class="tag animate-pulse-slow">
          <span>◈</span> VISION 2026
        </div>
        
        <h1 class="hero__title">
          LE CONSEIL DES <span class="text-gradient neon-text">AGENTS</span>
        </h1>
        
        <p class="hero__subtitle">
          Ma vision de l'IA en entreprise : pas un gadget, mais un écosystème d'agents spécialisés<br>
          qui travaillent ensemble pour démultiplier votre productivité.
        </p>
      </div>
    </section>
    
    <!-- Philosophy -->
    <section class="philosophy">
      <div class="container">
        <div class="philosophy__grid">
          <div class="philosophy__text">
            <h2>L'IA n'est pas une baguette magique</h2>
            <p>
              Beaucoup d'entreprises se précipitent sur ChatGPT ou d'autres LLMs généralistes 
              en espérant des miracles. Le résultat ? Des réponses génériques, des hallucinations, 
              et une déception croissante.
            </p>
            <p>
              Ma conviction : <strong>l'IA efficace est spécialisée</strong>. Plutôt qu'un assistant 
              qui fait tout moyennement, je construis des agents experts qui excellent dans leur domaine.
            </p>
          </div>
          <div class="philosophy__visual glass">
            <div class="visual-comparison">
              <div class="comparison-item comparison-item--bad">
                <span class="comparison-icon">❌</span>
                <h4>Approche Naïve</h4>
                <p>"ChatGPT, fais tout pour moi"</p>
                <ul>
                  <li>Réponses génériques</li>
                  <li>Hallucinations fréquentes</li>
                  <li>Pas de contexte métier</li>
                  <li>Données dans le cloud US</li>
                </ul>
              </div>
              <div class="comparison-item comparison-item--good">
                <span class="comparison-icon">✓</span>
                <h4>Conseil des Agents</h4>
                <p>"Chaque agent son expertise"</p>
                <ul>
                  <li>Agents spécialisés</li>
                  <li>RAG sur vos données</li>
                  <li>Contexte métier natif</li>
                  <li>100% souverain</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    
    <!-- Agents Gallery -->
    <section class="agents">
      <div class="container">
        <h2 class="section-title">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
          </svg>
          EXEMPLES D'AGENTS
        </h2>
        
        <div class="agents__grid">
          <div class="agent-card cyber-card">
            <div class="agent-card__avatar">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
              </svg>
            </div>
            <h3>Agent Documentation</h3>
            <p>Répond instantanément aux questions sur vos processus internes en interrogeant votre base documentaire.</p>
            <div class="agent-card__tags">
              <span>RAG</span>
              <span>Obsidian</span>
              <span>Confluence</span>
            </div>
          </div>
          
          <div class="agent-card cyber-card">
            <div class="agent-card__avatar">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                <line x1="3" y1="9" x2="21" y2="9"/>
                <line x1="9" y1="21" x2="9" y2="9"/>
              </svg>
            </div>
            <h3>Agent Analyse</h3>
            <p>Traite vos fichiers Excel/CSV, génère des rapports et détecte des anomalies dans vos données.</p>
            <div class="agent-card__tags">
              <span>Pandas</span>
              <span>Excel</span>
              <span>Reporting</span>
            </div>
          </div>
          
          <div class="agent-card cyber-card">
            <div class="agent-card__avatar">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
            </div>
            <h3>Agent Email</h3>
            <p>Trie, résume et priorise vos emails. Génère des brouillons de réponse adaptés au contexte.</p>
            <div class="agent-card__tags">
              <span>Gmail API</span>
              <span>Outlook</span>
              <span>NLP</span>
            </div>
          </div>
          
          <div class="agent-card cyber-card">
            <div class="agent-card__avatar">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="3"/>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
              </svg>
            </div>
            <h3>Agent Orchestrateur</h3>
            <p>Coordonne les autres agents, route les requêtes et maintient le contexte de conversation.</p>
            <div class="agent-card__tags">
              <span>n8n</span>
              <span>Router</span>
              <span>Memory</span>
            </div>
          </div>
          
          <div class="agent-card cyber-card">
            <div class="agent-card__avatar">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="16 18 22 12 16 6"/>
                <polyline points="8 6 2 12 8 18"/>
              </svg>
            </div>
            <h3>Agent Code Review</h3>
            <p>Analyse votre code, détecte les vulnérabilités et suggère des améliorations selon vos conventions.</p>
            <div class="agent-card__tags">
              <span>Git</span>
              <span>Security</span>
              <span>Best Practices</span>
            </div>
          </div>
          
          <div class="agent-card cyber-card">
            <div class="agent-card__avatar">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
            </div>
            <h3>Agent Support</h3>
            <p>Premier niveau de support client 24/7. Escalade intelligente vers l'humain quand nécessaire.</p>
            <div class="agent-card__tags">
              <span>Discord</span>
              <span>Slack</span>
              <span>Ticketing</span>
            </div>
          </div>
        </div>
      </div>
    </section>
    
    <!-- How it works -->
    <section class="how-it-works">
      <div class="container">
        <h2 class="section-title">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="18" cy="18" r="3"/><circle cx="6" cy="6" r="3"/>
            <path d="M6 21V9a9 9 0 0 0 9 9"/>
          </svg>
          COMMENT ÇA MARCHE
        </h2>
        
        <div class="process-flow glass">
          <div class="flow-step">
            <span class="flow-step__num">01</span>
            <h3>Requête Utilisateur</h3>
            <p>L'utilisateur pose sa question en langage naturel via chat, email ou interface dédiée.</p>
          </div>
          <div class="flow-arrow">→</div>
          <div class="flow-step">
            <span class="flow-step__num">02</span>
            <h3>Orchestrateur</h3>
            <p>Analyse la requête, détermine quel(s) agent(s) peuvent y répondre, et route intelligemment.</p>
          </div>
          <div class="flow-arrow">→</div>
          <div class="flow-step">
            <span class="flow-step__num">03</span>
            <h3>Agent Spécialisé</h3>
            <p>L'agent expert traite la demande avec son contexte RAG et ses outils spécifiques.</p>
          </div>
          <div class="flow-arrow">→</div>
          <div class="flow-step">
            <span class="flow-step__num">04</span>
            <h3>Réponse Enrichie</h3>
            <p>Réponse précise avec sources, actions suggérées et possibilité d'escalade humaine.</p>
          </div>
        </div>
      </div>
    </section>
    
    <!-- Principles -->
    <section class="principles">
      <div class="container">
        <h2 class="section-title">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
          PRINCIPES FONDATEURS
        </h2>
        
        <div class="principles__grid">
          <div class="principle cyber-card">
            <h3>🏠 Souveraineté</h3>
            <p>Vos données restent chez vous. IA locale (Nemotron), hébergement France, zéro dépendance cloud US.</p>
          </div>
          <div class="principle cyber-card">
            <h3>🎯 Spécialisation</h3>
            <p>Chaque agent est optimisé pour une tâche. Mieux vaut 5 experts qu'un généraliste médiocre.</p>
          </div>
          <div class="principle cyber-card">
            <h3>🔗 Interopérabilité</h3>
            <p>Les agents communiquent entre eux et s'intègrent à vos outils existants (ERP, CRM, etc.).</p>
          </div>
          <div class="principle cyber-card">
            <h3>👁️ Transparence</h3>
            <p>Chaque réponse est traçable. Vous savez quel agent a répondu, avec quelles sources.</p>
          </div>
          <div class="principle cyber-card">
            <h3>🚀 Évolutivité</h3>
            <p>Ajoutez de nouveaux agents selon vos besoins. L'architecture grandit avec vous.</p>
          </div>
          <div class="principle cyber-card">
            <h3>🛡️ Fiabilité</h3>
            <p>Validation humaine sur les actions critiques. L'IA augmente, elle ne remplace pas.</p>
          </div>
        </div>
      </div>
    </section>
    
    <!-- CTA -->
    <section class="cta-section">
      <div class="container">
        <div class="cta-box glass">
          <h2 class="cta-box__title">Prêt à construire votre Conseil ?</h2>
          <p class="cta-box__desc">
            Découvrez la stack technique derrière cette vision<br>
            ou discutons directement de votre projet.
          </p>
          <div class="cta-box__buttons">
            <router-link to="/stack-ia" class="btn-outline">
              VOIR LA STACK IA
            </router-link>
            <router-link to="/contact" class="btn-primary">
              DISCUTER DU PROJET
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
// Static page
</script>

<style scoped>
.conseil-page {
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
  max-width: 700px;
  margin: 0 auto;
}

/* PHILOSOPHY */
.philosophy {
  padding: var(--space-lg) 0 var(--space-xl);
}

.philosophy__grid {
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  gap: var(--space-lg);
  align-items: center;
}

.philosophy__text h2 {
  font-size: 1.75rem;
  margin-bottom: var(--space-md);
}

.philosophy__text p {
  color: var(--text-muted);
  line-height: 1.8;
  margin-bottom: var(--space-sm);
}

.philosophy__text strong {
  color: var(--primary);
}

.philosophy__visual {
  padding: var(--space-md);
  border-radius: 1rem;
  border: 1px solid var(--border);
}

.visual-comparison {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-sm);
}

.comparison-item {
  padding: var(--space-sm);
  border-radius: 0.75rem;
  border: 1px solid var(--border);
}

.comparison-item--bad {
  background: rgba(239, 68, 68, 0.05);
  border-color: rgba(239, 68, 68, 0.2);
}

.comparison-item--good {
  background: var(--primary-soft);
  border-color: rgba(16, 185, 129, 0.3);
}

.comparison-icon {
  display: block;
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

.comparison-item h4 {
  font-size: 0.9rem;
  margin-bottom: 0.25rem;
}

.comparison-item--bad h4 {
  color: #EF4444;
}

.comparison-item--good h4 {
  color: var(--primary);
}

.comparison-item > p {
  font-size: 0.75rem;
  color: var(--text-muted);
  margin-bottom: 0.75rem;
}

.comparison-item ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.comparison-item li {
  font-size: 0.7rem;
  color: var(--text-muted);
  padding: 0.25rem 0;
  padding-left: 1rem;
  position: relative;
}

.comparison-item li::before {
  content: '•';
  position: absolute;
  left: 0;
}

.comparison-item--bad li::before {
  color: #EF4444;
}

.comparison-item--good li::before {
  color: var(--primary);
}

/* AGENTS */
.agents {
  padding: var(--space-xl) 0;
  background: var(--surface);
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
}

.section-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.25rem;
  margin-bottom: var(--space-lg);
}

.section-title svg {
  color: var(--primary);
}

.agents__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-md);
}

.agent-card {
  padding: var(--space-md);
}

.agent-card__avatar {
  width: 56px;
  height: 56px;
  background: var(--primary-soft);
  border: 1px solid rgba(16, 185, 129, 0.2);
  border-radius: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--primary);
  margin-bottom: var(--space-sm);
}

.agent-card h3 {
  font-size: 1rem;
  margin-bottom: 0.5rem;
}

.agent-card > p {
  font-size: 0.8rem;
  color: var(--text-muted);
  line-height: 1.6;
  margin-bottom: var(--space-sm);
}

.agent-card__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.agent-card__tags span {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.6rem;
  color: var(--text-muted);
  background: var(--bg);
  border: 1px solid var(--border);
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
}

/* HOW IT WORKS */
.how-it-works {
  padding: var(--space-xl) 0;
}

.process-flow {
  display: flex;
  align-items: stretch;
  gap: var(--space-sm);
  padding: var(--space-md);
  border-radius: 1rem;
  border: 1px solid var(--border);
  overflow-x: auto;
}

.flow-step {
  flex: 1;
  min-width: 180px;
  padding: var(--space-sm);
  background: var(--bg);
  border-radius: 0.75rem;
  border: 1px solid var(--border);
  text-align: center;
}

.flow-step__num {
  display: block;
  font-family: 'JetBrains Mono', monospace;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--primary);
  opacity: 0.3;
  margin-bottom: 0.25rem;
}

.flow-step h3 {
  font-size: 0.85rem;
  margin-bottom: 0.5rem;
}

.flow-step p {
  font-size: 0.75rem;
  color: var(--text-muted);
  line-height: 1.5;
}

.flow-arrow {
  display: flex;
  align-items: center;
  font-size: 1.5rem;
  color: var(--primary);
  opacity: 0.5;
}

/* PRINCIPLES */
.principles {
  padding: var(--space-xl) 0;
  background: var(--surface);
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
}

.principles__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-sm);
}

.principle {
  padding: var(--space-md);
}

.principle h3 {
  font-size: 1rem;
  margin-bottom: 0.5rem;
}

.principle p {
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
  line-height: 1.8;
}

.cta-box__buttons {
  display: flex;
  justify-content: center;
  gap: var(--space-sm);
  flex-wrap: wrap;
}

/* RESPONSIVE */
@media (max-width: 1024px) {
  .agents__grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .principles__grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .philosophy__grid {
    grid-template-columns: 1fr;
  }
  
  .agents__grid {
    grid-template-columns: 1fr;
  }
  
  .principles__grid {
    grid-template-columns: 1fr;
  }
  
  .process-flow {
    flex-direction: column;
  }
  
  .flow-arrow {
    transform: rotate(90deg);
    justify-content: center;
  }
}
</style>
