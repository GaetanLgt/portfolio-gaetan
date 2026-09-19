# L'échelle et les unités

*Un objet juste et invisible est un objet raté : un pipeline qui ne normalise pas la taille livre des modèles deux fois trop petits, et un export sans unités livre des collisions fausses.*

Le générateur ne normalise **pas** la taille des objets. Mesuré : les unités sortaient entre **0,83 et 1,00** de haut au lieu de 1,66 attendu — elles paraissaient donc deux fois trop petites à l'écran. Une fois la normalisation d'échelle ajoutée dans le composant, la matière visible est passée de **5,1 % à 15,1 %** de la zone affichée. La leçon du document est formulée ainsi : « un pipeline sans étape de normalisation livre des objets justes et invisibles ».

Côté moteur, la question devient une convention à tenir de bout en bout. La liste de contrôle du studio impose :

| Point | Règle |
|---|---|
| Unités Blender | Metric, `scale_length = 1.0`, 1 unité = 1 mètre |
| Transformations | appliquées (Location, Rotation, Scale) — une échelle non appliquée fausse les collisions |
| Origine | au sol (Z = 0), pivot centré en XY |
| Export glTF | +Y up ; **ne pas** pré-tourner de -90° sur X |
| Import moteur | `Import Uniform Scale = 1.0` — corriger dans Blender, pas à l'import |
| Vérification | un repère de joueur à 1,80 m et un cube de 1 m |

## Ce qui est établi

- Les mesures 0,83–1,00 au lieu de 1,66 et le passage de 5,1 % à 15,1 % (méthode jeu vidéo, 10/09/2026).
- La règle « pas de normalisation = objets justes et invisibles » (même source).
- Toutes les lignes du tableau de conventions (liste de contrôle Blender → moteur du studio, 08/09/2026).
- L'absence d'étape d'échelle dans les travaux restants : « non fait : LOD, collision, échelle (extents ~0,29 × 0,60 × 0,83) » (document du studio, 11/09/2026).

## Ce qui n'est pas établi

- L'échelle cible d'un asset destiné à un moteur : aucune valeur n'est arrêtée dans les documents lus, seulement la convention 1 unité = 1 mètre.
- La vérification en moteur : au 08/09/2026, l'import n'avait pas été fait, et aucune performance n'était mesurée.

## Sources

- `modeles/methode-creation-jeu-video.md` — mesures d'échelle et correction.
- `jeux/zombunny-lab-3d/ue5-import-checklist.md` — conventions d'unités, d'export et d'import.
- `modeles/pipeline-3d-trellis2-2026-09-11.md` — échelle non traitée, extents relevés.

## Renvois

- [[ce-qui-separe-un-rendu-d-un-asset-de-jeu]] — l'échelle est l'une des conditions d'un asset de jeu.
- [[le-poids-d-un-modele-dans-une-page]] — une autre contrainte mesurée de mise en ligne.
- [[06-les-mecaniques-et-le-genre]] — la lecture de l'espace change quand la caméra change.
