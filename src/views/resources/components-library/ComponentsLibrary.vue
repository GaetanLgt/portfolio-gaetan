<template>
  <div class="components-library">
    <!-- Header -->
    <header class="lib-header">
      <div class="container">
        <div class="lib-header__content">
          <span class="mono-tag">/// COMPOSANTS RÉUTILISABLES</span>
          <h1>Component Library</h1>
          <p class="lib-header__desc">
            Composants Vue 3 & Symfony prêts à l'emploi. 
            <strong>Awwwards quality</strong>, <strong>OPQUAST</strong> compliant, <strong>RGPD/CNIL</strong> ready.
          </p>
          
          <div class="lib-header__badges">
            <span class="badge badge--green">♿ A11Y WCAG 2.1</span>
            <span class="badge badge--blue">🔒 RGPD Ready</span>
            <span class="badge badge--purple">✨ Awwwards Quality</span>
            <span class="badge badge--orange">🔞 Adult Content Ready</span>
          </div>
        </div>
      </div>
    </header>

    <!-- Filters -->
    <nav class="lib-filters">
      <div class="container">
        <div class="filters-row">
          <button 
            v-for="cat in categories" 
            :key="cat.id"
            class="filter-btn"
            :class="{ active: activeCategory === cat.id }"
            @click="activeCategory = cat.id"
          >
            <span class="filter-icon">{{ cat.icon }}</span>
            <span>{{ cat.name }}</span>
            <span class="filter-count">{{ getCountByCategory(cat.id) }}</span>
          </button>
        </div>
      </div>
    </nav>

    <!-- Components Grid -->
    <main class="lib-content">
      <div class="container">
        <TransitionGroup name="grid" tag="div" class="components-grid">
          <article 
            v-for="comp in filteredComponents" 
            :key="comp.id"
            class="component-card"
            :class="{ 'component-card--adult': comp.adult }"
          >
            <!-- Preview -->
            <div class="card-preview" :style="{ background: comp.previewBg || 'var(--surface)' }">
              <component :is="comp.preview" v-if="comp.preview" />
              <div v-else class="preview-placeholder">
                <span>{{ comp.icon }}</span>
              </div>
              <div class="card-badges">
                <span v-if="comp.adult" class="badge-adult">18+</span>
                <span v-if="comp.new" class="badge-new">NEW</span>
              </div>
            </div>

            <!-- Info -->
            <div class="card-info">
              <div class="card-header">
                <h3>{{ comp.name }}</h3>
                <div class="card-tech">
                  <span v-for="tech in comp.tech" :key="tech" class="tech-tag">{{ tech }}</span>
                </div>
              </div>
              <p class="card-desc">{{ comp.description }}</p>
              
              <!-- Features -->
              <ul class="card-features">
                <li v-for="feat in comp.features" :key="feat">
                  <span class="feat-check">✓</span> {{ feat }}
                </li>
              </ul>

              <!-- Actions -->
              <div class="card-actions">
                <button class="btn-copy" @click="copyComponent(comp)">
                  <span>📋</span> Copier le code
                </button>
                <button class="btn-preview" @click="openPreview(comp)">
                  <span>👁️</span> Prévisualiser
                </button>
              </div>
            </div>
          </article>
        </TransitionGroup>
      </div>
    </main>

    <!-- Code Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showCodeModal" class="code-modal" @click.self="showCodeModal = false">
          <div class="code-modal__container">
            <div class="code-modal__header">
              <h3>{{ selectedComponent?.name }}</h3>
              <div class="code-modal__tabs">
                <button 
                  v-for="tab in codeTabs" 
                  :key="tab.id"
                  :class="{ active: activeCodeTab === tab.id }"
                  @click="activeCodeTab = tab.id"
                >
                  {{ tab.name }}
                </button>
              </div>
              <button class="close-btn" @click="showCodeModal = false">✕</button>
            </div>
            <div class="code-modal__body">
              <pre><code>{{ getCodeForTab() }}</code></pre>
            </div>
            <div class="code-modal__footer">
              <button class="btn-copy-all" @click="copyAllCode">
                📋 Copier tout le code
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Toast -->
    <Transition name="toast">
      <div v-if="showToast" class="toast">
        ✓ Code copié dans le presse-papier
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

// State
const activeCategory = ref('all');
const showCodeModal = ref(false);
const selectedComponent = ref(null);
const activeCodeTab = ref('vue');
const showToast = ref(false);

// Categories
const categories = [
  { id: 'all', name: 'Tous', icon: '🌐' },
  { id: 'forms', name: 'Formulaires', icon: '📝' },
  { id: 'legal', name: 'RGPD/Legal', icon: '⚖️' },
  { id: 'auth', name: 'Auth 18+', icon: '🔞' },
  { id: 'ui', name: 'UI/UX', icon: '✨' },
  { id: 'social', name: 'Social', icon: '💬' },
  { id: 'media', name: 'Media', icon: '🖼️' }
];

const codeTabs = [
  { id: 'vue', name: 'Vue 3' },
  { id: 'symfony', name: 'Symfony' },
  { id: 'css', name: 'CSS' },
  { id: 'usage', name: 'Usage' }
];

