# 🚀 Jitsu — Backend, Build & Livraison (実)

> **実 Jitsu — Réalisation | Codename : DEPLOYER**
> GL Tower — NIVEAU 4 (étage 4) | Status : ONLINE | Priorité : HAUTE
> *« Faire, concrétiser, livrer. Les idées sans exécution ne sont que des rêves. »*

---

## 📋 Fiche d'identité

| Propriété | Valeur |
|-----------|--------|
| **Nom** | 実 Jitsu (roman : Jitsu, kanji : 実, sens : Réalisation) |
| **Codename** | DEPLOYER |
| **Rôle** | Backend, Build & Livraison |
| **Niveau** | 4 (NIVEAU 4) |
| **Avatar / Icône** | 🚀 |
| **Couleur** | `#8B5CF6` (Violet) |
| **Personnalité** | Méthodique, efficace, pragmatique |
| **Voix** | Efficace, procédurale |
| **Inspiration** | Quatrième Loi : faire, concrétiser, livrer |
| **Accroche** | « Faire, concrétiser, livrer. » |

### Capacités

| Capacité | Niveau |
|----------|--------|
| Symfony / Backend | 96 |
| API Platform | 92 |
| CI/CD | 96 |
| Docker / Build | 94 |

### Outils réels

| Outil | Icône | Status |
|-------|-------|--------|
| Symfony 8 | 🎵 | active |
| PHP 8.3+ | 🐘 | active |
| GitHub Actions | ⚡ | active |
| Docker | 🐳 | active |
| Vite | ⚡ | active |

---

## 🎯 Mission

Concevoir les backends et **livrer sans friction**. Jitsu couvre tout le cycle de vie technique de la conception à la mise en production : architecture Symfony, conception des APIs, pipelines CI/CD, outillage de build et déploiement **sans downtime**.

### Objectifs

- Architecturer Symfony 8
- Concevoir les APIs
- Maintenir la CI/CD
- Gérer l'outillage
- Déployer sans downtime

### Responsabilités

- 🎵 **Backend (Symfony)** : bundles, entités, services, APIs REST, logique métier, sécurité applicative
- 🛠️ **Build & Outillage** : Vite, Docker multi-stage, gestion des dépendances (npm / Composer), scripts d'automatisation, environnements de développement
- 🚀 **CI/CD & Déploiement** : pipelines automatisés (build → test → scan → deploy), Infrastructure as Code (Ansible), environnements dev / staging / production, rollback, release notes

### Processus de référence

| Processus | Déclencheur | Étapes | Sortie |
|-----------|-------------|--------|--------|
| Deploy Pipeline | Push main | Tests → Build → Scan → Deploy → Health Check | App livrée |

---

## 🗺️ Espace de travail

Tout l'espace de Jitsu vit sous `~/gl-tower/jitsu/`, organisé en trois métiers complémentaires :

```
~/gl-tower/jitsu/
├── api/                            # 🎵 Backend Symfony 8 — l'application API
│   └── src/                        #    (code de l'application, voir ci-dessous)
├── build/                          # 🛠️ Build & outillage
│   ├── docker/
│   │   ├── php/Dockerfile
│   │   ├── nginx/default.conf
│   │   └── node/Dockerfile
│   ├── docker-compose.yml          #    Compose de développement
│   ├── Dockerfile                  #    Build multi-stage (production)
│   ├── vite.config.ts
│   ├── Makefile
│   ├── Taskfile.yml
│   └── scripts/
│       ├── build.sh
│       ├── dev.sh
│       └── deploy.sh
└── deploy/                         # 🚀 CI/CD & déploiement
    ├── ansible/
    │   └── playbooks/
    │       ├── setup-server.yml
    │       └── deploy-app.yml
    ├── scripts/
    │   ├── quick-deploy.sh
    │   └── health-check.sh
    └── templates/
        └── docker-compose.prod.yml.j2
```

