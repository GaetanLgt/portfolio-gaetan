<template>
  <div class="tuto-page">
    <!-- Ambient Background -->
    <div class="tuto-ambient">
      <div class="tuto-ambient__grid"></div>
    </div>

    <!-- HERO -->
    <section class="tuto-hero">
      <div class="container">
        <div class="tuto-hero__breadcrumb">
          <router-link to="/">Accueil</router-link>
          <span>/</span>
          <span>Tutoriels</span>
        </div>
        
        <div class="tuto-hero__content reveal">
          <div class="status-badge">
            <span class="status-badge__dot"></span>
            <span class="status-badge__text">DOCUMENTATION TECHNIQUE</span>
          </div>
          
          <h1 class="tuto-hero__title">
            <span class="text-gradient">Tutoriels</span>
            <span class="tuto-hero__title-sub">& Guides Techniques</span>
          </h1>
          
          <p class="tuto-hero__desc">
            Des guides <strong>pas à pas</strong> pour maîtriser les stacks modernes.
            Symfony, Vue, Vite, Docker, IA locale — tout ce que j'utilise au quotidien.
          </p>
        </div>
      </div>
    </section>

    <!-- TUTORIALS LIST -->
    <section class="tuto-section">
      <div class="container">
        <div class="tuto-grid">
          <article 
            v-for="tutorial in tutorials" 
            :key="tutorial.slug"
            class="tuto-card glass reveal"
            :class="{ 'tuto-card--clickable': !tutorial.comingSoon }"
            @click="openTutorial(tutorial)"
            tabindex="0"
            @keydown.enter="openTutorial(tutorial)"
          >
            <div class="tuto-card__header">
              <span class="tuto-card__icon">{{ tutorial.icon }}</span>
              <div class="tuto-card__meta">
                <span class="tuto-card__category">{{ tutorial.category }}</span>
                <span class="tuto-card__date">{{ tutorial.date }}</span>
              </div>
            </div>
            
            <h2 class="tuto-card__title">{{ tutorial.title }}</h2>
            <p class="tuto-card__desc">{{ tutorial.description }}</p>
            
            <div class="tuto-card__tags">
              <span v-for="tag in tutorial.tags" :key="tag" class="tuto-tag">{{ tag }}</span>
            </div>
            
            <div class="tuto-card__footer">
              <span class="tuto-card__time">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12 6 12 12 16 14"/>
                </svg>
                {{ tutorial.readTime }}
              </span>
              <span class="tuto-card__level" :class="'tuto-card__level--' + tutorial.level">
                {{ tutorial.levelLabel }}
              </span>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- TUTORIAL MODAL -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="activeTutorial" class="tuto-modal" @click.self="closeTutorial">
          <div class="tuto-modal__container">
            <div class="tuto-modal__header">
              <div class="tuto-modal__header-left">
                <span class="tuto-modal__icon">{{ activeTutorial.icon }}</span>
                <div>
                  <h2>{{ activeTutorial.title }}</h2>
                  <span class="tuto-modal__meta">
                    {{ activeTutorial.category }} • {{ activeTutorial.readTime }}
                  </span>
                </div>
              </div>
              <button class="tuto-modal__close" @click="closeTutorial" aria-label="Fermer">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
            
            <div class="tuto-modal__content" v-html="activeTutorial.content"></div>
            
            <div class="tuto-modal__footer">
              <button class="btn btn--secondary" @click="closeTutorial">Fermer</button>
              <a 
                :href="activeTutorial.downloadUrl" 
                :download="activeTutorial.slug + '.md'"
                class="btn btn--primary"
                target="_blank"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="7 10 12 15 17 10"/>
                  <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                Voir le tutoriel complet
              </a>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- CTA -->
    <section class="tuto-section">
      <div class="container">
        <div class="tuto-cta glass reveal">
          <h3>Un sujet que vous aimeriez voir traité ?</h3>
          <p>Je publie régulièrement des guides techniques. N'hésitez pas à me suggérer des sujets.</p>
          <router-link to="/contact" class="btn btn--primary">
            Suggérer un tutoriel →
          </router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useScrollReveal } from '@/composables/useScrollReveal';

const { observeAll } = useScrollReveal();

onMounted(() => {
  observeAll('.reveal');
});

