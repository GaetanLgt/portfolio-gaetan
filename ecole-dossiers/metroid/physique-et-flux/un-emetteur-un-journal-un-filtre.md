---
tags: [metroid, flux, evenements, rag]
date: 2026-09-14
statut: atome
verifie: 2026-09-14
---
# Un émetteur, un journal, un filtre

*L'indexeur publie un événement à chaque fichier modifié : ce qu'il écrit, où cela va, et qui peut refuser un document avant qu'il entre en mémoire.*

## L'idée

`indexer-agence.js` n'est pas un script qu'on lance : c'est un **système à événements**. En mode `--watch`, il relit la liste des fichiers toutes les **8 secondes**, calcule un hash par fichier et déclenche un traitement **dès que le hash change** — pour un ajout **comme** pour une modification (`indexer-agence.js`, lignes 271 à 284).

Ce qu'il publie : une ligne JSON dans `events.log` — « Document indexé au RAG agence : `<chemin>` » ou « Indexation RAG ÉCHOUÉE (`<chemin>`) — `<erreur>` » — écrite par `notifier`, avec un message **tronqué à 280 caractères** et `agent: 'watashi'` (lignes 186 à 192, 220, 228, 235, 245) ; et un `console.log` par fichier traité, pour l'humain devant le terminal.

Deux détails du code comptent plus que la liste. **La mémoire d'état est écrite AVANT l'indexation** (`etatConnu[k] = h`, ligne 278) : l'émetteur se souvient d'un événement qu'il n'a pas encore traité, donc un échec est consommé et ne sera pas republié tant que le fichier ne change pas ([[l-index-ne-rattrape-pas-son-retard]]). Et **un tiers peut refuser le document** : `uploader()` appelle un **filtre d'injection** et lit son code de sortie — `0` propre, `1` « à revoir, indexé quand même », `2` **indexation refusée** pour un signal de forme (lignes 120 à 140).

## Ce qui est établi

- Balayage toutes les **8 secondes** ; un hash différent déclenche l'indexation, ajout ou modification (lignes 273 à 284).
- `notifier()` écrit une ligne JSON dans `events.log` — `{ ts, type:'evenement', agent:'watashi', message }` — avec un message **limité à 280 caractères** (lignes 186 à 192).
- Le filtre d'injection est appelé par `execFileSync` et son code de sortie est interprété : `0` propre, `1` avertissement avec indexation, `2` refus avec erreur levée (lignes 130 à 140).
- `etatConnu[k] = h` est écrit **avant** `indexer(f)` (ligne 278) ; `dejaIndexe[k]` seulement après un embedding `completed` (ligne 242). La boucle **ne traite pas les suppressions** (ligne 283).

## Ce qui n'est pas établi

- Je **ne sais pas** avec quel délai les lignes de `events.log` sont relayées, ni qui les lit en continu : je n'ai lu que le code qui les écrit.
- **Aucune latence mesurée** : ni entre la modification d'un fichier et la ligne de journal, ni pour l'embedding lui-même.
- Le contenu de `events.log` n'est **pas analysé** : les **298 échecs** sont cités par un document du studio, je ne les ai pas recomptés. Je **n'ai rien exécuté** : ni l'indexeur, ni le filtre.

## Sources

- `indexer-agence.js` (285 lignes, lu en entier, **non exécuté**) — lignes 120 à 140 (filtre), 186 à 192 (`notifier`), 220 à 245 (événements), 271 à 284 (boucle de surveillance).
- `vault-agence/extension-rag-et-indexation-2026-09-14.md` § 5 — les **298 échecs**, le PID du veilleur et sa date de démarrage.

## Renvois

- [[l-index-ne-rattrape-pas-son-retard]] — le même code, vu par son retard.
- [[ce-qui-est-verifie-ne-se-recopie-pas]] — un autre contrôle qui vit hors du corpus.
- [[11-sources-et-verification]] — la note de méthode qui relie le kit au reste du studio.
