# Le budget mesuré d'un run TRELLIS

*Un run de génération 3D a un coût chiffré sur cette machine : environ deux minutes de calcul et moins de la moitié de la mémoire de la carte.*

Le premier essai complet de la chaîne image → maillage, piloté par l'API, a été mesuré étape par étape. Résultat de référence : **29 536 triangles**, 29 176 sommets, un matériau, une texture, pour un GLB de **1 260 Ko** dont 1 259 Ko de géométrie.

| Ressource | Mesure |
|---|---|
| Durée totale, du lancement à l'écriture du fichier | 107 s (107 146 ms) |
| Pic de VRAM | 4 447 Mio, sur une base de 1 616 Mio, soit +2,8 Go |
| Marge restante | 5,66 Go |

La méthode de mesure compte : le pic a été échantillonné toutes les 2 secondes par `nvidia-smi`, et non estimé. À titre de comparaison, la chaîne **complète** — image, maillage, nettoyage, texture PBR — est annoncée à environ **12 minutes** en résolution 512.

Deux ordres de grandeur complètent le tableau, et ils encadrent la machine : la vidéo locale Wan 2.2 tient **832×480** (80 s pour 49 images, environ 2 s de vidéo) et **fait tomber le serveur en 1280×720**. La règle qui en découle est celle du studio : un seul travail lourd à la fois, vidéo plafonnée à 832×480, 3D plafonnée à 512, arrêt au premier plantage.

## Ce qui est établi

- Toutes les valeurs du tableau (méthode jeu vidéo, mesuré le 10/09/2026 ; capacités machine, 11/09/2026).
- La chaîne complète à environ 12 min en 512 (document de veille et capacités machine).
- Wan 832×480 : 80 s pour 49 images ; 1280×720 : plantage du pilote (capacités machine, 10/09/2026).
- La règle de plafonds et d'arrêt au premier plantage (même document).

## Ce qui n'est pas établi

- Le plafond de résolution 512 comme optimum : le document de veille laisse une décision en attente — relancer en 1024 si le mesh « chasseur v2 » a les membres fusionnés. Aucune mesure en 1024 n'a été lue.
- Le coût réel d'un run à 30 000 faces texturé, en pic de VRAM : seule la durée (24,7 s) est connue pour cet enchaînement.
- L'attribution exacte des 12 minutes entre les maillons : le détail n'a pas été relevé.

## Sources

- `modeles/methode-creation-jeu-video.md` — mesures de bout en bout du 10 et du 11/09/2026.
- `notebooklm-pack-ecosysteme-2026-09-11/04-MACHINE-CAPACITES.md` — tableau des capacités, plafonds.
- `forge-ia/pipeline-ia-3d-indie-game.md` — environ 12 min en 512, décision en attente sur la résolution 1024.

## Renvois

- [[la-vram-est-la-vraie-limite]] — pourquoi ce budget se partage avec le reste.
- [[la-chaine-image-vers-maillage]] — la chaîne à laquelle ce budget correspond.
- [[03-les-createurs-et-studios]] — ce qu'une machine permet et ce qu'une chaîne de décisions produit : deux récits de production différents.