// Tutorials data
const tutorials = ref([
  {
    slug: 'symfony-vue-vite',
    icon: '⚡',
    title: 'Intégrer Vue 3 + Vite dans Symfony 7',
    description: 'Tutoriel complet pour créer une application Symfony 7 avec Vue 3 et Vite comme bundler. Configuration, composants, HMR et production.',
    category: 'Full-Stack',
    date: 'Janvier 2026',
    tags: ['Symfony 7', 'Vue 3', 'Vite', 'PHP 8.3'],
    readTime: '15 min',
    level: 'intermediate',
    levelLabel: 'Intermédiaire',
    downloadUrl: 'https://github.com/GaetanLgt/tutorials/blob/main/symfony-vue-vite.md',
    content: `
<h1>Intégrer Vue 3 + Vite dans Symfony 7</h1>
<blockquote><strong>Tutoriel pas à pas</strong> pour créer une application Symfony 7 avec Vue 3 et Vite — l'alternative moderne à Webpack Encore.</blockquote>

<h2>📋 Ce que vous allez apprendre</h2>
<ul>
<li>Créer un projet Symfony 7 avec Twig</li>
<li>Configurer Vite avec <code>vite-plugin-symfony</code></li>
<li>Installer et configurer Vue 3 (Composition API)</li>
<li>Monter des composants Vue dans des templates Twig</li>
<li>Gérer le HMR en développement et le build production</li>
</ul>

<h2>🛠️ Stack utilisée</h2>
<table>
<tr><td><strong>Backend</strong></td><td>Symfony 7.2, PHP 8.3+, Twig</td></tr>
<tr><td><strong>Frontend</strong></td><td>Vue 3.4, Vite 5</td></tr>
<tr><td><strong>Intégration</strong></td><td>pentatrion/vite-bundle, vite-plugin-symfony</td></tr>
</table>

<h2>⚡ Étape 1 : Créer le projet Symfony</h2>
<pre><code class="language-bash"># Créer le projet
symfony new mon-projet --version="7.2.*" --webapp
cd mon-projet

# Installer le bundle Vite
composer require pentatrion/vite-bundle</code></pre>

<h2>⚡ Étape 2 : Configurer Vite + Vue</h2>
<pre><code class="language-bash"># Initialiser npm et installer les dépendances
npm init -y
npm install vite vite-plugin-symfony --save-dev
npm install vue @vitejs/plugin-vue --save-dev</code></pre>

<h3>vite.config.js</h3>
<pre><code class="language-javascript">import { defineConfig } from 'vite';
import symfonyPlugin from 'vite-plugin-symfony';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [
    vue(),
    symfonyPlugin()
  ],
  build: {
    rollupOptions: {
      input: {
        app: './assets/app.js'
      }
    }
  }
});</code></pre>

<h2>⚡ Étape 3 : Créer le point d'entrée</h2>
<h3>assets/app.js</h3>
<pre><code class="language-javascript">import { createApp } from 'vue';
import App from './vue/App.vue';
import './styles/app.css';

// Monte Vue sur l'élément #app
const el = document.getElementById('app');
if (el) {
  createApp(App).mount(el);
}</code></pre>

<h3>assets/vue/App.vue</h3>
<pre><code class="language-vue">&lt;template&gt;
  &lt;div class="app"&gt;
    &lt;h1&gt;{{ message }}&lt;/h1&gt;
    &lt;button @click="count++"&gt;Count: {{ count }}&lt;/button&gt;
  &lt;/div&gt;
&lt;/template&gt;

&lt;script setup&gt;
import { ref } from 'vue';

const message = ref('Hello Symfony + Vue!');
const count = ref(0);
&lt;/script&gt;</code></pre>

<h2>⚡ Étape 4 : Intégrer dans Twig</h2>
<h3>templates/base.html.twig</h3>
<pre><code class="language-twig">&lt;!DOCTYPE html&gt;
&lt;html&gt;
&lt;head&gt;
  {{ vite_entry_link_tags('app') }}
&lt;/head&gt;
&lt;body&gt;
  &lt;div id="app"&gt;&lt;/div&gt;
  {{ vite_entry_script_tags('app') }}
&lt;/body&gt;
&lt;/html&gt;</code></pre>

<h2>⚡ Étape 5 : Lancer le développement</h2>
<pre><code class="language-bash"># Terminal 1 : Symfony
symfony serve

# Terminal 2 : Vite (HMR)
npm run dev</code></pre>

<h2>📦 Build production</h2>
<pre><code class="language-bash">npm run build
# Génère les assets dans public/build/</code></pre>

<h2>🎯 Bonus : Ajouter Vue Router</h2>
<pre><code class="language-bash">npm install vue-router@4</code></pre>

<p><strong>👉 Résultat :</strong> Une application Symfony avec interface Vue 3 réactive, HMR instantané en dev, et build optimisé en production.</p>
`
  },
  {
    slug: 'docker-symfony-dev',
    icon: '🐳',
    title: 'Stack Docker pour Symfony + Vue',
    description: 'Environnement de développement complet avec Docker : PHP-FPM, Nginx, PostgreSQL, Vite, Mailpit.',
    category: 'DevOps',
    date: 'Janvier 2026',
    tags: ['Docker', 'Docker Compose', 'Nginx', 'PostgreSQL'],
    readTime: '20 min',
    level: 'advanced',
    levelLabel: 'Avancé',
    downloadUrl: 'https://github.com/GaetanLgt/tutorials/blob/main/docker-symfony-vue.md',
    content: `
<h1>Stack Docker pour Symfony + Vue</h1>
<blockquote><strong>Environnement de développement</strong> complet et reproductible avec Docker Compose.</blockquote>

<h2>📋 Ce que vous allez apprendre</h2>
<ul>
<li>Configurer PHP-FPM 8.3 avec les extensions Symfony</li>
<li>Nginx comme reverse proxy avec support HMR Vite</li>
<li>PostgreSQL 16 avec healthchecks</li>
<li>Mailpit pour capturer les emails en dev</li>
<li>Xdebug pour le debugging</li>
</ul>

<h2>🏗️ Architecture</h2>
<pre><code>┌─────────────────┐
│     NGINX       │ :8080
│  (Reverse Proxy)│
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
┌───▼───┐ ┌───▼───┐
│PHP-FPM│ │ VITE  │ :5173
│Symfony│ │  HMR  │
└───┬───┘ └───────┘
    │
┌───▼───┐ ┌───────┐
│Postgre│ │Mailpit│ :8025
│  SQL  │ │ SMTP  │
└───────┘ └───────┘</code></pre>

<h2>📁 Structure du projet</h2>
<pre><code>docker/
├── nginx/
│   └── default.conf
├── php/
│   └── Dockerfile
└── vite/
    └── Dockerfile
docker-compose.yml
.env.docker</code></pre>

<h2>🐳 docker-compose.yml</h2>
<pre><code class="language-yaml">services:
  nginx:
    image: nginx:alpine
    ports:
      - "8080:80"
    volumes:
      - ./:/var/www
      - ./docker/nginx/default.conf:/etc/nginx/conf.d/default.conf
    depends_on:
      - php
      - vite

  php:
    build: ./docker/php
    volumes:
      - ./:/var/www
    environment:
      - DATABASE_URL=postgresql://app:secret@database:5432/app
    depends_on:
      database:
        condition: service_healthy

  vite:
    build: ./docker/vite
    ports:
      - "5173:5173"
    volumes:
      - ./:/var/www
    command: npm run dev -- --host

  database:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: app
      POSTGRES_PASSWORD: secret
      POSTGRES_DB: app
    volumes:
      - db_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U app"]
      interval: 5s
      timeout: 5s
      retries: 5

  mailpit:
    image: axllent/mailpit
    ports:
      - "8025:8025"  # Web UI
      - "1025:1025"  # SMTP

volumes:
  db_data:</code></pre>

<h2>⚡ Commandes clés</h2>
<pre><code class="language-bash"># Démarrer la stack
docker compose up -d

# Installer les dépendances
docker compose exec php composer install
docker compose exec vite npm install

# Migrations
docker compose exec php bin/console doctrine:migrations:migrate

# Logs
docker compose logs -f php

# Arrêter
docker compose down</code></pre>

<h2>🔐 Configuration Xdebug</h2>
<pre><code class="language-ini"># docker/php/xdebug.ini
xdebug.mode=debug
xdebug.client_host=host.docker.internal
xdebug.client_port=9003
xdebug.start_with_request=yes</code></pre>

<p><strong>👉 Résultat :</strong> Un environnement de développement complet, isolé et reproductible. Partagez le repo, <code>docker compose up</code>, et c'est parti !</p>
`
  },
  {
    slug: 'n8n-ollama-ia',
    icon: '🔄',
    title: 'Automatiser avec n8n + IA locale',
    description: 'Créer des workflows d\'automatisation puissants avec n8n, Ollama et vos APIs métier. 100% souverain.',
    category: 'Automatisation',
    date: 'Janvier 2026',
    tags: ['n8n', 'Ollama', 'LLM', 'Workflow'],
    readTime: '25 min',
    level: 'intermediate',
    levelLabel: 'Intermédiaire',
    downloadUrl: 'https://github.com/GaetanLgt/tutorials/blob/main/n8n-ollama-ia.md',
    content: `
<h1>Automatiser avec n8n + IA locale</h1>
<blockquote><strong>Workflows d'automatisation</strong> avec IA générative, 100% souverain, zéro cloud US.</blockquote>

<h2>📋 Ce que vous allez apprendre</h2>
<ul>
<li>Installer n8n et Ollama avec Docker</li>
<li>Connecter n8n à Ollama via HTTP Request</li>
<li>Créer des workflows : classification, résumé, génération</li>
<li>Intégrer Discord, emails, APIs métier</li>
<li>Monitoring et bonnes pratiques</li>
</ul>

<h2>🏗️ Architecture</h2>
<pre><code>┌──────────────────┐
│   VOS SERVICES   │
│ Discord │ Email  │
└────────┬─────────┘
         │
    ┌────▼────┐
    │   n8n   │ :5678
    │Orchestr.│
    └────┬────┘
         │
    ┌────▼────┐
    │ OLLAMA  │ :11434
    │Llama 3.2│
    └─────────┘</code></pre>

<h2>🐳 docker-compose.yml</h2>
<pre><code class="language-yaml">services:
  n8n:
    image: n8nio/n8n
    ports:
      - "5678:5678"
    environment:
      - N8N_BASIC_AUTH_ACTIVE=true
      - N8N_BASIC_AUTH_USER=admin
      - N8N_BASIC_AUTH_PASSWORD=secret
    volumes:
      - n8n_data:/home/node/.n8n

  ollama:
    image: ollama/ollama
    ports:
      - "11434:11434"
    volumes:
      - ollama_models:/root/.ollama
    deploy:
      resources:
        reservations:
          devices:
            - capabilities: [gpu]  # Optionnel

volumes:
  n8n_data:
  ollama_models:</code></pre>

<h2>⚡ Commandes de base</h2>
<pre><code class="language-bash"># Démarrer
docker compose up -d

# Télécharger les modèles
docker exec ollama ollama pull llama3.2
docker exec ollama ollama pull mistral

# Accéder à n8n
open http://localhost:5678</code></pre>

<h2>🔄 Workflow 1 : Classification d'emails</h2>
<p>Trigger: Email reçu → Ollama classifie → Redirection automatique</p>
<pre><code class="language-javascript">// Nœud Code : Appel Ollama
const response = await $http.request({
  method: 'POST',
  url: 'http://ollama:11434/api/generate',
  body: {
    model: 'llama3.2',
    prompt: \`Classifie cet email en : URGENT, COMMERCIAL, SUPPORT, SPAM.
    
Email: \${$input.first().json.subject}

Réponds uniquement par la catégorie.\`,
    stream: false
  }
});

return [{ json: { category: response.response.trim() } }];</code></pre>

<h2>🔄 Workflow 2 : Résumé automatique</h2>
<p>Trigger: Webhook → Ollama résume → Notification Discord</p>

<h2>🔄 Workflow 3 : Génération de contenu</h2>
<p>Trigger: Formulaire → Ollama génère → Sauvegarde BDD</p>

<p><strong>👉 Résultat :</strong> Des workflows automatisés avec IA, hébergés chez vous, sans envoyer vos données à OpenAI.</p>
`
  },
  {
    slug: 'obsidian-rag-chromadb',
    icon: '🧠',
    title: 'RAG avec Obsidian + ChromaDB',
    description: 'Exploitez votre vault Obsidian comme base de connaissances pour un chatbot IA avec RAG et ChromaDB.',
    category: 'IA Locale',
    date: 'Janvier 2026',
    tags: ['Obsidian', 'ChromaDB', 'RAG', 'Python'],
    readTime: '30 min',
    level: 'advanced',
    levelLabel: 'Avancé',
    downloadUrl: 'https://github.com/GaetanLgt/tutorials/blob/main/obsidian-rag-chromadb.md',
    content: `
<h1>RAG avec Obsidian + ChromaDB</h1>
<blockquote><strong>Retrieval-Augmented Generation</strong> : faites parler votre base de connaissances Obsidian.</blockquote>

<h2>📋 Ce que vous allez apprendre</h2>
<ul>
<li>Comprendre le concept RAG (Retrieval-Augmented Generation)</li>
<li>Indexer un vault Obsidian dans ChromaDB</li>
<li>Générer des embeddings avec Ollama</li>
<li>Créer une API de chat avec FastAPI</li>
<li>Intégrer avec n8n pour des workflows intelligents</li>
</ul>

<h2>🧩 Qu'est-ce que le RAG ?</h2>
<p>Le RAG permet d'enrichir les réponses d'un LLM avec vos propres données :</p>
<pre><code>Question utilisateur
        │
        ▼
┌────────────┐
│ Embedding  │ → Convertit en vecteur
└────┬───────┘
     │
┌────▼─────┐
│ ChromaDB  │ → Recherche les docs similaires
└────┬──────┘
     │
┌────▼─────┐
│ Contexte  │ → Top 5 documents pertinents
└────┬──────┘
     │
┌────▼─────┐
│  Ollama   │ → Génère une réponse contextualisée
└────┬──────┘
     │
     ▼
Réponse + Sources</code></pre>

<h2>🐳 docker-compose.yml</h2>
<pre><code class="language-yaml">services:
  ollama:
    image: ollama/ollama
    ports:
      - "11434:11434"
    volumes:
      - ollama_models:/root/.ollama

  chromadb:
    image: chromadb/chroma
    ports:
      - "8000:8000"
    volumes:
      - chroma_data:/chroma/chroma

  rag-api:
    build: ./rag-api
    ports:
      - "8080:8080"
    volumes:
      - ./vault:/app/vault:ro  # Votre vault Obsidian
    depends_on:
      - ollama
      - chromadb

volumes:
  ollama_models:
  chroma_data:</code></pre>

<h2>🐍 Script d'indexation (Python)</h2>
<pre><code class="language-python">import chromadb
import requests
from pathlib import Path

# Connexions
chroma = chromadb.HttpClient(host="chromadb", port=8000)
collection = chroma.get_or_create_collection("obsidian")

def get_embedding(text: str) -> list[float]:
    """Génère un embedding via Ollama."""
    response = requests.post(
        "http://ollama:11434/api/embeddings",
        json={"model": "nomic-embed-text", "prompt": text}
    )
    return response.json()["embedding"]

def index_vault(vault_path: str):
    """Indexe tous les fichiers Markdown."""
    for md_file in Path(vault_path).glob("**/*.md"):
        content = md_file.read_text()
        embedding = get_embedding(content)
        
        collection.add(
            ids=[str(md_file)],
            embeddings=[embedding],
            documents=[content],
            metadatas=[{"title": md_file.stem}]
        )
        print(f"Indexé: {md_file.stem}")

if __name__ == "__main__":
    index_vault("/app/vault")</code></pre>

<h2>❓ Exemple de query</h2>
<pre><code class="language-bash">curl -X POST http://localhost:8080/chat \\
  -H "Content-Type: application/json" \\
  -d '{"question": "Quelles sont mes notes sur Docker?"}'

# Réponse :
{
  "answer": "D'après vos notes, Docker permet...",
  "sources": [
    {"title": "Docker Basics", "relevance": 0.92},
    {"title": "DevOps Setup", "relevance": 0.87}
  ]
}</code></pre>

<p><strong>👉 Résultat :</strong> Un chatbot qui répond en se basant sur VOS notes, hébergé localement.</p>
`
  },
  {
    slug: 'matomo-analytics-rgpd',
    icon: '📊',
    title: 'Analytics RGPD avec Matomo',
    description: 'Installez Matomo pour des analytics respectés du RGPD : tracking sans cookies, hébergement France, pas de consentement requis.',
    category: 'Analytics',
    date: 'Janvier 2026',
    tags: ['Matomo', 'RGPD', 'Analytics', 'Privacy'],
    readTime: '15 min',
    level: 'beginner',
    levelLabel: 'Débutant',
    downloadUrl: 'https://github.com/GaetanLgt/tutorials/blob/main/matomo-rgpd.md',
    content: `
<h1>Analytics RGPD avec Matomo</h1>
<blockquote><strong>Alternative à Google Analytics</strong> respectée du RGPD, sans cookies, hébergée en France.</blockquote>

<h2>📋 Pourquoi Matomo ?</h2>
<ul>
<li>✅ <strong>RGPD-compliant</strong> — Pas besoin de bannière de consentement (mode sans cookies)</li>
<li>✅ <strong>Données souveraines</strong> — Hébergé chez vous ou en France</li>
<li>✅ <strong>100% des visiteurs</strong> — Pas de blocage par les ad-blockers</li>
<li>✅ <strong>Gratuit</strong> — Open-source, auto-hébergé</li>
</ul>

<h2>⚡ Option 1 : Matomo Cloud (rapide)</h2>
<ol>
<li>Créez un compte sur <a href="https://matomo.org/start-free-analytics-trial/" target="_blank">matomo.org</a></li>
<li>Choisissez un hébergement <strong>EU</strong></li>
<li>Ajoutez le script de tracking</li>
</ol>

<h2>⚡ Option 2 : Auto-hébergé (recommandé)</h2>
<h3>docker-compose.yml</h3>
<pre><code class="language-yaml">services:
  matomo:
    image: matomo:5
    ports:
      - "8080:80"
    volumes:
      - matomo_data:/var/www/html
    environment:
      - MATOMO_DATABASE_HOST=db
      - MATOMO_DATABASE_USERNAME=matomo
      - MATOMO_DATABASE_PASSWORD=secret
      - MATOMO_DATABASE_DBNAME=matomo
    depends_on:
      - db

  db:
    image: mariadb:10
    environment:
      - MYSQL_ROOT_PASSWORD=root
      - MYSQL_DATABASE=matomo
      - MYSQL_USER=matomo
      - MYSQL_PASSWORD=secret
    volumes:
      - db_data:/var/lib/mysql

volumes:
  matomo_data:
  db_data:</code></pre>

<h2>🔒 Configuration RGPD (sans cookies)</h2>
<p>Dans <strong>Administration > Vie privée > Anonymiser les données</strong> :</p>
<ul>
<li>✅ Anonymiser les 2 derniers octets de l'IP</li>
<li>✅ Remplacer l'ID utilisateur après chaque visite</li>
<li>✅ Activer le mode "sans cookies"</li>
</ul>

<h2>💻 Script de tracking (Vue.js)</h2>
<pre><code class="language-javascript">// composables/useMatomo.js
export function useMatomo() {
  const init = () => {
    window._paq = window._paq || [];
    _paq.push(['disableCookies']);  // ← RGPD : pas de cookies
    _paq.push(['trackPageView']);
    _paq.push(['enableLinkTracking']);
    
    const u = 'https://analytics.gldigitallab.fr/';
    _paq.push(['setTrackerUrl', u + 'matomo.php']);
    _paq.push(['setSiteId', '1']);
    
    const d = document, g = d.createElement('script');
    g.async = true;
    g.src = u + 'matomo.js';
    d.head.appendChild(g);
  };

  const trackEvent = (category, action, name) => {
    window._paq?.push(['trackEvent', category, action, name]);
  };

  return { init, trackEvent };
}</code></pre>

<h2>🎯 Tracking SPA (Vue Router)</h2>
<pre><code class="language-javascript">// main.js
router.afterEach((to) => {
  window._paq?.push(['setCustomUrl', to.fullPath]);
  window._paq?.push(['setDocumentTitle', to.meta.title]);
  window._paq?.push(['trackPageView']);
});</code></pre>

<p><strong>👉 Résultat :</strong> Analytics complets sans bannière RGPD, données 100% chez vous.</p>
`
  },
  {
    slug: 'api-platform-symfony',
    icon: '🚀',
    title: 'Créer une API REST avec API Platform',
    description: 'Construisez une API REST complète en 30 minutes avec Symfony et API Platform : CRUD, filtres, pagination, auth JWT.',
    category: 'Backend',
    date: 'Janvier 2026',
    tags: ['API Platform', 'Symfony', 'REST', 'JWT'],
    readTime: '20 min',
    level: 'intermediate',
    levelLabel: 'Intermédiaire',
    downloadUrl: 'https://github.com/GaetanLgt/tutorials/blob/main/api-platform-symfony.md',
    content: `
<h1>Créer une API REST avec API Platform</h1>
<blockquote><strong>API REST complète</strong> en 30 minutes : CRUD auto-généré, documentation OpenAPI, authentification JWT.</blockquote>

<h2>📋 Ce que vous allez obtenir</h2>
<ul>
<li>✅ CRUD complet auto-généré pour chaque entité</li>
<li>✅ Documentation Swagger/OpenAPI</li>
<li>✅ Filtres, pagination, tri</li>
<li>✅ Validation automatique</li>
<li>✅ Authentification JWT</li>
</ul>

<h2>⚡ Installation</h2>
<pre><code class="language-bash"># Créer le projet
symfony new api-projet --version="7.2.*"
cd api-projet

# Installer API Platform
composer require api</code></pre>

<h2>📝 Créer une entité API</h2>
<pre><code class="language-php">&lt;?php
// src/Entity/Product.php
namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Put;
use ApiPlatform\Metadata\Delete;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity]
#[ApiResource(
    operations: [
        new GetCollection(),
        new Get(),
        new Post(security: "is_granted('ROLE_ADMIN')"),
        new Put(security: "is_granted('ROLE_ADMIN')"),
        new Delete(security: "is_granted('ROLE_ADMIN')")
    ],
    paginationItemsPerPage: 20
)]
class Product
{
    #[ORM\Id, ORM\GeneratedValue, ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Assert\NotBlank]
    #[Assert\Length(min: 3, max: 255)]
    private string $name;

    #[ORM\Column(type: 'decimal', precision: 10, scale: 2)]
    #[Assert\Positive]
    private string $price;

    #[ORM\Column(type: 'text', nullable: true)]
    private ?string $description = null;

    // Getters & Setters...
}</code></pre>

<h2>🔍 Ajouter des filtres</h2>
<pre><code class="language-php">use ApiPlatform\Doctrine\Orm\Filter\SearchFilter;
use ApiPlatform\Doctrine\Orm\Filter\RangeFilter;
use ApiPlatform\Doctrine\Orm\Filter\OrderFilter;

#[ApiResource]
#[ApiFilter(SearchFilter::class, properties: ['name' => 'partial'])]
#[ApiFilter(RangeFilter::class, properties: ['price'])]
#[ApiFilter(OrderFilter::class, properties: ['name', 'price'])]
class Product { ... }</code></pre>

<h3>Requêtes possibles :</h3>
<pre><code class="language-bash"># Recherche
GET /api/products?name=iphone

# Filtre prix
GET /api/products?price[gte]=100&price[lte]=500

# Tri
GET /api/products?order[price]=desc

# Pagination
GET /api/products?page=2</code></pre>

<h2>🔐 Authentification JWT</h2>
<pre><code class="language-bash"># Installer JWT
composer require lexik/jwt-authentication-bundle

# Générer les clés
php bin/console lexik:jwt:generate-keypair</code></pre>

<h3>Login endpoint :</h3>
<pre><code class="language-bash">POST /api/login_check
{"username": "admin@test.com", "password": "secret"}

# Réponse :
{"token": "eyJ0eXAiOiJKV1QiLCJhbGciOi..."}</code></pre>

<h2>📚 Documentation auto</h2>
<p>Accédez à <code>/api</code> pour voir la documentation Swagger interactive.</p>

<p><strong>👉 Résultat :</strong> Une API REST complète, documentée, sécurisée, en moins d'une heure.</p>
`
  },
  {
    slug: 'tailwind-vue-components',
    icon: '🎨',
    title: 'Composants Vue 3 + Tailwind CSS',
    description: 'Créez une librairie de composants réutilisables avec Vue 3 et Tailwind : boutons, cards, modals, formulaires.',
    category: 'Frontend',
    date: 'Janvier 2026',
    tags: ['Vue 3', 'Tailwind CSS', 'Composants', 'UI'],
    readTime: '20 min',
    level: 'beginner',
    levelLabel: 'Débutant',
    downloadUrl: 'https://github.com/GaetanLgt/tutorials/blob/main/tailwind-vue-components.md',
    content: `
<h1>Composants Vue 3 + Tailwind CSS</h1>
<blockquote><strong>Librairie de composants</strong> réutilisables, accessibles et personnalisables.</blockquote>

<h2>📋 Ce que vous allez créer</h2>
<ul>
<li>🔘 Boutons (variants, sizes, loading)</li>
<li>📝 Inputs (text, select, textarea)</li>
<li>🏷️ Cards (header, body, footer)</li>
<li>💬 Modals (avec Teleport)</li>
<li>🚨 Alerts (success, warning, error)</li>
</ul>

<h2>⚡ Setup</h2>
<pre><code class="language-bash">npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p</code></pre>

<h2>🔘 Composant Button</h2>
<pre><code class="language-vue">&lt;!-- components/ui/BaseButton.vue --&gt;
&lt;template&gt;
  &lt;button
    :class="[
      'inline-flex items-center justify-center gap-2',
      'font-medium rounded-lg transition-all duration-200',
      'focus:outline-none focus:ring-2 focus:ring-offset-2',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      sizeClasses,
      variantClasses
    ]"
    :disabled="disabled || loading"
  &gt;
    &lt;svg v-if="loading" class="animate-spin h-4 w-4" viewBox="0 0 24 24"&gt;
      &lt;circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"/&gt;
      &lt;path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/&gt;
    &lt;/svg&gt;
    &lt;slot /&gt;
  &lt;/button&gt;
&lt;/template&gt;

&lt;script setup&gt;
import { computed } from 'vue';

const props = defineProps({
  variant: { type: String, default: 'primary' },
  size: { type: String, default: 'md' },
  loading: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false }
});

const sizeClasses = computed(() => ({
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg'
})[props.size]);

const variantClasses = computed(() => ({
  primary: 'bg-emerald-500 text-white hover:bg-emerald-600 focus:ring-emerald-500',
  secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500',
  danger: 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500',
  ghost: 'bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-500'
})[props.variant]);
&lt;/script&gt;</code></pre>

<h3>Usage :</h3>
<pre><code class="language-vue">&lt;BaseButton variant="primary" size="lg"&gt;Envoyer&lt;/BaseButton&gt;
&lt;BaseButton variant="danger" :loading="isSubmitting"&gt;Supprimer&lt;/BaseButton&gt;
&lt;BaseButton variant="ghost" size="sm"&gt;Annuler&lt;/BaseButton&gt;</code></pre>

<h2>💬 Composant Modal</h2>
<pre><code class="language-vue">&lt;!-- components/ui/BaseModal.vue --&gt;
&lt;template&gt;
  &lt;Teleport to="body"&gt;
    &lt;Transition name="modal"&gt;
      &lt;div v-if="modelValue" class="fixed inset-0 z-50 flex items-center justify-center"&gt;
        &lt;!-- Backdrop --&gt;
        &lt;div 
          class="absolute inset-0 bg-black/50 backdrop-blur-sm"
          @click="$emit('update:modelValue', false)"
        /&gt;
        
        &lt;!-- Content --&gt;
        &lt;div class="relative bg-white rounded-xl shadow-xl max-w-lg w-full mx-4 p-6"&gt;
          &lt;button 
            @click="$emit('update:modelValue', false)"
            class="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          &gt;
            ✕
          &lt;/button&gt;
          &lt;slot /&gt;
        &lt;/div&gt;
      &lt;/div&gt;
    &lt;/Transition&gt;
  &lt;/Teleport&gt;
&lt;/template&gt;

&lt;script setup&gt;
defineProps({ modelValue: Boolean });
defineEmits(['update:modelValue']);
&lt;/script&gt;</code></pre>

<h3>Usage :</h3>
<pre><code class="language-vue">&lt;BaseModal v-model="showModal"&gt;
  &lt;h2&gt;Titre&lt;/h2&gt;
  &lt;p&gt;Contenu du modal...&lt;/p&gt;
&lt;/BaseModal&gt;</code></pre>

<p><strong>👉 Résultat :</strong> Une librairie de composants cohérente, accessible et facile à maintenir.</p>
`
  },
  {
    slug: 'discord-bot-nodejs',
    icon: '🤖',
    title: 'Bot Discord avec Node.js',
    description: 'Créez un bot Discord complet : commandes slash, réactions, webhooks, intégration avec vos APIs.',
    category: 'Automatisation',
    date: 'Janvier 2026',
    tags: ['Discord.js', 'Node.js', 'Bot', 'API'],
    readTime: '25 min',
    level: 'intermediate',
    levelLabel: 'Intermédiaire',
    downloadUrl: 'https://github.com/GaetanLgt/tutorials/blob/main/discord-bot-nodejs.md',
    content: `
<h1>Bot Discord avec Node.js</h1>
<blockquote><strong>Bot Discord complet</strong> : commandes slash, réactions automatiques, intégration APIs.</blockquote>

<h2>📋 Ce que vous allez créer</h2>
<ul>
<li>✅ Commandes slash (/ping, /info, /help)</li>
<li>✅ Réactions automatiques aux messages</li>
<li>✅ Système de tickets</li>
<li>✅ Intégration webhook avec votre app</li>
</ul>

<h2>⚡ Setup</h2>
<pre><code class="language-bash">mkdir mon-bot && cd mon-bot
npm init -y
npm install discord.js dotenv</code></pre>

<h2>🔑 Configuration</h2>
<pre><code class="language-env"># .env
DISCORD_TOKEN=votre_token_ici
CLIENT_ID=votre_client_id
GUILD_ID=votre_serveur_id</code></pre>

<h2>🤖 Code du bot</h2>
<pre><code class="language-javascript">// index.js
require('dotenv').config();
const { Client, GatewayIntentBits, SlashCommandBuilder, REST, Routes } = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

// Enregistrer les commandes slash
const commands = [
  new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Vérifie la latence du bot'),
  new SlashCommandBuilder()
    .setName('info')
    .setDescription('Infos sur le serveur'),
].map(cmd => cmd.toJSON());

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

// Déployer les commandes
(async () => {
  await rest.put(
    Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
    { body: commands }
  );
  console.log('✅ Commandes enregistrées');
})();

// Événements
client.once('ready', () => {
  console.log(\`🚀 Bot connecté : \${client.user.tag}\`);
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'ping') {
    const latency = Date.now() - interaction.createdTimestamp;
    await interaction.reply(\`🏓 Pong! Latence: \${latency}ms\`);
  }

  if (interaction.commandName === 'info') {
    const guild = interaction.guild;
    await interaction.reply({
      embeds: [{
        title: guild.name,
        fields: [
          { name: 'Membres', value: \`\${guild.memberCount}\`, inline: true },
          { name: 'Créé le', value: guild.createdAt.toLocaleDateString(), inline: true }
        ],
        color: 0x10B981
      }]
    });
  }
});

// Réaction auto aux messages
client.on('messageCreate', (message) => {
  if (message.author.bot) return;
  
  if (message.content.toLowerCase().includes('merci')) {
    message.react('❤️');
  }
});

client.login(process.env.DISCORD_TOKEN);</code></pre>

<h2>🚀 Lancer le bot</h2>
<pre><code class="language-bash">node index.js
# ou avec nodemon pour le dev
npx nodemon index.js</code></pre>

<h2>🔗 Webhook : envoyer depuis votre app</h2>
<pre><code class="language-javascript">// Depuis votre API Symfony/Node
const webhookUrl = 'https://discord.com/api/webhooks/xxx/yyy';

await fetch(webhookUrl, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    content: '🚨 Nouvelle commande reçue !',
    embeds: [{
      title: 'Commande #1234',
      fields: [
        { name: 'Client', value: 'Jean Dupont' },
        { name: 'Total', value: '150€' }
      ],
      color: 0x10B981
    }]
  })
});</code></pre>

<p><strong>👉 Résultat :</strong> Un bot Discord qui automatise votre communauté et s'intègre à vos outils.</p>
`
  }
]);

