<template>
  <div class="sitemap-page">
    <!-- BACKGROUND -->
    <div class="page-bg" aria-hidden="true">
      <div class="grid-pattern"></div>
      <div class="glow-orb glow-orb--1"></div>
      <div class="glow-orb glow-orb--2"></div>
    </div>

    <!-- HEADER -->
    <header class="page-header">
      <div class="container">
        <div class="header-badge">
          <span class="badge-icon">🗺️</span>
          <span class="badge-text">ARCHITECTURE</span>
        </div>
        <h1 class="page-title">
          <span class="title-pre">Plan du site</span>
          <span class="title-main">CARTE APPLICATIVE</span>
        </h1>
        <p class="page-desc">
          Explorez l'ensemble des {{ totalPages }} pages et {{ totalApps }} applications de ce portfolio.
          Cliquez sur n'importe quelle section pour y accéder.
        </p>

        <!-- Stats -->
        <div class="stats-row">
          <div class="stat-item">
            <span class="stat-value">{{ totalPages }}</span>
            <span class="stat-label">Pages</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">{{ totalApps }}</span>
            <span class="stat-label">Apps</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">{{ totalFormations }}</span>
            <span class="stat-label">Formations</span>
          </div>
        </div>

        <!-- View Toggle -->
        <div class="view-toggle">
          <button 
            :class="{ active: viewMode === 'tree' }" 
            @click="viewMode = 'tree'"
          >
            🌳 Arborescence
          </button>
          <button 
            :class="{ active: viewMode === 'grid' }" 
            @click="viewMode = 'grid'"
          >
            📦 Grille
          </button>
          <button 
            :class="{ active: viewMode === 'list' }" 
            @click="viewMode = 'list'"
          >
            📋 Liste
          </button>
        </div>
      </div>
    </header>

    <!-- MAIN CONTENT -->
    <main class="main-content">
      <div class="container">
        
        <!-- TREE VIEW -->
        <div v-if="viewMode === 'tree'" class="tree-view">
          <div class="tree-root">
            <router-link to="/" class="tree-node root-node">
              <span class="node-icon">🏠</span>
              <span class="node-label">gldigitallab.fr</span>
            </router-link>

            <div class="tree-branches">
              <div v-for="section in sections" :key="section.id" class="tree-branch">
                <div class="branch-header" @click="toggleSection(section.id)">
                  <span class="branch-toggle">{{ expandedSections.includes(section.id) ? '▼' : '▶' }}</span>
                  <span class="branch-icon">{{ section.icon }}</span>
                  <span class="branch-title">{{ section.title }}</span>
                  <span class="branch-count">{{ section.pages.length }}</span>
                </div>

                <div v-if="expandedSections.includes(section.id)" class="branch-children">
                  <router-link 
                    v-for="page in section.pages" 
                    :key="page.path" 
                    :to="page.path"
                    class="tree-leaf"
                  >
                    <span class="leaf-icon">{{ page.icon }}</span>
                    <span class="leaf-label">{{ page.name }}</span>
                    <span v-if="page.isNew" class="leaf-badge new">NEW</span>
                    <span v-if="page.count" class="leaf-badge count">{{ page.count }}</span>
                  </router-link>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- GRID VIEW -->
        <div v-if="viewMode === 'grid'" class="grid-view">
          <div v-for="section in sections" :key="section.id" class="grid-section">
            <h2 class="section-title">
              <span class="section-icon">{{ section.icon }}</span>
              {{ section.title }}
              <span class="section-count">({{ section.pages.length }})</span>
            </h2>
            <div class="section-grid">
              <router-link 
                v-for="page in section.pages" 
                :key="page.path" 
                :to="page.path"
                class="grid-card"
                :class="{ 'card--featured': page.featured }"
              >
                <span v-if="page.isNew" class="card-badge">NEW</span>
                <div class="card-icon">{{ page.icon }}</div>
                <div class="card-name">{{ page.name }}</div>
                <div class="card-path">{{ page.path }}</div>
              </router-link>
            </div>
          </div>
        </div>

        <!-- LIST VIEW -->
        <div v-if="viewMode === 'list'" class="list-view">
          <div class="list-header">
            <span class="col-icon">📄</span>
            <span class="col-name">Page</span>
            <span class="col-path">Chemin</span>
            <span class="col-section">Section</span>
          </div>
          <div class="list-body">
            <router-link 
              v-for="page in allPages" 
              :key="page.path" 
              :to="page.path"
              class="list-row"
            >
              <span class="col-icon">{{ page.icon }}</span>
              <span class="col-name">
                {{ page.name }}
                <span v-if="page.isNew" class="inline-badge">NEW</span>
              </span>
              <span class="col-path">{{ page.path }}</span>
              <span class="col-section">{{ page.section }}</span>
            </router-link>
          </div>
        </div>

      </div>
    </main>

    <!-- QUICK ACCESS -->
    <section class="quick-access">
      <div class="container">
        <h2 class="quick-title">⚡ Accès Rapide</h2>
        <div class="quick-grid">
          <router-link to="/" class="quick-card">
            <span class="quick-icon">🏠</span>
            <span class="quick-label">Accueil</span>
          </router-link>
          <router-link to="/contact" class="quick-card">
            <span class="quick-icon">📧</span>
            <span class="quick-label">Contact</span>
          </router-link>
          <router-link to="/carte-holistique" class="quick-card">
            <span class="quick-icon">🗺️</span>
            <span class="quick-label">Carte</span>
          </router-link>
        </div>
      </div>
    </section>

    <!-- TECH STACK -->
    <section class="tech-section">
      <div class="container">
        <h2 class="section-heading">🛠️ Stack Technique</h2>
        <div class="tech-grid">
          <div class="tech-card">
            <span class="tech-icon">⚡</span>
            <span class="tech-name">Vue 3</span>
            <span class="tech-desc">Composition API</span>
          </div>
          <div class="tech-card">
            <span class="tech-icon">🎨</span>
            <span class="tech-name">Naive UI</span>
            <span class="tech-desc">Composants</span>
          </div>
          <div class="tech-card">
            <span class="tech-icon">🚀</span>
            <span class="tech-name">Vite</span>
            <span class="tech-desc">Build tool</span>
          </div>
          <div class="tech-card">
            <span class="tech-icon">🎭</span>
            <span class="tech-name">Three.js</span>
            <span class="tech-desc">3D/WebGL</span>
          </div>
          <div class="tech-card">
            <span class="tech-icon">🔀</span>
            <span class="tech-name">Vue Router</span>
            <span class="tech-desc">Navigation</span>
          </div>
          <div class="tech-card">
            <span class="tech-icon">📊</span>
            <span class="tech-name">Matomo</span>
            <span class="tech-desc">Analytics RGPD</span>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const viewMode = ref('tree');
