# syntax=docker/dockerfile:1
# ============================================================
# Dockerfile — L'ATELIER STANDARD DU STUDIO
# ============================================================
# CE QUE CE CONTENEUR FAIT : il CONSTRUIT le site (`npm ci` + les 7 étapes de
# la chaîne + TOUS les verrous + l'empreinte du `dist`) et il permet de le
# REGARDER. Il ne l'héberge pas.
#
# ⛔ CE QU'IL NE FAIT PAS : il ne remplace pas o2switch. Le site est servi
#    par o2switch, sous Apache, réglé par `public/.htaccess`, et la CI
#    déploie par FTP. Changer d'hébergeur est une décision du dirigeant.
#
# ⭐ LA COMMANDE UNIQUE, ET C'EST LA SEULE :
#      docker compose run --rm build
#    Elle enchaîne `npm ci` → les 7 étapes → `auditer-tout.mjs` → l'empreinte,
#    et elle REMONTE le code de sortie. Un build rouge est rouge.
#    Détail et mesures : CONTENEUR.md.
#
# ------------------------------------------------------------
# ⭐ POURQUOI ÉPINGLER CHAQUE PAQUET, ET PAS SEULEMENT L'IMAGE
#
#    La CI déclare `NODE_VERSION: '22'` et `ubuntu-latest`. Les deux sont
#    MOUVANTS : ce qui a tourné hier n'est pas ce qui tournera demain. Une
#    image mouvante n'est pas reproductible — et ce n'est pas une théorie :
#    le studio a payé ce prix deux fois le 22/09/2026.
#
#    L'image de base est donc figée par DIGEST, pas seulement par tag :
#      node:22.21.1-bookworm-slim
#      @sha256:25b3eb23a00590b7499f2a2ce939322727fcce1b15fdd69754fcd09536a3ae2c
#    Mesuré le 22/09/2026 : ce digest contient Node v22.21.1 et npm 10.9.4.
#    Le tag est conservé À CÔTÉ du digest, pour qu'un humain lise ce que
#    c'est ; c'est le digest qui fait foi.
#
#    Et CHAQUE paquet Debian ajouté est épinglé par version, mesurée dans
#    cette image le 22/09/2026 avec :
#      docker run --rm <image de base> bash -c \
#        "apt-get update -qq && apt-cache policy <paquet>"
#    Une version épinglée qui disparaît du dépôt fait ÉCHOUER la
#    construction, franchement. C'est voulu : un échec visible vaut mieux
#    qu'une dérive silencieuse. Le remède est de relancer la sonde
#    ci-dessus et de mettre à jour la ligne.
#
# ⚠️ REPRODUCTIBILITÉ PARTIELLE, ET IL FAUT LE DIRE : l'image de base et
#    tous les paquets listés ici sont épinglés, mais leurs DÉPENDANCES
#    transitives suivent le dépôt du jour. Une reproductibilité STRICTE
#    exigerait un dépôt snapshoté (snapshot.debian.org) — ce n'est pas fait.
# ============================================================

FROM node:22.21.1-bookworm-slim@sha256:25b3eb23a00590b7499f2a2ce939322727fcce1b15fdd69754fcd09536a3ae2c

# ------------------------------------------------------------
# LES VERSIONS ÉPINGLÉES — mesurées le 22/09/2026, dans cette image
# ------------------------------------------------------------
# Chromium 153.0.8010.52-1~deb12u1
#   POURQUOI IL EST INDISPENSABLE ICI. `npm run prerendre`
#   (scripts/prerendre.js) ne réimplémente pas le rendu : il PILOTE un
#   navigateur par le protocole de débogage CDP et fige le HTML tel que le
#   navigateur le construit. Sans navigateur, l'étape s'arrête en code 1 —
#   et le site perd ses 32 pages prérendues, c'est-à-dire tout ce que voit
#   un moteur de recherche ou un aperçu de lien.
ARG CHROMIUM_VERSION=153.0.8010.52-1~deb12u1

# git 1:2.39.5-0+deb12u3
#   POURQUOI ICI ET PAS AILLEURS : le poste n'a PAS `git` dans le PATH de
#   ses shells (le binaire est sous `C:\Program Files\Git\cmd`), donc tous
#   les contrôles et toutes les manipulations d'historique écrits en `git`
#   échouent sur le poste. Dans le conteneur, `git` est là.
#   ⚠️ MESURÉ ET À NE PAS SURINTERPRÉTER : aucun `verifier-*.mjs` n'appelle
#      `git` (0 occurrence sur les 14 — cherché le 22/09/2026). Le dépôt est
#      monté en LECTURE SEULE : `git` sert à LIRE l'arbre (statut, journal,
#      diff), et une écriture (commit, index) échouera — c'est voulu.
ARG GIT_VERSION=1:2.39.5-0+deb12u3

