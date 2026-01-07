# 🚀 V.E.R.O.N.I.C.A. - DevOps & Déploiement

> **Virtual Environment for Resource Optimization, Network Infrastructure & Continuous Automation**  
> Niveau : 5 | Status : ONLINE | Priorité : HAUTE

## 📋 Mission

VERONICA gère le **cycle de vie complet des déploiements**. Elle automatise les pipelines CI/CD, provisionne l'infrastructure et assure des rollbacks en cas de problème.

### Responsabilités

- 🔄 **CI/CD** : Build, test, deploy automatisés
- 📦 **Infrastructure as Code** : Provisioning Docker/Ansible
- 🔙 **Rollback** : Retour arrière intelligent
- 🏗️ **Environnements** : Dev, staging, production
- 📋 **Release Notes** : Génération automatique

---

## 🛠️ Stack Technique

| Composant | Technologie | Rôle |
|-----------|-------------|------|
| CI/CD | **GitHub Actions** | Pipelines automatisés |
| Registry | **GitHub Container Registry** | Images Docker |
| IaC | **Ansible** | Configuration serveurs |
| Orchestration | **Docker Compose** | Déploiement containers |
| Notifications | **n8n + Discord** | Alerts déploiement |

---

## 📦 Installation

### 1. Structure du projet

```bash
mkdir -p ~/gl-tower/veronica/{ansible,scripts,templates}
cd ~/gl-tower/veronica
```

### 2. GitHub Actions - CI/CD Pipeline

