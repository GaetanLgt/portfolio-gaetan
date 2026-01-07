<template>
  <div class="agent-app">
    <header class="app-header">
      <div class="container">
        <router-link to="/apps" class="back-link">← Retour aux Apps</router-link>
        <span class="agent-badge" style="--agent-color: #F59E0B">📊 ULTRON</span>
      </div>
    </header>
    <main class="app-main">
      <div class="container">
        <div class="app-intro">
          <h1><span class="app-icon">📊</span> System Monitor</h1>
          <p>Surveillez vos services et métriques en temps réel</p>
        </div>

        <!-- STATUS OVERVIEW -->
        <div class="status-overview">
          <div class="status-card" :class="overallStatus">
            <div class="status-icon">{{ overallStatus === 'healthy' ? '✅' : overallStatus === 'degraded' ? '⚠️' : '🔴' }}</div>
            <div class="status-info">
              <div class="status-label">Statut Global</div>
              <div class="status-value">{{ overallStatus === 'healthy' ? 'Tous systèmes opérationnels' : overallStatus === 'degraded' ? 'Performances dégradées' : 'Incident en cours' }}</div>
            </div>
            <div class="status-uptime">Uptime: {{ uptimePercent }}%</div>
          </div>
        </div>

        <!-- SERVICES -->
        <div class="services-section">
          <h3>🖥️ Services ({{ services.filter(s => s.status === 'up').length }}/{{ services.length }} en ligne)</h3>
          <div class="services-grid">
            <div v-for="service in services" :key="service.id" class="service-card" :class="'status-' + service.status">
              <div class="service-status">
                <span class="status-dot"></span>
                <span class="status-text">{{ service.status === 'up' ? 'Online' : 'Offline' }}</span>
              </div>
              <div class="service-icon">{{ service.icon }}</div>
              <div class="service-name">{{ service.name }}</div>
              <div class="service-latency" v-if="service.latency">{{ service.latency }}ms</div>
              <div class="service-uptime">{{ service.uptime }}% uptime</div>
            </div>
          </div>
        </div>

        <!-- METRICS -->
        <div class="metrics-section">
          <h3>📈 Métriques temps réel</h3>
          <div class="metrics-grid">
            <div class="metric-card">
              <div class="metric-header">
                <span class="metric-icon">🔥</span>
                <span class="metric-name">CPU</span>
              </div>
              <div class="metric-value" :class="getMetricClass(metrics.cpu)">{{ metrics.cpu }}%</div>
              <div class="metric-bar">
                <div class="metric-fill" :style="{ width: metrics.cpu + '%' }" :class="getMetricClass(metrics.cpu)"></div>
              </div>
            </div>
            <div class="metric-card">
              <div class="metric-header">
                <span class="metric-icon">💾</span>
                <span class="metric-name">RAM</span>
              </div>
              <div class="metric-value" :class="getMetricClass(metrics.ram)">{{ metrics.ram }}%</div>
              <div class="metric-bar">
                <div class="metric-fill" :style="{ width: metrics.ram + '%' }" :class="getMetricClass(metrics.ram)"></div>
              </div>
            </div>
            <div class="metric-card">
              <div class="metric-header">
                <span class="metric-icon">💿</span>
                <span class="metric-name">Disk</span>
              </div>
              <div class="metric-value" :class="getMetricClass(metrics.disk)">{{ metrics.disk }}%</div>
              <div class="metric-bar">
                <div class="metric-fill" :style="{ width: metrics.disk + '%' }" :class="getMetricClass(metrics.disk)"></div>
              </div>
            </div>
            <div class="metric-card">
              <div class="metric-header">
                <span class="metric-icon">🌐</span>
                <span class="metric-name">Network</span>
              </div>
              <div class="metric-value">{{ metrics.network }} Mb/s</div>
              <div class="metric-sub">↑ {{ metrics.networkUp }} ↓ {{ metrics.networkDown }}</div>
            </div>
          </div>
        </div>

        <!-- RECENT ALERTS -->
        <div class="alerts-section">
          <h3>🚨 Alertes récentes</h3>
          <div class="alerts-list">
            <div v-for="alert in alerts" :key="alert.id" class="alert-card" :class="'severity-' + alert.severity">
              <div class="alert-time">{{ alert.time }}</div>
              <div class="alert-severity">{{ alert.severity }}</div>
              <div class="alert-message">{{ alert.message }}</div>
              <div class="alert-service">{{ alert.service }}</div>
            </div>
          </div>
        </div>

        <!-- QUICK ACTIONS -->
        <div class="actions-section">
          <h3>⚡ Actions rapides</h3>
          <div class="actions-grid">
            <button @click="refreshAll">🔄 Refresh All</button>
            <button @click="restartService">🔁 Restart Service</button>
            <button @click="clearCache">🗑️ Clear Cache</button>
            <button @click="exportMetrics">📊 Export Metrics</button>
          </div>
        </div>

        <!-- UPTIME HISTORY -->
        <div class="uptime-section">
          <h3>📅 Historique des 7 derniers jours</h3>
          <div class="uptime-grid">
            <div v-for="day in uptimeHistory" :key="day.date" class="uptime-day">
              <div class="uptime-bar" :style="{ height: day.uptime + '%' }" :class="getUptimeClass(day.uptime)"></div>
              <div class="uptime-label">{{ day.day }}</div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';

