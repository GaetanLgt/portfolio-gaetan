<template>
  <div class="home-page">
    
    <!-- HERO : Accueil chaleureux et clair -->
    <section class="hero">
      <div class="container">
        <div class="hero__content">
          <!-- Greeting Badge -->
          <div class="greeting-badge">
            <span class="greeting-wave">👋</span>
            <span class="greeting-text">Bienvenue chez GL Digital Lab</span>
          </div>
          
          <!-- Main Title - Simple et clair -->
          <h1 class="hero__title">
            Je crée des <span class="highlight">sites web</span> et 
            <span class="highlight">applications</span> pour les PME
          </h1>
          
          <!-- Subtitle explicatif -->
          <p class="hero__subtitle">
            Développeur indépendant basé à <strong>Limoges</strong>, je transforme vos idées 
            en outils numériques performants. Du site vitrine à l'application métier complète.
          </p>
          
          <!-- Value Props - 3 pilliers clairs -->
          <div class="value-props">
            <div class="value-prop">
              <span class="value-icon">🇫🇷</span>
              <span class="value-text">100% hébergé en France</span>
            </div>
            <div class="value-prop">
              <span class="value-icon">🔒</span>
              <span class="value-text">Vos données vous appartiennent</span>
            </div>
            <div class="value-prop">
              <span class="value-icon">🤝</span>
              <span class="value-text">Accompagnement personnalisé</span>
            </div>
          </div>
          
          <!-- CTA Buttons -->
          <div class="hero__actions">
            <router-link to="/contact" class="btn btn--primary btn--large">
              <span class="btn-icon">📞</span>
              Discutons de votre projet
            </router-link>
            <router-link to="/services" class="btn btn--secondary">
              <span class="btn-icon">📋</span>
              Voir les services
            </router-link>
          </div>
        </div>
        
        <!-- Hero Visual - Illustration de ce que je fais -->
        <div class="hero__visual">
          <div class="visual-card visual-card--main">
            <div class="visual-screen">
              <div class="screen-header">
                <span class="dot"></span><span class="dot"></span><span class="dot"></span>
              </div>
              <div class="screen-content">
                <div class="code-line"><span class="code-green">// Votre idée</span></div>
                <div class="code-line"><span class="code-blue">const</span> projet = <span class="code-orange">"💡"</span>;</div>
                <div class="code-line"></div>
                <div class="code-line"><span class="code-green">// Ma solution</span></div>
                <div class="code-line"><span class="code-blue">const</span> résultat = <span class="code-orange">"🚀"</span>;</div>
              </div>
            </div>
          </div>
          <div class="visual-badges">
            <span class="tech-badge">Symfony</span>
            <span class="tech-badge">Vue.js</span>
            <span class="tech-badge">IA</span>
          </div>
        </div>
      </div>
    </section>
    
    <!-- CE QUE JE FAIS - Section pédagogique -->
    <section class="what-i-do">
      <div class="container">
        <div class="section-intro">
          <span class="section-number">01</span>
          <h2>Ce que je peux faire pour vous</h2>
          <p>Des solutions adaptées à chaque besoin, de la simple vitrine au système complexe</p>
        </div>
        
        <div class="services-showcase">
          <!-- Service 1 : Sites Web -->
          <div class="service-card">
            <div class="service-icon-wrapper">
              <span class="service-icon">🌐</span>
            </div>
            <h3>Sites Web</h3>
            <p>Site vitrine, e-commerce, blog... Un site qui vous ressemble et qui convertit vos visiteurs en clients.</p>
            <ul class="service-features">
              <li>✓ Design moderne et responsive</li>
              <li>✓ Optimisé pour Google (SEO)</li>
              <li>✓ Facile à mettre à jour</li>
            </ul>
            <div class="service-example">
              <span class="example-label">Exemple :</span>
              <span class="example-text">Site vitrine pour artisan, restaurant, cabinet...</span>
            </div>
          </div>
          
          <!-- Service 2 : Applications Métier -->
          <div class="service-card service-card--featured">
            <div class="featured-badge">⭐ Le plus demandé</div>
            <div class="service-icon-wrapper">
              <span class="service-icon">⚙️</span>
            </div>
            <h3>Applications Métier</h3>
            <p>Logiciels sur-mesure pour automatiser vos tâches répétitives et gagner du temps au quotidien.</p>
            <ul class="service-features">
              <li>✓ Adapté à VOS processus</li>
              <li>✓ Connecté à vos outils existants</li>
              <li>✓ Formation incluse</li>
            </ul>
            <div class="service-example">
              <span class="example-label">Exemple :</span>
              <span class="example-text">Gestion de devis, suivi client, planning équipe...</span>
            </div>
          </div>
          
          <!-- Service 3 : IA & Automatisation -->
          <div class="service-card">
            <div class="service-icon-wrapper">
              <span class="service-icon">🤖</span>
            </div>
            <h3>IA & Automatisation</h3>
            <p>Intégrez l'intelligence artificielle dans votre entreprise, en gardant le contrôle de vos données.</p>
            <ul class="service-features">
              <li>✓ IA qui tourne chez VOUS</li>
              <li>✓ Pas de fuite vers le cloud US</li>
              <li>✓ Automatisations intelligentes</li>
            </ul>
            <div class="service-example">
              <span class="example-label">Exemple :</span>
              <span class="example-text">Chatbot interne, tri automatique, génération de rapports...</span>
            </div>
          </div>
        </div>
        
        <div class="services-cta">
          <router-link to="/services" class="btn btn--outline">
            Voir tous les détails et tarifs →
          </router-link>
        </div>
      </div>
    </section>
    
    <!-- COMMENT ÇA MARCHE - Process simple -->
    <section class="how-it-works">
      <div class="container">
        <div class="section-intro section-intro--center">
          <span class="section-number">02</span>
          <h2>Comment ça se passe ?</h2>
          <p>Un processus simple et transparent, de l'idée à la mise en ligne</p>
        </div>
        
        <div class="process-timeline">
          <div class="process-step">
            <div class="step-number">1</div>
            <div class="step-content">
              <div class="step-icon">☕</div>
              <h4>On discute</h4>
              <p>Un appel de 30 min (gratuit) pour comprendre votre besoin et voir si on peut travailler ensemble.</p>
            </div>
          </div>
          
          <div class="process-connector"></div>
          
          <div class="process-step">
            <div class="step-number">2</div>
            <div class="step-content">
              <div class="step-icon">📝</div>
              <h4>Je propose</h4>
              <p>Vous recevez un devis clair avec le planning, les fonctionnalités et le budget. Pas de surprise.</p>
            </div>
          </div>
          
          <div class="process-connector"></div>
          
          <div class="process-step">
            <div class="step-number">3</div>
            <div class="step-content">
              <div class="step-icon">🔨</div>
              <h4>Je construis</h4>
              <p>Développement avec des points réguliers pour valider ensemble. Vous voyez l'avancement en temps réel.</p>
            </div>
          </div>
          
          <div class="process-connector"></div>
          
          <div class="process-step">
            <div class="step-number">4</div>
            <div class="step-content">
              <div class="step-icon">🚀</div>
              <h4>C'est en ligne !</h4>
              <p>Mise en production, formation à l'utilisation, et je reste disponible pour le support.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
    
    <!-- CAS CONCRET - ARKADIA simplifié -->
    <section class="case-study">
      <div class="container">
        <div class="case-grid">
          <div class="case-content">
            <span class="case-badge">🎮 Cas concret</span>
            <h2>ARKADIA : 150 joueurs, 9 serveurs, zéro problème</h2>
            <p>
              Je gère un cluster de serveurs de jeux vidéo (ARK) avec 
              <strong>150 utilisateurs actifs</strong>. C'est mon terrain d'entraînement 
              pour tout ce qui est infrastructure, monitoring et gestion de communauté.
            </p>
            
            <div class="case-stats">
              <div class="case-stat">
                <span class="stat-value">99.8%</span>
                <span class="stat-label">Disponibilité</span>
              </div>
              <div class="case-stat">
                <span class="stat-value">18</span>
                <span class="stat-label">Mois d'exploitation</span>
              </div>
              <div class="case-stat">
                <span class="stat-value">24/7</span>
                <span class="stat-label">Monitoring</span>
              </div>
            </div>
            
            <p class="case-lesson">
              <strong>Ce que ça prouve :</strong> Je sais gérer des systèmes qui doivent 
              tourner sans interruption, avec de vrais utilisateurs qui comptent dessus.
            </p>
            
            <router-link to="/arkadia" class="btn btn--outline">
              Voir l'étude de cas complète →
            </router-link>
          </div>
          
          <div class="case-visual">
            <div class="server-status">
              <div class="status-header">
                <span class="status-title">🖥️ Status Cluster</span>
                <span class="status-live">● LIVE</span>
              </div>
              <div class="status-servers">
                <div class="server-item" v-for="server in servers" :key="server.name">
                  <span class="server-name">{{ server.name }}</span>
                  <span class="server-status-dot" :class="server.status"></span>
                </div>
              </div>
              <div class="status-footer">
                <span>Dernière vérification : il y a 2 min</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    
    <!-- QUI SUIS-JE - Présentation humaine -->
    <section class="about-me">
      <div class="container">
        <div class="about-grid">
          <div class="about-visual">
            <div class="avatar-card">
              <div class="avatar-icon">👨‍💻</div>
              <div class="avatar-info">
                <span class="avatar-name">Gaëtan</span>
                <span class="avatar-alias">"Neo"</span>
              </div>
            </div>
            <div class="location-badge">
              <span>📍 Limoges, France</span>
            </div>
          </div>
          
          <div class="about-content">
            <span class="section-number">03</span>
            <h2>Qui suis-je ?</h2>
            <p>
              Je m'appelle <strong>Gaëtan</strong>, développeur web depuis 2020. 
              J'ai commencé par gérer des communautés de joueurs, ce qui m'a appris 
              la rigueur technique et l'importance d'écouter les utilisateurs.
            </p>
            <p>
              Aujourd'hui, je mets ces compétences au service des PME qui veulent 
              des outils numériques <strong>efficaces, simples et souverains</strong>.
            </p>
            
            <div class="about-values">
              <div class="value-item">
                <span class="value-emoji">🎯</span>
                <div>
                  <strong>Pragmatique</strong>
                  <span>Je fais ce qui marche, pas ce qui est à la mode</span>
                </div>
              </div>
              <div class="value-item">
                <span class="value-emoji">💬</span>
                <div>
                  <strong>Accessible</strong>
                  <span>J'explique sans jargon technique</span>
                </div>
              </div>
              <div class="value-item">
                <span class="value-emoji">🔐</span>
                <div>
                  <strong>Souverain</strong>
                  <span>Vos données restent en France</span>
                </div>
              </div>
            </div>
            
            <router-link to="/parcours" class="btn btn--text">
              En savoir plus sur mon parcours →
            </router-link>
          </div>
        </div>
      </div>
    </section>
    
    <!-- TECHNOLOGIES - Simplifié et visuel -->
    <section class="tech-stack">
      <div class="container">
        <div class="section-intro section-intro--center">
          <span class="section-number">04</span>
          <h2>Mes outils de travail</h2>
          <p>Des technologies éprouvées et modernes pour des résultats durables</p>
        </div>
        
        <div class="tech-categories">
          <div class="tech-category">
            <h4>🔧 Backend</h4>
            <p>Le moteur invisible de vos applications</p>
            <div class="tech-list">
              <span class="tech-item">Symfony</span>
              <span class="tech-item">PHP 8</span>
              <span class="tech-item">PostgreSQL</span>
            </div>
          </div>
          
          <div class="tech-category">
            <h4>🎨 Frontend</h4>
            <p>Ce que vos utilisateurs voient et touchent</p>
            <div class="tech-list">
              <span class="tech-item">Vue.js</span>
              <span class="tech-item">Three.js</span>
              <span class="tech-item">CSS moderne</span>
            </div>
          </div>
          
          <div class="tech-category">
            <h4>🤖 Intelligence Artificielle</h4>
            <p>IA locale, sans fuite de données</p>
            <div class="tech-list">
              <span class="tech-item tech-item--highlight">Ollama</span>
              <span class="tech-item">n8n</span>
              <span class="tech-item">RAG</span>
            </div>
          </div>
          
          <div class="tech-category">
            <h4>🏠 Hébergement</h4>
            <p>Vos données restent en France</p>
            <div class="tech-list">
              <span class="tech-item tech-item--highlight">Serveurs FR</span>
              <span class="tech-item">Docker</span>
              <span class="tech-item">Linux</span>
            </div>
          </div>
        </div>
      </div>
    </section>
    
    <!-- EASTER EGG - Multivers teaser ludique -->
    <section class="easter-egg">
      <div class="container">
        <div class="easter-content">
          <div class="easter-badge">🎮 Bonus</div>
          <h2>Envie d'explorer ?</h2>
          <p>
            Ce site cache <strong>21 univers parallèles</strong> à découvrir. 
            Matrix, Blade Runner, Dragon Ball... Chaque page est une expérience unique.
          </p>
          <div class="universe-preview">
            <router-link v-for="u in previewUniverses" :key="u.path" :to="u.path" class="universe-mini" :style="{ '--color': u.color }">
              <span class="universe-mini__icon">{{ u.icon }}</span>
            </router-link>
            <span class="universe-more">+16</span>
          </div>
          <router-link to="/multivers" class="btn btn--fun">
            🌀 Explorer le Multivers
          </router-link>
        </div>
      </div>
    </section>
    
    <!-- CTA FINAL - Simple et chaleureux -->
    <section class="final-cta">
      <div class="container">
        <div class="cta-box">
          <h2>Un projet en tête ?</h2>
          <p>
            Racontez-moi votre idée en quelques mots. Je vous réponds sous 24h 
            avec une première estimation.
          </p>
          <div class="cta-actions">
            <router-link to="/contact" class="btn btn--primary btn--large">
              <span class="btn-icon">💬</span>
              Parlons-en !
            </router-link>
          </div>
          <div class="cta-reassurance">
            <span>✓ Réponse sous 24h</span>
            <span>✓ Premier échange gratuit</span>
            <span>✓ Sans engagement</span>
          </div>
        </div>
      </div>
    </section>
    
  </div>
