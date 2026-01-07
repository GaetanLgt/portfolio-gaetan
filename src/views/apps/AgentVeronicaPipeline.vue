<template>
  <div class="agent-app">
    <header class="app-header">
      <div class="container">
        <router-link to="/apps" class="back-link">← Retour aux Apps</router-link>
        <span class="agent-badge" style="--agent-color: #8B5CF6">🚀 VERONICA</span>
      </div>
    </header>
    <main class="app-main">
      <div class="container">
        <div class="app-intro">
          <h1><span class="app-icon">🚀</span> CI/CD Pipeline Builder</h1>
          <p>Générez des configurations CI/CD pour GitHub Actions, GitLab CI...</p>
        </div>

        <!-- PLATFORM SELECT -->
        <div class="platform-section">
          <h3>🔧 Plateforme CI/CD</h3>
          <div class="platform-grid">
            <button v-for="p in platforms" :key="p.id" :class="['platform-btn', { active: platform === p.id }]" @click="platform = p.id">
              <span class="platform-icon">{{ p.icon }}</span>
              <span class="platform-name">{{ p.name }}</span>
            </button>
          </div>
        </div>

        <!-- PROJECT CONFIG -->
        <div class="config-section">
          <h3>⚙️ Configuration projet</h3>
          <div class="config-grid">
            <div class="config-group">
              <label>Type de projet</label>
              <select v-model="projectType">
                <option value="node">Node.js / Vue / React</option>
                <option value="php">PHP / Symfony / Laravel</option>
                <option value="python">Python / Django / FastAPI</option>
                <option value="docker">Docker Compose</option>
              </select>
            </div>
            <div class="config-group">
              <label>Environnement cible</label>
              <select v-model="targetEnv">
                <option value="vps">VPS (SSH)</option>
                <option value="docker">Docker Registry</option>
                <option value="vercel">Vercel</option>
                <option value="netlify">Netlify</option>
              </select>
            </div>
          </div>

          <!-- FEATURES -->
          <div class="features-section">
            <h4>Étapes du pipeline</h4>
            <div class="features-grid">
              <label v-for="f in features" :key="f.id" class="feature-check">
                <input type="checkbox" v-model="selectedFeatures" :value="f.id">
                <span class="feature-icon">{{ f.icon }}</span>
                <span class="feature-name">{{ f.name }}</span>
              </label>
            </div>
          </div>

          <button @click="generatePipeline" class="generate-btn">
            ⚡ Générer le pipeline
          </button>
        </div>

        <!-- OUTPUT -->
        <div v-if="generatedConfig" class="output-section">
          <div class="output-header">
            <h3>📄 {{ getFileName() }}</h3>
            <div class="output-actions">
              <button @click="copyConfig" :class="{ copied }">{{ copied ? '✓ Copié' : '📋 Copier' }}</button>
              <button @click="downloadConfig">💾 Télécharger</button>
            </div>
          </div>
          
          <div class="code-preview">
            <pre><code>{{ generatedConfig }}</code></pre>
          </div>

          <!-- Pipeline Visual -->
          <div class="pipeline-visual">
            <h4>🔄 Visualisation du pipeline</h4>
            <div class="pipeline-flow">
              <div v-for="(stage, i) in pipelineStages" :key="stage.name" class="pipeline-stage">
                <div class="stage-node" :style="{ '--stage-color': stage.color }">
                  <span class="stage-icon">{{ stage.icon }}</span>
                  <span class="stage-name">{{ stage.name }}</span>
                </div>
                <div v-if="i < pipelineStages.length - 1" class="stage-arrow">→</div>
              </div>
            </div>
          </div>
        </div>

        <!-- TEMPLATES -->
        <div class="templates-section">
          <h3>📦 Templates prêts à l'emploi</h3>
          <div class="templates-grid">
            <button @click="loadTemplate('vue-vps')">💚 Vue.js → VPS</button>
            <button @click="loadTemplate('symfony-docker')">🎵 Symfony → Docker</button>
            <button @click="loadTemplate('node-vercel')">⚡ Node → Vercel</button>
            <button @click="loadTemplate('fullstack')">🔥 Full Stack</button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const platform = ref('github');
