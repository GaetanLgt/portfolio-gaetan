/**
 * Node Connections Configuration
 * Définit les liens entre les nodes pour les connexions animées
 */

export const nodeConnections = [
  // ============================================================================
  // JARVIS orchestre tous les agents opérationnels
  // ============================================================================
  { from: 'jarvis', to: 'edith', color: 0x06b6d4, type: 'orchestration' },
  { from: 'jarvis', to: 'veronica', color: 0x06b6d4, type: 'orchestration' },
  { from: 'jarvis', to: 'ultron', color: 0x06b6d4, type: 'orchestration' },
  { from: 'jarvis', to: 'vision', color: 0x06b6d4, type: 'orchestration' },
  { from: 'jarvis', to: 'karen', color: 0x06b6d4, type: 'orchestration' },
  { from: 'jarvis', to: 'friday', color: 0x06b6d4, type: 'orchestration' },
  
  // ============================================================================
  // GL TOWER - Hub central
  // ============================================================================
  { from: 'gl-tower', to: 'neo', color: 0xfbbf24, type: 'core' },
  { from: 'gl-tower', to: 'jarvis', color: 0xfbbf24, type: 'core' },
  
  // ============================================================================
  // NEO - Connexions aux projets
  // ============================================================================
  { from: 'neo', to: 'arkadia', color: 0x00ff00, type: 'project' },
  { from: 'neo', to: 'portfolio', color: 0x00ff00, type: 'project' },
  { from: 'neo', to: 'multivers', color: 0x00ff00, type: 'project' },
  
  // ============================================================================
  // Stacks techniques interconnectées
  // ============================================================================
  { from: 'stack-backend', to: 'stack-frontend', color: 0x3b82f6, type: 'stack' },
  { from: 'stack-backend', to: 'stack-ia', color: 0x3b82f6, type: 'stack' },
  { from: 'stack-ia', to: 'stack-devops', color: 0xa855f7, type: 'stack' },
  { from: 'stack-frontend', to: 'stack-devops', color: 0x22d3ee, type: 'stack' },
  
  // ============================================================================
  // Dev Lab - Chaîne de travail
  // ============================================================================
  { from: 'tadashi', to: 'jocasta', color: 0x14b8a6, type: 'devlab' },
  { from: 'tadashi', to: 'cerebro', color: 0x14b8a6, type: 'devlab' },
  { from: 'cerebro', to: 'zola', color: 0x7c3aed, type: 'devlab' },
  { from: 'zola', to: 'dum-e', color: 0x64748b, type: 'devlab' },
  
  // ============================================================================
  // Services connectés à NEO
  // ============================================================================
  { from: 'neo', to: 'service-performance', color: 0x00ff00, type: 'service' },
  { from: 'neo', to: 'service-factory', color: 0x00ff00, type: 'service' },
  { from: 'neo', to: 'service-neural', color: 0x00ff00, type: 'service' },
  
  // ============================================================================
  // PEPPER - Back Office
  // ============================================================================
  { from: 'pepper', to: 'gl-tower', color: 0xeab308, type: 'finance' },
];

// Configuration des particules de données
export const particleConfig = {
  countPerConnection: 3,
  baseSpeed: 0.3,
  speedVariation: 0.4,
  size: 0.08,
  glowSize: 0.15,
  glowOpacity: 0.3
};

// Configuration des lignes de connexion
export const lineConfig = {
  baseOpacity: 0.3,
  pulseAmplitude: 0.15,
  pulseSpeed: 0.002
};

export default nodeConnections;
