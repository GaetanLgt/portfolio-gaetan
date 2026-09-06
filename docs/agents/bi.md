# 💜 Bi — Frontend, Design & 3D (美)

> **FORGE** — L'artisan des interfaces et des expériences.
> *Loi de la Beauté — GL Tower, Étage 5*
> *« L'élégance du code, la grâce du geste. Chaque interface est une première impression. »*

---

## 📋 Fiche Agent

| Propriété | Valeur |
|-----------|--------|
| **Nom complet** | 美 Bi — La Beauté |
| **Kanji / Roman** | 美 / Bi |
| **Sens** | Beauté |
| **Codename** | FORGE |
| **Niveau** | NIVEAU 5 (Étage 5) |
| **Rôle** | Frontend, Design & 3D |
| **Status** | 🟢 ONLINE |
| **Couleur** | `#14B8A6` (Teal) |
| **Icône** | 💜 |

---

## 🎯 Mission

Bi est la Loi de la Beauté de l'équipage ARKADIA : créer des interfaces et des expériences d'exception. Chaque écran est une première impression — Bi l'assume de la maquette au pixel animé, en passant par la 3D.

- Architecturer Vue 3 (Composition API, TypeScript)
- Créer les expériences 3D avec Three.js / WebGL
- Animer les parcours avec GSAP
- Designer l'UI/UX (wireframes → Figma → code)
- Animer les design tokens et garantir la cohérence visuelle

---

## 🛠️ Stack Technique

```yaml
Core:
  - Vue 3 (Composition API)
  - TypeScript 5.x
  - Vite 5.x

3D & Animations:
  - Three.js / WebGL
  - GSAP 3.x
  - CSS Animations

Design:
  - Figma (design system & assets)
  - Design Tokens (CSS Variables)

Styling:
  - SCSS Modules
  - PostCSS

State Management:
  - Pinia
  - VueUse composables

Testing:
  - Vitest
  - Vue Test Utils
  - Playwright (E2E — orchestré avec Makoto)
```

---

## 🌳 Environnement de Travail

| Élément | Valeur |
|---------|--------|
| **Workspace** | `~/gl-tower/bi` |
| **Conteneur de dev** | `bi-frontend` |
| **Image de dev** | `bi-frontend:dev` |
| **Variables d'environnement** | préfixe `BI_` (ex. `BI_API_URL`, `BI_PORT`) |
| **Port de dev** | `5173` (Vite) |

### Structure du projet

```
src/
├── components/
│   ├── ui/              # Composants atomiques
│   ├── sections/        # Sections de page
│   └── three/           # Composants 3D
├── composables/         # Logique réutilisable
├── views/               # Pages
├── assets/
│   ├── styles/          # SCSS global
│   └── icons/           # SVG sprites
└── utils/               # Helpers
```

---

## 🔄 Workflows

Workflows réels de Bi (source : `src/data/agents.js`) — tous **actifs** :

| Workflow | Déclencheur | Capability |
|----------|-------------|------------|
| **Vue Component Generator** | CLI | Vue 3 / Frontend |
| **Composables Library** | Pattern détecté | Vue 3 / Frontend |
| **3D Scene Preview** | Mise à jour de config | Three.js / WebGL |
| **GLB Model Optimizer** | Upload d'un modèle | Three.js / WebGL |
| **Lighthouse Audit** | Post-build | Vue 3 / Frontend |
| **UX Audit** | Cron mensuel | UI/UX Design |
| **Wireframe Generator** | Brief | UI/UX Design |
| **Figma Asset Exporter** | Publication Figma | UI/UX Design |
| **Design Tokens Sync** | Variables Figma | Design System |
| **Brand Consistency Check** | Nouveau contenu | Design System |

### 1. Vue Component Generator

Génère automatiquement un composant Vue.js à partir d'une description.

```json
{
  "name": "Bi - Vue Component Generator",
  "trigger": "Webhook POST /bi/generate-component",
  "nodes": [
    {
      "type": "webhook",
      "path": "/bi/generate-component"
    },
    {
      "type": "ollama",
      "model": "codellama:13b",
      "prompt": "Generate a Vue 3 component with Composition API and TypeScript for: {{$json.description}}"
    },
    {
      "type": "code",
      "action": "Format and validate Vue SFC"
    },
    {
      "type": "filesystem",
      "action": "Write to src/components/{{$json.name}}.vue"
    },
    {
      "type": "discord",
      "channel": "#dev-lab",
      "message": "💜 Bi: Composant {{$json.name}} généré!"
    }
  ]
}
```

### 2. UX Audit (Accessibilité)

Vérifie l'accessibilité et l'UX des pages, chaque jour.

