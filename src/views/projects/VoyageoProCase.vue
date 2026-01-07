<template>
  <div class="case-study-page">
    <!-- Hero Section -->
    <section class="case-hero" aria-labelledby="case-title">
      <div class="hero-bg" aria-hidden="true">
        <div class="globe-grid"></div>
        <div class="route-lines">
          <svg viewBox="0 0 1200 600" preserveAspectRatio="none">
            <path class="route route-1" d="M100,300 Q400,100 600,250 T1100,200" />
            <path class="route route-2" d="M50,400 Q300,200 500,350 T950,300" />
            <path class="route route-3" d="M200,500 Q500,300 800,400 T1150,350" />
          </svg>
        </div>
        <div class="destination-dots">
          <span class="dot dot-1"></span>
          <span class="dot dot-2"></span>
          <span class="dot dot-3"></span>
          <span class="dot dot-4"></span>
          <span class="dot dot-5"></span>
        </div>
      </div>

      <div class="container">
        <nav class="breadcrumb" aria-label="Fil d'Ariane">
          <router-link to="/">Accueil</router-link>
          <span>/</span>
          <router-link to="/projets">Projets</router-link>
          <span>/</span>
          <span>VoyageoPro</span>
        </nav>

        <div class="case-badge reveal">
          <span class="badge-icon">✈️</span>
          <span class="badge-text">ÉTUDE DE CAS</span>
        </div>

        <h1 id="case-title" class="case-title reveal">
          <span class="title-client">VOYAGEO PRO</span>
          <span class="title-project">Plateforme de réservation B2B</span>
        </h1>

        <p class="case-intro reveal">
          Transformation digitale d'une agence de voyage professionnelle.
          De la gestion Excel à une plateforme SaaS moderne et automatisée.
        </p>

        <div class="case-meta reveal">
          <div class="meta-item">
            <span class="meta-label">Secteur</span>
            <span class="meta-value">Tourisme B2B</span>
          </div>
          <div class="meta-item">
            <span class="meta-label">Durée</span>
            <span class="meta-value">4 mois</span>
          </div>
          <div class="meta-item">
            <span class="meta-label">Équipe</span>
            <span class="meta-value">1 dev + 1 PO client</span>
          </div>
          <div class="meta-item">
            <span class="meta-label">Budget</span>
            <span class="meta-value">35-50K €</span>
          </div>
        </div>
      </div>
    </section>

    <!-- KPIs Section -->
    <section class="case-kpis" aria-labelledby="kpi-title">
      <div class="container">
        <h2 id="kpi-title" class="section-title reveal">Résultats Mesurés</h2>
        
        <div class="kpis-grid">
          <div class="kpi-card kpi-card--primary reveal">
            <div class="kpi-icon">⏱️</div>
            <div class="kpi-value">
              <span class="value-number">-70%</span>
            </div>
            <div class="kpi-label">Temps de traitement devis</div>
            <div class="kpi-detail">De 45min à 12min par demande</div>
          </div>
          
          <div class="kpi-card reveal">
            <div class="kpi-icon">📈</div>
            <div class="kpi-value">
              <span class="value-number">+180%</span>
            </div>
            <div class="kpi-label">Volume de devis traités</div>
            <div class="kpi-detail">De 50 à 140 devis/semaine</div>
          </div>
          
          <div class="kpi-card reveal">
            <div class="kpi-icon">💰</div>
            <div class="kpi-value">
              <span class="value-number">+45%</span>
            </div>
            <div class="kpi-label">Taux de conversion</div>
            <div class="kpi-detail">Grâce aux relances automatisées</div>
          </div>
          
          <div class="kpi-card reveal">
            <div class="kpi-icon">🎯</div>
            <div class="kpi-value">
              <span class="value-number">0</span>
            </div>
            <div class="kpi-label">Erreurs de facturation</div>
            <div class="kpi-detail">Calculs automatisés et vérifiés</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Context Section -->
    <section class="case-context" aria-labelledby="context-title">
      <div class="container">
        <div class="context-grid">
          <div class="context-content">
            <h2 id="context-title" class="section-title reveal">Le Contexte</h2>
            
            <div class="client-profile reveal">
              <h3>Le Client</h3>
              <p>
                <strong>VoyageoPro</strong> est une agence de voyage B2B basée à Lyon, 
                spécialisée dans l'organisation de séminaires, incentives et voyages d'affaires 
                pour les entreprises du CAC40 et ETI.
              </p>
              <ul class="profile-stats">
                <li><span class="stat-num">12</span> collaborateurs</li>
                <li><span class="stat-num">850</span> clients entreprises</li>
                <li><span class="stat-num">3.2M€</span> CA annuel</li>
                <li><span class="stat-num">15</span> ans d'existence</li>
              </ul>
            </div>

            <div class="pain-points reveal">
              <h3>Les Problèmes Identifiés</h3>
              <div class="problem-list">
                <div class="problem-item">
                  <span class="problem-icon">📊</span>
                  <div class="problem-content">
                    <h4>Gestion Excel chaotique</h4>
                    <p>15 fichiers Excel interconnectés, données dupliquées, erreurs fréquentes de copier-coller</p>
                  </div>
                </div>
                <div class="problem-item">
                  <span class="problem-icon">⏰</span>
                  <div class="problem-content">
                    <h4>Processus manuel chronophage</h4>
                    <p>45 minutes par devis, recherche manuelle des tarifs fournisseurs, calculs à la main</p>
                  </div>
                </div>
                <div class="problem-item">
                  <span class="problem-icon">📧</span>
                  <div class="problem-content">
                    <h4>Suivi client inexistant</h4>
                    <p>Pas de CRM, relances oubliées, historique client éparpillé dans les emails</p>
                  </div>
                </div>
                <div class="problem-item">
                  <span class="problem-icon">🔒</span>
                  <div class="problem-content">
                    <h4>Données non sécurisées</h4>
                    <p>Fichiers sur Dropbox personnel, pas de sauvegarde, RGPD non conforme</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="context-visual reveal">
            <div class="before-after">
              <div class="before-card">
                <span class="card-label">AVANT</span>
                <div class="card-visual">
                  <div class="excel-chaos">
                    <div class="excel-file excel-file--1">📊 Clients_2024_v3_FINAL.xlsx</div>
                    <div class="excel-file excel-file--2">📊 Devis_backup_old.xlsx</div>
                    <div class="excel-file excel-file--3">📊 Tarifs_hotels_MAJ.xlsx</div>
                    <div class="excel-file excel-file--4">📊 Copie de Factures.xlsx</div>
                    <div class="excel-file excel-file--5">📊 URGENT_semaine12.xlsx</div>
                  </div>
                </div>
                <ul class="card-issues">
                  <li>❌ 15+ fichiers Excel</li>
                  <li>❌ Données dupliquées</li>
                  <li>❌ Pas de versioning</li>
                  <li>❌ Calculs manuels</li>
                </ul>
              </div>

              <div class="arrow-transform" aria-hidden="true">
                <span>→</span>
              </div>

              <div class="after-card">
                <span class="card-label">APRÈS</span>
                <div class="card-visual">
                  <div class="platform-preview">
                    <div class="preview-header">
                      <span class="preview-dot"></span>
                      <span class="preview-dot"></span>
                      <span class="preview-dot"></span>
                      <span class="preview-title">VoyageoPro Platform</span>
                    </div>
                    <div class="preview-content">
                      <div class="preview-sidebar"></div>
                      <div class="preview-main">
                        <div class="preview-card"></div>
                        <div class="preview-card"></div>
                        <div class="preview-card"></div>
                      </div>
                    </div>
                  </div>
                </div>
                <ul class="card-benefits">
                  <li>✅ Base de données unique</li>
                  <li>✅ Interface unifiée</li>
                  <li>✅ Calculs automatiques</li>
                  <li>✅ Sauvegarde temps réel</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Solution Section -->
    <section class="case-solution" aria-labelledby="solution-title">
      <div class="container">
        <h2 id="solution-title" class="section-title reveal">La Solution Développée</h2>
        
        <div class="solution-overview reveal">
          <p class="solution-intro">
            Une plateforme SaaS sur-mesure couvrant l'ensemble du cycle commercial : 
            de la demande client à la facturation, en passant par la création de devis 
            et le suivi des réservations.
          </p>
        </div>

        <div class="modules-grid">
          <article class="module-card reveal">
            <div class="module-header">
              <span class="module-icon">📋</span>
              <span class="module-num">01</span>
            </div>
            <h3>Gestion des Demandes</h3>
            <p>Formulaire intelligent de qualification des besoins clients avec scoring automatique.</p>
            <ul class="module-features">
              <li>Formulaire multi-étapes</li>
              <li>Scoring lead automatique</li>
              <li>Assignation commerciale</li>
              <li>Notifications temps réel</li>
            </ul>
            <div class="module-tech">
              <span>Vue 3</span>
              <span>Symfony Forms</span>
              <span>WebSocket</span>
            </div>
          </article>

          <article class="module-card reveal">
            <div class="module-header">
              <span class="module-icon">💼</span>
              <span class="module-num">02</span>
            </div>
            <h3>Générateur de Devis</h3>
            <p>Création de devis professionnels en quelques clics avec calcul automatique des marges.</p>
            <ul class="module-features">
              <li>Modèles personnalisables</li>
              <li>Catalogue produits intégré</li>
              <li>Calcul marges temps réel</li>
              <li>Export PDF personnalisé</li>
            </ul>
            <div class="module-tech">
              <span>DomPDF</span>
              <span>API Platform</span>
              <span>Twig</span>
            </div>
          </article>

          <article class="module-card reveal">
            <div class="module-header">
              <span class="module-icon">🏨</span>
              <span class="module-num">03</span>
            </div>
            <h3>Catalogue Fournisseurs</h3>
            <p>Base centralisée des hôtels, transporteurs et prestataires avec tarifs négociés.</p>
            <ul class="module-features">
              <li>800+ fournisseurs</li>
              <li>Grilles tarifaires dynamiques</li>
              <li>Disponibilités temps réel</li>
              <li>Comparateur intégré</li>
            </ul>
            <div class="module-tech">
              <span>PostgreSQL</span>
              <span>Redis Cache</span>
              <span>API REST</span>
            </div>
          </article>

          <article class="module-card reveal">
            <div class="module-header">
              <span class="module-icon">📊</span>
              <span class="module-num">04</span>
            </div>
            <h3>Tableau de Bord & Analytique</h3>
            <p>Tableaux de bord en temps réel pour piloter l'activité commerciale.</p>
            <ul class="module-features">
              <li>KPIs temps réel</li>
              <li>Pipeline commercial</li>
              <li>Prévisionnel CA</li>
              <li>Rapports automatisés</li>
            </ul>
            <div class="module-tech">
              <span>Chart.js</span>
              <span>Doctrine</span>
              <span>Tâches Cron</span>
            </div>
          </article>

          <article class="module-card reveal">
            <div class="module-header">
              <span class="module-icon">🤖</span>
              <span class="module-num">05</span>
            </div>
            <h3>Automatisations</h3>
            <p>Workflows automatisés pour les relances, rappels et notifications.</p>
            <ul class="module-features">
              <li>Relances J+3, J+7, J+14</li>
              <li>Alertes échéances</li>
              <li>Emails personnalisés</li>
              <li>SMS rappels voyage</li>
            </ul>
            <div class="module-tech">
              <span>n8n</span>
              <span>Symfony Messenger</span>
              <span>Twilio</span>
            </div>
          </article>

          <article class="module-card reveal">
            <div class="module-header">
              <span class="module-icon">💳</span>
              <span class="module-num">06</span>
            </div>
            <h3>Facturation</h3>
            <p>Génération automatique des factures et suivi des paiements.</p>
            <ul class="module-features">
              <li>Factures conformes</li>
              <li>Relances impayés</li>
              <li>Export comptable</li>
              <li>Intégration Stripe</li>
            </ul>
            <div class="module-tech">
              <span>Stripe API</span>
              <span>PDF</span>
              <span>Webhooks</span>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- Architecture Section -->
    <section class="case-architecture" aria-labelledby="archi-title">
      <div class="container">
        <h2 id="archi-title" class="section-title reveal">Architecture Technique</h2>

        <div class="archi-diagram reveal">
          <div class="archi-layer archi-layer--frontend">
            <h3>Interface Utilisateur</h3>
            <div class="layer-content">
              <div class="tech-block">
                <span class="tech-icon">💚</span>
                <span class="tech-name">Vue 3</span>
                <span class="tech-detail">Composition API</span>
              </div>
              <div class="tech-block">
                <span class="tech-icon">🎨</span>
                <span class="tech-name">Tailwind CSS</span>
                <span class="tech-detail">Système de design</span>
              </div>
              <div class="tech-block">
                <span class="tech-icon">📊</span>
                <span class="tech-name">Chart.js</span>
                <span class="tech-detail">Visualisation</span>
              </div>
            </div>
          </div>

          <div class="archi-connector" aria-hidden="true">
            <span class="connector-label">API REST + WebSocket</span>
          </div>

          <div class="archi-layer archi-layer--backend">
            <h3>Serveur Applicatif</h3>
            <div class="layer-content">
              <div class="tech-block">
                <span class="tech-icon">🎵</span>
                <span class="tech-name">Symfony 7</span>
                <span class="tech-detail">API Platform</span>
              </div>
              <div class="tech-block">
                <span class="tech-icon">🐘</span>
                <span class="tech-name">PHP 8.3</span>
                <span class="tech-detail">Typé, Attributs</span>
              </div>
              <div class="tech-block">
                <span class="tech-icon">📬</span>
                <span class="tech-name">Messenger</span>
                <span class="tech-detail">Tâches Asynchrones</span>
              </div>
            </div>
          </div>

          <div class="archi-connector" aria-hidden="true">
            <span class="connector-label">Doctrine ORM</span>
          </div>

          <div class="archi-layer archi-layer--data">
            <h3>Données & Services</h3>
            <div class="layer-content">
              <div class="tech-block">
                <span class="tech-icon">🐘</span>
                <span class="tech-name">PostgreSQL</span>
                <span class="tech-detail">Base principale</span>
              </div>
              <div class="tech-block">
                <span class="tech-icon">⚡</span>
                <span class="tech-name">Redis</span>
                <span class="tech-detail">Cache & Sessions</span>
              </div>
              <div class="tech-block">
                <span class="tech-icon">🔄</span>
                <span class="tech-name">n8n</span>
                <span class="tech-detail">Workflows</span>
              </div>
            </div>
          </div>

          <div class="archi-connector" aria-hidden="true">
            <span class="connector-label">Docker Compose</span>
          </div>

          <div class="archi-layer archi-layer--infra">
            <h3>Infrastructure</h3>
            <div class="layer-content">
              <div class="tech-block">
                <span class="tech-icon">🐳</span>
                <span class="tech-name">Docker</span>
                <span class="tech-detail">Conteneurisation</span>
              </div>
              <div class="tech-block">
                <span class="tech-icon">🔒</span>
                <span class="tech-name">SSL/TLS</span>
                <span class="tech-detail">Let's Encrypt</span>
              </div>
              <div class="tech-block">
                <span class="tech-icon">🇫🇷</span>
                <span class="tech-name">OVH</span>
                <span class="tech-detail">Hébergement FR</span>
              </div>
            </div>
          </div>
        </div>

        <div class="archi-highlights reveal">
          <div class="highlight-item">
            <span class="highlight-icon">🔐</span>
            <h4>Conforme RGPD</h4>
            <p>Données hébergées en France, chiffrement AES-256, logs d'audit</p>
          </div>
          <div class="highlight-item">
            <span class="highlight-icon">📱</span>
            <h4>Design Responsive</h4>
            <p>Interface adaptée desktop, tablette et mobile pour les commerciaux terrain</p>
          </div>
          <div class="highlight-item">
            <span class="highlight-icon">⚡</span>
            <h4>Performance</h4>
            <p>Temps de chargement &lt; 2s, cache intelligent, chargement différé</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Timeline Section -->
    <section class="case-timeline" aria-labelledby="timeline-title">
      <div class="container">
        <h2 id="timeline-title" class="section-title reveal">Déroulement du Projet</h2>

        <div class="timeline">
          <div class="timeline-item timeline-item--complete reveal">
            <div class="timeline-marker">
              <span class="marker-icon">🎯</span>
            </div>
            <div class="timeline-content">
              <span class="timeline-phase">Phase 1</span>
              <h3>Découverte & Audit</h3>
              <span class="timeline-duration">2 semaines</span>
              <ul>
                <li>Audit des processus existants</li>
                <li>Entretiens utilisateurs (8 collaborateurs)</li>
                <li>Cartographie des flux de données</li>
                <li>Cahier des charges fonctionnel</li>
              </ul>
            </div>
          </div>

          <div class="timeline-item timeline-item--complete reveal">
            <div class="timeline-marker">
              <span class="marker-icon">✏️</span>
            </div>
            <div class="timeline-content">
              <span class="timeline-phase">Phase 2</span>
              <h3>Design & Prototypage</h3>
              <span class="timeline-duration">3 semaines</span>
              <ul>
                <li>Maquettes des parcours clés</li>
                <li>Système de design personnalisé</li>
                <li>Prototype interactif Figma</li>
                <li>Validation utilisateurs</li>
              </ul>
            </div>
          </div>

          <div class="timeline-item timeline-item--complete reveal">
            <div class="timeline-marker">
              <span class="marker-icon">⚙️</span>
            </div>
            <div class="timeline-content">
              <span class="timeline-phase">Phase 3</span>
              <h3>Développement MVP</h3>
              <span class="timeline-duration">8 semaines</span>
              <ul>
                <li>Mise en place infrastructure Docker</li>
                <li>Module Devis (priorité #1)</li>
                <li>Catalogue fournisseurs</li>
                <li>Tableau de bord basique</li>
              </ul>
            </div>
          </div>

          <div class="timeline-item timeline-item--complete reveal">
            <div class="timeline-marker">
              <span class="marker-icon">🧪</span>
            </div>
            <div class="timeline-content">
              <span class="timeline-phase">Phase 4</span>
              <h3>Tests & Migration</h3>
              <span class="timeline-duration">2 semaines</span>
              <ul>
                <li>Tests utilisateurs (bêta)</li>
                <li>Migration données Excel</li>
                <li>Formation équipe</li>
                <li>Documentation</li>
              </ul>
            </div>
          </div>

          <div class="timeline-item timeline-item--complete reveal">
            <div class="timeline-marker">
              <span class="marker-icon">🚀</span>
            </div>
            <div class="timeline-content">
              <span class="timeline-phase">Phase 5</span>
              <h3>Mise en Production</h3>
              <span class="timeline-duration">1 semaine</span>
              <ul>
                <li>Déploiement progressif</li>
                <li>Monitoring & alertes</li>
                <li>Support réactif J+7</li>
                <li>Itérations rapides</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Screenshots Gallery -->
    <section class="case-gallery" aria-labelledby="gallery-title">
      <div class="container">
        <h2 id="gallery-title" class="section-title reveal">Aperçus de l'Interface</h2>
        
        <div class="gallery-grid reveal">
          <div class="gallery-item gallery-item--large">
            <div class="gallery-placeholder">
              <span class="placeholder-icon">📊</span>
              <span class="placeholder-label">Tableau de Bord Principal</span>
              <span class="placeholder-desc">Vue d'ensemble des KPIs et pipeline commercial</span>
            </div>
          </div>
          <div class="gallery-item">
            <div class="gallery-placeholder">
              <span class="placeholder-icon">📋</span>
              <span class="placeholder-label">Générateur de Devis</span>
              <span class="placeholder-desc">Interface de création de devis</span>
            </div>
          </div>
          <div class="gallery-item">
            <div class="gallery-placeholder">
              <span class="placeholder-icon">🏨</span>
              <span class="placeholder-label">Catalogue Fournisseurs</span>
              <span class="placeholder-desc">Recherche et comparaison</span>
            </div>
          </div>
          <div class="gallery-item">
            <div class="gallery-placeholder">
              <span class="placeholder-icon">👥</span>
              <span class="placeholder-label">Fiche Client</span>
              <span class="placeholder-desc">Historique et informations</span>
            </div>
          </div>
          <div class="gallery-item">
            <div class="gallery-placeholder">
              <span class="placeholder-icon">📱</span>
              <span class="placeholder-label">Version Mobile</span>
              <span class="placeholder-desc">Interface responsive</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Testimonial Section -->
    <section class="case-testimonial" aria-labelledby="testimonial-title">
      <div class="container">
        <h2 id="testimonial-title" class="sr-only">Témoignage client</h2>
        
        <blockquote class="testimonial-quote reveal">
          <div class="quote-icon" aria-hidden="true">"</div>
          <p class="quote-text">
            On est passé de l'artisanat au professionnel. Mes commerciaux peuvent enfin 
            se concentrer sur la vente au lieu de perdre du temps dans les fichiers Excel. 
            Le retour sur investissement a été atteint en 6 mois.
          </p>
          <footer class="quote-author">
            <div class="author-avatar">SL</div>
            <div class="author-info">
              <cite class="author-name">Sophie Laurent</cite>
              <span class="author-role">Directrice Générale, VoyageoPro</span>
            </div>
          </footer>
        </blockquote>
      </div>
    </section>

    <!-- Learnings Section -->
    <section class="case-learnings" aria-labelledby="learnings-title">
      <div class="container">
        <h2 id="learnings-title" class="section-title reveal">Enseignements & Défis</h2>

        <div class="learnings-grid">
          <div class="learning-card learning-card--challenge reveal">
            <span class="card-type">⚠️ Défi</span>
            <h3>Migration des données</h3>
            <p>
              15 fichiers Excel avec des formats incohérents, données dupliquées et 
              relations implicites. Solution : script de migration sur-mesure avec 
              validation manuelle par lot.
            </p>
          </div>

          <div class="learning-card learning-card--success reveal">
            <span class="card-type">✅ Succès</span>
            <h3>Adoption rapide</h3>
            <p>
              Formation de 2h par utilisateur + documentation vidéo. 
              100% d'adoption en 2 semaines grâce à une UX intuitive 
              et un accompagnement terrain.
            </p>
          </div>

          <div class="learning-card learning-card--challenge reveal">
            <span class="card-type">⚠️ Défi</span>
            <h3>Intégrations tierces</h3>
            <p>
              Connexion avec 3 APIs fournisseurs aux formats différents. 
              Solution : couche d'abstraction avec pattern adaptateur 
              et nouvelle tentative automatique.
            </p>
          </div>

          <div class="learning-card learning-card--success reveal">
            <span class="card-type">✅ Succès</span>
            <h3>Performance maintenue</h3>
            <p>
              Avec 800+ fournisseurs et 5000+ produits, le catalogue 
              reste rapide grâce au cache Redis et à l'indexation 
              PostgreSQL optimisée.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Tech Stack Summary -->
    <section class="case-techstack" aria-labelledby="techstack-title">
      <div class="container">
        <h2 id="techstack-title" class="section-title reveal">Stack Technique Complète</h2>
        
        <div class="techstack-grid reveal">
          <div class="techstack-category">
            <h3>🎨 Frontend</h3>
            <div class="tech-tags">
              <span class="tech-tag">Vue 3</span>
              <span class="tech-tag">Composition API</span>
              <span class="tech-tag">Tailwind CSS</span>
              <span class="tech-tag">Chart.js</span>
              <span class="tech-tag">Vite</span>
            </div>
          </div>
          
          <div class="techstack-category">
            <h3>⚙️ Backend</h3>
            <div class="tech-tags">
              <span class="tech-tag">Symfony 7</span>
              <span class="tech-tag">PHP 8.3</span>
              <span class="tech-tag">API Platform</span>
              <span class="tech-tag">Doctrine ORM</span>
              <span class="tech-tag">Messenger</span>
            </div>
          </div>
          
          <div class="techstack-category">
            <h3>🗄️ Base de Données</h3>
            <div class="tech-tags">
              <span class="tech-tag">PostgreSQL 16</span>
              <span class="tech-tag">Redis</span>
              <span class="tech-tag">Migrations</span>
            </div>
          </div>
          
          <div class="techstack-category">
            <h3>🔧 Outils</h3>
            <div class="tech-tags">
              <span class="tech-tag">Docker</span>
              <span class="tech-tag">n8n</span>
              <span class="tech-tag">Stripe</span>
              <span class="tech-tag">Twilio</span>
              <span class="tech-tag">DomPDF</span>
            </div>
          </div>
          
          <div class="techstack-category">
            <h3>🚀 Déploiement</h3>
            <div class="tech-tags">
              <span class="tech-tag">OVH Cloud</span>
              <span class="tech-tag">GitHub Actions</span>
              <span class="tech-tag">SSL Let's Encrypt</span>
            </div>
          </div>
          
          <div class="techstack-category">
            <h3>📊 Monitoring</h3>
            <div class="tech-tags">
              <span class="tech-tag">Sentry</span>
              <span class="tech-tag">Matomo</span>
              <span class="tech-tag">Logs structurés</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="case-cta" aria-labelledby="cta-title">
      <div class="container">
        <div class="cta-content reveal">
          <h2 id="cta-title">Un projet similaire ?</h2>
          <p>
            Vous gérez encore votre activité sur Excel ? 
            Discutons de votre transformation digitale.
          </p>
          <div class="cta-buttons">
            <router-link to="/contact" class="cta-btn cta-btn--primary">
              <span class="btn-icon">📞</span>
              <span>Planifier un audit gratuit</span>
            </router-link>
            <router-link to="/projets" class="cta-btn cta-btn--secondary">
              <span>← Voir d'autres projets</span>
            </router-link>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useScrollReveal } from '@/composables/useScrollReveal';

