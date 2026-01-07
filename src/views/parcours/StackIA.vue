<template>
  <div class="stack-page">
    <!-- Hero -->
    <section class="hero">
      <div class="container">
        <div class="tag animate-pulse-slow">
          <span>⚡</span> INFRASTRUCTURE
        </div>
        
        <h1 class="hero__title">
          STACK <span class="text-gradient neon-text">IA SOUVERAINE</span>
        </h1>
        
        <p class="hero__subtitle">
          Zéro dépendance cloud US. 100% contrôlable. Déployable on-premise ou sur serveur dédié.<br>
          Voici les briques technologiques que j'utilise et que je déploie pour mes clients.
        </p>
      </div>
    </section>
    
    <!-- Architecture Overview -->
    <section class="architecture">
      <div class="container">
        <div class="architecture__diagram glass">
          <div class="diagram-layer">
            <span class="layer-label">INTERFACE</span>
            <div class="layer-items">
              <div class="tech-badge">Discord Bots</div>
              <div class="tech-badge">Web UI</div>
              <div class="tech-badge">API REST</div>
              <div class="tech-badge">Slack</div>
            </div>
          </div>
          
          <div class="diagram-arrow">↓</div>
          
          <div class="diagram-layer">
            <span class="layer-label">ORCHESTRATION</span>
            <div class="layer-items">
              <div class="tech-badge tech-badge--primary">n8n</div>
              <div class="tech-badge">Symfony 8</div>
              <div class="tech-badge">WebSocket</div>
            </div>
          </div>
          
          <div class="diagram-arrow">↓</div>
          
          <div class="diagram-layer">
            <span class="layer-label">INTELLIGENCE</span>
            <div class="layer-items">
              <div class="tech-badge tech-badge--primary">Nemotron (Local)</div>
              <div class="tech-badge">OpenWebUI</div>
              <div class="tech-badge">ChromaDB (RAG)</div>
            </div>
          </div>
          
          <div class="diagram-arrow">↓</div>
          
          <div class="diagram-layer">
            <span class="layer-label">DONNÉES</span>
            <div class="layer-items">
              <div class="tech-badge">PostgreSQL</div>
              <div class="tech-badge">Obsidian Vault</div>
              <div class="tech-badge">S3 Compatible</div>
            </div>
          </div>
          
          <div class="diagram-arrow">↓</div>
          
          <div class="diagram-layer">
            <span class="layer-label">INFRASTRUCTURE</span>
            <div class="layer-items">
              <div class="tech-badge tech-badge--primary">Docker</div>
              <div class="tech-badge">Portainer</div>
              <div class="tech-badge">Traefik</div>
              <div class="tech-badge">Hébergement FR</div>
            </div>
          </div>
        </div>
      </div>
    </section>
    
    <!-- Tech Details -->
    <section class="tech-details">
      <div class="container">
        <h2 class="section-title">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="4" y="4" width="16" height="16" rx="2" ry="2"/>
            <rect x="9" y="9" width="6" height="6"/>
            <line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/>
            <line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/>
            <line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="14" x2="23" y2="14"/>
            <line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="14" x2="4" y2="14"/>
          </svg>
          DÉTAIL DES TECHNOLOGIES
        </h2>
        
        <div class="tech-grid">
          <!-- Nemotron -->
          <div class="tech-card cyber-card">
            <div class="tech-card__header">
              <div class="tech-card__icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"/>
                  <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"/>
                </svg>
              </div>
              <div>
                <h3>Nemotron / Ollama</h3>
                <span class="tech-card__category">LLM LOCAL</span>
              </div>
            </div>
            <p>
              Modèle de langage NVIDIA déployé localement via Ollama. Performances comparables à GPT-4 
              pour les tâches métier, sans envoyer vos données dans le cloud.
            </p>
            <div class="tech-card__specs">
              <div class="spec">
                <span class="spec__label">Modèle</span>
                <span class="spec__value">Nemotron-mini / Mistral</span>
              </div>
              <div class="spec">
                <span class="spec__label">VRAM</span>
                <span class="spec__value">8-24 GB selon modèle</span>
              </div>
              <div class="spec">
                <span class="spec__label">Latence</span>
                <span class="spec__value">< 500ms (local)</span>
              </div>
            </div>
          </div>
          
          <!-- n8n -->
          <div class="tech-card cyber-card">
            <div class="tech-card__header">
              <div class="tech-card__icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="18" cy="18" r="3"/><circle cx="6" cy="6" r="3"/>
                  <path d="M6 21V9a9 9 0 0 0 9 9"/>
                </svg>
              </div>
              <div>
                <h3>n8n</h3>
                <span class="tech-card__category">ORCHESTRATION</span>
              </div>
            </div>
            <p>
              Plateforme d'automatisation low-code self-hosted. Connecte les APIs, orchestre les agents, 
              gère les workflows complexes. Alternative souveraine à Zapier/Make.
            </p>
            <div class="tech-card__specs">
              <div class="spec">
                <span class="spec__label">Nodes</span>
                <span class="spec__value">400+ intégrations</span>
              </div>
              <div class="spec">
                <span class="spec__label">Deploy</span>
                <span class="spec__value">Docker self-hosted</span>
              </div>
              <div class="spec">
                <span class="spec__label">Licence</span>
                <span class="spec__value">Fair-code (gratuit)</span>
              </div>
            </div>
          </div>
          
          <!-- ChromaDB -->
          <div class="tech-card cyber-card">
            <div class="tech-card__header">
              <div class="tech-card__icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <ellipse cx="12" cy="5" rx="9" ry="3"/>
                  <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/>
                  <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>
                </svg>
              </div>
              <div>
                <h3>ChromaDB</h3>
                <span class="tech-card__category">VECTOR DB</span>
              </div>
            </div>
            <p>
              Base de données vectorielle pour le RAG (Retrieval-Augmented Generation). 
              Indexe vos documents et permet aux agents de "chercher" dans vos données.
            </p>
            <div class="tech-card__specs">
              <div class="spec">
                <span class="spec__label">Embedding</span>
                <span class="spec__value">Local ou API</span>
              </div>
              <div class="spec">
                <span class="spec__label">Format</span>
                <span class="spec__value">PDF, MD, TXT, DOCX</span>
              </div>
              <div class="spec">
                <span class="spec__label">Recherche</span>
                <span class="spec__value">Sémantique + Keywords</span>
              </div>
            </div>
          </div>
          
          <!-- OpenWebUI -->
          <div class="tech-card cyber-card">
            <div class="tech-card__header">
              <div class="tech-card__icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                  <line x1="3" y1="9" x2="21" y2="9"/>
                  <line x1="9" y1="21" x2="9" y2="9"/>
                </svg>
              </div>
              <div>
                <h3>OpenWebUI</h3>
                <span class="tech-card__category">INTERFACE</span>
              </div>
            </div>
            <p>
              Interface utilisateur moderne pour interagir avec les LLMs locaux. 
              Multi-modèles, historique, RAG intégré, et gestion d'équipe.
            </p>
            <div class="tech-card__specs">
              <div class="spec">
                <span class="spec__label">Auth</span>
                <span class="spec__value">OAuth / LDAP</span>
              </div>
              <div class="spec">
                <span class="spec__label">Features</span>
                <span class="spec__value">Chat, RAG, Tools</span>
              </div>
              <div class="spec">
                <span class="spec__label">Deploy</span>
                <span class="spec__value">Docker</span>
              </div>
            </div>
          </div>
          
          <!-- Docker -->
          <div class="tech-card cyber-card">
            <div class="tech-card__header">
              <div class="tech-card__icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
                </svg>
              </div>
              <div>
                <h3>Docker / Portainer</h3>
                <span class="tech-card__category">CONTENEURISATION</span>
              </div>
            </div>
            <p>
              Toute la stack est containerisée. Déploiement reproductible, isolation des services, 
              mise à jour sans downtime. Portainer pour la gestion visuelle.
            </p>
            <div class="tech-card__specs">
              <div class="spec">
                <span class="spec__label">Compose</span>
                <span class="spec__value">Multi-services</span>
              </div>
              <div class="spec">
                <span class="spec__label">Volumes</span>
                <span class="spec__value">Persistants</span>
              </div>
              <div class="spec">
                <span class="spec__label">Network</span>
                <span class="spec__value">Isolé + Traefik</span>
              </div>
            </div>
          </div>
          
          <!-- Obsidian -->
          <div class="tech-card cyber-card">
            <div class="tech-card__header">
              <div class="tech-card__icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
                </svg>
              </div>
              <div>
                <h3>Obsidian</h3>
                <span class="tech-card__category">KNOWLEDGE BASE</span>
              </div>
            </div>
            <p>
              Base de connaissances en Markdown. Liens bidirectionnels, graphe de connaissances, 
              et surtout : fichiers locaux exploitables par le RAG.
            </p>
            <div class="tech-card__specs">
              <div class="spec">
                <span class="spec__label">Format</span>
                <span class="spec__value">Markdown natif</span>
              </div>
              <div class="spec">
                <span class="spec__label">Sync</span>
                <span class="spec__value">Git / Self-hosted</span>
              </div>
              <div class="spec">
                <span class="spec__label">RAG</span>
                <span class="spec__value">MCP compatible</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    
    <!-- Why Local -->
    <section class="why-local">
      <div class="container">
        <h2 class="section-title">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
          POURQUOI LE LOCAL ?
        </h2>
        
        <div class="reasons-grid">
          <div class="reason glass">
            <span class="reason__icon">🔒</span>
            <h3>Confidentialité</h3>
            <p>Vos données sensibles (contrats, clients, stratégie) ne quittent jamais votre infrastructure. Zéro risque de fuite.</p>
          </div>
          
          <div class="reason glass">
            <span class="reason__icon">📜</span>
            <h3>Conformité RGPD</h3>
            <p>Pas de transfert vers les US. Hébergement France. Traçabilité complète des traitements.</p>
          </div>
          
          <div class="reason glass">
            <span class="reason__icon">💰</span>
            <h3>Coût Prédictible</h3>
            <p>Pas de facturation à l'usage qui explose. Un serveur = un coût fixe, quelle que soit l'utilisation.</p>
          </div>
          
          <div class="reason glass">
            <span class="reason__icon">⚡</span>
            <h3>Latence Réduite</h3>
            <p>Pas d'aller-retour vers le cloud. Réponses en millisecondes pour une UX fluide.</p>
          </div>
          
          <div class="reason glass">
            <span class="reason__icon">🎛️</span>
            <h3>Contrôle Total</h3>
            <p>Vous choisissez le modèle, les paramètres, les données d'entraînement. Pas de boîte noire.</p>
          </div>
          
          <div class="reason glass">
            <span class="reason__icon">🔌</span>
            <h3>Indépendance</h3>
            <p>Pas de dépendance à OpenAI, Google ou Microsoft. Votre IA fonctionne même si leurs services tombent.</p>
          </div>
        </div>
      </div>
    </section>
    
    <!-- Requirements -->
    <section class="requirements">
      <div class="container">
        <div class="requirements__content glass">
          <h2>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="2" y="2" width="20" height="8" rx="2" ry="2"/>
              <rect x="2" y="14" width="20" height="8" rx="2" ry="2"/>
              <line x1="6" y1="6" x2="6.01" y2="6"/>
              <line x1="6" y1="18" x2="6.01" y2="18"/>
            </svg>
            Prérequis Matériels
          </h2>
          
          <div class="requirements__grid">
            <div class="requirement">
              <h4>Configuration Minimale</h4>
              <ul>
                <li>CPU : 8 cores</li>
                <li>RAM : 32 GB</li>
                <li>GPU : RTX 3060 (12GB VRAM)</li>
                <li>SSD : 500 GB NVMe</li>
              </ul>
              <span class="requirement__note">Pour 1-5 utilisateurs simultanés</span>
            </div>
            
            <div class="requirement">
              <h4>Configuration Recommandée</h4>
              <ul>
                <li>CPU : 16 cores</li>
                <li>RAM : 64 GB</li>
                <li>GPU : RTX 4090 (24GB VRAM)</li>
                <li>SSD : 2 TB NVMe</li>
              </ul>
              <span class="requirement__note">Pour 10-50 utilisateurs simultanés</span>
            </div>
            
            <div class="requirement">
              <h4>Alternative Cloud Souverain</h4>
              <ul>
                <li>VPS GPU dédié</li>
                <li>Hébergeur français</li>
                <li>Scaleway / OVH / Infomaniak</li>
                <li>À partir de 200€/mois</li>
              </ul>
              <span class="requirement__note">Sans investissement matériel initial</span>
            </div>
          </div>
        </div>
      </div>
    </section>
    
    <!-- CTA -->
    <section class="cta-section">
      <div class="container">
        <div class="cta-box glass">
          <h2 class="cta-box__title">Prêt à déployer votre stack souveraine ?</h2>
          <p class="cta-box__desc">
            Je vous accompagne de l'audit à la mise en production.<br>
            Formation équipe incluse.
          </p>
          <router-link to="/contact" class="btn-primary">
            PLANIFIER UN AUDIT
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
            </svg>
          </router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
