@echo off
rem ============================================================
rem  construire.cmd -- LA COMMANDE UNIQUE, DEPUIS WINDOWS
rem ============================================================
rem  Double-cliquable. Elle fait exactement quatre choses :
rem   1. elle remet `docker` dans le PATH (sur ce poste le binaire est sous
rem      C:\Program Files\Docker\Docker\resources\bin, et HORS du PATH des
rem      shells : sans ce dossier, `docker pull` echoue sur
rem      "docker-credential-desktop not found") ;
rem   2. elle construit l'image si elle manque (une seule fois) ;
rem   3. elle lance `docker compose run --rm -T build`, c'est-a-dire la
rem      commande unique : npm ci, les 7 etapes, TOUS les verrous,
rem      l'empreinte ;
rem   4. ELLE REMONTE LE CODE DE SORTIE. Un build rouge est rouge.
rem
rem ------------------------------------------------------------
rem  POURQUOI CE FICHIER EST EN ASCII PUR, SANS UN SEUL ACCENT
rem  (et c'est une MESURE, pas une precaution de principe)
rem
rem  Mesure du 22/09/2026 sur cette machine : avec `chcp 65001` en tete et
rem  des accents dans les commentaires, cmd.exe PERD le `rem` de plusieurs
rem  lignes et les EXECUTE comme des commandes. Le journal a rendu :
rem      'shells' n'est pas reconnu en tant que commande interne
rem      'elle'   n'est pas reconnu ...
rem      'docker-credential-desktop' n'est pas reconnu ...
rem  -- c'est-a-dire le TEXTE de la documentation, pris pour du code. Un
rem  lanceur qui execute ses propres commentaires ne lance rien.
rem
rem  Donc : `chcp 65001` reste (il faut cette page de code pour que le
rem  francais accentue du CONTENEUR s'affiche juste dans la console), mais
rem  CE FICHIER ne contient plus que des octets ASCII. Le francais
rem  accentue vit dans CONTENEUR.md et dans les journaux du conteneur,
rem  qui sont en UTF-8 et s'affichent correctement.
rem
rem  Ce qu'on peut encore faire sur Windows, et c'est tout : REGARDER
rem  (`docker compose up serve` puis http://localhost:8088) et EDITER les
rem  sources. On ne construit plus a la main sur le poste.
rem ============================================================
setlocal

set "DOCKERBIN=C:\Program Files\Docker\Docker\resources\bin"
if exist "%DOCKERBIN%\docker.exe" set "PATH=%DOCKERBIN%;%PATH%"

where docker >nul 2>&1
if errorlevel 1 goto pasdedocker

rem On se place a la racine du depot : docker-compose.yml y est, et
rem conteneur\ est a cote de ce fichier.
pushd "%~dp0.."

rem On ne reconstruit PAS l'image a chaque fois : la construction complete
rem prend des minutes (apt, npm ci, Chromium). On ne la relance que si
rem l'image n'existe pas. Pour la forcer : docker compose build
docker image inspect portfolio-gaetan-build:local >nul 2>&1
if not errorlevel 1 goto imageok
echo.
echo [atelier] image absente : construction (une seule fois, plusieurs minutes)...
echo.
docker compose build
if errorlevel 1 goto buildko
:imageok

echo.
echo [atelier] docker compose run --rm -T build
echo.
docker compose run --rm -T build
set "CODE=%ERRORLEVEL%"

echo.
if not "%CODE%"=="0" goto rouge
echo [atelier] VERDICT : VERT - le site est construit ET les verrous sont tenus.
echo [atelier] pour le regarder :  docker compose up serve   puis  http://localhost:8088
echo [atelier] les rapports      :  ..\_mesures-conteneur\atelier\build\
popd
exit /b 0

:rouge
echo [atelier] VERDICT : ROUGE - code de sortie %CODE%.
echo [atelier] le journal complet est dans ..\_mesures-conteneur\atelier\build\
echo [atelier] le tableau des 7 etapes est dans ...\build-etapes.txt
popd
exit /b %CODE%

:buildko
echo [atelier] ROUGE : la construction de l'image a echoue. Rien n'a ete construit.
popd
exit /b 1

:pasdedocker
echo [atelier] ROUGE : docker est introuvable.
echo [atelier] cherche ici : %DOCKERBIN%\docker.exe
echo [atelier] si Docker Desktop n'est pas lance, lance-le d'abord.
exit /b 127
