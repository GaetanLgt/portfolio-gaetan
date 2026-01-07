/**
 * Operator Link Programs
 * Programmes chargeables via le menu Tank/Operator
 */

export const programCategories = [
  { id: 'weapons', name: 'ARMES', icon: '🔫' },
  { id: 'vehicles', name: 'VÉHICULES', icon: '🚗' },
  { id: 'training', name: 'ENTRAÎNEMENT', icon: '🥋' },
  { id: 'tools', name: 'OUTILS', icon: '🛠️' },
  { id: 'intel', name: 'INTEL', icon: '📊' },
];

export const programs = [
  // ============================================================================
  // WEAPONS - Apps/Outils Dev
  // ============================================================================
  { 
    id: 'json-gun', 
    name: 'JSON FORMATTER', 
    icon: '🔫', 
    category: 'weapons', 
    desc: 'Formate et valide le JSON', 
    url: '/apps/json' 
  },
  { 
    id: 'regex-blade', 
    name: 'REGEX BLADE', 
    icon: '🗡️', 
    category: 'weapons', 
    desc: 'Testeur d\'expressions régulières', 
    url: '/apps/regex' 
  },
  { 
    id: 'hash-cannon', 
    name: 'HASH CANNON', 
    icon: '💣', 
    category: 'weapons', 
    desc: 'Générateur de hash MD5/SHA', 
    url: '/apps/hash' 
  },
  { 
    id: 'base64-rifle', 
    name: 'BASE64 RIFLE', 
    icon: '🎯', 
    category: 'weapons', 
    desc: 'Encodeur/Décodeur Base64', 
    url: '/apps/base64' 
  },
  { 
    id: 'password-shield', 
    name: 'PASSWORD SHIELD', 
    icon: '🛡️', 
    category: 'weapons', 
    desc: 'Générateur mots de passe', 
    url: '/apps/password' 
  },
  { 
    id: 'diff-scanner', 
    name: 'DIFF SCANNER', 
    icon: '🔍', 
    category: 'weapons', 
    desc: 'Comparateur de textes', 
    url: '/apps/diff' 
  },
  
  // ============================================================================
  // VEHICLES - Plateformes/Projets
  // ============================================================================
  { 
    id: 'arkadia-ship', 
    name: 'ARKADIA CLUSTER', 
    icon: '🚀', 
    category: 'vehicles', 
    desc: '9 serveurs ARK Survival', 
    url: '/arkadia' 
  },
  { 
    id: 'gl-tower', 
    name: 'GL TOWER', 
    icon: '🏢', 
    category: 'vehicles', 
    desc: 'QG des Agents IA', 
    url: '/hub' 
  },
  { 
    id: 'multivers-portal', 
    name: 'MULTIVERS PORTAL', 
    icon: '🌌', 
    category: 'vehicles', 
    desc: '24 dimensions parallèles', 
    url: '/multivers' 
  },
  { 
    id: 'arcade-bike', 
    name: 'ARCADE MACHINE', 
    icon: '🕹️', 
    category: 'vehicles', 
    desc: 'Mini-jeux rétro', 
    url: '/arcade' 
  },
  { 
    id: 'gallery-jet', 
    name: 'GALERIE CRÉATIONS', 
    icon: '🎨', 
    category: 'vehicles', 
    desc: '62 œuvres numériques', 
    url: '/creations' 
  },
  
  // ============================================================================
  // TRAINING - Formations/Parcours
  // ============================================================================
  { 
    id: 'kung-fu', 
    name: 'GAMING → DEV', 
    icon: '🥋', 
    category: 'training', 
    desc: 'Mon parcours atypique', 
    url: '/parcours' 
  },
  { 
    id: 'agent-training', 
    name: 'CONSEIL DES AGENTS', 
    icon: '🤖', 
    category: 'training', 
    desc: 'Vision IA multi-agents', 
    url: '/conseil' 
  },
  { 
    id: 'stack-mastery', 
    name: 'STACK IA LOCALE', 
    icon: '🧠', 
    category: 'training', 
    desc: 'Infrastructure souveraine', 
    url: '/stack-ia' 
  },
  { 
    id: 'holistic-map', 
    name: 'CARTE HOLISTIQUE', 
    icon: '🗺️', 
    category: 'training', 
    desc: 'Vue d\'ensemble GL Tower', 
    url: '/carte-holistique' 
  },
  
  // ============================================================================
  // TOOLS - Utilitaires
  // ============================================================================
  { 
    id: 'color-tool', 
    name: 'COLOR CONVERTER', 
    icon: '🎨', 
    category: 'tools', 
    desc: 'Convertisseur HEX/RGB/HSL', 
    url: '/apps/colors' 
  },
  { 
    id: 'uuid-gen', 
    name: 'UUID GENERATOR', 
    icon: '🎲', 
    category: 'tools', 
    desc: 'Générateur d\'identifiants', 
    url: '/apps/uuid' 
  },
  { 
    id: 'timestamp-tool', 
    name: 'TIMESTAMP TOOL', 
    icon: '⏰', 
    category: 'tools', 
    desc: 'Convertisseur Unix/Date', 
    url: '/apps/timestamp' 
  },
  { 
    id: 'qr-maker', 
    name: 'QR GENERATOR', 
    icon: '📱', 
    category: 'tools', 
    desc: 'Créateur de QR codes', 
    url: '/apps/qr-code' 
  },
  { 
    id: 'prompt-builder', 
    name: 'PROMPT BUILDER', 
    icon: '📝', 
    category: 'tools', 
    desc: 'Constructeur de prompts IA', 
    url: '/apps/prompt-builder' 
  },
  
  // ============================================================================
  // INTEL - Stats/Infos
  // ============================================================================
  { 
    id: 'cv-intel', 
    name: 'CV NEO', 
    icon: '📄', 
    category: 'intel', 
    desc: 'Curriculum Vitae complet', 
    url: '/cv' 
  },
  { 
    id: 'contact-line', 
    name: 'LIGNE DIRECTE', 
    icon: '📞', 
    category: 'intel', 
    desc: 'Ouvrir un canal sécurisé', 
    url: '/contact' 
  },
  { 
    id: 'sitemap-radar', 
    name: 'SITEMAP RADAR', 
    icon: '🗺️', 
    category: 'intel', 
    desc: 'Plan du site complet', 
    url: '/sitemap' 
  },
  { 
    id: 'services-brief', 
    name: 'SERVICES BRIEF', 
    icon: '⚡', 
    category: 'intel', 
    desc: 'Nos offres détaillées', 
    url: '/services' 
  },
];

// Helpers
export const getProgramById = (id) => programs.find(p => p.id === id);
export const getProgramsByCategory = (categoryId) => programs.filter(p => p.category === categoryId);
export const getProgramCountByCategory = (categoryId) => getProgramsByCategory(categoryId).length;

export default programs;
