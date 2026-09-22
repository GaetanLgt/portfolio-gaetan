# L'ATELIER STANDARD — mode d'emploi, mesures, et ce qu'il ne prouve pas

> Créé le **22/09/2026**, refait le même jour après mesures. Machine : **EVA-01**.
> Docker Desktop 4.92.0, moteur **29.8.0**, conteneurs `linux/amd64`, noyau
> **6.18.33.2-microsoft-standard-WSL2**.
>
> **Ce conteneur CONSTRUIT le site portfolio ET le vérifie. Il ne l'héberge pas.**
> La production reste **o2switch, sous Apache, réglé par `public/.htaccess`**, déployé par
> FTP depuis la CI (`.github/workflows/deploy.yml`). Changer d'hébergeur est une décision du
> dirigeant, pas la nôtre.
>
> ⛔ **Ce document ne recopie pas le `Dockerfile`** : les raisons détaillées de chaque paquet
> épinglé sont écrites là-bas, en face de la ligne qui l'installe. Ici, on dit **quand s'en
> servir, ce que ça donne, et ce que ça ne prouve pas.**

---

## 1. LA COMMANDE UNIQUE — c'est LA façon de construire, désormais

```bat
conteneur\construire.cmd
```

Double-cliquable. Ou, si `docker` est déjà dans le `PATH` :

```bash
docker compose run --rm -T build
```

> `-T` : pas de pseudo-terminal. Sans lui, `docker compose run` refuse de démarrer quand la
> sortie n'est pas un terminal (« the input device is not a TTY ») — donc dans un script, une
> tâche de fond, ou un agent. **Une mesure doit pouvoir se rejouer sans être attachée à une
> fenêtre.**

Cette commande enchaîne, **dans cet ordre, et rien d'autre** :

| # | Ce qu'elle fait | Pourquoi c'est là |
|---|---|---|
| 1 | recopie l'arbre **monté** (`/atelier`) dans `/app` | pour qu'une correction soit prise en compte **sans reconstruire l'image** |
| 2 | **vide `dist/`** | un build ne doit jamais mesurer le `dist` du précédent |
| 3 | `npm ci` — **ou dit pourquoi elle le saute**, empreinte à l'appui | voir § 4 |
| 4 | les **7 étapes** du build, nommées une par une | c'est la chaîne de la CI, pas `npm run build` (voir § 5) |
| 5 | `node scripts/auditer-tout.mjs` — **tous** les verrous, un seul passage | un verrou jamais lancé n'est pas un verrou |
| 6 | l'**empreinte SHA-256** du `dist/`, son nombre de fichiers, un `resume.json` validé par `jq` | la mesure qui se relit |

### ⭐ Le lanceur Windows a été éprouvé **sans `docker` dans le `PATH`**

C'était l'une des frictions payées : sur ce poste, `docker` n'est **pas** dans le `PATH` des
shells (le binaire est sous `C:\Program Files\Docker\Docker\resources\bin`), et sans ce
dossier `docker pull` échoue sur `docker-credential-desktop not found`. Le lanceur le remet.

Éprouvé le 22/09/2026 dans un shell où **`Get-Command docker` rendait faux** :

```
docker dans le PATH ? False
[atelier] docker compose run --rm -T build
  commit       : 2f8b766 — Mise en place — 14 verrous tenus, et tout ce qui suit est mesure
  fichiers dans dist/ : 299
  VERDICT : VERT — les 15 verrous sont tenus,
            299 fichiers dans dist/, 188 pages HTML.
[atelier] VERDICT : VERT - le site est construit ET les verrous sont tenus.
CMD: code=0 duree=97s
```

⭐ **Et le français accentué du conteneur s'affiche JUSTE dans la console Windows** — c'est
`chcp 65001` qui le permet, et c'est pour ça qu'il reste dans le lanceur. Voir § 14, point 6 :
ce même `chcp` **cassait** le fichier tant qu'il contenait des accents.

### ⛔ Pas de `exit 0` nulle part, et c'est le point le plus important de ce fichier

Une version précédente terminait par `exit 0` « pour ne pas casser la mesure ». Ce `exit 0`
**masquait aussi le code de sortie du build** : `docker compose run` annonçait un succès sur
un build en échec.

**Éprouvé le 22/09/2026, exprès**, en retirant `npm` du conteneur :

```
  → code du build : 1  |  durée : 18 s
  ⛔ AUDIT NON LANCÉ : le build est en échec (code 1).
ROUGE: code=1                 ← le code est bien remonté jusqu'au shell appelant
```

Et **l'audit n'est pas lancé sur un `dist/` amputé**, volontairement : le faire crierait
quinze verrous pour **une seule** cause, et on chercherait ensuite quinze pannes au lieu
d'une. Le message le dit, et donne le chemin du tableau des 7 étapes.

