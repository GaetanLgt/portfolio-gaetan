# Le squelette et l'animation

*Un maillage n'est pas encore un personnage : il faut un squelette, un skinning et des animations — et c'est le maillon que le studio n'a pas encore installé.*

La chaîne du studio sait produire une forme, la nettoyer et la texturer. Elle ne sait pas encore faire bouger le résultat. Or un personnage jouable suppose trois choses distinctes, souvent confondues : un **squelette** (les os), un **skinning** (le rattachement des sommets aux os) et des **animations** (les mouvements).

L'état mesuré est un trou, pas une ambiguïté. **Les seuls nœuds de rig installés sont Meshy et Tripo**, deux services en ligne interdits par le registre des licences du studio. Le nœud GeomPack, lui, fait de l'**extraction de squelette**, pas du skinning : ce n'est donc pas un remplaçant. Les candidats identifiés n'étaient pas installés aux dates lues :

| Candidat | Licence | Contrainte |
|---|---|---|
| UniRig | MIT | au moins 8 Go de VRAM |
| AnimoFlow | AGPL-3.0 | backend Docker et WSL2 ; exige un personnage **déjà riggé** |
| Skin Tokens (ErrorX) | MIT **annoncée** | 6 Go de VRAM annoncés ; licence à lire dans le dépôt officiel |
| ARDY (NVIDIA) | code Apache-2.0, poids sous NVIDIA Open Model Agreement | encodeur d'environ 14 Go de VRAM en bf16 → hors budget de la carte |

## Ce qui est établi

- Les seuls nœuds de rig installés sont Meshy et Tripo, interdits, et GeomPack ne fait pas de skinning (plan de travail du studio, 10/09/2026).
- UniRig : MIT, au moins 8 Go de VRAM (même source et synthèse de veille, 13/09/2026).
- AnimoFlow : AGPL-3.0, Docker et WSL2, personnage déjà riggé exigé (registre des licences ; fiche de veille).
- ARDY : code Apache-2.0, poids sous NVIDIA Open Model Agreement, encodeur d'environ 14 Go de VRAM (registre des licences et veille).
- Aucun de ces outils n'était installé (documents du studio, 10 et 11/09/2026).

## Ce qui n'est pas établi

- La licence de Skin Tokens : **annoncée** MIT, non vérifiée à la source.
- La VRAM réelle d'ARDY : le « 6 Go » du titre n'est confirmé par **aucune** source officielle, et l'encodeur annoncé est bien plus lourd.
- Le comportement de ces outils sur un maillage généré par IA : aucun test n'a été fait.

## Sources

- `modeles/plan-de-travail-2026-09-10.md` — chaînon rig, nœuds installés, UniRig.
- `vault-agence/licences-refusees.md` — AnimoFlow, ARDY, services interdits.
- `forge-ia/pipeline-ia-3d-indie-game.md` — briques auto-rig et animation, non installées.
- `modeles/applicable-veille-nuit-2026-09-10.md` — vérification des annonces ARDY et LTX.

## Renvois

- [[ce-qui-separe-un-rendu-d-un-asset-de-jeu]] — où le squelette se place dans les conditions d'un asset de jeu.
- [[le-registre-des-licences-refusees]] — pourquoi Meshy et Tripo ne peuvent pas servir de solution.
- [[03-les-createurs-et-studios]] — un maillon manquant se confie à un partenaire externe, comme pour *Other M*.
