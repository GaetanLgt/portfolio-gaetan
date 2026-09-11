<template>
  <div class="agent-app">
    <header class="app-header">
      <div class="container">
        <router-link to="/apps" class="back-link">← Retour aux Apps</router-link>
        <span class="agent-badge" style="--agent-color: #F59E0B">📊 DOU</span>
      </div>
    </header>
    <main class="app-main">
      <div class="container">
        <div class="app-intro">
          <h1><span class="app-icon">📊</span> System Monitor</h1>
          <p>L'état réel des services du studio — mesuré, jamais estimé</p>
        </div>

        <!--
          PROVENANCE DE LA DONNÉE — ajouté le 11/09/2026.
          Sans cette ligne, un visiteur ne peut pas savoir si les chiffres qu'il
          lit ont été mesurés ou écrits à la main. C'est la règle du dépôt :
          étiqueter une mesure datée, ne jamais présenter une simulation comme
          réelle. Le libellé change selon ce qui a RÉELLEMENT répondu.
        -->
        <div class="provenance" :class="source === 'direct' ? 'provenance--direct' : 'provenance--releve'">
          <span class="provenance__pastille"></span>
          <span class="provenance__texte">{{ provenance }}</span>
        </div>

        <!-- STATUS OVERVIEW -->
        <div class="status-overview">
          <div class="status-card" :class="overallStatus">
            <div class="status-icon">{{ overallStatus === 'healthy' ? '✅' : overallStatus === 'degraded' ? '⚠️' : '🔴' }}</div>
            <div class="status-info">
              <div class="status-label">Statut Global</div>
              <div class="status-value">{{ overallStatus === 'healthy' ? 'Tous systèmes opérationnels' : overallStatus === 'degraded' ? 'Performances dégradées' : 'Incident en cours' }}</div>
            </div>
            <div class="status-uptime">{{ services.filter(s => s.status === 'up').length }}/{{ services.length }} en ligne</div>
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
              <!-- Avant : « {{ service.uptime }}% uptime », un chiffre inventé.
                   Maintenant : le PORT, qui est une donnée réelle et vérifiable. -->
              <div class="service-uptime">port {{ service.port }}</div>
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
            <!--
              DISQUE et RÉSEAU : la supervision ne les mesure PAS.
              Avant, la page affichait « 48 % » et « 156 Mb/s » — des valeurs qui
              ne venaient d'aucune source. On écrit « non mesuré » : c'est plus
              honnête qu'un chiffre inventé, et ça dit exactement où s'arrête la
              mesure. Brancher un capteur est un travail séparé, pas un mensonge.
            -->
            <div class="metric-card metric-card--non-mesure">
              <div class="metric-header">
                <span class="metric-icon">💿</span>
                <span class="metric-name">Disk</span>
              </div>
              <div class="metric-value metric-value--non-mesure">non mesuré</div>
              <div class="metric-sub">la supervision ne relève pas le disque</div>
            </div>
            <div class="metric-card metric-card--non-mesure">
              <div class="metric-header">
                <span class="metric-icon">🌐</span>
                <span class="metric-name">Réseau</span>
              </div>
              <div class="metric-value metric-value--non-mesure">non mesuré</div>
              <div class="metric-sub">débit non relevé</div>
            </div>
            <!--
              Remplacé par une mesure RÉELLE, et elle vaut le détour : le CPU est
              une moyenne entre deux relevés de os.cpus(), annoncée comme telle,
              et la RAM est la mémoire libre réelle de la machine.
            -->
            <div class="metric-card">
              <div class="metric-header">
                <span class="metric-icon">🧮</span>
                <span class="metric-name">Machine</span>
              </div>
              <div class="metric-value">{{ metrics.ramLibreGo }} Go libres</div>
              <div class="metric-sub">sur {{ metrics.ramTotalGo }} · {{ metrics.cpus }} cœurs</div>
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

        <!--
          HISTORIQUE — CETTE SECTION AFFICHAIT SEPT JOURS QUI N'ONT JAMAIS EXISTÉ.
          Elle montrait une barre par jour, avec des taux (100 %, 99,8 %, 98,5 %…)
          et des dates de **2024**. Aucune de ces mesures n'avait été prise : la
          supervision ne conserve aucun historique.

          On ne fabrique donc pas sept points. On affiche ce qu'on a : le relevé
          réel du jour, et la raison pour laquelle il n'y en a qu'un.
        -->
        <div class="uptime-section">
          <h3>📅 Relevé du jour</h3>
          <div class="uptime-grid">
            <div v-for="day in uptimeHistory" :key="day.date" class="uptime-day">
              <div class="uptime-bar" :style="{ height: (parseFloat(uptimePercent) || 0) + '%' }" :class="getUptimeClass(parseFloat(uptimePercent) || 0)"></div>
              <div class="uptime-label">{{ day.date.slice(5) }}</div>
            </div>
          </div>
          <p class="uptime-note">
            Un seul point : aucun historique n'est conservé. Une courbe sur sept jours
            demanderait sept jours de relevés réels — pas sept valeurs inventées.
          </p>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import etatReel from '@/data/etat-services.json';

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * CETTE PAGE AFFICHAIT DES CHIFFRES INVENTÉS. ELLE AFFICHE DES MESURES.
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * Avant le 11/09/2026 : six services qui n'existent pas (API Backend, Database,
 * Redis Cache, CDN, Email Service, Worker Queue), des latences écrites en dur,
 * des alertes fictives (« CPU spike resolved »), un historique d'uptime daté de
 * **2024**, et un `setInterval` qui faisait varier le tout avec `Math.random()`.
 *
 * Le dépôt interdit *« une simulation présentée comme réelle »*. Une page qui
 * affirme « Tous systèmes opérationnels » sans avoir rien mesuré n'est pas une
 * démo : c'est un mensonge affiché, et il est servi à chaque visiteur.
 *
 * Ce que la page affiche désormais, et d'où cela vient :
 *   · `src/data/etat-services.json` — un RELEVÉ RÉEL, produit par
 *     `forge-ia/api-supervision.mjs` : huit connexions TCP réellement ouvertes et
 *     chronométrées, plus le CPU et la RAM de la machine du studio.
 *   · Si la supervision locale répond (`127.0.0.1:8134`), la page se RAFRAÎCHIT en
 *     direct — c'est le cas sur la machine du studio.
 *   · Sinon (tout visiteur distant : il ne peut pas joindre la boucle locale), la
 *     page affiche le relevé daté, ET LE DIT.
 *
 * Les données qui n'ont pas de source réelle ne sont pas inventées : le disque et
 * le réseau ne sont pas mesurés par la supervision, et les alertes sont vides
 * parce qu'il n'y en a aucune. Un zéro honnête vaut mieux qu'un chiffre inventé.
 */

