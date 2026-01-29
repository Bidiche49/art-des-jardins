import { useEffect, useRef } from 'react';
import { useNotificationsStore } from '@/stores/notifications';
import { useAuthStore } from '@/stores/auth';
import toast from 'react-hot-toast';

/**
 * Hook to request push notification permission on first login.
 * Should be used in the main authenticated layout or dashboard.
 */
export function usePushPermission() {
  const hasPrompted = useRef(false);
  const { isAuthenticated } = useAuthStore();
  const {
    permission,
    hasAskedPermission,
    checkSupport,
    checkPermission,
    requestPermission,
    subscribe,
    setHasAskedPermission,
  } = useNotificationsStore();

  useEffect(() => {
    checkSupport();
    checkPermission();
  }, [checkSupport, checkPermission]);

  useEffect(() => {
    if (
      !hasPrompted.current &&
      isAuthenticated &&
      !hasAskedPermission &&
      permission === 'default'
    ) {
      hasPrompted.current = true;

      const promptUser = async () => {
        await new Promise((resolve) => setTimeout(resolve, 2000));

        const userWantsNotifications = await new Promise<boolean>((resolve) => {
          toast(
            (t) => (
              <div className="flex flex-col gap-2">
                <span className="font-medium">Activer les notifications ?</span>
                <span className="text-sm text-gray-600">
                  Recevez des rappels pour vos interventions
                </span>
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => {
                      toast.dismiss(t.id);
                      resolve(true);
                    }}
                    className="px-3 py-1 bg-primary-600 text-white rounded text-sm hover:bg-primary-700"
                  >
                    Activer
                  </button>
                  <button
                    onClick={() => {
                      toast.dismiss(t.id);
                      resolve(false);
                    }}
                    className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm hover:bg-gray-300"
                  >
                    Plus tard
                  </button>
                </div>
              </div>
            ),
            {
              duration: 15000,
              position: 'top-center',
              style: {
                background: '#fff',
                color: '#333',
                padding: '16px',
                maxWidth: '350px',
              },
            }
          );
        });

        if (userWantsNotifications) {
          const perm = await requestPermission();
          if (perm === 'granted') {
            const success = await subscribe();
            if (success) {
              toast.success('Notifications activees');
            }
          } else if (perm === 'denied') {
            toast.error('Notifications bloquees par le navigateur');
          }
        } else {
          setHasAskedPermission();
        }
      };

      promptUser();
    }
  }, [
    isAuthenticated,
    hasAskedPermission,
    permission,
    requestPermission,
    subscribe,
    setHasAskedPermission,
  ]);
}