> Les pipelines GitHub Actions (`.github/workflows/deploy.yml`, `.github/workflows/rollback.yml`) vivent dans le dépôt de chaque projet applicatif — GitHub les exige à la racine — tandis que les playbooks, scripts et gabarits de déploiement sont centralisés ici, sous `deploy/`.

```bash
mkdir -p ~/gl-tower/jitsu/api/src
mkdir -p ~/gl-tower/jitsu/build/{docker/{php,nginx,node},scripts}
mkdir -p ~/gl-tower/jitsu/deploy/{ansible/playbooks,scripts,templates}
```

---

## 🛠️ Stack technique

| Domaine | Composant | Rôle |
|---------|-----------|------|
| CI/CD | **GitHub Actions** | Pipelines automatisés |
| Registry | **GitHub Container Registry** | Images Docker |
| IaC | **Ansible** | Configuration des serveurs |
| Orchestration | **Docker Compose** | Déploiement des containers |
| Notifications | **n8n + Discord** | Alertes de déploiement |
| Backend | **Symfony 8.x** | Framework applicatif |
| Backend | **PHP 8.3+** | Langage d'exécution |
| API | **API Platform 4.x** | Design des APIs REST |
| Base de données | **Doctrine ORM + PostgreSQL 16** | Persistance |
| Cache | **Redis** | Cache / sessions / files |
| Sécurité | **Symfony Security + JWT** | Authentification, rate limiting, CORS |
| Qualité PHP | **PHPStan (niveau 8), PHP CS Fixer, Rector** | Analyse statique, style, refactoring |
| Messages | **Symfony Messenger (RabbitMQ / Redis)** | Traitement asynchrone |
| Build front | **Vite 5.x, Rollup, esbuild, PostCSS, Autoprefixer** | Bundling, dev server |
| Build back | **Composer 2.x, Symfony Flex** | Dépendances PHP |
| Containers | **Docker 24.x, multi-stage builds** | Images optimisées |
| DevTools | **Makefile, Taskfile, Husky, lint-staged** | Productivité développeur |

---

# 🎵 Backend (Symfony)

## 📁 Structure du projet API

L'application Symfony vit dans `~/gl-tower/jitsu/api/`. Architecture en couches, séparation stricte des responsabilités :

```
src/
├── Controller/
│   ├── Api/              # Controllers API
│   └── Admin/            # Controllers admin
├── Entity/               # Entités Doctrine
├── Repository/           # Repositories
├── Service/              # Services métier
├── EventSubscriber/      # Event listeners
├── Command/              # Commandes console
├── Message/              # Messages async
├── MessageHandler/       # Handlers
├── Security/             # Voters, authenticators
└── Dto/                  # Data Transfer Objects
```

## 🏗️ Architecture Patterns

### Clean Architecture

```
┌─────────────────────────────────────────┐
│              Controllers                │  ← HTTP Layer
├─────────────────────────────────────────┤
│                 DTOs                    │  ← Data Transfer
├─────────────────────────────────────────┤
│               Services                  │  ← Business Logic
├─────────────────────────────────────────┤
│             Repositories                │  ← Data Access
├─────────────────────────────────────────┤
│               Entities                  │  ← Domain Model
└─────────────────────────────────────────┘
```

### Ressource API Platform

```php
<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Put;
use ApiPlatform\Metadata\Delete;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: ProjectRepository::class)]
#[ApiResource(
    operations: [
        new GetCollection(),
        new Get(),
        new Post(security: "is_granted('ROLE_ADMIN')"),
        new Put(security: "is_granted('ROLE_ADMIN')"),
        new Delete(security: "is_granted('ROLE_ADMIN')"),
    ],
    normalizationContext: ['groups' => ['project:read']],
    denormalizationContext: ['groups' => ['project:write']],
)]
class Project
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Assert\NotBlank]
    #[Assert\Length(min: 3, max: 255)]
    #[Groups(['project:read', 'project:write'])]
    private ?string $name = null;

    #[ORM\Column(type: 'text')]
    #[Groups(['project:read', 'project:write'])]
    private ?string $description = null;

    #[ORM\Column]
    #[Groups(['project:read'])]
    private ?\DateTimeImmutable $createdAt = null;

    // Getters and setters...
}
```

