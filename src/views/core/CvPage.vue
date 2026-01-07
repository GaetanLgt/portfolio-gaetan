<template>
  <div class="cv-page">
    <!-- ACTIONS BAR -->
    <div class="cv-actions">
      <div class="container cv-actions__inner">
        <router-link to="/projets" class="cv-back">
          ← Retour aux projets
        </router-link>
        <div class="cv-actions__btns">
          <button @click="printCV" class="cv-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="6 9 6 2 18 2 18 9"/>
              <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/>
              <rect x="6" y="14" width="12" height="8"/>
            </svg>
            IMPRIMER
          </button>
          <a :href="pdfUrl" download="CV_Gaetan_LANGLET_2026.pdf" class="cv-btn cv-btn--primary">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            TÉLÉCHARGER PDF
          </a>
        </div>
      </div>
    </div>
    
    <!-- CV CONTENT -->
    <div class="cv-container" ref="cvContent">
      <div class="cv-paper">
        <!-- HEADER -->
        <header class="cv-header">
          <div class="cv-header__main">
            <div class="cv-avatar">
              <span class="cv-avatar__initials">GL</span>
            </div>
            <div class="cv-header__info">
              <h1 class="cv-name">Gaëtan LANGLET</h1>
              <p class="cv-title">Développeur Full-Stack & Architecte IA</p>
              <p class="cv-subtitle">Fondateur GL Digital Lab • Limoges, France</p>
            </div>
          </div>
          
          <div class="cv-header__contact">
            <a href="mailto:contact@gldigitallab.fr" class="cv-contact-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
              contact@gldigitallab.fr
            </a>
            <a href="https://gldigitallab.fr" target="_blank" class="cv-contact-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="2" y1="12" x2="22" y2="12"/>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
              </svg>
              gldigitallab.fr
            </a>
            <a href="https://github.com/GaetanLgt" target="_blank" class="cv-contact-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              github.com/GaetanLgt
            </a>
            <span class="cv-contact-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              Limoges, France
            </span>
          </div>
        </header>
        
        <!-- PROFILE -->
        <section class="cv-section">
          <h2 class="cv-section__title">
            <span class="cv-section__icon">👤</span>
            Profil
          </h2>
          <p class="cv-profile">
            Développeur full-stack passionné avec 5+ années d'expérience en développement web et automatisation. 
            Spécialisé en <strong>Symfony</strong>, <strong>Vue.js</strong> et <strong>intégration IA</strong>. 
            Fondateur de GL Digital Lab, studio de développement dédié aux solutions IA souveraines pour PME. 
            Gestionnaire de la communauté gaming ARKADIA FRANCE (150+ joueurs).
          </p>
        </section>
        
        <!-- SKILLS -->
        <section class="cv-section">
          <h2 class="cv-section__title">
            <span class="cv-section__icon">⚡</span>
            Compétences Techniques
          </h2>
          
          <div class="cv-skills">
            <div class="cv-skill-group">
              <h3 class="cv-skill-group__title">Backend</h3>
              <div class="cv-skill-tags">
                <span class="cv-skill-tag cv-skill-tag--primary">Symfony 8</span>
                <span class="cv-skill-tag cv-skill-tag--primary">PHP 8.3+</span>
                <span class="cv-skill-tag">Node.js</span>
                <span class="cv-skill-tag">API REST</span>
                <span class="cv-skill-tag">Doctrine</span>
              </div>
            </div>
            
            <div class="cv-skill-group">
              <h3 class="cv-skill-group__title">Frontend</h3>
              <div class="cv-skill-tags">
                <span class="cv-skill-tag cv-skill-tag--primary">Vue 3</span>
                <span class="cv-skill-tag cv-skill-tag--primary">TypeScript</span>
                <span class="cv-skill-tag">Three.js</span>
                <span class="cv-skill-tag">Vite</span>
                <span class="cv-skill-tag">Tailwind CSS</span>
              </div>
            </div>
            
            <div class="cv-skill-group">
              <h3 class="cv-skill-group__title">IA & Automation</h3>
              <div class="cv-skill-tags">
                <span class="cv-skill-tag cv-skill-tag--primary">n8n</span>
                <span class="cv-skill-tag cv-skill-tag--primary">Ollama</span>
                <span class="cv-skill-tag">Claude API</span>
                <span class="cv-skill-tag">RAG</span>
                <span class="cv-skill-tag">Nemotron</span>
              </div>
            </div>
            
            <div class="cv-skill-group">
              <h3 class="cv-skill-group__title">DevOps & Tools</h3>
              <div class="cv-skill-tags">
                <span class="cv-skill-tag cv-skill-tag--primary">Docker</span>
                <span class="cv-skill-tag">Git</span>
                <span class="cv-skill-tag">PostgreSQL</span>
                <span class="cv-skill-tag">GitHub Actions</span>
                <span class="cv-skill-tag">Linux</span>
              </div>
            </div>
          </div>
        </section>
        
        <!-- EXPERIENCE -->
        <section class="cv-section">
          <h2 class="cv-section__title">
            <span class="cv-section__icon">💼</span>
            Expériences Professionnelles
          </h2>
          
          <div class="cv-timeline">
            <article class="cv-job">
              <div class="cv-job__header">
                <div class="cv-job__title">
                  <h3>Fondateur & Lead Developer</h3>
                  <span class="cv-job__company">GL Digital Lab</span>
                </div>
                <span class="cv-job__date">2026 - Présent</span>
              </div>
              <ul class="cv-job__tasks">
                <li>Studio de développement web et IA pour PME</li>
                <li>Architecture de solutions IA souveraines (stack locale)</li>
                <li>Automatisation de workflows avec n8n et agents IA</li>
                <li>Développement d'applications Vue.js + Symfony</li>
              </ul>
              <div class="cv-job__stack">
                <span>Symfony 8</span>
                <span>Vue 3</span>
                <span>n8n</span>
                <span>Docker</span>
                <span>Ollama</span>
              </div>
            </article>
            
            <article class="cv-job">
              <div class="cv-job__header">
                <div class="cv-job__title">
                  <h3>Développeur Full-Stack</h3>
                  <span class="cv-job__company">IMA GIE</span>
                </div>
                <span class="cv-job__date">2021 - 2025</span>
              </div>
              <ul class="cv-job__tasks">
                <li>Développement et maintenance d'applications métier</li>
                <li>Intégration de systèmes et APIs tierces</li>
                <li>Participation aux sprints Agile/Scrum</li>
                <li>Documentation technique et code reviews</li>
              </ul>
              <div class="cv-job__stack">
                <span>PHP</span>
                <span>JavaScript</span>
                <span>SQL</span>
                <span>Git</span>
              </div>
            </article>
            
            <article class="cv-job">
              <div class="cv-job__header">
                <div class="cv-job__title">
                  <h3>Développeur Web (Stage)</h3>
                  <span class="cv-job__company">Superdev • Association Ouvre-Boîtes</span>
                </div>
                <span class="cv-job__date">2020</span>
              </div>
              <ul class="cv-job__tasks">
                <li>Création du site OVB avec WordPress/Timber/ACF</li>
                <li>Développement de thème custom avec Twig</li>
                <li>Formation client sur l'interface d'administration</li>
              </ul>
              <div class="cv-job__stack">
                <span>WordPress</span>
                <span>Timber</span>
                <span>Twig</span>
                <span>ACF</span>
                <span>SCSS</span>
              </div>
            </article>
          </div>
        </section>
        
        <!-- PROJECTS -->
        <section class="cv-section">
          <h2 class="cv-section__title">
            <span class="cv-section__icon">🚀</span>
            Projets Personnels
          </h2>
          
          <div class="cv-projects">
            <article class="cv-project">
              <div class="cv-project__header">
                <h3>🦖 ARKADIA FRANCE</h3>
                <span class="cv-project__type">Gaming Community</span>
              </div>
              <p>Cluster ARK Survival avec 150+ joueurs. Gestion serveurs via API, bots Discord, systèmes économiques et événements communautaires.</p>
              <div class="cv-project__stack">
                <span>Node.js</span>
                <span>Discord.js</span>
                <span>API Nitrado</span>
                <span>n8n</span>
              </div>
            </article>
            
            <article class="cv-project">
              <div class="cv-project__header">
                <h3>📺 MyTV Database</h3>
                <span class="cv-project__type">Side Project</span>
              </div>
              <p>Explorateur de séries TV avec API TVMaze. Recherche instantanée et affichage détaillé.</p>
              <div class="cv-project__stack">
                <span>Vue.js</span>
                <span>API REST</span>
                <span>Firebase</span>
              </div>
            </article>
            
            <article class="cv-project">
              <div class="cv-project__header">
                <h3>🧬 Zombunny</h3>
                <span class="cv-project__type">R&D</span>
              </div>
              <p>Étude des algorithmes génétiques avec Unity/C#. Simulation de sélection naturelle et comportements émergents.</p>
              <div class="cv-project__stack">
                <span>Unity</span>
                <span>C#</span>
                <span>IA Évolutionnaire</span>
              </div>
            </article>
          </div>
        </section>
        
        <!-- EDUCATION -->
        <section class="cv-section">
          <h2 class="cv-section__title">
            <span class="cv-section__icon">🎓</span>
            Formation
          </h2>
          
          <div class="cv-education">
            <article class="cv-edu">
              <div class="cv-edu__header">
                <h3>Titre Professionnel Développeur Web et Mobile</h3>
                <span class="cv-edu__date">2020</span>
              </div>
              <p class="cv-edu__school">AFORMAC • Limoges</p>
              <p class="cv-edu__desc">Formation intensive en développement web full-stack (PHP, JavaScript, SQL, CMS)</p>
            </article>
            
            <article class="cv-edu">
              <div class="cv-edu__header">
                <h3>Formation Continue - Symfony / PHP</h3>
                <span class="cv-edu__date">2021</span>
              </div>
              <p class="cv-edu__school">OpenClassrooms</p>
              <p class="cv-edu__desc">Spécialisation framework Symfony et architecture MVC</p>
            </article>
          </div>
        </section>
        
        <!-- LANGUAGES -->
        <section class="cv-section cv-section--inline">
          <div class="cv-inline-block">
            <h2 class="cv-section__title">
              <span class="cv-section__icon">🌍</span>
              Langues
            </h2>
            <ul class="cv-langs">
              <li><strong>Français</strong> — Natif</li>
              <li><strong>Anglais</strong> — Professionnel (B2)</li>
            </ul>
          </div>
          
          <div class="cv-inline-block">
            <h2 class="cv-section__title">
              <span class="cv-section__icon">💡</span>
              Centres d'intérêt
            </h2>
            <ul class="cv-interests">
              <li>Gaming & eSport</li>
              <li>Intelligence Artificielle</li>
              <li>Automatisation</li>
              <li>Community Management</li>
            </ul>
          </div>
        </section>
        
        <!-- FOOTER -->
        <footer class="cv-footer">
          <p>CV généré le {{ currentDate }} • gldigitallab.fr</p>
        </footer>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const cvContent = ref(null);

