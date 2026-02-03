# FEAT-067: Mode gros doigts mobile terrain

**Type:** Feature
**Statut:** Pret
**Priorite:** Moyenne
**Complexite:** S
**Tags:** ux, pwa, mobile
**Date creation:** 2026-02-03
**Phase:** 14

---

## Description

Ajouter un mode "terrain" avec des elements d'interface plus grands pour utilisation avec des gants ou des doigts sales.

## User Story

**En tant que** employe sur chantier
**Je veux** des boutons plus grands
**Afin de** utiliser l'app avec mes gants de travail

## Contexte

Les employes terrain utilisent l'app:
- Avec des gants
- Avec les mains sales/mouillees
- Sous le soleil (ecran difficile a voir)
- En situation de stress/rapidite

Les elements tactiles standards (44px) sont trop petits.

## Criteres d'acceptation

- [ ] Toggle "Mode terrain" dans les parametres
- [ ] Auto-activation optionnelle sur detection mobile
- [ ] Elements tactiles: 64px minimum
- [ ] Textes: +2 tailles (16px -> 20px base)
- [ ] Contraste augmente (soleil)
- [ ] Espacement augmente entre elements
- [ ] Actions principales en bas (pouce)
- [ ] Confirmation sur actions destructives (plus grosse)
- [ ] Vibration feedback sur tap

## Fichiers concernes

- `apps/pwa/src/contexts/AccessibilityContext.tsx` (nouveau)
- `apps/pwa/src/styles/terrain-mode.css` (nouveau)
- `apps/pwa/src/components/common/` (ajustements)
- `apps/pwa/src/hooks/useTerrainMode.ts` (nouveau)

## Analyse / Approche

```typescript
// Context
interface AccessibilitySettings {
  terrainMode: boolean;
  fontSize: 'normal' | 'large' | 'xlarge';
  highContrast: boolean;
  hapticFeedback: boolean;
}

// CSS Variables mode terrain
:root[data-terrain="true"] {
  --touch-target: 64px;
  --font-size-base: 20px;
  --spacing-base: 24px;
  --border-radius: 16px;
}

// Composant bouton adaptatif
const Button = ({ children, ...props }) => {
  const { terrainMode } = useAccessibility();
  return (
    <button
      className={cn(styles.button, terrainMode && styles.terrain)}
      style={{ minHeight: terrainMode ? 64 : 44 }}
      {...props}
    >
      {children}
    </button>
  );
};
```

## Tests de validation

- [ ] Toggle active le mode
- [ ] Boutons mesurent 64px+
- [ ] Texte agrandi visible
- [ ] Contraste suffisant au soleil
- [ ] Vibration sur tap (mobile)