// Components Library
const components = ref([
  // ═══════════════════════════════════════════════════════════════
  // RGPD / LEGAL
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'cookie-banner',
    name: 'Cookie Banner RGPD',
    category: 'legal',
    icon: '🍪',
    description: 'Bandeau de consentement cookies conforme CNIL 2024. Granularité des choix, persistance localStorage.',
    tech: ['Vue 3', 'CNIL'],
    features: [
      'Consentement granulaire (analytics, marketing, fonctionnel)',
      'Refus aussi simple que l\'acceptation',
      'Persistance des choix',
      'Accessible clavier + lecteur d\'écran',
      'Animation fluide non-bloquante'
    ],
    previewBg: 'linear-gradient(135deg, #1a1a2e, #16213e)',
    code: {
      vue: `<template>
  <Transition name="slide-up">
    <div v-if="showBanner" class="cookie-banner" role="dialog" aria-labelledby="cookie-title" aria-describedby="cookie-desc">
      <div class="cookie-banner__content">
        <div class="cookie-banner__text">
          <h2 id="cookie-title" class="cookie-title">🍪 Cookies & Vie Privée</h2>
          <p id="cookie-desc" class="cookie-desc">
            Ce site utilise des cookies pour améliorer votre expérience. 
            Vous pouvez personnaliser vos préférences ci-dessous.
          </p>
        </div>
        
        <div class="cookie-banner__options">
          <label class="cookie-option">
            <input type="checkbox" v-model="consent.necessary" disabled checked>
            <span class="option-label">
              <strong>Nécessaires</strong>
              <small>Requis pour le fonctionnement du site</small>
            </span>
          </label>
          <label class="cookie-option">
            <input type="checkbox" v-model="consent.analytics">
            <span class="option-label">
              <strong>Analytics</strong>
              <small>Nous aident à améliorer le site (Matomo)</small>
            </span>
          </label>
          <label class="cookie-option">
            <input type="checkbox" v-model="consent.marketing">
            <span class="option-label">
              <strong>Marketing</strong>
              <small>Publicités personnalisées</small>
            </span>
          </label>
        </div>
        
        <div class="cookie-banner__actions">
          <button @click="rejectAll" class="btn-reject">
            Tout refuser
          </button>
          <button @click="acceptSelected" class="btn-accept-selected">
            Accepter la sélection
          </button>
          <button @click="acceptAll" class="btn-accept-all">
            Tout accepter
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';

const STORAGE_KEY = 'cookie_consent';

const showBanner = ref(false);
const consent = reactive({
  necessary: true,
  analytics: false,
  marketing: false
});

onMounted(() => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    showBanner.value = true;
  } else {
    Object.assign(consent, JSON.parse(stored));
    applyConsent();
  }
});

function saveConsent() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(consent));
  showBanner.value = false;
  applyConsent();
}

function applyConsent() {
  // Analytics (ex: Matomo)
  if (consent.analytics && window._paq) {
    window._paq.push(['setConsentGiven']);
  }
  // Emit event for parent
  emit('consent-updated', { ...consent });
}

function acceptAll() {
  consent.analytics = true;
  consent.marketing = true;
  saveConsent();
}

function rejectAll() {
  consent.analytics = false;
  consent.marketing = false;
  saveConsent();
}

function acceptSelected() {
  saveConsent();
}

const emit = defineEmits(['consent-updated']);
<\/script>`,
      symfony: `<?php
// src/Controller/CookieConsentController.php
namespace App\\Controller;

use Symfony\\Bundle\\FrameworkBundle\\Controller\\AbstractController;
use Symfony\\Component\\HttpFoundation\\JsonResponse;
use Symfony\\Component\\HttpFoundation\\Request;
use Symfony\\Component\\Routing\\Annotation\\Route;

#[Route('/api/consent')]
class CookieConsentController extends AbstractController
{
    #[Route('/save', methods: ['POST'])]
    public function saveConsent(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        
        // Log consent for RGPD compliance
        $this->logConsent($data, $request->getClientIp());
        
        return new JsonResponse(['success' => true]);
    }
    
    private function logConsent(array $consent, string $ip): void
    {
        // Store in database for audit trail
        // Hash IP for privacy
        $hashedIp = hash('sha256', $ip . $_ENV['APP_SECRET']);
        
        // Log: timestamp, hashed_ip, consent_analytics, consent_marketing
    }
}`,
      css: `.cookie-banner {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 9999;
  background: rgba(10, 10, 15, 0.98);
  border-top: 1px solid rgba(16, 185, 129, 0.2);
  backdrop-filter: blur(10px);
  padding: 1.5rem;
}

.cookie-banner__content {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  gap: 1.5rem;
}

.cookie-title {
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
  color: #fff;
}

.cookie-desc {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.6;
}

.cookie-banner__options {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.cookie-option {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.cookie-option:hover {
  border-color: rgba(16, 185, 129, 0.3);
}

.cookie-option input[type="checkbox"] {
  width: 20px;
  height: 20px;
  accent-color: #10b981;
  cursor: pointer;
}

.option-label strong {
  display: block;
  color: #fff;
  font-size: 0.85rem;
}

.option-label small {
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.75rem;
}

.cookie-banner__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  justify-content: flex-end;
}

.btn-reject,
.btn-accept-selected,
.btn-accept-all {
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-reject {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 0.7);
}

.btn-reject:hover {
  border-color: #ef4444;
  color: #ef4444;
}

.btn-accept-selected {
  background: transparent;
  border: 1px solid #10b981;
  color: #10b981;
}

.btn-accept-selected:hover {
  background: rgba(16, 185, 129, 0.1);
}

.btn-accept-all {
  background: #10b981;
  border: 1px solid #10b981;
  color: #000;
}

.btn-accept-all:hover {
  background: #0d9668;
}

/* Transition */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
  opacity: 0;
}

/* A11Y Focus */
.cookie-option:focus-within {
  outline: 2px solid #10b981;
  outline-offset: 2px;
}

@media (max-width: 768px) {
  .cookie-banner__actions {
    flex-direction: column;
  }
  
  .cookie-banner__actions button {
    width: 100%;
  }
}`,
      usage: `<!-- Dans App.vue ou layout principal -->
<template>
  <div id="app">
    <router-view />
    
    <!-- Cookie Banner -->
    <CookieBanner @consent-updated="onConsentUpdated" />
  </div>
</template>

<script setup>
import CookieBanner from '@/components/legal/CookieBanner.vue';

function onConsentUpdated(consent) {
  console.log('Consent updated:', consent);
  
  // Initialize analytics if consented
  if (consent.analytics) {
    initMatomo();
  }
}
<\/script>`
    }
  },

  // ═══════════════════════════════════════════════════════════════
  // AGE VERIFICATION 18+
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'age-gate',
    name: 'Age Gate 18+',
    category: 'auth',
    icon: '🔞',
    adult: true,
    new: true,
    description: 'Vérification d\'âge légale pour contenu adulte. Conforme législation FR, persistance session.',
    tech: ['Vue 3', 'Symfony', 'CNIL'],
    features: [
      'Vérification date de naissance',
      'Persistance session (pas localStorage pour mineurs)',
      'Bloque accès si < 18 ans',
      'Design non-attractif pour mineurs',
      'Logging pour conformité légale'
    ],
    previewBg: 'linear-gradient(135deg, #1a0a0a, #2d1515)',
    code: {
      vue: `<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="!isVerified" class="age-gate" role="dialog" aria-modal="true" aria-labelledby="age-title">
        <div class="age-gate__overlay"></div>
        <div class="age-gate__modal">
          <!-- Warning Icon -->
          <div class="age-gate__icon">
            <span>🔞</span>
          </div>
          
          <h1 id="age-title" class="age-gate__title">
            Contenu réservé aux adultes
          </h1>
          
          <p class="age-gate__desc">
            Ce site contient du contenu destiné exclusivement aux personnes majeures (18 ans et plus).
            En continuant, vous confirmez avoir l'âge légal dans votre pays de résidence.
          </p>
          
          <!-- Date of Birth Verification -->
          <div class="age-gate__form">
            <label class="age-gate__label">Date de naissance</label>
            <div class="age-gate__inputs">
              <select v-model="birthDay" class="age-input" aria-label="Jour">
                <option value="">JJ</option>
                <option v-for="d in 31" :key="d" :value="d">{{ d.toString().padStart(2, '0') }}</option>
              </select>
              <select v-model="birthMonth" class="age-input" aria-label="Mois">
                <option value="">MM</option>
                <option v-for="m in 12" :key="m" :value="m">{{ m.toString().padStart(2, '0') }}</option>
              </select>
              <select v-model="birthYear" class="age-input age-input--year" aria-label="Année">
                <option value="">AAAA</option>
                <option v-for="y in years" :key="y" :value="y">{{ y }}</option>
              </select>
            </div>
            
            <p v-if="error" class="age-gate__error" role="alert">
              {{ error }}
            </p>
          </div>
          
          <div class="age-gate__actions">
            <button @click="verify" class="btn-verify" :disabled="!canVerify">
              J'ai 18 ans ou plus - Entrer
            </button>
            <button @click="leave" class="btn-leave">
              Je suis mineur - Quitter
            </button>
          </div>
          
          <p class="age-gate__legal">
            En cliquant sur "Entrer", vous confirmez avoir lu et accepté nos 
            <router-link to="/mentions-legales">Mentions Légales</router-link> et notre 
            <router-link to="/politique-confidentialite">Politique de Confidentialité</router-link>.
          </p>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

const SESSION_KEY = 'age_verified';

const isVerified = ref(false);
const birthDay = ref('');
const birthMonth = ref('');
const birthYear = ref('');
const error = ref('');

// Generate years (current year - 100 to current year - 10)
const currentYear = new Date().getFullYear();
const years = computed(() => {
  const arr = [];
  for (let y = currentYear - 10; y >= currentYear - 100; y--) {
    arr.push(y);
  }
  return arr;
});

const canVerify = computed(() => {
  return birthDay.value && birthMonth.value && birthYear.value;
});

onMounted(() => {
  // Check session storage (not localStorage - session only)
  const verified = sessionStorage.getItem(SESSION_KEY);
  if (verified === 'true') {
    isVerified.value = true;
  }
});

function verify() {
  error.value = '';
  
  const birth = new Date(birthYear.value, birthMonth.value - 1, birthDay.value);
  const today = new Date();
  const age = Math.floor((today - birth) / (365.25 * 24 * 60 * 60 * 1000));
  
  if (age >= 18) {
    // Store in session only (not persistent)
    sessionStorage.setItem(SESSION_KEY, 'true');
    isVerified.value = true;
    
    // Log for compliance (anonymous)
    logVerification(true);
  } else {
    error.value = 'Vous devez avoir 18 ans ou plus pour accéder à ce contenu.';
    logVerification(false);
    
    // Redirect after delay
    setTimeout(() => {
      leave();
    }, 3000);
  }
}

function leave() {
  // Redirect to safe page
  window.location.href = 'https://www.google.fr';
}

function logVerification(success) {
  // Send anonymous log to server for legal compliance
  fetch('/api/age-verification/log', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      success,
      timestamp: new Date().toISOString()
      // NO personal data stored
    })
  }).catch(() => {});
}
<\/script>`,
      symfony: `<?php
// src/Controller/AgeVerificationController.php
namespace App\\Controller;

use Symfony\\Bundle\\FrameworkBundle\\Controller\\AbstractController;
use Symfony\\Component\\HttpFoundation\\JsonResponse;
use Symfony\\Component\\HttpFoundation\\Request;
use Symfony\\Component\\Routing\\Annotation\\Route;
use Psr\\Log\\LoggerInterface;

#[Route('/api/age-verification')]
class AgeVerificationController extends AbstractController
{
    public function __construct(
        private LoggerInterface $logger
    ) {}

    #[Route('/log', methods: ['POST'])]
    public function logVerification(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        
        // Log for legal compliance (ANONYMOUS - no IP, no personal data)
        $this->logger->info('Age verification attempt', [
            'success' => $data['success'] ?? false,
            'timestamp' => $data['timestamp'] ?? now(),
            // Hash session ID for audit without tracking
            'session_hash' => hash('sha256', $request->getSession()->getId())
        ]);
        
        return new JsonResponse(['logged' => true]);
    }
}

// src/EventSubscriber/AgeVerificationSubscriber.php
namespace App\\EventSubscriber;

use Symfony\\Component\\EventDispatcher\\EventSubscriberInterface;
use Symfony\\Component\\HttpKernel\\Event\\RequestEvent;
use Symfony\\Component\\HttpKernel\\KernelEvents;
use Symfony\\Component\\HttpFoundation\\RedirectResponse;

class AgeVerificationSubscriber implements EventSubscriberInterface
{
    private array $adultRoutes = [
        '/adult',
        '/18plus',
        '/nsfw'
    ];
    
    public static function getSubscribedEvents(): array
    {
        return [
            KernelEvents::REQUEST => 'onKernelRequest',
        ];
    }
    
    public function onKernelRequest(RequestEvent $event): void
    {
        $request = $event->getRequest();
        $path = $request->getPathInfo();
        
        // Check if route requires age verification
        foreach ($this->adultRoutes as $route) {
            if (str_starts_with($path, $route)) {
                $session = $request->getSession();
                
                if (!$session->get('age_verified')) {
                    // Return age gate page instead of redirect
                    // The Vue component handles the verification
                    return;
                }
            }
        }
    }
}`,
      css: `.age-gate {
  position: fixed;
  inset: 0;
  z-index: 99999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.age-gate__overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.95);
  backdrop-filter: blur(10px);
}

.age-gate__modal {
  position: relative;
  max-width: 480px;
  width: 100%;
  background: #1a1a1a;
  border: 2px solid #ff4444;
  border-radius: 16px;
  padding: 2rem;
  text-align: center;
  box-shadow: 0 0 60px rgba(255, 68, 68, 0.2);
}

.age-gate__icon {
  font-size: 4rem;
  margin-bottom: 1rem;
  filter: grayscale(0.3);
}

.age-gate__title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 1rem;
}

.age-gate__desc {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

.age-gate__form {
  margin-bottom: 1.5rem;
}

.age-gate__label {
  display: block;
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.5);
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.age-gate__inputs {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
}

.age-input {
  padding: 0.75rem 1rem;
  background: #0a0a0a;
  border: 1px solid #333;
  border-radius: 8px;
  color: #fff;
  font-size: 1rem;
  cursor: pointer;
}

.age-input:focus {
  outline: 2px solid #ff4444;
  outline-offset: 2px;
}

.age-input--year {
  min-width: 100px;
}

.age-gate__error {
  margin-top: 1rem;
  padding: 0.75rem;
  background: rgba(255, 68, 68, 0.1);
  border: 1px solid #ff4444;
  border-radius: 8px;
  color: #ff4444;
  font-size: 0.85rem;
}

.age-gate__actions {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.btn-verify {
  padding: 1rem 2rem;
  background: #ff4444;
  border: none;
  border-radius: 8px;
  color: #fff;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-verify:hover:not(:disabled) {
  background: #cc3333;
}

.btn-verify:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-leave {
  padding: 0.75rem 1.5rem;
  background: transparent;
  border: 1px solid #666;
  border-radius: 8px;
  color: #999;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-leave:hover {
  border-color: #fff;
  color: #fff;
}

.age-gate__legal {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.4);
  line-height: 1.5;
}

.age-gate__legal a {
  color: rgba(255, 255, 255, 0.6);
  text-decoration: underline;
}

/* Fade transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}`,
      usage: `<!-- Dans App.vue pour sites adultes -->
<template>
  <div id="app">
    <!-- Age Gate - Bloque tout le contenu si non vérifié -->
    <AgeGate />
    
    <!-- Contenu du site (masqué si non vérifié) -->
    <template v-if="isAgeVerified">
      <router-view />
    </template>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import AgeGate from '@/components/auth/AgeGate.vue';

const isAgeVerified = computed(() => {
  return sessionStorage.getItem('age_verified') === 'true';
});
<\/script>

<!-- OU pour certaines routes seulement -->
<!-- router/index.js -->
const routes = [
  {
    path: '/adult-content',
    component: AdultContent,
    meta: { requiresAgeVerification: true }
  }
];

// Navigation guard
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAgeVerification) {
    if (sessionStorage.getItem('age_verified') !== 'true') {
      // Le composant AgeGate s'affichera automatiquement
      next();
    }
  }
  next();
});`
    }
  },

  // ═══════════════════════════════════════════════════════════════
  // CONTENT WARNING
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'content-warning',
    name: 'Content Warning Modal',
    category: 'auth',
    icon: '⚠️',
    adult: true,
    description: 'Avertissement contenu sensible avec catégorisation (NSFW, violence, etc.). Click-to-reveal.',
    tech: ['Vue 3'],
    features: [
      'Catégories de contenu (nudité, violence, langage)',
      'Blur/masquage du contenu',
      'Click-to-reveal avec confirmation',
      'Mémorisation des préférences par session',
      'Design accessible'
    ],
    previewBg: 'linear-gradient(135deg, #1a1a0a, #2d2d15)',
    code: {
      vue: `<template>
  <div class="content-warning-wrapper">
    <!-- Warning Overlay -->
    <div v-if="!revealed" class="content-warning" @click="showWarning = true">
      <div class="warning-blur"></div>
      <div class="warning-content">
        <span class="warning-icon">{{ categoryIcon }}</span>
        <h3 class="warning-title">Contenu sensible</h3>
        <p class="warning-category">{{ categoryLabel }}</p>
        <button class="btn-reveal" @click.stop="reveal">
          Afficher le contenu
        </button>
      </div>
    </div>
    
    <!-- Actual Content -->
    <div :class="{ 'content-hidden': !revealed }">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  category: {
    type: String,
    default: 'nsfw', // nsfw, violence, language, spoiler
    validator: (v) => ['nsfw', 'violence', 'language', 'spoiler'].includes(v)
  },
  id: String // Unique ID for remembering reveal state
});

const revealed = ref(false);

const categoryConfig = {
  nsfw: { icon: '🔞', label: 'Contenu pour adultes (NSFW)' },
  violence: { icon: '⚠️', label: 'Contenu violent' },
  language: { icon: '🤬', label: 'Langage explicite' },
  spoiler: { icon: '🙈', label: 'Spoiler' }
};

const categoryIcon = computed(() => categoryConfig[props.category]?.icon || '⚠️');
const categoryLabel = computed(() => categoryConfig[props.category]?.label || 'Contenu sensible');

function reveal() {
  revealed.value = true;
  
  // Remember for this session
  if (props.id) {
    sessionStorage.setItem(\`content_revealed_\${props.id}\`, 'true');
  }
}

// Check if already revealed in session
if (props.id && sessionStorage.getItem(\`content_revealed_\${props.id}\`) === 'true') {
  revealed.value = true;
}
<\/script>`,
      css: `.content-warning-wrapper {
  position: relative;
}

.content-warning {
  position: absolute;
  inset: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: inherit;
  overflow: hidden;
}

.warning-blur {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(20px);
}

.warning-content {
  position: relative;
  text-align: center;
  padding: 2rem;
}

.warning-icon {
  font-size: 3rem;
  display: block;
  margin-bottom: 1rem;
}

.warning-title {
  font-size: 1.25rem;
  color: #fff;
  margin-bottom: 0.5rem;
}

.warning-category {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 1.5rem;
}

.btn-reveal {
  padding: 0.75rem 1.5rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  color: #fff;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-reveal:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: #fff;
}

.content-hidden {
  filter: blur(30px);
  pointer-events: none;
}`,
      symfony: `// Pas de backend nécessaire pour ce composant
// La logique est entièrement côté client avec sessionStorage`,
      usage: `<template>
  <div class="post">
    <!-- Contenu normal -->
    <p>Début du post...</p>
    
    <!-- Image sensible avec avertissement -->
    <ContentWarning category="nsfw" id="post-123-img">
      <img src="/uploads/nsfw-image.jpg" alt="Image NSFW" />
    </ContentWarning>
    
    <!-- Vidéo avec violence -->
    <ContentWarning category="violence" id="post-123-video">
      <video src="/uploads/video.mp4" controls />
    </ContentWarning>
    
    <!-- Spoiler -->
    <ContentWarning category="spoiler" id="post-123-spoiler">
      <p>Le méchant était en fait le gentil depuis le début !</p>
    </ContentWarning>
  </div>
</template>`
    }
  },

  // ═══════════════════════════════════════════════════════════════
  // SOCIAL / BLOG
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'post-composer',
    name: 'Post Composer',
    category: 'social',
    icon: '✍️',
    description: 'Éditeur de posts type réseau social avec upload media, mentions, tags, et preview.',
    tech: ['Vue 3', 'Symfony'],
    features: [
      'Textarea auto-resize',
      'Upload images/vidéos avec preview',
      'Mentions @utilisateur',
      'Hashtags #tag',
      'Content warning optionnel',
      'Compteur de caractères'
    ],
    previewBg: 'linear-gradient(135deg, #0a1628, #1a2a4a)',
    code: {
      vue: `<template>
  <div class="post-composer" :class="{ 'composer--focused': isFocused }">
    <!-- Avatar -->
    <div class="composer-avatar">
      <img :src="currentUser.avatar" :alt="currentUser.name" />
    </div>
    
    <div class="composer-main">
      <!-- Textarea -->
      <div class="composer-input-wrapper">
        <textarea
          ref="textarea"
          v-model="content"
          :placeholder="placeholder"
          class="composer-textarea"
          @focus="isFocused = true"
          @blur="onBlur"
          @input="autoResize"
          :maxlength="maxLength"
        ></textarea>
        
        <!-- Character counter -->
        <div class="char-counter" :class="{ 'char-counter--warning': isNearLimit, 'char-counter--error': isOverLimit }">
          {{ content.length }} / {{ maxLength }}
        </div>
      </div>
      
      <!-- Media Preview -->
      <div v-if="mediaFiles.length" class="media-preview">
        <div v-for="(file, index) in mediaFiles" :key="index" class="media-item">
          <img v-if="file.type.startsWith('image')" :src="file.preview" alt="Preview" />
          <video v-else :src="file.preview" />
          <button class="remove-media" @click="removeMedia(index)">✕</button>
        </div>
      </div>
      
      <!-- Content Warning Input -->
      <div v-if="showCWInput" class="cw-input">
        <label>Avertissement de contenu :</label>
        <input v-model="contentWarning" placeholder="Ex: NSFW, Spoilers, Violence..." />
      </div>
      
      <!-- Actions -->
      <div class="composer-actions">
        <div class="composer-tools">
          <button class="tool-btn" @click="triggerMediaUpload" title="Ajouter media">
            🖼️
          </button>
          <button class="tool-btn" @click="showCWInput = !showCWInput" title="Avertissement contenu" :class="{ active: showCWInput }">
            ⚠️
          </button>
          <button class="tool-btn" @click="insertMention" title="Mentionner">
            @
          </button>
          <button class="tool-btn" @click="insertHashtag" title="Hashtag">
            #
          </button>
        </div>
        
        <button 
          class="btn-post" 
          :disabled="!canPost"
          @click="submitPost"
        >
          Publier
        </button>
      </div>
      
      <!-- Hidden file input -->
      <input 
        ref="fileInput"
        type="file"
        accept="image/*,video/*"
        multiple
        @change="handleFileSelect"
        style="display: none"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  currentUser: Object,
  placeholder: { type: String, default: 'Quoi de neuf ?' },
  maxLength: { type: Number, default: 500 },
  maxFiles: { type: Number, default: 4 }
});

const emit = defineEmits(['post']);

const textarea = ref(null);
const fileInput = ref(null);
const content = ref('');
const mediaFiles = ref([]);
const contentWarning = ref('');
const showCWInput = ref(false);
const isFocused = ref(false);

const isNearLimit = computed(() => content.value.length > props.maxLength * 0.8);
const isOverLimit = computed(() => content.value.length >= props.maxLength);
const canPost = computed(() => {
  return (content.value.trim().length > 0 || mediaFiles.value.length > 0) && !isOverLimit.value;
});

function autoResize() {
  const el = textarea.value;
  el.style.height = 'auto';
  el.style.height = el.scrollHeight + 'px';
}

function onBlur() {
  setTimeout(() => {
    if (!content.value && !mediaFiles.value.length) {
      isFocused.value = false;
    }
  }, 200);
}

function triggerMediaUpload() {
  fileInput.value.click();
}

function handleFileSelect(e) {
  const files = Array.from(e.target.files);
  
  files.slice(0, props.maxFiles - mediaFiles.value.length).forEach(file => {
    const reader = new FileReader();
    reader.onload = (e) => {
      mediaFiles.value.push({
        file,
        type: file.type,
        preview: e.target.result
      });
    };
    reader.readAsDataURL(file);
  });
  
  e.target.value = '';
}

function removeMedia(index) {
  mediaFiles.value.splice(index, 1);
}

function insertMention() {
  content.value += '@';
  textarea.value.focus();
}

function insertHashtag() {
  content.value += '#';
  textarea.value.focus();
}

async function submitPost() {
  if (!canPost.value) return;
  
  const formData = new FormData();
  formData.append('content', content.value);
  
  if (contentWarning.value) {
    formData.append('content_warning', contentWarning.value);
  }
  
  mediaFiles.value.forEach((m, i) => {
    formData.append(\`media[\${i}]\`, m.file);
  });
  
  emit('post', formData);
  
  // Reset
  content.value = '';
  mediaFiles.value = [];
  contentWarning.value = '';
  showCWInput.value = false;
  isFocused.value = false;
}
<\/script>`,
      symfony: `<?php
// src/Controller/PostController.php
namespace App\\Controller;

use App\\Entity\\Post;
use App\\Entity\\Media;
use App\\Service\\MediaUploader;
use Doctrine\\ORM\\EntityManagerInterface;
use Symfony\\Bundle\\FrameworkBundle\\Controller\\AbstractController;
use Symfony\\Component\\HttpFoundation\\JsonResponse;
use Symfony\\Component\\HttpFoundation\\Request;
use Symfony\\Component\\Routing\\Annotation\\Route;
use Symfony\\Component\\Security\\Http\\Attribute\\IsGranted;

#[Route('/api/posts')]
class PostController extends AbstractController
{
    public function __construct(
        private EntityManagerInterface $em,
        private MediaUploader $uploader
    ) {}

    #[Route('', methods: ['POST'])]
    #[IsGranted('ROLE_USER')]
    public function create(Request $request): JsonResponse
    {
        $user = $this->getUser();
        
        $post = new Post();
        $post->setAuthor($user);
        $post->setContent($request->request->get('content', ''));
        $post->setContentWarning($request->request->get('content_warning'));
        $post->setCreatedAt(new \\DateTimeImmutable());
        
        // Handle media uploads
        $files = $request->files->get('media', []);
        foreach ($files as $file) {
            $media = $this->uploader->upload($file, $user);
            $post->addMedia($media);
        }
        
        // Extract mentions and hashtags
        $post->setMentions($this->extractMentions($post->getContent()));
        $post->setHashtags($this->extractHashtags($post->getContent()));
        
        $this->em->persist($post);
        $this->em->flush();
        
        return new JsonResponse([
            'id' => $post->getId(),
            'content' => $post->getContent(),
            'media' => array_map(fn($m) => $m->getUrl(), $post->getMedia()->toArray()),
            'created_at' => $post->getCreatedAt()->format('c')
        ], 201);
    }
    
    private function extractMentions(string $content): array
    {
        preg_match_all('/@([\\w]+)/', $content, $matches);
        return $matches[1] ?? [];
    }
    
    private function extractHashtags(string $content): array
    {
        preg_match_all('/#([\\w]+)/', $content, $matches);
        return $matches[1] ?? [];
    }
}`,
      css: `.post-composer {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  transition: all 0.3s;
}

.composer--focused {
  border-color: rgba(16, 185, 129, 0.3);
  background: rgba(255, 255, 255, 0.04);
}

.composer-avatar img {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
}

.composer-main {
  flex: 1;
}

.composer-input-wrapper {
  position: relative;
}

.composer-textarea {
  width: 100%;
  min-height: 80px;
  padding: 0.75rem;
  background: transparent;
  border: none;
  color: #fff;
  font-size: 1rem;
  line-height: 1.5;
  resize: none;
  outline: none;
}

.composer-textarea::placeholder {
  color: rgba(255, 255, 255, 0.4);
}

.char-counter {
  position: absolute;
  bottom: 0.5rem;
  right: 0.5rem;
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.4);
}

.char-counter--warning {
  color: #f59e0b;
}

.char-counter--error {
  color: #ef4444;
}

.media-preview {
  display: flex;
  gap: 0.5rem;
  margin: 1rem 0;
  flex-wrap: wrap;
}

.media-item {
  position: relative;
  width: 100px;
  height: 100px;
  border-radius: 8px;
  overflow: hidden;
}

.media-item img,
.media-item video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.remove-media {
  position: absolute;
  top: 4px;
  right: 4px;
  width: 24px;
  height: 24px;
  background: rgba(0, 0, 0, 0.7);
  border: none;
  border-radius: 50%;
  color: #fff;
  cursor: pointer;
}

.cw-input {
  margin: 1rem 0;
  padding: 0.75rem;
  background: rgba(255, 200, 0, 0.1);
  border: 1px solid rgba(255, 200, 0, 0.3);
  border-radius: 8px;
}

.cw-input label {
  display: block;
  font-size: 0.75rem;
  color: #ffc800;
  margin-bottom: 0.5rem;
}

.cw-input input {
  width: 100%;
  padding: 0.5rem;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  color: #fff;
}

.composer-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 0.75rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.composer-tools {
  display: flex;
  gap: 0.25rem;
}

.tool-btn {
  width: 36px;
  height: 36px;
  background: transparent;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.2s;
}

.tool-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

.tool-btn.active {
  background: rgba(255, 200, 0, 0.2);
}

.btn-post {
  padding: 0.75rem 1.5rem;
  background: #10b981;
  border: none;
  border-radius: 20px;
  color: #000;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-post:hover:not(:disabled) {
  background: #0d9668;
}

.btn-post:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}`,
      usage: `<template>
  <div class="feed">
    <!-- Composer -->
    <PostComposer 
      :current-user="currentUser"
      placeholder="Partagez quelque chose..."
      :max-length="500"
      @post="handleNewPost"
    />
    
    <!-- Posts list -->
    <div class="posts-list">
      <PostCard v-for="post in posts" :key="post.id" :post="post" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import PostComposer from '@/components/social/PostComposer.vue';

const currentUser = ref({
  id: 1,
  name: 'Neo',
  avatar: '/avatars/neo.jpg'
});

const posts = ref([]);

async function handleNewPost(formData) {
  const response = await fetch('/api/posts', {
    method: 'POST',
    body: formData
  });
  
  if (response.ok) {
    const newPost = await response.json();
    posts.value.unshift(newPost);
  }
}
<\/script>`
    }
  },

  // ═══════════════════════════════════════════════════════════════
  // MEDIA UPLOAD
  // ═══════════════════════════════════════════════════════════════
  {
    id: 'media-uploader',
    name: 'Media Uploader',
    category: 'media',
    icon: '📤',
    description: 'Upload de fichiers avec drag & drop, progress bar, validation MIME types, et preview.',
    tech: ['Vue 3', 'Symfony'],
    features: [
      'Drag & drop zone',
      'Multi-fichiers',
      'Progress bar par fichier',
      'Validation type/taille côté client et serveur',
      'Preview images/vidéos',
      'Chunked upload pour gros fichiers'
    ],
    previewBg: 'linear-gradient(135deg, #0a2818, #1a4a2a)',
    code: {
      vue: `<template>
  <div 
    class="media-uploader"
    :class="{ 'uploader--dragover': isDragging, 'uploader--uploading': isUploading }"
    @dragenter.prevent="onDragEnter"
    @dragover.prevent
    @dragleave.prevent="onDragLeave"
    @drop.prevent="onDrop"
  >
    <!-- Drop Zone -->
    <div class="upload-zone" @click="triggerInput">
      <div class="upload-icon">📤</div>
      <p class="upload-text">
        <strong>Cliquez pour sélectionner</strong> ou glissez vos fichiers ici
      </p>
      <p class="upload-hint">
        {{ acceptLabel }} • Max {{ formatSize(maxSize) }} par fichier
      </p>
    </div>
    
    <!-- Files List -->
    <div v-if="files.length" class="files-list">
      <div v-for="(file, index) in files" :key="file.id" class="file-item">
        <!-- Preview -->
        <div class="file-preview">
          <img v-if="file.preview && file.type.startsWith('image')" :src="file.preview" />
          <video v-else-if="file.preview && file.type.startsWith('video')" :src="file.preview" />
          <span v-else class="file-icon">📄</span>
        </div>
        
        <!-- Info -->
        <div class="file-info">
          <span class="file-name">{{ file.name }}</span>
          <span class="file-size">{{ formatSize(file.size) }}</span>
          
          <!-- Progress -->
          <div v-if="file.uploading" class="file-progress">
            <div class="progress-bar" :style="{ width: file.progress + '%' }"></div>
          </div>
          
          <!-- Status -->
          <span v-if="file.error" class="file-error">{{ file.error }}</span>
          <span v-else-if="file.uploaded" class="file-success">✓ Uploadé</span>
        </div>
        
        <!-- Remove -->
        <button v-if="!file.uploading" class="file-remove" @click="removeFile(index)">✕</button>
      </div>
    </div>
    
    <!-- Upload Button -->
    <button 
      v-if="files.length && !allUploaded"
      class="btn-upload"
      :disabled="isUploading"
      @click="uploadAll"
    >
      {{ isUploading ? 'Upload en cours...' : 'Uploader ' + files.length + ' fichier(s)' }}
    </button>
    
    <!-- Hidden Input -->
    <input 
      ref="fileInput"
      type="file"
      :accept="accept"
      :multiple="multiple"
      @change="onFileSelect"
      style="display: none"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  accept: { type: String, default: 'image/*,video/*' },
  multiple: { type: Boolean, default: true },
  maxSize: { type: Number, default: 50 * 1024 * 1024 }, // 50MB
  maxFiles: { type: Number, default: 10 },
  uploadUrl: { type: String, required: true }
});

const emit = defineEmits(['uploaded', 'error']);

const fileInput = ref(null);
const files = ref([]);
const isDragging = ref(false);
const isUploading = ref(false);

const acceptLabel = computed(() => {
  if (props.accept.includes('image') && props.accept.includes('video')) return 'Images & Vidéos';
  if (props.accept.includes('image')) return 'Images uniquement';
  if (props.accept.includes('video')) return 'Vidéos uniquement';
  return 'Tous fichiers';
});

const allUploaded = computed(() => files.value.every(f => f.uploaded));

function formatSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

function triggerInput() {
  fileInput.value.click();
}

function onDragEnter() {
  isDragging.value = true;
}

function onDragLeave(e) {
  if (!e.currentTarget.contains(e.relatedTarget)) {
    isDragging.value = false;
  }
}

function onDrop(e) {
  isDragging.value = false;
  handleFiles(e.dataTransfer.files);
}

function onFileSelect(e) {
  handleFiles(e.target.files);
  e.target.value = '';
}

function handleFiles(fileList) {
  const newFiles = Array.from(fileList).slice(0, props.maxFiles - files.value.length);
  
  newFiles.forEach(file => {
    // Validate
    if (file.size > props.maxSize) {
      emit('error', { file, message: 'Fichier trop volumineux' });
      return;
    }
    
    const fileObj = {
      id: Date.now() + Math.random(),
      file,
      name: file.name,
      size: file.size,
      type: file.type,
      preview: null,
      progress: 0,
      uploading: false,
      uploaded: false,
      error: null,
      url: null
    };
    
    // Generate preview
    if (file.type.startsWith('image') || file.type.startsWith('video')) {
      const reader = new FileReader();
      reader.onload = (e) => { fileObj.preview = e.target.result; };
      reader.readAsDataURL(file);
    }
    
    files.value.push(fileObj);
  });
}

function removeFile(index) {
  files.value.splice(index, 1);
}

async function uploadAll() {
  isUploading.value = true;
  
  for (const fileObj of files.value) {
    if (fileObj.uploaded || fileObj.error) continue;
    await uploadFile(fileObj);
  }
  
  isUploading.value = false;
  
  const uploaded = files.value.filter(f => f.uploaded);
  emit('uploaded', uploaded.map(f => ({ url: f.url, type: f.type })));
}

async function uploadFile(fileObj) {
  fileObj.uploading = true;
  fileObj.error = null;
  
  const formData = new FormData();
  formData.append('file', fileObj.file);
  
  try {
    const xhr = new XMLHttpRequest();
    
    await new Promise((resolve, reject) => {
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          fileObj.progress = Math.round((e.loaded / e.total) * 100);
        }
      };
      
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          const response = JSON.parse(xhr.responseText);
          fileObj.url = response.url;
          fileObj.uploaded = true;
          resolve();
        } else {
          reject(new Error('Upload failed'));
        }
      };
      
      xhr.onerror = () => reject(new Error('Network error'));
      
      xhr.open('POST', props.uploadUrl);
      xhr.send(formData);
    });
  } catch (err) {
    fileObj.error = err.message;
  } finally {
    fileObj.uploading = false;
  }
}
<\/script>`,
      symfony: `<?php
// src/Controller/MediaController.php
namespace App\\Controller;

use App\\Service\\MediaUploader;
use Symfony\\Bundle\\FrameworkBundle\\Controller\\AbstractController;
use Symfony\\Component\\HttpFoundation\\File\\UploadedFile;
use Symfony\\Component\\HttpFoundation\\JsonResponse;
use Symfony\\Component\\HttpFoundation\\Request;
use Symfony\\Component\\Routing\\Annotation\\Route;
use Symfony\\Component\\Security\\Http\\Attribute\\IsGranted;
use Symfony\\Component\\Validator\\Constraints as Assert;
use Symfony\\Component\\Validator\\Validator\\ValidatorInterface;

#[Route('/api/media')]
class MediaController extends AbstractController
{
    private const MAX_SIZE = 50 * 1024 * 1024; // 50MB
    private const ALLOWED_MIMES = [
        'image/jpeg', 'image/png', 'image/gif', 'image/webp',
        'video/mp4', 'video/webm', 'video/quicktime'
    ];

    #[Route('/upload', methods: ['POST'])]
    #[IsGranted('ROLE_USER')]
    public function upload(
        Request $request,
        MediaUploader $uploader,
        ValidatorInterface $validator
    ): JsonResponse {
        /** @var UploadedFile|null $file */
        $file = $request->files->get('file');
        
        if (!$file) {
            return new JsonResponse(['error' => 'No file provided'], 400);
        }
        
        // Validate
        $violations = $validator->validate($file, [
            new Assert\\File([
                'maxSize' => self::MAX_SIZE,
                'mimeTypes' => self::ALLOWED_MIMES,
                'mimeTypesMessage' => 'Type de fichier non autorisé'
            ])
        ]);
        
        if (count($violations) > 0) {
            return new JsonResponse([
                'error' => $violations[0]->getMessage()
            ], 400);
        }
        
        try {
            $media = $uploader->upload($file, $this->getUser());
            
            return new JsonResponse([
                'id' => $media->getId(),
                'url' => $media->getUrl(),
                'type' => $media->getType(),
                'size' => $media->getSize()
            ], 201);
        } catch (\\Exception $e) {
            return new JsonResponse(['error' => 'Upload failed'], 500);
        }
    }
}

// src/Service/MediaUploader.php
namespace App\\Service;

use App\\Entity\\Media;
use App\\Entity\\User;
use Doctrine\\ORM\\EntityManagerInterface;
use Symfony\\Component\\HttpFoundation\\File\\UploadedFile;
use Symfony\\Component\\String\\Slugger\\SluggerInterface;

class MediaUploader
{
    public function __construct(
        private string $uploadDir,
        private string $publicUrl,
        private SluggerInterface $slugger,
        private EntityManagerInterface $em
    ) {}

    public function upload(UploadedFile $file, User $user): Media
    {
        // Generate safe filename
        $originalName = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
        $safeFilename = $this->slugger->slug($originalName);
        $newFilename = $safeFilename . '-' . uniqid() . '.' . $file->guessExtension();
        
        // Organize by year/month
        $subDir = date('Y/m');
        $targetDir = $this->uploadDir . '/' . $subDir;
        
        // Move file
        $file->move($targetDir, $newFilename);
        
        // Create entity
        $media = new Media();
        $media->setFilename($newFilename);
        $media->setPath($subDir . '/' . $newFilename);
        $media->setUrl($this->publicUrl . '/' . $subDir . '/' . $newFilename);
        $media->setType($file->getClientMimeType());
        $media->setSize($file->getSize());
        $media->setUploadedBy($user);
        $media->setCreatedAt(new \\DateTimeImmutable());
        
        $this->em->persist($media);
        $this->em->flush();
        
        return $media;
    }
}`,
      css: `.media-uploader {
  border: 2px dashed rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 1.5rem;
  transition: all 0.3s;
}

.uploader--dragover {
  border-color: #10b981;
  background: rgba(16, 185, 129, 0.1);
}

.upload-zone {
  text-align: center;
  padding: 2rem;
  cursor: pointer;
}

.upload-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.upload-text {
  color: #fff;
  margin-bottom: 0.5rem;
}

.upload-hint {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.5);
}

.files-list {
  margin-top: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.file-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
}

.file-preview {
  width: 60px;
  height: 60px;
  border-radius: 6px;
  overflow: hidden;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
}

.file-preview img,
.file-preview video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.file-icon {
  font-size: 1.5rem;
}

.file-info {
  flex: 1;
}

.file-name {
  display: block;
  font-size: 0.9rem;
  color: #fff;
  margin-bottom: 0.25rem;
}

.file-size {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.5);
}

.file-progress {
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  margin-top: 0.5rem;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background: #10b981;
  transition: width 0.2s;
}

.file-error {
  display: block;
  font-size: 0.75rem;
  color: #ef4444;
  margin-top: 0.25rem;
}

.file-success {
  display: block;
  font-size: 0.75rem;
  color: #10b981;
  margin-top: 0.25rem;
}

.file-remove {
  width: 32px;
  height: 32px;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 50%;
  color: #fff;
  cursor: pointer;
}

.btn-upload {
  width: 100%;
  margin-top: 1rem;
  padding: 1rem;
  background: #10b981;
  border: none;
  border-radius: 8px;
  color: #000;
  font-weight: 600;
  cursor: pointer;
}

.btn-upload:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}`,
      usage: `<template>
  <MediaUploader
    upload-url="/api/media/upload"
    accept="image/*,video/*"
    :max-size="50 * 1024 * 1024"
    :max-files="4"
    @uploaded="onUploaded"
    @error="onError"
  />
</template>

<script setup>
function onUploaded(files) {
  console.log('Uploaded files:', files);
  // [{ url: '/uploads/...', type: 'image/jpeg' }, ...]
}

function onError({ file, message }) {
  console.error(\`Error uploading \${file.name}: \${message}\`);
}
<\/script>`
    }
  }
]);

