# 🔧 GL TOWER - DEV LAB & BACK OFFICE

> **Les Sous-sols de GL Tower**  
> Infrastructure de développement et administration

---

## 🗺️ Architecture des Sous-sols

```
┌─────────────────────────────────────────────────────────────────┐
│  NIVEAU 0 - LOBBY (Accueil)                                     │
├─────────────────────────────────────────────────────────────────┤
│  🔽🔽🔽 ACCÈS RÉSERVÉ - DEV LAB 🔽🔽🔽                          │
├─────────────────────────────────────────────────────────────────┤
│  SOUS-SOL 1 - LA FORGE                                          │
│     🦾 T.A.D.A.S.H.I. - Frontend Engineering                   │
│     Vue 3 • Three.js • TypeScript • GSAP                        │
├─────────────────────────────────────────────────────────────────┤
│  SOUS-SOL 2 - L'ARMURERIE                                       │
│     ⚙️ J.O.C.A.S.T.A. - Backend Architecture                   │
│     Symfony 8 • PHP 8.3+ • API Platform • PostgreSQL            │
├─────────────────────────────────────────────────────────────────┤
│  SOUS-SOL 3 - LABO D'ANALYSE                                    │
│     🔬 C.E.R.E.B.R.O. - Testing & QA                           │
│     PHPUnit • Vitest • Playwright • Lighthouse                  │
├─────────────────────────────────────────────────────────────────┤
│  SOUS-SOL 4 - LE BUNKER                                         │
│     🗄️ Z.O.L.A. - Data Architecture                            │
│     PostgreSQL • Redis • ChromaDB • Migrations                  │
├─────────────────────────────────────────────────────────────────┤
│  SOUS-SOL 5 - L'ATELIER                                         │
│     🛠️ D.U.M-E - Build & Tooling                               │
│     Vite • Docker • Composer • npm                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ═══════════════════════════════════════════════════════════    │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│  BACK OFFICE - AILE ADMINISTRATIVE                              │
│     💰 P.E.P.P.E.R. - Finance & Administration                 │
│     Facturation • Comptabilité • TVA • Devis                    │
└─────────────────────────────────────────────────────────────────┘
            GL TOWER DEV LAB • Somme, France • 2026
```

---

## 📚 Index des Agents

### Dev Lab (Sous-sols)

| Agent | Niveau | Rôle | Stack Principal | Doc |
|-------|--------|------|-----------------|-----|
| **T.A.D.A.S.H.I.** | SS-1 La Forge | Frontend Engineering | Vue 3, Three.js, TypeScript | [→ 01-TADASHI.md](./01-TADASHI.md) |
| **J.O.C.A.S.T.A.** | SS-2 L'Armurerie | Backend Architecture | Symfony 8, PHP 8.3+, API Platform | [→ 02-JOCASTA.md](./02-JOCASTA.md) |
| **C.E.R.E.B.R.O.** | SS-3 Labo d'Analyse | Testing & QA | PHPUnit, Vitest, Playwright | [→ 03-CEREBRO.md](./03-CEREBRO.md) |
| **Z.O.L.A.** | SS-4 Le Bunker | Data Architecture | PostgreSQL, Redis, ChromaDB | [→ 04-ZOLA.md](./04-ZOLA.md) |
| **D.U.M-E** | SS-5 L'Atelier | Build & Tooling | Vite, Docker, npm | [→ 05-DUM-E.md](./05-DUM-E.md) |

### Back Office

| Agent | Niveau | Rôle | Stack Principal | Doc |
|-------|--------|------|-----------------|-----|
| **P.E.P.P.E.R.** | Back Office | Finance & Admin | Stripe, PDF, n8n | [→ 06-PEPPER.md](./06-PEPPER.md) |

---

## 🔄 Flux de Communication Dev Lab

