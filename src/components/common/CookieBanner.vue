<template>
  <Transition name="cookie-banner">
    <div v-if="showBanner" class="cookie-banner" role="dialog" aria-labelledby="cookie-title" aria-describedby="cookie-desc">
      <div class="cookie-content">
        <div class="cookie-text">
          <h3 id="cookie-title">Respect de votre vie privée</h3>
          <p id="cookie-desc">
            Ce site utilise <strong>Matomo Analytics</strong> (hébergé en France) pour mesurer l'audience. 
            Vos données restent anonymes et ne sont jamais partagées. 
            <router-link to="/confidentialite" @click="showBanner = false">En savoir plus</router-link>
          </p>
        </div>
      </div>
      
      <div class="cookie-actions">
        <button class="cookie-btn cookie-btn--settings" @click="showSettings = !showSettings">
          Personnaliser
        </button>
        <button class="cookie-btn cookie-btn--reject" @click="rejectAll">
          Refuser
        </button>
        <button class="cookie-btn cookie-btn--accept" @click="acceptAll">
          ✓ Accepter
        </button>
      </div>

      <!-- Settings Panel -->
      <Transition name="settings">
        <div v-if="showSettings" class="cookie-settings">
          <div class="setting-item">
            <div class="setting-info">
              <span class="setting-name">🔒 Cookies essentiels</span>
              <span class="setting-desc">Nécessaires au fonctionnement du site</span>
            </div>
            <span class="setting-badge setting-badge--required">Requis</span>
          </div>
          
          <div class="setting-item">
            <div class="setting-info">
              <span class="setting-name">📊 Analytics (Matomo)</span>
              <span class="setting-desc">Mesure d'audience anonyme, données hébergées en France</span>
            </div>
            <label class="toggle">
              <input type="checkbox" v-model="consent.analytics">
              <span class="toggle-slider"></span>
            </label>
          </div>
          
          <div class="setting-item">
            <div class="setting-info">
              <span class="setting-name">🎨 Préférences</span>
              <span class="setting-desc">Mémoriser vos choix (thème, langue)</span>
            </div>
            <label class="toggle">
              <input type="checkbox" v-model="consent.preferences">
              <span class="toggle-slider"></span>
            </label>
          </div>

          <button class="cookie-btn cookie-btn--save" @click="saveSettings">
            Enregistrer mes choix
          </button>
        </div>
      </Transition>
    </div>
  </Transition>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue';
import { useMatomo } from '@/composables/useMatomo';

const matomo = useMatomo();

const showBanner = ref(false);
const showSettings = ref(false);

const consent = reactive({
  essential: true, // Toujours true
  analytics: true,
  preferences: true
});

const CONSENT_KEY = 'gl_cookie_consent';

// Vérifier si consentement déjà donné
onMounted(() => {
  const savedConsent = localStorage.getItem(CONSENT_KEY);
  if (!savedConsent) {
    // Délai pour ne pas afficher immédiatement
    setTimeout(() => {
      showBanner.value = true;
    }, 1500);
  } else {
    // Charger les préférences sauvegardées
    const parsed = JSON.parse(savedConsent);
    Object.assign(consent, parsed);
    applyConsent();
  }
  
  // CNIL : Écoute l'événement pour rouvrir le bandeau
  window.addEventListener('open-cookie-settings', () => {
    showBanner.value = true;
    showSettings.value = true;
  });
});

onUnmounted(() => {
  window.removeEventListener('open-cookie-settings', () => {});
});

const acceptAll = () => {
  consent.analytics = true;
  consent.preferences = true;
  saveConsent();
};

const rejectAll = () => {
  consent.analytics = false;
  consent.preferences = false;
  saveConsent();
};

const saveSettings = () => {
  saveConsent();
};

const saveConsent = () => {
  const consentData = {
    essential: true,
    analytics: consent.analytics,
    preferences: consent.preferences,
    timestamp: new Date().toISOString()
  };
  
  localStorage.setItem(CONSENT_KEY, JSON.stringify(consentData));
  showBanner.value = false;
  showSettings.value = false;
  applyConsent();
};

