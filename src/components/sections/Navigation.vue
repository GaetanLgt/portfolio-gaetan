<template>
  <header 
    class="navigation"
    role="banner" 
    :class="{ 
      'navigation--hidden': isHidden, 
      'navigation--scrolled': isScrolled 
    }"
  >
    <div class="container nav-container">
      <!-- Logo -->
      <router-link to="/" class="nav-logo" aria-label="Accueil GL Digital Lab">
        <div class="nav-logo__icon">GL</div>
        <div class="nav-logo__text">
          <span class="nav-logo__name">DIGITAL LAB</span>
          <span class="nav-logo__tagline">Architecture Souveraine</span>
        </div>
      </router-link>
      
      <!-- Desktop Navigation -->
      <nav class="nav-desktop" aria-label="Navigation principale">
        <!-- SOLUTIONS & RÉALISATIONS : la vente d'abord -->
        <router-link to="/services" class="nav-link">
          <span class="nav-link__num">01</span>
          SOLUTIONS
        </router-link>
        <router-link to="/projets" class="nav-link">
          <span class="nav-link__num">02</span>
          RÉALISATIONS
        </router-link>

        <!-- GL Tower Dropdown -->
        <div class="nav-dropdown">
          <button 
            class="nav-link nav-dropdown__trigger nav-link--tower"
            @click="toggleDropdown('tower')"
            :aria-expanded="activeDropdown === 'tower'"
            aria-haspopup="true"
          >
            <span class="nav-link__num">🏢</span>
            ÉQUIPAGE
            <svg class="nav-dropdown__arrow" :class="{ 'rotate': activeDropdown === 'tower' }" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </button>
          <Transition name="dropdown">
            <div v-if="activeDropdown === 'tower'" class="nav-dropdown__menu nav-dropdown__menu--tower">
              <router-link to="/hub" class="nav-dropdown__item nav-dropdown__item--featured" @click="closeDropdown">
                <span class="nav-dropdown__icon">🏢</span>
                <div>
                  <span class="nav-dropdown__title">GL Tower — Le QG</span>
                  <span class="nav-dropdown__desc">L'équipage et l'infrastructure</span>
                </div>
              </router-link>
              <router-link to="/tower" class="nav-dropdown__item nav-dropdown__item--interactive" @click="closeDropdown">
                <span class="nav-dropdown__icon">🗼</span>
                <div>
                  <span class="nav-dropdown__title">Visite Interactive</span>
                  <span class="nav-dropdown__desc">Explorez la tour en 3D</span>
                </div>
              </router-link>
              <router-link to="/agents" class="nav-dropdown__item nav-dropdown__item--agents" @click="closeDropdown">
                <span class="nav-dropdown__icon">🤖</span>
                <div>
                  <span class="nav-dropdown__title">Équipage des 6 Lois</span>
                  <span class="nav-dropdown__desc">Les agents ARKADIA</span>
                </div>
              </router-link>
              <router-link to="/workflows" class="nav-dropdown__item" @click="closeDropdown">
                <span class="nav-dropdown__icon">🔄</span>
                <div>
                  <span class="nav-dropdown__title">Workflows n8n</span>
                  <span class="nav-dropdown__desc">Automatisations en production</span>
                </div>
              </router-link>
            </div>
          </Transition>
        </div>
        
        <router-link to="/carte-holistique" class="nav-link">
          <span class="nav-link__num">03</span>
          CARTE
        </router-link>
        
        <!-- FORMATION - Masqué temporairement (droits en attente)
        <router-link to="/formation" class="nav-link nav-link--formation">
          <span class="nav-link__num">🎓</span>
          FORMATION
        </router-link>
        -->
        
        <router-link to="/contact" class="nav-cta">
          RÉSERVER UN AUDIT
        </router-link>
      </nav>
      
      <!-- Mobile Menu Button -->
      <button 
        class="nav-mobile-toggle"
        @click="mobileMenuOpen = !mobileMenuOpen"
        :aria-expanded="mobileMenuOpen"
        aria-label="Menu principal"
      >
        <span class="hamburger" :class="{ 'active': mobileMenuOpen }">
          <span></span>
          <span></span>
          <span></span>
        </span>
      </button>
    </div>
    
    <!-- Mobile Menu -->
    <Transition name="mobile-menu">
      <nav v-if="mobileMenuOpen" class="nav-mobile" aria-label="Navigation mobile">
        <router-link to="/" class="nav-mobile__link" @click="closeMobile">
          <span class="nav-link__num">00</span> ACCUEIL
        </router-link>

        <!-- VENTE D'ABORD : Solutions & Réalisations -->
        <router-link to="/services" class="nav-mobile__link nav-mobile__link--solutions" @click="closeMobile">
          <span class="nav-link__num">01</span> SOLUTIONS
        </router-link>
        <router-link to="/projets" class="nav-mobile__link nav-mobile__link--projets" @click="closeMobile">
          <span class="nav-link__num">02</span> RÉALISATIONS
        </router-link>
        
        <!-- Équipage Section -->
        <div class="nav-mobile__section">
          <span class="nav-mobile__section-title">🏢 ÉQUIPAGE</span>
        </div>
        <router-link to="/hub" class="nav-mobile__link nav-mobile__link--tower" @click="closeMobile">
          <span class="nav-link__num">🏢</span> Vue d'ensemble
        </router-link>
        <router-link to="/tower" class="nav-mobile__link nav-mobile__link--sub nav-mobile__link--interactive" @click="closeMobile">
          → 🗼 Visite Interactive 3D
        </router-link>
        <router-link to="/agents" class="nav-mobile__link nav-mobile__link--sub nav-mobile__link--agents" @click="closeMobile">
          → Équipage des 6 Lois
        </router-link>
        <router-link to="/workflows" class="nav-mobile__link nav-mobile__link--sub" @click="closeMobile">
          → Workflows n8n
        </router-link>
        <router-link to="/carte-holistique" class="nav-mobile__link nav-mobile__link--sub" @click="closeMobile">
          → 🗺️ Carte Holistique
        </router-link>

        <!-- FORMATION - Masqué temporairement (droits en attente)
        <div class="nav-mobile__section">
          <span class="nav-mobile__section-title">🎓 FORMATION</span>
        </div>
        <router-link to="/formation" class="nav-mobile__link nav-mobile__link--formation" @click="closeMobile">
          <span class="nav-link__num">🎓</span> Catalogue Formations
        </router-link>
        <router-link to="/formation/symfony-fondamentaux" class="nav-mobile__link nav-mobile__link--sub" @click="closeMobile">
          → Symfony 7 Fondamentaux
        </router-link>
        <router-link to="/formation/vue3-complet" class="nav-mobile__link nav-mobile__link--sub" @click="closeMobile">
          → Vue.js 3 Complet
        </router-link>
        <router-link to="/formation/integration-ia-web" class="nav-mobile__link nav-mobile__link--sub" @click="closeMobile">
          → Intégration IA Web
        </router-link>
        -->
        
        <!-- CTA -->
        <router-link to="/contact" class="nav-mobile__cta" @click="closeMobile">
          RÉSERVER UN AUDIT
        </router-link>
      </nav>
    </Transition>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const isHidden = ref(false);
