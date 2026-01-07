<template>
  <div class="sitemap-app">
    <header class="app-header">
      <div class="container">
        <router-link to="/apps" class="back-link">← Retour aux Apps</router-link>
      </div>
    </header>
    <main class="app-main">
      <div class="container">
        <div class="app-intro">
          <h1><span class="app-icon">🗺️</span> Sitemap Generator</h1>
          <p>Créez des sitemaps visuels et exportez en XML pour le SEO</p>
        </div>

        <div class="generator-layout">
          <!-- LEFT: Tree Editor -->
          <div class="tree-panel">
            <div class="panel-header">
              <h3>📂 Structure du site</h3>
              <button @click="addRootPage" class="add-btn">+ Page racine</button>
            </div>

            <div class="tree-container">
              <div v-for="page in pages" :key="page.id" class="tree-node">
                <div class="node-row" :class="{ selected: selectedPage === page.id }" @click="selectPage(page.id)">
                  <span class="node-icon">{{ page.children?.length ? '📁' : '📄' }}</span>
                  <input type="text" v-model="page.title" class="node-title" @click.stop>
                  <button @click.stop="addChild(page)" class="node-action" title="Ajouter enfant">+</button>
                  <button @click.stop="deletePage(page.id)" class="node-action delete" title="Supprimer">×</button>
                </div>
                
                <!-- Children -->
                <div v-if="page.children?.length" class="tree-children">
                  <div v-for="child in page.children" :key="child.id" class="tree-node">
                    <div class="node-row" :class="{ selected: selectedPage === child.id }" @click="selectPage(child.id)">
                      <span class="node-icon">{{ child.children?.length ? '📁' : '📄' }}</span>
                      <input type="text" v-model="child.title" class="node-title" @click.stop>
                      <button @click.stop="addChild(child)" class="node-action">+</button>
                      <button @click.stop="deleteChild(page, child.id)" class="node-action delete">×</button>
                    </div>
                    
                    <!-- Grandchildren -->
                    <div v-if="child.children?.length" class="tree-children">
                      <div v-for="grand in child.children" :key="grand.id" class="tree-node">
                        <div class="node-row" :class="{ selected: selectedPage === grand.id }" @click="selectPage(grand.id)">
                          <span class="node-icon">📄</span>
                          <input type="text" v-model="grand.title" class="node-title" @click.stop>
                          <button @click.stop="deleteGrandchild(page, child, grand.id)" class="node-action delete">×</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- RIGHT: Properties & Preview -->
          <div class="preview-panel">
            <!-- Page Properties -->
            <div class="props-section" v-if="currentPage">
              <h3>⚙️ Propriétés</h3>
              <div class="prop-field">
                <label>URL slug</label>
                <input type="text" v-model="currentPage.slug" placeholder="/page-url">
              </div>
              <div class="prop-field">
                <label>Priorité SEO</label>
                <select v-model="currentPage.priority">
                  <option value="1.0">1.0 (Très haute)</option>
                  <option value="0.8">0.8 (Haute)</option>
                  <option value="0.6">0.6 (Moyenne)</option>
                  <option value="0.4">0.4 (Basse)</option>
                  <option value="0.2">0.2 (Très basse)</option>
                </select>
              </div>
              <div class="prop-field">
                <label>Fréquence de MAJ</label>
                <select v-model="currentPage.changefreq">
                  <option value="always">Toujours</option>
                  <option value="hourly">Horaire</option>
                  <option value="daily">Quotidien</option>
                  <option value="weekly">Hebdomadaire</option>
                  <option value="monthly">Mensuel</option>
                  <option value="yearly">Annuel</option>
                  <option value="never">Jamais</option>
                </select>
              </div>
            </div>

            <!-- Visual Preview -->
            <div class="visual-section">
              <h3>👁️ Aperçu visuel</h3>
              <div class="sitemap-visual">
                <div class="visual-root">
                  <div class="visual-node root">🏠 Accueil</div>
                  <div class="visual-children">
                    <div v-for="page in pages" :key="page.id" class="visual-branch">
                      <div class="visual-node">{{ page.title }}</div>
                      <div v-if="page.children?.length" class="visual-children">
                        <div v-for="child in page.children" :key="child.id" class="visual-node small">{{ child.title }}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Export -->
            <div class="export-section">
              <h3>💾 Export</h3>
              <div class="export-field">
                <label>URL de base</label>
                <input type="url" v-model="baseUrl" placeholder="https://example.com">
              </div>
              <div class="export-actions">
                <button @click="copyXml" :class="{ copied }">{{ copied ? '✓ Copié' : '📋 XML' }}</button>
                <button @click="downloadXml">💾 Télécharger XML</button>
                <button @click="downloadJson">📦 JSON</button>
              </div>
            </div>

            <!-- XML Preview -->
            <div class="xml-section">
              <h3>📝 Sitemap XML</h3>
              <pre class="xml-preview">{{ generatedXml }}</pre>
            </div>
          </div>
        </div>

        <!-- Templates -->
        <div class="templates-section">
          <h3>📦 Templates</h3>
          <div class="templates-grid">
            <button @click="loadTemplate('corporate')">🏢 Corporate</button>
            <button @click="loadTemplate('blog')">📝 Blog</button>
            <button @click="loadTemplate('ecommerce')">🛒 E-commerce</button>
            <button @click="loadTemplate('portfolio')">💼 Portfolio</button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const pages = ref([]);
