# 💰 P.E.P.P.E.R. - Finance & Administration

> **Professional Enterprise Payment & Planning Economic Resources**  
> *Back Office - Aile Administrative*

---

## 📋 Fiche Agent

| Propriété | Valeur |
|-----------|--------|
| **Nom complet** | P.E.P.P.E.R. |
| **Niveau** | Back Office (Aile Administrative) |
| **Rôle** | Finance & Administration |
| **Status** | 🟢 ONLINE |
| **Couleur** | `#10B981` (Vert Emeraude) |
| **Icône** | 💰 |

---

## 🎯 Mission

PEPPER est l'agent responsable de toute la gestion financière et administrative. Elle gère :
- Facturation et devis
- Suivi des paiements et relances
- Comptabilité et rapprochements
- Déclarations fiscales (TVA, URSSAF)
- Tableaux de bord financiers
- Gestion documentaire légale

---

## 🛠️ Stack Technique

```yaml
Facturation:
  - Dolibarr / Facture.net API
  - PDF Generation (wkhtmltopdf)
  - Templates Handlebars
  
Comptabilité:
  - PostgreSQL (grand livre)
  - n8n workflows
  - Export FEC
  
Paiements:
  - Stripe API
  - GoCardless (prélèvements)
  - Webhooks temps réel
  
Reporting:
  - Metabase / Grafana
  - Google Sheets API
  - Export Excel (xlsx)
  
Conformité:
  - Factur-X (e-invoicing)
  - RGPD compliance
  - Archivage légal 10 ans
```

---

## 📁 Structure de Travail

```
finance/
├── invoices/
│   ├── templates/        # Modèles de factures
│   ├── drafts/           # Brouillons
│   └── sent/             # Factures envoyées
├── quotes/
│   ├── templates/        # Modèles de devis
│   └── pending/          # Devis en attente
├── accounting/
│   ├── journal/          # Grand livre
│   ├── bank/             # Relevés bancaires
│   └── reports/          # Rapports mensuels
├── taxes/
│   ├── tva/              # Déclarations TVA
│   └── urssaf/           # Cotisations
└── legal/
    ├── contracts/        # Contrats clients
    └── cgv/              # CGV versions
```

---

## 🔄 Workflows n8n

### 1. Invoice Generator

Génère et envoie les factures automatiquement.

```json
{
  "name": "PEPPER - Invoice Generator",
  "trigger": "Webhook POST /pepper/create-invoice",
  "nodes": [
    {
      "type": "webhook",
      "path": "/pepper/create-invoice"
    },
    {
      "type": "postgres",
      "query": "SELECT * FROM clients WHERE id = {{$json.clientId}}"
    },
    {
      "type": "code",
      "action": "Calculate totals, TVA, generate invoice number"
    },
    {
      "type": "handlebars",
      "template": "invoice-template.hbs",
      "data": "{{$json}}"
    },
    {
      "type": "wkhtmltopdf",
      "action": "Generate PDF from HTML"
    },
    {
      "type": "postgres",
      "query": "INSERT INTO invoices (...) VALUES (...)"
    },
    {
      "type": "email",
      "to": "{{$json.client.email}}",
      "subject": "Facture GL Digital Lab #{{$json.invoiceNumber}}",
      "attachments": ["{{$json.pdfPath}}"]
    },
    {
      "type": "discord",
      "channel": "#finance",
      "message": "💰 PEPPER: Facture #{{$json.invoiceNumber}} envoyée à {{$json.client.name}} - {{$json.totalTTC}}€"
    }
  ]
}
```

### 2. Payment Tracker

Suit les paiements et envoie des relances.

