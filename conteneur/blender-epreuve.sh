#!/bin/bash
# ============================================================
# blender-epreuve.sh — ÉPROUVER BLENDER HEADLESS DANS UN CONTENEUR
# ============================================================
# ⛔ CE SCRIPT NE PROMET RIEN : il lance, et il rapporte ce qui est sorti.
#    Lancé le 22/09/2026 depuis EVA-01, dans un conteneur `--gpus all`.
#
# CE QU'IL MESURE, DANS L'ORDRE :
#   1. les bibliothèques X/GL que Blender exige même en mode headless ;
#   2. le téléchargement de l'archive Linux officielle, épinglée par version,
#      avec son empreinte SHA-256 ;
#   3. `blender --background --version` — l'outil parle ;
#   4. ⭐ LE PIÈGE MESURÉ 6 FOIS : un script Python qui lève une ASSERTION
#      fait-il sortir Blender en code non nul ? (réponse attendue : NON)
#   5. ⭐ et son remède : `--python-exit-code 1` change-t-il le code de retour ?
#   6. la liste des périphériques de calcul vus par Cycles (le GPU est-il
#      visible DEPUIS Blender, ou seulement depuis nvidia-smi ?).
# ============================================================
set -u

BLENDER_VERSION="${BLENDER_VERSION:-4.2.1}"
BLENDER_BRANCHE="${BLENDER_BRANCHE:-Blender4.2}"
ARCHIVE="blender-${BLENDER_VERSION}-linux-x64.tar.xz"
DOSSIER="blender-${BLENDER_VERSION}-linux-x64"

echo "==========================================================="
echo "  ÉPREUVE BLENDER HEADLESS — $(date '+%Y-%m-%d %H:%M:%S %Z')"
echo "  version visée : ${BLENDER_VERSION}"
echo "==========================================================="

echo
echo "--- 0. CE QUE LE CONTENEUR EST, ET CE QU'IL VOIT ---"
echo "  hôte      : $(hostname)"
echo "  noyau     : $(uname -sr)"
echo "  nvidia-smi: $(command -v nvidia-smi || echo ABSENT)"
if command -v nvidia-smi >/dev/null 2>&1; then
  nvidia-smi --query-gpu=name,driver_version,memory.total --format=csv,noheader 2>&1 | sed 's/^/  GPU : /'
fi

echo
echo "--- 1. LES BIBLIOTHÈQUES EXIGÉES MÊME EN HEADLESS ---"
export DEBIAN_FRONTEND=noninteractive
apt-get update -qq 2>&1 | tail -2
# `libgl1` (et pas `libgl1-mesa-glx`, retiré d'Ubuntu 22.04) : c'est la
# bibliothèque que Blender ouvre pour parler à l'EGL du pilote NVIDIA.
apt-get install -y -qq --no-install-recommends \
  curl xz-utils ca-certificates \
  libx11-6 libxi6 libxxf86vm1 libxfixes3 libxrender1 libxext6 \
  libgl1 libegl1 libsm6 libice6 libxkbcommon0 libgomp1 \
  > /tmp/apt.log 2>&1
echo "  code apt-get : $?"
tail -1 /tmp/apt.log | sed 's/^/  /'

echo
echo "--- 2. L'ARCHIVE OFFICIELLE, ÉPINGLÉE ---"
cd /tmp || exit 1
URL="https://download.blender.org/release/${BLENDER_BRANCHE}/${ARCHIVE}"
echo "  URL : ${URL}"
if ! curl -fsSL -o "${ARCHIVE}" "${URL}"; then
  echo "  ⛔ téléchargement en échec — voici ce que le dépôt propose réellement :"
  curl -sS "https://download.blender.org/release/${BLENDER_BRANCHE}/" 2>&1 \
    | grep -o 'blender-[0-9.]*-linux-x64\.tar\.xz' | sort -u | head -10 | sed 's/^/    /'
  exit 1
fi
ls -l "${ARCHIVE}" | sed 's/^/  /'
echo "  SHA-256 : $(sha256sum "${ARCHIVE}" | cut -d' ' -f1)"

echo
echo "--- 3. DÉCOMPRESSION ---"
tar -xf "${ARCHIVE}" && echo "  décompressé : ${DOSSIER}  ($(du -sh "${DOSSIER}" | cut -f1))"

echo
echo "--- 4. L'OUTIL PARLE : blender --background --version ---"
./"${DOSSIER}"/blender --background --version 2>&1 | sed 's/^/  /'
echo "  ⚠️ À RETENIR : le code de sortie de cette commande ne dit RIEN de ce"
echo "     que le script a fait. C'est l'épreuve 5 qui le prouve."

echo
echo "--- 5. ⭐ L'ASSERTION QUI NE REND PAS ROUGE ---"
cat > /tmp/epreuve-assertion.py <<'PY'
# Ce script ÉCHOUE volontairement. La question n'est pas de savoir s'il
# échoue, mais si Blender le DIT par son code de sortie.
print("  [script] avant l'assertion")
raise AssertionError("EPREUVE VOLONTAIRE — ce message doit apparaître dans le journal")
PY

echo "  a) sans --python-exit-code :"
./"${DOSSIER}"/blender --background --python /tmp/epreuve-assertion.py > /tmp/log-sans.txt 2>&1
echo "     code de sortie = $?"
grep -c 'EPREUVE VOLONTAIRE' /tmp/log-sans.txt | sed 's/^/     occurrences dans le journal : /'

echo "  b) avec --python-exit-code 7 :"
./"${DOSSIER}"/blender --background --python-exit-code 7 --python /tmp/epreuve-assertion.py > /tmp/log-avec.txt 2>&1
echo "     code de sortie = $?"
grep -c 'EPREUVE VOLONTAIRE' /tmp/log-avec.txt | sed 's/^/     occurrences dans le journal : /'

echo
echo "--- 6. LE GPU VU DEPUIS BLENDER (Cycles) ---"
cat > /tmp/epreuve-gpu.py <<'PY'
import bpy
try:
    prefs = bpy.context.preferences.addons['cycles'].preferences
    prefs.get_devices()
    for d in prefs.devices:
        print("  CYCLES-DEVICE %s | type=%s | use=%s" % (d.name, d.type, d.use))
    print("  CYCLES-COMPUTE %s" % prefs.compute_device_type)
except Exception as e:
    print("  CYCLES-ERREUR %s" % e)
PY
./"${DOSSIER}"/blender --background --python-exit-code 1 --python /tmp/epreuve-gpu.py 2>&1 \
  | grep -E 'CYCLES-' | sed 's/^/  /'
echo "  code de sortie de la sonde GPU = $?"

echo
echo "==========================================================="
echo "  FIN DE L'ÉPREUVE — l'empreinte de l'archive et les codes"
echo "  ci-dessus sont les seules choses qui prouvent quelque chose."
echo "==========================================================="
