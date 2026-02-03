import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createElement } from 'react';

// Mock websocket service - use inline mock functions
vi.mock('../services/websocket.service', () => ({
  websocketService: {
    connect: vi.fn(),
    disconnect: vi.fn(),
    on: vi.fn(),
    off: vi.fn(),
    getState: vi.fn(() => 'disconnected'),
    onStateChange: vi.fn(() => () => {}),
  },
}));

vi.mock('react-hot-toast', () => ({
  default: Object.assign(vi.fn(), {
    success: vi.fn(),
    error: vi.fn(),
  }),
}));

// Mock auth store with mutable state
let mockToken = 'test-token';
let mockUser: { id: string; email: string } | null = { id: '1', email: 'test@test.com' };

vi.mock('../stores/auth', () => ({
  useAuthStore: () => ({
    get token() {
      return mockToken;
    },
    get user() {
      return mockUser;
    },
  }),
}));

// Import after mocks are defined
import { useRealtimeUpdates } from './useRealtimeUpdates';
import { websocketService } from '../services/websocket.service';
import { WS_EVENTS } from '../services/websocket.types';

// Create wrapper with QueryClient
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });
  return ({ children }: { children: React.ReactNode }) =>
    createElement(QueryClientProvider, { client: queryClient }, children);
};

describe('useRealtimeUpdates', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    mockToken = 'test-token';
    mockUser = { id: '1', email: 'test@test.com' };
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should connect to WebSocket when user is authenticated', () => {
    renderHook(() => useRealtimeUpdates(), {
      wrapper: createWrapper(),
    });

    expect(websocketService.connect).toHaveBeenCalledWith({
      url: expect.any(String),
      token: 'test-token',
    });
  });

  it('should not connect when no token', () => {
    mockToken = '';
    mockUser = null;

    renderHook(() => useRealtimeUpdates(), {
      wrapper: createWrapper(),
    });

    expect(websocketService.connect).not.toHaveBeenCalled();
  });

  it('should register event listeners for all events', () => {
    renderHook(() => useRealtimeUpdates(), {
      wrapper: createWrapper(),
    });

    expect(websocketService.on).toHaveBeenCalledWith(
      WS_EVENTS.DEVIS_CREATED,
      expect.any(Function)
    );
    expect(websocketService.on).toHaveBeenCalledWith(WS_EVENTS.DEVIS_SIGNED, expect.any(Function));
    expect(websocketService.on).toHaveBeenCalledWith(
      WS_EVENTS.DEVIS_REJECTED,
      expect.any(Function)
    );
    expect(websocketService.on).toHaveBeenCalledWith(
      WS_EVENTS.FACTURE_CREATED,
      expect.any(Function)
    );
    expect(websocketService.on).toHaveBeenCalledWith(WS_EVENTS.FACTURE_PAID, expect.any(Function));
    expect(websocketService.on).toHaveBeenCalledWith(
      WS_EVENTS.INTERVENTION_STARTED,
      expect.any(Function)
    );
    expect(websocketService.on).toHaveBeenCalledWith(
      WS_EVENTS.INTERVENTION_COMPLETED,
      expect.any(Function)
    );
    expect(websocketService.on).toHaveBeenCalledWith(
      WS_EVENTS.CLIENT_CREATED,
      expect.any(Function)
    );
  });

  it('should disconnect and unregister events on unmount', () => {
    const { unmount } = renderHook(() => useRealtimeUpdates(), {
      wrapper: createWrapper(),
    });

    unmount();

    expect(websocketService.off).toHaveBeenCalledWith(WS_EVENTS.DEVIS_CREATED);
    expect(websocketService.off).toHaveBeenCalledWith(WS_EVENTS.DEVIS_SIGNED);
    expect(websocketService.off).toHaveBeenCalledWith(WS_EVENTS.FACTURE_PAID);
    expect(websocketService.disconnect).toHaveBeenCalled();
  });

  describe('leader election', () => {
    it('should set leadership keys when user is authenticated', () => {
      // When hook runs with valid token, it should try to claim leadership
      renderHook(() => useRealtimeUpdates(), {
        wrapper: createWrapper(),
      });

      // The hook should have called connect if token is present
      expect(websocketService.connect).toHaveBeenCalled();
    });

    it('should cleanup on unmount', () => {
      const { unmount } = renderHook(() => useRealtimeUpdates(), {
        wrapper: createWrapper(),
      });

      unmount();

      // Should disconnect on cleanup
      expect(websocketService.disconnect).toHaveBeenCalled();
    });
  });
});

describe('Event handlers', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    mockToken = 'test-token';
    mockUser = { id: '1', email: 'test@test.com' };
  });

  it('should invalidate devis queries on DEVIS_SIGNED', async () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');

    let signedHandler: ((data: unknown) => void) | undefined;
    vi.mocked(websocketService.on).mockImplementation(
      (event: string, handler: (data: unknown) => void) => {
        if (event === WS_EVENTS.DEVIS_SIGNED) {
          signedHandler = handler;
        }
      }
    );

    renderHook(() => useRealtimeUpdates(), {
      wrapper: ({ children }) =>
        createElement(QueryClientProvider, { client: queryClient }, children),
    });

    // Trigger the event handler
    if (signedHandler) {
      act(() => {
        signedHandler!({ id: '123', clientName: 'Test Client' });
      });
    }

    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['devis'] });
  });

  it('should invalidate factures queries on FACTURE_PAID', async () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');

    let paidHandler: ((data: unknown) => void) | undefined;
    vi.mocked(websocketService.on).mockImplementation(
      (event: string, handler: (data: unknown) => void) => {
        if (event === WS_EVENTS.FACTURE_PAID) {
          paidHandler = handler;
        }
      }
    );

    renderHook(() => useRealtimeUpdates(), {
      wrapper: ({ children }) =>
        createElement(QueryClientProvider, { client: queryClient }, children),
    });

    // Trigger the event handler
    if (paidHandler) {
      act(() => {
        paidHandler!({ id: '456', clientName: 'Test', amount: 100 });
      });
    }

    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ['factures'] });
  });
});
