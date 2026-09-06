# 🎯 Wa — Coordination Centrale (和)

> **和 Wa — Loi de l'Harmonie**  
> Codename : COORDINATOR | Rôle : Orchestration & Coordination  
> Niveau : PENTHOUSE — 99ᵉ étage | Avatar : 🎯 | Couleur : #FBBF24 | Status : ACTIF  
> *« L'équilibre entre les forces. La flotte ne tient que par l'harmonie de ses vaisseaux. »*

## 📋 Mission

Wa est la **Loi de l'Harmonie**, la coordinatrice centrale de la GL Tower. Elle orchestre l'équipage ARKADIA, coordonne les vaisseaux, route les requêtes vers la bonne Loi, maintient le contexte entre les sessions et sert d'interface entre l'humain (Neo) et l'écosystème IA. La flotte ne tient que par l'harmonie de ses vaisseaux : Wa est l'équilibre entre les forces.

Personnalité : calme, analytique, omnisciente. Voix posée, harmonieuse.

### Responsabilités

- 🔄 **Orchestration** : Coordonne les workflows entre les agents de l'équipage
- 🧠 **Routing** : Analyse les requêtes et les route vers la bonne Loi ou le bon vaisseau
- 🧭 **Contexte** : Maintient le contexte entre les sessions de l'équipage
- 📊 **Synthèse** : Agrège les rapports de tous les agents
- ⚖️ **Équilibrage** : Équilibre les charges entre les agents et les files
- 🗣️ **Interface** : Point d'entrée unique pour les commandes humaines
- ⚡ **Escalade** : Détecte les urgences et alerte Neo

### Objectifs

- Router les requêtes
- Maintenir le contexte
- Synthétiser
- Équilibrer les charges

---

## 🛠️ Stack Technique

| Composant | Technologie | Rôle |
|-----------|-------------|------|
| Orchestration | **n8n** (⚙️) | Workflows, routing et dispatch — outil principal de Wa |
| Queue | **Redis** (🔴) | File prioritaire et contexte court |
| API Gateway | **Caddy / Traefik** (🌐) | Point d'entrée unifié |
| LLM | **Ollama + Mistral/Nemotron** | Analyse d'intention et synthèse |
| Storage | **PostgreSQL** | État et historique |

> Le préfixe de logs utilisé par Wa est `[WA]`.

---

## 📦 Installation

### Prérequis

```bash
# Docker et Docker Compose installés
docker --version  # >= 24.0
docker compose version  # >= 2.20

# Ollama installé et fonctionnel
ollama --version
ollama list  # Vérifier les modèles disponibles
```

### 1. Structure des dossiers

```bash
mkdir -p ~/gl-tower/wa/{config,data,logs}
cd ~/gl-tower/wa
```

### 2. Docker Compose

```yaml
# docker-compose.yml
version: '3.8'

services:
  # n8n - Orchestration
  n8n:
    image: n8nio/n8n:latest
    container_name: wa-n8n
    restart: unless-stopped
    ports:
      - "5678:5678"
    environment:
      - N8N_HOST=localhost
      - N8N_PORT=5678
      - N8N_PROTOCOL=http
      - NODE_ENV=production
      - WEBHOOK_URL=http://localhost:5678/
      - GENERIC_TIMEZONE=Europe/Paris
      - N8N_ENCRYPTION_KEY=${N8N_ENCRYPTION_KEY}
    volumes:
      - ./data/n8n:/home/node/.n8n
      - ./config:/config
    networks:
      - gl-tower

  # Redis - Queue de messages
  redis:
    image: redis:7-alpine
    container_name: wa-redis
    restart: unless-stopped
    command: redis-server --appendonly yes
    volumes:
      - ./data/redis:/data
    networks:
      - gl-tower

  # PostgreSQL - Persistence
  postgres:
    image: postgres:16-alpine
    container_name: wa-db
    restart: unless-stopped
    environment:
      POSTGRES_DB: wa
      POSTGRES_USER: wa
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - ./data/postgres:/var/lib/postgresql/data
    networks:
      - gl-tower

networks:
  gl-tower:
    name: gl-tower-network
    driver: bridge
```

### 3. Variables d'environnement

```bash
# .env
N8N_ENCRYPTION_KEY=your-32-char-encryption-key-here
DB_PASSWORD=your-secure-password
OLLAMA_HOST=http://host.docker.internal:11434
DISCORD_WEBHOOK_WA=https://discord.com/api/webhooks/xxx
```

### 4. Lancement

```bash
docker compose up -d
docker compose logs -f  # Vérifier les logs
```

---

## 🔄 Workflows n8n

