#!/bin/bash
# WMB Bible d'étude — Script de lancement Mac / Linux
# Lance un serveur HTTP local et ouvre le navigateur

PORT=8080
DIR="$(cd "$(dirname "$0")" && pwd)"

echo ""
echo "============================================"
echo "  WMB Bible d'étude - Élie le Prophète"
echo "  Serveur local hors ligne sur http://localhost:$PORT"
echo "============================================"
echo ""
echo "Laissez ce terminal ouvert. Fermez-le (Ctrl+C) pour arrêter."
echo ""

cd "$DIR"

open_browser() {
  sleep 1
  if command -v xdg-open >/dev/null 2>&1; then
    xdg-open "http://localhost:$PORT"
  elif command -v open >/dev/null 2>&1; then
    open "http://localhost:$PORT"
  fi
}

if command -v python3 >/dev/null 2>&1; then
  open_browser &
  exec python3 -m http.server "$PORT"
elif command -v python >/dev/null 2>&1; then
  open_browser &
  exec python -m http.server "$PORT"
elif command -v php >/dev/null 2>&1; then
  open_browser &
  exec php -S "localhost:$PORT"
elif command -v npx >/dev/null 2>&1; then
  open_browser &
  exec npx --yes http-server -p "$PORT" -c-1
else
  echo "ERREUR : Installez Python 3 (https://www.python.org/),"
  echo "puis relancez ce script."
  echo ""
  echo "Vous pouvez aussi double-cliquer sur index.html directement"
  echo "(mode basique sans Service Worker hors ligne)."
  exit 1
fi
