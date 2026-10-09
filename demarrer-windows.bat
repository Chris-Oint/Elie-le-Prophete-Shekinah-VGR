@echo off
chcp 65001 >nul
title WMB Bible d'étude - Serveur local hors ligne
echo.
echo ============================================
echo   WMB Bible d’étude
echo   Serveur local hors ligne
echo ============================================
echo.
echo Lancement du serveur sur http://localhost:8080
echo Laissez cette fenêtre ouverte pendant l'utilisation.
echo Fermez-la pour arrêter le serveur (Ctrl+C).
echo.

REM Essayer avec Python, puis avec PHP si Python n'est pas installé
where python >nul 2>&1
if %ERRORLEVEL%==0 (
    start "" http://localhost:8080
    python -m http.server 8080
    goto :eof
)
where python3 >nul 2>&1
if %ERRORLEVEL%==0 (
    start "" http://localhost:8080
    python3 -m http.server 8080
    goto :eof
)
where php >nul 2>&1
if %ERRORLEVEL%==0 (
    start "" http://localhost:8080
    php -S localhost:8080
    goto :eof
)
where npx >nul 2>&1
if %ERRORLEVEL%==0 (
    start "" http://localhost:8080
    npx --yes http-server -p 8080 -c-1
    goto :eof
)

echo.
echo ERREUR : Aucun serveur web trouvé.
echo Installez Python 3 (https://www.python.org/)
echo ou utilisez un outil comme "Live Server" dans VS Code,
echo puis accédez à index.html via http://localhost:8080
echo.
echo Vous pouvez aussi double-cliquer sur index.html directement
echo (mode basique sans Service Worker hors ligne).
echo.
pause