const isScrolled = ref(false);
const activeDropdown = ref(null);
const mobileMenuOpen = ref(false);

let lastScroll = 0;

const handleScroll = () => {
  const currentScroll = window.scrollY;
  
  isScrolled.value = currentScroll > 50;
  
  if (currentScroll > lastScroll && currentScroll > 100) {
    isHidden.value = true;
    activeDropdown.value = null;
  } else {
    isHidden.value = false;
  }
  
  lastScroll = currentScroll;
};

const toggleDropdown = (name) => {
  activeDropdown.value = activeDropdown.value === name ? null : name;
};

const closeDropdown = () => {
  activeDropdown.value = null;
};

const closeMobile = () => {
  mobileMenuOpen.value = false;
};

// Close dropdown on click outside
const handleClickOutside = (e) => {
  if (!e.target.closest('.nav-dropdown')) {
    activeDropdown.value = null;
  }
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true });
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
  document.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped>
.navigation {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  height: 80px;
  /* MND : bandeau premium en couche discrète (≈6 % visible sous le voile) */
  background-image:
    linear-gradient(rgba(5, 5, 5, 0.94), rgba(5, 5, 5, 0.94)),
    url('/images/mnd/header-band-v2.png');
  background-size: cover;
  background-position: center;
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  transition: transform 0.3s ease, background 0.3s ease;
}

.navigation--hidden {
  transform: translateY(-100%);
}

.navigation--scrolled {
  background-image:
    linear-gradient(rgba(5, 5, 5, 0.97), rgba(5, 5, 5, 0.97)),
    url('/images/mnd/header-band-v2.png');
  background-size: cover;
  background-position: center;
}

.nav-container {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

/* LOGO */
.nav-logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;
  padding: 0.5rem;
  border-radius: 0.5rem;
  transition: var(--transition-base);
}

