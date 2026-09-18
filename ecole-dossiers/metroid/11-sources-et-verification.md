---
tags: [metroid, methode, sources, transversal, arkadia]
date: 2026-09-14
statut: note de methode sourcee
verifie: 2026-09-14
source: forge-ia/verifier-kits.mjs + ecole/metroid-rnd-verifications-2026-09-14.md + mesures du 14/09/2026
---

# Sources, méthode et transversales — ce qui relie ce kit au reste du studio

> **Les deux lacunes que cette note comble, et elles sont mesurées.**
>
> 1. **Aucune note ne reliait ce vault au reste du studio.** Le kit Metroid est le **kit pilote**
>    d'une collection : il applique une **méthode de vérification** et un **outil** qui ne sont pas
>    les siens, et il voisine un **cas d'école transversal** et trois sources de veille. Ce lien
>    n'était écrit **nulle part** dans les notes `01` à `08`.
> 2. **Aucun tableau des sources du vault n'existait.** Chaque note porte le sien ; personne ne
>    donnait la vue d'ensemble — donc personne ne pouvait voir **combien de sources n'ont pas été
>    lues**.
>
> ⚠️ **RÉSERVE DE SOURCE.** Cette note est **transversale** : elle porte sur **la méthode du studio
> et sur l'état du corpus**, pas sur Metroid. Ce qu'elle affirme de Metroid est **renvoyé** aux notes
> `01` à `10` ; ce qu'elle affirme du studio est **mesuré** (outils exécutés, fichiers comptés) — et
> ce qui n'a pas été mesuré est écrit **« non mesuré »**.

---

## 1. La méthode de vérification — deux règles, et elles viennent du terrain

Le studio n'a pas adopté la vérification **par principe** : il l'a adoptée **parce qu'elle a
tranché**. En cherchant à la source les contradictions du vault, les deux erreurs de Wikipédia FR
sont apparues — et elles ne venaient **pas** d'un manque de sources, mais de sources **mal
employées** ([[questions-ouvertes]] § 1 ter).

| La règle | Ce qu'elle interdit |
|---|---|
| **« Vérifier une citation, c'est ouvrir la page citée — pas lire le renvoi. »** | Répondre « c'est sourcé » parce qu'un document cite un nom |
| **« Une source morte invalide l'affirmation qu'elle portait. »** | Maintenir un fait dont la seule source répond **404** — pas parce qu'il est faux, parce qu'il **n'est plus vérifiable** |

**Trois corollaires, tous nés d'un échec mesuré :**

- **Un nom lu par une transcription se vérifie, il ne se cite pas** ([[questions-ouvertes]] § 2) :
  Whisper a écrit « Junpei Yukoi » pour **Gunpei Yokoi**, et quatre graphies pour le même nom.
- **Ne jamais corriger une transcription en silence** : on affiche la forme transcrite, puis
  l'interprétation, puis le statut du doute ([[metroid-pourquoi-si-inconnu]]).
- **Un document qui se contredit se vérifie au cas par cas** — l'article « Metroid » de Wikipédia FR
  se contredit à deux endroits, dans deux sections différentes ([[02-la-chronologie-interne]] § 4).

### 1 bis. L'outil, et ce qu'il ne mesure pas

`forge-ia/verifier-kits.mjs` est la partie **CHECK** du cycle des kits. Il **mesure, il ne juge
pas**, et il rend un code de sortie. Il applique ses critères **selon le type de la note** — et le
type est **déduit du nom du fichier** :

| Type | Reconnu par | Critères appliqués |
|---|---|---|
| `navigation` | `00-…`, `README`, `INDEX` | aucun |
| `contenu` | `^\d\d-`, `^dossier-` | **sources + réserves + limites** |
| `outil` | `glossaire`, `exercices-et-controles` | limites (et **barème + seuil** pour les exercices) |
| `copie` | `fiches/…` (le chemin) | aucun — *une copie qu'on retouche ne se compare plus à l'original* |
| `travail` | **tout le reste** | aucun |

