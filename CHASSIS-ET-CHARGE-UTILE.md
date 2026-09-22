# Châssis et charge utile — le constat

> **Décision de Gaëtan, 22/09/2026**, citée mot pour mot :
>
> *« Tous les autres sites désignés comme des **porte-avions**. Surtout nos éléments
> principaux de studio. L'**Arcadia principal** c'est l'Arcadia principal, **seul et
> unique avec un design exclusif**. Et tous les autres **productibles, déployables
> tels des drones**. »*
>
> Le raisonnement complet est dans
> `C:\IA\gl-digital-lab\modeles\PORTE-AVIONS-ET-DRONES-2026-09-22.md`.

**Ce document CONSTATE. Il ne réorganise rien.** Aucun fichier de `src/components/modeles/`
ni de `src/views/modeles/` n'a été déplacé, renommé ou modifié pour l'écrire — un autre
agent travaillait dans ces deux dossiers au moment où il a été rédigé, et un
chevauchement silencieux se découvre en production.

---

## 0. Le test qui tranche, et il est le seul qui compte

> ## ⭐ **Si produire le drone SUIVANT demande de modifier le châssis, alors le châssis n'est pas fini.**

Tout ce qui suit n'est que l'application de cette phrase au code réel.

---

## 1. Comment ce constat a été établi, et ce qu'il ne dit pas

| Ce que j'ai fait | La commande ou la lecture |
|---|---|
| Lister les fichiers | `Get-ChildItem src/components/modeles -File` et `src/views/modeles -File` |
| Lire la raison d'être de chaque fichier | l'en-tête de commentaire de chacun, **lu**, pas déduit du nom |
| Compter les mentions de l'identité du drone | lignes contenant `boreal` (insensible à la casse), **hors lignes de commentaire** |
| Trouver qui importe quoi | recherche récursive des `import` sur tout `src/` |

⚠️ **Ce que ce document ne dit PAS :**
- **Aucun chiffre de coût, de délai ou de prix** d'un drone. Ils n'ont jamais été mesurés.
- **Aucune liste de drones à produire.** Un drone existe quand un fichier existe sur le
  disque, pas quand un document le promet.
- **Les comptes sont datés du 22/09/2026, vers 15 h.** Un autre agent transformait à ce
  moment-là les cinq marches du modèle en vraies routes : `routes-modele.js`,
  `banc-routes-boreal.mjs` et `essai-rendu.js` bougeaient encore. **Un compte périmé n'est
  pas un compte faux — c'est un compte daté.**
- ⚠️ **Le nombre de drones réellement produits au 22/09/2026 est UN** : `boutique-boreal`.
  Tout le reste est intention.

---

## 2. Le classement, fichier par fichier

### 2.1 `src/components/modeles/` — le châssis et sa charge utile, dans le même dossier

