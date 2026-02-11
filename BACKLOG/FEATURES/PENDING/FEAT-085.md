# FEAT-085: [Flutter] Phase 5 - Design System Widgets

**Type:** Feature
**Statut:** A faire
**Priorite:** Haute
**Complexite:** M
**Tags:** mobile, flutter, ui, design-system
**Date creation:** 2026-02-10

---

## Description

Bibliotheque de 14 widgets custom replicant le design de la PWA, avec feedback tactile natif.

## User Story

**En tant que** developpeur Flutter
**Je veux** des composants UI prets a l'emploi, coherents avec la PWA
**Afin de** construire les ecrans rapidement avec un look pro

## Criteres d'acceptation

- [ ] 14 widgets : AejButton, AejCard, AejModal, AejInput, AejSelect, AejTextarea, AejBadge, AejTable, AejPagination, AejSearchInput, AejSpinner, AejEmptyState, AejOfflineBanner, AejConnectionIndicator
- [ ] AejButton : 5 variants, 3 tailles, loading, scale(0.98) press, icones
- [ ] AejModal : BottomSheet mobile / Dialog desktop, tailles sm/md/lg/xl
- [ ] AejSearchInput : debounce 300ms, icone, bouton clear
- [ ] Feedback tactile (haptic) en mode terrain
- [ ] `flutter test` passe, `flutter analyze` propre

## Tests obligatoires

### Widget tests AejButton (~12 tests)
- [ ] Render variant primary avec bonne couleur
- [ ] Render variant secondary, outline, ghost, danger
- [ ] Taille sm (36h), md (44h), lg (48h)
- [ ] Loading state affiche spinner + desactive le tap
- [ ] onPressed appele au tap
- [ ] onPressed NON appele quand disabled
- [ ] Icone left affichee
- [ ] Icone right affichee
- [ ] Scale animation au press (si testable)
- [ ] Label texte affiche correctement
- [ ] Largeur full-width quand specifie
- [ ] Pas de crash si onPressed est null

### Widget tests AejCard (~6 tests)
- [ ] Render avec child
- [ ] Clickable (InkWell) quand onTap fourni
- [ ] Non-clickable quand pas de onTap
- [ ] Header/Title/Content/Footer sub-widgets
- [ ] Padding variants (sm, md, lg)
- [ ] Elevation correcte

### Widget tests AejModal (~8 tests)
- [ ] Affiche BottomSheet sur mobile (< 600px)
- [ ] Affiche Dialog centre sur desktop (>= 600px)
- [ ] Taille sm, md, lg, xl
- [ ] Bouton fermer visible
- [ ] Fermeture au tap sur backdrop
- [ ] Titre affiche dans le header
- [ ] Contenu scrollable si long
- [ ] Actions footer affichees

### Widget tests AejInput (~8 tests)
- [ ] Label affiche
- [ ] Hint text affiche
- [ ] Error message affiche en rouge
- [ ] Prefix icon affichee
- [ ] Suffix icon affichee
- [ ] Validation triggered on submit
- [ ] Focus/unfocus fonctionne
- [ ] Texte saisi recuperable via controller

### Widget tests AejSearchInput (~6 tests)
- [ ] Icone recherche visible
- [ ] Debounce : callback pas appele avant 300ms
- [ ] Debounce : callback appele apres 300ms
- [ ] Bouton clear visible quand texte present
- [ ] Bouton clear efface le texte
- [ ] Callback onChanged avec la valeur debounced

### Widget tests autres composants (~15 tests)
- [ ] AejSelect : affiche dropdown, selectionne une valeur
- [ ] AejTextarea : multi-ligne, 3 rows par defaut
- [ ] AejBadge : 6 variants couleur, 2 tailles
- [ ] AejTable : affiche headers + rows, rows clickables
- [ ] AejPagination : boutons precedent/suivant, numeros pages
- [ ] AejSpinner : 3 tailles (sm, md, lg)
- [ ] AejSpinner LoadingOverlay : couvre le contenu
- [ ] AejEmptyState : icone, titre, description, CTA
- [ ] AejEmptyState : CTA clickable
- [ ] AejOfflineBanner : affiche quand offline
- [ ] AejOfflineBanner : cache quand online
- [ ] AejConnectionIndicator : dot vert (online)
- [ ] AejConnectionIndicator : dot rouge (offline)
- [ ] AejConnectionIndicator : dot jaune (syncing)
- [ ] Mode terrain : tailles augmentees

**Total attendu : ~55 tests**

## Fichiers concernes

- `lib/shared/widgets/aej_button.dart`
- `lib/shared/widgets/aej_card.dart`
- `lib/shared/widgets/aej_modal.dart`
- `lib/shared/widgets/aej_input.dart`
- `lib/shared/widgets/aej_select.dart`
- `lib/shared/widgets/aej_textarea.dart`
- `lib/shared/widgets/aej_badge.dart`
- `lib/shared/widgets/aej_table.dart`
- `lib/shared/widgets/aej_pagination.dart`
- `lib/shared/widgets/aej_search_input.dart`
- `lib/shared/widgets/aej_spinner.dart`
- `lib/shared/widgets/aej_empty_state.dart`
- `lib/shared/widgets/aej_offline_banner.dart`
- `lib/shared/widgets/aej_connection_indicator.dart`