.nav-logo:hover .nav-logo__icon {
  background: var(--primary);
  color: var(--bg);
}

.nav-logo__icon {
  width: 32px;
  height: 32px;
  background: var(--primary-soft);
  border: 1px solid rgba(16, 185, 129, 0.3);
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--primary);
  transition: var(--transition-base);
}

.nav-logo__text {
  display: flex;
  flex-direction: column;
}

.nav-logo__name {
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--text-main);
  letter-spacing: 0.05em;
}

.nav-logo__tagline {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.55rem;
  color: var(--text-dark);
  text-transform: uppercase;
}

/* DESKTOP NAV */
.nav-desktop {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.7rem;
  font-weight: 500;
  color: var(--text-muted);
  text-decoration: none;
  padding: 0.5rem;
  transition: var(--transition-base);
  background: none;
  border: none;
  cursor: pointer;
}

.nav-link:hover,
.nav-link.router-link-active {
  color: var(--primary);
}

.nav-link--multivers:hover,
.nav-link--multivers.router-link-active {
  color: #a855f7;
}

.nav-link--tower {
  background: linear-gradient(135deg, rgba(251, 191, 36, 0.1), rgba(180, 83, 9, 0.1));
  border: 1px solid rgba(251, 191, 36, 0.3);
  border-radius: 0.5rem;
  padding: 0.4rem 0.75rem !important;
}

.nav-link--tower:hover,
.nav-link--tower.router-link-active {
  color: #FBBF24;
  border-color: #FBBF24;
  background: rgba(251, 191, 36, 0.15);
}

.nav-link--apps {
  background: linear-gradient(135deg, rgba(6, 182, 212, 0.1), rgba(16, 185, 129, 0.1));
  border: 1px solid rgba(6, 182, 212, 0.3);
  border-radius: 0.5rem;
  padding: 0.4rem 0.75rem !important;
}

.nav-link--apps:hover,
.nav-link--apps.router-link-active {
  color: #06B6D4;
  border-color: #06B6D4;
  background: rgba(6, 182, 212, 0.15);
}

.nav-link--arcade {
  background: linear-gradient(135deg, rgba(244, 114, 182, 0.1), rgba(168, 85, 247, 0.1));
  border: 1px solid rgba(244, 114, 182, 0.3);
  border-radius: 0.5rem;
  padding: 0.4rem 0.75rem !important;
}

.nav-link--arcade:hover,
.nav-link--arcade.router-link-active {
  color: #F472B6;
  border-color: #F472B6;
  background: rgba(244, 114, 182, 0.15);
}

.nav-link--gallery {
  background: linear-gradient(135deg, rgba(0, 255, 65, 0.1), rgba(6, 182, 212, 0.1));
  border: 1px solid rgba(0, 255, 65, 0.3);
  border-radius: 0.5rem;
  padding: 0.4rem 0.75rem !important;
}

.nav-link--gallery:hover,
.nav-link--gallery.router-link-active {
  color: #00ff41;
  border-color: #00ff41;
  background: rgba(0, 255, 65, 0.15);
}

.nav-link--formation {
  background: linear-gradient(135deg, rgba(251, 191, 36, 0.1), rgba(245, 158, 11, 0.1));
  border: 1px solid rgba(251, 191, 36, 0.3);
  border-radius: 0.5rem;
  padding: 0.4rem 0.75rem !important;
}

.nav-link--formation:hover,
.nav-link--formation.router-link-active {
  color: #FBBF24;
  border-color: #FBBF24;
  background: rgba(251, 191, 36, 0.15);
}

.nav-link__num {
  color: var(--primary);
  opacity: 0.5;
}

.nav-link__num::before {
  content: '/// ';
}

/* DROPDOWN */
.nav-dropdown {
  position: relative;
}

.nav-dropdown__trigger {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.nav-dropdown__arrow {
  transition: transform 0.2s ease;
}

.nav-dropdown__arrow.rotate {
  transform: rotate(180deg);
}

.nav-dropdown__menu {
  position: absolute;
  top: calc(100% + 1rem);
  left: 50%;
  transform: translateX(-50%);
  width: 280px;
  background: rgba(15, 15, 15, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid var(--border);
  border-radius: 1rem;
  padding: 0.5rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
  max-height: 70vh;
  overflow-y: auto;
}

.nav-dropdown__menu--multivers {
  width: 480px;
  padding: 0;
}

.multivers-header {
  padding: 1rem 1.25rem;
  background: linear-gradient(135deg, rgba(168, 85, 247, 0.2), rgba(59, 130, 246, 0.2));
  border-bottom: 1px solid rgba(168, 85, 247, 0.2);
}

.multivers-title {
  display: block;
  font-size: 0.85rem;
  font-weight: 700;
  color: #a855f7;
  margin-bottom: 0.25rem;
}

.multivers-desc {
  display: block;
  font-size: 0.65rem;
  color: var(--text-dark);
}

.multivers-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.25rem;
  padding: 0.5rem;
  max-height: 50vh;
  overflow-y: auto;
}

.nav-dropdown__item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 1rem;
  text-decoration: none;
  border-radius: 0.5rem;
  transition: var(--transition-base);
}