const { observeAll } = useScrollReveal();

onMounted(() => {
  observeAll('.reveal');
});
</script>

<style scoped>
/* =============================================================================
   CASE STUDY - Variables & Base
   ============================================================================= */
.case-study-page {
  --primary: #0ea5e9;
  --primary-dark: #0284c7;
  --primary-soft: rgba(14, 165, 233, 0.1);
  --accent: #f97316;
  --success: #22c55e;
  --warning: #eab308;
  --bg: #0f172a;
  --bg-light: #1e293b;
  --surface: #334155;
  --text-main: #f1f5f9;
  --text-muted: #94a3b8;
  --border: rgba(148, 163, 184, 0.2);
  
  background: var(--bg);
  color: var(--text-main);
  min-height: 100vh;
  font-family: 'Inter', -apple-system, sans-serif;
}

/* =============================================================================
   BREADCRUMB
   ============================================================================= */
.breadcrumb {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.75rem;
  color: var(--text-muted);
  margin-bottom: 1.5rem;
}

.breadcrumb a {
  color: var(--primary);
  text-decoration: none;
  transition: opacity 0.2s;
}

.breadcrumb a:hover {
  opacity: 0.8;
}

.breadcrumb span:not(:last-child) {
  opacity: 0.5;
}

/* =============================================================================
   HERO SECTION
   ============================================================================= */
