<template>
  <div class="holistic-map">
    <!-- Matrix ambient effect -->
    <div class="map-ambient" aria-hidden="true"></div>
    
    <!-- Header -->
    <header class="map-header">
      <div class="map-badge">
        <span class="badge-dot"></span>
        <span>CARTE HOLISTIQUE</span>
      </div>
      
      <h1 class="map-title">
        <span class="title-gradient">NEO / GL TOWER</span>
      </h1>
      
      <p class="map-subtitle">
        Écosystème GL Digital Lab : 6 Lois IA (équipage ARKADIA) • Infrastructure • Services • Ambition 2026
      </p>
    </header>
    
    <!-- Filters -->
    <div class="map-filters">
      <button 
        v-for="f in filters" 
        :key="f.id"
        class="filter-btn"
        :class="{ 'filter-btn--active': filter === f.id }"
        :style="filter === f.id ? { background: f.color, borderColor: f.color } : {}"
        @click="filter = f.id"
      >
        {{ f.label }}
      </button>
    </div>
    
    <!-- SVG Map -->
    <div class="map-container">
      <svg 
        ref="svgRef"
        viewBox="0 0 1000 800" 
        class="map-svg"
        @mouseleave="hoveredNode = null"
      >
        <!-- Defs: Filters & Gradients -->
        <defs>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          
          <filter id="glow-strong" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          
          <!-- Tower gradient -->
          <linearGradient id="towerGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#FBBF24"/>
            <stop offset="100%" stop-color="#B45309"/>
          </linearGradient>
        </defs>
        
        <!-- Tower Background Shape -->
        <g class="tower-bg" opacity="0.1">
          <path 
            d="M500,120 L550,700 L450,700 Z" 
            fill="url(#towerGradient)"
            filter="url(#glow)"
          />
        </g>
        
        <!-- Links -->
        <g class="links-layer">
          <template v-for="(link, i) in filteredLinks" :key="'link-' + i">
            <line
              :x1="getNodePosition(link.source).x"
              :y1="getNodePosition(link.source).y"
              :x2="getNodePosition(link.target).x"
              :y2="getNodePosition(link.target).y"
              class="map-link"
              :class="{ 
                'map-link--active': isLinkConnected(link),
                'map-link--dimmed': hoveredNode && !isLinkConnected(link),
                'map-link--agent': isAgentLink(link)
              }"
              :stroke="getLinkColor(link)"
            />
            
            <!-- Animated particle on hover -->
            <circle 
              v-if="hoveredNode && isLinkConnected(link)"
              r="3" 
              :fill="getLinkColor(link)" 
              filter="url(#glow)"
              class="link-particle"
            >
              <animateMotion
                dur="1.5s"
                repeatCount="indefinite"
                :path="`M${getNodePosition(link.source).x},${getNodePosition(link.source).y} L${getNodePosition(link.target).x},${getNodePosition(link.target).y}`"
              />
            </circle>
          </template>
        </g>
        
        <!-- Nodes -->
        <g class="nodes-layer">
          <g
            v-for="node in filteredNodes"
            :key="node.id"
            :transform="`translate(${node.x}, ${node.y})`"
            class="map-node"
            :class="{ 
              'map-node--dimmed': hoveredNode && !isNodeConnected(node.id),
              'map-node--selected': selectedNode?.id === node.id
            }"
            @click="toggleNode(node)"
            @mouseenter="hoveredNode = node.id"
            @mouseleave="hoveredNode = null"
          >
            <!-- Pulse ring on hover/select -->
            <circle
              v-if="hoveredNode === node.id || selectedNode?.id === node.id"
              :r="getNodeSize(node) + 8"
              fill="none"
              :stroke="getNodeColor(node)"
              stroke-width="2"
              stroke-opacity="0.5"
              filter="url(#glow-strong)"
              class="node-pulse"
            >
              <animate
                attributeName="r"
                :values="`${getNodeSize(node) + 5};${getNodeSize(node) + 12};${getNodeSize(node) + 5}`"
                dur="2s"
                repeatCount="indefinite"
              />
            </circle>
            
            <!-- Agent hexagon shape -->
            <polygon
              v-if="node.type === 'agent'"
              :points="getHexagonPoints(getNodeSize(node))"
              :fill="'rgba(10, 10, 10, 0.9)'"
              :stroke="getNodeColor(node)"
              stroke-width="2"
              :filter="hoveredNode === node.id ? 'url(#glow)' : 'none'"
              class="node-hexagon"
            />
            
            <!-- Main circle (non-agents) -->
            <circle
              v-else
              :r="getNodeSize(node)"
              :fill="node.level === 1 ? getNodeColor(node) : 'rgba(10, 10, 10, 0.9)'"
              :stroke="getNodeColor(node)"
              :stroke-width="node.level === 1 ? 3 : 2"
              :filter="hoveredNode === node.id ? 'url(#glow)' : 'none'"
              class="node-circle"
            />
            
            <!-- Inner decoration for identity/tower -->
            <template v-if="node.type === 'identity'">
              <circle :r="getNodeSize(node) - 12" fill="none" stroke="#0a0a0a" stroke-width="2" />
              <circle :r="getNodeSize(node) - 22" fill="#0a0a0a" />
            </template>
            
            <template v-if="node.type === 'tower'">
              <circle :r="getNodeSize(node) - 8" fill="none" stroke="#B45309" stroke-width="2" />
            </template>
            
            <!-- Icon for agents -->
            <text
              v-if="node.icon"
              text-anchor="middle"
              dominant-baseline="middle"
              :y="-2"
              font-size="16"
              class="node-icon"
            >
              {{ node.icon }}
            </text>
            
            <!-- Label -->
            <text
              text-anchor="middle"
              dominant-baseline="middle"
              :y="node.icon ? 12 : 0"
              :fill="node.level === 1 && node.type !== 'tower' ? '#0a0a0a' : getNodeColor(node)"
              :font-size="node.level === 1 ? 12 : node.level === 2 ? 8 : 7"
              font-weight="700"
              class="node-label"
            >
              {{ node.label }}
            </text>
            
            <!-- Type badge -->
            <text
              v-if="node.level <= 2 && !node.icon"
              :y="getNodeSize(node) + 14"
              text-anchor="middle"
              fill="#6B7280"
              font-size="6"
              class="node-type"
            >
              {{ typeLabels[node.type] }}
            </text>
            
            <!-- Level indicator for agents -->
            <text
              v-if="node.type === 'agent'"
              :y="getNodeSize(node) + 14"
              text-anchor="middle"
              :fill="getNodeColor(node)"
              font-size="6"
              class="node-level"
            >
              {{ node.towerLevel }}
            </text>
          </g>
        </g>
      </svg>
    </div>
    
    <!-- Legend -->
    <div class="map-legend">
      <div 
        v-for="(color, type) in legendTypes" 
        :key="type"
        class="legend-item"
      >
        <span 
          class="legend-dot" 
          :class="{ 'legend-dot--hex': type === 'agent' }"
          :style="{ background: color, boxShadow: `0 0 10px ${color}40` }"
        ></span>
        <span>{{ typeLabels[type] }}</span>
      </div>
    </div>
    
    <!-- Detail Panel -->
    <Transition name="slide-up">
      <div v-if="selectedNode" class="detail-panel" :style="{ borderTopColor: getNodeColor(selectedNode) }">
        <div class="detail-inner">
          <div class="detail-header">
            <div>
              <span 
                class="detail-badge"
                :style="{ 
                  background: `${getNodeColor(selectedNode)}20`,
                  borderColor: `${getNodeColor(selectedNode)}40`,
                  color: getNodeColor(selectedNode)
                }"
              >
                {{ selectedNode.icon ? selectedNode.icon + ' ' : '' }}{{ typeLabels[selectedNode.type] }}
              </span>
              <h3 class="detail-title" :style="{ color: getNodeColor(selectedNode) }">
                {{ selectedNode.fullLabel || selectedNode.label }}
              </h3>
              <p v-if="selectedNode.description" class="detail-desc">
                {{ selectedNode.description }}
              </p>
            </div>
            <button class="detail-close" @click="selectedNode = null">
              ✕ Fermer
            </button>
          </div>
          
          <div class="detail-connections">
            <span class="connections-label">Connexions:</span>
            <span 
              v-for="(conn, i) in getConnectedNodes(selectedNode.id)" 
              :key="i"
              class="connection-tag"
              :style="{ borderColor: `${typeColors[conn.type]}40`, color: typeColors[conn.type] }"
            >
              {{ conn.relation }} → {{ conn.label }}
            </span>
          </div>
          
          <!-- Tech stack for agents -->
          <div v-if="selectedNode.tech" class="detail-tech">
            <span class="tech-label">Stack:</span>
            <span v-for="t in selectedNode.tech" :key="t" class="tech-tag">{{ t }}</span>
          </div>
        </div>
      </div>
    </Transition>
    
    <!-- Back link -->
    <div class="map-back">
      <router-link to="/hub" class="back-link">
        ← Retour à GL Tower
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

