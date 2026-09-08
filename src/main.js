import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { useMatomo } from './composables/useMatomo'

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

// Mount app
app.mount('#app')

// Initialisation Matomo Analytics (RGPD-compliant)
const matomo = useMatomo()
matomo.init()
matomo.setupRouterTracking(router)

// ============================================================================
// SERVICE WORKER : désactivation définitive (2026-10)
// ============================================================================
// Le Service Worker causait des pages blanches : il servait un ancien
// index.html dont les assets hashés n'existaient plus après chaque
// déploiement CI/CD (« un service worker a intercepté la requête et a
// rencontré une erreur inattendue »).
//
// public/sw.js est désormais un KILL-SWITCH : il purge tous les caches puis
// se désenregistre, et n'intercepte aucune requête.
//
// IMPORTANT : on GARDE un register() minimal. Sans lui, les navigateurs qui
// ont déjà l'ancien SW ne vérifieraient jamais la mise à jour et le
// kill-switch ne s'activerait pas. register() force le téléchargement du
// nouveau sw.js → kill-switch → purge + unregister. Après quoi le site
// tourne en réseau direct, sans aucun SW.
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js').catch(() => {})
}

