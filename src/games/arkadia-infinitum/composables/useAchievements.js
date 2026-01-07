/**
 * THE CONSTRUCT - Achievements System
 * Badges et accomplissements
 */

import { ref, computed, watch } from 'vue';
import { useGameProgress } from './useGameProgress.js';

// ============================================================================
// ACHIEVEMENTS DEFINITION
// ============================================================================

export const ACHIEVEMENTS = {
  // === EXPLORATION ===
  white_rabbit: {
    id: 'white_rabbit',
    name: 'White Rabbit',
    description: 'Enter The Construct for the first time',
    icon: '🐇',
    category: 'exploration',
    xpReward: 100,
    secret: false,
    condition: (data) => data.sessionCount >= 1
  },
  
  explorer: {
    id: 'explorer',
    name: 'Explorer',
    description: 'Visit 5 different nodes',
    icon: '🧭',
    category: 'exploration',
    xpReward: 150,
    secret: false,
    condition: (data) => data.visitedNodes.length >= 5
  },
  
  cartographer: {
    id: 'cartographer',
    name: 'Cartographer',
    description: 'Visit 15 different nodes',
    icon: '🗺️',
    category: 'exploration',
    xpReward: 300,
    secret: false,
    condition: (data) => data.visitedNodes.length >= 15
  },
  
  the_one: {
    id: 'the_one',
    name: 'The One',
    description: 'Visit ALL nodes in The Construct',
    icon: '👁️',
    category: 'exploration',
    xpReward: 500,
    secret: false,
    condition: (data, totalNodes) => data.visitedNodes.length >= totalNodes
  },
  
  // === HACKING ===
  script_kiddie: {
    id: 'script_kiddie',
    name: 'Script Kiddie',
    description: 'Use your first cheatcode',
    icon: '⌨️',
    category: 'hacking',
    xpReward: 75,
    secret: false,
    condition: (data) => data.usedCheatcodes.length >= 1
  },
  
  hacker: {
    id: 'hacker',
    name: 'Hacker',
    description: 'Use 5 different cheatcodes',
    icon: '💻',
    category: 'hacking',
    xpReward: 200,
    secret: false,
    condition: (data) => data.usedCheatcodes.length >= 5
  },
  
  neo_hacker: {
    id: 'neo_hacker',
    name: 'Neo-level Hacker',
    description: 'Use 10 different cheatcodes',
    icon: '🥷',
    category: 'hacking',
    xpReward: 400,
    secret: false,
    condition: (data) => data.usedCheatcodes.length >= 10
  },
  
  // === CREATIVITY ===
  pixel_artist: {
    id: 'pixel_artist',
    name: 'Pixel Artist',
    description: 'Create your first pixel art',
    icon: '🎨',
    category: 'creativity',
    xpReward: 100,
    secret: false,
    condition: (data) => data.featuresOpened.includes('pixelart_created')
  },
  
  workflow_master: {
    id: 'workflow_master',
    name: 'Workflow Master',
    description: 'Explore the Workflows Lab',
    icon: '🔄',
    category: 'creativity',
    xpReward: 100,
    secret: false,
    condition: (data) => data.featuresOpened.includes('workflows')
  },
  
  // === TIME ===
  dedicated: {
    id: 'dedicated',
    name: 'Dedicated',
    description: 'Spend 5 minutes in The Construct',
    icon: '⏱️',
    category: 'time',
    xpReward: 100,
    secret: false,
    condition: (data) => data.totalTimeSpent >= 300
  },
  
  immersed: {
    id: 'immersed',
    name: 'Immersed',
    description: 'Spend 15 minutes in The Construct',
    icon: '🕐',
    category: 'time',
    xpReward: 250,
    secret: false,
    condition: (data) => data.totalTimeSpent >= 900
  },
  
  matrix_dweller: {
    id: 'matrix_dweller',
    name: 'Matrix Dweller',
    description: 'Spend 30 minutes in The Construct',
    icon: '🌙',
    category: 'time',
    xpReward: 500,
    secret: false,
    condition: (data) => data.totalTimeSpent >= 1800
  },
  
  // === SECRET ===
  red_pill: {
    id: 'red_pill',
    name: 'Red Pill',
    description: 'You chose to see how deep the rabbit hole goes',
    icon: '💊',
    category: 'secret',
    xpReward: 200,
    secret: true,
    condition: (data) => data.usedCheatcodes.includes('redpill')
  },
  
  kung_fu_master: {
    id: 'kung_fu_master',
    name: 'I Know Kung Fu',
    description: 'Download martial arts directly to your brain',
    icon: '🥋',
    category: 'secret',
    xpReward: 200,
    secret: true,
    condition: (data) => data.usedCheatcodes.includes('iknowkungfu')
  },
  
  spoon_bender: {
    id: 'spoon_bender',
    name: 'Spoon Bender',
    description: 'There is no spoon',
    icon: '🥄',
    category: 'secret',
    xpReward: 250,
    secret: true,
    condition: (data) => data.usedCheatcodes.includes('thereisnospoon')
  },
  
  morpheus_disciple: {
    id: 'morpheus_disciple',
    name: 'Morpheus\' Disciple',
    description: 'Receive wisdom from Morpheus',
    icon: '😎',
    category: 'secret',
    xpReward: 150,
    secret: true,
    condition: (data) => data.usedCheatcodes.includes('morpheus')
  },
  
  // === MASTERY ===
  completionist: {
    id: 'completionist',
    name: 'Completionist',
    description: 'Unlock all non-secret achievements',
    icon: '🏆',
    category: 'mastery',
    xpReward: 1000,
    secret: false,
    condition: (data, totalNodes, unlockedCount, totalNonSecret) => unlockedCount >= totalNonSecret
  },
  
  true_one: {
    id: 'true_one',
    name: 'The True One',
    description: 'Unlock ALL achievements including secrets',
    icon: '👑',
    category: 'mastery',
    xpReward: 2000,
    secret: true,
    condition: (data, totalNodes, unlockedCount, totalNonSecret, totalAll) => unlockedCount >= totalAll - 1 // -1 because this one
  }
};

