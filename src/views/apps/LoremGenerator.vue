<template>
  <div class="lorem-app">
    <a href="#main-content" class="skip-link">Aller au contenu principal</a>

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

    <main class="app-main" id="main-content">
      <div class="container">
        <div class="app-intro">
          <h1><span class="app-icon">📝</span> Lorem Ipsum</h1>
          <p>Générez du texte placeholder pour vos maquettes</p>
        </div>

        <!-- CONTROLS -->
        <div class="controls-card">
          <div class="controls-row">
            <div class="control-group">
              <label>Type</label>
              <div class="type-buttons">
                <button :class="{ active: type === 'paragraphs' }" @click="type = 'paragraphs'; generate()">
                  📄 Paragraphes
                </button>
                <button :class="{ active: type === 'sentences' }" @click="type = 'sentences'; generate()">
                  📝 Phrases
                </button>
                <button :class="{ active: type === 'words' }" @click="type = 'words'; generate()">
                  🔤 Mots
                </button>
              </div>
            </div>

            <div class="control-group">
              <label>Quantité : {{ count }}</label>
              <input type="range" v-model.number="count" :min="1" :max="maxCount" @input="generate" class="slider">
            </div>
          </div>

          <div class="controls-row">
            <label class="checkbox-label">
              <input type="checkbox" v-model="startWithLorem" @change="generate">
              <span class="checkbox-box"></span>
              <span>Commencer par "Lorem ipsum..."</span>
            </label>

            <label class="checkbox-label">
              <input type="checkbox" v-model="includeHtml" @change="generate">
              <span class="checkbox-box"></span>
              <span>Inclure les balises &lt;p&gt;</span>
            </label>
          </div>

          <button class="generate-btn" @click="generate">
            🎲 Régénérer
          </button>
        </div>

        <!-- OUTPUT -->
        <div class="output-section">
          <div class="output-header">
            <span class="output-stats">
              {{ wordCount }} mots • {{ charCount }} caractères
            </span>
            <button class="copy-btn" @click="copyText" :class="{ copied }">
              {{ copied ? '✓ Copié !' : '📋 Copier' }}
            </button>
          </div>
          <div class="output-content" v-html="displayText"></div>
        </div>

        <!-- PRESETS -->
        <div class="presets-section">
          <h2>⚡ Préréglages rapides</h2>
          <div class="presets-grid">
            <button class="preset-btn" @click="applyPreset('short')">
              <span class="preset-icon">📄</span>
              <span class="preset-name">Court</span>
              <span class="preset-desc">1 paragraphe</span>
            </button>
            <button class="preset-btn" @click="applyPreset('medium')">
              <span class="preset-icon">📑</span>
              <span class="preset-name">Moyen</span>
              <span class="preset-desc">3 paragraphes</span>
            </button>
            <button class="preset-btn" @click="applyPreset('long')">
              <span class="preset-icon">📚</span>
              <span class="preset-name">Long</span>
              <span class="preset-desc">5 paragraphes</span>
            </button>
            <button class="preset-btn" @click="applyPreset('tweet')">
              <span class="preset-icon">🐦</span>
              <span class="preset-name">Tweet</span>
              <span class="preset-desc">~280 caractères</span>
            </button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

const type = ref('paragraphs');
const count = ref(3);
const startWithLorem = ref(true);
const includeHtml = ref(false);
const output = ref('');
const copied = ref(false);

const loremWords = [
  'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
  'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
  'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud',
  'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo',
  'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit', 'voluptate',
  'velit', 'esse', 'cillum', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint',
  'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui', 'officia',
  'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum', 'vitae', 'elementum',
  'curabitur', 'semper', 'nunc', 'pulvinar', 'sapien', 'ac', 'euismod', 'lacinia',
  'quis', 'vel', 'eros', 'donec', 'ac', 'odio', 'tempor', 'orci', 'dapibus',
  'ultrices', 'posuere', 'cubilia', 'curae', 'mauris', 'pharetra', 'nibh',
  'venenatis', 'cras', 'adipiscing', 'faucibus', 'interdum', 'scelerisque',
  'fermentum', 'dui', 'faucibus', 'ornare', 'lectus', 'arcu', 'bibendum',
  'at', 'varius', 'turpis', 'massa', 'tincidunt', 'nunc', 'pulvinar'
];

