import { io, Socket } from 'socket.io-client';
import type { ConnectionState, WebSocketConfig, StateChangeCallback } from './websocket.types';

/**
 * WebSocket service for real-time updates
 * Singleton pattern with reconnection and fallback support
 */
class WebSocketService {
  private socket: Socket | null = null;
  private state: ConnectionState = 'disconnected';
  private stateListeners: Set<StateChangeCallback> = new Set();
  private eventListeners: Map<string, Set<(data: unknown) => void>> = new Map();
  private fallbackPollingEnabled = false;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 3;
  private config: WebSocketConfig | null = null;

  /**
   * Connect to WebSocket server with JWT authentication
   */
  connect(config: WebSocketConfig): void {
    if (this.socket?.connected) {
      return;
    }

    this.config = config;
    this.reconnectAttempts = 0;
    this.fallbackPollingEnabled = false;

    this.socket = io(config.url, {
      auth: { token: config.token },
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 30000,
      reconnectionAttempts: this.maxReconnectAttempts,
      transports: ['websocket', 'polling'],
    });

    this.setupListeners();
  }

  /**
   * Disconnect from WebSocket server
   */
  disconnect(): void {
    if (this.socket) {
      this.socket.removeAllListeners();
      this.socket.disconnect();
      this.socket = null;
    }
    this.setState('disconnected');
    this.config = null;
  }

  /**
   * Subscribe to a WebSocket event
   */
  on<T>(event: string, callback: (data: T) => void): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, new Set());
    }
    this.eventListeners.get(event)!.add(callback as (data: unknown) => void);

    // If socket is connected, add listener directly
    if (this.socket) {
      this.socket.on(event, callback);
    }
  }

  /**
   * Unsubscribe from a WebSocket event
   */
  off(event: string, callback?: (data: unknown) => void): void {
    if (callback) {
      this.eventListeners.get(event)?.delete(callback);
      this.socket?.off(event, callback);
    } else {
      this.eventListeners.delete(event);
      this.socket?.off(event);
    }
  }

  /**
   * Get current connection state
   */
  getState(): ConnectionState {
    return this.state;
  }

  /**
   * Subscribe to connection state changes
   */
  onStateChange(callback: StateChangeCallback): () => void {
    this.stateListeners.add(callback);
    // Immediately notify of current state
    callback(this.state);

    // Return unsubscribe function
    return () => {
      this.stateListeners.delete(callback);
    };
  }

  /**
   * Check if fallback polling is enabled
   */
  isFallbackEnabled(): boolean {
    return this.fallbackPollingEnabled;
  }

  /**
   * Manually reconnect
   */
  reconnect(): void {
    if (this.config) {
      this.disconnect();
      this.connect(this.config);
    }
  }

  private setupListeners(): void {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      this.reconnectAttempts = 0;
      this.fallbackPollingEnabled = false;
      this.setState('connected');
      this.reattachEventListeners();
    });

    this.socket.on('disconnect', (reason) => {
      if (reason === 'io server disconnect') {
        // Server disconnected us, don't auto-reconnect
        this.setState('disconnected');
      } else {
        // Client-side disconnect, will auto-reconnect
        this.setState('reconnecting');
      }
    });

    this.socket.on('connect_error', () => {
      this.reconnectAttempts++;
      this.setState('reconnecting');
    });

    this.socket.io.on('reconnect_attempt', () => {
      this.setState('reconnecting');
    });

    this.socket.io.on('reconnect_failed', () => {
      this.enableFallbackPolling();
    });

    this.socket.io.on('reconnect', () => {
      this.reconnectAttempts = 0;
      this.fallbackPollingEnabled = false;
      this.setState('connected');
    });
  }

  private reattachEventListeners(): void {
    if (!this.socket) return;

    // Reattach all event listeners after reconnection
    this.eventListeners.forEach((listeners, event) => {
      listeners.forEach((callback) => {
        this.socket!.on(event, callback);
      });
    });
  }

  private setState(newState: ConnectionState): void {
    if (this.state !== newState) {
      this.state = newState;
      this.stateListeners.forEach((listener) => listener(newState));
    }
  }

  private enableFallbackPolling(): void {
    this.fallbackPollingEnabled = true;
    this.setState('fallback');
  }
}

export const websocketService = new WebSocketService();
