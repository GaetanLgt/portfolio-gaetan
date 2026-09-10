<template>
  <footer class="footer" role="contentinfo">
    <div class="container">
      <!-- Decorative top line -->
      <div class="footer__deco">
        <div class="footer__deco-line"></div>
        <span class="footer__deco-text">LA MACHINE SERT · L'HUMAIN DÉCIDE</span>
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
              Un cercle de six Lois veille sur vos outils.<br>
              Vous restez au centre — l'humain décide.
            </p>
          </div>
        </div>
        
        <!-- Contact (Opquast N°100, N°102) -->
        <div class="footer__section">
          <h3 class="footer__title">Contact</h3>
          <address class="footer__address">
            <p>Gaëtan LANGLET</p>
            <p>Harponville, Somme (80) — Hauts-de-France</p>
            <p>
              <a href="mailto:gtn.langlet+lab@gmail.com">gtn.langlet+lab@gmail.com</a>
            </p>
            <p>
              <a href="tel:+33686474610">06 86 47 46 10</a>
            </p>
          </address>
          <p class="footer__response">SLA réponse : 24h</p>
        </div>
        
        <!-- Navigation Principale — parcours prospect (audit Awwwards D2) -->
        <div class="footer__section">
          <h3 class="footer__title">Navigation</h3>
          <nav class="footer__nav">
            <router-link to="/">Accueil</router-link>
            <router-link to="/services">Offre &amp; audits</router-link>
            <router-link to="/projets">Réalisations</router-link>
            <router-link to="/arkadia">Preuve — ARKADIA France (ARK)</router-link>
            <!-- Dossier professionnel : la porte d'entrée sobre, pour les
                 acheteurs publics et les appels d'offres, qui n'ont pas à
                 traverser le récit du site concept pour trouver les prix. -->
            <router-link to="/dossier">Dossier professionnel (prix, méthode, limites)</router-link>
            <router-link to="/contact">Contact</router-link>
          </nav>
        </div>
        
        <!-- Ressources (ex-rubrique « Manifeste & coulisses » — lore retiré 09/2026) -->
        <div class="footer__section">
          <h3 class="footer__title">Ressources</h3>
          <nav class="footer__nav">
            <router-link to="/ressources/tutoriels">Tutoriels &amp; guides</router-link>
            <router-link to="/components">Composants réutilisables</router-link>
            <router-link to="/ark-admin">Snippets ARK (INI)</router-link>
          </nav>
        </div>
        
        <!-- Legal (Opquast N°45) -->
        <div class="footer__section">
          <h3 class="footer__title">Légal & Site</h3>
          <nav class="footer__nav" aria-label="Navigation légale">
            <router-link to="/sitemap">Plan du site</router-link>
            <router-link to="/mentions-legales">Mentions légales</router-link>
            <router-link to="/confidentialite">Confidentialité</router-link>
            <router-link to="/cgv">CGV</router-link>
            <!-- aria-label RETIRÉ (10/09/2026) : le bouton porte déjà le texte
                 visible « Gérer les cookies », qui est un nom accessible
                 parfaitement valable. L'ancien aria-label « Gérer les
                 préférences de cookies » ne correspondait pas au texte affiché,
                 ce que Lighthouse signale comme un défaut — un lecteur d'écran
                 annonçait autre chose que ce que l'utilisateur voyait, et un
                 agent IA ne pouvait pas faire le lien. Un texte visible clair
                 vaut mieux qu'un aria-label redondant. -->
            <button 
              type="button" 
              class="footer__cookie-btn" 
              @click="openCookieSettings"
            >
              Gérer les cookies
            </button>
            <!-- DÉCOR DE SCIENCE-FICTION (inversé le 10/09/2026) : le site
                 s'ouvre SOBRE. Ce bouton propose le décor à qui le veut —
                 pluie de code, scène 3D, Grille, halos. Avant, c'était
                 l'inverse : on imposait le spectacle et on offrait le calme. -->
            <button
              type="button"
              class="footer__cookie-btn"
              :aria-pressed="decorActif ? 'true' : 'false'"
              @click="basculerDecor"
            >
              {{ decorActif ? 'Revenir au mode sobre' : 'Activer le décor' }}
            </button>
            <!-- AUDIO DU POSTE (doctrine D5, expérience signature n°5) :
                 DÉSACTIVÉ par défaut. Aucun son ne se déclenche tant que le
                 visiteur ne l'a pas demandé — un site qui fait du bruit à
                 l'arrivée est une nuisance. Tout est synthétisé en Web Audio :
                 zéro fichier son à télécharger. -->
            <button
              type="button"
              class="footer__cookie-btn"
              :aria-pressed="audioActif ? 'true' : 'false'"
              @click="basculerAudio"
            >
              {{ audioActif ? 'Couper le son' : 'Activer le son' }}
            </button>
          </nav>
        </div>
        
      </div>
      
      <!-- Bottom -->
      <div class="footer__bottom">
        <p class="footer__copyright">
          © {{ currentYear }} GL Digital Lab · Tous droits réservés
        </p>
        <!-- Rien n'est affiche tant qu'il n'y a pas de SIRET reel :
             « EN COURS » signale a un prospect qu'aucune facture n'est possible. -->
        <p class="footer__siret" v-if="siret">
          SIRET : {{ siret }}
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
import { decorActif, basculerDecor } from '@/composables/mode-sobre.js';
import { audioActif, basculerAudio } from '@/composables/audio-poste.js';

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
  /* DS clair (D1) : fond papier altéré + filet — le voile noir et l'image
     footer-bg-v2 (thème MND sombre) sont retirés. */
  background-color: var(--surface);
  border-top: 1px solid var(--rule);
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
  background: linear-gradient(90deg, transparent, var(--rule-strong), transparent);
}

.footer__deco-text {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.6rem;
  color: var(--ink-soft);
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
  color: var(--ink);
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
  color: var(--ink);
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