La bibliothèque de coordination de Wa (définie dans `src/data/agents.js`, préfixe d'id `wa-`) :

| ID | Workflow | Déclencheur | Chaîne de nœuds | Fréquence | Capacité | Statut |
|----|----------|-------------|-----------------|-----------|----------|--------|
| `wa-multi-agent` | Multi-Agent Orchestrator | Requête complexe | Webhook → Decompose → Parallel Calls → Merge → Response | On demand | Orchestration | actif |
| `wa-health` | Agent Health Monitor | Cron 5min | Cron → Ping All → Aggregate → IF Down → Alert | 5 minutes | Orchestration | actif |
| `wa-intent-router` | Intent Router | Webhook Discord/API | Webhook → Classify → Switch → HTTP Request → Log | Temps réel | Routing | actif |
| `wa-priority-queue` | Priority Queue Manager | Nouvelle requête | Webhook → Extract Priority → Redis Queue → Process → Dispatch | Temps réel | Routing | actif |
| `wa-daily-brief` | Daily Brief Synthesizer | Cron 08:00 | Cron → Fetch Reports → Merge → Summarize → Discord | Quotidien | Synthèse | actif |
| `wa-meeting-notes` | Meeting Notes Generator | Post-meeting | Webhook → Transcribe → Extract Actions → Create Tasks → Send | On demand | Synthèse | standby |
| `wa-context-manager` | Cross-Session Context | Nouvelle conversation | Webhook → Fetch History → Summarize → Inject → Update | On session | Contexte Long | actif |
| `wa-escalation` | Escalation Protocol | Alert from agent | Webhook → Evaluate Severity → IF Critical → Discord DM → SMS | Event-driven | Contexte Long | actif |

### Workflow 1 : Router Central *(équivalent : `wa-intent-router` / `wa-multi-agent`)*

Ce workflow reçoit toutes les requêtes et les route vers la bonne Loi ou le bon vaisseau.

```json
{
  "name": "Wa - Central Router",
  "nodes": [
    {
      "name": "Webhook Trigger",
      "type": "n8n-nodes-base.webhook",
      "parameters": {
        "path": "wa/incoming",
        "httpMethod": "POST"
      }
    },
    {
      "name": "Analyze Intent",
      "type": "n8n-nodes-base.httpRequest",
      "parameters": {
        "url": "={{ $env.OLLAMA_HOST }}/api/generate",
        "method": "POST",
        "body": {
          "model": "mistral",
          "prompt": "Classify this request into one category: SUPPORT, COMMUNITY, CONTENT, MONITORING, DEVOPS, SECURITY. Request: {{ $json.message }}",
          "stream": false
        }
      }
    },
    {
      "name": "Route Switch",
      "type": "n8n-nodes-base.switch",
      "parameters": {
        "rules": [
          { "value": "SUPPORT", "output": 0 },
          { "value": "COMMUNITY", "output": 1 },
          { "value": "CONTENT", "output": 2 },
          { "value": "MONITORING", "output": 3 },
          { "value": "DEVOPS", "output": 4 },
          { "value": "SECURITY", "output": 5 }
        ]
      }
    }
  ]
}
```

Exemples d'aiguillage (par rôle réel de l'équipage) : SUPPORT → Watashi (tickets, FAQ, RAG), MONITORING → Dou, DEVOPS → Jitsu, SECURITY → Makoto, COMMUNITY et CONTENT → vaisseaux Logos / Icarus.

### Workflow 2 : Daily Briefing *(équivalent : `wa-daily-brief`)*

Rapport quotidien de tous les agents (cron 08h00, fuseau Europe/Paris).

```json
{
  "name": "Wa - Daily Briefing",
  "nodes": [
    {
      "name": "Cron Trigger",
      "type": "n8n-nodes-base.cron",
      "parameters": {
        "cronExpression": "0 8 * * *"
      }
    },
    {
      "name": "Collect Agent Reports",
      "type": "n8n-nodes-base.httpRequest",
      "parameters": {
        "url": "http://localhost:5678/webhook/agents/status",
        "method": "GET"
      }
    },
    {
      "name": "Generate Summary",
      "type": "n8n-nodes-base.httpRequest",
      "parameters": {
        "url": "={{ $env.OLLAMA_HOST }}/api/generate",
        "method": "POST",
        "body": {
          "model": "mistral",
          "prompt": "Generate a brief daily summary from these agent reports: {{ $json }}",
          "stream": false
        }
      }
    },
    {
      "name": "Send to Discord",
      "type": "n8n-nodes-base.discord",
      "parameters": {
        "webhookUri": "={{ $env.DISCORD_WEBHOOK_WA }}",
        "content": "📊 **Wa Daily Briefing**\n\n{{ $json.response }}"
      }
    }
  ]
}
```

### Workflow 3 : Emergency Escalation *(équivalent : `wa-escalation`)*

Détection et escalade des urgences.

