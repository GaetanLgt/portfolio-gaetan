<template>
  <div class="contact">
    <!-- Hero Section -->
    <section class="hero">
      <div class="container">
        <h1 class="hero__title">
          Discutons de <span class="text-gradient">votre projet</span>
        </h1>
        <p class="hero__subtitle">
          Réponse sous 24h • Premier échange gratuit
        </p>
      </div>
    </section>

    <!-- Contact Form Section -->
    <section class="contact-form">
      <div class="container">
        <div class="contact-form__grid">
          <!-- Formulaire -->
          <div class="form-container">
            <form @submit.prevent="handleSubmit" class="form">
              <div class="form-group">
                <label for="name" class="form-label">Nom complet *</label>
                <input
                  type="text"
                  id="name"
                  v-model="formData.name"
                  class="form-input"
                  required
                  placeholder="Jean Dupont"
                />
              </div>

              <div class="form-group">
                <label for="email" class="form-label">Email *</label>
                <input
                  type="email"
                  id="email"
                  v-model="formData.email"
                  class="form-input"
                  required
                  placeholder="jean@entreprise.fr"
                />
              </div>

              <div class="form-group">
                <label for="phone" class="form-label">Téléphone</label>
                <input
                  type="tel"
                  id="phone"
                  v-model="formData.phone"
                  class="form-input"
                  placeholder="06 12 34 56 78"
                />
              </div>

              <div class="form-group">
                <label for="company" class="form-label">Entreprise</label>
                <input
                  type="text"
                  id="company"
                  v-model="formData.company"
                  class="form-input"
                  placeholder="Mon Entreprise SAS"
                />
              </div>

              <div class="form-group">
                <label for="service" class="form-label">Offre souhaitée *</label>
                <select
                  id="service"
                  v-model="formData.service"
                  class="form-select"
                  required
                >
                  <option value="">Sélectionnez une offre</option>
                  <option value="starter">STARTER - Refonte Web (8k-15k€)</option>
                  <option value="pro">PRO - Application Métier (15k-30k€)</option>
                  <option value="premium">PREMIUM - Automatisation IA (12k-25k€)</option>
                  <option value="consulting">CONSULTING - Accompagnement (800€/j)</option>
                  <option value="other">Autre / Pas sûr</option>
                </select>
              </div>

              <div class="form-group">
                <label for="budget" class="form-label">Budget estimé</label>
                <select
                  id="budget"
                  v-model="formData.budget"
                  class="form-select"
                >
                  <option value="">Non défini</option>
                  <option value="5k-10k">5k-10k€</option>
                  <option value="10k-20k">10k-20k€</option>
                  <option value="20k-50k">20k-50k€</option>
                  <option value="50k+">50k€+</option>
                </select>
              </div>

              <div class="form-group">
                <label for="timeline" class="form-label">Délai souhaité</label>
                <select
                  id="timeline"
                  v-model="formData.timeline"
                  class="form-select"
                >
                  <option value="">Non défini</option>
                  <option value="urgent">Urgent (< 1 mois)</option>
                  <option value="court">Court terme (1-3 mois)</option>
                  <option value="moyen">Moyen terme (3-6 mois)</option>
                  <option value="long">Long terme (6+ mois)</option>
                </select>
              </div>

              <div class="form-group form-group--full">
                <label for="message" class="form-label">Décrivez votre projet *</label>
                <textarea
                  id="message"
                  v-model="formData.message"
                  class="form-textarea"
                  rows="6"
                  required
                  placeholder="Décrivez vos besoins, objectifs, contraintes..."
                ></textarea>
              </div>

              <div class="form-actions">
                <button type="submit" class="btn btn--primary btn--large" :disabled="isSubmitting">
                  {{ isSubmitting ? 'Envoi en cours...' : 'Envoyer la demande' }}
                </button>
              </div>

              <div v-if="submitStatus === 'success'" class="form-message form-message--success">
                ✓ Merci ! Votre demande a été envoyée. Je vous réponds sous 24h.
              </div>

              <div v-if="submitStatus === 'error'" class="form-message form-message--error">
                ✗ Erreur lors de l'envoi. Contactez-moi directement par email.
              </div>
            </form>
          </div>

          <!-- Sidebar Info -->
          <div class="sidebar">
            <div class="info-card">
              <h3 class="info-card__title">Coordonnées</h3>
              <div class="info-item">
                <span class="info-icon">📧</span>
                <div class="info-content">
                  <span class="info-label">Email</span>
                  <a href="mailto:contact@gldigitallab.fr" class="info-value">
                    contact@gldigitallab.fr
                  </a>
                </div>
              </div>
              <div class="info-item">
                <span class="info-icon">📍</span>
                <div class="info-content">
                  <span class="info-label">Localisation</span>
                  <span class="info-value">Limoges, France (remote possible)</span>
                </div>
              </div>
              <div class="info-item">
                <span class="info-icon">⏱️</span>
                <div class="info-content">
                  <span class="info-label">Délai de réponse</span>
                  <span class="info-value">< 24h (jours ouvrés)</span>
                </div>
              </div>
            </div>

            <div class="info-card">
              <h3 class="info-card__title">Disponibilité</h3>
              <div class="availability">
                <div class="availability__status">
                  <span class="status-dot status-dot--available"></span>
                  <span class="status-text">Disponible pour nouveaux projets</span>
                </div>
                <p class="availability__note">
                  Prochains slots : <strong>Février 2026</strong>
                </p>
              </div>
            </div>

            <div class="info-card">
              <h3 class="info-card__title">Ce qui se passe ensuite</h3>
              <ol class="process-list">
                <li class="process-item">
                  <strong>Réponse sous 24h</strong>
                  <span>Premier échange par email</span>
                </li>
                <li class="process-item">
                  <strong>Appel découverte</strong>
                  <span>30 min pour comprendre vos besoins</span>
                </li>
                <li class="process-item">
                  <strong>Devis détaillé</strong>
                  <span>Proposition technique + budget transparent</span>
                </li>
                <li class="process-item">
                  <strong>Démarrage</strong>
                  <span>Si alignement, on lance le projet !</span>
                </li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- FAQ Section -->
    <section class="faq">
      <div class="container">
        <h2 class="section-title">Questions fréquentes</h2>
        <div class="faq__grid">
          <div v-for="item in faqData" :key="item.question" class="faq-item">
            <h3 class="faq-item__question">{{ item.question }}</h3>
            <p class="faq-item__answer">{{ item.answer }}</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';