| Fichier | Classe | Pourquoi, en une ligne |
|---|---|---|
| `useManette.js` | **châssis** | Navigation manette Xbox + focus spatial. **Zéro occurrence de `boreal` dans le code** : c'est le seul gros fichier parfaitement générique. |
| `identifiants.js` | **châssis** | Compteur au niveau du module ; rend `modele-<nom>-<n>`, déjà générique. Nécessaire pour que `<label for>` et `aria-describedby` soient uniques **et identiques entre le prérendu et l'hydratation**. |
| `reglesCatalogue.js` | **châssis** | Son en-tête le dit : « LES RÈGLES PURES DU CATALOGUE. Aucune donnée, aucun import. » |
| `reglesPanier.js` | **châssis** | Arithmétique du panier en fonctions pures : ni Vue, ni navigateur, ni catalogue. |
| `ClavierManette.vue` | **châssis** ⚠️ | Clavier AZERTY à l'écran, fait de boutons. ⚠️ **Mélangé** : ses classes portent le préfixe `boreal-`. |
| `ChampTexteManette.vue` | **châssis** ⚠️ | Champ de saisie qui s'ouvre à la manette. ⚠️ **Mélangé** : `boreal-champ`, et le JS cite `.boreal-clavier` en toutes lettres. |
| `usePanier.js` | **châssis** ⛔ | État partagé + persistance `localStorage`. ⛔ **Fuite mesurée** : `CLE_PANIER = 'modele-boreal.panier.v1'` — voir § 3.1. |
| `CarteProduit.vue` | **châssis** ⚠️ | Structure de carte : deux gestes, ouvrir la fiche / ajouter. ⚠️ **Mélangé** : préfixe `boreal-`, et il importe **directement** les données du drone et son pictogramme. |
| `GrilleProduits.vue` | **châssis** ⚠️ | Grille, filtre, tri en groupe de boutons à état (`aria-pressed`) — un `<select>` ne s'ouvre pas à la manette. ⚠️ Mêmes fuites. |
| `FicheProduit.vue` | **châssis** ⚠️ | Fiche : variantes, quantité, prix recalculé par `prixUnitaire()` — **la règle n'est pas recopiée dans le gabarit**. ⚠️ **Mélangé** : 33 lignes de code portent `boreal`, et des textes sont en dur (« Ce produit n'existe pas »). |
| `PanneauPanier.vue` | **châssis** ⚠️ | Panneau : modifier, retirer, vider, passer commande. ⚠️ **Mélangé** : 32 lignes, « Votre panier » en dur. |
| `TunnelCommande.vue` | **châssis** ⛔ **le plus mélangé** | Tunnel en trois étapes simulées, **aucun appel réseau**. ⛔ **Mélangé** : 64 lignes de code portent `boreal`, et ses textes d'interface sont propres au vendeur (« Commande — démonstration »). |
| `donneesProduits.js` | **charge utile** | « Le raccord » entre les règles et les données — **et ce raccord porte le chemin en dur du JSON d'un drone** : `@/views/modeles/donnees-produits.json`. |
| `PictogrammeProduit.vue` | **charge utile** | SVG dessinés à la main, propres au catalogue de ce drone. C'est exactement ce que le document de référence met en charge utile. |
| `VitrineModele.vue` | **charge utile** (et ambiguë) | Ses textes vendent **ce** modèle ; les nombres affichés sont **comptés** depuis le catalogue réel, jamais écrits à la main. ⚠️ Ambiguë parce qu'elle parle au nom du **vendeur** (le studio), pas de la boutique : à trancher avec la décision du porte-avions. |
| `banc-donnees-boreal.mjs` | **charge utile** | Banc d'essai nommé d'après le drone : il éprouve le **châssis** avec **ses** données. |
| `banc-panier-boreal.mjs` | **charge utile** | Idem pour l'arithmétique du panier. |

### 2.2 `src/views/modeles/` — la fabrique

| Fichier | Classe | Pourquoi, en une ligne |
|---|---|---|
| `donnees-produits.json` | **charge utile** | Les données, dehors, par construction. C'est la règle du studio rendue fichier. |
| `ModeleBorealBoutique.vue` | **charge utile** | Assemble les cinq marches sur cinq vraies adresses ; nommé d'après le drone. |
| `banc-routes-boreal.mjs` | **charge utile** | Le contrôle tranche ↔ site ; nommé d'après le drone. |
| `essai-rendu.js` + `essai-rendu.html` | **charge utile** ⚠️ | Banc d'essai de la tranche. ⚠️ Il code les cinq chemins du drone **en dur**, une vingtaine de fois. |
| `routes-modele.js` | **châssis** | Dérive les enregistrements de route depuis `modeles-adresses.js` — donc du drone, voir § 3.1. |
| `vite.config.controle-modele.mjs` | **châssis d'outillage** | Donne à la tranche sa propre entrée de compilation, sans quoi `vite build` ne compilerait pas la tranche et « passerait » sans rien vérifier. Aucune identité de drone. |
| `modeles-adresses.js` | ⛔ **MÉLANGÉ — c'est le point le plus grave** | Voir § 3.1. |

