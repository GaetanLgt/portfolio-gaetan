/**
 * Matrix Cheatcodes Configuration
 * Codes secrets pour débloquer des fonctionnalités cachées
 */

export const createCheatcodes = (handlers) => ({
  // ============================================================================
  // MATRIX CLASSICS
  // ============================================================================
  'thereisnospoon': { 
    id: 'godmode', 
    name: 'GOD MODE', 
    icon: '🥄', 
    desc: 'Invincibilité totale', 
    effect: handlers.applyGodMode 
  },
  'iknowkungfu': { 
    id: 'kung_fu', 
    name: 'KUNG-FU MASTER', 
    icon: '🥋', 
    desc: 'Vitesse x2', 
    effect: handlers.applyKungFu 
  },
  'followthewhiterabbit': { 
    id: 'nebuchadnezzar', 
    name: 'NEBUCHADNEZZAR', 
    icon: '🐇', 
    desc: 'Révèle tous les nodes', 
    effect: handlers.revealAllNodes 
  },
  'redpill': { 
    id: 'redpill', 
    name: 'RED PILL', 
    icon: '💊', 
    desc: 'Vision thermique', 
    effect: handlers.applyRedPill 
  },
  'bluepill': { 
    id: 'bluepill', 
    name: 'BLUE PILL', 
    icon: '💊', 
    desc: 'Retour à la normale', 
    effect: handlers.resetAllCheats 
  },
  'agentsmith': { 
    id: 'agent', 
    name: 'AGENT SMITH', 
    icon: '🕴️', 
    desc: 'Clone les nodes', 
    effect: handlers.cloneNodes 
  },
  'bullettime': { 
    id: 'slowmo', 
    name: 'BULLET TIME', 
    icon: '🔫', 
    desc: 'Ralenti Matrix', 
    effect: handlers.applySlowMo 
  },

  // ============================================================================
  // MOVEMENT
  // ============================================================================
  'freefly': { 
    id: 'fly', 
    name: 'FREE FLY', 
    icon: '🦅', 
    desc: 'Vol libre', 
    effect: handlers.toggleFly 
  },
  'noclip': { 
    id: 'noclip', 
    name: 'NO CLIP', 
    icon: '👻', 
    desc: 'Traverse les murs', 
    effect: handlers.toggleNoclip 
  },
  'zion': { 
    id: 'zion', 
    name: 'ZION', 
    icon: '🏛️', 
    desc: 'Téléporte au centre', 
    effect: handlers.teleportToCenter 
  },

  // ============================================================================
  // EFFECTS
  // ============================================================================
  'morpheus': { 
    id: 'morpheus', 
    name: 'MORPHEUS', 
    icon: '😎', 
    desc: 'Citation aléatoire', 
    effect: handlers.showMorpheusQuote 
  },
  'trinity': { 
    id: 'trinity', 
    name: 'TRINITY', 
    icon: '🏍️', 
    desc: 'Effet néon', 
    effect: handlers.applyTrinityEffect 
  },
  'glitch': { 
    id: 'glitch', 
    name: 'GLITCH', 
    icon: '📺', 
    desc: 'Effet glitch', 
    effect: handlers.applyGlitchEffect 
  },

  // ============================================================================
  // MENUS
  // ============================================================================
  'showmeeverything': { 
    id: 'reveal', 
    name: 'REVEAL ALL', 
    icon: '👁️', 
    desc: 'Affiche la liste des cheats', 
    effect: handlers.showCheatList 
  },
  'tank': { 
    id: 'tank', 
    name: 'OPERATOR LINK', 
    icon: '📞', 
    desc: 'Charger des programmes', 
    effect: handlers.openOperator 
  },
  'loadweapons': { 
    id: 'loadweapons', 
    name: 'LOAD WEAPONS', 
    icon: '🔫', 
    desc: 'Menu de chargement rapide', 
    effect: handlers.openOperator 
  },
  'operator': { 
    id: 'operator', 
    name: 'CALL OPERATOR', 
    icon: '☎️', 
    desc: 'Contacter Tank', 
    effect: handlers.openOperator 
  },
  'ineedguns': { 
    id: 'ineedguns', 
    name: 'GUNS. LOTS OF GUNS.', 
    icon: '💥', 
    desc: 'Chargement massif d\'armes', 
    effect: handlers.loadAllWeapons 
  },
  'hologram': { 
    id: 'hologram', 
    name: 'HOLOGRAPHIC SITEMAP', 
    icon: '🔮', 
    desc: 'Vue holographique du site', 
    effect: handlers.openHologram 
  },
  'sitemap': { 
    id: 'sitemap', 
    name: 'SITE STRUCTURE', 
    icon: '🌐', 
    desc: 'Architecture complète', 
    effect: handlers.openHologram 
  },

  // ============================================================================
  // NAVIGATION
  // ============================================================================
  'holistic': { 
    id: 'holistic', 
    name: 'HOLISTIC MAP', 
    icon: '🗺️', 
    desc: 'Carte de GL Tower', 
    effect: () => handlers.navigateTo('/carte-holistique') 
  },
  'gltower': { 
    id: 'gltower', 
    name: 'GL TOWER', 
    icon: '🏢', 
    desc: 'Retour au QG', 
    effect: () => handlers.navigateTo('/hub') 
  },
  'arkadia': { 
    id: 'arkadia', 
    name: 'ARKADIA', 
    icon: '🦖', 
    desc: 'Cluster gaming', 
    effect: () => handlers.navigateTo('/arkadia') 
  },

  // ============================================================================
  // INTERACTIVE FEATURES
  // ============================================================================
  'workflows': { 
    id: 'workflows', 
    name: 'WORKFLOWS LAB', 
    icon: '🔄', 
    desc: 'Visualiser les workflows n8n', 
    effect: handlers.openWorkflows 
  },
  'n8n': { 
    id: 'n8n', 
    name: 'N8N STUDIO', 
    icon: '⚡', 
    desc: 'Automatisations agents', 
    effect: handlers.openWorkflows 
  },
  'pixelart': { 
    id: 'pixelart', 
    name: 'PIXEL ART LAB', 
    icon: '🎨', 
    desc: 'Éditeur pixel art', 
    effect: handlers.openPixelArt 
  },
  'sprite': { 
    id: 'sprite', 
    name: 'SPRITE EDITOR', 
    icon: '🖼️', 
    desc: 'Créer des sprites', 
    effect: handlers.openPixelArt 
  },

  // ============================================================================
  // EASTER EGGS - SECRET ZONES
  // ============================================================================
  'architectsdream': { 
    id: 'architectsdream', 
    name: 'ARCHITECT\'S DREAM', 
    icon: '🏠', 
    desc: 'Zone secrète : La maison bleue', 
    effect: handlers.openArchitectDream 
  },
  'bluehouse': { 
    id: 'bluehouse', 
    name: 'BLUE HOUSE', 
    icon: '🏚️', 
    desc: 'La maison dans l\'arbre', 
    effect: handlers.openArchitectDream 
  },
  'blueprint': { 
    id: 'blueprint', 
    name: 'BLUEPRINT MODE', 
    icon: '📐', 
    desc: 'Voir les plans', 
    effect: handlers.openArchitectDream 
  },
  'ducroquisaucode': { 
    id: 'ducroquisaucode', 
    name: 'DU CROQUIS AU CODE', 
    icon: '✏️', 
    desc: 'Univers Architect', 
    effect: () => handlers.navigateTo('/architect') 
  },

  // ============================================================================
  // DEBUG
  // ============================================================================
  'architect': { 
    id: 'architect', 
    name: 'THE ARCHITECT', 
    icon: '🧓', 
    desc: 'Mode debug', 
    effect: handlers.toggleDebugMode 
  },
});

// Citations de Morpheus
export const morpheusQuotes = [
  'Free your mind.',
  'There is a difference between knowing the path and walking the path.',
  'I can only show you the door. You\'re the one that has to walk through it.',
  'What you know you can\'t explain, but you feel it.',
  'The Matrix is everywhere. It is all around us.',
  'Welcome to the desert of the real.',
  'Unfortunately, no one can be told what the Matrix is. You have to see it for yourself.',
  'This is your last chance. After this, there is no turning back.',
];

export default createCheatcodes;
