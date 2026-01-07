<template>
  <div class="contact-page">
    <!-- Hero -->
    <section class="hero">
      <div class="container">
        <div class="tag animate-pulse-slow">
          <span class="tag__dot"></span> DISPONIBLE
        </div>
        
        <h1 class="hero__title">
          OUVRIR UN <span class="text-gradient neon-text">CANAL SÉCURISÉ</span>
        </h1>
        
        <p class="hero__subtitle">
          Audit gratuit de 30 minutes. On définit ensemble l'architecture,<br>
          les risques à éviter, et les garde-fous à mettre en place.
        </p>
      </div>
    </section>
    
    <!-- Contact Card Two-Column -->
    <section class="contact-section">
      <div class="container">
        <div class="contact-card glass">
          <!-- Left Panel - Info -->
          <div class="contact-card__info">
            <div class="contact-card__header">
              <span class="mono-tag">/// CONTACT</span>
              <h2>Planifier un Entretien</h2>
              <p>Expliquez-moi votre projet. Je reviens vers vous sous 24h avec une première analyse.</p>
            </div>
            
            <div class="contact-card__details">
              <div class="detail-item">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
                <a href="mailto:contact@gldigitallab.fr">contact@gldigitallab.fr</a>
              </div>
              <div class="detail-item">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
                <a href="tel:+33678695881">06 78 69 58 81</a>
              </div>
              <div class="detail-item">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
                <span>Limoges, France</span>
              </div>
              <div class="detail-item">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12 6 12 12 16 14"/>
                </svg>
                <span>Réponse sous 24h</span>
              </div>
            </div>
            
            <!-- Process Steps -->
            <div class="process-mini">
              <div class="process-mini__step">
                <span class="process-mini__num">01</span>
                <span class="process-mini__text">Réception</span>
              </div>
              <div class="process-mini__arrow">→</div>
              <div class="process-mini__step">
                <span class="process-mini__num">02</span>
                <span class="process-mini__text">Analyse</span>
              </div>
              <div class="process-mini__arrow">→</div>
              <div class="process-mini__step">
                <span class="process-mini__num">03</span>
                <span class="process-mini__text">Call 30min</span>
              </div>
              <div class="process-mini__arrow">→</div>
              <div class="process-mini__step">
                <span class="process-mini__num">04</span>
                <span class="process-mini__text">Proposition</span>
              </div>
            </div>
          </div>
          
          <!-- Right Panel - Form -->
          <div class="contact-card__form">
            <form @submit.prevent="handleSubmit" v-if="formStatus === 'idle'">
              <div class="form-group">
                <label for="name" class="form-label">NOM / ENTREPRISE</label>
                <input 
                  type="text" 
                  id="name" 
                  v-model="form.name"
                  required
                  autocomplete="name"
                  placeholder="Jean Dupont / Acme Corp"
                  class="form-input"
                >
              </div>
              
              <div class="form-group">
                <label for="email" class="form-label">EMAIL PROFESSIONNEL</label>
                <input 
                  type="email" 
                  id="email" 
                  v-model="form.email"
                  required
                  autocomplete="email"
                  placeholder="contact@entreprise.com"
                  class="form-input"
                >
              </div>
              
              <div class="form-group">
                <label for="project" class="form-label">TYPE DE PROJET</label>
                <select 
                  id="project" 
                  v-model="form.project"
                  required
                  class="form-select"
                >
                  <option value="" disabled>Sélectionner...</option>
                  <option value="performance">PERFORMANCE — Audit & Refonte</option>
                  <option value="factory">DIGITAL FACTORY — App Sur-Mesure</option>
                  <option value="neural">NEURAL OPS — IA & Automatisation</option>
                  <option value="consulting">CONSULTING — Conseil Technique</option>
                </select>
              </div>
              
              <div class="form-group">
                <label for="budget" class="form-label">BUDGET ESTIMÉ</label>
                <select 
                  id="budget" 
                  v-model="form.budget"
                  class="form-select"
                >
                  <option value="" disabled>Sélectionner...</option>
                  <option value="5-10k">5 000€ - 10 000€</option>
                  <option value="10-20k">10 000€ - 20 000€</option>
                  <option value="20-50k">20 000€ - 50 000€</option>
                  <option value="50k+">50 000€+</option>
                  <option value="unknown">À définir</option>
                </select>
              </div>
              
              <div class="form-group">
                <label for="message" class="form-label">VOTRE PROJET</label>
                <textarea 
                  id="message" 
                  v-model="form.message"
                  rows="4"
                  placeholder="Décrivez brièvement votre besoin..."
                  class="form-textarea"
                ></textarea>
              </div>
              
              <button type="submit" class="form-submit" :disabled="formStatus === 'sending'">
                <span v-if="formStatus === 'sending'">TRANSMISSION EN COURS...</span>
                <span v-else>ENVOYER LA DEMANDE</span>
                <svg v-if="formStatus !== 'sending'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                </svg>
              </button>
            </form>
            
            <!-- Success State -->
            <div v-else-if="formStatus === 'success'" class="form-success" role="status" aria-live="polite">
              <div class="form-success__icon">✓</div>
              <h3>Message Reçu</h3>
              <p>Je reviens vers vous sous 24h avec une première analyse de votre projet.</p>
              <button @click="resetForm" class="form-success__reset">
                Envoyer un autre message
              </button>
            </div>
            
            <!-- Error State -->
            <div v-else-if="formStatus === 'error'" class="form-error" role="alert">
              <div class="form-error__icon">!</div>
              <h3>Erreur d'envoi</h3>
              <p>Une erreur est survenue. Veuillez réessayer ou me contacter directement par email.</p>
              <button @click="resetForm" class="form-error__retry">
                Réessayer
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
    
    <!-- Terminal Section -->
    <section class="terminal-section">
      <div class="container">
        <SystemTerminal
          title="gl@lab:~"
          :lines="terminalLines"
          :typeDelay="100"
        />
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import MagneticButton from '@/components/common/MagneticButton.vue';
import SystemTerminal from '@/components/common/SystemTerminal.vue';
import { useScrollAnimations } from '@/composables/useScrollAnimations';