</template>

<script setup>
import { ref } from 'vue';

const servers = ref([
  { name: 'TheIsland', status: 'online' },
  { name: 'Ragnarok', status: 'online' },
  { name: 'Fjordur', status: 'online' },
  { name: 'Aberration', status: 'online' },
  { name: 'Scorched', status: 'online' },
  { name: 'Extinction', status: 'online' },
  { name: 'Genesis', status: 'online' },
  { name: 'LostIsland', status: 'online' },
  { name: 'Center', status: 'online' },
]);

const previewUniverses = [
  { icon: '💊', path: '/matrix', color: '#00ff41' },
  { icon: '🌧️', path: '/blade-runner', color: '#f97316' },
  { icon: '🔥', path: '/dragon-ball-z', color: '#ff9800' },
  { icon: '💠', path: '/tron', color: '#00d4ff' },
  { icon: '🦾', path: '/iron-man', color: '#dc2626' },
];
</script>

<style scoped>
/* ═══════════════════════════════════════════════════════════════════════════
   VARIABLES
   ═══════════════════════════════════════════════════════════════════════════ */
.home-page {
  --accent: #10b981;
  --accent-soft: rgba(16, 185, 129, 0.1);
  --text: #e5e5e5;
  --text-muted: rgba(229, 229, 229, 0.7);
  --text-soft: rgba(229, 229, 229, 0.5);
  --bg: #0a0a0f;
  --surface: #12121a;
  --border: rgba(255, 255, 255, 0.1);
  
  min-height: 100vh;
  font-family: 'Inter', -apple-system, sans-serif;
}

