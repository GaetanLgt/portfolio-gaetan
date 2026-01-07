<template>
  <div class="markdown-app">
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
          <h1><span class="app-icon">📝</span> Markdown Preview</h1>
          <p>Éditeur Markdown avec prévisualisation en temps réel</p>
        </div>

        <!-- TOOLBAR -->
        <div class="toolbar">
          <button @click="insertMd('**', '**')" title="Gras"><strong>B</strong></button>
          <button @click="insertMd('*', '*')" title="Italique"><em>I</em></button>
          <button @click="insertMd('~~', '~~')" title="Barré"><s>S</s></button>
          <span class="toolbar-sep"></span>
          <button @click="insertMd('# ', '')" title="Titre 1">H1</button>
          <button @click="insertMd('## ', '')" title="Titre 2">H2</button>
          <button @click="insertMd('### ', '')" title="Titre 3">H3</button>
          <span class="toolbar-sep"></span>
          <button @click="insertMd('- ', '')" title="Liste">•</button>
          <button @click="insertMd('1. ', '')" title="Liste numérotée">1.</button>
          <button @click="insertMd('> ', '')" title="Citation">❝</button>
          <span class="toolbar-sep"></span>
          <button @click="insertMd('[', '](url)')" title="Lien">🔗</button>
          <button @click="insertMd('![alt](', ')')" title="Image">🖼️</button>
          <button @click="insertMd('`', '`')" title="Code inline">`</button>
          <button @click="insertMd('\n```\n', '\n```\n')" title="Bloc de code">```</button>
          <span class="toolbar-sep"></span>
          <button @click="insertMd('| Col1 | Col2 |\n|------|------|\n| ', ' | val2 |')" title="Tableau">📊</button>
          <button @click="insertMd('---\n', '')" title="Séparateur">—</button>
        </div>

        <!-- EDITOR -->
        <div class="editor-grid" :class="'layout-' + layout">
          <div class="editor-panel">
            <div class="panel-header">
              <span class="panel-title">📝 Markdown</span>
              <span class="panel-stats">{{ markdown.length }} caractères</span>
            </div>
            <textarea 
              ref="editorRef"
              v-model="markdown" 
              placeholder="# Écrivez en Markdown ici...

## Sous-titre

Texte en **gras** et *italique*.

- Liste item 1
- Liste item 2

> Citation inspirante

