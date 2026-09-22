#!/bin/bash
# ============================================================
# construire-et-verifier.sh — LA FAÇON DE CONSTRUIRE, DÉSORMAIS
# ============================================================
# UN SEUL POINT D'ENTRÉE. UN SEUL CODE DE SORTIE. ET IL REMONTE.
#
#       docker compose run --rm build
#   ou, depuis Windows, sans se soucier du PATH :
#       conteneur\construire.cmd
#
# CE QU'ELLE FAIT, DANS CET ORDRE, ET RIEN D'AUTRE :
#   1. elle recopie l'arbre MONTÉ (`/atelier`) dans `/app` — pour qu'une
#      correction soit prise en compte SANS reconstruire l'image ;
#   2. elle repart d'un `dist/` VIDE (un build ne doit jamais mesurer le
#      `dist` du précédent) ;
#   3. `npm ci` — ou elle DIT pourquoi elle le saute, empreinte à l'appui ;
#   4. les 7 étapes du build, nommées une par une (la chaîne de la CI) ;
#   5. `node scripts/auditer-tout.mjs` — TOUS les verrous, un seul passage ;
#   6. l'empreinte SHA-256 du `dist/`, son nombre de fichiers, et un
#      `resume.json` de mesures, VALIDÉ par `jq` avant d'être rendu.
#
# ⛔ CE QU'ELLE NE FAIT PAS, ET C'EST LE POINT :
#    elle n'avale AUCUN code de sortie. Une version précédente finissait par
#    un `exit 0` « pour ne pas casser la mesure » : il masquait aussi le code
#    du build, et `docker compose run` annonçait un succès sur un build en
#    échec. Ici, un build rouge est rouge, et la porte se ferme.
#
# ⚠️ SI LE BUILD ÉCHOUE, L'AUDIT N'EST PAS LANCÉ, ET ELLE LE DIT. Auditer un
#    `dist/` amputé ferait crier quatorze verrous pour une seule cause — et
#    on chercherait ensuite quatorze pannes au lieu d'une.
# ============================================================

set -u

APP=/app
ATELIER="${ATELIER:-/atelier}"
RAPPORTS="${RAPPORTS:-$APP/rapports}"
DIST_REL="${DIST:-dist}"
DIST="$APP/$DIST_REL"
ETIQUETTE="${ETIQUETTE:-build}"

mkdir -p "$RAPPORTS" || { echo "⛔ $RAPPORTS n'est pas inscriptible."; exit 1; }

# Le journal complet de la mesure, lisible depuis l'hôte quand `RAPPORTS`
# est un dossier monté. Un rapport qu'on croit écrit et qu'on ne retrouve
# pas est pire qu'un rapport absent — donc on vérifie à la fin qu'il existe.
JOURNAL="$RAPPORTS/journal-construire-et-verifier.txt"
exec > >(tee "$JOURNAL") 2>&1

CODE_BUILD=""
CODE_AUDIT=""
CODE_GLOBAL=0
DEBUT=$(date +%s)

# ⛔ `LC_ALL=C` N'EST **PAS** EXPORTÉ GLOBALEMENT, ET C'EST UN DÉFAUT CORRIGÉ.
#    Première version de ce script : `export LC_ALL=C` en tête. Mesure du
#    22/09/2026, dans le tableau des étapes : `column -t` a alors traité les
#    octets UTF-8 comme non imprimables et les a ÉCHAPPÉS —
#    « 1. prebuild \xe2\x80\x94 relever l'\xc3\xa9tat du studio ». Le rapport
#    devenait illisible en français. *Un outil de mise en forme ne doit pas
#    toucher au contenu, et un réglage posé trop large abîme ce qu'il ne
#    visait pas.* `LC_ALL=C` ne sert qu'à DEUX choses : lire les intitulés
#    anglais de `rsync --stats`, et ordonner l'empreinte de façon identique
#    d'une machine à l'autre. Il est donc posé là, et seulement là.

compte() { if [ -d "$1" ]; then find "$1" -type f 2>/dev/null | wc -l | tr -d ' '; else echo 0; fi }
compte_ext() { if [ -d "$1" ]; then find "$1" -name "$2" -type f 2>/dev/null | wc -l | tr -d ' '; else echo 0; fi }
duree() { echo $(( $(date +%s) - $1 )); }

