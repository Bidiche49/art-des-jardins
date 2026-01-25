#!/bin/bash
# =============================================================================
# run_backlog.sh - Execute les tickets READY automatiquement
# =============================================================================
# Usage: ./run_backlog.sh [OPTIONS]
#
# Options:
#   --limit=N          Maximum N tickets a traiter (defaut: 999)
#   --type=TYPE        Filtrer par type: bugs, features, improvements
#   --priority=PRIO    Filtrer par priorite: critique, haute, moyenne, basse
#   --ticket=ID        Executer un ticket specifique (ex: BUG-001)
#   --dry-run          Simuler sans executer (affiche ce qui serait fait)
#   --help             Afficher cette aide
#
# Ce script:
# 1. Parcourt tous les tickets dans */READY/
# 2. Extrait le prompt d'execution de chaque ticket
# 3. Lance Claude pour resoudre le ticket
# 4. Verifie les criteres de succes
# 5. Deplace le ticket vers DONE/ si succes
# 6. Commit les changements
#
# Voir aussi: /backlog:prepare pour preparer les tickets
# =============================================================================

set -euo pipefail

# =============================================================================
# CONFIGURATION
# =============================================================================
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKLOG_DIR="$(dirname "$SCRIPT_DIR")"
PROJECT_ROOT="$(dirname "$BACKLOG_DIR")"
CONFIG_FILE="$SCRIPT_DIR/config.yaml"

# =============================================================================
# ARGUMENTS PAR DEFAUT
# =============================================================================
MAX_TICKETS=999
FILTER_TYPE=""
FILTER_PRIORITY=""
FILTER_TICKET=""
DRY_RUN=false

# =============================================================================
# PARSING DES ARGUMENTS
# =============================================================================
show_help() {
    head -25 "$0" | tail -n +2 | sed 's/^# //' | sed 's/^#//'
    exit 0
}

while [[ $# -gt 0 ]]; do
    case $1 in
        --limit=*)
            MAX_TICKETS="${1#*=}"
            shift
            ;;
        --type=*)
            FILTER_TYPE="${1#*=}"
            shift
            ;;
        --priority=*)
            FILTER_PRIORITY="${1#*=}"
            shift
            ;;
        --ticket=*)
            FILTER_TICKET="${1#*=}"
            shift
            ;;
        --dry-run)
            DRY_RUN=true
            shift
            ;;
        --help|-h)
            show_help
            ;;
        [0-9]*)
            # Support ancien format: ./run_backlog.sh 5
            MAX_TICKETS="$1"
            shift
            ;;
        *)
            echo "Option inconnue: $1"
            echo "Utilisez --help pour voir les options disponibles."
            exit 1
            ;;
    esac
done

# =============================================================================
# FICHIERS DE LOG
# =============================================================================
LOG_DIR="$SCRIPT_DIR/reports"
RUN_TIMESTAMP=$(date +%Y-%m-%d_%Hh%M)
LOG_FILE="$LOG_DIR/run_${RUN_TIMESTAMP}.log"
REPORT_FILE="$LOG_DIR/run_${RUN_TIMESTAMP}.md"

# Variables globales pour le rapport
START_TIME=""
END_TIME=""
declare -a RESOLVED_TICKETS=()
declare -a FAILED_TICKETS=()
declare -a SKIPPED_TICKETS=()
declare -A TICKET_DURATIONS=()
declare -A TICKET_FILES_CHANGED=()
declare -A TICKET_COMMITS=()
declare -A TICKET_ERRORS=()
declare -A TICKET_SKIP_REASONS=()

# Couleurs (si terminal supporte)
if [ -t 1 ]; then
    RED='\033[0;31m'
    GREEN='\033[0;32m'
    YELLOW='\033[0;33m'
    BLUE='\033[0;34m'
    NC='\033[0m' # No Color
else
    RED=''
    GREEN=''
    YELLOW=''
    BLUE=''
    NC=''
fi

# =============================================================================
# FONCTIONS DE FILTRAGE
# =============================================================================

