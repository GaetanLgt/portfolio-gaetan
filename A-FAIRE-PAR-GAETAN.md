# À FAIRE PAR GAËTAN — passation du 10/09/2026

> Court exprès. Trois actions de cinq minutes, puis cinq décisions. Tout le
> reste est fait et commité.

---

## ⚠️ BANDEAU DE CORRECTION — 22/09/2026

> **Ce document a été corrigé le 22/09/2026 par un audit à 360°, et une de ses
> affirmations était la plus dangereuse du dépôt.**
>
> Il dit, dans sa troisième action : **« Le site n'est pas déployé. Il tourne en
> local. »** ⛔ **C'est faux depuis un moment, et il le dit dans la même page,
> douze lignes plus bas** : le workflow `deploy.yml` **publie automatiquement au
> push sur `main`** (mesuré : `on: push: branches: [main]`).
>
> ⭐ **Pourquoi c'est la plus dangereuse** : quelqu'un qui ouvre ce document
> pour savoir où en est le site lit « pas déployé » et agit en conséquence —
> alors que **pousser, c'est publier**. *Une porte d'entrée qui rassure à tort
> coûte plus cher qu'une porte fermée.*
>
> | Ce qu'il disait | La vérité mesurée le 22/09/2026 |
> |---|---|
> | « **Le site n'est pas déployé.** Il tourne en local » | `deploy.yml` **publie au push sur `main`** (FTP o2switch) — le fichier se contredit lui-même à la ligne 49 |
> | « Poids : **878 Ko** » | **340,1 Ko** servis pour la page la plus lourde (relevé de build du 22/09, seuil 1024 Ko) |
> | « 0 échec sur **4 pages** » | le prérendu rend **32 pages** — relevé du 22/09 : « 32 route(s) au routeur, 32 à rendre, 32 fichiers écrits » |
> | `cd C:\Users\neosp\code\portfolio-gaetan` | **c'est la SECONDE copie du dépôt, et ce n'est PAS celle de travail.** Mesuré le 22/09/2026 : elle est à `b4ba149` (19/09, **209 commits**), contre **`5a6b133`** (22/09, **224 commits**) pour `C:\IA\portfolio-gaetan` — soit **15 commits de retard**. ⛔ **Ne rien y supprimer** : c'est une décision du dirigeant, pas d'un agent |
>
> ⛔ **Rien n'a été supprimé en silence** : les phrases fausses sont conservées
> sous `⛔ FAUX`, avec la mesure qui les contredit.
>
> ⚠️ **Et ce document reste daté du 10/09/2026.** Il décrit une passation
> précise ; **ce n'est pas la liste des choses à faire d'aujourd'hui.**

---

## Les trois choses que je ne peux pas faire à ta place

### 1. Le vrai chiffre de performance (30 secondes)

J'ai mesuré Lighthouse six fois : **le navigateur sans interface de cette
machine n'utilise pas la carte graphique**, et les scores oscillent de 45 à 61
sur un code identique. Je ne peux donc pas te dire si le site tient ta cible
« Lighthouse ≥ 95 ».

Dans **ton Chrome**, avec ta 3080 : `F12` → onglet **Lighthouse** → Analyser.
Regarde surtout **« Other »** dans le détail du fil principal : s'il dépasse
quelques centaines de millisecondes, le tir est à jeter et il faut recommencer.

- Si c'est bon → on peut assumer la scène 3D.
- Si c'est mauvais → je dégrade au premier chargement (pas de post-traitement ni
  de modèles tant que le visiteur n'a pas interagi).

### 2. Regarde le site (2 minutes)

**Je n'ai jamais vu ce site.** Le modèle que j'exécute ne lit pas les images.
J'ai mesuré des pixels, des contrastes, des poids — je n'ai pas d'yeux.

| Page | Adresse |
|---|---|
| Accueil (le concept) | http://localhost:4173/ |
| Dossier professionnel | http://localhost:4173/dossier |
| Offre | http://localhost:4173/services |
| Contact | http://localhost:4173/contact |

Si le serveur d'aperçu s'est arrêté : ⛔ **le chemin ci-dessous est celui de la
SECONDE copie du dépôt, en retard de 15 commits** — utiliser
`C:\IA\portfolio-gaetan` :
```bash
cd C:\Users\neosp\code\portfolio-gaetan   # ⛔ FAUX — seconde copie, 15 commits de retard
cd C:\IA\portfolio-gaetan                 # ✅ le dépôt de travail
npx vite preview --port 4173
```