const services = ref([
  { id: 1, name: 'API Backend', icon: '⚙️', status: 'up', latency: 45, uptime: 99.9 },
  { id: 2, name: 'Database', icon: '🗄️', status: 'up', latency: 12, uptime: 99.99 },
  { id: 3, name: 'Redis Cache', icon: '🔴', status: 'up', latency: 2, uptime: 99.95 },
  { id: 4, name: 'CDN', icon: '🌐', status: 'up', latency: 28, uptime: 99.8 },
  { id: 5, name: 'Email Service', icon: '📧', status: 'up', latency: 156, uptime: 99.5 },
  { id: 6, name: 'Worker Queue', icon: '⚡', status: 'up', latency: 8, uptime: 99.7 }
]);

const metrics = ref({
  cpu: 34,
  ram: 62,
  disk: 48,
  network: 156,
  networkUp: 45,
  networkDown: 111
});

const alerts = ref([
  { id: 1, time: '14:32', severity: 'warning', message: 'High memory usage detected', service: 'Worker Queue' },
  { id: 2, time: '12:15', severity: 'info', message: 'Scheduled maintenance completed', service: 'Database' },
  { id: 3, time: '09:45', severity: 'resolved', message: 'CPU spike resolved', service: 'API Backend' }
]);

const uptimeHistory = ref([
  { day: 'Lun', date: '2024-01-01', uptime: 100 },
  { day: 'Mar', date: '2024-01-02', uptime: 99.8 },
  { day: 'Mer', date: '2024-01-03', uptime: 99.9 },
  { day: 'Jeu', date: '2024-01-04', uptime: 100 },
  { day: 'Ven', date: '2024-01-05', uptime: 98.5 },
  { day: 'Sam', date: '2024-01-06', uptime: 100 },
  { day: 'Dim', date: '2024-01-07', uptime: 99.95 }
]);

const overallStatus = computed(() => {
  const downCount = services.value.filter(s => s.status === 'down').length;
  if (downCount > 1) return 'critical';
  if (downCount === 1) return 'degraded';
  return 'healthy';
});

const uptimePercent = computed(() => {
  const avg = uptimeHistory.value.reduce((s, d) => s + d.uptime, 0) / uptimeHistory.value.length;
  return avg.toFixed(2);
});

let interval;
onMounted(() => {
  interval = setInterval(() => {
    // Simulate live metrics
    metrics.value.cpu = Math.max(10, Math.min(95, metrics.value.cpu + (Math.random() - 0.5) * 10));
    metrics.value.ram = Math.max(30, Math.min(90, metrics.value.ram + (Math.random() - 0.5) * 5));
    metrics.value.network = Math.max(50, Math.min(300, metrics.value.network + (Math.random() - 0.5) * 30));
    
    // Update latencies
    services.value.forEach(s => {
      if (s.latency) {
        s.latency = Math.max(1, s.latency + Math.floor((Math.random() - 0.5) * 10));
      }
    });
  }, 2000);
});

onUnmounted(() => clearInterval(interval));

function getMetricClass(value) {
  if (value >= 90) return 'critical';
  if (value >= 75) return 'warning';
  return 'normal';
}

function getUptimeClass(value) {
  if (value >= 99.9) return 'excellent';
  if (value >= 99) return 'good';
  if (value >= 95) return 'warning';
  return 'critical';
}

function refreshAll() {
  services.value.forEach(s => s.latency = Math.floor(Math.random() * 100) + 5);
}

function restartService() {
  alert('Restart service... (simulation)');
}

function clearCache() {
  alert('Cache cleared! (simulation)');
}

function exportMetrics() {
  const data = { services: services.value, metrics: metrics.value, timestamp: new Date().toISOString() };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'metrics-export.json';
  a.click();
}
</script>

<style scoped>
.agent-app { min-height: 100vh; background: var(--bg-primary); }
.app-header { padding: 1rem 0; border-bottom: 1px solid var(--border); }
.app-header .container { display: flex; justify-content: space-between; align-items: center; }
.back-link { color: var(--text-muted); text-decoration: none; }
.agent-badge { padding: 0.35rem 0.75rem; background: rgba(245,158,11,0.1); border: 1px solid var(--agent-color); border-radius: 2rem; font-size: 0.8rem; color: var(--agent-color); }
.app-main { padding: var(--space-lg) 0; }
.app-intro { text-align: center; margin-bottom: 2rem; }
.app-intro h1 { display: flex; justify-content: center; gap: 0.5rem; font-size: 1.75rem; }
.app-icon { font-size: 2rem; }

h3 { font-size: 1rem; margin-bottom: 1rem; }

