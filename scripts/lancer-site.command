#!/bin/bash
# =============================================================
#  Art des Jardins - Lancer le site vitrine
#  Double-clique sur ce fichier pour l'executer.
# =============================================================

DOSSIER="$HOME/Desktop/art-des-jardins"

echo ""
echo "========================================"
echo "  Art des Jardins - Site vitrine"
echo "========================================"
echo ""

cd "$DOSSIER" || {
    echo "ERREUR : Le dossier art-des-jardins n'est pas sur le Bureau."
    echo "Appuie sur une touche pour fermer."
    read -n 1
    exit 1
}

echo "Demarrage du site..."
echo ""
echo "  Ouvre ton navigateur sur :"
echo "  http://localhost:3001"
echo ""
echo "  Pour arreter : ferme cette fenetre"
echo ""

pnpm dev:vitrine