const formData = reactive({
  name: '',
  email: '',
  phone: '',
  company: '',
  service: '',
  budget: '',
  timeline: '',
  message: ''
});

const isSubmitting = ref(false);
const submitStatus = ref(null);

const handleSubmit = async () => {
  isSubmitting.value = true;
  submitStatus.value = null;

  try {
    // Simulation envoi (à remplacer par vraie intégration)
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // TODO: Intégrer avec backend ou service email
    console.log('Form data:', formData);
    
    submitStatus.value = 'success';
    
    // Reset form après succès
    Object.keys(formData).forEach(key => formData[key] = '');
  } catch (error) {
    submitStatus.value = 'error';
  } finally {
    isSubmitting.value = false;
  }
};

const faqData = ref([
  {
    question: 'Travaillez-vous uniquement sur Limoges ?',
    answer: 'Non, je travaille en remote avec des clients partout en France. Un déplacement est possible pour la phase de découverte si besoin.'
  },
  {
    question: 'Quels sont vos délais moyens ?',
    answer: 'Variable selon l\'offre : 4-6 semaines pour STARTER, 8-12 semaines pour PRO, 6-10 semaines pour PREMIUM. Délais fixes validés avant démarrage.'
  },
  {
    question: 'Proposez-vous de la maintenance ?',
    answer: 'Oui, toutes les offres incluent un support post-launch (1 à 6 mois selon offre). Ensuite, contrat maintenance optionnel disponible.'
  },
  {
    question: 'Acceptez-vous les petits budgets ?',
    answer: 'Mon offre STARTER démarre à 8k€. En-dessous, je recommande des solutions no-code ou je peux vous orienter vers d\'autres prestataires.'
  },
  {
    question: 'Travaillez-vous avec des agences ?',
    answer: 'Oui, je collabore avec des agences en sous-traitance pour la partie technique Symfony/Vue. Contactez-moi pour discuter partenariat.'
  },
  {
    question: 'Quels modes de paiement ?',
    answer: 'Acompte 30% au démarrage, 40% à mi-projet, 30% à la livraison. Paiement par virement bancaire. Facture conforme.'
  }
]);
</script>

<style scoped>
.contact { padding-top: 80px; }

/* Hero Section */
.hero {
  padding: var(--space-xl) 0;
  text-align: center;
  background: linear-gradient(135deg, rgba(0, 255, 65, 0.05) 0%, rgba(0, 255, 65, 0.01) 100%);
}

.hero__title {
  font-size: clamp(2rem, 5vw, 3rem);
  margin-bottom: var(--space-sm);
}

.hero__subtitle {
  font-size: 1.125rem;
  color: var(--text-secondary);
}

/* Contact Form Section */
.contact-form {
  padding: var(--space-xl) 0;
}

.contact-form__grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: var(--space-xl);
}

.form-container {
  background: var(--card-bg);
  border: 1px solid var(--border-subtle);
  border-radius: 12px;
  padding: var(--space-lg);
}

.form {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-md);
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group--full {
  grid-column: 1 / -1;
}

.form-label {
  font-size: 0.875rem;
  color: var(--matrix-green);
  margin-bottom: var(--space-xs);
  font-family: 'JetBrains Mono', monospace;
}

