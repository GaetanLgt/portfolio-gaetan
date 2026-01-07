<template>
  <div class="workflow-visualizer">
    <!-- Header -->
    <div class="wf-header">
      <button class="wf-close" @click="$emit('close')">✕</button>
      <h2>🔄 WORKFLOWS LAB</h2>
      <p class="wf-subtitle">{{ totalWorkflows }} workflows · {{ agents.length }} agents</p>
    </div>

    <!-- Agent Filter -->
    <div class="wf-filters">
      <button 
        v-for="agent in agents" 
        :key="agent.id"
        class="agent-chip"
        :class="{ active: selectedAgent === agent.id }"
        :style="{ '--agent-color': agent.color }"
        @click="selectAgent(agent.id)"
      >
        <span class="chip-icon">{{ agent.avatar }}</span>
        <span class="chip-name">{{ agent.name }}</span>
        <span class="chip-count">{{ agent.workflows.length }}</span>
      </button>
    </div>

    <!-- Workflow List -->
    <div class="wf-content">
      <TransitionGroup name="wf-list" tag="div" class="wf-grid">
        <div 
          v-for="workflow in filteredWorkflows" 
          :key="workflow.id"
          class="workflow-card"
          :class="{ expanded: expandedWorkflow === workflow.id }"
          @click="toggleWorkflow(workflow.id)"
        >
          <!-- Card Header -->
          <div class="wf-card-header">
            <span class="wf-status" :class="workflow.status"></span>
            <div class="wf-info">
              <h3>{{ workflow.name }}</h3>
              <span class="wf-agent">{{ workflow.agentName }}</span>
            </div>
            <span class="wf-capability">{{ workflow.capability }}</span>
          </div>

          <!-- Card Body (expanded) -->
          <div v-if="expandedWorkflow === workflow.id" class="wf-card-body">
            <p class="wf-desc">{{ workflow.description }}</p>
            
            <!-- Trigger -->
            <div class="wf-meta">
              <div class="meta-item">
                <span class="meta-label">⚡ Trigger</span>
                <span class="meta-value">{{ workflow.trigger }}</span>
              </div>
              <div class="meta-item">
                <span class="meta-label">🔁 Fréquence</span>
                <span class="meta-value">{{ workflow.frequency }}</span>
              </div>
            </div>

            <!-- Flow Visualization -->
            <div class="wf-flow">
              <div 
                v-for="(node, i) in workflow.nodes" 
                :key="i"
                class="flow-node"
              >
                <span class="node-name">{{ node }}</span>
                <span v-if="i < workflow.nodes.length - 1" class="node-arrow">→</span>
              </div>
            </div>
          </div>
        </div>
      </TransitionGroup>
    </div>

    <!-- Stats Footer -->
    <div class="wf-footer">
      <div class="stat">
        <span class="stat-value">{{ activeWorkflows }}</span>
        <span class="stat-label">Actifs</span>
      </div>
      <div class="stat">
        <span class="stat-value">{{ standbyWorkflows }}</span>
        <span class="stat-label">Standby</span>
      </div>
      <div class="stat">
        <span class="stat-value">{{ uniqueTriggers }}</span>
        <span class="stat-label">Triggers</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { agents as agentsData } from '@/data/agents.js';

defineEmits(['close']);

// Filter agents with workflows
const agents = computed(() => {
  return agentsData
    .filter(a => a.workflows && a.workflows.length > 0)
    .map(a => ({
      id: a.id,
      name: a.name,
      avatar: a.avatar,
      color: a.color,
      workflows: a.workflows
    }));
});

// All workflows with agent info
const allWorkflows = computed(() => {
  const wfs = [];
  agents.value.forEach(agent => {
    agent.workflows.forEach(wf => {
      wfs.push({
        ...wf,
        agentId: agent.id,
        agentName: agent.name,
        agentAvatar: agent.avatar,
        agentColor: agent.color
      });
    });
  });
  return wfs;
});

const totalWorkflows = computed(() => allWorkflows.value.length);
const activeWorkflows = computed(() => allWorkflows.value.filter(w => w.status === 'active').length);
const standbyWorkflows = computed(() => allWorkflows.value.filter(w => w.status === 'standby').length);
const uniqueTriggers = computed(() => new Set(allWorkflows.value.map(w => w.trigger)).size);

// Selection state
const selectedAgent = ref(null);
const expandedWorkflow = ref(null);

const filteredWorkflows = computed(() => {
  if (!selectedAgent.value) return allWorkflows.value;
  return allWorkflows.value.filter(w => w.agentId === selectedAgent.value);
});

function selectAgent(agentId) {
  selectedAgent.value = selectedAgent.value === agentId ? null : agentId;
  expandedWorkflow.value = null;
}

function toggleWorkflow(workflowId) {
  expandedWorkflow.value = expandedWorkflow.value === workflowId ? null : workflowId;
}
</script>

<style scoped>
.workflow-visualizer {
  position: fixed;
  inset: 5%;
  background: rgba(0, 0, 0, 0.95);
  border: 1px solid rgba(0, 255, 0, 0.3);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  z-index: 1000;
  backdrop-filter: blur(10px);
}

