<template>
  <section class="view-workflows">
    <div class="workflows-header">
      <h2>🔄 Centre des Workflows</h2>
      <p>{{ workflows.length }} workflows automatisés par les agents GL Tower</p>
    </div>

    <!-- Filters -->
    <div class="workflows-filters">
      <div class="filter-group">
        <label>Agent</label>
        <select :value="filterAgent" @change="$emit('updateFilter', $event.target.value)">
          <option value="">Tous les agents</option>
          <option v-for="agent in agents.filter(a => !a.isLobby)" :key="agent.id" :value="agent.id">
            {{ agent.avatar }} {{ agent.name }}
          </option>
        </select>
      </div>
      <div class="filter-group">
        <label>Statut</label>
        <select v-model="filterStatus">
          <option value="">Tous</option>
          <option value="active">Active</option>
          <option value="standby">Standby</option>
        </select>
      </div>
      <div class="filter-group">
        <label>Recherche</label>
        <input type="text" v-model="searchQuery" placeholder="Nom du workflow...">
      </div>
    </div>

    <!-- Stats -->
    <div class="workflows-stats">
      <div class="wf-stat">
        <span class="wf-stat-value">{{ filteredWorkflows.length }}</span>
        <span class="wf-stat-label">Workflows affichés</span>
      </div>
      <div class="wf-stat">
        <span class="wf-stat-value">{{ workflows.filter(w => w.status === 'active').length }}</span>
        <span class="wf-stat-label">Actifs</span>
      </div>
      <div class="wf-stat">
        <span class="wf-stat-value">{{ uniqueCapabilities.length }}</span>
        <span class="wf-stat-label">Capabilities</span>
      </div>
    </div>

    <!-- Grid -->
    <div class="workflows-grid">
      <div 
        v-for="wf in filteredWorkflows" 
        :key="wf.id"
        class="workflow-card"
        :style="{ '--wf-color': wf.agentColor }"
        @click="$emit('showDetail', wf)"
      >
        <div class="wf-header">
          <span class="wf-agent">{{ getAgent(wf.agentId)?.avatar }}</span>
          <span class="wf-status-badge" :class="wf.status">{{ wf.status }}</span>
        </div>
        <h4 class="wf-title">{{ wf.name }}</h4>
        <p class="wf-desc">{{ wf.description }}</p>
        <div class="wf-meta">
          <span class="wf-trigger">⚡ {{ wf.trigger }}</span>
          <span class="wf-frequency">🕐 {{ wf.frequency }}</span>
        </div>
        <div class="wf-capability">
          <span class="cap-tag">{{ wf.capability }}</span>
        </div>
        <div class="wf-nodes">
          <span v-for="(node, i) in wf.nodes?.slice(0, 4)" :key="i" class="wf-node">{{ node }}</span>
          <span v-if="wf.nodes?.length > 4" class="wf-more">+{{ wf.nodes.length - 4 }}</span>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div class="workflows-empty" v-if="filteredWorkflows.length === 0">
      <span class="empty-icon">🔍</span>
      <p>Aucun workflow ne correspond aux filtres</p>
      <button @click="resetFilters" class="reset-btn">Réinitialiser les filtres</button>
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  agents: { type: Array, required: true },
  workflows: { type: Array, required: true },
  filterAgent: { type: String, default: '' }
});

const emit = defineEmits(['updateFilter', 'showDetail']);

const filterStatus = ref('');
const searchQuery = ref('');

const getAgent = (id) => props.agents.find(a => a.id === id);

const filteredWorkflows = computed(() => {
  let result = props.workflows;
  
  if (props.filterAgent) {
    result = result.filter(wf => wf.agentId === props.filterAgent);
  }
  
  if (filterStatus.value) {
    result = result.filter(wf => wf.status === filterStatus.value);
  }
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(wf => 
      wf.name.toLowerCase().includes(query) || 
      wf.description.toLowerCase().includes(query)
    );
  }
  
  return result;
});