.form-input,
.form-select,
.form-textarea {
  padding: 0.75rem;
  background: rgba(0, 255, 65, 0.05);
  border: 1px solid var(--border-subtle);
  border-radius: 8px;
  color: var(--text-primary);
  font-family: 'Inter', sans-serif;
  font-size: 0.875rem;
  transition: all var(--transition-base);
}

.form-input:focus,
.form-select:focus,
.form-textarea:focus {
  outline: none;
  border-color: var(--matrix-green);
  background: rgba(0, 255, 65, 0.1);
}

.form-textarea {
  resize: vertical;
  min-height: 150px;
}

.form-actions {
  grid-column: 1 / -1;
  margin-top: var(--space-sm);
}

.form-message {
  grid-column: 1 / -1;
  padding: var(--space-md);
  border-radius: 8px;
  font-size: 0.875rem;
  text-align: center;
  margin-top: var(--space-sm);
}

.form-message--success {
  background: rgba(0, 255, 65, 0.1);
  border: 1px solid var(--matrix-green);
  color: var(--matrix-green);
}

.form-message--error {
  background: rgba(255, 65, 0, 0.1);
  border: 1px solid #ff4100;
  color: #ff6b3d;
}

/* Sidebar */
.sidebar {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.info-card {
  background: var(--card-bg);
  border: 1px solid var(--border-subtle);
  border-radius: 12px;
  padding: var(--space-md);
}

.info-card__title {
  font-size: 1.125rem;
  color: var(--matrix-green);
  margin-bottom: var(--space-md);
  font-family: 'JetBrains Mono', monospace;
}

.info-item {
  display: flex;
  gap: var(--space-sm);
  margin-bottom: var(--space-md);
}

.info-item:last-child {
  margin-bottom: 0;
}

.info-icon {
  font-size: 1.5rem;
}

.info-content {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.info-label {
  font-size: 0.75rem;
  color: var(--text-secondary);
  margin-bottom: 0.25rem;
}

.info-value {
  font-size: 0.875rem;
  color: var(--text-primary);
}

.info-value[href] {
  color: var(--matrix-green);
}

.info-value[href]:hover {
  text-decoration: underline;
}

.availability {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.availability__status {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
}

.status-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.status-dot--available {
  background: var(--matrix-green);
  box-shadow: 0 0 10px rgba(0, 255, 65, 0.5);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.status-text {
  font-size: 0.875rem;
  color: var(--matrix-green);
  font-weight: 600;
}

.availability__note {
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.process-list {
  list-style: none;
  counter-reset: process-counter;
}

.process-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  margin-bottom: var(--space-md);
  padding-left: var(--space-lg);
  position: relative;
  counter-increment: process-counter;
}

.process-item::before {
  content: counter(process-counter);
  position: absolute;
  left: 0;
  top: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--matrix-green);
  color: var(--code-dark);
  border-radius: 50%;
  font-size: 0.75rem;
  font-weight: 700;
  font-family: 'JetBrains Mono', monospace;
}

.process-item strong {
  font-size: 0.875rem;
  color: var(--matrix-green);
}

.process-item span {
  font-size: 0.75rem;
  color: var(--text-secondary);
}

/* FAQ Section */
.faq {
  padding: var(--space-xl) 0;
  background: rgba(0, 255, 65, 0.02);
  border-top: 1px solid var(--border-subtle);
}

.faq__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--space-md);
  margin-top: var(--space-lg);
}

.faq-item {
  padding: var(--space-md);
  background: var(--card-bg);
  border: 1px solid var(--border-subtle);
  border-radius: 12px;
  transition: all var(--transition-base);
}

.faq-item:hover {
  border-color: var(--matrix-green);
  transform: translateY(-4px);
}

.faq-item__question {
  font-size: 1rem;
  color: var(--matrix-green);
  margin-bottom: var(--space-sm);
  font-family: 'JetBrains Mono', monospace;
}

.faq-item__answer {
  font-size: 0.875rem;
  color: var(--text-secondary);
  line-height: 1.6;
}

.section-title {
  text-align: center;
  font-size: clamp(2rem, 4vw, 2.5rem);
  color: var(--matrix-green);
  margin-bottom: var(--space-lg);
}

/* Buttons */
.btn {
  display: inline-block;
  padding: 0.875rem 1.75rem;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.875rem;
  text-align: center;
  border-radius: 8px;
  transition: all var(--transition-base);
  cursor: pointer;
  text-decoration: none;
  border: none;
}

.btn--primary {
  background: var(--matrix-green);
  color: var(--code-dark);
  border: 2px solid var(--matrix-green);
}

.btn--primary:hover:not(:disabled) {
  background: transparent;
  color: var(--matrix-green);
}

.btn--primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn--large {
  padding: 1rem 2rem;
  font-size: 1rem;
}

@media (max-width: 968px) {
  .contact-form__grid {
    grid-template-columns: 1fr;
  }
  
  .form {
    grid-template-columns: 1fr;
  }
}
</style>
