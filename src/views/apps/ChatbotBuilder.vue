<template>
  <div class="chatbot-app">
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
          <h1><span class="app-icon">🤖</span> Chatbot Builder</h1>
          <p>Créez des arbres de dialogue pour vos chatbots avec export JSON</p>
        </div>

        <div class="builder-layout">
          <!-- SIDEBAR -->
          <div class="sidebar">
            <h2>📝 Nœuds</h2>
            <div class="nodes-list">
              <div 
                v-for="node in nodes" 
                :key="node.id" 
                class="node-item"
                :class="{ active: selectedNode?.id === node.id, start: node.isStart }"
                @click="selectNode(node)"
              >
                <span class="node-icon">{{ node.isStart ? '🚀' : '💬' }}</span>
                <span class="node-name">{{ node.name || 'Sans nom' }}</span>
              </div>
            </div>
            <button class="add-node-btn" @click="addNode">➕ Ajouter un nœud</button>
          </div>

          <!-- EDITOR -->
          <div class="editor-panel" v-if="selectedNode">
            <div class="editor-header">
              <input type="text" v-model="selectedNode.name" placeholder="Nom du nœud" class="node-name-input">
              <label class="start-toggle">
                <input type="checkbox" v-model="selectedNode.isStart" @change="setStart(selectedNode)">
                <span>Nœud de départ</span>
              </label>
            </div>

            <div class="editor-section">
              <h3>💬 Message du bot</h3>
              <textarea v-model="selectedNode.message" placeholder="Ce que le bot dit..." class="message-input"></textarea>
            </div>

            <div class="editor-section">
              <h3>🔘 Réponses possibles</h3>
              <div v-for="(response, i) in selectedNode.responses" :key="i" class="response-row">
                <input type="text" v-model="response.text" placeholder="Texte du bouton" class="response-text">
                <select v-model="response.nextNodeId" class="response-next">
                  <option value="">Fin de conversation</option>
                  <option v-for="n in otherNodes" :key="n.id" :value="n.id">→ {{ n.name || 'Sans nom' }}</option>
                </select>
                <button class="remove-response-btn" @click="removeResponse(i)">✕</button>
              </div>
              <button class="add-response-btn" @click="addResponse">➕ Ajouter une réponse</button>
            </div>

            <div class="editor-actions">
              <button class="delete-node-btn" @click="deleteNode" :disabled="nodes.length <= 1">
                🗑️ Supprimer ce nœud
              </button>
            </div>
          </div>

          <!-- PREVIEW -->
          <div class="preview-panel">
            <h2>👁️ Test du chatbot</h2>
            <div class="chat-window">
              <div class="chat-messages" ref="chatMessages">
                <div v-for="(msg, i) in chatHistory" :key="i" class="chat-message" :class="'chat-message--' + msg.type">
                  <span class="message-content">{{ msg.text }}</span>
                </div>
              </div>
              
              <div class="chat-options" v-if="currentResponses.length">
                <button 
                  v-for="resp in currentResponses" 
                  :key="resp.text" 
                  class="chat-option-btn"
                  @click="selectResponse(resp)"
                >
                  {{ resp.text }}
                </button>
              </div>
              
              <div class="chat-ended" v-else-if="chatHistory.length && !currentResponses.length">
                <span>Fin de la conversation</span>
                <button @click="restartChat" class="restart-btn">🔄 Recommencer</button>
              </div>
            </div>
          </div>
        </div>

        <!-- EXPORT -->
        <div class="export-section">
          <h2>📤 Export</h2>
          <div class="export-buttons">
            <button @click="copyJson" class="export-btn" :class="{ copied }">
              {{ copied ? '✓ Copié !' : '📋 Copier JSON' }}
            </button>
            <button @click="downloadJson" class="export-btn export-btn--primary">
              💾 Télécharger JSON
            </button>
            <button @click="loadTemplate" class="export-btn">
              📦 Charger template
            </button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, nextTick, onMounted } from 'vue';

const nodes = ref([
  {
    id: 'start',
    name: 'Accueil',
    isStart: true,
    message: 'Bonjour ! Comment puis-je vous aider ?',
    responses: [
      { text: 'Voir les tarifs', nextNodeId: 'pricing' },
      { text: 'Contacter le support', nextNodeId: 'support' },
      { text: 'Autre question', nextNodeId: '' }
    ]
  },
  {
    id: 'pricing',
    name: 'Tarifs',
    isStart: false,
    message: 'Nos tarifs commencent à 29€/mois. Voulez-vous plus de détails ?',
    responses: [
      { text: 'Oui, détaillez', nextNodeId: '' },
      { text: 'Retour au menu', nextNodeId: 'start' }
    ]
  },
  {
    id: 'support',
    name: 'Support',
    isStart: false,
    message: 'Notre équipe support est disponible 24/7. Préférez-vous être rappelé ou envoyer un email ?',
    responses: [
      { text: 'Être rappelé', nextNodeId: '' },
      { text: 'Envoyer un email', nextNodeId: '' },
      { text: 'Retour au menu', nextNodeId: 'start' }
    ]
  }
]);

