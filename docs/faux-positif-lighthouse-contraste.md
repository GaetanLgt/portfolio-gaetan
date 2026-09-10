# Faux positif Lighthouse — contraste des cartes d'offres

> **Constat mesuré le 10/09/2026. À lire avant de « corriger » ce qui n'est pas
> cassé.** Ce document est dans le dépôt pour qu'aucun agent, développeur ou
> auditeur ne reperde des heures sur ce point.

## Ce que dit Lighthouse

Sur la page d'accueil, l'audit d'accessibilité ressort à **97/100** avec un
unique échec, `color-contrast` (0/100) portant sur **68 éléments** :

```
Element has insufficient color contrast of 2.92
(foreground color: #e8f7ee, background color: #8e8f91)
Expected contrast ratio of 4.5:1
```

## Ce que disent les pixels

Capture de la page complète en 1440×5600, mesure du fond réel derrière ces
éléments (zone y 5200-5560, x 70-350, là où Lighthouse situe les cartes) :

| | Valeur |
|---|---|
| Fond annoncé par Lighthouse | `#8e8f91` |
| **Fond réellement peint** | **`#040a0a`** |
| Contraste réel, texte principal `#E8F7EE` | **18,02:1** (AAA) |
| Contraste réel, texte secondaire `#A9C4B4` | 10,68:1 (AAA) |
| Contraste réel, cyan `#00E5FF` | 12,97:1 (AAA) |

## Pourquoi c'est un faux positif

La valeur `#8e8f91` est **identique sur trois exécutions successives**, alors que
trois modifications CSS différentes du fond des cartes ont été appliquées entre
temps. Une couleur calculée aurait changé. `#8e8f91` est la **constante
d'incertitude d'axe-core**, le moteur d'accessibilité de Lighthouse : elle est
retournée quand le moteur **ne parvient pas à résoudre** l'arrière-plan d'un
élément, pas quand il le trouve mauvais.

## Ce qui a été tenté, sans effet

1. Opacité du fond des cartes relevée de 0,62 à 0,94.
2. Suppression du `backdrop-filter` (flou de verre) sur `.glass`.
3. Fond rendu **totalement opaque** (`#08100F`).
4. Correction d'un vestige de la DA claire : `global.css` portait un `.glass`
   avec un fond **blanc à 60 %**, en contradiction avec la définition sombre de
   `critical.css`. Ce vestige était réel et méritait d'être corrigé — mais il
   n'était pas la cause du signalement.

Aucune de ces actions n'a déplacé la valeur annoncée, ce qui confirme la nature
du problème : c'est la **résolution** de l'arrière-plan qui échoue, pas le
contraste.

## Hypothèse la plus probable

Les cartes sont enveloppées dans un composant d'apparition au défilement
(`ScrollReveal`) qui anime `opacity` et `transform`. axe-core ne sait pas
aplatir un arrière-plan à travers un ancêtre dont l'opacité n'est pas 1. Au
moment de la mesure, l'animation peut être en cours ou l'élément hors écran.

**Statut : hypothèse, non vérifiée.** La vérifier demanderait d'instrumenter le
calcul d'axe sur un élément figé à opacité 1.

## Conséquence pratique

- **Pour l'utilisateur** : aucun problème. Le contraste réel est de 18:1.
- **Pour un audit externe** : quiconque lance Lighthouse verra « 97/100,
  contraste insuffisant ». Il faut donc **le dire avant qu'on nous le dise**.
- **Pour la charte du studio** : la cible « Lighthouse ≥ 95 » est atteinte pour
  l'accessibilité (97) mais l'objectif « ≥ 95 » global n'est pas tenu, à cause
  de la **performance** (49-61 selon les exécutions), pas de ce point.

## Ce qu'il ne faut pas faire

- Ne pas assombrir ni éclaircir davantage les fonds : c'est déjà conforme, et
  cela abîmerait la direction artistique pour rien.
- Ne pas supprimer l'animation d'apparition au défilement pour faire plaisir à
  un outil : elle sert la lecture, et son coût est déjà optimisé.
- Ne pas retirer `color-contrast` de l'audit pour obtenir un 100/100 : ce serait
  masquer le signal plutôt que le traiter.

*Mesure reproductible : capture `--window-size=1440,5600` puis échantillonnage
des pixels à l'emplacement indiqué par Lighthouse. Rapport Lighthouse complet :
828 Ko de JSON, catégorie accessibilité.*
