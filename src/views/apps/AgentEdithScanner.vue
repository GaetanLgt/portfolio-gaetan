<template>
  <div class="agent-app">
    <header class="app-header">
      <div class="container">
        <router-link to="/apps" class="back-link">← Retour aux Apps</router-link>
        <span class="agent-badge" style="--agent-color: #EF4444">🛡️ EDITH</span>
      </div>
    </header>
    <main class="app-main">
      <div class="container">
        <div class="app-intro">
          <h1><span class="app-icon">🛡️</span> Security Scanner</h1>
          <p>Analysez la sécurité de vos projets et dépendances</p>
        </div>

        <!-- SCAN OPTIONS -->
        <div class="scan-section">
          <h3>🔍 Type de scan</h3>
          <div class="scan-options">
            <button v-for="opt in scanTypes" :key="opt.id" :class="['scan-option', { active: scanType === opt.id }]" @click="scanType = opt.id">
              <span class="opt-icon">{{ opt.icon }}</span>
              <span class="opt-name">{{ opt.name }}</span>
              <span class="opt-desc">{{ opt.desc }}</span>
            </button>
          </div>
        </div>

        <!-- INPUT -->
        <div class="input-section">
          <div v-if="scanType === 'npm'" class="input-group">
            <label>📦 Collez votre package.json</label>
            <textarea v-model="packageJson" placeholder='{"dependencies": {"express": "^4.18.0"}}' class="code-input"></textarea>
          </div>
          <div v-if="scanType === 'composer'" class="input-group">
            <label>🎼 Collez votre composer.json</label>
            <textarea v-model="composerJson" placeholder='{"require": {"symfony/framework": "^6.0"}}' class="code-input"></textarea>
          </div>
          <div v-if="scanType === 'docker'" class="input-group">
            <label>🐳 Nom de l'image Docker</label>
            <input type="text" v-model="dockerImage" placeholder="nginx:latest" class="text-input">
          </div>
          <div v-if="scanType === 'url'" class="input-group">
            <label>🌐 URL à scanner</label>
            <input type="url" v-model="targetUrl" placeholder="https://example.com" class="text-input">
          </div>
          
          <button @click="runScan" class="scan-btn" :disabled="scanning">
            {{ scanning ? '🔄 Scan en cours...' : '🛡️ Lancer le scan' }}
          </button>
        </div>

        <!-- RESULTS -->
        <div v-if="results" class="results-section">
          <div class="results-header">
            <h3>📊 Résultats du scan</h3>
            <div class="scan-meta">
              <span>{{ results.timestamp }}</span>
              <span>{{ results.duration }}</span>
            </div>
          </div>

          <!-- SCORE -->
          <div class="score-card" :class="getScoreClass(results.score)">
            <div class="score-circle">
              <svg viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="8"/>
                <circle cx="50" cy="50" r="45" fill="none" :stroke="getScoreColor(results.score)" stroke-width="8" stroke-linecap="round" :stroke-dasharray="`${results.score * 2.83} 283`" transform="rotate(-90 50 50)"/>
              </svg>
              <span class="score-value">{{ results.score }}</span>
            </div>
            <div class="score-info">
              <div class="score-label">Score Sécurité</div>
              <div class="score-grade">{{ getGrade(results.score) }}</div>
            </div>
          </div>

          <!-- VULNERABILITIES -->
          <div class="vulns-section">
            <h4>🚨 Vulnérabilités détectées ({{ results.vulnerabilities.length }})</h4>
            <div v-if="results.vulnerabilities.length === 0" class="no-vulns">
              ✅ Aucune vulnérabilité détectée
            </div>
            <div v-else class="vulns-list">
              <div v-for="vuln in results.vulnerabilities" :key="vuln.id" class="vuln-card" :class="'severity-' + vuln.severity">
                <div class="vuln-header">
                  <span class="vuln-severity">{{ vuln.severity.toUpperCase() }}</span>
                  <span class="vuln-id">{{ vuln.id }}</span>
                </div>
                <div class="vuln-package">{{ vuln.package }} {{ vuln.version }}</div>
                <div class="vuln-title">{{ vuln.title }}</div>
                <div class="vuln-fix" v-if="vuln.fix">
                  💡 Fix: <code>{{ vuln.fix }}</code>
                </div>
              </div>
            </div>
          </div>

          <!-- RECOMMENDATIONS -->
          <div class="recommendations-section">
            <h4>💡 Recommandations EDITH</h4>
            <div class="reco-list">
              <div v-for="(reco, i) in results.recommendations" :key="i" class="reco-item">
                <span class="reco-icon">{{ reco.icon }}</span>
                <span class="reco-text">{{ reco.text }}</span>
              </div>
            </div>
          </div>

          <!-- EXPORT -->
          <div class="export-section">
            <button @click="exportReport('json')">📦 Export JSON</button>
            <button @click="exportReport('md')">📝 Export Markdown</button>
          </div>
        </div>

        <!-- COMMON VULNS INFO -->
        <div class="info-section">
          <h3>📚 Vulnérabilités courantes</h3>
          <div class="info-grid">
            <div class="info-card">
              <span class="info-icon">💉</span>
              <span class="info-title">Injection SQL</span>
              <span class="info-desc">Requêtes non paramétrées</span>
            </div>
            <div class="info-card">
              <span class="info-icon">🍪</span>
              <span class="info-title">XSS</span>
              <span class="info-desc">Cross-Site Scripting</span>
            </div>
            <div class="info-card">
              <span class="info-icon">🔓</span>
              <span class="info-title">Auth Bypass</span>
              <span class="info-desc">Contournement authentification</span>
            </div>
            <div class="info-card">
              <span class="info-icon">📦</span>
              <span class="info-title">Deps vulnérables</span>
              <span class="info-desc">Packages non à jour</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const scanType = ref('npm');
