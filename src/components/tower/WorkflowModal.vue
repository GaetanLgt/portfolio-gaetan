<template>
  <Transition name="modal">
    <div class="modal-overlay" @click.self="$emit('close')">
      <div class="modal-container">
        <button class="modal-close" @click="$emit('close')">✕</button>
        
        <!-- Header -->
        <div class="modal-header" :style="{ borderColor: workflow.agentColor }">
          <div class="modal-agent">
            <span class="agent-avatar">{{ agent?.avatar }}</span>
            <div class="agent-info">
              <span class="agent-name" :style="{ color: workflow.agentColor }">{{ agent?.name }}</span>
              <span class="agent-role">{{ agent?.role }}</span>
            </div>
          </div>
          <span class="modal-status" :class="workflow.status">{{ workflow.status }}</span>
        </div>

        <!-- Title & Description -->
        <h3 class="modal-title">{{ workflow.name }}</h3>
        <p class="modal-desc">{{ workflow.description }}</p>

        <!-- Info Grid -->
        <div class="modal-info">
          <div class="info-item">
            <span class="info-icon">⚡</span>
            <div class="info-content">
              <span class="info-label">Trigger</span>
              <span class="info-value">{{ workflow.trigger }}</span>
            </div>
          </div>
          <div class="info-item">
            <span class="info-icon">🕐</span>
            <div class="info-content">
              <span class="info-label">Fréquence</span>
              <span class="info-value">{{ workflow.frequency }}</span>
            </div>
          </div>
          <div class="info-item">
            <span class="info-icon">🎯</span>
            <div class="info-content">
              <span class="info-label">Capability</span>
              <span class="info-value">{{ workflow.capability }}</span>
            </div>
          </div>
        </div>

        <!-- Pipeline Visualization -->
        <div class="modal-pipeline">
          <h4>Pipeline de traitement</h4>
          <div class="pipeline-flow">
            <div 
              v-for="(node, i) in workflow.nodes" 
              :key="i"
              class="flow-step"
            >
              <div class="step-node" :style="{ background: workflow.agentColor + '20', borderColor: workflow.agentColor }">
                <span class="node-number">{{ i + 1 }}</span>
              </div>
              <span class="step-name">{{ node }}</span>
              <div class="step-arrow" v-if="i < workflow.nodes.length - 1">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
            </div>
          </div>
        </div>

        <!-- Technical Details -->
        <div class="modal-tech">
          <div class="tech-item">
            <span class="tech-label">ID Workflow</span>
            <code class="tech-value">{{ workflow.id }}</code>
          </div>
          <div class="tech-item">
            <span class="tech-label">Agent ID</span>
            <code class="tech-value">{{ workflow.agentId }}</code>
          </div>
        </div>

        <!-- CTA -->
        <router-link 
          v-if="agent"
          :to="`/agents/${agent.id}`" 
          class="modal-cta"
          :style="{ background: workflow.agentColor }"
        >
          Voir le profil de {{ agent.name }} →
        </router-link>
      </div>
    </div>
  </Transition>
</template>

<script setup>
defineProps({
  workflow: { type: Object, required: true },
  agent: { type: Object, default: null }
});

defineEmits(['close']);
</script>

<style scoped>
.modal-overlay { position: fixed; inset: 0; z-index: 300; background: rgba(0,0,0,0.85); backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; padding: 2rem; }

.modal-container { position: relative; width: 100%; max-width: 650px; max-height: 90vh; overflow-y: auto; background: linear-gradient(135deg, rgba(20,25,40,0.98), rgba(30,35,50,0.98)); border: 1px solid rgba(255,255,255,0.1); border-radius: 1.5rem; padding: 2rem; }

.modal-close { position: absolute; top: 1rem; right: 1rem; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; background: rgba(255,255,255,0.05); border: none; border-radius: 50%; color: #666; font-size: 1.25rem; cursor: pointer; transition: all 0.3s; }
.modal-close:hover { background: rgba(255,255,255,0.1); color: #fff; transform: rotate(90deg); }

.modal-header { display: flex; justify-content: space-between; align-items: center; padding-bottom: 1rem; border-bottom: 2px solid; margin-bottom: 1rem; }

.modal-agent { display: flex; align-items: center; gap: 0.75rem; }
.agent-avatar { font-size: 2.5rem; }
.agent-info { display: flex; flex-direction: column; }
.agent-name { font-size: 1rem; font-weight: 600; }
.agent-role { font-size: 0.75rem; color: #888; }

.modal-status { font-size: 0.7rem; padding: 0.3rem 0.75rem; border-radius: 2rem; text-transform: uppercase; font-weight: 600; }
.modal-status.active { background: rgba(16,185,129,0.15); color: #10B981; }
.modal-status.standby { background: rgba(245,158,11,0.15); color: #F59E0B; }

.modal-title { font-size: 1.5rem; font-weight: 700; color: #fff; margin-bottom: 0.5rem; }
.modal-desc { font-size: 0.95rem; color: #aaa; line-height: 1.6; margin-bottom: 1.5rem; }

.modal-info { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-bottom: 1.5rem; }
.info-item { display: flex; align-items: flex-start; gap: 0.75rem; padding: 0.75rem; background: rgba(255,255,255,0.02); border-radius: 0.5rem; }
.info-icon { font-size: 1.25rem; }
.info-content { display: flex; flex-direction: column; }
.info-label { font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.05em; color: #666; margin-bottom: 0.1rem; }
.info-value { font-size: 0.85rem; color: #fff; }

.modal-pipeline { padding: 1.25rem; background: rgba(255,255,255,0.02); border-radius: 0.75rem; margin-bottom: 1.5rem; }
.modal-pipeline h4 { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; color: #666; margin-bottom: 1rem; }

.pipeline-flow { display: flex; flex-wrap: wrap; align-items: center; gap: 0.5rem; }
.flow-step { display: flex; align-items: center; gap: 0.5rem; }
.step-node { width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; border: 2px solid; border-radius: 50%; }
.node-number { font-family: 'JetBrains Mono', monospace; font-size: 0.7rem; font-weight: 600; }
.step-name { font-size: 0.8rem; color: #aaa; padding: 0.3rem 0.6rem; background: rgba(255,255,255,0.03); border-radius: 4px; }
.step-arrow { color: #444; display: flex; align-items: center; }

.modal-tech { display: flex; gap: 1rem; margin-bottom: 1.5rem; }
.tech-item { flex: 1; }
.tech-label { display: block; font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.05em; color: #666; margin-bottom: 0.25rem; }
.tech-value { font-family: 'JetBrains Mono', monospace; font-size: 0.75rem; color: #888; background: rgba(0,0,0,0.3); padding: 0.3rem 0.5rem; border-radius: 4px; }

.modal-cta { display: block; width: 100%; padding: 0.85rem; text-align: center; color: #000; font-size: 0.9rem; font-weight: 600; text-decoration: none; border-radius: 0.5rem; transition: all 0.3s; }
.modal-cta:hover { transform: translateY(-2px); box-shadow: 0 10px 25px rgba(0,0,0,0.3); }

/* Transitions */
.modal-enter-active, .modal-leave-active { transition: all 0.3s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
.modal-enter-from .modal-container, .modal-leave-to .modal-container { transform: scale(0.95) translateY(20px); }

@media (max-width: 600px) {
  .modal-container { padding: 1.5rem; }
  .modal-info { grid-template-columns: 1fr; }
  .modal-header { flex-direction: column; align-items: flex-start; gap: 1rem; }
}
</style>
