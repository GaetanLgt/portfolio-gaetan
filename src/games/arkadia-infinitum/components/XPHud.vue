<template>
  <div class="xp-hud">
    <!-- Level Badge -->
    <div class="level-badge" :style="{ '--level-color': currentLevel.color }">
      <span class="level-number">{{ currentLevel.level }}</span>
    </div>
    
    <!-- Info -->
    <div class="xp-info">
      <div class="level-title">{{ currentLevel.title }}</div>
      <div class="xp-bar-container">
        <div class="xp-bar" :style="{ width: xpProgress + '%' }"></div>
        <span class="xp-text">{{ playerData.xp }} / {{ nextLevel?.xpRequired || 'MAX' }} XP</span>
      </div>
    </div>
    
    <!-- Achievement Button -->
    <button class="achievement-btn" @click="$emit('openAchievements')" :title="`${unlockedCount}/${totalCount} Achievements`">
      <span class="achievement-icon">🏆</span>
      <span class="achievement-count">{{ unlockedCount }}</span>
    </button>
    
    <!-- XP Gain Popups -->
    <TransitionGroup name="xp-popup" tag="div" class="xp-popups">
      <div 
        v-for="gain in xpGainQueue" 
        :key="gain.id"
        class="xp-popup"
      >
        <span class="xp-amount">+{{ gain.amount }} XP</span>
        <span class="xp-reason" v-if="gain.reason">{{ gain.reason }}</span>
      </div>
    </TransitionGroup>
    
    <!-- Level Up Overlay -->
    <Transition name="level-up">
      <div v-if="showLevelUp" class="level-up-overlay">
        <div class="level-up-content">
          <div class="level-up-glow"></div>
          <div class="level-up-icon">⬆️</div>
          <div class="level-up-text">LEVEL UP!</div>
          <div class="level-up-level" :style="{ color: newLevelData?.color }">
            Level {{ newLevelData?.level }}
          </div>
          <div class="level-up-title">{{ newLevelData?.title }}</div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useGameProgress } from '../composables/useGameProgress.js';
import { useAchievements } from '../composables/useAchievements.js';

defineEmits(['openAchievements']);

const { 
  playerData, 
  currentLevel, 
  nextLevel, 
  xpProgress, 
  xpGainQueue,
  showLevelUp,
  newLevelData
} = useGameProgress();

const { unlockedAchievements, totalAchievements } = useAchievements();

const unlockedCount = computed(() => unlockedAchievements.value.length);
const totalCount = computed(() => totalAchievements.value);
</script>

<style scoped>
.xp-hud {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 0.75rem;
  background: rgba(0, 10, 0, 0.9);
  border: 1px solid rgba(0, 255, 0, 0.3);
  border-radius: 8px;
  position: relative;
}

/* Level Badge */
.level-badge {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: radial-gradient(circle, var(--level-color), transparent);
  border: 2px solid var(--level-color);
  border-radius: 50%;
  position: relative;
}

.level-badge::before {
  content: '';
  position: absolute;
  inset: -4px;
  border: 1px solid var(--level-color);
  border-radius: 50%;
  opacity: 0.3;
  animation: levelPulse 2s ease-in-out infinite;
}

@keyframes levelPulse {
  0%, 100% { transform: scale(1); opacity: 0.3; }
  50% { transform: scale(1.1); opacity: 0.1; }
}

.level-number {
  font-size: 1.1rem;
  font-weight: 700;
  color: #fff;
  text-shadow: 0 0 10px var(--level-color);
}

/* XP Info */
.xp-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  min-width: 140px;
}

.level-title {
  font-size: 0.7rem;
  font-weight: 600;
  color: #00ff00;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.xp-bar-container {
  position: relative;
  height: 14px;
  background: rgba(0, 255, 0, 0.1);
  border: 1px solid rgba(0, 255, 0, 0.3);
  border-radius: 7px;
  overflow: hidden;
}

.xp-bar {
  height: 100%;
  background: linear-gradient(90deg, #00aa00, #00ff00);
  box-shadow: 0 0 10px rgba(0, 255, 0, 0.5);
  transition: width 0.5s cubic-bezier(0.16, 1, 0.3, 1);
  border-radius: 7px;
}

.xp-text {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.55rem;
  font-weight: 600;
  color: #fff;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8);
}

/* Achievement Button */
.achievement-btn {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.4rem 0.6rem;
  background: rgba(255, 215, 0, 0.1);
  border: 1px solid rgba(255, 215, 0, 0.3);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.achievement-btn:hover {
  background: rgba(255, 215, 0, 0.2);
  border-color: #ffd700;
  transform: scale(1.05);
}

.achievement-icon {
  font-size: 1rem;
}

.achievement-count {
  font-size: 0.7rem;
  font-weight: 700;
  color: #ffd700;
}

/* XP Popups */
.xp-popups {
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  margin-bottom: 0.5rem;
  pointer-events: none;
}

.xp-popup {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.3rem 0.6rem;
  background: rgba(0, 255, 0, 0.2);
  border: 1px solid #00ff00;
  border-radius: 4px;
  animation: xpFloat 2s ease-out forwards;
}

@keyframes xpFloat {
  0% {
    opacity: 1;
    transform: translateY(0);
  }
  100% {
    opacity: 0;
    transform: translateY(-30px);
  }
}

.xp-amount {
  font-size: 0.8rem;
  font-weight: 700;
  color: #00ff00;
  text-shadow: 0 0 10px #00ff00;
}

.xp-reason {
  font-size: 0.55rem;
  color: rgba(0, 255, 0, 0.7);
}

.xp-popup-enter-active {
  animation: xpPopIn 0.3s ease-out;
}

@keyframes xpPopIn {
  from {
    opacity: 0;
    transform: scale(0.5) translateY(20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

/* Level Up Overlay */
.level-up-overlay {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.8);
  z-index: 9999;
  pointer-events: none;
}

.level-up-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  position: relative;
}

.level-up-glow {
  position: absolute;
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, rgba(0, 255, 0, 0.3), transparent 70%);
  animation: levelGlow 1s ease-out;
}

@keyframes levelGlow {
  from { transform: scale(0); opacity: 1; }
  to { transform: scale(2); opacity: 0; }
}

.level-up-icon {
  font-size: 4rem;
  animation: levelIcon 0.5s ease-out;
}

@keyframes levelIcon {
  from { transform: scale(0) rotate(-180deg); }
  to { transform: scale(1) rotate(0); }
}

.level-up-text {
  font-size: 2rem;
  font-weight: 700;
  color: #00ff00;
  text-shadow: 0 0 30px #00ff00;
  letter-spacing: 0.2em;
  animation: levelText 0.5s ease-out 0.2s both;
}

@keyframes levelText {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.level-up-level {
  font-size: 3rem;
  font-weight: 700;
  text-shadow: 0 0 20px currentColor;
  animation: levelNum 0.5s ease-out 0.4s both;
}

@keyframes levelNum {
  from { opacity: 0; transform: scale(0.5); }
  to { opacity: 1; transform: scale(1); }
}

.level-up-title {
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.8);
  letter-spacing: 0.1em;
  animation: levelTitle 0.5s ease-out 0.6s both;
}

@keyframes levelTitle {
  from { opacity: 0; }
  to { opacity: 1; }
}

.level-up-enter-active {
  animation: fadeIn 0.3s ease-out;
}

.level-up-leave-active {
  animation: fadeOut 0.5s ease-in;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes fadeOut {
  from { opacity: 1; }
  to { opacity: 0; }
}
</style>