const selectedNode = ref(null);
const chatHistory = ref([]);
const currentNodeId = ref(null);
const copied = ref(false);
const chatMessages = ref(null);

const otherNodes = computed(() => nodes.value.filter(n => n.id !== selectedNode.value?.id));

const currentResponses = computed(() => {
  const node = nodes.value.find(n => n.id === currentNodeId.value);
  return node?.responses || [];
});

function selectNode(node) {
  selectedNode.value = node;
}

function addNode() {
  const newNode = {
    id: 'node_' + Date.now(),
    name: '',
    isStart: false,
    message: '',
    responses: []
  };
  nodes.value.push(newNode);
  selectedNode.value = newNode;
}

function deleteNode() {
  if (nodes.value.length <= 1) return;
  const idx = nodes.value.findIndex(n => n.id === selectedNode.value.id);
  nodes.value.splice(idx, 1);
  selectedNode.value = nodes.value[0];
  
  // Clean up references
  nodes.value.forEach(node => {
    node.responses = node.responses.filter(r => r.nextNodeId !== selectedNode.value?.id);
  });
}

function setStart(node) {
  if (node.isStart) {
    nodes.value.forEach(n => {
      if (n.id !== node.id) n.isStart = false;
    });
  }
}

function addResponse() {
  selectedNode.value.responses.push({ text: '', nextNodeId: '' });
}

function removeResponse(index) {
  selectedNode.value.responses.splice(index, 1);
}

function startChat() {
  chatHistory.value = [];
  const startNode = nodes.value.find(n => n.isStart) || nodes.value[0];
  currentNodeId.value = startNode.id;
  chatHistory.value.push({ type: 'bot', text: startNode.message });
  scrollChat();
}

function selectResponse(resp) {
  chatHistory.value.push({ type: 'user', text: resp.text });
  
  if (resp.nextNodeId) {
    const nextNode = nodes.value.find(n => n.id === resp.nextNodeId);
    if (nextNode) {
      currentNodeId.value = nextNode.id;
      setTimeout(() => {
        chatHistory.value.push({ type: 'bot', text: nextNode.message });
        scrollChat();
      }, 500);
    }
  } else {
    currentNodeId.value = null;
    setTimeout(() => {
      chatHistory.value.push({ type: 'bot', text: 'Merci pour votre message ! Un conseiller vous recontactera bientôt.' });
      scrollChat();
    }, 500);
  }
}

function restartChat() {
  startChat();
}

function scrollChat() {
  nextTick(() => {
    if (chatMessages.value) {
      chatMessages.value.scrollTop = chatMessages.value.scrollHeight;
    }
  });
}

const exportJson = computed(() => {
  return JSON.stringify({
    version: '1.0',
    nodes: nodes.value.map(n => ({
      id: n.id,
      name: n.name,
      isStart: n.isStart,
      message: n.message,
      responses: n.responses
    }))
  }, null, 2);
});

async function copyJson() {
  await navigator.clipboard.writeText(exportJson.value);
  copied.value = true;
  setTimeout(() => copied.value = false, 2000);
}

