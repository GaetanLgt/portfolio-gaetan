# Production 100 % française — où on en est, mesuré

> **Objectif de Gaëtan, 28/09/2026** : *« Faire de la production locale à 100 %, pas d'appel
> à Microsoft, faire du produit 100 % français. »*
> ⚠️ **Cet objectif est mesurable. Ce document le mesure, et nomme les trois trous.**

---

## ⭐ OÙ LE STUDIO EN EST — MESURÉ LE 28/09/2026

| couche | état | souverain ? |
|---|---|---|
| **Modèles de langue** | **12 en local** (Ollama), **42,6 Go** | ✅ **oui** — *aucun appel à OpenAI, Anthropic, Google, Microsoft* |
| **Données** | ⛔ **aucune ne sort** de la machine | ✅ **oui** |
| **Génération d'images** | ComfyUI local (**arrêté au 28/09**) | ✅ oui, *quand il tourne* |
| **Inférence** | RTX 3080, **10 240 MiB** (10 Go) | ⚠️ **matériel américain** |
| **Processeur** | Intel i7-11700KF | ⚠️ **américain** |
| **Hébergement du site** | **o2switch** — Clermont-Ferrand, **français** | ✅ **oui** |
| **Dépôt de code** | ⛔ **GitHub — Microsoft** | ⛔ **NON** |
| **Chaîne de déploiement** | ⛔ **GitHub Actions — Microsoft** | ⛔ **NON** |
| **Système d'exploitation** | ⛔ **Windows 11 — Microsoft** | ⛔ **NON** |

⇒ ⭐ **« Pas d'appel à Microsoft » : c'est DÉJÀ VRAI pour l'IA.** Aucun modèle distant,
aucune API payante, aucune donnée qui sort. **C'est le résultat de dix-huit mois de
discipline** — *et c'est rare.*

---

## ⛔ LES TROIS TROUS, ET ILS NE SONT PAS DE LA MÊME TAILLE

### ① **Microsoft dans la chaîne de production** — le plus visible

**Le site est déployé par GitHub Actions.** Le code vit chez **Microsoft**, le
déploiement est exécuté **par Microsoft**.
⇒ ⚠️ **Ce n'est pas un appel d'IA — mais c'est une dépendance de production.**
*Si GitHub tombe, on ne déploie plus. Si GitHub change ses conditions, on subit.*

**✅ Ce qui existe pour le remplacer, en français :**
- **Forgejo** / **Gitea** — auto-hébergeable, libre ;
- **GitLab** — auto-hébergeable (éditeur **franco-américain**, ⚠️ à vérifier) ;
- **Woodpecker CI**, **Drone** — chaînes d'intégration auto-hébergées.

⚠️ **Et une réserve mesurée** : **o2switch est du mutualisé.** Y faire tourner un
serveur Git + CI est **possible mais pas prévu pour ça.** *Ça se vérifie avant de promettre.*

### ② **Le silicium et le système** — le trou qu'on ne comble pas

⛔ **Windows, Intel, NVIDIA.** Les trois sont **américains**.
⇒ ⭐ **Et c'est le point honnête de ce document** : *personne, en Europe, ne fait un
poste de travail 100 % européen de bout en bout.*
- **système** : Linux ✅ *— mais le noyau s'appuie sur du matériel non-européen* ;
- **CPU** : ⛔ *pas d'alternative européenne grand public* ;
- **GPU** : ⛔ *pas d'accélérateur européen de pointe en production*.

⚠️ **Le studio travaille sur DEUX postes** : un sous **Windows** et un sous **Linux Mint**.
⇒ **Une partie du parc est déjà sous Linux.** *C'est un début réel, pas théorique.*
⚠️ **Les noms de machines ne sont pas publiés** : ils n'ont **aucune utilité pour le
lecteur**, et la règle du studio (`REGLE-ce-qui-se-publie`, question ②) dit de ne pas
donner ce qui n'est pas à nous de dire. *Un nom d'hôte est une prise.*

### ③ **Les modèles ouverts viennent d'ailleurs** — même s'ils tournent ici

⚠️ **Distinction qui compte** :
- **faire tourner un modèle localement** = les données ne sortent pas ✅ ;
- **que le modèle soit français** = autre chose ⛔.

**Les 12 modèles d'Ollama sont-ils français ?** ⛔ **Non** — pour la plupart.
**Mistral est le seul acteur européen de premier rang**, et **Gaëtan a prévu de les
contacter.** *C'est exactement la bonne démarche — et elle se mesure : combien de nos
12 modèles sont français ?*

---

## ⭐ CE QUE « 100 % FRANÇAIS » VEUT DIRE AUJOURD'HUI — ET CE QUE ÇA NE PEUT PAS