.container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

/* ═══════════════════════════════════════════════════════════════════════════
   HERO
   ═══════════════════════════════════════════════════════════════════════════ */
.hero {
  min-height: 100vh;
  display: flex;
  align-items: center;
  padding: 6rem 0 4rem;
}

.hero .container {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 4rem;
  align-items: center;
}

.greeting-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: var(--accent-soft);
  border: 1px solid rgba(16, 185, 129, 0.2);
  border-radius: 2rem;
  margin-bottom: 1.5rem;
}

.greeting-wave {
  font-size: 1.25rem;
  animation: wave 2s ease-in-out infinite;
}

@keyframes wave {
  0%, 100% { transform: rotate(0deg); }
  25% { transform: rotate(20deg); }
  75% { transform: rotate(-10deg); }
}

.greeting-text {
  font-size: 0.85rem;
  color: var(--accent);
  font-weight: 500;
}

.hero__title {
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 700;
  line-height: 1.2;
  color: var(--text);
  margin-bottom: 1.5rem;
}

.hero__title .highlight {
  color: var(--accent);
}

.hero__subtitle {
  font-size: 1.1rem;
  color: var(--text-muted);
  line-height: 1.7;
  margin-bottom: 2rem;
}

.value-props {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 2rem;
}

.value-prop {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 2rem;
  font-size: 0.85rem;
  color: var(--text-muted);
}