const expandedSections = ref(['core', 'apps']);

const sections = ref([
  {
    id: 'core',
    title: 'Pages Principales',
    icon: '🏠',
    pages: [
      { name: 'Accueil', path: '/', icon: '🏠', featured: true },
      { name: 'Hub / QG', path: '/hub', icon: '🎯' },
      { name: 'Services', path: '/services', icon: '💼' },
      { name: 'Projets', path: '/projets', icon: '📂' },
      { name: 'Contact', path: '/contact', icon: '📧' },
      { name: 'Carte Holistique', path: '/carte-holistique', icon: '🗺️' },
    ]
  },
  {
    id: 'projects',
    title: 'Case Studies',
    icon: '📊',
    pages: [
      { name: 'ARKADIA France (ARK)', path: '/arkadia', icon: '🦖', featured: true },
      { name: 'VoyageoPro', path: '/voyageo-pro', icon: '✈️' },
    ]
  },
  {
    id: 'apps',
    title: 'Applications',
    icon: '🧰',
    pages: [
      // Applications conservées
      { name: 'Wa Router', path: '/apps/agent/wa', icon: '🧭' },
      { name: 'Makoto Scanner', path: '/apps/agent/makoto', icon: '🛡️' },
      { name: 'Dou Monitor', path: '/apps/agent/dou', icon: '📊' },
      { name: 'Watashi Knowledge Base', path: '/apps/agent/watashi', icon: '🗄️' },
      { name: 'Jitsu Pipeline', path: '/apps/agent/jitsu', icon: '🚀' },
      { name: 'SEO Content Generator', path: '/apps/seo-content', icon: '📈' },
      { name: 'Invoice Generator', path: '/apps/invoice-generator', icon: '🧾' },
    ]
  },
  {
    id: 'legal',
    title: 'Légal',
    icon: '⚖️',
    pages: [
      { name: 'Mentions Légales', path: '/mentions-legales', icon: '📜' },
      { name: 'Confidentialité', path: '/confidentialite', icon: '🔒' },
      { name: 'CGV', path: '/cgv', icon: '📋' },
    ]
  },
  {
    id: 'tools',
    title: 'Outils Admin',
    icon: '🔧',
    pages: [
      { name: 'ARK Admin Portal', path: '/ark-admin', icon: '🦖' },
      { name: 'Tutoriels', path: '/ressources/tutoriels', icon: '📚' },
    ]
  },
]);

