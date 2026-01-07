# 🔬 C.E.R.E.B.R.O. - Testing & QA

> **Code Examination & Review Engine for Bug Recognition Operations**  
> *Sous-sol 3 - Labo d'Analyse*

---

## 📋 Fiche Agent

| Propriété | Valeur |
|-----------|--------|
| **Nom complet** | C.E.R.E.B.R.O. |
| **Niveau** | Sous-sol 3 (Labo d'Analyse) |
| **Rôle** | Testing & Quality Assurance |
| **Status** | 🟢 ONLINE |
| **Couleur** | `#EF4444` (Rouge) |
| **Icône** | 🔬 |

---

## 🎯 Mission

CEREBRO est l'agent responsable de la qualité du code. Il gère :
- Tests unitaires et d'intégration
- Tests end-to-end
- Analyse de couverture de code
- Audits de performance (Lighthouse)
- Détection de régressions

---

## 🛠️ Stack Technique

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
  - Cypress (legacy)
  
Performance:
  - Lighthouse CI
  - WebPageTest API
  - k6 (load testing)
  
Quality:
  - SonarQube
  - CodeClimate
  - Codecov
```

---

## 📁 Structure de Travail

```
tests/
├── Unit/
│   ├── Service/           # Tests services
│   ├── Entity/            # Tests entités
│   └── Util/              # Tests utilitaires
├── Integration/
│   ├── Repository/        # Tests repos
│   └── Controller/        # Tests API
├── E2E/
│   ├── specs/             # Specs Playwright
│   └── fixtures/          # Données de test
└── Performance/
    ├── lighthouse/        # Config Lighthouse
    └── k6/                # Scripts load test
```

---

## 🔄 Workflows n8n

### 1. Test Runner

Exécute tous les tests sur demande ou après push.

```json
{
  "name": "CEREBRO - Test Runner",
  "trigger": "Webhook from GitHub on push",
  "nodes": [
    {
      "type": "webhook",
      "path": "/cerebro/run-tests"
    },
    {
      "type": "execute",
      "command": "php bin/phpunit --coverage-clover coverage.xml"
    },
    {
      "type": "execute",
      "command": "npm run test -- --coverage"
    },
    {
      "type": "code",
      "action": "Parse coverage reports"
    },
    {
      "type": "http",
      "url": "https://codecov.io/upload",
      "method": "POST"
    },
    {
      "type": "discord",
      "channel": "#dev-lab",
      "message": "🔬 CEREBRO: Tests terminés - Coverage: {{$json.coverage}}%"
    }
  ]
}
```

### 2. E2E Test Suite

Exécute les tests E2E avec Playwright.

```json
{
  "name": "CEREBRO - E2E Suite",
  "trigger": "Webhook from VERONICA after staging deploy",
  "nodes": [
    {
      "type": "webhook",
      "path": "/cerebro/e2e-tests"
    },
    {
      "type": "execute",
      "command": "npx playwright test --reporter=json"
    },
    {
      "type": "code",
      "action": "Parse Playwright results"
    },
    {
      "type": "if",
      "condition": "{{$json.failed > 0}}"
    },
    {
      "type": "execute",
      "command": "npx playwright show-report --host 0.0.0.0"
    },
    {
      "type": "discord",
      "channel": "#dev-lab",
      "message": "🔬 CEREBRO: E2E - {{$json.passed}}/{{$json.total}} tests passed"
    }
  ]
}
```

### 3. Lighthouse Audit

Analyse les performances après déploiement.

```json
{
  "name": "CEREBRO - Lighthouse Audit",
  "trigger": "Webhook POST /cerebro/lighthouse",
  "nodes": [
    {
      "type": "webhook",
      "path": "/cerebro/lighthouse"
    },
    {
      "type": "execute",
      "command": "npx lhci autorun --config=lighthouserc.json"
    },
    {
      "type": "code",
      "action": "Parse Lighthouse results"
    },
    {
      "type": "postgres",
      "action": "INSERT into lighthouse_reports"
    },
    {
      "type": "if",
      "condition": "{{$json.performance < 90}}"
    },
    {
      "type": "jarvis",
      "action": "Notify TADASHI for optimization"
    },
    {
      "type": "discord",
      "channel": "#dev-lab",
      "message": "🔬 CEREBRO: Lighthouse Score - Perf: {{$json.performance}}, A11y: {{$json.accessibility}}, SEO: {{$json.seo}}"
    }
  ]
}
```

### 4. Regression Detector

Détecte les régressions visuelles.

```json
{
  "name": "CEREBRO - Visual Regression",
  "trigger": "Webhook from GitHub on PR",
  "nodes": [
    {
      "type": "webhook",
      "path": "/cerebro/visual-regression"
    },
    {
      "type": "execute",
      "command": "npx playwright test --update-snapshots"
    },
    {
      "type": "code",
      "action": "Compare snapshots with baseline"
    },
    {
      "type": "if",
      "condition": "{{$json.diffs.length > 0}}"
    },
    {
      "type": "github",
      "action": "Post screenshot diffs to PR"
    }
  ]
}
```

---

## 📊 Métriques

| Métrique | Objectif | Actuel |
|----------|----------|--------|
| Code Coverage (Backend) | > 80% | 85% |
| Code Coverage (Frontend) | > 75% | 78% |
| E2E Test Pass Rate | 100% | 100% |
| Lighthouse Performance | > 90 | 94 |
| Test Execution Time | < 5min | 3m42s |
| Flaky Test Rate | < 2% | 0.5% |

---

## 🔗 Interactions avec autres agents

```
CEREBRO ←→ TADASHI   : Reçoit le code frontend à tester
CEREBRO ←→ JOCASTA   : Reçoit le code backend à tester
CEREBRO ←→ VERONICA  : Déclenché après déploiement staging
CEREBRO ←→ JARVIS    : Rapporte les échecs critiques
CEREBRO ←→ ULTRON    : Envoie les métriques de test
```

---

## 🧪 Templates de Tests

### PHPUnit - Test Service

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

### Vitest - Test Composant Vue

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

### Playwright - Test E2E

```typescript
import { test, expect } from '@playwright/test'

test.describe('Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should display hero section', async ({ page }) => {
    await expect(page.locator('.hero__title')).toBeVisible()
    await expect(page.locator('.hero__title')).toContainText('Systèmes Critiques')
  })

  test('should navigate to contact page', async ({ page }) => {
    await page.click('text=RÉSERVER UN AUDIT')
    await expect(page).toHaveURL('/contact')
  })

  test('should pass accessibility checks', async ({ page }) => {
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze()
    expect(accessibilityScanResults.violations).toEqual([])
  })
})
```

---

## 📋 Configuration

### PHPUnit (phpunit.xml)

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

### Playwright (playwright.config.ts)

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

---

## 🚀 Commandes

```bash
# Tests PHP
php bin/phpunit
php bin/phpunit --testsuite=Unit
php bin/phpunit --coverage-html coverage/

# Tests JS
npm run test
npm run test:coverage
npm run test:watch

# Tests E2E
npx playwright test
npx playwright test --ui
npx playwright show-report

# Lighthouse
npx lhci autorun
```

---

*CEREBRO v1.0 | GL Tower Dev Lab*