// State
const filter = ref('all');
const hoveredNode = ref(null);
const selectedNode = ref(null);
const svgRef = ref(null);

// Type colors
const typeColors = {
  'identity': '#10B981',
  'tower': '#FBBF24',
  'agent': '#06B6D4',
  'business': '#10B981',
  'role': '#8B5CF6',
  'skill-group': '#A78BFA',
  'skill': '#C4B5FD',
  'project': '#EC4899',
  'service': '#F59E0B',
  'value': '#34D399',
  'story': '#6366F1',
  'milestone': '#9CA3AF',
};

// Agent-specific colors
// Couleurs des 6 Lois (équipage ARKADIA) — issues d'agents.js
const agentColors = {
  // Penthouse & Niveaux 2-6
  'wa': '#FBBF24',
  'makoto': '#EF4444',
  'bi': '#14B8A6',
  'jitsu': '#8B5CF6',
  'dou': '#F59E0B',
  'watashi': '#0EA5E9',
};

// Type labels
const typeLabels = {
  'identity': 'IDENTITÉ',
  'tower': 'QG',
  'agent': 'LOI',
  'business': 'BUSINESS',
  'role': 'RÔLE',
  'skill-group': 'STACK',
  'skill': 'TECH',
  'project': 'PROJET',
  'service': 'SERVICE',
  'value': 'VALEUR',
  'story': 'PARCOURS',
  'milestone': 'JALON',
};