const packageJson = ref('');
const composerJson = ref('');
const dockerImage = ref('');
const targetUrl = ref('');
const scanning = ref(false);
const results = ref(null);

const scanTypes = [
  { id: 'npm', icon: '📦', name: 'npm audit', desc: 'Dépendances JavaScript' },
  { id: 'composer', icon: '🎼', name: 'Composer', desc: 'Dépendances PHP' },
  { id: 'docker', icon: '🐳', name: 'Docker/Trivy', desc: 'Images conteneurs' },
  { id: 'url', icon: '🌐', name: 'Web Scan', desc: 'Headers & TLS' }
];

async function runScan() {
  scanning.value = true;
  results.value = null;
  
  await new Promise(r => setTimeout(r, 2000 + Math.random() * 1500));
  
  // Simulate scan results
  const vulnCount = Math.floor(Math.random() * 8);
  const vulns = [];
  
  const sampleVulns = [
    { id: 'CVE-2023-1234', package: 'lodash', version: '<4.17.21', severity: 'high', title: 'Prototype Pollution', fix: 'npm update lodash' },
    { id: 'CVE-2023-5678', package: 'axios', version: '<1.6.0', severity: 'medium', title: 'SSRF Vulnerability', fix: 'npm update axios' },
    { id: 'CVE-2022-9012', package: 'express', version: '<4.18.2', severity: 'low', title: 'Open Redirect', fix: 'npm update express' },
    { id: 'CVE-2023-3456', package: 'node-fetch', version: '<3.3.0', severity: 'critical', title: 'Request Smuggling', fix: 'npm update node-fetch' },
    { id: 'GHSA-7890', package: 'jsonwebtoken', version: '<9.0.0', severity: 'high', title: 'Algorithm Confusion', fix: 'npm update jsonwebtoken' }
  ];
  
  for (let i = 0; i < vulnCount && i < sampleVulns.length; i++) {
    vulns.push(sampleVulns[i]);
  }
  
  const score = Math.max(0, 100 - vulns.reduce((s, v) => {
    return s + (v.severity === 'critical' ? 25 : v.severity === 'high' ? 15 : v.severity === 'medium' ? 8 : 3);
  }, 0));
  
  const recommendations = [
    { icon: '🔄', text: 'Mettre à jour régulièrement les dépendances' },
    { icon: '🔐', text: 'Activer Dependabot/Renovate pour les mises à jour auto' },
    { icon: '🔍', text: 'Intégrer les scans dans la CI/CD' }
  ];
  
  if (vulns.some(v => v.severity === 'critical')) {
    recommendations.unshift({ icon: '🚨', text: 'URGENT: Corriger les vulnérabilités critiques immédiatement' });
  }
  
  results.value = {
    timestamp: new Date().toLocaleString('fr-FR'),
    duration: (2 + Math.random() * 2).toFixed(1) + 's',
    score,
    vulnerabilities: vulns,
    recommendations
  };
  
  scanning.value = false;
}

