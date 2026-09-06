# 🏢 GL TOWER - Guide de Déploiement Stack Agentique

## 📋 Vue d'ensemble

Déploiement complet de l'équipage des 6 Lois ARKADIA sur infrastructure Docker.

```
┌─────────────────────────────────────────────────────────────┐
│                           GL TOWER                          │
├─────────────────────────────────────────────────────────────┤
│  PENTHOUSE    │ WA         │ n8n + Orchestration            │
│  NIVEAU 6     │ MAKOTO     │ Vault + Trivy + Tests          │
│  NIVEAU 5     │ BI         │ Frontend (Vite)                │
│  NIVEAU 4     │ JITSU      │ Symfony API + CI/CD + Registry │
│  NIVEAU 3     │ DOU        │ Prometheus + Grafana + Loki    │
│  NIVEAU 2     │ WATASHI    │ OpenWebUI + ChromaDB + Données │
├─────────────────────────────────────────────────────────────┤
│  LOBBY        │ —          │ Traefik : Reverse Proxy + SSL  │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔧 Prérequis

### Matériel minimum
- **CPU**: 4 cores (8 recommandé)
- **RAM**: 16 Go (32 Go pour Ollama avec gros modèles)
- **Stockage**: 100 Go SSD
- **GPU**: Optionnel mais recommandé pour Ollama (NVIDIA)

### Logiciels requis
```powershell
# Windows
winget install Docker.DockerDesktop
winget install Git.Git

# Ou Linux
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER
```

### Vérification
```powershell
docker --version      # >= 24.0
docker compose version # >= 2.20
git --version         # >= 2.40
```

---

## 🚀 Installation Rapide (5 minutes)

### 1. Cloner et configurer
```powershell
cd C:\Users\neosp\Desktop\portfolio-gaetan\infrastructure

# Copier la config
copy .env.example .env

# Éditer les mots de passe (IMPORTANT!)
notepad .env
```

### 2. Lancer la stack
```powershell
# Installation complète
.\deploy.ps1 -Action install

# Ou manuellement
docker compose up -d
```

### 3. Accéder aux services
| Service | URL | Loi ARKADIA |
|---------|-----|-------|
| n8n | http://localhost:5678 | WA |
| OpenWebUI | http://localhost:3000 | WATASHI |
| Grafana | http://localhost:3001 | DOU |
| Prometheus | http://localhost:9090 | DOU |
| ChromaDB | http://localhost:8000 | WATASHI |
| Vault | http://localhost:8200 | MAKOTO |
| PostgreSQL | localhost:5432 | WATASHI |
| Redis | localhost:6379 | WATASHI |
| Ollama API | http://localhost:11434 | partagé (équipage) |

---

## 📦 Installation Détaillée

### Étape 1: Infrastructure de base (WATASHI)

```powershell
# Démarrer PostgreSQL + Redis + ChromaDB
docker compose up -d postgres redis chromadb

# Vérifier
docker compose ps
docker compose logs postgres
```

### Étape 2: IA Locale (Ollama partagé — WATASHI)

```powershell
# Démarrer Ollama
docker compose up -d ollama

# Télécharger les modèles (peut prendre 10-30 min)
docker exec -it gl-ollama ollama pull mistral
docker exec -it gl-ollama ollama pull llama3.2
docker exec -it gl-ollama ollama pull nomic-embed-text

# Démarrer OpenWebUI
docker compose up -d openwebui
```

### Étape 3: Orchestration (WA)

```powershell
# Démarrer n8n + worker
docker compose up -d n8n n8n-worker

# Accéder à http://localhost:5678
# Login: admin / (mot de passe dans .env)
```

### Étape 4: Monitoring (DOU)

```powershell
# Démarrer Prometheus + Grafana + Loki
docker compose up -d prometheus grafana loki node-exporter

# Accéder à http://localhost:3001
# Login: admin / (mot de passe dans .env)
```

### Étape 5: Sécurité (MAKOTO)

```powershell
# Démarrer Vault
docker compose up -d vault

# Accéder à http://localhost:8200
# Token: (défini dans .env)
```

### Étape 6: Tout démarrer

```powershell
docker compose up -d
```

---

## 🔌 Configuration de l'équipage ARKADIA

### WA (n8n) - Workflows à importer

```powershell
# Les workflows sont dans ./workflows/
# Importer via l'interface n8n ou API

# Workflows disponibles:
# - wa-orchestrator.json     (Coordination)
# - watashi-support-rag.json      (Support FAQ)
# - community-discord-moderation.json (Modération)
# - content-generator.json (Contenu)
# - dou-alerting.json         (Alertes)
# - invoicing.json        (Facturation)
```

### WATASHI (RAG) - Indexer la documentation

```powershell
# Via OpenWebUI, uploader les docs dans "Documents"
# Ou via API ChromaDB:

curl -X POST http://localhost:8000/api/v1/collections \
  -H "Content-Type: application/json" \
  -d '{"name": "gl-tower-docs"}'
```

### Bot Discord communautaire (vaisseau Logos) - Configuration

```env
# Dans .env
DISCORD_BOT_TOKEN=your_token
DISCORD_GUILD_ID=your_guild_id
```

```powershell
# Le bot est orchestré via n8n
# Workflow: community-discord-moderation.json
```

### DOU (Grafana) - Dashboards

```powershell
# Les dashboards sont auto-provisionnés
# Emplacement: ./config/grafana/dashboards/

# Dashboards disponibles:
# - gl-tower-overview.json
# - agents-status.json
# - n8n-executions.json
# - system-metrics.json
```

---

## 🛠️ Commandes Utiles

### Gestion Stack

```powershell
# Status
docker compose ps

