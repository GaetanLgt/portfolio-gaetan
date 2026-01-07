# RAG avec Obsidian + ChromaDB + Ollama

> **Tutoriel complet** pour créer un système de Retrieval-Augmented Generation (RAG) qui exploite votre vault Obsidian comme base de connaissances, avec ChromaDB pour l'indexation vectorielle et Ollama pour la génération.

---

## Table des matières

1. [Concept du RAG](#1-concept-du-rag)
2. [Architecture](#2-architecture)
3. [Installation](#3-installation)
4. [Indexation du vault Obsidian](#4-indexation-du-vault-obsidian)
5. [API de recherche](#5-api-de-recherche)
6. [Intégration avec n8n](#6-intégration-avec-n8n)
7. [Interface de chat](#7-interface-de-chat)
8. [Optimisations](#8-optimisations)

---

## 1. Concept du RAG

### Qu'est-ce que le RAG ?

Le **Retrieval-Augmented Generation** combine :

1. **Retrieval** : Recherche de documents pertinents dans une base de connaissances
2. **Augmented** : Enrichissement du prompt avec le contexte trouvé
3. **Generation** : Production d'une réponse par un LLM

### Pourquoi RAG + Obsidian ?

| Avantage | Description |
|----------|-------------|
| **Connaissances à jour** | Le LLM utilise vos notes actuelles, pas ses connaissances figées |
| **Précision** | Réponses basées sur VOS documents, pas des généralités |
| **Traçabilité** | Vous savez d'où vient l'information (sources citées) |
| **Privé** | Tout reste local, aucune fuite de données |

### Flux de données

```
Question utilisateur
        │
        ▼
┌───────────────────┐
│   Embedding de    │
│   la question     │
│   (Ollama)        │
└────────┬──────────┘
         │
         ▼
┌───────────────────┐
│   Recherche       │
│   vectorielle     │
│   (ChromaDB)      │
└────────┬──────────┘
         │
         ▼
┌───────────────────┐
│   Top K documents │
│   pertinents      │
└────────┬──────────┘
         │
         ▼
┌───────────────────┐
│   Prompt enrichi  │
│   Question +      │
│   Contexte        │
└────────┬──────────┘
         │
         ▼
┌───────────────────┐
│   Génération      │
│   (Ollama LLM)    │
└────────┬──────────┘
         │
         ▼
    Réponse avec sources
```

---

## 2. Architecture

### Stack technique

```
┌─────────────────────────────────────────────────────────────────┐
│                      OBSIDIAN VAULT                             │
│    (Vos notes Markdown : projets, docs, knowledge base)        │
└──────────────────────────────┬──────────────────────────────────┘
                               │ Lecture fichiers
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                    SCRIPT D'INDEXATION                          │
│              (Python : lecture + chunking)                      │
└──────────────────────────────┬──────────────────────────────────┘
                               │ Chunks de texte
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                         OLLAMA                                  │
│              (Modèle d'embedding : nomic-embed-text)           │
└──────────────────────────────┬──────────────────────────────────┘
                               │ Vecteurs
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                        CHROMADB                                 │
│              (Base de données vectorielle)                     │
└──────────────────────────────┬──────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                        API FASTAPI                              │
│              /search, /chat, /reindex                          │
└──────────────────────────────┬──────────────────────────────────┘
                               │
              ┌────────────────┼────────────────┐
              ▼                ▼                ▼
         [n8n]           [Web UI]         [CLI]
```

### Ports et services

| Service | Port | Usage |
|---------|------|-------|
| FastAPI | 8000 | API RAG |
| ChromaDB | 8001 | Base vectorielle |
| Ollama | 11434 | Embeddings + LLM |

---

## 3. Installation

### 3.1 Structure du projet

```bash
mkdir -p obsidian-rag/{app,scripts}
cd obsidian-rag
```

```
obsidian-rag/
├── docker-compose.yml
├── .env
├── app/
│   ├── main.py              # API FastAPI
│   ├── indexer.py           # Script d'indexation
│   ├── rag.py               # Logique RAG
│   └── requirements.txt
├── scripts/
│   └── reindex.sh
└── data/
    └── chroma/              # Données ChromaDB
```

### 3.2 Fichier : `docker-compose.yml`

```yaml
version: '3.8'

services:
  # ===================
  # API RAG (FastAPI)
  # ===================
  rag-api:
    build:
      context: ./app
      dockerfile: Dockerfile
    container_name: rag-api
    ports:
      - "8000:8000"
    environment:
      - OLLAMA_URL=http://ollama:11434
      - CHROMA_HOST=chromadb
      - CHROMA_PORT=8000
      - VAULT_PATH=/vault
      - EMBEDDING_MODEL=nomic-embed-text
      - LLM_MODEL=llama3.2
    volumes:
      - ${OBSIDIAN_VAULT_PATH}:/vault:ro
      - ./app:/app
    depends_on:
      - chromadb
      - ollama
    networks:
      - rag-network
    restart: unless-stopped

  # ===================
  # ChromaDB
  # ===================
  chromadb:
    image: chromadb/chroma:latest
    container_name: chromadb
    ports:
      - "8001:8000"
    volumes:
      - ./data/chroma:/chroma/chroma
    environment:
      - IS_PERSISTENT=TRUE
      - ANONYMIZED_TELEMETRY=FALSE
    networks:
      - rag-network
    restart: unless-stopped

  # ===================
  # Ollama
  # ===================
  ollama:
    image: ollama/ollama:latest
    container_name: ollama-rag
    ports:
      - "11434:11434"
    volumes:
      - ollama-models:/root/.ollama
    environment:
      - OLLAMA_HOST=0.0.0.0
    networks:
      - rag-network
    restart: unless-stopped
    # GPU NVIDIA (décommenter si disponible)
    # deploy:
    #   resources:
    #     reservations:
    #       devices:
    #         - driver: nvidia
    #           count: 1
    #           capabilities: [gpu]

networks:
  rag-network:
    driver: bridge

volumes:
  ollama-models:
```

### 3.3 Fichier : `.env`

```bash
# Chemin vers votre vault Obsidian
OBSIDIAN_VAULT_PATH=/home/user/Documents/ObsidianVault

# Modèles Ollama
EMBEDDING_MODEL=nomic-embed-text
LLM_MODEL=llama3.2

# API
API_HOST=0.0.0.0
API_PORT=8000
```

### 3.4 Fichier : `app/Dockerfile`

```dockerfile
FROM python:3.11-slim

WORKDIR /app

# Dépendances système
RUN apt-get update && apt-get install -y \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Dépendances Python
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Code source
COPY . .

# Healthcheck
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s \
    CMD curl -f http://localhost:8000/health || exit 1

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
```

### 3.5 Fichier : `app/requirements.txt`

```
fastapi==0.109.0
uvicorn==0.27.0
chromadb==0.4.22
httpx==0.26.0
python-dotenv==1.0.0
pydantic==2.5.3
markdown==3.5.2
PyYAML==6.0.1
watchdog==3.0.0
```

### 3.6 Démarrer la stack

```bash
# Démarrer
docker compose up -d

# Télécharger les modèles Ollama
docker exec ollama-rag ollama pull nomic-embed-text
docker exec ollama-rag ollama pull llama3.2

# Vérifier
docker compose ps
docker compose logs -f
```

---

## 4. Indexation du vault Obsidian

### 4.1 Fichier : `app/indexer.py`

```python
"""
Indexeur de vault Obsidian vers ChromaDB
"""
import os
import re
import hashlib
from pathlib import Path
from typing import List, Dict, Any
import chromadb
from chromadb.config import Settings
import httpx
import yaml

class ObsidianIndexer:
    def __init__(
        self,
        vault_path: str,
        chroma_host: str = "chromadb",
        chroma_port: int = 8000,
        ollama_url: str = "http://ollama:11434",
        embedding_model: str = "nomic-embed-text",
        collection_name: str = "obsidian_vault"
    ):
        self.vault_path = Path(vault_path)
        self.ollama_url = ollama_url
        self.embedding_model = embedding_model
        self.collection_name = collection_name
        
        # Client ChromaDB
        self.chroma = chromadb.HttpClient(
            host=chroma_host,
            port=chroma_port,
            settings=Settings(anonymized_telemetry=False)
        )
        
        # Collection
        self.collection = self.chroma.get_or_create_collection(
            name=collection_name,
            metadata={"hnsw:space": "cosine"}
        )
    
    def get_embedding(self, text: str) -> List[float]:
        """Obtenir l'embedding d'un texte via Ollama"""
        response = httpx.post(
            f"{self.ollama_url}/api/embeddings",
            json={
                "model": self.embedding_model,
                "prompt": text
            },
            timeout=60.0
        )
        response.raise_for_status()
        return response.json()["embedding"]
    
    def parse_frontmatter(self, content: str) -> tuple[Dict, str]:
        """Extraire le frontmatter YAML et le contenu"""
        if content.startswith("---"):
            parts = content.split("---", 2)
            if len(parts) >= 3:
                try:
                    frontmatter = yaml.safe_load(parts[1])
                    return frontmatter or {}, parts[2].strip()
                except yaml.YAMLError:
                    pass
        return {}, content
    
    def chunk_text(
        self, 
        text: str, 
        chunk_size: int = 500, 
        overlap: int = 50
    ) -> List[str]:
        """Découper le texte en chunks avec overlap"""
        # Nettoyer le texte
        text = re.sub(r'\n{3,}', '\n\n', text)
        text = re.sub(r'```[\s\S]*?```', '[CODE BLOCK]', text)  # Simplifier les blocs de code
        
        words = text.split()
        chunks = []
        
        for i in range(0, len(words), chunk_size - overlap):
            chunk = ' '.join(words[i:i + chunk_size])
            if chunk.strip():
                chunks.append(chunk)
        
        return chunks
    
    def extract_links(self, content: str) -> List[str]:
        """Extraire les liens internes Obsidian [[...]]"""
        pattern = r'\[\[([^\]|]+)(?:\|[^\]]+)?\]\]'
        return re.findall(pattern, content)
    
    def extract_tags(self, content: str) -> List[str]:
        """Extraire les tags #tag"""
        pattern = r'#([a-zA-Z0-9_-]+)'
        return list(set(re.findall(pattern, content)))
    
    def process_file(self, file_path: Path) -> List[Dict[str, Any]]:
        """Traiter un fichier Markdown"""
        relative_path = file_path.relative_to(self.vault_path)
        
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        frontmatter, body = self.parse_frontmatter(content)
        tags = self.extract_tags(content) + frontmatter.get('tags', [])
        links = self.extract_links(content)
        
        chunks = self.chunk_text(body)
        documents = []
        
        for i, chunk in enumerate(chunks):
            doc_id = hashlib.md5(f"{relative_path}:{i}".encode()).hexdigest()
            
            documents.append({
                "id": doc_id,
                "content": chunk,
                "metadata": {
                    "source": str(relative_path),
                    "title": frontmatter.get('title', file_path.stem),
                    "tags": ",".join(tags),
                    "links": ",".join(links),
                    "chunk_index": i,
                    "total_chunks": len(chunks),
                    "folder": str(relative_path.parent)
                }
            })
        
        return documents
    
    def index_vault(self, force: bool = False) -> Dict[str, int]:
        """Indexer tout le vault"""
        if force:
            # Supprimer l'ancienne collection
            try:
                self.chroma.delete_collection(self.collection_name)
            except:
                pass
            self.collection = self.chroma.get_or_create_collection(
                name=self.collection_name,
                metadata={"hnsw:space": "cosine"}
            )
        
        stats = {"files": 0, "chunks": 0, "errors": 0}
        
        # Parcourir les fichiers Markdown
        md_files = list(self.vault_path.rglob("*.md"))
        
        for file_path in md_files:
            # Ignorer certains dossiers
            if any(p.startswith('.') for p in file_path.parts):
                continue
            if 'templates' in file_path.parts:
                continue
            
            try:
                documents = self.process_file(file_path)
                
                if documents:
                    # Générer les embeddings
                    for doc in documents:
                        doc["embedding"] = self.get_embedding(doc["content"])
                    
                    # Insérer dans ChromaDB
                    self.collection.upsert(
                        ids=[d["id"] for d in documents],
                        embeddings=[d["embedding"] for d in documents],
                        documents=[d["content"] for d in documents],
                        metadatas=[d["metadata"] for d in documents]
                    )
                    
                    stats["files"] += 1
                    stats["chunks"] += len(documents)
                    print(f"✓ {file_path.name} ({len(documents)} chunks)")
                    
            except Exception as e:
                stats["errors"] += 1
                print(f"✗ {file_path.name}: {e}")
        
        return stats
    
    def search(
        self, 
        query: str, 
        n_results: int = 5,
        where: Dict = None
    ) -> List[Dict]:
        """Rechercher dans l'index"""
        query_embedding = self.get_embedding(query)
        
        results = self.collection.query(
            query_embeddings=[query_embedding],
            n_results=n_results,
            where=where,
            include=["documents", "metadatas", "distances"]
        )
        
        documents = []
        for i in range(len(results["ids"][0])):
            documents.append({
                "id": results["ids"][0][i],
                "content": results["documents"][0][i],
                "metadata": results["metadatas"][0][i],
                "distance": results["distances"][0][i],
                "relevance": 1 - results["distances"][0][i]  # Cosine similarity
            })
        
        return documents


if __name__ == "__main__":
    import sys
    
    vault_path = os.environ.get("VAULT_PATH", "/vault")
    indexer = ObsidianIndexer(vault_path=vault_path)
    
    force = "--force" in sys.argv
    stats = indexer.index_vault(force=force)
    
    print(f"\n✅ Indexation terminée:")
    print(f"   - Fichiers traités: {stats['files']}")
    print(f"   - Chunks créés: {stats['chunks']}")
    print(f"   - Erreurs: {stats['errors']}")
```

### 4.2 Lancer l'indexation

```bash
# Indexer le vault
docker compose exec rag-api python indexer.py

# Forcer la réindexation complète
docker compose exec rag-api python indexer.py --force
```

---

## 5. API de recherche

### 5.1 Fichier : `app/rag.py`

```python
"""
Logique RAG : Retrieval + Generation
"""
from typing import List, Dict, Optional
import httpx
from indexer import ObsidianIndexer

class RAGEngine:
    def __init__(
        self,
        indexer: ObsidianIndexer,
        ollama_url: str = "http://ollama:11434",
        llm_model: str = "llama3.2"
    ):
        self.indexer = indexer
        self.ollama_url = ollama_url
        self.llm_model = llm_model
    
    def retrieve(
        self, 
        query: str, 
        k: int = 5,
        filter_tags: Optional[List[str]] = None
    ) -> List[Dict]:
        """Récupérer les documents pertinents"""
        where = None
        if filter_tags:
            # Filtrer par tags (ChromaDB where clause)
            where = {"tags": {"$contains": filter_tags[0]}}
        
        return self.indexer.search(query, n_results=k, where=where)
    
    def format_context(self, documents: List[Dict]) -> str:
        """Formater les documents en contexte"""
        context_parts = []
        
        for i, doc in enumerate(documents, 1):
            source = doc["metadata"]["source"]
            title = doc["metadata"]["title"]
            relevance = doc["relevance"]
            
            context_parts.append(
                f"[Source {i}: {title} ({source}) - Pertinence: {relevance:.0%}]\n"
                f"{doc['content']}\n"
            )
        
        return "\n---\n".join(context_parts)
    
    def generate(
        self,
        query: str,
        context: str,
        system_prompt: Optional[str] = None
    ) -> str:
        """Générer une réponse avec Ollama"""
        if not system_prompt:
            system_prompt = """Tu es un assistant qui répond aux questions en te basant UNIQUEMENT sur le contexte fourni.

Règles :
1. Utilise UNIQUEMENT les informations du contexte
2. Si l'information n'est pas dans le contexte, dis-le clairement
3. Cite tes sources entre parenthèses (ex: "selon Source 1...")
4. Sois concis et précis
5. Réponds en français"""

        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": f"""Contexte :
{context}

---

Question : {query}

Réponds en te basant sur le contexte ci-dessus."""}
        ]
        
        response = httpx.post(
            f"{self.ollama_url}/api/chat",
            json={
                "model": self.llm_model,
                "messages": messages,
                "stream": False,
                "options": {
                    "temperature": 0.3,
                    "num_predict": 1000
                }
            },
            timeout=120.0
        )
        response.raise_for_status()
        
        return response.json()["message"]["content"]
    
    def query(
        self,
        question: str,
        k: int = 5,
        filter_tags: Optional[List[str]] = None,
        system_prompt: Optional[str] = None
    ) -> Dict:
        """Pipeline RAG complet"""
        # 1. Retrieve
        documents = self.retrieve(question, k=k, filter_tags=filter_tags)
        
        if not documents:
            return {
                "answer": "Je n'ai pas trouvé d'informations pertinentes dans la base de connaissances.",
                "sources": [],
                "context_used": ""
            }
        
        # 2. Format context
        context = self.format_context(documents)
        
        # 3. Generate
        answer = self.generate(question, context, system_prompt)
        
        # 4. Format response
        sources = [
            {
                "title": doc["metadata"]["title"],
                "source": doc["metadata"]["source"],
                "relevance": doc["relevance"],
                "excerpt": doc["content"][:200] + "..."
            }
            for doc in documents
        ]
        
        return {
            "answer": answer,
            "sources": sources,
            "context_used": context
        }
```

### 5.2 Fichier : `app/main.py`

```python
"""
API FastAPI pour le RAG Obsidian
"""
import os
from typing import List, Optional
from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from indexer import ObsidianIndexer
from rag import RAGEngine

# Configuration
VAULT_PATH = os.environ.get("VAULT_PATH", "/vault")
OLLAMA_URL = os.environ.get("OLLAMA_URL", "http://ollama:11434")
CHROMA_HOST = os.environ.get("CHROMA_HOST", "chromadb")
CHROMA_PORT = int(os.environ.get("CHROMA_PORT", 8000))
EMBEDDING_MODEL = os.environ.get("EMBEDDING_MODEL", "nomic-embed-text")
LLM_MODEL = os.environ.get("LLM_MODEL", "llama3.2")

# Initialisation
app = FastAPI(
    title="Obsidian RAG API",
    description="API de Retrieval-Augmented Generation basée sur un vault Obsidian",
    version="1.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Instances globales
indexer = ObsidianIndexer(
    vault_path=VAULT_PATH,
    chroma_host=CHROMA_HOST,
    chroma_port=CHROMA_PORT,
    ollama_url=OLLAMA_URL,
    embedding_model=EMBEDDING_MODEL
)

rag = RAGEngine(
    indexer=indexer,
    ollama_url=OLLAMA_URL,
    llm_model=LLM_MODEL
)

# Modèles Pydantic
class SearchRequest(BaseModel):
    query: str
    k: int = 5
    tags: Optional[List[str]] = None

class ChatRequest(BaseModel):
    question: str
    k: int = 5
    tags: Optional[List[str]] = None
    system_prompt: Optional[str] = None

class SearchResult(BaseModel):
    content: str
    source: str
    title: str
    relevance: float

class ChatResponse(BaseModel):
    answer: str
    sources: List[dict]

class IndexStats(BaseModel):
    files: int
    chunks: int
    errors: int

# Routes
@app.get("/health")
async def health():
    """Health check"""
    return {"status": "healthy", "vault": VAULT_PATH}

@app.get("/stats")
async def get_stats():
    """Statistiques de l'index"""
    collection = indexer.collection
    return {
        "total_documents": collection.count(),
        "vault_path": VAULT_PATH,
        "embedding_model": EMBEDDING_MODEL,
        "llm_model": LLM_MODEL
    }

@app.post("/search", response_model=List[SearchResult])
async def search(request: SearchRequest):
    """Recherche vectorielle simple"""
    try:
        results = indexer.search(
            query=request.query,
            n_results=request.k
        )
        
        return [
            SearchResult(
                content=r["content"],
                source=r["metadata"]["source"],
                title=r["metadata"]["title"],
                relevance=r["relevance"]
            )
            for r in results
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """Chat avec RAG"""
    try:
        result = rag.query(
            question=request.question,
            k=request.k,
            filter_tags=request.tags,
            system_prompt=request.system_prompt
        )
        
        return ChatResponse(
            answer=result["answer"],
            sources=result["sources"]
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/reindex", response_model=IndexStats)
async def reindex(background_tasks: BackgroundTasks, force: bool = False):
    """Réindexer le vault"""
    try:
        stats = indexer.index_vault(force=force)
        return IndexStats(**stats)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/notes")
async def list_notes(folder: Optional[str] = None, limit: int = 50):
    """Lister les notes indexées"""
    collection = indexer.collection
    
    where = None
    if folder:
        where = {"folder": folder}
    
    # Récupérer les métadonnées uniques
    results = collection.get(
        where=where,
        limit=limit,
        include=["metadatas"]
    )
    
    # Dédupliquer par source
    notes = {}
    for meta in results["metadatas"]:
        source = meta["source"]
        if source not in notes:
            notes[source] = {
                "source": source,
                "title": meta["title"],
                "folder": meta["folder"],
                "tags": meta["tags"].split(",") if meta["tags"] else []
            }
    
    return list(notes.values())


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
```

### 5.3 Tester l'API

```bash
# Health check
curl http://localhost:8000/health

# Stats
curl http://localhost:8000/stats

# Recherche simple
curl -X POST http://localhost:8000/search \
  -H "Content-Type: application/json" \
  -d '{"query": "comment configurer Docker", "k": 3}'

# Chat RAG
curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{"question": "Quelles sont les bonnes pratiques Docker ?"}'

# Réindexer
curl -X POST http://localhost:8000/reindex?force=true
```

---

## 6. Intégration avec n8n

### 6.1 Workflow : Chat RAG via webhook

```
[Webhook] → [HTTP Request to RAG API] → [Format Response] → [Respond to Webhook]
```

**Nœud HTTP Request** :

```json
{
  "method": "POST",
  "url": "http://rag-api:8000/chat",
  "body": {
    "question": "={{ $json.question }}",
    "k": 5
  }
}
```

### 6.2 Workflow : Discord bot avec RAG

```
[Discord Trigger] → [Filter !ask] → [RAG Query] → [Format] → [Discord Reply]
```

**Nœud RAG Query (Code)** :

```javascript
const question = $input.first().json.content.replace('!ask ', '');

const response = await this.helpers.httpRequest({
  method: 'POST',
  url: 'http://rag-api:8000/chat',
  body: {
    question: question,
    k: 3
  },
  json: true
});

// Formater pour Discord (max 2000 chars)
let answer = response.answer;
if (answer.length > 1800) {
  answer = answer.substring(0, 1800) + '...';
}

// Ajouter les sources
const sources = response.sources
  .map(s => `• ${s.title}`)
  .join('\n');

return [{
  json: {
    reply: `${answer}\n\n**Sources:**\n${sources}`
  }
}];
```

---

## 7. Interface de chat

### 7.1 Interface web simple

Fichier : `app/static/index.html`

```html
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Obsidian RAG Chat</title>
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
            font-family: system-ui, sans-serif;
            background: #1a1a2e;
            color: #eee;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            padding: 2rem;
            flex: 1;
            display: flex;
            flex-direction: column;
        }
        h1 {
            color: #10b981;
            margin-bottom: 1rem;
        }
        .chat {
            flex: 1;
            overflow-y: auto;
            padding: 1rem;
            background: #16213e;
            border-radius: 8px;
            margin-bottom: 1rem;
        }
        .message {
            margin-bottom: 1rem;
            padding: 1rem;
            border-radius: 8px;
        }
        .message.user {
            background: #0f3460;
            margin-left: 20%;
        }
        .message.assistant {
            background: #1a1a2e;
            margin-right: 20%;
            border: 1px solid #10b981;
        }
        .sources {
            margin-top: 0.5rem;
            padding-top: 0.5rem;
            border-top: 1px solid #333;
            font-size: 0.85rem;
            color: #888;
        }
        .input-area {
            display: flex;
            gap: 0.5rem;
        }
        input {
            flex: 1;
            padding: 1rem;
            border: none;
            border-radius: 8px;
            background: #16213e;
            color: #eee;
            font-size: 1rem;
        }
        button {
            padding: 1rem 2rem;
            background: #10b981;
            color: #1a1a2e;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-weight: bold;
        }
        button:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }
        .loading {
            color: #10b981;
            font-style: italic;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🧠 Obsidian RAG Chat</h1>
        <div class="chat" id="chat"></div>
        <div class="input-area">
            <input type="text" id="question" placeholder="Posez votre question..." />
            <button id="send" onclick="sendMessage()">Envoyer</button>
        </div>
    </div>
    
    <script>
        const chat = document.getElementById('chat');
        const input = document.getElementById('question');
        const btn = document.getElementById('send');
        
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendMessage();
        });
        
        async function sendMessage() {
            const question = input.value.trim();
            if (!question) return;
            
            // Afficher la question
            addMessage(question, 'user');
            input.value = '';
            btn.disabled = true;
            
            // Loading
            const loadingId = addMessage('Recherche en cours...', 'assistant loading');
            
            try {
                const response = await fetch('/chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ question, k: 5 })
                });
                
                const data = await response.json();
                
                // Remplacer le loading
                document.getElementById(loadingId).remove();
                
                // Afficher la réponse
                const sources = data.sources
                    .map(s => `• ${s.title} (${Math.round(s.relevance * 100)}%)`)
                    .join('<br>');
                
                addMessage(
                    data.answer + `<div class="sources"><strong>Sources:</strong><br>${sources}</div>`,
                    'assistant'
                );
                
            } catch (error) {
                document.getElementById(loadingId).remove();
                addMessage('Erreur: ' + error.message, 'assistant');
            }
            
            btn.disabled = false;
        }
        
        function addMessage(content, type) {
            const id = 'msg-' + Date.now();
            const div = document.createElement('div');
            div.id = id;
            div.className = 'message ' + type;
            div.innerHTML = content;
            chat.appendChild(div);
            chat.scrollTop = chat.scrollHeight;
            return id;
        }
    </script>
</body>
</html>
```

Ajouter dans `main.py` :

```python
from fastapi.staticfiles import StaticFiles

# Après la création de l'app
app.mount("/static", StaticFiles(directory="static"), name="static")

@app.get("/")
async def root():
    return FileResponse("static/index.html")
```

---

## 8. Optimisations

### 8.1 Chunking intelligent

```python
def smart_chunk(self, content: str, max_tokens: int = 500) -> List[str]:
    """Chunking par sections Markdown"""
    chunks = []
    current_chunk = []
    current_size = 0
    
    # Séparer par headers
    sections = re.split(r'\n(#{1,3} )', content)
    
    for section in sections:
        words = section.split()
        
        if current_size + len(words) > max_tokens:
            if current_chunk:
                chunks.append(' '.join(current_chunk))
            current_chunk = words
            current_size = len(words)
        else:
            current_chunk.extend(words)
            current_size += len(words)
    
    if current_chunk:
        chunks.append(' '.join(current_chunk))
    
    return chunks
```

### 8.2 Cache des embeddings

```python
import hashlib
import json
from pathlib import Path

CACHE_DIR = Path("/tmp/embedding_cache")
CACHE_DIR.mkdir(exist_ok=True)

def get_cached_embedding(self, text: str) -> List[float]:
    """Embedding avec cache"""
    cache_key = hashlib.md5(text.encode()).hexdigest()
    cache_file = CACHE_DIR / f"{cache_key}.json"
    
    if cache_file.exists():
        return json.loads(cache_file.read_text())
    
    embedding = self.get_embedding(text)
    cache_file.write_text(json.dumps(embedding))
    
    return embedding
```

### 8.3 Indexation incrémentale

```bash
# Watcher pour réindexer automatiquement
docker compose exec rag-api python -c "
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
import time

class VaultHandler(FileSystemEventHandler):
    def on_modified(self, event):
        if event.src_path.endswith('.md'):
            print(f'Réindexation: {event.src_path}')
            # Appeler l'API de réindexation

observer = Observer()
observer.schedule(VaultHandler(), '/vault', recursive=True)
observer.start()

try:
    while True:
        time.sleep(1)
except KeyboardInterrupt:
    observer.stop()
observer.join()
"
```

---

## Récapitulatif

```bash
# Installation
mkdir obsidian-rag && cd obsidian-rag
# Créer docker-compose.yml, .env, app/...

# Démarrer
docker compose up -d

# Télécharger les modèles
docker exec ollama-rag ollama pull nomic-embed-text
docker exec ollama-rag ollama pull llama3.2

# Indexer le vault
docker compose exec rag-api python indexer.py

# Tester
curl http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{"question": "Mon sujet de recherche"}'

# Interface web
open http://localhost:8000
```

---

## Ressources

- [ChromaDB Documentation](https://docs.trychroma.com/)
- [Ollama Embeddings](https://ollama.ai/blog/embedding-models)
- [FastAPI](https://fastapi.tiangolo.com/)
- [Obsidian API](https://docs.obsidian.md/)

---

**Auteur** : GL Digital Lab  
**Licence** : MIT  
**Dernière mise à jour** : Janvier 2026