// Legend (subset for display)
const legendTypes = {
  'identity': '#10B981',
  'tower': '#FBBF24',
  'agent': '#06B6D4',
  'project': '#EC4899',
  'service': '#F59E0B',
  'skill-group': '#A78BFA',
  'value': '#34D399',
};

// Filters
const filters = [
  { id: 'all', label: 'TOUS', color: '#10B981' },
  { id: 'agent', label: 'LES 6 LOIS', color: '#06B6D4' },
  { id: 'skill-group', label: 'STACKS', color: '#A78BFA' },
  { id: 'project', label: 'PROJETS', color: '#EC4899' },
  { id: 'service', label: 'SERVICES', color: '#F59E0B' },
  { id: 'value', label: 'VALEURS', color: '#34D399' },
];

// Nodes data
const nodes = ref([
  // ========================================
  // NIVEAU 1 - Centre (Neo + GL Tower)
  // ========================================
  { 
    id: 'neo', 
    label: 'NEO', 
    fullLabel: 'Gaëtan "Neo" LANGLET', 
    description: 'Développeur Full-Stack & Architecte IA. Fondateur GL Digital Lab.',
    type: 'identity', 
    level: 1, 
    x: 500, y: 200 
  },
  { 
    id: 'gltower', 
    label: 'GL TOWER', 
    fullLabel: 'GL TOWER - QG de l\'équipage ARKADIA',
    description: 'Centre de commandement. Infrastructure humaine augmentée par l\'équipage ARKADIA : 6 Lois souveraines.',
    type: 'tower', 
    level: 1, 
    x: 500, y: 380 
  },
  
  // ========================================
  // NIVEAU 2 - L'Équipage ARKADIA : 6 Lois
  // ========================================
  { 
    id: 'wa', 
    label: '和 Wa', 
    fullLabel: 'Wa — L\'Harmonie · Orchestration & Coordination',
    description: 'Orchestrer l\'équipage et coordonner les vaisseaux : routage des requêtes, synthèse, équilibrage des charges.',
    type: 'agent', 
    level: 2, 
    x: 500, y: 280,
    icon: '🎯',
    towerLevel: 'PENTHOUSE',
    tech: ['n8n', 'Redis', 'API Gateway'],
    agentId: 'wa'
  },
  { 
    id: 'makoto', 
    label: '誠 Makoto', 
    fullLabel: 'Makoto — La Sincérité · Sécurité, Audit & QA',
    description: 'Protéger l\'infrastructure et garantir la vérité du code : scans de vulnérabilités, audits, gestion des secrets, tests & QA.',
    type: 'agent', 
    level: 2, 
    x: 361, y: 300,
    icon: '🛡️',
    towerLevel: 'NIVEAU 6',
    tech: ['Trivy', 'Wazuh', 'Vault', 'PHPUnit', 'Playwright'],
    agentId: 'makoto'
  },
  { 
    id: 'bi', 
    label: '美 Bi', 
    fullLabel: 'Bi — La Beauté · Frontend, Design & 3D',
    description: 'Créer des interfaces et expériences d\'exception : Vue 3, Three.js, GSAP, design UI/UX.',
    type: 'agent', 
    level: 2, 
    x: 361, y: 460,
    icon: '💜',
    towerLevel: 'NIVEAU 5',
    tech: ['Vue 3', 'Three.js', 'GSAP', 'TypeScript', 'Figma'],
    agentId: 'bi'
  },
  { 
    id: 'jitsu', 
    label: '実 Jitsu', 
    fullLabel: 'Jitsu — La Réalisation · Backend, Build & Livraison',
    description: 'Concevoir les backends et livrer sans friction : Symfony, APIs, CI/CD, builds Docker, déploiements.',
    type: 'agent', 
    level: 2, 
    x: 500, y: 560,
    icon: '🚀',
    towerLevel: 'NIVEAU 4',
    tech: ['Symfony 8', 'PHP 8.3+', 'GitHub Actions', 'Docker', 'Vite'],
    agentId: 'jitsu'
  },
  { 
    id: 'dou', 
    label: '動 Dou', 
    fullLabel: 'Dou — Le Mouvement · Monitoring, Veille & Alertes',
    description: 'Visibilité totale et vigilance permanente : monitoring, détection d\'anomalies, alertes graduelles, veille technique.',
    type: 'agent', 
    level: 2, 
    x: 639, y: 460,
    icon: '📊',
    towerLevel: 'NIVEAU 3',
    tech: ['Prometheus', 'Grafana', 'Loki', 'n8n'],
    agentId: 'dou'
  },
  { 
    id: 'watashi', 
    label: '私 Watashi', 
    fullLabel: 'Watashi — L\'Intériorité · Mémoire, Données & RAG',
    description: 'Préserver la mémoire et rendre la connaissance accessible : données, indexation du Vault, RAG, support.',
    type: 'agent', 
    level: 2, 
    x: 639, y: 300,
    icon: '🗄️',
    towerLevel: 'NIVEAU 2',
    tech: ['PostgreSQL', 'ChromaDB', 'Ollama', 'OpenWebUI'],
    agentId: 'watashi'
  },
  
  // ========================================
  // NIVEAU 2 - Business & Projets
  // ========================================
  { 
    id: 'gllab', 
    label: 'GL DIGITAL LAB', 
    fullLabel: 'GL Digital Lab - Agence',
    description: 'Agence dev web & IA pour PME. Lancement 29/01/2026.',
    type: 'business', 
    level: 2, 
    x: 750, y: 180 
  },
  { 
    id: 'arkadia', 
    label: 'ARKADIA', 
    fullLabel: 'ARKADIA FRANCE (150+ joueurs)',
    description: 'Cluster ARK Survival Ascended. Case study infrastructure & community management.',
    type: 'project', 
    level: 2, 
    x: 250, y: 180 
  },
  
  // ========================================
  // NIVEAU 2 - Valeurs (autour de Neo)
  // ========================================
  { 
    id: 'souverainete', 
    label: 'SOUVERAINETÉ', 
    fullLabel: 'Souveraineté Numérique',
    description: 'Zéro dépendance Cloud US. IA locale. Données en France.',
    type: 'value', 
    level: 2, 
    x: 500, y: 80 
  },
  { 
    id: 'val_rgpd', 
    label: 'RGPD', 
    fullLabel: 'Conformité RGPD Native', 
    type: 'value', 
    level: 3, 
    x: 380, y: 60 
  },
  { 
    id: 'val_local', 
    label: 'HÉBERG. FR', 
    fullLabel: 'Hébergement 100% Français', 
    type: 'value', 
    level: 3, 
    x: 500, y: 30 
  },
  { 
    id: 'val_zerocloud', 
    label: 'ZÉRO CLOUD US', 
    fullLabel: 'Zéro Dépendance Cloud US', 
    type: 'value', 
    level: 3, 
    x: 620, y: 60 
  },
  
  // ========================================
  // NIVEAU 2 - Services GL Digital Lab
  // ========================================
  { 
    id: 'offer_perf', 
    label: 'PERFORMANCE', 
    fullLabel: 'Performance (8k€ - 15k€)',
    description: 'Audit Lighthouse, Core Web Vitals, optimisation SSR.',
    type: 'service', 
    level: 2, 
    x: 850, y: 120 
  },
  { 
    id: 'offer_factory', 
    label: 'DIGITAL FACTORY', 
    fullLabel: 'Digital Factory (15k€ - 30k€)',
    description: 'Développement sur-mesure Symfony + Vue.js.',
    type: 'service', 
    level: 2, 
    x: 900, y: 220 
  },
  { 
    id: 'offer_neural', 
    label: 'NEURAL OPS', 
    fullLabel: 'Neural Ops (12k€ - 25k€)',
    description: 'Intégration IA locale, workflows n8n, agents autonomes.',
    type: 'service', 
    level: 2, 
    x: 880, y: 320 
  },
  
  // ========================================
  // NIVEAU 2 - Stacks techniques
  // ========================================
  { 
    id: 'stack_backend', 
    label: 'BACKEND', 
    fullLabel: 'Stack Backend',
    type: 'skill-group', 
    level: 2, 
    x: 120, y: 300 
  },
  { 
    id: 'stack_frontend', 
    label: 'FRONTEND', 
    fullLabel: 'Stack Frontend',
    type: 'skill-group', 
    level: 2, 
    x: 150, y: 420 
  },
  { 
    id: 'stack_ia', 
    label: 'STACK IA', 
    fullLabel: 'Stack IA Locale',
    type: 'skill-group', 
    level: 2, 
    x: 180, y: 540 
  },
  { 
    id: 'stack_devops', 
    label: 'INFRA', 
    fullLabel: 'Stack DevOps',
    type: 'skill-group', 
    level: 2, 
    x: 820, y: 540 
  },
  
  // ========================================
  // NIVEAU 3 - Skills détaillées
  // ========================================
  { id: 'symfony', label: 'Symfony 8', type: 'skill', level: 3, x: 50, y: 260 },
  { id: 'php', label: 'PHP 8.3+', type: 'skill', level: 3, x: 50, y: 330 },
  { id: 'postgres', label: 'PostgreSQL', type: 'skill', level: 3, x: 80, y: 380 },
  
  { id: 'vue', label: 'Vue 3', type: 'skill', level: 3, x: 70, y: 450 },
  { id: 'threejs', label: 'Three.js', type: 'skill', level: 3, x: 80, y: 500 },
  { id: 'typescript', label: 'TypeScript', type: 'skill', level: 3, x: 120, y: 550 },
  
  { id: 'n8n', label: 'n8n', type: 'skill', level: 3, x: 100, y: 600 },
  { id: 'ollama', label: 'Ollama', type: 'skill', level: 3, x: 180, y: 630 },
  { id: 'chromadb', label: 'ChromaDB', type: 'skill', level: 3, x: 260, y: 620 },
  
  { id: 'docker', label: 'Docker', type: 'skill', level: 3, x: 880, y: 480 },
  { id: 'github_actions', label: 'GH Actions', type: 'skill', level: 3, x: 920, y: 540 },
  { id: 'prometheus', label: 'Prometheus', type: 'skill', level: 3, x: 880, y: 600 },
  { id: 'grafana', label: 'Grafana', type: 'skill', level: 3, x: 780, y: 620 },
  
  // ========================================
  // NIVEAU 3 - Projets liés
  // ========================================
  { 
    id: 'proj_portfolio', 
    label: 'PORTFOLIO', 
    fullLabel: 'Portfolio GL Digital Lab',
    type: 'project', 
    level: 3, 
    x: 350, y: 620 
  },
  { 
    id: 'proj_multivers', 
    label: 'MULTIVERS', 
    fullLabel: '17+ Univers Parallèles',
    description: 'Portails dimensionnels : Matrix, Blade Runner, Tron...',
    type: 'project', 
    level: 3, 
    x: 450, y: 650 
  },
  { 
    id: 'proj_arcade', 
    label: 'ARCADE', 
    fullLabel: 'Mini-Jeux Arcade',
    type: 'project', 
    level: 3, 
    x: 550, y: 650 
  },
  { 
    id: 'proj_workflows', 
    label: 'WORKFLOWS', 
    fullLabel: 'Workflows & Agents n8n',
    type: 'project', 
    level: 3, 
    x: 650, y: 620 
  },
  
  // ========================================
  // Parcours & Milestones
  // ========================================
  { 
    id: 'parcours', 
    label: 'GAMING→CODE', 
    fullLabel: 'Du Gaming au Code',
    description: 'Transition gaming vers développement professionnel.',
    type: 'story', 
    level: 3, 
    x: 150, y: 140 
  },
  { 
    id: 'lancement', 
    label: '29/01/2026', 
    fullLabel: 'Lancement GL Digital Lab',
    description: '40 ans. Indépendance. Nouveau chapitre.',
    type: 'milestone', 
    level: 3, 
    x: 780, y: 100 
  },
]);

