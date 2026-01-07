# 🛠️ D.U.M-E - Build & Tooling

> **Development Utility & Module Environment**  
> *Sous-sol 5 - L'Atelier*

---

## 📋 Fiche Agent

| Propriété | Valeur |
|-----------|--------|
| **Nom complet** | D.U.M-E |
| **Niveau** | Sous-sol 5 (L'Atelier) |
| **Rôle** | Build & Tooling |
| **Status** | 🟢 ONLINE |
| **Couleur** | `#6B7280` (Gris) |
| **Icône** | 🛠️ |

---

## 🎯 Mission

DUM-E est l'agent responsable des outils de build et de l'environnement de développement. Il gère :
- Configuration Vite/Webpack
- Optimisation des bundles
- Gestion des dépendances (npm, Composer)
- Docker et containerisation
- Scripts d'automatisation
- Environnements de développement

---

## 🛠️ Stack Technique

```yaml
Frontend Build:
  - Vite 5.x
  - Rollup (production)
  - esbuild (dev)
  - PostCSS
  - Autoprefixer
  
Backend Build:
  - Composer 2.x
  - Symfony Flex
  - PHP-CS-Fixer
  
Containerization:
  - Docker 24.x
  - Docker Compose 2.x
  - Multi-stage builds
  
Package Management:
  - npm 10.x
  - Composer 2.x
  - pnpm (alternative)
  
DevTools:
  - Makefile
  - Taskfile
  - Husky (git hooks)
  - lint-staged
```

---

## 📁 Structure de Travail

```
.
├── docker/
│   ├── php/
│   │   └── Dockerfile
│   ├── nginx/
│   │   └── default.conf
│   └── node/
│       └── Dockerfile
├── .docker/
│   └── docker-compose.yml
├── scripts/
│   ├── build.sh
│   ├── dev.sh
│   └── deploy.sh
├── vite.config.ts
├── composer.json
├── package.json
├── Makefile
└── Taskfile.yml
```

---

## 🔄 Workflows n8n

### 1. Dependency Updater

Met à jour les dépendances automatiquement.

```json
{
  "name": "DUM-E - Dependency Update",
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
      "channel": "#dev-lab",
      "message": "🛠️ DUM-E: {{$json.outdated.length}} packages à mettre à jour"
    }
  ]
}
```

### 2. Bundle Analyzer

Analyse la taille des bundles.

```json
{
  "name": "DUM-E - Bundle Analysis",
  "trigger": "Webhook from VERONICA after build",
  "nodes": [
    {
      "type": "webhook",
      "path": "/dume/analyze-bundle"
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
      "channel": "#dev-lab",
      "message": "🛠️ DUM-E: ⚠️ Bundle size: {{$json.totalSizeKB}}KB (objectif: <200KB)"
    }
  ]
}
```

### 3. Docker Builder

Build et push des images Docker.

```json
{
  "name": "DUM-E - Docker Build",
  "trigger": "Webhook from GitHub on tag",
  "nodes": [
    {
      "type": "webhook",
      "path": "/dume/docker-build"
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
      "channel": "#dev-lab",
      "message": "🛠️ DUM-E: Image Docker {{$json.tag}} publiée"
    }
  ]
}
```

### 4. Dev Environment Setup

Configure l'environnement de développement.

```json
{
  "name": "DUM-E - Dev Setup",
  "trigger": "Webhook POST /dume/setup",
  "nodes": [
    {
      "type": "webhook",
      "path": "/dume/setup"
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
      "channel": "#dev-lab",
      "message": "🛠️ DUM-E: Environnement de dev prêt! 🚀"
    }
  ]
}
```

---

## 📊 Métriques

| Métrique | Objectif | Actuel |
|----------|----------|--------|
| Build Time (dev) | < 500ms | 320ms |
| Build Time (prod) | < 60s | 42s |
| Bundle Size (gzip) | < 200KB | 156KB |
| Docker Image Size | < 500MB | 380MB |
| npm install Time | < 30s | 18s |
| Hot Reload Time | < 100ms | 65ms |

---

## 🔗 Interactions avec autres agents

```
DUM-E ←→ TADASHI   : Fournit les builds frontend
DUM-E ←→ JOCASTA   : Fournit les builds backend
DUM-E ←→ CEREBRO   : Prépare l'environnement de test
DUM-E ←→ VERONICA  : Fournit les images Docker
DUM-E ←→ ZOLA      : Configure les containers DB
```

---

## 📋 Configurations

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

### docker-compose.yml

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

### Dockerfile (Multi-stage)

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
	@echo "$(YELLOW)🛠️ DUM-E: Installing dependencies...$(RESET)"
	composer install
	npm install
	@echo "$(GREEN)✅ Dependencies installed$(RESET)"

dev: ## Start development environment
	@echo "$(YELLOW)🛠️ DUM-E: Starting dev environment...$(RESET)"
	docker compose up -d
	npm run dev

build: ## Build for production
	@echo "$(YELLOW)🛠️ DUM-E: Building for production...$(RESET)"
	npm run build
	composer dump-autoload --optimize
	@echo "$(GREEN)✅ Build complete$(RESET)"

test: ## Run all tests
	@echo "$(YELLOW)🛠️ DUM-E: Running tests...$(RESET)"
	php bin/phpunit
	npm run test

deploy: build ## Deploy to production
	@echo "$(YELLOW)🛠️ DUM-E: Deploying...$(RESET)"
	docker build -t portfolio:latest .
	docker push ghcr.io/gldigitallab/portfolio:latest

clean: ## Clean build artifacts
	@echo "$(YELLOW)🛠️ DUM-E: Cleaning...$(RESET)"
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

---

## 🔧 Scripts

### build.sh

```bash
#!/bin/bash
set -e

echo "🛠️ DUM-E: Starting build process..."

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

echo "✅ DUM-E: Build complete!"
```

### dev.sh

```bash
#!/bin/bash
set -e

echo "🛠️ DUM-E: Setting up dev environment..."

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

echo "✅ DUM-E: Dev environment ready!"
echo "   Frontend: http://localhost:5173"
echo "   Backend:  http://localhost:8000"
```

---

## 🚀 Commandes

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

*DUM-E v1.0 | GL Tower Dev Lab*
