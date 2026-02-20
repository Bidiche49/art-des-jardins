#!/bin/bash
# Script intermediaire appele par Art des Jardins.app
# Ne pas lancer directement.

DOSSIER="$HOME/Desktop/art-des-jardins"
export PATH="/usr/local/bin:$PATH"

cd "$DOSSIER" || exit 1

clear
echo ""
echo "  ========================================"
echo "  Art des Jardins"
echo "  ========================================"
echo ""

echo "  Mise a jour..."
git pull --quiet 2>/dev/null
pnpm install --silent 2>/dev/null
echo "  OK"
echo ""
echo "  Demarrage du site..."
echo "  Le navigateur va s'ouvrir automatiquement."
echo ""
echo "  Pour arreter le site : fermez cette fenetre."
echo "  ========================================"
echo ""

# Ouvrir le navigateur des que le serveur repond
(
    while ! curl -s http://localhost:3001 >/dev/null 2>&1; do
        sleep 1
    done
    open http://localhost:3001
) &

pnpm dev:vitrine
