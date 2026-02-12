# FEAT-101: [Flutter] Phase 18 - UX Polish Pass

**Type:** Feature
**Statut:** Fait
**Date resolution:** 2026-02-12
**Priorite:** Haute
**Complexite:** L
**Tags:** mobile, flutter, ux, ui, a11y, polish
**Date creation:** 2026-02-10

---

## Description

Pass UX/UI complet sur TOUS les ecrans apres implementation des features. Applique uniformement : shimmer, empty states, error+retry, animations, transitions, dark mode, terrain mode, gestures, accessibilite, responsive tablet.

**S'execute apres Phase 16 (FCM) et AVANT Phase 17 (tests integration).**

## User Story

**En tant que** employe terrain
**Je veux** une app fluide, belle et utilisable dans toutes les conditions
**Afin de** avoir une experience native au niveau d'une app pro

## Criteres d'acceptation

### Shimmer Loading Skeletons (toutes les listes)
- [ ] ClientsListPage : skeleton cards pendant chargement
- [ ] ChantiersListPage : skeleton cards
- [ ] DevisListPage : skeleton cards
- [ ] FacturesListPage : skeleton cards
- [ ] InterventionsListPage : skeleton cards
- [ ] CalendarPage : skeleton grille
- [ ] AbsencesPage : skeleton rows
- [ ] DashboardPage : skeleton KPI cards + chart
- [ ] AnalyticsPage : skeleton charts
- [ ] SearchResults : skeleton rows

### Empty States (toutes les listes vides)
- [ ] Clients : icone + "Aucun client" + bouton "Ajouter un client"
- [ ] Chantiers : icone + "Aucun chantier" + CTA
- [ ] Devis : icone + "Aucun devis" + CTA
- [ ] Factures : icone + "Aucune facture"
- [ ] Interventions : icone + "Aucune intervention" + CTA
- [ ] Absences : icone + "Aucune absence" + CTA
- [ ] Recherche : icone + "Aucun resultat"
- [ ] Notifications : icone + "Tout est a jour"

### Error States + Retry (tous les ecrans avec data)
- [ ] Pattern uniforme : icone erreur + message + bouton "Reessayer"
- [ ] Retry declenche le reload du provider
- [ ] Erreur reseau : message specifique "Pas de connexion"
- [ ] Erreur serveur : message generique "Une erreur est survenue"
- [ ] Erreur timeout : message "Le serveur met trop de temps"

### Pull-to-Refresh (toutes les listes)
- [ ] RefreshIndicator sur chaque liste scrollable
- [ ] Refresh recharge depuis l'API (pas le cache)
- [ ] Indicateur vert coherent avec le theme

### Animations et Transitions
- [ ] Page transition : slide horizontal pour navigation laterale (bottom nav)
- [ ] Page transition : slide vertical pour push (detail, modal)
- [ ] Page transition : fade pour remplacement (login -> dashboard)
- [ ] Hero animation sur les cards -> detail (si pertinent)
- [ ] AnimatedSwitcher sur les changements de contenu (stats, badges)
- [ ] Staggered animation sur les listes (items apparaissent en cascade)
- [ ] Scale feedback 0.98 sur TOUS les boutons et cards tapables
- [ ] Durees coherentes : 200ms navigation, 150ms feedback, 300ms contenu

### Dark Mode Pass
- [ ] Chaque ecran verifie en dark mode (pas de texte invisible, pas de contraste insuffisant)
- [ ] Cards : elevation shadow visible en dark
- [ ] Badges : couleurs lisibles en dark
- [ ] Charts : couleurs distinctes en dark
- [ ] Bottom nav : icones visibles en dark
- [ ] Formulaires : inputs lisibles en dark

### Terrain Mode Pass
- [ ] Chaque ecran verifie en terrain mode
- [ ] Touch targets >= 64px sur tous les interactifs
- [ ] Textes lisibles a bout de bras (font +4px effective)
- [ ] Espacement suffisant entre les elements tapables
- [ ] Haptic feedback sur : boutons, cards, bottom nav, switches
- [ ] High contrast : bordures epaissies, couleurs saturees

### Gestures Natives
- [ ] Swipe-back iOS fonctionne sur toutes les pages detail
- [ ] Swipe-to-dismiss sur les snackbars
- [ ] Long-press sur items de liste -> menu contextuel (si pertinent)
- [ ] Pull-down pour dismiss les modals BottomSheet
- [ ] Scroll physics naturel (BouncingScrollPhysics iOS, ClampingScrollPhysics Android)

### Responsive Tablet
- [ ] Listes : 2 colonnes sur tablette (>600px)
- [ ] Formulaires : 2 colonnes sur tablette
- [ ] Detail pages : master-detail layout sur tablette
- [ ] Dashboard : 2x2 KPI grid sur tablette (au lieu de 1x4)
- [ ] Modals : Dialog centre sur tablette (pas BottomSheet)

### Accessibilite
- [ ] Semantics labels sur tous les boutons sans texte (icones)
- [ ] Semantics sur les images
- [ ] Contraste texte minimum 4.5:1 (AA)
- [ ] Taille texte systeme respectee (pas de hardcoded sizes sans MediaQuery)
- [ ] ExcludeSemantics sur les elements decoratifs
- [ ] Ordre de lecture logique (tab order)

## Tests obligatoires (~40 tests)

### Widget tests shimmer/empty/error (~12 tests)
- [ ] Shimmer affiche pendant loading (3 ecrans spot check)
- [ ] Empty state affiche quand liste vide (3 ecrans)
- [ ] Error state affiche sur erreur (3 ecrans)
- [ ] Retry button recharge les donnees (3 ecrans)

### Widget tests animations (~8 tests)
- [ ] Scale feedback au press sur AejButton
- [ ] Scale feedback au press sur AejCard
- [ ] Page transition horizontale entre bottom nav tabs
- [ ] Page transition verticale sur push detail
- [ ] RefreshIndicator visible au pull-down
- [ ] Staggered list animation visible
- [ ] AnimatedSwitcher sur changement stat
- [ ] Hero animation card -> detail

### Tests dark mode (~6 tests)
- [ ] Dashboard render OK en dark (golden test ou smoke)
- [ ] ClientsList render OK en dark
- [ ] DevisBuilder render OK en dark
- [ ] Formulaire render OK en dark
- [ ] Bottom nav visible en dark
- [ ] Charts lisibles en dark

### Tests terrain mode (~6 tests)
- [ ] Touch targets >= 64px (AejButton)
- [ ] Font size augmentee (spot check)
- [ ] Spacing double (spot check)
- [ ] Haptic triggered au tap (mock HapticFeedback)
- [ ] Dashboard utilisable en terrain
- [ ] Formulaire utilisable en terrain

### Tests responsive (~4 tests)
- [ ] Liste clients 2 colonnes a 800px width
- [ ] Formulaire 2 colonnes a 800px width
- [ ] Modal = Dialog a 800px width
- [ ] Modal = BottomSheet a 400px width

### Tests a11y (~4 tests)
- [ ] Boutons icones ont un semantics label
- [ ] Contraste suffisant sur primary text
- [ ] Taille texte respecte textScaleFactor
- [ ] ExcludeSemantics sur decoratifs

**Total attendu : ~40 tests**

## Fichiers concernes

- Transversal : TOUS les fichiers dans `lib/features/*/presentation/`
- `lib/shared/widgets/` (enrichissement des widgets existants)
- `lib/shared/layouts/app_shell.dart`