### Pattern Service

```php
<?php

namespace App\Service;

use App\Entity\Project;
use App\Repository\ProjectRepository;
use Doctrine\ORM\EntityManagerInterface;
use Psr\Log\LoggerInterface;

final class ProjectService
{
    public function __construct(
        private EntityManagerInterface $em,
        private ProjectRepository $repository,
        private LoggerInterface $logger,
    ) {}

    public function create(array $data): Project
    {
        $project = new Project();
        $project->setName($data['name']);
        $project->setDescription($data['description']);

        $this->em->persist($project);
        $this->em->flush();

        $this->logger->info('Project created', ['id' => $project->getId()]);

        return $project;
    }
}
```

## 📚 Conventions

### Nommage

```
Entities:     PascalCase          (Project.php)
Services:     PascalCaseService   (ProjectService.php)
Controllers:  PascalCaseController (ProjectController.php)
Repositories: PascalCaseRepository (ProjectRepository.php)
Commands:     kebab-case          (app:sync-projects)
```

### Standards

- PSR-12 Code Style
- PHPDoc pour toutes les méthodes publiques
- Types stricts (`declare(strict_types=1)`)
- Injection de dépendances via constructeur

## 🔐 Sécurité backend

### Configuration CORS

```yaml
# config/packages/nelmio_cors.yaml
nelmio_cors:
    defaults:
        origin_regex: true
        allow_origin: ['%env(CORS_ALLOW_ORIGIN)%']
        allow_methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
        allow_headers: ['Content-Type', 'Authorization']
        max_age: 3600
    paths:
        '^/api/': ~
```

### Rate Limiting

```yaml
# config/packages/rate_limiter.yaml
framework:
    rate_limiter:
        api_limiter:
            policy: 'sliding_window'
            limit: 100
            interval: '1 minute'
```

## 🚀 Commandes Symfony

```bash
# Serveur de dev
symfony serve

# Console
php bin/console

# Cache clear
php bin/console cache:clear

# Migrations
php bin/console doctrine:migrations:migrate

# Tests
php bin/phpunit

# Analyse statique
vendor/bin/phpstan analyse

# Code style
vendor/bin/php-cs-fixer fix
```

---

# 🛠️ Build & Outillage

## 📄 Configurations

### vite.config.ts

```typescript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig({
  plugins: [
    vue(),
    visualizer({
      filename: 'dist/stats.html',
      gzipSize: true,
    }),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  build: {
    target: 'esnext',
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['vue', 'vue-router', 'pinia'],
          'three': ['three'],
        },
      },
    },
  },
  server: {
    port: 5173,
    host: true,
  },
})
```

### docker-compose.yml (développement)

```yaml
version: '3.8'

services:
  app:
    build:
      context: .
      dockerfile: docker/php/Dockerfile
      target: dev
    volumes:
      - .:/app
      - /app/vendor
      - /app/node_modules
    ports:
      - "8000:8000"
    environment:
      - APP_ENV=dev
      - DATABASE_URL=postgresql://app:app@postgres:5432/app
    depends_on:
      - postgres
      - redis

  node:
    build:
      context: .
      dockerfile: docker/node/Dockerfile
    volumes:
      - .:/app
      - /app/node_modules
    ports:
      - "5173:5173"
    command: npm run dev

  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: app
      POSTGRES_PASSWORD: app
      POSTGRES_DB: app
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

volumes:
  postgres_data:
```

### Dockerfile (multi-stage)

