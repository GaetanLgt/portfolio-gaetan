#!/bin/bash
# ============================================================
# git-epreuve2.sh — LA SYNCHRONISATION COMPLÈTE, PUIS LA QUESTION
# ============================================================
# ⚠️ L'ÉPREUVE PRÉCÉDENTE ÉTAIT FAUSSÉE, ET IL FAUT LE DIRE : elle testait
#    `/app` tel qu'il sort de l'IMAGE (sans `.gitignore`, sans
#    `rapports-conteneur/`) et sans la synchronisation complète. Ses 349
#    « modifications » mélangeaient donc trois causes.
#
# ⭐ ICI ON REPRODUIT EXACTEMENT CE QUE FAIT LA COMMANDE UNIQUE : la
#    synchronisation complète de l'arbre monté, `.git` COMPRIS. Puis on
#    cherche la cause des « modifications », en la TESTANT :
#      (a) les bits de permission — le montage Windows rend TOUT en 0755,
#          alors que l'index de git a mémorisé 0644 pour la plupart ;
#      (b) le contenu, réellement différent ;
#      (c) les fins de ligne (core.autocrlf=true dans ce dépôt).
# ============================================================
set -u
APP=/app
ATELIER=/atelier

echo "==============================================================="
echo "  GIT — synchronisation COMPLÈTE — $(date '+%Y-%m-%d %H:%M:%S %Z')"
echo "==============================================================="

T0=$(date +%s)
rsync -rtl --delete --omit-dir-times \
  --exclude 'node_modules/' --exclude 'dist/' \
  --exclude 'rapports/' --exclude 'rapports-conteneur/' --exclude '.venv/' \
  "$ATELIER"/ "$APP"/ > /tmp/r1.log 2>&1
echo "  sync complète (avec .git) : code $?  |  $(( $(date +%s) - T0 )) s"
LC_ALL=C grep -E 'Number of regular files transferred|Total transferred file size' /tmp/r1.log | sed 's/^/  /'

cd "$APP" || exit 1
echo
echo "--- 1. CONFIG GIT RÉELLE DANS LE CONTENEUR ---"
git config --get core.autocrlf | sed 's/^/  core.autocrlf = /'
git config --get core.fileMode | sed 's/^/  core.fileMode = /'
echo "  core.fileMode = true est le DÉFAUT : git compare alors les bits de"
echo "  permission, et sur un montage Windows ils sont tous 0755."

echo
echo "--- 2. LES TROIS COMPTES, POUR SÉPARER LES CAUSES ---"
printf '  (a) tel quel                        : %s modification(s)\n' "$(git status --porcelain | wc -l | tr -d ' ')"
printf '  (b) core.fileMode=false             : %s modification(s)\n' "$(git -c core.fileMode=false status --porcelain | wc -l | tr -d ' ')"
printf '  (c) + core.autocrlf=false           : %s modification(s)\n' "$(git -c core.fileMode=false -c core.autocrlf=false status --porcelain | wc -l | tr -d ' ')"
printf '  (d) + core.safecrlf / eol=lf        : %s modification(s)\n' "$(git -c core.fileMode=false -c core.autocrlf=input status --porcelain | wc -l | tr -d ' ')"

echo
echo "--- 3. CE QUI RESTE MODIFIÉ AVEC core.fileMode=false (les 20 premiers) ---"
git -c core.fileMode=false status --porcelain | head -20 | sed 's/^/    /'
echo "    … total : $(git -c core.fileMode=false status --porcelain | wc -l | tr -d ' ')"

echo
echo "--- 4. LES DEUX VALEURS QUE LE SITE PUBLIE ---"
echo -n "  commit court (git rev-parse --short HEAD) : "
git rev-parse --short HEAD 2>&1 | head -1
echo -n "  git diff --quiet (arbre)                  : "
if git -c core.fileMode=false diff --quiet 2>/dev/null; then echo "PROPRE"; else echo "MODIFIE"; fi
echo -n "  fichiers modifiés par le BUILD seulement  : "
git -c core.fileMode=false status --porcelain -- public/ src/data/ 2>/dev/null | wc -l | tr -d ' '

echo
echo "--- 5. LES FINS DE LIGNE, MESURÉES SUR UN FICHIER TÉMOIN ---"
temoin="src/data/etat-services.json"
if [ -f "$temoin" ]; then
  echo "  $temoin"
  echo "  CR dans /app   : $(tr -cd '\r' < "$temoin" | wc -c | tr -d ' ')"
  echo "  CR dans /atelier : $(tr -cd '\r' < "$ATELIER/$temoin" | wc -c | tr -d ' ')"
  # Si /atelier (Windows) porte des CR et pas /app, c'est bien la conversion.
  # S'ils sont identiques, la sync n'a rien converti — donc ce n'est pas ça.
fi
echo "  git ls-files --eol (3 premiers) :"
git ls-files --eol 2>/dev/null | head -3 | sed 's/^/    /'

echo
echo "==============================================================="
echo "  À LIRE : si (b) tombe à 0, la cause est UNIQUEMENT les bits de"
echo "  permission — et un réglage système les neutralise proprement."
echo "==============================================================="
