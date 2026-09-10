# Mesurer la performance de ce site — mode d'emploi et pièges

> **À lire avant de croire un chiffre de performance sur ce projet.**
> Constat établi le 10/09/2026 après six tirs Lighthouse successifs.
>
> ⚠️ **CORRECTION DU 10/09/2026 (soir) — LE DIAGNOSTIC DE CE DOCUMENT EST FAUX.**
> Les six tirs à 45–61 décrits ci-dessous ne venaient **pas** d'un rendu logiciel de
> la machine : ils venaient du **serveur de développement** (`vite dev`). Mesuré le
> même jour, même machine, protocole **identique** (Lighthouse 13.4.1, 3 tirs par
> mode, **médiane** retenue, poste « Other » vérifié, `benchmarkIndex` relevé) :
>
> | Environnement | Mobile | Desktop | Poids | Requêtes |
> |---|---|---|---|---|
> | `vite dev` — serveur de développement | **56** (56/56/56) | 77 | **2 113 Ko** | **86** |
> | `vite preview` — aperçu du build | 84 | 99 | 295 Ko | 12 |
> | **Production** (`gldigitallab.fr`) | **91** (91/91/92) | **100** (100/100/100) | 317 Ko | 12 |
>
> Le serveur de développement **déballe** le code (86 requêtes, 2,1 Mo) au lieu de le
> **regrouper** (12 requêtes, ~300 Ko). La performance de ce site **est mesurable**,
> elle l'a toujours été : il ne fallait pas mesurer le bon environnement.
> En production, le poste « Other » vaut 27 à 38 % — il ne domine pas.
> Rejeu et détail : `C:\IA\gl-digital-lab\modeles\performance-site-enigme-resolue-2026-09-10.md`.
>
> **Ce qui reste à faire avant de publier un engagement chiffré** : refaire les tirs
> **depuis une autre machine**, pour savoir si 91 en mobile est un plancher dû à la
> lenteur de ce poste (`benchmarkIndex` 1 885 à 3 287, contre ~1 000 sur un poste
> rapide) ou la valeur réelle. Et balayer les autres pages : **seul l'accueil est
> mesuré** — une leçon déjà payée sur l'accessibilité.

---

## 1. Ce qui est fiable, ce qui ne l'est pas

| Catégorie | Stabilité sur 6 tirs | Confiance |
|---|---|---|
| **Accessibilité** | **97 / 100 sur les six tirs** | ✅ fiable |
| **Bonnes pratiques** | 100 / 100 | ✅ fiable |
| **Référencement** | 100 / 100 | ✅ fiable |
| **Performance** | **45 · 46 · 49 · 51 · 58 · 61** | ❌ **non fiable** |

L'accessibilité, les bonnes pratiques et le référencement ne bougent pas : les
mesurer est utile et les chiffres sont exploitables. **La performance, non.**

---

## 2. Pourquoi la performance est inexploitable ici

Le poste « Other » du fil principal (le travail non attribuable à du script, du
style ou du rendu) s'effondre d'un tir à l'autre, et le score varie exactement en
sens inverse :

| Tir | Performance | « Other » |
|---|---|---|
| 1 | 51 | 5 607 ms |
| 2 | 61 | 5 326 ms |
| 3 | 49 | 9 229 ms |
| 4 | 46 | 8 691 ms |
| 5 | **58** | **1 397 ms** |
| 6 | 45 | 6 787 ms |

Plusieurs milliers de millisecondes de « Other » **sont la signature d'un rendu
logiciel** : le navigateur n'utilise pas la carte graphique et peint chaque image
avec le processeur. Sur cette machine, **cela s'est produit cinq fois sur six**.

Un vrai visiteur a une carte graphique. Les cinq tirs qui mesurent du rendu
logiciel décrivent donc quelque chose que **personne ne vit**.

### Aggravant : le drapeau `--disable-gpu`

Mes deux premiers tirs utilisaient volontairement `--disable-gpu` pour stabiliser
l'environnement. C'était une erreur : ce drapeau **force** le rendu logiciel de
tout le canvas et du WebGL — pluie de code, Grille, scène 3D, post-traitement.
Le poste « Other » atteignait alors 8,7 s contre 1,4 s avec le GPU. Les
optimisations décidées sur ces chiffres l'ont été sur un artefact de mesure.

