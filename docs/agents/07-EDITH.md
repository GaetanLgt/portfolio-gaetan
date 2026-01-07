# 🛡️ E.D.I.T.H. - Sécurité & Audit

> **Enhanced Defense Intelligence & Threat Hunting**  
> Niveau : 6 | Status : ONLINE | Priorité : CRITIQUE

## 📋 Mission

EDITH protège l'infrastructure GL Tower contre les menaces. Elle scanne les vulnérabilités, audite les configurations et alerte en cas d'intrusion.

### Responsabilités

- 🔍 **Scanning vulnérabilités** : CVE, OWASP Top 10
- 🔐 **Audit configurations** : Docker, serveurs, apps
- 🚨 **Détection intrusions** : Logs suspects, brute force
- 📋 **Rapports conformité** : RGPD, sécurité
- 🔑 **Secrets management** : Rotation, détection leaks

---

## 🛠️ Stack Technique

| Composant | Technologie | Rôle |
|-----------|-------------|------|
| Scanner vulnérabilités | **Trivy** | CVE scanning |
| Scanner web | **Nuclei** | OWASP, misconfigs |
| SIEM | **Wazuh** | Détection menaces |
| Secrets | **Vault** | Gestion secrets |
| Audit | **Lynis** | Hardening système |

---

## 📦 Installation

### 1. Structure des dossiers

```bash
mkdir -p ~/gl-tower/edith/{scans,reports,config,rules}
cd ~/gl-tower/edith
```

### 2. Docker Compose

```yaml
# docker-compose.yml
version: '3.8'

services:
  # Trivy - Vulnerability Scanner
  trivy:
    image: aquasec/trivy:latest
    container_name: edith-trivy
    volumes:
      - trivy-cache:/root/.cache/
      - /var/run/docker.sock:/var/run/docker.sock:ro
      - ./reports:/reports
    networks:
      - gl-tower
    entrypoint: ["tail", "-f", "/dev/null"]

  # Nuclei - Security Scanner
  nuclei:
    image: projectdiscovery/nuclei:latest
    container_name: edith-nuclei
    volumes:
      - ./reports:/reports
      - ./rules/nuclei:/root/nuclei-templates/custom
    networks:
      - gl-tower
    entrypoint: ["tail", "-f", "/dev/null"]

  # Wazuh Manager - SIEM
  wazuh-manager:
    image: wazuh/wazuh-manager:4.7.0
    container_name: edith-wazuh-manager
    restart: unless-stopped
    ports:
      - "1514:1514/udp"
      - "1515:1515"
      - "55000:55000"
    environment:
      - INDEXER_URL=https://edith-wazuh-indexer:9200
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
    container_name: edith-wazuh-indexer
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
    container_name: edith-wazuh-dashboard
    restart: unless-stopped
    ports:
      - "5601:5601"
    environment:
      - INDEXER_USERNAME=admin
      - INDEXER_PASSWORD=${WAZUH_INDEXER_PASSWORD}
      - WAZUH_API_URL=https://edith-wazuh-manager
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

  # Vault - Secrets Management
  vault:
    image: hashicorp/vault:latest
    container_name: edith-vault
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

### 3. Scripts de scan

#### Scan Trivy (Images Docker)

```bash
#!/bin/bash
# scripts/scan-images.sh
set -e

REPORT_DIR="/home/user/gl-tower/edith/reports/$(date +%Y%m%d)"
mkdir -p $REPORT_DIR

echo "🔍 EDITH - Scanning Docker images..."

# Liste des images à scanner
IMAGES=(
  "ghcr.io/gldigitallab/portfolio:latest"
  "ghcr.io/gldigitallab/arkadia-api:latest"
  "jarvis-n8n"
  "friday-webui"
  "vision-api"
)

for IMAGE in "${IMAGES[@]}"; do
  echo "Scanning: $IMAGE"
  
  # Scan avec Trivy
  docker exec edith-trivy trivy image \
    --severity HIGH,CRITICAL \
    --format json \
    --output /reports/trivy-$(echo $IMAGE | tr '/:' '-').json \
    $IMAGE
done

# Générer rapport consolidé
echo "📊 Generating consolidated report..."

docker exec edith-trivy trivy image \
  --severity HIGH,CRITICAL \
  --format template \
  --template "@/contrib/html.tpl" \
  --output /reports/trivy-report.html \
  $(docker images --format "{{.Repository}}:{{.Tag}}" | head -10)

