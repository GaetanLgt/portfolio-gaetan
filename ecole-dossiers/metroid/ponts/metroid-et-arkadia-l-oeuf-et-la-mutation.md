---
tags: [pont, metroid, arkadia, reacteur, oeuf, mutation, jeu, licence]
date: 2026-09-15
statut: pont
verifie: 2026-09-15
---

# Metroid × ArkAdiA — **l'œuf**, et la mutation

*Le Metroid est un œuf : un noyau dans une membrane, qui mue jusqu'à une reine. Le réacteur du navire d'ArkAdiA porte exactement ces deux premiers mots — **Noyau**, **Membrane** — et il mue jusqu'à **APEX**. La correspondance n'est pas à construire : elle est écrite dans les données du jeu, et sa source est une phrase de Gaëtan.*

> ⚠️ **Avant tout.** *Metroid* appartient à **Nintendo**, et la franchise figure au registre des licences refusées du studio. Cette note **analyse des principes** et **cite ses sources** ; elle ne réutilise **ni visuel, ni nom de créature, ni design**. *« Le genre et la technique sont libres ; le nom, le personnage et le design sont pris »* — [[proteger-une-licence-est-une-strategie]].
> ⚠️ **Et un second point, qui n'est pas le même** : le nom **« APEX » n'est pas au suivi des noms du studio**. *Apex Legends* (EA / Respawn) est une marque connue — **à vérifier avant toute sortie publique.**

---

## 1. Côté Metroid — mesuré dans ce vault, pas ailleurs

| Fait | Où il est établi |
|---|---|
| **Cycle en cinq stades** : larve → alpha → gamma → zêta → oméga → **reine** | [[05-le-lore]] § « Les Métroïdes » · [[glossaire]] |
| **« leur cycle de vie tient lieu de chronologie »** | [[lanimalier-comme-grammaire-du-lore]] (`art/`) |
| Créés par les **Chozos** pour contenir les X ; pompent l'énergie vitale ; craignent le froid | [[04-samus-et-les-personnages]] · [[05-le-lore]] |
| ⚠️ **Le nombre de stades est attribué à *Metroid II* et son remake** par la source EN | [[05-le-lore]] § « Canon / interprétation » |

**La forme, telle que la base la décrit** : un **dôme translucide** (une **membrane**), des **noyaux** visibles à l'intérieur, et la capacité de **pomper l'énergie vitale**. *Un œuf, avec ce qu'il faut dedans pour éclore.*

---

## 2. Côté ArkAdiA — mesuré dans les données du jeu

`jeu/donnees/reacteur.json`, en tête de fichier :

> *« Le réacteur vivant et ses stades. **Décision de Gaëtan, 15/09/2026 : « les metroid ont muté pour Apex »** — le nom de sa forme aboutie est **APEX**. Données, pas code : ajouter un stade ne touche aucun `.mjs`. »*

| Stade | Seuil (assimilés) | Faim par tour | Ce que le stade dit |
|---|---|---|---|
| **Noyau** | 0 | 7 | *« Il a faim, et il attend. Rien ne dit encore ce qu'il deviendra. »* |
| **Membrane** | 60 | 9 | *« Il grossit. Ce qu'il prend lui sert deux fois. »* |
| **Vaste** | 140 | 12 | *« Il prend de la place dans la coque — et dans la mémoire. »* |
| **APEX** | 240 | 16 | *« Il ne se nourrit plus : il vit. Et il se sert lui-même dans le savoir. »* |

Et **`seuilFermeture: 340`** : *« **un apex = un noyau** »* — le réacteur **redevient un Noyau**. *Le cercle se referme.*

---

## 3. ⭐ Le pont — et il tient par un seul mot : **l'ŒUF**

**[FAIT]** Un œuf, c'est **un noyau dans une membrane**. Ce sont **les deux premiers stades du réacteur**, dans cet ordre.

**[FAIT]** Un œuf **mue**. Le Metroid mue en **cinq** stades jusqu'à une **reine** ; le réacteur mue en **quatre** jusqu'à **APEX**. *Deux formes abouties, deux comptes différents.*

**[FAIT]** Un œuf pondu **est un œuf**. Chez ArkAdiA, **un apex redevient un noyau** — *la seule forme du jeu qui se reproduise.*

**[INTERPRÉTATION — et elle est de moi, pas des sources]** **« Les metroid ont muté pour Apex » décrit exactement le geste du studio** : *on prend le registre d'une œuvre, on le fait **muer**, et ce qui en sort porte un autre nom.* **La mutation n'est pas un ornement : c'est la distance.** *Le Metroid devient APEX — et l'œuf reste l'œuf.*

---

## 4. ⚠️ Ce que ce pont **ne prouve pas**

1. **Que les quatre stades du jeu soient DÉRIVÉS des cinq stades du Metroid.** *Ce qui est établi, c'est une **décision datée** : Gaëtan a nommé la forme aboutie en référence aux Metroid (15/09/2026).* **La correspondance est structurelle et voulue ; elle n'est pas une filiation de conception.**
2. **Que le Metroid soit « un œuf » dans le canon de la série.** *Ce n'est pas ce que dit la base : elle décrit un **dôme translucide**, des **noyaux** et un **cycle**. **« C'est un œuf » est une lecture** — commode, et à ne pas confondre avec un fait.*
3. **Rien sur le plan juridique.** *Nintendo détient la marque et les designs ; **« APEX » a son propre risque**, distinct.* **Cette note ne conclut pas — le droit est réservé (D12).**
4. **Rien sur la jouabilité.** *Que le réacteur mue en quatre stades ne dit pas qu'un joueur les atteint — c'est une autre question, et elle se mesure.*

---

## 5. Ce que ce pont ouvre

- **Une question de comptage** : le Metroid a **cinq** stades, le réacteur **quatre**. *Faut-il un cinquième — ou le compte est-il ce qui distingue nos deux objets ?*
- **Un rapprochement avec le nom du jeu** : *« ArkAdiA, la graine d'Yggdrasil »* — **une graine est un œuf.**
- **Et une piste de méthode** : la base sait décrire **un cycle de vie qui vaut chronologie** ; le jeu a le sien. *Le pont est fait ; reste à décider ce qu'on en fait.*

---

*Écrit le 15/09/2026. Sources : `jeu/donnees/reacteur.json` (décision du 15/09/2026) et les notes de ce vault — [[05-le-lore]], [[04-samus-et-les-personnages]], [[glossaire]], [[lanimalier-comme-grammaire-du-lore]]. **Les interprétations sont marquées comme telles.***
