---
tags: [metroid, flux, rag, chunking]
date: 2026-09-14
statut: atome
verifie: 2026-09-14
---
# Ce qu'un découpage ne recolle pas

*Un chunk est lu hors de son document : le découpage perd le contexte, et le ratio change avec le corpus.*

## L'idée

Un carnet ne stocke pas des documents : il stocke des **morceaux**. Le carnet agence `Vault-GL-Digital-Lab` (id `4e67c75c-aa9c-453a-80d7-96348357350f`) porte **11 488 chunks** et **7 628 610 caractères** vectorisés, soit **664,1 caractères par chunk** ; le carnet `Metroid` est à **819 caractères par chunk** (extension RAG § 1 et § 7). Le ratio **n'est donc pas une constante du studio** : un chunk « de référence » n'existe pas, le découpage change avec le corpus.

Et **le morceau voyage seul** : l'extrait retrouvé arrive sans que le titre, la section et le document d'origine l'accompagnent toujours. L'estimateur qui prévoit une extension **utilise ce ratio** : pour un dossier non indexé, l'on divise les caractères par 664,1. Validé là où le réel existe, il donne **7 565 chunks estimés contre 7 858 réels, soit −3,7 %**, avec un pire cas à **−12,6 %** sur `livrables`. *L'estimation vaut pour décider, pas pour un budget au chunk près.*

## Ce qui est établi

- Carnet agence : **11 488 chunks**, **7 628 610 caractères**, ratio **664,1 caractères/chunk** ; carnet Metroid : **1 356 chunks**, **819 caractères/chunk** (§ 1 et § 7).
- Les quatre dossiers indexés : `vault-agence/` **3 587** chunks réels, `modeles/` **2 461**, `livrables/` **1 125**, `ecole/` **685** — total **527 fichiers, 4 994 563 caractères, 7 858 chunks** (mesure du 13 h 45).
- L'estimateur est validé : **7 565 estimés / 7 858 réels**, écart **−3,7 %**, pire cas `livrables` **−12,6 %** (§ 1).
- Le dépôt entier porterait **39 313 chunks** : **la mémoire du studio est à 29 % de son propre dépôt** (§ 1). Chunks comptés par requête SQL, « jamais devinés ».

## Ce qui n'est pas établi

- **Aucune taille de chunk en caractères** n'est donnée : ni minimum, ni maximum, ni chevauchement. Le ratio est un **résultat**, pas une recette.
- Aucun **test A/B** de récupération dossier par dossier : le risque de « noyade » est **chiffré, pas démontré par l'usage** (§ 7). Le ratio du carnet Metroid (819) n'est pas expliqué.

## Sources

- `vault-agence/extension-rag-et-indexation-2026-09-14.md` § 1, § 2, § 6 et § 7 — document du studio.
- `indexer-agence.js` — `DOSSIERS_SOURCES` (ligne 47) et `EXT_OK` (ligne 38).

## Renvois

- [[ce-qu-un-extrait-retrouve-ne-prouve-pas]] — ce qu'un morceau retrouvé permet de dire, et pas plus.
- [[un-emetteur-un-journal-un-filtre]] — le composant qui verse ces morceaux dans le carnet.
- [[11-sources-et-verification]] — la note de méthode et son tableau des sources.
