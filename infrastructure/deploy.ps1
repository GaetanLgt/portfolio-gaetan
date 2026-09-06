# ============================================================
# GL TOWER - Script de Déploiement Stack Agentique
# PowerShell pour Windows
# ============================================================

param(
    [Parameter(Position=0)]
    [ValidateSet('install', 'start', 'stop', 'restart', 'status', 'logs', 'update', 'backup', 'clean', 'models', 'help')]
    [string]$Action = 'help',
    
    [Parameter(Position=1)]
    [string]$Service = '',
    
    [switch]$Force,
    [switch]$Verbose
)

$ErrorActionPreference = "Stop"
$InfraPath = $PSScriptRoot
$ProjectRoot = Split-Path $InfraPath -Parent

# Couleurs
function Write-Title { param($msg) Write-Host "`n$msg" -ForegroundColor Cyan }
function Write-Success { param($msg) Write-Host "✅ $msg" -ForegroundColor Green }
function Write-Info { param($msg) Write-Host "ℹ️  $msg" -ForegroundColor Yellow }
function Write-Err { param($msg) Write-Host "❌ $msg" -ForegroundColor Red }
function Write-Step { param($msg) Write-Host "   → $msg" -ForegroundColor Gray }

# Banner
function Show-Banner {
    Write-Host ""
    Write-Host "╔═══════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
    Write-Host "║                                                           ║" -ForegroundColor Cyan
    Write-Host "║   🏢 GL TOWER - Équipage ARKADIA                         ║" -ForegroundColor Cyan
    Write-Host "║   6 Lois ARKADIA • Infrastructure Docker                 ║" -ForegroundColor Cyan
    Write-Host "║                                                           ║" -ForegroundColor Cyan
    Write-Host "╚═══════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
    Write-Host ""
}

# Vérifier prérequis
function Test-Prerequisites {
    Write-Title "🔍 Vérification des prérequis..."
    
    # Docker
    try {
        $dockerVersion = docker --version
        Write-Success "Docker: $dockerVersion"
    } catch {
        Write-Err "Docker non installé ou non démarré"
        Write-Step "Installer: winget install Docker.DockerDesktop"
        return $false
    }
    
    # Docker Compose
    try {
        $composeVersion = docker compose version
        Write-Success "Docker Compose: $composeVersion"
    } catch {
        Write-Err "Docker Compose non disponible"
        return $false
    }
    
    # Docker running?
    try {
        docker info | Out-Null
        Write-Success "Docker daemon: Running"
    } catch {
        Write-Err "Docker daemon non démarré"
        Write-Step "Démarrer Docker Desktop"
        return $false
    }
    
    # .env file
    $envFile = Join-Path $InfraPath ".env"
    if (Test-Path $envFile) {
        Write-Success "Fichier .env: Présent"
    } else {
        Write-Info "Fichier .env manquant, création depuis .env.example..."
        $envExample = Join-Path $InfraPath ".env.example"
        if (Test-Path $envExample) {
            Copy-Item $envExample $envFile
            Write-Success "Fichier .env créé (pensez à modifier les mots de passe!)"
        } else {
            Write-Err "Fichier .env.example manquant"
            return $false
        }
    }
    
    return $true
}

# Créer les dossiers nécessaires
function Initialize-Directories {
    Write-Title "📁 Création des dossiers..."
    
    $dirs = @(
        "config",
        "config/grafana/provisioning/datasources",
        "config/grafana/provisioning/dashboards", 
        "config/grafana/dashboards",
        "data/openwebui",
        "data/registry",
        "workflows",
        "init/postgres"
    )
    
    foreach ($dir in $dirs) {
        $fullPath = Join-Path $InfraPath $dir
        if (-not (Test-Path $fullPath)) {
            New-Item -ItemType Directory -Path $fullPath -Force | Out-Null
            Write-Step "Créé: $dir"
        }
    }
    
    Write-Success "Dossiers initialisés"
}