function downloadJson() {
  const blob = new Blob([exportJson.value], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'chatbot-flow.json';
  a.click();
}

function loadTemplate() {
  nodes.value = [
    {
      id: 'welcome',
      name: 'Bienvenue',
      isStart: true,
      message: '👋 Bienvenue sur notre site ! Je suis votre assistant virtuel. Comment puis-je vous aider aujourd\'hui ?',
      responses: [
        { text: '💰 Tarifs & Devis', nextNodeId: 'pricing' },
        { text: '❓ Questions fréquentes', nextNodeId: 'faq' },
        { text: '📞 Parler à un humain', nextNodeId: 'human' }
      ]
    },
    {
      id: 'pricing',
      name: 'Tarifs',
      isStart: false,
      message: '💰 Excellent choix ! Nos formules sont adaptées à tous les budgets.\n\n• Starter : 29€/mois\n• Pro : 79€/mois\n• Enterprise : Sur mesure\n\nQue souhaitez-vous faire ?',
      responses: [
        { text: 'Demander un devis', nextNodeId: 'quote' },
        { text: 'Comparer les offres', nextNodeId: '' },
        { text: '← Retour', nextNodeId: 'welcome' }
      ]
    },
    {
      id: 'quote',
      name: 'Devis',
      isStart: false,
      message: '📝 Super ! Pour vous faire un devis personnalisé, j\'aurais besoin de quelques informations. Un conseiller va vous contacter sous 24h.',
      responses: [
        { text: 'Parfait, merci !', nextNodeId: '' },
        { text: '← Retour', nextNodeId: 'pricing' }
      ]
    },
    {
      id: 'faq',
      name: 'FAQ',
      isStart: false,
      message: '❓ Voici les questions les plus fréquentes. Laquelle vous intéresse ?',
      responses: [
        { text: 'Délais de livraison', nextNodeId: '' },
        { text: 'Politique de retour', nextNodeId: '' },
        { text: 'Moyens de paiement', nextNodeId: '' },
        { text: '← Retour', nextNodeId: 'welcome' }
      ]
    },
    {
      id: 'human',
      name: 'Contact humain',
      isStart: false,
      message: '📞 Bien sûr ! Notre équipe est disponible du lundi au vendredi, 9h-18h.\n\nComment préférez-vous être contacté ?',
      responses: [
        { text: '📱 Par téléphone', nextNodeId: '' },
        { text: '✉️ Par email', nextNodeId: '' },
        { text: '💬 Chat en direct', nextNodeId: '' },
        { text: '← Retour', nextNodeId: 'welcome' }
      ]
    }
  ];
  selectedNode.value = nodes.value[0];
  startChat();
}

onMounted(() => {
  selectedNode.value = nodes.value[0];
  startChat();
});
</script>

<style scoped>
.chatbot-app { min-height: 100vh; background: var(--bg-primary); }
.app-header { padding: 1rem 0; border-bottom: 1px solid var(--border); background: rgba(10,10,15,0.9); backdrop-filter: blur(10px); }
.back-link { display: inline-flex; align-items: center; gap: 0.5rem; color: var(--text-muted); text-decoration: none; font-size: 0.9rem; }
.back-link:hover { color: var(--primary); }
.app-main { padding: var(--space-lg) 0; }
.app-intro { text-align: center; margin-bottom: var(--space-lg); }
.app-intro h1 { display: flex; align-items: center; justify-content: center; gap: 0.75rem; font-size: 2rem; margin-bottom: 0.5rem; }
.app-icon { font-size: 2.5rem; }
.app-intro p { color: var(--text-muted); }

.builder-layout { display: grid; grid-template-columns: 200px 1fr 320px; gap: 1.5rem; margin-bottom: var(--space-lg); }

/* Sidebar */
.sidebar { background: rgba(255,255,255,0.02); border: 1px solid var(--border); border-radius: 0.75rem; padding: 1rem; }
.sidebar h2 { font-size: 0.9rem; margin-bottom: 1rem; color: var(--text-muted); }
.nodes-list { margin-bottom: 1rem; }
.node-item { display: flex; align-items: center; gap: 0.5rem; padding: 0.6rem 0.75rem; border-radius: 0.5rem; cursor: pointer; transition: all 0.2s; margin-bottom: 0.25rem; }
.node-item:hover { background: rgba(255,255,255,0.05); }
.node-item.active { background: var(--primary); color: var(--bg-primary); }
.node-item.start .node-icon { color: #FFD700; }
.node-item.active.start .node-icon { color: var(--bg-primary); }
.node-icon { font-size: 1rem; }
.node-name { font-size: 0.85rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.add-node-btn { width: 100%; padding: 0.6rem; background: rgba(0,255,136,0.1); border: 1px dashed var(--primary); border-radius: 0.5rem; color: var(--primary); cursor: pointer; font-size: 0.85rem; }
.add-node-btn:hover { background: rgba(0,255,136,0.2); }

/* Editor */
.editor-panel { background: rgba(255,255,255,0.02); border: 1px solid var(--border); border-radius: 0.75rem; padding: 1.5rem; }
.editor-header { display: flex; gap: 1rem; align-items: center; margin-bottom: 1.5rem; flex-wrap: wrap; }
.node-name-input { flex: 1; padding: 0.6rem 1rem; background: rgba(0,0,0,0.3); border: 1px solid var(--border); border-radius: 0.5rem; font-size: 1rem; color: var(--text-main); }
.node-name-input:focus { outline: none; border-color: var(--primary); }
.start-toggle { display: flex; align-items: center; gap: 0.5rem; font-size: 0.85rem; color: var(--text-muted); cursor: pointer; }
.start-toggle input { accent-color: var(--primary); }

.editor-section { margin-bottom: 1.5rem; }
.editor-section h3 { font-size: 0.85rem; margin-bottom: 0.75rem; color: var(--text-muted); }
.message-input { width: 100%; min-height: 100px; padding: 0.75rem; background: rgba(0,0,0,0.3); border: 1px solid var(--border); border-radius: 0.5rem; font-size: 0.9rem; color: var(--text-main); resize: vertical; }
.message-input:focus { outline: none; border-color: var(--primary); }

.response-row { display: flex; gap: 0.5rem; margin-bottom: 0.5rem; }
.response-text { flex: 1; padding: 0.5rem; background: rgba(0,0,0,0.3); border: 1px solid var(--border); border-radius: 0.35rem; font-size: 0.85rem; color: var(--text-main); }
.response-next { width: 150px; padding: 0.5rem; background: rgba(0,0,0,0.3); border: 1px solid var(--border); border-radius: 0.35rem; font-size: 0.8rem; color: var(--text-main); }
.remove-response-btn { padding: 0.5rem; background: transparent; border: 1px solid var(--border); border-radius: 0.35rem; color: var(--text-muted); cursor: pointer; }
.remove-response-btn:hover { border-color: #EF4444; color: #EF4444; }
.add-response-btn { padding: 0.5rem 1rem; background: transparent; border: 1px dashed var(--border); border-radius: 0.35rem; color: var(--text-muted); cursor: pointer; font-size: 0.85rem; }
.add-response-btn:hover { border-color: var(--primary); color: var(--primary); }

.editor-actions { padding-top: 1rem; border-top: 1px solid var(--border); }
.delete-node-btn { padding: 0.5rem 1rem; background: transparent; border: 1px solid var(--border); border-radius: 0.5rem; color: var(--text-muted); cursor: pointer; font-size: 0.85rem; }
.delete-node-btn:hover:not(:disabled) { border-color: #EF4444; color: #EF4444; }
.delete-node-btn:disabled { opacity: 0.3; cursor: not-allowed; }

/* Preview */
.preview-panel { background: rgba(255,255,255,0.02); border: 1px solid var(--border); border-radius: 0.75rem; padding: 1rem; }
.preview-panel h2 { font-size: 0.9rem; margin-bottom: 1rem; color: var(--text-muted); }
.chat-window { display: flex; flex-direction: column; height: 400px; background: rgba(0,0,0,0.3); border-radius: 0.75rem; overflow: hidden; }
.chat-messages { flex: 1; padding: 1rem; overflow-y: auto; display: flex; flex-direction: column; gap: 0.75rem; }
.chat-message { max-width: 85%; padding: 0.6rem 1rem; border-radius: 1rem; font-size: 0.85rem; line-height: 1.4; }
.chat-message--bot { background: rgba(255,255,255,0.1); align-self: flex-start; border-bottom-left-radius: 0.25rem; white-space: pre-line; }
.chat-message--user { background: var(--primary); color: var(--bg-primary); align-self: flex-end; border-bottom-right-radius: 0.25rem; }
.chat-options { display: flex; flex-direction: column; gap: 0.5rem; padding: 1rem; border-top: 1px solid var(--border); }
.chat-option-btn { padding: 0.6rem 1rem; background: transparent; border: 1px solid var(--primary); border-radius: 0.5rem; color: var(--primary); cursor: pointer; font-size: 0.85rem; text-align: left; transition: all 0.2s; }
.chat-option-btn:hover { background: var(--primary); color: var(--bg-primary); }
.chat-ended { padding: 1rem; border-top: 1px solid var(--border); text-align: center; color: var(--text-muted); font-size: 0.85rem; }
.restart-btn { margin-top: 0.5rem; padding: 0.4rem 1rem; background: transparent; border: 1px solid var(--border); border-radius: 0.35rem; color: var(--text-muted); cursor: pointer; font-size: 0.8rem; }
.restart-btn:hover { border-color: var(--primary); color: var(--primary); }

/* Export */
.export-section h2 { font-size: 1.1rem; margin-bottom: 1rem; }
.export-buttons { display: flex; flex-wrap: wrap; gap: 0.75rem; }
.export-btn { padding: 0.6rem 1.25rem; background: rgba(255,255,255,0.05); border: 1px solid var(--border); border-radius: 0.5rem; font-family: 'JetBrains Mono', monospace; font-size: 0.85rem; color: var(--text-secondary); cursor: pointer; }
.export-btn:hover { border-color: var(--primary); color: var(--primary); }
.export-btn.copied { background: var(--primary); border-color: var(--primary); color: var(--bg-primary); }
.export-btn--primary { background: var(--primary); border-color: var(--primary); color: var(--bg-primary); }

@media (max-width: 1024px) {
  .builder-layout { grid-template-columns: 1fr; }
  .sidebar { order: 1; }
  .editor-panel { order: 2; }
  .preview-panel { order: 3; }
}
</style>