// Modal state
const activeTutorial = ref(null);

const openTutorial = (tutorial) => {
  if (tutorial.comingSoon) return;
  activeTutorial.value = tutorial;
  document.body.style.overflow = 'hidden';
};

const closeTutorial = () => {
  activeTutorial.value = null;
  document.body.style.overflow = '';
};
</script>

<style scoped>
.tuto-page {
  min-height: 100vh;
  position: relative;
}

/* Ambient */
.tuto-ambient {
  position: fixed;
  inset: 0;
  z-index: -1;
  pointer-events: none;
}

.tuto-ambient__grid {
  position: absolute;
  inset: 0;
  background-image: 
    linear-gradient(rgba(16, 185, 129, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(16, 185, 129, 0.03) 1px, transparent 1px);
  background-size: 50px 50px;
}

/* Hero */
.tuto-hero {
  padding: 120px 0 60px;
}

.tuto-hero__breadcrumb {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.75rem;
  color: var(--text-dark);
  margin-bottom: var(--space-md);
}

.tuto-hero__breadcrumb a {
  color: var(--primary);
  text-decoration: none;
}

.tuto-hero__breadcrumb a:hover {
  text-decoration: underline;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.3);
  border-radius: 2rem;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.6rem;
  color: var(--primary);
  letter-spacing: 0.15em;
  margin-bottom: var(--space-md);
}

