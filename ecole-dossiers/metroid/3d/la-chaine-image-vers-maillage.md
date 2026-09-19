# La chaîne, de l'image au maillage

*Le studio dispose d'une chaîne image → maillage vérifiée de bout en bout, et elle s'exécute dans un ordre précis, pas dans un ordre approximatif.*

La chaîne part d'une image de référence et arrive à un fichier GLB texturé. Chaque maillon est un nœud ComfyUI nommé, et l'ordre ci-dessous est celui qui a fonctionné, vérifié sur la machine.

| Étape | Nœud |
|---|---|
| Image source | `LoadImage` |
| Détourage | `Trellis2RemoveBackground` |
| Modèles | `LoadTrellis2Models` (la résolution est une **chaîne** : `"512"`, `"1024"`, `"1024_cascade"`, `"1536"`) |
| Conditionnement | `Trellis2GetConditioning` |
| Forme | `Trellis2ImageToShape` |
| Allègement | `Trellis2ProcessMesh` (`remesh` est un combo dynamique) |
| Dépliage | `Trellis2UVUnwrap` |
| Texture | `Trellis2ShapeToTexturedMesh` puis `Trellis2RasterizePBR` |
| Export | `Trellis2ExportTrimesh` (`file_format: "glb"`) |

Deux points sont des conditions de réussite, pas des préférences. `remesh` doit être passé sous la forme `{"remesh":"on","remesh_band":1.0,…}`, sinon le nœud refuse l'exécution. Et la chaîne courte — forme, allègement, export, sans texturage — produit un modèle géométriquement bon mais gris : le fichier mesuré pesait 1 143 Ko et sa texture embarquée faisait 80 octets, un PNG de 2×2 pixels d'une seule couleur.

La durée de référence de la chaîne complète est d'environ 12 minutes en résolution 512. Un run mesuré du seul maillon image → maillage a pris 107 secondes.

## Ce qui est établi

- L'ordre des nœuds, vérifié de bout en bout (document de veille du studio, 09-10/09/2026 ; méthode jeu vidéo, 10/09/2026).
- Le résultat texturé mesuré : 5 265 Ko, 28 299 triangles, deux textures 1024×1024, 24,7 s de calcul (méthode jeu vidéo, 11/09/2026).
- Le résultat non texturé : 1 143 Ko, texture de 80 octets, `baseColorFactor` à 0,4 (méthode jeu vidéo, 11/09/2026).
- La durée annoncée de la chaîne complète : environ 12 min en 512 (document de veille du studio ; capacités machine, 11/09/2026).

## Ce qui n'est pas établi

- Deux incertitudes : le poids total des poids TRELLIS.2 (environ 10 Go selon un document, 14,6 Go selon un autre) et la fourchette des durées (107 s mesurés, puis 116 s annoncés pour la même étape).

## Sources

- `forge-ia/pipeline-ia-3d-indie-game.md` — chaîne exacte, `remesh` dict, environ 12 min en 512.
- `modeles/methode-creation-jeu-video.md` — chaîne complète vérifiée, mesures du 10 et du 11/09/2026.
- `modeles/pipeline-3d-trellis2-2026-09-11.md` — schéma du nœud, pièges d'exécution.

## Renvois

- [[un-maillage-genere-n-est-pas-utilisable]] — ce que le maillon de forme produit réellement.
- [[alleger-avant-de-texturer]] — pourquoi l'allègement se place avant le texturage dans cette chaîne.
- [[06-les-mecaniques-et-le-genre]] — le vocabulaire du jeu vidéo employé ici (2D, 3D, première personne).