const loremStart = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit';

const maxCount = computed(() => {
  if (type.value === 'paragraphs') return 10;
  if (type.value === 'sentences') return 20;
  return 200;
});

const wordCount = computed(() => output.value.split(/\s+/).filter(w => w).length);
const charCount = computed(() => output.value.length);

const displayText = computed(() => {
  if (includeHtml.value && type.value === 'paragraphs') {
    return output.value;
  }
  return output.value.replace(/\n\n/g, '<br><br>');
});

function getRandomWord() {
  return loremWords[Math.floor(Math.random() * loremWords.length)];
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function generateSentence(minWords = 8, maxWords = 16) {
  const length = Math.floor(Math.random() * (maxWords - minWords + 1)) + minWords;
  const words = [];
  
  for (let i = 0; i < length; i++) {
    words.push(getRandomWord());
  }
  
  // Add commas randomly
  if (length > 8 && Math.random() > 0.5) {
    const commaPos = Math.floor(length / 2) + Math.floor(Math.random() * 3) - 1;
    words[commaPos] += ',';
  }
  
  return capitalize(words.join(' ')) + '.';
}

function generateParagraph(minSentences = 4, maxSentences = 8) {
  const numSentences = Math.floor(Math.random() * (maxSentences - minSentences + 1)) + minSentences;
  const sentences = [];
  
  for (let i = 0; i < numSentences; i++) {
    sentences.push(generateSentence());
  }
  
  return sentences.join(' ');
}

function generate() {
  let result = '';
  
  if (type.value === 'paragraphs') {
    const paragraphs = [];
    
    for (let i = 0; i < count.value; i++) {
      let para = generateParagraph();
      
      if (i === 0 && startWithLorem.value) {
        para = loremStart + ', ' + para.charAt(0).toLowerCase() + para.slice(1);
      }
      
      if (includeHtml.value) {
        para = `<p>${para}</p>`;
      }
      
      paragraphs.push(para);
    }
    
    result = paragraphs.join(includeHtml.value ? '\n' : '\n\n');
    
  } else if (type.value === 'sentences') {
    const sentences = [];
    
    for (let i = 0; i < count.value; i++) {
      let sentence = generateSentence();
      
      if (i === 0 && startWithLorem.value) {
        sentence = loremStart + '.';
      }
      
      sentences.push(sentence);
    }
    
    result = sentences.join(' ');
    
  } else {
    const words = [];
    
    if (startWithLorem.value) {
      words.push('Lorem', 'ipsum', 'dolor', 'sit', 'amet');
    }
    
    while (words.length < count.value) {
      words.push(getRandomWord());
    }
    
    result = words.slice(0, count.value).join(' ');
  }
  
  output.value = result;
}

async function copyText() {
  try {
    // Copy without HTML tags
    const plainText = output.value.replace(/<[^>]*>/g, '');
    await navigator.clipboard.writeText(plainText);
    copied.value = true;
    setTimeout(() => copied.value = false, 2000);
  } catch (err) {
    console.error('Copy failed:', err);
  }
}

function applyPreset(preset) {
  switch (preset) {
    case 'short':
      type.value = 'paragraphs';
      count.value = 1;
      break;
    case 'medium':
      type.value = 'paragraphs';
      count.value = 3;
      break;
    case 'long':
      type.value = 'paragraphs';
      count.value = 5;
      break;
    case 'tweet':
      type.value = 'words';
      count.value = 40;
      break;
  }
  generate();
}

onMounted(() => {
  generate();
});
</script>

<style scoped>
.lorem-app {
  min-height: 100vh;
  background: var(--bg-primary);
}

.app-header {
  padding: 1rem 0;
  border-bottom: 1px solid var(--border);
  background: rgba(10, 10, 15, 0.9);
  backdrop-filter: blur(10px);
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-muted);
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.3s ease;
}

