# 📊 Dou — Monitoring, Veille & Alertes (動)

> **Loi Dou — 動 | Mouvement** — Codename : **WATCHER**  
> Loi n° 5 des 6 Lois ARKADIA — Équipage GL Digital Lab  
> Niveau : 3 | Étage : 3 | Status : ONLINE | Priorité : CRITIQUE  
> — *« Toujours avancer, itérer. L'immobilité est la mort. »*

## 📋 Mission

Dou surveille **24/7 l'infrastructure** GL Digital Lab. Il collecte les métriques, détecte les anomalies et alerte **graduellement** avant que les problèmes n'impactent les utilisateurs. Sa mission est la **visibilité totale et la vigilance permanente** : rien ne doit rester invisible, rien ne doit stagner.

### Responsabilités

- 📡 **Surveiller 24/7** : métriques temps réel (CPU, RAM, disque, réseau), état des services
- 📈 **Analyser les tendances** : métriques temps réel, évolutions, capacités
- 🔬 **Détecter les anomalies** : seuils, dérives, pics, comportements inhabituels
- 🚨 **Alerter graduellement** : sévérité warning → critical, escalade vers Wa (coordinateur)
- 📊 **Dashboards** : visualisation Grafana
- 📝 **Logs centralisés** : agrégation et recherche (Loki)
- 🔍 **Veille technique** : flux, versions, écosystème, pour toujours itérer

> **Principe directeur** : toute alerte remonte à **Wa** (`wa-n8n`), coordinateur de l'équipage ARKADIA, qui orchestre la réponse (notifications Discord, escalade, actions correctives via les workflows d'équipage).

---

## 🛠️ Stack Technique

| Composant | Technologie | Rôle |
|-----------|-------------|------|
| Métriques | **Prometheus** | Collecte et stockage |
| Logs | **Loki** | Agrégation de logs |
| Collecteur logs | **Promtail** | Scraping et envoi des logs vers Loki |
| Visualisation | **Grafana** | Dashboards |
| Alerting | **Alertmanager** | Gestion des alertes |
| Métriques système | **Node Exporter** | Métriques hôte (CPU, RAM, disque) |
| Métriques conteneurs | **cAdvisor** | Métriques Docker |
| Workflows | **n8n** | Workflows d'alerte et de veille |

---

## 📦 Installation

### 1. Structure des dossiers

```bash
mkdir -p ~/gl-tower/dou/{prometheus,grafana,alertmanager,loki}
mkdir -p ~/gl-tower/dou/grafana/dashboards
cd ~/gl-tower/dou
```

### 2. Docker Compose

```yaml
# docker-compose.yml
version: '3.8'

services:
  # Prometheus - Collecte métriques
  prometheus:
    image: prom/prometheus:latest
    container_name: dou-prometheus
    restart: unless-stopped
    ports:
      - "9090:9090"
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
      - '--storage.tsdb.path=/prometheus'
      - '--storage.tsdb.retention.time=30d'
      - '--web.enable-lifecycle'
    volumes:
      - ./prometheus/prometheus.yml:/etc/prometheus/prometheus.yml
      - ./prometheus/alerts:/etc/prometheus/alerts
      - prometheus-data:/prometheus
    networks:
      - gl-tower

  # Grafana - Visualisation
  grafana:
    image: grafana/grafana:latest
    container_name: dou-grafana
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      - GF_SECURITY_ADMIN_USER=admin
      - GF_SECURITY_ADMIN_PASSWORD=${GRAFANA_PASSWORD}
      - GF_USERS_ALLOW_SIGN_UP=false
      - GF_SERVER_ROOT_URL=http://localhost:3000
    volumes:
      - grafana-data:/var/lib/grafana
    networks:
      - gl-tower
    depends_on:
      - prometheus

  # Alertmanager - Gestion alertes
  alertmanager:
    image: prom/alertmanager:latest
    container_name: dou-alertmanager
    restart: unless-stopped
    ports:
      - "9093:9093"
    volumes:
      - ./alertmanager/alertmanager.yml:/etc/alertmanager/alertmanager.yml
      - alertmanager-data:/alertmanager
    networks:
      - gl-tower

  # Loki - Logs
  loki:
    image: grafana/loki:latest
    container_name: dou-loki
    restart: unless-stopped
    ports:
      - "3100:3100"
    volumes:
      - ./loki/loki-config.yml:/etc/loki/local-config.yaml
      - loki-data:/loki
    networks:
      - gl-tower

  # Promtail - Collecteur logs
  promtail:
    image: grafana/promtail:latest
    container_name: dou-promtail
    restart: unless-stopped
    volumes:
      - ./loki/promtail-config.yml:/etc/promtail/config.yml
      - /var/log:/var/log:ro
      - /var/lib/docker/containers:/var/lib/docker/containers:ro
    networks:
      - gl-tower
    depends_on:
      - loki

  # Node Exporter - Métriques système
  node-exporter:
    image: prom/node-exporter:latest
    container_name: dou-node-exporter
    restart: unless-stopped
    ports:
      - "9100:9100"
    volumes:
      - /proc:/host/proc:ro
      - /sys:/host/sys:ro
      - /:/rootfs:ro
    command:
      - '--path.procfs=/host/proc'
      - '--path.sysfs=/host/sys'
      - '--path.rootfs=/rootfs'
      - '--collector.filesystem.mount-points-exclude=^/(sys|proc|dev|host|etc)($$|/)'
    networks:
      - gl-tower

  # cAdvisor - Métriques Docker
  cadvisor:
    image: gcr.io/cadvisor/cadvisor:latest
    container_name: dou-cadvisor
    restart: unless-stopped
    ports:
      - "8080:8080"
    volumes:
      - /:/rootfs:ro
      - /var/run:/var/run:ro
      - /sys:/sys:ro
      - /var/lib/docker/:/var/lib/docker:ro
    networks:
      - gl-tower

volumes:
  prometheus-data:
  grafana-data:
  alertmanager-data:
  loki-data:

networks:
  gl-tower:
    external: true
```