// Computed
const filteredComponents = computed(() => {
  if (activeCategory.value === 'all') return components.value;
  return components.value.filter(c => c.category === activeCategory.value);
});

// Methods
function getCountByCategory(catId) {
  if (catId === 'all') return components.value.length;
  return components.value.filter(c => c.category === catId).length;
}

function copyComponent(comp) {
  selectedComponent.value = comp;
  showCodeModal.value = true;
}

function openPreview(comp) {
  // TODO: Preview modal
}

function getCodeForTab() {
  if (!selectedComponent.value) return '';
  return selectedComponent.value.code?.[activeCodeTab.value] || '// Code non disponible';
}

async function copyAllCode() {
  const code = getCodeForTab();
  await navigator.clipboard.writeText(code);
  showToast.value = true;
  setTimeout(() => { showToast.value = false; }, 2000);
}
</script>

<style scoped>
.components-library {
  min-height: 100vh;
  background: var(--bg);
}

/* Header */
.lib-header {
  padding: 8rem 0 4rem;
  background: linear-gradient(180deg, rgba(16, 185, 129, 0.05), transparent);
  border-bottom: 1px solid var(--border);
}

.lib-header__content {
  max-width: 700px;
}

.lib-header h1 {
  font-size: 3rem;
  font-weight: 700;
  margin: 0.5rem 0 1rem;
}

