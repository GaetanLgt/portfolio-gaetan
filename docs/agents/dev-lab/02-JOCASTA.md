# ⚙️ J.O.C.A.S.T.A. - Backend Architecture

> **Just Operating Code Architecture for Symfony & Tailored APIs**  
> *Sous-sol 2 - L'Armurerie*

---

## 📋 Fiche Agent

| Propriété | Valeur |
|-----------|--------|
| **Nom complet** | J.O.C.A.S.T.A. |
| **Niveau** | Sous-sol 2 (L'Armurerie) |
| **Rôle** | Backend Architecture |
| **Status** | 🟢 ONLINE |
| **Couleur** | `#8B5CF6` (Violet) |
| **Icône** | ⚙️ |

---

## 🎯 Mission

JOCASTA est l'agent responsable de toute l'architecture backend. Elle gère :
- Architecture Symfony et bundles
- Design des APIs REST/GraphQL
- Logique métier et services
- Intégrations tierces
- Sécurité applicative

---

## 🛠️ Stack Technique

```yaml
Core:
  - Symfony 8.x
  - PHP 8.3+
  - API Platform 4.x
  
Database:
  - Doctrine ORM
  - PostgreSQL 16
  - Redis (cache/sessions)
  
Security:
  - Symfony Security
  - JWT Authentication
  - Rate Limiting
  - CORS Configuration
  
Quality:
  - PHPStan (niveau 8)
  - PHP CS Fixer
  - Rector (refactoring)
  
Messaging:
  - Symfony Messenger
  - RabbitMQ / Redis Transport
```

---

## 📁 Structure de Travail

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

---

## 🔄 Workflows n8n

### 1. API Endpoint Generator

Génère automatiquement un endpoint API complet.

```json
{
  "name": "JOCASTA - API Generator",
  "trigger": "Webhook POST /jocasta/generate-api",
  "nodes": [
    {
      "type": "webhook",
      "path": "/jocasta/generate-api"
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
      "channel": "#dev-lab",
      "message": "⚙️ JOCASTA: API {{$json.entityName}} générée avec migration!"
    }
  ]
}
```

### 2. Security Audit

Analyse la sécurité du code backend.

```json
{
  "name": "JOCASTA - Security Audit",
  "trigger": "Webhook from GitHub on PR",
  "nodes": [
    {
      "type": "webhook",
      "path": "/jocasta/security-audit"
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
      "channel": "#dev-lab",
      "message": "⚙️ JOCASTA: Audit sécurité - {{$json.criticalIssues}} issues critiques"
    }
  ]
}
```

### 3. Database Migration Manager

Gère les migrations de base de données.

```json
{
  "name": "JOCASTA - Migration Manager",
  "trigger": "Webhook POST /jocasta/migrate",
  "nodes": [
    {
      "type": "webhook",
      "path": "/jocasta/migrate"
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
      "channel": "#dev-lab",
      "message": "⚙️ JOCASTA: Migration {{$json.version}} appliquée"
    }
  ]
}
```

---

## 📊 Métriques

| Métrique | Objectif | Actuel |
|----------|----------|--------|
| PHPStan Level | 8 | 8 |
| Code Coverage | > 80% | 85% |
| API Response Time (p95) | < 200ms | 145ms |
| Security Vulnerabilities | 0 critical | 0 |
| Technical Debt Ratio | < 5% | 3.2% |

---

## 🔗 Interactions avec autres agents

```
JOCASTA ←→ TADASHI   : Fournit les APIs REST
JOCASTA ←→ ZOLA      : Gère les entités et migrations
JOCASTA ←→ CEREBRO   : Envoie le code pour tests
JOCASTA ←→ EDITH     : Reçoit les audits sécurité
JOCASTA ←→ FRIDAY    : Fournit les endpoints support
```

---

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

### API Platform Resource

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

### Service Pattern

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

---

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

---

## 🔐 Sécurité

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

---

## 🚀 Commandes

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

*JOCASTA v1.0 | GL Tower Dev Lab*