.value-icon {
  font-size: 1rem;
}

.hero__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

/* Hero Visual */
.hero__visual {
  position: relative;
}

.visual-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.visual-screen {
  background: #1a1a24;
}

.screen-header {
  display: flex;
  gap: 0.4rem;
  padding: 0.75rem 1rem;
  background: rgba(0, 0, 0, 0.3);
  border-bottom: 1px solid var(--border);
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #ff5f56;
}

.dot:nth-child(2) { background: #ffbd2e; }
.dot:nth-child(3) { background: #27ca40; }

.screen-content {
  padding: 1.5rem;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.85rem;
}

.code-line {
  margin-bottom: 0.5rem;
  color: var(--text-soft);
}

.code-green { color: #10b981; }
.code-blue { color: #60a5fa; }
.code-orange { color: #f97316; }

.visual-badges {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
  justify-content: center;
}

.tech-badge {
  padding: 0.4rem 0.8rem;
  background: var(--accent-soft);
  border: 1px solid rgba(16, 185, 129, 0.2);
  border-radius: 1rem;
  font-size: 0.75rem;
  color: var(--accent);
  font-weight: 500;
}

/* ═══════════════════════════════════════════════════════════════════════════
   BUTTONS
   ═══════════════════════════════════════════════════════════════════════════ */
.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 1.5rem;
  border-radius: 0.5rem;
  font-size: 0.9rem;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
  cursor: pointer;
  border: none;
}

.btn--primary {
  background: var(--accent);
  color: #000;
}

.btn--primary:hover {
  background: #34d399;
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(16, 185, 129, 0.3);
}

.btn--secondary {
  background: var(--surface);
  border: 1px solid var(--border);
  color: var(--text);
}

.btn--secondary:hover {
  border-color: var(--accent);
  color: var(--accent);
}

.btn--outline {
  background: transparent;
  border: 1px solid var(--accent);
  color: var(--accent);
}

.btn--outline:hover {
  background: var(--accent);
  color: #000;
}

.btn--text {
  background: transparent;
  color: var(--accent);
  padding: 0.5rem 0;
}

.btn--text:hover {
  text-decoration: underline;
}

.btn--fun {
  background: linear-gradient(135deg, #a855f7, #6366f1);
  color: #fff;
}

.btn--fun:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(168, 85, 247, 0.3);
}

.btn--large {
  padding: 1rem 2rem;
  font-size: 1rem;
}

.btn-icon {
  font-size: 1.1rem;
}

/* ═══════════════════════════════════════════════════════════════════════════
   SECTIONS COMMON
   ═══════════════════════════════════════════════════════════════════════════ */
section {
  padding: 5rem 0;
}

.section-intro {
  margin-bottom: 3rem;
}

.section-intro--center {
  text-align: center;
}

.section-number {
  display: inline-block;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.75rem;
  color: var(--accent);
  margin-bottom: 0.5rem;
}

.section-intro h2 {
  font-size: clamp(1.75rem, 4vw, 2.5rem);
  font-weight: 700;
  color: var(--text);
  margin-bottom: 0.75rem;
}

.section-intro p {
  font-size: 1rem;
  color: var(--text-muted);
  max-width: 600px;
}

.section-intro--center p {
  margin: 0 auto;
}

/* ═══════════════════════════════════════════════════════════════════════════
   WHAT I DO - Services
   ═══════════════════════════════════════════════════════════════════════════ */
.what-i-do {
  background: var(--surface);
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
}

.services-showcase {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

.service-card {
  position: relative;
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 1rem;
  padding: 2rem;
  transition: all 0.3s ease;
}

.service-card:hover {
  border-color: var(--accent);
  transform: translateY(-5px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
}

.service-card--featured {
  border-color: rgba(16, 185, 129, 0.3);
  background: linear-gradient(180deg, var(--bg), rgba(16, 185, 129, 0.03));
}

.featured-badge {
  position: absolute;
  top: -12px;
  left: 1.5rem;
  padding: 0.35rem 0.75rem;
  background: var(--accent);
  color: #000;
  font-size: 0.7rem;
  font-weight: 700;
  border-radius: 1rem;
}

.service-icon-wrapper {
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--accent-soft);
  border-radius: 1rem;
  margin-bottom: 1.5rem;
}

.service-icon {
  font-size: 1.75rem;
}

.service-card h3 {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text);
  margin-bottom: 0.75rem;
}

.service-card > p {
  font-size: 0.9rem;
  color: var(--text-muted);
  line-height: 1.6;
  margin-bottom: 1.25rem;
}

.service-features {
  list-style: none;
  padding: 0;
  margin: 0 0 1.25rem 0;
}

.service-features li {
  font-size: 0.85rem;
  color: var(--text-soft);
  padding: 0.35rem 0;
}

.service-example {
  padding: 0.75rem;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 0.5rem;
  font-size: 0.8rem;
}

.example-label {
  color: var(--accent);
  font-weight: 600;
}

.example-text {
  color: var(--text-soft);
}

.services-cta {
  text-align: center;
  margin-top: 2.5rem;
}

/* ═══════════════════════════════════════════════════════════════════════════
   HOW IT WORKS - Process
   ═══════════════════════════════════════════════════════════════════════════ */
.process-timeline {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
}

.process-step {
  flex: 1;
  text-align: center;
  position: relative;
}

.step-number {
  width: 40px;
  height: 40px;
  background: var(--accent);
  color: #000;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  margin: 0 auto 1rem;
}

.step-icon {
  font-size: 2rem;
  margin-bottom: 0.75rem;
}

.step-content h4 {
  font-size: 1.1rem;
  color: var(--text);
  margin-bottom: 0.5rem;
}

.step-content p {
  font-size: 0.85rem;
  color: var(--text-muted);
  line-height: 1.6;
}

.process-connector {
  width: 60px;
  height: 2px;
  background: linear-gradient(90deg, var(--accent), transparent);
  margin-top: 20px;
  flex-shrink: 0;
}

/* ═══════════════════════════════════════════════════════════════════════════
   CASE STUDY
   ═══════════════════════════════════════════════════════════════════════════ */
.case-study {
  background: linear-gradient(180deg, var(--bg), rgba(16, 185, 129, 0.02));
}

.case-grid {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 4rem;
  align-items: center;
}

.case-badge {
  display: inline-block;
  padding: 0.4rem 0.8rem;
  background: rgba(249, 115, 22, 0.1);
  border: 1px solid rgba(249, 115, 22, 0.3);
  border-radius: 1rem;
  font-size: 0.75rem;
  color: #f97316;
  margin-bottom: 1rem;
}

.case-content h2 {
  font-size: clamp(1.5rem, 3vw, 2rem);
  font-weight: 700;
  color: var(--text);
  margin-bottom: 1rem;
}

.case-content > p {
  font-size: 1rem;
  color: var(--text-muted);
  line-height: 1.7;
  margin-bottom: 1.5rem;
}

.case-stats {
  display: flex;
  gap: 2rem;
  margin-bottom: 1.5rem;
}

.case-stat {
  text-align: center;
}

.stat-value {
  display: block;
  font-family: 'JetBrains Mono', monospace;
  font-size: 2rem;
  font-weight: 700;
  color: var(--accent);
}

.stat-label {
  font-size: 0.75rem;
  color: var(--text-soft);
}

.case-lesson {
  padding: 1rem;
  background: var(--accent-soft);
  border-left: 3px solid var(--accent);
  border-radius: 0 0.5rem 0.5rem 0;
  font-size: 0.9rem;
  color: var(--text);
  margin-bottom: 1.5rem;
}

/* Server Status Visual */
.server-status {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 1rem;
  overflow: hidden;
}

.status-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.25rem;
  background: rgba(0, 0, 0, 0.3);
  border-bottom: 1px solid var(--border);
}

.status-title {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text);
}

.status-live {
  font-size: 0.75rem;
  color: #22c55e;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.status-servers {
  padding: 1rem 1.25rem;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.5rem;
}

.server-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 0.75rem;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 0.5rem;
  font-size: 0.75rem;
}

.server-name {
  color: var(--text-soft);
}

.server-status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.server-status-dot.online {
  background: #22c55e;
  box-shadow: 0 0 8px #22c55e;
}

.status-footer {
  padding: 0.75rem 1.25rem;
  background: rgba(0, 0, 0, 0.2);
  font-size: 0.7rem;
  color: var(--text-soft);
  text-align: center;
}

/* ═══════════════════════════════════════════════════════════════════════════
   ABOUT ME
   ═══════════════════════════════════════════════════════════════════════════ */
.about-me {
  background: var(--surface);
  border-top: 1px solid var(--border);
}

.about-grid {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 4rem;
  align-items: center;
}

.avatar-card {
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 1rem;
  padding: 2rem;
  text-align: center;
}

.avatar-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.avatar-name {
  display: block;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text);
}

