<template>
  <div class="prompt-app">
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
          <h1><span class="app-icon">🧠</span> Prompt Builder</h1>
          <p>Construisez des prompts structurés et optimisés pour les LLMs</p>
        </div>

        <!-- TEMPLATES -->
        <div class="templates-section">
          <h2>📦 Templates de prompts</h2>
          <div class="templates-grid">
            <button v-for="tpl in templates" :key="tpl.id" class="template-card" :class="{ active: selectedTemplate === tpl.id }" @click="loadTemplate(tpl)">
              <span class="template-icon">{{ tpl.icon }}</span>
              <span class="template-name">{{ tpl.name }}</span>
              <span class="template-desc">{{ tpl.desc }}</span>
            </button>
          </div>
        </div>

        <!-- BUILDER -->
        <div class="builder-grid">
          <!-- LEFT: Form -->
          <div class="builder-form">
            <div class="form-section">
              <label>🎭 Rôle / Persona</label>
              <textarea v-model="prompt.role" placeholder="Tu es un expert en..." rows="2"></textarea>
            </div>

            <div class="form-section">
              <label>🎯 Objectif / Tâche</label>
              <textarea v-model="prompt.task" placeholder="Ta mission est de..." rows="3"></textarea>
            </div>

            <div class="form-section">
              <label>📋 Contexte</label>
              <textarea v-model="prompt.context" placeholder="Voici le contexte..." rows="3"></textarea>
            </div>

            <div class="form-section">
              <label>📝 Instructions spécifiques</label>
              <div class="instructions-list">
                <div v-for="(inst, i) in prompt.instructions" :key="i" class="instruction-row">
                  <span class="inst-num">{{ i + 1 }}.</span>
                  <input type="text" v-model="prompt.instructions[i]" placeholder="Instruction...">
                  <button class="remove-btn" @click="removeInstruction(i)">✕</button>
                </div>
              </div>
              <button class="add-btn" @click="addInstruction">+ Ajouter une instruction</button>
            </div>

            <div class="form-section">
              <label>📤 Format de sortie</label>
              <select v-model="prompt.outputFormat">
                <option value="">Pas de format spécifique</option>
                <option value="json">JSON structuré</option>
                <option value="markdown">Markdown</option>
                <option value="list">Liste à puces</option>
                <option value="table">Tableau</option>
                <option value="code">Code avec explications</option>
                <option value="steps">Étapes numérotées</option>
              </select>
            </div>

            <div class="form-section">
              <label>⚙️ Paramètres avancés</label>
              <div class="params-grid">
                <label class="checkbox-label">
                  <input type="checkbox" v-model="prompt.chainOfThought">
                  <span>Chain of Thought (réflexion étape par étape)</span>
                </label>
                <label class="checkbox-label">
                  <input type="checkbox" v-model="prompt.fewShot">
                  <span>Inclure exemples (few-shot)</span>
                </label>
                <label class="checkbox-label">
                  <input type="checkbox" v-model="prompt.constraints">
                  <span>Ajouter contraintes</span>
                </label>
              </div>
            </div>

            <div class="form-section" v-if="prompt.fewShot">
              <label>💡 Exemples (Few-shot)</label>
              <div v-for="(ex, i) in prompt.examples" :key="i" class="example-block">
                <input type="text" v-model="ex.input" placeholder="Input exemple...">
                <input type="text" v-model="ex.output" placeholder="Output attendu...">
                <button class="remove-btn" @click="removeExample(i)">✕</button>
              </div>
              <button class="add-btn" @click="addExample">+ Ajouter un exemple</button>
            </div>

            <div class="form-section" v-if="prompt.constraints">
              <label>🚫 Contraintes</label>
              <textarea v-model="prompt.constraintText" placeholder="Ne fais PAS ceci... Évite de... Maximum X caractères..." rows="2"></textarea>
            </div>
          </div>

          <!-- RIGHT: Preview -->
          <div class="preview-panel">
            <div class="preview-header">
              <h2>📋 Prompt généré</h2>
              <div class="preview-stats">
                <span>{{ generatedPrompt.length }} caractères</span>
                <span>~{{ Math.ceil(generatedPrompt.length / 4) }} tokens</span>
              </div>
            </div>
            <pre class="preview-content">{{ generatedPrompt }}</pre>
            <div class="preview-actions">
              <button class="action-btn" :class="{ copied }" @click="copyPrompt">
                {{ copied ? '✓ Copié !' : '📋 Copier' }}
              </button>
              <button class="action-btn" @click="downloadPrompt">💾 Télécharger</button>
              <button class="action-btn action-btn--clear" @click="clearPrompt">🗑️ Effacer</button>
            </div>
          </div>
        </div>

        <!-- TIPS -->
        <div class="tips-section">
          <h2>💡 Bonnes pratiques</h2>
          <div class="tips-grid">
            <div class="tip-card">
              <span class="tip-icon">🎯</span>
              <h3>Soyez spécifique</h3>
              <p>Plus le prompt est précis, meilleure sera la réponse. Évitez les termes vagues.</p>
            </div>
            <div class="tip-card">
              <span class="tip-icon">🧩</span>
              <h3>Structurez</h3>
              <p>Utilisez des sections claires : rôle, contexte, tâche, format de sortie.</p>
            </div>
            <div class="tip-card">
              <span class="tip-icon">💡</span>
              <h3>Donnez des exemples</h3>
              <p>Le few-shot learning améliore drastiquement la qualité des réponses.</p>
            </div>
            <div class="tip-card">
              <span class="tip-icon">🔄</span>
              <h3>Itérez</h3>
              <p>Testez, analysez les résultats, et affinez votre prompt progressivement.</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue';

