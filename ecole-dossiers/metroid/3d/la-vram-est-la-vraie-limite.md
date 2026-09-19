# La VRAM est la vraie limite

*Sur la machine du studio, le facteur limitant n'est ni le temps de calcul ni la puissance du processeur : c'est la mémoire de la carte graphique, et tout le reste en découle.*

La configuration mesurée est stable et datée : **NVIDIA RTX 3080, 10 240 Mio de VRAM (10 Go)**, pour **63,7 Go de mémoire vive** dont 51,6 Go libres en charge de travail. Le plafond réellement exploitable est plus bas que le chiffre de la carte : la référence du studio est de **8,7 Gio de VRAM utile**, et les autres documents parlent d'environ **8,4 Gio** exploitables pour l'inférence.

Ce qui rend cette limite structurante, ce sont les mesures de cohabitation. Quand un modèle de langage de travail est chargé, il ne reste presque rien :

| Situation | Mémoire libre |
|---|---|
| `qwen3.5:9b` chargé | 1 668 Mo libres |
| `qwen3-coder-16k` + ComfyUI | 437 Mo (le plancher atteint) |

Un modèle de travail et une génération 3D **ne cohabitent pas** sur cette machine. Il faut donc sérialiser : générer, libérer, puis écrire du code. Le dépassement n'est pas une lenteur, c'est une panne : le 10/09/2026, une génération en 1280×720 a provoqué un reset du pilote (`nvlddmkm`, événement 153), Windows a coupé le contexte CUDA et tous les processus de calcul sont morts.

## Ce qui est établi

- La configuration : RTX 3080, 10 240 Mio, 63,7 Go de RAM (perc) (capacités machine, 11/09/2026).
- Les deux mesures de cohabitation, 1 668 Mo et 437 Mo (méthode jeu vidéo, 10/09/2026).
- Le seuil de 8,7 Gio comme référence du studio, et celui de 8,4 Gio employé ailleurs (documents du studio).
- Le plantage par TDR (`nvlddmkm` événement 153) et sa conséquence sur le contexte CUDA (2 documents concordants).

## Ce qui n'est pas établi

- La valeur exacte de la VRAM utilisable aujourd'hui : un audit du 14/09/2026 juge les 8,7 Gio « optimistes d'environ 1 Gio », sans nouvelle mesure de référence.
- Le délai de garde TDR : le levier (passer de 2 s à 60 s) **n'a pas été appliqué** — il touche au registre de Windows, et c'est une décision humaine.

## Sources

- `notebooklm-pack-ecosysteme-2026-09-11/04-MACHINE-CAPACITES.md` — matériel, limite dure, règle d'un seul travail.
- `modeles/methode-creation-jeu-video.md` — cohabitation mesurée, sérialisation.
- `modeles/pipeline-3d-trellis2-2026-09-11.md` — TDR, journaux Windows, levier non appliqué.

## Renvois

- [[le-budget-mesure-d-un-run-trellis]] — combien une génération 3D consomme réellement de cette mémoire.
- [[l-echelle-et-les-unites]] — une autre contrainte de production, mesurée elle aussi.
- [[08-etat-actuel-2026]] — l'état d'une licence se lit aussi à ses moyens de production.
