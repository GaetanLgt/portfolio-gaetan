/**
 * useMatomo - Composable Vue 3 pour Matomo Analytics
 * RGPD-compliant avec gestion du consentement
 * 
 * @author GL Digital Lab
 * @version 1.1.0
 */

import { ref, readonly } from 'vue';

// État global du consentement (persisté en localStorage)
const CONSENT_KEY = 'gl_analytics_consent';
const consentGiven = ref(false);
const consentAsked = ref(false);
const isLoaded = ref(false);

// Config Matomo depuis env
const MATOMO_URL = import.meta.env.VITE_MATOMO_URL || '';
const MATOMO_SITE_ID = import.meta.env.VITE_MATOMO_SITE_ID || '1';

// Matomo activé si l'URL est définie ET que VITE_MATOMO_ENABLED === 'true'
// En dev (npm run dev), on peut forcer à false via .env
const MATOMO_ENABLED = Boolean(
  MATOMO_URL && 
  import.meta.env.VITE_MATOMO_ENABLED === 'true'
);

// Debug (visible dans la console)
console.log('[Matomo] Config:', {
  url: MATOMO_URL,
  siteId: MATOMO_SITE_ID,
  enabled: MATOMO_ENABLED,
  mode: import.meta.env.MODE
});

// Initialise l'état depuis localStorage
function initState() {
  try {
    const stored = localStorage.getItem(CONSENT_KEY);
    consentAsked.value = stored !== null;
    consentGiven.value = stored === 'true';
  } catch (e) {
    // localStorage non disponible (mode privé, etc.)
    console.warn('[Matomo] localStorage not available');
  }
}

// Appel initial
initState();

/**
 * Initialise le script Matomo
 */
function loadMatomoScript() {
  if (isLoaded.value || !MATOMO_URL || !MATOMO_ENABLED) return;
  
  // Initialise _paq
  window._paq = window._paq || [];
  
  // Configuration de base
  window._paq.push(['setTrackerUrl', `${MATOMO_URL}/matomo.php`]);
  window._paq.push(['setSiteId', MATOMO_SITE_ID]);
  
  // Options RGPD
  window._paq.push(['requireConsent']); // Attend le consentement
  window._paq.push(['enableLinkTracking']);
  
  // Respect Do Not Track
  window._paq.push(['setDoNotTrack', true]);
  
  // Désactive les cookies si pas de consentement (mode dégradé)
  if (!consentGiven.value) {
    window._paq.push(['disableCookies']);
  }
  
  // Charge le script Matomo
  const script = document.createElement('script');
  script.async = true;
  script.src = `${MATOMO_URL}/matomo.js`;
  script.onload = () => {
    isLoaded.value = true;
    console.log('[Matomo] Script loaded');
    
    // Si consentement déjà donné, active le tracking
    if (consentGiven.value) {
      window._paq.push(['setConsentGiven']);
      window._paq.push(['trackPageView']);
    }
  };
  script.onerror = () => {
    console.error('[Matomo] Failed to load script');
  };
  
  document.head.appendChild(script);
}

/**
 * Track une page view (appelé par le router)
 */
function trackPageView(path, title) {
  if (consentGiven.value && window._paq) {
    window._paq.push(['setCustomUrl', path]);
    window._paq.push(['setDocumentTitle', title || document.title]);
    window._paq.push(['trackPageView']);
  }
}

/**
 * Composable principal
 */
export function useMatomo() {
  /**
   * Initialise Matomo (à appeler une fois au démarrage)
   */
  function init() {
    if (!MATOMO_ENABLED) {
      console.log('[Matomo] Disabled - skipping init');
      return;
    }
    
    loadMatomoScript();
  }
  
  /**
   * Configure le tracking automatique des routes
   * À appeler dans App.vue avec le router
   */
  function setupRouterTracking(router) {
    if (!MATOMO_ENABLED) return;
    
    router.afterEach((to) => {
      // Petit délai pour laisser le titre se mettre à jour
      setTimeout(() => {
        trackPageView(to.fullPath, document.title);
      }, 100);
    });
  }
  
  /**
   * Donne le consentement et active le tracking complet
   */
  function giveConsent() {
    consentGiven.value = true;
    consentAsked.value = true;
    
    try {
      localStorage.setItem(CONSENT_KEY, 'true');
    } catch (e) {
      console.warn('[Matomo] Could not save consent');
    }
    
    if (window._paq) {
      window._paq.push(['rememberConsentGiven']);
      window._paq.push(['setConsentGiven']);
      window._paq.push(['trackPageView']);
    }
  }
  
  /**
   * Refuse le consentement (tracking minimal sans cookies)
   */
  function refuseConsent() {
    consentGiven.value = false;
    consentAsked.value = true;
    
    try {
      localStorage.setItem(CONSENT_KEY, 'false');
    } catch (e) {
      console.warn('[Matomo] Could not save consent');
    }
    
    if (window._paq) {
      window._paq.push(['forgetConsentGiven']);
      window._paq.push(['disableCookies']);
    }
  }
  
  /**
   * Réinitialise le choix (pour permettre de re-choisir)
   */
  function resetConsent() {
    consentGiven.value = false;
    consentAsked.value = false;
    
    try {
      localStorage.removeItem(CONSENT_KEY);
    } catch (e) {
      console.warn('[Matomo] Could not remove consent');
    }
    
    if (window._paq) {
      window._paq.push(['forgetConsentGiven']);
    }
  }
  
  /**
   * Track un événement personnalisé
   */
  function trackEvent(category, action, name = '', value = 0) {
    if (consentGiven.value && window._paq) {
      window._paq.push(['trackEvent', category, action, name, value]);
    }
  }
  
  /**
   * Track une recherche interne
   */
  function trackSearch(keyword, category = '', resultsCount = 0) {
    if (consentGiven.value && window._paq) {
      window._paq.push(['trackSiteSearch', keyword, category, resultsCount]);
    }
  }
  
  /**
   * Track un téléchargement ou lien externe
   */
  function trackLink(url, linkType = 'link') {
    if (consentGiven.value && window._paq) {
      window._paq.push(['trackLink', url, linkType]);
    }
  }
  
  /**
   * Track une conversion/goal
   */
  function trackGoal(goalId, customRevenue = 0) {
    if (consentGiven.value && window._paq) {
      window._paq.push(['trackGoal', goalId, customRevenue]);
    }
  }
  
  return {
    // État (readonly pour éviter mutations externes)
    consentGiven: readonly(consentGiven),
    consentAsked: readonly(consentAsked),
    isLoaded: readonly(isLoaded),
    isEnabled: MATOMO_ENABLED,
    
    // Méthodes
    init,
    setupRouterTracking,
    giveConsent,
    refuseConsent,
    resetConsent,
    trackEvent,
    trackSearch,
    trackLink,
    trackGoal
  };
}

export default useMatomo;
