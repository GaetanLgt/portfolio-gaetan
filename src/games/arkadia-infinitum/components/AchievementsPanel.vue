<template>
  <Transition name="panel-slide">
    <div v-if="show" class="achievements-panel" @click.self="$emit('close')">
      <div class="panel-container">
        <!-- Header -->
        <div class="panel-header">
          <button class="close-btn" @click="$emit('close')">✕</button>
          <h2>🏆 ACHIEVEMENTS</h2>
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: progressPercent + '%' }"></div>
            <span class="progress-text">{{ unlockedAchievements.length }} / {{ totalAchievements }}</span>
          </div>
        </div>
        
        <!-- Categories -->
        <div class="categories">
          <button 
            v-for="(cat, catId) in achievementsByCategory" 
            :key="catId"
            class="category-btn"
            :class="{ active: activeCategory === catId }"
            :style="{ '--cat-color': cat.color }"
            @click="activeCategory = catId"
          >
            <span class="cat-icon">{{ cat.icon }}</span>
            <span class="cat-name">{{ cat.name }}</span>
            <span class="cat-progress">
              {{ cat.achievements.filter(a => a.unlocked).length }}/{{ cat.achievements.length }}
            </span>
          </button>
        </div>
        
        <!-- Achievements Grid -->
        <div class="achievements-grid">
          <div 
            v-for="achievement in currentCategoryAchievements" 
            :key="achievement.id"
            class="achievement-card"
            :class="{ 
              unlocked: achievement.unlocked,
              secret: achievement.secret && !achievement.unlocked
            }"
          >
            <div class="card-icon">
              <span v-if="achievement.unlocked || !achievement.secret">{{ achievement.icon }}</span>
              <span v-else>❓</span>
            </div>
            <div class="card-info">
              <h3>{{ achievement.unlocked || !achievement.secret ? achievement.name : '???' }}</h3>
              <p>{{ achievement.unlocked || !achievement.secret ? achievement.description : 'Secret achievement' }}</p>
            </div>
            <div class="card-reward" v-if="achievement.unlocked || !achievement.secret">
              <span class="xp-badge">+{{ achievement.xpReward }} XP</span>
            </div>
            <div class="card-status">
              <span v-if="achievement.unlocked" class="status-unlocked">✓</span>
              <span v-else class="status-locked">🔒</span>
            </div>
          </div>
        </div>
        
        <!-- Stats Footer -->
        <div class="panel-footer">
          <div class="stat">
            <span class="stat-value">{{ unlockedAchievements.length }}</span>
            <span class="stat-label">Unlocked</span>
          </div>
          <div class="stat">
            <span class="stat-value">{{ secretsUnlocked }}</span>
            <span class="stat-label">Secrets</span>
          </div>
          <div class="stat">
            <span class="stat-value">{{ totalXpFromAchievements }}</span>
            <span class="stat-label">XP Earned</span>
          </div>
        </div>
      </div>
    </div>
  </Transition>
  
  <!-- Achievement Notification -->
  <Transition name="achievement-pop">
    <div v-if="achievementNotification" class="achievement-notification">
      <div class="notif-glow"></div>
      <div class="notif-icon">{{ achievementNotification.icon }}</div>
      <div class="notif-content">
        <span class="notif-label">ACHIEVEMENT UNLOCKED!</span>
        <span class="notif-name">{{ achievementNotification.name }}</span>
        <span class="notif-xp">+{{ achievementNotification.xpReward }} XP</span>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useAchievements, ACHIEVEMENTS } from '../composables/useAchievements.js';

const props = defineProps({
  show: Boolean
});

defineEmits(['close']);

const {
  achievementNotification,
  unlockedAchievements,
  achievementsByCategory,
  progressPercent,
  totalAchievements
} = useAchievements();

const activeCategory = ref('exploration');

const currentCategoryAchievements = computed(() => {
  return achievementsByCategory.value[activeCategory.value]?.achievements || [];
});