### 2.3 Hors de ces deux dossiers, mais dans le périmètre du châssis

| Fichier | Classe | Pourquoi |
|---|---|---|
| `src/assets/styles/modeles/boreal.css` | ⛔ **MÉLANGÉ PAR CONSTRUCTION** | 35 964 octets de styles dont **toutes** les classes portent le préfixe `boreal-`. Ce fichier est du châssis **au nom d'un drone**. |
| `src/assets/styles/variables.css`, `global.css`, `a11y.css` | **châssis** | Jetons, primitives de mise en page, accessibilité. Vrais châssis, partagés par tout le site. |
| `src/components/sections/Navigation.vue`, `Footer.vue` | **châssis** | La coquille. Mesurée sur **28/28 routes** par `verifier-topographie.mjs`. |
| `scripts/auditer-tout.mjs` + les dix `verifier-*.mjs` | **châssis** | « Si l'étape 3 demande de modifier un verrou, le châssis n'est pas fini. » |

---

## 3. Où le châssis et la charge utile sont encore MÉLANGÉS

### 3.1 ⛔ `src/views/modeles/modeles-adresses.js` — le châssis connaît l'adresse d'un drone

L'en-tête du fichier annonce : « **LES CINQ ADRESSES DU MODÈLE, ÉCRITES UNE SEULE FOIS** ».
C'est un fichier de **châssis** — il existe pour qu'un nom de route ne soit pas écrit deux fois.

Or il porte, en clair :

```js
export const RACINE_MODELE = '/modeles/boutique-boreal';
```

**Cinq composants classés châssis l'importent** (`CarteProduit`, `FicheProduit`,
`PanneauPanier`, `TunnelCommande`, `VitrineModele`), plus `routes-modele.js` et
`essai-rendu.js`. ⇒ **Produire un deuxième drone oblige à modifier ce fichier — donc le
châssis.** Et comme les cinq composants lisent la même constante, on ne peut pas faire
coexister deux drones sans les toucher tous.

**Ce qu'il faudrait en séparer :** la **racine d'adresses** est une donnée du drone, pas
une règle du châssis. Elle devrait être **fournie** (paramètre, `provide/inject`, ou
`meta` de route lue à l'exécution), jamais **importée** par un composant générique.

### 3.2 ⛔ `src/components/modeles/usePanier.js` — l'identité du drone dans la clé de stockage

```js
export const CLE_PANIER = 'modele-boreal.panier.v1';
```

Deux conséquences, et la seconde est un défaut qui ne se voit pas au build :

1. **Le châssis porte le nom d'un drone.**
2. ⛔ **La clé est la même pour tous les drones.** Deux drones servis depuis la même
   origine partageraient la même entrée de `localStorage` : **le panier de l'un
   écraserait le panier de l'autre.** Ce n'est pas une question de goût, c'est une
   collision de données.

**Ce qu'il faudrait en séparer :** la clé doit être **dérivée de l'identité du drone**
(un identifiant fourni), pas écrite dans le châssis.

### 3.3 ⛔ Le préfixe `boreal-` dans le châssis — 196 lignes de code, 10 fichiers

Comptage : lignes contenant `boreal` (insensible à la casse), **hors lignes de commentaire**.

| Fichier | Lignes de code |
|---|---:|
| `TunnelCommande.vue` | 64 |
| `FicheProduit.vue` | 33 |
| `PanneauPanier.vue` | 32 |
| `GrilleProduits.vue` | 19 |
| `VitrineModele.vue` | 15 |
| `CarteProduit.vue` | 13 |
| `ClavierManette.vue` | 10 |
| `ChampTexteManette.vue` | 8 |
| `PictogrammeProduit.vue` | 1 |
| `usePanier.js` | 1 |
| **Total** | **196** |

Ces mentions sont presque toutes des **noms de classes CSS** (`boreal-carte`,
`boreal-section`, `boreal-titre-2`, `boreal-clavier`, `boreal-champ`…), définies dans
`src/assets/styles/modeles/boreal.css`.

⇒ **Un deuxième drone a deux mauvaises options** : réutiliser le préfixe `boreal-` dans un
drone qui ne s'appelle pas Boréal (absurde, et faux dès qu'on regarde le code), ou
retoucher les dix fichiers ci-dessus **et** la feuille de styles. **Les deux modifient le
châssis.**

