# Ce qui sépare un rendu d'un asset de jeu

*Un modèle qui s'affiche et un modèle qui tourne dans un jeu ne répondent pas aux mêmes exigences : polygones, niveaux de détail, UV, matériaux, collisions, squelette et échelle.*

Un maillage peut être beau à l'écran et inutilisable en jeu. Le studio tient une liste de contrôle qui nomme les conditions, établie pour un import dans Unreal Engine 5 sur la carte de 10 Go.

| Exigence | Règle mesurée |
|---|---|
| Polygones | 2 500 faces pour le web, 30 000 pour un usage moteur, à partir d'une sortie brute de 115 866 faces |
| Niveaux de détail (LOD) | LOD automatiques sur les props de plus de 300 triangles — les props du studio sont sous 250, donc inutiles pour l'instant |
| UV | un second canal UV non superposé quand l'éclairage est précalculé |
| Matériaux | un seul matériau maître, des instances pour les variantes : un shader compilé, pas de recompilation |
| Collisions | pas de collision par polygone ; boîte ou capsule simplifiée, **au plus 3 primitives** par objet |
| Échelle et unités | 1 unité = 1 mètre, transformations appliquées, origine au sol |
| Performance | cible de 60 images par seconde en 1080p, `stat unit` sous 16,6 ms, moins de 1 000 appels de dessin |
| Budget mémoire | textures sous 2,5 Go, car la VRAM est partagée avec le modèle des personnages |

Le point commun de ces lignes est qu'aucune ne se voit sur une image de rendu. Elles décident pourtant si le modèle est un décor ou un objet de jeu.

## Ce qui est établi

- Toutes les lignes du tableau (liste de contrôle Blender → moteur du studio, 08/09/2026).
- La comparaison des densités 2 500 / 30 000 / 115 866 faces (méthode jeu vidéo, 10/09/2026).
- Le budget de textures et la VRAM partagée avec un modèle de langage de 5,5 Go (liste de contrôle, 08/09/2026).

## Ce qui n'est pas établi

- Les 60 images par seconde : c'était une **cible**, et la liste de contrôle écrit elle-même qu'aucune performance ne sera annoncée avant un build réel. L'import n'était pas fait au 08/09/2026.
- Le nombre de niveaux de détail réellement nécessaires : la règle de seuil (300 triangles) n'a pas été éprouvée sur les props du studio.
- La liste n'est pas exhaustive : elle couvre un projet de démonstration, pas tous les cas.

## Sources

- `jeux/zombunny-lab-3d/ue5-import-checklist.md` — conditions, budget, cibles de performance.
- `modeles/methode-creation-jeu-video.md` — densités de faces et poids obtenus.

## Renvois

- [[le-squelette-et-l-animation]] — le maillon absent de cette liste.
- [[l-echelle-et-les-unites]] — la condition la plus facile à rater.
- [[06-les-mecaniques-et-le-genre]] — un jeu se définit par ses systèmes, pas seulement par son rendu.
