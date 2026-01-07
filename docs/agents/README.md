# 🏢 GL TOWER - Documentation des Agents IA

> **Centre de Commandement GL Digital Lab**  
> Infrastructure humaine augmentée par des agents IA souverains

---

## 🗺️ Architecture de la Tour

```
┌─────────────────────────────────────────────────────────────────┐
│  ⬡ PENTHOUSE                                                    │
│     🎯 J.A.R.V.I.S. - Coordination Centrale                     │
│     Orchestration • Décisions • Interface humain-IA             │
├─────────────────────────────────────────────────────────────────┤
│  NIVEAU 6                                                       │
│     🛡️ E.D.I.T.H. - Sécurité & Audit                           │
│     Scanning • Détection intrusions • Compliance                │
├─────────────────────────────────────────────────────────────────┤
│  NIVEAU 5                                                       │
│     🚀 V.E.R.O.N.I.C.A. - DevOps & Déploiement                 │
│     CI/CD • Infrastructure as Code • Rollback                   │
├─────────────────────────────────────────────────────────────────┤
│  NIVEAU 4                                                       │
│     📊 U.L.T.R.O.N. - Monitoring & Alertes                     │
│     Métriques • Logs • Dashboards                               │
├─────────────────────────────────────────────────────────────────┤
│  NIVEAU 3                                                       │
│     📢 V.I.S.I.O.N. - Content & Communication                  │
│     Posts Discord • Newsletters • Documentation                 │
├─────────────────────────────────────────────────────────────────┤
│  NIVEAU 2                                                       │
│     👥 K.A.R.E.N. - Community Management                       │
│     Modération • Onboarding • Tickets                           │
├─────────────────────────────────────────────────────────────────┤
│  NIVEAU 1                                                       │
│     🎧 F.R.I.D.A.Y. - Support Client                           │
│     FAQ • RAG • Triage                                          │
├─────────────────────────────────────────────────────────────────┤
│  NIVEAU 0 - LOBBY                                               │
│     🚪 Accueil Visiteurs                                        │
│     Services • Contact • Portfolio                              │
└─────────────────────────────────────────────────────────────────┘
            GL TOWER • Limoges, France • 2026
```

---

## 📚 Index des Agents

| Agent | Niveau | Rôle | Stack Principal | Doc |
|-------|--------|------|-----------------|-----|
| **J.A.R.V.I.S.** | ⬡ Penthouse | Coordination Centrale | n8n, Ollama, Redis | [→ 01-JARVIS.md](./01-JARVIS.md) |
| **F.R.I.D.A.Y.** | 1 | Support Client | OpenWebUI, ChromaDB, RAG | [→ 02-FRIDAY.md](./02-FRIDAY.md) |
| **K.A.R.E.N.** | 2 | Community Management | Discord.js, BullMQ, PostgreSQL | [→ 03-KAREN.md](./03-KAREN.md) |
| **V.I.S.I.O.N.** | 3 | Content & Communication | Ollama, Handlebars, n8n | [→ 04-VISION.md](./04-VISION.md) |
| **U.L.T.R.O.N.** | 4 | Monitoring & Alertes | Prometheus, Grafana, Loki | [→ 05-ULTRON.md](./05-ULTRON.md) |
| **V.E.R.O.N.I.C.A.** | 5 | DevOps & Déploiement | GitHub Actions, Ansible, Docker | [→ 06-VERONICA.md](./06-VERONICA.md) |
| **E.D.I.T.H.** | 6 | Sécurité & Audit | Trivy, Nuclei, Wazuh, Vault | [→ 07-EDITH.md](./07-EDITH.md) |

---

## 🔄 Flux de communication

```
                    ┌──────────────┐
                    │   JARVIS     │ ← Coordination
                    │  (Penthouse) │
                    └──────┬───────┘
                           │
         ┌─────────────────┼─────────────────┐
         │                 │                 │
         ▼                 ▼                 ▼
   ┌──────────┐      ┌──────────┐      ┌──────────┐
   │  EDITH   │      │ VERONICA │      │  ULTRON  │
   │ Sécurité │      │  DevOps  │      │ Monitor  │
   └──────────┘      └──────────┘      └──────────┘
         │                 │                 │
         └─────────────────┼─────────────────┘
                           │
         ┌─────────────────┼─────────────────┐
         │                 │                 │
         ▼                 ▼                 ▼
   ┌──────────┐      ┌──────────┐      ┌──────────┐
   │  VISION  │      │  KAREN   │      │  FRIDAY  │
   │ Content  │      │Community │      │ Support  │
   └──────────┘      └──────────┘      └──────────┘
                           │
                           ▼
                    ┌──────────────┐
                    │   CLIENTS    │
                    └──────────────┘
```

---

## 🚀 Quick Start

