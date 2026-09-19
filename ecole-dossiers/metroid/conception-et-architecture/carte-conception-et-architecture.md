# Conception et architecture — carte du dossier

*Quatorze atomes, quatre familles : ce qui se conçoit comme un jeu, comme une information, comme un logiciel — et une hypothèse qui relie tout cela à une cathédrale.*

## Ce que ce dossier est

Un dossier d'**atomes** : chaque note porte **une seule idée**, se lit sans les autres et ne compile pas les
autres. La règle est écrite dans [[une-idee-par-note]] ; le format est celui du dossier `art/` du même vault.

Il croise deux matières. Celle du vault : les notes `01` à `11`, `dossier-metroid-360`, `objectifs`. Et celle du
studio : `AGENTS.md`, `ARCHITECTURE-FUGU-GL.md`, `modeles/methode-creation-jeu-video.md`, l'architecture du musée,
le cadrage « site comme un métroidvania », et la documentation du harnais à plugins.

## Les quatre familles

**1 · Concevoir un jeu ou un système.** La boucle, le prototype, la contrainte qui engendre la forme, et le niveau
comme parcours — quatre notes sur ce qui *produit* un jeu plutôt que sur ce qu'il contient.

**2 · Architecturer l'information.** Le vault est lui-même une architecture : atomes, renvois, cartes, couches de
fiabilité. Ces quatre notes décrivent les principes qu'il applique réellement, y compris ceux qu'il n'écrit nulle
part.

**3 · Architecturer un logiciel.** Séparer l'orchestration de l'exécution, borner le périmètre d'un exécutant,
retirer un plugin proprement, et savoir à quel plan appartient une ligne qui publie un service : quatre règles du
harnais et du studio.

**4 · Le pont vers la cathédrale.** Deux notes, et la seconde est une hypothèse assumée : le principe structurel
de la voûte sur croisée d'ogives et de l'arc-boutant, puis la question de savoir si un niveau de jeu et une
cathédrale se conçoivent de la même façon.

## Les atomes

| Atome | L'idée en une ligne | Référence |
|---|---|---|
| [[la-boucle-explorer-trouver-ouvrir]] | Un monde fermé, un objet qui l'ouvre, un retour — la progression se lit dans le monde. | `06` |
| [[la-tranche-verticale-avant-la-promesse]] | Un jeu ne se juge pas sur sa chaîne d'outils, mais sur un niveau jouable et mesuré. | `06` |
| [[la-contrainte-engendre-la-forme]] | Une machine limitée produit une échelle, un style, et parfois un genre. | `06` |
| [[un-niveau-se-concoit-comme-un-parcours]] | Ce qui compte, c'est la suite de ce qu'on rencontre : un seuil, une chose cachée, une chose montrée. | `06` |
| [[une-idee-par-note]] | Une note qui ne porte qu'une idée peut se lire, se citer et se corriger seule. | `00` |
| [[un-renvoi-vaut-une-phrase]] | Un lien sans raison est un lien qu'on ne suit pas. | `09` |
| [[une-carte-repond-a-trois-questions]] | De quoi ça parle, ce qui est établi et par quoi, ce qui reste à faire et à qui. | `11` |
| [[trois-couches-de-fiabilite]] | La couche dit ce qu'on a le droit de faire d'une affirmation. | `11` |
| [[separer-orchestration-et-execution]] | Router et exécuter sont deux savoirs distincts. | `11` |
| [[un-worker-ne-voit-que-son-perimetre]] | Instruction ciblée, visibilité limitée : le reste est du bruit. | `11` |
| [[un-plugin-se-retire-proprement]] | Un enregistrement est un effet qui se dénoue. | `11` |
| [[un-service-qui-publie-appartient-a-l-hote]] | Ce qui publie un service ne peut pas vivre dans une seule session. | `11` |
| [[les-forces-sont-conduites-quelque-part]] | On ne porte pas une charge, on l'achemine. | `11` |
| [[cathedrale-et-niveau-se-concoivent-pareil]] | Hypothèse : circulation, seuils et lumière dans les deux cas — et rien de plus. | `06` |

## Ce que cette carte ne dit pas

- **Aucun atome n'a été passé au vérificateur automatique** du studio (`node forge-ia/verifier-kits.mjs`) : les renvois et les comptages ont été contrôlés ici à la main, pas par machine.
- **L'hypothèse « cathédrale et niveau » n'est soutenue par aucune source lue.** Elle est produite par ce dossier ; [[cathedrale-et-niveau-se-concoivent-pareil]] dit ce qui la soutient et ce qui la contredit.
- **Les faits précis sur la cathédrale d'Amiens — dates, dimensions, records — ne sont pas ici.** Ils appartiennent à une note de pont à venir ; le dossier `ponts\` est vide au 14/09/2026.
- **Aucune note de `science\` n'existe à cette heure**, et le dossier `art\` n'est pas le mien : les renvois de référence pointent donc vers `06`, `09`, `00` et `11`.

*GL Digital Lab — dossier créé le 14/09/2026. Quatorze atomes, une carte, aucune œuvre protégée reproduite.*
