<template>
  <div class="agent-app">
    <header class="app-header">
      <div class="container">
        <router-link to="/apps" class="back-link">← Retour aux Apps</router-link>
        <span class="agent-badge" style="--agent-color: #0EA5E9">🗄️ WATASHI</span>
      </div>
    </header>
    <section class="app-main">
      <div class="container">
        <div class="app-intro">
          <h1><span class="app-icon">🎧</span> Knowledge Base Builder</h1>
          <p>Créez une base de connaissances RAG pour votre chatbot</p>
        </div>

        <!-- UPLOAD SECTION -->
        <div class="upload-section">
          <h2>📤 Ajouter des documents</h2>
          <div class="upload-area" @dragover.prevent @drop.prevent="handleDrop" :class="{ dragover: isDragover }" @dragenter="isDragover = true" @dragleave="isDragover = false">
            <input type="file" multiple @change="handleFiles" accept=".txt,.md,.pdf,.json" ref="fileInput" hidden>
            <div class="upload-content" @click="$refs.fileInput.click()">
              <span class="upload-icon">📁</span>
              <span class="upload-text">Glissez vos fichiers ici ou cliquez pour sélectionner</span>
              <span class="upload-formats">.txt, .md, .pdf, .json</span>
            </div>
          </div>
          
          <!-- Quick Add -->
          <div class="quick-add">
            <!-- ⚠️ `h4` → `h3` LE 13/09/2026, avec UNE CLASSE — et la classe est le point délicat.
                 Après le `<h2>` de la page venait un `<h4>` : la hiérarchie sautait un niveau
                 (axe `heading-order`, règle Opquast 227).
                 Ce titre était mis en forme par le sélecteur d'ÉLÉMENT `h4 { … }` en bas de ce
                 fichier — qui style TOUS les h4. Le passer en `h3` le ferait tomber sous
                 `h3 { … }`, partagé par les trois autres titres du composant : son aspect
                 changerait, et eux avec.
                 On lui donne donc sa propre classe, et on l'ajoute AU sélecteur `h4` :
                     h4, .quick-add__titre { … }
                 *Un titre qu'on déplace doit emporter sa mise en forme, sans l'imposer aux autres.* -->
            <h3 class="quick-add__titre">Ou ajoutez du texte directement</h3>
            <textarea aria-label="Collez votre contenu ici..." v-model="quickText" placeholder="Collez votre contenu ici..." class="quick-input"></textarea>
            <div class="quick-meta">
              <input aria-label="Titre du document" type="text" v-model="quickTitle" placeholder="Titre du document" class="meta-input">
              <select aria-label="Catégorie..." v-model="quickCategory" class="meta-select">
                <option value="">Catégorie...</option>
                <option value="faq">FAQ</option>
                <option value="docs">Documentation</option>
                <option value="guide">Guide</option>
                <option value="policy">Politique</option>
              </select>
              <button @click="addQuickDocument" class="add-btn">+ Ajouter</button>
            </div>
          </div>
        </div>

        <!-- DOCUMENTS LIST -->
        <div class="documents-section">
          <h3>📚 Documents indexés ({{ documents.length }})</h3>
          <div v-if="documents.length === 0" class="empty-docs">
            <span class="empty-icon">📭</span>
            <p>Aucun document dans la base de connaissances</p>
          </div>
          <div v-else class="documents-list">
            <div v-for="doc in documents" :key="doc.id" class="doc-card">
              <div class="doc-icon">{{ getCategoryIcon(doc.category) }}</div>
              <div class="doc-info">
                <div class="doc-title">{{ doc.title }}</div>
                <div class="doc-meta">
                  <span>{{ doc.chunks }} chunks</span>
                  <span>{{ doc.size }}</span>
                  <span>{{ doc.category }}</span>
                </div>
              </div>
              <div class="doc-status" :class="doc.status">{{ doc.status }}</div>
              <button @click="removeDocument(doc.id)" class="doc-remove">✕</button>
            </div>
          </div>
        </div>

        <!-- TEST CHAT -->
        <div class="chat-section">
          <h3>💬 Tester le chatbot</h3>
          <div class="chat-container">
            <div class="chat-messages" ref="chatMessages">
              <div v-for="msg in messages" :key="msg.id" class="chat-message" :class="msg.role">
                <div class="msg-avatar">{{ msg.role === 'user' ? '👤' : '🎧' }}</div>
                <div class="msg-content">
                  <div class="msg-text">{{ msg.text }}</div>
                  <div v-if="msg.sources" class="msg-sources">
                    <span>Sources:</span>
                    <span v-for="src in msg.sources" :key="src" class="source-badge">{{ src }}</span>
                  </div>
                </div>
              </div>
              <div v-if="isTyping" class="chat-message assistant typing">
                <div class="msg-avatar">🎧</div>
                <div class="msg-content">
                  <div class="typing-indicator"><span></span><span></span><span></span></div>
                </div>
              </div>
            </div>
            <div class="chat-input">
              <input aria-label="Posez une question..." type="text" v-model="userInput" @keyup.enter="sendMessage" placeholder="Posez une question..." class="input-field">
              <button @click="sendMessage" class="send-btn" :disabled="!userInput.trim() || isTyping">📤</button>
            </div>
          </div>
        </div>

        <!-- STATS -->
        <div class="stats-section">
          <h3>📊 Statistiques KB</h3>
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-value">{{ documents.length }}</div>
              <div class="stat-label">Documents</div>
            </div>
            <div class="stat-card">
              <div class="stat-value">{{ totalChunks }}</div>
              <div class="stat-label">Chunks</div>
            </div>
            <div class="stat-card">
              <div class="stat-value">{{ totalSize }}</div>
              <div class="stat-label">Taille totale</div>
            </div>
            <div class="stat-card">
              <div class="stat-value">{{ queries }}</div>
              <div class="stat-label">Requêtes</div>
            </div>
          </div>
        </div>

        <!-- EXPORT -->
        <div class="export-section">
          <button @click="exportKB">📦 Export KB (JSON)</button>
          <button @click="generateEmbedCode">🔗 Code d'intégration</button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue';