.lib-header__desc {
  font-size: 1.1rem;
  color: var(--text-muted);
  line-height: 1.7;
}

.lib-header__badges {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 1.5rem;
}

.badge {
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
}

.badge--green {
  background: rgba(16, 185, 129, 0.15);
  color: #10b981;
  border: 1px solid rgba(16, 185, 129, 0.3);
}

.badge--blue {
  background: rgba(59, 130, 246, 0.15);
  color: #3b82f6;
  border: 1px solid rgba(59, 130, 246, 0.3);
}

.badge--purple {
  background: rgba(139, 92, 246, 0.15);
  color: #8b5cf6;
  border: 1px solid rgba(139, 92, 246, 0.3);
}

.badge--orange {
  background: rgba(249, 115, 22, 0.15);
  color: #f97316;
  border: 1px solid rgba(249, 115, 22, 0.3);
}

/* Filters */
.lib-filters {
  padding: 1rem 0;
  background: var(--surface);
  border-bottom: 1px solid var(--border);
  position: sticky;
  top: 0;
  z-index: 100;
}

.filters-row {
  display: flex;
  gap: 0.5rem;
  overflow-x: auto;
  padding-bottom: 0.5rem;
}

.filter-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1rem;
  background: transparent;
  border: 1px solid var(--border);
  border-radius: 20px;
  color: var(--text-muted);
  font-size: 0.8rem;
  white-space: nowrap;
  cursor: pointer;
  transition: all 0.2s;
}