### 3. Configuration Prometheus

```yaml
# prometheus/prometheus.yml
global:
  scrape_interval: 15s
  evaluation_interval: 15s
  external_labels:
    monitor: 'gl-tower'

alerting:
  alertmanagers:
    - static_configs:
        - targets: ['dou-alertmanager:9093']

rule_files:
  - '/etc/prometheus/alerts/*.yml'

scrape_configs:
  # Prometheus self-monitoring
  - job_name: 'prometheus'
    static_configs:
      - targets: ['localhost:9090']

  # Node Exporter - Métriques système
  - job_name: 'node'
    static_configs:
      - targets: ['dou-node-exporter:9100']
    relabel_configs:
      - source_labels: [__address__]
        target_label: instance
        replacement: 'gl-tower-main'

  # cAdvisor - Métriques Docker
  - job_name: 'cadvisor'
    static_configs:
      - targets: ['dou-cadvisor:8080']

  # Équipage ARKADIA — GL Tower
  - job_name: 'wa'
    static_configs:
      - targets: ['wa-n8n:5678']
    metrics_path: '/metrics'

  - job_name: 'watashi'
    static_configs:
      - targets: ['watashi-webui:8080']

  # Applications
  - job_name: 'portfolio'
    static_configs:
      - targets: ['portfolio:80']
    metrics_path: '/metrics'

  - job_name: 'arkadia-api'
    static_configs:
      - targets: ['arkadia-api:8000']
```

### 4. Règles d'alerte

```yaml
# prometheus/alerts/system.yml
groups:
  - name: system_alerts
    rules:
      # CPU élevé
      - alert: HighCPUUsage
        expr: 100 - (avg by(instance) (irate(node_cpu_seconds_total{mode="idle"}[5m])) * 100) > 80
        for: 5m
        labels:
          severity: warning
          agent: dou
        annotations:
          summary: "CPU élevé sur {{ $labels.instance }}"
          description: "CPU à {{ $value }}% depuis 5 minutes"

      # Mémoire critique
      - alert: HighMemoryUsage
        expr: (1 - (node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes)) * 100 > 90
        for: 5m
        labels:
          severity: critical
          agent: dou
        annotations:
          summary: "Mémoire critique sur {{ $labels.instance }}"
          description: "RAM à {{ $value }}%"

      # Disque plein
      - alert: DiskSpaceLow
        expr: (1 - (node_filesystem_avail_bytes{fstype!="tmpfs"} / node_filesystem_size_bytes{fstype!="tmpfs"})) * 100 > 85
        for: 10m
        labels:
          severity: warning
          agent: dou
        annotations:
          summary: "Espace disque faible"
          description: "{{ $labels.mountpoint }} à {{ $value }}%"

      # Service down
      - alert: ServiceDown
        expr: up == 0
        for: 1m
        labels:
          severity: critical
          agent: dou
        annotations:
          summary: "Service {{ $labels.job }} DOWN"
          description: "Le service {{ $labels.instance }} ne répond plus"

  - name: docker_alerts
    rules:
      # Container restart
      - alert: ContainerRestarting
        expr: increase(container_restart_count[1h]) > 3
        for: 5m
        labels:
          severity: warning
          agent: dou
        annotations:
          summary: "Container {{ $labels.name }} en restart loop"
          description: "{{ $value }} restarts dans la dernière heure"

      # Container OOM
      - alert: ContainerOOM
        expr: container_memory_usage_bytes / container_spec_memory_limit_bytes > 0.9
        for: 5m
        labels:
          severity: critical
          agent: dou
        annotations:
          summary: "Container {{ $labels.name }} proche OOM"
          description: "Mémoire à {{ $value | humanizePercentage }}"

  - name: application_alerts
    rules:
      # Latence API
      - alert: HighAPILatency
        expr: histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m])) > 2
        for: 5m
        labels:
          severity: warning
          agent: dou
        annotations:
          summary: "Latence API élevée"
          description: "P95 à {{ $value }}s"

      # Erreurs HTTP
      - alert: HighErrorRate
        expr: sum(rate(http_requests_total{status=~"5.."}[5m])) / sum(rate(http_requests_total[5m])) > 0.05
        for: 5m
        labels:
          severity: critical
          agent: dou
        annotations:
          summary: "Taux d'erreurs HTTP élevé"
          description: "{{ $value | humanizePercentage }} d'erreurs 5xx"
```