```
                    ┌──────────────┐
                    │   JARVIS     │ ← Coordination Tower
                    │  (Penthouse) │
                    └──────┬───────┘
                           │
         ┌─────────────────┼─────────────────┐
         │                 │                 │
         ▼                 ▼                 ▼
   ┌──────────┐      ┌──────────┐      ┌──────────┐
   │ VERONICA │      │  EDITH   │      │  ULTRON  │
   │  DevOps  │      │ Sécurité │      │ Monitor  │
   └────┬─────┘      └──────────┘      └────┬─────┘
        │                                    │
        │         ┌──────────────┐          │
        └────────►│    DUM-E     │◄─────────┘
                  │    Build     │
                  └──────┬───────┘
                         │
         ┌───────────────┼───────────────┐
         │               │               │
         ▼               ▼               ▼
   ┌──────────┐    ┌──────────┐    ┌──────────┐
   │ TADASHI  │    │ JOCASTA  │    │  ZOLA    │
   │ Frontend │◄──►│ Backend  │◄──►│   Data   │
   └────┬─────┘    └────┬─────┘    └──────────┘
        │               │
        └───────┬───────┘
                │
                ▼
          ┌──────────┐
          │ CEREBRO  │
          │  Tests   │
          └──────────┘

═══════════════════════════════════════════════════

                    ┌──────────────┐
                    │   PEPPER     │ ← Back Office
                    │   Finance    │
                    └──────────────┘
                           │
         ┌─────────────────┼─────────────────┐
         │                 │                 │
         ▼                 ▼                 ▼
   ┌──────────┐      ┌──────────┐      ┌──────────┐
   │  KAREN   │      │  FRIDAY  │      │ CLIENTS  │
   │ Clients  │      │ Support  │      │          │
   └──────────┘      └──────────┘      └──────────┘
```

---

## 🛠️ Stack Technique Globale

### Frontend (TADASHI)
```yaml
Framework: Vue 3 (Composition API)
Build: Vite 5.x
Language: TypeScript 5.x
3D: Three.js, WebGL
Animation: GSAP, Lottie
State: Pinia
Tests: Vitest, Playwright
```

### Backend (JOCASTA)
```yaml
Framework: Symfony 8.x
Language: PHP 8.3+
API: API Platform 4.x
ORM: Doctrine
Auth: JWT, OAuth2
Cache: Redis, Symfony Cache
Tests: PHPUnit, Pest
```

### Data (ZOLA)
```yaml
Primary: PostgreSQL 16
Cache: Redis 7
Vector: ChromaDB (RAG)
Search: pg_trgm, pgvector
Backup: pg_dump, WAL
```

### Build (DUM-E)
```yaml
Frontend: Vite, Rollup
Backend: Composer
Container: Docker, Docker Compose
CI/CD: GitHub Actions
```

### Finance (PEPPER)
```yaml
Payments: Stripe API
PDF: wkhtmltopdf
Templates: Handlebars
Automation: n8n workflows
```

---

## 🚀 Quick Start Dev

### 1. Prérequis

```bash
# Vérifier les versions
php -v        # >= 8.3
node -v       # >= 20.0
docker -v     # >= 24.0
composer -V   # >= 2.6
```

### 2. Installation

```bash
# Cloner le projet
git clone git@github.com:GaetanLgt/portfolio-gaetan.git
cd portfolio-gaetan

# Utiliser le Makefile (DUM-E)
make install   # Installe tout
make dev       # Lance l'environnement dev
```

### 3. URLs de développement

| Service | URL | Agent |
|---------|-----|-------|
| Frontend (Vite) | http://localhost:5173 | TADASHI |
| Backend (Symfony) | http://localhost:8000 | JOCASTA |
| PostgreSQL | localhost:5432 | ZOLA |
| Redis | localhost:6379 | ZOLA |
| n8n (Workflows) | http://localhost:5678 | JARVIS |

---

## 📊 Métriques par Agent

| Agent | KPI Principal | Objectif | Actuel |
|-------|---------------|----------|--------|
| TADASHI | Lighthouse Score | > 90 | 94 |
| JOCASTA | API Response Time | < 200ms | 145ms |
| CEREBRO | Test Coverage | > 80% | 85% |
| ZOLA | Query Time (p95) | < 50ms | 32ms |
| DUM-E | Build Time | < 60s | 42s |
| PEPPER | Délai Paiement | < 30j | 24j |

---

## 🔒 Sécurité

Tous les agents du Dev Lab suivent les directives de sécurité d'**EDITH** :

- ✅ Secrets gérés par Vault
- ✅ Pas de credentials en dur
- ✅ HTTPS obligatoire en prod
- ✅ Audit des dépendances
- ✅ Scans de vulnérabilités

---

## 📚 Documentation Complète

- [GL Tower - Vue d'ensemble](../README.md)
- [Agents Opérationnels (Niveaux 1-6)](../)
- [Architecture Technique](../architecture.md)
- [Workflows n8n](../workflows/)

---

*GL Tower Dev Lab v1.0 | Janvier 2026*  
*Développé par Neo pour GL Digital Lab*  
*🇫🇷 Made in Somme, France*