// Static page
</script>

<style scoped>
.stack-page {
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

/* ARCHITECTURE */
.architecture {
  padding: var(--space-lg) 0;
}

.architecture__diagram {
  max-width: 800px;
  margin: 0 auto;
  padding: var(--space-lg);
  border-radius: 1rem;
  border: 1px solid var(--border);
}

.diagram-layer {
  margin-bottom: var(--space-sm);
}

.layer-label {
  display: block;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.65rem;
  color: var(--text-dark);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 0.5rem;
}

.layer-items {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  justify-content: center;
}

.tech-badge {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.75rem;
  color: var(--text-main);
  background: var(--surface-light);
  border: 1px solid var(--border);
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  transition: var(--transition-base);
}

.tech-badge:hover {
  border-color: var(--primary);
}

.tech-badge--primary {
  background: var(--primary-soft);
  border-color: rgba(16, 185, 129, 0.3);
  color: var(--primary);
}

.diagram-arrow {
  text-align: center;
  font-size: 1.5rem;
  color: var(--primary);
  opacity: 0.3;
  margin: var(--space-xs) 0;
}

/* TECH DETAILS */
.tech-details {
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

.tech-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-md);
}

.tech-card {
  padding: var(--space-md);
}

.tech-card__header {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: var(--space-sm);
}

