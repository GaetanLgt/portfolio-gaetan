@echo off
chcp 65001 >nul
title GL Tower - Stack Agentique
cd /d "%~dp0"

echo.
echo ════════════════════════════════════════════════════
echo    GL TOWER - Stack Agentique
echo    13 Agents IA - Infrastructure Docker
echo ════════════════════════════════════════════════════
echo.

if "%1"=="" goto menu
if "%1"=="install" goto install
if "%1"=="start" goto start
if "%1"=="stop" goto stop
if "%1"=="status" goto status
if "%1"=="logs" goto logs
goto menu

:menu
echo  Commandes disponibles:
echo.
echo    1. install  - Installation complete
echo    2. start    - Demarrer la stack
echo    3. stop     - Arreter la stack
echo    4. status   - Voir le status
echo    5. logs     - Voir les logs
echo    6. models   - Telecharger modeles IA
echo    0. exit     - Quitter
echo.
set /p choice="Choix: "

if "%choice%"=="1" goto install
if "%choice%"=="2" goto start
if "%choice%"=="3" goto stop
if "%choice%"=="4" goto status
if "%choice%"=="5" goto logs
if "%choice%"=="6" goto models
if "%choice%"=="0" exit
goto menu

:install
echo.
echo [INFO] Installation de la stack GL Tower...
echo.

if not exist ".env" (
    echo [INFO] Creation du fichier .env...
    copy .env.example .env
    echo [WARN] Editez .env pour modifier les mots de passe!
    pause
)

echo [INFO] Demarrage PostgreSQL + Redis...
docker compose up -d postgres redis
timeout /t 10 /nobreak >nul

echo [INFO] Demarrage ChromaDB...
docker compose up -d chromadb
timeout /t 5 /nobreak >nul

echo [INFO] Demarrage Ollama...
docker compose up -d ollama
timeout /t 5 /nobreak >nul

echo [INFO] Demarrage n8n + OpenWebUI + Monitoring...
docker compose up -d n8n n8n-worker openwebui prometheus grafana loki node-exporter
timeout /t 10 /nobreak >nul

echo [INFO] Demarrage Vault...
docker compose up -d vault registry

echo.
echo [OK] Stack GL Tower deployee!
echo.
goto urls

:start
echo.
echo [INFO] Demarrage de la stack...
docker compose up -d
echo [OK] Stack demarree
goto urls

:stop
echo.
echo [INFO] Arret de la stack...
docker compose down
echo [OK] Stack arretee
goto end

:status
echo.
docker compose ps
echo.
docker stats --no-stream --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}"
goto urls

:logs
echo.
echo [INFO] Logs en temps reel (Ctrl+C pour quitter)
docker compose logs -f
goto end

:models
echo.
echo [INFO] Telechargement des modeles Ollama...
echo [INFO] Cela peut prendre plusieurs minutes...
echo.
docker exec -it gl-ollama ollama pull mistral
docker exec -it gl-ollama ollama pull llama3.2
docker exec -it gl-ollama ollama pull nomic-embed-text
echo.
echo [OK] Modeles installes!
docker exec -it gl-ollama ollama list
goto end

:urls
echo.
echo ════════════════════════════════════════════════════
echo    URLs des services:
echo ════════════════════════════════════════════════════
echo.
echo    JARVIS (n8n)       http://localhost:5678
echo    FRIDAY (Chat)      http://localhost:3000
echo    ULTRON (Grafana)   http://localhost:3001
echo    ULTRON (Prometheus) http://localhost:9090
echo    EDITH (Vault)      http://localhost:8200
echo    ZOLA (ChromaDB)    http://localhost:8000
echo    Ollama API         http://localhost:11434
echo.

:end
pause