const copied = ref(false);
const selectedTemplate = ref('');

const prompt = reactive({
  role: '',
  task: '',
  context: '',
  instructions: [''],
  outputFormat: '',
  chainOfThought: false,
  fewShot: false,
  constraints: false,
  examples: [{ input: '', output: '' }],
  constraintText: ''
});

const templates = [
  {
    id: 'assistant',
    icon: '🤖',
    name: 'Assistant IA',
    desc: 'Chatbot personnalisé',
    data: {
      role: "Tu es un assistant IA professionnel, courtois et précis. Tu réponds de manière concise tout en étant complet.",
      task: "Aide l'utilisateur dans ses demandes en fournissant des réponses utiles et actionnables.",
      instructions: ["Réponds en français", "Sois concis mais complet", "Propose des alternatives si pertinent"],
      outputFormat: 'markdown'
    }
  },
  {
    id: 'code-review',
    icon: '👨‍💻',
    name: 'Code Review',
    desc: 'Analyse de code',
    data: {
      role: "Tu es un développeur senior expert en revue de code. Tu identifies les bugs, les problèmes de performance et les améliorations possibles.",
      task: "Analyse le code fourni et propose des améliorations constructives.",
      instructions: ["Identifie les bugs potentiels", "Suggère des optimisations", "Vérifie les bonnes pratiques", "Propose du code corrigé"],
      outputFormat: 'code',
      chainOfThought: true
    }
  },
  {
    id: 'content-writer',
    icon: '✍️',
    name: 'Rédacteur',
    desc: 'Création de contenu',
    data: {
      role: "Tu es un rédacteur web expert en SEO et en copywriting persuasif.",
      task: "Rédige du contenu engageant, optimisé pour le référencement et adapté à la cible.",
      instructions: ["Utilise un ton professionnel mais accessible", "Intègre naturellement les mots-clés", "Structure avec des titres H2/H3"],
      outputFormat: 'markdown'
    }
  },
  {
    id: 'data-analyst',
    icon: '📊',
    name: 'Data Analyst',
    desc: 'Analyse de données',
    data: {
      role: "Tu es un data analyst expert capable d'extraire des insights pertinents à partir de données brutes.",
      task: "Analyse les données fournies et génère un rapport avec des recommandations actionnables.",
      instructions: ["Identifie les tendances clés", "Calcule les métriques importantes", "Propose des visualisations adaptées", "Formule des recommandations"],
      outputFormat: 'table',
      chainOfThought: true
    }
  },
  {
    id: 'translator',
    icon: '🌍',
    name: 'Traducteur',
    desc: 'Traduction pro',
    data: {
      role: "Tu es un traducteur professionnel natif dans les langues cibles, expert en localisation culturelle.",
      task: "Traduis le texte en préservant le sens, le ton et les nuances culturelles.",
      instructions: ["Préserve le registre de langue", "Adapte les expressions idiomatiques", "Garde la mise en forme originale"],
      outputFormat: ''
    }
  },
  {
    id: 'json-extractor',
    icon: '📦',
    name: 'Extracteur JSON',
    desc: 'Données structurées',
    data: {
      role: "Tu es un extracteur de données expert. Tu transformes du texte non structuré en JSON propre et validé.",
      task: "Extrait les informations pertinentes du texte et retourne un objet JSON structuré.",
      instructions: ["Identifie toutes les entités nommées", "Structure les données logiquement", "Valide le format JSON"],
      outputFormat: 'json'
    }
  }
];

