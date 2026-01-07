<template>
  <div class="faq-app">
    <header class="app-header">
      <div class="container">
        <router-link to="/apps" class="back-link">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
          </svg>
          Retour aux Apps
        </router-link>
      </div>
    </header>

    <main class="app-main">
      <div class="container">
        <div class="app-intro">
          <h1><span class="app-icon">❓</span> FAQ Generator</h1>
          <p>Créez des FAQ élégantes avec export HTML/Markdown/JSON</p>
        </div>

        <!-- ADD ITEM -->
        <div class="add-section">
          <div class="input-row">
            <input type="text" v-model="newQuestion" placeholder="Question..." class="question-input" @keyup.enter="addItem">
          </div>
          <textarea v-model="newAnswer" placeholder="Réponse..." class="answer-input"></textarea>
          <div class="add-actions">
            <select v-model="newCategory" class="category-select">
              <option value="">Sans catégorie</option>
              <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
              <option value="__new__">+ Nouvelle catégorie</option>
            </select>
            <button class="add-btn" @click="addItem" :disabled="!newQuestion || !newAnswer">➕ Ajouter</button>
          </div>
        </div>

        <!-- NEW CATEGORY MODAL -->
        <div v-if="newCategory === '__new__'" class="new-cat-row">
          <input type="text" v-model="newCategoryName" placeholder="Nom de la catégorie" class="cat-input">
          <button @click="addCategory" class="cat-btn">Créer</button>
          <button @click="newCategory = ''" class="cat-btn cat-btn--cancel">Annuler</button>
        </div>

        <!-- FAQ LIST -->
        <div class="faq-list" v-if="faqItems.length">
          <h2>📋 Vos questions ({{ faqItems.length }})</h2>
          
          <div v-for="cat in usedCategories" :key="cat" class="faq-category">
            <h3 v-if="cat" class="category-title">{{ cat }}</h3>
            
            <div v-for="(item, i) in getItemsByCategory(cat)" :key="item.id" class="faq-item" :class="{ editing: editingId === item.id }">
              <div class="faq-header" @click="toggleExpand(item.id)">
                <span class="faq-num">Q{{ getGlobalIndex(item) + 1 }}</span>
                <span class="faq-question">{{ item.question }}</span>
                <span class="faq-toggle">{{ expandedId === item.id ? '−' : '+' }}</span>
              </div>
              
              <div class="faq-body" v-if="expandedId === item.id">
                <p class="faq-answer">{{ item.answer }}</p>
                <div class="faq-actions">
                  <button @click="startEdit(item)" class="action-btn">✏️ Modifier</button>
                  <button @click="moveUp(item)" :disabled="i === 0" class="action-btn">⬆️</button>
                  <button @click="moveDown(item)" :disabled="i === getItemsByCategory(cat).length - 1" class="action-btn">⬇️</button>
                  <button @click="deleteItem(item.id)" class="action-btn action-btn--danger">🗑️</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- EMPTY STATE -->
        <div v-else class="empty-state">
          <span class="empty-icon">📝</span>
          <p>Ajoutez votre première question ci-dessus</p>
        </div>

        <!-- PREVIEW -->
        <div class="preview-section" v-if="faqItems.length">
          <h2>👁️ Prévisualisation</h2>
          <div class="preview-tabs">
            <button v-for="tab in ['html', 'markdown', 'json']" :key="tab" 
              :class="{ active: previewTab === tab }" 
              @click="previewTab = tab">
              {{ tab.toUpperCase() }}
            </button>
          </div>
          <div class="preview-content">
            <pre v-if="previewTab === 'html'">{{ generatedHtml }}</pre>
            <pre v-if="previewTab === 'markdown'">{{ generatedMarkdown }}</pre>
            <pre v-if="previewTab === 'json'">{{ generatedJson }}</pre>
          </div>
          <div class="preview-actions">
            <button @click="copyOutput" class="export-btn" :class="{ copied }">
              {{ copied ? '✓ Copié !' : '📋 Copier' }}
            </button>
            <button @click="downloadOutput" class="export-btn export-btn--primary">
              💾 Télécharger
            </button>
          </div>
        </div>

        <!-- TEMPLATES -->
        <div class="templates-section">
          <h2>📦 Templates</h2>
          <div class="templates-grid">
            <button v-for="tpl in templates" :key="tpl.name" class="template-btn" @click="loadTemplate(tpl)">
              <span class="template-icon">{{ tpl.icon }}</span>
              <span class="template-name">{{ tpl.name }}</span>
              <span class="template-count">{{ tpl.items.length }} Q</span>
            </button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const newQuestion = ref('');
