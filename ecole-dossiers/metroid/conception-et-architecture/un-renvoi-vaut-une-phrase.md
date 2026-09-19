# Un renvoi vaut une phrase

*Un lien sans raison est un lien qu'on ne suit pas : le renvoi dit ce qu'il apporte.*

## L'idée

Un renvoi n'est pas un ornement de fin de note : c'est une affirmation. Il dit « ceci éclaire cela »
ou « ceci contredit cela ». La règle du vault est explicite : **un lien dit pourquoi il est là** —
une liste de noms sans raison est une liste qu'on ne suit pas.

Le même principe se retrouve de l'autre côté du studio, en version logicielle : les agents
d'exécution écrivent leurs artefacts **sur disque** et ne renvoient que des références légères. Le
contenu ne voyage pas par messages, parce que le message déforme — c'est le « jeu du téléphone ». Un
renvoi bien posé fait la même économie : il transporte une adresse, pas une copie.

Une note d'annexe du vault pousse la règle jusqu'au bout : *si une ligne n'a pas de renvoi, elle n'a
pas sa place ici.* C'est le test le plus dur et le plus utile pour une note atomique — chaque lien
doit pouvoir justifier sa présence, y compris le renvoi vers la note de référence qui a fourni
l'idée.

## Ce qui est établi

- « Un lien dit pourquoi il est là — une liste de noms sans raison est une liste qu'on ne suit pas » (`README.md` § 4).
- Les agents d'exécution écrivent leurs artefacts sur disque et ne renvoient que des références légères — « pas de jeu du téléphone par messages » (`ARCHITECTURE-FUGU-GL.md` § 3).
- Une note d'annexe s'interdit toute ligne sans renvoi : « Si une ligne n'a pas de renvoi, elle n'a pas sa place ici » (`09-annexes-reperes-et-lexique.md`, avertissement d'ouverture).
- Le vérificateur de kits contrôle les « renvois morts » parmi ses critères comptables (`README.md` § 2 bis).

## Ce qui n'est pas établi

- Ce dossier n'a **pas** été passé au vérificateur (`node forge-ia/verifier-kits.mjs`) : ses renvois n'ont pas été contrôlés par machine à cette heure.
- Le nombre de renvois utiles par note n'est établi par aucune mesure.
- Aucun outil ne mesure si un renvoi « dit pourquoi il est là » : ce critère reste humain.

## Sources

- `README.md` § 2 bis et § 4 — vault Metroid, 14/09/2026.
- `09-annexes-reperes-et-lexique.md` — même date.
- `ARCHITECTURE-FUGU-GL.md` § 3 — GL Digital Lab, 09-10/2026.

## Renvois

- [[une-carte-repond-a-trois-questions]]
- [[09-annexes-reperes-et-lexique]]
