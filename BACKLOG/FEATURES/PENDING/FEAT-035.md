# FEAT-035: Gestion disponibilites employes

**Type:** Feature
**Statut:** A faire
**Priorite:** Moyenne
**Complexite:** M
**Tags:** calendar, disponibilites, employes
**Date creation:** 2026-01-29
**Phase:** 5.3

---

## Description

Permettre aux employes de declarer leurs indisponibilites (conges, absences) et les afficher sur le calendrier.

## User Story

**En tant que** employe
**Je veux** declarer mes jours d'absence
**Afin que** le patron puisse planifier en consequence

**En tant que** patron
**Je veux** voir les disponibilites de l'equipe
**Afin de** planifier les interventions correctement

## Criteres d'acceptation

- [ ] Employe peut declarer une absence (date debut, date fin, motif)
- [ ] Types d'absence: Conge, Maladie, Formation, Autre
- [ ] Patron valide les demandes de conge
- [ ] Affichage sur calendrier (zone grisee/coloree)
- [ ] Alerte si planification sur periode d'absence
- [ ] Vue recapitulative des absences

## Fichiers concernes

- `packages/database/prisma/schema.prisma` - Table Absence
- `apps/api/src/modules/absences/` - CRUD absences
- `apps/pwa/src/pages/Absences.tsx` - Gestion absences
- `apps/pwa/src/components/calendar/` - Affichage absences

## Analyse / Approche

Schema Absence:
```prisma
model Absence {
  id        String   @id @default(uuid())
  userId    String
  user      User     @relation(...)
  dateDebut DateTime
  dateFin   DateTime
  type      AbsenceType
  motif     String?
  validee   Boolean  @default(false)
  createdAt DateTime @default(now())
}

enum AbsenceType {
  conge
  maladie
  formation
  autre
}
```

## Tests de validation

- [ ] CRUD absences fonctionne
- [ ] Validation par patron
- [ ] Affichage calendrier correct
- [ ] Alerte si conflit avec intervention
- [ ] Calcul solde conges (optionnel)

## Dependencies

- FEAT-033 (Vue calendrier)