.case-hero {
  position: relative;
  min-height: 80vh;
  display: flex;
  align-items: center;
  padding: 8rem 2rem 4rem;
  overflow: hidden;
}

.hero-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.globe-grid {
  position: absolute;
  inset: 0;
  background-image: 
    radial-gradient(circle at 30% 50%, rgba(14, 165, 233, 0.1) 0%, transparent 50%),
    linear-gradient(rgba(14, 165, 233, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(14, 165, 233, 0.03) 1px, transparent 1px);
  background-size: 100% 100%, 40px 40px, 40px 40px;
}

.route-lines {
  position: absolute;
  inset: 0;
}

.route-lines svg {
  width: 100%;
  height: 100%;
}

.route {
  fill: none;
  stroke: var(--primary);
  stroke-width: 2;
  stroke-dasharray: 10 5;
  opacity: 0.3;
  animation: dash 20s linear infinite;
}

.route-2 { animation-delay: -5s; stroke: var(--accent); }
.route-3 { animation-delay: -10s; }

@keyframes dash {
  to { stroke-dashoffset: -1000; }
}

.destination-dots .dot {
  position: absolute;
  width: 10px;
  height: 10px;
  background: var(--primary);
  border-radius: 50%;
  box-shadow: 0 0 20px var(--primary);
  animation: dot-pulse 3s ease-in-out infinite;
}

.dot-1 { top: 20%; left: 15%; animation-delay: 0s; }
.dot-2 { top: 35%; left: 45%; animation-delay: 0.5s; background: var(--accent); }
.dot-3 { top: 25%; right: 20%; animation-delay: 1s; }
.dot-4 { top: 60%; left: 30%; animation-delay: 1.5s; }
.dot-5 { top: 50%; right: 25%; animation-delay: 2s; background: var(--accent); }

@keyframes dot-pulse {
  0%, 100% { transform: scale(1); opacity: 0.8; }
  50% { transform: scale(1.5); opacity: 0.4; }
}

.container {
  position: relative;
  z-index: 1;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

.case-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: var(--primary-soft);
  border: 1px solid var(--primary);
  border-radius: 2rem;
  margin-bottom: 1.5rem;
}

.badge-icon { font-size: 1.25rem; }

.badge-text {
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  color: var(--primary);
}

.case-title {
  margin-bottom: 1.5rem;
}

.title-client {
  display: block;
  font-size: clamp(2.5rem, 8vw, 5rem);
  font-weight: 800;
  color: var(--text-main);
  line-height: 1.1;
}

.title-project {
  display: block;
  font-size: clamp(1.25rem, 3vw, 1.75rem);
  font-weight: 400;
  color: var(--primary);
  margin-top: 0.5rem;
}

.case-intro {
  font-size: 1.25rem;
  color: var(--text-muted);
  max-width: 600px;
  line-height: 1.7;
  margin-bottom: 2rem;
}

.case-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
}

