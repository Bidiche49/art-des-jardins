import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useNotificationsStore } from './notifications';

// Mock the API
vi.mock('@/api/notifications', () => ({
  default: {
    getVapidPublicKey: vi.fn(),
    subscribe: vi.fn(),
    unsubscribe: vi.fn(),
    getStatus: vi.fn(),
    sendTest: vi.fn(),
  },
}));

describe('NotificationsStore', () => {
  beforeEach(() => {
    // Reset store state
    useNotificationsStore.setState({
      permission: 'default',
      isSubscribed: false,
      isLoading: false,
      subscription: null,
      hasAskedPermission: false,
    });
    vi.clearAllMocks();
  });

  describe('initial state', () => {
    it('should have default values', () => {
      const state = useNotificationsStore.getState();

      expect(state.permission).toBe('default');
      expect(state.isSubscribed).toBe(false);
      expect(state.isLoading).toBe(false);
      expect(state.subscription).toBeNull();
      expect(state.hasAskedPermission).toBe(false);
    });
  });

  describe('checkSupport', () => {
    it('should set permission to unsupported when Notification API is not available', () => {
      const originalNotification = global.Notification;
      // @ts-expect-error - Testing without Notification API
      delete global.Notification;

      useNotificationsStore.getState().checkSupport();

      expect(useNotificationsStore.getState().permission).toBe('unsupported');

      global.Notification = originalNotification;
    });

    it('should keep default permission when all APIs are available', () => {
      // Mock all required APIs
      global.Notification = { permission: 'default' } as unknown as typeof Notification;
      global.navigator.serviceWorker = {} as ServiceWorkerContainer;
      // @ts-expect-error - PushManager is read-only
      global.PushManager = {};

      useNotificationsStore.getState().checkSupport();

      expect(useNotificationsStore.getState().permission).toBe('default');
    });
  });

  describe('checkPermission', () => {
    it('should update permission from Notification API', () => {
      global.Notification = { permission: 'granted' } as unknown as typeof Notification;

      useNotificationsStore.getState().checkPermission();

      expect(useNotificationsStore.getState().permission).toBe('granted');
    });

    it('should set unsupported when Notification API is not available', () => {
      const originalNotification = global.Notification;
      // @ts-expect-error - Testing without Notification API
      delete global.Notification;

      useNotificationsStore.getState().checkPermission();

      expect(useNotificationsStore.getState().permission).toBe('unsupported');

      global.Notification = originalNotification;
    });
  });

  describe('setHasAskedPermission', () => {
    it('should set hasAskedPermission to true', () => {
      expect(useNotificationsStore.getState().hasAskedPermission).toBe(false);

      useNotificationsStore.getState().setHasAskedPermission();

      expect(useNotificationsStore.getState().hasAskedPermission).toBe(true);
    });
  });

  describe('requestPermission', () => {
    it('should return denied when Notification API is not available', async () => {
      const originalNotification = global.Notification;
      // @ts-expect-error - Testing without Notification API
      delete global.Notification;

      const result = await useNotificationsStore.getState().requestPermission();

      expect(result).toBe('denied');

      global.Notification = originalNotification;
    });

    it('should request permission and update state', async () => {
      global.Notification = {
        permission: 'default',
        requestPermission: vi.fn().mockResolvedValue('granted'),
      } as unknown as typeof Notification;

      const result = await useNotificationsStore.getState().requestPermission();

      expect(result).toBe('granted');
      expect(useNotificationsStore.getState().permission).toBe('granted');
      expect(useNotificationsStore.getState().hasAskedPermission).toBe(true);
    });
  });

  describe('subscribe', () => {
    it('should return false when permission is not granted', async () => {
      useNotificationsStore.setState({ permission: 'default' });

      const result = await useNotificationsStore.getState().subscribe();

      expect(result).toBe(false);
    });

    it('should return false when permission is denied', async () => {
      useNotificationsStore.setState({ permission: 'denied' });

      const result = await useNotificationsStore.getState().subscribe();

      expect(result).toBe(false);
    });
  });

  describe('unsubscribe', () => {
    it('should unsubscribe and clear state', async () => {
      const mockUnsubscribe = vi.fn().mockResolvedValue(true);
      const mockSubscription = {
        endpoint: 'https://test.endpoint',
        unsubscribe: mockUnsubscribe,
      } as unknown as PushSubscription;

      useNotificationsStore.setState({
        isSubscribed: true,
        subscription: mockSubscription,
      });

      const notificationsApi = await import('@/api/notifications');
      vi.mocked(notificationsApi.default.unsubscribe).mockResolvedValue();

      const result = await useNotificationsStore.getState().unsubscribe();

      expect(result).toBe(true);
      expect(useNotificationsStore.getState().isSubscribed).toBe(false);
      expect(useNotificationsStore.getState().subscription).toBeNull();
    });
  });
});
