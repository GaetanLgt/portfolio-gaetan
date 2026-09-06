<template>
  <div class="gl-tower-interactive" :class="{ 'tour-active': tourActive }">
    <!-- Skip Link -->
    <a href="#main-content" class="skip-link">Aller au contenu principal</a>

    <!-- Ambient Background -->
    <TowerBackground ref="bgRef" />

    <!-- Navigation Header -->
    <TowerHeader 
      :view-mode="viewMode"
      :tour-active="tourActive"
      @change-view="viewMode = $event"
      @start-tour="startTour"
      @stop-tour="stopTour"
    />

    <!-- Tour Guide -->
    <TourGuide 
      v-if="tourActive"
      :steps="tourSteps"
      :current-step="currentTourStep"
      @next="nextTourStep"
      @prev="prevTourStep"
      @close="stopTour"
    />

    <!-- Main Content -->
    <main id="main-content" class="tower-main">
      <!-- VIEW: Tower -->
      <TowerView 
        v-show="viewMode === 'tower'"
        :agents="agents"
        :tower-floors="towerFloors"
        :selected-floor="selectedFloor"
        :highlighted-floor="highlightedFloor"
        @select-floor="selectFloor"
        @highlight-floor="highlightedFloor = $event"
        @show-workflow="showWorkflowDetail"
        @go-to-workflows="goToWorkflows"
      />

      <!-- VIEW: Workflows -->
      <WorkflowsView 
        v-show="viewMode === 'workflow'"
        :agents="agents"
        :workflows="allWorkflows"
        :filter-agent="workflowFilterAgent"
        @update-filter="workflowFilterAgent = $event"
        @show-detail="showWorkflowDetail"
      />

      <!-- VIEW: Production Pipeline -->
      <ProductionView 
        v-show="viewMode === 'production'"
        :pipeline-step="pipelineStep"
        :pipeline-running="pipelineRunning"
        @reset="resetPipeline"
        @play="playPipeline"
        @complete="completePipeline"
      />
    </main>

    <!-- Workflow Detail Modal -->
    <WorkflowModal 
      v-if="selectedWorkflow"
      :workflow="selectedWorkflow"
      :agent="getAgentById(selectedWorkflow.agentId)"
      @close="selectedWorkflow = null"
    />

    <!-- Footer -->
    <TowerFooter :agents-count="agents.filter(a => !a.isLobby).length" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { agents, getAllWorkflows, getAgentById } from '@/data/agents';

// Components
import TowerBackground from '@/components/tower/TowerBackground.vue';
import TowerHeader from '@/components/tower/TowerHeader.vue';
import TowerFooter from '@/components/tower/TowerFooter.vue';
import TourGuide from '@/components/tower/TourGuide.vue';
import TowerView from '@/components/tower/TowerView.vue';
import WorkflowsView from '@/components/tower/WorkflowsView.vue';
import ProductionView from '@/components/tower/ProductionView.vue';
import WorkflowModal from '@/components/tower/WorkflowModal.vue';

// View Mode
const viewMode = ref('tower');

// Tower State
const selectedFloor = ref(null);
const highlightedFloor = ref(null);
const bgRef = ref(null);

// Tour State
const tourActive = ref(false);
const currentTourStep = ref(0);

// Workflow State
const workflowFilterAgent = ref('');
const selectedWorkflow = ref(null);

// Production Pipeline State
const pipelineStep = ref(-1);
const pipelineRunning = ref(false);
let pipelineInterval = null;

// Tower Floors Data
const towerFloors = computed(() => {
  const floors = [];
  
  // L'Équipage : les 6 Lois (Penthouse → étages bas)
  const mainAgents = agents.filter(a => !a.isLobby).sort((a, b) => b.floor - a.floor);
  mainAgents.forEach(agent => {
    floors.push({
      id: agent.id,
      name: agent.name,
      shortName: agent.roman || agent.name.split('.')[0],
      role: agent.role,
      icon: agent.avatar,
      color: agent.color,
      colorRgb: agent.colorRgb,
      levelDisplay: agent.level === 'Penthouse' ? 'PH' : agent.floor,
      status: agent.status,
      height: agent.level === 'Penthouse' ? '100px' : '80px',
      windows: agent.level === 'Penthouse' ? 8 : 5,
      zone: 'main'
    });
  });

  // Lobby
  const lobby = agents.find(a => a.isLobby);
  if (lobby) {
    floors.push({
      id: lobby.id,
      name: 'LOBBY',
      shortName: 'RDC',
      role: 'Accueil Visiteurs',
      icon: '🚪',
      color: '#64748B',
      colorRgb: '100, 116, 139',
      levelDisplay: '0',
      status: 'active',
      height: '60px',
      windows: 6,
      isLobby: true,
      zone: 'main'
    });
  }

  return floors;
});

// All Workflows
const allWorkflows = computed(() => getAllWorkflows());

