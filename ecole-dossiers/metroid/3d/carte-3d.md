# Carte du dossier 3D — de l'image au modèle qui tourne

> **Ce que ce dossier contient.** Quatorze notes atomiques sur la 3D et la modélisation telles que le studio les pratique : la chaîne technique mesurée, ses contraintes de mémoire et de temps, ce qui sépare un rendu d'un asset de jeu, le cas de *Metroid* passé à la 3D, et la règle juridique qui encadre tout cela. Chaque note porte une seule idée et se lit seule.
>
> **Ce que ce dossier n'est pas.** Ni un tutoriel, ni une compilation. Aucune note n'est un résumé d'une autre. Là où un chiffre n'est pas vérifiable, la note l'écrit.

## Groupe 1 — La chaîne : de l'image au maillage utilisable

*Le studio a une chaîne image → maillage mesurée de bout en bout, et chaque maillon a une raison d'être technique, pas esthétique.*

| Note | L'idée en une ligne |
|---|---|
| [[la-chaine-image-vers-maillage]] | L'ordre exact des nœuds, et pourquoi `remesh` doit être passé sous forme de dictionnaire |
| [[un-maillage-genere-n-est-pas-utilisable]] | La sortie brute est une poussière de 3,4 millions de morceaux, pas un objet |
| [[le-remesh-et-la-densite]] | Le réglage qui décide de la densité, et le même nœud qui sert le web et le moteur |
| [[alleger-avant-de-texturer]] | Texturer d'abord, c'est payer la texture deux fois et risquer de la perdre |

## Groupe 2 — Les contraintes mesurées : mémoire et temps

*Sur cette machine, la vraie limite est la mémoire de la carte graphique : tout le reste — sérialisation, plafonds de résolution, arrêt au premier plantage — en découle.*

| Note | L'idée en une ligne |
|---|---|
| [[la-vram-est-la-vraie-limite]] | 10 240 Mio sur la carte, environ 8,4 Gio exploitables, et un modèle de langage qui laisse 1 668 Mo |
| [[le-budget-mesure-d-un-run-trellis]] | 107 secondes, 4 447 Mio au pic, 5,66 Go de marge : le coût chiffré d'une génération |

## Groupe 3 — Du modèle au jeu

*Un maillage qui s'affiche n'est pas un asset qui tourne : il lui faut des UV, une échelle, des matériaux, des collisions, un squelette — et un poids compatible avec une page.*

| Note | L'idée en une ligne |
|---|---|
| [[l-uv-et-la-texture]] | Sans UV le maillage reste gris, et le dépliage peut le découper en une île par triangle |
| [[l-echelle-et-les-unites]] | Un pipeline sans normalisation livre des objets justes et invisibles |
| [[le-squelette-et-l-animation]] | Le maillon que le studio n'a pas encore installé — et les candidats interdits ou hors budget |
| [[ce-qui-separe-un-rendu-d-un-asset-de-jeu]] | Polygones, LOD, UV, matériaux, collisions, échelle, performance : la liste des conditions |
| [[le-poids-d-un-modele-dans-une-page]] | Un fichier de 10,3 Mo coûte dix fois le budget d'une page, et une scène 3D coûte des requêtes |

## Groupe 4 — Metroid, étude de cas 3D

*Le passage de la 2D à la première personne a coûté à Retro Studios la quasi-totalité de son travail déjà fait, et a produit un compromis de visée inédit.*

| Note | L'idée en une ligne |
|---|---|
| [[le-passage-de-metroid-a-la-3d]] | L'intervention de Miyamoto, le *lock-on*, le HUD du casque, le Speed Booster écarté et l'absence d'épisode sur Nintendo 64 |

## Groupe 5 — La règle juridique appliquée à la 3D

*Un modèle 3D d'un personnage protégé reste une œuvre protégée, même généré par une IA — et la licence qui compte est celle des poids, pas celle affichée par le dépôt.*

| Note | L'idée en une ligne |
|---|---|
| [[un-modele-3d-n-est-pas-une-ressource-libre]] | Citer n'est pas utiliser : le genre et la technique sont libres, le nom et le design sont pris |
| [[le-registre-des-licences-refusees]] | Pixal3D, Meshy, Tripo, Modddif refusés ; TRELLIS.2, ComfyUI-SplatKit et Modly autorisés |

## Notes de référence du vault

- [[06-les-mecaniques-et-le-genre]] — le passage 2D/3D, la lecture de l'espace, le genre.
- [[03-les-createurs-et-studios]] — les studios, les bascules, les chaînes de décision.
- [[01-la-licence]] — la frontière juridique de la licence.
- [[08-etat-actuel-2026]] — l'état de la licence et de ses branches en 2026.
- [[09-annexes-reperes-et-lexique]] — les dates, les versions, les abandons.