# Créer les fichiers de config
function Initialize-Configs {
    Write-Title "⚙️ Création des fichiers de configuration..."
    
    # Prometheus config
    $prometheusConfig = @"
global:
  scrape_interval: 15s
  evaluation_interval: 15s

scrape_configs:
  - job_name: 'prometheus'
    static_configs:
      - targets: ['localhost:9090']

  - job_name: 'node-exporter'
    static_configs:
      - targets: ['node-exporter:9100']

  - job_name: 'docker'
    static_configs:
      - targets: ['host.docker.internal:9323']

  - job_name: 'n8n'
    static_configs:
      - targets: ['n8n:5678']
    metrics_path: /metrics
"@
    
    $prometheusPath = Join-Path $InfraPath "config/prometheus.yml"
    if (-not (Test-Path $prometheusPath)) {
        $prometheusConfig | Out-File -FilePath $prometheusPath -Encoding utf8
        Write-Step "Créé: prometheus.yml"
    }
    
    # Grafana datasources
    $grafanaDatasources = @"
apiVersion: 1
datasources:
  - name: Prometheus
    type: prometheus
    access: proxy
    url: http://prometheus:9090
    isDefault: true
  - name: Loki
    type: loki
    access: proxy
    url: http://loki:3100
"@
    
    $datasourcesPath = Join-Path $InfraPath "config/grafana/provisioning/datasources/datasources.yml"
    if (-not (Test-Path $datasourcesPath)) {
        $grafanaDatasources | Out-File -FilePath $datasourcesPath -Encoding utf8
        Write-Step "Créé: grafana datasources"
    }
    
    # Loki config
    $lokiConfig = @"
auth_enabled: false
server:
  http_listen_port: 3100
common:
  path_prefix: /loki
  storage:
    filesystem:
      chunks_directory: /loki/chunks
      rules_directory: /loki/rules
  replication_factor: 1
  ring:
    kvstore:
      store: inmemory
schema_config:
  configs:
    - from: 2020-10-24
      store: boltdb-shipper
      object_store: filesystem
      schema: v11
      index:
        prefix: index_
        period: 24h
"@
    
    $lokiPath = Join-Path $InfraPath "config/loki.yml"
    if (-not (Test-Path $lokiPath)) {
        $lokiConfig | Out-File -FilePath $lokiPath -Encoding utf8
        Write-Step "Créé: loki.yml"
    }
    
    # Init SQL
    $initSql = @"
-- GL Tower Database Initialization
-- Agent: WATASHI

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Schema for agents data
CREATE SCHEMA IF NOT EXISTS agents;

-- Logs table
CREATE TABLE IF NOT EXISTS agents.logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agent_name VARCHAR(50) NOT NULL,
    level VARCHAR(20) NOT NULL,
    message TEXT,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Metrics table
CREATE TABLE IF NOT EXISTS agents.metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agent_name VARCHAR(50) NOT NULL,
    metric_name VARCHAR(100) NOT NULL,
    metric_value DECIMAL,
    tags JSONB,
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index
CREATE INDEX IF NOT EXISTS idx_logs_agent ON agents.logs(agent_name);
CREATE INDEX IF NOT EXISTS idx_logs_created ON agents.logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_metrics_agent ON agents.metrics(agent_name);

GRANT ALL ON SCHEMA agents TO gltower;
GRANT ALL ON ALL TABLES IN SCHEMA agents TO gltower;
"@
    
    $initSqlPath = Join-Path $InfraPath "init/postgres/01-init.sql"
    if (-not (Test-Path $initSqlPath)) {
        $initSql | Out-File -FilePath $initSqlPath -Encoding utf8
        Write-Step "Créé: init SQL"
    }
    
    Write-Success "Configurations créées"
}