const currentDate = computed(() => {
  return new Date().toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
});

// For now, link to GitHub CV repo - in production you'd generate a real PDF
const pdfUrl = 'https://github.com/GaetanLgt/CV/raw/main/cv_Gaetan_LANGLET_Developpeur-full-stack.pdf';

function printCV() {
  window.print();
}
</script>

<style scoped>
.cv-page {
  min-height: 100vh;
  background: var(--bg);
  padding-top: 80px;
}

/* ACTIONS BAR */
.cv-actions {
  position: sticky;
  top: 80px;
  z-index: 50;
  background: var(--surface);
  border-bottom: 1px solid var(--border);
  padding: 1rem 0;
}

.cv-actions__inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.cv-back {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.75rem;
  color: var(--text-muted);
  text-decoration: none;
  transition: color 0.2s;
}

.cv-back:hover {
  color: var(--primary);
}

.cv-actions__btns {
  display: flex;
  gap: 0.75rem;
}

.cv-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1rem;
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 0.5rem;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.7rem;
  color: var(--text-muted);
  text-decoration: none;
  cursor: pointer;
  transition: all 0.2s;
}

.cv-btn:hover {
  border-color: var(--primary);
  color: var(--primary);
}

.cv-btn--primary {
  background: var(--primary);
  border-color: var(--primary);
  color: var(--bg);
}