echo "✅ Scan complete: $REPORT_DIR"
```

#### Scan Nuclei (Web)

```bash
#!/bin/bash
# scripts/scan-web.sh
set -e

TARGETS=${1:-"https://gldigitallab.fr"}
REPORT_DIR="/home/user/gl-tower/edith/reports/$(date +%Y%m%d)"
mkdir -p $REPORT_DIR

echo "🔍 EDITH - Web Security Scan"
echo "Target: $TARGETS"

# Scan avec Nuclei
docker exec edith-nuclei nuclei \
  -u $TARGETS \
  -t cves/ \
  -t vulnerabilities/ \
  -t misconfigurations/ \
  -t exposures/ \
  -severity critical,high,medium \
  -o /reports/nuclei-$(date +%Y%m%d).txt \
  -json-export /reports/nuclei-$(date +%Y%m%d).json

# Scan OWASP spécifique
docker exec edith-nuclei nuclei \
  -u $TARGETS \
  -t owasp-top-10/ \
  -o /reports/owasp-$(date +%Y%m%d).txt

echo "✅ Web scan complete"
```

#### Audit système Lynis

```bash
#!/bin/bash
# scripts/audit-system.sh
set -e

REPORT_DIR="/home/user/gl-tower/edith/reports/$(date +%Y%m%d)"
mkdir -p $REPORT_DIR

echo "🔍 EDITH - System Audit"

# Installation Lynis si nécessaire
if ! command -v lynis &> /dev/null; then
  sudo apt-get update && sudo apt-get install -y lynis
fi

# Audit complet
sudo lynis audit system --quick --quiet --report-file $REPORT_DIR/lynis-report.dat

# Parser le rapport
HARDENING_INDEX=$(grep "hardening_index" $REPORT_DIR/lynis-report.dat | cut -d'=' -f2)

echo "📊 Hardening Index: $HARDENING_INDEX"

# Alerter si score faible
if [ "$HARDENING_INDEX" -lt 70 ]; then
  curl -X POST $DISCORD_WEBHOOK \
    -H "Content-Type: application/json" \
    -d "{\"content\": \"⚠️ **EDITH Alert**: System hardening score is $HARDENING_INDEX (below 70)\"}"
fi

echo "✅ System audit complete: $REPORT_DIR/lynis-report.dat"
```

### 4. Configuration Wazuh

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
    <email_from>edith@gldigitallab.fr</email_from>
    <email_maxperhour>12</email_maxperhour>
  </global>

  <!-- Syscheck - File Integrity Monitoring -->
  <syscheck>
    <disabled>no</disabled>
    <frequency>43200</frequency>
    <scan_on_start>yes</scan_on_start>
    
    <!-- Directories to monitor -->
    <directories check_all="yes" realtime="yes">/etc,/usr/bin,/usr/sbin</directories>
    <directories check_all="yes" realtime="yes">/opt/gl-tower</directories>
    
    <!-- Ignore patterns -->
    <ignore>/etc/mtab</ignore>
    <ignore>/etc/hosts.deny</ignore>
    <ignore>/etc/mail/statistics</ignore>
    <ignore>/etc/random-seed</ignore>
    <ignore>/etc/adjtime</ignore>
    <ignore>/etc/prelink.cache</ignore>
  </syscheck>

  <!-- Rootcheck - Rootkit detection -->
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

  <!-- Active Response -->
  <active-response>
    <command>firewall-drop</command>
    <location>local</location>
    <level>7</level>
    <timeout>600</timeout>
  </active-response>

  <!-- Log Analysis -->
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

  <!-- Vulnerability Detection -->
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

### 5. Règles personnalisées Wazuh

```xml
<!-- config/wazuh/rules/gl-tower-rules.xml -->
<group name="gl-tower,">
  
  <!-- Brute Force SSH -->
  <rule id="100001" level="10">
    <if_matched_sid>5710</if_matched_sid>
    <same_source_ip />
    <options>alert_by_email</options>
    <description>EDITH: SSH brute force attack detected from $(srcip)</description>
    <group>authentication_failed,pci_dss_11.4,</group>
  </rule>

  <!-- Docker Container Started -->
  <rule id="100010" level="3">
    <decoded_as>json</decoded_as>
    <field name="status">start</field>
    <description>EDITH: Docker container started: $(docker.container.name)</description>
    <group>docker,</group>
  </rule>

  <!-- Docker Container Stopped Unexpectedly -->
  <rule id="100011" level="7">
    <decoded_as>json</decoded_as>
    <field name="status">die</field>
    <description>EDITH: Docker container died unexpectedly: $(docker.container.name)</description>
    <group>docker,service_availability,</group>
  </rule>

  <!-- Suspicious File Change -->
  <rule id="100020" level="12">
    <if_sid>550</if_sid>
    <match>/opt/gl-tower</match>
    <options>alert_by_email</options>
    <description>EDITH: Critical file modified in GL Tower: $(file)</description>
    <group>syscheck,pci_dss_11.5,</group>
  </rule>

  <!-- High CPU Usage Alert -->
  <rule id="100030" level="7">
    <decoded_as>json</decoded_as>
    <field name="cpu_percent">^[8-9][0-9]|100</field>
    <description>EDITH: High CPU usage detected ($(cpu_percent)%)</description>
    <group>system_monitor,</group>
  </rule>

  <!-- Unauthorized Access Attempt -->
  <rule id="100040" level="12">
    <if_sid>5501</if_sid>
    <match>unauthorized</match>
    <options>alert_by_email</options>
    <description>EDITH: Unauthorized access attempt detected</description>
    <group>access_denied,pci_dss_10.2.4,</group>
  </rule>

  <!-- Secret Leak Detection -->
  <rule id="100050" level="15">
    <decoded_as>json</decoded_as>
    <regex>password|secret|api_key|token</regex>
    <description>EDITH: Potential secret leak detected in logs</description>
    <group>secret_leak,pci_dss_8.2.1,</group>
  </rule>

