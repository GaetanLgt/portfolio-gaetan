# Le builder de sites 3D — ArkAdiA Studio

> **Ce que c'est** : un générateur qui transforme une **description de monde** (un fichier
> JSON) en **site 3D navigable** (un `index.html` autonome).
>
> **Pourquoi** : *un site normal, c'est des pages qu'on fait défiler. Une page = un
> document. **On ne visite pas un site, on le lit.*** Ici, un site est un **monde** : des
> lieux posés dans un vide, reliés par des trajets — et le contenu **est** le lieu.
> On ne descend pas une page, **on voyage.**

---

## Usage

```bash
node construire.mjs <monde.json> [dossier-de-sortie]
```

Exemple :

```bash
node construire.mjs mondes/preuves.json ../livrables/les-preuves
```

Il écrit **deux fichiers** :

| Fichier | Rôle |
|---|---|
| `index.html` | le monde entier, ~20 Ko |
| `three.min.js` | le moteur, recopié — **jamais lié à un CDN** |

**Ouvrir `index.html` dans un navigateur.** Rien d'autre n'est requis : pas de serveur,
pas de réseau, pas de compte.

---

## Commandes

| Entrée | Effet |
|---|---|
| `←` `→` ou `Page↑` `Page↓` | voyager d'un lieu à l'autre |
| **stick gauche (manette Xbox)** | voyager — **c'est le chemin normal** |
| gâchettes `LT` / `RT` | approcher / reculer |
| clic-glisser | tourner autour du lieu |
| molette | approcher |
| clic sur un lien du texte | aller au lieu visé |

⭐ **La manette est le chemin normal, pas une option.** Consigne du studio : *« si tu fais
des jeux, pense à la navigation manette Xbox »*. Le clavier marche aussi, mais rien
n'oblige à y toucher.

---

## Décrire un monde

```json
{
  "titre": "Le nom du monde",
  "description": "Ce que les moteurs de recherche en diront.",
  "graine": 42,
  "palette": { "fond": "#060a14", "accent": "#2abfff", "or": "#ffe650" },
  "lieux": [
    {
      "id": "eva01",
      "nom": "EVA01",
      "texte": "Le contenu du lieu. Du HTML simple est accepté.",
      "rayon": 210,
      "hauteur": 0,
      "taille": 19,
      "liens": [{ "vers": "arkadia", "texte": "Voir Arkadia" }]
    }
  ]
}
```

### Les champs d'un lieu

| Champ | Requis | Rôle |
|---|---|---|
| `id` | **oui** | identifiant unique — c'est ce que visent les liens |
| `nom` | **oui** | le titre affiché sur le bouton et dans la carte |
| `texte` | non | le contenu, en HTML simple |
| `liens` | non | `{ vers, texte }` — `vers` doit désigner un `id` existant |
| `rayon` | non | distance au centre du monde (défaut : 220 + 26 × l'index) |
| `hauteur` | non | décalage vertical |
| `taille` | non | taille de la sphère du lieu (défaut 16) |

⚠️ **Les positions sont CALCULÉES, pas écrites à la main.** Les lieux se placent sur une
spirale qui s'ouvre. *Un monde dont les lieux se chevauchent est un monde illisible.*

---

## ⛔ Ce que le builder refuse

**Un monde incohérent ne s'écrit pas.** Il vérifie **avant** d'écrire, et si quelque chose
cloche : il **nomme le défaut**, **n'écrit rien**, et sort en code 1.

- un monde sans titre ;
- un monde sans lieu ;
- un lieu sans `id` ou sans `nom` ;
- **un lien vers un lieu qui n'existe pas** — celui-là est le plus vicieux : il produit un
  bouton qui ne mène nulle part, et ça ne se voit qu'à l'écran, une fois le site livré.

> *Le builder est le dernier endroit où on peut encore dire non.*

**Preuve que le verrou mord** (rejouée le 24/09/2026) :

```
⛔ MONDE INCOHÉRENT — rien n'a été écrit :
   · « a » pointe vers « nexistepas », qui n'existe pas
   exit = 1 · sortie : le dossier n'a pas été créé
```

---

## ⭐ Ce que le builder garantit, et qui n'est pas décoratif

| Garantie | Pourquoi |
|---|---|
| **three.js est recopié, jamais lié** | le CSP du studio interdit tout CDN. *On a payé cette leçon le 24/09/2026, sur la vitrine.* |
| **La graine est affichée** | règle Makoto : *un monde généré s'annonce généré.* Et il est **rejouable** — même graine, même monde, les astéroïdes retombent au même endroit. |
| **Aucun vert** | sorti du canon le 15/09/2026. Assertion sur le résultat du build : `vert : 0`. |
| **`prefers-reduced-motion` respecté** | ni respiration des lieux, ni défilement de la trame. |
| **Le contenu reste lisible sans 3D** | si le moteur ne charge pas, les lieux se listent en bas de page et le texte reste accessible. *Un site qui disparaît quand le WebGL tombe est un site perdu.* |

---

## ⛔ Ce que le builder ne fait PAS — et il le dit

**Il ne génère aucun asset 3D.** Les `.glb` viennent de **ComfyUI**, de Blender ou
d'ailleurs, et le monde les référencera par leur chemin. **Ce chaînon reste à faire.**

**Il ne décide pas du contenu.** Il le reçoit. Un monde vide produit un site vide, et c'est
normal : le builder construit, il n'invente pas.

**Il n'invente aucun chiffre.** *Un site qui mentirait sur lui-même serait pire qu'une page
plate.*

---

## Où sont les mondes

| Monde | Fichier | Lieux |
|---|---|---|
| Le laboratoire | `mondes/laboratoire.json` | 5 — EVA01, Arkadia, le laboratoire, les preuves, le verrou des noms |
| Les preuves | `mondes/preuves.json` | 7 — EVA01, contraintes, décisions, limites, mesures, Arkadia, transposition |

---

## Un piège déjà payé, à ne pas repayer

⛔ **Le chemin de `three.js` a été faux une fois.** Le builder vivait dans
`C:\IA\ArkAdiA\builder\` ; copié dans `portfolio-gaetan/tools/builder-3d/`, le chemin
relatif en deux `..` **pointait dans le vide**.

**Et un chemin faux ne plante pas tout de suite** : il produit un site **sans moteur 3D**,
qui s'ouvre sur du noir. *Un chemin qui dépend de l'endroit d'où on regarde est un chemin
qui casse au premier déménagement.*

⇒ Le script essaie maintenant **quatre emplacements** et prend celui qui existe. Si aucun
n'existe, **il le dit** au lieu d'écrire un site mort.