```yaml
# .github/workflows/deploy.yml
name: VERONICA - Deploy Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]
  workflow_dispatch:
    inputs:
      environment:
        description: 'Environment to deploy'
        required: true
        default: 'staging'
        type: choice
        options:
          - staging
          - production

env:
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}

jobs:
  # ============================================
  # JOB 1: Build & Test
  # ============================================
  build:
    name: 🔨 Build & Test
    runs-on: ubuntu-latest
    outputs:
      version: ${{ steps.version.outputs.version }}
      
    steps:
      - name: 📥 Checkout
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: 🏷️ Generate Version
        id: version
        run: |
          VERSION=$(date +%Y%m%d)-$(git rev-parse --short HEAD)
          echo "version=$VERSION" >> $GITHUB_OUTPUT
          echo "📦 Version: $VERSION"

      - name: 🐳 Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: 🔐 Login to Registry
        uses: docker/login-action@v3
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: 📦 Build Image
        uses: docker/build-push-action@v5
        with:
          context: .
          push: false
          load: true
          tags: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:${{ steps.version.outputs.version }}
          cache-from: type=gha
          cache-to: type=gha,mode=max

      - name: 🧪 Run Tests
        run: |
          docker run --rm ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:${{ steps.version.outputs.version }} npm test

      - name: 📤 Push Image
        if: github.event_name != 'pull_request'
        uses: docker/build-push-action@v5
        with:
          context: .
          push: true
          tags: |
            ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:${{ steps.version.outputs.version }}
            ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:latest

  # ============================================
  # JOB 2: Security Scan
  # ============================================
  security:
    name: 🛡️ Security Scan
    runs-on: ubuntu-latest
    needs: build
    
    steps:
      - name: 📥 Checkout
        uses: actions/checkout@v4

      - name: 🔍 Run Trivy vulnerability scanner
        uses: aquasecurity/trivy-action@master
        with:
          image-ref: '${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:${{ needs.build.outputs.version }}'
          format: 'sarif'
          output: 'trivy-results.sarif'
          severity: 'CRITICAL,HIGH'

      - name: 📤 Upload Trivy scan results
        uses: github/codeql-action/upload-sarif@v2
        with:
          sarif_file: 'trivy-results.sarif'

  # ============================================
  # JOB 3: Deploy Staging
  # ============================================
  deploy-staging:
    name: 🚀 Deploy Staging
    runs-on: ubuntu-latest
    needs: [build, security]
    if: github.ref == 'refs/heads/develop'
    environment: staging
    
    steps:
      - name: 📥 Checkout
        uses: actions/checkout@v4

      - name: 🔧 Setup SSH
        uses: webfactory/ssh-agent@v0.8.0
        with:
          ssh-private-key: ${{ secrets.STAGING_SSH_KEY }}

      - name: 🚀 Deploy to Staging
        env:
          VERSION: ${{ needs.build.outputs.version }}
          HOST: ${{ secrets.STAGING_HOST }}
        run: |
          ssh -o StrictHostKeyChecking=no deploy@$HOST << 'EOF'
            cd /opt/gl-tower
            
            # Pull new image
            docker pull ghcr.io/${{ env.IMAGE_NAME }}:${{ env.VERSION }}
            
            # Update docker-compose
            sed -i "s|image:.*|image: ghcr.io/${{ env.IMAGE_NAME }}:${{ env.VERSION }}|g" docker-compose.yml
            
            # Deploy with zero-downtime
            docker compose up -d --no-deps --scale app=2 app
            sleep 10
            docker compose up -d --no-deps --scale app=1 app
            
            # Health check
            curl -f http://localhost/health || exit 1
            
            echo "✅ Staging deployed: ${{ env.VERSION }}"
          EOF

      - name: 📢 Notify Discord
        uses: sarisia/actions-status-discord@v1
        with:
          webhook: ${{ secrets.DISCORD_WEBHOOK }}
          title: "🚀 VERONICA - Staging Deployed"
          description: "Version `${{ needs.build.outputs.version }}` deployed to staging"
          color: 0x10B981

  # ============================================
  # JOB 4: Deploy Production
  # ============================================
  deploy-production:
    name: 🚀 Deploy Production
    runs-on: ubuntu-latest
    needs: [build, security]
    if: github.ref == 'refs/heads/main'
    environment: production
    
    steps:
      - name: 📥 Checkout
        uses: actions/checkout@v4

      - name: 🔧 Setup SSH
        uses: webfactory/ssh-agent@v0.8.0
        with:
          ssh-private-key: ${{ secrets.PROD_SSH_KEY }}

      - name: 📸 Create Backup
        env:
          HOST: ${{ secrets.PROD_HOST }}
        run: |
          ssh -o StrictHostKeyChecking=no deploy@$HOST << 'EOF'
            cd /opt/gl-tower
            
            # Backup current version
            CURRENT=$(docker compose images -q app | head -1)
            echo $CURRENT > /opt/backups/last-version.txt
            
            # Backup database
            docker exec postgres pg_dump -U app app > /opt/backups/db-$(date +%Y%m%d-%H%M).sql
            
            echo "📸 Backup created"
          EOF

      - name: 🚀 Deploy to Production
        env:
          VERSION: ${{ needs.build.outputs.version }}
          HOST: ${{ secrets.PROD_HOST }}
        run: |
          ssh -o StrictHostKeyChecking=no deploy@$HOST << 'EOF'
            cd /opt/gl-tower
            
            # Pull new image
            docker pull ghcr.io/${{ env.IMAGE_NAME }}:${{ env.VERSION }}
            
            # Blue-Green deployment
            docker compose -f docker-compose.prod.yml up -d --no-deps app-blue
            sleep 15
            
            # Health check blue
            if curl -f http://localhost:8081/health; then
              # Switch traffic
              docker compose -f docker-compose.prod.yml stop app-green
              docker compose -f docker-compose.prod.yml up -d --no-deps app-green
              sleep 5
              docker compose -f docker-compose.prod.yml stop app-blue
              echo "✅ Blue-Green deployment successful"
            else
              echo "❌ Health check failed, keeping green"
              docker compose -f docker-compose.prod.yml stop app-blue
              exit 1
            fi
          EOF

      - name: 📢 Notify Discord
        uses: sarisia/actions-status-discord@v1
        with:
          webhook: ${{ secrets.DISCORD_WEBHOOK }}
          title: "🚀 VERONICA - Production Deployed"
          description: "Version `${{ needs.build.outputs.version }}` is now live!"
          color: 0x10B981

  # ============================================
  # JOB 5: Generate Release Notes
  # ============================================
  release-notes:
    name: 📝 Release Notes
    runs-on: ubuntu-latest
    needs: [build, deploy-production]
    if: github.ref == 'refs/heads/main'
    
    steps:
      - name: 📥 Checkout
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: 📝 Generate Changelog
        id: changelog
        run: |
          LAST_TAG=$(git describe --tags --abbrev=0 2>/dev/null || echo "")
          if [ -z "$LAST_TAG" ]; then
            COMMITS=$(git log --oneline -20)
          else
            COMMITS=$(git log --oneline $LAST_TAG..HEAD)
          fi
          
          echo "changelog<<EOF" >> $GITHUB_OUTPUT
          echo "$COMMITS" >> $GITHUB_OUTPUT
          echo "EOF" >> $GITHUB_OUTPUT

      - name: 🏷️ Create Release
        uses: actions/create-release@v1
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        with:
          tag_name: v${{ needs.build.outputs.version }}
          release_name: Release ${{ needs.build.outputs.version }}
          body: |
            ## 🚀 Release ${{ needs.build.outputs.version }}
            
            ### Changes
            ${{ steps.changelog.outputs.changelog }}
            
            ### Deployment
            - ✅ Deployed to production
            - 🔗 [Live Site](https://gldigitallab.fr)
            
            ---
            *Generated by VERONICA*
          draft: false
          prerelease: false
```

