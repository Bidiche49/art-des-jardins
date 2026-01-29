import { usePWAInstall, usePWAUpdate } from '@/hooks';
import { Button } from '@/components/ui';

export function PWAInstallPrompt() {
  const { isInstallable, installApp } = usePWAInstall();

  if (!isInstallable) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 bg-white rounded-lg shadow-lg border p-4 z-40">
      <div className="flex items-start gap-3">
        <span className="text-2xl">📱</span>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">Installer l'application</h3>
          <p className="text-sm text-gray-600 mt-1">
            Installez Art & Jardin sur votre appareil pour un acces rapide et une utilisation hors ligne.
          </p>
        </div>
      </div>
      <div className="flex gap-2 mt-3">
        <Button variant="outline" size="sm" className="flex-1">
          Plus tard
        </Button>
        <Button size="sm" className="flex-1" onClick={installApp}>
          Installer
        </Button>
      </div>
    </div>
  );
}

export function PWAUpdatePrompt() {
  const { updateAvailable, applyUpdate, dismissUpdate } = usePWAUpdate();

  if (!updateAvailable) return null;

  return (
    <div className="fixed top-0 left-0 right-0 bg-blue-600 text-white px-4 py-3 z-50 safe-top">
      <div className="flex items-center justify-between max-w-lg mx-auto">
        <div className="flex items-center gap-2">
          <span>🔄</span>
          <span className="text-sm">Nouvelle version disponible</span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={dismissUpdate}
            className="text-sm text-blue-200 hover:text-white"
          >
            Plus tard
          </button>
          <button
            onClick={applyUpdate}
            className="text-sm font-medium bg-white text-blue-600 px-3 py-1 rounded hover:bg-blue-50"
          >
            Mettre a jour
          </button>
        </div>
      </div>
    </div>
  );
}