```json
{
  "name": "PEPPER - Payment Tracker",
  "trigger": "Cron every day at 09:00",
  "nodes": [
    {
      "type": "cron",
      "expression": "0 9 * * *"
    },
    {
      "type": "postgres",
      "query": "SELECT * FROM invoices WHERE status = 'sent' AND due_date < NOW()"
    },
    {
      "type": "code",
      "action": "Categorize by days overdue (7, 15, 30)"
    },
    {
      "type": "loop",
      "items": "{{$json.overdueInvoices}}"
    },
    {
      "type": "if",
      "condition": "{{$json.daysOverdue >= 30}}"
    },
    {
      "type": "email",
      "template": "reminder-urgent.hbs"
    },
    {
      "type": "postgres",
      "query": "UPDATE invoices SET reminder_count = reminder_count + 1"
    },
    {
      "type": "discord",
      "channel": "#finance",
      "message": "💰 PEPPER: {{$json.overdueCount}} factures en retard - Total: {{$json.overdueAmount}}€"
    }
  ]
}
```

### 3. Stripe Webhook Handler

Traite les paiements Stripe en temps réel.

```json
{
  "name": "PEPPER - Stripe Handler",
  "trigger": "Webhook POST /pepper/stripe-webhook",
  "nodes": [
    {
      "type": "webhook",
      "path": "/pepper/stripe-webhook"
    },
    {
      "type": "code",
      "action": "Verify Stripe signature"
    },
    {
      "type": "switch",
      "conditions": [
        {"event": "payment_intent.succeeded"},
        {"event": "payment_intent.failed"},
        {"event": "invoice.paid"}
      ]
    },
    {
      "type": "postgres",
      "query": "UPDATE invoices SET status = 'paid', paid_at = NOW() WHERE stripe_id = {{$json.paymentIntent}}"
    },
    {
      "type": "code",
      "action": "Generate receipt"
    },
    {
      "type": "email",
      "to": "{{$json.customer.email}}",
      "template": "payment-confirmation.hbs"
    },
    {
      "type": "discord",
      "channel": "#finance",
      "message": "💰 PEPPER: ✅ Paiement reçu - {{$json.amount}}€ de {{$json.customer.name}}"
    }
  ]
}
```

### 4. Monthly Report Generator

Génère les rapports financiers mensuels.

```json
{
  "name": "PEPPER - Monthly Report",
  "trigger": "Cron 1st of month at 08:00",
  "nodes": [
    {
      "type": "cron",
      "expression": "0 8 1 * *"
    },
    {
      "type": "postgres",
      "query": "SELECT SUM(total_ttc) as revenue, COUNT(*) as invoice_count FROM invoices WHERE EXTRACT(MONTH FROM created_at) = EXTRACT(MONTH FROM NOW() - INTERVAL '1 month')"
    },
    {
      "type": "postgres",
      "query": "SELECT SUM(amount) as expenses FROM expenses WHERE EXTRACT(MONTH FROM date) = EXTRACT(MONTH FROM NOW() - INTERVAL '1 month')"
    },
    {
      "type": "code",
      "action": "Calculate profit, margins, KPIs"
    },
    {
      "type": "handlebars",
      "template": "monthly-report.hbs"
    },
    {
      "type": "wkhtmltopdf",
      "action": "Generate PDF report"
    },
    {
      "type": "email",
      "to": "neo@gldigitallab.fr",
      "subject": "📊 Rapport Financier - {{$json.month}} {{$json.year}}",
      "attachments": ["{{$json.reportPath}}"]
    },
    {
      "type": "discord",
      "channel": "#finance",
      "message": "💰 PEPPER: Rapport {{$json.month}} généré\n📈 CA: {{$json.revenue}}€\n📉 Charges: {{$json.expenses}}€\n💵 Résultat: {{$json.profit}}€"
    }
  ]
}
```

### 5. TVA Declaration Prep

Prépare les déclarations de TVA.

