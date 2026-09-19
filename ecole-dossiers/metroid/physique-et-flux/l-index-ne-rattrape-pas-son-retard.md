---
tags: [metroid, flux, rag, indexation]
date: 2026-09-14
statut: atome
verifie: 2026-09-14
---
# L'index ne rattrape pas son retard

*Un document dont l'indexation échoue une fois attend sa prochaine modification pour réessayer : l'indexeur ne rattrape pas son retard, il ne fait que ne pas l'aggraver.*

## L'idée

L'indexeur du studio **tourne** : PID **21336**, `node indexer-agence.js --watch`, démarré le 14/09/2026 à **09 h 38 min 56 s**, balayage toutes les **8 secondes** (document d'extension RAG § 5). Il fonctionne vite — ce document-là est passé de « jamais vu » à « indexé » en deux minutes, sans intervention. Et pourtant **5 documents** du périmètre restent en retard : **4 versions périmées, 1 document absent** du carnet.

Le code explique le retard, et c'est mesurable dans `indexer-agence.js` : `etatConnu[k] = h` est écrit **avant** `indexer(f)` (ligne 278), donc **l'échec n'est pas retenté** ; `dejaIndexe[k]` n'est écrit qu'**après** un embedding `completed`, donc un échec ne laisse **aucune trace** en mémoire, seulement au journal ; et **298 échecs d'indexation** sont signalés dans `events.log`, où les cinq documents figurent nominativement (`fetch failed`, et `Duplicate content detected` pour deux d'entre eux).

La conclusion est une **règle de flux**, pas une panne : la veille est *événementielle* — un changement déclenche l'indexation — donc un échec non retenté **attend une nouvelle écriture humaine**. Un système qui n'indexe qu'au changement ne peut pas rattraper ce qu'il a manqué.

## Ce qui est établi

- Veilleur vivant pendant la mesure : PID **21336**, démarré le **14/09/2026 à 09 h 38 min 56 s**, balayage toutes les **8 secondes** (§ 5).
- **5 documents** en retard, avec leurs écarts carnet / disque : `ecole/cas-d-ecole-platisme-2026-09-14.md` (24 887 / 24 848), `modeles/analyse-poids-llm-2026-09-14.md` (28 665 / 28 731), `vault-agence/licences-cdpr-2026-09-14.md` (8 749 / 8 835), `vault-agence/pole-sous-comptage-cibles-2026-09-13.md` (9 484 / 9 655, **absent de la mémoire du veilleur**), `ecole/cadrage-sujet-rayons-gamma-2026-09-14.md` (**aucune ligne au carnet**).
- **298 échecs** dans `events.log`. Les écritures qui les rendent définitifs : `etatConnu[k] = h` avant `indexer(f)` (ligne 278), `dejaIndexe[k]` après embedding `completed` (ligne 242), et **jamais de suppression d'entrée** (ligne 283).
- Population des `.md`/`.txt` nés le 14/09 : **39** dans le périmètre — **35** indexés et à jour, **3** version périmée, **1** jamais vu ; **95** hors périmètre. Angle mort de git : **180** fichiers non suivis, dont **51** dans le périmètre.

## Ce qui n'est pas établi

- Je **ne sais pas** combien de ces 5 documents sont encore en retard : la mesure est datée du 14/09/2026 et le veilleur tourne.
- Aucune **durée de retard** n'est mesurée : ni le temps entre l'échec et la reprise, ni une distribution des 298 échecs.
- Aucune **purge** n'a été faite et aucune n'est proposée : **effacer des vecteurs est une décision**, pas un nettoyage (§ 6). Je **n'ai pas** relu `events.log` moi-même.

## Sources

- `vault-agence/extension-rag-et-indexation-2026-09-14.md` § 1, § 5 et § 6 — document du studio, mesuré le 14/09/2026 entre 13 h 40 et 14 h 05.
- `indexer-agence.js` (285 lignes, lu, non exécuté) — lignes 242, 278 et 283 pour la mémoire du veilleur.

## Renvois

- [[ce-qui-est-verifie-ne-se-recopie-pas]] — l'autre contrôle qui existe sans être appliqué.
- [[un-emetteur-un-journal-un-filtre]] — le même code, vu par ce qu'il publie.
- [[11-sources-et-verification]] — la note de méthode : une mesure porte sa date.
