# La langue du code — où le français s'arrête, et pourquoi

> **Écrit le 28/09/2026**, sur une demande de Gaëtan : *« Et les communications internes
> en français aussi bordel ! »*
> ⚠️ **La règle existait déjà** (`AGENTS.md` § 0 et § 6) — mais elle parle des *documents*.
> **Elle ne disait nulle part quoi faire du CODE**, et c'est là que le manque était.

---

## Le constat, mesuré avant d'écrire quoi que ce soit

⛔ **On ne corrige pas une règle sur une impression.** Mesure du 28/09/2026 sur les
**188 fichiers `.mjs`/`.js`** de `forge-ia/` :

| ce qu'on y trouve | nombre | en quelle langue |
|---|---|---|
| noms de variables et de fonctions | 4 788 | **français** (`bilan`, `resultats`, `chercher`, `resoudreCarnet`) |
| chaînes affichées, messages, verdicts | ~90 % accentuées | **français** |
| **mots-clés du langage** | **8 957** | **anglais — et non traduisibles** |
| noms de variables anglais (`the`, `get`, `result`) | **101** | anglais — *ceux-là sont à corriger* |

⭐ **Conclusion de la mesure, et elle est nuancée** : le français est **déjà** la langue de
notre code, pour tout ce qui **nous appartient**. Les 8 957 occurrences anglaises sont
`const`, `let`, `function`, `return`, `await`, `catch`, `console.log` — **la grammaire de
JavaScript**. Les traduire casse le programme.

⇒ ⛔ **Ce qui manquait n'est pas une correction : c'est une FRONTIÈRE ÉCRITE.**
*Sans frontière, chacun juge à sa main — et un agent suivant écrira légitimement
`console.log("No results found")` sans savoir qu'il vient de sortir du français.*

---

## LA RÈGLE

> ### **Tout ce que nous écrivons est en français. Ce que la machine exige reste tel quel.**

### ✅ EN FRANÇAIS — sans exception

| quoi | pourquoi |
|---|---|
| **Commentaires** | c'est nous qui parlons |
| **Messages affichés** (`console.log`, erreurs, verdicts) | c'est lu par un humain |
| **Noms de fichiers et de dossiers** | `epreuve-rag.mjs`, pas `rag-test.mjs` |
| **Noms de fonctions et de variables** | `resoudreCarnet()`, `bilan`, `extraits` |
| **Noms de commits** | écrit par nous, lu par nous |
| **Contenu des `throw`** | c'est un message, pas un identifiant |

### ⛔ EN ANGLAIS — et ce n'est pas une entorse, c'est une contrainte

- **Les mots-clés du langage** : `const`, `let`, `function`, `return`, `if`, `await`,
  `catch`, `throw`, `class`, `import`, `export`.
- **Les API des bibliothèques** : `console.log`, `JSON.stringify`, `fetch`, `readFileSync`,
  `addEventListener`, `querySelector`.
- **Les valeurs protocolaires** : `POST`, `application/json`, `utf-8`, `true`, `null`.
- **Les identifiants imposés par un tiers** : noms de modèles, de collections, variables
  d'environnement, en-têtes HTTP.

⭐ **Le test, en une question** :
> **Si je renomme ça, est-ce que quelque chose casse ?**
> *Oui ⇒ c'est de l'anglais, et on n'y touche pas. Non ⇒ c'est à nous, donc en français.*

---

## Les faux amis — là où la règle se joue vraiment

⚠️ **Trois cas qui ne se tranchent pas au feeling, et où je me suis trompé ou j'ai hésité :**

1. **Un nom d'API à l'intérieur d'un nom français.**
   `function lireFichier()` ✅ — mais `fs.readFileSync()` dedans reste anglais.
   *Le nom est à nous, l'appel est à eux.*
2. **Un identifiant qui vient de la DONNÉE, pas du code.**
   `CARNETS['Vault-ARKADIA']` — c'est le nom réel d'une collection.
   ⛔ **On ne le traduit pas** : le traduire casse la recherche. *Ce n'est pas notre mot.*
3. **Un terme technique sans équivalent courant.**
   `commit`, `JSON`, `GPU`, `token`, `prompt`, `mjs`.
   ✅ `AGENTS.md` § 6 les autorise explicitement — **on les garde tels quels.**

---

## Ce qui reste à faire, et ce n'est pas cosmétique

| # | action | état |
|---|---|---|
| ① | **Cette règle entre dans `lois-de-latelier.md`** — *une règle qui vit dans un document isolé ne sera pas lue* | ⬜ **à faire** |
| ② | Corriger les **101** noms de variables anglais repérés dans `forge-ia/` | ⬜ **à faire, par lots, avec assertion** |
| ③ | Vérifier que le **site** ne contient aucun libellé anglais visible | ⬜ à mesurer |

⚠️ **POURQUOI ② N'EST PAS FAIT TOUT DE SUITE, ET IL FAUT LE DIRE** :
renommer une variable dans 188 fichiers est **exactement** le genre de remplacement
programmatique à l'aveugle que la **loi n° 2** interdit sans assertion. *« Un remplacement
sans assertion est un remplacement à l'aveugle »* — **payé trois fois en une nuit.**
⇒ Ça se fait **par lots**, avec un test qui passe **avant** et **après**, lot par lot.

⛔ **Et surtout : renommer ne change aucun comportement.** Le bénéfice est la lisibilité.
*On ne casse pas un outil qui marche pour une question de style non mesurée.*

---

## ⭐ La leçon, et elle dépasse la langue

> **Une règle appliquée mais non écrite n'existe pas.**
> Le code était en français — **à 90 %** — mais **rien ne le disait**. Donc rien ne
> l'imposait, et le prochain fichier pouvait partir en anglais sans que personne
> puisse dire « c'est une entorse ».
> *Une règle non écrite ne se transmet pas : elle se réinvente à chaque session.*

⚠️ **Et le corollaire, qui est la partie honnête** : quand on m'a dit « c'est en anglais »,
**j'ai d'abord mesuré** — et la mesure a dit « c'est déjà en français, sauf ce qui ne peut
pas l'être ». ⛔ **Je n'ai pas dit « oui tu as raison » pour faire plaisir.**
*Un agent qui acquiesce sans mesurer fabrique une correction inutile — et c'est exactement
le défaut que ce studio a payé cinq fois aujourd'hui.*