const uniqueCapabilities = computed(() => {
  return [...new Set(props.workflows.map(w => w.capability))];
});

const resetFilters = () => {
  emit('updateFilter', '');
  filterStatus.value = '';
  searchQuery.value = '';
};
</script>

<style scoped>
.view-workflows { padding: 2rem; max-width: 1400px; margin: 0 auto; }

.workflows-header { text-align: center; margin-bottom: 2rem; }
.workflows-header h2 { font-size: 2rem; margin-bottom: 0.5rem; }
.workflows-header p { color: #888; }

.workflows-filters { display: flex; justify-content: center; gap: 1rem; margin-bottom: 1.5rem; flex-wrap: wrap; }
.filter-group { display: flex; flex-direction: column; gap: 0.25rem; }
.filter-group label { font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.05em; color: #666; }
.filter-group select, .filter-group input { padding: 0.5rem 1rem; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); border-radius: 0.5rem; color: #fff; font-size: 0.85rem; min-width: 180px; }
.filter-group select:focus, .filter-group input:focus { outline: none; border-color: #10B981; }

.workflows-stats { display: flex; justify-content: center; gap: 3rem; margin-bottom: 2rem; padding: 1rem; background: rgba(255,255,255,0.02); border-radius: 0.5rem; }
.wf-stat { text-align: center; }
.wf-stat-value { display: block; font-family: 'JetBrains Mono', monospace; font-size: 1.5rem; font-weight: 700; color: #10B981; }
.wf-stat-label { font-size: 0.7rem; color: #666; }

.workflows-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 1rem; }

.workflow-card { padding: 1.25rem; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); border-left: 3px solid var(--wf-color); border-radius: 0.5rem; cursor: pointer; transition: all 0.3s; }
.workflow-card:hover { background: rgba(255,255,255,0.05); transform: translateY(-2px); box-shadow: 0 10px 30px rgba(0,0,0,0.2); }

.wf-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; }
.wf-agent { font-size: 1.5rem; }
.wf-status-badge { font-size: 0.65rem; padding: 0.2rem 0.5rem; border-radius: 1rem; text-transform: uppercase; }
.wf-status-badge.active { background: rgba(16,185,129,0.1); color: #10B981; }
.wf-status-badge.standby { background: rgba(245,158,11,0.1); color: #F59E0B; }

.wf-title { font-size: 1rem; color: #fff; margin-bottom: 0.5rem; }
.wf-desc { font-size: 0.8rem; color: #888; margin-bottom: 0.75rem; line-height: 1.5; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }

.wf-meta { display: flex; gap: 1rem; margin-bottom: 0.75rem; font-size: 0.7rem; color: #666; }
.wf-capability { margin-bottom: 0.75rem; }
.cap-tag { font-size: 0.65rem; padding: 0.2rem 0.5rem; background: rgba(139,92,246,0.1); color: #8B5CF6; border-radius: 4px; }

.wf-nodes { display: flex; flex-wrap: wrap; gap: 0.25rem; }
.wf-node { font-family: 'JetBrains Mono', monospace; font-size: 0.6rem; padding: 0.2rem 0.4rem; background: rgba(255,255,255,0.05); border-radius: 2px; color: #888; }
.wf-more { font-size: 0.6rem; color: #666; padding: 0.2rem 0.4rem; }

.workflows-empty { text-align: center; padding: 4rem; }
.empty-icon { font-size: 3rem; display: block; margin-bottom: 1rem; }
.workflows-empty p { color: #666; margin-bottom: 1rem; }
.reset-btn { padding: 0.5rem 1rem; background: rgba(16,185,129,0.1); border: 1px solid rgba(16,185,129,0.3); border-radius: 0.5rem; color: #10B981; cursor: pointer; transition: all 0.3s; }
.reset-btn:hover { background: #10B981; color: #000; }

@media (max-width: 768px) {
  .workflows-filters { flex-direction: column; align-items: stretch; }
  .filter-group select, .filter-group input { min-width: 100%; }
  .workflows-stats { gap: 1.5rem; }
}
</style>