function getScoreClass(score) {
  if (score >= 90) return 'excellent';
  if (score >= 70) return 'good';
  if (score >= 50) return 'warning';
  return 'critical';
}

function getScoreColor(score) {
  if (score >= 90) return '#10B981';
  if (score >= 70) return '#F59E0B';
  if (score >= 50) return '#F97316';
  return '#EF4444';
}

function getGrade(score) {
  if (score >= 90) return 'A - Excellent';
  if (score >= 80) return 'B - Bon';
  if (score >= 70) return 'C - Acceptable';
  if (score >= 50) return 'D - À risque';
  return 'F - Critique';
}

function exportReport(format) {
  if (!results.value) return;
  
  let content, filename, type;
  
  if (format === 'json') {
    content = JSON.stringify(results.value, null, 2);
    filename = 'security-report.json';
    type = 'application/json';
  } else {
    content = `# Security Report - EDITH
    
**Date:** ${results.value.timestamp}
**Score:** ${results.value.score}/100 - ${getGrade(results.value.score)}

## Vulnérabilités (${results.value.vulnerabilities.length})

${results.value.vulnerabilities.map(v => `- **${v.severity.toUpperCase()}** ${v.id}: ${v.package} - ${v.title}`).join('\n')}

## Recommandations

${results.value.recommendations.map(r => `- ${r.text}`).join('\n')}
`;
    filename = 'security-report.md';
    type = 'text/markdown';
  }
  
  const blob = new Blob([content], { type });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
}
</script>

<style scoped>
.agent-app { min-height: 100vh; background: var(--bg-primary); }
.app-header { padding: 1rem 0; border-bottom: 1px solid var(--border); }
.app-header .container { display: flex; justify-content: space-between; align-items: center; }
.back-link { color: var(--text-muted); text-decoration: none; }
.agent-badge { padding: 0.35rem 0.75rem; background: rgba(239,68,68,0.1); border: 1px solid var(--agent-color); border-radius: 2rem; font-size: 0.8rem; color: var(--agent-color); }
.app-main { padding: var(--space-lg) 0; }
.app-intro { text-align: center; margin-bottom: 2rem; }
.app-intro h1 { display: flex; justify-content: center; gap: 0.5rem; font-size: 1.75rem; }
.app-icon { font-size: 2rem; }

.scan-section, .input-section, .results-section, .info-section { margin-bottom: 2rem; }
h3 { font-size: 1rem; margin-bottom: 1rem; }

