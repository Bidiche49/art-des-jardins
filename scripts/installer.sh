#!/bin/bash
# =============================================================
#  Art des Jardins - Installation automatique du site vitrine
#  Lance ce script une seule fois. Il installe tout et ouvre le site.
# =============================================================

REPO_URL="https://github.com/Bidiche49/art-des-jardins.git"
DOSSIER="$HOME/Desktop/art-des-jardins"

set -e

echo ""
echo "========================================"
echo "  Art des Jardins - Installation"
echo "========================================"
echo ""

# -------------------------------------------------------
# 1. Xcode Command Line Tools (inclut git)
# -------------------------------------------------------
if ! xcode-select -p &>/dev/null; then
    echo "[1/5] Installation de git..."
    echo "      Une fenetre va s'ouvrir. Clique sur 'Installer'."
    echo ""
    xcode-select --install 2>/dev/null

    # Attendre que l'installation soit terminee
    echo "      En attente de la fin de l'installation..."
    until xcode-select -p &>/dev/null; do
        sleep 5
    done
    echo "      OK"
else
    echo "[1/5] Git ................................ deja installe"
fi

# -------------------------------------------------------
# 2. Node.js (via installeur officiel .pkg)
# -------------------------------------------------------
if ! command -v node &>/dev/null; then
    echo "[2/5] Installation de Node.js..."
    echo "      Telechargement en cours (ca peut prendre 1-2 min)..."

    NODE_PKG_URL="https://nodejs.org/dist/v22.14.0/node-v22.14.0.pkg"
    curl -sL "$NODE_PKG_URL" -o /tmp/node.pkg

    echo "      Installation... (ton mot de passe Mac sera demande)"
    sudo installer -pkg /tmp/node.pkg -target / >/dev/null 2>&1
    rm /tmp/node.pkg

    # Recharger le PATH pour cette session
    export PATH="/usr/local/bin:$PATH"
    echo "[2/5] Node.js ............................ OK ($(node --version))"
else
    echo "[2/5] Node.js ............................ deja installe ($(node --version))"
fi

# -------------------------------------------------------
# 3. pnpm
# -------------------------------------------------------
if ! command -v pnpm &>/dev/null; then
    echo "[3/5] Installation de pnpm..."
    npm install -g pnpm --silent 2>/dev/null || sudo npm install -g pnpm --silent
    echo "[3/5] pnpm ............................... OK"
else
    echo "[3/5] pnpm ............................... deja installe"
fi

# -------------------------------------------------------
# 4. Telecharger le projet
# -------------------------------------------------------
if [ -d "$DOSSIER" ]; then
    echo "[4/5] Projet deja present sur le Bureau .. OK"
    cd "$DOSSIER"
    git pull --quiet
else
    echo "[4/5] Telechargement du projet..."
    git clone --quiet "$REPO_URL" "$DOSSIER"
    echo "[4/5] Projet telecharge .................. OK"
fi

# -------------------------------------------------------
# 5. Installer les dependances
# -------------------------------------------------------
echo "[5/5] Installation des dependances (2-3 min)..."
cd "$DOSSIER"
pnpm install --silent
echo "[5/5] Dependances ........................ OK"

# -------------------------------------------------------
# Lancer le site et ouvrir le navigateur
# -------------------------------------------------------
echo ""
echo "========================================"
echo "  Installation terminee !"
echo "  Lancement du site..."
echo "========================================"
echo ""

# Ouvrir le navigateur des que le serveur est pret
(
    while ! curl -s http://localhost:3001 >/dev/null 2>&1; do
        sleep 1
    done
    open http://localhost:3001
) &

echo "  Le navigateur va s'ouvrir automatiquement."
echo "  Pour arreter le site : ferme cette fenetre."
echo ""

pnpm dev:vitrine
