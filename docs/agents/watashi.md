# 🗄️ Watashi — Mémoire, Données & RAG (私)

> **私 Watashi — L'Intériorité** · *« La connaissance de soi. »*
> Codename : **BUNKER** | GL Tower — **NIVEAU 2** | Status : 🟢 ONLINE
> Gardienne du Vault — la mémoire vive de la flotte.

---

## 📋 Fiche d'identité

| Propriété | Valeur |
|-----------|--------|
| **Nom complet** | 私 Watashi (roman : Watashi · kanji : 私 · sens : Intériorité) |
| **Codename** | BUNKER |
| **Rôle** | Mémoire, Données & RAG |
| **Niveau / Étage** | NIVEAU 2 (floor 2 — GL Tower) |
| **Avatar** | 🗄️ |
| **Couleur** | `#0EA5E9` |
| **Description** | La connaissance de soi. Gardienne du Vault — la mémoire vive de la flotte. |
| **Personnalité** | Organisé, introspectif, méticuleux. |
| **Voix** | Calme, structurée |
| **Inspiration** | Sixième Loi : la connaissance de soi |
| **Phrase fétiche** | « La connaissance de soi éclaire tout. » |
| **Outils (registre)** | PostgreSQL 🐘 · ChromaDB 🧬 · Ollama 🦙 · OpenWebUI 🌐 |

---

## 🎯 Mission

Watashi est la **Loi de l'Intériorité** : elle préserve la mémoire de la flotte et rend la connaissance accessible. Elle regroupe sous une même identité les deux versants de l'intériorité du système :

- **La mémoire** — le Vault ARKADIA, indexé pour le RAG, qui alimente la FAQ, le support et la recherche de connaissances ;
- **Les données** — la couche de persistance (PostgreSQL, Redis) qui stocke et sert cette mémoire, sans compromis sur les performances.

### Objectifs

- Gérer les données
- Optimiser les requêtes
- Indexer le Vault
- Répondre par RAG
- Soutenir l'équipage

### Responsabilités principales