```dockerfile
# ============================================
# Stage 1: Base PHP
# ============================================
FROM php:8.3-fpm-alpine AS php-base

RUN apk add --no-cache \
    postgresql-dev \
    && docker-php-ext-install pdo_pgsql opcache

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /app

# ============================================
# Stage 2: Development
# ============================================
FROM php-base AS dev

RUN apk add --no-cache git

COPY composer.* ./
RUN composer install --no-scripts --no-autoloader

COPY . .
RUN composer dump-autoload --optimize

EXPOSE 8000
CMD ["php", "-S", "0.0.0.0:8000", "-t", "public"]

# ============================================
# Stage 3: Production
# ============================================
FROM php-base AS prod

ENV APP_ENV=prod

COPY composer.* ./
RUN composer install --no-dev --optimize-autoloader --no-scripts

COPY . .
RUN composer dump-autoload --optimize --classmap-authoritative

# Build frontend
FROM node:20-alpine AS node-build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Final production image
FROM php-base AS production
COPY --from=prod /app /app
COPY --from=node-build /app/public/build /app/public/build

EXPOSE 8000
CMD ["php-fpm"]
```

### Makefile

```makefile
.PHONY: help install dev build test deploy clean

# Colors
GREEN  := $(shell tput setaf 2)
YELLOW := $(shell tput setaf 3)
RESET  := $(shell tput sgr0)

help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "$(GREEN)%-15s$(RESET) %s\n", $$1, $$2}'

install: ## Install all dependencies
	@echo "$(YELLOW)🚀 Jitsu: Installing dependencies...$(RESET)"
	composer install
	npm install
	@echo "$(GREEN)✅ Dependencies installed$(RESET)"

dev: ## Start development environment
	@echo "$(YELLOW)🚀 Jitsu: Starting dev environment...$(RESET)"
	docker compose up -d
	npm run dev

build: ## Build for production
	@echo "$(YELLOW)🚀 Jitsu: Building for production...$(RESET)"
	npm run build
	composer dump-autoload --optimize
	@echo "$(GREEN)✅ Build complete$(RESET)"

test: ## Run all tests
	@echo "$(YELLOW)🚀 Jitsu: Running tests...$(RESET)"
	php bin/phpunit
	npm run test

deploy: build ## Deploy to production
	@echo "$(YELLOW)🚀 Jitsu: Deploying...$(RESET)"
	docker build -t portfolio:latest .
	docker push ghcr.io/gldigitallab/portfolio:latest

clean: ## Clean build artifacts
	@echo "$(YELLOW)🚀 Jitsu: Cleaning...$(RESET)"
	rm -rf node_modules vendor dist public/build
	docker compose down -v
	@echo "$(GREEN)✅ Cleaned$(RESET)"

up: ## Start containers
	docker compose up -d

down: ## Stop containers
	docker compose down

logs: ## Show container logs
	docker compose logs -f

shell: ## Open shell in app container
	docker compose exec app sh
```

## 🔧 Scripts

### build.sh

```bash
#!/bin/bash
# ~/gl-tower/jitsu/build/scripts/build.sh
set -e

echo "🚀 Jitsu: Starting build process..."

# Clean previous build
rm -rf dist public/build

# Install dependencies
npm ci --prefer-offline
composer install --no-dev --optimize-autoloader

# Build frontend
echo "📦 Building frontend..."
npm run build

# Optimize autoloader
composer dump-autoload --optimize --classmap-authoritative

# Clear cache
php bin/console cache:clear --env=prod
php bin/console cache:warmup --env=prod

# Generate assets manifest
php bin/console assets:install public

echo "✅ Jitsu: Build complete!"
```

### dev.sh

```bash
#!/bin/bash
# ~/gl-tower/jitsu/build/scripts/dev.sh
set -e

echo "🚀 Jitsu: Setting up dev environment..."

# Check Docker
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running!"
    exit 1
fi

# Start services
docker compose up -d

# Wait for services
echo "⏳ Waiting for services..."
sleep 5

# Install dependencies
composer install
npm install

# Run migrations
php bin/console doctrine:migrations:migrate --no-interaction

# Start dev server
echo "🚀 Starting dev servers..."
npm run dev &
symfony serve &

echo "✅ Jitsu: Dev environment ready!"
echo "   Frontend: http://localhost:5173"
echo "   Backend:  http://localhost:8000"
```