// Computed
const totalPages = computed(() => {
  return sections.value.reduce((acc, section) => acc + section.pages.length, 0);
});

const totalApps = computed(() => {
  const appsSection = sections.value.find(s => s.id === 'apps');
  return appsSection ? appsSection.pages.length : 0;
});

const totalFormations = computed(() => {
  const formationSection = sections.value.find(s => s.id === 'formation');
  return formationSection ? formationSection.pages.length - 2 : 0; // -2 pour hub et challenges
});

const allPages = computed(() => {
  const pages = [];
  sections.value.forEach(section => {
    section.pages.forEach(page => {
      pages.push({
        ...page,
        section: section.title
      });
    });
  });
  return pages;
});

// Methods
const toggleSection = (sectionId) => {
  const index = expandedSections.value.indexOf(sectionId);
  if (index > -1) {
    expandedSections.value.splice(index, 1);
  } else {
    expandedSections.value.push(sectionId);
  }
};
</script>

<style scoped>
.sitemap-page {
  min-height: 100vh;
  background: var(--bg-primary, #0a0a0a);
  color: var(--text-main, #f5f5f5);
  position: relative;
}

/* Background */
.page-bg {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
}

.grid-pattern {
  position: absolute;
  inset: 0;
  background-image: 
    linear-gradient(rgba(0, 255, 136, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 255, 136, 0.03) 1px, transparent 1px);
  background-size: 50px 50px;
}

.glow-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(100px);
  opacity: 0.2;
}

.glow-orb--1 {
  width: 500px;
  height: 500px;
  background: var(--primary, #00ff88);
  top: -150px;
  right: -150px;
}

.glow-orb--2 {
  width: 400px;
  height: 400px;
  background: #8B5CF6;
  bottom: -100px;
  left: -100px;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
  position: relative;
  z-index: 1;
}

/* Header */
.page-header {
  padding: calc(80px + 3rem) 0 3rem;
  text-align: center;
}

.header-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: rgba(0, 255, 136, 0.1);
  border: 1px solid rgba(0, 255, 136, 0.3);
  border-radius: 2rem;
  margin-bottom: 1.5rem;
}

.badge-icon { font-size: 1.25rem; }
.badge-text {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--primary, #00ff88);
  letter-spacing: 0.1em;
}

.page-title {
  margin-bottom: 1.5rem;
}

.title-pre {
  display: block;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.8rem;
  color: var(--text-muted, #737373);
  letter-spacing: 0.2em;
  text-transform: uppercase;
  margin-bottom: 0.5rem;
}

.title-main {
  display: block;
  font-size: clamp(2rem, 6vw, 4rem);
  font-weight: 800;
  background: linear-gradient(135deg, #fff 0%, var(--primary, #00ff88) 50%, #8B5CF6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.page-desc {
  max-width: 600px;
  margin: 0 auto 2rem;
  font-size: 1.1rem;
  color: var(--text-secondary, #a3a3a3);
}

/* Stats */
.stats-row {
  display: flex;
  justify-content: center;
  gap: 3rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.stat-item {
  text-align: center;
}

.stat-value {
  display: block;
  font-family: 'JetBrains Mono', monospace;
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--primary, #00ff88);
}

.stat-label {
  font-size: 0.8rem;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* View Toggle */
.view-toggle {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
}

.view-toggle button {
  padding: 0.75rem 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.5rem;
  color: var(--text-secondary);
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.view-toggle button:hover {
  border-color: var(--primary);
  color: var(--primary);
}

.view-toggle button.active {
  background: var(--primary);
  border-color: var(--primary);
  color: #000;
}

/* Main Content */
.main-content {
  padding: 3rem 0;
}

/* TREE VIEW */
.tree-view {
  max-width: 900px;
  margin: 0 auto;
}

.tree-root {
  position: relative;
}

.root-node {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  background: rgba(0, 255, 136, 0.1);
  border: 2px solid var(--primary);
  border-radius: 1rem;
  text-decoration: none;
  color: var(--primary);
  font-weight: 600;
  font-size: 1.1rem;
  margin-bottom: 1.5rem;
  transition: all 0.3s;
}

.root-node:hover {
  background: var(--primary);
  color: #000;
}

.node-icon { font-size: 1.5rem; }

.tree-branches {
  padding-left: 2rem;
  border-left: 2px solid rgba(255, 255, 255, 0.1);
}

.tree-branch {
  margin-bottom: 0.5rem;
}

.branch-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.3s;
}

.branch-header:hover {
  border-color: var(--primary);
  background: rgba(0, 255, 136, 0.05);
}

.branch-toggle {
  font-size: 0.7rem;
  color: var(--text-muted);
  width: 1rem;
}

.branch-icon { font-size: 1.25rem; }

.branch-title {
  flex: 1;
  font-weight: 600;
}

.branch-count {
  background: rgba(255, 255, 255, 0.1);
  padding: 0.2rem 0.5rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-family: 'JetBrains Mono', monospace;
}

.branch-children {
  padding: 0.5rem 0 0.5rem 2.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.tree-leaf {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  text-decoration: none;
  color: var(--text-secondary);
  border-radius: 0.5rem;
  transition: all 0.2s;
}

.tree-leaf:hover {
  background: rgba(0, 255, 136, 0.1);
  color: var(--primary);
}

.leaf-icon { font-size: 1rem; }
.leaf-label { flex: 1; }

.leaf-badge {
  padding: 0.15rem 0.5rem;
  border-radius: 1rem;
  font-size: 0.6rem;
  font-weight: 600;
  text-transform: uppercase;
}

.leaf-badge.new {
  background: rgba(255, 193, 7, 0.2);
  color: #ffc107;
}

.leaf-badge.count {
  background: rgba(139, 92, 246, 0.2);
  color: #a855f7;
}

/* GRID VIEW */
.grid-view {
  display: flex;
  flex-direction: column;
  gap: 3rem;
}

.grid-section {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 1rem;
  padding: 1.5rem;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.25rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.section-icon { font-size: 1.5rem; }

.section-count {
  color: var(--text-muted);
  font-weight: 400;
  font-size: 0.9rem;
}

.section-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 1rem;
}

.grid-card {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1.5rem 1rem;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.75rem;
  text-decoration: none;
  text-align: center;
  transition: all 0.3s;
}

.grid-card:hover {
  border-color: var(--primary);
  transform: translateY(-4px);
  box-shadow: 0 10px 30px rgba(0, 255, 136, 0.1);
}

.grid-card.card--featured {
  border-color: rgba(0, 255, 136, 0.3);
}

.card-badge {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  padding: 0.2rem 0.5rem;
  background: rgba(255, 193, 7, 0.2);
  border: 1px solid rgba(255, 193, 7, 0.5);
  border-radius: 1rem;
  font-size: 0.55rem;
  font-weight: 600;
  color: #ffc107;
}

.card-icon {
  font-size: 2rem;
}

.card-name {
  font-weight: 600;
  color: var(--text-main);
  font-size: 0.9rem;
}

.card-path {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.65rem;
  color: var(--text-muted);
}

/* LIST VIEW */
.list-view {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 1rem;
  overflow: hidden;
}

.list-header {
  display: grid;
  grid-template-columns: 40px 1fr 200px 150px;
  gap: 1rem;
  padding: 1rem 1.5rem;
  background: rgba(0, 0, 0, 0.3);
  font-weight: 600;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-muted);
}

.list-body {
  max-height: 600px;
  overflow-y: auto;
}

.list-row {
  display: grid;
  grid-template-columns: 40px 1fr 200px 150px;
  gap: 1rem;
  padding: 0.75rem 1.5rem;
  text-decoration: none;
  color: var(--text-secondary);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  transition: all 0.2s;
}

.list-row:hover {
  background: rgba(0, 255, 136, 0.05);
  color: var(--text-main);
}

.col-icon { text-align: center; font-size: 1.1rem; }
.col-name { font-weight: 500; }
.col-path {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.8rem;
  color: var(--text-muted);
}
.col-section { color: var(--text-muted); font-size: 0.85rem; }

.inline-badge {
  display: inline-block;
  margin-left: 0.5rem;
  padding: 0.1rem 0.4rem;
  background: rgba(255, 193, 7, 0.2);
  color: #ffc107;
  border-radius: 1rem;
  font-size: 0.6rem;
  font-weight: 600;
}

/* Quick Access */
.quick-access {
  padding: 4rem 0;
  background: rgba(0, 0, 0, 0.3);
}

.quick-title {
  text-align: center;
  font-size: 1.5rem;
  margin-bottom: 2rem;
}

.quick-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 1rem;
  max-width: 900px;
  margin: 0 auto;
}

.quick-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1.5rem 1rem;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 1rem;
  text-decoration: none;
  transition: all 0.3s;
}

.quick-card:hover {
  border-color: var(--primary);
  transform: translateY(-4px);
  box-shadow: 0 10px 30px rgba(0, 255, 136, 0.15);
}

.quick-icon { font-size: 2rem; }
.quick-label {
  color: var(--text-main);
  font-weight: 500;
  font-size: 0.9rem;
}

/* Tech Section */
.tech-section {
  padding: 4rem 0;
}

.section-heading {
  text-align: center;
  font-size: 1.5rem;
  margin-bottom: 2rem;
}

.tech-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  max-width: 900px;
  margin: 0 auto;
}

.tech-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  padding: 1.5rem 1rem;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 1rem;
  text-align: center;
}

.tech-icon { font-size: 2rem; }
.tech-name { font-weight: 600; color: var(--text-main); }
.tech-desc { font-size: 0.8rem; color: var(--text-muted); }

/* Responsive */
@media (max-width: 768px) {
  .stats-row {
    gap: 1.5rem;
  }
  
  .stat-value {
    font-size: 2rem;
  }
  
  .view-toggle {
    flex-wrap: wrap;
  }
  
  .list-header,
  .list-row {
    grid-template-columns: 40px 1fr;
  }
  
  .col-path,
  .col-section {
    display: none;
  }
  
  .tree-branches {
    padding-left: 1rem;
  }
  
  .branch-children {
    padding-left: 1.5rem;
  }
}
</style>