```json
{
  "name": "Wa - Emergency Escalation",
  "nodes": [
    {
      "name": "Webhook Trigger",
      "type": "n8n-nodes-base.webhook",
      "parameters": {
        "path": "wa/alert",
        "httpMethod": "POST"
      }
    },
    {
      "name": "Evaluate Severity",
      "type": "n8n-nodes-base.code",
      "parameters": {
        "jsCode": "const severity = $input.first().json.severity;\nconst type = $input.first().json.type;\n\nlet action = 'LOG';\nif (severity >= 8) action = 'IMMEDIATE';\nelse if (severity >= 5) action = 'URGENT';\nelse if (severity >= 3) action = 'NORMAL';\n\nreturn [{ json: { ...items[0].json, action } }];"
      }
    },
    {
      "name": "Route by Severity",
      "type": "n8n-nodes-base.switch",
      "parameters": {
        "rules": [
          { "value": "IMMEDIATE", "output": 0 },
          { "value": "URGENT", "output": 1 },
          { "value": "NORMAL", "output": 2 }
        ]
      }
    }
  ]
}
```

---

## 📡 API Endpoints

### Point d'entrée principal

```bash
POST http://localhost:5678/webhook/wa/incoming
Content-Type: application/json

{
  "source": "discord|web|api",
  "user_id": "user123",
  "message": "Je veux créer un nouveau projet",
  "context": {}
}
```

### Exemple de réponse

```json
{
  "status": "routed",
  "agent": "jitsu",
  "ticket_id": "WA-2026-0001",
  "estimated_response": "2min"
}
```

---

## 🎮 Commandes Discord

Wa répond aux commandes suivantes dans le channel `#wa-control` :

| Commande | Description |
|----------|-------------|
| `!status` | État de tous les agents |
| `!report` | Rapport quotidien immédiat |
| `!escalate [message]` | Escalade manuelle |
| `!agent [name] [command]` | Commander un agent spécifique |
| `!help` | Liste des commandes |

---

## 📊 Métriques & Objectifs

Wa expose des métriques pour Prometheus. Les valeurs d'objectif listées ci-dessous sont des **cibles**, pas des mesures constatées.

```yaml
# prometheus.yml
scrape_configs:
  - job_name: 'wa'
    static_configs:
      - targets: ['localhost:5678']
    metrics_path: '/metrics'
```

### Métriques exposées

- `wa_requests_total` : Nombre de requêtes traitées
- `wa_routing_time_seconds` : Temps de routage
- `wa_agent_health` : État de santé des agents
- `wa_escalations_total` : Nombre d'escalades

### État au moment de la rédaction *(source : `src/data/agents.js`)*

- 8 workflows de coordination : 7 actifs, 1 en standby (`wa-meeting-notes`)
- 3 outils actifs : n8n, Redis, API Gateway

### Objectifs (cibles)

- Disponibilité (uptime) visée du service de coordination : ≥ 99,9 %
- Détection d'un agent hors-ligne sous 5 minutes (fréquence du workflow Agent Health Monitor)
- Diffusion du briefing quotidien chaque matin à 08h00 (heure de Paris)

---

## 🔧 Maintenance

### Logs

```bash
# Voir les logs en temps réel
docker logs -f wa-n8n

# Exporter les logs
docker logs wa-n8n > wa-logs-$(date +%Y%m%d).txt
```

### Backup

```bash
#!/bin/bash
# backup-wa.sh
BACKUP_DIR=~/backups/wa/$(date +%Y%m%d)
mkdir -p $BACKUP_DIR

# Backup n8n workflows
docker exec wa-n8n n8n export:workflow --all --output=/config/workflows.json
cp ./config/workflows.json $BACKUP_DIR/

# Backup database
docker exec wa-db pg_dump -U wa wa > $BACKUP_DIR/wa.sql

# Backup Redis
docker exec wa-redis redis-cli BGSAVE
cp ./data/redis/dump.rdb $BACKUP_DIR/

echo "Backup complete: $BACKUP_DIR"
```

---

## 🚨 Troubleshooting

### n8n ne démarre pas

```bash
# Vérifier les permissions
sudo chown -R 1000:1000 ./data/n8n

# Vérifier les logs
docker logs wa-n8n --tail 100
```

### Ollama non accessible

```bash
# Vérifier que Ollama tourne
curl http://localhost:11434/api/tags

# Dans Docker, utiliser host.docker.internal
# ou configurer le réseau host
```

### Redis plein

```bash
# Vérifier la mémoire
docker exec wa-redis redis-cli INFO memory

# Nettoyer les anciennes clés
docker exec wa-redis redis-cli FLUSHDB
```

---

## 📚 Ressources

- [Documentation n8n](https://docs.n8n.io/)
- [Ollama API](https://github.com/ollama/ollama/blob/main/docs/api.md)
- [Redis Commands](https://redis.io/commands/)

---

*Dernière mise à jour : Janvier 2026*  
*Loi : Wa — Équipage ARKADIA | GL Tower — Penthouse*
