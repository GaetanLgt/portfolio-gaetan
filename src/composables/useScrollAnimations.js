import { onMounted, onUnmounted } from 'vue';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function useScrollAnimations() {
  
  const fadeInUp = (selector, options = {}) => {
    const defaults = {
      y: 40,
      x: 0,
      opacity: 0,
      duration: 0.8,
      stagger: 0.1,
      ease: 'power3.out',
      start: 'top 85%'
    };
    
    const config = { ...defaults, ...options };
    
    gsap.utils.toArray(selector).forEach((el, i) => {
      gsap.fromTo(el,
        { y: config.y, x: config.x, opacity: 0 },
        {
          y: 0,
          x: 0,
          opacity: 1,
          duration: config.duration,
          delay: i * config.stagger,
          ease: config.ease,
          scrollTrigger: {
            trigger: el,
            start: config.start,
            toggleActions: 'play none none reverse'
          }
        }
      );
    });
  };
  
  const fadeIn = (selector, options = {}) => {
    const defaults = {
      opacity: 0,
      duration: 1,
      ease: 'power2.out',
      start: 'top 80%'
    };
    
    const config = { ...defaults, ...options };
    
    gsap.utils.toArray(selector).forEach((el) => {
      gsap.fromTo(el,
        { opacity: 0 },
        {
          opacity: 1,
          duration: config.duration,
          ease: config.ease,
          scrollTrigger: {
            trigger: el,
            start: config.start,
            toggleActions: 'play none none reverse'
          }
        }
      );
    });
  };
  
  const scaleIn = (selector, options = {}) => {
    const defaults = {
      scale: 0.9,
      opacity: 0,
      duration: 0.6,
      ease: 'back.out(1.7)',
      start: 'top 85%'
    };
    
    const config = { ...defaults, ...options };
    
    gsap.utils.toArray(selector).forEach((el) => {
      gsap.fromTo(el,
        { scale: config.scale, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: config.duration,
          ease: config.ease,
          scrollTrigger: {
            trigger: el,
            start: config.start,
            toggleActions: 'play none none reverse'
          }
        }
      );
    });
  };
  
  const slideInLeft = (selector, options = {}) => {
    const defaults = {
      x: -50,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out',
      start: 'top 85%'
    };
    
    const config = { ...defaults, ...options };
    
    gsap.utils.toArray(selector).forEach((el) => {
      gsap.fromTo(el,
        { x: config.x, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: config.duration,
          ease: config.ease,
          scrollTrigger: {
            trigger: el,
            start: config.start,
            toggleActions: 'play none none reverse'
          }
        }
      );
    });
  };
  
  const staggerCards = (containerSelector, cardSelector, options = {}) => {
    const defaults = {
      y: 60,
      opacity: 0,
      duration: 0.6,
      stagger: 0.15,
      ease: 'power3.out',
      start: 'top 80%'
    };
    
    const config = { ...defaults, ...options };
    
    const container = document.querySelector(containerSelector);
    if (!container) return;
    
    const cards = container.querySelectorAll(cardSelector);
    
    gsap.fromTo(cards,
      { y: config.y, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: config.duration,
        stagger: config.stagger,
        ease: config.ease,
        scrollTrigger: {
          trigger: container,
          start: config.start,
          toggleActions: 'play none none reverse'
        }
      }
    );
  };
  
  const cleanup = () => {
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());
  };
  
  onUnmounted(() => {
    cleanup();
  });
  
  return {
    fadeInUp,
    fadeIn,
    scaleIn,
    slideInLeft,
    staggerCards,
    cleanup,
    gsap,
    ScrollTrigger
  };
}
