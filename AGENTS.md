# AGENTS.md — portfolio-gaetan (gldigitallab.fr)

> Guide de travail pour les agents de codage (Claude Code, Codex, Copilot…).
> Objectif : stack, commandes, conventions et règles QA en un fichier — pour
> que chaque session soit fiable dès la première minute, sans re-expliquer.
> Mis à jour : 09/2026. Propriétaire : Gaëtan LANGLET.

---

## ⚠️ BANDEAU DE CORRECTION — 22/09/2026

> **Ce fichier a été corrigé le 22/09/2026 par un audit à 360°, et le motif est
> écrit ici :** il servait de PORTE D'ENTRÉE à toute session de travail, et
> **plusieurs de ses affirmations étaient fausses**. Un agent qui le croyait
> repartait sur une stack qui n'existe plus, des commandes qui ne font pas ce
> qu'il annonce, et des fichiers qui n'existent pas.
>
> ⛔ **Aucune affirmation fausse n'a été supprimée en silence.** Elles sont
> **conservées, marquées `⛔ FAUX`**, avec la mesure qui les contredit et sa
> date : *elles documentent l'histoire du dépôt, et une erreur effacée est une
> erreur qu'on refera.*
>
> **Ce qui a été corrigé, et ce qui le prouve :**
>
> | Affirmation d'origine | Mesure du 22/09/2026 |
> |---|---|
> | « Vite 5 » | **`vite ^7.3.6`** — lu dans `package.json`, `devDependencies` |
> | « `npm run build` = `generate:assets` puis `vite build` » | `npm run sitemap && npm run ecole && npm run arche && vite build && npm run prerendre`, encadré par les hooks `prebuild` et `postbuild` |
> | citait 4 fichiers **inexistants** | `components/common/TiltCard.vue`, `components/ui/AnimatedCounter.vue`, `views/core/HubPage.vue`, `views/formation/` : **absents du disque**, vérifiés un par un |
> | « site vitrine public de GL Digital Lab (**SASU**) » | **0 page livrée** ne porte « SASU » — c'est une règle de la charte |
>
> ⚠️ **Ce qui n'a PAS été corrigé, et qu'il faut savoir :** `AGENTS.md` ne
> mentionne **aucun des onze verrous** de `scripts/`. La porte d'entrée de la
> maison ne dit pas quels murs sont porteurs.

---

## 🎯 Qu'est-ce que ce repo

Le **site vitrine public de GL Digital Lab** — déployé sur gldigitallab.fr
(hébergement o2switch, France). SPA **Vue 3 + Vite** avec du créatif Three.js/GSAP
et des pages « outils » (générateurs, monitoring). Le contenu est **public** :
ne jamais y mettre de secret, de données personnelles, ni d'info sur la santé du
dirigeant (RQTH, aides…) — le site ne doit contenir aucune mention handicap.

> ⛔ **FAUX, corrigé le 22/09/2026 — cette ligne disait « (SASU) ».** Le statut
> juridique n'apparaît **nulle part** dans ce qui est livré : **0 occurrence de
> « SASU » dans les pages de `dist/`** (mesuré, hors arborescences annexes).
> C'est une **règle de la charte**, pas un oubli : le statut de la société n'a
> rien à faire sur une vitrine.
> ⭐ La formule d'origine est conservée ici parce qu'elle documente l'histoire
> du dépôt — et parce qu'un agent qui la relirait sans cette note la
> réintroduirait.

## 🧱 Stack (vérifiée dans package.json / code)

| Domaine | Techno |
|---|---|
| Framework | Vue 3.4 (`<script setup>`), vue-router 4 |
| Build | ⛔ **`vite ^7.3.6`** (lu dans `package.json`, `devDependencies`, le 22/09/2026), plugin-vue 6, terser (drop_console). ~~Vite 5~~ **FAUX** — corrigé le 22/09/2026 : ce tableau annonçait « Vite 5 », deux majeures en arrière. Un agent qui s'y fiait cherchait une API de configuration qui n'existe plus. |
| UI | CSS maison + **naive-ui** (auto-import `unplugin-vue-components`, resolver NaiveUi) |
| Créatif | three.js, GSAP, chart.js |
| Icônes | @vicons/ionicons5 |
| Polices | auto-hébergées (`src/assets/styles/fonts.css`) |
| Analytics | Matomo auto-hébergé (`useMatomo`) |
| CI/CD | GitHub Actions → FTP o2switch (`npm ci` + build) |

## ⚙️ Commandes

```bash
npm run dev                  # serveur dev Vite (port 5173 par défaut)
npm run build                # ⛔ voir ci-dessous : PAS « generate:assets puis vite build »
npm run preview              # prévisualise le build (4173)
npm run audit:lighthouse     # Lighthouse sur localhost:4173 (perf/a11y/best-practices/seo)
npm run audit:a11y           # axe sur localhost:4173
npm run audit:tout           # TOUS les verrous, un seul passage (découverts par énumération)
npm run optimize:images      # optimise les images (sharp)
```

