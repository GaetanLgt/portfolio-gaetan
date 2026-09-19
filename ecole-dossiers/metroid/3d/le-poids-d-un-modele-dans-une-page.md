# Le poids d'un modèle dans une page

*Sur le web, un modèle 3D n'est pas jugé sur sa beauté mais sur son poids : un fichier de 10 Mo coûte dix fois le budget d'une page du studio.*

Le studio a une règle de poids pour ses pages, et un modèle 3D entre en tension directe avec elle. Le cas mesuré est le vaisseau du studio : le fichier source pèse **10,3 Mo**, alors que le verrou d'une page est **inférieur à 1 Mo** — dix fois moins. Une version « web » du Galion pèse **416 Ko**, ce qui montre que l'écart se comble, mais par un travail d'allègement, pas par hasard. Les leviers nommés sont la compression Draco et les niveaux de détail.

Le second budget est celui des requêtes. Le premier chargement du site tient aujourd'hui en **12 requêtes**, pour une limite d'environ 20 par adresse IP chez l'hébergeur. Une scène 3D ajoute **au moins** un moteur ou un fichier vidéo : une scène temps réel coûte 1 à 2 requêtes, une vidéo pré-rendue 1 requête — mais elle ne réagit pas à la souris.

Ce que la chaîne de production sait livrer est déjà calibré pour cette contrainte : six unités 3D pour **408 Ko au total**, à 2 500 faces chacune, contre 938 Ko pour des avatars plus anciens fabriqués en primitives. La compression par quantification ramène chaque unité à 57-78 Ko. Une sortie brute de générateur, elle, pèse 5 à 7 Mo, et le poids est dans la **géométrie**, pas dans les textures (26 Ko d'images sur une unité mesurée).

## Ce qui est établi

- Les 10,3 Mo du fichier source et le verrou de page sous 1 Mo (cadrage espace 3D, 14/09/2026).
- La version web du vaisseau à 416 Ko (référence hero 3D, 11/09/2026).
- Les 12 requêtes du premier chargement et le coût de 1 à 2 requêtes d'une scène 3D (même source).
- Les six unités à 408 Ko, les 57-78 Ko par quantification, les 26 Ko de textures (méthode jeu vidéo, 10/09/2026).

## Ce qui n'est pas établi

- Le poids après compression Draco et niveaux de détail pour le vaisseau : le cadrage pose la question (« on mesure, on n'espère pas ») et ne donne pas la réponse.
- Le temps de chargement sur une connexion réelle : non mesuré, alors que c'est le chiffre qui compte pour un visiteur.

## Sources

- `modeles/CADRAGE-espace-3d-persistant-2026-09-14.md` — poids du fichier, verrou de page, leviers.
- `modeles/site-hero-3d-reference-2026-09-11.md` — version web à 416 Ko, budget de requêtes, trois voies.
- `modeles/methode-creation-jeu-video.md` — poids livrés par la chaîne.

## Renvois

- [[ce-qui-separe-un-rendu-d-un-asset-de-jeu]] — le poids web n'est qu'une des conditions.
- [[le-budget-mesure-d-un-run-trellis]] — le coût en calcul de ce qui finit sur une page.
- [[08-etat-actuel-2026]] — une licence se juge aussi à ce qu'elle coûte à montrer.
