#!/bin/sh
# =============================================
# Verification configuration production
# Usage: ./scripts/verify-prod-config.sh [.env]
# =============================================

set -e

ENV_FILE="${1:-.env}"
ERRORS=0
WARNINGS=0

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

ok()   { printf "${GREEN}[OK]${NC} %s\n" "$1"; }
fail() { printf "${RED}[FAIL]${NC} %s\n" "$1"; ERRORS=$((ERRORS + 1)); }
warn() { printf "${YELLOW}[WARN]${NC} %s\n" "$1"; WARNINGS=$((WARNINGS + 1)); }

echo "=========================================="
echo " Verification configuration production"
echo "=========================================="
echo ""

# --- Check .env exists ---
if [ ! -f "$ENV_FILE" ]; then
    fail "Fichier $ENV_FILE introuvable"
    echo ""
    echo "Copier depuis le template :"
    echo "  cp .env.production.example .env"
    exit 1
fi

ok "Fichier $ENV_FILE trouve"

# Load env
set -a
. "$ENV_FILE"
set +a

# --- Helper ---
check_var() {
    VAR_NAME="$1"
    REQUIRED="$2"
    eval VAL="\$$VAR_NAME"

    if [ -z "$VAL" ]; then
        if [ "$REQUIRED" = "required" ]; then
            fail "$VAR_NAME manquant (REQUIS)"
        else
            warn "$VAR_NAME non defini (optionnel)"
        fi
    elif echo "$VAL" | grep -qE '<.*>|GENERATE|PLACEHOLDER'; then
        fail "$VAR_NAME contient un placeholder : $VAL"
    else
        ok "$VAR_NAME configure"
    fi
}

# --- Database ---
echo ""
echo "--- Base de donnees ---"
check_var "DATABASE_URL" required
check_var "POSTGRES_USER" required
check_var "POSTGRES_PASSWORD" required
check_var "POSTGRES_DB" required

# Check password strength
if [ -n "$POSTGRES_PASSWORD" ] && [ ${#POSTGRES_PASSWORD} -lt 16 ]; then
    warn "POSTGRES_PASSWORD court (< 16 chars). Recommande: openssl rand -base64 32"
fi

# --- JWT ---
echo ""
echo "--- JWT Authentication ---"
check_var "JWT_SECRET" required

if [ -n "$JWT_SECRET" ] && [ ${#JWT_SECRET} -lt 64 ]; then
    fail "JWT_SECRET trop court (${#JWT_SECRET} chars, minimum 64)"
fi

check_var "JWT_EXPIRES_IN" optional
check_var "JWT_REFRESH_EXPIRES_IN" optional

# --- Security Secrets ---
echo ""
echo "--- Secrets cryptographiques ---"
check_var "TWO_FACTOR_ENCRYPTION_KEY" required
check_var "BACKUP_ENCRYPTION_KEY" required
check_var "DEVICE_ACTION_SECRET" required

# --- SMTP (Brevo) ---
echo ""
echo "--- SMTP (Brevo) ---"
check_var "SMTP_HOST" required
check_var "SMTP_PORT" optional
check_var "SMTP_USER" required
check_var "SMTP_PASSWORD" required
check_var "SMTP_FROM" required
check_var "CONTACT_RECIPIENT_EMAIL" required
check_var "COMPANY_BCC_EMAIL" optional

# --- S3 Storage ---
echo ""
echo "--- S3 Storage (Scaleway) ---"
check_var "S3_ENDPOINT" required
check_var "S3_ACCESS_KEY" required
check_var "S3_SECRET_KEY" required
check_var "S3_BUCKET" required
check_var "S3_REGION" optional

# --- CORS ---
echo ""
echo "--- Securite ---"
check_var "CORS_ORIGINS" required

if [ -n "$CORS_ORIGINS" ] && echo "$CORS_ORIGINS" | grep -q "localhost"; then
    fail "CORS_ORIGINS contient localhost (pas pour la prod!)"
fi

# --- NODE_ENV ---
echo ""
echo "--- Environnement ---"
check_var "NODE_ENV" required

if [ "$NODE_ENV" != "production" ]; then
    fail "NODE_ENV='$NODE_ENV' (doit etre 'production')"
fi

if [ "$LOG_LEVEL" = "debug" ]; then
    warn "LOG_LEVEL=debug en production (utiliser warn ou error)"
fi

# --- Git check ---
echo ""
echo "--- Git ---"
if git status --short 2>/dev/null | grep -q "\.env$\|\.env\.production$"; then
    fail ".env ou .env.production est dans git status!"
else
    ok ".env n'est pas tracke par git"
fi

# --- Summary ---
echo ""
echo "=========================================="
if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    printf "${GREEN}Tout est OK ! Pret pour le deploiement.${NC}\n"
elif [ $ERRORS -eq 0 ]; then
    printf "${YELLOW}$WARNINGS avertissement(s), $ERRORS erreur(s).${NC}\n"
    echo "Corrigez les warnings pour une config optimale."
else
    printf "${RED}$ERRORS erreur(s), $WARNINGS avertissement(s).${NC}\n"
    echo "Corrigez les erreurs avant de deployer."
    exit 1
fi