# Installation complète
function Install-Stack {
    Show-Banner
    
    if (-not (Test-Prerequisites)) {
        Write-Err "Prérequis non satisfaits"
        exit 1
    }
    
    Initialize-Directories
    Initialize-Configs
    
    Write-Title "🚀 Démarrage de la stack GL Tower..."
    
    Set-Location $InfraPath
    
    # Étape 1: Infrastructure de base
    Write-Info "Étape 1/5: Base de données (Watashi)..."
    docker compose up -d postgres redis
    Start-Sleep -Seconds 10
    
    # Étape 2: Vector DB
    Write-Info "Étape 2/5: Vector Store (ChromaDB)..."
    docker compose up -d chromadb
    Start-Sleep -Seconds 5
    
    # Étape 3: IA Locale
    Write-Info "Étape 3/5: IA Locale (Ollama)..."
    docker compose up -d ollama
    Start-Sleep -Seconds 5
    
    # Étape 4: Services principaux
    Write-Info "Étape 4/5: Services (n8n, OpenWebUI, Monitoring)..."
    docker compose up -d n8n n8n-worker openwebui prometheus grafana loki node-exporter
    Start-Sleep -Seconds 10
    
    # Étape 5: Sécurité
    Write-Info "Étape 5/5: Sécurité (Vault)..."
    docker compose up -d vault registry
    
    Write-Title "📊 Status des services..."
    docker compose ps
    
    Write-Host ""
    Write-Success "Stack GL Tower déployée!"
    Write-Host ""
    Show-Urls
    
    Write-Host ""
    Write-Info "Prochaine étape: Télécharger les modèles Ollama"
    Write-Host "   .\deploy.ps1 models" -ForegroundColor Yellow
}

# Télécharger les modèles Ollama
function Install-Models {
    Write-Title "🧠 Téléchargement des modèles Ollama..."
    
    $models = @("mistral", "llama3.2", "nomic-embed-text")
    
    foreach ($model in $models) {
        Write-Info "Téléchargement: $model (peut prendre plusieurs minutes)..."
        docker exec -it gl-ollama ollama pull $model
        Write-Success "$model installé"
    }
    
    Write-Title "📋 Modèles disponibles:"
    docker exec -it gl-ollama ollama list
}

# Afficher les URLs
function Show-Urls {
    Write-Title "🌐 URLs des services:"
    Write-Host ""
    Write-Host "   Wa (n8n)           " -NoNewline -ForegroundColor Yellow
    Write-Host "http://localhost:5678" -ForegroundColor Cyan
    Write-Host "   Watashi (Chat)     " -NoNewline -ForegroundColor Yellow
    Write-Host "http://localhost:3000" -ForegroundColor Cyan
    Write-Host "   Dou (Grafana)      " -NoNewline -ForegroundColor Yellow
    Write-Host "http://localhost:3001" -ForegroundColor Cyan
    Write-Host "   Dou (Prometheus)   " -NoNewline -ForegroundColor Yellow
    Write-Host "http://localhost:9090" -ForegroundColor Cyan
    Write-Host "   Makoto (Vault)     " -NoNewline -ForegroundColor Yellow
    Write-Host "http://localhost:8200" -ForegroundColor Cyan
    Write-Host "   Watashi (ChromaDB) " -NoNewline -ForegroundColor Yellow
    Write-Host "http://localhost:8000" -ForegroundColor Cyan
    Write-Host "   Ollama API         " -NoNewline -ForegroundColor Yellow
    Write-Host "http://localhost:11434" -ForegroundColor Cyan
    Write-Host ""
}

# Start
function Start-Stack {
    Show-Banner
    Write-Title "▶️ Démarrage de la stack..."
    Set-Location $InfraPath
    
    if ($Service) {
        docker compose up -d $Service
        Write-Success "Service $Service démarré"
    } else {
        docker compose up -d
        Write-Success "Stack complète démarrée"
    }
    
    Show-Urls
}

# Stop
function Stop-Stack {
    Show-Banner
    Write-Title "⏹️ Arrêt de la stack..."
    Set-Location $InfraPath
    
    if ($Service) {
        docker compose stop $Service
        Write-Success "Service $Service arrêté"
    } else {
        docker compose down
        Write-Success "Stack arrêtée"
    }
}

# Restart
function Restart-Stack {
    Show-Banner
    Write-Title "🔄 Redémarrage..."
    Set-Location $InfraPath
    
    if ($Service) {
        docker compose restart $Service
        Write-Success "Service $Service redémarré"
    } else {
        docker compose restart
        Write-Success "Stack redémarrée"
    }
}

# Status
function Show-Status {
    Show-Banner
    Write-Title "📊 Status des services:"
    Set-Location $InfraPath
    docker compose ps
    
    Write-Title "💾 Utilisation ressources:"
    docker stats --no-stream --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}"
    
    Show-Urls
}

# Logs
function Show-Logs {
    Set-Location $InfraPath
    
    if ($Service) {
        docker compose logs -f $Service
    } else {
        docker compose logs -f
    }
}