.nav-dropdown__item:hover {
  background: var(--primary-soft);
}

.nav-dropdown__item--featured {
  background: linear-gradient(135deg, rgba(251, 191, 36, 0.1), rgba(16, 185, 129, 0.1));
  border: 1px solid rgba(251, 191, 36, 0.2);
  margin-bottom: 0.5rem;
}

.nav-dropdown__item--featured:hover {
  background: rgba(251, 191, 36, 0.15);
  border-color: rgba(251, 191, 36, 0.4);
}

.nav-dropdown__menu--tower {
  width: 280px;
  background: linear-gradient(180deg, rgba(251, 191, 36, 0.05), rgba(15, 15, 15, 0.95));
  border-color: rgba(251, 191, 36, 0.2);
}

.nav-dropdown__item--agents {
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(6, 182, 212, 0.1));
  border: 1px solid rgba(16, 185, 129, 0.2);
}

.nav-dropdown__item--agents:hover {
  background: rgba(16, 185, 129, 0.15);
  border-color: rgba(16, 185, 129, 0.4);
}

.nav-dropdown__item--agents .nav-dropdown__title {
  color: var(--primary);
}

.nav-dropdown__item--interactive {
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(6, 182, 212, 0.1));
  border: 1px solid rgba(139, 92, 246, 0.2);
}

.nav-dropdown__item--interactive:hover {
  background: rgba(139, 92, 246, 0.15);
  border-color: rgba(139, 92, 246, 0.4);
}

.nav-dropdown__item--interactive .nav-dropdown__title {
  color: #8B5CF6;
}

.nav-dropdown__item--featured .nav-dropdown__title {
  color: #FBBF24;
}

.nav-dropdown__item--universe {
  gap: 0.75rem;
  padding: 0.6rem 0.75rem;
}

.nav-dropdown__item--universe:hover {
  background: rgba(168, 85, 247, 0.15);
}

.nav-dropdown__icon {
  font-size: 1.25rem;
}

.nav-dropdown__item--universe .nav-dropdown__icon {
  font-size: 1.1rem;
}

.nav-dropdown__title {
  display: block;
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--text-main);
}

.nav-dropdown__item--universe .nav-dropdown__title {
  font-size: 0.7rem;
}

.nav-dropdown__desc {
  display: block;
  font-size: 0.65rem;
  color: var(--text-dark);
}

.nav-dropdown__item--universe .nav-dropdown__desc {
  font-size: 0.55rem;
}

/* CTA */
.nav-cta {
  display: inline-flex;
  align-items: center;
  padding: 0.75rem 1.25rem;
  background: var(--primary);
  color: var(--bg);
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.65rem;
  font-weight: 700;
  text-decoration: none;
  border-radius: 0.5rem;
  transition: var(--transition-base);
  box-shadow: 0 4px 20px var(--primary-glow);
}

.nav-cta:hover {
  background: var(--text-main);
  box-shadow: 0 4px 25px rgba(255, 255, 255, 0.2);
}

/* MOBILE TOGGLE */
.nav-mobile-toggle {
  display: none;
  padding: 0.5rem;
  background: none;
  border: none;
  cursor: pointer;
}

.hamburger {
  display: flex;
  flex-direction: column;
  gap: 5px;
  width: 24px;
}

.hamburger span {
  display: block;
  height: 2px;
  background: var(--text-main);
  border-radius: 1px;
  transition: var(--transition-base);
}

.hamburger.active span:nth-child(1) {
  transform: rotate(45deg) translate(5px, 5px);
}

.hamburger.active span:nth-child(2) {
  opacity: 0;
}

.hamburger.active span:nth-child(3) {
  transform: rotate(-45deg) translate(5px, -5px);
}

/* MOBILE MENU */
.nav-mobile {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: rgba(5, 5, 5, 0.98);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--border);
  padding: var(--space-md);
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  max-height: 80vh;
  overflow-y: auto;
}