## ⌨️ Raccourcis & commandes

```bash
# Make shortcuts
make install          # Install all
make dev              # Start dev
make build            # Build prod
make test             # Run tests
make deploy           # Deploy
make clean            # Clean all

# Docker
docker compose up -d
docker compose logs -f app
docker compose exec app sh

# NPM
npm run dev           # Dev server
npm run build         # Production build
npm run preview       # Preview build

# Composer
composer install
composer update
composer dump-autoload
```

---

# 🚀 CI/CD & Déploiement

## 🧭 Stratégie de déploiement

Jitsu gère le **cycle de vie complet des déploiements** : pipelines automatisés, Infrastructure as Code et rollbacks intelligents. Principes non négociables :

- **Zero downtime** : montée en charge progressive (`--scale`) puis bascule **blue-green** en production
- **Health checks systématiques** avant et après bascule — en cas d'échec, on garde la version saine et on stoppe la nouvelle
- **Backup avant déploiement production** (version courante + dump PostgreSQL)
- **Environnements** : dev, staging, production, avec secrets séparés (`STAGING_*` / `PROD_*`)
- **Release notes** générées automatiquement à chaque déploiement main
- **Notifications** déploiement sur Discord via n8n

## ⚡ GitHub Actions — Pipeline de déploiement

```yaml
# .github/workflows/deploy.yml
name: Jitsu - Deploy Pipeline

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
          title: "🚀 Jitsu - Staging Deployed"
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
          title: "🚀 Jitsu - Production Deployed"
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
            *Generated by Jitsu*
          draft: false
          prerelease: false
```

## 🔙 Workflow de rollback

```yaml
# .github/workflows/rollback.yml
name: Jitsu - Rollback

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
          title: "⚠️ Jitsu - Rollback Started"
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
          title: "✅ Jitsu - Rollback Complete"
          description: "${{ github.event.inputs.environment }} rolled back to `${{ github.event.inputs.version }}`"
          color: 0x10B981
```

## 📦 Playbooks Ansible

### Préparation d'un serveur GL Tower

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

### Déploiement applicatif

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

## 🐳 Docker Compose Production (bleu-vert)

Gabarit Jinja2 déployé par Ansible sur chaque serveur :

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

## 🔧 Scripts de déploiement

### Déploiement rapide

