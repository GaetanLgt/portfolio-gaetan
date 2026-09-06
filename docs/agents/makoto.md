# 🛡️ Makoto — Sécurité, Audit & Tests (誠)

> **誠 Makoto — Makoto, la Sincérité — Codename : GUARDIAN**  
> « La vérité dans chaque acte. Un test et un audit ne font rien d'autre que vérifier la vérité. »  
> Loi : 誠 **Sincérité** — Rôle : Sécurité, Audit & QA  
> Niveau : 6 | Étage 6 (zone principale) | Status : ONLINE | Priorité : CRITIQUE

---

## 📋 Fiche Agent

| Propriété | Valeur |
|-----------|--------|
| **Nom complet** | 誠 Makoto (Makoto — La Sincérité) |
| **Kanji** | 誠 |
| **Roman** | Makoto |
| **Sens** | Sincérité |
| **Codename** | GUARDIAN |
| **Rôle** | Sécurité, Audit & QA |
| **Niveau** | 6 (GL Tower — NIVEAU 6) |
| **Couleur** | `#EF4444` (Rouge) |
| **Icône** | 🛡️ |
| **Personnalité** | Vigilante, directe, intègre |
| **Phrase clé** | « La vérité, même quand elle dérange. » |

---

## 🎯 Mission

Protéger l'infrastructure GL Tower et garantir la vérité du code : scanner les vulnérabilités, auditer les configurations, gérer les secrets et tester sans concession. Makoto est la Loi de la Sincérité — un test et un audit ne font rien d'autre que vérifier la vérité d'un système, d'une configuration ou d'une ligne de code.

### 🔐 Responsabilités — Sécurité

- 🔍 **Scanning de vulnérabilités** : CVE, OWASP Top 10, images Docker, dépendances
- 🛡️ **Audit de configurations** : Docker, serveurs, applications, durcissement système
- 🚨 **Détection d'intrusions** : logs suspects, force brute, comportements anormaux
- 📋 **Rapports de conformité** : RGPD, sécurité, revue d'accès et de clés API
- 🔑 **Gestion des secrets** : stockage centralisé, rotation, détection de fuites

### 🧪 Responsabilités — Tests & QA

- 🧪 Tests unitaires et d'intégration (backend PHP / frontend Vue)
- 🎭 Tests de bout en bout (E2E) et tests de fumée post-déploiement
- 🧬 Tests de mutation pour mesurer la robustesse réelle des suites
- 📊 Analyse de couverture de code et commentaires automatiques sur les pull requests
- 🔁 Détection de régressions (comportementales et visuelles)

---

## 🛠️ Stack Technique

### 🔐 Sécurité & Audit

| Composant | Technologie | Rôle |
|-----------|-------------|------|
| Scanner de vulnérabilités | **Trivy** | CVE des images Docker |
| Scanner web | **Nuclei** | OWASP, mauvaises configurations, expositions |
| SIEM | **Wazuh** | Détection de menaces, intégrité des fichiers |
| Gestion des secrets | **Vault** | Stockage et rotation des secrets |
| Durcissement système | **Lynis** | Audit de durcissement (hardening) |

### 🧪 Tests & QA

```yaml
Backend Testing:
  - PHPUnit 11.x
  - Pest PHP
  - Mockery
  - Doctrine Fixtures

Frontend Testing:
  - Vitest
  - Vue Test Utils
  - Testing Library
  - MSW (Mock Service Worker)

E2E Testing:
  - Playwright

Mutation Testing:
  - Infection PHP
```

---

## 📦 Installation

### 1. Structure des dossiers

Deux anciennes arborescences de travail (sécurité d'une part, tests & QA d'autre part) sont fusionnées sous un répertoire unique :

```text
~/gl-tower/makoto/
├── scans/                  # scripts de scan, d'audit et de blocage (sécurité)
├── tests/                  # scripts et campagnes de tests & QA
├── reports/                # rapports (scans, couverture, E2E)
├── config/                 # configurations Wazuh (ossec.conf, règles) et Vault
└── rules/                  # templates et règles additionnelles (ex. Nuclei)
```

```bash
mkdir -p ~/gl-tower/makoto/{scans,tests,reports,config,config/wazuh,config/wazuh/rules,config/vault,rules/rules-nuclei}
cd ~/gl-tower/makoto
```

> ℹ️ **Point de montage côté orchestration** : les workflows du coordinateur **Wa** accèdent à la même arborescence via le point de montage `/opt/gl-tower/makoto` (équivalent hôte de `~/gl-tower/makoto`). Les exemples de workflows ci-dessous utilisent `/opt/gl-tower/makoto/...`.

### 2. Variables d'environnement

```bash
# ~/gl-tower/makoto/.env
WAZUH_INDEXER_PASSWORD=change-me
WAZUH_API_PASSWORD=change-me
VAULT_TOKEN=change-me

# Alertes Discord
MAKOTO_WEBHOOK=https://discord.com/api/webhooks/...            # rapports
MAKOTO_CRITICAL_WEBHOOK=https://discord.com/api/webhooks/...   # alertes critiques

# Jetons injectés lors de l'initialisation des secrets (Vault)
GITHUB_TOKEN=
```

### 3. Docker Compose