const fileInput = ref(null);
const chatMessages = ref(null);
const isDragover = ref(false);
const quickText = ref('');
const quickTitle = ref('');
const quickCategory = ref('');
const userInput = ref('');
const isTyping = ref(false);
const queries = ref(0);

const documents = ref([
  { id: 1, title: 'FAQ Générale', category: 'faq', chunks: 15, size: '4.2 KB', status: 'indexed' },
  { id: 2, title: 'Guide d\'installation', category: 'guide', chunks: 28, size: '12.5 KB', status: 'indexed' }
]);

const messages = ref([
  { id: 1, role: 'assistant', text: 'Bonjour ! Je suis Watashi, votre assistant support. Comment puis-je vous aider aujourd\'hui ?', sources: null }
]);

let docIdCounter = 3;
let msgIdCounter = 2;

const totalChunks = computed(() => documents.value.reduce((s, d) => s + d.chunks, 0));
const totalSize = computed(() => {
  const bytes = documents.value.reduce((s, d) => s + parseFloat(d.size), 0);
  return bytes.toFixed(1) + ' KB';
});

function getCategoryIcon(cat) {
  const icons = { faq: '❓', docs: '📄', guide: '📖', policy: '📜' };
  return icons[cat] || '📁';
}

function handleDrop(e) {
  isDragover.value = false;
  const files = e.dataTransfer.files;
  processFiles(files);
}

function handleFiles(e) {
  processFiles(e.target.files);
}

function processFiles(files) {
  for (const file of files) {
    const size = (file.size / 1024).toFixed(1) + ' KB';
    const chunks = Math.ceil(file.size / 500);
    documents.value.push({
      id: docIdCounter++,
      title: file.name,
      category: 'docs',
      chunks,
      size,
      status: 'indexing'
    });
    
    // Simulate indexing
    setTimeout(() => {
      const doc = documents.value.find(d => d.title === file.name);
      if (doc) doc.status = 'indexed';
    }, 1500 + Math.random() * 1000);
  }
}

function addQuickDocument() {
  if (!quickText.value.trim() || !quickTitle.value.trim()) return;
  
  const size = (quickText.value.length / 1024).toFixed(1) + ' KB';
  const chunks = Math.ceil(quickText.value.length / 500);
  
  documents.value.push({
    id: docIdCounter++,
    title: quickTitle.value,
    category: quickCategory.value || 'docs',
    chunks,
    size,
    status: 'indexed'
  });
  
  quickText.value = '';
  quickTitle.value = '';
  quickCategory.value = '';
}

function removeDocument(id) {
  documents.value = documents.value.filter(d => d.id !== id);
}