# Logs temps réel
docker compose logs -f

# Logs d'un service
docker compose logs -f n8n

# Redémarrer un service
docker compose restart n8n

# Arrêter tout
docker compose down

# Arrêter + supprimer volumes (ATTENTION!)
docker compose down -v
```

### Maintenance

```powershell
# Backup PostgreSQL
docker exec gl-postgres pg_dump -U gltower gltower > backup.sql

# Restore PostgreSQL
docker exec -i gl-postgres psql -U gltower gltower < backup.sql

# Backup volumes
docker run --rm -v gl-tower_postgres_data:/data -v $(pwd):/backup alpine tar czf /backup/postgres_backup.tar.gz /data

# Mise à jour images
docker compose pull
docker compose up -d
```

### Debug

```powershell
# Shell dans un container
docker exec -it gl-wa-n8n /bin/sh

# Vérifier réseau
docker network inspect gl-tower-network

# Ressources utilisées
docker stats
```

---

## 🌐 Déploiement Production

### Option 1: VPS (Recommandé pour démarrer)

```powershell
# Sur un VPS Ubuntu 22.04 (Scaleway, OVH, Hetzner)

# 1. Installer Docker
curl -fsSL https://get.docker.com | sh

# 2. Cloner le repo
git clone https://github.com/ton-repo/gl-tower.git
cd gl-tower/infrastructure

# 3. Configurer
cp .env.example .env
nano .env  # Modifier DOMAIN et mots de passe

# 4. Lancer avec SSL
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

### Option 2: Kubernetes (Scale)

```yaml
# Voir ./k8s/ pour les manifests Kubernetes
# Helm charts disponibles pour chaque agent
```

### DNS à configurer

```
n8n.gldigitallab.fr      → IP_VPS
chat.gldigitallab.fr     → IP_VPS
grafana.gldigitallab.fr  → IP_VPS
prometheus.gldigitallab.fr → IP_VPS
```

---

## 📊 Architecture Réseau

```
                    ┌─────────────┐
                    │   Traefik   │ :80/:443
                    │ (SSL/Proxy) │
                    └──────┬──────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
   ┌────┴────┐       ┌────┴────┐       ┌────┴────┐
   │   n8n   │       │ OpenWeb │       │ Grafana │
   │  :5678  │       │  :3000  │       │  :3001  │
   └────┬────┘       └────┬────┘       └────┬────┘
        │                  │                  │
        └────────┬─────────┴─────────┬───────┘
                 │                   │
           ┌─────┴─────┐       ┌─────┴─────┐
           │  Ollama   │       │Prometheus │
           │  :11434   │       │   :9090   │
           └───────────┘       └───────────┘
                 │
        ┌────────┴────────┐
        │                 │
   ┌────┴────┐      ┌────┴────┐
   │PostgreSQL│      │ChromaDB │
   │  :5432  │      │  :8000  │
   └─────────┘      └─────────┘
        │
   ┌────┴────┐
   │  Redis  │
   │  :6379  │
   └─────────┘
```

---

## 🔐 Sécurité

### Checklist Production

- [ ] Changer TOUS les mots de passe par défaut
- [ ] Activer SSL via Traefik
- [ ] Configurer firewall (UFW)
- [ ] Activer fail2ban
- [ ] Backup automatique quotidien
- [ ] Monitoring alertes (Grafana → Discord)

### Firewall (UFW)

```bash
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

---

## 📈 Monitoring & Alertes

### Métriques collectées (DOU)

- CPU, RAM, Disk de chaque container
- Temps de réponse APIs
- Nombre d'exécutions n8n
- Erreurs et logs
- Uptime services

### Alertes configurées

```yaml
# Alertmanager → Discord webhook
# Fichier: ./config/alertmanager.yml

route:
  receiver: discord
receivers:
  - name: discord
    discord_configs:
      - webhook_url: 'https://discord.com/api/webhooks/xxx'
```

---

## 🆘 Troubleshooting

### Container ne démarre pas

```powershell
# Voir les logs
docker compose logs nom_service

# Vérifier les ressources
docker stats

# Recréer le container
docker compose up -d --force-recreate nom_service
```

### Ollama lent sans GPU

```powershell
# Utiliser des modèles plus légers
docker exec -it gl-ollama ollama pull phi3:mini
docker exec -it gl-ollama ollama pull tinyllama
```

### n8n erreur de connexion DB

```powershell
# Vérifier que PostgreSQL est prêt
docker compose logs postgres

# Vérifier la connexion
docker exec -it gl-postgres psql -U gltower -d gltower -c "SELECT 1"
```

### Port déjà utilisé

```powershell
# Windows - trouver le process
netstat -ano | findstr :5678

# Tuer le process
taskkill /PID <pid> /F
```

---

## 📚 Ressources

- [Documentation n8n](https://docs.n8n.io/)
- [Ollama Models](https://ollama.ai/library)
- [Grafana Dashboards](https://grafana.com/grafana/dashboards/)
- [ChromaDB Guide](https://docs.trychroma.com/)

---

## 🎯 Prochaines étapes

1. ✅ Déployer la stack de base
2. ⬜ Importer les workflows n8n
3. ⬜ Configurer le bot Discord communautaire (vaisseau Logos)
4. ⬜ Indexer la documentation (WATASHI RAG)
5. ⬜ Créer les dashboards Grafana
6. ⬜ Configurer les alertes
7. ⬜ Backup automatique
8. ⬜ Déployer en production

---

*GL Digital Lab - Infrastructure Humaine Augmentée par l'équipage des 6 Lois ARKADIA*