const { fadeInUp, scaleIn } = useScrollAnimations();

// Terminal lines
const terminalLines = ref([
  { type: 'prompt', text: 'whoami' },
  { type: 'output', text: 'Gaëtan L. — Architecte Logiciel & SRE' },
  { type: 'prompt', text: 'cat /etc/stack.conf' },
  { type: 'output', text: 'Symfony 8 | Vue 3 | Three.js | n8n | Nemotron | PostgreSQL | Docker' },
  { type: 'prompt', text: 'uptime --production' },
  { type: 'output', text: '5+ years | 99.8% availability | 0 critical incidents' },
  { type: 'prompt', text: 'status --capacity' },
  { type: 'output', text: 'Accepting 2 new projects for Q1 2026', highlight: true },
]);

const formStatus = ref('idle'); // idle | sending | success | error

// FORMSPREE : Formulaire contact GL Digital Lab
const FORMSPREE_ID = 'mdakrrdb';

const form = reactive({
  name: '',
  email: '',
  project: '',
  budget: '',
  message: ''
});

const handleSubmit = async () => {
  formStatus.value = 'sending';
  
  try {
    const response = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        name: form.name,
        email: form.email,
        project: form.project,
        budget: form.budget,
        message: form.message,
        _subject: `[GL Digital Lab] Nouvelle demande de ${form.name}`
      })
    });
    
    if (response.ok) {
      formStatus.value = 'success';
      console.log('Form submitted successfully');
    } else {
      throw new Error('Form submission failed');
    }
  } catch (error) {
    console.error('Form error:', error);
    formStatus.value = 'error';
  }
};

const resetForm = () => {
  form.name = '';
  form.email = '';
  form.project = '';
  form.budget = '';
  form.message = '';
  formStatus.value = 'idle';
};

onMounted(() => {
  fadeInUp('.contact-card', { y: 60 });
  scaleIn('.terminal', { scale: 0.95 });
});
</script>

<style scoped>
.contact-page {
  min-height: 100vh;
  padding-top: 80px;
  position: relative;
  z-index: 1;
}

/* HERO */
.hero {
  padding: var(--space-lg) 0;
  text-align: center;
}

.tag {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: var(--primary-soft);
  border: 1px solid rgba(16, 185, 129, 0.2);
  border-radius: 2rem;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.65rem;
  color: var(--primary);
  letter-spacing: 0.1em;
}

.tag__dot {
  width: 6px;
  height: 6px;
  background: var(--primary);
  border-radius: 50%;
  animation: pulse-slow 2s infinite;
}