.tech-card__icon {
  width: 56px;
  height: 56px;
  background: var(--primary-soft);
  border: 1px solid rgba(16, 185, 129, 0.2);
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--primary);
  flex-shrink: 0;
}

.tech-card__header h3 {
  font-size: 1.1rem;
  margin: 0;
}

.tech-card__category {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.6rem;
  color: var(--primary);
  text-transform: uppercase;
}

.tech-card > p {
  font-size: 0.85rem;
  color: var(--text-muted);
  line-height: 1.7;
  margin-bottom: var(--space-sm);
}

.tech-card__specs {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding-top: var(--space-sm);
  border-top: 1px solid var(--border);
}

.spec {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.spec__label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.65rem;
  color: var(--text-dark);
}

.spec__value {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.7rem;
  color: var(--text-muted);
}

/* WHY LOCAL */
.why-local {
  padding: var(--space-xl) 0;
}

.reasons-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-sm);
}

.reason {
  padding: var(--space-md);
  border-radius: 1rem;
  border: 1px solid var(--border);
  transition: var(--transition-base);
}

.reason:hover {
  border-color: var(--primary);
}

.reason__icon {
  display: block;
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.reason h3 {
  font-size: 1rem;
  margin-bottom: 0.5rem;
}

.reason p {
  font-size: 0.8rem;
  color: var(--text-muted);
  line-height: 1.6;
}

/* REQUIREMENTS */
.requirements {
  padding: var(--space-xl) 0;
  background: var(--surface);
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
}

.requirements__content {
  max-width: 1000px;
  margin: 0 auto;
  padding: var(--space-lg);
  border-radius: 1rem;
  border: 1px solid var(--border);
}

.requirements__content h2 {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.25rem;
  margin-bottom: var(--space-lg);
}

.requirements__content h2 svg {
  color: var(--primary);
}

.requirements__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-md);
}

.requirement {
  padding: var(--space-sm);
  background: var(--bg);
  border-radius: 0.75rem;
  border: 1px solid var(--border);
}

.requirement h4 {
  font-size: 0.9rem;
  margin-bottom: var(--space-sm);
  color: var(--primary);
}

.requirement ul {
  list-style: none;
  padding: 0;
  margin: 0 0 var(--space-sm) 0;
}

.requirement li {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.75rem;
  color: var(--text-muted);
  padding: 0.25rem 0;
}

.requirement__note {
  display: block;
  font-size: 0.7rem;
  color: var(--text-dark);
  font-style: italic;
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

/* RESPONSIVE */
@media (max-width: 1024px) {
  .tech-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .reasons-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .requirements__grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .tech-grid {
    grid-template-columns: 1fr;
  }
  
  .reasons-grid {
    grid-template-columns: 1fr;
  }
}
</style>
