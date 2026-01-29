import { useEffect, useState } from 'react';
import { useNotificationsStore } from '@/stores/notifications';
import notificationsApi from '@/api/notifications';
import toast from 'react-hot-toast';

interface NotificationToggleProps {
  compact?: boolean;
}

export function NotificationToggle({ compact = false }: NotificationToggleProps) {
  const {
    permission,
    isSubscribed,
    isLoading,
    checkSupport,
    checkPermission,
    requestPermission,
    subscribe,
    unsubscribe,
    checkSubscriptionStatus,
  } = useNotificationsStore();

  const [isTestLoading, setIsTestLoading] = useState(false);

  useEffect(() => {
    checkSupport();
    checkPermission();
    if (permission === 'granted') {
      checkSubscriptionStatus();
    }
  }, [checkSupport, checkPermission, checkSubscriptionStatus, permission]);

  const handleToggle = async () => {
    if (isLoading) return;

    if (isSubscribed) {
      const success = await unsubscribe();
      if (success) {
        toast.success('Notifications desactivees');
      } else {
        toast.error('Erreur lors de la desactivation');
      }
    } else {
      if (permission === 'default') {
        const newPermission = await requestPermission();
        if (newPermission !== 'granted') {
          toast.error('Permission refusee');
          return;
        }
      }

      if (permission === 'denied') {
        toast.error('Notifications bloquees. Verifiez les parametres du navigateur.');
        return;
      }

      const success = await subscribe();
      if (success) {
        toast.success('Notifications activees');
      } else {
        toast.error('Erreur lors de l\'activation');
      }
    }
  };

  const handleTestNotification = async () => {
    if (!isSubscribed || isTestLoading) return;

    setIsTestLoading(true);
    try {
      await notificationsApi.sendTest();
      toast.success('Notification de test envoyee');
    } catch {
      toast.error('Erreur lors de l\'envoi');
    } finally {
      setIsTestLoading(false);
    }
  };

  if (permission === 'unsupported') {
    if (compact) return null;
    return (
      <div className="text-sm text-gray-500">
        Notifications non supportees sur ce navigateur
      </div>
    );
  }

  if (compact) {
    return (
      <button
        onClick={handleToggle}
        disabled={isLoading || permission === 'denied'}
        className={`p-2 rounded-full transition-colors ${
          isSubscribed
            ? 'text-primary-100 hover:text-white'
            : 'text-primary-300 hover:text-primary-100'
        } ${isLoading ? 'opacity-50 cursor-wait' : ''} ${
          permission === 'denied' ? 'opacity-30 cursor-not-allowed' : ''
        }`}
        title={
          permission === 'denied'
            ? 'Notifications bloquees'
            : isSubscribed
            ? 'Notifications activees'
            : 'Activer les notifications'
        }
      >
        {isLoading ? (
          <span className="inline-block w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : isSubscribed ? (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
        )}
      </button>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-medium text-gray-900">Notifications push</h3>
          <p className="text-sm text-gray-500">
            {permission === 'denied'
              ? 'Bloquees - verifiez les parametres du navigateur'
              : isSubscribed
              ? 'Vous recevez les notifications'
              : 'Recevez des alertes pour vos interventions'}
          </p>
        </div>
        <button
          onClick={handleToggle}
          disabled={isLoading || permission === 'denied'}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            isSubscribed ? 'bg-primary-600' : 'bg-gray-200'
          } ${isLoading ? 'opacity-50 cursor-wait' : ''} ${
            permission === 'denied' ? 'opacity-30 cursor-not-allowed' : ''
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              isSubscribed ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>

      {isSubscribed && (
        <button
          onClick={handleTestNotification}
          disabled={isTestLoading}
          className="text-sm text-primary-600 hover:text-primary-700 disabled:opacity-50"
        >
          {isTestLoading ? 'Envoi en cours...' : 'Envoyer une notification de test'}
        </button>
      )}
    </div>
  );
}