const RELEVE = etatReel;
const ICONES = {
  Ollama: '🧠', 'Open WebUI': '📚', ComfyUI: '🎨', worker: '⚡',
  API: '⚙️', portail: '🚪', 'assistant local': '💬', 'DSH web': '🖥️',
};

const source = ref('releve');           // 'releve' = instantané daté · 'direct' = temps réel local
const horodatage = ref(RELEVE.horodatage);
const latenceMoyenne = ref(RELEVE.latence_moyenne_ms);

const services = ref(
  RELEVE.services.map((s, i) => ({
    id: i + 1,
    name: s.nom,
    icon: ICONES[s.nom] || '🔧',
    // « status » attendu par le gabarit : up / down. C'est la seule valeur que
    // la mesure produit — pas de « degraded » inventé.
    status: s.etat === 'up' ? 'up' : 'down',
    latency: s.etat === 'up' ? s.ms : null,
    role: s.role,
    port: s.port,
    detail: s.detail || null,
  })),
);

const machine = RELEVE.machine_metriques;

// CPU et RAM : mesurés. Disque et réseau : PAS mesurés par la supervision —
// on ne met donc pas de valeur. (Avant : 48 % et 156 kb/s, sortis de nulle part.)
const metrics = ref({
  cpu: machine.cpu_pct,
  ram: machine.ram_pct,
  disk: null,
  network: null,
  ramLibreGo: machine.ram_libre_go,
  ramTotalGo: machine.ram_total_go,
  cpus: machine.cpus,
});

/** Aucune alerte n'est inventée : la liste est vide parce qu'il n'y en a pas. */
const alerts = ref([]);

/**
 * Pas d'historique fabriqué. On garde UN point : celui du relevé réel.
 * Le taux affiché se calcule donc sur les SERVICES observés — pas sur un
 * historique de sept jours daté de 2024, qui n'a jamais existé.
 */
const uptimeHistory = ref([{ day: 'Relevé', date: RELEVE.horodatage.slice(0, 10), uptime: null }]);

const overallStatus = computed(() => {
  const downCount = services.value.filter((s) => s.status === 'down').length;
  if (downCount > 1) return 'critical';
  if (downCount === 1) return 'degraded';
  return 'healthy';
});

const uptimePercent = computed(() => {
  const up = services.value.filter((s) => s.status === 'up').length;
  return services.value.length ? ((up / services.value.length) * 100).toFixed(1) : '—';
});

/** Libellé lisible de la provenance, affiché dans l'interface. */
const provenance = computed(() =>
  source.value === 'direct'
    ? 'mesure directe, rafraîchie toutes les 15 s — supervision locale du studio'
    : `relevé du ${new Date(horodatage.value).toLocaleString('fr-FR')} — mesure datée, pas de temps réel`,
);

