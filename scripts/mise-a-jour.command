#!/bin/bash
# =============================================================
#  Art des Jardins - Mettre a jour et lancer le site
#  Double-clique sur ce fichier pour l'executer.
# =============================================================

DOSSIER="$HOME/Desktop/art-des-jardins"

# S'assurer que node/pnpm/git sont dans le PATH
export PATH="/usr/local/bin:$PATH"

echo ""
echo "========================================"
echo "  Art des Jardins - Mise a jour"
echo "========================================"
echo ""

cd "$DOSSIER" 2>/dev/null || {
    echo "ERREUR : Le dossier art-des-jardins n'est pas sur le Bureau."
    echo ""
    echo "Appuie sur une touche pour fermer."
    read -n 1
    exit 1
}

echo "  Recuperation des derniers changements..."
git pull --quiet
echo "  OK"
echo ""

echo "  Mise a jour des dependances..."
pnpm install --silent
echo "  OK"
echo ""

# Ouvrir le navigateur des que le serveur est pret
(
    while ! curl -s http://localhost:3001 >/dev/null 2>&1; do
        sleep 1
    done
    open http://localhost:3001
) &

echo "  Lancement du site..."
echo "  Le navigateur va s'ouvrir automatiquement."
echo ""
echo "  Pour arreter : ferme cette fenetre."
echo ""

pnpm dev:vitrine
