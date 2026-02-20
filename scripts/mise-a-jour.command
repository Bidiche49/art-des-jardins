#!/bin/bash
# =============================================================
#  Art des Jardins - Mettre a jour et lancer le site
#  Double-clique sur ce fichier pour l'executer.
# =============================================================

DOSSIER="$HOME/Desktop/art-des-jardins"

echo ""
echo "========================================"
echo "  Art des Jardins - Mise a jour"
echo "========================================"
echo ""

cd "$DOSSIER" || {
    echo "ERREUR : Le dossier art-des-jardins n'est pas sur le Bureau."
    echo "Appuie sur une touche pour fermer."
    read -n 1
    exit 1
}

echo "[1/3] Recuperation des derniers changements..."
git pull
echo "      OK"
echo ""

echo "[2/3] Mise a jour des dependances..."
pnpm install --silent
echo "      OK"
echo ""

echo "[3/3] Lancement du site..."
echo ""
echo "========================================"
echo "  Le site demarre !"
echo "  Ouvre ton navigateur sur :"
echo ""
echo "  http://localhost:3001"
echo ""
echo "  Pour arreter : ferme cette fenetre"
echo "========================================"
echo ""

pnpm dev:vitrine
