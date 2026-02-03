# FEAT-077: Authentification biometrique (WebAuthn)

**Type:** Feature
**Statut:** Split en sous-tickets
**Priorite:** Haute
**Complexite:** M
**Tags:** security, auth, ux, pwa, mobile
**Date creation:** 2026-02-03
**Date split:** 2026-02-03
**Phase:** 12

---

## SPLIT EN SOUS-TICKETS

Ce ticket a ete decoupe en 5 sous-tickets pour une execution incrementale:

| Ticket | Titre | Complexite | Dependance |
|--------|-------|------------|------------|
| FEAT-077-A | Schema BDD WebAuthnCredential + Migration | XS | - |
| FEAT-077-B | Backend - WebAuthn Service | S | FEAT-077-A |
| FEAT-077-C | Backend - WebAuthn Controller + Integration Auth | S | FEAT-077-B |
| FEAT-077-D | Frontend - Service WebAuthn + BiometricSetup | S | FEAT-077-C |
| FEAT-077-E | Frontend - Integration Login + Gestion Devices | S | FEAT-077-D |

**Ordre d'execution:** A → B → C → D → E

---

## Description originale

Permettre l'authentification via Face ID (iPhone), Touch ID (iPhone/Mac), empreinte digitale (Android) ou Windows Hello grace a l'API WebAuthn.

## User Story

**En tant que** utilisateur
**Je veux** me connecter avec mon empreinte ou mon visage
**Afin de** ne pas avoir a retaper mon mot de passe a chaque expiration de session

## Contexte

Avec l'expiration des sessions inactives (IMP-006), les utilisateurs doivent se reconnecter frequemment. Sur le terrain, taper un mot de passe avec des gants ou les mains sales est penible.

WebAuthn permet une authentification biometrique native:
- Face ID / Touch ID sur iOS
- Empreinte digitale sur Android
- Windows Hello sur PC
- Touch ID sur Mac

C'est plus securise qu'un mot de passe (biometrie + device physique).

## Criteres d'acceptation

### Enregistrement
- [ ] Proposition d'activer la biometrie apres premiere connexion reussie
- [ ] Enregistrement credential WebAuthn lie au device
- [ ] Stockage cle publique en BDD (jamais la cle privee)
- [ ] Possibilite d'enregistrer plusieurs devices par user
- [ ] Nommage des devices (ex: "iPhone de Jean")

### Authentification
- [ ] Login par biometrie si credential enregistre
- [ ] Fallback mot de passe si biometrie echoue/indisponible
- [ ] Reconnexion rapide apres expiration session
- [ ] Option "Se souvenir de ce device" pour bypass 2FA

### Gestion
- [ ] Liste des devices enregistres dans profil
- [ ] Suppression d'un device a distance
- [ ] Alerte si nouveau device enregistre
- [ ] Revocation de tous les devices en cas de compromission

### Securite
- [ ] Challenge unique a chaque authentification
- [ ] Verification origine (anti-phishing)
- [ ] Expiration des credentials apres X mois d'inactivite
- [ ] Pas de biometrie pour actions critiques (suppression compte, etc.)

## Fichiers concernes

- `packages/database/prisma/schema.prisma` (WebAuthnCredential)
- `apps/api/src/modules/auth/webauthn.service.ts` (nouveau)
- `apps/api/src/modules/auth/webauthn.controller.ts` (nouveau)
- `apps/api/src/modules/auth/auth.service.ts` (modification)
- `apps/pwa/src/services/webauthn.service.ts` (nouveau)
- `apps/pwa/src/components/BiometricSetup.tsx` (nouveau)
- `apps/pwa/src/pages/login/index.tsx` (modification)