.cv-btn--primary:hover {
  background: #059669;
}

/* CV CONTAINER */
.cv-container {
  max-width: 900px;
  margin: 0 auto;
  padding: var(--space-lg);
}

.cv-paper {
  background: #0a0a0a;
  border: 1px solid var(--border);
  border-radius: 1rem;
  padding: 3rem;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
}

/* HEADER */
.cv-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 2rem;
  padding-bottom: 2rem;
  border-bottom: 2px solid var(--primary);
  margin-bottom: 2rem;
}

.cv-header__main {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.cv-avatar {
  width: 80px;
  height: 80px;
  background: var(--primary-soft);
  border: 2px solid var(--primary);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cv-avatar__initials {
  font-family: 'JetBrains Mono', monospace;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--primary);
}

.cv-name {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
}

.cv-title {
  font-size: 1.1rem;
  color: var(--primary);
  margin-bottom: 0.25rem;
}

.cv-subtitle {
  font-size: 0.85rem;
  color: var(--text-dark);
}

.cv-header__contact {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  align-items: flex-end;
}

.cv-contact-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.7rem;
  color: var(--text-muted);
  text-decoration: none;
  transition: color 0.2s;
}

a.cv-contact-item:hover {
  color: var(--primary);
}

/* SECTIONS */
.cv-section {
  margin-bottom: 2rem;
}

