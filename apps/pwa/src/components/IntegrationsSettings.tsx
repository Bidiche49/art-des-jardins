import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, Button } from '@/components/ui';
import { apiClient } from '@/api/client';
import toast from 'react-hot-toast';

interface Integration {
  id: string;
  provider: 'google' | 'microsoft';
  calendarId: string;
  syncEnabled: boolean;
  lastSyncAt: string | null;
  lastSyncError: string | null;
}

interface Calendar {
  id: string;
  name: string;
  primary: boolean;
}

export function IntegrationsSettings() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [googleCalendars, setGoogleCalendars] = useState<Calendar[]>([]);
  const [microsoftCalendars, setMicrosoftCalendars] = useState<Calendar[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [connectingProvider, setConnectingProvider] = useState<string | null>(null);

  // Gestion des messages de callback
  useEffect(() => {
    const integration = searchParams.get('integration');
    const status = searchParams.get('status');

    if (integration && status) {
      if (status === 'success') {
        toast.success(`${integration === 'google' ? 'Google Calendar' : 'Microsoft Outlook'} connecté !`);
        loadIntegrations();
      } else {
        toast.error(`Erreur de connexion ${integration === 'google' ? 'Google' : 'Microsoft'}`);
      }

      // Nettoyer les params
      searchParams.delete('integration');
      searchParams.delete('status');
      setSearchParams(searchParams);
    }
  }, [searchParams, setSearchParams]);

  const loadIntegrations = async () => {
    try {
      const response = await apiClient.get<{ integrations: Integration[] }>('/integrations');
      setIntegrations(response.data.integrations);

      // Charger les calendriers pour chaque intégration
      for (const integration of response.data.integrations) {
        try {
          const calendarsResponse = await apiClient.get<{ calendars: Calendar[] }>(
            `/integrations/${integration.provider}/calendars`
          );
          if (integration.provider === 'google') {
            setGoogleCalendars(calendarsResponse.data.calendars);
          } else {
            setMicrosoftCalendars(calendarsResponse.data.calendars);
          }
        } catch {
          // Ignorer les erreurs de chargement des calendriers
        }
      }
    } catch (error) {
      console.error('Erreur chargement intégrations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadIntegrations();
  }, []);

  const connectGoogle = async () => {
    setConnectingProvider('google');
    try {
      const response = await apiClient.get<{ authUrl: string }>('/integrations/google/auth');
      window.location.href = response.data.authUrl;
    } catch (error) {
      toast.error('Erreur de connexion Google');
      setConnectingProvider(null);
    }
  };

  const connectMicrosoft = async () => {
    setConnectingProvider('microsoft');
    try {
      const response = await apiClient.get<{ authUrl: string }>('/integrations/microsoft/auth');
      window.location.href = response.data.authUrl;
    } catch (error) {
      toast.error('Erreur de connexion Microsoft');
      setConnectingProvider(null);
    }
  };

  const disconnect = async (provider: 'google' | 'microsoft') => {
    if (!confirm(`Déconnecter ${provider === 'google' ? 'Google Calendar' : 'Microsoft Outlook'} ?`)) {
      return;
    }

    try {
      await apiClient.delete(`/integrations/${provider}`);
      setIntegrations(integrations.filter(i => i.provider !== provider));
      toast.success('Déconnecté');
    } catch (error) {
      toast.error('Erreur de déconnexion');
    }
  };

  const updateSettings = async (provider: 'google' | 'microsoft', settings: { calendarId?: string; syncEnabled?: boolean }) => {
    try {
      await apiClient.post(`/integrations/${provider}/settings`, settings);
      setIntegrations(integrations.map(i =>
        i.provider === provider ? { ...i, ...settings } : i
      ));
      toast.success('Paramètres mis à jour');
    } catch (error) {
      toast.error('Erreur de mise à jour');
    }
  };

  const googleIntegration = integrations.find(i => i.provider === 'google');
  const microsoftIntegration = integrations.find(i => i.provider === 'microsoft');

  if (isLoading) {
    return (
      <Card>
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Calendriers externes
      </h2>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
        Synchronisez vos interventions avec Google Calendar ou Microsoft Outlook.
      </p>

      <div className="space-y-6">
        {/* Google Calendar */}
        <div className="border rounded-lg p-4 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-lg shadow flex items-center justify-center">
                <svg className="w-6 h-6" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">Google Calendar</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {googleIntegration ? 'Connecté' : 'Non connecté'}
                </p>
              </div>
            </div>

            {googleIntegration ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => disconnect('google')}
              >
                Déconnecter
              </Button>
            ) : (
              <Button
                variant="primary"
                size="sm"
                onClick={connectGoogle}
                isLoading={connectingProvider === 'google'}
              >
                Connecter
              </Button>
            )}
          </div>

          {googleIntegration && (
            <div className="space-y-4 pt-4 border-t dark:border-gray-700">
              {/* Sélection calendrier */}
              {googleCalendars.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Calendrier cible
                  </label>
                  <select
                    value={googleIntegration.calendarId}
                    onChange={(e) => updateSettings('google', { calendarId: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-600"
                  >
                    {googleCalendars.map((cal) => (
                      <option key={cal.id} value={cal.id}>
                        {cal.name} {cal.primary && '(Principal)'}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Toggle sync */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Synchronisation activée
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {googleIntegration.lastSyncAt
                      ? `Dernière sync: ${new Date(googleIntegration.lastSyncAt).toLocaleString()}`
                      : 'Jamais synchronisé'}
                  </p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={googleIntegration.syncEnabled}
                  onClick={() => updateSettings('google', { syncEnabled: !googleIntegration.syncEnabled })}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
                    googleIntegration.syncEnabled ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow transition ${
                      googleIntegration.syncEnabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {googleIntegration.lastSyncError && (
                <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded text-sm text-red-600 dark:text-red-400">
                  Erreur: {googleIntegration.lastSyncError}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Microsoft Outlook */}
        <div className="border rounded-lg p-4 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-lg shadow flex items-center justify-center">
                <svg className="w-6 h-6" viewBox="0 0 24 24">
                  <path fill="#0078D4" d="M21.17 2.06A2.58 2.58 0 0 0 18.86 1H8.14a2.58 2.58 0 0 0-2.31 1.06 2.48 2.48 0 0 0-.4 1.9L7.04 9.5l-5.85 4.8a1.4 1.4 0 0 0 .9 2.5h19.82a1.4 1.4 0 0 0 .9-2.5l-5.85-4.8 1.61-5.54a2.48 2.48 0 0 0-.4-1.9z"/>
                  <path fill="#0364B8" d="M22.81 14.3l-5.85-4.8-3.96 4.8-3.96-4.8-5.85 4.8a1.4 1.4 0 0 0 .9 2.5h17.82a1.4 1.4 0 0 0 .9-2.5z"/>
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">Microsoft Outlook</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {microsoftIntegration ? 'Connecté' : 'Non connecté'}
                </p>
              </div>
            </div>

            {microsoftIntegration ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => disconnect('microsoft')}
              >
                Déconnecter
              </Button>
            ) : (
              <Button
                variant="primary"
                size="sm"
                onClick={connectMicrosoft}
                isLoading={connectingProvider === 'microsoft'}
              >
                Connecter
              </Button>
            )}
          </div>

          {microsoftIntegration && (
            <div className="space-y-4 pt-4 border-t dark:border-gray-700">
              {/* Sélection calendrier */}
              {microsoftCalendars.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Calendrier cible
                  </label>
                  <select
                    value={microsoftIntegration.calendarId}
                    onChange={(e) => updateSettings('microsoft', { calendarId: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-600"
                  >
                    {microsoftCalendars.map((cal) => (
                      <option key={cal.id} value={cal.id}>
                        {cal.name} {cal.primary && '(Principal)'}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Toggle sync */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Synchronisation activée
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {microsoftIntegration.lastSyncAt
                      ? `Dernière sync: ${new Date(microsoftIntegration.lastSyncAt).toLocaleString()}`
                      : 'Jamais synchronisé'}
                  </p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={microsoftIntegration.syncEnabled}
                  onClick={() => updateSettings('microsoft', { syncEnabled: !microsoftIntegration.syncEnabled })}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
                    microsoftIntegration.syncEnabled ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow transition ${
                      microsoftIntegration.syncEnabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {microsoftIntegration.lastSyncError && (
                <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded text-sm text-red-600 dark:text-red-400">
                  Erreur: {microsoftIntegration.lastSyncError}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-1">
          Comment ça fonctionne ?
        </h4>
        <p className="text-sm text-blue-700 dark:text-blue-400">
          Une fois connecté, vos interventions seront automatiquement ajoutées à votre calendrier.
          Quand une intervention est modifiée ou supprimée, l'événement est mis à jour.
        </p>
      </div>
    </Card>
  );
}