```yaml
# ~/gl-tower/makoto/docker-compose.yml
services:
  # Trivy - Scanner de vulnérabilités des images
  trivy:
    image: aquasec/trivy:latest
    container_name: makoto-trivy
    volumes:
      - trivy-cache:/root/.cache/
      - /var/run/docker.sock:/var/run/docker.sock:ro
      - ./reports:/reports
    networks:
      - gl-tower
    entrypoint: ["tail", "-f", "/dev/null"]

  # Nuclei - Scanner de sécurité web
  nuclei:
    image: projectdiscovery/nuclei:latest
    container_name: makoto-nuclei
    volumes:
      - ./reports:/reports
      - ./rules/rules-nuclei:/root/nuclei-templates/custom
    networks:
      - gl-tower
    entrypoint: ["tail", "-f", "/dev/null"]

  # Wazuh Manager - SIEM
  wazuh-manager:
    image: wazuh/wazuh-manager:4.7.0
    container_name: makoto-wazuh-manager
    restart: unless-stopped
    ports:
      - "1514:1514/udp"
      - "1515:1515"
      - "55000:55000"
    environment:
      - INDEXER_URL=https://makoto-wazuh-indexer:9200
      - INDEXER_USERNAME=admin
      - INDEXER_PASSWORD=${WAZUH_INDEXER_PASSWORD}
      - FILEBEAT_SSL_VERIFICATION_MODE=none
    volumes:
      - wazuh-api-config:/var/ossec/api/configuration
      - wazuh-etc:/var/ossec/etc
      - wazuh-logs:/var/ossec/logs
      - wazuh-queue:/var/ossec/queue
      - wazuh-var-multigroups:/var/ossec/var/multigroups
      - wazuh-integrations:/var/ossec/integrations
      - wazuh-active-response:/var/ossec/active-response/bin
      - wazuh-agentless:/var/ossec/agentless
      - wazuh-wodles:/var/ossec/wodles
      - filebeat-etc:/etc/filebeat
      - filebeat-var:/var/lib/filebeat
    networks:
      - gl-tower

  # Wazuh Indexer (OpenSearch)
  wazuh-indexer:
    image: wazuh/wazuh-indexer:4.7.0
    container_name: makoto-wazuh-indexer
    restart: unless-stopped
    environment:
      - "OPENSEARCH_JAVA_OPTS=-Xms512m -Xmx512m"
      - "bootstrap.memory_lock=true"
    ulimits:
      memlock:
        soft: -1
        hard: -1
    volumes:
      - wazuh-indexer-data:/var/lib/wazuh-indexer
    networks:
      - gl-tower

  # Wazuh Dashboard
  wazuh-dashboard:
    image: wazuh/wazuh-dashboard:4.7.0
    container_name: makoto-wazuh-dashboard
    restart: unless-stopped
    ports:
      - "5601:5601"
    environment:
      - INDEXER_USERNAME=admin
      - INDEXER_PASSWORD=${WAZUH_INDEXER_PASSWORD}
      - WAZUH_API_URL=https://makoto-wazuh-manager
      - API_USERNAME=wazuh-wui
      - API_PASSWORD=${WAZUH_API_PASSWORD}
    volumes:
      - wazuh-dashboard-config:/usr/share/wazuh-dashboard/data/wazuh/config
      - wazuh-dashboard-custom:/usr/share/wazuh-dashboard/plugins/wazuh/public/assets/custom
    networks:
      - gl-tower
    depends_on:
      - wazuh-indexer
      - wazuh-manager

  # Vault - Gestion des secrets
  vault:
    image: hashicorp/vault:latest
    container_name: makoto-vault
    restart: unless-stopped
    ports:
      - "8200:8200"
    environment:
      - VAULT_DEV_ROOT_TOKEN_ID=${VAULT_TOKEN}
      - VAULT_DEV_LISTEN_ADDRESS=0.0.0.0:8200
    cap_add:
      - IPC_LOCK
    volumes:
      - vault-data:/vault/data
      - ./config/vault:/vault/config
    networks:
      - gl-tower

volumes:
  trivy-cache:
  wazuh-api-config:
  wazuh-etc:
  wazuh-logs:
  wazuh-queue:
  wazuh-var-multigroups:
  wazuh-integrations:
  wazuh-active-response:
  wazuh-agentless:
  wazuh-wodles:
  wazuh-indexer-data:
  wazuh-dashboard-config:
  wazuh-dashboard-custom:
  filebeat-etc:
  filebeat-var:
  vault-data:

networks:
  gl-tower:
    external: true
```

```bash
docker compose --env-file .env up -d
```

---

## 🔐 Sécurité

### Scripts de scan

#### Scan Trivy (images Docker)

```bash
#!/bin/bash
# scans/scan-images.sh
set -e

MAKOTO_HOME="${MAKOTO_HOME:-$HOME/gl-tower/makoto}"
REPORT_DIR="$MAKOTO_HOME/reports"
mkdir -p "$REPORT_DIR"

echo "🔍 Makoto - Scan des images Docker..."

# Images publiées par le registre GL Digital Lab (compléter la liste)
IMAGES=(
  "ghcr.io/gldigitallab/portfolio:latest"
  "ghcr.io/gldigitallab/arkadia-api:latest"
)

for IMAGE in "${IMAGES[@]}"; do
  echo "Scan : $IMAGE"

  # Scan Trivy (HIGH, CRITICAL)
  docker exec makoto-trivy trivy image \
    --severity HIGH,CRITICAL \
    --format json \
    --output "/reports/trivy-$(echo "$IMAGE" | tr '/:' '-').json" \
    "$IMAGE"
done

echo "📊 Génération du rapport consolidé..."

# Rapport consolidé (les images listées par docker images sont visibles via le socket)
docker exec makoto-trivy trivy image \
  --severity HIGH,CRITICAL \
  --format template \
  --template "@/contrib/html.tpl" \
  --output /reports/trivy-report.html \
  $(docker images --format "{{.Repository}}:{{.Tag}}" | head -10)

echo "✅ Scan terminé : $REPORT_DIR"
```

#### Scan Nuclei (web)

```bash
#!/bin/bash
# scans/scan-web.sh
set -e

TARGETS=${1:-"https://gldigitallab.fr"}
MAKOTO_HOME="${MAKOTO_HOME:-$HOME/gl-tower/makoto}"
REPORT_DIR="$MAKOTO_HOME/reports"
mkdir -p "$REPORT_DIR"
TODAY=$(date +%Y%m%d)

echo "🔍 Makoto - Scan de sécurité web"
echo "Cible : $TARGETS"

# Scan Nuclei (CVE, vulnérabilités, mauvaises configurations, expositions)
docker exec makoto-nuclei nuclei \
  -u "$TARGETS" \
  -t cves/ \
  -t vulnerabilities/ \
  -t misconfigurations/ \
  -t exposures/ \
  -severity critical,high,medium \
  -o "/reports/nuclei-$TODAY.txt" \
  -json-export "/reports/nuclei-$TODAY.json"

# Scan OWASP Top 10
docker exec makoto-nuclei nuclei \
  -u "$TARGETS" \
  -t owasp-top-10/ \
  -o "/reports/owasp-$TODAY.txt"

echo "✅ Scan web terminé"
```

