# Intégrer Vue 3 + Vite dans Symfony 7

> **Tutoriel pas à pas** pour créer une application Symfony 7 avec Vue 3 et Vite comme bundler.

---

## Table des matières

1. [Pré-requis](#1-pré-requis)
2. [Création du projet Symfony](#2-création-du-projet-symfony)
3. [Installation et configuration de Vite](#3-installation-et-configuration-de-vite)
4. [Installation et setup Vue 3](#4-installation-et-setup-vue-3)
5. [Intégration avec Twig](#5-intégration-avec-twig)
6. [Lancer l'environnement de dev](#6-lancer-lenvironnement-de-dev)
7. [Bonus](#7-bonus)

---

## 1. Pré-requis

### Versions minimales requises

| Outil | Version minimale |
|-------|------------------|
| PHP | 8.2+ |
| Node.js | 18+ |
| npm | 9+ (ou yarn 1.22+) |
| Composer | 2.5+ |
| Symfony CLI | 5.8+ |

### Vérifier vos versions

```bash
php -v
# PHP 8.2.x ou supérieur

node -v
# v18.x.x ou supérieur

npm -v
# 9.x.x ou supérieur

composer -V
# Composer version 2.5.x ou supérieur

symfony version
# Symfony CLI version 5.8.x ou supérieur
```

### Installation des outils manquants

```bash
# Symfony CLI (si non installé)
curl -sS https://get.symfony.com/cli/installer | bash

# Node.js via nvm (recommandé)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 20
nvm use 20
```

---

## 2. Création du projet Symfony

### 2.1 Créer le projet

```bash
# Créer un nouveau projet Symfony 7 (webapp inclut Twig, Doctrine, etc.)
symfony new mon-projet --version="7.2.*" --webapp

# OU version minimale (sans Doctrine)
symfony new mon-projet --version="7.2.*"

# Se placer dans le projet
cd mon-projet
```

### 2.2 Installer Twig (si version minimale)

```bash
# Seulement si vous avez utilisé la version minimale
composer require twig
```

### 2.3 Créer un contrôleur de test

```bash
# Générer un contrôleur avec le maker bundle
composer require symfony/maker-bundle --dev
php bin/console make:controller HomeController
```

### 2.4 Fichier : `src/Controller/HomeController.php`

Remplacez le contenu généré par :

```php
<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class HomeController extends AbstractController
{
    #[Route('/', name: 'app_home')]
    public function index(): Response
    {
        return $this->render('home/index.html.twig', [
            'title' => 'Mon App Symfony + Vue',
        ]);
    }
}
```

### 2.5 Fichier : `templates/home/index.html.twig`

Créez ce fichier :

```twig
{% extends 'base.html.twig' %}

{% block title %}{{ title }}{% endblock %}

{% block body %}
    <div class="container">
        <h1>{{ title }}</h1>
        <p>Symfony fonctionne ! Vue arrive bientôt...</p>
    </div>
{% endblock %}
```

### 2.6 Vérifier que Symfony fonctionne

```bash
# Lancer le serveur Symfony
symfony serve

# Ouvrir http://127.0.0.1:8000
# Vous devez voir "Mon App Symfony + Vue"
```

Arrêtez le serveur (`Ctrl+C`) avant de continuer.

---

## 3. Installation et configuration de Vite

### 3.1 Initialiser npm

```bash
# À la racine du projet Symfony
npm init -y
```

### 3.2 Installer Vite et le plugin Symfony

```bash
# Vite + plugin d'intégration Symfony
npm install vite vite-plugin-symfony --save-dev
```

### 3.3 Installer le bundle Symfony côté PHP

```bash
composer require pentatrion/vite-bundle
```

### 3.4 Créer la structure des assets

```bash
# Créer le dossier assets
mkdir -p assets
touch assets/app.js
touch assets/app.css
```

### 3.5 Fichier : `vite.config.js`

Créez ce fichier à la **racine du projet** :

```javascript
import { defineConfig } from 'vite';
import symfonyPlugin from 'vite-plugin-symfony';

export default defineConfig({
    plugins: [
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
        // Permet l'accès depuis Symfony
        origin: 'http://localhost:5173',
    },
});
```

### 3.6 Fichier : `assets/app.js`

Contenu initial (sans Vue pour l'instant) :

```javascript
/*
 * Point d'entrée principal de l'application
 */
import './app.css';

console.log('Vite fonctionne !');
```

### 3.7 Fichier : `assets/app.css`

Quelques styles de base :

```css
/* Reset minimal */
*,
*::before,
*::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}

body {
    font-family: system-ui, -apple-system, sans-serif;
    line-height: 1.6;
    color: #1a1a1a;
    background: #f5f5f5;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
}

h1 {
    color: #10b981;
    margin-bottom: 1rem;
}
```

### 3.8 Fichier : `package.json`

Ajoutez les scripts dans votre `package.json` :

```json
{
  "name": "mon-projet",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "devDependencies": {
    "vite": "^5.x.x",
    "vite-plugin-symfony": "^7.x.x"
  }
}
```

> **Note** : Les versions exactes dépendent de ce qui a été installé. Vérifiez votre `package.json` après l'installation.

### 3.9 Fichier : `config/packages/pentatrion_vite.yaml`

Ce fichier est normalement créé automatiquement. Vérifiez qu'il contient :

```yaml
pentatrion_vite:
    default_build: app
    builds:
        app:
            scripts_attributes:
                type: module
            # En dev, Vite tourne sur le port 5173
            # En prod, les assets sont dans public/build
```

---

## 4. Installation et setup Vue 3

### 4.1 Installer Vue 3 et le plugin Vite

```bash
# Vue 3
npm install vue

# Plugin Vite pour Vue (compilation des .vue)
npm install @vitejs/plugin-vue --save-dev
```

### 4.2 Mettre à jour `vite.config.js`

Modifiez le fichier pour ajouter le plugin Vue :

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
        origin: 'http://localhost:5173',
    },
    resolve: {
        alias: {
            // Permet d'importer avec @ depuis assets/
            '@': '/assets',
        },
    },
});
```

### 4.3 Créer la structure Vue

```bash
# Créer le dossier pour les composants Vue
mkdir -p assets/vue/components
touch assets/vue/App.vue
```

### 4.4 Fichier : `assets/vue/App.vue`

Créez votre premier composant Vue :

```vue
<script setup>
import { ref } from 'vue';

// Variable réactive
const count = ref(0);
const message = ref('Hello depuis Vue 3 !');

// Méthode
const increment = () => {
    count.value++;
};
</script>

<template>
    <div class="vue-app">
        <div class="vue-card">
            <h2>{{ message }}</h2>
            <p>Compteur : <strong>{{ count }}</strong></p>
            <button @click="increment">
                Incrémenter
            </button>
        </div>
    </div>
</template>

<style scoped>
.vue-app {
    margin-top: 2rem;
}

.vue-card {
    background: white;
    border-radius: 8px;
    padding: 2rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    max-width: 400px;
}

.vue-card h2 {
    color: #42b883;
    margin-bottom: 1rem;
}

.vue-card p {
    margin-bottom: 1rem;
}

.vue-card button {
    background: #42b883;
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;
    transition: background 0.2s;
}

.vue-card button:hover {
    background: #369870;
}
</style>
```

### 4.5 Fichier : `assets/app.js`

Mettez à jour le point d'entrée pour monter Vue :

```javascript
/*
 * Point d'entrée principal
 * Monte l'application Vue sur #vue-app
 */
import './app.css';
import { createApp } from 'vue';
import App from './vue/App.vue';

// Monter Vue seulement si l'élément existe
const appElement = document.getElementById('vue-app');

if (appElement) {
    const app = createApp(App);
    app.mount('#vue-app');
    console.log('Vue 3 monté avec succès !');
} else {
    console.log('Élément #vue-app non trouvé sur cette page.');
}
```

---

## 5. Intégration avec Twig

### 5.1 Fichier : `templates/base.html.twig`

Remplacez le contenu par :

```twig
<!DOCTYPE html>
<html lang="fr">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>{% block title %}Mon App{% endblock %}</title>
        
        {# Icône #}
        <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 128 128%22><text y=%221.2em%22 font-size=%2296%22>🚀</text></svg>">
        
        {# Styles Vite - Fonctionne en dev ET en prod #}
        {{ vite_entry_link_tags('app') }}
        
        {% block stylesheets %}{% endblock %}
    </head>
    <body>
        {% block body %}{% endblock %}
        
        {# Scripts Vite - Fonctionne en dev ET en prod #}
        {{ vite_entry_script_tags('app') }}
        
        {% block javascripts %}{% endblock %}
    </body>
</html>
```

### 5.2 Fichier : `templates/home/index.html.twig`

Mettez à jour le template pour inclure la div Vue :

```twig
{% extends 'base.html.twig' %}

{% block title %}{{ title }}{% endblock %}

{% block body %}
    <div class="container">
        <h1>{{ title }}</h1>
        <p>Cette page est générée par Symfony avec Twig.</p>
        
        <hr style="margin: 2rem 0; border: none; border-top: 1px solid #ddd;">
        
        {# Zone où Vue sera monté #}
        <div id="vue-app"></div>
        
        <hr style="margin: 2rem 0; border: none; border-top: 1px solid #ddd;">
        
        <p><small>Le composant Vue ci-dessus est chargé via Vite.</small></p>
    </div>
{% endblock %}
```

### 5.3 Comprendre le fonctionnement

| Mode | Comportement |
|------|-------------|
| **Développement** | `vite_entry_*_tags` génère des liens vers `http://localhost:5173` (Vite dev server avec HMR) |
| **Production** | `vite_entry_*_tags` génère des liens vers les fichiers buildés dans `public/build/` |

Le bundle `pentatrion/vite-bundle` détecte automatiquement si Vite dev server tourne ou non.

---

## 6. Lancer l'environnement de dev

### 6.1 Terminal 1 : Serveur Symfony

```bash
# Lance le serveur PHP sur le port 8000
symfony serve
```

Gardez ce terminal ouvert.

### 6.2 Terminal 2 : Vite dev server

```bash
# Lance Vite avec HMR sur le port 5173
npm run dev
```

Gardez ce terminal ouvert également.

### 6.3 Ouvrir l'application

1. Ouvrez votre navigateur à **http://127.0.0.1:8000**
2. Vous devez voir :
   - Le titre "Mon App Symfony + Vue" (rendu par Twig)
   - Le composant Vue avec "Hello depuis Vue 3 !" et un bouton compteur
3. Cliquez sur "Incrémenter" → le compteur augmente (réactivité Vue)
4. Modifiez `assets/vue/App.vue` → la page se met à jour instantanément (HMR)

### 6.4 Build pour la production

```bash
# Arrêtez npm run dev, puis :
npm run build

# Les assets sont générés dans public/build/
# Symfony les servira automatiquement
```

Structure générée :

```
public/
└── build/
    ├── manifest.json      # Mapping des assets
    ├── entrypoints.json   # Points d'entrée pour le bundle
    ├── assets/
    │   ├── app-[hash].js
    │   └── app-[hash].css
    └── ...
```

---

## 7. Bonus

### 7.1 Ajouter un second composant Vue sur une autre page

#### Créer un nouveau composant : `assets/vue/Counter.vue`

```vue
<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
    initialValue: {
        type: Number,
        default: 0,
    },
    step: {
        type: Number,
        default: 1,
    },
});

const count = ref(props.initialValue);

const increment = () => count.value += props.step;
const decrement = () => count.value -= props.step;
const reset = () => count.value = props.initialValue;

const isPositive = computed(() => count.value > 0);
const isNegative = computed(() => count.value < 0);
</script>

<template>
    <div class="counter">
        <div class="counter__display" :class="{ positive: isPositive, negative: isNegative }">
            {{ count }}
        </div>
        <div class="counter__controls">
            <button @click="decrement">−</button>
            <button @click="reset">Reset</button>
            <button @click="increment">+</button>
        </div>
    </div>
</template>

<style scoped>
.counter {
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    padding: 1.5rem;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.counter__display {
    font-size: 3rem;
    font-weight: bold;
    font-family: monospace;
    min-width: 100px;
    text-align: center;
    transition: color 0.2s;
}

.counter__display.positive { color: #10b981; }
.counter__display.negative { color: #ef4444; }

.counter__controls {
    display: flex;
    gap: 0.5rem;
}

.counter__controls button {
    width: 50px;
    height: 40px;
    border: none;
    border-radius: 4px;
    background: #e5e7eb;
    cursor: pointer;
    font-size: 1.25rem;
    transition: background 0.2s;
}

.counter__controls button:hover {
    background: #d1d5db;
}
</style>
```

#### Créer un nouveau point d'entrée : `assets/counter.js`

```javascript
/*
 * Point d'entrée pour le composant Counter
 * Utilisé sur des pages spécifiques
 */
import { createApp } from 'vue';
import Counter from './vue/Counter.vue';

// Monter tous les compteurs sur la page
document.querySelectorAll('[data-counter]').forEach((element) => {
    const initialValue = parseInt(element.dataset.initialValue || '0', 10);
    const step = parseInt(element.dataset.step || '1', 10);
    
    createApp(Counter, { initialValue, step }).mount(element);
});
```

#### Mettre à jour `vite.config.js`

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
                counter: './assets/counter.js',  // Nouveau point d'entrée
            },
        },
    },
    server: {
        origin: 'http://localhost:5173',
    },
    resolve: {
        alias: {
            '@': '/assets',
        },
    },
});
```

#### Créer une nouvelle page : `src/Controller/DemoController.php`

```php
<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class DemoController extends AbstractController
{
    #[Route('/demo/counters', name: 'app_demo_counters')]
    public function counters(): Response
    {
        return $this->render('demo/counters.html.twig');
    }
}
```

#### Template : `templates/demo/counters.html.twig`

```twig
{% extends 'base.html.twig' %}

{% block title %}Démo Counters{% endblock %}

{% block stylesheets %}
    {# Pas de CSS spécifique pour counter, il est dans le composant #}
{% endblock %}

{% block body %}
    <div class="container">
        <h1>Démo : Plusieurs instances du même composant</h1>
        <p>Chaque compteur est une instance Vue indépendante.</p>
        
        <div style="display: flex; gap: 2rem; flex-wrap: wrap; margin-top: 2rem;">
            {# Compteur par défaut #}
            <div data-counter></div>
            
            {# Compteur avec valeur initiale #}
            <div data-counter data-initial-value="10"></div>
            
            {# Compteur avec step personnalisé #}
            <div data-counter data-initial-value="0" data-step="5"></div>
        </div>
        
        <p style="margin-top: 2rem;">
            <a href="{{ path('app_home') }}">← Retour à l'accueil</a>
        </p>
    </div>
{% endblock %}

{% block javascripts %}
    {# Charger le script counter en plus de app #}
    {{ vite_entry_script_tags('counter') }}
{% endblock %}
```

Visitez **http://127.0.0.1:8000/demo/counters** pour voir trois compteurs indépendants.

---

### 7.2 Organisation recommandée des fichiers

```
assets/
├── app.js                    # Point d'entrée principal
├── app.css                   # Styles globaux
├── counter.js                # Point d'entrée secondaire (optionnel)
│
├── vue/
│   ├── App.vue               # Composant racine
│   │
│   └── components/           # Composants réutilisables
│       ├── Counter.vue
│       ├── Button.vue
│       ├── Card.vue
│       └── ...
│
├── styles/                   # CSS/SCSS organisé
│   ├── _variables.css
│   ├── _reset.css
│   └── components/
│       └── ...
│
└── utils/                    # Helpers JS
    ├── api.js
    └── helpers.js
```

---

### 7.3 Ajouter Vue Router (SPA partielle)

```bash
npm install vue-router
```

#### Fichier : `assets/vue/router.js`

```javascript
import { createRouter, createWebHistory } from 'vue-router';

// Lazy loading des vues
const Home = () => import('./views/Home.vue');
const About = () => import('./views/About.vue');

const routes = [
    { path: '/', name: 'home', component: Home },
    { path: '/about', name: 'about', component: About },
];

const router = createRouter({
    history: createWebHistory('/app'), // Base path si sous /app
    routes,
});

export default router;
```

#### Mise à jour `assets/app.js`

```javascript
import './app.css';
import { createApp } from 'vue';
import App from './vue/App.vue';
import router from './vue/router';

const appElement = document.getElementById('vue-app');

if (appElement) {
    const app = createApp(App);
    app.use(router);
    app.mount('#vue-app');
}
```

> **Note** : Pour une SPA complète sous Symfony, configurez une route catch-all côté Symfony qui renvoie le même template Twig pour toutes les URLs sous `/app/*`.

---

### 7.4 Ajouter Tailwind CSS

```bash
npm install tailwindcss postcss autoprefixer --save-dev
npx tailwindcss init -p
```

#### Fichier : `tailwind.config.js`

```javascript
/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './templates/**/*.html.twig',
        './assets/**/*.{vue,js,ts,jsx,tsx}',
    ],
    theme: {
        extend: {},
    },
    plugins: [],
};
```

#### Fichier : `assets/app.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Vos styles custom ici */
```

---

### 7.5 Variables d'environnement

#### Fichier : `.env.local` (Symfony)

```
# Vos variables Symfony
APP_ENV=dev
```

#### Fichier : `.env` (Vite - pour le JS)

```
VITE_API_URL=http://127.0.0.1:8000/api
VITE_APP_NAME="Mon App"
```

#### Utilisation dans Vue

```javascript
// Dans un composant ou fichier JS
const apiUrl = import.meta.env.VITE_API_URL;
const appName = import.meta.env.VITE_APP_NAME;
```

---

## Récapitulatif des commandes

```bash
# Installation complète (à lancer dans l'ordre)
symfony new mon-projet --version="7.2.*" --webapp
cd mon-projet
composer require pentatrion/vite-bundle
npm init -y
npm install vite vite-plugin-symfony --save-dev
npm install vue @vitejs/plugin-vue --save-dev

# Développement (2 terminaux)
symfony serve          # Terminal 1
npm run dev            # Terminal 2

# Production
npm run build
symfony serve --env=prod
```

---

## Ressources

- [Documentation Vite](https://vitejs.dev/)
- [Documentation Vue 3](https://vuejs.org/)
- [pentatrion/vite-bundle](https://github.com/lhapaipai/vite-bundle)
- [vite-plugin-symfony](https://github.com/lhapaipai/vite-plugin-symfony)
- [Symfony UX](https://symfony.com/bundles/ux)

---

**Auteur** : GL Digital Lab  
**Licence** : MIT  
**Dernière mise à jour** : Janvier 2026
