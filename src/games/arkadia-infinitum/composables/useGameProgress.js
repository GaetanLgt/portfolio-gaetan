/**
 * THE CONSTRUCT - Gamification System
 * Système XP, Niveaux et Persistance
 */

import { ref, computed, watch } from 'vue';

// ============================================================================
// CONFIGURATION
// ============================================================================

const LEVELS = [
  { level: 1, xpRequired: 0, title: 'Bluepill', color: '#3b82f6' },
  { level: 2, xpRequired: 100, title: 'Awakened', color: '#22c55e' },
  { level: 3, xpRequired: 300, title: 'Freed Mind', color: '#22c55e' },
  { level: 4, xpRequired: 600, title: 'Operator', color: '#eab308' },
  { level: 5, xpRequired: 1000, title: 'Hacker', color: '#eab308' },
  { level: 6, xpRequired: 1500, title: 'Rebel', color: '#f97316' },
  { level: 7, xpRequired: 2200, title: 'Zion Captain', color: '#f97316' },
  { level: 8, xpRequired: 3000, title: 'The One\'s Ally', color: '#ef4444' },
  { level: 9, xpRequired: 4000, title: 'Matrix Breaker', color: '#ef4444' },
  { level: 10, xpRequired: 5500, title: 'Architect', color: '#a855f7' },
  { level: 11, xpRequired: 7500, title: 'Oracle', color: '#a855f7' },
  { level: 12, xpRequired: 10000, title: 'The One', color: '#ffffff' }
];

const XP_REWARDS = {
  nodeVisit: 15,
  nodeFirstVisit: 50,
  cheatcodeUsed: 25,
  cheatcodeFirstUse: 75,
  achievementUnlocked: 100,
  secretFound: 150,
  featureOpened: 20,
  timeSpent1min: 10,
  timeSpent5min: 50,
  timeSpent10min: 100,
  pixelArtCreated: 75,
  workflowExplored: 30
};

// ============================================================================
// STATE
// ============================================================================

const STORAGE_KEY = 'construct_player_data';

// État du joueur
const playerData = ref(loadPlayerData());

function loadPlayerData() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.warn('Failed to load player data:', e);
  }
  
  return {
    xp: 0,
    totalXpEarned: 0,
    visitedNodes: [],
    usedCheatcodes: [],
    unlockedAchievements: [],
    secretsFound: [],
    featuresOpened: [],
    sessionCount: 0,
    totalTimeSpent: 0,
    firstVisit: Date.now(),
    lastVisit: Date.now()
  };
}

function savePlayerData() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(playerData.value));
  } catch (e) {
    console.warn('Failed to save player data:', e);
  }
}

// Auto-save on changes
watch(playerData, savePlayerData, { deep: true });

// ============================================================================
// COMPUTED
// ============================================================================

const currentLevel = computed(() => {
  const xp = playerData.value.xp;
  let currentLvl = LEVELS[0];
  
  for (const lvl of LEVELS) {
    if (xp >= lvl.xpRequired) {
      currentLvl = lvl;
    } else {
      break;
    }
  }
  
  return currentLvl;
});

const nextLevel = computed(() => {
  const currentLvl = currentLevel.value.level;
  return LEVELS.find(l => l.level === currentLvl + 1) || null;
});

const xpProgress = computed(() => {
  if (!nextLevel.value) return 100;
  
  const current = playerData.value.xp - currentLevel.value.xpRequired;
  const needed = nextLevel.value.xpRequired - currentLevel.value.xpRequired;
  
  return Math.floor((current / needed) * 100);
});

const xpToNextLevel = computed(() => {
  if (!nextLevel.value) return 0;
  return nextLevel.value.xpRequired - playerData.value.xp;
});

// ============================================================================
// ACTIONS
// ============================================================================

const xpGainQueue = ref([]);
const showLevelUp = ref(false);
const newLevelData = ref(null);

function addXP(amount, reason = '') {
  const oldLevel = currentLevel.value.level;
  
  playerData.value.xp += amount;
  playerData.value.totalXpEarned += amount;
  
  // Add to visual queue
  xpGainQueue.value.push({
    id: Date.now(),
    amount,
    reason
  });
  
  // Remove from queue after animation
  setTimeout(() => {
    xpGainQueue.value.shift();
  }, 2000);
  
  // Check level up
  const newLevel = currentLevel.value.level;
  if (newLevel > oldLevel) {
    triggerLevelUp(currentLevel.value);
  }
  
  savePlayerData();
  
  return amount;
}

function triggerLevelUp(levelData) {
  newLevelData.value = levelData;
  showLevelUp.value = true;
  
  // Auto-hide after 4s
  setTimeout(() => {
    showLevelUp.value = false;
  }, 4000);
}

function visitNode(nodeId) {
  const isFirstVisit = !playerData.value.visitedNodes.includes(nodeId);
  
  if (isFirstVisit) {
    playerData.value.visitedNodes.push(nodeId);
    addXP(XP_REWARDS.nodeFirstVisit, `First visit: ${nodeId}`);
    return { xp: XP_REWARDS.nodeFirstVisit, isFirst: true };
  } else {
    addXP(XP_REWARDS.nodeVisit, `Visit: ${nodeId}`);
    return { xp: XP_REWARDS.nodeVisit, isFirst: false };
  }
}

function useCheatcode(code) {
  const isFirstUse = !playerData.value.usedCheatcodes.includes(code);
  
  if (isFirstUse) {
    playerData.value.usedCheatcodes.push(code);
    addXP(XP_REWARDS.cheatcodeFirstUse, `Cheat discovered: ${code}`);
    return { xp: XP_REWARDS.cheatcodeFirstUse, isFirst: true };
  } else {
    addXP(XP_REWARDS.cheatcodeUsed, `Cheat used: ${code}`);
    return { xp: XP_REWARDS.cheatcodeUsed, isFirst: false };
  }
}

function openFeature(featureId) {
  if (!playerData.value.featuresOpened.includes(featureId)) {
    playerData.value.featuresOpened.push(featureId);
    addXP(XP_REWARDS.featureOpened, `Feature opened: ${featureId}`);
  }
}

function findSecret(secretId) {
  if (!playerData.value.secretsFound.includes(secretId)) {
    playerData.value.secretsFound.push(secretId);
    addXP(XP_REWARDS.secretFound, `Secret found: ${secretId}`);
    return true;
  }
  return false;
}

function incrementSession() {
  playerData.value.sessionCount++;
  playerData.value.lastVisit = Date.now();
  savePlayerData();
}

function addTimeSpent(seconds) {
  playerData.value.totalTimeSpent += seconds;
  savePlayerData();
}

function resetProgress() {
  if (confirm('Reset all progress? This cannot be undone!')) {
    localStorage.removeItem(STORAGE_KEY);
    playerData.value = loadPlayerData();
    return true;
  }
  return false;
}

// ============================================================================
// EXPORT
// ============================================================================

export function useGameProgress() {
  return {
    // State
    playerData,
    xpGainQueue,
    showLevelUp,
    newLevelData,
    
    // Computed
    currentLevel,
    nextLevel,
    xpProgress,
    xpToNextLevel,
    
    // Constants
    LEVELS,
    XP_REWARDS,
    
    // Actions
    addXP,
    visitNode,
    useCheatcode,
    openFeature,
    findSecret,
    incrementSession,
    addTimeSpent,
    resetProgress,
    savePlayerData
  };
}

export default useGameProgress;
