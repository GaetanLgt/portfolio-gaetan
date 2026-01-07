<template>
  <Teleport to="body">
    <!-- Toast Container -->
    <div class="toast-container" aria-live="polite" aria-atomic="true">
      <TransitionGroup name="toast">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          class="toast"
          :class="['toast--' + toast.type, { 'toast--with-action': toast.action }]"
          role="alert"
        >
          <span class="toast-icon">{{ getIcon(toast.type) }}</span>
          <div class="toast-content">
            <span class="toast-title" v-if="toast.title">{{ toast.title }}</span>
            <span class="toast-message">{{ toast.message }}</span>
          </div>
          <button 
            v-if="toast.action" 
            class="toast-action"
            @click="handleAction(toast)"
          >
            {{ toast.action.label }}
          </button>
          <button 
            class="toast-close" 
            @click="removeToast(toast.id)"
            aria-label="Fermer"
          >
            ✕
          </button>
          <div class="toast-progress" :style="{ '--duration': toast.duration + 'ms' }"></div>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const toasts = ref([]);
let toastId = 0;

const getIcon = (type) => {
  const icons = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ',
    achievement: '🏆'
  };
  return icons[type] || 'ℹ';
};

const addToast = (options) => {
  const toast = {
    id: ++toastId,
    type: options.type || 'info',
    title: options.title || null,
    message: options.message,
    duration: options.duration || 4000,
    action: options.action || null
  };
  
  toasts.value.push(toast);
  
  // Auto remove
  if (toast.duration > 0) {
    setTimeout(() => {
      removeToast(toast.id);
    }, toast.duration);
  }
  
  return toast.id;
};

const removeToast = (id) => {
  const index = toasts.value.findIndex(t => t.id === id);
  if (index > -1) {
    toasts.value.splice(index, 1);
  }
};

const handleAction = (toast) => {
  if (toast.action?.callback) {
    toast.action.callback();
  }
  removeToast(toast.id);
};

// Helper methods
const success = (message, options = {}) => addToast({ ...options, message, type: 'success' });
const error = (message, options = {}) => addToast({ ...options, message, type: 'error' });
const warning = (message, options = {}) => addToast({ ...options, message, type: 'warning' });
const info = (message, options = {}) => addToast({ ...options, message, type: 'info' });
const achievement = (title, message, options = {}) => addToast({ ...options, title, message, type: 'achievement', duration: 5000 });

// Global event listener
const handleToastEvent = (e) => {
  const { type, ...options } = e.detail;
  switch (type) {
    case 'success': success(options.message, options); break;
    case 'error': error(options.message, options); break;
    case 'warning': warning(options.message, options); break;
    case 'achievement': achievement(options.title, options.message, options); break;
    default: info(options.message, options);
  }
};

// Expose methods
defineExpose({
  addToast,
  removeToast,
  success,
  error,
  warning,
  info,
  achievement
});

onMounted(() => {
  window.addEventListener('toast', handleToastEvent);
});

onUnmounted(() => {
  window.removeEventListener('toast', handleToastEvent);
});
</script>

<style scoped>
.toast-container {
  position: fixed;
  bottom: 1.5rem;
  right: 1.5rem;
  z-index: 99998;
  display: flex;
  flex-direction: column-reverse;
  gap: 0.75rem;
  max-width: 400px;
  pointer-events: none;
}

.toast {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 1rem 1.25rem;
  background: linear-gradient(135deg, rgba(30, 30, 40, 0.98), rgba(20, 20, 30, 0.98));
  border: 1px solid var(--toast-color, rgba(255, 255, 255, 0.1));
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4);
  pointer-events: auto;
  position: relative;
  overflow: hidden;
}

.toast-icon {
  font-size: 1.25rem;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--toast-color, rgba(255, 255, 255, 0.1));
  border-radius: 50%;
  flex-shrink: 0;
  color: var(--toast-text, #fff);
}

.toast-content {
  flex: 1;
  min-width: 0;
}

.toast-title {
  display: block;
  font-weight: 600;
  font-size: 0.9rem;
  color: #fff;
  margin-bottom: 0.2rem;
}

.toast-message {
  display: block;
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.4;
}

.toast-action {
  padding: 0.4rem 0.75rem;
  background: var(--toast-color, rgba(255, 255, 255, 0.1));
  border: none;
  border-radius: 6px;
  color: #fff;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  flex-shrink: 0;
}

.toast-action:hover {
  filter: brightness(1.2);
}

.toast-close {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.4);
  font-size: 0.7rem;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.2s;
}

.toast-close:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
}

.toast-progress {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 3px;
  background: var(--toast-color, rgba(255, 255, 255, 0.3));
  animation: progressShrink var(--duration) linear forwards;
}

@keyframes progressShrink {
  from { width: 100%; }
  to { width: 0%; }
}

/* Types */
.toast--success {
  --toast-color: rgba(16, 185, 129, 0.8);
  --toast-text: #10B981;
}

.toast--error {
  --toast-color: rgba(239, 68, 68, 0.8);
  --toast-text: #ef4444;
}

.toast--warning {
  --toast-color: rgba(245, 158, 11, 0.8);
  --toast-text: #f59e0b;
}

.toast--info {
  --toast-color: rgba(59, 130, 246, 0.8);
  --toast-text: #3b82f6;
}

.toast--achievement {
  --toast-color: rgba(255, 215, 0, 0.8);
  --toast-text: #ffd700;
  border-color: rgba(255, 215, 0, 0.4);
}

.toast--achievement .toast-icon {
  font-size: 1.5rem;
  background: transparent;
}

/* Transitions */
.toast-enter-active {
  animation: toastIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.toast-leave-active {
  animation: toastOut 0.2s ease-in;
}

@keyframes toastIn {
  from {
    opacity: 0;
    transform: translateX(100%) scale(0.9);
  }
  to {
    opacity: 1;
    transform: translateX(0) scale(1);
  }
}

@keyframes toastOut {
  from {
    opacity: 1;
    transform: translateX(0) scale(1);
  }
  to {
    opacity: 0;
    transform: translateX(100%) scale(0.9);
  }
}

/* Responsive */
@media (max-width: 480px) {
  .toast-container {
    left: 1rem;
    right: 1rem;
    bottom: 1rem;
    max-width: none;
  }
}
</style>
