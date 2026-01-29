# FEAT-009: Tests unitaires AuthService

**Type:** Feature
**Statut:** A faire
**Priorite:** Critique
**Complexite:** M
**Tags:** tests, api, auth, security
**Date creation:** 2026-01-25

---

## Description

Tests unitaires complets pour AuthService : login, refresh token, validation JWT, gestion des rôles.

## Criteres d'acceptation

- [ ] Test login avec credentials valides
- [ ] Test login avec email inexistant (401)
- [ ] Test login avec mot de passe incorrect (401)
- [ ] Test login avec utilisateur inactif (401)
- [ ] Test refresh token valide
- [ ] Test refresh token expiré (401)
- [ ] Test refresh token invalide (401)
- [ ] Test mise à jour dernièreConnexion
- [ ] Test JwtStrategy validation
- [ ] Test RolesGuard avec rôle autorisé
- [ ] Test RolesGuard avec rôle non autorisé (403)
- [ ] Test @Public() decorator bypass auth
- [ ] Coverage > 90%

## Fichiers concernes

- `apps/api/src/modules/auth/auth.service.spec.ts`
- `apps/api/src/modules/auth/strategies/jwt.strategy.spec.ts`
- `apps/api/src/modules/auth/guards/jwt-auth.guard.spec.ts`
- `apps/api/src/modules/auth/guards/roles.guard.spec.ts`

## Analyse / Approche

1. Mock PrismaService pour simuler users
2. Mock JwtService pour tokens
3. Mock bcrypt.compare pour password check
4. Tester tous les edge cases d'authentification
5. Tester les guards avec ExecutionContext mocké

## Tests de validation

- [ ] Tous les tests passent
- [ ] Coverage auth module > 90%
- [ ] Pas de faux positifs (tests qui passent mais ne testent rien)