const selectedPage = ref(null);
const baseUrl = ref('https://example.com');
const copied = ref(false);
let idCounter = 1;

const currentPage = computed(() => findPage(selectedPage.value));

function findPage(id, list = pages.value) {
  for (const page of list) {
    if (page.id === id) return page;
    if (page.children) {
      const found = findPage(id, page.children);
      if (found) return found;
    }
  }
  return null;
}

function addRootPage() {
  pages.value.push({
    id: idCounter++,
    title: 'Nouvelle page',
    slug: '/nouvelle-page',
    priority: '0.8',
    changefreq: 'weekly',
    children: []
  });
}

function addChild(parent) {
  if (!parent.children) parent.children = [];
  parent.children.push({
    id: idCounter++,
    title: 'Sous-page',
    slug: parent.slug + '/sous-page',
    priority: '0.6',
    changefreq: 'monthly',
    children: []
  });
}

function selectPage(id) {
  selectedPage.value = id;
}

function deletePage(id) {
  pages.value = pages.value.filter(p => p.id !== id);
  if (selectedPage.value === id) selectedPage.value = null;
}

function deleteChild(parent, id) {
  parent.children = parent.children.filter(c => c.id !== id);
  if (selectedPage.value === id) selectedPage.value = null;
}

function deleteGrandchild(grandparent, parent, id) {
  parent.children = parent.children.filter(c => c.id !== id);
  if (selectedPage.value === id) selectedPage.value = null;
}

function getAllPages(list = pages.value, results = []) {
  for (const page of list) {
    results.push(page);
    if (page.children?.length) {
      getAllPages(page.children, results);
    }
  }
  return results;
}