.meta-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.meta-label {
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--text-muted);
}

.meta-value {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-main);
}

/* =============================================================================
   KPIs SECTION
   ============================================================================= */
.case-kpis {
  padding: 6rem 2rem;
  background: linear-gradient(180deg, var(--bg) 0%, var(--bg-light) 100%);
}

.section-title {
  font-size: clamp(1.75rem, 4vw, 2.5rem);
  font-weight: 700;
  text-align: center;
  margin-bottom: 3rem;
  color: var(--text-main);
}

.kpis-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.kpi-card {
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 1rem;
  padding: 2rem;
  text-align: center;
  transition: all 0.3s ease;
}

.kpi-card:hover {
  border-color: var(--primary);
  transform: translateY(-5px);
}

.kpi-card--primary {
  background: linear-gradient(135deg, var(--primary-soft), var(--bg));
  border-color: var(--primary);
}

.kpi-icon {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.kpi-value {
  margin-bottom: 0.5rem;
}

.value-number {
  font-size: 3rem;
  font-weight: 800;
  background: linear-gradient(135deg, var(--primary), var(--accent));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.kpi-label {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-main);
  margin-bottom: 0.25rem;
}

.kpi-detail {
  font-size: 0.85rem;
  color: var(--text-muted);
}

/* =============================================================================
   CONTEXT SECTION
   ============================================================================= */
.case-context {
  padding: 6rem 2rem;
  background: var(--bg-light);
}

.context-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: start;
}