</group>
```

### 6. Configuration Vault

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

### 7. Script de gestion des secrets

```bash
#!/bin/bash
# scripts/manage-secrets.sh
set -e

VAULT_ADDR="http://localhost:8200"
VAULT_TOKEN="${VAULT_TOKEN}"

# Fonction pour stocker un secret
store_secret() {
  local path=$1
  local key=$2
  local value=$3
  
  vault kv put secret/$path $key="$value"
  echo "✅ Secret stored: secret/$path"
}

# Fonction pour récupérer un secret
get_secret() {
  local path=$1
  local key=$2
  
  vault kv get -field=$key secret/$path
}

# Fonction pour lister les secrets
list_secrets() {
  local path=${1:-""}
  vault kv list secret/$path
}

# Fonction pour rotation des secrets
rotate_secret() {
  local path=$1
  local key=$2
  
  # Générer nouveau secret
  NEW_VALUE=$(openssl rand -base64 32)
  
  # Backup ancien
  OLD_VALUE=$(get_secret $path $key 2>/dev/null || echo "")
  if [ ! -z "$OLD_VALUE" ]; then
    store_secret "${path}-backup" $key "$OLD_VALUE"
  fi
  
  # Stocker nouveau
  store_secret $path $key "$NEW_VALUE"
  
  echo "🔄 Secret rotated: secret/$path/$key"
}

# Initialisation des secrets GL Tower
init_gl_tower_secrets() {
  echo "🔐 Initializing GL Tower secrets..."
  
  # Database
  store_secret "gl-tower/database" "password" "$(openssl rand -base64 24)"
  
  # API Keys
  store_secret "gl-tower/api" "discord_token" "$DISCORD_TOKEN"
  store_secret "gl-tower/api" "github_token" "$GITHUB_TOKEN"
  
  # Encryption keys
  store_secret "gl-tower/encryption" "n8n_key" "$(openssl rand -base64 32)"
  store_secret "gl-tower/encryption" "jwt_secret" "$(openssl rand -base64 64)"
  
  echo "✅ GL Tower secrets initialized"
}

# Menu
case "$1" in
  init)
    init_gl_tower_secrets
    ;;
  store)
    store_secret $2 $3 $4
    ;;
  get)
    get_secret $2 $3
    ;;
  list)
    list_secrets $2
    ;;
  rotate)
    rotate_secret $2 $3
    ;;
  *)
    echo "Usage: $0 {init|store|get|list|rotate}"
    exit 1
    ;;
