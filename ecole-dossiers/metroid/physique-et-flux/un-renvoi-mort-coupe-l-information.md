---
tags: [metroid, flux, methode, renvois]
date: 2026-09-14
statut: atome
verifie: 2026-09-14
---
# Un renvoi mort coupe l'information

*Un lien qui pointe dans le vide ne casse pas un affichage : il coupe une information, et il la sert périmée en silence.*

## L'idée

Un vault est un **graphe**, et un renvoi est une **arête**. Quand l'arête casse, il ne reste pas un trou visible : il reste un lecteur qui croit avoir trouvé. La règle est écrite dans le dépôt du studio, au moment où elle a servi : *« un document qui renvoie vers un fichier disparu **sert une réponse périmée en silence** — c'est la règle écrite du dépôt »* (`veille-video/README.md`, contrôle du 11/09/2026 après la restructuration).

Le contrôle existe, et il est chiffré : **1 180 renvois testés, 80 morts** — **aucun venant de ces déplacements** (même source, `node forge-ia/verifier-renvois.mjs`). Cette précision compte : quand on déplace des fichiers, on veut savoir **si c'est le déplacement qui a cassé les liens**, et la réponse ici est non.

Le motif le plus instructif est ailleurs, dans le vault : une **source morte invalide l'affirmation qu'elle portait** — non parce qu'elle est fausse, mais parce qu'elle **n'est plus vérifiable** ([[11-sources-et-verification]] § 1). C'est exactement le cas **P1** : la mort de Ridley, tranchée contre Wikipédia FR **parce que sa source unique — un site personnel `free.fr` — répond 404** (même source, § 6).

## Ce qui est établi

- Le dépôt dispose d'un vérificateur de renvois, `node forge-ia/verifier-renvois.mjs`, et d'une règle écrite : un renvoi vers un fichier disparu **sert une réponse périmée en silence** (`veille-video/README.md`).
- Contrôle du 11/09/2026 après restructuration : **1 180 renvois testés, 80 morts, aucun venant de ces déplacements**.
- Règle du vault : **« une source morte invalide l'affirmation qu'elle portait »** — pas parce qu'elle est fausse, parce qu'elle n'est plus vérifiable ([[11-sources-et-verification]] § 1).
- Cas **P1** : la mort de Ridley est tranchée contre Wikipédia FR, dont la source unique (un site personnel `free.fr`) est **morte (404)** (même note, § 6).
- Le déplacement d'un fichier laisse **deux traces** : une ligne morte dans la mémoire du veilleur, et parfois des vecteurs que rien ne rattache (document d'extension RAG § 6).

## Ce qui n'est pas établi

- **Aucune répartition** des 80 renvois morts : ni par dossier, ni par cause. Le contrôle donne le compte, pas la liste.
- Je **ne sais pas** si les 80 morts ont été réparés depuis le 11/09/2026 : rien ne le dit dans les documents lus.
- Aucune **cadence de contrôle** n'est écrite : le README pose le geste en fin de lot, sans périodicité chiffrée.
- Je **n'ai pas** exécuté `verifier-renvois.mjs` : les renvois de mes propres atomes n'ont **pas** été validés par l'outil.

## Sources

- `veille-video/README.md` — règle de fin de lot, contrôle du 11/09/2026 (1 180 renvois, 80 morts).
- `11-sources-et-verification.md` § 1 et § 6 — [[11-sources-et-verification]] (règle de la source morte, cas P1).
- `vault-agence/extension-rag-et-indexation-2026-09-14.md` § 6 — les deux traces d'un déplacement.

## Renvois

- [[l-index-ne-rattrape-pas-son-retard]] — l'autre endroit où une trace survit au fichier.
- [[ce-qu-un-extrait-retrouve-ne-prouve-pas]] — la provenance qui manque, dans le carnet plutôt que dans le graphe.
- [[11-sources-et-verification]] — la note de méthode qui porte la règle.
