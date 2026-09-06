# 🏢 GL TOWER - L'Équipage des 6 Lois

> **Centre de Commandement GL Digital Lab**  
> Infrastructure humaine augmentée par l'équipage ARKADIA — six Lois souveraines, 100 % locales.
> Nomenclature : 和 Wa, 誠 Makoto, 美 Bi, 実 Jitsu, 動 Dou, 私 Watashi.

---

## 🗺️ Architecture de la Tour

```
┌────────────────────────────────────────────────────────────┐
│  ⬡ PENTHOUSE                                                │
│     🎯 和 Wa — Orchestration & Coordination                 │
│     Routage • Contexte • Synthèse • Équilibrage             │
├────────────────────────────────────────────────────────────┤
│  NIVEAU 6                                                    │
│     🛡️ 誠 Makoto — Sécurité, Audit & QA                    │
│     Scan • Tests • Secrets • Intrusion                      │
├────────────────────────────────────────────────────────────┤
│  NIVEAU 5                                                    │
│     💜 美 Bi — Frontend, Design & 3D                        │
│     Vue 3 • Three.js • GSAP • UI/UX                         │
├────────────────────────────────────────────────────────────┤
│  NIVEAU 4                                                    │
│     🚀 実 Jitsu — Backend, Build & Livraison                │
│     Symfony • CI/CD • Docker • Déploiement                  │
├────────────────────────────────────────────────────────────┤
│  NIVEAU 3                                                    │
│     📊 動 Dou — Monitoring, Veille & Alertes                │
│     Prometheus • Grafana • Loki • Alertes                   │
├────────────────────────────────────────────────────────────┤
│  NIVEAU 2                                                    │
│     🗄️ 私 Watashi — Mémoire, Données & RAG                 │
│     PostgreSQL • ChromaDB • Vault ARKADIA • FAQ             │
├────────────────────────────────────────────────────────────┤
│  NIVEAU 0 — LOBBY                                            │
│     🚪 Accueil Visiteurs • Services • Contact               │
└────────────────────────────────────────────────────────────┘
            GL TOWER • Somme, France • 2026
```

---

## 📚 Index des Runbooks

| Loi | Niveau | Rôle | Stack Principal | Runbook |
|-----|--------|------|-----------------|---------|
| **和 Wa** | ⬡ Penthouse | Orchestration & Coordination | n8n, Redis, API Gateway | [→ wa.md](./wa.md) |
| **誠 Makoto** | 6 | Sécurité, Audit & QA | Trivy, Wazuh, Vault, PHPUnit, Playwright | [→ makoto.md](./makoto.md) |
| **美 Bi** | 5 | Frontend, Design & 3D | Vue 3, Three.js, GSAP, Figma | [→ bi.md](./bi.md) |
| **実 Jitsu** | 4 | Backend, Build & Livraison | Symfony 8, GitHub Actions, Docker, Vite | [→ jitsu.md](./jitsu.md) |
| **動 Dou** | 3 | Monitoring, Veille & Alertes | Prometheus, Grafana, Loki, n8n | [→ dou.md](./dou.md) |
| **私 Watashi** | 2 | Mémoire, Données & RAG | PostgreSQL, ChromaDB, Ollama, OpenWebUI | [→ watashi.md](./watashi.md) |

**Trinity**, la Grande Architecte, veille au-dessus de l'équipage — elle n'est pas un agent.

---

## 🔄 Flux de coordination

```
                    ┌──────────────┐
                    │      WA      │ ← Coordinatrice
                    │  (Penthouse) │    (orchestration)
                    └──────┬───────┘
                           │
         ┌─────────────────┼─────────────────┐
         │                 │                 │
         ▼                 ▼                 ▼
   ┌──────────┐      ┌──────────┐      ┌──────────┐
   │  MAKOTO  │      │   JITSU  │      │   BI     │
   │ Sécurité │      │ Backend  │      │ Frontend │
   │ Tests QA │      │ CI/CD    │      │ Design 3D│
   └──────────┘      └──────────┘      └──────────┘
         │                 │                 │
         └─────────────────┼─────────────────┘
                           │
         ┌─────────────────┼─────────────────┐
         │                 │                 │
         ▼                 ▼                 ▼
   ┌──────────┐      ┌──────────┐      ┌──────────┐
   │   DOU    │      │ WATASHI  │      │  LOBBY   │
   │Monitoring│      │ Mémoire  │      │ Accueil  │
   │ Alertes  │      │ RAG Vault│      │ Clients  │
   └──────────┘      └──────────┘      └──────────┘
```