.status-badge__dot {
  width: 8px;
  height: 8px;
  background: var(--primary);
  border-radius: 50%;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.tuto-hero__title {
  font-size: clamp(2.5rem, 6vw, 4rem);
  font-weight: 900;
  line-height: 1.1;
  margin-bottom: var(--space-sm);
}

.tuto-hero__title-sub {
  display: block;
  font-size: 0.4em;
  font-weight: 400;
  color: var(--text-muted);
  margin-top: 0.5rem;
}

.tuto-hero__desc {
  font-size: 1.1rem;
  color: var(--text-muted);
  max-width: 600px;
  line-height: 1.7;
}

.tuto-hero__desc strong {
  color: var(--text-main);
}

/* Section */
.tuto-section {
  padding: var(--space-lg) 0;
}

/* Grid */
.tuto-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: var(--space-md);
}

/* Tutorial Card */
.tuto-card {
  padding: var(--space-md);
  border-radius: 1rem;
  border: 1px solid var(--border);
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.tuto-card--clickable {
  cursor: pointer;
}

.tuto-card--clickable:hover {
  border-color: var(--primary);
  transform: translateY(-5px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
}

.tuto-card__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: var(--space-sm);
}

.tuto-card__icon {
  font-size: 2rem;
}

.tuto-card__meta {
  text-align: right;
}

.tuto-card__category {
  display: block;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.65rem;
  color: var(--primary);
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.tuto-card__date {
  font-size: 0.75rem;
  color: var(--text-dark);
}

.tuto-card__title {
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  line-height: 1.3;
}

.tuto-card__desc {
  font-size: 0.9rem;
  color: var(--text-muted);
  line-height: 1.6;
  margin-bottom: var(--space-sm);
}

.tuto-card__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: var(--space-sm);
}

.tuto-tag {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.65rem;
  padding: 0.25rem 0.5rem;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 4px;
  color: var(--text-muted);
}

.tuto-card__footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: var(--space-sm);
  border-top: 1px solid var(--border);
}

