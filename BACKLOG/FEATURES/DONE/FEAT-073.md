# FEAT-073: Meteo integree

**Type:** Feature
**Statut:** Pret
**Priorite:** Basse
**Complexite:** S
**Tags:** api, ux, integration
**Date creation:** 2026-02-03
**Phase:** 15

---

## Description

Afficher les previsions meteo sur le planning et alerter si conditions defavorables pour les interventions.

## User Story

**En tant que** utilisateur
**Je veux** voir la meteo sur mon planning
**Afin de** anticiper et reorganiser si necessaire

## Contexte

Le travail de paysagiste depend fortement de la meteo:
- Pluie -> report tonte, plantation possible
- Gel -> report plantations
- Canicule -> precautions, horaires adaptes
- Vent fort -> report elagage

## Criteres d'acceptation

- [ ] API meteo integree (Open-Meteo gratuit)
- [ ] Icone meteo sur chaque jour du calendrier
- [ ] Previsions 7 jours
- [ ] Alerte si conditions defavorables:
  - Pluie > 5mm
  - Temperature < 0°C
  - Vent > 50 km/h
- [ ] Notification push la veille si alerte
- [ ] Cache des previsions (refresh 3h)
- [ ] Meteo par lieu de chantier (pas juste ville)

## Fichiers concernes

- `apps/api/src/modules/weather/weather.service.ts` (nouveau)
- `apps/api/src/modules/weather/weather.controller.ts` (nouveau)
- `apps/pwa/src/components/WeatherBadge.tsx` (nouveau)
- `apps/pwa/src/components/Calendar/DayCell.tsx` (modification)

## Analyse / Approche

Open-Meteo API (gratuite, pas de cle):
```
https://api.open-meteo.com/v1/forecast?
  latitude=47.47&longitude=-0.55&  // Angers
  daily=temperature_2m_max,precipitation_sum,windspeed_10m_max&
  timezone=Europe/Paris
```

```typescript
interface DailyWeather {
  date: string;
  tempMax: number;
  tempMin: number;
  precipitation: number; // mm
  windSpeed: number; // km/h
  weatherCode: number; // WMO code
  icon: string;
  alerts: WeatherAlert[];
}

interface WeatherAlert {
  type: 'rain' | 'frost' | 'wind' | 'heat';
  severity: 'warning' | 'danger';
  message: string;
}

// Regles d'alerte
const checkAlerts = (weather: DailyWeather): WeatherAlert[] => {
  const alerts = [];
  if (weather.precipitation > 5) {
    alerts.push({ type: 'rain', severity: 'warning', message: 'Pluie prevue' });
  }
  if (weather.tempMin < 0) {
    alerts.push({ type: 'frost', severity: 'danger', message: 'Gel prevu' });
  }
  if (weather.windSpeed > 50) {
    alerts.push({ type: 'wind', severity: 'danger', message: 'Vent fort' });
  }
  return alerts;
};
```

## Tests de validation

- [ ] Appel API meteo fonctionne
- [ ] Icones affichees sur calendrier
- [ ] Alertes generees correctement
- [ ] Push notification envoye la veille
- [ ] Cache fonctionne (pas trop d'appels)