// Links data
const links = ref([
  // ========================================
  // Neo - Connexions principales
  // ========================================
  { source: 'neo', target: 'gltower', relation: 'commande' },
  { source: 'neo', target: 'gllab', relation: 'fonde' },
  { source: 'neo', target: 'arkadia', relation: 'administre' },
  { source: 'neo', target: 'souverainete', relation: 'défend' },
  { source: 'neo', target: 'parcours', relation: 'a vécu' },
  
  // ========================================
  // GL Tower - Équipage ARKADIA (6 Lois)
  // ========================================
  { source: 'gltower', target: 'wa', relation: 'coordonne' },
  { source: 'gltower', target: 'makoto', relation: 'niveau 6' },
  { source: 'gltower', target: 'bi', relation: 'niveau 5' },
  { source: 'gltower', target: 'jitsu', relation: 'niveau 4' },
  { source: 'gltower', target: 'dou', relation: 'niveau 3' },
  { source: 'gltower', target: 'watashi', relation: 'niveau 2' },

  // Wa orchestre l'équipage
  { source: 'wa', target: 'makoto', relation: 'orchestre' },
  { source: 'wa', target: 'bi', relation: 'orchestre' },
  { source: 'wa', target: 'jitsu', relation: 'orchestre' },
  { source: 'wa', target: 'dou', relation: 'orchestre' },
  { source: 'wa', target: 'watashi', relation: 'orchestre' },

  // Collaborations entre Lois
  { source: 'bi', target: 'jitsu', relation: 'API ↔ UI' },
  { source: 'bi', target: 'makoto', relation: 'tests frontend' },
  { source: 'jitsu', target: 'makoto', relation: 'tests backend' },
  { source: 'makoto', target: 'jitsu', relation: 'gate QA' },
  { source: 'jitsu', target: 'watashi', relation: 'données' },

  // ========================================
  // Lois - Stacks
  // ========================================
  { source: 'bi', target: 'stack_frontend', relation: 'maîtrise' },
  { source: 'jitsu', target: 'stack_backend', relation: 'maîtrise' },
  { source: 'jitsu', target: 'stack_devops', relation: 'build & CI/CD' },
  { source: 'dou', target: 'stack_devops', relation: 'utilise' },
  { source: 'makoto', target: 'stack_devops', relation: 'utilise' },
  { source: 'makoto', target: 'stack_frontend', relation: 'teste' },
  { source: 'makoto', target: 'stack_backend', relation: 'teste' },
  { source: 'watashi', target: 'stack_backend', relation: 'data layer' },
  { source: 'watashi', target: 'stack_ia', relation: 'embeddings & RAG' },

  // ========================================
  // Lois - Projets
  // ========================================
  { source: 'bi', target: 'proj_portfolio', relation: 'développe UI' },
  { source: 'bi', target: 'proj_multivers', relation: 'crée' },
  { source: 'bi', target: 'proj_arcade', relation: 'crée' },
  { source: 'jitsu', target: 'proj_portfolio', relation: 'build & déploie' },
  { source: 'jitsu', target: 'proj_workflows', relation: 'APIs' },
  { source: 'makoto', target: 'proj_portfolio', relation: 'teste' },
  { source: 'dou', target: 'proj_workflows', relation: 'monitore' },
  
  // ========================================
  // GL Lab - Services
  // ========================================
  { source: 'gllab', target: 'offer_perf', relation: 'propose' },
  { source: 'gllab', target: 'offer_factory', relation: 'propose' },
  { source: 'gllab', target: 'offer_neural', relation: 'propose' },
  { source: 'gllab', target: 'lancement', relation: 'lancé le' },
  { source: 'gllab', target: 'gltower', relation: 'propulsé par' },
  
  // ========================================
  // Services - Stacks
  // ========================================
  { source: 'offer_perf', target: 'stack_frontend', relation: 'optimise' },
  { source: 'offer_factory', target: 'stack_backend', relation: 'construit' },
  { source: 'offer_factory', target: 'stack_frontend', relation: 'construit' },
  { source: 'offer_neural', target: 'stack_ia', relation: 'déploie' },
  { source: 'offer_neural', target: 'gltower', relation: 'installe' },
  
  // ========================================
  // Souveraineté - Valeurs
  // ========================================
  { source: 'souverainete', target: 'val_rgpd', relation: 'inclut' },
  { source: 'souverainete', target: 'val_local', relation: 'inclut' },
  { source: 'souverainete', target: 'val_zerocloud', relation: 'inclut' },
  { source: 'souverainete', target: 'gltower', relation: 'garantit' },
  
  // ========================================
  // Stacks - Skills
  // ========================================
  { source: 'stack_backend', target: 'symfony', relation: 'comprend' },
  { source: 'stack_backend', target: 'php', relation: 'comprend' },
  { source: 'stack_backend', target: 'postgres', relation: 'comprend' },
  { source: 'stack_frontend', target: 'vue', relation: 'comprend' },
  { source: 'stack_frontend', target: 'threejs', relation: 'comprend' },
  { source: 'stack_frontend', target: 'typescript', relation: 'comprend' },
  { source: 'stack_ia', target: 'n8n', relation: 'comprend' },
  { source: 'stack_ia', target: 'ollama', relation: 'comprend' },
  { source: 'stack_ia', target: 'chromadb', relation: 'comprend' },
  { source: 'stack_devops', target: 'docker', relation: 'comprend' },
  { source: 'stack_devops', target: 'github_actions', relation: 'comprend' },
  { source: 'stack_devops', target: 'prometheus', relation: 'comprend' },
  { source: 'stack_devops', target: 'grafana', relation: 'comprend' },
  
  // ========================================
  // Projets - Techs
  // ========================================
  { source: 'proj_portfolio', target: 'vue', relation: 'utilise' },
  { source: 'proj_portfolio', target: 'threejs', relation: 'utilise' },
  { source: 'proj_portfolio', target: 'proj_multivers', relation: 'contient' },
  { source: 'proj_portfolio', target: 'proj_arcade', relation: 'contient' },
  { source: 'proj_workflows', target: 'n8n', relation: 'utilise' },
  { source: 'proj_workflows', target: 'ollama', relation: 'utilise' },
  
  // ========================================
  // ARKADIA - Démonstrations
  // ========================================
  { source: 'arkadia', target: 'stack_devops', relation: 'démontre' },
  { source: 'arkadia', target: 'proj_workflows', relation: 'alimente' },
  
  // ========================================
  // Parcours
  // ========================================
  { source: 'parcours', target: 'arkadia', relation: 'aboutit à' },
  { source: 'parcours', target: 'gllab', relation: 'aboutit à' },
]);

