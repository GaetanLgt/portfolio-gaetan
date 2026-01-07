# 🦾 T.A.D.A.S.H.I. - Frontend Engineering

> **Technical Assistance for Design And Stylish Human Interfaces**  
> *Sous-sol 1 - La Forge*

---

## 📋 Fiche Agent

| Propriété | Valeur |
|-----------|--------|
| **Nom complet** | T.A.D.A.S.H.I. |
| **Niveau** | Sous-sol 1 (La Forge) |
| **Rôle** | Frontend Engineering |
| **Status** | 🟢 ONLINE |
| **Couleur** | `#3B82F6` (Bleu) |
| **Icône** | 🦾 |

---

## 🎯 Mission

TADASHI est l'agent responsable de tout le développement frontend. Il gère :
- Architecture des composants Vue.js
- Expériences 3D avec Three.js
- Animations et interactions utilisateur
- Performance et accessibilité frontend
- Design system et cohérence UI

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
  - Lottie
  - CSS Animations
  
Styling:
  - CSS Variables (Design Tokens)
  - SCSS Modules
  - PostCSS
  
State Management:
  - Pinia
  - VueUse composables
  
Testing:
  - Vitest
  - Vue Test Utils
  - Playwright (E2E)
```

---

## 📁 Structure de Travail

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

## 🔄 Workflows n8n

### 1. Component Generator

Génère automatiquement un composant Vue.js à partir d'une description.

```json
{
  "name": "TADASHI - Component Generator",
  "trigger": "Webhook POST /tadashi/generate-component",
  "nodes": [
    {
      "type": "webhook",
      "path": "/tadashi/generate-component"
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
      "message": "🦾 TADASHI: Composant {{$json.name}} généré!"
    }
  ]
}
```

### 2. Accessibility Checker

Vérifie l'accessibilité des pages.

```json
{
  "name": "TADASHI - A11y Check",
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
      "message": "⚠️ TADASHI: {{$json.violations.length}} problèmes d'accessibilité détectés"
    }
  ]
}
```

### 3. Performance Monitor

Surveille les Core Web Vitals.

```json
{
  "name": "TADASHI - Performance Check",
  "trigger": "Webhook from VERONICA after deploy",
  "nodes": [
    {
      "type": "webhook",
      "path": "/tadashi/perf-check"
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
      "action": "Extract LCP, FID, CLS scores"
    },
    {
      "type": "if",
      "condition": "{{$json.performance < 90}}"
    },
    {
      "type": "discord",
      "channel": "#dev-lab",
      "message": "🦾 TADASHI: Performance score {{$json.performance}}/100 - Optimisation requise!"
    }
  ]
}
```

---

## 📊 Métriques

| Métrique | Objectif | Actuel |
|----------|----------|--------|
| Lighthouse Performance | > 90 | 94 |
| Lighthouse Accessibility | > 95 | 98 |
| Bundle Size (gzip) | < 200KB | 156KB |
| First Contentful Paint | < 1.5s | 1.2s |
| Largest Contentful Paint | < 2.5s | 2.1s |
| Cumulative Layout Shift | < 0.1 | 0.02 |

---

## 🔗 Interactions avec autres agents

```
TADASHI ←→ JOCASTA    : Consomme les APIs backend
TADASHI ←→ CEREBRO    : Envoie le code pour tests
TADASHI ←→ DUM-E      : Reçoit les builds optimisés
TADASHI ←→ VERONICA   : Déclenche les déploiements
TADASHI ←→ VISION     : Fournit les assets pour le contenu
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

*TADASHI v1.0 | GL Tower Dev Lab*
