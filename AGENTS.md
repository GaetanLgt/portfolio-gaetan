# AGENTS.md — portfolio-gaetan (gldigitallab.fr)

> Guide de travail pour les agents de codage (Claude Code, Codex, Copilot…).
> Objectif : stack, commandes, conventions et règles QA en un fichier — pour
> que chaque session soit fiable dès la première minute, sans re-expliquer.
> Mis à jour : 09/2026. Propriétaire : Gaëtan LANGLET.

---

## 🎯 Qu'est-ce que ce repo

Le **site vitrine public de GL Digital Lab** (SASU) — déployé sur gldigitallab.fr
(hébergement o2switch, France). SPA **Vue 3 + Vite** avec du créatif Three.js/GSAP
et des pages « outils » (générateurs, monitoring). Le contenu est **public** :
ne jamais y mettre de secret, de données personnelles, ni d'info sur la santé du
dirigeant (RQTH, aides…) — le site ne doit contenir aucune mention handicap.

## 🧱 Stack (vérifiée dans package.json / code)

| Domaine | Techno |
|---|---|
| Framework | Vue 3.4 (`<script setup>`), vue-router 4 |
| Build | Vite 5, plugin-vue, terser (drop_console) |
| UI | CSS maison + **naive-ui** (auto-import `unplugin-vue-components`, resolver NaiveUi) |
| Créatif | three.js, GSAP, chart.js |
| Icônes | @vicons/ionicons5 |
| Polices | auto-hébergées (`src/assets/styles/fonts.css`) |
| Analytics | Matomo auto-hébergé (`useMatomo`) |
| CI/CD | GitHub Actions → FTP o2switch (`npm ci` + build) |

## ⚙️ Commandes

```bash
npm run dev                  # serveur dev Vite (port 5173 par défaut)
npm run build                # generate:assets (favicons + og) puis vite build
npm run preview              # prévisualise le build (4173)
npm run audit:lighthouse     # Lighthouse sur localhost:4173 (perf/a11y/best-practices/seo)
npm run audit:a11y           # axe sur localhost:4173
npm run optimize:images      # optimise les images (sharp)
```

**Avant de pousser** : `npm run build` doit passer. Le déploiement se fait par
push sur `main` (CI). Toujours `git pull --rebase` avant de travailler (d'autres
sessions peuvent pousser).

## 📁 Structure

```
src/
├── main.js                 # entrée : router + Matomo + SW
├── App.vue                 # layout global + footer + routes légales
├── assets/styles/          # variables, critical, global, a11y, polish, fonts
├── components/
│   ├── common/             # GaugeCircle, CustomCursor, TiltCard…
│   ├── three/              # composants Three.js (canvas)
│   ├── sections/           # Footer, Hero…
│   └── ui/                 # GlitchText, MagneticButton, AnimatedCounter…
├── composables/            # useMatomo, hooks animation…
├── config/                 # naiveTheme.js…
├── router/index.js         # routes lazy (import dynamique par page)
└── views/
    ├── core/               # HomePage, HubPage, ContactPage…
    ├── services/           # ServicesPage…
    ├── projects/           # études de cas (ArkadiaCase…)
    ├── legal/              # MentionsLegales, Confidentialite, CGV
    ├── formation/          # ⚠️ vues naive-ui lourdes, ROUTES MASQUÉES (commentées)
    └── tools/              # outils internes (générateurs…)
```

## 📐 Conventions

- **Vue 3 `<script setup>`**, imports explicites. Pas de TypeScript.
- **Composants auto-importés** : `unplugin-vue-components` résout les `n-*`
  (naive-ui) — ne pas importer naive-ui globalement dans main.js.
- **Routes lazy** : chaque vue = `() => import('@/views/...')` avec
  `/* webpackChunkName: "x" */`. **Ne jamais regrouper les vues en un seul chunk**
  (cassait le lazy-loading et rechargeait Three.js en bloquant — voir historique).
- **Classes** : BEM-ish (`proof__title`, `solution-card__price`), variables CSS
  (`--primary`, `--space-*`) définies dans variables.css.
- **Utilitaires** : `.text-gradient` (dégradé texte) — l'appliquer **directement
  sur le texte**, jamais en enveloppant un composant comme GlitchText (le rend
  illisible : fill transparent hérité sans fond).
- **Animations** : GSAP/Three.js/glitch doivent respecter
  `prefers-reduced-motion` (voir composants existants : AnimatedCounter,
  GaugeCircle, ReactiveParticles…).
- **Accessibilité** : labels `for`/`id` associés, alt, skip-link, focus visible,
  contraste ≥ 4,5:1. Audits axe/Lighthouse dispo en scripts.

## 🛡️ Règles dures (Makoto)

1. **Aucune donnée inventée** : jamais de faux prix, fausse métrique, faux témoignage,
   faux client, faux chiffre d'exploitation. Les chiffres affichés doivent être
   réels et datés (ex. ARKADIA : « chiffres constatés sur 18 mois », pas une promesse).
2. **Aucun secret** : pas de token, mot de passe, clé API, identifiant FTP dans le
   code ou les commits. Les `.env*` réels sont hors git.
3. **Aucune donnée personnelle du dirigeant en ligne** : ne jamais ajouter de
   mention RQTH/handicap/santé/statut administratif au contenu public (décision
   actée 09/2026 — la section OETH a été retirée).
4. **Le site reflète le réel** : cohérence des tarifs entre pages (accueil vs
   services), des preuves, de la formulation « IA locale / données en France »
   (sans sur-promettre : GitHub/Gmail/Discord sont US — ne pas écrire
   « aucune donnée ne sort de France » à tort).
5. **Pas de réécriture massive** : correctifs ciblés. Ne pas casser le design
   existant ni les animations sans le demander.

## ⚠️ Pièges connus (à ne pas reproduire)

- Ne pas ré-introduire `app.use(naive)` global : vendor passait de 115 Ko à
  1,4 Mo (corrigé 09/2026).
- Ne pas envelopper `.text-gradient` autour de composants enfants (texte invisible).
- Ne pas ajouter de gros chunk eager : vérifier que Three.js/naive-ui restent
  dans des chunks lazy séparés.
- `pnpm` ≠ gestionnaire du repo : on utilise **npm** (CI en `npm ci`) — installer
  avec `npm install`, jamais pousser de pnpm-lock/pnpm-workspace.
- Le build exécute `generate:assets` (sharp) : prévoir node_modules à jour.

## ✅ Définition of Done

- [ ] `npm run build` passe sans erreur
- [ ] Aucun secret / donnée perso ajouté
- [ ] Chiffres et tarifs réels et cohérents entre pages
- [ ] Pas de régression a11y/perf évidente (chunks lazy, reduced-motion, labels)
- [ ] Commit clair en français, poussé sur main (CI déploie)
