# Alléger avant de texturer

*Dans la chaîne, l'allègement se fait avant le texturage — texturer d'abord, c'est payer la texture deux fois et risquer de la perdre au remaillage.*

La règle est écrite noir sur blanc dans le document de méthode du studio : **alléger avant de texturer**. Texturer 115 866 faces pour les ramener ensuite à 30 000 revient à calculer une texture sur une géométrie qui va disparaître en partie. La formulation du document est plus directe encore : « c'est payer la texture deux fois — et risquer de la perdre au remaillage ».

Cette règle n'est pas théorique : le studio a mesuré ce qui arrive quand le dépliage des UV et la rasterisation PBR arrivent sur un maillage non préparé. Sur le **même** asset, avec une chaîne `Simplify` + `UVUnwrap` :

| Mesure | Avant l'étape UV | Après UV + PBR |
|---|---|---|
| Faces | 29 678 | 29 264 |
| Arêtes uniques | 3 484 | 87 729 |
| Arêtes de bord (trous) | 2 | 87 666 |
| Arêtes non-manifold | 3 389 | 0 |

La géométrie sortait quasi fermée (2 arêtes de bord) et ressort pulvérisée (87 666). Le journal du worker le confirme à sa manière : « Get 29 176 clusters after fast clustering » pour 29 264 faces, soit **une île UV par triangle**.

## Ce qui est établi

- La règle d'ordre « alléger avant de texturer », formulée dans `modeles/methode-creation-jeu-video.md` (11/09/2026).
- Les quatre mesures avant/après UV + PBR, sur le même asset (document du studio, 11/09/2026).
- Le message du journal : 29 176 grappes pour 29 264 faces (même source).
- La chaîne texturée aboutie, une fois l'ordre respecté : 5 265 Ko, 28 299 triangles, deux textures, `baseColorFactor` à 1,0, 24,7 s (méthode jeu vidéo, 11/09/2026).

## Ce qui n'est pas établi

- La cause exacte de la destruction : le document désigne `weld_vertices` et `floater_threshold` comme piste, sans run de confirmation.
- Le comportement à d'autres densités : la mesure porte sur un asset d'environ 29 000 faces.

## Sources

- `modeles/methode-creation-jeu-video.md` — règle d'ordre et résultat texturé.
- `modeles/pipeline-3d-trellis2-2026-09-11.md` — mesures avant/après UV, journal du worker.

## Renvois

- [[le-remesh-et-la-densite]] — le nœud et ses paramètres.
- [[l-uv-et-la-texture]] — ce que le dépliage d'UV exige et détruit.
- [[03-les-createurs-et-studios]] — une chaîne de production se lit par ses bascules, pas par ses intentions.
