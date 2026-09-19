---
tags: [metroid, flux, rag, methode]
date: 2026-09-14
statut: atome
verifie: 2026-09-14
---
# Ce qu'un extrait retrouvé ne prouve pas

*Un extrait retrouvé prouve que le texte existe dans le carnet — pas que l'affirmation est vraie, ni que le corpus est complet.*

## L'idée

Une recherche documentaire renvoie des **extraits**, et un extrait arrive avec une **autorité** qu'il n'a pas. Le précédent est écrit : sur le carnet **Metroid**, une question large a fait remonter des passages de **transcriptions vidéo** avant la note du vault, avec un score de **0,80** (`rag-metroid-eva01-2026-09-14.md` § 8). Le morceau le mieux noté n'était pas le plus fiable : il était le mieux placé.

Trois choses qu'un extrait ne prouve donc pas : **sa vérité** — une transcription automatique d'une vidéo sponsorisée entre dans un carnet exactement comme une note vérifiée ; **sa provenance, si le lien est rompu** — **13 `file_id`** portent des vecteurs **sans ligne** dans la liste du carnet, soit **1 081 chunks**, et **73 `file_id`** sont **inconnus de la mémoire du veilleur**, soit **3 634 chunks** (§ 6) ; et **l'exhaustivité** — un carnet qui vaut **29 %** de son dépôt répond sur ce qu'il contient, et son silence ne se lit pas comme une absence de savoir.

## Ce qui est établi

- **13 `file_id`** avec vecteurs et sans ligne : **1 081 chunks**, dont un à **923 chunks** ; **7** lignes sans aucun vecteur, dont **3 × `registre-echecs-agents.md`** ; **73 `file_id`** inconnus du veilleur : **3 634 chunks** (§ 6).
- La mémoire du veilleur `.index-agence.json` porte **578 entrées**, dont **51** dont le fichier n'existe plus sur le disque ; **1** seulement a conservé ses vecteurs (**9 chunks**) (§ 6).
- La mémoire du studio est à **29 %** de son dépôt : **11 488 chunks** contre **39 313** (§ 1). Les orphelins augmentent seuls : **73 900 chunks** dans **2 774 collections** détachées, **+3 003 en une journée** (§ 6).

## Ce qui n'est pas établi

- **Aucune mesure de la qualité** de ce qui remonte : seul le **Recall@5** existe, sur 12 questions — **83,3 %** (09-10/09) et **75,0 %** le 14/09 (§ 3) — et les deux chiffres ne sont pas du même auteur.
- Je **ne sais pas** ce que contiennent les 1 081 chunks sans ligne : ils sont comptés, jamais ouverts.
- Le coût des orphelins (disque, RAM, durée de sauvegarde, électricité) n'est **pas mesuré** : seul le volume l'est.

## Sources

- `vault-agence/extension-rag-et-indexation-2026-09-14.md` § 1, § 3, § 6 et § 7 — document du studio, mesuré le 14/09/2026.
- `11-sources-et-verification.md` § 5 et § 6 — [[11-sources-et-verification]] (comptage des sources, annexe R&D).

## Renvois

- [[ce-qu-un-decoupage-ne-recolle-pas]] — pourquoi un morceau arrive sans son document.
- [[un-renvoi-mort-coupe-l-information]] — l'autre façon de servir une réponse sans sa provenance.
- [[11-sources-et-verification]] — la note qui impose de compter les sources non lues.
