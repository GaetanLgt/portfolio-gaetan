#!/bin/sh
# ============================================================
# etapes-build.sh — LE BUILD, ÉTAPE PAR ÉTAPE, MESURÉ
# ============================================================
# POURQUOI CE SCRIPT EXISTE.
#
#   `npm run build` est une chaîne : `sitemap && ecole && arche && vite build
#   && prerendre`, encadrée par les hooks `prebuild` et `postbuild` de npm.
#   Quand la chaîne casse, on sait SEULEMENT qu'elle a cassé — pas où, ni
#   combien de pages ont été produites avant.
#
#   Or c'est exactement la question qui compte : **un build qui réussit en
#   produisant MOINS de pages est plus dangereux qu'un build qui échoue.**
#   Ce script exécute donc chaque étape séparément, note son code de sortie,
#   sa durée, et COMPTE les fichiers de `dist/` après chacune.
#
# ⚠️ Ce script NE REMPLACE PAS le build. Il le découpe pour l'observer.
#    Il n'écrit nulle part ailleurs que dans le dépôt de travail du conteneur.
#
# Sortie : un tableau lisible + un récapitulatif, et un code de sortie 1 si
# au moins une étape a échoué (pour que l'échec soit visible, jamais avalé).
# ============================================================
set -u

DIST="${DIST:-dist}"
TOTAL_ECHECS=0
# Où écrire les rapports. Dans le conteneur, `docker-compose.yml` monte un
# dossier de l'hôte sur `/app/rapports` : les mesures doivent sortir du
# conteneur, sinon elles meurent avec lui.
RAPPORTS="${RAPPORTS:-.}"
mkdir -p "$RAPPORTS" 2>/dev/null || RAPPORTS=.
RAPPORT="$RAPPORTS/build-etapes.txt"

dossier() {
  # Compte les fichiers d'un dossier, 0 s'il n'existe pas.
  if [ -d "$1" ]; then find "$1" -type f 2>/dev/null | wc -l | tr -d ' '; else echo 0; fi
}

html() {
  if [ -d "$DIST" ]; then find "$DIST" -name '*.html' -type f 2>/dev/null | wc -l | tr -d ' '; else echo 0; fi
}

etape() {
  # $1 = nom lisible, $2.. = commande
  nom="$1"; shift
  printf '\n──────────────────────────────────────────────────────────────\n'
  printf '  ÉTAPE : %s\n' "$nom"
  printf '  COMMANDE : %s\n' "$*"
  printf '──────────────────────────────────────────────────────────────\n'

  debut=$(date +%s)
  "$@" 2>&1
  code=$?
  fin=$(date +%s)
  duree=$((fin - debut))

  n_dist=$(dossier "$DIST")
  n_html=$(html)
  n_arche=$(dossier "$DIST/Arche")
  n_jof=$(dossier "$DIST/TARDIS")
  n_assets=$(dossier "$DIST/assets")

  if [ "$code" -eq 0 ]; then
    printf '  → CODE 0 (succès)  %ss  |  dist:%s fichiers  html:%s  assets:%s  Arche:%s  TARDIS:%s\n' \
      "$duree" "$n_dist" "$n_html" "$n_assets" "$n_arche" "$n_jof"
  else
    printf '  → CODE %s (ÉCHEC)   %ss  |  dist:%s fichiers  html:%s  assets:%s  Arche:%s  TARDIS:%s\n' \
      "$code" "$duree" "$n_dist" "$n_html" "$n_assets" "$n_arche" "$n_jof"
    TOTAL_ECHECS=$((TOTAL_ECHECS + 1))
  fi

  printf '%s\t%s\t%s\t%s\t%s\t%s\t%s\n' \
    "$nom" "$code" "$duree" "$n_dist" "$n_html" "$n_arche" "$n_jof" >> "$RAPPORT"
}

rm -f "$RAPPORT"
printf 'etape\tcode\tduree_s\tdist_fichiers\thtml\tArche\tTARDIS\n' > "$RAPPORT"

printf '===============================================================\n'
printf '  BUILD ÉTAPE PAR ÉTAPE — %s\n' "$(date '+%Y-%m-%d %H:%M:%S %Z')"
printf '===============================================================\n'
printf '  node : %s  |  npm : %s\n' "$(node -v)" "$(npm -v)"
printf '  Chrome/Chromium : %s\n' "${CHROME_PATH:-non défini (le script cherche /usr/bin/chromium)}"
printf '  VAULT_METROID   : %s\n' "${VAULT_METROID:-non défini}"
printf '  ECOLE_STUDIO    : %s\n' "${ECOLE_STUDIO:-non défini}"
if [ ! -d node_modules ]; then
  printf '  ⛔ node_modules ABSENT — lancer `npm ci` d abord.\n'
  exit 1
