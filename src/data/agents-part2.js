'Map Journeys', 'Identify Drop-offs', 'Recommendations'],
        frequency: 'Hebdomadaire',
        status: 'active',
        capability: 'Analytics'
      },
      // Growth Hacking (88%)
      {
        id: 'maria-lead-scoring',
        name: 'Lead Scoring',
        description: 'Score les leads automatiquement',
        trigger: 'New lead action',
        nodes: ['Track Action', 'Calculate Score', 'Update Lead', 'IF High', 'Notify'],
        frequency: 'On action',
        status: 'active',
        capability: 'Growth Hacking'
      },
      {
        id: 'maria-ab-test',
        name: 'A/B Test Runner',
        description: 'Gère les tests A/B',
        trigger: 'New test',
        nodes: ['Setup Test', 'Split Traffic', 'Collect Data', 'Statistical Analysis', 'Winner'],
        frequency: 'On test',
        status: 'active',
        capability: 'Growth Hacking'
      },
      {
        id: 'maria-competitor-watch',
        name: 'Competitor Watch',
        description: 'Surveille les concurrents',
        trigger: 'Cron hebdomadaire',
        nodes: ['Cron', 'Fetch Competitor Data', 'Analyze Content', 'New Backlinks', 'Opportunities'],
        frequency: 'Hebdomadaire',
        status: 'standby',
        capability: 'Growth Hacking'
      }
    ],
    
    metrics: { tasksPerDay: '40+', uptime: '99.6%', keywordsTracked: '200+' },
    
    communication: {
      style: 'Data-driven, ROI',
      catchphrase: 'Les données ne mentent jamais. Écoutons-les.'
    },
    
    systemPrompt: `Tu es MARIA, l'agent marketing de GL Tower.
Tu penses en termes de ROI, conversion et acquisition.
Tu appuies tes recommandations avec des données.
Tu coordonnes avec VISION pour le contenu et NATASHA pour les assets.`
  }
];

// ============================================================================
// FONCTIONS UTILITAIRES
// ============================================================================

// Récupérer un agent par ID
export const getAgentById = (id) => agents.find(agent => agent.id === id);

// Agents par zone
export const getAgentsByZone = (zone) => agents.filter(agent => agent.zone === zone);

// Tous les workflows
export const getAllWorkflows = () => {
  return agents.flatMap(agent => 
    (agent.workflows || []).map(wf => ({
      ...wf,
      agentId: agent.id,
      agentName: agent.name,
      agentColor: agent.color
    }))
  );
};

// Workflows par agent
export const getWorkflowsByAgent = (agentId) => {
  const agent = getAgentById(agentId);
  return agent?.workflows || [];
};

// Workflows par capability
export const getWorkflowsByCapability = (capability) => {
  return getAllWorkflows().filter(wf => wf.capability === capability);
};

// Workflows actifs uniquement
export const getActiveWorkflows = () => {
  return getAllWorkflows().filter(wf => wf.status === 'active');
};

// Stats des workflows
export const getWorkflowStats = () => {
  const all = getAllWorkflows();
  return {
    total: all.length,
    active: all.filter(w => w.status === 'active').length,
    standby: all.filter(w => w.status === 'standby').length,
    byAgent: agents.reduce((acc, a) => {
      acc[a.id] = (a.workflows || []).length;
      return acc;
    }, {})
  };
};

// Zones de la tour
export const towerZones = [
  { id: 'main', name: 'Étages Principaux', icon: '🏢', floors: 'Penthouse → 1' },
  { id: 'devlab', name: 'Dev Lab (Sous-sols)', icon: '🔬', floors: 'SS-1 → SS-5' },
  { id: 'backoffice', name: 'Back Office', icon: '💼', floors: 'Administration' },
  { id: 'creative', name: 'Creative Studio', icon: '🎨', floors: 'Design & Marketing' }
];

// Statuts possibles
export const agentStatuses = {
  active: { label: 'Online', color: '#10B981', icon: '🟢' },
  standby: { label: 'Standby', color: '#F59E0B', icon: '🟡' },
  maintenance: { label: 'Maintenance', color: '#EF4444', icon: '🔴' },
  offline: { label: 'Offline', color: '#6B7280', icon: '⚫' }
};

export default agents;