// Tour Steps
const tourSteps = [
  {
    title: 'Bienvenue dans GL Tower !',
    description: 'Je suis votre guide. GL Tower est le QG de l\'Équipage : six Lois qui travaillent ensemble pour créer vos projets web.',
    target: null,
    icon: '🤖'
  },
  {
    title: 'L\'Équipage — Six Lois',
    description: 'Chaque Loi agit selon un principe : Wa orchestre, Makoto vérifie, Bi embellit, Jitsu réalise, Dou surveille, Watashi se souvient. Trinity, la Grande Architecte, veille au-dessus.',
    target: 'main',
    icon: '🏢'
  },
  {
    title: 'Les Lois',
    description: 'Wa (Harmonie), Makoto (Sincérité), Bi (Beauté), Jitsu (Réalisation), Dou (Mouvement) et Watashi (Intériorité) couvrent chaque domaine critique, du frontend au RAG sur le Vault.',
    target: 'main',
    icon: '⚖️'
  },
  {
    title: 'Les Workflows',
    description: 'Chaque Loi possède des workflows automatisés. Cliquez sur "Workflows" dans le menu pour les explorer.',
    target: 'workflow',
    icon: '🔄'
  },
  {
    title: 'La Production',
    description: 'L\'onglet "Production" montre comment votre site est produit étape par étape, de la réception de votre demande jusqu\'à la mise en ligne et le support.',
    target: 'production',
    icon: '🎬'
  },
  {
    title: 'À vous de jouer !',
    description: 'Explorez la tour en cliquant sur les étages. Chaque agent a une fiche détaillée avec ses capacités, outils et workflows. Bonne visite !',
    target: null,
    icon: '🚀'
  }
];

// Methods
const selectFloor = (floorId) => {
  if (floorId.startsWith('sep-')) return;
  selectedFloor.value = selectedFloor.value === floorId ? null : floorId;
};

const showWorkflowDetail = (workflow) => {
  selectedWorkflow.value = workflow;
};

const goToWorkflows = (agentId) => {
  viewMode.value = 'workflow';
  workflowFilterAgent.value = agentId;
};

// Tour Methods
const startTour = () => {
  tourActive.value = true;
  currentTourStep.value = 0;
};

const stopTour = () => {
  tourActive.value = false;
  currentTourStep.value = 0;
};

const nextTourStep = () => {
  if (currentTourStep.value < tourSteps.length - 1) {
    currentTourStep.value++;
    
    // Auto-navigate based on step
    const step = tourSteps[currentTourStep.value];
    if (step.target === 'workflow') viewMode.value = 'workflow';
    else if (step.target === 'production') viewMode.value = 'production';
    else if (step.target) viewMode.value = 'tower';
  }
};

const prevTourStep = () => {
  if (currentTourStep.value > 0) {
    currentTourStep.value--;
  }
};

// Pipeline Methods
const resetPipeline = () => {
  pipelineStep.value = -1;
  pipelineRunning.value = false;
  if (pipelineInterval) clearInterval(pipelineInterval);
};

const playPipeline = () => {
  if (pipelineRunning.value) return;
  pipelineRunning.value = true;
  pipelineStep.value = -1;
  
  pipelineInterval = setInterval(() => {
    if (pipelineStep.value < 9) {
      pipelineStep.value++;
    } else {
      pipelineRunning.value = false;
      clearInterval(pipelineInterval);
    }
  }, 800);
};

const completePipeline = () => {
  pipelineRunning.value = false;
  if (pipelineInterval) clearInterval(pipelineInterval);
  pipelineStep.value = 9;
};

// Lifecycle
onMounted(() => {
  // Could init animations here
});

onUnmounted(() => {
  if (pipelineInterval) clearInterval(pipelineInterval);
});

// Watch view mode changes
watch(viewMode, () => {
  if (viewMode.value !== 'tower') {
    selectedFloor.value = null;
  }
});
</script>

<style scoped>
.gl-tower-interactive {
  min-height: 100vh;
  background: var(--bg-base, #0a0a14);
  color: var(--text-main, #e5e5e5);
  position: relative;
  overflow-x: hidden;
}

/* Skip Link */
.skip-link {
  position: absolute;
  top: -100px;
  left: 50%;
  transform: translateX(-50%);
  padding: 1rem 2rem;
  background: var(--primary, #10B981);
  color: #000;
  font-weight: 600;
  text-decoration: none;
  border-radius: 0 0 0.5rem 0.5rem;
  z-index: 9999;
  transition: top 0.3s ease;
}

.skip-link:focus {
  top: 0;
}

/* Main Content */
.tower-main {
  position: relative;
  z-index: 1;
  padding-top: 80px;
  min-height: calc(100vh - 80px);
}

/* Tour Active State */
.gl-tower-interactive.tour-active::before {
  content: '';
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.3);
  z-index: 150;
  pointer-events: none;
}
</style>
