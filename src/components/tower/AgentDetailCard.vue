<template>
  <div class="agent-detail">
    <button class="detail-close" @click="$emit('close')" aria-label="Fermer">✕</button>
    
    <!-- Header -->
    <div class="agent-header">
      <div class="agent-avatar" :style="{ borderColor: agent.color, boxShadow: `0 0 30px ${agent.color}33` }">
        <span class="avatar-emoji">{{ agent.avatar }}</span>
        <div class="avatar-status" :class="agent.status"></div>
      </div>
      <div class="agent-identity">
        <h3 class="agent-name" :style="{ color: agent.color }">{{ agent.name }}</h3>
        <span class="agent-fullname">{{ agent.fullName }}</span>
        <div class="agent-badges">
          <span class="badge badge--codename">{{ agent.codename }}</span>
          <span class="badge badge--zone">{{ agent.zone }}</span>
        </div>
      </div>
    </div>

    <!-- Role -->
    <div class="agent-role" :style="{ background: agent.color + '15', borderColor: agent.color + '40' }">
      <span class="role-icon">💼</span>
      <span class="role-text">{{ agent.role }}</span>
    </div>

    <!-- Description -->
    <p class="agent-description">{{ agent.description }}</p>

    <!-- Capabilities -->
    <div class="section">
      <h4 class="section-title"><span class="title-icon">⚡</span> Capacités</h4>
      <div class="capabilities-list">
        <div v-for="cap in agent.capabilities" :key="cap.name" class="capability">
          <div class="cap-header">
            <span class="cap-name">{{ cap.name }}</span>
            <span class="cap-level" :style="{ color: agent.color }">{{ cap.level }}%</span>
          </div>
          <div class="cap-bar">
            <div class="cap-fill" :style="{ width: cap.level + '%', background: agent.color }"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Tools -->
    <div class="section">
      <h4 class="section-title"><span class="title-icon">🛠️</span> Outils</h4>
      <div class="tools-grid">
        <div v-for="tool in agent.tools" :key="tool.name" class="tool-chip" :class="tool.status">
          <span class="tool-icon">{{ tool.icon }}</span>
          <span class="tool-name">{{ tool.name }}</span>
        </div>
      </div>
    </div>

    <!-- Workflows -->
    <div class="section">
      <h4 class="section-title"><span class="title-icon">🔄</span> Workflows ({{ agent.workflows?.length || 0 }})</h4>
      <div class="workflows-list">
        <button v-for="wf in (agent.workflows || []).slice(0, 4)" :key="wf.id" class="workflow-item" @click="$emit('showWorkflow', wf)">
          <span class="wf-status" :class="wf.status"></span>
          <div class="wf-info">
            <span class="wf-name">{{ wf.name }}</span>
            <span class="wf-trigger">{{ wf.trigger }}</span>
          </div>
          <span class="wf-freq">{{ wf.frequency }}</span>
        </button>
      </div>
      <button v-if="agent.workflows?.length > 4" class="see-all-btn" @click="$emit('goToWorkflows', agent.id)">
        Voir les {{ agent.workflows.length }} workflows →
      </button>
    </div>

    <!-- Metrics -->
    <div class="metrics-grid">
      <div class="metric-card" v-if="agent.metrics?.tasksPerDay">
        <span class="metric-value">{{ agent.metrics.tasksPerDay }}</span>
        <span class="metric-label">Tasks/jour</span>
      </div>
      <div class="metric-card" v-if="agent.metrics?.uptime">
        <span class="metric-value">{{ agent.metrics.uptime }}</span>
        <span class="metric-label">Uptime</span>
      </div>
    </div>

    <!-- CTA -->
    <router-link :to="`/agents/${agent.id}`" class="agent-cta" :style="{ background: agent.color }">
      Voir profil complet →
    </router-link>
  </div>
</template>

<script setup>
defineProps({ agent: { type: Object, required: true } });
defineEmits(['close', 'showWorkflow', 'goToWorkflows']);
</script>