function loadTemplate(tpl) {
  selectedTemplate.value = tpl.id;
  Object.assign(prompt, {
    role: tpl.data.role || '',
    task: tpl.data.task || '',
    context: '',
    instructions: tpl.data.instructions || [''],
    outputFormat: tpl.data.outputFormat || '',
    chainOfThought: tpl.data.chainOfThought || false,
    fewShot: false,
    constraints: false,
    examples: [{ input: '', output: '' }],
    constraintText: ''
  });
}

function addInstruction() {
  prompt.instructions.push('');
}

function removeInstruction(index) {
  if (prompt.instructions.length > 1) {
    prompt.instructions.splice(index, 1);
  }
}

function addExample() {
  prompt.examples.push({ input: '', output: '' });
}

function removeExample(index) {
  if (prompt.examples.length > 1) {
    prompt.examples.splice(index, 1);
  }
}

const generatedPrompt = computed(() => {
  let parts = [];

  if (prompt.role) {
    parts.push(`# RÔLE\n${prompt.role}`);
  }

  if (prompt.context) {
    parts.push(`# CONTEXTE\n${prompt.context}`);
  }

  if (prompt.task) {
    parts.push(`# TÂCHE\n${prompt.task}`);
  }

  const validInstructions = prompt.instructions.filter(i => i.trim());
  if (validInstructions.length) {
    parts.push(`# INSTRUCTIONS\n${validInstructions.map((i, idx) => `${idx + 1}. ${i}`).join('\n')}`);
  }

  if (prompt.fewShot) {
    const validExamples = prompt.examples.filter(e => e.input.trim() && e.output.trim());
    if (validExamples.length) {
      const examplesText = validExamples.map((e, i) => `Exemple ${i + 1}:\nInput: ${e.input}\nOutput: ${e.output}`).join('\n\n');
      parts.push(`# EXEMPLES\n${examplesText}`);
    }
  }

  if (prompt.constraints && prompt.constraintText) {
    parts.push(`# CONTRAINTES\n${prompt.constraintText}`);
  }

  if (prompt.outputFormat) {
    const formats = {
      json: 'Réponds UNIQUEMENT avec un objet JSON valide, sans texte avant ou après.',
      markdown: 'Formate ta réponse en Markdown avec des titres, listes et mise en forme appropriée.',
      list: 'Présente ta réponse sous forme de liste à puces claire et concise.',
      table: 'Présente les données dans un tableau Markdown bien formaté.',
      code: 'Fournis le code avec des commentaires explicatifs et des exemples d\'utilisation.',
      steps: 'Présente ta réponse en étapes numérotées claires et actionnables.'
    };
    parts.push(`# FORMAT DE SORTIE\n${formats[prompt.outputFormat]}`);
  }

  if (prompt.chainOfThought) {
    parts.push(`# MÉTHODE\nRéfléchis étape par étape avant de donner ta réponse finale. Montre ton raisonnement.`);
  }

  return parts.join('\n\n');
});

async function copyPrompt() {
  await navigator.clipboard.writeText(generatedPrompt.value);
  copied.value = true;
  setTimeout(() => copied.value = false, 2000);
}

function downloadPrompt() {
  const blob = new Blob([generatedPrompt.value], { type: 'text/plain' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'prompt.txt';
  a.click();
}

function clearPrompt() {
  Object.assign(prompt, {
    role: '',
    task: '',
    context: '',
    instructions: [''],
    outputFormat: '',
    chainOfThought: false,
    fewShot: false,
    constraints: false,
    examples: [{ input: '', output: '' }],
    constraintText: ''
  });
  selectedTemplate.value = '';
}
</script>

<style scoped>
.prompt-app { min-height: 100vh; background: var(--bg-primary); }
.app-header { padding: 1rem 0; border-bottom: 1px solid var(--border); background: rgba(10,10,15,0.9); backdrop-filter: blur(10px); }
.back-link { display: inline-flex; align-items: center; gap: 0.5rem; color: var(--text-muted); text-decoration: none; }
.back-link:hover { color: var(--primary); }
.app-main { padding: var(--space-lg) 0; }
.app-intro { text-align: center; margin-bottom: var(--space-lg); }
.app-intro h1 { display: flex; align-items: center; justify-content: center; gap: 0.75rem; font-size: 2rem; margin-bottom: 0.5rem; }
.app-icon { font-size: 2.5rem; }
.app-intro p { color: var(--text-muted); }

.templates-section { margin-bottom: var(--space-lg); }
.templates-section h2 { font-size: 1.1rem; margin-bottom: 1rem; }
.templates-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 1rem; }
.template-card { display: flex; flex-direction: column; align-items: center; gap: 0.5rem; padding: 1.25rem; background: rgba(255,255,255,0.02); border: 1px solid var(--border); border-radius: 0.75rem; cursor: pointer; transition: all 0.2s; text-align: center; }
.template-card:hover { border-color: var(--primary); transform: translateY(-2px); }
.template-card.active { border-color: var(--primary); background: rgba(0,255,136,0.1); }
.template-icon { font-size: 2rem; }
.template-name { font-weight: 600; font-size: 0.9rem; }
.template-desc { font-size: 0.75rem; color: var(--text-muted); }

.builder-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-bottom: var(--space-lg); }
.builder-form { display: flex; flex-direction: column; gap: 1.25rem; }
.form-section label { display: block; font-size: 0.9rem; font-weight: 600; margin-bottom: 0.5rem; }
.form-section textarea, .form-section select { width: 100%; padding: 0.75rem; background: rgba(0,0,0,0.3); border: 1px solid var(--border); border-radius: 0.5rem; color: var(--text-main); font-size: 0.9rem; resize: vertical; }
.form-section textarea:focus, .form-section select:focus { outline: none; border-color: var(--primary); }