```json
{
  "name": "PEPPER - TVA Prep",
  "trigger": "Cron 15th of each quarter month",
  "nodes": [
    {
      "type": "cron",
      "expression": "0 8 15 1,4,7,10 *"
    },
    {
      "type": "postgres",
      "query": "SELECT SUM(tva_amount) as tva_collectee FROM invoices WHERE status = 'paid' AND quarter = {{$json.quarter}}"
    },
    {
      "type": "postgres",
      "query": "SELECT SUM(tva_amount) as tva_deductible FROM expenses WHERE quarter = {{$json.quarter}}"
    },
    {
      "type": "code",
      "action": "Calculate TVA due"
    },
    {
      "type": "handlebars",
      "template": "tva-declaration.hbs"
    },
    {
      "type": "discord",
      "channel": "#finance",
      "message": "💰 PEPPER: 📋 TVA T{{$json.quarter}} à déclarer\n   Collectée: {{$json.collectee}}€\n   Déductible: {{$json.deductible}}€\n   À payer: {{$json.due}}€\n   ⚠️ Date limite: {{$json.deadline}}"
    }
  ]
}
```

### 6. Quote Generator

Génère des devis professionnels.

```json
{
  "name": "PEPPER - Quote Generator",
  "trigger": "Webhook POST /pepper/create-quote",
  "nodes": [
    {
      "type": "webhook",
      "path": "/pepper/create-quote"
    },
    {
      "type": "ollama",
      "model": "mistral",
      "prompt": "Génère une description professionnelle pour ce projet: {{$json.projectDescription}}"
    },
    {
      "type": "code",
      "action": "Calculate pricing based on service type and complexity"
    },
    {
      "type": "handlebars",
      "template": "quote-template.hbs"
    },
    {
      "type": "wkhtmltopdf",
      "action": "Generate PDF"
    },
    {
      "type": "postgres",
      "query": "INSERT INTO quotes (...)"
    },
    {
      "type": "discord",
      "channel": "#finance",
      "message": "💰 PEPPER: Devis #{{$json.quoteNumber}} créé pour {{$json.client}} - {{$json.totalHT}}€ HT"
    }
  ]
}
```

---

## 📊 Métriques

| Métrique | Objectif | Actuel |
|----------|----------|--------|
| Délai moyen de paiement | < 30 jours | 24 jours |
| Taux de recouvrement | > 95% | 98% |
| Factures en retard | < 5% | 2% |
| Marge nette | > 40% | 45% |
| CA mensuel récurrent | > 5k€ | Lancement |
| Temps facturation | < 5 min | 3 min |

---

## 🔗 Interactions avec autres agents

```
PEPPER ←→ JARVIS   : Reçoit les demandes de facturation
PEPPER ←→ KAREN    : Infos clients pour facturation
PEPPER ←→ FRIDAY   : Questions facturation support
PEPPER ←→ VISION   : Données pour rapports publics
PEPPER ←→ ULTRON   : Dashboard financier temps réel
```

---

## 📋 Templates de Documents

### Facture (invoice-template.hbs)

