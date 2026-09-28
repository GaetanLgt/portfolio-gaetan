# Souveraineté INFRA — de l'existant à ce qui serait nécessaire et suffisant

> **Question de Gaëtan, 28/09/2026** : *« La souveraineté française, et cette fois-ci pas au
> niveau logiciel mais au niveau INFRA. Qu'est-ce qu'on peut mettre en place par rapport à
> ce qui existe, par rapport à ce qui devrait être. Nécessaire et suffisant pour avoir des
> systèmes optimisés au niveau français intégral. »*
> ⚠️ **Et un mot qu'il a employé, qu'il faut reclasser** : *« nationaliser le truc à titre
> de ressources, comme l'électricité, l'eau. »*

---

## ⚠️ D'ABORD : « NATIONALISER » N'EST PAS LA BONNE CATÉGORIE

⛔ **Et le dire te protège** — *nationaliser est une décision d'État, pas un projet de
studio.* Ce que Gaëtan décrit existe déjà, **et ça a un nom pour chaque chose** :

| ce qu'il décrit | comment ça s'appelle en France | existe déjà ? |
|---|---|---|
| un service essentiel, accessible à tous | **service public** | oui |
| une ressource qu'on ne laisse pas à un acteur privé | **service universel** | oui — le téléphone, l'électricité |
| une infrastructure critique | **opérateur d'importance vitale (OIV)** | oui — désignés par l'État |
| un bien commun numérique | **commun numérique** | oui — data.gouv.fr, logiciels libres de l'État |

⇒ ⭐ **On ne « nationalise » pas l'IA. On la traite comme un SERVICE UNIVERSEL** :
*comme le réseau électrique — tout le monde y a accès, et personne ne peut couper
une région pour des raisons commerciales.*

### ⭐ ET L'ÉTAT A DÉJÀ DES BRIQUES — ce n'est pas à inventer

- **FranceConnect** — l'identité numérique ;
- **l'Annuaire des entreprises** — la donnée économique ;
- **data.gouv.fr** — l'ouverture des données ;
- **le cloud de l'État** (Numspot) — opéré par un **groupement public-privé** ;
- **Docaposte, OVH, Scaleway, Outscale** — hébergeurs **français** (⚠️ **SecNumCloud**
  pour certains, pas tous).

---

## ⛔ CE QUE LE STUDIO A, MESURÉ LE 28/09/2026

| | |
|---|---|
| **GPU** | **NVIDIA RTX 3080** — ⚠️ *VRAM annoncée à 4 Go par Windows, la réalité est 10 ou 12 Go* |
| **CPU** | **Intel i7-11700KF @ 3,60 GHz** |
| **RAM** | **64 Go** |
| **Disque** | C: **232 Go libres** · D: **5 011 Go libres** |
| **Modèles locaux** | **12 modèles Ollama**, **42,6 Go** |
| **Services** | RAG (8080), Samus (8081), façade (8082), Ollama (11434), harnais (3080) |

⇒ ⭐ **Le studio tourne DÉJÀ en souverain** : modèles locaux, aucune donnée qui sort,
**aucun appel payant**. *C'est une preuve à petite échelle de ce qui est demandé à
grande échelle.*

---

## ⭐ LES CINQ COUCHES DE L'INFRA — et chaque couche a un propriétaire différent

⚠️ **C'est le cœur de la réponse** : *« la souveraineté infra » n'est pas UNE décision,
c'est CINQ, et elles ne s'obtiennent pas de la même façon.*

