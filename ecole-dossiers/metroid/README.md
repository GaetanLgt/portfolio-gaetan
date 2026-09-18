---
tags: [metroid, vault, convention]
date: 2026-09-14
statut: note de travail
---

# 🎮 Vault Metroid — porte d'entrée

> **Créé par Gaëtan le 14/09/2026.** Rangé par GL Digital Lab le même jour, sur la consigne :
> *« tu organises tes connaissances et nos objectifs avec — proprement, sans déchets ».*

---

## 1. Ce que ce vault est, et ce qu'il n'est pas

| | |
|---|---|
| **Ce que c'est** | Un **espace de lecture et de travail** sur Metroid : ce qu'on a appris, ce qui reste ouvert, et ce qu'on veut en faire |
| **Ce que ce n'est pas** | ⛔ **Un second dépôt documentaire.** Les fiches de veille y sont **copiées** depuis le dépôt de l'agence — *elles ne sont pas réécrites ici* |
| **Sa nature technique** | ⚠️ Il vit dans **OneDrive** — donc **synchronisé chez Microsoft** |

> ### ⚠️ Deux règles, et elles ne sont pas négociables
>
> **1. Aucune donnée client ici.** Ce vault est personnel et synchronisé vers un service tiers.
> La règle du studio — *« une donnée qui entre par une API distante est une donnée sortie de la
> machine »* — s'applique. **Un nom de client, un document client, un extrait de dossier n'ont rien
> à y faire.**
>
> **2. La source canonique est le dépôt, pas ce vault.** Les fiches de `fiches/` sont des **copies
> de lecture** ; elles portent une signature et un index dans le dépôt de l'agence. *Si une fiche
> change, elle change **là-bas**, puis on recopie ici.* **Sinon, deux vérités divergent en silence** —
> et c'est exactement ce que « sans déchets » veut éviter.

---

## 2. La convention — où va quoi

| Dossier / fichier | Ce qu'on y met | Ce qu'on n'y met pas |
|---|---|---|
| **[[00-carte-du-vault|00-carte-du-vault.md]]** | La **carte** : par où entrer selon la question qu'on se pose — et **les trois questions qu'une carte doit traiter** (de quoi ça parle · ce qui est établi · ce qui reste, **et à qui**) | Du contenu |
| **`01-` → `08-`** (racine) | **La vue 360°** : huit notes de référence **écrites à la source** — licence, chronologie, créateurs, personnages, lore, mécaniques, audience, état actuel | Des notes recopiées d'ailleurs sans source |
| **`09-` → `11-`** (racine, *ajoutées le 14/09/2026*) | **Les notes d'appui** : **annexes** (repères, versions, lexique des studios, abandons) · **histoire de la licence comme objet** (industrie, marchés, échecs) · **sources et méthode** (méthode de vérification, cas platiste, veille, verdict Arkadia, tableau des sources, annexe R&D) | Du savoir neuf : *elles **compilent** et **relient**, elles ne découvrent pas* |
| **`dossier-metroid-360.md`** | Le **dossier** : ce qui se donne à lire, **par niveau** — c'est lui qu'on ouvre devant une classe | Des faits qui ne sont pas dans les notes |
| **`exercices-et-controles.md`** | Les **questions, leurs réponses, leurs renvois — et le barème** (seuil 60 %) — dont le bloc **lore** ajouté le 14/09 | Des questions sans réponse, *et un contrôle sans barème* |
| **`glossaire.md`** | Les termes **du sujet** *et* les termes **de méthode** | Des définitions que personne n'emploie |
| **`fiches/`** | Les fiches de veille **copiées du dépôt**, telles quelles | Des notes réécrites à la main |
| **`objectifs.md`** | **Nos objectifs** — ce qu'on veut faire de tout ça | Des intentions non décidées *(la colonne « à décider » existe pour ça)* |
| **`questions-ouvertes.md`** | Ce qui **résiste** : les contradictions **tranchées le 14/09**, les doutes de transcription, les vérifications **qui restent à faire** | Des réponses supposées |
| **`carnet-de-jeu.md`** | **Les parties** : ce qu'on a joué, trouvé, chronométré | Des impressions de joueur sans mesure |
| **[[INDEX|INDEX.md]]** | L'état du vault : quelles notes existent, de quand, dans quel état | Le contenu lui-même |

**Et rien d'autre.** *Un dossier qu'on remplit de tout devient un dossier qu'on ne relit pas.*

