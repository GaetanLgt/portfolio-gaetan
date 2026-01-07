<template>
  <footer class="footer" role="contentinfo">
    <div class="container">
      <!-- Decorative top line -->
      <div class="footer__deco">
        <div class="footer__deco-line"></div>
        <span class="footer__deco-text">TRANSMISSION SÉCURISÉE</span>
        <div class="footer__deco-line"></div>
      </div>
      
      <div class="footer__grid">
        
        <!-- Brand -->
        <div class="footer__section">
          <div class="footer__brand">
            <div class="footer__logo">
              <div class="logo-icon">GL</div>
              <span class="logo-name">GL DIGITAL LAB</span>
            </div>
            <p class="footer__tagline">
              Architecte de vos systèmes critiques.<br>
              Souveraineté · Observabilité · Fiabilité
            </p>
          </div>
        </div>
        
        <!-- Contact (Opquast N°100, N°102) -->
        <div class="footer__section">
          <h4 class="footer__title">Contact</h4>
          <address class="footer__address">
            <p>Gaëtan LANGLET</p>
            <p>Limoges, Nouvelle-Aquitaine (87)</p>
            <p>
              <a href="mailto:contact@gldigitallab.fr">contact@gldigitallab.fr</a>
            </p>
            <p>
              <a href="tel:+33678695881">06 78 69 58 81</a>
            </p>
          </address>
          <p class="footer__response">SLA réponse : 24h</p>
        </div>
        
        <!-- Navigation Principale -->
        <div class="footer__section">
          <h4 class="footer__title">Navigation</h4>
          <nav class="footer__nav">
            <router-link to="/">Accueil</router-link>
            <router-link to="/hub">🏢 GL Tower</router-link>
            <router-link to="/carte-holistique">🗺️ Carte Holistique</router-link>
            <router-link to="/services">Services</router-link>
            <router-link to="/projets">Projets</router-link>
            <router-link to="/contact">Contact</router-link>
          </nav>
        </div>
        
        <!-- Parcours -->
        <div class="footer__section">
          <h4 class="footer__title">Parcours</h4>
          <nav class="footer__nav">
            <router-link to="/parcours">Gaming → Dev</router-link>
            <router-link to="/conseil">Conseil des Agents</router-link>
            <router-link to="/stack-ia">Stack IA Locale</router-link>
            <router-link to="/arkadia">Case Study ARKADIA</router-link>
            <router-link to="/agents">Workflows n8n</router-link>
            <router-link to="/cv">Mon CV</router-link>
          </nav>
        </div>
        
        <!-- Expériences -->
        <div class="footer__section">
          <h4 class="footer__title">Expériences</h4>
          <nav class="footer__nav">
            <router-link to="/creations">🎨 Galerie Créations</router-link>
            <router-link to="/arcade">🕹️ Arcade</router-link>
            <router-link to="/multivers">🌌 Multivers (21)</router-link>
            <router-link to="/apps">🧰 Applications</router-link>
            <router-link to="/construct">🕳️ The Construct</router-link>
            <router-link to="/simulation">💊 Simulation</router-link>
          </nav>
        </div>
        
        <!-- Legal (Opquast N°45) -->
        <div class="footer__section">
          <h4 class="footer__title">Légal & Site</h4>
          <nav class="footer__nav" aria-label="Navigation légale">
            <router-link to="/sitemap">🗺️ Plan du site</router-link>
            <router-link to="/mentions-legales">Mentions légales</router-link>
            <router-link to="/confidentialite">Confidentialité</router-link>
            <router-link to="/cgv">CGV</router-link>
            <button 
              type="button" 
              class="footer__cookie-btn" 
              @click="openCookieSettings"
              aria-label="Gérer les préférences de cookies"
            >
              🍪 Gérer les cookies
            </button>
          </nav>
        </div>
        
      </div>
      
      <!-- Bottom -->
      <div class="footer__bottom">
        <p class="footer__copyright">
          © {{ currentYear }} GL Digital Lab · Tous droits réservés
        </p>
        <p class="footer__siret" v-if="siret">
          SIRET : {{ siret }}
        </p>
        <p class="footer__siret" v-else>
          SIRET : EN COURS
        </p>
        <div class="footer__social">
          <a 
            href="https://github.com/GaetanLgt" 
            target="_blank" 
            rel="noopener noreferrer"
            aria-label="GitHub"
          >
            GITHUB
          </a>
          <span class="footer__separator">|</span>
          <a 
            href="https://www.linkedin.com/in/gldigitallab/" 
            target="_blank" 
            rel="noopener noreferrer"
            aria-label="LinkedIn"
          >
            LINKEDIN
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { computed } from 'vue';