# ⭐ LE COMMIT EST LU SUR L'ARBRE MONTÉ, PAS SUR LA COPIE. `/app` n'a pas de
#    `.git` (il est exclu du contexte de build, et 26,5 Mo d'historique n'ont
#    rien à faire dans une image qui reconstruit le site). Le montage est en
#    LECTURE SEULE : `--no-optional-locks` demande à git de ne rafraîchir
#    aucun fichier d'index, donc de rester en lecture pure.
#    ⚠️ Un commit « inconnu » se DIT : c'est la seule attache entre une mesure
#    et une version du dépôt, et une mesure sans commit n'est pas rejouable.
if [ -d "$ATELIER/.git" ]; then
  COMMIT=$(git --git-dir="$ATELIER/.git" --work-tree="$ATELIER" --no-optional-locks \
             rev-parse --short HEAD 2>/dev/null || echo 'illisible')
else
  COMMIT='inconnu (aucun .git dans le montage)'
fi

echo "==============================================================="
echo "  L'ATELIER STANDARD — construire ET vérifier"
echo "==============================================================="
echo "  date        : $(date '+%Y-%m-%d %H:%M:%S %Z')"
echo "  conteneur   : $(hostname)   (étiquette : $ETIQUETTE)"
echo "  montage     : ${ATELIER} → ${APP}   (le dépôt est MONTÉ, pas copié)"
echo "  rapports    : ${RAPPORTS}"
echo "  commit      : ${COMMIT}"

# ---------------------------------------------------------------
# 0. LA CHAÎNE D'OUTILS — elle PARLE, elle ne se contente pas d'exister
# ---------------------------------------------------------------
echo
echo "--- 0. LA CHAÎNE D'OUTILS ---"
echo "  node      : $(node -v)   npm : $(npm -v)"
echo "  git       : $(git --version 2>&1)"
echo "  ffmpeg    : $(ffmpeg -version 2>&1 | head -1)"
echo "  ffprobe   : $(ffprobe -version 2>&1 | head -1)"
echo "  python3   : $(python3 --version 2>&1)   pip : $(pip3 --version 2>&1 | cut -d' ' -f1-2)"
echo "  ripgrep   : $(rg --version 2>&1 | head -1)"
echo "  jq        : $(jq --version 2>&1)"
echo "  rsync     : $(rsync --version 2>&1 | head -1)"
echo "  chromium  : $(chromium --version 2>&1)  (CHROME_PATH=${CHROME_PATH:-non défini})"

# ---------------------------------------------------------------
# 1. LE MONTAGE — le dépôt vivant entre dans le conteneur
# ---------------------------------------------------------------
echo
echo "--- 1. L'ARBRE DE TRAVAIL MONTÉ ---"
T_DEBUT=$(date +%s)
if [ -f "$ATELIER/package.json" ] && [ -d "$ATELIER/scripts" ]; then
  echo "  montage trouvé : $ATELIER"
  # ⛔ `--delete` SANS `--delete-excluded` : ce qui est EXCLU est PROTÉGÉ de
  #    la suppression. C'est ce qui empêche la synchronisation d'effacer
  #    `node_modules` (installé pour Linux par l'image, alors que celui du
  #    poste est fait de binaires Windows) et le dossier des rapports.
  #
  # ⭐ `.git` EST SYNCHRONISÉ, ET CE N'EST PAS DU POIDS MORT. Mesuré le
  #    22/09/2026 : 380 fichiers, 29 Mo, 6 secondes. En échange, la page
  #    /etat-du-studio PUBLIE le commit de la construction qui vient de
  #    finir au lieu d'écrire « commit : non mesuré ». Sans lui, le site
  #    construit ici serait DIFFÉRENT de celui que la CI déploie, sur une
  #    donnée que le site affiche.
  #    (Le `.git` n'entre PAS dans l'IMAGE — `.dockerignore` l'en exclut, et
  #     c'est très bien : l'image est construite une fois, la mesure est
  #     rejouée à chaque exécution.)
  rsync -rtl --delete --stats --omit-dir-times \
    --exclude 'node_modules/' \
    --exclude 'dist/' \
    --exclude 'rapports/' \
    --exclude 'rapports-conteneur/' \
    --exclude '.venv/' \
    "$ATELIER"/ "$APP"/ > "$RAPPORTS/rsync.log" 2>&1
  CODE_RSYNC=$?
  echo "  code rsync : $CODE_RSYNC  |  durée : $(duree "$T_DEBUT") s"
  # `LC_ALL=C` ICI SEULEMENT : les intitulés de `rsync --stats` sont anglais.
  LC_ALL=C grep -E 'Number of regular files transferred|Total transferred file size' "$RAPPORTS/rsync.log" | sed 's/^/  /'
  # Ce que le site publiera comme commit — mesuré, pas espéré.
  if [ -d "$APP/.git" ]; then
    echo "  commit vu par git dans $APP : $(git -C "$APP" rev-parse --short HEAD 2>&1 | head -1)"
    echo "  git status (arbre)          : $(git -C "$APP" status --porcelain 2>/dev/null | wc -l | tr -d ' ') fichier(s) modifié(s)"
  else
    echo "  ⚠️ pas de .git dans le montage : le site publiera « commit : non mesuré »."
  fi