Ce que je te propose de regarder en priorité : **le hero** (les six unités
générées), **le fond d'écran** (déjà appliqué), et **la section du vaisseau**.

### 3. Le feu vert de déploiement

⛔ **FAUX — corrigé le 22/09/2026. Ce paragraphe disait : « Le site n'est pas
déployé. Il tourne en local. »** C'était **déjà contredit douze lignes plus bas
dans ce même document** : le workflow `deploy.yml` **publie automatiquement au
push sur `main`** — mesuré le 22/09/2026, `on: push: branches: [main]`,
déploiement FTP vers o2switch.

⭐ **La conséquence est celle qu'il fallait lire d'abord : pousser, c'est
publier.** Il n'y a **pas** de préproduction, pas d'étape intermédiaire. *Un
`git push` de sauvegarde part en ligne.*

⚠️ **Et ce document parlait de la production comme d'une « ancienne version
intacte » au 19/09** : entre-temps, **15 commits ont été poussés** (mesuré :
`5a6b133`, 22/09). Le « feu vert » demandé ici **a donc déjà été donné**, et la
question qui reste n'est plus « faut-il déployer » mais **« qu'est-ce qui est
parti en ligne, et depuis quand »**. C'est une question de mesure, pas de
décision — et elle n'est pas tranchée dans ce document.

> ⛔ La phrase d'origine est conservée ci-dessus parce qu'elle documente
> l'histoire du dépôt — et parce que c'est **la plus dangereuse qu'il
> contenait** : quelqu'un qui ouvrait ce fichier pour savoir où en était le
> site lisait « pas déployé » et agissait en conséquence.

⚠️ **ATTENTION — LE PIÈGE À CONNAÎTRE** : le workflow
`.github/workflows/deploy.yml` **déploie automatiquement en production à chaque
push sur `main`** (via FTP, avec les secrets `FTP_SERVER`, `FTP_USERNAME`,
`FTP_PASSWORD` déjà configurés côté GitHub).

Autrement dit : **pousser, c'est déployer.** Il n'y a pas d'étape intermédiaire,
pas de préproduction. Si tu fais un `git push` pour sauvegarder ton travail ou
par réflexe, la refonte part en ligne immédiatement.

État vérifié le 10/09/2026 :

| | |
|---|---|
| Dépôt distant | `github.com/GaetanLgt/portfolio-gaetan.git` |
| Branche locale | **30 commits en avance** sur `origin/main` |
| Push effectué | **aucun** — la production est intacte |
| Site en ligne | `gldigitallab.fr` — toujours l'ancienne version |

**Trois façons de procéder, à ton choix :**

1. **Pousser sur une branche** (`git push origin main:refonte-arkadia`) pour
   sauvegarder sans rien déployer, puis fusionner quand tu as validé.
2. **Pousser sur main** quand tu es prêt : le déploiement se fait tout seul en
   quelques minutes, et la refonte remplace l'ancienne vitrine.
3. **Déployer à la main en FTP** si tu préfères garder la main sur le moment —
   le contenu à envoyer est dans `dist/`, **sans oublier `dist/api/contact.php`**
   (c'est le formulaire auto-hébergé ; sans lui, le formulaire de contact ne
   fonctionne plus).

Dans tous les cas : après déploiement, **teste le formulaire de contact pour de
vrai** et vérifie que l'e-mail arrive. Il a été testé en local, où l'expédition
échoue faute de serveur mail — **l'envoi réel n'a jamais été confirmé**.

---

## Cinq décisions qui t'appartiennent