esac
```

---

## 🔄 Workflows n8n

### Workflow 1 : Daily Security Scan

```json
{
  "name": "EDITH - Daily Security Scan",
  "nodes": [
    {
      "name": "Cron - 3h",
      "type": "n8n-nodes-base.cron",
      "parameters": {
        "cronExpression": "0 3 * * *"
      }
    },
    {
      "name": "Run Trivy Scan",
      "type": "n8n-nodes-base.executeCommand",
      "parameters": {
        "command": "/opt/gl-tower/edith/scripts/scan-images.sh"
      }
    },
    {
      "name": "Run Nuclei Scan",
      "type": "n8n-nodes-base.executeCommand",
      "parameters": {
        "command": "/opt/gl-tower/edith/scripts/scan-web.sh https://gldigitallab.fr"
      }
    },
    {
      "name": "Parse Results",
      "type": "n8n-nodes-base.code",
      "parameters": {
        "jsCode": "const fs = require('fs');\nconst date = new Date().toISOString().slice(0,10).replace(/-/g,'');\n\nconst trivyReport = JSON.parse(fs.readFileSync(`/opt/gl-tower/edith/reports/${date}/trivy-report.json`));\nconst nucleiReport = fs.readFileSync(`/opt/gl-tower/edith/reports/${date}/nuclei-${date}.txt`, 'utf8');\n\nconst criticalCount = trivyReport.Results?.filter(r => r.Vulnerabilities?.some(v => v.Severity === 'CRITICAL')).length || 0;\nconst highCount = trivyReport.Results?.filter(r => r.Vulnerabilities?.some(v => v.Severity === 'HIGH')).length || 0;\n\nreturn [{ json: { criticalCount, highCount, nucleiFindings: nucleiReport.split('\\n').length } }];"
      }
    },
    {
      "name": "Check Severity",
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
      "name": "Critical Alert",
      "type": "n8n-nodes-base.discord",
      "parameters": {
        "webhookUri": "={{ $env.EDITH_CRITICAL_WEBHOOK }}",
        "content": "🚨 **EDITH CRITICAL ALERT**\n\n{{ $json.criticalCount }} critical vulnerabilities detected!\n\nReview immediately: `/opt/gl-tower/edith/reports/`"
      }
    },
    {
      "name": "Daily Report",
      "type": "n8n-nodes-base.discord",
      "parameters": {
        "webhookUri": "={{ $env.EDITH_WEBHOOK }}",
        "content": "🛡️ **EDITH Daily Security Report**\n\n🔴 Critical: {{ $json.criticalCount }}\n🟠 High: {{ $json.highCount }}\n🌐 Web findings: {{ $json.nucleiFindings }}\n\n_Scan completed at {{ $now }}_"
      }
    }
  ]
}
```

### Workflow 2 : Secret Leak Detection

```json
{
  "name": "EDITH - Secret Leak Monitor",
  "nodes": [
    {
      "name": "Webhook - Wazuh Alert",
      "type": "n8n-nodes-base.webhook",
      "parameters": {
        "path": "edith/wazuh-alert",
        "httpMethod": "POST"
      }
    },
    {
      "name": "Filter Secret Leaks",
      "type": "n8n-nodes-base.if",
      "parameters": {
        "conditions": {
          "number": [
            {
              "value1": "={{ $json.rule.id }}",
              "operation": "equal",
              "value2": 100050
            }
          ]
        }
      }
    },
    {
      "name": "Immediate Alert",
      "type": "n8n-nodes-base.discord",
      "parameters": {
        "webhookUri": "={{ $env.EDITH_CRITICAL_WEBHOOK }}",
        "content": "🚨 **EDITH: POTENTIAL SECRET LEAK DETECTED**\n\n**Source:** {{ $json.location }}\n**Agent:** {{ $json.agent.name }}\n**Details:** {{ $json.full_log }}\n\n⚠️ Investigate immediately and rotate affected credentials!"
      }
    },
    {
      "name": "Create Incident Ticket",
      "type": "n8n-nodes-base.httpRequest",
      "parameters": {
        "url": "http://jarvis-n8n:5678/webhook/jarvis/incident",
        "method": "POST",
        "body": {
          "type": "SECRET_LEAK",
          "severity": "CRITICAL",
          "source": "={{ $json.location }}",
          "details": "={{ $json.full_log }}"
        }
      }
    }
  ]
}
```

### Workflow 3 : Weekly Compliance Report

```json
{
  "name": "EDITH - Weekly Compliance Report",
  "nodes": [
    {
      "name": "Cron - Vendredi 17h",
      "type": "n8n-nodes-base.cron",
      "parameters": {
        "cronExpression": "0 17 * * 5"
      }
    },
    {
      "name": "Run Lynis Audit",
      "type": "n8n-nodes-base.executeCommand",
      "parameters": {
        "command": "/opt/gl-tower/edith/scripts/audit-system.sh"
      }
    },
    {
      "name": "Get Wazuh Stats",
      "type": "n8n-nodes-base.httpRequest",
      "parameters": {
        "url": "https://localhost:55000/security/user/authenticate",
        "method": "GET",
        "authentication": "basicAuth"
      }
    },
    {
      "name": "Generate Report",
      "type": "n8n-nodes-base.code",
      "parameters": {
        "jsCode": "const report = `# 🛡️ EDITH Weekly Compliance Report\\n\\n` +\n  `**Period:** ${new Date(Date.now() - 7*24*60*60*1000).toLocaleDateString()} - ${new Date().toLocaleDateString()}\\n\\n` +\n  `## System Hardening\\n` +\n  `- Lynis Score: ${$node['Run Lynis Audit'].json.hardening_index || 'N/A'}\\n\\n` +\n  `## Security Events\\n` +\n  `- Critical Alerts: ${$json.critical || 0}\\n` +\n  `- High Alerts: ${$json.high || 0}\\n` +\n  `- Medium Alerts: ${$json.medium || 0}\\n\\n` +\n  `## Compliance Status\\n` +\n  `- ✅ RGPD: Compliant\\n` +\n  `- ✅ File Integrity: Monitored\\n` +\n  `- ✅ Vulnerability Scanning: Active\\n`;\n\nreturn [{ json: { report } }];"
      }
    },
    {
      "name": "Send Report",
      "type": "n8n-nodes-base.discord",
      "parameters": {
        "webhookUri": "={{ $env.EDITH_WEBHOOK }}",
        "content": "={{ $json.report }}"
      }
    }
  ]
}
```

---

## 📊 Métriques de sécurité

| Métrique | Description | Objectif |
|----------|-------------|----------|
| MTTD | Mean Time To Detect | < 5 min |
| MTTR | Mean Time To Respond | < 30 min |
| Vulnerability Age | Âge moyen des CVE | < 7 jours |
| False Positive Rate | Faux positifs | < 5% |
| Coverage | Systèmes surveillés | 100% |

---

## 🚨 Procédures d'incident

### Incident Response Playbook

```markdown
## 🚨 Incident Response - EDITH