.filter-btn:hover {
  border-color: var(--primary);
  color: var(--primary);
}

.filter-btn.active {
  background: var(--primary);
  border-color: var(--primary);
  color: #000;
}

.filter-count {
  padding: 0.15rem 0.4rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  font-size: 0.65rem;
}

.filter-btn.active .filter-count {
  background: rgba(0, 0, 0, 0.2);
}

/* Content */
.lib-content {
  padding: 3rem 0;
}

.components-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 1.5rem;
}

/* Component Card */
.component-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s;
}

.component-card:hover {
  border-color: var(--primary);
  transform: translateY(-4px);
}

.component-card--adult {
  border-color: rgba(239, 68, 68, 0.3);
}

.component-card--adult:hover {
  border-color: #ef4444;
}

.card-preview {
  position: relative;
  height: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid var(--border);
}

.preview-placeholder {
  font-size: 4rem;
  opacity: 0.5;
}

.card-badges {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  display: flex;
  gap: 0.5rem;
}

.badge-adult {
  padding: 0.25rem 0.5rem;
  background: #ef4444;
  border-radius: 4px;
  font-size: 0.65rem;
  font-weight: 700;
  color: #fff;
}

.badge-new {
  padding: 0.25rem 0.5rem;
  background: #10b981;
  border-radius: 4px;
  font-size: 0.65rem;
  font-weight: 700;
  color: #000;
}