.back-link:hover { color: var(--primary); }

.app-main {
  padding: var(--space-lg) 0;
}

.app-intro {
  text-align: center;
  margin-bottom: var(--space-lg);
}

.app-intro h1 {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.app-icon { font-size: 2.5rem; }
.app-intro p { color: var(--text-muted); }

/* Controls */
.controls-card {
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid var(--border);
  border-radius: 1rem;
  margin-bottom: var(--space-lg);
}

.controls-row {
  display: flex;
  gap: 2rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.control-group {
  flex: 1;
  min-width: 200px;
}

.control-group label {
  display: block;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.85rem;
  color: var(--text-muted);
  margin-bottom: 0.75rem;
}

.type-buttons {
  display: flex;
  gap: 0.5rem;
}

.type-buttons button {
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid var(--border);
  border-radius: 0.5rem;
  font-size: 0.8rem;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.3s ease;
}

.type-buttons button:hover {
  border-color: var(--primary);
}

.type-buttons button.active {
  background: var(--primary);
  border-color: var(--primary);
  color: var(--bg-primary);
}

.slider {
  width: 100%;
  -webkit-appearance: none;
  height: 8px;
  border-radius: 4px;
  background: var(--border);
  cursor: pointer;
}

.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: var(--primary);
  cursor: pointer;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.checkbox-label input { display: none; }

.checkbox-box {
  width: 20px;
  height: 20px;
  border: 2px solid var(--border);
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.checkbox-label input:checked + .checkbox-box {
  background: var(--primary);
  border-color: var(--primary);
}

.checkbox-label input:checked + .checkbox-box::after {
  content: '✓';
  color: var(--bg-primary);
  font-size: 0.75rem;
  font-weight: bold;
}

.generate-btn {
  width: 100%;
  padding: 0.875rem;
  background: rgba(0, 255, 136, 0.1);
  border: 1px solid var(--primary);
  border-radius: 0.5rem;
  font-family: 'JetBrains Mono', monospace;
  font-size: 1rem;
  color: var(--primary);
  cursor: pointer;
  transition: all 0.3s ease;
}

.generate-btn:hover {
  background: var(--primary);
  color: var(--bg-primary);
}

/* Output */
.output-section {
  margin-bottom: var(--space-lg);
}

.output-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.output-stats {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.85rem;
  color: var(--text-muted);
}

.copy-btn {
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--border);
  border-radius: 0.5rem;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.8rem;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.3s ease;
}

.copy-btn:hover {
  border-color: var(--primary);
  color: var(--primary);
}

.copy-btn.copied {
  background: var(--primary);
  border-color: var(--primary);
  color: var(--bg-primary);
}

.output-content {
  padding: 1.5rem;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid var(--border);
  border-radius: 1rem;
  font-size: 0.95rem;
  line-height: 1.7;
  color: var(--text-secondary);
  max-height: 400px;
  overflow-y: auto;
}

/* Presets */
.presets-section h2 {
  font-size: 1.1rem;
  margin-bottom: 1rem;
}

.presets-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
}

.preset-btn {
  padding: 1.25rem;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid var(--border);
  border-radius: 1rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.preset-btn:hover {
  border-color: var(--primary);
  transform: translateY(-2px);
}

.preset-icon {
  font-size: 2rem;
  display: block;
  margin-bottom: 0.5rem;
}

.preset-name {
  display: block;
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.preset-desc {
  font-size: 0.75rem;
  color: var(--text-muted);
}

@media (max-width: 768px) {
  .controls-row {
    flex-direction: column;
    gap: 1rem;
  }
  
  .type-buttons {
    flex-wrap: wrap;
  }
}
</style>