#### Audit de durcissement système (Lynis)

```bash
#!/bin/bash
# scans/audit-system.sh
set -e

MAKOTO_HOME="${MAKOTO_HOME:-$HOME/gl-tower/makoto}"
REPORT_DIR="$MAKOTO_HOME/reports"
mkdir -p "$REPORT_DIR"

echo "🔍 Makoto - Audit du système"

# Installation de Lynis si nécessaire
if ! command -v lynis &> /dev/null; then
  sudo apt-get update && sudo apt-get install -y lynis
fi

# Audit complet
sudo lynis audit system --quick --quiet --report-file "$REPORT_DIR/lynis-report.dat"

# Lire l'indice de durcissement
HARDENING_INDEX=$(grep "hardening_index" "$REPORT_DIR/lynis-report.dat" | cut -d'=' -f2)

echo "📊 Indice de durcissement : $HARDENING_INDEX"

# Alerter si le score est faible
if [ -n "$HARDENING_INDEX" ] && [ "$HARDENING_INDEX" -lt 70 ]; then
  curl -X POST "$MAKOTO_CRITICAL_WEBHOOK" \
    -H "Content-Type: application/json" \
    -d "{\"content\": \"⚠️ **Alerte Makoto** : indice de durcissement système à $HARDENING_INDEX (cible < 70)\"}"
fi

echo "✅ Audit système terminé : $REPORT_DIR/lynis-report.dat"
```

#### Blocage d'une adresse source

```bash
#!/bin/bash
# scans/block-ip.sh <adresse-ip>
set -e

IP="$1"
if [ -z "$IP" ]; then
  echo "Usage: $0 <adresse-ip>" >&2
  exit 1
fi

# Blocage pare-feu + ban coordonné (fail2ban)
sudo ufw deny from "$IP" || true
sudo fail2ban-client set sshd banip "$IP" 2>/dev/null || true

echo "🔒 Adresse $IP bloquée"
```

### Configuration Wazuh

```xml
<!-- config/wazuh/ossec.conf -->
<ossec_config>
  <global>
    <jsonout_output>yes</jsonout_output>
    <alerts_log>yes</alerts_log>
    <logall>no</logall>
    <logall_json>no</logall_json>
    <email_notification>yes</email_notification>
    <email_to>security@gldigitallab.fr</email_to>
    <smtp_server>smtp.gldigitallab.fr</smtp_server>
    <email_from>makoto@gldigitallab.fr</email_from>
    <email_maxperhour>12</email_maxperhour>
  </global>

  <!-- Syscheck - surveillance de l'intégrité des fichiers -->
  <syscheck>
    <disabled>no</disabled>
    <frequency>43200</frequency>
    <scan_on_start>yes</scan_on_start>

    <!-- Répertoires surveillés -->
    <directories check_all="yes" realtime="yes">/etc,/usr/bin,/usr/sbin</directories>
    <directories check_all="yes" realtime="yes">/opt/gl-tower</directories>

    <!-- Exclusions -->
    <ignore>/etc/mtab</ignore>
    <ignore>/etc/hosts.deny</ignore>
    <ignore>/etc/mail/statistics</ignore>
    <ignore>/etc/random-seed</ignore>
    <ignore>/etc/adjtime</ignore>
    <ignore>/etc/prelink.cache</ignore>
  </syscheck>

  <!-- Rootcheck - détection de rootkits -->
  <rootcheck>
    <disabled>no</disabled>
    <check_files>yes</check_files>
    <check_trojans>yes</check_trojans>
    <check_dev>yes</check_dev>
    <check_sys>yes</check_sys>
    <check_pids>yes</check_pids>
    <check_ports>yes</check_ports>
    <check_if>yes</check_if>
    <frequency>43200</frequency>
  </rootcheck>

  <!-- Réponse active -->
  <active-response>
    <command>firewall-drop</command>
    <location>local</location>
    <level>7</level>
    <timeout>600</timeout>
  </active-response>

  <!-- Analyse des journaux -->
  <localfile>
    <log_format>syslog</log_format>
    <location>/var/log/auth.log</location>
  </localfile>

  <localfile>
    <log_format>syslog</log_format>
    <location>/var/log/syslog</location>
  </localfile>

  <localfile>
    <log_format>json</log_format>
    <location>/var/lib/docker/containers/*/*.log</location>
  </localfile>

  <!-- Détection de vulnérabilités -->
  <vulnerability-detector>
    <enabled>yes</enabled>
    <interval>5m</interval>
    <min_full_scan_interval>6h</min_full_scan_interval>
    <run_on_start>yes</run_on_start>

    <provider name="canonical">
      <enabled>yes</enabled>
      <os>focal</os>
      <os>jammy</os>
      <update_interval>1h</update_interval>
    </provider>

    <provider name="nvd">
      <enabled>yes</enabled>
      <update_interval>1h</update_interval>
    </provider>
  </vulnerability-detector>
</ossec_config>
```

### Règles personnalisées Wazuh

Déposer `gl-tower-rules.xml` dans le répertoire des règles du manager (ex. `/var/ossec/etc/rules/gl-tower-rules.xml`), puis redémarrer le conteneur `makoto-wazuh-manager`.