.cv-section__title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1rem;
  font-weight: 700;
  color: var(--primary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--border);
}

.cv-section__icon {
  font-size: 1.25rem;
}

/* PROFILE */
.cv-profile {
  font-size: 0.95rem;
  color: var(--text-muted);
  line-height: 1.7;
}

.cv-profile strong {
  color: var(--text-main);
}

/* SKILLS */
.cv-skills {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
}

.cv-skill-group__title {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--text-main);
  margin-bottom: 0.5rem;
}

.cv-skill-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
}

.cv-skill-tag {
  padding: 0.25rem 0.6rem;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 4px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.65rem;
  color: var(--text-dark);
}

.cv-skill-tag--primary {
  background: var(--primary-soft);
  border-color: rgba(16, 185, 129, 0.3);
  color: var(--primary);
}

/* TIMELINE / JOBS */
.cv-timeline {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.cv-job {
  padding-left: 1.5rem;
  border-left: 2px solid var(--border);
  position: relative;
}

.cv-job::before {
  content: '';
  position: absolute;
  left: -6px;
  top: 0;
  width: 10px;
  height: 10px;
  background: var(--primary);
  border-radius: 50%;
}

.cv-job__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.75rem;
}

.cv-job__title h3 {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.15rem;
}

.cv-job__company {
  font-size: 0.8rem;
  color: var(--primary);
}

.cv-job__date {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.7rem;
  color: var(--text-dark);
  white-space: nowrap;
}

.cv-job__tasks {
  list-style: none;
  padding: 0;
  margin: 0 0 0.75rem 0;
}

.cv-job__tasks li {
  position: relative;
  padding-left: 1rem;
  font-size: 0.85rem;
  color: var(--text-muted);
  line-height: 1.6;
}

.cv-job__tasks li::before {
  content: '→';
  position: absolute;
  left: 0;
  color: var(--primary);
  font-size: 0.75rem;
}