# Retourne les types a traiter selon le filtre
get_filtered_types() {
    if [ -n "$FILTER_TYPE" ]; then
        case "${FILTER_TYPE,,}" in
            bugs|bug)         echo "BUGS" ;;
            features|feature|feat) echo "FEATURES" ;;
            improvements|improvement|imp) echo "IMPROVEMENTS" ;;
            *)
                echo "BUGS FEATURES IMPROVEMENTS"
                ;;
        esac
    else
        echo "BUGS FEATURES IMPROVEMENTS"
    fi
}

# Verifie si un ticket correspond au filtre de priorite
matches_priority_filter() {
    local ticket_file="$1"

    # Pas de filtre = tout passe
    [ -z "$FILTER_PRIORITY" ] && return 0

    # Extraire la priorite du ticket (formats: "## Priorite: X" ou "**Priorite:** X")
    local ticket_priority
    ticket_priority=$(grep -E "^##? ?Priorit[eé]:|^\*\*Priorit[eé]:\*\*" "$ticket_file" 2>/dev/null | head -1 | sed 's/.*: *//' | tr -d '*')

    case "${FILTER_PRIORITY,,}" in
        critique|critical)
            [[ "${ticket_priority,,}" == "critique" || "${ticket_priority,,}" == "critical" ]]
            ;;
        haute|high)
            [[ "${ticket_priority,,}" == "critique" || "${ticket_priority,,}" == "critical" || \
               "${ticket_priority,,}" == "haute" || "${ticket_priority,,}" == "high" ]]
            ;;
        moyenne|medium)
            [[ "${ticket_priority,,}" != "basse" && "${ticket_priority,,}" != "low" ]]
            ;;
        basse|low)
            return 0  # Basse inclut tout
            ;;
        *)
            return 0
            ;;
    esac
}

# Verifie si un ticket correspond au filtre de ticket specifique
matches_ticket_filter() {
    local ticket_id="$1"

    # Pas de filtre = tout passe
    [ -z "$FILTER_TICKET" ] && return 0

    # Match exact (insensible a la casse)
    [[ "${ticket_id,,}" == "${FILTER_TICKET,,}" ]]
}

# =============================================================================
# FONCTIONS UTILITAIRES
# =============================================================================

log() {
    local level="$1"
    local msg="$2"
    local timestamp
    timestamp="$(date +%H:%M:%S)"

    case "$level" in
        INFO)  echo -e "${BLUE}[$timestamp]${NC} $msg" ;;
        OK)    echo -e "${GREEN}[$timestamp] ✅${NC} $msg" ;;
        WARN)  echo -e "${YELLOW}[$timestamp] ⚠️${NC}  $msg" ;;
        ERROR) echo -e "${RED}[$timestamp] ❌${NC} $msg" ;;
        *)     echo "[$timestamp] $msg" ;;
    esac

    # Log aussi dans le fichier (sans couleurs)
    echo "[$timestamp] [$level] $msg" >> "$LOG_FILE"
}

log_section() {
    local title="$1"
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo " $title"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "" >> "$LOG_FILE"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" >> "$LOG_FILE"
    echo " $title" >> "$LOG_FILE"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" >> "$LOG_FILE"
}

extract_prompt() {
    local ticket="$1"
    # Extraire le contenu du bloc "### Prompt d'execution"
    # Le prompt est entre les balises ``` apres cette section
    awk '
        /^### Prompt d.ex.cution/,/^###|^---/ {
            if (/^```$/ && start) { exit }
            if (start) { print }
            if (/^```/) { start=1 }
        }
    ' "$ticket" | sed '/^$/d'
}

extract_success_criteria() {
    local ticket="$1"
    # Extraire les commandes entre backticks dans la section criteres
    # Format attendu: - [ ] `commande` : description
    awk '
        /^### Crit.*res de succ.*s.*v.*rifiables/,/^###|^---/ {
            if (/^- \[/) { print }
        }
    ' "$ticket" | grep -oP '`[^`]+`' | tr -d '`' 2>/dev/null || true
}

