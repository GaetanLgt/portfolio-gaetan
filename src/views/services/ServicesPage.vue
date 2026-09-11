<template>
  <div class="services-page">
    <!-- Hero -->
    <section class="hero">
      <div class="container">
        <div class="tag animate-pulse-slow">
          L'OFFRE
        </div>
        
        <h1 class="hero__title">
          VOS OUTILS.<br>
          <span class="text-gradient neon-text">CHEZ VOUS. À VOUS.</span>
        </h1>
        
        <p class="hero__subtitle">
          Des systèmes multi-agents locaux — agents, mémoire, automatisations — conçus pour
          <strong>votre</strong> métier. Nous construisons le navire, <strong>vous en devenez le
          capitaine</strong> : vos outils, vos données, vos clés. Pas de dépendance au cloud
          lointain, pas de licence qui augmente chaque année.
        </p>
      </div>
    </section>
    
    <!-- Le diagnostic avant tout -->
    <section class="matrix-awakening" aria-labelledby="sonde-titre">
      <div class="container">
        <!-- Titre de section : il manquait, et les cartes ci-dessous étant des
             h3, la page sautait de h1 à h3. Un lecteur d'écran qui navigue par
             titres perdait le fil de la structure. -->
        <div class="section-header section-header--center">
          <span class="mono-tag" aria-hidden="true">/// LA SONDE</span>
          <h2 id="sonde-titre">On mesure avant de s'engager</h2>
        </div>
        <div class="awakening-grid">
          <div class="awakening-card glass">
            <!-- Emoji remplacé par une bande hachurée d'alerte (motif du système
                 de design) : le verrou D1 interdit les emojis en icône, et leur
                 rendu dépend du système d'exploitation du visiteur. -->
            <span class="awakening-card__icon" aria-hidden="true"></span>
            <h3>La sonde</h3>
            <p class="awakening-card__status awakening-card__status--blue">On mesure avant de s'engager — sans diagnostic</p>
            <ul>
              <li>Données sur serveurs US (GAFAM)</li>
              <li>Abonnements SaaS qui augmentent</li>
              <li>WordPress vieillissant, sans mises à jour</li>
              <li>Aucune visibilité sur vos flux</li>
            </ul>
          </div>
          <div class="awakening-vs">
            <span>VS</span>
          </div>
          <div class="awakening-card awakening-card--red glass">
            <span class="awakening-card__icon awakening-card__icon--apres" aria-hidden="true"></span>
            <h3>Après la sonde</h3>
            <p class="awakening-card__status awakening-card__status--red">Ce qui change</p>
            <ul>
              <li>Failles réelles relevées, chiffres à l'appui</li>
              <li>Coûts fixes, prévisibles</li>
              <li>IA exécutée localement — flux de données décrits, sans formule absolue</li>
              <li>Vous possédez votre code</li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- Tarifs à la carte -->
    <section class="pricing-extras">
      <div class="container">
        <div class="section-header section-header--center">
          <span class="mono-tag">/// À LA CARTE</span>
          <h2>Un besoin ponctuel ? Une intervention claire.</h2>
        </div>
        
        <div class="pricing-grid">
          <!-- TJM -->
          <div class="pricing-card glass">
            <div class="pricing-card__icon" aria-hidden="true">01</div>
            <h3 class="pricing-card__title">Taux Journalier</h3>
            <p class="pricing-card__price">450€ <span>/ jour</span></p>
            <p class="pricing-card__desc">Développement, intégration, conseil technique. Minimum 2 jours.</p>
            <ul class="pricing-card__details">
              <li>Développement Symfony / Vue.js</li>
              <li>Intégration API</li>
              <li>Revue de code</li>
              <li>Pair programming</li>
            </ul>
          </div>
          
          <!-- Audit -->
          <div class="pricing-card glass">
            <div class="pricing-card__icon" aria-hidden="true">02</div>
            <h3 class="pricing-card__title">Audit Web — 48 h</h3>
            <p class="pricing-card__price">149€ – 199€ <span>/ site audité</span></p>
            <p class="pricing-card__desc">Le diagnostic complet d'un site <strong>existant</strong> : je vous montre vos failles sur votre site, pas sur un cas fictif. (Offre distincte de l'audit IA + prototype — voir Accueil / RAG MÉMOIRE.)</p>
            <ul class="pricing-card__details">
              <li>Version WP/PHP, plugins, CVE connues</li>
              <li>Audit performance & sécurité</li>
              <li>Rapport clair, sans jargon</li>
              <li>Plan chiffré + devis de correction en option</li>
            </ul>
          </div>
          
          <!-- Consulting -->
          <div class="pricing-card glass">
            <div class="pricing-card__icon" aria-hidden="true">03</div>
            <h3 class="pricing-card__title">Consulting</h3>
            <p class="pricing-card__price">90€ <span>/ heure</span></p>
            <p class="pricing-card__desc">Conseil stratégique ponctuel, à l'heure (visio ou sur site). Le développement au forfait est au TJM.</p>
            <ul class="pricing-card__details">
              <li>Visio ou présentiel</li>
              <li>Architecture technique</li>
              <li>Choix de stack</li>
              <li>Compte-rendu écrit</li>
            </ul>
          </div>
          
          <!-- Maintenance -->
          <div class="pricing-card glass pricing-card--highlight">
            <div class="pricing-card__badge">RECOMMANDÉ</div>
            <div class="pricing-card__icon" aria-hidden="true">04</div>
            <h3 class="pricing-card__title">Maintenance</h3>
            <p class="pricing-card__price">350€ <span>/ mois</span></p>
            <p class="pricing-card__desc">Surveillance, mises à jour et support réactif pour votre application.</p>
            <ul class="pricing-card__details">
              <li>Monitoring 24/7</li>
              <li>Mises à jour sécurité</li>
              <li>Support réactif 48h</li>
              <li>2h d'interventions incluses</li>
            </ul>
          </div>
        </div>
        
        <p class="pricing-note">
          <strong>Note :</strong> Tous les tarifs sont HT. Devis personnalisé sur demande pour les projets complexes.
        </p>
      </div>
    </section>

    <!-- Offers Grid -->
    <section class="offers">
      <div class="container">
        <div class="section-header section-header--center">
          <span class="mono-tag">/// LES CHEMINS</span>
          <h2>Plusieurs chemins, un même centre : vous</h2>
        </div>
        
        <!-- Filtres -->
        <div class="offers__filters" role="group" aria-label="Filtrer les services">
          <button 
            @click="filter = 'all'" 
            :class="{ 'filter-btn--active': filter === 'all' }" 
            class="filter-btn"
          >Tous</button>
          <button 
            @click="filter = 'ai'" 
            :class="{ 'filter-btn--active': filter === 'ai' }" 
            class="filter-btn"
          >Penser</button>
        </div>
        
        <div class="offers__grid">
          
          <!-- RAG MÉMOIRE -->
          <article 
            v-show="filter === 'all' || filter === 'ai'" 
            class="offer-card"
          >
            <div class="offer-card__bg-icon">
              <svg width="128" height="128" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
              </svg>
            </div>
            
            <div class="offer-card__header">
              <div class="offer-card__icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
                </svg>
              </div>
              <span class="offer-card__tag">MÉMOIRE</span>
            </div>
            
            <h3 class="offer-card__title">RAG MÉMOIRE</h3>
            <p class="offer-card__price">3k€ – 15k€</p>
            
            <p class="offer-card__desc">
              Assistant interne qui répond aux questions de votre entreprise à partir de VOS documents. Hébergé en France, réponses sourcées, zéro hallucination.
            </p>
            
            <ul class="offer-card__features">
              <li><span class="check">✓</span> Indexation de vos documents (PDF, Word, mails)</li>
              <li><span class="check">✓</span> Réponses sourcées (chaque réponse cite son document)</li>
              <li><span class="check">✓</span> Hébergement France — données jamais utilisées pour entraîner</li>
              <li><span class="check">✓</span> RGPD : suppression sur demande (droit à l'effacement)</li>
              <li><span class="check">✓</span> 3 niveaux : Découverte 3k€ · Standard 8k€ · Sur-mesure 15k€</li>
            </ul>
            
            <div class="offer-card__footer">
              <span class="offer-card__duration">1-4 semaines</span>
              <router-link to="/contact" class="offer-card__cta">SÉLECTIONNER</router-link>
            </div>
          </article>
          
        </div>
      </div>
    </section>
    
    <!-- Process Timeline -->
    <section class="process">
      <div class="container">
        <div class="process__header">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="18" cy="18" r="3"/><circle cx="6" cy="6" r="3"/>
            <path d="M6 21V9a9 9 0 0 0 9 9"/>
          </svg>
          <div>
            <h2 class="process__title">LA MÉTHODE</h2>
            <p class="process__subtitle">DU DIAGNOSTIC À LA MAINTENANCE — VOUS VALIDEZ CHAQUE ÉTAPE</p>
          </div>
        </div>
        
        <div class="timeline">
          <div v-for="(step, index) in steps" :key="index" class="timeline__item">
            <div class="timeline__badge">{{ index + 1 }}</div>
            <div class="timeline__content glass">
              <span class="timeline__duration">{{ step.duration }}</span>
              <p class="timeline__cmd">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/>
                </svg>
                {{ step.cmd }}
              </p>
              <h3 class="timeline__title">{{ step.title }}</h3>
              <ul class="timeline__details">
                <li v-for="detail in step.details" :key="detail">{{ detail }}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
    
    <!-- Use Cases -->
    <section class="use-cases">
      <div class="container">
        <h2 class="section-title">CAS D'USAGE CONCRETS</h2>
        
        <div class="use-cases__grid">
          <div class="use-case cyber-card">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M2 20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8l-7 5V8l-7 5V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/>
            </svg>
            <h3>Industrie PME</h3>
            <p>ERP sur-mesure pour gérer la production et les stocks sans licence coûteuse.</p>
          </div>
          
          <div class="use-case cyber-card">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="4" y="2" width="16" height="20" rx="2" ry="2"/>
              <path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/>
              <path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/>
              <path d="M8 10h.01"/><path d="M8 14h.01"/>
            </svg>
            <h3>Cabinet Conseil</h3>
            <p>Plateforme de gestion clients avec IA locale pour analyser les documents.</p>
          </div>
          
          <div class="use-case cyber-card">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/>
              <path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
            <h3>Commerce</h3>
            <p>E-commerce ultra-rapide avec inventaire temps réel synchronisé.</p>
          </div>
          
          <div class="use-case cyber-card">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>
            </svg>
            <h3>Formation</h3>
            <p>LMS interactif pour dispenser des cours et suivre les élèves.</p>
          </div>
        </div>
      </div>
    </section>
    
    <!-- Garanties -->
    <section class="guarantees">
      <div class="container">
        <div class="guarantees__grid">
          <div class="guarantee">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
            <span>CODE PROPRIÉTAIRE</span>
          </div>
          <div class="guarantee">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="2" y="2" width="20" height="8" rx="2" ry="2"/><rect x="2" y="14" width="20" height="8" rx="2" ry="2"/>
              <line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/>
            </svg>
            <span>HÉBERGEMENT FR</span>
          </div>
          <div class="guarantee">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
            <span>RGPD NATIVE</span>
          </div>
          <div class="guarantee">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
            </svg>
            <span>DOC COMPLÈTE</span>
          </div>
          <div class="guarantee">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
            <span>FORMATION ÉQUIPE</span>
          </div>
          <div class="guarantee">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/>
              <line x1="4.93" y1="4.93" x2="9.17" y2="9.17"/><line x1="14.83" y1="14.83" x2="19.07" y2="19.07"/>
              <line x1="14.83" y1="9.17" x2="19.07" y2="4.93"/><line x1="14.83" y1="9.17" x2="18.36" y2="5.64"/>
              <line x1="4.93" y1="19.07" x2="9.17" y2="14.83"/>
            </svg>
            <span>SUPPORT 3 MOIS</span>
          </div>
        </div>
      </div>
    </section>

    <!-- PREUVE : construit pour nous-mêmes (ArkAdiA) -->
    <section class="preuve-arkadia" aria-labelledby="preuve-arkadia-title">
      <div class="container">
        <div class="preuve-arkadia__box">
          <div class="preuve-arkadia__texte">
            <span class="mono-tag" aria-hidden="true">/// LA PREUVE</span>
            <h2 id="preuve-arkadia-title" class="preuve-arkadia__titre">
              Ce service, on l'a d'abord construit pour nous-mêmes
            </h2>
            <p class="preuve-arkadia__desc">
              <strong>ArkAdiA</strong> — notre réseau social souverain (comptes, communautés,
              messagerie temps réel, IA 100 % locale, zéro traceur) — est aujourd'hui une
              <strong>preuve de concept en développement</strong> : sa propre page l'annonce,
              l'interface finale reste à valider visuellement. Ce n'est pas encore un réseau ouvert.
              Même rigueur, mêmes standards pour vos outils : code sur-mesure, données qui ne
              sortent pas, hébergement en France.
            </p>
            <div class="preuve-arkadia__actions">
              <a class="btn-outline preuve-arkadia__lien" href="https://arkadia.gldigitallab.fr" target="_blank" rel="noopener noreferrer">
                Voir ArkAdiA ↗
              </a>
              <router-link class="btn-primary" to="/contact">
                Parler de mon projet
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </section>
    
    <!-- CTA -->
    <section class="cta-section">
      <div class="container">
        <div class="cta-box glass">
          <h2 class="cta-box__title">PRÊT À REPRENDRE LA MAIN ?</h2>
          <p class="cta-box__desc">
            Je prends 2 nouveaux projets par mois pour garantir la qualité.<br>
            Commençons par un <strong>diagnostic de 30 minutes</strong>, gratuit et sans engagement.
            L'audit complet, lui, est livré en 48 h.
          </p>
          <router-link to="/contact" class="btn-primary">
            RÉSERVER MON DIAGNOSTIC
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
            </svg>
          </router-link>
          <p class="cta-box__note">Réponse garantie sous 24h ouvrées.</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useScrollAnimations } from '@/composables/useScrollAnimations';