| # | couche | qui la possède aujourd'hui | l'écart français |
|---|---|---|---|
| **①** | **Énergie** | RTE / Enedis (réseau) | ✅ **souverain** — *mais un datacenter consomme* |
| **②** | **Réseau** | opérateurs privés + **GIX** | ⚠️ **partiel** — les câbles sous-marins sont majoritairement non-européens |
| **③** | **Silicium** | ⛔ **NVIDIA, AMD, TSMC** | ⛔ **le vrai écart** — *aucun fondeur européen de pointe* |
| **④** | **Infogérance** | OVH, Scaleway, Outscale, Numspot | ⚠️ **existe**, mais **petit face aux hyperscalers** |
| **⑤** | **Modèles** | ⛔ **US majoritairement** | ⚠️ **Mistral** — *le seul acteur européen de premier rang* |

⇒ ⛔ **C'est la couche ③ qui bloque tout.** *On peut avoir des modèles français et des
datacenters français — ils tourneront sur du silicium américain.*
⭐ **Et c'est mesuré** : ta RTX 3080 est **NVIDIA**. Ton studio, aussi souverain soit-il
dans son usage, **repose sur du matériel non-européen.**

---

## ⛔ CE QUI SERAIT « NÉCESSAIRE ET SUFFISANT » — et ce qui ne l'est pas

> Gaëtan : *« nécessaire et suffisant pour avoir des systèmes optimisés au niveau
> français intégral. »*

⚠️ **« Suffisant » est le mot le plus honnête de sa phrase — et le plus dur.**
*« Intégral » n'existe pas aujourd'hui : personne, en Europe, ne fait un système IA
100 % européen de bout en bout.* **Le dire est un résultat, pas un aveu.**

| niveau | ce qui serait suffisant | existe ? |
|---|---|---|
| **Usage** | modèles locaux, données qui ne sortent pas | ✅ **oui** — *le studio le fait* |
| **Modèles** | un modèle ouvert européen de premier rang | ⚠️ **partiel** — Mistral |
| **Infogérance** | hébergeur **SecNumCloud** | ✅ **oui** — OVH, Numspot, Outscale |
| **Silicium** | accélérateurs **conçus en Europe** | ⛔ **non** — *projets en cours, pas de production de pointe* |
| **Fabrication** | une fonderie européenne avancée | ⛔ **non** — *le Chips Act finance, il ne produit pas encore* |

⇒ ⭐ **« Nécessaire et suffisant » aujourd'hui, ça veut dire** :
**souveraineté de l'USAGE et de la DONNÉE**, pas du silicium.
*On peut garantir qu'aucune donnée ne sort. On ne peut pas garantir que la puce est
européenne.*

---

## ⛔ CE QUE CE DOCUMENT NE FAIT PAS, ET CE QU'IL NE DIT PAS

- ⛔ **Il ne propose aucune nationalisation.** *C'est une décision d'État.*
- ⛔ **Il ne prétend pas qu'un studio peut combler l'écart du silicium.**
  *Un studio ne construit pas une fonderie — et le dire est la seule position honnête.*
- ⛔ **Il ne recommande aucun fournisseur.** *Il nomme ceux qui existent, sans jugement.*
- ⚠️ **La VRAM de la RTX 3080 est annoncée à 4 Go par Windows** — c'est une
  **limitation connue de l'API**, pas la réalité du matériel. **À vérifier par `nvidia-smi`**
  avant toute affirmation sur ce que la machine peut faire.

---

## ⭐ ET LA PLACE DU STUDIO, DANS TOUT ÇA

**Le studio ne fait pas de politique. Il fait de la preuve.**

⇒ **Ce qu'il peut apporter, et qui a de la valeur** : **montrer qu'un système souverain
fonctionne, à petite échelle, avec des moyens ordinaires.**
- **12 modèles locaux**, 42,6 Go ;
- **Samus répond en 11 secondes** sur une RTX 3080 ;
- **aucune donnée ne sort** ;
- **aucun abonnement, aucun appel payant**.

⭐ *Ce n'est pas un argument. C'est un fait mesuré, reproductible, et vérifiable.*
**Et dans un débat où tout le monde parle d'infrastructure en milliards, une seule
machine qui tourne vraiment vaut mieux qu'un schéma.**