### 3. Rollback Workflow

```yaml
# .github/workflows/rollback.yml
name: VERONICA - Rollback

on:
  workflow_dispatch:
    inputs:
      version:
        description: 'Version to rollback to (e.g., 20260105-abc1234)'
        required: true
      environment:
        description: 'Environment'
        required: true
        type: choice
        options:
          - staging
          - production

jobs:
  rollback:
    name: 🔙 Rollback to ${{ github.event.inputs.version }}
    runs-on: ubuntu-latest
    environment: ${{ github.event.inputs.environment }}
    
    steps:
      - name: 📢 Notify Start
        uses: sarisia/actions-status-discord@v1
        with:
          webhook: ${{ secrets.DISCORD_WEBHOOK }}
          title: "⚠️ VERONICA - Rollback Started"
          description: "Rolling back ${{ github.event.inputs.environment }} to `${{ github.event.inputs.version }}`"
          color: 0xF59E0B

      - name: 🔧 Setup SSH
        uses: webfactory/ssh-agent@v0.8.0
        with:
          ssh-private-key: ${{ github.event.inputs.environment == 'production' && secrets.PROD_SSH_KEY || secrets.STAGING_SSH_KEY }}

      - name: 🔙 Execute Rollback
        env:
          VERSION: ${{ github.event.inputs.version }}
          HOST: ${{ github.event.inputs.environment == 'production' && secrets.PROD_HOST || secrets.STAGING_HOST }}
        run: |
          ssh -o StrictHostKeyChecking=no deploy@$HOST << 'EOF'
            cd /opt/gl-tower
            
            # Pull the old version
            docker pull ghcr.io/${{ env.IMAGE_NAME }}:${{ env.VERSION }}
            
            # Update and restart
            sed -i "s|image:.*|image: ghcr.io/${{ env.IMAGE_NAME }}:${{ env.VERSION }}|g" docker-compose.yml
            docker compose up -d --force-recreate app
            
            # Health check
            sleep 10
            curl -f http://localhost/health || exit 1
            
            echo "✅ Rollback complete to ${{ env.VERSION }}"
          EOF

      - name: 📢 Notify Complete
        uses: sarisia/actions-status-discord@v1
        with:
          webhook: ${{ secrets.DISCORD_WEBHOOK }}
          title: "✅ VERONICA - Rollback Complete"
          description: "${{ github.event.inputs.environment }} rolled back to `${{ github.event.inputs.version }}`"
          color: 0x10B981
```

### 4. Ansible Playbooks

```yaml
# ansible/playbooks/setup-server.yml
---
- name: Setup GL Tower Server
  hosts: gl_servers
  become: yes
  vars:
    docker_compose_version: "2.24.0"
    
  tasks:
    - name: Update apt cache
      apt:
        update_cache: yes
        cache_valid_time: 3600

    - name: Install required packages
      apt:
        name:
          - apt-transport-https
          - ca-certificates
          - curl
          - gnupg
          - lsb-release
          - python3-pip
        state: present

    - name: Add Docker GPG key
      apt_key:
        url: https://download.docker.com/linux/ubuntu/gpg
        state: present

    - name: Add Docker repository
      apt_repository:
        repo: deb https://download.docker.com/linux/ubuntu {{ ansible_distribution_release }} stable
        state: present

    - name: Install Docker
      apt:
        name:
          - docker-ce
          - docker-ce-cli
          - containerd.io
          - docker-buildx-plugin
          - docker-compose-plugin
        state: present

    - name: Add deploy user to docker group
      user:
        name: deploy
        groups: docker
        append: yes

    - name: Create application directories
      file:
        path: "{{ item }}"
        state: directory
        owner: deploy
        group: deploy
        mode: '0755'
      loop:
        - /opt/gl-tower
        - /opt/backups
        - /opt/logs

    - name: Configure Docker logging
      copy:
        content: |
          {
            "log-driver": "json-file",
            "log-opts": {
              "max-size": "10m",
              "max-file": "3"
            }
          }
        dest: /etc/docker/daemon.json
      notify: Restart Docker

    - name: Setup UFW firewall
      ufw:
        rule: allow
        port: "{{ item }}"
        proto: tcp
      loop:
        - '22'
        - '80'
        - '443'

    - name: Enable UFW
      ufw:
        state: enabled
        policy: deny

  handlers:
    - name: Restart Docker
      service:
        name: docker
        state: restarted
```