### 1. Prérequis

```bash
# Docker & Docker Compose
docker --version  # >= 24.0
docker compose version  # >= 2.20

# Ollama (pour les agents IA)
ollama --version
ollama pull mistral
ollama pull nomic-embed-text

# Node.js (pour les bots Discord)
node --version  # >= 20.0
```

### 2. Créer le réseau GL Tower

```bash
docker network create gl-tower-network
```

### 3. Ordre de déploiement recommandé

1. **Infrastructure de base**
   ```bash
   cd ~/gl-tower/ultron && docker compose up -d  # Monitoring d'abord
   ```

2. **Coordination**
   ```bash
   cd ~/gl-tower/jarvis && docker compose up -d
   ```

3. **Sécurité**
   ```bash
   cd ~/gl-tower/edith && docker compose up -d
   ```

4. **Agents métier**
   ```bash
   cd ~/gl-tower/friday && docker compose up -d
   cd ~/gl-tower/karen && docker compose up -d
   cd ~/gl-tower/vision && docker compose up -d
   ```

5. **DevOps** (GitHub Actions - pas de container local)

### 4. Vérification

```bash
# Status de tous les containers
docker ps --filter "network=gl-tower-network"

# Health check global
curl http://localhost:5678/webhook/jarvis/status
```

---

## 📊 Dashboard de Monitoring

Après déploiement, accéder aux interfaces :

| Service | URL | Credentials |
|---------|-----|-------------|
| Grafana (ULTRON) | http://localhost:3000 | admin / [.env] |
| n8n (JARVIS) | http://localhost:5678 | setup initial |
| Prometheus | http://localhost:9090 | - |
| OpenWebUI (FRIDAY) | http://localhost:3000 | setup initial |
| Wazuh (EDITH) | http://localhost:5601 | admin / [.env] |
| Vault (EDITH) | http://localhost:8200 | [token] |

---

## 🔐 Gestion des Secrets

Tous les secrets sont gérés par **EDITH** via HashiCorp Vault :

```bash
# Initialiser les secrets GL Tower
cd ~/gl-tower/edith
./scripts/manage-secrets.sh init

# Récupérer un secret
./scripts/manage-secrets.sh get gl-tower/database password

# Rotation des secrets
./scripts/manage-secrets.sh rotate gl-tower/api discord_token
```

---

## 📈 Métriques Clés

| Agent | KPI Principal | Objectif |
|-------|---------------|----------|
| JARVIS | Routing accuracy | > 95% |
| FRIDAY | Response time | < 30s |
| KAREN | Ticket resolution | < 24h |
| VISION | Content engagement | > 5% |
| ULTRON | Uptime | > 99.9% |
| VERONICA | Deploy success rate | > 95% |
| EDITH | MTTD (Mean Time To Detect) | < 5min |

---

## 🛠️ Maintenance

### Backup quotidien

```bash
#!/bin/bash
# backup-gl-tower.sh
DATE=$(date +%Y%m%d)
BACKUP_DIR=~/backups/gl-tower/$DATE

mkdir -p $BACKUP_DIR

# Backup chaque agent
for agent in jarvis friday karen vision ultron edith; do
  cd ~/gl-tower/$agent
  docker compose exec -T postgres pg_dump -U app app > $BACKUP_DIR/${agent}-db.sql 2>/dev/null || true
  cp -r ./config $BACKUP_DIR/${agent}-config/ 2>/dev/null || true
done

# Compression
tar czf ~/backups/gl-tower-$DATE.tar.gz $BACKUP_DIR
rm -rf $BACKUP_DIR

echo "✅ Backup complete: gl-tower-$DATE.tar.gz"
```

### Mise à jour des agents

```bash
#!/bin/bash
# update-gl-tower.sh

echo "🔄 Updating GL Tower agents..."

for agent in jarvis friday karen vision ultron edith; do
  echo "Updating $agent..."
  cd ~/gl-tower/$agent
  docker compose pull
  docker compose up -d --force-recreate
done

echo "✅ All agents updated"
```

---

## 📚 Ressources

- [Documentation n8n](https://docs.n8n.io/)
- [Ollama API](https://github.com/ollama/ollama/blob/main/docs/api.md)
- [Discord.js Guide](https://discordjs.guide/)
- [Prometheus Docs](https://prometheus.io/docs/)
- [Wazuh Documentation](https://documentation.wazuh.com/)
- [HashiCorp Vault](https://www.vaultproject.io/docs)

---

## 📞 Support

- **Discord** : #gl-tower-support
- **Email** : support@gldigitallab.fr
- **GitHub Issues** : [GL Tower Repository]

---

*GL Tower v2.0 | Janvier 2026*  
*Développé par Neo pour GL Digital Lab*  
*🇫🇷 Made in Limoges, France*