else
  CODE_RSYNC=0
  echo "  ⚠️ AUCUN MONTAGE sur $ATELIER : on construit les sources GELÉES DANS"
  echo "     L'IMAGE. Ce n'est pas la référence — la référence, c'est l'arbre"
  echo "     vivant. Toute mesure prise ici porte sur le commit de l'image."
fi

# ⭐ L'ASSERTION DE STRUCTURE, APRÈS la synchronisation et pas avant : si le
#    montage a écrasé les scripts du build, on veut le savoir MAINTENANT, pas
#    au milieu de la troisième étape.
for f in package.json package-lock.json scripts/auditer-tout.mjs conteneur/etapes-build.sh; do
  if [ ! -e "$APP/$f" ]; then
    echo "  ⛔ ASSERTION ROMPUE : $f est absent de $APP après synchronisation."
    echo "     Le montage ne contient pas l'atelier attendu. Rien n'a été construit."
    CODE_GLOBAL=1
    exit $CODE_GLOBAL
  fi
done
echo "  ✔ assertion de structure : package.json · package-lock.json ·"
echo "    scripts/auditer-tout.mjs · conteneur/etapes-build.sh sont là."

# ---------------------------------------------------------------
# 2. LE DIST REPART DE ZÉRO
# ---------------------------------------------------------------
echo
echo "--- 2. LE DIST REPART DE ZÉRO ---"
# ⛔ POURQUOI CETTE LIGNE EXISTE. Mesuré le 22/09/2026 : un volume NOMMÉ
#    persistait d'un `docker compose run` à l'autre, donc un build pouvait
#    compter et empreinter le `dist` du PRÉCÉDENT — un build vert qui n'a
#    rien produit. Ici le `dist` est dans le conteneur (jetable), et on le
#    vide quand même : ce qui n'est pas vidé n'est pas mesuré.
DIST_AVANT=$(compte "$DIST")
rm -rf "$DIST"
DIST_APRES=$(compte "$DIST")
echo "  dist/ avant nettoyage : $DIST_AVANT fichier(s)"
if [ "$DIST_AVANT" -gt 0 ]; then
  echo "  ⚠️ il y AVAIT un dist : c'est exactement ce qui faisait mesurer le"
  echo "     build précédent. Il vient d'être supprimé, exprès."
fi
echo "  dist/ après nettoyage : $DIST_APRES fichier(s)"

# ---------------------------------------------------------------
# 3. npm ci — ou la raison mesurée de ne pas le refaire
# ---------------------------------------------------------------
echo
echo "--- 3. LES DÉPENDANCES (npm ci) ---"
T_DEBUT=$(date +%s)
CLE_LOCK=$(sha256sum "$APP/package-lock.json" | cut -d' ' -f1)
CLE_IMAGE=$(cat /opt/atelier/empreinte-package-lock.txt 2>/dev/null || echo 'aucune')
MOTIF=''
if [ ! -d "$APP/node_modules" ]; then MOTIF='node_modules absent'; fi
if [ ! -x "$APP/node_modules/.bin/vite" ]; then MOTIF="${MOTIF}${MOTIF:+ · }vite introuvable"; fi
if [ "$CLE_LOCK" != "$CLE_IMAGE" ]; then MOTIF="${MOTIF}${MOTIF:+ · }le lock a changé"; fi
if [ "${FORCER_NPM_CI:-0}" = "1" ]; then MOTIF="${MOTIF}${MOTIF:+ · }FORCER_NPM_CI=1"; fi