const projectType = ref('node');
const targetEnv = ref('vps');
const selectedFeatures = ref(['lint', 'test', 'build', 'deploy']);
const generatedConfig = ref('');
const copied = ref(false);

const platforms = [
  { id: 'github', icon: '⚡', name: 'GitHub Actions' },
  { id: 'gitlab', icon: '🦊', name: 'GitLab CI' },
  { id: 'bitbucket', icon: '🪣', name: 'Bitbucket' }
];

const features = [
  { id: 'lint', icon: '🔍', name: 'Lint / Format' },
  { id: 'test', icon: '🧪', name: 'Tests' },
  { id: 'security', icon: '🛡️', name: 'Security Scan' },
  { id: 'build', icon: '📦', name: 'Build' },
  { id: 'docker', icon: '🐳', name: 'Docker Build' },
  { id: 'deploy', icon: '🚀', name: 'Deploy' },
  { id: 'notify', icon: '📢', name: 'Notifications' }
];

const pipelineStages = computed(() => {
  const stages = [];
  if (selectedFeatures.value.includes('lint')) stages.push({ name: 'Lint', icon: '🔍', color: '#3B82F6' });
  if (selectedFeatures.value.includes('test')) stages.push({ name: 'Test', icon: '🧪', color: '#A855F7' });
  if (selectedFeatures.value.includes('security')) stages.push({ name: 'Security', icon: '🛡️', color: '#EF4444' });
  if (selectedFeatures.value.includes('build')) stages.push({ name: 'Build', icon: '📦', color: '#F59E0B' });
  if (selectedFeatures.value.includes('docker')) stages.push({ name: 'Docker', icon: '🐳', color: '#0EA5E9' });
  if (selectedFeatures.value.includes('deploy')) stages.push({ name: 'Deploy', icon: '🚀', color: '#10B981' });
  if (selectedFeatures.value.includes('notify')) stages.push({ name: 'Notify', icon: '📢', color: '#EC4899' });
  return stages;
});

function getFileName() {
  if (platform.value === 'github') return '.github/workflows/ci.yml';
  if (platform.value === 'gitlab') return '.gitlab-ci.yml';
  return 'bitbucket-pipelines.yml';
}

function generatePipeline() {
  if (platform.value === 'github') {
    generatedConfig.value = generateGitHubActions();
  } else if (platform.value === 'gitlab') {
    generatedConfig.value = generateGitLabCI();
  } else {
    generatedConfig.value = generateBitbucket();
  }
}

