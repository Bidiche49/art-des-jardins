# FEAT-077-E: Frontend - Integration Login + Gestion Devices

**Type:** Feature
**Statut:** A faire
**Priorite:** Haute
**Complexite:** S
**Tags:** security, auth, pwa, ux
**Parent:** FEAT-077
**Depends:** FEAT-077-D
**Date creation:** 2026-02-03

---

## Description

Integrer l'authentification WebAuthn dans la page de login existante et ajouter la gestion des devices dans le profil utilisateur.

## Scope limite

- Modification de la page login pour afficher l'option biometrie
- Composant de gestion des devices dans le profil
- Affichage du modal BiometricSetup apres premiere connexion reussie
- Fallback automatique vers mot de passe si biometrie echoue

## Criteres d'acceptation

- [ ] Page login modifiee:
  - Bouton "Se connecter avec Face ID/Touch ID" si credential existe
  - Separateur "ou" entre biometrie et formulaire classique
  - Fallback automatique vers formulaire si biometrie annulee
- [ ] Modal BiometricSetup s'affiche:
  - Apres premiere connexion reussie par mot de passe
  - Si WebAuthn supporte et pas de credential existant
  - Pas si l'utilisateur a dit "Ne plus demander"
- [ ] Page profil - section "Securite":
  - Liste des devices enregistres avec nom et date
  - Bouton supprimer pour chaque device
  - Bouton "Ajouter ce device" si pas de credential
  - Indication du device actuel
- [ ] Reconnexion rapide apres expiration session:
  - Si token expire mais credential existe, proposer biometrie
- [ ] Tests d'integration pour les flows complets

## Fichiers concernes

- `apps/pwa/src/pages/login/index.tsx` (modification)
- `apps/pwa/src/pages/profile/security.tsx` (nouveau ou modification)
- `apps/pwa/src/components/DeviceList.tsx` (nouveau)
- `apps/pwa/src/components/DeviceList.test.tsx` (nouveau)

## SECTION AUTOMATISATION

**Score:** 80/100

### Raison du score
- Necessite comprendre le code login existant
- Integration avec le systeme d'auth en place
- UX multi-etats a gerer

### Prompt d'execution

```
Tu dois integrer WebAuthn dans le flow de login et ajouter la gestion des devices.

1. D'abord, lis les fichiers existants:
   - apps/pwa/src/pages/login/index.tsx
   - apps/pwa/src/pages/profile/ (structure existante)
   - apps/pwa/src/context/AuthContext.tsx ou equivalent

2. Modifie la page login `apps/pwa/src/pages/login/index.tsx`:

// Ajoute en haut de la page:
const { isSupported, hasCredential, authenticate, biometricType } = useWebAuthn();

// Dans le render, avant le formulaire:
{hasCredential && (
  <Button
    onClick={handleBiometricLogin}
    variant="primary"
    fullWidth
    icon={biometricType === 'face' ? <FaceIdIcon /> : <FingerprintIcon />}
  >
    Se connecter avec {biometricType === 'face' ? 'Face ID' : 'Touch ID'}
  </Button>
)}

{hasCredential && (
  <Divider>ou</Divider>
)}

// Handler:
const handleBiometricLogin = async () => {
  try {
    const tokens = await authenticate();
    // Utilise le meme flow que le login classique
    await login(tokens);
    navigate('/');
  } catch (e) {
    // Fallback silencieux vers formulaire
    console.log('Biometric auth cancelled or failed');
  }
};

3. Ajoute le modal BiometricSetup apres login reussi:

// Dans le flow de login par mot de passe, apres succes:
const { shouldShowSetup } = useWebAuthn();
const [showBiometricSetup, setShowBiometricSetup] = useState(false);

// Apres login reussi:
if (shouldShowSetup) {
  setShowBiometricSetup(true);
} else {
  navigate('/');
}

// Dans le render:
<BiometricSetupModal
  open={showBiometricSetup}
  onClose={() => {
    setShowBiometricSetup(false);
    navigate('/');
  }}
  onSuccess={() => {
    setShowBiometricSetup(false);
    navigate('/');
  }}
/>

4. Cree le composant `apps/pwa/src/components/DeviceList.tsx`:

- Appelle GET /auth/webauthn/credentials
- Affiche liste avec: deviceName, createdAt, lastUsedAt
- Badge "Ce device" pour le credential actuel (comparer credentialId)
- Bouton delete avec confirmation
- Bouton "Ajouter ce device" si aucun credential pour ce device

5. Ajoute la section dans le profil:

// apps/pwa/src/pages/profile/security.tsx ou equivalent
<Card title="Connexion biometrique">
  <DeviceList />
</Card>

6. Gere la reconnexion apres expiration:

// Dans le interceptor axios ou equivalent:
// Si 401 et hasCredential, proposer biometrie avant redirect login

7. Tests d'integration:
   - Test flow login biometrie complet
   - Test affichage BiometricSetup apres premier login
   - Test suppression device
   - Test fallback si biometrie echoue
```

### Criteres de succes automatises

- `pnpm test` passe
- Flow login biometrie fonctionne manuellement
- Gestion devices dans profil fonctionnelle