```js
const hello = 'world';
```
"
              class="editor-textarea"
            ></textarea>
          </div>

          <div class="preview-panel">
            <div class="panel-header">
              <span class="panel-title">👁️ Aperçu</span>
              <div class="layout-buttons">
                <button :class="{ active: layout === 'split' }" @click="layout = 'split'" title="Vue côte à côte">⬜⬜</button>
                <button :class="{ active: layout === 'preview' }" @click="layout = 'preview'" title="Aperçu seul">⬜</button>
              </div>
            </div>
            <div class="preview-content" v-html="renderedHtml"></div>
          </div>
        </div>

        <!-- ACTIONS -->
        <div class="actions-bar">
          <button class="action-btn" @click="copyMarkdown" :class="{ copied: copiedMd }">
            {{ copiedMd ? '✓ MD copié' : '📋 Copier MD' }}
          </button>
          <button class="action-btn" @click="copyHtml" :class="{ copied: copiedHtml }">
            {{ copiedHtml ? '✓ HTML copié' : '📋 Copier HTML' }}
          </button>
          <button class="action-btn" @click="downloadMd">💾 Télécharger .md</button>
          <button class="action-btn action-btn--clear" @click="markdown = ''">🗑️ Effacer</button>
        </div>

        <!-- CHEATSHEET -->
        <div class="cheatsheet">
          <h2>📖 Aide-mémoire Markdown</h2>
          <div class="cheatsheet-grid">
            <div class="cheat-group">
              <div class="cheat-item"><code># Titre 1</code></div>
              <div class="cheat-item"><code>## Titre 2</code></div>
              <div class="cheat-item"><code>### Titre 3</code></div>
            </div>
            <div class="cheat-group">
              <div class="cheat-item"><code>**gras**</code></div>
              <div class="cheat-item"><code>*italique*</code></div>
              <div class="cheat-item"><code>~~barré~~</code></div>
            </div>
            <div class="cheat-group">
              <div class="cheat-item"><code>- liste</code></div>
              <div class="cheat-item"><code>1. numérotée</code></div>
              <div class="cheat-item"><code>> citation</code></div>
            </div>
            <div class="cheat-group">
              <div class="cheat-item"><code>[lien](url)</code></div>
              <div class="cheat-item"><code>![image](url)</code></div>
              <div class="cheat-item"><code>`code`</code></div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const markdown = ref(`# Bienvenue sur Markdown Preview 🚀

Cet éditeur vous permet d'écrire en **Markdown** et de voir le résultat en temps réel.

## Fonctionnalités

- ✅ Prévisualisation instantanée
- ✅ Barre d'outils complète
- ✅ Export Markdown et HTML
- ✅ Support complet de la syntaxe

## Exemples de syntaxe

### Texte formaté

Vous pouvez écrire en **gras**, *italique*, ou ~~barré~~.

### Listes

1. Premier élément
2. Deuxième élément
3. Troisième élément

### Citations

> "La simplicité est la sophistication suprême."
> — Léonard de Vinci

### Code

\`\`\`javascript
const greeting = "Hello, World!";
console.log(greeting);
\`\`\`

### Tableau

| Fonctionnalité | Status |
|----------------|--------|
| Gras           | ✅     |
| Italique       | ✅     |
| Tableaux       | ✅     |

---

*Écrit avec ❤️ par GL Digital Lab*
`);

const layout = ref('split');
const editorRef = ref(null);
const copiedMd = ref(false);
const copiedHtml = ref(false);