```json
{
  "name": "Bi - UX Audit",
  "trigger": "Cron every day at 6:00",
  "nodes": [
    {
      "type": "http",
      "url": "http://localhost:5173",
      "method": "GET"
    },
    {
      "type": "code",
      "action": "Run axe-core accessibility audit"
    },
    {
      "type": "if",
      "condition": "{{$json.violations.length > 0}}"
    },
    {
      "type": "discord",
      "channel": "#dev-lab",
      "message": "⚠️ Bi: {{$json.violations.length}} problèmes d'accessibilité détectés"
    }
  ]
}
```

### 3. Lighthouse Audit (Performance)

Surveille les Core Web Vitals après chaque build livré par Jitsu.

```json
{
  "name": "Bi - Lighthouse Audit",
  "trigger": "Webhook from Jitsu after deploy",
  "nodes": [
    {
      "type": "webhook",
      "path": "/bi/lighthouse"
    },
    {
      "type": "http",
      "url": "https://www.googleapis.com/pagespeedonline/v5/runPagespeed",
      "params": {
        "url": "{{$json.deployUrl}}",
        "strategy": "mobile"
      }
    },
    {
      "type": "code",
      "action": "Extract LCP, CLS and accessibility scores"
    },
    {
      "type": "if",
      "condition": "{{$json.performance < 90}}"
    },
    {
      "type": "discord",
      "channel": "#dev-lab",
      "message": "💜 Bi: Score {{$json.performance}}/100 sous la cible — optimisation requise!"
    }
  ]
}
```

---

## 🎯 Objectifs

Cibles d'atelier (objectifs à atteindre, pas des mesures archivées — les valeurs réelles sont relevées par le workflow Lighthouse Audit après chaque build ; aucun chiffre mesuré n'est stocké en dur dans les sources).

| Objectif | Cible |
|----------|-------|
| Lighthouse Performance | > 90 |
| Lighthouse Accessibility | > 95 |
| Taille du bundle (gzip) | < 200 KB |
| First Contentful Paint | < 1.5 s |
| Largest Contentful Paint | < 2.5 s |
| Cumulative Layout Shift | < 0.1 |

---

## 🔗 Interactions avec l'équipage ARKADIA

```
Bi ←→ Wa (COORDINATOR)   : Reçoit les briefs UI et les requêtes routées
Bi ←→ Makoto (GUARDIAN)  : Envoie le front pour audits accessibilité & QA
Bi ←→ Jitsu (DEPLOYER)   : Livre le front buildé, consomme les APIs backend
Bi ←→ Dou (WATCHER)      : Reçoit les alertes Core Web Vitals en production
Bi ←→ Watashi (BUNKER)   : Échange tokens, assets et références avec le Vault
Bi ←→ Lobby (Accueil)    : Fournit l'interface du point d'entrée
```

---

## 🎨 Templates de Composants

### Composant de base

```vue
<template>
  <div class="component-name">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

// Props
interface Props {
  variant?: 'primary' | 'secondary'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary'
})

// Emits
const emit = defineEmits<{
  (e: 'action', value: string): void
}>()

// State
const isActive = ref(false)

// Computed
const classes = computed(() => ({
  'component-name': true,
  [`component-name--${props.variant}`]: true,
  'component-name--active': isActive.value
}))
</script>

<style scoped>
.component-name {
  /* styles */
}
</style>
```

### Composant Three.js

```vue
<template>
  <div ref="containerRef" class="three-container" />
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useThreeScene } from '@/composables/useThreeScene'

const containerRef = ref<HTMLElement>()

const { scene, camera, renderer, animate, dispose } = useThreeScene()

onMounted(() => {
  if (containerRef.value) {
    containerRef.value.appendChild(renderer.domElement)
    animate()
  }
})

onBeforeUnmount(() => {
  dispose()
})
</script>
```

---

## 📚 Conventions

### Nommage

```
Composants:   PascalCase.vue      (UserCard.vue)
Composables:  useCamelCase.ts     (useThreeScene.ts)
Utils:        camelCase.ts        (formatDate.ts)
Styles:       kebab-case.scss     (design-tokens.scss)
```

### Structure d'un composant

1. Template (HTML)
2. Script setup (TypeScript)
3. Style scoped (SCSS)

### Règles ESLint

```json
{
  "vue/component-name-in-template-casing": ["error", "PascalCase"],
  "vue/no-unused-components": "error",
  "vue/require-default-prop": "error"
}
```

---

## 🚀 Commandes

```bash
# Conteneur de dev (workspace ~/gl-tower/bi)
docker run -d --name bi-frontend -p 5173:5173 -v ~/gl-tower/bi:/app bi-frontend:dev

# Développement
npm run dev

# Build production
npm run build

# Preview production
npm run preview

# Tests unitaires
npm run test

# Tests E2E
npm run test:e2e

# Lint & format
npm run lint
npm run format
```

---

*Loi : Bi — Équipage ARKADIA | GL Tower — NIVEAU 5*