### 5. Configuration Alertmanager

```yaml
# alertmanager/alertmanager.yml
global:
  resolve_timeout: 5m

route:
  group_by: ['alertname', 'severity']
  group_wait: 30s
  group_interval: 5m
  repeat_interval: 4h
  receiver: 'default'
  routes:
    - match:
        severity: critical
      receiver: 'critical-alerts'
      repeat_interval: 1h
    - match:
        severity: warning
      receiver: 'warning-alerts'
      repeat_interval: 4h

receivers:
  - name: 'default'
    webhook_configs:
      - url: 'http://wa-n8n:5678/webhook/dou/alert'
        send_resolved: true

  - name: 'critical-alerts'
    webhook_configs:
      - url: 'http://wa-n8n:5678/webhook/dou/critical'
        send_resolved: true
    discord_configs:
      - webhook_url: '${DISCORD_CRITICAL_WEBHOOK}'
        title: '🚨 ALERTE CRITIQUE - DOU'
        message: '{{ range .Alerts }}{{ .Annotations.summary }}{{ end }}'

  - name: 'warning-alerts'
    webhook_configs:
      - url: 'http://wa-n8n:5678/webhook/dou/warning'
        send_resolved: true

inhibit_rules:
  - source_match:
      severity: 'critical'
    target_match:
      severity: 'warning'
    equal: ['alertname', 'instance']
```

### 6. Configuration Loki

```yaml
# loki/loki-config.yml
auth_enabled: false

server:
  http_listen_port: 3100

ingester:
  lifecycler:
    address: 127.0.0.1
    ring:
      kvstore:
        store: inmemory
      replication_factor: 1
    final_sleep: 0s
  chunk_idle_period: 5m
  chunk_retain_period: 30s

schema_config:
  configs:
    - from: 2024-01-01
      store: boltdb-shipper
      object_store: filesystem
      schema: v11
      index:
        prefix: index_
        period: 24h

storage_config:
  boltdb_shipper:
    active_index_directory: /loki/index
    cache_location: /loki/cache
    shared_store: filesystem
  filesystem:
    directory: /loki/chunks

limits_config:
  enforce_metric_name: false
  reject_old_samples: true
  reject_old_samples_max_age: 168h

chunk_store_config:
  max_look_back_period: 0s

table_manager:
  retention_deletes_enabled: true
  retention_period: 720h
```

### 7. Configuration Promtail

```yaml
# loki/promtail-config.yml
server:
  http_listen_port: 9080
  grpc_listen_port: 0

positions:
  filename: /tmp/positions.yaml

clients:
  - url: http://dou-loki:3100/loki/api/v1/push

scrape_configs:
  # Logs Docker containers
  - job_name: docker
    docker_sd_configs:
      - host: unix:///var/run/docker.sock
        refresh_interval: 5s
    relabel_configs:
      - source_labels: ['__meta_docker_container_name']
        target_label: 'container'
        regex: '/(.+)'
      - source_labels: ['__meta_docker_container_label_com_docker_compose_service']
        target_label: 'service'

  # Logs système
  - job_name: system
    static_configs:
      - targets:
          - localhost
        labels:
          job: syslog
          __path__: /var/log/syslog

  # Logs nginx
  - job_name: nginx
    static_configs:
      - targets:
          - localhost
        labels:
          job: nginx
          __path__: /var/log/nginx/*.log
    pipeline_stages:
      - regex:
          expression: '^(?P<remote_addr>[\d\.]+) - (?P<remote_user>\S+) \[(?P<time_local>[^\]]+)\] "(?P<request>[^"]+)" (?P<status>\d+) (?P<body_bytes_sent>\d+)'
      - labels:
          status:
          remote_addr:
```

