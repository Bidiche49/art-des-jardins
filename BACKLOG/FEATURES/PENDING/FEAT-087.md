# FEAT-087: [Flutter] Phase 6B - Detection + Resolution conflits

**Type:** Feature
**Statut:** A faire
**Priorite:** Haute
**Complexite:** M
**Tags:** mobile, flutter, offline, sync, ui
**Date creation:** 2026-02-10

---

## Description

Detection de conflits version locale vs serveur, UI de resolution avec 3 strategies (local, serveur, fusion), et banner de notification.

## User Story

**En tant que** employe
**Je veux** etre prevenu des conflits de sync et choisir comment les resoudre
**Afin de** ne pas perdre mes modifications ni ecraser celles des collegues

## Criteres d'acceptation

- [ ] `ConflictService.hasConflict(local, server)` compare version + updatedAt
- [ ] `detectConflictingFields(local, server)` diff champ par champ
- [ ] 3 strategies de resolution : local, serveur, fusion
- [ ] UI de resolution avec comparaison side-by-side
- [ ] ConflictQueueBanner non-dismissible
- [ ] `flutter test` passe, `flutter analyze` propre

## Tests obligatoires

### Unit tests ConflictService (~15 tests)
- [ ] Pas de conflit si versions identiques
- [ ] Conflit si version serveur > locale
- [ ] Conflit si updatedAt serveur > local avec meme version
- [ ] detectConflictingFields retourne les bons champs
- [ ] detectConflictingFields exclut id, version, timestamps
- [ ] detectConflictingFields : 0 champs differents -> liste vide
- [ ] detectConflictingFields : 3 champs differents -> liste de 3
- [ ] createSyncConflict stocke local + server data
- [ ] resolveConflict('local') -> push version locale
- [ ] resolveConflict('server') -> accepte version serveur
- [ ] resolveConflict('merge') -> fusionne les champs
- [ ] Merge : champ local + champ serveur combines
- [ ] Merge : validation des champs fusionnes
- [ ] Conflit resolu -> supprime de la liste
- [ ] Compteur de conflits correct apres resolution

### Widget tests ConflictResolutionPage (~10 tests)
- [ ] Affiche les 2 versions cote a cote
- [ ] Champs en conflit surlignés
- [ ] Bouton "Garder ma version" fonctionne
- [ ] Bouton "Garder version serveur" fonctionne
- [ ] Bouton "Fusionner" ouvre l'editeur
- [ ] Editeur merge : champs editables
- [ ] Editeur merge : validation avant save
- [ ] Succes -> navigation retour + snackbar
- [ ] Liste vide -> affiche empty state
- [ ] Nombre de conflits affiche dans le header

### Widget tests ConflictQueueBanner (~5 tests)
- [ ] Banner visible quand conflits > 0
- [ ] Banner cache quand conflits = 0
- [ ] Affiche le nombre de conflits
- [ ] Non-dismissible (pas de bouton fermer)
- [ ] Tap -> navigue vers la page de resolution

**Total attendu : ~30 tests**

## Fichiers concernes

- `lib/services/sync/conflict_service.dart`
- `lib/features/sync/presentation/pages/conflict_resolution_page.dart`
- `lib/features/sync/presentation/widgets/conflict_queue_banner.dart`