```bash
#!/bin/bash
# ~/gl-tower/jitsu/deploy/scripts/quick-deploy.sh
set -e

ENV=${1:-staging}
VERSION=${2:-latest}

echo "🚀 Jitsu Quick Deploy"
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
# ~/gl-tower/jitsu/deploy/scripts/health-check.sh
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

# 🔄 Workflows & automatisation

## Registre officiel des workflows

Les 15 workflows actifs de la Loi Jitsu (source : fiche d'identité de la tour GL Tower) :

| ID | Workflow | Description | Déclencheur | Capacité |
|----|----------|-------------|-------------|----------|
| `jitsu-ci` | CI Pipeline Orchestrator | Pipeline CI complet (deps, lint, test, build) | Push / PR | CI/CD |
| `jitsu-deploy-prod` | Production Deployment | Déploiement production avec scan sécurité, validation, SSH deploy et health check | Tag release | CI/CD |
| `jitsu-hotfix` | Hotfix Express Lane | Pipeline hotfix accéléré jusqu'en production | Branche `hotfix/*` | CI/CD |
| `jitsu-docker-build` | Docker Multi-Stage Build | Build d'images optimisées multi-étapes, push registry, mise à jour du compose | On release | Docker / Build |
| `jitsu-cleanup` | Container Cleanup | Nettoyage des containers et images orphelines | Cron 04:00 (quotidien) | Docker / Build |
| `jitsu-rollback` | Auto Rollback | Rollback automatique vers la version précédente si le health check échoue | Échec health check (Dou) | CI/CD |
| `jitsu-bundle-gen` | Symfony Bundle Generator | Génère un bundle Symfony complet | CLI (on demand) | Symfony / Backend |
| `jitsu-code-quality` | PHP Code Quality | PHPStan + CS-Fixer (+ Psalm) avec commentaire sur la PR | PR GitHub | Symfony / Backend |
| `jitsu-deprecation` | Deprecation Scanner | Détecte le code déprécié via Rector et crée les issues | Cron hebdomadaire | Symfony / Backend |
| `jitsu-api-doc` | API Documentation | Génère et met à jour la documentation OpenAPI | Push entité | API Platform |
| `jitsu-db-backup` | Database Backup | Backup PostgreSQL compressé et vérifié | Cron 04:00 (quotidien) | API Platform |
| `jitsu-vite-config` | Vite Config Generator | Génère une configuration Vite optimisée | Nouveau projet (on demand) | Docker / Build |
| `jitsu-dockerfile` | Dockerfile Generator | Génère un Dockerfile multi-stage sécurisé | Nouveau service (on demand) | Docker / Build |
| `jitsu-dep-update` | Dependency Updater | Met à jour les dépendances npm / Composer avec PR de test | Cron lundi (hebdomadaire) | Docker / Build |
| `jitsu-audit-fix` | Security Audit Fixer | Corrige les vulnérabilités détectées par audit | Alerte audit | Docker / Build |

## Exemples d'implémentation n8n

Les automatisations n8n sont exposées par le coordinateur **Wa** : webhooks sur `http://wa-n8n:5678/webhook/jitsu/<slug>`, variable d'environnement `JITSU_WEBHOOK` pour Discord.

### Notifications de déploiement (support de `jitsu-ci` / `jitsu-deploy-prod`)

```json
{
  "name": "Jitsu - Deployment Notifications",
  "nodes": [
    {
      "name": "Webhook - GitHub",
      "type": "n8n-nodes-base.webhook",
      "parameters": {
        "path": "jitsu/github-webhook",
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
        "jsCode": "const run = $input.first().json.workflow_run;\nconst status = run.conclusion === 'success' ? '✅' : '❌';\nconst env = run.name.includes('production') ? 'Production' : 'Staging';\n\nconst message = `${status} **Jitsu Deployment Report**\\n\\n` +\n  `**Environment:** ${env}\\n` +\n  `**Status:** ${run.conclusion}\\n` +\n  `**Duration:** ${Math.round((new Date(run.updated_at) - new Date(run.created_at)) / 1000)}s\\n` +\n  `**Commit:** \\`${run.head_sha.substring(0, 7)}\\`\\n\\n` +\n  `[View Run](${run.html_url})`;\n\nreturn [{ json: { message, success: run.conclusion === 'success' } }];"
      }
    },
    {
      "name": "Send to Discord",
      "type": "n8n-nodes-base.discord",
      "parameters": {
        "webhookUri": "={{ $env.JITSU_WEBHOOK }}",
        "content": "={{ $json.message }}"
      }
    }
  ]
}
```

### Génération d'endpoint API (support de `jitsu-bundle-gen`)

Génère automatiquement une ressource API complète (entité, repository, controller, DTO) puis sa migration.

```json
{
  "name": "Jitsu - API Generator",
  "trigger": "Webhook POST http://wa-n8n:5678/webhook/jitsu/generate-api",
  "nodes": [
    {
      "type": "webhook",
      "path": "jitsu/generate-api"
    },
    {
      "type": "ollama",
      "model": "codellama:13b",
      "systemPrompt": "You are a Symfony 8 expert. Generate clean, PSR-12 compliant code.",
      "prompt": "Generate a complete Symfony API resource for: {{$json.entityName}} with fields: {{$json.fields}}"
    },
    {
      "type": "code",
      "action": "Split into Entity, Repository, Controller, DTO files"
    },
    {
      "type": "filesystem",
      "action": "Write files to src/"
    },
    {
      "type": "execute",
      "command": "php bin/console make:migration"
    },
    {
      "type": "discord",
      "channel": "#dev",
      "message": "🚀 Jitsu : API {{$json.entityName}} générée avec migration !"
    }
  ]
}
```

### Audit sécurité backend (support de `jitsu-code-quality`)

Analyse la sécurité et la qualité du code backend sur chaque PR.

```json
{
  "name": "Jitsu - Security Audit",
  "trigger": "Webhook from GitHub on PR",
  "nodes": [
    {
      "type": "webhook",
      "path": "jitsu/security-audit"
    },
    {
      "type": "execute",
      "command": "composer audit --format=json"
    },
    {
      "type": "execute",
      "command": "vendor/bin/phpstan analyse --error-format=json"
    },
    {
      "type": "code",
      "action": "Parse and aggregate security issues"
    },
    {
      "type": "if",
      "condition": "{{$json.criticalIssues > 0}}"
    },
    {
      "type": "github",
      "action": "Add comment to PR with security report"
    },
    {
      "type": "discord",
      "channel": "#dev",
      "message": "🚀 Jitsu : Audit sécurité - {{$json.criticalIssues}} issues critiques"
    }
  ]
}
```

### Gestionnaire de migrations (backend Symfony)

```json
{
  "name": "Jitsu - Migration Manager",
  "trigger": "Webhook POST http://wa-n8n:5678/webhook/jitsu/migrate",
  "nodes": [
    {
      "type": "webhook",
      "path": "jitsu/migrate"
    },
    {
      "type": "execute",
      "command": "php bin/console doctrine:migrations:diff --no-interaction"
    },
    {
      "type": "execute",
      "command": "php bin/console doctrine:migrations:migrate --no-interaction"
    },
    {
      "type": "code",
      "action": "Parse migration output"
    },
    {
      "type": "discord",
      "channel": "#dev",
      "message": "🚀 Jitsu : Migration {{$json.version}} appliquée"
    }
  ]
}
```

### Mise à jour des dépendances (`jitsu-dep-update`)

```json
{
  "name": "Jitsu - Dependency Update",
  "trigger": "Cron every Monday at 09:00",
  "nodes": [
    {
      "type": "cron",
      "expression": "0 9 * * 1"
    },
    {
      "type": "execute",
      "command": "npm outdated --json"
    },
    {
      "type": "execute",
      "command": "composer outdated --format=json"
    },
    {
      "type": "code",
      "action": "Parse outdated packages"
    },
    {
      "type": "if",
      "condition": "{{$json.outdated.length > 0}}"
    },
    {
      "type": "github",
      "action": "Create issue with update list"
    },
    {
      "type": "discord",
      "channel": "#dev",
      "message": "🚀 Jitsu : {{$json.outdated.length}} packages à mettre à jour"
    }
  ]
}
```

### Analyse des bundles (post-build, contrôle qualité front)

```json
{
  "name": "Jitsu - Bundle Analysis",
  "trigger": "Webhook from the CI pipeline after build",
  "nodes": [
    {
      "type": "webhook",
      "path": "jitsu/analyze-bundle"
    },
    {
      "type": "execute",
      "command": "npx vite-bundle-visualizer"
    },
    {
      "type": "code",
      "action": "Parse bundle stats"
    },
    {
      "type": "postgres",
      "action": "INSERT bundle_stats"
    },
    {
      "type": "if",
      "condition": "{{$json.totalSize > 200000}}"
    },
    {
      "type": "discord",
      "channel": "#dev",
      "message": "🚀 Jitsu: ⚠️ Bundle size: {{$json.totalSizeKB}}KB (objectif: <200KB)"
    }
  ]
}
```

### Build Docker sur tag (`jitsu-docker-build`)

```json
{
  "name": "Jitsu - Docker Build",
  "trigger": "Webhook from GitHub on tag",
  "nodes": [
    {
      "type": "webhook",
      "path": "jitsu/docker-build"
    },
    {
      "type": "execute",
      "command": "docker build -t ghcr.io/gldigitallab/portfolio:{{$json.tag}} ."
    },
    {
      "type": "execute",
      "command": "docker push ghcr.io/gldigitallab/portfolio:{{$json.tag}}"
    },
    {
      "type": "execute",
      "command": "docker image prune -f"
    },
    {
      "type": "discord",
      "channel": "#dev",
      "message": "🚀 Jitsu : Image Docker {{$json.tag}} publiée"
    }
  ]
}
```

### Préparation de l'environnement de développement (outillage)

```json
{
  "name": "Jitsu - Dev Setup",
  "trigger": "Webhook POST http://wa-n8n:5678/webhook/jitsu/setup",
  "nodes": [
    {
      "type": "webhook",
      "path": "jitsu/setup"
    },
    {
      "type": "execute",
      "command": "cp .env.example .env"
    },
    {
      "type": "execute",
      "command": "docker compose up -d"
    },
    {
      "type": "execute",
      "command": "composer install"
    },
    {
      "type": "execute",
      "command": "npm install"
    },
    {
      "type": "execute",
      "command": "php bin/console doctrine:migrations:migrate --no-interaction"
    },
    {
      "type": "discord",
      "channel": "#dev",
      "message": "🚀 Jitsu : Environnement de dev prêt ! 🚀"
    }
  ]
}
```

---

# 🎯 Métriques — Objectifs

> Les valeurs ci-dessous sont des **cibles d'engagement** (objectifs de la Loi), pas des mesures. Aucune mesure n'est stockée dans ce runbook : le suivi réel (durées, taux, tailles) est assuré par **Dou** (Loi du Mouvement) via les dashboards Prometheus / Grafana.

### Livraison

| Indicateur | Cible |
|------------|-------|
| Fréquence de déploiement | > 5 déploiements / semaine |
| Lead time (commit → production) | < 30 min |
| MTTR (temps de rollback) | < 5 min |
| Taux d'échec des changements | < 5 % |
| Durée de déploiement | < 10 min |

### Backend

| Indicateur | Cible |
|------------|-------|
| Niveau PHPStan | 8 |
| Couverture de code | > 80 % |
| Temps de réponse API (p95) | < 200 ms |
| Vulnérabilités critiques | 0 |
| Ratio de dette technique | < 5 % |

### Build

| Indicateur | Cible |
|------------|-------|
| Temps de build (dev / rechargement) | < 500 ms |
| Temps de build (production) | < 60 s |
| Taille du bundle (gzip) | < 200 KB |
| Taille de l'image Docker | < 500 MB |
| Installation npm | < 30 s |
| Temps de rechargement à chaud | < 100 ms |

---

# 🔗 Interactions avec l'équipage ARKADIA

```
Jitsu  ←→ Wa       : Reçoit/remonte demandes et notifications via les webhooks wa-n8n
Jitsu  ←→ Makoto   : La CI exécute les scans et tests de Makoto avant déploiement ;
                     reçoit ses audits sécurité et corrige (jitsu-audit-fix)
Jitsu  ←→ Bi       : Fournit les APIs REST consommées par le frontend ; reçoit les
                     builds frontend à embarquer dans les images
Jitsu  ←→ Dou      : Déploie ; Dou surveille la santé des services — un échec de
                     health check déclenche l'Auto Rollback (jitsu-rollback)
Jitsu  ←→ Watashi  : Gère les entités, migrations et données PostgreSQL ; backups
                     quotidiens de la base (jitsu-db-backup)
```

## Chaîne interne de la Loi (api → build → deploy)

Les trois métiers fusionnent dans un seul pipeline de bout en bout :

```
🎵 Backend (api)  →  🛠️ Build (build)  →  🚀 Livraison (deploy)
   Symfony 8          Vite + Docker        GitHub Actions
   APIs & entités     images multi-stage   Ansible + bleu-vert
   migrations         dépendances          rollback & release notes
```

---

*Loi : Jitsu — Équipage ARKADIA | GL Tower — NIVEAU 4*