extract_criterion_description() {
    local ticket="$1"
    local criterion="$2"
    # Extraire la description apres la commande
    awk -v cmd="$criterion" '
        /^### Crit.*res de succ.*s.*v.*rifiables/,/^###|^---/ {
            if (index($0, "`" cmd "`") > 0) {
                # Extraire tout apres le dernier `
                match($0, /` *: *(.*)$/, arr)
                if (arr[1]) print arr[1]
                else {
                    # Sinon prendre le texte apres les backticks
                    sub(/.*`[^`]+`/, "", $0)
                    gsub(/^ *: */, "", $0)
                    if ($0) print $0
                }
            }
        }
    ' "$ticket" 2>/dev/null || echo ""
}

# =============================================================================
# VERIFICATION DES CRITERES
# =============================================================================

# Mapping des criteres standards vers commandes reelles
map_standard_criterion() {
    local criterion="$1"
    local stack="$2"

    case "$criterion" in
        "flutter analyze")
            echo "flutter analyze --no-fatal-infos"
            ;;
        "flutter test")
            echo "flutter test"
            ;;
        "flutter build")
            echo "flutter build apk --debug"
            ;;
        "swift build")
            echo "swift build"
            ;;
        "swift test")
            echo "swift test"
            ;;
        "npm test"|"npm run test")
            echo "npm test"
            ;;
        "npm run lint"|"npm lint")
            echo "npm run lint"
            ;;
        "go build")
            echo "go build ./..."
            ;;
        "go test")
            echo "go test ./..."
            ;;
        "cargo build")
            echo "cargo build"
            ;;
        "cargo test")
            echo "cargo test"
            ;;
        "pytest"|"python -m pytest")
            echo "python -m pytest"
            ;;
        *)
            # Retourner tel quel pour les commandes custom
            echo "$criterion"
            ;;
    esac
}

run_criterion() {
    local criterion="$1"
    local stack="$2"
    local index="$3"
    local total="$4"

    # Mapper vers commande reelle si standard
    local cmd
    cmd=$(map_standard_criterion "$criterion" "$stack")

    # Afficher avec padding pour alignement
    local display_name="${criterion:0:35}"
    printf "   [%d/%d] %-35s " "$index" "$total" "$display_name"

    # Cas speciaux
    case "$criterion" in
        "Pas de RenderFlex overflow"*)
            # Verifier qu'il n'y a pas de RenderFlex overflow dans les tests
            if flutter test 2>&1 | grep -q "RenderFlex overflow"; then
                echo -e "${RED}❌${NC}"
                echo "[CRITERION FAILED] $criterion - RenderFlex overflow detected" >> "$LOG_FILE"
                return 1
            else
                echo -e "${GREEN}✅${NC}"
                echo "[CRITERION OK] $criterion" >> "$LOG_FILE"
                return 0
            fi
            ;;
        grep*)
            # Commandes grep - inverser le resultat (0 = aucun match = succes)
            if eval "$cmd" >> "$LOG_FILE" 2>&1; then
                # grep a trouve des resultats = echec
                echo -e "${RED}❌${NC}"
                echo "[CRITERION FAILED] $criterion - matches found" >> "$LOG_FILE"
                return 1
            else
                # grep n'a rien trouve = succes
                echo -e "${GREEN}✅${NC}"
                echo "[CRITERION OK] $criterion - no matches" >> "$LOG_FILE"
                return 0
            fi
            ;;
        *)
            # Execution standard
            if eval "$cmd" >> "$LOG_FILE" 2>&1; then
                echo -e "${GREEN}✅${NC}"
                echo "[CRITERION OK] $criterion" >> "$LOG_FILE"
                return 0
            else
                echo -e "${RED}❌${NC}"
                echo "[CRITERION FAILED] $criterion" >> "$LOG_FILE"
                return 1
            fi
            ;;
    esac
}

