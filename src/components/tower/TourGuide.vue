<template>
  <Transition name="tour">
    <div class="tour-overlay">
      <div class="tour-backdrop"></div>
      
      <div class="tour-dialog">
        <div class="tour-avatar">
          <span class="avatar-icon">{{ steps[currentStep]?.icon || '🤖' }}</span>
          <div class="avatar-rings">
            <span class="ring ring-1"></span>
            <span class="ring ring-2"></span>
          </div>
        </div>
        
        <div class="tour-content">
          <div class="tour-header">
            <span class="tour-step">Étape {{ currentStep + 1 }}/{{ steps.length }}</span>
            <button class="tour-close" @click="$emit('close')" aria-label="Fermer la visite">
              ✕
            </button>
          </div>
          
          <h3 class="tour-title">{{ steps[currentStep]?.title }}</h3>
          <p class="tour-description">{{ steps[currentStep]?.description }}</p>
          
          <div class="tour-progress">
            <div 
              class="progress-dot" 
              v-for="(step, i) in steps" 
              :key="i"
              :class="{ active: i === currentStep, completed: i < currentStep }"
            ></div>
          </div>
          
          <div class="tour-actions">
            <button 
              class="tour-btn tour-btn--prev" 
              @click="$emit('prev')"
              :disabled="currentStep === 0"
            >
              ← Précédent
            </button>
            
            <button 
              v-if="currentStep < steps.length - 1"
              class="tour-btn tour-btn--next" 
              @click="$emit('next')"
            >
              Suivant →
            </button>
            
            <button 
              v-else
              class="tour-btn tour-btn--finish" 
              @click="$emit('close')"
            >
              🚀 Commencer l'exploration
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
defineProps({
  steps: {
    type: Array,
    required: true
  },
  currentStep: {
    type: Number,
    default: 0
  }
});

defineEmits(['next', 'prev', 'close']);
</script>

<style scoped>
.tour-overlay {
  position: fixed;
  inset: 0;
  z-index: 200;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding: 2rem;
}

.tour-backdrop {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
}

.tour-dialog {
  position: relative;
  display: flex;
  gap: 1.5rem;
  max-width: 600px;
  padding: 2rem;
  background: linear-gradient(135deg, rgba(20, 20, 40, 0.98), rgba(30, 30, 50, 0.98));
  border: 1px solid rgba(16, 185, 129, 0.3);
  border-radius: 1.5rem;
  box-shadow: 
    0 25px 50px rgba(0, 0, 0, 0.5),
    0 0 100px rgba(16, 185, 129, 0.1);
}

/* Avatar */
.tour-avatar {
  position: relative;
  width: 80px;
  height: 80px;
  flex-shrink: 0;
}

.avatar-icon {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  background: rgba(16, 185, 129, 0.1);
  border: 2px solid #10B981;
  border-radius: 50%;
  z-index: 2;
}

.avatar-rings {
  position: absolute;
  inset: -10px;
}

.ring {
  position: absolute;
  inset: 0;
  border: 1px solid rgba(16, 185, 129, 0.3);
  border-radius: 50%;
  animation: ringPulse 3s ease-out infinite;
}

.ring-2 {
  animation-delay: 1.5s;
}

@keyframes ringPulse {
  0% { transform: scale(1); opacity: 0.5; }
  100% { transform: scale(1.5); opacity: 0; }
}

/* Content */
.tour-content {
  flex: 1;
}

.tour-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.tour-step {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.7rem;
  color: #10B981;
  background: rgba(16, 185, 129, 0.1);
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
}

.tour-close {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.05);
  border: none;
  border-radius: 50%;
  color: #666;
  cursor: pointer;
  transition: all 0.3s;
}

.tour-close:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
}

.tour-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #fff;
  margin-bottom: 0.5rem;
}

.tour-description {
  font-size: 0.9rem;
  color: #aaa;
  line-height: 1.7;
  margin-bottom: 1.5rem;
}

/* Progress */
.tour-progress {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.progress-dot {
  width: 8px;
  height: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  transition: all 0.3s;
}

.progress-dot.completed {
  background: #10B981;
}

.progress-dot.active {
  background: #10B981;
  box-shadow: 0 0 10px #10B981;
  transform: scale(1.3);
}

/* Actions */
.tour-actions {
  display: flex;
  gap: 0.75rem;
}

.tour-btn {
  flex: 1;
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 0.5rem;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
}

.tour-btn--prev {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #888;
}

.tour-btn--prev:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
}

.tour-btn--prev:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.tour-btn--next {
  background: rgba(16, 185, 129, 0.2);
  border: 1px solid rgba(16, 185, 129, 0.3);
  color: #10B981;
}

.tour-btn--next:hover {
  background: rgba(16, 185, 129, 0.3);
}

.tour-btn--finish {
  background: linear-gradient(135deg, #10B981, #059669);
  color: #000;
  font-weight: 600;
}

.tour-btn--finish:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(16, 185, 129, 0.3);
}

/* Transitions */
.tour-enter-active,
.tour-leave-active {
  transition: all 0.4s ease;
}

.tour-enter-from,
.tour-leave-to {
  opacity: 0;
}

.tour-enter-from .tour-dialog,
.tour-leave-to .tour-dialog {
  transform: translateY(30px);
}

/* Responsive */
@media (max-width: 600px) {
  .tour-dialog {
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 1.5rem;
  }
  
  .tour-avatar {
    width: 60px;
    height: 60px;
  }
  
  .avatar-icon {
    font-size: 2rem;
  }
  
  .tour-progress {
    justify-content: center;
  }
  
  .tour-actions {
    flex-direction: column;
  }
}
</style>