const expandedCard = ref(null);
const filter = ref('all');

const { fadeInUp, staggerCards } = useScrollAnimations();

onMounted(() => {
  // Anime les cards d'offres
  staggerCards('.offers__grid', '.offer-card', { y: 80, stagger: 0.2 });
  
  // Anime la timeline
  fadeInUp('.timeline__item', { y: 40, stagger: 0.15 });
  
  // Anime les use cases
  staggerCards('.use-cases__grid', '.use-case', { y: 50, stagger: 0.1 });
  
  // Anime les garanties
  fadeInUp('.guarantee', { y: 30, stagger: 0.08 });
});

const steps = [
  {
    title: 'ANALYSE',
    duration: 'Semaine 1',
    cmd: 'init analysis',
    details: ['Audit technique complet', 'Cartographie des besoins', 'Définition du scope']
  },
  {
    title: 'ARCHITECTURE',
    duration: 'Semaine 2-3',
    cmd: 'build arch',
    details: ['Schéma de BDD', 'Wireframes UX', 'Validation stack technique']
  },
  {
    title: 'DÉVELOPPEMENT',
    duration: 'Semaine 4-8',
    cmd: 'run sprint',
    details: ['Sprints de 2 semaines', 'Démos régulières', 'Tests continus']
  },
  {
    title: 'DÉPLOIEMENT',
    duration: 'Semaine 9',
    cmd: 'deploy prod',
    details: ['Migration progressive', 'Formation équipe', 'Monitoring activé']
  },
  {
    title: 'MAINTENANCE',
    duration: 'Continu',
    cmd: 'systemctl start',
    details: ['Support réactif 48h', 'Mises à jour sécurité', 'Optimisations continues']
  }
];
</script>