// Simple Markdown parser
function parseMarkdown(md) {
  let html = md;
  
  // Escape HTML
  html = html.replace(/&/g, '&amp;')
             .replace(/</g, '&lt;')
             .replace(/>/g, '&gt;');
  
  // Code blocks (before other processing)
  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (_, lang, code) => {
    return `<pre><code class="language-${lang}">${code.trim()}</code></pre>`;
  });
  
  // Inline code
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
  
  // Headers
  html = html.replace(/^### (.*$)/gm, '<h3>$1</h3>');
  html = html.replace(/^## (.*$)/gm, '<h2>$1</h2>');
  html = html.replace(/^# (.*$)/gm, '<h1>$1</h1>');
  
  // Bold
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  
  // Italic
  html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  
  // Strikethrough
  html = html.replace(/~~([^~]+)~~/g, '<del>$1</del>');
  
  // Blockquotes
  html = html.replace(/^&gt; (.*$)/gm, '<blockquote>$1</blockquote>');
  
  // Horizontal rule
  html = html.replace(/^---$/gm, '<hr>');
  
  // Links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
  
  // Images
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1">');
  
  // Tables
  html = html.replace(/^\|(.+)\|$/gm, (match, content) => {
    const cells = content.split('|').map(c => c.trim());
    if (cells.every(c => /^-+$/.test(c))) {
      return ''; // Skip separator row
    }
    const cellHtml = cells.map(c => `<td>${c}</td>`).join('');
    return `<tr>${cellHtml}</tr>`;
  });
  html = html.replace(/(<tr>[\s\S]*?<\/tr>)+/g, '<table>$&</table>');
  
  // Unordered lists
  html = html.replace(/^- (.*$)/gm, '<li>$1</li>');
  html = html.replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>');
  
  // Ordered lists
  html = html.replace(/^\d+\. (.*$)/gm, '<li>$1</li>');
  
  // Paragraphs
  html = html.replace(/\n\n/g, '</p><p>');
  html = '<p>' + html + '</p>';
  
  // Clean up
  html = html.replace(/<p><\/p>/g, '');
  html = html.replace(/<p>(<h[1-6]>)/g, '$1');
  html = html.replace(/(<\/h[1-6]>)<\/p>/g, '$1');
  html = html.replace(/<p>(<pre>)/g, '$1');
  html = html.replace(/(<\/pre>)<\/p>/g, '$1');
  html = html.replace(/<p>(<ul>)/g, '$1');
  html = html.replace(/(<\/ul>)<\/p>/g, '$1');
  html = html.replace(/<p>(<blockquote>)/g, '$1');
  html = html.replace(/(<\/blockquote>)<\/p>/g, '$1');
  html = html.replace(/<p>(<table>)/g, '$1');
  html = html.replace(/(<\/table>)<\/p>/g, '$1');
  html = html.replace(/<p>(<hr>)/g, '$1');
  html = html.replace(/(<hr>)<\/p>/g, '$1');
  
  return html;
}

const renderedHtml = computed(() => parseMarkdown(markdown.value));

function insertMd(before, after) {
  const textarea = editorRef.value;
  if (!textarea) return;
  
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const selected = markdown.value.substring(start, end);
  
  markdown.value = markdown.value.substring(0, start) 
    + before + selected + after 
    + markdown.value.substring(end);
  
  // Restore focus and selection
  textarea.focus();
  setTimeout(() => {
    textarea.selectionStart = start + before.length;
    textarea.selectionEnd = start + before.length + selected.length;
  }, 0);
}

async function copyMarkdown() {
  try {
    await navigator.clipboard.writeText(markdown.value);
    copiedMd.value = true;
    setTimeout(() => copiedMd.value = false, 2000);
  } catch (err) {
    console.error('Copy failed:', err);
  }
}

async function copyHtml() {
  try {
    await navigator.clipboard.writeText(renderedHtml.value);
    copiedHtml.value = true;
    setTimeout(() => copiedHtml.value = false, 2000);
  } catch (err) {
    console.error('Copy failed:', err);
  }
}

function downloadMd() {
  const blob = new Blob([markdown.value], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'document.md';
  a.click();
  URL.revokeObjectURL(url);
}
</script>

<style scoped>
.markdown-app {
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

.app-main { padding: var(--space-lg) 0; }

.app-intro {
  text-align: center;
  margin-bottom: var(--space-md);
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

/* Toolbar */
.toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
  padding: 0.75rem;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid var(--border);
  border-radius: 0.75rem 0.75rem 0 0;
  border-bottom: none;
}

.toolbar button {
  min-width: 36px;
  height: 36px;
  padding: 0 0.5rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--border);
  border-radius: 0.35rem;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.85rem;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s ease;
}

.toolbar button:hover {
  border-color: var(--primary);
  color: var(--primary);
  background: rgba(0, 255, 136, 0.1);
}

.toolbar-sep {
  width: 1px;
  height: 24px;
  background: var(--border);
  margin: 6px 0.5rem;
}

/* Editor Grid */
.editor-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0;
  margin-bottom: var(--space-md);
  border: 1px solid var(--border);
  border-radius: 0 0 0.75rem 0.75rem;
  overflow: hidden;
}

.editor-grid.layout-preview .editor-panel {
  display: none;
}

.editor-grid.layout-preview {
  grid-template-columns: 1fr;
}

.editor-panel, .preview-panel {
  display: flex;
  flex-direction: column;
  min-height: 500px;
}

.editor-panel {
  border-right: 1px solid var(--border);
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 1rem;
  background: rgba(0, 0, 0, 0.2);
  border-bottom: 1px solid var(--border);
}

.panel-title {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.8rem;
  color: var(--text-muted);
}

.panel-stats {
  font-size: 0.7rem;
  color: var(--text-dark);
}

.layout-buttons {
  display: flex;
  gap: 0.25rem;
}

.layout-buttons button {
  padding: 0.25rem 0.5rem;
  background: transparent;
  border: 1px solid var(--border);
  border-radius: 0.25rem;
  font-size: 0.7rem;
  color: var(--text-muted);
  cursor: pointer;
  transition: all 0.2s ease;
}

.layout-buttons button.active {
  background: var(--primary);
  border-color: var(--primary);
  color: var(--bg-primary);
}

.editor-textarea {
  flex: 1;
  padding: 1rem;
  background: rgba(0, 0, 0, 0.2);
  border: none;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.9rem;
  line-height: 1.6;
  color: var(--text-main);
  resize: none;
}

.editor-textarea:focus { outline: none; }

.preview-content {
  flex: 1;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.02);
  overflow-y: auto;
  line-height: 1.7;
}

/* Preview styles */
.preview-content :deep(h1) { font-size: 1.75rem; margin: 1.5rem 0 1rem; color: var(--text-main); border-bottom: 1px solid var(--border); padding-bottom: 0.5rem; }
.preview-content :deep(h2) { font-size: 1.4rem; margin: 1.25rem 0 0.75rem; color: var(--text-main); }
.preview-content :deep(h3) { font-size: 1.15rem; margin: 1rem 0 0.5rem; color: var(--text-main); }
.preview-content :deep(p) { margin: 0.75rem 0; color: var(--text-secondary); }
.preview-content :deep(strong) { color: var(--text-main); }
.preview-content :deep(em) { color: var(--text-secondary); }
.preview-content :deep(del) { color: var(--text-dark); }
.preview-content :deep(a) { color: var(--primary); text-decoration: underline; }
.preview-content :deep(code) { font-family: 'JetBrains Mono', monospace; background: rgba(0, 0, 0, 0.3); padding: 0.15rem 0.35rem; border-radius: 0.25rem; font-size: 0.85em; color: var(--accent); }
.preview-content :deep(pre) { background: rgba(0, 0, 0, 0.4); padding: 1rem; border-radius: 0.5rem; overflow-x: auto; margin: 1rem 0; }
.preview-content :deep(pre code) { background: transparent; padding: 0; color: var(--text-main); }
.preview-content :deep(blockquote) { border-left: 3px solid var(--primary); padding-left: 1rem; margin: 1rem 0; color: var(--text-muted); font-style: italic; }
.preview-content :deep(ul), .preview-content :deep(ol) { padding-left: 1.5rem; margin: 0.75rem 0; }
.preview-content :deep(li) { margin: 0.35rem 0; color: var(--text-secondary); }
.preview-content :deep(hr) { border: none; border-top: 1px solid var(--border); margin: 1.5rem 0; }
.preview-content :deep(table) { width: 100%; border-collapse: collapse; margin: 1rem 0; }
.preview-content :deep(td) { padding: 0.5rem 0.75rem; border: 1px solid var(--border); }
.preview-content :deep(tr:first-child td) { background: rgba(0, 0, 0, 0.2); font-weight: 600; }
.preview-content :deep(img) { max-width: 100%; border-radius: 0.5rem; }

/* Actions Bar */
.actions-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-bottom: var(--space-lg);
}

.action-btn {
  padding: 0.6rem 1rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--border);
  border-radius: 0.5rem;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.8rem;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s ease;
}

.action-btn:hover { border-color: var(--primary); color: var(--primary); }
.action-btn.copied { background: var(--primary); border-color: var(--primary); color: var(--bg-primary); }
.action-btn--clear:hover { border-color: #EF4444; color: #EF4444; }

/* Cheatsheet */
.cheatsheet h2 {
  font-size: 1.1rem;
  margin-bottom: 1rem;
}

.cheatsheet-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1rem;
}

.cheat-group {
  padding: 1rem;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid var(--border);
  border-radius: 0.5rem;
}

.cheat-item {
  margin-bottom: 0.5rem;
}

.cheat-item code {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.8rem;
  color: var(--primary);
}

@media (max-width: 768px) {
  .editor-grid {
    grid-template-columns: 1fr;
  }
  
  .editor-panel {
    border-right: none;
    border-bottom: 1px solid var(--border);
    min-height: 300px;
  }
  
  .preview-panel {
    min-height: 300px;
  }
}
</style>
