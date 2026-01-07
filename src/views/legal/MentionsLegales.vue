<template>
  <div class="legal-page">
    <div class="container">
      <div class="tag">
        <span>⟨/⟩</span> LEGAL
      </div>
      
      <h1 class="legal-page__title">Mentions légales</h1>
      
      <div class="legal-content glass">
        <section class="legal-section">
          <h2>1. Éditeur du site</h2>
          <p>
            <strong>GL Digital Lab</strong><br>
            Gaëtan LANGLET<br>
            87000 Limoges, Nouvelle-Aquitaine, France<br>
            Email : <a href="mailto:contact@gldigitallab.fr">contact@gldigitallab.fr</a><br>
            Téléphone : <a href="tel:+33678695881">06 78 69 58 81</a>
          </p>
          <p v-if="siret">
            SIRET : {{ siret }}<br>
            Statut : Entrepreneur individuel (EI) / Micro-entreprise<br>
            Code APE : 6201Z - Programmation informatique
          </p>
          <p v-else class="legal-pending">
            <em>Entreprise en cours d'immatriculation — SIRET disponible prochainement</em>
          </p>
        </section>
        
        <section class="legal-section">
          <h2>2. Directeur de publication</h2>
          <p>
            Le directeur de la publication est <strong>Gaëtan LANGLET</strong>, en sa qualité de fondateur de GL Digital Lab.<br>
            Contact : <a href="mailto:contact@gldigitallab.fr">contact@gldigitallab.fr</a>
          </p>
        </section>
        
        <section class="legal-section">
          <h2>3. Hébergement</h2>
          <p>
            Ce site est hébergé par :<br>
            <strong>{{ hebergeur.nom }}</strong><br>
            {{ hebergeur.adresse }}<br>
            <a :href="hebergeur.url" target="_blank" rel="noopener noreferrer">{{ hebergeur.url }}</a>
          </p>
        </section>
        
        <section class="legal-section">
          <h2>4. Propriété intellectuelle</h2>
          <p>
            L'ensemble du contenu de ce site (textes, images, vidéos, logos, icônes, code source, etc.) 
            est la propriété exclusive de GL Digital Lab, sauf mention contraire.
          </p>
          <p>
            Toute reproduction, représentation, modification, publication, adaptation de tout 
            ou partie des éléments du site, quel que soit le moyen ou le procédé utilisé, 
            est interdite sans autorisation écrite préalable de GL Digital Lab.
          </p>
          <p>
            Les marques et logos présents sur le site sont déposés par GL Digital Lab ou ses partenaires. 
            Toute reproduction totale ou partielle de ces marques et logos sans autorisation est prohibée.
          </p>
        </section>
        
        <section class="legal-section">
          <h2>5. Protection des données personnelles</h2>
          <p>
            Conformément au Règlement Général sur la Protection des Données (RGPD) et à la loi 
            Informatique et Libertés, vous disposez d'un droit d'accès, de rectification, de suppression 
            et de portabilité de vos données personnelles.
          </p>
          <p>
            Pour exercer ces droits, contactez-nous à : 
            <a href="mailto:contact@gldigitallab.fr">contact@gldigitallab.fr</a>
          </p>
          <p>
            Pour plus d'informations sur le traitement de vos données, consultez notre 
            <router-link to="/confidentialite">Politique de confidentialité</router-link>.
          </p>
        </section>
        
        <section class="legal-section">
          <h2>6. Responsabilité</h2>
          <p>
            GL Digital Lab s'efforce d'assurer l'exactitude et la mise à jour des informations 
            diffusées sur ce site. Toutefois, GL Digital Lab ne peut garantir l'exactitude, 
            la précision ou l'exhaustivité des informations mises à disposition.
          </p>
          <p>
            GL Digital Lab décline toute responsabilité pour toute imprécision, inexactitude ou 
            omission portant sur des informations disponibles sur ce site.
          </p>
        </section>
        
        <section class="legal-section">
          <h2>7. Liens hypertextes</h2>
          <p>
            Ce site peut contenir des liens vers d'autres sites web. GL Digital Lab n'exerce 
            aucun contrôle sur ces sites et décline toute responsabilité quant à leur contenu 
            ou aux pratiques de ces sites en matière de protection des données personnelles.
          </p>
        </section>
        
        <section class="legal-section">
          <h2>8. Cookies</h2>
          <p>
            Ce site utilise des cookies techniques strictement nécessaires à son fonctionnement. 
            Aucun cookie de tracking ou publicitaire n'est utilisé.
          </p>
          <p>
            Pour plus d'informations, consultez notre 
            <router-link to="/confidentialite">Politique de confidentialité</router-link>.
          </p>
        </section>
        
        <section class="legal-section">
          <h2>9. Crédits</h2>
          <p>
            <strong>Conception et développement :</strong> GL Digital Lab (Gaëtan LANGLET)<br>
            <strong>Technologies :</strong> Vue.js 3, Three.js, GSAP, Vite<br>
            <strong>Typographies :</strong> JetBrains Mono, Inter (Google Fonts)<br>
            <strong>Icônes :</strong> Lucide Icons (MIT License)
          </p>
        </section>
        
        <section class="legal-section">
          <h2>10. Droit applicable</h2>
          <p>
            Les présentes mentions légales sont soumises au droit français. 
            En cas de litige, les tribunaux de Limoges seront seuls compétents.
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
import { reactive } from 'vue';

// TODO: Remplacer par ton SIRET une fois l'immatriculation effectuée
const siret = null; // Ex: '123 456 789 00012'

// TODO: Remplacer par les infos de ton hébergeur réel
const hebergeur = reactive({
  nom: 'O2Switch',
  adresse: 'Clermont-Ferrand, France',
  url: 'https://www.o2switch.fr'
});

const lastUpdate = '4 janvier 2026';
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

.legal-section p {
  color: var(--text-muted);
  margin-bottom: var(--space-xs);
  line-height: 1.8;
}

.legal-section a {
  color: var(--primary);
}

.legal-section a:hover {
  text-decoration: underline;
}

.legal-pending {
  padding: var(--space-xs) var(--space-sm);
  background: var(--surface);
  border-left: 2px solid var(--primary);
  border-radius: 0 0.25rem 0.25rem 0;
  color: var(--text-dark);
}

.legal-page__update {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.75rem;
  color: var(--text-dark);
  margin-top: var(--space-md);
  text-align: right;
}
</style>