.avatar-alias {
  display: block;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.85rem;
  color: var(--accent);
}

.location-badge {
  text-align: center;
  margin-top: 1rem;
  font-size: 0.85rem;
  color: var(--text-muted);
}

.about-content h2 {
  font-size: 2rem;
  font-weight: 700;
  color: var(--text);
  margin-bottom: 1rem;
}

.about-content > p {
  font-size: 1rem;
  color: var(--text-muted);
  line-height: 1.7;
  margin-bottom: 1rem;
}

.about-values {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin: 2rem 0;
}

.value-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}

.value-emoji {
  font-size: 1.5rem;
}

.value-item strong {
  display: block;
  color: var(--text);
  margin-bottom: 0.25rem;
}

.value-item span {
  font-size: 0.85rem;
  color: var(--text-muted);
}

/* ═══════════════════════════════════════════════════════════════════════════
   TECH STACK
   ═══════════════════════════════════════════════════════════════════════════ */
.tech-categories {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
}

.tech-category {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 1rem;
  padding: 1.5rem;
  text-align: center;
}

.tech-category h4 {
  font-size: 1rem;
  color: var(--text);
  margin-bottom: 0.5rem;
}

.tech-category > p {
  font-size: 0.75rem;
  color: var(--text-soft);
  margin-bottom: 1rem;
}

