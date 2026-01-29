import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import notificationsApi from '@/api/notifications';

type PermissionState = 'default' | 'granted' | 'denied' | 'unsupported';

interface NotificationsState {
  permission: PermissionState;
  isSubscribed: boolean;
  isLoading: boolean;
  subscription: PushSubscription | null;
  hasAskedPermission: boolean;

  // Actions
  checkSupport: () => void;
  checkPermission: () => void;
  requestPermission: () => Promise<NotificationPermission>;
  subscribe: () => Promise<boolean>;
  unsubscribe: () => Promise<boolean>;
  checkSubscriptionStatus: () => Promise<void>;
  setHasAskedPermission: () => void;
}

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export const useNotificationsStore = create<NotificationsState>()(
  persist(
    (set, get) => ({
      permission: 'default',
      isSubscribed: false,
      isLoading: false,
      subscription: null,
      hasAskedPermission: false,

      checkSupport: () => {
        if (!('Notification' in window) || !('serviceWorker' in navigator) || !('PushManager' in window)) {
          set({ permission: 'unsupported' });
        }
      },

      checkPermission: () => {
        if (!('Notification' in window)) {
          set({ permission: 'unsupported' });
          return;
        }
        set({ permission: Notification.permission as PermissionState });
      },

      requestPermission: async () => {
        if (!('Notification' in window)) {
          return 'denied';
        }

        const permission = await Notification.requestPermission();
        set({ permission: permission as PermissionState, hasAskedPermission: true });
        return permission;
      },

      subscribe: async () => {
        const { permission } = get();
        if (permission !== 'granted') {
          return false;
        }

        set({ isLoading: true });

        try {
          const registration = await navigator.serviceWorker.ready;
          const vapidPublicKey = await notificationsApi.getVapidPublicKey();

          const subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(vapidPublicKey).buffer as ArrayBuffer,
          });

          await notificationsApi.subscribe(subscription);

          set({
            isSubscribed: true,
            subscription,
            isLoading: false,
          });

          return true;
        } catch (error) {
          console.error('Failed to subscribe:', error);
          set({ isLoading: false });
          return false;
        }
      },

      unsubscribe: async () => {
        const { subscription } = get();
        set({ isLoading: true });

        try {
          if (subscription) {
            await notificationsApi.unsubscribe(subscription.endpoint);
            await subscription.unsubscribe();
          }

          set({
            isSubscribed: false,
            subscription: null,
            isLoading: false,
          });

          return true;
        } catch (error) {
          console.error('Failed to unsubscribe:', error);
          set({ isLoading: false });
          return false;
        }
      },

      checkSubscriptionStatus: async () => {
        try {
          const registration = await navigator.serviceWorker.ready;
          const subscription = await registration.pushManager.getSubscription();

          if (subscription) {
            const status = await notificationsApi.getStatus();
            set({
              isSubscribed: status.subscribed,
              subscription: status.subscribed ? subscription : null,
            });

            if (!status.subscribed && subscription) {
              await subscription.unsubscribe();
              set({ subscription: null });
            }
          } else {
            set({ isSubscribed: false, subscription: null });
          }
        } catch (error) {
          console.error('Failed to check subscription status:', error);
        }
      },

      setHasAskedPermission: () => {
        set({ hasAskedPermission: true });
      },
    }),
    {
      name: 'notifications-storage',
      partialize: (state) => ({
        hasAskedPermission: state.hasAskedPermission,
        isSubscribed: state.isSubscribed,
      }),
    }
  )
);