### Ce qui reste possible sur Windows, et c'est tout

```bat
docker compose up serve      rem  puis http://localhost:8088
```

**Regarder, et éditer.** On ne construit plus à la main sur le poste : plus de PowerShell,
plus de port 4178 pris sur la machine, plus de CRLF qui part en production.

---

## 2. LA CHAÎNE D'OUTILS — chaque paquet, sa version, et sa raison

Tout ce qui suit est **épinglé en version**, et chaque version a été **relevée le
22/09/2026 dans l'image de base** :

```bash
docker run --rm <image de base> bash -c "apt-get update -qq && apt-cache policy <paquet>"
```

| Paquet | Version épinglée | Une fois installée | ⭐ Pourquoi |
|---|---|---|---|
| `node` (image de base, figée par **digest**) | `node:22.21.1-bookworm-slim@sha256:25b3eb23…a3ae2c` | Node **v22.21.1** · npm **10.9.4** | la CI déclare `NODE_VERSION: '22'` — un tag **mouvant** |
| `chromium` | `153.0.8010.52-1~deb12u1` | Chromium **153.0.8010.52** | `prerendre.js` PILOTE un navigateur (CDP) : sans lui, 32 pages prérendues perdues |
| `git` | `1:2.39.5-0+deb12u3` | git **2.39.5** | ⛔ **le poste ne l'a PAS dans le `PATH`.** Et le site publie son commit (§ 6) |
| `ffmpeg` (contient `ffprobe`) | `7:5.1.9-0+deb12u1` | ffmpeg/ffprobe **5.1.9** | ⭐ **cause mesurée du plafond qui ne bornait rien** (§ § 2bis) |
| `python3` | `3.11.2-1+b1` | Python **3.11.2** | les outils du studio (`prenom.py`, `mesure-glb.py`, MND) sont en Python |
| `python3-pip` | `23.0.1+dfsg-1` | pip **23.0.1** | installer une dépendance Python |
| `python3-venv` | `3.11.2-1+b1` | venv **3.11.2** | ⚠️ `pip install` en direct **échoue** (PEP 668) : mesuré, et c'est voulu |
| `ripgrep` | `13.0.0-4+b2` | ripgrep **13.0.0** | ⭐ **la commande unique s'en SERT** : elle extrait le verdict de l'audit par motif et **échoue si le motif est absent** |
| `jq` | `1.6-2.1+deb12u2` | jq **1.6** | ⭐ **la commande unique s'en SERT** : `resume.json` est **validé** (`jq -e .`) avant d'être rendu |
| `rsync` | `3.2.7-1+deb12u6` | rsync **3.2.7** | c'est **la pièce qui fait tenir le montage** (§ 3) |
| `bsdmainutils` | `12.1.8` | `column` (util-linux **2.38.1**) | pour `column -t`, qui aligne le tableau des 7 étapes. Sans lui la ligne échoue en silence (`|| cat`) : *un outil absent ne fait pas de bruit, il dégrade.* |
| `curl` | `7.88.1-10+deb12u15` | curl **7.88.1** | les sondes de l'atelier (`curl -sS http://127.0.0.1:8088/`) |
| `ca-certificates` | `20250419~deb12u1` | — | sans lui, `npm ci` échoue sur le registre HTTPS |

### ⭐ Tout ce qui est ajouté est ÉPINGLÉ — une image `latest` n'est pas reproductible

Le studio a déjà payé ce prix avec `ubuntu-latest`. Ici, **chaque paquet porte sa version**.
⚠️ Et une version épinglée qui disparaît du dépôt **fait ÉCHOUER la construction,
franchement** — c'est voulu : un échec visible vaut mieux qu'une dérive silencieuse.

⚠️ **Reproductibilité PARTIELLE, et il faut le dire** : l'image de base et tous les paquets
sont épinglés, mais leurs **dépendances transitives** suivent le dépôt du jour. Une
reproductibilité **stricte** exigerait un dépôt snapshoté (`snapshot.debian.org`) — ce n'est
pas fait.

### ⭐ Et l'image FAIT PARLER ses outils avant de se déclarer construite

Un binaire présent mais cassé (bibliothèque manquante, mauvais lien) ne se verrait qu'au
milieu d'un build de trois minutes. La construction refuse donc d'aboutir si l'un d'eux ne
répond pas. Sortie réelle de la couche :