# Update
function Update-Stack {
    Show-Banner
    Write-Title "⬆️ Mise à jour des images..."
    Set-Location $InfraPath
    
    docker compose pull
    docker compose up -d
    
    Write-Success "Stack mise à jour"
}

# Backup
function Backup-Stack {
    Show-Banner
    Write-Title "💾 Backup de la stack..."
    
    $backupDir = Join-Path $InfraPath "backups"
    $timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
    $backupPath = Join-Path $backupDir $timestamp
    
    New-Item -ItemType Directory -Path $backupPath -Force | Out-Null
    
    # Backup PostgreSQL
    Write-Info "Backup PostgreSQL..."
    docker exec gl-postgres pg_dump -U gltower gltower > "$backupPath\postgres_backup.sql"
    Write-Success "PostgreSQL sauvegardé"
    
    # Backup n8n workflows
    Write-Info "Backup n8n..."
    docker cp gl-wa-n8n:/home/node/.n8n "$backupPath\n8n_data"
    Write-Success "n8n sauvegardé"
    
    Write-Success "Backup terminé: $backupPath"
}

# Clean
function Clean-Stack {
    Show-Banner
    
    if (-not $Force) {
        $confirm = Read-Host "⚠️ Supprimer tous les containers et volumes? (oui/non)"
        if ($confirm -ne "oui") {
            Write-Info "Annulé"
            return
        }
    }
    
    Write-Title "🧹 Nettoyage..."
    Set-Location $InfraPath
    
    docker compose down -v --remove-orphans
    docker system prune -f
    
    Write-Success "Stack nettoyée"
}

# Help
function Show-Help {
    Show-Banner
    
    Write-Host "Usage: .\deploy.ps1 <action> [service] [-Force] [-Verbose]" -ForegroundColor White
    Write-Host ""
    Write-Host "Actions:" -ForegroundColor Yellow
    Write-Host "  install   " -NoNewline -ForegroundColor Cyan
    Write-Host "Installation complète de la stack"
    Write-Host "  start     " -NoNewline -ForegroundColor Cyan
    Write-Host "Démarrer la stack (ou un service)"
    Write-Host "  stop      " -NoNewline -ForegroundColor Cyan
    Write-Host "Arrêter la stack (ou un service)"
    Write-Host "  restart   " -NoNewline -ForegroundColor Cyan
    Write-Host "Redémarrer la stack (ou un service)"
    Write-Host "  status    " -NoNewline -ForegroundColor Cyan
    Write-Host "Afficher le status des services"
    Write-Host "  logs      " -NoNewline -ForegroundColor Cyan
    Write-Host "Afficher les logs (temps réel)"
    Write-Host "  update    " -NoNewline -ForegroundColor Cyan
    Write-Host "Mettre à jour les images Docker"
    Write-Host "  backup    " -NoNewline -ForegroundColor Cyan
    Write-Host "Sauvegarder PostgreSQL et n8n"
    Write-Host "  models    " -NoNewline -ForegroundColor Cyan
    Write-Host "Télécharger les modèles Ollama"
    Write-Host "  clean     " -NoNewline -ForegroundColor Cyan
    Write-Host "Supprimer containers et volumes"
    Write-Host "  help      " -NoNewline -ForegroundColor Cyan
    Write-Host "Afficher cette aide"
    Write-Host ""
    Write-Host "Exemples:" -ForegroundColor Yellow
    Write-Host "  .\deploy.ps1 install          # Installation complète"
    Write-Host "  .\deploy.ps1 start            # Démarrer tout"
    Write-Host "  .\deploy.ps1 restart n8n      # Redémarrer n8n"
    Write-Host "  .\deploy.ps1 logs ollama      # Logs Ollama"
    Write-Host "  .\deploy.ps1 models           # Télécharger modèles IA"
    Write-Host ""
    
    Show-Urls
}

# Main
switch ($Action) {
    'install' { Install-Stack }
    'start'   { Start-Stack }
    'stop'    { Stop-Stack }
    'restart' { Restart-Stack }
    'status'  { Show-Status }
    'logs'    { Show-Logs }
    'update'  { Update-Stack }
    'backup'  { Backup-Stack }
    'models'  { Install-Models }
    'clean'   { Clean-Stack }
    'help'    { Show-Help }
    default   { Show-Help }
}
