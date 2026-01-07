<template>
  <div class="legal-page">
    <div class="container">
      <div class="tag">
        <span>⟨/⟩</span> CGV
      </div>
      
      <h1 class="legal-page__title">Conditions Générales de Vente</h1>
      
      <div class="legal-content glass">
        <section class="legal-section">
          <h2>Article 1 - Objet</h2>
          <p>
            Les présentes Conditions Générales de Vente (CGV) régissent les relations contractuelles 
            entre GL Digital Lab et ses clients dans le cadre de prestations de développement web, 
            conseil et automatisation IA.
          </p>
        </section>
        
        <section class="legal-section">
          <h2>Article 2 - Services proposés</h2>
          <p>GL Digital Lab propose les protocoles suivants :</p>
          <ul>
            <li><strong>PERFORMANCE :</strong> Audit, refonte et optimisation web</li>
            <li><strong>DIGITAL FACTORY :</strong> Application métier sur-mesure</li>
            <li><strong>NEURAL OPS :</strong> Automatisation et intégration IA locale</li>
            <li><strong>CONSULTING :</strong> Accompagnement technique et stratégique</li>
          </ul>
        </section>
        
        <section class="legal-section">
          <h2>Article 3 - Devis et commande</h2>
          <p>
            Tout projet débute par un échange initial gratuit suivi d'un devis détaillé. 
            Le devis est valable 30 jours à compter de sa date d'émission.
          </p>
          <p>
            La commande est considérée comme ferme et définitive après signature du devis 
            et versement de l'acompte prévu.
          </p>
        </section>
        
        <section class="legal-section">
          <h2>Article 4 - Tarifs et paiement</h2>
          <p>
            Les tarifs sont indiqués en euros hors taxes (HT). La TVA n'est pas applicable 
            (article 293B du CGI - régime micro-entreprise).
          </p>
          <p><strong>Modalités de paiement :</strong></p>
          <ul>
            <li>Acompte de 30% à la commande</li>
            <li>40% à la validation du développement</li>
            <li>Solde de 30% à la livraison finale</li>
          </ul>
          <p>Paiement par virement bancaire sous 14 jours à réception de facture.</p>
        </section>
        
        <section class="legal-section">
          <h2>Article 5 - Délais de livraison</h2>
          <p>
            Les délais indicatifs sont précisés dans le devis. GL Digital Lab s'engage à 
            respecter les délais convenus, sauf circonstances exceptionnelles ou modifications 
            demandées par le client en cours de projet.
          </p>
          <p>
            Tout retard imputable au client (validation tardive, retard de fourniture de contenus) 
            reporte d'autant le délai de livraison.
          </p>
        </section>
        
        <section class="legal-section">
          <h2>Article 6 - Obligations du client</h2>
          <p>Le client s'engage à :</p>
          <ul>
            <li>Fournir les informations et contenus nécessaires dans les délais convenus</li>
            <li>Valider les étapes intermédiaires dans un délai raisonnable (5 jours ouvrés)</li>
            <li>Désigner un interlocuteur unique pour le suivi du projet</li>
            <li>Régler les factures selon les modalités prévues</li>
          </ul>
        </section>
        
        <section class="legal-section">
          <h2>Article 7 - Propriété intellectuelle</h2>
          <p>
            Le transfert des droits de propriété intellectuelle sur les livrables s'effectue 
            au paiement intégral de la prestation.
          </p>
          <p>
            GL Digital Lab se réserve le droit de mentionner la réalisation dans son portfolio 
            et ses références commerciales, sauf opposition écrite du client.
          </p>
        </section>
        
        <section class="legal-section">
          <h2>Article 8 - Garantie et maintenance</h2>
          <p>
            GL Digital Lab garantit la conformité des livrables au cahier des charges validé.
          </p>
          <p>
            Une période de garantie (1 à 6 mois selon l'offre) est incluse pour la correction 
            des bugs et dysfonctionnements. Les évolutions et nouvelles fonctionnalités font 
            l'objet d'un devis séparé.
          </p>
        </section>
        
        <section class="legal-section">
          <h2>Article 9 - Résiliation</h2>
          <p>
            En cas de résiliation anticipée par le client, les sommes versées restent acquises 
            et les travaux réalisés sont facturés au prorata.
          </p>
          <p>
            GL Digital Lab se réserve le droit de résilier le contrat en cas de non-paiement 
            ou de manquement grave du client à ses obligations.
          </p>
        </section>
        
        <section class="legal-section">
          <h2>Article 10 - Limitation de responsabilité</h2>
          <p>
            La responsabilité de GL Digital Lab est limitée au montant total de la prestation. 
            GL Digital Lab ne saurait être tenu responsable des dommages indirects, perte de 
            données, manque à gagner ou préjudice commercial.
          </p>
        </section>
        
        <section class="legal-section">
          <h2>Article 11 - Droit applicable</h2>
          <p>
            Les présentes CGV sont soumises au droit français. En cas de litige, les parties 
            s'efforceront de trouver une solution amiable. À défaut, les tribunaux de Limoges 
            seront seuls compétents.
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
const lastUpdate = 'Janvier 2026';
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

.legal-page__update {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.75rem;
  color: var(--text-dark);
  margin-top: var(--space-md);
  text-align: right;
}
</style>
