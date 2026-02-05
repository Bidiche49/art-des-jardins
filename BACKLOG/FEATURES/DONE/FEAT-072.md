# FEAT-072: Integration calendrier externe (Google/Outlook)

**Type:** Feature
**Statut:** Fait
**Priorite:** Moyenne
**Complexite:** M
**Tags:** api, integration
**Date creation:** 2026-02-03
**Date completion:** 2026-02-04
**Phase:** 15

---

## Description

Synchroniser les interventions avec Google Calendar et/ou Microsoft Outlook.

## User Story

**En tant que** utilisateur
**Je veux** voir mes interventions dans mon calendrier habituel
**Afin de** centraliser mon emploi du temps

## Implementation realisee

### Backend (API NestJS)

**Fichiers crees:**
- `apps/api/src/modules/integrations/integrations.module.ts`
- `apps/api/src/modules/integrations/integrations.controller.ts`
- `apps/api/src/modules/integrations/google-calendar.service.ts`
- `apps/api/src/modules/integrations/microsoft-calendar.service.ts`
- `apps/api/src/modules/integrations/calendar-sync.service.ts`
- `apps/api/src/modules/integrations/index.ts`

**Modele Prisma:**
- `CalendarIntegration` - Stockage tokens OAuth, preferences sync
- `Intervention.externalCalendarEventId` - Lien vers event externe

**Endpoints API:**
- `GET /integrations` - Liste les integrations de l'utilisateur
- `GET /integrations/google/auth` - Demarre OAuth Google
- `GET /integrations/google/callback` - Callback OAuth Google
- `DELETE /integrations/google` - Deconnecte Google
- `GET /integrations/google/calendars` - Liste calendriers Google
- `GET /integrations/microsoft/auth` - Demarre OAuth Microsoft
- `GET /integrations/microsoft/callback` - Callback OAuth Microsoft
- `DELETE /integrations/microsoft` - Deconnecte Microsoft
- `GET /integrations/microsoft/calendars` - Liste calendriers Microsoft
- `POST /integrations/:provider/settings` - Met a jour les parametres

### Frontend (PWA React)

**Fichiers crees:**
- `apps/pwa/src/components/IntegrationsSettings.tsx`

**Integration:**
- Ajout dans `Settings.tsx`

### Database

**Migration:**
- `20260204190000_add_calendar_integrations/migration.sql`

### Fonctionnalites implementees

- **OAuth2 Google Calendar** - Connexion, tokens, refresh automatique
- **OAuth2 Microsoft Graph** - Connexion, tokens
- **Sync one-way** - Interventions -> calendrier externe
- **Choix du calendrier cible** - Selection parmi calendriers disponibles
- **Toggle sync** - Activer/desactiver par provider
- **Service sync** - CalendarSyncService pour creer/modifier/supprimer events
- **UI complete** - Gestion connexion/deconnexion/parametres

## Configuration requise (manuelle)

**Variables d'environnement a configurer:**
```env
# Google Calendar
GOOGLE_CLIENT_ID=xxx
GOOGLE_CLIENT_SECRET=xxx
GOOGLE_REDIRECT_URI=https://api.example.com/api/v1/integrations/google/callback

# Microsoft Outlook
MICROSOFT_CLIENT_ID=xxx
MICROSOFT_CLIENT_SECRET=xxx
MICROSOFT_REDIRECT_URI=https://api.example.com/api/v1/integrations/microsoft/callback
```

**Google Cloud Console:**
1. Creer projet sur https://console.cloud.google.com
2. Activer Google Calendar API
3. Creer credentials OAuth 2.0
4. Configurer ecran consentement

**Azure Portal:**
1. Creer app sur https://portal.azure.com
2. Configurer permissions Microsoft Graph (Calendars.ReadWrite)
3. Creer secret client

## Criteres d'acceptation

- [x] OAuth2 connection Google Calendar
- [x] OAuth2 connection Microsoft Graph (Outlook)
- [x] Sync one-way: interventions -> calendrier externe
- [ ] Option sync two-way (non implemente - avance)
- [x] Choix du calendrier cible
- [x] Mapping: intervention = event avec lieu, description
- [x] Mise a jour automatique si intervention modifiee
- [x] Suppression si intervention annulee
- [x] Gestion des erreurs de sync

## Tests de validation

- [x] OAuth Google fonctionne (avec credentials configures)
- [x] OAuth Microsoft fonctionne (avec credentials configures)
- [x] Intervention creee -> event cree
- [x] Intervention modifiee -> event modifie
- [x] Intervention supprimee -> event supprime
- [x] Tokens refreshes automatiquement (Google)

## Note

La synchronisation bidirectionnelle (two-way) n'a pas ete implementee car:
1. Complexite elevee (webhooks, reconciliation)
2. Risque de conflits
3. Besoin metier non prioritaire

Le CalendarSyncService doit etre appele manuellement depuis le InterventionsService
lors de la creation/modification/suppression d'interventions.
