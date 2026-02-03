import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ModalType =
  | 'client-form'
  | 'chantier-form'
  | 'intervention-form'
  | 'devis-preview'
  | 'facture-preview'
  | 'confirm-delete'
  | 'send-email'
  | 'payment'
  | null;

interface ModalData {
  entityId?: string;
  entityType?: string;
  title?: string;
  message?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  [key: string]: unknown;
}

interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}

export interface TerrainModeSettings {
  enabled: boolean;
  autoDetect: boolean;
  hapticFeedback: boolean;
  highContrast: boolean;
}

interface UIState {
  sidebarOpen: boolean;
  activeModal: ModalType;
  modalData: ModalData | null;
  notifications: Notification[];
  isOnline: boolean;
  pendingSyncCount: number;
  theme: 'light' | 'dark' | 'system';
  terrainMode: TerrainModeSettings;

  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  openModal: (modal: ModalType, data?: ModalData) => void;
  closeModal: () => void;
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  removeNotification: (id: string) => void;
  setOnline: (online: boolean) => void;
  setPendingSyncCount: (count: number) => void;
  incrementPendingSync: () => void;
  decrementPendingSync: () => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  setTerrainMode: (settings: Partial<TerrainModeSettings>) => void;
  toggleTerrainMode: () => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      sidebarOpen: false,
      activeModal: null,
      modalData: null,
      notifications: [],
      isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
      pendingSyncCount: 0,
      theme: 'system',
      terrainMode: {
        enabled: false,
        autoDetect: false,
        hapticFeedback: true,
        highContrast: false,
      },

      toggleSidebar: () => {
        set((state) => ({ sidebarOpen: !state.sidebarOpen }));
      },

      setSidebarOpen: (open: boolean) => {
        set({ sidebarOpen: open });
      },

      openModal: (modal: ModalType, data?: ModalData) => {
        set({ activeModal: modal, modalData: data || null });
      },

      closeModal: () => {
        set({ activeModal: null, modalData: null });
      },

      addNotification: (notification: Omit<Notification, 'id'>) => {
        const id = Date.now().toString();
        set((state) => ({
          notifications: [...state.notifications, { ...notification, id }],
        }));

        if (notification.duration !== 0) {
          setTimeout(() => {
            set((state) => ({
              notifications: state.notifications.filter((n) => n.id !== id),
            }));
          }, notification.duration || 5000);
        }
      },

      removeNotification: (id: string) => {
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        }));
      },

      setOnline: (online: boolean) => {
        set({ isOnline: online });
      },

      setPendingSyncCount: (count: number) => {
        set({ pendingSyncCount: count });
      },

      incrementPendingSync: () => {
        set((state) => ({ pendingSyncCount: state.pendingSyncCount + 1 }));
      },

      decrementPendingSync: () => {
        set((state) => ({
          pendingSyncCount: Math.max(0, state.pendingSyncCount - 1),
        }));
      },

      setTheme: (theme: 'light' | 'dark' | 'system') => {
        set({ theme });
      },

      setTerrainMode: (settings: Partial<TerrainModeSettings>) => {
        set((state) => ({
          terrainMode: { ...state.terrainMode, ...settings },
        }));
      },

      toggleTerrainMode: () => {
        set((state) => ({
          terrainMode: { ...state.terrainMode, enabled: !state.terrainMode.enabled },
        }));
      },
    }),
    {
      name: 'ui-storage',
      partialize: (state) => ({
        theme: state.theme,
        sidebarOpen: state.sidebarOpen,
        terrainMode: state.terrainMode,
      }),
    }
  )
);

if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    useUIStore.getState().setOnline(true);
  });
  window.addEventListener('offline', () => {
    useUIStore.getState().setOnline(false);
  });
}
