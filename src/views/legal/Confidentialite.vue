<template>
  <div class="legal-page">
    <div class="container">
      <div class="tag">
        <span>⟨/⟩</span> RGPD
      </div>
      
      <h1 class="legal-page__title">Politique de confidentialité</h1>
      
      <div class="legal-content glass">
        <section class="legal-section">
          <h2>Responsable du traitement</h2>
          <p>
            <strong>GL Digital Lab</strong><br>
            Gaëtan LANGLET<br>
            Limoges, Nouvelle-Aquitaine, France<br>
            Email : <a href="mailto:contact@gldigitallab.fr">contact@gldigitallab.fr</a>
          </p>
        </section>
        
        <section class="legal-section">
          <h2>Données collectées</h2>
          <p>Lors de l'utilisation du formulaire de contact, nous collectons :</p>
          <ul>
            <li>Nom / Entreprise</li>
            <li>Adresse email</li>
            <li>Type de projet</li>
            <li>Budget estimé</li>
            <li>Description du projet</li>
          </ul>
          <p>
            Ces données sont collectées uniquement pour répondre à vos demandes et ne sont 
            jamais partagées avec des tiers.
          </p>
        </section>
        
        <section class="legal-section">
          <h2>Finalité du traitement</h2>
          <p>Les données collectées via le formulaire de contact sont utilisées uniquement pour :</p>
          <ul>
            <li>Répondre à votre demande de contact</li>
            <li>Vous fournir un devis personnalisé si demandé</li>
            <li>Assurer le suivi de notre relation commerciale</li>
          </ul>
        </section>
        
        <section class="legal-section">
          <h2>Durée de conservation</h2>
          <p>
            Vos données de contact sont conservées pendant une durée de 3 ans à compter 
            de notre dernier échange, conformément aux recommandations de la CNIL.
          </p>
        </section>
        
        <section class="legal-section">
          <h2>Vos droits</h2>
          <p>Conformément au RGPD, vous disposez des droits suivants :</p>
          <ul>
            <li><strong>Droit d'accès :</strong> obtenir la confirmation que vos données sont traitées</li>
            <li><strong>Droit de rectification :</strong> faire corriger des données inexactes</li>
            <li><strong>Droit à l'effacement :</strong> demander la suppression de vos données</li>
            <li><strong>Droit à la limitation :</strong> limiter le traitement de vos données</li>
            <li><strong>Droit à la portabilité :</strong> recevoir vos données dans un format structuré</li>
            <li><strong>Droit d'opposition :</strong> vous opposer au traitement de vos données</li>
          </ul>
          <p>
            Pour exercer ces droits : <a href="mailto:contact@gldigitallab.fr">contact@gldigitallab.fr</a>
          </p>
        </section>
        
        <section class="legal-section">
          <h2>Analyse d'audience (Matomo)</h2>
          <p>
            Ce site utilise <strong>Matomo Analytics</strong>, une solution d'analyse d'audience 
            respectueuse de la vie privée. Contrairement à d'autres outils d'analyse, Matomo est :
          </p>
          <ul>
            <li><strong>Hébergé en France</strong> — Vos données restent sur le territoire français</li>
            <li><strong>100% propriétaire</strong> — Aucune donnée partagée avec des tiers</li>
            <li><strong>RGPD-compliant</strong> — Anonymisation des IP et respect du Do Not Track</li>
            <li><strong>Open source</strong> — Transparence totale sur le traitement des données</li>
          </ul>
          
          <h3>Données collectées par Matomo</h3>
          <p>Avec votre consentement, nous collectons :</p>
          <ul>
            <li>Pages visitées et durée de visite</li>
            <li>Origine du trafic (moteur de recherche, lien direct)</li>
            <li>Type d'appareil et navigateur (anonymisé)</li>
            <li>Localisation approximative (pays/région uniquement)</li>
          </ul>
          
          <h3>Vos choix</h3>
          <div class="consent-status">
            <p v-if="consentGiven">
              <span class="status-badge status-badge--active">✓ Tracking activé</span>
              Vous avez accepté l'analyse d'audience.
            </p>
            <p v-else-if="consentAsked">
              <span class="status-badge status-badge--inactive">✗ Tracking désactivé</span>
              Vous avez refusé l'analyse d'audience.
            </p>
            <p v-else>
              <span class="status-badge status-badge--pending">○ En attente</span>
              Vous n'avez pas encore fait de choix.
            </p>
          </div>
          
          <button 
            @click="handleResetConsent" 
            class="consent-btn"
            type="button"
          >
            Modifier mes préférences
          </button>
        </section>
        
        <section class="legal-section">
          <h2>Cookies techniques</h2>
          <p>
            Outre Matomo (si vous l'acceptez), ce site utilise uniquement des cookies 
            techniques strictement nécessaires :
          </p>
          <ul>
            <li><code>gl_analytics_consent</code> — Mémorise votre choix concernant Matomo</li>
          </ul>
          <p>
            Ces cookies ne contiennent aucune donnée personnelle et ne sont pas utilisés 
            à des fins de tracking publicitaire.
          </p>
        </section>
        
        <section class="legal-section">
          <h2>Sécurité</h2>
          <p>
            Nous mettons en œuvre des mesures techniques et organisationnelles appropriées 
            pour protéger vos données personnelles contre la destruction accidentelle ou illicite, 
            la perte, l'altération, la divulgation ou l'accès non autorisé.
          </p>
          <ul>
            <li>Connexion HTTPS chiffrée</li>
            <li>Hébergement sur serveurs français (O2Switch)</li>
            <li>Aucun stockage de données sensibles côté client</li>
          </ul>
        </section>
        
        <section class="legal-section">
          <h2>Contact DPO</h2>
          <p>
            Pour toute question relative à la protection de vos données personnelles, 
            vous pouvez contacter notre délégué à la protection des données :
          </p>
          <p>
            <a href="mailto:contact@gldigitallab.fr">contact@gldigitallab.fr</a>
          </p>
          <p>
            Vous pouvez également introduire une réclamation auprès de la 
            <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer">CNIL</a>.
          </p>
        </section>
      </div>
      
      <p class="legal-page__update">
        Dernière mise à jour : {{ lastUpdate }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { useMatomo } from '@/composables/useMatomo';

const { consentGiven, consentAsked, resetConsent } = useMatomo();
const lastUpdate = 'Janvier 2026';

function handleResetConsent() {
  resetConsent();
  // Scroll vers le haut pour voir la bannière réapparaître
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
</script>

<style scoped>
.legal-page {
  min-height: 100vh;
  padding: calc(80px + var(--space-lg)) 0 var(--space-xl);
  position: relative;
  z-index: 1;
}

.legal-page__title {
  font-size: 2.5rem;
  margin: var(--space-md) 0 var(--space-lg);
}

.legal-content {
  padding: var(--space-lg);
  border-radius: 1rem;
  border: 1px solid var(--border);
}

.legal-section {
  margin-bottom: var(--space-lg);
  padding-bottom: var(--space-md);
  border-bottom: 1px solid var(--border);
}

.legal-section:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.legal-section h2 {
  font-size: 1.1rem;
  color: var(--primary);
  margin-bottom: var(--space-sm);
}

.legal-section h3 {
  font-size: 0.95rem;
  color: var(--text-main);
  margin: var(--space-md) 0 var(--space-xs);
}

.legal-section p {
  color: var(--text-muted);
  margin-bottom: var(--space-xs);
  line-height: 1.8;
}

.legal-section ul {
  color: var(--text-muted);
  margin: var(--space-xs) 0;
  padding-left: var(--space-md);
}

.legal-section li {
  margin-bottom: 0.5rem;
  line-height: 1.6;
}

.legal-section a {
  color: var(--primary);
}

.legal-section code {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.85em;
  background: rgba(16, 185, 129, 0.1);
  padding: 0.15em 0.4em;
  border-radius: 3px;
  color: var(--primary);
}

/* Consent Status */
.consent-status {
  margin: var(--space-sm) 0;
  padding: var(--space-sm);
  background: rgba(0, 0, 0, 0.3);
  border-radius: 4px;
  border: 1px solid var(--border);
}

.consent-status p {
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.status-badge {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.25rem 0.5rem;
  border-radius: 3px;
  white-space: nowrap;
}

.status-badge--active {
  background: rgba(16, 185, 129, 0.2);
  color: var(--primary);
  border: 1px solid var(--primary);
}

.status-badge--inactive {
  background: rgba(239, 68, 68, 0.2);
  color: #EF4444;
  border: 1px solid #EF4444;
}

.status-badge--pending {
  background: rgba(245, 158, 11, 0.2);
  color: #F59E0B;
  border: 1px solid #F59E0B;
}

.consent-btn {
  margin-top: var(--space-sm);
  padding: 0.6rem 1.25rem;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  background: transparent;
  color: var(--primary);
  border: 1px solid var(--primary);
  border-radius: 3px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.consent-btn:hover {
  background: var(--primary);
  color: var(--bg);
}

.legal-page__update {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.75rem;
  color: var(--text-dark);
  margin-top: var(--space-md);
  text-align: right;
}
</style>