// Computed: filtered nodes
const filteredNodes = computed(() => {
  if (filter.value === 'all') return nodes.value;
  return nodes.value.filter(n => 
    n.type === filter.value || 
    n.id === 'neo' || 
    n.id === 'gltower'
  );
});

// Computed: filtered links
const filteredLinks = computed(() => {
  const visibleNodeIds = new Set(filteredNodes.value.map(n => n.id));
  return links.value.filter(l => 
    visibleNodeIds.has(l.source) && visibleNodeIds.has(l.target)
  );
});

// Methods
function getNodePosition(nodeId) {
  const node = nodes.value.find(n => n.id === nodeId);
  return node ? { x: node.x, y: node.y } : { x: 0, y: 0 };
}

function getNodeSize(node) {
  if (node.type === 'tower') return 55;
  if (node.type === 'agent') return 32;
  return node.level === 1 ? 45 : node.level === 2 ? 30 : 22;
}

function getNodeColor(node) {
  if (node.agentId && agentColors[node.agentId]) {
    return agentColors[node.agentId];
  }
  return typeColors[node.type] || '#10B981';
}

function getLinkColor(link) {
  const sourceNode = nodes.value.find(n => n.id === link.source);
  const targetNode = nodes.value.find(n => n.id === link.target);
  
  // Agent links use agent color
  if (sourceNode?.type === 'agent') {
    return getNodeColor(sourceNode);
  }
  if (targetNode?.type === 'agent') {
    return getNodeColor(targetNode);
  }
  
  // Tower links are gold
  if (sourceNode?.type === 'tower' || targetNode?.type === 'tower') {
    return '#FBBF24';
  }
  
  return '#10B981';
}