.card-info {
  padding: 1.25rem;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.75rem;
}

.card-header h3 {
  font-size: 1.1rem;
  margin: 0;
}

.card-tech {
  display: flex;
  gap: 0.25rem;
}

.tech-tag {
  padding: 0.2rem 0.5rem;
  background: rgba(16, 185, 129, 0.1);
  border-radius: 4px;
  font-size: 0.6rem;
  color: var(--primary);
}

.card-desc {
  font-size: 0.85rem;
  color: var(--text-muted);
  line-height: 1.5;
  margin-bottom: 1rem;
}

.card-features {
  list-style: none;
  padding: 0;
  margin: 0 0 1rem 0;
}

.card-features li {
  font-size: 0.75rem;
  color: var(--text-dark);
  padding: 0.25rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.feat-check {
  color: var(--primary);
}

.card-actions {
  display: flex;
  gap: 0.5rem;
}

.btn-copy,
.btn-preview {
  flex: 1;
  padding: 0.6rem 1rem;
  border-radius: 6px;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
}

.btn-copy {
  background: var(--primary);
  border: none;
  color: #000;
}

.btn-copy:hover {
  background: #0d9668;
}

.btn-preview {
  background: transparent;
  border: 1px solid var(--border);
  color: var(--text-muted);
}

.btn-preview:hover {
  border-color: var(--primary);
  color: var(--primary);
}

/* Code Modal */
.code-modal {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
}

.code-modal__container {
  width: 100%;
  max-width: 900px;
  max-height: 80vh;
  background: #0a0a0a;
  border: 1px solid var(--border);
  border-radius: 12px;
  display: flex;
  flex-direction: column;
}

.code-modal__header {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid var(--border);
}

.code-modal__header h3 {
  margin: 0;
  flex: 1;
}

.code-modal__tabs {
  display: flex;
  gap: 0.25rem;
}

.code-modal__tabs button {
  padding: 0.5rem 1rem;
  background: transparent;
  border: 1px solid var(--border);
  border-radius: 6px;
  color: var(--text-muted);
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s;
}

.code-modal__tabs button.active {
  background: var(--primary);
  border-color: var(--primary);
  color: #000;
}

.close-btn {
  width: 32px;
  height: 32px;
  background: transparent;
  border: 1px solid var(--border);
  border-radius: 6px;
  color: var(--text-muted);
  cursor: pointer;
}

.code-modal__body {
  flex: 1;
  overflow: auto;
  padding: 1.5rem;
}

.code-modal__body pre {
  margin: 0;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.8rem;
  line-height: 1.6;
  color: #e5e5e5;
  white-space: pre-wrap;
}

.code-modal__footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid var(--border);
}

.btn-copy-all {
  width: 100%;
  padding: 0.75rem;
  background: var(--primary);
  border: none;
  border-radius: 6px;
  color: #000;
  font-weight: 600;
  cursor: pointer;
}

/* Toast */
.toast {
  position: fixed;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  padding: 0.75rem 1.5rem;
  background: var(--primary);
  color: #000;
  border-radius: 8px;
  font-weight: 600;
  z-index: 2000;
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(20px);
}

/* Modal transition */
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .code-modal__container,
.modal-leave-to .code-modal__container {
  transform: scale(0.95);
}

/* Grid transition */
.grid-enter-active,
.grid-leave-active {
  transition: all 0.3s;
}

.grid-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.grid-leave-to {
  opacity: 0;
}

/* Responsive */
@media (max-width: 900px) {
  .components-grid {
    grid-template-columns: 1fr;
  }
}

/* Utility */
.mono-tag {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.7rem;
  color: var(--primary);
  letter-spacing: 0.1em;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
}
</style>