```
--- node  : v22.21.1 / npm 10.9.4
--- git   : git version 2.39.5
--- ffmpeg: ffmpeg version 5.1.9-0+deb12u1
--- ffprobe: ffprobe version 5.1.9-0+deb12u1
--- python: Python 3.11.2 / pip 23.0.1
--- rg    : ripgrep 13.0.0
--- jq    : jq-1.6
--- rsync : rsync  version 3.2.7  protocol version 32
--- column: column from util-linux 2.38.1
--- chrome: Chromium 153.0.8010.52 built on Debian GNU/Linux 12 (bookworm)
```

### 2 bis. ⭐ Un outil qui EXISTE n'est pas un outil qui MARCHE — l'épreuve

Rejouable : `conteneur/outils-epreuve.sh`. Résultat du 22/09/2026 — **0 épreuve en échec** :

```
──── 1. LES OUTILS SE PRÉSENTENT
  ffmpeg    /usr/bin/ffmpeg     ffmpeg version 5.1.9-0+deb12u1
  ffprobe   /usr/bin/ffprobe    ffprobe version 5.1.9-0+deb12u1
──── 2. ⭐ ffmpeg FABRIQUE UN MÉDIA DE DURÉE CONNUE, ffprobe LA LIT
  ✔ mire fabriquée : /tmp/mire.mp4 (8.0K)
  durée lue par ffprobe : 3.000000
  ✔ ffprobe LIT une durée : 3.000000 s (attendu 3)
──── 3. python3, ET LE PIÈGE PEP 668
  ✔ python3 exécute du code, pas seulement --version
  ✔ python3 -m venv fonctionne et pip répond DANS le venv
──── 4. ripgrep ET jq FONT LE TRAVAIL POUR LEQUEL ILS SONT LÀ
  ✔ jq lit une valeur dans un JSON   ✔ rg extrait un compte par motif
──── 5. LES ACCENTS SURVIVENT AU TRAJET
  relu : Vérification : éàüç, « citer n est pas utiliser », 和誠美実動私
  ✔ les accents sont intacts dans le système de fichiers
```

⛔ **POURQUOI `ffprobe` EST LA LIGNE QUI COMPTE.** Sur le poste, `ffmpeg` et `ffprobe` sont
**absents du `PATH`** : la durée des médias valait **0**, et le plafond de 180 minutes ne
bornait **rien**. *Un plafond qui ne peut pas lire une durée ne borne rien : il rassure.*

---

## 3. ⭐ LE DÉPÔT EST **MONTÉ**, PAS COPIÉ — et **en lecture seule**

`C:\IA\portfolio-gaetan` → `/atelier` (`ro`). `rsync` recopie cet arbre dans `/app` en
**3 secondes** à chaque exécution — donc **une correction est prise en compte sans
reconstruire l'image**. Mesuré : 160 fichiers / 2,0 Mo (sans `.git`), puis 383 / 26,6 Mo,
puis 535 — le même travail ; l'arbre grandit avec les trois agents qui y travaillent.

### ⛔ POURQUOI `:ro`, ET LA MESURE QUI LE JUSTIFIE

La chaîne de build **RÉÉCRIT l'arbre de travail** : `public/sitemap.xml`, `public/Arche/`,
`public/TARDIS/JoF/` et `src/data/etat-studio.json`. Mesuré : **153 fichiers VERSIONNÉS**
sont sous ces chemins (`git ls-files`). Les faire réécrire par un Linux depuis un conteneur,
c'est **modifier l'arbre de travail de Gaëtan** — et sous Windows, où `core.autocrlf=true`,
c'est aussi mélanger les fins de ligne.

**Éprouvé, pas supposé** — on a rouvert le défaut exprès :

```
$ docker compose run --rm -T build sh -c 'echo test > /atelier/PREUVE-ECRITURE'
cannot create /atelier/PREUVE-ECRITURE: Read-only file system
→ le fichier existe-t-il sur le poste ?  NON
```

⚠️ **Ce que ça coûte, et il faut le savoir** : les fichiers réécrits par le build vivent dans
le conteneur. Pour comparer le `dist` du conteneur et celui du poste, on compare les
**empreintes**, pas les arbres.

⚠️ **Le `.git` n'est pas dans l'image** (`.dockerignore` l'exclut : 29 Mo d'historique n'ont
rien à faire dans une image). Il est en revanche **synchronisé à chaque exécution** — § 6.

---

## 4. `npm ci` : exécuté, ou **sauté avec sa mesure affichée**

```
  npm ci est SAUTÉ, et voici la mesure qui le permet :
    l'image a installé cet arbre AVEC CE LOCK-LÀ (empreinte identique :
    e7ca98449a932617), et `node_modules/.bin/vite` est exécutable.
```

