# 🎯 J.A.R.V.I.S. - Coordination Centrale

> **Just A Rather Very Intelligent System**  
> Niveau : PENTHOUSE | Status : ONLINE | Priorité : CRITIQUE

## 📋 Mission

JARVIS est le **cerveau central** de GL Tower. Il orchestre tous les autres agents, prend les décisions stratégiques et sert d'interface entre l'humain (Neo) et l'écosystème IA.

### Responsabilités

- 🔄 **Orchestration** : Coordonne les workflows entre agents
- 🧠 **Décisions** : Analyse les situations et route vers le bon agent
- 📊 **Synthèse** : Agrège les rapports de tous les agents
- 🗣️ **Interface** : Point d'entrée unique pour les commandes humaines
- ⚡ **Escalade** : Détecte les urgences et alerte Neo

---

## 🛠️ Stack Technique

| Composant | Technologie | Rôle |
|-----------|-------------|------|
| Orchestration | **n8n** | Workflows et routing |
| LLM | **Ollama + Mistral/Nemotron** | Analyse et décisions |
| API Gateway | **Caddy / Traefik** | Point d'entrée unifié |
| Queue | **Redis** | File de tâches |
| Storage | **PostgreSQL** | État et historique |

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
mkdir -p ~/gl-tower/jarvis/{config,data,logs}
cd ~/gl-tower/jarvis
```

### 2. Docker Compose

```yaml
# docker-compose.yml
version: '3.8'

services:
  # n8n - Orchestration
  n8n:
    image: n8nio/n8n:latest
    container_name: jarvis-n8n
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
    container_name: jarvis-redis
    restart: unless-stopped
    command: redis-server --appendonly yes
    volumes:
      - ./data/redis:/data
    networks:
      - gl-tower

  # PostgreSQL - Persistence
  postgres:
    image: postgres:16-alpine
    container_name: jarvis-db
    restart: unless-stopped
    environment:
      POSTGRES_DB: jarvis
      POSTGRES_USER: jarvis
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
DISCORD_WEBHOOK_JARVIS=https://discord.com/api/webhooks/xxx
```

### 4. Lancement

```bash
docker compose up -d
docker compose logs -f  # Vérifier les logs
```

---

## 🔄 Workflows n8n

### Workflow 1 : Router Central

Ce workflow reçoit toutes les requêtes et les route vers le bon agent.

```json
{
  "name": "JARVIS - Central Router",
  "nodes": [
    {
      "name": "Webhook Trigger",
      "type": "n8n-nodes-base.webhook",
      "parameters": {
        "path": "jarvis/incoming",
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

### Workflow 2 : Daily Briefing

Rapport quotidien de tous les agents.

```json
{
  "name": "JARVIS - Daily Briefing",
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
        "webhookUri": "={{ $env.DISCORD_WEBHOOK_JARVIS }}",
        "content": "📊 **JARVIS Daily Briefing**\n\n{{ $json.response }}"
      }
    }
  ]
}
```

### Workflow 3 : Emergency Escalation

Détection et escalade des urgences.

```json
{
  "name": "JARVIS - Emergency Escalation",
  "nodes": [
    {
      "name": "Webhook Trigger",
      "type": "n8n-nodes-base.webhook",
      "parameters": {
        "path": "jarvis/alert",
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
POST http://localhost:5678/webhook/jarvis/incoming
Content-Type: application/json

{
  "source": "discord|web|api",
  "user_id": "user123",
  "message": "Je veux créer un nouveau projet",
  "context": {}
}
```

### Réponse

```json
{
  "status": "routed",
  "agent": "VERONICA",
  "ticket_id": "JRV-2026-0001",
  "estimated_response": "2min"
}
```

---

## 🎮 Commandes Discord

JARVIS répond aux commandes suivantes dans le channel `#jarvis-control` :

| Commande | Description |
|----------|-------------|
| `!status` | État de tous les agents |
| `!report` | Rapport quotidien immédiat |
| `!escalate [message]` | Escalade manuelle |
| `!agent [name] [command]` | Commander un agent spécifique |
| `!help` | Liste des commandes |

---

## 📊 Métriques

JARVIS expose ses métriques pour Prometheus :

```yaml
# prometheus.yml
scrape_configs:
  - job_name: 'jarvis'
    static_configs:
      - targets: ['localhost:5678']
    metrics_path: '/metrics'
```

### Métriques clés

- `jarvis_requests_total` : Nombre de requêtes traitées
- `jarvis_routing_time_seconds` : Temps de routage
- `jarvis_agent_health` : État de santé des agents
- `jarvis_escalations_total` : Nombre d'escalades

---

## 🔧 Maintenance

### Logs

```bash
# Voir les logs en temps réel
docker logs -f jarvis-n8n

# Exporter les logs
docker logs jarvis-n8n > jarvis-logs-$(date +%Y%m%d).txt
```

### Backup

```bash
#!/bin/bash
# backup-jarvis.sh
BACKUP_DIR=~/backups/jarvis/$(date +%Y%m%d)
mkdir -p $BACKUP_DIR

# Backup n8n workflows
docker exec jarvis-n8n n8n export:workflow --all --output=/config/workflows.json
cp ./config/workflows.json $BACKUP_DIR/

# Backup database
docker exec jarvis-db pg_dump -U jarvis jarvis > $BACKUP_DIR/jarvis.sql

# Backup Redis
docker exec jarvis-redis redis-cli BGSAVE
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
docker logs jarvis-n8n --tail 100
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
docker exec jarvis-redis redis-cli INFO memory

# Nettoyer les anciennes clés
docker exec jarvis-redis redis-cli FLUSHDB
```

---

## 📚 Ressources

- [Documentation n8n](https://docs.n8n.io/)
- [Ollama API](https://github.com/ollama/ollama/blob/main/docs/api.md)
- [Redis Commands](https://redis.io/commands/)

---

*Dernière mise à jour : Janvier 2026*  
*Agent : JARVIS v2.0 | GL Tower*