const applyConsent = () => {
  // Synchroniser avec Matomo via le composable
  if (consent.analytics) {
    matomo.giveConsent();
    window.dispatchEvent(new CustomEvent('consent:analytics', { detail: true }));
  } else {
    matomo.refuseConsent();
    window.dispatchEvent(new CustomEvent('consent:analytics', { detail: false }));
  }
};

// Exposer pour permettre de rouvrir le bandeau
defineExpose({ showBanner, consent });
</script>

<style scoped>
.cookie-banner {
  position: fixed;
  bottom: 1.5rem;
  left: 1.5rem;
  right: 1.5rem;
  max-width: 600px;
  background: rgba(10, 10, 15, 0.98);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(217, 105, 74, 0.35);
  border-radius: 1rem;
  padding: 1.5rem;
  z-index: 9999;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
}

.cookie-content {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.25rem;
}

.cookie-icon {
  font-size: 2rem;
  flex-shrink: 0;
}

.cookie-text h3 {
  font-size: 1rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 0.5rem;
}

.cookie-text p {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.5;
  margin: 0;
}

.cookie-text a {
  color: #D9694A;
  text-decoration: underline;
}

.cookie-actions {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.cookie-btn {
  padding: 0.6rem 1.25rem;
  border-radius: 0.5rem;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
}

.cookie-btn--accept {
  /* D5 : accepter est une ACTION → jaune, texte sombre (15,44:1 mesuré). */
  background: var(--action);
  color: var(--action-ink);
  flex: 1;
}

.cookie-btn--accept:hover {
  background: var(--action-dark);
  transform: translateY(-1px);
}

.cookie-btn--reject {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 0.7);
}

.cookie-btn--reject:hover {
  border-color: rgba(255, 255, 255, 0.4);
  color: #fff;
}

.cookie-btn--settings {
  /* D5 : « paramétrer » n'est ni une action franche ni une alerte → cyan. */
  background: transparent;
  border: 1px solid rgba(0, 229, 255, 0.4);
  color: var(--neon-cyan);
}

.cookie-btn--settings:hover {
  background: rgba(0, 229, 255, 0.12);
}

.cookie-btn--save {
  width: 100%;
  margin-top: 1rem;
  background: var(--action);
  color: var(--action-ink);
}

/* Settings Panel */
.cookie-settings {
  margin-top: 1.25rem;
  padding-top: 1.25rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.setting-item:last-of-type {
  border-bottom: none;
}

.setting-info {
  flex: 1;
}

.setting-name {
  display: block;
  font-size: 0.85rem;
  font-weight: 600;
  color: #fff;
  margin-bottom: 0.25rem;
}

.setting-desc {
  display: block;
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.5);
}

.setting-badge {
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.65rem;
  font-weight: 600;
}

.setting-badge--required {
  background: rgba(16, 185, 129, 0.2);
  color: #10b981;
}

/* Toggle Switch */
.toggle {
  position: relative;
  display: inline-block;
  width: 44px;
  height: 24px;
  cursor: pointer;
}

.toggle input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-slider {
  position: absolute;
  inset: 0;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  transition: 0.3s;
}

.toggle-slider::before {
  content: '';
  position: absolute;
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
  background: #fff;
  border-radius: 50%;
  transition: 0.3s;
}

.toggle input:checked + .toggle-slider {
  background: #10b981;
}

.toggle input:checked + .toggle-slider::before {
  transform: translateX(20px);
}

/* Transitions */
.cookie-banner-enter-active,
.cookie-banner-leave-active {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.cookie-banner-enter-from,
.cookie-banner-leave-to {
  opacity: 0;
  transform: translateY(100px);
}

.settings-enter-active,
.settings-leave-active {
  transition: all 0.3s ease;
}

.settings-enter-from,
.settings-leave-to {
  opacity: 0;
  max-height: 0;
}

/* Responsive */
@media (max-width: 640px) {
  .cookie-banner {
    left: 0.75rem;
    right: 0.75rem;
    bottom: 0.75rem;
    padding: 1.25rem;
  }
  
  .cookie-content {
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .cookie-icon {
    font-size: 1.5rem;
  }
  
  .cookie-actions {
    flex-direction: column;
  }
  
  .cookie-btn {
    width: 100%;
    text-align: center;
  }
}
</style>