L'image grave à sa construction l'empreinte SHA-256 de `package-lock.json`
(`/opt/atelier/empreinte-package-lock.txt`). À chaque exécution, la commande unique compare
avec celle de l'arbre **monté** : si elles sont identiques **et** que
`node_modules/.bin/vite` est exécutable, refaire `npm ci` ne changerait pas un octet —
`npm ci` est déterministe sur un lock, qui porte les empreintes d'intégrité.

**Pour la forcer quand même** : `FORCER_NPM_CI=1`. Elle s'exécute d'elle-même si
`node_modules` manque, si `vite` a disparu, ou si le lock a changé.

> ⚠️ C'est un écart au « toujours `npm ci` », et il est **affiché à chaque exécution** —
> jamais silencieux. Mesure du 22/09/2026 : `npm ci` complet = **291 paquets en 49 s**.

---

## 5. Le build : **la chaîne de la CI**, pas `npm run build`

⭐ **Mesuré dans `.github/workflows/deploy.yml`, et ce n'est pas cosmétique** : la CI
**n'appelle pas `npm run build`**. Elle exécute les sept étapes explicitement, parce que
`npm run build` a **échoué en CI le 22/09/2026** sans que GitHub puisse nommer la commande
coupable — on a perdu du temps à **deviner**.

L'atelier reproduit donc la chaîne **réelle** de la production, une seule fois, dans
`conteneur/etapes-build.sh`. `NODE_ENV=production` est posé **pour le build seulement**,
comme la CI (le `Dockerfile` ne peut pas le poser globalement : cela ferait sauter les
devDependencies dont `vite build` a besoin).

### Les sept étapes, mesurées (exécution du 22/09/2026 à 13:50, seule)

```
etape                                                      code  duree_s  dist_fichiers  html  Arche  TARDIS
1. prebuild — relever l'état du studio (generer-etat.mjs)  0     1        0              0     0      0
2. sitemap — generer-sitemap.mjs                           0     0        0              0     0      0
3. ecole — publier-ecole.mjs                               0     0        0              0     0      0
4. arche — generer-arche.mjs                               0     0        0              0     0      0
5. vite build — compilation des 144 modules                0     15       267            156   5      146
6. prerendre — 32 routes rendues par Chrome                0     38       299            188   5      146
7. postbuild — releve final dans le HTML prerendu          0     3        299            188   5      146
  étapes en échec : 0
  fichiers dans dist/ : 299
```

⚠️ **« vite build — compilation des 144 modules » est un libellé faux, et il n'est pas de
nous.** Vite annonce `✓ 211 modules transformed`. Le titre de l'étape a été **écrit à la
main** dans `conteneur/etapes-build.sh` (hérité) et **personne ne le recalcule** — exactement
la loi « un chiffre écrit à la main devient faux sans le dire ». **On le signale ici plutôt
que de le corriger en silence** : c'est du texte d'affichage, pas une mesure.

---

## 6. ⭐ LE SITE PUBLIE SON PROPRE COMMIT — donc `.git` est synchronisé

La page `/etat-du-studio` affiche le commit de la construction qui vient de finir, et
`scripts/generer-etat.mjs` le lit avec `git`. **Sans `.git`, le conteneur écrivait
« commit : non mesuré »** — donc le site construit ici aurait été **différent** de celui que
la CI déploie, sur une donnée que le site affiche.

`rsync` synchronise donc `.git` à chaque exécution : **380 fichiers, 29 Mo, 6 secondes**.
Ce que ça donne, mesuré :

```
  commit vu par git dans /app : 2f8b766
  git status (arbre)          : 14 fichier(s) modifié(s)
  commit       : 2f8b766 — Mise en place — 14 verrous tenus, et tout ce qui suit est mesure
```

### ⛔ ET IL A FALLU UN RÉGLAGE GIT, TROUVÉ EN MESURANT

Sans réglage, dans le conteneur, `git status` répondait **« 352 fichiers modifiés » sur un
arbre PROPRE**. Les causes ont été **séparées par la mesure** :

| Réglage | « modifications » |
|---|---|
| tel quel | **352** |
| `core.fileMode=false` | **352** ← *déjà* `false` dans ce dépôt : **hypothèse testée, et fausse** |
| `core.autocrlf=false` | **352** |
| `core.autocrlf=input` | **13** ← la vraie cause |

La cause est celle que le studio connaît déjà, sous son autre face : **le poste a
`core.autocrlf=true` et écrit du CRLF, quand l'index de git porte du LF**. Un conteneur Linux
ne peut comparer que s'il **normalise à la lecture** — `core.autocrlf=input`, posé
`--system` dans l'image. Les 13 restants sont de **vraies** différences : le travail en cours
de trois agents, plus le relevé que le build vient de réécrire.

---

## 7. ⭐⭐ LE PORT 4178 NE COLLISIONNE PLUS — la preuve, mesure à l'appui