> ⛔ **FAUX, corrigé le 22/09/2026.** Cette ligne annonçait
> « `npm run build` = `generate:assets` (favicons + og) puis `vite build` ».
> **C'est inexact, et l'écart n'est pas cosmétique.** La commande réelle, lue
> dans `package.json` le 22/09/2026 :
>
> ```
> npm run sitemap && npm run ecole && npm run arche && vite build && npm run prerendre
> ```
>
> ⭐ **CE QUI MANQUAIT EST LE PLUS IMPORTANT : `prerendre`.** Le build ne se
> contente pas de compiler : il **rend 32 pages en HTML réel** en pilotant un
> navigateur. *Un agent qui s'attendait à un simple `vite build` ne comprenait
> pas pourquoi la commande prend une à deux minutes — et pouvait la croire
> bloquée.*
>
> ⭐ **Et il y a DEUX HOOKS AUTOMATIQUES** que la ligne d'origine ignorait :
> `prebuild` (le relevé d'état avant compilation) et `postbuild` (le relevé
> final, réécrit **dans le HTML déjà prérendu**). Ils ne sont écrits nulle part
> dans la commande `build` : **c'est npm qui les déclenche**.
>
> ⚠️ `generate:assets` **n'est plus dans le build** — décision corrigée le
> 10/09/2026, et la raison est écrite dans `package.json` : les PNG sont
> versionnés et repris tels quels, *« pour que ce qui est TESTÉ soit ce qui est
> DÉPLOYÉ »*. Il reste accessible par `npm run build:images`.

**Avant de pousser** : `npm run build` doit passer. Le déploiement se fait par
push sur `main` (CI). Toujours `git pull --rebase` avant de travailler (d'autres
sessions peuvent pousser).

## 📁 Structure

```
src/
├── main.js                 # entrée : router + Matomo + SW
├── App.vue                 # layout global + footer + routes légales
├── assets/styles/          # variables, critical, global, a11y, polish, fonts, modeles/
├── components/
│   ├── charts/             # graphiques
│   ├── common/             # GaugeCircle, CustomCursor…        (17 fichiers)
│   ├── modeles/            # la tranche verticale boutique      (17 fichiers)
│   ├── sections/           # Footer, Hero…                      (3 fichiers)
│   ├── three/              # composants Three.js (canvas)        (8 fichiers)
│   └── ui/                 # GlitchText, MagneticButton…        (16 fichiers)
├── composables/            # useMatomo, hooks animation…
├── config/                 # naiveTheme.js, topographie.js…
├── data/                   # relevés mesurés (etat-studio.json…)
├── lib/                    # utilitaires partagés
├── router/index.js         # routes lazy (import dynamique par page)
└── views/
    ├── apps/               # 7 outils de l'équipage
    ├── core/               # HomePage, ContactPage, SoutePage…   (12 fichiers)
    │   └── sections/       # les sections de l'accueil (AccueilHero, AccueilVaisseau…)
    ├── legal/              # MentionsLegales, Confidentialite, CGV
    ├── modeles/            # ModeleBorealBoutique + routes-modele.js  (8 fichiers)
    ├── parcours/           # HolisticMapPage
    ├── projects/           # études de cas (ArkadiaCase, VoyageoProCase)
    ├── resources/          # TutorielsPage, components-library/
    ├── services/           # ServicesPage, ProjectsPage
    └── tools/              # outils internes
```

> ⛔ **FAUX, corrigé le 22/09/2026 — ce bloc citait QUATRE chemins qui n'existent pas.** Vérifiés un par un sur le disque, ce jour-là :
>
> | Chemin annoncé | État mesuré |
> |---|---|
> | `components/common/TiltCard.vue` | **absent** (le dossier `common/` existe, ce fichier non) |
> | `components/ui/AnimatedCounter.vue` | **absent** (le dossier `ui/` existe, ce fichier non) |
> | `views/core/HubPage.vue` | **absent** |
> | `views/formation/` | **absent — le dossier entier** |
>
> ⭐ `views/formation/` est le plus instructif : la section a été **abandonnée le 10/09/2026** (décision Gaëtan), ses vues archivées, et **le routeur le documente encore en toutes lettres**. Le guide de travail, lui, continuait de l'annoncer — avec un « ⚠️ ROUTES MASQUÉES (commentées) » qui **n'était plus vrai depuis le 11/09** : le bloc de routes avait été **supprimé**, pas commenté.
> ⭐ Et c'est exactement le même défaut que le reste de ce fichier : **une porte d'entrée qui décrit un dépôt qui n'existe plus.** *Un chemin qui n'a pas été listé n'est pas un chemin : c'est une hypothèse.*
>
> ⚠️ **Ce que ce bloc omettait aussi** : `components/modeles/` (17 fichiers), `views/modeles/` (8 fichiers), `src/data/` et `src/lib/` — c'est-à-dire **tout le chantier « Modèles »**, la tranche vendable construite le 22/09/2026.

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
- ⛔ **Le build n'exécute PLUS `generate:assets`** (corrigé le 22/09/2026 — la
  ligne disait le contraire). Le build enchaîne `sitemap`, `ecole`, `arche`,
  `vite build` puis `prerendre` : **`sharp` n'est donc plus requis au build**.
  En revanche `prerendre` **pilote un navigateur** — c'est lui qui prend le
  temps, et c'est lui qui échoue si le port 4178 est déjà pris.

## ✅ Définition of Done

- [ ] `npm run build` passe sans erreur
- [ ] Aucun secret / donnée perso ajouté
- [ ] Chiffres et tarifs réels et cohérents entre pages
- [ ] Pas de régression a11y/perf évidente (chunks lazy, reduced-motion, labels)
- [ ] Commit clair en français, poussé sur main (CI déploie)
