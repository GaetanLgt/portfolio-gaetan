<template>
  <nav class="navigation" :class="{ 'navigation--hidden': !showNav }">
    <div class="container">
      <div class="navigation__content">
        <router-link to="/" class="navigation__logo">
          <span class="text-gradient">GL Digital Lab</span>
        </router-link>
        <div class="navigation__links">
          <router-link v-for="link in links" :key="link.path" :to="link.path" class="navigation__link" active-class="navigation__link--active">
            {{ link.label }}
          </router-link>
          <router-link to="/contact" class="navigation__cta">
            Contact
          </router-link>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const links = [
  { path: '/', label: 'Accueil' },
  { path: '/services', label: 'Services' },
  { path: '/arkadia', label: 'Case Study' },
  { path: '/conseil', label: 'Matrice' },
  { path: '/stack-ia', label: 'Stack IA' }
];

const showNav = ref(true);
let lastScroll = 0;

const handleScroll = () => {
  const currentScroll = window.pageYOffset;
  if (currentScroll <= 0) {
    showNav.value = true;
    return;
  }
  if (currentScroll > lastScroll && currentScroll > 100) {
    showNav.value = false;
  } else {
    showNav.value = true;
  }
  lastScroll = currentScroll;
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<style scoped>
.navigation {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: rgba(13, 13, 13, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--border-subtle);
  transition: transform var(--transition-base);
}

.navigation--hidden {
  transform: translateY(-100%);
}

.navigation__content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 0;
}

.navigation__logo {
  font-family: 'JetBrains Mono', monospace;
  font-size: 1.25rem;
  font-weight: 700;
}

.navigation__links {
  display: flex;
  gap: var(--space-sm);
  align-items: center;
}

.navigation__link {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.875rem;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  transition: all var(--transition-base);
  position: relative;
}

.navigation__link::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 0;
  height: 2px;
  background: var(--matrix-green);
  transition: all var(--transition-base);
  transform: translateX(-50%);
}

.navigation__link:hover::after,
.navigation__link--active::after {
  width: 80%;
}

.navigation__link:hover,
.navigation__link--active {
  color: var(--matrix-green);
}

.navigation__cta {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.875rem;
  padding: 0.5rem 1rem;
  background: var(--matrix-green);
  color: var(--code-dark);
  border-radius: 6px;
  transition: all var(--transition-base);
  margin-left: var(--space-sm);
}

.navigation__cta:hover {
  background: transparent;
  color: var(--matrix-green);
  border: 1px solid var(--matrix-green);
}

@media (max-width: 968px) {
  .navigation__logo {
    font-size: 1rem;
  }
  
  .navigation__links {
    gap: 0.5rem;
  }
  
  .navigation__link {
    font-size: 0.75rem;
    padding: 0.5rem;
  }
  
  .navigation__cta {
    font-size: 0.75rem;
    padding: 0.5rem 0.75rem;
  }
}

@media (max-width: 768px) {
  .navigation__links {
    flex-wrap: wrap;
    justify-content: flex-end;
  }
}
</style>