| niveau | atteignable ? | comment |
|---|---|---|
| **Les données ne sortent pas** | ✅ **déjà fait** | modèles locaux |
| **Aucun appel d'IA à un tiers** | ✅ **déjà fait** | Ollama, ComfyUI |
| **L'hébergement du site est français** | ✅ **déjà fait** | o2switch |
| **La chaîne de déploiement est française** | ⚠️ **possible** | Forgejo auto-hébergé *— à vérifier* |
| **Les modèles sont européens** | ⚠️ **partiel** | Mistral *— à mesurer* |
| **Le matériel est européen** | ⛔ **non** | *aucune offre de pointe* |

⇒ ⭐ **« Nécessaire et suffisant », en une phrase** :
> **Souverain sur la DONNÉE et sur l'USAGE. Honnête sur le MATÉRIEL.**

*On peut garantir qu'aucune donnée ne sort. On ne peut pas garantir que la puce est
européenne — et le dire vaut mieux que de le promettre.*

---

## ⛔ CE QUE CE DOCUMENT NE FAIT PAS

- ⛔ **Il ne propose aucune migration.** *C'est une décision, et elle a un coût.*
- ⛔ **Il ne dit pas que GitHub est un danger.** *Il dit que c'est une dépendance.*
- ⛔ **Il ne prétend pas que « 100 % » est atteignable en matériel.**
  *Le dire est la seule position tenable.*
- ⚠️ **Deux chiffres restent à vérifier** :
  - **combien des 12 modèles Ollama sont européens** — *à mesurer* ;
  - **si o2switch autorise un serveur Git + CI** — *à vérifier dans les CGU, pas à supposer*.

---

## ⭐ LA PLACE DU STUDIO, ET ELLE EST RÉELLE

**Le studio ne fait pas de politique industrielle. Il fait une démonstration.**

⭐ **Et elle tient en trois lignes** :
- **12 modèles** qui tournent **en local**, **42,6 Go** ;
- **aucun appel payant**, **aucune donnée qui sort** ;
- **sur une machine de 2021, avec 10 Go de VRAM.**

⇒ *Dans un débat où l'on parle d'infrastructures en milliards, **une seule machine qui
tourne vraiment vaut mieux qu'un schéma**.*
**Et c'est mesurable par n'importe qui : les commandes sont dans ce document.**

---

## ⭐⭐ LE CADRE JURIDIQUE — ARTICLE 5 DE LA CONSTITUTION

> **Gaëtan, 28/09/2026 : *« Article 5 de la Constitution. »***

> **Article 5** — *« Le Président de la République veille au respect de la Constitution.
> Il assure, par son arbitrage, le fonctionnement régulier des pouvoirs publics ainsi que
> la **continuité de l'État**. Il est le garant de l'**indépendance nationale**, de
> l'intégrité du territoire et du **respect des traités**. »*

### ⭐ LES TROIS TERMES QUI CONCERNENT DIRECTEMENT CE DOCUMENT

| le terme | ce qu'il implique concrètement |
|---|---|
| **« continuité de l'État »** | ⛔ **une chaîne de déploiement chez Microsoft n'est pas une continuité garantie** — *si GitHub tombe, un service public s'arrête* |
| **« indépendance nationale »** | ⛔ **les couches ③ (silicium) et ⑤ (modèles)** — *le vrai écart, mesuré* |
| **« respect des traités »** | ✅ **RGPD, EHDS** — *c'est par là que l'Europe se construit, pas par le repli* |

⇒ ⭐ **L'article 5 donne un CADRE JURIDIQUE à ce que Gaëtan décrit.** Ce n'est plus
*« il faudrait être souverain »* : c'est **une obligation constitutionnelle de
continuité**, qui se traduit par **ne pas dépendre d'un acteur unique et étranger pour
un service essentiel.**

### ⛔ MAIS IL NE DIT PAS QUI CONSTRUIT — ET IL FAUT LE DIRE

**L'article 5 dit que l'État VEILLE et ARBITRE.**
⇒ ⛔ **Un studio privé ne peut pas s'auto-attribuer une mission de continuité.**
Il peut :
- **la proposer** ;
- **la démontrer** ;
- **s'y adosser** (établissement public, collectivité).

⭐ *C'est exactement ce que Gaëtan a dit du CNAM : **ça se propose, ça ne se décrète pas.***

### ⭐ ET LE STUDIO A DÉJÀ UNE DÉMONSTRATION DE CONTINUITÉ

⚠️ **À petite échelle, et ce n'est pas une figure de style** :
- **12 modèles en local** — *aucun appel à un service tiers* ;
- **aucune donnée qui sort** ;
- **aucun abonnement, aucune API payante**.

⇒ ⭐ **Si Internet tombe, le studio continue de fonctionner.**
*La plupart des entreprises ne peuvent pas en dire autant — et c'est vérifiable.*

⚠️ **ET LA LIMITE, ÉCRITE NOIR SUR BLANC** : le studio **reste dépendant** de
**GitHub** (dépôt + déploiement) et de **Microsoft** (Windows). *La continuité est
démontrée pour l'IA, pas encore pour la chaîne de publication.*
⇒ **C'est le premier chantier si cet objectif devient une priorité** — et il est
**faisable** : Forgejo auto-hébergé, à condition de vérifier que l'hébergeur le permet.
