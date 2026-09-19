---
tags: [metroid, flux, methode, verification]
date: 2026-09-14
statut: atome
verifie: 2026-09-14
---
# Ce qui est vérifié ne se recopie pas

*La vérification du kit n'est pas dans le corpus — elle vit dans l'outillage du studio, et une note qui ne dit pas qui l'a vérifiée reste en dette.*

## L'idée

Un vault ne se vérifie pas tout seul : le contrôle réel se fait **à l'extérieur**. L'outil `forge-ia/verifier-kits.mjs` mesure, ne juge pas, et rend un code de sortie ; il déduit le **type** de la note **de son nom de fichier** — `navigation` pour `00-…`/`README`/`INDEX`, `contenu` pour `^\d\d-` ou `^dossier-`, `outil` pour `glossaire`/`exercices-et-controles`, `copie` pour `fiches/`, `travail` pour tout le reste ([[11-sources-et-verification]] § 1 bis).

Et c'est là le point dur, écrit comme un **contrat** : *une note qui n'est ni `NN-`, ni `dossier-`, ni `glossaire`, ni `exercices-et-controles` n'est plus jamais mesurée* — et **c'est une sortie silencieuse : le verdict reste vert** (même source). Un atome comme celui-ci est donc de type `travail` : aucun critère ne s'applique à lui, et sa section `## Sources` est une **dette déclarée**. L'outil mesure **6 critères sur 8** — poids (< 1 Mo) et accessibilité sont renvoyés à une « passe finale » — et il **ne lit que le champ `verifie:`** : les autres statuts servent Obsidian et le studio, le publieur retirant le frontmatter avant lecture.

## Ce qui est établi

- `forge-ia/verifier-kits.mjs` applique ses critères selon un type **déduit du nom du fichier** : une note renommée hors des préfixes connus **sort du contrôle**, silencieusement, sans que le verdict change ([[11-sources-et-verification]] § 1 bis).
- **6 critères sur 8** sont mesurés par machine : poids (< 1 Mo) et accessibilité sont annoncés « passe finale » (même source).
- L'outil ne lit que `verifie:` ; le publieur retire le frontmatter, donc le lecteur ne voit ni `statut:`, ni `tags:` (même source).
- Divergence mesurée et **non corrigée** : le cycle annonce **30 jours** de fenêtre pour les notes d'actualité, l'outil applique **90 jours** (`FENETRES`) (même source).

## Ce qui n'est pas établi

- Je **n'ai pas exécuté** `verifier-kits.mjs` : je ne sais pas ce qu'il répondrait sur ce dossier-ci.
- Aucun **contrôle qualité pédagogique** n'existe : l'outil ne peut pas savoir si une question est trop dure, et **aucune séance n'a été testée devant un élève** (même source).
- Aucune **durée de vérification** n'est mesurée : ni par note, ni par passe.

## Sources

- `11-sources-et-verification.md` § 1, § 1 bis et § 5 — [[11-sources-et-verification]] (note de méthode, 14/09/2026).
- `forge-ia/verifier-kits.mjs` — outil du studio, cité par la note 11, **non exécuté ici**.

## Renvois

- [[de-la-transcription-a-la-fiche]] — le maillon que ce contrôle devrait couvrir.
- [[l-index-ne-rattrape-pas-son-retard]] — un autre contrôle qui existe sans être appliqué.
- [[11-sources-et-verification]] — la note de référence de toute cette veine.