/* Header */
.wf-header {
  padding: 1.5rem 2rem;
  border-bottom: 1px solid rgba(0, 255, 0, 0.2);
  position: relative;
}

.wf-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: 1px solid rgba(0, 255, 0, 0.3);
  color: #00ff00;
  width: 32px;
  height: 32px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.2s;
}

.wf-close:hover {
  background: rgba(0, 255, 0, 0.2);
}

.wf-header h2 {
  font-family: 'JetBrains Mono', monospace;
  font-size: 1.25rem;
  color: #00ff00;
  margin: 0;
}

.wf-subtitle {
  font-size: 0.8rem;
  color: rgba(0, 255, 0, 0.6);
  margin: 0.25rem 0 0;
}

/* Filters */
.wf-filters {
  padding: 1rem 2rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  border-bottom: 1px solid rgba(0, 255, 0, 0.1);
}

.agent-chip {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.4rem 0.75rem;
  background: rgba(0, 255, 0, 0.05);
  border: 1px solid rgba(0, 255, 0, 0.2);
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.2s;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.7);
}

.agent-chip:hover {
  background: rgba(0, 255, 0, 0.1);
  border-color: rgba(0, 255, 0, 0.4);
}

.agent-chip.active {
  background: rgba(0, 255, 0, 0.2);
  border-color: #00ff00;
  color: #00ff00;
}

.chip-icon {
  font-size: 1rem;
}

.chip-count {
  background: rgba(0, 255, 0, 0.2);
  padding: 0.1rem 0.4rem;
  border-radius: 10px;
  font-size: 0.65rem;
}

/* Content */
.wf-content {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem 2rem;
}

.wf-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1rem;
}

/* Workflow Card */
.workflow-card {
  background: rgba(0, 255, 0, 0.03);
  border: 1px solid rgba(0, 255, 0, 0.15);
  border-radius: 6px;
  padding: 1rem;
  cursor: pointer;
  transition: all 0.3s;
}

.workflow-card:hover {
  border-color: rgba(0, 255, 0, 0.4);
  background: rgba(0, 255, 0, 0.05);
}

.workflow-card.expanded {
  border-color: #00ff00;
  background: rgba(0, 255, 0, 0.08);
}

.wf-card-header {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
}

.wf-status {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-top: 0.4rem;
  flex-shrink: 0;
}

.wf-status.active {
  background: #00ff00;
  box-shadow: 0 0 8px #00ff00;
}

.wf-status.standby {
  background: #ff9900;
}

.wf-status.disabled {
  background: #666;
}

.wf-info {
  flex: 1;
  min-width: 0;
}

.wf-info h3 {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.85rem;
  color: #fff;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.wf-agent {
  font-size: 0.7rem;
  color: rgba(0, 255, 0, 0.6);
}

.wf-capability {
  font-size: 0.65rem;
  padding: 0.2rem 0.5rem;
  background: rgba(0, 255, 0, 0.1);
  border: 1px solid rgba(0, 255, 0, 0.2);
  border-radius: 3px;
  color: #00ff00;
  white-space: nowrap;
}

/* Card Body (Expanded) */
.wf-card-body {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(0, 255, 0, 0.1);
}

.wf-desc {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.5;
  margin: 0 0 1rem;
}

.wf-meta {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 1rem;
}

.meta-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.meta-label {
  font-size: 0.65rem;
  color: rgba(0, 255, 0, 0.5);
}

.meta-value {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.75rem;
  color: #fff;
}

/* Flow Visualization */
.wf-flow {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.25rem;
  padding: 0.75rem;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 4px;
}

.flow-node {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.node-name {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.7rem;
  padding: 0.25rem 0.5rem;
  background: rgba(0, 255, 0, 0.1);
  border: 1px solid rgba(0, 255, 0, 0.3);
  border-radius: 3px;
  color: #00ff00;
}

.node-arrow {
  color: rgba(0, 255, 0, 0.4);
  font-size: 0.8rem;
}

/* Footer Stats */
.wf-footer {
  padding: 1rem 2rem;
  border-top: 1px solid rgba(0, 255, 0, 0.2);
  display: flex;
  justify-content: center;
  gap: 3rem;
}

.stat {
  text-align: center;
}

.stat-value {
  font-family: 'JetBrains Mono', monospace;
  font-size: 1.5rem;
  color: #00ff00;
  display: block;
}

.stat-label {
  font-size: 0.7rem;
  color: rgba(0, 255, 0, 0.5);
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

/* Animations */
.wf-list-enter-active,
.wf-list-leave-active {
  transition: all 0.3s ease;
}

.wf-list-enter-from,
.wf-list-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

/* Scrollbar */
.wf-content::-webkit-scrollbar {
  width: 6px;
}

.wf-content::-webkit-scrollbar-track {
  background: rgba(0, 255, 0, 0.05);
}

.wf-content::-webkit-scrollbar-thumb {
  background: rgba(0, 255, 0, 0.3);
  border-radius: 3px;
}

/* Responsive */
@media (max-width: 768px) {
  .workflow-visualizer {
    inset: 0;
    border-radius: 0;
  }
  
  .wf-grid {
    grid-template-columns: 1fr;
  }
  
  .wf-footer {
    gap: 1.5rem;
  }
}
</style>
