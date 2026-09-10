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
      marquerNatureVisiteur();
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
    marquerNatureVisiteur();
    window._paq.push(['setCustomUrl', path]);
    window._paq.push(['setDocumentTitle', title || document.title]);
    window._paq.push(['trackPageView']);
  }
}

/**
 * NATURE DU VISITEUR (ajouté le 13/09/2026)
 *
 * Pourquoi : la dimension « type de visiteur » demandée par Gaëtan sert à
 * répondre à une seule question — est-ce que le travail d'ouverture aux agents
 * IA amène quelque chose ? Encore faut-il ne pas la deviner.
 *
 * Deux signaux, tous deux vérifiables, aucun déduit :
 *   · `navigator.webdriver` vaut true quand la page est pilotée par un outil
 *     d'automatisation (c'est un signal standard, pas une supposition) ;
 *   · une liste d'empreintes d'agents connues, comparée au user-agent.
 *
 * CE QUE CE CODE NE PEUT PAS FAIRE, et il faut le dire : un robot d'indexation
 * n'exécute pas JavaScript. Il ne verra donc jamais ce code. Et le consentement
 * étant requis, un visiteur qui n'a pas accepté n'est pas compté. Compter les
 * robots demande une autre voie : l'import des journaux serveur dans Matomo
 * (import_logs.py), qui lit les journaux d'accès o2switch. C'est une action
 * côté hébergement, pas côté site.
 */
const EMPREINTES_AGENT = [
  'gptbot', 'chatgpt-user', 'oai-searchbot', 'claudebot', 'claude-user',
  'anthropic-ai', 'perplexitybot', 'perplexity-user', 'ccbot', 'bytespider',
  'amazonbot', 'applebot', 'meta-externalagent', 'duckassistbot', 'youbot',
  'cohere-ai', 'mistralai', 'diffbot', 'timpibot', 'omgili', 'googleother',
  'google-extended', 'petalbot', 'ai2bot'
];

function natureDuVisiteur() {
  const ua = (navigator.userAgent || '').toLowerCase();
  if (EMPREINTES_AGENT.some((m) => ua.includes(m))) return 'robot-ia';
  if (navigator.webdriver === true) return 'automatisation';
  return 'humain';
}

/**
 * Marque la visite. Deux mécanismes volontairement doublés :
 *   · une variable personnalisée de portée « visite » — elle fonctionne tout de
 *     suite, sans aucun réglage dans Matomo ;
 *   · une dimension personnalisée (identifiant 1) — plus propre si Gaëtan la
 *     crée dans Administration > Dimensions personnalisées. Tant qu'elle
 *     n'existe pas, Matomo ignore simplement la ligne.
 */
function marquerNatureVisiteur() {
  if (!window._paq) return;
  const nature = natureDuVisiteur();
  window._paq.push(['setCustomVariable', 1, 'Nature du visiteur', nature, 'visit']);
  window._paq.push(['setCustomDimension', 1, nature]);
}

/**
 * Suivi des liens de contact directs (courriel et téléphone).
 *
 * `enableLinkTracking` de Matomo ne couvre ni `mailto:` ni `tel:` : ces clics
 * étaient donc invisibles. Or ce sont les conversions les plus directes du
 * site. Un seul écouteur global couvre toutes les pages (pied de page, page de
 * contact, dossier, mentions légales, confidentialité) plutôt que de modifier
 * cinq fichiers.
 */
let ecouteurContactPose = false;

function suivreLiensDeContact() {
  if (ecouteurContactPose || typeof document === 'undefined') return;
  ecouteurContactPose = true;

  document.addEventListener('click', (e) => {
    const lien = e.target && e.target.closest ? e.target.closest('a[href^="mailto:"], a[href^="tel:"]') : null;
    if (!lien) return;
    const estTelephone = lien.getAttribute('href').startsWith('tel:');
    // On ne transmet ni l'adresse ni le numéro : seulement le fait qu'un
    // visiteur a choisi ce canal, et sur quelle page.
    trackEvent('Contact', estTelephone ? 'clic-telephone' : 'clic-courriel', window.location.pathname);
  }, { passive: true });
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

    suivreLiensDeContact();
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
      marquerNatureVisiteur();
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