const secretsUnlocked = computed(() => {
  return unlockedAchievements.value.filter(id => ACHIEVEMENTS[id]?.secret).length;
});

const totalXpFromAchievements = computed(() => {
  return unlockedAchievements.value.reduce((sum, id) => {
    return sum + (ACHIEVEMENTS[id]?.xpReward || 0);
  }, 0);
});
</script>

<style scoped>
/* Panel Transition */
.panel-slide-enter-active {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
.panel-slide-leave-active {
  transition: all 0.3s ease;
}
.panel-slide-enter-from,
.panel-slide-leave-to {
  opacity: 0;
}
.panel-slide-enter-from .panel-container,
.panel-slide-leave-to .panel-container {
  transform: translateX(100%);
}

/* Panel Overlay */
.achievements-panel {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  z-index: 800;
  display: flex;
  justify-content: flex-end;
  backdrop-filter: blur(5px);
}

.panel-container {
  width: 100%;
  max-width: 500px;
  height: 100%;
  background: linear-gradient(180deg, rgba(0, 30, 0, 0.98), rgba(0, 15, 0, 0.98));
  border-left: 1px solid rgba(0, 255, 0, 0.3);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* Header */
.panel-header {
  padding: 1.5rem;
  border-bottom: 1px solid rgba(0, 255, 0, 0.2);
  position: relative;
}

.close-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(0, 255, 0, 0.1);
  border: 1px solid rgba(0, 255, 0, 0.3);
  color: #00ff00;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.2s;
}

.close-btn:hover {
  background: rgba(0, 255, 0, 0.2);
  transform: rotate(90deg);
}

.panel-header h2 {
  font-size: 1.25rem;
  color: #00ff00;
  letter-spacing: 0.1em;
  margin: 0 0 1rem;
}

.progress-bar {
  height: 20px;
  background: rgba(0, 255, 0, 0.1);
  border: 1px solid rgba(0, 255, 0, 0.3);
  border-radius: 10px;
  position: relative;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #00aa00, #00ff00);
  box-shadow: 0 0 15px rgba(0, 255, 0, 0.5);
  transition: width 0.5s ease;
}

.progress-text {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  font-weight: 600;
  color: #fff;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.8);
}

/* Categories */
.categories {
  display: flex;
  gap: 0.5rem;
  padding: 1rem;
  overflow-x: auto;
  border-bottom: 1px solid rgba(0, 255, 0, 0.1);
}

.category-btn {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.5rem 0.75rem;
  background: rgba(0, 255, 0, 0.05);
  border: 1px solid rgba(0, 255, 0, 0.2);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
  color: rgba(255, 255, 255, 0.7);
  font-family: inherit;
  font-size: 0.7rem;
}

.category-btn:hover {
  background: rgba(0, 255, 0, 0.1);
  border-color: var(--cat-color);
}

.category-btn.active {
  background: color-mix(in srgb, var(--cat-color) 20%, transparent);
  border-color: var(--cat-color);
  color: var(--cat-color);
}

.cat-icon {
  font-size: 1rem;
}

.cat-progress {
  padding: 0.15rem 0.4rem;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 4px;
  font-size: 0.6rem;
}

/* Achievements Grid */
.achievements-grid {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.achievement-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: rgba(0, 255, 0, 0.03);
  border: 1px solid rgba(0, 255, 0, 0.15);
  border-radius: 10px;
  transition: all 0.3s;
}

.achievement-card.unlocked {
  background: rgba(0, 255, 0, 0.08);
  border-color: rgba(0, 255, 0, 0.4);
}

.achievement-card.secret {
  opacity: 0.5;
  filter: grayscale(0.5);
}

.card-icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 255, 0, 0.1);
  border-radius: 12px;
  font-size: 1.5rem;
  flex-shrink: 0;
}

