#!/bin/bash
# Demarre le serveur vitrine en arriere-plan.
# Appele par Art des Jardins.app - ne pas lancer directement.

export PATH="/usr/local/bin:$PATH"
DOSSIER="$HOME/Desktop/art-des-jardins"

cd "$DOSSIER" || exit 1

# Mise a jour silencieuse
git pull --quiet 2>/dev/null
pnpm install --silent 2>/dev/null

# Tuer un ancien serveur sur le port 3001
lsof -ti:3001 | xargs kill 2>/dev/null
sleep 1

# Lancer le serveur en arriere-plan
nohup pnpm dev:vitrine > /tmp/art-des-jardins.log 2>&1 &
echo $! > /tmp/art-des-jardins.pid
