# Stack Docker pour Symfony + Vue + PostgreSQL

> **Tutoriel complet** pour créer un environnement de développement Docker avec Symfony 7, Vue 3, PostgreSQL, et Mailpit.

---

## Table des matières

1. [Pré-requis](#1-pré-requis)
2. [Architecture de la stack](#2-architecture-de-la-stack)
3. [Structure du projet](#3-structure-du-projet)
4. [Configuration Docker](#4-configuration-docker)
5. [Services détaillés](#5-services-détaillés)
6. [Commandes utiles](#6-commandes-utiles)
7. [Debugging et logs](#7-debugging-et-logs)
8. [Production](#8-production)

---

## 1. Pré-requis

### Versions minimales

| Outil | Version |
|-------|---------|
| Docker | 24+ |
| Docker Compose | 2.20+ |
| Git | 2.40+ |

### Vérifier les installations

```bash
docker --version
# Docker version 24.x.x

docker compose version
# Docker Compose version v2.20.x

git --version
# git version 2.40.x
```

### Installation Docker (si nécessaire)

```bash
# Linux (Ubuntu/Debian)
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Redémarrer la session pour appliquer les groupes
```

---

## 2. Architecture de la stack

```
┌─────────────────────────────────────────────────────────────┐
│                        NAVIGATEUR                           │
│                    http://localhost:8080                    │
└──────────────────────────┬──────────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────────┐
│                         NGINX                               │
│                      (port 8080)                            │
│            Reverse proxy + Static files                     │
└─────────┬───────────────────────────────────┬───────────────┘
          │                                   │
          │ PHP-FPM                           │ Proxy /hmr
          ▼                                   ▼
┌─────────────────────┐             ┌─────────────────────┐
│      PHP-FPM        │             │        VITE         │
│   (Symfony 7)       │             │    (port 5173)      │
│   PHP 8.3 + ext     │             │   HMR + Vue 3       │
└─────────┬───────────┘             └─────────────────────┘
          │
          │ PDO
          ▼
┌─────────────────────┐    ┌─────────────────────┐
│    PostgreSQL       │    │      Mailpit        │
│    (port 5432)      │    │   (port 8025)       │
│    Base de données  │    │   Catch-all SMTP    │
└─────────────────────┘    └─────────────────────┘
```

### Ports exposés

| Service | Port | URL |
|---------|------|-----|
| Application | 8080 | http://localhost:8080 |
| Vite HMR | 5173 | http://localhost:5173 |
| PostgreSQL | 5432 | localhost:5432 |
| Mailpit UI | 8025 | http://localhost:8025 |
| Mailpit SMTP | 1025 | localhost:1025 |

---

## 3. Structure du projet

```bash
# Créer la structure
mkdir -p mon-projet/{docker/{nginx,php},assets,src,templates,public}
cd mon-projet
```

### Arborescence finale

```
mon-projet/
├── docker/
│   ├── nginx/
│   │   └── default.conf
│   └── php/
│       └── Dockerfile
├── assets/                 # Vue 3 + Vite
│   ├── app.js
│   ├── app.css
│   └── vue/
│       └── App.vue
├── config/                 # Symfony config
├── public/                 # Document root
│   └── index.php
├── src/                    # PHP source
├── templates/              # Twig templates
├── .env                    # Variables Symfony
├── .env.docker             # Variables Docker
├── docker-compose.yml
├── docker-compose.override.yml
├── Dockerfile              # Image principale
├── composer.json
├── package.json
└── vite.config.js
```

---

## 4. Configuration Docker

### 4.1 Fichier : `docker-compose.yml`

Configuration de base (production-ready) :

```yaml
version: '3.8'

services:
  # ===================
  # NGINX - Reverse Proxy
  # ===================
  nginx:
    image: nginx:alpine
    ports:
      - "8080:80"
    volumes:
      - ./public:/var/www/html/public:ro
      - ./docker/nginx/default.conf:/etc/nginx/conf.d/default.conf:ro
    depends_on:
      - php
    networks:
      - app-network
    restart: unless-stopped

  # ===================
  # PHP-FPM - Symfony
  # ===================
  php:
    build:
      context: .
      dockerfile: docker/php/Dockerfile
    volumes:
      - .:/var/www/html
      - vendor:/var/www/html/vendor
      - var:/var/www/html/var
    environment:
      APP_ENV: ${APP_ENV:-dev}
      DATABASE_URL: postgresql://${DB_USER:-app}:${DB_PASSWORD:-secret}@database:5432/${DB_NAME:-app}?serverVersion=16
      MAILER_DSN: smtp://mailpit:1025
    depends_on:
      database:
        condition: service_healthy
    networks:
      - app-network
    restart: unless-stopped

  # ===================
  # PostgreSQL
  # ===================
  database:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: ${DB_USER:-app}
      POSTGRES_PASSWORD: ${DB_PASSWORD:-secret}
      POSTGRES_DB: ${DB_NAME:-app}
    volumes:
      - db-data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    networks:
      - app-network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${DB_USER:-app}"]
      interval: 5s
      timeout: 5s
      retries: 5
    restart: unless-stopped

  # ===================
  # Mailpit - Dev mail
  # ===================
  mailpit:
    image: axllent/mailpit
    ports:
      - "8025:8025"   # Web UI
      - "1025:1025"   # SMTP
    networks:
      - app-network
    restart: unless-stopped

networks:
  app-network:
    driver: bridge

volumes:
  db-data:
  vendor:
  var:
```

### 4.2 Fichier : `docker-compose.override.yml`

Surcharge pour le développement (Vite HMR) :

```yaml
version: '3.8'

services:
  # Vite dev server pour le HMR
  vite:
    image: node:20-alpine
    working_dir: /app
    command: sh -c "npm install && npm run dev -- --host 0.0.0.0"
    ports:
      - "5173:5173"
    volumes:
      - .:/app
      - node_modules:/app/node_modules
    environment:
      - CHOKIDAR_USEPOLLING=true
    networks:
      - app-network

  # Surcharge nginx pour proxy Vite
  nginx:
    volumes:
      - ./public:/var/www/html/public:ro
      - ./docker/nginx/default.dev.conf:/etc/nginx/conf.d/default.conf:ro

  # Surcharge PHP pour le dev
  php:
    environment:
      APP_ENV: dev
      APP_DEBUG: 1
      XDEBUG_MODE: ${XDEBUG_MODE:-off}

volumes:
  node_modules:
```

### 4.3 Fichier : `docker/php/Dockerfile`

```dockerfile
FROM php:8.3-fpm-alpine

# Arguments de build
ARG UID=1000
ARG GID=1000

# Extensions PHP requises pour Symfony
RUN apk add --no-cache \
    acl \
    fcgi \
    file \
    gettext \
    git \
    gnu-libiconv \
    postgresql-dev \
    icu-dev \
    libzip-dev \
    linux-headers \
    $PHPIZE_DEPS

# Extensions PHP
RUN docker-php-ext-install \
    intl \
    opcache \
    pdo \
    pdo_pgsql \
    zip

# Opcache config
RUN echo "opcache.memory_consumption=256" >> /usr/local/etc/php/conf.d/opcache.ini \
    && echo "opcache.max_accelerated_files=20000" >> /usr/local/etc/php/conf.d/opcache.ini \
    && echo "opcache.validate_timestamps=0" >> /usr/local/etc/php/conf.d/opcache.ini

# Xdebug (optionnel, pour le debug)
RUN pecl install xdebug && docker-php-ext-enable xdebug
RUN echo "xdebug.mode=\${XDEBUG_MODE:-off}" >> /usr/local/etc/php/conf.d/docker-php-ext-xdebug.ini \
    && echo "xdebug.client_host=host.docker.internal" >> /usr/local/etc/php/conf.d/docker-php-ext-xdebug.ini \
    && echo "xdebug.start_with_request=yes" >> /usr/local/etc/php/conf.d/docker-php-ext-xdebug.ini

# Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Configuration PHP
RUN echo "memory_limit=512M" >> /usr/local/etc/php/conf.d/memory.ini \
    && echo "upload_max_filesize=50M" >> /usr/local/etc/php/conf.d/uploads.ini \
    && echo "post_max_size=50M" >> /usr/local/etc/php/conf.d/uploads.ini

# Utilisateur non-root
RUN addgroup -g ${GID} app && adduser -u ${UID} -G app -D app
RUN mkdir -p /var/www/html && chown -R app:app /var/www/html

WORKDIR /var/www/html

USER app

# Healthcheck
HEALTHCHECK --interval=10s --timeout=3s --start-period=30s \
    CMD SCRIPT_NAME=/ping SCRIPT_FILENAME=/ping REQUEST_METHOD=GET \
    cgi-fcgi -bind -connect 127.0.0.1:9000 || exit 1

EXPOSE 9000
```

### 4.4 Fichier : `docker/nginx/default.conf`

Configuration Nginx production :

```nginx
server {
    listen 80;
    server_name localhost;
    root /var/www/html/public;

    location / {
        try_files $uri /index.php$is_args$args;
    }

    # Symfony front controller
    location ~ ^/index\.php(/|$) {
        fastcgi_pass php:9000;
        fastcgi_split_path_info ^(.+\.php)(/.*)$;
        include fastcgi_params;
        
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        fastcgi_param DOCUMENT_ROOT $realpath_root;
        
        # Optimisations
        fastcgi_buffer_size 128k;
        fastcgi_buffers 4 256k;
        fastcgi_busy_buffers_size 256k;
        
        internal;
    }

    # Block .php files (sauf index.php)
    location ~ \.php$ {
        return 404;
    }

    # Assets statiques avec cache
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        access_log off;
    }

    # Sécurité
    location ~ /\. {
        deny all;
    }

    error_log /var/log/nginx/error.log;
    access_log /var/log/nginx/access.log;
}
```

### 4.5 Fichier : `docker/nginx/default.dev.conf`

Configuration avec proxy Vite pour le développement :

```nginx
server {
    listen 80;
    server_name localhost;
    root /var/www/html/public;

    location / {
        try_files $uri /index.php$is_args$args;
    }

    # Symfony front controller
    location ~ ^/index\.php(/|$) {
        fastcgi_pass php:9000;
        fastcgi_split_path_info ^(.+\.php)(/.*)$;
        include fastcgi_params;
        
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        fastcgi_param DOCUMENT_ROOT $realpath_root;
        
        internal;
    }

    # Proxy Vite HMR
    location /@vite {
        proxy_pass http://vite:5173;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
    }

    # Proxy assets Vite en dev
    location /assets {
        proxy_pass http://vite:5173;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
    }

    # WebSocket pour HMR
    location /ws {
        proxy_pass http://vite:5173;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }

    location ~ \.php$ {
        return 404;
    }

    error_log /var/log/nginx/error.log;
    access_log /var/log/nginx/access.log;
}
```

### 4.6 Fichier : `.env.docker`

Variables d'environnement Docker :

```bash
# Application
APP_ENV=dev
APP_SECRET=change-me-in-production-please

# Database
DB_USER=app
DB_PASSWORD=secret
DB_NAME=app

# Debug
XDEBUG_MODE=off

# UID/GID pour permissions (Linux)
UID=1000
GID=1000
```

---

## 5. Services détaillés

### 5.1 Initialiser le projet Symfony

```bash
# Démarrer uniquement la base de données
docker compose up -d database

# Créer le projet Symfony (depuis l'hôte si Symfony CLI installé)
symfony new . --version="7.2.*" --webapp

# OU via Docker
docker compose run --rm php composer create-project symfony/skeleton:"7.2.*" .
docker compose run --rm php composer require webapp
```

### 5.2 Installer les dépendances

```bash
# Installer les dépendances PHP
docker compose run --rm php composer install

# Installer les dépendances Node
docker compose run --rm vite npm install
```

### 5.3 Configurer Vite

```bash
# Installer Vite + Vue
docker compose run --rm vite npm install vite vite-plugin-symfony vue @vitejs/plugin-vue --save-dev
```

Fichier : `vite.config.js`

```javascript
import { defineConfig } from 'vite';
import symfonyPlugin from 'vite-plugin-symfony';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
    plugins: [
        vue(),
        symfonyPlugin(),
    ],
    build: {
        rollupOptions: {
            input: {
                app: './assets/app.js',
            },
        },
    },
    server: {
        host: '0.0.0.0',
        port: 5173,
        strictPort: true,
        hmr: {
            host: 'localhost',
            port: 5173,
        },
    },
    resolve: {
        alias: {
            '@': '/assets',
        },
    },
});
```

### 5.4 Créer la base de données

```bash
# Créer la base et exécuter les migrations
docker compose exec php bin/console doctrine:database:create --if-not-exists
docker compose exec php bin/console doctrine:migrations:migrate --no-interaction
```

---

## 6. Commandes utiles

### Démarrage et arrêt

```bash
# Démarrer tous les services
docker compose up -d

# Voir les logs en temps réel
docker compose logs -f

# Arrêter tous les services
docker compose down

# Arrêter et supprimer les volumes (reset complet)
docker compose down -v
```

### Commandes Symfony

```bash
# Console Symfony
docker compose exec php bin/console

# Créer une entité
docker compose exec php bin/console make:entity

# Créer une migration
docker compose exec php bin/console make:migration

# Exécuter les migrations
docker compose exec php bin/console doctrine:migrations:migrate

# Vider le cache
docker compose exec php bin/console cache:clear

# Fixtures
docker compose exec php bin/console doctrine:fixtures:load
```

### Commandes Node/Vite

```bash
# Installer un package npm
docker compose exec vite npm install <package>

# Build production
docker compose exec vite npm run build

# Lancer les tests
docker compose exec vite npm test
```

### Composer

```bash
# Installer les dépendances
docker compose exec php composer install

# Ajouter un bundle
docker compose exec php composer require <bundle>

# Mettre à jour
docker compose exec php composer update
```

### Base de données

```bash
# Accéder à PostgreSQL
docker compose exec database psql -U app -d app

# Dump de la base
docker compose exec database pg_dump -U app app > backup.sql

# Restaurer
cat backup.sql | docker compose exec -T database psql -U app -d app
```

---

## 7. Debugging et logs

### Activer Xdebug

```bash
# Dans .env.docker
XDEBUG_MODE=debug

# Redémarrer PHP
docker compose restart php
```

### Configuration VS Code

Fichier : `.vscode/launch.json`

```json
{
    "version": "0.2.0",
    "configurations": [
        {
            "name": "Listen for Xdebug",
            "type": "php",
            "request": "launch",
            "port": 9003,
            "pathMappings": {
                "/var/www/html": "${workspaceFolder}"
            }
        }
    ]
}
```

### Voir les logs

```bash
# Tous les logs
docker compose logs -f

# Logs d'un service spécifique
docker compose logs -f php
docker compose logs -f nginx
docker compose logs -f database

# Logs Symfony
docker compose exec php tail -f var/log/dev.log
```

### Accéder aux conteneurs

```bash
# Shell dans PHP
docker compose exec php sh

# Shell dans Node
docker compose exec vite sh

# Shell dans PostgreSQL
docker compose exec database sh
```

---

## 8. Production

### 8.1 Fichier : `docker-compose.prod.yml`

```yaml
version: '3.8'

services:
  nginx:
    restart: always
    
  php:
    environment:
      APP_ENV: prod
      APP_DEBUG: 0
    restart: always
    
  database:
    restart: always

# Pas de service vite en production
# Les assets sont buildés et servis par nginx
```

### 8.2 Build et déploiement

```bash
# Build des assets
docker compose exec vite npm run build

# Démarrer en mode production
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d

# Ou avec un fichier .env de production
docker compose --env-file .env.prod up -d
```

### 8.3 Optimisations production

```bash
# Optimiser Composer
docker compose exec php composer install --no-dev --optimize-autoloader

# Warmup du cache Symfony
docker compose exec php bin/console cache:warmup --env=prod

# Vérifier la configuration
docker compose exec php bin/console debug:container --env=prod
```

---

## Récapitulatif des commandes

```bash
# Setup initial
docker compose up -d
docker compose exec php composer install
docker compose exec vite npm install
docker compose exec php bin/console doctrine:migrations:migrate

# Développement quotidien
docker compose up -d          # Démarrer
docker compose logs -f        # Logs
docker compose down           # Arrêter

# Production
docker compose exec vite npm run build
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

---

## Ressources

- [Docker Compose documentation](https://docs.docker.com/compose/)
- [Symfony Docker](https://github.com/dunglas/symfony-docker)
- [PostgreSQL Docker](https://hub.docker.com/_/postgres)
- [Mailpit](https://github.com/axllent/mailpit)

---

**Auteur** : GL Digital Lab  
**Licence** : MIT  
**Dernière mise à jour** : Janvier 2026
