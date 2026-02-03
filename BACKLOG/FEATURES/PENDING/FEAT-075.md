# FEAT-075: Geolocalisation equipes temps reel

**Type:** Feature
**Statut:** A faire
**Priorite:** Basse
**Complexite:** M
**Tags:** api, pwa, mobile
**Date creation:** 2026-02-03
**Phase:** 16
**Automatisable:** NON

---

## 🚨 NON AUTOMATISABLE - CONFORMITE RGPD OBLIGATOIRE 🚨

> **RISQUE JURIDIQUE - Validation juridique requise**
>
> Le tracking GPS des employes est **strictement encadre par le RGPD et le Code du Travail**.
>
> **Obligations legales AVANT implementation:**
> 1. Information prealable des employes (Article L1222-4 Code du Travail)
> 2. Consultation du CSE si applicable
> 3. Declaration au registre des traitements
> 4. Consentement explicite et revocable des employes
> 5. Limitation aux heures de travail uniquement
> 6. Droit d'acces et de suppression des donnees
>
> **Sanctions en cas de non-conformite:**
> - Jusqu'a 20M€ ou 4% du CA (RGPD)
> - Contentieux prud'homal
>
> **Action requise:**
> - [ ] Consulter un avocat specialise RGPD/droit du travail
> - [ ] Rediger une politique de geolocalisation
> - [ ] Faire signer un consentement a chaque employe
> - [ ] Documenter la finalite et la proportionnalite

---

## Description

Voir la position des equipes sur une carte en temps reel pendant les heures de travail.

## User Story

**En tant que** patron
**Je veux** voir ou sont mes equipes
**Afin de** optimiser les deplacements et repondre aux urgences

## Contexte

Cas d'usage:
- Client appelle pour une urgence -> envoyer l'equipe la plus proche
- Fin de journee -> voir si tout le monde est rentre
- Optimisation tournees -> identifier les detours
- Preuve de passage sur chantier

**Attention RGPD**: tracking uniquement pendant heures de travail, consentement employe obligatoire.

## Criteres d'acceptation

- [ ] Consentement explicite employe (opt-in)
- [ ] Tracking actif uniquement si "en service"
- [ ] Envoi position toutes les 5 minutes (configurable)
- [ ] Carte avec position equipes en temps reel
- [ ] Historique parcours du jour
- [ ] Calcul km parcourus
- [ ] Pas de tracking hors heures de travail
- [ ] Bouton "Je suis en pause" pour stopper
- [ ] Donnees supprimees apres 30 jours (RGPD)

## Fichiers concernes

- `packages/database/prisma/schema.prisma` (LocationHistory)
- `apps/api/src/modules/geolocation/` (nouveau)
- `apps/pwa/src/services/location.service.ts` (nouveau)
- `apps/pwa/src/components/TeamMap.tsx` (nouveau)

## Analyse / Approche

```prisma
model LocationHistory {
  id        String   @id @default(uuid())
  userId    String
  user      User     @relation(...)
  latitude  Float
  longitude Float
  accuracy  Float
  timestamp DateTime
  source    String   // gps, network

  @@index([userId, timestamp])
}

model LocationConsent {
  id          String    @id @default(uuid())
  userId      String    @unique
  user        User      @relation(...)
  consented   Boolean
  consentedAt DateTime?
  revokedAt   DateTime?
}
```

PWA Background Geolocation:
```typescript
// Service Worker avec Background Sync
navigator.serviceWorker.ready.then((sw) => {
  sw.periodicSync.register('location-sync', {
    minInterval: 5 * 60 * 1000, // 5 minutes
  });
});

// Dans le service worker
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'location-sync' && isOnDuty()) {
    event.waitUntil(sendLocationToServer());
  }
});
```

Carte: Leaflet.js (gratuit, open source)

## Tests de validation

- [ ] Consentement requis avant tracking
- [ ] Position envoyee toutes les 5 min
- [ ] Carte affiche positions temps reel
- [ ] Tracking stoppe en pause
- [ ] Tracking stoppe hors heures travail
- [ ] Donnees supprimees apres 30j