C'est **le** défaut qui a coûté le plus cher : deux builds simultanés se tuaient en
`EADDRINUSE`, `dist/` ressortait amputé, et les mesures n'étaient plus reproductibles. La
cause : `scripts/prerendre.js` prend le port **FIXE 4178** sans vérifier s'il est libre.

### a) DEUX BUILDS COMPLETS, SIMULTANÉS — les deux sont verts

Lancés en parallèle le 22/09/2026, deux `docker compose run` sur le **même dépôt monté** :

| | Run A | Run B | Run C (seul, témoin) |
|---|---|---|---|
| étiquette | `A` | `B` | `C` |
| conteneur | `8a22fb753bd3` | `9d280dc62938` | — |
| code du build | **0** | **0** | **0** |
| verrous | **15 / 15 tenus** | **15 / 15 tenus** | 15 / 15 tenus |
| `dist/` | **299 fichiers, 188 pages** | **299 fichiers, 188 pages** | 299 / 188 |
| code global | **0** | **0** | **0** |
| **temps total** | **111 s** (114 s mur) | **109 s** | **86 s** (88 s mur) |

⛔ **LE TEMPS RÉEL, ET IL FAUT LE DIRE : deux builds concurrents sont PLUS LENTS.** +25 s et
+23 s, soit **+29 % et +27 %**. Ils se partagent le même processeur (vite + Chromium × 2).
*Un build simultané n'est pas gratuit — il est seulement possible.*

### b) L'ISOLATION DU PORT, MESURÉE SUR CETTE MACHINE

> ⚠️ **Chaque conteneur a son propre espace réseau** — deux `prerendre` sur 4178 dans deux
> conteneurs différents ne se voient pas. **Ça se vérifie, ça ne se déduit pas.**

Le 22/09/2026, **trois** écouteurs sur `127.0.0.1:4178` **en même temps** : deux conteneurs
(`conteneur/port-4178.mjs`, qui reproduit la ligne exacte de `prerendre.js`) et **le poste**.

```
port-x  Up 6 seconds          ← conteneur X
port-y  Up 6 seconds          ← conteneur Y
POSTE : ecoute ETABLIE sur 127.0.0.1:4178
[db1cd8f491cc] ecoute ETABLIE sur 127.0.0.1:4178   → 20 s sans collision, code 0
[6811e7b65ae2] ecoute ETABLIE sur 127.0.0.1:4178   → 20 s sans collision, code 0
--- netstat (le poste) ---
  TCP    127.0.0.1:4178    0.0.0.0:0    LISTENING    46676     ← UN SEUL, celui du poste
```