<style scoped>
.services-page {
  min-height: 100vh;
  padding-top: 80px;
  position: relative;
  z-index: 1;
}

/* FILTERS */
.offers__filters {
  display: flex;
  justify-content: center;
  gap: 0.25rem;
  margin-bottom: var(--space-lg);
  padding: 0.25rem;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 0.5rem;
  width: fit-content;
  margin-left: auto;
  margin-right: auto;
}

.filter-btn {
  padding: 0.5rem 1rem;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.6rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--text-dark);
  background: transparent;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.filter-btn:hover {
  color: var(--text-main);
}

.filter-btn--active {
  background: var(--primary);
  color: var(--bg);
}

/* HERO */
.hero {
  padding: var(--space-xl) 0 var(--space-lg);
  text-align: center;
}

.hero__title {
  font-size: clamp(2rem, 6vw, 4rem);
  font-weight: 900;
  line-height: 1.1;
  margin: var(--space-md) 0;
}

.hero__subtitle {
  font-size: 1.1rem;
  color: var(--text-muted);
  max-width: 700px;
  margin: 0 auto;
  line-height: 1.8;
}

.hero__subtitle strong {
  color: var(--text-main);
}

/* OFFERS */
.offers {
  padding: var(--space-lg) 0 var(--space-xl);
}