.tech-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.tech-item {
  padding: 0.4rem 0.75rem;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 0.5rem;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.75rem;
  color: var(--text-muted);
}

.tech-item--highlight {
  background: var(--accent-soft);
  color: var(--accent);
  border: 1px solid rgba(16, 185, 129, 0.2);
}

/* ═══════════════════════════════════════════════════════════════════════════
   EASTER EGG - Multivers
   ═══════════════════════════════════════════════════════════════════════════ */
.easter-egg {
  background: linear-gradient(135deg, rgba(168, 85, 247, 0.05), rgba(99, 102, 241, 0.05));
  border-top: 1px solid rgba(168, 85, 247, 0.2);
  border-bottom: 1px solid rgba(168, 85, 247, 0.2);
}

.easter-content {
  text-align: center;
  max-width: 600px;
  margin: 0 auto;
}

.easter-badge {
  display: inline-block;
  padding: 0.4rem 0.8rem;
  background: rgba(168, 85, 247, 0.1);
  border: 1px solid rgba(168, 85, 247, 0.3);
  border-radius: 1rem;
  font-size: 0.75rem;
  color: #a855f7;
  margin-bottom: 1rem;
}

.easter-content h2 {
  font-size: 2rem;
  color: var(--text);
  margin-bottom: 0.75rem;
}