const newAnswer = ref('');
const newCategory = ref('');
const newCategoryName = ref('');
const editingId = ref(null);
const expandedId = ref(null);
const previewTab = ref('html');
const copied = ref(false);

const categories = ref(['Général', 'Tarifs', 'Technique', 'Livraison']);

const faqItems = ref([]);

const templates = [
  {
    name: 'E-commerce',
    icon: '🛒',
    items: [
      { question: 'Quels sont les délais de livraison ?', answer: 'Les commandes sont expédiées sous 24-48h. La livraison prend ensuite 2-5 jours ouvrés selon votre localisation.', category: 'Livraison' },
      { question: 'Puis-je retourner un produit ?', answer: 'Oui, vous disposez de 14 jours pour retourner un produit non utilisé dans son emballage d\'origine.', category: 'Livraison' },
      { question: 'Quels moyens de paiement acceptez-vous ?', answer: 'Nous acceptons Visa, Mastercard, PayPal et le virement bancaire.', category: 'Tarifs' },
    ]
  },
  {
    name: 'SaaS',
    icon: '☁️',
    items: [
      { question: 'Proposez-vous un essai gratuit ?', answer: 'Oui ! Profitez de 14 jours d\'essai gratuit sans carte bancaire requise.', category: 'Tarifs' },
      { question: 'Puis-je annuler mon abonnement ?', answer: 'Vous pouvez annuler à tout moment depuis votre espace client. Aucun engagement.', category: 'Tarifs' },
      { question: 'Mes données sont-elles sécurisées ?', answer: 'Absolument. Chiffrement AES-256, hébergement en Europe, conformité RGPD.', category: 'Technique' },
    ]
  },
  {
    name: 'Freelance',
    icon: '💼',
    items: [
      { question: 'Quels sont vos tarifs ?', answer: 'Les tarifs varient selon le projet. Contactez-moi pour un devis personnalisé gratuit.', category: 'Tarifs' },
      { question: 'Quel est votre délai de réalisation ?', answer: 'Cela dépend de la complexité. Un site vitrine prend généralement 2-4 semaines.', category: 'Général' },
      { question: 'Travaillez-vous en remote ?', answer: 'Oui, je travaille 100% en remote avec des clients dans toute la France.', category: 'Général' },
    ]
  }
];

const usedCategories = computed(() => {
  const cats = new Set(faqItems.value.map(item => item.category || ''));
  return ['', ...categories.value.filter(c => cats.has(c))];
});

function getItemsByCategory(cat) {
  return faqItems.value.filter(item => (item.category || '') === cat);
}

function getGlobalIndex(item) {
  return faqItems.value.findIndex(i => i.id === item.id);
}

function addItem() {
  if (!newQuestion.value || !newAnswer.value) return;
  
  faqItems.value.push({
    id: Date.now(),
    question: newQuestion.value,
    answer: newAnswer.value,
    category: newCategory.value === '__new__' ? '' : newCategory.value
  });
  
  newQuestion.value = '';
  newAnswer.value = '';
}

function addCategory() {
  if (newCategoryName.value && !categories.value.includes(newCategoryName.value)) {
    categories.value.push(newCategoryName.value);
    newCategory.value = newCategoryName.value;
    newCategoryName.value = '';
  }
}

function toggleExpand(id) {
  expandedId.value = expandedId.value === id ? null : id;
}

function startEdit(item) {
  newQuestion.value = item.question;
  newAnswer.value = item.answer;
  newCategory.value = item.category;
  deleteItem(item.id);
}

function deleteItem(id) {
  faqItems.value = faqItems.value.filter(item => item.id !== id);
  if (expandedId.value === id) expandedId.value = null;
}

function moveUp(item) {
  const cat = item.category || '';
  const catItems = getItemsByCategory(cat);
  const idx = catItems.findIndex(i => i.id === item.id);
  if (idx > 0) {
    const globalIdx = faqItems.value.findIndex(i => i.id === item.id);
    const prevGlobalIdx = faqItems.value.findIndex(i => i.id === catItems[idx - 1].id);
    [faqItems.value[globalIdx], faqItems.value[prevGlobalIdx]] = [faqItems.value[prevGlobalIdx], faqItems.value[globalIdx]];
  }
}