⚠️ **Et c'est un contrat, pas un rangement.** Une note qui n'est ni `NN-`, ni `dossier-`, ni
`glossaire`, ni `exercices-et-controles` **n'est plus jamais mesurée**. Renommer une note
« descriptive » la **sort du contrôle** — *et c'est une sortie silencieuse : le verdict reste vert.*

**Trois choses qu'il ne fait pas, et il faut les écrire :**

1. **Les critères 7 et 8 du gabarit — poids < 1 Mo, accessibilité — ne sont pas dans l'outil** :
   ils sont annoncés « passe finale ». **6 critères sur 8 sont mesurés par machine.**
2. **Il ne dit rien de la qualité pédagogique.** Aucun script ne peut savoir si une question est trop
   dure pour un CE2, et **aucune séance n'a été testée devant un élève** ([[dossier-metroid-360]] § 4).
3. **Il ne lit que `verifie:`** dans le frontmatter. Les autres statuts (`statut:`) servent Obsidian
   et nous : le publieur **retire le frontmatter**, donc **le lecteur ne les voit pas**.

> ⚠️ **Une divergence de règle, mesurée et non corrigée** : le **cycle** annonce **30 jours** de
> fenêtre pour les notes d'actualité, l'**outil** applique **90 jours** (`FENETRES`). *Une règle
> écrite qui n'est pas la règle exécutée* — la note concernée est [[08-etat-actuel-2026]].

---

## 2. Le cas d'école platiste — la transversale qui n'appartient à aucun cycle

`ecole/cas-d-ecole-platisme-2026-09-14.md` est le **cas transversal** du studio : il n'est rangé
dans aucun cycle parce qu'il sert **le raisonnement**, pas un sujet. Sa structure est celle du
gabarit — ouverture par une parabole, sources **montrées**, séances par niveau, méthode
transférable, pièges, et une section « Ce que ce document ne dit pas » — et ses trois séances
(Cycle 3, Cycle 4, Lycée) portent des titres qui disent la même chose que les cas du vault :
*« Le bâton et l'ombre »*, *« Le même jour, la même heure »*, *« Ce qui peut être mis à l'épreuve »*.

**Pourquoi il est ici, et pas ailleurs** : il applique **exactement** la méthode que
[[exercices-et-controles]] applique aux cinq contradictions — *la question n'est jamais « qui a
raison », mais « laquelle est la mieux sourcée, et pourquoi »*. Sa section « Le lien avec NOUS — et
il est honnête à faire » est le précédent explicite de ce que fait cette note-ci.

> **Ce que le kit Metroid emprunte au cas platiste** : la **forme** (sources montrées, séances par
> niveau, pièges, limites déclarées) et l'**honnêteté du lien** — on dit ce qu'on transfère, on ne
> le suggère pas.

---

## 3. La veille — trois sources Metroid, une seule qui cite ses sources

Le corpus du studio contient **trois sources** sur Metroid, et c'est **leur nature** qui décide de
leur usage :

| Source | Nature | Nomme-t-elle ses sources ? |
|---|---|---|
| `fiches/metroid-goyo-2026-09-13.md` | **avis de joueur** sur le game design | non |
| `fiches/metroid-pourquoi-si-inconnu.md` | **analyse d'audience et de ventes** | non |
| `veille-video/fiches/origines-de-metroid-trois-premiers-jeux.md` (chaîne *Edward*, 17/05/2025) | **documentaire d'histoire du jeu vidéo** | **oui** — un livre, *Tilt* n° 50, *Player One* n° 22, Wikipédia, des interviews |

**C'est la seule des trois sur laquelle des divergences seraient arbitrables** — et l'arbitrage
reste **théorique** : *Tilt* et *Player One* sont des **archives papier** auxquelles cette session
n'a **aucun accès** (voir [[10-histoire-de-la-licence]] § 5).

⚠️ **Et une source qui cite ses sources n'est pas pour autant vérifiée** : les archives citées n'ont
**pas été ouvertes**, la vidéo est **sponsorisée**, et son texte vient d'une **reconnaissance vocale
automatique** (`origines-de-metroid-trois-premiers-jeux`). *C'est la leçon du 14/09, appliquée à la
source qui l'illustre le mieux.*

