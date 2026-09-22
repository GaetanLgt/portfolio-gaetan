# Le conteneur de build — mode d'emploi, et ce qu'il prouve

> Créé le **22/09/2026**. Machine : EVA-01. Docker Desktop 4.92.0, moteur 29.8.0, `linux/amd64`.
>
> **Ce conteneur CONSTRUIT le site et permet de le REGARDER. Il ne l'héberge pas.**
> La production reste **o2switch, sous Apache, réglé par `public/.htaccess`**, déployée
> par FTP depuis la CI. Changer d'hébergeur est une décision du dirigeant, pas la nôtre.

---

## 1. À quoi ça sert

Deux usages, et ils ne se confondent pas.

**a) Rendre le build reproductible.** Une image épinglée par digest, `npm ci` sur un
`package-lock.json` figé, un Chromium épinglé : le même arbre produit le même site,
sans dépendre de ce qui est installé sur le poste.

**b) Révéler ce qui est collé à Windows.** C'est l'usage qui a le plus servi. Le studio a
des scripts qui lisent des chemins de cette machine ; dans un conteneur Linux ces chemins
n'existent pas. Le conteneur **avoue** donc ce que le poste cache. Voir § 4.

---

## 2. Mode d'emploi

```bash
# Construire l'image (une fois, ou après un changement de dépendances)
docker compose build

# Construire le site et écrire le rapport d'étapes
docker compose run --rm build

# Servir le résultat et le REGARDER
docker compose up serve      # puis http://localhost:8088
```

Les mesures sortent dans `rapports-conteneur/` :
- `build-etapes.txt` — le tableau des 7 étapes, code, durée et compte de fichiers (TSV) ;
- `empreinte-dist.txt` — le SHA-256 de chaque fichier de `dist/`, **la mesure qui compte** ;
- `etapes.txt` — la sortie brute, quand on la demande.

**Vérifié le 22/09/2026, de bout en bout, avec ce fichier** (`docker compose v5.5.1`) :

```
docker compose config          → code 0, services reconnus : build, serve
docker compose build           → code 0, image construite
docker compose run --rm build  → code 0, 7/7 étapes vertes
                                 rapports-conteneur/build-etapes.txt   481 o
                                 rapports-conteneur/empreinte-dist.txt 33 795 o
docker compose up -d serve     → code 0, http://localhost:8088
```

Raccourci utile : `docker compose run --rm build sh /app/conteneur/etapes-build.sh` refait
le build sans reconstruire l'image.

> ⚠️ **`docker compose up serve` CONSTRUIT AUSSI.** Le service `serve` déclare
> `depends_on: build` : Compose démarre donc `build` d'abord, qui construit puis se
> termine. C'est voulu — nginx ne sert jamais un `dist/` qu'on n'a pas construit — mais
> il faut le savoir avant de lancer `serve` « juste pour regarder ».