---

## 3. Conséquence : ce qu'il ne faut pas faire

- **Ne pas optimiser contre un tir unique.** Un score de 46 et un score de 58
  peuvent décrire exactement le même code.
- **Ne pas annoncer un score de performance** issu de cet environnement, ni dans
  un document, ni sur le site, ni à un client.
- **Ne pas supprimer la scène 3D** pour faire monter un chiffre obtenu en rendu
  logiciel : ce serait dégrader le produit sur la foi d'une mesure fausse.
- **Ne pas conclure d'un « avant/après »** entre deux tirs effectués à des
  moments différents sans vérifier la valeur de « Other ».

## 4. Comment mesurer correctement

1. **Sur un vrai navigateur, avec la carte graphique active**, pas en headless.
   Le plus simple : ouvrir le site dans Chrome, puis `F12` → onglet Lighthouse →
   « Analyser le chargement de la page » (mode Navigation, appareil « Ordinateur »).
2. **Vérifier systématiquement le poste « Other »** avant d'interpréter un score.
   S'il dépasse quelques centaines de millisecondes, le tir est à jeter.
3. **Faire trois tirs et retenir la médiane**, jamais le meilleur ni le pire.
4. **Mesurer aussi les Core Web Vitals sur le terrain** (utilisateurs réels),
   seuls chiffres qui comptent pour le référencement.

---

## 5. Ce qui reste vrai malgré tout

Indépendamment de la mesure, les optimisations engagées le 10/09/2026 restent
justes sur le fond — elles ne dépendent pas d'un score :

- **La 3D est hors du chemin critique** : le titre, le sous-titre, le CTA et la
  Grille TRON sont en HTML et CSS purs, et s'affichent avant que three.js ne soit
  téléchargé. *Mesuré : premier affichage passé de 2,5 s à 2,1 s.*
- **Plafond de résolution du rendu ramené de 2 à 1,5** : le coût du
  post-traitement est proportionnel au nombre de pixels, soit environ 44 % de
  pixels en moins à traiter.
- **La boucle de rendu s'arrête** quand le hero quitte l'écran, quand l'onglet
  passe en arrière-plan, et elle est plafonnée à 40 images par seconde. Avant,
  elle tournait en permanence, y compris hors écran.
- **Le coût réel identifié** : `UnitesHero` exécute environ 1,6 s de script
  (chargement des six modèles, construction de la scène, première image avec
  post-traitement). C'est le poste dominant, et il ne se réduira pas sans
  renoncer à une partie du rendu.

---

## 6. La question qui reste ouverte

La charte du studio exige « Lighthouse ≥ 95 ». En l'état :

- **Accessibilité, bonnes pratiques, référencement** : la cible est atteinte ou
  dépassée, et c'est **prouvé**.
- **Performance** : ~~**non démontrée**, et non démontrable depuis cette machine.~~
  **CORRIGÉ le 10/09/2026 : elle est mesurée.** Production, 3 tirs, médiane :
  **91 en mobile, 100 en desktop** (accueil). La cible « Lighthouse ≥ 95 » est donc
  **atteinte en desktop** et à 4 points en mobile.

**Conséquence : la dégradation n'est pas justifiée.** La voie 2 ci-dessous (retirer
le post-traitement et les modèles au premier chargement) n'a plus de motif : elle
dégraderait un produit dont la performance est mesurée bonne, sur la foi d'un
diagnostic faux. La question ouverte n'est plus « faut-il dégrader ? » mais
**« 91 en mobile est-il un plancher dû au poste, ou la valeur réelle ? »** — ce qui
se tranche par des tirs depuis une autre machine, pas par une décision de design.

Les deux voies qui avaient été proposées, conservées pour mémoire :

1. **Assumer la scène 3D** et faire mesurer la performance sur un vrai navigateur
   avec GPU pour connaître le chiffre réel avant de décider.
2. **Dégrader au premier chargement** : pas de post-traitement ni de modèles tant
   que le visiteur n'a pas interagi, avec chargement complet à la demande. Le
   budget est alors respecté par construction, au prix d'un hero moins riche à
   l'arrivée.