**Ce qu'il faudrait en séparer :** un **préfixe neutre** dans le châssis (`mdl-` par
exemple), et la feuille de styles du drone réduite à ses **variantes** — jetons de
couleur, typographie, disposition. *Le châssis porte la structure ; le drone porte
l'allure.*

### 3.4 ⚠️ `src/components/modeles/donneesProduits.js` — le chemin en dur

Le fichier est **mince et c'est voulu** (« il ne reste ici que le raccord »). Mais ce
raccord contient :

```js
import catalogue from '@/views/modeles/donnees-produits.json';
```

⇒ **Un deuxième drone doit fournir son propre JSON au même emplacement, ou on touche le
châssis.** Le fichier tient déjà la bonne séparation (règles d'un côté, données de
l'autre) ; c'est **le chemin** qui n'est pas paramétré.

### 3.5 ⚠️ Les textes d'interface en dur dans des composants classés châssis

`TunnelCommande.vue` (« Commande — démonstration »), `PanneauPanier.vue` (« Votre
panier »), `FicheProduit.vue` (« Ce produit n'existe pas »), `GrilleProduits.vue` (« Le
catalogue »), `ChampTexteManette.vue` (« obligatoire »).

⚠️ **Ce n'est pas nécessairement un défaut** : un libellé d'interface peut être considéré
comme du châssis si tous les drones parlent la même langue au même endroit. Mais **la
décision n'est pas prise**, et elle doit l'être : *du texte en dur dans un composant
réutilisable est une décision implicite, et une décision implicite se découvre trop tard.*

**Si la décision est « les libellés changent d'un drone à l'autre »**, ils doivent sortir
du composant et venir des données du drone — comme le reste.

### 3.6 ⚠️ `src/views/modeles/essai-rendu.js` — le banc d'essai code les chemins du drone

Il monte la tranche sur **ses propres** enregistrements de route, construits depuis
`modeles-adresses.js`, et compare des chemins écrits en dur
(`/modeles/boutique-boreal/panier`, `/command`, `/catalogue`…). Le fichier
`banc-routes-boreal.mjs` a été ajouté le 22/09 précisément parce que ce banc-là prouvait
que la tranche fonctionne **avec les routes que la tranche se donne** — pas avec celles du
site. ⇒ **Un deuxième drone doit refaire ce banc, ou le rendre paramétrable.**

---

## 4. Ce qu'il faudrait faire pour produire un DEUXIÈME drone aujourd'hui

**Sept gestes, mesurés sur le code réel. Quatre d'entre eux modifient le châssis.**

| # | Geste | Touche le châssis ? |
|---|---|---|
| 1 | Créer le dossier du drone et **ses données** (`donnees-produits.json`), sur le modèle de `boutique-boreal` | ✅ non |
| 2 | **Changer le préfixe `boreal-`** dans 10 fichiers de `src/components/modeles/` (**196 lignes**) **et** dans `src/assets/styles/modeles/boreal.css` (**35 964 o**) — ou dupliquer la feuille de styles, ce qui viole « le châssis est écrit une fois » | ⛔ **OUI** |
| 3 | **Changer `CLE_PANIER`** dans `usePanier.js`, sans quoi les deux drones partagent le même panier dans `localStorage` | ⛔ **OUI** |
| 4 | **Changer `RACINE_MODELE`** dans `modeles-adresses.js` — et les cinq composants qui l'importent | ⛔ **OUI** |
| 5 | **Écrire cinq routes à la main** dans `src/router/index.js`. ⚠️ Et **ne pas** les étaler depuis `routes-modele.js` : `scripts/prerendre.js` construit sa liste d'URL avec l'expression `/path:\s*'([^']+)'/g` lue dans ce fichier — elle ne comprend que des **chemins écrits en clair**. Un `...ROUTES_MODELE` étalé ne contiendrait aucun `path:` littéral et **le prérendu perdrait le drone en silence** | ⛔ **OUI** |
| 6 | Vérifier `src/config/topographie.js` : il apparie `chemin` et `compartiment` **par ordre d'apparition**. Un drone ajouté **au milieu** décale tout ce qui suit. *C'est un défaut de conception du châssis, il se répare — pas en le contournant* | ⚠️ à vérifier (non mesuré ici) |
| 7 | Rejouer les **dix verrous** (`node scripts/auditer-tout.mjs`) | ✅ non, mais c'est l'épreuve |

### Le verdict, et il est celui du test de la § 0

> **Quatre gestes sur sept modifient le châssis.**
> ## ⇒ **Le châssis n'est pas fini.**

Et la conséquence pratique, dite sans détour : **le deuxième drone n'est pas « presque
prêt ».** Ce qui est prêt, c'est la **séparation des règles et des données** (elle est
faite, et elle est bonne : `reglesCatalogue.js` et `reglesPanier.js` ne contiennent
aucune donnée et sont éprouvés par des bancs Node). Ce qui n'est pas fait, c'est **la
séparation de l'identité** — préfixe de classes, clé de stockage, racine d'adresses,
libellés.