.nav-mobile__link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.8rem;
  color: var(--text-muted);
  text-decoration: none;
  border-radius: 0.5rem;
  transition: var(--transition-base);
}

.nav-mobile__link:hover,
.nav-mobile__link.router-link-active {
  background: var(--surface);
  color: var(--primary);
}

.nav-mobile__link--sub {
  padding-left: 2.5rem;
  font-size: 0.75rem;
  color: var(--text-dark);
}

.nav-mobile__link--universe {
  padding: 0.6rem 1rem 0.6rem 2.5rem;
}

.nav-mobile__link--universe:hover {
  color: #a855f7;
}

.nav-mobile__link--tower {
  background: linear-gradient(135deg, rgba(251, 191, 36, 0.1), rgba(180, 83, 9, 0.1));
  border: 1px solid rgba(251, 191, 36, 0.3);
}

.nav-mobile__link--tower:hover {
  background: rgba(251, 191, 36, 0.15);
  color: #FBBF24;
}

.nav-mobile__link--agents {
  color: var(--primary) !important;
  font-weight: 600;
}

.nav-mobile__link--agents:hover {
  background: rgba(16, 185, 129, 0.15);
}

.nav-mobile__link--interactive {
  color: #8B5CF6 !important;
}

.nav-mobile__link--interactive:hover {
  background: rgba(139, 92, 246, 0.15);
}

.nav-mobile__link--apps {
  background: linear-gradient(135deg, rgba(6, 182, 212, 0.1), rgba(16, 185, 129, 0.1));
  border: 1px solid rgba(6, 182, 212, 0.3);
}

.nav-mobile__link--apps:hover {
  background: rgba(6, 182, 212, 0.15);
  color: #06B6D4;
}

.nav-mobile__link--formation {
  background: linear-gradient(135deg, rgba(251, 191, 36, 0.1), rgba(245, 158, 11, 0.1));
  border: 1px solid rgba(251, 191, 36, 0.3);
}

.nav-mobile__link--formation:hover {
  background: rgba(251, 191, 36, 0.15);
  color: #FBBF24;
}

.nav-mobile__link--gallery {
  background: linear-gradient(135deg, rgba(0, 255, 65, 0.1), rgba(6, 182, 212, 0.1));
  border: 1px solid rgba(0, 255, 65, 0.3);
}

.nav-mobile__link--gallery:hover {
  background: rgba(0, 255, 65, 0.15);
  color: #00ff41;
}

.nav-mobile__link--featured {
  background: linear-gradient(135deg, rgba(251, 191, 36, 0.1), rgba(16, 185, 129, 0.1));
  border: 1px solid rgba(251, 191, 36, 0.2);
}

.nav-mobile__link--featured:hover {
  background: rgba(251, 191, 36, 0.15);
  color: #FBBF24;
}

.universe-icon {
  font-size: 1rem;
}

.nav-mobile__section {
  padding: 1rem 1rem 0.5rem;
  margin-top: 0.5rem;
  border-top: 1px solid var(--border);
}

.nav-mobile__section-title {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.7rem;
  font-weight: 700;
  color: var(--primary);
  letter-spacing: 0.1em;
}

.nav-mobile__cta {
  margin-top: var(--space-sm);
  padding: 1rem;
  background: var(--primary);
  color: var(--bg);
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.75rem;
  font-weight: 700;
  text-decoration: none;
  text-align: center;
  border-radius: 0.5rem;
}

/* TRANSITIONS */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(-10px);
}

.mobile-menu-enter-active,
.mobile-menu-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.mobile-menu-enter-from,
.mobile-menu-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

/* RESPONSIVE */
@media (max-width: 1024px) {
  .nav-desktop {
    display: none;
  }
  
  .nav-mobile-toggle {
    display: block;
  }
}

/* Scrollbar pour le dropdown */
.nav-dropdown__menu::-webkit-scrollbar,
.multivers-grid::-webkit-scrollbar {
  width: 4px;
}

.nav-dropdown__menu::-webkit-scrollbar-track,
.multivers-grid::-webkit-scrollbar-track {
  background: transparent;
}

.nav-dropdown__menu::-webkit-scrollbar-thumb,
.multivers-grid::-webkit-scrollbar-thumb {
  background: rgba(168, 85, 247, 0.3);
  border-radius: 2px;
}

.nav-mobile::-webkit-scrollbar {
  width: 4px;
}

.nav-mobile::-webkit-scrollbar-track {
  background: transparent;
}

.nav-mobile::-webkit-scrollbar-thumb {
  background: rgba(16, 185, 129, 0.3);
  border-radius: 2px;
}
</style>