function isAgentLink(link) {
  const sourceNode = nodes.value.find(n => n.id === link.source);
  const targetNode = nodes.value.find(n => n.id === link.target);
  return sourceNode?.type === 'agent' || targetNode?.type === 'agent';
}

function isNodeConnected(nodeId) {
  if (!hoveredNode.value) return true;
  if (nodeId === hoveredNode.value) return true;
  return links.value.some(l => 
    (l.source === hoveredNode.value && l.target === nodeId) ||
    (l.target === hoveredNode.value && l.source === nodeId)
  );
}

function isLinkConnected(link) {
  if (!hoveredNode.value) return true;
  return link.source === hoveredNode.value || link.target === hoveredNode.value;
}

function toggleNode(node) {
  if (selectedNode.value?.id === node.id) {
    selectedNode.value = null;
  } else {
    selectedNode.value = node;
  }
}

function getConnectedNodes(nodeId) {
  return links.value
    .filter(l => l.source === nodeId || l.target === nodeId)
    .map(l => {
      const connectedId = l.source === nodeId ? l.target : l.source;
      const connectedNode = nodes.value.find(n => n.id === connectedId);
      return { ...connectedNode, relation: l.relation };
    });
}

function getHexagonPoints(size) {
  const points = [];
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i - Math.PI / 2;
    const x = size * Math.cos(angle);
    const y = size * Math.sin(angle);
    points.push(`${x},${y}`);
  }
  return points.join(' ');
}
</script>