```handlebars
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: 'Inter', sans-serif; margin: 40px; }
    .header { display: flex; justify-content: space-between; }
    .logo { font-size: 24px; font-weight: bold; color: #10B981; }
    .invoice-number { font-size: 14px; color: #666; }
    .client-info { margin: 40px 0; }
    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    th { background: #f5f5f5; padding: 12px; text-align: left; }
    td { padding: 12px; border-bottom: 1px solid #eee; }
    .totals { margin-top: 30px; text-align: right; }
    .total-ttc { font-size: 24px; color: #10B981; font-weight: bold; }
    .footer { margin-top: 50px; font-size: 12px; color: #666; }
  </style>
</head>
<body>
  <div class="header">
    <div class="logo">GL DIGITAL LAB</div>
    <div>
      <div class="invoice-number">Facture #{{invoiceNumber}}</div>
      <div>Date: {{formatDate createdAt "DD/MM/YYYY"}}</div>
      <div>Échéance: {{formatDate dueDate "DD/MM/YYYY"}}</div>
    </div>
  </div>

  <div class="client-info">
    <strong>{{client.company}}</strong><br>
    {{client.name}}<br>
    {{client.address}}<br>
    {{client.zipCode}} {{client.city}}
  </div>

  <table>
    <thead>
      <tr>
        <th>Description</th>
        <th>Quantité</th>
        <th>Prix unitaire HT</th>
        <th>Total HT</th>
      </tr>
    </thead>
    <tbody>
      {{#each items}}
      <tr>
        <td>{{description}}</td>
        <td>{{quantity}}</td>
        <td>{{formatCurrency unitPrice}}€</td>
        <td>{{formatCurrency totalHT}}€</td>
      </tr>
      {{/each}}
    </tbody>
  </table>

  <div class="totals">
    <div>Total HT: {{formatCurrency totalHT}}€</div>
    <div>TVA ({{tvaRate}}%): {{formatCurrency tvaAmount}}€</div>
    <div class="total-ttc">Total TTC: {{formatCurrency totalTTC}}€</div>
  </div>

  <div class="footer">
    <p>GL Digital Lab - Gaëtan LANGLET</p>
    <p>SIRET: XXX XXX XXX XXXXX | TVA: FRXXXXXXXXXX</p>
    <p>IBAN: FR76 XXXX XXXX XXXX XXXX XXXX XXX</p>
    <p>Pénalités de retard: 3x taux légal | Indemnité forfaitaire: 40€</p>
  </div>
</body>
</html>
```

### Devis (quote-template.hbs)

```handlebars
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    /* Similar styling */
    .validity { background: #FEF3C7; padding: 15px; border-radius: 8px; margin: 20px 0; }
    .signature-area { margin-top: 50px; display: flex; justify-content: space-between; }
    .signature-box { border: 1px dashed #ccc; padding: 40px; width: 200px; text-align: center; }
  </style>
</head>
<body>
  <div class="header">
    <div class="logo">GL DIGITAL LAB</div>
    <div>
      <div class="quote-number">Devis #{{quoteNumber}}</div>
      <div>Date: {{formatDate createdAt "DD/MM/YYYY"}}</div>
    </div>
  </div>

  <div class="validity">
    ⚠️ Ce devis est valable jusqu'au {{formatDate validUntil "DD/MM/YYYY"}}
  </div>

  <h2>{{projectTitle}}</h2>
  <p>{{projectDescription}}</p>

  <table>
    <!-- Items table -->
  </table>

  <div class="totals">
    <div>Total HT: {{formatCurrency totalHT}}€</div>
    <div>TVA (20%): {{formatCurrency tvaAmount}}€</div>
    <div class="total-ttc">Total TTC: {{formatCurrency totalTTC}}€</div>
  </div>

  <div class="signature-area">
    <div class="signature-box">
      <p>Le prestataire</p>
      <p>GL Digital Lab</p>
    </div>
    <div class="signature-box">
      <p>Le client</p>
      <p>Bon pour accord</p>
      <p>Date et signature</p>
    </div>
  </div>

  <div class="footer">
    <p>Conditions de paiement: 30% à la commande, 70% à la livraison</p>
  </div>
</body>
</html>
```

---

## 🗃️ Schéma Base de Données