.easter-content > p {
  font-size: 1rem;
  color: var(--text-muted);
  margin-bottom: 2rem;
}

.universe-preview {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 2rem;
}

.universe-mini {
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid var(--color);
  border-radius: 50%;
  text-decoration: none;
  transition: all 0.3s ease;
}

.universe-mini:hover {
  transform: scale(1.15);
  box-shadow: 0 0 20px var(--color);
}

.universe-mini__icon {
  font-size: 1.25rem;
}

.universe-more {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.85rem;
  color: var(--text-soft);
}

/* ═══════════════════════════════════════════════════════════════════════════
   FINAL CTA
   ═══════════════════════════════════════════════════════════════════════════ */
.final-cta {
  padding: 6rem 0;
}

.cta-box {
  max-width: 600px;
  margin: 0 auto;
  text-align: center;
  padding: 3rem;
  background: var(--surface);
  border: 1px solid var(--accent);
  border-radius: 1.5rem;
  box-shadow: 0 0 60px rgba(16, 185, 129, 0.1);
}

.cta-box h2 {
  font-size: 2rem;
  color: var(--text);
  margin-bottom: 0.75rem;
}

.cta-box > p {
  font-size: 1rem;
  color: var(--text-muted);
  margin-bottom: 2rem;
  line-height: 1.6;
}