```yaml
# ansible/playbooks/deploy-app.yml
---
- name: Deploy Application
  hosts: gl_servers
  become: yes
  become_user: deploy
  vars:
    app_version: "{{ version | default('latest') }}"
    app_name: "gl-tower"
    
  tasks:
    - name: Login to GitHub Container Registry
      community.docker.docker_login:
        registry: ghcr.io
        username: "{{ github_user }}"
        password: "{{ github_token }}"

    - name: Pull application image
      community.docker.docker_image:
        name: "ghcr.io/{{ github_repo }}:{{ app_version }}"
        source: pull
        force_source: yes

    - name: Copy docker-compose file
      template:
        src: templates/docker-compose.yml.j2
        dest: /opt/gl-tower/docker-compose.yml
        owner: deploy
        group: deploy
        mode: '0644'

    - name: Copy environment file
      template:
        src: templates/.env.j2
        dest: /opt/gl-tower/.env
        owner: deploy
        group: deploy
        mode: '0600'

    - name: Start application
      community.docker.docker_compose:
        project_src: /opt/gl-tower
        state: present
        pull: yes
        recreate: smart

    - name: Wait for application to be healthy
      uri:
        url: "http://localhost/health"
        status_code: 200
      register: result
      until: result.status == 200
      retries: 30
      delay: 5

    - name: Cleanup old images
      community.docker.docker_prune:
        images: yes
        images_filters:
          dangling: true
```

### 5. Docker Compose Production

```yaml
# templates/docker-compose.prod.yml.j2
version: '3.8'

services:
  # Reverse Proxy
  traefik:
    image: traefik:v3.0
    container_name: traefik
    restart: unless-stopped
    command:
      - "--api.dashboard=true"
      - "--providers.docker=true"
      - "--providers.docker.exposedbydefault=false"
      - "--entrypoints.web.address=:80"
      - "--entrypoints.websecure.address=:443"
      - "--certificatesresolvers.letsencrypt.acme.httpchallenge=true"
      - "--certificatesresolvers.letsencrypt.acme.httpchallenge.entrypoint=web"
      - "--certificatesresolvers.letsencrypt.acme.email={{ admin_email }}"
      - "--certificatesresolvers.letsencrypt.acme.storage=/letsencrypt/acme.json"
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:ro
      - traefik-certs:/letsencrypt
    networks:
      - gl-tower
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.dashboard.rule=Host(`traefik.{{ domain }}`)"
      - "traefik.http.routers.dashboard.service=api@internal"
      - "traefik.http.routers.dashboard.middlewares=auth"
      - "traefik.http.middlewares.auth.basicauth.users={{ traefik_auth }}"

  # Application - Green (active)
  app-green:
    image: ghcr.io/{{ github_repo }}:{{ app_version }}
    container_name: app-green
    restart: unless-stopped
    environment:
      - NODE_ENV=production
      - DATABASE_URL={{ database_url }}
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
    networks:
      - gl-tower
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.app.rule=Host(`{{ domain }}`)"
      - "traefik.http.routers.app.entrypoints=websecure"
      - "traefik.http.routers.app.tls.certresolver=letsencrypt"
      - "traefik.http.services.app.loadbalancer.server.port=3000"

  # Application - Blue (standby for blue-green deploy)
  app-blue:
    image: ghcr.io/{{ github_repo }}:{{ app_version }}
    container_name: app-blue
    restart: "no"
    profiles:
      - deploy
    environment:
      - NODE_ENV=production
      - DATABASE_URL={{ database_url }}
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 10s
      timeout: 5s
      retries: 3
    networks:
      - gl-tower
    ports:
      - "8081:3000"

  # Database
  postgres:
    image: postgres:16-alpine
    container_name: postgres
    restart: unless-stopped
    environment:
      POSTGRES_DB: {{ db_name }}
      POSTGRES_USER: {{ db_user }}
      POSTGRES_PASSWORD: {{ db_password }}
    volumes:
      - postgres-data:/var/lib/postgresql/data
    networks:
      - gl-tower
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U {{ db_user }}"]
      interval: 10s
      timeout: 5s
      retries: 5

  # Redis Cache
  redis:
    image: redis:7-alpine
    container_name: redis
    restart: unless-stopped
    command: redis-server --appendonly yes
    volumes:
      - redis-data:/data
    networks:
      - gl-tower

volumes:
  traefik-certs:
  postgres-data:
  redis-data:

networks:
  gl-tower:
    name: gl-tower-network
```