> ⚠️ **`dist/` vit dans un volume nommé** (`dist-construit`), jamais dans le `dist/` du
> poste : le build conteneur n'écrase pas le build local, et l'inverse est vrai aussi.
> **Conséquence à connaître** : le volume PERSISTE entre deux `run`. L'étape `prebuild`
> mesure donc le `dist/` du build **précédent** — c'est le comportement prévu par le
> studio, mais **pour un vrai test de reproductibilité il faut repartir d'un volume
> vide** : `docker volume rm portfolio-gaetan-build_dist-construit`, ou passer par
> `docker run` sur des conteneurs neufs (c'est ce qui a été fait pour les mesures du § 5).

---

## 3. Le tableau des étapes — mesuré

Arbre de référence : commit `5a6b133` (14:50), extrait par `git archive`, plus les
livrables de ce conteneur. Image `portfolio-head:local`, 7 étapes, `VAULT_METROID`
volontairement absent.

| # | étape | code | durée | `dist/` | HTML | `Arche` | `TARDIS` |
|---|-------|------|-------|---------|------|---------|----------|
| 1 | `prebuild` — `generer-etat.mjs` | 0 | 0 s | 0 | 0 | 0 | 0 |
| 2 | `sitemap` — `generer-sitemap.mjs` | 0 | 0 s | 0 | 0 | 0 | 0 |
| 3 | `ecole` — `publier-ecole.mjs` | 0 | 1 s | 0 | 0 | 0 | 0 |
| 4 | `arche` — `generer-arche.mjs` | 0 | **0 s** | 0 | 0 | 0 | 0 |
| 5 | `vite build` | 0 | 16 s | 273 | 156 | 5 | 146 |
| 6 | `prerendre` | 0 | 35 s | 302 | 185 | 5 | 146 |
| 7 | `postbuild` | 0 | 1 s | 302 | 185 | 5 | 146 |

**Les sept étapes passent.** Le build complet tient en ~60 s dans le conteneur, contre
~52 s sur le poste (même arbre).

### Ce qui passe sans les chemins Windows

- **`ecole` passe, et c'est une bonne surprise.** Le brief de départ annonçait que
  `publier-ecole.mjs` casserait : il contient bien un chemin Windows en dur
  (`C:\IA\gl-digital-lab\ecole\dossiers-pedagogiques`), **mais ce chemin n'est pas la
  source** — c'est le *témoin* d'un contrôle de divergence, et tout son usage est
  enveloppé dans un `existsSync`. La source publiée est `ecole-dossiers/`, **dans le
  dépôt**. Le comportement a été mesuré : l'étape sort en **code 0**, publie 146 fichiers
  vers `public/TARDIS/JoF/`, et affiche son avertissement quand le dépôt du studio est
  absent. *Le chemin en dur était un faux positif du brief.*
- **`sitemap` passe** : il lit `src/config/topographie.js` et n'a pas besoin de `dist/`.
- **`vite build` et `prerendre` passent** — à condition que Chromium soit dans l'image
  (voir § 6, c'est la seule vraie dépendance système).

### Ce qui est sauté EN SILENCE — et la preuve

**`arche` sort en code 0 en 0 seconde : il n'a rien généré.** `generer-arche.mjs`
ligne 40 fait `process.exit(0)` quand le vault est absent. Le build est donc **vert**.

Et comme `public/Arche/` (5 fichiers) est **versionné dans le dépôt**, ces 5 fichiers
sont recopiés dans `dist/` : **le `dist/` contient quand même 5 pages `/Arche/`**, et rien
ne signale qu'elles n'ont pas été produites ce jour-là. Le mensonge est parfait.

**Le test qui le prouve** (`conteneur/` → lancé dans le conteneur) : on retire
`public/Arche/` **avant** le build.

```
AVANT : public/Arche dans le conteneur : 5 fichiers versionnés
public/Arche RETIRE. On construit.
...
  → CODE 0 (succès)  0s  |  dist:297 fichiers  html:180  Arche:0  TARDIS:146
    Verrous de la signature qualité      code 0
    Poids du premier chargement          code 0
    Requêtes du premier chargement       code 0
    Topographie du site                  code 0
    Contact livré au visiteur            code 0
... le dossier dist/Arche existe : NON
```

**Résultat : le build réussit entièrement, 7 étapes vertes, les 5 verrous à code 0 — et
il manque 5 pages.** `297` fichiers au lieu de `302`, le dossier `/Arche/` n'existe pas.

> ⭐ *Un build qui réussit en produisant moins de pages est plus dangereux qu'un build qui
> échoue.* Ici il est vert de bout en bout, et **aucun des verrous ne le voit**.

**Ce que ça change pour aujourd'hui :** le vault du poste et la copie versionnée
`public/Arche/` sont **identiques** — vérifié fichier par fichier, les 5 pages sont les
mêmes après normalisation des fins de ligne. Le saut ne produit donc **pas** de contenu
périmé en ce moment. Il produira du périmé **le jour où le vault bougera sans qu'on
recopie `public/Arche/`** — et ce jour-là, personne ne sera prévenu.

---

## 4. Les nombres de fichiers de `dist/` — local contre conteneur

| build | arbre | `dist/` | HTML |
|-------|-------|---------|------|
| Local, Windows | copie du commit `5a6b133` | **302** | 185 |
| Conteneur, build n° 1 | même copie | **302** | 185 |
| Conteneur, build n° 2 | même copie | **302** | 185 |
| Conteneur, `public/Arche` vidé | même copie | **297** | 180 |

**L'écart local ↔ conteneur est de 0 fichier.** Le conteneur ne perd rien, tant que les
artefacts versionnés sont là.

Détail de la comparaison local ↔ conteneur (hashes de chunks neutralisés) :

- **236 fichiers identiques** (nom et contenu) ;
- **38 fichiers** ne diffèrent que par le **nom** d'un chunk (renommage Vite) ;
- **28 fichiers** ont un contenu réellement différent :
  - **`assets/EtatStudioPage.js`** + **22 pages HTML** → cause unique : **l'horodatage** (§ 5) ;
  - **5 pages `Arche/`** → uniquement des **fins de ligne** (voir la limite, § 6).

---

## 5. Deux builds donnent-ils le même `dist/` ? NON — et on sait pourquoi

Deux builds dans deux conteneurs neufs, même image, même arbre, à une minute d'écart :

```
build 1 : 302 lignes d'empreinte, manifeste F683ED299357552D…
build 2 : 302 lignes d'empreinte, manifeste 66E78AE5B867C312…
lignes différentes : 122
```

**Même nombre de fichiers, contenu différent.** Décomposition mesurée :

- 271 chemins communs, dont **30 au contenu différent** ;
- **31 fichiers portent un nom différent dans chaque build** (62 renommages).

Puis, en neutralisant les noms de chunks pour ne garder que les vraies différences :

- **241 fichiers identiques**, **38 changements de nom seuls**, **23 vraies causes**.

**La cause racine, isolée et prouvée : un horodatage.**

```
EtatStudioPage-CHFzyTOh.js  (build 1) contient : 2026-09-22 15:05
EtatStudioPage-CYH8X4sb.js  (build 2) contient : 2026-09-22 15:06
```

La chaîne est mécanique, et elle se lit dans le code :

1. `generer-etat.mjs` (hook `prebuild`) mesure le studio et écrit
   `src/data/etat-studio.json` — **avec l'heure du build dedans** ;
2. `vite build` embarque ce JSON dans le chunk `EtatStudioPage-*.js` → **son hash change
   à chaque minute** ;
3. le chunk principal `index-*.js` contient `__vite__mapDeps`, la liste des noms de tous
   les chunks — donc **son contenu change aussi**, et son nom avec ;
4. les 22 pages HTML qui référencent `index-*.js` changent à leur tour.

> **Une minute d'écart suffit à changer 122 lignes sur 302.**
> Le critère du studio — *« deux lancements avec la même graine donnent le même monde »* —
> **n'est pas tenu aujourd'hui.** Ce n'est pas un défaut de Linux ni du conteneur : le
> même phénomène existe sur le poste. C'est le relevé horodaté qui entre dans le bundle.

**Ce serait corrigeable** (retirer l'horodatage du bundle, ou le dériver du commit plutôt
que de l'horloge), mais **ce n'est pas à ce conteneur d'en décider** : le relevé horodaté
est une intention éditoriale de la page `/etat-du-studio`. La décision revient au
dirigeant.

---

## 6. Ce que le conteneur **ne peut pas** prouver

À lire avant de citer une mesure d'ici.

1. **⛔ Le `.htaccess` n'est pas interprété.** Ce conteneur sert `dist/` avec **nginx**,
   pas avec Apache. `RewriteEngine`, `mod_headers`, `mod_expires`, `mod_deflate`,
   `ErrorDocument` n'existent pas ici. **Rien de ce qui est mesuré dans le conteneur ne
   prouve que le `.htaccess` d'o2switch fonctionne.**
   - Les en-têtes de sécurité (CSP, `frame-ancestors 'self'`, `X-Frame-Options`,
     `nosniff`, `Referrer-Policy`, `Permissions-Policy`) ont été **recopiés** dans
     `conteneur/nginx.conf` à partir de `public/.htaccess` § 6 : ils **sont servis** et
     vérifiés. Cela prouve que la politique s'affiche, **pas que la production l'envoie**.
   - `Strict-Transport-Security` est **volontairement absent** : sans HTTPS local il
     bloquerait le navigateur. Ce n'est pas un oubli.
   - Les redirections HTTPS et www→non-www ne sont **pas** testées.
2. **⛔ Le déploiement FTP n'est pas testé.** Ni o2switch, ni la CI.
3. **⚠️ Les fins de ligne ne sont pas fidèles à la CI.** Le poste a `core.autocrlf=true`,
   donc l'arbre extrait arrive en **CRLF**, alors qu'un `actions/checkout` sous Linux
   donnerait du **LF**. C'est ce qui explique l'écart sur les 5 pages `Arche/` : le local
   les régénère en LF, le conteneur recopie du CRLF. **Même contenu, octets différents.**
 *Le nombre de fichiers, lui, n'est pas affecté.*
4. **⚠️ Le navigateur n'est pas le même.** Prérendu fait par **Chromium 153.0.8010.52**
   (Debian) ici, **Chrome 153.0.8010.53** sur le poste. Même version majeure — c'est une
   chance, pas une garantie. Un écart de version peut changer le HTML prérendu.
   Le prérendu dépend aussi d'un **timing** (`app--loaded`) : il a déjà échoué sur
   `/voyageo-pro` sur le poste, hors conteneur.
5. **⚠️ `ecole` n'est pas vérifié contre le dépôt du studio.** `ECOLE_STUDIO` pointe sur
   un chemin absent : la **publication** passe, le **contrôle de divergence** est sauté.
   Un document modifié côté studio et non recopié ne serait pas signalé.
6. **⚠️ Le conteneur ne dit rien de l'état de l'arbre de travail.** Il construit une
   **copie**. Deux builds sur une copie figée ne disent pas que le poste compile — voir § 7.

---

## 7. Ce que ce chantier a révélé sur le dépôt (hors conteneur)

Mesuré pendant les essais, et ça vaut d'être su :

- **`npm run build` échouait déjà sur le poste**, avant toute modification d'ici. Un
  premier build a cassé sur `prerendre` (« fichiers écrits : 32 · échecs : 1 », la route
  `/voyageo-pro` rendue sans coquille), puis un second sur `vite build`
  (`HomePage.vue:208`, CSS invalide).
- **La cause n'était pas le code, mais le moment.** Un autre chantier écrivait dans le
  même arbre : `src/views/core/HomePage.vue` a été modifié à **14:59:50**, mon build
  n° 2 a démarré à **15:00:16**. `src/views/core/sections/` (le dossier des sections de
  l'accueil) **n'est pas suivi par git** — c'est un travail en cours, et c'est lui qui a
  fait échouer `vite build` dans le premier conteneur
  (`AccueilJeu.vue:37:1: Unclosed block`).
- **Sur le commit `5a6b133`, tout passe.** Build local : code 0, 302 fichiers, 52 s.
  Build conteneur : code 0, 302 fichiers, 60 s. **Le problème n'est pas le build, c'est
  de construire dans un arbre que quelqu'un est en train d'écrire.**
- 25 processus `node` tournaient pendant les mesures. Un audit a échoué sur
  `EADDRINUSE: 127.0.0.1:4180` — collision avec un contrôle concurrent, pas un défaut.

---

## 8. Les fichiers de ce chantier

| fichier | rôle |
|---------|------|
| `Dockerfile` | image de build, Node 22.21.1 épinglé par **digest**, Chromium épinglé |
| `.dockerignore` | exclut `node_modules`, `dist`, `.git` ; **garde** `public/` et `ecole-dossiers/` |
| `docker-compose.yml` | service `build` + service `serve` (nginx, port **8088**) |
| `conteneur/etapes-build.sh` | exécute les 7 étapes une par une, mesure, écrit l'empreinte |
| `conteneur/nginx.conf` | sert `dist/`, reproduit les en-têtes du `.htaccess` |
| `conteneur/comparer-dist.ps1` | compare deux `dist/` : compte, chemins, contenu (hashes neutralisés) |
| `CONTENEUR.md` | ce document |

**Mesuré sur le dépôt, après ces ajouts :**

```
22/09/2026 15:16   node scripts/auditer-tout.mjs   →   code 0
                   Les 13 verrous sont tenus.

22/09/2026 15:26   node scripts/auditer-tout.mjs   →   code 0
                   Les 14 verrous sont tenus.
```

⚠️ **Le compte a changé entre les deux passages** — la liste est refondue par un autre
chantier pendant cette session (13 puis 14, là où le brief annonçait 10). *Un chiffre écrit
à la main devient faux sans le dire* : c'est pourquoi les deux mesures portent leur heure.
Le premier passage avait aussi échoué une fois sur `verifier-a11y-rendu.mjs` —
`EADDRINUSE` sur le port 4180, occupé par un contrôle concurrent. Relancé une fois le port
libre : tenu.

Pour rejouer le test de reproductibilité :

```powershell
.\conteneur\comparer-dist.ps1 -A <dist_1> -B <dist_2> -NomA "build 1" -NomB "build 2"
```

**Deux scripts existants ont été rendus portables** — sans changer le comportement Windows,
qui reste le défaut :

- `scripts/generer-arche.mjs` : `VAULT_METROID` surcharge le chemin du vault ;
- `scripts/publier-ecole.mjs` : `ECOLE_STUDIO` et `VAULT_METROID` surchargent les deux
  témoins de divergence.

Sur le poste, aucune variable n'est définie : **les chemins d'origine s'appliquent
inchangés**, et un build local sur le commit `5a6b133` a été mesuré **code 0 / 302
fichiers / 52 s** après ces modifications.

---

## 9. Le service de test — vérifié par requêtes, pas par confiance

Mesuré le 22/09/2026 sur le `dist/` produit par le conteneur (302 fichiers) :

| requête | réponse | attendu |
|---------|---------|---------|
| `GET /` | **200** (44 693 octets) | oui |
| `GET /etat-du-studio/` | **200** (30 871 octets) | oui |
| `GET /assets/index-*.js` | **200**, `Cache-Control: … immutable` | oui |
| `GET /route-qui-nexiste-pas` | **404** | oui — **pas** de repli SPA vers l'accueil |
| `GET /assets/` | **403** | oui — aucun listage de dossier (comme `Options -Indexes`) |

Et les en-têtes, **après** la correction décrite en § 10 : `Content-Security-Policy`,
`X-Frame-Options: SAMEORIGIN`, `X-Content-Type-Options: nosniff`,
`Referrer-Policy`, `Permissions-Policy` — tous présents sur `/`, sur une page `.html` et
sur un `.js`. *Première version du fichier : tous absents. Le défaut est décrit ci-dessous.*

```bash
docker compose up serve          # http://localhost:8088
docker compose down              # pour tout arrêter
```

---

## 10. Les pièges payés, pour ne pas les repayer

- **`docker` n'est pas dans le `PATH`** : le binaire est
  `C:\Program Files\Docker\Docker\resources\bin\docker.exe`. Sans ce dossier dans le
  `PATH`, `docker pull` échoue sur `docker-credential-desktop: executable file not found`.
- **`node_modules` monté depuis Windows ne sert à rien** sous Linux : `sharp` est un
  binaire natif. D'où `npm ci` dans l'image.
- **Un seul `add_header` dans un `location` nginx annule tous ceux du `server`.**
  Mesuré : la page d'accueil répondait 200 avec **zéro en-tête de sécurité** alors que le
  bloc `server` les déclarait. D'où la répétition dans `conteneur/nginx.conf`.
- **`docker run … sh -c "…"` depuis PowerShell transmet mal les commandes longues.**
  Passer par un script monté (`-v …:/app/x.sh:ro`) : c'est fiable.
- **`git archive` + `tar` sous `core.autocrlf=true` rend l'arbre en CRLF.** À savoir avant
  de comparer des octets.
- **`Get-Content` en PowerShell 5.1 lit l'UTF-8 comme de l'ANSI** : un tableau de rapport
  s'affiche `Ã©` alors que le fichier est correct. `-Encoding UTF8` pour lire.