| # | Décision | Contexte |
|---|---|---|
| 1 | **Le nom « SEUIL »** | Proposé par le directeur artistique. **Non appliqué** — il faut une recherche INPI (classes 9, 35, 42), les domaines `.fr`/`.com`, et un dépôt via un conseil en propriété industrielle. |
| 2 | **ARKADIA pour le réseau social ET le vaisseau** | L'audit externe recommande de réserver ARKADIA au produit et de donner au poste un identifiant technique. Le goal actuel en fait le nom du vaisseau. Risque de confusion de marque. |
| 3 | **Citer les œuvres** (Matrix, TRON, Evangelion, Cyberpunk, Albator) | L'audit recommande de ne jamais les nommer dans un support commercial. Aujourd'hui ils vivent dans nos documents **internes** — c'est défendable — et le site n'en nomme aucun. À faire valider par un juriste PI. |
| 4 | **Le budget de 100 000 €** | Ne doit jamais apparaître sur le site (recommandation du directeur artistique). C'est le cas aujourd'hui. |
| 5 | **Le mode sobre et le dossier** | Livrés. Dis-moi s'ils te convainquent ou s'il faut les retoucher. |

---

## Ce qui est livré

- **Le concept** : MND × Matrix × TRON × Evangelion × Cyberpunk × ALBATOR, récit
  « l'IA fait irruption dans notre monde », vocabulaire de bord, chantier naval.
- **Les six unités 3D sont réellement générées** : image SDXL → TRELLIS.2 →
  allègement. **408 Ko pour les six**, contre 938 Ko pour les anciennes
  fabrications maison.
- **Cinq expériences signature** : démarrage mesuré, poste (Grille TRON, console,
  post-traitement), balayage de transition, terminal déterministe, dossier sobre.
- **Le pavillon** hissé aux seuls moments de décision.
- **Le mode sobre** : un interrupteur coupe tous les effets. C'est un argument de
  vente pour les collectivités.
- **Le formulaire de contact est auto-hébergé** : Formspree a été retiré, plus
  aucun transfert de données hors UE.
- **Poids : 878 Ko** mesurés (verrou du mégaoctet tenu). Contrastes : 31 paires
  mesurées, toutes conformes. Accessibilité structurelle : 0 échec sur 4 pages.

> ⛔ **FAUX — corrigé le 22/09/2026.** Les trois chiffres de cette phrase sont
> périmés, et l'écart n'est pas une virgule :
>
> | Ce qui était écrit | Mesure du 22/09/2026 |
> |---|---|
> | « Poids : **878 Ko** » | **340,1 Ko** servis pour la page la plus lourde (relevé de build, seuil 1024 Ko) |
> | « 0 échec sur **4 pages** » | le prérendu rend **32 pages** — « 32 route(s) au routeur, 32 à rendre, 32 fichiers écrits » |
> | « le verrou du mégaoctet tenu » | ✅ **toujours vrai** — mais il ne couvrait que le HTML : **2,72 Mo de 3D livrée** ne figuraient dans aucun verrou (voir `scripts/verifier-poids-3d.mjs`, écrit le 22/09/2026) |
>
> ⭐ **Un chiffre écrit à la main devient faux sans le dire** : celui-ci l'était
> devenu. Les valeurs vivantes sont **mesurées à chaque build**, jamais recopiées.

## Ce qui n'est PAS fait ou pas prouvé

- **Lighthouse ≥ 95** : non démontrable ici (voir point 1).
- **Opquast ≥ 90 %** : jamais passé règle par règle.
- **Awwwards** : jamais soumis.
- **Contenu sans JavaScript** : seulement partiel — un bloc `noscript` donne les
  prix et le contact, mais le site reste une application montée côté client.
  Le vrai correctif serait du rendu côté serveur.
- **Audio diégétique** : non fait, seule expérience signature manquante.
- **Plan de continuité, sauvegardes, réversibilité contractuelle** : rien de
  formalisé. C'est le point le plus lourd de l'audit externe.
- **Références clients nominatives** : aucune. C'est écrit noir sur blanc sur
  `/dossier`.

---

## Les documents à lire si tu veux aller au fond

| Document | Ce qu'il contient |
|---|---|
| `modeles/decisions-concept-flagship-d5.md` | la doctrine du chantier, **avec la section « ce qui n'est PAS démontré »** |
| `modeles/d5-direction-artistique-claude.md` | la direction artistique complète (17 sections) |
| `forge-ia/notebooklm-arkadia/` | le package d'analyse critique (8 documents, dont l'audit externe) |
| `docs/mesurer-la-performance.md` | pourquoi les scores Lighthouse varient, et comment mesurer correctement |
| `docs/faux-positif-lighthouse-contraste.md` | un faux positif prouvé par les pixels, avec la liste de ce qui a été tenté |