.cv-job__stack {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
}

.cv-job__stack span {
  padding: 0.2rem 0.5rem;
  background: var(--surface);
  border-radius: 3px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.6rem;
  color: var(--text-dark);
}

/* PROJECTS */
.cv-projects {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.cv-project {
  padding: 1rem;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 0.5rem;
}

.cv-project__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.cv-project__header h3 {
  font-size: 0.85rem;
  font-weight: 600;
}

.cv-project__type {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.55rem;
  color: var(--primary);
  padding: 0.15rem 0.4rem;
  background: var(--primary-soft);
  border-radius: 3px;
}

.cv-project p {
  font-size: 0.75rem;
  color: var(--text-muted);
  line-height: 1.5;
  margin-bottom: 0.75rem;
}

.cv-project__stack {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
}

.cv-project__stack span {
  padding: 0.15rem 0.4rem;
  background: var(--bg);
  border-radius: 3px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.55rem;
  color: var(--text-dark);
}

/* EDUCATION */
.cv-education {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.cv-edu__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.cv-edu__header h3 {
  font-size: 0.95rem;
  font-weight: 600;
}

.cv-edu__date {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.7rem;
  color: var(--text-dark);
}

.cv-edu__school {
  font-size: 0.8rem;
  color: var(--primary);
  margin-bottom: 0.25rem;
}

.cv-edu__desc {
  font-size: 0.8rem;
  color: var(--text-muted);
}

/* INLINE SECTIONS */
.cv-section--inline {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

.cv-langs,
.cv-interests {
  list-style: none;
  padding: 0;
  margin: 0;
}

.cv-langs li,
.cv-interests li {
  font-size: 0.85rem;
  color: var(--text-muted);
  padding: 0.25rem 0;
}

.cv-interests {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.cv-interests li {
  padding: 0.3rem 0.75rem;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 2rem;
  font-size: 0.75rem;
}

/* FOOTER */
.cv-footer {
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border);
  text-align: center;
}

.cv-footer p {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.65rem;
  color: var(--text-dark);
}

/* PRINT STYLES */
@media print {
  .cv-page {
    padding-top: 0;
  }
  
  .cv-actions {
    display: none;
  }
  
  .cv-container {
    padding: 0;
    max-width: 100%;
  }
  
  .cv-paper {
    border: none;
    border-radius: 0;
    box-shadow: none;
    padding: 1.5cm;
    background: white;
    color: black;
  }
  
  .cv-name,
  .cv-section__title,
  .cv-job__title h3,
  .cv-project__header h3,
  .cv-edu__header h3,
  .cv-skill-group__title {
    color: black;
  }
  
  .cv-title,
  .cv-job__company,
  .cv-edu__school,
  .cv-section__title,
  .cv-project__type {
    color: #059669;
  }
  
  .cv-subtitle,
  .cv-contact-item,
  .cv-profile,
  .cv-job__tasks li,
  .cv-project p,
  .cv-edu__desc,
  .cv-langs li,
  .cv-interests li,
  .cv-job__date,
  .cv-edu__date,
  .cv-skill-tag,
  .cv-job__stack span,
  .cv-project__stack span {
    color: #333;
  }
  
  .cv-header {
    border-bottom-color: #059669;
  }
  
  .cv-job {
    border-left-color: #ddd;
  }
  
  .cv-job::before {
    background: #059669;
  }
  
  .cv-section__title {
    border-bottom-color: #ddd;
  }
}

/* RESPONSIVE */
@media (max-width: 768px) {
  .cv-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .cv-header__contact {
    align-items: flex-start;
  }
  
  .cv-skills {
    grid-template-columns: 1fr;
  }
  
  .cv-projects {
    grid-template-columns: 1fr;
  }
  
  .cv-section--inline {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .cv-paper {
    padding: 1.5rem;
  }
  
  .cv-actions__inner {
    flex-direction: column;
    gap: 1rem;
  }
}
</style>
