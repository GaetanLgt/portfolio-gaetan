# Portfolio Gaëtan - Full-Stack Developer

Portfolio moderne avec Vue 3, Three.js et animations GSAP.

---

## ⚠️ BANDEAU DE CORRECTION — 22/09/2026

> **Ce fichier a été corrigé le 22/09/2026 par un audit à 360°.** Il était la
> première chose qu'un agent ou un humain lisait du dépôt, et **presque tout ce
> qu'il annonçait de spécifique était faux** : les pages qu'il listait
> n'existent pas, et le mode de déploiement qu'il décrit n'est pas celui du
> studio.
>
> ⛔ **Aucune affirmation fausse n'a été supprimée en silence.** Elles sont
> conservées sous `⛔ FAUX`, avec la mesure qui les contredit : *elles
> documentent l'histoire du dépôt, et une erreur effacée est une erreur qu'on
> refera.*
>
> | Ce que ce fichier disait | La vérité mesurée le 22/09/2026 |
> |---|---|
> | 4 pages : *Gaming → Dev*, *Conseil des Agents*, *Stack IA 2025*, *ARKADIA FRANCE* | **aucune des quatre n'existe** — ni comme route, ni comme page livrée. La vraie page du projet est **`/arkadia`** |
> | Déploiement : **Vercel / Netlify / GitHub Pages** | **o2switch, par FTP**, via `.github/workflows/deploy.yml` — **aucune** des trois plateformes annoncées n'est utilisée |
>
> ⚠️ **Et la structure annoncée plus bas n'est pas la structure réelle** : voir
> `AGENTS.md`, qui porte la vraie arborescence — et la même correction.

---

## 🚀 Installation

```bash
# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev

# Builder pour production
npm run build
```

⚠️ **`npm run build` ne se réduit pas à `vite build`** — la commande complète,
lue dans `package.json` le 22/09/2026 :
`sitemap && ecole && arche && vite build && prerendre`, encadrée par les hooks
`prebuild` et `postbuild`. Voir `AGENTS.md` pour le détail.

## 📁 Structure du projet

```
portfolio-gaetan/
├── src/
│   ├── assets/
│   │   └── styles/          # Styles globaux
│   ├── components/
│   │   ├── common/          # Composants réutilisables
│   │   ├── three/           # Composants Three.js
│   │   └── sections/        # Sections de page
│   ├── composables/         # Hooks Vue
│   ├── views/               # Pages principales
│   ├── router/              # Configuration router
│   ├── App.vue
│   └── main.js
└── package.json
```

## 🎨 Technologies utilisées

- Vue 3 (Composition API)
- Vue Router
- Three.js (animations 3D)
- GSAP (animations)
- Vite (build tool) — ⛔ **préciser la version** : `vite ^7.3.6` au 22/09/2026,
  et non « Vite 5 » comme l'écrivait `AGENTS.md`.

## 📝 Pages

⛔ **FAUX — corrigé le 22/09/2026.** Ce fichier annonçait quatre pages :

> 1. **Gaming → Dev** : Parcours professionnel
> 2. **Conseil des Agents** : Méthodologie de travail
> 3. **Stack IA 2025** : Infrastructure IA locale
> 4. **ARKADIA FRANCE** : Case study projet gaming

**Les quatre sont fausses**, et le vérifier est simple : `src/router/index.js`
déclare **34 routes**, et aucune ne porte ces noms. Aucune page livrée ne porte
ces titres non plus.

⭐ **LA VRAIE PAGE DU PROJET ARKADIA EST `/arkadia`** — `ArkadiaCase.vue`,
« Case Study ARKADIA France (ARK) ». C'est la seule des quatre qui ait un
équivalent réel, et son adresse n'est pas celle qu'on croyait.

⭐ **CE QUI EXISTE VRAIMENT**, à la place de cette liste : 34 routes déclarées au
routeur, dont `/` , `/services`, `/projets`, `/arkadia`, `/voyageo-pro`,
`/contact`, `/dossier`, `/soute`, `/ia-de-bord`, `/etat-du-studio`,
`/ce-que-nous-nous-imposons`, `/armure`, `/carte-holistique`, `/liens`,
`/apps` et ses sept outils, `/components`, `/ressources/tutoriels`, les trois
pages légales, **`/modeles/boutique-boreal` et ses quatre marches**
(`catalogue`, `produit/:id`, `panier`, `commande`), et l'attrape-tout 404.
⭐ Le compte n'est pas écrit ici « à la main » : il se **mesure** avec
`node scripts/verifier-build-livre.mjs`, qui lit le routeur par son arbre.

## 🌐 Déploiement

⛔ **FAUX — corrigé le 22/09/2026.** Ce fichier disait :

> Le projet peut être déployé sur :
> - Vercel
> - Netlify
> - GitHub Pages

**Aucune de ces trois plateformes n'est utilisée.** Le déploiement réel est :

- **hébergeur** : **o2switch** (France), dépôt **par FTP** ;
- **déclencheur** : **`.github/workflows/deploy.yml`, au push sur `main`** —
  lu dans le fichier le 22/09/2026 (`on: push: branches: [main]`) ;
- **conséquence à connaître** : **pousser, c'est déployer.** Il n'y a pas de
  préproduction. *Un `git push` de sauvegarde part en ligne.*

```bash
npm run build
# Les fichiers de production seront dans ./dist
```

⚠️ Le contenu à envoyer est **tout `dist/`**, `.htaccess` compris, **et
`dist/api/contact.php`** — c'est le formulaire auto-hébergé ; sans lui, le
formulaire de contact ne fonctionne plus.
