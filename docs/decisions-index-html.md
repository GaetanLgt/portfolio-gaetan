# Décisions portées par le head de index.html

> **Extrait le 11/09/2026** depuis les commentaires de index.html, AVANT leur retrait
> du fichier livré. Rien n'a été perdu : les sections ci-dessous SONT le contenu de ces
> commentaires, avec leur date et leur raison.
>
> **Pourquoi ils ont été retirés :** un commentaire du head est téléchargé par chaque
> visiteur, et il exposait publiquement des notes de travail internes. Chiffres mesurés :
> `index.html` passe de **16 114 à 12 270 octets** (-3 844, soit -24 %) ; la passe de
> propreté du pré-rendu retire en plus **2 672 octets** des fichiers livrés ; l'accueil
> servi passe de **30 867 à 29 257 octets**. Le HTML livré ne doit porter que ce que le
> navigateur exécute.
>
> **Ce qui vit ici plutôt que dans le head :** les décisions et leurs motifs.
> Ce qui doit rester dans le head : le code actif, et rien d'autre.

---

## ⚠ CORRECTION — un diagnostic FAUX était publié dans le commentaire des favicons

Le commentaire C1 ci-dessous affirme : *« Le vendor (Vue) recevait un 429, donc l'application ne
se montait pas et le visiteur perdait menu, pied de page et bandeau cookies. »*

**C'est faux, et cette phrase était servie à chaque visiteur du site.** Rectification mesurée le
11/09/2026 : ces HTTP 429 venaient de **l'outil de mesure lui-même**, qui interrogeait le site par
rafales depuis une seule adresse IP — pas de la charge du site. En-têtes relevés à l'appui : les
trois assets répondent **200**, `Cache-Control: max-age=31536000, immutable` sur les assets et
les polices, `no-store` sur le HTML.

Et la **vraie** cause de « ni menu, ni pied de page, ni bandeau » a été trouvée le même jour ;
elle est structurelle et n'a rien à voir avec un quota :

```html
<!-- App.vue -->
<Navigation v-if="isLoaded && !isFullscreenGame" />
<Footer     v-if="isLoaded && !isFullscreenGame" />
```

Toute la coquille est conditionnée à `isLoaded`, qui ne passe à `true` qu'à l'événement `@loaded`
du composant `<Loader>`. Or `prerendre.js` capture le DOM dès que `#app` contient du texte —
**c'est-à-dire pendant que le Loader tourne encore**. Le HTML pré-rendu est donc photographié avec
`isLoaded === false` : **ni nav, ni footer, ni bandeau**, sur les 23 routes.

Conséquences, à ne pas confondre :

- **Un visiteur avec JavaScript ne voit aucun défaut** : il regarde le Loader, puis tout apparaît.
- **Un robot, un aperçu de lien ou un visiteur sans JavaScript** reçoit un HTML sans navigation.
  La charte du studio promet un contenu « 100 % lisible et **navigable** sans JavaScript » : la
  partie *lisible* est tenue par le pré-rendu, la partie *navigable* ne l'est pas encore.
- Le `<noscript>` écrit à la main (10 liens, dont `/services`, les pages légales, `mailto:`, `tel:`)
  ne rattrape rien : il vit **à l'intérieur de `#app`**, Vue le remplace au montage, et le pré-rendu
  le capture donc **déjà avalé**. Mesuré : `noscript` = 0 dans le HTML livré.

**Deux leçons, et elles valent plus que le défaut.**

1. *Mesurer au bon moment.* Cinq rounds de mesures ont attribué ces zéros au quota IP, puis au 429,
   puis au cache. Aucune de ces explications n'était la bonne, parce que la mesure portait sur le
   **HTML reçu** alors que la question portait sur le **DOM après animation**.
2. *Ne jamais retirer les commentaires naïvement.* Le HTML livré contient **611 commentaires** dans
   les 24 fichiers — tous des ancres de fragment Vue (`<!---->`, `<!--[-->`, `<!--]-->`) dont
   l'hydratation dépend. Ils sont **vides** : la passe de propreté ne retire donc que les
   commentaires qui **portent du texte**. Mesuré après build : **611 conservés, 0 textuel livré**.
   Un `s.replace(/<!--.*?-->/g, '')` aurait détruit les 611 ancres sur les 23 routes.