### 8. Configuration initiale Grafana (datasources & dashboard)

Une fois les conteneurs démarrés (`docker compose up -d`), enregistrer les datasources puis importer le dashboard via l'API Grafana :

```bash
# Enregistrer les datasources (Prometheus, Loki, Alertmanager)
curl -u admin:${GRAFANA_PASSWORD} -H 'Content-Type: application/json' \
  -X POST http://localhost:3000/api/datasources -d '{
    "name": "Prometheus", "type": "prometheus", "access": "proxy",
    "url": "http://dou-prometheus:9090", "isDefault": true, "editable": false
  }'

curl -u admin:${GRAFANA_PASSWORD} -H 'Content-Type: application/json' \
  -X POST http://localhost:3000/api/datasources -d '{
    "name": "Loki", "type": "loki", "access": "proxy",
    "url": "http://dou-loki:3100", "editable": false
  }'

curl -u admin:${GRAFANA_PASSWORD} -H 'Content-Type: application/json' \
  -X POST http://localhost:3000/api/datasources -d '{
    "name": "Alertmanager", "type": "alertmanager", "access": "proxy",
    "url": "http://dou-alertmanager:9093", "editable": false
  }'

# Importer le dashboard (fichier grafana/dashboards/gl-tower-overview.json)
curl -u admin:${GRAFANA_PASSWORD} -H 'Content-Type: application/json' \
  -X POST http://localhost:3000/api/dashboards/db \
  --data @grafana/dashboards/gl-tower-overview.json
```

### 9. Dashboard JSON (exemple)

```json
// grafana/dashboards/gl-tower-overview.json
{
  "dashboard": {
    "title": "GL Tower - Overview",
    "uid": "gl-tower-main",
    "tags": ["gl-tower", "overview"],
    "timezone": "Europe/Paris",
    "panels": [
      {
        "title": "CPU Usage",
        "type": "gauge",
        "gridPos": { "x": 0, "y": 0, "w": 6, "h": 6 },
        "targets": [
          {
            "expr": "100 - (avg(irate(node_cpu_seconds_total{mode=\"idle\"}[5m])) * 100)",
            "legendFormat": "CPU %"
          }
        ],
        "fieldConfig": {
          "defaults": {
            "thresholds": {
              "steps": [
                { "value": 0, "color": "green" },
                { "value": 60, "color": "yellow" },
                { "value": 80, "color": "red" }
              ]
            },
            "unit": "percent",
            "max": 100
          }
        }
      },
      {
        "title": "Memory Usage",
        "type": "gauge",
        "gridPos": { "x": 6, "y": 0, "w": 6, "h": 6 },
        "targets": [
          {
            "expr": "(1 - (node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes)) * 100",
            "legendFormat": "RAM %"
          }
        ]
      },
      {
        "title": "Disk Usage",
        "type": "gauge",
        "gridPos": { "x": 12, "y": 0, "w": 6, "h": 6 },
        "targets": [
          {
            "expr": "(1 - (node_filesystem_avail_bytes{mountpoint=\"/\"} / node_filesystem_size_bytes{mountpoint=\"/\"})) * 100",
            "legendFormat": "Disk %"
          }
        ]
      },
      {
        "title": "Services Status",
        "type": "stat",
        "gridPos": { "x": 18, "y": 0, "w": 6, "h": 6 },
        "targets": [
          {
            "expr": "count(up == 1)",
            "legendFormat": "UP"
          }
        ]
      },
      {
        "title": "Container CPU",
        "type": "timeseries",
        "gridPos": { "x": 0, "y": 6, "w": 12, "h": 8 },
        "targets": [
          {
            "expr": "rate(container_cpu_usage_seconds_total{name!=\"\"}[5m]) * 100",
            "legendFormat": "{{ name }}"
          }
        ]
      },
      {
        "title": "Container Memory",
        "type": "timeseries",
        "gridPos": { "x": 12, "y": 6, "w": 12, "h": 8 },
        "targets": [
          {
            "expr": "container_memory_usage_bytes{name!=\"\"} / 1024 / 1024",
            "legendFormat": "{{ name }}"
          }
        ],
        "fieldConfig": {
          "defaults": { "unit": "decmbytes" }
        }
      },
      {
        "title": "Recent Logs",
        "type": "logs",
        "gridPos": { "x": 0, "y": 14, "w": 24, "h": 8 },
        "datasource": "Loki",
        "targets": [
          {
            "expr": "{job=~\".+\"} |~ \"error|warn|critical\"",
            "legendFormat": ""
          }
        ]
      }
    ]
  }
}
```