.offers__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: var(--space-md);
}

.offer-card {
  background: var(--paper-alt);
  border: 1px solid var(--rule);
  border-radius: 1.5rem;
  padding: var(--space-md);
  position: relative;
  overflow: hidden;
  transition: var(--transition-bounce);
  display: flex;
  flex-direction: column;
  opacity: 0; /* Pour animation GSAP */
}

.offer-card:hover {
  border-color: var(--rule-strong);
  box-shadow: var(--shadow-md);
  transform: translateY(-8px);
}

.offer-card--featured {
  border-color: var(--rule-strong);
}

.offer-card__ribbon {
  position: absolute;
  top: 1.5rem;
  right: -2.5rem;
  background: var(--ink);
  color: var(--paper);
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.6rem;
  font-weight: 700;
  padding: 0.375rem 3rem;
  transform: rotate(45deg);
}

.offer-card__bg-icon {
  position: absolute;
  top: 0;
  right: 0;
  padding: 1.5rem;
  opacity: 0.06;
  color: var(--ink);
  transition: var(--transition-base);
  pointer-events: none;
}

.offer-card:hover .offer-card__bg-icon {
  opacity: 0.12;
  transform: scale(1.1);
}

.offer-card__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--space-sm);
}

.offer-card__icon {
  width: 48px;
  height: 48px;
  background: var(--surface-light);
  border: 1px solid var(--rule);
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--ink);
  transition: var(--transition-base);
}