<style scoped>
.holistic-map {
  --primary: #10B981;
  --gold: #FBBF24;
  --bg: #0a0a0a;
  --surface: #111111;
  --text: #e0e0e0;
  --text-muted: #9CA3AF;
  --text-dark: #6B7280;
  
  min-height: 100vh;
  padding-top: 80px;
  background: linear-gradient(135deg, var(--bg) 0%, #0f1a0f 30%, #1a1005 70%, var(--bg) 100%);
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  color: var(--text);
  position: relative;
  overflow-x: hidden;
}

/* Ambient */
.map-ambient {
  position: fixed;
  inset: 0;
  background: 
    radial-gradient(ellipse at 50% 60%, rgba(251, 191, 36, 0.05) 0%, transparent 50%),
    radial-gradient(ellipse at 30% 20%, rgba(16, 185, 129, 0.08) 0%, transparent 50%),
    radial-gradient(ellipse at 70% 80%, rgba(6, 182, 212, 0.05) 0%, transparent 50%);
  pointer-events: none;
  z-index: 0;
}

/* Header */
.map-header {
  padding: 2rem;
  text-align: center;
  position: relative;
  z-index: 10;
  border-bottom: 1px solid rgba(251, 191, 36, 0.2);
}

.map-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: rgba(251, 191, 36, 0.1);
  border: 1px solid rgba(251, 191, 36, 0.3);
  border-radius: 2rem;
  margin-bottom: 1rem;
  font-size: 0.7rem;
  color: var(--gold);
  letter-spacing: 0.15em;
}

.badge-dot {
  width: 8px;
  height: 8px;
  background: var(--gold);
  border-radius: 50%;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(1.2); }
}

.map-title {
  font-size: clamp(2rem, 5vw, 3.5rem);
  font-weight: 700;
  margin: 0 0 0.5rem 0;
}