if [ -n "$MOTIF" ]; then
  echo "  npm ci EST EXÉCUTÉ — motif : $MOTIF"
  echo "  empreinte du lock : ${CLE_LOCK:0:16} (gravée dans l'image : ${CLE_IMAGE:0:16})"
  npm ci --no-audit --no-fund > "$RAPPORTS/npm-ci.log" 2>&1
  CODE_NPM=$?
  echo "  code npm ci : $CODE_NPM  |  durée : $(duree "$T_DEBUT") s"
  if [ "$CODE_NPM" -ne 0 ]; then
    echo "  ⛔ npm ci a échoué — la chaîne s'arrête ici, et rien ne sera vert."
    tail -12 "$RAPPORTS/npm-ci.log" | sed 's/^/    /'
    CODE_BUILD=$CODE_NPM
  fi
else
  echo "  npm ci est SAUTÉ, et voici la mesure qui le permet :"
  echo "    l'image a installé cet arbre AVEC CE LOCK-LÀ (empreinte identique :"
  echo "    ${CLE_LOCK:0:16}), et \`node_modules/.bin/vite\` est exécutable."
  echo "    Refaire l'installation ne changerait pas un octet — \`npm ci\` est"
  echo "    déterministe sur un lock, qui porte les empreintes d'intégrité."
  echo "    ⚠️ Pour la forcer quand même : FORCER_NPM_CI=1"
fi

# ---------------------------------------------------------------
# 4. LE BUILD — les 7 étapes, nommées, une par une
# ---------------------------------------------------------------
echo
echo "--- 4. LE BUILD (7 étapes, la chaîne de la CI) ---"
if [ -n "$CODE_BUILD" ]; then
  echo "  ⛔ ÉTAPE SAUTÉE : les dépendances ne sont pas là."
else
  # ⭐ LA CHAÎNE EST CELLE DE LA CI, PAS `npm run build`.
  #    Mesure du 22/09/2026, dans `.github/workflows/deploy.yml` : la CI
  #    N'APPELLE PAS `npm run build` — elle exécute les sept étapes
  #    explicitement, « et ce n'est pas cosmétique » : `npm run build` a
  #    échoué en CI sans que GitHub puisse nommer la commande coupable.
  #    L'atelier reproduit donc la chaîne RÉELLE de la production, étape par
  #    étape — c'est `conteneur/etapes-build.sh` qui la porte, une seule fois.
  # ⭐ `NODE_ENV=production` est posé ICI et seulement ici : la CI le pose
  #    pour son build, et le Dockerfile ne peut pas le poser globalement (il
  #    ferait sauter les devDependencies dont `vite build` a besoin).
  export NODE_ENV=production
  T_BUILD=$(date +%s)
  bash "$APP/conteneur/etapes-build.sh"
  CODE_BUILD=$?
  DUREE_BUILD=$(duree "$T_BUILD")
  echo "  → code du build : $CODE_BUILD  |  durée : ${DUREE_BUILD} s"
fi

# ---------------------------------------------------------------
# 5. L'AUDIT — TOUS les verrous, un seul passage
# ---------------------------------------------------------------
echo
echo "--- 5. LES VERROUS (scripts/auditer-tout.mjs) ---"
AUDIT="$RAPPORTS/audit-verrous.txt"
if [ "$CODE_BUILD" != "0" ]; then
  echo "  ⛔ AUDIT NON LANCÉ : le build est en échec (code $CODE_BUILD)."
  echo "     Auditer un dist amputé ferait crier les verrous pour UNE cause, et"
  echo "     on chercherait ensuite quatorze pannes au lieu d'une. Corriger le"
  echo "     build d'abord : le tableau des 7 étapes est dans"
  echo "     $RAPPORTS/build-etapes.txt."
  CODE_AUDIT="non lancé"
  CODE_GLOBAL=$CODE_BUILD