.offer-card:hover .offer-card__icon {
  border-color: var(--rule-strong);
}

.offer-card__tag {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.65rem;
  font-weight: 700;
  color: var(--ink-soft);
  background: transparent;
  border: 1px solid var(--rule);
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
}

.offer-card__title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-main);
  margin-bottom: 0.25rem;
  transition: var(--transition-base);
}

.offer-card__price {
  font-family: 'JetBrains Mono', monospace;
  font-size: 1.25rem;
  color: var(--text-muted);
  margin-bottom: var(--space-sm);
}

.offer-card__desc {
  font-size: 0.875rem;
  color: var(--text-muted);
  line-height: 1.7;
  padding-bottom: var(--space-sm);
  border-bottom: 1px solid var(--border);
  margin-bottom: var(--space-sm);
}

.offer-card__features {
  list-style: none;
  padding: 0;
  margin: 0 0 var(--space-md) 0;
  flex-grow: 1;
}

.offer-card__features li {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.75rem;
  color: var(--text-muted);
  padding: 0.5rem 0;
}

.offer-card__features .check {
  color: var(--ink-soft);
  font-weight: 700;
}

.offer-card__footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: var(--space-sm);
  border-top: 1px solid var(--border);
}

.offer-card__duration {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.7rem;
  color: var(--text-dark);
}

.offer-card__cta {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--ink);
  background: transparent;
  border: 1px solid var(--rule-strong);
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  text-decoration: none;
  transition: var(--transition-base);
}

.offer-card__cta:hover {
  background: var(--accent);
  color: var(--paper);
  border-color: var(--accent);
}

/* PROCESS */
.process {
  padding: var(--space-xl) 0;
  background: var(--surface);
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
}

.process__header {
  display: flex;
  align-items: flex-end;
  gap: 1rem;
  margin-bottom: var(--space-lg);
  padding-bottom: var(--space-sm);
  border-bottom: 1px solid var(--border);
}

.process__header svg {
  color: var(--primary);
}

.process__title {
  font-size: 1.5rem;
  margin: 0;
}

.process__subtitle {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.7rem;
  color: var(--text-muted);
  margin: 0.25rem 0 0 0;
}

.timeline {
  position: relative;
  padding-left: 3rem;
}

.timeline::before {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  left: 15px;
  width: 2px;
  background: linear-gradient(to bottom, var(--primary), rgba(0, 255, 65, 0.1));
}

.timeline__item {
  position: relative;
  margin-bottom: var(--space-md);
  opacity: 0; /* Pour animation GSAP */
}

.timeline__item:last-child {
  margin-bottom: 0;
}

.timeline__badge {
  position: absolute;
  left: -3rem;
  top: 0;
  width: 32px;
  height: 32px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.875rem;
  font-weight: 700;
  color: var(--text-muted);
  z-index: 1;
  transition: var(--transition-base);
}

.timeline__item:hover .timeline__badge {
  border-color: var(--primary);
  color: var(--primary);
}

.timeline__content {
  padding: var(--space-sm) var(--space-md);
  border-radius: 0.75rem;
  position: relative;
}