verify_criteria() {
    local ticket="$1"
    local stack="$2"

    # Extraire les criteres du ticket
    local criteria
    criteria=$(extract_success_criteria "$ticket")

    # Si pas de criteres, utiliser les defaults
    if [ -z "$criteria" ]; then
        log WARN "Pas de criteres specifiques, utilisation des defaults"
        criteria=$(get_default_criteria "$stack")
    fi

    # Compter les criteres
    local total
    total=$(echo "$criteria" | grep -c '^' 2>/dev/null || echo "0")

    if [ "$total" -eq 0 ]; then
        log WARN "Aucun critere a verifier"
        return 0
    fi

    log INFO "🧪 Verification criteres de succes ($total critere(s))..."
    echo "[CRITERIA] Starting verification of $total criteria" >> "$LOG_FILE"

    local passed=0
    local failed=0
    local index=0

    # Executer chaque critere
    while IFS= read -r criterion; do
        [ -z "$criterion" ] && continue
        ((index++)) || true

        if run_criterion "$criterion" "$stack" "$index" "$total"; then
            ((passed++)) || true
        else
            ((failed++)) || true
        fi
    done <<< "$criteria"

    # Resume
    echo ""
    if [ "$failed" -eq 0 ]; then
        log OK "Tous les criteres passent ($passed/$total)"
        return 0
    else
        log ERROR "Criteres echoues: $failed/$total"
        return 1
    fi
}

get_default_criteria() {
    local stack="$1"

    case "$stack" in
        flutter)
            echo "flutter analyze"
            echo "flutter test"
            ;;
        swift)
            echo "swift build"
            echo "swift test"
            ;;
        react|vue|nodejs)
            echo "npm run lint"
            echo "npm test"
            ;;
        php)
            echo "composer run lint"
            echo "composer run test"
            ;;
        python)
            echo "pytest"
            ;;
        go)
            echo "go build"
            echo "go test"
            ;;
        rust)
            echo "cargo build"
            echo "cargo test"
            ;;
        *)
            # Pas de criteres par defaut pour stack inconnue
            echo ""
            ;;
    esac
}

get_commit_prefix() {
    local ticket_id="$1"
    case "$ticket_id" in
        BUG-*)  echo "fix" ;;
        FEAT-*) echo "feat" ;;
        IMP-*)  echo "refactor" ;;
        *)      echo "chore" ;;
    esac
}

# =============================================================================
# DETECTION DE STACK (pour criteres de succes)
# =============================================================================

detect_stack() {
    cd "$PROJECT_ROOT"

    if [ -f "pubspec.yaml" ]; then
        echo "flutter"
    elif [ -f "Package.swift" ] || ls *.xcodeproj &>/dev/null; then
        echo "swift"
    elif [ -f "package.json" ]; then
        if grep -q '"react"' package.json 2>/dev/null; then
            echo "react"
        elif grep -q '"vue"' package.json 2>/dev/null; then
            echo "vue"
        else
            echo "nodejs"
        fi
    elif [ -f "composer.json" ]; then
        echo "php"
    elif [ -f "requirements.txt" ] || [ -f "pyproject.toml" ]; then
        echo "python"
    elif [ -f "go.mod" ]; then
        echo "go"
    elif [ -f "Cargo.toml" ]; then
        echo "rust"
    else
        echo "generic"
    fi
}

# =============================================================================
# GENERATION DU RAPPORT
# =============================================================================

format_duration() {
    local seconds=$1
    local hours=$((seconds / 3600))
    local minutes=$(((seconds % 3600) / 60))
    local secs=$((seconds % 60))

    if [ $hours -gt 0 ]; then
        printf "%dh %02dm %02ds" $hours $minutes $secs
    elif [ $minutes -gt 0 ]; then
        printf "%dm %02ds" $minutes $secs
    else
        printf "%ds" $secs
    fi
}

extract_ticket_title() {
    local ticket_file="$1"
    # Extraire le titre depuis le fichier (premiere ligne # XXXX - Titre)
    head -1 "$ticket_file" 2>/dev/null | sed 's/^# *[A-Z]*-[0-9]* *- *//' || echo "Sans titre"
}

get_files_changed_count() {
    # Nombre de fichiers modifies depuis le dernier commit
    git diff --cached --name-only 2>/dev/null | wc -l | tr -d ' '
}

get_last_commit_hash() {
    git rev-parse --short HEAD 2>/dev/null || echo "unknown"
}