const currentYear = computed(() => new Date().getFullYear());
const siret = null; // TODO: Remplacer par ton vrai SIRET

// CNIL : Permet de rouvrir le bandeau cookies
function openCookieSettings() {
  // Dispatch un événement global pour rouvrir le CookieBanner
  window.dispatchEvent(new CustomEvent('open-cookie-settings'));
}
</script>

<style scoped>
.footer {
  background: var(--surface);
  border-top: 1px solid var(--border);
  padding: var(--space-lg) 0 var(--space-md);
  /* Espace pour la SelfDiagnosticBar fixe (~2.5rem) */
  padding-bottom: calc(var(--space-md) + 2.5rem);
  position: relative;
  z-index: 10;
}

/* DECO */
.footer__deco {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: var(--space-lg);
}

.footer__deco-line {
  flex: 1;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--primary), transparent);
}

.footer__deco-text {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.6rem;
  color: var(--primary);
  letter-spacing: 0.2em;
  white-space: nowrap;
}

.footer__grid {
  display: grid;
  grid-template-columns: 1.5fr repeat(5, 1fr);
  gap: var(--space-lg);
  margin-bottom: var(--space-lg);
}

.footer__section {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
}

/* BRAND */
.footer__brand {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.footer__logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.logo-icon {
  width: 20px;
  height: 20px;
  background: var(--primary);
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.5rem;
  font-weight: 700;
  color: var(--bg);
}

.logo-name {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--text-main);
}

.footer__tagline {
  font-size: 0.8rem;
  color: var(--text-muted);
  line-height: 1.6;
}

/* TITLES */
.footer__title {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.65rem;
  font-weight: 700;
  color: var(--primary);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: var(--space-xs);
}

/* ADDRESS */
.footer__address {
  font-style: normal;
  font-size: 0.8rem;
  color: var(--text-muted);
  line-height: 1.8;
}

.footer__address a {
  color: var(--text-muted);
}

.footer__address a:hover {
  color: var(--primary);
}

.footer__response {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.65rem;
  color: var(--primary);
  margin-top: var(--space-xs);
}

/* NAV */
.footer__nav {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.footer__nav a {
  font-size: 0.75rem;
  color: var(--text-muted);
  transition: var(--transition-base);
  text-decoration: none;
}

.footer__nav a:hover {
  color: var(--primary);
}

/* BOTTOM */
.footer__bottom {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-sm);
  padding-top: var(--space-md);
  border-top: 1px solid var(--border);
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.7rem;
  color: var(--text-muted);
}

.footer__siret {
  color: var(--text-dark);
}

.footer__social {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.footer__social a {
  color: var(--text-muted);
  transition: var(--transition-base);
  text-decoration: none;
}

.footer__social a:hover {
  color: var(--primary);
}

.footer__separator {
  color: var(--border);
}

/* Cookie button (CNIL) */
.footer__cookie-btn {
  background: none;
  border: none;
  padding: 0;
  font-size: 0.75rem;
  color: var(--text-muted);
  cursor: pointer;
  text-align: left;
  font-family: inherit;
  transition: var(--transition-base);
}

.footer__cookie-btn:hover {
  color: var(--primary);
}

.footer__cookie-btn:focus-visible {
  outline: 2px solid var(--primary);
  outline-offset: 2px;
}

/* RESPONSIVE */
@media (max-width: 1200px) {
  .footer__grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 900px) {
  .footer__grid {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 600px) {
  .footer__grid {
    grid-template-columns: 1fr;
    gap: var(--space-md);
  }
  
  .footer__bottom {
    flex-direction: column;
    text-align: center;
  }
}
</style>