.context-content .section-title {
  text-align: left;
  margin-bottom: 2rem;
}

.client-profile {
  margin-bottom: 2rem;
}

.client-profile h3 {
  font-size: 1.25rem;
  color: var(--primary);
  margin-bottom: 0.75rem;
}

.client-profile p {
  color: var(--text-muted);
  line-height: 1.7;
  margin-bottom: 1rem;
}

.client-profile strong {
  color: var(--text-main);
}

.profile-stats {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  list-style: none;
  padding: 0;
}

.profile-stats li {
  display: flex;
  align-items: baseline;
  gap: 0.25rem;
  padding: 0.5rem 1rem;
  background: var(--bg);
  border-radius: 0.5rem;
  font-size: 0.85rem;
  color: var(--text-muted);
}

.stat-num {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--primary);
}

.pain-points h3 {
  font-size: 1.25rem;
  color: var(--accent);
  margin-bottom: 1rem;
}

.problem-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.problem-item {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background: var(--bg);
  border-radius: 0.75rem;
  border-left: 3px solid var(--accent);
}

.problem-icon {
  font-size: 1.5rem;
  flex-shrink: 0;
}

.problem-content h4 {
  font-size: 1rem;
  color: var(--text-main);
  margin-bottom: 0.25rem;
}

.problem-content p {
  font-size: 0.85rem;
  color: var(--text-muted);
  line-height: 1.5;
}