```sql
-- Clients
CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company VARCHAR(255),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  address TEXT,
  zip_code VARCHAR(10),
  city VARCHAR(100),
  country VARCHAR(2) DEFAULT 'FR',
  vat_number VARCHAR(20),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Factures
CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_number VARCHAR(20) UNIQUE NOT NULL,
  client_id UUID REFERENCES clients(id),
  status VARCHAR(20) DEFAULT 'draft', -- draft, sent, paid, overdue, cancelled
  total_ht DECIMAL(10,2),
  tva_rate DECIMAL(4,2) DEFAULT 20.00,
  tva_amount DECIMAL(10,2),
  total_ttc DECIMAL(10,2),
  created_at TIMESTAMP DEFAULT NOW(),
  sent_at TIMESTAMP,
  due_date DATE,
  paid_at TIMESTAMP,
  stripe_payment_id VARCHAR(100),
  pdf_path VARCHAR(255),
  reminder_count INT DEFAULT 0
);

-- Lignes de facture
CREATE TABLE invoice_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID REFERENCES invoices(id),
  description TEXT NOT NULL,
  quantity DECIMAL(10,2) DEFAULT 1,
  unit_price DECIMAL(10,2) NOT NULL,
  total_ht DECIMAL(10,2)
);

-- Devis
CREATE TABLE quotes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_number VARCHAR(20) UNIQUE NOT NULL,
  client_id UUID REFERENCES clients(id),
  status VARCHAR(20) DEFAULT 'draft', -- draft, sent, accepted, rejected, expired
  project_title VARCHAR(255),
  project_description TEXT,
  total_ht DECIMAL(10,2),
  total_ttc DECIMAL(10,2),
  valid_until DATE,
  created_at TIMESTAMP DEFAULT NOW(),
  accepted_at TIMESTAMP
);

-- Dépenses
CREATE TABLE expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category VARCHAR(50), -- hosting, software, hardware, services
  description TEXT,
  amount_ht DECIMAL(10,2),
  tva_amount DECIMAL(10,2),
  amount_ttc DECIMAL(10,2),
  date DATE,
  supplier VARCHAR(255),
  receipt_path VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Journal comptable
CREATE TABLE accounting_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entry_date DATE NOT NULL,
  account_code VARCHAR(10) NOT NULL,
  label TEXT,
  debit DECIMAL(10,2) DEFAULT 0,
  credit DECIMAL(10,2) DEFAULT 0,
  document_ref VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 📈 Dashboard KPIs

```
┌─────────────────────────────────────────────────────────────┐
│                    💰 PEPPER DASHBOARD                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   CA Mois en cours          Factures en attente             │
│   ┌─────────────┐           ┌─────────────┐                 │
│   │   8 500€    │           │     3       │                 │
│   │   ▲ +15%    │           │   2 450€    │                 │
│   └─────────────┘           └─────────────┘                 │
│                                                             │
│   Marge Nette               Délai Paiement Moyen            │
│   ┌─────────────┐           ┌─────────────┐                 │
│   │    45%      │           │   24 jours  │                 │
│   │   ▲ +3%     │           │   ▼ -2j     │                 │
│   └─────────────┘           └─────────────┘                 │
│                                                             │
│   Prochaines échéances:                                     │
│   • TVA T1 2026 - 15/04 - ~1 200€                          │
│   • URSSAF - 05/02 - ~850€                                  │
│   • Facture #2026-008 - 10/02 - 3 500€                     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 🚀 Commandes

```bash
# Créer une facture
curl -X POST http://localhost:5678/webhook/pepper/create-invoice \
  -H "Content-Type: application/json" \
  -d '{"clientId": "xxx", "items": [...]}'

# Générer un devis
curl -X POST http://localhost:5678/webhook/pepper/create-quote \
  -H "Content-Type: application/json" \
  -d '{"clientId": "xxx", "projectTitle": "...", "items": [...]}'

# Rapport mensuel manuel
curl -X POST http://localhost:5678/webhook/pepper/monthly-report

# Export FEC (Fichier des Écritures Comptables)
curl -X GET http://localhost:5678/webhook/pepper/export-fec?year=2026
```

---

## 📚 Ressources

- [Factur-X Standard](https://fnfe-mpe.org/factur-x/)
- [API Stripe Documentation](https://stripe.com/docs/api)
- [Obligations comptables micro-entreprise](https://www.service-public.fr/)
- [TVA sur prestations de services](https://www.impots.gouv.fr/)

---

*PEPPER v1.0 | GL Tower Back Office*
