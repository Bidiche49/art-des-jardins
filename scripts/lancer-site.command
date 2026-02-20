#!/bin/bash
# =============================================================
#  Art des Jardins - Lancer le site vitrine
#  Double-clique sur ce fichier pour l'executer.
# =============================================================

DOSSIER="$HOME/Desktop/art-des-jardins"

# S'assurer que node/pnpm sont dans le PATH
export PATH="/usr/local/bin:$PATH"

echo ""
echo "========================================"
echo "  Art des Jardins - Site vitrine"
echo "========================================"
echo ""

cd "$DOSSIER" 2>/dev/null || {
    echo "ERREUR : Le dossier art-des-jardins n'est pas sur le Bureau."
    echo ""
    echo "Appuie sur une touche pour fermer."
    read -n 1
    exit 1
}

# Ouvrir le navigateur des que le serveur est pret
(
    while ! curl -s http://localhost:3001 >/dev/null 2>&1; do
        sleep 1
    done
    open http://localhost:3001
) &

echo "  Demarrage du site..."
echo "  Le navigateur va s'ouvrir automatiquement."
echo ""
echo "  Pour arreter : ferme cette fenetre."
echo ""

pnpm dev:vitrine
