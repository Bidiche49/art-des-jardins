# FEAT-095: [Flutter] Phase 12 - Recherche globale + QR Scanner

**Type:** Feature
**Statut:** A faire
**Priorite:** Moyenne
**Complexite:** M
**Tags:** mobile, flutter, search, qr, ux
**Date creation:** 2026-02-10

---

## Description

Recherche cross-entites (clients, chantiers, devis, factures) avec debounce et resultats groupes. Scanner QR code chantier.

## User Story

**En tant que** employe
**Je veux** trouver rapidement une entite et scanner un QR chantier
**Afin de** naviguer rapidement dans l'app

## Criteres d'acceptation

- [ ] Recherche : modal plein ecran, debounce 200ms, API /search
- [ ] Resultats groupes par type avec icones couleur
- [ ] Tap resultat -> navigation vers l'entite
- [ ] QR Scanner : camera arriere, overlay coins verts
- [ ] Parse protocole `aej://chantier/{uuid}`
- [ ] Navigation auto vers /chantiers/{uuid}
- [ ] Historique scans (max 10, SharedPreferences)
- [ ] `flutter test` passe, `flutter analyze` propre

## Tests obligatoires

### Unit tests SearchService (~10 tests)
- [ ] Recherche "Dupont" -> resultats avec clients Dupont
- [ ] Resultats groupes par type (client, chantier, devis, facture)
- [ ] Debounce : pas d'appel avant 200ms
- [ ] Debounce : un seul appel apres delai
- [ ] Recherche vide -> pas d'appel API
- [ ] Recherche < 2 chars -> pas d'appel
- [ ] Erreur API -> message erreur
- [ ] Resultats vides -> empty state
- [ ] Chaque resultat a : type, id, label, subtitle
- [ ] Navigation correcte selon le type

### Unit tests QrParser (~8 tests)
- [ ] Parse `aej://chantier/{uuid}` -> type chantier + UUID
- [ ] Parse `aej://client/{uuid}` -> type client + UUID (si supporte)
- [ ] QR code invalide -> erreur
- [ ] QR code sans protocole aej:// -> erreur
- [ ] UUID invalide -> erreur
- [ ] QR vide -> erreur
- [ ] Historique : ajout scan
- [ ] Historique : max 10, FIFO

### Widget tests (~8 tests)
- [ ] SearchPage : champ de recherche auto-focus
- [ ] SearchPage : resultats groupes par section
- [ ] SearchPage : icone par type (client, chantier, etc.)
- [ ] SearchPage : tap resultat navigue
- [ ] QrScannerPage : overlay avec coins verts
- [ ] QrScannerPage : scan detecte -> parse + navigation
- [ ] QrScannerPage : historique visible
- [ ] QrScannerPage : tap historique -> navigation

**Total attendu : ~26 tests**

## Fichiers concernes

- `lib/features/scanner/`
- `lib/features/search/` (ou dans shared)