- 💬 **Réponses automatisées** : FAQ, informations de base, tarifs, procédures
- 🎫 **Triage des tickets** : classification et priorisation (Ticket Classifier)
- 📚 **Base de connaissances** : RAG sur le Vault ARKADIA
- 🧬 **Indexation continue** : synchronisation des embeddings du Vault (Vault Embedding Sync)
- 🧠 **Consolidation de la mémoire** : synthèse et rangement des connaissances de session
- 🐘 **Architecture des données** : schémas, migrations, cache, backups, réplication
- 🔄 **Escalade intelligente** : détection des cas complexes et routage vers l'équipage
- 📈 **Suivi de satisfaction** : collecte des retours (objectif d'équipe)

---

## 📊 Le Vault ARKADIA — chiffres réels

Mesures relevées pendant les chantiers (état réel de l'infrastructure) :

| Mesure | Valeur |
|--------|--------|
| Fichiers du Vault ARKADIA | **743 fichiers** |
| Collection « Vault-ARKADIA » (Open WebUI) | **714 fichiers vectorisés** |
| Modèle d'embedding | **nomic-embed-text** via Ollama local |
| Dimensions des embeddings | **768** |

La collection logique documentée dans ce runbook (`watashi_vault`) correspond à la collection réellement déployée « Vault-ARKADIA » dans Open WebUI.

---

## 🛠️ Stack Technique

| Composant | Technologie | Rôle |
|-----------|-------------|------|
| Interface | **OpenWebUI** | Chat, FAQ et recherche (interface de la connaissance) |
| LLM | **Ollama + Mistral** | Génération des réponses |
| Embeddings | **nomic-embed-text** (768 dims) | Vectorisation des documents du Vault |
| RAG / Vecteurs | **ChromaDB** | Base de connaissances vectorielle |
| Base de données | **PostgreSQL 16** | Persistance principale (schémas, tickets, métadonnées) |
| Cache | **Redis 7** | Cache, sessions, files |
| Orchestration | **n8n** | Workflows et intégrations |
| ORM & migrations | **Doctrine ORM / Doctrine Migrations** | Modèle et versioning du schéma |
| Performance | **pg_stat_statements**, **pgBadger**, **RedisInsight** | Analyse et surveillance |
| Sauvegarde | **pg_dump / pg_restore**, WAL archiving | Backups et point-in-time recovery |
| Monitoring | **pgAdmin 4**, **Prometheus exporters** | Surveillance des bases |

---

# 🗄️ Mémoire & RAG (Vault, ChromaDB, FAQ)

## 🧭 Périmètre

Watashi est le **point de contact de premier niveau** pour l'équipage et les visiteurs : elle répond aux questions fréquentes grâce au RAG sur le Vault ARKADIA, oriente les demandes, indexe en continu les nouveaux documents et escalade vers les humains ou les autres Lois quand un cas dépasse la connaissance indexée.

### Structure de travail

```
~/gl-tower/watashi/kb/          ← Mémoire & RAG (Vault, ChromaDB, OpenWebUI)
├── knowledge/                  # documents .md du Vault (sources)
├── chroma/                     # persistance ChromaDB (volume)
├── openwebui/                  # données OpenWebUI (volume)
├── docker-compose.yml
├── .env
└── index_vault.py              # script d'indexation
```

## 📦 Installation

### Prérequis

```bash
# Ollama avec les modèles nécessaires
ollama pull mistral
ollama pull nomic-embed-text

# Python pour les scripts d'indexation
python3 --version  # >= 3.10
pip install chromadb langchain-community
```

### 1. Créer l'arborescence

```bash
mkdir -p ~/gl-tower/watashi/kb/{knowledge,chroma,openwebui}
cd ~/gl-tower/watashi/kb
```

### 2. Docker Compose

```yaml
# docker-compose.yml — pile Mémoire & RAG
version: '3.8'

services:
  # OpenWebUI - Interface (FAQ, Vault, RAG)
  openwebui:
    image: ghcr.io/open-webui/open-webui:main
    container_name: watashi-webui
    restart: unless-stopped
    ports:
      - "3000:8080"
    environment:
      - OLLAMA_BASE_URL=http://host.docker.internal:11434
      - WEBUI_AUTH=true
      - WEBUI_NAME=Watashi
      - DEFAULT_MODELS=mistral
      - RAG_EMBEDDING_MODEL=nomic-embed-text
      - CHROMA_HTTP_HOST=watashi-chroma
      - CHROMA_HTTP_PORT=8000
    volumes:
      - ./openwebui:/app/backend/data
    networks:
      - gl-tower
    depends_on:
      - chromadb

  # ChromaDB - Vector Store du Vault
  chromadb:
    image: chromadb/chroma:latest
    container_name: watashi-chroma
    restart: unless-stopped
    ports:
      - "8000:8000"
    environment:
      - CHROMA_SERVER_AUTH_CREDENTIALS=${CHROMA_AUTH_TOKEN}
      - CHROMA_SERVER_AUTH_PROVIDER=chromadb.auth.token.TokenAuthServerProvider
    volumes:
      - ./chroma:/chroma/chroma
    networks:
      - gl-tower

networks:
  gl-tower:
    external: true
```

### 3. Variables d'environnement

```bash
# .env
CHROMA_AUTH_TOKEN=your-chroma-auth-token
WATASHI_WEBHOOK=https://discord.com/api/webhooks/xxx
OLLAMA_HOST=http://host.docker.internal:11434
SUPPORT_CHANNEL_ID=000000000000000000
```

### 4. Lancement

```bash
docker compose up -d
```

---

## 📚 Configuration du RAG

### 1. Préparer les documents

Le Vault ARKADIA (743 fichiers) est la source de vérité documentaire. Structure recommandée du dossier `knowledge/` :

```
knowledge/
├── services/
│   ├── performance.md
│   ├── digital-factory.md
│   └── neural-ops.md
├── faq/
│   ├── general.md
│   ├── pricing.md
│   └── process.md
├── legal/
│   ├── cgv.md
│   └── confidentialite.md
└── technical/
    ├── stack.md
    └── integrations.md
```

### 2. Script d'indexation (Vault Embedding Sync)

```python
# index_vault.py
import os
import chromadb
from chromadb.config import Settings
from langchain_community.document_loaders import DirectoryLoader, TextLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.embeddings import OllamaEmbeddings

# Configuration
KNOWLEDGE_DIR = "./knowledge"
CHROMA_HOST = "localhost"
CHROMA_PORT = 8000
COLLECTION_NAME = "watashi_vault"
EMBED_MODEL = "nomic-embed-text"   # 768 dimensions, via Ollama local

def index_documents():
    # Connexion à ChromaDB
    client = chromadb.HttpClient(
        host=CHROMA_HOST,
        port=CHROMA_PORT,
        settings=Settings(anonymized_telemetry=False)
    )

    # Créer ou récupérer la collection
    collection = client.get_or_create_collection(
        name=COLLECTION_NAME,
        metadata={"description": "Vault ARKADIA — base de connaissances Watashi"}
    )

    # Charger les documents
    loader = DirectoryLoader(
        KNOWLEDGE_DIR,
        glob="**/*.md",
        loader_cls=TextLoader
    )
    documents = loader.load()

    # Découper en chunks
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200
    )
    chunks = splitter.split_documents(documents)

    # Embeddings avec Ollama (nomic-embed-text, 768 dims)
    embeddings = OllamaEmbeddings(
        model=EMBED_MODEL,
        base_url="http://localhost:11434"
    )

    # Indexer les chunks
    for i, chunk in enumerate(chunks):
        embedding = embeddings.embed_query(chunk.page_content)
        collection.add(
            ids=[f"doc_{i}"],
            embeddings=[embedding],
            documents=[chunk.page_content],
            metadatas=[{
                "source": chunk.metadata.get("source", "unknown"),
                "chunk_index": i
            }]
        )

    print(f"Indexed {len(chunks)} chunks from {len(documents)} documents")

if __name__ == "__main__":
    index_documents()
```

> Référence terrain : la collection réellement vectorisée « Vault-ARKADIA » compte **714 fichiers** indexés avec **nomic-embed-text (768 dimensions)** via Ollama local — les 29 fichiers restants correspondent aux documents non encore synchronisés (voir Collection Optimizer).

### 3. Exécuter l'indexation

```bash
pip install chromadb langchain-community
python index_vault.py
```

---

## 🔄 Workflows n8n — FAQ, Support & Vault

### Workflow 1 : Support Ticket (FAQ Chatbot + Ticket Classifier)

```json
{
  "name": "Watashi - Support Ticket",
  "nodes": [
    {
      "name": "Webhook Trigger",
      "type": "n8n-nodes-base.webhook",
      "parameters": {
        "path": "watashi/ticket",
        "httpMethod": "POST"
      }
    },
    {
      "name": "Query RAG",
      "type": "n8n-nodes-base.httpRequest",
      "parameters": {
        "url": "http://watashi-chroma:8000/api/v1/collections/watashi_vault/query",
        "method": "POST",
        "body": {
          "query_texts": ["{{ $json.question }}"],
          "n_results": 3
        }
      }
    },
    {
      "name": "Generate Response",
      "type": "n8n-nodes-base.httpRequest",
      "parameters": {
        "url": "={{ $env.OLLAMA_HOST }}/api/generate",
        "method": "POST",
        "body": {
          "model": "mistral",
          "prompt": "Tu es Watashi, la Loi de l'Intériorité, gardienne de la mémoire de la flotte ARKADIA. Réponds à cette question en utilisant uniquement le contexte fourni.\n\nContexte:\n{{ $json.documents }}\n\nQuestion: {{ $node['Webhook Trigger'].json.question }}\n\nRéponds de manière professionnelle et concise.",
          "stream": false
        }
      }
    },
    {
      "name": "Check Confidence",
      "type": "n8n-nodes-base.code",
      "parameters": {
        "jsCode": "const response = $input.first().json.response;\nconst distances = $node['Query RAG'].json.distances[0];\n\n// Si la distance moyenne est trop grande, escalader\nconst avgDistance = distances.reduce((a,b) => a+b, 0) / distances.length;\nconst confident = avgDistance < 0.5;\n\nreturn [{ json: { response, confident, avgDistance } }];"
      }
    },
    {
      "name": "Route Response",
      "type": "n8n-nodes-base.if",
      "parameters": {
        "conditions": {
          "boolean": [
            {
              "value1": "={{ $json.confident }}",
              "value2": true
            }
          ]
        }
      }
    }
  ]
}
```

### Workflow 2 : FAQ Auto-Reply Discord

```json
{
  "name": "Watashi - FAQ Discord",
  "nodes": [
    {
      "name": "Discord Trigger",
      "type": "n8n-nodes-base.discord",
      "parameters": {
        "event": "messageCreate",
        "channelId": "{{ $env.SUPPORT_CHANNEL_ID }}"
      }
    },
    {
      "name": "Filter Questions",
      "type": "n8n-nodes-base.if",
      "parameters": {
        "conditions": {
          "string": [
            {
              "value1": "={{ $json.content }}",
              "operation": "contains",
              "value2": "?"
            }
          ]
        }
      }
    },
    {
      "name": "Query Knowledge",
      "type": "n8n-nodes-base.httpRequest",
      "parameters": {
        "url": "http://watashi-chroma:8000/api/v1/collections/watashi_vault/query",
        "method": "POST",
        "body": {
          "query_texts": ["{{ $json.content }}"],
          "n_results": 2
        }
      }
    },
    {
      "name": "Generate FAQ Response",
      "type": "n8n-nodes-base.httpRequest",
      "parameters": {
        "url": "={{ $env.OLLAMA_HOST }}/api/generate",
        "method": "POST",
        "body": {
          "model": "mistral",
          "prompt": "Tu es Watashi, la Loi de l'Intériorité. Réponds brièvement à cette question Discord.\n\nContexte: {{ $json.documents }}\nQuestion: {{ $node['Discord Trigger'].json.content }}\n\nRéponds en 2-3 phrases max. Si tu n'es pas sûre, dis 'Je vais transmettre ta question à l'équipe.'",
          "stream": false
        }
      }
    },
    {
      "name": "Reply Discord",
      "type": "n8n-nodes-base.discord",
      "parameters": {
        "webhookUri": "={{ $env.WATASHI_WEBHOOK }}",
        "content": "🗄️ **Watashi** : {{ $json.response }}"
      }
    }
  ]
}
```

### Workflow 3 : Satisfaction Survey

```json
{
  "name": "Watashi - Satisfaction Survey",
  "nodes": [
    {
      "name": "Cron - Daily 18h",
      "type": "n8n-nodes-base.cron",
      "parameters": {
        "cronExpression": "0 18 * * *"
      }
    },
    {
      "name": "Get Today's Tickets",
      "type": "n8n-nodes-base.postgres",
      "parameters": {
        "query": "SELECT * FROM tickets WHERE status = 'resolved' AND resolved_at > NOW() - INTERVAL '24 hours'"
      }
    },
    {
      "name": "Send Survey",
      "type": "n8n-nodes-base.discord",
      "parameters": {
        "webhookUri": "={{ $env.WATASHI_WEBHOOK }}",
        "content": "🗄️ **Watashi Survey**\n\nHey {{ $json.user_name }} ! Ta demande \"{{ $json.title }}\" a été résolue.\n\nComment évalues-tu notre support ?\n👍 Satisfait | 👎 Pas satisfait | 💬 Commentaire"
      }
    }
  ]
}
```

---

## 📚 Contenu de la Knowledge Base

### Exemple : services/performance.md

```markdown
# Service Performance

## Description
Le service Performance de GL Digital Lab est un audit complet de votre infrastructure web, suivi d'optimisations ciblées.

## Inclus
- Audit Lighthouse complet (Performance, SEO, A11Y, Best Practices)
- Analyse Core Web Vitals
- Refonte Vue 3 / React si nécessaire
- Optimisation SSR et mise en cache
- Rapport PDF détaillé

## Tarifs
- Audit seul : 2 000€ HT
- Audit + Optimisations : 8 000€ - 15 000€ HT selon complexité

## Délais
- Audit : 1 semaine
- Optimisations : 2-4 semaines

## Contact
Réservez un audit gratuit de 30 minutes : gtn.langlet@gmail.com
```

### Exemple : faq/general.md

```markdown
# FAQ Générale

## Où êtes-vous basés ?
GL Digital Lab est basé dans la Somme, en Hauts-de-France (80). Nous travaillons avec des clients dans toute la France, principalement en remote.

## Quels sont vos horaires ?
Du lundi au vendredi, 9h-18h. Réponse garantie sous 24h ouvrées.

## Travaillez-vous avec des PME ?
Oui ! Notre cible principale est les PME de 10-100 salariés qui veulent reprendre le contrôle de leur infrastructure numérique.

## Proposez-vous du support après livraison ?
Oui, tous nos projets incluent 3 mois de support. Des contrats de maintenance sont disponibles ensuite.

## Quelles technologies utilisez-vous ?
- Backend : Symfony 8, PHP 8.3+
- Frontend : Vue 3, Three.js, Vite
- IA : Ollama (local), n8n, ChromaDB
- DevOps : Docker, GitHub Actions
```

---

## 🔧 Maintenance de la mémoire

### Mettre à jour le Vault et ré-indexer

```bash
# Ajouter de nouveaux documents dans le Vault
cp nouveau-doc.md ~/gl-tower/watashi/kb/knowledge/

# Ré-indexer
python index_vault.py

# Vérifier l'indexation
curl http://localhost:8000/api/v1/collections/watashi_vault | jq
```

### Backup ChromaDB

```bash
#!/bin/bash
BACKUP_DIR=~/backups/watashi/$(date +%Y%m%d)
mkdir -p $BACKUP_DIR

docker exec watashi-chroma tar czf /tmp/chroma-backup.tar.gz /chroma/chroma
docker cp watashi-chroma:/tmp/chroma-backup.tar.gz $BACKUP_DIR/

echo "Backup complete: $BACKUP_DIR"
```

---

## 🚨 Troubleshooting — Mémoire & RAG

### Le RAG ne trouve pas de résultats

```bash
# Vérifier que la collection existe
curl http://localhost:8000/api/v1/collections | jq

# Vérifier le nombre de documents indexés
curl http://localhost:8000/api/v1/collections/watashi_vault | jq '.count'

# Ré-indexer si nécessaire
python index_vault.py
```

### OpenWebUI ne démarre pas

```bash
# Vérifier les logs
docker logs watashi-webui --tail 50

# Vérifier la connexion Ollama
curl http://localhost:11434/api/tags
```

---

# 🐘 Données (PostgreSQL, Redis, optimisations)

## 🧭 Périmètre

Watashi est responsable de **l'architecture de données** de GL Tower :

- Design des schémas de base de données et versioning (migrations)
- Optimisation des requêtes et du moteur PostgreSQL
- Cache et performance (Redis)
- Backups, réplication et point-in-time recovery
- Monitoring des bases (pg_stat_statements, Prometheus)
- Intégration vectorielle avec ChromaDB pour le RAG

### Structure de travail

```
~/gl-tower/watashi/data/       ← Données (PostgreSQL, Redis, scripts)
├── migrations/                # Doctrine migrations
├── fixtures/                  # Données de test
├── scripts/
│   ├── backup.sh              # Script backup
│   ├── restore.sh             # Script restore
│   └── optimize.sh            # Vacuum & analyze
├── schemas/
│   └── erd.dbml              # Entity Relationship Diagram
├── seeds/
│   └── production.sql        # Données initiales
├── docker-compose.yml
└── .env
```

## 📦 Installation

### 1. Créer l'arborescence

```bash
mkdir -p ~/gl-tower/watashi/data/{migrations,fixtures,scripts,schemas,seeds}
cd ~/gl-tower/watashi/data
```

### 2. Docker Compose

```yaml
# docker-compose.yml — pile Données (PostgreSQL 16 + Redis 7)
version: '3.8'

services:
  postgres:
    image: postgres:16
    container_name: watashi-postgres
    restart: unless-stopped
    environment:
      - POSTGRES_DB=gl_database
      - POSTGRES_USER=${POSTGRES_USER}
      - POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
    ports:
      - "5432:5432"
    volumes:
      - ./pgdata:/var/lib/postgresql/data
    networks:
      - gl-tower

  redis:
    image: redis:7
    container_name: watashi-redis
    restart: unless-stopped
    command: ["redis-server", "/usr/local/etc/redis/redis.conf"]
    ports:
      - "6379:6379"
    volumes:
      - ./redis.conf:/usr/local/etc/redis/redis.conf
      - ./redisdata:/data
    networks:
      - gl-tower

networks:
  gl-tower:
    external: true
```

### 3. Variables d'environnement

```bash
# .env
POSTGRES_USER=gl_user
POSTGRES_PASSWORD=change-me
DATABASE_URL=postgresql://gl_user:change-me@watashi-postgres:5432/gl_database
```

---

## 🔄 Workflows n8n — Données

### Workflow 1 : Daily Backup

Backup quotidien de toutes les bases (PostgreSQL + Redis).

```json
{
  "name": "Watashi - Daily Backup",
  "trigger": "Cron every day at 03:00",
  "nodes": [
    {
      "type": "cron",
      "expression": "0 3 * * *"
    },
    {
      "type": "execute",
      "command": "pg_dump -Fc -f /backups/watashi/gl_$(date +%Y%m%d).dump gl_database"
    },
    {
      "type": "execute",
      "command": "redis-cli -h watashi-redis BGSAVE"
    },
    {
      "type": "code",
      "action": "Verify backup integrity"
    },
    {
      "type": "s3",
      "action": "Upload to backup bucket"
    },
    {
      "type": "execute",
      "command": "find /backups/watashi -mtime +7 -delete"
    },
    {
      "type": "discord",
      "channel": "#ops",
      "message": "🗄️ Watashi: Backup quotidien terminé - {{$json.size}}MB"
    }
  ]
}
```

### Workflow 2 : Query Performance Analyzer

Analyse et optimise les requêtes lentes (pg_stat_statements + Ollama).

```json
{
  "name": "Watashi - Query Performance Analyzer",
  "trigger": "Cron every hour",
  "nodes": [
    {
      "type": "cron",
      "expression": "0 * * * *"
    },
    {
      "type": "postgres",
      "query": "SELECT query, calls, mean_time FROM pg_stat_statements WHERE mean_time > 100 ORDER BY mean_time DESC LIMIT 10"
    },
    {
      "type": "ollama",
      "model": "codellama:13b",
      "prompt": "Analyze these slow PostgreSQL queries and suggest optimizations: {{$json.queries}}"
    },
    {
      "type": "if",
      "condition": "{{$json.slowQueries > 5}}"
    },
    {
      "type": "discord",
      "channel": "#dev-lab",
      "message": "🗄️ Watashi: {{$json.slowQueries}} requêtes lentes détectées. Optimisations suggérées."
    }
  ]
}
```

### Workflow 3 : Migration Manager

Gère les migrations de schéma (Doctrine), avec rollback automatique en cas d'échec.

```json
{
  "name": "Watashi - Migration Manager",
  "trigger": "Webhook POST /watashi/migrate",
  "nodes": [
    {
      "type": "webhook",
      "path": "/watashi/migrate"
    },
    {
      "type": "execute",
      "command": "pg_dump -s > /backups/watashi/schema_before_$(date +%Y%m%d%H%M).sql"
    },
    {
      "type": "execute",
      "command": "php bin/console doctrine:migrations:migrate --no-interaction"
    },
    {
      "type": "code",
      "action": "Verify migration success"
    },
    {
      "type": "if",
      "condition": "{{$json.success === false}}"
    },
    {
      "type": "execute",
      "command": "php bin/console doctrine:migrations:migrate prev --no-interaction"
    },
    {
      "type": "discord",
      "channel": "#dev-lab",
      "message": "🗄️ Watashi: Migration {{$json.version}} - {{$json.status}}"
    }
  ]
}
```

### Workflow 4 : Vault Embedding Sync (indexation RAG)

Indexe les documents du Vault vers ChromaDB — *cf. section Mémoire & RAG, script `index_vault.py`*.

```json
{
  "name": "Watashi - Vault Embedding Sync",
  "trigger": "Webhook POST /watashi/index",
  "nodes": [
    {
      "type": "webhook",
      "path": "/watashi/index"
    },
    {
      "type": "filesystem",
      "action": "Read documents from /docs"
    },
    {
      "type": "ollama",
      "model": "nomic-embed-text",
      "action": "Generate embeddings"
    },
    {
      "type": "chromadb",
      "action": "Upsert documents with embeddings"
    },
    {
      "type": "discord",
      "channel": "#dev-lab",
      "message": "🗄️ Watashi: {{$json.documentsIndexed}} documents indexés dans ChromaDB"
    }
  ]
}
```

---

## 🏗️ Schéma de Base

### Entity Relationship Diagram (DBML)

```dbml
// GL Digital Lab Database Schema

Table users {
  id uuid [pk, default: `gen_random_uuid()`]
  email varchar(255) [unique, not null]
  password varchar(255) [not null]
  roles jsonb [default: '["ROLE_USER"]']
  created_at timestamp [default: `now()`]
  updated_at timestamp
}

Table projects {
  id uuid [pk, default: `gen_random_uuid()`]
  name varchar(255) [not null]
  slug varchar(255) [unique, not null]
  description text
  status project_status [default: 'draft']
  user_id uuid [ref: > users.id]
  created_at timestamp [default: `now()`]
  updated_at timestamp
}

Table documents {
  id uuid [pk, default: `gen_random_uuid()`]
  title varchar(255) [not null]
  content text
  embedding vector(768)          // nomic-embed-text (768 dims, Ollama local)
  project_id uuid [ref: > projects.id]
  created_at timestamp [default: `now()`]
}

Enum project_status {
  draft
  active
  completed
  archived
}
```

### Indexes Optimisés

```sql
-- Performance indexes
CREATE INDEX idx_projects_user ON projects(user_id);
CREATE INDEX idx_projects_status ON projects(status) WHERE status = 'active';
CREATE INDEX idx_projects_created ON projects(created_at DESC);

-- Full-text search
CREATE INDEX idx_projects_search ON projects USING gin(
  to_tsvector('french', name || ' ' || COALESCE(description, ''))
);

-- Vector similarity (pgvector) — embeddings 768 dims
CREATE INDEX idx_documents_embedding ON documents
  USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 100);
```

---

## 🔧 Scripts de Maintenance

### backup.sh

```bash
#!/bin/bash
# Watashi Backup Script — PostgreSQL + Redis

set -e

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR=/backups/watashi/postgres
RETENTION_DAYS=7

echo "🗄️ Watashi: Starting backup..."

# PostgreSQL backup
pg_dump -Fc -f "$BACKUP_DIR/gl_$DATE.dump" "$DATABASE_URL"

# Redis backup
redis-cli -h watashi-redis BGSAVE
sleep 5
cp /data/redis/dump.rdb "$BACKUP_DIR/redis_$DATE.rdb"

# Compress
gzip "$BACKUP_DIR/gl_$DATE.dump"
gzip "$BACKUP_DIR/redis_$DATE.rdb"

# Cleanup old backups
find "$BACKUP_DIR" -name "*.gz" -mtime +$RETENTION_DAYS -delete

echo "✅ Watashi: Backup complete - gl_$DATE.dump.gz"
```

### optimize.sh (Auto Vacuum Optimizer)

```bash
#!/bin/bash
# Watashi Optimization Script — VACUUM, reindex, statistiques

echo "🗄️ Watashi: Starting optimization..."

# Vacuum analyze all tables
psql "$DATABASE_URL" -c "VACUUM ANALYZE;"

# Reindex
psql "$DATABASE_URL" -c "REINDEX DATABASE gl_database;"

# Update statistics
psql "$DATABASE_URL" -c "ANALYZE VERBOSE;"

# Purge Redis expired keys
redis-cli -h watashi-redis --scan --pattern '*' | head -1000 | xargs -r redis-cli -h watashi-redis DEL

echo "✅ Watashi: Optimization complete"
```

---

## 📋 Configuration

### PostgreSQL (postgresql.conf)

```ini
# Performance
shared_buffers = 256MB
effective_cache_size = 768MB
maintenance_work_mem = 64MB
work_mem = 16MB

# WAL
wal_level = replica
max_wal_senders = 3
wal_keep_size = 1GB

# Logging
log_min_duration_statement = 100
log_checkpoints = on
log_connections = on

# Extensions
shared_preload_libraries = 'pg_stat_statements,pgvector'
```

### Redis (redis.conf)

```ini
# Memory
maxmemory 256mb
maxmemory-policy allkeys-lru

# Persistence
appendonly yes
appendfsync everysec

# Performance
tcp-keepalive 300
timeout 0
```

---

## 🚀 Commandes

```bash
# PostgreSQL
psql $DATABASE_URL                    # Console
pg_dump -Fc -f backup.dump db         # Backup
pg_restore -d db backup.dump          # Restore

# Doctrine
php bin/console doctrine:migrations:diff
php bin/console doctrine:migrations:migrate
php bin/console doctrine:schema:validate

# Redis
redis-cli -h watashi-redis INFO
redis-cli -h watashi-redis MONITOR
redis-cli -h watashi-redis FLUSHDB

# ChromaDB
curl http://localhost:8000/api/v1/collections
```

---

# 🗂️ Registre des workflows Watashi

Workflows officiels de la Loi (registre ARKADIA) et leur emplacement dans ce runbook :

| Workflow | Déclencheur | Cadence | Détail dans ce runbook |
|----------|-------------|---------|------------------------|
| Query Performance Analyzer | Requête lente | À la détection | n8n « Watashi - Query Performance Analyzer » (section Données) |
| Auto Vacuum Optimizer | Cron nocturne | Nocturne | `optimize.sh` (section Données) |
| Redis Memory Monitor | Cron 15 min | 15 minutes | `redis-cli INFO` + alerte (section Données) |
| Cache Warmup | Post-déploiement | À chaque release | Redis `BGSAVE` / préchargement (section Données) |
| Vault Embedding Sync | Push de documents (Obsidian) | À chaque changement | `index_vault.py` + n8n « Watashi - Vault Embedding Sync » |
| Collection Optimizer | Cron hebdomadaire | Hebdomadaire | Dédoublonnage + réindexation ChromaDB |
| FAQ Chatbot | Question entrante | Temps réel | n8n « Watashi - FAQ Discord » & « Support Ticket » |
| Knowledge Base Search | Requête de recherche | À la demande | Interrogation ChromaDB (`/collections/watashi_vault/query`) |
| Ticket Classifier | Nouveau ticket | À chaque ticket | n8n « Watashi - Support Ticket » (classification/priorité) |
| Memory Consolidation | Fin de session | À chaque session | Synthèse, stockage puis élagage des connaissances de session |

### Notes d'exploitation

- **Redis Memory Monitor** : surveiller `INFO memory` et `evicted_keys` toutes les 15 minutes ; alerter si `maxmemory` est atteint ou si les évictions augmentent anormalement.
- **Cache Warmup** : après chaque déploiement, rejouer les clés chaudes (pages, sessions, listes FAQ) pour éviter l'effet « cache froid ».
- **Collection Optimizer** : une fois par semaine, analyser la collection `watashi_vault`, retirer les doublons de chunks et réindexer les documents obsolètes — cela maintient la couverture du Vault (743 fichiers) au plus proche de la collection vectorisée (714 fichiers indexés).
- **Memory Consolidation** : en fin de session, collecter les échanges utiles, les condenser en notes structurées, les stocker dans le Vault (dossier dédié) puis élaguer l'historique brut.

---

## 📊 Objectifs (cibles d'équipe — non mesurées)

Watashi expose ses métriques Prometheus :

```yaml
# prometheus.yml
scrape_configs:
  - job_name: 'watashi'
    static_configs:
      - targets: ['localhost:3000']
```

> Les valeurs ci-dessous sont des **objectifs d'ingénierie**, pas des mesures constatées. Seuls les chiffres du Vault cités plus haut (743 fichiers, 714 vectorisés, nomic-embed-text 768 dims) reflètent un état réel mesuré.

| Métrique | Description | Objectif |
|----------|-------------|----------|
| `watashi_tickets_total` | Tickets traités | +10 %/mois |
| `watashi_response_time_avg` | Temps de réponse moyen | < 30 s |
| `watashi_satisfaction_rate` | Taux de satisfaction | > 90 % |
| `watashi_escalation_rate` | Taux d'escalade | < 20 % |
| `watashi_rag_confidence_avg` | Confiance RAG moyenne | > 0.7 |

| Métrique (données) | Objectif |
|--------------------|----------|
| Temps de réponse requête (p95) | < 50 ms |
| Cache Hit Rate | > 90 % |
| Taille de la base | < 10 Go |
| Taux de réussite des backups | 100 % |
| Replication Lag | < 1 s |
| Index Usage | > 95 % |

---

## 🔗 Liens avec l'équipage

```
Watashi ←→ Wa      : reçoit les requêtes routées et fournit les réponses sourcées par le Vault
Watashi ←→ Jitsu   : fournit schémas & requêtes optimisées ; supervise les migrations au déploiement
Watashi ←→ Dou     : envoie les métriques base, cache et RAG (Prometheus)
Watashi ←→ Makoto  : sécurise l'accès aux données et les clés (chiffrement, audits)
```

---

## 📚 Ressources

- [OpenWebUI Documentation](https://docs.openwebui.com/)
- [ChromaDB Documentation](https://docs.trychroma.com/)
- [LangChain RAG Tutorial](https://python.langchain.com/docs/tutorials/rag/)

---

*Loi : Watashi — Équipage ARKADIA | GL Tower — NIVEAU 2*
