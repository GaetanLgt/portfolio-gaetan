# Un maillage généré n'est pas utilisable tel quel

*La sortie brute du générateur de forme n'est pas un objet : c'est une poussière de millions de morceaux, et aucune chaîne ne peut exporter cela directement.*

Le maillon de forme (`Trellis2ImageToShape`) ne produit pas un solide, mais un nuage de fragments non soudés et sans coordonnées de texture. Les mesures sur une sortie brute sont sans ambiguïté :

| Mesure | Valeur brute |
|---|---|
| Faces | 9 154 412 |
| Composantes connexes | 3 393 885 (les 5 plus grosses font environ 33 000 faces) |
| Arêtes non-manifold | 3 850 038 sur 10 227 632 |
| UV | absentes |
| Poids du GLB | 154,9 Mo |

Autrement dit : un objet qui pèse 155 Mo et se compose de 3,4 millions de morceaux détachés. Ce n'est ni un fichier livrable, ni un fichier affichable. La conclusion écrite dans le document de mesure est directe : **chaîne de nettoyage obligatoire, jamais un export direct.**

C'est la raison d'être des maillons suivants. L'allègement et la soudure ne sont pas des finitions : ce sont les opérations qui transforment une sortie de générateur en objet.

## Ce qui est établi

- Les cinq mesures du tableau, relevées sur une sortie brute de `ImageToShape` (document du studio, `pipeline-3d-trellis2-2026-09-11.md`).
- L'absence d'UV à la sortie de forme : le nœud de texturage la refuse explicitement (même source).
- La conclusion « chaîne de nettoyage obligatoire, jamais un export direct » (même source).

## Ce qui n'est pas établi

- La généralité de ces valeurs : elles sont mesurées sur un asset, une résolution et un jeu de réglages. Aucun document lu ne dit si un autre réglage produit la même fragmentation.
- Le nombre de morceaux après nettoyage complet : l'objectif annoncé (passer de 87 666 arêtes de bord à quelques centaines) n'a pas été atteint au moment des mesures.

## Sources

- `modeles/pipeline-3d-trellis2-2026-09-11.md` — section « Ce que produit la sortie brute de `ImageToShape` (mesuré) ».
- `forge-ia/pipeline-ia-3d-indie-game.md` — état de la brique image → mesh au 10/09/2026.

## Renvois

- [[le-remesh-et-la-densite]] — l'opération qui soude et allège cette poussière.
- [[la-chaine-image-vers-maillage]] — où ce maillon se place dans la chaîne.
- [[03-les-createurs-et-studios]] — la notion de chaîne de production, appliquée à une licence et à ses studios.
