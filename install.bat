@echo off
chcp 65001 >nul
title GL Digital Lab - Installation

echo.
echo ================================================
echo    GL DIGITAL LAB - Portfolio Setup
echo    GL Tower ^| 13 Agents IA
echo ================================================
echo.

cd /d "C:\Users\neosp\Desktop\portfolio-gaetan"

echo [INFO] Verification des prerequis...
echo.

node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERREUR] Node.js non installe
    echo          Telecharger: https://nodejs.org/
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node -v') do set NODE_VER=%%i
echo [OK] Node.js: %NODE_VER%

for /f "tokens=*" %%i in ('npm -v') do set NPM_VER=%%i
echo [OK] npm: v%NPM_VER%

echo.
echo [INFO] Installation des dependances...
echo.

call npm install

if %errorlevel% neq 0 (
    echo.
    echo [ERREUR] Echec de l'installation
    pause
    exit /b 1
)

echo.
echo ================================================
echo    Installation terminee!
echo ================================================
echo.
echo Commandes disponibles:
echo   npm run dev      - Serveur de dev
echo   npm run build    - Build production
echo.
echo URLs:
echo   http://localhost:5173
echo   http://localhost:5173/hub
echo.

set /p STARTDEV="Lancer le serveur de dev? (O/n): "

if /i "%STARTDEV%"=="" goto startserver
if /i "%STARTDEV%"=="o" goto startserver
if /i "%STARTDEV%"=="y" goto startserver
goto end

:startserver
echo.
echo Demarrage du serveur...
echo.
call npm run dev
goto end

:end
pause