const generatedXml = computed(() => {
  const allPages = getAllPages();
  const urls = allPages.map(page => `  <url>
    <loc>${baseUrl.value}${page.slug}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n');
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl.value}/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
${urls}
</urlset>`;
});

async function copyXml() {
  await navigator.clipboard.writeText(generatedXml.value);
  copied.value = true;
  setTimeout(() => copied.value = false, 2000);
}

function downloadXml() {
  const blob = new Blob([generatedXml.value], { type: 'application/xml' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'sitemap.xml';
  a.click();
}

function downloadJson() {
  const data = { baseUrl: baseUrl.value, pages: pages.value };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'sitemap.json';
  a.click();
}

function loadTemplate(type) {
  idCounter = 1;
  
  if (type === 'corporate') {
    pages.value = [
      { id: idCounter++, title: 'À propos', slug: '/a-propos', priority: '0.8', changefreq: 'monthly', children: [
        { id: idCounter++, title: 'Équipe', slug: '/a-propos/equipe', priority: '0.6', changefreq: 'monthly', children: [] },
        { id: idCounter++, title: 'Histoire', slug: '/a-propos/histoire', priority: '0.6', changefreq: 'yearly', children: [] }
      ]},
      { id: idCounter++, title: 'Services', slug: '/services', priority: '0.9', changefreq: 'monthly', children: [
        { id: idCounter++, title: 'Consulting', slug: '/services/consulting', priority: '0.8', changefreq: 'monthly', children: [] },
        { id: idCounter++, title: 'Formation', slug: '/services/formation', priority: '0.8', changefreq: 'monthly', children: [] }
      ]},
      { id: idCounter++, title: 'Contact', slug: '/contact', priority: '0.7', changefreq: 'yearly', children: [] }
    ];
  } else if (type === 'blog') {
    pages.value = [
      { id: idCounter++, title: 'Blog', slug: '/blog', priority: '0.9', changefreq: 'daily', children: [
        { id: idCounter++, title: 'Catégorie 1', slug: '/blog/categorie-1', priority: '0.7', changefreq: 'weekly', children: [] },
        { id: idCounter++, title: 'Catégorie 2', slug: '/blog/categorie-2', priority: '0.7', changefreq: 'weekly', children: [] }
      ]},
      { id: idCounter++, title: 'À propos', slug: '/a-propos', priority: '0.6', changefreq: 'yearly', children: [] },
      { id: idCounter++, title: 'Contact', slug: '/contact', priority: '0.6', changefreq: 'yearly', children: [] }
    ];
  } else if (type === 'ecommerce') {
    pages.value = [
      { id: idCounter++, title: 'Produits', slug: '/produits', priority: '1.0', changefreq: 'daily', children: [
        { id: idCounter++, title: 'Catégorie A', slug: '/produits/categorie-a', priority: '0.9', changefreq: 'weekly', children: [] },
        { id: idCounter++, title: 'Catégorie B', slug: '/produits/categorie-b', priority: '0.9', changefreq: 'weekly', children: [] },
        { id: idCounter++, title: 'Promotions', slug: '/produits/promotions', priority: '0.8', changefreq: 'daily', children: [] }
      ]},
      { id: idCounter++, title: 'Panier', slug: '/panier', priority: '0.3', changefreq: 'never', children: [] },
      { id: idCounter++, title: 'FAQ', slug: '/faq', priority: '0.6', changefreq: 'monthly', children: [] }
    ];
  } else if (type === 'portfolio') {
    pages.value = [
      { id: idCounter++, title: 'Projets', slug: '/projets', priority: '0.9', changefreq: 'weekly', children: [
        { id: idCounter++, title: 'Web', slug: '/projets/web', priority: '0.8', changefreq: 'monthly', children: [] },
        { id: idCounter++, title: 'Mobile', slug: '/projets/mobile', priority: '0.8', changefreq: 'monthly', children: [] }
      ]},
      { id: idCounter++, title: 'Services', slug: '/services', priority: '0.8', changefreq: 'monthly', children: [] },
      { id: idCounter++, title: 'Contact', slug: '/contact', priority: '0.7', changefreq: 'yearly', children: [] }
    ];
  }
}

// Load default
loadTemplate('corporate');
</script>

<style scoped>
.sitemap-app { min-height: 100vh; background: var(--bg-primary); }
.app-header { padding: 1rem 0; border-bottom: 1px solid var(--border); }
.back-link { color: var(--text-muted); text-decoration: none; }
.app-main { padding: var(--space-lg) 0; }
.app-intro { text-align: center; margin-bottom: 1.5rem; }
.app-intro h1 { display: flex; justify-content: center; gap: 0.5rem; font-size: 1.75rem; }
.app-icon { font-size: 2rem; }

.generator-layout { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-bottom: 2rem; }

.tree-panel, .preview-panel { background: rgba(255,255,255,0.02); border: 1px solid var(--border); border-radius: 0.5rem; }
.panel-header { display: flex; justify-content: space-between; align-items: center; padding: 1rem; border-bottom: 1px solid var(--border); }
.panel-header h3 { font-size: 0.95rem; margin: 0; }
.add-btn { padding: 0.4rem 0.75rem; background: var(--primary); border: none; border-radius: 0.25rem; font-size: 0.8rem; color: var(--bg-primary); cursor: pointer; }

.tree-container { padding: 1rem; max-height: 500px; overflow-y: auto; }
.tree-node { margin-bottom: 0.25rem; }
.tree-children { margin-left: 1.5rem; padding-left: 0.75rem; border-left: 1px dashed var(--border); }
.node-row { display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem; border-radius: 0.35rem; cursor: pointer; }
.node-row:hover { background: rgba(255,255,255,0.05); }
.node-row.selected { background: rgba(0,255,136,0.1); border: 1px solid var(--primary); }
.node-icon { font-size: 1rem; }
.node-title { flex: 1; padding: 0.25rem 0.5rem; background: rgba(0,0,0,0.2); border: 1px solid transparent; border-radius: 0.25rem; font-size: 0.85rem; color: var(--text-main); }
.node-title:focus { border-color: var(--primary); outline: none; }
.node-action { width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; background: transparent; border: 1px solid var(--border); border-radius: 0.25rem; color: var(--text-muted); cursor: pointer; font-size: 0.9rem; }
.node-action:hover { border-color: var(--primary); color: var(--primary); }
.node-action.delete:hover { border-color: #EF4444; color: #EF4444; }

.preview-panel { padding: 1rem; display: flex; flex-direction: column; gap: 1.5rem; }
.preview-panel h3 { font-size: 0.95rem; margin-bottom: 0.75rem; }

.props-section { padding-bottom: 1rem; border-bottom: 1px solid var(--border); }
.prop-field { margin-bottom: 0.75rem; }
.prop-field label { display: block; font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.25rem; }
.prop-field input, .prop-field select { width: 100%; padding: 0.5rem; background: rgba(0,0,0,0.3); border: 1px solid var(--border); border-radius: 0.35rem; color: var(--text-main); font-size: 0.85rem; }

.visual-section .sitemap-visual { padding: 1rem; background: rgba(0,0,0,0.2); border-radius: 0.5rem; overflow-x: auto; }
.visual-root { display: flex; flex-direction: column; align-items: center; }
.visual-node { padding: 0.5rem 1rem; background: rgba(255,255,255,0.1); border: 1px solid var(--border); border-radius: 0.35rem; font-size: 0.8rem; margin: 0.25rem; white-space: nowrap; }
.visual-node.root { background: var(--primary); color: var(--bg-primary); font-weight: 600; }
.visual-node.small { font-size: 0.7rem; padding: 0.35rem 0.75rem; }
.visual-children { display: flex; flex-wrap: wrap; justify-content: center; gap: 0.5rem; margin-top: 0.5rem; padding-top: 0.5rem; border-top: 1px dashed var(--border); }
.visual-branch { display: flex; flex-direction: column; align-items: center; }

.export-field { margin-bottom: 0.75rem; }
.export-field label { display: block; font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.25rem; }
.export-field input { width: 100%; padding: 0.5rem; background: rgba(0,0,0,0.3); border: 1px solid var(--border); border-radius: 0.35rem; color: var(--text-main); font-size: 0.85rem; }
.export-actions { display: flex; gap: 0.5rem; }
.export-actions button { padding: 0.5rem 0.75rem; background: rgba(255,255,255,0.05); border: 1px solid var(--border); border-radius: 0.35rem; color: var(--text-muted); cursor: pointer; font-size: 0.8rem; }
.export-actions button:hover { border-color: var(--primary); color: var(--primary); }
.export-actions button.copied { background: var(--primary); border-color: var(--primary); color: var(--bg-primary); }

.xml-preview { padding: 0.75rem; background: rgba(0,0,0,0.3); border-radius: 0.35rem; font-family: monospace; font-size: 0.7rem; color: var(--text-secondary); max-height: 200px; overflow: auto; white-space: pre-wrap; }

.templates-section h3 { font-size: 1rem; margin-bottom: 0.75rem; }
.templates-grid { display: flex; flex-wrap: wrap; gap: 0.75rem; }
.templates-grid button { padding: 0.6rem 1rem; background: rgba(255,255,255,0.02); border: 1px solid var(--border); border-radius: 0.5rem; color: var(--text-muted); cursor: pointer; }
.templates-grid button:hover { border-color: var(--primary); color: var(--primary); }

@media (max-width: 968px) { .generator-layout { grid-template-columns: 1fr; } }
</style>