.title-gradient {
  background: linear-gradient(135deg, #10B981, #FBBF24, #06B6D4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 0 40px rgba(251, 191, 36, 0.3);
}

.map-subtitle {
  color: var(--text-muted);
  font-size: 0.9rem;
  margin: 0;
}

/* Filters */
.map-filters {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 0.5rem;
  padding: 1rem 2rem;
  position: relative;
  z-index: 10;
}

.filter-btn {
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.5rem;
  color: var(--text-muted);
  font-size: 0.7rem;
  font-family: inherit;
  font-weight: 600;
  letter-spacing: 0.05em;
  cursor: pointer;
  transition: all 0.2s ease;
}

.filter-btn:hover {
  border-color: var(--gold);
  color: var(--gold);
}

.filter-btn--active {
  color: var(--bg) !important;
}

/* SVG Container */
.map-container {
  position: relative;
  width: 100%;
  max-width: 1100px;
  margin: 0 auto;
  padding: 1rem;
}

.map-svg {
  width: 100%;
  height: auto;
  min-height: 600px;
}

/* Tower background */
.tower-bg {
  pointer-events: none;
}

/* Links */
.map-link {
  stroke: var(--primary);
  stroke-width: 1;
  stroke-opacity: 0.25;
  transition: all 0.3s ease;
}

.map-link--active {
  stroke-width: 1.5;
  stroke-opacity: 0.5;
}

.map-link--dimmed {
  stroke-opacity: 0.06;
}

.map-link--agent {
  stroke-width: 1.5;
}

.link-particle {
  opacity: 0.8;
}

/* Nodes */
.map-node {
  cursor: pointer;
  transition: opacity 0.3s ease;
}

.map-node--dimmed {
  opacity: 0.25;
}

.node-circle,
.node-hexagon {
  transition: all 0.3s ease;
}

.node-label {
  font-family: 'JetBrains Mono', monospace;
  pointer-events: none;
  user-select: none;
}

.node-icon {
  pointer-events: none;
  user-select: none;
}

.node-type,
.node-level {
  font-family: 'JetBrains Mono', monospace;
  pointer-events: none;
  user-select: none;
  letter-spacing: 0.05em;
}

.node-pulse {
  pointer-events: none;
}

/* Legend */
.map-legend {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 1rem;
  padding: 1rem 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.65rem;
  color: var(--text-muted);
}

.legend-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.legend-dot--hex {
  border-radius: 0;
  clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
}

/* Detail Panel */
.detail-panel {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(10, 10, 10, 0.95);
  border-top: 2px solid var(--gold);
  padding: 1.5rem 2rem;
  z-index: 100;
  backdrop-filter: blur(10px);
}

.detail-inner {
  max-width: 900px;
  margin: 0 auto;
}

.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
  gap: 1rem;
}

.detail-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border: 1px solid;
  border-radius: 2rem;
  font-size: 0.6rem;
  margin-bottom: 0.5rem;
}

.detail-title {
  margin: 0;
  font-size: 1.5rem;
}

.detail-desc {
  color: var(--text-muted);
  font-size: 0.85rem;
  margin: 0.5rem 0 0 0;
  line-height: 1.5;
}

.detail-close {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: var(--text-muted);
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  cursor: pointer;
  font-size: 0.8rem;
  font-family: inherit;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.detail-close:hover {
  border-color: var(--gold);
  color: var(--gold);
}

.detail-connections {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-items: center;
  margin-bottom: 0.75rem;
}

.connections-label {
  color: var(--text-dark);
  font-size: 0.75rem;
  margin-right: 0.5rem;
}

.connection-tag {
  padding: 0.25rem 0.75rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid;
  border-radius: 0.25rem;
  font-size: 0.7rem;
}

.detail-tech {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-items: center;
}

.tech-label {
  color: var(--text-dark);
  font-size: 0.75rem;
  margin-right: 0.5rem;
}

.tech-tag {
  padding: 0.25rem 0.5rem;
  background: rgba(139, 92, 246, 0.1);
  border: 1px solid rgba(139, 92, 246, 0.3);
  border-radius: 0.25rem;
  font-size: 0.65rem;
  color: #A78BFA;
}

/* Back link */
.map-back {
  text-align: center;
  padding: 2rem;
}

.back-link {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  color: var(--gold);
  text-decoration: none;
  border: 1px solid rgba(251, 191, 36, 0.3);
  border-radius: 0.5rem;
  font-size: 0.8rem;
  transition: all 0.3s ease;
}

.back-link:hover {
  background: var(--gold);
  color: var(--bg);
}

/* Transitions */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
  opacity: 0;
}

/* Responsive */
@media (max-width: 768px) {
  .map-header {
    padding: 1.5rem 1rem;
  }
  
  .map-filters {
    padding: 1rem;
    gap: 0.35rem;
  }
  
  .filter-btn {
    padding: 0.4rem 0.75rem;
    font-size: 0.6rem;
  }
  
  .map-legend {
    gap: 0.75rem;
    padding: 1rem;
  }
  
  .legend-item {
    font-size: 0.55rem;
  }
  
  .detail-panel {
    padding: 1rem;
  }
  
  .detail-title {
    font-size: 1.2rem;
  }
  
  .detail-header {
    flex-direction: column;
  }
  
  .detail-close {
    align-self: flex-end;
  }
}

/* A11Y */
@media (prefers-reduced-motion: reduce) {
  .badge-dot,
  .node-pulse,
  .link-particle {
    animation: none !important;
  }
}
</style>
