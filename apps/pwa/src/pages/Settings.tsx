import { useUIStore } from '@/stores/ui';
import { SyncStatus } from '@/components/SyncStatus';
import { DeviceList } from '@/components/DeviceList';
import { Card } from '@/components/ui';
import { useWebAuthn, useTerrainMode } from '@/hooks';

type ThemeOption = 'light' | 'dark' | 'system';

const themeOptions: { value: ThemeOption; label: string; icon: string }[] = [
  { value: 'light', label: 'Clair', icon: '☀️' },
  { value: 'dark', label: 'Sombre', icon: '🌙' },
  { value: 'system', label: 'Automatique', icon: '💻' },
];

export function Settings() {
  const { theme, setTheme } = useUIStore();
  const { isSupported } = useWebAuthn();
  const { isEnabled: terrainModeEnabled, settings: terrainSettings, setSettings: setTerrainSettings, triggerHaptic } = useTerrainMode();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
        Parametres
      </h1>

      <Card>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Apparence
        </h2>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Theme
          </label>
          <div className="grid grid-cols-3 gap-2">
            {themeOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setTheme(option.value)}
                className={`flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-colors ${
                  theme === option.value
                    ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <span className="text-2xl">{option.icon}</span>
                <span
                  className={`text-sm font-medium ${
                    theme === option.value
                      ? 'text-primary-700 dark:text-primary-400'
                      : 'text-gray-600 dark:text-gray-400'
                  }`}
                >
                  {option.label}
                </span>
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            Le mode automatique suit les preferences de votre systeme.
          </p>
        </div>
      </Card>

      <Card>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Mode terrain
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Interface adaptee pour l'utilisation sur chantier avec des gants ou
          les mains sales.
        </p>

        <div className="space-y-4">
          {/* Toggle principal */}
          <div className="flex items-center justify-between">
            <div>
              <label
                htmlFor="terrain-toggle"
                className="text-sm font-medium text-gray-900 dark:text-white"
              >
                Activer le mode terrain
              </label>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Boutons plus grands, texte agrandi, espacement augmente
              </p>
            </div>
            <button
              id="terrain-toggle"
              type="button"
              role="switch"
              aria-checked={terrainModeEnabled}
              onClick={() => {
                setTerrainSettings({ enabled: !terrainModeEnabled });
                triggerHaptic();
              }}
              className={`relative inline-flex h-8 w-14 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                terrainModeEnabled ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-7 w-7 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  terrainModeEnabled ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Auto-detection */}
          <div className="flex items-center justify-between">
            <div>
              <label
                htmlFor="terrain-auto"
                className="text-sm font-medium text-gray-900 dark:text-white"
              >
                Activation automatique
              </label>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Active automatiquement sur mobile
              </p>
            </div>
            <button
              id="terrain-auto"
              type="button"
              role="switch"
              aria-checked={terrainSettings.autoDetect}
              onClick={() => {
                setTerrainSettings({ autoDetect: !terrainSettings.autoDetect });
                triggerHaptic();
              }}
              className={`relative inline-flex h-8 w-14 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                terrainSettings.autoDetect ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-7 w-7 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  terrainSettings.autoDetect ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Haptic feedback */}
          <div className="flex items-center justify-between">
            <div>
              <label
                htmlFor="terrain-haptic"
                className="text-sm font-medium text-gray-900 dark:text-white"
              >
                Vibration au toucher
              </label>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Confirmation tactile sur les actions
              </p>
            </div>
            <button
              id="terrain-haptic"
              type="button"
              role="switch"
              aria-checked={terrainSettings.hapticFeedback}
              onClick={() => {
                setTerrainSettings({ hapticFeedback: !terrainSettings.hapticFeedback });
                if (!terrainSettings.hapticFeedback && 'vibrate' in navigator) {
                  navigator.vibrate(10);
                }
              }}
              className={`relative inline-flex h-8 w-14 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                terrainSettings.hapticFeedback ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-7 w-7 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  terrainSettings.hapticFeedback ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* High contrast */}
          <div className="flex items-center justify-between">
            <div>
              <label
                htmlFor="terrain-contrast"
                className="text-sm font-medium text-gray-900 dark:text-white"
              >
                Contraste eleve
              </label>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Meilleure lisibilite en plein soleil
              </p>
            </div>
            <button
              id="terrain-contrast"
              type="button"
              role="switch"
              aria-checked={terrainSettings.highContrast}
              onClick={() => {
                setTerrainSettings({ highContrast: !terrainSettings.highContrast });
                triggerHaptic();
              }}
              className={`relative inline-flex h-8 w-14 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                terrainSettings.highContrast ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-7 w-7 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  terrainSettings.highContrast ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </Card>

      {isSupported && (
        <Card>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Connexion biometrique
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Gerez les appareils autorises a se connecter avec la biometrie.
          </p>
          <DeviceList />
        </Card>
      )}

      <Card>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Synchronisation
        </h2>
        <SyncStatus showDetails />
      </Card>

      <Card>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          A propos
        </h2>
        <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
          <p>
            <span className="font-medium">Version:</span> 1.0.0
          </p>
          <p>
            <span className="font-medium">Application:</span> Art & Jardin PWA
          </p>
        </div>
      </Card>
    </div>
  );
}