### 2 bis. Ce vault est le **kit pilote** de la collection école

Depuis le 14/09/2026, il sert de **cobaye** au gabarit des kits pédagogiques
(`ecole/kits-pedagogiques-GABARIT-2026-09-14.md`). **Un kit complet a six éléments**, et voici où
ils vivent ici :

| Élément | Où | État |
|---|---|---|
| **1 · La matière réelle** | les notes `01` → `08`, écrites à la source | ✅ |
| **2 · Le parcours par niveau** | [[dossier-metroid-360|dossier-metroid-360.md]] — CP·CE1 → 3e | ✅ |
| **3 · Les sources montrées** | la section `Sources` de chaque note — **et désormais le tableau consolidé** de [[11-sources-et-verification]] § 5 (**134 citées / 105 lues / 29 non lues**) | ✅ |
| **4 · Les contrôles notés** | [[exercices-et-controles|exercices-et-controles.md]] — **barème et seuil à 60 %**, **36 items** depuis l'ajout du bloc lore | ✅ |
| **5 · Le glossaire** | [[glossaire|glossaire.md]] | ✅ |
| **6 · La page publiable** | générée **depuis ce vault** vers l'espace non répertorié du site | 🟡 en test |

**Le contrôle du kit** : `node forge-ia/verifier-kits.mjs` — il mesure les critères comptables
(sources, réserves, limites, barème, renvois morts, glossaire, fraîcheur des notes). *Il ne dit rien
de la qualité pédagogique : elle se valide par un enseignant, et **aucune séance n'a encore été
testée devant un élève**.*

⚠️ **Ce qu'il ne mesure pas non plus** : les critères **7 et 8** du gabarit (poids < 1 Mo,
accessibilité) sont annoncés « passe finale » — **6 critères sur 8 sont mesurés par machine**
([[11-sources-et-verification]] § 1 bis).

---

## 3. D'où vient ce qu'il y a ici, et avec quelles réserves

Les deux fiches de `fiches/` reposent sur des **transcriptions automatiques** (Whisper local), donc :

- **les noms propres sont approximatifs** — la transcription déforme (« hit software » pour *id
  Software*, « Junpei Yukoi » pour le créateur de Metroid, « la biérantique » là où le contexte
  appelle « aventure ») ;
- **aucune source externe n'a été consultée** : les fiches rapportent **ce que les vidéos
  affirment**, elles ne le valident pas ;
- et **les deux vidéos se contredisaient sur deux points** — c'est écrit, daté, et **✅ TRANCHÉ le
  14/09/2026** → [[questions-ouvertes|questions-ouvertes.md]] § 1.
  ⚠️ *Cette ligne disait « non tranché » : **périmé**, corrigé le 14/09/2026. Les deux points sont
  tranchés — et **aucune des deux vidéos n'avait tort** : l'une donnait la date japonaise, l'autre la
  sortie occidentale ; l'une parlait de la critique, l'autre du marché.*

⚠️ **Et une réserve ajoutée le 14/09/2026, plus forte que les deux autres** : [[10-histoire-de-la-licence]]
repose sur **une seule source** — une vidéo dont le studio n'a lu que les **sous-titres automatiques**,
**sponsorisée**, et dont les archives citées (*Tilt* n° 50, *Player One* n° 22, un livre) **n'ont pas
été ouvertes**. *Ses chiffres ne se citent pas en classe.* Le détail est écrit dans la note.

---

## 4. Comment on écrit ici

- **Français**, accents compris (règle du studio).
- **Un fait porte sa source et sa date**, ou il est marqué « non vérifié ».
- **Les liens internes** utilisent la syntaxe Obsidian : `[[questions-ouvertes]]`.
- **Un lien dit pourquoi il est là** — *une liste de noms sans raison est une liste qu'on ne suit pas.*
- **Rien n'est inventé pour remplir une page.** *Une note vide mais honnête vaut mieux qu'une note
  qui a l'air renseignée.* **Et un trou se déclare** : voir l'angle mort Arkadia, borné dans
  [[11-sources-et-verification]] § 4 bis.

---

*GL Digital Lab — 14/09/2026. Ce vault est une copie de lecture : **le dépôt de l'agence reste la
source**. Corrigé le 14/09/2026 : contradictions tranchées, trois notes d'appui ajoutées, 36 items
au contrôle.*