.tuto-card__time {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8rem;
  color: var(--text-dark);
}

.tuto-card__level {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.65rem;
  padding: 0.25rem 0.75rem;
  border-radius: 2rem;
}

.tuto-card__level--beginner {
  background: rgba(34, 197, 94, 0.1);
  color: #22C55E;
}

.tuto-card__level--intermediate {
  background: rgba(245, 158, 11, 0.1);
  color: #F59E0B;
}

.tuto-card__level--advanced {
  background: rgba(239, 68, 68, 0.1);
  color: #EF4444;
}

/* Modal */
.tuto-modal {
  position: fixed;
  inset: 0;
  z-index: 10000;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 2rem;
  overflow-y: auto;
}

.tuto-modal__container {
  width: 100%;
  max-width: 900px;
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 1rem;
  margin-top: 2rem;
  margin-bottom: 2rem;
}

.tuto-modal__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-md);
  border-bottom: 1px solid var(--border);
  position: sticky;
  top: 0;
  background: var(--bg);
  z-index: 10;
  border-radius: 1rem 1rem 0 0;
}

.tuto-modal__header-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.tuto-modal__icon {
  font-size: 2rem;
}

.tuto-modal__header h2 {
  font-size: 1.25rem;
  margin: 0;
}

.tuto-modal__meta {
  font-size: 0.8rem;
  color: var(--text-dark);
}

