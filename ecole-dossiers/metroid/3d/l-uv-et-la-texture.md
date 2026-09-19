# L'UV et la texture

*Sans coordonnées de texture, un maillage reste gris : l'UV est obligatoire pour texturer, et son dépliage est l'étape qui peut détruire la géométrie.*

Le dépliage des UV répond à une contrainte technique simple : il faut projeter la surface de l'objet sur une image plate. Tant que le maillage n'a pas d'UV, le nœud de texture refuse de s'exécuter, avec le message exact : `Input mesh has no UVs! Use UV Unwrap node first.` Le studio a mesuré ce que ce message cache.

Sur le **même** asset, entre l'étape UV et la rasterisation PBR :

| Mesure | Avant l'étape UV | Après UV + PBR |
|---|---|---|
| Arêtes de bord (trous) | 2 | 87 666 |
| Arêtes uniques | 3 484 | 87 729 |
| Arêtes non-manifold | 3 389 | 0 |

La lecture est cohérente avec le journal du worker : « Get 29 176 clusters after fast clustering » pour 29 264 faces — une île UV par triangle. La géométrie n'est pas perdue, elle est découpée.

Une fois l'ordre respecté et la chaîne menée au bout, le résultat est net : le modèle pèse 5 265 Ko, compte 28 299 triangles et **deux textures** — une couleur 1024×1024 RGBA à 183 612 couleurs distinctes (2,3 Mo) et une metallicRoughness 1024×1024 (1,2 Mo). Le `baseColorFactor` repasse à 1,0 : la couleur vient bien de la texture, et non d'un gris de remplissage.

## Ce qui est établi

- Le message d'erreur qui rend l'UV obligatoire, et le fait que la texture soit absente sans elle (documents du studio, 11/09/2026).
- Les trois mesures avant/après UV + PBR, sur le même asset (même source).
- Le résultat texturé complet : 5 265 Ko, 28 299 triangles, deux textures, 183 612 couleurs distinctes, 24,7 s (méthode jeu vidéo, 11/09/2026).
- Le cas du modèle gris : texture de 80 octets, PNG 2×2 pixels (méthode jeu vidéo, 11/09/2026).

## Ce qui n'est pas établi

- Le paramètre qui provoque la fragmentation : `chart_refine_iterations=5` a été testé **sans effet mesuré** (29 176 → 29 237 grappes). Le coupable n'est pas identifié.
- La qualité perçue de la texture : elle est décrite par un rendu, pas par une mesure automatique — la validation visuelle reste humaine.

## Sources

- `modeles/pipeline-3d-trellis2-2026-09-11.md` — mesures de fragmentation, paramètre testé sans effet.
- `modeles/methode-creation-jeu-video.md` — résultat texturé, cas du modèle gris.

## Renvois

- [[alleger-avant-de-texturer]] — l'ordre qui limite les dégâts.
- [[le-remesh-et-la-densite]] — les deux leviers absents du chemin qui a fragmenté le maillage.
- [[09-annexes-reperes-et-lexique]] — le vault sait aussi tenir un lexique quand un terme prête à confusion.