---

## 🔄 Workflows n8n

Les workflows officiels de Dou (source de vérité : `src/data/agents.js`) sont les suivants. Ils s'exécutent sur l'instance n8n de l'équipage (`wa-n8n`) ou pilotent ses propres collecteurs.

| Workflow | Description | Déclencheur | Fréquence | Statut |
|----------|-------------|-------------|-----------|--------|
| **Service Health Ping** | Ping les services (HTTP multi, vérifie statut et temps de réponse) | Cron 30s | 30 secondes | 🟢 active |
| **ARKADIA Servers Monitor** | Surveille les serveurs ARK via l'API Nitrado (état, joueurs) | Cron 5min | 5 minutes | 🟢 active |
| **Resource Usage Watch** | Surveille CPU/RAM/Disk ; avertit au-delà de 80 %, alerte critique au-delà de 95 % | Prometheus | 15 secondes | 🟢 active |
| **ML Anomaly Detection** | Détecte les anomalies par baseline et score Z | Continu | Continu | 🟢 active |
| **Traffic Spike Detector** | Détecte les pics de trafic à partir des logs nginx (compte le RPS, compare, déclenche la mise à l'échelle) | Logs nginx | Temps réel | 🟢 active |
| **Error Log Aggregator** | Agrège les erreurs depuis le flux Loki, regroupe, crée un ticket si nouveau | Flux Loki | Temps réel | 🟢 active |
| **Weekly Performance Report** | Rapport hebdomadaire des SLIs/SLOs (calcule, génère, envoie) | Cron dimanche | Hebdomadaire | 🟢 active |
| **Tech Watch** | Veille technologique : récupère les flux, filtre selon la stack, classe et envoie le digest | Cron hebdo | Hebdomadaire | 🟢 active |

### Exemple d'implémentation 1 : Alert Handler

Réception des alertes Alertmanager sur `wa-n8n`, mise en forme et notification, puis journalisation en base.

```json
{
  "name": "Dou - Alert Handler",
  "nodes": [
    {
      "name": "Webhook - Alert",
      "type": "n8n-nodes-base.webhook",
      "parameters": {
        "path": "dou/alert",
        "httpMethod": "POST"
      }
    },
    {
      "name": "Parse Alert",
      "type": "n8n-nodes-base.code",
      "parameters": {
        "jsCode": "const alerts = $input.first().json.alerts || [];\nconst formatted = alerts.map(a => ({\n  name: a.labels.alertname,\n  severity: a.labels.severity,\n  summary: a.annotations.summary,\n  description: a.annotations.description,\n  status: a.status,\n  startsAt: a.startsAt\n}));\nreturn formatted.map(f => ({ json: f }));"
      }
    },
    {
      "name": "Format Discord Message",
      "type": "n8n-nodes-base.code",
      "parameters": {
        "jsCode": "const alert = $input.first().json;\nconst emoji = alert.severity === 'critical' ? '🚨' : '⚠️';\nconst color = alert.status === 'resolved' ? '✅' : emoji;\n\nconst message = `${color} **Dou Alert**\\n\\n` +\n  `**${alert.name}** (${alert.severity})\\n` +\n  `${alert.summary}\\n\\n` +\n  `_${alert.description}_`;\n\nreturn [{ json: { message } }];"
      }
    },
    {
      "name": "Send to Discord",
      "type": "n8n-nodes-base.discord",
      "parameters": {
        "webhookUri": "={{ $env.DOU_WEBHOOK }}",
        "content": "={{ $json.message }}"
      }
    },
    {
      "name": "Log to DB",
      "type": "n8n-nodes-base.postgres",
      "parameters": {
        "query": "INSERT INTO alerts (name, severity, summary, status, created_at) VALUES ($1, $2, $3, $4, NOW())",
        "values": ["={{ $json.name }}", "={{ $json.severity }}", "={{ $json.summary }}", "={{ $json.status }}"]
      }
    }
  ]
}
```

### Exemple d'implémentation 2 : Weekly Performance Report

Interroge Prometheus et la table `alerts`, puis publie le rapport hebdomadaire (chaque dimanche à 08:00).

```json
{
  "name": "Dou - Weekly Performance Report",
  "nodes": [
    {
      "name": "Cron - Dim 8h",
      "type": "n8n-nodes-base.cron",
      "parameters": {
        "cronExpression": "0 8 * * 0"
      }
    },
    {
      "name": "Query Prometheus",
      "type": "n8n-nodes-base.httpRequest",
      "parameters": {
        "url": "http://dou-prometheus:9090/api/v1/query",
        "method": "GET",
        "qs": {
          "query": "up"
        }
      }
    },
    {
      "name": "Get Alerts Count",
      "type": "n8n-nodes-base.postgres",
      "parameters": {
        "query": "SELECT severity, COUNT(*) as count FROM alerts WHERE created_at > NOW() - INTERVAL '7 days' GROUP BY severity"
      }
    },
    {
      "name": "Format Report",
      "type": "n8n-nodes-base.code",
      "parameters": {
        "jsCode": "const services = $node['Query Prometheus'].json.data.result;\nconst alerts = $node['Get Alerts Count'].json;\n\nconst upCount = services.filter(s => s.value[1] === '1').length;\nconst totalCount = services.length;\n\nlet alertSummary = alerts.map(a => `${a.severity}: ${a.count}`).join(', ') || 'Aucune';\n\nconst report = `📊 **Dou Weekly Performance Report**\\n\\n` +\n  `**Services:** ${upCount}/${totalCount} UP\\n` +\n  `**Alertes (7 jours):** ${alertSummary}\\n\\n` +\n  `🔗 [Dashboard Grafana](http://localhost:3000)`;\n\nreturn [{ json: { report } }];"
      }
    },
    {
      "name": "Send Report",
      "type": "n8n-nodes-base.discord",
      "parameters": {
        "webhookUri": "={{ $env.DOU_WEBHOOK }}",
        "content": "={{ $json.report }}"
      }
    }
  ]
}
```

---

## 📊 Métriques clés et objectifs

Les valeurs ci-dessous sont des **objectifs de configuration** (seuils de règles d'alerte), pas des valeurs mesurées. La conformité réelle se mesure en continu via les requêtes PromQL indiquées.

| Métrique | Query PromQL | Objectif (seuil) |
|----------|--------------|------------------|
| CPU Usage | `100 - (avg(irate(node_cpu_seconds_total{mode="idle"}[5m])) * 100)` | < 80% |
| Memory Usage | `(1 - (node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes)) * 100` | < 90% |
| Disk Usage | `(1 - (node_filesystem_avail_bytes / node_filesystem_size_bytes)) * 100` | < 85% |
| Service Uptime (SLO) | `avg_over_time(up[24h]) * 100` | > 99.9% |
| Error Rate | `sum(rate(http_requests_total{status=~"5.."}[5m])) / sum(rate(http_requests_total[5m]))` | < 1% |

---

## 🔧 Maintenance

### Backup Prometheus

```bash
#!/bin/bash
# dou-backup-prometheus.sh
BACKUP_DIR=~/backups/dou/$(date +%Y%m%d)
mkdir -p $BACKUP_DIR

# Snapshot Prometheus
curl -XPOST http://localhost:9090/api/v1/admin/tsdb/snapshot
docker cp dou-prometheus:/prometheus/snapshots $BACKUP_DIR/

echo "Prometheus backup: $BACKUP_DIR"
```

### Nettoyage Loki

```bash
# Vérifier l'espace
docker exec dou-loki du -sh /loki/*

# Forcer la compaction
curl -XPOST http://localhost:3100/flush
```

---

## 🚨 Troubleshooting

### Prometheus ne scrape pas

```bash
# Vérifier les targets
curl http://localhost:9090/api/v1/targets | jq '.data.activeTargets[] | {job: .labels.job, health: .health}'

# Vérifier la config
docker exec dou-prometheus promtool check config /etc/prometheus/prometheus.yml
```

### Grafana ne charge pas les dashboards

```bash
# Vérifier les logs
docker logs dou-grafana --tail 50

# Vérifier les datasources
curl -u admin:password http://localhost:3000/api/datasources | jq
```

---

*Loi : Dou — Équipage ARKADIA | GL Tower — NIVEAU 3*
