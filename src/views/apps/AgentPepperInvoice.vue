<template>
  <div class="agent-app">
    <header class="app-header">
      <div class="container">
        <router-link to="/apps" class="back-link">← Retour aux Apps</router-link>
        <span class="agent-badge" style="--agent-color: #F97316">💰 PEPPER</span>
      </div>
    </header>
    <main class="app-main">
      <div class="container">
        <div class="app-intro">
          <h1><span class="app-icon">💰</span> Invoice Generator</h1>
          <p>Créez des devis et factures professionnels en quelques clics</p>
        </div>

        <!-- DOCUMENT TYPE -->
        <div class="type-section">
          <div class="type-toggle">
            <button :class="{ active: docType === 'quote' }" @click="docType = 'quote'">📋 Devis</button>
            <button :class="{ active: docType === 'invoice' }" @click="docType = 'invoice'">📄 Facture</button>
          </div>
        </div>

        <div class="form-layout">
          <!-- LEFT: Form -->
          <div class="form-panel">
            <!-- Company Info -->
            <div class="form-section">
              <h3>🏢 Émetteur</h3>
              <div class="form-grid">
                <input type="text" v-model="company.name" placeholder="Nom de l'entreprise">
                <input type="text" v-model="company.address" placeholder="Adresse">
                <input type="text" v-model="company.siret" placeholder="SIRET">
                <input type="email" v-model="company.email" placeholder="Email">
              </div>
            </div>

            <!-- Client Info -->
            <div class="form-section">
              <h3>👤 Client</h3>
              <div class="form-grid">
                <input type="text" v-model="client.name" placeholder="Nom du client">
                <input type="text" v-model="client.company" placeholder="Société (optionnel)">
                <input type="text" v-model="client.address" placeholder="Adresse">
                <input type="email" v-model="client.email" placeholder="Email">
              </div>
            </div>

            <!-- Document Info -->
            <div class="form-section">
              <h3>📝 Informations</h3>
              <div class="form-row">
                <div class="form-field">
                  <label>Numéro</label>
                  <input type="text" v-model="docNumber" :placeholder="docType === 'quote' ? 'DEV-2024-001' : 'FAC-2024-001'">
                </div>
                <div class="form-field">
                  <label>Date</label>
                  <input type="date" v-model="docDate">
                </div>
                <div class="form-field" v-if="docType === 'quote'">
                  <label>Validité</label>
                  <input type="date" v-model="validUntil">
                </div>
                <div class="form-field" v-if="docType === 'invoice'">
                  <label>Échéance</label>
                  <input type="date" v-model="dueDate">
                </div>
              </div>
            </div>

            <!-- Items -->
            <div class="form-section">
              <h3>📦 Prestations</h3>
              <div class="items-list">
                <div v-for="(item, i) in items" :key="i" class="item-row">
                  <input type="text" v-model="item.description" placeholder="Description" class="item-desc">
                  <input type="number" v-model.number="item.quantity" placeholder="Qté" class="item-qty" min="1">
                  <input type="number" v-model.number="item.price" placeholder="Prix HT" class="item-price" step="0.01">
                  <span class="item-total">{{ (item.quantity * item.price).toFixed(2) }} €</span>
                  <button @click="removeItem(i)" class="item-remove">✕</button>
                </div>
              </div>
              <button @click="addItem" class="add-item-btn">+ Ajouter une ligne</button>
            </div>

            <!-- Totals -->
            <div class="totals-section">
              <div class="total-row">
                <span>Total HT</span>
                <span>{{ totalHT.toFixed(2) }} €</span>
              </div>
              <div class="total-row">
                <span>TVA ({{ tvaRate }}%)</span>
                <input type="number" v-model.number="tvaRate" class="tva-input" min="0" max="30">
                <span>{{ totalTVA.toFixed(2) }} €</span>
              </div>
              <div class="total-row total-ttc">
                <span>Total TTC</span>
                <span>{{ totalTTC.toFixed(2) }} €</span>
              </div>
            </div>

            <!-- Notes -->
            <div class="form-section">
              <h3>💬 Notes</h3>
              <textarea v-model="notes" placeholder="Conditions de paiement, mentions légales..." class="notes-input"></textarea>
            </div>
          </div>

          <!-- RIGHT: Preview -->
          <div class="preview-panel">
            <div class="preview-header">
              <h3>👁️ Aperçu</h3>
              <div class="preview-actions">
                <button @click="exportPDF">📄 PDF</button>
                <button @click="sendEmail">📧 Envoyer</button>
              </div>
            </div>

            <div class="invoice-preview" ref="previewRef">
              <div class="invoice-doc">
                <!-- Header -->
                <div class="doc-header">
                  <div class="doc-company">
                    <div class="company-name">{{ company.name || 'Votre Entreprise' }}</div>
                    <div class="company-details">{{ company.address }}</div>
                    <div class="company-details">SIRET: {{ company.siret }}</div>
                  </div>
                  <div class="doc-type">
                    <div class="type-label">{{ docType === 'quote' ? 'DEVIS' : 'FACTURE' }}</div>
                    <div class="doc-number">{{ docNumber }}</div>
                  </div>
                </div>

                <!-- Client -->
                <div class="doc-client">
                  <div class="client-label">Facturer à :</div>
                  <div class="client-name">{{ client.name || 'Client' }}</div>
                  <div class="client-company">{{ client.company }}</div>
                  <div class="client-address">{{ client.address }}</div>
                </div>

                <!-- Dates -->
                <div class="doc-dates">
                  <div class="date-item">
                    <span class="date-label">Date :</span>
                    <span>{{ formatDate(docDate) }}</span>
                  </div>
                  <div class="date-item" v-if="docType === 'quote'">
                    <span class="date-label">Valide jusqu'au :</span>
                    <span>{{ formatDate(validUntil) }}</span>
                  </div>
                  <div class="date-item" v-if="docType === 'invoice'">
                    <span class="date-label">Échéance :</span>
                    <span>{{ formatDate(dueDate) }}</span>
                  </div>
                </div>

                <!-- Items Table -->
                <table class="doc-table">
                  <thead>
                    <tr>
                      <th>Description</th>
                      <th>Qté</th>
                      <th>Prix unitaire</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(item, i) in items" :key="i">
                      <td>{{ item.description || '-' }}</td>
                      <td>{{ item.quantity }}</td>
                      <td>{{ item.price.toFixed(2) }} €</td>
                      <td>{{ (item.quantity * item.price).toFixed(2) }} €</td>
                    </tr>
                  </tbody>
                </table>

                <!-- Totals -->
                <div class="doc-totals">
                  <div class="doc-total-row">
                    <span>Total HT</span>
                    <span>{{ totalHT.toFixed(2) }} €</span>
                  </div>
                  <div class="doc-total-row">
                    <span>TVA {{ tvaRate }}%</span>
                    <span>{{ totalTVA.toFixed(2) }} €</span>
                  </div>
                  <div class="doc-total-row total">
                    <span>Total TTC</span>
                    <span>{{ totalTTC.toFixed(2) }} €</span>
                  </div>
                </div>

                <!-- Notes -->
                <div class="doc-notes" v-if="notes">
                  <div class="notes-label">Notes :</div>
                  <div class="notes-content">{{ notes }}</div>
                </div>

                <!-- Footer -->
                <div class="doc-footer">
                  <p>{{ company.name }} - {{ company.email }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const previewRef = ref(null);
const docType = ref('invoice');
const docNumber = ref('FAC-2024-001');
const docDate = ref(new Date().toISOString().split('T')[0]);
const validUntil = ref('');
const dueDate = ref('');
const tvaRate = ref(20);
const notes = ref('Paiement à réception de facture. Pénalités de retard : 3 fois le taux légal.');

const company = ref({
  name: 'GL Digital Lab',
  address: 'Limoges, France',
  siret: '123 456 789 00012',
  email: 'contact@gl-digitallab.fr'
});

const client = ref({
  name: '',
  company: '',
  address: '',
  email: ''
});

const items = ref([
  { description: 'Développement site web', quantity: 1, price: 2500 },
  { description: 'Hébergement annuel', quantity: 1, price: 150 }
]);

const totalHT = computed(() => items.value.reduce((sum, item) => sum + item.quantity * item.price, 0));
const totalTVA = computed(() => totalHT.value * (tvaRate.value / 100));
const totalTTC = computed(() => totalHT.value + totalTVA.value);

function addItem() {
  items.value.push({ description: '', quantity: 1, price: 0 });
}

function removeItem(index) {
  if (items.value.length > 1) {
    items.value.splice(index, 1);
  }
}

function formatDate(dateStr) {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleDateString('fr-FR');
}

function exportPDF() {
  // In real app, use html2pdf or similar
  window.print();
}

function sendEmail() {
  const subject = encodeURIComponent(`${docType.value === 'quote' ? 'Devis' : 'Facture'} ${docNumber.value}`);
  const body = encodeURIComponent(`Bonjour,\n\nVeuillez trouver ci-joint votre ${docType.value === 'quote' ? 'devis' : 'facture'} n°${docNumber.value}.\n\nCordialement,\n${company.value.name}`);
  window.open(`mailto:${client.value.email}?subject=${subject}&body=${body}`);
}
</script>

<style scoped>
.agent-app { min-height: 100vh; background: var(--bg-primary); }
.app-header { padding: 1rem 0; border-bottom: 1px solid var(--border); }
.app-header .container { display: flex; justify-content: space-between; align-items: center; }
.back-link { color: var(--text-muted); text-decoration: none; }
.agent-badge { padding: 0.35rem 0.75rem; background: rgba(249,115,22,0.1); border: 1px solid var(--agent-color); border-radius: 2rem; font-size: 0.8rem; color: var(--agent-color); }
.app-main { padding: var(--space-lg) 0; }
.app-intro { text-align: center; margin-bottom: 2rem; }
.app-intro h1 { display: flex; justify-content: center; gap: 0.5rem; font-size: 1.75rem; }
.app-icon { font-size: 2rem; }

.type-section { margin-bottom: 1.5rem; }
.type-toggle { display: flex; gap: 0.5rem; justify-content: center; }
.type-toggle button { padding: 0.75rem 2rem; background: rgba(255,255,255,0.02); border: 1px solid var(--border); border-radius: 0.5rem; color: var(--text-muted); cursor: pointer; font-size: 0.9rem; }
.type-toggle button.active { background: rgba(249,115,22,0.1); border-color: #F97316; color: #F97316; }

.form-layout { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; }

.form-panel { display: flex; flex-direction: column; gap: 1.5rem; }
.form-section h3 { font-size: 0.95rem; margin-bottom: 0.75rem; }
.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; }
.form-grid input { padding: 0.6rem; background: rgba(0,0,0,0.3); border: 1px solid var(--border); border-radius: 0.35rem; color: var(--text-main); font-size: 0.85rem; }
.form-row { display: flex; gap: 1rem; }
.form-field { flex: 1; }
.form-field label { display: block; font-size: 0.75rem; color: var(--text-muted); margin-bottom: 0.25rem; }
.form-field input { width: 100%; padding: 0.5rem; background: rgba(0,0,0,0.3); border: 1px solid var(--border); border-radius: 0.35rem; color: var(--text-main); }

.items-list { display: flex; flex-direction: column; gap: 0.5rem; margin-bottom: 0.75rem; }
.item-row { display: flex; gap: 0.5rem; align-items: center; }
.item-desc { flex: 3; padding: 0.5rem; background: rgba(0,0,0,0.3); border: 1px solid var(--border); border-radius: 0.35rem; color: var(--text-main); }
.item-qty { width: 60px; padding: 0.5rem; background: rgba(0,0,0,0.3); border: 1px solid var(--border); border-radius: 0.35rem; color: var(--text-main); text-align: center; }
.item-price { width: 100px; padding: 0.5rem; background: rgba(0,0,0,0.3); border: 1px solid var(--border); border-radius: 0.35rem; color: var(--text-main); text-align: right; }
.item-total { min-width: 80px; text-align: right; font-weight: 600; color: var(--primary); }
.item-remove { padding: 0.25rem 0.5rem; background: transparent; border: none; color: var(--text-muted); cursor: pointer; }
.item-remove:hover { color: #EF4444; }
.add-item-btn { padding: 0.5rem; background: transparent; border: 1px dashed var(--border); border-radius: 0.35rem; color: var(--text-muted); cursor: pointer; }
.add-item-btn:hover { border-color: var(--primary); color: var(--primary); }

.totals-section { padding: 1rem; background: rgba(255,255,255,0.02); border: 1px solid var(--border); border-radius: 0.5rem; }
.total-row { display: flex; justify-content: space-between; align-items: center; padding: 0.5rem 0; font-size: 0.9rem; }
.total-row.total-ttc { border-top: 1px solid var(--border); padding-top: 0.75rem; margin-top: 0.5rem; font-size: 1.1rem; font-weight: 700; color: var(--primary); }
.tva-input { width: 50px; padding: 0.25rem; background: rgba(0,0,0,0.3); border: 1px solid var(--border); border-radius: 0.25rem; color: var(--text-main); text-align: center; margin: 0 0.5rem; }

.notes-input { width: 100%; min-height: 80px; padding: 0.75rem; background: rgba(0,0,0,0.3); border: 1px solid var(--border); border-radius: 0.35rem; color: var(--text-secondary); font-size: 0.85rem; }

.preview-panel { position: sticky; top: 1rem; }
.preview-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
.preview-header h3 { font-size: 0.95rem; margin: 0; }
.preview-actions { display: flex; gap: 0.5rem; }
.preview-actions button { padding: 0.5rem 1rem; background: rgba(255,255,255,0.05); border: 1px solid var(--border); border-radius: 0.35rem; color: var(--text-muted); cursor: pointer; font-size: 0.8rem; }
.preview-actions button:hover { border-color: var(--primary); color: var(--primary); }

.invoice-preview { background: white; border-radius: 0.5rem; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.3); }
.invoice-doc { padding: 2rem; color: #333; font-size: 0.8rem; min-height: 600px; }

.doc-header { display: flex; justify-content: space-between; margin-bottom: 2rem; padding-bottom: 1rem; border-bottom: 2px solid #F97316; }
.company-name { font-size: 1.2rem; font-weight: 700; color: #F97316; }
.company-details { font-size: 0.75rem; color: #666; }
.doc-type { text-align: right; }
.type-label { font-size: 1.5rem; font-weight: 700; color: #333; }
.doc-number { font-size: 0.85rem; color: #666; }

.doc-client { margin-bottom: 1.5rem; }
.client-label { font-size: 0.7rem; color: #999; margin-bottom: 0.25rem; }
.client-name { font-weight: 600; }
.client-company, .client-address { font-size: 0.75rem; color: #666; }

.doc-dates { display: flex; gap: 2rem; margin-bottom: 1.5rem; font-size: 0.75rem; }
.date-label { color: #999; margin-right: 0.5rem; }

.doc-table { width: 100%; border-collapse: collapse; margin-bottom: 1.5rem; }
.doc-table th { background: #f5f5f5; padding: 0.5rem; text-align: left; font-size: 0.7rem; color: #666; border-bottom: 1px solid #ddd; }
.doc-table td { padding: 0.5rem; border-bottom: 1px solid #eee; }
.doc-table td:last-child { text-align: right; font-weight: 600; }

.doc-totals { margin-left: auto; width: 200px; }
.doc-total-row { display: flex; justify-content: space-between; padding: 0.35rem 0; font-size: 0.8rem; }
.doc-total-row.total { border-top: 2px solid #F97316; padding-top: 0.5rem; margin-top: 0.25rem; font-weight: 700; font-size: 1rem; }

.doc-notes { margin-top: 2rem; padding-top: 1rem; border-top: 1px solid #eee; }
.notes-label { font-size: 0.7rem; color: #999; margin-bottom: 0.25rem; }
.notes-content { font-size: 0.75rem; color: #666; }

.doc-footer { margin-top: 2rem; padding-top: 1rem; border-top: 1px solid #eee; text-align: center; font-size: 0.7rem; color: #999; }

@media print {
  .app-header, .form-panel, .preview-header { display: none; }
  .invoice-preview { box-shadow: none; }
}

@media (max-width: 1024px) { .form-layout { grid-template-columns: 1fr; } }
</style>