function generateGitHubActions() {
  const isNode = projectType.value === 'node';
  const isPhp = projectType.value === 'php';
  
  let yml = `name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:`;

  if (selectedFeatures.value.includes('lint') || selectedFeatures.value.includes('test')) {
    yml += `
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      ${isNode ? `
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci` : ''}
      ${isPhp ? `
      - name: Setup PHP
        uses: shivammathur/setup-php@v2
        with:
          php-version: '8.3'
          tools: composer:v2
      
      - name: Install dependencies
        run: composer install --no-progress` : ''}
      ${selectedFeatures.value.includes('lint') ? `
      - name: Lint
        run: ${isNode ? 'npm run lint' : isPhp ? 'vendor/bin/phpstan analyse' : 'echo "Lint OK"'}` : ''}
      ${selectedFeatures.value.includes('test') ? `
      - name: Run tests
        run: ${isNode ? 'npm test' : isPhp ? 'vendor/bin/phpunit' : 'pytest'}` : ''}`;
  }

  if (selectedFeatures.value.includes('security')) {
    yml += `

  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      ${isNode ? `
      - name: npm audit
        run: npm audit --audit-level=high` : ''}
      ${isPhp ? `
      - name: Security check
        run: composer audit` : ''}`;
  }

  if (selectedFeatures.value.includes('build')) {
    yml += `

  build:
    runs-on: ubuntu-latest
    needs: [quality]
    steps:
      - uses: actions/checkout@v4
      ${isNode ? `
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install & Build
        run: |
          npm ci
          npm run build
      
      - name: Upload artifact
        uses: actions/upload-artifact@v4
        with:
          name: dist
          path: dist/` : ''}`;
  }

  if (selectedFeatures.value.includes('deploy')) {
    yml += `

  deploy:
    runs-on: ubuntu-latest
    needs: [build]
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4
      
      - name: Download artifact
        uses: actions/download-artifact@v4
        with:
          name: dist
          path: dist/
      ${targetEnv.value === 'vps' ? `
      - name: Deploy to VPS
        uses: appleboy/scp-action@master
        with:
          host: \${{ secrets.HOST }}
          username: \${{ secrets.USERNAME }}
          key: \${{ secrets.SSH_KEY }}
          source: "dist/*"
          target: "/var/www/app"` : ''}
      ${targetEnv.value === 'vercel' ? `
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: \${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: \${{ secrets.ORG_ID }}
          vercel-project-id: \${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'` : ''}`;
  }

  return yml;
}

function generateGitLabCI() {
  return `stages:
  - quality
  - build
  - deploy

variables:
  NODE_VERSION: "20"

cache:
  paths:
    - node_modules/

lint:
  stage: quality
  image: node:\${NODE_VERSION}
  script:
    - npm ci
    - npm run lint

test:
  stage: quality
  image: node:\${NODE_VERSION}
  script:
    - npm ci
    - npm test
  coverage: '/Coverage: \\d+\\.\\d+%/'

build:
  stage: build
  image: node:\${NODE_VERSION}
  script:
    - npm ci
    - npm run build
  artifacts:
    paths:
      - dist/
    expire_in: 1 day

deploy:
  stage: deploy
  image: alpine:latest
  only:
    - main
  script:
    - apk add --no-cache rsync openssh-client
    - rsync -avz dist/ user@server:/var/www/app/
`;
}

function generateBitbucket() {
  return `image: node:20

pipelines:
  default:
    - step:
        name: Install & Test
        caches:
          - node
        script:
          - npm ci
          - npm run lint
          - npm test

  branches:
    main:
      - step:
          name: Build
          script:
            - npm ci
            - npm run build
          artifacts:
            - dist/**
      - step:
          name: Deploy
          deployment: production
          script:
            - pipe: atlassian/rsync-deploy:0.7.0
              variables:
                USER: 'deploy'
                SERVER: 'your-server.com'
                REMOTE_PATH: '/var/www/app'
                LOCAL_PATH: 'dist/'
`;
}

async function copyConfig() {
  await navigator.clipboard.writeText(generatedConfig.value);
  copied.value = true;
  setTimeout(() => copied.value = false, 2000);
}

function downloadConfig() {
  const blob = new Blob([generatedConfig.value], { type: 'text/yaml' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = getFileName().split('/').pop();
  a.click();
}

function loadTemplate(tpl) {
  if (tpl === 'vue-vps') {
    platform.value = 'github';
    projectType.value = 'node';
    targetEnv.value = 'vps';
    selectedFeatures.value = ['lint', 'test', 'build', 'deploy'];
  } else if (tpl === 'symfony-docker') {
    platform.value = 'gitlab';
    projectType.value = 'php';
    targetEnv.value = 'docker';
    selectedFeatures.value = ['lint', 'test', 'security', 'docker', 'deploy'];
  } else if (tpl === 'node-vercel') {
    platform.value = 'github';
    projectType.value = 'node';
    targetEnv.value = 'vercel';
    selectedFeatures.value = ['lint', 'test', 'build', 'deploy'];
  } else if (tpl === 'fullstack') {
    platform.value = 'github';
    projectType.value = 'node';
    targetEnv.value = 'vps';
    selectedFeatures.value = ['lint', 'test', 'security', 'build', 'docker', 'deploy', 'notify'];
  }
  generatePipeline();
}
</script>

<style scoped>
.agent-app { min-height: 100vh; background: var(--bg-primary); }
.app-header { padding: 1rem 0; border-bottom: 1px solid var(--border); }
.app-header .container { display: flex; justify-content: space-between; align-items: center; }
.back-link { color: var(--text-muted); text-decoration: none; }
.agent-badge { padding: 0.35rem 0.75rem; background: rgba(139,92,246,0.1); border: 1px solid var(--agent-color); border-radius: 2rem; font-size: 0.8rem; color: var(--agent-color); }
.app-main { padding: var(--space-lg) 0; }
.app-intro { text-align: center; margin-bottom: 2rem; }
.app-intro h1 { display: flex; justify-content: center; gap: 0.5rem; font-size: 1.75rem; }
.app-icon { font-size: 2rem; }

h3 { font-size: 1rem; margin-bottom: 1rem; }
h4 { font-size: 0.9rem; margin-bottom: 0.75rem; color: var(--text-muted); }

.platform-section, .config-section, .output-section, .templates-section { margin-bottom: 2rem; }

.platform-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.75rem; }
.platform-btn { display: flex; flex-direction: column; align-items: center; padding: 1rem; background: rgba(255,255,255,0.02); border: 1px solid var(--border); border-radius: 0.5rem; cursor: pointer; }
.platform-btn:hover { border-color: #8B5CF6; }
.platform-btn.active { background: rgba(139,92,246,0.1); border-color: #8B5CF6; }
.platform-icon { font-size: 2rem; margin-bottom: 0.5rem; }
.platform-name { font-size: 0.85rem; color: var(--text-muted); }

.config-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem; }
.config-group label { display: block; font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.35rem; }
.config-group select { width: 100%; padding: 0.6rem; background: rgba(0,0,0,0.3); border: 1px solid var(--border); border-radius: 0.35rem; color: var(--text-main); }

.features-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 0.5rem; margin-bottom: 1.5rem; }
.feature-check { display: flex; align-items: center; gap: 0.5rem; padding: 0.6rem; background: rgba(255,255,255,0.02); border: 1px solid var(--border); border-radius: 0.35rem; cursor: pointer; }
.feature-check:has(input:checked) { background: rgba(139,92,246,0.1); border-color: #8B5CF6; }
.feature-check input { accent-color: #8B5CF6; }
.feature-icon { font-size: 1rem; }
.feature-name { font-size: 0.8rem; color: var(--text-muted); }

.generate-btn { width: 100%; padding: 1rem; background: linear-gradient(135deg, #8B5CF6, #7C3AED); border: none; border-radius: 0.5rem; font-weight: 600; font-size: 1rem; color: white; cursor: pointer; }

.output-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
.output-actions { display: flex; gap: 0.5rem; }
.output-actions button { padding: 0.5rem 1rem; background: rgba(255,255,255,0.05); border: 1px solid var(--border); border-radius: 0.35rem; cursor: pointer; color: var(--text-muted); font-size: 0.85rem; }
.output-actions button:hover { border-color: var(--primary); color: var(--primary); }
.output-actions button.copied { background: var(--primary); border-color: var(--primary); color: var(--bg-primary); }

.code-preview { padding: 1rem; background: rgba(0,0,0,0.4); border: 1px solid var(--border); border-radius: 0.5rem; overflow-x: auto; margin-bottom: 1.5rem; }
.code-preview pre { margin: 0; }
.code-preview code { font-family: 'JetBrains Mono', monospace; font-size: 0.8rem; color: var(--text-secondary); white-space: pre; }

.pipeline-visual { padding: 1rem; background: rgba(255,255,255,0.02); border: 1px solid var(--border); border-radius: 0.5rem; }
.pipeline-flow { display: flex; align-items: center; flex-wrap: wrap; gap: 0.5rem; padding: 1rem 0; overflow-x: auto; }
.pipeline-stage { display: flex; align-items: center; gap: 0.5rem; }
.stage-node { display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 1rem; background: rgba(255,255,255,0.05); border: 2px solid var(--stage-color); border-radius: 2rem; }
.stage-icon { font-size: 1rem; }
.stage-name { font-size: 0.8rem; font-weight: 600; }
.stage-arrow { color: var(--text-muted); font-size: 1.25rem; }

.templates-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 0.75rem; }
.templates-grid button { padding: 0.75rem; background: rgba(255,255,255,0.02); border: 1px solid var(--border); border-radius: 0.5rem; color: var(--text-muted); cursor: pointer; font-size: 0.85rem; }
.templates-grid button:hover { border-color: var(--primary); color: var(--primary); }

@media (max-width: 768px) { .config-grid, .platform-grid { grid-template-columns: 1fr; } }
</style>