.status-overview { margin-bottom: 2rem; }
.status-card { display: flex; align-items: center; gap: 1.5rem; padding: 1.5rem; border-radius: 0.75rem; }
.status-card.healthy { background: rgba(16,185,129,0.1); border: 1px solid rgba(16,185,129,0.3); }
.status-card.degraded { background: rgba(245,158,11,0.1); border: 1px solid rgba(245,158,11,0.3); }
.status-card.critical { background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.3); }
.status-icon { font-size: 2.5rem; }
.status-label { font-size: 0.85rem; color: var(--text-muted); }
.status-value { font-size: 1.25rem; font-weight: 600; }
.status-uptime { margin-left: auto; font-family: monospace; font-size: 1.5rem; font-weight: 700; color: var(--primary); }

.services-section { margin-bottom: 2rem; }
.services-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 0.75rem; }
.service-card { padding: 1rem; background: rgba(255,255,255,0.02); border: 1px solid var(--border); border-radius: 0.5rem; text-align: center; position: relative; }
.service-card.status-up { border-color: rgba(16,185,129,0.3); }
.service-card.status-down { border-color: rgba(239,68,68,0.3); background: rgba(239,68,68,0.05); }
.service-status { position: absolute; top: 0.5rem; right: 0.5rem; display: flex; align-items: center; gap: 0.25rem; font-size: 0.65rem; }
.status-dot { width: 8px; height: 8px; border-radius: 50%; }
.status-up .status-dot { background: #10B981; }
.status-down .status-dot { background: #EF4444; }
.status-text { color: var(--text-muted); }
.service-icon { font-size: 2rem; margin-bottom: 0.5rem; }
.service-name { font-weight: 600; font-size: 0.85rem; margin-bottom: 0.25rem; }
.service-latency { font-family: monospace; font-size: 0.8rem; color: var(--primary); }
.service-uptime { font-size: 0.7rem; color: var(--text-muted); }

.metrics-section { margin-bottom: 2rem; }
.metrics-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 1rem; }
.metric-card { padding: 1rem; background: rgba(255,255,255,0.02); border: 1px solid var(--border); border-radius: 0.5rem; }
.metric-header { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem; }
.metric-icon { font-size: 1.25rem; }
.metric-name { font-size: 0.85rem; color: var(--text-muted); }
.metric-value { font-size: 2rem; font-weight: 700; margin-bottom: 0.5rem; }
.metric-value.normal { color: #10B981; }
.metric-value.warning { color: #F59E0B; }
.metric-value.critical { color: #EF4444; }
.metric-bar { height: 6px; background: rgba(255,255,255,0.1); border-radius: 3px; overflow: hidden; }
.metric-fill { height: 100%; border-radius: 3px; transition: width 0.5s ease; }
.metric-fill.normal { background: #10B981; }
.metric-fill.warning { background: #F59E0B; }
.metric-fill.critical { background: #EF4444; }
.metric-sub { font-size: 0.8rem; color: var(--text-muted); margin-top: 0.5rem; }

.alerts-section { margin-bottom: 2rem; }
.alerts-list { display: flex; flex-direction: column; gap: 0.5rem; }
.alert-card { display: grid; grid-template-columns: 60px 80px 1fr 120px; align-items: center; padding: 0.75rem 1rem; background: rgba(0,0,0,0.2); border-radius: 0.35rem; border-left: 3px solid; font-size: 0.85rem; }
.alert-card.severity-warning { border-color: #F59E0B; }
.alert-card.severity-info { border-color: #3B82F6; }
.alert-card.severity-resolved { border-color: #10B981; }
.alert-card.severity-critical { border-color: #EF4444; }
.alert-time { font-family: monospace; color: var(--text-muted); }
.alert-severity { text-transform: uppercase; font-size: 0.7rem; font-weight: 600; }
.severity-warning .alert-severity { color: #F59E0B; }
.severity-info .alert-severity { color: #3B82F6; }
.severity-resolved .alert-severity { color: #10B981; }
.severity-critical .alert-severity { color: #EF4444; }
.alert-message { color: var(--text-secondary); }
.alert-service { color: var(--text-muted); text-align: right; }

.actions-section { margin-bottom: 2rem; }
.actions-grid { display: flex; flex-wrap: wrap; gap: 0.75rem; }
.actions-grid button { padding: 0.6rem 1rem; background: rgba(255,255,255,0.02); border: 1px solid var(--border); border-radius: 0.35rem; color: var(--text-muted); cursor: pointer; font-size: 0.85rem; }
.actions-grid button:hover { border-color: var(--primary); color: var(--primary); }

.uptime-section { margin-bottom: 2rem; }
.uptime-grid { display: flex; gap: 0.5rem; height: 120px; align-items: flex-end; padding: 1rem; background: rgba(0,0,0,0.2); border-radius: 0.5rem; }
.uptime-day { flex: 1; display: flex; flex-direction: column; align-items: center; }
.uptime-bar { width: 100%; border-radius: 0.25rem 0.25rem 0 0; transition: height 0.3s ease; }
.uptime-bar.excellent { background: #10B981; }
.uptime-bar.good { background: #3B82F6; }
.uptime-bar.warning { background: #F59E0B; }
.uptime-bar.critical { background: #EF4444; }
.uptime-label { font-size: 0.7rem; color: var(--text-muted); margin-top: 0.5rem; }
</style>