---

## 4. Arkadia — la mesure, et le verdict

> **Consigne :** *« Arkadia — SEULEMENT SI LE LIEN EST RÉEL. »* La mesure a été refaite
> indépendamment, **trois fois** — et le verdict est le même.

**✅ AUCUN LIEN RÉEL.** Ce n'est pas une absence de recherche, c'est un résultat. Ce qui a été
mesuré :

| Ce qui a été cherché | Résultat |
|---|---|
| Occurrences de « Metroid » dans `arkadia/` (17 `.md`, PDF de 28,6 Mo, transcriptions) | **4 occurrences, un seul fichier** — `CANON-DEADPOOL-ET-DRAGON-BALL-2026-09-14.md`, dans une **liste de franchises refusées** (Zelda, Mario, Pokémon, Metroid). *Une exclusion juridique, pas un lien* |
| Occurrences d'« Arkadia / ArkAdiA / ARKADIA » dans le vault (19 notes) | **1 occurrence** — [[metroid-goyo-2026-09-13]], « de la matière pour le canon d'ArkAdiA ». *Sens unique* |
| « flotte », « cartes immenses », « six Lois », « Kerdien », « galion » dans le vault | **0 occurrence** |
| Renvoi du vault vers `arkadia/`, ou l'inverse | **aucun** |
| Personne, studio, lieu, faction ou artefact commun | **aucun** |

**Ce qui existe, et qu'il ne faut pas confondre avec un lien** :

| Ressemblance | Existe ? | Documentée ? |
|---|---|---|
| **Même genre** (metroidvania) | oui | **oui** — emprunt de genre, licite. `modeles/CADRAGE-site-metroidvania-2026-09-13.md` **dérive d'une fiche Metroid**, à sens unique |
| **Même studio** | non | — |
| **Même personne** | non | — |
| **Même vocabulaire** | partiel | **non** — chez Arkadia, « flotte » désigne des **machines** (Logos, Hammer, Nebuchadnezzar, Arcadia), jamais des Pirates de l'espace ; **le vault ne dit jamais « flotte »**. *Deux référents, un mot* |

**Le seul point de contact nommé a été examiné et REFUSÉ** : `vault-agence/nom-super-metroid-prime-4-2026-09-13.md`
proposait le nom « Super Metroid Prime 4 by ARKADIA Retro Studio », analysé le 13/09/2026 et **refusé**
parce qu'il reprend une **marque de Nintendo**. *Le seul lien qui ait existé fut une tentation de nom,
et le studio y a dit non.*

### 4 bis. ⭐ L'angle mort a été fermé — et c'est une mesure, pas une déclaration

La passe précédente déclarait **un trou** : l'encyclopédie PDF `arkadia/docs-source/Tournelunes-Encyclopedie-Mondes-Kerdiens-Vol.I.pdf`
(**28 618 007 o**) n'avait **pas été ouverte**. Elle l'a été :

| Mesure | Valeur |
|---|---|
| Pages | **78** |
| Caractères extraits | **222 333** |
| Qualité du texte | **français propre et lisible** (contrôle lexical : 1 512 « les », 1 343 « le », 1 244 « la ») |
| Pages sans texte | **3** (pages 2, 24, 50) — **4 images chacune, 0 texte** : des **illustrations** |
| Occurrences de `metroid`, `samus`, `nintendo`, `chozo`, `ridley` | **0 — zéro, pour chacune** |

**Le trou est donc fermé au niveau du texte**, et le verdict « aucun lien réel » en sort **renforcé**.
Ce qui reste ouvert est **précis et minuscule** : *une référence dessinée dans l'une des trois pages
d'illustration serait invisible à une extraction textuelle.* **On ne le comble pas — on le borne.**

---

## 5. Le tableau des sources du vault — mesuré, pas recopié

*Compté le 14/09/2026 sur les tables `## Sources` des notes. Une ligne = une source citée.*

