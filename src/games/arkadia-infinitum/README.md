# Arkadia Infinitum / The Construct

## Structure du projet

```
arkadia-infinitum/
├── components/
│   ├── index.js                 # Export centralisé
│   ├── TechFeed.vue             # Original (monolithique)
│   ├── TechFeedOptimized.vue    # Version modulaire
│   ├── techfeed/                # Sous-composants TechFeed
│   │   ├── FeedAtmosphere.vue   # Background atmosphérique
│   │   ├── FeedHeader.vue       # Header avec logo et stats
│   │   ├── FeedCategories.vue   # Barre de catégories
│   │   ├── FeedFeatured.vue     # Signal mis en avant
│   │   ├── FeedGrid.vue         # Grille des signaux
│   │   ├── FeedWisdom.vue       # Terminal des citations
│   │   ├── FeedStatus.vue       # Barre de statut
│   │   └── index.js             # Export
│   ├── mobile/
│   │   └── MobileControls.vue   # Contrôles tactiles
│   ├── effects/                 # Effets Three.js
│   │   ├── CyberpunkSkyline.js
│   │   ├── MatrixRain3D.js
│   │   ├── MatrixPostProcessing.js
│   │   ├── SpaceVehicles.js
│   │   └── index.js
│   ├── WorkflowVisualizer.vue
│   ├── PixelArtEditor.vue
│   ├── Minimap.vue
│   ├── XPHud.vue
│   └── AchievementsPanel.vue
│
├── composables/
│   ├── index.js                 # Export centralisé
│   ├── useTechFeed.js           # Logique du Neural Feed
│   ├── useAchievements.js
│   ├── useGameProgress.js
│   ├── useNodeLabels.js
│   └── useNodeShapes.js
│
├── data/
│   ├── index.js                 # Export centralisé
│   ├── nodes.js                 # Nodes du Construct
│   ├── connections.js           # Connexions entre nodes
│   ├── programs.js              # Programmes Matrix
│   ├── cheatcodes.js            # Cheats & quotes Morpheus
│   ├── siteStructure.js         # Structure du site
│   └── techfeed/                # Données du Neural Feed
│       ├── signals.js           # 35+ signaux de veille
│       ├── categories.js        # 8 catégories
│       ├── quotes.js            # 15+ citations
│       └── index.js             # Export + helpers
│
├── styles/
│   ├── index.css                # Import global
│   ├── variables.css            # Variables CSS Matrix
│   └── animations.css           # Animations réutilisables
│
├── MatrixAdminHub.vue           # Page principale du Construct
└── ArkadiaInfinitum.vue         # Legacy (à migrer)
```

## Utilisation

### Import des composants
```javascript
import { TechFeed, MobileControls } from '@/games/arkadia-infinitum/components';
```

### Import des composables
```javascript
import { useTechFeed, useAchievements } from '@/games/arkadia-infinitum/composables';
```

### Import des données
```javascript
import { signals, categories, quotes, getSignalsByCategory } from '@/games/arkadia-infinitum/data';
```

## TechFeed (Neural Feed)

### Architecture modulaire

Le TechFeed utilise le pattern **Composition API** avec un composable dédié :

```vue
<script setup>
import { useTechFeed } from '../composables/useTechFeed.js';

const {
  activeTab,
  currentTime,
  filteredItems,
  featuredItem,
  regularItems,
  currentQuote,
  stats,
  getCountByCategory,
  setActiveTab,
  nextQuote,
  openItem
} = useTechFeed();
</script>
```

### Données externalisées

- **signals.js** : 35+ signaux de veille tech
- **categories.js** : 8 catégories (IA, Dev, Qualité, RGPD, Réseaux, Sécurité, Mindset)
- **quotes.js** : 15+ citations inspirantes

### Styles partagés

Variables CSS Matrix disponibles dans `styles/variables.css` :

```css
--matrix-green: #00ff88;
--matrix-cyan: #00ffff;
--matrix-purple: #bf00ff;
--matrix-bg-deep: #010a01;
--matrix-border: rgba(0, 255, 136, 0.2);
```

## Raccourcis clavier

| Touche | Action |
|--------|--------|
| N | Ouvrir/fermer le Neural Feed |
| Échap | Fermer le Neural Feed |
| H | Afficher l'aide clavier |
| W/A/S/D | Déplacement dans le Construct |

## Mobile

Sur mobile, `MobileControls.vue` détecte automatiquement le device et affiche :
- Joystick gauche : Déplacement
- Joystick droit : Rotation caméra
- Boutons d'action : Interagir, Menu, Feed

---

GL Digital Lab © 2024-2026
