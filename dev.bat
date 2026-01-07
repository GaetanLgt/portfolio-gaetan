@echo off
chcp 65001 >nul
title GL Tower - Dev Server
cd /d "C:\Users\neosp\Desktop\portfolio-gaetan"
echo.
echo  GL TOWER - Serveur de Dev
echo  http://localhost:5173
echo.
npm run dev
pause
