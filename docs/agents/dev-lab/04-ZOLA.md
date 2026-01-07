# 🗄️ Z.O.L.A. - Data Architecture

> **Zero-latency Optimized Layer for Archives**  
> *Sous-sol 4 - Le Bunker*

---

## 📋 Fiche Agent

| Propriété | Valeur |
|-----------|--------|
| **Nom complet** | Z.O.L.A. |
| **Niveau** | Sous-sol 4 (Le Bunker) |
| **Rôle** | Data Architecture |
| **Status** | 🟢 ONLINE |
| **Couleur** | `#F59E0B` (Ambre) |
| **Icône** | 🗄️ |

---

## 🎯 Mission

ZOLA est l'agent responsable de toute l'architecture de données. Il gère :
- Design des schémas de base de données
- Optimisation des requêtes
- Migrations et versioning
- Cache et performance
- Backups et réplication
- Intégration RAG (ChromaDB)

---

## 🛠️ Stack Technique

```yaml
Databases:
  - PostgreSQL 16
  - Redis 7 (cache/sessions/queues)
  - ChromaDB (embeddings/RAG)
  
ORM & Migrations:
  - Doctrine ORM
  - Doctrine Migrations
  
Performance:
  - pg_stat_statements
  - Redis Insights
  - pgBadger (logs analysis)
  
Backup & Recovery:
  - pg_dump / pg_restore
  - WAL archiving
  - Point-in-time recovery
  
Monitoring:
  - pgAdmin 4
  - RedisInsight
  - Prometheus exporters
```

---

## 📁 Structure de Travail

```
database/
├── migrations/           # Doctrine migrations
├── fixtures/             # Données de test
├── scripts/
│   ├── backup.sh         # Script backup
│   ├── restore.sh        # Script restore
│   └── optimize.sh       # Vacuum & analyze
├── schemas/
│   └── erd.dbml          # Entity Relationship Diagram
└── seeds/
    └── production.sql    # Données initiales
```

---

## 🔄 Workflows n8n

### 1. Backup Automatique

Backup quotidien de toutes les bases.

```json
{
  "name": "ZOLA - Daily Backup",
  "trigger": "Cron every day at 03:00",
  "nodes": [
    {
      "type": "cron",
      "expression": "0 3 * * *"
    },
    {
      "type": "execute",
      "command": "pg_dump -Fc -f /backups/gl_$(date +%Y%m%d).dump gl_database"
    },
    {
      "type": "execute",
      "command": "redis-cli BGSAVE"
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
      "command": "find /backups -mtime +7 -delete"
    },
    {
      "type": "discord",
      "channel": "#ops",
      "message": "🗄️ ZOLA: Backup quotidien terminé - {{$json.size}}MB"
    }
  ]
}
```

### 2. Query Optimizer

Analyse et optimise les requêtes lentes.

```json
{
  "name": "ZOLA - Query Optimizer",
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
      "message": "🗄️ ZOLA: {{$json.slowQueries}} requêtes lentes détectées. Optimisations suggérées."
    }
  ]
}
```

### 3. Migration Manager

Gère les migrations de schéma.

```json
{
  "name": "ZOLA - Migration Manager",
  "trigger": "Webhook POST /zola/migrate",
  "nodes": [
    {
      "type": "webhook",
      "path": "/zola/migrate"
    },
    {
      "type": "execute",
      "command": "pg_dump -s > /backups/schema_before_$(date +%Y%m%d%H%M).sql"
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
      "message": "🗄️ ZOLA: Migration {{$json.version}} - {{$json.status}}"
    }
  ]
}
```

### 4. ChromaDB Indexer

Indexe les documents pour le RAG.

```json
{
  "name": "ZOLA - RAG Indexer",
  "trigger": "Webhook POST /zola/index",
  "nodes": [
    {
      "type": "webhook",
      "path": "/zola/index"
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
      "message": "🗄️ ZOLA: {{$json.documentsIndexed}} documents indexés dans ChromaDB"
    }
  ]
}
```

---

## 📊 Métriques

| Métrique | Objectif | Actuel |
|----------|----------|--------|
| Query Response Time (p95) | < 50ms | 32ms |
| Cache Hit Rate | > 90% | 94% |
| Database Size | < 10GB | 2.3GB |
| Backup Success Rate | 100% | 100% |
| Replication Lag | < 1s | 0.2s |
| Index Usage | > 95% | 97% |

---

## 🔗 Interactions avec autres agents

```
ZOLA ←→ JOCASTA   : Fournit le schéma et les requêtes
ZOLA ←→ FRIDAY    : Fournit les embeddings RAG
ZOLA ←→ ULTRON    : Envoie les métriques DB
ZOLA ←→ EDITH     : Backup encryption keys
ZOLA ←→ VERONICA  : Migrations en déploiement
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
  embedding vector(1536)
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

-- Vector similarity (pgvector)
CREATE INDEX idx_documents_embedding ON documents 
  USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 100);
```

---

## 🔧 Scripts de Maintenance

### backup.sh

```bash
#!/bin/bash
# ZOLA Backup Script

set -e

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR=/backups/postgres
RETENTION_DAYS=7

echo "🗄️ ZOLA: Starting backup..."

# PostgreSQL backup
pg_dump -Fc -f "$BACKUP_DIR/gl_$DATE.dump" "$DATABASE_URL"

# Redis backup
redis-cli -h redis BGSAVE
sleep 5
cp /data/redis/dump.rdb "$BACKUP_DIR/redis_$DATE.rdb"

# Compress
gzip "$BACKUP_DIR/gl_$DATE.dump"
gzip "$BACKUP_DIR/redis_$DATE.rdb"

# Cleanup old backups
find "$BACKUP_DIR" -name "*.gz" -mtime +$RETENTION_DAYS -delete

echo "✅ ZOLA: Backup complete - gl_$DATE.dump.gz"
```

### optimize.sh

```bash
#!/bin/bash
# ZOLA Optimization Script

echo "🗄️ ZOLA: Starting optimization..."

# Vacuum analyze all tables
psql "$DATABASE_URL" -c "VACUUM ANALYZE;"

# Reindex
psql "$DATABASE_URL" -c "REINDEX DATABASE gl_database;"

# Update statistics
psql "$DATABASE_URL" -c "ANALYZE VERBOSE;"

# Clear Redis expired keys
redis-cli -h redis --scan --pattern '*' | head -1000 | xargs -r redis-cli -h redis DEL

echo "✅ ZOLA: Optimization complete"
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
redis-cli INFO
redis-cli MONITOR
redis-cli FLUSHDB

# ChromaDB
curl http://localhost:8000/api/v1/collections
```

---

*ZOLA v1.0 | GL Tower Dev Lab*