.tuto-modal__close {
  background: transparent;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 0.5rem;
  transition: all 0.2s;
}

.tuto-modal__close:hover {
  background: var(--surface);
  color: var(--text-main);
}

.tuto-modal__content {
  padding: var(--space-lg);
  line-height: 1.8;
}

.tuto-modal__content :deep(h1) {
  font-size: 1.75rem;
  margin-bottom: 1rem;
  color: var(--primary);
}

.tuto-modal__content :deep(h2) {
  font-size: 1.25rem;
  margin-top: 2rem;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--border);
}

.tuto-modal__content :deep(h3) {
  font-size: 1rem;
  margin-top: 1.5rem;
  margin-bottom: 0.75rem;
  color: var(--primary);
}

.tuto-modal__content :deep(p) {
  margin-bottom: 1rem;
}

.tuto-modal__content :deep(pre) {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 0.5rem;
  padding: 1rem;
  overflow-x: auto;
  margin-bottom: 1rem;
}

.tuto-modal__content :deep(code) {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.85rem;
}

.tuto-modal__content :deep(pre code) {
  color: var(--primary);
}

.tuto-modal__content :deep(blockquote) {
  border-left: 3px solid var(--primary);
  padding-left: 1rem;
  margin: 1rem 0;
  color: var(--text-muted);
  font-style: italic;
}