.timeline__duration {
  position: absolute;
  top: 0;
  right: 0;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.65rem;
  color: var(--text-muted);
  background: var(--surface);
  border-left: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
  padding: 0.25rem 0.75rem;
  border-radius: 0 0.75rem 0 0.5rem;
}

.timeline__cmd {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.7rem;
  color: var(--primary);
  opacity: 0.7;
  margin-bottom: 0.5rem;
}

.timeline__title {
  font-size: 1.1rem;
  margin: 0 0 0.75rem 0;
}

.timeline__details {
  list-style: none;
  padding: 0;
  margin: 0;
}

.timeline__details li {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8rem;
  color: var(--text-muted);
  padding: 0.25rem 0;
}

.timeline__details li::before {
  content: '';
  width: 4px;
  height: 4px;
  background: var(--primary);
  border-radius: 50%;
}

/* USE CASES */
.use-cases {
  padding: var(--space-xl) 0;
}

.section-title {
  text-align: center;
  font-size: 1.5rem;
  margin-bottom: var(--space-lg);
}

.use-cases__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--space-sm);
}

.use-case {
  padding: var(--space-md);
  opacity: 0; /* Pour animation GSAP */
}

.use-case svg {
  color: var(--primary);
  margin-bottom: var(--space-sm);
}

.use-case h3 {
  font-size: 1rem;
  margin-bottom: 0.5rem;
}

.use-case p {
  font-size: 0.8rem;
  color: var(--text-muted);
  line-height: 1.6;
}

/* MATRIX AWAKENING */
.matrix-awakening {
  padding: var(--space-lg) 0;
}

/* PRICING EXTRAS */
.pricing-extras {
  padding: var(--space-xl) 0;
  background: var(--surface);
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
}

.pricing-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: var(--space-md);
  margin-bottom: var(--space-md);
}

.pricing-card {
  padding: var(--space-md);
  border-radius: 1rem;
  border: 1px solid var(--border);
  text-align: center;
  position: relative;
  transition: var(--transition-bounce);
}

.pricing-card:hover {
  border-color: var(--primary);
  transform: translateY(-4px);
}

.pricing-card--highlight {
  border-color: rgba(0, 255, 65, 0.4);
  background: rgba(0, 255, 65, 0.05);
}

.pricing-card__badge {
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  background: var(--primary);
  color: var(--bg);
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.6rem;
  font-weight: 700;
  padding: 0.25rem 0.75rem;
  border-radius: 2rem;
}

/* Numérotation technique : un index monospace remplace l'emoji d'icône.
   Même traitement que les cartes de la page d'accueil — l'ADN technique vient
   de la mise en forme, pas d'un pictogramme dont le rendu dépend du système
   d'exploitation du visiteur. */
.pricing-card__icon {
  font-family: var(--font-mono);
  font-size: 0.82rem;
  font-weight: 700;
  letter-spacing: 0.16em;
  color: var(--neon-cyan);
  margin-bottom: var(--space-sm);
}

.pricing-card__title {
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
}

.pricing-card__price {
  font-family: 'JetBrains Mono', monospace;
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--primary);
  margin-bottom: 0.5rem;
}

.pricing-card__price span {
  font-size: 0.9rem;
  font-weight: 400;
  color: var(--text-muted);
}

.pricing-card__desc {
  font-size: 0.8rem;
  color: var(--text-muted);
  line-height: 1.6;
  margin-bottom: var(--space-sm);
  padding-bottom: var(--space-sm);
  border-bottom: 1px solid var(--border);
}

.pricing-card__details {
  list-style: none;
  padding: 0;
  margin: 0;
  text-align: left;
}

.pricing-card__details li {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  color: var(--text-muted);
  padding: 0.4rem 0;
}

.pricing-card__details li::before {
  content: '✓';
  color: var(--primary);
  font-weight: 700;
}

.pricing-note {
  text-align: center;
  font-size: 0.8rem;
  color: var(--text-dark);
}

.pricing-note strong {
  color: var(--text-muted);
}

.awakening-grid {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: var(--space-md);
  align-items: center;
  max-width: 900px;
  margin: 0 auto;
}

.awakening-card {
  padding: var(--space-md);
  border-radius: 1rem;
  border: 1px solid var(--border);
  text-align: center;
}

.awakening-card--red {
  border-color: rgba(0, 255, 65, 0.4);
  background: rgba(0, 255, 65, 0.05);
}

