import { create } from 'zustand';
import inAppNotificationsApi, {
  InAppNotification,
  NotificationType,
  NotificationCountResponse,
} from '@/api/inAppNotifications';

interface InAppNotificationsState {
  notifications: InAppNotification[];
  total: number;
  hasMore: boolean;
  unreadCount: number;
  unreadByType: NotificationCountResponse['byType'];
  isLoading: boolean;
  isLoadingMore: boolean;
  error: string | null;
  lastFetched: number | null;

  // Actions
  fetchNotifications: (options?: {
    refresh?: boolean;
    unreadOnly?: boolean;
    type?: NotificationType;
  }) => Promise<void>;
  loadMore: () => Promise<void>;
  fetchUnreadCount: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  reset: () => void;
}

const POLL_INTERVAL = 60000; // 1 minute

export const useInAppNotificationsStore = create<InAppNotificationsState>((set, get) => ({
  notifications: [],
  total: 0,
  hasMore: false,
  unreadCount: 0,
  unreadByType: {
    info: 0,
    warning: 0,
    success: 0,
    action_required: 0,
  },
  isLoading: false,
  isLoadingMore: false,
  error: null,
  lastFetched: null,

  fetchNotifications: async (options = {}) => {
    const { refresh = false } = options;

    // Avoid refetching if we already have data and it's fresh
    const { lastFetched, isLoading } = get();
    if (!refresh && lastFetched && Date.now() - lastFetched < POLL_INTERVAL && !isLoading) {
      return;
    }

    set({ isLoading: true, error: null });

    try {
      const [response, countResponse] = await Promise.all([
        inAppNotificationsApi.getNotifications({
          limit: 20,
          unreadOnly: options.unreadOnly,
          type: options.type,
        }),
        inAppNotificationsApi.getUnreadCount(),
      ]);

      set({
        notifications: response.notifications,
        total: response.total,
        hasMore: response.hasMore,
        unreadCount: countResponse.unread,
        unreadByType: countResponse.byType,
        isLoading: false,
        lastFetched: Date.now(),
      });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch notifications',
      });
    }
  },

  loadMore: async () => {
    const { notifications, hasMore, isLoadingMore } = get();
    if (!hasMore || isLoadingMore) return;

    set({ isLoadingMore: true });

    try {
      const response = await inAppNotificationsApi.getNotifications({
        limit: 20,
        offset: notifications.length,
      });

      set({
        notifications: [...notifications, ...response.notifications],
        total: response.total,
        hasMore: response.hasMore,
        isLoadingMore: false,
      });
    } catch (error) {
      set({ isLoadingMore: false });
    }
  },

  fetchUnreadCount: async () => {
    try {
      const response = await inAppNotificationsApi.getUnreadCount();
      set({
        unreadCount: response.unread,
        unreadByType: response.byType,
      });
    } catch {
      // Silently fail for count refresh
    }
  },

  markAsRead: async (id: string) => {
    const { notifications, unreadCount } = get();

    // Optimistic update
    const notification = notifications.find((n) => n.id === id);
    if (!notification || notification.readAt) return;

    set({
      notifications: notifications.map((n) =>
        n.id === id ? { ...n, readAt: new Date().toISOString() } : n
      ),
      unreadCount: Math.max(0, unreadCount - 1),
    });

    try {
      await inAppNotificationsApi.markAsRead(id);
      // Refresh count after marking as read
      get().fetchUnreadCount();
    } catch {
      // Revert on error
      set({
        notifications,
        unreadCount,
      });
    }
  },

  markAllAsRead: async () => {
    const { notifications, unreadCount } = get();

    // Optimistic update
    const now = new Date().toISOString();
    set({
      notifications: notifications.map((n) => ({
        ...n,
        readAt: n.readAt || now,
      })),
      unreadCount: 0,
      unreadByType: {
        info: 0,
        warning: 0,
        success: 0,
        action_required: 0,
      },
    });

    try {
      await inAppNotificationsApi.markAllAsRead();
    } catch {
      // Revert on error
      set({ notifications, unreadCount });
      get().fetchUnreadCount();
    }
  },

  reset: () => {
    set({
      notifications: [],
      total: 0,
      hasMore: false,
      unreadCount: 0,
      unreadByType: {
        info: 0,
        warning: 0,
        success: 0,
        action_required: 0,
      },
      isLoading: false,
      isLoadingMore: false,
      error: null,
      lastFetched: null,
    });
  },
}));
