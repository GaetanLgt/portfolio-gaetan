---
tags: [metroid, science, 3d, game-design]
date: 2026-09-14
statut: atome
verifie: 2026-09-14
---
# La lecture de l'espace en 2D et en 3D

*La carte reste la même ; c'est la façon de la lire qui change quand la caméra entre dans le casque.*

## L'idée

Les épisodes 2D et les épisodes 3D à la première personne partagent la même structure d'exploration — une carte, des verrous, des objets — mais pas le même problème de lecture. En 2D, la caméra de profil donne **tout l'espace d'un coup d'œil** : le joueur voit sa salle, ses sorties et son obstacle dans une seule image. En 3D subjective, cette vue n'existe plus : le Morph Ball repasse même en troisième personne pour rester jouable.

Le remplacement est un dispositif d'interface : le **HUD** simule l'intérieur du casque de Samus — radar, carte, munitions, jauge de danger, analyseur d'ennemis et de mécanismes. La visée, elle, est réglée par le **verrouillage automatique de la cible** (*lock-on*), qui permet de tourner autour d'elle en restant aligné, là où la 2D utilise le tir dans huit directions à partir de *Super Metroid*.

Deux conséquences de conception sont documentées. La première est un basculement imposé : Retro Studios travaillait à l'origine sur une vue à la troisième personne, et l'intervention de **Shigeru Miyamoto** a fait jeter la quasi-totalité du travail déjà fait, au motif que le tir en troisième personne était peu intuitif et que l'exploration est plus facile en vue subjective. La seconde est un **abandon** : le Speed Booster, existant en 2D, a été écarté de la 3D, jugé inadapté à la vue subjective et à l'échelle des environnements.

## Ce qui est établi

- Vue : caméra de profil en 2D ; caméra dans le casque en 3D, le Morph Ball repassant en troisième personne (Wikipédia EN, « Metroid Prime »).
- HUD simulant l'intérieur du casque : radar, carte, munitions, jauge de danger, analyseur d'ennemis et de mécanismes ; système d'indices intégré donnant des pistes de progression (même source).
- Verrouillage automatique de la cible en 3D ; tir dans huit directions en 2D à partir de *Super Metroid* (même source).
- Miyamoto a imposé la première personne : la quasi-totalité du travail en troisième personne a été jetée ; le Speed Booster, envisagé en 3D, a été écarté comme inadapté à la vue subjective et à l'échelle des environnements (même source).
- Les quatre faisceaux ne se cumulent pas en 3D : le joueur les fait défiler (même source).
- Nintendo refuse l'étiquette FPS et parle de « first-person adventure » : l'exploration prime sur le combat ; *Metroid: Other M* (2010), lui, est un jeu de tir à la troisième personne (même source).

## Ce qui n'est pas établi

- Le **détail de ce qui a été jeté** chez Retro Studios : la source parle de « la quasi-totalité du travail », sans inventaire.
- L'**état d'avancement** du projet au moment de l'intervention : non daté par les sources lues.
- Une **mesure** du gain de lisibilité apporté par le HUD : aucun test ni comparaison n'est rapporté.

## Sources

- `06-les-mecaniques-et-le-genre.md` § 7 — [[06-les-mecaniques-et-le-genre]] (note du vault, 14/09/2026).
- Wikipédia EN, « Metroid Prime » et « Metroid » — cités par la note du vault, non rouverts ici.

## Renvois

- [[ce-que-la-carte-montre-au-joueur]] — le dispositif d'orientation, en 2D puis dans le casque.
- [[le-mouvement-et-sa-physique]] — l'autre moitié du problème : se déplacer, et non seulement voir.
- [[02-la-chronologie-interne]] — la note de référence qui range ces deux familles d'épisodes.
