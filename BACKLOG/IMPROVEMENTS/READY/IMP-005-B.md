# IMP-005-B: Service geolocalisation IP

**Type:** Improvement
**Statut:** A faire
**Priorite:** Moyenne
**Complexite:** S
**Tags:** security, auth
**Parent:** IMP-005
**Date creation:** 2026-02-03
**Automatisable:** OUI

---

## Description

Creer un service de geolocalisation IP utilisant ip-api.com (gratuit) avec fallback gracieux si le service est indisponible. Integrer dans le device tracking pour enrichir les KnownDevices avec pays/ville.

## Scope limite

- Service GeoIpService avec methode getLocation(ip)
- Integration dans DeviceTrackingService.registerDevice()
- Cache simple pour eviter requetes repetees
- PAS d'email d'alerte (ticket suivant)

## Criteres d'acceptation

- [ ] GeoIpService cree avec getLocation(ip): Promise<GeoLocation | null>
- [ ] Cache en memoire (Map) pour limiter les appels
- [ ] Timeout de 2s sur les appels externes
- [ ] Fallback null si service indisponible (pas d'erreur bloquante)
- [ ] Integration dans registerDevice() pour remplir lastCountry/lastCity
- [ ] Tests unitaires avec mock du service externe
- [ ] Test d'integration verifiant le fallback

## Fichiers concernes

- `apps/api/src/modules/auth/geo-ip.service.ts` (nouveau)
- `apps/api/src/modules/auth/device-tracking.service.ts`
- `apps/api/src/modules/auth/auth.module.ts`

## Analyse technique

```typescript
interface GeoLocation {
  country: string;      // "France"
  countryCode: string;  // "FR"
  city: string;         // "Angers"
  region: string;       // "Pays de la Loire"
}

// ip-api.com response:
// GET http://ip-api.com/json/8.8.8.8
// { status: "success", country: "United States", city: "Mountain View", ... }
```

Cache: Map<string, {data: GeoLocation, timestamp: number}> avec TTL de 24h.

---

## SECTION AUTOMATISATION

**Score:** 85/100
**Risque:** Moyen - service externe, mais fallback prevu

### Prompt d'execution

```
Tu dois implementer la geolocalisation IP pour IMP-005-B.

PRE-REQUIS: IMP-005-A doit etre complete (KnownDevice existe).

ETAPE 1 - GeoIpService:
- Creer apps/api/src/modules/auth/geo-ip.service.ts
- Injectable NestJS
- Interface GeoLocation { country, countryCode, city, region }
- Map privee pour cache avec TTL 24h
- Methode async getLocation(ip: string): Promise<GeoLocation | null>
  - Verifier cache d'abord
  - Appeler http://ip-api.com/json/{ip} avec timeout 2s
  - Parser response, stocker en cache
  - Retourner null en cas d'erreur (pas throw)
- Ignorer les IPs locales (127.0.0.1, ::1, 192.168.*, 10.*)

ETAPE 2 - Integration DeviceTracking:
- Injecter GeoIpService dans DeviceTrackingService
- Dans registerDevice(), apres upsert:
  - Appeler geoIpService.getLocation(ip)
  - Si resultat, update lastCountry et lastCity

ETAPE 3 - Tests:
- Mock du service HTTP pour tests unitaires
- Test: IP valide retourne GeoLocation
- Test: timeout retourne null sans erreur
- Test: cache fonctionne (pas de 2e appel HTTP)
- Test: IP locale retourne null directement

VERIFICATION: npm run test -- --grep "GeoIp"
```

### Criteres de succes automatises

```bash
# Tests passent
npm run test -- --grep "GeoIpService"

# Service compile
npx tsc --noEmit
```