.achievement-card.unlocked .card-icon {
  background: rgba(0, 255, 0, 0.2);
  box-shadow: 0 0 15px rgba(0, 255, 0, 0.3);
}

.card-info {
  flex: 1;
  min-width: 0;
}

.card-info h3 {
  font-size: 0.85rem;
  color: #00ff00;
  margin: 0 0 0.25rem;
}

.card-info p {
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.5);
  margin: 0;
  line-height: 1.4;
}

.card-reward {
  flex-shrink: 0;
}

.xp-badge {
  padding: 0.25rem 0.5rem;
  background: rgba(255, 215, 0, 0.1);
  border: 1px solid rgba(255, 215, 0, 0.3);
  border-radius: 4px;
  font-size: 0.65rem;
  font-weight: 600;
  color: #ffd700;
}

.card-status {
  flex-shrink: 0;
  font-size: 1.2rem;
}

.status-unlocked {
  color: #00ff00;
  text-shadow: 0 0 10px #00ff00;
}

.status-locked {
  opacity: 0.3;
}

/* Footer */
.panel-footer {
  display: flex;
  justify-content: space-around;
  padding: 1rem;
  border-top: 1px solid rgba(0, 255, 0, 0.2);
  background: rgba(0, 0, 0, 0.3);
}

.stat {
  text-align: center;
}

.stat-value {
  display: block;
  font-size: 1.5rem;
  font-weight: 700;
  color: #00ff00;
}

.stat-label {
  font-size: 0.6rem;
  color: rgba(0, 255, 0, 0.5);
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

/* Achievement Notification */
.achievement-notification {
  position: fixed;
  top: 2rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.5rem;
  background: linear-gradient(135deg, rgba(0, 40, 0, 0.95), rgba(0, 20, 0, 0.98));
  border: 2px solid #00ff00;
  border-radius: 12px;
  box-shadow: 0 0 50px rgba(0, 255, 0, 0.4);
  z-index: 9999;
  overflow: hidden;
}

.notif-glow {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 30% 50%, rgba(0, 255, 0, 0.2), transparent 70%);
  animation: notifGlow 2s ease-in-out infinite;
}

@keyframes notifGlow {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
}

.notif-icon {
  font-size: 2.5rem;
  z-index: 1;
  animation: notifIcon 0.5s ease-out;
}

@keyframes notifIcon {
  0% { transform: scale(0) rotate(-180deg); }
  100% { transform: scale(1) rotate(0); }
}

.notif-content {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  z-index: 1;
}

.notif-label {
  font-size: 0.6rem;
  color: rgba(0, 255, 0, 0.6);
  letter-spacing: 0.15em;
}

.notif-name {
  font-size: 1rem;
  font-weight: 700;
  color: #00ff00;
  text-shadow: 0 0 10px #00ff00;
}

.notif-xp {
  font-size: 0.8rem;
  color: #ffd700;
  font-weight: 600;
}

/* Achievement Pop Animation */
.achievement-pop-enter-active {
  animation: achievementIn 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

.achievement-pop-leave-active {
  animation: achievementOut 0.4s ease-in;
}

@keyframes achievementIn {
  0% {
    opacity: 0;
    transform: translateX(-50%) translateY(-50px) scale(0.8);
  }
  100% {
    opacity: 1;
    transform: translateX(-50%) translateY(0) scale(1);
  }
}

@keyframes achievementOut {
  0% {
    opacity: 1;
    transform: translateX(-50%) translateY(0) scale(1);
  }
  100% {
    opacity: 0;
    transform: translateX(-50%) translateY(-30px) scale(0.9);
  }
}

/* Scrollbar */
.achievements-grid::-webkit-scrollbar {
  width: 6px;
}

.achievements-grid::-webkit-scrollbar-track {
  background: rgba(0, 255, 0, 0.05);
}

.achievements-grid::-webkit-scrollbar-thumb {
  background: rgba(0, 255, 0, 0.3);
  border-radius: 3px;
}
</style>
