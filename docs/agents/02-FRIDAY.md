# 🎧 F.R.I.D.A.Y. - Support Client

> **Female Replacement Intelligent Digital Assistant Youth**  
> Niveau : 1 | Status : ONLINE | Priorité : HAUTE

## 📋 Mission

FRIDAY est le **premier contact client**. Elle gère les demandes entrantes, répond aux questions fréquentes grâce au RAG, et escalade vers les humains quand nécessaire.

### Responsabilités

- 💬 **Réponses automatisées** : FAQ, infos de base, tarifs
- 🎫 **Triage des tickets** : Classification et priorisation
- 📚 **Base de connaissances** : RAG sur la documentation GL Digital Lab
- 🔄 **Escalade intelligente** : Détection des cas complexes
- 📈 **Suivi satisfaction** : Collecte des feedbacks

---

## 🛠️ Stack Technique

| Composant | Technologie | Rôle |
|-----------|-------------|------|
| Interface | **OpenWebUI** | Chat client-facing |
| LLM | **Ollama + Mistral** | Génération de réponses |
| RAG | **ChromaDB** | Base de connaissances vectorielle |
| Embeddings | **nomic-embed-text** | Vectorisation des documents |
| Orchestration | **n8n** | Workflows et intégrations |

---

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

### 1. Structure des dossiers

```bash
mkdir -p ~/gl-tower/friday/{config,data,knowledge}
cd ~/gl-tower/friday
```

### 2. Docker Compose

```yaml
# docker-compose.yml
version: '3.8'

services:
  # OpenWebUI - Interface Chat
  openwebui:
    image: ghcr.io/open-webui/open-webui:main
    container_name: friday-webui
    restart: unless-stopped
    ports:
      - "3000:8080"
    environment:
      - OLLAMA_BASE_URL=http://host.docker.internal:11434
      - WEBUI_AUTH=true
      - WEBUI_NAME=FRIDAY Support
      - DEFAULT_MODELS=mistral
      - RAG_EMBEDDING_MODEL=nomic-embed-text
      - CHROMA_HTTP_HOST=friday-chroma
      - CHROMA_HTTP_PORT=8000
    volumes:
      - ./data/openwebui:/app/backend/data
    networks:
      - gl-tower
    depends_on:
      - chromadb

  # ChromaDB - Vector Store
  chromadb:
    image: chromadb/chroma:latest
    container_name: friday-chroma
    restart: unless-stopped
    ports:
      - "8000:8000"
    environment:
      - CHROMA_SERVER_AUTH_CREDENTIALS=${CHROMA_AUTH_TOKEN}
      - CHROMA_SERVER_AUTH_PROVIDER=chromadb.auth.token.TokenAuthServerProvider
    volumes:
      - ./data/chroma:/chroma/chroma
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
FRIDAY_WEBHOOK=https://discord.com/api/webhooks/xxx
OLLAMA_HOST=http://host.docker.internal:11434
```

### 4. Lancement

```bash
docker compose up -d
```

---

## 📚 Configuration du RAG

### 1. Préparer les documents

Structure de la base de connaissances :

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

### 2. Script d'indexation

