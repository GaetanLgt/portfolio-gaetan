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
      <!-- Logo — aria-label RETIRÉ (10/09/2026, deuxième tentative).
           Première correction : un aria-label plus long contenant le texte
           visible. Insuffisant — Lighthouse signalait toujours « le texte
           intérieur n'est pas inclus dans le nom accessible ».
           La bonne réponse est la plus simple : ce lien contient DÉJÀ un texte
           visible (« GL », « DIGITAL LAB », « Studio de systèmes multi-agents
           locaux ») qui forme un nom accessible parfaitement valable. Un
           aria-label posé par-dessus ne fait qu'introduire un risque de
           divergence entre ce qui est lu et ce qui est vu.
           Règle retenue : pas d'aria-label là où il y a du texte visible. -->
      <router-link to="/" class="nav-logo">
        <div class="nav-logo__icon">GL</div>
        <div class="nav-logo__text">
          <span class="nav-logo__name">DIGITAL LAB</span>
          <span class="nav-logo__tagline">Studio de systèmes multi-agents locaux</span>
        </div>
      </router-link>
      
      <!-- Desktop Navigation — parcours prospect épuré (audit Awwwards D2) -->
      <nav class="nav-desktop" aria-label="Navigation principale">
        <router-link to="/services" class="nav-link">
          <span class="nav-link__num">01</span>
          OFFRE
        </router-link>
        <router-link to="/projets" class="nav-link">
          <span class="nav-link__num">02</span>
          RÉALISATIONS
        </router-link>
        <router-link to="/arkadia" class="nav-link">
          <span class="nav-link__num">03</span>
          PREUVE
        </router-link>

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

        <!-- Parcours prospect épuré (audit Awwwards D2) -->
        <router-link to="/services" class="nav-mobile__link nav-mobile__link--solutions" @click="closeMobile">
          <span class="nav-link__num">01</span> OFFRE
        </router-link>
        <router-link to="/projets" class="nav-mobile__link nav-mobile__link--projets" @click="closeMobile">
          <span class="nav-link__num">02</span> RÉALISATIONS
        </router-link>
        <router-link to="/arkadia" class="nav-mobile__link" @click="closeMobile">
          <span class="nav-link__num">03</span> PREUVE — ARKADIA France (ARK)
        </router-link>

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
  /* Bandeau papier translucide, dérivé du jeton de charte : il suit donc
     automatiquement le fond. Une valeur rgba en dur ici redevenait claire
     alors que le reste du site était passé en sombre. */
  background: var(--paper);
  background: color-mix(in srgb, var(--paper) 88%, transparent);
  backdrop-filter: blur(14px);
  border-bottom: 1px solid var(--rule);
  transition: transform 0.3s ease, background 0.3s ease;
}

.navigation--hidden {
  transform: translateY(-100%);
}

.navigation--scrolled {
  background: var(--paper);
  background: color-mix(in srgb, var(--paper) 97%, transparent);
  box-shadow: var(--shadow-sm);
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
  border: 1px solid var(--rule);
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

/* Pastille neutre : les cinq variantes (tour, applis, arcade, galerie,
   formation) portaient chacune un code couleur propre a l'ancienne direction
   artistique. La charte D1 ne prevoit qu'UN accent. */
.nav-link--tower {
  background: var(--paper-alt);
  border: 1px solid var(--rule-strong);
  border-radius: 0.5rem;
  padding: 0.4rem 0.75rem !important;
}

/* CONTRASTE CORRIGE (13/09/2026) : l'accent a 50 % d'opacite sur le papier
   donnait #cd9888, soit 2,2:1 pour du texte de 11 px — sous le seuil de 4,5:1.
   L'opacite est supprimee et la couleur passe au jeton tertiaire (5,45:1). */
.nav-link__num {
  color: var(--ink-faint);
}

.nav-link__num::before {
  content: '/// ';
}

/* DROPDOWN */
.nav-dropdown {
  position: relative;
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
}

.nav-cta:hover {
  background: var(--primary-dark);
  color: var(--bg);
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
  background: var(--paper);
  background: color-mix(in srgb, var(--paper) 98%, transparent);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--rule);
  box-shadow: var(--shadow-md);
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

.nav-mobile::-webkit-scrollbar {
  width: 4px;
}

.nav-mobile::-webkit-scrollbar-track {
  background: transparent;
}

.nav-mobile::-webkit-scrollbar-thumb {
  background: var(--rule-strong);
  border-radius: 2px;
}
</style>