let interval;

/**
 * Rafraîchissement : on interroge la VRAIE supervision si elle est joignable.
 * Sur la machine du studio elle répond ; depuis un navigateur distant, non —
 * et dans ce cas on ne simule RIEN, on garde le relevé daté.
 */
async function rafraichir() {
  try {
    const r = await fetch('http://127.0.0.1:8134/etat', { cache: 'no-store' });
    if (!r.ok) return;
    const j = await r.json();
    source.value = 'direct';
    horodatage.value = j.horodatage;
    latenceMoyenne.value = j.latence_moyenne_ms;
    services.value = j.services.map((s, i) => ({
      id: i + 1,
      name: s.nom,
      icon: ICONES[s.nom] || '🔧',
      status: s.etat === 'up' ? 'up' : 'down',
      latency: s.etat === 'up' ? s.ms : null,
      role: s.role,
      port: s.port,
      detail: s.detail || null,
    }));
    metrics.value.cpu = j.machine_metriques.cpu_pct;
    metrics.value.ram = j.machine_metriques.ram_pct;
    metrics.value.ramLibreGo = j.machine_metriques.ram_libre_go;
  } catch {
    // Supervision locale injoignable : c'est le cas NORMAL pour un visiteur.
    // On ne bascule pas sur des valeurs inventées — on garde le relevé daté.
    source.value = 'releve';
  }
}

onMounted(() => {
  rafraichir();
  interval = setInterval(rafraichir, 15000);
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

/**
 * Avant : `services.forEach(s => s.latency = Math.random() * 100 + 5)`.
 * Le bouton « Actualiser » INVENTAIT donc des latences — un clic, et la page
 * affichait des nombres nouveaux qui ne venaient d'aucune mesure. C'est le
 * défaut le plus trompeur de cette page : l'utilisateur croit rafraîchir une
 * donnée, et il en fabrique une.
 *
 * Maintenant : on interroge la VRAIE supervision. Si elle ne répond pas (cas
 * normal d'un visiteur distant), on ne remplace rien — le relevé daté reste
 * affiché, avec son horodatage. Pas de valeurs de remplacement.
 */
function refreshAll() {
  rafraichir();
}

function restartService() {
  // Redémarrer un service est une action SYSTÈME, pas une action de navigateur.
  // On ne fait donc pas semblant : on dit ce que c'est.
  alert('Action non automatisée : redémarrer un service se fait sur le poste, pas depuis cette page.');
}

function clearCache() {
  alert('Action non automatisée : vider un cache se fait sur le poste, pas depuis cette page.');
}

function exportMetrics() {
  const data = {
    _provenance: provenance.value,
    services: services.value,
    metrics: metrics.value,
    horodatage_releve: horodatage.value,
    exporte_le: new Date().toISOString(),
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'etat-services.json';
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

/* ─────────────────────────────────────────────────────────────────────────────
   PROVENANCE DE LA DONNÉE — ajouté le 11/09/2026.
   Un seul rôle : que le visiteur sache si ce qu'il lit est mesuré ou écrit à la
   main, et QUAND. La pastille change de couleur selon la source réelle :
   verte = la supervision locale répond (temps réel), ambre = relevé daté.
   ───────────────────────────────────────────────────────────────────────────── */
.provenance {
  display: flex; align-items: center; gap: 0.6rem;
  margin: 0 auto 1.5rem; padding: 0.6rem 1rem;
  max-width: 100%;
  border-radius: 0.5rem;
  font-size: 0.8rem;
  font-family: var(--font-mono, monospace);
  line-height: 1.4;
}
.provenance--direct { background: rgba(16,185,129,0.08); border: 1px solid rgba(16,185,129,0.28); }
.provenance--releve { background: rgba(245,158,11,0.08); border: 1px solid rgba(245,158,11,0.28); }
.provenance__pastille {
  flex: none; width: 0.5rem; height: 0.5rem; border-radius: 50%;
}
.provenance--direct .provenance__pastille { background: #10B981; box-shadow: 0 0 8px rgba(16,185,129,0.8); }
.provenance--releve .provenance__pastille { background: #F59E0B; }
.provenance__texte { color: var(--text-muted); }

/* Une donnée qu'on n'a pas mesurée se dit « non mesuré », elle ne s'invente pas. */
.metric-card--non-mesure { opacity: 0.55; }
.metric-value--non-mesure {
  font-size: 0.95rem; font-family: var(--font-mono, monospace);
  color: var(--text-muted); font-style: italic;
}

.uptime-note {
  margin-top: 0.75rem; font-size: 0.75rem; color: var(--text-muted);
  line-height: 1.5; max-width: 42rem;
}
</style>
