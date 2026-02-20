#!/bin/bash
# =============================================================
#  Art des Jardins - Installation automatique du site vitrine
#  Envoie ce fichier par mail, le paysagiste n'a qu'a le lancer.
# =============================================================

# ---- CONFIGURATION (a modifier avant d'envoyer) ----
REPO_URL="https://github.com/Bidiche49/art-des-jardins.git"
DOSSIER="$HOME/Desktop/art-des-jardins"
# -----------------------------------------------------

set -e

echo ""
echo "========================================"
echo "  Art des Jardins - Installation"
echo "========================================"
echo ""

# 1. Xcode Command Line Tools (inclut git)
if ! xcode-select -p &>/dev/null; then
    echo "[1/5] Installation des outils de base (git)..."
    echo "      Une fenetre va s'ouvrir, clique sur 'Installer' et attends."
    xcode-select --install
    echo ""
    echo "      Quand l'installation est terminee, relance ce script."
    echo "      (Double-clique dessus a nouveau)"
    echo ""
    exit 0
else
    echo "[1/5] Outils de base (git) .............. OK"
fi

# 2. Node.js
if ! command -v node &>/dev/null; then
    echo "[2/5] Installation de Node.js..."
    echo "      Telechargement en cours..."

    # Detecter architecture Mac (Intel ou Apple Silicon)
    if [[ "$(uname -m)" == "arm64" ]]; then
        NODE_URL="https://nodejs.org/dist/v22.14.0/node-v22.14.0-darwin-arm64.tar.gz"
    else
        NODE_URL="https://nodejs.org/dist/v22.14.0/node-v22.14.0-darwin-x64.tar.gz"
    fi

    curl -sL "$NODE_URL" -o /tmp/node.tar.gz
    sudo mkdir -p /usr/local/lib/nodejs
    sudo tar -xzf /tmp/node.tar.gz -C /usr/local/lib/nodejs
    NODE_DIR=$(tar -tzf /tmp/node.tar.gz | head -1 | cut -f1 -d"/")

    # Ajouter au PATH
    export PATH="/usr/local/lib/nodejs/$NODE_DIR/bin:$PATH"

    # Persister dans le profil shell
    SHELL_PROFILE="$HOME/.zprofile"
    if ! grep -q "nodejs" "$SHELL_PROFILE" 2>/dev/null; then
        echo "export PATH=\"/usr/local/lib/nodejs/$NODE_DIR/bin:\$PATH\"" >> "$SHELL_PROFILE"
    fi

    rm /tmp/node.tar.gz
    echo "[2/5] Node.js ............................ OK ($(node --version))"
else
    echo "[2/5] Node.js ............................ OK ($(node --version))"
fi

# 3. pnpm
if ! command -v pnpm &>/dev/null; then
    echo "[3/5] Installation de pnpm..."
    npm install -g pnpm --silent
    echo "[3/5] pnpm ............................... OK"
else
    echo "[3/5] pnpm ............................... OK"
fi

# 4. Telecharger le projet
if [ -d "$DOSSIER" ]; then
    echo "[4/5] Le projet existe deja sur le Bureau. OK"
else
    echo "[4/5] Telechargement du projet..."
    git clone "$REPO_URL" "$DOSSIER"
    echo "[4/5] Projet telecharge .................. OK"
fi

# 5. Installer les dependances
echo "[5/5] Installation des dependances (2-3 min)..."
cd "$DOSSIER"
pnpm install --silent
echo "[5/5] Dependances ........................ OK"

echo ""
echo "========================================"
echo "  Installation terminee !"
echo "========================================"
echo ""
echo "  Pour lancer le site, double-clique sur :"
echo "  Bureau > art-des-jardins > scripts > lancer-site.command"
echo ""
echo "  Ou dans le Terminal :"
echo "  cd ~/Desktop/art-des-jardins && pnpm dev:vitrine"
echo ""
echo "  Puis ouvre : http://localhost:3001"
echo ""