| Note | Sources citées | Lues | **Non lues** |
|---|---:|---:|---:|
| [[01-la-licence]] | 12 | 8 | **4** |
| [[02-la-chronologie-interne]] | 14 | 10 | **4** |
| [[03-les-createurs-et-studios]] | 25 | 22 | **3** |
| [[04-samus-et-les-personnages]] | 11 | 9 | **2** |
| [[05-le-lore]] | 11 | 8 | **3** |
| [[06-les-mecaniques-et-le-genre]] | 16 | 11 | **5** |
| [[07-audience-et-reception]] | 5 | 4 | **1** |
| [[08-etat-actuel-2026]] | 13 | 8 | **5** |
| [[09-annexes-reperes-et-lexique]] | 4 | 2 | **2** |
| [[10-histoire-de-la-licence]] | 2 | 2 | 0 |
| [[dossier-metroid-360]] | 14 | 14 | 0 |
| [[exercices-et-controles]] | 4 | 4 | 0 |
| [[metroid-pourquoi-si-inconnu]] | 3 | 3 | 0 |
| **TOTAL** | **134** | **105** | **29** |

**Ce que ce tableau dit, et qu'aucune note ne disait** : **29 sources sur 134 sont citées sans avoir
été lues.** Ce n'est pas un défaut en soi — *une note peut citer ce qu'elle n'a pas lu, à condition
de l'écrire* — mais **c'est désormais visible**, et c'est ce qui permet de choisir quoi ouvrir
ensuite.

> **Et ce que le tableau ne compte pas** : les notes `00-carte-du-vault`, `INDEX`, `README`,
> `objectifs`, `carnet-de-jeu`, `questions-ouvertes`, `glossaire` et [[metroid-goyo-2026-09-13]]
> **n'ont pas de section « Sources »** — c'est **normal** par leur type (`navigation`, `travail`,
> `outil`, `copie`), sauf pour [[questions-ouvertes]], qui **cite pourtant** des sources dans ses
> tableaux sans les rassembler. *Un manque de forme, pas de fond.*

---

## 6. L'annexe de la vérification R&D — et une correction de chiffre

⚠️ **Ici, on corrige le vault, et c'est mesuré.** Les notes `questions-ouvertes`, `dossier-metroid-360`
et `exercices-et-controles` parlent toutes de **« 43 sources datées »**. **Le compte réel est 44** :

| Mesure de `ecole/metroid-rnd-verifications-2026-09-14.md` | Valeur |
|---|---|
| Lignes | **560** (62 187 caractères) |
| Entrées de source **numérotées** | **44** — n° 1 à 44, réparties en 10 sections, toutes datées du **14/09/2026** sauf mention contraire |
| Occurrences d'URL | **74** |
| URL **distinctes** | **55** |

*La différence tient à peu de chose : l'entrée n° 44 n'est pas une source mais la **passe de
recherche déléguée** — méthode, pas document. « 43 sources + 1 mention de méthode » serait exact ;
**« 43 » tout court est faux de un.*** Corrigé dans les trois notes, **daté**.

### Les quatre points vérifiés, et leurs verdicts

| Point | Question | Verdict du 14/09/2026 |
|---|---|---|
| **P1** | La mort de Ridley : *Super Metroid* (EN) ou *Prime 3* (FR) ? | **TRANCHÉ — contre Wikipédia FR.** Sa source unique (un site personnel `free.fr`) est **morte (404)** |
| **P2** | *Federation Force* : entre les deux premiers *Prime*, ou après *Prime 3* ? | **TRANCHÉ — après *Prime 3***, par la **page produit officielle de Nintendo** (source **primaire**) |
| **P3** | La notoriété de Metroid est-elle mesurée quelque part ? | **TRANCHÉ : non, pas publiquement.** Elle **est** mesurée pour d'autres licences — Metroid et Samus sont **absents de tous les baromètres publics** consultés. La seule mesure existante est **payante** (E-Poll, **995 $**) |
| **P4** | Combien de jeux compte la licence ? | **TRANCHÉ sur la règle, NON TRANCHÉ sur le chiffre unique.** *Il n'existe pas de chiffre unique : il existe des chiffres, chacun avec sa règle* |