generate_report() {
    local total_seconds=$((END_TIME - START_TIME))
    local start_formatted
    local end_formatted

    start_formatted=$(date -r "$START_TIME" "+%Y-%m-%d %H:%M:%S" 2>/dev/null || date -d "@$START_TIME" "+%Y-%m-%d %H:%M:%S" 2>/dev/null || echo "N/A")
    end_formatted=$(date -r "$END_TIME" "+%Y-%m-%d %H:%M:%S" 2>/dev/null || date -d "@$END_TIME" "+%Y-%m-%d %H:%M:%S" 2>/dev/null || echo "N/A")

    local total_tickets=$((${#RESOLVED_TICKETS[@]} + ${#FAILED_TICKETS[@]} + ${#SKIPPED_TICKETS[@]}))
    local success_rate=0
    if [ $total_tickets -gt 0 ]; then
        success_rate=$((${#RESOLVED_TICKETS[@]} * 100 / total_tickets))
    fi

    # Generer le rapport markdown
    cat > "$REPORT_FILE" << REPORT_EOF
# Rapport d'execution - $(date -r "$START_TIME" "+%Y-%m-%d %H:%M" 2>/dev/null || date "+%Y-%m-%d %H:%M")

## Resume

| Metrique | Valeur |
|----------|--------|
| Debut | $start_formatted |
| Fin | $end_formatted |
| Duree | $(format_duration $total_seconds) |
| Tickets traites | $total_tickets |
| Succes | ${#RESOLVED_TICKETS[@]} |
| Echecs | ${#FAILED_TICKETS[@]} |
| Skippes | ${#SKIPPED_TICKETS[@]} |
| Taux de succes | ${success_rate}% |

REPORT_EOF

    # Section tickets resolus
    if [ ${#RESOLVED_TICKETS[@]} -gt 0 ]; then
        cat >> "$REPORT_FILE" << 'SECTION_EOF'
## Tickets resolus ✅

SECTION_EOF
        for ticket_id in "${RESOLVED_TICKETS[@]}"; do
            local duration="${TICKET_DURATIONS[$ticket_id]:-0}"
            local files="${TICKET_FILES_CHANGED[$ticket_id]:-0}"
            local commit="${TICKET_COMMITS[$ticket_id]:-unknown}"
            local title=""

            # Chercher le titre dans DONE/
            for type in BUGS FEATURES IMPROVEMENTS; do
                local done_file="$BACKLOG_DIR/$type/DONE/${ticket_id}.md"
                if [ -f "$done_file" ]; then
                    title=$(extract_ticket_title "$done_file")
                    break
                fi
            done

            cat >> "$REPORT_FILE" << TICKET_EOF
### $ticket_id - $title
- **Duree**: $(format_duration $duration)
- **Fichiers modifies**: $files
- **Commit**: \`$commit\`

TICKET_EOF
        done
    fi

    # Section tickets echoues
    if [ ${#FAILED_TICKETS[@]} -gt 0 ]; then
        cat >> "$REPORT_FILE" << 'SECTION_EOF'
## Tickets echoues ❌

SECTION_EOF
        for ticket_id in "${FAILED_TICKETS[@]}"; do
            local duration="${TICKET_DURATIONS[$ticket_id]:-0}"
            local error="${TICKET_ERRORS[$ticket_id]:-Erreur inconnue}"
            local title=""

            # Chercher le titre dans READY/ (pas deplace)
            for type in BUGS FEATURES IMPROVEMENTS; do
                local ready_file="$BACKLOG_DIR/$type/READY/${ticket_id}.md"
                if [ -f "$ready_file" ]; then
                    title=$(extract_ticket_title "$ready_file")
                    break
                fi
            done

            cat >> "$REPORT_FILE" << TICKET_EOF
### $ticket_id - $title
- **Duree**: $(format_duration $duration)
- **Raison**: $error

TICKET_EOF
        done
    fi

    # Section tickets skippes
    if [ ${#SKIPPED_TICKETS[@]} -gt 0 ]; then
        cat >> "$REPORT_FILE" << 'SECTION_EOF'
## Tickets skippes ⏭️

SECTION_EOF
        for ticket_id in "${SKIPPED_TICKETS[@]}"; do
            local reason="${TICKET_SKIP_REASONS[$ticket_id]:-Raison inconnue}"
            local title=""

            # Chercher le titre dans READY/
            for type in BUGS FEATURES IMPROVEMENTS; do
                local ready_file="$BACKLOG_DIR/$type/READY/${ticket_id}.md"
                if [ -f "$ready_file" ]; then
                    title=$(extract_ticket_title "$ready_file")
                    break
                fi
            done

            cat >> "$REPORT_FILE" << TICKET_EOF
### $ticket_id - $title
- **Raison**: $reason

TICKET_EOF
        done
    fi

    # Section logs detailles
    cat >> "$REPORT_FILE" << 'SECTION_EOF'
## Logs detailles

<details>
<summary>Voir les logs complets</summary>

```
SECTION_EOF

    # Ajouter le contenu du log (limite a 500 lignes)
    tail -500 "$LOG_FILE" >> "$REPORT_FILE" 2>/dev/null || echo "(Log non disponible)" >> "$REPORT_FILE"

    cat >> "$REPORT_FILE" << 'SECTION_EOF'
```

</details>

---

*Genere automatiquement par run_backlog.sh*
SECTION_EOF

    log OK "Rapport genere: $REPORT_FILE"
}

# =============================================================================
# MAIN
# =============================================================================

main() {
    # Creer le dossier de logs si necessaire
    mkdir -p "$LOG_DIR"

    # Enregistrer l'heure de debut
    START_TIME=$(date +%s)

    # Header
    log_section "🚀 DEMARRAGE run_backlog.sh"
    log INFO "Projet: $PROJECT_ROOT"
    log INFO "Max tickets: $MAX_TICKETS"

    # Afficher les filtres actifs
    [ -n "$FILTER_TYPE" ] && log INFO "Filtre type: $FILTER_TYPE"
    [ -n "$FILTER_PRIORITY" ] && log INFO "Filtre priorite: $FILTER_PRIORITY"
    [ -n "$FILTER_TICKET" ] && log INFO "Ticket cible: $FILTER_TICKET"
    [ "$DRY_RUN" = true ] && log WARN "MODE DRY-RUN (simulation)"

    log INFO "Log: $LOG_FILE"
    log INFO "Rapport: $REPORT_FILE"

    # Detecter la stack
    local stack
    stack=$(detect_stack)
    log INFO "Stack detectee: $stack"

    # Compteurs
    local count=0
    local success=0
    local failed=0
    local skipped=0
    local filtered=0

    # Obtenir les types a traiter selon le filtre
    local types_to_process
    types_to_process=$(get_filtered_types)

    # Parcourir les types filtres
    for type in $types_to_process; do
        local ready_dir="$BACKLOG_DIR/$type/READY"
        local done_dir="$BACKLOG_DIR/$type/DONE"

        # Skip si pas de dossier READY
        [ -d "$ready_dir" ] || continue

        # Creer DONE si necessaire (sauf dry-run)
        [ "$DRY_RUN" = false ] && mkdir -p "$done_dir"

        # Parcourir les tickets READY
        for ticket in "$ready_dir"/*.md; do
            # Verifier que c'est un fichier
            [ -f "$ticket" ] || continue

            local ticket_id
            ticket_id=$(basename "$ticket" .md)

            # Appliquer filtre ticket specifique
            if ! matches_ticket_filter "$ticket_id"; then
                continue
            fi

            # Appliquer filtre priorite
            if ! matches_priority_filter "$ticket"; then
                ((filtered++)) || true
                continue
            fi

            # Limite atteinte?
            [ $count -ge $MAX_TICKETS ] && break 2

            log_section "📋 [$((count+1))/$MAX_TICKETS] $ticket_id"

            # Demarrer le chrono pour ce ticket
            local ticket_start_time
            ticket_start_time=$(date +%s)

            # Extraire le prompt
            local prompt
            prompt=$(extract_prompt "$ticket")

            if [ -z "$prompt" ]; then
                log WARN "Pas de prompt d'execution trouve, skip"
                SKIPPED_TICKETS+=("$ticket_id")
                TICKET_SKIP_REASONS[$ticket_id]="Pas de prompt d'execution"
                ((skipped++)) || true
                continue
            fi

            log INFO "Prompt extrait ($(echo "$prompt" | wc -l | tr -d ' ') lignes)"

            # Mode dry-run: afficher sans executer
            if [ "$DRY_RUN" = true ]; then
                log INFO "🔍 DRY-RUN: Ce ticket serait execute"
                echo "   Prompt (extrait):"
                echo "$prompt" | head -5 | sed 's/^/      /'
                [ $(echo "$prompt" | wc -l) -gt 5 ] && echo "      ..."
                ((count++)) || true
                continue
            fi

            # Executer Claude
            log INFO "🤖 Execution Claude..."

            cd "$PROJECT_ROOT"

            if claude --print --dangerously-skip-permissions \
                --max-turns 50 \
                "$prompt" >> "$LOG_FILE" 2>&1; then

                log OK "Claude termine"

                # Verifier les criteres de succes (depuis ticket ou defaults)
                if verify_criteria "$ticket" "$stack"; then

                    # Compter les fichiers modifies avant commit
                    local files_changed
                    files_changed=$(get_files_changed_count)

                    # Deplacer vers DONE
                    mv "$ticket" "$done_dir/"
                    log OK "Ticket deplace vers DONE/"

                    # Commit
                    local prefix
                    prefix=$(get_commit_prefix "$ticket_id")

                    git add -A
                    git commit -m "$prefix($ticket_id): Resolved via backlog automation" >> "$LOG_FILE" 2>&1
                    log OK "Commit effectue"

                    # Collecter les metriques
                    local ticket_end_time
                    ticket_end_time=$(date +%s)
                    TICKET_DURATIONS[$ticket_id]=$((ticket_end_time - ticket_start_time))
                    TICKET_FILES_CHANGED[$ticket_id]=$files_changed
                    TICKET_COMMITS[$ticket_id]=$(get_last_commit_hash)
                    RESOLVED_TICKETS+=("$ticket_id")

                    ((success++)) || true
                else
                    log ERROR "Checks echoues"
                    local ticket_end_time
                    ticket_end_time=$(date +%s)
                    TICKET_DURATIONS[$ticket_id]=$((ticket_end_time - ticket_start_time))
                    TICKET_ERRORS[$ticket_id]="Criteres de succes non respectes"
                    FAILED_TICKETS+=("$ticket_id")
                    ((failed++)) || true
                fi
            else
                log ERROR "Claude a echoue"
                local ticket_end_time
                ticket_end_time=$(date +%s)
                TICKET_DURATIONS[$ticket_id]=$((ticket_end_time - ticket_start_time))
                TICKET_ERRORS[$ticket_id]="Claude a echoue"
                FAILED_TICKETS+=("$ticket_id")
                ((failed++)) || true
            fi

            ((count++)) || true
        done
    done

    # Enregistrer l'heure de fin
    END_TIME=$(date +%s)

    # Resume final
    if [ "$DRY_RUN" = true ]; then
        log_section "📊 RESUME DRY-RUN"
        log INFO "Tickets qui seraient traites: $count"
        [ $filtered -gt 0 ] && log INFO "Filtres (priorite): $filtered"
        log INFO "Duree simulation: $(format_duration $((END_TIME - START_TIME)))"
        echo ""
        log INFO "Pour executer reellement, relancez sans --dry-run"
        log_section "🏁 FIN DRY-RUN"
        return 0
    fi

    # Resume final (mode reel)
    log_section "📊 RESUME"
    log INFO "Traites:  $count"
    log INFO "Succes:   $success"
    log INFO "Echecs:   $failed"
    log INFO "Skippes:  $skipped"
    [ $filtered -gt 0 ] && log INFO "Filtres:  $filtered"
    log INFO "Duree:    $(format_duration $((END_TIME - START_TIME)))"
    echo ""
    log INFO "📁 Log complet: $LOG_FILE"

    # Generer le rapport markdown
    generate_report

    log_section "🏁 FIN run_backlog.sh"

    # Retourner le nombre d'echecs comme code de sortie
    return $failed
}

# Executer main
main "$@"