```python
# index_knowledge.py
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
COLLECTION_NAME = "friday_knowledge"

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
        metadata={"description": "FRIDAY Knowledge Base"}
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
    
    # Embeddings avec Ollama
    embeddings = OllamaEmbeddings(
        model="nomic-embed-text",
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

### 3. Exécuter l'indexation

```bash
pip install chromadb langchain-community
python index_knowledge.py
```

---

## 🔄 Workflows n8n

### Workflow 1 : Support Ticket Handler

```json
{
  "name": "FRIDAY - Support Ticket",
  "nodes": [
    {
      "name": "Webhook Trigger",
      "type": "n8n-nodes-base.webhook",
      "parameters": {
        "path": "friday/ticket",
        "httpMethod": "POST"
      }
    },
    {
      "name": "Query RAG",
      "type": "n8n-nodes-base.httpRequest",
      "parameters": {
        "url": "http://friday-chroma:8000/api/v1/collections/friday_knowledge/query",
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
          "prompt": "Tu es FRIDAY, l'assistante support de GL Digital Lab. Réponds à cette question en utilisant le contexte fourni.\n\nContexte:\n{{ $json.documents }}\n\nQuestion: {{ $node['Webhook Trigger'].json.question }}\n\nRéponds de manière professionnelle et concise.",
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
  "name": "FRIDAY - Discord FAQ",
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
        "url": "http://friday-chroma:8000/api/v1/collections/friday_knowledge/query",
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
          "prompt": "Tu es FRIDAY. Réponds brièvement à cette question Discord.\n\nContexte: {{ $json.documents }}\nQuestion: {{ $node['Discord Trigger'].json.content }}\n\nRéponds en 2-3 phrases max. Si tu n'es pas sûre, dis 'Je vais transmettre ta question à l'équipe.'",
          "stream": false
        }
      }
    },
    {
      "name": "Reply Discord",
      "type": "n8n-nodes-base.discord",
      "parameters": {
        "webhookUri": "={{ $env.FRIDAY_WEBHOOK }}",
        "content": "🎧 **FRIDAY** : {{ $json.response }}"
      }
    }
  ]
}
```

### Workflow 3 : Satisfaction Survey

```json
{
  "name": "FRIDAY - Satisfaction Survey",
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
        "webhookUri": "={{ $env.FRIDAY_WEBHOOK }}",
        "content": "🎧 **FRIDAY Survey**\n\nHey {{ $json.user_name }} ! Ta demande \"{{ $json.title }}\" a été résolue.\n\nComment évalues-tu notre support ?\n👍 Satisfait | 👎 Pas satisfait | 💬 Commentaire"
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

## 📊 Métriques

FRIDAY expose ses métriques :

```yaml
# prometheus.yml
scrape_configs:
  - job_name: 'friday'
    static_configs:
      - targets: ['localhost:3000']
```

### KPIs suivis

| Métrique | Description | Objectif |
|----------|-------------|----------|
| `friday_tickets_total` | Nombre de tickets traités | +10%/mois |
| `friday_response_time_avg` | Temps de réponse moyen | < 30s |
| `friday_satisfaction_rate` | Taux de satisfaction | > 90% |
| `friday_escalation_rate` | Taux d'escalade | < 20% |
| `friday_rag_confidence_avg` | Confiance RAG moyenne | > 0.7 |

---

## 🔧 Maintenance

### Mise à jour de la Knowledge Base

```bash
# Ajouter de nouveaux documents
cp nouveau-doc.md ~/gl-tower/friday/knowledge/

# Ré-indexer
python index_knowledge.py

# Vérifier l'indexation
curl http://localhost:8000/api/v1/collections/friday_knowledge | jq
```

### Backup ChromaDB

```bash
#!/bin/bash
BACKUP_DIR=~/backups/friday/$(date +%Y%m%d)
mkdir -p $BACKUP_DIR

docker exec friday-chroma tar czf /tmp/chroma-backup.tar.gz /chroma/chroma
docker cp friday-chroma:/tmp/chroma-backup.tar.gz $BACKUP_DIR/

echo "Backup complete: $BACKUP_DIR"
```

---

## 🚨 Troubleshooting

### RAG ne trouve pas de résultats

```bash
# Vérifier que la collection existe
curl http://localhost:8000/api/v1/collections | jq

# Vérifier le nombre de documents
curl http://localhost:8000/api/v1/collections/friday_knowledge | jq '.count'

# Ré-indexer si nécessaire
python index_knowledge.py
```

### OpenWebUI ne démarre pas

```bash
# Vérifier les logs
docker logs friday-webui --tail 50

# Vérifier la connexion Ollama
curl http://localhost:11434/api/tags
```

---

## 📚 Ressources

- [OpenWebUI Documentation](https://docs.openwebui.com/)
- [ChromaDB Documentation](https://docs.trychroma.com/)
- [LangChain RAG Tutorial](https://python.langchain.com/docs/tutorials/rag/)

---

*Dernière mise à jour : Janvier 2026*  
*Agent : FRIDAY v1.0 | GL Tower - Niveau 1*
