# Le remesh et la densité

*« Remesh » n'est pas un embellissement : c'est le réglage qui décide combien de faces porte l'objet, et le studio s'en sert pour viser deux cibles opposées avec le même nœud.*

L'allègement passe par le nœud `Trellis2ProcessMesh`. Son schéma a été relevé dans la source du nœud, jamais deviné :

| Paramètre | Valeur par défaut | Rôle |
|---|---|---|
| `remesh` | combo dynamique | `"off"` expose `fill_holes`, `fill_holes_perimeter` ; `"on"` expose `remesh_band`, `remove_inner_faces` |
| `target_face_count` | 500 000 (min 1 000, max 5 000 000) | la densité visée |
| `weld_vertices` | vrai | soude les sommets |
| `floater_threshold` | 0,001 | supprime les éclats détachés |
| `weld_digits` | 4 | précision de la soudure |
| `chart_cone_angle` / `chart_refine_iterations` / `chart_global_iterations` / `chart_smooth_strength` | 90,0 / 0 / 1 / 1 | réglages de découpage des UV |

Deux enseignements de mesure. D'abord, la cible de faces est le seul levier qui change entre les usages : viser 30 000 faces a donné 29 536 triangles pour un modèle destiné à un moteur ; viser 2 500 faces a donné les unités destinées au site. **Le même nœud couvre les deux besoins.** Ensuite, `weld_vertices` et `floater_threshold` sont précisément les deux leviers absents du chemin qui a détruit un maillage à l'étape UV — la piste documentée, non testée au moment de la mesure.

## Ce qui est établi

- Les paramètres et leurs bornes, relevés dans la source du nœud (document du studio, `pipeline-3d-trellis2-2026-09-11.md`).
- 30 000 faces visées → 29 536 triangles mesurés, GLB de 1 260 Ko (méthode jeu vidéo, 10/09/2026).
- 2 500 faces visées pour le web, 408 Ko au total pour six unités (méthode jeu vidéo, 10/09/2026).
- `weld_vertices` et `floater_threshold` existent dans `ProcessMesh` et manquaient au chemin de test (document du studio, 11/09/2026).

## Ce qui n'est pas établi

- L'effet réel de `weld_vertices` + `floater_threshold` sur la fragmentation : la piste est écrite, **non testée**. Un seul run reste à faire pour trancher.
- Les réglages de découpage des UV : `chart_refine_iterations=5` n'a **aucun effet mesuré** (29 176 → 29 237 grappes) ; les autres n'ont pas été testés un par un.

## Sources

- `modeles/pipeline-3d-trellis2-2026-09-11.md` — schéma du nœud, piste non testée, mesures de fragmentation.
- `modeles/methode-creation-jeu-video.md` — cibles de faces et poids obtenus.

## Renvois

- [[un-maillage-genere-n-est-pas-utilisable]] — la matière sur laquelle ce nœud opère.
- [[alleger-avant-de-texturer]] — la place de ce réglage dans l'ordre des opérations.
- [[06-les-mecaniques-et-le-genre]] — le niveau de détail comme contrainte de rendu, déjà présent dans le jeu 2D.