---


## C1 - ligne 8

```
Opquast N°98 : Title identifie le site
```

## C2 - ligne 11

```
Opquast N°98 : Meta description
```

## C3 - ligne 14

```
Favicons — RÉDUITS DE 4 À 2 LE 11/09/2026, et le motif est mesuré.
         Le premier chargement déclenchait 14 requêtes, dont TROIS icônes
         (svg + 32x32 + 16x16) : le navigateur les téléchargeait toutes pour
         choisir — observé dans `performance.getEntriesByType('resource')`.
         Or o2switch limite les rafales à ~20 requêtes rapprochées : la marge
         était d'une page et demie. Le vendor (Vue) recevait un 429, donc
         l'application ne se montait pas et le visiteur perdait menu, pied de
         page et bandeau cookies.
         Le SVG suffit à tous les navigateurs modernes ; l'apple-touch-icon
         reste pour iOS. Les deux PNG restent dans `public/` : la décision est
         réversible en deux lignes.
```

## C4 - ligne 30

```
Open Graph
```

## C5 - ligne 42

```
Twitter Card
```

## C6 - ligne 49

```
SEO
```

## C7 - ligne 57

```
Google Search Console
```

## C8 - ligne 60

```
Mots-clés (moins important mais toujours utile)
```

## C9 - ligne 63

```
Géolocalisation (Opquast N°100)
```

## C10 - ligne 67

```
Schema.org JSON-LD : LocalBusiness + Person
```

## C11 - ligne 214

```
FONTS : Self-hosted pour performance (voir /public/fonts)
```

## C12 - ligne 215

```
Preload des fonts critiques
```

## C13 - ligne 216

```
Ces faces sont declarees ici (dans le <head>), et non uniquement dans
         fonts.css (importe depuis main.js, donc apres le bundle JS).
         PAS de <link rel="preload"> : dans une SPA le HTML est vide au premier
         rendu, les fonts ne sont sollicitees qu'au montage Vue -> Firefox
         signalerait « preload not used ». Le @font-face inline suffit : le
         navigateur decouvre et charge la font au parse du head.
```

## C14 - ligne 242

```
═══════════════════════════════════════════════════════════════════
           CONTENU SANS JAVASCRIPT — engagement de la charte du studio
           (« contenu 100 % lisible et navigable sans JavaScript »).

           Constat du 10/09/2026 : le site est une application montée côté
           client. Sans JavaScript, le visiteur voyait une PAGE BLANCHE — aucun
           contenu, aucun prix, aucun contact. C'était la violation la plus
           grave de la charte, et elle concernait aussi les robots d'indexation
           et les moteurs de réponse IA, qui n'exécutent pas toujours le script.

           Ce bloc est du HTML pur, placé DANS #app : Vue le remplace au
           montage dès que JavaScript est actif. Il ne s'affiche donc jamais
           deux fois, et il sert exactement à ceux qui en ont besoin.

           Règle : ce bloc doit rester AUTONOME et SANS STYLE EXTERNE — les
           feuilles de style peuvent ne pas être chargées. Ne pas y mettre de
           composant, ne pas y mettre d'image.
           ═══════════════════════════════════════════════════════════════════
```

## C15 - ligne 260

```
PALETTE D5 (corrigée le 11/09/2026). Ce bloc était resté en DA
             claire papier (#F4F1EA, texte #1A1A18, accent #A63F26) alors que la
             charte est passée en sombre (D5). Un visiteur sans JavaScript
             recevait donc l'ancien univers à l'envers — fond blanc, texte noir.
             Les couleurs sont ici en sombre et en dur, volontairement : ce bloc
             doit rester autonome, les feuilles de style pouvant ne pas être
             chargées.
             ═══════════════════════════════════════════════════════════════════
```

## C16 - ligne 319

```
Phrase corrigée le 11/09/2026 : elle annonçait une direction
               artistique animée par défaut et un mode sobre facultatif. C'est
               l'inverse — le site s'affiche sobre, et le décor est ce qu'on
               active.
```

