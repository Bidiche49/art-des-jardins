# FEAT-032: Rappels automatiques interventions

**Type:** Feature
**Statut:** Fait
**Priorite:** Haute
**Complexite:** M
**Tags:** notifications, cron, interventions
**Date creation:** 2026-01-29
**Date completion:** 2026-01-29
**Phase:** 5.2

---

## Description

Envoyer automatiquement des rappels push pour les interventions du jour et du lendemain.

## User Story

**En tant que** employe ou patron
**Je veux** recevoir un rappel de mes interventions chaque matin
**Afin de** ne pas oublier mes rendez-vous

## Criteres d'acceptation

- [x] Job cron quotidien a 8h00 (rappel matin)
- [x] Job cron quotidien a 18h00 (rappel soir/demain)
- [x] Notification interventions du jour
- [x] Notification interventions du lendemain (J+1)
- [x] Contenu : client, adresse, heure
- [x] Notifications envoyees a l'employe assigne
- [x] Notification patron si intervention non assignee

## Fichiers crees/modifies

- `apps/api/src/modules/notifications/notifications.cron.ts` - Service de cron
- `apps/api/src/modules/notifications/notifications.cron.spec.ts` - 10 tests unitaires
- `apps/api/src/modules/notifications/notifications.module.ts` - Export du cron service
- `apps/api/src/modules/notifications/notifications.controller.ts` - Endpoint trigger manuel
- `apps/api/src/app.module.ts` - Import ScheduleModule
- `apps/api/package.json` - Ajout @nestjs/schedule et date-fns

## Implementation

### Service de Cron (`notifications.cron.ts`)

**Rappel Matin (8h00):**
- Recupere toutes les interventions du jour
- Groupe par employe assigne
- Envoie notification personnalisee avec heure et client
- Si non assigne: notification a tous

**Rappel Soir (18h00):**
- Recupere toutes les interventions du lendemain
- Groupe par employe assigne
- Envoie notification "Rappel: interventions demain"
- Si non assigne: notification au patron

**Format des notifications:**
- 1 intervention: "09:00 - Dupont (Angers)"
- N interventions: "3 interventions aujourd'hui. Premiere a 09:00 chez Dupont"

### Endpoint de test manuel

```
POST /notifications/reminders/trigger?type=morning|evening
```

Accessible uniquement au patron pour tester les rappels manuellement.

## Tests de validation

- [x] 10 tests unitaires pour NotificationsCronService
- [x] Cron job execute correctement
- [x] Interventions du jour correctement selectionnees
- [x] Notifications envoyees aux bonnes personnes
- [x] Pas de notification si pas d'intervention
- [x] Groupement par employe fonctionne
- [x] Gestion des interventions non assignees

## Dependencies

- FEAT-030 (Backend notifications) - DONE
- FEAT-031 (Abonnement PWA) - DONE

## Configuration

Les crons utilisent le timezone `Europe/Paris` pour s'assurer que les rappels sont envoyes aux bonnes heures locales.

```typescript
@Cron('0 8 * * *', { timeZone: 'Europe/Paris' })  // 8h00 tous les jours
@Cron('0 18 * * *', { timeZone: 'Europe/Paris' }) // 18h00 tous les jours
```
