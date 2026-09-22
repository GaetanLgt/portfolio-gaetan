# syntax=docker/dockerfile:1
# ============================================================
# Dockerfile — BUILD REPRODUCTIBLE du site portfolio-gaetan
# ============================================================
# CE QUE CE CONTENEUR FAIT : il CONSTRUIT le site (`npm run build`) et
# permet de le REGARDER. Il ne l'héberge pas.
#
# ⛔ CE QU'IL NE FAIT PAS : il ne remplace pas o2switch. Le site est servi
#    par o2switch, sous Apache, réglé par `public/.htaccess`, et la CI
#    déploie par FTP. Changer d'hébergeur est une décision du dirigeant.
#
# ⭐ POURQUOI ÉPINGLER, ET PAS SEULEMENT `node:22`
#
#    La CI déclare `NODE_VERSION: '22'`. `node:22` est un tag MOUVANT : il
#    désigne aujourd'hui 22.21.1 et demain autre chose. Une image mouvante
#    n'est pas reproductible — le studio a déjà payé ce prix avec
#    `ubuntu-latest`.
#
#    L'image est donc figée par DIGEST, pas seulement par tag :
#      node:22.21.1-bookworm-slim
#      @sha256:25b3eb23a00590b7499f2a2ce939322727fcce1b15fdd69754fcd09536a3ae2c
#    Mesuré le 22/09/2026 : ce digest contient Node v22.21.1 et npm 10.9.4.
#    Le tag est conservé À CÔTÉ du digest, pour qu'un humain lise ce que
#    c'est ; c'est le digest qui fait foi.
#
# ⚠️ REPRODUCTIBILITÉ PARTIELLE, ET IL FAUT LE DIRE : seuls l'image de base
#    et la version de Chromium sont épinglées. Les autres paquets Debian
#    suivent le dépôt du jour. Une reproductibilité STRICTE exigerait un
#    dépôt snapshoté (snapshot.debian.org) — ce n'est pas fait ici.
# ============================================================

FROM node:22.21.1-bookworm-slim@sha256:25b3eb23a00590b7499f2a2ce939322727fcce1b15fdd69754fcd09536a3ae2c

# Version de Chromium épinglée. Relevée le 22/09/2026 dans l'image de base :
#   apt-cache policy chromium  →  Candidate: 153.0.8010.52-1~deb12u1
#
# ⚠️ POURQUOI UN `ARG` ET PAS UN NOMBRE EN DUR DANS LA COMMANDE :
#    Debian publie une nouvelle version de sécurité de temps en temps, et
#    retire l'ancienne du dépôt. Quand ça arrive, `apt-get install` ÉCHOUE
#    franchement — c'est voulu (un échec visible vaut mieux qu'une dérive
#    silencieuse), et le remède est de relancer
#        docker run --rm node:22.21.1-bookworm-slim \
#          bash -c "apt-get update -qq && apt-cache policy chromium"
#    puis de mettre à jour cette ligne.
ARG CHROMIUM_VERSION=153.0.8010.52-1~deb12u1

# POURQUOI CHROMIUM EST INDISPENSABLE ICI.
#   `npm run prerendre` (scripts/prerendre.js) ne réimplémente pas le rendu :
#   il PILOTE un navigateur par le protocole de débogage CDP et fige le HTML
#   tel que le navigateur le construit. Sans navigateur, l'étape s'arrête
#   en code 1 — et le site perd ses 32 pages prérendues, c'est-à-dire tout
#   ce que voit un moteur de recherche ou un aperçu de lien.
#   Le script cherche déjà `/usr/bin/chromium` (mesuré, ligne 78).
#
# `--no-install-recommends` : on ne veut pas du bureau X11 complet.
# Le paquet `chromium` tire lui-même fontconfig et les bibliothèques
# système dont il a besoin.
RUN apt-get update \
 && apt-get install -y --no-install-recommends \
      chromium="${CHROMIUM_VERSION}" \
      ca-certificates \
      git \
 && rm -rf /var/lib/apt/lists/*

# Le prérendu cherche un navigateur dans une liste de chemins connus, dont
# `/usr/bin/chromium`. On le lui dit explicitement quand même : si Debian
# déplace le binaire, l'étape échouera avec un message clair au lieu de
# sauter en silence.
ENV CHROME_PATH=/usr/bin/chromium

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

# ---- 2. Les sources ------------------------------------------------------
# Ce que `.dockerignore` laisse passer. Il en EXCLUT node_modules (binaires
# Windows, inutilisables ici), dist (une sortie qu'on veut PRODUIRE, pas
# recopier) et .git.
COPY . .

# `conteneur/etapes-build.sh` doit être exécutable — un fichier écrit depuis
# Windows n'arrive pas toujours avec le bit d'exécution.
RUN chmod +x /app/conteneur/etapes-build.sh || true

# ---- 3. Par défaut : le build découpé et mesuré ---------------------------
# `npm run build` est la chaîne de production. Le script ci-dessous exécute
# les mêmes étapes, une par une, et COMPTE les fichiers de `dist/` après
# chacune : c'est ce qui distingue « le build a échoué » de « le build a
# réussi en produisant moins de pages ».
CMD ["sh", "/app/conteneur/etapes-build.sh"]