/* Before/After Visual */
.before-after {
  display: flex;
  align-items: stretch;
  gap: 1rem;
}

.before-card, .after-card {
  flex: 1;
  background: var(--bg);
  border-radius: 1rem;
  padding: 1.5rem;
  border: 1px solid var(--border);
}

.card-label {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  margin-bottom: 1rem;
}

.before-card .card-label {
  background: rgba(239, 68, 68, 0.2);
  color: #ef4444;
}

.after-card .card-label {
  background: rgba(34, 197, 94, 0.2);
  color: #22c55e;
}

.card-visual {
  margin-bottom: 1rem;
  min-height: 150px;
}

.excel-chaos {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.excel-file {
  padding: 0.5rem 0.75rem;
  background: rgba(34, 197, 94, 0.1);
  border: 1px solid rgba(34, 197, 94, 0.3);
  border-radius: 0.25rem;
  font-size: 0.7rem;
  font-family: 'JetBrains Mono', monospace;
  color: var(--text-muted);
  transform-origin: left;
}

.excel-file--1 { transform: rotate(-2deg); }
.excel-file--2 { transform: rotate(1deg); margin-left: 10px; }
.excel-file--3 { transform: rotate(-1deg); }
.excel-file--4 { transform: rotate(2deg); margin-left: 5px; }
.excel-file--5 { transform: rotate(-1deg); margin-left: 15px; }

.platform-preview {
  background: #1a1a2e;
  border-radius: 0.5rem;
  overflow: hidden;
  border: 1px solid var(--border);
}

.preview-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  background: var(--surface);
  border-bottom: 1px solid var(--border);
}

.preview-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--text-muted);
}