### Ce qui serait le plus rentable, dans l'ordre

1. **`modeles-adresses.js`** (§ 3.1) — c'est le point le plus grave : le châssis y connaît
   l'adresse d'un drone, et **cinq composants en dépendent**.
2. **Le préfixe `boreal-`** (§ 3.3) — le plus gros volume (196 lignes, 10 fichiers,
   1 feuille de styles), et **le seul qu'on peut faire mécaniquement** avec une assertion
   de structure.
3. **`CLE_PANIER`** (§ 3.2) — petit geste, **défaut de données réel** (§ collision de
   `localStorage`).
4. **Le chemin du JSON dans `donneesProduits.js`** (§ 3.4).
5. **Les cinq routes** (§ 4, geste 5) — ⚠️ **dépend du chantier `router/index.js` en cours**,
   et du piège de `prerendre.js`.

---

## 5. Ce que ce document n'a PAS pu mesurer

- ⛔ **Je n'ai pas exécuté `src/config/topographie.js`** : je n'ai pas vérifié son
  appariement par ordre sur des données réelles. La § 4, geste 6 le dit « à vérifier ».
- ⛔ **Je n'ai pas produit de deuxième drone.** Ce document décrit un chemin ; il ne l'a
  pas parcouru. *Un chemin qu'on n'a pas parcouru n'est pas un chemin, c'est une
  hypothèse* — et c'est écrit ici pour que personne ne le prenne pour une mesure.
- ⚠️ **Les comptes sont datés du 22/09/2026 vers 15 h.** Un autre agent modifiait ces
  fichiers au même moment (`routes-modele.js`, `banc-routes-boreal.mjs`, `essai-rendu.js`,
  `donnees-produits.json`, `ModeleBorealBoutique.vue`). Les fichiers sont **nommés**, donc
  les comptes se refont : la méthode est en § 1.

---

*Écrit le 22/09/2026 — Génie IT TeK FR. Chaque ligne de décision vient d'une phrase du
dirigeant ; chaque ligne technique vient d'un fichier **lu**, jamais deviné.*