else
  T_AUDIT=$(date +%s)
  node "$APP/scripts/auditer-tout.mjs" 2>&1 | tee "$AUDIT"
  CODE_AUDIT=${PIPESTATUS[0]}
  DUREE_AUDIT=$(duree "$T_AUDIT")
  echo "  → code de l'audit : $CODE_AUDIT  |  durée : ${DUREE_AUDIT} s"

  # ⭐ LES ASSERTIONS DE STRUCTURE. Le verdict est LU DANS LE JOURNAL, et il
  #    est confronté à trois choses : le nombre de verrous découverts, le
  #    nombre de fichiers `scripts/verifier-*.mjs` réellement présents, et le
  #    code de sortie de l'audit. Si l'une des trois ne colle pas, on ne
  #    devine pas : on s'arrête. *Un verdict illisible n'est pas un verdict.*
  VERROUS_DECOUVERTS=$(rg -o --no-filename '([0-9]+) verrou\(x\) découvert' -r '$1' "$AUDIT" | head -1)
  VERROUS_TENUS=$(rg -o --no-filename 'Les ([0-9]+) verrous sont tenus' -r '$1' "$AUDIT" | head -1)
  VERROUS_FICHIERS=$(ls -1 "$APP"/scripts/verifier-*.mjs 2>/dev/null | wc -l | tr -d ' ')
  echo "  verrous présents dans scripts/ : $VERROUS_FICHIERS"
  echo "  verrous découverts par l'audit : ${VERROUS_DECOUVERTS:-ILLISIBLE}"
  echo "  verrous tenus (verdict)        : ${VERROUS_TENUS:-aucun verdict}"

  if [ -z "$VERROUS_DECOUVERTS" ]; then
    echo "  ⛔ ASSERTION ROMPUE : le verdict de l'audit est ILLISIBLE."
    echo "     Le journal est dans $AUDIT. On ne conclut pas sur un texte absent."
    CODE_GLOBAL=1
  else
    if [ "$VERROUS_DECOUVERTS" != "$VERROUS_FICHIERS" ]; then
      echo "  ⛔ ASSERTION ROMPUE : l'audit a découvert $VERROUS_DECOUVERTS verrou(s),"
      echo "     mais scripts/ en contient $VERROUS_FICHIERS. Des verrous ne sont donc"
      echo "     PAS lancés — *un verrou jamais lancé n'est pas un verrou.*"
      CODE_GLOBAL=1
    fi
    if [ "$CODE_AUDIT" = "0" ] && [ "${VERROUS_TENUS:-}" != "$VERROUS_DECOUVERTS" ]; then
      echo "  ⛔ ASSERTION ROMPUE : l'audit sort en code 0 mais son verdict ne dit"
      echo "     pas que les $VERROUS_DECOUVERTS verrous sont tenus. L'un des deux ment."
      CODE_GLOBAL=1
    fi
    if [ "$CODE_AUDIT" != "0" ]; then
      echo "  ⛔ $((VERROUS_DECOUVERTS - ${VERROUS_TENUS:-0})) verrou(x) ne passent pas."
      CODE_GLOBAL=$CODE_AUDIT
    fi
  fi
fi

# ---------------------------------------------------------------
# 6. L'EMPREINTE DU DIST — la mesure qui se rejoue
# ---------------------------------------------------------------
echo
echo "--- 6. L'EMPREINTE DU DIST ---"
EMPREINTE="$RAPPORTS/empreinte-dist.txt"
MANIFESTE='aucun'
DIST_FICHIERS=$(compte "$DIST")
DIST_HTML=$(compte_ext "$DIST" '*.html')
if [ -f "$DIST/index.html" ]; then
  # On hache le CONTENU (pas les dates : elles changent à chaque build et ne
  # disent rien de la reproductibilité). `sort -z` + `xargs -0` : les noms de
  # fichiers du site contiennent des espaces et des accents.
  ( cd "$DIST" && find . -type f -print0 | sort -z | xargs -0 sha256sum ) > "$EMPREINTE" 2>/dev/null
  MANIFESTE=$(sha256sum "$EMPREINTE" | cut -c1-16)
  echo "  fichiers dans dist/ : $DIST_FICHIERS   dont pages HTML : $DIST_HTML"
  echo "  lignes d'empreinte  : $(wc -l < "$EMPREINTE" | tr -d ' ')"
  echo "  empreinte du manifeste : $MANIFESTE"
  echo "  fichier : $EMPREINTE"
else
  echo "  ⛔ dist/index.html ABSENT : aucune empreinte possible."
  echo "     Un dist sans page d'accueil n'est pas un site construit."
  [ "$CODE_GLOBAL" = "0" ] && CODE_GLOBAL=1
fi

# ---------------------------------------------------------------
# 7. LA SORTIE — le dist pour le regarder, et le résumé des mesures
# ---------------------------------------------------------------
echo
echo "--- 7. LA SORTIE ---"
T_COPIE=$(date +%s)
if [ -d "$DIST" ]; then
  rm -rf "$RAPPORTS/dist"
  cp -a "$DIST" "$RAPPORTS/dist" 2>/dev/null
  echo "  dist/ recopié dans $RAPPORTS/dist ($(compte "$RAPPORTS/dist") fichier(s), $(duree "$T_COPIE") s)"
  echo "  → pour le regarder : docker compose up serve  puis http://localhost:8088"