**Ce que cette annexe démontre, et qui est le vrai livrable** : *une contradiction n'est presque
jamais deux erreurs. C'est le plus souvent une source qu'on n'a pas ouverte.*

---

## Sources

| Source | Type | Lue ? |
|---|---|---|
| `forge-ia/verifier-kits.mjs` | **code du studio** — lu et **exécuté** le 14/09/2026 | ✅ lu, exécuté |
| `ecole/metroid-rnd-verifications-2026-09-14.md` | vérification à la source du studio, 14/09/2026 | ✅ lu : structure, verdicts P1→P4 et section « Sources » |
| `ecole/cas-d-ecole-platisme-2026-09-14.md` | cas d'école **transversal** du studio | ⚠️ **lu en structure** (titres et plan), **pas en entier** |
| `ecole/kits-pedagogiques-GABARIT-2026-09-14.md` · `ecole/kits-pedagogiques-CYCLE-2026-09-14.md` | gabarit et cycle de la collection | ⚠️ **cités via** `vault-agence/evaluation-zettelkasten-vault-metroid-2026-09-14.md`, non rouverts ici |
| `vault-agence/evaluation-zettelkasten-vault-metroid-2026-09-14.md` | évaluation mesurée de la recommandation Zettelkasten (615 lignes) | ✅ lue **en entier** |
| `arkadia/docs-source/Tournelunes-Encyclopedie-Mondes-Kerdiens-Vol.I.pdf` | création communautaire libre de droit, 78 pages | ✅ **extrait et mesuré** (222 333 caractères) — **0 occurrence de Metroid** |
| `vault-agence/nom-super-metroid-prime-4-2026-09-13.md` | note de décision de nom du studio | ⚠️ cité via la mesure Arkadia, non rouvert ici |
| `veille-video/fiches/origines-de-metroid-trois-premiers-jeux.md` | transcription automatique (chaîne *Edward*) | ✅ cité via [[10-histoire-de-la-licence]], non rouvert ici |

> ⚠️ **RÉSERVE.** Les comptes de sources (§ 5) et les mesures de l'annexe R&D (§ 6) sont des
> **mesures de fichiers**, faites le 14/09/2026 : elles portent sur **cet état** du corpus, et un
> ajout de note les périme. Les faits de méthode, eux, sont **cités**, pas revérifiés.

## Ce que cette note ne dit pas

- **Elle ne vérifie rien de Metroid.** Elle ne rouvre aucune source externe : elle **compte** des
  sources, **cite** des verdicts et **relie** des notes. *Les quatre points vérifiés le sont
  ailleurs, dans l'annexe R&D.*
- **Elle ne dit pas que 29 sources non lues sont un problème.** C'est un **état**, désormais visible ;
  en faire un reproche serait confondre une mesure et un jugement.
- **Elle ne tranche pas la divergence de règle des 30 / 90 jours** : elle la **signale**.
  Corriger un outil du studio n'est pas dans le périmètre de cette passe.
- **Elle ne transforme pas Arkadia en sujet.** Le verdict est **« aucun lien réel »**, et il est
  écrit **parce qu'il est un résultat** — *pas pour ouvrir un chantier qui n'existe pas.*
- **Elle ne déclare pas l'angle mort Arkadia entièrement fermé.** Trois pages d'illustration
  (4 images chacune, 0 texte) restent hors d'une extraction textuelle : **borné, pas comblé.**
- **Elle ne fournit aucune œuvre protégée** — ni image, ni extrait, ni fichier.

---

*GL Digital Lab — 14/09/2026. Note transversale de méthode : elle relie le kit Metroid à l'outil du
studio, au cas d'école platiste et à la veille, donne le **tableau des sources mesuré** (134 citées /
105 lues / 29 non lues) et l'**annexe de la vérification R&D** (44 entrées numérotées, 74 URL). Le
lien Arkadia↔Metroid a été **mesuré trois fois** : **aucun lien réel**, angle mort textuel **fermé**.*
