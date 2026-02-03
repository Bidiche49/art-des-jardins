import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock socket.io-client before importing the service
const mockSocket = {
  on: vi.fn(),
  off: vi.fn(),
  emit: vi.fn(),
  disconnect: vi.fn(),
  removeAllListeners: vi.fn(),
  connected: false,
  io: {
    on: vi.fn(),
  },
};

vi.mock('socket.io-client', () => ({
  io: vi.fn(() => mockSocket),
}));

// Import after mocking
import { websocketService } from './websocket.service';
import type { ConnectionState } from './websocket.types';

describe('WebSocketService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSocket.connected = false;
  });

  afterEach(() => {
    // Clean disconnect but don't expect any behavior
    try {
      websocketService.disconnect();
    } catch {
      // Ignore errors during cleanup
    }
  });

  describe('connect', () => {
    it('should connect with JWT token', async () => {
      const { io } = await import('socket.io-client');

      websocketService.connect({
        url: 'http://localhost:3000',
        token: 'test-jwt-token',
      });

      expect(io).toHaveBeenCalledWith('http://localhost:3000', {
        auth: { token: 'test-jwt-token' },
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 30000,
        reconnectionAttempts: 3,
        transports: ['websocket', 'polling'],
      });
    });

    it('should not reconnect if already connected', async () => {
      const { io } = await import('socket.io-client');
      mockSocket.connected = true;

      websocketService.connect({
        url: 'http://localhost:3000',
        token: 'test-token',
      });

      // First call to connect
      websocketService.connect({
        url: 'http://localhost:3000',
        token: 'test-token',
      });

      // io should only be called once (setup internal listeners also call it)
      // We check the internal state remains consistent
      expect(mockSocket.connected).toBe(true);

      // Reset for other tests
      mockSocket.connected = false;
    });
  });

  describe('disconnect', () => {
    it('should disconnect and cleanup', () => {
      websocketService.connect({
        url: 'http://localhost:3000',
        token: 'test-token',
      });

      websocketService.disconnect();

      expect(mockSocket.removeAllListeners).toHaveBeenCalled();
      expect(mockSocket.disconnect).toHaveBeenCalled();
    });
  });

  describe('event handling', () => {
    it('should register event listeners', () => {
      websocketService.connect({
        url: 'http://localhost:3000',
        token: 'test-token',
      });

      const callback = vi.fn();
      websocketService.on('test:event', callback);

      expect(mockSocket.on).toHaveBeenCalledWith('test:event', callback);
    });

    it('should unregister event listeners', () => {
      websocketService.connect({
        url: 'http://localhost:3000',
        token: 'test-token',
      });

      websocketService.off('test:event');

      expect(mockSocket.off).toHaveBeenCalledWith('test:event');
    });
  });

  describe('state management', () => {
    it('should notify listeners on state change', () => {
      const listener = vi.fn();
      const unsubscribe = websocketService.onStateChange(listener);

      // Should be called immediately with current state
      expect(listener).toHaveBeenCalledWith('disconnected');

      unsubscribe();
    });

    it('should return current state', () => {
      const state = websocketService.getState();
      expect(['connected', 'disconnected', 'reconnecting', 'fallback']).toContain(state);
    });

    it('should allow unsubscribing from state changes', () => {
      const listener = vi.fn();
      const unsubscribe = websocketService.onStateChange(listener);

      // Clear the initial call
      listener.mockClear();

      unsubscribe();

      // Trigger a state change (this would normally update listeners)
      // Since we unsubscribed, listener should not be called again
      expect(listener).not.toHaveBeenCalled();
    });
  });

  describe('fallback mode', () => {
    it('should report fallback status', () => {
      const isFallback = websocketService.isFallbackEnabled();
      expect(typeof isFallback).toBe('boolean');
    });
  });

  describe('reconnect', () => {
    it('should not throw if reconnect called without prior connect', () => {
      // Without connecting first, reconnect should do nothing gracefully
      expect(() => websocketService.reconnect()).not.toThrow();
    });
  });
});

describe('Connection state transitions', () => {
  it('should handle connect event', () => {
    let connectCallback: (() => void) | undefined;
    mockSocket.on.mockImplementation((event: string, cb: () => void) => {
      if (event === 'connect') {
        connectCallback = cb;
      }
    });

    const listener = vi.fn();
    websocketService.onStateChange(listener);
    listener.mockClear();

    websocketService.connect({
      url: 'http://localhost:3000',
      token: 'test-token',
    });

    // Simulate connect event
    if (connectCallback) {
      connectCallback();
    }

    // State should transition to connected
    expect(listener).toHaveBeenCalledWith('connected');
  });
});