**Ce que ça prouve** : les ports des conteneurs **ne sont pas publiés** (`docker-proxy`
n'apparaît pas). Le 4178 d'un conteneur est **invisible depuis Windows**, et réciproquement —
le poste a pris le même port **pendant** que les deux conteneurs buildaient, **sans gêner ni
l'un ni l'autre**.

⚠️ **Ce qui n'a PAS été fait, et pourquoi** : pas de **build complet sur le poste** pendant
les conteneurs. La raison est mesurable : le build du poste réécrit **153 fichiers
versionnés** (`public/Arche`, `public/TARDIS/JoF`, `sitemap.xml`, `src/data/etat-studio.json`)
— et **deux autres agents travaillent dans cet arbre en ce moment**. J'ai donc reproduit
**exactement** l'occupation de port (`TcpListener` sur `127.0.0.1:4178`), qui est le seul
mécanisme en cause. **Le reste est déduit, et signalé comme déduit.**

### c) Ce qui rend deux exécutions simultanées possibles

- **aucun `container_name`** : deux conteneurs du même nom ne peuvent pas coexister ;
- **aucun volume nommé partagé** — et le `dist/` est **vidé avant** de construire ;
- **aucun port publié** par le service de build ;
- **une sortie par exécution** : `ETIQUETTE=A` et `ETIQUETTE=B` → deux dossiers distincts.

---

## 8. Le `dist` du build précédent ne peut plus être mesuré

**Un volume nommé persistait d'une exécution à l'autre.** La version précédente partageait
`dist-construit` entre le build et le serveur de test. Mesure : un build pouvait compter et
empreinter le `dist` du **précédent**, et se déclarer vert sans rien avoir produit.

Le volume est supprimé, et le script **vide `dist/` avant de construire**.

**Éprouvé en rouvrant le défaut exprès** — un `dist/` est pré-rempli d'un leurre :

```
--- 2. LE DIST REPART DE ZÉRO ---
  dist/ avant nettoyage : 1 fichier(s)
  ⚠️ il y AVAIT un dist : c'est exactement ce qui faisait mesurer le
     build précédent. Il vient d'être supprimé, exprès.
  dist/ après nettoyage : 0 fichier(s)
```

---

## 9. ⭐ LE `dist` N'EST **PAS** REPRODUCTIBLE OCTET POUR OCTET — cause trouvée

⚠️ **Ce paragraphe corrige une affirmation trop rapide.** On lisait, dans la version
précédente de ce document : « 302 fichiers dans le conteneur = 302 en local, écart 0 ».
C'est un **compte**, pas une comparaison de **contenu**. Le contenu, lui, a été comparé ici.

Trois exécutions du **même commit**, le même jour :

| Run | empreinte du manifeste | chunk d'index | `horodatage_iso` |
|---|---|---|---|
| A | `e2dedc7faeebb819` | `index-Bg4rX5AI.js` | `2026-09-22T13:46:57.917Z` |
| B | `2b1b5323cd850bab` | `index-3R9ofHts.js` | `2026-09-22T13:46:57.936Z` |
| C | `02a69bbf3e7da764` | `index-DlaM083O.js` | `2026-09-22T13:50:39.990Z` |
| D | `af992c3caa8f4593` | — | (via `conteneur\construire.cmd`, 97 s) |

**Quatre exécutions, quatre empreintes.** Ce n'est pas une instabilité : c'est la même cause,
et les horodatages ISO le montrent — ils diffèrent **par les millisecondes**.

**64 fichiers diffèrent, et la chaîne causale est mesurée, pas supposée :**

1. `scripts/generer-etat.mjs` écrit `horodatage_iso` **avec les millisecondes** dans
   `src/data/etat-studio.json` ;
2. ce JSON est **importé** par l'application, donc **inliné dans le chunk JS** — vérifié :
   `…horodatage_iso:"2026-09-22T13:46:57.917Z"…` est **dans** `index-Bg4rX5AI.js` ;
3. **2 caractères** suffisent à changer le **hash** du chunk, donc **son nom de fichier** ;
4. chaque chunk importe l'index par son nom → **31 chunks** changent de nom ;
5. chaque page HTML référence ces noms → **33 pages** changent.

**31 + 33 = 64.** Le compte tombe juste, et la neutralisation le confirme : en ne gardant que
les *noms*, il ne reste **que 2 caractères** d'écart — `917` contre `936`.

⛔ **CONSÉQUENCE, ET ELLE EST IMPORTANTE : l'empreinte du `dist` n'est PAS un critère de
reproductibilité pour ce site.** Elle identifie **une exécution**. Ce qui est comparable d'une
exécution à l'autre, c'est le **nombre de fichiers (299)** et le **nombre de pages (188)** —
et ceux-là sont stables sur les trois runs.

**Le correctif ne nous appartient pas** : il appartient à `scripts/generer-etat.mjs` (hors
périmètre — nous ne l'avons pas touché). Deux voies, à trancher par Gaëtan : arrondir
`horodatage_iso` à la seconde, ou ne pas l'inclure dans le JSON importé. **On ne le fait pas
en silence : c'est une décision, pas une correction d'orthographe.**

---

## 10. ⛔ BLENDER — **MESURÉ, PAS PROMIS**

Le studio construit ses modèles dans Blender (`MND\30-rnd\galion\*.py`). Un atelier standard
qui ne saurait pas lancer Blender serait **à moitié fait**. Voici ce qui a été **lancé**, et
ce qui ne l'a pas été.

### a) La pile GPU du poste — **franchissable**, et elle est mesurée

| Ce qu'on croyait devoir installer | Ce qui est mesuré sur EVA-01 |
|---|---|
| `nvidia-container-toolkit` | ⭐ **déjà enregistré** : `docker info` liste le runtime **`nvidia`** (`nvidia-container-runtime`) |
| `--gpus all` | ⭐ **fonctionne** : `nvidia-smi` **dans un conteneur** rend la carte |
| le pilote NVIDIA côté WSL2 | ⭐ présent : noyau `6.18.33.2-microsoft-standard-WSL2` |

```
$ docker run --rm --gpus all nvidia/cuda:12.4.1-base-ubuntu22.04 nvidia-smi
| NVIDIA-SMI 615.71.08    KMD Version: 616.92    CUDA UMD Version: 13.4 |
|   0  NVIDIA GeForce RTX 3080     ...     2504MiB / 10240MiB  ...      |
```

⚠️ **Aucun de ces trois points n'était acquis** : ils ont été **lancés**, un par un, avant
d'être écrits ici.

### b) Blender headless — **lancé, et il tourne**

Le chemin éprouvé (rejouable : `conteneur/blender-epreuve.sh`) est **l'archive Linux
officielle, épinglée par version et par empreinte** — pas une image `latest` d'un tiers :

```
  archive   : blender-4.2.1-linux-x64.tar.xz   →  352 032 920 octets
  SHA-256   : be0fbaa0c1e52d4552023220b4c67351efbb707cac49bb381fcbee2182447005
  1,3 G une fois décompressé
  Blender 4.2.1 LTS (hash 396f546c9d82 built 2024-08-19)  →  --background --version, code 0
```

⭐ **Et le GPU est vu DEPUIS Blender, pas seulement depuis `nvidia-smi`** — c'est la question
qui compte, et elle a été posée à Cycles :

```
  CYCLES-DEVICE NVIDIA GeForce RTX 3080 | type=CUDA | use=True
  CYCLES-DEVICE 11th Gen Intel Core i7-11700KF | type=CPU | use=False
  CYCLES-COMPUTE NONE
```

⚠️ **NUANCE QUI COMPTE : `compute_device_type` vaut `NONE`.** Le périphérique est **détecté et
utilisable**, mais la préférence **n'est pas réglée** : un rendu CUDA exige de la passer à
`CUDA` au préalable. Ce n'est pas un blocage, c'est une étape.

### c) ⛔ ET LE PIÈGE DU CODE DE SORTIE, **reproduit dans le conteneur**

> **`blender.exe` rend le code 0 MÊME quand un script lève une assertion** (mesuré 6 fois le
> 22/09/2026, côté poste). **Le journal est le seul critère de succès de cet outil.**

Éprouvé **dans le conteneur**, avec un script Python qui lève une `AssertionError` :

```
  a) sans --python-exit-code :
     code de sortie = 0                      ← ⛔ IL NE DIT RIEN
     occurrences dans le journal : 2         ← le message, lui, est là
  b) avec --python-exit-code 7 :
     code de sortie = 7                      ← ⭐ et là, il dit
```

⭐ **Le remède existe et il est nommé : `--python-exit-code <n>`.** Dans le conteneur comme
dehors, **c'est le journal qu'on lit** — et maintenant, on peut aussi exiger le code.

### d) ⛔ CE QUI N'A **PAS** ÉTÉ FAIT, ET IL FAUT LE DIRE AINSI

**Aucune image Blender n'a été construite ni livrée.** Ce qui est prouvé, c'est que **rien ne
manque techniquement** : GPU visible dans le conteneur, Blender headless qui tourne, CUDA
détectée par Cycles. Ce qui reste est un **empaquetage** : figer l'archive 4.2.1 (352 Mo,
empreinte ci-dessus) dans une image, avec `--gpus all`. **Je ne promets pas un `Dockerfile`
que je n'ai pas lancé** — je dis exactement où en est la mesure.

---

## 11. LES ÉPREUVES SONT REJOUABLES (et elles sont dans le dépôt)

| Épreuve | Ce qu'elle prouve |
|---|---|
| `conteneur/outils-epreuve.sh` | la chaîne d'outils **fait son travail** (ffprobe lit une durée, venv, jq/rg, accents, kanji) |
| `conteneur/blender-epreuve.sh` | Blender headless tourne **et** le piège du code de sortie est reproduit |
| `conteneur/etapes-build.sh` | les 7 étapes, une par une, avec compte de fichiers après chacune |
| `conteneur/comparer-dist.ps1` | compare deux `dist/` (⚠️ lire § 9 avant de conclure) |
| `docker compose run --rm -T etapes` | diagnostic seul : où la chaîne casse |

```bash
# Diagnostic des 7 étapes, sans les verrous ni l'empreinte
docker compose run --rm -T etapes

# Forcer une réinstallation complète des dépendances
FORCER_NPM_CI=1 docker compose run --rm -T build

# Deux exécutions isolées, en parallèle
ETIQUETTE=A docker compose run --rm -T build &
ETIQUETTE=B docker compose run --rm -T build &
```

---

## 12. OÙ SONT LES MESURES, ET POURQUOI ELLES NE SONT PLUS DANS LE DÉPÔT

Par défaut, les rapports sortent **hors du dépôt**, dans
`..\_mesures-conteneur\atelier\<étiquette>\` :

| Fichier | Ce qu'il contient |
|---|---|
| `journal-construire-et-verifier.txt` | **tout** ce que la commande a dit |
| `build-etapes.txt` | le tableau des 7 étapes (TSV : nom, code, durée, comptes) |
| `audit-verrous.txt` | la sortie brute de `auditer-tout.mjs` |
| `empreinte-dist.txt` | **299 lignes** de SHA-256, un par fichier du `dist/` |
| `empreinte-apres-etapes.txt` | la même, prise juste après les 7 étapes |
| `resume.json` | le résumé machine (codes, comptes, durées, commit) — **validé par `jq`** |
| `dist/` | le site construit, prêt à être servi |
| `rsync.log`, `npm-ci.log`, `jq-erreur.txt` | les journaux de détail |

⚠️ **POURQUOI PLUS DANS LE DÉPÔT** : les relevés de la version précédente
(`rapports-conteneur/`) sont **VERSIONNÉS** (`git ls-files` les liste). Y verser la sortie de
chaque build ferait apparaître des fichiers non suivis dans l'arbre de travail — donc **du
bruit dans le `git status` de tous ceux qui travaillent sur ce dépôt**. *Une sortie de build
n'est pas une source.* `SORTIE` permet de choisir ailleurs.

---

## 13. ⛔ CE QUE CE CONTENEUR NE PROUVE PAS

1. **Il ne prouve pas que `.htaccess` fonctionne.** Le service `serve` recopie les en-têtes de
   sécurité dans `conteneur/nginx.conf` : ils **s'affichent**, mais rien ne prouve que le
   `.htaccess` **d'o2switch les envoie**. La production reste o2switch, sous Apache.
2. **Il ne prouve pas que ce qui est construit sera déployé.** Le déploiement, c'est
   `.github/workflows/deploy.yml`, par FTP, sur un coureur **Ubuntu** — donc avec sa propre
   version de Chrome et son propre `apt`.
3. **Il ne prouve rien sur la machine de Gaëtan**, sauf là où c'est écrit : le build est
   `linux/amd64`, avec des chemins Linux. Les scripts qui lisent un chemin Windows **se
   sautent en le disant** — mesuré, pas silencieux :
   `(vault Metroid non accessible — génération de /Arche/ sautée)`.
4. **Il ne prouve pas que le site livré est complet** : `public/Arche/` (5 fichiers) et
   `public/TARDIS/JoF/` (146 fichiers) sont **versionnés**. Si l'étape qui les produit se
   saute, le build **réussit quand même** et sert les fichiers d'hier.
5. **L'empreinte du `dist` ne prouve pas la reproductibilité** — voir § 9, c'est mesuré.
6. **`scripts/prerendre.js` prend toujours le port FIXE 4178** sans vérifier qu'il est libre.
   Ce n'est plus un problème **dans un conteneur** (réseaux isolés, § 7), mais ça reste un
   défaut **sur le poste**. ⛔ **Il n'a pas été modifié** : un autre agent venait de le réparer
   ailleurs et le build en dépendait. **Signalé, pas touché.**

---

## 14. Ce qui a été corrigé pendant cette session de mesure

Chacun de ces points a été **payé par une mesure**, pas par une intuition :

1. **Le `dist` du build précédent** pouvait être mesuré (volume nommé partagé) → le `dist` est
   vidé avant de construire, et un leurre a été posé exprès pour le prouver.
2. **`LC_ALL=C` global** dans le script → hypothèse testée, **fausse** : le défaut est resté.
3. **La vraie cause du tableau illisible : la locale ABSENTE** → `LANG=C.UTF-8` dans l'image.
   *Trois réglages mesurés (`rien`, `C`, `C.UTF-8`), un seul rend le français propre.*
4. **`git status` faux dans le conteneur** (352 modifications sur un arbre propre) → cause
   trouvée en séparant les hypothèses : `core.autocrlf=input`, pas les bits de permission.
5. **Le site ne pouvait pas nommer son commit** (« non mesuré ») → `.git` synchronisé (6 s),
   et le commit est maintenant dans le HTML livré.
6. **`chcp 65001` + accents dans un `.cmd`** → cmd.exe **exécutait les commentaires** comme
   des commandes (`'shells' n'est pas reconnu…`). Le lanceur Windows est désormais **en ASCII
   pur**, et la raison est écrite dedans.
7. **Le nom du réseau** (`portfolio-build`) venait du projet précédent et faisait râler
   Compose → `portfolio-atelier`.
8. **Les comptes de verrous écrits à la main** (« les 14 verrous ») → **calculés**, parce
   qu'un **15ᵉ verrou** (`verifier-injection.mjs`) est apparu dans l'arbre pendant la session,
   et que le script s'y est adapté tout seul.

---

## 15. L'ÉTAT, EN QUATRE LIGNES

```
portfolio-gaetan-build:local   1,77 Go
base  node:22.21.1-bookworm-slim@sha256:25b3eb23…a3ae2c
apt   152 s (317 paquets, 304 Mo téléchargés)  ·  npm ci 291 paquets en 49 s
run   86 s seul · 111 s à deux · 299 fichiers · 188 pages · 15/15 verrous · code 0
```

**Un build rouge est rouge, et il remonte.**