async function sendMessage() {
  if (!userInput.value.trim() || isTyping.value) return;
  
  const text = userInput.value;
  messages.value.push({ id: msgIdCounter++, role: 'user', text });
  userInput.value = '';
  queries.value++;
  
  await nextTick();
  chatMessages.value.scrollTop = chatMessages.value.scrollHeight;
  
  isTyping.value = true;
  
  // Simulate RAG response
  await new Promise(r => setTimeout(r, 1000 + Math.random() * 1500));
  
  const responses = [
    { text: 'D\'après notre documentation, voici ce que je peux vous dire...', sources: ['FAQ Générale', 'Guide d\'installation'] },
    { text: 'J\'ai trouvé plusieurs informations pertinentes dans notre base de connaissances.', sources: ['Guide d\'installation'] },
    { text: 'Voici les informations que j\'ai pu trouver sur ce sujet.', sources: ['FAQ Générale'] }
  ];
  
  const response = responses[Math.floor(Math.random() * responses.length)];
  messages.value.push({ id: msgIdCounter++, role: 'assistant', ...response });
  
  isTyping.value = false;
  await nextTick();
  chatMessages.value.scrollTop = chatMessages.value.scrollHeight;
}

function exportKB() {
  const data = { documents: documents.value, exportedAt: new Date().toISOString() };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'knowledge-base.json';
  a.click();
}

function generateEmbedCode() {
  const code = `<script src="https://watashi.gl-digitallab.fr/widget.js"><\/script>
<div id="watashi-chat" data-kb="your-kb-id"></div>`;
  navigator.clipboard.writeText(code);
  alert('Code copié dans le presse-papiers !');
}
</script>

<style scoped>
.agent-app { min-height: 100vh; background: var(--bg-primary); }
.app-header { padding: 1rem 0; border-bottom: 1px solid var(--border); }
.app-header .container { display: flex; justify-content: space-between; align-items: center; }
.back-link { color: var(--text-muted); text-decoration: none; }
.agent-badge { padding: 0.35rem 0.75rem; background: rgba(14,165,233,0.1); border: 1px solid var(--agent-color); border-radius: 2rem; font-size: 0.8rem; color: var(--agent-color); }
.app-main { padding: var(--space-lg) 0; }
.app-intro { text-align: center; margin-bottom: 2rem; }
.app-intro h1 { display: flex; justify-content: center; gap: 0.5rem; font-size: 1.75rem; }
.app-icon { font-size: 2rem; }

h3, h2{ font-size: 1rem; margin-bottom: 1rem; }
/* ⚠️ `.quick-add__titre` AJOUTÉ LE 13/09/2026, PAS SUBSTITUÉ.
   Le titre « Ou ajoutez du texte directement » est passé de `h4` à `h3` pour rétablir la
   hiérarchie (règle Opquast 227). Il tombait donc sous `h3 { font-size: 1rem; … }` et
   aurait CHANGÉ D'ASPECT — comme les trois autres `h3` du composant si on avait touché
   à `h3`. On lui rend exactement les déclarations du `h4`, par sa propre classe.
   *Déplacer un titre ne doit pas le déguiser, ni déguiser ses voisins.* */
h4, .quick-add__titre { font-size: 0.9rem; margin-bottom: 0.75rem; color: var(--text-muted); }

.upload-section, .documents-section, .chat-section, .stats-section, .export-section { margin-bottom: 2rem; }

.upload-area { padding: 2rem; border: 2px dashed var(--border); border-radius: 0.75rem; text-align: center; cursor: pointer; transition: all 0.3s ease; }
.upload-area:hover, .upload-area.dragover { border-color: var(--primary); background: rgba(16,185,129,0.05); }
.upload-icon { font-size: 3rem; display: block; margin-bottom: 0.75rem; }
.upload-text { display: block; margin-bottom: 0.25rem; }
.upload-formats { font-size: 0.8rem; color: var(--text-muted); }

.quick-add { margin-top: 1.5rem; }
.quick-input { width: 100%; min-height: 100px; padding: 0.75rem; background: rgba(0,0,0,0.3); border: 1px solid var(--border); border-radius: 0.5rem; color: var(--text-main); margin-bottom: 0.75rem; }
.quick-meta { display: flex; gap: 0.5rem; flex-wrap: wrap; }
.meta-input, .meta-select { padding: 0.5rem; background: rgba(0,0,0,0.3); border: 1px solid var(--border); border-radius: 0.35rem; color: var(--text-main); }
.meta-input { flex: 1; min-width: 150px; }
.add-btn { padding: 0.5rem 1rem; background: var(--primary); border: none; border-radius: 0.35rem; color: var(--bg-primary); cursor: pointer; font-weight: 600; }