function moveDown(item) {
  const cat = item.category || '';
  const catItems = getItemsByCategory(cat);
  const idx = catItems.findIndex(i => i.id === item.id);
  if (idx < catItems.length - 1) {
    const globalIdx = faqItems.value.findIndex(i => i.id === item.id);
    const nextGlobalIdx = faqItems.value.findIndex(i => i.id === catItems[idx + 1].id);
    [faqItems.value[globalIdx], faqItems.value[nextGlobalIdx]] = [faqItems.value[nextGlobalIdx], faqItems.value[globalIdx]];
  }
}

function loadTemplate(tpl) {
  faqItems.value = tpl.items.map((item, i) => ({ ...item, id: Date.now() + i }));
}

const generatedHtml = computed(() => {
  let html = '<div class="faq">\n';
  for (const cat of usedCategories.value) {
    if (cat) html += `  <h2>${cat}</h2>\n`;
    for (const item of getItemsByCategory(cat)) {
      html += `  <details>\n    <summary>${item.question}</summary>\n    <p>${item.answer}</p>\n  </details>\n`;
    }
  }
  html += '</div>';
  return html;
});

const generatedMarkdown = computed(() => {
  let md = '# FAQ\n\n';
  for (const cat of usedCategories.value) {
    if (cat) md += `## ${cat}\n\n`;
    for (const item of getItemsByCategory(cat)) {
      md += `### ${item.question}\n\n${item.answer}\n\n`;
    }
  }
  return md;
});

const generatedJson = computed(() => {
  return JSON.stringify(faqItems.value.map(({ question, answer, category }) => ({ question, answer, category })), null, 2);
});

const currentOutput = computed(() => {
  if (previewTab.value === 'html') return generatedHtml.value;
  if (previewTab.value === 'markdown') return generatedMarkdown.value;
  return generatedJson.value;
});

async function copyOutput() {
  await navigator.clipboard.writeText(currentOutput.value);
  copied.value = true;
  setTimeout(() => copied.value = false, 2000);
}

function downloadOutput() {
  const ext = { html: 'html', markdown: 'md', json: 'json' }[previewTab.value];
  const type = { html: 'text/html', markdown: 'text/markdown', json: 'application/json' }[previewTab.value];
  const blob = new Blob([currentOutput.value], { type });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `faq.${ext}`;
  a.click();
}
</script>

<style scoped>
.faq-app { min-height: 100vh; background: var(--bg-primary); }
.app-header { padding: 1rem 0; border-bottom: 1px solid var(--border); background: rgba(10,10,15,0.9); backdrop-filter: blur(10px); }
.back-link { display: inline-flex; align-items: center; gap: 0.5rem; color: var(--text-muted); text-decoration: none; font-size: 0.9rem; }
.back-link:hover { color: var(--primary); }
.app-main { padding: var(--space-lg) 0; }
.app-intro { text-align: center; margin-bottom: var(--space-lg); }
.app-intro h1 { display: flex; align-items: center; justify-content: center; gap: 0.75rem; font-size: 2rem; margin-bottom: 0.5rem; }
.app-icon { font-size: 2.5rem; }
.app-intro p { color: var(--text-muted); }

.add-section { padding: 1.5rem; background: rgba(255,255,255,0.02); border: 1px solid var(--border); border-radius: 1rem; margin-bottom: var(--space-lg); }
.question-input { width: 100%; padding: 0.75rem 1rem; background: rgba(0,0,0,0.3); border: 1px solid var(--border); border-radius: 0.5rem; font-size: 1rem; color: var(--text-main); margin-bottom: 0.75rem; }
.question-input:focus { outline: none; border-color: var(--primary); }
.answer-input { width: 100%; min-height: 100px; padding: 0.75rem 1rem; background: rgba(0,0,0,0.3); border: 1px solid var(--border); border-radius: 0.5rem; font-size: 0.9rem; color: var(--text-main); resize: vertical; margin-bottom: 0.75rem; }
.answer-input:focus { outline: none; border-color: var(--primary); }
.add-actions { display: flex; gap: 0.75rem; }
.category-select { flex: 1; padding: 0.75rem; background: rgba(0,0,0,0.3); border: 1px solid var(--border); border-radius: 0.5rem; color: var(--text-main); cursor: pointer; }
.add-btn { padding: 0.75rem 1.5rem; background: var(--primary); border: none; border-radius: 0.5rem; font-family: 'JetBrains Mono', monospace; color: var(--bg-primary); cursor: pointer; }
.add-btn:disabled { opacity: 0.5; cursor: not-allowed; }