---

## 🔄 Workflows n8n

### Workflow : Deployment Notification

```json
{
  "name": "VERONICA - Deployment Notifications",
  "nodes": [
    {
      "name": "Webhook - GitHub",
      "type": "n8n-nodes-base.webhook",
      "parameters": {
        "path": "veronica/github-webhook",
        "httpMethod": "POST"
      }
    },
    {
      "name": "Filter Deploy Events",
      "type": "n8n-nodes-base.if",
      "parameters": {
        "conditions": {
          "string": [
            {
              "value1": "={{ $json.action }}",
              "operation": "equals",
              "value2": "completed"
            }
          ]
        }
      }
    },
    {
      "name": "Format Message",
      "type": "n8n-nodes-base.code",
      "parameters": {
        "jsCode": "const run = $input.first().json.workflow_run;\nconst status = run.conclusion === 'success' ? '✅' : '❌';\nconst env = run.name.includes('production') ? 'Production' : 'Staging';\n\nconst message = `${status} **VERONICA Deployment Report**\\n\\n` +\n  `**Environment:** ${env}\\n` +\n  `**Status:** ${run.conclusion}\\n` +\n  `**Duration:** ${Math.round((new Date(run.updated_at) - new Date(run.created_at)) / 1000)}s\\n` +\n  `**Commit:** \\`${run.head_sha.substring(0, 7)}\\`\\n\\n` +\n  `[View Run](${run.html_url})`;\n\nreturn [{ json: { message, success: run.conclusion === 'success' } }];"
      }
    },
    {
      "name": "Send to Discord",
      "type": "n8n-nodes-base.discord",
      "parameters": {
        "webhookUri": "={{ $env.VERONICA_WEBHOOK }}",
        "content": "={{ $json.message }}"
      }
    }
  ]
}
```

---

## 📊 Métriques

| Métrique | Description | Objectif |
|----------|-------------|----------|
| Deployment Frequency | Déploiements / semaine | > 5 |
| Lead Time | Commit → Production | < 30 min |
| MTTR | Temps de rollback | < 5 min |
| Change Failure Rate | Déploiements échoués | < 5% |
| Deployment Duration | Temps de déploiement | < 10 min |

---

## 🔧 Scripts utilitaires

### Quick Deploy

```bash
#!/bin/bash
# scripts/quick-deploy.sh
set -e

ENV=${1:-staging}
VERSION=${2:-latest}

echo "🚀 VERONICA Quick Deploy"
echo "Environment: $ENV"
echo "Version: $VERSION"

# Trigger GitHub Actions
gh workflow run deploy.yml \
  -f environment=$ENV \
  -f version=$VERSION

echo "✅ Deployment triggered"
echo "🔗 https://github.com/gldigitallab/gl-tower/actions"
```

### Health Check

```bash
#!/bin/bash
# scripts/health-check.sh
ENDPOINTS=(
  "https://gldigitallab.fr/health"
  "https://api.gldigitallab.fr/health"
  "https://staging.gldigitallab.fr/health"
)

for endpoint in "${ENDPOINTS[@]}"; do
  status=$(curl -s -o /dev/null -w "%{http_code}" $endpoint)
  if [ "$status" == "200" ]; then
    echo "✅ $endpoint"
  else
    echo "❌ $endpoint (HTTP $status)"
  fi
done
```

---

*Dernière mise à jour : Janvier 2026*  
*Agent : VERONICA v1.0 | GL Tower - Niveau 5*