.tuto-modal__content :deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 1rem;
}

.tuto-modal__content :deep(th),
.tuto-modal__content :deep(td) {
  padding: 0.75rem;
  border: 1px solid var(--border);
  text-align: left;
}

.tuto-modal__content :deep(th) {
  background: var(--surface);
  font-weight: 600;
}

.tuto-modal__content :deep(ul),
.tuto-modal__content :deep(ol) {
  margin-bottom: 1rem;
  padding-left: 1.5rem;
}

.tuto-modal__content :deep(li) {
  margin-bottom: 0.5rem;
}

.tuto-modal__footer {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding: var(--space-md);
  border-top: 1px solid var(--border);
  position: sticky;
  bottom: 0;
  background: var(--bg);
  border-radius: 0 0 1rem 1rem;
}

/* Modal transition */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .tuto-modal__container,
.modal-leave-active .tuto-modal__container {
  transition: transform 0.3s ease;
}

.modal-enter-from .tuto-modal__container,
.modal-leave-to .tuto-modal__container {
  transform: translateY(20px);
}

/* CTA */
.tuto-cta {
  text-align: center;
  padding: var(--space-xl);
  border-radius: 1rem;
  border: 1px solid var(--border);
}

.tuto-cta h3 {
  font-size: 1.5rem;
  margin-bottom: var(--space-sm);
}

