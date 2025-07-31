@echo off
REM Inicia el backend en una nueva ventana
start cmd /k "cd /d %~dp0server && npm run dev"

REM Inicia el frontend en otra nueva ventana
start cmd /k "cd /d %~dp0client && npm start"