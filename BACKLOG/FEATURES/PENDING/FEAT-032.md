# FEAT-032: Rappels automatiques interventions

**Type:** Feature
**Statut:** A faire
**Priorite:** Haute
**Complexite:** M
**Tags:** notifications, cron, interventions
**Date creation:** 2026-01-29
**Phase:** 5.2

---

## Description

Envoyer automatiquement des rappels push pour les interventions du jour et du lendemain.

## User Story

**En tant que** employe ou patron
**Je veux** recevoir un rappel de mes interventions chaque matin
**Afin de** ne pas oublier mes rendez-vous

## Criteres d'acceptation

- [ ] Job cron quotidien a 8h00
- [ ] Notification interventions du jour
- [ ] Notification interventions du lendemain (J+1) a 18h
- [ ] Contenu : client, adresse, heure
- [ ] Notifications envoyees a l'employe assigne (ou tous si non assigne)

## Fichiers concernes

- `apps/api/src/modules/notifications/notifications.service.ts`
- `apps/api/src/modules/notifications/notifications.cron.ts` - Job cron
- `apps/api/src/modules/interventions/` - Queries

## Analyse / Approche

1. Installer `@nestjs/schedule` si pas deja fait
2. Creer cron job `@Cron('0 8 * * *')` pour rappel matin
3. Creer cron job `@Cron('0 18 * * *')` pour rappel veille
4. Requete interventions du jour/lendemain avec joins
5. Pour chaque intervention, envoyer push a l'employe assigne

## Tests de validation

- [ ] Cron job execute a l'heure prevue
- [ ] Interventions du jour correctement selectionnees
- [ ] Notifications envoyees aux bonnes personnes
- [ ] Pas de notification si pas d'intervention

## Dependencies

- FEAT-030 (Backend notifications)
- FEAT-031 (Abonnement PWA)