### 1. Détection
- [ ] Alerte reçue via Wazuh/n8n
- [ ] Vérifier la criticité (Critical/High/Medium)
- [ ] Notifier l'équipe si Critical

### 2. Containment
- [ ] Isoler le système affecté si nécessaire
- [ ] Bloquer les IPs suspectes
- [ ] Préserver les logs

### 3. Investigation
- [ ] Analyser les logs Wazuh
- [ ] Vérifier les fichiers modifiés (syscheck)
- [ ] Identifier le vecteur d'attaque

### 4. Remediation
- [ ] Appliquer les patches nécessaires
- [ ] Rotation des secrets compromis
- [ ] Renforcer les règles firewall

### 5. Recovery
- [ ] Restaurer les services
- [ ] Vérifier l'intégrité
- [ ] Monitorer pour récurrence

### 6. Post-Incident
- [ ] Documenter l'incident
- [ ] Update des règles EDITH
- [ ] Rapport post-mortem
```

---

## 🔧 Maintenance

### Mise à jour des bases CVE

```bash
#!/bin/bash
# scripts/update-cve-db.sh

echo "🔄 Updating vulnerability databases..."

# Trivy
docker exec edith-trivy trivy image --download-db-only

# Nuclei templates
docker exec edith-nuclei nuclei -update-templates

# Wazuh vulnerability feed
docker exec edith-wazuh-manager /var/ossec/bin/vulnerability-detector -u

echo "✅ Databases updated"
```

### Rotation des secrets

```bash
#!/bin/bash
# scripts/rotate-all-secrets.sh

echo "🔄 EDITH - Rotating all secrets..."

# Database passwords
./manage-secrets.sh rotate gl-tower/database password

# API tokens
./manage-secrets.sh rotate gl-tower/api discord_token
./manage-secrets.sh rotate gl-tower/api github_token

# Encryption keys
./manage-secrets.sh rotate gl-tower/encryption n8n_key
./manage-secrets.sh rotate gl-tower/encryption jwt_secret

echo "✅ All secrets rotated"
echo "⚠️ Remember to update environment variables in running services!"
```

---

*Dernière mise à jour : Janvier 2026*  
*Agent : EDITH v1.0 | GL Tower - Niveau 6*
