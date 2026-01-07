import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { useMatomo } from './composables/useMatomo'

// Naive UI
import naive from 'naive-ui'

// Fonts self-hosted (performance)
import './assets/styles/fonts.css'

// Styles critiques et optimisations
import './assets/styles/variables.css'
import './assets/styles/critical.css'
import './assets/styles/global.css'
import './assets/styles/a11y.css'
import './assets/styles/polish.css'

const app = createApp(App)

app.use(router)
app.use(naive)

// Mount app
app.mount('#app')

// Initialisation Matomo Analytics (RGPD-compliant)
const matomo = useMatomo()
matomo.init()
matomo.setupRouterTracking(router)

// ============================================================================
// SERVICE WORKER REGISTRATION (PWA)
// ============================================================================
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('[PWA] Service Worker registered:', registration.scope);
        
        // Check for updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // New version available
                console.log('[PWA] New version available!');
                // Could show a toast notification here
                window.dispatchEvent(new CustomEvent('sw:update-available'));
              }
            });
          }
        });
      })
      .catch((error) => {
        console.error('[PWA] Service Worker registration failed:', error);
      });
  });
}