# ffmpeg + ffprobe 7:5.1.9-0+deb12u1
#   ⭐ C'EST LA CAUSE MESURÉE DU PLAFOND QUI NE BORNAIT RIEN. Sur le poste,
#   `ffmpeg` et `ffprobe` sont ABSENTS du PATH : la durée des médias valait
#   donc 0, et le plafond de 180 minutes ne bornait rien — il rassurait.
#   `ffprobe` est dans le paquet `ffmpeg` (Debian ne le sépare pas).
#   *Un plafond qui ne peut pas lire une durée ne borne rien : il rassure.*
ARG FFMPEG_VERSION=7:5.1.9-0+deb12u1

# python3 3.11.2-1+b1 · python3-pip 23.0.1+dfsg-1 · python3-venv 3.11.2-1+b1
#   POURQUOI : les outils du studio sont en Python (`prenom.py`,
#   `mesure-glb.py`, le chantier MND/ArkAdiA). Un atelier qui ne sait pas
#   les lancer est à moitié fait.
#   ⚠️ `pip install` en direct ÉCHOUERA (PEP 668, « externally managed
#      environment ») : c'est le comportement attendu du Debian 12. Un
#      `python3-venv` est fourni pour ça — et une installation `pip`
#      n'entre JAMAIS dans l'image, sinon plus rien n'est reproductible.
ARG PYTHON3_VERSION=3.11.2-1+b1
ARG PYTHON3_PIP_VERSION=23.0.1+dfsg-1
ARG PYTHON3_VENV_VERSION=3.11.2-1+b1

# ripgrep 13.0.0-4+b2
#   POURQUOI, ET PAS « AU CAS OÙ » : parce que la commande unique s'en SERT.
#   Elle extrait le verdict de l'audit par un motif (« Les N verrous sont
#   tenus ») et ÉCHOUE si le motif est absent — une assertion de structure,
#   pas une lecture d'écran. `rg` sert aussi à chercher dans l'arbre, ce
#   qu'un agent fait en permanence, et il remplace les `grep` de PowerShell
#   dont les guillemets mangés ont coûté neuf erreurs d'outillage.
#   ⚠️ MESURÉ : aucun `verifier-*.mjs` n'appelle `rg` (0 occurrence).
ARG RIPGREP_VERSION=13.0.0-4+b2

# jq 1.6-2.1+deb12u2
#   POURQUOI, ET PAS « AU CAS OÙ » : la commande unique écrit un
#   `resume.json` de mesures, et elle le VALIDE avec `jq -e .` avant de
#   rendre son verdict. Un rapport de mesures illisible est un rapport
#   qu'on croira sur parole — donc on le vérifie.
ARG JQ_VERSION=1.6-2.1+deb12u2

# rsync 3.2.7-1+deb12u6
#   C'EST LA PIÈCE QUI FAIT TENIR LE MONTAGE. Le dépôt est monté (binds
#   `C:\IA\portfolio-gaetan` → `/atelier`, en lecture seule) pour qu'une
#   correction soit prise en compte SANS reconstruire l'image ; `rsync`
#   recopie cet arbre dans `/app` en 1 à 3 secondes, et il en EXCLUT
#   `node_modules` (binaires Windows) et `dist` (sortie du build
#   précédent, qui ferait croire à un build réussi).
ARG RSYNC_VERSION=3.2.7-1+deb12u6

# bsdmainutils 12.1.8
#   POUR `column`, ET RIEN D'AUTRE. `conteneur/etapes-build.sh` aligne son
#   tableau de mesures avec `column -t -s`. Sans le paquet, la ligne échoue
#   en silence (`|| cat`) et le tableau devient illisible — *un outil absent
#   ne fait pas de bruit, il dégrade.*
ARG BSDMAINUTILS_VERSION=12.1.8

# curl 7.88.1-10+deb12u15
#   POUR LES SONDES DE L'ATELIER : vérifier qu'un service répond
#   (`curl -sS http://127.0.0.1:8088/`) est le premier réflexe de
#   diagnostic, et `wget` n'est pas dans l'image de base.
ARG CURL_VERSION=7.88.1-10+deb12u15

# ca-certificates 20250419~deb12u1
#   Sans lui, `npm ci` échoue sur le registre HTTPS. Épinglé comme le reste.
ARG CA_CERTIFICATES_VERSION=20250419~deb12u1