fi

DUREE_TOTALE=$(duree "$DEBUT")
RESUME="$RAPPORTS/resume.json"
# `null` (et non 0) quand une étape n'a PAS tourné : « non mesuré » n'est pas
# « mesuré à zéro », et un zéro écrit à la place d'une absence fait croire à
# un succès. C'est la distinction que le studio paie à chaque fois.
if [ -n "$CODE_BUILD" ]; then JSON_BUILD="$CODE_BUILD"; else JSON_BUILD=null; fi
if [ -z "$CODE_AUDIT" ] || [ "$CODE_AUDIT" = "non lancé" ]; then JSON_AUDIT=null; else JSON_AUDIT="$CODE_AUDIT"; fi
jq -n \
  --arg date "$(date -Is)" \
  --arg etiquette "$ETIQUETTE" \
  --arg conteneur "$(hostname)" \
  --arg commit "$COMMIT" \
  --arg emit "conteneur/construire-et-verifier.sh" \
  --arg node "$(node -v)" \
  --arg npm "$(npm -v)" \
  --arg ffprobe "$(ffprobe -version 2>&1 | head -1)" \
  --arg python3 "$(python3 --version 2>&1)" \
  --argjson code_build "$JSON_BUILD" \
  --argjson code_audit "$JSON_AUDIT" \
  --argjson code_global "$CODE_GLOBAL" \
  --argjson verrous_fichiers "$VERROUS_FICHIERS" \
  --argjson verrous_decouverts "${VERROUS_DECOUVERTS:-null}" \
  --argjson verrous_tenus "${VERROUS_TENUS:-null}" \
  --argjson dist_fichiers "$DIST_FICHIERS" \
  --argjson dist_html "$DIST_HTML" \
  --argjson dist_avant_nettoyage "$DIST_AVANT" \
  --arg empreinte_manifeste "$MANIFESTE" \
  --argjson duree_totale_s "$DUREE_TOTALE" \
  '{
     date: $date,
     etiquette: $etiquette,
     conteneur: $conteneur,
     commit: $commit,
     outil: $emit,
     outillage: { node: $node, npm: $npm, ffprobe: $ffprobe, python3: $python3 },
     build: { code: $code_build },
     audit: { code: $code_audit, verrous_fichiers: $verrous_fichiers,
              verrous_decouverts: $verrous_decouverts, verrous_tenus: $verrous_tenus },
     dist: { fichiers: $dist_fichiers, html: $dist_html,
             avant_nettoyage: $dist_avant_nettoyage,
             empreinte_manifeste: $empreinte_manifeste },
     code_global: $code_global,
     duree_totale_s: $duree_totale_s
   }' > "$RESUME" 2>"$RAPPORTS/jq-erreur.txt"

# ⭐ ON VÉRIFIE LE RAPPORT AVANT DE LE RENDRE. Un résumé de mesures illisible
#    serait cru sur parole. `jq -e .` échoue si le JSON est invalide — et
#    c'est justement pour ça que `jq` est dans cette image.
if jq -e . "$RESUME" > /dev/null 2>&1; then
  echo "  resume.json : VALIDE ($(wc -c < "$RESUME" | tr -d ' ') octets) → $RESUME"
else
  echo "  ⛔ resume.json INVALIDE — l'erreur de jq est dans $RAPPORTS/jq-erreur.txt"
  CODE_GLOBAL=1
fi

echo
echo "==============================================================="
if [ "$CODE_GLOBAL" = "0" ]; then
  echo "  VERDICT : VERT — les ${VERROUS_TENUS:-?} verrous sont tenus,"
  echo "            ${DIST_FICHIERS} fichiers dans dist/, ${DIST_HTML} pages HTML."
else
  echo "  VERDICT : ROUGE — code de sortie ${CODE_GLOBAL}."
  echo "            build : ${CODE_BUILD:-non lancé} · audit : ${CODE_AUDIT:-non lancé}"
fi
echo "  durée totale : ${DUREE_TOTALE} s"
echo "  journal      : $JOURNAL (${RAPPORTS})"
echo "==============================================================="

# `tee` est un processus séparé : cette attente lui laisse le temps de vider
# son tampon avant que le conteneur ne meure. Sans elle, les dernières lignes
# du journal manquent — et un journal tronqué fait douter d'un verdict juste.
sleep 0.3
exit "$CODE_GLOBAL"