// ============================================================================
// CATEGORIES
// ============================================================================

export const CATEGORIES = {
  exploration: { name: 'Exploration', icon: '🧭', color: '#22c55e' },
  hacking: { name: 'Hacking', icon: '💻', color: '#3b82f6' },
  creativity: { name: 'Creativity', icon: '🎨', color: '#a855f7' },
  time: { name: 'Time', icon: '⏱️', color: '#eab308' },
  secret: { name: 'Secret', icon: '🔮', color: '#ef4444' },
  mastery: { name: 'Mastery', icon: '🏆', color: '#f97316' }
};

// ============================================================================
// COMPOSABLE
// ============================================================================

const achievementNotification = ref(null);
const showAchievementPanel = ref(false);

export function useAchievements(totalNodes = 26) {
  const { playerData, addXP } = useGameProgress();
  
  // Computed
  const unlockedAchievements = computed(() => {
    return playerData.value.unlockedAchievements || [];
  });
  
  const totalNonSecretAchievements = computed(() => {
    return Object.values(ACHIEVEMENTS).filter(a => !a.secret).length;
  });
  
  const totalAchievements = computed(() => {
    return Object.keys(ACHIEVEMENTS).length;
  });
  
  const achievementsByCategory = computed(() => {
    const result = {};
    
    for (const [catId, cat] of Object.entries(CATEGORIES)) {
      result[catId] = {
        ...cat,
        achievements: Object.values(ACHIEVEMENTS)
          .filter(a => a.category === catId)
          .map(a => ({
            ...a,
            unlocked: unlockedAchievements.value.includes(a.id)
          }))
      };
    }
    
    return result;
  });
  
  const progressPercent = computed(() => {
    return Math.floor((unlockedAchievements.value.length / totalAchievements.value) * 100);
  });
  
  // Check and unlock achievements
  function checkAchievements() {
    const data = playerData.value;
    const newlyUnlocked = [];
    
    for (const [id, achievement] of Object.entries(ACHIEVEMENTS)) {
      if (unlockedAchievements.value.includes(id)) continue;
      
      const conditionMet = achievement.condition(
        data, 
        totalNodes,
        unlockedAchievements.value.length,
        totalNonSecretAchievements.value,
        totalAchievements.value
      );
      
      if (conditionMet) {
        unlockAchievement(achievement);
        newlyUnlocked.push(achievement);
      }
    }
    
    return newlyUnlocked;
  }
  
  function unlockAchievement(achievement) {
    if (playerData.value.unlockedAchievements.includes(achievement.id)) return;
    
    playerData.value.unlockedAchievements.push(achievement.id);
    
    // Award XP (without triggering achievement check again)
    playerData.value.xp += achievement.xpReward;
    playerData.value.totalXpEarned += achievement.xpReward;
    
    // Show notification
    showAchievementNotification(achievement);
  }
  
  function showAchievementNotification(achievement) {
    achievementNotification.value = achievement;
    
    // Auto-hide after 4s
    setTimeout(() => {
      achievementNotification.value = null;
    }, 4000);
  }
  
  function toggleAchievementPanel() {
    showAchievementPanel.value = !showAchievementPanel.value;
  }
  
  function getAchievementById(id) {
    return ACHIEVEMENTS[id] || null;
  }
  
  function isUnlocked(id) {
    return unlockedAchievements.value.includes(id);
  }
  
  return {
    // State
    achievementNotification,
    showAchievementPanel,
    
    // Computed
    unlockedAchievements,
    achievementsByCategory,
    progressPercent,
    totalAchievements,
    totalNonSecretAchievements,
    
    // Constants
    ACHIEVEMENTS,
    CATEGORIES,
    
    // Actions
    checkAchievements,
    unlockAchievement,
    toggleAchievementPanel,
    getAchievementById,
    isUnlocked
  };
}

export default useAchievements;