```xml
<!-- config/wazuh/rules/gl-tower-rules.xml -->
<group name="gl-tower,">

  <!-- Force brute SSH -->
  <rule id="100001" level="10">
    <if_matched_sid>5710</if_matched_sid>
    <same_source_ip />
    <options>alert_by_email</options>
    <description>Makoto : attaque par force brute SSH depuis $(srcip)</description>
    <group>authentication_failed,pci_dss_11.4,</group>
  </rule>

  <!-- Conteneur Docker démarré -->
  <rule id="100010" level="3">
    <decoded_as>json</decoded_as>
    <field name="status">start</field>
    <description>Makoto : conteneur Docker démarré : $(docker.container.name)</description>
    <group>docker,</group>
  </rule>

  <!-- Conteneur Docker arrêté de façon inattendue -->
  <rule id="100011" level="7">
    <decoded_as>json</decoded_as>
    <field name="status">die</field>
    <description>Makoto : conteneur Docker arrêté de façon inattendue : $(docker.container.name)</description>
    <group>docker,service_availability,</group>
  </rule>

  <!-- Modification suspecte d'un fichier -->
  <rule id="100020" level="12">
    <if_sid>550</if_sid>
    <match>/opt/gl-tower</match>
    <options>alert_by_email</options>
    <description>Makoto : fichier critique modifié dans GL Tower : $(file)</description>
    <group>syscheck,pci_dss_11.5,</group>
  </rule>

  <!-- Usage CPU élevé -->
  <rule id="100030" level="7">
    <decoded_as>json</decoded_as>
    <field name="cpu_percent">^[8-9][0-9]|100</field>
    <description>Makoto : usage CPU élevé détecté ($(cpu_percent)%)</description>
    <group>system_monitor,</group>
  </rule>

  <!-- Tentative d'accès non autorisé -->
  <rule id="100040" level="12">
    <if_sid>5501</if_sid>
    <match>unauthorized</match>
    <options>alert_by_email</options>
    <description>Makoto : tentative d'accès non autorisé détectée</description>
    <group>access_denied,pci_dss_10.2.4,</group>
  </rule>

  <!-- Détection de fuite de secret -->
  <rule id="100050" level="15">
    <decoded_as>json</decoded_as>
    <regex>password|secret|api_key|token</regex>
    <description>Makoto : fuite de secret potentielle détectée dans les journaux</description>
    <group>secret_leak,pci_dss_8.2.1,</group>
  </rule>

</group>
```

### Configuration Vault

```hcl
# config/vault/config.hcl
ui = true
disable_mlock = true

storage "file" {
  path = "/vault/data"
}

listener "tcp" {
  address     = "0.0.0.0:8200"
  tls_disable = "true"
}

api_addr = "http://127.0.0.1:8200"
```

### Gestion des secrets

```bash
#!/bin/bash
# scans/manage-secrets.sh
set -e

VAULT_ADDR="http://localhost:8200"
VAULT_TOKEN="${VAULT_TOKEN}"

# Fonction pour stocker un secret
store_secret() {
  local path=$1
  local key=$2
  local value=$3

  vault kv put "secret/$path" "$key=$value"
  echo "✅ Secret stocké : secret/$path"
}

# Fonction pour récupérer un secret
get_secret() {
  local path=$1
  local key=$2

  vault kv get -field="$key" "secret/$path"
}

# Fonction pour lister les secrets
list_secrets() {
  local path=${1:-""}
  vault kv list "secret/$path"
}

# Fonction pour la rotation d'un secret
rotate_secret() {
  local path=$1
  local key=$2

  # Générer un nouveau secret
  NEW_VALUE=$(openssl rand -base64 32)

  # Sauvegarder l'ancienne valeur
  OLD_VALUE=$(get_secret "$path" "$key" 2>/dev/null || echo "")
  if [ -n "$OLD_VALUE" ]; then
    store_secret "${path}-backup" "$key" "$OLD_VALUE"
  fi

  # Stocker la nouvelle valeur
  store_secret "$path" "$key" "$NEW_VALUE"

  echo "🔄 Secret tourné : secret/$path/$key"
}

# Initialisation des secrets GL Tower
init_gl_tower_secrets() {
  echo "🔐 Initialisation des secrets GL Tower..."

  # Base de données
  store_secret "gl-tower/database" "password" "$(openssl rand -base64 24)"

  # Clés API
  store_secret "gl-tower/api" "discord_token" "$DISCORD_TOKEN"
  store_secret "gl-tower/api" "github_token" "$GITHUB_TOKEN"

  # Clés de chiffrement
  store_secret "gl-tower/encryption" "n8n_key" "$(openssl rand -base64 32)"
  store_secret "gl-tower/encryption" "jwt_secret" "$(openssl rand -base64 64)"

  echo "✅ Secrets GL Tower initialisés"
}

# Menu
case "$1" in
  init)
    init_gl_tower_secrets
    ;;
  store)
    store_secret "$2" "$3" "$4"
    ;;
  get)
    get_secret "$2" "$3"
    ;;
  list)
    list_secrets "$2"
    ;;
  rotate)
    rotate_secret "$2" "$3"
    ;;
  *)
    echo "Usage: $0 {init|store|get|list|rotate}"
    exit 1
    ;;
esac
```

```bash
#!/bin/bash
# scans/rotate-all-secrets.sh
set -e

# Les deux scripts vivent dans le même répertoire
cd "$(dirname "$0")"

echo "🔄 Makoto - Rotation de tous les secrets..."

# Mots de passe base de données
./manage-secrets.sh rotate gl-tower/database password

# Jetons API
./manage-secrets.sh rotate gl-tower/api discord_token
./manage-secrets.sh rotate gl-tower/api github_token

# Clés de chiffrement
./manage-secrets.sh rotate gl-tower/encryption n8n_key
./manage-secrets.sh rotate gl-tower/encryption jwt_secret

echo "✅ Tous les secrets ont été tournés"
echo "⚠️ Penser à mettre à jour les variables d'environnement des services en cours d'exécution !"
```

### Mise à jour des bases CVE

```bash
#!/bin/bash
# scans/update-cve-db.sh

echo "🔄 Mise à jour des bases de vulnérabilités..."

# Trivy
docker exec makoto-trivy trivy image --download-db-only

# Templates Nuclei
docker exec makoto-nuclei nuclei -update-templates

# Flux de vulnérabilités Wazuh
docker exec makoto-wazuh-manager /var/ossec/bin/vulnerability-detector -u

echo "✅ Bases mises à jour"
```

---

## 🧪 Tests & QA

### Arborescence de tests

Arborescence attendue dans les dépôts du code (portfolio frontend, API ARKADIA). Les scripts de pilotage et les rapports de campagne vivent dans `~/gl-tower/makoto/tests/`.