.preview-dot:nth-child(1) { background: #ef4444; }
.preview-dot:nth-child(2) { background: #eab308; }
.preview-dot:nth-child(3) { background: #22c55e; }

.preview-title {
  font-size: 0.65rem;
  color: var(--text-muted);
  margin-left: auto;
}

.preview-content {
  display: flex;
  padding: 0.75rem;
  gap: 0.5rem;
  min-height: 100px;
}

.preview-sidebar {
  width: 40px;
  background: var(--surface);
  border-radius: 0.25rem;
}

.preview-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.preview-card {
  height: 25px;
  background: var(--surface);
  border-radius: 0.25rem;
}

.card-issues, .card-benefits {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.card-issues li, .card-benefits li {
  font-size: 0.8rem;
  color: var(--text-muted);
}

.arrow-transform {
  display: flex;
  align-items: center;
  font-size: 2rem;
  color: var(--primary);
  padding: 0 0.5rem;
}

/* =============================================================================
   SOLUTION SECTION
   ============================================================================= */
.case-solution {
  padding: 6rem 2rem;
  background: var(--bg);
}

.solution-overview {
  max-width: 800px;
  margin: 0 auto 3rem;
  text-align: center;
}

.solution-intro {
  font-size: 1.1rem;
  color: var(--text-muted);
  line-height: 1.7;
}

.modules-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 1.5rem;
}

.module-card {
  background: var(--bg-light);
  border: 1px solid var(--border);
  border-radius: 1rem;
  padding: 1.5rem;
  transition: all 0.3s ease;
}

.module-card:hover {
  border-color: var(--primary);
  transform: translateY(-3px);
}

.module-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.module-icon {
  font-size: 2rem;
}

.module-num {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.8rem;
  color: var(--primary);
  opacity: 0.5;
}

.module-card h3 {
  font-size: 1.25rem;
  color: var(--text-main);
  margin-bottom: 0.5rem;
}

.module-card > p {
  font-size: 0.9rem;
  color: var(--text-muted);
  line-height: 1.5;
  margin-bottom: 1rem;
}

.module-features {
  list-style: none;
  padding: 0;
  margin: 0 0 1rem 0;
}

.module-features li {
  font-size: 0.85rem;
  color: var(--text-muted);
  padding: 0.25rem 0;
  padding-left: 1.25rem;
  position: relative;
}

.module-features li::before {
  content: '→';
  position: absolute;
  left: 0;
  color: var(--primary);
}

.module-tech {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.module-tech span {
  padding: 0.25rem 0.5rem;
  background: var(--primary-soft);
  border-radius: 0.25rem;
  font-size: 0.7rem;
  color: var(--primary);
}

/* =============================================================================
   ARCHITECTURE SECTION
   ============================================================================= */
.case-architecture {
  padding: 6rem 2rem;
  background: var(--bg-light);
}

.archi-diagram {
  max-width: 900px;
  margin: 0 auto 3rem;
}

.archi-layer {
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 1rem;
  padding: 1.5rem;
  margin-bottom: 0;
}

.archi-layer h3 {
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--text-muted);
  margin-bottom: 1rem;
  text-align: center;
}

.layer-content {
  display: flex;
  justify-content: center;
  gap: 2rem;
  flex-wrap: wrap;
}

.tech-block {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  padding: 1rem;
  background: var(--bg-light);
  border-radius: 0.75rem;
  min-width: 120px;
}

.tech-icon { font-size: 1.5rem; }

.tech-name {
  font-weight: 600;
  color: var(--text-main);
  font-size: 0.9rem;
}

.tech-detail {
  font-size: 0.7rem;
  color: var(--text-muted);
}

.archi-connector {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 0;
}

.connector-label {
  padding: 0.25rem 1rem;
  background: var(--primary-soft);
  border-radius: 1rem;
  font-size: 0.7rem;
  color: var(--primary);
}

.archi-layer--frontend { border-color: #22c55e; }
.archi-layer--frontend h3 { color: #22c55e; }

.archi-layer--backend { border-color: #8b5cf6; }
.archi-layer--backend h3 { color: #8b5cf6; }

.archi-layer--data { border-color: #f97316; }
.archi-layer--data h3 { color: #f97316; }

.archi-layer--infra { border-color: #0ea5e9; }
.archi-layer--infra h3 { color: #0ea5e9; }

.archi-highlights {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.highlight-item {
  text-align: center;
  padding: 1.5rem;
}

.highlight-icon {
  font-size: 2rem;
  display: block;
  margin-bottom: 0.75rem;
}

.highlight-item h4 {
  font-size: 1rem;
  color: var(--text-main);
  margin-bottom: 0.5rem;
}

.highlight-item p {
  font-size: 0.85rem;
  color: var(--text-muted);
  line-height: 1.5;
}

/* =============================================================================
   TIMELINE SECTION
   ============================================================================= */
.case-timeline {
  padding: 6rem 2rem;
  background: var(--bg);
}

.timeline {
  max-width: 700px;
  margin: 0 auto;
  position: relative;
}

.timeline::before {
  content: '';
  position: absolute;
  left: 24px;
  top: 0;
  bottom: 0;
  width: 2px;
  background: var(--border);
}

.timeline-item {
  display: flex;
  gap: 1.5rem;
  padding-bottom: 2rem;
  position: relative;
}

.timeline-marker {
  width: 50px;
  height: 50px;
  background: var(--bg-light);
  border: 2px solid var(--border);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  z-index: 1;
}

.timeline-item--complete .timeline-marker {
  border-color: var(--success);
  background: rgba(34, 197, 94, 0.1);
}

.marker-icon { font-size: 1.25rem; }

.timeline-content {
  flex: 1;
  padding-top: 0.5rem;
}

.timeline-phase {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background: var(--primary-soft);
  border-radius: 1rem;
  font-size: 0.7rem;
  color: var(--primary);
  margin-bottom: 0.5rem;
}

.timeline-content h3 {
  font-size: 1.25rem;
  color: var(--text-main);
  margin-bottom: 0.25rem;
}

.timeline-duration {
  font-size: 0.85rem;
  color: var(--text-muted);
  display: block;
  margin-bottom: 0.75rem;
}

.timeline-content ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.timeline-content li {
  font-size: 0.9rem;
  color: var(--text-muted);
  padding: 0.25rem 0;
  padding-left: 1.25rem;
  position: relative;
}

.timeline-content li::before {
  content: '•';
  position: absolute;
  left: 0;
  color: var(--primary);
}

/* =============================================================================
   GALLERY SECTION
   ============================================================================= */
.case-gallery {
  padding: 6rem 2rem;
  background: var(--bg-light);
}

.gallery-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(2, auto);
  gap: 1rem;
}

.gallery-item {
  border-radius: 0.75rem;
  overflow: hidden;
  border: 1px solid var(--border);
  transition: all 0.3s ease;
}

.gallery-item:hover {
  border-color: var(--primary);
  transform: scale(1.02);
}

.gallery-item--large {
  grid-column: span 2;
  grid-row: span 2;
}

.gallery-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: var(--bg);
  padding: 2rem;
  min-height: 150px;
  height: 100%;
  text-align: center;
}

.gallery-item--large .gallery-placeholder {
  min-height: 320px;
}

.placeholder-icon {
  font-size: 2.5rem;
  margin-bottom: 0.75rem;
  opacity: 0.6;
}

.gallery-item--large .placeholder-icon {
  font-size: 4rem;
}

.placeholder-label {
  font-weight: 600;
  color: var(--text-main);
  margin-bottom: 0.25rem;
}

.placeholder-desc {
  font-size: 0.8rem;
  color: var(--text-muted);
}

/* =============================================================================
   TESTIMONIAL SECTION
   ============================================================================= */
.case-testimonial {
  padding: 6rem 2rem;
  background: linear-gradient(135deg, var(--primary-soft), var(--bg-light));
}

.testimonial-quote {
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
  position: relative;
}

.quote-icon {
  font-size: 6rem;
  color: var(--primary);
  opacity: 0.2;
  position: absolute;
  top: -2rem;
  left: 50%;
  transform: translateX(-50%);
  font-family: Georgia, serif;
}

.quote-text {
  font-size: 1.5rem;
  font-style: italic;
  color: var(--text-main);
  line-height: 1.6;
  margin-bottom: 2rem;
  position: relative;
  z-index: 1;
}

.quote-author {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

.author-avatar {
  width: 50px;
  height: 50px;
  background: var(--primary);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  color: white;
}

.author-info {
  text-align: left;
}

.author-name {
  display: block;
  font-style: normal;
  font-weight: 600;
  color: var(--text-main);
}

.author-role {
  font-size: 0.85rem;
  color: var(--text-muted);
}

/* =============================================================================
   LEARNINGS SECTION
   ============================================================================= */
.case-learnings {
  padding: 6rem 2rem;
  background: var(--bg);
}

.learnings-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

.learning-card {
  background: var(--bg-light);
  border-radius: 1rem;
  padding: 1.5rem;
  border-left: 4px solid var(--border);
}

.learning-card--challenge {
  border-left-color: var(--warning);
}

.learning-card--success {
  border-left-color: var(--success);
}

.card-type {
  display: inline-block;
  font-size: 0.75rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
}

.learning-card h3 {
  font-size: 1.1rem;
  color: var(--text-main);
  margin-bottom: 0.5rem;
}

.learning-card p {
  font-size: 0.9rem;
  color: var(--text-muted);
  line-height: 1.6;
}

/* =============================================================================
   TECH STACK SECTION
   ============================================================================= */
.case-techstack {
  padding: 6rem 2rem;
  background: var(--bg-light);
}

.techstack-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
}

.techstack-category h3 {
  font-size: 1rem;
  color: var(--text-main);
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.tech-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tech-tag {
  padding: 0.5rem 0.75rem;
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 0.5rem;
  font-size: 0.8rem;
  color: var(--text-muted);
  transition: all 0.2s ease;
}

.tech-tag:hover {
  border-color: var(--primary);
  color: var(--primary);
}

/* =============================================================================
   CTA SECTION
   ============================================================================= */
.case-cta {
  padding: 6rem 2rem;
  background: var(--bg);
}

.cta-content {
  text-align: center;
  max-width: 600px;
  margin: 0 auto;
}

.cta-content h2 {
  font-size: 2rem;
  color: var(--text-main);
  margin-bottom: 0.75rem;
}

.cta-content > p {
  font-size: 1.1rem;
  color: var(--text-muted);
  margin-bottom: 2rem;
}

.cta-buttons {
  display: flex;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.cta-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
}

.cta-btn--primary {
  background: var(--primary);
  color: white;
}

.cta-btn--primary:hover {
  background: var(--primary-dark);
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(14, 165, 233, 0.3);
}

.cta-btn--secondary {
  background: transparent;
  border: 1px solid var(--border);
  color: var(--text-muted);
}

.cta-btn--secondary:hover {
  border-color: var(--primary);
  color: var(--primary);
}

.btn-icon { font-size: 1.25rem; }

/* =============================================================================
   SCROLL REVEAL
   ============================================================================= */
.reveal {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), 
              transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

.reveal.revealed {
  opacity: 1;
  transform: translateY(0);
}

/* =============================================================================
   UTILITIES
   ============================================================================= */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  border: 0;
}

/* =============================================================================
   RESPONSIVE
   ============================================================================= */
@media (max-width: 1024px) {
  .context-grid {
    grid-template-columns: 1fr;
  }
  
  .before-after {
    flex-direction: column;
  }
  
  .arrow-transform {
    transform: rotate(90deg);
    padding: 1rem 0;
  }
  
  .gallery-grid {
    grid-template-columns: 1fr 1fr;
  }
  
  .gallery-item--large {
    grid-column: span 2;
    grid-row: span 1;
  }
}

@media (max-width: 768px) {
  .case-meta {
    gap: 1rem;
  }
  
  .meta-item {
    flex: 0 0 45%;
  }
  
  .layer-content {
    gap: 1rem;
  }
  
  .tech-block {
    min-width: 100px;
    padding: 0.75rem;
  }
  
  .quote-text {
    font-size: 1.25rem;
  }
  
  .gallery-grid {
    grid-template-columns: 1fr;
  }
  
  .gallery-item--large {
    grid-column: span 1;
  }
}

/* =============================================================================
   ACCESSIBILITY
   ============================================================================= */
@media (prefers-reduced-motion: reduce) {
  .route,
  .dot {
    animation: none !important;
  }
  
  .module-card:hover,
  .kpi-card:hover,
  .gallery-item:hover {
    transform: none;
  }
  
  .reveal {
    opacity: 1;
    transform: none;
    transition: none;
  }
}
</style>