fi

# Les hooks npm `prebuild` et `postbuild` se déclenchent AUSSI quand on
# appelle `npm run build`. On les nomme donc explicitement, un par un, pour
# qu'aucun ne soit exécuté deux fois sans qu'on le sache.
etape "1. prebuild — relever l'état du studio (generer-etat.mjs)" npm run prebuild
etape "2. sitemap — generer-sitemap.mjs"                          npm run sitemap
etape "3. ecole — publier-ecole.mjs"                              npm run ecole
etape "4. arche — generer-arche.mjs"                              npm run arche
etape "5. vite build — compilation des 144 modules"               ./node_modules/.bin/vite build
etape "6. prerendre — 32 routes rendues par Chrome"               npm run prerendre
etape "7. postbuild — releve final dans le HTML prerendu"         npm run postbuild

printf '\n===============================================================\n'
printf '  RÉCAPITULATIF\n'
printf '===============================================================\n'
column -t -s "$(printf '\t')" "$RAPPORT" 2>/dev/null || cat "$RAPPORT"
printf '\n  étapes en échec : %s\n' "$TOTAL_ECHECS"
printf '  fichiers dans %s/ : %s\n' "$DIST" "$(dossier "$DIST")"

# ── L'EMPREINTE DU DIST ───────────────────────────────────────────────────────
# C'est LA mesure qui compte : deux builds doivent donner la même empreinte.
# On hache le CONTENU (pas les dates : elles changent à chaque build et ne
# disent rien de la reproductibilité). `sort -z` + `xargs -0` : les noms de
# fichiers du site contiennent des espaces et des accents.
#
# ⚠️ NOM DISTINCT, ET C'EST VOLONTAIRE : l'empreinte qui FAIT FOI est écrite
#    par `conteneur/construire-et-verifier.sh`, APRÈS l'audit des verrous.
#    Celle-ci est prise juste après les 7 étapes — même contenu, mais deux
#    moments de la chaîne. Deux fichiers du même nom se recouvriraient, et on
#    ne saurait plus laquelle on lit.
EMPREINTE="$RAPPORTS/empreinte-apres-etapes.txt"
if [ -d "$DIST" ]; then
  ( cd "$DIST" && find . -type f -print0 | sort -z | xargs -0 sha256sum ) > "$EMPREINTE" 2>/dev/null
  printf '  empreinte SHA-256 de %s/ : %s lignes → %s\n' "$DIST" "$(wc -l < "$EMPREINTE" | tr -d ' ')" "$EMPREINTE"
  printf '  empreinte du manifeste   : %s\n' "$(sha256sum "$EMPREINTE" | cut -c1-16)"
else
  printf '  ⛔ %s/ n existe pas : aucune empreinte possible.\n' "$DIST"
fi

# ── CE QUI EST VERSIONNÉ DANS `public/` ET SERVI MALGRÉ UN SAUT ───────────────
# ⚠️ PIÈGE MESURÉ : `public/Arche/` (5 fichiers) et `public/TARDIS/JoF/`
# (146 fichiers) sont VERSIONNÉS dans le dépôt. Si l'étape qui les génère se
# saute, le build réussit quand même et RECOPIE les fichiers d'hier dans
# `dist/` : un build vert qui sert du périmé. On compare donc le nombre de
# fichiers du dépôt et celui du build — s'ils sont égaux, ça ne prouve PAS
# que le build les a produits. Seule la date le dirait, et elle n'est pas
# dans le contenu. À vérifier à la main : voir CONTENEUR.md.
printf '  public/Arche (dépôt)  : %s fichiers  →  dist/Arche : %s\n' \
  "$(dossier public/Arche)" "$(dossier "$DIST/Arche")"
printf '  public/TARDIS (dépôt) : %s fichiers  →  dist/TARDIS : %s\n' \
  "$(dossier public/TARDIS)" "$(dossier "$DIST/TARDIS")"
printf '===============================================================\n'

[ "$TOTAL_ECHECS" -eq 0 ] || exit 1