<style scoped>
.agent-detail { position: relative; }
.detail-close { position: absolute; top: 0; right: 0; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; background: rgba(255,255,255,0.05); border: none; border-radius: 50%; color: #666; cursor: pointer; transition: all 0.3s; }
.detail-close:hover { background: rgba(255,255,255,0.1); color: #fff; transform: rotate(90deg); }

.agent-header { display: flex; gap: 1rem; margin-bottom: 1.25rem; }
.agent-avatar { position: relative; width: 70px; height: 70px; display: flex; align-items: center; justify-content: center; background: rgba(255,255,255,0.03); border: 2px solid; border-radius: 50%; flex-shrink: 0; }
.avatar-emoji { font-size: 2.25rem; }
.avatar-status { position: absolute; bottom: 2px; right: 2px; width: 14px; height: 14px; background: #10B981; border: 2px solid #1a1a2e; border-radius: 50%; }
.avatar-status.standby { background: #F59E0B; }

.agent-identity { flex: 1; }
.agent-name { font-size: 1.1rem; font-weight: 700; margin-bottom: 0.2rem; }
.agent-fullname { display: block; font-size: 0.65rem; color: #666; margin-bottom: 0.5rem; }
.agent-badges { display: flex; gap: 0.5rem; }
.badge { font-family: 'JetBrains Mono', monospace; font-size: 0.6rem; padding: 0.2rem 0.5rem; border-radius: 4px; text-transform: uppercase; }
.badge--codename { background: rgba(255,255,255,0.05); color: #888; }
.badge--zone { background: rgba(16,185,129,0.1); color: #10B981; }

.agent-role { display: flex; align-items: center; gap: 0.5rem; padding: 0.6rem 1rem; border: 1px solid; border-radius: 0.5rem; margin-bottom: 1rem; }
.role-icon { font-size: 1rem; }
.role-text { font-size: 0.85rem; font-weight: 500; }

.agent-description { font-size: 0.85rem; color: #aaa; line-height: 1.6; margin-bottom: 1rem; }

.section { margin-bottom: 1.25rem; }
.section-title { display: flex; align-items: center; gap: 0.5rem; font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.1em; color: #666; margin-bottom: 0.75rem; padding-bottom: 0.5rem; border-bottom: 1px solid rgba(255,255,255,0.05); }
.title-icon { font-size: 0.9rem; }

.capabilities-list { display: flex; flex-direction: column; gap: 0.6rem; }
.capability { display: flex; flex-direction: column; gap: 0.3rem; }
.cap-header { display: flex; justify-content: space-between; }
.cap-name { font-size: 0.75rem; color: #aaa; }
.cap-level { font-family: 'JetBrains Mono', monospace; font-size: 0.7rem; }
.cap-bar { height: 4px; background: rgba(255,255,255,0.1); border-radius: 2px; overflow: hidden; }
.cap-fill { height: 100%; border-radius: 2px; transition: width 0.5s ease; }

.tools-grid { display: flex; flex-wrap: wrap; gap: 0.5rem; }
.tool-chip { display: flex; align-items: center; gap: 0.4rem; padding: 0.4rem 0.75rem; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); border-radius: 0.5rem; }
.tool-chip.active { border-color: #10B981; }
.tool-icon { font-size: 0.9rem; }
.tool-name { font-size: 0.75rem; color: #aaa; }

.workflows-list { display: flex; flex-direction: column; gap: 0.5rem; }
.workflow-item { display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 0.75rem; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); border-radius: 0.5rem; cursor: pointer; transition: all 0.3s; text-align: left; width: 100%; }
.workflow-item:hover { background: rgba(255,255,255,0.05); border-color: rgba(255,255,255,0.1); }
.wf-status { width: 6px; height: 6px; border-radius: 50%; background: #10B981; flex-shrink: 0; }
.wf-status.standby { background: #F59E0B; }
.wf-info { flex: 1; min-width: 0; }
.wf-name { display: block; font-size: 0.8rem; color: #ddd; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.wf-trigger { font-size: 0.65rem; color: #666; }
.wf-freq { font-size: 0.6rem; color: #555; white-space: nowrap; }

.see-all-btn { width: 100%; padding: 0.5rem; background: transparent; border: 1px dashed rgba(255,255,255,0.1); border-radius: 0.5rem; color: #888; font-size: 0.75rem; cursor: pointer; transition: all 0.3s; }
.see-all-btn:hover { border-color: #10B981; color: #10B981; }

.metrics-grid { display: flex; gap: 1rem; margin-bottom: 1.25rem; }
.metric-card { flex: 1; padding: 0.75rem; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); border-radius: 0.5rem; text-align: center; }
.metric-value { display: block; font-family: 'JetBrains Mono', monospace; font-size: 1.1rem; font-weight: 700; color: #fff; }
.metric-label { font-size: 0.6rem; color: #666; }

.agent-cta { display: block; width: 100%; padding: 0.75rem; text-align: center; color: #000; font-size: 0.85rem; font-weight: 600; text-decoration: none; border-radius: 0.5rem; transition: all 0.3s; }
.agent-cta:hover { transform: translateY(-2px); box-shadow: 0 10px 25px rgba(0,0,0,0.3); }
</style>