.cta-actions {
  margin-bottom: 1.5rem;
}

.cta-reassurance {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  font-size: 0.8rem;
  color: var(--text-soft);
}

/* ═══════════════════════════════════════════════════════════════════════════
   RESPONSIVE
   ═══════════════════════════════════════════════════════════════════════════ */
@media (max-width: 1024px) {
  .hero .container {
    grid-template-columns: 1fr;
    gap: 3rem;
  }
  
  .hero__visual {
    max-width: 400px;
    margin: 0 auto;
  }
  
  .services-showcase {
    grid-template-columns: 1fr;
  }
  
  .case-grid {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  
  .case-visual {
    order: -1;
  }
  
  .about-grid {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  
  .about-visual {
    display: flex;
    gap: 1rem;
    align-items: center;
  }
  
  .avatar-card {
    flex: 1;
  }
  
  .location-badge {
    margin-top: 0;
  }
  
  .tech-categories {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .process-timeline {
    flex-direction: column;
    gap: 2rem;
  }
  
  .process-connector {
    width: 2px;
    height: 30px;
    background: linear-gradient(180deg, var(--accent), transparent);
    margin: 0 auto;
  }
  
  .status-servers {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .case-stats {
    flex-wrap: wrap;
    justify-content: center;
  }
  
  .tech-categories {
    grid-template-columns: 1fr;
  }
  
  .cta-reassurance {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .value-props {
    flex-direction: column;
  }
}

/* ═══════════════════════════════════════════════════════════════════════════
   ACCESSIBILITY
   ═══════════════════════════════════════════════════════════════════════════ */
@media (prefers-reduced-motion: reduce) {
  .greeting-wave {
    animation: none;
  }
  
  .status-live {
    animation: none;
  }
}
</style>