Les activités non techniques (community, contenu, facturation, marketing) ne sont
**pas des agents** : elles relèvent des vaisseaux **Logos** (agence — ce qui finance)
et **Icarus** (créations — ce qui donne le sens).

---

## 🚀 Quick Start

### 1. Prérequis

```bash
# Docker & Docker Compose
docker --version  # >= 24.0
docker compose version  # >= 2.20

# Ollama (LLM local pour l'équipage)
ollama --version
ollama pull mistral
ollama pull nomic-embed-text

# Node.js (pour les services annexes)
node --version  # >= 20.0
```

### 2. Créer le réseau GL Tower

```bash
docker network create gl-tower-network
```

### 3. Ordre de déploiement recommandé

1. **Monitoring d'abord** (visibilité dès le départ)
   ```bash
   cd ~/gl-tower/dou && docker compose up -d
   ```

2. **Mémoire & données** (Vault, RAG)
   ```bash
   cd ~/gl-tower/watashi && docker compose up -d
   ```

3. **Coordination** (n8n — Wa orchestre le reste)
   ```bash
   cd ~/gl-tower/wa && docker compose up -d
   ```

4. **Sécurité & QA**
   ```bash
   cd ~/gl-tower/makoto && docker compose up -d
   ```

5. **Livraison & Frontend** (Jitsu, Bi — le build se fait via CI/CD)

> La documentation d'infrastructure consolidée (compose global, déploiement,
> variables d'environnement) se trouve dans [`infrastructure/`](../infrastructure/DEPLOY.md).

### 4. Vérification

```bash
# Status de tous les containers
docker ps --filter "network=gl-tower-network"

# Health check global (Wa — coordination)
curl http://localhost:5678/webhook/wa/status
```

---

## 📊 Dashboard de Monitoring

Après déploiement, accéder aux interfaces :

| Service | URL | Loi ARKADIA |
|---------|-----|-------------|
| n8n (orchestration) | http://localhost:5678 | Wa |
| OpenWebUI (chat + RAG) | http://localhost:3000 | Watashi |
| Grafana | http://localhost:3001 | Dou |
| Prometheus | http://localhost:9090 | Dou |
| Vault | http://localhost:8200 | Makoto |
| ChromaDB | http://localhost:8000 | Watashi |

---

## 🔐 Gestion des Secrets

Tous les secrets sont gérés par **Makoto** via HashiCorp Vault :

```bash
# Initialiser les secrets GL Tower
cd ~/gl-tower/makoto
./scripts/manage-secrets.sh init

# Récupérer un secret
./scripts/manage-secrets.sh get gl-tower/database password

# Rotation des secrets
./scripts/manage-secrets.sh rotate gl-tower/api discord_token
```

---

## 🛠️ Maintenance

### Backup quotidien

```bash
#!/bin/bash
# backup-gl-tower.sh
DATE=$(date +%Y%m%d)
BACKUP_DIR=~/backups/gl-tower/$DATE

mkdir -p $BACKUP_DIR

# Backup de chaque Loi
for loi in wa makoto jitsu dou watashi; do
  cd ~/gl-tower/$loi
  docker compose exec -T postgres pg_dump -U app app > $BACKUP_DIR/${loi}-db.sql 2>/dev/null || true
  cp -r ./config $BACKUP_DIR/${loi}-config/ 2>/dev/null || true
done

# Compression
tar czf ~/backups/gl-tower-$DATE.tar.gz $BACKUP_DIR
rm -rf $BACKUP_DIR

echo "✅ Backup complete: gl-tower-$DATE.tar.gz"
```

### Mise à jour de l'équipage

```bash
#!/bin/bash
# update-gl-tower.sh

echo "🔄 Updating GL Tower équipage..."

for loi in wa makoto jitsu dou watashi; do
  echo "Updating $loi..."
  cd ~/gl-tower/$loi
  docker compose pull
  docker compose up -d --force-recreate
done

echo "✅ Équipage à jour"
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

*GL Tower — L'Équipage ARKADIA | 2026*  
*Développé par Neo pour GL Digital Lab*  
*🇫🇷 Made in Somme, France*
