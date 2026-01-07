# Automatiser avec n8n + IA locale (Ollama)

> **Tutoriel complet** pour créer des workflows d'automatisation puissants avec n8n, Ollama et vos APIs métier. 100% souverain, zéro cloud.

---

## Table des matières

1. [Pré-requis](#1-pré-requis)
2. [Architecture](#2-architecture)
3. [Installation Docker](#3-installation-docker)
4. [Configuration n8n](#4-configuration-n8n)
5. [Intégrer Ollama](#5-intégrer-ollama)
6. [Workflows pratiques](#6-workflows-pratiques)
7. [Connecter vos APIs](#7-connecter-vos-apis)
8. [Monitoring et logs](#8-monitoring-et-logs)
9. [Bonnes pratiques](#9-bonnes-pratiques)

---

## 1. Pré-requis

### Matériel recommandé

| Composant | Minimum | Recommandé |
|-----------|---------|------------|
| RAM | 8 Go | 16 Go+ |
| CPU | 4 cores | 8 cores |
| GPU | - | NVIDIA 8Go+ VRAM |
| Stockage | 50 Go SSD | 100 Go NVMe |

### Logiciels

| Outil | Version |
|-------|---------|
| Docker | 24+ |
| Docker Compose | 2.20+ |
| NVIDIA Container Toolkit | (si GPU) |

### Vérifications

```bash
# Docker
docker --version
docker compose version

# GPU NVIDIA (optionnel)
nvidia-smi
```

---

## 2. Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         VOS SERVICES                            │
│    Discord │ Email │ API métier │ Base de données │ Webhooks   │
└──────────────────────────────┬──────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                           n8n                                   │
│                    (Orchestrateur)                              │
│     ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐        │
│     │ Trigger │→ │ Process │→ │   IA    │→ │ Action  │        │
│     └─────────┘  └─────────┘  └─────────┘  └─────────┘        │
└──────────────────────────────┬──────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                         OLLAMA                                  │
│                   (IA locale)                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │   Llama 3    │  │   Mistral    │  │   CodeLlama  │         │
│  │   (chat)     │  │   (analyse)  │  │   (code)     │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
└─────────────────────────────────────────────────────────────────┘
```

### Flux de données

1. **Trigger** : Webhook, cron, événement Discord, email entrant
2. **Process** : Transformation, validation, enrichissement
3. **IA** : Analyse, génération, classification via Ollama
4. **Action** : Envoi Discord, email, mise à jour BDD, API

---

## 3. Installation Docker

### 3.1 Structure du projet

```bash
mkdir -p n8n-ia/{data,workflows,ollama-models}
cd n8n-ia
```

```
n8n-ia/
├── docker-compose.yml
├── .env
├── data/                  # Données n8n persistantes
├── workflows/             # Exports des workflows
└── ollama-models/         # Modèles IA
```

### 3.2 Fichier : `docker-compose.yml`

```yaml
version: '3.8'

services:
  # ===================
  # n8n - Orchestration
  # ===================
  n8n:
    image: n8nio/n8n:latest
    container_name: n8n
    ports:
      - "5678:5678"
    environment:
      # Configuration de base
      - N8N_HOST=${N8N_HOST:-localhost}
      - N8N_PORT=5678
      - N8N_PROTOCOL=${N8N_PROTOCOL:-http}
      - NODE_ENV=production
      
      # Authentification
      - N8N_BASIC_AUTH_ACTIVE=true
      - N8N_BASIC_AUTH_USER=${N8N_USER:-admin}
      - N8N_BASIC_AUTH_PASSWORD=${N8N_PASSWORD:-changeme}
      
      # Timezone
      - GENERIC_TIMEZONE=${TIMEZONE:-Europe/Paris}
      - TZ=${TIMEZONE:-Europe/Paris}
      
      # Webhooks
      - WEBHOOK_URL=${WEBHOOK_URL:-http://localhost:5678}
      
      # Exécutions
      - EXECUTIONS_DATA_PRUNE=true
      - EXECUTIONS_DATA_MAX_AGE=168
      
      # Base de données (SQLite par défaut, PostgreSQL recommandé en prod)
      - DB_TYPE=sqlite
      - DB_SQLITE_DATABASE=/home/node/.n8n/database.sqlite
    volumes:
      - ./data:/home/node/.n8n
      - ./workflows:/workflows
    networks:
      - n8n-network
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "wget", "-q", "--spider", "http://localhost:5678/healthz"]
      interval: 30s
      timeout: 10s
      retries: 3

  # ===================
  # Ollama - IA locale
  # ===================
  ollama:
    image: ollama/ollama:latest
    container_name: ollama
    ports:
      - "11434:11434"
    volumes:
      - ./ollama-models:/root/.ollama
    environment:
      - OLLAMA_HOST=0.0.0.0
      - OLLAMA_KEEP_ALIVE=24h
    networks:
      - n8n-network
    restart: unless-stopped
    # Décommenter pour GPU NVIDIA
    # deploy:
    #   resources:
    #     reservations:
    #       devices:
    #         - driver: nvidia
    #           count: 1
    #           capabilities: [gpu]

  # ===================
  # Open WebUI (optionnel)
  # Interface web pour Ollama
  # ===================
  open-webui:
    image: ghcr.io/open-webui/open-webui:main
    container_name: open-webui
    ports:
      - "3000:8080"
    environment:
      - OLLAMA_BASE_URL=http://ollama:11434
      - WEBUI_AUTH=false
    volumes:
      - open-webui-data:/app/backend/data
    depends_on:
      - ollama
    networks:
      - n8n-network
    restart: unless-stopped

networks:
  n8n-network:
    driver: bridge

volumes:
  open-webui-data:
```

### 3.3 Fichier : `.env`

```bash
# n8n
N8N_HOST=localhost
N8N_PROTOCOL=http
N8N_USER=admin
N8N_PASSWORD=votre-mot-de-passe-securise
WEBHOOK_URL=http://localhost:5678

# Timezone
TIMEZONE=Europe/Paris

# Ollama (optionnel)
OLLAMA_MODELS=llama3.2,mistral,codellama
```

### 3.4 Démarrer la stack

```bash
# Démarrer tous les services
docker compose up -d

# Vérifier les logs
docker compose logs -f

# Vérifier que tout tourne
docker compose ps
```

### 3.5 Télécharger les modèles Ollama

```bash
# Llama 3.2 (chat général, 3B paramètres)
docker exec ollama ollama pull llama3.2

# Mistral (raisonnement, 7B)
docker exec ollama ollama pull mistral

# CodeLlama (génération de code)
docker exec ollama ollama pull codellama

# Lister les modèles installés
docker exec ollama ollama list
```

---

## 4. Configuration n8n

### 4.1 Accéder à l'interface

1. Ouvrir http://localhost:5678
2. Se connecter avec admin / votre-mot-de-passe

### 4.2 Créer vos credentials

Aller dans **Settings > Credentials** et ajouter :

#### HTTP Request (pour Ollama)

```
Name: Ollama API
Type: Header Auth
Header Name: (laisser vide)
```

> Note : Ollama n'a pas besoin d'authentification en local.

#### Discord Webhook (exemple)

```
Name: Discord Webhook
Type: Header Auth
Webhook URL: https://discord.com/api/webhooks/...
```

### 4.3 Variables d'environnement dans n8n

Aller dans **Settings > Variables** :

| Variable | Valeur |
|----------|--------|
| `OLLAMA_URL` | `http://ollama:11434` |
| `DEFAULT_MODEL` | `llama3.2` |

---

## 5. Intégrer Ollama

### 5.1 Tester Ollama via HTTP Request

Créer un workflow de test :

```
[Manual Trigger] → [HTTP Request] → [Set Output]
```

Configuration du nœud **HTTP Request** :

| Paramètre | Valeur |
|-----------|--------|
| Method | POST |
| URL | `http://ollama:11434/api/generate` |
| Body Type | JSON |
| Body | (voir ci-dessous) |

Body JSON :

```json
{
  "model": "llama3.2",
  "prompt": "Réponds en une phrase : Qu'est-ce que n8n ?",
  "stream": false
}
```

### 5.2 Créer un nœud Ollama réutilisable

Utiliser le nœud **Code** pour créer une fonction :

```javascript
// Nœud Code : Appel Ollama
const ollamaUrl = $env.OLLAMA_URL || 'http://ollama:11434';
const model = $input.first().json.model || 'llama3.2';
const prompt = $input.first().json.prompt;

const response = await this.helpers.httpRequest({
  method: 'POST',
  url: `${ollamaUrl}/api/generate`,
  body: {
    model: model,
    prompt: prompt,
    stream: false,
    options: {
      temperature: 0.7,
      num_predict: 500
    }
  },
  json: true
});

return [{
  json: {
    model: model,
    prompt: prompt,
    response: response.response,
    duration: response.total_duration
  }
}];
```

### 5.3 Chat avec contexte

Pour des conversations multi-tour :

```javascript
// Nœud Code : Chat Ollama avec historique
const ollamaUrl = $env.OLLAMA_URL || 'http://ollama:11434';
const model = $input.first().json.model || 'llama3.2';
const messages = $input.first().json.messages || [];

const response = await this.helpers.httpRequest({
  method: 'POST',
  url: `${ollamaUrl}/api/chat`,
  body: {
    model: model,
    messages: messages,
    stream: false
  },
  json: true
});

return [{
  json: {
    response: response.message.content,
    role: response.message.role,
    model: model
  }
}];
```

Format des messages :

```json
{
  "messages": [
    {"role": "system", "content": "Tu es un assistant technique expert en Symfony."},
    {"role": "user", "content": "Comment créer une entité ?"},
    {"role": "assistant", "content": "Pour créer une entité..."},
    {"role": "user", "content": "Et pour ajouter une relation ?"}
  ]
}
```

---

## 6. Workflows pratiques

### 6.1 Workflow : Résumé automatique d'emails

```
[Email Trigger] → [Extract Content] → [Ollama Summarize] → [Send Discord]
```

**Nœud Ollama Summarize (Code)** :

```javascript
const email = $input.first().json;

const prompt = `Résume cet email en 3 points clés maximum.
Format attendu :
- Point 1
- Point 2
- Point 3

Email :
De: ${email.from}
Sujet: ${email.subject}
Contenu: ${email.text}`;

const response = await this.helpers.httpRequest({
  method: 'POST',
  url: 'http://ollama:11434/api/generate',
  body: {
    model: 'mistral',
    prompt: prompt,
    stream: false
  },
  json: true
});

return [{
  json: {
    from: email.from,
    subject: email.subject,
    summary: response.response,
    original: email.text
  }
}];
```

### 6.2 Workflow : Classification de tickets support

```
[Webhook] → [Ollama Classify] → [Switch] → [Actions par catégorie]
```

**Nœud Ollama Classify** :

```javascript
const ticket = $input.first().json;

const prompt = `Classifie ce ticket de support dans UNE des catégories suivantes :
- TECHNIQUE (bug, erreur, problème technique)
- FACTURATION (paiement, facture, abonnement)
- COMMERCIAL (devis, information produit)
- URGENT (panne critique, données perdues)

Réponds UNIQUEMENT avec le nom de la catégorie, sans explication.

Ticket :
${ticket.message}`;

const response = await this.helpers.httpRequest({
  method: 'POST',
  url: 'http://ollama:11434/api/generate',
  body: {
    model: 'mistral',
    prompt: prompt,
    stream: false,
    options: { temperature: 0.1 }
  },
  json: true
});

const category = response.response.trim().toUpperCase();

return [{
  json: {
    ...ticket,
    category: category,
    confidence: 'high'
  }
}];
```

### 6.3 Workflow : Génération de réponses Discord

```
[Discord Trigger] → [Filter Command] → [Ollama Generate] → [Discord Reply]
```

**Nœud Filter Command (IF)** :

```
Condition: {{$json.content}}.startsWith('!ask')
```

**Nœud Ollama Generate** :

```javascript
const message = $input.first().json;
const question = message.content.replace('!ask ', '');

const systemPrompt = `Tu es l'assistant du serveur Discord ARKADIA.
Tu réponds de manière concise et amicale.
Contexte : serveur gaming ARK: Survival Ascended.`;

const response = await this.helpers.httpRequest({
  method: 'POST',
  url: 'http://ollama:11434/api/chat',
  body: {
    model: 'llama3.2',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: question }
    ],
    stream: false
  },
  json: true
});

return [{
  json: {
    channelId: message.channelId,
    reply: response.message.content,
    mention: `<@${message.author.id}>`
  }
}];
```

### 6.4 Workflow : Analyse de logs avec alertes

```
[Cron 5min] → [Read Logs] → [Ollama Analyze] → [IF Critical] → [Alert Discord + Email]
```

**Nœud Ollama Analyze** :

```javascript
const logs = $input.first().json.content;

const prompt = `Analyse ces logs serveur et identifie :
1. Niveau de criticité (OK, WARNING, CRITICAL)
2. Problèmes détectés (liste)
3. Actions recommandées

Réponds en JSON strict :
{
  "level": "OK|WARNING|CRITICAL",
  "issues": ["issue1", "issue2"],
  "actions": ["action1", "action2"],
  "summary": "résumé en une phrase"
}

Logs :
${logs.slice(-5000)}`; // Limiter à 5000 caractères

const response = await this.helpers.httpRequest({
  method: 'POST',
  url: 'http://ollama:11434/api/generate',
  body: {
    model: 'mistral',
    prompt: prompt,
    stream: false,
    format: 'json'
  },
  json: true
});

let analysis;
try {
  analysis = JSON.parse(response.response);
} catch {
  analysis = { level: 'WARNING', issues: ['Parse error'], actions: ['Check manually'], summary: response.response };
}

return [{ json: analysis }];
```

---

## 7. Connecter vos APIs

### 7.1 API Symfony

Créer un endpoint dans votre Symfony :

```php
// src/Controller/Api/WebhookController.php
#[Route('/api/webhook/n8n', name: 'api_webhook_n8n', methods: ['POST'])]
public function n8nWebhook(Request $request): JsonResponse
{
    $data = json_decode($request->getContent(), true);
    
    // Traiter les données de n8n
    // ...
    
    return $this->json(['status' => 'ok', 'received' => $data]);
}
```

Dans n8n, utiliser **HTTP Request** :

| Paramètre | Valeur |
|-----------|--------|
| URL | `http://host.docker.internal:8000/api/webhook/n8n` |
| Method | POST |
| Authentication | Bearer Token (si nécessaire) |

### 7.2 Webhook entrant dans n8n

Créer un workflow avec **Webhook Trigger** :

1. Ajouter un nœud **Webhook**
2. Copier l'URL générée (ex: `http://localhost:5678/webhook/abc123`)
3. Configurer votre service pour envoyer à cette URL

### 7.3 Base de données PostgreSQL

```yaml
# Ajouter dans docker-compose.yml
postgres:
  image: postgres:16-alpine
  environment:
    POSTGRES_DB: n8n_data
    POSTGRES_USER: n8n
    POSTGRES_PASSWORD: secret
  volumes:
    - postgres-data:/var/lib/postgresql/data
  networks:
    - n8n-network
```

Dans n8n, créer une credential **PostgreSQL** :

| Paramètre | Valeur |
|-----------|--------|
| Host | postgres |
| Database | n8n_data |
| User | n8n |
| Password | secret |

---

## 8. Monitoring et logs

### 8.1 Logs n8n

```bash
# Logs en temps réel
docker compose logs -f n8n

# Logs des exécutions
docker compose exec n8n cat /home/node/.n8n/logs/n8n.log
```

### 8.2 Logs Ollama

```bash
# Logs du service
docker compose logs -f ollama

# Statistiques des modèles
docker exec ollama ollama ps
```

### 8.3 Métriques système

Ajouter Prometheus + Grafana (optionnel) :

```yaml
# docker-compose.monitoring.yml
prometheus:
  image: prom/prometheus
  ports:
    - "9090:9090"
  volumes:
    - ./prometheus.yml:/etc/prometheus/prometheus.yml

grafana:
  image: grafana/grafana
  ports:
    - "3001:3000"
  environment:
    - GF_SECURITY_ADMIN_PASSWORD=admin
```

---

## 9. Bonnes pratiques

### 9.1 Sécurité

```bash
# Toujours changer les mots de passe par défaut
N8N_PASSWORD=un-mot-de-passe-tres-securise-42!

# En production, utiliser HTTPS
N8N_PROTOCOL=https
N8N_HOST=n8n.votredomaine.com

# Limiter les IPs autorisées (reverse proxy)
```

### 9.2 Performance Ollama

```javascript
// Optimiser les options selon le use case
const options = {
  // Pour des réponses créatives
  temperature: 0.8,
  top_p: 0.9,
  
  // Pour des réponses précises (classification)
  temperature: 0.1,
  top_p: 0.5,
  
  // Limiter la longueur
  num_predict: 200,
  
  // Timeout
  num_ctx: 4096
};
```

### 9.3 Gestion des erreurs

```javascript
// Pattern try-catch dans les nœuds Code
try {
  const response = await this.helpers.httpRequest({...});
  
  if (!response.response) {
    throw new Error('Empty response from Ollama');
  }
  
  return [{ json: { success: true, data: response } }];
  
} catch (error) {
  // Log l'erreur
  console.error('Ollama error:', error.message);
  
  // Retourner une réponse par défaut
  return [{ 
    json: { 
      success: false, 
      error: error.message,
      fallback: 'Désolé, je n\'ai pas pu traiter cette demande.'
    } 
  }];
}
```

### 9.4 Backup des workflows

```bash
# Exporter tous les workflows
docker compose exec n8n n8n export:workflow --all --output=/workflows/backup.json

# Importer
docker compose exec n8n n8n import:workflow --input=/workflows/backup.json
```

---

## Récapitulatif

```bash
# Installation
mkdir n8n-ia && cd n8n-ia
# Créer docker-compose.yml et .env
docker compose up -d

# Télécharger les modèles
docker exec ollama ollama pull llama3.2
docker exec ollama ollama pull mistral

# Accéder aux interfaces
# n8n: http://localhost:5678
# Open WebUI: http://localhost:3000
# Ollama API: http://localhost:11434

# Maintenance
docker compose logs -f
docker compose restart
docker compose down
```

---

## Ressources

- [Documentation n8n](https://docs.n8n.io/)
- [Documentation Ollama](https://ollama.ai/)
- [Ollama API Reference](https://github.com/ollama/ollama/blob/main/docs/api.md)
- [n8n Community Workflows](https://n8n.io/workflows/)

---

**Auteur** : GL Digital Lab  
**Licence** : MIT  
**Dernière mise à jour** : Janvier 2026