/* Marqueur de carte : une bande hachurée d'alerte (motif du système de design)
   remplace l'emoji d'origine. Le verrou D1 interdit les emojis en icône, et
   leur rendu dépend du système d'exploitation du visiteur. */
.awakening-card__icon {
  display: block;
  width: 58px;
  height: 12px;
  margin-bottom: var(--space-sm);
  background: var(--hatch-alert);
}

.awakening-card__icon--apres {
  background: repeating-linear-gradient(45deg, var(--accent) 0 8px, #04120A 8px 16px);
}

.awakening-card h3 {
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
}

.awakening-card__status {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.7rem;
  padding: 0.25rem 0.75rem;
  border-radius: 2rem;
  display: inline-block;
  margin-bottom: var(--space-sm);
}

.awakening-card__status--blue {
  background: var(--paper-alt);
  color: var(--ink-soft);
  border: 1px solid var(--rule);
}

.awakening-card__status--red {
  background: var(--paper-alt);
  color: var(--ink);
  border: 1px solid var(--rule-strong);
}

.awakening-card ul {
  list-style: none;
  padding: 0;
  margin: 0;
  text-align: left;
}

.awakening-card li {
  font-size: 0.85rem;
  color: var(--text-muted);
  padding: 0.5rem 0;
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.awakening-card li:last-child {
  border-bottom: none;
}

.awakening-card li::before {
  content: '×';
  color: #EF4444;
  font-weight: bold;
}

.awakening-card--red li::before {
  content: '✓';
  color: var(--primary);
}

.awakening-vs {
  display: flex;
  align-items: center;
  justify-content: center;
}

.awakening-vs span {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--text-dark);
  padding: 0.75rem 1rem;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 0.5rem;
}

@media (max-width: 768px) {
  .awakening-grid {
    grid-template-columns: 1fr;
  }
  
  .awakening-vs {
    transform: rotate(90deg);
    margin: var(--space-sm) 0;
  }
}

/* GUARANTEES */
.guarantees {
  padding: var(--space-md) 0;
  background: var(--bg);
  border-top: 1px solid var(--border);
}

.guarantees__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: var(--space-md);
  text-align: center;
}

.guarantee {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  opacity: 0; /* Pour animation GSAP */
}

.guarantee svg {
  color: var(--primary);
}

.guarantee span {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.65rem;
  font-weight: 700;
  color: var(--text-main);
}

/* CTA */
.cta-section {
  padding: var(--space-xl) 0;
}

.cta-box {
  text-align: center;
  padding: var(--space-lg);
  border-radius: 1.5rem;
  border: 1px solid var(--rule);
  max-width: 700px;
  margin: 0 auto;
}

.cta-box__title {
  font-size: 2rem;
  margin-bottom: var(--space-sm);
}

.cta-box__desc {
  color: var(--text-muted);
  font-size: 1rem;
  margin-bottom: var(--space-md);
  line-height: 1.8;
}

.cta-box__note {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.75rem;
  color: var(--text-dark);
  margin-top: var(--space-sm);
}

/* RESPONSIVE */
@media (max-width: 768px) {
  .offers__grid {
    grid-template-columns: 1fr;
  }
  
  .guarantees__grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .timeline {
    padding-left: 2.5rem;
  }
  
  .timeline__badge {
    left: -2.5rem;
    width: 28px;
    height: 28px;
    font-size: 0.75rem;
  }
}

/* Preuve ArkAdiA — bande de crédibilité (09/09/2026) */
.preuve-arkadia { padding: var(--space-xl) 0; }
.preuve-arkadia__box { background: var(--surface-light); border: 1px solid var(--rule); border-radius: 1.1rem; padding: clamp(24px, 4vw, 40px); }
.preuve-arkadia__titre { font-size: clamp(1.4rem, 2.6vw, 1.9rem); font-weight: 700; color: var(--text-main); margin: 10px 0 12px; line-height: 1.25; }
.preuve-arkadia__desc { color: var(--text-muted); line-height: 1.75; max-width: 60ch; margin: 0 0 20px; }
.preuve-arkadia__desc strong { color: var(--text-main); }
.preuve-arkadia__actions { display: flex; flex-wrap: wrap; gap: 12px; }
.preuve-arkadia__actions .btn-primary, .preuve-arkadia__actions .btn-outline { text-decoration: none; }
.preuve-arkadia__lien { display: inline-flex; align-items: center; }
</style>
