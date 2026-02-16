# FEAT-118: Tracking GA4 + events de conversion

**Type:** Feature
**Statut:** A faire
**Priorite:** Haute
**Complexite:** S
**Tags:** vitrine, seo, analytics
**Date creation:** 2026-02-13

---

## Description

Le site n'a aucun tracking de conversion. Sans analytics, impossible de :
- Savoir combien de visiteurs arrivent sur le site
- Quelles pages generent des leads
- D'ou vient le trafic (SEO, direct, social)
- Mesurer le ROI des efforts SEO
- Optimiser le tunnel de conversion

Le composant `<Analytics />` existe dans le layout mais il faut verifier son contenu et configurer GA4 + les events de conversion.

## User Story

**En tant que** proprietaire de l'entreprise
**Je veux** mesurer le trafic et les conversions du site
**Afin de** comprendre ce qui fonctionne et optimiser

## Fichiers concernes

- `apps/vitrine/src/components/Analytics.tsx` - Verifier/configurer
- `apps/vitrine/src/components/ContactForm.tsx` - Event soumission formulaire
- `apps/vitrine/src/components/layout/Footer.tsx` - Events clics telephone/email

## Approche

### 1. Configurer Google Analytics 4
- Creer une propriete GA4 pour art-et-jardin.fr
- Ajouter le tag gtag.js (ou utiliser `@next/third-parties`)
- Respecter le RGPD : bandeau cookies avec consentement

### 2. Events de conversion a tracker

| Event | Declencheur | Valeur |
|-------|-------------|--------|
| `form_submit` | Soumission formulaire contact reussie | Conversion principale |
| `phone_click` | Clic sur lien tel: | Conversion secondaire |
| `email_click` | Clic sur lien mailto: | Conversion secondaire |
| `whatsapp_click` | Clic bouton WhatsApp | Conversion secondaire |
| `cta_click` | Clic bouton "Devis gratuit" | Engagement |
| `service_view` | Vue d'une page service | Engagement |

### 3. Bandeau cookies RGPD
- Bandeau de consentement cookies (requis en France)
- GA4 charge uniquement apres consentement
- Stockage du consentement en localStorage
- Lien vers la politique de confidentialite

### 4. Implementation
```typescript
// Tracker un event
function trackEvent(name: string, params?: Record<string, string>) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', name, params);
  }
}

// Dans ContactForm.tsx, apres soumission reussie :
trackEvent('form_submit', { service: formData.service });

// Sur les liens telephone :
<a href="tel:..." onClick={() => trackEvent('phone_click')}>
```

**Pre-requis** : Creer un compte Google Analytics.

## Criteres d'acceptation

- [ ] GA4 installe et fonctionnel
- [ ] Bandeau cookies RGPD conforme
- [ ] Event form_submit tracke
- [ ] Event phone_click tracke
- [ ] Event email_click tracke
- [ ] Conversions configurees dans GA4
- [ ] Donnees visibles dans le dashboard GA4

## Tests de validation

- [ ] Verifier dans GA4 Realtime les events
- [ ] Soumission formulaire genere un event
- [ ] Clic telephone genere un event
- [ ] Le bandeau cookies fonctionne (accept/refuse)
- [ ] GA4 ne se charge pas si cookies refuses