```text
tests/
├── Unit/
│   ├── Service/           # tests des services
│   ├── Entity/            # tests des entités
│   └── Util/              # tests des utilitaires
├── Integration/
│   ├── Repository/        # tests des dépôts
│   └── Controller/        # tests des API
├── E2E/
│   ├── specs/             # spécifications Playwright
│   └── fixtures/          # données de test
└── Performance/
    └── smoke/             # parcours critiques vérifiés après déploiement
```

### Configuration PHPUnit (phpunit.xml)

```xml
<?xml version="1.0" encoding="UTF-8"?>
<phpunit xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:noNamespaceSchemaLocation="vendor/phpunit/phpunit/phpunit.xsd"
         bootstrap="tests/bootstrap.php"
         colors="true"
         executionOrder="depends,defects"
         cacheResultFile=".phpunit.cache/test-results">
    <testsuites>
        <testsuite name="Unit">
            <directory>tests/Unit</directory>
        </testsuite>
        <testsuite name="Integration">
            <directory>tests/Integration</directory>
        </testsuite>
    </testsuites>
    <coverage>
        <include>
            <directory suffix=".php">src</directory>
        </include>
        <report>
            <clover outputFile="coverage.xml"/>
            <html outputDirectory="coverage"/>
        </report>
    </coverage>
</phpunit>
```

### Configuration Playwright (playwright.config.ts)

```typescript
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    { name: 'mobile', use: { ...devices['iPhone 13'] } },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
  },
})
```

### Templates de tests

#### PHPUnit — test d'un service

```php
<?php

namespace App\Tests\Unit\Service;

use App\Entity\Project;
use App\Repository\ProjectRepository;
use App\Service\ProjectService;
use Doctrine\ORM\EntityManagerInterface;
use PHPUnit\Framework\TestCase;
use Psr\Log\LoggerInterface;

class ProjectServiceTest extends TestCase
{
    private ProjectService $service;
    private EntityManagerInterface $em;
    private ProjectRepository $repository;

    protected function setUp(): void
    {
        $this->em = $this->createMock(EntityManagerInterface::class);
        $this->repository = $this->createMock(ProjectRepository::class);
        $logger = $this->createMock(LoggerInterface::class);

        $this->service = new ProjectService(
            $this->em,
            $this->repository,
            $logger
        );
    }

    public function testCreateProject(): void
    {
        $this->em->expects($this->once())
            ->method('persist')
            ->with($this->isInstanceOf(Project::class));

        $this->em->expects($this->once())
            ->method('flush');

        $project = $this->service->create([
            'name' => 'Test Project',
            'description' => 'A test project'
        ]);

        $this->assertInstanceOf(Project::class, $project);
        $this->assertEquals('Test Project', $project->getName());
    }
}
```

#### Vitest — test d'un composant Vue

```typescript
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ProjectCard from '@/components/ProjectCard.vue'

describe('ProjectCard', () => {
  it('renders project name', () => {
    const wrapper = mount(ProjectCard, {
      props: {
        project: {
          id: 1,
          name: 'Test Project',
          description: 'Description'
        }
      }
    })

    expect(wrapper.text()).toContain('Test Project')
  })

  it('emits click event', async () => {
    const wrapper = mount(ProjectCard, {
      props: {
        project: { id: 1, name: 'Test', description: '' }
      }
    })

    await wrapper.trigger('click')

    expect(wrapper.emitted()).toHaveProperty('select')
  })
})
```

#### Playwright — test de bout en bout

```typescript
import { test, expect } from '@playwright/test'

test.describe('Page d\'accueil', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('affiche la section héros', async ({ page }) => {
    await expect(page.locator('.hero__title')).toBeVisible()
    await expect(page.locator('.hero__title')).toContainText('Systèmes Critiques')
  })

  test('permet de naviguer vers la page contact', async ({ page }) => {
    await page.click('text=RÉSERVER UN AUDIT')
    await expect(page).toHaveURL('/contact')
  })

  test('passe les contrôles d\'accessibilité', async ({ page }) => {
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze()
    expect(accessibilityScanResults.violations).toEqual([])
  })
})
```

### Commandes

```bash
# Tests PHP
php bin/phpunit
php bin/phpunit --testsuite=Unit
php bin/phpunit --coverage-html coverage/

# Tests JS (Vitest)
npm run test
npm run test:coverage
npm run test:watch

# Tests de bout en bout (Playwright)
npx playwright test
npx playwright test --ui
npx playwright show-report

# Tests de mutation (Infection)
php vendor/bin/infection --min-msi=80 --threads=4
```

---

## 🔄 Workflows

### Workflows officiels Makoto

| ID | Workflow | Déclencheur | Étapes | Fréquence | Domaine |
|----|----------|-------------|--------|-----------|---------|
| `makoto-docker-scan` | Docker Image Scanner | Push d'une image | Webhook → List Images → Trivy Scan → Parse CVEs → Alert | On push + quotidien | 🔐 Vulnérabilités |
| `makoto-dep-audit` | Dependency Audit | Cron quotidien | npm audit → composer audit → Create Issue | Quotidien | 🔐 Vulnérabilités |
| `makoto-cve-monitor` | CVE Monitor | Cron 6 h | Fetch NVD → Filter Stack → Match → Alert | 6 heures | 🔐 Vulnérabilités |
| `makoto-secret-rotation` | Secret Rotation | Cron hebdomadaire | Vault List → Check Expiry → Generate New → Update | Hebdomadaire | 🔐 Secrets |
| `makoto-ssl-monitor` | SSL Certificate Monitor | Cron quotidien | Check Domains → IF < 30 j → Renew → Notify | Quotidien | 🔐 Secrets |
| `makoto-api-key-audit` | API Key Audit | Pre-commit | Hook → Git Secrets → Trufflehog → Block → Alert | On commit | 🔐 Secrets |
| `makoto-ids` | Intrusion Detection | Webhook Wazuh | Parse → Correlate → IF Threat → Block IP | Temps réel | 🔐 Intrusions |
| `makoto-fail2ban` | Fail2Ban Coordinator | Log fail2ban | Log Watcher → Extract IP → Check Rep → Global Ban → Report | Temps réel | 🔐 Intrusions |
| `makoto-login-anomaly` | Login Anomaly Detection | Événement de connexion | Check Location → Check Device → IF Anomaly → MFA | On login | 🔐 Intrusions |
| `makoto-phpunit` | PHPUnit Test Suite | Pull request | PHPUnit → Parse → Coverage → Comment | On PR | 🧪 Tests & QA |
| `makoto-mutation` | Mutation Testing | Cron nocturne | Infection → Analyze → Suggest | Nocturne | 🧪 Tests & QA |
| `makoto-e2e` | E2E Test Suite | Pré-déploiement | Browsers → Run → Screenshots | Pre-deploy | 🧪 Tests & QA |
| `makoto-smoke` | Smoke Tests | Post-déploiement | Critical Paths → Verify → IF Fail → Rollback | Post-deploy | 🧪 Tests & QA |

