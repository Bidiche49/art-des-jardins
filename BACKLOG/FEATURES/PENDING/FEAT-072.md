# FEAT-072: Integration calendrier externe (Google/Outlook)

**Type:** Feature
**Statut:** A faire
**Priorite:** Moyenne
**Complexite:** M
**Tags:** api, integration
**Date creation:** 2026-02-03
**Phase:** 15
**Automatisable:** NON

---

## ⚠️ NON AUTOMATISABLE - CONFIGURATION MANUELLE REQUISE ⚠️

> **Credentials OAuth Google/Microsoft a creer manuellement**
>
> Ce ticket necessite la creation de projets sur les consoles developpeurs:
>
> **Google Calendar:**
> 1. Creer un projet sur https://console.cloud.google.com
> 2. Activer l'API Google Calendar
> 3. Configurer l'ecran de consentement OAuth
> 4. Creer des credentials OAuth 2.0
> 5. Ajouter les URIs de redirection autorises
>
> **Microsoft Outlook:**
> 1. Creer une app sur https://portal.azure.com
> 2. Configurer les permissions Microsoft Graph
> 3. Creer un secret client
> 4. Configurer les URIs de redirection
>
> **Variables d'environnement a configurer:**
> - GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET
> - MICROSOFT_CLIENT_ID, MICROSOFT_CLIENT_SECRET

---

## Description

Synchroniser les interventions avec Google Calendar et/ou Microsoft Outlook.

## User Story

**En tant que** utilisateur
**Je veux** voir mes interventions dans mon calendrier habituel
**Afin de** centraliser mon emploi du temps

## Contexte

Les employes ont deja un calendrier personnel (Google, Outlook). Synchroniser les interventions evite:
- Double saisie
- Oublis d'interventions
- Conflits d'horaires avec RDV personnels

FEAT-036 permet deja l'export iCal (one-way). Cette feature ajoute la sync bidirectionnelle.

## Criteres d'acceptation

- [ ] OAuth2 connection Google Calendar
- [ ] OAuth2 connection Microsoft Graph (Outlook)
- [ ] Sync one-way: interventions -> calendrier externe
- [ ] Option sync two-way: creer intervention depuis calendrier (avance)
- [ ] Choix du calendrier cible
- [ ] Mapping: intervention = event avec lieu, description
- [ ] Mise a jour automatique si intervention modifiee
- [ ] Suppression si intervention annulee
- [ ] Gestion des erreurs de sync

## Fichiers concernes

- `apps/api/src/modules/integrations/google-calendar.service.ts` (nouveau)
- `apps/api/src/modules/integrations/microsoft-calendar.service.ts` (nouveau)
- `apps/api/src/modules/integrations/integrations.controller.ts` (nouveau)
- `apps/pwa/src/pages/settings/integrations.tsx` (nouveau)

## Analyse / Approche

OAuth2 flow:
1. User clique "Connecter Google Calendar"
2. Redirect vers Google OAuth consent
3. Callback avec code
4. Echange code -> access token + refresh token
5. Stocker tokens chiffres en BDD

```typescript
// Google Calendar sync
import { google } from 'googleapis';

async syncIntervention(intervention: Intervention) {
  const calendar = google.calendar({ version: 'v3', auth: this.oauth2Client });

  const event = {
    summary: `Intervention: ${intervention.chantier.client.name}`,
    location: intervention.chantier.address,
    description: intervention.description,
    start: { dateTime: intervention.startDate.toISOString() },
    end: { dateTime: intervention.endDate.toISOString() },
  };

  if (intervention.externalCalendarId) {
    // Update existing
    await calendar.events.update({
      calendarId: 'primary',
      eventId: intervention.externalCalendarId,
      requestBody: event,
    });
  } else {
    // Create new
    const result = await calendar.events.insert({
      calendarId: 'primary',
      requestBody: event,
    });
    await this.interventionService.update(intervention.id, {
      externalCalendarId: result.data.id,
    });
  }
}
```

## Tests de validation

- [ ] OAuth Google fonctionne
- [ ] OAuth Microsoft fonctionne
- [ ] Intervention creee -> event cree
- [ ] Intervention modifiee -> event modifie
- [ ] Intervention supprimee -> event supprime
- [ ] Tokens refreshes automatiquement