.empty-docs { text-align: center; padding: 2rem; color: var(--text-muted); }
.empty-icon { font-size: 3rem; display: block; margin-bottom: 0.5rem; }
.documents-list { display: flex; flex-direction: column; gap: 0.5rem; }
.doc-card { display: flex; align-items: center; gap: 1rem; padding: 0.75rem 1rem; background: rgba(255,255,255,0.02); border: 1px solid var(--border); border-radius: 0.5rem; }
.doc-icon { font-size: 1.5rem; }
.doc-info { flex: 1; }
.doc-title { font-weight: 600; margin-bottom: 0.25rem; }
.doc-meta { display: flex; gap: 1rem; font-size: 0.75rem; color: var(--text-muted); }
.doc-status { padding: 0.2rem 0.5rem; border-radius: 0.25rem; font-size: 0.7rem; text-transform: uppercase; }
.doc-status.indexed { background: rgba(16,185,129,0.2); color: #10B981; }
.doc-status.indexing { background: rgba(245,158,11,0.2); color: #F59E0B; }
.doc-remove { padding: 0.25rem 0.5rem; background: transparent; border: none; color: var(--text-muted); cursor: pointer; }
.doc-remove:hover { color: #EF4444; }

.chat-container { border: 1px solid var(--border); border-radius: 0.75rem; overflow: hidden; }
.chat-messages { height: 300px; overflow-y: auto; padding: 1rem; display: flex; flex-direction: column; gap: 1rem; }
.chat-message { display: flex; gap: 0.75rem; }
.chat-message.user { flex-direction: row-reverse; }
.msg-avatar { width: 36px; height: 36px; border-radius: 50%; background: rgba(255,255,255,0.1); display: flex; align-items: center; justify-content: center; font-size: 1.25rem; flex-shrink: 0; }
.msg-content { max-width: 75%; }
.msg-text { padding: 0.75rem 1rem; border-radius: 0.75rem; background: rgba(255,255,255,0.05); }
.user .msg-text { background: rgba(16,185,129,0.2); }
.msg-sources { margin-top: 0.5rem; font-size: 0.75rem; color: var(--text-muted); }
.source-badge { background: rgba(0,0,0,0.2); padding: 0.15rem 0.4rem; border-radius: 0.25rem; margin-left: 0.25rem; }
.typing-indicator { display: flex; gap: 0.25rem; padding: 0.75rem 1rem; }
.typing-indicator span { width: 8px; height: 8px; background: var(--text-muted); border-radius: 50%; animation: typing 1.4s infinite; }
.typing-indicator span:nth-child(2) { animation-delay: 0.2s; }
.typing-indicator span:nth-child(3) { animation-delay: 0.4s; }
@keyframes typing { 0%, 60%, 100% { transform: translateY(0); } 30% { transform: translateY(-4px); } }

.chat-input { display: flex; gap: 0.5rem; padding: 1rem; border-top: 1px solid var(--border); }
.input-field { flex: 1; padding: 0.75rem; background: rgba(0,0,0,0.3); border: 1px solid var(--border); border-radius: 0.5rem; color: var(--text-main); }
.send-btn { padding: 0.75rem 1rem; background: var(--primary); border: none; border-radius: 0.5rem; cursor: pointer; font-size: 1rem; }
.send-btn:disabled { opacity: 0.5; cursor: not-allowed; }

.stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; }
.stat-card { padding: 1rem; background: rgba(255,255,255,0.02); border: 1px solid var(--border); border-radius: 0.5rem; text-align: center; }
.stat-value { font-size: 2rem; font-weight: 700; color: var(--primary); }
.stat-label { font-size: 0.8rem; color: var(--text-muted); }

.export-section { display: flex; gap: 0.75rem; }
.export-section button { padding: 0.6rem 1rem; background: rgba(255,255,255,0.02); border: 1px solid var(--border); border-radius: 0.35rem; color: var(--text-muted); cursor: pointer; }
.export-section button:hover { border-color: var(--primary); color: var(--primary); }

@media (max-width: 768px) { .stats-grid { grid-template-columns: repeat(2, 1fr); } }
</style>
