import { ref, watch } from 'vue';

export function useCounter(target, duration = 2000) {
  const count = ref(0);
  let animationFrame;
  let startTime;
  let startValue = 0;

  const animate = (currentTime) => {
    if (!startTime) startTime = currentTime;
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // Easing function (easeOutCubic)
    const eased = 1 - Math.pow(1 - progress, 3);
    
    const targetValue = typeof target.value === 'number' ? target.value : parseFloat(target.value) || 0;
    count.value = startValue + (targetValue - startValue) * eased;
    
    if (progress < 1) {
      animationFrame = requestAnimationFrame(animate);
    } else {
      count.value = targetValue;
    }
  };

  watch(target, (newValue) => {
    if (animationFrame) {
      cancelAnimationFrame(animationFrame);
    }
    startValue = count.value;
    startTime = null;
    animationFrame = requestAnimationFrame(animate);
  }, { immediate: true });

  return { count };
}