.new-cat-row { display: flex; gap: 0.5rem; margin-top: 0.75rem; }
.cat-input { flex: 1; padding: 0.5rem; background: rgba(0,0,0,0.3); border: 1px solid var(--border); border-radius: 0.35rem; color: var(--text-main); }
.cat-btn { padding: 0.5rem 1rem; background: var(--primary); border: none; border-radius: 0.35rem; color: var(--bg-primary); cursor: pointer; font-size: 0.85rem; }
.cat-btn--cancel { background: transparent; border: 1px solid var(--border); color: var(--text-muted); }

.faq-list { margin-bottom: var(--space-lg); }
.faq-list h2 { font-size: 1.1rem; margin-bottom: 1rem; }
.faq-category { margin-bottom: 1.5rem; }
.category-title { font-size: 0.9rem; color: var(--primary); margin-bottom: 0.75rem; padding-bottom: 0.5rem; border-bottom: 1px solid var(--border); }

.faq-item { background: rgba(255,255,255,0.02); border: 1px solid var(--border); border-radius: 0.75rem; margin-bottom: 0.5rem; overflow: hidden; }
.faq-header { display: flex; align-items: center; gap: 1rem; padding: 1rem; cursor: pointer; transition: background 0.2s; }
.faq-header:hover { background: rgba(255,255,255,0.02); }
.faq-num { font-family: 'JetBrains Mono', monospace; font-size: 0.75rem; color: var(--primary); opacity: 0.5; }
.faq-question { flex: 1; font-weight: 500; }
.faq-toggle { font-size: 1.25rem; color: var(--text-muted); }
.faq-body { padding: 0 1rem 1rem; border-top: 1px solid var(--border); }
.faq-answer { margin: 1rem 0; color: var(--text-secondary); line-height: 1.6; }
.faq-actions { display: flex; gap: 0.5rem; }
.action-btn { padding: 0.35rem 0.75rem; background: transparent; border: 1px solid var(--border); border-radius: 0.35rem; font-size: 0.75rem; color: var(--text-muted); cursor: pointer; }
.action-btn:hover { border-color: var(--primary); color: var(--primary); }
.action-btn:disabled { opacity: 0.3; cursor: not-allowed; }
.action-btn--danger:hover { border-color: #EF4444; color: #EF4444; }

.empty-state { text-align: center; padding: 3rem; color: var(--text-muted); }
.empty-icon { font-size: 3rem; display: block; margin-bottom: 1rem; opacity: 0.5; }

.preview-section { margin-bottom: var(--space-lg); }
.preview-section h2 { font-size: 1.1rem; margin-bottom: 1rem; }
.preview-tabs { display: flex; gap: 0.25rem; margin-bottom: 0.5rem; }
.preview-tabs button { padding: 0.5rem 1rem; background: rgba(255,255,255,0.02); border: 1px solid var(--border); border-radius: 0.35rem 0.35rem 0 0; font-size: 0.75rem; color: var(--text-muted); cursor: pointer; }
.preview-tabs button.active { background: var(--primary); border-color: var(--primary); color: var(--bg-primary); }
.preview-content { background: rgba(0,0,0,0.3); border: 1px solid var(--border); border-radius: 0 0.5rem 0.5rem 0.5rem; padding: 1rem; max-height: 300px; overflow: auto; }
.preview-content pre { font-family: 'JetBrains Mono', monospace; font-size: 0.8rem; color: var(--text-secondary); white-space: pre-wrap; }
.preview-actions { display: flex; gap: 0.75rem; margin-top: 1rem; }
.export-btn { padding: 0.6rem 1.25rem; background: rgba(255,255,255,0.05); border: 1px solid var(--border); border-radius: 0.5rem; font-family: 'JetBrains Mono', monospace; font-size: 0.85rem; color: var(--text-secondary); cursor: pointer; }
.export-btn:hover { border-color: var(--primary); color: var(--primary); }
.export-btn.copied { background: var(--primary); border-color: var(--primary); color: var(--bg-primary); }
.export-btn--primary { background: var(--primary); border-color: var(--primary); color: var(--bg-primary); }

.templates-section h2 { font-size: 1.1rem; margin-bottom: 1rem; }
.templates-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1rem; }
.template-btn { display: flex; flex-direction: column; align-items: center; gap: 0.5rem; padding: 1.25rem; background: rgba(255,255,255,0.02); border: 1px solid var(--border); border-radius: 0.75rem; cursor: pointer; transition: all 0.2s; }
.template-btn:hover { border-color: var(--primary); transform: translateY(-2px); }
.template-icon { font-size: 2rem; }
.template-name { font-weight: 500; }
.template-count { font-size: 0.75rem; color: var(--text-muted); }
</style>