.instructions-list { display: flex; flex-direction: column; gap: 0.5rem; margin-bottom: 0.5rem; }
.instruction-row { display: flex; gap: 0.5rem; align-items: center; }
.inst-num { font-family: 'JetBrains Mono', monospace; color: var(--primary); font-size: 0.85rem; width: 24px; }
.instruction-row input { flex: 1; padding: 0.5rem; background: rgba(0,0,0,0.3); border: 1px solid var(--border); border-radius: 0.35rem; color: var(--text-main); }
.remove-btn { padding: 0.35rem 0.5rem; background: transparent; border: 1px solid var(--border); border-radius: 0.25rem; color: var(--text-muted); cursor: pointer; }
.remove-btn:hover { border-color: #EF4444; color: #EF4444; }
.add-btn { padding: 0.5rem 1rem; background: transparent; border: 1px dashed var(--border); border-radius: 0.35rem; color: var(--text-muted); cursor: pointer; font-size: 0.85rem; }
.add-btn:hover { border-color: var(--primary); color: var(--primary); }

.params-grid { display: flex; flex-direction: column; gap: 0.75rem; }
.checkbox-label { display: flex; align-items: center; gap: 0.75rem; cursor: pointer; font-size: 0.85rem; color: var(--text-secondary); }
.checkbox-label input { accent-color: var(--primary); width: 18px; height: 18px; }

.example-block { display: flex; gap: 0.5rem; margin-bottom: 0.5rem; }
.example-block input { flex: 1; padding: 0.5rem; background: rgba(0,0,0,0.3); border: 1px solid var(--border); border-radius: 0.35rem; color: var(--text-main); font-size: 0.85rem; }

.preview-panel { background: rgba(255,255,255,0.02); border: 1px solid var(--border); border-radius: 0.75rem; display: flex; flex-direction: column; }
.preview-header { display: flex; justify-content: space-between; align-items: center; padding: 1rem; border-bottom: 1px solid var(--border); }
.preview-header h2 { font-size: 1rem; margin: 0; }
.preview-stats { display: flex; gap: 1rem; font-size: 0.75rem; color: var(--text-muted); font-family: 'JetBrains Mono', monospace; }
.preview-content { flex: 1; padding: 1rem; font-family: 'JetBrains Mono', monospace; font-size: 0.85rem; color: var(--text-secondary); white-space: pre-wrap; overflow-y: auto; max-height: 500px; line-height: 1.6; }
.preview-actions { display: flex; gap: 0.5rem; padding: 1rem; border-top: 1px solid var(--border); }
.action-btn { padding: 0.5rem 1rem; background: rgba(255,255,255,0.05); border: 1px solid var(--border); border-radius: 0.35rem; color: var(--text-muted); cursor: pointer; font-size: 0.85rem; }
.action-btn:hover { border-color: var(--primary); color: var(--primary); }
.action-btn.copied { background: var(--primary); border-color: var(--primary); color: var(--bg-primary); }
.action-btn--clear:hover { border-color: #EF4444; color: #EF4444; }

.tips-section h2 { font-size: 1.1rem; margin-bottom: 1rem; }
.tips-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1rem; }
.tip-card { padding: 1.25rem; background: rgba(255,255,255,0.02); border: 1px solid var(--border); border-radius: 0.75rem; }
.tip-icon { font-size: 1.5rem; display: block; margin-bottom: 0.5rem; }
.tip-card h3 { font-size: 0.95rem; margin-bottom: 0.5rem; }
.tip-card p { font-size: 0.8rem; color: var(--text-muted); line-height: 1.5; }

@media (max-width: 968px) { .builder-grid { grid-template-columns: 1fr; } }
</style>
