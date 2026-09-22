#!/bin/bash
# ============================================================
# outils-epreuve.sh — FAIRE PARLER LA CHAÎNE D'OUTILS
# ============================================================
# ⭐ LA LOI : une image qui CONTIENT un outil ne prouve pas que l'outil
#    MARCHE. On ne se contente donc pas de `--version` : on demande à chaque
#    outil de faire le travail pour lequel il est là.
#
# L'ÉPREUVE QUI COMPTE, ET ELLE EST NOMMÉE : ⛔ sur le poste, `ffmpeg` et
# `ffprobe` sont ABSENTS du PATH — donc la durée des médias valait 0, et le
# plafond de 180 minutes ne bornait RIEN. Ce script fabrique un média dont la
# durée est CONNUE (3 secondes) et vérifie que `ffprobe` la LIT. Un plafond
# qui ne peut pas lire une durée ne borne rien : il rassure.
# ============================================================
set -u
ECHECS=0

titre() { printf '\n──── %s\n' "$1"; }
ok()    { printf '  ✔ %s\n' "$1"; }
ko()    { printf '  ✘ %s\n' "$1"; ECHECS=$((ECHECS + 1)); }

DERNIER_LOG="${1:-/tmp/outils-epreuve.log}"
exec > >(tee "$DERNIER_LOG") 2>&1

echo "==============================================================="
echo "  ÉPREUVE DE LA CHAÎNE D'OUTILS — $(date '+%Y-%m-%d %H:%M:%S %Z')"
echo "==============================================================="

titre "1. LES OUTILS SE PRÉSENTENT"
for c in node npm git ffmpeg ffprobe python3 pip3 rg jq rsync column chromium; do
  chemin=$(command -v "$c" || echo ABSENT)
  version=$("$c" --version 2>&1 | head -1)
  printf '  %-9s %-42s %s\n' "$c" "$chemin" "${version:-ABSENT}"
done

titre "2. ⭐ ffmpeg FABRIQUE UN MÉDIA DE DURÉE CONNUE, ffprobe LA LIT"
# `testsrc` : une mire synthétique, aucune donnée du studio, aucun réseau.
# 3 secondes, et la mesure doit dire 3.
MESURE_ATTENDUE=3
if ffmpeg -hide_banner -loglevel error -f lavfi \
     -i "testsrc=duration=${MESURE_ATTENDUE}:size=128x128:rate=5" \
     -pix_fmt yuv420p -y /tmp/mire.mp4; then
  ok "mire fabriquée : /tmp/mire.mp4 ($(du -h /tmp/mire.mp4 | cut -f1))"
else
  ko "ffmpeg n'a PAS fabriqué la mire — l'encodage ne marche pas"
fi

if [ -f /tmp/mire.mp4 ]; then
  DUREE=$(ffprobe -v error -show_entries format=duration -of default=nw=1:nk=1 /tmp/mire.mp4 2>/dev/null)
  echo "  durée lue par ffprobe : ${DUREE:-<rien>}"
  if [ "${DUREE%%.*}" = "$MESURE_ATTENDUE" ]; then
    ok "ffprobe LIT une durée : ${DUREE} s (attendu ${MESURE_ATTENDUE})"
    echo "  ⭐ C'est cette seule mesure qui permet au plafond de 180 minutes de"
    echo "     BORNER quelque chose. Sur le poste, elle rendait 0."
  else
    ko "ffprobe ne rend pas la durée attendue (${DUREE:-<rien>} au lieu de ${MESURE_ATTENDUE})"
  fi
  # Et la borne elle-même : 3 s est bien SOUS 180 min.
  if awk -v d="${DUREE:-0}" 'BEGIN { exit !(d + 0 < 10800) }'; then
    ok "la durée est comparable à un plafond (3 s < 180 min) — la comparaison est possible"
  else
    ko "la durée est inexploitable pour comparer à un plafond"
  fi
fi

titre "3. python3, ET LE PIÈGE PEP 668"
if python3 -c 'import sys, json, hashlib; print("  python", sys.version.split()[0], "— json et hashlib répondent")'; then
  ok "python3 exécute du code, pas seulement --version"
else
  ko "python3 n'exécute pas de code"
fi
if pip3 install --dry-run nonexistent-paquet-de-test >/dev/null 2>&1; then
  echo "  (pip a accepté un --dry-run : environnement non verrouillé)"
else
  echo "  pip3 refuse l'installation directe — c'est le comportement ATTENDU"
  echo "  (PEP 668 « externally managed ») : un venv est fourni pour ça."
fi
if python3 -m venv /tmp/venv-epreuve >/dev/null 2>&1 && /tmp/venv-epreuve/bin/python -m pip --version >/dev/null 2>&1; then
  ok "python3 -m venv fonctionne et pip répond DANS le venv"
else
  ko "impossible de créer un venv utilisable — les outils Python du studio ne pourraient pas s'installer"
fi

titre "4. ripgrep ET jq FONT LE TRAVAIL POUR LEQUEL ILS SONT LÀ"
echo '{"verrous": 14, "tenus": 14}' > /tmp/essai.json
if [ "$(jq -r '.tenus' /tmp/essai.json)" = "14" ]; then
  ok "jq lit une valeur dans un JSON (c'est ce que fait la commande unique sur resume.json)"
else
  ko "jq ne lit pas le JSON"
fi
echo 'Les 14 verrous sont tenus.' > /tmp/essai.txt
N=$(rg -o --no-filename 'Les ([0-9]+) verrous sont tenus' -r '$1' /tmp/essai.txt | head -1)
if [ "$N" = "14" ]; then
  ok "rg extrait un compte par motif (c'est l'assertion de structure de l'audit)"
else
  ko "rg n'extrait pas le compte (rendu : '${N:-<rien>}')"
fi

titre "5. LES ACCENTS SURVIVENT AU TRAJET (français, accents compris)"
fichier="/tmp/accents-éàüç.md"
printf 'Vérification : éàüç, « citer n est pas utiliser », 和誠美実動私\n' > "$fichier"
LU=$(cat "$fichier")
echo "  relu : $LU"
case "$LU" in
  *"éàüç"*) ok "les accents sont intacts dans le système de fichiers" ;;
  *) ko "les accents sont abîmés" ;;
esac

echo
echo "==============================================================="
echo "  BILAN : $ECHECS épreuve(s) en échec"
echo "==============================================================="
[ "$ECHECS" -eq 0 ] || exit 1