.scan-options { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 0.75rem; }
.scan-option { display: flex; flex-direction: column; align-items: flex-start; padding: 1rem; background: rgba(255,255,255,0.02); border: 1px solid var(--border); border-radius: 0.5rem; cursor: pointer; text-align: left; }
.scan-option:hover { border-color: #EF4444; }
.scan-option.active { background: rgba(239,68,68,0.1); border-color: #EF4444; }
.opt-icon { font-size: 1.5rem; margin-bottom: 0.5rem; }
.opt-name { font-weight: 600; font-size: 0.9rem; color: var(--text-main); }
.opt-desc { font-size: 0.75rem; color: var(--text-muted); }

.input-group { margin-bottom: 1rem; }
.input-group label { display: block; font-size: 0.85rem; color: var(--text-muted); margin-bottom: 0.5rem; }
.code-input { width: 100%; min-height: 150px; padding: 1rem; background: rgba(0,0,0,0.3); border: 1px solid var(--border); border-radius: 0.5rem; font-family: monospace; font-size: 0.85rem; color: var(--text-main); }
.text-input { width: 100%; padding: 0.75rem; background: rgba(0,0,0,0.3); border: 1px solid var(--border); border-radius: 0.5rem; color: var(--text-main); font-size: 0.95rem; }
.scan-btn { width: 100%; padding: 1rem; background: #EF4444; border: none; border-radius: 0.5rem; font-weight: 600; font-size: 1rem; color: white; cursor: pointer; }
.scan-btn:disabled { opacity: 0.6; cursor: not-allowed; }

.results-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
.scan-meta { font-size: 0.8rem; color: var(--text-muted); display: flex; gap: 1rem; }

.score-card { display: flex; align-items: center; gap: 1.5rem; padding: 1.5rem; border-radius: 0.75rem; margin-bottom: 1.5rem; }
.score-card.excellent { background: rgba(16,185,129,0.1); border: 1px solid rgba(16,185,129,0.3); }
.score-card.good { background: rgba(245,158,11,0.1); border: 1px solid rgba(245,158,11,0.3); }
.score-card.warning { background: rgba(249,115,22,0.1); border: 1px solid rgba(249,115,22,0.3); }
.score-card.critical { background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.3); }
.score-circle { position: relative; width: 100px; height: 100px; }
.score-circle svg { width: 100%; height: 100%; }
.score-value { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; font-size: 1.75rem; font-weight: 700; }
.score-label { font-size: 0.85rem; color: var(--text-muted); }
.score-grade { font-size: 1.25rem; font-weight: 700; }

.vulns-section { margin-bottom: 1.5rem; }
.vulns-section h4 { font-size: 0.9rem; margin-bottom: 0.75rem; }
.no-vulns { padding: 2rem; background: rgba(16,185,129,0.1); border: 1px solid rgba(16,185,129,0.3); border-radius: 0.5rem; text-align: center; color: #10B981; }
.vulns-list { display: flex; flex-direction: column; gap: 0.5rem; }
.vuln-card { padding: 1rem; background: rgba(0,0,0,0.2); border-radius: 0.5rem; border-left: 3px solid; }
.vuln-card.severity-critical { border-color: #EF4444; }
.vuln-card.severity-high { border-color: #F97316; }
.vuln-card.severity-medium { border-color: #F59E0B; }
.vuln-card.severity-low { border-color: #3B82F6; }
.vuln-header { display: flex; gap: 1rem; margin-bottom: 0.5rem; }
.vuln-severity { padding: 0.15rem 0.5rem; border-radius: 0.25rem; font-size: 0.7rem; font-weight: 600; }
.severity-critical .vuln-severity { background: rgba(239,68,68,0.2); color: #EF4444; }
.severity-high .vuln-severity { background: rgba(249,115,22,0.2); color: #F97316; }
.severity-medium .vuln-severity { background: rgba(245,158,11,0.2); color: #F59E0B; }
.severity-low .vuln-severity { background: rgba(59,130,246,0.2); color: #3B82F6; }
.vuln-id { font-family: monospace; font-size: 0.8rem; color: var(--text-muted); }
.vuln-package { font-family: monospace; font-size: 0.85rem; color: var(--primary); margin-bottom: 0.25rem; }
.vuln-title { font-size: 0.9rem; color: var(--text-secondary); }
.vuln-fix { margin-top: 0.5rem; font-size: 0.8rem; color: var(--text-muted); }
.vuln-fix code { background: rgba(0,0,0,0.3); padding: 0.2rem 0.4rem; border-radius: 0.25rem; color: var(--primary); }

.recommendations-section { margin-bottom: 1.5rem; }
.recommendations-section h4 { font-size: 0.9rem; margin-bottom: 0.75rem; }
.reco-list { display: flex; flex-direction: column; gap: 0.35rem; }
.reco-item { display: flex; align-items: center; gap: 0.75rem; padding: 0.75rem; background: rgba(255,255,255,0.02); border-radius: 0.35rem; font-size: 0.9rem; }
.reco-icon { font-size: 1.25rem; }
.reco-text { color: var(--text-secondary); }

.export-section { display: flex; gap: 0.75rem; }
.export-section button { padding: 0.6rem 1rem; background: rgba(255,255,255,0.05); border: 1px solid var(--border); border-radius: 0.35rem; color: var(--text-muted); cursor: pointer; }
.export-section button:hover { border-color: var(--primary); color: var(--primary); }

.info-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 0.75rem; }
.info-card { display: flex; flex-direction: column; align-items: center; padding: 1rem; background: rgba(255,255,255,0.02); border: 1px solid var(--border); border-radius: 0.5rem; text-align: center; }
.info-icon { font-size: 2rem; margin-bottom: 0.5rem; }
.info-title { font-weight: 600; font-size: 0.85rem; margin-bottom: 0.25rem; }
.info-desc { font-size: 0.75rem; color: var(--text-muted); }
</style>
