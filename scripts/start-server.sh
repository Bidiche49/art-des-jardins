#!/bin/bash
# Demarre le serveur vitrine en arriere-plan.
# Usage standalone: bash start-server.sh
# (L'app Swift gere son propre serveur, ce script est pour usage manuel)

export PATH="/usr/local/bin:/opt/homebrew/bin:$PATH"
DOSSIER="$HOME/art-des-jardins"
STATUS="/tmp/art-des-jardins.status"
LOG="/tmp/art-des-jardins.log"

echo "setup" > "$STATUS"

cd "$DOSSIER" || { echo "error:Dossier introuvable" > "$STATUS"; exit 1; }

# Tuer un ancien serveur AVANT de nettoyer le cache
lsof -ti:3001 | xargs kill 2>/dev/null
sleep 1

# Mise a jour
git pull --quiet 2>>"$LOG"

# Installation des dependances
if ! pnpm install >> "$LOG" 2>&1; then
    echo "error:Installation echouee" > "$STATUS"
    exit 1
fi

# Nettoyer le cache Next.js APRES avoir tue le serveur
rm -rf "$DOSSIER/apps/vitrine/.next"

echo "running" > "$STATUS"

# Lancer le serveur en arriere-plan
nohup pnpm dev:vitrine >> "$LOG" 2>&1 &
echo $! > /tmp/art-des-jardins.pid