.tuto-cta p {
  color: var(--text-muted);
  margin-bottom: var(--space-md);
}

/* Buttons */
.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 1.75rem;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.8rem;
  font-weight: 600;
  text-decoration: none;
  border-radius: 0.5rem;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn--primary {
  background: var(--primary);
  color: var(--bg);
}

.btn--primary:hover {
  background: #059669;
  box-shadow: 0 0 30px rgba(16, 185, 129, 0.4);
}

.btn--secondary {
  background: transparent;
  color: var(--text-main);
  border: 1px solid var(--border);
}

.btn--secondary:hover {
  border-color: var(--primary);
  color: var(--primary);
}

/* Reveal */
.reveal {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), 
              transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

.reveal.revealed {
  opacity: 1;
  transform: translateY(0);
}

/* Responsive */
@media (max-width: 768px) {
  .tuto-grid {
    grid-template-columns: 1fr;
  }
  
  .tuto-modal {
    padding: 1rem;
  }
  
  .tuto-modal__container {
    margin-top: 1rem;
  }
  
  .tuto-modal__content {
    padding: var(--space-md);
  }
  
  .tuto-modal__footer {
    flex-direction: column;
  }
}

@media (prefers-reduced-motion: reduce) {
  .reveal {
    opacity: 1;
    transform: none;
    transition: none;
  }
  
  .status-badge__dot {
    animation: none;
  }
}
</style>