> Les extraits n8n ci-dessous sont des définitions de référence, à aligner sur les conventions du coordinateur **Wa** (répertoire de travail des nœuds d'exécution, canal de notification). Les commandes s'exécutent dans le dépôt concerné ou via le point de montage `/opt/gl-tower/makoto`.

### 🔐 Exemples — Sécurité

#### Workflow : Makoto - Docker Image Scan

```json
{
  "name": "Makoto - Docker Image Scan",
  "nodes": [
    {
      "name": "Cron - 03h00",
      "type": "n8n-nodes-base.cron",
      "parameters": {
        "cronExpression": "0 3 * * *"
      }
    },
    {
      "name": "Push Image (registre)",
      "type": "n8n-nodes-base.webhook",
      "parameters": {
        "path": "makoto/registry-push",
        "httpMethod": "POST"
      }
    },
    {
      "name": "Scan des images Docker",
      "type": "n8n-nodes-base.executeCommand",
      "parameters": {
        "command": "/opt/gl-tower/makoto/scans/scan-images.sh"
      }
    },
    {
      "name": "Scan web",
      "type": "n8n-nodes-base.executeCommand",
      "parameters": {
        "command": "/opt/gl-tower/makoto/scans/scan-web.sh https://gldigitallab.fr"
      }
    },
    {
      "name": "Analyse des résultats",
      "type": "n8n-nodes-base.code",
      "parameters": {
        "jsCode": "const fs = require('fs');\nconst dir = '/opt/gl-tower/makoto/reports';\nconst date = new Date().toISOString().slice(0, 10).replace(/-/g, '');\nlet criticalCount = 0;\nlet highCount = 0;\nfor (const file of fs.readdirSync(dir).filter((f) => f.startsWith('trivy-') && f.endsWith('.json'))) {\n  const report = JSON.parse(fs.readFileSync(dir + '/' + file, 'utf8'));\n  for (const result of report.Results || []) {\n    for (const vuln of result.Vulnerabilities || []) {\n      if (vuln.Severity === 'CRITICAL') criticalCount++;\n      else if (vuln.Severity === 'HIGH') highCount++;\n    }\n  }\n}\nlet nucleiFindings = 0;\ntry {\n  nucleiFindings = fs.readFileSync(dir + '/nuclei-' + date + '.txt', 'utf8').split('\\n').filter((l) => l.trim().length > 0).length;\n} catch (e) {}\nreturn [{ json: { criticalCount, highCount, nucleiFindings } }];"
      }
    },
    {
      "name": "Vulnérabilités critiques ?",
      "type": "n8n-nodes-base.if",
      "parameters": {
        "conditions": {
          "number": [
            {
              "value1": "={{ $json.criticalCount }}",
              "operation": "larger",
              "value2": 0
            }
          ]
        }
      }
    },
    {
      "name": "Alerte critique",
      "type": "n8n-nodes-base.discord",
      "parameters": {
        "webhookUri": "={{ $env.MAKOTO_CRITICAL_WEBHOOK }}",
        "content": "🚨 **ALERTE CRITIQUE MAKOTO**\n\n{{ $json.criticalCount }} vulnérabilité(s) critique(s) détectée(s) !\n\nRevue immédiate : /opt/gl-tower/makoto/reports/"
      }
    },
    {
      "name": "Rapport quotidien",
      "type": "n8n-nodes-base.discord",
      "parameters": {
        "webhookUri": "={{ $env.MAKOTO_WEBHOOK }}",
        "content": "🛡️ **Makoto - Rapport de sécurité quotidien**\n\n🔴 Critiques : {{ $json.criticalCount }}\n🟠 Élevées : {{ $json.highCount }}\n🌐 Résultats web : {{ $json.nucleiFindings }}\n\n_Scan terminé à {{ $now }}_"
      }
    }
  ]
}
```

#### Workflow : Makoto - Intrusion Detection (alertes Wazuh)

```json
{
  "name": "Makoto - Intrusion Detection",
  "nodes": [
    {
      "name": "Webhook - Alerte Wazuh",
      "type": "n8n-nodes-base.webhook",
      "parameters": {
        "path": "makoto/wazuh-alert",
        "httpMethod": "POST"
      }
    },
    {
      "name": "Filtrer par niveau",
      "type": "n8n-nodes-base.if",
      "parameters": {
        "conditions": {
          "number": [
            {
              "value1": "={{ $json.rule.level }}",
              "operation": "largerEqual",
              "value2": 12
            }
          ]
        }
      }
    },
    {
      "name": "Bloquer la source",
      "type": "n8n-nodes-base.executeCommand",
      "parameters": {
        "command": "={{ '/opt/gl-tower/makoto/scans/block-ip.sh ' + $json.srcip }}"
      }
    },
    {
      "name": "Alerte critique",
      "type": "n8n-nodes-base.discord",
      "parameters": {
        "webhookUri": "={{ $env.MAKOTO_CRITICAL_WEBHOOK }}",
        "content": "🚨 **MAKOTO : INTRUSION DÉTECTÉE**\n\nRègle : {{ $json.rule.description }}\nSource : {{ $json.srcip }}\nAgent : {{ $json.agent.name }}\n\nDétail : {{ $json.full_log }}"
      }
    },
    {
      "name": "Créer le ticket d'incident",
      "type": "n8n-nodes-base.httpRequest",
      "parameters": {
        "url": "http://wa-n8n:5678/webhook/makoto/incident",
        "method": "POST",
        "body": {
          "type": "INTRUSION",
          "severity": "CRITICAL",
          "source": "={{ $json.srcip }}",
          "details": "={{ $json.full_log }}"
        }
      }
    }
  ]
}
```

### 🧪 Exemples — Tests & QA

#### Workflow : Makoto - PHPUnit Test Suite (sur pull request)

```json
{
  "name": "Makoto - PHPUnit Test Suite",
  "nodes": [
    {
      "name": "Webhook - PR GitHub",
      "type": "n8n-nodes-base.webhook",
      "parameters": {
        "path": "makoto/phpunit",
        "httpMethod": "POST"
      }
    },
    {
      "name": "Exécuter PHPUnit",
      "type": "n8n-nodes-base.executeCommand",
      "parameters": {
        "command": "php bin/phpunit --coverage-clover coverage.xml"
      }
    },
    {
      "name": "Exécuter Vitest",
      "type": "n8n-nodes-base.executeCommand",
      "parameters": {
        "command": "npm run test -- --coverage"
      }
    },
    {
      "name": "Analyser la couverture",
      "type": "n8n-nodes-base.code",
      "parameters": {
        "jsCode": "// { passed, failed, coverage } reconstruits depuis les rapports PHPUnit et Vitest"
      }
    },
    {
      "name": "Échecs détectés ?",
      "type": "n8n-nodes-base.if",
      "parameters": {
        "conditions": {
          "number": [
            {
              "value1": "={{ $json.failed }}",
              "operation": "larger",
              "value2": 0
            }
          ]
        }
      }
    },
    {
      "name": "Commenter la PR",
      "type": "n8n-nodes-base.github",
      "parameters": {
        "operation": "createComment",
        "body": "🧪 **Makoto** — Tests : {{ $json.passed }}/{{ $json.total }} réussis — Couverture : {{ $json.coverage }} %"
      }
    },
    {
      "name": "Alerte Discord",
      "type": "n8n-nodes-base.discord",
      "parameters": {
        "webhookUri": "={{ $env.MAKOTO_WEBHOOK }}",
        "content": "🔴 **Makoto** — Échecs sur la pull request : {{ $json.failed }} test(s) à corriger."
      }
    }
  ]
}
```

#### Workflow : Makoto - E2E Test Suite (pré-déploiement)

```json
{
  "name": "Makoto - E2E Test Suite",
  "nodes": [
    {
      "name": "Webhook - Pré-déploiement",
      "type": "n8n-nodes-base.webhook",
      "parameters": {
        "path": "makoto/e2e",
        "httpMethod": "POST"
      }
    },
    {
      "name": "Exécuter Playwright",
      "type": "n8n-nodes-base.executeCommand",
      "parameters": {
        "command": "npx playwright test --reporter=json"
      }
    },
    {
      "name": "Analyser les résultats",
      "type": "n8n-nodes-base.code",
      "parameters": {
        "jsCode": "// { passed, failed, total } et artefacts (captures) issus du rapport Playwright"
      }
    },
    {
      "name": "Échecs détectés ?",
      "type": "n8n-nodes-base.if",
      "parameters": {
        "conditions": {
          "number": [
            {
              "value1": "={{ $json.failed }}",
              "operation": "larger",
              "value2": 0
            }
          ]
        }
      }
    },
    {
      "name": "Alerte échec",
      "type": "n8n-nodes-base.discord",
      "parameters": {
        "webhookUri": "={{ $env.MAKOTO_CRITICAL_WEBHOOK }}",
        "content": "🔴 **Makoto** — E2E : {{ $json.passed }}/{{ $json.total }} — le déploiement est bloqué."
      }
    },
    {
      "name": "Rapport succès",
      "type": "n8n-nodes-base.discord",
      "parameters": {
        "webhookUri": "={{ $env.MAKOTO_WEBHOOK }}",
        "content": "🟢 **Makoto** — E2E : {{ $json.passed }}/{{ $json.total }} tests réussis."
      }
    }
  ]
}
```

#### Workflow : Makoto - Smoke Tests (post-déploiement)

```json
{
  "name": "Makoto - Smoke Tests",
  "nodes": [
    {
      "name": "Webhook - Post-déploiement",
      "type": "n8n-nodes-base.webhook",
      "parameters": {
        "path": "makoto/smoke",
        "httpMethod": "POST"
      }
    },
    {
      "name": "Vérifier les parcours critiques",
      "type": "n8n-nodes-base.executeCommand",
      "parameters": {
        "command": "npx playwright test tests/smoke --reporter=json"
      }
    },
    {
      "name": "Analyser les résultats",
      "type": "n8n-nodes-base.code",
      "parameters": {
        "jsCode": "// { failed, passed } depuis le rapport Playwright JSON"
      }
    },
    {
      "name": "Échec ?",
      "type": "n8n-nodes-base.if",
      "parameters": {
        "conditions": {
          "number": [
            {
              "value1": "={{ $json.failed }}",
              "operation": "larger",
              "value2": 0
            }
          ]
        }
      }
    },
    {
      "name": "Déclencher le retour arrière",
      "type": "n8n-nodes-base.httpRequest",
      "parameters": {
        "url": "http://wa-n8n:5678/webhook/makoto/rollback",
        "method": "POST",
        "body": {
          "cause": "SMOKE_FAILED"
        }
      }
    },
    {
      "name": "Notifier l'équipage",
      "type": "n8n-nodes-base.discord",
      "parameters": {
        "webhookUri": "={{ $env.MAKOTO_CRITICAL_WEBHOOK }}",
        "content": "🚨 **Makoto** — Smoke tests en échec après déploiement : retour arrière déclenché via Wa."
      }
    }
  ]
}
```

#### Workflow : Makoto - Mutation Testing (nocturne)

```json
{
  "name": "Makoto - Mutation Testing",
  "nodes": [
    {
      "name": "Cron - Nocturne",
      "type": "n8n-nodes-base.cron",
      "parameters": {
        "cronExpression": "0 2 * * *"
      }
    },
    {
      "name": "Exécuter Infection",
      "type": "n8n-nodes-base.executeCommand",
      "parameters": {
        "command": "php vendor/bin/infection --min-msi=80 --threads=4"
      }
    },
    {
      "name": "Analyser le score",
      "type": "n8n-nodes-base.code",
      "parameters": {
        "jsCode": "// { msi, killed, escaped } lus depuis le rapport Infection"
      }
    },
    {
      "name": "Rapport Mutation",
      "type": "n8n-nodes-base.discord",
      "parameters": {
        "webhookUri": "={{ $env.MAKOTO_WEBHOOK }}",
        "content": "🧬 **Makoto** — Mutation Testing : MSI {{ $json.msi }} % ({{ $json.killed }} mutants tués, {{ $json.escaped }} échappés)."
      }
    }
  ]
}
```

### Rapport hebdomadaire (conformité & qualité)

Routine dérivée des workflows officiels : un cron « vendredi 17 h » enchaîne l'audit système (`scans/audit-system.sh`), l'agrégation des alertes Wazuh de la semaine et les statistiques des campagnes de tests (PHPUnit, E2E, smoke), puis publie le rapport consolidé sur le canal `MAKOTO_WEBHOOK` :

- Indice de durcissement Lynis de la semaine ;
- Compteurs d'alertes par sévérité (critique, élevée, moyenne) ;
- État de l'intégrité des fichiers et du scanning de vulnérabilités ;
- Taux de réussite des suites de tests et couverture moyenne ;
- Actions de rotation de secrets réalisées.

---

## 📊 Objectifs

> Les valeurs ci-dessous sont des **objectifs (cibles)** de la Loi, pas des mesures constatées. Les mesures réelles sont consignées dans les rapports quotidiens et hebdomadaires de Makoto.

### 🔐 Sécurité

| Objectif | Cible |
|----------|-------|
| Délai moyen de détection (MTTD) | < 5 min |
| Délai moyen de réponse (MTTR) | < 30 min |
| Âge moyen des CVE sans correctif | < 7 jours |
| Taux de faux positifs des alertes | < 5 % |
| Couverture des systèmes surveillés | 100 % |

### 🧪 Tests & QA

| Objectif | Cible |
|----------|-------|
| Couverture de code (backend) | ≥ 80 % |
| Couverture de code (frontend) | ≥ 75 % |
| Taux de réussite des suites E2E | 100 % |
| Score de mutation (MSI) | ≥ 80 % |
| Durée d'exécution de la suite de tests | < 5 min |
| Taux de tests instables (flaky) | < 2 % |

---

## 🚨 Procédures d'incident

### Incident Response Playbook

```markdown
## 🚨 Réponse à incident — Makoto

### 1. Détection
- [ ] Alerte reçue via Wazuh / workflows Wa
- [ ] Vérifier la sévérité (critique / élevée / moyenne)
- [ ] Notifier l'équipe si critique

### 2. Confinement
- [ ] Isoler le système affecté si nécessaire
- [ ] Bloquer les adresses suspectes (scans/block-ip.sh)
- [ ] Préserver les journaux

### 3. Investigation
- [ ] Analyser les journaux Wazuh
- [ ] Vérifier les fichiers modifiés (syscheck)
- [ ] Identifier le vecteur d'attaque

### 4. Remédiation
- [ ] Appliquer les correctifs nécessaires
- [ ] Tourner les secrets compromis (manage-secrets.sh rotate)
- [ ] Renforcer les règles du pare-feu

### 5. Rétablissement
- [ ] Restaurer les services
- [ ] Vérifier l'intégrité
- [ ] Surveiller la récurrence

### 6. Post-incident
- [ ] Documenter l'incident
- [ ] Mettre à jour les règles de détection Makoto
- [ ] Rapport post-mortem transmis à Wa
```

---

## 🧩 Interactions avec l'équipage

| Partenaire | Échange |
|------------|---------|
| **Wa** (coordinatrice) | Reçoit les alertes, tickets d'incident et demandes de retour arrière (`http://wa-n8n:5678/webhook/makoto/...`) ; déclenche les scans, rotations et campagnes de tests |
| **CI / registre d'images** | Push d'image → Docker Image Scanner ; pull requests → suites PHPUnit/Vitest |
| **Réseau & hôtes** | Journaux Wazuh, journaux fail2ban, événements de connexion (détection d'anomalies) |
| **Dépôts (portfolio, API ARKADIA)** | Pré-déploiement → E2E ; post-déploiement → smoke tests |
| **Autres Lois ARKADIA** | Résultats des audits, rapports de sécurité et de qualité mis à disposition ; escalade des urgences via Wa |

---

## 🔧 Maintenance & Sauvegardes

### Maintenance régulière

```bash
# Mise à jour des bases CVE et templates (à exécuter chaque semaine)
~/gl-tower/makoto/scans/update-cve-db.sh

# Rotation complète des secrets (à exécuter selon le calendrier de rotation)
~/gl-tower/makoto/scans/rotate-all-secrets.sh
```

### Sauvegardes

```bash
# Configuration Wazuh, règles et configuration Vault
tar -czf ~/gl-tower/makoto/reports/backup-config-$(date +%Y%m%d).tar.gz \
  -C ~/gl-tower/makoto config rules

# Export des secrets Vault (chiffré, hors dépôt)
vault operator generate-root -init 2>/dev/null || true
vault kv list secret/gl-tower > ~/gl-tower/makoto/reports/vault-index-$(date +%Y%m%d).txt

# Rapports de scans et de tests (à verser dans l'archivage GL Tower)
tar -czf ~/gl-tower/makoto/reports/backup-reports-$(date +%Y%m%d).tar.gz \
  -C ~/gl-tower/makoto reports
```

> Les volumes Docker Wazuh (`wazuh-etc`, `wazuh-logs`, `wazuh-indexer-data`, …) et Vault (`vault-data`) sont des données d'état : ils doivent être inclus dans la stratégie de sauvegarde de la tour GL Tower, en plus des fichiers de configuration ci-dessus.

---

*Loi : Makoto — Équipage ARKADIA | GL Tower — NIVEAU 6*