.hero__title {
  font-size: clamp(2rem, 6vw, 3.5rem);
  font-weight: 900;
  margin: var(--space-md) 0;
}

.hero__subtitle {
  font-size: 1rem;
  color: var(--text-muted);
  line-height: 1.8;
}

/* CONTACT CARD */
.contact-section {
  padding: 0 0 var(--space-xl);
}

.contact-card {
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  border-radius: 1.5rem;
  overflow: hidden;
  border: 1px solid var(--border);
  opacity: 0;
}

.contact-card__info {
  padding: var(--space-lg);
  background: var(--bg);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.contact-card__form {
  padding: var(--space-lg);
  background: var(--surface);
}

/* INFO PANEL */
.mono-tag {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.65rem;
  color: var(--primary);
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.contact-card__header h2 {
  font-size: 1.5rem;
  margin: 0.5rem 0;
}

.contact-card__header p {
  font-size: 0.85rem;
  color: var(--text-muted);
  line-height: 1.7;
}

.contact-card__details {
  margin: var(--space-md) 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.8rem;
  color: var(--text-muted);
}

.detail-item svg {
  color: var(--primary);
  flex-shrink: 0;
}

/* MINI PROCESS */
.process-mini {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: var(--space-sm);
  background: var(--surface);
  border-radius: 0.75rem;
  border: 1px solid var(--border);
  margin-top: auto;
}

.process-mini__step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
}

.process-mini__num {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.6rem;
  color: var(--primary);
  opacity: 0.5;
}

.process-mini__text {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.6rem;
  color: var(--text-muted);
}

.process-mini__arrow {
  color: var(--primary);
  opacity: 0.3;
  font-size: 0.75rem;
}

/* FORM */
.form-group {
  margin-bottom: var(--space-sm);
}

.form-label {
  display: block;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.65rem;
  font-weight: 700;
  color: var(--primary);
  margin-bottom: 0.5rem;
  letter-spacing: 0.05em;
}

.form-input,
.form-select,
.form-textarea {
  width: 100%;
  padding: 0.875rem 1rem;
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 0.5rem;
  font-family: 'Inter', sans-serif;
  font-size: 0.85rem;
  color: var(--text-main);
  transition: var(--transition-base);
}

.form-input::placeholder,
.form-textarea::placeholder {
  color: var(--text-dark);
}

.form-input:focus,
.form-select:focus,
.form-textarea:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px var(--primary-soft);
}

.form-select {
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2371717a' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  padding-right: 2.5rem;
}

.form-textarea {
  resize: vertical;
  min-height: 100px;
}

.form-submit {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 1rem;
  background: var(--primary);
  color: var(--bg);
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.75rem;
  font-weight: 700;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: var(--transition-base);
  margin-top: var(--space-sm);
}

.form-submit:hover {
  background: var(--text-main);
  box-shadow: 0 4px 20px rgba(255, 255, 255, 0.2);
}

/* SUCCESS / ERROR STATES */
.form-success,
.form-error {
  text-align: center;
  padding: var(--space-lg);
}

.form-success__icon {
  width: 64px;
  height: 64px;
  background: var(--primary);
  color: var(--bg);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  margin: 0 auto var(--space-sm);
}

.form-error__icon {
  width: 64px;
  height: 64px;
  background: #EF4444;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: bold;
  margin: 0 auto var(--space-sm);
}

.form-success h3,
.form-error h3 {
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
}

.form-success p,
.form-error p {
  font-size: 0.85rem;
  color: var(--text-muted);
  margin-bottom: var(--space-md);
}

.form-success__reset,
.form-error__retry {
  padding: 0.75rem 1.5rem;
  background: transparent;
  border: 1px solid var(--border);
  color: var(--text-muted);
  font-size: 0.75rem;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: var(--transition-base);
}

.form-success__reset:hover,
.form-error__retry:hover {
  border-color: var(--primary);
  color: var(--primary);
}

/* TERMINAL SECTION */
.terminal-section {
  padding: var(--space-xl) 0;
}

.terminal-section .system-terminal {
  max-width: 600px;
  margin: 0 auto;
}

/* RESPONSIVE */
@media (max-width: 1024px) {
  .contact-card {
    grid-template-columns: 1fr;
  }
  
  .process-mini {
    flex-wrap: wrap;
    justify-content: center;
  }
}

@media (max-width: 768px) {
  .contact-card__info,
  .contact-card__form {
    padding: var(--space-md);
  }
}
</style>