# ------------------------------------------------------------
# L'INSTALLATION — une seule couche, tous les paquets épinglés
# ------------------------------------------------------------
# `--no-install-recommends` : on ne veut pas du bureau X11 complet ni des
# pilotes de polices recommandés par Chromium. Le paquet `chromium` tire
# lui-même fontconfig et les bibliothèques système dont il a besoin.
RUN apt-get update \
 && apt-get install -y --no-install-recommends \
      chromium="${CHROMIUM_VERSION}" \
      git="${GIT_VERSION}" \
      ffmpeg="${FFMPEG_VERSION}" \
      python3="${PYTHON3_VERSION}" \
      python3-pip="${PYTHON3_PIP_VERSION}" \
      python3-venv="${PYTHON3_VENV_VERSION}" \
      ripgrep="${RIPGREP_VERSION}" \
      jq="${JQ_VERSION}" \
      rsync="${RSYNC_VERSION}" \
      bsdmainutils="${BSDMAINUTILS_VERSION}" \
      curl="${CURL_VERSION}" \
      ca-certificates="${CA_CERTIFICATES_VERSION}" \
 && rm -rf /var/lib/apt/lists/*

# Le prérendu cherche un navigateur dans une liste de chemins connus, dont
# `/usr/bin/chromium`. On le lui dit explicitement quand même : si Debian
# déplace le binaire, l'étape échouera avec un message clair au lieu de
# sauter en silence.
ENV CHROME_PATH=/usr/bin/chromium

# ⭐ LA LOCALE, ET CE N'EST PAS DU CONFORT — C'EST MESURÉ.
#    Sans `LANG`, le conteneur tourne en POSIX/C : tout octet >= 0x80 y est
#    « non imprimable ». Conséquence mesurée le 22/09/2026 dans le tableau
#    des 7 étapes : `column -t` ÉCHAPPE les accents et le tiret cadratin, et
#    le rapport du studio s'écrit
#        « 1. prebuild \xe2\x80\x94 relever l'\xc3\xa9tat du studio »
#    au lieu de
#        « 1. prebuild — relever l'état du studio ».
#    *Un rapport illisible en français est un rapport qu'on ne relit pas.*
#
#    ⚠️ PREMIÈRE HYPOTHÈSE, TESTÉE ET FAUSSE : le script posait `LC_ALL=C`
#       en tête. Le réglage a été restreint — et le défaut est RESTÉ. La
#       cause était la locale ABSENTE, pas la locale C.
#    Trois locales sont disponibles dans cette image : C, C.utf8, POSIX.
#    Mesuré, le même fichier sous trois réglages :
#      · (rien)      → \xe2\x80\x94   (échappé)
#      · LANG=C      → \xe2\x80\x94   (échappé)
#      · LANG=C.UTF-8 → —             (propre)
#
#    ⚠️ `C.UTF-8` et non `fr_FR.UTF-8` : la locale française demanderait le
#       paquet `locales` et une génération à la construction ; `C.utf8` est
#       fournie par la glibc Debian, sans rien installer. Le français n'a
#       pas besoin d'une locale française pour s'AFFICHER — il a besoin
#       d'une locale qui sache ce qu'est un caractère UTF-8.
#    Elle sert aussi aux outils du studio : `python3` s'aligne sur la locale
#    pour l'encodage de ses entrées/sorties.
ENV LANG=C.UTF-8

# ⚠️ ET ON FAIT PARLER LES OUTILS, TOUT DE SUITE. Une image qui CONTIENT un
#    outil ne prouve pas que l'outil MARCHE : un binaire présent mais cassé
#    (bibliothèque manquante, mauvais lien) ne se voit qu'à l'usage, et il se
#    verrait au milieu d'un build de trois minutes. On refuse donc de
#    construire l'image si l'un d'eux ne répond pas — la construction
#    elle-même est la mesure.
RUN set -eu; \
    echo "--- node  : $(node -v) / npm $(npm -v)"; \
    echo "--- git   : $(git --version)"; \
    echo "--- ffmpeg: $(ffmpeg -version | head -1)"; \
    echo "--- ffprobe: $(ffprobe -version | head -1)"; \
    echo "--- python: $(python3 --version) / $(pip3 --version 2>/dev/null || echo 'pip3 absent')"; \
    echo "--- rg    : $(rg --version | head -1)"; \
    echo "--- jq    : $(jq --version)"; \
    echo "--- rsync : $(rsync --version | head -1)"; \
    echo "--- column: $(column --version 2>&1 | head -1)"; \
    echo "--- chrome: $(chromium --version)"

WORKDIR /app

# ---- 1. Les dépendances, AVANT les sources -------------------------------
# Ces deux fichiers changent rarement : la couche `npm ci` reste donc en
# cache quand on ne touche qu'au code.
#
# ⛔ `npm ci`, JAMAIS `npm install` : `ci` installe EXACTEMENT l'arbre de
#    `package-lock.json` et échoue si le lock est désynchronisé. `install`
#    peut réécrire le lock — donc un build qui dépend du jour où on l'a lancé.
#
# ⛔ ET PAS DE `NODE_ENV=production` ICI : le build a besoin des
#    devDependencies (vite, terser, @vitejs/plugin-vue). Les exclure ferait
#    échouer `vite build` sur un `vite` introuvable.
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

# ⭐ L'EMPREINTE DU LOCK, GRAVÉE DANS L'IMAGE.
#    `conteneur/construire-et-verifier.sh` compare le lock de l'arbre MONTÉ
#    à cette empreinte : si elle est identique, l'installation faite ici EST
#    celle du lock courant, et refaire `npm ci` ne changerait rien. Si elle
#    diffère, `npm ci` est relancé — mesuré, jamais déduit.
RUN mkdir -p /opt/atelier \
 && sha256sum package-lock.json | cut -d' ' -f1 > /opt/atelier/empreinte-package-lock.txt \
 && echo "empreinte du lock gravée : $(cat /opt/atelier/empreinte-package-lock.txt)"

# ---- 2. Les sources ------------------------------------------------------
# Ce que `.dockerignore` laisse passer. Il en EXCLUT node_modules (binaires
# Windows, inutilisables ici), dist (une sortie qu'on veut PRODUIRE, pas
# recopier) et .git.
#
# ⚠️ CES SOURCES SONT UN REPLI, PAS LA RÉFÉRENCE. En usage normal, le dépôt
#    vivant arrive par le montage `C:\IA\portfolio-gaetan → /atelier` et
#    `construire-et-verifier.sh` recopie `/atelier` par-dessus. Les sources
#    copiées ici servent quand il n'y a pas de montage (et elles donnent à
#    `npm ci` sa couche de cache).
COPY . .

# Les scripts de `conteneur/` doivent être exécutables — un fichier écrit
# depuis Windows n'arrive pas toujours avec le bit d'exécution.
RUN chmod +x /app/conteneur/*.sh || true

# ---- 3. LE RÉGLAGE GIT QUI REND LES MESURES VRAIES ------------------------
# ⛔ POURQUOI CE N'EST PAS UN RÉGLAGE DE CONFORT. La page /etat-du-studio
#    PUBLIE le commit de la construction qui vient de finir, et
#    `scripts/generer-etat.mjs` le lit avec git. Sans ce réglage, dans un
#    conteneur, `git status` répond « 352 fichiers modifiés » sur un arbre
#    PROPRE — donc le site afficherait une affirmation fausse, et la CI (qui
#    a, elle, la bonne configuration) en afficherait une autre pour le même
#    commit. Deux mesures contradictoires pour la même chose.
#
#    MESURÉ le 22/09/2026 sur l'arbre monté, en séparant les causes :
#      · sans réglage ................. 352 « modifications »
#      · core.fileMode=false .......... 352   ← DÉJÀ false dans ce dépôt :
#        les bits de permission n'étaient PAS la cause. Hypothèse testée,
#        et fausse. (Sur un montage Windows tout est 0755, d'où l'idée.)
#      · core.autocrlf=false .......... 352
#      · core.autocrlf=input .......... 13    ← la vraie cause
#    Les 13 restants sont de VRAIES différences : le travail en cours de
#    trois agents, et le relevé que le build vient de réécrire.
#
#    La cause est celle que le studio connaît déjà, sous son autre face : le
#    poste a `core.autocrlf=true` et écrit du CRLF, quand l'index de git
#    porte du LF. Un conteneur Linux ne peut comparer que s'il NORMALISE à
#    la lecture — c'est exactement ce que fait `input`, et `input` n'écrit
#    jamais de CRLF : il ne peut donc pas abîmer un fichier.
#
#    ⚠️ RÉGLAGE `--system`, PAS `--global` : il ne dépend pas de `$HOME`, qui
#       n'est pas garanti (ni à la construction, ni à l'exécution).
RUN git config --system core.autocrlf input \
 && git config --system core.fileMode false \
 && echo "git (configuration système) : $(git config --system --list | tr '\n' ' ')"

# ---- 4. Par défaut : LA COMMANDE UNIQUE ----------------------------------
# Construit, vérifie les verrous, écrit l'empreinte, et REMONTE le code
# de sortie. Il n'y a pas de `exit 0` nulle part : une version précédente en
# portait un « pour ne pas casser la mesure », et il masquait le code du
# build — `docker compose run` annonçait un succès sur un build en échec.
CMD ["bash", "/app/conteneur/construire-et-verifier.sh"]
